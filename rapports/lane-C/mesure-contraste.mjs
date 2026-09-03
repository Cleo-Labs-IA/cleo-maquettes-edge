/* Contraste WCAG de chaque texte visible contre son fond effectif (on remonte
   les parents jusqu'a un fond opaque ; les textes poses sur une image sont
   signales a part, aucun calcul n'est possible). Seuil : 4,5:1 (3:1 si >= 24 px
   ou >= 18,66 px en gras). */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const b = await chromium.launch()
const SONDE = () => {
  const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
  const parse = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(',').map(x => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 } }
  const melange = (av, ar) => [av.a * av.r + (1 - av.a) * ar[0], av.a * av.g + (1 - av.a) * ar[1], av.a * av.b + (1 - av.a) * ar[2]]
  const chemin = e => { const b = []; let n = e; while (n && n.nodeType === 1 && b.length < 4) { let s = n.tagName.toLowerCase(); if (typeof n.className === 'string' && n.className.trim()) s += '.' + n.className.trim().split(/\s+/).slice(0, 2).join('.'); b.unshift(s); n = n.parentElement } return b.join('>') }
  const surImage = e => { let n = e; while (n && n !== document.body) { const cs = getComputedStyle(n); if (cs.backgroundImage !== 'none') return true; if (n.previousElementSibling && /img|svg/i.test(n.previousElementSibling.tagName) && getComputedStyle(n).position === 'absolute') return true; n = n.parentElement } return false }
  const fond = e => {
    let n = e, pile = []
    while (n) { const c = parse(getComputedStyle(n).backgroundColor); if (c && c.a > 0) { pile.unshift(c); if (c.a === 1) break } n = n.parentElement }
    let base = [255, 255, 255]
    for (const c of pile) base = melange(c, base)
    return base
  }
  const out = []
  for (const e of document.querySelectorAll('body *')) {
    if (e.children.length || !e.textContent.trim()) continue
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue
    const cs = getComputedStyle(e)
    const av = parse(cs.color); if (!av) continue
    const bg = fond(e)
    const fg = melange(av, bg)
    const l1 = lum(fg), l2 = lum(bg)
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    const px = parseFloat(cs.fontSize), gras = parseInt(cs.fontWeight) >= 700
    const seuil = (px >= 24 || (px >= 18.66 && gras)) ? 3 : 4.5
    if (ratio < seuil) out.push({ r: Math.round(ratio * 100) / 100, seuil, px, img: surImage(e), c: chemin(e), t: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 46) })
  }
  return out
}
for (const nom of process.argv.slice(2)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
  await p.waitForTimeout(700)
  const r = await p.evaluate(SONDE)
  console.log(`=== ${nom} : ${r.length} texte(s) sous le seuil`)
  const vus = new Set()
  for (const x of r) { const k = x.c + x.r; if (vus.has(k)) continue; vus.add(k); console.log(`  ${String(x.r).padStart(5)}:1 (seuil ${x.seuil}) ${String(Math.round(x.px)).padStart(3)}px ${x.img ? 'SUR IMAGE ' : '          '} ${x.c}  « ${x.t} »`) }
  await ctx.close()
}
await b.close()
