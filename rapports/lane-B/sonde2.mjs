/* Lane B, passe 2. Mesure ciblée : petits textes desktop/téléphone hors
   maquettes d'application, plancher DANS les maquettes, cibles tactiles,
   géométrie du composant de veille et de la paire d'écrans, boutons. */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
import fs from 'fs'

const SORTIE = '/Users/naomiehalioua/cleo-maquettes-edge/sortie'
const pages = process.argv.slice(2)
const { url } = await servir(SORTIE)
const nav = await chromium.launch()

const SONDE = () => {
  const cs = e => getComputedStyle(e)
  const dansApp = e => !!e.closest('.ecran-app, .cv')
  const vis = [...document.querySelectorAll('body *')].filter(e => {
    const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && cs(e).visibility !== 'hidden' && cs(e).display !== 'none'
  })
  const textes = vis.filter(e => e.children.length === 0 && e.textContent.trim())
  const desc = e => {
    const b = e.getBoundingClientRect()
    return { tag: e.tagName, cls: (e.className || '').toString().slice(0, 60),
      px: +parseFloat(cs(e).fontSize).toFixed(2), txt: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 42),
      w: Math.round(b.width), h: Math.round(b.height) }
  }
  const hors = textes.filter(e => !dansApp(e))
  const dedans = textes.filter(e => dansApp(e))
  const seuil = window.innerWidth <= 640 ? 14 : 13
  const cibles = [...document.querySelectorAll('a[href],button,summary,input,select')].filter(e => {
    const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.height < 40 || b.width < 40)
  }).map(desc)
  // boutons
  const btns = [...document.querySelectorAll('.btn')].map(e => {
    const b = e.getBoundingClientRect()
    return { cls: e.className, txt: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40),
      href: e.getAttribute('href') || '', bg: cs(e).backgroundColor, bord: cs(e).borderColor,
      w: Math.round(b.width), h: Math.round(b.height) }
  })
  // veille
  const cv = document.querySelector('.cv')
  let veille = null
  if (cv) {
    const g = s => { const el = cv.querySelector(s); if (!el) return null; const b = el.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height), top: Math.round(b.top), bas: Math.round(b.bottom) } }
    const liste = cv.querySelector('.cv__list')
    const items = [...cv.querySelectorAll('.cv-txt')].filter(e => e.getBoundingClientRect().height > 0)
    const dernier = items.length ? items[items.length - 1].getBoundingClientRect() : null
    const col = cv.querySelector('.cv__prod')?.parentElement
    veille = { bloc: (() => { const b = cv.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height) } })(),
      scene: g('.cv__scene'), liste: g('.cv__list'), listeMinH: liste ? cs(liste).minHeight : null,
      nbItems: items.length, basDernierItem: dernier ? Math.round(dernier.bottom) : null,
      prod: g('.cv__prod'), fiche: g('.cv__fiche'),
      colDroite: col ? (() => { const b = col.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height), bas: Math.round(b.bottom) } })() : null,
      videSousListe: liste ? Math.round(liste.getBoundingClientRect().bottom - (dernier ? dernier.bottom : liste.getBoundingClientRect().top)) : null }
  }
  // paire d'écrans
  const ecrans = [...document.querySelectorAll('.ecran-app')].map(e => {
    const b = e.getBoundingClientRect()
    return { cls: (e.className || '').toString(), w: Math.round(b.width), h: Math.round(b.height), top: Math.round(b.top + window.scrollY), bas: Math.round(b.bottom + window.scrollY) }
  })
  return {
    largeur: window.innerWidth, hauteur: document.body.scrollHeight,
    debordement: document.documentElement.scrollWidth > window.innerWidth + 1,
    horsAppSousSeuil: hors.filter(e => parseFloat(cs(e).fontSize) < seuil).map(desc),
    dansAppSous11: dedans.filter(e => parseFloat(cs(e).fontSize) < 11).map(desc),
    dansAppTailles: [...new Set(dedans.map(e => +parseFloat(cs(e).fontSize).toFixed(2)))].sort((a, b) => a - b),
    nbDansApp: dedans.length,
    ciblesPetites: cibles, btns, veille, ecrans
  }
}

const out = {}
for (const p of pages) {
  out[p] = {}
  for (const [nom, vp, mob] of [['desktop', { width: 1440, height: 900 }, false], ['tel', { width: 390, height: 844 }, true]]) {
    const ctx = await nav.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mob, hasTouch: mob })
    const page = await ctx.newPage()
    await page.goto(`${url}/${p}.html`, { waitUntil: 'networkidle' })
    await page.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 480) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } window.scrollTo(0, 0) })
    await page.waitForTimeout(1400)
    out[p][nom] = await page.evaluate(SONDE)
    // second instant, pour l'animation de la veille
    if (p === '03-offre') { await page.waitForTimeout(4200); out[p][nom + '_t2'] = await page.evaluate(SONDE) }
    await ctx.close()
  }
}
await nav.close()
fs.writeFileSync(process.env.OUT || '/Users/naomiehalioua/cleo-maquettes-edge/rapports/lane-B/sonde2.json', JSON.stringify(out, null, 1))
for (const p of pages) for (const k of Object.keys(out[p])) {
  const m = out[p][k]
  console.log(`${p} ${k} : h=${m.hauteur} debord=${m.debordement} horsApp<seuil=${m.horsAppSousSeuil.length} dansApp<11=${m.dansAppSous11.length} cibles<40=${m.ciblesPetites.length} tailles-app=[${m.dansAppTailles.join(',')}]`)
}
