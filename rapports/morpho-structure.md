# morpho.org — relevé de structure, navigation et motifs de section

Lentille : navigation, hiérarchie de page, motifs de section.
Relevé au navigateur (Playwright/Chromium), viewport 1440×900, page défilée par
paliers de 500 px jusqu'en bas avant toute mesure.

- Référence : `https://morpho.org/` — HTTP/2 200 vérifié (`x-vercel-id: fra1::iad1`), 27/08/2026.
- Nous : `file:///Users/naomiehalioua/cleo-maquettes-edge/sortie/01-accueil.html`
  et `01-accueil-noir.html` pour le régime sombre.
- Scripts et captures : `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-morpho/`
  (`measure-morpho.mjs`, `bands.mjs`, `nav2.mjs`, `nav3.mjs`, `cta-shots.mjs`,
  `sticky.mjs`, `final.mjs`, `nous.mjs`, `nous2.mjs`, `nous-shots.mjs`).

---

## 1. Tableau d'écart

### 1.1 Barre de navigation

| dimension | morpho.org | nous (01-accueil) | écart |
|---|---|---|---|
| hauteur de la barre | 80 px (`header`) | 61 px (`nav.nav`) | +19 px chez eux |
| position | `fixed`, `z-index: 90` | `sticky`, `z-index: 50` | — |
| nombre d'états au défilement | 3 | 1 | +2 |
| état à y=0 | `background: rgba(0,0,0,0)`, bordure `rgba(0,0,0,0)`, `translateY(0)` | `rgba(255,255,255,.6)` + `blur(24px)`, bordure `1px rgba(0,0,0,.08)` | ils sont invisibles, nous sommes opaques |
| état en descente (y=200 / 600 / 3000) | classe `_isDetached` : `background: rgb(18,18,18)`, bordure `1px rgba(255,255,255,.15)`, `transform: translateY(-80px)` → **la barre sort de l'écran** | identique à y=0 | 0 changement chez nous |
| état en remontée (3000 → 2500) | `translateY(0)`, fond `#121212` opaque, bordure 1px | identique à y=0 | 0 changement chez nous |
| entrées de premier niveau | 6 (Products, Solutions, Customers, Resources, Jobs, Contact) | 6 (Produit, Textes, Secteurs, Marchés, Ressources, Entreprise) | 0 |
| entrées portant un panneau déroulant | 3 sur 6 | 6 sur 6 | +3 chez nous |
| taille de texte des entrées | 16 px, `rgba(255,255,255,.5)` | 13 px, `rgba(0,0,0,.62)` | −3 px chez nous |
| gouttière gauche de la barre | `padding-left: 64 px`, contenu sur 1440 | conteneur interne 1360 (marge 40 px) | +24 px chez eux |
| dimensions du panneau déroulant | Products 530×201 · Solutions 375×234 · Resources 174×264 | `.mega` 1360×232, identique pour les 6 | leur panneau est taillé au contenu, le nôtre est fixe |
| liens dans le panneau « produit » | 6 | 3 | ×2 |
| densité du panneau | 1 lien / 17 755 px² | 1 lien / 105 173 px² | **5,9× plus dense chez eux** |
| fond / rayon / bordure du panneau | `#121212`, `8 px`, `1px rgba(255,255,255,.15)` | `#FFFFFF`, `10 px`, `1px rgba(0,0,0,.08)` | — |
| ancrage du panneau | `y = 88` (8 px sous la barre), `x` = celui du déclencheur (497 / 631 / 891) | `y = 59`, `x = 40` fixe | ils suivent le déclencheur |
| CTA dans la barre | 1 pilule `#2D6DD2`, 44 px de haut | 1 pilule `#0008CF`, 40 px de haut | −4 px |

### 1.2 Page d'accueil, mesures globales

