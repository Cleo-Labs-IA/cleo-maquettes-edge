import sanitizeHtml from 'sanitize-html'

const CHAMPS = new Set(['author', 'category', 'coverAspect', 'coverImage', 'date', 'description', 'faq', 'featured', 'keywords', 'readTime', 'related', 'seoTitle', 'slug', 'title', 'tweet'])
const AUTEURS = new Set(['naomie', 'anaelle', 'alex'])
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const FICHIER_IMAGE = /^\/(?:blog-bank\/)?[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:avif|jpe?g|png|webp)$/
const CONTROLE = /[\u0000-\u001f\u007f]/

function erreur(message) {
  throw new Error(`blog-posts.json invalide : ${message}`)
}

function objetSimple(valeur, nom) {
  if (!valeur || typeof valeur !== 'object' || Array.isArray(valeur) || Object.getPrototypeOf(valeur) !== Object.prototype) erreur(`${nom} doit être un objet simple`)
  return valeur
}

function texte(valeur, nom, maximum, minimum = 1) {
  if (typeof valeur !== 'string' || valeur.length < minimum || valeur.length > maximum || CONTROLE.test(valeur)) erreur(`${nom} doit être un texte de ${minimum} à ${maximum} caractères sans caractère de contrôle`)
  return valeur
}

function objetBilingue(valeur, nom, maximum) {
  const o = objetSimple(valeur, nom)
  const cles = Object.keys(o).sort()
  if (cles.length !== 2 || cles[0] !== 'en' || cles[1] !== 'fr') erreur(`${nom} doit contenir exactement fr et en`)
  return { fr: texte(o.fr, `${nom}.fr`, maximum), en: texte(o.en, `${nom}.en`, maximum) }
}

/* seoTitle (facultatif, 01/10/2026) : le <title> court de l'article, écrit par cleo-landing. Bilingue strict, 1 à 60
   caractères par langue, sans caractère de contrôle ; il finit dans un <title>, donc aucun chevron non plus. */
function titreCourtBilingue(valeur, nom) {
  const t = objetBilingue(valeur, nom, 60)
  for (const langue of ['fr', 'en']) if (/[<>]/.test(t[langue]) || !t[langue].trim()) erreur(`${nom}.${langue} doit être un texte sans balise`)
  return t
}

function dateIso(valeur, nom) {
  if (typeof valeur !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valeur)) erreur(`${nom} doit être une date ISO YYYY-MM-DD`)
  const d = new Date(`${valeur}T00:00:00.000Z`)
  if (Number.isNaN(d.valueOf()) || d.toISOString().slice(0, 10) !== valeur) erreur(`${nom} n'est pas une date civile valide`)
  return valeur
}

function listeTextes(valeur, nom, maximumElements, maximumTexte, motif = null) {
  if (!Array.isArray(valeur) || valeur.length > maximumElements) erreur(`${nom} doit être une liste de ${maximumElements} entrées au maximum`)
  const sortie = valeur.map((v, i) => texte(v, `${nom}[${i}]`, maximumTexte))
  if (motif && sortie.some(v => !motif.test(v))) erreur(`${nom} contient une valeur hors format`)
  if (new Set(sortie).size !== sortie.length) erreur(`${nom} contient un doublon`)
  return sortie
}

