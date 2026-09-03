# Carte recherche — les travaux publiés et le socle d'entité

Mesure du 27/08/2026. **A** = dépôt `/Users/naomiehalioua/cleo-landing` + pages
servies sur `https://www.cleolabs.co`. **B** = `/Users/naomiehalioua/cleo-maquettes-edge`
(24 gabarits dans `pages/`, 26 pages construites dans `sortie/`).
Aucun fichier des deux dépôts n'a été modifié. Scripts et captures :
`/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-carte/`.

**Lentille : les travaux de recherche et le socle d'entité.** Ce document compte des
pages, des signaux et des mots. Aucun chiffre de trafic, de position ou de volume de
recherche n'y figure : il n'y a ni Search Console ni outil de mots-clés dans ce contexte.

---

## 0. Trois faits de départ à corriger avant de lire la suite

| Fait transmis | Ce que la mesure donne |
|---|---|
| « 77 fichiers d'articles » | **77 sur la branche locale `feat/cas-usage-16`. 108 sur `origin/main`**, c'est-à-dire en production. `git ls-tree -r --name-only origin/main src/components/blog/articles \| wc -l` → 108. Le sitemap servi déclare 108 slugs de blog. La branche de travail est en retard de 31 articles. |
| « 532 URL déclarées, 264 pages atteignables » | 532 URL déclarées, **266 chemins uniques** × 2 locales. **530 répondent 200, 2 répondent 404** : `/en/resources/gdpr-compliance` et `/fr/resources/gdpr-compliance`. Le commentaire de `src/app/sitemap.ts:26-29` dit que la route a été retirée le 29/07 ; le sitemap **servi** la déclare encore. Le build en ligne est antérieur au retrait. |
| « les sections de route sont : … agents … » | `/agents` et `/agents/[slug]` existent dans le dépôt mais **répondent 404 en ligne**, en FR comme en EN. Le premier commit de la route (`06589ad6`) n'a jamais été fusionné sur `main` ; il vit sur `feat/cas-usage-16` et `feat/ia-use-cases`. Idem pour `/product/chat`, `/product/market-access`, `/product/radar` et les 23 pages `/preview/*` : toutes 404 en ligne. |

Conséquence directe sur la lentille : **la description la plus précise de MARIA qui existe
dans le dépôt — « Onze agents. Un par vérification. » — n'est aujourd'hui lisible par
aucun robot.**

---

## 1. `/research` : ce qu'il y a exactement

### Les fichiers

| Fichier | Lignes | Contenu |
|---|---|---|
| `src/app/[locale]/research/layout.tsx` | 69 | `generateMetadata` (titre, description, OG, Twitter, canonical, hreflang en+fr+x-default) + un seul JSON-LD : `BreadcrumbList` |
| `src/app/[locale]/research/page.tsx` | 9 | passe-plat vers le client |
| `src/components/research/ResearchPageClient.tsx` | 475 | le corps : hero, carte du papier, pipeline 5 étapes cliquable, capacités, quadrant de marché, infrastructure de recherche, diagramme streaming, carte livre blanc, mur de logos, CTA |
| `src/components/research/KeywordRaceAnimation.tsx` | 300 | l'animation « au-delà de la recherche par mots-clés » |
| `src/i18n/sections/research.ts` | 10 163 o | tout le texte FR/EN, les 5 étapes, les 6 métriques, les 5 points du quadrant |

C'est **une seule page**. Pas d'index d'articles de recherche, pas de page par papier,
pas de route `/research/<slug>`.

### Ce que la page servie contient

`/fr/research` → 200, **699 mots** de texte visible. `h1` : « La science / derrière
l'intelligence ». Titre `<title>` : *Recherche en Intelligence Réglementaire & Livres
Blancs | Cleo Labs*.

**JSON-LD sur la page servie** : `BreadcrumbList` (propre à la page) plus tout ce que le
layout `[locale]` injecte sur chaque page du site (`Organization`, `WebSite`,
`VideoObject`). **Aucun `ScholarlyArticle`, aucun `Article`, aucun `CreativeWork`,
aucun `Dataset`.** Pour un moteur, la page ne déclare pas qu'elle publie un travail :
elle déclare qu'elle est une page dans un fil d'Ariane.

### Le livre blanc, lui, est réel

`public/cleo-whitepaper-multi-agent-regulatory-intelligence.pdf`, 609 039 octets,
servi en 200. **20 pages, 8 718 mots.**

