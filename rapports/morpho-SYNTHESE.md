# Synthèse du relevé morpho.org

Cinq lentilles (typographie, rythme, couleur, mouvement, structure), relevées le
27/08/2026 au navigateur à 1440x900. Cette synthèse ne remesure rien : elle
arbitre entre les cinq, écarte ce qui ne tient pas, et vérifie au **source**
(`commun/*.css`, `pages/*.html`) les points sur lesquels un palier 1 repose.

Aucun fichier du chantier n'a été modifié.

---

## 0. Trois vérifications faites ici, qui changent les conclusions

### 0.1 On n'édite pas `sortie/`. C'est de la sortie de build.

Les lentilles **typo** et **couleur** chiffrent leurs propositions en « éditions
répétées dans le CSS inliné de chacun des 24 gabarits ». C'est faux.

`construire.mjs` (lignes 204 à 209) lit `commun/base.css`, `commun/regime-noir.css`,
`commun/composants.css`, `commun/mouvement.css` et les inline dans chaque page.
Son en-tête dit : « un extracteur genere, on n'edite jamais la sortie a la main ».

Vérifié : `.cf-ref`, `.surtitre`, `.marqueur`, `.fil-ariane`, `.cf-etape`,
`.cf-cite`, `.cf-question`, `.citation`, `.t-caption`, `.t-label`, `.t-body-lg`
sont **tous** dans `commun/`, avec **0 occurrence** dans `pages/*.html`.

**Conséquence.** Le coût des propositions typo 2.2 et 2.3 est surestimé d'un
facteur ~24 : ce ne sont pas 150 éditions, ce sont 8 déclarations dans
`commun/composants.css` plus un rebuild. C'est ce qui les fait monter en palier 1.
Même chose pour couleur 2.2 : ce ne sont pas « 4 fichiers plus le CSS source »,
ce sont **3 valeurs de jeton dans 2 fichiers** (`base.css:32`, `base.css:35`,
`regime-noir.css:18`).

### 0.2 Le CSS s'annule lui-même en silence. C'est le vrai défaut du chantier.

Trois lentilles ont chacune trouvé **une** instance du même mécanisme, aucune ne
l'a nommé. Mesuré ici : **41 sélecteurs sont déclarés plus d'une fois hors media
query dans le seul `commun/composants.css`**, pour 44 occurrences en double.

Trois cas prouvés, tous du même motif « une passe ajoute ses règles à la fin du
fichier au lieu de corriger celles du dessus » :

| sélecteur | déclarations | qui gagne | ce qui meurt |
|---|---|---|---|
| `.entete-section` | `composants.css` 189, 620, 748 | 748 (`mb:72; gap:14`) | la l.620 `mb:112` de la passe « L'AIR », annoncée par le commentaire l.617 |
| `.hero-epure .t-hero` | `composants.css` 723, 757 | 757 (`clamp(2rem,3.2vw,3rem)` = 46,08) | la l.723 `clamp(2.25rem,4.2vw,3.5rem)` = 60,48, commentée « relevé sur morpho.org » |
| `.t-caption` / `.t-label` | `base.css` 135-136 (13 px / 11 px) contre `composants.css` 743-744 (12 px / 10 px) | composants | l'échelle déclarée dans base.css |

Le commentaire de `composants.css:720` dit « relevé sur morpho.org » et pose un
hero à 60,48 px ; 34 lignes plus bas, une passe « lemrock » le ramène à 46,08 px
sans le dire. Le commentaire de `composants.css:617` dit « L'AIR, padding de
section 160 px » et pose 112 px ; 128 lignes plus bas la même règle revient à 72.

**Conséquence opérationnelle.** Toute édition d'un de ces 41 sélecteurs a une
chance sur deux de ne rien produire et de passer pour un échec d'édition. Ce
nettoyage précède les trois items du palier 1 ; il n'est pas optionnel.

### 0.3 La barre de nav de morpho : les deux lentilles se contredisent, la donnée brute tranche

- **Structure** : 3 états, classe `_isDetached`, fond `#121212`, filet 1 px, `translateY(-80px)`.
- **Mouvement** : « l'en-tête change-t-il au défilement ? **non**, identique à y=0, y=1200 et à la remontée ».

Tranché **pour la structure**, sur son propre JSON brut. `morpho-raw.json`
contient un bloc `navScrolled` où le DIV racine porte
`Header-module-scss-module__ncg-zG___isDetached` et où le `<header>` **enfant**
rend `background: rgb(18,18,18)` et `border 1px rgba(255,255,255,0.15)`, contre
`rgba(0,0,0,0)` au repos.

La raison du faux négatif est lisible dans la même donnée : le DIV racine reste
`rgba(0,0,0,0)` **dans les deux états**. La lentille mouvement a lu le
conteneur ; le changement vit sur l'enfant.

