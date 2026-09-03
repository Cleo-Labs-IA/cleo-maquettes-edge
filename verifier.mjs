/* ════════════════════════════════════════════════════════════════
   VÉRIFICATION COMPLÈTE.
   Chaque contrôle a un oracle EXTÉRIEUR au code vérifié :
     · les liens sont confrontés aux fichiers réellement présents
     · la citation, au fichier source de cleo-landing
     · les chiffres, aux dépôts et à CANONICAL-FACTS.md
     · le contraste, au PIXEL, pas à l'arbre DOM
   ════════════════════════════════════════════════════════════════ */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import sharp from '/Users/naomiehalioua/cleo-landing/node_modules/sharp/lib/index.js'
import fs from 'fs'
import path from 'path'

const SORTIE = '/Users/naomiehalioua/cleo-maquettes-edge/sortie'
const pages = fs.readdirSync(SORTIE).filter(f => f.endsWith('.html')).sort()
const soucis = []
const note = (page, quoi, detail) => soucis.push({ page, quoi, detail })

const b = await chromium.launch()

// ── 1. LIENS INTERNES : oracle = les fichiers présents sur le disque
const existants = new Set(pages)
// L'oracle des chemins propres vient de la table, pas du disque : c'est elle
// que Vercel applique, donc c'est elle qui fait foi.
const CHEMINS = JSON.parse(fs.readFileSync(path.join(SORTIE, '..', 'commun/chemins.json'), 'utf8'))
const cheminsConnus = new Set(Object.values(CHEMINS.pages).map(c => c.chemin))
for (const f of pages) {
  const t = fs.readFileSync(path.join(SORTIE, f), 'utf8')
  // Deux formes de lien interne coexistent : le fichier plat « 02-entreprise.html »
  // et le chemin propre « /fr/company ». L'ancienne regexp ne voyait que la
  // premiere, donc un chemin propre casse serait passe SANS AUCUN controle.
  for (const m of t.matchAll(/href="(\/[^"#]*|[^"#\/][^"]*\.html)(#[^"]*)?"/g)) {
    const cible = m[1]
    // Une URL ABSOLUE n'est pas un lien interne : le canonical et les alternates
    // pointent vers le domaine de production, c'est leur rôle. Vécu le 27/08 :
    // câbler la couche de tête a fait crier ce contrôle 31 fois sur des balises
    // parfaitement correctes.
    if (/^(https?:)?\/\//.test(cible)) continue
    if (cible.startsWith('/')) {
      if (!cheminsConnus.has(cible)) note(f, 'chemin propre inconnu', cible)
    } else if (!existants.has(cible)) note(f, 'lien mort', cible)
  }
}

// ── 2. CITATION : oracle = le fichier source de cleo-landing.
//    Il porte DEUX versions, fr: et en:. Le contrôle ne lisait que la française
//    et condamnait donc toute page anglaise portant la citation authentique.
//    Vécu le 27/08 sur 01-accueil-en.html. On lit la langue de la page et on
//    exige le verbatim de CETTE langue : une citation de cliente ne se
//    retraduit pas à la main, et une page anglaise n'a pas à porter le français.
const src = fs.readFileSync('/Users/naomiehalioua/cleo-maquettes-edge/depot-src/DecathlonQuote.tsx', 'utf8')
const deshexe = v => v.replace(/\\u([0-9a-fA-F]{4})/g, (_, c) => String.fromCharCode(parseInt(c, 16)))
const VERBATIM = {}
for (const langue of ['fr', 'en']) {
  const m = src.match(new RegExp(langue + "\\s*:\\s*'([^']+)'"))
  if (m) VERBATIM[langue] = deshexe(m[1]).slice(2, 80)
}
// La maquette peut porter la version INTÉGRALE de la citation, dictée par
// Naomie le 01/09 et rangée dans commun/citation-decathlon.json, là où le site
// n'en sert qu'un extrait condensé. Les deux sont des sources légitimes : une
// page est verbatim si elle correspond à L'UNE des deux, jamais si elle
// correspond à aucune. Ce qu'on interdit, c'est la retranscription à la main.
let INTEGRALE = null
try {
  const j = JSON.parse(fs.readFileSync(path.join(SORTIE, '..', 'commun/citation-decathlon.json'), 'utf8'))
  INTEGRALE = j.fr.replace(/\s+/g, ' ').trim().slice(0, 78)
} catch (e) { note('(source)', 'citation intégrale illisible', String(e.message).slice(0, 70)) }
if (!VERBATIM.fr) note('(source)', 'citation introuvable', 'pas de clé fr: dans DecathlonQuote.tsx')
for (const f of pages) {
  const t = fs.readFileSync(path.join(SORTIE, f), 'utf8')
  if (!/Philippine Tamic/.test(t)) continue
  const langue = (t.match(/<html lang="([a-z]{2})"/) || [, 'fr'])[1]
  const attendu = VERBATIM[langue]
  if (!attendu) { note(f, 'citation sans source', `pas de clé ${langue}: dans DecathlonQuote.tsx`); continue }
  const plat = t.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  const okExtrait = t.includes(attendu) || plat.includes(attendu)
  const okIntegrale = INTEGRALE && plat.includes(INTEGRALE)
  if (!okExtrait && !okIntegrale)
    note(f, 'citation non verbatim', `ne correspond ni à la clé ${langue}: de DecathlonQuote.tsx ni à commun/citation-decathlon.json`)
}

// ── 3. CHIFFRES : oracle = CANONICAL-FACTS.md et le comptage des dépôts
const canon = fs.readFileSync('/Users/naomiehalioua/cleo-maquettes-edge/depot-src/CANONICAL-FACTS.md', 'utf8')
const attendus = { '106': /106 pays/, '25 000': /25\s?000/, '19 000': /19\s?000/, '3 700': /3\s?700/ }
for (const [val, re] of Object.entries(attendus)) {
  if (!re.test(canon)) note('(canon)', 'chiffre absent du canon', val)
}
const horsCanon = [/\b256 000\b/, /\b50 101\b/, /\b177 juridictions\b/, /\b27 000\b/, /\b163 pays\b/]
for (const f of pages) {
  const t = fs.readFileSync(path.join(SORTIE, f), 'utf8')
  for (const re of horsCanon) { const m = t.match(re); if (m) note(f, 'chiffre hors canon', m[0]) }
}

// ── 4. STRUCTURE : équilibre des balises
for (const f of pages) {
  const t = fs.readFileSync(path.join(SORTIE, f), 'utf8')
  for (const bal of ['div','section','ul','li','p','a','table','blockquote','aside','nav','footer','h1','h2','h3']) {
    const o = (t.match(new RegExp(`<${bal}\\b`, 'g')) || []).length
    const c = (t.match(new RegExp(`</${bal}>`, 'g')) || []).length
    if (o !== c) note(f, 'balises déséquilibrées', `${bal} ${o}/${c}`)
  }
}

// ── 5. RENDU, à quatre largeurs
for (const w of [390, 768, 1280, 1920]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage()
  const errs = []
  p.on('pageerror', e => errs.push(String(e).slice(0, 60)))
  for (const f of pages) {
    errs.length = 0
    await p.goto('file://' + path.join(SORTIE, f)); await p.waitForTimeout(140)
    const d = await p.evaluate(() => ({
      deborde: document.documentElement.scrollWidth > window.innerWidth + 1,
      largeur: document.documentElement.scrollWidth,
      police: getComputedStyle(document.body).fontFamily.split(',')[0].replace(/["']/g, ''),
      mono: [...document.querySelectorAll('*')].filter(e => /mono/i.test(getComputedStyle(e).fontFamily)).length,
      imgKo: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).length,
      emoji: (document.body.innerText.match(/[\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/gu) || []).length,
      navs: [...document.body.children].filter(e => e.tagName === 'NAV').length,
      vides: [...document.querySelectorAll('h1,h2,h3')].filter(e => !e.textContent.trim()).length,
    }))
    if (d.deborde) note(f, `déborde à ${w}px`, d.largeur + 'px')
    if (w === 1280) {
      if (d.police !== 'Satoshi') note(f, 'police', d.police)
      if (d.mono) note(f, 'monospace', d.mono)
      if (d.imgKo) note(f, 'image cassée', d.imgKo)
      if (d.emoji) note(f, 'emoji', d.emoji)
      if (d.navs > 1) note(f, 'barres en double', d.navs)
      if (d.vides) note(f, 'titre vide', d.vides)
      if (errs.length) note(f, 'erreur JS', errs[0])
    }
  }
  await p.close()
}

// ── 6. MOUVEMENT : après défilement, rien ne doit rester invisible
const p3 = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage()
for (const f of pages) {
  await p3.goto('file://' + path.join(SORTIE, f)); await p3.waitForTimeout(200)
  await p3.evaluate(async () => { const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 480) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 45)) } })
  await p3.waitForTimeout(900)
  const bloques = await p3.evaluate(() =>
    [...document.querySelectorAll('[data-anim],[data-anim-groupe]')].filter(e => getComputedStyle(e).opacity === '0').length)
  if (bloques) note(f, 'bloc resté invisible', bloques)
}