> **MARIA: A Multi-Agent Regulatory Intelligence Architecture**
> Naomie Halioua¹, Alexandre Bloch¹, Anaelle Guez¹ — ¹ Cleo Labs, Paris, France — February 2026

Résumé mesurable : 7 sociétés, 7 secteurs, **7 676 réglementations**, protocole hybride
LLM + revue humaine de 130 classifications contestées, précision inclusive estimée
**73 %–92 %**, ajustée du biais de l'évaluateur **93 %–97 %** sur les textes contraignants,
**zéro entrée fabriquée**, désaccord inter-modèles **κ ≤ 0,340**.

C'est le document le plus citable que l'entreprise possède. Voici comment il est exposé.

### Les six trous de citabilité du papier

| # | Constat mesuré | Conséquence |
|---|---|---|
| 1 | **Un seul lien entrant dans tout le dépôt** : `ResearchPageClient.tsx:443`, en `<a download>`. Vérifié aussi sur `origin/main`. | Le PDF est une impasse : rien ne le cite, il ne cite rien vers le site. |
| 2 | **Le PDF n'est pas dans le sitemap.** Les 532 URL sont toutes des routes HTML. | Il n'est découvert que par crawl du lien unique. |
| 3 | **Métadonnées PDF vides** : `Title:` vide, `Author:` vide, `Subject:` vide, `Keywords:` vide. Seuls `Creator: LaTeX with hyperref` et `Producer: pdfTeX` sont remplis. | Un moteur qui indexe le PDF n'a ni titre ni auteur à attacher à l'entité. |
| 4 | **Aucun identifiant pérenne** : `arxiv`, `doi.org`, `hal.science`, `zenodo` → **0 occurrence** pour le papier de Cleo dans tout `src/` et `public/`. En face, le blog cite **au moins 4 identifiants arXiv de tiers** (`2506.04133`, `2601.11702`, `2601.23094`, `2602.05944`). | Cleo cite la littérature ; la littérature ne peut pas citer Cleo. Un moteur génératif attribue une affirmation à un identifiant, pas à un PDF sur un domaine commercial. |
| 5 | **Les trois auteurs ne sont nulle part sur la page.** `research.ts:14` donne `paperAuthors: 'Cleo Labs, Neuilly-sur-Seine'` et `paperDate: 'Forthcoming, 2026'` / « À paraître, 2026 ». Le papier dit *Naomie Halioua, Alexandre Bloch, Anaelle Guez*, *Cleo Labs, Paris*, *February 2026*. | Le signal d'entité le plus fort d'un travail scientifique — le nom des personnes — est retiré à l'affichage. Et la page dit « à paraître » d'un document daté de février et publié depuis. |
| 6 | **Le corps du papier n'existe pas en HTML.** 8 718 mots enfermés dans un PDF, 699 mots sur la page. | Un moteur génératif lit d'abord le HTML. 92 % du contenu scientifique est hors de sa portée la plus facile. |

### Un chiffre de la page ne se retrouve pas dans le papier

`src/i18n/sections/research.ts:63` affiche, dans la grille des métriques :

```
{ value: '0.81', label: { en: 'F1 score (full pipeline)', fr: 'Score F1 (pipeline complet)' } }
```

Recherche dans les 8 718 mots du PDF servi en production :
`grep -ci "f1\|f-1\|f measure\|f-measure"` → **0**. `grep -o "0\.8[0-9]"` → **0**.

**Le score F1 de 0,81 affiché publiquement sur `/fr/research` et `/en/research` ne figure
pas dans le livre blanc que la même page propose au téléchargement.** Il vient peut-être
d'une mesure interne réelle, mais en l'état il n'est traçable à aucune source publique, et
la page qui l'affiche est précisément celle qui promet « chaque résultat produit par Cleo
est traçable, mesurable et auditable ».

Voisin : `research.ts:62` affiche « 420–1,200 recherches par exécution ». `1,200` apparaît
6 fois dans le papier ; `420` n'y apparaît pas.

Je ne tranche pas sur l'origine de ces chiffres. Je signale qu'ils ne sont pas vérifiables
depuis les sources publiques, et qu'ils vivent dans un fichier de traduction, pas dans un
document daté.

### Une mine dans le fichier de traduction

`src/i18n/sections/research.ts:79-82` déclare :

