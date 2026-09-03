/* Caracteres par ligne, VERITE DE TERRAIN : on parcourt chaque caractere du
   noeud texte avec un Range, on groupe par ordonnee de ligne, on compte.
   Le canvas mentait (police non chargee dans son contexte). */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const b = await chromium.launch()
for (const nom of process.argv.slice(2)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
  await p.evaluate(() => document.fonts.ready)
  await p.waitForTimeout(900)
  const r = await p.evaluate(() => {
    const chemin = e => { const b = []; let n = e; while (n && n.nodeType === 1 && b.length < 4) { let s = n.tagName.toLowerCase(); if (typeof n.className === 'string' && n.className.trim()) s += '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.'); b.unshift(s); n = n.parentElement } return b.join('>') }
    const out = []
    for (const e of document.querySelectorAll('p, li, blockquote, .citation, .t-lead, .t-body')) {
      const rect = e.getBoundingClientRect(); if (!rect.width) continue
      const txt = e.textContent.replace(/\s+/g, ' ').trim(); if (txt.length < 90) continue
      // parcours des noeuds texte
      const lignes = new Map()
      const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT)
      let n
      while ((n = w.nextNode())) {
        const d = n.data
        for (let i = 0; i < d.length; i++) {
          if (d[i] === '\n' || d[i] === '\t') continue
          const rg = document.createRange(); rg.setStart(n, i); rg.setEnd(n, i + 1)
          const rr = rg.getBoundingClientRect()
          if (!rr.height) continue
          const cle = Math.round(rr.top)
          lignes.set(cle, (lignes.get(cle) || 0) + 1)
        }
      }
      const cnt = [...lignes.values()]
      if (!cnt.length) continue
      out.push({ max: Math.max(...cnt), nb: cnt.length, px: Math.round(rect.width), fs: getComputedStyle(e).fontSize, c: chemin(e), t: txt.slice(0, 40) })
    }
    return out
  })
  const chauds = r.filter(x => x.max > 75).sort((a, b2) => b2.max - a.max)
  console.log(`=== ${nom} : ${chauds.length} bloc(s) > 75 caracteres sur la ligne la plus longue (sur ${r.length} mesures)`)
  const vus = new Set()
  for (const x of chauds) { const k = x.c + x.px; if (vus.has(k)) continue; vus.add(k); console.log(`  ${String(x.max).padStart(4)} car.  ${String(x.px).padStart(4)} px  ${x.fs}  ${x.c}  « ${x.t} »`) }
  await ctx.close()
}
await b.close()
