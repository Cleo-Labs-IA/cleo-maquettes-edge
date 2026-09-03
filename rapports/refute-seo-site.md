# Réfutation adverse — « le vrai site est intact, le SEO/GEO n'est pas menacé »

Lentille : intégrité du site en ligne (www.cleolabs.co) et du dépôt (~/cleo-landing).
Date des mesures : 2026-08-27, entre 17h44 et 17h50 (heure de Paris).
Scripts et sorties brutes : `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-refute-seo/`
(`crawl-prod.txt`, `canon-prod.tsv`, `urls-prod.txt`, `sitemap-prod.xml`, `robots-prod.txt`)

## Verdict : REFUTE

Le dépôt est intact — mesuré, pas supposé. Le site en ligne ne l'est pas :
**8 des 532 URL du sitemap sont du crawl jeté**, et le correctif des deux défauts
existe uniquement sur une branche locale jamais fusionnée. Et le chemin de portage
depuis cette branche ferait disparaître **62 URL vivantes**.

---

## 1. Le dépôt : aucune écriture. La moitié « dépôt » de l'affirmation tient.

| Mesure | Résultat |
|---|---|
| `git status` sur `feat/cas-usage-16` | aucun fichier suivi modifié |
| Fichiers non suivis | 9, le plus récent daté du **26/08 10:18** (`PLAN-outsourcing-guide.md`, `docs/guide-outsourcing-product-compliance.md`) — sujet sans rapport |
| Fichiers modifiés depuis le 26/08 00:00 (hors `.git`, `node_modules`, `.next`) | **2**, les deux ci-dessus |
| `src/app/sitemap.ts` | mtime **2026-07-30 11:15:47** |
| `src/app/robots.ts` | mtime **2026-05-05 16:47:43** |
| `src/app/layout.tsx` | mtime **2026-05-05 16:47:43** |
| `src/app/[locale]/layout.tsx` | mtime **2026-07-30 11:15:47** |
| `src/data/blog-posts.json` | mtime **2026-07-30 11:15:47** |
| `public/llms.txt`, `public/llms-full.txt` | mtime **2026-06-09 11:31:55** |
| `git reflog` | dernière écriture de HEAD le **25/08 11:09**, aucune entrée aujourd'hui |
| `git stash list` | 3 remises, la plus récente sur `main` — aucune datée d'aujourd'hui |
| Écritures dans `.git/` depuis le 26/08 | `.git/config` (26/08 14:16, ajout de l'amont de la branche) et `.git/FETCH_HEAD` (**27/08 15:53**, un `git fetch` — lecture seule) |
| Second arbre de travail `~/cleo-landing-pokota` | 2 fichiers modifiés, tous deux antérieurs au 26/08 |
| Lien de prod vers la maquette | `grep -r sortie-liart` sur `src/` et `public/` : **0**. Dans le HTML servi de `/fr` et `/en` : **0** |

Pas de revert masqué : le reflog ne contient ni `reset` ni `checkout` aujourd'hui.

## 2. Le site en ligne : 8 URL de crawl jetées sur 532. La moitié « site » ne tient pas.

Balayage des **532** URL du sitemap servi, une requête par URL, code HTTP relevé :

- **530 → 200**
- **2 → 404** : `https://www.cleolabs.co/fr/resources/gdpr-compliance` et `/en/resources/gdpr-compliance`,
  déclarées au sitemap en priorité **0.9** (la plus haute après l'accueil). Le dossier ne contient
  qu'un `layout.tsx`, sans `page.tsx`.
- **0 → 5xx**, **0 redirection déclarée** au sitemap.

Puis extraction du `rel="canonical"` sur les mêmes 532 URL :

- 524 auto-référentes (correct)
- 2 sans canonical (les deux 404)
- **6 canonicalisées vers l'accueil alors que l'URL est autre** :

```
/en/for/importers-distributors  -> https://www.cleolabs.co/en
/en/for/manufacturers           -> https://www.cleolabs.co/en
/en/for/marketplaces            -> https://www.cleolabs.co/en
/fr/for/importers-distributors  -> https://www.cleolabs.co/fr
/fr/for/manufacturers           -> https://www.cleolabs.co/fr
/fr/for/marketplaces            -> https://www.cleolabs.co/fr
```

Les trois pages persona sont déclarées au sitemap en priorité 0.8 et s'annulent elles-mêmes :
un canonical vers l'accueil dit au moteur « cette page n'existe pas, indexe l'accueil ».
Elles sont crawlées, servies en 200, et sortent de l'index.

**Cause mesurée** : `src/app/[locale]/layout.tsx` pose un `canonical: ${base}/${locale}` au niveau
du layout, hérité par toute page qui ne redéfinit pas ses `alternates`. Le correctif — le retrait
de ce canonical, avec le commentaire qui l'explique — existe **seulement** sur la branche locale
`feat/cas-usage-16`, jamais fusionnée dans `origin/main`. Idem pour le retrait de
`/resources/gdpr-compliance` du sitemap.

Autrement dit : le correctif de ces 8 URL dort dans la même branche que celle qui, portée telle
quelle, en casserait 62 (point 3).

## 3. L'écart branche ↔ production : le portage est l'arme chargée.

`git rev-list --left-right --count origin/main...HEAD` = **38 66**.
La branche locale est **38 commits en retard** sur `origin/main` et 66 en avance.

`git diff --name-status origin/main..HEAD` : **136 ajoutés, 127 modifiés, 31 supprimés**.

Ce qu'un portage depuis cette branche ferait, mesuré fichier par fichier :

| Ce qui partirait | Mesure |
|---|---|
| **31 articles de blog** présents en prod, absents de la branche | `src/data/blog-posts.json` : **108** entrées sur `origin/main`, **77** sur `HEAD`. Les 31 slugs ont été vérifiés : **31/31 présents au sitemap servi**, échantillon de 4 testé → **200**. Soit **62 URL vivantes** (fr + en) qui deviendraient 404. |
| **La redirection 308 `/pricing` → `/meet`** | Présente dans `next.config.ts` sur `origin/main`, **absente** de `HEAD`. Vérifiée en ligne : `https://www.cleolabs.co/fr/pricing` → **308** vers `/fr/meet`. |
| **La page `/pricing` elle-même** | `src/app/[locale]/pricing/page.tsx` et `layout.tsx` sont en statut `A` (présents sur `HEAD`, absents de `main`) : la branche ressuscite la page retirée le 29/07. |
| **L'entrée `/pricing` au sitemap** | `origin/main` porte le commentaire « ne pas remettre cette entrée ici » ; `HEAD` porte `{ path: '/pricing', priority: 0.9 }`. Vérifié : `grep -c pricing urls-prod.txt` = **0** aujourd'hui. |

Trois défauts SEO corrigés en juillet seraient donc réintroduits par un portage naïf, et 62 URL
indexées disparaîtraient. Rien de tout cela n'est arrivé — mais rien ne l'empêche.

## 4. Le déploiement de maquette : corrigé, mais la protection est en contradiction avec elle-même.

| Mesure | Résultat |
|---|---|
| `https://sortie-liart.vercel.app/robots.txt` | **200**, `User-agent: * / Disallow: /` |
| `<meta name="robots" content="noindex,nofollow">` sur les pages servies | **26 / 26** |
| En-tête HTTP `X-Robots-Tag` | **absent** sur les 26 pages |
| `sitemap.xml` sur la maquette | **404** (aucun sitemap n'expose ces 26 URL) |
| Empreinte md5 local ↔ déployé (3 pages testées) | **identiques** — le déployé est bien la version corrigée |
| Liens sortants de la maquette vers `www.cleolabs.co` | 19 `href` — chemin de découverte vers le vrai site, pas l'inverse |

**Le défaut** : `Disallow: /` empêche un moteur de **lire** le `noindex` qui est dans la page.
Les deux signaux sont posés l'un contre l'autre. Tant qu'aucun lien externe ne pointe vers
`sortie-liart.vercel.app`, rien ne se passe ; le jour où un lien existe, l'URL peut être indexée
en URL nue, sans que le `noindex` n'ait jamais été lu. La ceinture annule la bretelle.
Le seul signal qui traverse un `Disallow` est l'en-tête `X-Robots-Tag`, et il est absent.

**Deuxième point factuel** : le brief dit « scope personnel naomie-7307s-projects ».
`sortie/.vercel/project.json` donne `orgId: team_xlsZryeyfsJzUu3oyiZ4FgY5`.
`~/cleo-landing/.vercel/project.json` donne **le même `orgId`**. Le projet jetable « sortie »
est dans la **même équipe Vercel que la production**, pas dans un scope personnel.

## 5. Ce que le JSON-LD de la maquette déclare — le point GEO.

25 des 26 pages de maquette portent 3 à 6 blocs JSON-LD, dont, sur **25 pages** :

```
"@id": "https://www.cleolabs.co/#organization"
"@id": "https://www.cleolabs.co/#website"
"url": "https://www.cleolabs.co"
```

Ce sont les identifiants d'entité du **vrai** site, affirmés depuis un autre domaine.
Aujourd'hui inertes (noindex + Disallow, aucun lien entrant connu). Si l'une de ces pages venait
à être lue, elle ferait une seconde source affirmant la même entité — exactement ce qu'un travail
GEO cherche à éviter. C'est une dette conditionnelle, pas un dommage constaté.

Le câblage annoncé est par ailleurs **partiel**, mesuré page par page :

- `canonical` + `og:url` : **11 pages sur 25** en ont un. 14 n'en ont aucun
  (`03-offre`, `04-secteur`, `06-cas-client`, `07-chat`, `08-reglementation`, `09-texte`,
  `14-terme`, `15-evenements`, `16-evenement`, `17-modeles`, `19-poste`, `20-campagne`,
  `00-composants`, `01-accueil-noir`).
- `hreflang` : **2 pages sur 26** (`01-accueil.html`, `01-accueil-en.html`, 3 balises chacune).
  Zéro sur les 24 autres.

## 6. Faux positifs — ce qui avait l'air d'un danger et n'en est pas.

- **« Zéro hreflang sur le vrai site »** — faux, artefact de ma première mesure. Next.js écrit
  `hrefLang` en casse mixte ; un `grep` sensible à la casse rend 0. Mesure corrigée :
  `/fr` et `/en` portent chacune 3 balises (`en`, `fr`, `x-default`), toutes en absolu.
- **« 10 ou 11 blocs JSON-LD sur /fr »** — l'attendu compte les occurrences de la chaîne
  `application/ld+json`, qui apparaît **10 fois** dans le HTML de `/fr`. Mais 5 de ces occurrences
  sont dans la charge utile RSC (le flux React sérialisé), pas dans le DOM. Un moteur lit
  **5 balises `<script type="application/ld+json">`** : `Organization`, `WebSite`, `VideoObject`,
  `FAQPage`, `HowTo`. Toutes parsent sans erreur. Le chiffre à retenir est 5, pas 10.
- **`robots.txt` de production** — intact : `Allow: /`, `Disallow: /api/`, et **7 agents IA**
  explicitement autorisés (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai,
  Google-Extended, CCBot), plus la ligne `Sitemap:`. Conforme à l'attendu.
- **`llms.txt` / `llms-full.txt` / `llms-fr.txt`** — servis en 200 (5 914 / 17 118 / 5 860 o).
  Ils ne citent aucune URL d'article (0 occurrence de `blog/`) et datent du 09/06 : c'est une
  limite du travail GEO, pas un dommage causé par le chantier.
- **`lastmod` du sitemap** — aucun n'est estampillé à la date du jour (0 occurrence de
  `2026-08-27`). 314 URL portent `2026-04-27`, en bloc, ce qui est la vraie date du lot
  juridictions. Pas de fraîcheur fabriquée.
- **532 URL au sitemap** — conforme. En revanche l'attendu « 264 pages » ne colle pas :
  532 / 2 = **266 chemins par langue**, dont 108 articles de blog par langue. Écart de 2, sans gravité.
- **Le vrai site répond toujours** — `cleolabs.co` → 307 vers `www`, `www.cleolabs.co/fr` → 200
  avec `x-nextjs-prerender: 1`. Le domaine sert bien le projet `cleo-landing`, pas la maquette.

## 7. À faire, par urgence.

1. **Ne porter aucune ligne depuis `feat/cas-usage-16` sans rebaser d'abord sur `origin/main`.**
   Telle quelle, la branche est 38 commits en retard et retirerait 62 URL indexées.
2. **Publier le correctif du canonical hérité** (`src/app/[locale]/layout.tsx`) en le cueillant
   seul, sur une branche partant de `origin/main`. Il rend 6 pages persona à l'index.
3. **Publier le retrait de `/resources/gdpr-compliance` du sitemap**, même chemin. Ou créer la page :
   5 fichiers du site pointent encore vers elle.
4. **Ajouter `X-Robots-Tag: noindex, nofollow` en en-tête sur le projet `sortie`**
   (`vercel.json`, `headers`). C'est le seul signal qu'un moteur lit malgré `Disallow: /`.
5. **Décider du `Disallow: /`** : soit on le garde et on ajoute l'en-tête (point 4), soit on le
   remplace par `Allow: /` pour que le `noindex` des pages soit lisible. Les deux ensemble
   s'annulent.
6. **Sortir le projet `sortie` de l'équipe de production**, ou le supprimer une fois la revue finie.
   Il partage l'`orgId` de `cleo-landing`.
7. **Finir le câblage des maquettes** avant tout portage : 14 pages sur 25 sans canonical ni og:url,
   24 sur 26 sans hreflang.
8. **`~/cleo-maquettes-edge` n'est pas un dépôt git** (`git rev-parse` → `not a git repository`).
   26 pages et 20 Mo de sortie sans historique ni possibilité de revenir en arrière.
