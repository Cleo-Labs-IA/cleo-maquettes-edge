# morpho.org, lentille « échelle typographique et mesure de lecture »

Relevé du 27/08/2026. Chromium 1440 × 900, `deviceScaleFactor` 1, valeurs
issues de `getComputedStyle` et de `Range.getClientRects()`, jamais du CSS
déclaré. Scripts et données brutes :
`/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-morpho/lentille-typo/`
(`measure.mjs`, `geo.mjs`, `gap.mjs`, `gapm.mjs`, `poids.mjs`, `xheight.mjs`,
sorties `morpho.json`, `nous-clair.json`, `nous-noir.json`).

Sources mesurées :
`https://morpho.org/` (HTTP 200, `networkidle` + défilement par paliers de
600 px sur 7 568 px, puis 1 s de repos) ·
`file:///Users/naomiehalioua/cleo-maquettes-edge/sortie/01-accueil.html` ·
`file:///Users/naomiehalioua/cleo-maquettes-edge/sortie/01-accueil-noir.html`.

Le bloc de code de morpho (1 481 nœuds, 20 061 signes en `monospace` 13 px,
soit 94,1 % des signes de la page) est exclu de l'échelle de prose. Tous les
pourcentages « morpho » ci-dessous portent donc sur 1 261 signes non
monospacés, contre 5 182 signes chez nous.

---

## 1. Tableau d'écart

### 1.1 L'échelle rendue

| dimension | morpho.org | nous (01-accueil) | écart |
|---|---|---|---|
| tailles distinctes rendues | 4 | 13 | +9 |
| paires taille + graisse distinctes | 4 | 25 | +21 |
| triples taille + graisse + couleur | 8 | 49 | +41 |
| graisses distinctes | 2 (300, 400) | 5 (400, 450, 500, 600, 700) | +3 |
| interlignes calculés distincts | 3 (1,10 / 1,20 / 1,60) | 12 | +9 |
| valeurs d'approche distinctes | 1 (0,000 em, 100 % du texte) | 8 | +7 |
| plus petite taille de la page | 16 px | 9 px | −7 px |
| plus grande taille de la page | 60 px | 46,08 px | −13,92 px |
| part du texte sous 16 px | 0,0 % | 68,6 % | +68,6 pt |
| part du texte sous 14 px | 0,0 % | 22,2 % | +22,2 pt |
| échelons successifs | 1,88 / 1,60 / 1,25 | 1,45 / 1,32 / 1,33 / 1,06 / 1,06 / 1,07 / 1,07 / 1,08 / 1,08 / 1,09 / 1,10 / 1,11 | 8 échelons sous 1,12 |

Les 13 tailles rendues chez nous : 46,08 · 31,68 · 24 · 18 · 17 · 16 · 15 · 14 ·
13 · 12 · 11 · 10 · 9 px. Dix d'entre elles tiennent dans une bande de 9 px
(18 → 9) et portent 87,7 % du texte. Chez morpho, l'équivalent (16 et 20 px)
porte 87,1 % du texte en 2 niveaux.

### 1.2 Le hero et le plus grand titre

| dimension | morpho.org | nous (clair et noir) | écart |
|---|---|---|---|
| balise du hero | `h1.…sphere…__title` | `h1.t-hero` | |
| taille du hero | 32 px | 46,08 px | +14,08 px (+44,0 %) |
| hero en % de la largeur de fenêtre | 2,22 % de 1440 | 3,20 % de 1440 | +0,98 pt |
| graisse du hero | 300 | 400 | +100 |
| interligne du hero | 1,20 (38,4 px) | 1,22 (56,22 px) | +0,02 |
| approche du hero | 0,000 em | −0,018 em | −0,018 em |
| hauteur d'œil du hero (x-height) | 16,30 px | 22,31 px | +36,9 % |
| hauteur de capitale du hero | 23,05 px | 33,01 px | +43,2 % |
| largeur de la ligne de titre rendue | 743 px (51,6 % de 1440) | 800 px (55,6 % de 1440) | +57 px |
| lignes du hero | 1 (48 signes) | 1 (38 signes) | −10 signes |
| plus grand titre de la page | 60 px / w300 / lh 1,10 / 640 px | 46,08 px / w400 / lh 1,22 / 900 px | −13,92 px |
| où il se trouve | bloc de fin (top 6 439 / 7 568) | hero (top 181 / 8 845) | inversion |
| rapport plus grand titre / corps | 60 / 16 = 3,75 | 46,08 / 15 = 3,07 | −0,68 |
| rapport hero / corps | 32 / 16 = 2,00 | 46,08 / 15 = 3,07 | +1,07 |
| hauteur du bloc hero | 820 px (91,1 % de 900) | 954 px (106,0 % de 900) | +134 px |