```
researchers: [
  { name: 'Ana Velázquez',  role: {…'Chercheuse principale, Cleo Labs'}, photo: '/researcher-1.webp' },
  { name: 'Lucía Mendoza',  role: {…'Ingénieure recherche IA, Cleo Labs'}, photo: '/researcher-2.webp' },
]
```

Ces deux personnes ne sont **rendues nulle part** aujourd'hui : `grep -rn "researchers" src`
ne trouve que la déclaration. La donnée est morte, et elle doit le rester. Toute
reconstruction de la page qui rebranche ce tableau publierait deux chercheuses qui
n'existent pas, avec photo et titre, sur la page qui parle de traçabilité.
Les mêmes photos sont d'ailleurs déjà déclarées dans la maquette
(`construire.mjs:58-59`, `chercheuse-1` / `chercheuse-2`) — **sans être utilisées par aucun
gabarit**. Le fil est posé des deux côtés.

---

## 2. MARIA : trois descriptions publiques qui ne disent pas la même chose

`MARIA` apparaît **159 fois dans 25 fichiers** de `src/`. Concentration :

| Fichier | Occurrences |
|---|---|
| `src/app/[locale]/platform/layout.tsx` | 15 |
| `src/app/[locale]/maria-action-plan/layout.tsx` | 15 |
| `src/i18n/sections/offres.ts` | 12 |
| `src/components/maria-action-plan/MariaActionPlanPageClient.tsx` | 12 |
| `src/data/blog-posts.json` | 10 |
| `src/app/[locale]/solutions/product-compliance/layout.tsx` | 8 |
| `src/app/[locale]/layout.tsx` (JSON-LD `Organization`) | 7 |
| `src/app/[locale]/company/layout.tsx` | 7 |
| 17 autres fichiers | 1 à 6 |

Le problème n'est pas le volume. C'est que les trois descriptions détaillées se contredisent :

| Source | Ce qu'elle dit de l'architecture | État en ligne |
|---|---|---|
| `public/llms-full.txt:79-85` | **5 agents nommés par fonction** : Collection, Analysis, Mapping, Scoring, Alert | servi |
| `/research` (`research.ts:24-31`) | **5 étapes séquentielles** : Profile & Map, Discover, Score, Enrich, Assess | servi |
| `/agents` (`src/app/[locale]/agents/page.tsx:35`) | **« Onze agents. Un par vérification. »** | **404** |
| Le papier PDF | pipeline en 5 étapes, cohérent avec `/research` | servi, non indexable en HTML |

Un moteur qui lit les deux fichiers servis reçoit deux listes de cinq éléments dont aucun
nom ne coïncide. La liste de onze, celle qui correspond au produit d'aujourd'hui, il ne la
voit pas.

Et : **`public/llms-fr.txt` ne contient pas une seule fois le mot MARIA.**
`grep -ci "MARIA" public/llms-fr.txt` → **0**. La version française du fichier destiné aux
moteurs génératifs ne nomme jamais l'architecture qui porte le nom de l'entreprise.

---

## 3. `/maria-action-plan` : la page la mieux balisée du site, et personne ne la relie

`src/app/[locale]/maria-action-plan/layout.tsx` (128 lignes) injecte **quatre blocs
JSON-LD** — le meilleur balisage de tout le site :

- `DefinedTerm` — « MARIA Action Plan », `inDefinedTermSet` pointant sur `#organization`
- `HowTo` — 4 `HowToStep` : cadrer, cartographier, scorer, agir
- `FAQPage` — 2 paires question/réponse
- `BreadcrumbList`

Le corps (`MariaActionPlanPageClient.tsx`, 165 lignes, 624 mots servis) est écrit pour être
cité : une définition auto-portante de 78 mots, une distinction explicite avec le GRC, une
distinction par-marché / cross-produit.

**Liens internes entrants dans tout `src/` : zéro.**
`grep -rn "maria-action-plan" src` hors du dossier de la route ne renvoie que
`src/app/sitemap.ts:14`. Ni la navbar, ni le pied de page, ni un article, ni une page
produit ne pointe dessus. Elle est atteignable par le sitemap et par rien d'autre.

En comparaison, `/research` a **7 points d'entrée** dans le dépôt : `Footer.tsx:64`,
`NavbarDesktop.tsx:148`, `NavbarMobile.tsx:73`, `ResearchSpotlight.tsx:24`,
`TeamSection.tsx:237`, `CoverageManifest.tsx:171`, `ref/FooterLanding.tsx:58`.

