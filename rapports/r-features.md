# Renommage des trois features, pages de feature

Portée : `pages/03-offre.html`, `pages/07-chat.html`, `pages/08-reglementation.html`.
Rien d'autre n'a été ouvert en écriture. `sortie/`, `commun/` et les autres pages sont intacts.

Correspondance appliquée : Monitoring devient Regulatory Change, Research reste Research,
Réglementation devient Compliance. Les noms de fichier et tous les `href` sont inchangés.

## Changements, un par ligne

### pages/03-offre.html

- 03-offre.html:20 `<h2 class="t-display" ...>Monitoring</h2>` -> `<h2 class="t-display" ...>Regulatory Change</h2>` (titre de la page de feature)
- 03-offre.html:48 `Ce que le Monitoring fait` -> `Ce que Regulatory Change fait` (l'article disparaît, le nom propre anglais ne le porte pas)
- 03-offre.html:77 `La Réglementation encodée, pour la rendre testable` -> `Compliance, pour la rendre testable` (renvoi à la feature)
- 03-offre.html:98 `Le Monitoring se prend seul ou avec les deux autres features.` -> `Regulatory Change se prend seul ou avec les deux autres features.`
- 03-offre.html:126 `<h3 class="t-h2" ...>Réglementation</h3>` -> `<h3 class="t-h2" ...>Compliance</h3>` (carte de renvoi « Les deux autres features »)

### pages/07-chat.html

- 07-chat.html:67 `Le Monitoring, pour savoir ce qui vient de changer` -> `Regulatory Change, pour savoir ce qui vient de changer`
- 07-chat.html:68 `La Réglementation encodée, quand la règle existe déjà` -> `Compliance, quand la règle existe déjà`
- 07-chat.html:117 `<h3 class="t-h2" ...>Réglementation</h3>` -> `<h3 class="t-h2" ...>Compliance</h3>` (carte de renvoi)

### pages/08-reglementation.html

- 08-reglementation.html:20 `<h2 class="t-display" ...>Réglementation</h2>` -> `<h2 class="t-display" ...>Compliance</h2>` (titre de la page de feature)
- 08-reglementation.html:76 `Le Monitoring, pour savoir quand une règle bouge` -> `Regulatory Change, pour savoir quand une règle bouge`
- 08-reglementation.html:98 `La Réglementation se prend seule ou avec les deux autres features.` -> `Compliance se prend seule ou avec les deux autres features.`
- 08-reglementation.html:126 `<h3 class="t-h2" ...>Réglementation</h3>` -> `<h3 class="t-h2" ...>Compliance</h3>` (carte de renvoi)

Total : 12 remplacements, tous par chaîne exacte, aucune découpe par index.

## Vérifié

- Occurrences de « Monitoring » restant dans les trois pages : 0.
- Occurrences de « Réglementation » avec majuscule restant : 1, la ligne 7 de
  `08-reglementation.html`, laissée volontairement, motif en section suivante.
- Noms communs conservés, comptés après édition : `réglementaire` 5, `réglementaires` 1,
  `réglementations` 3. Aucun n'a été touché.
- Jetons d'icône intacts, 3 par page : `ico:engrenage`, `ico:research`, `ico:reglementation`.
  Ce sont des identifiants résolus par le générateur, pas des libellés visibles.
- `href` : 3 par page, tous `href="#"`, aucun modifié. Aucun nom de fichier modifié.
- Balises `<section>` ouvrantes et fermantes : 6 et 6 sur chacune des trois pages.
  Premier ligne `<!--NAV-->` et dernière `<!--PIED-->` toujours en place sur les trois.
- Double attribut `class` sur une même balise : 0 sur les trois pages.
- Tiret cadratin, tiret demi-cadratin, `monospace` : 0 sur les trois pages.
- Aucun `font-size` ni `clamp()` ajouté, aucune classe de typo modifiée, aucune couleur touchée.
- Aucun chiffre ajouté, aucun chiffre retiré, aucun fait nouveau introduit.
- Ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs` n'ont été lancés. `sortie/` non touché.

## Laissé, et pourquoi

Occurrences jugées « nom commun » et donc conservées telles quelles :

- 03-offre.html:7 `Veille réglementaire produit.` Accroche descriptive du hero, pas le nom de la feature.
- 03-offre.html:55 `19 000 autorités réglementaires suivies`. Nom commun.
- 03-offre.html:145, 07-chat.html:136, 08-reglementation.html:145 `réglementations produits` dans la
  citation Decathlon. Verbatim d'un client, intouchable.
- 03-offre.html:167, 07-chat.html:158, 08-reglementation.html:167 `La couverture réglementaire du moteur`. Nom commun.
- 07-chat.html:7 `Recherche réglementaire.` Accroche du hero, pas le nom de la feature.
- 07-chat.html:10, 07-chat.html:39, 07-chat.html:89, 07-chat.html:107 et les mentions `Le Research`
  sur les deux autres pages : la feature Research ne change pas de nom.
- 08-reglementation.html:7 `Réglementation encodée. 2 812 règles testables.` C'est le seul arbitrage
  discutable du lot. Les trois heros des trois pages de feature sont bâtis pareil, sur une
  description en nom commun et non sur le nom du produit : « Veille réglementaire produit »
  pour Regulatory Change, « Recherche réglementaire » pour Research. Par symétrie,
  « Réglementation encodée » a été lu comme la description « la réglementation encodée »
  et non comme le libellé de la feature, qui vit à la ligne 20 juste sous l'étiquette
  « Feature 3 sur 3 ». À arbitrer si vous vouliez le nom du produit dans le hero.

## Hors périmètre, signalé

- La barre de nav et le pied sont des fragments partagés, `commun/bandeau-nav.html` lignes 16, 20, 24
  et `commun/pied.html` lignes 47 à 49. Ils portent encore « Monitoring » et « Réglementation »
  dans le méga-menu et dans la colonne de liens. Ils ne font pas partie de mes fichiers, je ne les ai
  pas ouverts en écriture. Tant qu'ils ne sont pas repris, les trois pages afficheront l'ancien nom
  dans la nav et le nouveau dans le corps. `commun/pied.html` porte aussi des titres de colonne
  « Réglementations européennes », « Réglementations nord-américaines », « Autres réglementations » :
  ce sont des noms communs, à conserver.
- Défaut de contenu préexistant, non corrigé car il demanderait d'écrire des faits que je n'ai pas :
  le bloc « Les deux autres features » est le même sur les trois pages. Sur `07-chat.html` il montre
  Research, c'est-à-dire la page elle-même, et Compliance, mais pas Regulatory Change. Sur
  `08-reglementation.html` il montre Research et Compliance, c'est-à-dire la page elle-même, mais pas
  Regulatory Change. Seule `03-offre.html` renvoie bien vers les deux autres. Remplacer la carte
  fautive réclame un descriptif et trois pilules pour Regulatory Change que je n'ai pas de source
  pour écrire. À vous de me donner la copie, ou l'autorisation de reprendre celle du méga-menu.
- Rappel de la règle maison PLAN.md avant édition d'un fichier existant : elle n'a pas pu être
  appliquée ici, aucune validation humaine n'étant joignable depuis un agent de workflow. Les douze
  remplacements sont listés ci-dessus pour relecture a posteriori.
