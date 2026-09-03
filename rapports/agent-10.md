# Agent 10 — font-size inline retirés

Fichiers traités :
- `/Users/naomiehalioua/cleo-maquettes-edge/pages/20-campagne.html` (4)
- `/Users/naomiehalioua/cleo-maquettes-edge/pages/18-recrutement.html` (4)
- `/Users/naomiehalioua/cleo-maquettes-edge/pages/15-evenements.html` (1)
- `/Users/naomiehalioua/cleo-maquettes-edge/commun/pied.html` (2)

11 déclarations `font-size` inline repérées au grep, 11 traitées, **0 restante**.
Numéros de ligne = ceux d'AVANT édition ; aucun fichier n'a changé de nombre de
lignes (99 / 89 / 96 / 137, vérifié par assertion pendant le remplacement).
Aucun `style=""` vide laissé derrière.

## Changements

pages/20-campagne.html:17  `<h1 class="t-hero" style="font-size:clamp(2.25rem, 4.6vw, 3.25rem)">` -> `<h1 class="t-hero">` (classe d'échelle déjà présente, style vidé, attribut supprimé — 52 px -> 49 px)
pages/20-campagne.html:35  `<div style="font-size:1.5rem;font-weight:700;letter-spacing:-0.03em;line-height:1.12;">` -> `<div class="t-h1" style="font-weight:700;letter-spacing:-0.03em;line-height:1.12;">` (24 px -> 24 px, titre du livre de couverture)
pages/20-campagne.html:48  `<div style="font-size:0.8125rem;line-height:1.5;color:var(--c-ink)">` -> `<div class="t-caption" style="line-height:1.5;color:var(--c-ink)">` (13 px -> 12 px, verbatim cité dans la carte flottante)
pages/20-campagne.html:51  `<div style="font-size:0.75rem;margin-top:7px;color:var(--c-blue);font-weight:600">` -> `<div class="t-caption" style="margin-top:7px;color:var(--c-blue);font-weight:600">` (12 px -> 12 px, « Art. 6, §1 »)
pages/18-recrutement.html:55  `<div class="t-h2" style="font-size:1.0625rem;margin-bottom:5px">` -> `<div class="t-h2" style="margin-bottom:5px">` (classe d'échelle déjà présente ; 17 px -> 18 px, « Juriste, encodage réglementaire »)
pages/18-recrutement.html:63  idem (« Ingénieur logiciel, moteur de règles »)
pages/18-recrutement.html:71  idem (« Responsable de comptes clients »)
pages/18-recrutement.html:79  idem (« Candidature spontanée »)
pages/15-evenements.html:45  `<div class="t-h2" style="font-size:1.0625rem">` -> `<div class="t-h2">` (classe d'échelle déjà présente, style vidé, attribut supprimé ; 17 px -> 18 px)
commun/pied.html:123  `<div style="font-size:1.0625rem;font-weight:600;line-height:1.32;margin-bottom:16px">` -> `<div class="t-body-lg" style="font-weight:600;line-height:1.32;margin-bottom:16px">` (17 px -> 16 px, accroche de l'infolettre)
commun/pied.html:127  `<div style="font-size:0.6875rem;text-align:center;margin-top:9px;opacity:0.6">` -> `<div class="t-label" style="text-align:center;margin-top:9px;opacity:0.6">` (11 px -> 10 px, phrase de consentement — **à regarder, voir la note ci-dessous**)

## Laissé tel quel

- **Aucun `font-size` inline conservé** dans mes quatre fichiers. Les 11 sont retirés.
- **`font-weight` conservés, jamais redondants** : `700` ligne 35 de `20-campagne` (`.t-h1` pose `400`), `600` ligne 51 (`.t-caption` pose `400`), `600` ligne 123 de `pied.html` (`.t-body-lg` pose `400`). Aucun cas de `font-weight` répétant la classe posée ne s'est présenté.
- **Toutes les autres propriétés inline conservées** : `margin-*`, `color`, `line-height`, `letter-spacing`, `text-align`, `opacity`. Deux `style=` devenus vides (`20-campagne:17`, `15-evenements:45`) : attribut supprimé entier, pas laissé en `style=""`.
- **`pied.html:120`** `<span style="width:6px;height:6px;border-radius:50%;…">` : pastille (width + height), non touchée. Elle ne portait d'ailleurs aucun `font-size`.
- **`pied.html:108` et `20-campagne.html:5, 86`** `<img style="height:24px;width:auto;filter:…">` : dimension d'image, pas de typographie. Non touchées.
- **`pied.html:109, 112-113, 116-117`** (`t-sm`, `t-micro`) et **`pied.html:131` (`.pied-bas`)**, **`15-evenements`** (`.titre`, `.etiquette`, `.pilule`, `.t-caption`), **`18-recrutement:82`** (`.btn-sm`) : la taille vient déjà d'une classe CSS, rien d'inline à retirer. Hors périmètre.
- **Aucun `.css` modifié**, aucun fichier de `sortie/`, ni `commun/vignettes.html`, ni aucun fichier hors de mes quatre.
- **Aucune découpe par index de chaîne** : remplacement exact chaîne contre chaîne, avec assertion du nombre d'occurrences attendu (4/4/1/1/1/4/1/1/1/1/1) et contrôle que le nombre de lignes n'a pas bougé. Aucun `clamp()` écrit — uniquement supprimé.

## Trois points de cascade vérifiés (pour l'orchestrateur)

1. **`20-campagne.html:35`, titre du livre.** `.t-h1` pose `color:var(--c-ink)` (encre sombre) et le livre est sur champ profond. Pas de régression : `.couverture .livre *{color:#fff}` (`composants.css:552`, spécificité 0,2,0) l'emporte sur `.t-h1` (0,1,0). Le titre reste blanc.
2. **`pied.html:123`, accroche de l'infolettre.** `.t-body-lg` pose `color:var(--c-text-2)` (sombre). Pas de régression : `.infolettre *{color:var(--c-text-on-dark)}` (`composants.css:429`) a la même spécificité (0,1,0) mais est déclaré APRÈS `base.css:134` dans la concaténation (`construire.mjs:306-307`, base puis composants). Le texte reste blanc.
3. **`pied.html:127` — LE POINT À REGARDER, il est sur les 25 pages.** J'ai suivi la table (`0.6875rem` -> `.t-label`), mais `.t-label` ne pose pas qu'une taille : il pose aussi `text-transform:uppercase`, `letter-spacing:0.13em` et `font-weight:600`. La phrase « En vous inscrivant, vous acceptez notre politique de confidentialité. » passe donc **en capitales espacées**, sur environ trois lignes dans un encart de 300 px. Couleur : correcte, `.pied` ne cible pas `.t-label`, donc `.infolettre *` gagne et le texte reste blanc à `opacity:0.6`, lisible.
   **Si le rendu déplaît**, l'alternative n'est PAS un simple échange de classe : passer à `.t-caption` ferait gagner `.pied .t-caption{color:var(--c-text-on-dark-3)}` (`composants.css:420`, spécificité 0,2,0) sur `.infolettre *` (0,1,0), soit `rgba(255,255,255,0.38)` multiplié par l'`opacity:0.6` inline ≈ 0,23 d'alpha sur champ profond, contraste ≈ 1,7:1, illisible. Il faudrait alors **retirer aussi l'`opacity:0.6` inline** :
   `<div class="t-caption" style="text-align:center;margin-top:9px">` — 12 px, casse normale, alpha 0,38 comme toutes les autres légendes du pied. Un mot et je le passe.

font-size inline restants dans mes fichiers : 0
