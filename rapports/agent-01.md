# Agent 01 — font-size inline retirés

Fichier traité : `/Users/naomiehalioua/cleo-maquettes-edge/pages/02-entreprise.html`
19 occurrences `font-size` inline repérées au grep, 19 traitées, 0 restante.
(Numéros de ligne = ceux du fichier AVANT édition ; le nombre de lignes est inchangé, 237.)

## Changements

pages/02-entreprise.html:36  `<span style="font-size:1.05rem">FR</span>` -> `<span class="t-body-lg">FR</span>` (style vidé, attribut supprimé)
pages/02-entreprise.html:37  `<div style="font-size:0.75rem;color:rgba(255,255,255,0.62)">` -> `<div class="t-caption" style="color:rgba(255,255,255,0.62)">`
pages/02-entreprise.html:43  `class="pilule pilule-contour" style="padding:4px 11px;font-size:0.75rem;…;color:#fff"` -> `class="pilule pilule-contour t-caption" style="padding:4px 11px;…;color:#fff"`
pages/02-entreprise.html:44  idem ligne 43 (pilule « Ex Havas Group »)
pages/02-entreprise.html:53  `<span style="font-size:1.05rem">FR</span>` -> `<span class="t-body-lg">FR</span>`
pages/02-entreprise.html:54  `<div style="font-size:0.75rem;color:rgba(255,255,255,0.62)">` -> `<div class="t-caption" style="color:rgba(255,255,255,0.62)">`
pages/02-entreprise.html:60  pilule 0.75rem -> `pilule pilule-contour t-caption`, font-size retiré
pages/02-entreprise.html:61  pilule 0.75rem -> `pilule pilule-contour t-caption`, font-size retiré
pages/02-entreprise.html:70  `<span style="font-size:1.05rem">FR</span>` -> `<span class="t-body-lg">FR</span>`
pages/02-entreprise.html:71  `<div style="font-size:0.75rem;color:rgba(255,255,255,0.62)">` -> `<div class="t-caption" style="color:rgba(255,255,255,0.62)">`
pages/02-entreprise.html:77  pilule 0.75rem (color rgba .7) -> `pilule pilule-contour t-caption`, font-size retiré
pages/02-entreprise.html:89  pilule 0.75rem (color rgba .7) -> `pilule pilule-contour t-caption`, font-size retiré
pages/02-entreprise.html:101 pilule 0.75rem (color rgba .7) -> `pilule pilule-contour t-caption`, font-size retiré
pages/02-entreprise.html:111 `<div style="font-size:1.375rem;line-height:1.28;font-weight:500">` -> `<div class="t-h1" style="line-height:1.28;font-weight:500">`
pages/02-entreprise.html:164 `<span style="font-size:0.875rem;line-height:1.4;color:var(--cleo-ink)">` -> `<span class="t-caption" style="line-height:1.4;color:var(--cleo-ink)">`
pages/02-entreprise.html:168 idem ligne 164 (carte CES Las Vegas)
pages/02-entreprise.html:172 idem ligne 164 (carte MARIA)
pages/02-entreprise.html:176 `<span style="font-size:0.8125rem;color:var(--cleo-ink)">` -> `<span class="t-caption" style="color:var(--cleo-ink)">`
pages/02-entreprise.html:224 `<h2 class="t-display" style="font-size:clamp(1.75rem,1.2rem + 1.8vw,2.5rem)">` -> `<h2 class="t-display">` (classe d'échelle déjà présente, style vidé, attribut supprimé)

## Laissé tel quel

- **Aucun `font-size` inline conservé.** Les 19 ont été retirés, il n'en reste 0 dans le fichier.
- **font-weight:500 ligne 111** conservé : `.t-h1` pose `font-weight:400`, l'inline ne répète donc pas la classe, il l'écarte volontairement (bloc « Et l'équipe » de la carte lavande).
- **Toutes les autres propriétés inline** conservées telles quelles : `color`, `line-height`, `margin-bottom`, `padding`, `border-color`, `position`, `display`, `flex`. Deux attributs `style` devenus vides (lignes 36/53/70 et 224) ont été supprimés entièrement, jamais laissés en `style=""`.
- **Pastilles d'icône lignes 163, 167, 171** (`width:36px;height:36px;…;place-items:center` — `ico:euro`, `ico:cabinet`, `ico:engrenage`) : non touchées. Elles ne portaient d'ailleurs aucun `font-size`, mais elles relèvent de la règle « width + height = pastille, pas de typo ».
- **Classes `.t-sm`, `.t-micro`, `.surtitre`, `.t-lead`, `.mesures .valeur` / `.libelle`** : la taille vient déjà d'une classe CSS, rien d'inline à retirer. Hors périmètre.
- **Aucun fichier `.css` modifié**, aucun fichier de `sortie/`, ni `commun/vignettes.html`.

## Note de rendu (pour l'orchestrateur)

Les pilules portent maintenant `pilule pilule-contour t-caption`. Dans la cascade, `.t-caption` de l'épure (`composants.css:745`, `0.75rem`) est déclaré APRÈS `.pilule` (`composants.css:126`, `0.8125rem`) : le rendu reste donc à 12 px, identique à l'inline retiré. Rien ne grossit.

font-size inline restants dans mes fichiers : 0
