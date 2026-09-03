# Page 24 — Blog

Gabarit créé : `/Users/naomiehalioua/cleo-maquettes-edge/pages/24-blog.html`
Source rhabillée : `https://www.cleolabs.co/fr/blog`, relevée au curl (UA navigateur) le 1er septembre 2026,
réponse 200, 1 175 563 octets. Code de la page : `~/cleo-landing/src/app/[locale]/blog/page.tsx`,
métadonnées : `~/cleo-landing/src/data/blog-posts.json`, auteurs : `~/cleo-landing/src/data/authors.json`.

Aucun fichier existant du chantier n'a été modifié. `construire.mjs`, `capturer.mjs` et `verifier.mjs`
n'ont pas été lancés.

---

## 1. Ce qui vient de la page réelle

### Correction d'entrée : la liste rend 114 articles, pas 108

La consigne annonçait 108. C'était le compte du 27 août (`rapports/carte-blog.md`). Mesuré ce jour
sur la page servie : **114**, par deux voies indépendantes qui concordent.

| Mesure | Valeur |
|---|---|
| Liens `href="/fr/blog/<slug>"` distincts dans le HTML servi | 114 |
| Compteur du filtre « Tout » affiché par la page elle-même | 114 |
| Cartes d'articles (bloc `<a>` complet) | 114 |

Le blog a gagné six articles en six jours, ce qui est cohérent avec la cadence mesurée plus bas.
La maquette porte donc 114, pas 108.

### Structure reprise

| Élément de la page servie | Ce que la maquette en fait |
|---|---|
| Titre `Actualités & analyses` | `<h1 class="t-display">` du bandeau sombre |
| Sous-titre « Mises à jour, analyses réglementaires et nouveautés produit de Cleo Labs. » | verbatim, dans la colonne droite de `.res-tete` |
| Quatre filtres : `Tout 114`, `Naomie · IA 81`, `Anaelle · Conformité 25`, `Alexandre · Tech 8` | rangée de `.pilule` / `.pilule-contour`, libellés et compteurs verbatim |
| Liste chronologique, catégorie + date + titre + description + auteur par carte | deux blocs : la série quotidienne en lignes denses, les guides en `.g3` |
| Absence de pagination (les 114 sont dans le HTML initial) | un seul bouton « Voir les 114 articles », pas de « charger la suite » |

Le libellé des filtres est reconduit tel quel, y compris son défaut : il annonce des thèmes
(« IA », « Conformité », « Tech ») mais filtre en réalité sur l'auteur. C'est la page réelle qui
le dit ainsi ; la maquette ne le corrige pas, elle le porte.

### Les 14 articles, tous réels

Titres, catégories, dates et auteurs sont extraits par script du HTML servi, jamais retapés :
le gabarit a été généré à partir du relevé, ce qui garantit le verbatim (contrôle 11b).
Chaque entrée porte son `data-slug` réel et sa date dans un `<time datetime>`.

À la une :

| slug | date | catégorie | auteur |
|---|---|---|---|
| `cleo-labs-raises-1-5m-preseed` | 2026-04-29 | Entreprise | Naomie Halioua |

La série quotidienne, sept lignes, du 1er septembre au 26 août 2026 :

| slug | date | catégorie | auteur |
|---|---|---|---|
| `thailand-methanol-processing-aid-2026` | 2026-09-01 | Conformité produit | Naomie Halioua |
| `uk-ebike-battery-fire-deaths-2026` | 2026-08-31 | Conformité produit | Naomie Halioua |
| `belgium-egg-salmonella-recall-2026` | 2026-08-30 | Conformité produit | Naomie Halioua |
| `brazil-anvisa-unregistered-cosmetics-2026` | 2026-08-29 | Conformité produit | Naomie Halioua |
| `spain-textile-epr-decree-2026` | 2026-08-28 | Conformité produit | Naomie Halioua |
| `boohoo-dgccrf-leather-labeling-fine-2026` | 2026-08-27 | Conformité produit | Naomie Halioua |
| `us-uflpa-entity-list-expansion-2026` | 2026-08-26 | Conformité produit | Naomie Halioua |

Guides et analyses, six cartes :

