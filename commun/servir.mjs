/* Sert un dossier en HTTP local, pour que les outils du chantier ouvrent les
   pages comme Vercel les sert : les images sont en /images/… depuis le 03/09/2026,
   un chemin absolu à la racine que file:// ne résout pas. Le serveur est unref :
   il ne retient pas le processus. */
import http from 'http'
import fs from 'fs'
import path from 'path'
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain' }

export function resoudreFichier(dossier, url) {
  const racine = path.resolve(dossier)
  const config = JSON.parse(fs.readFileSync(path.join(racine, 'vercel.json'), 'utf8'))
  let u = decodeURIComponent(url.split('?')[0])
  const redirection = config.redirects?.find(regle => regle.source === u)
  if (redirection) u = redirection.destination
  const reecriture = config.rewrites?.find(regle => regle.source === u)
  if (reecriture) u = reecriture.destination

  const fichier = path.resolve(racine, `.${u}`)
  if (fichier.startsWith(`${racine}${path.sep}`) && fs.existsSync(fichier) && !fs.statSync(fichier).isDirectory()) return fichier
  return path.join(racine, '404.html')
}

export function statutReponse(url, fichier) {
  const u = decodeURIComponent(url.split('?')[0])
  return path.basename(fichier) === '404.html' && u !== '/404.html' ? 404 : 200
}

export function servir(dossier) {
  return new Promise((res) => {
    const s = http.createServer((q, r) => {
      const f = resoudreFichier(dossier, q.url)
      r.statusCode = statutReponse(q.url, f)
      r.setHeader('Content-Type', TYPES[path.extname(f)] || 'application/octet-stream')
      fs.createReadStream(f).pipe(r)
    })
    s.unref()
    s.listen(0, '127.0.0.1', () => res({ url: `http://127.0.0.1:${s.address().port}`, fermer: () => s.close() }))
  })
}
