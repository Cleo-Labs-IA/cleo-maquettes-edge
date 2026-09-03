/* ════════════════════════════════════════════════════════════════
   TÉMOIN DE MISE EN PAGE.
   On relève l'état AVANT une passe, on le relève APRÈS, et on compare.
   Vécu le 27/08 : une correction de « 12 px de marge résiduelle » en a
   coûté 40, et rien ne l'a vu avant qu'un agent adverse le mesure.
     node temoin.mjs avant   → temoins/avant.json
     node temoin.mjs apres   → temoins/apres.json + le diff
   ════════════════════════════════════════════════════════════════ */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import fs from 'fs'
import path from 'path'

const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const SORTIE = path.join(ICI, 'sortie')
import { servir } from './commun/servir.mjs'
const { url: URL_SORTIE } = await servir(SORTIE)
const quoi = process.argv[2] || 'avant'
const pages = fs.readdirSync(SORTIE).filter(f => f.endsWith('.html')).sort()

const lum = c => { const m = c.match(/[\d.]+/g); if (!m) return null
  const [r, g, b] = m.slice(0, 3).map(Number)
  const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }

const b = await chromium.launch()
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const releve = {}

for (const f of pages) {
  await p.goto(URL_SORTIE + '/' + f); await p.waitForTimeout(180)
  await p.evaluate(async () => { const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 480) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)) } })
  await p.evaluate(() => window.scrollTo(0, 0))
  await p.waitForTimeout(900)
  releve[f] = await p.evaluate(() => {
    const cs = getComputedStyle
    // 1. l'échelle typo RENDUE
    const tailles = {}
    for (const e of document.querySelectorAll('*')) {
      const t = [...e.childNodes].some(c => c.nodeType === 3 && c.textContent.trim().length > 1)
      if (!t) continue
      const s = Math.round(parseFloat(cs(e).fontSize) * 100) / 100
      tailles[s] = (tailles[s] || 0) + 1
    }
    // 2. le BAS de chaque carte de chaque grille : l'oracle d'alignement
    const grilles = []
    for (const g of document.querySelectorAll('.g2,.g3,.g4,.duo,.escalier,.res-tete,.experts-duo')) {
      const enfants = [...g.children].filter(e => e.getBoundingClientRect().height > 20)
      if (enfants.length < 2) continue
      const bas = enfants.map(e => Math.round(e.getBoundingClientRect().bottom + window.scrollY))
      const hauts = enfants.map(e => Math.round(e.getBoundingClientRect().top + window.scrollY))
      grilles.push({ cls: g.className.split(' ').slice(0, 2).join('.'), n: enfants.length,
        ecartBas: Math.max(...bas) - Math.min(...bas), ecartHaut: Math.max(...hauts) - Math.min(...hauts) })
    }
    // 3. les sections
    const sections = [...document.querySelectorAll('section')]
      .map(s => Math.round(s.getBoundingClientRect().height))
    return {
      hauteur: document.body.scrollHeight,
      tailles: Object.fromEntries(Object.entries(tailles).sort((a, c) => c[1] - a[1])),
      nTailles: Object.keys(tailles).length,
      grilles, sections, nSections: sections.length,
    }
  })
  // 4. les blocs sous 4,5:1, mesurés sur les couleurs rendues
  releve[f].faibles = await p.evaluate(() => {
    const cs = getComputedStyle, out = []
    for (const e of document.querySelectorAll('p,li,span,div,h1,h2,h3,h4,a,b,small,label')) {
      const n = [...e.childNodes].find(c => c.nodeType === 3 && c.textContent.trim().length > 8)
      if (!n) continue
      const d = e.closest('details'); if (d && !d.open) continue
      let bg = 'rgba(0, 0, 0, 0)', q = e
      while (q && (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent')) { bg = cs(q).backgroundColor; q = q.parentElement }
      out.push({ c: cs(e).color, bg, t: n.textContent.trim().slice(0, 24) })
    }
    return out
  })
  releve[f].faibles = releve[f].faibles.map(o => {
    const l1 = lum(o.c), l2 = lum(o.bg)
    if (l1 === null || l2 === null) return null
    const r = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
    return r < 4.5 ? { ...o, ratio: +r.toFixed(2) } : null
  }).filter(Boolean)
  process.stdout.write(`  ${f.replace('.html','').padEnd(18)} ${String(releve[f].nTailles).padStart(3)} tailles · ${String(releve[f].grilles.length).padStart(2)} grilles · ${String(releve[f].faibles.length).padStart(3)} blocs < 4,5:1\n`)
}
await b.close()

fs.mkdirSync(path.join(ICI, 'temoins'), { recursive: true })
fs.writeFileSync(path.join(ICI, 'temoins', quoi + '.json'), JSON.stringify(releve, null, 1))
console.log(`\n→ temoins/${quoi}.json`)

if (quoi === 'apres' && fs.existsSync(path.join(ICI, 'temoins', 'avant.json'))) {
  const av = JSON.parse(fs.readFileSync(path.join(ICI, 'temoins', 'avant.json'), 'utf8'))
  console.log('\n════ DIFF AVANT / APRÈS ════\n')
  let casses = 0
  for (const f of pages) {
    if (!av[f]) { console.log(`  ${f} : page NOUVELLE`); continue }
    const a = av[f], b2 = releve[f], l = []
    if (a.nTailles !== b2.nTailles) l.push(`tailles ${a.nTailles}→${b2.nTailles}`)
    if (Math.abs(a.hauteur - b2.hauteur) > 2) l.push(`hauteur ${a.hauteur}→${b2.hauteur} (${b2.hauteur>a.hauteur?'+':''}${b2.hauteur-a.hauteur})`)
    if (a.faibles.length !== b2.faibles.length) l.push(`blocs<4,5:1 ${a.faibles.length}→${b2.faibles.length}`)
    // LE contrôle qui compte : une grille dont l'écart de bas AUGMENTE
    for (let i = 0; i < Math.min(a.grilles.length, b2.grilles.length); i++) {
      const ga = a.grilles[i], gb = b2.grilles[i]
      if (gb.ecartBas > ga.ecartBas + 1) { l.push(`⚠ GRILLE ${gb.cls} désalignée : bas ${ga.ecartBas}→${gb.ecartBas} px`); casses++ }
    }
    if (a.grilles.length !== b2.grilles.length) { l.push(`⚠ nombre de grilles ${a.grilles.length}→${b2.grilles.length}`); casses++ }
    if (l.length) console.log(`  ${f.replace('.html','').padEnd(18)} ${l.join(' · ')}`)
  }
  console.log(`\n${casses ? '⚠ ' + casses + ' régression(s) de mise en page' : '✓ aucune grille désalignée'}`)
}
