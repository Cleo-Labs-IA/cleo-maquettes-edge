import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const nav = await chromium.launch()
const jobs = JSON.parse(process.argv[2]) // [{page, sel, out, pad}]
for (const j of jobs) {
  const ctx = await nav.newContext({ viewport: { width: j.w || 1440, height: 900 }, deviceScaleFactor: 1, isMobile: !!j.mob, hasTouch: !!j.mob })
  const p = await ctx.newPage()
  await p.goto(`${url}/${j.page}.html`, { waitUntil: 'networkidle' })
  await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 480) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } window.scrollTo(0, 0) })
  await p.waitForTimeout(j.wait || 1500)
  const el = await p.$(j.sel)
  if (!el) { console.log('absent : ' + j.sel + ' sur ' + j.page); await ctx.close(); continue }
  await el.screenshot({ path: j.out })
  console.log('ecrit ' + j.out)
  await ctx.close()
}
await nav.close()
