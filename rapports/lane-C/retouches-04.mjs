import fs from 'fs'
const f = 'pages/04-secteur.html'
let t = fs.readFileSync(f, 'utf8')
const un = (avant, apres) => {
  const n = t.split(avant).length - 1
  if (n !== 1) throw new Error(`« ${avant.slice(0, 60)} » trouve ${n} fois, attendu 1`)
  t = t.replace(avant, apres)
}
const nieme = (avant, apres, k) => {
  let i = -1, c = 0
  while ((i = t.indexOf(avant, i + 1)) !== -1) { if (++c === k) { t = t.slice(0, i) + apres + t.slice(i + avant.length); return } }
  throw new Error(`occurrence ${k} de « ${avant.slice(0, 40)} » introuvable`)
}
// 1. Toutes les sections portent le marqueur de lane
t = t.replace(/<section class="/g, '<section class="seg ')
// 2. Le hero rendait son bord contre la bande de logos noire : 88 px de bas
un('<section class="seg section" style="padding:var(--s-64) 0 0">',
   '<section class="seg section" style="padding:var(--s-64) 0 var(--pad-section-courte)">')
// 3. Les photographies : sujet textile, une seule occurrence par image
un('<img class="fond" src="img:pneus" alt="">',
   '<img class="fond" src="img:masse-tshirt" alt="Pile de tee-shirts gris pliés, un seul tee-shirt bleu au milieu">')
nieme('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:parc-voitures" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-basket" alt="Paires de baskets grises alignées, une seule paire bleue"></div>', 1)
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:echangeur" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-chaussette" alt="Chaussettes grises en vrac, une seule chaussette bleue"></div>')
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:briques" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:briques" alt="Briques de construction grises en vrac, deux briques bleues au milieu"></div>')
un('<img src="img:fenetres" alt="">',
   '<img src="img:fenetres" alt="Façade d\'immeuble la nuit, une fenêtre éclairée en bleu parmi des dizaines de fenêtres jaunes" style="object-position:38% 50%">')
// le temoignage : derniere scene 4/3 restee sur parc-voitures
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:parc-voitures" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-casque" alt="Casques de vélo gris posés en rangées, un seul casque bleu"></div>')
// 4. Les portraits nommes portent leur nom
un('<div class="avatars"><img src="img:anaelle" alt=""><img src="img:naomie" alt=""><img src="img:darcial" alt=""></div>',
   '<div class="avatars"><img src="img:anaelle" alt="Anaëlle Guez"><img src="img:naomie" alt="Naomie Halioua"><img src="img:darcial" alt="Darcial Mondjo"></div>')
un('<img src="img:philippine" alt="">', '<img src="img:philippine" alt="Philippine Tamic">')
un('<img class="portrait" src="img:anaelle" alt="">',
   '<img class="portrait" src="img:anaelle" alt="Anaëlle Guez, cofondatrice de Cleo Labs">')
fs.writeFileSync(f, t)
console.log('04-secteur : ok')
console.log('images :', [...new Set(t.match(/img:[a-z0-9-]+/g))].join(' '))
const c = {}; for (const m of t.match(/img:[a-z0-9-]+/g)) c[m] = (c[m] || 0) + 1
console.log('doublons :', Object.entries(c).filter(([, n]) => n > 1).map(([k, n]) => k + '×' + n).join(' ') || 'aucun')