// ── 7. CONTRASTE des titres posés sur photo, mesuré AU PIXEL
for (const f of pages) {
  await p3.goto('file://' + path.join(SORTIE, f)); await p3.waitForTimeout(200)
  await p3.evaluate(async () => { const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 480) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)) } })
  await p3.waitForTimeout(600)
  for (const sel of ['.scene-large .dessus h3', '.scene-large .dessus .t-h1']) {
    const els = await p3.$$(sel)
    for (const el of els) {
      await el.scrollIntoViewIfNeeded(); await p3.waitForTimeout(200)
      const box = await el.boundingBox(); if (!box || box.width < 40) continue
      const png = await p3.screenshot({ clip: { x: box.x, y: box.y, width: Math.min(600, box.width), height: Math.min(80, box.height) } })
      const st = await sharp(png).stats()
      if (st.channels[0].mean > 110) note(f, 'titre sur photo trop clair', Math.round(st.channels[0].mean) + '/255')
    }
  }
}
// ── 8. TEXTE INVISIBLE : on rend la page et on lit les PIXELS des glyphes.
//    Un texte de la couleur de son fond ne fait aucun contraste, donc
//    l'écart-type des pixels s'effondre.
//    MÉTHODE, reprise le 26/08 après trois défauts vécus le même jour :
//     · le sélecteur ne vise PAS des classes — un <div> sans classe échappait
//       au contrôle, et c'est là qu'était le blanc sur blanc de 01-accueil-noir ;
//     · on mesure la boîte des GLYPHES (Range sur le nœud texte), pas celle de
//       l'élément — photographier le milieu d'une boîte large donnait 2 faux
//       positifs sur 3 (07-chat, 01-accueil-noir) ;
//     · UNE SEULE capture pleine page, découpée localement par sharp. Une
//       capture par élément mettait le contrôle au-delà de 10 minutes et
//       rouvrait la porte aux re-mises en page entre la mesure et la photo.
for (const f of pages) {
  await p3.goto('file://' + path.join(SORTIE, f)); await p3.waitForTimeout(200)
  // Même cadence que capturer.mjs : 55 ms par palier puis 1,2 s. Vécu le 26/08 :
  // à 40 ms / 700 ms, le bloc .faq de 07-chat était photographié PENDANT son
  // fondu de 0,5 s et rendait un écart de 0,0 — la page était pourtant saine.
  await p3.evaluate(async () => { const h = document.body.scrollHeight
    for (let y = 0; y < h; y += 480) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 55)) } })
  await p3.evaluate(() => window.scrollTo(0, 0))
  await p3.waitForTimeout(1200)

  // Tous les encadrés de glyphes en coordonnées DOCUMENT, en un seul aller-retour.
  const cibles = await p3.evaluate(() => {
    const SEL = 'p, blockquote, li, span, div, h1, h2, h3, h4, h5, h6, td, th, dd, dt, figcaption, a, b, strong, em, small, label'
    const out = []
    for (const e of document.querySelectorAll(SEL)) {
      if (out.length >= 200) break
      const n = [...e.childNodes].find(c => c.nodeType === 3 && c.textContent.trim().length > 12)
      if (!n) continue
      const cs = getComputedStyle(e)
      if (cs.visibility === 'hidden' || cs.display === 'none') continue
      // Une opacité non réglée n'est pas de l'encre invisible, c'est une animation
      // en cours : c'est le contrôle 6 qui en répond. Un élément fixe/collant ne
      // se trouve pas où la capture pleine page le peint : on l'écarte aussi.
      let saute = false
      for (let a = e; a && a !== document.body; a = a.parentElement) {
        const acs = getComputedStyle(a)
        if (parseFloat(acs.opacity) < 0.99) { saute = true; break }
        if (acs.position === 'fixed' || acs.position === 'sticky') { saute = true; break }
      }
      if (saute) continue
      // Une réponse de FAQ dans un <details> FERMÉ n'est pas peinte, et c'est
      // voulu. Elle garde pourtant une boîte de mise en page : sans ce filtre
      // elle rend un écart de 0,0 et passe pour du texte invisible.
      // Vécu le 26/08 : 4 des 4 derniers signalements étaient de ce type.
      const det = e.closest('details')
      if (det && !det.open) continue
      const r = document.createRange(); r.selectNodeContents(n)
      const b = r.getBoundingClientRect()
      if (b.width < 40 || b.height < 8) continue
      out.push({ x: Math.round(b.x + window.scrollX), y: Math.round(b.y + window.scrollY),
        w: Math.round(Math.min(520, b.width)), h: Math.round(Math.min(40, b.height)),
        txt: e.textContent.trim().slice(0, 40) })
    }
    return out
  })

  // On photographie PAR BANDES de la hauteur d'une fenêtre : un défilement,
  // une capture, puis toutes les découpes de la bande. Vécu le 26/08 : une
  // capture fullPage remet la page en page (la fenêtre est étirée à la hauteur
  // du document) et les encadrés relevés avant ne tombent plus en face —
  // 4 régions vides rendaient un écart de 0,0 sur des textes parfaitement
  // lisibles. Une capture par élément, elle, mettait le contrôle à 10 minutes.
  const vp = p3.viewportSize()
  cibles.sort((a, b) => a.y - b.y)
  let i = 0
  while (i < cibles.length) {
    // 200 px de marge haute : la barre de nav est position:sticky top:0 et
    // PEINT PAR-DESSUS le haut de la fenêtre. Vécu le 26/08 : à 40 px de marge,
    // 85 régions tombaient sous la barre et rendaient un écart quasi nul sur
    // des textes parfaitement lisibles.
    const bandeY = Math.max(0, cibles[i].y - 200)
    await p3.evaluate(y => window.scrollTo(0, y), bandeY)
    await p3.waitForTimeout(260)
    const reel = await p3.evaluate(() => window.scrollY)
    const png = await p3.screenshot()
    const { data, info } = await sharp(png).greyscale().raw().toBuffer({ resolveWithObject: true })
    const ecartType = (x, y, w, h) => {
      let n = 0, somme = 0, carres = 0
      for (let j = y; j < y + h; j++) { const ligne = j * info.width
        for (let k = x; k < x + w; k++) { const v = data[ligne + k]; n++; somme += v; carres += v * v } }
      if (!n) return 255
      const moy = somme / n
      return Math.sqrt(Math.max(0, carres / n - moy * moy))
    }
    while (i < cibles.length) {
      const c = cibles[i]
      const y = c.y - reel
      if (y + c.h > vp.height) break            // déborde la bande : bande suivante
      if (y < 140) { i++; continue }            // zone couverte par la barre collante
      if (y >= 0 && c.x >= 0 && c.x + c.w <= info.width && y + c.h <= info.height) {
        const e = ecartType(c.x, y, c.w, c.h)
        if (e < 6) note(f, 'texte invisible', `« ${c.txt} » écart ${e.toFixed(1)}`)
      }
      i++
    }
  }
}

