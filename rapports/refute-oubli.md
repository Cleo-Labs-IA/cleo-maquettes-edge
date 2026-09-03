# Réfutation — lentille « ce qui a été oublié »

Vérificateur adverse, 27/08/2026. Lecture seule sur `pages/`, `commun/`, `sortie/`, les `.mjs`.
Scripts jetables dans `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-refute/`.
`construire.mjs`, `capturer.mjs`, `verifier.mjs` n'ont pas été lancés.

**Verdict : PARTIEL.** Les quatre correctifs tiennent, un par un, sous attaque directe.
Aucun ne couvre sa famille. Il reste 31 usages de la même famille que `.gc-deep`,
un mot-symbole illisible du même genre que F2, et le kit de composants documente
trois couleurs qu'il ne peint pas.

---

## L'oracle utilisé

Le pixel, jamais le jeton. Toutes les mesures ci-dessous viennent d'un rendu
Chromium (1440 × 1100, dSF 2 ou 3), page défilée d'abord pour déclencher
l'IntersectionObserver, `reducedMotion: reduce`, barre de nav mise en
`visibility:hidden` (le `position:sticky` garde sa place dans le flux, la mise
en page ne bouge pas). Les contrastes sont des ratios WCAG calculés sur les
pixels réellement peints, pas sur `getComputedStyle`.

**Ma première sonde était fausse et je l'ai jetée.** `page.screenshot({clip})`
prend des coordonnées DOCUMENT, pas fenêtre : 175 « textes invisibles » à
écart 0,0 dont pas un seul ne l'était. Deuxième erreur : ne forcer que
`[data-anim]` en opacité 1 laisse `[data-anim-groupe] > *` à 0
(`mouvement.css:38`) — 18 faux positifs de plus. La version qui compte défile
la page comme `capturer.mjs`, puis mesure.

---

# GRAVE

## 1. Le canvas de dégradé n'existe plus. 31 usages, 24 pages sur 24.

`.gc-deep` (15 usages) et `.gc-doux` (16 usages) ne sont définis dans **aucun**
des quatre CSS actifs. **Les 24 pages construites en portent au moins un.**

Mesuré au DOM, en parcourant `document.styleSheets` de chaque page :

| classe | usages | pages | définie ? |
|---|---|---|---|
| `.gc-doux` | 16 | 14 | non |
| `.gc-deep` | 15 | 14 | non |

Mesuré au pixel :

- `sortie/10-ressources.html`, `.sur-sombre.gc-deep` → `background-image: none`,
  fond plat `rgb(15,14,13)`, σ = 16,27.
- `sortie/09-texte.html`, `.section.gc-doux` → `background-image: none`,
  fond plat `rgb(249,248,246)`, σ = 13,26.

Les définitions existent encore, dans le fichier remplacé :
`commun/composants-noir.css.sauvegarde:360` (`.gc-deep`, trois ellipses radiales),
`:367` (`.gc-deep-doux`), `:428` (`.sur-sombre.gc-doux`). Elles n'ont pas été
reportées dans `commun/composants.css`. **Je ne propose aucune définition** —
je dis seulement ce qui manque et où il se trouvait.

### Le symptôme le plus visible : la pastille vide du kit

`pages/00-composants.html:115` — dans le trio « Champs et canvas », la troisième
pastille porte `class="gc-deep"` et **aucun fond**.

```
bloc « Champs et canvas », mesuré au pixel :
  pastille 1  .surface-sombre  étiquette « field-deep »    → peinte #0F0E0D
  pastille 2  .surface-sombre  étiquette « field-deep-2 »  → peinte #161514
  pastille 3  .gc-deep         étiquette « canvas de dégradé » → peinte #F9F8F6
                               background-color: rgba(0,0,0,0), σ = 8,47
```

La page qui sert de référence au design system montre une boîte blanche vide
sous le mot « canvas de dégradé ». La passe F3 a posé `.surface-sombre` sur les
deux pastilles voisines et a laissé celle-ci de côté.

## 2. Le kit annonce trois couleurs qu'il ne peint pas.

Même bloc, mêmes deux pastilles que F3 vient de corriger :

