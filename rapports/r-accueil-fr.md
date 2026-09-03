# Rapport : refonte de 01-accueil.html (FR)

Écrit le 27/08/2026. Agent `accueil`.
Fichiers touchés, et eux seuls :
`pages/01-accueil.html` (réécriture complète et assumée) et
`commun/composants.css` (ajout en fin de fichier uniquement, aucune règle existante modifiée).

Je n'ai lancé ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs`.
Les comptages ci-dessous sont faits sur les fragments sources.

---

## 1. Le hero

| Ligne | Ancien | Nouveau |
|---|---|---|
| 01-accueil.html:8 | `<section class="sur-sombre hero-epure">` | `<section class="sur-sombre hero-epure hero-clos">` |
| 01-accueil.html:11 | « La conformité produit, automatisée. Sur 106 pays. » | « Vendez partout. **Conformez-vous partout.** » |
| 01-accueil.html:14 | « Trop de réglementations, qui bougent en permanence, différentes dans chaque région. Résultat : impossible de savoir, concrètement, quoi faire sur le produit. » | « L'agent IA produit qui automatise et accélère tout le cycle de la conformité produit. » |
| 01-accueil.html:17 | `<a class="btn btn-marque" href="21-inscription.html">Essai gratuit</a>` | `<a class="btn btn-marque" href="#">Nous contacter</a>` |
| 01-accueil.html:18 | `<a class="btn btn-contour" href="#">Voir Cleo en action</a>` | `<a class="btn btn-contour" href="21-inscription.html">Essai gratuit</a>` |
| 01-accueil.html:23-30 (ancien) | pied de hero : `.avatars` + img:darcial + img:thezi + « Encodé à la main, relu par des experts en conformité produit » | **retiré en entier** |

Le titre est la traduction de « Sell everywhere. Comply anywhere. ». La seconde
moitié passe en `.attenue`, comme l'ancien titre le faisait pour son second membre.

« Essai gratuit » descend en secondaire mais **garde `21-inscription.html`** : c'est
le seul chemin vers cette page sur l'accueil, la sortir la rendait orpheline.

Le globe `div.hero-globe[data-globe]` est resté, intact, à sa place.

Le bas de bloc était porté par `.hero-pied{padding-bottom:96px}`. Le pied parti,
le hero se serait terminé à zéro. `.hero-clos` rend ce bas au conteneur, en classe,
avec sa valeur repliée à 56 px sous 1024 px comme le faisait `.hero-pied`.

## 2. Les deux retraits

| Ancien | Quoi |
|---|---|
| 01-accueil.html:36-38 | `<div class="centre t-micro">106 pays suivis. 2 812 règles encodées. 19 000 autorités.</div>` → **retiré**. La bande de logos reste : Decathlon, Balzac Paris, Mercedes-Benz, L'Occitane, les quatre cellules intactes. |
| 01-accueil.html:165-195 | Section **LE MOTEUR** en entier → **retirée** : `<section class="section gc-doux">`, la photo `img:parc-voitures`, le surtitre « Le moteur », « 2 812 règles encodées. Une seule vous bloque. », les trois coches et la note de comptage. |

## 3. Les trois features, composition relevée sur Regology

Ancien : trois `.carte-encre` égales dans une `.g3`, visuel en haut, titre en `.t-h2`,
liste cochée.

Nouveau : `.g-features`, deux blocs côte à côte en haut, un bloc pleine largeur en
bas avec le texte à gauche et le visuel à droite. Titres passés de `.t-h2` (18 px) à
`.t-display` (32 px). Les listes cochées, qui étaient bonnes, sont passées en prose,
le pain d'abord et l'outil ensuite.

| Bloc | Surtitre | Lien | Visuel |
|---|---|---|---|
| haut gauche | Regulatory Change | `03-offre.html` | `.scene` + `img:echangeur` (déjà sur la page) |
| haut droite | Compliance | `08-reglementation.html` | `.scene` + `img:pneus` (déjà sur la page) |
| bas, pleine largeur | Research | `07-chat.html` | `<!--ECRAN-CHAT-VIGNETTE-->`, l'écran produit de `commun/vignettes.html` |

