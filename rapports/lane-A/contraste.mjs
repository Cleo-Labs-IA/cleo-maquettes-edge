/* Contraste mesuré sur une liste de sélecteurs, page construite.
   node rapports/lane-A/contraste.mjs <page> <sel> [sel …] */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import path from 'path'
import { servir } from '../../commun/servir.mjs'
const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const [nom, ...sels] = process.argv.slice(2)
const { url } = await servir(path.join(ICI, 'sortie'))
const nav = await chromium.launch()
const p = await (await nav.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' }); await p.waitForTimeout(500)
const out = await p.evaluate(sels => {
  const r = []
  for (const s of sels) for (const e of document.querySelectorAll(s)) {
    const cs = getComputedStyle(e)
    let bg = 'rgba(0, 0, 0, 0)', n = e
    while (n && (bg === 'rgba(0, 0, 0, 0)' || /, 0\)$/.test(bg))) { bg = getComputedStyle(n).backgroundColor; n = n.parentElement }
    r.push({ sel: s, txt: e.textContent.trim().replace(/\s+/g,' ').slice(0, 30), fg: cs.color, bg, taille: cs.fontSize,
             boite: (b=>Math.round(b.width)+'x'+Math.round(b.height))(e.getBoundingClientRect()) })
  }
  return r
}, sels)
await nav.close()
const P = c => c.match(/[\d.]+/g).map(Number)
const lin = v => (v/=255, v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4))
const L = c => 0.2126*lin(c[0]) + 0.7152*lin(c[1]) + 0.0722*lin(c[2])
const mix = (f,b) => { const a = f.length > 3 ? f[3] : 1; return [0,1,2].map(i => f[i]*a + b[i]*(1-a)) }
for (const o of out) {
  const bg = P(o.bg), fg = P(o.fg)
  const bo = bg.length > 3 && bg[3] < 1 ? mix(bg, [15,14,13]) : bg.slice(0,3)
  const fo = mix(fg, bo)
  const F = L(fo), B = L(bo)
  const r = ((Math.max(F,B)+0.05)/(Math.min(F,B)+0.05)).toFixed(2)
  console.log(o.sel.padEnd(34), o.taille.padStart(5), o.boite.padStart(9), ('«'+o.txt+'»').padEnd(34), o.fg.padEnd(22), 'sur', o.bg.padEnd(22), '=', r+':1', r < 4.5 ? '  ⚠' : '')
}
