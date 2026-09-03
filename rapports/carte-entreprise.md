# Carte entreprise — la levée, la presse, la preuve

Inventaire du 27/08/2026. Lentille : la page entreprise et les signaux de preuve
(levée, investisseurs, presse, prix Deel, article de recherche).
Aucun fichier de `cleo-landing` ni de `cleo-maquettes-edge` n'a été modifié.

**Ce que je n'ai pas.** Ni Search Console ni outil de mots-clés. Aucun chiffre de
trafic, de position ou de volume ici. Je compte des pages, des balises, des liens,
des mots. Les serveurs MCP `cleo`, `supabase-comply` et `supabase-insight-prod`
ont échoué à se connecter cette session : les chiffres de couverture affichés par
la maquette (2 812, 25 000, 19 000) n'ont donc pas pu être confrontés à la base.

**Avertissement d'autorité.** Le dépôt local `cleo-landing` est sur la branche
`feat/cas-usage-16` et retarde sur `origin/main` : 77 fichiers d'articles en local,
**108 sur `origin/main`**, et 108 URL d'articles dans le sitemap servi. Le chiffre
de 77 est celui du checkout, pas celui de la production.

---

## 1. Ce que raconte la page entreprise servie, section par section

Route : `src/app/[locale]/company/page.tsx` (15 lignes) → rend `TeamSection` et
rien d'autre. Le contenu vit dans `src/components/landing/TeamSection.tsx` (330
lignes) et les textes dans `src/i18n/sections/social-proof.ts` (export `about`).

Ordre réel sur `https://www.cleolabs.co/fr/company` (200, 91 085 octets, relevé au
User-Agent Googlebot) :

1. **Hero** — H1 « Conçu pour les équipes qui portent le poids de la conformité. »
   + « Des outils aussi rigoureux que le jugement qu'ils servent. »
2. **Manifeste**, 4 paragraphes (`manifestoP1` à `P4`).
3. **Mur de logos** (`LogoWall`, variante `rack`) — « Des marques internationales
   nous font confiance ». Six `alt` réels : Decathlon, Mercedes-Benz, L'Occitane,
   Electrolux Professional, SNCF Réseau, Balzac Paris.
4. **Photo d'équipe + citation vision** (`/team.webp`, `alt="Cleo team"`).
5. **Fondateurs**, texte seul, 3 cartes : Anaelle Guez, Naomie Halioua, Alexandre
   Bloch — chacune avec un lien LinkedIn sortant.
6. **Engagements**, H2 « Nos engagements envers nos clients » + 4 cartes.
7. **Carte vers `/research`** — « Lire notre article de recherche / Une approche
   multi-agents par pipeline pour l'intelligence réglementaire : 19 régions,
   8 langues, 30+ appels LLM par exécution. »
8. **CTA contact**, H2 « Échangeons. » + formulaire + bouton de créneau.

Mesures sur la page servie : **476 mots visibles**, **7 liens sortants**
(3 LinkedIn de fondateurs, LinkedIn société, X, YouTube, WhatsApp),
**0 image sans `alt`** sur 13 images, 1 H1 / 2 H2 / 7 H3.

## 2. La levée sur la page entreprise : elle est là, mais pas dans le texte

**Un robot qui lit le corps de la page ne voit pas la levée.** Le décompte sur le
HTML servi de `/fr/company` : « Kima » 16, « Larry Berger » 10, « Saint-James » 10,
« Amplify » 10, « 1,5 » 6 — et **zéro** de ces occurrences dans le texte visible
(les 112 lignes de texte extraites ne contiennent ni le montant, ni un
investisseur, ni la presse). Tout vit dans la tête de page et dans le payload RSC.

Texte exact, `src/app/[locale]/company/layout.tsx` :