| dimension | morpho.org | nous | écart |
|---|---|---|---|
| hauteur totale de page | 7 568 px | 8 845 px (sombre : 9 231) | +1 277 px chez nous |
| blocs de section (hors pied) | 6 macro-blocs | 10 `<section>` | +4 chez nous |
| instances de bloc (séparateurs compris) | 12 | 11 | −1 |
| motifs de section distincts | 7 | 5 | −2 chez nous |
| instances par motif | 1,71 | 2,00 | **nous répétons plus qu'eux** |
| conteneur de contenu | 1 152 px | 1 120 px (contenu de carte 1 040) | −32 px |
| bande de transition entre sections | 4 bandes dégradées de 200×1440 | 0 | +4 chez eux |
| respiration entre deux sections | 120 + 200 + 120 = **440 px** | 128 + 128 = **256 px** (sombre : 296) | +184 px chez eux |
| éléments `fixed` / `sticky` | 6 (hors 19 numéros de ligne de code) | 1 (la barre de nav) | +5 |
| `canvas` | 5 | 1 | +4 |
| `img` | 83 | 17 | ×4,9 |
| photographies dans ces images | 0 sur 83 (0 %) | 6 sur 17 (35 %) | — |
| `svg` | 82 | 36 | ×2,3 |
| éléments animés par `@keyframes` au repos | 0 | 3 | — |
| transitions distinctes déclarées | 12+ (dont `0.4s cubic-bezier(.36,.2,.07,1)`) | 10 (dont `0.5s cubic-bezier(.625,.05,0,1)` échelonné 0 / .07 / .14 / .21 / .28) | nous avons un système de révélation, ils ont un système d'épinglage |

### 1.3 Échelle typographique relevée

| rôle | morpho.org | nous | écart |
|---|---|---|---|
| titre de clôture | 60 px / 66 px, `fw 300` | 31,68 px / 38,02 px, `fw 400` | **−28,3 px chez nous** |
| H1 du héros | 32 px / 38,4 px, `fw 300` | 46,08 px / 56,22 px, `fw 400`, `ls −0,83` | +14,1 px chez nous |
| titre de section (H2) | 32 px / 38,4 px | 31,68 px / 38,02 px | −0,32 px |
| titre de bloc (H3) | 20 px / 32 px | 24 px / 30 px (features : 31,68 px) | +4 px |
| corps | 16 px / 25,6 px (ratio 1,60) | 16 px / 27,2 px (ratio 1,70) | interligne +1,6 px |
| chiffres du héros | 20 px, `fw 400`, même police que le corps | absent | — |
| police | `FK Grotesk` | `Satoshi` | — |
| crans réellement utilisés dans le corps de page | 4 (60 / 32 / 20 / 16) | 4 (46,08 / 31,68 / 24 / 16) | 0 |

### 1.4 Densité d'appels à l'action

| dimension | morpho.org | nous | écart |
|---|---|---|---|
| amorces cliquables totales (`a` + `button` visibles) | 85 | 106 | +21 |
| amorces d'aspect bouton | 31 (dont 19 tuiles-logos et 6 tuiles d'audit) | 32 | — |
| **pilules de CTA véritables** | 5 (1 nav + 3 « Read more » 149×44 + 1 « Contact us » 151×44) | 10 (1 nav + 9 dans le corps) | ×2 |
| CTA dans le héros | **0** | 2 (« Nous contacter » 143×50, « Essai gratuit » 125×50) | +2 |
| CTA avant y = 2 300 | **0** | 3 | +3 |
| CTA à la clôture | 1 pilule | 2 pilules | +1 |
| liens dans le corps de page (hors nav et pied) | 33 → 4,4 / 1000 px | 12 → 1,36 / 1000 px | **3,2× plus chez eux** |
| destinations de preuve nommées atteintes depuis l'accueil | 17 (`/stories/binance`, `/ledger`, `/gemini`, `/bitget`, `/trust-wallet`, `/world`, `/safe`, `/bitpanda`, `/lemon`, `/farcaster`, `/safepal`, `/coinbase`, `/steakhouse`, `/gauntlet`, `/sentora` + 2 `/blog/`) | 1 (`06-cas-client.html`, atteint 2 fois) | **17× chez eux** |
| logos clients sur l'accueil | 19 tuiles 160×160, **toutes cliquables**, à l'intérieur des panneaux de feature | 4 logos dans un bandeau isolé de 180 px, **0 lien**, 0 titre | — |
| pied de page | 793 px, 21 liens, 4 colonnes | 1 361 px, 43 liens, 8 colonnes | +568 px, ×2 liens |