Et `/maria-action-plan` n'est listée **ni dans `llms.txt`, ni dans `llms-full.txt`,
ni dans `llms-fr.txt`.**

---

## 4. `llms.txt` : ce qu'il dit, dans quel ordre

Trois fichiers à la racine de `public/`, tous déclarés dans le `<head>` du layout
`[locale]` (`<link rel="alternate" type="text/plain" href="/llms.txt">` et
`/llms-full.txt` ; **`llms-fr.txt` n'est déclaré nulle part**).

### `llms.txt` — 5 914 octets, 12 sections, dans cet ordre

1. `# Cleo Labs` + une accroche `>` qui contient, en une phrase : MARIA développé, Kima Ventures, La Financière Saint-James, Larry Berger (Amplify), 1,5 M€, 3 700+ sources, 106 pays, ×10 de capacité
2. `## Company Information` — fondation 2023, constitution 2024, Neuilly-sur-Seine, Cleo Corp SAS, site, `contact@cleolabs.co`, investisseurs, montant
3. `## What Cleo Does`
4. `## Core Use Cases` (3)
5. `## Industries Served` (7)
6. `## Key Regulations Covered` (8)
7. `## Pricing` (Starter gratuit, Professional 299 €/mois, Enterprise)
8. `## Pages` — **9 URL** : accueil, platform, pricing, solutions, due-diligence, product-compliance, **research**, blog, meet
9. `## Key Statistics` — 8 lignes, dont « **98.5% accuracy rate on regulatory classification (internal benchmark)** »
10. `## How Cleo Compares` — tableau 4 lignes contre équipe interne, cabinets, GRC
11. `## Frequently Cited Facts` — 7 faits réglementaires datés, sourçables
12. `## Resource Guides` — 5 URL, dont **`/en/resources/gdpr-compliance` qui répond 404**

L'ordre est bon : identité d'abord, puis capacités, puis pages, puis faits. C'est la forme
attendue. Ce qui manque :

- **`/maria-action-plan` absent** de la liste des pages
- **`/agents` absent** (cohérent, il est 404)
- **le livre blanc absent** — le PDF n'est cité dans aucun des trois fichiers
- **aucune mention des trois auteurs**
- « 98.5 % accuracy » est présenté comme *internal benchmark* : honnête sur la nature, mais il ne pointe vers aucun document. Le papier, lui, donne 73–92 % / 93–97 % avec un protocole décrit. Le chiffre le plus flatteur est celui qui n'a pas de source ; le chiffre sourcé n'est pas dans le fichier.
- deux liens sur cinq du bloc `Resource Guides` mènent à une 404

### `llms-full.txt` — 17 118 octets, 29 titres

Contient une vraie section `## Technology — MARIA` (5 agents, cf. §2). Dit deux fois que
le travail est « formalized in a research paper, **currently under publication** » —
formule qui était juste avant février 2026 et qui ne l'est plus. **Ne donne pas le lien du
PDF.** Sa section `## Links` liste 14 URL, dont `/en/resources/gdpr-compliance` (404).

### `llms-fr.txt` — 5 860 octets, 12 sections

Traduction partielle de `llms.txt`. **Zéro occurrence de MARIA.** Sa section « Ce que fait
Cleo » dit « un pipeline IA multi-agents » sans le nommer. Le fichier n'est pas déclaré
dans le `<head>`.

### `robots.ts`

8 règles. `GPTBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `anthropic-ai`,
`Google-Extended`, `CCBot` : tous en `allow: '/'`. Seul `/api/` est interdit.
C'est la bonne configuration pour le GEO, et **elle est hors de la ligne de tir** : elle
vit dans `src/app/robots.ts`, aucun gabarit ne la touche.

---

## 5. Toute trace de publication, de papier, de benchmark, de méthode documentée

Recherche exhaustive dans `src/` et `public/` :

| Ce qui rend une entreprise citable comme source | Ce qui existe | Où |
|---|---|---|
| Un papier signé, daté, avec protocole et chiffres | **Oui, 1** | `public/cleo-whitepaper-…​.pdf`, 20 p., 8 718 mots |
| Un identifiant pérenne (DOI, arXiv, HAL, Zenodo) | **Non, 0** | — |
| Un balisage `ScholarlyArticle` / `Dataset` | **Non, 0** | — |
| Un `TechArticle` par article de blog | **Oui, 108** | `src/components/blog/ArticleShell.tsx:86-140`, avec auteur `Person` (jobTitle, LinkedIn, `worksFor`, `alumniOf`), `publisher` avec `sameAs`, `keywords`, `speakable`, `wordCount` |
| Des `FAQPage` | **Oui, 302 paires Q/R sur 104 des 108 articles** | `blog-posts.json` → `faq[]` |
| Des mots-clés déclarés | **1 162 cumulés, 1 121 distincts** sur les 108 articles | `blog-posts.json` → `keywords[]` |
| Un `HowTo` méthodologique | **Oui, 1** | `maria-action-plan/layout.tsx` — orpheline |
| Un `DefinedTerm` de marque | **Oui, 1** | `maria-action-plan/layout.tsx` — orpheline |
| Une citation de littérature tierce | **Oui, ≥ 4 arXiv** | `trism-…`, `multi-agent-ai-compliance-research-2026`, `epistemic-vigilance-…`, `data-quality-ml-compliance-gdpr` |
| Un prix, une distinction datée | **Oui** | `layout.tsx:94` `award: "Winner — The Pitch by Deel (Station F, 2026)"` + l'article `global-product-compliance-pitch-by-deel` |
| Une page d'index des publications | **Non** | `/research` est une page unique, pas un index |

**Le socle de citabilité du site n'est pas `/research`. C'est le blog.**
108 `TechArticle` signés, 302 paires FAQ, 1 121 mots-clés distincts — contre une page de
699 mots et un PDF sans identifiant. C'est le blog qui porte la matière que les moteurs
génératifs peuvent citer.

---

## 6. La maquette a-t-elle le moindre gabarit pour tout ça ? Non.

Réponse franche, mesurée sur les 24 gabarits de `pages/` :

| Recherché dans les 24 gabarits | Occurrences |
|---|---|
| `livre blanc` | **0** |
| `whitepaper` | **0** |
| `papier`, `publication scientifique` | **0** |
| `F1`, `précision`, `benchmark`, `protocole` | **0** |
| `arXiv`, `DOI` | **0** |
| `MARIA` | **1** — un bandeau flottant de 12 mots dans `02-entreprise.html:163` : « MARIA, architecture multi-agents de veille réglementaire » |
| `Kima`, `Saint-James`, `Larry Berger`, `Station F`, `Deel`, `Wikidata` | **0 chacun** |
| `1,5 M€ levés en pre-seed` | **1** — un bandeau flottant, `02-entreprise.html:155` |
| Liens `http(s)://` sortants, tous gabarits confondus | **0 sur 305 `href`** (dont **130 `href="#"`**, soit 43 %) |

### Le piège de vocabulaire

`construire.mjs:26` fait correspondre `07-chat.html` au titre **« Research »**. Le mot y
désigne une **fonctionnalité produit** — « Un produit, un marché, une question. Le Research
cherche dans le texte, jusque dans les annexes » — pas la page de recherche scientifique.
Le pied de page de la maquette (`commun/pied.html`) reprend ce sens : colonne « Produit »,
entrées `Regulatory Change`, `Research`, `Compliance`, `Legal Data`.

**Il n'existe donc aucun gabarit pour `/research`, aucun pour `/maria-action-plan`,
aucun pour `/agents`.** Et le seul endroit de la maquette où le mot « Research » apparaît
désigne autre chose. Si le port se fait gabarit par gabarit sans exception, la page de
recherche n'a pas de remplaçant : elle disparaît ou elle reste orpheline dans un site dont
le vocabulaire dit maintenant le contraire.

### Les 24 gabarits face aux 266 chemins uniques du sitemap

Familles servies aujourd'hui (chemins uniques, hors locale) :

| Famille | Chemins | Gabarit correspondant |
|---|---|---|
| `blog/<article>` | 108 | `12-article.html` |
| `jurisdictions/<pays>/<secteur>` | 80 | aucun |
| `jurisdictions/<pays>/regulations/<reg>` | 32 | `09-texte.html` (partiel) |
| `industries/<secteur>` | 10 | `04-secteur.html` |
| `jurisdictions/<pays>` | 8 | `05-marche.html` |
| `resources/<guide>` | 7 (dont 1 en 404) | aucun |
| `for/<persona>` | 3 | aucun |
| `careers/<poste>` | 2 | `19-poste.html` |
| pages simples : accueil, blog, careers, changelog, company, industries, jurisdictions, legal-data, maria-action-plan, meet, platform, research, resources, security, skills, solutions/product-compliance | 16 | 6 couvertes (`01`, `02`, `03`, `10`, `11`, `18`) — **10 sans gabarit** |

Sans gabarit, section par section : **`research`, `maria-action-plan`, `platform`,
`legal-data`, `skills`, `changelog`, `security`, `industries` (index), `jurisdictions`
(index), `solutions` (index)**, plus les 7 guides `resources/<guide>`, les 3 pages
`for/<persona>` et les 80 croisements pays × secteur.

Dans l'autre sens, 5 gabarits n'ont aucune route en ligne et seraient des pages neuves :
`14-terme`, `15-evenements`, `16-evenement`, `17-modeles`, `20-campagne`.

### Ce que la maquette porte bien

Il faut le dire aussi, sinon la mesure est fausse.

- Densité comparable : les 24 gabarits font **10 197 mots**, soit 110 à 1 129 mots par page. `/fr/research` en fait 699, `/fr/company` 487. La maquette n'est pas mince.
- `12-article.html` porte déjà catégorie, titre, chapô, auteur, date, temps de lecture, sommaire d'ancres, et **cite le texte officiel au paragraphe près** (« Règlement (UE) 2025/40, article 2, paragraphe 1 »). C'est la bonne forme pour un `TechArticle`.
- Le pied de page de la maquette est un maillage de **43 liens** dont une trentaine de noms de réglementations (REACH, CLP, RSGP, EPI, PPWR, EN 71, Batteries, ESPR, AI Act, PFHxA, Prop 65, TSCA, CPSIA, ASTM F963, Loi 96…). C'est un actif, pas une perte.
- `02-entreprise.html` conserve : Cleo Corp SAS, fondée en 2023, constituée en 2024, Neuilly-sur-Seine, Anaëlle Guez, ex-Havas Group, Polytechnique, 106 pays, 25 000 réglementations, 19 000 autorités, 3 700 sources, 2 812 règles encodées.

### Une divergence d'entité à corriger avant tout port

Le pied de page de la maquette donne **`hello@cleolabs.co`**.
Le JSON-LD `Organization` (`layout.tsx:198-212`), `llms.txt` et `llms-fr.txt` donnent
**`contact@cleolabs.co`**. Deux adresses différentes pour la même entité, dans deux
sources qu'un moteur lira côte à côte. C'est le genre d'incohérence qui abîme un socle
d'entité pour un gain nul.

---

## 7. Les signaux d'entité, un par un : où ils vivent, et s'ils sont dans la ligne de tir

Un « changement de gabarit » = remplacer le **corps** d'une page (`page.tsx` / le composant
client) sans toucher au layout Next.js. Sous cette définition :

