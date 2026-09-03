# Rapport moteur : drapeau `en`, entrée d'index, renommage des features

Fichiers touchés, et eux seuls :
`construire.mjs`, `index.mjs`. Aucune écriture dans `sortie/`, dans `pages/`
ni dans `commun/`. Ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs`
n'ont été lancés.

## Changements, un par ligne

### construire.mjs

- `construire.mjs:20` (nouvelle ligne) `néant` -> `{ fichier: '01-accueil-en.html', titre: 'Accueil EN', source: 'edgecomply.com/', en: true },`
- `construire.mjs:27` `titre: 'Réglementation'` -> `titre: 'Compliance'`
- `construire.mjs:249-269` (nouveau bloc) `néant` -> `const CTA_EN = ...`, jumeau exact de `CTA`, mêmes classes, mêmes href, textes anglais
- `construire.mjs:294-299` (nouveau bloc) `néant` -> commentaire + `function litOuRepli(rel, repli)`, qui lit le fragment s'il existe et rend le repli sinon
- `construire.mjs:300` (nouvelle ligne) `néant` -> `const navEn = litOuRepli('commun/bandeau-nav-en.html', nav)`
- `construire.mjs:301` (nouvelle ligne) `néant` -> `const piedEn = litOuRepli('commun/pied-en.html', pied)`
- `construire.mjs:316` `corps.replace('<!--NAV-->', nav).replace('<!--PIED-->', pied)` -> `corps.replace('<!--NAV-->', p.en ? navEn : nav).replace('<!--PIED-->', p.en ? piedEn : pied)`
- `construire.mjs:319` `corps.replace('<!--CTA-->', CTA)` -> `corps.replace('<!--CTA-->', p.en ? CTA_EN : CTA)`
- `construire.mjs:330` `<html lang="fr">` -> `<html lang="${p.en ? 'en' : 'fr'}">`

### index.mjs

- `index.mjs:14-15` (nouvelles lignes, juste après `01-accueil-noir.html`) `néant` -> `{ f:'01-accueil-en.html', t:'Accueil EN', g:'Accueil', src:'edgecomply.com/', blocs:14, note:"L'accueil en anglais : bandeau, pied et bloc de fin dans la langue du fragment." },`
- `index.mjs:18` `t:'Monitoring'` -> `t:'Regulatory Change'`
- `index.mjs:22` `t:'Réglementation'` -> `t:'Compliance'`

## Vérifié

Comptages et contrôles, tous passés :

- Syntaxe : `node --check construire.mjs` et `node --check index.mjs`, les deux
  rendent OK. Parsing seul, aucun des deux scripts n'a été exécuté.
- `CTA_EN` contre `CTA`, squelette de balises comparé balise à balise :
  `section div div div img div div b /b /div h2 /h2 div a span svg path /svg
  /span /a a /a /div /div /div /div /div /section`, identique des deux côtés.
- `CTA_EN` : 10 valeurs de `class` dans le même ordre que `CTA`
  (`section sur-sombre`, `conteneur`, `carte-encre p48`, `cta-final`,
  `portrait`, `t-caption`, `t-display`, `btn btn-marque`, `rond`,
  `btn btn-contour`). 2 `href`, tous deux `#`, comme `CTA`. 4 attributs
  `style=`, comme `CTA`.
- `CTA_EN` : 0 balise portant deux attributs `class`. 0 `font-size` en
  `style=` inline, l'échelle passe par `.t-caption` et `.t-display`.
  0 monospace, 0 emoji, 0 `clamp()` mal formé.
- `CTA_EN` : aucun chiffre nouveau. Les chiffres présents sont ceux de `CTA`
  repris à l'identique, `30 minutes` et les valeurs de géométrie et
  d'espacement (`48`, `10`, `28`, `14`, `12`, coordonnées du chevron).
- Copie anglaise : 0 tiret cadratin, 0 demi-cadratin. Les 3 tirets cadratins
  du fichier sont d'origine, aux lignes 99, 219 et 334, hors de mon périmètre.
- Repli des fragments, testé en vrai sur le disque, hors du générateur :
  `commun/bandeau-nav-en.html` est présent, il est donc lu, `navEn !== nav` ;
  `commun/pied-en.html` est absent, `litOuRepli` rend le repli français,
  `piedEn === pied`. Les deux branches sont donc exercées.
- `pages/01-accueil-en.html` est absent au moment où j'écris. La boucle
  existante le signale et passe, c'est le comportement voulu.
- Occurrences restantes de `Monitoring` ou `Réglementation` en tant que nom de
  feature dans mes deux fichiers : 0.

