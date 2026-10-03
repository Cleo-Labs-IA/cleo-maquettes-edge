/* Le <lastmod> du sitemap dit le dernier changement REEL de chaque page, pas le jour du build.
   Relit sortie/sitemap.xml : plus d'une date distincte, chaque article = sa date de publication
   (blog/articles.json), aucune date future, format AAAA-MM-JJ, autant d'URL que de routes publiques.
   Temoin negatif : un sitemap ou tout vaut la date du jour doit faire echouer les memes controles. */
import fs from 'fs'
import path from 'path'

const ICI = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const lire = f => fs.readFileSync(path.join(ICI, f), 'utf8')
const CHEMINS = JSON.parse(lire('commun/chemins.json'))
Object.assign(CHEMINS.pages, JSON.parse(lire('blog/chemins-blog.json')))
const articles = JSON.parse(lire('blog/articles.json'))
const dateParRoute = new Map(articles.map(a => [CHEMINS.pages[a.sortie] && CHEMINS.pages[a.sortie].chemin, a.date]))
const HOTE = 'https://www.cleolabs.co'
const AVANT = 352 // nombre d'URL du sitemap avant ce correctif (mesure du 01/10/2026)

function controler(xml, jour) {
  const erreurs = []
  const urls = [...xml.matchAll(/<url><loc>([^<]*)<\/loc><lastmod>([^<]*)<\/lastmod><\/url>/g)].map(m => ({ loc: m[1], mod: m[2] }))
  if (urls.length < AVANT) erreurs.push(`${urls.length} URL, il y en avait ${AVANT}`)
  if ((xml.match(/<url>/g) || []).length !== urls.length) erreurs.push('une entree <url> sans lastmod ou mal formee')
  for (const u of urls) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(u.mod)) erreurs.push(`format : ${u.loc} ${u.mod}`)
    else if (u.mod > jour) erreurs.push(`date future : ${u.loc} ${u.mod}`)
  }
  if (new Set(urls.map(u => u.mod)).size < 2) erreurs.push('une seule date distincte')
  let nArt = 0
  for (const u of urls) {
    const attendu = dateParRoute.get(u.loc.replace(HOTE, ''))
    if (!attendu) continue
    nArt++
    if (u.mod !== attendu) erreurs.push(`article ${u.loc} : lastmod ${u.mod}, publication ${attendu}`)
  }
  if (nArt < 100) erreurs.push(`seulement ${nArt} articles reconnus dans le sitemap`)
  return { erreurs, n: urls.length, nArt, distinctes: new Set(urls.map(u => u.mod)).size }
}

const jour = new Date().toISOString().slice(0, 10)
const xml = lire('sortie/sitemap.xml')
const r = controler(xml, jour)
if (r.erreurs.length) { console.error('ECHEC sitemap-dates :\n' + r.erreurs.slice(0, 15).join('\n')); process.exit(1) }
const abime = controler(xml.replace(/<lastmod>[^<]*</g, `<lastmod>${jour}<`), jour)
if (!abime.erreurs.length) { console.error('ECHEC temoin : un sitemap ou tout vaut la date du jour passe le test'); process.exit(1) }
console.log(`OK sitemap-dates : ${r.n} URL, ${r.distinctes} dates distinctes, ${r.nArt} articles = date de publication ; temoin negatif rejete (${abime.erreurs.length} erreurs)`)