**Réserve honnête.** Dans ce même bloc brut, le rect lu est `top: 0, h: 80,
pos: fixed`. Le passage du transparent à l'opaque est donc établi ; le
`translateY(-80px)` (la barre qui sort de l'écran en descente) ne l'est pas.
**Deux états prouvés, le troisième à re-mesurer avant de le copier.**

---

## 1. Les contradictions entre lentilles, et sur quoi je tranche

**C1. Interligne 1,60 : la justification du rythme est fausse, la proposition reste bonne.**
Rythme C écrit « nos paragraphes font 426 à 560 px contre 480 à 640 chez eux,
donc moins de caractères par ligne, ce qui joue en notre faveur ». Typo 1.3
compte directement : **59,5 signes par ligne chez nous contre 50,0 chez eux**
(médiane), 30,1 em contre 24,0 em. Je tranche sur le comptage direct : la
déduction du rythme confond largeur en pixels et longueur de ligne, parce que
notre corps est plus petit (15 contre 16), donc la même boîte porte plus de
signes. `15 x 1,60 = 24,00` reste juste et sur la grille, mais l'argument de
lisibilité est inversé : il faut plafonner la mesure en même temps.

**C2. Séparer par la couleur contre remonter le contraste : ce n'est pas une contradiction.**
Typo 2.3 veut séparer les niveaux par la couleur plutôt que par la taille.
Couleur 2.2 veut supprimer tout ce qui passe sous 4,5:1, « ce qui casse la
hiérarchie fondée sur la pâleur ». Je tranche sur la mesure de **leur** gris :
`rgb(156,157,159)` sur `#181818` vaut **6,54:1**, et leur pire ratio de page
entière est **4,93:1**. Ils séparent par la couleur **sans jamais descendre sous
4,5:1**. Les deux propositions sont donc la même, et c'est la remontée du
contraste qui rend la séparation par couleur possible. D'où le palier 1 item 3.

**C3. Faut-il raccourcir ou allonger la page ?**
Rythme retire 49 px et redistribue 200 à 400 px ; structure ajoute 432 px ; typo
ajoute de la hauteur sur les petits textes et en retire 43 sur la citation. Je
tranche sur la mesure de densité : nous sommes **3,6x plus denses en signes par
pixel**, notre air moyen entre deux blocs vaut **148 px contre 275**, et notre
facteur vide/plein vaut **6,1 contre 247**. Le problème n'est pas la longueur de
la page, c'est que l'air n'est pas placé. Donc : **on ne raccourcit pas, on
redistribue** (palier 1 item 1, coût zéro pixel). Les +432 px de structure 3.2
restent un arbitrage, pas un réglage.

**C4. Le hero : trois intentions, non, quatre.**
Typo en compte 3. Vérifié au source, il y en a **4** :
`base.css:128` = 48,96 · `composants.css:723` = 60,48 · `composants.css:757` =
46,08 (gagne) · `regime-noir.css:59` = 60,00 (perd sur spécificité 0-1-0 contre
0-2-0). Je tranche sur la DA : **le jeton dit 49, donc 49 est la vérité**, et les
trois autres déclarations sont à supprimer, pas à départager. Le 60 en graisse
300 reste un arbitrage explicite si Naomie le veut, pas une correction.

**C5. « Leurs entrées de nav sont à 16 px » : vérifié, ça tient.**
`nav2.json` lit `fs: 10px` sur les mêmes `menuLink`, ce qui contredit le tableau
de la lentille structure. Résolu : le 10 px est le DIV enveloppe, le texte vit
dans un enfant. `morpho.dom.json` ne contient que **cinq** tailles sur toute la
page (13 px pour le bloc de code, puis 16, 20, 32, 60) et **aucune sous 13 px**.
Le 16 px tient, et le chiffre « leur plus petite taille de prose est 16 px » aussi.

---

## 2. PALIER 1, le geste qui change tout

### 1.1 Faire rendre ce qui est déjà déclaré

**La mesure.** Quatre déclarations concurrentes pour `.t-hero`, trois pour
`.entete-section`, deux échelles pour `.t-caption`/`.t-label`, 41 sélecteurs en
double dans `composants.css`. Effets visibles aujourd'hui : le hero rend
**46,08 px au lieu des 49 du jeton** (-6,0 %), le fichier noir rend le hero
**identique au pixel près au fichier clair** alors qu'il déclare 60 px en graisse
300, et le rapport hero/display tombe de 1,45 en clair à **1,15 en noir**, où les
deux niveaux se confondent.

**Ce qu'on fait.** On garde une seule déclaration par sélecteur, celle qui dit la
DA. `.t-hero` = 49 (jeton). `.t-caption` = 12, `.t-label` = 10 (jetons, donc
`composants.css` a raison et `base.css` a tort, à corriger dans base.css et à
supprimer dans composants). `.entete-section` : une seule des trois valeurs, et
c'est une décision à prendre explicitement, pas par ordre de ligne.

**Fichiers.** `commun/composants.css` (189/620/748, 723/757, 743/744),
`commun/base.css` (128, 135, 136), `commun/regime-noir.css` (59). Puis
`node construire.mjs`.

**Ce que ça casse.** Le hero passe de 46,08 à 48,96 px, soit +6,3 %. La ligne
« Vendez partout. Conformez-vous partout. » rend 800 px à 46,08 ; à 48,96 elle
fait 851 px, elle tient largement dans les 1 040 px de contenu. Le bloc hero
grandit d'environ 3 px. C'est le changement le moins risqué du relevé et le seul
qui ramène la page sur sa propre DA.

**À re-vérifier après.** `min/max(fontSize)` sur les 25 pages, pas sur l'accueil
seule ; `.t-hero` rendu = 48,96 partout où `.hero-epure` est posée ; le hero du
fichier noir doit maintenant différer du clair ou avoir été explicitement aligné ;
la hauteur des 7 pages qui portent `.entete-section` (01, 01-en, 02, 04, 05, 09, 18).

---

### 1.2 Ramener les 13 tailles rendues sur les 8 crans de l'échelle

**La mesure.** Ils rendent **4 tailles, 4 paires taille+graisse, 8 triples
taille+graisse+couleur** pour 1 261 signes de prose. Nous rendons **13 tailles,
25 paires, 49 triples** pour 5 182 signes : 6,1x plus de combinaisons pour 4,1x
plus de texte. Dix de nos treize tailles tiennent dans une bande de 9 px (18 à 9)
et portent 87,7 % du texte ; les échelons de cette bande valent 1,06 à 1,11,
**aucun n'est perceptible**. Leur plancher de prose est 16 px sur 7 568 px de
page ; le nôtre est 9 px sur 8 845 px, et **68,6 % de nos signes sont sous leur
plancher**.

Les valeurs hors échelle, relevées au source : 17 (`.citation`), 14 (`.btn`,
`.coches li`, `.mesures .libelle`, `.t-sm`), 13 (`.btn-sm`, `.nav-declencheur`,
`.mega-item b`, `.mega-liste a`), 11,5 (`.ecran-tete .fil-ariane`, `.cf-etape`),
11 (`.surtitre`, `.marqueur`, `.cf-question`), 9 (`composants.css:260`, `:349`).

**Ce qu'on fait.** Chaque taille rendue atterrit sur un des huit crans
49/32/24/18/16/15/12/10. Ce n'est pas « remonter le plancher à 12 » (ce serait
tuer `.t-label` 10, qui est un jeton) : c'est « zéro taille hors échelle ».