export function validerMetadonneesBlog(donnees) {
  const articles = Array.isArray(donnees)
    ? donnees
    : donnees && typeof donnees === 'object' && !Array.isArray(donnees) ? Object.values(donnees) : null
  if (!articles || articles.length > 500) erreur('la racine doit contenir au maximum 500 articles')
  const vus = new Set()
  return articles.map((brut, index) => {
    const article = objetSimple(brut, `article[${index}]`)
    const inconnus = Object.keys(article).filter(cle => !CHAMPS.has(cle))
    if (inconnus.length) erreur(`article[${index}] contient des champs inconnus : ${inconnus.join(', ')}`)
    const slug = texte(article.slug, `article[${index}].slug`, 100)
    if (!SLUG.test(slug)) erreur(`article[${index}].slug est hors format`)
    if (vus.has(slug)) erreur(`slug dupliqué : ${slug}`)
    vus.add(slug)
    if (!AUTEURS.has(article.author)) erreur(`${slug}.author est inconnu`)
    const readTime = objetBilingue(article.readTime, `${slug}.readTime`, 32)
    if (!/^\d{1,3} min de lecture$/.test(readTime.fr) || !/^\d{1,3} min read$/.test(readTime.en)) erreur(`${slug}.readTime est hors format`)
    if (article.coverImage !== undefined && (typeof article.coverImage !== 'string' || !FICHIER_IMAGE.test(article.coverImage))) erreur(`${slug}.coverImage doit être une image locale sûre`)
    if (article.coverAspect !== undefined && article.coverAspect !== 'square') erreur(`${slug}.coverAspect est hors format`)
    if (article.featured !== undefined && typeof article.featured !== 'boolean') erreur(`${slug}.featured doit être booléen`)
    const faq = article.faq === undefined ? [] : article.faq
    if (!Array.isArray(faq) || faq.length > 20) erreur(`${slug}.faq doit contenir au maximum 20 entrées`)
    const faqValidee = faq.map((entree, i) => {
      const q = objetSimple(entree, `${slug}.faq[${i}]`)
      const cles = Object.keys(q).sort()
      if (cles.length !== 2 || cles[0] !== 'a' || cles[1] !== 'q') erreur(`${slug}.faq[${i}] doit contenir exactement q et a`)
      return { q: objetBilingue(q.q, `${slug}.faq[${i}].q`, 500), a: objetBilingue(q.a, `${slug}.faq[${i}].a`, 3000) }
    })
    return {
      slug,
      title: objetBilingue(article.title, `${slug}.title`, 500),
      ...(article.seoTitle === undefined ? {} : { seoTitle: titreCourtBilingue(article.seoTitle, `${slug}.seoTitle`) }),
      description: objetBilingue(article.description, `${slug}.description`, 1500),
      category: objetBilingue(article.category, `${slug}.category`, 100),
      author: article.author,
      date: dateIso(article.date, `${slug}.date`),
      readTime,
      ...(article.coverImage === undefined ? {} : { coverImage: article.coverImage }),
      ...(article.coverAspect === undefined ? {} : { coverAspect: article.coverAspect }),
      ...(article.featured === undefined ? {} : { featured: article.featured }),
      keywords: listeTextes(article.keywords, `${slug}.keywords`, 50, 100),
      ...(article.related === undefined ? {} : { related: listeTextes(article.related, `${slug}.related`, 20, 100, SLUG) }),
      ...(article.tweet === undefined ? {} : { tweet: objetBilingue(article.tweet, `${slug}.tweet`, 600) }),
      ...(article.faq === undefined ? {} : { faq: faqValidee }),
    }
  })
}

function hrefSur(href) {
  if (typeof href !== 'string' || href.length > 2048 || CONTROLE.test(href) || href.startsWith('//')) return false
  if (href.startsWith('#') || href.startsWith('/')) return true
  try {
    const u = new URL(href)
    return u.protocol === 'https:' || u.protocol === 'mailto:'
  } catch {
    return false
  }
}

function imageLocale(src) {
  return typeof src === 'string' && src.length <= 300 && /^(?:\/)?(?:blog-bank\/)?[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:avif|jpe?g|png|webp)$/.test(src)
}

export function assainirHtmlArticle(html) {
  if (typeof html !== 'string' || html.length > 2_000_000) throw new Error('HTML article invalide ou trop volumineux')
  return sanitizeHtml(html, {
    allowedTags: ['a', 'blockquote', 'br', 'cite', 'code', 'div', 'h2', 'h3', 'h4', 'img', 'li', 'ol', 'p', 'pre', 'span', 'strong', 'em', 'b', 'i', 'u', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul'],
    allowedAttributes: { a: ['href'], div: ['class'], h2: ['id'], h3: ['id'], h4: ['id'], img: ['src', 'alt'], td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan'] },
    allowedClasses: { div: ['bl-encart'] },
    allowedSchemes: ['https', 'mailto'],
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    nonTextTags: ['script', 'style', 'textarea', 'xmp', 'iframe', 'object', 'embed', 'svg', 'math', 'template'],
    transformTags: {
      a: (tagName, attributs) => ({ tagName, attribs: hrefSur(attributs.href) ? { href: attributs.href } : {} }),
      img: (tagName, attributs) => ({ tagName, attribs: imageLocale(attributs.src) ? { src: attributs.src, ...(typeof attributs.alt === 'string' ? { alt: attributs.alt.slice(0, 500) } : {}) } : {} }),
    },
    exclusiveFilter: cadre => cadre.tag === 'img' && !imageLocale(cadre.attribs.src),
    enforceHtmlBoundary: true,
  })
}
