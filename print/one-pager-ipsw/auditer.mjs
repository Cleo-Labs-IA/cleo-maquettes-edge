// Releve les valeurs REELLEMENT rendues, page par page : tailles de corps,
// graisses, rayons, bords, ombres, alignements a gauche. Une famille d'objets
// qui rend cinq rayons differents, c'est une incoherence visible.
//
// Ce script ne publie aucun chiffre de livrable : il mesure le rendu.
// Les chiffres imprimes sont traites dans assertions.md (8/8 verified against source).

import path from 'path'
import { fileURLToPath } from 'url'
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'

const ICI = path.dirname(fileURLToPath(import.meta.url))
const navigateur = await chromium.launch()
const page = await navigateur.newPage({ viewport: { width: 900, height: 1400 } })
await page.goto('file://' + path.join(ICI, 'one-pager.html'))
await page.emulateMedia({ media: 'print' })
await page.waitForTimeout(600)

const releve = await page.evaluate(() => {
  const pages = [...document.querySelectorAll('.page')]
  const mmParPx = 297 / pages[0].getBoundingClientRect().height
  const mm = (px) => +(px * mmParPx).toFixed(1)
  const pt = (px) => +(px * 0.75).toFixed(1)

  const compter = (liste) => {
    const m = new Map()
    liste.forEach(([cle, qui]) => {
      if (!m.has(cle)) m.set(cle, [])
      m.get(cle).push(qui)
    })
    return [...m.entries()].sort((a, b) => b[1].length - a[1].length)
  }

  const nom = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/)[0] : '')

  const corps = [], rayons = [], bords = [], ombres = [], fonds = [], gauches = []

  pages.forEach((p, i) => {
    const boite = p.getBoundingClientRect()
    p.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (!r.width || !r.height) return
      const s = getComputedStyle(el)

      const texteDirect = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (texteDirect) corps.push([pt(parseFloat(s.fontSize)) + 'pt / ' + s.fontWeight, 'p' + (i + 1) + ' ' + nom(el)])

      const rad = parseFloat(s.borderTopLeftRadius)
      if (rad > 0 && rad < 200) rayons.push([mm(rad) + 'mm', 'p' + (i + 1) + ' ' + nom(el)])

      if (parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none') {
        bords.push([mm(parseFloat(s.borderTopWidth)).toFixed(1) + 'mm ' + s.borderTopColor, 'p' + (i + 1) + ' ' + nom(el)])
      }
      if (s.boxShadow !== 'none') ombres.push([s.boxShadow.slice(0, 60), 'p' + (i + 1) + ' ' + nom(el)])
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') fonds.push([s.backgroundColor, 'p' + (i + 1) + ' ' + nom(el)])

      if (r.width > boite.width * 0.35) gauches.push([mm(r.left - boite.left) + 'mm', 'p' + (i + 1) + ' ' + nom(el)])
    })
  })

  return {
    corps: compter(corps), rayons: compter(rayons), bords: compter(bords),
    ombres: compter(ombres), fonds: compter(fonds), gauches: compter(gauches),
  }
})

const bloc = (titre, entrees, limite = 14) => {
  console.log('\n── ' + titre + ' : ' + entrees.length + ' valeur(s) distincte(s) ' + '─'.repeat(Math.max(0, 30 - titre.length)))
  entrees.slice(0, limite).forEach(([cle, qui]) =>
    console.log('  ' + String(cle).padEnd(38) + ' x' + String(qui.length).padEnd(3) + '  ' + [...new Set(qui)].slice(0, 4).join(', '))
  )
}

bloc('Corps de texte (taille / graisse)', releve.corps, 20)
bloc('Rayons', releve.rayons)
bloc('Bords', releve.bords)
bloc('Ombres', releve.ombres)
bloc('Fonds', releve.fonds)
bloc('Bord gauche des blocs larges', releve.gauches)

await navigateur.close()
