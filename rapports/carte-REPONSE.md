# Réponse : le SEO et le GEO tiennent-ils si on garde cette structure de maquette ?

Naomie, 27/08/2026. Question posée : « Si on garde cette structure de maquette, est-ce
qu'on est OK avec le SEO et le GEO de l'ancien site ? Je veux pas qu'il change. »

Tous les chiffres de ce document sont mesurés. Ceux marqués (v) ont été revérifiés en
direct pendant la rédaction, sur `https://www.cleolabs.co`, sur `origin/main` et sur
`sortie/`. Aucun fichier du chantier n'a été modifié. Pas de chiffre de trafic ni de
position : il n'y a ni Search Console ni outil de mots-clés dans ce contexte.

---

## 1. LA RÉPONSE

**Non si « garder la structure » veut dire livrer les 26 pages de la maquette comme site :
26 formes de page face à 266 chemins servis, dont 88 pages sans aucun gabarit, et 0 des 26
portent un JSON-LD, un canonical ou un hreflang (v).**
**Oui si on ne porte que la peinture dans le dépôt Next : les 532 URL du sitemap, leurs
1 596 alternates et les 26 `layout.tsx` qui émettent le structuré ne sont pas touchés (v).**
La bonne réponse opérationnelle est donc la seconde : on ne porte pas la maquette, on
refait les gabarits dans le dépôt Next en gardant les pages. Détail en partie 4.

---

## 2. CE QUI NE BOUGE PAS

Un changement de gabarit = remplacer le corps d'une page (`page.tsx` ou le composant
client). Sous cette définition, ces signaux sont hors d'atteinte, parce qu'ils vivent
ailleurs que dans les gabarits.

| Ce qui ne bouge pas | Où ça vit | Mesure |
|---|---|---|
| Les 532 URL du sitemap, les 3 alternates par URL (en/fr/x-default) | `src/app/sitemap.ts` | 532 `<loc>`, 1 596 `xhtml:link`, 532 `x-default` (v) |
| Les 7 crawlers IA en `allow` (GPTBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, CCBot) | `src/app/robots.ts` | 7 lignes servies dans `/robots.txt` (v) |
| Le JSON-LD global présent sur toutes les pages : Organization, WebSite+SearchAction, VideoObject, FundingEvent | `src/app/[locale]/layout.tsx` | 11 blocs `ld+json` servis sur `/fr/company` (v) |
| Le socle d'entité : `legalName` Cleo Corp SAS, `foundingDate` 2023, `taxID` FR20984567883, adresse 17 rue Berteaux Dumas, `logo`, `award` Pitch by Deel, `knowsAbout` ×14 | `src/app/[locale]/layout.tsx` | 14 entrées `knowsAbout` |
| Les 6 `sameAs` dont Wikidata Q138466568 | `src/app/[locale]/layout.tsx` | 2 occurrences `wikidata` servies sur `/company` (v) |
| Le `<title>` « Soutenue par Kima Ventures » et les 2 `FundingEvent` avec funders nommés | `src/app/[locale]/company/layout.tsx` | titre servi vérifié, 4 occurrences `FundingEvent` (v) |
| Le structuré des 108 articles : TechArticle, BreadcrumbList, WebPage, FAQPage, Speakable, auteur `Person`, `keywords` | `src/components/blog/ArticleShell.tsx` (TechArticle émis ligne 85) | 16 blocs `ld+json` servis sur l'article Deel (v) |
| Les 302 questions et les 1 121 mots-clés distincts | `src/data/blog-posts.json`, champs `faq[]` et `keywords[]` | 302 paires sur 104 des 108 articles |
| Le canonical et les 3 hreflang par page | `generateMetadata` de chaque `layout.tsx` de section | 1 canonical + 6 balises hreflang sur `/fr/company` (v) |
| Les 26 `layout.tsx` de section qui portent un JSON-LD propre | `src/app/[locale]/**/layout.tsx` | 26 sur 30 fichiers `layout.tsx` sous `[locale]`, sur `origin/main` (v) |
| Les deux fichiers pour moteurs génératifs | `public/llms.txt` (758 mots), `public/llms-full.txt` (2 212 mots) | servis en 200 |
| Les 273 chemins servis eux-mêmes, tant qu'on ne réduit pas l'arborescence | routes de `src/app/[locale]/` | 266 au sitemap + 7 hors sitemap (v) |