---

## 2. La suite des sections, dans l'ordre

### morpho.org — 6 macro-blocs + 4 séparateurs + pied

| # | y → y | hauteur | rôle | motif |
|---|---|---|---|---|
| 1 | 80 → 2 394 | **2 314 px (30,6 % de la page)** | promesse + preuve chiffrée live, **sans un seul CTA** | **scène épinglée** : un conteneur `position: fixed` de 528×900 au `top: 0`, et 3 couches de texte (820 / 900 / 594 px) qui défilent au travers. Couche 1 : H1 32 px + H2 16 px + deux compteurs (`Deposits $14 206 788 558`, `Loans $4 713 802 446`, 20 px, libellés 16 px `rgba(255,255,255,.5)`) posés à `y=806/836` en bas à gauche, et « Scroll to explore » à `x=1253` en bas à droite. Couche 2 : H1 « Powered by Morpho » + H2. Couche 3 : sans texte, fin d'animation. |
| 2 | 2 394 → 4 236 | 1 842 px | ce que ça fait, prouvé par ceux qui le font | **panneau scindé, répété 3×** : H2 32 + sous-titre, puis 3 panneaux 1152×500, `border-radius 16`, fond `#181818`, `gap 80 px`, alternés gauche/droite. Moitié média 576 px en aplat `#A1BBFF` portant de vraies captures produit (1 `canvas` 576×500 chacun) ; moitié texte : H3 20 + corps 16 + **mosaïque de 14 / 2 / 3 tuiles logo 160×160, `radius 8`, fond `rgba(255,255,255,.05)`, chacune un lien vers une page client nommée** + pilule « Read more » 149×44, `radius 22`, `padding 0 24px`. |
| 3 | 4 236 → 4 436 | 200 px | transition | **bande dégradée pleine largeur** |
| 4 | 4 436 → 5 395 | 1 159 px (`padding 120/120`) | preuve vérifiable | **carte-artefact** : « Open by default, secure by design », carte 864×497 contenant un vrai fichier `.sol` coloré (19 lignes visibles, numéros de ligne `sticky`) + lien « Github ↗ ». Puis rangée de **3 colonnes séparées par des filets 1 px** (Security Audits / Formal Verification / Noncustodial), chacune H3 20 + corps 16 + 6 tuiles 32×32 + lien texte « Read More ↗ ». |
| 5 | 5 395 → 5 595 | 200 px | transition | bande dégradée |
| 6 | 5 595 → 6 119 | 724 px (`120/120`) | caution | **grille à filets** : 4×3 = 12 cellules de 288×96, filets `1px rgba(255,255,255,.15)`, 11 logos d'investisseurs en gris, **la 12ᵉ cellule est « View More »** — pas un bouton, une cellule. |
| 7 | 6 119 → 6 319 | 200 px | transition | bande dégradée |
| 8 | 6 319 → 6 575 | 456 px (`120/120`) | clôture | **clôture centrée** : H2 **60 px** sur deux lignes + **une seule** pilule bleue « Contact us → » 151×44. |
| 9 | 6 575 → 6 775 | 200 px | transition | bande dégradée |
| 10 | 6 775 → 7 568 | 793 px (`60/60`) | pied | logo + 4 colonnes (Resources / Data & Analytics / Community / Company), 21 liens, filigrane « MORPHO » de 462 px de haut derrière. |