Leur plus gros caractère n'est pas dans le hero. Le hero est à 32 px, le bloc
de fin (« Unlock the potential… ») à 60 px. Chez nous le hero est le maximum
absolu de la page, et rien après ne le dépasse.

### 1.3 Le corps et la mesure de lecture

| dimension | morpho.org | nous | écart |
|---|---|---|---|
| taille du corps courant | 16 px (52,4 % du texte) | 15 px (21,0 %) et 14 px (25,4 %) | −1 à −2 px |
| interligne du corps (calculé) | 1,600 (25,6 px) | 1,720 (25,8 px) pour `.t-body`, 1,700 (23,8 px) pour `.t-sm` | +0,12 |
| approche du corps | 0,000 em | 0,000 em | 0 |
| hauteur d'œil du corps | 8,15 px | 7,26 px | −10,9 % |
| équivalent Satoshi de leur corps | 16 px FK Grotesk | 16,83 px Satoshi | leur corps « lit » comme du 16,8 chez nous |
| mesure médiane rendue | 480 px | 481 px | +1 px |
| mesure médiane en em | 24,0 em | 30,1 em | +6,1 em (+25 %) |
| mesure maximale en em | 24,0 em | 36,4 em | +12,4 em (+52 %) |
| signes par ligne, médiane | 50,0 | 59,5 | +9,5 |
| signes par ligne, maximum | 50,0 | 73,5 (`p.t-lead`, 593 px) | +23,5 |
| plus long bloc de prose | 105 signes | 595 signes (`blockquote.citation`) | ×5,7 |
| plus long paragraphe (`<p>`) | 105 signes | 246 signes | ×2,3 |
| total prose non monospacée | 1 261 signes | 5 182 signes | ×4,1 |
| hauteur de page | 7 568 px | 8 845 px | +1 277 px |
| densité, signes par 1 000 px de page | 167 | 586 | ×3,5 |

Point important : nos boîtes de mesure ne sont pas plus larges que les leurs
(480 px contre 481 px de médiane). L'écart de signes par ligne vient de la
taille de corps (15 contre 16) et surtout de la longueur des textes. Leur
chapô de section fait 78 signes et casse à 39 signes par ligne sur 528 px ;
le nôtre fait 147 signes et remplit 593 px sur 2 lignes.

### 1.4 Les jetons déclarés et ce qui rend

| jeton | déclaré (brief) | déclaré (CSS 01-accueil) | rendu à 1440 | usage sur 01-accueil | usage sur les 24 gabarits |
|---|---|---|---|---|---|
| `.t-hero` | 49 | `clamp(2.125rem, 3.4vw, 3.125rem)` w400 → 48,96 | **46,08** w400 | 1 | 9 (9 fichiers) |
| `.t-display` | 32 | `clamp(1.5rem, 2.2vw, 2rem)` w400 → 31,68 | 31,68 w400 | 8 | 82 (24 fichiers) |
| `.t-h1` | 24 | `clamp(1.25rem, 1.7vw, 1.5rem)` w400 → 24 | 24 w400 | 6 | 64 (20 fichiers) |
| `.t-h2` | 18 | `1.125rem` w500 → 18 | **jamais rendu** | 0 | 53 (11 fichiers) |
| `.t-h3` | 16 | `1rem` w500 → 16 | 16 w500 | 3 | 9 (3 fichiers) |
| `.t-body` | 15 | `0.9375rem` w400 lh 1,72 → 15 | 15 w400 | 16 | 114 (25 fichiers) |
| `.t-caption` | 12 | `0.8125rem` (13) puis surchargé `0.75rem` l. 916 | 12 w400 | 11 | 164 (19 fichiers) |
| `.t-label` | 10 | `0.6875rem` (11) puis surchargé `0.625rem` l. 917 | 10 w600 ls 0,130 em | 3 | 49 (25 fichiers) |

