/* Lane E — banc du CADRE COMMUN : le menu sur téléphone (ouvert, fermé,
   défilement interne), les trois méga-menus au survol, le lien d'évitement,
   le focus au clavier, et les hauteurs mesurées du pied.
   Rien n'est affirmé ici qui ne sorte d'une mesure du navigateur.

   node rapports/lane-E/cadre.mjs [page]     (défaut : 33-fabricants) */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
import fs from 'fs'

const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const OUT = ICI + '/captures/lane'
fs.mkdirSync(OUT, { recursive: true })
const PAGE = process.argv[2] || '33-fabricants'
const { url } = await servir(ICI + '/sortie')
const nav = await chromium.launch()

/* Les liens de la maquette sont réécrits en chemins propres (/fr/company…),
   que Vercel réécrit vers les fichiers plats. Le serveur local ne fait pas ça :
   on rejoue ICI la table de vercel.json, pour que la navigation testée soit
   celle de la production et pas une 404 d'atelier. */
const REWRITES = new Map(JSON.parse(fs.readFileSync(ICI + '/sortie/vercel.json', 'utf8'))
  .rewrites.map(r => [r.source, r.destination]))
async function routerCommeVercel(page) {
  await page.route('**/*', async route => {
    const u = new URL(route.request().url())
    const cible = REWRITES.get(u.pathname)
    if (!cible) return route.continue()
    const f = ICI + '/sortie' + cible
    if (!fs.existsSync(f)) return route.continue()
    route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: fs.readFileSync(f, 'utf8') })
  })
}
const ok = [], ko = []
const dit = (bon, texte) => { (bon ? ok : ko).push(texte); console.log(`${bon ? '  OK ' : '  KO '} ${texte}`) }

/* ══ 1. LE MENU SUR TÉLÉPHONE, 390 × 844 ══ */
console.log(`\n=== MENU MOBILE (390x844) sur ${PAGE}.html ===`)
const mctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const m = await mctx.newPage()
await routerCommeVercel(m)
await m.goto(`${url}/${PAGE}.html`, { waitUntil: 'load' })
await m.waitForTimeout(400)