**Fichiers.** `commun/composants.css` pour l'essentiel (8 déclarations),
`commun/base.css` pour la réparation des jetons, `commun/regime-noir.css` pour ses
propres surcharges. Puis rebuild.

**Ce que ça casse, honnêtement.** Le 14 px porte **25,4 % des signes de la page**,
c'est la part la plus lourde de toutes ; le passer à 15 déplace un quart du texte
de l'accueil et touche tous les boutons. `.cf-etape` et `.cf-cite` vivent dans le
bloc d'animation du hero dont la hauteur est calée. `.marqueur` à 11 px est la
pastille « DONNÉE MANQUANTE » dans une fiche de 340 px : elle s'élargit d'environ
9 %. `.citation` de 17 à 15 fait passer le bloc de 10 lignes à 9, soit -43 px, et
remonte tout ce qui suit dans la section témoignage.

**À re-vérifier après.** Nombre de tailles rendues <= 8, zéro taille hors des huit
crans, sur les 25 pages. Et surtout : **alignement du bas de chaque carte de
chaque grille avant et après**, colonnes d'une même `.g3` à moins de 1 px l'une de
l'autre. Rappel du 27/08 sur `02-entreprise` : le retrait d'une rangée coûtait
40 px et non 12.

---

### 1.3 Séparer par la couleur, à contraste tenu

**La mesure.** Hors coloration syntaxique, morpho utilise **3 couleurs de texte
déclarées** et **0 bloc sur 320 ne descend sous 4,5:1** ; leur pire ratio de page
est 4,93:1. Nous utilisons 12 couleurs en clair, 16 en sombre, et **25 blocs sur
163 (15,3 %) en clair puis 22 sur 164 (13,4 %) en sombre passent sous 4,5:1**.

Trois jetons portent la totalité du problème :

| jeton | fichier:ligne | aujourd'hui | ratio | cible calculée |
|---|---|---|---|---|
| `--c-text-3` (clair) | `base.css:32` | `rgba(0,0,0,0.45)` | 3,31 à 3,35:1 | **0,54** |
| `--c-text-on-dark-3` | `base.css:35` | `rgba(255,255,255,0.38)` | 3,55:1 | **0,45** |
| `--c-text-3` (sombre) | `regime-noir.css:18` | `rgba(255,255,255,0.34)` | 3,09:1 | **0,47** |

Plus environ 8 littéraux `rgba(0,0,0,0.45)` en dur dans `regime-noir.css:78-99`
qui doivent suivre.

**Ce que ça débloque.** C'est la condition de l'item typo. Chez eux, dans le
panneau « Embed custom earn products », titre et description sont **tous deux à
20 px graisse 400**, séparés par la seule couleur (`rgb(255,255,255)` contre
`rgb(156,157,159)`), rapport de taille **1,00**. Notre carte équivalente utilise
24 px contre 14 px, rapport **1,71**. On ne peut pas séparer par la couleur tant
que la couleur atténuée est de la pâleur illisible ; leur gris atténué est à
**6,54:1**, pas à 3,3.

