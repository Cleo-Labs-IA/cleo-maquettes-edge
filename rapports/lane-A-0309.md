# Lane A, accueil

Territoire : `pages/01-accueil.html`, `pages/01-accueil-en.html`, `commun/lanes/accueil.css`
(créé), `rapports/lane-A/`. La variante `01-accueil-noir.html` est construite depuis le même
fragment FR avec `commun/regime-noir.css` : elle est mesurée et relevée, jamais corrigée depuis
le régime noir, qui est hors territoire.

Tout ce qui suit vient soit d'une mesure (`commun/capture2.mjs`, `rapports/lane-A/sonde.mjs`,
`rapports/lane-A/contraste.mjs`), soit d'une image regardée (`captures/lane/*.png`,
`rapports/lane-A/ecrans/*.png`). Les captures desktop et téléphone ont été lues tranche par
tranche, avant et après.

⚠️ **Une mesure du AVANT est contaminée par une autre lane.** Entre ma première et ma dernière
capture, une autre lane a refait la barre de navigation et le pied : le pied de téléphone est
passé de 1 919 px à 1 482 px et six cibles de moins de 40 px du pied ont disparu sans que j'y
touche. Les colonnes « pied (téléphone) » et « cibles < 40 » du tableau APRÈS incluent donc ce
travail-là. Les colonnes qui ne dépendent que de mon territoire (h1, hauteur desktop, textes
< 14 px, premier écran, contrastes) sont, elles, imputables à cette lane.

---

## Mesures AVANT / APRÈS

Relevé le 03/09/2026. AVANT = `node commun/capture2.mjs` avant toute écriture.
APRÈS = même commande après la dernière construction.

### 01-accueil (FR)

| | AVANT | APRÈS |
|---|---|---|
| h1 | 68 px, graisse 700, `.t-hero .t-hero-gras`, 1 seul h1 | inchangé : 68 px, graisse 700, 1 seul h1 |
| hauteur desktop (1440) | 8 122 px | 8 138 px |
| hauteur téléphone (390) | 13 973 px | 13 476 px |
| textes < 14 px (téléphone) | 62 | **21** |
| dont sous 12 px | 8 | 2 (les deux crans du sélecteur de langue, barre de nav) |
| cibles < 40 px (téléphone) | 8 | **2** (les deux dans la barre de nav) |
| liens morts `href="#"` | 0 | 0 |
| `input disabled` | 0 | 0 |
| pied (desktop / téléphone) | 525 px / 1 919 px | 525 px / 1 482 px (autre lane) |
| débordement horizontal | aucun | aucun |
| paragraphe le plus large | 600 px | 600 px |
| images cassées / sans alt | 0 / 0 | 0 / 0 |
| erreurs console | 0 | 0 |
| premier écran 1280 × 720 | h1 à 181, chapô à 343, champ email à 427, interface à 544 : les quatre visibles, **176 px d'interface** (en-tête de fenêtre + 116 px de fiche) | h1 à 149, chapô à 311, champ à 395, interface à 498 : les quatre visibles, **222 px d'interface** (en-tête + 162 px de fiche : le nom du produit, la jauge « 18 / 25 couvertes », la ligne US et la citation) |
| premier écran 390 × 844 | h1 à 133, chapô à 286, champ à 418, interface à 596 : les quatre visibles, 248 px d'interface | identique (le hero du téléphone n'a pas été touché) |

### 01-accueil-en (EN)

| | AVANT | APRÈS |
|---|---|---|
| h1 | 68 px, graisse 700, 1 seul h1 | inchangé |
| hauteur desktop | 7 966 px | 7 981 px |
| hauteur téléphone | 13 671 px | 13 165 px |
| textes < 14 px (téléphone) | 62 | **21** |
| cibles < 40 px (téléphone) | 10 | **3** (les trois dans la nav et le pied) |
| liens morts | 0 | 0 |
| pied (desktop / téléphone) | 525 px / 1 919 px | 525 px / 1 472 px (autre lane) |
| débordement | aucun | aucun |
| paragraphe le plus large | 600 px | 600 px |
| premier écran 1280 × 720 | identique au FR : 176 px d'interface | identique au FR : 222 px d'interface |
| structure comparée au FR | 347 balises contre 347, aucun écart | 350 contre 350, **aucun écart, balise pour balise et classe pour classe** |

