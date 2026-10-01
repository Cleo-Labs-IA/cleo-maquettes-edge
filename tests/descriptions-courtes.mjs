/* La balise description des articles listés dans blog/descriptions-courtes.json est la version courte (155 au plus) ;
   og:description et le JSON-LD gardent la description longue ; un article hors du fichier garde sa description longue.
   Oracle : le HTML de sortie/ comparé à blog/brut.json (la description d'origine) et au fichier des versions courtes.
   Témoin négatif : trois altérations du HTML doivent être détectées. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const ICI = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const COURTES = JSON.parse(fs.readFileSync(path.join(ICI, 'blog/descriptions-courtes.json'), 'utf8'))
const BRUT = JSON.parse(fs.readFileSync(path.join(ICI, 'blog/brut.json'), 'utf8'))
const dec = t => t.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&')
const norm = t => dec(t || '').replace(/\s+/g, ' ').trim()
const lire = (html, re) => { const m = html.match(re); return m ? norm(m[1]) : null }
function controler(a, html) {
  const ko = []
  const meta = lire(html, /<meta name="description" content="([^"]*)"/), og = lire(html, /<meta property="og:description" content="([^"]*)"/)
  const longue = norm(a.description), courte = COURTES[a.slug] && COURTES[a.slug][a.langue] ? norm(COURTES[a.slug][a.langue]) : null
  if (courte) {
    if ([...courte].length > 155) ko.push(`version courte de ${[...courte].length} caractères (> 155)`)
    if (meta !== courte) ko.push(`la balise description n'est pas la version courte : « ${(meta || '').slice(0, 70)} »`)
    if (og !== longue) ko.push('og:description ne porte plus la description longue')
    if (!dec(html).replace(/\\"/g, '"').replace(/\s+/g, ' ').includes(`"description":${JSON.stringify(longue).replace(/\\"/g, '"')}`) && !html.includes(JSON.stringify(a.description).slice(1, 60))) ko.push('le JSON-LD ne porte plus la description longue')
  } else if (meta !== longue) ko.push(`article hors du fichier : sa description a changé : « ${(meta || '').slice(0, 70)} »`)
  return ko
}
let courtes = 0, longues = 0; const ko = []
for (const a of BRUT) {
  const f = path.join(ICI, 'sortie', a.sortie); if (!fs.existsSync(f)) { ko.push(`${a.sortie} : page absente de sortie/`); continue }
  const e = controler(a, fs.readFileSync(f, 'utf8')); if (COURTES[a.slug] && COURTES[a.slug][a.langue]) courtes++; else longues++
  for (const x of e) ko.push(`${a.sortie} : ${x}`)
}
for (const slug of Object.keys(COURTES)) if (!BRUT.some(a => a.slug === slug)) ko.push(`blog/descriptions-courtes.json : « ${slug} » n'est pas un article`)
// Témoin : sur un article du fichier et un article hors du fichier.
const dedans = BRUT.find(a => COURTES[a.slug] && COURTES[a.slug][a.langue]), dehors = BRUT.find(a => !COURTES[a.slug])
const h1 = fs.readFileSync(path.join(ICI, 'sortie', dedans.sortie), 'utf8'), h2 = fs.readFileSync(path.join(ICI, 'sortie', dehors.sortie), 'utf8')
const temoins = [
  ['description longue remise', controler(dedans, h1.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="trop long ${'x'.repeat(200)}"`))],
  ['og:description raccourcie', controler(dedans, h1.replace(/<meta property="og:description" content="[^"]*"/, '<meta property="og:description" content="court"'))],
  ['article hors fichier modifié', controler(dehors, h2.replace(/<meta name="description" content="[^"]*"/, '<meta name="description" content="autre"'))],
]
for (const [nom, e] of temoins) if (!e.length) ko.push(`TÉMOIN NON DÉTECTÉ : ${nom}`)
if (ko.length) { console.error(`descriptions courtes : ${ko.length} écart(s)\n  ${ko.slice(0, 20).join('\n  ')}`); process.exit(1) }
console.log(`descriptions courtes : ${courtes} pages en version courte (≤ 155), ${longues} pages inchangées, og et JSON-LD en version longue ; ${temoins.length} témoins négatifs détectés`)
