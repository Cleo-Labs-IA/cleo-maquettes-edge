# Portage des maquettes : ce que perdent les en-têtes et la copie indexable

Mesuré le 27 août 2026. Lentille : `<title>`, meta description, arbre H1→H6,
volume de texte indexable, expressions métier.

**Ce qui a été comparé**
- En ligne : HTML servi de `https://www.cleolabs.co/fr` et `/en` (curl, UA navigateur),
  + DOM hydraté (Playwright) pour vérifier qu'aucun signal n'est réservé au JS.
- Maquette : `sortie/01-accueil.html` et `sortie/01-accueil-en.html`, lues à plat
  et après exécution du JS.
- Code : `cleo-landing/src/app/[locale]/layout.tsx`, `page.tsx`, `robots.ts`, `sitemap.ts`,
  et `cleo-maquettes-edge/construire.mjs`.

**Point de méthode.** Le HTML servi et le DOM hydraté donnent **exactement** les mêmes
en-têtes des deux côtés (22 titres en ligne servis = 22 hydratés ; 20 en maquette servis =
20 après JS). Aucun signal d'en-tête n'existe seulement après hydratation, ni d'un côté ni
de l'autre. Le robot voit ce que voit le navigateur. C'est une bonne nouvelle, et c'est la
seule chose que la mesure a rassurée.

Le comptage de mots est fait par parcours des nœuds texte, pas par `textContent` :
`textContent` colle les blocs entre eux (« façon plus rapidede savoir ») et sous-compte
de ~26 %.

---

## 1. Tableau des signaux

| Signal | En ligne (FR) | Maquette (FR) | Verdict |
|---|---|---|---|
| `<title>` | `Conformité Produit Automatisée pour les Marques Internationales \| Cleo Labs` (75 car.) | `Cleo — Accueil` (14 car.) | **perdu** |
| `<title>` (EN) | `Automated Product Compliance for Global Brands \| Cleo Labs` (58 car.) | `Cleo — Accueil EN` (17 car.) | **perdu** |
| meta description | 138 car. FR / 136 car. EN | **absente** | **perdu** |
| `<link rel=canonical>` | `https://www.cleolabs.co/fr` | absent | perdu (au niveau page) |
| hreflang | `en`, `fr`, `x-default` | aucun | perdu (au niveau page) |
| `og:title` / `og:description` / `og:image` / `og:locale` | 4/4 renseignés | 0/4 | **perdu** |
| `twitter:card` + titre + description | `summary_large_image` renseigné | absent | perdu |
| `<meta name=robots>` | `index, follow` | absent | perdu |
| `rel=alternate` vers `/llms.txt` + `/llms-full.txt` | 2 liens | aucun | perdu (au niveau page) |
| JSON-LD `FAQPage` | 17 questions, **957 mots** de réponses FR / 844 EN | aucun | **perdu** |
| JSON-LD `HowTo` | 3 étapes, 43 mots | aucun | **perdu** |
| JSON-LD `Organization` | 3 839 octets, fondatrices, levée, investisseurs | aucun | perdu (au niveau page) |
| JSON-LD `WebSite` + `SearchAction` | présent | aucun | perdu (au niveau page) |
| JSON-LD `VideoObject` | présent | aucun | perdu (au niveau page) |
| `lang` sur `<html>` | `fr` / `en` | `fr` / `en` | conservé |
| H1 | 1 | 1 | conservé (chaîne différente, cf. §3) |
| H2 | **8** | **5** | **perdu (−3)** |
| H3 | **13** | **6** | **perdu (−7)** |
| H4 | 0 | 8 (tous dans le pied) | nouveau |
| Titres au total | 22 | 20 | −2 |
| Mots de corps éditorial (hors nav/pied) | **1 055** FR / 952 EN | **699** FR / 670 EN | **perdu (−356 FR, −34 %)** |
| Mots de page entière | 1 149 FR / 1 038 EN | 1 048 FR / 1 016 EN | −101 FR (−9 %) |
| Mots dans la nav | 25 | **204** | nouveau |
| Mots dans le pied | 69 | **145** | nouveau |
| `<a>` au total | 54 | 99 | nouveau (mais 46 pointent sur `#`) |
| Cibles uniques | 37 (24 internes + 13 externes) | 17 | **perdu (−20)** |
| Liens sortants vers la presse | 6 (tech.eu, EU-Startups, Vestbee, fintech.global, RegTech Analyst, The Legal Wire) | **0** | **perdu** |
| `<img>` avec `alt` renseigné | 14 / 16 | 9 / 17 | perdu (−8 alt) |
| Noms de textes réglementaires cités (page entière) | 8 | **24** | **nouveau (+16)** |
| Noms de textes cités dans le corps éditorial | 8 | 5 | perdu (−3) |

