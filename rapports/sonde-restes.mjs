import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '../commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const b = await chromium.launch()
for (const p of process.argv.slice(2)) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  const pg = await c.newPage(); await pg.goto(`${url}/${p}.html`, { waitUntil: 'load' }); await pg.waitForTimeout(500)
  const r = await pg.evaluate(() => {
    const cs = e => getComputedStyle(e); const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 }
    const t = [...document.querySelectorAll('body *')].filter(e => vis(e) && e.children.length === 0 && e.textContent.trim() && parseFloat(cs(e).fontSize) < 14)
      .map(e => `${cs(e).fontSize} <${e.tagName.toLowerCase()} class="${e.className}"> ${e.textContent.trim().slice(0, 30)} | parent ${e.parentElement.className.split(' ')[0]}`)
    const ci = [...document.querySelectorAll('a[href],button')].filter(e => { const b = e.getBoundingClientRect(); return vis(e) && (b.height < 40 || b.width < 40) })
      .map(e => { const b = e.getBoundingClientRect(); return `${Math.round(b.width)}×${Math.round(b.height)} <${e.tagName.toLowerCase()} class="${e.className}"> ${e.textContent.trim().slice(0, 30)}` })
    return { t, ci }
  })
  console.log(`\n=== ${p} : ${r.t.length} textes < 14, ${r.ci.length} cibles < 40`); r.t.forEach(x => console.log('  T', x)); r.ci.forEach(x => console.log('  C', x))
  await c.close()
}
await b.close()
