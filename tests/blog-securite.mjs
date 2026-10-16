import assert from 'node:assert/strict'
import { assainirHtmlArticle, validerMetadonneesBlog } from '../blog/securite-contenu.mjs'

const articleValide = () => ({
  slug: 'classification-douaniere-api',
  title: { fr: 'Classification douanière', en: 'Customs classification' },
  description: { fr: 'Une description sourcée.', en: 'A sourced description.' },
  category: { fr: 'Douane', en: 'Customs' },
  author: 'naomie', date: '2026-09-29',
  readTime: { fr: '5 min de lecture', en: '5 min read' },
  coverImage: '/blog-bank/customs.jpg', coverAspect: 'square', featured: false,
  keywords: ['douane', 'customs'], related: ['article-lie'],
  tweet: { fr: 'Résumé.', en: 'Summary.' },
  faq: [{ q: { fr: 'Quelle source ?', en: 'Which source?' }, a: { fr: 'La source citée.', en: 'The cited source.' } }],
})

assert.equal(validerMetadonneesBlog([articleValide()]).length, 1)
for (const [champ, transforme] of [
  ['date', a => { a.date = '2026-09-29\"><img src=x onerror=alert(1)>' }],
  ['cover', a => { a.coverImage = 'javascript:alert(1)' }],
  ['faq', a => { a.faq[0].q = { fr: 'Question' } }],
  ['unknown', a => { a.champInconnu = 'injecté' }],
]) {
  const article = articleValide()
  transforme(article)
  assert.throws(() => validerMetadonneesBlog([article]), /blog-posts\.json/i, `${champ} hostile doit être rejeté`)
}

const sale = `<section><h2 id="titre" onclick="alert(1)">Titre</h2>
  <p>Texte <a href="javascript:alert(1)">piège</a></p>
  <iframe src="https://evil.example/frame"></iframe><object data="https://evil.example/object"></object>
  <img src="https://evil.example/pixel" onerror="alert(1)">
  <img src="/blog-image-locale.jpg" onerror="alert(1)" alt="preuve">
  <svg><foreignObject><img src=x onerror=alert(1)></foreignObject></svg></section>`
const propre = assainirHtmlArticle(sale)
assert.doesNotMatch(propre, /javascript:|onerror|onclick|<iframe|<object|<svg|evil\.example/i)
assert.match(propre, /<img src="\/blog-image-locale\.jpg" alt="preuve" \/>/)
assert.match(propre, /<h2 id="titre">Titre<\/h2>/)

console.log('Frontière blog validée : schéma strict et HTML inerte.')