| slug | date | catégorie | auteur | image |
|---|---|---|---|---|
| `ce-marking-digital-products-2026` | 2026-04-28 | Conformité produit | Anaelle Guez | `fenetres` |
| `legal-atlas-machine-readable-law` | 2026-05-31 | Produit | Alexandre Bloch | `classeurs` |
| `open-source-product-compliance-skills-ai-agents` | 2026-05-29 | Conformité produit | Naomie Halioua | `briques` |
| `cosmetic-regulation-by-country` | 2026-03-14 | Conformité produit | Anaelle Guez | `flacons` |
| `digital-product-passport-retail-guide` | 2026-03-13 | Conformité produit | Anaelle Guez | `pneus` |
| `gpsr-compliance-guide-consumer-goods` | 2026-03-08 | Conformité produit | Anaelle Guez | `echangeur` |

Les titres de la série quotidienne font entre 246 et 386 caractères. Ce sont les vrais titres.
Ils n'ont été ni raccourcis, ni reformulés : c'est ce qui donne à la page sa densité, et c'est
la matière même du blog depuis juillet.

### Le seul texte descriptif repris

La description de l'article de la levée, verbatim depuis la carte servie : « Tour mené par
Larry Berger, aux côtés de Kima Ventures, Financière Saint-James et plusieurs figures du tech :
complété par un financement de Deel. […] ». Aucune autre description n'est reprise, aucune
n'est réécrite.

Le rôle de l'auteure sous l'article à la une, « co-fondatrice & CRO, Recherche IA », vient de
`src/data/authors.json`, clé `naomie`, champ `role.fr`.

### Les quatre chiffres du bloc « Le corpus, relevé sur la page servie »

Tous mesurés sur le HTML servi le 1er septembre 2026, aucun estimé.

| Chiffre | Méthode |
|---|---|
| 114 articles | liens `/fr/blog/<slug>` distincts, confirmé par le compteur « Tout » de la page |
| 3 auteurs (81 / 25 / 8) | comptage des noms d'auteur par carte ; identique aux compteurs des filtres |
| 61 jours consécutifs, du 3 juillet au 1er septembre | dates distinctes triées, plus longue suite sans trou depuis la plus récente |
| Premier article daté : 11.02.26 | date minimale des 114 cartes |

---

## 2. Ce que je n'ai pas pu sourcer, et que la page ne porte donc pas

1. **Le temps de lecture.** La liste servie ne l'affiche pas, et `rapports/carte-blog.md` a mesuré
   que le `wordCount` déclaré est calculé sur un temps de lecture saisi à la main, avec un écart
   de 82 686 mots sur le corpus. Aucune carte de la maquette n'affiche de durée.
2. **Les images de couverture réelles.** Les 114 articles portent des couvertures dans
   `/public/blog-bank/…` qui ne sont pas dans la table `IMAGES` de `construire.mjs`. J'ai donc
   employé sept clés existantes de la table (`paris`, `fenetres`, `classeurs`, `briques`,
   `flacons`, `pneus`, `echangeur`). Ce sont des visuels du chantier, pas les couvertures du
   blog : à remplacer si les vraies couvertures entrent dans la table.
3. **Le nombre total de mots, les FAQ, les blocs JSON-LD.** Mesurés dans `carte-blog.md` sur un
   état antérieur du dépôt (108 articles). Je ne les ai pas remesurés sur 114, donc je ne les
   affiche pas.
4. **La description des treize autres articles.** Elles existent sur la page servie mais la
   composition retenue (lignes denses, cartes courtes) ne les porte pas. Rien n'a été inventé
   pour combler ; les blocs sont simplement plus courts.
5. **Le compteur « 1 494 sources officielles sur 177 juridictions »** figure dans la description
   servie de `legal-atlas-machine-readable-law`. Écarté volontairement : il concurrence les trois
   compteurs canoniques sans être l'un d'eux. Aucun des trois compteurs canoniques
   (106 pays / 25 000 réglementations / 19 000 autorités) n'est employé sur cette page, la page
   réelle n'en portant aucun. Le « 3 700 sources » n'apparaît pas.
6. **Une fiche SEO.** `commun/seo.json` n'a pas d'entrée `24-blog.html`. À la construction,
   `construire.mjs` posera un titre de repli « Cleo — Blog » et notera l'absence. La page servie
   a pour titre `Blog | Cleo Labs` : c'est la valeur à transcrire dans `seo.json`, avec
   `source: "site"` et `url_source: https://www.cleolabs.co/fr/blog`.
