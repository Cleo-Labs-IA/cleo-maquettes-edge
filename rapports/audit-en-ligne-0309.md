# Audit en ligne du 03/09/2026, après la passe UX/UI

Cible : **https://sortie-liart.vercel.app**, mesurée en ligne le 03/09/2026 entre 12 h 23 et
13 h 05, après le déploiement de 12 h 20 (`last-modified: Thu, 03 Sep 2026 10:22:41 GMT`,
`x-vercel-cache: HIT`).

Méthode : 32 URL chargées deux fois chacune, en desktop 1440 × 900 et en téléphone
390 × 844 (`isMobile`, `deviceScaleFactor` 2), Playwright + sharp. Aucun chiffre de ce
rapport n'est lu à l'œil : tout vient de `getComputedStyle` / `getBoundingClientRect`, du
code HTTP ou des en-têtes. Les captures ont ensuite été **regardées** tranche par tranche.

Scripts et données brutes, tous rejouables :

| fichier (tous dans `captures/en-ligne/`) | contenu |
|---|---|
| `audit.mjs` | la passe de masse : 32 URL × 2 tailles, + le cadre (menu, mégas, 404, formulaire) |
| `sonde.mjs`, `sonde2.mjs`, `sonde3.mjs` | clavier, contrastes, géométrie, heros, notes servies |
| `sonde-veille.mjs`, `sonde-vignettes-blog.mjs`, `sonde-rendu-images.mjs` | les trois soupçons visuels vérifiés |
| `sonde-petits-textes.mjs`, `sonde-contraste-boutons.mjs` | le détail des deux défauts transverses |
| `mesures.json` | 32 pages × 2 tailles, toutes les mesures |
| `cadre.json` | menu téléphone, méga-menus, 404, formulaire |
| `sonde.json`, `sonde2.json`, `sonde3.json` | les sondes ciblées |
| `*-d*.png`, `*-m*.png` | **262 tranches**, desktop 960 px et téléphone 390 px |
| `mega-*.png`, `fr-menu-*.png`, `404-*.png`, `platform-veille.png` | 14 captures ciblées |

Le dépôt n'a pas été modifié : seuls `rapports/audit-en-ligne-0309.md` et
`captures/en-ligne/` ont été écrits.

---

## Bilan chiffré AVANT / APRÈS

AVANT = les mesures de l'audit du matin sur la même URL, telles que fournies.
APRÈS = mesuré aujourd'hui après 12 h 20.

### Le socle, sur les pages citées le matin

| mesure | page | AVANT | APRÈS | verdict |
|---|---|---|---|---|
| textes < 14 px sur téléphone | `/fr` | 68 | **0** | corrigé |
| cibles tactiles < 40 px | `/fr` | 50 | **0** | corrigé |
| liens `href="#"` | `/fr` | 38 | **0** | corrigé |
| liens `href="#"`, les 32 pages | toutes | — | **0** | — |
| poids HTML | `/fr` | 1,6 Mo | **228 ko** | ÷ 7 |
| images sans attribut `alt` | `/fr` | 5 | **0** | corrigé |
| `<main>` | `/fr` | absent | **présent, 32 pages sur 32** | corrigé |
| favicon | `/fr` | absent | **présent, 32 sur 32** (SVG en `data:`, carré bleu `#0008CF`) | corrigé |
| menu sur téléphone | `/fr` | inexistant, les liens de nav disparaissaient | **panneau au clic, 28 liens, Échap ferme** | corrigé |
| pied sur téléphone | `/fr` | 1 500 px | **1 464 px**, 26 liens | assumé (décision Naomie) |
| `h1` | `/fr/platform` | aucun | **1, à 51,84 px** | corrigé |
| `h1` à 31,68 px | 7 pages | 7 pages | **0** — l'échelle tient en 3 crans : 68 / 51,84 / 40 px | corrigé |
| poids HTML | `/fr/blog` | 3,4 Mo | **187 ko** | ÷ 18 |
| images sans `alt` | `/fr/blog` | 18 | **0** | corrigé |
| textes < 14 px sur téléphone | `/fr/legal-data` | 215 | **0** | corrigé |
| cibles < 40 px sur téléphone | `/fr/legal-data` | 49 | **0** | corrigé |
| meta description absente | `manufacturers`, `solutions`, `security` | 3 pages | **0** — les 32 pages en ont une | corrigé |
| longueur du `<title>` | article PPWR | 250 caractères | **68 caractères** | corrigé |
| page 404 | `/fr/page-inexistante` | page Vercel par défaut | **404 du site**, nav + pied + `<main>`, code HTTP 404 | corrigé |
| notes internes servies | 9 pages sondées | « Fiche à confirmer avec Decathlon », « Feature 1 sur 3 », « Le même écran, une fois le formulaire envoyé » | **0 occurrence sur les 9 pages** ; **0 commentaire HTML servi** sur `/fr` | corrigé |
| logo NVIDIA | `/fr` | présent | **présent** (`alt="NVIDIA"`) | conservé, c'est un client |

### Ce que la passe n'a pas touché, et qui se mesure

| mesure | AVANT | APRÈS | commentaire |
|---|---|---|---|
| textes < 14 px **sur desktop** | non mesuré le matin | **23 à 242 selon la page** | déplacé, pas supprimé : voir § « Ce qui reste », point 1 |
| bordure de `.btn-contour`, régime clair | non mesuré | **1,41:1** (seuil WCAG 1.4.11 : 3:1) | échec |
| bordure de `.btn-contour`, régime sombre | non mesuré | **2,44:1** | échec |
| méga-menus au clavier | non mesuré | **0 panneau ouvert** sur Entrée et sur Espace | 25 liens inatteignables au clavier en desktop |
| `aria-expanded` sur les déclencheurs de méga-menu | non mesuré | **absent** (`null` sur les 4) | |
| `<link rel=canonical>` | non mesuré | **10 pages sur 32** | |
| meta description > 160 caractères | non mesuré | **6 pages**, dont 458 caractères sur l'article PPWR | |
| `<title>` > 60 caractères | non mesuré | **9 pages**, la plus longue à 75 | |

