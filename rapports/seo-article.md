# Rapport : gabarit d'article et liste de publications

Agent `article`. Écrit le 27/08/2026.
Fichiers écrits : `pages/12-article.html`, `pages/11-blog.html`, et rien d'autre.
`/Users/naomiehalioua/cleo-landing` n'a reçu aucune écriture (`git status` : aucun
fichier suivi modifié).

Sources lues :
`cleo-landing/src/components/blog/ArticleShell.tsx`,
`cleo-landing/src/data/blog-posts.json`,
`cleo-landing/src/data/authors.json`,
`cleo-landing/src/lib/blog.ts`,
`cleo-landing/src/i18n/sections/social-proof.ts`,
`cleo-landing/src/components/landing/TeamSection.tsx`,
`cleo-maquettes-edge/commun/composants.css`, `commun/base.css`, `construire.mjs`.

---

## Changements sur `pages/12-article.html`

| # | Changement | Source |
|---|---|---|
| 1 | La signature « Équipe Cleo » devient **Anaelle Guez**, nommée, avec sa fonction. | `authors.json` clé `anaelle`, champ `role.fr` |
| 2 | Fonction affichée : **« Co-fondatrice & CEO, Conformité »**, au caractère près. | `authors.json:14-17` |
| 3 | La signature devient un lien `rel="author noopener"` vers `https://www.linkedin.com/in/anaelle-guez-ab341746/`. | `authors.json:19` |
| 4 | La photo passe de `img:naomie` à `img:anaelle` et gagne son `alt="Anaelle Guez"` (il était vide). | `construire.mjs:64` (`author-anaelle.png`) |
| 5 | La date devient machine-lisible : `<time datetime="2026-08-26">26 août 2026</time>`. Le gabarit n'avait aucune balise `time`. | forme reprise de `ArticleShell.tsx:333` |
| 6 | Le sommaire gagne deux entrées, `#questions` et `#sources`. | gain de maquette |
| 7 | Nouvelle section **`<h2 id="questions">Questions fréquentes</h2>`** + 4 `details/summary` au style `.faq` du kit. | `ArticleShell.tsx:223-241` (`FaqSection`), style `composants.css:389-399` |
| 8 | Le bloc « Sources » sans lien devient **`<h2 id="sources">`** + une `<ol>` de 2 `<cite>` portant de vrais liens EUR-Lex. | `ArticleShell.tsx:242-264` (`BibliographySection`), URL au motif `LEGISLATION_REGISTRY` `ArticleShell.tsx:16-29` |
| 9 | La phrase d'honnêteté est **conservée mot pour mot** : « Les dates citées sont celles du texte publié, non d'une version consolidée. » | déjà présente dans le gabarit |

### Les 4 questions ajoutées, et d'où sort chaque fait

Aucun fait réglementaire nouveau. Chaque réponse ne cite que le texte que
l'article cite déjà, le règlement (UE) 2025/40, et la directive 94/62 qu'il abroge.

1. « Le règlement remplace-t-il la directive 94/62 partout en même temps ? »
   → abrogation + applicabilité directe sans transposition : corps de l'article, § 1 et § « De quel texte on parle ».
2. « Quels emballages entrent dans le champ du texte ? »
   → article 2, paragraphe 1, cité mot pour mot dans le `blockquote` du gabarit.
3. « Une déclaration de conformité suffit-elle pour vendre dans toute l'Union ? »
   → article 39, modèle à l'annexe VIII, et absence de registre européen unique :
   repris de la FAQ du **vrai** article `eu-ppwr-packaging-conformity-2026`
   (`blog-posts.json`, faq[0] et faq[1]), donc du même texte 2025/40.
4. « Par quoi commencer quand la date approche ? »
   → fichier d'impression, marquage de composition, signalétique de tri, étapes
   suivantes : corps de l'article, § « Ce qui s'applique au 12 août 2026 » et § « Ce qui vient ensuite ».

### La bibliographie

| Entrée | Lien posé | Contrôle |
|---|---|---|
| Règlement (UE) 2025/40 | `https://eur-lex.europa.eu/eli/reg/2025/40/oj` | CELEX `32025R0040` : **200** au cellar |
| Directive 94/62/CE | `https://eur-lex.europa.eu/eli/dir/1994/62/oj` | CELEX `31994L0062` : **200** au cellar |

---

## Changements sur `pages/11-blog.html`

| # | Changement |
|---|---|
| 10 | Le titre de section manquant est posé : `<h2 class="t-h1">Toutes les publications</h2>`. |
| 11 | Les entrées visibles passent de **7 à 13** (1 à la une + 12 en grille). |
| 12 | Les **6 titres inventés** du gabarit (PFHxA, RSGP article 19, Ouvrir les États-Unis, Signalétique de tri, Formaldéhyde REACH XVII, Encoder une obligation) sont **remplacés par 12 titres réels**, recopiés au caractère près depuis `blog-posts.json`, avec leur slug réel en `data-slug`. |
| 13 | Chaque entrée porte sa date en `<time datetime="AAAA-MM-JJ">` et son auteur nommé. |
| 14 | Les titres de carte passent de `<div class="titre">` à `<h2 class="titre">` : le HTML initial du vrai `/blog` porte un `h2` par article, la maquette n'en portait qu'un. |
| 15 | La carte à la une gagne elle aussi `<time datetime="2026-08-26">` et son auteur. |