### nous — 10 sections + pied

| # | y → y | hauteur | rôle | motif |
|---|---|---|---|---|
| 1 | 61 → 1 015 | 954 px (`120/96`) | promesse | bande sombre `#0F0E0D` : H1 46,08 + sous-titre + **2 pilules** + globe `canvas` |
| 2 | 1 015 → 1 195 | 180 px (`pb 84`) | caution | **bandeau de 4 logos, muet** : 0 titre, 0 lien |
| 3 | 1 195 → 1 453 | 258 px (`pt 104`) | énoncé du problème | H2 seul, centré, `section-serree` |
| 4 | 1 471 → 2 298 | 827 px (`56/128`) | vue d'ensemble | **section-carte** : une carte blanche 1040×643, `radius 14`, ombre `1.6px 3.7px 8.4px`, label + H3 24 + liste + visuel + 1 pilule |
| 5 | 2 298 → 3 072 | 774 px (`128/128`) | le cycle | **bande sombre** `#0F0E0D` : H2 + H3 « La règle encodée » |
| 6 | 3 072 → 4 300 | 1 228 px (`pb 112`) | 3 features | **grille de cartes hétérogène** : 2 cartes 506×712 côte à côte + 1 carte 1040×376 dessous — 2 géométries pour 3 items. Chacune : label + H3 31,68 + corps + pilule 115×42 + photographie |
| 7 | 4 300 → 5 144 | 844 px (`pb 128`) | cas client | section-carte : H2 + carte cliquable 1040×520 |
| 8 | 5 144 → 5 839 | 696 px (`pb 128`) | citation | section-carte 1040×568 |
| 9 | 5 839 → 6 689 | 850 px (`128/128`) | équipe | section-carte 1040×594, 2 portraits 167×223 |
| 10 | 6 689 → 7 131 | 442 px (`pb 128`) | clôture | section-carte 1040×314 : H2 31,68 + **2 pilules** |
| 11 | 7 131 → 8 845 | 1 361 px (`96/44`) | pied | fond `#0F0E0D`, 8 colonnes `h4`, 43 liens |

### Motifs, comptés des deux côtés

**Eux — 7 motifs, 12 instances, 1,71 instance par motif**
scène épinglée ×1 · panneau scindé 1152/576 ×3 · carte-artefact ×1 ·
rangée 3 colonnes à filets ×1 · grille de logos à filets ×1 ·
**bande de transition 200 px ×4** · clôture centrée à 1 pilule ×1.

**Nous — 5 motifs, 10 instances, 2,00 instances par motif**
bande sombre pleine largeur ×2 · bandeau de logos muet ×1 · énoncé centré seul ×1 ·
**section-carte blanche 1040 `radius 14` ×5** · grille de cartes hétérogène ×1.

Le chiffre brut nous est favorable : **nous répétons plus qu'eux (2,00 contre 1,71)**.
L'écart n'est pas dans le nombre de motifs, il est dans **ce que le motif répété
transporte**. Leur motif répété (le panneau scindé, 3 instances sur 1 842 px)
porte 3 titres, 3 médias animés, **19 tuiles logo cliquables vers 17 pages clients
nommées** et 3 CTA. Notre motif répété (la section-carte, 5 instances) porte
1 titre, 0 logo et 1 CTA par instance. Nous répétons le motif le moins chargé.

---

## 3. Les trois changements les plus payants

### 3.1 Donner 3 états à la barre de nav au lieu d'un seul

