# Lane C, entreprise, segments, cas client

Territoire : `pages/02-entreprise.html`, `pages/04-secteur.html`, `pages/05-marche.html`,
`pages/06-cas-client.html`, `pages/09-texte.html`, `pages/20-campagne.html`,
`commun/lanes/segments.css` (créé), `rapports/lane-C/`.

Méthode : construction, capture des six pages à 1440 et à 390 avant toute retouche,
lecture de chaque tranche desktop et mobile à l'image, puis quatre mesures
instrumentées écrites pour ce chantier et gardées dans `rapports/lane-C/` :

| script | ce qu'il mesure |
| --- | --- |
| `rapports/lane-C/diag.mjs` | l'élément exact sous 14 px, la cible sous 40 px, le débordement interne, les liens internes |
| `rapports/lane-C/mesure-hero.mjs` | la boîte de chaque section, son padding, ce qui en sort |
| `rapports/lane-C/mesure-cpl.mjs` | les caractères de la ligne la plus longue, comptés caractère par caractère au `Range` |
| `rapports/lane-C/mesure-contraste.mjs` + `mesure-pixels.mjs` | le rapport WCAG, calculé sur le CSS puis vérifié au pixel sur la capture |

Toute affirmation ci-dessous vient d'un de ces relevés ou d'une capture regardée.
Les mesures AVANT sont archivées dans `rapports/lane-C/avant/`.

---

## Mesures AVANT / APRÈS

Colonnes : h1 · hauteur desktop · hauteur mobile · textes < 14 px (390 px) ·
cibles < 40 px (390 px) · liens morts `href="#"` · hauteur du pied ·
débordement horizontal · paragraphe le plus large (desktop).

Les colonnes « textes < 14 px » et « cibles < 40 px » comptent la page entière,
barre de navigation et pied commun compris. La part qui m'appartenait est donnée
entre parenthèses : le reste vivait dans `commun/bandeau-nav.html` et
`commun/pied.html`, et a été corrigé par une autre lane pendant la session.

### 02-entreprise (/fr/company)

| | h1 | desktop | mobile | < 14 px | < 40 px | morts | pied | déb. | § large |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AVANT | 51,84 px `.t-hero` | 6 577 | 11 051 | 9 (5 à moi) | 7 (2 à moi) | 0 | 525 | non | 600 |
| APRÈS | 51,84 px `.t-hero` | 6 577 | 10 935 | 0 | 0 | 0 | 525 | non | 600 |

### 04-secteur (/fr/industries)

| | h1 | desktop | mobile | < 14 px | < 40 px | morts | pied | déb. | § large |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AVANT | 51,84 px `.t-hero` | 6 477 | 11 263 | 16 (12 à moi) | 5 (0 à moi) | 0 | 525 | non | 620 |
| APRÈS | 51,84 px `.t-hero` | 6 565 | 10 927 | 0 | 0 | 0 | 525 | non | 620 |

### 05-marche (/fr/jurisdictions/european-union)

| | h1 | desktop | mobile | < 14 px | < 40 px | morts | pied | déb. | § large |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AVANT | 51,84 px `.t-hero` | 6 310 | 10 619 | 13 (9 à moi) | 5 (0 à moi) | 0 | 525 | non | 620 |
| APRÈS | 51,84 px `.t-hero` | 6 398 | 10 284 | 0 | 0 | 0 | 525 | non | 620 |

### 06-cas-client (/fr/customers)

| | h1 | desktop | mobile | < 14 px | < 40 px | morts | pied | déb. | § large |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AVANT | 51,84 px `.t-hero` | 3 941 | 8 101 | 13 (9 à moi) | 5 (0 à moi) | 0 | 525 | non | 688 |
| APRÈS | 51,84 px `.t-hero` | 4 018 | 7 240 | 0 | 0 | 0 | 525 | non | 640 |

