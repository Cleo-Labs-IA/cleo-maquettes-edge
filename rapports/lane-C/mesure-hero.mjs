import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const b = await chromium.launch()
for (const nom of process.argv.slice(2)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
  await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)) } window.scrollTo(0, 0) })
  await p.waitForTimeout(800)
  const r = await p.evaluate(() => {
    const out = []
    document.querySelectorAll('main > section, body > section').forEach((s, i) => {
      const b = s.getBoundingClientRect()
      const enfants = [...s.querySelectorAll('*')].map(e => e.getBoundingClientRect())
      const bas = Math.max(...enfants.map(x => x.bottom), b.bottom)
      const droite = Math.max(...enfants.map(x => x.right), b.right)
      out.push({ i, cls: s.className.slice(0, 40), top: Math.round(b.top + scrollY), bottom: Math.round(b.bottom + scrollY), h: Math.round(b.height), debordeBas: Math.round(bas - b.bottom), debordeDroite: Math.round(droite - b.right), padTop: getComputedStyle(s).paddingTop, padBot: getComputedStyle(s).paddingBottom })
    })
    return out
  })
  console.log('=== ' + nom)
  for (const s of r) console.log(`  §${s.i} ${s.cls.padEnd(40)} y ${s.top}→${s.bottom} (h ${s.h}) pad ${s.padTop}/${s.padBot} ${s.debordeBas > 1 ? '⚠ deborde bas de ' + s.debordeBas + 'px' : ''} ${s.debordeDroite > 1 ? '⚠ deborde droite de ' + s.debordeDroite + 'px' : ''}`)
  await ctx.close()
}
await b.close()
