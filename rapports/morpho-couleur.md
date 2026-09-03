# Relevé morpho.org · lentille couleur, régimes, contraste

Relevé au navigateur (Playwright, Chromium, viewport 1440×900, deviceScaleFactor 1, défilement complet par paliers de 600 px puis retour en haut avant capture pleine page).
Fonds échantillonnés au PIXEL sur la capture pleine page (mode de couleur par ligne, sans quantification), pas sur `backgroundColor`.
Contrastes : fond relevé au pixel, encre prise sur la couleur déclarée composée avec son alpha et son opacité sur ce fond mesuré. Formule WCAG 2.1.

Pages mesurées :
- Référence : `https://morpho.org/` · HTTP 200 · hauteur 7 568 px
- Nous : `sortie/01-accueil.html` · 8 845 px · et `sortie/01-accueil-noir.html` · 9 231 px

Scripts et captures : `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-morpho/`

---

## 1. Tableau d'écart

### 1.1 Régimes et proportions

| dimension | morpho.org | nous (01-accueil) | nous-noir | écart |
|---|---|---|---|---|
| Hauteur de page à 1440 px | 7 568 px | 8 845 px | 9 231 px | +16,9 % |
| Fond identifié en bandes ≥ 25 px | 87 % de la hauteur | 91 % | 90 % | comparable |
| Part sombre (L < 0,20) | 95,8 % | 40,1 % | 100,0 % | 55,7 pts |
| Part claire (L > 0,60) | 0,0 % | 59,9 % | 0,0 % | 59,9 pts |
| Part médiane (0,20 < L < 0,60) | 4,2 % | 0,0 % | 0,0 % | 4,2 pts |
| Bascules de régime sur la page | 8, toutes vers l'accent | 5, vers des sections claires | 0 | n/a |
| Plus long bloc sombre continu | 2 568 px | 1 710 px | 8 340 px | n/a |
| Plus long bloc clair continu | 0 px | 3 516 px (39,7 % de la page) | 0 px | n/a |
| Réponse à `prefers-color-scheme` | aucune, `html` = `rgb(18,18,18)` en `light` comme en `dark` | 2 fichiers séparés | n/a | 1 régime contre 2 |
| Basculeur de thème dans le DOM | 0 élément | 0 | 0 | aucun des deux |

### 1.2 Palette réellement peinte

| dimension | morpho.org | nous (01-accueil) | nous-noir |
|---|---|---|---|
| Teintes de fond peintes (bandes ≥ 25 px) | 5 | 4 | 3 |
| Le détail | `#121212` 63,39 % · `#181818` 7,69 % · `#222529` 6,57 % · `#242424` 6,01 % · `#A1BBFF` 3,63 % | `#0F0E0D` 36,66 % · `#F9F8F6` 30,31 % · `#FFFFFF` 23,75 % · `#FDFCFB` 0,68 % | `#121212` 35,73 % · `#181818` 32,22 % · `#212121` 22,40 % |
| Valeurs `background-color` déclarées | 6 | 17 | 21 |
| Dégradés de fond déclarés | 0 | 1 (`div.voile`, 1040×520) | 1 |
| Couleurs couvrant 90 % des pixels | 3 | 6 | 3 |
| Couleurs couvrant 99 % des pixels | 23 | 292 | 273 |
| Pixels chromatiques (chroma > 40, non quasi-noirs) | 4,223 % | 0,284 % | 0,265 % |
| Amplitude de luminance des fonds | `#121212` L=0,0060 → `#A1BBFF` L=0,5034 = **9,87:1** | `#0F0E0D` → `#FFFFFF` = 19,28:1 | `#121212` → `#212121` = **1,16:1** |

Le point dur : en régime sombre, toute notre palette de fond tient dans 1,16:1 de contraste. La leur en tient 9,87:1, et c'est l'accent qui porte l'écart.

### 1.3 Où vit l'accent

