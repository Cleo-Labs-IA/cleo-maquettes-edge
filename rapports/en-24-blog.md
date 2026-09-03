# Jumeau anglais de la page Blog

- Source : `/Users/naomiehalioua/cleo-maquettes-edge/pages/24-blog.html`
- Écrit : `/Users/naomiehalioua/cleo-maquettes-edge/pages/24-blog-en.html`
- Le 2 septembre 2026.

## 1. Comptage de balises : 336 contre 336, zéro écart

| Contrôle | FR | EN | Verdict |
| --- | --- | --- | --- |
| Balises ouvrantes + fermantes | 336 | 336 | identique |
| Séquence des balises, dans l'ordre | n/a | n/a | **strictement égale** |
| Attributs `class`, dans l'ordre | 121 | 121 | identiques un à un |
| Attributs `style`, dans l'ordre | 45 | 45 | identiques un à un |
| `href` | 15 | 15 | identiques |
| `src` (`img:paris`, `img:flacons`, `img:pneus`, `img:fenetres`, `img:echangeur`, `img:classeurs`, `img:briques`) | 7 | 7 | identiques |
| `data-slug` | 14 | 14 | identiques |
| `datetime` | 14 | 14 | identiques |
| `viewBox` / `d` / `stroke-width` des chevrons | 13 | 13 | identiques |
| Marqueurs générateur | `NAV`, `RES-NAV:Publications`, `CTA`, `PIED` | idem | identiques |

La comparaison va plus loin que le comptage : la **liste ordonnée** des balises,
des classes, des styles et de chaque attribut est égale terme à terme. Il n'y a
pas une seule divergence de structure, pas même un `alt` (les sept `alt=""` de la
page française sont vides, il n'y avait rien à traduire, contrairement à
l'accueil où l'unique écart était un `alt` traduit à dessein).

Contrôle des cinq garde-fous, sur les deux fichiers :

- Élément portant deux `class` : **aucun**, des deux côtés.
- `grid` en `style=` inline : **aucun**, des deux côtés.
- `font-size` en `style=` inline : **aucun**, des deux côtés. L'échelle reste
  dans `.t-display`, `.t-h1`, `.t-body`, `.t-caption`, `.t-label`.
- `.carte-claire` : la seule section sombre de la page (`sur-sombre gc-deep`)
  ne contient que le `h1` et le paragraphe d'intro, aucune surface claire n'y
  est posée. Rien à basculer, ni en français ni en anglais.
- Monospace : absent. Emoji : aucun (catégorie Unicode `So` vide).
  **U+2014 : 0 des deux côtés. U+2013 : 0 des deux côtés.**

## 2. Les nombres : 76 jetons de chaque côté, même multi-ensemble

Extraction faite sur le texte visible seul (SVG et commentaires retirés,
attributs retirés puisque `datetime` est déjà contrôlé plus haut), après
normalisation : virgule décimale française ramenée au point (`2,33` → `2.33`,
`1,5` → `1.5`), espace de milliers supprimée, et nombres écrits en toutes lettres
convertis (`soixante et une` / `sixty-one` → 61, `sept` / `seven` → 7,
`trois` / `three` → 3, `deux` / `both` → 2).

**FR 76 jetons, EN 76 jetons. Différences : AUCUNE.**

Le jeu complet, identique des deux côtés (valeur × occurrences) :

```
1×4   01.09×1  1.5×1  2×1   2.33×1  3×6   5×1   7×1   8×3   9×1
11×2  11.02×1  13×1   14×1  18×1    19×3  20×1  25×3  26×1  26.08×1
27.08×1  28×3  28.08×1  29×2  29.08×1  30.08×1  31×1  31.08×1
40×1  43×1  61×2  81×2  95×1  114×4  306×1  700×1  2019×1  2026×15  2027×1
```

Les trois chiffres portés par des formes différentes mais de valeur égale :

| Fait | FR | EN |
| --- | --- | --- |
| Levée | 1,5 M€ | €1.5M |
| Amende Boohoo | 2,33 millions d'euros | €2.33 million |
| Promotions fictives | 95 % | 95% |

Contrôle des noms propres, chacun compté sur les deux fichiers, tous égaux :
Cleo Labs 3/3, Larry Berger 1/1, Kima Ventures 1/1, Financière Saint-James 1/1,
Deel 1/1, Naomie Halioua 10/10, Anaelle Guez 5/5, Alexandre Bloch 2/2,
Boohoo 1/1, BBC Verify 1/1, Xinjiang 1/1, Legal Atlas 1/1, GPSR 1/1, DPP 1/1,
CE 1/1. **Aucun nom, aucune date, aucun chiffre nouveau.**

## 3. Les quatorze titres d'articles : tous publiés en anglais, aucun retraduit

Consigne tenue : je n'ai retraduit aucun titre. J'ai récupéré la version anglaise
publiée pour les quatorze, et je l'ai recopiée.

**Sept titres de la série quotidienne** : absents de
`/Users/naomiehalioua/cleo-landing/src/data/blog-posts.json` (ce fichier date du
30 juillet et ne porte que 77 billets). Je suis allé sur le site servi :
`https://www.cleolabs.co/en/blog/<slug>` répond 200 pour les sept, et
`https://www.cleolabs.co/en/blog` liste 114 slugs distincts, ce qui recoupe le
chiffre 114 déjà porté par la page française. Titre repris depuis le `<h1>` et
le `og:title` de chaque page anglaise, qui concordent :

