# SEO/GEO · pages/02-entreprise.html

Passe du 27/08/2026. Fichier touché, et lui seul :
`/Users/naomiehalioua/cleo-maquettes-edge/pages/02-entreprise.html`.
Source de vérité lue en lecture seule : `/Users/naomiehalioua/cleo-landing`.
Aucun script du chantier n'a été lancé (ni `construire.mjs`, ni `capturer.mjs`,
ni `verifier.mjs`, ni `temoin.mjs`). Sauvegarde de l'état d'avant :
`.../scratchpad/02-entreprise.avant.html`.

Méthode : remplacement de chaîne exacte, une occurrence attendue par
remplacement, échec bloquant si le compte diffère. Zéro découpe par index.

## Les changements, un par ligne

### Les alt (14 images, 14 alt vides → 0)

1. `img:echangeur` (héros) → « Vue aérienne d'un échangeur autoroutier, une seule voiture bleue parmi les voitures blanches et grises » (image ouverte et regardée : `images/echangeur.jpg`).
2. `img:anaelle` (carte portrait) → « Portrait d'Anaëlle Guez ».
3. `img:naomie` (carte portrait) → « Portrait de Naomie Halioua ».
4. `img:alex` (carte portrait) → « Portrait d'Alexandre Bloch ».
5. `img:darcial` (carte portrait) → « Portrait de Darcial Mondjo ».
6. `img:thezi` (carte portrait) → « Portrait de Thezi Mabuza ».
7. `img:fenetres` (cellule lavande) → « Façade d'immeuble la nuit, deux fenêtres éclairées en bleu parmi des dizaines de fenêtres jaunes » (image regardée : deux fenêtres bleues, pas une).
8. `img:pneus` → « Pneus empilés, un pneu bleu au centre de la pile ».
9. `img:briques` → « Briques de construction grises en vrac, deux briques bleues au milieu ».
10. `img:parc-voitures` (scène) → « Parc de voitures neuves vu du ciel, une seule voiture bleue au milieu des voitures blanches ».
11. `img:anaelle` (avatars du texte long) → « Anaëlle Guez ».
12. `img:naomie` (avatars du texte long) → « Naomie Halioua ».
13. `img:alex` (avatars du texte long) → « Alexandre Bloch ».
14. `img:anaelle` (portrait du CTA final) → « Anaëlle Guez, cofondatrice de Cleo Labs ».

### Les liens LinkedIn (0 → 2)

15. Carte Anaëlle Guez : lien `https://www.linkedin.com/in/anaelle-guez-ab341746/`, posé en ligne dans la ligne de fonction. Source : `cleo-landing/src/app/[locale]/company/layout.tsx:71`.
16. Carte Naomie Halioua : lien `https://www.linkedin.com/in/naomiehalioua/`, même emplacement. Source : `cleo-landing/src/app/[locale]/company/layout.tsx:78`.

### La levée, visible (nouveau bloc)

17. Titre `1,5 M€ levés en pre-seed, annoncés le 29 avril 2026.` Montant : `company/layout.tsx:84-88` (`fundingTotal` 1500000 EUR). Date : `cleo-landing/src/data/blog-posts.json:2714` (`"date": "2026-04-29"` de l'article d'annonce).
18. Les trois financeurs NOMMÉS, dans l'ordre de la meta description FR de `/company` : `Kima Ventures`, `La Financière Saint-James`, `Larry Berger, fondateur d'Amplify`. Sources : `company/layout.tsx:90-94` (tableau `funder`, avec `description: "Founder of Amplify"`) et `company/layout.tsx:15`.
19. Lien vers l'article : `https://www.cleolabs.co/fr/blog/cleo-labs-raises-1-5m-preseed`. Slug vérifié à trois endroits : `blog-posts.json:2703`, `blog/[slug]/page.tsx:72`, `components/blog/articles/cleo-labs-raises-1-5m-preseed.tsx:7`.

### Le badge du prix

20. Pilule `Lauréate, The Pitch by Deel (Station F, 2026)`. Source : champ `award` du JSON-LD Organization, `cleo-landing/src/app/[locale]/layout.tsx:94` (« Winner — The Pitch by Deel (Station F, 2026) »), rendu en français et sans tiret cadratin, que le DS interdit. Le prix est un fait ; le slogan reste en liste noire (voir plus bas).

### Le bloc presse (0 → 6 liens sortants)

Les six médias, leur URL exacte et leur citation FR au caractère près, lus dans
`cleo-landing/src/components/landing/PressSection.tsx:14-45` :

