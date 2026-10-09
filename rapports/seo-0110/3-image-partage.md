# SEO 01/10 n°3 : une image de partage par article (01/10/2026)

Avant : les 355 pages déclaraient `https://www.cleolabs.co/og-image.jpg`. Après : chaque page d'article du blog (284 pages, FR et EN) déclare `https://www.cleolabs.co/og/blog/<slug>.jpg`, commune aux deux langues.

## Chiffres (mesurés)
- Pages d'article avec image propre : 284 ; images distinctes produites : 142 (une par slug) pour 40 couvertures de la banque. Deux articles de même couverture ont des fichiers identiques en contenu ; deux couvertures différentes ne partagent jamais le même fichier (test).
- Replis sur `og-image.jpg` : 8 pages, toutes hors blog (famille « article » du générateur sans bande photo : 14-terme, 16-evenement, 19-poste-fde, 19-poste-legal, FR et EN). Raison : « pas de couverture déclarée dans la page ». Aucun repli parmi les 284 articles de blog.
- Poids ajouté à `sortie/` : 21 876 Ko (du -sk sortie/og), 142 fichiers, le plus lourd 188 249 octets (limite 300 Ko).
- Format : JPEG 1200 × 630, recadrage centré `sharp` (fit cover), mozjpeg qualité 80 (descend si > 280 Ko), aucun texte incrusté.
- Temps de build (`node construire.mjs`, Mac, cache chaud) : sans la fonction 16,8 à 17,8 s ; avec 17,5 à 21,1 s (bruit de machine important, mesures successives) ; premier passage à froid (142 images fabriquées) 25,4 à 27,8 s. Le cache `.cache/og-empreintes.json` (hors dépôt, ignoré par git) retient le sha1 de la source : une image n'est refaite que si sa source change ou si le fichier manque (0 fabriquée au 2e passage).
- `SIMULER_CI=1 node construire.mjs` : réussit, 58 images reprises en ligne, 142 images de partage fabriquées à partir des fichiers repris ; le test passe dans ce mode. Les empreintes des sources reprises étaient identiques à celles du Mac (0 refaite au passage CI suivant le Mac).

## Comment
- Source de l'image : le fichier déjà fabriqué par `cheminImage` dans `sortie/images/` (photo de la banque sur le Mac, fichier repris en ligne d'après `commun/images-manifeste.json` en CI). Aucun chemin hors dépôt n'est lu directement.
- Repli : couverture non déclarée, source absente, échec de sharp ou image > 300 Ko : `og-image.jpg`, ligne `repli : <slug> : <raison>` dans le journal de build, jamais d'exception, jamais de balise vers un fichier absent.
- Balises : `og:image`, `og:image:width`, `og:image:height`, `og:image:alt` (titre de l'article), `twitter:image`, et `image` dans le JSON-LD `TechArticle`.
- Code : `construire.mjs` (fonction `imagePartageArticle`, repérage de la couverture dans la bande photo avant injection des images).
- CSP / `vercel.json` : aucune règle de redirection ou de réécriture ne vise `/og/*` (vérifié par le test sur toutes les règles ; un fichier de `sortie/` gagne de toute façon sur un relais Vercel) ; la CSP n'impose que `img-src 'self'`. `/og/blog/<slug>.jpg` servi en HTTP 200 `image/jpeg` par `commun/servir.mjs`.

## Test
`tests/image-partage.mjs` (ajouté aux boucles de `scripts/relais-ci.sh` et `scripts/relais-blog.sh`) : fichier existant, 1200 × 630 lu par sharp, JPEG, < 300 Ko, width/height/alt, `twitter:image` = `og:image`, JSON-LD identique, pas de collision entre couvertures différentes, pages hors blog sur `og-image.jpg`. Sept témoins négatifs détectés : image 600 × 315, image de plus de 300 Ko, fichier absent, `og-image.jpg` générique sur un article, `twitter:image` divergente, largeur déclarée fausse, deux couvertures différentes avec la même image.

## Commandes de mesure
```
time node construire.mjs
rm -rf .cache sortie/og && time SIMULER_CI=1 node construire.mjs
SIMULER_CI=1 node tests/image-partage.mjs
du -sk sortie/og ; find sortie/og -name '*.jpg' | wc -l ; ls -l sortie/og/blog | awk '{print $5}' | sort -n | tail -1
```
Tous les tests de la boucle de `scripts/relais-ci.sh` passent (landings-ads, v6-structure, seo-accueil, servir-routes, image-partage, blog-securite, securite-critique, csp-atlas-browser, csp-formulaires-browser).