- `<title>` servi (FR) : `À Propos de Cleo Labs : Soutenue par Kima Ventures | Cleo Labs`
- `<meta name="description">` (FR) : « Découvrez l'équipe derrière MARIA, la
  première infrastructure IA de conformité pour les retailers en Europe. Fondée par
  Anaëlle Guez et Naomie Halioua. Soutenue par Kima Ventures, La Financière
  Saint-James et Larry Berger (Amplify). **1,5M€ levés.** »
- version EN : « … Backed by Kima Ventures, La Financière Saint-James, and Larry
  Berger (Amplify). **EUR 1.5M raised.** »
- `canonical` : `https://www.cleolabs.co/fr/company` · `hreflang` en / fr /
  x-default présents (attribut rendu `hrefLang`, 3 balises `<link rel="alternate">`).

JSON-LD de la page : **6 blocs**. Types servis dans l'ordre : `Organization` (avec
`@id`), `WebSite`, `VideoObject`, `BreadcrumbList`, `Organization` (sans `@id`),
puis un tableau de 3 `Person`.

Le bloc `Organization` racine déclare, entre autres :
`legalName: "Cleo Corp SAS"`, `foundingDate: "2023"`,
`award: "Winner: The Pitch by Deel (Station F, 2026)"`,
`slogan: "The Deel of product compliance"`,
`foundingLocation: Neuilly-sur-Seine`, `numberOfEmployees` 2–10,
`address` 17 rue Berteaux Dumas 92200, `taxID: "FR20984567883"`,
`logo` (apple-touch-icon, 180×180), `knowsAbout` (14 entrées : MARIA, CSRD, AGEC,
DPP, GPSR, EU AI Act, DORA, NIS2, GDPR, devoir de vigilance…),
`hasOfferCatalog` (3 offres), et
`sameAs` : LinkedIn société, `x.com/cleolabs`, YouTube,
`crunchbase.com/organization/**celo**-labs`, Product Hunt,
`wikidata.org/wiki/Q138466568`.

`funding` (bloc racine) : `FundingEvent` « Tour de pré-amorçage », `date: "2026"`,
`fundingTotal` 1 500 000 EUR, `funder` = Larry Berger (« Founder of Amplify »),
La Financière Saint-James, Kima Ventures (avec `url` kimaventures.com).
Le second bloc `Organization`, celui du layout `company`, répète le même
`FundingEvent` sous le nom « Pre-Seed Round », sans `@id` et sans `date`.

Deux défauts déjà présents dans le site, à corriger au portage plutôt qu'à recopier :
- **deux nœuds `Organization` sur la même page**, dont un sans `@id` : rien ne dit
  au moteur que c'est la même entité ;
- **le titre de Naomie diverge selon le bloc** : `CRO & Co-founder` dans les deux
  `Organization`, `Chief Research Officer & Co-founder` dans le bloc `Person`, et
  « Co-fondatrice & Directrice de la Recherche » dans le texte visible ;
- le slug Crunchbase déclaré est `celo-labs` : à vérifier avant reprise.

## 3. La presse : elle n'est pas sur la page entreprise, elle est sur l'accueil

