/* Capture d'une page construite, desktop 1440 ET téléphone 390, avec les
   mesures qui ont fondé l'audit du 03/09/2026. Sert sortie/ en HTTP (les
   images sont en /images/… depuis ce jour).

   node commun/capture2.mjs 01-accueil [03-offre …]
   → captures/lane/<nom>-d1..n.png (desktop, 960 px de large pour la lecture)
   → captures/lane/<nom>-m1..n.png (téléphone, 390 px)
   → captures/lane/<nom>-mesures.json et un résumé sur la sortie standard

   Les seuils sont ceux de l'audit : cible tactile ≥ 40 px, texte ≥ 14 px sur
   téléphone, aucun débordement horizontal, aucun href="#". */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import sharp from '/Users/naomiehalioua/cleo-landing/node_modules/sharp/lib/index.js'
import fs from 'fs'
import path from 'path'
import { servir } from './servir.mjs'

const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const SORTIE = path.join(ICI, 'sortie')
const OUT = path.join(ICI, 'captures/lane')
fs.mkdirSync(OUT, { recursive: true })
const cibles = process.argv.slice(2).map(c => c.replace(/\.html$/, ''))
if (!cibles.length) { console.log('usage : node commun/capture2.mjs 01-accueil [03-offre …]'); process.exit(1) }
const { url } = await servir(SORTIE)
const browser = await chromium.launch()

async function defiler(page) {
  await page.evaluate(async () => {
    const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 480) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)) }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(900)
}
async function trancher(brut, prefixe, tranche, largeur) {
  const meta = await sharp(brut).metadata()
  const n = Math.ceil(meta.height / tranche)
  for (let i = 0; i < n; i++) {
    const top = i * tranche, h = Math.min(tranche, meta.height - top)
    await sharp(brut).extract({ left: 0, top, width: meta.width, height: h }).resize({ width: largeur }).png({ compressionLevel: 9 }).toFile(`${prefixe}${i + 1}.png`)
  }
  for (let i = n + 1; fs.existsSync(`${prefixe}${i}.png`); i++) fs.unlinkSync(`${prefixe}${i}.png`)
  fs.unlinkSync(brut)
  return n
}
const MESURES = () => {
  const cs = e => getComputedStyle(e)
  const h1 = document.querySelector('h1')
  const visibles = [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 })
  const textes = visibles.filter(e => e.children.length === 0 && e.textContent.trim())
  const petits = textes.filter(e => parseFloat(cs(e).fontSize) < 14).length
  const sous12 = textes.filter(e => parseFloat(cs(e).fontSize) < 12).length
  const cibles = [...document.querySelectorAll('a[href],button')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && (b.height < 40 || b.width < 40) }).length
  const paras = [...document.querySelectorAll('p')].map(p => p.getBoundingClientRect().width).filter(w => w > 0)
  return {
    largeurDoc: document.documentElement.scrollWidth, largeurFenetre: window.innerWidth,
    debordement: document.documentElement.scrollWidth > window.innerWidth + 1,
    hauteur: document.body.scrollHeight,
    h1: h1 ? { texte: h1.textContent.trim().replace(/\s+/g, ' ').slice(0, 80), taille: cs(h1).fontSize, graisse: cs(h1).fontWeight, classe: h1.className } : null,
    nbH1: document.querySelectorAll('h1').length,
    liensMorts: document.querySelectorAll('a[href="#"]').length,
    champsFiges: document.querySelectorAll('input[disabled]').length,
    textesSous14: petits, textesSous12: sous12, ciblesSous40: cibles,
    paragrapheLePlusLarge: paras.length ? Math.round(Math.max(...paras)) : 0,
    imagesSansAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length,
    imagesCassees: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).length,
    pied: document.querySelector('footer') ? Math.round(document.querySelector('footer').getBoundingClientRect().height) : null,
    main: !!document.querySelector('main'), burger: !!document.querySelector('.nav-burger'),
    police: h1 ? cs(h1).fontFamily.split(',')[0].replace(/["']/g, '') : null,
    titre: document.title, description: document.querySelector('meta[name=description]')?.content?.length || 0,
  }
}

for (const nom of cibles) {
  if (!fs.existsSync(path.join(SORTIE, nom + '.html'))) { console.log(`${nom} : pas dans sortie/, construire d'abord`); continue }
  const erreurs = []
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const page = await ctx.newPage()
  page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text().slice(0, 160)) })
  page.on('pageerror', e => erreurs.push(String(e).slice(0, 160)))
  await page.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
  await page.waitForTimeout(600); await defiler(page)
  const desktop = await page.evaluate(MESURES)
  await page.screenshot({ path: `${OUT}/${nom}-brut-d.png`, fullPage: true })
  const nd = await trancher(`${OUT}/${nom}-brut-d.png`, `${OUT}/${nom}-d`, 2400, 960)
  await ctx.close()

  const mctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  const mp = await mctx.newPage()
  await mp.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
  await mp.waitForTimeout(600); await defiler(mp)
  const mobile = await mp.evaluate(MESURES)
  await mp.screenshot({ path: `${OUT}/${nom}-brut-m.png`, fullPage: true })
  const nm = await trancher(`${OUT}/${nom}-brut-m.png`, `${OUT}/${nom}-m`, 3200, 390)
  await mctx.close()

  const r = { nom, desktop, mobile, tranches: { desktop: nd, mobile: nm }, erreursConsole: erreurs, capture: new Date().toISOString() }
  fs.writeFileSync(`${OUT}/${nom}-mesures.json`, JSON.stringify(r, null, 2))
  const alertes = []
  if (desktop.nbH1 !== 1) alertes.push(`h1 ×${desktop.nbH1}`)
  if (desktop.liensMorts) alertes.push(`${desktop.liensMorts} href="#"`)
  if (desktop.champsFiges) alertes.push(`${desktop.champsFiges} input disabled`)
  if (desktop.debordement || mobile.debordement) alertes.push('débordement horizontal')
  if (mobile.textesSous14) alertes.push(`${mobile.textesSous14} textes < 14 px (mobile)`)
  if (mobile.ciblesSous40) alertes.push(`${mobile.ciblesSous40} cibles < 40 px (mobile)`)
  if (desktop.imagesSansAlt) alertes.push(`${desktop.imagesSansAlt} img sans alt`)
  if (desktop.imagesCassees || mobile.imagesCassees) alertes.push('image cassée')
  if (desktop.paragrapheLePlusLarge > 760) alertes.push(`paragraphe à ${desktop.paragrapheLePlusLarge} px`)
  if (erreurs.length) alertes.push(`${erreurs.length} erreur(s) console`)
  console.log(`${nom.padEnd(24)} h1 ${desktop.h1 ? desktop.h1.taille : '—'} | desktop ${desktop.hauteur} px, ${nd} tranches | mobile ${mobile.hauteur} px, ${nm} tranches | pied ${desktop.pied} px | ${alertes.length ? '⚠ ' + alertes.join(' · ') : 'OK'}`)
}
await browser.close()
