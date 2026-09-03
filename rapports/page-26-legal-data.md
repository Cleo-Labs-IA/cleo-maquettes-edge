# Page 26 · Legal Data

Fichier produit : `/Users/naomiehalioua/cleo-maquettes-edge/pages/26-legal-data.html` (créé, 49 776 octets)
Source : https://www.cleolabs.co/fr/legal-data
Habillage : moule de la famille Ressources (`pages/10-ressources.html`, `pages/13-glossaire.html`)

## Le cas particulier de /legal-data

`next.config.ts` de `cleo-landing` porte bien deux rewrites vers
`legaldata-public.cleolabs.co`, mais ils ne visent QUE `/legal-data/:path*` et
`/legal-data-static/:path*`. La page `/fr/legal-data` elle-même n'est pas
proxifiée : elle est servie nativement par
`src/app/[locale]/legal-data/page.tsx` + `CoverageAtlas.tsx`, qui sont le
portage de `/coverage` du dépôt `cleo-legaldata-public`. La redirection
`/coverage → /legal-data` du même fichier le confirme.

Ce sont donc les pages sœurs (`/legal-data/docs`, `/legal-data/playground`)
qui sont proxifiées, pas celle-ci. J'ai relevé la page servie au curl avec un
User-Agent de navigateur (HTTP 200, 5 210 837 octets) et j'ai extrait la
matière du HTML rendu, pas du texte aplati : l'aplatissement écrasait les
valeurs consécutives identiques de la matrice.

## Ce que j'ai repris, et d'où

Toute la structure de `CoverageAtlas.tsx` est reprise dans son ordre :
hero, compteurs, note de périmètre, carte, matrice, explorateur, table SH6,
ligne de provenance.

