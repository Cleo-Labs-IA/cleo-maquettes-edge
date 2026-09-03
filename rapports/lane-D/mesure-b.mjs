/* Lane D, passe 2 : le plancher de taille de texte, les cibles et les
   débordements, mesurés au getComputedStyle sur les pages construites.
   Desktop 1440 : plancher 13 px. Téléphone 390 : plancher 14 px.
   Les maquettes d'application (.ecran-app, .nd, .vv-*, .ca-*, .cf-*) et le
   cadre (nav, méga-menus, pied) sont comptés à part : ils ne sont pas dans
   le territoire de la lane.
   node rapports/lane-D/mesure-b.mjs 24-blog 26-legal-data …            */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
import path from 'path'

const SORTIE = '/Users/naomiehalioua/cleo-maquettes-edge/sortie'
const cibles = process.argv.slice(2).map(c => c.replace(/\.html$/, ''))
const { url } = await servir(SORTIE)
const nav = await chromium.launch()

const SONDE = (plancher) => {
  const cs = e => getComputedStyle(e)
  const dansApp = e => e.closest('.ecran-app,.nd,.veille-vue,.chat-app,.carte-fiche,.hero-produit')
  const dansCadre = e => e.closest('nav.nav,.nav,.mega,.pied,.lien-evitement,header,footer')
  const visibles = [...document.querySelectorAll('body *')].filter(e => {
    const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0
  })
  const textes = visibles.filter(e => e.children.length === 0 && e.textContent.trim())
  const petit = e => parseFloat(cs(e).fontSize) < plancher
  const detail = t => ({ t: t.tagName, c: t.className || '', px: cs(t).fontSize, txt: t.textContent.trim().replace(/\s+/g, ' ').slice(0, 42) })
  const corps = textes.filter(e => petit(e) && !dansApp(e) && !dansCadre(e))
  const app = textes.filter(e => petit(e) && dansApp(e)).length
  const cadre = textes.filter(e => petit(e) && !dansApp(e) && dansCadre(e)).length
  const cib = [...document.querySelectorAll('a[href],button,input,select')].filter(e => {
    const b = e.getBoundingClientRect()
    return b.width > 0 && b.height > 0 && (b.height < 40 || b.width < 40) && !dansApp(e)
  }).map(e => ({ t: e.tagName, c: e.className || '', w: Math.round(e.getBoundingClientRect().width), h: Math.round(e.getBoundingClientRect().height), txt: (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 32), cadre: !!dansCadre(e) }))
  return {
    corps: corps.length, app, cadre,
    listeCorps: corps.map(detail),
    cibles: cib.filter(c => !c.cadre).length, ciblesCadre: cib.filter(c => c.cadre).length,
    listeCibles: cib,
    debordement: document.documentElement.scrollWidth > window.innerWidth + 1,
    largeurDoc: document.documentElement.scrollWidth,
    h1: (() => { const h = document.querySelector('h1'); return h ? { px: cs(h).fontSize, cls: h.className, txt: h.textContent.trim().replace(/\s+/g, ' ').slice(0, 60) } : null })(),
    nbH1: document.querySelectorAll('h1').length
  }
}

const res = {}
for (const c of cibles) {
  const fichier = `${url}/${c}.html`
  const d = await nav.newPage({ viewport: { width: 1440, height: 900 } })
  await d.goto(fichier, { waitUntil: 'networkidle' })
  await d.waitForTimeout(250)
  const desktop = await d.evaluate(SONDE, 13)
  await d.close()
  const m = await nav.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
  await m.goto(fichier, { waitUntil: 'networkidle' })
  await m.waitForTimeout(250)
  const tel = await m.evaluate(SONDE, 14)
  await m.close()
  res[c] = { desktop, tel }
  const g = (o) => `${o.corps} corps / ${o.cadre} cadre / ${o.app} app · cibles ${o.cibles}(+${o.ciblesCadre} cadre)${o.debordement ? ' · DEBORDEMENT' : ''}`
  console.log(`${c.padEnd(22)} D[<13px] ${g(desktop).padEnd(56)} | T[<14px] ${g(tel)}`)
  if (desktop.corps) console.log('   desktop:', JSON.stringify(desktop.listeCorps.slice(0, 12)))
  if (tel.corps) console.log('   tel    :', JSON.stringify(tel.listeCorps.slice(0, 12)))
  if (desktop.cibles) console.log('   cibles D:', JSON.stringify(desktop.listeCibles.filter(x => !x.cadre).slice(0, 8)))
  if (tel.cibles) console.log('   cibles T:', JSON.stringify(tel.listeCibles.filter(x => !x.cadre).slice(0, 8)))
}
await nav.close()
const fs = await import('fs')
fs.writeFileSync(path.join('/Users/naomiehalioua/cleo-maquettes-edge/rapports/lane-D', process.env.SORTIE_JSON || 'mesure-b.json'), JSON.stringify(res, null, 1))