| ligne | étiquette écrite | pixel mesuré | écart |
|---|---|---|---|
| `pages/00-composants.html:110` | `#08093B` | **`#0F0E0D`** | bleu profond → noir chaud |
| `pages/00-composants.html:113` | `#12134F` | **`#161514`** | bleu profond → noir chaud |
| `pages/00-composants.html:116` | « canvas de dégradé » | **`#F9F8F6`** | rien de peint |

Les jetons valent bien ce que le pixel montre :
`commun/base.css:25` `--c-field-deep: #0F0E0D; /* le noir chaud de harvey.ai */`
et `:26` `--c-field-deep-2: #161514`. Ce sont les **étiquettes** qui sont restées
sur l'ancienne palette bleue. Trois pastilles sur trois sont fausses dans le seul
document dont le métier est de dire la vérité sur la palette.

Je ne tranche pas dans quel sens corriger.

## 3. Le mot-symbole illisible sur la nav du régime noir. Contraste 1,97.

Même famille que F2, fond opposé, mécanisme différent — et cette fois le
correctif écrit dans le markup **ne s'applique pas du tout**.

`commun/bandeau-nav.html:4` écrit `filter:brightness(0) invert(1)` en ligne.
`commun/composants.css:56` écrit :

```css
.nav-logo img{filter:none !important}
```

Le `!important` bat le style en ligne. Mesuré, `getComputedStyle(...).filter`
vaut `none` sur les 24 pages.

| page | encre du logo | fond de la barre | contraste WCAG |
|---|---|---|---|
| `01-accueil-noir.html` | `rgb(14,42,215)` | `rgb(24,24,24)` | **1,97** |
| les 22 pages claires | `rgb(16,43,214)` | `rgb(253,252,251)` | 8,76 |

Sur la barre sombre, le mot « cleo » ne tient que par sa teinte : en luminance
il est à 1,97 pour 1 du fond. J'ai regardé l'image — le bleu se lit encore, mais
c'est de la couleur seule, exactement ce qu'un contrôle de contraste refuse.

**Ce défaut est structurellement invisible à `verifier.mjs`** : son contrôle
d'encre écarte tout élément sous un ancêtre `sticky`/`fixed` (`verifier.mjs:163`,
la nav est `position:sticky`) et ne regarde que des nœuds de texte de plus de
12 caractères (`:152`) — jamais une image.

## 4. Trois tuiles fantômes du 26 août traînent dans `captures/`.

`capturer.mjs` écrit les tuiles 1…n et **n'efface jamais la n+1**. Quand une page
raccourcit, la dernière tuile de la construction précédente survit et se lit
comme si elle était d'aujourd'hui.

| fichier | date | hauteur |
|---|---|---|
| `captures/01-accueil-5.png` | **26/08 12:20:46** | 820 × 199 |
| `captures/04-secteur-4.png` | **26/08 14:24:04** | 820 × 253 |
| `captures/05-marche-4.png` | **26/08 14:24:08** | 820 × 31 |

Leurs voisines datent toutes du 27/08 11:45–11:46. J'ai ouvert
`04-secteur-4.png` : elle montre un **pied de page sombre** — le régime noir
d'avant-hier. Le pied de `04-secteur` est clair aujourd'hui.

Contrôle de hauteur, page re-rendue à 1280 contre la somme des tuiles :

```
01-accueil    page  8595 px   tuiles ≈ 8909 px   5 tuiles pour 4 attendues
04-secteur    page  7457 px   tuiles ≈ 7854 px   4 tuiles pour 3 attendues
05-marche     page  7260 px   tuiles ≈ 7310 px   4 tuiles pour 3 attendues
les 21 autres                 écart ≤ 4 px       compte juste
```

---

# MOYEN

## 5. Quatre autres classes posées et jamais définies.

Relevé au DOM sur les 24 pages construites, `styleSheets` contre `classList` :

| classe | usages | pages | où elle était définie |
|---|---|---|---|
| `.mega-large` | 44 | 22 | **nulle part, jamais** — pas même dans les `.sauvegarde` |
| `.coches-encre` | 9 | 3 | `composants-v4.css.sauvegarde:60` |
| `.sur-clair` | 7 | 4 | `composants-noir.css.sauvegarde:46` |
| `.carte-claire` | 1 | 1 | `regime-noir.css:74`, non chargé sur cette page |

