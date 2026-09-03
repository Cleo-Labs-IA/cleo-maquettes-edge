# Réfutation : le plan de portage lui-même

Naomie, 27/08/2026. Lentille : la règle en dix étapes de `rapports/carte-REPONSE.md`.
Affirmation soumise à réfutation : « le travail SEO et GEO des six derniers mois sur
cleolabs.co n'est pas menacé par le chantier de maquettes ».

**Verdict : REFUTÉ.** Pas par le déploiement de test, qui est aujourd'hui contenu.
Par la règle de portage, qui trace sa ligne de sécurité au mauvais endroit et
qui s'exécuterait sur une branche que personne n'a nommée.

Aucun fichier n'a été modifié, ni dans `cleo-maquettes-edge`, ni dans `cleo-landing`.
Tout chiffre ci-dessous est mesuré aujourd'hui. Scripts dans
`/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-refute-seo/`.

---

## 1. Ce que j'ai essayé de casser et que je n'ai PAS réussi à casser

À mettre au crédit du chantier. Ces cinq soupçons ont été testés et sont tombés.

| Soupçon | Mesure | Conclusion |
|---|---|---|
| La maquette écrit dans `cleo-landing` | `grep` de `writeFileSync\|cp\|rsync\|>` couplé à `cleo-landing` sur tous les `.mjs`/`.js`/`.sh` du chantier : **0 occurrence** | Le couplage est strictement en LECTURE |
| Un `git push` accidentel emporte la maquette | `git rev-parse` dans `cleo-maquettes-edge` : *not a git repository*. Aucun dépôt, aucun remote | Aucun chemin git vers la prod |
| Une tâche planifiée déploie la maquette | 6 agents launchd (`drive-sync`, `autoenrich`, `veille.p1/p2/p3`, `mail-drafter`), 1 crontab (DILA). **Aucun** ne cite `maquette` ni `sortie`. Aucune commande `vercel --prod` dans le chantier | Pas de déploiement automatique |
| Les hreflang de la maquette détournent le vrai site | 2 pages sur 26 portent 3 `hreflang` chacune. Non réciproques depuis cleolabs.co, donc ignorés par Google | Faux positif |
| Les 7 crawlers IA aspirent les 26 pages | `robots.txt` de `sortie` : `User-agent: * / Disallow: /`, servi en 200. GPTBot, ClaudeBot, PerplexityBot, CCBot honorent tous `*` | Contenu aujourd'hui |

Et un chiffre du dossier qui tient : `curl /sitemap.xml | grep -c "<loc>"` rend **532**
en direct. Le témoin de l'étape 1 est bon.

---

## 2. Les dommages, du plus grave au moins grave

### D1. La règle d'or protège le mauvais fichier

> « On remplace **le corps** d'une page (`page.tsx`, composant client). On ne touche
> **jamais** à son `layout.tsx` dans le même passage. »

Mesuré sur `origin/main` : **8 fichiers hors `layout.tsx` émettent du `ld+json`**, et
**7 `page.tsx` portent un `generateMetadata`** avec canonical et hreflang.

| Fichier | Blocs `ld+json` | Ce qu'il porte | Nommé par le plan |
|---|---|---|---|
| `src/components/blog/ArticleShell.tsx` | 4 | TechArticle, FAQPage… | oui, étape 3 |
| `src/app/[locale]/page.tsx` | 2 | l'accueil | cible de l'étape 5 |
| `src/app/[locale]/industries/page.tsx` | 2 | + `generateMetadata` | cible de l'étape 6 |
| **`src/components/landing/TeamSection.tsx`** | **1** | **3 `Person` : CEO, CRO, CTO, avec `jobTitle`, `worksFor`, `alumniOf` Sorbonne et Polytechnique** | **jamais nommé** |
| `src/app/[locale]/skills/page.tsx` | 1 | | cible de l'étape 6 |
| `src/app/[locale]/legal-data/page.tsx` | 1 | `Dataset` + canonical | cible de l'étape 6 |
| `src/app/[locale]/customers/[slug]/page.tsx` | 1 | `Article` + `BreadcrumbList` + canonical | non |
| `src/app/[locale]/careers/[slug]/page.tsx` | 1 | + canonical | cible de l'étape 5 |

