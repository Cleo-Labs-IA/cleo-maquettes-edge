/* Lane E — le même cadre, côté anglais : bandeau-nav-en.html et pied-en.html.
   Seule 01-accueil-en.html porte le jumeau, donc c'est là qu'on mesure.
   node rapports/lane-E/cadre-en.mjs */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
import fs from 'fs'

const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const OUT = ICI + '/captures/lane'
const { url } = await servir(ICI + '/sortie')
const REWRITES = new Map(JSON.parse(fs.readFileSync(ICI + '/sortie/vercel.json', 'utf8')).rewrites.map(r => [r.source, r.destination]))
const nav = await chromium.launch()
const ok = [], ko = []
const dit = (b, t) => { (b ? ok : ko).push(t); console.log(`${b ? '  OK ' : '  KO '} ${t}`) }

/* téléphone */
const mctx = await nav.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const m = await mctx.newPage()
await m.goto(`${url}/01-accueil-en.html`, { waitUntil: 'load' }); await m.waitForTimeout(400)
await m.click('.nav-burger'); await m.waitForTimeout(300)
const p = await m.evaluate(() => {
  const el = document.getElementById('menu-mobile'), r = el.getBoundingClientRect()
  return { h: Math.round(r.height), w: Math.round(r.width), contenu: el.scrollHeight,
    groupes: [...el.querySelectorAll('.mm-groupe')].map(g => ({ t: (g.querySelector('.mm-titre') || g.querySelector('a')).textContent.trim(), n: g.querySelectorAll('a').length })),
    actions: [...el.querySelectorAll('.mm-actions a')].map(a => a.textContent.trim() + ' → ' + a.getAttribute('href')),
    petits: [...el.querySelectorAll('a,.mm-titre')].filter(e => parseFloat(getComputedStyle(e).fontSize) < 14).length,
    boutonBarre: getComputedStyle(document.querySelector('.nav-fin .btn')).display }
})
console.log(`  · panneau EN ${p.w}x${p.h}, contenu ${p.contenu} px`)
console.log(`  · groupes : ${p.groupes.map(g => g.t + ' (' + g.n + ')').join(', ')}`)
console.log(`  · actions : ${p.actions.join(' | ')}`)
dit(p.h > 700, `le panneau anglais s'ouvre en plein écran (${p.h} px)`)
dit(p.groupes.length === 4, `quatre groupes (${p.groupes.map(g => g.t).join(', ')})`)
dit(p.petits === 0, `aucun texte sous 14 px (${p.petits})`)
dit(p.boutonBarre === 'none', `le bouton de démo de la barre s'efface quand le panneau est ouvert`)
await m.screenshot({ path: `${OUT}/E-menu-ouvert-en.png` })
await mctx.close()

/* desktop */
const dctx = await nav.newContext({ viewport: { width: 1440, height: 900 } })
const d = await dctx.newPage()
await d.goto(`${url}/01-accueil-en.html`, { waitUntil: 'load' }); await d.waitForTimeout(400)
const cadre = await d.evaluate(() => {
  const logo = document.querySelector('.nav-logo')
  const pied = document.querySelector('.pied')
  const liens = [...pied.querySelectorAll('a')].map(a => a.getAttribute('href'))
  const langue = document.querySelector('.nav-langue')
  return { logoHref: logo.getAttribute('href'), logoAria: logo.getAttribute('aria-label'),
    logoBoite: (() => { const r = logo.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}` })(),
    navH: Math.round(document.querySelector('.nav').getBoundingClientRect().height),
    piedH: Math.round(pied.getBoundingClientRect().height),
    liens, morts: liens.filter(h => !h || h === '#').length,
    internes: [...new Set(liens.filter(h => h && !/^(https?:|mailto:)/.test(h)))],
    langue: langue ? langue.textContent.replace(/\s+/g, ' ').trim() : null,
    langueHref: langue ? [...langue.querySelectorAll('a')].map(a => a.getAttribute('href')) : [] }
})
console.log(`  · barre ${cadre.navH} px, pied ${cadre.piedH} px, logo ${cadre.logoBoite} → ${cadre.logoHref}`)
dit(cadre.logoHref === '/en', `le logo anglais mène à l'accueil anglais (${cadre.logoHref})`)
dit(!!cadre.logoAria, `le logo porte un intitulé accessible (${cadre.logoAria})`)
dit(cadre.piedH <= 750, `le pied anglais reste bas : ${cadre.piedH} px`)
dit(cadre.morts === 0, `aucun href="#" dans le pied anglais (${cadre.morts})`)
const manquants = cadre.internes.map(h => h.split('#')[0]).filter(h => {
  const c = REWRITES.get(h); return !(c && fs.existsSync(ICI + '/sortie' + c)) && !fs.existsSync(ICI + '/sortie/' + h)
})
dit(manquants.length === 0, `les ${cadre.internes.length} chemins du pied anglais existent${manquants.length ? ' — manquent : ' + manquants.join(', ') : ''}`)
dit(/^EN\s*FR$/.test(cadre.langue), `le sélecteur de langue est là et marque EN (${cadre.langue}) → ${cadre.langueHref.join(',')}`)

/* la nav FR sur une page FR jumelée : le sélecteur doit marquer FR */
await d.goto(`${url}/01-accueil.html`, { waitUntil: 'load' }); await d.waitForTimeout(300)
const fr = await d.evaluate(() => {
  const l = document.querySelector('.nav-langue')
  return { t: l ? l.textContent.replace(/\s+/g, ' ').trim() : null, h: l ? [...l.querySelectorAll('a')].map(a => a.getAttribute('href')) : [],
    logo: document.querySelector('.nav-logo').getAttribute('href') }
})
dit(/^FR\s*EN$/.test(fr.t), `sur la page française le sélecteur marque FR (${fr.t}) → ${fr.h.join(',')}`)
dit(fr.logo === '/fr', `le logo français mène à l'accueil français (${fr.logo})`)
await dctx.close()
await nav.close()
console.log(`\n══ ${ok.length} OK, ${ko.length} en échec ══`)
if (ko.length) ko.forEach(x => console.log('  - ' + x))
process.exit(ko.length ? 1 : 0)