Le hero rend 46,08 px et non 48,96, parce que `.hero-epure .t-hero`
(ligne 930, spécificité 0-2-0) écrase la déclaration de jeton
(spécificité 0-1-0) avec `clamp(2rem, 3.2vw, 3rem)`, soit 3,2 vw = 46,08 px
à 1440. Le jeton « 49 » n'existe nulle part sur la page d'accueil.

Sept tailles rendues sur 01-accueil ne viennent d'aucun jeton :
17 px (`blockquote.citation`), 16 px w600 (`div.t-body-lg`), 14 px
(`.t-sm`, `.btn`, `.fiche-nom`, `h4`), 13 px (`.t-micro`,
`.nav-declencheur` w450, `.pilule`), 11 px (`.marqueur` w700 ls 0,040 em,
`.surtitre` w600 ls 0,150 em, `.cf-question`), 10 px (`.fil-ariane`,
`.cf-etape`, `.cf-cite`), 9 px (`span.cf-ref` w700).

### 1.5 Le régime sombre a sa propre échelle

Mesure des deux fichiers nœud par nœud : **137 nœuds sur 160 ont une
typographie identique, 23 diffèrent.**

| jeton | 01-accueil.html | 01-accueil-noir.html | écart |
|---|---|---|---|
| `.t-hero` déclaré | `clamp(2rem, 3.2vw, 3rem)` w400 | `clamp(2.25rem, 4.4vw, 3.75rem)` w300 lh 1,12 (l. 1079) | 60 px visé |
| `.t-hero` **rendu** | 46,08 w400 lh 1,22 ls −0,018 | **46,08 w400 lh 1,22 ls −0,018** | **0** |
| `.t-display` rendu | 31,68 w400 ls −0,010 | 40,00 w300 ls −0,012 | +8,32 px, −100 de graisse |
| `.t-h1` rendu | 24 w400 ls −0,010 | 26 w400 ls −0,008 | +2 px |
| `.t-h2/.t-h3/.t-h4` rendu | 16 w500 | 16 w450 | −50 de graisse |
| graisses rendues | 400, 450, 500, 600, 700 | 300, 400, 450, 500, 600, 700 | +1 |
| plus grande taille rendue | 46,08 px | 46,08 px | 0 |

La surcharge `.t-hero` du fichier noir (ligne 1079, précédée du commentaire
« La retenue de Morpho : titre en 300-400 ») **ne s'applique jamais** :
`.hero-epure .t-hero` (ligne 930, 0-2-0) l'emporte sur `.t-hero` (0-1-0)
quel que soit l'ordre. Le hero noir devait faire 60 px en graisse 300 ; il
rend 46,08 px en graisse 400, au pixel près comme le clair. La passe morpho
a atterri sur `.t-display`, `.t-h1` et `.t-h2/h3/h4` ; elle a manqué le seul
titre que le visiteur voit en premier.

### 1.6 Le blanc entre le titre et le texte

Écart rendu entre le bas de la boîte du titre et le haut de la boîte du
texte qui suit, tous les cas de chaque page.

