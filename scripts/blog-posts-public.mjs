#!/usr/bin/env node
/* REPLI SANS JETON (01/10/2026) : reconstitue $BLOGSRC/blog-posts.json sans lire le dépôt privé cleo-landing.
   Appelé par scripts/relais-ci.sh quand le secret LANDING_TOKEN manque. Deux sources, toutes deux déjà utilisées par le relais :
     - le plan du site de l'alias public de cleo-landing ($ANCIEN_SITE/sitemap.xml) donne la liste des articles ;
     - pour un article que blog/brut.json ne connaît pas : ses deux pages rendues (fr, en), téléchargées dans $BLOGSRC,
       dont le JSON-LD TechArticle et FAQPage, les balises article:tag et le temps de lecture affiché portent
       titre, description, date, catégorie, auteur, couverture, mots-clés, FAQ et temps de lecture ;
     - pour un article déjà porté : ses métadonnées versionnées dans blog/brut.json.
   Mesuré le 01/10/2026 sur les 284 pages (142 articles) : ces champs lus dans le HTML sont identiques, caractère pour
   caractère, à ceux de blog-posts.json. Les champs featured, tweet, related et coverAspect n'existent pas dans le HTML ;
   ils sont facultatifs dans blog/securite-contenu.mjs et ni blog/porter.mjs ni blog/fragments.mjs ne les lisent.
   Limite assumée : la correction d'un article DÉJÀ porté (titre, FAQ) n'est reprise qu'avec FORCER=1, qui relit tout.
   Rien n'est écrit si une seule vérification échoue : le fichier passe par validerMetadonneesBlog, comme avec le jeton. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { validerMetadonneesBlog } from '../blog/securite-contenu.mjs'

const CANONIQUE = 'https://www.cleolabs.co'
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const AUTEURS = { 'Naomie Halioua': 'naomie', 'Anaëlle Guez': 'anaelle', 'Anaelle Guez': 'anaelle', 'Alexandre Bloch': 'alex' }
const LANGUES = ['fr', 'en']
const refuser = message => { throw new Error(`repli sans jeton : ${message}`) }
const entites = s => s.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (tout, e) => {
  const k = e.toLowerCase()
  if (k[0] === '#') return String.fromCodePoint(k[1] === 'x' ? parseInt(k.slice(2), 16) : parseInt(k.slice(1), 10))
  return { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[k]
})

/* Les métadonnées d'UNE page d'article rendue. Refuse toute page qui n'est pas exactement l'article demandé
   (un slug inconnu répond 200 avec l'index du blog : pas de TechArticle, donc refus). */
export function metadonneesDepuisHtml(html, langue, slug) {
  const ici = `${langue}/${slug}`
  if (typeof html !== 'string' || html.length > 5_000_000) refuser(`${ici} : page absente ou trop volumineuse`)
  const blocs = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => { try { return JSON.parse(m[1]) } catch { return null } }).filter(b => b && typeof b === 'object')
  const articles = blocs.filter(b => b['@type'] === 'TechArticle')
  if (articles.length !== 1) refuser(`${ici} : ${articles.length} bloc(s) TechArticle, 1 attendu`)
  const a = articles[0]
  const adresse = `${CANONIQUE}/${langue}/blog/${slug}`
  if (a.mainEntityOfPage?.['@id'] !== adresse) refuser(`${ici} : la page décrit ${a.mainEntityOfPage?.['@id']}, pas ${adresse}`)
  const auteurs = Array.isArray(a.author) ? a.author : [a.author]
  if (auteurs.length !== 1 || !Object.hasOwn(AUTEURS, auteurs[0]?.name)) refuser(`${ici} : auteur inconnu (${auteurs.map(x => x?.name).join(', ')})`)
  const image = typeof a.image === 'string' ? a.image : a.image?.url
  if (typeof image !== 'string' || !image.startsWith(CANONIQUE + '/')) refuser(`${ici} : image hors du site (${image})`)
  const couverture = image.slice(CANONIQUE.length)
  const faqs = blocs.filter(b => b['@type'] === 'FAQPage')
  if (faqs.length > 1) refuser(`${ici} : plusieurs blocs FAQPage`)
  const faq = (faqs[0]?.mainEntity ?? []).map((q, i) => {
    if (q?.['@type'] !== 'Question' || typeof q.name !== 'string' || typeof q.acceptedAnswer?.text !== 'string') refuser(`${ici} : question ${i} de la FAQ illisible`)
    return { q: q.name, a: q.acceptedAnswer.text }
  })
  const debut = html.indexOf('<article')
  if (debut < 0) refuser(`${ici} : pas de <article>`)
  const texte = html.slice(debut).replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ')
  const lecture = (texte.match(langue === 'fr' ? /\d{1,3} min de lecture/ : /\d{1,3} min read/) || [])[0]
  if (!lecture) refuser(`${ici} : temps de lecture introuvable`)
  for (const [nom, valeur] of [['headline', a.headline], ['description', a.description], ['datePublished', a.datePublished], ['articleSection', a.articleSection]]) {
    if (typeof valeur !== 'string' || !valeur) refuser(`${ici} : ${nom} absent du TechArticle`)
  }
  return {
    title: a.headline, description: a.description, date: a.datePublished, category: a.articleSection,
    author: AUTEURS[auteurs[0].name], readTime: lecture,
    // /og-image.png est l'image par défaut du site : l'article n'a pas de couverture propre.
    coverImage: couverture === '/og-image.png' ? undefined : couverture,
    keywords: [...html.matchAll(/<meta property="article:tag" content="([^"]*)"/g)].map(m => entites(m[1])),
    faq,
  }
}