**Ce que ça casse.** Notre hiérarchie de surtitres et de légendes repose
aujourd'hui sur la pâleur. À 4,5:1, le surtitre 11 px arrive au même poids
optique que le corps 15 px, et la distinction doit passer par la taille, la casse
et l'interlettrage. À regarder au rendu sur les cartes où surtitre et titre se
touchent.

**À re-vérifier après.** Zéro bloc sous 4,5:1 sur les trois pages mesurées, puis
sur les 25 ; nombre de niveaux de contraste distincts <= 4 ; et une passe à l'oeil
sur les cartes, parce que ce changement se juge, il ne se compte pas.

---

## 3. PALIER 2, les réglages

| # | ce qu'on fait | la mesure qui le fonde | fichiers | à re-vérifier |
|---|---|---|---|---|
| 2.1 | Plus aucun `ease` implicite. `ease-out` explicite pour la couleur et l'opacité, notre courbe pour ce qui parcourt une distance. | 198 déclarations sur 254 (**78 %**) tournent sur le défaut du navigateur ; chez eux `ease` n'apparaît **jamais**, leur courbe porte 45 % et le reste est `ease-out` ou `linear`. | `commun/mouvement.css` 51-57 | 0 `ease` implicite au calcul ; et notre courbe n'a parcouru que 7,1 % de sa course à 20 % du budget, donc ne pas la poser sur 0,15 s de survol |
| 2.2 | Ajouter `.carte-encre` à la liste de survol, et cesser de **retirer** l'ombre au survol. | La bordure d'une `.carte-encre` est à `rgba(255,255,255,0.22)` dès la première image et n'a pas bougé sur 22 images jusqu'à 351 ms : elle saute. Chez eux, même amplitude (+0,10 d'alpha) sur **0,2 s ease-out**. Et `composants.css:165` fait passer `box-shadow` à `none` au survol, alors que sur les 18 cibles de morpho qui répondent il n'y a **aucune soustraction**. | `commun/mouvement.css:51`, `commun/composants.css:165` | **Lister les propriétés une par une** : `transform` est déjà pris par la révélation à 0,5 s, la dernière déclaration du cascade gagne et la révélation de 12 px pourrait se faire en 50 ms |
| 2.3 | Resynchroniser le bouton : `transform 0.05s` -> `var(--dur-survol)`, ou retirer le `translateY(-1px)`. | Tous les boutons rendent `0.15s, 0.15s, 0.15s, **0.05s**, 0.15s` : le mouvement arrive 3x plus tôt que la couleur. Un pixel en trois images se lit comme un tressaillement. Chez eux, 0 bouton sur 11 mélange deux durées, et 0 sur 11 ne se déplace. | `commun/mouvement.css` 53 et 55 | rien de structurel ; retirer le translateY supprime aussi le repeint de layout |
| 2.4 | `.t-body` interligne 1,72 -> 1,60. | `15 x 1,60 = 24,00` exactement, multiple de 4 et de 8, contre 25,8 aujourd'hui qui n'est ni l'un ni l'autre. 27 lignes de corps sur l'accueil, 49 px gagnés, 27 lignes qui retombent sur la grille. Eux : **une seule** valeur, 1,60, sur 16 px comme sur 20 px ; nous quatre (1,60/1,66/1,70/1,72). | `commun/base.css:133`, 1 déclaration | Voir C1 : coupler à un plafond de mesure et **exiger une médiane de signes par ligne <= 55** (aujourd'hui 59,5, eux 50,0). Puis alignement de bas de carte, même témoin que 2.5 |
| 2.5 | Ramener l'espacement sur la grille de 4 déjà déclarée. | **39,8 %** de nos 571 espacements sur un multiple de 4 contre **92,6 %** chez eux ; 35 valeurs distinctes contre 17 ; **26,1 %** seulement passent par un jeton `--s-*`. Les fuyards sont concentrés : 10px x61, 7px x45, 9px x45, 13px x42, 14px x42, 11px x37. | 345 littéraux : `commun/composants.css` 123, `pages/*.html` 222. `base.css`, `regime-noir.css`, `mouvement.css` sont déjà à 0 | **Le seul item de ce palier qui peut déplacer une mise en page.** Témoin obligatoire : bas de chaque carte de chaque grille, avant et après, sur les 24 pages, colonnes d'une `.g3` à moins de 1 px |
| 2.6 | Resserrer le vocabulaire des filets : supprimer les 4 variantes qui n'apparaissent que 1 à 4 fois, aligner les deux régimes. | Ils peignent 48 côtés avec 3 combinaisons dont une transparente, en pratique **une seule valeur** (45 fois sur 48). Nous peignons 95 côtés avec 6 combinaisons en clair et 9 en sombre. | `commun/base.css:38,41`, `commun/regime-noir.css:20,23` | `--c-border` à **0,13** donne 1,35:1, soit la parité avec notre propre régime sombre (écart actuel entre nos deux régimes : 16 %). Aller à 0,195 pour égaler leur 1,577:1 est un arbitrage, voir §6 |
| 2.7 | Corriger le pire ratio du chantier : `#0008CF` 15 px sur `#212121` = **1,48:1** (`.t-body` « Voir les autres cas », `01-accueil-noir.html`). | Pire ratio des trois pages mesurées, très loin des 4,93:1 de leur pire cas. | `commun/regime-noir.css` | Deux sorties sans nouveau jeton : blanc, ou `--c-periwinkle #8A93FF` (6,87:1). Faire de #8A93FF **le** jeton d'accent-texte en sombre engage tout le site, voir §6 |
| 2.8 | `--pad-section` en régime sombre : 148 -> 144 ou 152. | 148 n'est ni un multiple de 8 ni un jeton `--s-*`, et explique la totalité des +386 px de hauteur du fichier noir (+20+20+50+50+78+20+108+40). | `commun/regime-noir.css:53` | hauteur du fichier noir après ; aérer davantage le sombre reste légitime, le faire hors grille ne l'est pas |

