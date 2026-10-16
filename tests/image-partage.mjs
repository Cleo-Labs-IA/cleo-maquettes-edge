/* Image de partage propre à chaque article (01/10/2026).
   Relit le HTML produit dans sortie/ : chaque page d'article du blog déclare une og:image dont le fichier existe dans
   sortie/, mesure 1200 × 630 (lu par sharp), pèse moins de 300 Ko, est reprise par twitter:image et par le JSON-LD ;
   deux articles à couvertures différentes n'ont jamais la même image. Les pages hors blog gardent og-image.jpg.
   Témoins négatifs : le vérificateur est rejoué sur des altérations (image mal dimensionnée, trop lourde, fichier
   absent, deux couvertures différentes avec la même image, balise twitter divergente) et DOIT les refuser. */
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as serveur from '../commun/servir.mjs'

const ICI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SORTIE = path.join(ICI, 'sortie')
const HOTE = 'https://www.cleolabs.co'
const SHARP_MAC = '/Users/naomiehalioua/cleo-landing/node_modules/sharp/lib/index.js'
const sharp = (await import(fs.existsSync(SHARP_MAC) && process.env.SIMULER_CI !== '1' ? SHARP_MAC : 'sharp')).default
const MAX = 300 * 1024

const meta = (html, cle) => (html.match(new RegExp(`<meta (?:property|name)="${cle}" content="([^"]*)">`)) || [])[1]
const couvertureDe = html => (html.match(/<section class="section sy-bande-photo">\s*<figure>\s*<img[^>]* data-img="([^"]+)"/) || [])[1]

/* Vérifie une page ; `lire(cheminServi)` rend le Buffer du fichier ou null. Rend la liste des défauts. */
async function verifierPage(nom, html, lire) {
  const d = []
  const og = meta(html, 'og:image')
  if (!og) return [`${nom} : pas d'og:image`]
  if (!og.startsWith(`${HOTE}/og/blog/`) || !og.endsWith('.jpg')) return [`${nom} : og:image hors /og/blog/ (${og})`]
  const fichier = await lire(og.slice(HOTE.length))
  if (!fichier) return [`${nom} : fichier absent pour ${og}`]
  if (fichier.length >= MAX) d.push(`${nom} : ${fichier.length} octets, 300 Ko ou plus`)
  const m = await sharp(fichier).metadata()
  if (m.format !== 'jpeg') d.push(`${nom} : format ${m.format}`)
  if (m.width !== 1200 || m.height !== 630) d.push(`${nom} : ${m.width} × ${m.height} au lieu de 1200 × 630`)
  if (meta(html, 'og:image:width') !== '1200' || meta(html, 'og:image:height') !== '630') d.push(`${nom} : og:image:width/height absents ou faux`)
  if (!meta(html, 'og:image:alt')) d.push(`${nom} : og:image:alt vide`)
  if (meta(html, 'twitter:image') !== og) d.push(`${nom} : twitter:image ≠ og:image`)
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(x => JSON.parse(x[1])).find(b => b['@type'] === 'TechArticle')
  if (ld && ld.image !== og) d.push(`${nom} : JSON-LD TechArticle.image ≠ og:image`)
  return d
}

/* Deux couvertures différentes ne partagent jamais la même image (comparaison par empreinte du fichier). */
function collisions(pages, lire) {
  const parImage = new Map()
  for (const { nom, html } of pages) {
    const cov = couvertureDe(html), og = meta(html, 'og:image')
    const f = og && lire(og.slice(HOTE.length))
    if (!cov || !f) continue
    const h = crypto.createHash('sha1').update(f).digest('hex')
    if (!parImage.has(h)) parImage.set(h, new Map())
    parImage.get(h).set(cov, nom)
  }
  return [...parImage.values()].filter(c => c.size > 1).map(c => `couvertures différentes, même image : ${[...c.values()].join(', ')}`)
}

const lireSortie = p => { const f = path.join(SORTIE, p); return fs.existsSync(f) ? fs.readFileSync(f) : null }
const articles = JSON.parse(fs.readFileSync(path.join(ICI, 'blog/articles.json'), 'utf8'))
assert.ok(articles.length > 100, `blog/articles.json : ${articles.length} articles seulement`)

const pages = articles.map(a => ({ nom: a.sortie, html: fs.readFileSync(path.join(SORTIE, a.sortie), 'utf8') }))
const defauts = []
for (const p of pages) defauts.push(...await verifierPage(p.nom, p.html, lireSortie))
defauts.push(...collisions(pages, lireSortie))
assert.deepEqual(defauts, [], `${defauts.length} défaut(s) :\n  ${defauts.slice(0, 15).join('\n  ')}`)

