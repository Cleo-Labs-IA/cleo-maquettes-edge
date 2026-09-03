/* Lane A, passe 2 — le POIDS OPTIQUE de chaque logo de la bande, mesuré sur le
   rendu réel (opacité et niveaux de gris compris), pas sur le fichier source.
   node rapports/lane-A/poids-logos.mjs [etat]
   Pour chaque cellule : capture 2×, puis somme des écarts au fond.
     encre   = pixels plus sombres que le fond de plus de 6 niveaux
     masse   = Σ (fond − pixel) sur la cellule, en points de gris × pixels CSS
   La masse est le nombre qui compte : c'est ce que l'œil pèse. */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import sharp from '/Users/naomiehalioua/cleo-landing/node_modules/sharp/lib/index.js'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
import fs from 'fs'

const ETAT = process.argv[2] || 'etat'
const TMP = '/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/77724e1d-6c76-4bb6-9b53-34a4ebd4503a/scratchpad'
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const nav = await chromium.launch()
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })
const p = await ctx.newPage()
await p.goto(`${url}/01-accueil.html`, { waitUntil: 'networkidle' })
await p.waitForTimeout(700)

const rects = await p.$$eval('.bande-logos .cellule', cs => cs.map(c => {
  const i = c.querySelector('img'), b = i.getBoundingClientRect()
  return { alt: i.alt, w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10, y: Math.round(b.y), bas: Math.round(b.y + b.height) }
}))
const lignes = []
for (let k = 0; k < rects.length; k++) {
  const f = `${TMP}/cell-${ETAT}-${k}.png`
  await p.locator('.bande-logos .cellule').nth(k).screenshot({ path: f })
  const { data, info } = await sharp(f).greyscale().raw().toBuffer({ resolveWithObject: true })
  const fond = data[0]                         // le coin haut-gauche est le fond
  let encre = 0, masse = 0
  for (let i = 0; i < data.length; i++) { const d = fond - data[i]; if (d > 6) { encre++; masse += d } }
  lignes.push({
    ...rects[k], fond,
    encrePx: Math.round(encre / 4),             // 2× → pixels CSS
    masse: Math.round(masse / 4 / 1000),        // en milliers de points·px CSS
    grisMoyen: encre ? Math.round(masse / encre) : 0
  })
}
await nav.close()
fs.writeFileSync(`/Users/naomiehalioua/cleo-maquettes-edge/rapports/lane-A/poids-logos-${ETAT}.json`, JSON.stringify(lignes, null, 1))
console.log('logo             larg × haut   haut(y..bas)  encre px²   masse (k)  gris moyen')
for (const l of lignes) console.log(l.alt.padEnd(16), String(l.w).padStart(6), '×', String(l.h).padStart(4), '  ', String(l.y).padStart(5) + '..' + String(l.bas).padStart(5), String(l.encrePx).padStart(9), String(l.masse).padStart(10), String(l.grisMoyen).padStart(10))
const m = lignes.map(l => l.masse)
console.log(`écart de masse : min ${Math.min(...m)} k, max ${Math.max(...m)} k, rapport ${(Math.max(...m) / Math.min(...m)).toFixed(2)}×`)
const c = lignes.map(l => l.bas - l.y)
console.log(`hauteurs rendues : ${lignes.map(l => l.h).join(', ')} · centres verticaux : ${lignes.map(l => Math.round(l.y + l.h / 2)).join(', ')}`)
process.exit(0)