| dimension | morpho.org | nous (01-accueil) | écart |
|---|---|---|---|
| Accent identifié | `#A1BBFF` (teinte 223°, saturation 0,37, L = 0,5034), aplat plat vérifié sur 7 lignes | `#0008CF` (teinte 236°, saturation 1,00, L = 0,0455) | n/a |
| Surface peinte en accent | 3,940 % de la page | 0,036 % | **×109** |
| Surface accent déclarée (géométrie DOM) | 882 336 px = 8,10 % | 4 554 px = 0,036 % | **×194** |
| Nombre de zones verticales portant l'accent | 19 | 40 | ×0,48 |
| Concentration | les 3 plus grosses zones portent **96,1 %** de l'accent | les 3 plus grosses en portent 79,1 %, et la plus grosse est une photo de pneu bleu, pas la marque | n/a |
| Plus grand objet accent | 576 × 500 px = 288 000 px | 104 × 40 px = 4 160 px | **×69** |
| Inventaire complet des porteurs | 3 champs `canvas` 576×500 / 576×508 / 576×500, plus 2 boutons `canvas` 161×44 et 151×44, plus les jetons de coloration syntaxique du bloc de code | 1 bouton 104×40, 2 filets de 2 px (hauteurs 100 et 54), 3 fragments de texte (15 px, 12 px, 9 px), 4 pastilles de 5×5 et 6×6, 1 pastille lavée 44×44 à 0,16 | 5 emplacements contre 11 |
| Largeur du conteneur mesurée au pixel | 1 152 px (x 144 → 1295) | 1 120 px | −32 px |
| Champ accent rapporté au conteneur | 576 / 1152 = **50,0 %** | 0 % | n/a |
| Type posé sur le champ accent | 0 bloc de texte | sans objet | n/a |

L'accent chez eux n'est jamais de la décoration ponctuelle : c'est la moitié gauche ou droite d'un panneau, en alternance sur trois panneaux consécutifs (y 2568, y 3148, y 3736), et il sert de support à la capture produit. Il n'y a aucun texte dessus.

### 1.4 Contraste du texte

| dimension | morpho.org | nous (01-accueil) | nous-noir |
|---|---|---|---|
| Couleurs de texte déclarées, hors coloration syntaxique | **3** | 12 | 16 |
| Paires encre/fond effectives distinctes | 7 | 11 | 15 |
| Niveaux de contraste distincts | 3 : 18,73 / 6,54 / 5,32 | 4 : 19,80 / 15,8 / 6,20 / 3,35 | 6 : 18,73 / 15,10 / 8,03 / 5,04 / 3,57 / 3,09 |
| Titres ≥ 24 px, ratio médian | 18,73:1 | 19,28:1 | 16,10:1 |
| Corps 14 à 17 px, ratio médian | 5,32:1 | 8,14:1 | 8,03:1 |
| Petit texte ≤ 13 px, ratio médian (hors bloc de code chez eux) | 9,76:1 | 6,20:1 | 6,12:1 |
| Petit texte ≤ 13 px, ratio minimum | 6,97:1 | 3,31:1 | 3,09:1 |
| Blocs sous 4,5:1 | **0 sur 320** | 25 sur 163 = 15,3 % | 22 sur 164 = 13,4 % |
| Pire ratio de la page entière | **4,93:1** | 3,31:1 | **1,48:1** |
| Couleurs de texte peintes distinctes (relevé pixel) | 13 | 98 | 98 |

Nos trois jetons fautifs, isolés :

| jeton | fond mesuré | ratio | classes touchées |
|---|---|---|---|
| `rgba(0,0,0,0.45)` | `#FFFFFF` | **3,35:1** | `.surtitre`, `.t-caption`, `.fil-ariane`, `.attenue`, `.sur-clair`, `.fiche-ref` |
| `rgba(0,0,0,0.45)` | `#F9F8F6` | **3,32:1** | `.attenue`, `.t-caption` |
| `rgba(0,0,0,0.45)` | `#F5F5F5` | **3,31:1** | `.m-manquant` |
| `rgba(255,255,255,0.38)` | `#0F0E0D` | **3,55:1** | 13 px et 10 px |
| `rgba(255,255,255,0.34)` | `#212121` | **3,09:1** | `.surtitre`, `.t-caption`, `.sur-clair` |
| `rgb(0,8,207)` | `#212121` | **1,48:1** | `.t-body` 15 px, `01-accueil-noir.html` |

Alphas qui feraient passer chaque cas à 4,5:1, calculés : noir sur `#FFFFFF` et sur `#F9F8F6` = **0,54** (aujourd'hui 0,45) ; blanc sur `#121212` = **0,45**, sur `#212121` = **0,47**, sur `#0F0E0D` = **0,45** (aujourd'hui 0,34 et 0,38).

### 1.5 Filets et définition des cartes

| dimension | morpho.org | nous (01-accueil) | nous-noir |
|---|---|---|---|
| Côtés de bordure peints | 48 | 95 | 95 |
| Combinaisons couleur × épaisseur | **3**, dont 1 transparente | 6 | 9 |
| Le filet dominant | `rgba(255,255,255,0.15)` @1px × 45 | `rgba(0,0,0,0.08)` @1px × 32 et `rgba(255,255,255,0.13)` @1px × 52 | `rgba(255,255,255,0.11)` @1px × 52 |
| Séparation carte / filet, ratio | **1,577:1** | 1,196:1 | 1,387:1 |
| Écart de définition du bord | référence | −24,2 % | −12,0 % |
| Lavis de surface déclarés | `rgba(255,255,255,0.05)` × 22, `0.10` × 6, `0.15` × 3 | `0.05` × 8, `0.06` × 4, `0.60` × 1 | `0.04` × 7, `0.05` × 8, `0.06` × 4, `0.14` × 6 |
| Élévation carte sur fond | `#181818` sur `#121212` = 1,055:1 | `#FFFFFF` sur `#F9F8F6` = 1,061:1 | `#181818` sur `#121212` = 1,055:1 |

