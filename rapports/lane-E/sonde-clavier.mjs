/* Lane E, passe 2 — le cadre au clavier.
   Mesure, jamais déduit : chaque ligne vient de getBoundingClientRect,
   getComputedStyle, getAttribute ou document.activeElement.

   node rapports/lane-E/sonde-clavier.mjs [fr|en]  (défaut : les deux) */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
import fs from 'fs'

const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const nav = await chromium.launch()
const resultats = []
let ok = 0, total = 0
const dit = (nom, cond, detail) => { total++; if (cond) ok++; resultats.push({ nom, verdict: cond ? 'OK' : 'ECHEC', detail })
  console.log(`  ${cond ? 'OK   ' : 'ECHEC'} ${nom} :: ${detail}`) }

/* l'état de la barre, lu dans la page */
const etat = () => ({
  ouverts: [...document.querySelectorAll('.mega')].filter(m => {
    const s = getComputedStyle(m), r = m.getBoundingClientRect()
    return s.visibility === 'visible' && s.display !== 'none' && +s.opacity > 0.5 && r.width > 0
  }).map(m => ({ id: m.id, x: +m.getBoundingClientRect().x.toFixed(1), y: +m.getBoundingClientRect().y.toFixed(1),
      w: +m.getBoundingClientRect().width.toFixed(1), h: +m.getBoundingClientRect().height.toFixed(1),
      liens: m.querySelectorAll('a').length })),
  aria: [...document.querySelectorAll('.nav-declencheur')].map(b => ({
    t: b.textContent.trim(), tag: b.tagName, exp: b.getAttribute('aria-expanded'), ctrl: b.getAttribute('aria-controls') })),
  focus: document.activeElement ? (document.activeElement.textContent || '').trim().slice(0, 30) + ' <' + document.activeElement.tagName + '>' : 'aucun'
})