Aucune image inventée : les trois marqueurs `img:` utilisés existent dans la table
`IMAGES` de `construire.mjs`. La vignette de chat porte déjà « Research » dans son
fil d'Ariane, elle n'a demandé aucune retouche.

`img:briques`, qui portait l'ancienne carte Research, n'est plus utilisée sur cette
page. Elle reste dans la table et sur `04-secteur` et `05-marche`.

Les trois paragraphes, pain d'abord :

- **Regulatory Change** : « Les textes évoluent marché par marché, et rien n'indique lequel touche vos gammes. Cleo vous adresse ce qui bouge gamme par gamme, avec des mois d'avance sur l'entrée en vigueur, pour que vous travailliez toujours sur la version en cours. »
- **Compliance** : « Le texte énonce la règle, il ne dit pas ce qu'il faut modifier sur la référence. Cleo teste chaque référence contre les règles encodées, famille par famille, et rend la liste de ce qui est couvert et de ce qui reste à faire pour ouvrir un marché. »
- **Research** : « Une réponse sans source se rediscute à chaque échange, avec un acheteur comme à la douane. Cleo cite l'article exact, remonte à l'autorité et au texte d'origine, et vous laissez la citation parler à votre place. »

L'ancienne coche « Testez une référence contre 2 812 règles d'un coup » a perdu son
chiffre dans la reformulation : « contre les règles encodées ».

## 4. L'animation, section neuve avant les features

`01-accueil.html:102-145`, `<section class="section sur-sombre">`.

Un objet au centre, ce qui entre à gauche, ce qui sort à droite.

- Titre : « Du journal officiel à l'obligation testable, **le cycle complet** ». Il dit le cycle, pas un compteur.
- Entrées : journaux officiels, autorités de marché, projets de texte, consultations publiques.
- Centre : « La règle encodée », avec « L'article qui la fonde » et « Sa date d'application ».
- Sorties : obligations testables, verdict par référence, échéances.

**Aucun chiffre dans cette section.**

Le mouvement réutilise le moteur existant, aucun moteur réécrit :
- chaque colonne est un `data-anim-groupe`, la cascade est celle de `mouvement.css` (70 ms par enfant) ;
- le noyau est un `data-anim="grandit"` ;
- seule la **direction** d'arrivée est posée ici, en deux règles :
  `.cycle-entrees[data-anim-groupe] > *{transform:translateX(-24px)}` et
  `.cycle-sorties[data-anim-groupe] > *{transform:translateX(24px)}`.

Rien ne peut rester à `opacity:0` après le défilement : `mouvement.css` est concaténé
**après** `composants.css` dans `construire.mjs` (`${base} ${composants} ${regimeNoir} ${mouvement}`),
donc `[data-anim-groupe].vu > *{opacity:1; transform:none}` (spécificité 0,2,0, plus loin
dans la source) l'emporte sur mes deux règles de même spécificité. Seul l'état de départ,
lu avant `.vu`, m'appartient. Animations sur `opacity` et `transform` seulement,
`--dur-reveal` 0,5 s, `--ease-reveal` cubic-bezier(.625,.05,0,1), valeurs du moteur.

Le seul bleu de la section est `--c-signal-clair` sur l'icône et les deux pastilles du
noyau : il ne marque qu'une chose, l'objet du centre.

## 5. Les experts, composition relevée sur EdgeComply

`01-accueil.html:280-330`. Portraits à gauche (`.experts-portraits`), titre et trois
coches à droite (`.experts-texte`), dans `.experts-duo`.

| Ancien | Nouveau |
|---|---|
| texte à gauche, portraits à droite | portraits à gauche, texte à droite |
| `<h2>` « Un juriste et un ingénieur sur le même problème. » | « Ce que la machine propose, **un humain le valide.** » |
| « Expert en conformité produit » / « Experte en conformité produit » | « Expert réglementaire » / « Experte réglementaire » |
| trois coches sur les sources et les scripts | trois coches sur le human in the loop |

