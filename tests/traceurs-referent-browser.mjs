/* Le référent d'arrivée survit-il au bandeau de consentement ? (01/10/2026, rapports/seo-0110/1-trafic-ia.md)

   Le défaut mesuré : PostHog ne se charge qu'après accord. Si le visiteur arrive de chatgpt.com, lit, passe à une
   deuxième page et accepte là, PostHog démarre sur cette deuxième page : son référent est alors notre propre site
   et l'adresse n'a plus d'utm_source. La visite venue d'un assistant IA est comptée comme une visite interne.

   L'oracle ne vient pas du code testé : c'est l'origine d'où le navigateur part réellement (une page servie sous
   https://chatgpt.com, puis un vrai clic), écrite en dur ci-dessous. PostHog est remplacé par un double qui calcule
   référent et utm comme la vraie bibliothèque (document.referrer et l'adresse courante, vérifié contre la vraie
   bibliothèque le 01/10/2026) puis applique le before_send que le site lui passe. Rien ne part sur le réseau.

   Témoins négatifs : une arrivée sans référent ne reçoit aucun référent inventé ; un refus ne charge rien ;
   avant tout choix, aucune requête vers PostHog ; un premier contact vieux de plus de 30 minutes n'est plus reporté. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'
import { resoudreFichier, redirectionDe, statutReponse } from '../commun/servir.mjs'

const sortie = path.resolve('sortie')
const hote = 'https://www.cleolabs.co'
const ASSISTANT = 'https://chatgpt.com'
const ARRIVEE = '/en/legal-data?utm_source=chatgpt.com'
const DEUXIEME = '/en/company'
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json' }

/* Le double de PostHog : ce que array.js ferait d'un $pageview, réduit aux propriétés d'origine de la visite. */
const DOUBLE = `(function(){
  var appel = (window.posthog && window.posthog._i && window.posthog._i[0]) || null
  if (!appel) return
  var cfg = appel[1] || {}, ref = document.referrer, q = new URLSearchParams(location.search)
  var hoteRef = '$direct'; try { if (ref) hoteRef = new URL(ref).host } catch (e) {}
  var p = { $current_url: location.href, $referrer: ref || '$direct', $referring_domain: hoteRef,
            $session_entry_referrer: ref || '$direct', $session_entry_referring_domain: hoteRef }
  ;['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { if (q.get(k) !== null) { p[k] = q.get(k); p['$session_entry_' + k] = q.get(k) } })
  var ev = { event: '$pageview', properties: p }
  if (typeof cfg.before_send === 'function') ev = cfg.before_send(ev)
  window.__cleoEvenementTest = ev
  if (typeof cfg.loaded === 'function') cfg.loaded({ register_once: function () {} })
})()`

const navigateur = await chromium.launch({ headless: true })

async function visite({ depuisAssistant, etapes }) {
  const contexte = await navigateur.newContext()
  const versPosthog = []
  await contexte.route('https://eu-assets.i.posthog.com/**', route => { versPosthog.push(route.request().url()); return route.fulfill({ status: 200, contentType: 'text/javascript', body: DOUBLE }) })
  await contexte.route('https://eu.i.posthog.com/**', route => { versPosthog.push(route.request().url()); return route.fulfill({ status: 204, body: '' }) })
  await contexte.route(`${ASSISTANT}/**`, route => route.fulfill({ status: 200, contentType: 'text/html', body: `<!doctype html><a id="lien" href="${hote}${ARRIVEE}">Cleo Labs</a>` }))
  await contexte.route(`${hote}/**`, async route => {
    const url = new URL(route.request().url())
    const redirection = redirectionDe(sortie, url.pathname)
    if (redirection) return route.fulfill({ status: redirection.statut, headers: { location: redirection.destination + url.search } })
    const fichier = resoudreFichier(sortie, url.pathname)
    return route.fulfill({ status: statutReponse(url.pathname, fichier), contentType: TYPES[path.extname(fichier)] || 'application/octet-stream', body: fs.readFileSync(fichier) })
  })
  const page = await contexte.newPage()
  if (depuisAssistant) {
    await page.goto(`${ASSISTANT}/c/conversation`)
    await Promise.all([page.waitForURL(`${hote}${ARRIVEE}`), page.click('#lien')])
  } else {
    await page.goto(`${hote}${ARRIVEE.split('?')[0]}`)
  }
  await page.waitForSelector('.cleo-cc')
  const avantChoix = versPosthog.length
  for (const etape of etapes) {
    if (etape === 'deuxieme-page') {
      await Promise.all([page.waitForURL(`${hote}${DEUXIEME}`), page.evaluate(cible => { location.assign(cible) }, DEUXIEME)])
      await page.waitForSelector('.cleo-cc')
    } else if (etape === 'vieillir') {
      await page.evaluate(() => { const o = JSON.parse(sessionStorage.getItem('cleo_attribution')); o.t = Date.now() - 31 * 60 * 1000; sessionStorage.setItem('cleo_attribution', JSON.stringify(o)) })
    } else if (etape === 'accepte') {
      await page.click('.cleo-cc [data-cc="oui"]')
      await page.waitForFunction(() => window.__cleoEvenementTest, null, { timeout: 10_000 })
    } else if (etape === 'refuse') {
      await page.click('.cleo-cc [data-cc="non"]')
      await page.waitForTimeout(500)
    }
  }
  const resultat = {
    evenement: await page.evaluate(() => window.__cleoEvenementTest || null),
    referentDuNavigateur: await page.evaluate(() => document.referrer),
    avantChoix,
    versPosthog: versPosthog.length,
  }
  await contexte.close()
  return resultat
}