### Ce qui est parfaitement propre sur les 32 pages

Un seul `h1` par page · 0 `href="#"` · 0 `input disabled` · 0 image sans `alt` · 0 image
cassée · 0 débordement horizontal (desktop **et** téléphone) · `<main>` présent ·
`.lien-evitement` présent · favicon présent · une meta description sur chacune ·
paragraphe le plus large entre 480 et 720 px (jamais au-delà) · pied à 517 px en desktop
partout · `x-robots-tag: noindex, nofollow, noarchive, nosnippet` sur les 32 réponses ·
**une seule erreur console sur les 32 pages**, et c'est le 404 qui signale son propre 404.

---

## Tableau des 31 pages (+ l'URL inexistante)

« <14 px desktop » n'a été relevé que sur les 10 pages sondées ; « — » veut dire non mesuré,
pas zéro. Les textes de 11-12 px **à l'intérieur** des maquettes d'application (`.ecran-app`)
sont exclus de toutes les colonnes, comme convenu.

| page | code | h1 | <14 px tél. | <14 px desktop | cibles <40 tél. | `href="#"` | img sans alt | débordement | pied | HTML |
|---|---|---|---|---|---|---|---|---|---|---|
| `/fr` | 200 | 68 px | 0 | 62 | 0 | 0 | 0 | non | 517 px | 228 ko |
| `/en` | 200 | 68 px | 0 | — | 0 | 0 | 0 | non | 517 px | 227 ko |
| `/fr/platform` | 200 | 51,84 px | 0 | 25 | 0 | 0 | 0 | non | 517 px | 203 ko |
| `/fr/platform/research` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 190 ko |
| `/fr/platform/regulations` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 190 ko |
| `/fr/company` | 200 | 51,84 px | 0 | 32 | 0 | 0 | 0 | non | 517 px | 192 ko |
| `/fr/customers` | 200 | 51,84 px | 0 | 26 | 0 | 0 | 0 | non | 517 px | 182 ko |
| `/fr/blog` | 200 | 40 px | 0 | 62 | 0 | 0 | 0 | non | 517 px | 187 ko |
| `/fr/blog/eu-ppwr-packaging-conformity-2026` | 200 | 40 px | 0 | — | 0 | 0 | 0 | non | 517 px | 130 ko |
| `/fr/research` | 200 | 40 px | 0 | — | 0 | 0 | 0 | non | 517 px | 132 ko |
| `/fr/skills` | 200 | 40 px | 0 | 44 | 0 | 0 | 0 | non | 517 px | 139 ko |
| `/fr/legal-data` | 200 | 51,84 px | 0 | **242** | 0 | 0 | 0 | non | 517 px | 165 ko |
| `/fr/meet` | 200 | 51,84 px | 0 | 23 | 0 | 0 | 0 | non | 517 px | 119 ko |
| `/fr/jurisdictions/european-union/regulations/ppwr` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 135 ko |
| `/fr/jurisdictions/european-union` | 200 | 51,84 px | 0 | 30 | 0 | 0 | 0 | non | 517 px | 134 ko |
| `/fr/industries` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 135 ko |
| `/fr/for/manufacturers` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 125 ko |
| `/fr/for/importers-distributors` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 125 ko |
| `/fr/for/marketplaces` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 125 ko |
| `/fr/solutions/product-compliance` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 123 ko |
| `/fr/security` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 129 ko |
| `/fr/changelog` | 200 | 40 px | 0 | 46 | 0 | 0 | 0 | non | 517 px | 123 ko |
| `/fr/maria-action-plan` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 121 ko |
| `/fr/careers` | 200 | 40 px | 0 | — | 0 | 0 | 0 | non | 517 px | 122 ko |
| `/fr/terms` | 200 | 40 px | 0 | — | 0 | 0 | 0 | non | 517 px | 120 ko |
| `/fr/resources` | 200 | 40 px | 0 | — | 0 | 0 | 0 | non | 517 px | 124 ko |
| `/fr/resources/glossary` | 200 | 40 px | 0 | 26 | 0 | 0 | 0 | non | 517 px | 123 ko |
| `/en/blog` | 200 | 40 px | 0 | — | 0 | 0 | 0 | non | 517 px | 130 ko |
| `/en/research` | 200 | 40 px | 0 | — | 0 | 0 | 0 | non | 517 px | 132 ko |
| `/en/skills` | 200 | 40 px | 0 | — | 0 | 0 | 0 | non | 517 px | 139 ko |
| `/en/legal-data` | 200 | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 166 ko |
| `/fr/page-inexistante` | **404** | 51,84 px | 0 | — | 0 | 0 | 0 | non | 517 px | 117 ko |

Échelle des `h1` : 68 px graisse 700 (2 pages : `/fr`, `/en`), 51,84 px graisse 500
(18 pages), 40 px graisse 500 (12 pages). Trois crans, aucune exception. Pied à 517 px en
desktop et 1 464-1 474 px sur téléphone, 26 liens, identique sur les 32 pages.

---

## Le cadre : menu téléphone, méga-menus, évitement, favicon, 404, en-têtes

### Le menu sur téléphone, testé au clic (`/fr` et `/en`)

C'était le défaut principal du matin. Il est réglé, et je l'ai mesuré au clic, pas déduit
du CSS.

| contrôle | `/fr` | `/en` |
|---|---|---|
| bouton `.nav-burger` | 44 × 44 px, `aria-label="Menu"` | idem |
| `aria-expanded` avant / après clic | `false` → **`true`** | `false` → **`true`** |
| `#menu-mobile` avant clic | `display:none`, 0 × 0 | idem |
| boîte du panneau ouvert | **390 × 783 px** | **390 × 783 px** |
| contenu du panneau (`scrollHeight`) | **1 661 px** | **1 661 px** |
| le contenu déborde-t-il de la boîte ? | oui — et `overflow-y: auto`, donc il défile | idem |
| liens visibles dans le panneau | **28**, tous à 48 px de haut | **28**, tous à 48 px |
| défilement de la page bloqué ? | oui : `html.menu-ouvert{overflow:hidden}`, `scrollY` 0 → 0 après 900 px de molette | idem |
| débordement horizontal panneau ouvert | non | non |
| Échap | `aria-expanded=false`, `display:none`, panneau invisible | idem |
| erreurs JS | 0 | 0 |

