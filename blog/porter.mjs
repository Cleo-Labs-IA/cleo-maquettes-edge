/* PORTAGE DES ARTICLES DE BLOG (23/09/2026). Source de vérité : le HTML rendu de www.cleolabs.co, téléchargé dans
   <scratchpad>/blogsrc/<langue>-<slug>.html, et blog-posts.json (métadonnées bilingues). Ce script lit chaque page
   dans un navigateur (Playwright), en extrait l'en-tête, le corps et les sources, retire tout habillage (classes,
   svg, artefacts Next) et écrit un fragment par article et par langue dans pages/blog/, plus blog/articles.json.
   Modes : `node blog/porter.mjs sonde` (mesure seulement) · `node blog/porter.mjs` (écrit les fragments). */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'

const ICI = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SRC = process.env.BLOGSRC || '/private/tmp/claude-501/-Users-naomiehalioua-cleo-landing/b32a4fc1-7a13-4475-84be-385bbde13f98/scratchpad/blogsrc'
const POSTS = JSON.parse(fs.readFileSync(path.join(SRC, 'blog-posts.json'), 'utf8'))
const DEJA = new Set(['eu-ppwr-packaging-conformity-2026', 'cleo-labs-raises-1-5m-preseed', 'cleo-labs-vivatech-2026-scaleway-startup-challenge', 'global-product-compliance-pitch-by-deel'])
const MODE = process.argv[2] || 'ecrire'
const SEULEMENT = process.argv[3] ? new Set(process.argv[3].split(',')) : null

