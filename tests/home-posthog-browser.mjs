import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { after, before, test } from 'node:test'
import { chromium } from 'playwright'
import { servir } from '../commun/servir.mjs'

const sortie = path.resolve('sortie')
const hubspot = 'https://meetings.hubspot.com/anaelle-guez/rendez-vous'
const captures = process.env.HOME_POSTHOG_SCREENSHOTS === '1'
const dossierCaptures = '/private/tmp/cleo-home-test'

const langues = [
  {
    code: 'fr',
    route: '/fr',
    service: '/fr/platform/compliance-service',
    data: '/fr/data',
    texteService: 'Voir les prestations et les prix',
    texteData: 'Explorer la Data API',
    texteHubspot: 'Voir une démo',
  },
  {
    code: 'en',
    route: '/en',
    service: '/en/platform/compliance-service',
    data: '/en/data',
    texteService: 'See the services and prices',
    texteData: 'Explore the Data API',
    texteHubspot: 'Book a demo',
  },
]

const viewports = [
  { nom: '1440x900', width: 1440, height: 900, mobile: false },
  { nom: '390x844', width: 390, height: 844, mobile: true },
]

let navigateur
let serveur

before(async () => {
  assert.ok(fs.existsSync(path.join(sortie, 'vercel.json')), 'le build sortie/ doit exister avant le test navigateur')
  if (captures) fs.mkdirSync(dossierCaptures, { recursive: true })
  serveur = await servir(sortie)
  navigateur = await chromium.launch({ headless: true })
})

after(async () => {
  if (navigateur) await navigateur.close()
  if (serveur) serveur.fermer()
})

/* Cette fonction est volontairement autonome : Playwright la sérialise dans la
   page et les trois témoins négatifs rejouent exactement le même audit. */
function auditerAccueil(attendu) {
  const erreurs = []
  const texte = element => (element?.textContent || '').replace(/\s+/g, ' ').trim()
  const estVisible = element => {
    if (!element || !element.getClientRects().length) return false
    for (let courant = element; courant; courant = courant.parentElement) {
      const style = getComputedStyle(courant)
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false
    }
    return true
  }

  const hero = document.querySelector('.hp-hero')
  if (!hero) erreurs.push('hero-missing')

  const primaires = [...document.querySelectorAll('.hp-hero [data-home-primary]')]
  if (primaires.length === 0) erreurs.push('service-cta-missing')
  else if (primaires.length !== 1) erreurs.push('service-cta-count')

  const primaire = primaires[0]
  if (primaire) {
    if (texte(primaire) !== attendu.texteService) erreurs.push('service-cta-wrong-text')
    if (primaire.getAttribute('href') !== attendu.service) erreurs.push('service-cta-wrong-href')
    if (!estVisible(primaire)) erreurs.push('service-cta-hidden')
    if (window.scrollY !== 0) erreurs.push('page-scrolled')

    const boite = primaire.getBoundingClientRect()
    if (boite.x < 0 || boite.right > window.innerWidth) erreurs.push('service-cta-outside-x')
    if (boite.y < 0) erreurs.push('service-cta-above-viewport')
    if (boite.bottom > window.innerHeight) erreurs.push('service-cta-below-fold')
    if (boite.width < 120 || boite.height < 44) erreurs.push('service-cta-too-small')

    const centreX = boite.left + boite.width / 2
    const centreY = boite.top + boite.height / 2
    if (centreX >= 0 && centreX <= window.innerWidth && centreY >= 0 && centreY <= window.innerHeight) {
      const dessus = document.elementFromPoint(centreX, centreY)
      if (!dessus || (dessus !== primaire && !primaire.contains(dessus))) erreurs.push('service-cta-covered')
    }
  }

  const secondaires = [...document.querySelectorAll('.hp-hero [data-home-secondary]')]
  if (secondaires.length === 0) erreurs.push('data-link-missing')
  else if (secondaires.length !== 1) erreurs.push('data-link-count')

  const secondaire = secondaires[0]
  if (secondaire) {
    if (texte(secondaire) !== attendu.texteData) erreurs.push('data-link-wrong-text')
    if (secondaire.getAttribute('href') !== attendu.data) erreurs.push('data-link-wrong-href')
    if (!estVisible(secondaire)) erreurs.push('data-link-hidden')
    if (primaire && !(primaire.compareDocumentPosition(secondaire) & Node.DOCUMENT_POSITION_FOLLOWING)) {
      erreurs.push('data-link-wrong-order')
    }
  }

  if (hero?.querySelector('a[href*="meetings.hubspot.com"]')) erreurs.push('hero-hubspot-present')
  if (document.querySelectorAll('[data-home-service]').length !== 4) erreurs.push('service-count')
  return erreurs
}

