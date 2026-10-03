/* Chaque image locale qu'une page publique affiche doit exister dans sortie/ (01/10/2026 : l'image de corps de
   l'article Pitch by Deel répondait 404 en ligne). Oracle : le système de fichiers de sortie/, pas le générateur.
   Témoin négatif : une page qui cite une image absente doit être détectée. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
const SORTIE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'sortie')
const manquantes = (html, lire = f => fs.existsSync(path.join(SORTIE, f))) => {
  const ko = []
  for (const m of html.matchAll(/<img\s[^>]*?src="([^"]+)"/gi)) {
    const s = m[1]
    if (/^(https?:)?\/\//.test(s) || s.startsWith('data:')) continue
    const f = decodeURIComponent(s.split(/[?#]/)[0]).replace(/^\//, '')
    if (!lire(f)) ko.push(s)
  }
  return ko
}
const pages = fs.readdirSync(SORTIE).filter(f => f.endsWith('.html'))
let images = 0; const ko = []
for (const p of pages) {
  const html = fs.readFileSync(path.join(SORTIE, p), 'utf8')
  images += (html.match(/<img\s/gi) || []).length
  for (const s of manquantes(html)) ko.push(`${p} : ${s}`)
}
const temoin = manquantes('<p><img src="/image-qui-n-existe-pas-9f3a.jpg" alt=""></p>')
if (temoin.length !== 1) { console.error('TÉMOIN EN ÉCHEC : une image absente n\'est pas détectée'); process.exit(1) }
if (pages.length < 300 || images < 1000) { console.error(`sortie/ trop petite pour conclure : ${pages.length} pages, ${images} images`); process.exit(1) }
if (ko.length) { console.error(`${ko.length} image(s) locale(s) absente(s) de sortie/ :\n  ${ko.slice(0, 20).join('\n  ')}`); process.exit(1) }
console.log(`images locales : ${pages.length} pages, ${images} balises <img>, aucune image absente ; témoin négatif détecté`)