### Verbatim de la page servie
- Surtitre « Atlas de couverture · Cleo Comply »
- Titre « Chaque produit, chaque autorité, et ce qu'on surveille en direct. »
  (la seconde moitié est en bleu sur le site, elle l'est ici aussi)
- Chapô « Une carte vivante de la chaîne produit → code SH → réglementation →
  autorité… Le vert est couvert. Le gris est un angle mort. »
- Les deux boutons : « Obtenir un accès API », « Explorer la couverture »
- La note de périmètre, intégrale (« Périmètre : graphe de veille produit
  Cleo Comply, indexé par code SH… »)
- Les intitulés de sections : « Veille live par marché », « Taille =
  réglementations suivies · couleur = part avec flux live. », « Matrice : type
  de produit × marché », « Chaque cellule = part des réglementations de ce type
  de produit, dans ce marché, surveillée en direct. », « Produit → autorités »,
  « Choisissez une famille puis un type… », « Explorateur produit SH6 »
- Les trois filtres : Tous · Surveillés seulement · Angles morts seulement
- « Affichés 60 sur 5 613 SH6 » et le bouton « Charger plus »
- La ligne de provenance : « Instantané au 2026-07-06 · Source :
  mv_produit_hs_reg_autorite (Cleo Comply). Tous les chiffres calculés
  directement depuis la vue. »

### Chiffres relevés, au chiffre près

| Chiffre | Où sur la page servie |
| --- | --- |
| 5 613 codes produit SH6 | bloc KPI du hero |
| 14 225 réglementations mappées | bloc KPI du hero |
| 4 658 autorités de contrôle | bloc KPI du hero |
| 158 marchés | bloc KPI du hero |
| 68 % régs sous veille live, 7 198 / 10 582 | 5e KPI + son accent |
| 64,3 % des mappings sous veille live | encart « Couverture mondiale » |
| 93 / 158 marchés ≥ 30 % surveillés | même encart |
| 93 · 23 · 5 · 37 | la barre de paliers du même encart |
| 7 types les plus régulés (Food Core 76 %, Industrial Chemicals 57 %, Consumer Electronics 64 %, Chemicals Intermediates 0 %, Live Animals Raw 0 %, Jewelry Watches Eyewear 61 %, Agri Commodities Raw 0 %) | liste « Types les plus régulés » |
| 18 marchés du classement, de EU 90,2 % à DE 61,5 % | « Plus gros marchés » |
| 9 lignes de la matrice × 16 marchés (144 cellules) | table de la matrice |
| 17 familles et leur volume, de Home & Diy 9 613 à Toys & Childcare 388 | sélecteur « Produit → autorités » |
| 6 lignes SH6 (010121, 010129, 010130, 020110, 020120, 020311) avec régs / marchés / autorités | table SH6 |

Le sens des quatre paliers de couleur (≥ 30 % vert, 5 à 29 % orange, sous 5 %
rouge, 0 gris) n'est écrit nulle part sur la page servie : il vient de
`cleo-landing/src/lib/coverage-data.ts:123-135` (`captureColor`,
`captureTier`). C'est ce qui me permet d'écrire « 93 marchés surveillés à
30 % et plus » plutôt que de laisser quatre pastilles muettes.

Les 60 lignes SH6 servies portent toutes la pastille verte « surveillée »
(vérifié : 60 occurrences de `#1a8a4a`, 0 de `#9ca3af` dans cette table).
Les 6 lignes reprises portent donc « Surveillée », comme sur la page.

### Mise en forme des nombres
Le site rend « 5,613 » et « 64.3 » (séparateurs anglais) sur une page
française. La maquette écrit « 5 613 » et « 64,3 » : même valeur, séparateurs
français, comme `02-entreprise.html` écrit déjà « 25 000 » et « 2 812 ».

## Ce que je n'ai pas pu sourcer, ou pas repris

1. **La carte du monde elle-même.** Elle est rendue par un composant client
   (`CoverageMapView`, chargé en `dynamic({ssr:false})`) : le HTML servi ne
   contient que « Loading map… ». Aucune donnée de choroplèthe n'est
   récupérable au curl. La section « Veille live par marché » de la maquette
   porte donc les deux blocs qui accompagnent la carte et qui, eux, sont
   servis : l'encart « Couverture mondiale » et le classement des 18 plus gros
   marchés. Rien n'est inventé pour combler la carte.
2. **Le panneau « Produit → autorités » en état sélectionné.** Le HTML servi
   affiche « Choisissez un type de produit » : aucune autorité nommée n'est
   rendue. La maquette montre donc les 17 familles et leur volume de règles,
   et s'arrête là. **Aucun nom d'autorité n'apparaît sur la page**, faute de
   source.
3. **Les 8 autres types de la matrice** (Machinery Industrial Components,
   Base Metals Raw, Textile Raw Materials, Agri Commodities Raw, Plastics
   Rubber Raw, Instruments Industrial, Transport Industrial, Wood Raw, et les
   matières premières qui suivent) sont à 0 sur les seize marchés : je les
   nomme en légende au lieu de reproduire 8 lignes de zéros.
4. **La sous-liste de types d'une famille** (Wood Raw 359, Diy Tools Hardware
   122…) est un état de sélection de la famille Home & Diy. Non reprise :
   elle n'a de sens qu'avec l'interaction.
5. **Les trois compteurs canoniques** (106 pays · 25 000 réglementations ·
   19 000 autorités réglementaires) ne sont **pas** utilisés. L'atlas a son
   propre périmètre (graphe de veille produit Cleo Comply indexé par code SH)
   et ses propres compteurs, 158 marchés et 4 658 autorités. Les poser côte à
   côte ferait dire à la page deux choses contradictoires sur le même sujet.
6. **La cible du bouton « Obtenir un accès API ».** Sur le vrai site elle
   pointe vers `https://cleo-legal-public.vercel.app/signup`
   (`CoverageAtlas.tsx:21`), un portail hors chantier. Dans la maquette elle
   pointe vers `21-inscription.html`, la page d'inscription du chantier, pour
   qu'aucun lien ne meure.
