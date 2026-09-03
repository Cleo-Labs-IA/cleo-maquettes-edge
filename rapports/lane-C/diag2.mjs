/* Lane C, passe 2. Seuils de la seconde passe : aucun texte sous 13 px en
   desktop, sous 14 px sur telephone ; cible >= 40 px ; paragraphe <= 720 px ;
   aucun debordement, aucun chevauchement.
   Ajoute la geometrie des deux points de l'audit :
   - 10 : la bande citation de 06, le vide a droite ;
   - 11 : la grille d'equipe de 02, l'ordonnee de chaque nom.
   node rapports/lane-C/diag2.mjs 02-entreprise 04-secteur ... */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import fs from 'fs'
import path from 'path'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'

const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const SORTIE = path.join(ICI, 'sortie')
const cibles = process.argv.slice(2)
const { url } = await servir(SORTIE)
const browser = await chromium.launch()

const chemin = (e) => {
  const bouts = []
  let n = e
  while (n && n.nodeType === 1 && bouts.length < 4) {
    let s = n.tagName.toLowerCase()
    if (n.className && typeof n.className === 'string') s += '.' + n.className.trim().split(/\s+/).slice(0, 3).join('.')
    bouts.unshift(s)
    n = n.parentElement
  }
  return bouts.join(' > ')
}

const SONDE = ({ cheminSrc, plancher }) => {
  const chemin = new Function('return ' + cheminSrc)()
  const cs = e => getComputedStyle(e)
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 }
  // les maquettes d'application sont hors perimetre, comme dans l'audit
  const dansApp = e => !!e.closest('.ecran-app')
  const feuilles = [...document.querySelectorAll('body *')]
    .filter(e => vis(e) && e.children.length === 0 && e.textContent.trim() && !dansApp(e))
  const petits = feuilles.filter(e => parseFloat(cs(e).fontSize) < plancher)
    .map(e => ({ px: cs(e).fontSize, t: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 48), c: chemin(e) }))
  const petitesCibles = [...document.querySelectorAll('a[href],button')]
    .filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && !dansApp(e) && (b.height < 40 || b.width < 40) })
    .map(e => { const b = e.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height), t: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 36), c: chemin(e) } })
  const paras = [...document.querySelectorAll('p,li')].filter(e => vis(e) && !dansApp(e) && e.textContent.trim().length > 60)
    .map(e => ({ w: Math.round(e.getBoundingClientRect().width), t: e.textContent.trim().slice(0, 40), c: chemin(e) }))
  const parasLarges = paras.filter(p => p.w > 720)
  const largeurMax = paras.length ? Math.max(...paras.map(p => p.w)) : 0
  const deborde = [...document.querySelectorAll('body *')]
    .filter(e => vis(e) && !dansApp(e) && e.scrollWidth > e.clientWidth + 2 && !['auto', 'scroll'].includes(cs(e).overflowX))
    .map(e => ({ sw: e.scrollWidth, cw: e.clientWidth, c: chemin(e), t: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 36) })).slice(0, 12)
  return {
    petits, petitesCibles, parasLarges, largeurMax, deborde,
    debordementH: document.documentElement.scrollWidth > window.innerWidth + 1,
    hauteur: document.body.scrollHeight,
  }
}

// ── geometries ciblees ────────────────────────────────────────────
const GEO_CITATION = () => {
  const sec = document.querySelector('.seg-citation')
  if (!sec) return null
  const bande = sec.closest('section')
  const b = bande.getBoundingClientRect()
  const cont = sec.closest('.conteneur').getBoundingClientRect()
  const g = sec.getBoundingClientRect()
  const cite = sec.querySelector('.citation-longue')?.getBoundingClientRect()
  const img = sec.querySelector('img')?.getBoundingClientRect()
  const enfants = [...sec.children].map(e => { const r = e.getBoundingClientRect(); return { c: e.className || e.tagName, x: Math.round(r.x), r: Math.round(r.right), w: Math.round(r.width), h: Math.round(r.height) } })
  const paraPx = getComputedStyle(sec.querySelector('.citation-longue p')).fontSize
  return {
    bande: { w: Math.round(b.width), h: Math.round(b.height) },
    conteneur: { x: Math.round(cont.x), r: Math.round(cont.right), w: Math.round(cont.width) },
    grille: { x: Math.round(g.x), r: Math.round(g.right), w: Math.round(g.width), h: Math.round(g.height) },
    citation: cite ? { x: Math.round(cite.x), r: Math.round(cite.right), w: Math.round(cite.width) } : null,
    portrait: img ? { x: Math.round(img.x), w: Math.round(img.width), h: Math.round(img.height) } : null,
    videADroite: Math.round(cont.right - g.right),
    enfants, paraPx,
    colonnes: getComputedStyle(sec).gridTemplateColumns,
  }
}