La parité est vérifiée par un diff de squelette (balise + classe, commentaires retirés) :
`FR 350 | EN 350 → structures identiques`. Chaque édition a été appliquée aux deux fichiers
dans la même passe.

### 01-accueil-noir (même page sous `commun/regime-noir.css`)

| | AVANT | APRÈS |
|---|---|---|
| h1 | 68 px, 1 seul h1 | inchangé |
| hauteur desktop | 8 351 px | 8 362 px |
| hauteur téléphone | 14 514 px | 14 012 px |
| textes < 14 px (téléphone) | 60 | **19** |
| cibles < 40 px (téléphone) | 7 | **0** |
| liens morts | 0 | 0 |
| débordement | aucun | aucun |
| premier écran 1280 × 720 | 176 px d'interface | 222 px d'interface |

### Ce qui reste sous 14 px, et pourquoi

Les 21 textes restants sur l'accueil FR ne sont pas des oublis, ce sont des jetons décidés
par le socle, ou de la barre de nav :

- 15 étiquettes en capitales à **12 px** (`.surtitre`, `.t-label`, `.pl-num`, `.flux-rang`).
  `base.css:137` porte la décision écrite : « 12 px et pas 10 : à 10 px en capitales,
  l'étiquette ne se lit plus (mesuré le 03/09) ». Les relever à 14 px sur la seule page
  d'accueil désaccorderait l'accueil de tout le reste du site.
- 4 pastilles de statut à **13 px** (`.marqueur`). Décision du socle également
  (`composants.css:1326`). Mesuré : à 14 px, « DONNÉE MANQUANTE » ne tient plus sur la ligne
  « Proposition 65 » à 390 px.
- 2 crans du sélecteur de langue à **11 px**, dans `commun/bandeau-nav.html` : hors territoire.

Les 2 cibles de moins de 40 px restantes sont `a.nav-logo` (24 × 44) et un cran du sélecteur
de langue (34 × 32), toutes deux dans la barre de nav : hors territoire.

---

## Ce qui a été changé

### Contrastes mesurés dans l'interface produit du hero

`commun/lanes/accueil.css` §1. C'était le défaut annoncé, et il était pire qu'annoncé : les
**trois** badges de la fiche étaient peints par les règles `.sur-sombre .m-*`
(`composants.css:148-151`), qui servent des valeurs de champ profond en littéral et gagnaient
sur la carte blanche (0,2,0 contre 0,1,0). `.hero-produit` rebascule bien `--c-text*`, mais des
valeurs littérales ne se laissent pas rebasculer par une variable.

| badge | AVANT | APRÈS |
|---|---|---|
| « Donnée manquante » | rgba(255,255,255,0.45) sur rgba(255,255,255,0.07) = **1,00:1** — absent de la page | **5,98:1** |
| « Couvert » ×2 | #3FD08A sur rgba(63,208,138,0.13) = **1,81:1** | **5,53:1** |
| « À vérifier » | #E0A63C sur rgba(224,166,60,0.13) = **1,97:1** | **5,15:1** |

Correction : les jetons de statut du régime clair (`base.css:58-60`) réécrits **en littéral**,
sous `.sur-sombre .hero-produit .m-*`. En littéral et pas en `var()` parce que sur
`01-accueil-noir`, `regime-noir.css` redéfinit `--c-pass` et `--c-risk` en variantes de champ
profond : une `var()` aurait ramené le même défaut sur la variante noire. C'est exactement la
manœuvre que `regime-noir.css:96-98` fait déjà pour `.fiche`. La pastille verte du verdict
(`.pl-pastille`) est traitée pareil, pour la même raison.

