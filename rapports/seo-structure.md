# Données structurées et métadonnées : ce que le portage toucherait

Mesuré le 27/08/2026. Lentille : JSON-LD, Open Graph, Twitter, canonical, hreflang,
langue déclarée, exports `metadata` Next.js, sitemap, robots.

Comparaison : HTML **servi** (curl, UA navigateur) de `https://www.cleolabs.co/fr` et `/en`
· code de `/Users/naomiehalioua/cleo-landing` · maquettes
`/Users/naomiehalioua/cleo-maquettes-edge/sortie/01-accueil.html` et `01-accueil-en.html`.

Aucun chiffre de trafic, de position ou de volume ici : uniquement des signaux présents ou absents.

---

## 0. Le fait qui commande tout le reste

Les cinq blocs JSON-LD de l'accueil ne vivent pas au même endroit.

| Bloc | Fichier source | Survit à un changement de gabarit ? |
|---|---|---|
| `Organization` | `src/app/[locale]/layout.tsx` (dans le `<head>`) | oui |
| `WebSite` | `src/app/[locale]/layout.tsx` | oui |
| `VideoObject` | `src/app/[locale]/layout.tsx` | oui |
| `FAQPage` | **`src/app/[locale]/page.tsx`** | **non** |
| `HowTo` | **`src/app/[locale]/page.tsx`** | **non** |

Idem pour les métadonnées : `src/app/[locale]/page.tsx` **n'exporte ni `metadata` ni
`generateMetadata`**. Zéro balise `<title>`, `<meta>`, `canonical` ou `hreflang` de l'accueil
ne vient du fichier de page. Tout vient de `[locale]/layout.tsx` (titre, description, 10 OG,
5 Twitter, 3 hreflang) et de `src/app/layout.tsx` (metadataBase, template de titre, `robots`,
`google-site-verification`, icônes).

Sur l'ensemble du dépôt, même répartition : **68 balises `ld+json`**, dont **55 dans des
`layout.tsx`** (27 fichiers), **8 dans des `page.tsx`** (6 fichiers) et **5 dans des composants**
(`ArticleShell.tsx` 4, `TeamSection.tsx` 1). Le gros du GEO est dans les layouts.

Vérifié aussi : aucun des 13 composants importés par l'accueil ne porte de JSON-LD.
`TeamSection.tsx` en porte un (`Person`), mais il n'est pas importé par l'accueil.

Vérifié enfin : **les 5 blocs sont dans le HTML servi**, pas seulement dans le DOM hydraté.
`curl` en récupère 5 sur 5. Rien de ce qui suit ne dépend de l'hydratation.

---

## 1. Tableau des signaux

| Signal | En ligne (`/fr` servi) | Maquette `01-accueil.html` | Verdict |
|---|---|---|---|
| Blocs `ld+json` | **5** (FR et EN) | **0** | perdu si fichier statique · 3/5 conservés si portage React |
| `@type Organization` | 22 propriétés, 3 839 o | absent | vit dans le layout → **conservé** |
| ↳ `founder[]` | 2 `Person` (`@id`, jobTitle, alumniOf, knowsAbout) | absent | conservé |
| ↳ `funding` | 1 `FundingEvent`, 1 500 000 EUR, 3 funders | absent | conservé |
| ↳ `knowsAbout[]` | 14 entrées (MARIA, CSRD, AGEC, DPP, GPSR, AI Act, DORA, NIS2, RGPD…) | absent | conservé |
| ↳ `sameAs[]` | 6 URL dont **Wikidata Q138466568** | absent | conservé |
| ↳ `hasOfferCatalog` | 3 `Offer` | absent | conservé |
| ↳ `address` / `taxID` / `iso6523Code` / 2 `contactPoint` | présents | absent | conservé |
| `@type WebSite` + `SearchAction` | 1 bloc, 458 o | absent | conservé |
| `@type VideoObject` | 1 bloc, 9 propriétés | absent | conservé |
| **`@type FAQPage`** | **17 `Question`/`Answer`**, 8 777 o | absent | **PERDU** (dans `page.tsx`) |
| **`@type HowTo`** | **3 `HowToStep`** + 1 `HowToTool`, `PT5M` | absent | **PERDU** (dans `page.tsx`) |
| Microdata (`itemscope`/`itemprop`) | 0 | 0 | inchangé |
| `<title>` | « Conformité Produit Automatisée… \| Cleo Labs » | « Cleo — Accueil » | conservé (layout) |
| `<meta name="description">` | présente, 138 car. FR / 133 EN | **absente** | conservé (layout) |
| Open Graph | **10 balises** | **0** | conservé (layout) |
| Twitter Card | **5 balises** (`summary_large_image`, `@cleolabs`) | **0** | conservé (layout) |
| `rel="canonical"` | `https://www.cleolabs.co/fr` | **absent** | conservé (voir §4, réserve) |
| `hreflang` | **3** (`en`, `fr`, `x-default`) | **0** | conservé (layout) |
| `rel="alternate"` vers `llms.txt` / `llms-full.txt` | 2 | 0 | conservé (layout) |
| `<meta name="robots">` | `index, follow` | absent | conservé (layout racine) |
| `google-site-verification` | `google57f0014b89d60d67` | absent | conservé (layout racine) |
| `<html lang>` | `fr` / `en` | `fr` / `en` | **conservé** — la maquette le pose bien |
| `sitemap.xml` | **532 URL**, 1 596 `xhtml:link` | hors périmètre | conservé (`src/app/sitemap.ts`) |
| `robots.txt` | 8 règles, dont **7 crawlers IA autorisés** | hors périmètre | conservé (`src/app/robots.ts`) |
| Balises SEO écrites par `construire.mjs` | — | **3** : `charset`, `viewport`, `<title>` | — |

