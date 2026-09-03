# RÉFUTATION — les cartes de l'équipe (`02-entreprise`)

Vérificateur adverse, 27/08/2026. Lecture seule sur `pages/`, `commun/`, `sortie/`, `*.mjs`.
Aucun script du générateur lancé. Scripts jetables dans
`/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-refute/`.

## Verdict : **RÉFUTÉ** sur la clause centrale

L'affirmation est une conjonction de quatre choses. Trois tiennent. La quatrième,
« **les cinq cartes de l'équipe sont désormais alignées** », est fausse au pixel :
elles l'étaient **avant** le correctif, elles ne le sont **plus** après.

| Clause | Verdict |
|---|---|
| 3 pilules de remplissage retirées | **tient** |
| leurs 3 `div` conteneurs vides retirés | **tient** |
| les 12 px retirés sur ces 3 cartes seulement | **tient** |
| **les 5 cartes sont désormais alignées** | **RÉFUTÉ — écart mesuré 40,00 px** |
| aucun contenu inventé | **tient** |

---

## La mesure qui casse l'affirmation

Distance verticale entre le haut du nom (`div.t-h2`) et le haut de sa carte,
`sortie/02-entreprise.html` ouvert en `file://`, viewport 1440×1000.
L'état « avant » est reconstitué **en mémoire dans le navigateur** (réinsertion de la
pilule et du `margin-bottom:12px` par DOM) — aucune écriture disque.

| Carte | AVANT | APRÈS (livré) |
|---|---|---|
| Anaëlle Guez | 335,08 px | 335,08 px |
| Naomie Halioua | 335,08 px | 335,08 px |
| Alexandre Bloch | 335,08 px | **375,08 px** |
| Darcial Mondjo | 335,08 px | **375,08 px** |
| Thezi Mabuza | 335,08 px | **375,08 px** |
| **écart max** | **0,00 px** | **40,00 px** |

`.g3` rend `332px 332px 332px`. La **rangée 1** contient Anaëlle, Naomie **et**
Alexandre : le décalage de 40 px est côte à côte, dans le même regard.

### Pourquoi 40 et pas 12

Le bloc d'identité est `position:absolute;bottom:20px` — il grandit **vers le haut**.
Retirer la pilule retire donc, pour ces trois cartes :

```
12 px (margin-bottom du rôle) + 28,0 px (hauteur mesurée de la rangée de pilules) = 40 px
```

`rapports/f-equipe.md` annonçait « un résidu de 12 px » et le correctif a supprimé ces
12 px. Le diagnostic ratait les 28 px de la rangée de pilules elle-même. Résultat :
le correctif n'a pas fermé une gouttière de 12 px, il a **agrandi** l'écart de 28 à 40 px.

### Oracle indépendant : le pixel de la capture livrée

`captures/02-entreprise-1.png` (820 px de large, produite à 11:50, donc **après** le
correctif ; `capturer.mjs:9` capture à 1280 px, soit 3 colonnes). Première ligne de
pixels quasi-blancs (le nom) dans la bande basse de la rangée 1 :

| Carte | y dans la capture |
|---|---|
| Anaëlle Guez | 845 |
| Naomie Halioua | 844 |
| **Alexandre Bloch** | **869** |

24–25 px d'écart à l'échelle 820/1280 = **≈ 39 px** à 1280. Le DOM et le pixel de
l'artefact livré disent la même chose. **J'ai regardé l'image** : « Alexandre Bloch »
tombe visiblement plus bas que ses deux voisines.

### Bornes du défaut

| Largeur | colonnes | écart visible dans une rangée |
|---|---|---|
| 1920 / 1600 / 1440 / 1280 | 3 | **40,0 px** |
| 1024 / 834 | 2 | 0,0 px |
| 600 / 390 | 1 | 0,0 px |

Sous 1280, les cartes sans pilule ne voisinent jamais une carte à pilules : rien ne se
voit. Le défaut est **desktop uniquement** — et c'est exactement la largeur de capture.

### La lecture indulgente, examinée puis écartée

On peut dire que le **bas** du bloc d'identité, lui, est aligné : `blocBottom` tombe à
20 px du bas de la carte sur les cinq. C'est vrai, et c'est le seul sens où le mot
« alignées » survit. Mais ce n'est pas ce qu'un œil lit : ce qu'on lit, c'est la ligne
du nom, et elle est à deux hauteurs différentes dans une même rangée. Retenu comme
nuance, pas comme sauvetage.

---

## Ce que je n'ai PAS réussi à casser

### Aucun contenu inventé — vérifié caractère par caractère