/* Extraction dans le DOM de la page en ligne. Tout se passe côté navigateur, sur le HTML tel que Next l'a servi. */
const EXTRAIRE = (langue) => {
  const FAQ_TITRES = ['questions fréquentes', 'frequently asked questions', 'faq']
  const RELIES = ['ressources associées', 'related resources', 'related articles', 'à lire aussi', 'read next']
  const norm = s => (s || '').replace(/\s+/g, ' ').trim()
  const art = document.querySelector('article')
  if (!art) return { erreur: 'pas de <article>' }
  const h1 = art.querySelector('h1')
  const time = art.querySelector('time')
  const cover = [...art.querySelectorAll('img')].map(i => i.getAttribute('srcset') || i.getAttribute('src') || '').map(s => decodeURIComponent(s)).find(s => /\/blog-bank\//.test(s))
  const coverFile = cover ? (cover.match(/\/blog-bank\/([^&\s?]+)/) || [])[1] : null
  const sections = [...art.querySelectorAll('section')]
  const corps = [], sources = []; let faqCorps = 0, relies = 0, cta = 0, faqGabarit = 0
  const nettoyer = (el) => {
    const c = el.cloneNode(true)
    c.querySelectorAll('svg, script, style, button, noscript').forEach(n => n.remove())
    // les encadrés du site (fond ou bordure arrondie) gardent une marque de classe unique, tout le reste de l'habillage tombe
    c.querySelectorAll('div, aside').forEach(n => { const k = n.getAttribute('class') || ''; if (/rounded|border-l-|bg-\[/.test(k) && n.textContent.trim().split(/\s+/).length > 3) n.setAttribute('data-encart', '1') })
    c.querySelectorAll('*').forEach(n => {
      for (const a of [...n.attributes]) {
        if (!['href', 'src', 'alt', 'datetime', 'colspan', 'rowspan', 'id', 'data-encart'].includes(a.name)) n.removeAttribute(a.name)
      }
      if (n.tagName === 'IMG') { const s = decodeURIComponent(n.getAttribute('src') || ''); const m = s.match(/\/blog-bank\/([^&\s?]+)/); n.setAttribute('src', m ? 'blog-bank/' + m[1] : s) }
      if (n.getAttribute('data-encart')) { n.removeAttribute('data-encart'); n.setAttribute('class', 'bl-encart') }
      if (n.tagName === 'A') { const h = n.getAttribute('href') || ''; if (h.startsWith('/')) n.setAttribute('href', 'https://www.cleolabs.co' + h) }
    })
    return c.innerHTML
  }
  for (const s of sections) {
    const h2 = s.querySelector('h2'); const t = norm(h2 && h2.textContent).toLowerCase()
    const cls = s.getAttribute('class') || ''
    if (FAQ_TITRES.includes(t)) { if (cls.includes('border-t')) faqGabarit++; else faqCorps++; continue }
    if (RELIES.some(r => t.startsWith(r))) { relies++; continue }
    if (t === 'sources') { sources.push(nettoyer(s)); continue }
    if (/bg-\[var\(--color-c-ink\)\]/.test(cls) || s.querySelector('a[href*="/meet"], a[href*="hubspot"]')) { cta++; continue }
    corps.push({ titre: norm(h2 && h2.textContent), html: nettoyer(s), mots: norm(s.textContent).split(' ').length })
  }
  // repli : un article sans <section> de corps
  let repli = null
  if (!corps.length) {
    const tout = art.cloneNode(true)
    tout.querySelectorAll('section').forEach(n => n.remove())
    const h = tout.querySelector('h1'); if (h) { let n = h; while (n && n.parentElement !== tout) n = n.parentElement; if (n) { let prev = n.previousElementSibling; n.remove(); } }
    repli = { html: nettoyer(tout), mots: norm(tout.textContent).split(' ').length }
  }
  const tete = art.querySelector('h1') ? art.querySelector('h1').closest('div') : null
  return {
    h1: norm(h1 && h1.textContent), date: time && (time.getAttribute('datetime') || time.getAttribute('dateTime')),
    coverFile, nSections: sections.length, corps, sources: sources.join('\n'), faqCorps, faqGabarit, relies, cta, repli,
    lecture: (norm(art.textContent).match(/(\d+) ?(min de lecture|min read)/) || [])[0] || null,
    motsCorps: corps.reduce((a, c) => a + c.mots, 0),
    h2s: corps.map(c => c.titre).filter(Boolean)
  }
}

const b = await chromium.launch({ headless: true })
const page = await b.newPage()
const manifeste = []; const stats = { ok: 0, repli: 0, erreurs: [], sansCover: [], sansSources: 0, sectionsMin: 99, sectionsMax: 0 }
for (const post of POSTS) {
  if (DEJA.has(post.slug)) continue
  if (SEULEMENT && !SEULEMENT.has(post.slug)) continue
  for (const langue of ['fr', 'en']) {
    const f = path.join(SRC, `${langue}-${post.slug}.html`)
    if (!fs.existsSync(f)) { stats.erreurs.push(`${langue} ${post.slug} : fichier absent`); continue }
    await page.setContent(fs.readFileSync(f, 'utf8'), { waitUntil: 'domcontentloaded' })
    const r = await page.evaluate(EXTRAIRE, langue)
    if (r.erreur) { stats.erreurs.push(`${langue} ${post.slug} : ${r.erreur}`); continue }
    if (r.repli) stats.repli++; else stats.ok++
    if (!r.coverFile) stats.sansCover.push(`${langue} ${post.slug}`)
    if (!r.sources) stats.sansSources++
    stats.sectionsMin = Math.min(stats.sectionsMin, r.corps.length); stats.sectionsMax = Math.max(stats.sectionsMax, r.corps.length)
    manifeste.push({ slug: post.slug, langue, fichier: `blog/${post.slug}${langue === 'en' ? '-en' : ''}.html`, sortie: `blog-${post.slug}${langue === 'en' ? '-en' : ''}.html`,
      titre: post.title[langue], description: post.description[langue], date: post.date, categorie: post.category[langue], lecture: post.readTime[langue],
      auteur: post.author, couverture: r.coverFile || (post.coverImage ? post.coverImage.replace('/blog-bank/', '') : null), faq: (post.faq || []).map(q => ({ q: q.q[langue], a: q.a[langue] })),
      mesure: { h1: r.h1, dateLue: r.date, sections: r.corps.length, motsCorps: r.motsCorps, h2s: r.h2s.slice(0, 3), faqCorps: r.faqCorps, faqGabarit: r.faqGabarit, relies: r.relies, cta: r.cta, repli: !!r.repli },
      ...(MODE === 'ecrire' ? { corps: r.corps, sources: r.sources, repli: r.repli } : {}) })
  }
}
await b.close()
if (MODE === 'sonde') {
  console.log(JSON.stringify(stats, null, 1))
  const dist = {}; for (const m of manifeste) { const k = m.mesure.sections; dist[k] = (dist[k] || 0) + 1 }
  console.log('sections par article :', dist)
  console.log('faqCorps :', manifeste.filter(m => m.mesure.faqCorps).length, '| faqGabarit :', manifeste.filter(m => m.mesure.faqGabarit).length, '| relies :', manifeste.filter(m => m.mesure.relies).length, '| cta :', manifeste.filter(m => m.mesure.cta).length)
  console.log('sans h2 :', manifeste.filter(m => !m.mesure.h2s.length).map(m => m.langue + ' ' + m.slug).slice(0, 12))
  console.log('h1 ≠ titre json :', manifeste.filter(m => m.mesure.h1 !== m.titre).length, ' ex:', manifeste.filter(m => m.mesure.h1 !== m.titre).slice(0, 2).map(m => [m.mesure.h1.slice(0, 60), m.titre.slice(0, 60)]))
  console.log('date ≠ json :', manifeste.filter(m => m.mesure.dateLue !== m.date).length)
  console.log('mots corps : min', Math.min(...manifeste.map(m => m.mesure.motsCorps)), 'médiane', manifeste.map(m => m.mesure.motsCorps).sort((a, b) => a - b)[Math.floor(manifeste.length / 2)], 'max', Math.max(...manifeste.map(m => m.mesure.motsCorps)))
  fs.writeFileSync(path.join(ICI, 'blog', 'sonde.json'), JSON.stringify(manifeste, null, 1))
} else {
  fs.writeFileSync(path.join(ICI, 'blog', 'brut.json'), JSON.stringify(manifeste))
  console.log('brut.json :', manifeste.length, 'articles')
}
