# Réfutation — structure HTML des 12 pages

Vérificateur adverse, 27/08/2026. Lecture seule sur `pages/`, `commun/`, `sortie/`
et les `.mjs`. Aucun script de construction lancé. Scripts jetables dans
`/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-refute/`.

## Verdict : PARTIEL

La première moitié de l'affirmation TIENT, mesurée et non contredite : les 12 pages
portent bien un seul attribut `class`, fusionné dans le bon ordre, avec la bonne classe,
et le rembourrage attendu se mesure au navigateur.

La seconde moitié — « **RIEN D'AUTRE** n'a bougé dans ces fichiers » — est **fausse sur
1 fichier sur 12** : `pages/17-modeles.html` porte 6 lignes modifiées de plus. Ce n'est
pas un dégât collatéral (c'est le correctif F3 du `PLAN.md`, confié au même agent), mais
l'affirmation telle qu'elle est écrite ne survit pas.

## L'oracle utilisé

Le chantier n'est pas un dépôt git : il n'y a pas de `git diff`. J'ai trouvé les copies
pré-édition laissées par les agents dans
`…/b2f63723-…/scratchpad/avant/` (13 fichiers) et `…/scratchpad/f1-avant/` (4 fichiers).

Preuve qu'elles sont bien pré-correctif : mon détecteur d'attribut dupliqué rend
**16 balises fautives** sur ces 17 copies, et **0** sur les fichiers courants. Témoin
négatif en règle.

Limite honnête : ces sauvegardes ont été écrites par les agents qui ont ensuite édité.
Elles ne sont donc pas un oracle strictement indépendant. Trois recoupements
indépendants les corroborent : (1) l'arithmétique en octets ci-dessous, qui tient toute
seule ; (2) les octets annoncés dans `rapports/f-dup-3.md` (4333/3707/3356) qui
correspondent aux sauvegardes ET aux fichiers courants ; (3) la mesure au navigateur.

## Ce que j'ai mesuré

### 1. Attributs dupliqués — 0, sur un balayage plus large que celui du plan

Analyseur maison (Python) qui parse **chaque balise ouvrante** de `pages/*.html` et
`commun/*.html` (23 + 6 fichiers), commentaires et contenus `<script>`/`<style>` neutralisés,
balises multi-lignes comprises, et compte **tous** les noms d'attributs — pas seulement
`class` : `style`, `id`, `href`, `src`, `data-*`, tout.

    pages/ + commun/*.html courants ..................  0 balise à attribut dupliqué (29 fichiers)
    sauvegardes avant/ + f1-avant/ (témoin négatif) ... 16 balises              (17 fichiers)
    sortie/*.html construits ..........................  0 balise               (26 fichiers)

Le grep du plan (`class="[^"]*"[^>]*class="`) ne voit qu'un `class` doublé sur une seule
ligne. Le mien voit n'importe quel attribut, sur n'importe quelle balise, même écrite sur
plusieurs lignes. Il ne trouve rien de plus.

### 2. L'énumération des 12 est-elle complète ? Oui.

- 8 pages n'ont pas été touchées (`01`,`03`,`04`,`05`,`06`,`07`,`08`,`09` — mtime du 26/08) :
  leur état actuel EST leur état pré-correctif, et le balayage y rend 0.
- Les 3 autres pages éditées ce matin (`00-composants`, `02-entreprise`, `20-campagne`)
  ont leurs copies « avant » : 0 double `class` dans chacune.
- `commun/bandeau-nav.html`, `pied.html`, `vignettes.html`, `ecran-*.html` : 0.

Il n'existait donc pas de 13ᵉ page à corriger. Rien n'a été oublié.

### 3. Diff ligne à ligne, avant → après

11 fichiers sur 12 : **un seul hunk `3c3`**, la ligne 3, rien d'autre.

    md5 du fichier entier PRIVÉ de la ligne 3, avant vs après :
    10,11,12,13,14,15,16,18,19,21,22 ......... IDENTIQUE
    17-modeles ............................... DIFFÈRE

`17-modeles.html` : en plus de la ligne 3, les lignes 20, 32, 44, 56, 68, 80 passent de
`class="vignette"` à `class="vignette surface-sombre"`. C'est F3 du plan (la classe est
bien définie, `commun/composants.css:765`). Intentionnel, documenté — mais l'affirmation
disait « rien d'autre ».

### 4. L'arithmétique en octets, qui tient sans les sauvegardes

`" class="` fait 9 caractères et devient une espace : **−8 octets**, exactement.

    11 fichiers : −8 octets chacun. Nombre de lignes strictement inchangé.
    17-modeles  : 6742 → 6824, soit −8 + 6 × 15 (« surface-sombre ») = +82. Au caractère près.

Aucune perte de contenu ne peut se cacher derrière ces deltas.

### 5. Aucun `style=` perdu

    fichier          style= avant   style= après
    10-ressources         17            17
    11-blog               16            16
    12-article            17            17
    13-glossaire          15            15
    14-terme              10            10
    15-evenements         22            22
    16-evenement          26            26
    17-modeles            23            23
    18-recrutement        27            27
    19-poste              11            11
    21-inscription        13            13
    22-legal               4             4

Dans `sortie/`, l'écart est de +19 partout, sauf `21-inscription` et `22-legal` à +15 :
ces deux pages n'ont pas de bloc `<!--CTA-->`, qui apporte 4 `style=`. Écart expliqué,
pas une perte.

### 6. Balises équilibrées — 0 déséquilibre sur les 12

Comptage ouvrantes/fermantes pour `div, section, ul, li, p, a, table, h1, h2, h3`
(commentaires et `<svg>` retirés). Toutes les paires s'équilibrent, et **aucun compte ne
diffère de l'état pré-correctif**.

    10-ressources 29/29 div · 11-blog 34/34 · 12-article 26/26 (4/4 section, 7/7 li)
    13-glossaire 26/26 · 14-terme 8/8 · 15-evenements 47/47 · 16-evenement 49/49
    17-modeles 44/44 · 18-recrutement 31/31 (3/3 section) · 19-poste 24/24 (11/11 li)
    21-inscription 14/14 · 22-legal 8/8 · h1 : exactement 1 par page

### 7. La classe fusionnée est-elle la BONNE ? Mesuré au navigateur.

Chromium, `file://` sur `sortie/`, `getComputedStyle` de `section.sur-sombre` :

    page             classes lues dans le DOM             padTop   padBottom
    10-ressources    sur-sombre gc-deep section-serree     88px      64px
    11-blog          sur-sombre gc-deep section-serree     88px      64px
    12-article       sur-sombre gc-deep section-serree     88px      88px
    13-glossaire     sur-sombre gc-deep section-serree     88px      64px
    14-terme         sur-sombre gc-deep section-serree     88px      88px
    15-evenements    sur-sombre gc-deep section-serree     88px      64px
    16-evenement     sur-sombre gc-deep section-serree     88px      88px
    17-modeles       sur-sombre gc-deep section-serree     88px      64px
    18-recrutement   sur-sombre gc-deep section-serree     88px      64px
    19-poste         sur-sombre gc-deep section-serree     88px      88px
    21-inscription   sur-sombre gc-deep section-hero      128px     104px
    22-legal         sur-sombre gc-deep section-serree     88px      88px

Jetons lus sur `:root` : `--pad-section-courte: 88px`, `--pad-hero-haut: 128px`,
`--pad-hero-bas: 104px`. Les 12 tombent exactement dessus. Les `64px` en bas sont les
`style="padding-bottom:var(--s-64)"` inline, conservés — ils gagnent sur la classe, c'est
le comportement attendu.

`21-inscription` est bien la seule à recevoir `section-hero`, et c'est bien ce que sa
ligne 3 pré-correctif disait (`class="section-hero"` dans la sauvegarde). Aucune page n'a
reçu `section-serree` alors que son second attribut disait autre chose : j'ai relu les
12 lignes 3 d'avant, une par une.

Note au passage : `gc-deep` n'apparaît comme sélecteur dans aucun CSS, ni dans le CSS
embarqué des pages construites. Classe morte, comme le plan l'annonçait. Elle ne fait
rien, ni en bien ni en mal.

### 8. Débordement horizontal — 0, aux 4 largeurs

Deux mesures par page et par largeur (390, 768, 1280, 1920) :
`documentElement.scrollWidth − clientWidth`, et un balayage de **tous** les éléments du
`body` dont le bord droit dépasse la largeur utile (positions `fixed` exclues).

    12 pages × 4 largeurs = 48 mesures : 0 débordement, 0 élément débordant.

Témoin négatif du détecteur : sur `10-ressources` à 390 px, injection d'un `div` de 900 px
dans le bandeau → le détecteur passe de `0` à `1`, `scrollWidth` de 390 à 928. Le
détecteur voit bien ce qu'il doit voir ; son `0` n'est pas un zéro d'outil mort.

### 9. Le pixel, pas le jeton

Écart-type des pixels du bandeau (capture 1280×520, zone prise sous la nav) :

    10-ressources  σ=115,1  moyenne 155,2
    21-inscription σ=74,5   moyenne 46,3
    22-legal       σ=115,9  moyenne 116,6
    17-modeles     σ=114,0  moyenne 120,9

Aucun bandeau plat. J'ai **regardé** les captures de `10-ressources` et `21-inscription` :
le bandeau sombre commence à y=61, juste sous la barre de nav (60 px), le titre et le
chapô sont posés dessus avec de l'air, rien n'est mangé par la nav collante.

### 10. Rien d'autre au niveau octet

    CRLF introduit ......... 0 sur les 12
    BOM .................... aucun (les 12 commencent par 3c 21 2d = "<!-")
    saut de ligne final .... présent sur les 12 (0x0a)

## Ce qui est réfuté

`pages/17-modeles.html` — 6 lignes modifiées au-delà de la ligne 3. « RIEN D'AUTRE n'a
bougé dans ces fichiers » est faux pour ce fichier. La formulation juste serait : « rien
d'autre sur 11 des 12 ; sur `17-modeles`, la fusion coexiste avec le correctif F3, six
`class="vignette"` devenues `class="vignette surface-sombre"` ».

## Ce que je n'ai pas pu casser

Tout le reste. J'ai cherché des attributs dupliqués de tout nom sur tout le chantier,
une balise déséquilibrée, un `style=` perdu, une mauvaise classe, un octet parasite, un
débordement à quatre largeurs, et un bandeau illisible au pixel. Rien n'est venu.

## Faux positifs que j'ai écartés

- **« `sortie/` a 19 `style=` de plus que `pages/` : un style a été ajouté »** — non, c'est
  la nav + le pied injectés à la construction. Et l'écart de +15 sur `21`/`22` s'explique
  par l'absence de bloc CTA (4 `style=`). Écart constant, pas une fuite.
- **« `gc-deep` n'est défini nulle part, donc la classe fusionnée est cassée »** — non,
  `gc-deep` est mort avant comme après ; c'est `sur-sombre` qui porte le fond
  (`commun/base.css:140`) et `section-serree` le rembourrage (`:154`). Mesuré à 88 px.
- **« le `padding-bottom` de 64 px prouve que `section-serree` ne s'applique pas »** — non,
  c'est le `style=` inline qui gagne sur la classe, exactement comme voulu ; le `padding-top`
  de 88 px prouve que la classe s'applique bien.
- **« le bandeau commence sous la nav collante, le titre est peut-être masqué »** — non,
  section top mesurée à y=61 avec une nav de 60 px, et vérifié à l'image.

## Fichiers

- Scripts de mesure : `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-refute/`
  (`dup.py`, `dup_temoin.py`, `dup_sortie.py`, `bal.py`, `mesure.mjs`, `ovf.mjs`, `temoin.mjs`, `vue.mjs`)
- Captures regardées : `scratch-refute/haut-10-ressources.png`, `haut-21-inscription.png`,
  `haut-22-legal.png`, `haut-17-modeles.png`
