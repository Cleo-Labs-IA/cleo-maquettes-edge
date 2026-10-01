/* ════════════════════════════════════════════════════════════════
   TITRES COURTS DES ARTICLES DE BLOG (01/10/2026).

   Le <title> d'un article reprenait le titre éditorial entier : 276 pages sur 284 au-dessus de 60 caractères,
   médiane 228 en français. Google coupe vers 60. blog/fragments.mjs écrit désormais un titre court
   (blog/titres-courts.json, ou la coupe au mot pour un article qui n'y est pas encore).

   L'oracle est la PAGE produite, jamais le JSON : on relit sortie/blog-*.html.
     1. chaque <title> d'article tient en 60 caractères, entités décodées ;
     2. aucun <title> en double dans une même langue ;
     3. le h1 visible et le headline du JSON-LD sont toujours le titre LONG (blog/brut.json, écrit par le porteur,
        en amont de fragments.mjs) : seul le <title> a raccourci ;
     4. ni tiret cadratin ni « risk »/« risque » dans un titre écrit à la main (ceux de titres-courts.json) ;
     5. un titre écrit dans titres-courts.json est bien celui de la page (sinon : relancer node blog/fragments.mjs).
   Témoin : les mêmes contrôles rejoués sur des copies abîmées doivent échouer, sinon le test sort en erreur.

     node construire.mjs && node tests/titres-courts.mjs
   ════════════════════════════════════════════════════════════════ */
import fs from 'fs'
import path from 'path'

const ICI = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const SORTIE = path.join(ICI, 'sortie')
const MAX = 60
const SUFFIXE = ' | Cleo Labs'

const entites = t => t.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&')
const norm = t => entites(t.replace(/<[^>]+>/g, '')).replace(/[   ]/g, ' ').replace(/\s+/g, ' ').trim()
const longueur = t => [...t].length

function lire(html) {
  const titre = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1]
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => norm(m[1]))
  const headlines = []
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let j; try { j = JSON.parse(m[1]) } catch { continue }
    const voir = o => { if (Array.isArray(o)) o.forEach(voir); else if (o && typeof o === 'object') { if (typeof o.headline === 'string') headlines.push(norm(o.headline)); Object.values(o).forEach(voir) } }
    voir(j)
  }
  return { titre: titre === undefined ? null : norm(titre), h1s, headlines }
}

/* pages : [{ fichier, langue, slug, html }] · longs : Map « langue slug » → titre long · courts : titres-courts.json */
function controler(pages, longs, courts) {
  const erreurs = []; const vus = { fr: new Map(), en: new Map() }
  for (const p of pages) {
    const { titre, h1s, headlines } = lire(p.html)
    const long = longs.get(`${p.langue} ${p.slug}`)
    if (titre === null || !titre) { erreurs.push(`${p.fichier} : pas de <title>`); continue }
    if (longueur(titre) > MAX) erreurs.push(`${p.fichier} : <title> de ${longueur(titre)} caractères (> ${MAX}) : ${titre}`)
    const deja = vus[p.langue].get(titre.toLowerCase())
    if (deja) erreurs.push(`${p.fichier} : <title> identique à celui de ${deja} : ${titre}`)
    else vus[p.langue].set(titre.toLowerCase(), p.fichier)
    if (long === undefined) { erreurs.push(`${p.fichier} : titre long introuvable dans blog/brut.json`); continue }
    if (h1s.length !== 1) erreurs.push(`${p.fichier} : ${h1s.length} h1 (un seul attendu)`)
    else if (h1s[0] !== norm(long)) erreurs.push(`${p.fichier} : le h1 n'est plus le titre long\n    h1   : ${h1s[0]}\n    long : ${norm(long)}`)
    if (!headlines.length) erreurs.push(`${p.fichier} : pas de headline dans le JSON-LD`)
    else if (headlines.some(h => h !== norm(long))) erreurs.push(`${p.fichier} : le headline du JSON-LD n'est plus le titre long`)
    const voulu = courts[p.slug] && courts[p.slug][p.langue]
    if (typeof voulu === 'string' && voulu.trim()) {
      const v = norm(voulu)
      if (/[—–]/.test(v)) erreurs.push(`${p.fichier} : tiret long dans le titre court : ${v}`)
      if (/risk|risque/i.test(v)) erreurs.push(`${p.fichier} : « risk »/« risque » dans le titre court : ${v}`)
      if (longueur(v) <= MAX && titre !== v && titre !== v + SUFFIXE) erreurs.push(`${p.fichier} : le <title> n'est pas le titre de blog/titres-courts.json (relancer node blog/fragments.mjs)\n    page  : ${titre}\n    voulu : ${v}`)
    }
  }
  return erreurs
}