**Une seule chose peut faire tomber tout ça d'un coup : remplacer un `layout.tsx` de
section en même temps que sa `page.tsx`.** C'est la règle unique à graver. Le cas le plus
sensible est `/company` : le nom « Kima Ventures » est dans le `<title>` porté par
`company/layout.tsx`, pas dans le corps de la page.

Bonne nouvelle non relevée par les quatre inventaires : **le bloc FAQ existe déjà, dessiné,
dans le kit de la maquette** (`commun/composants.css:388`, rendu sur `00-composants`,
`03-offre`, `07-chat`, `08-reglementation`) (v). Il n'est simplement pas câblé sur
`12-article`. Le report des 302 questions est donc un branchement, pas un dessin.

---

## 3. CE QUI DISPARAÎT SI ON PORTE LA MAQUETTE TELLE QUELLE

Classé par coût réel, du plus cher au moins cher. « Pages » = pages servies concernées.

### Coût 1 : la machine de publication. 1 article par jour, indéfiniment.
La routine `cleo-publish` écrit trois fichiers précis chaque jour : `<slug>.tsx`, l'entrée
de la table `ARTICLE_COMPONENTS` (`src/app/[locale]/blog/[slug]/page.tsx`), l'entrée de
`blog-posts.json`. Si le gabarit change sans que la routine change **le même jour**, la
publication du lendemain sort au format d'hier, sans erreur donc sans alerte. Et le mode de
panne du `[slug]` est silencieux : entrée JSON sans composant = page 200 avec titre et
description, sans corps, sans FAQ, sans bibliographie. **C'est le seul poste qui s'aggrave
tout seul.** Un commit d'article par jour du 7 au 26 août sans un trou.

### Coût 2 : le blog. 109 pages de gabarit face à 109 pages réelles, mais 8 pertes par page.
| Élément perdu | Pages | Preuve |
|---|---|---|
| 4 blocs JSON-LD par article | 108 | `12-article.html` : 0 `ld+json` (v) |
| Section FAQ visible et `FAQPage` | 104 | aucune section FAQ dans `12-article` : les h2 sont *De quel texte on parle · Ce qui s'applique · Ce qui vient ensuite · Ce qu'il y a à faire · À lire aussi* (v) |
| Auteur nommé + fonction + photo + LinkedIn, dans le visible et dans `author` | 108 | `12-article` signe « Équipe Cleo », sans lien (v) |
| `<time datetime>` machine-lisible | 108 | 0 balise `<time>` dans `12-article` (v) |
| Bibliographie `<cite>` + liens EUR-Lex | 45 | bloc Sources sans aucun `<a>` |
| 334 liens inter-articles + 45 vers guides + 27 vers solutions | 97 slugs | remplacés par 3 cartes en dur |
| Bilinguisme `t({en,fr})` | 216 URL | 1 seule page anglaise sur 26 dans la maquette |
| Densité de la liste | 1 | `/fr/blog` : 108 liens d'articles et 108 h2 dans le HTML initial (v) ; `11-blog.html` en montre 7 et 2 h2 |
| Le lien du bandeau vers l'article de la levée | 264 | `src/components/Navbar.tsx:98`, seul lien interne présent sur toutes les pages (v) |

Et derrière : 211 041 mots bilingues (98 814 EN, 112 227 FR) qui vivent **à l'intérieur du
balisage** de 108 composants. Changer d'ossature, c'est réécrire 108 fichiers. Réhabiller
`ArticleShell`, c'est un fichier pour 108 pages.

