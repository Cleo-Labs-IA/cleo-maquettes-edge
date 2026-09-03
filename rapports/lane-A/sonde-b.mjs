/* Lane A, passe 2 — la sonde des cinq points de l'audit du 03/09 (3, 4, 5, 6, 18)
   plus le contrôle des planchers (13 px desktop, 14 px téléphone, cibles 40 px).
   node rapports/lane-A/sonde-b.mjs [avant|apres]
   → rapports/lane-A/sonde-b-<etat>.json et un résumé sur la sortie standard.
   Rien n'est lu à l'œil : tout vient de getBoundingClientRect / getComputedStyle. */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
import fs from 'fs'

const ETAT = process.argv[2] || 'etat'
const SORTIE = '/Users/naomiehalioua/cleo-maquettes-edge/sortie'
const { url } = await servir(SORTIE)
const nav = await chromium.launch()

const MESURE = () => {
  const cs = e => getComputedStyle(e)
  const r = e => { const b = e.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y + window.scrollY), w: Math.round(b.width * 10) / 10, h: Math.round(b.height * 10) / 10 } }
  const txt = e => (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 46)

  // 3 — le témoignage
  const tem = document.querySelector('.temoin-compact')
  const cit = document.querySelector('.temoin-compact .citation')
  const temoin = cit ? {
    bloc: r(tem), citation: r(cit),
    align: cs(cit).textAlign, taille: cs(cit).fontSize, interligne: cs(cit).lineHeight,
    maxw: cs(cit).maxWidth,
    lignes: Math.round(cit.getBoundingClientRect().height / parseFloat(cs(cit).lineHeight)),
    signes: (cit.textContent || '').length
  } : null

  // 4 — la bande de logos
  const logos = [...document.querySelectorAll('.bande-logos img')].map(i => {
    const b = r(i)
    return { alt: i.alt, w: b.w, h: b.h, x: b.x, y: b.y, aire: Math.round(b.w * b.h), opacite: cs(i).opacity, cellule: r(i.closest('.cellule')) }
  })

  // 5 — les trois libellés d'étape de « Notre méthode »
  const tetes = [...document.querySelectorAll('.acc-methode .pl-tete')].map(t => ({
    texte: txt(t), y: r(t).y, x: r(t).x, h: r(t).h
  }))
  const etages = [...document.querySelectorAll('.acc-methode .pl-etage')].map(e => ({ y: r(e).y, h: r(e).h, w: r(e).w }))
  const pipeline = document.querySelector('.acc-methode .pipeline')
  const pipe = pipeline ? { align: cs(pipeline).alignItems, rect: r(pipeline) } : null

  // 6 — les trois rangées feature
  const agents = [...document.querySelectorAll('.g-agents .agent')].map(a => {
    const t = a.querySelector('.agent-texte'), v = a.querySelector('.agent-visuel'), i = a.querySelector('img')
    return {
      titre: txt(a.querySelector('h3')), inverse: a.classList.contains('agent-inverse'),
      colonnes: cs(a).gridTemplateColumns, rangee: r(a),
      texte: r(t), visuel: r(v), image: i ? { rect: r(i), alt: i.alt, aAlt: i.hasAttribute('alt') } : null
    }
  })

  // 18 — les alt des images de la page
  const images = [...document.querySelectorAll('img')].map(i => ({
    src: (i.getAttribute('src') || '').split('/').pop(), alt: i.alt, aAlt: i.hasAttribute('alt'),
    w: r(i).w, h: r(i).h
  })).filter(i => i.w > 0)

  // planchers
  const visibles = [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 })
  const feuilles = visibles.filter(e => e.children.length === 0 && e.textContent.trim())
  const petit = seuil => feuilles.filter(e => parseFloat(cs(e).fontSize) < seuil).map(e => ({
    t: txt(e), px: parseFloat(cs(e).fontSize), sel: e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : ''),
    dansApp: !!e.closest('.ecran-app'), dansSelecteur: !!e.closest('.nav-langue')
  }))
  const cibles = [...document.querySelectorAll('a[href],button,input,select')].map(e => ({ e, b: e.getBoundingClientRect() }))
    .filter(o => o.b.width > 0 && o.b.height > 0 && (o.b.height < 40 || o.b.width < 40))
    .map(o => ({ t: txt(o.e), w: Math.round(o.b.width), h: Math.round(o.b.height), sel: o.e.tagName.toLowerCase() + (typeof o.e.className === 'string' && o.e.className ? '.' + o.e.className.trim().split(/\s+/)[0] : '') }))

  return {
    hauteur: document.body.scrollHeight,
    debordement: document.documentElement.scrollWidth > window.innerWidth + 1,
    largeurDoc: document.documentElement.scrollWidth,
    h1: (() => { const h = document.querySelector('h1'); return h ? { px: cs(h).fontSize, graisse: cs(h).fontWeight, n: document.querySelectorAll('h1').length } : null })(),
    paraMax: Math.max(...[...document.querySelectorAll('p')].map(p => p.getBoundingClientRect().width)),
    temoin, logos, tetes, etages, pipe, agents, images,
    sous13: petit(13), sous14: petit(14), cibles
  }
}