Le cas décisif est `TeamSection.tsx`. C'est un composant de présentation, il porte un nom
de section, il ressemble à de la peinture — et il transporte les trois ancres d'entité des
fondatrices. Il est importé par **exactement un fichier** : `src/app/[locale]/company/page.tsx`,
c'est-à-dire la **première page nommée par l'étape 5**. Or la maquette a précisément une
section équipe à substituer, avec deux personnes nouvelles (Darcial Mondjo, Thezi Mabuza).
Le geste naturel — « je remplace la section équipe par celle de la maquette » — est autorisé
mot pour mot par la règle d'or, et il supprime trois `Person`.

Le contrôle de l'étape 5 (« le nombre de blocs `ld+json` est inchangé ») rattraperait
`TeamSection` **si et seulement si** on compte les blocs sur la page servie, pas dans le
fichier. Il ne rattrape ni `for/[slug]` (canonical dans `generateMetadata`, pas de `ld+json`),
ni `customers/[slug]`, qui ne figurent dans aucune liste du plan.

**Ce que la règle devrait dire :** on ne touche jamais, dans le même passage, un fichier qui
émet du `ld+json` ou un `generateMetadata` — quel que soit son nom.

### D2. Deux fichiers qui commandent 264 pages ne sont pas dans les intouchables

La liste gelée nomme `sitemap.ts`, `robots.ts`, les 27 `layout.tsx`, `blog-posts.json`,
les trois `llms*.txt`, `Navbar.tsx:98`. Elle ne nomme **ni `next.config.ts`, ni `src/middleware.ts`**.

`next.config.ts` porte **13 redirections, dont 7 permanentes (301)** :
`solutions/due-diligence` → `solutions/product-compliance`, `/sme` → `/meet`,
`/by-sku` → `/meet`, `/enterprise` → `/solutions/product-compliance`,
`industries/sustainability` → `industries/retail`, `industries/healthtech` →
`industries/medical-devices`, `/:locale/sitemap.xml` → `/sitemap.xml`. Ce sont les
conduits qui transportent l'autorité des URL retirées vers les URL vivantes. Elles sont
invisibles : rien ne les affiche, aucun contrôle du plan ne les compte.

Le même fichier porte **2 rewrites** qui proxifient toute la zone `/legal-data/*` vers
`legaldata-public.cleolabs.co`. L'étape 6 dit « créer le gabarit `/legal-data` ».
`/legal-data` n'est pas une page à gabariter : c'est une page native **plus** une zone
proxifiée dont `src/middleware.ts` exclut explicitement les chemins (`ZONE_ROOTS`).
Un gabarit posé là entre en collision avec le rewrite.

`src/middleware.ts` porte la redirection de locale de **toutes** les pages sans préfixe,
avec un `matcher` `/((?!_next|api|sitemap|robots|.*\..*).*)`. Un caractère de ce matcher
décide si `/sitemap.xml` est servi ou redirigé. Aucune étape ne le mentionne.

### D3. Le plan ne nomme jamais de branche — et la branche sur place est fausse

C'est le trou le plus large, parce qu'il précède les dix étapes.

```
git rev-list --left-right --count feat/cas-usage-16...origin/main
66      38
```

Le checkout de `cleo-landing` est sur **`feat/cas-usage-16`** : 66 commits en avance,
**38 commits en retard** sur la production. Conséquences mesurées :

| | checkout local | `origin/main` |
|---|---|---|
| entrées `blog-posts.json` | **77** | **108** |
| composants d'article `.tsx` | **77** | **108** |
| articles avec `faq[]` non vide | — | **104** |

Le plan dit, étape 3 : *« Contrôle : les 108 articles rendent toujours 108 `TechArticle`
et 104 `FAQPage` »*. Exécuté sur le checkout tel qu'il est, ce contrôle rend **77** et
**74**. Il échoue sans qu'il y ait de dégât, ce qui est le pire mode de panne d'un contrôle :
la correction naturelle, à 23 h, est d'ajuster le nombre attendu.

Et si la branche du port part de là, un merge vers `main` embarque **66 commits non relus**
avec la peinture, et se résout en conflit sur exactement les deux fichiers que la machine
de publication écrit tous les jours.

*Note de fiabilité pour `carte-REPONSE.md` :* `commun/seo.json` signale bien l'écart de
branche pour les titres. Mais les comptes « 108 articles / 104 FAQPage » du dossier sont
justes pour `main` et faux pour le dépôt sur le disque. Les deux coexistent dans le même
document sans que la différence soit dite.

