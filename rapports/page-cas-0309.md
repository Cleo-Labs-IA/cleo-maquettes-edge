# Page Compliance as a service

## Ce qui a été créé (fichiers, liens changés)

- `pages/37-compliance-service.html` : nouvelle page FR, sur le gabarit de `08-reglementation.html` / `07-chat.html`.
- `pages/37-compliance-service-en.html` : jumeau EN, structure strictement identique.
- `construire.mjs` : deux entrées ajoutées à la table `PAGES` (`37-compliance-service.html` / `37-compliance-service-en.html, en: true`), aucune autre ligne touchée.
- `commun/chemins.json` : deux chemins ajoutés, sans `"reelle": true` (la route n'existe pas sur le vrai site) :
  - `37-compliance-service.html` → `/fr/platform/compliance-service`
  - `37-compliance-service-en.html` → `/en/platform/compliance-service`
- `commun/seo.json` : deux fiches ajoutées dans `pages`, sur le modèle de la fiche `08-reglementation.html` (titre ≤ 60, description ≤ 160, `source: "redige"`, `url_source: null`, `appariement` et `appui_contenu` qui disent d'où vient le texte).
- `commun/bandeau-nav.html` et `commun/bandeau-nav-en.html` : le lien du mega-item « Compliance as a service » passe de `01-accueil.html#compliance-service` / `01-accueil-en.html#compliance-service` à `37-compliance-service.html` / `37-compliance-service-en.html`. Rien d'autre modifié dans la barre (vérifié : `avecMenuMobile` continue de parser les deux fichiers sans erreur, le menu mobile est généré aux deux builds).
- `commun/pied.html` et `commun/pied-en.html` : même changement de lien dans la colonne « Produit ».
- `commun/lanes/cas.css` : créé, sans règle (la page réutilise `.bf-faits`, `.bf-intro`, `.bf-appel-txt`, `.flux`, `.experts-duo`, `.g3`, `.coches`, `.faq`, `.temoignage`, `.cta-final` telles quelles ; aucun besoin propre après capture et mesure).
- `pages/03-offre.html`, `pages/07-chat.html`, `pages/08-reglementation.html` : troisième carte « Compliance as a service » ajoutée dans le bloc « Les deux/trois autres features », h2 renommé « Les trois autres features », grille passée de `.g2` à `.g3`. Vérifié en capture sur les trois pages (desktop) : rendu propre, trois cartes alignées.
- Sur `pages/37-compliance-service.html` et son jumeau EN, les trois cartes du bloc « Les autres features » sont des liens (`<a class="carte-encre p40" href="...">`) vers `03-offre.html`, `07-chat.html`, `08-reglementation.html` — c'est la seule page où ces cartes sont cliquables (sur 03/07/08 les cartes existantes n'étaient déjà pas des liens ; je n'ai pas changé ce comportement pré-existant, hors territoire).

## D'où vient chaque bloc de texte

- **H1 et chapeau** : imposés par la consigne (« Compliance as a service. Nos experts rédigent, relisent et signent. »). Le chapeau (« Une déclaration de conformité, une question sur une entrée REACH, un marché à ouvrir. Cleo rédige le premier jet, un expert le relit et signe le document remis. ») recompose les étapes 01 et 03 de la section `id="compliance-service"` de `01-accueil.html`, mot pour mot sur les segments repris.
- **« Pour qui ? »** : phrase suggérée par la consigne elle-même (« les équipes qui doivent remettre une déclaration de conformité ou un dossier technique et veulent qu'un expert le signe »), reprise quasiment telle quelle.
- **Les trois étapes du `.flux`** (01 Vous adressez la demande / 02 Cleo rédige / 03 Un juriste relit) et **la carte des experts** (`.experts-duo`, portraits `img:darcial` et `img:thezi`, h3 « Une équipe juridique dédiée, qui connaît votre profil. », les deux coches) : copiés au caractère près depuis la section `id="compliance-service"` de `pages/01-accueil.html` (lignes 225-286) et son jumeau `01-accueil-en.html`.
- **« Ce que fait Compliance as a service »** (5 groupes de coches + encart « Bon à savoir ») : chaque puce est une reformulation directe des trois paragraphes d'étape ou des deux coches de l'accueil — aucun fait nouveau. Le groupe « Ce que l'équipe connaît » reprend les deux coches de l'accueil au caractère près. Le groupe « Mise en place » est le bloc boilerplate déjà identique sur `03-offre.html`, `07-chat.html` et `08-reglementation.html`.
- **Carte d'appel** : texte imposé par la consigne (« … se prend seul ou avec les trois autres features. Une gamme et deux marchés suffisent pour commencer. »).
- **« Les trois autres features »** : cartes Regulatory Change / Research / Compliance Data. Research et Compliance Data sont copiées mot pour mot depuis le bloc identique de `07-chat.html`/`08-reglementation.html`. Regulatory Change n'existait dans aucun de ces blocs (bug pré-existant hors territoire : ces deux pages montrent déjà toutes les deux Research + Compliance Data, jamais Regulatory Change — non corrigé, hors périmètre de cette tâche) ; son texte de carte a donc été recomposé à partir de deux sources déjà dans le dépôt : le mega-item de la nav (« Chaque parution rattachée à vos références ») et la carte agent de l'accueil (« Recevez la parution rattachée à la gamme qu'elle touche, avec sa date d'application » / « Travaillez sur la version en vigueur »).
- **Témoignage** : bloc copié au caractère près depuis `08-reglementation.html` (citation Decathlon, Philippine Tamic), avec `img:masse-gant` à la place de `img:masse-skate`, comme demandé.
- **FAQ** (3 questions) : chaque réponse reformule directement une étape ou les deux coches — aucun chiffre ni délai inventé.
- **Clôture (CTA final)** : bloc copié au caractère près depuis `08-reglementation.html` (image `img:anaelle`, « 30 minutes… », h2, deux boutons).
- **EN** : traduction miroir de tout ce qui précède ; le témoignage reste en français dans les deux langues (citation verbatim d'un client, jamais traduite — aucun autre témoignage traduit n'existe ailleurs dans le dépôt comme précédent).

## Mesures desktop et téléphone (FR et EN)

D'après `captures/lane/37-compliance-service-mesures.json` et `-en-mesures.json`, et lecture des tranches d'image (`-d1..3`, `-m1..6`) :

| | FR desktop | FR mobile | EN desktop | EN mobile |
|---|---|---|---|---|
| h1 | 1 seul, 51.84px | 1 seul, 36px | 1 seul, 51.84px | 1 seul, 36px |
| débordement horizontal | non | non | non | non |
| liens morts (`href="#"`) | 0 | 0 | 0 | 0 |
| champs figés | 0 | 0 | 0 | 0 |
| textes < 14px | 0 (script ne signale que mobile) | 0 | 0 | 0 |
| cibles < 40px | — | 0 | — | 0 |
| paragraphe le plus large | 720px | 334px | 720px | 334px |
| images sans alt / cassées | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 |
| police | Satoshi | Satoshi | Satoshi | Satoshi |
| pied | 517px | 1474px | 517px | 1464px |
| erreurs console | 0 | 0 | 0 | 0 |
| titre SEO | 58 caractères | — | 54 caractères | — |
| description SEO | 160 caractères | — | 158 caractères | — |

`node commun/capture2.mjs 37-compliance-service 37-compliance-service-en` rend `OK` pour les deux pages (aucune alerte).

Lecture visuelle des 3 tranches desktop + 6 tranches mobile de chaque langue (`Read` sur chaque PNG) : hero sombre texte seul (aucune carte blanche posée dessus), grille « Pour qui ? » propre, `.flux` en trois colonnes desktop / une colonne mobile, carte experts-duo avec les deux portraits et les deux liens LinkedIn, `.bf-faits` en deux colonnes desktop / une colonne mobile avec l'encart « Bon à savoir » qui ferme la grille, carte d'appel centrée sans prix, trois cartes « Les trois autres features » alignées en `.g3` desktop / empilées mobile, témoignage Decathlon avec `img:masse-gant`, FAQ à 3 questions, clôture identique à `08-reglementation.html`. Rien ne déborde, aucun bloc ne casse en colonne intermédiaire.

Vérification additionnelle sur les trois pages touchées en option (`03-offre`, `07-chat`, `08-reglementation`) : capture desktop de chacune, la nouvelle carte « Compliance as a service » s'aligne proprement dans `.g3` sur les trois. Les alertes « textes < 14px (mobile) » déjà présentes sur ces trois pages (9 sur `08-reglementation`, 12 sur `07-chat`, 24 sur `03-offre`) sont pré-existantes : la valeur de `08-reglementation` est identique avant et après mon changement (9 dans les deux cas), et ma propre page neuve, qui réutilise la même nav/pied, rend 0 texte < 14px mobile — la cause n'est donc pas mon ajout. Non corrigé : hors territoire de cette tâche.

## Doutes de contenu

- Le paragraphe du hero, les groupes de `.bf-faits` et la FAQ sont des **reformulations** des trois étapes et des deux coches de l'accueil, pas des citations verbatim à 100 % (contrairement au `.flux`, à la carte experts et au témoignage, qui sont copiés au caractère près comme demandé). Ils ne contiennent aucun chiffre, aucun délai et aucun fait qui n'apparaisse pas déjà dans la section source.
- La carte « Regulatory Change » ajoutée aux blocs « Les trois autres features » est une recomposition (nav + carte agent de l'accueil), faute d'un bloc « Les deux autres features » qui la montrait déjà quelque part dans le dépôt — signalé ci-dessus, pas inventé mais assemblé.
- `appariement` dans `seo.json` : je n'ai pas trouvé trace d'une route `product/compliance-service` dans un dépôt Next.js réel (je n'ai pas accès à ce dépôt depuis cette tâche) ; la fiche dit seulement que le contenu ne vivait qu'en ancre sur `/fr` et `/en`, sans affirmer qu'un fichier `page.tsx` existe côté vrai site — à la différence des fiches 07/08 qui, elles, citent un chemin de fichier précis.
- Traduction EN du bouton « Réserver un créneau » → « Book a slot » : pas de précédent dans le dépôt (aucune des trois pages feature n'a de jumeau EN), traduction assumée par moi, pas vérifiée contre une page EN existante portant cette même expression.

VERIFICATION: node construire.mjs -> 0 echec (49 pages, tous les controles passent) ; node commun/capture2.mjs 37-compliance-service 37-compliance-service-en -> OK (aucune alerte sur les deux) ; nav construite -> `href="/fr/platform/compliance-service"` et `href="/en/platform/compliance-service"` trouvés dans sortie/01-accueil.html et sortie/01-accueil-en.html, et les deux réécritures présentes dans sortie/vercel.json.
