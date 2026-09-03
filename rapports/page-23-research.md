# Page 23 : Research

Gabarit créé : `/Users/naomiehalioua/cleo-maquettes-edge/pages/23-research.html`
(245 lignes, 2 `<section>`, 1 `<h1>`, 8 `<h2>`).
Page réelle rhabillée : `https://www.cleolabs.co/fr/research`.
Mesure du 01/09/2026. Aucun fichier existant du dépôt n'a été modifié.

---

## 1. Ce que j'ai lu, et où

| Source | Chemin / URL | Ce que j'en ai tiré |
|---|---|---|
| Page servie | `https://www.cleolabs.co/fr/research`, curl + UA navigateur, 99 693 o | la structure, les titres, l'ordre des sections, 699 mots de texte visible |
| Route | `cleo-landing/src/app/[locale]/research/{page,layout}.tsx` | passe-plat + métadonnées ; le corps vit ailleurs |
| Texte | `cleo-landing/src/i18n/sections/research.ts` | les 5 étapes, les 6 métriques, les 4 capacités, les 5 points du quadrant, la formule |
| Livre blanc | `cleo-landing/public/cleo-whitepaper-multi-agent-regulatory-intelligence.pdf`, 609 039 o, **20 pages, 8 718 mots** (`pdfinfo` + `pdftotext`) | les auteurs, la date, la fourchette de recherches, la forme exacte de la formule |
| Habillage | `pages/10-ressources.html`, `pages/13-glossaire.html` | le moule de la famille Ressources |
| Recon antérieure | `rapports/carte-recherche.md` | les six trous de citabilité, les trois définitions de MARIA |

---

## 2. Ce que j'ai repris de la page réelle

Repris **verbatim** (FR de la page servie) :

- le titre de page : « La science derrière l'intelligence. » ;
- le chapeau : « Chaque résultat produit par Cleo est traçable, mesurable et auditable… » ;
- le titre de l'article : « Une approche multi-agents par pipeline pour l'intelligence réglementaire » ;
- **le résumé entier**, 68 mots, sans une virgule changée ;
- les 5 étapes, titres et questions : Profiler & Cartographier / Découvrir / Scorer / Enrichir / Évaluer ;
- les 4 capacités et leurs questions clés, avec les valeurs `keyword: false`, `llm: 'partial'|false`,
 `pipeline: true` de `research.ts:34-39` rendues en Non / coche douce / coche pleine ;
- les 5 points du quadrant et les deux axes (`research.ts:47-53`) ;
- les intitulés de section : Dernier article · Chiffres clés · La chaîne en cinq étapes ·
 Au-delà de la recherche par mots-clés · Combler le vide du marché · Infrastructure de recherche ·
 Architecture streaming · Le livre blanc.

Chiffres repris tels quels, tous présents sur la page servie **et** dans le livre blanc :
**19** régions · **16** domaines sectoriels · **8** langues · **30+** analyses spécialisées.
Les trois premiers figurent mot pour mot dans le résumé du papier
(« 19 geographic regions, 16 regulatory domains, and eight languages », 4/3/3 occurrences).

Le quadrant de la page réelle est un nuage de points positionné en pourcentages. Je l'ai rendu en
**quatre cartes de quadrant** plutôt qu'en nuage absolu : les coordonnées `x`/`y` de `research.ts`
sont transcrites sans perte (x < 50 = Générique, x ≥ 50 = Spécifique à l'entreprise ; y < 50 =
Réactif, y ≥ 50 = Proactif), et la grille se replie proprement à 390 px, ce qu'un nuage en
positionnement absolu ne fait pas.

---

## 3. Les deux pièges annoncés

**Le score F1 de 0,81 : absent de la page.** Contrôle refait moi-même, pas repris de mémoire :
`pdftotext` sur le PDF servi, puis `grep -ci "f1\|f-measure"` → **0**, et `grep -o "0\.8[0-9]"` → **0**
sur 8 718 mots. La grille « Chiffres clés » porte 5 tuiles, pas 6. Contrôle automatique ajouté à ma
suite : `'0.81' in fichier or '0,81' in fichier` → faux.