Sur les **26 fichiers HTML** de `sortie/`, **0** porte le moindre `ld+json`, `og:`, `twitter:`,
`canonical` ou `hreflang`. `construire.mjs` (387 lignes) n'écrit que trois lignes de `<head>`
(lignes 332-334). Ce n'est pas un oubli partiel : c'est une absence totale, par construction.

---

## 2. Ce qui serait perdu, du plus coûteux au moins

Dans le scénario réaliste — le balisage de la maquette remplace le contenu de
`src/app/[locale]/page.tsx`, le layout et les exports `metadata` restent en place.

### 1. `FAQPage` — 17 paires question/réponse, ×2 langues
La mesure : `mainEntity` contient 17 objets `Question`, réponses de 268 à 587 caractères,
8 777 octets de JSON-LD en FR, 7 873 en EN. C'est **70 % du poids JSON-LD hors `Organization`**
de la page.

Deux nuances, dans les deux sens :
- **Moins cher qu'il n'y paraît** : le bloc est *calculé* à partir de `translations.faq.items`
  (fonction `getFaqJsonLd`, `page.tsx` l. 18-32). La donnée survit au portage ; seul l'émetteur,
  8 lignes de JSX, disparaît. Le recoller coûte 8 lignes.
- **Plus cher qu'il n'y paraît** : Google exige que le contenu FAQ soit *visible sur la page*.
  Or **0 des 17 questions** apparaît dans le texte de la maquette, qui n'a aucune section FAQ
  (ses 5 `h2` : problème, cycle, distributeur, validation humaine, nouveau pays). Recoller le
  script sur une page sans FAQ visible produit un balisage non conforme. **La perte réelle n'est
  pas le script, c'est la section.**
- À décharge : `FAQPage` apparaît **14 fois** dans le dépôt (pricing, `resources/*`…). L'entité
  ne disparaît pas du site, seulement de l'accueil.

### 2. `HowTo` — 3 étapes + 1 outil
La mesure : 3 `HowToStep`, `totalTime: PT5M`, 1 012 octets FR.

**Coût réel proche de zéro, et c'est mesuré.** Les 3 noms d'étapes déclarés
(« Renseignez le nom de domaine… », « L'IA cartographie… », « Recevez un plan d'action… »)
n'apparaissent **ni dans le HTML servi ni dans le DOM après hydratation** : 0/3 dans les deux cas.
Le bloc décrit déjà une section qui n'existe plus sur la page en ligne. Le porter ou le perdre
ne change rien de vérifiable.

### 3. Rien d'autre — sous une condition
Aucun autre signal de cette lentille ne vit dans `page.tsx`. Titre, description, 10 OG,
5 Twitter, canonical, 3 hreflang, `robots`, vérification Google, `Organization` (22 propriétés,
2 fondatrices, Wikidata), `WebSite`, `VideoObject`, les 532 URL du sitemap et les 7 crawlers IA
autorisés : **tout est hors d'atteinte d'un changement de gabarit.**

