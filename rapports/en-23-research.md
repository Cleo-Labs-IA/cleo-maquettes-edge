# en-23-research, jumeau anglais de la page Research

Fichier créé, un seul :
`/Users/naomiehalioua/cleo-maquettes-edge/pages/23-research-en.html`
Source recopiée :
`/Users/naomiehalioua/cleo-maquettes-edge/pages/23-research.html`

245 lignes de chaque côté, alignement ligne à ligne. Aucun autre fichier
touché. `sortie/` n'a pas été ouvert en écriture. Ni `construire.mjs`, ni
`capturer.mjs`, ni `verifier.mjs` n'ont été lancés.

---

## 1. Le comptage de balises

Mesuré par script sur les deux fichiers (`<[a-zA-Z!/][^>]*>`).

| | français | anglais |
|---|---|---|
| **Balises, total** | **378** | **378** |

Et le détail par nom de balise, les deux colonnes se lisent l'une contre
l'autre :

| balise | fr | en | | balise | fr | en |
|---|---|---|---|---|---|---|
| `div` | 174 | 174 | | `td` | 40 | 40 |
| `span` | 50 | 50 | | `p` | 22 | 22 |
| `h1`/`h2`/`h3` | 18 | 18 | | `svg` | 12 | 12 |
| `sub` | 10 | 10 | | `th` | 10 | 10 |
| `tr` | 10 | 10 | | `path` | 6 | 6 |
| `section` | 4 | 4 | | `a` | 4 | 4 |
| `table` | 2 | 2 | | `thead` | 2 | 2 |
| `tbody` | 2 | 2 | | commentaires | 12 | 12 |

Zéro écart sur chaque ligne.

**Le contrôle qui va plus loin que le comptage.** Un comptage égal peut
cacher deux fichiers différents. J'ai donc comparé les 378 balises **une à
une, dans l'ordre, attributs compris** (le contenu textuel retiré) :

```
DIFFS DE BALISE (attributs compris) : 0
```

Zéro. Pas une classe, pas un `style=`, pas un `data-anim` qui diffère.
C'est un cran au-dessus de l'accueil, qui portait une différence assumée
sur un `alt` ; ici il n'y a aucune image, donc aucun `alt` à traduire, et
la structure est strictement superposable.

Les marqueurs du générateur, comptés séparément :

| marqueur | fr | en |
|---|---|---|
| `<!--NAV-->` | 1 | 1 |
| `<!--RES-NAV:Recherche-->` | 1 | 1 |
| `<!--CTA-->` | 1 | 1 |
| `<!--PIED-->` | 1 | 1 |

Les 8 commentaires de section (`<!-- ── Chiffres clés ── -->`, etc.) sont
recopiés **à l'identique, en français** : `diff` des commentaires = vide.
Ce sont des repères d'auteur dans le source, pas du texte rendu.

Les liens et les images :

| | fr | en |
|---|---|---|
| `href` | `#`, `#` | `#`, `#` |
| jeton image/icône | `ico:research` | `ico:research` |

---

## 2. La preuve que les nombres sont identiques

Extraction sur le **texte visible seul** (balisage retiré), puis tri, puis
comparaison de multiensemble. 29 nombres de chaque côté :

```
fr : 0 | 1 | 1 200 | 16 | 16 | 16 | 19 | 19 | 19 | 2 | 2 | 20 | 20 + | 2026 |
     2026 | 28 | 3 | 30+ | 30+ | 37 | 37 | 370 | 4 | 4 | 5 | 5 | 8 | 8 | 8
en : 0 | 1 | 1 200 | 16 | 16 | 16 | 19 | 19 | 19 | 2 | 2 | 20 | 20 + | 2026 |
     2026 | 28 | 3 | 30+ | 30+ | 37 | 37 | 370 | 4 | 4 | 5 | 5 | 8 | 8 | 8

jeux identiques (multiensemble) : true
seulement fr : []
seulement en : []
```

Deuxième passe sur les nombres **dans le balisage** (coordonnées SVG,
`padding`, `gap`, `margin`, `viewBox`, `stroke-width`) : 235 de chaque côté,
séquences strictement égales.

Rien n'a été ajouté, rien n'a été perdu. En particulier :

- **370 à 1 200 → 370 to 1 200.** La fourchette du livre blanc, reportée
  telle quelle. Je ne l'ai pas « corrigée » en 420 : la page assume sa
  divergence avec le site, et la traduction n'arbitre pas.
- J'ai gardé **l'espace comme séparateur de milliers** (`1 200`) au lieu de
  passer à `1,200`. Deux raisons : c'est l'usage SI, cohérent avec un texte
  scientifique, et surtout la virgule aurait fait diverger l'extraction des
  nombres, ce qui est exactement le contrôle que ce rapport doit passer.
- `19` régions, `16` secteurs, `8` langues, `30+` analyses, `37` blocs
  (`19` + `2` + `16`), `ε ∈ [0, 28]`, `20 pages` : inchangés.
- `février 2026 → February 2026`. Même mois, même année, nom traduit.
- La formule `S total ≤ (20 + ε) + (C × 4) + 5 · N reg` et `T = Σ max(t ij)`
  / `T ≈ max(Σ t ij)` : recopiées caractère pour caractère, `sub` compris.

---

## 3. Ce que j'ai laissé en anglais, ou en français, à dessein

**Laissé tel quel, non traduit :**

