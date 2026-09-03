# Page 25 - Skills

Fichier : `/Users/naomiehalioua/cleo-maquettes-edge/pages/25-skills.html`
Source rhabillée : https://www.cleolabs.co/fr/skills
Code de la page réelle : `/Users/naomiehalioua/cleo-landing/src/app/[locale]/skills/page.tsx`
et `/Users/naomiehalioua/cleo-landing/src/components/landing/SkillsPageClient.tsx`
Moule d'habillage : `pages/10-ressources.html` et `pages/13-glossaire.html` (famille Ressources)
Écrite le 1er septembre 2026.

---

## 1. Combien de skills, réellement

La question posée était : va voir combien il y en a et ce qu'elles font.
Trois sources indépendantes, toutes interrogées, toutes d'accord sur **45**.

| Source | Comment interrogée | Ce qu'elle rend |
|---|---|---|
| La page servie | `curl` avec UA navigateur sur `/fr/skills` | « 45 skills open-source », « 6 verticales. 45 skills. », « Prêt pour 45 skills ? » |
| Le paquet npm | `registry.npmjs.org/@cleo-labs/skills-mcp` | version 0.1.0, licence `MIT`, description : « MCP server exposing **45** production-grade product compliance skills » |
| Le serveur MCP vivant | `list_skills` sans filtre, plugin `compliance-product-guidance` | `{"count":45,"total":45}` et les 45 noms |

Le serveur donne aussi un champ `vertical` par skill. En le comptant :

- **18 skills** portent `vertical: "workflow"` : ce sont des méthodes de travail, pas des familles de produit.
- **27 skills** portent une famille de produit, une par famille (agricultural, alcohol-spirits,
  automotive-aftermarket, baby-children-products, baby-formula, candle-fragrance, cosmetics,
  electronics, firearms, food, herbal-medicine, household-chemicals, jewelry, labeling, marketplace,
  medical-device, optical-eyewear, packaging, pet-product, product, professional-cosmetics,
  sporting-goods, supplement, sustainability, textile, tobacco-vape, toy).

27 + 18 = 45. Vérifié par comptage, pas estimé.

**Les 45 vrais noms sont dans la page**, section « L'inventaire », avec pour chacun ce qu'il couvre.
Le libellé français de chaque skill est une condensation de la description que le serveur rend
lui-même, pas une invention : aucune référence réglementaire n'y figure qui ne soit dans la
description du skill.

---

## 2. Ce qui vient de la page réelle, verbatim

| Bloc de la maquette | Repris de |
|---|---|
| Surtitre « Open source · MCP · Licence MIT » | Le kicker du hero, `OPEN SOURCE · MCP · MIT` |
| Chapô « 45 skills open-source. Une commande pour les installer. Compatibles Claude Code, Cursor, ChatGPT desktop, et tout client MCP. » | Le sous-titre du hero, mot pour mot |
| La commande `npx -y @cleo-labs/skills-mcp@latest` | `INSTALL_CMD` dans SkillsPageClient.tsx, et vérifiée existante sur npm |
| Titre « 6 verticales. 45 skills. » et son chapô | Section COUVERTURE, mot pour mot |
| Les 6 cartes verticales et leurs contenus (CPNP / EU 1223/2009 / FDA MoCRA / INCI ; FSMA / INCO 1169/2011 / allergènes / nutri-score / EFSA ; CE / FCC / RED / RoHS / REACH / PSE Japan ; EN 71 / CPSIA / ASTM F963 ; fibres / Oeko-Tex ; DGCCRF / FDA DSHEA / novel food) | Le tableau `verticals`, descriptions mot pour mot |
| « Installer. Demander. Livrer. » et les 3 étapes avec leurs libellés et leurs bandes | Le tableau `steps`, mot pour mot |
| « Une question. Une réponse sourcée. » et son paragraphe | Section EN ACTION, mot pour mot (la version servie écrit « Zéro hallucination : », deux-points, pas de cadratin) |
| La question « écouteurs sans fil » et les six puces États-Unis / France (UE) | Le bloc terminal de la page, mot pour mot |
| Les 5 questions/réponses de la FAQ | Extraites du **JSON-LD FAQPage** de la page servie, verbatim (version servie, déjà sans cadratins) |
| « MIT · zéro télémétrie · zéro compte requis » | Le pied du CTA final, mot pour mot |
| « 106 pays » (réponse FAQ 4) | Sur la page ET dans `CANONICAL-FACTS.md`. Conforme au canon. |

---

## 3. Ce que je n'ai PAS repris, et pourquoi

Quatre choses figurent sur la page réelle et ne figurent pas dans la maquette. Aucune n'a été
remplacée par une valeur inventée : la section est écrite sans elle.

