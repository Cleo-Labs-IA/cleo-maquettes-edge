/* Sert un dossier en HTTP local, pour que les outils du chantier ouvrent les
   pages comme Vercel les sert : les images sont en /images/… depuis le 03/09/2026,
   un chemin absolu à la racine que file:// ne résout pas. Le serveur est unref :
   il ne retient pas le processus. */
import http from 'http'
import fs from 'fs'
import path from 'path'
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain' }
export function servir(dossier) {
  return new Promise((res) => {
    const s = http.createServer((q, r) => {
      let u = decodeURIComponent(q.url.split('?')[0])
      if (u === '/') u = '/index.html'
      const f = path.join(dossier, u)
      if (!f.startsWith(dossier) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.statusCode = 404; r.end('404'); return }
      r.setHeader('Content-Type', TYPES[path.extname(f)] || 'application/octet-stream')
      fs.createReadStream(f).pipe(r)
    })
    s.unref()
    s.listen(0, '127.0.0.1', () => res({ url: `http://127.0.0.1:${s.address().port}`, fermer: () => s.close() }))
  })
}
