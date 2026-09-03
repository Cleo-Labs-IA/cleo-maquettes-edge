# r-accueil-en, jumeau anglais de la page d'accueil

Fichier créé, un seul : `/Users/naomiehalioua/cleo-maquettes-edge/pages/01-accueil-en.html`
Source recopiée : `/Users/naomiehalioua/cleo-maquettes-edge/pages/01-accueil.html` (354 lignes)
Résultat : 354 lignes, alignement ligne à ligne avec la source.

Rien d'autre n'a été touché. `sortie/` n'a pas été ouvert en écriture.
Ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs` n'ont été lancés.

Note d'entrée : `01-accueil-en.html` était déjà déclaré dans `construire.mjs`
ligne 20 avec `en: true`. Le fichier manquait, il existe maintenant. Le châssis
anglais (`commun/bandeau-nav-en.html`, `commun/pied-en.html`) est branché par le
générateur sur les marqueurs `<!--NAV-->` et `<!--PIED-->`, tous deux présents.

---

## Changements, ligne par ligne

Le format est « ligne : ancien -> nouveau ». La ligne est la même dans les deux
fichiers, la structure n'ayant pas bougé d'une ligne.

### Hero (dicté)
- 11 : `Vendez partout.` -> `Sell everywhere.`
- 11 : `<span class="attenue">Conformez-vous partout.</span>` -> `<span class="attenue">Comply anywhere.</span>`
- 14 : `L'agent IA produit qui automatise et accélère tout le cycle de la conformité produit.` -> `Product AI agent that automates and accelerates the full product compliance lifecycle.`
- 17 : `Nous contacter` -> `Contact us`
- 18 : `Essai gratuit` -> `Free trial`

### Bande logos
- 30 à 33 : aucun changement. Les `alt` sont des noms de marque.

### Titre de section
- 41 : `Chaque fonction a été automatisée.` -> `Every function has been automated.`
- 41 : `<span class="attenue">La conformité produit, non.</span>` -> `<span class="attenue">Product compliance has not.</span>`
- 43 : `Elle se fait encore à la main, règle par règle, marché par marché, et s'externalise question par question.` -> `It is still done by hand, rule by rule, market by market, and sent outside question by question.`

### Bloc principal
- 54 : `Vue d'ensemble` -> `Overview`
- 55 : `Une dépendance permanente` -> `A standing reliance`
- 55 : `<span class="attenue">aux cabinets, marché par marché.</span>` -> `<span class="attenue">on outside firms, market by market.</span>`
- 58 : `Voyez d'un coup ce qui s'applique, référence par référence` -> `See at a glance what applies, reference by reference`
- 60 : `Obtenez la réponse en quelques secondes, pas en quelques semaines` -> `Get the answer in seconds, not in weeks`
- 62 : `Sachez quoi changer, pas seulement ce que dit le texte` -> `Know what to change, not only what the text says`
- 64 : `Essai gratuit` -> `Free trial`
- 75 : `Jean droit enfant` -> `Kids straight jeans`
- 76 : `Référence DNM-4412` -> `Reference DNM-4412`
- 81 : `18 / 25 couvertes` -> `18 / 25 covered`
- 83 : `<span>US</span> États-Unis` -> `<span>US</span> United States`
- 84 : `CPSIA, plomb` -> `CPSIA, lead` ; `Couvert` -> `Covered`
- 85 : `Donnée manquante` -> `Data missing` (le nom `Proposition 65` ne bouge pas)
- 86 : `<span>UE</span> Union européenne` -> `<span>EU</span> European Union`
- 87 : `REACH annexe XVII` -> `REACH Annex XVII` ; `Couvert` -> `Covered`
- 88 : `Étiquetage textile 1007/2011` -> `Textile labelling 1007/2011` ; `À vérifier` -> `To check`
- 92 : `« La teneur en plomb ne dépasse pas 100 ppm en poids des parties accessibles. »` -> `“Lead content does not exceed 100 ppm by weight of accessible parts.”` (guillemets français remplacés par les guillemets anglais courbes, même limite, même unité)
- 94 : `CPSIA, section 101 (a)` -> inchangé, c'est une référence d'article.

