/* Compte EXACTEMENT les caracteres de chaque ligne rendue, via Range :
   on avance caractere par caractere et on change de ligne quand le rectangle
   du Range descend. Aucune estimation. */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const b = await chromium.launch()
const F = () => {
  const nom = e => { let s = e.tagName.toLowerCase(); if (typeof e.className === 'string' && e.className) s += '.' + e.className.trim().split(/\s+/).join('.'); return s }
  const par = e => { const p = e.parentElement; return p && p.tagName !== 'BODY' ? nom(p) + ' > ' : '' }
  const out = []
  for (const e of document.querySelectorAll('p, li, .article p, .legal p, dd')) {
    const n = e.firstChild
    if (!n || n.nodeType !== 3 || e.childNodes.length > 3) { }
    const t = e.textContent
    if (t.trim().length < 120) continue
    const r0 = e.getBoundingClientRect(); if (!r0.width) continue
    // parcourir les noeuds texte
    const w = document.createTreeWalker(e, NodeFilter.SHOW_TEXT)
    const noeuds = []; let x
    while ((x = w.nextNode())) noeuds.push(x)
    const rg = document.createRange()
    let top = null, n_ligne = 0, lignes = []
    for (const nd of noeuds) {
      for (let i = 0; i < nd.length; i++) {
        rg.setStart(nd, i); rg.setEnd(nd, i + 1)
        const rr = rg.getClientRects()[0]; if (!rr) continue
        if (top === null) top = rr.top
        else if (rr.top > top + 3) { lignes.push(n_ligne); n_ligne = 0; top = rr.top }
        n_ligne++
      }
    }
    lignes.push(n_ligne)
    const pleines = lignes.slice(0, -1)          // la derniere ligne est partielle
    if (!pleines.length) continue
    out.push({ s: par(e) + nom(e), w: Math.round(r0.width),
      fs: getComputedStyle(e).fontSize,
      max: Math.max(...pleines), moy: Math.round(pleines.reduce((a, c) => a + c, 0) / pleines.length),
      n: lignes.length })
  }
  out.sort((a, c) => c.max - a.max)
  return out.slice(0, 4)
}
for (const nom of process.argv.slice(2)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage(); await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' }); await p.waitForTimeout(500)
  await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)) } window.scrollTo(0, 0) })
  await p.waitForTimeout(600)
  const d = await p.evaluate(F)
  console.log(nom.padEnd(22) + (d.length ? d.map(x => `${x.max} car max / ${x.moy} moy · ${x.w}px ${x.fs} · ${x.s}`).join('\n' + ' '.repeat(22)) : 'aucun paragraphe > 120 car'))
  await ctx.close()
}
await b.close(); process.exit(0)
