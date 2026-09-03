/* Diagnostic du cadre : QUI sont les textes < 14 px et les cibles < 40 px sur
   telephone, et ou vivent-ils (nav, pied, corps de page). */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const b = await chromium.launch()
const pages = process.argv.slice(2)
for (const nom of pages) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true })
  const p = await ctx.newPage()
  await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
  await p.waitForTimeout(400)
  const r = await p.evaluate(() => {
    const zone = e => e.closest('.nav') ? 'NAV' : (e.closest('.pied') || e.closest('.signature-cleo')) ? 'PIED' : e.closest('.menu-mobile') ? 'MM' : 'CORPS'
    const sel = e => { let s = e.tagName.toLowerCase(); if (e.className && typeof e.className === 'string') s += '.' + e.className.trim().split(/\s+/).join('.'); return s }
    const vis = [...document.querySelectorAll('body *')].filter(e => { const x = e.getBoundingClientRect(); return x.width > 0 && x.height > 0 })
    const textes = vis.filter(e => e.children.length === 0 && e.textContent.trim())
    const petits = textes.filter(e => parseFloat(getComputedStyle(e).fontSize) < 14)
      .map(e => ({ zone: zone(e), sel: sel(e), px: getComputedStyle(e).fontSize, txt: e.textContent.trim().slice(0, 40) }))
    const cib = [...document.querySelectorAll('a[href],button')].filter(e => { const x = e.getBoundingClientRect(); return x.width > 0 && x.height > 0 && (x.height < 40 || x.width < 40) })
      .map(e => { const x = e.getBoundingClientRect(); return { zone: zone(e), sel: sel(e), w: Math.round(x.width), h: Math.round(x.height), txt: e.textContent.trim().slice(0, 30) } })
    return { petits, cib }
  })
  console.log(`\n### ${nom}`)
  console.log('  TEXTES < 14 :'); r.petits.forEach(x => console.log(`   [${x.zone}] ${x.px} ${x.sel} « ${x.txt} »`))
  console.log('  CIBLES < 40 :'); r.cib.forEach(x => console.log(`   [${x.zone}] ${x.w}x${x.h} ${x.sel} « ${x.txt} »`))
  await ctx.close()
}
await b.close()
