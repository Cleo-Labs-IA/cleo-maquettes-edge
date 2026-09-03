import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '../commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const page = process.argv[2] || '01-accueil'
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto(url + '/' + page + '.html', { waitUntil: 'load' }); await p.waitForTimeout(400)
await p.evaluate(() => document.querySelector('.radar').scrollIntoView({ block: 'center' }))
const t0 = Date.now()
for (const [ms, nom] of [[1600, 'a'], [4600, 'b'], [9800, 'c']]) {
  await p.waitForTimeout(Math.max(0, ms - (Date.now() - t0)))
  const e = await p.evaluate(() => ({ actifs: [...document.querySelectorAll('.radar-source')].map(s => s.classList.contains('touche') ? 'T' : s.classList.contains('hors') ? 'H' : s.classList.contains('actif') ? 'a' : '.').join(''),
    lignes: [...document.querySelectorAll('.radar-ligne')].map(l => l.classList.contains('vu') ? 1 : 0).join(''), compte: document.querySelector('.radar-compte b').textContent,
    traits: [...document.querySelectorAll('.radar-trait')].map(t => t.classList.contains('plein') ? 'P' : t.classList.contains('partiel') ? 'p' : '.').join('') }))
  console.log(`t=${ms}ms`, JSON.stringify(e)); await p.screenshot({ path: `captures/lane/anim-radar-${nom}.png` })
}
await b.close()