### Coût 3 : les 88 pages sans gabarit, dont 80 d'une seule forme.
| Forme manquante | Pages |
|---|---|
| `jurisdictions/{pays}/{secteur}`, le maillage longue traîne | **80** (v) |
| `/research` (papier MARIA), `/legal-data` (5 613 HS6, 14 225 régs, 4 658 autorités, 158 marchés), `/skills` (45 skills MIT), `/security`, `/changelog`, `/resources/data`, index `/jurisdictions`, index `/industries` | 8, toutes en 200 aujourd'hui (v) |
| `/for/{persona}` ×3 : `03-offre` raisonne par feature, pas par acheteur, et ce sont les seules pages sans JSON-LD propre | 3 |

88 sur 264, soit une page sur trois. Lecture honnête : ce sont **8 formes distinctes**, dont
une répétée 80 fois.

### Coût 4 : la recherche. La page disparaît et son retour devient ambigu.
Aucun gabarit pour `/research`, `/maria-action-plan`, `/agents`. Pire, `construire.mjs:26`
titre `07-chat.html` « Research » (v), où le mot désigne une **fonctionnalité produit**
(H1 « Recherche réglementaire. La source avant le résumé »), repris tel quel dans le pied de
page de la maquette. Le port ne supprime pas seulement la page scientifique, il rend son
retour ambigu. Disparaissent avec elle : la carte `/company` vers `/research` et sa phrase
« 19 régions, 8 langues, 30+ appels LLM par exécution », les 4 blocs JSON-LD uniques de
`/maria-action-plan` (`DefinedTerm`, `HowTo` 4 étapes, `FAQPage`, `BreadcrumbList`), et le
nom MARIA lui-même : 159 occurrences dans le dépôt contre **1** dans les 24 gabarits.

### Coût 5 : la levée. Le montant reste, la preuve part.
La maquette n'en garde qu'une caption sans lien, sans date, sans investisseur :
« 1,5 M€ levés en pre-seed » (`02-entreprise.html:155`). En face, sur les 26 pages
construites : **0** occurrence de Kima, Saint-James, Larry Berger, Amplify ; **0** des 6
liens de presse (tech.eu, eu-startups.com, vestbee.com, fintech.global, regtechanalyst.com,
thelegalwire.ai, tous datés avril 2026) ; **0** des 4 liens LinkedIn (v : 4 liens LinkedIn
servis sur `/fr/company`). Ce sont les six domaines tiers qui autorisent un moteur à répéter
« Cleo Labs a levé 1,5 M€ », et les ancres qui rattachent trois personnes à des entités
connues. Le socle déclaratif, lui, ne bouge pas (partie 2) : c'est la preuve visible qui part.

### Coût 6 : l'article Deel. Couvert en apparence, vidé en pratique.
`/blog/global-product-compliance-pitch-by-deel` : 1 401 mots servis, 16 blocs `ld+json`
dont `TechArticle` + `FAQPage` (v). Il est « couvert » par `12-article`, donc il subit les
8 pertes du coût 2, FAQPage compris. Disparaissent aussi le badge « Lauréate, The Pitch by
Deel (Station F), parmi 35 000+ candidatures » et toute mention de Station F (0 sur 26).
L'`award` du JSON-LD Organization survit, lui, puisqu'il vit dans le layout racine.