L'élévation de carte est déjà à parité. C'est le filet qui diverge : il faudrait `rgba(0,0,0,0.195)` en clair et `rgba(255,255,255,0.165)` sur `#0F0E0D` pour atteindre leur 1,577:1.

---

## 2. Les trois changements les plus payants

### 2.1 Donner à l'accent une surface, au lieu de dix miettes

**La mesure.** Leur accent peint 3,940 % de la page, concentré à 96,1 % dans trois blocs de 576×500 px, soit exactement la moitié d'un conteneur de 1 152 px. Le nôtre peint 0,036 % réparti sur onze objets dont le plus grand fait 104×40 px. Écart de surface : 109× en peinture, 194× en géométrie déclarée. Notre plus gros objet d'accent est 69 fois plus petit que le leur. Sur `01-accueil-noir.html`, conséquence directe : l'amplitude de luminance de toute la page tient dans 1,16:1.

**Ce que ça coûte.** Une classe de champ (560×500, soit la moitié de notre conteneur de 1 120 px) posée sur trois sections produit. Fichiers touchés : `sortie/01-accueil.html`, `sortie/01-accueil-noir.html`, `sortie/00-composants.html` pour le gabarit, plus `sortie/01-accueil-en.html` pour rester aligné. Quatre fichiers. Aucune structure à déplacer : les sections concernées sont déjà en deux colonnes.

**Ce que ça casserait.** `#0008CF` ne peut pas être ce champ : encre `#0F0E0D` dessus donne 1,78:1, et le champ lui-même sur `#121212` donne 1,73:1, donc il disparaît en régime sombre. Les seules valeurs de notre palette qui tiennent en champ sont `--c-periwinkle #8A93FF` (7,07:1 avec encre `#0F0E0D`) et `--c-lavande #C7CBFF` (12,32:1). Leur `#A1BBFF` tombe entre les deux, à 10,16:1. Cela veut dire qu'en régime sombre l'accent de champ n'est pas le même jeton que l'accent de trait, ce qui est un arbitrage, pas une décision d'exécution. Deuxième effet : un aplat de 280 000 px de bleu est difficile à défendre sous la règle « le bleu n'est jamais décoratif », sauf à poser la capture produit dessus, ce qui est précisément ce qu'ils font.

### 2.2 Passer de six niveaux de texte à trois, et supprimer ceux qui tombent sous 4,5:1

**La mesure.** Hors coloration syntaxique, morpho utilise **3 couleurs de texte déclarées** et **0 bloc sur 320 ne descend sous 4,5:1** ; le pire ratio de leur page entière est 4,93:1. Nous utilisons 12 couleurs déclarées en clair et 16 en sombre, pour 6 niveaux de contraste distincts, et 25 blocs sur 163 (15,3 %) puis 22 sur 164 (13,4 %) passent sous 4,5:1. Trois jetons portent la totalité du problème : `rgba(0,0,0,0.45)` à 3,31 à 3,35:1, `rgba(255,255,255,0.38)` à 3,55:1, `rgba(255,255,255,0.34)` à 3,09:1. Les valeurs corrigées sont calculées : 0,54 / 0,45 / 0,47.

**Ce que ça coûte.** Trois valeurs d'alpha. Fichiers touchés : `sortie/01-accueil.html`, `sortie/01-accueil-noir.html`, `sortie/01-accueil-en.html`, `sortie/00-composants.html`, et le CSS source qui alimente les 22 gabarits si les mêmes jetons y vivent. Aucun déplacement, aucune nouvelle classe.

**Ce que ça casserait.** La hiérarchie de nos surtitres et légendes repose aujourd'hui sur la pâleur. En remontant `.surtitre` de 3,35:1 à 4,5:1, il arrive au même poids optique que le corps à 15 px, et la distinction devra être portée par la taille (11 px contre 15 px), la casse et l'interlettrage, pas par la couleur. À vérifier au rendu section par section, notamment sur les cartes où surtitre et titre se touchent.

### 2.3 Resserrer le vocabulaire des filets et affirmer le bord de carte