Ce que chacune coûte, mesuré :

- **`.mega-large`** (`commun/bandeau-nav.html:34` et `:71`) : rien. `.mega` fait
  déjà 1360 px de gouttière à gouttière ; les méga-menus « Textes » et
  « Secteurs » mesurent 1360 px comme les quatre autres, `scrollWidth == clientWidth`,
  aucun débordement. C'est la sœur non implémentée de `.mega-etroit`, qui, elle,
  existe et fonctionne (250 px, mesuré).
- **`.coches-encre`** (`04-secteur:80,94,108`, `05-marche:83,97,111`,
  `09-texte:80,94,108`) : rien. `.coches .coche{background:var(--c-ink)}`
  (`composants.css:154`) fait déjà le travail. σ mesuré 37,78 sur les trois pages.
- **`.sur-clair`** (`01-accueil:66`, `02-entreprise:9`, `06-cas-client:8,80,90,108`) :
  rien, et c'est une chance. La cascade `.sur-sombre .surtitre` (`composants.css:33`)
  couvre déjà les cas sur fond sombre — mesuré, `02-entreprise` blanc 0,38 sur
  `rgb(15,14,13)`, σ 15,93. Si la définition perdue revenait telle quelle
  (`color:var(--c-text-on-dark-3)`), elle rendrait **illisibles** les deux surtitres
  posés sur carte blanche (`01-accueil:66`, `06-cas-client:80`). À ne pas restaurer
  sans mesurer.
- **`.carte-claire`** (`01-accueil.html:102`) : rien. Les deux enfants portent
  `color:` en ligne ; σ mesuré 41,58 sur fond blanc.

## 6. La dérive va dans les deux sens : 42 classes définies et jamais posées.

Symétrique du point 5, relevé sur les mêmes 24 pages : **306 classes définies,
269 posées, 42 définies et posées sur zéro élément.**

Les plus parlantes :

- **`.pile-regles`** : toute son animation vit dans `mouvement.css:71-77`
  (cascade de 5 délais), et la classe n'est posée nulle part. Le jeton `--decal`
  qu'elle lit (`mouvement.css:72`) n'est défini nulle part non plus — sauvé par
  son repli `var(--decal, 0)`. Bloc entièrement mort.
- **`.field-deep`, `.field-deep-2`, `.field-pale`, `.field-full`** : définies
  (`base.css:140-142`), jamais posées. Le markup dit `.sur-sombre` et
  `.sur-clair-fond`. C'est la même dérive que le point 1, vue de l'autre côté :
  le vocabulaire des champs ne coïncide plus dans un sens ni dans l'autre.
- **`.carte-sombre`** : définie (`composants.css:162,168,742`), posée sur
  **0 élément**. `PLAN.md` écrit « `.carte-sombre` EXISTE DÉJÀ […] Réutiliser ce
  nom casserait toutes les cartes ». Mesuré : aucune carte n'aurait cassé.
  La décision de ne pas s'en servir peut rester bonne ; la raison donnée est fausse.
- **`.btn-primaire`, `.tag`, `.badge`, `.escalier`, `.verre`, `.globe`,
  `.vignette-ecran`** et les 11 `.vv-*` : définies, jamais posées.

## 7. Le fragment `commun/vignettes.html` n'est jamais injecté.

`construire.mjs:245-247` remplace `<!--ECRAN-CHAT-VIGNETTE-->`,
`<!--ECRAN-ARBRE-VIGNETTE-->` et `<!--VEILLE-VIGNETTE-->`. Compté sur `pages/` :
**0 occurrence des trois marqueurs.** Les trois vignettes du fichier
(`chat`, `arbre`, `veille`) sont lues, découpées, stockées dans `VIGNETTES`, et
jetées. C'est ce qui explique les 11 `.vv-*` et `.vignette-ecran` du point 6.

## 8. L'index n'ouvre ni le kit ni la variante noire.

`index.mjs` liste 22 pages ; `00-composants.html` et `01-accueil-noir.html` n'y
sont pas. La barre de maquettes construite par `construire.mjs:272` les liste,
elle, toutes les deux. La porte d'entrée du livrable ne mène pas au kit de
composants.

