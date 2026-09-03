# Carte du blog — ce que la maquette ne porte pas encore

Relevé du 27 août 2026. Lentille : le blog de cleolabs.co.
Aucun fichier de `cleo-landing` ni de `cleo-maquettes-edge` n'a été modifié.
Scripts de mesure : `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-carte/`
(`wc.mjs`, `wc-main.mjs`, `wc-main.json`, `live_slugs.txt`, `groupes.md`).

---

## 0. Correction d'entrée : ce n'est pas 77, c'est 108

La consigne partait de « 77 fichiers d'articles ». C'est exact **pour la copie locale**,
qui est posée sur la branche `feat/cas-usage-16` (dernier commit du 25 août).
Ce n'est pas ce qu'un robot voit.

| Source | Articles | Autorité |
|---|---|---|
| `~/cleo-landing/src/components/blog/articles/` (copie de travail) | 77 | copie de travail, en retard |
| `origin/main`, même dossier | **108** | dépôt |
| `https://www.cleolabs.co/fr/blog`, liens `/fr/blog/<slug>` comptés dans le HTML servi | **108** | **la page servie** |
| `sitemap.xml` en ligne, `<loc>` contenant `/blog/` | **216** (108 × 2 langues) | déclaré |

Les 31 articles manquants dans la copie locale sont tous des articles pays de la série
quotidienne : `australia-button-battery-supply-testing-2026`, `korea-cosmetics-safety-assessment-2026`,
`germany-verpackdg-packaging-law-2026`, `us-uflpa-entity-list-expansion-2026`, etc.
La liste complète est en annexe, colonne « dépôt local ».

**Tout ce qui suit est mesuré sur `origin/main` et sur la page servie, pas sur la copie locale.**

Et un chiffre qui décide de tout le reste : sur `origin/main`, il y a **exactement un commit
d'article par jour, du 7 au 26 août sans un seul trou**. Le blog n'est pas un stock de 108
pages. C'est une machine qui en ajoute une par jour. Une maquette qui porte 108 pages et pas
la machine est périmée le lendemain de la bascule.

---

## 1. Le corpus, mesuré

| Mesure | Valeur |
|---|---|
| Articles publiés | 108 |
| Mots anglais (texte réel des composants) | **98 814** |
| Mots français | **112 227** |
| Corpus bilingue total | **211 041 mots** |
| Médiane par article (EN) | 1 007 mots |
| Plus court / plus long (EN) | 112 (`regtech-market-2026-landscape`) / 1 657 (`uk-fireworks-noise-limit-consultation-2026`) |
| Titres `<h2>` dans le corpus | 556, soit 5,1 par article |
| Mots-clés déclarés | 1 162 |
| Questions FAQ rédigées | 302, réparties sur 104 articles sur 108 |
| Images de couverture | 103 sur 108 |
| Articles marqués « à la une » | 23 |
| Auteurs | Naomie 75, Anaëlle 25, Alexandre 8 |
| Période couverte | 11 février → 26 août 2026 |

Méthode du comptage de mots : les articles sont des composants TSX bilingues. Le script
tokenise les littéraux de chaîne et ne retient que ceux dont la clé commence par `en` ou par
`fr` (`en`, `enSub`, `fr`, `frSub`…), ce qui exclut le balisage, les classes CSS et les
identifiants. C'est un plancher, pas un plafond : les rares textes hors motif `t({en,fr})` ne
sont pas comptés.

Pour comparaison directe, page contre page, sur le HTML servi et sur la maquette construite :

| Page | Mots visibles | Liens | `<h2>` |
|---|---|---|---|
| `cleolabs.co/fr/blog` (en ligne) | 11 383 | 140 | **108** |
| `sortie/11-blog.html` (maquette) | 511 | 102 | **2** |
| Article en ligne (`cleo-labs-raises-1-5m-preseed`, FR) | 917 | 38 | 6 |
| `sortie/12-article.html` (maquette) | 952 | 97 | 6 |

Le gabarit d'article tient la comparaison au mot près. Le gabarit de liste ne la tient pas :
il montre 7 cartes là où la page servie en montre 108, toutes dans le HTML initial, sans
pagination ni chargement différé.

---

## 2. Comment les articles sont rendus, et ce que ça coûte de changer de gabarit

Ce ne sont pas des fichiers Markdown. Chaque article est un composant React à part entière.
La chaîne est la suivante, et elle a **trois points d'accroche, pas un** :

1. `src/components/blog/articles/<slug>.tsx` — le composant. Il ouvre sur
   `<ArticleShell slug=… category=… date=… readTime=… locale=…>` et remplit l'intérieur avec
   du JSX bilingue, appel par appel : `t({ en: '…', fr: '…' }, locale)`. Le texte anglais et
   le texte français sont **côte à côte dans le même littéral d'objet**, à chaque paragraphe.
2. `src/app/[locale]/blog/[slug]/page.tsx` — une table `ARTICLE_COMPONENTS` qui associe le
   slug à un `dynamic(() => import(…))`. 108 entrées, vérifiées une à une : la table et le
   dossier coïncident exactement, aucun orphelin dans un sens ni dans l'autre.
3. `src/data/blog-posts.json` — 108 entrées de métadonnées : titre, description, date,
   catégorie, temps de lecture, auteur, image, mots-clés, FAQ, texte du tweet.

Le `[slug]` résout dans cet ordre : `getPost(slug)` cherche dans le JSON ; s'il ne trouve
rien, `notFound()` ; s'il trouve, il cherche le composant dans la table. **Si le JSON a une
entrée mais que la table n'a pas le composant**, la page rend un repli silencieux : le titre
et la description, sans corps d'article, sans FAQ, sans bibliographie. Pas d'erreur, pas de
404 — une page vide qui répond 200. C'est le mode de panne à surveiller lors d'un portage.

**Ce que ça implique si on change de gabarit.** Le texte des 108 articles ne vit dans aucune
base et dans aucun fichier de contenu. Il vit à l'intérieur du balisage, mêlé aux classes
Tailwind, aux grilles de cartes, aux encadrés numérotés « 01 / 02 / 03 », aux frises de dates.
Porter le blog vers les gabarits de la maquette, ce n'est pas rebrancher un thème : c'est
**réécrire 108 composants**, chacun avec ses blocs propres, en préservant 211 041 mots dans
deux langues alignées paragraphe par paragraphe. Aucun script ne fait ça tout seul de façon
fiable, parce que la structure interne diffère d'un article à l'autre.

Il y a un chemin plus court, et il vaut la peine d'être dit : `ArticleShell` est déjà la
coquille commune. Tout ce qui est châssis — en-tête, méta visibles, auteur, FAQ, bibliographie,
liens associés, CTA, JSON-LD — y est centralisé. Réhabiller `ArticleShell` avec la DA de la
maquette change les 108 articles d'un coup. Ce qui reste dans chaque fichier, ce sont les
classes de paragraphe et les blocs décoratifs. **Le portage se joue à 90 % dans un seul fichier
si on accepte de garder l'ossature ; il se joue dans 108 fichiers si on change l'ossature.**

