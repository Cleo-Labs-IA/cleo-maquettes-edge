/* Mesure des <title> de sortie/ : `node rapports/seo-0110/mesure-titres.mjs [--liste]`. Longueur comptée après décodage des entités. */
import fs from 'fs'
import path from 'path'
const ICI = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..')
const ent = t => t.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
const fichiers = []
const marche = d => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) marche(p); else if (f.name.endsWith('.html')) fichiers.push(p) } }
marche(path.join(ICI, 'sortie'))
const lignes = fichiers.map(f => { const m = fs.readFileSync(f, 'utf8').match(/<title>([\s\S]*?)<\/title>/); return { f: path.relative(path.join(ICI, 'sortie'), f), t: m ? ent(m[1]) : null } })
const stat = (nom, l) => { const n = l.filter(x => x.t !== null).map(x => [...x.t].length).sort((a, b) => a - b); if (!n.length) return console.log(nom, ': 0 page')
  console.log(`${nom} : ${l.length} pages, sans <title> ${l.length - n.length}, min ${n[0]}, médiane ${n[Math.floor(n.length / 2)]}, max ${n[n.length - 1]}, > 60 : ${n.filter(x => x > 60).length}, > 100 : ${n.filter(x => x > 100).length}, > 200 : ${n.filter(x => x > 200).length}`) }
const blog = lignes.filter(x => /^blog-/.test(path.basename(x.f)))
stat('blog FR', blog.filter(x => !x.f.endsWith('-en.html'))); stat('blog EN', blog.filter(x => x.f.endsWith('-en.html')))
const hors = lignes.filter(x => !/^blog-/.test(path.basename(x.f))); stat('hors blog', hors); stat('total', lignes)
if (process.argv.includes('--liste')) for (const x of hors.filter(x => x.t && [...x.t].length > 60).sort((a, b) => b.t.length - a.t.length)) console.log([...x.t].length, x.f, '|', x.t)
