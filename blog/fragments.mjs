/* Construit, à partir de blog/brut.json (corps extraits) et blog-posts.json, les fragments pages/blog/*.html,
   le manifeste blog/articles.json, les routes (blog/chemins-blog.json + commun/v6-routes.json), le SEO
   (blog/seo-blog.json), les couvertures (blog/images-blog.json) et le fil des deux index 24-blog(-en).html. */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const ICI = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SRC = process.env.BLOGSRC || '/private/tmp/claude-501/-Users-naomiehalioua-cleo-landing/b32a4fc1-7a13-4475-84be-385bbde13f98/scratchpad/blogsrc'
const BANK = '/Users/naomiehalioua/cleo-landing/public/blog-bank/'
const brut = JSON.parse(fs.readFileSync(path.join(ICI, 'blog/brut.json'), 'utf8'))
const POSTS = JSON.parse(fs.readFileSync(path.join(SRC, 'blog-posts.json'), 'utf8'))
const ech = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dateLisible = (d, en) => { const [y, m, j] = d.split('-').map(Number); return en ? `${j} ${MONTHS[m - 1]} ${y}` : `${j === 1 ? '1er' : j} ${MOIS[m - 1]} ${y}` }
const moisLisible = (d, en) => { const [y, m] = d.split('-').map(Number); const n = en ? MONTHS[m - 1] : MOIS[m - 1]; return (en ? n : n[0].toUpperCase() + n.slice(1)) + ' ' + y }
const AUTEURS = {
  naomie: { nom: 'Naomie Halioua', role: { fr: 'CDO et cofondatrice', en: 'CDO and co-founder' }, img: 'naomie', lien: 'https://www.linkedin.com/in/naomie-halioua/' },
  anaelle: { nom: 'Anaëlle Guez', role: { fr: 'CEO et cofondatrice', en: 'CEO and co-founder' }, img: 'anaelle', lien: 'https://www.linkedin.com/in/anaelle-guez-ab341746/' },
  alex: { nom: 'Alexandre Bloch', role: { fr: 'CTO', en: 'CTO' }, img: 'alex', lien: null },
}
const T = {
  fr: { sommaire: 'Sur cette page', faq: 'Questions fréquentes', sources: 'Sources', lire: 'À lire aussi', minutes: '30 minutes avec l\'équipe', voyez: 'Voyez ce que Cleo relève sur vos propres produits', gamme: 'Une gamme et deux marchés suffisent.', demo: 'Voir une démo', fil: 'Le fil', chiffres: 'Le blog en chiffres', articles: 'articles', signataires: 'Auteurs signataires', depuis: 'Premier article' },
  en: { sommaire: 'On this page', faq: 'Frequently asked questions', sources: 'Sources', lire: 'Read next', minutes: '30 minutes with the team', voyez: 'See what Cleo finds on your own products', gamme: 'One range and two markets are enough.', demo: 'Book a demo', fil: 'The feed', chiffres: 'The blog in figures', articles: 'articles', signataires: 'Signing authors', depuis: 'First article' },
}
const cle = f => 'blog-' + f.replace(/\.[a-z]+$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')
const COUVERTURE_DEFAUT = 'masse-pile'
/* 23/09/2026, Naomie : « utilise ~/outils-image-gemini/serie-monde-qui-bouge-v2 comme banque d'images pour les blogs,
   pour ne jamais avoir deux fois la même image ». Vingt visuels (R&D, production, essais, étiquetage, logistique),
   hors dépôt. Chaque article reçoit le visuel le moins utilisé de son thème (mots du slug, du titre, de la catégorie),
   les deux langues partagent le même, et le fil du blog ne montre jamais le même visuel deux cartes de suite. */
const BANQUE = process.env.BANQUE_MONDE || '/Users/naomiehalioua/outils-image-gemini/serie-monde-qui-bouge-v2/'
const MONDE = fs.existsSync(BANQUE) ? fs.readdirSync(BANQUE).filter(f => /^\d\d-.*\.jpg$/.test(f)).sort() : []
const THEMES = [
  [/toy|jouet|peluche|plush|child|enfant|kid/i, /^(01|06|10)-/],
  [/cosmet|fragran|parfum|dentifrice|soap|skin|hair|sunscreen|allergen|enzacamene|kohl/i, /^(03|07|11)-/],
  [/food|aliment|chocolat|formula|drink|alcohol|cereulide|nutrition|beverage|sauna/i, /^(02|08|14)-/],
  [/\bcar\b|vehicle|automotive|voiture|bike|battery|batter|dryer|appliance|electr/i, /^(04|09|12)-/],
  [/customs|douane|tariff|import|export|minimis|parcel|border|hs.?code|fee/i, /^(18|17|19)-/],
  [/label|étiquet|packag|emballage|ppwr|marking|claim|passport/i, /^(15)-/],
  [/textile|apparel|flamm|fire|inflamm|firework|sand|asbestos/i, /^(13|16)-/],
  [/3d|print|prototype|innovation|\bai\b|agent|llm|model|data act|skills|agentic/i, /^(05)-/],
  [/marketplace|retail|store|shop|recall|amazon|shein|temu|magasin|deliver|supply|warehouse|entrep|logist|opss|surveillance/i, /^(20|16|18)-/]]
const usage = {}; const couvertures = {}
const cleBanque = f => 'monde-' + f.replace(/-\d{8}-\d{6}-\d+\.jpg$/, '').replace(/^\d\d-/, '')
const moinsUtilise = (cands) => cands.slice().sort((a, b) => (usage[a] || 0) - (usage[b] || 0) || a.localeCompare(b))[0]
const couvertureDe = (a) => {
  if (couvertures[a.slug]) return couvertures[a.slug]
  if (!MONDE.length) return null
  const texte = `${a.slug} ${a.titre} ${a.categorie}`
  const theme = THEMES.find(([re]) => re.test(texte))
  const cands = theme ? MONDE.filter(f => theme[1].test(f)) : MONDE
  const f = moinsUtilise(cands.length ? cands : MONDE); usage[f] = (usage[f] || 0) + 1
  couvertures[a.slug] = f; return f
}
const images = {}; const chemins = {}; const seo = { pages: {}, structure: {} }; const manifeste = []
fs.mkdirSync(path.join(ICI, 'pages/blog'), { recursive: true })
const parLangue = { fr: brut.filter(a => a.langue === 'fr'), en: brut.filter(a => a.langue === 'en') }
for (const l of ['fr', 'en']) parLangue[l].sort((a, b) => b.date.localeCompare(a.date))
for (const a of parLangue.fr) couvertureDe(a)
for (const a of parLangue.en) couvertureDe(a)
// deux cartes voisines du fil ne montrent jamais le même visuel : on échange avec la première suivante qui diffère
{ const fil = parLangue.fr; for (let i = 1; i < fil.length; i++) { if (couvertures[fil[i].slug] !== couvertures[fil[i - 1].slug]) continue
  const j = fil.findIndex((x, k) => k > i && couvertures[x.slug] !== couvertures[fil[i - 1].slug] && (!fil[i + 1] || couvertures[x.slug] !== couvertures[fil[i + 1].slug]) && (!fil[k + 1] || couvertures[fil[i].slug] !== couvertures[fil[k + 1].slug]) && couvertures[fil[i].slug] !== couvertures[fil[k - 1].slug])
  if (j > 0) { const t = couvertures[fil[i].slug]; couvertures[fil[i].slug] = couvertures[fil[j].slug]; couvertures[fil[j].slug] = t } } }
const couvertureCle = (a) => { const f = couvertureDe(a); if (f) { const k = cleBanque(f); images[k] = [BANQUE + f, 1200]; return k } return a.couverture && fs.existsSync(BANK + a.couverture) ? cle(a.couverture) : COUVERTURE_DEFAUT }
const existants = { fr: [['12-article.html', 'PPWR : ce que le 12 août 2026 change pour vos emballages', 'masse-capsule', 'Emballage'], ['27-article-levee.html', 'Cleo lève 1,5 M€ pour automatiser la conformité réglementaire produit à l\'échelle mondiale', 'equipe', 'Entreprise']],
  en: [['27-article-levee-en.html', 'Cleo Labs raises €1.5M to automate product regulatory compliance at a global scale', 'equipe', 'Company'], ['28-article-vivatech-en.html', 'Cleo Labs wins the Scaleway Startup Challenge and joins VivaTech 2026', 'paris', 'Company']] }
for (const a of brut) {
  const en = a.langue === 'en'; const t = T[a.langue]; const au = AUTEURS[a.auteur] || AUTEURS.naomie
  const cover = couvertureCle(a)
  // corps : ancres sur les h2
  let n = 0; const ancres = []
  const corps = a.corps.map(c => c.html.replace(/<h2>([\s\S]*?)<\/h2>/, (m, titre) => { n++; ancres.push([`s${n}`, titre.replace(/<[^>]+>/g, '')]); return `<h2 id="s${n}">${titre}</h2>` })).join('\n')
  const faq = a.faq.length ? `<h2 id="questions">${t.faq}</h2>\n<div class="faq" data-schema="faq" style="margin-bottom:36px">\n` + a.faq.map((q, i) => `<details${i === 0 ? ' open' : ''}><summary>${ech(q.q)}<svg class="chev" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></summary><div class="reponse">${ech(q.a)}</div></details>`).join('\n') + '\n</div>' : ''
  const sources = a.sources ? a.sources.replace(/<h2>[^<]*<\/h2>/, `<h2 id="sources">${t.sources}</h2>`) : ''
  const sommaire = [...ancres.map(([id, ti]) => `<a href="#${id}">${ech(ti)}</a>`), ...(a.faq.length ? [`<a href="#questions">${t.faq}</a>`] : []), ...(a.sources ? [`<a href="#sources">${t.sources}</a>`] : [])].join('\n        ')
  // à lire aussi : les trois articles voisins par date, même langue
  const liste = parLangue[a.langue]; const i = liste.findIndex(x => x.slug === a.slug)
  // à lire aussi : trois voisines, de préférence avec un autre visuel que l'article lui-même
  const proches = [liste[i - 1], liste[i + 1], liste[i + 2], liste[i - 2], liste[i + 3], liste[i - 3]].filter(Boolean)
  const voisins = [...proches.filter(v => couvertureCle(v) !== cover), ...proches.filter(v => couvertureCle(v) === cover)].slice(0, 3)
  const cartes = voisins.map(v => { const c = couvertureCle(v); return `      <a class="sy-carte-photo" href="blog-${v.slug}${en ? '-en' : ''}.html"><img src="img:${c}" alt=""><span class="sy-etiquette">${ech(v.categorie)}</span><b>${ech(v.titre)}</b></a>` })
  for (const [f, ti, im, cat] of existants[a.langue].slice(0, 3 - cartes.length)) cartes.push(`      <a class="sy-carte-photo" href="${f}"><img src="img:${im}" alt=""><span class="sy-etiquette">${cat}</span><b>${ech(ti)}</b></a>`)
  const auteurHtml = au.lien
    ? `<a href="${au.lien}" rel="author noopener" target="_blank" style="display:flex;align-items:center;gap:12px"><img src="img:${au.img}" alt="${au.nom}" style="width:44px;height:44px;border-radius:50%;object-fit:cover"><span style="display:block"><span class="t-h3" style="display:block">${au.nom}</span><span class="t-caption" style="display:block">${au.role[a.langue]}</span></span></a>`
    : `<span style="display:flex;align-items:center;gap:12px"><img src="img:${au.img}" alt="${au.nom}" style="width:44px;height:44px;border-radius:50%;object-fit:cover"><span style="display:block"><span class="t-h3" style="display:block">${au.nom}</span><span class="t-caption" style="display:block">${au.role[a.langue]}</span></span></span>`
  const html = `<!--NAV-->
<!-- Article porté depuis www.cleolabs.co/${a.langue}/blog/${a.slug} le 23/09/2026 par blog/porter.mjs puis blog/fragments.mjs.
     Titre, chapô, corps, FAQ et sources sont repris tels quels (blog-posts.json + HTML rendu). Ne pas éditer à la main : régénérer. -->
<section class="sur-sombre section-serree bl-tete">
  <div class="conteneur">
    <div class="article-tete">
      <p class="sy-surtitre">${ech(a.categorie)}</p>
      <h1 class="t-titre-page" style="margin:20px 0 20px">${ech(a.titre)}</h1>
      <p class="t-body" style="margin:0 0 28px">${ech(a.description)}</p>
      <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        ${auteurHtml}
        <span class="t-caption" style="padding-left:14px;border-left:1px solid var(--c-filet-sombre)"><time datetime="${a.date}">${dateLisible(a.date, en)}</time> · ${ech(a.lecture)}</span>
      </div>
    </div>
  </div>
</section>

<section class="section sy-bande-photo">
  <figure>
    <img src="img:${cover}" alt="">
    <div class="sy-bande-texte">
      <p class="sy-etiquette">${ech(a.categorie)}</p>
    </div>
  </figure>
</section>

<section class="section bl-corps" style="padding-top:56px">
  <div class="conteneur">
    <div class="corps-sommaire">
      <nav class="sommaire">
        <div class="titre">${t.sommaire}</div>
        ${sommaire}
      </nav>
      <div class="article bl-article" style="margin:0">
${corps}
${faq}
${sources}
      </div>
    </div>
  </div>
</section>

<section class="section" style="padding-top:0">
  <div class="conteneur">
    <h2 class="t-h1" style="margin-bottom:28px">${t.lire}</h2>
    <div class="sy-carrousel" data-apparait>
${cartes.join('\n')}
    </div>
  </div>
</section>

<section class="section sy-final-photo">
  <figure>
    <img src="img:classeurs" alt="">
    <div class="sy-final-texte" data-apparait>
      <p class="sy-etiquette">${t.minutes}</p>
      <h2>${t.voyez}</h2>
      <p>${t.gamme}</p>
      <div class="sy-actions"><a class="sy-bouton sy-bouton-chevrons" href="https://meetings.hubspot.com/anaelle-guez/rendez-vous">${t.demo}</a></div>
    </div>
  </figure>
</section>
<!--PIED-->
`
  fs.writeFileSync(path.join(ICI, 'pages', a.fichier), html)
  const chemin = `/${a.langue}/blog/${a.slug}`
  chemins[a.sortie] = { chemin, reelle: true }
  seo.pages[a.sortie] = { titre: `${a.titre} | Cleo Labs`, description: a.description, source: 'site', url_source: `https://www.cleolabs.co${chemin}` }
  seo.structure[a.sortie] = { types: ['TechArticle', 'WebPage', 'BreadcrumbList'], proprietes: {
    WebPage: { name: a.titre, description: a.description },
    TechArticle: { headline: a.titre, description: a.description, datePublished: a.date, author: { '@type': 'Person', name: au.nom, ...(au.lien ? { url: au.lien } : {}) }, publisher: { '@id': 'https://www.cleolabs.co/#organization' }, inLanguage: en ? 'en-US' : 'fr-FR', articleSection: a.categorie },
    BreadcrumbList: { itemListElement: [
      { '@type': 'ListItem', position: 1, name: en ? 'Home' : 'Accueil', item: `https://www.cleolabs.co/${a.langue}` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `https://www.cleolabs.co/${a.langue}/blog` },
      { '@type': 'ListItem', position: 3, name: a.titre, item: `https://www.cleolabs.co${chemin}` }] } } }
  manifeste.push({ slug: a.slug, langue: a.langue, fichier: a.fichier, sortie: a.sortie, titre: a.titre, description: a.description, date: a.date, categorie: a.categorie, lecture: a.lecture, auteur: a.auteur, couverture: cover, faq: a.faq.length, sections: a.corps.length, motsCorps: a.mesure.motsCorps, h2s: a.mesure.h2s })
}
fs.writeFileSync(path.join(ICI, 'blog/articles.json'), JSON.stringify(manifeste, null, 1))
fs.writeFileSync(path.join(ICI, 'blog/chemins-blog.json'), JSON.stringify(chemins, null, 1))
fs.writeFileSync(path.join(ICI, 'blog/seo-blog.json'), JSON.stringify(seo, null, 1))
fs.writeFileSync(path.join(ICI, 'blog/images-blog.json'), JSON.stringify(images, null, 1))
// v6-routes.json : famille « article » pour chaque sortie
const vr = JSON.parse(fs.readFileSync(path.join(ICI, 'commun/v6-routes.json'), 'utf8'))
for (const a of brut) vr[a.sortie] = 'article'
fs.writeFileSync(path.join(ICI, 'commun/v6-routes.json'), JSON.stringify(vr, null, 2) + '\n')
// les deux index : le fil complet, du plus récent au plus ancien, par mois
for (const l of ['fr', 'en']) {
  const en = l === 'en'; const t = T[l]; const f = path.join(ICI, 'pages', en ? '24-blog-en.html' : '24-blog.html'); let s = fs.readFileSync(f, 'utf8')
  const tous = [...parLangue[l].map(a => ({ href: `blog-${a.slug}${en ? '-en' : ''}.html`, titre: a.titre, date: a.date, cat: a.categorie, img: couvertureCle(a) })),
    ...POSTS.filter(p => ['eu-ppwr-packaging-conformity-2026', 'cleo-labs-raises-1-5m-preseed', 'cleo-labs-vivatech-2026-scaleway-startup-challenge', 'global-product-compliance-pitch-by-deel'].includes(p.slug)).map(p => ({ href: { 'eu-ppwr-packaging-conformity-2026': '12-article.html', 'cleo-labs-raises-1-5m-preseed': '27-article-levee.html', 'cleo-labs-vivatech-2026-scaleway-startup-challenge': '28-article-vivatech.html', 'global-product-compliance-pitch-by-deel': '29-article-deel.html' }[p.slug].replace('.html', en ? '-en.html' : '.html'), titre: p.title[l], date: p.date, cat: p.category[l], img: p.coverImage && fs.existsSync(BANK + p.coverImage.replace('/blog-bank/', '')) ? cle(p.coverImage.replace('/blog-bank/', '')) : COUVERTURE_DEFAUT }))]
    .filter(x => !(en && x.href === '12-article-en.html')).sort((a, b) => b.date.localeCompare(a.date))
  for (const x of tous) if (x.img !== COUVERTURE_DEFAUT && !images[x.img]) { const p = POSTS.find(p => p.coverImage && cle(p.coverImage.replace('/blog-bank/', '')) === x.img); if (p) images[x.img] = [BANK + p.coverImage.replace('/blog-bank/', ''), 1200] }
  let fil = ''; let mois = ''
  const parMois = {}; for (const x of tous) { const k = x.date.slice(0, 7); parMois[k] = (parMois[k] || 0) + 1 }
  for (const x of tous) {
    const k = x.date.slice(0, 7)
    if (k !== mois) { mois = k; fil += `        <div class="blog-mois"><span class="t-label">${moisLisible(x.date, en)}</span><span class="t-caption">${parMois[k]}</span></div>\n` }
    fil += `        <a class="blog-art" href="${x.href}">\n          <div class="blog-art-img"><img src="img:${x.img}" alt=""><span class="etiquette">${ech(x.cat)}</span></div>\n          <div class="corps-carte">\n            <time class="t-caption date" datetime="${x.date}">${dateLisible(x.date, en)}</time>\n            <h3 class="titre-carte">${ech(x.titre)}</h3>\n          </div>\n        </a>\n`
  }
  const debut = s.indexOf('<div class="blog-grille"'); const finGrille = s.indexOf('    </div>\n', s.indexOf('</a>\n', s.lastIndexOf('<a class="blog-art"')))
  if (debut < 0 || finGrille < 0) throw new Error('grille introuvable : ' + f)
  s = s.slice(0, debut) + `<div class="blog-grille" style="margin-bottom:88px">\n${fil}` + s.slice(finGrille)
  // « Le blog en chiffres » : comptés sur le manifeste ; le lien « Voir tous les articles sur cleolabs.co » tombe
  const auteurs = {}; for (const p of POSTS) auteurs[p.author] = (auteurs[p.author] || 0) + 1
  const premier = POSTS.map(p => p.date).sort()[0]; const dernier = POSTS.map(p => p.date).sort().slice(-1)[0]
  s = s.replace(/<div class="mesures">[\s\S]*?<\/div>\s*<div class="centre"[^>]*>[\s\S]*?<\/div>/, `<div class="mesures">
      <div class="ligne"><div class="libelle">${en ? `Articles listed on this page, ${dateLisible(dernier, true)}` : `Articles listés sur cette page, au ${dateLisible(dernier, false)}`}</div><div class="valeur">${tous.length}</div></div>
      <div class="ligne"><div class="libelle">${t.signataires} : Naomie Halioua ${auteurs.naomie || 0}, Anaëlle Guez ${auteurs.anaelle || 0}, Alexandre Bloch ${auteurs.alex || 0}</div><div class="valeur">3</div></div>
      <div class="ligne"><div class="libelle">${en ? 'First dated article of the blog' : 'Le premier article daté du blog'}</div><div class="valeur">${dateLisible(premier, en)}</div></div>
    </div>`)
  s = s.replace(/<h2>(Le blog en chiffres|The blog in figures)[^<]*<\/h2>/, `<h2>${en ? 'The blog in figures, as of ' + dateLisible(dernier, true) : 'Le blog en chiffres, au ' + dateLisible(dernier, false)}</h2>`)
  fs.writeFileSync(f, s)
}
fs.writeFileSync(path.join(ICI, 'blog/images-blog.json'), JSON.stringify(images, null, 1))
console.log(`fragments : ${manifeste.length} · couvertures : ${Object.keys(images).length} · routes : ${Object.keys(chemins).length}`)