### Le cycle
- 113 : `Du journal officiel à l'obligation testable,` -> `From the official journal to a testable obligation,`
- 113 : `<span class="attenue">le cycle complet</span>` -> `<span class="attenue">the full cycle</span>`
- 115-116 : `Ce qui entre est public, dispersé, et écrit pour des juristes. Ce qui sort porte son article, sa date d'application, et se teste sur une référence.` -> `What comes in is public, scattered, and written for lawyers. What comes out carries its article, its date of application, and can be tested on a reference.`
- 123 : `Ce qui entre` -> `What comes in`
- 124 : `Journaux officiels` -> `Official journals`
- 125 : `Autorités de marché` -> `Market authorities`
- 126 : `Projets de texte` -> `Draft texts`
- 127 : `Consultations publiques` -> `Public consultations`
- 132 : `La règle encodée` -> `The encoded rule`
- 133 : `L'article qui la fonde` -> `The article it rests on`
- 134 : `Sa date d'application` -> `Its date of application`
- 138 : `Ce qui sort` -> `What comes out`
- 139 : `Obligations testables` -> `Testable obligations`
- 140 : `Verdict par référence` -> `Verdict by reference`
- 141 : `Échéances` -> `Deadlines`

### Les trois features
Les trois noms restent tels quels : `Regulatory Change` (159), `Compliance` (173),
`Research` (188). Aucun n'a été traduit.

- 160 : `Suivez ce qui change, sans lire les journaux officiels` -> `Follow what changes, without reading the official journals`
- 162-164 : `Les textes évoluent marché par marché, et rien n'indique lequel touche vos gammes. Cleo vous adresse ce qui bouge gamme par gamme, avec des mois d'avance sur l'entrée en vigueur, pour que vous travailliez toujours sur la version en cours.` -> `Texts move market by market, and nothing tells you which one touches your ranges. Cleo sends you what moves, range by range, months ahead of the date it takes effect, so you always work on the version in force.`
- 166 : `En savoir plus` -> `Learn more`
- 174 : `Sachez quoi changer sur le produit, pas seulement ce que dit le texte` -> `Know what to change on the product, not only what the text says`
- 176-178 : `Le texte énonce la règle, il ne dit pas ce qu'il faut modifier sur la référence. Cleo teste chaque référence contre les règles encodées, famille par famille, et rend la liste de ce qui est couvert et de ce qui reste à faire pour ouvrir un marché.` -> `The text states the rule, it does not say what to modify on the reference. Cleo tests each reference against the encoded rules, family by family, and returns the list of what is covered and what is left to do to open a market.`
- 180 : `En savoir plus` -> `Learn more`
- 189 : `Vérifiez la source, jusqu'au caractère près` -> `Check the source, down to the character`
- 191-193 : `Une réponse sans source se rediscute à chaque échange, avec un acheteur comme à la douane. Cleo cite l'article exact, remonte à l'autorité et au texte d'origine, et vous laissez la citation parler à votre place.` -> `An answer without a source is reopened at every exchange, with a buyer as at customs. Cleo cites the exact article, traces it back to the authority and the original text, and you let the citation speak for you.`
- 195 : `En savoir plus` -> `Learn more`

### Cas client
- 210 : `La conformité produit d'un distributeur,` -> `The product compliance of a retailer,`
- 210 : `<span class="attenue">sur des dizaines de marchés</span>` -> `<span class="attenue">across dozens of markets</span>`
- 211 : `Un cas écrit, vérifié avec la cliente.` -> `One case, written and checked with the customer.`
- 220 : `La veille réglementaire de Decathlon tourne toute seule` -> `Decathlon's regulatory monitoring runs on its own`
- 222-223 : `Les équipes gagnent du temps, se transmettent ce qui compte sans effort, et aucune échéance n'est manquée.` -> `The teams save time, pass on what matters without effort, and no deadline is missed.`
- 228 : `marchés suivis` -> `markets tracked` (le `60` ligne 227 est inchangé)
- 231 : `2 812` -> `2,812` (même valeur, séparateur de milliers anglais, forme déjà retenue dans `commun/bandeau-nav-en.html`)
- 232 : `règles encodées` -> `encoded rules`
- 236 : `échéance manquée` -> `deadline missed` (le `0` ligne 235 est inchangé)
- 240 : `Lire le cas` -> `Read the case`

### Témoignage
- 264 : citation française remplacée par la clé `en:` de
  `/Users/naomiehalioua/cleo-landing/src/components/landing/DecathlonQuote.tsx`,
  recopiée au caractère près, par substitution programmatique et non à la main.
  497 caractères. Elle commence par `"At Decathlon, our challenge is capturing`
  et finit par `essential to guide design inside our PLM."`.
- 267 : `Philippine Tamic` -> inchangé.
- 268 : `Product Compliance Operations Manager chez Decathlon` -> `Product Compliance Operations Manager at Decathlon`, valeur `role.en` du même fichier source.
- 271 : `Voir les autres cas` -> `See other cases`, valeur `nav.otherCases.en` de `/Users/naomiehalioua/cleo-landing/src/i18n/sections/nav.ts`.

