import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import sharp from '/Users/naomiehalioua/cleo-landing/node_modules/sharp/lib/index.js'
import fs from 'fs'
import { servir } from './commun/servir.mjs'
const { url: URL_SORTIE } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')

const cibles = process.argv.slice(2)
const TRANCHE = 2600, SORTIE_W = 820
fs.mkdirSync('captures', { recursive: true })
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
const soucis = []
page.on('console', m => { if (m.type() === 'error') soucis.push(m.text()) })
page.on('pageerror', e => soucis.push(String(e)))

for (const c of cibles) {
  const nom = c.replace(/\.html$/, '')
  await page.goto(`${URL_SORTIE}/${nom}.html`, { waitUntil: 'load' })
  await page.waitForTimeout(700)
  // la barre de navigation entre maquettes ne fait pas partie de la maquette
  await page.evaluate(() => document.documentElement.classList.add('capture'))
  // Le moteur de mouvement n'entre en action qu'au passage à l'écran :
  // sans ce défilement, une capture pleine page rendrait les blocs vides.
  await page.evaluate(async () => {
    const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 480) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)) }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1200)
  // controles de rendu qui ont deja coute une iteration
  const d = await page.evaluate(() => {
    const cs = getComputedStyle
    const h1 = document.querySelector('h1,h2')
    return {
      hauteur: document.body.scrollHeight,
      debordement: document.documentElement.scrollWidth > window.innerWidth + 1,
      largeurDoc: document.documentElement.scrollWidth,
      police: h1 ? cs(h1).fontFamily.split(',')[0].replace(/["']/g, '') : '(aucun titre)',
      nbNav: [...document.body.children].filter(e => e.tagName === 'NAV').length,
      nbPied: [...document.body.children].filter(e => e.tagName === 'FOOTER').length,
      imagesCassees: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).length,
    }
  })
  const brut = `captures/${nom}-full.png`
  await page.screenshot({ path: brut, fullPage: true })
  const meta = await sharp(brut).metadata()
  const n = Math.ceil(meta.height / TRANCHE)
  for (let i = 0; i < n; i++) {
    const top = i * TRANCHE, h = Math.min(TRANCHE, meta.height - top)
    await sharp(brut).extract({ left: 0, top, width: meta.width, height: h })
      .resize({ width: SORTIE_W }).png({ compressionLevel: 9 }).toFile(`captures/${nom}-${i + 1}.png`)
  }
  fs.unlinkSync(brut)
  // Les tuiles de la construction PRÉCÉDENTE ne s'effacent pas toutes seules.
  // Quand une page raccourcit, la tuile n+1 d'hier survit et se lit comme si
  // elle était d'aujourd'hui. Vécu le 27/08 : 04-secteur-4.png montrait encore
  // un pied de page sombre, régime qui n'existe plus sur cette page.
  for (let i = n + 1; ; i++) {
    const orpheline = `captures/${nom}-${i}.png`
    if (!fs.existsSync(orpheline)) break
    fs.unlinkSync(orpheline)
    console.log(`  ${nom} : tuile orpheline ${i} supprimée`)
  }
  // Contraste du titre, mesuré AU PIXEL : un fond en dégradé ne renvoie
  // rien sur backgroundColor, donc toute lecture par l'arbre DOM se trompe.
  let contraste = null
  try {
    const h = await page.$('h1, .t-hero, .t-display')
    if (h) {
      const b = await h.boundingBox()
      if (b && b.width > 40) {
        const png = await page.screenshot({ clip: { x: Math.max(0, b.x), y: Math.max(0, b.y),
          width: Math.min(1200, b.width), height: Math.min(200, b.height) } })
        const st = await sharp(png).stats()
        const moy = st.channels[0].mean
        const ecart = st.channels[0].stdev
        // un titre lisible a un fort écart-type : du texte contre son fond
        if (ecart < 18) contraste = `titre à faible écart (${Math.round(ecart)})`
      }
    }
  } catch {}

  const alerte = []
  if (d.police !== 'Satoshi') alerte.push(`POLICE=${d.police}`)
  if (d.debordement) alerte.push(`DEBORDE (${d.largeurDoc}px)`)
  if (d.imagesCassees) alerte.push(`${d.imagesCassees} image(s) cassee(s)`)
  if (d.nbNav !== 1) alerte.push(`${d.nbNav} nav`)
  if (d.nbPied !== 1) alerte.push(`${d.nbPied} pied`)
  if (contraste) alerte.push(contraste)
  console.log(`${nom.padEnd(18)} ${String(d.hauteur).padStart(6)} px  ${n} tranches  ${alerte.length ? '⚠ ' + alerte.join(' | ') : 'OK'}`)
}
if (soucis.length) console.log('\nErreurs console :\n' + soucis.slice(0, 5).join('\n'))
await browser.close()