Les trois coches :
1. « La machine propose la règle avec l'article et la date d'application qui la fondent »
2. « Un expert relit chaque règle et tranche les cas où le texte laisse le choix »
3. « Rien n'est publié sans cette relecture, et une règle mise en ligne reste suivie »

`img:darcial` et `img:thezi` conservées, en `.experts-portraits img` (classe, pas inline).

**Ce que je n'ai pas écrit, volontairement.** La référence EdgeComply affiche à cet
endroit « our experts come from companies like TJX / ZARA / amazon / TÜV Rheinland »
et « top 1 % of compliance experts ». Je n'ai **aucun** ancien employeur, **aucun**
parcours et **aucun** pourcentage sur Darcial Mondjo et Thezi Mabuza, et ça ne
s'invente pas. L'angle est tenu par le PROCESS : ce que la machine propose, ce qu'un
humain valide, ce qui n'est jamais publié sans relecture. **Le trou est ici, signalé :**
si tu veux la ligne de crédibilité par les personnes, il me faut les parcours réels.

## 6. Le renommage sur cette page

### Occurrences REMPLACÉES : 2

| Ligne (ancienne) | Ancien | Nouveau | Pourquoi c'est la feature |
|---|---|---|---|
| 01-accueil.html:121 | `<div class="surtitre">Monitoring</div>` | `Regulatory Change` | surtitre de carte de feature, lié à `03-offre.html` |
| 01-accueil.html:149 | `<div class="surtitre">Réglementation</div>` | `Compliance` | surtitre de carte de feature, lié à `08-reglementation.html` |

`Research` (ancienne ligne 135, nouvelle 188) : inchangé, comme demandé.

Sur cette page il n'y a **ni entrée de nav, ni entrée de pied, ni titre de page
feature, ni libellé d'index** : ils vivent dans `commun/bandeau-nav.html`,
`commun/pied.html`, les pages 03/07/08 et `index.mjs`, qui ne sont pas mes fichiers.

`Monitoring` : vérifié occurrence par occurrence, il n'y en avait qu'une sur la page
et elle désignait bien la feature. Il en reste **0**.

### Occurrences LAISSÉES : 6, toutes des noms communs ou des libellés réels

| Ligne (nouvelle) | Texte | Raison de le laisser |
|---|---|---|
| 180 | `href="08-reglementation.html"` | nom de fichier, pas un libellé. Le renommage des pages appartient aux agents `chassis` et `features`. |
| 220 | « La veille **réglementaire** de Decathlon tourne toute seule » | adjectif, nom commun. Ne désigne pas la feature. |
| 264 | « un volume massif de **réglementations** produits à l'international » | citation VERBATIM de Philippine Tamic. On ne touche pas à la parole d'une cliente. |
| 268 | « Product **Compliance** Operations Manager chez Decathlon » | intitulé de poste réel d'une personne nommée. Coïncidence de mot, pas la feature. |
| 296 | « Expert **réglementaire** » (Darcial Mondjo) | adjectif dans un intitulé de poste, dicté par le brief. |
| 301 | « Experte **réglementaire** » (Thezi Mabuza) | idem. |

Deux occurrences supplémentaires du mot ont disparu **par effet de bord des retraits**,
pas par renommage : « Trop de **réglementations**, qui bougent en permanence » (ancien
sous-titre de hero, chantier 1) et le surtitre « Le moteur » de la section retirée
(chantier 2).

Aucun remplacement en masse n'a été fait. Chaque occurrence a été lue.

---

## Vérifié

Comptages faits avec `grep -o | wc -l` sur les fragments sources, avant et après.

**Balises appariées, avant → après** (les six que `construire.mjs` contrôle en bloquant,
plus celles que je manipulais) :

