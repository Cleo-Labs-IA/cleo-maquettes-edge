# morpho.org contre nous, lentille mouvement

Relevé du 27/08/2026. Playwright/Chromium, fenêtre 1440x900, page défilée
intégralement par paliers de 540 px avant toute lecture, puis rechargée pour
les mesures de seuil.

Référence : `https://morpho.org/` (HTTP 200, `networkidle` atteint).
Nous : `sortie/01-accueil.html` et `sortie/01-accueil-noir.html`.

Scripts et données brutes :
`/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-morpho/`
(`mesure.mjs`, `survol.mjs`, `cible.mjs`, `fin.mjs`, `fin3.mjs` et les JSON associés).

Aucun fichier du chantier n'a été modifié.

---

## 1. Tableau d'écart

### 1.1 Le moteur, inventaire de `getComputedStyle` sur tous les éléments

| dimension | morpho.org | nous | écart |
| --- | --- | --- | --- |
| éléments dans `body *` | 2 705 | 601 | x4,5 |
| éléments porteurs d'une transition | 321 (11,9 %) | 111 (18,5 %) | +6,6 pts chez nous |
| déclarations de transition comptées | 389 | 254 | |
| durées distinctes rendues | 5 (0,2 / 0,4 / 0,3 / 0,16 / 0,12 s) | 4 (0,15 / 0,5 / 0,28 / 0,05 s) | 5 contre 4 |
| durée dominante | 0,2 s sur 215/389 = 55 % | 0,15 s sur 180/254 = 71 % | |
| courbes distinctes rendues | 5 | 3 | 5 contre 3 |
| courbe dominante | `cubic-bezier(0.36, 0.2, 0.07, 1)` sur 176/389 = **45 %** | `ease`, le défaut du navigateur, sur 198/254 = **78 %** | |
| part de la courbe signature | 45 % | `cubic-bezier(.625,.05,0,1)` sur 38/254 = **15 %** | **30 pts de moins** |
| délais CSS (cascade) | **0** valeur non nulle sur 2 705 éléments | 4 valeurs, pas de 70 ms (0,07 / 0,14 / 0,21 / 0,28 s) | |
| `@keyframes` rendues | **0** | 1 (`souffle`, 22 s, `ease-in-out`, 3 éléments) | |
| propriétés animées, tête de liste | `color` 109, `transform` 97, `opacity` 93, `background-color` 32 | `color` 78, `background` 78, `transform` 43, `opacity` 25 | |
| jetons de durée déclarés | non exposés (CSS modules compilés) | 6 : 150 / 250 / 500 / 150 / 280 / 500 ms, soit 4 valeurs pour 6 noms | 2 doublons |
| jetons de durée jamais employés | | 1 : `--dur-slow` (0 usage de `var()`) | |
| jetons de courbe déclarés | | 6 | |
| jetons de courbe jamais employés | | 2 : `--ease-out`, `--ease-smooth` (0 usage) | |
| jetons de courbe déclarés mais jamais **rendus** | | 3 : `--ease-apple`, `--ease-luxury`, `--ease-smooth` (0 occurrence dans le calcul final) | |

Lecture : nous avons moins de courbes distinctes qu'eux, mais celle qui domine
chez nous est le défaut du navigateur. Chez eux, celle qui domine est la leur.

### 1.2 Le survol

Protocole : balayage de la page par écrans, sélection des cibles dont le centre
appartient réellement à l'élément (`elementFromPoint`), lecture avant / après
`mouse.move`, 900 ms d'attente, remontée de 4 niveaux de parents.

