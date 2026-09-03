import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ICI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SORTIE = path.join(ICI, 'sortie')
const MANIFESTE = path.join(ICI, 'commun', 'v6-routes.json')
const FAMILLES = new Set([
  'preview', 'home', 'company-proof', 'product', 'audience', 'regulation',
  'resource-index', 'article', 'trust-conversion', 'not-found',
])

const sorties = fs.readdirSync(SORTIE)
  .filter(fichier => fichier.endsWith('.html'))
  .sort()

let manifeste
try {
  manifeste = JSON.parse(fs.readFileSync(MANIFESTE, 'utf8'))
} catch (erreur) {
  console.error(`ECHEC manifeste V6 : ${erreur.message}`)
  process.exit(1)
}

const erreurs = []
const cles = Object.keys(manifeste).sort()
const sortiesSansFamille = sorties.filter(fichier => !manifeste[fichier])
const entreesSupplementaires = cles.filter(fichier => !sorties.includes(fichier))

for (const fichier of sortiesSansFamille) erreurs.push(`${fichier} : famille V6 absente`)
for (const fichier of entreesSupplementaires) erreurs.push(`${fichier} : entrée V6 sans sortie générée`)

for (const fichier of sorties) {
  const famille = manifeste[fichier]
  if (famille && !FAMILLES.has(famille)) erreurs.push(`${fichier} : famille V6 invalide (${famille})`)

  const html = fs.readFileSync(path.join(SORTIE, fichier), 'utf8')
  const page = fichier.replace(/\.html$/, '')
  const corps = html.match(/<body\b[^>]*>/i)?.[0] || ''
  for (const attribut of [
    'data-cleo-ds="v6"',
    `data-v6-family="${famille}"`,
    `data-v6-page="${page}"`,
  ]) {
    if (!corps.includes(attribut)) erreurs.push(`${fichier} : ${attribut} absent du body`)
  }
}

console.log(`Audit structure V6 : ${sorties.length} HTML générés, ${sortiesSansFamille.length} manquant(s), ${entreesSupplementaires.length} en trop.`)
if (erreurs.length) {
  for (const erreur of erreurs) console.error(`ECHEC ${erreur}`)
  assert.fail(`${erreurs.length} échec(s) structurels V6`)
}
