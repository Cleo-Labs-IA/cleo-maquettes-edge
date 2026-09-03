# Ce que le port des maquettes coûterait en citabilité

Mesure du 27/08/2026. Comparaison **A** = `https://www.cleolabs.co/fr` et `/en`
(HTML servi, capté au curl avec UA navigateur, plus le DOM hydraté au Playwright)
contre **B** = `sortie/01-accueil.html` et `01-accueil-en.html`.
Aucun fichier des deux dépôts n'a été modifié. Scripts :
`/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-seo/`.

**Lentille : la citabilité par les moteurs génératifs.** Ce qui suit compte des
signaux présents ou absents. Aucun chiffre de trafic, de position ou de volume de
recherche n'apparaît ici : nous n'avons ni Search Console ni outil de mots-clés
dans ce contexte, et une mesure de signal ne se convertit pas en mesure de
performance.

---

## 0. Le périmètre, d'abord, parce qu'il change la moitié des verdicts

Trois familles de signaux vivent à des endroits différents du dépôt `cleo-landing` :

| Famille | Où elle vit | Un port du corps de l'accueil la touche ? |
|---|---|---|
| `<title>`, meta description, OG/Twitter, canonical, hreflang | `src/app/[locale]/layout.tsx`, `generateMetadata` | **Non** |
| JSON-LD `Organization` + `WebSite` + `VideoObject` (dont `sameAs` → Wikidata) | `src/app/[locale]/layout.tsx:73-300` | **Non** |
| JSON-LD `FAQPage` + `HowTo` | `src/app/[locale]/page.tsx:18-60`, alimentés par `translations.faq.items` et `translations.howItWorks.steps` | **Oui, indirectement** |
| `robots.txt` (GPTBot, ClaudeBot, PerplexityBot… tous en `allow`) et `llms.txt` / `llms-full.txt` | `src/app/robots.ts`, `public/llms*.txt` | **Non** |

Autrement dit : la maquette n'a **0 bloc JSON-LD**, **pas de meta description**,
**pas de canonical**, **pas de hreflang**, et un `<title>` qui dit `Cleo — Accueil`.
Ce n'est **pas** une perte, c'est l'absence normale d'un châssis dans un fichier de
design statique — le châssis Next.js les fournit. Aucune des 26 maquettes de
`sortie/` ne contient de JSON-LD ; c'est cohérent avec leur nature.

Le vrai sujet est ailleurs : **le `FAQPage` est calculé à partir du contenu FAQ.**
Si la section FAQ sort de la page, la source de ce JSON-LD sort avec elle.

---

## 1. Le tableau

Chiffres FR. Les écarts EN sont signalés quand ils diffèrent.

