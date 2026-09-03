# Maillage interne et URL — site en ligne vs maquettes V5

Mesuré le 27/08/2026. Lentille : URL, maillage interne, texte d'ancre, images/alt.
Aucun chiffre de trafic, de position ou de volume de recherche n'apparaît ici : nous
n'avons ni Search Console ni outil de mots-clés dans ce contexte. Tout ce qui suit
est un **signal présent ou absent**, compté.

Sources :
- En ligne : `https://www.cleolabs.co/fr` et `/en`, HTML **servi** (curl, UA Chrome) +
  DOM hydraté (Playwright, Chromium 1440×900), `https://www.cleolabs.co/sitemap.xml`,
  et le repo `/Users/naomiehalioua/cleo-landing`.
- Maquettes : les 26 fichiers de `/Users/naomiehalioua/cleo-maquettes-edge/sortie/`.
- Scripts : `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-seo/`

**Servi vs hydraté — une seule différence trouvée.** Sur `/fr`, le HTML servi contient
54 liens `<a>`, le DOM hydraté 55. Le lien supplémentaire est `/fr/privacy`. Tout le
reste du maillage de l'accueil est dans le HTML servi : aucun menu déroulant, aucune
destination ne dépend de JavaScript. Côté maquettes, servi et hydraté sont identiques
(99 liens des deux côtés). Le robot voit donc, des deux côtés, ce que nous mesurons.

---

## 1. Tableau des signaux

| Signal | En ligne (`/fr`) | Maquette (`01-accueil.html`) | Verdict |
|---|---|---|---|
| URL déclarées au sitemap | 532 (266 chemins × 2 locales) | 0 — aucun sitemap | **perdu** |
| Pages atteignables depuis l'accueil en ≤3 clics | 264 (`/fr`) | 24 fichiers | **perdu** (−240) |
| Couverture du sitemap par le maillage | 256 / 265 chemins `/fr` = 96,6 % | sans objet | **perdu** |
| Destinations distinctes atteintes par l'accueil | 25 | 16 | **perdu** (−9) |
| Liens `<a>` sur l'accueil | 54 | 99 | nouveau (+45) |
| Liens morts (`href="#"`) sur l'accueil | 0 | 46 (46,5 %) | **perdu** |
| Liens morts sur l'ensemble du gabarit | — | 1 060 / 2 280 ancres = 46,5 % | **perdu** |
| Textes d'ancre distincts sur l'accueil | 38 | 79 | **nouveau** (+41) |
| Ancres génériques (« En savoir plus » / « Learn more ») | 0 | 3 | **perdu** |
| Ancres sans nom accessible (ni texte, ni `alt`, ni `aria-label`) | 0 | 0 | conservé |
| Liens sortants externes | 12 (10 domaines dont 6 titres de presse) | 0 | **perdu** |
| Profondeur d'URL | 1 à 4 segments après la locale | 1 segment, fichier plat `.html` | **perdu** |
| Segment de langue dans l'URL | `/fr/…` et `/en/…` | aucun (suffixe `-en` sur un seul fichier) | **perdu** |
| `rel="canonical"` | présent (`https://www.cleolabs.co/fr`) | absent | **perdu** |
| `hreflang` (`en`, `fr`, `x-default`) | 3 déclarations | 0 | **perdu** |
| Lien FR ↔ EN dans le corps | l'alternance passe par `hreflang` | **0 lien** vers `01-accueil-en.html` dans les 26 fichiers | **perdu** |
| `robots.txt` avec 7 agents IA autorisés nommément | présent | sans objet (fichiers locaux) | **perdu** si non repris |
| `llms.txt` / `llms-full.txt` déclarés en `<link rel=alternate>` | 2 | 0 | **perdu** |
| Images | 16 | 17 | conservé |
| Images **sans attribut** `alt` | 0 | 0 | conservé |
| Images à `alt` vide | 2 — les deux décoratives (`cloud-bg`) | 8, dont **≈6 porteuses de contenu** | **perdu** |
| Images servies depuis une URL indexable | 16 / 16 (`/logos/…`, `/_next/image`) | 0 / 17 — toutes en `data:` base64 | **perdu** |
| H1 par page | 1 | 1 | conservé |
| H2 / H3 sur l'accueil | 8 / 13 | 5 / 6 | perdu (hors lentille, noté) |

