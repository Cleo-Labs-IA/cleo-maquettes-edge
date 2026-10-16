# SEO 01/10 lot 4 : dates `<lastmod>` du sitemap

## Avant / après (352 URL)
- Avant : 1 date distincte (2026-10-01 sur les 352 URL, la date du build).
- Après : 142 dates distinctes.

Répartition par mois (après) :
2026-02 : 34 · 2026-03 : 32 · 2026-04 : 12 · 2026-05 : 10 · 2026-06 : 18 · 2026-07 : 58 · 2026-08 : 62 · 2026-09 : 124 · 2026-10 : 2

## Méthode
- 284 articles de blog : `lastmod` = champ `date` de `blog/articles.json`. Les données ne portent pas de date de modification, et le JSON-LD n'a que `datePublished` : aucun `dateModified` n'est inventé.
- 68 autres pages : registre versionné `commun/dates-pages.json` (route -> {empreinte, date}). Empreinte = SHA-256 (16 car.) du HTML produit sans les attributs `nonce`. Identique : date conservée. Différente : date du jour, registre réécrit. Route absente : amorçage par `git log -1 --format=%cs -- pages/<source>`, sinon le jour (checkout superficiel).
- Relais : `commun/dates-pages.json` ajouté au `git add` de `.github/workflows/site.yml` et `scripts/relais-blog.sh` ; `tests/sitemap-dates.mjs` ajouté aux boucles de `scripts/relais-ci.sh` et `scripts/relais-blog.sh`.

## Preuves
```
node construire.mjs; shasum commun/dates-pages.json sortie/sitemap.xml; git status --short
node construire.mjs; shasum commun/dates-pages.json sortie/sitemap.xml; git status --short
-> sommes identiques, statut identique (DETERMINISTE)
SIMULER_CI=1 node construire.mjs ; shasum ... -> identique au build normal (même registre, même sitemap)
```
Témoin de changement : une ligne ajoutée à `pages/02-entreprise.html` change son empreinte et sa date (2026-09-29 -> 2026-10-01) et seulement celle-là (diff du registre : 1 entrée) ; retirée, tout est restauré.
Test : `node tests/sitemap-dates.mjs` -> 352 URL, 142 dates distinctes, 284 articles = date de publication, témoin négatif (tout = date du jour) rejeté.

## Limite connue
Le relais CI ne commite le registre que lorsqu'il y a des articles nouveaux (condition existante de l'étape « Versionner le relais du blog »). Une modification de page poussée à la main doit donc embarquer le `commun/dates-pages.json` régénéré par `node construire.mjs`, sinon la CI recalcule la même date du jour sans la conserver.
