/* ════════════════════════════════════════════════════════════════
   SEO DE L'ACCUEIL : ce que Google lit aujourd'hui sur www.cleolabs.co/fr et
   /en doit se retrouver sur l'accueil V6 (pages 43 FR et EN).

   17/09/2026, Naomie : « prépare-moi la page pour que je reste bien référencée
   Google comme avant ». Export Search Console du 27/04 au 26/07/2026 : l'accueil
   fait 1 078 des 1 551 clics du site, et 900 clics viennent de la marque.

   L'oracle est le vrai site, jamais la maquette :
     node tests/seo-accueil.mjs --capturer   relève /fr et /en en ligne, écrit l'instantané
     node tests/seo-accueil.mjs              compare sortie/ à l'instantané, code 1 au moindre écart
   Un écart accepté est écrit dans EXCEPTIONS avec sa raison ; rien d'autre ne passe.
   Témoin : les contrôles se rejouent sur des copies abîmées de la page et doivent y
   échouer, sinon le test sort en erreur (un contrôle qui ne voit rien ne protège rien).
   ════════════════════════════════════════════════════════════════ */
import fs from 'fs'
import path from 'path'

const ICI = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const INSTANTANE = path.join(ICI, 'tests/instantanes/accueil-cleolabs-prod.json')
const PROD = 'https://www.cleolabs.co'
const PAGES = { fr: '43-accueil-avant-vendre.html', en: '43-accueil-avant-vendre-en.html' }

const EXCEPTIONS = {
  types: {
    VideoObject: "l'accueil V6 n'a pas de vidéo. Une donnée structurée ne décrit que du contenu visible (spec de migration V6, « Contrat SEO/GEO bloquant »).",
  },
  organisation: {
    slogan: 'retiré dans commun/seo.json (_retire) : il inscrit une marque tierce dans la définition de Cleo Labs.',
    contactPoint: 'retiré dans commun/seo.json (_retire) : deux adresses concurrentes, aucune choisie.',
  },
  sameAs: {
    'https://www.crunchbase.com/organization/celo-labs': 'slug fautif (« celo ») : à corriger sur Crunchbase, pas à recopier.',
  },
  liens: {
    '/fr/event': "page de l'événement de Bruxelles du 09/09/2026, passé. L'adresse reste servie ; elle quitte seulement l'accueil. À trancher par Naomie.",
    '/en/event': 'idem, en anglais.',
  },
}

// ── Lecture d'une page : uniquement ce qu'un moteur lit.
const entites = (t) => t.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&')
const norm = (t) => entites(t).replace(/[’‘]/g, "'").replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim()
const plat = (t) => norm(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const attrs = (balise) => Object.fromEntries([...balise.matchAll(/([a-zA-Z][\w:-]*)="([^"]*)"/g)].map(m => [m[1].toLowerCase(), entites(m[2])]))

function lire(html) {
  const tete = html.slice(0, html.indexOf('</head>'))
  const corps = html.slice(html.indexOf('<body'))
  const metas = {}
  for (const m of tete.matchAll(/<meta\b[^>]*>/g)) {
    const a = attrs(m[0]); const cle = a.property || a.name
    if (cle && a.content !== undefined && !(cle in metas)) metas[cle] = a.content
  }
  const liensTete = [...tete.matchAll(/<link\b[^>]*>/g)].map(m => attrs(m[0]))
  const hreflang = {}
  for (const l of liensTete) if (l.rel === 'alternate' && l.hreflang) hreflang[l.hreflang] = l.href
  const blocs = []
  let illisibles = 0
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { const o = JSON.parse(m[1]); for (const b of [].concat(o['@graph'] || o)) blocs.push(b) } catch { illisibles++ }
  }
  const texte = norm(corps.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>|<noscript[\s\S]*?<\/noscript>/g, ' ').replace(/<[^>]+>/g, ' '))
  const liens = new Set()
  for (const m of corps.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)) {
    let h = entites(m[1]).split('#')[0].split('?')[0]
    h = h.replace(/^https?:\/\/(www\.)?cleolabs\.co/, '')
    if (!h.startsWith('/')) continue
    if (h.length > 1) h = h.replace(/\/$/, '')
    liens.add(h)
  }
  return {
    lang: (html.match(/<html[^>]*\blang="([^"]*)"/) || [])[1] || null,
    titre: norm((tete.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || ''),
    metas,
    canonical: (liensTete.find(l => l.rel === 'canonical') || {}).href || null,
    hreflang,
    blocs, illisibles,
    h1: [...corps.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => norm(m[1].replace(/<[^>]+>/g, ' '))),
    texte,
    mots: texte.split(' ').filter(Boolean).length,
    liens: [...liens].sort(),
    vercel: /href="https?:\/\/[^"]*vercel\.app/.test(corps),
  }
}