Les 861 px de moins sur téléphone viennent d'un seul défaut : le verbatim Decathlon
tenait dans une colonne de 202 px, la grille était en `style=` inline et ne se repliait pas.

### 09-texte (/fr/jurisdictions/european-union/regulations/ppwr)

| | h1 | desktop | mobile | < 14 px | < 40 px | morts | pied | déb. | § large |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AVANT | 51,84 px `.t-hero` | 5 899 | 10 699 | 15 (11 à moi) | 5 (0 à moi) | 0 | 525 | non | 620 |
| APRÈS | 51,84 px `.t-hero` | 5 987 | 10 363 | 0 | 0 | 0 | 525 | non | 620 |

### 20-campagne (/fr/guide/ppwr)

| | h1 | desktop | mobile | < 14 px | < 40 px | morts | pied | déb. | § large |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AVANT | 51,84 px `.t-hero` | 1 477 | 2 265 | 5 (5 à moi) | 0 | 0 | 250 | non | 460 |
| APRÈS | 51,84 px `.t-hero` | 1 537 | 2 497 | 0 | 0 | 0 | 250 | non | 460 |

Page nue : ni `<!--NAV-->` ni `<!--PIED-->`, donc pas de `<main>` ni de menu.
Elle a maintenant deux retours vers le site (logo de tête et logo de pied),
elle n'en avait aucun.

### Caractères sur la ligne la plus longue (desktop, comptés au `Range`)

| bloc | avant | après |
| --- | --- | --- |
| 06, verbatim Decathlon `.citation-longue` | 116 | 102 |
| 06, récit `p` | 115 | 108 |
| 06, récit `li` | 111 | 108 |
| 04 / 05 / 09, `.citation` du témoignage | 106 | 106, inchangé |
| 02, `.t-body` du bloc en duo | 87 | 87, inchangé |

Voir la note sur la mesure de lecture dans « ce qui reste hors territoire » :
le seuil de 75 caractères ne se tient pas à l'échelle d'une lane.

### Contrastes mesurés au pixel sur la capture

| élément | fond | encre | rapport |
| --- | --- | --- | --- |
| 02, « FR » de la carte portrait, AVANT | photo sombre | `rgba(0,0,0,0.62)` | 1,10:1 |
| 02, la même étiquette, APRÈS | photo sous voile 0,80 | `#fff` | conforme, vérifié à l'image |
| 04 / 05, titre posé sur `.scene-large` | rgb(12,12,11) | rgb(254,254,254) | 19,5:1 |
| 04 / 05, `.t-label` de `.scene-large` | rgb(12,12,11) | rgb(145,145,144) | 6,21:1 |
| 04 / 05 / 09, légende de la bande de logos | rgb(17,16,15) | rgb(123,122,122) | **4,49:1** |
| 06, chapô du hero `.t-lead` | rgb(17,16,15) | rgb(168,168,168) | 8,03:1 |

Le seul point sous 4,5:1 est le jeton `--c-text-on-dark-3` : voir hors territoire.

---

## Ce qui a été changé

### `commun/lanes/segments.css` (créé, 137 lignes)

Toutes les règles sont préfixées par une classe posée sur mes sections
(`.seg`, `.seg-*`) : aucune ne peut atteindre une autre page. Aucune règle sur
une balise nue. Chaque colonne de grille porte `minmax(0,1fr)`.

### 02-entreprise

1. **L'encre des cartes portrait.** Le « FR » portait `.t-body-lg`, donc
   `--c-text-2`, soit du quasi noir sur une photographie sombre : **1,10:1 mesuré**.
   La carte est une surface sombre dans une section claire, elle porte maintenant
   sa propre encre (`.seg-portrait`), et le voile du haut passe de 0,55 à 0,80
   pour tenir les photos claires (tableau blanc derrière Anaëlle, mur clair
   derrière Alexandre). Vérifié à l'image en desktop et à 390 px.