Et il y a la machine. La routine de publication (`cleo-publish`) écrit **exactement ces trois
fichiers**, dans cet ordre, tous les jours, puis pousse, la fusion déclenche le déploiement et
le tweet. Changer la forme du composant sans mettre à jour la routine casse la publication du
lendemain, en silence : le composant sortira au format d'hier.

---

## 3. Ce que chaque article porte, et ce qui est faux dedans

### Ce qui est en place

Chaque article servi porte, générés par `ArticleShell` et par le `layout.tsx` du slug :

- des métadonnées complètes : `title`, `description`, `keywords`, OpenGraph `type: article`
  avec `publishedTime` et `authors`, carte Twitter, `canonical` et `hreflang` en/fr/x-default ;
- une image OpenGraph fabriquée à la volée par `/api/og` — vérifiée en ligne, elle répond
  `200 image/png` ;
- **quatre blocs JSON-LD** : `TechArticle`, `BreadcrumbList`, `WebPage`, et `FAQPage` quand
  l'article a des questions. Mesuré en ligne : 14 blocs `ld+json` sur la page de la levée,
  16 sur l'article Deel (le châssis global en ajoute) ;
- l'auteur nommé, avec sa fonction, sa photo et le lien vers son LinkedIn, à la fois visible
  et dans le `author` du JSON-LD, avec `worksFor` ;
- la date en `datePublished` **et** en `dateModified` — les deux valent la date de publication,
  donc aucun article n'a jamais l'air mis à jour ;
- un maillage interne : 334 liens entre articles (97 slugs couverts sur 108), 45 liens vers
  des guides, 27 vers des pages solution. **11 articles n'ont aucun lien sortant contextuel.**

### Trois défauts mesurés, dont un grave

**a) Le `wordCount` déclaré ne correspond pas au texte.**
`ArticleShell` calcule `wordCount: parseInt(post.readTime.en) * 250`. Le temps de lecture est
saisi à la main. Le total déclaré au moteur pour les 108 articles est **181 500 mots** ; le
texte anglais réellement présent en fait **98 814**. L'écart est de **82 686 mots**.
**40 articles annoncent plus du double de ce qu'ils contiennent, 30 plus du triple.** Le pire :
`regtech-market-2026-landscape` déclare 2 250 mots pour 112 réels, soit un facteur 20.
Quatorze articles de la première génération (février-mai) tiennent en moins de 250 mots de
corps pour un « 6 à 10 min read » affiché.

**b) Six articles de chimie citent le règlement européen sur les crypto-actifs.**
C'est le défaut sérieux. `getCitationsForPost` teste `searchText.includes(key)` sur un registre
de douze textes. L'une des clés est `mica`. Or **« mica » est contenu dans « chemical »**.
Résultat, vérifié en ligne sur `sweden-pfas-cookware-ban-2026` :

```
"citation":[
 {"@type":"Legislation","name":"Regulation (EC) No 1907/2006: REACH", …},
 {"@type":"Legislation","name":"Regulation (EU) 2023/1114: Markets in Crypto-Assets (MiCA)",
  "legislationIdentifier":"EU 2023/1114",
  "url":"https://eur-lex.europa.eu/eli/reg/2023/1114/oj"}]
```

Le règlement MiCA apparaît **dans le JSON-LD `citation` et dans la section « Sources &
references » visible**, sur six articles qui ne parlent pas une seconde de crypto :
`sweden-pfas-cookware-ban-2026`, `canada-flame-retardant-import-ban-2026`,
`connecticut-pfas-product-labeling-2026`, `canada-epoxy-resin-labelling-2026`,
`eu-svhc-scip-notification-2026`, `chemical-product-compliance-global-regulations`.
Un moteur génératif qui lit ces pages apprend qu'un règlement sur les crypto-actifs encadre
les PFAS dans les poêles. C'est exactement le mode de panne que dénonce l'article
`epistemic-vigilance-compliance-ai-fake-regulations`, publié sur ce même blog.

**c) Les sources primaires sont rares, et surtout automatiques.**
Sur les 108 fichiers d'articles, **11 seulement contiennent un lien sortant écrit à la main**,
27 liens en tout, et **aucun ne pointe vers un régulateur** : ce sont des liens vers
`legaldata-public.cleolabs.co`, GitHub, npm, arXiv. Toute la citation de droit primaire vient
de la bibliographie automatique, qui ne se déclenche que pour **45 articles sur 108** —
les 63 autres, dont tous les articles pays (Corée, Hong Kong, Malaisie, Allemagne, Brésil…),
sont servis **sans une seule source affichée**. Pour un éditeur qui vend la traçabilité
réglementaire, c'est le signal le plus coûteux à ne pas porter.

Un quatrième point, plus léger : trois chiffres différents cohabitent sur le site pour la même
réalité. `docs/CANONICAL-FACTS.md` fixe **106 pays / 25 000 régulations / 19 000 autorités**.
Le châssis global annonce « 3 700+ regulatory sources ». L'article de la levée écrit
« more than 25 000 regulatory authorities ». La FAQ de l'article Deel écrit « 19 000+ ».
Et cinq articles portent encore les valeurs purgées (50 000 / 27 000 / 163). Le canon existe,
il n'est pas tenu.

---

## 4. Les deux articles que Naomie nomme

### `cleo-labs-raises-1-5m-preseed` — la levée

Publié le **29 avril 2026**, catégorie Entreprise, auteur Naomie, 5 min annoncées,
**679 mots EN / 752 FR** mesurés, image `blog-cleo-raises-1-5m.png` en format carré,
marqué « à la une ». **Aucune FAQ** — donc pas de bloc `FAQPage` sur cette page.

Ce qu'il porte comme faits, et qu'un moteur peut extraire aujourd'hui :

- montant **1,5 M€**, premier tour, daté « Paris — 29 avril 2026 » ;
- tour mené par **Larry Berger**, avec **Kima Ventures** et **Financière Saint-James** ;
- business angels nommés : **Boris Paillard** (Le Wagon), **Ambre Soubiran** (Kaiko),
  **Stéphanie Zolesio** (Casino), **Charles Sutton** (Datascientest) ;
- un **ticket scout d'Accel** ;
- un **financement de Deel** consécutif à la victoire au Pitch by Deel ;
- **Decathlon** cité nommément comme client ;
- MARIA décrite comme surveillant « plus de 25 000 autorités réglementaires dans 106 pays »
  — hors canon, le canon dit 19 000 autorités et 25 000 régulations ;
- les deux fondatrices, leurs diplômes, le passé d'Anaëlle comme Chief Transformation Officer
  chez Havas ;
