import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const sortie = path.resolve('sortie')
const hote = 'https://www.cleolabs.co'
const origineHote = new URL(hote).origin
const origineHubSpot = 'https://meetings.hubspot.com'
const configuration = JSON.parse(fs.readFileSync(path.join(sortie, 'vercel.json'), 'utf8'))
const csp = configuration.headers
  .find(regle => !regle.source.includes('/lp/') && regle.headers.some(entete => entete.key === 'Content-Security-Policy'))?.headers
  .find(entete => entete.key === 'Content-Security-Policy')?.value
assert.ok(csp, 'CSP globale absente de sortie/vercel.json')

const directiveFormAction = csp.split(';').map(partie => partie.trim()).find(partie => partie.startsWith('form-action '))
assert.ok(directiveFormAction, 'directive form-action absente de la CSP')
const sourcesFormAction = directiveFormAction.split(/\s+/).slice(1)
assert.deepEqual(sourcesFormAction, ["'self'", origineHubSpot], 'form-action doit rester limitée à self et à l’origine HubSpot utilisée')

const originesDansLesFormulaires = new Set()
for (const nom of fs.readdirSync(sortie).filter(nom => nom.endsWith('.html'))) {
  const html = fs.readFileSync(path.join(sortie, nom), 'utf8')
  for (const correspondance of html.matchAll(/<form\b[^>]*>/gi)) {
    const action = correspondance[0].match(/\baction\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i)
    if (!action) continue
    const cible = new URL(action[1] ?? action[2] ?? action[3], `${hote}/`)
    if (['http:', 'https:'].includes(cible.protocol) && cible.origin !== origineHote) originesDansLesFormulaires.add(cible.origin)
  }
}
const originesExternesDansLaCsp = new Set(sourcesFormAction
  .filter(source => !source.startsWith("'") && /^https?:\/\//.test(source))
  .map(source => new URL(source).origin)
  .filter(origine => origine !== origineHote))
assert.deepEqual([...originesExternesDansLaCsp].sort(), [...originesDansLesFormulaires].sort(),
  'les origines externes form-action et celles des formulaires générés doivent être identiques')

const types = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.woff2', 'font/woff2'],
])
const pages = new Map([
  ['/fr/meet', '21-inscription.html'],
  ['/en/meet', '21-inscription-en.html'],
])

const navigateur = await chromium.launch({ headless: true })
try {
  const contexte = await navigateur.newContext()
  const violations = []
  await contexte.exposeFunction('__cleoViolationFormulaire', violation => violations.push(violation))
  await contexte.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', evenement => {
      window.__cleoViolationFormulaire({
        directive: evenement.effectiveDirective,
        bloque: evenement.blockedURI,
        page: location.pathname,
      })
    })
  })
  await contexte.route('https://eu-assets.i.posthog.com/**', route => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }))
  await contexte.route('https://eu.i.posthog.com/**', route => route.fulfill({ status: 204, body: '' }))
  await contexte.route(`${origineHubSpot}/**`, route => route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>HubSpot reçu</title>' }))
  await contexte.route(`${hote}/**`, async route => {
    const url = new URL(route.request().url())
    const relatif = pages.get(url.pathname) || decodeURIComponent(url.pathname).replace(/^\/+/, '')
    const fichier = path.resolve(sortie, relatif)
    if (!(fichier === sortie || fichier.startsWith(sortie + path.sep)) || !fs.existsSync(fichier) || !fs.statSync(fichier).isFile()) {
      await route.fulfill({ status: 404, contentType: 'text/plain', body: 'absent' })
      return
    }
    await route.fulfill({
      status: 200,
      contentType: types.get(path.extname(fichier)) || 'application/octet-stream',
      headers: pages.has(url.pathname) ? { 'Content-Security-Policy': csp } : {},
      body: fs.readFileSync(fichier),
    })
  })

  for (const routePublique of pages.keys()) {
    const page = await contexte.newPage()
    const erreursCsp = []
    page.on('console', message => {
      if (/content security policy/i.test(message.text())) erreursCsp.push(message.text())
    })
    await page.goto(`${hote}${routePublique}`, { waitUntil: 'domcontentloaded' })
    await page.locator('#f-acces-email').fill('csp-test@cleolabs.co')
    const requete = page.waitForRequest(request => request.url().startsWith(`${origineHubSpot}/`), { timeout: 10_000 })
    await page.locator('#f-acces').evaluate(formulaire => formulaire.requestSubmit())
    const soumission = await requete
    const cible = new URL(soumission.url())
    assert.equal(cible.origin, origineHubSpot, `${routePublique} : origine de soumission inattendue`)
    assert.equal(cible.pathname, '/anaelle-guez/rendez-vous', `${routePublique} : chemin HubSpot inattendu`)
    assert.equal(cible.searchParams.get('email'), 'csp-test@cleolabs.co', `${routePublique} : email absent de la soumission`)
    await page.waitForLoadState('domcontentloaded')
    assert.deepEqual(erreursCsp, [], `${routePublique} : erreur CSP dans la console`)
    await page.close()
  }
  assert.deepEqual(violations, [], 'les soumissions FR et EN ne doivent provoquer aucune violation CSP')
} finally {
  await navigateur.close()
}

console.log('CSP formulaires validée dans Chromium : soumissions HubSpot FR et EN, zéro violation.')