const res = {}
for (const page of ['01-accueil', '01-accueil-en']) {
  res[page] = {}
  for (const [nom, vp, mobile] of [['desktop', { width: 1440, height: 900 }, false], ['telephone', { width: 390, height: 844 }, true]]) {
    const ctx = await nav.newContext({ viewport: vp, isMobile: mobile, deviceScaleFactor: mobile ? 2 : 1, hasTouch: mobile })
    const p = await ctx.newPage()
    await p.goto(`${url}/${page}.html`, { waitUntil: 'networkidle' })
    await p.evaluate(async () => { const h = document.body.scrollHeight; for (let y = 0; y < h; y += 500) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } window.scrollTo(0, 0) })
    await p.waitForTimeout(700)
    res[page][nom] = await p.evaluate(MESURE)
    await ctx.close()
  }
}
await nav.close()
fs.writeFileSync(`/Users/naomiehalioua/cleo-maquettes-edge/rapports/lane-A/sonde-b-${ETAT}.json`, JSON.stringify(res, null, 1))

for (const page of Object.keys(res)) {
  for (const vue of ['desktop', 'telephone']) {
    const m = res[page][vue]
    console.log(`\n══ ${page} · ${vue} · hauteur ${m.hauteur} · débordement ${m.debordement} · para max ${Math.round(m.paraMax)}`)
    if (m.temoin) console.log(` 3 citation : ${m.temoin.citation.w} px, ${m.temoin.align}, ${m.temoin.taille}, ${m.temoin.lignes} lignes, ${m.temoin.signes} signes`)
    console.log(' 4 logos :', m.logos.map(l => `${l.alt} ${l.w}×${l.h} (aire ${l.aire})`).join(' | '))
    console.log(' 5 têtes :', m.tetes.map(t => `${t.texte} y=${t.y}`).join(' | '), '· écart', m.tetes.length ? Math.max(...m.tetes.map(t => t.y)) - Math.min(...m.tetes.map(t => t.y)) : '-')
    console.log(' 6 agents :', m.agents.map(a => `${a.titre}${a.inverse ? '(inv)' : ''} texte ${a.texte.w}@${a.texte.x} image ${a.visuel.w}@${a.visuel.x} h${a.rangee.h}`).join(' | '))
    console.log(` 18 img sans alt : ${m.images.filter(i => !i.alt).length} / ${m.images.length}`, m.images.filter(i => !i.alt).map(i => i.src).join(','))
    const s13 = m.sous13.filter(t => !t.dansApp && !t.dansSelecteur), s14 = m.sous14.filter(t => !t.dansApp && !t.dansSelecteur)
    console.log(` planchers : <13 hors app/sélecteur ${s13.length} · <14 hors app/sélecteur ${s14.length} · cibles<40 ${m.cibles.length}`)
    if (vue === 'desktop' && s13.length) console.log('   <13 :', s13.slice(0, 12).map(t => `${t.px}px ${t.sel}`).join(' | '))
    if (vue === 'telephone' && s14.length) console.log('   <14 :', s14.slice(0, 12).map(t => `${t.px}px ${t.sel}`).join(' | '))
    if (m.cibles.length) console.log('   cibles :', m.cibles.slice(0, 10).map(c => `${c.w}×${c.h} ${c.sel}`).join(' | '))
  }
}
process.exit(0)