**Mesure.** Leur barre a 3 états mesurés (`translateY(0)` transparent sur le héros →
`_isDetached` `translateY(-80px)` fond `#121212` bordure `1px rgba(255,255,255,.15)` en
descente → `translateY(0)` opaque en remontée). La nôtre est identique à `y=0`, `600`,
`3000` et en remontée : `rgba(255,255,255,.6)` + `blur(24px)`, bordure
`1px rgba(0,0,0,.08)`, `height 61`. Conséquence mesurable aujourd'hui : notre barre
claire est posée sur un héros `#0F0E0D` et y trace une couture nette à `y=61` sur toute
la largeur de 1440 px, visible sur `n01-hero.png`. Chez eux, à `y=0`, la couture n'existe
pas : `background-color: rgba(0,0,0,0)`, `border-bottom-color: rgba(0,0,0,0)`.

**Coût.** `<nav class="nav">` est présent dans **23 fichiers** de `sortie/` (relevé :
`grep -l '<nav class="nav"' *.html | wc -l` → 23). Le CSS étant inliné dans chaque
gabarit, un changement de comportement touche les 23, plus le petit écouteur de défilement.
Un passage préalable sur `00-composants.html` limiterait la reprise à un seul bloc à
propager.

**Ce que ça casse.**
1. Les 20 gabarits dont la première section est claire (`02-entreprise`, `03-offre`,
   `11-blog`…) : une barre transparente sur fond crème rend les entrées 13 px
   `rgba(0,0,0,.62)` sur `#F9F8F6`, ce qui tient — mais la pilule `#0008CF` sur crème est
   à 10,22:1, alors que sur `#0F0E0D` elle tombe à **1,78:1** (leur pilule `#2D6DD2` sur
   `#121212` est à 3,77:1). Une barre transparente sur notre héros sombre rend donc la
   pilule bleue quasi indistincte du champ. C'est un arbitrage, voir §4.
2. Les 6 panneaux `.mega` s'ancrent à `y=59` : si la barre part en `translateY(-61px)`,
   un panneau ouvert doit se fermer, sinon il flotte détaché.
3. Nos ancres internes (aucune mesurée sur l'accueil) et tout `scroll-margin-top` calé
   sur 61 px.

### 3.2 Un seul gabarit de feature, répété 3 fois, avec la preuve client dedans

**Mesure.** Leur section « Built for scale » est **un** gabarit (panneau 1152×500,
`radius 16`, fond `#181818`, `gap 80`, moitié média 576 / moitié texte 576) répété
**3 fois** en alternant les côtés. La nôtre est **deux** géométries pour trois items :
2 cartes 506×712 en portrait, puis 1 carte 1040×376 en paysage. Et surtout : leurs
3 panneaux contiennent **19 tuiles logo de 160×160** (`radius 8`, fond
`rgba(255,255,255,.05)`) qui ouvrent **17 pages clients nommées** ; nos 3 cartes
contiennent **0 logo** et ouvrent **1** destination de preuve, atteinte 2 fois.
Densité de liens dans le corps : eux **4,4 pour 1 000 px**, nous **1,36** — 3,2× moins.
Nos 4 seuls logos clients vivent dans un bandeau isolé de 180 px, sans titre et **sans
un seul lien**.

**Coût.** `sortie/01-accueil.html` (section `y=3072`) et `sortie/01-accueil-noir.html`
et `01-accueil-en.html` pour les régimes sombre et anglais, soit **3 fichiers**. Les
pages de destination n'existent pas : seul `06-cas-client.html` est présent, il faudrait
soit y router les tuiles avec une ancre, soit accepter que les tuiles ne soient pas
cliquables tant que les pages ne sont pas écrites.

**Ce que ça casse.**
1. La hauteur. Trois panneaux de 500 px + 2 `gap` de 80 px = 1 660 px, contre 1 228 px
   aujourd'hui : **+432 px**, et la page passe de 8 845 à ~9 277 px, au-delà des 7 568 px
   de la référence.
2. Le format des photographies. Nos médias de feature sont 430×269 et 439×573 ; un
   demi-panneau de 520×500 (à notre conteneur de 1 040) recadre les deux. Nos 6
   photographies sur 17 images sont du reportage, pas de la capture produit — eux ont
   0 photographie sur 83 images. Remplir un demi-panneau avec une photo d'autoroute ne
   fait pas la même démonstration que le remplir avec l'écran de l'app.
3. Les noms des clients. `06-cas-client.html` ne cite que Decathlon ; les logos affichables
   sont contraints (Longchamp, BIC, PMU, Kiabi sont interdits en impression). La mosaïque
   n'est donc pas remplissable sans une décision sur qui est citable.

### 3.3 Vider le haut de page de ses CTA et y mettre un chiffre

**Mesure.** Leurs **2 314 premiers pixels — 30,6 % de la page — ne contiennent aucun
CTA**. Ce qu'ils contiennent à la place : deux compteurs de 20 px, alignés à `x=64` et
`x=282`, `y=836`, sous des libellés de 16 px `rgba(255,255,255,.5)`, et un « Scroll to
explore » à `x=1253`. Nous mettons **3 CTA avant `y=2 000`**, dont 2 dans le héros
(143×50 et 125×50 à `y=325`), et **0 chiffre**. Symétriquement, leur clôture porte
**1** pilule sous un H2 de **60 px** ; la nôtre porte **2** pilules sous un H2 de
**31,68 px** — leur titre de clôture est 1,9× le nôtre et il est le plus gros de leur page,
le nôtre est au même cran que tous les autres H2.

**Coût.** `sortie/01-accueil.html` seul pour le héros (section `y=61`) et la clôture
(section `y=6689`), plus `01-accueil-noir.html` et `01-accueil-en.html` : **3 fichiers**.
Aucun jeton de DA n'est touché si l'on retire une pilule ; le passage du H2 de clôture
au-dessus de 32 px en touche un, voir §4.

**Ce que ça casse.**
1. **Le chiffre n'existe pas encore.** Je n'ai aucune source pour un compteur. Aucun
   nombre ne doit être posé dans ce gabarit avant d'avoir été requêté (nombre de règles
   encodées, nombre de marchés couverts, nombre de textes suivis). Tant que la requête
   n'est pas faite, l'emplacement reste vide — c'est un emplacement, pas un chiffre.