**MARIA : une seule forme, sans description.** La chaîne
« MARIA (Multi-Agent Regulatory Intelligence Architecture) » apparaît **une seule fois** dans la page,
en ligne de sous-titre de la carte du livre blanc, sous l'étiquette « Titre original : ». C'est le titre
de couverture du PDF, vérifié au `pdftotext` (ligne 1-2), et la seule forme sans variante dans le
dépôt (`CANONICAL-FACTS.md:17`, `layout.tsx:150`). **Aucune prose ne décrit ce qu'est MARIA** :
ni « onze agents », ni « cinq agents nommés », ni « architecture multi-agents de veille ». Les trois
descriptions concurrentes relevées dans `carte-recherche.md` §2 sont restées dehors.

---

## 4. Ce que je n'ai PAS repris, et pourquoi

### 4.1 Trois divergences mesurées entre la page servie et le livre blanc qu'elle fait télécharger

Règle appliquée : **quand la page et le papier qu'elle distribue ne disent pas la même chose sur un
chiffre ou une relation, la maquette porte la version du papier.** C'est l'extension de la consigne
sur le F1. Chaque cas est traçable à une ligne.

| # | Page servie | Livre blanc | Ce que porte la maquette |
|---|---|---|---|
| 1 | « 420–1,200 recherches par exécution » (`research.ts:62`) | « roughly **370**–1,200 web searches per run », §3.2 | **« 370 à 1 200 »**, label « Recherches web par exécution, pour une entreprise type » |
| 2 | `S_total **=** (20 + ε) + (**37** × 4) + 5 · N_reg` | `S_total **≤** (20 + ε) + (**C** × 4) + 5 · N_reg`, `ε ∈ [0, 28]`, `C ≤ 37` | la forme du papier, borne supérieure, avec C défini : « nombre de blocs réglementaires retenus dans un ensemble de 37 (19 géographiques, 2 transverses, 16 sectoriels) » |
| 3 | « Cleo Labs, Neuilly-sur-Seine · À paraître, 2026 » (`research.ts:14-15`) | « Naomie Halioua, Alexandre Bloch, Anaelle Guez — Cleo Labs, Paris, France — February 2026 » | **« Naomie Halioua, Alexandre Bloch, Anaelle Guez · Cleo Labs · février 2026 »** |

Sur le point 3 : « À paraître » désigne un document daté de février 2026 et téléchargeable depuis la
page qui l'annonce comme à paraître. Je n'ai pas reconduit la formule. **Je n'ai pas non plus tranché
Paris contre Neuilly-sur-Seine : la maquette n'affiche aucune ville.** Le `pdfinfo` donne par ailleurs
une `CreationDate` au 12 mars 2026, alors que la couverture dit février 2026 ; j'ai suivi la
couverture, qui est la mention éditoriale.

### 4.2 Un quatrième écart, signalé mais non corrigé

La page dit « 30+ appels LLM spécialisés » ; le livre blanc dit
**« over 200 specialized LLM calls: approximately 40–80 for company profiling and regulation
mapping »** (§3.3, ligne 336 du texte extrait). Les deux ne se contredisent pas : 200 satisfait
« 30+ » : donc j'ai gardé le chiffre de la page, y compris dans le résumé cité verbatim.
**À arbitrer : la page sous-vend son propre système d'un facteur ~7.**

### 4.3 Non repris du tout

- **Les deux « chercheuses » `Ana Velázquez` et `Lucía Mendoza`** (`research.ts:79-82`) et les images
 `chercheuse-1` / `chercheuse-2` déjà déclarées dans `construire.mjs:58-59`. Elles ne sont rendues
 nulle part sur le site vivant. Le fil est posé des deux côtés du chantier ; je ne l'ai pas branché.
- **Le compteur « 3 700 sources »** : présent dans les métadonnées de `research/layout.tsx`, exclu par
 la consigne. Contrôle automatique : `'3 700' in fichier` → faux.
- **Les trois compteurs canoniques** (106 pays · 25 000 réglementations · 19 000 autorités) : la page
 réelle ne les affiche pas dans son corps, la maquette non plus. Rien à arbitrer.
- **Le mur de logos** « Des marques internationales nous font confiance » de la page réelle : aucune
 page de la famille Ressources n'en porte, et je n'ai pas pu établir depuis la page servie quels
 logos exactement y figurent. Section écrite sans lui.