Le reste de l'encre du bloc a été mesuré ligne par ligne et était déjà juste :
`.fiche-ref` 4,59:1, `.fiche-nom` 19,80:1, `.fiche-entete-pays` 18,65:1, `.pl-champ span`
4,59:1, `.pl-champ b` 19,80:1, `.pl-verdict` 4,59:1, `.t-h3` 19,80:1, la citation 16,07:1,
« CPSIA, section 101 (a) » 10,85:1. Seul `.m-manquant` restait juste sous la barre avec l'encre
`--c-text-3` (4,31:1) : il prend `--c-text-2`, qui rend 5,98:1.

### Champ email du hero

`commun/lanes/accueil.css` §2. Trois défauts mesurés, tous dans un bloc qui n'appartient qu'à
cette page :

- l'invite « Votre adresse email » rendait **4,10:1** (rgba(255,255,255,0.42) sur le fond du
  champ). C'est la seule étiquette visible du champ. Portée à 0,56 d'alpha, elle rend
  **5,45:1**.
- `composants.css:1048` pose `outline:0` sur l'input (0,1,1), qui battait le `:focus-visible`
  du socle (0,1,0) : au clavier, le champ ne répondait que par un bord passant de 0,13 à 0,28
  d'alpha. Un anneau blanc de 2 px est rendu au `:focus-visible` de cet input.
- l'input était à 15 px : sous 16 px, iOS zoome tout seul à la mise au point. 16 px sur
  téléphone.

### L'interface du hero sur téléphone

`commun/lanes/accueil.css` §3. `.hero-produit` vit hors `.conteneur` : à 390 px il n'avait pas
de gouttière, l'écran touchait les deux bords et ses coins arrondis laissaient deux éclats de
champ profond aux angles supérieurs. J'ai **mesuré la gouttière avant de la poser** : 2 × 16 px
font passer la ligne « Étiquetage textile 1007/2011 » + son badge de 316 px demandés à 304 px
disponibles, donc sur deux lignes. La pleine largeur est donc assumée (c'est aussi le geste de
Legora et de Harvey) et l'arrondi retiré sous 640 px : la bande se lit comme voulue, pas comme
tronquée.

Les tailles écrites en dur de l'interface (13 px sur `.pl-champ`, 12 px sur
`.fiche-entete-pays` et sur le fil d'Ariane) échappaient au relèvement du socle
(`composants.css:1324`, qui ne connaît que la famille `.t-caption`). Elles passent à 14 px,
c'est-à-dire à l'intention déjà écrite dans le socle.

### Premier écran sur un portable

`commun/lanes/accueil.css` §4. À 1280 × 720, les quatre éléments demandés étaient déjà visibles,
mais il ne restait que 176 px d'interface : l'en-tête de fenêtre et un tiers de la fiche. Sur
un **écran court seulement** (`min-width:1025px` et `max-height:820px`), le hero rend 32 px de
padding haut et 14 px de marge : l'interface remonte de 544 à 498 px et montre **222 px**, soit
le nom du produit, la jauge, l'en-tête « US États-Unis », la première ligne de statut et la
citation. Sur un grand écran, le hero n'a pas bougé d'un pixel.

### Le témoignage

`commun/lanes/accueil.css` §5. La citation Decathlon fait 17 lignes à 390 px ; centrée, elle
rendait deux bords en drapeau sur toute sa hauteur. Sous 640 px la seule citation s'aligne à
gauche ; le portrait, le logo, l'attribution et le lien restent centrés. **La citation n'est
pas touchée d'un caractère**, l'alignement est une règle CSS.

### Les trois chiffres des agents

`commun/lanes/accueil.css` §6. `.agent-kpi` est une rangée flex dont chaque colonne prend la
largeur de son étiquette : à 390 px, « 106 » et « 25 000 » se posaient sur des colonnes de 70
et 160 px et « 19 000 » repartait seul à la ligne, sans alignement. Sous 640 px, une grille à
deux colonnes égales les remet en face les uns des autres. Les étiquettes passent de 12 à
14 px (elles sont hors de la famille `.t-caption`, elles échappaient au relèvement du socle).
**Aucun des trois chiffres n'a été touché.**