`sortie/index.html` date de 11:46:53, la dernière construction de 11:50:00 : ses
22 vignettes viennent de la construction précédente. Sans conséquence mesurable
ici (les sources des 22 pages indexées sont antérieures à 11:45:08), mais l'ordre
`construire → capturer → index` n'a pas été rejoué en entier après la dernière
retouche de `00-composants` (11:49:50).

## 9. Le composant de veille porte des jetons qui n'existent pas ici.

Relevé sur `00-composants.html` et `03-offre.html`, les deux pages qui portent
`<!--VEILLE-->` : `--c-blue-med`, `--mono`, `--sh-md`, `--sh-lg` sont référencés
et jamais définis. Tous ont un repli dans la feuille portée, donc rien ne casse —
mais le composant ne rend pas les valeurs du site d'origine.

À noter : `construire.mjs:194` remplace les *usages* de `var(--cv-mono)` par
`var(--font)`, et laisse la *déclaration* `--cv-mono:var(--mono,ui-monospace,…)`.
Le garde-fou `font-family:…monospace` de `construire.mjs:365` ne peut pas la voir,
ce n'est pas une `font-family`. **Sans conséquence mesurée** : j'ai relevé la
`font-family` calculée de chaque élément textuel des 25 pages, **0 monospace**.

---

# LE TROU DE LA GRILLE

## Ce que `construire.mjs` ne peut structurellement pas voir

Il contrôle : marqueurs `img:`/`ico:` non résolus, présence de Satoshi, police
externe, fragments `<!--NAV-->`/`<!--PIED-->` non injectés, équilibre de balises
sur `div/section/ul/table/aside/p`, fragment de balise orphelin, `monospace` en
`font-family`, un seul `found` par grille, `clamp()` sans espace autour du `+`.

Il ne regarde **aucun attribut**. Le double `class` était de cette famille ;
voici les autres, que j'ai mesurées faute de contrôle :

| ce qui n'est pas contrôlé | mesuré aujourd'hui |
|---|---|
| attribut dupliqué sur une balise | **0** (tokeniseur respectant les guillemets, `pages/` + `commun/` + `sortie/`) |
| classe posée / jamais définie | **6 classes, 92 usages** |
| classe définie / jamais posée | **42** |
| `var(--jeton)` jamais défini | 5, tous avec repli |
| `href=""` | 0 |
| `<img>` sans `alt` | 0 |
| `id` dupliqué | 0 |
| `aria-labelledby/describedby/controls` pointant dans le vide | 0 |
| lien interne vers un fichier absent | 0 |
| équilibre des 50 autres balises (`a`, `span`, `h1-h6`, `li`, `svg`, `td`…) | 0 déséquilibre |
| débordement horizontal à 1440/1280/1024/768/390 | 0 |
| erreur JavaScript console | 0 |
| nombre de `<h1>` par page | 1 partout |

## Ce que le contrôle d'encre de `verifier.mjs` ne voit pas : 39 % des textes

Trois filtres se cumulent (`verifier.mjs:148-158`) :

```
plafond de 200 éléments par page      (:150)
nœud de texte de plus de 12 caractères (:152)
aucun ancêtre sticky ou fixed          (:163)
```

Compté sur les 25 pages :

```
3 167 textes candidats
1 189 écartés parce que ≤ 12 caractères
   50 écartés parce que sous un ancêtre sticky/fixed
    0 perdus par le plafond — mais 00-composants tape 199 sur 200
─────
couverture réelle : 60,9 %
```

Les 1 189 écartés sont exactement la petite typo où une encre fautive passe le
plus facilement : « Rediffusion », « À venir », « 19 000 », « FR », « Droit »,
« 106 pays », les pilules, les étiquettes, les valeurs de chiffres, et les
trois étiquettes de pastille du point 2. Le point 3 tombe dans les deux autres
filtres à la fois.

---

# FAUX POSITIFS ÉCARTÉS

Ce que j'ai attaqué et qui a tenu.

- **F1, le double `class` : réfutation échouée.** Tokeniseur d'attributs
  respectant les guillemets, sur `pages/` + `commun/` + `sortie/` :
  **0 attribut dupliqué**. Seul attribut inconnu relevé : `focusable` sur deux
  `<svg>` — attribut légitime.
