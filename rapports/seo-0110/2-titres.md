# SEO 01/10 · lot 2 : titres courts des articles de blog

Branche `fix/seo-0110-2-titres`. Rien poussé, rien déployé.

## Le problème, mesuré

Le `<title>` d'un article reprenait le titre éditorial entier. Google coupe vers 60 caractères.

Commande de mesure (relit les `<title>` de `sortie/`, entités décodées) :

```
node construire.mjs && node rapports/seo-0110/mesure-titres.mjs --liste
```

| Pages de `sortie/` | Nombre | Avant : médiane | Avant : max | Avant : > 60 | Après : médiane | Après : max | Après : > 60 |
|---|---|---|---|---|---|---|---|
| Blog FR | 142 | 228 | 398 | 139 | 57 | 60 | 0 |
| Blog EN | 142 | 191 | 314 | 137 | 57 | 60 | 0 |
| Hors blog | 71 | 48 | 75 | 8 | 48 | 75 | 8 |
| Total | 355 | 138 | 398 | 284 | 56 | 75 | 8 |

Avant : 276 pages d'article sur 284 au-dessus de 60 (205 pages du site au-dessus de 100, 138 au-dessus de 200).
Après : 0 page d'article au-dessus de 60. Chiffres relevés sur le build du 01/10/2026, 355 pages, confiance : mesuré.

## Ce qui existait déjà

