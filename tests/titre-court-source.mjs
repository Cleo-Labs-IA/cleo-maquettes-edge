/* ════════════════════════════════════════════════════════════════
   D'OÙ VIENT LE TITRE COURT D'UN ARTICLE (01/10/2026). Sans réseau, données fabriquées.

   Vécu le 01/10/2026 : l'article du matin n'avait pas de ligne dans blog/titres-courts.json, son <title> est sorti
   coupé au mot (« Le 22 septembre, le Mexique a inscrit une | Cleo Labs »). Désormais cleo-landing peut écrire le
   titre court avec l'article (`seoTitle` dans blog-posts.json) et le relais le reprend.

   Ce qui est prouvé, chaque attendu étant écrit ici à la main (jamais recalculé par le code testé) :
     A. blog/titre-court.mjs, la règle : (i) sans ligne dans titres-courts.json mais avec seoTitle, le <title> est
        seoTitle + suffixe ; (ii) une ligne de titres-courts.json l'emporte ; (iii) sans les deux, repli coupé au mot,
        et seul ce cas est compté comme repli.
     B. scripts/blog-posts-public.mjs, le mode sans jeton : (iv) le titre LONG vient du headline du JSON-LD et le
        titre court du <title>, sur les deux formes de page (avec et sans seoTitle) ; le titre long n'est jamais
        remplacé par le court ; l'article reconstitué passe la validation stricte.
     C. La chaîne entière, blog/fragments.mjs lancé pour de bon sur une copie jetable : le titre court de
        blog-posts.json, puis celui que blog/brut.json a gardé (article déjà porté, absent du JSON du jour), arrivent
        dans blog/seo-blog.json ; og:title et le headline restent le titre long.
   Témoins négatifs : les mêmes contrôles rejoués sur des mises en œuvre fautives (titre long lu dans <title>, priorité
   inversée, seoTitle ignoré) et sur des données sans seoTitle doivent échouer, sinon le test sort en erreur.

     node tests/titre-court-source.mjs
   ════════════════════════════════════════════════════════════════ */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { creerTitreSeo } from '../blog/titre-court.mjs'
import { metadonneesDepuisHtml, articleDepuisPages, articleDepuisBrut } from '../scripts/blog-posts-public.mjs'
import { validerMetadonneesBlog } from '../blog/securite-contenu.mjs'

const ICI = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const LONG = {
  fr: 'Le 22 septembre, le Mexique a inscrit une nouvelle norme d\'étiquetage qui oblige chaque importateur de jouets à déclarer le pays d\'origine',
  en: 'On 22 September, Mexico registered a new labelling standard requiring every toy importer to declare the country of origin',
}
const COURT = { fr: 'Mexique : la norme jouets du 22 septembre', en: 'Mexico: the 22 September toy standard' }
const LIGNE = { fr: 'Jouets au Mexique : ce qui change', en: 'Toys in Mexico: what changes' }