- **F2 : tient.** `20-campagne.html`, mot-symbole en `filter:brightness(0)`,
  encre `rgb(1,1,1)` sur `rgb(249,248,246)`, **contraste 19,67**. Les 22 logos
  de pied sont à 19,12.
- **F3 : tient.** Les 6 vignettes de `17-modeles` portent `.surface-sombre`,
  icônes en `rgba(255,255,255,0.64)`, σ de **12,83 à 24,12** — contre 2,7 et 3,8
  avant.
- **F4 : tient.** Balayage `à préciser | à définir | à compléter | lorem | TODO |
  TBD | xxx | placeholder | dummy` sur `pages/` et `commun/` : **0 texte de
  remplissage**. Les « À venir » restants sont du contenu réel (événements
  à venir), les `placeholder=` sont des attributs de formulaire légitimes.
- **Aucun texte invisible sur les 24 pages.** Sonde au pixel sur 2 600 feuilles
  de texte : les seuls σ < 5 sont (a) des réponses de FAQ dans un `<details>`
  fermé — vérifié `open === false`, 5 fermés / 1 ouvert par page — et (b) les
  `.mass-ref.alt` à `rgba(0,0,0,0.13)`, que le §18 veut atténuées.
- **`.signature-cleo .wordmark`, contraste 1,17 sur 22 pages** : `opacity:0.07`
  écrit à `composants.css:436`. Filigrane voulu, pas un défaut.
- **Les 1 058 `href="#"`** (≈ 45 par page) : convention de maquette. Les liens
  qui doivent mener quelque part y mènent — 0 lien interne mort.
- **Les chiffres ne se contredisent pas.** 106 pays ×15, 2 812 règles ×15 et
  2 812 obligations ×7, 43 juridictions ×10, 19 000 autorités ×3, 25 000
  réglementations, 3 700 sources. `01-accueil:191` donne 2 341 + 471 = 2 812,
  ça tombe juste. Chaque page qui avance un chiffre le date : « Comptage du
  26 août 2026 sur les dépôts de règles Cleo ». `verifier.mjs:42-47` compare
  déjà au fichier canonique et refuse les chiffres hors canon.
- **`--decal` jamais défini** : repli `var(--decal, 0)` écrit à `mouvement.css:72`,
  et la classe `.pile-regles` n'est de toute façon posée nulle part.
- **`--cv-len` jamais défini en CSS** : posé à l'exécution par
  `veilleScript.ts:102`.
- **`.mega{display:none}`** : à l'intérieur de `@media (max-width:1024px)`
  (`composants.css:98`). Règle mobile, pas un menu mort.
- **Les 98 captures antérieures à la construction de 11:50** : fausse alerte.
  Les sources de page datent au plus tard de 11:45:08, la campagne de capture de
  11:45:42 à 11:46:53. Seules les trois tuiles du point 4 sont vraiment du 26/08.
- **`capturer.mjs` ne défile pas avant de capturer** : faux, il défile
  (`capturer.mjs:24-27`). C'est ma propre sonde qui ne le faisait pas.

---

# Rangé par gravité

1. `.gc-deep` / `.gc-doux` non définis — 31 usages, 24 pages sur 24, et une
   pastille vide sur la page de référence du kit.
2. Le kit annonce `#08093B` et `#12134F` là où il peint `#0F0E0D` et `#161514`.
3. Mot-symbole à contraste 1,97 sur la nav de `01-accueil-noir` — `!important`
   qui écrase le style en ligne.
4. Trois tuiles de capture du 26/08 encore dans `captures/`, dont une qui montre
   un pied de page qui n'existe plus.
5. `.mega-large` ×44, `.coches-encre` ×9, `.sur-clair` ×7, `.carte-claire` ×1 —
   posées, jamais définies. Coût visuel mesuré : nul, mais `.sur-clair` est un
   piège si on la restaure telle quelle.
6. 42 classes définies et jamais posées, dont `.pile-regles` et tout son moteur
   d'animation.
7. `commun/vignettes.html` jamais injecté.
8. L'index n'ouvre ni `00-composants` ni `01-accueil-noir`.
9. Jetons de la veille sans définition locale ; déclaration `--cv-mono` monospace
   résiduelle, sans effet mesuré.

Rien n'a été corrigé. Aucun fichier du chantier n'a été modifié.