/* Un article bilingue à partir de ses deux pages : ce qui ne dépend pas de la langue doit être identique des deux côtés. */
export function articleDepuisPages(slug, pageFr, pageEn) {
  const fr = metadonneesDepuisHtml(pageFr, 'fr', slug), en = metadonneesDepuisHtml(pageEn, 'en', slug)
  for (const champ of ['date', 'author', 'coverImage']) if (fr[champ] !== en[champ]) refuser(`${slug} : ${champ} diffère entre fr et en`)
  if (fr.faq.length !== en.faq.length) refuser(`${slug} : la FAQ n'a pas le même nombre de questions en fr et en en`)
  if (JSON.stringify(fr.keywords) !== JSON.stringify(en.keywords)) refuser(`${slug} : mots-clés différents entre fr et en`)
  const bi = champ => ({ fr: fr[champ], en: en[champ] })
  return {
    slug, author: fr.author, title: bi('title'), description: bi('description'), date: fr.date, category: bi('category'), readTime: bi('readTime'),
    ...(fr.coverImage === undefined ? {} : { coverImage: fr.coverImage }),
    keywords: fr.keywords,
    ...(fr.faq.length ? { faq: fr.faq.map((q, i) => ({ q: { fr: q.q, en: en.faq[i].q }, a: { fr: q.a, en: en.faq[i].a } })) } : {}),
  }
}

/* Un article déjà porté, à partir de ses deux entrées de blog/brut.json. */
export function articleDepuisBrut(slug, fr, en) {
  for (const champ of ['date', 'auteur']) if (fr[champ] !== en[champ]) refuser(`${slug} : ${champ} diffère entre fr et en dans blog/brut.json`)
  const faqFr = fr.faq || [], faqEn = en.faq || []
  if (faqFr.length !== faqEn.length) refuser(`${slug} : FAQ de longueurs différentes dans blog/brut.json`)
  // blog/porter.mjs écrit « fichier.png » pour /blog-bank/fichier.png, et garde « /fichier.webp » tel quel.
  const IMAGE = /^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:avif|jpe?g|png|webp)$/
  const couverture = typeof fr.couverture !== 'string' ? undefined
    : IMAGE.test(fr.couverture) ? `/blog-bank/${fr.couverture}`
      : fr.couverture[0] === '/' && IMAGE.test(fr.couverture.slice(1)) ? fr.couverture : undefined
  return {
    slug, author: fr.auteur, title: { fr: fr.titre, en: en.titre }, description: { fr: fr.description, en: en.description }, date: fr.date,
    category: { fr: fr.categorie, en: en.categorie }, readTime: { fr: fr.lecture, en: en.lecture },
    ...(couverture === undefined ? {} : { coverImage: couverture }),
    keywords: [],
    ...(faqFr.length ? { faq: faqFr.map((q, i) => ({ q: { fr: q.q, en: faqEn[i].q }, a: { fr: q.a, en: faqEn[i].a } })) } : {}),
  }
}

/* Les slugs d'articles du plan du site, dans son ordre (du plus récent au plus ancien). Chaque article doit y figurer
   dans les deux langues. */