async function intercepterExterne(contexte, requetesPosthog) {
  const origineLocale = new URL(serveur.url).origin
  await contexte.route('**/*', async route => {
    const requete = route.request()
    let url
    try {
      url = new URL(requete.url())
    } catch {
      return route.continue()
    }

    if (url.origin === origineLocale && url.pathname === '/_vercel/insights/script.js') {
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' })
    }
    if (url.origin === origineLocale) return route.continue()

    if (url.hostname === 'eu-assets.i.posthog.com' || url.hostname === 'eu.i.posthog.com') {
      requetesPosthog.push(requete.url())
      if (url.hostname === 'eu-assets.i.posthog.com') {
        return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' })
      }
      return route.fulfill({ status: 204, body: '' })
    }

    if (requete.resourceType() === 'script') {
      return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' })
    }
    if (requete.resourceType() === 'stylesheet') {
      return route.fulfill({ status: 200, contentType: 'text/css', body: '' })
    }
    if (requete.resourceType() === 'image') {
      return route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
      })
    }
    return route.fulfill({ status: 204, body: '' })
  })
}

async function creerContexte(viewport) {
  const contexte = await navigateur.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
    isMobile: viewport.mobile,
    hasTouch: viewport.mobile,
  })
  await contexte.addCookies([{ name: 'cleo_consentement', value: 'v1.a0.p0', url: serveur.url }])
  return contexte
}

async function attendrePremierEcran(page) {
  await page.evaluate(() => document.fonts.ready)
  await page.waitForLoadState('load')
  await page.waitForFunction(() => [...document.images]
    .filter(image => {
      const boite = image.getBoundingClientRect()
      return boite.width > 0 && boite.height > 0 && boite.right > 0 && boite.bottom > 0 && boite.left < innerWidth && boite.top < innerHeight
    })
    .every(image => image.complete), null, { timeout: 10_000 })
}

async function verifierImagesVisibles(page, etiquette) {
  const images = await page.evaluate(() => [...document.images]
    .map(image => {
      const boite = image.getBoundingClientRect()
      return {
        src: image.currentSrc || image.src,
        visible: boite.width > 0 && boite.height > 0 && boite.right > 0 && boite.bottom > 0 && boite.left < innerWidth && boite.top < innerHeight,
        complete: image.complete,
        naturalWidth: image.naturalWidth,
      }
    })
    .filter(image => image.visible))
  const cassees = images.filter(image => !image.complete || image.naturalWidth <= 0)
  assert.deepEqual(cassees, [], `${etiquette} : images visibles non chargées : ${JSON.stringify(cassees)}`)
}

async function verifierHubspot(page, langue, viewport) {
  const selecteur = viewport.mobile
    ? `#menu-mobile .mm-actions > a.btn[href="${hubspot}"]`
    : `.nav .nav-fin > a.btn[href="${hubspot}"]`

  if (viewport.mobile) {
    await page.locator('.nav-burger').click()
    await page.locator('#menu-mobile:not([hidden])').waitFor({ state: 'visible' })
  }

  const lien = page.locator(selecteur)
  assert.equal(await lien.count(), 1, `${langue.code}/${viewport.nom} : un seul CTA HubSpot dans la navigation attendue`)
  await lien.waitFor({ state: 'visible' })
  assert.equal((await lien.textContent()).replace(/\s+/g, ' ').trim(), langue.texteHubspot, `${langue.code}/${viewport.nom} : texte HubSpot`)
  assert.equal(await lien.getAttribute('href'), hubspot, `${langue.code}/${viewport.nom} : URL HubSpot`)

  if (viewport.mobile) {
    await lien.scrollIntoViewIfNeeded()
    if (captures) {
      await page.screenshot({
        path: path.join(dossierCaptures, `${langue.code}-${viewport.nom}-menu-hubspot.png`),
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
        fullPage: false,
      })
    }
    await page.locator('.nav-burger').click()
    await page.locator('#menu-mobile[hidden]').waitFor({ state: 'attached' })
  }
}

