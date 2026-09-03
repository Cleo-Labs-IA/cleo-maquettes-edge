import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '../commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto(url + '/01-accueil.html', { waitUntil: 'load' }); await p.waitForTimeout(400)
await p.evaluate(() => document.querySelector('.quotidien-cartes').scrollIntoView({ block: 'start' }))
const t0 = Date.now()
for (const [ms, nom] of [[500, 'a'], [1400, 'b'], [2600, 'c'], [3900, 'd']]) {
  await p.waitForTimeout(Math.max(0, ms - (Date.now() - t0)))
  const e = await p.evaluate(() => ({ vu: document.querySelector('.quotidien-anim').classList.contains('vu'),
    actif: [...document.querySelectorAll('.quotidien-carte')].map(c => c.classList.contains('actif') ? 1 : 0).join(''),
    jauge: getComputedStyle(document.querySelector('.quotidien-anim .jauge span')).width,
    citation: getComputedStyle(document.querySelector('.quotidien-anim .hp-citation')).opacity,
    champ3: getComputedStyle(document.querySelectorAll('.quotidien-anim .pl-champ')[2]).opacity,
    pastille: getComputedStyle(document.querySelector('.quotidien-anim .pl-pastille')).backgroundColor }))
  console.log(`t=${ms}ms`, JSON.stringify(e))
  await p.screenshot({ path: `captures/lane/anim-quotidien-${nom}.png` })
}
await b.close()