| dimension | morpho.org | nous | écart |
| --- | --- | --- | --- |
| cibles testées | 21 | 24 | |
| cibles qui changent au survol | 18 (86 %) | 22 (92 %) | |
| surface d'une carte ou d'un lien-bloc | `background-color` `rgba(255,255,255,0.05)` -> `0.15`, soit **+0,10 d'alpha**, sur **0,2 s `ease-out`** | régime sombre : `border-color` `rgba(255,255,255,0.11)` -> `0.22`, soit **+0,11 d'alpha**, sur **0 s** | même amplitude, **0 ms contre 200 ms** |
| carte, régime clair | pas d'équivalent mesurable (leurs cartes sont des `<a>`) | `box-shadow` `1.6px 3.7px 8.4px rgba(194,194,194,0.10)` -> **`none`** | chez nous le survol **retire** de la matière |
| étiquette de bouton | `color` `rgba(255,255,255,0.5)` -> `rgb(255,255,255)`, course d'alpha 0,50, sur 0,4 s `cubic-bezier(0.36,0.2,0.07,1)` | pas de changement de couleur d'étiquette | |
| bouton plein | `background-color` `rgba(255,255,255,0.15)` -> `0.25` (+0,10) sur 0,4 s | `transform` `none` -> `translateY(-1px)` sur **0,05 s**, fond `rgb(255,255,255)` -> `rgb(237,235,231)` et ombre `1.6/3.7/8.4` -> `2.4/5.7/13 px` sur **0,15 s** | |
| durées distinctes **dans un même bouton** | 1 | **2** (0,05 s et 0,15 s) | notre mouvement arrive **3x plus tôt** que sa couleur |
| lien de navigation | `color` alpha 0,50 -> 1,00 (course 0,50) sur 0,2 s `ease-out` | `color` alpha 0,64 -> 1,00 (course **0,36**) sur 0,15 s `ease` | course 28 % plus courte |
| logos partenaires | `opacity` 0,5 -> 1 **et** `filter` `saturate(0)` -> `saturate(1)`, 0,2 s | non applicable, pas de rangée de logos survolable sur l'accueil | |
| flèche à l'intérieur d'une carte | `transform` `none` -> `matrix(1,0,0,1,0,0)` sur 0,4 s, et le parent passe `opacity` 0,6 -> 1 | aucune | |
| cibles sans aucun delta | 3 / 21 | 2 / 24 | |

### 1.3 Le curseur

| dimension | morpho.org | nous | écart |
| --- | --- | --- | --- |
| `cursor: pointer` | 652 / 2 705 = **24,1 %** | 264 / 601 = **43,9 %** | +19,8 pts |
| `cursor: grab` | 19 éléments | **0** | |
| `cursor` sur `body` / `html` | `auto` / `auto` | `auto` / `auto` | identique |
| curseur maison (image, SVG, calque décoratif) | **aucun** | **aucun** | identique |
| élément qui suit la souris | **1** : `div.HomeV2Page_sphere…__spherePopOver`, 0x0 px, `position:fixed`, `pointer-events:none` | **0** | |
| nature du suivi | `transform: matrix(1,0,0,1,X,Y)` où X,Y = position exacte de la souris ; `transition` CSS lue = `all 0s`, donc amorti **en JavaScript** | | |
| latence mesurée, saut de 1 118 px (200,200 -> 1200,700) | 43 % parcourus à 85 ms, 72 % à 152 ms, 90 % à 216 ms, 99 % à 281 ms, immobile à **346 ms** | | |
| magnétisme sur un bouton (le bouton se déplace vers le pointeur) | **0**, aucun `transform` de bouton au survol | **0** | identique |

Précision : leur suiveur n'est **pas** un curseur décoratif. C'est une ancre de
0x0 px qui porte l'infobulle de la sphère du hero. Aucun des deux sites n'a de
curseur personnalisé.

### 1.4 La révélation au défilement