/* Hors blog : toujours og-image.jpg ; l'accueil et les pages de service ne changent pas. */
let horsBlog = 0
const nomsArticles = new Set(articles.map(a => a.sortie))
for (const f of fs.readdirSync(SORTIE).filter(f => f.endsWith('.html') && !nomsArticles.has(f))) {
  const og = meta(fs.readFileSync(path.join(SORTIE, f), 'utf8'), 'og:image')
  if (!og) continue
  horsBlog++
  if (og.includes('/og/blog/')) continue // article hors manifeste du portage (page dessinée à la main) : image propre admise
  assert.equal(og, `${HOTE}/og-image.jpg`, `${f} : og:image inattendue ${og}`)
}
assert.ok(horsBlog > 50, `pages hors blog : ${horsBlog}`)
assert.ok(fs.existsSync(path.join(SORTIE, 'og-image.jpg')), 'og-image.jpg absent de sortie/')

/* Service : les fichiers sont servis tels quels (aucune règle de redirection ou de réécriture ne les avale),
   et la CSP ne bloque pas les images en même origine. */
const config = JSON.parse(fs.readFileSync(path.join(SORTIE, 'vercel.json'), 'utf8'))
const echantillon = '/og/blog/' + articles[0].sortie.replace(/^blog-/, '').replace(/(-en)?\.html$/, '') + '.jpg'
assert.ok(fs.existsSync(path.join(SORTIE, echantillon)), `${echantillon} absent`)
for (const r of [...(config.redirects || []), ...(config.rewrites || [])]) {
  assert.ok(!/^\/og(\/|$)/.test(r.source), `règle vercel.json qui vise /og : ${r.source}`)
  assert.ok(!['/(.*)', '/:path*', '/:path(.*)'].includes(r.source) || r.has, `règle fourre-tout ${r.source} qui avalerait /og/*`)
}
const csp = config.headers.find(h => !h.source.includes('/lp/') && h.headers.some(e => e.key === 'Content-Security-Policy')).headers.find(h => h.key === 'Content-Security-Policy').value
assert.match(csp, /img-src 'self'/, "CSP : img-src 'self' requis pour /og/*")
const srv = await serveur.servir(SORTIE)
try {
  const r = await fetch(srv.url + echantillon)
  assert.equal(r.status, 200, `${echantillon} : HTTP ${r.status}`)
  assert.equal(r.headers.get('content-type'), 'image/jpeg')
} finally { srv.fermer() }

/* ── Témoins négatifs : chaque altération DOIT être détectée. ── */
const exemple = pages[0]
const og0 = meta(exemple.html, 'og:image').slice(HOTE.length)
const bon = lireSortie(og0)
const rejette = async (libelle, html, lire, attendu) => {
  const d = await verifierPage('témoin', html, lire)
  assert.ok(d.some(x => attendu.test(x)), `le témoin « ${libelle} » n'a pas été détecté : ${JSON.stringify(d)}`)
}
assert.deepEqual(await verifierPage('témoin', exemple.html, () => bon), [], 'le témoin positif doit passer')
await rejette('image 600 × 315', exemple.html, () => sharp(bon).resize(600, 315).jpeg().toBuffer(), /600 × 315/)
await rejette('image 1200 × 630 de 400 Ko', exemple.html, () => sharp({ create: { width: 1200, height: 630, channels: 3, noise: { type: 'gaussian', mean: 128, sigma: 60 } } }).jpeg({ quality: 95 }).toBuffer(), /300 Ko/)
await rejette('fichier absent', exemple.html, () => null, /fichier absent/)
await rejette('og-image.jpg générique', exemple.html.replaceAll(`${HOTE}${og0}`, `${HOTE}/og-image.jpg`), () => bon, /hors \/og\/blog/)
await rejette('twitter:image divergente', exemple.html.replace(/(<meta name="twitter:image" content=")[^"]*/, `$1${HOTE}/og-image.jpg`), () => bon, /twitter:image/)
await rejette('largeur déclarée fausse', exemple.html.replace('og:image:width" content="1200"', 'og:image:width" content="800"'), () => bon, /width\/height/)
{
  const autre = pages.find(p => couvertureDe(p.html) !== couvertureDe(exemple.html))
  assert.ok(autre, 'il faut deux couvertures différentes pour le témoin')
  const faux = { nom: autre.nom, html: autre.html.replace(/(<meta property="og:image" content=")[^"]*/, `$1${HOTE}${og0}`) }
  assert.ok(collisions([exemple, faux], lireSortie).length === 1, 'deux couvertures différentes avec la même image doivent être détectées')
}

const distinctes = new Set(pages.map(p => meta(p.html, 'og:image'))).size
const couvertures = new Set(pages.map(p => couvertureDe(p.html))).size
console.log(`image-partage : ${pages.length} pages d'article, ${distinctes} images distinctes pour ${couvertures} couvertures, ${horsBlog} pages hors blog sur og-image.jpg, 7 témoins négatifs détectés`)