for (const langue of langues) {
  for (const viewport of viewports) {
    test(`${langue.code.toUpperCase()} ${viewport.nom} — accueil PostHog`, { concurrency: false }, async () => {
      const contexte = await creerContexte(viewport)
      const requetesPosthog = []
      const erreursPage = []
      const erreursConsole = []
      const echecsLocaux = []
      const reponsesLocalesEnErreur = []
      const origineLocale = new URL(serveur.url).origin
      const etiquette = `${langue.code}/${viewport.nom}`

      try {
        await intercepterExterne(contexte, requetesPosthog)
        const page = await contexte.newPage()
        page.on('pageerror', erreur => erreursPage.push(`${erreur.name}: ${erreur.message}`))
        page.on('console', message => {
          if (message.type() === 'error' || message.type() === 'warning') {
            erreursConsole.push(`${message.type()}: ${message.text()} [${langue.route}]`)
          }
        })
        page.on('requestfailed', requete => {
          if (new URL(requete.url()).origin === origineLocale) {
            echecsLocaux.push(`${requete.url()} — ${requete.failure()?.errorText || 'échec inconnu'}`)
          }
        })
        page.on('response', reponse => {
          if (new URL(reponse.url()).origin === origineLocale && reponse.status() >= 400) {
            reponsesLocalesEnErreur.push(`${reponse.status()} ${reponse.url()}`)
          }
        })

        await page.goto(new URL(langue.route, serveur.url).href, { waitUntil: 'domcontentloaded' })
        await attendrePremierEcran(page)
        assert.equal(await page.evaluate(() => scrollY), 0, `${etiquette} : la page doit commencer sans scroll`)

        await verifierHubspot(page, langue, viewport)
        assert.deepEqual(await page.evaluate(auditerAccueil, langue), [], `${etiquette} : contrat DOM du hero`)

        const overflow = await page.evaluate(() => ({
          innerWidth,
          root: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
          coupables: [...document.querySelectorAll('body *')]
            .map(element => {
              const boite = element.getBoundingClientRect()
              return {
                selector: element.id ? `#${element.id}` : element.classList.length ? `${element.tagName.toLowerCase()}.${[...element.classList].join('.')}` : element.tagName.toLowerCase(),
                left: boite.left,
                right: boite.right,
              }
            })
            .filter(element => element.left < -1 || element.right > innerWidth + 1)
            .slice(0, 20),
        }))
        assert.ok(overflow.root <= overflow.innerWidth + 1, `${etiquette} : overflow racine ${JSON.stringify(overflow)}`)
        assert.ok(overflow.body <= overflow.innerWidth + 1, `${etiquette} : overflow body ${JSON.stringify(overflow)}`)
        await verifierImagesVisibles(page, etiquette)

        if (captures) {
          await page.screenshot({
            path: path.join(dossierCaptures, `${langue.code}-${viewport.nom}-fold.png`),
            animations: 'disabled',
            caret: 'hide',
            scale: 'css',
            fullPage: false,
          })
        }

        const [reponseService] = await Promise.all([
          page.waitForResponse(reponse => {
            const url = new URL(reponse.url())
            return url.origin === origineLocale && url.pathname === langue.service && reponse.request().resourceType() === 'document'
          }),
          page.waitForURL(url => url.origin === origineLocale && url.pathname === langue.service),
          page.locator('.hp-hero [data-home-primary]').click(),
        ])
        assert.equal(new URL(page.url()).pathname, langue.service, `${etiquette} : route finale du CTA Service`)
        assert.equal(reponseService.status(), 200, `${etiquette} : statut du CTA Service`)
        await page.locator('main h1').waitFor({ state: 'visible' })
        await page.waitForLoadState('load')

        assert.deepEqual(erreursPage, [], `${etiquette} : erreurs JavaScript`)
        assert.deepEqual(erreursConsole, [], `${etiquette} : erreurs/avertissements console`)
        assert.deepEqual(echecsLocaux, [], `${etiquette} : requêtes locales échouées`)
        assert.deepEqual(reponsesLocalesEnErreur, [], `${etiquette} : réponses locales >= 400`)
        assert.deepEqual(requetesPosthog, [], `${etiquette} : PostHog ne doit pas être demandé après un refus`)
      } finally {
        await contexte.close()
      }
    })
  }
}

test('témoins négatifs — CTA absent, mauvaise route et CTA sous la ligne de flottaison', { concurrency: false }, async () => {
  const langue = langues[0]
  const viewport = viewports[1]
  const contexte = await creerContexte(viewport)
  const requetesPosthog = []

  try {
    await intercepterExterne(contexte, requetesPosthog)
    const page = await contexte.newPage()
    const ouvrirAccueil = async () => {
      await page.goto(new URL(langue.route, serveur.url).href, { waitUntil: 'domcontentloaded' })
      await attendrePremierEcran(page)
      await page.evaluate(() => scrollTo(0, 0))
    }

    await ouvrirAccueil()
    await page.locator('.hp-hero [data-home-primary]').evaluate(element => element.remove())
    assert.ok((await page.evaluate(auditerAccueil, langue)).includes('service-cta-missing'), 'témoin : un CTA Service absent doit être détecté')

    await ouvrirAccueil()
    await page.locator('.hp-hero [data-home-primary]').evaluate((element, url) => element.setAttribute('href', url), hubspot)
    assert.ok((await page.evaluate(auditerAccueil, langue)).includes('service-cta-wrong-href'), 'témoin : une route HubSpot doit être détectée')

    await ouvrirAccueil()
    await page.locator('.hp-hero [data-home-primary]').evaluate(element => { element.style.transform = 'translateY(900px)' })
    assert.ok((await page.evaluate(auditerAccueil, langue)).includes('service-cta-below-fold'), 'témoin : un CTA sous la ligne de flottaison doit être détecté')
    assert.deepEqual(requetesPosthog, [], 'témoins : PostHog ne doit pas être demandé après un refus')
  } finally {
    await contexte.close()
  }
})