### Les 12 entrées, toutes sourcées

| Date | Slug réel | Auteur | Catégorie |
|---|---|---|---|
| 2026-06-03 | `cursor-mcp-compliance-skills` | Alexandre Bloch | Ingénierie |
| 2026-06-02 | `compliance-checks-claude-code-60-seconds` | Naomie Halioua | Conformité produit |
| 2026-05-31 | `legal-atlas-machine-readable-law` | Alexandre Bloch | Produit |
| 2026-05-29 | `open-source-product-compliance-skills-ai-agents` | Naomie Halioua | Conformité produit |
| 2026-05-27 | `regulatory-data-quality-plm-integration` | Alexandre Bloch | Conformité produit |
| 2026-04-28 | `ce-marking-digital-products-2026` | Anaelle Guez | Conformité produit |
| 2026-04-17 | `global-product-compliance-pitch-by-deel` | Naomie Halioua | Entreprise |
| 2026-03-24 | `legal-here-illegal-there` | Anaelle Guez | Conformité Produit |
| 2026-03-14 | `cosmetic-regulation-by-country` | Anaelle Guez | Conformité produit |
| 2026-03-13 | `digital-product-passport-retail-guide` | Anaelle Guez | Conformité produit |
| 2026-03-11 | `multi-market-product-compliance-retail` | Anaelle Guez | Conformité |
| 2026-03-08 | `gpsr-compliance-guide-consumer-goods` | Anaelle Guez | Conformité produit |

Titres, dates, catégories et auteurs viennent tous de `blog-posts.json`.
La casse de « Conformité Produit » à la ligne 2026-03-24 est celle de la donnée,
recopiée telle quelle. Elle diffère du reste du corpus : c'est probablement une
coquille côté `cleo-landing`, non corrigée ici puisque le dépôt est en lecture seule.

Le titre du 2026-04-17 contient « The Pitch by Deel ». C'est le **prix**, un fait,
et non le slogan « The Deel of product compliance » qui, lui, est en liste noire.

Les `href` restent `12-article.html` : la maquette n'a qu'un gabarit d'article.
Le slug réel voyage en `data-slug`, prêt pour le jour où les routes existeront.

---

## Vérifié : mes comptages

| Contrôle | Attendu | Mesuré |
|---|---|---|
| `11-blog.html` : cartes `a.res-carte` | 12 | **12** |
| `11-blog.html` : balises `h2` | 14 (12 cartes + à la une + section) | **14** |
| `11-blog.html` : balises `time` | 13 | **13** |
| `12-article.html` : balises `time` | 1 | **1** |
| Attributs `datetime` hors format AAAA-MM-JJ | 0 | **0** |
| `12-article.html` : `h2` porteurs d'un `id` | 6 | **6** |
| Liens `href="#…"` du sommaire qui résolvent | 6/6 | **6/6** |
| `12-article.html` : `details` de FAQ | 4 | **4** |
| `12-article.html` : balises `cite` avec lien | 2 | **2** |
| Éléments à deux attributs `class` | 0 | **0** |
| `style=` contenant `font-size` | 0 | **0** |
| `clamp(` posé sans espaces autour du `+` | 0 | **0** (aucun `clamp` ajouté) |
| Tirets cadratins | 0 | **0** |
| Emoji, `monospace`, `<code>`, `<pre>` | 0 | **0** |
| Équilibre des balises (parseur HTML, hors éléments vides) | 0 erreur | **0 erreur, 0 balise non fermée**, sur les deux fichiers |
| Clés `img:` employées absentes de la table `IMAGES` | 0 | **0** (13 clés, toutes présentes) |
| `alt` vide sur les images ajoutées | 0 sur le portrait d'auteur | **portrait : `alt="Anaelle Guez"`** |

