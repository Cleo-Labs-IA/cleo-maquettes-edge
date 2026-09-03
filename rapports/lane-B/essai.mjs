import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const nav = await chromium.launch()
const V = {
 A: `.cv .cv__scene{align-items:stretch}
     .cv .cv__flux{display:flex;flex-direction:column}
     .cv .cv__list{min-height:0;flex:1}
     .cv .cv-txt{flex:1 1 0}`,
 C: `.cv .cv__scene{align-items:center}
     .cv .cv__list{min-height:0}`,
 D: `.cv .cv__scene{align-items:stretch}
     .cv .cv__flux{display:flex;flex-direction:column}
     .cv .cv__list{min-height:0;flex:1;justify-content:space-between}
     .cv .cv-txt{flex:0 1 auto}`,
 E: `.cv .cv__scene{align-items:stretch}
     .cv .cv__flux{display:flex;flex-direction:column}
     .cv .cv__list{min-height:0;flex:1;gap:14px}
     .cv .cv-txt{flex:1 1 0;max-height:112px}`,
 F: `.cv .cv__scene{align-items:stretch;grid-template-columns:1fr 272px}
     .cv .cv__flux{display:flex;flex-direction:column}
     .cv .cv__list{min-height:0;flex:1;gap:12px}
     .cv .cv-txt{flex:1 1 0}
     .cv .cv__prod img{width:88px}`,
}
for (const k of Object.keys(V)) {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const p = await ctx.newPage()
  await p.goto(`${url}/03-offre.html`, { waitUntil: 'networkidle' })
  await p.addStyleTag({ content: V[k] })
  await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 480) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } window.scrollTo(0, 0) })
  await p.waitForTimeout(1600)
  const el = await p.$('.cv')
  await el.screenshot({ path: `/Users/naomiehalioua/cleo-maquettes-edge/rapports/lane-B/z-veille-${k}.png` })
  const m = await p.evaluate(() => {
    const cv = document.querySelector('.cv'), sc = cv.querySelector('.cv__scene'), li = cv.querySelector('.cv__list')
    const rows = [...cv.querySelectorAll('.cv-txt')].map(r => Math.round(r.getBoundingClientRect().height))
    const der = cv.querySelectorAll('.cv-txt'); const last = der[der.length-1].getBoundingClientRect()
    return { cvH: Math.round(cv.getBoundingClientRect().height), sceneH: Math.round(sc.getBoundingClientRect().height),
      listeH: Math.round(li.getBoundingClientRect().height), rows,
      videSousDernier: Math.round(sc.getBoundingClientRect().bottom - last.bottom) }
  })
  console.log(k, JSON.stringify(m))
  await ctx.close()
}
await nav.close()
