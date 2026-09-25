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
  const htmlVisible = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
  const page = fichier.replace(/\.html$/, '')
  const corps = html.match(/<body\b[^>]*>/i)?.[0] || ''
  for (const attribut of [
    'data-cleo-ds="v6"',
    `data-v6-family="${famille}"`,
    `data-v6-page="${page}"`,
  ]) {
    if (!corps.includes(attribut)) erreurs.push(`${fichier} : ${attribut} absent du body`)
  }
  if (fichier === '01-accueil-noir.html' && /--c-surface:\s*#181818/i.test(html)) {
    erreurs.push(`${fichier} : l'ancien régime noir ne doit pas recouvrir la direction V6`)
  }
  if (/\bV5\b/.test(htmlVisible)) erreurs.push(`${fichier} : mention V5 visible dans une sortie V6`)
  if (/Les 22 pages/.test(htmlVisible)) erreurs.push(`${fichier} : ancien libellé de galerie incomplet`)
}

const adaptationsFamilles = fs.readFileSync(path.join(ICI, 'commun', 'lanes', 'v6-families.css'), 'utf8')
if (!/data-v6-page="20-campagne"[^{}]*\.pilule-dispo\s+\.point\s*\{[^}]*background:var\(--cleo-v6-signal\)/s.test(adaptationsFamilles)) {
  erreurs.push('20-campagne.html : le point decoratif vert doit employer le signal bleu V6')
}
if (!/data-v6-page="00-composants"[^{}]*>\s*section:first-of-type[^{}]*\{[^}]*background:[^}]*--cleo-v6-deep/s.test(adaptationsFamilles)) {
  erreurs.push('00-composants.html : le hero hors main doit recevoir le champ profond V6')
}

const sourceCitation = fs.readFileSync(path.join(ICI, 'depot-src', 'DecathlonQuote.tsx'), 'utf8')
const citationEn = sourceCitation.match(/en:\s*'([^']+)'/)?.[1]
  ?.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
  .slice(1, 80)
const serviceEn = fs.readFileSync(path.join(SORTIE, '37-compliance-service-en.html'), 'utf8')
/* 23/09/2026, Naomie : « pas la quote Decathlon dans Service ». La citation ne figure plus sur la page ;
   si elle y revient, elle doit rester verbatim. */
if (serviceEn.includes('<blockquote') && (!citationEn || !serviceEn.includes(citationEn))) {
  erreurs.push('37-compliance-service-en.html : citation anglaise non verbatim')
}

console.log(`Audit structure V6 : ${sorties.length} HTML générés, ${sortiesSansFamille.length} manquant(s), ${entreesSupplementaires.length} en trop.`)
if (erreurs.length) {
  for (const erreur of erreurs) console.error(`ECHEC ${erreur}`)
  assert.fail(`${erreurs.length} échec(s) structurels V6`)
}
