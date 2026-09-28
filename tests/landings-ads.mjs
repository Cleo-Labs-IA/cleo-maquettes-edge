// Les landings Google Ads (/en|fr|es/lp/*) vivent dans cleo-landing et passent par les rewrites de sortie/vercel.json.
// Un déploiement sans ces règles met les campagnes en 404 (25/09 et 28/09/2026). Ce test bloque le relais avant le déploiement.
// Usage : node tests/landings-ads.mjs [chemin/vers/vercel.json]
import fs from 'node:fs'
import path from 'node:path'

const ICI = path.dirname(new URL(import.meta.url).pathname)
const fichier = process.argv[2] || path.join(ICI, '../sortie/vercel.json')
const SORTIE = path.dirname(fichier)
const ORIGINE = 'https://cleo-landing-cleo-academys-projects.vercel.app'
// L'oracle est le guide de la session cleo-landing, recopié ici, pas relu dans construire.mjs.
const ATTENDUES = {
  '/:lang(en|fr|es)/lp/:path*': ORIGINE + '/:lang/lp/:path*',
  '/_next/:path*': ORIGINE + '/_next/:path*',
  '/anaelle-avatar.webp': ORIGINE + '/anaelle-avatar.webp',
  '/cloud-bg.webp': ORIGINE + '/cloud-bg.webp',
  '/hero-video-1.mp4': ORIGINE + '/hero-video-1.mp4',
  '/hero-video-2.mp4': ORIGINE + '/hero-video-2.mp4',
  '/logo-blue.svg': ORIGINE + '/logo-blue.svg',
  '/logos/:file*': ORIGINE + '/logos/:file*',
  '/apple-touch-icon.png': ORIGINE + '/apple-touch-icon.png',
  '/favicon.ico': ORIGINE + '/favicon.ico',
  '/favicon-16x16.png': ORIGINE + '/favicon-16x16.png',
  '/favicon-32x32.png': ORIGINE + '/favicon-32x32.png',
}

const conf = JSON.parse(fs.readFileSync(fichier, 'utf8'))
const rewrites = conf.rewrites || []
const ecarts = []
const n = Object.keys(ATTENDUES).length
Object.entries(ATTENDUES).forEach(([source, destination]) => {
  const r = rewrites.findIndex(w => w.source === source)
  if (r < 0) ecarts.push(`rewrite absent : ${source}`)
  else if (rewrites[r].destination !== destination) ecarts.push(`mauvaise destination pour ${source} : ${rewrites[r].destination}`)
  else if (r >= n) ecarts.push(`${source} en position ${r}, hors des ${n} premières (les landings vont en tête)`)
})
for (const r of conf.redirects || []) if (/\/lp(\/|$)/.test(r.source)) ecarts.push(`une redirection capte les landings : ${r.source}`)
for (const lang of ['en', 'fr', 'es']) if (fs.existsSync(path.join(SORTIE, lang, 'lp'))) ecarts.push(`dossier sortie/${lang}/lp présent : il masquerait le relais`)

if (ecarts.length) { console.error(`landings Ads : ${ecarts.length} écart(s)\n  ` + ecarts.join('\n  ')); process.exit(1) }
console.log(`landings Ads : ${Object.keys(ATTENDUES).length}/${Object.keys(ATTENDUES).length} relais en tête, aucun /lp/ local`)