| Signal | En ligne (`/fr`) | Maquette (`01-accueil.html`) | Verdict |
|---|---|---|---|
| Blocs JSON-LD | 5 (Organization, WebSite, VideoObject, FAQPage, HowTo) · 14 669 octets | 0 | châssis — **conservé** si le port est un port de corps |
| `sameAs` (LinkedIn, X, YouTube, Crunchbase, Product Hunt, **Wikidata Q138466568**) | 6 | — | châssis — **conservé** |
| `Organization.knowsAbout` | 14 entrées | — | châssis — **conservé** |
| Logo déclaré (`ImageObject`, 180×180) | 1 | — | châssis — **conservé** |
| Fondatrices en `Person` avec `jobTitle`, `alumniOf`, `url` LinkedIn | 2 | — | châssis — **conservé** |
| `FAQPage` : questions/réponses | 17 Q · 143 mots de questions · **957 mots de réponses** | 0 | **perdu** |
| Questions posées en clair dans le corps rendu | 17 | 0 (4 tournures interrogatives, aucune suivie d'une réponse, 3 dans le méga-menu) | **perdu** |
| `<details>` | 0 | 0 | conservé (aucun des deux) |
| **Autorités nommées avec leur pays** | **12** : FDA/US, EU, IFRA, COFEPRIS/Mexique, BSI/UK, NIST/US, ECHA/UE, PMDA/Japon, MFDS/Corée, TGA/Australie, CFDA/Chine, ANSM/France | **1** (AICIS, dans une liste de liens du pied) | **perdu** |
| Citations de presse avec lien sortant daté | 6 (Tech.eu, EU-Startups, Vestbee, FinTech Global, RegTech Analyst, The Legal Wire) | 0 | **perdu** |
| Liens sortants hors cleolabs.co | 10 uniques | **0** | **perdu** |
| Prix / distinction | « Lauréate : The Pitch by Deel (Station F), parmi 35 000+ candidatures » | 0 | **perdu** |
| Levée de fonds citée | 1,5 M€, 4 occurrences dans le corps rendu (6 dans le HTML servi) | 0 | **perdu** |
| Compteur « 25 000+ réglementations actives » | présent | **absent** | **perdu** |
| Compteur « 106 pays » | 2 fois, dont un bloc de couverture + un tableau comparatif | 2 fois (méga-menu Marchés, pied) | conservé, déplacé hors du corps |
| Compteur « 19 000+ autorités indexées » | 2 fois (bloc couverture + vignette produit) | 1 fois (pied) | conservé, déplacé hors du corps |
| Compteur « 2 812 règles encodées » | **absent** | 2 fois (méga-menu Produit, bloc de chiffres Decathlon) | **nouveau** |
| **Références de texte précises** (numéro d'acte, article, annexe) | **2** : `1223/2009`, `Article 28` | **12** : `(CE) 1907/2006`, `(CE) 1272/2008`, `(UE) 2023/988`, `(UE) 2016/425`, `(UE) 2025/40`, `(UE) 2023/1542`, `(UE) 2024/1689`, `(UE) 2024/2462`, `1007/2011`, `annexe XVII`, `Art. 6 §4`, `section 101 (a)` | **nouveau** |
| **Extraits de texte de loi cités mot pour mot, avec leur article** | 0 | **2** (« La teneur en plomb ne dépasse pas 100 ppm… » → CPSIA §101(a) ; « L'opérateur se conforme aux critères de conception en vue du recyclage. » → Art. 6 §4 du (UE) 2025/40) | **nouveau** |
| Réglementations nommées, distinctes | 13 | 15 (16 en EN) | **nouveau** (+2) |
| Citation Philippine Tamic | présente, **`<figure>` + `<blockquote>` + `<figcaption>`** + portrait `alt="Philippine Tamic"` | présente, **`<blockquote class="citation">`** puis deux `<div>` frères pour le nom et le rôle | texte conservé, **balisage affaibli** |
| Balisage schema.org autour de la citation (`Review`, `Quotation`, `Person`) | 0 | 0 | conservé (absent des deux) |
| Clients nommés (logos + `alt`) | 6 : Decathlon, Balzac Paris, L'Occitane, Mercedes-Benz, **SNCF Réseau**, **Electrolux Professional** | 4 : Decathlon, Balzac Paris, L'Occitane, Mercedes-Benz | **perdu** (−2) |
| Personnes nommées avec un rôle | 3 : Philippine Tamic (Decathlon), Anaëlle Guez (co-fondatrice), Naomie Halioua (`alt`) | 3 : Philippine Tamic, **Darcial Mondjo** (expert réglementaire), **Thezi Mabuza** (experte réglementaire) | échange : 2 perdues, 2 nouvelles |
| Titres réels dans le corps (h1→h3) | 22 (1 h1, 8 h2, 13 h3) | 12 (1 h1, 5 h2, 6 h3) — plus 8 `h4` qui sont des intitulés de colonnes de pied | **perdu** (−10 dans le corps) |
| Noms portés par un `<div class="t-h3">` au lieu d'un titre | 0 | 3 (Tamic, Mondjo, Mabuza) | **perdu** |
| `<table>` | 1 (247 SKU / 32 marchés / 94 % par catégorie) | 0 | **perdu** |
| Tableau comparatif structuré « avant / avec Cleo » (Outil, Délai 6 mois → 24 h, Couverture ~3 marchés → 106 pays, Mise à jour) | présent | absent | **perdu** |
| Images sans texte alternatif (`alt=""`) | 2 sur 16 | **8 sur 17** | **perdu** |
| Destinations internes distinctes | 25 | 16 | **perdu** (−9) |
| Mots de texte visible, HTML servi | 1 147 | 1 051 | quasi égal (−8 %) |
| **Mots indexables réels** (visible + réponses FAQ portées par le JSON-LD) | **2 247** | **1 051** | **−53 %** |
| Dates absolues, `<time>`, dates d'entrée en vigueur | 0 | 0 | conservé (absent des deux) |

---

## 2. Un fait mesuré qui change la lecture de tout le reste

**Sur la page en ligne, les 17 réponses de la FAQ n'existent nulle part ailleurs
que dans le JSON-LD.** Vérifié dans les deux sens :

- dans le HTML servi, `Cleo suit plus de 25 000` est présent **dans** un
  `<script type="application/ld+json">` et **absent** partout ailleurs ;
- dans le DOM après hydratation (Playwright, réseau au repos, page déroulée de
  bout en bout, 2,5 s d'attente), `document.body.innerText` fait 7 557 caractères
  et **ne contient toujours pas** cette phrase. Les 18 `[aria-expanded]` de
  l'accordéon ne montent leur contenu qu'au clic.

Conséquence : les 957 mots de réponses ne sont lisibles que par un moteur qui
**parse le JSON-LD**. Google le fait. Un crawler génératif qui se contente du
texte rendu ne les voit pas plus qu'il ne les verrait sur la maquette. C'est un
fait qui **réduit** l'ampleur de la perte pour une partie des moteurs, et qui
signale au passage une fragilité déjà présente en ligne aujourd'hui.

---

## 3. Ce qui serait perdu, du plus coûteux au moins coûteux

**1. Le bloc des 12 autorités nommées avec leur pays.**
FDA/États-Unis, ECHA/Union européenne, COFEPRIS/Mexique, BSI/Royaume-Uni,
NIST/États-Unis, PMDA/Japon, MFDS/Corée du Sud, TGA/Australie, CFDA/Chine,
ANSM/France, IFRA, EU. La maquette en garde **une** (AICIS, dans une liste de
liens du pied). C'est le passage le plus directement citable de la page en ligne :
douze entités officielles reconnaissables, chacune reliée à une juridiction, sous
un titre qui dit exactement ce qu'elles font là (« Chaque autorité. Chaque source.
Suivie. »). C'est la matière qu'un moteur reprend pour répondre à « quelles
autorités cet outil suit-il ». **Coût : 11 entités nommées sur 12.**

**2. Les 17 questions-réponses.**
17 questions, 957 mots de réponses. Les questions disparaissent du texte rendu
(17 → 0) et, si la section FAQ n'est pas reprise, `getFaqJsonLd()` n'a plus de
raison d'être appelé dans `page.tsx` : le `FAQPage` de 8 777 octets part avec.
Quatre de ces questions sont des requêtes génériques que quelqu'un tape vraiment
(« Quelles réglementations mon entreprise doit-elle respecter ? », « Qu'est-ce que
MARIA ? », « Qui sont les investisseurs de Cleo Labs ? », « Comment Cleo Labs
aide-t-elle les retailers en matière de conformité ? »). La maquette ne propose
aucune forme de remplacement : 0 `<details>`, 0 question suivie d'une réponse.
**Coût : le format que les moteurs reprennent le mieux, à zéro.**

**3. La preuve tierce : presse, prix, levée.**
Six titres de presse cités avec leur lien sortant daté (tech.eu, eu-startups.com,
vestbee.com, fintech.global, regtechanalyst.com, thelegalwire.ai), un prix
(« The Pitch by Deel, Station F, parmi 35 000+ candidatures ») et la levée de
1,5 M€ (4 occurrences dans le corps rendu). La maquette n'a **aucun lien sortant**, aucune mention de presse, aucun
prix. Pour un moteur, ce sont les seuls éléments de la page qui ne dépendent pas
de la parole de Cleo sur Cleo — donc ceux qui autorisent une citation prudente.
**Coût : 10 liens sortants, 6 sources tierces, 1 prix, 1 montant de levée.**

**4. Le compteur « 25 000+ réglementations actives ».**
Il est le seul des chiffres de couverture à disparaître complètement : ni corps,
ni menu, ni pied de la maquette. Il figure aussi dans la meta description en ligne
(« 106 pays, 25 000+ réglementations, 3 700+ sources »), qui elle survit au port
puisqu'elle vient du châssis — la page raconterait alors dans sa description un
chiffre qu'elle ne porte plus nulle part.

**5. Dix titres de section dans le corps.**
22 titres `h1`–`h3` en ligne contre 12 dans la maquette. Trois noms de personnes
qui étaient dans l'ossature deviennent des `<div class="t-h3">` : Philippine Tamic,
Darcial Mondjo, Thezi Mabuza. Un moteur qui extrait le plan de la page voit
moins de points d'ancrage, et les trois personnes n'y figurent plus du tout.

**6. Deux clients nommés : SNCF Réseau et Electrolux Professional.**
Le mur de logos passe de 6 à 4. Ce sont deux entités identifiables de moins que
la page associe à Cleo.

**7. Le tableau comparatif et le `<table>`.**
Le comparatif « ancienne façon / façon Cleo » (Délai 6 mois → 24 h, Couverture
~3 marchés → 106 pays) et le tableau de catégories (Beauté 182 / 94 %,
Électronique 48 / 76 %, Textile 17 / 100 %) disparaissent. Les comparatifs chiffrés
sont une forme que les moteurs reprennent volontiers ; le second est en revanche
un exemple fictif (le mot « Exemple » est affiché à côté), donc sa perte est peu
coûteuse et discutablement souhaitable.

**8. Neuf destinations internes.**
25 destinations distinctes en ligne, 16 dans la maquette. Sortent notamment les
cinq pages `jurisdictions/*` (union-européenne, france, allemagne, royaume-uni,
états-unis), `/research`, `/skills`, `/legal-data/docs` et `/legal-data/playground`.
Ces pages restent au sitemap (`src/app/sitemap.ts`) ; elles perdent seulement leur
lien depuis la page la plus liée du site.

**9. Six images sans texte alternatif.**
2 sur 16 en ligne, 8 sur 17 dans la maquette.

---

## 4. Ce qui serait gagné

**1. Douze références de texte précises contre deux.**
La maquette cite `(CE) 1907/2006` (REACH), `(CE) 1272/2008` (CLP), `(UE) 2023/988`
(RSGP), `(UE) 2016/425` (EPI), `(UE) 2025/40` (PPWR), `(UE) 2023/1542` (batteries),
`(UE) 2024/1689` (AI Act), `(UE) 2024/2462` (PFHxA), `1007/2011` (étiquetage
textile), plus `annexe XVII`, `Art. 6 §4` et `section 101 (a)`. La page en ligne
n'en cite que deux : `1223/2009` et `Article 28`. Un numéro d'acte est
exactement ce qu'un moteur sait rattacher à une entité juridique existante ;
c'est le gain le plus net du port.

**2. Deux extraits de loi cités mot pour mot, avec leur article.**
« La teneur en plomb ne dépasse pas 100 ppm en poids des parties accessibles. »
(CPSIA, section 101 (a)) et « L'opérateur se conforme aux critères de conception
en vue du recyclage. » (Art. 6 §4). La page en ligne ne cite aucun texte de loi
au mot. Un extrait vérifiable et attribué est le contraire d'une affirmation
marketing : c'est le matériau que reprend un moteur qui cherche une source.

**3. Deux réglementations nommées de plus, et un ancrage produit plus fin.**
15 acronymes distincts contre 13 (16 contre 12 en anglais). La maquette ajoute
PPWR, CLP, EN 71, ASTM F963, TB 117, CPSIA, Proposition 65, FTC Green Guides,
Loi 96 (Québec), UKCA, AICIS, normes GB. La page en ligne parle davantage de
conformité d'entreprise (RGPD, DORA, NIS2, LGPD, CCPA) que de conformité produit.
Le champ lexical de la maquette colle mieux à ce que Cleo vend aujourd'hui.

**4. Deux experts réglementaires nommés.**
Darcial Mondjo et Thezi Mabuza, avec leur rôle. Deux personnes identifiables de
plus rattachées à l'entreprise — même si, en l'état, leurs portraits portent
`alt=""` et leurs noms sont dans des `<div>`, pas dans des titres.

**5. Une chaîne explicative que la page en ligne n'a pas.**
La section « Du journal officiel à l'obligation testable » énonce ce qui entre
(journaux officiels, autorités de marché, projets de texte, consultations
publiques) et ce qui sort (obligations testables, verdict par référence,
échéances), et la section « Ce que la machine propose, un humain le valide »
décrit une boucle de relecture experte. Ce sont des affirmations de méthode,
donc reprenables comme description du produit.

**6. 2 812 règles encodées.**
Chiffre absent de la page en ligne, présent deux fois dans la maquette.

---

## 5. L'arbitrage des trois compteurs, exposé, pas tranché

La consigne dit que la maquette a **volontairement retiré ce matin** trois
compteurs (106 pays, 2 812 règles, 19 000 autorités) parce qu'ils se périment.
La mesure dit quelque chose de plus précis, et il faut le regarder avant de
trancher.

**Ce qui est mesuré :**

| Chiffre | En ligne | Dans la maquette |
|---|---|---|
| 106 pays | bloc de couverture (« 106 / pays couverts ») **et** tableau comparatif (« Couverture · 106 pays ») | méga-menu Marchés (« 106 pays couverts »), pied (« 106 pays couverts, 19 000 autorités suivies ») |
| 19 000+ autorités | bloc de couverture (« 19 000+ / autorités indexées ») **et** vignette produit (« 19,000 + authorities indexed ») | pied uniquement |
| 25 000+ réglementations | bloc de couverture | **nulle part** |
| 2 812 règles encodées | **nulle part** | méga-menu Produit **et** bloc de chiffres Decathlon (« 2 812 / règles encodées ») |

Donc : **106 et 19 000 n'ont pas été retirés, ils ont été déplacés du corps vers
le châssis** (méga-menu et pied). Ils restent dans le HTML servi de la maquette,
donc lisibles par un robot — mais dans un bloc de navigation répété sur toutes
les pages, ce qu'un moteur pondère bien moins qu'un chiffre posé sous un titre
qui le contextualise. Et **2 812 n'a pas été retiré : il a été ajouté**, y compris
en bloc de chiffres de cas client. Le seul chiffre qui disparaît vraiment est
**25 000+ réglementations actives**.

**Ce que coûte le retrait, en citabilité.** Un chiffre est cité par un moteur
quand il est *précis*, *attribuable* et *contextualisé*. « 106 » sous le libellé
« pays couverts », dans une section titrée « Chaque autorité. Chaque source.
Suivie. », remplit les trois. Le même « 106 pays couverts » comme intitulé d'un
lien de menu ne remplit que le premier. La différence n'est pas de présence, elle
est de **rang** : le premier est une affirmation de la page, le second est un
libellé de navigation.

**Ce que coûte le maintien, en fraîcheur.** C'est l'autre moitié de l'arbitrage et
elle est réelle : un chiffre faux est pire qu'un chiffre absent, pour un moteur
comme pour un prospect. « 19 000+ autorités » et « 25 000+ réglementations »
sont des compteurs de base de données qui bougent chaque semaine, et rien sur la
page ne dit à quelle date ils ont été relevés. Aujourd'hui, ni la page en ligne
ni la maquette ne portent **une seule date** : 0 balise `<time>`, 0 date complète,
sur les quatre pages mesurées.

**Ce que la mesure permet de dire sans trancher :** l'opposition fraîcheur /
citabilité n'est entière que tant que les chiffres sont **non datés**. Un chiffre
daté (« 19 214 autorités indexées au 27 août 2026 ») est à la fois plus citable
qu'un « 19 000+ » et honnête sur sa péremption : il annonce lui-même qu'il
décrit un instant. C'est le seul terrain où les deux exigences cessent de se
contredire, et aucune des deux versions ne l'occupe.

La décision reste à Naomie.

---

## 6. Ce que je n'ai pas pu mesurer

- **Toute performance.** Trafic, positions, impressions, part de citation dans
  ChatGPT / Perplexity / Google AI Overviews : pas de Search Console, pas d'outil
  de mots-clés, pas de log serveur dans ce contexte. Rien de ce qui précède ne
  dit qu'un signal perdu fait perdre une citation ; il dit qu'un signal existe
  d'un côté et pas de l'autre.
- **Le périmètre réel du port.** Je ne sais pas si les maquettes remplacent le
  corps de l'accueil, la page entière, ou seulement une partie des sections. Tous
  les verdicts « châssis — conservé » du tableau supposent que
  `src/app/[locale]/layout.tsx` n'est pas touché. Si le port emporte aussi le
  châssis, il faut relire ce rapport en comptant comme perdus : les 5 blocs
  JSON-LD, les 6 `sameAs` dont Wikidata, la meta description, le canonical et les
  3 hreflang.
- **Les autres pages.** Seul l'accueil a été mesuré, dans ses deux langues.
  `sortie/` contient 26 maquettes ; **31 autres fichiers** de `src/app` du site en
  ligne émettent leur propre JSON-LD (`platform`, `pricing`, `company`, `security`,
  `research`, `skills`, `blog`, `legal-data`, tout `jurisdictions/*`, tout
  `industries/*`, tout `resources/*`, `customers/[slug]`, `careers/[slug]`…).
  Rien ici ne dit ce qu'elles deviennent.
- **La véracité des chiffres eux-mêmes.** Je n'ai pas vérifié en base que 106,
  19 000, 25 000 ou 2 812 sont exacts aujourd'hui. La mesure porte sur leur
  présence, pas sur leur justesse.
- **La FAQ après clic.** J'ai constaté que les réponses ne sont pas dans le DOM
  au chargement ; je n'ai pas déplié les 17 panneaux un par un pour vérifier que
  le texte monté au clic est bien identique au JSON-LD.
- **Le rendu final du port.** Les maquettes sont en cours de retouche CSS par
  d'autres agents. Je n'ai mesuré que du contenu et de la structure — jamais une
  taille, jamais une couleur — donc ces chiffres ne bougent pas avec le style,
  mais ils décrivent l'état du contenu au 27/08 à 13 h 40 (horodatage des fichiers).