| dimension | morpho.org | nous | écart |
| --- | --- | --- | --- |
| géométrie | `opacity` 0 -> 1 **et** `scale(0.96)` -> `scale(1.0000)` | `opacity` 0 -> 1 **et** une translation | |
| distances de révélation distinctes déclarées | **1** (une seule échelle, 0,96) | **7** : `translateY(22px)`, `translateY(12px)`, `translateY(18px)`, `translateX(26px)`, `translateX(-26px)`, `translateX(-24px)`, `scale(0.985)` | 1 contre 7 |
| moteur | JavaScript (`transitionProperty` lu = `all`, `transitionDuration` = `0s`) | CSS (`opacity, transform` `0.5s` `cubic-bezier(.625,.05,0,1)`) | |
| durée mesurée image par image | **392 ms** (opacité 0,02 à 0,985 en 350 ms) | **500 ms** | +108 ms chez nous |
| moitié de la course (`opacity` = 0,5) | à 108 ms, soit **27 %** du budget | à 203 ms, soit **41 %** du budget | |
| mouvement réellement perceptible (5 % à 95 % de la course) | 236 ms | 250 ms | +14 ms |
| temps mort avant que quoi que ce soit bouge | **27 ms** | **86 ms** | **3,2x plus long chez nous** |
| temps mort total dans le budget | 156 ms sur 392 = 40 % | 250 ms sur 500 = 50 % | |
| seuil de déclenchement, élément de 120 px | haut de l'élément **8 px au-dessus** du bas de la fenêtre, **7 %** de l'élément visible | | |
| seuil de déclenchement, élément de 643 px | non isolé | haut **128 px au-dessus** du bas, **20 %** visible | |
| seuil, élément de 154 px | non isolé | haut **92 px au-dessus**, **61 %** visible | |
| seuil, élément de 56 px | non isolé | haut **68 px au-dessus**, **100 %** visible | |
| règle du seuil | non lisible (JS compilé) | `IntersectionObserver` `threshold: 0.08`, `rootMargin: '0px 0px -8% 0px'` = -72 px sur 900 | notre seuil **dépend de la hauteur de l'élément** |
| cascade entre voisins | aucun délai CSS ; décalage piloté en JS | pas de 70 ms, 6 crans + un plancher à 420 ms (`mouvement.css:42-48`) | |

Le seuil qui dépend de la hauteur est une conséquence arithmétique de
`threshold: 0.08` : un bloc de 643 px doit exposer 51 px pour se déclencher, un
jeton de 56 px n'en doit que 4,5. Résultat mesuré : le grand bloc part quand il
est visible à 20 %, le petit jeton attend d'être visible à 100 %.

### 1.5 Le chargement, l'en-tête, le mouvement réduit

| dimension | morpho.org | nous | écart |
| --- | --- | --- | --- |
| éléments hors état de repos à t=0 ms | 30 | 37 | |
| idem à t=400 ms | 38 | 40 | |
| idem à t=1 500 ms | 35 | 40 | |
| calque dédié à la transition de page | **1** (`div.PageTransition…__root`, `position:fixed`, `z-index:99`, 0x0 au repos) | **0** | |
| en-tête, hauteur | **80 px** | **61 px** | -19 px |
| en-tête, fond | `rgba(0, 0, 0, 0)`, **totalement transparent** | `rgba(255,255,255,0.6)` | |
| en-tête, `backdrop-filter` | `none` | `blur(24px)` | |
| en-tête, filet bas | `0px` | `1px rgba(0,0,0,0.08)` | |
| en-tête, ombre | `none` | `none` | identique |
| l'en-tête change-t-il au défilement ? | **non** : identique à y=0, à y=1 200 et à la remontée à y=600 | **non** : identique aux trois mêmes positions | identique |
| `prefers-reduced-motion: reduce` | **ignoré** : 321 éléments gardent leurs transitions, mêmes durées 0,2 / 0,4 s | **honoré** : 581 éléments à `1e-05s` | nous sommes devant |

---

## 2. Les trois changements les plus payants

### 2.1 Faire porter à notre courbe 78 % des transitions au lieu de 15 %

**La mesure.** Sur 254 déclarations de transition rendues sur l'accueil,
198 (78 %) tournent sur `ease`, la courbe par défaut du navigateur, et 38 (15 %)
sur notre `cubic-bezier(.625,.05,0,1)`. Chez morpho, leur courbe maison porte
176 déclarations sur 389, soit 45 %, et `ease` n'apparaît **jamais** : ce qui
n'est pas sur leur courbe est sur `ease-out` ou `linear`, deux choix délibérés
pour de la couleur et de l'opacité.