// ── Les contrôles. Chaque ligne a un nom stable : le témoin s'en sert.
const OG = ['og:title', 'og:url', 'og:type', 'og:site_name', 'og:locale', 'og:image', 'og:image:width', 'og:image:height', 'og:image:alt',
  'twitter:card', 'twitter:site', 'twitter:title', 'twitter:image']

function verifier(html, ref) {
  const m = lire(html)
  const r = []
  const ok = (nom, vrai, detail) => r.push({ nom, ok: !!vrai, detail: vrai ? '' : detail })
  const typesDe = (blocs) => new Set(blocs.map(b => b['@type']).flat())

  ok('titre', m.titre === ref.titre, `« ${m.titre} » au lieu de « ${ref.titre} »`)
  ok('canonical', m.canonical === ref.canonical, `${m.canonical} au lieu de ${ref.canonical}`)
  ok('hreflang', JSON.stringify(Object.entries(m.hreflang).sort()) === JSON.stringify(Object.entries(ref.hreflang).sort()),
    `${JSON.stringify(m.hreflang)} au lieu de ${JSON.stringify(ref.hreflang)}`)
  ok('lang', m.lang === ref.lang, `${m.lang} au lieu de ${ref.lang}`)
  for (const k of OG) if (k in ref.metas) ok(k, m.metas[k] === ref.metas[k], `« ${m.metas[k]} » au lieu de « ${ref.metas[k]} »`)

  const motCle = ref.titre.split(' | ')[0]
  const d = m.metas.description || ''
  ok('description', d.length >= 50 && d.length <= 160 && plat(d).includes(plat(motCle)),
    `${d.length} caractères, mot-clé « ${motCle} » ${plat(d).includes(plat(motCle)) ? 'présent' : 'absent'} : « ${d} »`)
  ok('og:description', !!m.metas['og:description'], 'absente')
  ok('mot-clé visible', plat(m.texte).includes(plat(motCle)), `« ${motCle} » absent du texte visible`)
  ok('h1 unique', m.h1.length === 1, `${m.h1.length} h1`)

  ok('structuré lisible', m.illisibles === 0, `${m.illisibles} bloc(s) JSON-LD illisible(s)`)
  const types = typesDe(m.blocs)
  const manquants = [...typesDe(ref.blocs)].filter(t => !types.has(t) && !(t in EXCEPTIONS.types))
  ok('types structurés', manquants.length === 0, `manquent : ${manquants.join(', ')}`)

  const faq = m.blocs.find(b => b['@type'] === 'FAQPage')
  if (faq) {
    const q = faq.mainEntity || []
    const invisibles = q.filter(x => !m.texte.includes(norm(x.name)) || !m.texte.includes(norm(x.acceptedAnswer.text)))
    ok('FAQ visible', q.length >= 5 && invisibles.length === 0, `${q.length} questions, ${invisibles.length} absentes du texte visible : ${invisibles.map(x => x.name).join(' / ')}`)
  }
  const howto = m.blocs.find(b => b['@type'] === 'HowTo')
  if (howto) {
    const e = howto.step || []
    const invisibles = e.filter(s => !m.texte.includes(norm(s.text)))
    ok('étapes visibles', e.length >= 3 && m.texte.includes(norm(howto.name)) && invisibles.length === 0,
      `${e.length} étapes, nom ${m.texte.includes(norm(howto.name)) ? 'visible' : 'absent'}, ${invisibles.length} étape(s) absente(s)`)
  }

  const org = m.blocs.find(b => b['@type'] === 'Organization') || {}
  const orgRef = ref.blocs.find(b => b['@type'] === 'Organization') || {}
  const clesManquantes = Object.keys(orgRef).filter(k => !(k in org) && !(k in EXCEPTIONS.organisation))
  ok('Organization', org['@id'] === orgRef['@id'] && clesManquantes.length === 0, `@id ${org['@id']}, manquent : ${clesManquantes.join(', ')}`)
  const sameAs = new Set(org.sameAs || [])
  const sameAsManquants = (orgRef.sameAs || []).filter(u => !sameAs.has(u) && !(u in EXCEPTIONS.sameAs))
  ok('sameAs', sameAsManquants.length === 0, `manquent : ${sameAsManquants.join(', ')}`)

  const liens = new Set(m.liens)
  const liensManquants = ref.liens.filter(l => !liens.has(l) && !(l in EXCEPTIONS.liens))
  ok('liens internes', liensManquants.length === 0, `manquent : ${liensManquants.join(', ')}`)
  ok('volume de texte', m.mots >= Math.round(ref.mots * 0.9), `${m.mots} mots contre ${ref.mots} en ligne`)
  ok('aucun lien vers la préversion', !m.vercel, 'un lien mène à un hôte vercel.app')
  /* Depuis le 23/09/2026 la page est destinée à la production : elle s'indexe, seul /apercu reste hors index. */
  ok('page indexable', /index,follow/.test(m.metas.robots || ''), `robots « ${m.metas.robots} »`)
  return r
}