`robots.ts` et `sitemap.ts` vivent à la racine de `src/app` et ne sont pas touchés par un
changement de page d'accueil : les 8 règles de bots (dont GPTBot, ClaudeBot, PerplexityBot,
Google-Extended, CCBot) et le sitemap survivent. Idem `llms.txt` (758 mots) et
`llms-full.txt` (2 212 mots), qui sont des fichiers du site, pas de la page.

---

## 2. Où vivent les signaux dans le code : ce qui décide vraiment du coût

C'est le fait le plus actionnable du rapport.

**`src/app/[locale]/layout.tsx`** porte, via `generateMetadata` :
title, description, canonical, hreflang, OpenGraph, Twitter, et les JSON-LD
`Organization`, `WebSite`, `VideoObject`, plus les `<link rel=alternate>` vers llms.txt.

**`src/app/[locale]/page.tsx`** porte : les JSON-LD `FAQPage` et `HowTo`, et l'appel des
12 composants de section.

Conséquence directe : **si le portage remplace `page.tsx` et laisse `layout.tsx` intact,
alors 12 lignes du tableau ci-dessus ne bougent pas** (title, description, canonical,
hreflang, OG, Twitter, robots, llms.txt, Organization, WebSite, VideoObject). Ce qui meurt
sans intervention, c'est `FAQPage` + `HowTo`, plus tout ce qui est dans le corps.

Ce n'est pas une nuance de confort : ça fait passer le sujet de « on perd tout le SEO du
site » à « on perd deux blocs de données structurées et un tiers de la copie ». Les deux se
recollent, mais il faut le décider.

---

## 3. Le H1 : mesure exacte de l'écart

### Français
```
en ligne : "Vendez partout, conformes partout."        34 car., 4 mots
maquette : "Vendez partout. Conformez-vous partout."   39 car., 4 mots
```
- Correspondance exacte : **non**.
- Distance de Levenshtein : **7 caractères, soit 18 % de la chaîne**.
- Mots communs : 3/4 (`vendez`, `partout`, `partout`). Mot perdu : `conformes`.
  Mot ajouté : `conformez-vous`.
- Le radical `conform-` est présent des deux côtés. Aucune des deux versions ne contient
  l'expression de tête « conformité produit » : elle vit dans le `<title>`, la description
  et le corps, pas dans le H1. **Le changement de H1 ne coûte donc aucun mot-clé de tête.**
- Ce qu'il coûte réellement : l'identité de la chaîne. Une citation externe, un extrait
  affiché par un moteur, une réponse d'IA qui reprend le H1 mot pour mot ne correspond plus.
  Et la ponctuation change la structure : une proposition coordonnée (« Vendez partout,
  conformes partout ») devient deux phrases impératives.
- **Détail que le portage corrige** : en ligne, le H1 est coupé en deux `<span class="block">`
  sans espace, donc le texte lu par un robot est littéralement
  `Vendez partout,conformes partout.` — sans espace après la virgule. La maquette écrit une
  chaîne propre. C'est un gain, petit mais réel.