/* ── A. La règle. `fabrique` est creerTitreSeo, ou une version fautive pour le témoin. Rend la liste des écarts. */
function controlerRegle(fabrique) {
  const ecarts = []
  const voir = (nom, obtenu, attendu) => { if (obtenu !== attendu) ecarts.push(`${nom}\n    obtenu  : ${obtenu}\n    attendu : ${attendu}`) }
  const article = (slug, langue, titreCourt) => ({ slug, langue, titre: LONG[langue], ...(titreCourt ? { titreCourt } : {}) })
  const fichier = { 'avec-ligne': LIGNE, 'ligne-trop-longue': { fr: 'x'.repeat(61), en: 'x'.repeat(61) } }
  const t = fabrique(fichier)
  // (i) pas de ligne, mais un seoTitle : c'est lui, suffixe ajouté (41 + 12 = 53 caractères)
  voir('(i) seoTitle sans ligne, fr', t.titreSeo(article('sans-ligne', 'fr', COURT.fr)), 'Mexique : la norme jouets du 22 septembre | Cleo Labs')
  voir('(i) seoTitle sans ligne, en', t.titreSeo(article('sans-ligne', 'en', COURT.en)), 'Mexico: the 22 September toy standard | Cleo Labs')
  // (ii) la ligne de titres-courts.json l'emporte sur le seoTitle
  voir('(ii) la ligne l\'emporte, fr', t.titreSeo(article('avec-ligne', 'fr', COURT.fr)), 'Jouets au Mexique : ce qui change | Cleo Labs')
  voir('(ii) la ligne l\'emporte, en', t.titreSeo(article('avec-ligne', 'en', COURT.en)), 'Toys in Mexico: what changes | Cleo Labs')
  voir('replis avant (iii)', t.replis(), 0)
  // (iii) ni ligne ni seoTitle : la coupe au mot d'avant, celle du 01/10
  voir('(iii) repli, fr', t.titreSeo(article('sans-rien', 'fr')), 'Le 22 septembre, le Mexique a inscrit une | Cleo Labs')
  voir('replis après (iii)', t.replis(), 1)
  // une ligne inutilisable (61 caractères) laisse la place au seoTitle ; un seoTitle inutilisable laisse la place au repli
  voir('ligne trop longue → seoTitle', t.titreSeo(article('ligne-trop-longue', 'en', COURT.en + ' bis')), 'Mexico: the 22 September toy standard bis | Cleo Labs')
  voir('seoTitle à balise → repli', t.titreSeo(article('hostile', 'en', '<script>alert(1)</script>')), 'On 22 September, Mexico registered a new | Cleo Labs')
  voir('seoTitle de 61 caractères → repli', t.titreSeo(article('trop-long', 'fr', 'y'.repeat(61))), 'Le 22 septembre, le Mexique a inscrit une nouvelle norme')
  voir('replis en fin', t.replis(), 3)
  // un seoTitle de 49 à 60 caractères sort sans suffixe (il ne tient pas), jamais au-delà de 60
  voir('seoTitle de 52 caractères', t.titreSeo(article('long-mais-valide', 'fr', 'Étiquetage des jouets au Mexique : la norme de 2026')), 'Étiquetage des jouets au Mexique : la norme de 2026')
  voir('origine fichier', t.origine(article('avec-ligne', 'fr', COURT.fr)), 'fichier')
  voir('origine article', t.origine(article('sans-ligne', 'fr', COURT.fr)), 'article')
  voir('origine repli', t.origine(article('sans-rien', 'fr')), 'repli')
  return ecarts
}

/* ── B. Le mode sans jeton. Une page comme cleo-landing la sert : <title>, h1, JSON-LD. `lire` est metadonneesDepuisHtml,
      ou une version fautive pour le témoin. */
const SLUG = 'mexico-toy-labelling-standard-2026'
const echapper = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')
const ld = objet => `<script type="application/ld+json">${JSON.stringify(objet).replace(/</g, '\\u003c')}</script>`
function page(langue, titreDeLaPage, long = LONG[langue]) {
  const fr = langue === 'fr'
  return `<!DOCTYPE html><html><head><title>${echapper(titreDeLaPage)}</title><meta property="og:title" content="${echapper(long)}"/>
${ld({ '@context': 'https://schema.org', '@type': 'TechArticle', headline: long, description: fr ? 'Une description.' : 'A description.',
    datePublished: '2026-10-01', author: [{ '@type': 'Person', name: 'Naomie Halioua' }],
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.cleolabs.co/${langue}/blog/${SLUG}` },
    image: { '@type': 'ImageObject', url: 'https://www.cleolabs.co/og-image.png' }, articleSection: fr ? 'Jouets' : 'Toys' })}</head>