| Balise | Avant | Après | Appariées |
|---|---|---|---|
| `div` | 91 / 91 | 97 / 97 | oui |
| `section` | 10 / 10 | 10 / 10 | oui (une retirée, LE MOTEUR ; une ajoutée, LE CYCLE) |
| `ul` | 6 / 6 | 2 / 2 | oui (quatre listes parties : trois cartes de feature passées en prose, une avec LE MOTEUR) |
| `p` | 6 / 6 | 9 / 9 | oui |
| `table` | 0 / 0 | 0 / 0 | oui |
| `aside` | 0 / 0 | 0 / 0 | oui |
| `li` | 18 / 18 | 6 / 6 | oui (12 parties, cohérent avec les quatre `ul`) |
| `a` | 10 / 10 | 10 / 10 | oui |
| `h1` / `h2` / `h3` | 1 / 4 / 6 | 1 / 5 / 6 | oui (le `h2` du cycle ajouté) |
| `span` | 49 / 49 | 41 / 41 | oui |
| `blockquote` | 1 / 1 | 1 / 1 | oui |
| `img` | 18 ouvertes | 14 ouvertes | balise vide. 4 retirées : les 2 avatars du hero, `parc-voitures` avec LE MOTEUR, `briques` remplacée par la vignette de chat. |

**Garde-fous :**