L'origine est localisée : `commun/mouvement.css` lignes 52 à 57, six
déclarations qui écrivent `var(--dur-survol) ease` en toutes lettres. Ces six
lignes couvrent `.carte`, `.res-carte`, `.terme-carte`, `.ligne-liste`, `.btn`,
`.mega-item`, `.nav-declencheur`, `.pied ul a`, `.res-nav a`, `.sommaire a`,
c'est-à-dire tous les objets qu'on touche à la souris. Un seul `.btn` compte
pour 5 déclarations dans le total, ce qui explique la domination.

**Le coût.** 1 fichier, `commun/mouvement.css`, 6 lignes (52-57). Il faut aussi
décider du sort de trois jetons déclarés dans `base.css:100-104` qui ne sont
rendus nulle part sur cette page : `--ease-apple`, `--ease-luxury`,
`--ease-smooth`. Reconstruction des 25 pages ensuite.

**Ce que ça casse.** `cubic-bezier(.625,.05,0,1)` est une courbe à départ très
lent : à 20 % du budget, elle n'a parcouru que 7,1 % de la course, contre 30,7 %
pour `ease`. Posée telle quelle sur 0,15 s, elle rendrait les survols mous :
7,1 % de 0,15 s, cela signifie que rien ne bouge pendant les 30 premières
millisecondes du survol, et le survol est le geste où l'on attend une réponse
immédiate. C'est mesuré chez morpho aussi : ils ne mettent pas leur courbe
lente sur tout, ils gardent `ease-out` pour les 88 déclarations de couleur et
d'opacité à 0,2 s. Le changement honnête n'est donc pas « tout sur notre
courbe » mais « plus aucun `ease` par défaut » : soit `ease-out` explicite, soit
notre courbe, jamais l'implicite.

### 2.2 Rendre au survol de carte ses 200 ms, et le faire ajouter au lieu de retirer

**La mesure.** Sur `01-accueil-noir.html`, j'ai échantillonné la bordure d'une
`.carte-encre` à chaque image après l'entrée du pointeur : la valeur est à
`rgba(255,255,255,0.22)` **dès la première image lue (0 ms)** et n'a bougé sur
aucune des 22 images suivantes jusqu'à 351 ms. La bordure ne s'anime pas, elle
saute. Chez morpho, le geste équivalent, `background-color`
`rgba(255,255,255,0.05)` -> `0.15`, est explicitement transitionné sur
**0,2 s `ease-out`**. L'amplitude est la même (+0,10 chez eux, +0,11 chez nous),
c'est le temps qui manque.

La cause est nette. `commun/mouvement.css:51` déclare la transition de survol
pour `.carte, .res-carte, .terme-carte, .ligne-liste`. **`.carte-encre` n'y est
pas.** Elle ne récupère donc que `composants.css:161`
(`transition: box-shadow var(--dur-normal) var(--ease-apple)`), et dès qu'un
attribut `[data-anim]` est posé dessus, `mouvement.css:30-32` réécrit la
propriété entière en `opacity, transform`. Mesure du calcul final sur la page :
`opacity, transform :: 0.5s, 0.5s`. Il n'y a plus de `border-color` dans la
liste, donc 0 ms.

Ce n'est pas un cas marginal : les trois cartes de features de l'accueil sont
exactement `carte-encre p32 feature-large` et `carte-encre p48`, mesurées comme
telles.

Deuxième moitié du même point : en régime clair, le survol d'une carte fait
passer `box-shadow` de `1.6px 3.7px 8.4px rgba(194,194,194,0.10)` à `none`
(`composants.css:165`, `.carte:hover,.carte-encre:hover{box-shadow:none;
transform:none}`). Pointer une carte lui **retire** son ombre. Chez morpho,
survoler ajoute toujours : +0,10 d'alpha sur le fond, +0,10 sur le bouton
arrondi, `saturate(0)` -> `saturate(1)` sur les logos, `opacity` 0,6 -> 1 sur le
conteneur de flèche. Zéro soustraction sur les 18 cibles qui répondent.

**Le coût.** 2 fichiers : `commun/mouvement.css` (ajouter `.carte-encre` à la
liste ligne 51) et `commun/composants.css` (lignes 165 et 170). 3 lignes.
Reconstruction des 25 pages.

