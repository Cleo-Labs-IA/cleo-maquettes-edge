# Carte des routes : ce que le site sert, ce que la maquette couvre

Relevé du 27/08/2026. Lentille : l'inventaire des routes et leur poids.
Aucun fichier de `cleo-landing` ni de `cleo-maquettes-edge` n'a été modifié.
Scripts : `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-carte/`

---

## 0. Trois corrections au brief, avant tout chiffre

Le brief me donnait des faits « déjà établis ». Deux sont faux, et ils faussent
tout ce qui suit si on ne les corrige pas.

**Le dépôt local n'est pas la production.** `~/cleo-landing` est sur la branche
`feat/cas-usage-16` (HEAD `51fa4ffa`), pas sur `main`. J'ai donc lu
l'inventaire sur `origin/main` et vérifié chaque route sur le site servi.

| Fait annoncé | Mesure | Écart |
|---|---|---|
| 77 fichiers d'articles | **108** sur `origin/main`, **108** URL `/blog/*` dans le sitemap servi | 77 = le compte de la branche locale seulement |
| 532 URL dans `src/app/sitemap.ts` | `sitemap.ts` de la branche locale calcule **470** ; le sitemap **servi** en déclare **532** | la branche locale est en retard de 31 articles, et a ajouté `/pricing` |
| sections `agents`, `product`, `preview` (23 pages) | **absentes de `origin/main`** : `/en/agents` → 404, `/en/product/chat` → 404, `/en/preview/landing` → 404 | ce sont des routes de branche, jamais servies |