**a) Les comptes par verticale : 9 · 8 · 8 · 6 · 7 · 7 skills.**
Mesure contradictoire. Le serveur MCP n'expose qu'un skill `cosmetics-compliance` (deux avec
`professional-cosmetics-compliance`), pas neuf ; un `food-compliance`, pas huit ; un
`toy-compliance`, pas six. La somme tombe juste (45) mais la répartition ne correspond à rien
que je puisse relever. Les six cartes sont donc rendues **sans leur chiffre**, avec à la place le
vrai nom du skill correspondant, qui lui existe. Le titre « 6 verticales. 45 skills. » est gardé
tel quel : c'est un cadrage éditorial que la page assume, et la section « L'inventaire » qui suit
dit explicitement que les six mises en avant ne sont pas la taxonomie complète.

**b) Les quatre noms de skills du bloc terminal :** `electronics-us-fcc`, `electronics-eu-ce-red`,
`electronics-eu-rohs`, `electronics-eu-reach`.
**Aucun des quatre n'existe** dans les 45 que le serveur expose. Le seul skill qui couvre ce
périmètre s'appelle `electronics-compliance`. Je n'ai pas substitué de noms de mon cru (choisir
quels skills un agent appellerait serait une invention), j'ai retiré la ligne « Skills appelés ».
Les six puces réglementaires, elles, sont conservées : elles sont sourcées.
**À corriger sur le vrai site** : ces quatre noms sont faux et publics.

**c) Le pied « 4 skills · 12 sources · 0.6s ».**
Ni le nombre de sources ni la durée ne sont traçables, et le « 4 skills » tombe avec le point b).
Retiré.

**d) « Déjà 250+ téléchargements ».**
Présent sur la page servie (pas encore dans le code du dépôt que j'ai lu). Mesuré à l'instant :
`api.npmjs.org` rend **273 téléchargements** cumulés du 1er janvier au 1er septembre 2026, et
**56 sur les 30 derniers jours**. Le « 250+ » est donc corroboré en cumulé, mais c'est un chiffre
volatil, absent du canon, et dont la fenêtre de comptage n'est pas dite. Non rendu.

**e) Le lien vers `/blog/skills-library-mcp`.**
La maquette n'a pas de page pour cet article : les deux boutons pointent vers `12-article.html`
et `11-blog.html`, les pages du chantier, comme font les autres gabarits.

Aucun compteur canonique (25 000 réglementations, 19 000 autorités) n'est appelé par cette page :
elle ne parle pas du moteur. Le seul canonique présent est « 106 pays », dans la FAQ, à sa valeur.
Le 3 700 sources n'apparaît nulle part, conformément à la consigne.

---

## 4. L'habillage

Moule de la famille Ressources, identique aux deux gabarits de référence :

- Bandeau `section.sur-sombre.gc-deep.section-serree` avec `res-tete` (titre à gauche, chapô à droite),
  puis corps sur `section.section` > `conteneur` > `res-corps` avec `<!--RES-NAV:...-->`.
- Cartes `terme-carte` en `g3`, comme le glossaire.
- Ajouts au bandeau, dans la même encre : la bande de commande et une rangée `g4` de quatre valeurs
  (45 skills · 27 familles de produit · 18 skills de méthode · MIT licence).
- La bande de commande et les trois bandes d'étape passent par la balise `code` du socle, qui porte
  déjà Satoshi et les chiffres tabulaires. Aucune police à chasse fixe.
- Icônes utilisées, toutes présentes dans `commun/icones.js` : `cosmetique`, `alimentaire`,
  `electronique`, `jouets`, `textile`, `laboratoire`, `engrenage`, `research`, `reglementation`.
- Aucune image citée, donc aucune entrée à ajouter dans la table IMAGES de `construire.mjs`.

---

## 5. Les contrôles que j'ai passés

Contrôles de source (script Python sur le fichier) :

1. **Équilibre des balises** sur `div, section, ul, li, p, a, table, blockquote, aside, nav, footer,
   h1, h2, h3, details, summary, code, span, svg` : toutes appariées. PASSE.
2. **Un seul attribut `class` par élément** : aucun élément n'en porte deux. PASSE.
3. **Aucun `font-size` en `style=` inline** : zéro occurrence. Les classes typographiques employées
   sont exactement `t-display, t-h1, t-h2, t-h3, t-body-lg, t-body, t-caption, t-label`, toutes
   dans les huit crans. PASSE.
4. **Aucune grille repliable en `style=` inline** : zéro `display:grid` et zéro
   `grid-template-columns` en inline. Les trois grilles de la page sont `g4`, `g3` et `g2`,
   toutes en classe, toutes déjà pourvues de `minmax(0,1fr)` et de `min-width:0` par le socle. PASSE.