### Les experts
- 296 : `Expert réglementaire` -> `Regulatory expert`
- 301 : `Experte réglementaire` -> `Regulatory expert` (l'anglais ne porte pas le genre)
- 305 : `Et l'équipe qui encode, relit et met à jour les règles chaque semaine.` -> `And the team that encodes, reviews and updates the rules every week.`
- 310 : `L'équipe` -> `The team`
- 311 : `Ce que la machine propose,` -> `What the machine proposes,`
- 311 : `<span class="attenue">un humain le valide.</span>` -> `<span class="attenue">a human validates.</span>`
- 313-315 : `Une règle encodée porte la décision qui suit, sur un produit réel. La machine prépare l'encodage, un expert le relit, et c'est cette relecture qui décide de la mise en ligne.` -> `An encoded rule carries the decision that follows, on a real product. The machine prepares the encoding, an expert reviews it, and that review is what decides publication.`
- 319 : `La machine propose la règle avec l'article et la date d'application qui la fondent` -> `The machine proposes the rule with the article and the date of application it rests on`
- 321 : `Un expert relit chaque règle et tranche les cas où le texte laisse le choix` -> `An expert reviews every rule and settles the cases where the text leaves a choice`
- 323 : `Rien n'est publié sans cette relecture, et une règle mise en ligne reste suivie` -> `Nothing goes online without that review, and a rule once published stays tracked`

### CTA final
- 339 : `<b>30 minutes</b> pour voir ce qui bloque aujourd'hui` -> `<b>30 minutes</b> to see what is holding things up today`
- 340 : `Un nouveau pays n'est plus un projet.` -> `A new country is no longer a project.`
- 340 : `<span class="attenue">C'est une décision.</span>` -> `<span class="attenue">It is a decision.</span>`
- 342 : `Essai gratuit` -> `Free trial`
- 345 : `Réserver un créneau` -> `Book a slot` (même formulation que `CTA_EN` dans `construire.mjs`)

---

## Vérifié

Oracle : la page française elle-même, comparée attribut par attribut par un
script de diff. Les comptages sont sortis du fichier, pas estimés.

**Structure, la page anglaise contre la française**

| Contrôle | FR | EN | Verdict |
| --- | --- | --- | --- |
| Lignes du fichier | 354 | 354 | identique |
| `<div>` ouvertes / fermées | 97 / 97 | 97 / 97 | identique et équilibré |
| `<section>` | 10 / 10 | 10 / 10 | identique et équilibré |
| `<p>` | 9 / 9 | 9 / 9 | identique et équilibré |
| `<a>` | 10 / 10 | 10 / 10 | identique et équilibré |
| `<span>` | 41 / 41 | 41 / 41 | identique et équilibré |
| `<ul>` / `<li>` | 2 / 6 | 2 / 6 | identique et équilibré |
| `<h1>` `<h2>` `<h3>` | 1 / 5 / 6 | 1 / 5 / 6 | identique et équilibré |
| `<blockquote>` | 1 / 1 | 1 / 1 | identique et équilibré |
| `<svg>` | 13 / 13 | 13 / 13 | identique et équilibré |
| `<img>` | 14 | 14 | identique |

**Attributs, comparés dans l'ordre d'apparition**

- 167 attributs `class=`, séquence strictement identique à la française, zéro divergence.
- 72 attributs `style=`, séquence strictement identique, zéro divergence. Aucune
  valeur de style n'a été retouchée.
- 10 `href=`, séquence identique : `#`, `21-inscription.html`, `#`, `03-offre.html`,
  `08-reglementation.html`, `07-chat.html`, `06-cas-client.html` ×2, `#` ×2.
- 13 attributs `data-*`, séquence identique (`data-globe`, `data-anim`, `data-anim-groupe`).
- 15 commentaires HTML, identiques au caractère près, y compris les bannières de
  section et les notes de composition. Ils restent en français, la source aussi.

**Marqueurs du générateur**

- `<!--NAV-->` présent, en tête. `<!--PIED-->` présent, en pied.
- `<!--ECRAN-CHAT-VIGNETTE-->` présent, à la même place que dans la française.
- `<!--CTA-->` absent des deux pages : la française porte son CTA final écrit à la
  main, la page anglaise le porte aussi, écrit à la main et traduit. Pas de
  divergence, la page n'utilise pas le bloc `CTA_EN` de `construire.mjs`.
- 14 marqueurs `img:`, dans le même ordre : `logo-decathlon`, `logo-balzac`,
  `logo-mercedes`, `logo-loccitane`, `jean`, `echangeur`, `pneus`, `echangeur`,
  `logo-decathlon`, `philippine`, `logo-decathlon`, `darcial`, `thezi`, `anaelle`.
- 1 marqueur d'icône, `ico:engrenage:22`, au même endroit.

**Garde-fous**

- Balises portant deux attributs `class` : 0.
- `clamp(` dans le fichier : 0, donc pas d'espace manquant possible.
- `font-size` en `style=` inline : 0.
- Mention de `mono` : 0. Emoji : 0.
- Grilles : aucune n'a été posée en inline. `.g-features`, `.cycle`, `.experts-duo`,
  `.g2`, `.duo` sont reprises telles quelles. Le seul `grid-template-columns` inline,
  ligne 257, est copié à l'identique de la française et porte déjà `minmax(0,1fr)`.
- Surfaces : `.carte-claire` ×1, `.sur-sombre` ×2, `.sur-clair` / `.sur-clair-fond` ×4,
  aux mêmes lignes que dans la française. L'encre bascule donc pareil.
- Couleurs : aucune valeur de couleur n'a été écrite. Les seules présentes sont
  copiées de la source, `#fff` sur les coches et `#0008CF` sur les flèches bleues.

**Copie**

- Tirets cadratins dans le fichier : 1, et un seul. Il est dans la citation
  verbatim de Philippine Tamic, imposé par le fichier source. Vérifié par script :
  le compte de tirets du fichier est égal au compte de tirets de la citation.
  Zéro tiret cadratin dans la copie que nous écrivons.
- Caractères accentués dans le texte visible hors citation : aucun.
- Résidus de français dans le texte visible : aucun. Le seul mot que le filtre
  remonte est `expert`, qui est le mot anglais de `Regulatory expert`.
- Chiffres du texte visible, comparés terme à terme avec la française :
  `4412`, `18 / 25`, `65`, `1007/2011`, `100`, `101`, `22`, `60`, `2 812`, `0`, `30`.
  Même liste des deux côtés. Une seule différence, le séparateur de milliers de
  `2 812` qui devient `2,812`. Aucun chiffre ajouté, aucun retiré, aucune valeur
  changée.
- Faits : aucun fait nouveau. Aucun parcours, aucun client, aucune certification,
  aucun pourcentage n'a été introduit. Les seuls noms propres sont ceux déjà
  présents dans la française.

**Citation cliente**

Trouvée dans `/Users/naomiehalioua/cleo-landing/src/components/landing/DecathlonQuote.tsx`,
sous la clé `en:` de l'objet `quote`. Elle a été décodée depuis ses séquences
`\uXXXX` puis injectée par script dans un emplacement réservé, pour qu'aucune
frappe manuelle ne puisse l'altérer. 497 caractères posés. Le rôle sous la
citation vient de la clé `en:` de l'objet `role` du même fichier.

`verifier.mjs` compare la citation à la clé `fr:` de ce même fichier. Sur la page
anglaise ce contrôle signalera un écart, la page portant la version anglaise. Ce
n'est pas un défaut de la page, c'est le contrôle qui ne connaît qu'une langue.
À signaler à qui fera tourner la vérification.

---

## Laissé, non fait

- **Les commentaires HTML restent en français.** La consigne demande les mêmes
  commentaires de section. Les recopier tels quels garde la parité de structure
  parfaite et ils ne sont pas du texte visible. Si le jumeau doit un jour être lu
  par une équipe anglophone, c'est une passe séparée.
- **Le tiret cadratin de la citation reste.** Deux règles se croisent ici, zéro
  tiret cadratin d'un côté, citation cliente au caractère près de l'autre. La
  seconde l'emporte : une citation de cliente ne se réécrit pas, même d'un signe
  de ponctuation. C'est le seul tiret cadratin du fichier et il est signalé.
- **Le trou de la section experts est laissé ouvert, comme en français.** La
  composition d'edgecomply pose à cet endroit des anciens employeurs et un
  pourcentage. Nous n'avons ni l'un ni l'autre sur Darcial Mondjo et Thezi Mabuza,
  donc rien n'a été écrit. Le commentaire de la source le dit déjà, il est repris.
- **`Experte réglementaire` perd son genre en anglais.** `Regulatory expert` est
  la même chaîne pour les deux portraits. C'est la langue, pas une perte
  d'information.
- **Le bouton `Contact us` pointe sur `#`**, comme `Nous contacter` dans la
  française. La cible n'existe pas encore dans le jeu de maquettes, elle n'a pas
  été inventée.
- **Rien n'a été construit ni capturé.** `construire.mjs`, `capturer.mjs` et
  `verifier.mjs` n'ont pas été lancés, conformément à la consigne. La page n'a donc
  pas été rendue ni mesurée au pixel. La parité structurelle avec la française,
  elle, est mesurée et complète : si la française rend correctement, l'anglaise
  rend pareil, aucune classe ni aucun style ne les sépare.
