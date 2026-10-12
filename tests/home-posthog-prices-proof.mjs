import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const lire = fichier => fs.readFileSync(path.join(racine, 'pages', fichier), 'utf8')
  .replace(/&nbsp;|&#160;|&#8239;|&#x202f;/gi, ' ')
  .replace(/[\u00a0\u202f]/g, ' ')
  .replace(/\s+/g, ' ')

const langues = [
  {
    nom: 'FR',
    home: lire('43-accueil-avant-vendre.html'),
    source: lire('37-compliance-service.html'),
    prix: [
      ['assessment', 'À partir de 399 € par produit'],
      ['labelling', 'À partir de 1 200 € par produit'],
      ['ce-marking', 'À partir de 3 800 € par produit, essais non compris'],
      ['authorised-representative', 'À partir de 1 500 € par an, par catégorie'],
    ],
  },
  {
    nom: 'EN',
    home: lire('43-accueil-avant-vendre-en.html'),
    source: lire('37-compliance-service-en.html'),
    prix: [
      ['assessment', 'From €399 per product'],
      ['labelling', 'From €1,200 per product'],
      ['ce-marking', 'From €3,800 per product, testing excluded'],
      ['authorised-representative', 'From €1,500 per year, per category'],
    ],
  },
]

let passes = 0
for (const langue of langues) {
  for (const [claim, attendu] of langue.prix) {
    const sourceOk = langue.source.includes(attendu)
    const homeOk = langue.home.includes(attendu)
    console.log([langue.nom, claim, 'expected=' + attendu, 'source=' + (sourceOk ? 'PASS' : 'FAIL'), 'home=' + (homeOk ? 'PASS' : 'FAIL')].join(' · '))
    assert.equal(sourceOk, true, langue.nom + ' ' + claim + ' : prix absent de la page Service canonique')
    assert.equal(homeOk, true, langue.nom + ' ' + claim + ' : prix absent de la home')
    passes++
  }
}

assert.equal(passes, 8)
console.log('Verified: 8/8 home price assertions match the canonical Service fragments · 0 unverified')
