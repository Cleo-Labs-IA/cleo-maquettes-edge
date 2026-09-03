/* Diagnostic fin lane C : quels elements exactement sont sous 14 px (mobile),
   quelles cibles sous 40 px, quels liens sortent du site, quelles lignes
   depassent 75 caracteres. Ecrit rapports/lane-C/diag.json + resume stdout. */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import fs from 'fs'
import path from 'path'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'

const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const SORTIE = path.join(ICI, 'sortie')
const cibles = process.argv.slice(2)
const { url } = await servir(SORTIE)
const browser = await chromium.launch()

const chemin = (e) => {
  const bouts = []
  let n = e
  while (n && n.nodeType === 1 && bouts.length < 5) {
    let s = n.tagName.toLowerCase()
    if (n.className && typeof n.className === 'string') s += '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.')
    bouts.unshift(s)
    n = n.parentElement
  }
  return bouts.join(' > ')
}

const SONDE = (cheminSrc) => {
  const chemin = new Function('return ' + cheminSrc)()
  const cs = e => getComputedStyle(e)
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 }
  const feuilles = [...document.querySelectorAll('body *')].filter(e => vis(e) && e.children.length === 0 && e.textContent.trim())
  const petits = feuilles.filter(e => parseFloat(cs(e).fontSize) < 14)
    .map(e => ({ px: cs(e).fontSize, t: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 60), c: chemin(e) }))
  const cibles = [...document.querySelectorAll('a[href],button')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.height < 40 || b.width < 40) })
    .map(e => { const b = e.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height), t: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40), c: chemin(e) } })
  const liens = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'))
  // lignes de texte trop longues : on mesure le nb de caracteres de la 1re ligne rendue
  const larges = [...document.querySelectorAll('p, li, .t-body, .t-lead')].filter(vis).map(e => {
    const b = e.getBoundingClientRect()
    const txt = e.textContent.trim().replace(/\s+/g, ' ')
    if (!txt || txt.length < 40) return null
    const r = document.createRange(); r.selectNodeContents(e)
    const rects = [...r.getClientRects()].filter(x => x.width > 1)
    if (!rects.length) return null
    // caracteres par ligne approx : longueur totale / nb de lignes distinctes
    const tops = new Set(rects.map(x => Math.round(x.top)))
    const cpl = Math.round(txt.length / Math.max(1, tops.size))
    return { largeur: Math.round(b.width), cpl, lignes: tops.size, t: txt.slice(0, 50), c: chemin(e) }
  }).filter(Boolean).filter(x => x.cpl > 78)
  // chevauchements grossiers : elements dont le texte deborde de leur boite
  const troptot = [...document.querySelectorAll('body *')].filter(e => vis(e) && e.scrollWidth > e.clientWidth + 2 && cs(e).overflowX !== 'auto' && cs(e).overflowX !== 'scroll')
    .map(e => ({ sw: e.scrollWidth, cw: e.clientWidth, c: chemin(e), t: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) })).slice(0, 20)
  return { petits, cibles, liens, larges, troptot }
}

const out = {}
for (const nom of cibles) {
  const r = { nom }
  for (const [mode, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mode === 'mobile', hasTouch: mode === 'mobile' })
    const page = await ctx.newPage()
    await page.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
    await page.waitForTimeout(500)
    await page.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)) } window.scrollTo(0, 0) })
    await page.waitForTimeout(500)
    r[mode] = await page.evaluate(SONDE, chemin.toString())
    await ctx.close()
  }
  out[nom] = r
  console.log(`\n===== ${nom} =====`)
  console.log('-- mobile, textes < 14 px :')
  const g = {}
  for (const p of r.mobile.petits) { const k = p.px + ' | ' + p.c; (g[k] ||= []).push(p.t) }
  for (const k of Object.keys(g)) console.log(`   ${k}  ×${g[k].length}  ex: ${g[k][0]}`)
  console.log('-- mobile, cibles < 40 px :')
  for (const c of r.mobile.cibles) console.log(`   ${c.w}×${c.h}  ${c.c}  « ${c.t} »`)
  console.log('-- desktop, cibles < 40 px :')
  for (const c of r.desktop.cibles) console.log(`   ${c.w}×${c.h}  ${c.c}  « ${c.t} »`)
  console.log('-- desktop, lignes > 78 car :')
  for (const l of r.desktop.larges) console.log(`   ${l.largeur}px ${l.cpl}c/l  ${l.c}  « ${l.t} »`)
  console.log('-- desktop, debordement interne :')
  for (const t of r.desktop.troptot) console.log(`   ${t.sw}>${t.cw}  ${t.c}  « ${t.t} »`)
  console.log('-- mobile, debordement interne :')
  for (const t of r.mobile.troptot) console.log(`   ${t.sw}>${t.cw}  ${t.c}  « ${t.t} »`)
  const ext = [...new Set(r.desktop.liens)].filter(h => !/^https?:|^mailto:|^tel:|^#/.test(h))
  console.log('-- liens internes :', ext.join(' '))
}
fs.writeFileSync(path.join(ICI, 'rapports/lane-C/diag.json'), JSON.stringify(out, null, 2))
await browser.close()