### Anglais
```
en ligne : "Sell anywhere, comply everywhere."   33 car., 4 mots
maquette : "Sell everywhere. Comply anywhere."   33 car., 4 mots
```
- Distance de Levenshtein : **10 caractères, 30 % de la chaîne**.
- Mots communs : **4/4**. Aucun mot perdu, aucun ajouté : `anywhere` et `everywhere` ont été
  **permutés**.
- Coût en mots-clés : **zéro**, le sac de mots est identique.
- Coût en sens : réel. « Sell anywhere, comply everywhere » = vendez où vous voulez, restez
  conforme partout. « Sell everywhere. Comply anywhere. » = vendez partout, conformez-vous
  n'importe où. La promesse d'exhaustivité passe de la conformité à la vente. Ce n'est pas
  un problème de référencement, c'est un problème de copie, et il est identifiable sans
  aucun outil.

---

## 4. Les H2 : combien survivent

**En ligne, 8 H2** (et non 6) — vérifiés identiques dans le HTML servi et le DOM hydraté :

| # | H2 en ligne (FR) | Section | Mots de la section |
|---|---|---|---|
| 1 | Il existe une façon plus rapide de savoir ce qui s'applique. | ProblemSection | 56 |
| 2 | Zéro règle manquée, sur aucun marché. | DemoFeatureGrid (5 H3) | 251 |
| 3 | Pensé pour votre rôle dans la chaîne | ByProfileSection | 56 |
| 4 | Chaque autorité. Chaque source. Suivie. | CoverageManifest | 79 |
| 5 | Ce qu'on dit de Cleo Labs | PressSection | 111 |
| 6 | Architecture de sécurité, documentée | Security (6 H3) | 134 |
| 7 | Questions fréquemment posées | FAQ (17 questions) | 163 |
| 8 | Le dashboard, sur un vrai catalogue. | FinalCTA | 37 |

**En maquette, 5 H2** :

| # | H2 maquette (FR) | Mots |
|---|---|---|
| 1 | Chaque fonction a été automatisée. La conformité produit, non. | 118 |
| 2 | Du journal officiel à l'obligation testable, le cycle complet | 267 |
| 3 | La conformité produit d'un distributeur, sur des dizaines de marchés | 184 |
| 4 | Ce que la machine propose, un humain le valide. | 93 |
| 5 | Un nouveau pays n'est plus un projet. C'est une décision. | 160 |

**Le compte demandé :**

- **Repris à l'identique : 0 sur 8.** Aucune chaîne de H2 en ligne ne se retrouve dans la
  maquette, à la casse et aux espaces près.
- **Reformulés (même fonction dans la page, chaîne entièrement différente) : 3 sur 8.**
  - #1 → maquette #1 (le bloc « problème »)
  - #2 → maquette #2 (la grille de fonctionnalités)
  - #8 → maquette #5 (le CTA final)
- **Disparus sans équivalent : 5 sur 8.**
  - #3 « Pensé pour votre rôle dans la chaîne »
  - #4 « Chaque autorité. Chaque source. Suivie. »
  - #5 « Ce qu'on dit de Cleo Labs »
  - #6 « Architecture de sécurité, documentée »
  - #7 « Questions fréquemment posées »
- **Nouveaux : 2.** maquette #3 (le cas Decathlon, qui existe en ligne mais sans H2 propre)
  et maquette #4 (la validation humaine, sans équivalent en ligne).

Les 8 H4 de la maquette sont tous dans le pied de page (`Cleo`, `Secteurs`, `Marchés`,
`Produit`, `Cas clients`, `Réglementations européennes`, `Réglementations nord-américaines`,
`Autres réglementations`). Ce sont des étiquettes de colonnes de navigation, pas de la
hiérarchie éditoriale. Compter la maquette à « 20 titres » sans le dire serait trompeur :
sa hiérarchie de contenu réel fait **12 titres** (1 H1 + 5 H2 + 6 H3) contre 22 en ligne.