**Ce que ça casse.** Ajouter `.carte-encre` à `mouvement.css:51` fait revenir
`transform` dans la liste des propriétés transitionnées de la carte. Or la carte
porte déjà `transform` pour sa révélation au défilement, sur 0,5 s. Les deux
déclarations se disputeront la même propriété et la dernière du cascade gagnera :
si c'est celle du survol (0,05 s), la révélation de 12 px se fera en 50 ms au
lieu de 500. Il faut lister les propriétés une par une, pas s'appuyer sur
l'ordre. C'est exactement le genre de recouvrement silencieux que je ne peux pas
trancher sans reconstruire et remesurer.

### 2.3 Désynchronisation du bouton : 0,05 s pour le mouvement, 0,15 s pour tout le reste

**La mesure.** Tous les boutons mesurés rendent
`background, border-color, color, transform, box-shadow :: 0.15s, 0.15s, 0.15s,
0.05s, 0.15s`. Le `translateY(-1px)` arrive donc en 50 ms, la couleur et l'ombre
en 150 ms : le mouvement est **3 fois plus rapide** que ce qu'il accompagne. Sur
morpho, aucun bouton ne mélange deux durées ; les 11 boutons relevés tiennent
sur une durée unique (0,4 s pour les boutons arrondis, 0,2 s pour le reste), et
0 sur 11 ne se déplace au survol.

Un `translateY(-1px)` sur 0,05 s est par ailleurs un déplacement d'un pixel en
trois images. Il n'est pas lu comme un mouvement, il est lu comme un
tressaillement.

**Le coût.** 1 fichier, `commun/mouvement.css`, lignes 53 et 55, deux
occurrences de `transform 0.05s ease`. Reconstruction des 25 pages.

**Ce que ça casse.** Rien de structurel. Deux options mesurables : porter le
`transform` à `var(--dur-survol)` (150 ms) pour que le bouton se lève avec sa
couleur, ou retirer le `translateY(-1px)` et suivre morpho, qui ne fait bouger
aucun bouton et fait tout passer par l'alpha. La seconde option supprime aussi
le repeint de layout au survol. Elle change en revanche la sensation du bouton,
ce qui est un choix de DA, pas une correction.

---

## 3. Arbitrages pour Naomie, à ne pas trancher sans elle

Ces points touchent un jeton de la DA fixée. Je les signale, je ne décide pas.

1. **`--dur-reveal` à 0,5 s contre 0,392 s mesuré chez eux.** Leur révélation
   dure 392 ms et a franchi la moitié de sa course à 108 ms. La nôtre dure
   500 ms et franchit la moitié à 203 ms. Le temps mort avant que quelque chose
   bouge est de 27 ms chez eux et de 86 ms chez nous. Descendre `--dur-reveal`
   à 0,4 s rapprocherait les deux, mais 0,5 s est le chiffre de la DA
   (`0,5 s bezier(.625,.05,0,1)`, référence Framer mesurée). À trancher.

2. **Sept distances de révélation contre une.** Nous déclarons
   `translateY(22/18/12px)`, `translateX(26/-26/-24px)` et `scale(0.985)`
   (`mouvement.css:24-29`, `mouvement.css:38`, `composants.css:821-822`). Ils en
   ont une seule, `scale(0.96)`, partout. Réduire à une ou deux est le
   changement le plus visible de tout ce relevé, mais c'est une décision de
   grammaire, pas un défaut.

3. **Le seuil de révélation qui dépend de la hauteur du bloc.** Avec
   `threshold: 0.08`, un bloc de 643 px se déclenche à 20 % de visibilité et un
   jeton de 56 px à 100 %. Chez eux, un bloc de 120 px se déclenche à 7 % de
   visibilité, dès que son bord haut passe le bas de la fenêtre. Passer d'un
   seuil en pourcentage à un seuil en pixels (par exemple `rootMargin`
   `0px 0px -80px 0px` avec `threshold: 0`) rendrait le déclenchement identique
   pour tous les blocs. Cela change le rythme de toutes les pages.

