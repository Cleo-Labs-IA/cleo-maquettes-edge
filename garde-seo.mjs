/* ════════════════════════════════════════════════════════════════
   GARDE-SEO — le filet sous le portage.

   On ne « fait pas attention » : on mesure l'état des signaux AVANT
   de toucher au site, et on refuse tout changement qui en dégrade un.

     node garde-seo.mjs capture                → garde/reference.json
     node garde-seo.mjs verifier               → compare et SORT EN ERREUR
     node garde-seo.mjs verifier http://localhost:3000

   Vécu le 27/08 : ma règle « on ne touche pas aux layout.tsx » laissait
   passer TeamSection.tsx, un composant de présentation qui porte les
   trois Person des fondatrices. Une règle ne protège que ce qu'elle
   nomme ; une mesure protège ce qui existe.
   ════════════════════════════════════════════════════════════════ */
import fs from 'fs'
import path from 'path'

const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const PROD = 'https://www.cleolabs.co'
const mode = process.argv[2] || 'capture'
const base = process.argv[3] || PROD
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0 Safari/537.36'

const prendre = async (url) => {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' })
    return { code: r.status, url_finale: r.url, texte: r.status === 200 ? await r.text() : '' }
  } catch (e) { return { code: 0, url_finale: url, texte: '', erreur: String(e).slice(0, 60) } }
}

// ── Les signaux d'une page. Tout ce qui, s'il disparaît, coûte.
const signaux = (t, code) => {
  const un = (re) => { const m = t.match(re); return m ? m[1].trim() : null }
  const tous = (re) => [...t.matchAll(re)].map(m => m[1])
  const lds = tous(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)
  const types = []
  for (const b of lds) {
    try {
      const o = JSON.parse(b)
      const v = Array.isArray(o) ? o : (o['@graph'] || [o])
      for (const x of v) if (x && x['@type']) types.push(String(x['@type']))
    } catch { types.push('INVALIDE') }
  }
  const corps = t.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
                 .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return {
    code,
    titre: un(/<title[^>]*>([\s\S]*?)<\/title>/),
    description: un(/<meta name="description" content="([^"]*)"/),
    canonical: un(/<link rel="canonical"[^>]*href="([^"]*)"/),
    hreflang: tous(/hreflang="([^"]*)"/g).sort(),
    og: tous(/<meta property="og:([a-z:]+)"/g).sort(),
    ld_types: types.sort(),
    ld_nb: lds.length,
    h1: tous(/<h1[^>]*>([\s\S]*?)<\/h1>/g).map(x => x.replace(/<[^>]+>/g, '').trim()),
    h2_nb: (t.match(/<h2[\s>]/g) || []).length,
    liens_internes: new Set(tous(/href="(\/[^"#?]*)"/g)).size,
    liens_sortants: new Set(tous(/href="(https?:\/\/(?!www\.cleolabs\.co)[^"]*)"/g)).size,
    mots: corps.split(' ').filter(Boolean).length,
    noindex: /content="[^"]*noindex/i.test(t),
  }
}

const lot = async (urls, n = 8) => {
  const out = {}
  for (let i = 0; i < urls.length; i += n) {
    await Promise.all(urls.slice(i, i + n).map(async u => {
      const r = await prendre(u)
      out[u.replace(base, '')] = signaux(r.texte, r.code)
    }))
    process.stdout.write(`\r  ${Math.min(i + n, urls.length)}/${urls.length}`)
  }
  process.stdout.write('\n')
  return out
}