2. Retirer une pilule du héros supprime le seul chemin direct vers `21-inscription.html`
   au-dessus de la ligne de flottaison : la conversion se reporte entièrement sur la
   pilule de nav `#0008CF`, qui est le seul CTA restant visible à `y=0`.
3. Notre héros est déjà occupé par le globe `canvas` (y≈420→900) : leur bas de héros est
   libre parce que leur scène est épinglée et que le texte défile par-dessus. Poser des
   compteurs à `y=836` chez nous les fait atterrir sur le globe.

---

## 4. Arbitrages — ce qui toucherait un jeton de DA

Ces points sont relevés, pas décidés.

1. **Hauteur de barre 60 → 80 px.** Leur barre fait 80 px, la nôtre 61. Le passage à 80
   n'est pas nécessaire pour obtenir les 3 états ; il l'est si l'on veut leur gouttière
   de 64 px et leurs entrées à 16 px. Jeton concerné : la hauteur de nav.
2. **Entrées de nav à 13 px.** 13 px **n'appartient pas à notre échelle**
   (49 / 32 / 24 / 18 / 16 / 15 / 12 / 10). C'est une dérive déjà présente dans les
   23 fichiers, indépendante de morpho. Le cran le plus proche est `.t-caption` 12 ou
   `.t-body` 15. Eux sont à 16.
3. **`.t-hero` mesuré à 46,08 px, pas 49.** À 1 440 px de large, notre H1 rend
   `font-size: 46.08px / line-height: 56.2176px`, et `.t-display` rend `31.68 / 38.016`
   au lieu de 32. Les valeurs sont donc déjà réduites d'environ 6 % et 1 % par le `clamp()`
   au viewport de référence. À vérifier avant de comparer quoi que ce soit à la grille.
