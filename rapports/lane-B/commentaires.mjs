/* Lane B — 03/09/2026. Les commentaires HTML sont SERVIS au visiteur (vérifié :
   « Carte tarif » se retrouvait tel quel dans sortie/03-offre.html). On retire
   de mes cinq pages les notes de chantier, les renvois au site relevé et les
   noms d'infrastructure ; on garde les repères de structure. */
import fs from 'fs'
const P = '/Users/naomiehalioua/cleo-maquettes-edge/pages/'
let echecs = 0
function ed(fichier, avant, apres) {
  const p = P + fichier
  const s = fs.readFileSync(p, 'utf8')
  const n = s.split(avant).length - 1
  if (n !== 1) { console.log(`  ✗ ${fichier} : ${n} occurrence(s) de ${JSON.stringify(avant.slice(0, 48))}`); echecs++; return }
  fs.writeFileSync(p, s.split(avant).join(apres))
  console.log(`  ✓ ${fichier} : ${JSON.stringify(avant.slice(0, 48))}`)
}

ed('03-offre.html',
  '<!-- ═══ HERO COURT, CENTRÉ ═══ même gabarit que Research et Compliance Data.\n     Posé le 03/09/2026 : la page était la seule sans h1. -->',
  '<!-- ═══ HERO ═══ -->')
ed('03-offre.html',
  "    <!-- L'écran produit, à la place de leur image bandeau -->\n    <!-- L'échangeur : les flux qui se croisent, et le seul qui vous concerne -->\n",
  '    <!-- ═══ CE QUI CIRCULE ═══ -->\n')
ed('07-chat.html',
  "<!-- ═══ HERO COURT, CENTRÉ ═══ pas de photo, un dégradé d'encre -->",
  '<!-- ═══ HERO ═══ -->')
ed('07-chat.html', "    <!-- L'écran produit, à la place de leur image bandeau -->\n", '')
ed('08-reglementation.html',
  "<!-- ═══ HERO COURT, CENTRÉ ═══ pas de photo, un dégradé d'encre -->",
  '<!-- ═══ HERO ═══ -->')
ed('08-reglementation.html',
  '    <!-- §18 en photographie : la masse des règles, celle qui bloque -->\n',
  "    <!-- ═══ CE QUI S'APPLIQUE ═══ -->\n")
ed('99-404.html',
  '<!-- ═══ 404 ═══ posée le 03/09/2026 : avant, Vercel servait sa page par défaut,\n     en anglais, sans barre ni pied. -->',
  '<!-- ═══ 404 ═══ -->')

console.log(echecs ? `\n${echecs} ancrage(s) manquant(s)` : '\nTous les ancrages trouvés')
process.exit(echecs ? 1 : 0)