Captures : `captures/en-ligne/fr-menu-ouvert.png`, `fr-menu-ferme.png`,
`en-menu-ouvert.png`, `fr-menu-bas.png`.

Avant l'ouverture, seuls **« EN » et « Voir une démo »** sont visibles dans la barre : la
navigation vit entièrement derrière le bouton. C'est le bon parti sur 390 px.

### Les méga-menus en desktop, au survol et au clavier

Quatre `.nav-declencheur` dans la barre, **trois** panneaux : « Entreprise » est un lien
direct, sans panneau (0 panneau ouvert au survol). Les trois autres, mesurés au survol :

| panneau | boîte | déborde à droite / en bas | liens | `href="#"` | plus petit texte | capture |
|---|---|---|---|---|---|---|
| Produit | 1360 × 253 à `x=40, y=59` | non / non | 4 | 0 | **12 px** | `mega-1-produit.png` |
| Textes | 1360 × 304 | non / non | 17 | 0 | **11 px** | `mega-2-textes.png` |
| Ressources | 1360 × 165 | non / non | 4 | 0 | 14 px | `mega-3-ressources.png` |

Deux constats mesurés :

1. **Au clavier, aucun des trois ne s'ouvre.** Les quatre déclencheurs prennent bien le
   focus (Tab n° 3 à 6, après `.lien-evitement` et le logo), mais `Entrée` puis `Espace`
   laissent le compte de panneaux ouverts à **0**. Les 25 liens des trois panneaux sont donc
   inatteignables au clavier en desktop. Ils le restent sur téléphone, où le panneau
   `#menu-mobile` les expose tous.
2. **Aucun déclencheur ne porte `aria-expanded`** (`null` sur les quatre), alors que le
   bouton du menu téléphone, lui, le porte et le bascule correctement.

### Le lien d'évitement, le favicon, les en-têtes

- `.lien-evitement` : présent sur **32 pages sur 32**, premier élément à recevoir le focus.
- Favicon : présent sur **32 sur 32**, le même SVG en `data:` (carré arrondi `#0008CF`, la
  marque cleo en blanc). Il n'y a donc plus d'onglet sans icône.
- `x-robots-tag: noindex, nofollow, noarchive, nosnippet` sur les **32** réponses, et
  `<meta name="robots" content="noindex,nofollow">` dans les 32 pages. La maquette ne peut
  pas être indexée par accident.
- `<link rel=canonical>` : **10 pages sur 32** seulement, toutes pointant vers
  `www.cleolabs.co/…`. Les 22 autres n'en ont pas.

### La 404

`GET /fr/page-inexistante` → **404** (pas 200, pas 301). La page servie est celle du site :
`<title>` « Page introuvable | Cleo Labs », `h1` « Cette page n'existe pas. » à 51,84 px,
la barre de navigation complète, `<main>`, le pied à 517 px, 86 liens, et **aucune trace de
la page Vercel** (`NOT_FOUND` absent du corps). Captures `404-desktop.png`, `404-mobile.png`.

### Le formulaire de `/fr/meet`

Je l'ai soupçonné cassé, puis mesuré : **il est correct.** Le patron est celui de
l'attribut `form` de HTML5, pas une erreur de balisage.

- `<form id="f-acces" method="get" action="https://meetings.hubspot.com/anaelle-guez/rendez-vous" hidden></form>`
  vide, puis 5 `<input … form="f-acces">` et
  `<button class="btn btn-marque" type="submit" form="f-acces">Demander l'accès</button>`.
- Les 5 champs ont **chacun un `<label for=…>` associé** : Prénom, Nom, Email professionnel,
  Site de la marque, Familles de produits. Aucun ne repose sur le seul `placeholder`.
- Le bouton **est bien un `submit` du formulaire**. Testé en vrai : Entrée dans le champ
  email envoie et la page arrive sur
  `meetings.hubspot.com/anaelle-guez/rendez-vous?firstname=Audit&…&email=audit%40exemple.fr&…`.
  Le pré-remplissage HubSpot fonctionne.