### D4. « Mettre à jour cleo-publish » ne suffit pas : la publication est un cron sans garde-fou

L'étape 4 traite `cleo-publish` comme une routine à modifier le même jour. Ce n'en est pas une.
`~/.claude/skills/cleo-publish/SKILL.md` est un **fichier de consignes**. La publication
réelle est une chaîne à trois maillons, dont **aucun n'est ce fichier** :

1. une **routine cloud** ouvre chaque matin une PR `daily-article/<slug>` (mesuré : PR #143
   ouverte aujourd'hui à 06:24 UTC). Elle écrit l'article en **copiant la forme d'un article
   existant** — donc du dernier publié. Modifier le SKILL.md ne la change pas ; et tant qu'elle
   copie l'ancien format, elle le régénère indéfiniment ;
2. `.github/workflows/publish-daily-article.yml`, **cron `0 8 * * *` sur un runner GitHub**,
   prend la **plus ancienne PR `daily-article/*` sans label `hold`** et fait
   `gh pr merge --squash`. Pas de `--auto`, aucune vérification de statut dans le script ;
3. `main` **auto-déploie en production**, puis le workflow `tweet-new-posts` est déclenché.

Et il ne peut pas y avoir de barrière :

```
gh api repos/cleo-academy/cleo-landing/branches/main/protection
403 — "Upgrade to GitHub Pro or make this repository public to enable this feature."
```

**La protection de branche est indisponible sur ce dépôt.** Aucun check obligatoire ne
peut être exigé avant ce merge automatique.

Le contrôle de l'étape 4 — *« un article publié le lendemain rend le même nombre de blocs
JSON-LD qu'un article d'avant-hier »* — s'exécute donc **après** le merge, **après** le
déploiement en production, et **après** le tweet. Le rattrapage coûte un `git revert` plus
une suppression de tweet (procédure décrite dans le SKILL.md, donc déjà vécue).

État de la file, aujourd'hui : **20 PR ouvertes**, la plus ancienne du 18/06. La prochaine
à passer est **#143 `daily-article/boohoo-dgccrf-leather-labeling-fine-2026`**,
`mergeStateStatus: CLEAN`, `mergeable: MERGEABLE`, sans label `hold`.

Deux détails qui comptent :
- elle touche **4 fichiers**, pas trois : `[slug]/page.tsx`, le `.tsx` de l'article,
  `blog-posts.json`, **et `src/data/slug-to-related.json`**. Ce quatrième fichier
  n'est ni dans les « trois fichiers » de l'étape 4, ni dans les intouchables ;
- **le cron n'a pas tourné aujourd'hui.** Dernière exécution `publish-daily-article` :
  2026-08-26T08:26:26Z, relevé à 15:44 UTC le 27/08. La file ne se vide pas au rythme supposé.

### D5. Le gel de `blog-posts.json` est inapplicable

`src/data/blog-posts.json` est **sur la liste des intouchables** et **écrit tous les jours
par la machine**. Le plan ne distingue pas « ne pas changer le schéma » de « ne pas ajouter
une ligne ». Gel littéral = la publication s'arrête pendant toute la durée du port.
Gel non appliqué = le fichier bouge sous le port. Dans les deux cas, `blog-posts.json` et
`[slug]/page.tsx` sont écrits par le port (étapes 3–4) **et** par la machine (chaque jour) :
conflit garanti sur les deux fichiers dont la corruption est silencieuse.

### D6. Le contrôle final de l'étape 10 peut passer pendant que la production est gelée

Les cinq critères de passage mesurent tous **le site servi**, par `curl`. Or si un commit du
port casse le build, **Vercel ne promeut pas** : la production continue de servir le dernier
build valide. Les cinq critères rendent alors toujours 532 / 108 / 104 / 200 / 80, et le
plan conclut « on promeut ». Rien dans les dix étapes ne vérifie que le déploiement qui
sert la production est bien celui construit depuis le commit du port. Le site paraît
intact précisément parce qu'il est resté en arrière.

Aggravant : le cron de 08:00 continue de merger des articles par-dessus un `main` qui ne
déploie plus. Chaque jour ajoute un article que personne ne verra jamais en ligne, et le
tweet part quand même.

### D7. Le chantier dépend d'une branche du vrai site, et lâche en silence

`construire.mjs` a **trois chemins durs** vers `cleo-landing` :

| ligne | chemin | si ça disparaît |
|---|---|---|
| 9 | `cleo-landing/node_modules/sharp/…` | `import` échoue, build mort (bruyant) |
| 12 | `cleo-landing/public` (≈40 images) | `throw IMAGE ABSENTE` (bruyant) |
| 181 | `cleo-landing/src/components/landing/ref` | **`try/catch` → « composant de veille indisponible », exit 0 (silencieux)** |

Mesuré :

```
git ls-tree origin/main --name-only src/components/landing/ref/   →  0 fichier
git ls-tree HEAD        --name-only src/components/landing/ref/   → 53 fichiers
```

**Le dossier `ref/` n'existe pas sur `main`.** Ses 53 fichiers ne vivent que sur
`feat/cas-usage-16`. Idem pour 4 des 8 images échantillonnées (`experts/darcial-mondjo.jpg`,
`experts/thezi-mabuza.jpg`, `veille/produit-3b9ed4d5.png`, `apropos-station-f.jpg`) :
présentes sur le disque, absentes de `main`.

Donc : **la première chose que le port impose — se placer sur `main` dans `cleo-landing` —
casse la maquette qui sert de référence au port.** Les images échouent bruyamment ;
le composant de veille échoue en silence et deux pages (`00-composants`, `03-offre`)
sortent avec un `<div>` de remplacement, sans erreur, sans code de retour.

Détail de fragilité annexe : `litExport()` découpe entre le premier backtick après
`export const X` et le **dernier backtick du fichier**. Un second littéral gabarit exporté
dans `veilleCss.ts` fait avaler tout le reste du fichier, sans avertissement.

### D8. « Ni Search Console ni outil de mots-clés » : faux, et ça change le plan

`carte-REPONSE.md` écrit en tête : *« Pas de chiffre de trafic ni de position : il n'y a ni
Search Console ni outil de mots-clés dans ce contexte. »*

`cleo-landing/docs/gsc-ctr-fix-2026-07-29.md` est un export Search Console réel
(`cleolabs.co-Performance-on-Search-2026-07-29.zip`, 27/04 → 26/07/2026) avec impressions,
clics, CTR et **positions mesurées** pour 12 pages, entre la position **5,0 et 8,6** :

| page | impressions | clics | CTR | position |
|---|---|---|---|---|
| `/en/blog/regulatory-compliance-france-guide` | 10 003 | 24 | 0,24 % | 7,0 |
| `/en/blog/cosmetic-regulation-by-country` | 8 623 | 69 | 0,80 % | 7,3 |
| `/en/blog/espr-ecodesign-…-guide` | 6 886 | 17 | 0,25 % | 5,7 |
| `/en/blog/temu-200m-dsa-fine-…` | 4 197 | 5 | 0,12 % | 7,1 |
| `/en/pricing` | 779 | 1 | 0,13 % | 5,0 |

Deux conséquences directes sur le plan :

1. **Le témoin de l'étape 1 peut mesurer des positions**, pas seulement des comptes de
   balises. Ces 12 pages sont l'actif qu'on cherche à ne pas perdre ; le plan les ignore
   parce qu'il se croit aveugle.
2. **Le correctif CTR déjà diagnostiqué est bloqué par le plan lui-même.** Il exige
   d'ajouter deux champs `seoTitle` / `seoDescription` dans `blog-posts.json` — fichier gelé
   par la liste des intouchables — et de les préférer dans le `generateMetadata` de
   `blog/[slug]/layout.tsx`. Diagnostic mesuré : `title.en` médiane 80 caractères,
   **56 des 77 articles au-delà de 60** ; `description.en` médiane 271, **62 sur 77 au-delà
   de 160**. L'étape 9 (« les corrections indépendantes du port ») ne le mentionne pas.

### D9. `noindex` + `canonical` : les deux protections s'annulent

Sur les 26 pages construites : **26/26 portent `noindex,nofollow`**, et **12/26 portent en
plus un `rel=canonical` vers une URL de production vivante**, toutes vérifiées en **200** :
`/fr`, `/en`, `/fr/company`, `/fr/blog`, `/fr/resources`, `/fr/careers`, `/fr/terms`,
`/fr/meet`, `/fr/resources/glossary`, `/fr/jurisdictions/european-union`, et
`/fr/blog/eu-ppwr-packaging-conformity-2026` (article réel, h1 servi vérifié).

`noindex` associé à un `canonical` vers une autre URL est un couple de signaux
contradictoires : la canonicalisation fusionne les signaux du groupe, et le `noindex` peut
être attribué à la cible du canonical. C'est-à-dire aux 11 URL ci-dessus.

Ce qui protège aujourd'hui **n'est pas le `noindex`** — c'est `Disallow: /`, qui empêche
Googlebot de récupérer la page, donc de lire quoi que ce soit. Les deux mesures sont
mutuellement exclusives : tant que le `Disallow` tient, le `noindex` est inerte ; le jour
où quelqu'un desserre `robots.txt` pour partager un aperçu ou faire passer un outil d'audit
— geste banal sur un déploiement de maquette — **le `noindex` et le `canonical` deviennent
lisibles au même instant**, et le couple s'arme contre 11 URL de production.

Deux faits qui élargissent la surface :
- aucun en-tête `x-robots-tag` sur `sortie-liart.vercel.app` (relevé complet des en-têtes) ;
  aucune protection de déploiement Vercel : les 26 pages répondent 200 en public ;
- le projet Vercel `sortie` n'est **pas** dans un scope personnel isolé.
  `sortie/.vercel/project.json` et `cleo-landing/.vercel/project.json` portent le **même
  `orgId` : `team_xlsZryeyfsJzUu3oyiZ4FgY5`**. Même équipe, même tableau de bord, même
  réservoir de domaines que la production. Aucun domaine attaché aujourd'hui ; attacher un
  domaine reste deux clics au même endroit.

---

## 3. Les mesures, en une page

| # | Mesure | Valeur |
|---|---|---|
| 1 | `sitemap.xml` servi | **532** `<loc>` |
| 2 | `feat/cas-usage-16` vs `origin/main` | **66 en avance / 38 en retard** |
| 3 | `blog-posts.json` local / `main` | **77 / 108** |
| 4 | composants d'article local / `main` | **77 / 108** |
| 5 | articles avec `faq[]` sur `main` | **104** |
| 6 | fichiers hors `layout.tsx` émettant du `ld+json` sur `main` | **8** |
| 7 | `page.tsx` avec `generateMetadata` sur `main` | **7** |
| 8 | `TeamSection.tsx` : `Person` portées / importeurs | **3 / 1** (`company/page.tsx`) |
| 9 | `next.config.ts` : redirections / dont permanentes / rewrites | **13 / 7 / 2** |
| 10 | protection de branche sur `main` | **impossible** (HTTP 403, plan GitHub) |
| 11 | cron `publish-daily-article` | **`0 8 * * *`**, `gh pr merge --squash`, sans check |
| 12 | dernière exécution du cron | **2026-08-26T08:26:26Z** (relevé le 27/08 à 15:44 UTC) |
| 13 | PR ouvertes / prochaine à merger | **20** / **#143**, CLEAN, sans `hold` |
| 14 | fichiers touchés par #143 | **4** (dont `slug-to-related.json`) |
| 15 | `src/components/landing/ref/` sur `main` / sur la branche | **0 / 53 fichiers** |
| 16 | images échantillonnées absentes de `main` | **4 sur 8** |
| 17 | pages maquette avec `noindex` / avec `canonical` vers la prod | **26 / 12** |
| 18 | cibles de ces canonical répondant 200 | **11 sur 11** |
| 19 | `orgId` Vercel `sortie` vs `cleo-landing` | **identique** (`team_xlsZ…`) |
| 20 | GSC : `title.en` > 60 car. / `description.en` > 160 car. | **56/77** et **62/77** |
| 21 | écritures maquette → `cleo-landing` | **0** |
| 22 | `cleo-maquettes-edge` est un dépôt git | **non** |

---

## 4. Ce qu'il faut faire

**Avant toute ligne de code (aujourd'hui)**

1. Poser le label `hold` sur **#143** si `ArticleShell` doit bouger cette semaine, ou la
   merger maintenant à froid pour vider la file avant le port. Ne pas laisser un article
   traverser le changement de gabarit sans décision.
2. Ajouter à la liste des intouchables : **`next.config.ts`**, **`src/middleware.ts`**,
   **`src/components/landing/TeamSection.tsx`**, **`src/data/slug-to-related.json`**.
3. Réécrire la règle d'or par sa cause, pas par un nom de fichier :
   *on ne touche jamais, dans le même passage, un fichier qui émet un `ld+json` ou un
   `generateMetadata`.* Le geste de contrôle tient en une ligne, à rejouer avant chaque
   commit :
   `git grep -l "application/ld+json\|generateMetadata" -- src | sort > /tmp/emetteurs.txt`
   puis vérifier que `git diff --name-only` ne croise jamais ce fichier.

**Avant l'étape 1**

4. Écrire en tête du plan la branche de départ : **`main`, à jour**. Et rejouer le témoin
   depuis `main`, jamais depuis le checkout actuel — sinon il rend 77 au lieu de 108.
5. Décider du sort de `feat/cas-usage-16` (66 commits) *avant* le port, pas pendant.
6. Ajouter au témoin les **12 pages du GSC avec leur position**. C'est le seul poste du
   dossier qui se mesure en visiteurs.
7. Copier `src/components/landing/ref/` et les 4 images absentes de `main` **dans
   `cleo-maquettes-edge`**, et remplacer les trois chemins durs de `construire.mjs`.
   Tant que ça n'est pas fait, un `git checkout main` casse la maquette — silencieusement
   pour la veille, bruyamment pour les images. Au minimum : retirer le `try/catch` de la
   ligne 181 pour que l'absence hurle au lieu de rendre un `<div>`.

**Sur le gel de `blog-posts.json`**

8. Remplacer « gelé » par la vraie règle : *le schéma est gelé, l'ajout d'une ligne par jour
   ne l'est pas.* Et pendant la fenêtre du port, sortir la publication du chemin critique :
   label `hold` sur les PR quotidiennes, ou `workflow_dispatch` seul en désactivant le cron.

**Sur l'étape 4**

9. La cible n'est pas le SKILL.md, c'est la **routine cloud qui ouvre la PR** — elle copie la
   forme du dernier article publié. Publier **d'abord** un article au nouveau format, à la
   main, pour que la routine ait le bon modèle à copier. Sinon elle régénère l'ancien format
   tous les jours.
10. Comme la protection de branche est indisponible, ajouter le seul garde-fou possible dans
    le workflow lui-même : refuser le merge si le dernier check du PR n'est pas `SUCCESS`
    (`gh pr view "$PR" --json statusCheckRollup` avant le `gh pr merge`).

**Sur l'étape 10**

11. Ajouter un sixième critère : **l'URL du déploiement qui sert la production porte le SHA
    du commit du port**. Sans lui, les cinq autres passent pendant que la prod est gelée
    sur un ancien build.

**Sur le déploiement de test**

12. Choisir **une** protection, pas deux qui s'annulent. Le plus propre : **retirer les 12
    `rel=canonical`** des pages de maquette (ils ne servent à rien sur un déploiement
    jetable) et garder `noindex` + `Disallow`. À défaut, activer la protection de
    déploiement Vercel, qui règle le sujet d'un coup.
13. Vérifier que `sortie` est bien dans la même équipe Vercel que la production, et le
    déplacer ou le supprimer une fois le chantier fini. « Aucun domaine attaché » n'est pas
    une isolation, c'est un état.

**Correction indépendante, à ajouter à l'étape 9**

14. Le correctif CTR de `docs/gsc-ctr-fix-2026-07-29.md` : `seoTitle` / `seoDescription`
    dans `blog-posts.json` + `blog/[slug]/layout.tsx`. C'est la seule action du dossier
    dont l'effet est mesurable en Search Console, et le gel actuel la bloque.

---

*Un mot pour finir. Le dossier `carte-REPONSE.md` est solide sur ce qu'il a regardé : les
signaux qui vivent dans les layouts, il les a comptés juste, et le témoin à 532 tient en
direct. Ce qu'il n'a pas regardé, c'est lui-même : la règle d'or nomme un fichier au lieu
de nommer une cause, la liste des intouchables oublie les deux fichiers qui commandent les
264 pages, et les dix étapes s'ouvrent sans dire sur quelle branche elles s'exécutent — sur
une machine où la branche présente est en retard de 38 commits et de 31 articles.*