### Les deux liens LinkedIn des experts

`commun/lanes/accueil.css` §7. Mesurés à 51 × 21 px sur téléphone. Le balayage des cibles de
44 px du socle (`composants.css:1341`) relève `.cta-texte` et les listes du pied, pas
`.experts-portraits .t-caption[href]`. Ils font maintenant 44 px de haut, mesuré à 44 × 44.

### « Notre méthode » : le bleu sur champ profond

`commun/lanes/accueil.css` §8, plus une classe d'accroche `acc-methode` posée sur la section
dans les deux pages. La classe `.pipeline` sert aussi 23-research, 02-entreprise et
29-article-deel-en : elle n'est jamais touchée nue.

- `.pl-num` servait le bleu de marque #0008CF sur le champ #0F0E0D : **1,37:1**, les trois
  numéros d'étage ne se voyaient pas. Le régime noir a déjà tranché exactement cet arbitrage
  (`regime-noir.css:196-213`, avec ses mesures) : sur champ sombre, l'encre bleue devient
  `--c-periwinkle` #8A93FF. Mesuré après : **6,87:1** en régime clair, **6,51:1** en régime
  noir. `--c-signal-clair` #5B65FF, que la consigne de DA nomme, n'aurait rendu que **4,38:1**,
  sous la barre pour un texte de 12 px — c'est la raison, mesurée, de préférer le jeton que le
  socle a lui-même retenu pour l'encre bleue sur champ sombre.
- les six nœuds sources portaient chacun un filet bleu de 2 px : invisible **et** répété six
  fois, donc décoratif. Ils reprennent un filet neutre visible, et l'accent unique du bloc
  reste le numéro d'étage — « la masse et l'unique ». Même chose pour les cinq pastilles de
  l'axe d'encodage.
- le connecteur en faisceau tient à 60 × 230 sur grand écran ; réduit par le socle à 44 × 44 et
  pivoté d'un quart de tour, ses six courbes se tassaient en un balai illisible (visible sur
  `captures/lane/01-accueil-m7.png` d'avant). Un entonnoir dessiné pour ce format, posé dans la
  page, prend le relais sous 1024 px. **Le second connecteur garde sa flèche** : une première
  version masquait les deux SVG et laissait un vide de 44 px entre l'encodage et la règle ;
  le défaut a été vu à la recapture et corrigé en marquant le seul connecteur concerné
  (`.pl-lien-faisceau`).
- les tailles en dur du pipeline (13 px sur `.pl-n`, `.pl-etapes span` et `.pl-champ`) passent
  à 14 px sur téléphone.

### Les trois étapes du Compliance service

`commun/lanes/accueil.css` §9. `.flux-rang` était à **11 px**, sous le plancher de 12 px que le
socle a lui-même posé pour les étiquettes en capitales. Porté à 12 px, sous `#compliance-service`
seulement : `.flux` sert aussi 03-offre, 26-legal-data et 32-plan-action.

### La carte de clôture sur téléphone

`commun/lanes/accueil.css` §10, plus une classe `acc-cloture` sur la carte dans les deux pages.
`.p48` vaut 64 px de padding (`composants.css:174`) et ne se détend pas sur téléphone : à
390 px, la carte fait 334 px de large et il ne restait que **206 px** de colonne, sur lesquels
le h2 partait en quatre lignes. 32 px rendent **270 px** et trois lignes.

### Un doublon de texte, et une coquille

`pages/01-accueil.html` et `pages/01-accueil-en.html`, bloc des experts. La deuxième puce
répétait **mot pour mot** le h3 posé trois lignes plus haut :

- FR — h3 « Une équipe juridique dédiée, qui connaît votre profil. » / puce « Une équipe
  juridique dédiée, qui connaît votre profil »
- EN — h3 « A dedicated legal team, that knows your profile. » / puce « A dedicated legal team
  that knows your profile »

La puce est retirée dans les deux langues. La liste passe de trois à deux puces : je n'ai rien
écrit pour la remplacer, écrire une troisième puce reviendrait à inventer du contenu. Voir la
section « Doutes de contenu ».