| Signal | Où il vit exactement | Dans la ligne de tir ? |
|---|---|---|
| Nom légal `Cleo Corp SAS` | `src/app/[locale]/layout.tsx:80` (`legalName`) | **Non** — châssis |
| `@id` de l'entité `…/#organization` | `layout.tsx:78` | **Non** |
| Logo `ImageObject` 180×180 | `layout.tsx:82-88` | **Non** |
| `slogan`, `foundingDate` 2023 | `layout.tsx:92-93` | **Non** |
| `award` — The Pitch by Deel, Station F, 2026 | `layout.tsx:94` | **Non** pour le balisage. **Oui** pour le récit : il vit dans `blog/global-product-compliance-pitch-by-deel.tsx` |
| Fondatrices en `Person` (jobTitle, `alumniOf`, URL LinkedIn, `knowsAbout`) | `layout.tsx:108-133` **et** `company/layout.tsx:66-80` | **Non** — deux copies, toutes deux dans des layouts |
| Levée : `FundingEvent`, 1 500 000 EUR, Larry Berger / La Financière Saint-James / Kima Ventures | `layout.tsx:134-148` **et** `company/layout.tsx:81-96` | **Non** pour le balisage. **Oui** pour le texte visible : aujourd'hui il n'existe que dans `blog/cleo-labs-raises-1-5m-preseed.tsx` et dans un bandeau de `02-entreprise.html` |
| `knowsAbout` × 14 | `layout.tsx:149-164` | **Non** |
| Adresse postale, 17 rue Berteaux Dumas, 92200 Neuilly-sur-Seine | `layout.tsx:186-192` | **Non** |
| `sameAs` × 6 — LinkedIn, X, YouTube, Crunchbase, Product Hunt, **Wikidata Q138466568** | `layout.tsx:193-200` | **Non** — et **aucun gabarit ne porte de lien externe**, donc rien ne les remplacerait |
| `taxID` / `iso6523Code` FR20984567883 | `layout.tsx:215-216` | **Non**. Cohérent avec le SIREN 984567883 du pied de maquette |
| `contactPoint` `contact@cleolabs.co` | `layout.tsx:201-214` | **Non** — mais **contredit** par `hello@` dans le pied de maquette |
| `WebSite` + `SearchAction` | `layout.tsx:262-282` | **Non** |
| `VideoObject` | `layout.tsx:283-310` | **Non** — mais il pointe `/hero-video.mp4` ; si la maquette change les médias de l'accueil, le fichier cité peut ne plus exister |
| `robots.txt` (7 agents IA en `allow`) | `src/app/robots.ts` | **Non** |
| `llms.txt` / `llms-full.txt` / `llms-fr.txt` | `public/` | **Non** au sens du fichier — **oui** au sens du contenu : ils listent 14 URL et décrivent une architecture. Tout changement d'URL ou de vocabulaire les périme en silence |
| Sitemap, canonical, hreflang | `src/app/sitemap.ts`, `generateMetadata` de chaque layout | **Non** |
| **Le papier, sa méthode, ses chiffres** | `ResearchPageClient.tsx` (475 l.) + `research.ts` + le PDF | **Oui, entièrement** — et **aucun gabarit ne le remplace** |
| **MARIA comme nom** | 159 occurrences, 25 fichiers, dont 12 dans `MariaActionPlanPageClient` et 15 dans `platform/layout` | **Oui, massivement** — la maquette en porte **1** |
| **Les 302 paires FAQ du blog** | `blog-posts.json` → `faq[]`, rendues en `FAQPage` par `ArticleShell` | **Oui** si le blog est reconstruit sur `12-article.html`, qui n'a pas de bloc FAQ |
| **Les 1 121 mots-clés distincts** | `blog-posts.json` → `keywords[]` → `TechArticle.keywords` + `about[]` | **Oui**, même condition |
| **Les 108 auteurs `Person` par article** | `ArticleShell.tsx:86-118` via `AUTHORS` | **Oui** — `12-article.html` signe « Équipe Cleo », sans personne nommée |

