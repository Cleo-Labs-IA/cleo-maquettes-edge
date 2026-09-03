import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ICI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const manifeste = JSON.parse(fs.readFileSync(path.join(ICI, 'commun', 'v6-routes.json'), 'utf8'))
const html = fs.readFileSync(path.join(ICI, 'sortie', 'index.html'), 'utf8')
const contenuVisible = html.replace(/<style\b[\s\S]*?<\/style>/gi, '')

const attendus = Object.keys(manifeste).filter(fichier => fichier !== 'index.html').sort()
const liens = [...html.matchAll(/href="([^"]+\.html)"/g)]
  .map(resultat => resultat[1])
  .filter(fichier => manifeste[fichier])
const uniques = [...new Set(liens)].sort()

assert.deepEqual(uniques, attendus, 'la galerie doit donner accès à chaque sortie V6 une seule fois au minimum')
assert.ok(!/\bV5\b/.test(contenuVisible), 'la galerie V6 ne doit plus se présenter comme V5')
assert.match(contenuVisible, /Toutes les pages du site/i, 'le hero doit annoncer la galerie exhaustive')

console.log(`Audit galerie V6 : ${uniques.length}/${attendus.length} sorties accessibles, copie V6.`)