---

## 5. Le volume de texte indexable

| | FR en ligne | FR maquette | Δ | EN en ligne | EN maquette | Δ |
|---|---|---|---|---|---|---|
| Corps éditorial | **1 055** | **699** | **−356 (−34 %)** | 952 | 670 | −282 (−30 %) |
| Nav | 25 | 204 | +179 | 22 | 201 | +179 |
| Pied | 69 | 145 | +76 | 64 | 145 | +81 |
| Page entière | 1 149 | 1 048 | −101 (−9 %) | 1 038 | 1 016 | −22 (−2 %) |

Le chiffre de page entière (−9 %) est rassurant et faux. Le corps éditorial maigrit d'un
tiers ; le compte total est rattrapé par une nav et un pied de page qui pèsent 349 mots
contre 94. Ce sont des mots de menu, répétés sur les 22 gabarits — utiles pour le maillage,
pas pour la pertinence de la page d'accueil.

---

## 6. Les expressions métier

Comptées sur la page entière, puis sur le corps éditorial seul (le compte qui porte la
pertinence de la page).

### Français

| Expression | ligne (page) | maq (page) | ligne (corps) | maq (corps) |
|---|---|---|---|---|
| conformité produit | 4 | 4 | 3 | 3 |
| conformité (toutes formes) | 12 | 6 | **10** | **4** |
| réglementation | 4 | 4 | **4** | **1** |
| réglementaire | 5 | 4 | 4 | 3 |
| marché(s) | 8 | **16** | 8 | **10** |
| obligation | 2 | 3 | 2 | 2 |
| étiquetage | 0 | 2 | 0 | 1 |
| substance | 0 | 0 | 0 | 0 |
| autorité | 4 | 3 | 4 | 2 |
| fabricant | 2 | **0** | 1 | **0** |
| importateur | 2 | **0** | 1 | **0** |
| distributeur | 2 | 1 | 1 | 1 |
| marketplace | 2 | **0** | 1 | **0** |
| code HS | 1 | **0** | 1 | **0** |
| certification | 3 | 1 | 3 | **0** |
| audit | 1 | **0** | 1 | **0** |
| veille | 2 | 1 | 2 | 1 |
| journal officiel | 0 | 1 | 0 | 1 |
| textile / cosmétique / jouet / électronique / alimentaire | 2 au total | **11 au total** | 2 | 1 |

**Réponse à la question posée : non, la maquette n'a pas globalement moins d'expressions
métier — elle en a plus.** Mais la répartition change de nature. Les gains sont dans la nav
et le pied (secteurs, marchés, noms de textes) ; les pertes sont dans le corps.

### Noms de textes réglementaires

| Texte | ligne (page) | maq (page) | ligne (corps) | maq (corps) |
|---|---|---|---|---|
| REACH | 2 | 3 | 2 | 1 |
| CPSIA | **0** | 5 | 0 | 2 |
| PPWR | **0** | 2 | 0 | 0 |
| RSGP / GPSR | **0** | 2 | 0 | 0 |
| CLP | **0** | 1 | 0 | 0 |
| EN 71 | **0** | 2 | 0 | 0 |
| Proposition 65 | **0** | 4 | 0 | 1 |
| ASTM | **0** | 2 | 0 | 0 |
| FTC Green Guides | **0** | 2 | 0 | 0 |
| UKCA | **0** | 1 | 0 | 0 |
| Batteries (UE) 2023/1542 | **0** | 2 | 0 | 0 |
| AICIS | **0** | 1 | 0 | 0 |
| PFHxA | **0** | 1 | 0 | 0 |
| CITES (EN) | **0** | 1 | 0 | 1 |
| ESPR | 2 | 2 | 2 | 0 |
| TSCA | 2 | 2 | 2 | 0 |
| AI Act | 1 | 2 | 1 | 0 |
| PFAS | 1 | 2 | 1 | 0 |
| SOC 2 | 2 | **0** | 1 | **0** |
| ISO 27001 | 2 | **0** | 1 | **0** |
| RGPD / GDPR | 2 | **0** | 1 | **0** |
| Article 28 | 1 | **0** | 1 | **0** |
| MARIA | 1 | **0** | 1 | **0** |