// ── Capture de l'oracle.
if (process.argv.includes('--capturer')) {
  const snap = { _releve: new Date().toISOString(), _source: PROD, _exceptions: EXCEPTIONS }
  for (const langue of Object.keys(PAGES)) {
    const rep = await fetch(`${PROD}/${langue}`, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh) Chrome/124' } })
    if (rep.status !== 200) { console.error(`${PROD}/${langue} : HTTP ${rep.status}`); process.exit(1) }
    const l = lire(await rep.text())
    if (!l.titre || !l.canonical || !l.blocs.length) { console.error(`${PROD}/${langue} : relevé vide, instantané non écrit`); process.exit(1) }
    delete l.texte; delete l.vercel
    snap[langue] = l
    console.log(`${langue} : « ${l.titre} », ${l.blocs.length} blocs structurés, ${l.liens.length} liens internes, ${l.mots} mots, robots « ${l.metas.robots} »`)
  }
  fs.mkdirSync(path.dirname(INSTANTANE), { recursive: true })
  fs.writeFileSync(INSTANTANE, JSON.stringify(snap, null, 1) + '\n')
  console.log('instantané écrit :', path.relative(ICI, INSTANTANE))
  process.exit(0)
}

// ── Comparaison.
const snap = JSON.parse(fs.readFileSync(INSTANTANE, 'utf8'))
let echecs = 0
for (const [langue, fichier] of Object.entries(PAGES)) {
  const html = fs.readFileSync(path.join(ICI, 'sortie', fichier), 'utf8')
  const r = verifier(html, snap[langue])
  const ko = r.filter(x => !x.ok)
  echecs += ko.length
  console.log(`\n${langue.toUpperCase()} (${fichier}, oracle relevé le ${snap._releve.slice(0, 10)}) : ${r.length - ko.length}/${r.length} contrôles passent`)
  for (const x of ko) console.log(`  ÉCART ${x.nom} : ${x.detail}`)

  // Témoin : chaque altération doit faire tomber le contrôle qu'elle vise.
  const alterations = [
    ['titre', h => h.replace(/<title>[\s\S]*?<\/title>/, '<title>Accueil | Cleo Labs</title>')],
    ['liens internes', h => h.replace(/href="https:\/\/www\.cleolabs\.co\/(fr|en)\/jurisdictions\/france"/g, 'href="#"')],
    ['types structurés', h => h.replace(/<script type="application\/ld\+json">(?=\{"@context":"https:\/\/schema\.org","@type":"FAQPage")[\s\S]*?<\/script>/, '')],
    ['FAQ visible', h => h.replace(/(<div class="reponse">)[\s\S]*?(<\/div>)/, '$1$2')],
    ['og:image', h => h.replace(/<meta property="og:image" content="[^"]*">/, '')],
    ['page indexable', h => h.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex,nofollow">')],
  ]
  let muets = 0
  for (const [nom, alterer] of alterations) {
    const copie = alterer(html)
    const vise = verifier(copie, snap[langue]).find(x => x.nom === nom)
    if (copie === html || !vise || vise.ok) { muets++; console.log(`  TÉMOIN MUET ${nom} : ${copie === html ? "l'altération n'a rien changé" : 'le contrôle passe sur une page abîmée'}`) }
  }
  console.log(`  témoin : ${alterations.length - muets}/${alterations.length} altérations détectées`)
  echecs += muets
}
console.log(echecs ? `\n${echecs} écart(s) : l'accueil ne garde pas encore ce que Google lit en ligne.` : "\nL'accueil V6 porte tout ce que Google lit aujourd'hui sur cleolabs.co/fr et /en, écarts acceptés compris.")
process.exit(echecs ? 1 : 0)
