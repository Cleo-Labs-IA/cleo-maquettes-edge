/* Contraste MESURE AU PIXEL, pour les textes que le calcul CSS ne peut pas
   trancher : fond en degrade inline, ou texte pose sur une photographie.
   On decoupe la boite de l'element dans la capture, on prend la couleur la
   plus frequente (le fond) et la couleur la plus eloignee en luminance qui
   pese au moins 1,5 % des pixels (l'encre), et on calcule le rapport WCAG. */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import sharp from '/Users/naomiehalioua/cleo-landing/node_modules/sharp/lib/index.js'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'
const lum = (r, g, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
const { url } = await servir('/Users/naomiehalioua/cleo-maquettes-edge/sortie')
const b = await chromium.launch()
const CIBLES = {
  '04-secteur': ['.bande-logos', '.scene-large .dessus .t-label', '.scene-large .dessus h3'],
  '05-marche': ['.scene-large .dessus .t-label', '.scene-large .dessus h3'],
  '06-cas-client': ['.duo .surtitre.sur-clair', '.duo h1 .attenue', '.duo p.t-lead'],
  '09-texte': ['.bande-logos'],
}
for (const [nom, sels] of Object.entries(CIBLES)) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1200 }, deviceScaleFactor: 2 })
  const p = await ctx.newPage()
  await p.goto(`${url}/${nom}.html`, { waitUntil: 'load' })
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(700)
  console.log('=== ' + nom)
  for (const sel of sels) {
    const cible = sel === '.bande-logos'
      ? await p.$('.sur-sombre .centre.t-micro') : await p.$(sel)
    if (!cible) { console.log('  ' + sel + ' : introuvable'); continue }
    await cible.scrollIntoViewIfNeeded(); await p.waitForTimeout(400)
    const buf = await cible.screenshot()
    const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true })
    const seaux = new Map()
    const n = info.width * info.height, c = info.channels
    for (let i = 0; i < n; i++) {
      const r = data[i * c], g = data[i * c + 1], bl = data[i * c + 2]
      const k = (r >> 3) + ',' + (g >> 3) + ',' + (bl >> 3)
      const e = seaux.get(k) || { n: 0, r: 0, g: 0, b: 0 }
      e.n++; e.r += r; e.g += g; e.b += bl; seaux.set(k, e)
    }
    const liste = [...seaux.values()].map(e => ({ n: e.n, r: e.r / e.n, g: e.g / e.n, b: e.b / e.n }))
      .sort((x, y) => y.n - x.n)
    const fond = liste[0]
    const lf = lum(fond.r, fond.g, fond.b)
    const encre = liste.filter(x => x.n / n >= 0.015)
      .map(x => ({ ...x, d: Math.abs(lum(x.r, x.g, x.b) - lf) })).sort((x, y) => y.d - x.d)[0]
    const le = lum(encre.r, encre.g, encre.b)
    const ratio = (Math.max(lf, le) + 0.05) / (Math.min(lf, le) + 0.05)
    console.log(`  ${sel.padEnd(34)} fond rgb(${fond.r | 0},${fond.g | 0},${fond.b | 0}) · encre rgb(${encre.r | 0},${encre.g | 0},${encre.b | 0}) → ${Math.round(ratio * 100) / 100}:1`)
  }
  await ctx.close()
}
await b.close()