- Champs à 45 px de haut, un seul `required` (l'email), et une ligne
  « Vos données servent à ouvrir l'accès, à rien d'autre. » sous le bouton.

Rien à corriger ici.

---

## Ce qui reste « pas pro », page par page

Classé par ce qu'un prospect voit ou subit, pas par difficulté de correction.

### 1. Tout le site — le 11-12 px a été corrigé sur téléphone seulement

`captures/en-ligne/fr-legal-data-d1.png`, `fr-blog-d1.png`

Sur téléphone, plus rien sous 14 px : 0 sur les 32 pages. Sur **desktop**, il en reste
23 à 242 par page. La cause est explicite dans le CSS : la passe a remonté toute l'échelle
de légendes à 14 px **à l'intérieur** de `@media (max-width:640px)`
(`commun/composants.css:1330-1350`, dont le commentaire cite d'ailleurs « 68 textes sous
14 px sur l'accueil et 215 sur Legal Data »), et a laissé les déclarations desktop intactes.

Ce que ça donne, mesuré, hors maquettes d'application :

| page | total < 14 px | dont méga-menus | **dans le corps** | les plus nombreux |
|---|---|---|---|---|
| `/fr/legal-data` | 242 | 9 | **233** | `marqueur m-couvert` ×147, `t-caption` ×39, `m-attente` ×15, `m-manquant` ×14 — **tous à 12 px** |
| `/fr` | 62 | 9 | 53 | `SPAN` ×10 et `pl-n` ×6 à 13 px (la bande sombre), `t-caption` ×5, `surtitre` ×4 |
| `/fr/blog` | 62 | 9 | 53 | `etiquette` ×16 et `t-caption date` ×16 à 12 px |
| `/fr/changelog` | 46 | 9 | 37 | `pilule` ×10, `etiquette` ×10 à 12 px |
| `/fr/skills` | 44 | 9 | 35 | `t-label` ×9, `t-caption` ×8, `skill-nom` ×6 |
| `/fr/company` | 32 | 9 | 23 | `t-caption` ×5 |
| `/fr/meet` | 23 | 9 | 14 | le socle du cadre |

Deux choses distinctes là-dedans, et elles n'appellent pas le même arbitrage :

- **Les surtitres et étiquettes à 12 px** (`surtitre`, `t-label`, `etiquette`) sont une
  convention de DA défendable en desktop. À trancher, pas à corriger d'office.
- **Les données à 12 px**, elles, sont un vrai coût de lecture : les **178 pastilles de
  pourcentage de l'atlas** de `/fr/legal-data` (`m-couvert`, `m-attente`, `m-manquant`,
  `m-bloque`) et les **16 dates du blog** portent l'information de la page. Correction
  précise : `commun/composants.css:142`, `.badge,.marqueur{font-size:0.75rem}` → `0.8125rem`
  (13 px) et `commun/composants.css` `.t-caption.date` → `0.8125rem`.
- **Le sélecteur de langue de la barre est à 11 px** en desktop sur toutes les pages
  (`commun/composants.css:964`, `.nav-langue span,.nav-langue a{font-size:0.6875rem}`).
  C'est le plus petit texte du site hors maquettes. La règle téléphone le remonte déjà à
  14 px (ligne 1340) ; il manque le pendant desktop. Correction : `0.75rem` ligne 964.

### 2. Tout le site — le bouton secondaire n'a pas de contour visible

`captures/en-ligne/fr-legal-data-d1.png` (« Explorer la couverture », le second bouton du
hero, se lit à peine sur le noir), `404-desktop.png`

Mesuré sur 6 pages, c'est un défaut de jeton, pas de page :

| régime | déclaration | bordure effective | contraste | seuil |
|---|---|---|---|---|
| clair | `commun/base.css:39` `--c-border-hover: rgba(0,0,0,0.15)`, utilisé par `composants.css:113` | `rgb(217,217,217)` sur blanc | **1,41:1** | 3:1 (WCAG 1.4.11) |
| sombre | `commun/composants.css:120` `border-color:rgba(255,255,255,0.28)` | `rgb(82,81,81)` sur `rgb(15,14,13)` | **2,44:1** | 3:1 |

Le texte des boutons, lui, passe largement (19,3:1 et 19,8:1) : c'est bien le **contour**
qui manque. Concerne « Explorer la couverture », « Réserver un créneau », « Lire l'annonce »,
« Voir une démo » en version contour, et le bouton secondaire de la 404.

Corrections calculées :
- `commun/base.css:39` → `--c-border-hover: rgba(0,0,0,0.45)` → **3,36:1**
  (0,42 donne 3,03:1, trop juste).
- `commun/composants.css:120` → `rgba(255,255,255,0.36)` → **3,30:1**.

### 3. `/fr` — le témoignage Decathlon est centré sur 780 px

`captures/en-ligne/fr-d1.png` (bas de tranche), `fr-m2.png`

Le `<blockquote class="citation">` fait **780 px de large, 20 px, `text-align: center`**, sur
huit lignes (`commun/composants.css:1305`, `.temoin-compact{max-width:780px; margin:0 auto;
text-align:center}`). C'est le seul bloc de la page qui dépasse la mesure de lecture du reste
du site (les paragraphes plafonnent à 600 px sur `/fr` et à 720 px ailleurs), et le seul
texte long centré. Huit lignes centrées, l'œil perd le début de ligne à chaque retour.

La correction est déjà écrite — mais réservée au téléphone. `commun/lanes/accueil.css:94-101`
pose `.temoin-compact .citation{text-align:left}` dans un `@media (max-width:640px)`, avec ce
commentaire : « La citation Decathlon fait 17 lignes à 390 px. Centrée, elle rend deux bords
en drapeau sur toute sa hauteur. » Le raisonnement vaut aussi à 780 px sur huit lignes.

Correction : sortir cette règle du `@media` et lui adjoindre `max-width:620px; margin-inline:auto`.
Le portrait, le logo, l'attribution et le lien restent centrés.

### 4. `/fr` — la bande de logos clients n'est pas calée optiquement

`captures/en-ligne/fr-d1.png`, `fr-m2.png`

Largeurs rendues mesurées : Decathlon **176 px**, Balzac Paris **200 px**, Mercedes-Benz
**60 px**, L'Occitane **166 px**, NVIDIA **62 px**. Hauteurs : 35, 30, 40, 32, 48 px.
Les deux logos carrés font trois fois moins large que les deux logotypes : la rangée penche.
Sur téléphone, la grille à deux colonnes laisse **NVIDIA seul sur la troisième rangée**
(règle `.bande-logos .cellule:last-child:nth-child(odd){grid-column:1 / -1}`,
`commun/composants.css:1333`) — un logo isolé et centré sous quatre autres.

Correction : normaliser par la surface et non par la hauteur, dans la règle `.bande-logos img`
de `commun/composants.css` — `max-height:32px` pour les logotypes larges, `max-height:44px`
pour Mercedes et NVIDIA, via une classe `.logo-carre`. Et sur téléphone, retirer la règle
`grid-column:1 / -1` au profit d'une grille à 3 colonnes en dernière rangée, ou passer la
bande à 5 colonnes défilantes.

### 5. `/fr` — les trois libellés d'étape de la bande sombre ne s'alignent pas

`captures/en-ligne/fr-d3.png`, bande « NOTRE MÉTHODE »

Les trois en-têtes de colonne sont censés lire comme une rangée. Positions Y mesurées :

| libellé | y |
|---|---|
| `03 La règle encodée` | **6 437** |
| `02 L'encodage` | **6 454** |
| `01 Ce qui est publié` | **6 477** |

**40 px d'écart** entre le premier et le troisième, en escalier. C'est visible à l'image :
les trois titres montent de gauche à droite. La cause est que chaque colonne est alignée sur
son propre contenu et non sur une ligne de base commune.

Correction : sur le conteneur de la bande, `align-items: start` et sortir les trois libellés
dans une rangée de grille propre (`grid-template-rows: auto 1fr` avec les libellés en
rangée 1), plutôt que de les laisser flotter en tête de chaque colonne.

### 6. `/fr` — les deux rangées « feature » à l'endroit et celle à l'envers n'ont pas la même grille

`captures/en-ligne/fr-d2.png`

`commun/composants.css:873` pose `.agent{grid-template-columns:minmax(0,1fr)
minmax(0,1.15fr)}` — soit **461,4 px et 530,6 px** dans le conteneur de 1040 px, mesuré.
`commun/composants.css:880-881` inverse ensuite la rangée du milieu par `order:2` / `order:1`
sur `.agent-inverse`, **sans inverser les colonnes de la grille** : l'image tombe donc dans
la colonne étroite. Le commentaire du dessus dit pourquoi l'`order` a été choisi (garder
l'ordre du document pour le clavier et la voix) : le parti est bon, il manque la moitié
complémentaire. Résultat mesuré :

| rangée | colonne texte | colonne image | hauteur |
|---|---|---|---|
| Regulatory Change | 461 px (gauche) | **531 px** (droite) | 658 px |
| Compliance Data (`agent-inverse`) | **531 px** (droite) | **461 px** (gauche) | 573 px |
| Research | 461 px (gauche) | **531 px** (droite) | 658 px |

L'image du milieu est donc **70 px plus étroite** que les deux autres, et sa rangée 85 px
moins haute. À l'image, la photo des semelles est visiblement plus petite que celle des
classeurs et celle des câbles.

Correction, une ligne, à ajouter après `commun/composants.css:881` :
`.agent-inverse{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)}`. L'ordre du document
est préservé, l'image retrouve sa colonne large.

### 7. `/fr/platform` — le composant de veille garde une boîte fixe pendant que son contenu bouge

`captures/en-ligne/platform-veille.png`

Le bloc `.cv` mesure **1040 × 572 px** et sa scène interne `.cv__scene` **984 × 452 px**.
La hauteur est réservée en dur : `depot-src/ref/veilleCss.ts:46` pose
`.cv__list{display:flex; flex-direction:column; gap:7px; **min-height:340px**}`. Le composant
est injecté par `<!--VEILLE-->` dans `pages/03-offre.html:40`. Mesuré à deux instants de
l'animation :

- au repos (2 lignes détectées) : **67 px** de vide sous le dernier texte ;
- dans l'état que ma capture a figé (3 lignes + fiche produit haute) : le contenu s'arrête à
  environ **190 px du bas**, soit le tiers inférieur du panneau vide.

Ce n'est pas un bug d'affichage, c'est une boîte dimensionnée sur un état et pas sur l'autre :
la réserve de 340 px vaut pour la liste la plus longue, mais la fiche produit de droite, elle,
change de hauteur d'un état à l'autre sans que le conteneur suive.

Correction : soit `.cv__scene{align-items:stretch}` avec une `min-height` posée sur la scène
et non sur la seule liste, soit laisser le conteneur suivre son contenu avec une transition
de hauteur — dans les deux cas dans `depot-src/ref/veilleCss.ts`.

Deux détails de contenu dans le même composant : il annonce « **relevé du 4 août 2026** »
alors qu'on est le 3 septembre, et la ligne « hors périmètre » est volontairement éteinte à
`rgba(0,0,0,0.62)` sur blanc — c'est un état d'interface légitime, mais il faudra vérifier
qu'on assume ce contraste avant mise en ligne.

### 8. `/fr/platform` — deux traitements pour le même bouton, sur la même page

`captures/en-ligne/fr-platform-d2.png`

« Réserver un créneau » apparaît deux fois : en **pilule bleue pleine** dans la carte du
milieu, et en **pilule blanche à contour** dans la carte de bas de page, à côté d'un
« Voir une démo » bleu plein. Même libellé, deux niveaux hiérarchiques opposés. Le visiteur
ne peut pas deviner lequel est l'action principale.

Correction : trancher un seul rôle. Dans `pages/03-offre.html`, passer le second
« Réserver un créneau » en `btn btn-contour` **et** le premier aussi, en laissant
« Voir une démo » seul en `btn-marque` ; ou l'inverse. Le même arbitrage vaut pour
`pages/07-chat.html` et `pages/08-reglementation.html`, qui reprennent la même carte.

### 9. `/fr/platform/research` — les deux écrans de la paire sont déséquilibrés

`captures/en-ligne/fr-platform-research-d1.png`

Les deux `.ecran-app` partagent exactement le même fond (`rgb(255,255,255)`), la même ombre,
le même rayon de 14 px et la même largeur (509 px) — ce point est propre. En revanche ils
sont alignés en haut (`y=630` tous les deux) avec des hauteurs de **283 px** et **447 px** :
**164 px d'écart**, soit un trou de la taille d'un tiers d'écran sous celui de gauche.

Correction : `align-items:center` sur la grille des deux écrans dans
`pages/07-chat.html`, ou allonger l'écran de gauche d'un tour de conversation pour que les
deux se répondent.

### 10. `/fr/customers` — un quart de la bande sombre est vide

`captures/en-ligne/fr-customers-d1.png`

La section du témoignage mesure **1440 × 653 px**, son contenu s'arrête à `x=1280` et la
colonne de texte va de `x=332` à `x=952`. Il reste donc **328 px des 1 280 px de largeur
utile — 26 % — vides à droite du témoignage**, avec le portrait seul à gauche. À l'image, la
page a l'air d'avoir perdu une colonne.

Le paragraphe y est par ailleurs à **15 px** sur 620 px de large et trois paragraphes de
suite : c'est le même témoignage Decathlon qui, sur `/fr`, est rendu à 20 px et centré. Deux
traitements très différents du même texte.

Correction : dans `commun/lanes/segments.css`, passer la bande à une grille
`grid-template-columns:200px 1fr` avec le conteneur à 900 px centré, et remonter le
paragraphe à 16 px — ou déplacer la fiche latérale (familles, taille, marchés) dans la
colonne droite pour occuper les 328 px.

### 11. `/fr/company` — la grille d'équipe n'est pas une grille

`captures/en-ligne/fr-company-d1.png`

Trois défauts qui se cumulent sur le même écran :

- **Les légendes ne s'alignent dans aucune des deux rangées.** Position Y des noms, mesurée :
  Anaëlle Guez **1378**, Naomie Halioua **1378**, Alexandre Bloch **1426** — il tombe **48 px
  plus bas**, parce que les deux premières ont deux pastilles de compétence sous leur nom et
  lui aucune. Rangée 2 : Thezi Mabuza **1869**, Darcial Mondjo **1891** — **22 px d'écart**,
  cette fois parce que l'intitulé de Thezi Mabuza passe sur deux lignes. Les deux rangées
  lisent en marches d'escalier, dans deux sens opposés.
- **Les cinq portraits ne viennent pas de la même série.** Trois photos de bureau en lumière
  chaude, un portrait studio sur fond sombre, un portrait sur fond de plantes vertes : fonds,
  cadrages et échelles de visage tous différents. Sur une page « l'équipe derrière Cleo »,
  c'est le genre d'écart qui fait penser à de la banque d'images.
- **Les intitulés mélangent le français et l'anglais** sur une page française : « CEO,
  cofondatrice », « CDO, cofondatrice », « CTO », puis « Global Head of Product & Sanitary
  Compliance » et « **Stalwart in Consumer Protection & Product Safety** » — ce dernier
  n'étant d'ailleurs pas un intitulé de poste.

La sixième case de la grille est une carte claire (« Et l'équipe qui encode, relit et met à
jour les règles chaque semaine ») dont la moitié basse est vide, avec un globe filaire très
pâle : elle fait un trou dans une grille de photos.

Corrections : dans `pages/02-entreprise.html`, donner à chaque carte le même gabarit de
légende (nom / rôle / rangée de pastilles, la rangée pouvant être vide mais réservée) ;
traduire les deux intitulés anglais ; réécrire « Stalwart in… » en un vrai titre. Pour les
portraits, c'est une commande photo, pas une correction CSS.

### 12. `/fr/blog` — deux formats de date, des extraits qui commencent en minuscule, des rangées à un article

`captures/en-ligne/fr-blog-d1.png`, `fr-blog-d2.png`

- **Deux formats de date coexistent dans la même liste** : « 01.09 », « 31.08 », « 30.08 »
  pour août-septembre, puis « 31 mai 2026 », « 28 avril 2026 », « 14 mars 2026 » pour les
  mois plus anciens, et « 29 avril 2026 » dans les articles mis en avant.
- **Les extraits du fil commencent en minuscule et en milieu de phrase** : « un produit
  chimique qui n'est pas censé subsister… », « les deux décès examinés par des coroners… »,
  « le code producteur européen obligatoire a permis… », « 5 d'entre eux portent exactement… ».
  L'extrait est manifestement coupé au début du deuxième paragraphe. Ça se lit comme du texte
  cassé.
- **Trois rangées de mois n'ont pas assez d'articles pour remplir la grille à 3 colonnes** :
  « Septembre 2026 · 1 » (un article, deux colonnes vides), « Avril 2026 · 1 » (idem),
  « Mai 2026 · 2 » (une colonne vide). Le trou est très visible en desktop.
- **Deux mois entiers manquent au milieu d'un fil chronologique.** Le fil rend cinq rangées
  et seulement cinq : Septembre (1), Août (6), **puis directement Mai** (2), Avril (1),
  Mars (3) — soit **13 articles affichés**. Ni juillet ni juin n'existent. Or le bloc du bas
  annonce « **114** articles listés » et « **61** jours consécutifs portant un article,
  **du 3 juillet au 1er septembre 2026** », et « le premier article daté du blog, publié le
  11 février 2026 » — un mois qui n'a pas de rangée non plus. Le fil dément le compteur qui
  est trois centimètres plus bas.
- **Anaëlle Guez est écrite « Anaelle Guez »** dans ce même bloc (seule orthographe présente
  sur la page), alors que `/fr/company` écrit « Anaëlle Guez ».

Corrections : un seul format de date dans le générateur (`construire.mjs`, le rendu du fil) ;
prendre l'extrait au **premier** paragraphe et le capitaliser ; pour les mois courts, passer
la rangée en `grid-template-columns:repeat(auto-fit,minmax(300px,1fr))` avec
`justify-content:start` — un article seul occupera alors une largeur de carte, pas un tiers
de page ; corriger le tréma. Et surtout : soit alimenter juin, juillet et février, soit
retirer le bloc de comptage, parce qu'en l'état il désigne lui-même ce qui manque.

*Note d'honnêteté sur mes propres captures* : plusieurs vignettes du blog apparaissent en
rectangles noirs dans `fr-blog-d1.png` et `fr-blog-d2.png`. **Ce n'est pas un défaut du
site.** Vérifié en mesurant les images dans la page : les 16 vignettes sont chargées
(`complete`, `naturalWidth` 900), à `opacity:1`, et leur rendu réel a une luminance de 90 à
111 sur 255 — les captures d'élément (`rendu-masse-tshirt.png` par exemple) montrent bien la
photo. Le noir vient du fond `rgb(15,14,13)` de la carte, capturé avant que l'image en
`loading="lazy"` ne soit peinte dans la capture pleine page.

### 13. `/fr/legal-data` — deux compositions de hero coexistent sur le site

`captures/en-ligne/fr-legal-data-d1.png` contre `fr-d1.png` et `fr-platform-d1.png`

Alignement du `h1` mesuré page par page : **centré** sur `/fr`, `/fr/platform`,
`/fr/platform/research`, `/fr/platform/regulations` ; **aligné à gauche** sur `/fr/legal-data`,
`/fr/company`, `/fr/customers`, `/fr/blog`, `/fr/meet`, `/fr/security`, `/fr/industries`.

C'est peut-être une règle voulue (la famille Produit centrée, le reste à gauche) mais elle
n'est écrite nulle part et, en navigant de `/fr/platform` à `/fr/legal-data`, on a
l'impression de changer de site. À trancher explicitement : soit la règle est documentée
dans la DA, soit on aligne tout à gauche.

### 14. `/fr/legal-data` — les libellés de données sont en anglais brut sur une page française

`captures/en-ligne/fr-legal-data-m2.png`

Le bloc « TYPES LES PLUS RÉGULÉS » liste : *Food Core, Industrial Chemicals, Consumer
Electronics, Chemicals Intermediates, Live Animals Raw, Jewelry Watches Eyewear, Agri
Commodities Raw*. Trois d'entre eux affichent **0 %** dans une liste intitulée « les plus
régulés ». « Live Animals Raw », « Agri Commodities Raw » et « Chemicals Intermediates » se
lisent comme des valeurs d'énumération sorties de base, pas comme des libellés écrits.

Correction : une table de traduction des sept libellés dans `pages/26-legal-data.html`
(et son jumeau `-en`), et sortir de la liste « les plus régulés » les entrées à 0 %, ou
renommer le bloc en « couverture par type de produit ».

### 15. Le site se contredit sur ses propres chiffres de couverture

Relevé sur les pages servies, ce même jour :

| page | ce qu'elle annonce |
|---|---|
| `/fr` | « 106 pays », « 25 000 réglementations », « 19 000 autorités réglementaires » |
| `/fr/platform` | « 106 pays », « 19 000 autorités », « 3 700 sources officielles », « 43 juridictions » |
| `/fr/company` | « 106 pays », « 25 000 » |
| `/fr/legal-data` | « **158 marchés** », « **14 225 réglementations mappées** », « **4 658 autorités de contrôle** », « 5 613 codes produit SH6 », « 10 582 réglementations produits de consommation » |

« Marchés » n'est pas « pays » et « mappées » n'est pas « indexées » — mais rien sur les
pages ne dit en quoi elles diffèrent. Un prospect qui lit l'accueil puis l'atlas voit
**106 contre 158**, **25 000 contre 14 225** et **19 000 contre 4 658**, sans définition.
C'est le point le plus dangereux du site : il touche la crédibilité, pas l'esthétique.

Ce n'est pas à moi de trancher lesquels sont justes. Ce qu'il faut avant mise en ligne :
un chiffre par notion, une source, et la même formulation partout, ou une note qui explique
l'écart là où il apparaît.

### 16. SEO servi : titres et descriptions hors gabarit

Aucune de ces pages n'est indexable aujourd'hui (`noindex` partout), mais ces chaînes
partiront telles quelles au portage.

- **9 titres au-dessus de 60 caractères**, coupés en résultat de recherche :
  `/fr` (75), `/fr/for/importers-distributors` (69), l'article PPWR (68),
  `/fr/resources/glossary` (65), le PPWR juridictionnel (63),
  `/fr/solutions/product-compliance` (63), `/fr/company` (62), `/en/skills` (62),
  `/fr/research` (61).
- **6 descriptions au-dessus de 160 caractères** : l'article PPWR à **458** (c'est un
  paragraphe entier), `/fr/company` 245, `/fr/resources/glossary` 208, `/fr/security` 183,
  `/fr/terms` 177, `/fr/jurisdictions/european-union` 170.
