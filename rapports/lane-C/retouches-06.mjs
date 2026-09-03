import fs from 'fs'
const f = 'pages/06-cas-client.html'
let t = fs.readFileSync(f, 'utf8')
const un = (a, b) => { const n = t.split(a).length - 1; if (n !== 1) throw new Error(`« ${a.slice(0, 70)} » ×${n}`); t = t.replace(a, b) }
t = t.replace(/<section class="/g, '<section class="seg ')
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-velo" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-velo" alt="Vélos gris rangés côte à côte, un seul vélo bleu"></div>')
// La bande citation : la grille passe en classe, elle ne se repliait pas en inline
un(`    <div style="display:grid;grid-template-columns:100px 1fr;gap:32px;align-items:center;max-width:820px">
      <img src="img:philippine" alt="" style="width:100px;height:100px;border-radius:50%;object-fit:cover">`,
`    <div class="seg-citation">
      <img src="img:philippine" alt="Philippine Tamic">`)
un('<div class="recit">', '<div class="recit seg-recit">')
un('<img class="portrait" src="img:anaelle" alt="">',
   '<img class="portrait" src="img:anaelle" alt="Anaëlle Guez, cofondatrice de Cleo Labs">')
fs.writeFileSync(f, t)
console.log('06-cas-client : ok')
