# Lot 6 : le titre court d'un article peut venir de l'article lui-même

Branche `feat/seo-title-source`, 01/10/2026. Rien n'a été poussé ni déployé. cleo-landing n'a pas été touché.

## 1. Ce qui s'est passé

Le `<title>` d'un article sortait de `blog/titres-courts.json`. L'article du matin du 01/10 n'y avait pas de ligne : son titre long a été coupé au mot, « Le 22 septembre, le Mexique a inscrit une | Cleo Labs ». Il fallait écrire la ligne à la main, dans ce dépôt, chaque matin.

## 2. D'où chaque script lisait le titre long, avant

Aucun ne le lisait dans `<title>`. Le danger annoncé n'existait pas, c'est vérifié dans le code et sur les pages en ligne.

| Script | Titre long lu dans | `<title>` lu ? |
|---|---|---|
| `scripts/blog-posts-public.mjs` (sans jeton) | `headline` du JSON-LD `TechArticle` de la page (`title: a.headline`) | non, jamais |
| `blog/porter.mjs` | `post.title[langue]` de `blog-posts.json` ; le `h1` de la page n'est gardé que comme mesure (`mesure.h1`) | non, jamais |
| `blog/fragments.mjs` | `post.title[langue]` de `blog-posts.json`, sinon `titre` de `blog/brut.json` | non |

Mesure du 01/10/2026 sur les 286 pages publiques de `cleo-landing-cleo-academys-projects.vercel.app` (143 articles, deux langues) : 286 pages lues, 0 échec, titre long du JSON-LD identique à `blog-posts.json` sur 286/286, titre court reconstitué sur 0/286 (normal : aucune page ne sert encore de `seoTitle`).

## 3. Ce qui change

- **`blog/titre-court.mjs` (nouveau)** : la règle, en fonction pure. Ordre : (a) `blog/titres-courts.json` ; (b) sinon le `seoTitle` de l'article ; (c) sinon la coupe au mot. Même suffixe et même registre d'unicité pour (a) et (b). Seul (c) est compté comme repli.
- **`blog/securite-contenu.mjs`** : `seoTitle` accepté, facultatif, bilingue strict `{en, fr}`, 1 à 60 caractères, sans caractère de contrôle ni chevron. Tout autre champ inconnu reste rejeté.
- **`scripts/blog-posts-public.mjs`** : `titreCourtDepuisHtml` lit le `<title>`, décode les entités, retire « | Cleo Labs ». S'il diffère du titre long et tient en 60 caractères, c'est le titre court ; sinon rien. Le titre long reste le `headline`. `seoTitle` n'est écrit que si les deux langues en servent un. Pour un article déjà porté, il revient de `blog/brut.json`.
- **`blog/porter.mjs`** : écrit `titreCourt` dans `blog/brut.json` (versionné). Un article déjà porté n'est pas retéléchargé : c'est ce champ qui fait survivre son titre court. Champ absent quand il n'y a pas de titre court, donc `brut.json` ne bouge pas aujourd'hui.
- **`blog/fragments.mjs`** : prend le titre court dans `blog-posts.json` du jour, sinon dans `brut.json`, et appelle la règle. Le journal dit combien de titres viennent de l'article et combien sont en repli.
- **`scripts/relais-ci.sh`** : `tests/titre-court-source.mjs` ajouté à `TESTS=` (16 tests).
- **`docs/MISE-EN-LIGNE.md`** : une ligne, l'ordre des trois sources.

## 4. La preuve

`node tests/titre-court-source.mjs`, sans réseau, attendus écrits à la main :

- A. la règle : seoTitle sans ligne → seoTitle + suffixe ; la ligne de `titres-courts.json` l'emporte ; sans les deux, repli ; le compteur ne compte que le repli ; un seoTitle à balise ou de 61 caractères retombe en repli.
- B. sans jeton, sur deux formes de page fabriquées (`<title>` = titre long, puis `<title>` = titre court) : titre long lu dans le JSON-LD dans les deux cas, titre court lu dans `<title>` seulement dans le second ; `<title>` hostile, trop long ou vide : pas de titre court, titre long intact.
- C. la chaîne : le vrai `blog/fragments.mjs` lancé sur une copie jetable avec quatre articles fabriqués. `blog/seo-blog.json` porte les huit `<title>` attendus, dont celui d'un article absent du `blog-posts.json` du jour et connu du seul `brut.json` ; og:title et headline restent longs ; « 2 titre(s) en repli », « 4 titre(s) repris du seoTitle ».
- 6 témoins négatifs, tous détectés : titre long lu dans `<title>`, titre court jamais reconstitué, titre court inventé, seoTitle ignoré, priorité inversée, chaîne sans seoTitle.

`tests/blog-securite.mjs` : un cas valide avec `seoTitle`, huit cas hostiles (balise, une seule langue, texte simple, 61 caractères, vide, caractère de contrôle, trois langues, champ voisin `seoTitles`).

Rien ne bouge aujourd'hui. Avec le `blog-posts.json` de `origin/main` de cleo-landing (143 articles, 0 `seoTitle`) : `node blog/fragments.mjs`, `node construire.mjs`, puis les mêmes avec `SIMULER_CI=1`, puis `node blog/porter.mjs` : `git status` ne montre aucun fichier de `pages/`, `commun/`, ni `blog/seo-blog.json`, ni `blog/brut.json` (même empreinte avant et après). 357 pages construites, 16 tests sur 16 verts.

## 5. Le jour où cleo-landing sert le titre court

- **Avec jeton** : `seoTitle` arrive dans `blog-posts.json`, passe la validation, le porteur l'écrit dans `brut.json`, la page sort avec `<title>{seoTitle} | Cleo Labs</title>`. Plus de ligne à écrire à la main.
- **Sans jeton** : le `<title>` de la page publique diffère du `headline` ; il devient `seoTitle`. Le titre long ne change pas, il n'a jamais été lu dans `<title>`.
- Une ligne dans `blog/titres-courts.json` garde le dernier mot : elle sert à corriger un titre sans toucher à cleo-landing.

## 6. Limites connues

- Les 143 articles actuels ont tous une ligne dans `titres-courts.json` : un `seoTitle` ajouté après coup à l'un d'eux ne se verra pas tant que la ligne existe.
- Sans jeton, un `seoTitle` ajouté à un article **déjà porté** n'est repris qu'avec « forcer » (limite déjà écrite du mode sans jeton).
- Sans jeton, si une seule des deux langues sert un titre court, aucun n'est repris : `seoTitle` est bilingue strict.
- Le contrat dit 48 caractères ; ce dépôt accepte jusqu'à 60. De 49 à 60, le titre sort sans le suffixe.