L'accueil EN est identique à l'accueil FR sur tous ces comptages, des deux côtés
(54/40/25/0 en ligne ; 99/46/16/3 en maquette).

---

## 2. Combien de pages le site a-t-il réellement ?

**266 chemins uniques, soit 532 URL** (chaque chemin existe en `/fr` et en `/en`).
Répartition du sitemap servi :

| Famille | Chemins uniques |
|---|---|
| `/jurisdictions/…` | 121 — dont 8 juridictions, 80 juridiction × industrie, 32 juridiction × réglementation, 1 index |
| `/blog/…` | 109 (108 articles + index) |
| `/industries/…` | 11 (10 secteurs + index) |
| `/resources/…` | 8 |
| `/careers/…` | 3 · `/for/…` | 3 |
| pages uniques | `/`, `/changelog`, `/company`, `/legal-data`, `/maria-action-plan`, `/meet`, `/platform`, `/research`, `/security`, `/skills`, `/solutions/product-compliance` |

**Deux écarts entre le sitemap servi et le repo local** (le déploiement est en retard
sur `cleo-landing`) :
- Le sitemap en ligne déclare encore `/resources/gdpr-compliance`, qui **répond 404**.
  Le repo local l'a commentée le 29/07. 2 URL mortes déclarées.
- Le repo local déclare `/pricing`, absent du sitemap en ligne ; `/fr/pricing` répond
  **308**.

**Routes qui existent dans le repo mais ne sont dans aucun sitemap** :
`/customers` + `/customers/[slug]` (3 cas, tous atteints par le maillage), `/privacy`,
`/terms`, `/scan`, `/solutions` (index), `/product/{chat,radar,market-access}` (404 en
ligne), `/agents` (404 en ligne), et 23 pages `/preview/*`.

**Pages orphelines du maillage** — déclarées au sitemap mais **non atteintes en 3 clics
depuis `/fr`** : 9, dont `/fr/platform`, `/fr/changelog`, `/fr/maria-action-plan`,
`/fr/resources/glossary`, `/fr/resources/data`, `/fr/jurisdictions` (l'index lui-même).
C'est un défaut du site actuel, pas de la maquette.

---

## 3. Ce que l'accueil atteint, de chaque côté

**En ligne — 25 destinations internes distinctes** (40 liens internes) :
`/fr` · `/fr/blog` · `/fr/careers` · `/fr/company` ×2 · `/fr/customers` ·
`/fr/for/manufacturers` ×2 · `/fr/for/importers-distributors` ×2 ·
`/fr/for/marketplaces` ×2 · `/fr/industries` · `/fr/jurisdictions/european-union` ·
`/fr/jurisdictions/france` · `/fr/jurisdictions/germany` ·
`/fr/jurisdictions/united-kingdom` · `/fr/jurisdictions/united-states` ·
`/fr/legal-data` ×2 · `/fr/meet` ×10 · `/fr/privacy` · `/fr/research` ×2 ·
`/fr/resources` · `/fr/security` · `/fr/skills` ·
`/fr/solutions/product-compliance` · `/fr/terms` · `/legal-data/docs` ·
`/legal-data/playground`.

Point notable : l'accueil **descend directement dans la couche programmatique** en
liant 5 pages `/jurisdictions/[pays]` au niveau de l'ancre nommée (« 🇫🇷 France »,
« 🇩🇪 Allemagne »…). C'est le point d'entrée du crawl vers les 121 URL de cette famille.

**Maquette — 16 destinations distinctes** (99 liens, dont 46 vers `#`) :
`index.html` · `02-entreprise` · `03-offre` ×3 · `04-secteur` ×8 · `05-marche` ×6 ·
`06-cas-client` ×3 · `07-chat` ×3 · `08-reglementation` ×3 · `09-texte` ×17 ·
`11-blog` · `13-glossaire` · `15-evenements` · `17-modeles` · `18-recrutement` ·
`21-inscription` ×2 · `22-legal`.