Coquille corrigée, EN seulement : la virgule avant « that » dans une relative déterminative
(« A dedicated legal team, that knows your profile. » → « … team that knows … »). Le titre
français garde sa virgule, qui est correcte en français.

### Ce qui n'a pas été touché, et pourquoi

- Les chiffres : 106 pays, 25 000 réglementations, 19 000 autorités, 18 / 25 couvertes,
  100 ppm, 14 août 2011, DNM-4412. Aucun n'a bougé.
- La citation Decathlon, au caractère près.
- Les deux titres des experts et leurs deux liens LinkedIn, dictés par Naomie.
- Les cinq logos, NVIDIA compris.
- Le prix : rien n'a été écrit dessus, il n'y en a nulle part sur cette page.
- Aucune balise `code` ni `pre` sur ces deux pages : le risque de retomber en monospace ne se
  présente pas ici (vérifié, 0 occurrence).

---

## Ce qui reste hors territoire

Rien de ce qui suit n'a été touché. Chaque ligne porte le fichier, la mesure et une
proposition précise.

### 1. `commun/composants.css:148-151` — les badges de statut sur une surface claire imbriquée

`.sur-sombre .m-couvert / .m-attente / .m-manquant` servent des valeurs de champ profond en
littéral et s'appliquent à **toute** surface claire posée dans une section `.sur-sombre`, pas
seulement au champ lui-même. Mesuré : 1,00:1 / 1,81:1 / 1,97:1. Je l'ai fermé sous
`.hero-produit`, mais la règle reste un piège pour la prochaine fiche posée sur un champ
sombre. C'est la quatrième fois que ce défaut d'encre sort sur ce chantier
(cf. `composants.css:768` et `:910`).

**Proposition** : dans `composants.css`, sous les lignes 148-151, ajouter la symétrique de
`regime-noir.css:96-98` —
`.sur-sombre .fiche .m-couvert,.sur-sombre .ecran-app .m-couvert,.sur-sombre .carte-claire .m-couvert{background:rgba(13,110,68,0.09); color:#0D6E44}`
et les deux autres sur le même modèle, en littéral.

**Portée mesurée aujourd'hui** : seules `01-accueil` et `01-accueil-en` posent un `m-*` dans une
section `.sur-sombre` (vérifié sur les 47 pages). Le défaut est donc fermé sur le site, mais
la règle reste ouverte.

### 2. `commun/composants.css:996` — `.pl-num` en bleu de marque sur champ profond

`.pl-num{color:var(--c-blue)}` rend **1,37:1** sur `#0F0E0D`. Fermé sous `.acc-methode` pour
l'accueil. Aucune autre page ne pose aujourd'hui un `.pipeline` dans une section `.sur-sombre`
(vérifié sur les 47 pages), mais la règle reste ouverte pour 23-research, 02-entreprise et
29-article-deel-en le jour où leur pipeline passera sur champ sombre.

**Proposition** : `.sur-sombre .pl-num{color:var(--c-periwinkle)}` dans `composants.css`,
avec la mesure en commentaire. C'est le jeton que `regime-noir.css:202-211` a déjà retenu pour
l'encre bleue sur champ sombre, et il rend 6,87:1 là où `--c-signal-clair` rendrait 4,38:1.

### 3. `commun/composants.css:1003` — le filet bleu des six nœuds sources

`.pl-n{border-left:2px solid var(--c-blue)}` : invisible sur champ profond, et répété six fois,
donc décoratif. Fermé sous `.acc-methode`.

**Proposition** : `border-left-color:rgba(255,255,255,0.30)` quand le bloc est sur champ
profond, et garder le bleu pour l'unique accent du schéma.

### 4. `commun/composants.css:174` — `.p48{padding:64px}` ne se détend pas sur téléphone

À 390 px, une carte `.p48` laisse **206 px** de colonne. Fermé sous `.acc-cloture` pour
l'accueil seulement. `.p48` sert aussi 02-entreprise, 03-offre, 04-secteur, 05-marche,
06-cas-client, 07-chat, 08-reglementation, 09-texte et 19-poste : **neuf pages** de trois
autres lanes.