**Lecture en une phrase :** le socle d'entité au sens strict — nom, fondatrices, levée,
investisseurs, adresse, `sameAs`, logo, SIREN — est **hors d'atteinte** d'un changement de
gabarit, parce qu'il vit dans les layouts. Ce qui est dans la ligne de tir, c'est **la
preuve** : les travaux de recherche, le nom MARIA, les auteurs signés du blog, les FAQ et
les mots-clés. C'est-à-dire tout ce qui distingue une entreprise déclarée d'une entreprise
citée.

---

## 8. Ce qui manque, du plus grave au moins grave

1. **Aucun gabarit pour `/research`, `/maria-action-plan`, `/agents`.** Trois pages, trois
   blocs de preuve, zéro remplaçant. Et le mot « Research » a changé de sens dans la
   maquette : il nomme une fonctionnalité produit. Un port sans exception explicite fait
   disparaître la page de recherche **et** rend son retour ambigu.
2. **Le papier n'a pas d'identifiant pérenne, pas de balisage `ScholarlyArticle`, pas de
   métadonnées PDF, pas d'entrée sitemap, un seul lien entrant, et ses trois auteurs ne
   sont pas affichés.** C'est le trou le plus coûteux du site aujourd'hui, indépendamment
   de la maquette.
3. **`0.81` de score F1 s'affiche sur `/research` sans exister dans le livre blanc que la
   même page fait télécharger.** À traiter avant toute republication de la page. Soit le
   chiffre est retracé à une mesure datée, soit il sort.