// ── TÉMOIN NÉGATIF du contrôle « texte invisible » : une page fabriquée où
//    l'on SAIT qu'un texte est blanc sur blanc et un autre parfaitement noir.
//    Sans ce témoin, un « 0 souci » ne prouve rien : il peut aussi vouloir dire
//    que le contrôle ne sait plus viser les glyphes.
const tp = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
await tp.setContent(`<body style="margin:0;background:#fff;font:16px sans-serif">
  <div id="ko" style="background:#fff;color:#fff;padding:20px;width:600px">Ce texte est blanc sur blanc, il doit etre detecte</div>
  <div id="ok" style="background:#fff;color:#000;padding:20px;width:600px">Ce texte est noir sur blanc, il ne doit PAS etre detecte</div>
  <div id="large" style="background:#fff;color:#000;padding:20px;width:900px;height:120px">Texte court en haut d une boite large et haute</div></body>`)
await tp.waitForTimeout(120)
const temoins = []
for (const id of ['ko', 'ok', 'large']) {
  const el = await tp.$('#' + id)
  const g = await el.evaluate(e => {
    const n = [...e.childNodes].find(c => c.nodeType === 3 && c.textContent.trim().length > 12)
    const r = document.createRange(); r.selectNodeContents(n)
    const b = r.getBoundingClientRect()
    return { x: b.x, y: b.y, width: b.width, height: b.height }
  })
  const png = await tp.screenshot({ clip: { x: g.x, y: g.y, width: Math.min(520, g.width), height: Math.min(40, g.height) } })
  const st = await sharp(png).greyscale().stats()
  temoins.push({ id, ecart: st.channels[0].stdev, detecte: st.channels[0].stdev < 6 })
}
const tKo = temoins.find(t => t.id === 'ko'), tOk = temoins.find(t => t.id === 'ok'), tLarge = temoins.find(t => t.id === 'large')
const temoinBon = tKo.detecte && !tOk.detecte && !tLarge.detecte
console.log(`témoin négatif : le contrôle de texte invisible ${temoinBon ? 'DÉTECTE le blanc sur blanc et épargne les lisibles' : '⚠ EST CASSÉ'}` +
  `  (blanc/blanc ${tKo.ecart.toFixed(1)} · noir/blanc ${tOk.ecart.toFixed(1)} · boîte large ${tLarge.ecart.toFixed(1)})`)
if (!temoinBon) note('(témoin)', 'contrôle texte invisible cassé', JSON.stringify(temoins))

await b.close()

// ── TÉMOIN NÉGATIF : le contrôle doit savoir échouer
const temoin = '<div><section><p>test</section></div>'
const o = (temoin.match(/<p\b/g) || []).length, c = (temoin.match(/<\/p>/g) || []).length
console.log('témoin négatif : le contrôle de balises ' + (o !== c ? 'DÉTECTE bien un déséquilibre' : '⚠ NE DÉTECTE RIEN'))

console.log(`\n${pages.length} pages vérifiées, ${soucis.length} souci(s)\n`)
if (soucis.length) {
  const parType = {}
  for (const s of soucis) (parType[s.quoi] ||= []).push(`${s.page} (${s.detail})`)
  for (const [t, l] of Object.entries(parType)) {
    console.log(`  ${t} — ${l.length}`)
    l.slice(0, 6).forEach(x => console.log(`      ${x}`))
  }
} else console.log('  rien à signaler')