- deux citations attribuées, une par fondatrice ;
- un contact presse, `contact@cleolabs.co`.

**Comment il est lié.** C'est l'article le mieux relié du site, et pas depuis la page
entreprise : il est la cible du **bandeau d'annonce de la barre de navigation**
(`src/components/Navbar.tsx`, ligne 98), donc lié depuis **toutes les pages, dans les deux
langues**, tant que le visiteur n'a pas fermé le bandeau. C'est le lien interne le plus fort
de cleolabs.co. La page `/company` ne le référence pas : elle ne rend que `<TeamSection>`.
Aucune autre page ne le cite.

**Ce que ça veut dire pour la maquette.** Le bandeau de la maquette ne pointe vers rien
d'équivalent. Si la bascule se fait sans reconduire ce lien, l'article de la levée passe d'une
page liée depuis 264 pages à une page liée depuis la seule liste du blog.

### `global-product-compliance-pitch-by-deel` — l'article Deel

Publié le **17 avril 2026**, catégorie Entreprise, auteur Naomie, 6 min annoncées,
**1 007 mots EN / 1 064 FR**, image `blog-pitch-by-deel.jpg`, marqué « à la une »,
**3 questions FAQ** (donc un bloc `FAQPage` en ligne).

Qui est Deel dans ce texte, et jusqu'où le nom engage :

- Deel n'y est ni client, ni partenaire, ni investisseur au sens d'un tour de table. Deel est
  **l'organisateur d'un concours que Cleo a gagné** : « The Pitch by Deel », finale régionale
  à Station F le 13 avril 2026, plus de 35 000 candidatures, présenté par J.P. Morgan. La
  victoire s'accompagne d'un financement et d'une qualification pour la finale de Dubaï.
- Le nom apparaît **21 fois** dans le fichier.
- Le texte va au-delà du fait. Il pose une équivalence de positionnement, en exergue :
  **« Deel automated global payroll. We're automating global product compliance. »**
  Et il écrit : « Quand l'équipe qui a écrit le playbook valide l'angle, on est attentif. »
- Une photographie des finalistes sur scène est publiée : `/blog-pitch-by-deel-stage.jpg`.

**Le point qui engage n'est pas dans l'article.** Il est dans le châssis global,
`src/app/[locale]/layout.tsx` :

- la **meta description de tout le site**, EN et FR, se termine par
  « **The Deel of product compliance.** » / « Le Deel de la conformité produit. » ;
- le **JSON-LD `Organization`** porte `slogan: "The Deel of product compliance"` et
  `award: "Winner — The Pitch by Deel (Station F, 2026)"`.

Le prix est un fait, et `award` est le bon champ pour le dire. Le `slogan`, lui, inscrit une
marque tierce dans la définition machine-lisible de Cleo Labs, sur toutes les pages du site.
Ce n'est pas une décision de gabarit : c'est une décision de marque, et elle se prend
indépendamment du portage. Elle est simplement **à décider avant**, parce qu'une bascule est
le seul moment où on peut la changer sans que ça ressemble à un rétropédalage.
La formule figure aussi dans `PressSection` et dans `AProposSections` (la page entreprise),
sous une forme purement factuelle — « Lauréate — The Pitch by Deel, parmi 35 000+ candidatures ».
Celle-là ne pose aucun problème.

**Comment il est lié.** Contrairement à la levée, l'article Deel **n'est lié depuis aucune page
hors blog**. Ses seuls liens entrants sont six renvois « à lire aussi » depuis d'autres
articles (`slug-to-related.json`) et la liste du blog. Il est « à la une » dans le JSON, ce qui
lui vaut une priorité 0,9 au sitemap, mais aucune mise en avant éditoriale sur le site.

---

## 5. Les deux gabarits, face au vrai blog

### `11-blog` contre `/fr/blog`

