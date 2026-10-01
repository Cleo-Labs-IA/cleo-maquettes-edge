import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const sortie = path.resolve('sortie')
const configuration = JSON.parse(fs.readFileSync(path.join(sortie, 'vercel.json'), 'utf8'))
const csp = configuration.headers
  .find(regle => !regle.source.includes('/lp/') && regle.headers.some(entete => entete.key === 'Content-Security-Policy'))?.headers
  .find(entete => entete.key === 'Content-Security-Policy')?.value
assert.ok(csp, 'CSP globale absente de sortie/vercel.json')

const types = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.woff2', 'font/woff2'],
])
const pages = new Map([
  ['/fr/legal-data', '26-legal-data.html'],
  ['/en/legal-data', '26-legal-data-en.html'],
])

const navigateur = await chromium.launch({ headless: true })
try {
  const contexte = await navigateur.newContext()
  await contexte.addInitScript(() => {
    window.__cleoCsp = []
    document.addEventListener('securitypolicyviolation', evenement => {
      window.__cleoCsp.push({ directive: evenement.effectiveDirective, bloque: evenement.blockedURI })
    })
  })
  await contexte.route('https://eu-assets.i.posthog.com/**', route => route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }))
  await contexte.route('https://eu.i.posthog.com/**', route => route.fulfill({ status: 204, body: '' }))
  await contexte.route('https://www.cleolabs.co/**', async route => {
    const url = new URL(route.request().url())
    const relatif = pages.get(url.pathname) || decodeURIComponent(url.pathname).replace(/^\/+/, '')
    const fichier = path.resolve(sortie, relatif)
    if (!(fichier === sortie || fichier.startsWith(sortie + path.sep)) || !fs.existsSync(fichier) || !fs.statSync(fichier).isFile()) {
      await route.fulfill({ status: 404, contentType: 'text/plain', body: 'absent' })
      return
    }
    const html = pages.has(url.pathname)
    await route.fulfill({
      status: 200,
      contentType: types.get(path.extname(fichier)) || 'application/octet-stream',
      headers: html ? { 'Content-Security-Policy': csp } : {},
      body: fs.readFileSync(fichier),
    })
  })

  for (const routePublique of pages.keys()) {
    const page = await contexte.newPage()
    const consolesCsp = []
    const cdn = []
    page.on('console', message => {
      if (/content security policy/i.test(message.text())) consolesCsp.push(message.text())
    })
    page.on('request', requete => {
      if (/\b(?:unpkg\.com|cdn\.jsdelivr\.net)\b/.test(new URL(requete.url()).hostname)) cdn.push(requete.url())
    })
    await page.goto(`https://www.cleolabs.co${routePublique}`, { waitUntil: 'domcontentloaded' })
    await page.waitForFunction(() => document.querySelectorAll('#atlas-carte-monde .leaflet-overlay-pane path').length > 100, null, { timeout: 15_000 })
    const etat = await page.evaluate(() => ({
      leaflet: typeof window.L === 'object',
      topojson: typeof window.topojson === 'object',
      violations: window.__cleoCsp,
      pays: document.querySelectorAll('#atlas-carte-monde .leaflet-overlay-pane path').length,
      carte: Boolean(document.querySelector('#atlas-carte-monde .leaflet-map-pane')),
    }))
    assert.equal(etat.leaflet, true, `${routePublique} : Leaflet absent`)
    assert.equal(etat.topojson, true, `${routePublique} : TopoJSON absent`)
    assert.equal(etat.carte, true, `${routePublique} : carte Leaflet absente`)
    assert.ok(etat.pays > 100, `${routePublique} : fond de carte non rendu`)
    assert.deepEqual(etat.violations, [], `${routePublique} : violation CSP`)
    assert.deepEqual(consolesCsp, [], `${routePublique} : erreur CSP dans la console`)
    assert.deepEqual(cdn, [], `${routePublique} : requête CDN résiduelle`)
    await page.close()
  }
} finally {
  await navigateur.close()
}

console.log('CSP atlas validée dans Chromium : cartes FR et EN rendues, zéro violation, zéro CDN.')
