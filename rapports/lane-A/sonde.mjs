/* Sonde lane A : liste NOMMÉE des textes < 14 px, des cibles < 40 px, du
   premier écran à 1280x720 et 390x844, et des contrastes du hero-produit.
   node rapports/lane-A/sonde.mjs 01-accueil [01-accueil-en …] */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import fs from 'fs'
import path from 'path'
import { servir } from '../../commun/servir.mjs'
const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const OUT = path.join(ICI, 'rapports/lane-A')
const cibles = process.argv.slice(2)
const { url } = await servir(path.join(ICI, 'sortie'))
const nav = await chromium.launch()

const CHEMIN = `(e) => { const p=[]; let n=e; while(n && n.nodeType===1 && p.length<4){ p.unshift(n.tagName.toLowerCase()+(n.className&&typeof n.className==='string'?'.'+n.className.trim().split(/\\s+/).slice(0,3).join('.'):'')); n=n.parentElement } return p.join(' > ') }`

const SONDE = `() => {
  const chemin = ${CHEMIN}
  const cs = e => getComputedStyle(e)
  const vis = [...document.querySelectorAll('body *')].filter(e=>{const b=e.getBoundingClientRect();return b.width>0&&b.height>0})
  const textes = vis.filter(e=>e.children.length===0 && e.textContent.trim())
  const petits = {}
  textes.filter(e=>parseFloat(cs(e).fontSize)<14).forEach(e=>{
    const k = chemin(e)+' @'+cs(e).fontSize
    petits[k]=(petits[k]||0)+1
  })
  const petitesCibles = {}
  ;[...document.querySelectorAll('a[href],button')].forEach(e=>{
    const b=e.getBoundingClientRect(); if(!(b.width>0&&b.height>0))return
    if(b.height<40||b.width<40){ const k=chemin(e)+' '+Math.round(b.width)+'x'+Math.round(b.height); petitesCibles[k]=(petitesCibles[k]||0)+1 }
  })
  return { petits, petitesCibles }
}`

const PREMIER = `() => {
  const r = {}
  const vh = window.innerHeight
  const m = (sel,nom) => { const e=document.querySelector(sel); if(!e){r[nom]='absent';return}
    const b=e.getBoundingClientRect(); r[nom]={haut:Math.round(b.top),bas:Math.round(b.bottom),visible:b.top<vh, entier:b.bottom<=vh, part: b.top<vh? Math.round(Math.min(b.bottom,vh)-b.top):0} }
  m('h1','h1'); m('.hero-epure .conteneur p','chapo'); m('.champ-demo','champEmail')
  m('.hero-produit','interface'); m('.hero-produit .ecran-tete','interfaceTete'); m('.hp-fiche','fiche')
  r.viewport = vh
  return r
}`

const ENCRE = `() => {
  const out = []
  document.querySelectorAll('.hero-produit .marqueur, .hero-produit .fiche-ref, .hero-produit .fiche-entete-pays, .hero-produit .pl-champ span, .hero-produit .pl-champ b, .hero-produit .pl-verdict, .hero-produit .t-h3, .hero-produit .fil-ariane, .hero-produit .fiche-nom, .hero-produit .hp-citation .t-caption').forEach(e=>{
    const cs=getComputedStyle(e)
    let bg='rgba(0, 0, 0, 0)', n=e
    while(n && bg==='rgba(0, 0, 0, 0)'){ bg=getComputedStyle(n).backgroundColor; n=n.parentElement }
    out.push({el:e.className||e.tagName, txt:e.textContent.trim().slice(0,34), couleur:cs.color, fond:getComputedStyle(e).backgroundColor==='rgba(0, 0, 0, 0)'?bg:getComputedStyle(e).backgroundColor, taille:cs.fontSize})
  })
  return out
}`

const res = {}
for (const nom of cibles) {
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } })
  const p = await ctx.newPage()
  await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' }); await p.waitForTimeout(500)
  const encre = await p.evaluate(eval('('+ENCRE+')'))
  await ctx.close()

  const c720 = await nav.newContext({ viewport: { width: 1280, height: 720 } })
  const p720 = await c720.newPage()
  await p720.goto(`${url}/${nom}.html`, { waitUntil: 'load' }); await p720.waitForTimeout(600)
  const premier1280 = await p720.evaluate(eval('('+PREMIER+')'))
  fs.mkdirSync(path.join(OUT,'ecrans'),{recursive:true})
  await p720.screenshot({ path: path.join(OUT,'ecrans',`${nom}-1280x720.png`) })
  await c720.close()

  const mctx = await nav.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const mp = await mctx.newPage()
  await mp.goto(`${url}/${nom}.html`, { waitUntil: 'load' }); await mp.waitForTimeout(600)
  const premier390 = await mp.evaluate(eval('('+PREMIER+')'))
  await mp.screenshot({ path: path.join(OUT,'ecrans',`${nom}-390x844.png`) })
  const sondeM = await mp.evaluate(eval('('+SONDE+')'))
  await mctx.close()

  res[nom] = { premier1280, premier390, mobile: sondeM, encreHeroProduit: encre }
}
await nav.close()
fs.writeFileSync(path.join(OUT, 'sonde.json'), JSON.stringify(res, null, 2))
for (const [n, r] of Object.entries(res)) {
  console.log('\n════', n)
  console.log(' premier écran 1280x720 :', JSON.stringify(r.premier1280))
  console.log(' premier écran 390x844  :', JSON.stringify(r.premier390))
  console.log(' — textes < 14 px (mobile) —')
  Object.entries(r.mobile.petits).sort((a,b)=>b[1]-a[1]).forEach(([k,v])=>console.log('   ', v, '×', k))
  console.log(' — cibles < 40 px (mobile) —')
  Object.entries(r.mobile.petitesCibles).forEach(([k,v])=>console.log('   ', v, '×', k))
}