- **La casse des titres est incohérente** : la plupart sont en casse de phrase
  (« Veille réglementaire produit sur 106 pays »), six sont en casse de titre à l'anglaise —
  « Conformité **P**roduit **A**utomatisée pour les **M**arques **I**nternationales »,
  « **À P**ropos de Cleo Labs », « Glossaire de **C**onformité **R**églementaire | 20+
  **T**ermes **C**lés **E**xpliqués », « **R**essources & **G**uides… »,
  « **C**onditions **G**énérales d'**U**tilisation », « **R**éserver une **D**émo ».
  En français, c'est une faute de typographie.
- **`/fr/jurisdictions/european-union` est la seule page sans le suffixe « | Cleo Labs »** :
  son titre est « Conformité réglementaire UE », 27 caractères.

Corrections : dans `commun/seo.json`, ramener les 9 titres sous 60 caractères suffixe compris,
les 6 descriptions entre 120 et 160, passer les 6 titres en casse de phrase, et ajouter le
suffixe manquant.

### 17. Le méga-menu « Textes » promet 17 textes et rend 3 pages

`captures/en-ligne/mega-2-textes.png`

Destinations mesurées : PPWR → `/fr/jurisdictions/european-union/regulations/ppwr` ;
**REACH, RSGP, ESPR, EN 71, Allégations vertes, Batteries, EPI, AI Act → tous les huit vers
`/fr/jurisdictions/european-union`** ; **Proposition 65, PFAS, TSCA, ASTM F963, TB 117,
Loi 96, CPSIA, FTC Green Guides → tous les huit vers `/fr/legal-data`**.