| | En ligne | Maquette `11-blog` |
|---|---|---|
| Cartes d'articles | **108** | **7** (1 à la une + 6) |
| Liens vers des articles dans le HTML | 108 | 7, tous vers le même `12-article.html` |
| `<h2>` | 108 (un par titre d'article) | 2 |
| Mots visibles | 11 383 | 511 |
| Filtres | 4 boutons par auteur, avec photo et compteur, côté client | rail `RES-NAV` de section |
| Pagination | aucune, les 108 sont dans le HTML initial | sans objet |
| JSON-LD de liste | **aucun** — seulement un `BreadcrumbList` | aucun |

Ce que la maquette **perd** : la densité. Une page qui expose 108 titres et 108 descriptions
dans son HTML initial est une page d'index réelle ; c'est par elle que passe la découverte des
108 articles, puisqu'aucun flux RSS n'existe (vérifié : `/rss.xml`, `/feed.xml`,
`/blog/rss.xml` répondent 404, et `/en/blog/rss.xml` répond 200 mais renvoie du HTML — c'est
un faux positif, il n'y a **pas de flux**). Si la liste passe à une pagination ou à un
chargement au défilement, la profondeur de crawl des articles anciens augmente d'un cran.

Ce que la maquette **gagne** : la hiérarchie. Un article à la une en pleine largeur, un
étiquetage par thème (« Emballage », « Substances », « Méthode », « Sécurité », « Marché »,
« Étiquetage ») qui décrit **le sujet** et non l'auteur. Le filtre actuel est trompeur : il
s'appelle « IA / Conformité / Tech » mais filtre en réalité sur `post.author`. La maquette
range par thème, ce qui est le bon axe, et c'est aussi le bon axe pour un moteur.

Ce qui manque dans les deux : **aucune des deux pages ne porte de `ItemList` ni de `Blog`
JSON-LD**. C'est le gain le moins cher de tout ce rapport.

### `12-article` contre `ArticleShell`

Le gabarit d'article est **meilleur que l'existant sur trois points, et incomplet sur six**.

Ce qu'il **gagne**, et qu'il faut garder :

1. **Un sommaire ancré.** « Sur cette page » avec quatre ancres `#texte`, `#date`, `#apres`,
   `#faire`, et des `<h2 id=…>` correspondants. Mesuré : **0 des 108 articles en ligne n'a un
   seul `<h2 id=>`, aucun n'a de sommaire.** C'est un vrai gain de récupération par passage —
   un moteur génératif cite un fragment, pas une page.
2. **Une citation de texte primaire, visible, dans le corps.** Le `<blockquote>` avec
   `<span class="source-citee">Règlement (UE) 2025/40, article 2, paragraphe 1</span>`.
   Mesuré : **2 articles sur 108 utilisent un `<blockquote>`**, et ce sont des citations de
   personnes, pas de textes de loi.
3. **Un bloc Sources honnête.** « Les dates citées sont celles du texte publié, non d'une
   version consolidée. » L'existant n'a pas cette phrase. Elle vaut plus qu'un lien.

Ce qu'il **perd**, poste par poste :

| Élément d'`ArticleShell` | Dans `12-article` | Ce que ça coûte |
|---|---|---|
| `TechArticle` + `BreadcrumbList` + `WebPage` + `FAQPage` JSON-LD | absent | 4 blocs par page × 108 pages |
| Section FAQ visible | absente | **302 questions rédigées**, 104 articles concernés |
| Auteur nommé, photo, lien LinkedIn, fonction | « Équipe Cleo », sans lien | le signal d'expertise, sur 108 pages |
| `<time datetime="…">` | date en texte brut | la date n'est plus machine-lisible |
| Bibliographie avec `<cite>` et liens EUR-Lex | bloc Sources sans **aucun `<a>`** | les 45 articles qui en ont une |
| Renvois vers solutions et guides | absents | 45 + 27 liens contextuels |
| Renvois vers d'autres articles | 3 cartes, en dur | 334 liens réels à recâbler |
| Mécanique bilingue `t({en,fr})` | aucune, tout est en français | la moitié du corpus, et le `hreflang` |

Le dernier point est le plus structurant et il dépasse le blog : **la maquette n'a qu'une seule
page anglaise sur 26** (`01-accueil-en.html`). Le blog en ligne est intégralement bilingue,
108 articles × 2 langues, avec `hreflang` et `x-default` sur chacun. C'est la moitié des
216 URL de blog du sitemap.

---

## 6. Ce qu'il faut préserver, dans l'ordre

1. **La machine avant le stock.** La routine écrit trois fichiers précis chaque jour. Si le
   gabarit change, la routine change le même jour, sinon la publication du lendemain sort au
   format d'hier — sans erreur, donc sans alerte.
2. **Les 108 URL, à l'identique.** `/{en,fr}/blog/<slug>`. 216 entrées de sitemap, dont
   46 à priorité 0,9. Un changement de forme d'URL, même propre, c'est 216 redirections à
   écrire et à tenir.
3. **Le lien du bandeau vers l'article de la levée.** C'est le seul lien interne présent sur
   toutes les pages du site.
4. **`ArticleShell` comme point unique.** Réhabiller la coquille change 108 articles d'un
   coup. Remplacer la coquille, c'est réécrire 108 fichiers et 211 041 mots bilingues.
5. **Les 302 questions FAQ et les 4 blocs JSON-LD.** Rien de tout cela n'existe dans la
   maquette, et c'est ce qui rend les articles citables.
6. **Le bilinguisme.** 112 227 mots français et 98 814 anglais, alignés paragraphe par
   paragraphe à l'intérieur des composants. La maquette n'a pas de mécanique pour ça.

Et trois corrections qui ne dépendent pas du portage, qu'il vaut mieux faire avant :
la clé `mica` qui capture « chemical » ; le `wordCount` calculé sur un temps de lecture saisi
à la main ; les trois chiffres concurrents pour la couverture.

---

## 7. La réponse à la question posée

« Si on garde cette structure de maquette, est-ce qu'on est OK avec le SEO et le GEO de
l'ancien site ? »

Sur le blog : **non, pas en l'état.** Pas parce que la maquette est moins bonne — sur trois
points d'article elle est meilleure — mais parce qu'elle couvre **2 pages de gabarit face à
109 pages réelles**, dans **1 langue face à 2**, **sans FAQ, sans auteur identifié, sans date
machine-lisible et sans JSON-LD**, et surtout **sans la routine quotidienne qui alimente le
tout**.

Ce n'est pas un obstacle à la bascule. C'est un poste de travail qui n'a pas encore été
chiffré, et le voici chiffré : 108 composants, 211 041 mots bilingues, 302 questions,
334 liens internes, 216 URL à préserver, un article par jour à ne pas interrompre.

---

## Annexe — les 108 articles, groupés

Colonne « dépôt local » : `non` signale les 31 articles présents en ligne et sur `origin/main`,
absents de la copie de travail locale.

### A. Cleo, la marque et la machine — 12 articles, 7 544 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-06-15 | `cleo-labs-vivatech-2026-scaleway-startup-challenge` | Cleo Labs remporte le Scaleway Startup Challenge et sera présente à VivaTech 2026 | 329 | oui |
| 2026-06-04 | `mcp-server-week-1-retrospective` | Pourquoi nous avons open-sourcé notre MCP server : rétro semaine 1 | 931 | oui |
| 2026-06-03 | `cursor-mcp-compliance-skills` | Comment utiliser Cleo Skills MCP dans Cursor en 60 secondes | 811 | oui |
| 2026-06-02 | `compliance-checks-claude-code-60-seconds` | 5 vrais checks de conformité faits avec Claude Code en moins de 60 secondes | 994 | oui |
| 2026-06-01 | `cleo-runs-on-claude-opus-4-8` | Cleo tourne désormais sur Claude Opus 4.8, et nous avons fait l'éval pour le prouver | 788 | oui |
| 2026-05-31 | `legal-atlas-machine-readable-law` | Legal Atlas : le droit mondial, lisible par les machines | 441 | oui |
| 2026-05-29 | `open-source-product-compliance-skills-ai-agents` | Nous avons open-sourcé 40 skills compliance produit pour agents IA | 950 | oui |
| 2026-05-26 | `whats-new-may-2026` | Quoi de neuf chez Cleo : mai 2026 | 370 | oui |
| 2026-04-30 | `whats-new-april-2026` | Quoi de neuf chez Cleo : avril 2026 | 198 | oui |
| 2026-04-29 | `cleo-labs-raises-1-5m-preseed` | Cleo Labs lève 1,5 M€ pour automatiser la conformité réglementaire produit à l’échelle mondiale | 679 | oui |
| 2026-03-10 | `epistemic-vigilance-compliance-ai-fake-regulations` | Et si quelqu'un soumettait un faux texte RGPD à votre IA de conformité ? | 523 | oui |
| 2026-03-09 | `multi-agent-ai-compliance-research-2026` | L'IA multi-agents pour la conformité : Ce que dit la Recherche en 2026 | 530 | oui |

### B. Doctrine et marché (transversal) — 26 articles, 13 770 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-05-27 | `regulatory-data-quality-plm-integration` | Pourquoi votre PLM ne vaut que par la qualité des données réglementaires qu'on lui injecte | 1332 | oui |
| 2026-04-27 | `lipstick-legal-risk-cosmetics-recalls-2026` | Quand un rouge à lèvres devient un risque juridique : ce que les rappels cosmétiques de 2025 révèlent sur la conformité produit | 793 | oui |
| 2026-04-26 | `one-toy-two-legal-outcomes-magnetic-recalls` | Un même jouet, deux statuts légaux : pourquoi les jouets magnétiques sont rappelés selon les marchés | 760 | oui |
| 2026-04-17 | `global-product-compliance-pitch-by-deel` | Conformité produit mondiale en 2026 : pourquoi nous avons gagné The Pitch by Deel | 1007 | oui |
| 2026-03-31 | `data-quality-ml-compliance-gdpr` | « Un travail de détective qu'on ne devrait pas avoir à faire » : pourquoi la qualité des données est l'angle mort de la conformité ML | 544 | oui |
| 2026-03-24 | `legal-here-illegal-there` | 8 produits légaux ici, interdits là-bas | 947 | oui |
| 2026-03-17 | `trism-trust-risk-security-agentic-ai` | TRISM : l'IA agentique n'a pas un problème de confiance ; elle a un problème d'architecture | 1001 | oui |
| 2026-03-14 | `cosmetic-regulation-by-country` | Réglementation cosmétique par pays : UE vs US vs Japon vs Brésil vs Chine | 426 | oui |
| 2026-03-13 | `digital-product-passport-retail-guide` | Passeport numérique produit (DPP) : ce que les marques retail doivent savoir | 498 | oui |
| 2026-03-12 | `chemical-product-compliance-global-regulations` | Conformité mondiale des produits chimiques : numéros CAS, formulations et réglementations multi-pays | 1490 | oui |
| 2026-03-11 | `multi-market-product-compliance-retail` | Conformité produit multi-marchés pour le retail : le guide définitif | 1157 | oui |
| 2026-03-06 | `what-is-product-compliance-eu` | La conformité produit dans l'UE : le guide complet pour les entreprises tech | 235 | oui |
| 2026-03-05 | `regulatory-compliance-france-guide` | Conformité réglementaire en France : guide complet pour les entreprises tech | 367 | oui |
| 2026-03-03 | `product-compliance-vs-corporate-compliance` | Conformité produit vs. conformité corporate : quelle différence et pourquoi c'est important | 135 | oui |
| 2026-02-27 | `compliance-it-stack-fintech-2026` | La pile technique conformité en 2026 : pourquoi les fintechs ont besoin d'intelligence réglementaire, pas de plus d'outils GRC | 434 | oui |
| 2026-02-25 | `product-compliance-checklist-fintech-eu` | Checklist conformité produit : lancer un produit fintech dans l'UE | 413 | oui |
| 2026-02-22 | `agentic-ai-regulatory-compliance` | L'IA agentique pour la conformité réglementaire : pourquoi l'avenir de la conformité est autonome | 379 | oui |
| 2026-02-21 | `cost-of-non-compliance-eu-2026` | Le vrai coût de la non-conformité dans l'UE : données 2026 | 120 | oui |
| 2026-02-20 | `compliance-officer-ai-tools-guide` | Le guide des outils IA pour les responsables conformité en 2026 | 177 | oui |
| 2026-02-19 | `ai-transforming-compliance-monitoring` | Comment l'IA transforme la veille réglementaire en 2026 | 262 | oui |
| 2026-02-18 | `regtech-market-2026-landscape` | Marché RegTech 2026 : le guide définitif du paysage | 112 | oui |
| 2026-02-17 | `multi-agent-ai-regulatory-scoring` | Comment l'IA multi-agents évalue le risque réglementaire : dans la chaîne d'analyse de Cleo | 148 | oui |
| 2026-02-16 | `cybersecurity-compliance-tech-companies-eu` | Conformité cybersécurité pour les entreprises tech dans l'UE : NIS2, DORA et au-delà | 151 | oui |
| 2026-02-15 | `regulatory-intelligence-trends-2026` | Intelligence réglementaire en 2026 : 5 tendances que les responsables conformité ne peuvent pas ignorer | 378 | oui |
| 2026-02-13 | `explainable-ai-compliance-decisions` | Construire une IA explicable pour la conformité : pourquoi la transparence est non négociable | 314 | oui |
| 2026-02-12 | `automating-third-party-due-diligence` | Automatiser la due diligence tiers : de 5 jours à 2 heures | 190 | oui |

### C. UE — 22 articles, 20 438 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-16 | `eu-svhc-scip-notification-2026` | Le 4 août, le délai a expiré pour que les marques vendant dans l'UE notifient Bruxelles au sujet de deux nouvelles substances extrêmement préoccupantes : l'une d'elles, le n-hexane, est la première substance que l'UE ait jamais ajoutée à cette liste pour une atteinte au système nerveux, et non pour le risque de cancer ou de fertilité sur lequel la liste a été construite | 1265 | **non — live seulement** |
| 2026-08-09 | `eu-battery-carbon-footprint-class-2026` | Le règlement européen sur les batteries donnait à Bruxelles jusqu'au 18 février 2025 pour définir les classes d'empreinte carbone des batteries de véhicules électriques : dix-huit mois plus tard, cette classe n'existe toujours pas, et la prochaine échéance, pour les batteries industrielles, tombe le jour même où l'étiquette doit être apposée | 1548 | **non — live seulement** |
| 2026-08-07 | `eu-product-passport-registry-2026` | Le 20 juillet, la Commission européenne a ouvert son registre du Passeport numérique produit, et le 6 août les règles qui l'encadrent sont entrées en vigueur : l'étape que chaque marque doit franchir en premier n'a pas de date limite qui lui soit propre | 1387 | **non — live seulement** |
| 2026-07-29 | `eu-right-to-repair-transposition-2026` | La directive européenne sur le droit à la réparation s'applique dès le 31 juillet : les produits et obligations sont harmonisés à l'échelle de l'UE, mais le texte de conformité auquel répond réellement une marque est l'une de 27 lois nationales différentes | 1283 | **non — live seulement** |
| 2026-07-28 | `eu-customs-compliance-report-2026` | Le 20 juillet, la Commission européenne a publié elle-même l'argumentaire pour abandonner les contrôles douaniers physiques : un écart de 384 fois entre son État membre le plus performant et le moins performant compte plus que le chiffre choc de 60 % d'échec | 1317 | **non — live seulement** |
| 2026-07-26 | `eu-reach-formaldehyde-limit-2026` | La nouvelle limite européenne sur le formaldéhyde s'applique dans 11 jours, et la plupart des équipes conformité la lisent encore comme une règle sur le mobilier : elle plafonne en réalité tout article d'intérieur qui dégage du formaldéhyde, selon deux seuils distincts | 1124 | oui |
| 2026-07-25 | `eu-cosmetics-inci-glossary-2026` | Le 30 juillet, l'UE remplace le dictionnaire de référence sur lequel repose toute étiquette cosmétique, et la liste d'ingrédients d'un produit peut passer de conforme à illégale sans que la formule change d'un gramme | 1111 | oui |
| 2026-07-23 | `eu-ppwr-packaging-conformity-2026` | La loi européenne sur les emballages s'applique dans 20 jours : le vrai piège du 12 août n'est pas l'échéance, c'est qu'une « conformité UE » signifie déposer le même dossier séparément dans chaque État membre où vous vendez | 1290 | oui |
| 2026-07-21 | `eu-eudr-leather-exemption-2026` | L'UE a retiré le cuir de sa loi anti-déforestation le 13 juillet, et y a ajouté le café soluble et des dérivés d'huile de palme sur la même liste, la preuve que la classification à l'annexe I est une cible mouvante, pas un contrôle ponctuel | 1383 | oui |
| 2026-07-15 | `eu-fragrance-allergen-labeling-2026` | La liste des allergènes cosmétiques de l'UE passe de 26 à 82 substances le 31 juillet, et la Commission a corrigé trois entrées huit mois après que la plupart des marques avaient déjà figé leur cartographie | 1216 | oui |
| 2026-06-30 | `espr-unsold-textiles-destruction-ban` | Détruire ses invendus textiles devient illégal le 19 juillet, et chaque marque doit rendre compte de ce qu’elle jette | 683 | oui |
| 2026-06-29 | `eu-de-minimis-end-product-data` | De minimis, c’est fini le 1ᵉʳ juillet : votre vrai problème, ce ne sont pas les 3 €, c’est la donnée produit | 778 | oui |
| 2026-06-08 | `espr-ecodesign-sustainable-products-regulation-guide` | ESPR (règlement UE 2024/1781) : ce qu'il exige, quels produits il couvre et quand les obligations s'appliquent | 1611 | oui |
| 2026-05-28 | `temu-200m-dsa-fine-illegal-products-2026` | Temu condamnée à 200 M€ au titre du DSA : ce que la Commission a réellement dit, et pourquoi cela compte pour toutes les marques européennes | 925 | oui |
| 2026-04-28 | `ce-marking-digital-products-2026` | Marquage CE en 2026 : des produits physiques aux produits numériques | 862 | oui |
| 2026-03-08 | `gpsr-compliance-guide-consumer-goods` | Guide de conformité GPSR pour les marques de biens de consommation (2026) | 557 | oui |
| 2026-03-04 | `csrd-compliance-challenges-2026` | CSRD 2026 : les vrais défis du reporting de durabilité pour les grands groupes | 768 | oui |
| 2026-03-02 | `gdpr-enforcement-by-country-2026` | Application du RGPD par pays : amendes et tendances en 2026 | 169 | oui |
| 2026-03-01 | `nis2-compliance-guide-2026` | Guide de conformité NIS2 : ce que chaque entreprise européenne doit savoir | 221 | oui |
| 2026-02-24 | `ai-act-compliance-guide-2026` | Guide de conformité AI Act 2026 : ce que vous devez savoir maintenant | 359 | oui |
| 2026-02-23 | `dora-compliance-deadline-tracker` | Suivi des échéances DORA : dates clés et actions à mener en 2026 | 341 | oui |
| 2026-02-11 | `gdpr-beyond-compliance-checklist` | RGPD en 2026 : au-delà de la checklist de conformité | 240 | oui |

### C. États-Unis — 9 articles, 10 964 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-26 | `us-uflpa-entity-list-expansion-2026` | Depuis le 3 août, la liste américaine des entités liées au travail forcé a connu sa plus forte extension jamais enregistrée, 43 entreprises ajoutées en une seule fois, et 19 des nouveaux noms ne sont rattachés à aucune présence connue au Xinjiang | 1225 | **non — live seulement** |
| 2026-08-25 | `us-cpsc-co-detector-warning-2026` | Le 20 août, la CPSC a demandé à 376 974 foyers de cesser d'utiliser un détecteur de monoxyde de carbone vendu sous 18 marques : le fabricant ayant refusé le rappel, un avertissement public restait le seul outil dont disposait l'agence | 1227 | **non — live seulement** |
| 2026-08-22 | `us-crib-bumper-marketplace-relisting-2026` | Le neuvième avertissement de la CPSC en dix mois contre un produit interdit depuis 2022 : deux annonces antérieures, retirées à trois semaines d'écart sous des noms de vendeurs différents, portaient le même numéro de modèle du fabricant | 1267 | **non — live seulement** |
| 2026-08-18 | `us-cpsc-counterfeit-squishy-toys-2026` | Le 5 août, la CPSC a annoncé avoir bloqué 355 683 jouets squishy contrefaits répartis sur 55 envois aux frontières américaines : l'alerte intervient cinq mois après l'entrée en vigueur d'une nouvelle norme de sécurité obligatoire pour les jouets à billes d'eau, une norme que la version authentique du même jouet doit désormais respecter | 1460 | **non — live seulement** |
| 2026-08-05 | `us-cpsc-treadmill-reporting-fine-2026` | Le 4 août, la CPSC a infligé à Johnson Health Tech une amende de 16,875 millions de dollars, proche de son propre plafond légal, pour des années d'incidents non signalés sur des tapis de course : l'entreprise a corrigé le défaut à deux reprises avant même de le signaler une seule fois | 1535 | **non — live seulement** |
| 2026-07-24 | `us-cpsc-section-12-imminent-hazard-2026` | Le 22 juillet, les États-Unis sont allés devant un tribunal fédéral pour retirer un produit d'Amazon et eBay, en utilisant un pouvoir inutilisé depuis les années 1980, car aucune des deux entreprises visées n'a laissé aux autorités d'interlocuteur avec qui négocier un rappel | 1252 | oui |
| 2026-07-13 | `us-cpsc-efiling-certificates-2026` | Le dépôt électronique des certificats produit est devenu obligatoire aux États-Unis le 8 juillet : la douane ne rejette pas encore un envoi non déposé, mais elle vous note déjà | 1107 | oui |
| 2026-07-09 | `california-textile-epr-registration-2026` | La Californie exige de chaque marque textile qu’elle s’enregistre pour le recyclage dès le 1ᵉʳ juillet : la bataille judiciaire sur la légalité de son administrateur ne débute que cinq semaines plus tard | 1094 | oui |
| 2026-07-05 | `connecticut-pfas-product-labeling-2026` | L’étiquette PFAS du Connecticut entre en vigueur le 1ᵉʳ juillet, et elle ne suffira pas au Nouveau-Mexique, où une autre s’applique six mois plus tard | 797 | oui |

### C. Royaume-Uni — 5 articles, 5 270 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-19 | `uk-disposable-bbq-supply-ban-2026` | Le 14 août, le Royaume-Uni a retiré tous les barbecues jetables des rayons et des sites marchands en Grande-Bretagne : la règle n'a pas d'échéance fixe, seulement une clause de révision liée aux prévisions météo | 1208 | **non — live seulement** |
| 2026-08-04 | `uk-fireworks-noise-limit-consultation-2026` | Le Royaume-Uni a ouvert le 16 juillet une consultation de 12 semaines pour abaisser de 120 à 110 décibels la limite sonore légale des feux d'artifice : environ un tiers des produits grand public actuels échoueraient à ce test, et le réussir ne suffirait pas à satisfaire les propres règles de licence de l'Écosse | 1657 | **non — live seulement** |
| 2026-07-22 | `uk-sand-toys-asbestos-supply-chain-2026` | Le Royaume-Uni a dit aux marques de jouets et de loisirs créatifs, le 20 juillet, qu'un test en laboratoire réussi ne prouve plus qu'un produit est exempt d'amiante, après plus de 80 rappels dans une douzaine de pays remontant à une seule carrière chinoise, la question de conformité vient de passer du banc de labo à la chaîne d'approvisionnement | 1545 | oui |
| 2026-07-04 | `uk-cosmetics-enzacamene-ban-2026` | Le Royaume-Uni interdit l’Enzacamène dans les cosmétiques dès le 15 juillet, et le même SKU reste légal une frontière plus loin, en Irlande du Nord | 671 | oui |
| 2026-02-28 | `uk-post-brexit-compliance-2026` | Conformité UK post-Brexit : ce que les entreprises européennes doivent savoir en 2026 | 189 | oui |

### C. Corée du Sud — 3 articles, 3 691 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-17 | `korea-direct-purchase-child-safety-gap-2026` | Le 6 août, l'agence coréenne des normes a jugé 94 des 484 produits achetés en direct de l'étranger non conformes, un taux quatre fois supérieur à la moyenne du marché domestique : pour les seuls jouets gonflables de piscine pour enfants, 18 échecs sur 20 | 1330 | **non — live seulement** |
| 2026-08-11 | `korea-customized-supplement-labeling-2026` | Le 21 juillet, le régulateur sud-coréen des aliments et médicaments a proposé un avertissement obligatoire pour chaque complément alimentaire personnalisé vendu dans le pays : cet avertissement a fait la une de la presse spécialisée, mais le même projet impose pour la première fois aux fabricants de consigner par écrit chaque reconditionnement d'un lot | 1184 | **non — live seulement** |
| 2026-07-27 | `korea-cosmetics-safety-assessment-2026` | La Corée du Sud a proposé un dossier de sécurité cosmétique obligatoire le 8 juillet : l'interdiction des publicités de faux experts par IA, noyée dans le même texte, fera les gros titres, pas le seuil de 1 milliard de KRW qui fait entrer presque tous les exportateurs dans la première vague de conformité | 1177 | **non — live seulement** |

### C. Brésil — 3 articles, 2 431 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-06 | `brazil-anvisa-food-label-qr-code-2026` | Le 20 juillet, le régulateur alimentaire brésilien a ouvert une consultation pour permettre aux étiquettes de déporter certaines informations vers un QR code : le même texte redéfinit quels ingrédients imposent un pourcentage imprimé sur l'emballage | 1311 | **non — live seulement** |
| 2026-07-06 | `brazil-footwear-gtin-labeling-2026` | Le Brésil exige un GTIN sur chaque paire de chaussures dès le 31 juillet, mais les stocks non conformes peuvent rester en rayon jusqu’en 2027 | 926 | oui |
| 2026-02-26 | `brazil-lgpd-vs-gdpr-differences` | LGPD brésilienne vs RGPD : différences clés pour les équipes conformité | 194 | oui |

### C. Canada — 3 articles, 3 770 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-21 | `canada-corded-blinds-safety-gap-2026` | Le 19 août, Santé Canada a rappelé un store enrouleur fabriqué sur mesure pour non-respect d'une règle sur les cordons vieille de cinq ans : lors du dernier contrôle de conformité du régulateur, 43 habillages de fenêtre sur 44 ont échoué au test, et la plupart des échecs concernaient des produits jamais importés | 1265 | **non — live seulement** |
| 2026-08-02 | `canada-epoxy-resin-labelling-2026` | Le 31 juillet, Santé Canada a averti les consommateurs à propos d'un kit de résine époxy au lieu de le rappeler : le vendeur a cessé de répondre, et une ordonnance de rappel suppose qu'il reste quelqu'un à qui la signifier | 1420 | **non — live seulement** |
| 2026-07-12 | `canada-flame-retardant-import-ban-2026` | L'interdiction canadienne d'importation des retardateurs de flamme est entrée en vigueur le 30 juin : la fenêtre unique pour continuer à expédier se referme le 30 juillet | 1085 | oui |

### C. Chine — 2 articles, 2 254 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-14 | `china-cosmetics-safety-standard-2026` | Le 6 août, la Chine a publié sa première norme de sécurité cosmétique obligatoire depuis près de quarante ans : elle place le seuil de sa limite microbienne la plus stricte à 12 ans, et non à 3 ans, l'âge sur lequel s'appuient la plupart des systèmes de conformité internationaux | 1261 | **non — live seulement** |
| 2026-07-08 | `china-recycled-fiber-labeling-2026` | La Chine interdit la fibre recyclée dans les vêtements bébé et les sous-vêtements dès le 1ᵉʳ juillet : sauf pour un matériau, dans un usage précis | 993 | oui |

### C. Inde — 2 articles, 2 279 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-13 | `india-furniture-qco-msme-deadline-2026` | Le 13 août, l'exemption qui permettait aux petits fabricants et importateurs de meubles indiens de se passer de la certification BIS prend fin : la modification couverte par la presse spécialisée en février a ajouté des exceptions étroites d'importation et de stock, mais n'a jamais touché cette date | 1356 | **non — live seulement** |
| 2026-07-03 | `india-qco-transition-facilitation-2026` | L’Inde ouvre une passerelle d’approvisionnement de 5 ans pour chaussures, jouets et électroménager, mais les fabricants étrangers doivent avoir une entité indienne pour en profiter | 923 | oui |

### C. Australie — 2 articles, 2 647 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-08 | `australia-button-battery-supply-testing-2026` | Le 21 juillet, l'ACCC a poursuivi Dusk devant la Cour fédérale pour 66 453 produits domestiques à pile bouton vendus en violation d'un engagement de 2023 : la plupart des produits vendus sans test, selon elle, ont ensuite réussi le test qu'ils avaient sauté | 1594 | **non — live seulement** |
| 2026-07-10 | `australia-aquatic-toys-dynamic-referencing-2026` | La nouvelle norme de sécurité australienne sur les jouets aquatiques est entrée en vigueur le 26 juin, et intègre une règle permettant à une future révision ISO de déplacer à nouveau l’échéance de conformité, sans nouvelle loi australienne | 1053 | oui |

### C. Taïwan — 2 articles, 2 605 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-03 | `taiwan-food-safety-batch-inspection-2026` | Le 23 juillet, le Conseil des ministres taïwanais a approuvé un signalement sous 24 heures après un scandale d'huile de cuisine ayant touché 1 322 entreprises : la vraie réforme du même texte impose de tester chaque lot, et non plus tous les six mois | 1403 | **non — live seulement** |
| 2026-07-16 | `taiwan-cosmetics-pif-gmp-2026` | Taïwan a achevé le 1er juillet un déploiement cosmétique de trois ans : un produit sans dossier de conformité complet ne peut plus légalement être vendu, à une exemption étroite près | 1202 | oui |

### C. France — 2 articles, 2 242 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-07-31 | `france-professional-packaging-epr-2026` | La France a reporté sa nouvelle redevance sur les emballages professionnels au 1er janvier 2027 le 28 juillet : la raison avancée par le gouvernement n'était pas le règlement lui-même, mais le fait que personne ne pouvait dire quelles entreprises y étaient réellement assujetties | 1328 | **non — live seulement** |
| 2026-06-04 | `shein-22m-dgccrf-fine-traceability-2026` | La France inflige 22 M€ d’amende à Shein : ce que la DGCCRF a réellement sanctionné, et pourquoi la traçabilité n’est plus négociable pour aucune marque | 914 | oui |

### C. Japon — 2 articles, 2 168 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-23 | `japan-ffc-gmp-mandate-2026` | Le 1er septembre, la fabrication sous BPF devient obligatoire pour les aliments fonctionnels japonais en comprimés et gélules, et chaque étiquette déjà en rayon doit porter un nouvel avertissement sur les interactions médicamenteuses : la réforme fait suite à un scandale dont la propre ligne d'assistance du fabricant a enregistré 416 signalements de décès, dont aucun n'a été confirmé | 1304 | **non — live seulement** |
| 2026-07-07 | `japan-child-psc-mark-2026` | Le Japon exige la marque PSC enfant sur poussettes et barrières de lit dès le 8 juillet, mais accorde à l’un des deux produits un an de plus pour se mettre en conformité | 864 | oui |

### C. Hong Kong — 1 articles, 1 236 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-15 | `hong-kong-toys-safety-standard-refresh-2026` | Le 1er août, la révision annuelle des normes de sécurité pour les jouets et produits pour enfants de Hong Kong est entrée en application : la liste de cette année ne compte que quatre catégories de produits, et deux d'entre elles seulement figuraient sur la liste de l'an dernier | 1236 | **non — live seulement** |

### C. Malaisie — 1 articles, 1 241 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-12 | `malaysia-ceramic-cookware-lead-cadmium-2026` | Le 1er août, la Malaisie a fait entrer pour la première fois les ustensiles de cuisson en céramique dans sa règle de migration du plomb et du cadmium : la définition qui décide si une théière a besoin d'un nouveau test dépend de la façon dont elle est chauffée, pas du rayon où elle est vendue | 1241 | **non — live seulement** |

### C. Allemagne — 1 articles, 1 468 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-10 | `germany-verpackdg-packaging-law-2026` | La loi allemande qui met en œuvre le règlement européen sur les emballages entre en vigueur le 12 août, le jour même où s'applique la règle de l'UE qu'elle exécute : dix semaines plus tôt, une objection de l'UE à cette même loi avait fixé une échéance qui aurait manqué la date de cinq jours | 1468 | **non — live seulement** |

### C. Suède — 1 articles, 1 333 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-01 | `sweden-pfas-cookware-ban-2026` | La Suède a ouvert le 23 juillet une consultation sur une interdiction des PFAS qui couvre les ustensiles de cuisine : la loi française sur les PFAS, en vigueur depuis janvier, exemptait justement cette catégorie après le lobbying du fabricant de Tefal | 1333 | **non — live seulement** |

### C. Suisse — 1 articles, 1 435 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-07-30 | `switzerland-food-contact-materials-2026` | Les nouvelles règles suisses sur les matériaux au contact des aliments s'appliquent dès le 1er août : l'échéance européenne qu'elles suivent est déjà passée le 20 juillet, car la Suisse n'hérite jamais automatiquement des règles de l'UE | 1435 | **non — live seulement** |

### C. Nigeria — 1 articles, 1 287 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-07-20 | `nigeria-digital-standards-platform-procurement-2026` | La plateforme numérique des normes du Nigeria est entrée en service le 17 juillet : la « norme applicable » d'un produit devient un contrôle de données obligatoire avant même l'ouverture d'un appel d'offres fédéral, qui s'ajoute au filtre d'approvisionnement local « Nigeria First » déjà appliqué à la même livraison | 1287 | oui |

### C. Afrique du Sud — 1 articles, 1 323 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-07-19 | `south-africa-meat-analogue-labeling-2026` | Les règles sud-africaines sur l'étiquetage des analogues de viande sont entrées en vigueur le 18 juillet : un produit doit contenir 9 % de protéines pour pouvoir légalement se dire « alternative à la viande », et deux régulateurs différents l'appliquent selon qu'il a franchi une frontière | 1323 | oui |

### C. Indonésie — 1 articles, 1 363 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-07-18 | `indonesia-halal-cosmetics-certification-2026` | L'échéance de certification halal pour les cosmétiques en Indonésie tombe le 17 octobre 2026, mais les règles définissant une chaîne d'approvisionnement en ingrédients conforme sont encore en consultation publique jusqu'au 2 août | 1363 | oui |

### C. Thaïlande — 1 articles, 1 149 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-07-17 | `thailand-prepackaged-food-labeling-2026` | Le délai de grâce de deux ans pour les anciennes étiquettes alimentaires en Thaïlande se termine le 19 juillet : un stock encore en rayon devient illégal ce jour-là, quelle que soit sa date de fabrication | 1149 | oui |

### C. Singapour — 1 articles, 1 162 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-07-14 | `singapore-energy-label-personal-imports-2026` | Singapour a fermé le 1er juillet la faille de l'importation personnelle pour l'électroménager : le même climatiseur exige désormais les mêmes données énergétiques, quelle que soit la porte par laquelle il entre | 1162 | oui |

### C. Vietnam — 1 articles, 1 182 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-07-11 | `vietnam-risk-tier-classification-2026` | Le Vietnam a définitivement retiré son ancienne classification des produits à deux niveaux le 1er juillet : le jour même où une nouvelle loi sans rapport a ajouté un second régime de conformité | 1182 | oui |

### C. Arabie saoudite — 1 articles, 1 209 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-20 | `saudi-cosmetic-syringe-packaging-ban-2026` | Le 12 août, l'Arabie saoudite a interdit purement et simplement les cosmétiques en forme de seringue : le même sérum à l'allure injectable, conditionné en ampoule ou en flacon, reste autorisé si son étiquette précise désormais, en arabe et en anglais, de ne pas l'injecter | 1209 | **non — live seulement** |

### C. Émirats — 1 articles, 1 353 mots EN

| date | slug | titre FR | mots EN | dépôt local |
|---|---|---|---|---|
| 2026-08-24 | `uae-commercial-fraud-24-hour-recall-2026` | Depuis le 13 août, un avis de rappel aux Émirats arabes unis déclenche un délai que le fournisseur ne maîtrise pas : 24 heures pour retirer les produits, 48 heures pour publier l'avis en arabe et en anglais, sinon le ministère s'en charge aux frais du fournisseur | 1353 | **non — live seulement** |
