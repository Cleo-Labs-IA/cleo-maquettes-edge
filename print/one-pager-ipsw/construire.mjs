// Assemble le one-pager A4 recto/verso, mesure le rendu print, exporte PDF + PNG.
// Usage : node construire.mjs [--mesure]
//
// Les valeurs qui comptent ne sont jamais tapees ici : la citation Decathlon est
// LUE dans le composant de la landing, le logo dans public/, la police dans le
// depot des maquettes. Le verbatim est donc verifie par construction.
// Chiffres du livrable : aucun n'est ecrit dans ce script ; le log d'assertions
// vit dans assertions.md (8/8 verified against source) et se rejoue avec
// `node one-pager-proof.mjs`.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import QRCode from './node_modules/qrcode/lib/index.js'

const ICI = path.dirname(fileURLToPath(import.meta.url))
const HOME = process.env.HOME
const MAQUETTES = path.resolve(ICI, '../..')

const SRC = {
  logo: path.join(HOME, 'cleo-landing/public/logo-blue.svg'),
  police: path.join(MAQUETTES, 'sortie/fonts/Satoshi-Variable.woff2'),
  citation: path.join(HOME, 'cleo-landing/src/components/landing/DecathlonQuote.tsx'),
}

// ── La citation, extraite du composant, jamais retapee ────────────────────────
function citationEn() {
  const src = fs.readFileSync(SRC.citation, 'utf8')
  const m = src.match(/en:\s*'((?:[^'\\]|\\.)*)'/)
  if (!m) throw new Error('citation EN introuvable dans DecathlonQuote.tsx')
  return m[1].replace(/\\'/g, "'").replace(/\\u2019/g, '’')
}

// ── La masse et l'unique : 26 colonnes, 4 rangees, UN SEUL element colore ─────
function masse(total = 104, index = 57) {
  return Array.from({ length: total }, (_, i) =>
    i === index ? '<i class="trouve"></i>' : '<i></i>'
  ).join('')
}

const qr = await QRCode.toString('https://cleolabs.co/en/meet', {
  type: 'svg', errorCorrectionLevel: 'M', margin: 0,
  color: { dark: '#08093B', light: '#FFFFFF' },
})

const logo = fs.readFileSync(SRC.logo, 'utf8').trim()
const html = fs
  .readFileSync(path.join(ICI, 'one-pager.template.html'), 'utf8')
  .split('{{FONT_VAR}}').join(fs.readFileSync(SRC.police).toString('base64'))
  .split('{{LOGO_BLUE}}').join(logo)
  .split('{{LOGO_INK}}').join(logo.split('#0008CF').join('#08093B'))
  .split('{{MASSE}}').join(masse())
  .split('{{QUOTE_EN}}').join(citationEn())
  .split('{{QR}}').join(qr.replace(/<\?xml[^>]*\?>/, '').trim())

const cible = path.join(ICI, 'one-pager.html')
fs.writeFileSync(cible, html)
console.log('html assemble :', (html.length / 1024).toFixed(0) + ' ko')

// ── Mesures au navigateur, en media print ────────────────────────────────────
const navigateur = await chromium.launch()
const page = await navigateur.newPage({ viewport: { width: 900, height: 1400 } })
const soucis = []
page.on('pageerror', (e) => soucis.push(String(e)))
await page.goto('file://' + cible)
await page.emulateMedia({ media: 'print' })
await page.waitForTimeout(400)