**Lecture honnête de l'écart.** Les 16 destinations ne sont pas 16 pages : ce sont
16 *gabarits*. L'accueil de la maquette nomme **17 réglementations** (PPWR, REACH,
RSGP, ESPR, EN 71, Batteries, EPI, AI Act, Proposition 65, PFAS, TSCA, ASTM F963,
TB 117, Loi 96, CPSIA, FTC Green Guides, Allégations vertes) qui pointent toutes vers
le même `09-texte.html`, **8 secteurs** qui pointent tous vers `04-secteur.html`, et
**6 marchés** qui pointent tous vers `05-marche.html`. Dans un portage réel, ces
31 ancres deviendraient 31 URL distinctes. Le maillage de la maquette est donc plus
*riche en intention* qu'il n'y paraît — mais aujourd'hui, tel quel, il collapse.

---

## 4. Correspondance des 24 gabarits avec les routes réelles

`00-composants`, `index` et `01-accueil-noir` sont des outils internes : ils ne
doivent jamais devenir des URL (sinon 3 duplications, dont une copie mot pour mot de
l'accueil).

### A. Existe déjà en ligne — le gabarit remplace une page vivante (13)

| Gabarit | Route en ligne | Statut HTTP | Volume derrière la route |
|---|---|---|---|
| `01-accueil.html` | `/fr` | 200 | 1 |
| `01-accueil-en.html` | `/en` | 200 | 1 |
| `02-entreprise.html` | `/fr/company` | 200 | 1 |
| `03-offre.html` | `/fr/solutions/product-compliance` (et/ou `/fr/platform`) | 200 | 1–2 |
| `04-secteur.html` | `/fr/industries/[slug]` | 200 | **10 pages** |
| `05-marche.html` | `/fr/jurisdictions/[pays]` | 200 | **8 pages** |
| `06-cas-client.html` | `/fr/customers/[slug]` | 200 | **3 pages** (+ index `/customers`) |
| `09-texte.html` | `/fr/jurisdictions/[pays]/regulations/[reg]` | 200 | **32 pages** |
| `10-ressources.html` | `/fr/resources` | 200 | 1 (+ 6 guides) |
| `11-blog.html` | `/fr/blog` | 200 | 1 |
| `12-article.html` | `/fr/blog/[slug]` | 200 | **108 pages** |
| `13-glossaire.html` | `/fr/resources/glossary` | 200 | 1 |
| `18-recrutement.html` + `19-poste.html` | `/fr/careers` + `/fr/careers/[slug]` | 200 | 1 + 2 |
| `22-legal.html` | `/fr/privacy` **et** `/fr/terms` | 200 | 2 (1 gabarit pour 2 URL) |

### B. Serait une page neuve — aucune route en ligne (6)

| Gabarit | Route en ligne ? |
|---|---|
| `14-terme.html` (page d'un terme) | **aucune** — le glossaire en ligne n'a pas d'URL par terme |
| `15-evenements.html` | **aucune** |
| `16-evenement.html` | **aucune** |
| `17-modeles.html` (modèles/templates) | **aucune** |
| `20-campagne.html` (landing de campagne) | **aucune** |
| `21-inscription.html` | proche de `/fr/scan` et `/fr/meet`, mais pas la même page |

### C. Routes en ligne SANS gabarit — la page existe, rien ne la remplace (13 URL, 26 avec les locales)

`/fr/platform` · `/fr/legal-data` (l'Atlas ; le pied de page de la maquette l'appelle
« Legal Data » et pointe vers `#`) · `/fr/skills` · `/fr/research` (le papier ;
`07-chat` porte le titre « Research » mais décrit le produit de recherche
réglementaire, pas le papier) · `/fr/security` · `/fr/changelog` ·
`/fr/maria-action-plan` · `/fr/meet` (la page vers laquelle l'accueil en ligne envoie
**10 fois**) · `/fr/customers` (index) · `/fr/for/manufacturers` ·
`/fr/for/importers-distributors` · `/fr/for/marketplaces` · `/fr/scan`.

Les trois pages `/for/…` méritent d'être signalées seules : l'accueil en ligne les lie
**deux fois chacune**, avec des ancres complètes (« Pour les importateurs &
distributeurs »). Aucun gabarit ne leur correspond.

### D. Familles programmatiques sans gabarit croisé

`/jurisdictions/[pays]/[industrie]` — **80 URL**. L'architecture de la maquette croise
autrement : `04-secteur` liste des marchés, `05-marche` liste des textes. Aucun gabarit
ne dit « secteur × pays ». `04-secteur` peut probablement servir de patron, mais ce
n'est pas mesuré comme tel : c'est une décision à prendre, pas un constat.

**Bilan de couverture** : les 24 gabarits couvrent **≈154 des 266 chemins** (les
familles blog, industries, juridictions, réglementations, carrières, cas clients et les
pages uniques listées en A), en laissent **13 sans remplaçant**, et créent
**6 familles neuves**. Les 80 URL `juridiction × industrie` sont le trou de couverture
le plus large.

---

## 5. Texte d'ancre

**En ligne, `/fr` : 0 ancre générique sur 54.** Aucune occurrence de « En savoir plus »,
« Lire la suite », « Découvrir », « Voir plus », « Cliquez ici ». Les 6 liens à texte
vide (WhatsApp ×3, LinkedIn, X, YouTube) portent tous un `aria-label`, et le lien du
logo porte un `<img alt="Cleo">`. **Aucun lien de l'accueil en ligne n'est sans nom
accessible.** 38 textes d'ancre distincts.

**Maquette : 3 ancres génériques sur 99** — « En savoir plus » ×3 (FR) /
« Learn more » ×3 (EN), pointant vers `03-offre`, `07-chat` et `08-reglementation`.
0 ancre sans nom accessible. **79 textes d'ancre distincts** — plus du double du site
en ligne.

C'est le point où la maquette est **meilleure** : son pied de page nomme 20 textes
réglementaires (« REACH (CE) 1907/2006 », « PPWR (UE) 2025/40 », « RSGP (UE) 2023/988 »,
« PFHxA (UE) 2024/2462 »…), 8 secteurs et 6 marchés, avec des libellés qui portent le
numéro du texte. Le site en ligne n'a rien d'équivalent dans son pied de page. **Mais
ces 34 ancres pointent toutes vers `#`.** Aujourd'hui elles ne transmettent rien ; en
ligne, elles seraient le meilleur pied de page de maillage que le site ait jamais eu.

**Attention au vocabulaire.** Sur les 20 réglementations nommées dans le pied de page
de la maquette, **une seule** (AI Act) a une route en ligne : les pages
`jurisdictions/[pays]/regulations/[reg]` ne couvrent que `gdpr`, `ai-act`, `dora`,
`csrd`. Les 19 autres (REACH, PPWR, CLP, RSGP, EPI, Batteries, ESPR, Prop 65, TSCA,
CPSIA, FTC Green Guides, Loi 96, ASTM F963, PFAS, AICIS, GB…) n'ont **aucune URL**
aujourd'hui. Même écart sur les secteurs : la maquette nomme Textile, Jouets,
Ameublement, EPI — aucun n'existe dans `INDUSTRY_SLUGS`. Et sur les marchés : Canada,
Chine, Japon n'existent pas dans les 8 juridictions en ligne, tandis que France,
Allemagne, Australie, Brésil, Inde n'apparaissent pas dans la maquette.

---

## 6. Images et `alt`

| | En ligne `/fr` | Maquette |
|---|---|---|
| Images `<img>` | 16 | 17 |
| Sans attribut `alt` | **0** | **0** |
| `alt=""` | 2 | 8 |
| dont décoratives à juste titre | 2 (`cloud-bg.webp` ×2) | 2 (classe `fond`) |
| dont porteuses de contenu | **0** | **≈6** |
| Servies depuis une URL | 16 (`/logos/*.svg`, `/_next/image?…`) | **0** |
| Inlinées en `data:` base64 | 0 | **17** |
| `<svg>` inline | 43 | 36 |

Les 6 `alt` vides de contenu de la maquette : une vignette produit (`fiche-vignette`),
la capture du cas client, deux portraits d'experts — dont un dont le nom
« Darcial Mondjo, expert réglementaire » est écrit juste à côté dans le HTML —,
un `portrait` et le `wordmark` Cleo du pied de page. Ce sont exactement les six où
l'`alt` aurait quelque chose à dire.

L'autre point est plus lourd que les `alt` : **aucune image de la maquette n'a d'URL.**
Elles sont toutes en `data:image/...;base64`. Une image en base64 n'a pas de nom de
fichier, n'est pas crawlable séparément, n'entre pas dans Google Images et ne peut pas
être référencée par un sitemap images. Le site en ligne sert 16 images à des URL
nommées (`/logos/decathlon.svg`, `/product-kids-sunscreen.png`…). Si les maquettes
partent en production telles quelles, **16 objets indexables deviennent 0**.

---

## 7. Ce qui serait PERDU, du plus coûteux au moins coûteux

1. **Le sitemap et ses 532 URL → 0.** 266 chemins × 2 locales, avec `lastModified`,
   `changeFrequency`, `priority` et un bloc `alternates.languages` par entrée. Les
   maquettes n'ont aucun sitemap et aucune URL canonique. C'est de loin le poste le
   plus cher : c'est la totalité de la déclaration d'inventaire.

2. **240 pages atteignables tombent à 24.** Le crawl depuis `/fr` atteint 264 URL `/fr`
   en 3 clics, soit 96,6 % du sitemap FR. Le graphe de la maquette compte 24 fichiers
   atteignables depuis `01-accueil.html` (25 fichiers, un inatteignable). Les familles
   qui disparaissent en volume : 108 articles de blog, 80 pages
   juridiction × industrie, 32 pages juridiction × réglementation, 10 pages secteur,
   8 pages juridiction.

3. **1 060 liens morts sur 2 280, soit 46,5 % de toutes les ancres du gabarit.**
   Sur l'accueil seule : 46 des 99 liens pointent vers `#`. Le site en ligne a
   **zéro** lien mort sur son accueil. Chacun de ces 46 liens porte un libellé précis
   (« REACH (CE) 1907/2006 », « Textile et habillement », « Union européenne ») : c'est
   du signal préparé qui ne se rend nulle part.

4. **13 routes en ligne perdent leur page**, dont `/meet` — la destination la plus
   liée de l'accueil actuel (**10 liens sur 54**) — et les trois pages `/for/…`
   (2 liens chacune, ancres explicites). Aucun gabarit ne les remplace.

5. **`hreflang` et le couplage FR ↔ EN.** En ligne : 3 déclarations (`en`, `fr`,
   `x-default`) sur chaque page, plus un bloc `alternates` sur chacune des 532 entrées
   du sitemap. Dans la maquette : **zéro**, et `01-accueil-en.html` n'est cité par
   **aucun** des 26 fichiers — c'est une île. Un moteur n'a aucun moyen de savoir que
   ces deux pages sont la même page en deux langues.

6. **Les 16 images indexables passent à 0.** Toutes en base64. Plus de nom de fichier,
   plus d'URL, plus de présence possible en recherche d'images.

7. **12 liens sortants → 0.** 6 titres de presse (Tech.eu, EU-Startups, Vestbee,
   FinTech Global, RegTech Analyst, The Legal Wire) avec le titre de l'article en
   ancre, 3 réseaux sociaux, WhatsApp ×3, plus le lien vers
   `legaldata-public.cleolabs.co`. Ce sont les seules citations externes vérifiables de
   la page. La maquette n'en a aucune.

8. **`rel="canonical"` disparaît**, et trois fichiers pourraient devenir des doublons
   s'ils partaient en production : `01-accueil-noir.html` (copie de l'accueil),
   `00-composants.html`, `index.html`.

9. **`robots.txt` et les 7 agents IA nommés** (GPTBot, ChatGPT-User, PerplexityBot,
   ClaudeBot, anthropic-ai, Google-Extended, CCBot), plus les deux `<link
   rel="alternate">` vers `/llms.txt` et `/llms-full.txt`. Rien de tout cela n'existe
   dans les maquettes — à reprendre au moment du portage, sinon perdu.

10. **6 images de contenu perdent leur `alt`** (0 → 6). Coût réel mais borné : six
    descriptions à écrire.

11. **3 ancres génériques apparaissent** (« En savoir plus » ×3) là où le site en ligne
    en a zéro. Coût réel mais borné : trois libellés à réécrire.

12. **La profondeur d'URL s'aplatit.** `/fr/jurisdictions/france/cosmetics` (4 segments
    parlants + locale) devient `05-marche.html`. Plus de hiérarchie lisible, plus de
    segment de langue, une extension `.html` que le site actuel n'utilise nulle part.
    Ce point disparaît si le portage se fait dans Next.js et garde les routes — il ne
    coûte que si les fichiers plats deviennent les URL.

---

## 8. Ce qui serait GAGNÉ

1. **79 textes d'ancre distincts contre 38.** La maquette double le vocabulaire de
   liaison de l'accueil, et le fait avec des libellés qui portent la référence exacte
   du texte (« PPWR (UE) 2025/40 », « PFHxA (UE) 2024/2462 », « RSGP (UE) 2023/988 »).
   Le site en ligne n'a rien d'équivalent.

2. **Un pied de page de maillage que le site n'a pas.** 34 liens nommés
   (20 réglementations, 8 secteurs, 6 marchés) présents sur **les 24 gabarits**. Câblés,
   ce serait 34 liens internes descendants depuis chaque page du site — exactement ce
   qui manque aujourd'hui aux 9 pages orphelines mesurées au §2.

3. **Le vocabulaire réglementaire s'élargit.** Le site en ligne n'a d'URL que pour
   4 textes (GDPR, AI Act, DORA, CSRD) — tous transverses, aucun de conformité produit.
   La maquette en nomme 20, tous produit (REACH, PPWR, CLP, RSGP, EPI, Batteries, ESPR,
   EN 71, ASTM F963, TSCA, Prop 65, CPSIA…). C'est 19 familles d'URL neuves à créer,
   pas une perte.

4. **6 gabarits pour des pages qui n'existent pas** : page par terme du glossaire,
   rencontres (index + fiche), modèles, campagne, inscription. Le glossaire en ligne
   n'a aucune URL par terme ; le gabarit `14-terme` ouvre cette famille.

5. **99 liens sur l'accueil contre 54.** Même en retirant les 46 morts, la maquette
   égale le site (53 liens internes vivants contre 40). Le déficit n'est pas dans le
   nombre de liens, il est dans le nombre de **cibles**.

6. **La densité de liens est constante sur tout le gabarit** : 90 à 105 ancres par
   page sur les 22 pages de contenu. Le maillage est pensé comme un système, pas page
   par page.

---

## 9. Ce que je n'ai pas pu mesurer

- **Toute performance.** Positions, impressions, clics, volumes de recherche, backlinks
  entrants : ni Search Console, ni Ahrefs/Semrush, ni logs serveur dans ce contexte.
  Je ne peux pas dire ce qu'une URL rapporte, seulement si elle existe.
- **Les liens entrants externes vers les URL actuelles.** Si des sites tiers pointent
  vers `/fr/jurisdictions/france` ou vers un article, changer l'URL casse ces liens. Je
  n'ai aucun moyen de les voir d'ici. C'est le risque le plus important que je ne peux
  pas chiffrer.
- **L'état réel du crawl.** Google peut avoir indexé plus ou moins que les 266 chemins
  déclarés. Non vérifiable sans Search Console.
- **Les redirections à prévoir.** `/fr/pricing` répond 308 et `/fr/agents`,
  `/fr/product/chat`, `/fr/product/radar`, `/fr/resources/gdpr-compliance` répondent
  404 : je constate les codes, je ne connais pas la table de redirection existante chez
  Vercel.
- **Le `sitemap.xml` d'images / de vidéos** : non testé.
- **La pagination du blog et du glossaire en ligne** : le crawl s'est arrêté à 3 clics,
  des URL de page 2+ peuvent exister au-delà.
- **Le CSS et le rendu** : hors périmètre, et les fichiers bougent pendant la mesure.
- **La correspondance des slugs article par article** : les 108 articles de blog en
  ligne n'ont pas été rapprochés un à un du gabarit `12-article`. Je constate la
  famille, pas l'appariement.
- **Décalage repo / production** : le sitemap servi ne correspond pas au repo local
  (`gdpr-compliance` présent en ligne mais 404, `pricing` présent au repo mais absent
  en ligne). Tous mes comptages portent sur **ce qui est servi**, pas sur `main`.

---

## 10. Le verdict, en une ligne

Le risque est réel mais il n'est pas dans les maquettes : **il est dans la façon de les
porter.** Si les 24 fichiers plats deviennent les URL, on perd 532 URL déclarées, 240
pages atteignables, le `hreflang`, le canonical, 16 images indexables et 12 citations
externes — et on emporte 1 060 liens morts. Si les maquettes ne fournissent que le
gabarit et que les routes Next.js actuelles sont conservées, il ne reste qu'à câbler
1 060 `#`, écrire 6 `alt`, remplacer 3 « En savoir plus » et créer 13 pages manquantes.
Le premier scénario coûte tout ; le second est un gain net de maillage.