const ferme = await m.evaluate(() => ({
  panneau: document.getElementById('menu-mobile')?.hidden,
  aria: document.querySelector('.nav-burger')?.getAttribute('aria-expanded'),
  classe: document.documentElement.classList.contains('menu-ouvert'),
  burgerVisible: (() => { const b = document.querySelector('.nav-burger'); if (!b) return null; const r = b.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}` })(),
}))
dit(ferme.panneau === true, `au chargement le panneau est masqué (hidden=${ferme.panneau})`)
dit(ferme.aria === 'false', `aria-expanded="false" au repos (lu : ${ferme.aria})`)
dit(ferme.burgerVisible === '44x44', `le bouton de menu mesure ${ferme.burgerVisible} (cible ≥ 44)`)

await m.click('.nav-burger')
await m.waitForTimeout(300)
const ouvert = await m.evaluate(() => {
  const p = document.getElementById('menu-mobile')
  const r = p.getBoundingClientRect()
  const groupes = [...p.querySelectorAll('.mm-groupe')].map(g => ({
    titre: (g.querySelector('.mm-titre') || g.querySelector('a'))?.textContent.trim(),
    liens: [...g.querySelectorAll('a')].map(a => ({ t: a.textContent.trim(), h: a.getAttribute('href'), hh: Math.round(a.getBoundingClientRect().height) })),
  }))
  const actions = [...p.querySelectorAll('.mm-actions a')].map(a => ({ t: a.textContent.trim(), h: a.getAttribute('href'), c: a.className, hh: Math.round(a.getBoundingClientRect().height) }))
  return {
    hidden: p.hidden, aria: document.querySelector('.nav-burger').getAttribute('aria-expanded'),
    classe: document.documentElement.classList.contains('menu-ouvert'),
    overflowHtml: getComputedStyle(document.documentElement).overflow,
    boite: { t: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width) },
    defileInterne: p.scrollHeight > p.clientHeight, scrollH: p.scrollHeight, clientH: p.clientHeight,
    fond: getComputedStyle(p).backgroundColor,
    navBas: Math.round(document.querySelector('.nav').getBoundingClientRect().bottom),
    groupes, actions,
    petits: [...p.querySelectorAll('a,.mm-titre')].filter(e => parseFloat(getComputedStyle(e).fontSize) < 14).length,
    cibles: [...p.querySelectorAll('a')].filter(a => a.getBoundingClientRect().height < 44).map(a => a.textContent.trim()),
  }
})
dit(ouvert.hidden === false && ouvert.aria === 'true', `au clic le panneau s'ouvre (hidden=${ouvert.hidden}, aria=${ouvert.aria})`)
dit(ouvert.classe === true && ouvert.overflowHtml === 'hidden', `la page ne défile plus derrière (html.menu-ouvert=${ouvert.classe}, overflow=${ouvert.overflowHtml})`)
dit(ouvert.boite.t === ouvert.navBas, `le panneau commence au bas de la barre (haut ${ouvert.boite.t} px, barre à ${ouvert.navBas} px)`)
dit(ouvert.fond !== 'rgba(0, 0, 0, 0)', `le panneau est opaque (fond ${ouvert.fond})`)
console.log(`  · panneau ${ouvert.boite.w}x${ouvert.boite.h}, contenu ${ouvert.scrollH} px → défilement interne : ${ouvert.defileInterne}`)
for (const g of ouvert.groupes) console.log(`  · groupe « ${g.titre} » : ${g.liens.length} lien(s) — ${g.liens.map(l => l.t).join(', ')}`)
console.log(`  · actions : ${ouvert.actions.map(a => a.t + ' → ' + a.h).join(' | ')}`)

const parTitre = t => ouvert.groupes.find(g => g.titre === t)
const produit = parTitre('Produit'), textes = parTitre('Textes'), res = parTitre('Ressources'), ent = parTitre('Entreprise')
dit(!!produit && produit.liens.length === 4, `groupe Produit : ${produit ? produit.liens.length : 0} liens (attendu 4)`)
dit(!!textes && textes.liens.length >= 8, `groupe Textes : ${textes ? textes.liens.length : 0} liens`)
dit(!!res && res.liens.length === 4, `groupe Ressources : ${res ? res.liens.length : 0} liens (attendu 4)`)
dit(!!ent, `groupe Entreprise présent (lien direct : ${ent ? ent.liens.map(l => l.h).join(',') : '—'})`)
dit(ouvert.actions.some(a => /insight\.cleolabs\.co/.test(a.h)), `Connexion mène à insight.cleolabs.co`)
dit(ouvert.actions.some(a => a.c.includes('btn') && /meetings\.hubspot/.test(a.h)), `le bouton de démo est dans le panneau`)
dit(ouvert.petits === 0, `aucun texte sous 14 px dans le panneau (${ouvert.petits})`)
dit(ouvert.cibles.length === 0, `aucune cible sous 44 px dans le panneau (${ouvert.cibles.length}${ouvert.cibles.length ? ' : ' + ouvert.cibles.join(', ') : ''})`)
const morts = ouvert.groupes.flatMap(g => g.liens).concat(ouvert.actions).filter(l => !l.h || l.h === '#')
dit(morts.length === 0, `aucun href="#" dans le panneau (${morts.length})`)

await m.screenshot({ path: `${OUT}/E-menu-ouvert.png` })
await m.evaluate(() => { const p = document.getElementById('menu-mobile'); p.scrollTop = p.scrollHeight })
await m.waitForTimeout(250)
await m.screenshot({ path: `${OUT}/E-menu-bas.png` })

/* la page derrière ne bouge pas */
const avantScroll = await m.evaluate(() => window.scrollY)
await m.mouse.wheel(0, 600); await m.waitForTimeout(250)
const apresScroll = await m.evaluate(() => window.scrollY)
dit(avantScroll === apresScroll, `la page derrière ne défile pas (scrollY ${avantScroll} → ${apresScroll})`)

/* Échap ferme */
await m.evaluate(() => { const p = document.getElementById('menu-mobile'); p.scrollTop = 0 })
await m.keyboard.press('Escape'); await m.waitForTimeout(250)
const apresEchap = await m.evaluate(() => ({ h: document.getElementById('menu-mobile').hidden, a: document.querySelector('.nav-burger').getAttribute('aria-expanded'), c: document.documentElement.classList.contains('menu-ouvert') }))
dit(apresEchap.h === true && apresEchap.a === 'false' && apresEchap.c === false, `Échap referme et rend le défilement (hidden=${apresEchap.h}, aria=${apresEchap.a}, classe=${apresEchap.c})`)

/* un clic sur un lien ferme ET navigue */
await m.click('.nav-burger'); await m.waitForTimeout(250)
const cible = await m.evaluate(() => document.querySelector('#menu-mobile .mm-groupe a').getAttribute('href'))
await Promise.all([m.waitForNavigation({ waitUntil: 'load' }).catch(() => {}), m.click('#menu-mobile .mm-groupe a')])
await m.waitForTimeout(400)
const apresClic = await m.evaluate(() => ({ url: location.pathname, h: document.getElementById('menu-mobile').hidden, c: document.documentElement.classList.contains('menu-ouvert') }))
dit(apresClic.url.endsWith(cible) && apresClic.h === true && apresClic.c === false, `un clic sur « ${cible} » navigue et le panneau est refermé (url ${apresClic.url}, hidden ${apresClic.h})`)

/* le bouton de menu au clavier */
await m.goto(`${url}/${PAGE}.html`, { waitUntil: 'load' }); await m.waitForTimeout(300)
const clavier = await m.evaluate(() => {
  const b = document.querySelector('.nav-burger'); b.focus()
  const s = getComputedStyle(b)
  return { actif: document.activeElement === b, outline: s.outlineWidth + ' ' + s.outlineStyle + ' ' + s.outlineColor }
})
dit(clavier.actif, `le bouton de menu prend le focus au clavier`)

/* le pied sur téléphone */
const piedM = await m.evaluate(() => {
  const p = document.querySelector('.pied'), s = document.querySelector('.signature-cleo')
  const c = getComputedStyle(document.querySelector('.pied-colonnes'))
  const bas = document.querySelector('.pied-bas')
  return { h: Math.round(p.getBoundingClientRect().height), sign: Math.round(s.getBoundingClientRect().height),
    colonnes: c.gridTemplateColumns, nbCol: c.gridTemplateColumns.split(' ').length,
    basDir: getComputedStyle(bas).flexDirection, basFs: getComputedStyle(bas).fontSize,
    petits: [...p.querySelectorAll('a,span,div,h4')].filter(e => e.children.length === 0 && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 14).map(e => e.textContent.trim().slice(0, 28)),
    cibles: [...p.querySelectorAll('a')].filter(a => { const r = a.getBoundingClientRect(); return r.width > 0 && (r.height < 40 || r.width < 40) }).map(a => `${a.textContent.trim().slice(0, 22)} ${Math.round(a.getBoundingClientRect().width)}x${Math.round(a.getBoundingClientRect().height)}`) }
})
console.log(`  · PIED TÉLÉPHONE : ${piedM.h} px (+ signature ${piedM.sign} px), colonnes ${piedM.nbCol}, bas en ${piedM.basDir} à ${piedM.basFs}`)
dit(piedM.petits.length === 0, `pied téléphone, textes sous 14 px : ${piedM.petits.length}${piedM.petits.length ? ' — ' + piedM.petits.join(' | ') : ''}`)
dit(piedM.cibles.length === 0, `pied téléphone, cibles sous 40 px : ${piedM.cibles.length}${piedM.cibles.length ? ' — ' + piedM.cibles.join(' | ') : ''}`)
await mctx.close()

/* ══ 2. LES MÉGA-MENUS, 1440 ══ */
console.log(`\n=== MÉGA-MENUS (1440x900) ===`)
const dctx = await nav.newContext({ viewport: { width: 1440, height: 900 } })
const d = await dctx.newPage()
await routerCommeVercel(d)
await d.goto(`${url}/${PAGE}.html`, { waitUntil: 'load' }); await d.waitForTimeout(400)

const barre = await d.evaluate(() => {
  const n = document.querySelector('.nav'), s = getComputedStyle(n)
  const decl = [...document.querySelectorAll('.nav-declencheur')].map(e => ({ t: e.textContent.trim().replace(/\s+/g, ' '), fs: getComputedStyle(e).fontSize, tag: e.tagName }))
  const burger = getComputedStyle(document.querySelector('.nav-burger')).display
  const boutons = [...n.querySelectorAll('.btn')].filter(b => b.getBoundingClientRect().height > 0).length
  return { h: Math.round(n.getBoundingClientRect().height), fond: s.backgroundColor, flou: s.backdropFilter,
    position: s.position, decl, burger, boutons,
    logo: (() => { const r = document.querySelector('.nav-logo').getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}` })() }
})
console.log(`  · barre ${barre.h} px, ${barre.position}, fond ${barre.fond}, flou ${barre.flou}`)
dit(barre.h <= 62, `la barre reste fine : ${barre.h} px`)
dit(barre.decl.every(x => x.fs === '14px'), `libellés de barre à 14 px (${barre.decl.map(x => x.t + ':' + x.fs).join(', ')})`)
dit(barre.burger === 'none', `le bouton de menu est caché sur desktop (${barre.burger})`)
dit(barre.boutons === 1, `un seul bouton d'action dans la barre (${barre.boutons})`)

const attendus = { 'Produit': 4, 'Textes': 17, 'Ressources': 4 }
for (const [nom, n] of Object.entries(attendus)) {
  const idx = barre.decl.findIndex(x => x.t.startsWith(nom))
  const sel = `.nav-liens .nav-item:nth-child(${idx + 1})`
  const avant = await d.evaluate(s => { const el = document.querySelector(s + ' .mega'); return el ? { op: getComputedStyle(el).opacity, vis: getComputedStyle(el).visibility } : null }, sel)
  await d.hover(sel + ' .nav-declencheur'); await d.waitForTimeout(320)
  const apres = await d.evaluate(s => {
    const el = document.querySelector(s + ' .mega'); const r = el.getBoundingClientRect()
    const liens = [...el.querySelectorAll('a')].map(a => ({ t: a.textContent.replace(/\s+/g, ' ').trim(), h: a.getAttribute('href') }))
    return { op: getComputedStyle(el).opacity, vis: getComputedStyle(el).visibility,
      boite: { t: Math.round(r.top), l: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) },
      corps: Math.round(document.body.scrollHeight), liens,
      morts: liens.filter(l => !l.h || l.h === '#').length }
  }, sel)
  dit(avant.vis === 'hidden' && apres.vis === 'visible' && apres.op === '1', `« ${nom} » : fermé au repos, ouvert au survol (${avant.vis}/${avant.op} → ${apres.vis}/${apres.op})`)
  dit(apres.boite.t >= barre.h - 2 && apres.boite.t <= barre.h + 2, `« ${nom} » : le panneau s'accroche sous la barre (haut ${apres.boite.t} px)`)
  dit(apres.morts === 0, `« ${nom} » : ${apres.liens.length} liens, ${apres.morts} href="#"`)
  console.log(`  · « ${nom} » panneau ${apres.boite.w}x${apres.boite.h} à ${apres.boite.l},${apres.boite.t}`)
  if (nom === 'Textes') {
    /* les href sont réécrits en chemins propres : on remonte au fichier. */
    const fichier = h => (REWRITES.get(h.split('#')[0]) || h).replace(/^\//, '')
    const eu = apres.liens.slice(0, 9), na = apres.liens.slice(9)
    const ppwr = eu.find(l => l.t.startsWith('PPWR'))
    dit(ppwr && fichier(ppwr.h) === '09-texte.html', `PPWR → ${ppwr ? ppwr.h : '—'} = ${ppwr ? fichier(ppwr.h) : '—'}`)
    const autres = eu.filter(l => !l.t.startsWith('PPWR'))
    dit(autres.every(l => fichier(l.h) === '05-marche.html'), `les 8 autres textes européens → 05-marche.html (${[...new Set(autres.map(l => fichier(l.h)))].join(', ')})`)
    dit(na.every(l => fichier(l.h) === '26-legal-data.html'), `les 8 textes nord-américains → 26-legal-data.html (${[...new Set(na.map(l => fichier(l.h)))].join(', ')})`)
  }
  await d.screenshot({ path: `${OUT}/E-mega-${nom.toLowerCase()}.png`, clip: { x: 0, y: 0, width: 1440, height: Math.min(900, apres.boite.t + apres.boite.h + 30) } })
  await d.mouse.move(720, 700); await d.waitForTimeout(250)
}
/* pas de saut de page à l'ouverture */
const saut = await d.evaluate(() => document.body.scrollHeight)
await d.hover('.nav-liens .nav-item:nth-child(1) .nav-declencheur'); await d.waitForTimeout(300)
const saut2 = await d.evaluate(() => document.body.scrollHeight)
dit(saut === saut2, `l'ouverture d'un méga-menu ne pousse pas la page (${saut} → ${saut2} px)`)
await d.mouse.move(720, 700); await d.waitForTimeout(200)

/* Connexion */
const cnx = await d.evaluate(() => { const a = document.querySelector('.nav-fin .lien-secondaire'); return a ? { t: a.textContent.trim(), h: a.getAttribute('href') } : null })
dit(cnx && cnx.h === 'https://insight.cleolabs.co', `Connexion → ${cnx ? cnx.h : '—'}`)

/* ══ 3. LE LIEN D'ÉVITEMENT ET LE FOCUS ══ */
console.log(`\n=== CLAVIER ===`)
await d.evaluate(() => window.scrollTo(0, 0))
await d.keyboard.press('Tab'); await d.waitForTimeout(220)
const evit = await d.evaluate(() => {
  const a = document.activeElement, r = a.getBoundingClientRect(), s = getComputedStyle(a)
  return { classe: a.className, href: a.getAttribute('href'), texte: a.textContent.trim(),
    visible: r.left >= 0 && r.left < window.innerWidth && r.width > 0,
    boite: `${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}`,
    fond: s.backgroundColor, encre: s.color }
})
dit(evit.classe === 'lien-evitement', `le premier Tab atteint le lien d'évitement (${evit.classe})`)
dit(evit.visible, `le lien d'évitement devient visible (${evit.boite})`)
dit(evit.href === '#contenu' && !!(await d.$('#contenu')), `il mène à #contenu, qui existe`)
await d.screenshot({ path: `${OUT}/E-evitement.png`, clip: { x: 0, y: 0, width: 720, height: 120 } })

const focus = await d.evaluate(() => {
  const b = document.querySelector('.nav .btn'); b.focus()
  const s = getComputedStyle(b)
  return { w: s.outlineWidth, style: s.outlineStyle, couleur: s.outlineColor, offset: s.outlineOffset }
})
dit(focus.style !== 'none' && parseFloat(focus.w) >= 2, `focus visible sur le bouton de la barre : ${focus.w} ${focus.style} ${focus.couleur}, offset ${focus.offset}`)
await d.evaluate(() => document.querySelector('.nav .btn').focus())
await d.screenshot({ path: `${OUT}/E-focus-bouton.png`, clip: { x: 700, y: 0, width: 740, height: 90 } })

/* ══ 4. LE PIED SUR DESKTOP ══ */
const piedD = await d.evaluate(() => {
  const p = document.querySelector('.pied'), s = document.querySelector('.signature-cleo')
  const liens = [...p.querySelectorAll('a')].map(a => a.getAttribute('href'))
  return { h: Math.round(p.getBoundingClientRect().height), sign: Math.round(s.getBoundingClientRect().height),
    total: Math.round(p.getBoundingClientRect().height + s.getBoundingClientRect().height),
    nbLiens: liens.length, morts: liens.filter(h => !h || h === '#').length,
    internes: [...new Set(liens.filter(h => h && !/^(https?:|mailto:)/.test(h)))] }
})
console.log(`  · PIED DESKTOP : ${piedD.h} px (+ signature ${piedD.sign} px = ${piedD.total} px), ${piedD.nbLiens} liens`)
dit(piedD.h <= 750, `le pied desktop reste bas : ${piedD.h} px (seuil 750)`)
dit(piedD.morts === 0, `aucun href="#" dans le pied (${piedD.morts})`)

/* toutes les cibles internes du pied répondent-elles ? On rejoue la table de
   réécriture de Vercel : un chemin propre doit tomber sur un fichier existant. */
const manquants = piedD.internes.map(h => h.split('#')[0]).filter(h => {
  const cible = REWRITES.get(h)
  return !(cible && fs.existsSync(ICI + '/sortie' + cible)) && !fs.existsSync(ICI + '/sortie/' + h)
})
dit(manquants.length === 0, `toutes les pages citées par le pied existent (${manquants.length ? 'manquent : ' + manquants.join(', ') : piedD.internes.length + ' chemins vérifiés'})`)
await dctx.close()

await nav.close()
console.log(`\n══ ${ok.length} contrôle(s) OK, ${ko.length} en échec ══`)
if (ko.length) { console.log('EN ÉCHEC :'); ko.forEach(x => console.log('  - ' + x)) }
process.exit(ko.length ? 1 : 0)
