# F4 — Trois pilules de remplissage retirées (`pages/02-entreprise.html`)

Agent `equipe`. Fichier assigné, et seul fichier touché :
`/Users/naomiehalioua/cleo-maquettes-edge/pages/02-entreprise.html`
(238 lignes → 229 lignes ; md5 avant `65ed979eb2d0a60f81b627f49a148689`).

Règle appliquée : **on retire, on ne remplit pas.** Aucun rôle, aucune spécialité,
aucun parcours n'a été écrit pour Alexandre Bloch, Darcial Mondjo ou Thezi Mabuza.

## Changements

Trois blocs de 3 lignes supprimés — la pilule **et** son conteneur
`<div style="display:flex;gap:7px;flex-wrap:wrap">` devenu vide. Aucune ligne
ajoutée, aucune ligne modifiée : le diff est fait de 9 suppressions et de rien d'autre.

- `pages/02-entreprise.html:76-78` (carte **Alexandre Bloch**)
  `<div style="display:flex;gap:7px;flex-wrap:wrap"> + <span class="pilule pilule-contour t-caption" …>Rôle à préciser</span> + </div>` → *(supprimé)*
- `pages/02-entreprise.html:88-90` (carte **Darcial Mondjo**)
  `<div style="display:flex;gap:7px;flex-wrap:wrap"> + <span class="pilule pilule-contour t-caption" …>Spécialités à préciser</span> + </div>` → *(supprimé)*
- `pages/02-entreprise.html:100-102` (carte **Thezi Mabuza**)
  `<div style="display:flex;gap:7px;flex-wrap:wrap"> + <span class="pilule pilule-contour t-caption" …>Spécialités à préciser</span> + </div>` → *(supprimé)*

Numéros de ligne d'avant l'édition. Après édition, chaque carte se termine sur sa
ligne de rôle : `…:75` Équipe Cleo, `…:84` Expert réglementaire, `…:93` Experte réglementaire.

**Méthode d'édition.** Pas d'`indexOf`/tranches. Chaque `old_string` a été
**construit à partir des lignes du fichier lui-même** (donc exact au caractère près),
ancré sur la ligne de rôle qui précède pour être unique — les blocs Darcial et Thezi
sont deux chaînes identiques, sans cette ancre un `replace` en aurait emporté deux d'un
coup. Trois assertions bloquantes par bloc avant remplacement : la ligne contient
« à préciser », la ligne d'avant est bien le `div` conteneur, la ligne d'après est bien
`</div>`, et la chaîne complète n'apparaît **qu'une fois** dans le document.

## Vérifié

| Contrôle | Avant | Après |
|---|---|---|
| `grep -c 'à préciser'` | 3 | **0** |
| `<div` / `</div>` | 92 / 92 | **89 / 89** (équilibré, −3 de chaque) |
| `<span` / `</span>` | 25 / 25 | **22 / 22** (équilibré, −3 de chaque) |
| `<section>` / `</section>` | 6 / 6 | 6 / 6 |
| `<p>` / `</p>` | 8 / 8 | 8 / 8 |
| pilules `pilule-contour` | 7 | **4** |
| lignes | 238 | 229 (−9 = 3 × 3) |
| `class="…"…class="…"` (doublon d'attribut) | 0 | 0 |
| `clamp()` sans espaces autour du `+` | 0 | 0 (aucun `clamp` touché) |

- **Diff ligne à ligne** contre une copie du fichier d'origine : exactement
  `76,78d75`, `88,90d84`, `100,102d93`. Aucune addition, aucune modification,
  aucune ligne voisine déplacée.
- **Les 4 pilules restantes**, relues une par une : `Droit`, `Ex Havas Group`
  (Anaëlle Guez), `Systèmes multi-agents`, `Polytechnique` (Naomie Halioua).
  Intactes, comme demandé — ce sont de vraies informations.
- **Les 3 cartes relues en entier après édition** : image, dégradé, badge pays
  (Alexandre), nom en `t-h2` et rôle en `t-sm` tous présents et fermés.
- Faux positifs écartés au passage : un comptage large de `<li` attrapait le `<line>`
  d'un SVG et `<p` attrapait deux `<path>` ; comptés strictement, `li` et `p` sont
  équilibrés avant comme après.
- Aucun script du générateur lancé (`construire.mjs`, `capturer.mjs`, `verifier.mjs`
  restent à l'orchestrateur). `sortie/` non touché.
- Sauvegarde du fichier d'origine :
  `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/b2f63723-bbd9-4e6c-bd21-a258f3d96771/scratchpad/02-entreprise.avant.html`

## Laissé tel quel

- **Les pilules d'Anaëlle Guez et de Naomie Halioua** — hors périmètre, vraies infos.
- **Les noms et les rôles des trois cartes** (« Équipe Cleo », « Expert réglementaire »,
  « Experte réglementaire ») : vrais, toujours affichés.
- **⚠️ Un résidu à arbitrer, non corrigé parce que non assigné.** La ligne de rôle des
  trois cartes porte `margin-bottom:12px`, qui servait à espacer le rôle des pilules.
  Les pilules parties, ces 12 px restent sous le dernier élément visible. Le conteneur
  `position:absolute;bottom:20px` établit un contexte de formatage : la marge ne
  s'échappe pas, donc le bloc nom+rôle de ces trois cartes remonte de 12 px par rapport
  aux deux cartes qui ont encore des pilules. C'est petit, mais c'est exactement la
  gouttière que le correctif voulait éviter. **Je ne l'ai pas touché** : la consigne dit
  « le reste de la carte est conservé tel quel ». Si tu veux le fermer, le changement
  est d'un mot, trois fois, en chaîne exacte :
  `style="color:rgba(255,255,255,0.72);margin-bottom:12px"` →
  `style="color:rgba(255,255,255,0.72)"` — **uniquement** sur les lignes 75, 84 et 93
  (Alexandre, Darcial, Thezi), surtout pas sur les cartes d'Anaëlle et de Naomie qui
  ont encore leurs pilules.
- **Rien n'a été inventé.** Aucune correction de cette tâche n'a demandé d'écrire un
  fait invérifiable ; il n'y a donc rien d'autre à signaler de ce côté.
