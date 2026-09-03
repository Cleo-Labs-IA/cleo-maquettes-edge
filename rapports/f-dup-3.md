# F1 — Double attribut `class` — lot F, 3 fichiers

Tâche : fusionner les deux attributs `class` de la `<section>` d'ouverture, le
parseur ne gardant que le premier et jetant le second en silence (la classe de
rembourrage ne s'appliquait donc jamais).

Périmètre : 3 fichiers, aucun autre touché. Ni `construire.mjs`, ni
`capturer.mjs`, ni `verifier.mjs` lancés. `sortie/` non touché.

## Changements

Une occurrence par fichier, toutes à la ligne 3. Trois éditions au total.

```
pages/19-poste.html:3       <section class="sur-sombre gc-deep" class="section-serree">
                         -> <section class="sur-sombre gc-deep section-serree">

pages/21-inscription.html:3 <section class="sur-sombre gc-deep" class="section-hero">
                         -> <section class="sur-sombre gc-deep section-hero">

pages/22-legal.html:3       <section class="sur-sombre gc-deep" class="section-serree">
                         -> <section class="sur-sombre gc-deep section-serree">
```

La classe du second attribut a été **lue** dans chaque fichier, pas présumée :
`section-serree` sur 19 et 22, `section-hero` sur 21. L'ordre d'origine est
conservé (`sur-sombre gc-deep` puis la classe de rembourrage).

Aucune des trois `<section>` ne portait d'attribut `style=` inline sur cette
balise (contrairement à l'exemple du brief) : il n'y avait donc rien à préserver
de ce côté. Le compte de `style=` par fichier est resté identique (11 / 13 / 4),
ce qui le confirme.

Méthode d'édition : remplacement de **chaîne exacte** sur la balise entière, via
un outil qui échoue si la chaîne est absente ou non unique. Aucun calcul
d'index, aucune concaténation de tranches, aucun `sed` sur motif large.

Cible CSS vérifiée avant édition — `commun/base.css` :

```
154  .section-serree{padding:var(--pad-section-courte) 0}
156  .section-hero{padding:var(--pad-hero-haut) 0 var(--pad-hero-bas)}
```

Les deux classes existent bien, les trois pages tombent donc sur une règle
réelle et non sur un sélecteur mort.

## Vérifié

Contrôle demandé, sur chacun des trois fichiers :

```
grep -c 'class="[^"]*"[^>]*class="' <fichier>
```

| fichier | avant | après |
|---|---|---|
| pages/19-poste.html | 1 | **0** |
| pages/21-inscription.html | 1 | **0** |
| pages/22-legal.html | 1 | **0** |

Nombre de lignes strictement inchangé, comme exigé :

| fichier | lignes avant → après | octets avant → après |
|---|---|---|
| pages/19-poste.html | 78 → **78** | 4333 → 4325 (−8) |
| pages/21-inscription.html | 59 → **59** | 3707 → 3699 (−8) |
| pages/22-legal.html | 69 → **69** | 3356 → 3348 (−8) |

Le delta de −8 octets est exactement attendu : la séquence `" class="` (9
caractères) est remplacée par une seule espace. Un écart différent aurait
signalé une perte de contenu.

Comptage de balises, avant → après, identique partout :

| fichier | `<section>` | `</section>` | `<div` | `</div>` |
|---|---|---|---|---|
| pages/19-poste.html | 2 → 2 | 2 → 2 | 24 → 24 | 24 → 24 |
| pages/21-inscription.html | 2 → 2 | 2 → 2 | 14 → 14 | 14 → 14 |
| pages/22-legal.html | 2 → 2 | 2 → 2 | 8 → 8 | 8 → 8 |

Les ouvrantes et fermantes s'équilibrent dans les trois fichiers, avant comme
après. Le compte total de `class=` baisse d'exactement 1 par fichier (25→24,
25→24, 14→13) : un attribut supprimé, un seul, celui visé.

Diff ligne à ligne contre une copie de sauvegarde prise avant toute édition
(`diff avant/<fichier> <fichier>`) : **une seule ligne modifiée par fichier**,
la ligne 3, aucun autre hunk. Sortie brute pour les trois :

```
3c3
< <section class="sur-sombre gc-deep" class="section-serree">
---
> <section class="sur-sombre gc-deep section-serree">
```

(idem pour 21 avec `section-hero`, idem pour 22 avec `section-serree`.)

Contrôle complémentaire, motif plus large que celui demandé, pour attraper un
double `class` séparé par d'autres attributs sur n'importe quelle balise :

```
grep -nE '<[a-zA-Z]+[^>]*\bclass=[^>]*\bclass=' 19-poste.html 21-inscription.html 22-legal.html
→ aucune occurrence
```

Relecture visuelle de la ligne 3 finale des trois fichiers : balise bien formée,
un seul `class`, guillemets appariés, chevron fermant présent.

## Laissé tel quel

- **`sortie/`** — généré, jamais touché. Le rebuild appartient à
  l'orchestrateur ; aucun script de construction, de capture ou de
  vérification n'a été lancé.
- **Les autres fichiers de `pages/` et `commun/`** — hors périmètre assigné.
  Le double `class` existe probablement sur d'autres gabarits du même lot, mais
  ce n'est pas à moi de les corriger.
- **`commun/base.css`** — lu seulement, pour confirmer que
  `.section-serree` et `.section-hero` existent. Aucune modification.
- **Les `clamp()`** — aucun n'a été introduit ni modifié dans ces trois
  fichiers, la règle des espaces obligatoires autour du `+` ne s'applique donc
  à rien ici.
- **Le contenu rédactionnel** — pas une phrase retouchée. Les deux encarts
  « Maquette » (19-poste, 22-legal) qui signalent que l'intitulé de poste et les
  conditions générales sont des gabarits à valider restent en place, ainsi que
  la mention SIREN de 22-legal : ce sont des faits que je ne peux pas vérifier,
  je n'y touche pas et je ne les remplace par rien.
- **La classe `gc-deep` et l'ordre des classes** — conservés tels quels ; la
  tâche portait sur la fusion, pas sur un renommage.