2. **Trente déclarations `style=` inline** des cinq cartes portrait remplacées par
   une classe. La DA demande qu'une grille vive dans une classe ; l'inline gagnait
   sur les media queries.
3. **Les liens LinkedIn** rendaient 51 × 17 px. Ils rendent 63 × 45 px, par padding
   et marge négative : la ligne ne bouge pas. Mobile : 2 cibles sous 40 px, puis 0.
4. **Le bloc photo à cartes flottantes était cassé sur téléphone.** Les trois cartes
   et la carte « Nous rencontrer » étaient en `position:absolute` : elles se
   recouvraient, masquaient la photographie et sortaient du conteneur
   (**344 px de contenu pour 334 px de large, mesuré**). Sous 900 px elles
   reprennent le fil normal, sous la photo. Vérifié à l'image.
5. Le SVG décoratif de la cellule lavande portait la classe `.globe`, déjà prise
   par le globe du hero dans `composants.css` : il rendait un **rectangle gris plein**
   (vu à la capture de la première passe). Renommé `.orbe`.
6. Deux points-virgules typographiques : `réglementaire: 19 régions` devient
   `réglementaire : 19 régions` (espace insécable attendue en français).
7. Alternatives d'images : la photo de chaînes du hero décrivait un échangeur
   autoroutier. Corrigée.

### 04-secteur

