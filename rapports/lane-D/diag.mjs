/* Lane D : nomme les elements fautifs (texte < 14 px, cible < 40 px) sur telephone,
   plus les paragraphes trop larges et les img sans alt, en desktop.
   node rapports/lane-D/diag.mjs 24-blog 26-legal-data ... */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import path from 'path'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const SORTIE = '/Users/naomiehalioua/cleo-maquettes-edge/sortie'
const cibles = process.argv.slice(2)
const { url } = await servir(SORTIE)
const b = await chromium.launch()
const SEL = e => {
  let s = e.tagName.toLowerCase()
  if (e.className && typeof e.className === 'string') s += '.' + e.className.trim().split(/\s+/).join('.')
  let p = e.parentElement, chain = []
  for (let i = 0; i < 2 && p && p.tagName !== 'BODY'; i++, p = p.parentElement) {
    let ps = p.tagName.toLowerCase()
    if (p.className && typeof p.className === 'string') ps += '.' + p.className.trim().split(/\s+/).join('.')
    chain.unshift(ps)
  }
  return chain.join(' > ') + ' > ' + s
}
const DIAG = () => {
  const SELf = window.__SEL
  const cs = e => getComputedStyle(e)
  const vis = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 })
  const feuilles = vis.filter(e => e.children.length === 0 && e.textContent.trim())
  const petits = {}
  feuilles.filter(e => parseFloat(cs(e).fontSize) < 14).forEach(e => {
    const k = SELf(e) + ' @' + cs(e).fontSize
    petits[k] = (petits[k] || 0) + 1
  })
  const cib = {}
  ;[...document.querySelectorAll('a[href],button')].forEach(e => {
    const r = e.getBoundingClientRect()
    if (r.width > 0 && r.height > 0 && (r.height < 40 || r.width < 40)) {
      const k = SELf(e) + ' @' + Math.round(r.width) + 'x' + Math.round(r.height)
      cib[k] = (cib[k] || 0) + 1
    }
  })
  const larges = [...document.querySelectorAll('p')].map(p => ({ s: SELf(p), w: Math.round(p.getBoundingClientRect().width), ch: p.textContent.trim().length }))
    .filter(x => x.w > 760).slice(0, 12)
  const sansAlt = [...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.src.split('/').pop())
  const mono = vis.filter(e => /mono|courier/i.test(cs(e).fontFamily)).map(e => SELf(e) + ' :: ' + cs(e).fontFamily.slice(0, 40)).slice(0, 10)
  const inline = [...document.querySelectorAll('[style]')].filter(e => /grid|flex/.test(e.getAttribute('style'))).map(e => SELf(e) + ' :: ' + e.getAttribute('style').slice(0, 90)).slice(0, 12)
  // debordement : elements plus larges que le viewport
  const deb = vis.filter(e => { const r = e.getBoundingClientRect(); return r.right > window.innerWidth + 1 || r.left < -1 }).map(e => SELf(e) + ' @' + Math.round(e.getBoundingClientRect().right)).slice(0, 10)
  return { petits, cib, larges, sansAlt, mono, inline, deb }
}
for (const nom of cibles) {
  console.log('\n════════ ' + nom + ' ════════')
  for (const [lab, vp] of [['MOBILE 390', { width: 390, height: 844 }], ['DESKTOP 1440', { width: 1440, height: 900 }]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: vp.width === 390, hasTouch: vp.width === 390 })
    const p = await ctx.newPage()
    await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
    await p.waitForTimeout(400)
    await p.addInitScript(() => {})
    await p.evaluate(f => { window.__SEL = eval('(' + f + ')') }, SEL.toString())
    const d = await p.evaluate(DIAG)
    console.log('-- ' + lab)
    if (vp.width === 390) {
      const pe = Object.entries(d.petits).sort((a, c) => c[1] - a[1])
      if (pe.length) { console.log('  textes < 14 px :'); pe.slice(0, 14).forEach(([k, n]) => console.log(`    ${n}x  ${k}`)) }
      const ce = Object.entries(d.cib).sort((a, c) => c[1] - a[1])
      if (ce.length) { console.log('  cibles < 40 px :'); ce.slice(0, 14).forEach(([k, n]) => console.log(`    ${n}x  ${k}`)) }
      if (d.deb.length) { console.log('  deborde :'); d.deb.forEach(x => console.log('    ' + x)) }
    } else {
      if (d.larges.length) { console.log('  p > 760 px :'); d.larges.forEach(x => console.log(`    ${x.w} px / ${x.ch} car.  ${x.s}`)) }
      if (d.sansAlt.length) console.log('  img sans alt : ' + d.sansAlt.join(', '))
      if (d.mono.length) { console.log('  MONOSPACE :'); d.mono.forEach(x => console.log('    ' + x)) }
      if (d.inline.length) { console.log('  grille/flex inline :'); d.inline.forEach(x => console.log('    ' + x)) }
    }
    await ctx.close()
  }
}
await b.close()
process.exit(0)