---

## 4. PALIER 3, les détails

1. **Donner un titre et des liens aux 4 logos clients.** Aujourd'hui : bandeau
   isolé de 180 px, **0 titre, 0 lien**. Chez eux : 19 tuiles 160x160 **toutes
   cliquables** vers 17 pages clients nommées, placées **dans** les panneaux de
   feature. Densité de liens dans le corps : 4,4 pour 1 000 px chez eux, **1,36**
   chez nous. La version minimale (titrer et lier les 4 logos autorisés) coûte
   trois lignes et ne demande aucune décision de citabilité nouvelle.
2. **Auditer `cursor: pointer`.** 264 éléments sur 601, soit **43,9 %**, contre
   24,1 % chez eux. Presque un élément sur deux se présente comme cliquable.
   Vérifier lesquels le sont vraiment est un autre relevé.
3. **Supprimer les jetons morts.** `--dur-slow` (0 usage de `var()`),
   `--ease-out` et `--ease-smooth` (0 usage), `--ease-apple` et `--ease-luxury`
   (déclarés, rendus nulle part). Et trancher `.t-h2` : 0 occurrence sur
   l'accueil, 53 sur 11 des 24 gabarits.
4. **Corriger les commentaires qui mentent.** `composants.css:617` annonce une
   passe « L'AIR » à 112 px que la l.748 annule ; `composants.css:720` annonce
   « relevé sur morpho.org » et pose un hero à 60,48 px que la l.757 annule. Un
   commentaire faux coûte plus cher qu'une valeur fausse.
5. **Le seuil de révélation en pixels plutôt qu'en pourcentage.** Avec
   `threshold: 0.08`, un bloc de 643 px se déclenche à 20 % de visibilité et un
   jeton de 56 px à 100 %. Chez eux un bloc de 120 px part à 7 %, dès que son
   bord haut passe le bas de la fenêtre. `rootMargin: '0px 0px -80px 0px'` avec
   `threshold: 0` rendrait le déclenchement identique pour tous les blocs. Change
   le rythme de **toutes** les pages : à faire d'un coup, ou pas du tout.
6. **Le pied.** 1 361 px, 43 liens, 8 colonnes, soit **15,4 % de notre page**,
   contre 793 px, 21 liens, 4 colonnes chez eux (10,5 %).
7. **Les panneaux déroulants au contenu.** Leurs `popOver` font 530x201, 375x234,
   174x264 et s'ancrent sous leur déclencheur (x = 497 / 631 / 891). Nos six
   `.mega` font tous 1360x232 ancrés à x=40, **5,9x moins denses** en liens.

---

## 5. Ce que morpho fait que nous ne faisons pas du tout

Ce ne sont pas des écarts de réglage. Ce sont des motifs absents de notre
vocabulaire.

1. **Une scène épinglée qui coûte 30,6 % de la page pour une seule idée.**
   2 314 px de défilement, 258 caractères, **0 CTA**, un conteneur `fixed` de
   528x900 au `top: 0` et trois couches de texte (820 / 900 / 594 px) qui
   défilent au travers. Notre hero fait 954 px (10,8 %) et défile normalement.
   Nous n'avons **aucun épinglage** sur les 25 pages.
2. **Le contraste vide/plein comme instrument de rythme.** Leur densité va de
   **7,5 à 1 855 signes / 100 px**, soit un facteur **247** (3,4 hors bloc de
   code). La nôtre va de 16 à 98, facteur **6,1**. Nous n'avons ni vrai vide ni
   vraie masse : tout est à mi-hauteur.
3. **La bande de transition de 200 px.** Leur motif le **plus répété** (4 fois,
   aux y 4 236 / 5 395 / 6 119 / 6 575). Chez nous les champs se touchent et
   basculent d'un coup (`#F9F8F6` -> `#0F0E0D` à y=2298).
4. **L'accent comme surface porteuse, jamais comme ponctuation.** Trois champs de
   576x500, soit **exactement la moitié de leur conteneur**, en alternance
   gauche/droite sur trois panneaux consécutifs, **0 texte posé dessus**, la
   capture produit posée dessus. Leur accent peint **3,940 %** de la page,
   concentré à 96,1 % dans ces trois blocs. Le nôtre peint **0,036 %** réparti sur
   onze objets dont le plus grand fait 104x40. Écart de 109x en peinture, 69x sur
   le plus gros objet.