- **L'animation « course aux mots-clés »** (`KeywordRaceAnimation.tsx`, 300 lignes) : son propos
 (les quatre capacités) est rendu par le tableau comparatif ; sa mise en scène ne l'est pas.
- **Le diagramme A1-A4 batch/streaming** : rendu en deux cartes portant les deux formules de la page
 (`T = Σ max(t_ij)` et `T ≈ max(Σ t_ij)`). Les deux légendes que j'ai écrites sous ces formules sont
 la traduction de la phrase du papier §3.3 : « each article flows through scoring, enrichment, and
 assessment as soon as it is ready, rather than waiting for all articles to complete a stage before
 the next begins ». J'avais d'abord écrit « traverse les cinq étapes » : **corrigé en « le scoring,
 l'enrichissement et l'évaluation »**, parce que le papier dit les étapes 3 à 5, pas les cinq.

---

## 5. L'habillage

Moule repris de `10-ressources.html` et `13-glossaire.html`, à l'identique :

- bandeau `sur-sombre gc-deep section-serree` avec `.res-tete` (h1 + chapeau) ;
- corps en `.res-corps` avec `<!--RES-NAV:Recherche-->` ;
- en-têtes de bloc `h2.t-h1` dans le même flex `baseline / space-between` que la famille ;
- composants existants uniquement : `.carte`, `.p32`, `.ligne-liste`, `.pilule`, `.etiquette`,
 `.chiffre`, `.ligne-icone`, `.comparatif` + `.table-defilante` + `.oui` / `.oui-doux` / `.non`,
 `.g2`, `.g3`, `.btn btn-marque btn-sm`.

**Une réserve sur la nav latérale.** `resNav` (`construire.mjs:513-520`) code en dur cinq entrées :
Tout · Rencontres · Modèles · Publications · Glossaire. « Recherche » n'en fait pas partie, donc
`<!--RES-NAV:Recherche-->` rend la nav complète **sans entrée active**. Ajouter la sixième entrée
demande de modifier `construire.mjs`, que je n'ai pas touché. À arbitrer.

**Deux autres choses à faire hors de mon périmètre**, signalées et non faites :
1. `23-research.html` n'est pas dans la table `PAGES` de `construire.mjs` : la page ne sera pas
 construite tant qu'elle n'y est pas inscrite.
2. Pas de fiche dans `commun/seo.json` : `construire.mjs:619` posera un titre de repli
 « Cleo : Research ». Le vrai `<title>` servi est
 « Recherche en Intelligence Réglementaire & Livres Blancs | Cleo Labs ».

---

## 6. Les contrôles que j'ai passés moi-même

Je n'ai lancé **ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs`**. J'ai monté un banc
d'aperçu séparé dans le scratchpad, qui inline `base.css` + `composants.css` + `mouvement.css`,
substitue `ico:` avec la même expression que `construire.mjs:462`, déplie `<!--RES-NAV:-->` avec la
même table de liens, injecte `mouvement.js`, et rend sous Playwright.

### Contrôles statiques : tous verts sauf un, attendu

| Contrôle | Oracle | Résultat |
|---|---|---|
| Équilibre des balises, 21 balises | comptage ouvrantes/fermantes | **0 écart** |
| Un seul attribut `class` par élément | regex sur chaque balise ouvrante | **0 doublon** |
| Aucun `font-size` en `style=` inline | regex | **0** |
| Aucune grille en `style=` inline (`display:grid`, `grid-template`) | regex sur tous les `style=` | **0** : les 4 grilles vivent dans `.g2`, `.g3`, `.res-corps` |
| Tiret cadratin U+2014 | comptage de codets | **0** (relevé complet des non-ASCII passé en revue caractère par caractère) |
| Emoji | plage U+1F300-U+1FAFF | **0** |
| Monospace | recherche de `mono` dans le fichier | **0** |
| `clamp()` avec espaces autour du `+` | regex | aucun `clamp()` en inline |
| Icônes `ico:` déclarées | `commun/icones.js`, même regex que `construire.mjs` | 1 icône, `research`, **présente** |
| Images `img:` déclarées | table `IMAGES` de `construire.mjs` | **aucune image citée** |
| Échelle typo, 8 crans | classes `t-*` utilisées vs les 9 autorisées | `t-display, t-h1, t-h2, t-h3, t-body, t-caption, t-label` : **0 hors échelle** |
| Toute classe existe dans le CSS actif | `base.css` + `composants.css` + `mouvement.css` | **1 seule inconnue : `gc-deep`** |
| Liens internes | fichiers présents dans `pages/` | **0 lien mort** (les 2 boutons de téléchargement sont en `href="#"`) |
| Marqueurs de chantier | ordre et position | `<!--NAV-->` en 1re ligne, `<!--CTA-->` puis `<!--PIED-->` en dernière |
| F1 absent | `'0.81'`/`'0,81'` | **absent** |
| 3 700 absent | `'3 700'`/`'3,700'` | **absent** |