| morpho.org | nous (01-accueil) |
|---|---|
| 0 · 0 · 0 · 8 · 8 · 8 · 12 · 20 · 24 · 24 · 40 px | 18 · 18 · 18 · 18 · 22 · 26 · 28 · 38 · 38 px |
| 6 valeurs, **toutes multiples de 4** | 5 valeurs, **une seule multiple de 4** (28) |
| titre 32 px → texte : 24 px = 0,75 em de titre = 1,50 × corps | titre 31,68 px → texte : 18 / 22 / 28 / 38 px = 0,57 / 0,69 / 0,88 / 1,20 em de titre |
| titre 20 px → texte : 8 px = 0,40 em, constant sur 3 occurrences | titre 24 px → texte : non uniforme |
| hero 32 px → chapô : 24 px = 0,75 em | hero 46,08 px → chapô : 26 px = 0,56 em |

Le même couple `.t-display` + chapô produit 18 px dans un cas et 38 px dans
un autre sur la même page.

### 1.7 La hiérarchie sans changer de taille

Chez morpho, le titre de panneau et sa description sont **à la même taille et
à la même graisse** ; seule la couleur les sépare.

| bloc | titre | description |
|---|---|---|
| morpho, panneau « Embed custom earn products » | 20 px w400 `rgb(255,255,255)` | 20 px w400 `rgb(156,157,159)` |
| nous, carte « Une dépendance permanente » | 24 px w400 `rgb(10,10,10)` | 14 px w400 `rgba(0,0,0,0.62)` |
| rapport titre / description | **1,00** | **1,71** |

Leurs 8 triples taille+graisse+couleur au complet :
16/400/blanc-50 % (504 signes) · 20/400/#9C9D9F (283) · 20/400/blanc (153) ·
32/300/blanc (123) · 16/400/blanc (99) · 16/400/#9C9D9F (58) ·
60/300/blanc (39) · 20/400/blanc-50 % (2). Nous en avons 49.

### 1.8 Les deux fontes, mesurées

| métrique, à 100 px | FK Grotesk (morpho) | Satoshi (nous) | écart |
|---|---|---|---|
| hauteur d'œil, w400 | 50,93 | 48,42 | −4,9 % |
| hauteur de capitale, w400 | 72,02 | 71,63 | −0,5 % |
| ascendante (`d`) | 72,02 | 72,87 | +1,2 % |
| descendante (`p`) | 20,02 | 21,08 | +5,3 % |
| chasse du `H`, w400 | 73,19 | 70,48 | −3,7 % |
| hauteur d'œil, w300 | 50,39 | 48,00 | −4,7 % |

Satoshi est déclarée `font-weight:300 900` et le 300 est un vrai maître :
la même chaîne à 100 px mesure 1 790,00 px en w300 et 1 842,53 px en w400,
soit 2,9 % d'écart de chasse. Les valeurs 100 et 200 rendent exactement
1 790,00 px, donc l'axe est borné à 300 vers le bas. Aucune graisse n'est
synthétisée entre 300 et 900 : les paliers 400 → 450 → 500 → 600 → 700
donnent +28,77 / +28,75 / +32,51 / +32,52 px, tous distincts.

Conséquence : comparer nos 15 px à leurs 16 px sous-estime l'écart. À taille
égale leur fonte porte 4,9 % de hauteur d'œil en plus, donc leur corps de
16 px lit comme du 16,83 px en Satoshi, soit 12,2 % de plus que nos 15 px.

---

## 2. Les trois changements qui feraient le plus de différence

### 2.1 Réparer le hero du régime sombre, qui ne rend pas ce qu'il déclare