// ── Les URL : le sitemap fait foi, c'est ce que le site DÉCLARE.
const sitemap = await prendre(`${base}/sitemap.xml`)
let urls = [...sitemap.texte.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
if (!urls.length) { console.error(`  aucun sitemap sur ${base} — on ne peut rien garder`); process.exit(2) }
urls = urls.map(u => u.replace(PROD, base))
console.log(`  ${urls.length} URL déclarées au sitemap de ${base}`)

// robots.txt : les autorisations de crawl IA sont un actif GEO.
const rob = await prendre(`${base}/robots.txt`)
const crawlers = [...rob.texte.matchAll(/User-agent:\s*([^\s]+)/gi)].map(m => m[1])

console.log(`  relevé des pages…`)
const pages = await lot(urls)

const etat = {
  base, quand: new Date().toISOString(),
  n_urls_sitemap: urls.length,
  robots_crawlers: crawlers.sort(),
  robots_a_un_disallow_total: /Disallow:\s*\/\s*$/m.test(rob.texte),
  pages,
}

fs.mkdirSync(path.join(ICI, 'garde'), { recursive: true })

if (mode === 'capture') {
  fs.writeFileSync(path.join(ICI, 'garde/reference.json'), JSON.stringify(etat, null, 1))
  const ok = Object.values(pages).filter(p => p.code === 200).length
  const ld = Object.values(pages).reduce((s, p) => s + p.ld_nb, 0)
  console.log(`\n  RÉFÉRENCE PRISE`)
  console.log(`    ${ok}/${urls.length} pages en 200`)
  console.log(`    ${ld} blocs JSON-LD au total`)
  console.log(`    ${crawlers.length} agents nommés dans robots.txt`)
  console.log(`    ${Object.values(pages).filter(p => p.canonical).length} canonical`)
  console.log(`    ${Object.values(pages).reduce((s, p) => s + p.mots, 0)} mots indexables`)
  console.log(`\n  → garde/reference.json`)
  process.exit(0)
}

// ── VÉRIFICATION : toute DÉGRADATION est une erreur. Un gain ne l'est pas.
const ref = JSON.parse(fs.readFileSync(path.join(ICI, 'garde/reference.json'), 'utf8'))
const casses = [], gains = []
const dit = (u, quoi) => casses.push(`  ${u}  ${quoi}`)

for (const [u, a] of Object.entries(ref.pages)) {
  const b = pages[u]
  if (!b) { dit(u, 'URL DISPARUE du sitemap'); continue }
  if (a.code === 200 && b.code !== 200) dit(u, `passe de 200 à ${b.code}`)
  if (a.titre && !b.titre) dit(u, 'titre perdu')
  else if (a.titre && b.titre !== a.titre) gains.push(`  ${u}  titre change : « ${a.titre.slice(0,40)} » → « ${b.titre.slice(0,40)} »`)
  if (a.description && !b.description) dit(u, 'meta description perdue')
  if (a.canonical && !b.canonical) dit(u, 'canonical perdu')
  else if (a.canonical && b.canonical !== a.canonical) dit(u, `canonical dévié : ${a.canonical} → ${b.canonical}`)
  for (const h of a.hreflang) if (!b.hreflang.includes(h)) dit(u, `hreflang « ${h} » perdu`)
  for (const o of a.og) if (!b.og.includes(o)) dit(u, `og:${o} perdu`)
  for (const t of a.ld_types) {
    const na = a.ld_types.filter(x => x === t).length, nb = b.ld_types.filter(x => x === t).length
    if (nb < na) dit(u, `JSON-LD ${t} : ${na} → ${nb}`)
  }
  if (b.ld_types.includes('INVALIDE')) dit(u, 'JSON-LD INVALIDE')
  if (a.h1.length && !b.h1.length) dit(u, 'h1 perdu')
  if (b.h2_nb < a.h2_nb * 0.7) dit(u, `h2 : ${a.h2_nb} → ${b.h2_nb}`)
  if (b.mots < a.mots * 0.8) dit(u, `texte : ${a.mots} → ${b.mots} mots (-${Math.round((1 - b.mots / a.mots) * 100)} %)`)
  if (b.liens_sortants < a.liens_sortants) dit(u, `liens sortants : ${a.liens_sortants} → ${b.liens_sortants}`)
  if (!a.noindex && b.noindex) dit(u, 'NOINDEX APPARU sur une page indexable')
}
for (const c of ref.robots_crawlers) if (!crawlers.includes(c)) dit('robots.txt', `agent « ${c} » retiré`)
if (urls.length < ref.n_urls_sitemap) dit('sitemap', `${ref.n_urls_sitemap} → ${urls.length} URL`)

console.log(`\n════ GARDE-SEO : ${Object.keys(ref.pages).length} pages comparées à la référence du ${ref.quand.slice(0, 10)}\n`)
if (gains.length) { console.log(`  ${gains.length} changement(s) sans perte :`); gains.slice(0, 8).forEach(g => console.log(g)); console.log() }
if (casses.length) {
  console.log(`  ⛔ ${casses.length} DÉGRADATION(S) :\n`)
  casses.slice(0, 40).forEach(c => console.log(c))
  if (casses.length > 40) console.log(`  … et ${casses.length - 40} autres`)
  console.log(`\n  ON NE PROMEUT PAS.`)
  process.exit(1)
}
console.log(`  ✓ aucun signal dégradé.`)
