# Agent 05 — retrait des font-size inline

Fichiers traités :
- `pages/13-glossaire.html`
- `pages/10-ressources.html`

Occurrences `font-size` inline trouvées au départ (grep) : **13** (9 + 4).
Occurrences retirées : **13**. Laissées volontairement : **0**.

---

## Changements

### pages/13-glossaire.html

Les 9 liens « Lire la définition » des cartes de terme. Aucun ne portait de classe
d'échelle, donc `.t-caption` est posée (0.875rem → 14 px → t-caption, qui rend 12 px
en épure). `color:var(--c-signal)` est conservé (couleur voulue, elle doit gagner sur
le `color:var(--c-text-3)` de la classe) et `font-weight:600` est conservé aussi :
`.t-caption` pose `font-weight:400`, donc le 600 n'est pas une répétition, c'est une
intention.

```
13-glossaire.html:30  <span style="color:var(--c-signal);font-size:0.875rem;font-weight:600">
                   -> <span class="t-caption" style="color:var(--c-signal);font-weight:600">
13-glossaire.html:33  idem  0.875rem retiré -> .t-caption
13-glossaire.html:36  idem  0.875rem retiré -> .t-caption
13-glossaire.html:39  idem  0.875rem retiré -> .t-caption
13-glossaire.html:42  idem  0.875rem retiré -> .t-caption
13-glossaire.html:45  idem  0.875rem retiré -> .t-caption
13-glossaire.html:48  idem  0.875rem retiré -> .t-caption
13-glossaire.html:51  idem  0.875rem retiré -> .t-caption
13-glossaire.html:54  idem  0.875rem retiré -> .t-caption
```

### pages/10-ressources.html

Titre de la ligne « rencontre » : l'élément portait DÉJÀ `class="t-h2"` et un inline
`font-size:1.125rem` qui ne faisait que doubler la classe. Le font-size est retiré,
rien n'est ajouté : la classe reprend la main (règle 2).

```
10-ressources.html:27  <div class="t-h2" style="font-size:1.125rem;margin-bottom:4px">
                    -> <div class="t-h2" style="margin-bottom:4px">
```

Les 3 liens « Lire la définition » du bloc Glossaire. Ils portent `class="lien"`, qui
n'est PAS une classe d'échelle : vérifié dans `commun/composants.css`, il n'existe
aucun sélecteur `.lien` nu ; le seul `.lien` qui pose une taille est
`.res-carte .lien` (ligne 469), et ces spans sont dans `.terme-carte`, pas dans
`.res-carte`. Donc `.t-caption` est ajoutée à côté de `lien`.

```
10-ressources.html:75  <span class="lien" style="color:var(--c-signal);font-size:0.875rem;font-weight:600">
                    -> <span class="lien t-caption" style="color:var(--c-signal);font-weight:600">
10-ressources.html:81  idem  0.875rem retiré -> .t-caption ajoutée
10-ressources.html:87  idem  0.875rem retiré -> .t-caption ajoutée
```

---

## Laissé tel quel

- **`font-weight:600` sur les 12 liens « Lire la définition »** (9 + 3) : conservé.
  `.t-caption` déclare `font-weight:400` (base.css:135), le 600 n'est donc pas une
  répétition de la classe posée mais un poids voulu sur un lien.
- **`color:var(--c-signal)` sur ces mêmes 12 liens** : conservé, ce n'est pas de la
  typographie d'échelle et il doit gagner sur le `color:var(--c-text-3)` de
  `.t-caption`.
- **`margin-bottom:4px` (10-ressources:27)**, `margin:0`, `flex:none`, `align-self`,
  `padding-*`, `display:flex` et les autres inline non typographiques : conservés,
  aucun `style=` n'est devenu vide, aucun attribut `style` n'a été supprimé.
- **Pastilles d'icône `width`+`height`+`font-size`** : aucune dans mes deux fichiers,
  donc rien à protéger de ce côté.
- **`class="lien"` sur les spans de 10-ressources** : gardée telle quelle, elle porte
  un comportement (couleur sur fond sombre via `.sur-sombre .res-carte .lien`,
  et l'intention de style du composant), pas une taille.
- Aucun fichier hors périmètre touché : ni `sortie/`, ni `commun/*.css`, ni
  `commun/vignettes.html`.

## Contrôles passés

- `grep -c font-size` sur les deux fichiers : `0` et `0`.
- Comptage de balises inchangé avant/après (`<section>/</section>` 2/2 et 2/2,
  `<div>/</div>` 26/26 et 29/29, `<span>/</span>` 15/15 et 10/10, `<a>/</a>` 10/10 et
  10/10) : aucune section ni en-tête emporté.
- Nombre de lignes inchangé (63 et 96).
- Toutes les éditions sont des remplacements chaîne exacte contre chaîne exacte,
  aucun découpage par index.
- Aucun `clamp()` écrit (donc aucun risque d'espaces manquants autour du `+`) : les
  seules valeurs rencontrées étaient des rem simples.
- `construire.mjs` / `capturer.mjs` / `verifier.mjs` NON lancés, comme demandé.

font-size inline restants dans mes fichiers : 0