### Le scénario où tout tombe
Si « porter la maquette telle quelle » veut dire **servir le fichier HTML tel quel** à la place
de la route, alors : 5 blocs JSON-LD sur 5, 15 balises OG+Twitter sur 15, le canonical, les
3 hreflang et la meta description disparaissent d'un coup. La maquette ne porte aucune de ces
balises et `construire.mjs` n'en génère aucune.

**L'écart entre les deux scénarios, c'est 2 blocs perdus contre 5 blocs + 15 balises + canonical
+ hreflang.** Le risque n'est pas dans le design, il est dans la méthode de portage.

---

## 3. Ce qui serait gagné

Honnêtement : **rien de mesurable dans cette lentille.** La maquette n'ajoute aucun signal
structuré que la page en ligne n'a pas.

Deux points neutres, pas des gains :
- `<html lang>` est correct dans les deux maquettes (`fr` / `en`). C'est une non-régression,
  pas un gain.
- Un seul `h1` par page, comme en ligne. Non-régression également.

Un défaut à corriger avant tout portage, sans lien avec le SEO du site en ligne :
le `<title>` de `01-accueil-en.html` est **« Cleo — Accueil EN »**, du français dans la page
anglaise. Sans conséquence si le titre reste géré par le layout, à corriger si la maquette
devait un jour être servie telle quelle.

---

## 4. Ce que je n'ai pas pu mesurer

- **Quelle méthode de portage sera retenue.** C'est une décision, pas une mesure. J'ai chiffré
  les deux scénarios ; l'écart entre eux est le seul vrai enjeu.
- **La correspondance entre le code lu et le build servi.** Trois mesures discordantes :
  `/fr` sert un `canonical` que la source actuelle n'émet plus (le commit `5faba067` du 29/07
  l'a retiré de `[locale]/layout.tsx`) ; `/fr/for/quality-manager` sert encore
  `canonical → https://www.cleolabs.co/fr`, exactement le bug que ce commit dit avoir corrigé ;
  en-têtes : `x-vercel-cache: HIT`, `x-nextjs-prerender: 1`, `age: 101258` (~28 h).
  Les pages viennent d'un cache de prérendu ; **je ne peux pas certifier de quel build.**
  Conséquence pour la décision : le canonical de l'accueil est peut-être déjà absent du code,
  auquel cas le portage n'y touche pas davantage. À vérifier sur un déploiement frais.
- **Ce que Google indexe réellement, et quels rich results sont accordés.** Pas de Search Console
  dans ce contexte. Je mesure des balises émises, pas des résultats obtenus.
- **Les 21 autres maquettes** (`02-entreprise` … `22-legal`) : j'ai seulement vérifié qu'aucune
  des 26 ne porte de `ld+json`. Leur correspondance route par route avec les 532 URL du sitemap
  n'est pas mesurée.
- **`/fr/pricing`** répond `308 → /fr/meet`. Le canonical `→ /fr/meet` que j'ai relevé est celui
  de la destination, pas de `/pricing`. Hors lentille, signalé pour ne pas induire en erreur.

---

## 5. Réponse à la question posée

> Porter la maquette toucherait-il aux données structurées et aux métadonnées, ou vivent-elles
> ailleurs, hors d'atteinte d'un changement de gabarit ?

**Elles vivent très majoritairement ailleurs.** Sur le compte : 3 blocs JSON-LD sur 5,
100 % des métadonnées (titre, description, 10 OG, 5 Twitter, canonical, 3 hreflang, robots,
vérification Google), les 532 URL du sitemap et les 7 crawlers IA autorisés sont déclarés dans
`src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/app/sitemap.ts` et `src/app/robots.ts`.
Un changement de gabarit ne les atteint pas.

**Deux blocs seulement sont dans la ligne de tir** : `FAQPage` (17 Q/R) et `HowTo` (3 étapes),
tous deux physiquement dans `src/app/[locale]/page.tsx`. Le premier coûte cher — pas à cause du
script, mais parce que la maquette n'a aucune section FAQ visible pour le justifier. Le second
ne coûte rien : ses 3 étapes sont déjà invisibles sur la page en ligne, avant et après hydratation.

**La condition** : que le portage passe par le remplacement du contenu de `page.tsx`, en gardant
le layout. Servir le HTML de la maquette tel quel ferait tomber les 5 blocs et les 15 balises
sociales d'un seul coup, parce que `construire.mjs` n'écrit que `charset`, `viewport` et `<title>`.