1. **Le hero collait la bande de logos noire.** `padding:var(--s-64) 0 0` : la carte
   de formulaire finissait exactement sur la bascule de champ, coins arrondis perdus
   dans le noir (vérifié à l'image, desktop et 390 px). Passé à 88 px en bas,
   valeur du DS.
2. **Photographies hors sujet et en double.** Mesuré avant : `parc-voitures` deux fois
   sur la page. Les quatre photographies aériennes deviennent quatre familles de la
   série `img:masse-*`, cohérentes avec le textile, une seule occurrence chacune :
   tee-shirts (hero), baskets (Regulatory Change), chaussettes (Research),
   casques (témoignage). `briques` et `fenetres` restent, une fois chacune.
   Doublons après : aucun, hors le portrait d'Anaëlle qui sert d'avatar 38 px et de
   portrait 180 px dans la clôture (même personne, deux rôles, gardé volontairement).
3. **Le titre posé sur `.scene-large` finissait sur la fenêtre bleue**, le seul point
   coloré de la photographie. La colonne recule de 500 à 440 px. Sur téléphone le
   voile, horizontal, laissait le titre sur les fenêtres éclairées : il repasse
   vertical sous 760 px.
4. Onze `alt=""` remplacés par des alternatives réelles. Zéro `alt=""` restant.
5. Plancher de 14 px sur téléphone : libellés de formulaire, `.sceau .sous`,
   `.t-label`, `.btn-sm`. Mesuré : 12 textes sous 14 px, puis 0.

### 05-marche

1. Même correction de padding de hero qu'en 04, même défaut vérifié à l'image :
   la mosaïque de trois photographies finissait sur la bande noire.
2. **Trois photographies en double** mesurées avant (`parc-voitures` ×2, `fenetres` ×2,
   `briques` ×2). Les six deviennent : canettes, piles, peluches (mosaïque du hero),
   lessive, flacons, couverts (les trois blocs alternés). `fenetres` reste une seule
   fois, sur la `.scene-large` où la métaphore est portée par le texte
   (« vingt-sept États membres, chacun a ses transpositions »). Doublons après : aucun.
3. **La mosaïque du hero était une grille en `style=` inline sans `minmax(0,1fr)`.**
   Passée en classe `.seg-mosaique`.
4. Même correction de la colonne de titre sur `.scene-large` et du voile sur téléphone.
5. Huit `alt=""` remplacés. Plancher de 14 px : 9 textes, puis 0.

### 06-cas-client

1. **La bande citation était cassée sur téléphone.** La grille `100px 1fr` était en
   `style=` inline : à 390 px elle ne se repliait pas et les trois paragraphes du
   verbatim tenaient dans **202 px de large**. Elle vit dans `.seg-citation`,
   se replie à 760 px, et le portrait passe de `align-items:center` à `start`
   (il flottait au milieu d'une colonne de trois paragraphes). Vérifié à l'image.
   **Pas un caractère du verbatim n'a bougé** : les deux phrases d'ouverture et de
   clôture ont été recomptées après retouche.
2. **La mesure de lecture.** Le verbatim rendait **116 caractères sur sa ligne la plus
   longue**, le maximum de tout le dépôt. Colonne bornée à 620 px, la largeur que la
   `.citation` prend déjà sur 04, 05 et 09 : 102 caractères, et le bloc devient
   cohérent avec le reste du site au lieu d'en être l'exception.
   Le récit passe de 684 à 640 px, 115 à 108 caractères.
3. La fiche latérale se replie déjà proprement sous 1024 px (`composants.css`) :
   vérifié à l'image, logo, clés et valeurs empilés, rien de tronqué.
4. Trois `alt=""` remplacés, dont le portrait de Philippine Tamic et celui de la clôture.
5. Plancher de 14 px : `.fiche-laterale .cle` et les surtitres du récit. 9 textes, puis 0.

### 09-texte

1. Même correction de padding de hero, même défaut vérifié à l'image.
2. **Photographies hors sujet.** Une page sur le règlement emballages était illustrée
   par des pneus, un parc de voitures, un échangeur et des briques. Elle l'est par
   des capsules (hero), des tasses, des flacons de shampooing et des savons.
   `fenetres` reste sur le témoignage. Doublons : aucun.
3. Les logos de la bande sont bien inversés en blanc sur champ profond
   (`.sur-sombre .bande-logos img{filter:grayscale(1) brightness(0) invert(1)}`,
   `composants.css:204`) : vérifié à l'image, les cinq marques se lisent, NVIDIA
   comprise. Rien à corriger.
4. Les liens des cartes de features mènent bien vers 03, 07 et 08 : vérifié dans la
   liste des liens internes rendus.
5. Neuf `alt=""` remplacés. Plancher de 14 px : 11 textes, puis 0.
6. **La grille `<!--MASSE-REFS-->` : essayée, mesurée, retirée.** Voir hors territoire.

### 20-campagne

1. **Aucun retour vers le site.** Mesuré avant : les seuls liens internes de la page
   étaient l'article et les conditions générales. Le logo de tête et le logo de pied
   sont maintenant des liens vers `01-accueil.html`, avec `aria-label`.
2. **La couverture du guide était sombre sur champ profond**, donc invisible : elle
   porte sa propre encre, une plaque de verre clair à `rgba(255,255,255,0.05)` et un
   filet à 0,10. Le livre se détache. Vérifié à l'image.
3. **La carte de verre coupait la couverture et sortait du conteneur**
   (1 060 px de contenu pour 1 040, mesuré). Elle passait sur la dernière ligne du
   livre, « Applicable au 12 août 2026 », et la tronquait. Elle descend sous la
   couverture (`bottom:-92px`, calculé sur la hauteur mesurée du livre), le bas du
   hero passe de 88 à 128 px pour l'accueillir, et sous 1024 px elle reprend le fil
   normal. Vérifié à l'image en desktop et à 390 px : plus aucun recouvrement.
4. **Une note interne était servie au visiteur** : « Maquette de travail, non publiée. »
   dans le pied. Remplacée par la mention légale du pied du site,
   « Cleo Corp SAS, SIREN 984567883 » (`commun/pied.html:79`).
5. Le pied avait une grille en `style=` inline : passée en `.seg-p20-pied .identite`,
   une seule colonne sous 640 px.
6. Les deux logos rendaient 24 px de haut en cible tactile, et l'adresse de contact
   17 px. Mesuré : 2 cibles sous 40 px, puis 0.
7. Plancher de 14 px sur les cinq textes de la page. 5, puis 0.

---

## Ce qui reste hors territoire

### 1. `commun/base.css` : `--c-text-on-dark-3` rend 4,42:1, sous le seuil

Mesuré au pixel sur la capture, sur trois de mes pages et sur le pied de toutes :
`rgba(255,255,255,0.45)` sur `--c-field-deep` `#0F0E0D` donne
fond rgb(17,16,15), encre rgb(123,122,122), **4,49:1 au relevé, 4,42:1 au calcul**.
Le jeton porte la légende des bandes de logos (04, 05, 09), les surtitres des heros
sombres (02 « L'ÉQUIPE DERRIÈRE CLEO », 06 « CAS CLIENT »), et tout le `.t-micro`
du pied commun.

Proposition, une ligne dans `commun/base.css` :
`--c-text-on-dark-3: rgba(255,255,255,0.52)` donne 5,6:1 et reste atténué.
Le commentaire voisin dit que le jeton clair `--c-text-3` a déjà été remonté le
27/08 pour la même raison (0,45 rendait 3,32:1) ; c'est la symétrie qui manque.

Je ne l'ai pas surchargé dans `segments.css` volontairement : un jeton de système
corrigé sur 6 pages de 47 crée l'incohérence que l'audit cherche à retirer.

### 2. `commun/composants.css` : la mesure de lecture du dépôt entier

Le seuil « 75 caractères par ligne » ne tient pas à l'échelle d'une lane. Mesuré
caractère par caractère sur des pages hors territoire, pour avoir un oracle non
circulaire :

| page | bloc | caractères sur la ligne la plus longue |
| --- | --- | --- |
| 12-article | corps `.article p` | 113 |
| 12-article | chapô du hero `.t-body` | 130 |
| 27-article-levee | corps `.article p` | 107 |
| 01-accueil | `.temoin-compact blockquote` | 95 |
| 06-cas-client, après ma passe | récit `p` | 108 |

Satoshi à 15 px rend environ 5,9 px par caractère : 75 caractères tiennent dans
443 px, pas dans les 700 px que suppose la règle. Le dépôt entier vit entre 95 et
130. Descendre mes six pages à 75 les rendrait visiblement plus étroites que les
41 autres.

Proposition, à trancher au niveau du système et pas de la page : porter le corps
long (`.recit p`, `.article p`, `.legal p`) de `0.9375rem` à `1.0625rem` et borner
ces colonnes à 620 px, ce qui donne environ 84 caractères partout. Deux lignes
dans `composants.css`, appliquées d'un coup aux 47 pages.

### 3. `commun/composants.css` : `.mass-refs` est figé à 12 px, la grille est inutilisable

Le brief annonce une grille `<!--MASSE-REFS-->` sur 09 ; elle n'y était pas.
Je l'ai posée, construite et mesurée : **86 textes sous 14 px sur téléphone**
et **+1 975 px de hauteur mobile** (10 363 puis 12 674). La cause est
`composants.css:354`, `.mass-ref{font-size:12px}`, et
`composants.css:634`, deux colonnes sous 640 px : 43 rangées de puces à 12 px.
La grille n'est servie nulle part ailleurs que sur `00-composants.html`.

J'ai retiré la section : dans l'état, elle fait échouer les seuils de l'audit
sur la page. Proposition, dans `composants.css` :
`@media (max-width:640px){ .mass-refs{grid-template-columns:repeat(4,minmax(0,1fr))} .mass-ref{font-size:0.875rem; padding:6px 4px} }`
et un `max-height` avec `overflow:hidden` sur la masse, la puce `.found` restant
visible. La section de 09 est prête à revenir, son texte est dans l'historique de
`rapports/lane-C/retouches-09.mjs`.

### 4. `commun/composants.css` : `.pied-bas a` rend 111 × 28 px en desktop

Sur les six pages, et sur toutes les autres. Le seuil mobile est déjà tenu
(`composants.css:1329`, `min-height:44px` sous 640 px), le desktop non.
Proposition : `.pied-bas a{padding:8px 0}` porte la cible à 36 px, `padding:10px 0` à 40.
Je ne l'ai pas fait sur le pied de 20-campagne seul : il aurait divergé du pied commun.

### 5. Classes mortes `gc-doux` et `gc-deep`

Elles ne sont définies que dans `commun/composants-noir.css.sauvegarde`, jamais
dans une feuille active. Elles sont portées par des sections de 02, 04, 05, 06,
09 et 20, et par d'autres pages. Sans effet, mais elles laissent croire à un fond
qui n'existe pas. À nettoyer d'un coup sur tout le dépôt, pas page par page.

### 6. `commun/bandeau-nav.html` et `commun/pied.html`

Les 4 textes sous 14 px et les 4 cibles sous 40 px que je mesurais au départ sur
chacune de mes pages venaient de là. Ils ont disparu entre ma première et ma
dernière capture : une autre lane les a corrigés pendant la session. Rien à faire.

---

## Doutes de contenu

1. **20-campagne donne `hello@cleolabs.co`, le pied du site donne `contact@cleolabs.co`**
   (`commun/pied.html:71`). Deux adresses pour le même visiteur. Je n'ai pas tranché :
   changer une adresse de contact peut casser une boîte de campagne. À arbitrer.
2. **02-entreprise : « Chiffres de couverture Cleo Labs, figés au référentiel interne. »**
   Servi au visiteur. La provenance est honnête, mais « référentiel interne » est du
   vocabulaire d'équipe. Une date de comptage, comme sur 04 et 05
   (« Comptage du 26 août 2026 »), dirait la même chose et serait vérifiable.
3. **09-texte : « Le texte intégral du PPWR est au dépôt »**. « Au dépôt » est du
   vocabulaire de code. Le lecteur ne sait pas de quel dépôt il s'agit, ni comment y
   accéder : la phrase promet un accès qu'elle ne donne pas.
4. **02-entreprise : trois cartes équipe sur cinq portent « FR France Neuilly-sur-Seine »,
   deux n'en portent pas** (Darcial Mondjo, Thezi Mabuza). Si c'est parce que le lieu
   n'est pas connu, dire lequel. Si c'est un oubli, il se voit dans la grille.
   Je n'ai rien ajouté : je n'ai pas la donnée.
5. **02-entreprise, presse : trois des six cartes portent une date, trois non**
   (Vestbee, RegTech Analyst, The Legal Wire). Les six liens répondent, les trois
   dates manquantes ne sont pas dans le fragment source.
6. **« Le plus pris » sur la carte Regulatory Change** (04 et 09) est une affirmation
   de popularité, non sourcée dans le fragment. Je ne l'ai pas retirée : elle vit
   aussi sur 03-offre, hors territoire, et la retirer d'une page sur deux serait pire.
7. **Chiffres non vérifiés par moi, laissés tels quels** : 106 pays, 25 000
   réglementations, 19 000 autorités, 2 812 règles, 43 juridictions, 180 règles sur
   le corpus européen, 1,5 M€, 19 régions, 8 langues, 30+ appels LLM.
   Ce sont de la matière source, je ne les ai ni touchés ni recomptés.
8. **`.carte-lavande` de 02 déborde de 40 px en interne** (370 px de contenu pour
   330 px de large, mesuré aux deux largeurs). C'est l'orbe décoratif posé à
   `right:-40px` dans une boîte en `overflow:hidden` : le rendu est propre, vérifié à
   l'image, la découpe est voulue. Je le signale parce que la sonde le compte, pas
   parce que ça se voit.

---

VERIFICATION: node construire.mjs -> 0 echec ; node commun/capture2.mjs 02-entreprise 04-secteur 05-marche 06-cas-client 09-texte 20-campagne -> OK