| slug | source du titre EN |
| --- | --- |
| `thailand-methanol-processing-aid-2026` | site, `/en/blog/…` |
| `uk-ebike-battery-fire-deaths-2026` | site, `/en/blog/…` |
| `belgium-egg-salmonella-recall-2026` | site, `/en/blog/…` |
| `brazil-anvisa-unregistered-cosmetics-2026` | site, `/en/blog/…` |
| `spain-textile-epr-decree-2026` | site, `/en/blog/…` |
| `boohoo-dgccrf-leather-labeling-fine-2026` | site, `/en/blog/…` |
| `us-uflpa-entity-list-expansion-2026` | site, `/en/blog/…` |

**Sept titres de la une et des guides** : pris dans `blog-posts.json`,
champ `title.en`, et recoupés un à un sur le site.

| slug | titre EN publié |
| --- | --- |
| `cleo-labs-raises-1-5m-preseed` | Cleo Labs raises €1.5M to automate product regulatory compliance at a global scale |
| `cosmetic-regulation-by-country` | Cosmetic Regulation by Country: EU vs US vs Japan vs Brazil vs China |
| `digital-product-passport-retail-guide` | Digital Product Passport (DPP): What Retail Brands Need to Know |
| `ce-marking-digital-products-2026` | CE marking in 2026: from physical goods to digital products |
| `gpsr-compliance-guide-consumer-goods` | GPSR Compliance Guide for Consumer Goods Brands (2026) |
| `legal-atlas-machine-readable-law` | Legal Atlas: the world's law, machine-readable |
| `open-source-product-compliance-skills-ai-agents` | We open-sourced 40 product compliance skills for AI agents |

Un point à signaler : pour `ce-marking-digital-products-2026` et
`legal-atlas-machine-readable-law`, le `<h1>` servi porte un point final que le
`title.en` du JSON n'a pas. J'ai gardé la forme **sans point final**, celle du
JSON, parce que c'est celle qu'a prise la page française de la maquette pour ces
deux mêmes titres. Le point est une divergence du site entre ses deux champs,
pas un choix de traduction.

Le chapô de la une reprend `description.en` du JSON, à un caractère près : le
tiret cadratin de la version publiée (« … figures — plus additional funding »)
est remplacé par une virgule, exactement comme la page française avait remplacé
le sien par un deux-points. Garde-fou 5.

## 4. Ce que j'ai laissé tel quel, et pourquoi

**Laissé en français, à dessein, un seul élément :**

- `<!--RES-NAV:Publications-->`. C'est la clé que `construire.mjs` compare, en
  ligne 626, à la table de la fonction `resNav` (ligne 517), dont les libellés
  sont `Tout`, `Rencontres`, `Modèles`, `Publications`, `Glossaire`. Traduire la
  clé ferait perdre l'état actif de la nav latérale. Identifiant interne, pas du
  texte visible : elle reste `Publications`.

**Pris en anglais depuis une source publiée, pas traduit par moi :**

- La fonction de Naomie Halioua sous le titre de une. Le français porte
  « co-fondatrice & CRO, Recherche IA ». Je n'ai pas traduit : `authors.json`
  du site porte le champ `role.en` officiel, **« Co-founder & CRO, AI Research »**,
  et c'est celui-là que la page anglaise sert. Même logique que pour les titres.
- Les étiquettes de rubrique. Le JSON porte `category.en` pour chaque billet :
  `Entreprise` → **Company**, `Conformité produit` → **Product Compliance**,
  `Produit` → **Product**. Ce ne sont pas mes choix de mots, ce sont ceux du site.

**Non traduit parce que la consigne l'interdit :** GPSR, DPP, CE, Legal Atlas,
Cleo Labs, ainsi que tous les noms de personnes, d'entreprises, de médias
(BBC Verify) et de lieux (Xinjiang).

**Traduit, parce que ce sont des textes de maquette et non du contenu publié :**
« Actualités & analyses » → News & analysis · « La série quotidienne » →
The daily series · « Guides et analyses » → Guides and analysis · « Le corpus,
relevé sur la page servie » → The corpus, measured on the served page ·
« Lire » → Read · « Tout / Conformité » des pilules → All / Compliance ·
« Voir les 114 articles » → See the 114 articles · les quatre libellés du bloc
`.mesures` · les dates lisibles (« 29 avril 2026 » → « 29 April 2026 »), les
attributs `datetime` restant inchangés.

## 5. Ce que je n'ai pas fait

Ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs` n'ont été lancés.
`sortie/` n'a pas été touché. Les contrôles ci-dessus sont des lectures et des
comparaisons faites directement sur les deux fichiers de `pages/`.

Une remarque pour qui reprendra : `construire.mjs` ne connaît pas encore
`24-blog-en.html`. Ni la table `PAGES`, ni la table `JUMEAU_LANGUE` (ligne 603),
ni la table `JUMEAUX` des `hreflang` (ligne 634) ne portent d'entrée pour cette
page ; les trois ne listent aujourd'hui que l'accueil. Tant que ces trois entrées
manquent, le fichier ne sera pas construit et n'aura ni sélecteur de langue ni
`alternate`. C'est un travail de générateur, hors de mon périmètre, et je n'y ai
pas touché.