4. **`llms-fr.txt` ne nomme jamais MARIA**, et n'est déclaré dans aucun `<head>`.
5. **`/maria-action-plan` est orpheline** : 4 blocs JSON-LD, 0 lien entrant, absente des
   trois `llms*.txt`.
6. **Trois descriptions incompatibles de MARIA** circulent (5 agents fonctionnels /
   5 étapes de pipeline / 11 agents par vérification), et la seule à jour est en 404.
7. **Le sitemap servi déclare 2 URL en 404** (`/en|/fr/resources/gdpr-compliance`), et
   `llms.txt` + `llms-full.txt` pointent vers la même page morte.
8. **`12-article.html` n'a ni FAQ, ni mots-clés, ni auteur nommé.** Le blog porte
   108 `TechArticle`, 302 paires FAQ et 1 121 mots-clés distincts ; le gabarit qui doit le
   remplacer n'a de place pour aucun des trois.
9. **`hello@` contre `contact@`** : deux adresses pour une entité.
10. **Deux chercheuses inventées dorment dans `research.ts:79-82`**, avec photos déjà
    déclarées dans `construire.mjs`. À ne jamais rebrancher.
11. **Aucun lien externe dans les 24 gabarits** (0 sur 305 `href`, dont 130 vers `#`).
    Rien qui pointe vers un texte officiel, un profil, un investisseur.

