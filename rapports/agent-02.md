# Agent 02 — retrait des font-size inline

Fichiers traités :
- `/Users/naomiehalioua/cleo-maquettes-edge/pages/01-accueil.html`
- `/Users/naomiehalioua/cleo-maquettes-edge/construire.mjs` (gabarit CTA seulement)

12 déclarations `font-size` inline trouvées, 12 retirées. Numéros de ligne = position
avant édition (le fichier n'a pas changé de nombre de lignes).

## Changements

pages/01-accueil.html:103  `<div style="font-size:0.8125rem;line-height:1.55;color:var(--c-text)">` -> `<div class="t-caption" style="line-height:1.55;color:var(--c-text)">`
  13 px -> .t-caption (12 px en épure). `line-height:1.55` et `color:var(--c-text)` gardés : voulus, la carte est sur fond blanc et le texte doit rester au niveau corps, pas gris tertiaire.

pages/01-accueil.html:124  `<h3 class="t-h2" style="font-size:1.5rem;margin-bottom:16px">` -> `<h3 class="t-h2" style="margin-bottom:16px">`
  Classe d'échelle déjà présente : rien ajouté, .t-h2 reprend la main (24 px -> 18 px). `margin-bottom` gardé.

pages/01-accueil.html:138  `<h3 class="t-h2" style="font-size:1.5rem;margin-bottom:16px">` -> `<h3 class="t-h2" style="margin-bottom:16px">`
  Idem (carte « Research »).

pages/01-accueil.html:152  `<h3 class="t-h2" style="font-size:1.5rem;margin-bottom:16px">` -> `<h3 class="t-h2" style="margin-bottom:16px">`
  Idem (carte « Réglementation »).

pages/01-accueil.html:219  `<b style="font-size:1.5rem;letter-spacing:-0.03em">60</b>` -> `<b class="t-h1" style="letter-spacing:-0.03em">60</b>`
  24 px -> .t-h1. `letter-spacing:-0.03em` gardé (serré voulu sur le chiffre, la classe pose -0.01em). La couleur reste blanche : `.verre-legora b{color:#fff}` (spécificité 0,1,1) l'emporte sur `.t-h1`.

pages/01-accueil.html:223  `<b style="font-size:1.5rem;letter-spacing:-0.03em">2 812</b>` -> `<b class="t-h1" style="letter-spacing:-0.03em">2 812</b>`
  Idem.

pages/01-accueil.html:227  `<b style="font-size:1.5rem;letter-spacing:-0.03em">0</b>` -> `<b class="t-h1" style="letter-spacing:-0.03em">0</b>`
  Idem.

pages/01-accueil.html:231  `<div style="margin-top:28px;…;color:#fff;font-weight:500;font-size:0.9375rem">` -> `<div class="t-body" style="margin-top:28px;display:flex;align-items:center;gap:9px;color:#fff;font-weight:500">`
  15 px -> .t-body. `font-weight:500` gardé (la classe pose 400, le 500 est voulu sur ce lien « Lire le cas »). `color:#fff` gardé : le bloc est sur photographie.

pages/01-accueil.html:255  `<blockquote class="citation" style="margin:0 0 32px;font-size:clamp(1.0625rem, 1rem + 0.55vw, 1.3125rem);line-height:1.62;font-weight:400">` -> `<blockquote class="citation" style="margin:0 0 32px;line-height:1.62;font-weight:400">`
  Seul le font-size est retiré, aucune classe ajoutée : `.citation` est déjà la classe typographique de la citation et elle porte l'échelle épurée (`composants.css:755` -> 1.0625rem, 17 px). Elle est déclarée après base.css, donc poser `.t-body-lg` n'aurait rien changé au rendu tout en créant un doublon. `line-height:1.62` et `font-weight:400` gardés tels quels.

pages/01-accueil.html:262  `<a href="06-cas-client.html" style="…;color:var(--c-blue);font-weight:500;font-size:0.9375rem">` -> `<a href="06-cas-client.html" class="t-body" style="margin-top:28px;display:inline-flex;align-items:center;gap:8px;color:var(--c-blue);font-weight:500">`
  15 px -> .t-body. `font-weight:500` et `color:var(--c-blue)` gardés (lien, voulus).

pages/01-accueil.html:332  `<h2 class="t-display" style="font-size:clamp(1.75rem,1.2rem + 1.8vw,2.5rem)">` -> `<h2 class="t-display">`
  Classe d'échelle déjà présente. Le style= ne contenait que le font-size : attribut supprimé entier. (Ce clamp avait en plus des virgules sans espace, il disparaît avec la déclaration.)

construire.mjs:233  `<h2 class="t-display" style="font-size:clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)">` -> `<h2 class="t-display">`
  Gabarit `const CTA` uniquement, dans la chaîne HTML. Classe d'échelle déjà présente, style= devenu vide donc supprimé. Rien d'autre touché dans le script ; `node --check construire.mjs` passe.

## Laissé tel quel

- `construire.mjs:232` — `<div class="t-caption" style="margin-bottom:10px">` du même bloc CTA : aucun font-size inline, la classe d'échelle est déjà en place. Rien à faire.
- `pages/01-accueil.html:331` — `<div class="t-sm" style="margin-bottom:10px">` : aucun font-size inline. `.t-sm` n'est pas dans l'échelle canonique mais je ne pose pas de classe là où il n'y a rien à retirer (hors mandat).
- `pages/01-accueil.html:36` (`class="centre t-micro"`) et `:191` (`class="t-micro"`) — `.t-micro` hors échelle canonique, mais aucun font-size inline : hors mandat.
- Aucune pastille d'icône (`style=` posant à la fois `width` et `height` avec un `font-size`) dans mes deux fichiers : rien de ce type à préserver.
- `.citation` : voir ci-dessus, classe conservée sans ajout de classe d'échelle.
- Les couleurs, marges, `line-height`, `letter-spacing` et `font-weight` inline listés ci-dessus : tous conservés, aucun n'était une simple répétition de la classe posée (les `font-weight:500` diffèrent du 400 des classes ; le `font-weight:400` du blockquote n'accompagne aucune classe posée par moi).

## Contrôles

- Équilibre des balises sur 01-accueil.html : div 93/93, section 10/10, ul 6/6, p 6/6, h2 4/4, h3 6/6, a 10/10, blockquote 1/1, b 4/4.
- Édition par chaîne exacte contre chaîne exacte, chaque remplacement refusé si le nombre d'occurrences trouvé ne correspondait pas à celui attendu. Aucun découpage par index.
- Aucun clamp() écrit ; les deux clamps touchés ont été supprimés, pas réécrits.
- `node --check construire.mjs` : OK.
- Ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs` n'ont été lancés.

font-size inline restants dans mes fichiers : 0
