# Agent 04 — retrait des font-size inline

Fichier traité : `pages/04-secteur.html` (seul fichier assigné).

## Changements

- `pages/04-secteur.html:12`  `<h1 class="t-hero" style="font-size:clamp(2rem, 1.3rem + 2.6vw, 2.875rem);">` -> `<h1 class="t-hero">`  (46 px inline retiré ; la classe `.t-hero` reprend la main ; style vide donc attribut supprimé)
- `pages/04-secteur.html:30`  `<h2 class="t-h1" style="font-size:1.75rem;margin-bottom:22px">` -> `<h2 class="t-h1" style="margin-bottom:22px">`  (28 px inline retiré ; `.t-h1` déjà présente, rien d'ajouté ; `margin-bottom` conservé)
- `pages/04-secteur.html:78`  `<h3 class="t-h1" style="margin:18px 0 14px;font-size:clamp(1.375rem, 1.1rem + 1vw, 1.875rem)">` -> `<h3 class="t-h1" style="margin:18px 0 14px">`  (28 px inline retiré ; `.t-h1` déjà présente ; `margin` conservé)
- `pages/04-secteur.html:92`  `<h3 class="t-h1" style="margin:18px 0 14px;font-size:clamp(1.375rem, 1.1rem + 1vw, 1.875rem)">` -> `<h3 class="t-h1" style="margin:18px 0 14px">`  (idem)
- `pages/04-secteur.html:106` `<h3 class="t-h1" style="margin:18px 0 14px;font-size:clamp(1.375rem, 1.1rem + 1vw, 1.875rem)">` -> `<h3 class="t-h1" style="margin:18px 0 14px">`  (idem)
- `pages/04-secteur.html:232` `<h2 class="t-display" style="font-size:clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)">` -> `<h2 class="t-display">`  (40 px inline retiré ; `.t-display` déjà présente ; style vide donc attribut supprimé)

Total : **6 font-size inline retirés**. Aucune classe d'échelle n'a eu besoin d'être
ajoutée : les six éléments portaient déjà une classe de l'échelle (`t-hero`, `t-h1`,
`t-display`), donc la règle 2 s'applique — on retire l'inline, la classe reprend la main.

Aucun `font-weight` inline n'accompagnait ces six éléments : rien à retirer de ce côté.
Aucun `clamp()` n'a été écrit, seulement supprimé (piège des espaces autour du `+` sans objet ici).

## Laissé tel quel

- `pages/04-secteur.html:186` `<span style="width:44px;height:44px;…;font-size:1.25rem;margin-bottom:22px">ico:monitoring</span>`
  — pastille d'icône : le style pose `width` ET `height`. Interdit de toucher.
- `pages/04-secteur.html:192` même pastille pour `ico:research` — `width` + `height`, intouchée.
- `pages/04-secteur.html:198` même pastille pour `ico:reglementation` — `width` + `height`, intouchée.
- `pages/04-secteur.html:219` `<div class="t-sm" style="font-weight:600">Philippine Tamic</div>`
  — pas de `font-size` inline, et le `font-weight` ne double aucune classe posée par moi. Conservé.
- `pages/04-secteur.html:53` `<div class="centre t-micro" style="letter-spacing:0.12em;…">`
  et les `t-sm` / `t-lead` / `t-micro` de la page — aucune taille inline, la classe pilote déjà. Rien à faire.

Soit **3 font-size inline volontairement laissés** (les trois pastilles d'icônes).

## Vérification

Structure intacte après édition : 7 `<section>` / 7 `</section>`, fin de fichier
inchangée (`</section>` + `<!--PIED-->`), 245 lignes. Les six éditions sont des
remplacements de chaîne exacte, sur une seule ligne chacun, avec un compte attendu
vérifié avant écriture (1/1/3/1). Aucun découpage par index. Aucun `.css` touché,
`sortie/` et `commun/vignettes.html` non ouverts.

font-size inline restants dans mes fichiers : 3