La liste de 24 sections du brief est celle de la branche. **La production en
compte 21** : `blog, careers, changelog, company, customers, for, industries,
jurisdictions, legal-data, maria-action-plan, meet, platform, preview, privacy,
research, resources, scan, security, skills, solutions, terms`.
(`preview` n'existe en prod que comme 2 fichiers non routés au sitemap.)

**Conséquence pratique** : il n'y a pas de gabarit à trouver pour `agents` et
`product`. Ils ne sont pas un trou de la maquette, ils ne sont pas en ligne.

---

## 1. Le dénominateur, posé exactement

Sitemap servi (`https://www.cleolabs.co/sitemap.xml`) : **532 `<loc>`**
= **266 chemins distincts × 2 locales** (`/en`, `/fr`).

J'ai interrogé les 266 chemins en HTTP (`/en`) :

| | chemins |
|---|---|
| déclarés au sitemap | 266 |
| répondent 200 | **265** |
| répondent 404 | **1** — `/resources/gdpr-compliance` |
| dont l'accueil `/` | 1 |
| **hors accueil, atteignables** | **264** |

Le « 264 » du brief est donc exact, et voici ce qu'il est précisément :
*les chemins déclarés au sitemap, hors page d'accueil, qui répondent 200.*

Le 404 est connu et documenté dans le code : `sitemap.ts` porte un commentaire
disant que la route a été retirée le 29/07 parce qu'elle n'a qu'un `layout.tsx`
sans `page.tsx`. **Le sitemap servi la déclare toujours** — la correction n'est
pas déployée. Cinq fichiers du site pointent encore vers elle.

**S'ajoutent 8 chemins atteignables mais absents du sitemap** : `/customers`
et ses 3 cas, `/privacy`, `/terms`, `/scan`, `/solutions`. Total réellement
servi : **273 chemins**, soit 546 pages avec les deux langues.

---

## 2. Inventaire section par section

Priorité = celle lue dans `src/app/sitemap.ts`. « Méta » = `export metadata`
ou `generateMetadata`. « JSON-LD » = bloc `application/ld+json` propre à la
section (en plus des blocs globaux du layout racine, présents partout).

| # | Section | Pages | Prio | Ce qu'elle raconte (lu dans le code) | Méta | JSON-LD | Gabarit maquette | Verdict |
|---|---|---|---|---|---|---|---|---|
| 1 | `/` accueil | 1 | 1.0 | Le produit, les 3 features, la preuve | oui | oui (+FAQPage) | `01-accueil` | **COUVERTE** |
| 2 | `jurisdictions` index | 1 | 0.8 | Liste des 8 juridictions suivies | oui | oui | — | **DÉCOUVERTE** |
| 3 | `jurisdictions/{pays}` | 8 | 0.8 | Pays : autorités, régs clés, latence d'alerte 24 h | oui | oui (+FAQPage) | `05-marche` | **COUVERTE** |
| 4 | `jurisdictions/{pays}/{secteur}` | 80 | 0.6 | Pays × secteur : cadres applicables, statut « Mapped » | oui | oui | — | **DÉCOUVERTE** |
| 5 | `jurisdictions/{pays}/regulations/{reg}` | 32 | 0.7 | Pays × texte : autorité, sanction max, obligations | oui | oui (+FAQPage) | `09-texte` | **APPROCHANTE** |
| 6 | `blog` index | 1 | 0.8 | Les 108 publications, 9 811 mots de listing | oui | oui | `11-blog` | **COUVERTE** |
| 7 | `blog/{slug}` | 108 | 0.7–0.9 | Les articles ; 141 414 mots de corps | oui | oui (`ArticleShell`) | `12-article` | **COUVERTE** |
| 8 | `industries` index | 1 | 0.9 | Liste des 10 secteurs | oui | oui | — | **DÉCOUVERTE** |
| 9 | `industries/{slug}` | 10 | 0.7 | Secteur : régs par SKU, marché par marché | oui | oui (+FAQPage) | `04-secteur` | **COUVERTE** |
| 10 | `resources` index | 1 | 0.8 | Hub des guides et du glossaire | oui | oui | `10-ressources` | **COUVERTE** |
| 11 | `resources/glossary` | 1 | 0.8 | Glossaire, 1 807 mots, 20+ termes sur une page | oui | oui | `13-glossaire` | **COUVERTE** |
| 12 | `resources/{ai-act,dora,csrd}-compliance` | 3 | 0.8 | Un texte, un guide pilier (981 mots pour l'AI Act) | oui | oui (+FAQPage) | `09-texte` | **COUVERTE** |
| 13 | `resources/product-compliance-retail` | 1 | 0.9 | Pilier secteur × sujet, la prio la plus haute après l'accueil | oui | oui (+FAQPage) | `09-texte` | **APPROCHANTE** |
| 14 | `resources/data` | 1 | 0.7 | La donnée réglementaire en chiffres | oui | oui | — | **DÉCOUVERTE** |
| 15 | `for/{persona}` | 3 | 0.8 | Fabricants / importateurs / marketplaces, parcours par acheteur | oui | **NON** | `03-offre` | **APPROCHANTE** |
| 16 | `careers` index | 1 | 0.6 | Les postes ouverts | oui | oui | `18-recrutement` | **COUVERTE** |
| 17 | `careers/{slug}` | 2 | 0.6 | Un poste, avec `JobPosting` | oui | oui | `19-poste` | **COUVERTE** |
| 18 | `solutions/product-compliance` | 1 | 0.9 | L'offre conformité produit | oui | oui | `03-offre` | **COUVERTE** |
| 19 | `platform` | 1 | 0.9 | Vue d'ensemble de la plateforme | oui | oui | `03-offre`/`08-reglementation` | **APPROCHANTE** |
| 20 | `maria-action-plan` | 1 | 0.9 | La méthode MARIA en 4 étapes, 3 700 sources, 106 pays | oui | oui (+FAQPage) | `03-offre` | **APPROCHANTE** |
| 21 | `company` | 1 | 0.6 | L'équipe, les fondatrices, **la levée** | oui | oui (2× `FundingEvent`) | `02-entreprise` | **APPROCHANTE** |
| 22 | `meet` | 1 | 0.7 | Prise de rendez-vous (cible du 308 depuis `/pricing`) | oui | oui | `21-inscription` | **APPROCHANTE** |
| 23 | `research` | 1 | 0.7 | **Le papier MARIA** : pipeline 5 étages, F1 0.81, 420–1 200 requêtes/run | oui | oui | — (homonyme, voir §4) | **DÉCOUVERTE** |
| 24 | `legal-data` | 1 | 0.8 | Coverage Atlas : 5 613 HS6, 14 225 régs, 4 658 autorités, 158 marchés | oui | oui | — | **DÉCOUVERTE** |
| 25 | `skills` | 1 | 0.85 | 45 skills open-source MCP, MIT, `npx @cleo-labs/skills-mcp` | oui | oui | — | **DÉCOUVERTE** |
| 26 | `security` | 1 | 0.5 | RGPD art. 28, Scaleway Paris, AES-256, TLS 1.3 | oui | oui | — | **DÉCOUVERTE** |
| 27 | `changelog` | 1 | 0.6 | Les livraisons datées de la plateforme | oui | oui | — | **DÉCOUVERTE** |
| — | `resources/gdpr-compliance` | (404) | 0.9 retirée | route morte encore déclarée au sitemap servi | — | oui | `09-texte` | *hors compte* |

**Hors sitemap, atteignables** (8 chemins, non comptés dans les 264) :

| Section | Pages | Ce qu'elle raconte | Gabarit | Verdict |
|---|---|---|---|---|
| `customers` index + 3 cas | 4 | Trois histoires client nommées par le résultat | `06-cas-client` | **COUVERTE** |
| `privacy`, `terms` | 2 | Juridique, 931 et 1 027 mots | `22-legal` | **COUVERTE** |
| `solutions` (nu) | 1 | Aiguillage, 138 mots | `03-offre` | **APPROCHANTE** |
| `scan` | 1 | Outil interactif, 91 mots servis | — | **DÉCOUVERTE** |

---

## 3. Le chiffre demandé

Sur les **264** pages :

| Verdict | Pages | Part |
|---|---|---|
| **COUVERTE** | **136** | 51,5 % |
| **APPROCHANTE** | **40** | 15,2 % |
| **DÉCOUVERTE** | **88** | **33,3 %** |

**88 pages sur 264 n'ont aucun gabarit de maquette.** Une page sur trois.

D'où viennent ces 88 :

| Origine | Pages |
|---|---|
| `jurisdictions/{pays}/{secteur}` — le croisement pays × secteur | **80** |
| `jurisdictions` index | 1 |
| `industries` index | 1 |
| `research` (le papier MARIA) | 1 |
| `legal-data` (Coverage Atlas) | 1 |
| `skills` (45 skills open-source) | 1 |
| `security` | 1 |
| `changelog` | 1 |
| `resources/data` | 1 |
| **Total** | **88** |

Lecture honnête de ce chiffre : **80 des 88 sont une seule forme de page
manquante**, répétée 80 fois. Le vrai trou de gabarit, ce sont **8 formes
distinctes** — dont une (pays × secteur) porte à elle seule 30 % du site.

Avec l'accueil et les 8 chemins hors sitemap, sur les 273 chemins servis :
**137 COUVERTES, 41 APPROCHANTES, 89 DÉCOUVERTES**.

---

## 4. Les quatre trous que Naomie avait repérés

### La levée de fonds sur la page entreprise — elle a raison, et c'est pire que ça

`02-entreprise.html` contient **une seule ligne**, ligne 1422, une `t-caption`
dans une liste de faits :

```
1,5 M€ levés en pre-seed
```

Aucun nom d'investisseur. La page servie, elle, porte :

- un **titre de page** `About Cleo Labs: Backed by Kima Ventures` — le nom de
  l'investisseur est dans la balise `<title>`, donc dans le résultat de recherche ;
- deux blocs `FundingEvent` en JSON-LD, avec `MonetaryAmount` 1 500 000 EUR,
  et les `funder` **nommés** : Kima Ventures, La Financière Saint-James,
  Larry Berger ;
- les fondatrices en `Person`, avec `alumniOf` École Polytechnique et un
  `knowsAbout` de 10+ sujets.

Piège de mesure à signaler : mon premier `grep` avait compté « 10 occurrences
de *levée* » dans la maquette. **Les neuf premières étaient le mot « relevées »**
dans des commentaires CSS. La maquette ne mentionne la levée qu'une fois.

### Le blog — le gabarit existe, mais il perd la FAQ

`11-blog` et `12-article` existent, donc les 109 pages du blog sont COUVERTES
en structure. Mais la mesure sur les 108 articles servis :

| Signal | Articles porteurs |
|---|---|
| `TechArticle` | **108 / 108** |
| `SpeakableSpecification` | **108 / 108** |
| `BreadcrumbList` + `WebPage` | 108 / 108 |
| `FAQPage` | **104 / 108** |
| `Legislation` | **45 / 108** |

`12-article.html` n'a **aucune section FAQ** (ses titres : *De quel texte on
parle · Ce qui s'applique · Ce qui vient ensuite · Ce qu'il y a à faire ·
À lire aussi*). Porter la composition de la maquette telle quelle sur le
gabarit d'article ferait tomber **104 blocs `FAQPage`**.

Poids aussi : le corps d'un article servi fait **1 309 mots en moyenne**
(141 414 mots sur les 108). Le corps de `12-article` en fait **763**.

### L'article Deel — couvert, mais c'est la FAQ qui le porte

`/blog/global-product-compliance-pitch-by-deel` : **1 176 mots de corps**,
`TechArticle` + `FAQPage` (3 Q/R) + `Legislation` + `Speakable`. C'est un
article du corpus, donc COUVERT par `12-article` — sous la réserve FAQ ci-dessus.

À noter au passage : `/blog/cleo-labs-raises-1-5m-preseed` (723 mots) est l'un
des **4 seuls articles sans `FAQPage`**, avec le Vivatech et les deux
« what's new ».

### Les travaux de recherche — le gabarit est un homonyme

C'est le trou le plus net. `construire.mjs` ligne 22 nomme `07-chat.html`
**« Research »**. Mais ce fichier décrit la *feature produit* Research
(« Recherche réglementaire. La source avant le résumé »).

La page servie `/research` est tout autre chose : **le papier MARIA**. Elle
porte le pipeline en 5 étages avec les *prompt templates* affichés, et les
chiffres : 19 régions, 16 secteurs, 8 langues, 30+ analyses par run,
**420–1 200 requêtes par run, F1 0.81**.

Il n'existe **aucun gabarit de page scientifique** dans la maquette. Et le nom
« Research » étant déjà pris par une feature, le risque n'est pas d'oublier la
page : c'est de croire qu'elle est faite.

---

## 5. Ce que la maquette ne peut pas casser — et ce qu'elle peut

C'est la réponse directe à « je veux pas que le SEO change ».

**Les 25 pages de `sortie/` portent zéro signal de tête** :

| Signal | Pages de maquette qui le portent |
|---|---|
| `<title>` | 25 / 25 |
| `lang=` | 25 / 25 |
| `application/ld+json` | **0 / 25** |
| `meta description` | **0 / 25** |
| `rel="canonical"` | **0 / 25** |
| `hreflang` | **0 / 25** |
| `og:` / `twitter:` | **0 / 25** |

Ce n'est **pas** un défaut de la maquette : ces signaux ne vivent pas dans les
gabarits du vrai site non plus. Ils vivent dans :

- `src/app/[locale]/layout.tsx` et les `layout.tsx` de section → **20 sections
  sur 21 ont un JSON-LD propre** (seules `for`, `privacy`, `terms` n'en ont pas
  au-delà des blocs globaux) ;
- `src/app/sitemap.ts` et `src/app/robots.ts` → les 532 URL, les 7 crawlers IA
  autorisés (`GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`,
  `anthropic-ai`, `Google-Extended`, `CCBot`) ;
- `public/llms.txt` (758 mots) et `public/llms-full.txt` (2 212 mots), tous deux
  en 200 ;
- **`src/components/blog/ArticleShell.tsx`** — un seul fichier émet
  `TechArticle`, `BreadcrumbList`, `WebPage`, `FAQPage` et `Speakable` pour les
  108 articles, alimenté par `src/data/blog-posts.json`.

**Donc** : re-peindre le corps des pages avec la DA de la maquette ne touche
rien de tout ça. Le SEO/GEO ne change pas.

**Ce qui le ferait changer**, et c'est là qu'il faut être discipliné :

1. Remplacer un `layout.tsx` de section en même temps que sa `page.tsx` — on
   perd le JSON-LD et le `<title>` de la section d'un coup. C'est exactement le
   cas de `/company` : le nom « Kima Ventures » est dans le titre porté par
   `company/layout.tsx`.
2. Réécrire le gabarit d'article sur la composition de `12-article` sans
   reporter `FaqSection` → **104 `FAQPage`** perdus.
3. Livrer une arborescence calquée sur les 24 gabarits : ce serait passer de
   273 chemins à ~25 formes, et **80 pages pays × secteur** n'auraient nulle
   part où aller.
4. Le 404 `/resources/gdpr-compliance` reste déclaré au sitemap servi en
   priorité 0.9 : à corriger dans le même passage, indépendamment de la maquette.

---

## 6. Ce que la maquette a en plus

Six gabarits n'ont **aucune** contrepartie servie. Ce ne sont pas des trous,
ce sont des pages à créer si on les veut :

| Gabarit | Contrepartie en ligne |
|---|---|
| `15-evenements` / `16-evenement` | aucune section `/events` |
| `17-modeles` | aucune section modèles/assets |
| `20-campagne` | aucune landing de campagne |
| `14-terme` | **le glossaire est une page unique** : pas d'URL par terme |
| `00-composants` | kit de composants, pas une page de site |

`14-terme` est le plus intéressant : les 20+ termes du glossaire vivent
aujourd'hui sur un seul chemin de 1 807 mots. Le gabarit pour les éclater en
pages existe déjà.

---

## 7. Réponse en une phrase

**Sur la structure de tête, oui : la maquette ne peut pas dégrader le SEO/GEO,
parce qu'elle n'y touche pas — tout vit dans les layouts, `sitemap.ts`,
`robots.ts`, `ArticleShell.tsx` et `llms.txt`.
Sur l'inventaire, non : 88 des 264 pages n'ont aucun gabarit, dont les 80
pages pays × secteur, le papier MARIA, le Coverage Atlas et les 45 skills.**

Ce qu'il faut vérifier après portage, dans cet ordre :

1. `curl /sitemap.xml | grep -c "<loc>"` rend toujours ≥ 532 ;
2. les 108 articles rendent toujours 108 `TechArticle` et 104 `FAQPage` ;
3. `/en/company` a toujours `Backed by Kima Ventures` dans son `<title>` et
   2 blocs `FundingEvent` ;
4. `/research`, `/legal-data`, `/skills`, `/security`, `/changelog`,
   `/resources/data` répondent toujours 200 avec leur JSON-LD ;
5. les 80 chemins `jurisdictions/{pays}/{secteur}` répondent toujours 200.

Le script qui mesure 1, 2 et 5 est dans
`/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-carte/` (`geo.sh`, `check.sh`).

---

*Aucun chiffre de trafic, de position ou de volume de recherche dans ce rapport :
il n'y a ni Search Console ni outil de mots-clés dans cet environnement. Tout ce
qui est compté ici est une page, un signal ou un mot, mesuré sur le dépôt
`origin/main` et sur les pages servies le 27/08/2026.*