21. Tech.eu · `https://tech.eu/2026/04/29/cleo-labs-secures-eur15m-to-scale-ai-driven-product-compliance-globally/` · 29 avril 2026.
22. EU-Startups · `https://www.eu-startups.com/2026/04/female-founded-french-startup-cleo-labs-raises-e1-5-million-to-automate-international-product-compliance/` · avril 2026.
23. Vestbee · `https://www.vestbee.com/insights/articles/cleo-labs-raises-1-5-m` · sans date (voir trous).
24. FinTech Global · `https://fintech.global/2026/04/29/cleo-labs-secures-e1-5m-for-global-product-compliance/` · 29 avril 2026.
25. RegTech Analyst · `https://regtechanalyst.com/cleo-labs-raises-e1-5m-to-scale-ai-compliance-platform/` · sans date.
26. The Legal Wire · `https://thelegalwire.ai/cleo-labs-raises-e1-5m-to-automate-product-regulatory-compliance-at-a-global-scale/` · sans date.

### Le renvoi vers la recherche (0 → 1)

27. Ligne cliquable « Lire notre article de recherche » + « Une approche multi-agents par pipeline pour l'intelligence réglementaire: 19 régions, 8 langues, 30+ appels LLM par exécution. » Ce sont exactement les deux chaînes que `/company` affiche déjà : `cleo-landing/src/i18n/sections/social-proof.ts:208-212`, rendues par `TeamSection.tsx:237-243`. Cible : `https://www.cleolabs.co/fr/research`.

## Vérifié

- Balises appariées après édition : `div` 120/120, `section` 7/7, `p` 8/8, `a` 13/13, `span` 34/34, `ul` 0/0, `table` 0/0, `aside` 0/0. (Avant : `div` 89/89, `a` 3/3, `span` 22/22.)
- `alt=""` : 14 avant → **0** après. `alt` renseignés : 0 → **14**.
- Liens sortants `https://` : 0 → **10** (6 presse + 1 article de levée + 1 recherche + 2 LinkedIn). Les 3 `href="#"` de la maquette (essai gratuit, créneau) sont inchangés : ce ne sont pas des liens de preuve.
- `font-size` en `style=` inline : **0**. Toute l'échelle passe par les classes existantes (`t-display`, `t-h2`, `t-h3`, `t-body`, `t-caption`, `t-label`, `t-sm`).
- Attribut `class` en double sur un même élément : **0**.
- `clamp()` sans espace autour du `+` : **0**. Aucun `clamp()` ajouté.
- Monospace : **0**. Emoji : **0**. Tiret cadratin : **0** (le `—` du champ `award` a été rendu par une virgule).
- Marqueurs `img:` utilisés : `alex, anaelle, briques, darcial, echangeur, fenetres, naomie, parc-voitures, pneus, thezi` · les 10 figurent dans la table `IMAGES` de `construire.mjs`. Marqueurs `ico:` : `cabinet, engrenage, euro` · les 3 figurent dans `commun/icones.js`. Aucun marqueur neuf introduit.
- Cartes de l'équipe : **structure non touchée**. Les trois `padding-bottom:40px` (Alexandre, Darcial, Thezi) sont intacts, les blocs absolus `bottom:20px` aussi. Les deux seules modifications dans ces cartes sont textuelles : un `<a>` en ligne ajouté dans la ligne de fonction d'Anaëlle et de Naomie. Cette ligne est en `.t-sm` (0,9375 rem = 15 px, `composants.css:27`) ; « CEO, cofondatrice LinkedIn » fait ~26 caractères, soit ~180 px pour une colonne utile d'environ 345 px (conteneur 1200, `g3` 3 colonnes, gap 22, moins 20 px de marge de chaque côté) : la ligne ne se replie pas, la hauteur du bloc ne change pas, l'alignement à 0,00 px tient. **Non re-mesuré au pixel** : `capturer.mjs` et `verifier.mjs` sont interdits sur cette passe. À confirmer à la prochaine capture.
- Aucun parcours, aucun titre, aucune date n'a été inventé pour Darcial Mondjo ni pour Thezi Mabuza : leurs cartes sont inchangées à l'`alt` près.
- Le dépôt `cleo-landing` n'a reçu aucune écriture.

## Trous laissés