export function slugsDuPlan(xml) {
  if (typeof xml !== 'string' || !/<urlset[\s>]/.test(xml)) refuser('sitemap.xml illisible (pas de <urlset>)')
  const vus = new Map()
  for (const [, adresse] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const m = entites(adresse.trim()).match(/^https:\/\/www\.cleolabs\.co\/(fr|en)\/blog\/([^/?#]+)$/)
    if (!m) continue
    if (!SLUG.test(m[2]) || m[2].length > 100) refuser(`slug hors format dans le sitemap : ${m[2]}`)
    if (!vus.has(m[2])) vus.set(m[2], new Set())
    vus.get(m[2]).add(m[1])
  }
  for (const [slug, langues] of vus) if (langues.size !== 2) refuser(`${slug} n'est listé que dans une langue par le sitemap`)
  if (!vus.size) refuser('aucun article dans le sitemap')
  return [...vus.keys()]
}

/* Assemble la liste complète. `lirePage(langue, slug)` rend le HTML d'une page à relire, ou lève. Ordre : comme
   blog-posts.json, les nouveaux en tête (ordre du plan), puis les articles connus dans l'ordre de blog/brut.json. */
export async function reconstituer({ plan, brut, lirePage, toutRelire = false }) {
  const slugs = slugsDuPlan(plan)
  const connus = new Map()
  for (const entree of brut) { if (!connus.has(entree.slug)) connus.set(entree.slug, {}); connus.get(entree.slug)[entree.langue] = entree }
  const complet = slug => connus.has(slug) && connus.get(slug).fr && connus.get(slug).en
  const disparus = [...connus.keys()].filter(slug => !slugs.includes(slug))
  if (disparus.length > 5) refuser(`${disparus.length} articles déjà portés manquent au sitemap (${disparus.slice(0, 3).join(', ')}…) : plan tronqué ?`)
  const articles = []
  const depuisPages = async slug => articleDepuisPages(slug, await lirePage('fr', slug), await lirePage('en', slug))
  for (const slug of slugs) if (!complet(slug)) articles.push(await depuisPages(slug))
  for (const slug of connus.keys()) {
    if (!slugs.includes(slug) || !complet(slug)) continue
    articles.push(toutRelire ? await depuisPages(slug) : articleDepuisBrut(slug, connus.get(slug).fr, connus.get(slug).en))
  }
  validerMetadonneesBlog(articles)
  return articles
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const BLOGSRC = process.env.BLOGSRC
  const ANCIEN = process.env.ANCIEN_SITE || 'https://cleo-landing-cleo-academys-projects.vercel.app'
  if (!BLOGSRC) { console.error('BLOGSRC manquant'); process.exit(64) }
  const ICI = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
  const obtenir = async adresse => {
    for (let essai = 1; ; essai++) {
      try {
        const reponse = await fetch(adresse, { headers: { 'User-Agent': 'Mozilla/5.0 (cleo-site relais)' }, redirect: 'follow', signal: AbortSignal.timeout(30_000) })
        if (reponse.status !== 200) throw new Error(`code ${reponse.status}`)
        return await reponse.text()
      } catch (erreur) {
        if (essai === 3) refuser(`${adresse} : ${erreur.message}`)
        await new Promise(suite => setTimeout(suite, 2_000 * essai))
      }
    }
  }
  try {
    fs.mkdirSync(BLOGSRC, { recursive: true })
    let lues = 0
    const articles = await reconstituer({
      plan: await obtenir(`${ANCIEN}/sitemap.xml`),
      brut: JSON.parse(fs.readFileSync(path.join(ICI, 'blog/brut.json'), 'utf8')),
      toutRelire: process.env.FORCER === '1',
      lirePage: async (langue, slug) => {
        const html = await obtenir(`${ANCIEN}/${langue}/blog/${slug}`)
        if (!html.includes('<article')) refuser(`${langue}/${slug} : la page servie par ${ANCIEN} n'est pas un article`)
        fs.writeFileSync(path.join(BLOGSRC, `${langue}-${slug}.html`), html); lues++
        return html
      },
    })
    fs.writeFileSync(path.join(BLOGSRC, 'blog-posts.json'), JSON.stringify(articles))
    console.log(`repli sans jeton : ${articles.length} articles, ${lues} page(s) relue(s) sur ${ANCIEN}`)
  } catch (erreur) {
    console.error(`::error::${erreur.message}`)
    process.exit(1)
  }
}
