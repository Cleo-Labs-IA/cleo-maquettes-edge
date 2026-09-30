import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
assert.equal(pkg.dependencies['sanitize-html'], '2.17.7')
assert.equal(pkg.dependencies.sharp, '0.35.5')
assert.equal(pkg.devDependencies.vercel, '59.16.0')

const workflow = fs.readFileSync('.github/workflows/site.yml', 'utf8')
assert.doesNotMatch(workflow, /(?:^|\s)(?:--token|-t)(?:\s|$)/m, 'le token Vercel ne doit jamais être un argument CLI')
assert.doesNotMatch(workflow, /npx\s+(?:--yes\s+)?vercel/i, 'le workflow utilise uniquement la version verrouillée')
assert.match(workflow, /\.\/node_modules\/\.bin\/vercel/)
assert.match(workflow, /scripts\/rediger-sortie\.mjs/)
assert.match(workflow, /\| env -u VERCEL_TOKEN node -e/, 'le parseur suivant le fetch Vercel ne doit pas recevoir VERCEL_TOKEN')
assert.equal((workflow.match(/env -u VERCEL_TOKEN scripts\/controle-en-ligne\.sh/g) || []).length, 2,
  'les deux contrôles en ligne doivent être lancés sans VERCEL_TOKEN')

const relais = fs.readFileSync('scripts/relais-ci.sh', 'utf8')
const commandesCurl = [workflow, relais].map(source => source.replace(/\\\n\s*/g, ' ')).join('\n')
assert.doesNotMatch(commandesCurl, /\bcurl\b[^\n]*(?:\$(?:\{)?[A-Z0-9_]*(?:TOKEN|SECRET|KEY)|Authorization:\s*Bearer\s*\$)/,
  'aucun secret ne doit être interpolé dans argv de curl')
assert.match(workflow, /node scripts\/curl-auth\.mjs VERCEL_TOKEN/)
assert.match(relais, /node scripts\/curl-auth\.mjs LANDING_TOKEN/)
for (const test of ['tests/blog-securite.mjs', 'tests/securite-critique.mjs', 'tests/csp-atlas-browser.mjs', 'tests/csp-formulaires-browser.mjs']) {
  assert.match(relais, new RegExp(test.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${test} doit appartenir au relais CI`)
}

const construction = fs.readFileSync('construire.mjs', 'utf8')
assert.match(construction, /Content-Security-Policy/)
assert.match(construction, /script-src-attr 'none'/)
assert.match(construction, /object-src 'none'/)
assert.match(construction, /frame-ancestors 'none'/)
assert.doesNotMatch(construction, /unpkg\.com|cdn\.jsdelivr\.net/)
assert.match(construction, /vendor['"], ['"]atlas/)
assert.match(construction, /sortie['"], ['"]assets['"], ['"]atlas/)

const atlas = '/assets/atlas'
for (const fichier of ['pages/26-legal-data.html', 'pages/26-legal-data-en.html']) {
  const page = fs.readFileSync(fichier, 'utf8')
  assert.doesNotMatch(page, /https:\/\/(?:unpkg\.com|cdn\.jsdelivr\.net)/, `${fichier} ne doit plus dépendre d'un CDN`)
  assert.match(page, new RegExp(`${atlas}/leaflet\\.css`))
  assert.match(page, new RegExp(`${atlas}/leaflet\\.js`))
  assert.match(page, new RegExp(`${atlas}/topojson-client\\.min\\.js`))
  assert.match(page, new RegExp(`${atlas}/countries-110m\\.json`))
}

const actifs = [
  ['leaflet.css', 'sha256', 'p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='],
  ['leaflet.js', 'sha256', '20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='],
  ['topojson-client.min.js', 'sha384', 'Ukv1p/xTma6P4/2bY5KzWBw+ydSpXmhCMtyciIQVDJ1RmOxtCYNMF1uXT9T63H67'],
  ['countries-110m.json', 'sha384', 'yOCJ+8ShBm8UDqtAVtAvxTDDf4gXo5edxl/YG0FmVC5OTmqVLl7utuVGBDEeZWHf'],
]
for (const [nom, algorithme, attendu] of actifs) {
  const fichier = path.join('vendor', 'atlas', nom)
  assert.ok(fs.existsSync(fichier), `actif atlas absent : ${fichier}`)
  const digest = crypto.createHash(algorithme).update(fs.readFileSync(fichier)).digest('base64')
  assert.equal(digest, attendu, `digest inattendu : ${fichier}`)
}
for (const nom of ['LICENSE.leaflet', 'LICENSE.topojson-client', 'LICENSE.world-atlas', 'PROVENANCE.md']) {
  const fichier = path.join('vendor', 'atlas', nom)
  assert.ok(fs.existsSync(fichier) && fs.statSync(fichier).size > 50, `licence/provenance absente : ${fichier}`)
}
const provenance = fs.readFileSync('vendor/atlas/PROVENANCE.md', 'utf8')
for (const [, algorithme, digest] of actifs) assert.match(provenance, new RegExp(`${algorithme}-${digest.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))
assert.match(provenance, /topojson-client@3\.1\.0\/dist\/topojson-client\.min\.js/)
assert.match(provenance, /world-atlas@2\.0\.2\/countries-110m\.json/)
assert.doesNotMatch(provenance, /topojson-client@3\/dist|world-atlas@2\/countries/)

const jetonSentinelle = 'argv-leak-sentinel-9f4d52c88be1'
const temporaire = fs.mkdtempSync(path.join(os.tmpdir(), 'cleo-curl-auth-'))
try {
  const fauxCurl = path.join(temporaire, 'curl')
  fs.writeFileSync(fauxCurl, `#!${process.execPath}\nlet entree = ''\nprocess.stdin.setEncoding('utf8')\nprocess.stdin.on('data', d => { entree += d })\nprocess.stdin.on('end', () => process.stdout.write(JSON.stringify({ argv: process.argv.slice(2), jetonEnfant: process.env.TEST_TOKEN || null, entree })))\n`)
  fs.chmodSync(fauxCurl, 0o700)
  const hostile = spawnSync(process.execPath, ['scripts/curl-auth.mjs', 'TEST_TOKEN', '--fail', 'https://example.invalid/'], {
    encoding: 'utf8',
    env: { ...process.env, TEST_TOKEN: jetonSentinelle, PATH: `${temporaire}${path.delimiter}${process.env.PATH || ''}` },
  })
  assert.equal(hostile.status, 0, 'le wrapper curl authentifié doit exécuter curl sans erreur')
  assert.doesNotMatch(hostile.stderr, new RegExp(jetonSentinelle), 'le secret ne doit jamais atteindre les logs')
  const capture = JSON.parse(hostile.stdout)
  assert.equal(capture.argv.includes(jetonSentinelle), false, 'le secret ne doit jamais atteindre argv de curl')
  assert.equal(capture.jetonEnfant, null, 'le secret ne doit pas rester dans l’environnement de curl')
  assert.deepEqual(capture.argv.slice(0, 2), ['--config', '-'])
  assert.equal(capture.entree.includes(`Authorization: Bearer ${jetonSentinelle}`), true, 'le secret passe uniquement par stdin')
} finally {
  fs.rmSync(temporaire, { recursive: true, force: true })
}

const jetonRelais = 'landing-after-fetch-sentinel-b8406ea2'
const temporaireRelais = fs.mkdtempSync(path.join(os.tmpdir(), 'cleo-relais-env-'))
try {
  const compteur = path.join(temporaireRelais, 'compteur')
  const captureChemin = path.join(temporaireRelais, 'capture.json')
  const fauxNode = path.join(temporaireRelais, 'node')
  const fauxCurl = path.join(temporaireRelais, 'curl')
  fs.writeFileSync(fauxNode, `#!${process.execPath}
const fs = require('fs')
const { spawnSync } = require('child_process')
const compteur = process.env.CLEO_COMPTEUR_NODE
const nombre = fs.existsSync(compteur) ? Number(fs.readFileSync(compteur, 'utf8')) + 1 : 1
fs.writeFileSync(compteur, String(nombre))
if (nombre === 1) {
  const resultat = spawnSync(process.env.CLEO_NODE_REEL, process.argv.slice(2), { stdio: 'inherit', env: process.env })
  process.exit(resultat.status ?? 1)
}
fs.writeFileSync(process.env.CLEO_CAPTURE_ENV, JSON.stringify({
  landingToken: process.env.LANDING_TOKEN ?? null,
  argv: process.argv.slice(2),
}))
process.exit(86)
`)
  fs.writeFileSync(fauxCurl, `#!${process.execPath}
const fs = require('fs')
const argumentsCurl = process.argv.slice(2)
let entree = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', morceau => { entree += morceau })
process.stdin.on('end', () => {
  const indexSortie = argumentsCurl.lastIndexOf('-o')
  if (indexSortie < 0 || !argumentsCurl[indexSortie + 1] || !entree.includes('Authorization: Bearer')) process.exit(87)
  fs.writeFileSync(argumentsCurl[indexSortie + 1], '[]')
})
`)
  fs.chmodSync(fauxNode, 0o700)
  fs.chmodSync(fauxCurl, 0o700)
  const executionRelais = spawnSync('bash', ['scripts/relais-ci.sh'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${temporaireRelais}${path.delimiter}${process.env.PATH || ''}`,
      LANDING_TOKEN: jetonRelais,
      BLOGSRC: path.join(temporaireRelais, 'blogsrc'),
      GITHUB_OUTPUT: path.join(temporaireRelais, 'github-output'),
      CLEO_COMPTEUR_NODE: compteur,
      CLEO_CAPTURE_ENV: captureChemin,
      CLEO_NODE_REEL: process.execPath,
    },
  })
  assert.equal(executionRelais.status, 86, 'le relais d’intégration doit atteindre le processus sentinelle après le fetch')
  assert.doesNotMatch(executionRelais.stdout + executionRelais.stderr, new RegExp(jetonRelais), 'LANDING_TOKEN ne doit pas atteindre les logs')
  const capture = JSON.parse(fs.readFileSync(captureChemin, 'utf8'))
  assert.equal(capture.landingToken, null, 'un processus lancé après le fetch ne doit plus voir LANDING_TOKEN')
  assert.equal(capture.argv[0], '-e', 'la sentinelle doit intercepter le premier processus Node suivant le fetch')
} finally {
  fs.rmSync(temporaireRelais, { recursive: true, force: true })
}

const secret = 'secret-vercel-123456'
const redaction = spawnSync(process.execPath, ['scripts/rediger-sortie.mjs'], {
  input: `--token ${secret}\nAuthorization: Bearer ${secret}\n{"token":"${secret}"}\n`,
  encoding: 'utf8', env: { ...process.env, VERCEL_TOKEN: secret },
})
assert.equal(redaction.status, 0)
assert.doesNotMatch(redaction.stdout, new RegExp(secret))
assert.match(redaction.stdout, /SECRET REDACTED/)

console.log('Critiques sécurité validés : CSP autonome, actifs intègres, Vercel verrouillé, aucun token en argument ou log.')
