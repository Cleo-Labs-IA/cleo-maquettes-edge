# Rapport lane pages-1 : renommage des trois features

Périmètre : `pages/04-secteur.html`, `pages/05-marche.html`, `pages/09-texte.html`.
Renommage appliqué : Monitoring -> Regulatory Change · Research -> Research (inchangé) · Réglementation -> Compliance.
Aucun autre fichier touché. `sortie/` non touchée. Aucun script du générateur lancé.

## Changements, un par ligne

Les numéros de ligne sont ceux du fichier après édition (le nombre de lignes n'a pas bougé).

### pages/04-secteur.html
- 04-secteur.html:75 `<span class="etiquette" …>Monitoring</span>` -> `<span class="etiquette" …>Regulatory Change</span>` (surtitre de la carte de feature, section « quatre temps »)
- 04-secteur.html:77 `Le Monitoring fait ce rattachement et donne le temps qui reste.` -> `Regulatory Change fait ce rattachement et donne le temps qui reste.` (le nom propre remplace « Le Monitoring » : « Le Regulatory Change » ne se dit pas, l'article saute)
- 04-secteur.html:103 `<span class="etiquette" …>Réglementation</span>` -> `<span class="etiquette" …>Compliance</span>` (surtitre de la carte de feature)
- 04-secteur.html:185 `<h3 class="t-h2" …>Monitoring</h3>` -> `<h3 class="t-h2" …>Regulatory Change</h3>` (titre de la carte de feature, section « Les offres »)
- 04-secteur.html:197 `<h3 class="t-h2" …>Réglementation</h3>` -> `<h3 class="t-h2" …>Compliance</h3>` (titre de la carte de feature, section « Les offres »)

### pages/05-marche.html
- 05-marche.html:78 `<span class="etiquette" …>Monitoring</span>` -> `<span class="etiquette" …>Regulatory Change</span>` (surtitre de la carte de feature)
- 05-marche.html:80 `Le Monitoring fait ce rattachement et donne le temps qui reste.` -> `Regulatory Change fait ce rattachement et donne le temps qui reste.`
- 05-marche.html:106 `<span class="etiquette" …>Réglementation</span>` -> `<span class="etiquette" …>Compliance</span>` (surtitre de la carte de feature)

### pages/09-texte.html
- 09-texte.html:75 `<span class="etiquette" …>Monitoring</span>` -> `<span class="etiquette" …>Regulatory Change</span>` (surtitre de la carte de feature)
- 09-texte.html:77 `Le Monitoring fait ce rattachement et donne le temps qui reste.` -> `Regulatory Change fait ce rattachement et donne le temps qui reste.`
- 09-texte.html:103 `<span class="etiquette" …>Réglementation</span>` -> `<span class="etiquette" …>Compliance</span>` (surtitre de la carte de feature)
- 09-texte.html:171 `<h3 class="t-h2" …>Monitoring</h3>` -> `<h3 class="t-h2" …>Regulatory Change</h3>` (titre de la carte de feature, section « Les offres »)
- 09-texte.html:183 `<h3 class="t-h2" …>Réglementation</h3>` -> `<h3 class="t-h2" …>Compliance</h3>` (titre de la carte de feature, section « Les offres »)

Total : 13 remplacements sur 3 fichiers. Aucune occurrence de « Research » modifiée, c'est voulu.

## Laissé, avec la raison

### Nom commun, la feature n'est pas désignée
- 04-secteur.html:138 « le paysage réglementaire du textile s'étend chaque année ». Adjectif, décrit le corpus légal, pas le produit. Laissé.
- 04-secteur.html:212, 05-marche.html:197, 09-texte.html:198 « un volume massif de réglementations produits à l'international ». Citation Decathlon, mot au pluriel et au sens commun. Une citation ne se réécrit pas. Laissé (3 occurrences).

### Jetons du générateur, pas du texte affiché
- 04-secteur.html:184 et 09-texte.html:170 `ico:monitoring`
- 04-secteur.html:196 et 09-texte.html:182 `ico:reglementation`

Ce sont des clés d'icône. `construire.mjs:285` les résout par `/ico:([a-z]+)/` contre `commun/icones.js`, et `icone()` lève « ICÔNE INCONNUE » sur une clé absente. Les renommer casserait la construction, et le motif n'accepte de toute façon ni majuscule ni espace. Le rendu visible ne contient pas ces chaînes. Laissé (4 occurrences).

### Hors périmètre
- Les entrées de la barre de nav et du pied ne vivent pas dans ces trois fichiers : les pages ne portent que les marqueurs `<!--NAV-->` et `<!--PIED-->`, remplis depuis `commun/bandeau-nav.html` et `commun/pied.html`. Le renommage nav et pied est à faire par la lane qui tient `commun/`.
- Les liens « En savoir plus » des cartes de feature pointent sur `03-offre.html` ou sur `#`. Cibles hors de mes fichiers, non touchées.

## Vérifié

Comptages faits après édition, sur les trois fichiers.

- Occurrences restantes de « Monitoring » en texte visible : 0. Les 4 restantes sont des jetons `ico:monitoring` / `ico:reglementation`.
- Occurrences restantes de « Réglementation » désignant la feature : 0.
- Occurrences de nom commun conservées : 4 (1 adjectif + 3 fois la citation Decathlon).
- « Regulatory Change » : 3 dans 04, 2 dans 05, 3 dans 09.
- « Compliance » en contenu de balise : 2 dans 04, 1 dans 05, 2 dans 09.
- « Research » : inchangé, 2 dans 04, 1 dans 05, 2 dans 09.
- Double attribut `class` sur une même balise : 0 sur les trois fichiers.
- Tiret cadratin ou demi-cadratin : 0 sur les trois fichiers.
- `clamp()` sans espace autour du `+` : 0 sur les trois fichiers.
- `font-size` inline ajouté : 0. Les `font-size:1.25rem` des pastilles d'icône sont antérieurs, je n'y ai pas touché.
- Nombre de lignes inchangé : 243 / 228 / 229.
- Équilibre des balises, ouvrants contre fermants, `span h2 h3 div section p ul li` : identique sur les trois fichiers, aucun écart.
- Méthode : remplacement de chaîne exacte en Python, chaque motif contrôlé à 1 occurrence attendue avant écriture. Aucune découpe par index. Aucun remplacement en masse.

## Bloqué, manquant

- Aucun chiffre nouveau introduit. Les chiffres présents (2 812 règles, 43 juridictions, 180 règles, 106 pays, 27 États membres, dates) sont antérieurs et n'ont pas été touchés.
- Aucun fait inventé. Aucune composition de référence ne réclamait un chiffre manquant sur ces trois pages.
- À faire ailleurs, hors de mon périmètre : la nav et le pied dans `commun/`, la page feature `03-offre.html` et les deux autres pages feature, l'index et les libellés de menu.
- Question ouverte pour Naomie : la section « La mise en conformité, en quatre temps » n'annonce que trois blocs sur ces trois pages. Écart antérieur à mon passage, je n'ai rien ajouté pour ne pas inventer un quatrième temps.