| Contrôle | Résultat |
|---|---|
| Découpe HTML par index de chaîne | Jamais. Réécriture complète et assumée de la page ; l'unique retouche du CSS est un remplacement de chaîne EXACTE, vérifié à 1 occurrence avant écriture. |
| Deux attributs `class` sur une balise | 0 (`grep 'class="[^"]*"[^>]*class="'`) |
| `clamp()` sans espace autour du `+` | 0 dans `composants.css` (je n'ai ajouté aucun `clamp`) |
| Grille repliable en `style=` inline | 0 dans ce que j'ai écrit. Les trois grilles neuves vivent dans `.g-features`, `.cycle` et `.experts-duo`, toutes repliées en une colonne sous 1024 px. |
| `minmax(0,1fr)` + `min-width:0` sur chaque colonne | oui, sur les trois grilles et leurs enfants |
| Surface claire sans `.carte-claire` / sombre sans `.surface-sombre` | aucune surface en dur ajoutée : `.feature-cadre` et `.experts-portraits` sont sur `var(--c-surface)`, qui suit le régime, donc aucune poignée d'encre n'est nécessaire. Le `.carte-claire` existant du bloc principal est conservé tel quel. |
| `font-size` en `style=` inline | 0 sur la page |
| Tiret cadratin `—` ou demi-cadratin `–` | 0 sur la page |
| Emoji | 0 sur la page, 0 dans le CSS |
| Monospace | 0 sur la page, 0 dans le CSS |
| Accolades CSS | 572 ouvertes / 572 fermées |
| Marqueurs `img:` inconnus | 0. Les 11 utilisés (`anaelle`, `darcial`, `echangeur`, `jean`, `logo-balzac`, `logo-decathlon`, `logo-loccitane`, `logo-mercedes`, `philippine`, `pneus`, `thezi`) sont tous dans la table `IMAGES` de `construire.mjs`. |
| Marqueurs `ico:` inconnus | 0. Un seul, `ico:engrenage:22`, présent dans `commun/icones.js`. |
| `construire.mjs` / `capturer.mjs` / `verifier.mjs` lancés | non, aucun des trois |

**Chiffres nouveaux : 0.** Balayage de tout le texte visible, balises retirées.
Les seuls chiffres restants sont préexistants et intacts : la fiche produit du bloc
principal (DNM-4412, 18 / 25, Proposition 65, 1007/2011, 100 ppm, CPSIA 101 (a)),
les trois pilules du cas client (60, 2 812, 0) et « 30 minutes » du CTA final.
Trois chiffres ont été **retirés** : « 106 pays suivis. 2 812 règles encodées.
19 000 autorités. », « 2 812 règles encodées. Une seule vous bloque. » et les deux
occurrences de « contre 2 812 règles d'un coup ».

**Faits inventés : 0.** Aucun parcours, aucun ancien employeur, aucune certification,
aucun pourcentage, aucun client nouveau.

**Ajouts à `composants.css` : 77 lignes en fin de fichier, 764 → 841.**
Aucune règle existante modifiée ni déplacée. Nouvelles classes : `.hero-clos`,
`.g-features`, `.feature-visuel`, `.feature-large`, `.feature-cadre`, `.cycle`,
`.cycle-colonne`, `.cycle-entrees`, `.cycle-sorties`, `.cycle-jeton`, `.cycle-noyau`,
`.cycle-icone`, `.cycle-ligne`, `.experts-duo`, `.experts-portraits`, `.experts-texte`.
Toutes sont référencées par la page, aucune n'est morte.

**Contraste vérifié à la main sur un point.** Les deux lignes du noyau du cycle
(« L'article qui la fonde », « Sa date d'application ») portent `.t-caption` pour la
taille. Sur champ profond, `.sur-sombre .t-caption` les mettait à
`rgba(255,255,255,0.38)` sur `#0F0E0D`, soit environ 3,4:1. J'ai ajouté
`.sur-sombre .cycle-ligne{color:var(--c-text-on-dark-2)}` : ce sont du contenu, pas
des étiquettes. Les `.t-label` « Ce qui entre » / « Ce qui sort » restent au niveau 3,
c'est la convention du reste du site pour les étiquettes.

---

## Laissé / non fait

1. **`01-accueil.html:257` porte encore un `grid-template-columns` en `style=` inline**
   sur le `.duo` du témoignage : `style="gap:0;align-items:stretch;grid-template-columns:0.72fr minmax(0,1fr)"`.
   C'est le garde-fou 4 : sous 1024 px, `.duo{grid-template-columns:minmax(0,1fr)}`
   perd contre l'inline, et le témoignage restera sur deux colonnes au téléphone.
   **Je ne l'ai pas corrigé** : c'est du markup préexistant, hors des six chantiers,
   et la correction demande une classe de plus. Le correctif tient en deux lignes
   (une classe `.duo-temoignage` avec son repli), dis-moi si je le prends.

2. **Le bandeau de nav, le pied, les titres des pages feature et les libellés d'index
   ne sont pas renommés** : `commun/bandeau-nav.html`, `commun/pied.html`, `index.mjs`,
   `03-offre.html`, `07-chat.html`, `08-reglementation.html` ne sont pas mes fichiers.
   Ce sont les agents `chassis` et `features`. Tant qu'ils n'ont pas passé, la page
   affichera « Regulatory Change » et « Compliance » dans ses cartes et l'ancien nom
   dans la barre du haut.

3. **Le lien « Nous contacter » pointe sur `#`.** Il n'y a pas de page de contact dans
   `pages/`. J'ai laissé l'ancre morte plutôt que d'inventer une destination.
   Même chose pour les trois `#` préexistants du bloc principal et du CTA final.

4. **La citation encadrée des experts est partie** : « Nous refusons les réponses qui
   sonnent juste sans pouvoir être vérifiées. Dans ce métier, presque juste est faux. »
   La composition EdgeComply demande titre + trois coches à droite, et rien d'autre.
   La phrase existe toujours ailleurs si tu la veux, dis-le et je la remets sous les coches.

5. **Le trou EdgeComply sur les personnes**, redit ici pour qu'il ne se perde pas :
   aucun parcours, aucun ancien employeur, aucun pourcentage pour Darcial Mondjo et
   Thezi Mabuza. Il me faut ces éléments pour les écrire, et ils ne s'inventent pas.

6. **Je n'ai pas regardé le rendu.** Interdiction de lancer `construire.mjs` et
   `capturer.mjs`. Tout ce qui précède est vérifié sur les fragments sources, pas au
   pixel. La page mérite un coup d'œil section par section après la construction,
   en particulier le repli du cycle et de `.g-features` sous 1024 px.
