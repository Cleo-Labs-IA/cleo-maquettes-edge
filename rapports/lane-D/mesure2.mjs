/* Lane D : mesure de lecture (caracteres par ligne), contraste reel du texte,
   et nombres coupes par un retour a la ligne. */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const b = await chromium.launch()
const F = () => {
  const cs = e => getComputedStyle(e)
  const nom = e => { let s = e.tagName.toLowerCase(); if (typeof e.className === 'string' && e.className) s += '.' + e.className.trim().split(/\s+/).join('.'); return s }
  const par = e => { const p = e.parentElement; return p && p.tagName !== 'BODY' ? nom(p) + ' > ' : '' }
  // 1. mesure de lecture : le plus long <p>/<li> de texte courant
  const mes = []
  for (const e of document.querySelectorAll('p, li, .article p, .legal p')) {
    const t = e.textContent.trim(); if (t.length < 90) continue
    const r = e.getBoundingClientRect(); if (!r.width) continue
    const lignes = e.getClientRects().length
    const ligneH = parseFloat(cs(e).lineHeight) || 24
    const nl = Math.max(1, Math.round(r.height / ligneH))
    mes.push({ s: par(e) + nom(e), w: Math.round(r.width), fs: cs(e).fontSize, car: Math.round(t.length / nl) })
  }
  mes.sort((a, c) => c.car - a.car)
  // 2. contraste
  const lum = c => { const [r, g, bl] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }); return 0.2126 * r + 0.7152 * g + 0.0722 * bl }
  const rgb = s => { const m = s.match(/[\d.]+/g); return m ? m.slice(0, 3).map(Number).concat(m.length > 3 ? [parseFloat(m[3])] : [1]) : null }
  const fond = e => { let n = e; while (n && n !== document.documentElement) { const c = rgb(cs(n).backgroundColor); if (c && c[3] > 0.5) return c.slice(0, 3); n = n.parentElement } return [249, 248, 246] }
  const opac = e => { let o = 1, n = e; while (n && n !== document.documentElement) { o *= parseFloat(cs(n).opacity); n = n.parentElement } return o }
  const bas = []
  for (const e of document.querySelectorAll('body *')) {
    if (e.children.length || !e.textContent.trim()) continue
    if (e.closest('nav.nav, .mega, .nav-mega, .lien-evitement')) continue
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue
    if (opac(e) < 0.98 && e.closest('[data-anim]:not(.vu)')) continue
    const c = rgb(cs(e).color); if (!c) continue
    const bg = fond(e), a = (c[3] ?? 1) * opac(e)
    const av = c.slice(0, 3).map((v, i) => v * a + bg[i] * (1 - a))
    const l1 = lum(av), l2 = lum(bg)
    const ct = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    const fs = parseFloat(cs(e).fontSize), gras = parseInt(cs(e).fontWeight) >= 700
    const seuil = (fs >= 24 || (fs >= 18.66 && gras)) ? 3 : 4.5
    if (ct < seuil) bas.push({ s: par(e) + nom(e), ct: ct.toFixed(2), seuil, fs: cs(e).fontSize, txt: e.textContent.trim().slice(0, 40) })
  }
  // 3. nombres coupes : un element dont le texte contient "chiffre espace chiffre" et qui rend sur 2 lignes
  const coupes = []
  for (const e of document.querySelectorAll('body *')) {
    if (e.children.length || !e.textContent.trim()) continue
    const t = e.textContent.trim()
    if (!/\d[   ]\d/.test(t)) continue
    if (e.getClientRects().length > 1) coupes.push({ s: par(e) + nom(e), txt: t.slice(0, 50), lignes: e.getClientRects().length })
  }
  return { mes: mes.slice(0, 6), bas: bas.slice(0, 20), coupes: coupes.slice(0, 10) }
}
for (const nom of process.argv.slice(2)) {
  console.log('\n════ ' + nom)
  for (const [lab, vp] of [['D', { width: 1440, height: 900 }], ['M', { width: 390, height: 844 }]]) {
    const ctx = await b.newContext({ viewport: vp, isMobile: vp.width === 390, hasTouch: vp.width === 390 })
    const p = await ctx.newPage(); await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' }); await p.waitForTimeout(500)
    await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 420) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } window.scrollTo(0, 0) })
    await p.waitForTimeout(900)
    const d = await p.evaluate(F)
    if (d.mes.length) console.log(`  [${lab}] mesure : ` + d.mes.map(m => `${m.car} car/${m.w}px ${m.fs} ${m.s}`).slice(0, 3).join(' | '))
    if (d.bas.length) { console.log(`  [${lab}] CONTRASTE bas :`); d.bas.forEach(x => console.log(`     ${x.ct} (<${x.seuil}) ${x.fs} ${x.s} « ${x.txt} »`)) }
    if (d.coupes.length) { console.log(`  [${lab}] NOMBRE COUPE :`); d.coupes.forEach(x => console.log(`     ${x.lignes} lignes  ${x.s}  « ${x.txt} »`)) }
    await ctx.close()
  }
}
await b.close(); process.exit(0)