**Sur `gc-deep`** : la classe n'est déclarée dans aucun CSS actif : elle ne survit que dans
`composants-noir.css.sauvegarde`. Elle est portée à l'identique par **12 gabarits existants**
(`10-ressources`, `13-glossaire`, `11-blog`, `15-evenements`, `17-modeles`, `12-article`,
`14-terme`, `16-evenement`, `18-recrutement`, `19-poste`, `21-inscription`, `22-legal`).
Le fond sombre vient de `.sur-sombre` (`base.css:140`), pas d'elle. **Je l'ai gardée pour rester dans
le moule ; ce n'est pas une régression que j'introduis, c'est une condition préexistante du dépôt.**

### Contrôles de rendu, quatre largeurs, sous Playwright

| Largeur | Débordement horizontal | Blocs restés invisibles après défilement | Éléments en police monospace | Erreurs JS | Hauteur |
|---|---|---|---|---|---|
| 390 px | **non** | **0** | 0 | aucune | 5 886 px |
| 768 px | **non** | **0** | 0 | aucune | 4 191 px |
| 1280 px | **non** | **0** | 0 | aucune | 3 986 px |
| 1920 px | **non** | **0** | 0 | aucune | 4 008 px |

Repli des grilles mesuré au `getComputedStyle`, pas déduit :

| Grille | 1280 px | 390 px |
|---|---|---|
| `.res-corps` | `200px 752px` | `334px` |
| `.g3` (chiffres clés) | `232px 232px 232px` | `334px` |
| `.g2` (quadrant, streaming) | `360px 360px` | `334px` |

Le tableau comparatif fait 620 px de large minimum ; à 390 px il défile **dans** son
`.table-defilante` et la page, elle, ne déborde pas (`scrollWidth` = 390).

### Encre

Toutes les surfaces claires de la page sont dans une section **claire** (`.section`), pas dans une
section sombre : le piège du blanc sur blanc ne se pose pas ici et aucune `.carte-claire` n'était
requise. Vérifié quand même au `getComputedStyle` : fond `rgb(255,255,255)`, encre `rgb(10,10,10)`
sur les trois premières cartes, aux quatre largeurs.

### J'ai regardé la page

Captures pleine page à 1280 px et 390 px, ouvertes et lues. Deux défauts vus à l'œil et corrigés :

1. **Premier rendu tout noir, cartes blanches à encre blanche.** C'était mon banc, pas le gabarit :
 j'avais inliné `regime-noir.css`, que `construire.mjs:729` n'injecte que si `p.noir` est vrai.
 Banc corrigé, rendu refait.
2. **La carte du livre blanc était une `.ligne-liste`** : à 390 px, « MARIA (Multi-Agent Regulatory
 Intelligence Architecture) » se cassait sur cinq lignes dans une colonne de ~60 px, coincée entre
 l'icône et le bouton : `.ligne-liste` est un flex sans `flex-wrap` et n'a aucune règle mobile
 (`composants.css:485-487`). Remplacée par une `.carte p32`, qui reprend la composition de la carte
 « Dernier article ».

---

## 7. Ce qui reste à arbitrer

1. **« 30+ appels LLM » contre « over 200 » du papier** (§4.2). La maquette porte 30+.
2. **Six entrées dans `resNav`** au lieu de cinq, pour que « Recherche » puisse être active.
3. **Inscrire `23-research.html` dans `PAGES`** et lui écrire une fiche dans `commun/seo.json`.
4. **Le mur de logos** de la page réelle : à sourcer si on le veut.
5. **Les deux chercheuses fictives** restent débranchées des deux côtés. Rien à faire, sauf décider
 de nettoyer `research.ts:79-82` et `construire.mjs:58-59` côté cleo-landing.