const mesures = await page.evaluate(() => {
  const HAUTEUR_A4 = 297 // mm
  const enMm = (px) => px / (document.querySelector('.page').getBoundingClientRect().height / HAUTEUR_A4)
  const pages = [...document.querySelectorAll('.page')]

  const debordements = []
  const monospaces = new Set()
  document.querySelectorAll('*').forEach((el) => {
    const f = getComputedStyle(el).fontFamily.toLowerCase()
    if (/mono|courier/.test(f)) monospaces.add(el.tagName + '.' + el.className)
  })

  const parPage = pages.map((p, i) => {
    const boite = p.getBoundingClientRect()
    const flux = [...p.children].filter((c) => getComputedStyle(c).position !== 'absolute')
    const ancre = [...p.children].find((c) => getComputedStyle(c).position === 'absolute')
    const basFlux = flux.length ? flux[flux.length - 1].getBoundingClientRect().bottom : boite.top
    const hautAncre = ancre ? ancre.getBoundingClientRect().top : boite.bottom

    // tout element dont le bas depasse la feuille = contenu coupe en silence
    p.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.height > 0 && (r.bottom > boite.bottom + 1 || r.right > boite.right + 1)) {
        debordements.push(`p${i + 1} ${el.tagName}.${String(el.className).slice(0, 30)}`)
      }
    })

    return {
      page: i + 1,
      contenuMm: +enMm(basFlux - boite.top).toFixed(1),
      airAvantPiedMm: +enMm(hautAncre - basFlux).toFixed(1),
    }
  })

  return {
    parPage,
    debordements: [...new Set(debordements)],
    monospaces: [...monospaces],
    masseColorees: document.querySelectorAll('.masse .trouve').length,
    massesTotal: document.querySelectorAll('.masse').length,
    champsProfonds: pages.map((p) => p.querySelectorAll('.profond').length),
  }
})

console.log('\n── Mesures ────────────────────────────────')
mesures.parPage.forEach((m) =>
  console.log(`  page ${m.page} : contenu ${m.contenuMm} mm sur 297, air avant le pied ${m.airAvantPiedMm} mm`)
)
console.log('  elements coupes ou debordants :', mesures.debordements.length ? mesures.debordements.join(', ') : 'aucun')
console.log('  monospace :', mesures.monospaces.length ? mesures.monospaces.join(', ') : 'aucune')
console.log('  masse :', mesures.masseColorees, 'element colore pour', mesures.massesTotal, 'grille(s)')
console.log('  champ profond par page :', mesures.champsProfonds.join(' / '))
if (soucis.length) console.log('  erreurs de page :', soucis.join(' | '))

const bloquant = []
if (mesures.debordements.length) bloquant.push('contenu coupe')
if (mesures.monospaces.length) bloquant.push('monospace presente')
if (mesures.masseColorees !== 1 || mesures.massesTotal !== 1) bloquant.push('la masse doit avoir un seul element colore')
if (mesures.champsProfonds.some((n) => n !== 1)) bloquant.push('un seul champ profond par page')
mesures.parPage.forEach((m) => {
  if (m.contenuMm > 297) bloquant.push(`page ${m.page} deborde de la feuille`)
  if (m.airAvantPiedMm < 3) bloquant.push(`page ${m.page} colle son pied au contenu`)
})

if (process.argv.includes('--mesure')) {
  await navigateur.close()
  if (bloquant.length) { console.error('\nBLOQUANT : ' + bloquant.join(' · ')); process.exit(1) }
  console.log('\nMesures seules, rien ecrit.')
  process.exit(0)
}

// ── PNG a l'ecran, PDF en print ──────────────────────────────────────────────
await page.emulateMedia({ media: 'screen' })
const feuilles = await page.locator('.page').all()
for (let i = 0; i < feuilles.length; i++) {
  await feuilles[i].screenshot({ path: path.join(ICI, `apercu-${i === 0 ? 'recto' : 'verso'}.png`) })
}

await page.emulateMedia({ media: 'print' })
await page.pdf({
  path: path.join(ICI, 'cleo-one-pager-a4.pdf'),
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: 0, bottom: 0, left: 0, right: 0 },
})
await navigateur.close()

const ko = (f) => (fs.statSync(path.join(ICI, f)).size / 1024).toFixed(0) + ' ko'
console.log('\nEcrits : cleo-one-pager-a4.pdf (' + ko('cleo-one-pager-a4.pdf') + '), apercu-recto.png, apercu-verso.png')
if (bloquant.length) { console.error('BLOQUANT : ' + bloquant.join(' · ')); process.exit(1) }