`src/components/landing/PressSection.tsx` n'est **jamais** appelé par
`/company`. Ses appelants : `src/app/[locale]/page.tsx` ligne 91 (l'accueil) et
trois pages `preview/`.

Le fichier porte en commentaire « Couverture presse VÉRIFIÉE (URLs réelles — ne
rien ajouter sans source) » et six titres avec leur lien sortant :

| Média | Lien |
|---|---|
| Tech.eu | tech.eu/2026/04/29/cleo-labs-secures-eur15m-… |
| EU-Startups | eu-startups.com/2026/04/female-founded-french-startup-cleo-labs-raises-e1-5-million-… |
| Vestbee | vestbee.com/insights/articles/cleo-labs-raises-1-5-m |
| FinTech Global | fintech.global/2026/04/29/cleo-labs-secures-e15m-… |
| RegTech Analyst | regtechanalyst.com/cleo-labs-raises-e1-5m-… |
| The Legal Wire | thelegalwire.ai/cleo-labs-raises-e1-5m-… |

Les six datent d'avril 2026 (date lisible dans quatre URL sur six).
Le badge au-dessus : « Lauréate — The Pitch by Deel (Station F), parmi 35 000+
candidatures ». Les six liens sont bien servis sur `https://www.cleolabs.co/fr`
(vérifié : 6 domaines de presse dans les liens sortants de l'accueil).

## 4. La maquette entreprise : ce qu'elle porte, ce qu'elle ne porte pas

`pages/02-entreprise.html` (228 lignes) → `sortie/02-entreprise.html`.
Sept sections : hero photo pleine largeur, grille de portraits, chiffres en
escalier, ancrage Neuilly + photo à cartes flottantes, texte long, CTA final.
Mesures : **750 mots visibles**, **0 lien sortant**, **15 `alt=""` sur 17 images**,
1 H1 / 5 H2 / 1 H3.

La grille compte **6 cellules** (et non 5) : Anaëlle Guez (CEO, cofondatrice),
Naomie Halioua (**CDO**, cofondatrice), Alexandre Bloch (« Équipe Cleo »),
Darcial Mondjo (« Expert réglementaire »), Thezi Mabuza (« Experte
réglementaire »), plus une cellule lavande « Et l'équipe qui encode, relit et met
à jour les règles chaque semaine ».

**La levée y est**, une fois, dans une carte flottante posée sur la photo :
« 1,5 M€ levés en pre-seed ». Sans lien, sans investisseur, sans date, sans source.
À côté d'elle : « Sélection CES Las Vegas, délégation française 2026 » — cette
formulation n'existe nulle part dans `cleo-landing` (le site dit seulement « Vu au
CES 2026 », `src/i18n/sections/hero.ts:6`). **Claim non sourcé : à faire confirmer
avant publication.**

### Décompte sur les 26 pages construites de `sortie/`

| Signal | site | maquette (26 pages) |
|---|---|---|
| « Kima » / « Saint-James » / « Larry Berger » / « Amplify » | oui | **0** |
| « Deel » / « Station F » | oui | **0** |
| liens presse (tech.eu, eu-startups, vestbee, fintech.global, regtechanalyst, thelegalwire) | 6 | **0** |
| liens LinkedIn (fondateurs + société) | 4 | **0** |
| « 1,5 M€ » | oui | 1 (02-entreprise) |
| trace de l'article de recherche (« 19 régions », « 8 langues », « appels LLM », « livre blanc ») | oui | **0** |
| mur de logos clients (Decathlon, Mercedes-Benz, L'Occitane, Electrolux, SNCF Réseau, Balzac) | 6 | **0** |
| `<script type="application/ld+json">` | 6 sur `/company` | **0** sur les 26 |
| `<link rel="canonical">` | 1 par page | **0** sur les 26 |
| `hreflang` | 3 par page | **0** sur les 26 |
| `<meta name="description">` | 1 par page | **0** sur les 26 |
| `og:` | oui | **0** sur les 26 |

Cette dernière moitié du tableau n'est pas un reproche fait à la maquette : sur le
site, ces balises vivent dans `layout.tsx`, `sitemap.ts` et `robots.ts`, pas dans
les gabarits. C'est un décompte de ce qu'il faudra **rebrancher page par page** si
la structure de la maquette devient le site.

### Le mot « Research » a changé de sens

Sur le site, `/research` est l'article scientifique (H1 « La science derrière
l'intelligence », 691 mots servis, H2 « Une approche multi-agents par pipeline… »,
« Le Livre blanc »), et la page entreprise y renvoie par une carte dédiée.
Dans la maquette, « Research » est le nom d'une **feature produit** :
`sortie/07-chat.html`, titre « Cleo — Research », H1 « Recherche réglementaire. La
source avant le résumé. » La navigation et le pied de page de la maquette pointent
« Research » vers cette page. **Aucune des 26 pages ne porte l'article de
recherche**, et la page entreprise de la maquette n'a plus de carte vers lui.

## 5. Le blog et les deux articles qui comptent

Sitemap servi : **532 `<loc>`**, soit 265 FR + 265 EN + 2 racines. Répartition FR :

| section | URL FR | gabarit maquette |
|---|---|---|
| jurisdictions | 121 (1 index + 120) | 05-marche.html |
| blog | 109 (1 index + 108) | 11-blog.html + 12-article.html |
| industries | 11 | 04-secteur.html |
| resources | 8 | 10-ressources.html |
| for | 3 | — |
| careers | 3 | 18-recrutement.html + 19-poste.html |
| changelog, company, legal-data, maria-action-plan, meet, platform, research, security, skills, solutions | 1 chacune | company→02, legal-data/changelog/maria-action-plan/meet/platform/research/security/skills/solutions : **sans gabarit dédié** |

Huit sections de route existent mais ne sont **pas** dans le sitemap : `agents`,
`customers`, `preview`, `pricing`, `privacy`, `product`, `scan`, `terms`.

Les deux articles de Naomie sont vivants et déclarés :

**`/fr/blog/cleo-labs-raises-1-5m-preseed`** (200, 112 658 octets, **934 mots**)
- `<title>` : « Cleo Labs lève 1,5 M€ pour automatiser la conformité réglementaire
  produit à l'échelle mondiale | Cleo Labs »
- description : « Tour mené par Larry Berger, aux côtés de Kima Ventures,
  Financière Saint-James et plusieurs figures du tech : complété par un financement
  de Deel. »
- JSON-LD : Organization, WebSite, VideoObject, BreadcrumbList, **TechArticle**,
  BreadcrumbList, WebPage
- H2 : le défi réglementaire · automatiser à l'échelle mondiale · un premier tour
  pour structurer la croissance · des fondatrices à la croisée de la tech · **Sources
  et références** · scan gratuit
- occurrences : Kima 22, Larry Berger 22, « 1,5 » 24, Deel 20, Saint-James 16

**`/fr/blog/global-product-compliance-pitch-by-deel`** (200, 134 640 octets, **1 401 mots**)
- `<title>` : « Conformité produit mondiale en 2026 : pourquoi nous avons gagné The
  Pitch by Deel | Cleo Labs »
- JSON-LD : … **TechArticle** + **FAQPage** (éligible aux résultats enrichis)
- H2 : à quoi ressemble la conformité produit mondiale · une chaîne IA multi-agents
  · l'océan bleu de la RegTech · pourquoi 2026 est le point d'inflexion · pourquoi
  la victoire Deel compte · Questions fréquentes · Sources et références ·
  Ressources associées
- occurrences : Deel 60, Station F 24

Face à cela, `sortie/12-article.html` (gabarit d'article) porte bien un bloc
« Sources », un « À lire aussi » et un bloc de questions fréquentes, mais
**aucune date de publication, aucune signature d'auteur, aucun temps de lecture,
aucun JSON-LD** — donc ni `TechArticle` ni `FAQPage`.

## 6. Ce qui manque, du plus grave au moins

1. **Les six liens de presse disparaissent.** Six domaines tiers qui citent Cleo
   par son nom, avec le montant et les investisseurs : c'est la preuve externe qui
   fait qu'un moteur ou un LLM ose répéter « Cleo Labs a levé 1,5 M€ ». Zéro dans
   la maquette.
2. **L'article de recherche n'a aucune place.** Le mot « Research » a été réattribué
   à une feature produit. La carte de la page entreprise vers `/research` n'existe
   plus, et rien dans les 26 pages ne porte le papier.
3. **Les investisseurs ne sont nommés nulle part.** Kima Ventures, La Financière
   Saint-James, Larry Berger / Amplify : 0 occurrence. La maquette dit le montant
   sans dire qui.
4. **Le prix Deel / Station F disparaît**, alors qu'il est déclaré en `award` dans
   le JSON-LD `Organization` du site et qu'il porte un article de 1 401 mots avec
   FAQPage.
5. **Toute la couche de tête est à rebrancher** : 0 JSON-LD, 0 canonical,
   0 hreflang, 0 meta description, 0 og: sur les 26 pages construites.
6. **Le mur de logos clients disparaît** (6 marques, `alt` réels). Rappel :
   Longchamp, BIC, PMU et Kiabi sont interdits à l'impression ; les six affichés
   aujourd'hui sont Decathlon, Mercedes-Benz, L'Occitane, Electrolux Professional,
   SNCF Réseau, Balzac Paris.
7. **Les 4 liens LinkedIn disparaissent** (3 fondateurs + société). Ce sont les
   ancres qui rattachent les personnes à des entités connues.
8. **Les `alt` sont vides** : 15 sur 17 images de la page entreprise de la maquette,
   contre 0 sur 13 côté site.
9. **Le titre de Naomie change encore** : « CDO » dans la maquette, contre
   « Directrice de la Recherche » à l'écran et « CRO » / « Chief Research Officer »
   dans le JSON-LD du site. Trois formulations pour une personne.
10. **Un claim non sourcé est introduit** : « Sélection CES Las Vegas, délégation
    française 2026 ». Introuvable dans `cleo-landing`.
11. **43 liens de pied de page pointent sur `#`.** En maquette c'est normal ; au
    portage, c'est le maillage interne entier qui est à câbler.
12. **Deux personnes nouvelles** apparaissent en portrait, Darcial Mondjo et Thezi
    Mabuza, avec photos dans `images/experts/`. À confirmer avant mise en ligne :
    « Darcial » est aussi le nom d'un produit interne.

## 7. Ce qui doit absolument survivre au portage

- Les 6 liens de presse sortants, avec leurs URL exactes et la mention d'avril 2026.
- Le badge « Lauréate — The Pitch by Deel (Station F), parmi 35 000+ candidatures ».
- Les 3 liens LinkedIn de fondateurs et les 4 liens `sameAs` sociaux.
- Le `sameAs` complet, Wikidata `Q138466568` en tête.
- Le `FundingEvent` : 1 500 000 EUR, date 2026, les trois `funder` nommés.
- L'`award`, le `legalName` « Cleo Corp SAS », le `taxID`, l'`address` de Neuilly.
- Le `knowsAbout` de 14 entrées (MARIA, CSRD, AGEC, DPP, GPSR, AI Act, DORA, NIS2…).
- La carte vers `/research` et sa phrase « 19 régions, 8 langues, 30+ appels LLM ».
- Les 6 `alt` du mur de logos.
- Les 108 URL d'articles et les 120 URL de juridictions : 86 % du sitemap.
- Le `canonical` + les 3 `hreflang` par page, et les 532 entrées du sitemap.
- `TechArticle` sur les articles, `FAQPage` là où il existe déjà.

## 8. Réponse à la question posée

Est-ce qu'on est OK avec le SEO et le GEO de l'ancien site si on garde cette
structure ? **Sur la page entreprise, non, pas en l'état.** Ce n'est pas la
composition qui pose problème : la maquette est plus longue que la page servie
(750 mots contre 476) et son maillage thématique en navigation est plus riche.
Ce qui manque, ce sont les **rattachements** — les liens sortants qui prouvent, les
entités nommées, et la couche déclarative. Trois chiffres résument :
**6 liens de presse → 0**, **4 liens LinkedIn → 0**, **6 blocs JSON-LD → 0**.
Aucun de ces trois n'est un problème de design : ce sont des éléments à réinjecter,
et ils sont tous listés en section 7.