Aucun lien mort au sens technique (0 `href="#"`), mais un visiteur qui clique trois entrées
différentes atterrit trois fois au même endroit. C'est un trou de contenu, pas un bug ; il
sera très visible en démo.

Dans le méga anglais, **huit de ces liens pointent vers `https://www.cleolabs.co/en/…`**,
c'est-à-dire hors de la maquette, vers la production. Une revue de la maquette en anglais
sort donc du périmètre au huitième clic.

### 18. Détail à confirmer — l'`alt` vide sur les trois images « la masse et l'unique »

`/fr` sert `classeurs.webp`, `semelles.webp` et `cables.webp` avec `alt=""`. Techniquement
c'est valide (image décorative adjacente à un texte équivalent), et c'est ce qui explique le
« 0 image sans alt ». Mais ces trois images **portent l'idée centrale de la marque** — la
masse grise et l'objet bleu. À l'oreille d'un lecteur d'écran, la page n'a plus d'images du
tout. À trancher : un `alt` court et descriptif, ou l'assumer comme décoratif.

### 19. Détail à confirmer — dans les maquettes d'application, le plancher est à 8 px, pas 11

L'exception convenue porte sur « 11-12 px à l'intérieur des maquettes d'application ». Mesuré
dans les `.ecran-app`, le plancher réel est plus bas :

