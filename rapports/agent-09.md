# Agent 09 — retrait des font-size inline

Fichiers traités (et eux seuls) :
- `/Users/naomiehalioua/cleo-maquettes-edge/pages/03-offre.html`
- `/Users/naomiehalioua/cleo-maquettes-edge/pages/07-chat.html`
- `/Users/naomiehalioua/cleo-maquettes-edge/pages/08-reglementation.html`

Les trois pages sont bâties sur le même gabarit « feature » : 5 `font-size` inline
chacune, aux mêmes endroits. 15 occurrences vues, 9 retirées, 6 laissées.

## Changements

### pages/03-offre.html
- `03-offre.html:116`  `<h3 class="t-h2" style="font-size:1.5rem;margin-bottom:12px">Research</h3>` -> `<h3 class="t-h2" style="margin-bottom:12px">Research</h3>`
- `03-offre.html:126`  `<h3 class="t-h2" style="font-size:1.5rem;margin-bottom:12px">Réglementation</h3>` -> `<h3 class="t-h2" style="margin-bottom:12px">Réglementation</h3>`
- `03-offre.html:210`  `<h2 class="t-display" style="font-size:clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)">` -> `<h2 class="t-display">`

### pages/07-chat.html
- `07-chat.html:107`  `<h3 class="t-h2" style="font-size:1.5rem;margin-bottom:12px">Research</h3>` -> `<h3 class="t-h2" style="margin-bottom:12px">Research</h3>`
- `07-chat.html:117`  `<h3 class="t-h2" style="font-size:1.5rem;margin-bottom:12px">Réglementation</h3>` -> `<h3 class="t-h2" style="margin-bottom:12px">Réglementation</h3>`
- `07-chat.html:201`  `<h2 class="t-display" style="font-size:clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)">` -> `<h2 class="t-display">`

### pages/08-reglementation.html
- `08-reglementation.html:116`  `<h3 class="t-h2" style="font-size:1.5rem;margin-bottom:12px">Research</h3>` -> `<h3 class="t-h2" style="margin-bottom:12px">Research</h3>`
- `08-reglementation.html:126`  `<h3 class="t-h2" style="font-size:1.5rem;margin-bottom:12px">Réglementation</h3>` -> `<h3 class="t-h2" style="margin-bottom:12px">Réglementation</h3>`
- `08-reglementation.html:210`  `<h2 class="t-display" style="font-size:clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)">` -> `<h2 class="t-display">`

### Deux points de méthode sur ces changements

1. Les six `<h3>` des cartes « Les deux autres features » portaient déjà `.t-h2`.
   L'inline `1.5rem` (24 px) écrasait la classe et rendait un `.t-h2` à la taille
   d'un `.t-h1`. Règle 2 appliquée : on retire l'inline, on ne pose rien de plus,
   la classe `.t-h2` (1.125rem, 18 px) reprend la main. Aucune classe ajoutée,
   aucune classe remplacée. `margin-bottom:12px` conservé.
2. Les trois `<h2>` du CTA final portaient déjà `.t-display`, et l'inline
   `clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)` (40 px) l'écrasait. Retrait de la
   seule déclaration `font-size` : le `style=` devenait vide, l'attribut entier a
   donc été supprimé (règle 4). La classe `.t-display` rend désormais 32 px.
   Aucun clamp n'a été écrit, seulement supprimé — le piège des espaces autour du
   `+` ne s'applique pas ici.

Aucun `font-weight` inline redondant n'a été rencontré sur les éléments touchés
(les deux `font-weight:600` des pages sont sur d'autres éléments, sans `font-size`).

## Laissé tel quel

- `03-offre.html:115` et `:125`, `07-chat.html:106` et `:116`,
  `08-reglementation.html:115` et `:125` —
  `<span style="width:44px;height:44px;border-radius:var(--r-sm);background:rgba(77,87,255,0.14);display:grid;place-items:center;font-size:1.25rem;margin-bottom:24px">`
  (pastilles d'icône `ico:research` et `ico:reglementation`).
  **Raison :** la déclaration pose aussi `width` et `height` — c'est une pastille
  d'icône, pas de la typographie. Interdiction explicite d'y toucher. 6 occurrences.
- Aucun autre `font-size` inline dans ces trois fichiers.
- Les classes hors échelle rencontrées (`t-lead`, `t-sm`, `t-micro`, `citation`,
  `etiquette`, `pilule`, `reponse`) n'ont pas été touchées : elles ne portent
  aucun `font-size` inline, il n'y avait donc rien à retirer, et la consigne ne
  demande pas de les remapper sur l'échelle canonique.
- `commun/*.css`, `commun/vignettes.html`, `sortie/` : hors périmètre, non ouverts
  en écriture.

## Vérification

- Nombre de lignes inchangé dans les trois fichiers (223 / 214 / 223 avant et après) ;
  le `diff` ne montre que des substitutions de ligne, aucune suppression de bloc.
- Édition par correspondance de chaîne exacte (`perl -0777` avec `\Q…\E`), jamais
  par calcul d'index de chaîne.
- `construire.mjs`, `capturer.mjs`, `verifier.mjs` non lancés, comme demandé.
- Sauvegarde des trois fichiers avant édition dans le scratchpad de session.

font-size inline restants dans mes fichiers : 6
