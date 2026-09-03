/* Lane B — 03/09/2026. Restructure le bloc « Ce que X fait » des trois pages
   feature : cinq groupes indépendants dans une grille qui s'aligne par rangée,
   la note « Bon à savoir » en dernière cellule, des vrais niveaux de titre.
   Chaque remplacement est vérifié : le script s'arrête si un ancrage manque. */
import fs from 'fs'
const P = '/Users/naomiehalioua/cleo-maquettes-edge/pages/'
let echecs = 0

function rempl(src, avant, apres, attendu, nom, fichier) {
  const n = src.split(avant).length - 1
  if (n !== attendu) { console.log(`  ✗ ${fichier} · ${nom} : ${n} occurrence(s), ${attendu} attendue(s)`); echecs++; return src }
  console.log(`  ✓ ${fichier} · ${nom} (${n})`)
  return src.split(avant).join(apres)
}
function remplRe(src, re, fn, attendu, nom, fichier) {
  const n = (src.match(re) || []).length
  if (n !== attendu) { console.log(`  ✗ ${fichier} · ${nom} : ${n} occurrence(s), ${attendu} attendue(s)`); echecs++; return src }
  console.log(`  ✓ ${fichier} · ${nom} (${n})`)
  return src.replace(re, fn)
}

for (const fichier of ['03-offre.html', '07-chat.html', '08-reglementation.html']) {
  let s = fs.readFileSync(P + fichier, 'utf8')

  // 1. Les intertitres du bloc deviennent de vrais h3 (ils étaient des div :
  //    invisibles pour le plan de la page).
  s = remplRe(s, /<div class="t-h2" style="margin-bottom:18px">([^<]*)<\/div>/g,
    (m, t) => `<h3 class="t-h2">${t}</h3>`, 5, 'intertitres div -> h3', fichier)

  // 2. Le titre de bloc passe en h2 au cran des autres titres de section
  //    (il était en h3 à 24 px, sous un h2 à 32 px : le plan sautait un cran).
  s = remplRe(s, /<h3 class="t-h1" style="margin-bottom:40px">([^<]*)<\/h3>/g,
    (m, t) => `<h2 class="t-display" style="margin-bottom:40px">${t}</h2>`, 1, 'titre de bloc h3 -> h2', fichier)

  // 3. Les deux colonnes deviennent cinq blocs autonomes dans une grille.
  s = rempl(s, '<div class="g2" data-anim-groupe style="gap:56px">',
               '<div class="bf-faits" data-anim-groupe>', 1, 'grille des faits', fichier)
  s = rempl(s, '      <div>\n        <h3 class="t-h2">',
               '      <div class="bf-bloc">\n        <h3 class="t-h2">', 2, 'ouverture des colonnes', fichier)
  s = rempl(s, '        </ul>\n\n        <h3 class="t-h2">',
               '        </ul>\n      </div>\n\n      <div class="bf-bloc">\n        <h3 class="t-h2">', 3, 'coupe des groupes', fichier)

  // 4. La note ferme la grille au lieu de flotter seule à gauche
  //    (460 px de note dans 1040 px de large = 580 px de vide, mesuré le 03/09).
  s = rempl(s,
    '      </div>\n    </div>\n\n    <!-- Encart bordé, leur bloc « Did you know? » -->\n' +
    '    <div style="margin-top:44px;max-width:460px;border:1px solid var(--accent);border-radius:var(--r-md);padding:18px;display:flex;gap:14px;align-items:flex-start">\n' +
    '      <span style="width:32px;height:32px;border-radius:50%;background:var(--accent);display:grid;place-items:center;flex:none">ico:engrenage</span>',
    '      </div>\n\n      <div class="bf-note">\n' +
    '        <span class="bf-note-ico">ico:engrenage</span>',
    1, 'note en dernière cellule', fichier)
  s = rempl(s, '</div>\n    </div>\n\n    <!-- Carte tarif -->',
               '</div>\n      </div>\n    </div>\n\n    <!-- Carte d\'appel -->',
            1, 'fermeture de la grille + commentaire servi', fichier)

  // 5. La mesure de lecture du chapô : 820 px mesurés, au-delà de la mesure.
  s = rempl(s, '<div style="max-width:820px">', '<div class="bf-intro">', 1, 'mesure du chapô', fichier)

  // 6. La carte d'appel : son unique ligne courait sur 690 px.
  s = rempl(s, '<div class="carte-encre p48 centre" style="margin-top:44px">\n      <div class="t-sm" style="margin-bottom:22px">',
               '<div class="carte-encre p48 centre bf-appel" style="margin-top:56px">\n      <div class="t-sm bf-appel-txt">',
            1, 'carte d\'appel', fichier)

  fs.writeFileSync(P + fichier, s)
}

// 7. La scène qui porte un titre : h3 sous un h1, sans h2 entre les deux.
for (const fichier of ['03-offre.html', '08-reglementation.html']) {
  let s = fs.readFileSync(P + fichier, 'utf8')
  s = remplRe(s, /<h3 class="t-h1">([^<]*)<\/h3>/g, (m, t) => `<h2 class="t-h1">${t}</h2>`, 1, 'titre de scène h3 -> h2', fichier)
  fs.writeFileSync(P + fichier, s)
}

console.log(echecs ? `\n${echecs} ancrage(s) manquant(s)` : '\nTous les ancrages trouvés')
process.exit(echecs ? 1 : 0)
