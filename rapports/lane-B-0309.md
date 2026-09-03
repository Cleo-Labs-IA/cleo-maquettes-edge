# Lane B, features, démo, 404

Territoire : `pages/03-offre.html`, `pages/07-chat.html`, `pages/08-reglementation.html`,
`pages/21-inscription.html`, `pages/99-404.html`, `commun/lanes/features.css` (créé).
Tout ce qui suit vient d'une mesure (`commun/capture2.mjs`, `rapports/lane-B/diag.mjs`)
ou d'une image regardée, desktop 1440 et téléphone 390, toutes les tranches.

Mesures AVANT conservées dans `rapports/lane-B/avant/*.json`, mesures APRÈS dans
`captures/lane/*-mesures.json`.

---

## Mesures AVANT / APRÈS

Les colonnes : hauteur de page desktop / téléphone, textes sous 14 px sur téléphone,
cibles tactiles sous 40 px sur téléphone, liens morts (`href="#"`), champs figés
(`input[disabled]`), hauteur du pied, débordement horizontal, paragraphe le plus large
sur desktop (seuil de l'audit : 760 px), images sans alt, images cassées, erreurs console.

### 03-offre — Regulatory Change (`/fr/platform`)

| | h1 | hD | hM | <14 px M | <40 px M | morts | figés | pied | débord. | para. | alt | cassées | console |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| avant | 51,84 px, 1 seul | 5648 | 9576 | 30 | 6 | 0 | 0 | 525 | non | **820** | 0 | 0 | 0 |
| après | 51,84 px, 1 seul | 5610 | 9141 | 26 | 1 | 0 | 0 | 525 | non | **720** | 0 | 0 | 0 |

### 07-chat — Research (`/fr/platform/research`)

| | h1 | hD | hM | <14 px M | <40 px M | morts | figés | pied | débord. | para. | alt | cassées | console |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| avant | 51,84 px, 1 seul | 5040 | 8600 | 17 | 5 | 0 | 0 | 525 | non | **820** | 0 | 0 | 0 |
| après | 51,84 px, 1 seul | 4995 | 8165 | 13 | **0** | 0 | 0 | 525 | non | **720** | 0 | 0 | 0 |

### 08-reglementation — Compliance Data (`/fr/platform/regulations`)

| | h1 | hD | hM | <14 px M | <40 px M | morts | figés | pied | débord. | para. | alt | cassées | console |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| avant | 51,84 px, 1 seul | 5495 | 8574 | 15 | 5 | 0 | 0 | 525 | non | **820** | 0 | 0 | 0 |
| après | 51,84 px, 1 seul | 5458 | 8139 | 11 | **0** | 0 | 0 | 525 | non | **720** | 0 | 0 | 0 |

### 21-inscription — demande d'accès (`/fr/meet`)

| | h1 | hD | hM | <14 px M | <40 px M | morts | figés | pied | débord. | para. | alt | cassées | console |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| avant | 51,84 px, 1 seul | 1507 | 3403 | 10 | 5 | 0 | 0 | 525 | non | 480 | 0 | 0 | 0 |
| après | 51,84 px, 1 seul | 1587 | 2999 | **1** | **0** | 0 | 0 | 525 | non | 480 | 0 | 0 | 0 |

### 404 (`sortie/404.html`)

| | h1 | hD | hM | <14 px M | <40 px M | morts | figés | pied | débord. | para. | alt | cassées | console |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| avant | 51,84 px, 1 seul | 1330 | 2584 | 5 | 5 | 0 | 0 | 525 | non | 638 | 0 | 0 | 0 |
| après | 51,84 px, 1 seul | 1330 | 2147 | **1** | **0** | 0 | 0 | 525 | non | 638 | 0 | 0 | 0 |

### Ce qui, dans ces écarts, n'est PAS de moi

Une autre lane a compacté le pied entre ma mesure de départ et ma mesure finale.
Ce qui lui revient, page par page :

- les **hauteurs sur téléphone** perdent ~435 px sur les cinq pages : c'est le pied ;
- les **cibles sous 40 px** : 5 des 6 relevées au départ étaient dans la barre et le
  pied (`nav-logo` 77×22, « Blog » 28×44, « Skills » 30×44, `contact@cleolabs.co`
  127×17, « Réserver 30 minutes » 127×17). Elles sont parties avec le pied ;
- 4 des textes sous 14 px de chaque page (le bouton `btn-sm` de la barre à 12 px et
  trois liens du pied à 12 px).

Ce qui me revient, mesuré : le paragraphe de 820 → 720 px sur les trois features,
les 5 libellés de formulaire de 21 passés de 12 à 14 px sur téléphone
(10 → 1 texte sous 14 px, le dernier étant un `.t-label` du DS), et la recomposition
du bloc « Ce que X fait » (voir plus bas : la mesure y est une géométrie, pas un compte).

### Ce qui reste sous 14 px après coup, et pourquoi ce n'est pas un défaut

Relevé élément par élément à 390 px (`rapports/lane-B/diag.mjs`) :

- **21 et 404** : 1 texte chacune, un `.t-label` à 12 px (« Démonstration », « Erreur 404 »).
  12 px est la valeur du DS (`.t-label 12`, `.t-caption 12`) et le socle le maintient
  explicitement sous 640 px (`composants.css` : `.t-label,.surtitre{font-size:0.75rem}`).
  Ces deux pages sont donc propres.
- **07** : 2 étiquettes du DS + 11 textes **à l'intérieur des deux écrans d'application**
  (`commun/ecran-chat.html`, `commun/ecran-chat-fil.html`) : 12 px pour l'essentiel,
  10 px pour `.ca-mode` et `.cf-ref`. Fragments partagés, non éditables.
- **08** : 2 étiquettes du DS + 9 textes dans l'écran arbre (`commun/ecran-arbre.html`),
  dont trois à 10 px (`.nd .bas span` : « 0002 », « AND », « 5 »).
- **03** : 2 étiquettes du DS + 17 à 24 textes (le compte varie avec l'état de
  l'animation) dans le composant de veille porté : 8 px, 9 px, 9,5 px, 10 px.
  C'est le seul endroit du lot qui descend sous 9 px.

Rien de tronqué, rien de superposé, rien qui déborde : `debordement` est `false`
sur les dix mesures, desktop et téléphone.

---

## Ce qui a été changé

### 1. Le mur de texte des trois features — le défaut principal

**Avant, mesuré et regardé.** Le bloc « Ce que X fait » était deux colonnes cousues à
la main : 6 puces à gauche, 7 à droite sur 03 et 08, 6/7 sur 07. La colonne gauche
s'arrêtait environ 130 px avant la droite. Et la note « Bon à savoir » qui suivait
portait `max-width:460px` dans une largeur de conteneur de 1040 px : **580 px de vide
à sa droite**, visible sur les trois captures d'origine (`captures/lane/07-chat-d1.png`
avant coup, la note seule en bas à gauche).

**Après.** Les cinq groupes deviennent cinq blocs autonomes dans une grille de deux
colonnes qui s'alignent par rangée, et la note occupe la sixième cellule :

| rangée | colonne 1 | colonne 2 |
|---|---|---|
| 1 | Ce qu'il lit / Où il cherche / Ce qu'elle contient | Ce qu'il en fait / Ce qu'il rend / Ce qui la contrôle |
| 2 | Ce que vous recevez / Ce qu'il ne fait pas / Le périmètre | Ce qui s'y branche |
| 3 | Mise en place | la note « Bon à savoir » |

Aucune puce n'a été réécrite, aucune n'a été déplacée hors de son groupe, aucun groupe
n'a changé d'ordre de lecture. Ce qui change : le rangement, la hiérarchie et l'air.

- Les cinq intertitres étaient des `<div class="t-h2">` : ils ne portaient **aucun
  niveau**. Ils sont maintenant des `<h3>`. Le plan de la page ne saute plus de cran.
- Le titre du bloc était un `<h3 class="t-h1">` à 24 px, **sous** des `<h2>` à 32 px
  (« Les deux autres features », « Questions fréquentes ») : le plan descendait puis
  remontait. Il est passé `<h2 class="t-display">`, au cran des autres titres de section.
- Sur 03 et 08, le titre posé sur la photographie était lui aussi un `<h3>` directement
  sous le `<h1>` : passé `<h2 class="t-h1">`, taille inchangée.
- La marge de 40 px que portaient trois `<ul>` séparait deux groupes **dans** une
  colonne. Chaque groupe étant maintenant sa propre cellule, cette marge doublait le
  gap de la grille : retirée.
- Grille : `repeat(2,minmax(0,1fr))`, gap 52 px en rangée / 56 px en colonne,
  `align-items:start`. Une seule colonne sous 820 px, parce qu'à deux colonnes une puce
  de 60 signes tombait sur quatre lignes (le socle ne bascule `.g2` qu'à 640 px).
- La note reste le **seul élément coloré** de la grille : cinq blocs de masse, un unique.
  Sa bordure et sa pastille sont en `--accent` (périvenche, famille éditoriale) ; le bleu
  signal n'entre pas dans le bloc, et les coches sont en `--c-ink` comme le veut le socle.

Mesuré : desktop 5648 → 5610 px (03), 5040 → 4995 (07), 5495 → 5458 (08). La page ne
s'allonge pas, elle se range.

*Fichiers : les trois pages, via `rapports/lane-B/transformer.mjs` (chaque
remplacement est vérifié, le script s'arrête si un ancrage manque) ; CSS dans
`commun/lanes/features.css`, classes `.bf-faits`, `.bf-bloc`, `.bf-note`, `.bf-note-ico`.*

### 2. La mesure de lecture du chapô « Pour qui ? » (les trois features)

Le paragraphe rendait **820 px** de large sur desktop, au-delà du seuil de 760 px de
l'audit — c'était la seule alerte de gabarit des trois pages. Le conteneur passe de
`style="max-width:820px"` à la classe `.bf-intro` (720 px). Mesuré après : 720 px,
plus d'alerte.

### 3. La carte d'appel (les trois features)

Son unique ligne courait sur **690 px centrés**. `.bf-appel-txt` la ramène à 520 px :
elle tombe sur deux lignes courtes et se lit d'un regard. Marge haute portée de 44 à
56 px, la note qui la précède ayant changé de place. **Aucun montant, aucune mention
de prix n'a été écrit** : le texte de la carte est celui d'origine, mot pour mot.

### 4. 21-inscription — la colonne orpheline

**Avant, mesuré.** `.duo` en `align-items:start` : la colonne de texte s'arrêtait
138 px au-dessus du formulaire, tout le vide tombait sous elle, et la page paraissait
inachevée plutôt que courte.

**Après.** `.p-demande .duo{align-items:center}` : les deux colonnes se répondent, le
vide est réparti. La colonne de texte est bornée à 520 px. Sous 1024 px le socle
repasse `.duo` en une colonne et la règle se désarme (`align-items:start`).

La section passait `style="padding:88px 0"` avec deux classes mortes ; elle prend la
classe `.section` du socle (128 px, la valeur de la DA) et la classe de page
`.p-demande`. Desktop 1507 → 1587 px.

**Le formulaire est réel et il rend.** Vérifié à l'image et à la mesure : cinq champs
associés au `<form>` par `form="f-acces"`, envoi GET vers la prise de rendez-vous
HubSpot, `type="email"` + `required` sur l'email, `autocomplete` sur les quatre
premiers, un `<label for>` par champ, bouton pleine largeur, `0 input[disabled]`.
Le repli téléphone est propre : « Prénom / Nom » se dépile, le bouton reste pleine
largeur.

Deux corrections de lisibilité, calculées puis relevées sur la page construite :

- **l'exemple posé dans le champ** (placeholder) : le fond du champ rend `#262625`, et
  le blanc à 0,45 dessus donne **4,25:1**, sous le seuil de 4,5. Porté à 0,52, il rend
  **5,18:1** (relevé au navigateur). La valeur saisie est à 15,2:1, le libellé à 7,82:1 ;
- **les libellés sur téléphone** : le socle remonte `.t-caption`, `.t-micro` et `.t-sm`
  à 14 px sous 640 px mais laisse `.form-carte label` à 12 px. Les cinq libellés de
  cette page rendaient 12 px à 390 px. Portés à 14 px, scopés à `.p-demande`.
  C'est ce qui fait passer la page de 10 à 1 texte sous 14 px.

### 5. 404

Vérifié : **un seul `<h1>`**, le pied suit, deux boutons, aucun lien mort, aucun
débordement, hero centré sur champ profond, `min-height:62vh`. Rien à corriger sur le
fond. Une seule retouche : la classe morte `gc-deep` retirée (voir plus bas), et le
commentaire de chantier qui nommait Vercel retiré du HTML servi.

### 6. Le composant de veille de 03, à 390 px — la question posée par le brief

**Réponse mesurée : il ne déborde pas, et il n'a besoin d'aucune contention.**
`composants.css:568-569` pose `.cv{min-width:700px}` puis `@media (max-width:820px){
.cv{min-width:0} }` : à 390 px la largeur minimale est levée, le composant se replie
en colonne et `debordement` vaut `false` (`largeurDoc` = `largeurFenetre`). Regardé sur
`captures/lane/03-offre-m1.png` et `-m2.png` : la liste des textes, la carte produit et
la fiche se rendent les uns sous les autres, rien n'est coupé. Je n'ai donc **rien**
écrit sur `.cv` — pas de wrapper à défilement, pas de `min-width` forcé.

Ce que j'y ai relevé et qui reste (hors territoire, détaillé plus bas) : sa typographie
descend à 8 px sur téléphone, son lien `ouvrir au Journal officiel` fait 111×16 px, et
sa fiche (`.cv__fiche`, hauteur 150 px) est encore à `opacity:0` au moment de la capture
desktop — la place est réservée, d'où la bande claire vide visible sur
`captures/lane/03-offre-d1.png`. C'est une étape d'animation, pas un trou de gabarit :
à 390 px, la même fiche est rendue.

### 7. Les deux écrans d'application de 07, à 390 px

Vérifié à l'image (`captures/lane/07-chat-m1.png`) : la `.g2` se dépile, les deux
écrans passent pleine largeur, **rien n'est tronqué** — la question, les trois étapes,
la citation avec sa référence et le composeur se lisent entiers. Les textes y sont à
12 px (admis pour une maquette d'application) sauf `.ca-mode` et `.cf-ref` à 10 px.
Sur desktop, l'écran de gauche est plus court que celui de droite : c'est l'avant et
l'après de la même question, `align-items:start` est le bon choix, je n'y touche pas.

### 8. Le témoignage des trois pages

Vérifié à l'image, desktop et téléphone. L'image « la masse et l'unique » (basket sur
03, gourde sur 07, skate sur 08) tient en `aspect-ratio:4/3`, environ 340 px de large
contre 615 px pour la citation à 1440 px : la proportion tient. Sur téléphone,
`.temoignage` passe en une colonne à 1024 px, l'image prend la pleine largeur au-dessus
de la citation, l'auteur suit. Rien à corriger.

### 9. Deux coquilles de nommage et de langue

- **07** : « Compliance, quand la règle existe déjà » → « **Compliance Data**, quand la
  règle existe déjà ». La feature s'appelle Compliance Data partout ailleurs, y compris
  dans la carte « Les deux autres features » de la même page. Ni « Chat » ni
  « Recherche réglementaire » n'ont été réintroduits nulle part.
- **08** : « Testez une référence contre 2 812 règles d'un coup **téléchargé** » →
  « … d'un coup ». Le mot restant ne se rattachait à rien. **À faire relire** : voir
  « Doutes de contenu ».

Aucun autre mot du texte rédactionnel n'a été touché sur les cinq pages.

### 10. Les commentaires HTML servis au visiteur

Vérifié : les commentaires du fragment se retrouvent **tels quels** dans `sortie/`
(`grep -c "Carte tarif" sortie/03-offre.html` rendait 1). Retirés de mes cinq pages,
via `rapports/lane-B/commentaires.mjs` :

| page | commentaire servi | remplacé par |
|---|---|---|
| 03, 07, 08 | `<!-- Carte tarif -->` | `<!-- Carte d'appel -->` |
| 03, 07 | `<!-- L'écran produit, à la place de leur image bandeau -->` | supprimé / `<!-- ═══ CE QUI CIRCULE ═══ -->` |
| 03 | `<!-- HERO COURT… Posé le 03/09/2026 : la page était la seule sans h1. -->` | `<!-- ═══ HERO ═══ -->` |
| 07, 08 | `<!-- HERO COURT, CENTRÉ ═══ pas de photo, un dégradé d'encre -->` | `<!-- ═══ HERO ═══ -->` |
| 08 | `<!-- §18 en photographie : la masse des règles, celle qui bloque -->` | `<!-- ═══ CE QUI S'APPLIQUE ═══ -->` |
| 404 | `<!-- 404 ═══ posée le 03/09/2026 : avant, Vercel servait sa page par défaut… -->` | `<!-- ═══ 404 ═══ -->` |

Il en reste deux que je ne peux pas atteindre : voir « hors territoire », points 1 et 2.

### 11. Deux classes qui n'existent pas

`gc-doux` et `gc-deep` n'ont **aucune définition** dans `base.css` ni `composants.css`
(0 occurrence ; elles ne survivent que dans `composants-noir.css.sauvegarde`).
Retirées de mes cinq pages ; le rendu est identique, `sur-sombre` posait déjà le fond.
36 pages les portent encore : voir « hors territoire », point 7.

### Fichiers touchés

- `pages/03-offre.html`, `pages/07-chat.html`, `pages/08-reglementation.html`,
  `pages/21-inscription.html`, `pages/99-404.html`
- `commun/lanes/features.css` — **créé**, 68 lignes, aucune règle sur une balise nue,
  tous les sélecteurs préfixés par `.bf-` ou `.p-demande`
- `rapports/lane-B/transformer.mjs`, `rapports/lane-B/commentaires.mjs`,
  `rapports/lane-B/diag.mjs`, `rapports/lane-B/avant/*.json` — outils et mesures de départ

Aucun fichier hors territoire n'a été ouvert en écriture. Aucune commande git,
aucun déploiement.

---

## Ce qui reste hors territoire

**1. `construire.mjs:907` — une note de chantier servie sur les 47 pages, et elle nomme
le site relevé.**
```
<!-- Maquette de travail. Composition relevee sur ${p.source}, habillage DA Cleo. -->
```
Rendu sur mes pages : `Composition relevee sur edgecomply.com/services/product-compliance-audit`,
`…/services/*`, `…/waitlist`, et sur la 404 : `Composition relevee sur page introuvable`.
C'est la note interne la plus visible du lot : elle est dans le source public de chaque page
et elle attribue la composition à un concurrent nommé.
*Proposition : supprimer la ligne, ou la déplacer dans le journal de build. Si un marqueur
doit rester dans le HTML, `<!-- Maquette de travail Cleo Labs. -->` sans `${p.source}`.*

**2. `depot-src/ref/veilleMarkup.ts:26` — une note « à remplacer » servie sur 03.**
```
<!-- LE PRODUIT : exemple de catalogue, à remplacer -->
```
*Proposition : supprimer la ligne du gabarit. Une ligne, aucun effet de rendu.*

**3. `depot-src/ref/veilleCss.ts` — la typographie du composant de veille sur téléphone.**
Relevé à 390 px : `.cv-det u` 8 px, `.cv-ech` et `.cv-k` 9 px, `.cv-lbl`, `.cv-c span` et
`.cv-lien` 9,5 px, `.cv-v` 10 px, `.cv-etat span` 10,5 px, `.cv__count` 11 px. Ce sont
17 des 26 textes sous 14 px qui restent sur 03. Le socle admet 12 px dans une maquette
d'application ; ici on descend à 8.
*Proposition : un `@media (max-width:640px)` dans `VEILLE_CSS` qui pose un plancher à
11-12 px sur `.cv-det`, `.cv-ech`, `.cv-k`, `.cv-lbl`, `.cv-c span`, `.cv-lien` — le
composant se replie déjà en colonne à cette largeur, il a la place. Si l'équipe préfère
l'assumer comme une photographie de produit, alors le dire une fois et fermer le sujet.*

**4. Même fichier — la seule cible sous 40 px qui reste sur les cinq pages.**
`.cv-lien` (« ouvrir au Journal officiel ↗ ») rend **111×16 px** à 390 px.
*Proposition : `.cv-lien{display:inline-flex; align-items:center; min-height:44px}` —
c'est exactement ce que `composants.css:1330` fait déjà pour `.pied ul a` et `.res-nav a`.
Non fait de mon côté : le brief limite mon intervention sur ce composant au débordement,
et je ne voulais pas décaler la fiche d'une animation que je ne possède pas.*

**5. `commun/composants.css:448` et `:1324` — le libellé de formulaire sur téléphone.**
`.form-carte label{font-size:0.75rem}` reste à 12 px sous 640 px, alors que le bloc de
la ligne 1324 remonte `.t-caption,.t-micro,.t-sm,.pilule,.tag,.etiquette…` à 14 px.
Je l'ai corrigé pour 21 seulement, scopé `.p-demande` — donc les autres formulaires du
site gardent des libellés à 12 px.
*Proposition : ajouter `.form-carte label` à la liste de la ligne 1324 et retirer ma
règle de `features.css`. C'est le bon endroit, et ça vaut pour tous les formulaires.*

**6. `commun/ecran-chat.html`, `commun/ecran-chat-fil.html`, `commun/ecran-arbre.html` —
les textes à 10 px des maquettes d'application.**
`.ca-mode` et `.cf-ref` à 10 px sur 07 ; `.nd .bas span` (« 0002 », « AND », « 5 ») à
10 px sur 08. Le reste est à 12 px, ce qui est admis.
*Proposition : porter ces trois sélecteurs à 11 px sous 640 px, ou acter que 10 px est
la valeur assumée d'un écran produit et ne plus la compter comme une alerte.*

**7. 36 fichiers de `pages/` portent encore `gc-doux` ou `gc-deep`, deux classes sans
aucune définition.**
Aucun effet de rendu aujourd'hui ; le risque est qu'une lane les redéfinisse en croyant
qu'elles servent, et change 36 pages d'un coup sans le savoir.
*Proposition : une passe de suppression sur `pages/*.html` (`gc-doux` accompagne toujours
`.section`, `gc-deep` accompagne toujours `.sur-sombre`, les deux sont redondantes), ou
les définir une fois pour toutes dans `composants.css` si elles ont un rôle prévu.*

---

## Doutes de contenu

**Ce que je n'ai pas touché, et qui demande une décision.**

1. **« d'un coup téléchargé » (08).** J'ai coupé « téléchargé », qui ne se rattachait à
   rien : « Testez une référence contre 2 812 règles d'un coup. » Si la phrase voulait
   dire que le corpus se télécharge, elle a perdu cette moitié-là et il faut la
   réécrire. **À arbitrer.**

2. **Le mode d'adresse des puces est mélangé, sur les trois pages.** Certaines sont à
   l'impératif adressé au lecteur (« Lisez le texte intégral », « Cherchez jusque dans
   les annexes », « Copiez l'extrait », « Ouvrez le texte », « Réutilisez les
   obligations », « Testez une référence », « Voyez ce qui manque »), d'autres sont des
   groupes nominaux (« Le renvoi au paragraphe exact », « La date d'application… »,
   « Une condition évaluable… »). Dans un même groupe de trois puces, les deux régimes
   se croisent. Je ne l'ai pas uniformisé : c'est de la matière source, et le corriger
   voudrait dire réécrire une douzaine de puces. **À trancher par la personne qui tient
   la copie.**

3. **Les chiffres portés par mes pages, que je n'ai ni vérifiés ni modifiés.**
   Je les liste pour que quelqu'un qui a accès aux sources les confirme :
   106 pays et 19 000 autorités (03, hero, scène et puces) ; 3 700 sources officielles
   et « relevé du 4 août 2026 » (composant de veille, 03) ; 2 812 règles encodées et
   2 505 verbatim retrouvés (08, hero, scène et puces) ; 43 juridictions (03, 07, 08,
   cartes « Les deux autres features ») ; 538 nœuds et « Art. 6 §4 » (écrans
   d'application de 07 et 08) ; « 30 minutes » (carte de clôture des trois pages).
   La FAQ dit « une quarantaine d'autres pays » là où les cartes disent
   « 43 juridictions » : les deux peuvent être vrais, mais ils ne sont pas dits pareil.

4. **La citation Decathlon (Philippine Tamic) n'est pas la version canonique, et le
   dépôt le dit lui-même.** `commun/citation-decathlon.json` porte un champ
   `_source` : « Dictée par Naomie le 01/09/2026. VERSION INTÉGRALE. » (1 555 signes),
   et un champ `_divergence` qui écrit noir sur blanc : « Le site sert l'extrait, la
   maquette sert l'intégrale. À trancher avant tout portage. »
   Or, mesuré : **mes trois pages servent l'extrait condensé** (588 signes,
   « Chez Decathlon, notre défi est de capter… »), pas l'intégrale. Elles ne sont pas
   seules : `00-composants`, `01-accueil`, `04-secteur`, `05-marche`, `09-texte`
   portent le même extrait ; seule `06-cas-client` porte la version longue (979 signes
   dans le fragment). Huit pages contre une.
   C'est une citation attribuée à une personne nommée et à son employeur : **je ne l'ai
   pas touchée**, ni pour la remplacer ni pour l'ajuster. Il faut décider laquelle des
   deux versions Philippine Tamic a validée, puis l'appliquer partout d'un coup —
   c'est une décision de contenu, pas de gabarit, et elle dépasse mes cinq pages.

5. **« L'essai gratuit ouvre cet accès sans engagement »** (dernière réponse de la FAQ,
   les trois pages) et **« sans engagement et sans carte bancaire »** (21). Ce sont des
   engagements commerciaux, pas des faits produit. Je les ai laissés tels quels ; ils
   sont à valider par qui décide de l'offre. Je n'ai **rien** écrit sur le prix nulle
   part : ni grille, ni « à partir de », ni « le montant dépend ».

6. **Les deux écrans d'application de 07 ne sont pas légendés.** Le visiteur voit deux
   cadres qui se ressemblent ; ce sont l'avant et l'après de la même question. Une
   légende de deux mots sous chacun ferait le travail, mais ce serait du texte inventé :
   je ne l'ai pas écrit. **Si vous voulez ces légendes, donnez-les-moi.**

---

VERIFICATION: node construire.mjs -> 0 echec ; node commun/capture2.mjs 03-offre 07-chat 08-reglementation 21-inscription 404 -> 03-offre 26 textes < 14 px + 1 cible < 40 px (composant de veille porte, hors territoire) ; 07-chat 13 textes < 14 px (ecrans d'application partages) ; 08-reglementation 11 textes < 14 px (ecran arbre partage) ; 21-inscription 1 texte < 14 px (.t-label a 12 px, valeur du DS) ; 404 1 texte < 14 px (.t-label a 12 px, valeur du DS) — aucune alerte restante dans mon territoire, 0 lien mort, 0 champ fige, 0 debordement, 0 image cassee, 0 erreur console sur les cinq pages