5. **La preuve client à l'intérieur du contenu.** 19 tuiles logo dans les
   panneaux de feature, ouvrant **17 pages clients nommées**. Nos 4 logos vivent
   dans un bandeau isolé, muet, et notre accueil atteint **1** destination de
   preuve (atteinte 2 fois).
6. **Un chiffre vivant en haut de page.** Deux compteurs à 20 px sous des
   libellés de 16 px, à x=64 et x=282, y=836. Nous n'avons **aucun chiffre** sur
   l'accueil. (Attention : nous n'avons pas non plus la source pour en poser un,
   voir §7.)
7. **L'artefact brut montré tel quel.** Une carte 864x497 contenant un vrai
   fichier `.sol` coloré, 19 lignes visibles, numéros de ligne `sticky`, lien
   Github. **94,1 % des signes de leur page** sont dans ce bloc. Nous montrons une
   maquette de chat, ce qui n'est pas la même démonstration.
8. **Une clôture qui est le sommet typographique de la page.** Leur H2 de clôture
   fait **60 px**, le plus gros caractère de leur site, sous **une seule** pilule.
   Le nôtre fait 31,68 px, au même cran que tous nos autres H2, sous **deux**
   pilules. Chez eux le plus gros caractère est à la fin ; chez nous il est au
   début et rien après ne le dépasse.
9. **Une barre de nav qui a des états.** Transparente sur le hero (fond et filet
   tous deux à alpha 0, donc **aucune couture**), opaque `#121212` avec filet 1 px
   en défilement. La nôtre est givrée en permanence et trace une couture nette à
   y=61 sur 1 440 px par-dessus le hero `#0F0E0D`.
10. **Un calque de transition de page.** `div` fixe en `z-index: 99`, 0x0 au
    repos. Nous n'en avons pas. Si les 25 maquettes deviennent un site, c'est la
    brique qui manque.
11. **Zéro photographie.** 0 sur 83 images, uniquement des captures produit et
    des logos. Nous : 6 photographies sur 17 images, du reportage.
12. **`cursor: grab` sur 19 éléments.** Quelque chose, chez eux, se saisit. Chez
    nous : 0.
13. **Zéro `transition-delay` CSS sur 2 705 éléments.** Leur cascade entre
    voisins existe (deux images de même classe se révèlent à des seuils
    différents) mais elle est pilotée en JavaScript. Nous avons 6 crans de 70 ms
    plus un plancher à 420 ms écrits en CSS.
14. **Une seule distance de révélation.** `scale(0.96)`, partout. Nous en avons
    **sept** : `translateY(22/18/12px)`, `translateX(26/-26/-24px)`,
    `scale(0.985)`.

Deux motifs où **nous** sommes devant, pour l'équilibre : `prefers-reduced-motion`
est honoré chez nous (581 éléments à 1e-05s) et **ignoré chez eux** (321 éléments
gardent leurs transitions) ; et nous répétons davantage nos motifs (2,00 instances
par motif contre 1,71), l'écart n'étant pas dans le nombre de motifs mais dans ce
que le motif répété transporte.

---

## 6. Arbitrages pour Naomie, groupés

Chacun touche un jeton de la DA fixée (champ `#0F0E0D`, accent `#0008CF`,
Satoshi, conteneur 1120, échelle `.t-hero` 49 à `.t-label` 10). Aucun n'est
décidé ici.

**Sur l'échelle typographique**
- **Le corps à 15 ou 16 px.** Leur 16 px en FK Grotesk lit comme du **16,83 px**
  en Satoshi (hauteur d'oeil mesurée 8,15 contre 7,26), soit **12,2 % de plus**
  que nos 15. `.t-body` est un jeton.
- **La graisse des titres.** Le brief dit « nous sommes à 400 partout ». La mesure
  dit que nos **titres** sont bien à 400 et que ce sont nos **petits textes** qui
  portent cinq graisses (450, 500, 600, 700 sur 15,5 % des signes). Morpho fait
  l'inverse exact : titres **plus légers** que le corps (300 contre 400) et zéro
  variation dans le petit texte. Satoshi a un vrai 300, mesuré (1 790,00 px contre
  1 842,53 px pour la même chaîne à 100 px). Inverser cette logique change la
  couleur perçue de toute la page.
- **Un hero à 60 px en graisse 300.** C'est ce que le fichier noir déclare sans y
  arriver, et ce que `composants.css:723` déclarait avant d'être annulé. La ligne
  du hero ferait 1 042 px, elle tient encore dans le conteneur. Dépasse le jeton 49.
- **Un cran de clôture.** Leur clôture est le seul endroit où ils dépassent 32 px,
  et ils y vont à 60/66. Faire une clôture plus forte que nos H2 demande soit d'y
  employer `.t-hero`, soit un neuvième cran.
- **Le monospace.** 94,1 % de leurs signes. Notre DA dit zéro monospace. Le motif
  « montrer l'artefact brut » est transposable sans monospace (un extrait de texte
  réglementaire mis en page en Satoshi), mais ce n'est pas la même démonstration.