**La mesure.** Le fichier noir déclare `.t-hero{font-weight:300;
line-height:1.12; font-size:clamp(2.25rem, 4.4vw, 3.75rem)}` (ligne 1079),
soit 60 px en graisse 300 à 1440. Il rend **46,08 px en graisse 400,
interligne 1,22, approche −0,018 em**, identique au pixel au fichier clair,
parce que `.hero-epure .t-hero` (ligne 930, spécificité 0-2-0) gagne contre
`.t-hero` (0-1-0). Les trois autres surcharges de la même passe atterrissent
bien : `.t-display` rend 40 px w300 au lieu de 31,68 w400, `.t-h1` rend 26 au
lieu de 24, `.t-h2/h3/h4` rend w450 au lieu de w500. Résultat mesuré : dans
le régime sombre, `.t-display` (40 px) est plus lourd visuellement que le
hero (46,08 px w400) ne le mérite, et le rapport hero / display tombe de
1,45 (clair) à 1,15 (noir). À 1,15 les deux niveaux se confondent.

**Coût.** Un sélecteur, dans les fichiers qui portent à la fois `.hero-epure`
et la surcharge de régime. Sur les 24 gabarits, `.t-hero` apparaît dans 9
fichiers ; il faut vérifier lesquels ont aussi `.hero-epure`. Le CSS étant
inliné par fichier, l'édition est mécanique mais répétée. La correction est
soit de monter la spécificité de la surcharge noire à `.hero-epure .t-hero`,
soit de retirer `font-size`/`font-weight` de `.hero-epure .t-hero` pour
laisser le jeton parler.

**Ce que ça casse.** Le hero passerait de 46,08 à 60 px, soit +30 %, et de
w400 à w300. Sur le champ #0F0E0D mesuré, un blanc en graisse 300 à 60 px
change le poids optique de tout le premier écran ; il faut ré-ouvrir la page
et regarder. La ligne « Vendez partout. Conformez-vous partout. » fait
38 signes et rend 800 px de large à 46,08 px ; à 60 px elle ferait 1 042 px,
donc elle tient encore sur une ligne dans le conteneur de 1120, avec 78 px
de marge. Le bloc hero grandirait d'environ 18 px seulement (une ligne de
56,22 px devient une ligne de 67,20 px). Et 60 px dépasse le jeton
`.t-hero` fixé à 49 : c'est un arbitrage, pas une correction.

### 2.2 Remonter le plancher typographique de 9 px à 12 px

**La mesure.** La plus petite taille rendue sur toute leur page, sur 7 568 px
de hauteur, est **16 px**. Chez nous, sur 8 845 px, c'est **9 px**
(`span.cf-ref`, « Art. 6 §4 · extrait vérifié », graisse 700).
**68,6 % de nos signes sont sous leur plancher, 22,2 % sous 14 px.**
La répartition sous 14 px : 13 px → 7,2 % · 12 px → 7,7 % · 11 px → 2,7 % ·
10 px → 4,0 % · 9 px → 0,5 %. À 9 px, la hauteur d'œil Satoshi vaut 4,36 px.
Les échelons de cette bande sont 1,08 / 1,08 / 1,09 / 1,10 / 1,11 : aucun
n'est perceptible, donc les cinq niveaux ne portent aucune information de
hiérarchie, seulement de l'encombrement.

**Coût.** Le plancher n'est pas dans les jetons : `.t-label` rend déjà 10 px
et `.t-caption` 12 px. Les tailles à reprendre sont hors jetons :
`.cf-ref` (9), `.fil-ariane` / `.cf-etape` / `.cf-cite` (10), `.marqueur` /
`.surtitre` / `.cf-question` (11). Six à sept déclarations, dans le bloc CSS
inliné de chacun des 24 gabarits. Aucune modification de balisage.
Vérification : re-mesurer et exiger `min(fontSize) >= 12` et
`part du texte sous 12 px = 0 %`.

**Ce que ça casse.** `.cf-etape` et `.cf-cite` vivent dans le bloc
d'animation du hero, dont la hauteur est calée ; passer de 10 à 12 px ajoute
environ 20 % de hauteur de ligne à trois lignes. `.marqueur` à 11 px w700
en capitales avec 0,040 em d'approche est la pastille « DONNÉE MANQUANTE »
de la fiche produit : à 12 px la pastille s'élargit d'environ 9 %, et la
fiche mesure 340 px de large dans la colonne droite. `.surtitre` à 11 px w600
avec 0,150 em porte 5 occurrences sur l'accueil et 49 sur les gabarits.
Enfin, `.t-label` à 10 px est un jeton de la DA : le remonter est un
arbitrage, pas une correction.