<body><article><h1>${echapper(long)}</h1><span>7 ${fr ? 'min de lecture' : 'min read'}</span><section><h2>Corps</h2><p>Texte.</p></section></article></body></html>`
}
const SANS = { fr: page('fr', LONG.fr + ' | Cleo Labs'), en: page('en', LONG.en + ' | Cleo Labs') }          // aujourd'hui
const AVEC = { fr: page('fr', COURT.fr + ' | Cleo Labs'), en: page('en', COURT.en + ' | Cleo Labs') }        // demain
function controlerPages(lire) {
  const ecarts = []
  const voir = (nom, obtenu, attendu) => { try { assert.deepEqual(obtenu, attendu) } catch { ecarts.push(`${nom}\n    obtenu  : ${JSON.stringify(obtenu)}\n    attendu : ${JSON.stringify(attendu)}`) } }
  for (const langue of ['fr', 'en']) {
    const sans = lire(SANS[langue], langue, SLUG), avec = lire(AVEC[langue], langue, SLUG)
    voir(`page sans seoTitle, ${langue} : titre long`, sans.title, LONG[langue])
    voir(`page sans seoTitle, ${langue} : pas de titre court`, Object.hasOwn(sans, 'seoTitle'), false)
    voir(`page avec seoTitle, ${langue} : le titre long reste celui du JSON-LD`, avec.title, LONG[langue])
    voir(`page avec seoTitle, ${langue} : titre court lu dans <title>, suffixe retiré`, avec.seoTitle, COURT[langue])
  }
  // entités du <title> décodées ; un titre long COURT (il tient en 60) n'est pas pris pour un titre court
  const esperluette = lire(page('en', 'R&D: what\'s "new" | Cleo Labs'), 'en', SLUG)
  voir('entités décodées', esperluette.seoTitle, 'R&D: what\'s "new"')
  const petit = lire(page('en', 'A short editorial title | Cleo Labs', 'A short editorial title'), 'en', SLUG)
  voir('titre long court : title', petit.title, 'A short editorial title')
  voir('titre long court : pas de seoTitle', Object.hasOwn(petit, 'seoTitle'), false)
  // un <title> hostile ou trop long ne devient jamais un titre court, et n'abîme pas le titre long
  for (const [nom, t] of [['balise', '</title><script>alert(1)</script> | Cleo Labs'], ['61 caractères', 'z'.repeat(61) + ' | Cleo Labs'], ['vide', ' | Cleo Labs']]) {
    const m = lire(page('fr', t), 'fr', SLUG)
    voir(`<title> ${nom} : pas de seoTitle`, Object.hasOwn(m, 'seoTitle'), false)
    voir(`<title> ${nom} : titre long intact`, m.title, LONG.fr)
  }
  return ecarts
}

const ecarts = [...controlerRegle(creerTitreSeo), ...controlerPages(metadonneesDepuisHtml)]

// L'article bilingue reconstitué : strict, et un titre court servi dans UNE seule langue ne donne pas de seoTitle.
const demain = articleDepuisPages(SLUG, AVEC.fr, AVEC.en)
assert.deepEqual(demain.seoTitle, COURT, 'les deux pages servent un titre court : seoTitle bilingue')
assert.deepEqual(demain.title, LONG, 'le titre long bilingue vient du JSON-LD')
assert.deepEqual(validerMetadonneesBlog([demain])[0].seoTitle, COURT, 'seoTitle passe la validation stricte et en ressort')
assert.equal(Object.hasOwn(articleDepuisPages(SLUG, SANS.fr, SANS.en), 'seoTitle'), false, 'aujourd\'hui : aucun seoTitle')
assert.equal(Object.hasOwn(articleDepuisPages(SLUG, AVEC.fr, SANS.en), 'seoTitle'), false, 'une seule langue : pas de seoTitle')
// Un article déjà porté : son titre court revient de blog/brut.json (champ titreCourt), le titre long aussi.
const entreeBrut = (langue, titreCourt) => ({ slug: SLUG, langue, titre: LONG[langue], description: 'D', date: '2026-10-01', categorie: 'C', lecture: langue === 'fr' ? '7 min de lecture' : '7 min read', auteur: 'naomie', faq: [], ...(titreCourt ? { titreCourt } : {}) })
assert.deepEqual(articleDepuisBrut(SLUG, entreeBrut('fr', COURT.fr), entreeBrut('en', COURT.en)).seoTitle, COURT)
assert.deepEqual(articleDepuisBrut(SLUG, entreeBrut('fr', COURT.fr), entreeBrut('en', COURT.en)).title, LONG)
assert.equal(Object.hasOwn(articleDepuisBrut(SLUG, entreeBrut('fr'), entreeBrut('en')), 'seoTitle'), false)

/* ── C. La chaîne entière : blog/fragments.mjs lancé sur une copie jetable (blog/, deux index, routes), SIMULER_CI=1,
      aucun fichier du dépôt n'est touché. L'oracle est blog/seo-blog.json, celui que construire.mjs lit pour le <title>. */
function chaine({ avecSeoTitle }) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'titre-court-'))
  try {
    for (const d of ['blog', 'pages', 'commun', 'src']) fs.mkdirSync(path.join(tmp, d))
    for (const f of ['fragments.mjs', 'titre-court.mjs', 'securite-contenu.mjs', 'banque-monde.json', 'images-blog.json']) fs.copyFileSync(path.join(ICI, 'blog', f), path.join(tmp, 'blog', f))
    for (const f of ['24-blog.html', '24-blog-en.html']) fs.copyFileSync(path.join(ICI, 'pages', f), path.join(tmp, 'pages', f))
    fs.writeFileSync(path.join(tmp, 'commun/v6-routes.json'), '{}')
    fs.symlinkSync(path.join(ICI, 'node_modules'), path.join(tmp, 'node_modules'))
    const slugs = ['essai-seotitle', 'essai-ligne', 'essai-rien', 'essai-deja-porte']
    const post = slug => ({ slug, title: { fr: `${LONG.fr} (${slug})`, en: `${LONG.en} (${slug})` }, description: { fr: 'Description.', en: 'Description.' }, category: { fr: 'Jouets', en: 'Toys' },
      author: 'naomie', date: '2026-10-01', readTime: { fr: '7 min de lecture', en: '7 min read' }, keywords: [],
      ...(avecSeoTitle && ['essai-seotitle', 'essai-ligne'].includes(slug) ? { seoTitle: { fr: `${COURT.fr} ${slug.length}`, en: `${COURT.en} ${slug.length}` } } : {}) })
    // essai-deja-porte est absent du blog-posts.json du jour : seul blog/brut.json (versionné) porte son titre court
    fs.writeFileSync(path.join(tmp, 'src/blog-posts.json'), JSON.stringify(slugs.slice(0, 3).map(post)))
    fs.writeFileSync(path.join(tmp, 'blog/titres-courts.json'), JSON.stringify({ 'essai-ligne': LIGNE }))
    fs.writeFileSync(path.join(tmp, 'blog/brut.json'), JSON.stringify(slugs.flatMap(slug => ['fr', 'en'].map(langue => ({
      slug, langue, titre: `${LONG[langue]} (${slug})`, description: 'Description.', date: '2026-10-01', categorie: langue === 'fr' ? 'Jouets' : 'Toys',
      lecture: langue === 'fr' ? '7 min de lecture' : '7 min read', auteur: 'naomie', couverture: null, faq: [],
      ...(avecSeoTitle && slug === 'essai-deja-porte' ? { titreCourt: langue === 'fr' ? 'Titre gardé par le porteur' : 'Title kept by the porter' } : {}),
      corps: [{ titre: 'Corps', html: '<h2>Corps</h2><p>Texte.</p>' }], sources: '', repli: null })))))
    const sortie = execFileSync(process.execPath, ['blog/fragments.mjs'], { cwd: tmp, env: { ...process.env, BLOGSRC: path.join(tmp, 'src'), SIMULER_CI: '1' }, encoding: 'utf8' })
    return { seo: JSON.parse(fs.readFileSync(path.join(tmp, 'blog/seo-blog.json'), 'utf8')), sortie }
  } finally { fs.rmSync(tmp, { recursive: true, force: true }) }
}
const ATTENDU_CHAINE = {
  'blog-essai-seotitle.html': 'Mexique : la norme jouets du 22 septembre 14 | Cleo Labs',
  'blog-essai-seotitle-en.html': 'Mexico: the 22 September toy standard 14 | Cleo Labs',
  'blog-essai-ligne.html': 'Jouets au Mexique : ce qui change | Cleo Labs',
  'blog-essai-ligne-en.html': 'Toys in Mexico: what changes | Cleo Labs',
  'blog-essai-rien.html': 'Le 22 septembre, le Mexique a inscrit une | Cleo Labs',
  'blog-essai-rien-en.html': 'On 22 September, Mexico registered a new | Cleo Labs',
  'blog-essai-deja-porte.html': 'Titre gardé par le porteur | Cleo Labs',
  'blog-essai-deja-porte-en.html': 'Title kept by the porter | Cleo Labs',
}
function controlerChaine({ seo, sortie }) {
  const e = []
  for (const [f, attendu] of Object.entries(ATTENDU_CHAINE)) {
    const p = seo.pages[f]
    if (!p) { e.push(`chaîne : ${f} absent de seo-blog.json`); continue }
    if (p.titre !== attendu) e.push(`chaîne : <title> de ${f}\n    obtenu  : ${p.titre}\n    attendu : ${attendu}`)
    const slug = f.replace(/^blog-|(-en)?\.html$/g, ''), langue = f.endsWith('-en.html') ? 'en' : 'fr'
    const long = `${LONG[langue]} (${slug})`
    if (p.og_titre !== `${long} | Cleo Labs`) e.push(`chaîne : og:title de ${f} n'est plus le titre long`)
    if (seo.structure[f]?.proprietes?.TechArticle?.headline !== long) e.push(`chaîne : headline de ${f} n'est plus le titre long`)
  }
  // le compteur de replis ne compte que (c) : essai-rien, deux langues
  if (!/titres courts : 2 titre\(s\) en repli/.test(sortie)) e.push('chaîne : le compteur de replis devrait dire 2\n    ' + sortie.trim().split('\n').join('\n    '))
  if (!/titres courts : 4 titre\(s\) repris du seoTitle/.test(sortie)) e.push('chaîne : 4 titres devraient venir du seoTitle')
  return e
}
ecarts.push(...controlerChaine(chaine({ avecSeoTitle: true })))