## Occurrences jugées une par une

Remplacées, 3 au total, parce que le mot y désigne la feature :

- `construire.mjs:27` `Réglementation` -> `Compliance` : titre de la page
  feature `08-reglementation.html`, il alimente le `<title>` du document et le
  libellé de la barre de maquettes.
- `index.mjs:18` `Monitoring` -> `Regulatory Change` : libellé d'index de la
  carte `03-offre.html`, groupe `Feature`.
- `index.mjs:22` `Réglementation` -> `Compliance` : libellé d'index de la carte
  `08-reglementation.html`, groupe `Feature`.

`Research` : 2 occurrences, `construire.mjs:26` et `index.mjs:20`. Inchangées,
le renommage les laisse telles quelles.

Laissées, 8 au total, parce que le mot n'y désigne pas la feature :

- `construire.mjs:27` `fichier: '08-reglementation.html'` : nom de fichier
  source dans `pages/`. Le renommer casserait la lecture du fragment.
- `index.mjs:22` `f:'08-reglementation.html'` : même nom de fichier, côté
  vignette et lien de la carte.
- `construire.mjs:57` `'researcher-1.webp'` et `construire.mjs:58`
  `'researcher-2.webp'` : noms de fichiers image dans `cleo-landing/public`.
- `construire.mjs:18` `'01-accueil.html'`, `source:` et les autres champs
  `source: 'edgecomply.com/services/*'` : ce sont les URL relevées chez
  EdgeComply, pas nos libellés.
- `index.mjs:23` `note:"Une règle encodée montrée dans sa forme réelle"` :
  aucune occurrence du mot, mais c'est la note de la carte `Compliance`, je l'ai
  relue et laissée, elle décrit le contenu et non la feature par son nom.
- `index.mjs:57` `note:"Sommaire collant, corps de texte réglementaire mesuré."`
  (page `22-legal.html`) : `réglementaire` est ici un adjectif ordinaire qui
  qualifie un corps de texte. Nom commun, laissé.
- `construire.mjs:122-136`, la table `REFERENCES` : références de textes,
  aucun rapport avec les noms de feature. Laissée intacte.

## Laissé / non fait

1. **`construire.mjs:22`, `titre: 'Offre'` pour `03-offre.html`, non renommé.**
   C'est la page que `index.mjs` présente comme la feature `Monitoring`, donc
   son libellé de barre devrait logiquement devenir `Regulatory Change`. Mais le
   mot écrit là est `Offre`, pas `Monitoring` : le renommer serait une décision
   que la consigne ne couvre pas, et le renommage se fait occurrence par
   occurrence. Incohérence signalée, décision laissée à Naomie. Une ligne suffit
   si c'est oui.

2. **Les libellés de nav et de pied ne sont pas dans mon périmètre.** Ils vivent
   dans `commun/bandeau-nav.html` (lignes 15, 16, 19, 20, 23, 24) et
   `commun/pied.html` (lignes 47, 48, 49), et portent encore `Monitoring`,
   `Research`, `Réglementation` ainsi que les marqueurs d'icône
   `ico:monitoring` et `ico:reglementation`. La consigne borne le renommage à
   mes deux fichiers, je n'ai pas touché `commun/`. À noter pour l'agent qui en
   a la charge : les trois `Réglementations` de `commun/pied.html` (lignes 63,
   82, 97, « Réglementations européennes », « nord-américaines », « Autres
   réglementations ») sont des noms communs et doivent rester.

3. **Aucun fait, aucun chiffre, aucun parcours inventé.** La note de la carte
   `Accueil EN` dans `index.mjs` décrit uniquement ce que le drapeau `en` fait
   réellement. Elle reprend `blocs:14` de l'accueil français parce que c'est le
   même fragment de composition ; si le fragment anglais que l'agent frère écrit
   compte un nombre de blocs différent, cette valeur est à corriger, je ne
   pouvais pas la mesurer sur un fichier absent.

4. **Traduction du bloc de fin, à faire relire.** `CTA_EN` porte
   « 30 minutes with the team, to go through your catalogue », « Shall we look
   at your products together? », « Start for free », « Book a slot ». Aucune
   promesse nouvelle, le pain avant l'outil, ton neutre. Reste un choix de
   langue à valider : `catalogue` en orthographe britannique, cohérent avec un
   marché européen.

5. **Pas de `PLAN.md`.** La consigne d'orchestration énumère déjà, ligne à
   ligne, les modifications attendues sur mes deux fichiers, et un banc en
   cours ne s'interrompt pas pour une validation. Les modifications sont
   listées ci-dessus, réversibles une par une.