### 2.3 Faire tomber le nombre de niveaux, en séparant par la couleur plutôt que par la taille

**La mesure.** Ils rendent **4 tailles, 4 paires taille+graisse, 8 triples
taille+graisse+couleur** pour 1 261 signes. Nous rendons **13 tailles,
25 paires, 49 triples** pour 5 182 signes, soit 6,1 fois plus de
combinaisons pour 4,1 fois plus de texte. Le mécanisme qui leur permet de
tenir à 4 tailles est mesurable : dans le panneau « Embed custom earn
products », le titre et la description sont **tous deux à 20 px, graisse 400** ;
seule la couleur change, `rgb(255,255,255)` contre `rgb(156,157,159)`. Notre
carte équivalente utilise 24 px pour le titre et 14 px pour le corps de
liste, rapport 1,71. Quatre niveaux de notre échelle rendue ne portent
presque rien : 46,08 px → 0,7 % du texte, 16 px → 2,1 %, 9 px → 0,5 %,
11 px → 2,7 %.

**Coût.** Aucun jeton à changer, c'est l'usage. Supprimer les quatre tailles
hors jetons les moins portantes, 17 px (`blockquote.citation`, une
occurrence), 16 px w600 (`div.t-body-lg`, une occurrence), 11 px
(`.cf-question`) et 9 px (`.cf-ref`), en les rabattant sur 15 et 12 : quatre
règles dans le CSS inliné de chaque gabarit, zéro balisage. Cible
vérifiable : `n_tailles <= 8`, `n_paires <= 12`, `n_triples <= 20`.

**Ce que ça casse.** `blockquote.citation` à 17 px sur 493 px rend
aujourd'hui 10 lignes de 59,5 signes ; à 15 px la mesure passe à 32,9 em et
le bloc tombe à 9 lignes, soit 232 px au lieu de 275, ce qui remonte de
43 px tout ce qui suit dans la section témoignage. `.t-body-lg` 16 px w600 porte l'accroche du formulaire
d'inscription (« Les évolutions réglementaires de vos produits, dans votre
boîte », 69 signes) ; à 15 px w500 elle perd sa distinction d'avec le
`.t-body` voisin, et il faut la reprendre par la couleur. `.cf-ref` à 9 px
w700 est la mention de source de l'animation (« Art. 6 §4 · extrait
vérifié ») : à 12 px elle occupe 33 % de largeur en plus dans un cadre
d'animation contraint.

---

## 3. Arbitrages pour Naomie, à trancher avant toute édition

Chacun de ces points touche un jeton de la DA. Je les signale, je ne les
décide pas.

1. **`.t-hero` : 49, 46,08 ou 60 ?** Le jeton dit 49, le CSS de base calcule
   48,96, le rendu donne 46,08 (surcharge `.hero-epure`), et le fichier noir
   vise 60 sans y arriver. Trois intentions coexistent dans le même fichier.
2. **`.t-caption` 12 et `.t-label` 10 sont déclarés deux fois.** Les
   déclarations de jeton disent 13 et 11 (lignes 145-146), les surcharges
   des lignes 916-917 disent 12 et 10, et l'approche de `.t-label` passe de
   0,150 à 0,130 em. Le rendu suit la seconde. Une des deux échelles est
   morte, il faut dire laquelle.
3. **Le corps à 15 ou 16 px.** Leur corps de 16 px en FK Grotesk lit comme du
   16,83 px en Satoshi, 12,2 % de plus que nos 15. `.t-body` est un jeton.
4. **La graisse des titres.** Le brief dit « nous sommes à 400 partout » ;
   la mesure dit que nos **titres** sont à 400 et que ce sont nos **petits
   textes** qui portent 5 graisses (450, 500, 600, 700 sur 15,5 % des
   signes). Morpho fait exactement l'inverse : titres plus légers que le
   corps (300 contre 400) et zéro variation dans le petit texte. Satoshi a un
   vrai 300, mesuré. Inverser cette logique est une décision de DA.