| élément | pourquoi |
|---|---|
| `<!--RES-NAV:Recherche-->` | Clé interne au générateur. `construire.mjs:517` compare cette chaîne aux libellés d'une liste française (`Tout`, `Rencontres`, `Modèles`, `Publications`, `Glossaire`) pour marquer l'entrée active. `Recherche` n'y figure pas : la nav sort complète et sans actif, ce qui est le comportement voulu. Traduire en `Research` n'aurait rien changé au rendu mais aurait fabriqué une seconde clé pour la même chose. |
| Les 8 commentaires `<!-- ── … ── -->` | Consigne : mêmes commentaires de section. Invisibles au rendu. |
| `MARIA (Multi-Agent Regulatory Intelligence Architecture)` | Nom du livre blanc, déjà anglais des deux côtés. |
| `Naomie Halioua, Alexandre Bloch, Anaelle Guez`, `Cleo Labs`, `Cleo` | Noms propres. |
| `LLM`, `Pipeline`, `GRC`, `Batch`, `Streaming` | Déjà en anglais dans la source française, et termes techniques. |
| `ico:research`, `href="#"` | Jetons du générateur et liens. |

**Traduit, avec le choix explicité quand il n'allait pas de soi :**

| français | anglais | note |
|---|---|---|
| La science derrière l'intelligence. | The science behind the intelligence. | Le titre de la page. |
| Dernier article / Article de recherche | Latest paper / Research paper | `article` ici veut dire publication scientifique, pas billet de blog. |
| La chaîne en cinq étapes / Étape 1…5 | The chain in five stages / Stage 1…5 | |
| Scorer / Enrichir / Évaluer | Score / Enrich / Assess | Les cinq verbes du pipeline. |
| sévérité × probabilité | severity × likelihood | Le `×` est conservé, ce n'est pas un `x`. |
| Non | No | Les quatre lignes du tableau comparatif. |
| Infrastructure de recherche | Search infrastructure | **Piège** : ici `recherche` = requête web, pas `research`. La section parle de « centaines de recherches ciblées ». Traduire par `Research infrastructure` aurait dit autre chose. |
| Au-delà de la recherche par mots-clés | Beyond keyword search | Même mot, même sens `search`. |
| Combler le vide du marché | Filling the market gap | |
| Spécifique à l'entreprise · Proactif | Company-specific · Proactive | Les quatre quadrants. |
| IA juridique / Automatisation conformité | Legal AI / Compliance automation | Catégories de marché, pas des noms d'offre Cleo. |
| transverses | cross-cutting | Les 2 blocs réglementaires non géographiques et non sectoriels. |
| Télécharger le livre blanc | Download the white paper | Les deux boutons. |

Un mot sur **`matrice de risque → risk matrix`** : le vocabulaire du risque
est normalement écarté de la copie Cleo. Ici c'est un terme technique du
livre blanc, présent dans la source française. La traduction reporte, elle
n'édite pas la source.

---

## 4. Les garde-fous, vérifiés un par un

| garde-fou | fr | en |
|---|---|---|
| 1. Élément à deux attributs `class` | 0 | **0** |
| 2. Grille en `style=` inline (`grid-template`) | 0 | **0** |
| 3. `font-size` en `style=` inline | 0 | **0** |
| 4. Surface claire en section sombre sans `.carte-claire` | sans objet | **sans objet** |
| 5. Tiret cadratin U+2014 / demi-cadratin U+2013 | 0 | **0** |
| 5. Emoji | 0 | **0** |
| 5. Monospace | non | **non** |
| 6. `construire.mjs` / `capturer.mjs` / `verifier.mjs` lancés | sans objet | **non** |

Sur le point 4 : la seule section sombre est le bandeau de titre
(`sur-sombre gc-deep`), qui ne contient qu'un `h1` et un `p`, aucune
surface claire. Toutes les `.carte` vivent dans la `section` claire qui
suit. Rien à basculer, dans un fichier comme dans l'autre.

Sur le point 5, les `──` des commentaires de section sont des U+2500
(filet de tableau), pas des cadratins : le compteur les ignore et rend 0.

Et un contrôle de plus, le texte : 122 nœuds de texte visible de chaque
côté, alignés un à un. Aucun accent français ne subsiste dans le fichier
anglais en dehors des 4 commentaires de section, ce qui est vérifié par
grep.

---

## 5. Ce qu'il reste à faire, et que je n'ai pas fait

Le fichier existe, il n'est **pas encore construit**. Deux raisons, toutes
deux volontaires :

1. `construire.mjs` ne connaît pas `23-research-en.html`. La table `PAGES`
   (ligne 16 et suivantes) déclare `23-research.html` mais pas son jumeau ;
   il faudrait y ajouter une entrée `{ fichier: '23-research-en.html',
   titre: 'Research EN', source: 'cleolabs.co/research', en: true }` pour
   que le châssis anglais (`commun/bandeau-nav-en.html`, `commun/pied-en.html`)
   soit branché sur `<!--NAV-->` et `<!--PIED-->`. C'est une modification
   d'un fichier existant : elle passe par un `PLAN.md` et un accord, pas
   par moi de ma propre initiative.
2. La table `JUMEAUX` (ligne 634) ne contient que l'accueil. Tant que
   `23-research-en.html` n'y est pas, la page ne sortira pas de balises
   `hreflang`. Le commentaire du code dit d'ailleurs explicitement qu'on ne
   fabrique pas d'`alternate` vers un fichier qui n'existe pas : maintenant
   il existe, la porte est ouverte.

Tant que ces deux entrées ne sont pas posées, la page est un fragment
correct et complet, mais le générateur ne la voit pas.