for (const [lang, fichier] of [['fr', '01-accueil.html'], ['en', '01-accueil-en.html']]) {
  if (process.argv[2] && process.argv[2] !== lang) continue
  console.log(`\n════ ${lang.toUpperCase()} — desktop 1440x900 ════`)
  const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const erreurs = []
  page.on('pageerror', e => erreurs.push(String(e)))
  page.on('console', m => { if (m.type() === 'error') erreurs.push(m.text()) })
  await page.goto(`${url}/${fichier}`, { waitUntil: 'networkidle' })

  /* 1. aria-expanded et aria-controls posés au chargement */
  let e = await page.evaluate(etat)
  const avecPanneau = e.aria.filter(a => a.tag === 'BUTTON')
  dit(`${lang} aria-expanded présent sur les déclencheurs à panneau`,
    avecPanneau.length > 0 && avecPanneau.every(a => a.exp === 'false'),
    JSON.stringify(avecPanneau.map(a => `${a.t}=${a.exp}`)))
  dit(`${lang} aria-controls pointe un panneau existant`,
    avecPanneau.every(a => a.ctrl && a.ctrl.length > 0),
    JSON.stringify(avecPanneau.map(a => `${a.t}→${a.ctrl}`)))
  dit(`${lang} le lien direct (Entreprise) ne porte PAS aria-expanded`,
    e.aria.filter(a => a.tag === 'A').every(a => a.exp === null),
    JSON.stringify(e.aria.filter(a => a.tag === 'A').map(a => `${a.t}=${a.exp}`)))
  dit(`${lang} aucun panneau ouvert au chargement`, e.ouverts.length === 0, `${e.ouverts.length} ouvert(s)`)

  /* 2. Tab jusqu'au premier déclencheur */
  let tabs = 0, trouve = false
  for (; tabs < 12 && !trouve; ) { await page.keyboard.press('Tab'); tabs++
    trouve = await page.evaluate(() => !!document.activeElement.closest('.nav-declencheur') || document.activeElement.classList.contains('nav-declencheur')) }
  const nomFocus = await page.evaluate(() => document.activeElement.textContent.trim())
  dit(`${lang} Tab atteint le 1er déclencheur`, trouve, `au Tab n° ${tabs}, « ${nomFocus} »`)
  e = await page.evaluate(etat)
  dit(`${lang} le focus seul n'ouvre pas le panneau`, e.ouverts.length === 0, `${e.ouverts.length} ouvert(s)`)

  /* 3. Entrée ouvre */
  await page.keyboard.press('Enter'); await page.waitForTimeout(260)
  e = await page.evaluate(etat)
  dit(`${lang} Entrée ouvre UN panneau`, e.ouverts.length === 1, JSON.stringify(e.ouverts))
  dit(`${lang} Entrée pose aria-expanded=true sur le déclencheur focalisé`,
    e.aria.filter(a => a.exp === 'true').length === 1,
    JSON.stringify(e.aria.map(a => `${a.t}=${a.exp}`)))
  const boite = e.ouverts[0] || {}
  dit(`${lang} le panneau ouvert a une boîte non nulle et des liens`,
    boite.w > 200 && boite.h > 60 && boite.liens > 0,
    `${boite.w}x${boite.h} à x=${boite.x} y=${boite.y}, ${boite.liens} liens`)
  dit(`${lang} le panneau ne déborde pas de la fenêtre`,
    boite.x >= 0 && boite.x + boite.w <= 1441, `droite = ${(boite.x + boite.w).toFixed(1)} px pour 1440`)

  /* 4. Entrée referme (bascule) */
  await page.keyboard.press('Enter'); await page.waitForTimeout(260)
  e = await page.evaluate(etat)
  dit(`${lang} Entrée referme (bascule)`, e.ouverts.length === 0 && e.aria.every(a => a.exp !== 'true'), `${e.ouverts.length} ouvert(s)`)

  /* 5. Espace ouvre, sans faire défiler la page */
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.keyboard.press('Space'); await page.waitForTimeout(260)
  e = await page.evaluate(etat)
  const scroll = await page.evaluate(() => window.scrollY)
  dit(`${lang} Espace ouvre le panneau`, e.ouverts.length === 1, `${e.ouverts.length} ouvert(s)`)
  dit(`${lang} Espace ne fait pas défiler la page`, scroll === 0, `scrollY = ${scroll}`)

  /* 6. Tab entre DANS le panneau et l'y garde ouvert */
  await page.keyboard.press('Tab'); await page.waitForTimeout(120)
  e = await page.evaluate(etat)
  const dedans = await page.evaluate(() => !!document.activeElement.closest('.mega'))
  dit(`${lang} Tab entre dans le panneau`, dedans, `focus : ${e.focus}`)
  dit(`${lang} le panneau reste ouvert avec le focus dedans`, e.ouverts.length === 1, `${e.ouverts.length} ouvert(s)`)

  /* 7. les liens du panneau sont atteignables au clavier, un par un */
  let atteints = 0
  const cible = e.ouverts[0] ? e.ouverts[0].liens : 0
  for (let i = 0; i < cible + 2; i++) {
    const d = await page.evaluate(() => !!document.activeElement.closest('.mega'))
    if (d) atteints++; else break
    await page.keyboard.press('Tab'); await page.waitForTimeout(60)
  }
  dit(`${lang} tous les liens du panneau sont atteints au Tab`, atteints >= cible, `${atteints} sur ${cible}`)

  /* 8. sortir du panneau au Tab referme */
  e = await page.evaluate(etat)
  dit(`${lang} sortir du panneau au Tab le referme`, e.ouverts.length === 0, `${e.ouverts.length} ouvert(s), focus : ${e.focus}`)

  /* 9. Échap ferme et rend le focus au déclencheur */
  await page.evaluate(() => { const b = document.querySelector('.nav-declencheur'); b.focus() })
  await page.keyboard.press('Enter'); await page.waitForTimeout(220)
  const ouvertAvantEchap = (await page.evaluate(etat)).ouverts.length
  await page.keyboard.press('Escape'); await page.waitForTimeout(260)
  e = await page.evaluate(etat)
  const focusRendu = await page.evaluate(() => document.activeElement.classList.contains('nav-declencheur'))
  dit(`${lang} Échap ferme le panneau`, ouvertAvantEchap === 1 && e.ouverts.length === 0, `avant ${ouvertAvantEchap}, après ${e.ouverts.length}`)
  dit(`${lang} Échap rend le focus au déclencheur`, focusRendu, `focus : ${e.focus}`)

  /* 10. un seul panneau à la fois : ouvrir A puis B au clic */
  const decl = page.locator('.nav-declencheur')
  const nb = await decl.count()
  await decl.nth(0).click(); await page.waitForTimeout(220)
  await decl.nth(1).click(); await page.waitForTimeout(260)
  e = await page.evaluate(etat)
  dit(`${lang} un seul panneau ouvert à la fois (clic A puis B)`, e.ouverts.length === 1,
    `${e.ouverts.length} ouvert(s), aria=${JSON.stringify(e.aria.map(a => a.exp))}`)

  /* 11. un clic hors de la barre ferme */
  await page.mouse.click(720, 600); await page.waitForTimeout(260)
  e = await page.evaluate(etat)
  dit(`${lang} un clic hors de la barre ferme`, e.ouverts.length === 0 && e.aria.every(a => a.exp !== 'true'), `${e.ouverts.length} ouvert(s)`)

  /* 12. le survol continue de fonctionner */
  await decl.nth(0).hover(); await page.waitForTimeout(320)
  e = await page.evaluate(etat)
  dit(`${lang} le survol ouvre toujours`, e.ouverts.length === 1, JSON.stringify(e.ouverts.map(o => `${o.id} ${o.w}x${o.h}`)))
  await page.mouse.move(720, 600); await page.waitForTimeout(320)
  e = await page.evaluate(etat)
  dit(`${lang} quitter le survol referme`, e.ouverts.length === 0, `${e.ouverts.length} ouvert(s)`)

  /* 13. géométrie de chacun des panneaux, au survol */
  const geo = []
  for (let i = 0; i < nb; i++) {
    await decl.nth(i).hover(); await page.waitForTimeout(300)
    const s = await page.evaluate(etat)
    const t = (await decl.nth(i).textContent()).trim()
    if (s.ouverts[0]) geo.push({ menu: t, ...s.ouverts[0] }); else geo.push({ menu: t, panneau: 'aucun (lien direct)' })
    await page.mouse.move(720, 600); await page.waitForTimeout(180)
  }
  console.log(`  géométrie : ${JSON.stringify(geo)}`)
  resultats.push({ nom: `${lang} géométrie des panneaux`, verdict: 'MESURE', detail: JSON.stringify(geo) })

  /* 14. le plus petit texte de la barre et des panneaux, en desktop */
  const petits = await page.evaluate(() => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.add('ouvert'))
    const out = []
    for (const el of document.querySelectorAll('.nav *, .nav')) {
      if (!el.textContent.trim()) continue
      if (el.children.length && [...el.childNodes].every(n => n.nodeType !== 3 || !n.textContent.trim())) continue
      const s = getComputedStyle(el); const px = parseFloat(s.fontSize)
      if (px < 13) out.push({ cl: el.className.toString().slice(0, 40), px, t: el.textContent.trim().slice(0, 34) })
    }
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('ouvert'))
    return out
  })
  dit(`${lang} aucun texte sous 13 px dans la barre et les panneaux (desktop)`, petits.length === 0, JSON.stringify(petits))

  /* 15. le sélecteur de langue, aux trois largeurs */
  for (const w of [1440, 900, 390]) {
    await page.setViewportSize({ width: w, height: 844 })
    await page.waitForTimeout(120)
    const l = await page.evaluate(() => { const a = document.querySelector('.nav-langue span, .nav-langue a')
      if (!a) return null; const s = getComputedStyle(a), r = a.getBoundingClientRect()
      return { px: parseFloat(s.fontSize), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } })
    const seuil = w <= 640 ? 14 : 13
    dit(`${lang} sélecteur de langue à ${w} px : ≥ ${seuil} px`, l && l.px >= seuil, l ? `${l.px} px, cible ${l.w}x${l.h}` : 'absent')
  }
  await page.setViewportSize({ width: 1440, height: 900 })

  /* 16. le menu téléphone, retesté au clic */
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${url}/${fichier}`, { waitUntil: 'networkidle' })
  const burger = page.locator('.nav-burger')
  const av = await page.evaluate(() => { const m = document.getElementById('menu-mobile')
    return { hidden: m.hidden, exp: document.querySelector('.nav-burger').getAttribute('aria-expanded') } })
  await burger.click(); await page.waitForTimeout(400)
  const ap = await page.evaluate(() => { const m = document.getElementById('menu-mobile'), r = m.getBoundingClientRect()
    return { hidden: m.hidden, exp: document.querySelector('.nav-burger').getAttribute('aria-expanded'),
      w: +r.width.toFixed(1), h: +r.height.toFixed(1), scrollH: m.scrollHeight, liens: m.querySelectorAll('a').length,
      groupes: [...m.querySelectorAll('.mm-groupe')].map(g => { const t = g.querySelector('.mm-titre')
        return (t ? t.textContent.trim() : g.querySelector('a').textContent.trim()) + ' (' + g.querySelectorAll('a').length + ')' }),
      bloque: getComputedStyle(document.documentElement).overflow,
      debord: document.documentElement.scrollWidth > 390 } })
  dit(`${lang} menu téléphone : le panneau s'ouvre au clic`, ap.hidden === false && ap.exp === 'true' && av.hidden === true,
    `avant hidden=${av.hidden}/exp=${av.exp}, après hidden=${ap.hidden}/exp=${ap.exp}`)
  dit(`${lang} menu téléphone : la boîte fait bien 390 x ~783`, ap.w === 390 && ap.h > 700,
    `${ap.w} x ${ap.h} px pour ${ap.scrollH} px de contenu`)
  dit(`${lang} menu téléphone : le défilement de la page est bloqué`, ap.bloque === 'hidden', `html overflow = ${ap.bloque}`)
  dit(`${lang} menu téléphone : pas de débordement horizontal`, !ap.debord, ap.debord ? 'déborde' : 'non')
  console.log(`  groupes du panneau : ${JSON.stringify(ap.groupes)} — ${ap.liens} liens`)
  resultats.push({ nom: `${lang} panneau mobile`, verdict: 'MESURE', detail: `${ap.w}x${ap.h} pour ${ap.scrollH} · ${ap.liens} liens · ${JSON.stringify(ap.groupes)}` })
  await page.keyboard.press('Escape'); await page.waitForTimeout(300)
  const fin = await page.evaluate(() => { const m = document.getElementById('menu-mobile')
    return { hidden: m.hidden, exp: document.querySelector('.nav-burger').getAttribute('aria-expanded'), v: getComputedStyle(m).display } })
  dit(`${lang} menu téléphone : Échap referme`, fin.hidden === true && fin.exp === 'false', `hidden=${fin.hidden}, exp=${fin.exp}, display=${fin.v}`)

  dit(`${lang} aucune erreur JS`, erreurs.length === 0, erreurs.length ? erreurs.join(' | ').slice(0, 200) : '0')
  await ctx.close()
}

await nav.close()
fs.writeFileSync('/Users/naomiehalioua/cleo-maquettes-edge/rapports/lane-E/sonde-clavier.json', JSON.stringify({ ok, total, resultats }, null, 2))
console.log(`\n═══ ${ok} contrôles OK sur ${total} ═══`)
if (ok < total) console.log('ECHECS :\n' + resultats.filter(r => r.verdict === 'ECHEC').map(r => '  - ' + r.nom + ' :: ' + r.detail).join('\n'))
process.exit(0)