**17 noms de textes apparaissent en maquette et nulle part en ligne. Aucun n'apparaît en
ligne sans être en maquette** — sauf les textes de sécurité et de gouvernance (SOC 2,
ISO 27001, RGPD/Article 28) et la marque MARIA, qui disparaissent complètement.

Réserve : dans le corps éditorial seul, la maquette ne cite plus PPWR, RSGP, CLP, EN 71,
ESPR, TSCA, AI Act ni PFAS. Ces 16 mentions vivent dans le pied de page, répliqué sur les
22 gabarits. Un même nom répété à l'identique sur 22 pages ne rend pas la page d'accueil
plus pertinente sur ce nom ; il crée du maillage interne vers les pages `08-reglementation`
et `09-texte`, ce qui est un autre bénéfice, réel mais différent.

---

## 7. Le `<title>` et la meta description de la maquette

**Le title existe. La description n'existe pas.**

`construire.mjs` ligne 334 :
```js
<title>Cleo — ${p.titre}</title>
```
`p.titre` vient de la table `PAGES` (lignes 16-42), où l'accueil est déclaré
`{ fichier: '01-accueil.html', titre: 'Accueil', source: 'edgecomply.com/' }`.
Le champ `titre` est **une étiquette de navigation interne au chantier**, pas un titre de
référencement : la table donne `Kit`, `Offre`, `Un texte`, `Un poste`, `Légal`. Le
générateur n'a aucun champ `description`, aucun `canonical`, aucun `hreflang`, aucun OG,
aucun JSON-LD : les 12 lignes de `<head>` produites sont charset, viewport, title, un
commentaire, et le `<style>`.

Défaut au passage : la maquette anglaise sort `<title>Cleo — Accueil EN</title>` — un mot
français dans le titre de la page anglaise.

Les 14 contrôles bloquants de `construire.mjs` (fin de fichier) vérifient les polices, les
balises non fermées, les `clamp()` sans espace, la monospace, les marqueurs d'images non
résolus. **Aucun ne vérifie un signal de référencement.** C'est cohérent : ces fichiers ont
été construits comme des études de composition relevées sur `edgecomply.com`, pas comme des
pages destinées à être servies. Le `<head>` n'a jamais été dans leur périmètre.

---

## 8. Ce qui serait perdu, du plus coûteux au moins coûteux

1. **La meta description, sur les deux langues.** 138 caractères FR, 136 EN, contenant
   « conformité produit », « 106 pays », « 25 000+ réglementations », « CSRD, AGEC, GPSR ».
   La maquette n'en génère aucune. C'est le seul signal du tableau qui passe de « rédigé et
   servi » à « inexistant » sans que rien ne le remplace, dans les deux langues.

2. **Le `<title>`.** 75 caractères FR portant « Conformité Produit Automatisée pour les
   Marques Internationales | Cleo Labs » → 14 caractères, `Cleo — Accueil`. L'expression de
   tête disparaît du signal le plus lourd de la page. Perte mesurée : 61 caractères FR,
   41 EN, et 100 % des mots-clés du titre.

3. **Le JSON-LD `FAQPage` : 17 questions et 957 mots de réponses en FR, 844 en EN.**
   Mesure importante : **ces réponses n'existent nulle part dans le DOM visible** — j'ai
   vérifié que le texte de la première réponse est absent du texte de la page, alors que la
   question y est. Ce sont 957 mots qui n'existent QUE dans les données structurées. C'est
   le plus gros bloc de contenu de la page en ligne, il est invisible à l'œil, et il vit
   dans `page.tsx`, c'est-à-dire précisément dans le fichier qu'un portage remplace.