Aucune découpe par index de chaîne : chaque modification est un remplacement de
chaîne exacte. Ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs`, ni
`temoin.mjs` n'ont été lancés.

---

## Liste noire rencontrée : ce que j'ai refusé de transcrire

1. **Les trois titres de Naomie Halioua.** Rencontrés en clair :
   `authors.json:5-8` → « Co-fondatrice & CRO, Recherche IA » ;
   `social-proof.ts:150` → « Co-fondatrice & Directrice de la Recherche » ;
   `TeamSection.tsx:62` → « Chief Research Officer & Co-founder » ;
   `ArticleShell.tsx:108` → « Co-founder & CRO ».
   **Je n'en ai choisi aucun.** Conséquence directe : bien que l'article de
   démonstration porte sur le PPWR et que le vrai article PPWR
   (`eu-ppwr-packaging-conformity-2026`) soit signé `naomie`, j'ai signé la
   maquette **Anaelle Guez**, dont la fonction est sourçable sans arbitrage.
   Le nom « Naomie Halioua » apparaît en revanche dans trois entrées de
   `11-blog.html`, **sans fonction** : le nom seul n'est pas en conflit.
2. **Le slogan « The Deel of product compliance »** : non transcrit. Le prix,
   lui, vit dans un titre d'article réel et a été gardé tel quel.
3. **Les deux chercheuses inventées** (`research.ts:80-81`) et les clés d'image
   `chercheuse-1` / `chercheuse-2` : jamais citées, jamais employées.
4. **Le score F1 de 0,81**, le `sameAs` Crunchbase « celo-labs », les trois
   définitions de MARIA, `/resources/gdpr-compliance`, les adresses `hello@` et
   `contact@`, la collision « mica » : aucun n'avait sa place dans ces deux
   fichiers, et aucun n'y figure. Contrôle passé sur les deux fichiers, rien.
5. **La collision « mica », vue de près.** Le mécanisme est dans
   `ArticleShell.tsx:31-48` : `getCitationsForPost` fait un `searchText.includes(key)`
   sur les mots-clés **et** le titre, avec la clé `'mica'` du registre. Toute
   occurrence de la sous-chaîne « mica » (« chimique », « chemical », « chimica »)
   fait citer le règlement crypto-actifs (UE) 2023/1114. J'ai donc écrit la
   bibliographie **à la main**, texte par texte, sans reprendre ce mécanisme.

---

## Trous laissés : ce que je n'ai pas pu sourcer

1. **Le décompte de 108.** `blog-posts.json` contient **77** articles, pas 108
   (dont 73 avec FAQ, soit 94,8 %). Les 31 restants ne sont pas dans ce fichier :
   ils viennent probablement d'une autre source de rendu que je n'ai pas
   identifiée. Écart signalé, non comblé, aucune entrée inventée pour l'atteindre.
2. **Le LinkedIn d'Anaelle Guez, deux valeurs.** `authors.json:19` et
   `social-proof.ts:146` disent `.../in/anaelle-guez-ab341746/` ;
   `ArticleShell.tsx:117` dit `.../in/anaelleguez/`. J'ai posé la première,
   parce que c'est **celle que le composant rend réellement** pour un article
   qui a un `author` (`ArticleShell.tsx:338`) : la seconde n'est qu'un repli
   codé en dur, jamais atteint pour les 77 articles, qui ont tous un auteur.
   À trancher côté `cleo-landing`, hors de ma passe.
   Aucune des deux URL n'a été vérifiée en ligne : LinkedIn refuse les robots.
3. **La fonction d'Anaelle, deux formulations françaises.** « Co-fondatrice &
   CEO, Conformité » (`authors.json`) contre « Co-fondatrice & PDG »
   (`social-proof.ts:136`) et « PDG & Co-fondatrice » (`social-proof.ts:127`).
   Ce sont deux rendus de la même charge, pas deux charges différentes, à la
   différence du cas Naomie. J'ai retenu `authors.json`, qui est **le fichier
   que la signature d'article lit**. À harmoniser côté `cleo-landing`.
4. **La fonction d'Alexandre Bloch** : « CTO, Engineering » (`authors.json`)
   contre « CTO » (`social-proof.ts:164`, `TeamSection.tsx:71`). Écart de suffixe
   seulement. Sans effet ici : son nom apparaît dans `11-blog.html` sans fonction.
5. **Les liens EUR-Lex ne renvoient pas 200 en direct.** `eur-lex.europa.eu`
   répond **202** à toute requête automatisée, y compris avec un `User-Agent` de
   navigateur : ce n'est pas un statut d'existence. J'ai donc vérifié l'existence
   des deux textes **par leur CELEX au cellar** (`publications.europa.eu`), qui
   répond 200 pour `32025R0040` et pour `31994L0062`. La forme d'URL `/eli/…/oj`
   est celle qu'emploie déjà `LEGISLATION_REGISTRY` dans `ArticleShell.tsx`.
   Confiance : **existence du texte vérifiée, résolution de l'URL non vérifiée**.
6. **Les 3 cartes « À lire aussi » de `12-article.html`** portent encore des
   titres inventés (PFHxA, « Encoder une obligation », « Le PPWR, emballage par
   emballage »). Elles ne faisaient pas partie des six ajouts demandés et je ne
   les ai pas touchées. À aligner sur des slugs réels dans une passe suivante.
7. **Les vignettes de `11-blog.html` gardent `alt=""`.** C'est volontaire :
   l'image est décorative à l'intérieur d'un lien dont le titre porte le texte.
   Signalé pour que la passe « alt » ne le compte pas comme un oubli.
8. **`12-article.html` reste un article de démonstration.** Son titre, son
   chapeau et son corps ne sont pas ceux d'un article réel, et sa date du
   26 août 2026 est celle de la maquette, pas d'une publication. Le `datetime`
   ajouté ne fait que rendre lisible la date déjà affichée : il n'invente rien,
   mais il ne source rien non plus.