4. **Le `cursor: pointer` sur 43,9 % de nos éléments contre 24,1 % chez eux.**
   Presque un élément sur deux se présente comme cliquable chez nous. Vérifier
   si ces 264 éléments sont tous réellement cliquables relève d'un autre relevé,
   mais l'écart de 19,8 points est réel.

5. **L'en-tête : 61 px givré chez nous contre 80 px totalement transparent chez
   eux.** Aucun des deux ne réagit au défilement, c'est mesuré aux trois mêmes
   positions. Leur en-tête n'a ni fond, ni flou, ni filet. Le nôtre a les trois.
   C'est un choix de composition, pas de mouvement, mais il conditionne ce que
   le hero peut faire passer dessous.

6. **Nous n'avons pas de calque de transition de page, ils en ont un.** Un
   `div` fixe en `z-index: 99` réservé à la transition entre pages. Si les 25
   maquettes deviennent un site, c'est la brique qui manque. Hors périmètre du
   présent relevé.

---

## 4. Ce que je n'ai pas réussi à mesurer

1. **La durée exacte de la cascade entre voisins chez morpho.** Ils n'utilisent
   aucun `transition-delay` CSS : 0 valeur non nulle sur 2 705 éléments. Le
   décalage est donc piloté en JavaScript. J'ai bien observé deux `IMG` de même
   classe se révéler à des seuils différents (l'une à 7 % de visibilité, l'autre
   à 100 %), ce qui est la signature d'une cascade, mais je n'ai pas isolé le
   pas en millisecondes. Notre pas, lui, est lisible : 70 ms, 6 crans
   (`mouvement.css:42-48`).

2. **La courbe exacte de leur révélation.** Mesurée image par image
   (opacité 0 -> 1 en 392 ms), mais elle est écrite en JavaScript image par
   image : le CSS calculé rend `transitionDuration: 0s`, il n'y a aucune courbe
   à lire. J'ai testé l'hypothèse « c'est leur `cubic-bezier(0.36,0.2,0.07,1)`
   sur 0,4 s » contre mes 11 échantillons : l'écart absolu moyen est de 0,071
   sur une course de 1, avec des écarts de 0,14 en début de course. **Ce n'est
   pas cette courbe.** Je ne peux pas nommer la leur.

3. **Le survol du corps d'une carte chez morpho.** Leurs blocs de contenu sont
   des `<a>` sans zone neutre : le point que je vise appartient toujours à un
   enfant interactif. Sur les 21 cibles, aucune ne m'a permis d'isoler un
   « survol du fond » comparable à notre `.carte-encre`. La comparaison du
   point 2.2 se fait donc entre leur lien-bloc et notre carte, ce qui est le
   plus proche disponible, pas un équivalent strict.

4. **Leur transition entre pages.** Le calque existe et est identifié
   (`div.PageTransition…__root`, `z-index: 99`), mais mon clic est tombé sur le
   logo, dont le `href` vaut `/` : aucune navigation n'a eu lieu et le mouchard
   n'a enregistré aucun état. Je ne sais donc pas ce que ce calque fait, ni
   combien de temps.

5. **La révélation d'un bloc de plus de 400 px chez morpho.** Trois `PICTURE` de
   480 px sont restées à `opacity: 0` et `scale(0.96)` malgré 60 crans de
   molette et un défilement programmé complet. Elles appartiennent
   vraisemblablement à un carrousel qui ne s'active pas dans un navigateur
   piloté. Les 392 ms rapportés viennent d'une `IMG` de 120 px, seul élément
   capturé de bout en bout. Je ne sais pas si leurs grands blocs suivent la même
   durée.

6. **Le survol des logos partenaires de notre côté.** Chez eux, mesuré :
   `opacity` 0,5 -> 1 et `filter` `saturate(0)` -> `saturate(1)` sur 0,2 s. Sur
   notre accueil, aucune rangée de logos survolable n'a été trouvée par le
   balayage. La ligne du tableau est donc vide, pas nulle.

7. **Le comportement sur écran tactile et à d'autres largeurs.** Tout ce
   rapport tient à 1440x900. Aucune mesure en dessous.
