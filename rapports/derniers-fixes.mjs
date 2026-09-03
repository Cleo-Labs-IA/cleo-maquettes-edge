import fs from 'fs'
const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const rempl = (f, a, b) => { const p = ICI + '/' + f; const t = fs.readFileSync(p, 'utf8'); const n = t.split(a).length - 1; if (n !== 1) throw new Error(f + ' : ' + n + ' × « ' + a.slice(0, 70) + ' »'); fs.writeFileSync(p, t.replace(a, b)); console.log('ok', f) }
const dec = s => s.replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
// 1. seo.json : les six articles à route réelle prennent le titre et la description SERVIS par le vrai site
const seo = JSON.parse(fs.readFileSync(ICI + '/commun/seo.json', 'utf8'))
const routes = { '27-article-levee.html': 'fr/blog/cleo-labs-raises-1-5m-preseed', '27-article-levee-en.html': 'en/blog/cleo-labs-raises-1-5m-preseed',
  '28-article-vivatech.html': 'fr/blog/cleo-labs-vivatech-2026-scaleway-startup-challenge', '28-article-vivatech-en.html': 'en/blog/cleo-labs-vivatech-2026-scaleway-startup-challenge',
  '29-article-deel.html': 'fr/blog/global-product-compliance-pitch-by-deel', '29-article-deel-en.html': 'en/blog/global-product-compliance-pitch-by-deel' }
for (const [f, u] of Object.entries(routes)) {
  const h = await (await fetch('https://www.cleolabs.co/' + u, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text()
  const titre = dec((h.match(/<title>([^<]*)<\/title>/) || [])[1] || ''); const desc = dec((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '')
  if (!titre || !desc) throw new Error('titre ou description absent pour ' + u)
  seo.pages[f] = { titre, description: desc, source: 'site', url_source: 'https://www.cleolabs.co/' + u, _releve_le: '2026-09-03' }
  console.log('seo', f, titre.length, desc.length)
}
fs.writeFileSync(ICI + '/commun/seo.json', JSON.stringify(seo, null, 1))
// 2. La barre latérale des ressources : huit entrées alignées sur le méga-menu, en deux langues
rempl('construire.mjs', `const resNav = (actif) => {
  const liens = [['10-ressources.html','Tout'],['15-evenements.html','Rencontres'],
                 ['17-modeles.html','Modèles'],['11-blog.html','Publications'],['13-glossaire.html','Glossaire']]
  return \`<nav class="res-nav">
    <div class="titre">Ressources</div>
    \${liens.map(([h,t]) => \`<a href="\${h}"\${t === actif ? ' class="actif"' : ''}>\${t}</a>\`).join('\\n    ')}
  </nav>\`
}`, `/* La barre latérale des ressources, alignée sur le méga-menu « Ressources » depuis le
   03/09/2026 (lane D : Recherche et Skills ne marquaient rien d'actif, et les pages
   anglaises recevaient la barre française). Le marqueur de page garde son ancien
   libellé : « Recherche » et « Publications » sont reconnus par alias. */
const resNav = (actif, en) => {
  const liens = en
    ? [['10-ressources.html','Tout','All'],['24-blog-en.html','Blog','Blog'],['23-research-en.html','Recherche','Research'],['25-skills-en.html','Skills','Skills'],
       ['26-legal-data-en.html','Legal Data','Legal Data'],['15-evenements.html','Rencontres','Events'],['17-modeles.html','Modèles','Templates'],['13-glossaire.html','Glossaire','Glossary']]
    : [['10-ressources.html','Tout','Tout'],['24-blog.html','Blog','Blog'],['23-research.html','Recherche','Travaux de recherche'],['25-skills.html','Skills','Skills'],
       ['26-legal-data.html','Legal Data','Legal Data'],['15-evenements.html','Rencontres','Rencontres'],['17-modeles.html','Modèles','Modèles'],['13-glossaire.html','Glossaire','Glossaire']]
  const cle = actif === 'Publications' ? 'Blog' : actif
  return \`<nav class="res-nav">
    <div class="titre">\${en ? 'Resources' : 'Ressources'}</div>
    \${liens.map(([h,k,t]) => \`<a href="\${h}"\${k === cle ? ' class="actif"' : ''}>\${t}</a>\`).join('\\n    ')}
  </nav>\`
}`)
rempl('construire.mjs', `corps = corps.replace(/<!--RES-NAV:([^>]*)-->/g, (_, a) => resNav(a.trim()))`, `corps = corps.replace(/<!--RES-NAV:([^>]*)-->/g, (_, a) => resNav(a.trim(), !!p.en))`)
// 3. Le lien « Terms » du pied anglais : 37 px de large
rempl('commun/composants.css', `.pied-bas a{padding:10px 0; display:inline-flex; align-items:center}`, `.pied-bas a{padding:10px 0; min-width:44px; display:inline-flex; align-items:center}`)
console.log('fin')