- **Dates de 3 articles de presse sur 6.** `PressSection.tsx` ne porte aucun champ date : les seules dates sourçables sont celles inscrites dans le chemin de l'URL. Tech.eu et FinTech Global donnent `2026/04/29`, EU-Startups donne `2026/04` (mois seul, affiché « avril 2026 »). Vestbee, RegTech Analyst et The Legal Wire n'en portent aucune : la case est laissée vide plutôt que remplie par déduction depuis la date de l'annonce. Ce qu'il faudrait : la date de publication réelle de ces trois articles.
- **Date de la levée elle-même.** Le `FundingEvent` de `company/layout.tsx` n'a pas de champ date. Le « 29 avril 2026 » affiché est la date de l'**article d'annonce** (`blog-posts.json`), pas une date de closing sourcée. Formulation retenue : « annoncés le 29 avril 2026 », qui dit exactement ce qui est sourçable.
- **Le financement complémentaire Deel.** `blog-posts.json:2711-2712` mentionne « complété par un financement de Deel », absent du tableau `funder` du JSON-LD. Les deux sources divergent ; seuls les trois financeurs du JSON-LD de `/company` ont été transcrits.
- **LinkedIn d'Alexandre Bloch, Darcial Mondjo, Thezi Mabuza.** Les URL existent au dépôt (`social-proof.ts:174` et `data/authors.json:26` pour Alexandre ; `components/landing/ref/experts.ts:37` et `:54` pour les deux experts) mais la consigne portait sur les fondatrices, et poser un lien dans ces trois cartes ajouterait une ligne au-dessus du `padding-bottom:40px` qui tient l'alignement. Non posé, volontairement. À trancher avec une re-mesure.
- **Deux URL LinkedIn concurrentes par fondatrice.** Naomie : `/in/naomiehalioua/` (`company/layout.tsx:78`, `authors.json:8`, `blog/ArticleShell.tsx:109`) contre `/in/naomie-halioua/` (`social-proof.ts:160`). Anaëlle : `/in/anaelle-guez-ab341746/` (`company/layout.tsx:71`, `social-proof.ts:146`, `authors.json:17`) contre `/in/anaelleguez/` (`ArticleShell.tsx:117`). La variante du JSON-LD de `/company` a été retenue, c'est la page dont la maquette est le miroir. Une seule des deux formes est la bonne : à confirmer par Naomie, et à corriger côté `cleo-landing`.
- **Le libellé « Équipe Cleo » sur la carte d'Alexandre Bloch.** Le dépôt le déclare `CTO` (`social-proof.ts:172`, `authors.json`). La maquette dit « Équipe Cleo ». Non modifié : hors périmètre de cette passe, mais c'est un écart réel.

## Liste noire rencontrée

- **Score F1 de 0,81.** Croisé à `research.ts:59` (`{ value: '0.81', label: 'Score F1 (pipeline complet)' }`). **Non transcrit.** Le renvoi vers `/research` reprend uniquement la phrase que `/company` affiche déjà (19 régions, 8 langues, 30+ appels LLM), sans aucun chiffre de performance.
- **Les deux chercheuses inventées.** `research.ts:79-82` (Ana Velázquez, Lucía Mendoza) et les clés d'image `chercheuse-1` / `chercheuse-2` de `construire.mjs:58-59`. **Non citées, non introduites.** Aucune image de chercheuse n'apparaît sur la page.
- **Le slogan « The Deel of product compliance ».** **Non transcrit.** Seul le prix est repris, dans la formulation du champ `award` : « Lauréate, The Pitch by Deel (Station F, 2026) ».
- **Les trois titres de Naomie Halioua.** Croisés en trois endroits : `CRO & Co-founder` (`company/layout.tsx:77`), `Chief Research Officer & Co-founder` (`TeamSection.tsx:62`), `Co-fondatrice & Directrice de la Recherche` (`social-proof.ts:154`). La maquette, elle, affiche « CDO, cofondatrice ». **Je n'en ai choisi aucun** : la ligne de fonction n'a pas été retouchée, seul un lien LinkedIn y a été ajouté. Conflit signalé, à trancher par Naomie.
- **MARIA.** La carte flottante de la maquette porte déjà « MARIA, architecture multi-agents de veille réglementaire », qui est une quatrième formulation, non sourcée telle quelle au dépôt. **Non touchée et non reprise ailleurs** : je n'ai ajouté aucune mention de MARIA. À arbitrer avec les trois définitions concurrentes.
- **Les adresses `hello@` / `contact@`.** Aucune adresse e-mail n'a été posée sur la page.
- **`/resources/gdpr-compliance` (404), le `sameAs` Crunchbase « celo-labs », la collision « mica ».** Non rencontrés dans les fichiers lus pour cette passe, et rien de tout cela n'a été introduit.
