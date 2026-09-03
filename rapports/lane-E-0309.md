# Lane E, cadre commun et solutions

Territoire : `commun/bandeau-nav.html`, `commun/bandeau-nav-en.html`, `commun/pied.html`,
`commun/pied-en.html`, `commun/mouvement.js`, `commun/lanes/cadre.css` (créé),
`pages/30-securite.html` à `pages/36-solutions.html`.

Bancs écrits pour cette lane, tous rejouables :
`rapports/lane-E/cadre.mjs` (47 contrôles, cadre français),
`rapports/lane-E/cadre-en.mjs` (12 contrôles, cadre anglais),
`rapports/lane-E/diag.mjs` (qui est le texte sous 14 px, dans quelle zone).
Les mesures d'avant sont conservées dans `rapports/lane-E/avant/*.json`.

---

## Le cadre : résultats des tests

### Le menu sur téléphone (390 × 844) : il ne s'ouvrait pas

Le défaut principal de la lane, invisible tant que personne ne cliquait.

Au premier passage du banc, le clic sur `.nav-burger` faisait tout ce qu'il fallait
côté état — `hidden` passait à `false`, `aria-expanded` à `true`, `html.menu-ouvert`
était posée, `overflow:hidden` s'appliquait — **et le panneau rendait 390 × 45 px pour
1 615 px de contenu**. La capture `captures/lane/E-menu-ouvert.png` du premier passage
montrait une bande blanche avec le mot « PRODUIT » coupé, rien d'autre.

Cause mesurée : `.menu-mobile` est en `position:fixed` **à l'intérieur** de `<nav class="nav">`
(construire.mjs insère le panneau avant `</nav>`), et `.nav` porte `backdrop-filter:blur(24px)`.
Un `backdrop-filter` crée un bloc conteneur pour les descendants `fixed` : le panneau se calait
donc sur la boîte de la barre, haute de 61 px, avec `top:60px` et `bottom:0`.

Correction posée dans `cadre.css` : `html.menu-ouvert .nav{backdrop-filter:none; background:var(--c-white)}`.
Le bloc conteneur revient à la fenêtre le temps que le menu est ouvert.

| contrôle | avant | après |
| --- | --- | --- |
| boîte du panneau ouvert | 390 × **45** px | 390 × **783** px |
| haut du panneau / bas de la barre | 60 px / 61 px | 61 px / 61 px |
| contenu, défilement interne | 1 615 px, oui | 1 666 px, oui |
| textes sous 14 px dans le panneau | 3 (`.mm-titre` à 12 px) | 0 |
| cibles sous 44 px dans le panneau | 0 | 0 |
| `href="#"` dans le panneau | 0 | 0 |
| bouton de démo à l'écran quand le panneau est ouvert | 2 fois (barre + panneau) | 1 fois |

Le panneau liste bien, mesuré au DOM : Produit (4 liens), Textes (17), Ressources (4),
Entreprise (lien direct vers `/fr/company`), puis Connexion → `https://insight.cleolabs.co`
et le bouton « Voir une démo » → `https://meetings.hubspot.com/anaelle-guez/rendez-vous`.