/* ── Témoins négatifs : une mise en œuvre fautive, ou des données sans seoTitle, doivent être VUES par ces contrôles. */
const temoin = []
const doitEchouer = (nom, liste, motif) => { if (!liste.some(x => motif.test(x))) temoin.push(`témoin « ${nom} » : la faute n'est PAS détectée`) }
// 1. le danger du jour J : un lecteur qui prend le titre long dans <title>
const lireDansTitle = (html, langue, slug) => ({ ...metadonneesDepuisHtml(html, langue, slug), title: html.match(/<title>([\s\S]*?)<\/title>/)[1].replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/ \| Cleo Labs$/, '') })
doitEchouer('titre long lu dans <title>', controlerPages(lireDansTitle), /le titre long reste celui du JSON-LD/)
// 2. un lecteur qui ne reconstitue jamais le titre court
const sansCourt = (html, langue, slug) => { const { seoTitle, ...reste } = metadonneesDepuisHtml(html, langue, slug); return reste }
doitEchouer('titre court jamais reconstitué', controlerPages(sansCourt), /titre court lu dans <title>/)
// 3. un lecteur qui prend tout <title> pour un titre court, même égal au titre long
const toujoursCourt = (html, langue, slug) => ({ ...metadonneesDepuisHtml(html, langue, slug), seoTitle: 'x' })
doitEchouer('titre court inventé sur une page sans seoTitle', controlerPages(toujoursCourt), /pas de titre court/)
// 4. la règle d'avant (seoTitle ignoré) et la priorité inversée (seoTitle avant la ligne)
const ignorer = fichier => { const t = creerTitreSeo(fichier); return { ...t, titreSeo: a => t.titreSeo({ ...a, titreCourt: undefined }) } }
doitEchouer('seoTitle ignoré (règle d\'avant le 01/10)', controlerRegle(ignorer), /\(i\) seoTitle sans ligne/)
const inverser = fichier => { const sansFichier = creerTitreSeo({}), t = creerTitreSeo(fichier); return { ...t, titreSeo: a => a.titreCourt ? sansFichier.titreSeo(a) : t.titreSeo(a) } }
doitEchouer('priorité inversée', controlerRegle(inverser), /\(ii\) la ligne l'emporte/)
// 5. la chaîne sans aucun seoTitle : les titres attendus ne peuvent pas sortir (sinon le contrôle C ne lirait rien)
doitEchouer('chaîne sans seoTitle', controlerChaine(chaine({ avecSeoTitle: false })), /<title> de blog-essai-seotitle\.html/)

if (temoin.length) { console.error('TÉMOIN EN ÉCHEC :\n  ' + temoin.join('\n  ')); process.exit(1) }
if (ecarts.length) { console.error(`${ecarts.length} écart(s) :\n  ` + ecarts.join('\n  ')); process.exit(1) }
console.log('titre court, source : titres-courts.json > seoTitle de l\'article > repli ; titre long lu dans le JSON-LD, jamais dans <title> ; chaîne fragments.mjs prouvée sur copie ; 6 témoins négatifs détectés')