- `blog-posts.json` (142 articles) n'a aucun champ court : ni `seoTitle` ni `shortTitle`. `tweet` (92 articles) et `keywords` ne sont pas des titres.
- `cleo-landing/docs/gsc-ctr-fix-2026-07-29.md` proposait un `seoTitle` FR et EN pour 11 articles (sa 12e page, `/en/pricing`, n'est pas un article), jamais intégrés. Décisions reprises :
  - ses titres, mot pour mot, pour 10 des 11 articles ;
  - le suffixe « | Cleo Labs » seulement quand le tout tient en 60 ;
  - `og:title` et `twitter:title` gardent le titre long (LinkedIn et X ont la place).
- Un écart avec ce document : `regulatory-compliance-france-guide` y portait « 2026 Guide » / « guide 2026 ». « 2026 » n'est ni dans le titre long ni dans la description : remplacé par « Complete Guide » / « le guide ».

## Ce qui change

- `blog/titres-courts.json` : slug → `{ fr, en }`, 142 articles, 284 titres. Pour un nouvel article, ajouter une ligne ici.
- `blog/fragments.mjs` : le `titre` SEO de chaque article vient de ce fichier ; `og_titre` porte le titre long (champ déjà lu par `construire.mjs`, qui n'est pas modifié).
- Suffixe « | Cleo Labs » ajouté quand le titre fait 48 caractères au plus et ne contient pas déjà « Cleo Labs » : 273 pages sur 284 l'ont. Les 11 autres : 8 titres de 49 à 56 caractères (6 viennent du document du 29/07, plus « Legal Atlas » FR et la levée de fonds FR), 3 titres qui commencent par « Cleo Labs ».
- Inchangés, vérifiés par le test sur les 284 pages : le h1 visible, le `headline` du JSON-LD, le corps de l'article.
- `blog/seo-blog.json` régénéré : seules les lignes `titre` et `og_titre` bougent.

Règles tenues pour les 284 titres, contrôlées par script à l'écriture : 60 caractères au plus, aucun doublon dans une langue, pas de tiret cadratin, pas de « risk » ni « risque », chaque nombre du titre court présent dans le titre long ou la description de la même langue.

## Repli pour l'article du matin

Un article absent de `blog/titres-courts.json` (ou un fichier illisible) ne casse rien : le titre long est coupé à la limite d'un mot, ponctuation finale retirée, suffixe ajouté. Exemple : « On 9 October, New Zealand lists three chemicals | Cleo Labs » (59). `fragments.mjs` écrit alors « N titre(s) en repli, à compléter dans blog/titres-courts.json ».

Essai fait le 01/10 avec un fichier vide puis un fichier cassé : build à 0, 284 pages en repli, toutes à 60 ou moins, aucune en double, test vert.

## Test

`tests/titres-courts.mjs` relit le HTML de `sortie/` : `<title>` à 60 au plus, unique par langue, h1 et `headline` égaux au titre long de `blog/brut.json`, titre de la page égal à celui du fichier quand il y en a un. Témoin négatif : 6 altérations (titre rallongé, h1 raccourci, headline raccourci, titre vidé, deux pages au même titre, « risque » dans un titre court), chacune doit être détectée. Ajouté à la boucle `for t in` de `scripts/relais-ci.sh` et de `scripts/relais-blog.sh`.

Résultat du 01/10 : `node construire.mjs` 355 pages, tous les contrôles passent ; les 9 tests de la boucle de `relais-ci.sh` verts.

## Dix exemples par langue (colonne « car. » du titre long = avec « | Cleo Labs », comme il sortait)

### Français

| Titre long (h1, inchangé) | car. | `<title>` produit | car. |
|---|---|---|---|
| Le 28 août, le régulateur britannique de la sécurité des produits a publié son nouveau rapport annuel : les cosmétiques ont dépassé l'électroménager comme catégorie la plus signalée, et 45 % des notifications de produits dangereux de l'année ne portent aucune évaluation de risque | 292 | Sécurité des produits UK : le rapport annuel \| Cleo Labs | 56 |
| Le 9 octobre, la Nouvelle-Zélande inscrit trois substances chimiques comme interdites : pour deux d'entre elles, l'interdiction réelle d'importation et de fabrication ne démarre qu'en décembre, et l'une des trois bénéficie d'une dérogation pour le PVC recyclé utilisé dans les surfaces sportives | 307 | Nouvelle-Zélande : trois substances interdites \| Cleo Labs | 58 |
| Depuis le 27 septembre, le droit européen impose à tout vendeur de biens physiques d'afficher un avis de garantie au format imposé : une promesse de durabilité au-delà de deux ans déclenche désormais aussi une seconde étiquette obligatoire | 251 | Étiquette de garantie UE : dès le 27 septembre \| Cleo Labs | 58 |
| Le 4 août, la CPSC a infligé à Johnson Health Tech une amende de 16,875 millions de dollars, proche de son propre plafond légal, pour des années d'incidents non signalés sur des tapis de course : l'entreprise a corrigé le défaut à deux reprises avant même de le signaler une seule fois | 297 | CPSC : 16,875 M$ d'amende à Johnson Health Tech \| Cleo Labs | 59 |
| La liste des allergènes cosmétiques de l'UE passe de 26 à 82 substances le 31 juillet, et la Commission a corrigé trois entrées huit mois après que la plupart des marques avaient déjà figé leur cartographie | 218 | Allergènes cosmétiques UE : de 26 à 82 \| Cleo Labs | 50 |
| Le 25 août, la Belgique a confirmé 306 cas de salmonellose liés à une seule ferme avicole, sa plus vaste épidémie jamais enregistrée : le code producteur européen obligatoire a permis aux autorités de rappeler tous les lots connus en quelques jours, mais un second poulailler du même site a continué à expédier des œufs pendant trois mois de plus avant d'être testé | 377 | Belgique : 306 cas de salmonellose liés aux œufs \| Cleo Labs | 60 |
| À partir du 10 octobre 2026, le droit européen plafonne le PFHxA à 25 parties par milliard dans les vêtements, chaussures et accessoires : la même famille de PFAS à chaîne courte que les fournisseurs avaient adoptée pour remplacer les composés à chaîne longue restreints par Bruxelles une décennie plus tôt | 318 | PFHxA textile dans l'UE : dès le 10 octobre 2026 \| Cleo Labs | 60 |
| Temu condamnée à 200 M€ au titre du DSA : ce que la Commission a réellement dit, et pourquoi cela compte pour toutes les marques européennes | 152 | Amende DSA de 200 M€ pour Temu : la décision \| Cleo Labs | 56 |
| La loi allemande qui met en œuvre le règlement européen sur les emballages entre en vigueur le 12 août, le jour même où s'applique la règle de l'UE qu'elle exécute : dix semaines plus tôt, une objection de l'UE à cette même loi avait fixé une échéance qui aurait manqué la date de cinq jours | 303 | VerpackDG : la loi emballages allemande, 12 août \| Cleo Labs | 60 |
| Le 3 septembre, le Conseil de l'UE a donné son feu vert à sa réforme douanière : une seconde redevance, dont le montant n'est toujours pas fixé, s'appliquera à chaque colis de faible valeur dès le 1er novembre, en plus des 3 € de droit déjà en vigueur depuis juillet | 278 | Réforme douanière UE : seconde redevance colis \| Cleo Labs | 58 |

### English

| Titre long (h1, inchangé) | car. | `<title>` produit | car. |
|---|---|---|---|
| On 28 August, the UK's product safety regulator published its newest annual report: cosmetics overtook electricals as the most flagged category, and 45% of the year's unsafe product notifications carry no risk rating at all | 235 | UK Product Safety Report: Cosmetics Most Flagged \| Cleo Labs | 60 |
| On 9 October, New Zealand lists three chemicals as banned: for two of them the real import and manufacture ban doesn't start until December, and one comes with a carve-out for recycled PVC in sports surfaces | 219 | New Zealand Chemicals Ban: 9 October Listing \| Cleo Labs | 56 |
| From 27 September, EU law forces every seller of physical goods to display a fixed-format guarantee notice: a durability promise beyond two years now triggers a second, mandatory label too | 200 | EU Guarantee Label: Mandatory from 27 September \| Cleo Labs | 59 |
| On 4 August, CPSC fined Johnson Health Tech $16.875 million, near its own legal ceiling, for years of unreported treadmill incidents: the company redesigned the defect away twice before it ever reported it once | 222 | CPSC Fines Johnson Health Tech $16.875 Million \| Cleo Labs | 58 |
| The EU's cosmetics allergen list grows from 26 to 82 substances on 31 July, and the Commission corrected three entries eight months after most brands had already locked their mapping | 194 | EU Fragrance Allergens: 26 to 82 on 31 July \| Cleo Labs | 55 |
| On 25 August, Belgium confirmed 306 salmonella cases from one egg farm, its largest outbreak on record: the mandatory EU producer code let regulators recall every known batch within days, but a second henhouse on the same site kept shipping for three more months before anyone tested it | 298 | Belgium Egg Salmonella Recall: 306 Cases \| Cleo Labs | 52 |
| From 10 October 2026, EU law caps PFHxA at 25 parts per billion in clothing, footwear and accessories: the same short-chain PFAS that suppliers adopted to replace the long-chain chemicals Brussels restricted a decade earlier | 236 | PFHxA Limit in EU Textiles from 10 October 2026 \| Cleo Labs | 59 |
| Temu fined €200M under the DSA: what the Commission actually said, and why it matters for every European brand | 122 | Temu's €200M DSA Fine: What the Commission Said \| Cleo Labs | 59 |
| Germany's law implementing the EU's packaging regulation takes effect on 12 August, the same day as the EU rule it carries out: ten weeks earlier, an EU objection to that same law had set a deadline that would have missed the date by five days | 255 | Germany VerpackDG Packaging Law: 12 August \| Cleo Labs | 54 |
| On 3 September, the EU Council signed off on its customs overhaul: a second, still-unpriced fee lands on every low-value parcel from 1 November, stacked on top of the €3 duty already in force since July | 214 | EU Customs Reform: Second Parcel Fee, 1 November \| Cleo Labs | 60 |

## Pages hors blog au-dessus de 60 : listées, non modifiées

| car. | Page | `<title>` |
|---|---|---|
| 75 | 43-accueil-avant-vendre.html (accueil FR) | Conformité Produit Automatisée pour les Marques Internationales \| Cleo Labs |
| 65 | 14-terme-en.html | Authorised representative, definition and obligations \| Cleo Labs |
| 63 | 09-texte.html | PPWR, conformité des emballages article par article \| Cleo Labs |
| 63 | 52-data-mcp.html | Serveur MCP : la donnée réglementaire dans votre IA \| Cleo Labs |
| 62 | 02-entreprise.html | À Propos de Cleo Labs : Soutenue par Kima Ventures \| Cleo Labs |
| 62 | 25-skills-en.html | Skills: ready-made product compliance capabilities \| Cleo Labs |
| 61 | 06-cas-client-en.html | Decathlon customer story, multi-market compliance \| Cleo Labs |
| 61 | 23-research.html | Recherche : MARIA et l'intelligence réglementaire \| Cleo Labs |

L'accueil FR est gardé par `tests/seo-accueil.mjs` : pas touché. Les 7 autres dépassent de 1 à 5 caractères ; les raccourcir demande un choix de mots (retirer « Soutenue par Kima Ventures » ? « article par article » ?), donc pas « sans ambiguïté ». L'accueil EN est à 58.

## À savoir

- Relancer `node blog/fragments.mjs` sur le Mac modifie aussi 51 fragments de `pages/blog/` et `blog/articles.json` (commentaires `<!-- -->` retirés, compte de mots). Cet écart existe déjà avec le `fragments.mjs` d'avant ce lot. Il n'est pas commité ici : seuls `titre` et `og_titre` de `seo-blog.json` le sont.
- Modifier `blog/titres-courts.json` sans relancer `node blog/fragments.mjs` fait échouer le test, avec ce message.

284/284 `<title>` d'article relus dans `sortie/` le 01/10/2026 ; 8/8 pages hors blog listées depuis la même mesure.