**Sur la couleur**
- **Le champ d'accent exige un jeton différent de `#0008CF` en sombre.** Mesuré :
  `#0008CF` en champ avec encre `#0F0E0D` = **1,78:1**, et le champ lui-même sur
  `#121212` = 1,73:1. Il disparaît. Les seuls jetons de notre palette qui tiennent
  en champ : `--c-periwinkle #8A93FF` (7,07:1) et `--c-lavande #C7CBFF` (12,32:1).
  Accepter le champ, c'est accepter que l'accent de champ et l'accent de trait ne
  soient plus le même jeton en sombre.
- **Un aplat de 280 000 px de bleu contre « le bleu n'est jamais décoratif ».** La
  lecture qui la sauve : le champ n'est pas décoratif, c'est le **support de la
  capture produit**, avec 0 texte dessus, ce qui est exactement leur geste. Appel
  de doctrine, pas de mise en oeuvre. Note : la moitié exacte de notre conteneur
  fait 560 px, aucun jeton à changer, mais que ce soit la moitié **exacte** doit
  être un choix conscient et pas un arrondi.
- **`--c-border` à 0,195 ou 0,13.** `rgba(0,0,0,0.08)` est un jeton nommé au
  brief. 0,195 donne la parité avec leur définition de bord (1,577:1) et rend
  toutes les cartes de tous les gabarits nettement plus griffées. 0,13 donne
  1,35:1, la parité avec notre propre régime sombre. Le palier 2 propose 0,13 par
  défaut.
- **L'accent-texte en régime sombre.** Corriger le 1,48:1 impose de choisir :
  `#5B65FF` donne 4,24:1 sur `#121212`, `#8A93FF` donne 6,87:1. Les deux jetons
  existent, le choix engage tout le site.

**Sur la géométrie**
- **Le conteneur.** `--conteneur: 1120px` est figé. Eux : 1 152 px avec 144 px de
  marge (10,0 % de 1440). Nous : 1 120 px déclarés, mais le contenu vit à
  **1 040 px avec 200 px de marge (13,9 %)** parce que `.conteneur` porte 40 px de
  padding horizontal. Écart de colonne de texte mesuré : **112 px**. Trois
  options : ne rien changer, retirer les 40 px (contenu à 1 120, ce qui respecte
  le jeton), ou monter le jeton à 1 152.
- **La gouttière de grille à 0.** Leurs cartes sont **jointives** : 4 colonnes de
  288 px à left 144/432/720/1008, séparées par un filet, 32 px de padding interne.
  Les nôtres ont 24 à 28 px de gouttière et 40 à 64 px de padding. Passer à 0
  change l'objet « carte » du design system, donc les 24 pages d'un coup.
- **La bande de transition de 200 px.** Pas dans notre vocabulaire.
- **La barre à 80 px.** Pas nécessaire pour obtenir les états ; nécessaire si l'on
  veut leur gouttière de 64 px et leurs entrées à 16 px.
- **Un gabarit de feature unique répété 3 fois.** +432 px (1 660 contre 1 228),
  page à ~9 277 px quand la référence en fait 7 568. Et nos médias de feature font
  430x269 et 439x573 : un demi-panneau de 520x500 les recadre.

**Sur le mouvement**
- **`--dur-reveal` à 0,5 s contre 392 ms mesurés chez eux.** Leur révélation
  franchit la moitié de sa course à 108 ms (27 % du budget), la nôtre à 203 ms
  (41 %) ; temps mort avant que ça bouge : 27 ms contre 86 ms. 0,5 s est le
  chiffre de la DA (référence Framer mesurée).
- **Sept distances de révélation contre une.** La lentille mouvement le dit
  elle-même : **c'est le changement le plus visible de tout le relevé**. Mais
  c'est une décision de grammaire, pas la correction d'un défaut.

**Sur la conversion**
- **Vider le haut de page de ses CTA.** Leurs 2 314 premiers pixels (30,6 % de la
  page) n'en contiennent **aucun** ; nous en mettons **3 avant y=2 000**, dont 2
  dans le hero. Retirer une pilule du hero supprime le seul chemin direct vers
  `21-inscription.html` au-dessus de la ligne de flottaison. Décision commerciale,
  pas de DA.

---

## 7. Écartées, et pourquoi