7. **L'inscription au chantier.** La table `PAGES` de `construire.mjs` s'arrête à `22-legal.html`.
   `24-blog.html` n'y est pas. Je n'ai pas touché `construire.mjs` : c'est un fichier existant,
   partagé avec les autres agents, et l'ajout d'une ligne dans une table que plusieurs sessions
   éditent en même temps est exactement le cas où l'on perd le travail du voisin. L'entrée à
   ajouter : `{ fichier: '24-blog.html', titre: 'Blog', source: 'cleolabs.co/fr/blog' }`.

---

## 3. Les contrôles que j'ai passés

Vingt contrôles, écrits contre le fichier produit, tous verts. Chacun est exécutable de nouveau.

| # | Contrôle | Résultat |
|---|---|---|
| 1 | Aucun élément ne porte deux attributs `class` | PASS, 0 |
| 2 | Aucune `grid-template-columns` ni grille `repeat()` en `style=` inline | PASS, 0 |
| 3 | La section sombre ne contient aucune surface claire non déclarée | PASS |
| 4 | `clamp()` : espaces autour du `+` | PASS, aucun `clamp()` inline |
| 5a | Zéro tiret cadratin ou demi-cadratin | PASS, 0 caractère |
| 5b | Zéro emoji | PASS, 0 |
| 5c | Zéro monospace | PASS |
| 6 | Aucune `font-size` en `style=` inline | PASS |
| 6b | Crans typo employés tous dans l'échelle des huit | PASS : `t-display`, `t-h1`, `t-body`, `t-caption`, `t-label` |
| 7 | Les 7 images citées figurent dans la table `IMAGES` | PASS |
| 7b | Aucune icône `ico:` inventée | PASS, aucune employée |
| 8 | La page commence par `<!--NAV-->` et finit par `<!--CTA-->` puis `<!--PIED-->` | PASS |
| 9 | Balises équilibrées, comptées balise par balise (`section` 2/2, `div` 65/65, `a` 15/15, `p` 3/3, `h1` 1/1, `h2` 10/10, `span` 35/35, `time` 14/14, `svg` 13/13) | PASS |
| 9b | Aucun `<a>` imbriqué dans un `<a>` | PASS |
| 10 | Toutes les classes employées sont définies dans le CSS du chantier | PASS sauf `gc-deep`, voir ci-dessous |
| 11a | 14 `data-slug`, tous présents dans la liste servie | PASS |
| 11b | Les 14 titres sont verbatim ceux de la page servie | PASS |
| 11c | Les 14 `datetime` sont les dates réelles de leurs articles | PASS |
| 11d | Une balise `<time datetime>` par article, ni plus ni moins | PASS, 14/14 |
| 11e | Chaque auteur cité est celui que la page servie attribue à l'article | PASS |

### Le seul écart : `gc-deep`

Le bandeau porte `class="sur-sombre gc-deep section-serree"`, copié du moule des trois sœurs.
Mesuré : `gc-deep` n'existe que dans `commun/composants-noir.css.sauvegarde`, jamais dans le CSS
servi (`base.css`, `composants.css`, `regime-noir.css`, `mouvement.css`). C'est une classe morte,
et elle l'est aussi dans `10-ressources.html`, `11-blog.html` et `13-glossaire.html`, qui la
portent toutes les trois. Le fond sombre est en réalité rendu par `.sur-sombre`
(`base.css:140`). Je l'ai conservée pour rester dans le moule de la famille plutôt que de créer
une divergence sur une seule page ; le nettoyage se fait sur les quatre pages d'un coup, pas ici.

### Ce que je n'ai pas pu contrôler

La page n'a pas été construite ni rendue, donc rien de ce qui se mesure au rendu n'a été vérifié :
contraste réel, repli à 390 px, hauteur des lignes denses portant des titres de 386 caractères,
absence de défilement horizontal. Les deux points à regarder en premier une fois la page
construite :

1. **La ligne dense à 390 px.** `.ligne-liste` est un flex sans règle de repli. La ligne ne porte
   que deux enfants (la pastille de date en `flex:none`, le bloc `.principal` en `flex:1;min-width:0`),
   ce qui la fait se réduire sans déborder, mais un titre de 386 caractères y rendra long.
2. **La hauteur de l'article à la une.** Le `.duo` de la carte est repris tel quel de `11-blog`,
   avec un titre plus court que celui d'origine : il devrait tenir plus court, pas plus haut.