const GEO_EQUIPE = () => {
  const grille = document.querySelector('.seg-equipe')
  if (!grille) return null
  const cartes = [...grille.children].map(c => {
    const r = c.getBoundingClientRect()
    const nom = c.querySelector('.nom') || c.querySelector('.phrase')
    const role = c.querySelector('.role')
    const marq = c.querySelector('.marqueurs')
    const bas = c.querySelector('.bas')
    return {
      classe: c.className,
      carte: { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), w: Math.round(r.width), h: Math.round(r.height) },
      nom: nom ? { texte: nom.textContent.trim().slice(0, 28), y: Math.round(nom.getBoundingClientRect().y + window.scrollY), h: Math.round(nom.getBoundingClientRect().height) } : null,
      role: role ? { texte: role.textContent.trim().replace(/\s+/g, ' ').slice(0, 60), y: Math.round(role.getBoundingClientRect().y + window.scrollY), h: Math.round(role.getBoundingClientRect().height), lignes: Math.round(role.getBoundingClientRect().height / parseFloat(getComputedStyle(role).lineHeight)) } : null,
      marqueurs: marq ? { y: Math.round(marq.getBoundingClientRect().y + window.scrollY), h: Math.round(marq.getBoundingClientRect().height) } : null,
      bas: bas ? { y: Math.round(bas.getBoundingClientRect().y + window.scrollY), h: Math.round(bas.getBoundingClientRect().height) } : null,
    }
  })
  return { colonnes: getComputedStyle(grille).gridTemplateColumns, cartes }
}

const out = {}
for (const nom of cibles) {
  const r = { nom }
  for (const [mode, vp, plancher] of [['desktop', { width: 1440, height: 900 }, 13], ['mobile', { width: 390, height: 844 }, 14]]) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: mode === 'mobile', hasTouch: mode === 'mobile' })
    const page = await ctx.newPage()
    await page.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
    await page.waitForTimeout(400)
    await page.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 30)) } window.scrollTo(0, 0) })
    await page.waitForTimeout(600)
    r[mode] = await page.evaluate(SONDE, { cheminSrc: chemin.toString(), plancher })
    if (mode === 'desktop') {
      r.citation = await page.evaluate(GEO_CITATION)
      r.equipe = await page.evaluate(GEO_EQUIPE)
    }
    await ctx.close()
  }
  out[nom] = r
  console.log(`\n===== ${nom} =====  desktop ${r.desktop.hauteur} px, mobile ${r.mobile.hauteur} px`)
  for (const [mode, seuil] of [['desktop', 13], ['mobile', 14]]) {
    const g = {}
    for (const p of r[mode].petits) { const k = p.px + ' | ' + p.c; (g[k] ||= []).push(p.t) }
    console.log(`-- ${mode}, textes < ${seuil} px : ${r[mode].petits.length}`)
    for (const k of Object.keys(g)) console.log(`     ${k}  x${g[k].length}  ex: ${g[k][0]}`)
    console.log(`-- ${mode}, cibles < 40 px : ${r[mode].petitesCibles.length}`)
    for (const c of r[mode].petitesCibles) console.log(`     ${c.w}x${c.h}  ${c.c}  << ${c.t} >>`)
    console.log(`-- ${mode}, paragraphe le plus large : ${r[mode].largeurMax} px ; > 720 : ${r[mode].parasLarges.length}`)
    for (const p of r[mode].parasLarges) console.log(`     ${p.w}px  ${p.c}  << ${p.t} >>`)
    console.log(`-- ${mode}, debordement horizontal : ${r[mode].debordementH} ; interne : ${r[mode].deborde.length}`)
    for (const d of r[mode].deborde) console.log(`     ${d.sw}>${d.cw}  ${d.c}  << ${d.t} >>`)
  }
  if (r.citation) console.log('-- bande citation :', JSON.stringify(r.citation))
  if (r.equipe) { console.log('-- grille equipe :', r.equipe.colonnes); for (const c of r.equipe.cartes) console.log('     ', JSON.stringify(c)) }
}
fs.writeFileSync(path.join(ICI, 'rapports/lane-C/diag2.json'), JSON.stringify(out, null, 2))
await browser.close()
process.exit(0)