Diff intégral contre la sauvegarde d'origine
(`…/b2f63723-…/scratchpad/02-entreprise.avant.html`, md5 `65ed979e…`, 237 lignes)
vers `pages/02-entreprise.html` (md5 `c498c60e…`, 228 lignes) :
**trois hunks, rien d'autre dans tout le fichier**. Chacun retire 4 lignes et en
réécrit une, à l'identique moins `;margin-bottom:12px`. **Zéro ligne ajoutée, zéro mot
de contenu écrit.** Ni rôle, ni spécialité, ni parcours n'a été inventé pour Alexandre
Bloch, Darcial Mondjo ou Thezi Mabuza.

Les cinq cartes, mot pour mot dans `sortie/02-entreprise.html`, chacune apparaissant
exactement une fois :

- Anaëlle Guez — CEO, cofondatrice — pilules `Droit`, `Ex Havas Group` ✅ gardées
- Naomie Halioua — CDO, cofondatrice — pilules `Systèmes multi-agents`, `Polytechnique` ✅ gardées
- Alexandre Bloch — Équipe Cleo
- Darcial Mondjo — Expert réglementaire
- Thezi Mabuza — Experte réglementaire

Les 4 pilules `pilule-contour` du bloc équipe encore présentes sont exactement ces
quatre-là, et aucune autre.

### « à préciser » : zéro dans le site

`grep -rl 'préciser'` sur tout le chantier → **2 fichiers, aucun n'est le site** :
`PLAN.md` et `rapports/f-equipe.md` (documents de méthode). `pages/` : 0. `sortie/` : 0.
`sortie/02-entreprise.html` : `'préciser'` compté **0 fois** sur 1 129 211 caractères.

### Balises équilibrées

`pages/02-entreprise.html` passé dans un parseur à pile (`html.parser`, balises vides
SVG/HTML exclues) : **aucune erreur, pile résiduelle vide**. Idem sur le fichier d'avant.
Comptages bruts : `<div>`/`</div>` = 89/89, `<span>`/`</span>` = 22/22.

### Aucun `div` conteneur vide résiduel

Balayage du DOM de la grille `.g3` : les seuls `div` sans enfant ni texte sont les **5
voiles de dégradé** `position:absolute;inset:0` — intentionnels, un par photo. Les trois
conteneurs `display:flex;gap:7px;flex-wrap:wrap` vides ont bien disparu (il n'en reste
que 2 dans le fichier, ceux d'Anaëlle et de Naomie). `bloc.children.length` = 2 sur les
trois cartes corrigées, 3 sur les deux cartes à pilules. **Aucune gouttière fantôme.**

### Les 12 px retirés sur les BONNES cartes

`getComputedStyle(role).marginBottom` mesuré dans le navigateur :

| Carte | margin-bottom |
|---|---|
| Anaëlle Guez | **12px** ✅ gardé |
| Naomie Halioua | **12px** ✅ gardé |
| Alexandre Bloch | 0px |
| Darcial Mondjo | 0px |
| Thezi Mabuza | 0px |

Exactement la répartition annoncée. Aucune sur-portée.

### Faux positifs écartés au passage

- **`wc -l` = 228, pas 229** comme l'annonçait `f-equipe.md`. Ce n'est pas une ligne
  perdue : le fichier finit par `<!--PIED-->\n`, le `diff` est exactement
  `75,78c75 / 87,90c84 / 99,102c93`, et l'écart 237→228 = 9 lignes = 3 × 3. Rien ne manque.
- **La carte lavande** (« Et l'équipe qui encode… ») n'est pas une 6ᵉ carte de personne :
  aucune raison de l'aligner sur les autres. Écartée du périmètre.
- **La cellule sortie/ à jour** : `sortie/02-entreprise.html` porte 11:50, `pages/` 11:45.
  Le build reflète bien le correctif — vérifié en lisant les cinq blocs dans le HTML construit.
- Anaëlle 845 vs Naomie 844 dans la capture : 1 px d'anticrénelage, pas un défaut.

---

## Le correctif qui ferme réellement le trou

Une seule des deux formes, au choix, sur les **trois** cartes sans pilule
(`pages/02-entreprise.html`, lignes 75, 84, 93 — jamais 41 ni 58) :

**A.** rendre au bloc les 40 px qu'il a perdus, sans écrire un mot de contenu :
`style="color:rgba(255,255,255,0.72)"` → `style="color:rgba(255,255,255,0.72);margin-bottom:52px"`
(12 + 28 + 12 = les 40 px de la rangée absente, plus les 12 px d'origine).
Laid dans le source, mais strictement mécanique.

**B.** plus propre : ancrer le bloc par le **haut** du nom plutôt que par le bas.
Remplacer sur les cinq cartes `bottom:20px` par une hauteur de bloc fixe, ou poser un
conteneur `display:flex;flex-direction:column;justify-content:flex-end;min-height:88px`
— 87,58 px est la hauteur mesurée du bloc à pilules. L'alignement devient alors
structurel et ne dépend plus du nombre de pilules.

Je ne touche à rien : lecture seule.