Fermeture, tous vérifiés au navigateur : Échap referme et rend le défilement
(`hidden=true`, `aria-expanded=false`, classe retirée) · un clic sur un lien referme **et**
navigue (testé sur `/fr/platform`, arrivée confirmée, `hidden=true` à l'arrivée) · la page
derrière ne bouge pas (`scrollY` 0 → 0 après une molette de 600 px) · le bouton prend le
focus au clavier · le bouton mesure 44 × 44.

Captures : `captures/lane/E-menu-ouvert.png` (haut du panneau),
`captures/lane/E-menu-bas.png` (bas, après défilement interne),
`captures/lane/E-menu-ouvert-en.png` (le même en anglais, 390 × 783, quatre groupes).

### Les trois méga-menus (1440 × 900)

Barre mesurée à **61 px**, `position:sticky`, fond `rgba(255,255,255,0.6)`, flou `blur(24px)`,
libellés à **14 px** pour les quatre déclencheurs, bouton de menu caché (`display:none`),
un seul bouton d'action visible.

| panneau | état au repos | au survol | boîte | liens | `href="#"` |
| --- | --- | --- | --- | --- | --- |
| Produit | `hidden`, opacité 0 | `visible`, opacité 1 | 1360 × 253 (322 avant) | 4 | 0 |
| Textes | `hidden`, opacité 0 | `visible`, opacité 1 | 1360 × 304 | 17 | 0 |
| Ressources | `hidden`, opacité 0 | `visible`, opacité 1 | 1360 × 164 | 4 | 0 |

Les trois s'accrochent à 59 px, sous la barre, et **l'ouverture ne pousse pas la page**
(hauteur du corps identique avant et après : 4 094 → 4 094 px sur 36-solutions).

Destinations vérifiées en remontant la table de réécriture de `vercel.json` :
PPWR → `/fr/jurisdictions/european-union/regulations/ppwr` = `09-texte.html` · les huit autres
textes européens → `/fr/jurisdictions/european-union` = `05-marche.html` · les huit textes
nord-américains → `/fr/legal-data` = `26-legal-data.html` · Connexion → `https://insight.cleolabs.co`.

Les quatre liens externes du cadre répondent 200, mesuré au `curl` le 03/09/2026 :
`insight.cleolabs.co`, `meetings.hubspot.com/anaelle-guez/rendez-vous`,
`www.cleolabs.co/fr/jurisdictions/european-union` et sa version `/en` (celle vers laquelle
pointent les huit textes européens du méga anglais).

### Le lien d'évitement et le focus

Premier `Tab` depuis le haut de page : le focus arrive sur `.lien-evitement`, qui devient
visible à `16,12` en `150 × 47` px et mène à `#contenu`, ancre qui existe dans la page.
Focus sur le bouton de la barre : `2px solid rgb(0, 8, 207)`, offset 3 px.
Captures `captures/lane/E-evitement.png` et `captures/lane/E-focus-bouton.png`.

### Le pied, hauteurs mesurées

| | avant | après |
| --- | --- | --- |
| pied desktop 1440 | 525 px | **525 px** (seuil du chantier : 750) |
| signature `cleo` desktop | 186 px | 186 px |
| pied téléphone 390 | **1 919 px**, 1 colonne | **1 482 px**, 2 colonnes |
| signature téléphone | 81 px | 81 px |
| textes sous 14 px dans le pied, téléphone | 3 | **0** |
| cibles sous 40 px dans le pied, téléphone | 4 | **0** |
| liens du pied | 26, dont 0 `href="#"` | 26, dont 0 `href="#"` |
| chemins internes du pied qui aboutissent | 23 / 23 | 23 / 23 (français **et** anglais) |

Le cadre anglais passe les mêmes contrôles : `bandeau-nav-en.html` et `pied-en.html`,
12 contrôles OK sur 12, pied à 525 px, 23 chemins vérifiés, sélecteur de langue qui marque
`EN` sur `/en` et `FR` sur `/fr`, avec la bascule croisée.

---

## Mesures AVANT / APRÈS des sept pages

`node commun/capture2.mjs`, desktop 1440 et téléphone 390.

| page | h1 | hauteur desktop | hauteur téléphone | textes < 14 px (tél.) | cibles < 40 px (tél.) | liens morts | paragraphe le plus large | pied D / M |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 30-securite | 51,84 → 51,84 px | 5 564 → 5 564 | 9 449 → **9 022** | 7 → **0** | 5 → **0** | 0 → 0 | 760 → **720** | 525 / 1 919 → 525 / **1 482** |
| 31-journal | **51,84 → 40 px** | 3 564 → 3 904 | 6 583 → **6 033** | 9 → **0** | 5 → **0** | 0 → 0 | 888 → **720** | idem |
| 32-plan-action | 51,84 → 51,84 px | 3 455 → **3 253** | 5 952 → **5 517** | 12 → **0** | 5 → **0** | 0 → 0 | 760 → **720** | idem |
| 33-fabricants | 51,84 → 51,84 px | 3 167 → **3 124** | 6 040 → **5 466** | 7 → **0** | 5 → **0** | 0 → 0 | 560 → 560 | idem |
| 34-importateurs | 51,84 → 51,84 px | 3 099 → 3 124 | 5 857 → **5 315** | 7 → **0** | 5 → **0** | 0 → 0 | 560 → 560 | idem |
| 35-marketplaces | 51,84 → 51,84 px | 3 099 → 3 124 | 6 047 → **5 477** | 7 → **0** | 5 → **0** | 0 → 0 | 560 → 560 | idem |
| 36-solutions | 51,84 → 51,84 px | 4 094 → 4 094 | 6 768 → **6 349** | 14 → **0** | 5 → **0** | 0 → 0 | 780 → **720** | idem |

Aucune des sept pages ne signale plus rien : `input disabled` 0, débordement horizontal aucun,
image sans `alt` aucune, image cassée aucune, erreur console aucune, un seul `h1` par page,
description entre 115 et 183 caractères.

Deux hauteurs desktop montent, et c'est voulu :
31-journal gagne 340 px parce que ses dix entrées ne se touchent plus (voir plus bas),
34 et 35 gagnent 25 px parce que leurs deux colonnes s'alignent désormais par le haut.

---

## Ce qui a été changé

### `commun/lanes/cadre.css` (créé, 130 lignes, concaténé après composants.css)

1. **`html.menu-ouvert .nav{backdrop-filter:none; background:#fff}`** — le panneau du menu
   passait de 45 px à 783 px de haut. Cause et mesure ci-dessus. C'est la correction la plus
   importante de la lane.
2. **`.menu-mobile{top:61px}`** (≤ 1024 px) — la barre mesure 61 px bordure comprise, le
   panneau commençait 1 px trop haut et laissait voir le filet.
3. **`.mm-titre{font-size:0.875rem}`** — les trois intertitres du panneau rendaient 12 px,
   sous le seuil de 14 px du chantier. Mesuré après : 0 texte sous 14 px dans le panneau.
4. **`html.menu-ouvert .nav-fin .btn{display:none}`** — le même bouton bleu « Voir une démo »
   apparaissait deux fois à l'écran quand le panneau était ouvert (vu sur capture). La barre
   ne garde que le logo et la croix, ce que font legora.com et harvey.ai.
5. **`.mm-actions{margin-top:4px}`** sans filet ajouté — deux traits se suivaient à 20 px
   d'intervalle au bas du panneau.
6. **`.nav-fin .btn{font-size:0.875rem}`** (≤ 640 px) — le bouton rendait 12 px de texte sur
   téléphone, alors qu'il est le seul mot lisible à côté du logo. Mesuré : le libellé ne se
   coupe toujours pas, la barre tient à 390 px.
7. **`.nav-logo{min-height:44px}`** — le logo rendait 77 × 22 px, la cible la plus visitée
   était la plus petite. Mesuré après : 77 × 44, sans déplacement visible du mot-symbole.
8. **`.mega-item{align-items:flex-start}`** — dans le méga « Produit », les titres des quatre
   entrées n'étaient pas sur la même ligne (155 px contre 163) selon que la description tenait
   sur une ou deux lignes.
9. **Le pied sur téléphone, `.pied-colonnes` en deux colonnes** (≤ 640 px) — 1 919 → 1 482 px.
   Avec, dans le même bloc : `.pied ul a{min-width:44px}` (« Blog » rendait 28 px de large,
   « Skills » 30), `.pied-coordonnees a{min-height:44px}` (`contact@cleolabs.co` et
   « Réserver 30 minutes » rendaient 127 × 17), `.pied-bas` en colonne à 14 px avec le SIREN
   qui ne part plus seul à droite. Mesuré après : 0 texte sous 14 px, 0 cible sous 40 px.
10. **`.duo-haut{align-items:start; gap:56px}` et `.duo-serre{gap:56px}`** — `.duo` centre ses
    colonnes : sur 32, les deux étiquettes de section étaient décalées de 12 px (1 717 contre
    1 705) parce qu'une colonne portait une ligne de texte de plus. Au passage, le `gap:56px`
    qui vivait en `style=` inline sur sept sections rentre dans une classe.
11. **`.flux-4`** — voir 32 ci-dessous.
12. **`.mesures-fiche`** — voir 33/34/35 ci-dessous.
13. **`.journal`** — voir 31 ci-dessous.
14. **`.matrice th` à 14 px sur téléphone et `.table-cadre::after`** — voir 36 ci-dessous.
15. **`.st-lisible`** — les étiquettes de section de mes sept pages rendaient 12 px sur
    téléphone. `.surtitre` est partagé par tout le site : je ne l'ai pas déplacé, j'ai marqué
    les 21 occurrences des sept pages (voir la note hors territoire n° 2).

### `commun/bandeau-nav.html` et `commun/bandeau-nav-en.html`

16. **Le logo menait à `index.html`**, c'est-à-dire à la page d'index des maquettes
    (« Maquettes Cleo V5 — champ profond »), pas à l'accueil du site. Il mène maintenant à
    `01-accueil.html` (réécrit en `/fr`) et `01-accueil-en.html` (`/en`), avec un `aria-label`.
    Vérifié au navigateur : `/fr` et `/en`.
17. **Le style inline du logo est retiré** : il portait `filter:brightness(0) invert(1)` que
    `.nav-logo img{filter:none !important}` annulait déjà. Deux règles qui se contredisaient
    en silence ; la taille (22 px) vit maintenant dans `cadre.css`.
18. **Le méga « Produit » annonçait « Trois features » et en affichait quatre**, la quatrième
    tombant seule sur une deuxième ligne dans une grille `g3`. Grille passée en `g4`, titre
    corrigé en « Trois features et nos experts, sur le même socle de règles » — c'est ce que
    la grille montre : trois features plus « Compliance as a service ». Le méga anglais n'avait
    aucun titre là où le français en avait un : il reçoit le sien.

### Les pages

19. **31-journal** — `h1` passé de `.t-hero` (51,84 px) à `.t-titre-page` (40 px) : la page
    n'ouvre pas sur un champ profond, c'est une page de liste, et le socle réserve `.t-hero`
    aux heros. **La classe `.journal` n'existait dans aucun CSS** : les dix entrées se
    touchaient, bords arrondis contre bords arrondis, et se lisaient par paquets de deux
    (visible sur la capture d'avant). Elle existe maintenant : `flex` en colonne, 12 px entre
    les entrées, 99 px avant un nouveau mois, paragraphes ramenés de 888 à 720 px, mois à
    14 px sur téléphone.
20. **32-plan-action** — le composant `.flux` vaut trois colonnes (il a été écrit pour les
    trois étapes du Compliance service, sur l'accueil) : la quatrième étape tombait seule sur
    une deuxième ligne et le fil qui relie les étapes pendait dans le vide à droite de la
    troisième. Classe `flux-4` ajoutée sur cette page seulement : quatre colonnes de 243,5 px,
    quatre cartes de 268 px, un fil d'un bout à l'autre, deux colonnes sous 1180 px, une seule
    sous 640. Le rang (`01`, `02`…) rendait 11 px, le plus petit texte de la page : 13 px sur
    desktop, 14 sur téléphone.
21. **33, 34, 35** — la fiche « Un cas, tel qu'il remonte » : le composant `.mesures` pose
    libellé et valeur sur une même ligne, ce qui tient en pleine largeur et casse dans la
    colonne d'un `.duo`. Mesuré sur 33 : « Ce qui a bougé » rendait sur **quatre lignes d'un
    mot chacune**, la valeur à 32 px prenant toute la place. Classe `mesures-fiche` : libellé
    au-dessus, valeur à 20 px.
22. **36-solutions** — la matrice fait 820 px de large au minimum et défile dans sa boîte,
    mais **rien ne le disait** : à 390 px la troisième colonne était tranchée net au bord droit.
    Un `.table-cadre` enveloppe le tableau et pose un voile de 48 px au bord droit sous 1024 px.
    Les en-têtes du tableau rendaient 12 px sur téléphone (`.matrice th` est plus spécifique
    que la règle qui remonte les tableaux à 14 px) : 14 px.
23. **30, 32, 36** — la mesure de lecture du hero vivait en `style="max-width:760px"` /
    `780px` : classe `.hero-mesure` à 720 px, sous le seuil de 760 du chantier.

Rien n'a été touché en dehors du territoire. Aucune commande git, aucun déploiement.

---

## Ce qui reste hors territoire

1. **`construire.mjs`, fonction `avecMenuMobile` (ligne 749)** — le panneau est inséré
   *avant* `</nav>`, donc à l'intérieur de la barre. C'est la cause racine du panneau à 45 px :
   ma correction retire le flou de la barre, ce qui traite l'effet. La correction de fond est
   d'une ligne : `return out + panneau` au lieu de
   `out.slice(0, n) + panneau + '\n' + out.slice(n)`. Le CSS de `.menu-mobile` ne dépend
   d'aucun ancêtre, il fonctionnerait tel quel, et `html.menu-ouvert .nav{backdrop-filter:none}`
   deviendrait inutile.

2. **`commun/composants.css`, lignes 1324-1325** — dans le même bloc `@media (max-width:640px)`,
   `.t-caption,.t-micro,.t-sm,…{font-size:0.875rem}` remonte tout à 14 px, puis
   `.t-label,.surtitre{font-size:0.75rem}` redescend ces deux-là à 12. Deux règles voisines qui
   se contredisent, et c'est la seconde qui gagne. J'ai contourné avec `.st-lisible` sur mes
   21 étiquettes ; toutes les autres pages du site gardent 12 px sur téléphone.
   Proposition : `.t-label,.surtitre{font-size:0.875rem; letter-spacing:0.1em}` dans ce bloc,
   puis suppression de `.st-lisible` de `cadre.css` et des sept pages.

3. **`commun/composants.css`, ligne 189** — `.duo{grid-template-columns:1.05fr minmax(0,1fr)}` :
   la première colonne ne porte pas de `minmax(0,1fr)`, contre la règle de la DA. Une colonne
   `1.05fr` sans `minmax(0,…)` ne peut pas descendre sous la largeur de son contenu : un mot
   long y déborde en silence. Proposition : `minmax(0,1.05fr) minmax(0,1fr)`.

4. **`commun/composants.css`, lignes 1105-1108 et 1124-1127** — le bloc `.blog-mois` est
   déclaré **deux fois**, à l'identique sauf `margin:16px 0 0` puis `margin:14px 0 0`. La
   seconde gagne. Proposition : supprimer la première déclaration (lignes 1105-1108).

5. **`commun/composants.css`, ligne 1263** — `.menu-mobile{top:60px}` est écrit en dur alors
   que la barre mesure 61 px, bordure comprise. Corrigé par surcharge dans `cadre.css` ;
   proposition : porter `top:61px` à la source et retirer ma surcharge.

6. **`commun/composants.css`, ligne 627** — `.nav-fin .btn{font-size:0.75rem}` sous 640 px.
   Corrigé par surcharge ; proposition : `0.875rem` à la source, avec `padding:9px 16px`,
   ce qui tient à 390 px (mesuré).

7. **`commun/composants.css`, ligne 365** — `.mesures .libelle{flex:1; min-width:0}` : dans une
   colonne étroite, le libellé se réduit à un mot par ligne. Contourné par `.mesures-fiche` sur
   trois pages ; proposition générale : `min-width:120px` sur `.mesures .libelle`.

8. **`construire.mjs`, ligne 763** — la fonction `barre(courante)` qui construit la
   `.barre-maquettes` n'est **jamais appelée** (aucun appel dans le fichier, et
   `grep -c "barre-maquettes" sortie/33-fabricants.html` rend 0). Code mort, à retirer.

9. **`commun/composants.css`, `.mega`** — les trois panneaux prennent toute la largeur
   (1360 px), même « Ressources » qui n'a que quatre liens courts pour 164 px de haut. Sur
   legora.com et harvey.ai, un panneau court se cale sous son déclencheur. Impossible depuis
   ma lane sans changer `.nav-item{position:static}`, dont dépend le calage `left/right` des
   deux autres. Proposition : ajouter `.nav-item.item-etroit{position:relative}` et
   `.item-etroit .mega{left:0; right:auto; width:520px}`, puis marquer « Ressources ».

10. **Le pied sur téléphone reste le plus grand bloc de la page : 1 482 px**, contre 5 315 à
    9 022 px pour la page entière. C'est le plancher à cibles ≥ 44 px avec vingt-deux liens en
    deux colonnes. Descendre plus bas veut dire enlever des liens ou replier les colonnes en
    accordéon (du JavaScript dans `mouvement.js`, que je possède, mais le choix de ce qui
    disparaît du pied ne m'appartient pas). Proposition : ne garder que Produit, Solutions et
    Entreprise sous 640 px, Couverture et Ressources restant accessibles par le menu.

11. **Asymétrie assumée entre les deux mégas « Textes »** — le français envoie ses huit textes
    européens vers la maquette `05-marche.html`, l'anglais vers le site en ligne
    `https://www.cleolabs.co/en/jurisdictions/european-union` (qui répond 200, mesuré le
    03/09). C'est cohérent tant que `05-marche.html` n'a pas de jumeau anglais ; à trancher
    par la lane qui possède les pages marché.

12. **`.pied-coordonnees` sur téléphone** — porter les liens à 44 px de haut décale leur texte
    de 13 px par rapport au libellé de la colonne voisine, qui n'est pas un lien. Le gain
    (cible tactile) l'emporte sur le décalage, mais un `.pied-coordonnees > div{min-height:…}`
    dans `composants.css` remettrait les deux blocs d'aplomb.

---

VERIFICATION: node construire.mjs -> 0 echec (47 pages, tous les controles passent) ; node commun/capture2.mjs 30-securite 31-journal 32-plan-action 33-fabricants 34-importateurs 35-marketplaces 36-solutions -> OK sur les sept pages, aucune alerte restante ; menu mobile : ouvre/ferme/liens : OK (rapports/lane-E/cadre.mjs = 47 controles OK 0 echec sur 33-fabricants, 36-solutions et 01-accueil ; rapports/lane-E/cadre-en.mjs = 12 OK 0 echec ; panneau mesure 390x783, Echap ferme, un clic sur un lien ferme et navigue)
