/* Caracteres par ligne, mesures : largeur de la boite / largeur moyenne d'un
   caractere rendu (canvas, police et taille reelles). Seuil « pro » : 75. */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const b = await chromium.launch()
for (const nom of process.argv.slice(2)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
  await p.waitForTimeout(700)
  const r = await p.evaluate(() => {
    const cv = document.createElement('canvas').getContext('2d')
    const chemin = e => { const b = []; let n = e; while (n && n.nodeType === 1 && b.length < 4) { let s = n.tagName.toLowerCase(); if (typeof n.className === 'string' && n.className.trim()) s += '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.'); b.unshift(s); n = n.parentElement } return b.join('>') }
    return [...document.querySelectorAll('p, li, blockquote > p, .recit p, .citation')].map(e => {
      const r = e.getBoundingClientRect(); if (!r.width) return null
      const t = e.textContent.trim().replace(/\s+/g, ' '); if (t.length < 60) return null
      const cs = getComputedStyle(e)
      cv.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      const large = cv.measureText(t).width / t.length
      const util = r.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      return { cpl: Math.round(util / large), px: Math.round(util), fs: cs.fontSize, c: chemin(e), t: t.slice(0, 42) }
    }).filter(Boolean).filter(x => x.cpl > 75).sort((a, b) => b.cpl - a.cpl)
  })
  console.log('=== ' + nom + ' : ' + r.length + ' bloc(s) au-dessus de 75 c/l')
  const vus = new Set()
  for (const x of r) { const k = x.c + x.px; if (vus.has(k)) continue; vus.add(k); console.log(`  ${String(x.cpl).padStart(4)} c/l  ${String(x.px).padStart(4)} px  ${x.fs}  ${x.c}  « ${x.t} »`) }
  await ctx.close()
}
await b.close()
