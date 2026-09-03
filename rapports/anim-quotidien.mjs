import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '../commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const page = process.argv[2] || '01-accueil'
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto(url + '/' + page + '.html', { waitUntil: 'load' }); await p.waitForTimeout(400)
await p.evaluate(() => document.querySelector('.quotidien-anim').scrollIntoView({ block: 'center' }))
const t0 = Date.now()
for (const [ms, nom] of [[1600, 'p1'], [4400, 'p2'], [6800, 'p3']]) {
  await p.waitForTimeout(Math.max(0, ms - (Date.now() - t0)))
  const e = await p.evaluate(() => ({ classes: document.querySelector('.quotidien-anim').className.replace('quotidien-anim ', ''),
    actif: [...document.querySelectorAll('.quotidien-carte')].map(c => c.classList.contains('actif') ? 1 : 0).join(''),
    parution: getComputedStyle(document.querySelector('.qe-parution')).opacity, regle: getComputedStyle(document.querySelector('.qe-regle')).opacity,
    apres: getComputedStyle(document.querySelector('.qe-apres')).opacity, compte: document.querySelector('.qe-compte b').textContent,
    pastille: getComputedStyle(document.querySelector('.qe-verdict .pl-pastille')).backgroundColor }))
  console.log(`t=${ms}ms`, JSON.stringify(e))
  await p.screenshot({ path: `captures/lane/anim-${page}-${nom}.png` })
}
await b.close()
