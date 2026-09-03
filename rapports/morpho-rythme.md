# morpho.org contre nous : rythme vertical, espacement, densité

Relevé du 27/08/2026. Playwright / Chromium, viewport 1440x900, `networkidle`
puis défilement complet par paliers de 600px avant toute mesure.
Référence : https://morpho.org/ (200).
Nous : `sortie/01-accueil.html` et `sortie/01-accueil-noir.html`.
Aucun fichier du chantier n'a été modifié.

Scripts et données brutes :
`/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-morpho/`
(`morpho-profond.json`, `nous-profond.json`, `nous-noir-profond.json`, `parsection.json`, `densite.json`)

---

## 1. Tableau d'écart

### Page entière

| dimension | morpho.org | nous (clair) | écart |
|---|---|---|---|
| hauteur du document @1440 | 7 568 px | 8 845 px | +1 277 px (+16,9 %) |
| hauteur en régime sombre | (site unique, fond #121212) | 9 231 px | +386 px vs notre clair |
| sections de contenu | 5 | 11 | +6 |
| hauteur moyenne de section | 1 339 px (σ 726, cv 0,54) | 673 px (σ 309, cv 0,46) | nous : moitié moins haute |
| hauteurs successives | 2314 / 2042 / 1159 / 724 / 456 | 954 / 180 / 258 / 827 / 774 / 1228 / 844 / 696 / 850 / 442 / 352 | |
| ratio de section à la suivante | 0,88 · 0,57 · 0,62 · 0,63 (décroissance monotone) | 0,19 · 1,43 · 3,21 · 0,94 · 1,59 · 0,69 · 0,82 · 1,22 · 0,52 · 0,80 (aucune progression) | |
| hauteur du pied | 793 px (10,5 % de la page) | 1 361 px (15,4 %) | +568 px |

Sélecteurs : eux `div[class*="HomeV2Page"][class*="root"]` (sphere, solutions, code, backed, contact) et `footer[class*="Footer"]`. Nous `body > section`, `body > div.signature-cleo`, `body > footer`.

### Conteneur et marges latérales

| dimension | morpho.org | nous | écart |
|---|---|---|---|
| conteneur large | 1 152 px, left 144 | 1 120 px, left 160 (`.conteneur`, `max-width:1120px`, `padding 40px`) | -32 px de conteneur |
| colonne de contenu réelle | 1 152 px | **1 040 px, left 200** (relevé 23 fois, le plus fréquent) | **-112 px de colonne de texte** |
| marge latérale @1440 | 144 px = 10,0 % | 160 px = 11,1 % (200 px = 13,9 % pour le contenu) | +56 px de marge |
| largeurs de conteneur distinctes | **5** : 1312@64 (pied), 1152@144 (grilles), 976@312 (code), 871@285 (hero), 640@400 (contact) | **1** : 1120@160 sur 12 sections sur 12 | |
| colonne de texte d'intro | 640 px | 1 040 px (le `.t-lead` est plafonné à 600 px, mais le bloc mesure 1 040) | |
| largeur des paragraphes de corps | 480 à 640 px | 426 à 560 px | nous plus étroits de 54 à 80 px |

### Padding vertical de section

| dimension | morpho.org | nous | écart |
|---|---|---|---|
| padding de section dominant | **120 / 120** (`.centeredContent` sur code, backed, contact : 3 sections sur 5) | **128 / 128** (`--pad-section`, `base.css:86`, `.section` l.153) | +8 px |
| version serrée | (aucune) | 88 px (`--pad-section-courte`, `.section-serree` l.154) | |
| régime sombre | (sans objet) | **148 / 148** (`regime-noir.css:53`) | +20 px, hors échelle `--s-*` |
| valeurs de padding distinctes relevées | 5 : 0, 60, 120, 200, 300 | **9** : 0, 44, 56, 84, 96, 104, 112, 120, 128 | +4 valeurs |
| paires pt/pb relevées | 0/0 ×3, 0/200, 60/60, 0/300 | 120/96, 0/84, 104/0, 56/128, 128/128, 0/112, 0/128 ×3, 128/128, 56/0, 96/44 | |
| air réel entre deux blocs de contenu | 0 / 320 / 280 / 318 / 180 px ; **moyenne 275 px** hors le 0 délibéré | 96 / 188 / 56 / 256 / 128 / 112 / 128 / 256 / 128 / 184 / 96 ; **moyenne 148 px** (σ 62, cv 0,42) | **ils donnent 1,86x plus d'air entre deux blocs** |

### Grille d'espacement

| dimension | morpho.org | nous | écart |
|---|---|---|---|
| occurrences d'espacement mesurées | 310 | 571 | |
| valeurs distinctes | **17** | **35** | x2,1 |
| sur un multiple de 4 | **92,6 %** (287/310) | **39,8 %** (227/571) | **-52,8 points** |
| sur un multiple de 8 | 29,7 % | 15,9 % | -13,8 points |
| sur un jeton `--s-*` (2,4,8,12,16,24,32,48,64,96,128) | 62,3 % | **26,1 %** | -36,2 points |
| valeurs hors grille de 4 | 6px x14, 3px x6, 5px x2, 63px x1 | 10px x61, 7px x45, 9px x45, 13px x42, 14px x42, 11px x37, 18px x19, 5px x14, 30px x14, 6px x8, 26px x7, 15px x4, 22px x3, 34px x3 | |
| unité de base déduite | **4 px** | 4 px déclarée dans les jetons, **non tenue au rendu** | |

### Gouttières de grille

| dimension | morpho.org | nous | écart |
|---|---|---|---|
| gouttière d'une grille de cartes | **0 px** (`backed.slotsContainer` : 4 colonnes de 288 px jointives, left 144/432/720/1008) | 24 px (`.g4`), 28 px (`.g3`, `.g-features`), 32 px (`.g2`) | +24 à +28 px |
| gouttière d'une grille à 3 colonnes | **0 px** (`code.columns` : 3 x 288 px, left 288/576/863) | 28 px (`.g3` : 3 x 412,66 px) | +28 px |
| padding interne d'une carte | 32 px (`code.column`) | 40 px (`.p32`), 48 px (`.p40`), 64 px (`.p48`) | +8 à +32 px |
| gouttière de rangée entre panneaux | **80 px** (`solutions.panels`, flex gap) | 28 px (`.g-features`), 40 px (`.cycle`), 56 px (`.duo`) | -24 à -52 px |
| gouttière de liste serrée | 8 px (`solutions.panelBlockList`) | 9 px, 10 px, 11 px, 12 px, 13 px, 15 px | |
| gouttières distinctes relevées | 8 : 0, 8, 12, 20, 24, 32, 40, 60, 80 | 20 : 8,9,10,11,12,13,14,15,20,22,24,28,32,34,40,48,56,64,96 | |

### Titre de section vers son contenu

| dimension | morpho.org | nous | écart |
|---|---|---|---|
| titre de carte vers son paragraphe | **8 px** (h3 20px, `solutions.panel`) | **18 à 28 px** (`.t-h1`, `.t-display` en carte) | **x2,3 à x3,5** |
| titre de section vers son sous-titre | **24 px** (`solutions.subTitle`, margin-top) | **38 px** (h2 `.t-display` vers `.t-lead` : gap 14 déclaré + 24 de marge) | +14 px |
| bloc d'en-tête vers la grille | **60 px** (`solutions.panels`) à **80 px** (`backed.slotsContainer`) | **72 px** (`.entete-section` margin-bottom, `composants.css:748`), mesuré 72 px exactement | comparable |
| grand titre vers ses boutons | 40 px (h2 60px) | 26 px (`.t-hero` 46px) | -14 px |
| **ratio inter-groupe / intra-groupe** | **10,0** (80/8) en carte, 2,5 (60/24) en section | **1,9** (72/38) en section, 2,6 à 4,0 en carte | **ils séparent 5x plus fort qu'ils ne lient** |

### Rythme typographique vertical

| dimension | morpho.org | nous | écart |
|---|---|---|---|
| interligne du corps | **1,60, valeur unique** (25,6/16 et 32/20) | **1,60 / 1,66 / 1,70 / 1,72**, quatre valeurs | +3 valeurs |
| interligne relevé sur `.t-body` (15 px) | (sans objet) | 25,8 px (ratio 1,72) | |
| interligne relevé sur `.t-lead` (18 px) | (sans objet) | 29,88 px (ratio 1,66) | |
| interligne des titres | 1,20 (38,4/32) et 1,10 (66/60) | 1,20 (38,02/31,68), 1,22 (56,22/46,08), 1,25 (30/24) | |
| graisse des titres | **300** | **400** | +100 |
| interlettrage | `normal` partout, 16 titres sur 16 | -0,82944 px (`.t-hero`), -0,3168 px (`.t-display`), -0,24 px (`.t-h1`) | |
| échelle de corps relevée | 60 / 32 / 20 / 16 / 14 (5 crans) | 46,08 / 31,68 / 24 / 18 / 16 / 15 / 14 (7 crans) | |
| police | FK Grotesk | Satoshi | |

### Densité

| dimension | morpho.org | nous | écart |
|---|---|---|---|
| hauteur de corps (hors nav et pied) | 6 695 px | 7 405 px | +710 px |
| caractères visibles hors nav et pied | 22 394 dont **21 498 dans le seul bloc de code** | 4 285 | |
| caractères hors le bloc de code | **896** sur 5 536 px | 4 285 sur 7 405 px | |
| densité de texte hors bloc de code | **16,2 car./100 px** | **57,9 car./100 px** | **nous sommes 3,6x plus denses** |
| atomes de contenu (feuilles portant du texte) | **44** hors bloc de code | **89** | x2,0 |
| hauteur par atome de contenu | **126 px/atome** | **83 px/atome** | **ils donnent 1,5x plus de hauteur par idée** |
| section la plus dense | `code` : 1 854,9 car./100 px | `section` (Decathlon) : 98,4 car./100 px | |
| section la moins dense | `backed` : 7,5 car./100 px | hero : 16,1 car./100 px (deux sections sont à 0) | |
| **contraste densité max/min** | **x247** (x3,4 si on écarte le bloc de code) | **x6,1** | |
| part de la page prise par le hero | 2 314 px = **30,6 %** pour 258 caractères | 954 px = **10,8 %** pour 154 caractères | |

Densité par section, morpho (top / hauteur / caractères / car. par 100 px) :
`sphere 80/2314/258/11,1` · `solutions 2394/2042/523/25,6` · `code 4436/1159/21498/1854,9` · `backed 5595/724/54/7,5` · `contact 6319/456/61/13,4` · `footer 6775/793/247/31,1`

Densité par section, nous :
`hero 61/954/154/16,1` · `logos 1015/180/0/0` · `1195/258/169/65,5` · `1471/827/578/69,9` · `2298/774/430/55,6` · `3072/1228/1163/94,7` · `4300/844/341/40,4` · `5144/696/685/98,4` · `5839/850/627/73,8` · `6689/442/138/31,2` · `signature 7132/352/0/0` · `pied 7484/1361/1130/83,0`

### Réponses aux questions posées

- **Leur unité de base est 4 px, tenue à 92,6 %.** 17 valeurs distinctes seulement. Nos jetons `--s-*` sont eux aussi une grille de 4 propre, mais seuls 26,1 % des espacements rendus passent par un jeton et 39,8 % tombent sur un multiple de 4.
- **Nos sections font 128 px (148 en sombre), les leurs 120 px.** L'écart de padding déclaré est négligeable (8 px). L'écart réel est ailleurs : leur air entre deux blocs de contenu vaut 275 px en moyenne, le nôtre 148 px.
- **Leur conteneur fait 1 152 px et laisse 144 px de marge à 1440 (10,0 %).** Le nôtre fait 1 120 px, laisse 160 px, et le contenu réel vit à 1 040 px avec 200 px de marge (13,9 %). Notre colonne de texte est 112 px plus étroite que la leur.
- **Qui est le plus dense : nous, d'un facteur 3,6** en caractères par pixel, et d'un facteur 1,5 en atomes de contenu par pixel. Sur une page 1 277 px plus longue que la leur.
- **Où ils mettent l'air :** le hero (2 314 px pour 258 caractères, 30,6 % de la page) et la section `backed` (724 px pour 54 caractères). **Où ils sont serrés :** un seul endroit, le bloc de code, à 1 855 car./100 px, soit 247 fois leur point le plus vide. Le rythme, chez eux, c'est ce facteur 247. Chez nous le même facteur vaut 6,1 : nous n'avons ni vrai vide ni vraie masse.

---

## 2. Les trois changements les plus payants

### A. Lier le titre à son paragraphe à 8 px, et séparer le groupe de la grille à 80 px

**Mesure.** Chez eux, un titre de carte (h3 20 px) touche presque son paragraphe : **8 px**. Le bloc d'en-tête, lui, est repoussé de **80 px** de sa grille. Ratio **10,0**. Chez nous : titre de carte à **18 à 28 px** de son texte, en-tête à **72 px** de la grille, ratio **1,9 à 4,0**. C'est le seul écart de ce relevé qui ne coûte pas un pixel de hauteur : on prend 10 à 20 px sous chaque titre et on les remet entre les blocs. Sur l'accueil, 20 titres, environ 200 à 400 px redistribués sans allonger la page.

**Coût.** 25 fichiers. La règle vit dans `commun/composants.css` (`.entete-section` l.189, l.620, l.748) plus 222 littéraux de `gap`/`padding`/`margin` posés en dur dans les 24 `pages/*.html`, dont 24 dans `pages/01-accueil.html` seule. Les 13 usages de `.entete-section` sont répartis sur 7 pages (01, 01-en, 02, 04, 05, 09, 18), pas seulement l'accueil.

**Ce que ça casse.** `.entete-section` est déclarée **trois fois** dans `composants.css`, toutes hors media query : l.189 `gap:14px; margin-bottom:64px`, l.620 `gap:20px; margin-bottom:112px`, l.748 `gap:14px; margin-bottom:72px`. La dernière gagne (mesuré : gap 14, mb 72). Le commentaire de la l.617 dit « L'AIR. Valeurs relevées sur cleolabs.co le 26/08/2026 : padding de section 160 px, gaps de 20 et 16 » et pose 112 px ; **128 lignes plus bas, la même règle le ramène à 72 px en silence**. Modifier la l.620 seule ne produira aucun changement visible et fera croire à un échec de la modification. Il faut supprimer ou fusionner les trois.

### B. Ramener l'espacement sur la grille de 4 déjà déclarée

**Mesure.** 92,6 % de leurs 310 espacements tombent sur un multiple de 4, avec 17 valeurs distinctes. Chez nous : **39,8 % sur 571 espacements, 35 valeurs distinctes**. Les fuyards sont concentrés : `10px x61`, `7px x45`, `9px x45`, `13px x42`, `14px x42`, `11px x37`, `18px x19`, `30px x14`, `26px x7`. Nos jetons `--s-*` sont déjà propres (2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128) et `commun/base.css` les respecte à **100 %** (0 littéral hors grille). Le désordre est entièrement ailleurs.

**Coût.** 25 fichiers, **345 littéraux** mesurés : `commun/composants.css` 123, `pages/*.html` 222 (01-accueil 24, 01-accueil-en 24, 00-composants 22, 07-chat 21, 08-reglementation 20, 03-offre 20, 09-texte 17, 04-secteur 17, 02-entreprise 15, 05-marche 14, 06-cas-client 9, 16-evenement 8, et le reste). `commun/regime-noir.css` et `commun/mouvement.css` sont déjà à 0.

**Ce que ça casse.** Chaque correction (7 vers 8, 9 vers 8, 11 vers 12, 13 vers 12, 14 vers 16) déplace un bord de 1 à 2 px, et une carte de grille additionne ces déplacements sur toute sa pile interne. Le 27/08 sur `02-entreprise`, le retrait d'une rangée de pilules coûtait **40 px et non 12**, et les cartes étaient alignées à **0,00 px avant toute intervention** : un écart de bas de carte se paie en marge plus en rangée, jamais en marge seule. Donc : relever l'alignement du bas de chaque carte de chaque grille **avant** et **après**, sur les 24 pages, pas sur l'accueil seule. Le témoin est simple, les colonnes d'une même `.g3` doivent finir à moins de 1 px l'une de l'autre.

### C. Un seul interligne de corps

**Mesure.** Un seul interligne de corps chez eux, **1,60**, tenu sur 16 px (25,6) comme sur 20 px (32), sur 8 paragraphes sur 8. Chez nous **quatre** : 1,60 (14 px vers 22,4), 1,66 (18 px vers 29,88), 1,70 (16 px vers 27,2), **1,72** (15 px vers 25,8, c'est `.t-body`, `base.css`). Sur l'accueil, **27 lignes de corps à 1,72, pour 697 px cumulés**. Passer `.t-body` de 1,72 à 1,60 donne `15 x 1,60 = 24,00 px` exactement : un multiple de 4 et de 8, contre 25,8 aujourd'hui qui n'est ni l'un ni l'autre. Gain mesuré : **1,8 px par ligne, 49 px sur la page**, et 27 lignes qui retombent sur la grille.

**Coût.** 1 fichier, 1 déclaration (`commun/base.css`, `.t-body{... line-height:1.72}`). C'est le meilleur rapport de ce relevé. Vérifier ensuite les trois autres valeurs (`.t-lead` 1,66, `.coches li` 1,6, `.citation` 1,65).

**Ce que ça casse.** Un interligne plus serré est plus dur à lire sur des lignes longues. Nos paragraphes font 426 à 560 px de large contre 480 à 640 chez eux, donc **moins de caractères par ligne**, ce qui joue en notre faveur. Mais toute carte contenant un `.t-body` perd de la hauteur, et une carte qui perd de la hauteur dans une grille casse l'alignement du bas de rangée. Même témoin que pour B.

---

## 3. Arbitrages pour Naomie (je ne décide pas)

1. **Le conteneur.** `--conteneur: 1120px` est un jeton figé. Eux : 1 152 px, marge 144 (10,0 %). Nous : 1 120 px, marge 160, et le contenu réel à **1 040 px avec 200 px de marge (13,9 %)** parce que `.conteneur` porte 40 px de padding horizontal. L'écart de colonne de texte mesuré est de **112 px**. Trois options : ne rien changer, retirer les 40 px de padding (contenu à 1 120), ou monter le jeton à 1 152.
2. **La graisse des titres.** 300 chez eux, 400 chez nous, sur 16 titres sur 16 des deux côtés. Satoshi possède un Light. Cela change la couleur perçue de toute la page, pas seulement le rythme.
3. **`.t-hero` : le jeton dit 49 px, la page rend 46,08 px.** Deux déclarations de `.t-hero` coexistent, `clamp(2.125rem, 3.4vw, 3.125rem)` puis `clamp(2rem, 3.2vw, 3rem)` ; la seconde gagne, `3,2vw x 1440 = 46,08 px`. Écart de **2,92 px, soit -6,0 %** avec la DA écrite. Soit on corrige la page, soit on corrige le jeton, mais l'écart existe aujourd'hui.
4. **`--pad-section` vaut 128 en clair et 148 en sombre** (`regime-noir.css:53`), d'où les +386 px de hauteur du régime noir, entièrement expliqués (+20, +20, +50, +50, +78, +20, +108, +40 = 386). Aérer davantage le régime sombre est un choix de DA légitime ; le faire avec 148, qui n'est ni un multiple de 8 ni un jeton `--s-*`, ne l'est pas.
5. **La gouttière de grille de cartes à 0.** Leurs cartes sont **jointives** : 4 colonnes de 288 px à left 144/432/720/1008, 32 px de padding interne, séparées par un filet. Les nôtres ont 24 à 28 px de gouttière et 40 à 64 px de padding. Passer à 0 change l'objet « carte » du design system, donc les 24 pages d'un coup. C'est une décision de DA, pas un réglage.
6. **La cadence de section.** Ils comptent 5 sections dont les hauteurs décroissent de façon monotone (0,88 · 0,57 · 0,62 · 0,63). Nous en avons 11 sans progression (0,19 · 1,43 · 3,21 · 0,94 · 1,59 · 0,69 · 0,82 · 1,22 · 0,52 · 0,80). Réduire de 11 à 7 ou 8 sections est une décision de contenu, pas d'espacement, et je ne la prends pas.

---

## 4. Ce que je n'ai pas réussi à mesurer

1. **Le padding de leur hero : la grandeur n'existe pas.** `HomeV2Page_sphere.root` fait 2 314 px, soit 30,6 % de la page, et porte `padding-top: 0 / padding-bottom: 0`. Ses trois calques (820, 900, 594 px) sont tous à 0 de padding. Sa hauteur est une **distance de défilement** pilotée par une animation épinglée, pas de l'espacement. Je ne peux donc pas comparer « leur padding de hero » à notre 120/96.
2. **Leurs valeurs source.** Leur CSS est en modules à noms hachés (`Header-module-scss-module__ncg-zG__header`). Je n'ai lu que du **calculé**. J'affirme que 92,6 % de leurs espacements **rendus** tombent sur un multiple de 4 ; je ne peux pas affirmer qu'ils déclarent une échelle de 4, ni lire leurs jetons.
3. **La densité de leur pied est fausse par le bas.** `footer.innerText` rend **247 caractères** sur 793 px et 25 atomes, alors que le pied affiche visiblement quatre colonnes de liens. Les libellés sont vraisemblablement rendus en SVG. J'ai donc **exclu leur pied** de toutes les comparaisons de densité ; la ligne « pied 31,1 car./100 px » du tableau n'est pas exploitable.
4. **Leur section `backed` est écrêtée.** `slotsContainer` mesure 286 px de haut alors que les vignettes descendent jusqu'à 6 505 px, avec une vignette « view more » et un dégradé de masque. Je n'ai pas mesuré la hauteur dépliée, donc sa densité réelle (7,5 car./100 px, le point le plus vide du site) est un plancher, pas une valeur.
5. **Le responsive.** Tout est relevé à **1440x900 uniquement**. Aucun point de rupture n'a été mesuré, ni chez eux ni chez nous. Nos valeurs de `.entete-section` changent à 1024 et à 640 dans `composants.css` et je n'ai pas vérifié ce qu'elles rendent : le tableau ci-dessus ne dit rien de ce qui se passe sous 1440.
6. **Le rythme au défilement.** Leur hero occupe 2 314 px de défilement pour une seule idée. Combien de pixels de défilement pour un changement d'état, chez eux comme chez nous : ce n'est pas dans mes relevés, et c'est probablement là que se joue la moitié de leur effet.
7. **Le comptage d'atomes de morpho hors bloc de code (44) est un ordre de grandeur, pas un chiffre exact.** Leur bloc de code fait remonter le compte global à 1 496 atomes parce que le texte y est découpé nœud à nœud. J'ai isolé les 44 en soustrayant la section `code`, ce qui suppose que rien d'autre n'est découpé de la même manière ; je ne l'ai pas vérifié nœud par nœud.
