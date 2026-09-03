# Agent 03 — retrait des `font-size` inline

Fichier traité : `/Users/naomiehalioua/cleo-maquettes-edge/pages/09-texte.html`

`font-size` inline trouvés au départ : **9** — 6 typographiques (corrigés), 3 pastilles d'icône (laissés).

## Changements

Chaque élément portait DÉJÀ une classe de l'échelle. Aucune classe n'a donc été
ajoutée : le `font-size` inline a simplement été retiré pour que la classe
reprenne la main (règle 2 de la méthode).

- `pages/09-texte.html:12`  `<h1 class="t-hero" style="font-size:clamp(2rem, 1.3rem + 2.6vw, 2.875rem);">` -> `<h1 class="t-hero">`
  (46 px inline -> `.t-hero` = 49 px ; le `style=` devenait vide, attribut supprimé)
- `pages/09-texte.html:30`  `<h2 class="t-h1" style="font-size:1.75rem;margin-bottom:22px">` -> `<h2 class="t-h1" style="margin-bottom:22px">`
  (28 px inline -> `.t-h1` = 24 px ; `margin-bottom` conservé)
- `pages/09-texte.html:78`  `<h3 class="t-h1" style="margin:18px 0 14px;font-size:clamp(1.375rem, 1.1rem + 1vw, 1.875rem)">` -> `<h3 class="t-h1" style="margin:18px 0 14px">`
  (28 px inline -> `.t-h1` = 24 px ; `margin` conservé)
- `pages/09-texte.html:92`  `<h3 class="t-h1" style="margin:18px 0 14px;font-size:clamp(1.375rem, 1.1rem + 1vw, 1.875rem)">` -> `<h3 class="t-h1" style="margin:18px 0 14px">`
  (idem)
- `pages/09-texte.html:106` `<h3 class="t-h1" style="margin:18px 0 14px;font-size:clamp(1.375rem, 1.1rem + 1vw, 1.875rem)">` -> `<h3 class="t-h1" style="margin:18px 0 14px">`
  (idem)
- `pages/09-texte.html:218` `<h2 class="t-display" style="font-size:clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)">` -> `<h2 class="t-display">`
  (40 px inline -> `.t-display` = 32 px ; le `style=` devenait vide, attribut supprimé)

Aucun `font-weight` inline redondant n'accompagnait ces six éléments : rien à retirer de ce côté.

## Laissé tel quel

- `pages/09-texte.html:172` `<span style="width:44px;height:44px;…;font-size:1.25rem;margin-bottom:22px">ico:monitoring</span>`
  — pastille d'icône (`width` + `height` posés dans le même `style=`). Exclusion explicite.
- `pages/09-texte.html:178` même pastille, `ico:research`. Exclusion explicite.
- `pages/09-texte.html:184` même pastille, `ico:reglementation`. Exclusion explicite.
- `pages/09-texte.html:205` `<div class="t-sm" style="font-weight:600">Philippine Tamic</div>`
  — pas de `font-size` inline, et le `font-weight` n'accompagne aucune classe posée par cette passe. Hors périmètre.
- Classes hors échelle rencontrées et non touchées : `t-lead` (l.15, 72), `t-sm` (l.28, 134, 141, 148, 155, 174, 180, 186, 205, 217), `t-micro` (l.53, 206), `citation` (l.199), `etiquette` (l.77, 91, 105, 171).
  Elles ne portent aucun `font-size` inline ; la mission ne demandait pas de les remapper sur l'échelle.

## Méthode et vérification

Éditions par remplacement de chaîne exacte (`perl s/\Q…\E/…/`), aucun calcul
d'index, aucun découpage/concaténation de tranches. Aucun `clamp()` écrit —
uniquement des suppressions, donc pas de risque sur les espaces autour du `+`.

Diff contrôlé ligne à ligne : 6 lignes modifiées, aucune autre. Fichier à 231
lignes avant et après, 6 `</section>` avant et après — aucun bloc emporté.

`construire.mjs`, `capturer.mjs` et `verifier.mjs` n'ont pas été lancés.

font-size inline restants dans mes fichiers : 3