// ── Les pages d'article, d'après le portage (blog/brut.json) : chacune doit exister dans sortie/.
if (!fs.existsSync(SORTIE)) { console.error('sortie/ absent : lancer node construire.mjs'); process.exit(1) }
const brut = JSON.parse(fs.readFileSync(path.join(ICI, 'blog/brut.json'), 'utf8'))
const FICHIER_COURTS = path.join(ICI, 'blog/titres-courts.json')
let courts = {}
if (fs.existsSync(FICHIER_COURTS)) { try { courts = JSON.parse(fs.readFileSync(FICHIER_COURTS, 'utf8')) } catch (e) { console.error('blog/titres-courts.json illisible : ' + e.message); process.exit(1) } }
const longs = new Map(); const pages = []; const absents = []
for (const a of brut) {
  const fichier = `blog-${a.slug}${a.langue === 'en' ? '-en' : ''}.html`
  /* le titre long : celui que fragments.mjs a posé dans le fragment vient de blog-posts.json, que le porteur recopie
     dans brut.json au même passage */
  longs.set(`${a.langue} ${a.slug}`, a.titre)
  const f = path.join(SORTIE, fichier)
  if (!fs.existsSync(f)) { absents.push(fichier); continue }
  pages.push({ fichier, langue: a.langue, slug: a.slug, html: fs.readFileSync(f, 'utf8') })
}
const erreurs = controler(pages, longs, courts)
for (const f of absents) erreurs.push(`${f} : page absente de sortie/`)
if (pages.length < 2) erreurs.push(`seulement ${pages.length} page(s) d'article lue(s)`)

// ── Témoin négatif : chaque altération doit être vue. Un contrôle qui ne voit rien ne protège rien.
const temoin = []
if (pages.length >= 2) {
  const p0 = pages[0]; const p1 = pages.find(p => p.langue === p0.langue && p.slug !== p0.slug)
  const long0 = longs.get(`${p0.langue} ${p0.slug}`)
  const cas = [
    ['<title> rallongé au titre éditorial', [{ ...p0, html: p0.html.replace(/<title>[\s\S]*?<\/title>/, `<title>${'Un titre éditorial bien trop long pour une page de résultats. '.repeat(2)}</title>`) }], /caractères \(> 60\)/],
    ['h1 raccourci', [{ ...p0, html: p0.html.replace(/(<h1\b[^>]*>)[\s\S]*?(<\/h1>)/, '$1Titre raccourci$2') }], /le h1 n'est plus le titre long/],
    ['headline raccourci', [{ ...p0, html: p0.html.replace(/"headline":"(?:[^"\\]|\\.)*"/, '"headline":"Titre raccourci"') }], /headline du JSON-LD/],
    ['<title> vidé', [{ ...p0, html: p0.html.replace(/<title>[\s\S]*?<\/title>/, '<title></title>') }], /pas de <title>/],
    ...(p1 ? [['deux pages, même <title>', [p0, { ...p1, html: p1.html.replace(/<title>[\s\S]*?<\/title>/, (p0.html.match(/<title>[\s\S]*?<\/title>/) || [''])[0]) }], /identique à celui de/]] : []),
    ['titre court avec « risque »', [p0], /« risk »\/« risque »/, { [p0.slug]: { [p0.langue]: 'Un risque en tête de titre' } }],
  ]
  if (long0 && longueur(long0) + longueur(SUFFIXE) <= MAX) cas.splice(0, 1, ['<title> rallongé', [{ ...p0, html: p0.html.replace(/<title>[\s\S]*?<\/title>/, `<title>${'x'.repeat(MAX + 1)}</title>`) }], /caractères \(> 60\)/])
  for (const [nom, lot, attendu, courtsAbimes] of cas) {
    const vu = controler(lot, longs, courtsAbimes || courts)
    if (!vu.some(e => attendu.test(e))) temoin.push(`témoin « ${nom} » : l'altération n'est PAS détectée`)
  }
  if (!p1) temoin.push('témoin : pas deux articles dans la même langue, le contrôle d\'unicité n\'est pas éprouvé')
}

const n = pages.map(p => longueur(lire(p.html).titre || '')).sort((a, b) => a - b)
const ecrits = pages.filter(p => courts[p.slug] && courts[p.slug][p.langue]).length
console.log(`titres courts : ${pages.length} pages d'article lues dans sortie/ · <title> min ${n[0]}, médiane ${n[Math.floor(n.length / 2)]}, max ${n[n.length - 1]} · ${ecrits} écrits dans blog/titres-courts.json, ${pages.length - ecrits} en repli (coupe au mot)`)
if (temoin.length) { console.error('TÉMOIN EN ÉCHEC :\n  ' + temoin.join('\n  ')); process.exit(1) }
if (erreurs.length) { console.error(`${erreurs.length} écart(s) :\n  ` + erreurs.join('\n  ')); process.exit(1) }
console.log('titres courts : tout passe (≤ 60, uniques par langue, h1 et headline inchangés, témoin négatif détecté)')