**Proposition** : `@media (max-width:640px){ .p32{padding:28px} .p40{padding:32px} .p48{padding:32px} }`
dans `composants.css`, à décider avec les lanes concernées puisque cela raccourcit neuf pages.

### 5. `commun/composants.css:936` — `.flux-rang` à 11 px

Sous le plancher de 12 px que `base.css:137` pose pour les étiquettes en capitales. Fermé sous
`#compliance-service`. Reste ouvert sur 03-offre, 26-legal-data, 26-legal-data-en et
32-plan-action.

**Proposition** : `.flux-rang{font-size:0.75rem}` dans `composants.css`, valeur du jeton
`.t-label`.

### 6. `commun/regime-noir.css:213` — le bleu porté par une CLASSE échappe à la bascule

Le régime noir remplace l'encre bleue par `--c-periwinkle`, mais uniquement quand elle est
posée **en style inline** (`[style*="color:var(--c-blue)"]`). `.cta-texte` tient son bleu de
`composants.css:1149`, donc d'une classe : sur `01-accueil-noir`, mesuré au navigateur —

| lien | mesure |
|---|---|
| « Voir le cas client en entier » (`.temoin-compact .cta-texte`) | **1,64:1** |
| « En savoir plus » ×3 (`.agent .cta-texte`) | **1,64:1** |

C'est le même ratio, et la même cause, que le défaut que ce fichier a déjà documenté et fermé
pour les styles inline. Les deux liens LinkedIn, eux, sont bien basculés (6,51:1), parce que
leur bleu est posé en inline.

**Proposition** : ajouter `.cta-texte{color:var(--c-periwinkle)}` à `regime-noir.css`, à côté
de la ligne 213, avec la même exception d'îlot clair que la ligne 214
(`.carte-claire .cta-texte, .ecran-app .cta-texte, .fiche .cta-texte, .flottant .cta-texte`
gardent le bleu). Correction pour la variante noire seulement ; le régime clair rend 10,85:1
et ne bouge pas.

### 7. `commun/composants.css:1048` — `outline:0` sur un champ de saisie

`.champ-demo input{outline:0}` (0,1,1) battait le `:focus-visible` du socle (0,1,0). Fermé pour
ce champ. C'est la seule occurrence de `outline:0` ou `outline:none` dans `composants.css`
(vérifié), donc aucun autre champ n'est concerné aujourd'hui.

**Proposition** : retirer `outline:0` de la ligne 1048 et laisser le `:focus-visible` de
`base.css` faire son travail, plutôt que garder l'override dans un fichier de lane.

### 8. `commun/bandeau-nav.html` + `commun/composants.css:951-952` — la barre de nav sur téléphone

Ce sont les deux dernières alertes de `01-accueil` :

- `.nav-langue span,.nav-langue a{font-size:0.6875rem}` = **11 px**, et la cible mesure
  **34 × 32 px**.
- `a.nav-logo` mesure **24 × 44 px** sur téléphone : 44 px de haut, mais 24 px de large.

**Proposition** : porter `.nav-langue` à 12 px avec `min-height:44px; min-width:44px` sur
téléphone ; donner au `a.nav-logo` un `min-width:44px` avec le mot-symbole centré dedans.

### 9. `commun/composants.css:974-977` — `.agent-kpi` en rangée flex

Les colonnes prennent la largeur de leur étiquette, elles ne s'alignent donc jamais entre
elles ; et `.agent-kpi span` à 12 px échappe au relèvement de `composants.css:1324`. Fermé sous
`.g-agents` pour le téléphone. `.agent-kpi` ne sert que l'accueil aujourd'hui, mais la règle
mériterait de porter la grille et le 14 px directement dans le socle.

### 10. Deux notes qui ne sont pas des défauts, mais des arbitrages à trancher