try {
  /* 1. Le chemin qui marchait déjà : accord donné sur la page d'arrivée. */
  const surPlace = await visite({ depuisAssistant: true, etapes: ['accepte'] })
  assert.equal(surPlace.avantChoix, 0, 'aucune requête vers PostHog avant le choix du visiteur')
  assert.equal(surPlace.evenement.properties.$referring_domain, 'chatgpt.com', 'accord sur la page d’arrivée : référent chatgpt.com')
  assert.equal(surPlace.evenement.properties.utm_source, 'chatgpt.com', 'accord sur la page d’arrivée : utm_source chatgpt.com')

  /* 2. Le défaut : accord donné sur la deuxième page. Le navigateur, lui, ne connaît plus que notre site. */
  const plusTard = await visite({ depuisAssistant: true, etapes: ['deuxieme-page', 'accepte'] })
  assert.equal(new URL(plusTard.referentDuNavigateur).host, 'www.cleolabs.co', 'prémisse : sur la 2e page le navigateur ne donne plus que le site comme référent')
  assert.equal(plusTard.avantChoix, 0, 'aucune requête vers PostHog avant le choix du visiteur')
  const p = plusTard.evenement.properties
  assert.equal(p.$referring_domain, 'chatgpt.com', 'accord sur la 2e page : la visite doit rester attribuée à chatgpt.com')
  assert.equal(p.$referrer, 'https://chatgpt.com/', 'accord sur la 2e page : $referrer = origine de l’assistant, sans chemin ni requête')
  assert.equal(p.$session_entry_referring_domain, 'chatgpt.com', 'accord sur la 2e page : entrée de session attribuée à chatgpt.com')
  assert.equal(p.utm_source, 'chatgpt.com', 'accord sur la 2e page : utm_source de l’arrivée reporté')
  assert.equal(p.$session_entry_utm_source, 'chatgpt.com', 'accord sur la 2e page : utm_source d’entrée de session reporté')
  assert.equal(p.$current_url, `${hote}${DEUXIEME}`, 'l’adresse de la page vue n’est pas réécrite')

  /* 3. Témoin négatif : arrivée sans référent ni utm. Rien ne doit être inventé. */
  const directe = await visite({ depuisAssistant: false, etapes: ['deuxieme-page', 'accepte'] })
  assert.equal(directe.evenement.properties.$referring_domain, 'www.cleolabs.co', 'arrivée directe : le référent reste celui que le navigateur donne')
  assert.equal(directe.evenement.properties.utm_source, undefined, 'arrivée directe : aucun utm_source inventé')
  assert.ok(!JSON.stringify(directe.evenement).includes('chatgpt'), 'arrivée directe : aucune trace d’assistant IA')

  /* 4. Témoin négatif : le premier contact a plus de 30 minutes, il n'est plus reporté (une autre session a commencé). */
  const vieille = await visite({ depuisAssistant: true, etapes: ['vieillir', 'deuxieme-page', 'accepte'] })
  assert.equal(vieille.evenement.properties.$referring_domain, 'www.cleolabs.co', 'premier contact de plus de 30 min : référent non reporté')
  assert.equal(vieille.evenement.properties.utm_source, undefined, 'premier contact de plus de 30 min : utm_source non reporté')

  /* 5. Témoin négatif : refus. PostHog n'est jamais demandé, le report n'ouvre aucune porte. */
  const refus = await visite({ depuisAssistant: true, etapes: ['deuxieme-page', 'refuse'] })
  assert.equal(refus.versPosthog, 0, 'refus : aucune requête vers PostHog')
  assert.equal(refus.evenement, null, 'refus : aucun événement')
} finally {
  await navigateur.close()
}

console.log('Référent d’arrivée validé dans Chromium : chatgpt.com reste attribué quand l’accord vient sur la 2e page ; arrivée directe, premier contact ancien et refus inchangés.')