4. **La section sécurité et ses preuves nommées.** H2 « Architecture de sécurité,
   documentée » + 6 H3 + 134 mots, et avec elle les seules occurrences de SOC 2 (×2),
   ISO 27001 (×2), RGPD/GDPR (×2), « Article 28 ». Zéro occurrence en maquette. Pour un
   acheteur conformité, ce sont des termes de qualification, pas de la décoration.

5. **La section « Pensé pour votre rôle dans la chaîne » et son vocabulaire de personas.**
   56 mots, et avec elle les 6 seules occurrences de `fabricant`, `importateur`,
   `marketplace` de la page. La maquette tombe à 0 sur les trois. Ce sont exactement les
   trois routes que le sitemap déclare en priorité 0.8 (`/for/manufacturers`,
   `/for/importers-distributors`, `/for/marketplaces`) : la page d'accueil cesse de les
   décrire et cesse d'y pointer.

6. **Le tiers du corps éditorial : −356 mots FR, −282 EN.** Réparti sur 5 sections
   disparues (56 + 79 + 111 + 134 + 163 = 543 mots FR) moins 277 mots de sections nouvelles.

7. **7 H3 sur 13, et 3 H2 sur 8.** La hiérarchie de contenu réel passe de 22 à 12 titres.

8. **Les 6 liens sortants vers la couverture presse** (tech.eu, EU-Startups, Vestbee,
   fintech.global, RegTech Analyst, The Legal Wire) et les 111 mots de la section
   « Ce qu'on dit de Cleo Labs ». La maquette a **0 lien externe**.

9. **Le JSON-LD `HowTo`** (3 étapes, 43 mots), et — si le portage touche `layout.tsx` —
   `Organization` (3 839 octets, fondatrices nommées, levée, investisseurs), `WebSite` +
   `SearchAction`, `VideoObject`. Ces trois-là ne sont perdus que dans ce cas.

10. **20 cibles de liens uniques** (37 → 17), et 46 `<a href="#">` morts.

11. **8 attributs `alt`** (14/16 renseignés → 9/17).

12. **La mention `MARIA`**, unique occurrence en ligne, absente de la maquette. C'est le nom
    propre de l'architecture, celui que `llms.txt` met en avant en première ligne.

13. **`og:image` et la carte Twitter `summary_large_image`.** Tout partage sur LinkedIn, X
    ou Slack perd son visuel et son titre.

14. **La chaîne exacte du H1**, dans les deux langues (§3).

---

## 9. Ce qui serait gagné

1. **17 noms de textes réglementaires qui n'existent nulle part en ligne** : CPSIA (×5),
   Proposition 65 (×4), PPWR, RSGP/GPSR, CLP, EN 71, ASTM, FTC Green Guides, UKCA,
   Batteries (UE) 2023/1542, Passeport numérique (ESPR), AICIS, PFHxA, EPI (UE) 2016/425,
   Loi 96 (Québec), GB (Chine), CITES. Aucun texte ne fait le chemin inverse.

2. **Un vrai maillage thématique dans le pied.** 145 mots contre 69, organisés en
   8 colonnes : 8 secteurs nommés, 6 marchés nommés, 3 groupes de réglementations. En ligne,
   le pied liste 5 juridictions et 4 solutions. La maquette décrit un catalogue, pas un
   organigramme.

3. **Une nav de 204 mots contre 25**, avec des méga-menus qui décrivent les trois features
   (« 2 812 obligations écrites sous forme testable ») et listent 8 textes européens. En
   ligne, la nav servie ne contient que 4 étiquettes.