- **Le h1 de l'accueil reste à 68 px.** C'est le cran propre `.t-hero-gras`, réservé à cette
  page par la décision du 03/09. Il n'entre pas dans l'échelle `.t-hero` à 52 px. Je ne l'ai
  pas touché : c'est un arbitrage de Naomie, pas un défaut.
- **Les logos de la bande de confiance n'ont pas la même graisse optique** : Mercedes-Benz est
  rendu petit avec son nom sous le sigle, L'Occitane est très clair, Decathlon très gras.
  Ce sont les fichiers eux-mêmes (`images/`), hors territoire, et NVIDIA est resté en place
  comme demandé.

---

## Doutes de contenu

Tout ce qui touche aux faits, aux chiffres, aux personnes et aux citations. Rien n'a été
inventé, rien n'a été chiffré.

1. **La puce retirée dans les deux langues.** La liste des experts passe de trois à deux
   puces. Le texte retiré était le décalque exact du h3 qui le surplombe, mais c'est une
   suppression de contenu : à valider. Si une troisième puce est voulue, elle doit venir de
   Naomie — je ne l'écris pas.
2. **La virgule anglaise corrigée** (« A dedicated legal team, that knows your profile. »).
   Traitée comme une coquille de ponctuation, pas comme une réécriture. Si le titre EN est
   dicté au caractère près, cette correction est à annuler.
3. **La bande de confiance annonce « Aux côtés de marques et de fabricants internationaux »,
   sans nombre.** Le commentaire du fragment dit qu'un chiffre y entrera « le jour où il sera
   tranché ». Il n'est toujours pas tranché : je n'en ai posé aucun.
4. **« 18 / 25 couvertes » dans la fiche de démonstration.** C'est une donnée de maquette, sur
   un produit de maquette (« Jean droit enfant », référence DNM-4412). Elle ne prétend rien
   sur un client réel, mais si l'écran doit passer en démonstration commerciale, ce couple
   mérite d'être confirmé.
5. **La date « en vigueur 14 août 2011 » du CPSIA** (seuil de 100 ppm, § 101(a)(2)(C)) est
   juste et n'a pas été touchée, comme demandé. Elle est écrite **deux fois** sur la page, dans
   l'interface du hero et dans « Notre méthode ». Le commentaire du fragment dit que la
   deuxième est recopiée de la première « par le script d'édition : une seule source ». Il n'y
   a pas de script : ce sont deux blocs HTML indépendants, et rien ne garantit qu'ils resteront
   d'accord. À surveiller, ou à faire porter par un vrai fragment partagé.
6. **La composition de « Notre méthode » n'est validée par personne.** Le commentaire du
   fragment le dit : « Naomie référençait une image d'exemple qui n'est pas passée dans le
   message : la composition est construite sur sa description, à confirmer. » Toujours à
   confirmer, je n'y ai touché que les contrastes et les tailles.
7. **Les six « nœuds sources » du pipeline** (Journal officiel de l'Union européenne, autorité
   de surveillance du marché, projet de texte en consultation, annexe modifiée, avis
   d'organisme notifié, norme harmonisée) sont des catégories, pas des sources nommées. Rien à
   vérifier, mais rien ne les rattache non plus à un corpus mesuré.
8. **Les deux titres des experts** (« Global Head of Product & Sanitary Compliance »,
   « Stalwart in Consumer Protection & Product Safety ») et les deux liens LinkedIn sont
   restés au mot près, comme dictés.
9. **La citation Decathlon et son attribution** (Philippine Tamic, Product Compliance
   Operations Manager chez Decathlon) n'ont pas bougé d'un caractère. Seul l'alignement
   change, sur téléphone.

---

VERIFICATION: node construire.mjs -> 0 echec ; node commun/capture2.mjs 01-accueil 01-accueil-en 01-accueil-noir -> 01-accueil 21 textes < 14 px + 2 cibles < 40 px (mobile), 01-accueil-en 21 textes < 14 px + 3 cibles < 40 px (mobile), 01-accueil-noir 19 textes < 14 px (mobile) — tout le reste OK, et les alertes restantes sont les jetons 12/13 px decides par le socle plus la barre de nav et le pied, hors territoire