**La mesure.** Ils peignent 48 côtés de bordure avec **3 combinaisons** dont une transparente, en pratique une seule valeur : `rgba(255,255,255,0.15)` @1px, 45 fois sur 48. Nous peignons 95 côtés avec 6 combinaisons en clair et 9 en sombre. Résultat sur la définition du bord : leur carte se sépare de son filet à **1,577:1**, la nôtre à 1,196:1 en clair (−24,2 %) et 1,387:1 en sombre (−12,0 %). L'élévation carte sur fond, elle, est déjà à parité (1,055 contre 1,061), donc c'est bien le filet qui manque, pas le fond.

**Ce que ça coûte.** Deux valeurs de jeton : `--c-border` de `rgba(0,0,0,0.08)` vers `rgba(0,0,0,0.195)`, `--c-filet-sombre` de `rgba(255,255,255,0.13)` vers `rgba(255,255,255,0.165)`, plus la suppression des quatre variantes de filet qui n'apparaissent que 1 à 4 fois. Fichiers touchés : les mêmes quatre que ci-dessus.

**Ce que ça casserait.** `rgba(0,0,0,0.08)` est un jeton de notre DA, cité tel quel dans le brief. Le porter à 0,195 change l'aspect de toutes les cartes de tous les gabarits, pas seulement l'accueil, et rend la page nettement plus « griffée ». C'est un arbitrage. Une position intermédiaire mesurable : 0,13 donne 1,35:1, soit le niveau de notre propre régime sombre, ce qui rendrait au moins les deux régimes cohérents entre eux (aujourd'hui l'écart entre nos deux régimes est de 16 %).

---

## 3. Ce que je n'ai pas réussi à mesurer

1. **Les états de survol.** Aucun `:hover` n'a été déclenché. Les valeurs `--c-blue-hover`, `--c-border-hover`, `--card-shadow-hover` ne sont donc pas comparées à leurs équivalents. Chez eux, deux des cinq porteurs d'accent sont des `canvas` WebGL (`RoundedButton...shader`, `Header...appMenuButtonShader`) dont le comportement au survol est très probablement animé : je n'ai qu'une image fixe.

2. **L'animation de la couleur.** Les trois `canvas` `panelMediaBack` de 576×500 px rendent l'aplat `#A1BBFF` que j'ai relevé. Je ne peux pas dire si cet aplat est statique ou s'il bouge, ni s'il vaut la peine d'être un shader plutôt qu'un `div`. Mesuré : la couleur est parfaitement plate, identique en (s+5), au milieu, et en (e−5) sur sept lignes échantillonnées entre y 2575 et y 4180. Un aplat CSS reproduirait donc l'image fixe à l'identique.

3. **Le contraste sur photographie.** Nos zones les plus chromatiques ne sont pas de la marque : la plus grosse « zone accent » détectée sur `01-accueil.html` (y 3509 à 3723, 8 567 px) est une photographie de pneu bleu, et la seconde (y 5144 à 5517) est un portrait dont les hautes lumières tombent dans le voisinage de `#C7CBFF`. J'ai vérifié les deux par recadrage. Toute mesure « famille d'accent » plus large que `#0008CF` exact est donc polluée chez nous, ce qui est la raison pour laquelle je n'ai retenu que le chiffre exact de 0,036 %.

4. **Le comptage « couleurs pour 99 % des pixels ».** 23 chez eux contre 292 chez nous : ce chiffre n'est pas exploitable comme jugement de palette, parce que nous portons des photographies pleine largeur et eux des captures d'interface. Je le laisse dans le tableau pour transparence, pas comme argument.

5. **Le régime sombre du navigateur.** J'ai vérifié que morpho ne répond pas à `prefers-color-scheme` (`html` reste `rgb(18,18,18)` en `light` comme en `dark`, aucun `data-theme`, aucun basculeur trouvé). Je n'ai en revanche pas pu établir si nos deux fichiers `01-accueil.html` et `01-accueil-noir.html` sont censés être deux régimes d'une même page ou deux pages : rien dans les fichiers ne les relie, et cela change ce que « la proportion de la page en clair et en sombre » veut dire pour nous.

6. **Les blocs non révélés.** 13 % de leur page (990 px sur 7 568) et 9 % de la nôtre n'ont produit aucune bande de fond stable de 25 px ou plus, essentiellement des zones d'imagerie dense. Les proportions clair/sombre sont donc calculées sur les 87 % et 91 % restants, et je le signale plutôt que d'extrapoler.

7. **L'opacité héritée.** Le calcul de contraste compose la couleur déclarée avec l'alpha du jeton et l'opacité propre de l'élément. Une opacité posée sur un ancêtre ne serait pas prise en compte. J'ai vérifié que les six cas fautifs listés en 1.4 sont tous à `opacity: 1` sur l'élément porteur, mais je n'ai pas remonté la chaîne des ancêtres pour les 320 autres blocs.
