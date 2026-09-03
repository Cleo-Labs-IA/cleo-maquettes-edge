# Tâche F2 — Le mot-symbole blanc sur fond clair

Fichier assigné, et seul fichier touché :
`/Users/naomiehalioua/cleo-maquettes-edge/pages/20-campagne.html`

## Changements

`pages/20-campagne.html:5`  `filter:brightness(0) invert(1)` -> `filter:brightness(0)`

Ligne complète, avant / après :

```
-     <img src="img:cleo-logo" alt="Cleo" style="height:24px;width:auto;filter:brightness(0) invert(1)">
+     <img src="img:cleo-logo" alt="Cleo" style="height:24px;width:auto;filter:brightness(0)">
```

Le reste du `style=` est conservé à l'identique (`height:24px;width:auto;`).
Le logo de `.campagne-tete` passe donc de blanc à noir sur son fond
`rgb(249,248,246)`, mesuré à un écart-type de 2,0 avant correction.

**1 changement au total.**

## Vérifié

Repérage exhaustif avant d'éditer — `grep -n "brightness(0)"` sur le fichier
rend exactement 2 occurrences, ligne 5 (bandeau de tête) et ligne 86 (pied).
Aucune autre occurrence cachée.

Méthode d'édition — remplacement de CHAÎNE EXACTE, jamais de calcul d'index.
Le script d'édition adresse l'index de ligne 5, vérifie par `assert` que la
chaîne cible y est présente ET qu'elle y est unique, puis fait un `.replace()`
sur cette seule ligne. Les 98 autres lignes sont réécrites telles quelles.
Si l'un des deux `assert` avait échoué, le fichier n'aurait pas été touché.

Comptages avant -> après :

| Mesure | Avant | Après |
| --- | --- | --- |
| Lignes | 99 | 99 |
| Octets | 4964 | 4954 |
| Balises ouvrantes `<tag` | 74 | 74 |
| Balises fermantes `</tag` | 62 | 62 |
| `<div` / `</div>` | 47 / 47 | 47 / 47 |
| `<section` / `</section>` | 3 / 3 | 3 / 3 |
| `<img` | 8 | 8 |
| `invert(1)` | 2 | 1 |

L'écart de 10 octets correspond exactement aux 10 caractères de la chaîne
supprimée, `" invert(1)"` (espace compris). Aucun autre octet n'a bougé.

Diff ligne à ligne — une copie du fichier a été faite avant l'édition
(sha1 `c600bb76a7b37bd166ff102c9a5ba698707e28df`) puis comparée avec `diff`.
Sortie complète du diff :

```
5c5
<     <img src="img:cleo-logo" alt="Cleo" style="height:24px;width:auto;filter:brightness(0) invert(1)">
---
>     <img src="img:cleo-logo" alt="Cleo" style="height:24px;width:auto;filter:brightness(0)">
```

Une seule hunk, une seule ligne. Aucune section, aucun en-tête, aucun bloc
n'a été déplacé ni tronqué.

Garde-fou `clamp()` — `grep -c 'clamp('` rend 0 sur cette page : aucune
déclaration `clamp()` n'existe ici, donc aucun risque d'espaces manquants
autour d'un `+`. Rien à vérifier de ce côté.

Aucun build, aucune capture, aucune vérification globale n'a été lancée :
ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs`. `sortie/` n'a pas
été touché.

## Laissé tel quel

**Ligne 86, le logo du pied.** Il conserve `filter:brightness(0) invert(1)`
et reste donc blanc. Il est posé dans `<footer class="pied">`, sur un fond
`rgb(15,14,13)`, et son écart mesuré est de 77,8 : parfaitement lisible.
Sa présence dans le comptage `invert(1) = 1` après correction est la preuve
qu'il n'a pas été touché.

**Les 6 logos clients, lignes 62 à 67** (`.bande-logos`). Aucun `filter`
n'est déclaré dessus dans ce fragment, donc rien de comparable au défaut
traité, et ils sortent du périmètre de la tâche. Non modifiés.

**Tout le reste du fichier.** La tâche portait sur un seul attribut d'une
seule balise ; aucun autre correctif n'a été demandé et je n'en ai introduit
aucun de mon propre chef.

**Rien n'a été bloqué, et aucun contenu n'a été inventé** : le correctif est
purement une suppression de fonction de filtre CSS, il n'ajoute aucun texte
ni aucun fait à la page.