5. **`.t-h2` n'est jamais rendu sur l'accueil** (0 occurrence dans le
   balisage) mais existe sur 11 des 24 gabarits avec 53 occurrences. Jeton à
   garder ou à retirer de l'échelle des huit.
6. **Le blanc titre → texte n'est sur aucune grille.** Nos 9 écarts prennent
   les valeurs 18, 22, 26, 28, 38 px ; une seule est multiple de 4. Les 11
   leurs prennent 0, 8, 12, 20, 24, 40, toutes multiples de 4. Poser un pas
   de 4 px touche le rythme vertical, pas seulement la typographie.
7. **Le monospace.** 94,1 % des signes de leur page (20 061 sur 21 322) sont
   en `monospace` 13 px, dans le bloc de code produit. Notre DA dit « zéro
   monospace ». Si une surface « texte de loi » doit un jour lire comme de la
   source, la règle actuelle ferme cette porte. C'est un constat, pas une
   proposition.

---

## 4. Ce que j'ai essayé de mesurer et n'ai pas réussi

1. **Leurs jetons déclarés.** Leur CSS est servi en CSS Modules avec des noms
   hachés (`HomeV2Page_sphere-module-scss-module__QNyG0a__title`). Je n'ai
   mesuré que les valeurs **calculées**. Je peux donc affirmer qu'ils
   **rendent** 4 niveaux ; je ne peux pas dire combien ils en **déclarent**.
   La comparaison « 8 déclarés chez nous contre 4 chez eux » n'est pas
   valide ; la comparaison « 13 rendus contre 4 rendus » l'est.
2. **Un axe optique dans FK Grotesk.** Leur approche est à 0,000 em sur
   100 % du texte, y compris à 60 px, là où nous descendons à −0,030 em. Je
   n'ai pas interrogé `font-variation-settings` ni les tables de la fonte,
   donc je ne sais pas si un axe `opsz` compense pour eux ce que nous faisons
   à la main. Sans cette mesure je ne peux pas dire si notre approche
   négative est un choix ou une compensation.
3. **Les autres largeurs.** Tout est relevé à 1440 × 900 uniquement. Trois de
   nos huit jetons sont en `clamp()` avec une composante `vw` ; leur
   comportement à 768 ou 1920 n'est pas mesuré, et l'écart de hero
   (46,08 contre 32) peut s'inverser à une autre largeur.
4. **Les 22 autres gabarits au rendu.** Seuls `01-accueil.html` et
   `01-accueil-noir.html` ont été ouverts dans le navigateur. Les comptages
   du tableau 1.4 colonne « 24 gabarits » viennent d'un `grep` sur le
   balisage, pas d'une mesure de rendu ; ils disent où une classe est écrite,
   pas ce qu'elle produit une fois les surcharges appliquées. Vu ce que la
   section 1.5 montre sur `.t-hero`, l'écart peut être important.
5. **`01-accueil-en.html`.** Non mesuré. Tous mes chiffres de signes par
   ligne sont français ; l'anglais est en général 15 à 20 % plus court à sens
   égal, donc la comparaison de mesure avec un site anglophone m'est
   défavorable d'un montant que je n'ai pas quantifié.
6. **Les états intermédiaires de leur hero.** Leur `h1` est révélé mot par
   mot (chaque mot dans son propre `span`). J'ai mesuré l'état stabilisé
   après `networkidle`, défilement complet et 4 s de repos ; toute échelle ou
   approche transitoire pendant la révélation n'est pas relevée.
7. **Le contraste.** Hors lentille, non mesuré. La section 2.1 propose du
   blanc en graisse 300 à 60 px sur champ #0F0E0D sans que j'aie de chiffre
   de lisibilité pour l'appuyer.