4. **Le cas Decathlon promu en section avec son propre H2** (184 mots, 4 mentions contre 2).
   En ligne, la citation Decathlon existe mais sans en-tête propre : elle n'est rattachée à
   aucun titre.

5. **Un H1 propre.** En ligne, la découpe en deux `<span class="block">` produit
   `Vendez partout,conformes partout.` sans espace pour un robot. La maquette écrit une
   chaîne correcte.

6. **Une section sans équivalent** : « Ce que la machine propose, un humain le valide. »
   (93 mots). Sur un marché où la question « et si l'IA se trompe » est la première
   objection, c'est un sujet que la page en ligne ne traite nulle part.

7. **Une nouvelle preuve chiffrée** : « 2 812 obligations écrites sous forme testable »,
   absente en ligne.

---

## 10. Ce que je n'ai pas pu mesurer

- **Toute performance.** Positions, trafic, impressions, volumes de recherche, CTR : pas de
  Search Console ni d'outil de mots-clés dans ce contexte. Rien de ce rapport ne dit qu'une
  position bougera. Il dit quels signaux existent et lesquels n'existeraient plus.
- **Les backlinks entrants et leurs ancres.** Impossible de savoir si des sites externes
  citent le H1 ou les H2 actuels, donc impossible de chiffrer ce que coûte le changement de
  chaîne au-delà du fait qu'elle change.
- **Ce que les moteurs génératifs citent aujourd'hui.** Le site sert `llms.txt`,
  `llms-full.txt` et autorise 8 agents (GPTBot, ClaudeBot, PerplexityBot, Google-Extended,
  CCBot…). Savoir quels passages sont effectivement repris demanderait d'interroger ces
  moteurs, ce que je n'ai pas fait.
- **La forme du portage.** Je ne sais pas si la maquette remplacerait `page.tsx` seul, ou
  aussi `layout.tsx`. Le §2 chiffre les deux cas ; personne ne m'a dit lequel est prévu.
  C'est la question qui change le plus le résultat.
- **Les 20 autres gabarits.** Seul l'accueil est mesuré. Le site en ligne déclare 37 routes
  au sitemap × 2 langues ; les maquettes couvrent 22 gabarits qui ne se recouvrent pas
  un-à-un avec ces routes. La correspondance des URL est un chantier entier, non ouvert ici.
- **Le contenu réel derrière les liens de la maquette.** 46 liens sur 99 pointent sur `#`.
  Attendu pour une maquette, à recompter une fois les cibles réelles branchées.
- **Le CSS.** Consigne respectée : aucune mesure de taille, de couleur ou de mise en page.
  Des agents modifiaient les fichiers pendant la mesure ; les comptes de contenu ci-dessus
  sont stables entre la lecture à plat et la lecture après JS, dans les deux langues.

---

## Verdict

Le risque existe et il est chiffrable, mais il n'est pas là où on le craint. Le portage ne
détruit pas « le SEO du site » : `robots.ts`, `sitemap.ts`, `llms.txt`, `llms-full.txt` et
la moitié des métadonnées (dans `layout.tsx`) ne sont pas touchés par un changement de page
d'accueil.

Ce qui se perd vraiment tient en trois lignes : **une meta description qui n'existe pas dans
le générateur, un `<title>` qui vaut une étiquette de menu, et 957 mots de réponses FAQ en
données structurées qui vivent dans le fichier même qu'un portage remplace.** Les trois se
recodent, et les deux premiers sont l'affaire de deux champs à ajouter à la table `PAGES` de
`construire.mjs`.

Sur la copie, l'échange est réel dans les deux sens : le corps éditorial perd un tiers de son
volume et cinq sections dont la sécurité et les personas de la chaîne, mais la page gagne
17 noms de réglementations que le site en ligne ne prononce jamais. La maquette parle plus de
réglementation et moins de Cleo. Ce n'est pas un accident de référencement, c'est un choix
éditorial — il mérite d'être fait sciemment.
