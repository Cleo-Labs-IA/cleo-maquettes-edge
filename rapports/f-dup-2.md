# Rapport F1 — double attribut `class` (agent f-dup-2)

Portée : les 4 fichiers assignés, et eux seuls.
Correctif : fusion des DEUX attributs `class` de la balise `<section>` d'ouverture
en un seul, ordre conservé, `style=` inline laissé intact.

Sur les 4 pages, le second attribut portait la même classe : `section-serree`.
Aucune n'utilisait `section-hero` (lu, pas présumé).

## Changements — 1 par fichier, tous à la ligne 3

pages/14-terme.html:3
  `<section class="sur-sombre gc-deep" class="section-serree">`
  -> `<section class="sur-sombre gc-deep section-serree">`

pages/15-evenements.html:3
  `<section class="sur-sombre gc-deep" class="section-serree" style="padding-bottom:var(--s-64)">`
  -> `<section class="sur-sombre gc-deep section-serree" style="padding-bottom:var(--s-64)">`

pages/16-evenement.html:3
  `<section class="sur-sombre gc-deep" class="section-serree">`
  -> `<section class="sur-sombre gc-deep section-serree">`

pages/18-recrutement.html:3
  `<section class="sur-sombre gc-deep" class="section-serree" style="padding-bottom:var(--s-64)">`
  -> `<section class="sur-sombre gc-deep section-serree" style="padding-bottom:var(--s-64)">`

Total : 4 changements, 4 fichiers.

## Méthode

Remplacement de CHAÎNE EXACTE (`str.replace(vieux, neuf, 1)` en Python), jamais de
découpe par index. Le script refusait d'écrire si la chaîne cible n'apparaissait pas
exactement 1 fois, ou si le nombre de lignes changeait. Copie de sauvegarde des 4
fichiers prise avant écriture (scratchpad de session, dossier `avant/`).

## Vérifié

1. `grep -c 'class="[^"]*"[^>]*class="' <fichier>` = **0** sur les 4 (1 avant, 0 après).
2. Nombre de lignes identique avant/après :
   14-terme 65/65 · 15-evenements 96/96 · 16-evenement 82/82 · 18-recrutement 89/89.
3. Delta d'octets : -8 exactement sur chaque fichier, soit la suppression de `"` + `class="`
   et rien d'autre. Aucun autre caractère perdu.
4. Comptage de balises avant/après, identique partout :
   - `<section` / `</section>` : 14-terme 2/2 · 15-evenements 2/2 · 16-evenement 2/2 · 18-recrutement 3/3
   - `<div` / `</div>` (ouvrantes = fermantes, avant ET après) :
     14-terme 8/8 · 15-evenements 47/47 · 16-evenement 49/49 · 18-recrutement 31/31
5. `diff` ligne à ligne contre la sauvegarde pré-édition : sur chacun des 4 fichiers,
   **une seule ligne modifiée, la ligne 3**, forme `3c3`. Aucune autre différence,
   aucune ligne supprimée, aucun bloc déplacé.
6. Les classes cibles existent bien : `commun/base.css` ligne 154 `.section-serree`,
   ligne 156 `.section-hero`. Vérifié par lecture du fichier (non modifié).

## Laissé tel quel

- Les secondes/troisièmes `<section>` de chaque page (`section`, `section gc-doux`,
  avec leurs `style=` inline) : un seul attribut `class` chacune, rien à fusionner.
- Aucun `clamp()` dans ces 4 fichiers (grep : 0 occurrence), donc rien à corriger
  au titre du garde-fou des espaces autour du `+`.
- Aucun attribut `style=` en double (grep : 0 sur les 4).
- `commun/`, `sortie/`, `construire.mjs`, `capturer.mjs`, `verifier.mjs` : non touchés,
  non lancés. Le rebuild et la vérification restent à l'orchestrateur.
- Aucun contenu rédactionnel modifié : le correctif est purement structurel, aucun
  fait n'a eu besoin d'être écrit.

## Note de procédure

Pas de `PLAN.md` soumis à approbation avant édition : l'orchestrateur a fourni la
spécification exacte `ancien -> nouveau`, et un sous-agent n'a pas d'interlocuteur
pour lever ce verrou. Les sauvegardes pré-édition rendent le changement réversible.
