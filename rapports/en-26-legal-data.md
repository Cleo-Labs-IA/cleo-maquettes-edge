# en-26-legal-data : le jumeau anglais de la page Legal Data

Fichier créé : `/Users/naomiehalioua/cleo-maquettes-edge/pages/26-legal-data-en.html`
Source lue en entier : `/Users/naomiehalioua/cleo-maquettes-edge/pages/26-legal-data.html` (527 lignes)

Aucun fichier existant n'a été ouvert en écriture. `sortie/` n'a pas été touché.
Ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs` n'ont été lancés.

## Méthode

Copie de la source, puis remplacements de chaînes EXACTES sur les seuls textes
visibles, chacun avec son nombre d'occurrences attendu (un écart = arrêt du
script). Les nombres ont ensuite été reformatés à l'usage anglais, uniquement
dans les nœuds de texte : le découpage isole les balises et les commentaires,
qui ne sont jamais traversés. Aucune découpe par index, aucune ligne ajoutée ou
retirée : 527 lignes des deux côtés, chaque ligne anglaise face à sa jumelle.

114 lignes diffèrent, toutes par leur texte seul.

## Comptage de balises

| | FR | EN |
|---|---|---|
| balises ouvrantes + fermantes (hors commentaires) | **1 198** | **1 198** |
| écart par nom de balise | — | aucun |
| éléments de squelette (`<…>` et `<!--…-->`) | 1 208 | 1 208 |
| squelette comparé position par position | **identique à 100 %** | |
| lignes | 527 | 527 |

Le squelette est plus fort qu'un simple comptage : la liste ordonnée des 1 208
balises et commentaires est la MÊME chaîne de caractères des deux côtés. Donc
mêmes classes, mêmes attributs `style`, mêmes `href`, mêmes `id`, mêmes
`data-anim-groupe`, mêmes commentaires de section. Zéro différence, pas même un
`alt`, cette page n'en portant aucun.

Marqueurs présents et inchangés : `<!--NAV-->`, `<!--CTA-->`, `<!--PIED-->`.
Il n'y a **pas** de `<!--RES-NAV:…-->` dans la source : cette page écrit sa nav
latérale en clair (`<nav class="res-nav">` avec `<div class="titre">Legal
Data</div>`), contrairement à 10-ressources, 11-blog, 13-glossaire, 15, 17, 23
et 25. Rien à reporter, donc, et surtout rien à inventer : le jumeau anglais
écrit la même nav en clair, avec la même entrée `.actif` sur `#perimetre`.

## Garde-fous, vérifiés sur le fichier anglais

| Contrôle | Résultat |
|---|---|
| élément portant deux attributs `class` | 0 |
| `font-size` en `style=` inline | 0 |
| grille (`grid`) en `style=` inline | 0 |
| tiret cadratin U+2014 / demi-cadratin U+2013 | 0 / 0 |
| `monospace` | 0 |
| emoji | 0 |
| surface claire en section sombre sans `.carte-claire` | sans objet : le seul bloc `sur-sombre` est le bandeau, il ne contient aucune carte |

## Preuve que les nombres sont identiques

Extraction de tous les nombres des nœuds de texte des deux fichiers (balises et
commentaires exclus), après normalisation des séparateurs : côté français
l'espace des milliers est retirée et la virgule décimale devient un point, côté
anglais la virgule des milliers est retirée.

```
nombres FR (occurrences) : 239   |   EN : 239
multi-ensembles égaux    : True
écarts                   : aucun
signes %                 : 32 des deux côtés
```

Les trois nombres écrits en toutes lettres suivent, un pour un :
`neuf → nine`, `huit → eight`, `seize → sixteen` (1 occurrence chacun des deux
côtés). La date `2026-07-06` est inchangée. `mv_produit_hs_reg_autorite` est
inchangé.

Ce qui change de FORME, jamais de valeur :

- milliers : `5 613 → 5,613`, `14 225 → 14,225`, `4 658 → 4,658`,
  `7 198 → 7,198`, `10 582 → 10,582`, et les quatorze valeurs du bloc
  `.mesures` (`9 613 → 9,613` … `1 482 → 1,482`).
- décimales : `64,3 % → 64.3%`, `90,2 % → 90.2%`, `22,2 % → 22.2%`, et les
  quatorze autres parts de marché (dix-sept nombres à décimale en tout).
- pourcentages : l'espace française avant `%` tombe (`68 % → 68%`).

Aucun nombre nouveau, aucun nombre perdu.

## Ce qui reste en anglais, à dessein

Déjà en anglais dans la source française, donc recopié tel quel : les dix-sept
libellés de familles du bloc `Produit → autorités` (`Home & Diy`,
`Chemicals & Industrial`, … `(Non Retail)`, `Ppe & Safety`, `Toys & Childcare`),
les types de produit de la matrice et des cartes (`Food Core`,
`Industrial Chemicals`, `Diy Tools Hardware`, `Live Animals Raw`, `Machinery
Industrial Components`…), les codes marché (`EU`, `US`, `GB`, `CH`, `CA`, `IN`,
`AU`, `BR`, `FR`, `AE`, `TR`, `KR`, `CN`, `MX`, `JP`, `ID`, `SA`, `DE`) et les
six libellés SH6 de l'explorateur (`Horses; live, pure-bred breeding animals`…).
Ce sont les valeurs servies par la vue : les traduire aurait fabriqué des
libellés qui n'existent nulle part.

`Legal Data` (titre de la nav latérale) est un nom d'offre : inchangé.
`REACH` est un nom de texte réglementaire : inchangé.
`Cleo Comply` : inchangé.

## Ce qui reste en français, à dessein

Les sept commentaires de section, à l'identique, y compris leurs mesures
(`390 px`, `157 px`, `media query de 640`) et la note sur `CoverageAtlas`. Ce
sont des notes de chantier, invisibles à la page, et les garder mot pour mot
rend la relecture côte à côte immédiate. C'est aussi ce que fait déjà
`01-accueil-en.html`.

Les `id` et les `href` restent français (`#perimetre`, `#marches`, `#matrice`,
`#autorites`, `#explorateur`, `21-inscription.html`) : ce sont des identifiants
et des cibles, pas du texte visible.

## Les traductions qui méritent une ligne

| FR | EN | pourquoi |
|---|---|---|
| code SH / SH6 | HS code / HS6 | le nom anglais de la même nomenclature |
| veille live | live monitoring | mot générique, pas le nom d'offre `Regulatory Change Agent` |
| régs | regs | même abréviation, même colonne étroite |
| autorités de contrôle | enforcement authorities | |
| Surveillée | Monitored | 6 occurrences, colonne `Monitoring` |
| couleur | colour | orthographe britannique, comme `labelling` dans le châssis anglais |
| Le gris est un angle mort. | Grey is a blind spot. | idem |
| Matrice : type de produit × marché | Matrix: product type × market | le `×` est conservé, ce n'est pas un tiret |
| Instantané au | Snapshot as of | |
