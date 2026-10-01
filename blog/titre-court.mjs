/* TITRE COURT D'UN ARTICLE (le <title> de sa page), fonction pure, sans fichier ni réseau : importée par
   blog/fragments.mjs, blog/porter.mjs, scripts/blog-posts-public.mjs et tests/titre-court-source.mjs.

   D'où vient le titre court, dans l'ordre :
     (a) blog/titres-courts.json, s'il a le slug et la langue (écrit à la main ici, il l'emporte toujours) ;
     (b) sinon le `seoTitle` de l'article dans blog-posts.json (écrit par cleo-landing avec l'article du jour), gardé
         dans blog/brut.json sous `titreCourt` pour survivre aux relais suivants, qui ne retéléchargent pas l'article ;
     (c) sinon le repli : le titre long coupé à la limite d'un mot. Seul (c) est compté comme repli.
   Dans les trois cas : 60 caractères au plus, suffixe « | Cleo Labs » ajouté quand il tient. Le h1, og:title et le
   headline du JSON-LD restent le titre long : cette fonction ne rend que le <title>. */
export const SUFFIXE_TITRE = ' | Cleo Labs'
export const TITRE_MAX = 60
export const longueur = t => [...t].length
const propre = v => typeof v === 'string' ? v.replace(/\s+/g, ' ').trim() : ''

/* Un titre court venu d'ailleurs (blog-posts.json, blog/brut.json, <title> d'une page) : texte de 1 à 60 caractères,
   sans caractère de contrôle ni chevron. Rend le texte, ou null. */
export function titreCourtValide(valeur) {
  if (typeof valeur !== 'string' || !valeur.length || valeur.length > TITRE_MAX) return null
  if (/[\u0000-\u001f\u007f<>]/.test(valeur) || !valeur.trim()) return null
  return valeur
}

export function couperAuMot(t, max) {
  if (longueur(t) <= max) return t
  let r = ''
  for (const mot of t.split(/\s+/)) { const essai = r ? r + ' ' + mot : mot; if (longueur(essai) > max) break; r = essai }
  if (!r) r = [...t].slice(0, max).join('')   // un seul mot plus long que la limite
  return r.replace(/[\s,;:.!?«»"'’(–—-]+$/u, '') || [...t].slice(0, max).join('')
}

export const avecSuffixe = base => (longueur(base) + longueur(SUFFIXE_TITRE) <= TITRE_MAX && !/Cleo Labs/i.test(base)) ? base + SUFFIXE_TITRE : base

/* titresCourts : le contenu de blog/titres-courts.json (slug → { fr, en }).
   Rend titreSeo(article) où article = { slug, langue, titre (long), titreCourt? (seoTitle de la langue) },
   origine(article) (« fichier », « article » ou « repli », sans rien compter) et replis() (nombre de (c) servis). */
export function creerTitreSeo(titresCourts = {}) {
  const titresPris = { fr: new Set(), en: new Set() }
  let replis = 0
  const choisir = a => {
    const ligne = titresCourts && Object.hasOwn(titresCourts, a.slug) && titresCourts[a.slug] ? propre(titresCourts[a.slug][a.langue]) : ''
    if (ligne && longueur(ligne) <= TITRE_MAX) return ['fichier', ligne]
    const article = propre(titreCourtValide(a.titreCourt) || '')
    if (article && longueur(article) <= TITRE_MAX) return ['article', article]
    return ['repli', '']
  }
  const titreSeo = a => {
    const [origine, voulu] = choisir(a)
    let titre
    if (origine !== 'repli') titre = avecSuffixe(voulu)
    else {
      replis++
      const long = a.titre.replace(/\s+/g, ' ').trim()
      titre = avecSuffixe(couperAuMot(long, longueur(long) + longueur(SUFFIXE_TITRE) <= TITRE_MAX ? TITRE_MAX : TITRE_MAX - longueur(SUFFIXE_TITRE)))
      // deux replis identiques dans la même langue : on rend la place du suffixe au titre, quelques mots de plus les séparent
      if (titresPris[a.langue].has(titre.toLowerCase())) titre = couperAuMot(long, TITRE_MAX)
    }
    titresPris[a.langue].add(titre.toLowerCase())
    return titre
  }
  return { titreSeo, origine: a => choisir(a)[0], replis: () => replis }
}
