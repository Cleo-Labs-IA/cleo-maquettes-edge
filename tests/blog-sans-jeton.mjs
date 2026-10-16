/* REPLI SANS JETON (scripts/blog-posts-public.mjs) : sans réseau. Une page d'article rendue donne exactement les
   métadonnées attendues ; tout ce qui n'est pas exactement l'article demandé est refusé ; rien d'hostile ne passe la
   validation stricte ; seuls les articles inconnus de blog/brut.json sont relus. */
import assert from 'node:assert/strict'
import { metadonneesDepuisHtml, articleDepuisPages, reconstituer, slugsDuPlan } from '../scripts/blog-posts-public.mjs'
import { validerMetadonneesBlog } from '../blog/securite-contenu.mjs'

const ld = objet => `<script type="application/ld+json">${JSON.stringify(objet).replace(/</g, '\\u003c')}</script>`
const page = (langue, slug, surcharge = {}) => {
  const fr = langue === 'fr'
  const article = {
    '@context': 'https://schema.org', '@type': 'TechArticle',
    headline: fr ? 'Titre « d\'essai » & <b>balise</b>' : 'Test "title" & <b>tag</b>',
    description: fr ? 'Une description.' : 'A description.',
    datePublished: '2026-09-30', author: [{ '@type': 'Person', name: 'Anaelle Guez' }],
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.cleolabs.co/${langue}/blog/${slug}` },
    image: { '@type': 'ImageObject', url: 'https://www.cleolabs.co/blog-bank/bureau.png' },
    articleSection: fr ? 'Conformité produit' : 'Product Compliance', ...surcharge,
  }
  const faq = { '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: fr ? 'Quoi ?' : 'What?', acceptedAnswer: { '@type': 'Answer', text: fr ? 'Ceci.' : 'This.' } }] }
  return `<!DOCTYPE html><html><head><meta property="article:tag" content="R&amp;D"/><meta property="article:tag" content="l&#x27;essai"/>
${ld({ '@type': 'Organization', name: 'Cleo Labs' })}${ld(article)}${ld(faq)}</head>
<body><p>12 min read ailleurs</p><article><h1>t</h1><span>6<!-- --> ${fr ? 'min de lecture' : 'min read'}</span><section><h2>Corps</h2><p>99 min read plus bas</p></section></article></body></html>`
}
const SLUG = 'article-d-essai-2026'

// 1. Une page valide : chaque champ, entités et commentaires React compris.
const fr = metadonneesDepuisHtml(page('fr', SLUG), 'fr', SLUG)
assert.deepEqual(fr, {
  title: 'Titre « d\'essai » & <b>balise</b>', description: 'Une description.', date: '2026-09-30', category: 'Conformité produit',
  author: 'anaelle', readTime: '6 min de lecture', coverImage: '/blog-bank/bureau.png', keywords: ['R&D', "l'essai"], faq: [{ q: 'Quoi ?', a: 'Ceci.' }],
})
const article = articleDepuisPages(SLUG, page('fr', SLUG), page('en', SLUG))
assert.equal(validerMetadonneesBlog([article]).length, 1, 'l\'article reconstitué passe la validation stricte')
assert.deepEqual(article.readTime, { fr: '6 min de lecture', en: '6 min read' })
assert.deepEqual(article.faq, [{ q: { fr: 'Quoi ?', en: 'What?' }, a: { fr: 'Ceci.', en: 'This.' } }])
assert.equal(metadonneesDepuisHtml(page('en', SLUG, { image: { url: 'https://www.cleolabs.co/og-image.png' } }), 'en', SLUG).coverImage, undefined, 'image par défaut = pas de couverture')

// 2. Refus : tout ce qui n'est pas exactement l'article demandé.
const indexDuBlog = '<html><head>' + ld({ '@type': 'BreadcrumbList' }) + '</head><body><main>Blog</main></body></html>'
for (const [nom, html, langue] of [
  ['slug inconnu servi en 200 (index du blog)', indexDuBlog, 'en'],
  ['page d\'un autre article', page('en', 'un-autre-article'), 'en'],
  ['page de l\'autre langue', page('fr', SLUG), 'en'],
  ['auteur inconnu', page('en', SLUG, { author: [{ name: 'Inconnu' }] }), 'en'],
  ['image hors du site', page('en', SLUG, { image: { url: 'https://exemple.test/x.png' } }), 'en'],
  ['catégorie absente', page('en', SLUG, { articleSection: undefined }), 'en'],
  ['temps de lecture absent', page('en', SLUG).replace('min read</span>', 'minutes</span>').replace('99 min read', '99 minutes'), 'en'],
]) assert.throws(() => metadonneesDepuisHtml(html, langue, SLUG), /repli sans jeton/, `${nom} doit être refusé`)
assert.throws(() => articleDepuisPages(SLUG, page('fr', SLUG), page('en', SLUG, { datePublished: '2026-10-01' })), /date diffère/)

// 3. Le plan du site : deux langues par article, jamais vide.
const loc = (langue, slug) => `<url><loc>https://www.cleolabs.co/${langue}/blog/${slug}</loc></url>`
const plan = slugs => `<?xml version="1.0"?><urlset><url><loc>https://www.cleolabs.co/en/blog</loc></url>${slugs.map(s => loc('en', s) + loc('fr', s)).join('')}</urlset>`
assert.deepEqual(slugsDuPlan(plan(['b', 'a'])), ['b', 'a'])
assert.throws(() => slugsDuPlan('<html>Blog</html>'), /sitemap\.xml illisible/)
assert.throws(() => slugsDuPlan(plan([])), /aucun article/)
assert.throws(() => slugsDuPlan(`<urlset>${loc('en', 'seul')}</urlset>`), /une langue/)

// 4. Assemblage : seul l'article inconnu de blog/brut.json est relu, il passe en tête, le reste vient de brut.json.
const entree = (slug, langue) => ({ slug, langue, titre: `T ${langue}`, description: `D ${langue}`, date: '2026-09-01', categorie: `C ${langue}`,
  lecture: langue === 'fr' ? '5 min de lecture' : '5 min read', auteur: 'naomie', couverture: 'photo.png', faq: [{ q: `Q ${langue}`, a: `R ${langue}` }] })
const anciens = ['ancien-1', 'ancien-2', 'ancien-3', 'ancien-4', 'ancien-5', 'ancien-6', 'ancien-7']
const brut = anciens.flatMap(s => [entree(s, 'fr'), entree(s, 'en')])
const lues = []
const lirePage = (langue, slug) => { lues.push(`${langue}/${slug}`); return page(langue, slug) }
const tous = await reconstituer({ plan: plan([SLUG, ...[...anciens].reverse()]), brut, lirePage })
assert.deepEqual(lues, [`fr/${SLUG}`, `en/${SLUG}`], 'seules les deux pages de l\'article nouveau sont relues')
assert.deepEqual(tous.map(a => a.slug), [SLUG, ...anciens], 'nouveau en tête, puis l\'ordre de blog/brut.json')
assert.deepEqual(tous[1], { slug: 'ancien-1', author: 'naomie', title: { fr: 'T fr', en: 'T en' }, description: { fr: 'D fr', en: 'D en' }, date: '2026-09-01',
  category: { fr: 'C fr', en: 'C en' }, readTime: { fr: '5 min de lecture', en: '5 min read' }, coverImage: '/blog-bank/photo.png', keywords: [],
  faq: [{ q: { fr: 'Q fr', en: 'Q en' }, a: { fr: 'R fr', en: 'R en' } }] })
// Second passage, l'article désormais dans brut.json : plus rien à relire.
lues.length = 0
await reconstituer({ plan: plan([SLUG, ...anciens]), brut: [...brut, { ...entree(SLUG, 'fr') }, { ...entree(SLUG, 'en') }], lirePage })
assert.deepEqual(lues, [], 'un article déjà porté n\'est pas relu')
// Un plan tronqué ne vide pas le blog ; une métadonnée hostile est arrêtée par la validation stricte.
await assert.rejects(reconstituer({ plan: plan([SLUG]), brut, lirePage }), /plan tronqué/)
await assert.rejects(reconstituer({ plan: plan([SLUG, ...anciens]), brut, lirePage: (l, s) => page(l, s, { datePublished: '2026-09-30"><img src=x onerror=alert(1)>' }) }), /blog-posts\.json invalide/)
await assert.rejects(reconstituer({ plan: plan([SLUG, ...anciens]), brut, lirePage: () => { throw new Error('repli sans jeton : code 404') } }), /code 404/)

console.log('Repli sans jeton validé : champs exacts, pages étrangères refusées, plan tronqué refusé, validation stricte conservée.')