4. **Titre de clôture à 60 px.** Leur clôture est le seul endroit où ils dépassent 32 px,
   et ils y vont à 60/66. Notre plus grand jeton est `.t-hero` 49. Faire une clôture plus
   forte que nos H2 demande soit d'y employer `.t-hero`, soit un nouveau cran.
5. **La pilule `#0008CF` sur champ sombre.** Mesuré : `#0008CF` sur `#0F0E0D` = **1,78:1**,
   contre `#2D6DD2` sur `#121212` = **3,77:1** chez eux. Aujourd'hui le problème ne se pose
   pas, notre pilule bleue ne vit que dans la barre claire. Elle se pose dès que la barre
   devient transparente au-dessus du héros (§3.1). Le blanc sur `#0008CF` reste à 10,85:1,
   donc c'est la séparation pilule/champ qui manque, pas la lisibilité du texte.
6. **La bande de transition de 200 px.** Ils l'utilisent 4 fois, c'est leur motif le plus
   répété. Chez nous les sections se touchent et le fond change d'un coup
   (`#F9F8F6` → `#0F0E0D` à `y=2298`). Un dégradé de 200 px entre les deux champs n'est
   pas dans notre vocabulaire ; c'est une décision de DA, pas un réglage.
7. **Le monospace.** Leur bloc de preuve est un vrai fichier source coloré en monospace
   (864×497). Notre DA interdit le monospace. Notre section « Vérifiez la source, jusqu'au
   caractère près » fait le même travail avec une maquette de chat. Le motif « montrer
   l'artefact brut » est adoptable sans monospace (un extrait de texte réglementaire mis
   en page en Satoshi), mais ce n'est pas la même démonstration et ça se décide.

---

## 5. Ce que je n'ai pas réussi à mesurer

1. **Ce que la scène épinglée affiche réellement.** J'ai mesuré sa géométrie
   (`position: fixed`, 528×900, `top: 0`, 2 314 px de course, classe
   `HomeV2Page_sphere-…__centeredContainer`) mais le rendu WebGL ressort noir dans
   Chromium sans GPU : `01-hero.png` montre 600 px de vide entre le sous-titre et les
   compteurs. Je ne peux rien dire de ce qui l'occupe visuellement.
2. **La vitesse de la mosaïque de logos.** Les tuiles 160×160 défilent, mais
   `animation-name` vaut `none` sur tous les éléments au repos : l'animation est pilotée en
   JS par `transform`. J'ai la géométrie des tuiles, pas la durée ni la courbe du défilement.
3. **Le changement de couleur au survol des entrées de nav.** Ma passe de survol a capturé
   les panneaux déroulants mais je n'ai pas relevé la couleur de l'entrée avant/après. Je
   sais qu'elles sont à `rgba(255,255,255,.5)` au repos et que la transition déclarée est
   `color 0.2s ease-out`, mais je n'ai pas la valeur d'arrivée.
4. **Le régime mobile et tablette.** Tout est mesuré à 1440×900 uniquement. Leur
   `Header-…__mobileMenu` existe (`position: fixed`, `top: 68px`) mais rend 0×0 à 1440. Nos
   points de rupture ne sont pas relevés.
5. **Leurs pages `/stories/*`.** Les 15 destinations clients sont relevées par leur `href`
   depuis l'accueil ; aucune n'a été ouverte. Je ne sais pas ce qu'elles contiennent.
6. **Les 21 autres gabarits de `sortie/`.** Seuls `01-accueil.html` et
   `01-accueil-noir.html` sont mesurés. Le comptage « 23 fichiers portent la nav » vient
   d'un `grep`, pas d'un rendu : je n'ai pas vérifié que les 23 rendent la même barre.
7. **La couleur exacte du dégradé des 4 bandes de transition.**
   `background-image` renvoie `none` : le dégradé est peint ailleurs (pseudo-élément ou
   enfant). J'ai la géométrie (200×1440, aux `y` 4 236 / 5 395 / 6 119 / 6 575), pas la rampe.
