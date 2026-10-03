import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as serveur from '../commun/servir.mjs'

const ICI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SORTIE = path.join(ICI, 'sortie')
const CONFIG = JSON.parse(fs.readFileSync(path.join(SORTIE, 'vercel.json'), 'utf8'))

assert.equal(
  typeof serveur.resoudreFichier,
  'function',
  'le serveur local doit exposer son resolveur de routes',
)

// Les relais vers l'ancien site (destination absolue) ne se résolvent pas en fichier local.
for (const regle of CONFIG.rewrites.filter(r => !/^https?:/.test(r.destination))) {
  assert.equal(
    serveur.resoudreFichier(SORTIE, regle.source),
    path.join(SORTIE, regle.destination),
    `${regle.source} doit servir ${regle.destination}`,
  )
}

assert.equal(
  serveur.resoudreFichier(SORTIE, '/images/logo-loccitane.svg'),
  path.join(SORTIE, 'images/logo-loccitane.svg'),
  'les actifs statiques doivent conserver leur chemin direct',
)

assert.equal(
  serveur.resoudreFichier(SORTIE, '/route-inconnue'),
  path.join(SORTIE, '404.html'),
  'une route inconnue doit afficher la page 404 du site',
)

assert.equal(typeof serveur.statutReponse, 'function', 'le serveur doit distinguer la page 404 de sa route de test')
assert.equal(serveur.statutReponse('/404.html', path.join(SORTIE, '404.html')), 200, 'la sortie 404.html doit rester vérifiable directement')
assert.equal(serveur.statutReponse('/route-inconnue', path.join(SORTIE, '404.html')), 404, 'une URL inconnue doit répondre 404')

console.log(`Audit serveur local : ${CONFIG.rewrites.length} routes propres, actifs et 404 résolus.`)