---

## 9. Ce qui doit absolument survivre à un portage

Par ordre de fragilité, du plus fragile au plus solide.

1. **La page `/research` et son PDF.** Elle n'a pas de remplaçant. Si elle ne fait pas
   partie du port, elle doit rester servie telle quelle, avec son layout, sa route et son
   entrée sitemap. Ne pas la laisser tomber dans l'intervalle.
2. **Les trois auteurs du papier.** Naomie Halioua, Alexandre Bloch, Anaëlle Guez. Ce sont
   des `Person` reliables à des `sameAs` LinkedIn existants. C'est le pont le plus direct
   entre le travail scientifique et l'entité.
3. **Le nom MARIA, avec une seule définition.** Choisir laquelle des trois est vraie et
   aligner les trois `llms*.txt`, `/research` et la future page produit dessus.
4. **Les 4 blocs JSON-LD de `/maria-action-plan`** — `DefinedTerm`, `HowTo`, `FAQPage`,
   `BreadcrumbList`. Ils ne coûtent rien à garder et ils sont uniques sur le site.
5. **Le `TechArticle` du blog avec son auteur nommé, ses `keywords` et sa `faq[]`.**
   `ArticleShell.tsx` produit ces trois choses pour 108 pages. Si `12-article.html`
   remplace le rendu, il lui faut un emplacement pour la FAQ et une signature de personne.
6. **Le `<head>` du layout `[locale]`** en entier : `Organization` avec ses 6 `sameAs`
   dont Wikidata, les deux fondatrices en `Person`, le `FundingEvent`, l'adresse, le
   `taxID`. Il est hors de la ligne de tir tant que le port reste un port de corps —
   à condition que ce soit écrit noir sur blanc dans le plan de port.
7. **`robots.ts` et les trois `llms*.txt`**, avec leurs URL remises à jour le jour du port.
8. **Le pied de page à 43 liens réglementaires de la maquette.** Celui-là est un gain :
   le garder.

---

## 10. Réponse à la question posée

> « Si on garde cette structure de maquette, est-ce qu'on est OK avec le SEO et le GEO de
> l'ancien site ? »

**Sur ma lentille — les travaux de recherche et le socle d'entité — non, pas en l'état.**

Le socle d'entité au sens administratif ne bouge pas : nom légal, fondatrices, levée,
investisseurs, adresse, SIREN, `sameAs` Wikidata, logo. Ces 12 signaux vivent tous dans
`src/app/[locale]/layout.tsx` et `company/layout.tsx`, aucun gabarit ne les touche.
Sur ce point précis, la crainte « je veux pas qu'il change » est fondée : il ne change pas,
**tant que le port reste un port de corps et que c'est écrit dans le plan**.

Ce qui change, c'est la preuve. La maquette porte **1** occurrence de MARIA contre 159 dans
le dépôt, **0** mention du livre blanc, **0** lien externe sur 305, et **aucun gabarit**
pour les trois pages qui expliquent comment le moteur fonctionne. Elle réutilise en plus le
mot « Research » pour désigner une fonctionnalité produit, ce qui rend le retour de la page
scientifique ambigu au lieu de simplement absent.

Et il y a un problème qui n'attend pas le port : **la page qui promet la traçabilité affiche
un score F1 de 0,81 qui ne figure pas dans le document qu'elle fait télécharger**, et le
livre blanc le plus solide de l'entreprise n'a ni identifiant pérenne, ni auteurs affichés,
ni balisage de publication, ni entrée sitemap, ni plus d'un lien entrant.

Le port des gabarits ne crée pas ce trou. Il le rend permanent, en supprimant la seule page
qui le rendait visible.