5. **Zéro tiret cadratin, zéro emoji, zéro mention de chasse fixe** dans le fichier. PASSE.
6. **`clamp()`** : la page n'en pose aucun (elle n'a aucune règle de taille propre). Sans objet.
7. **Icônes** : les 9 clés `ico:` employées existent toutes dans `commun/icones.js`. PASSE.
8. **Images** : aucune. Sans objet.
9. **Marqueurs** : le fichier commence par `<!--NAV-->`, contient `<!--CTA-->` puis se termine
   par `<!--PIED-->`, dans cet ordre. PASSE.
10. **Inventaire** : 45 noms de skills distincts comptés dans le fichier. PASSE.

Contrôles de rendu (Playwright depuis `cleo-landing/node_modules`, sur une copie de la page montée
en scratchpad avec `base.css + composants.css + mouvement.css`, sans toucher à `sortie/` ni lancer
`construire.mjs`, `capturer.mjs` ou `verifier.mjs`) :

| Largeur | Débordement horizontal | scrollWidth | Police | Éléments à chasse fixe | Titres vides | `g4` du bandeau | `g3` inventaire | `g2` carte sombre |
|---|---|---|---|---|---|---|---|---|
| 390 px | non | 390 | Satoshi | 0 | 0 | 1 colonne | 1 colonne | 1 colonne |
| 768 px | non | 768 | Satoshi | 0 | 0 | 2 colonnes | 2 colonnes | 2 colonnes |
| 1280 px | non | 1280 | Satoshi | 0 | 0 | 4 colonnes | 3 colonnes | 2 colonnes |
| 1920 px | non | 1920 | Satoshi | 0 | 0 | 4 colonnes | 3 colonnes | 2 colonnes |

Les trois grilles se replient donc bien : c'est le contrôle qui manquait quand le témoignage de
l'accueil restait sur deux colonnes de 140 px.

**Contraste, contrôle de blanc sur blanc** : parcours de tous les nœuds de texte feuille, calcul du
rapport de luminance contre le premier ancêtre à fond opaque. Aucun texte sous 2,5:1 aux quatre
largeurs. La seule surface sombre posée dans une section claire (la carte « en action ») porte
`class="surface-sombre"`, l'encre y bascule bien en blanc : vérifié à l'image, pas seulement au calcul.

**Rendu regardé, pas seulement mesuré** : captures pleine page à 1280 et 390 px, plus deux zooms sur
le trio d'étapes et sur la carte sombre. Un défaut trouvé et corrigé au passage : les bandes de
commande des trois étapes rendaient en pastille en ligne coupée en deux, elles sont passées en bloc.

**Témoin de non-régression sur le bandeau** : le même relevé à 390 px sur `13-glossaire.html`,
`10-ressources.html` et `25-skills.html` rend exactement `res-tete: 157px 157px`, `h1 157x29`,
taille 24 px pour les trois. Ma page hérite du moule de la famille sans en dévier.

---

## 6. Ce qui reste à faire par quelqu'un d'autre

Trois raccords supposent de modifier des fichiers existants, ce que je n'ai pas fait sans PLAN.md
approuvé, et que le brief m'interdisait par ailleurs de lancer :

1. **`construire.mjs`, table `PAGES`** : `25-skills.html` n'y est pas. Tant qu'elle n'y est pas,
   la page n'est pas construite. Ligne à ajouter, sur le modèle des autres :
   `{ fichier: '25-skills.html', titre: 'Skills', source: 'cleolabs.co/fr/skills' },`
2. **`commun/seo.json`** : aucune fiche pour `25-skills.html`. Sans elle le `<title>` tombera sur le
   repli « Cleo — Skills » et il n'y aura ni description ni canonical. Le vrai titre servi est
   « Skills Library | Skills de conformité open-source pour agents IA | Cleo Labs ».
3. **`construire.mjs`, fonction `resNav`** : sa liste de liens est Tout / Rencontres / Modèles /
   Publications / Glossaire. J'ai posé `<!--RES-NAV:Skills-->`, ce qui rend la nav latérale sans
   marquer de lien actif, plutôt que de surligner faussement « Tout ». Ajouter
   `['25-skills.html','Skills']` à la liste rendrait le lien actif.

Et un point pour le vrai site, hors chantier : les quatre noms de skills du bloc terminal de
`/fr/skills` (`electronics-us-fcc`, `electronics-eu-ce-red`, `electronics-eu-rohs`,
`electronics-eu-reach`) n'existent dans aucune des 45 skills publiées. C'est du texte public
qui nomme des choses inexistantes.