| page | textes dans la maquette | tailles rencontrées |
|---|---|---|
| `/fr` | 27 | 12, 13, 15, 16 px — **dans la fourchette assumée** |
| `/fr/platform` (veille) | 14 | **8**, 9, 9,5, 10, 10,5, 11, 12, 13, 14 px |
| `/fr/platform/research` (chat) | 12 | 10 et 12 px |
| `/fr/platform/regulations` (arbre) | 27 | 10 et 12 px |

Tout vient du composant de veille, où les tailles sont écrites en dur, en pixels, dans
`depot-src/ref/veilleCss.ts` :

| ligne | règle | taille |
|---|---|---|
| 56 | `.cv-txt .cv-det u{…font-size:8px…}` — le libellé « détecté » | **8 px** |
| 65 | `.cv-txt .cv-ech` — « applicable dans 820 j » | 9 px |
| 86 | `.cv__fiche .cv-k` — « Le texte qui vient d'arriver » | 9 px |
| 43 | `.cv__flux .cv-lbl` — « Textes détectés » | 9,5 px |
| 93 | `.cv__fiche .cv-lien` — « ouvrir au Journal officiel ↗ » | 9,5 px |

Je le signale sans le trancher : c'est peut-être assumé aussi, mais ce n'est pas ce que dit
l'exception écrite, et 8 px reste 8 px même dans une capture d'écran de produit.