7. **Fiche SEO absente.** `commun/seo.json` s'arrête à `22-legal.html`, et la
   table `PAGES` de `construire.mjs` aussi : la page ne sera pas construite
   tant qu'on ne l'y a pas inscrite, et sans fiche elle prendrait le titre de
   repli. Les valeurs du vrai site, à recopier telles quelles le moment venu :
   - titre : `Legal Data, atlas de couverture : 4 658 autorités sur 158 marchés`
   - description : `Carte vivante de la chaîne produit → code SH → réglementation → autorité : 5 613 codes SH6, 14 225 réglementations et 4 658 autorités de contrôle sur 158 marchés, dont 68 % des réglementations produits de consommation sous veille live. Ce que Cleo capte, et où sont les angles morts.`
   - url source : `https://www.cleolabs.co/fr/legal-data`

## Un écart assumé avec le moule, mesuré

Le bandeau des deux pages sœurs passe par `.res-tete`. Cette grille **n'est
pas dans la media query de 640 px** : à 390 px elle reste sur deux colonnes,
mesurées à **157 px chacune** sur `sortie/10-ressources.html`. Un titre d'un
mot (« Ressources », « Glossaire ») le supporte ; le titre d'ici en fait dix
et serait tombé à deux mots par ligne, exactement le défaut vécu sur le
témoignage de l'accueil. Le bandeau de cette page est donc en flux de bloc
(surtitre, titre, chapô, boutons), sans aucune grille posée en inline. Le
reste de la page suit le moule sans écart : `section-serree` sur champ
profond, puis `.res-corps` avec sa nav latérale collante et ses cartes.

## Les contrôles que j'ai passés

Je n'ai lancé ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs`. J'ai
assemblé un aperçu dans mon bac à sable (base.css + composants.css +
mouvement.css + mouvement.js, dans l'ordre de `construire.mjs`) et je l'ai
mesuré au navigateur.

Sur le fichier :
- balises équilibrées sur div, section, ul, li, p, a, table, nav, footer, h1,
  h2, h3, thead, tbody, tr, td, th, span : aucun écart
- 0 attribut `font-size` en `style=` inline ; crans typo utilisés : `t-display`,
  `t-h1`, `t-h3`, `t-body`, `t-caption`, `t-label`, tous dans les huit
- 0 élément portant deux attributs `class`
- 0 `grid-template` ni `display:grid` en `style=` inline : les six grilles de
  la page sont `.res-corps`, `.g4`, `.g2`, `.g3`, `.mesures` et
  `.table-defilante`, toutes du kit
- 0 tiret cadratin, 0 demi-cadratin, 0 emoji (les drapeaux du vrai site sont
  remplacés par les codes marché), 0 `font-family`, 0 monospace
- 0 `clamp()` écrit à la main, donc rien à casser sur les espaces
- 0 marqueur `ico:` et 0 `<img>` : rien à ajouter dans `IMAGES` ni dans
  `commun/icones.js`
- 1 `<h1>`, 5 `<h2>`, aucun titre vide
- tous les liens internes existent (`21-inscription.html`), les 5 ancres de la
  nav latérale tombent sur les 5 `id` de la page
- la page commence par `<!--NAV-->` et finit par `<!--CTA-->` puis `<!--PIED-->`

Au navigateur (390, 768, 1280, 1920 px) :
- aucun débordement horizontal : scrollWidth = largeur de la fenêtre aux
  quatre largeurs. Les deux tables larges défilent dans leur propre
  `.table-defilante`, jamais la page
- les grilles se replient : `.g4` 4 → 2 → 1 colonne, `.g3` 3 → 2 → 1,
  `.res-corps` 200 px + 752 px → une colonne
- 0 élément `data-anim-groupe` resté à `opacity:0` après défilement complet
- 0 élément rendu en monospace
- texte invisible : 67 régions de glyphes mesurées à l'écart-type des pixels,
  **0 souci**. Témoin négatif obligatoire : en injectant un bloc blanc sur
  blanc et un bloc noir sur blanc dans l'aperçu, le contrôle attrape bien le
  premier (écart 0,0) et laisse le second passer. Sans ce témoin, « 0 souci »
  n'aurait rien prouvé.

Aucune surface claire n'est posée dans la section sombre (le bandeau ne porte
que du texte et deux boutons du kit), donc `.carte-claire` n'avait pas lieu
d'être ; toutes les cartes de la page vivent dans la section claire.