### Coût 7 : le maillage et la couche de tête à rebrancher.
0 JSON-LD, 0 canonical, 0 hreflang, 0 meta description, 0 `og:` sur les 26 pages (v).
Ce n'est pas un défaut de la maquette : sur le site ces balises vivent dans les layouts.
C'est un décompte de ce qu'il faut réinjecter. Idem pour les liens : **2 280 `href` dans
`sortie/`, dont 1 060 vers `#` et 0 lien externe** (v). Et le mur de logos clients disparaît
(6 marques avec alt réels : Decathlon, Mercedes-Benz, L'Occitane, Electrolux Professional,
SNCF Réseau, Balzac Paris ; rappel : Longchamp, BIC, PMU, Kiabi restent interdits à
l'impression). Sur `02-entreprise`, 15 alt vides sur 17 images, contre 0 sur 13 côté site.

### À traiter dans le même passage, indépendamment du port
- `/resources/gdpr-compliance` répond 404 (v) et reste déclaré 8 fois au sitemap servi
  (2 `<loc>` + 6 alternates), en priorité 0,9. `llms.txt` et `llms-full.txt` pointent
  dessus aussi.
- Le score **F1 0,81** affiché sur `/fr/research` et `/en/research` ne figure pas dans le
  livre blanc que la même page fait télécharger. À retracer ou à retirer avant toute
  republication de la page.
- Trois définitions concurrentes de MARIA circulent (5 agents fonctionnels dans
  `llms-full.txt` / 5 étapes de pipeline sur `/research` / 11 agents par vérification sur
  `/agents`, en 404). Un moteur qui lit les deux fichiers servis reçoit deux listes de cinq
  dont aucun nom ne coïncide.
- `llms-fr.txt` : 0 occurrence de MARIA, et le fichier n'est déclaré dans aucun `<head>`.
- `/maria-action-plan` : 4 blocs JSON-LD uniques, 0 lien interne entrant, absente des trois
  `llms*.txt`.
- Le livre blanc n'est pas citable : 0 identifiant pérenne (arXiv/DOI/HAL/Zenodo), pas de
  `ScholarlyArticle`, métadonnées PDF vides, absent du sitemap, 1 seul lien entrant, et ses
  trois auteurs (Naomie Halioua, Alexandre Bloch, Anaëlle Guez) ne sont affichés nulle part.
- Deux nœuds `Organization` sur `/company`, dont un sans `@id`. Et le `sameAs` Crunchbase
  pointe le slug `celo-labs` : à vérifier.
- Trois titres pour Naomie : « CDO » dans la maquette, « Directrice de la Recherche » à
  l'écran du site, « CRO & Co-founder » et « Chief Research Officer & Co-founder » dans deux
  blocs JSON-LD. Le site en porte déjà deux, la maquette en ajoute une troisième.
- Deux adresses pour une entité : `hello@cleolabs.co` au pied de la maquette,
  `contact@cleolabs.co` dans le JSON-LD, `llms.txt` et `llms-fr.txt`.
- Claim non sourcé introduit par la maquette : « Sélection CES Las Vegas, délégation
  française 2026 ». Le site ne dit que « Vu au CES 2026 » (`src/i18n/sections/hero.ts:6`).
  À faire confirmer avant publication.
- Deux personnes nouvelles en portrait, Darcial Mondjo et Thezi Mabuza, photos dans
  `images/experts/`. À confirmer avant mise en ligne : « Darcial » est aussi le nom d'un
  produit interne.
- **Mine dormante, à ne jamais rebrancher** : `src/i18n/sections/research.ts:79-82` déclare
  deux chercheuses aux noms inventés (Ana Velázquez, Lucía Mendoza) avec
  `/researcher-1.webp` et `/researcher-2.webp`. Rendues nulle part aujourd'hui, mais les
  mêmes photos sont déjà déclarées dans `construire.mjs:58-59` sans être utilisées. Le fil
  est posé des deux côtés.

### Ce qui serait perdu à l'inverse, si on ne porte rien
Trois gains réels de la maquette, à ne pas laisser sur la table :
le **sommaire ancré** (0 des 108 articles en ligne n'a un seul `<h2 id=>`), la **citation de
texte primaire visible** (`Règlement (UE) 2025/40, article 2, paragraphe 1` ; 2 articles sur
108 utilisent un `<blockquote>`, et ce sont des citations de personnes), et la **phrase
d'honnêteté** du bloc Sources : « Les dates citées sont celles du texte publié, non d'une
version consolidée. » Plus le **pied de page à 43 liens réglementaires** (REACH, CLP, RSGP,
EPI, PPWR, EN 71, Batteries, ESPR, AI Act, PFHxA, Prop 65, TSCA, CPSIA, ASTM F963, Loi 96).
Celui-là est un actif, pas une perte.

---

## 4. LA RÈGLE DE PORTAGE

**La décision, en une phrase : on ne porte pas la maquette. On refait les gabarits dans le
dépôt Next, en gardant les pages, les URL et les layouts.** La maquette devient la référence
de design, pas la source du site. Rien ne sort de `cleo-maquettes-edge` vers la production
sauf du CSS, des composants de présentation et des fragments de contenu explicitement
listés.

### La règle d'or, à écrire en tête du plan de port
> On remplace **le corps** d'une page (`page.tsx`, composant client). On ne touche **jamais**
> à son `layout.tsx` dans le même passage. Un `layout.tsx` ne se modifie que seul, dans un
> commit qui ne fait que ça.

### Les intouchables, à geler avant la première ligne de code
`src/app/sitemap.ts` · `src/app/robots.ts` · `src/app/[locale]/layout.tsx` · les 26
`layout.tsx` de section · `src/data/blog-posts.json` · `public/llms.txt`,
`llms-full.txt`, `llms-fr.txt` · `src/components/Navbar.tsx:98` · les 266 chemins du
sitemap et la forme d'URL `/{en,fr}/blog/<slug>`.
`ArticleShell.tsx` est **restylable, pas réécrivable** : on change ses classes et sa
composition visuelle, on ne touche pas aux lignes 85-140 qui émettent le structuré.

### Les étapes, dans l'ordre, avec le contrôle qui suit chacune

**0. Le plan de port, avant tout.** Un fichier qui liste les intouchables ci-dessus et la
règle d'or. Sans lui, l'étape 2 se fait au jugé.
*Contrôle : le plan existe, il nomme les 26 layouts, et il est validé par toi.*

**1. Poser le témoin.** Capturer l'état actuel : `curl /sitemap.xml | grep -c "<loc>"`, le
compte de `TechArticle` et de `FAQPage` sur les 108 articles, les 266 chemins et leur code
HTTP, les 11 blocs `ld+json` de `/company`. Un fichier de référence, daté.
*Contrôle : le témoin donne 532 / 108 / 104 / 265 en 200 / 11. Si un de ces cinq diffère
d'entrée, on comprend pourquoi avant de continuer.*

**2. Porter la peinture, pas la page.** `commun/base.css`, `commun/composants.css`,
`commun/mouvement.css` deviennent des tokens et des classes du dépôt Next. Zéro fichier
`.tsx` modifié à cette étape.
*Contrôle : `git diff --stat` ne montre que des fichiers de style. Le témoin de l'étape 1
rejoue à l'identique.*

**3. `ArticleShell` en premier, seul, dans son commit.** Un fichier, 108 pages. On y
réhabille l'existant **et** on y ajoute les trois gains de la maquette : le sommaire ancré
avec des `<h2 id=>`, le `<blockquote>` de texte primaire, la phrase d'honnêteté du bloc
Sources. On y **câble le bloc FAQ du kit** (`commun/composants.css:388`, déjà dessiné) sur
le champ `faq[]` existant. On garde `<time datetime>`, l'auteur `Person` avec son LinkedIn,
la bibliographie `<cite>`.
*Contrôle : les 108 articles rendent toujours 108 `TechArticle` et 104 `FAQPage`, plus
108 `<time datetime>` et 108 auteurs nommés. Et 108 `<h2 id=>` là où il y en avait 0.*

**4. Mettre à jour `cleo-publish` le même jour.** Les trois fichiers que la routine écrit
doivent sortir au nouveau format. Publier un article de test hors production avant la
bascule.
*Contrôle : un article publié le lendemain rend le même nombre de blocs JSON-LD qu'un
article d'avant-hier. Si l'article du jour rend 200 avec un corps vide, la table
`ARTICLE_COMPONENTS` n'a pas suivi.*

**5. Réhabiller les pages simples, une par une, `page.tsx` uniquement.** Ordre conseillé :
`/company`, l'accueil, `/platform`, `/solutions`, `/resources`, `/careers`. Sur `/company`,
reporter dans le corps ce qui n'y était pas : les 6 liens de presse avec leurs URL exactes,
le badge Deel / Station F, les 3 LinkedIn de fondateurs, le mur de logos avec ses 6 alt, la
carte vers `/research` et sa phrase « 19 régions, 8 langues, 30+ appels LLM par exécution ».
Remplir les 15 alt vides.
*Contrôle après CHAQUE page : le `<title>` servi est inchangé, le nombre de blocs
`ld+json` est inchangé, le canonical et les 3 hreflang sont là. Sur `/company` précisément :
« Kima Ventures » toujours dans le `<title>`, 4 occurrences de `FundingEvent`, 4 liens
LinkedIn, 6 domaines de presse.*

**6. Créer les 8 gabarits manquants dans le dépôt, jamais l'inverse.** Priorité :
`jurisdictions/{pays}/{secteur}` (80 pages), puis les index `/jurisdictions` et
`/industries`, puis `/legal-data`, `/skills`, `/security`, `/changelog`, `/resources/data`.
Chacun avec son `layout.tsx` conservé.
*Contrôle : les 80 chemins pays × secteur répondent toujours 200 et portent toujours leur
JSON-LD.*

**7. `/research` : à part, et protégée.** Elle n'a pas de remplaçant. Si elle ne fait pas
partie du port, **elle reste servie telle quelle** : route, `layout.tsx`, entrée sitemap.
Elle ne tombe pas dans l'intervalle. Et on tranche le vocabulaire : « Research » ne peut pas
désigner à la fois le papier et une feature produit. Renommer la feature dans la maquette
(`construire.mjs:26`, le pied de page, la navigation) coûte trois lignes ; le confondre
coûte la page.
*Contrôle : `/fr/research` et `/en/research` répondent 200, et aucun libellé de navigation
ne dit « Research » pour autre chose.*

**8. Recâbler le maillage.** Les 43 liens du pied de page réglementaire (le garder, c'est un
gain), les 1 060 `href="#"`, le bandeau Navbar vers l'article de la levée. Ajouter les deux
gains les moins chers du dossier : un `ItemList` et un `Blog` sur `/blog` (0 aujourd'hui,
côté site comme côté maquette, vérifié) (v).
*Contrôle : 0 `href="#"` en production, `/fr/blog` porte un `ItemList` avec 108 entrées, le
bandeau pointe toujours `/${locale}/blog/cleo-labs-raises-1-5m-preseed`.*

**9. Les corrections indépendantes du port, dans le même passage.** Supprimer
`/resources/gdpr-compliance` du sitemap servi et des deux `llms*.txt`. Retracer ou retirer
le F1 0,81. Fixer une définition unique de MARIA et l'aligner sur les trois `llms*.txt`,
`/research` et la page produit. Ajouter MARIA à `llms-fr.txt` et le déclarer dans le
`<head>`. Fusionner les deux nœuds `Organization` de `/company` sous un `@id`. Vérifier le
slug Crunchbase. Trancher un seul titre pour Naomie. Trancher `hello@` ou `contact@`.
Confirmer ou retirer le claim CES. Confirmer Darcial Mondjo et Thezi Mabuza. Ne jamais
rebrancher `research.ts:79-82`.
*Contrôle : le sitemap ne déclare plus aucune URL en 404, et `grep -c MARIA llms-fr.txt`
rend au moins 1.*

**10. Contrôle final, avant de promouvoir.** Rejouer le témoin de l'étape 1 en entier.
*Critère de passage, cinq lignes qui doivent toutes tenir :*
1. `curl /sitemap.xml | grep -c "<loc>"` rend toujours **532** au minimum ;
2. les 108 articles rendent **108 `TechArticle`** et **104 `FAQPage`** ;
3. `/en/company` et `/fr/company` portent **« Kima Ventures » dans le `<title>`** et
   **2 `FundingEvent`** avec funders nommés ;
4. `/research`, `/legal-data`, `/skills`, `/security`, `/changelog`, `/maria-action-plan`,
   `/resources/data` répondent **200** avec leur JSON-LD ;
5. les **80** chemins `jurisdictions/{pays}/{secteur}` répondent **200**.

Si une seule des cinq échoue, on ne promeut pas.

---

*Une note sur la fiabilité des sources de ce document : `carte-entreprise.md` §5 affirme que
`sortie/12-article.html` « porte un bloc de questions fréquentes ». C'est inexact, vérifié
en direct : aucune section FAQ n'est rendue, les occurrences de « faq » dans le fichier sont
une règle CSS et du base64 d'image. `carte-routes.md` et `carte-blog.md` disent juste. Le
plan ci-dessus est construit sur la version vérifiée, et l'étape 3 en tient compte.*