---

## Ce qui est bon et ne doit plus bouger

- **Le socle mesurable est propre sur les 32 pages**, sans exception : un seul `h1`,
  0 `href="#"`, 0 `input disabled`, 0 image sans `alt`, 0 image cassée, 0 débordement
  horizontal en desktop comme en téléphone, `<main>`, `.lien-evitement`, favicon et meta
  description partout, une seule erreur console sur tout le site. C'est rare.
- **Le menu sur téléphone**, le défaut n° 1 du matin : 390 × 783 px pour 1 661 px de contenu
  qui défile à l'intérieur, `aria-expanded` qui bascule, 28 liens à 48 px, le défilement de
  la page bloqué, Échap qui referme, 0 erreur JS. Ne plus y toucher.
- **L'échelle typographique des titres** : trois crans exactement, 68 / 51,84 / 40 px, aucune
  page hors échelle, plus rien à 31,68 px.
- **La mesure de lecture** : le paragraphe le plus large du site fait 720 px, le plus étroit
  480 px. Aucune page ne dépasse.
- **Le poids** : 116 à 228 ko de HTML par page, contre 1,6 Mo et 3,4 Mo ce matin.
- **La 404** : code 404, page du site, nav et pied complets, deux issues proposées.
- **Le formulaire de `/fr/meet`** : `<label for>` sur les cinq champs, `type="submit"` relié
  au formulaire par l'attribut `form`, envoi vérifié en vrai vers HubSpot avec
  pré-remplissage, et une phrase claire sur l'usage des données.
- **Le pied** : 517 px en desktop, 26 liens, identique et stable sur les 32 pages, mentions
  légales exactes (Cleo Corp SAS, Neuilly-sur-Seine, SIREN 984567883 — conforme au registre).
- **`/fr/legal-data` sur téléphone**, qui était la pire page du matin (215 textes sous 14 px,
  49 cibles trop petites) : une colonne, tout à 14 px et plus, pastilles à 14 px, rangées
  généreuses. C'est le meilleur avant/après de la passe.
- **`x-robots-tag` et `<meta robots>` en `noindex` sur les 32 réponses** : la maquette ne peut
  pas fuiter dans l'index.
- **Le méga-menu « Textes » lui-même**, dans sa composition : deux groupes, trois colonnes,
  une ligne d'appel en bas, aucun débordement, aucune poussée de la page à l'ouverture.
- **Aucune note interne ni commentaire HTML n'est servi** au visiteur ; les deux seules notes
  visibles (`/fr/careers`, `/fr/terms`) sont les « Maquette : … » assumées.
- **Zéro monospace**, la règle de la DA V5 tient : `depot-src/ref/veilleCss.ts:17` déclare
  pourtant `--cv-mono:var(--mono, ui-monospace, …)`, mais `--mono` est surchargé par le site
  et le rendu en ligne compte **0 élément en police à chasse fixe** sur `/fr/platform`, la
  page qui en aurait le plus. Le garde-fou fonctionne, il ne faut pas retirer la surcharge.
- **Le témoignage Decathlon dit ce qu'il dit** : les mentions légales du pied correspondent
  au registre (SAS, Neuilly-sur-Seine, SIREN 984567883) et le bloc « Le corpus, relevé sur la
  page servie » de `/fr/blog` est cohérent avec lui-même (81 + 25 + 8 = 114 articles). Quand
  le site compte, il compte juste ; le problème du point 15 est d'accorder les notions, pas
  les additions.

---

## Les quatre choses à faire en premier

Les trois premières coûtent de la crédibilité en rendez-vous ; la quatrième est une
non-conformité qui se corrige en deux lignes.

1. **Les chiffres de couverture qui se contredisent** (point 15) — 106 contre 158,
   25 000 contre 14 225, 19 000 contre 4 658, sans définition nulle part.
2. **Le fil du blog qui se dément lui-même** (point 12) — 13 articles affichés, 114 annoncés,
   juin et juillet absents alors que la page revendique « 61 jours consécutifs du 3 juillet
   au 1er septembre ».
3. **Les méga-menus inatteignables au clavier** (§ Le cadre) — 25 liens hors d'atteinte en
   desktop, aucun `aria-expanded` sur les quatre déclencheurs.
4. **Le contour du bouton secondaire à 1,41:1** (point 2) — `commun/base.css:39` →
   `rgba(0,0,0,0.45)` et `commun/composants.css:120` → `rgba(255,255,255,0.36)`. Effet
   immédiat sur tout le site.

---

VERIFICATION: 32 pages mesurées, 31 en 200, 404 servie par le site : oui, menu mobile ouvert : 390×783 px pour 1661 px de contenu, total textes<14 mobile hors maquettes d'application : 0, total cibles<40 mobile : 0, liens href="#" : 0
