import fs from 'fs'
const f = 'pages/05-marche.html'
let t = fs.readFileSync(f, 'utf8')
const un = (a, b) => { const n = t.split(a).length - 1; if (n !== 1) throw new Error(`« ${a.slice(0, 70)} » ×${n}`); t = t.replace(a, b) }
t = t.replace(/<section class="/g, '<section class="seg ')
un('<section class="seg section" style="padding:var(--s-64) 0 0">',
   '<section class="seg section" style="padding:var(--s-64) 0 var(--pad-section-courte)">')
// La mosaique du hero : la grille passe en classe (l'inline gagnait sur la media query)
un(`        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:420px">
          <div class="scene" data-anim="grandit" style="grid-column:1 / -1;aspect-ratio:16/7"><img class="fond" src="img:echangeur" alt=""></div>
          <div class="scene" data-anim="grandit" style="aspect-ratio:1/1"><img class="fond" src="img:briques" alt=""></div>
          <div class="scene" data-anim="grandit" style="aspect-ratio:1/1"><img class="fond" src="img:pneus" alt=""></div>
        </div>`,
`        <div class="seg-mosaique">
          <div class="scene pleine" data-anim="grandit" style="aspect-ratio:16/7"><img class="fond" src="img:masse-canette" alt="Canettes grises alignées, une seule canette bleue"></div>
          <div class="scene" data-anim="grandit" style="aspect-ratio:1/1"><img class="fond" src="img:masse-pile" alt="Piles grises en vrac, une seule pile bleue"></div>
          <div class="scene" data-anim="grandit" style="aspect-ratio:1/1"><img class="fond" src="img:masse-peluche" alt="Peluches grises entassées, une seule peluche bleue"></div>
        </div>`)
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:parc-voitures" alt=""></div>\n    </div>\n\n    <div class="alterne inverse">',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-detergent" alt="Bidons de lessive gris rangés, un seul bidon bleu"></div>\n    </div>\n\n    <div class="alterne inverse">')
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:fenetres" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-flacon" alt="Flacons gris en rangées, un seul flacon bleu"></div>')
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:briques" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-couverts" alt="Couverts gris en tas, un seul couvert bleu"></div>')
un('<img src="img:fenetres" alt="">',
   '<img src="img:fenetres" alt="Façade d\'immeuble la nuit, une fenêtre éclairée en bleu parmi des dizaines de fenêtres jaunes" style="object-position:38% 50%">')
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:parc-voitures" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-gourde" alt="Gourdes grises alignées, une seule gourde bleue"></div>')
un('<div class="avatars"><img src="img:anaelle" alt=""><img src="img:naomie" alt=""><img src="img:thezi" alt=""></div>',
   '<div class="avatars"><img src="img:anaelle" alt="Anaëlle Guez"><img src="img:naomie" alt="Naomie Halioua"><img src="img:thezi" alt="Thezi Mabuza"></div>')
un('<img src="img:philippine" alt="">', '<img src="img:philippine" alt="Philippine Tamic">')
un('<img class="portrait" src="img:anaelle" alt="">',
   '<img class="portrait" src="img:anaelle" alt="Anaëlle Guez, cofondatrice de Cleo Labs">')
fs.writeFileSync(f, t)
const c = {}; for (const m of t.match(/img:[a-z0-9-]+/g)) c[m] = (c[m] || 0) + 1
console.log('05-marche : ok · doublons :', Object.entries(c).filter(([, n]) => n > 1).map(([k, n]) => k + '×' + n).join(' ') || 'aucun')