| proposition | d'où | pourquoi elle ne survit pas |
|---|---|---|
| Hero noir à **60 px graisse 300** | typo 2.1 | Contredit `.t-hero` 49. Le bug de spécificité qu'elle décrit est réel et **retenu** (palier 1.1) ; la cible de 60 px remonte en arbitrage. |
| **Plancher typo à 12 px** | typo 2.2 | Tuerait `.t-label` 10, qui est un jeton. Retenue sous la forme « zéro taille hors des huit crans », pas « rien sous 12 ». |
| **Champ d'accent 560x500** | couleur 2.1 | Exige un jeton d'accent différent de `#0008CF` en sombre (mesuré 1,78:1). Arbitrage. |
| **`--c-border` à 0,195** | couleur 2.3 | Jeton nommé au brief. La version 0,13 (parité interne) passe en palier 2 ; 0,195 remonte en arbitrage. |
| **Un chiffre dans le hero** | structure 3.3 | **Aucune source.** La lentille le dit elle-même : « le chiffre n'existe pas, aucun nombre ne doit être posé avant d'avoir été requêté ». Écartée **jusqu'à requête**, pas jusqu'à décision. |
| **Mosaïque de 19 tuiles logo** | structure 3.2 | Non remplissable : `06-cas-client.html` ne cite que Decathlon, et la liste des clients citables est contrainte. Le gabarit unique répété 3x sans la mosaïque remonte en arbitrage (+432 px). |
| **Conteneur à 1 152** | rythme arb.1 | Jeton figé à 1120. Arbitrage, avec la mesure utile : le contenu vit à 1 040, pas à 1 120. |
| **Gouttière 0, cartes jointives** | rythme arb.5 | Change l'objet « carte » du design system. Arbitrage. |
| **Titres en graisse 300** | typo arb.4 | Inverse la logique de la DA. Arbitrage. |
| **Corps à 16 px** | typo arb.3 | `.t-body` est un jeton. Arbitrage. |
| **Le monospace** | typo arb.7, structure §4.7 | La DA dit zéro monospace. Écartée ; le motif « montrer l'artefact brut » reste transposable. |
| **`--dur-reveal` à 0,4 s** | mouvement arb.1 | 0,5 s est le chiffre de la DA. Arbitrage. |
| **Une seule distance de révélation** | mouvement arb.2 | Grammaire de DA. Arbitrage (et le plus visible de tous). |
| **Barre de nav à 80 px** | structure §4.1 | Non nécessaire pour obtenir les états ; ne change rien seule. |
| **Passer de 11 à 7 ou 8 sections** | rythme arb.6 | Décision de contenu, pas d'espacement. La lentille refuse de la prendre, moi aussi. |
| **La densité du pied de morpho (247 signes / 793 px)** | rythme §4.3 | La lentille dit elle-même que leurs libellés sont en SVG et que le chiffre est inexploitable. Écartée **comme preuve**. |
| **« Leur barre ne change pas au défilement »** | mouvement §1.5 | Faux négatif : le changement vit sur le `<header>` enfant, pas sur le DIV racine mesuré. Voir §0.3. |
| **« Leurs entrées de nav sont à 10 px »** | `nav2.json` | Artefact d'enveloppe. `morpho.dom.json` ne contient aucune taille sous 13 px. Le 16 px de la lentille structure tient. |

---

## 8. Ce qui reste non mesuré, et qu'il ne faut pas déduire

1. **Les 22 autres gabarits n'ont jamais été rendus.** Seuls `01-accueil.html` et
   `01-accueil-noir.html` ont été ouverts au navigateur, plus rien sur
   `01-accueil-en.html`. Tous les comptages « sur les 24 gabarits » viennent d'un
   `grep` sur le balisage : ils disent où une classe est **écrite**, pas ce
   qu'elle **produit** une fois les surcharges appliquées. Vu ce que la §0.2
   montre, l'écart peut être important. **Aucun témoin de non-régression ne doit
   se limiter à l'accueil.**
2. **Aucune mesure hors 1440x900.** Ni chez eux, ni chez nous, aucun point de
   rupture. Trois de nos huit jetons sont en `clamp()` avec une composante `vw` :
   l'écart de hero peut s'inverser à une autre largeur.
3. **Le troisième état de leur barre** (`translateY(-80px)`), voir §0.3.
4. **Leurs valeurs source.** CSS Modules à noms hachés des deux côtés du relevé.
   Nous savons ce qu'ils **rendent**, pas ce qu'ils **déclarent**. La comparaison
   « 8 jetons déclarés chez nous contre 4 chez eux » n'est pas valide ; « 13 rendus
   contre 4 rendus » l'est.
5. **Le rythme au défilement.** Leur hero occupe 2 314 px de défilement pour une
   idée. Combien de pixels de défilement par changement d'état, des deux côtés :
   ce n'est dans aucun relevé, et c'est probablement là que se joue la moitié de
   leur effet.
6. **Les états de survol côté couleur.** Aucun `:hover` déclenché dans la lentille
   couleur : `--c-blue-hover`, `--c-border-hover`, `--card-shadow-hover` ne sont
   comparés à rien.

---

## 9. L'ordre d'exécution

1. `commun/composants.css` : les 41 sélecteurs en double, en commençant par les
   trois cas prouvés. **Rien d'autre ne tient tant que ce n'est pas fait.**
2. Palier 1.1 (faire rendre les jetons), puis rebuild, puis re-mesure sur les
   **25** pages.
3. Palier 1.3 (les trois alphas) avant palier 1.2, parce que le contraste tenu
   est ce qui autorise de réduire les tailles.
4. Palier 1.2 (les 13 tailles sur 8 crans), avec le témoin d'alignement de carte
   avant/après sur les 24 pages.
5. Palier 2, dans l'ordre du tableau. 2.5 en dernier, c'est le seul qui déplace
   des mises en page.
6. Ouvrir les pages et regarder. Les items 1.3 et 2.6 se jugent, ils ne se
   comptent pas.
