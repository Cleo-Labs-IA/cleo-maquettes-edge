import fs from 'fs'
const f = 'pages/09-texte.html'
let t = fs.readFileSync(f, 'utf8')
const un = (a, b) => { const n = t.split(a).length - 1; if (n !== 1) throw new Error(`« ${a.slice(0, 70)} » ×${n}`); t = t.replace(a, b) }
t = t.replace(/<section class="/g, '<section class="seg ')
un('<section class="seg section" style="padding:var(--s-64) 0 0">',
   '<section class="seg section" style="padding:var(--s-64) 0 var(--pad-section-courte)">')
// Les photographies parlent d'emballage, sujet de la page
un('<img class="fond" src="img:pneus" alt="">',
   '<img class="fond" src="img:masse-capsule" alt="Capsules grises en vrac, une seule capsule bleue">')
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:parc-voitures" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-tasse" alt="Tasses grises empilées, une seule tasse bleue"></div>')
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:echangeur" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-shampooing" alt="Flacons de shampooing gris alignés, un seul flacon bleu"></div>')
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:briques" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:masse-savon" alt="Savons gris rangés côte à côte, un seul savon bleu"></div>')
un('<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:fenetres" alt=""></div>',
   '<div class="scene" data-anim="grandit" style="aspect-ratio:4/3"><img class="fond" src="img:fenetres" alt="Façade d\'immeuble la nuit, une fenêtre éclairée en bleu parmi des dizaines de fenêtres jaunes"></div>')
un('<div class="avatars"><img src="img:anaelle" alt=""><img src="img:naomie" alt=""><img src="img:darcial" alt=""></div>',
   '<div class="avatars"><img src="img:anaelle" alt="Anaëlle Guez"><img src="img:naomie" alt="Naomie Halioua"><img src="img:darcial" alt="Darcial Mondjo"></div>')
un('<img src="img:philippine" alt="">', '<img src="img:philippine" alt="Philippine Tamic">')
un('<img class="portrait" src="img:anaelle" alt="">',
   '<img class="portrait" src="img:anaelle" alt="Anaëlle Guez, cofondatrice de Cleo Labs">')
// La grille de references : la masse des textes suivis, et celui qui decide ici
un('<!-- ═══ TÉMOIGNAGE + CTA ═══ -->',
`<!-- ═══ LA GRILLE DE RÉFÉRENCES ═══ la masse des textes suivis, et le seul
     qui décide sur un emballage mis sur le marché européen. -->
<section class="seg section-serree sur-clair-fond">
  <div class="conteneur">
    <div class="entete-section" data-anim="monte" style="margin-bottom:32px">
      <h2 class="t-display" style="max-width:640px">Un corpus entier, un seul texte qui décide ici</h2>
      <p class="t-body" style="max-width:600px">
        Cleo suit la réglementation produit de 106 pays. Sur un emballage mis sur le marché
        européen, celui qui tranche est le règlement (UE) 2025/40.
      </p>
    </div>
    <!--MASSE-REFS-->
  </div>
</section>

<!-- ═══ TÉMOIGNAGE + CTA ═══ -->`)
fs.writeFileSync(f, t)
const c = {}; for (const m of t.match(/img:[a-z0-9-]+/g)) c[m] = (c[m] || 0) + 1
console.log('09-texte : ok · doublons :', Object.entries(c).filter(([, n]) => n > 1).map(([k, n]) => k + '×' + n).join(' ') || 'aucun')
