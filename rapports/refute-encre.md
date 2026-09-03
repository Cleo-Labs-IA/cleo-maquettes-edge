# Réfutation adverse — la règle `.surface-sombre`

Lentille : « La règle `.surface-sombre` ajoutée en fin de `commun/composants.css`
rend lisibles les icônes des 6 vignettes de `17-modeles` et les étiquettes des
2 pastilles de palette de `00-composants`, SANS rien casser ailleurs. »

**Verdict : TIENT.** J'ai attaqué la règle par six voies, elle survit aux six.
Deux défauts réels subsistent autour d'elle, mais aucun ne contredit
l'affirmation ; ils sont listés plus bas et l'un est sérieux.

Mesures faites au navigateur (Chromium 1440x900, `reducedMotion: reduce`),
oracle = le pixel, sur les pages construites de `sortie/` (bâties à 11:50:00,
donc postérieures à `commun/composants.css` 11:40:49 et aux deux pages sources).

---

## 1. La règle est-elle bien à la racine ?

Comptage d'accolades après retrait des commentaires :

| fichier | balance | profondeur avant `.surface-sombre` |
|---|---|---|
| `base.css` | 0 | — |
| `composants.css` | 0 | **0** |
| `regime-noir.css` | 0 | — |
| `mouvement.css` | 0 | — |

`commun/composants.css:765` est à la racine. Aucun `@media` resté ouvert.
Le bloc inliné dans `sortie/17-modeles.html:933-939` est **identique au caractère
près** au bloc source (`diff` vide).

## 2. Les jetons existent-ils ?

`base.css:33-35` : `--c-text-on-dark: #FFFFFF`, `--c-text-on-dark-2:
rgba(255,255,255,0.64)`, `--c-text-on-dark-3: rgba(255,255,255,0.38)`.

Résolution vérifiée **sur les éléments eux-mêmes** (`getComputedStyle`), les 8 :
`--c-text: #FFFFFF` · `--c-text-2: rgba(255,255,255,0.64)` ·
`--c-text-3: rgba(255,255,255,0.38)` · `--c-ink: #FFFFFF` · `--cleo-ink: #FFFFFF`.
Aucune déclaration invalidée en silence.

## 3. Mesure au pixel des 6 icônes de `17-modeles`

Écart-type sur la boîte du glyphe seule, capture à 3x, et amplitude min→max :

| glyphe | encre calculée | sd | min→max | amplitude | contraste |
|---|---|---|---|---|---|
| #1 fichier | rgba(255,255,255,.64) | 73,1 | 17→169 | 152 | 8,03:1 |
| #2 étiquette | idem | 73,8 | 17→169 | 152 | 8,03:1 |
| #3 fiole | idem | 70,4 | 17→169 | 152 | 8,03:1 |
| #4 tri | idem | 60,7 | 17→169 | 152 | 8,03:1 |
| #5 liste | idem | 59,1 | 17→169 | 152 | 8,03:1 |
| #6 « US » | `--c-ink` → #FFF | 76,4 | 16→255 | 239 | 19,03:1 |

Bande attendue pour un texte lisible : sd 40 à 90. **Les six y sont.**
Rappel du PLAN : 2,7 et 3,8 avant correctif.

**J'ai regardé l'image** (`encre/g3.png`) : les six pictogrammes sont visibles
sur les six vignettes noires. Stable à 390, 768 et 1440 px de large, et au survol
de `.res-carte` (amplitude 152 dans les quatre cas).

## 4. Mesure au pixel des 4 étiquettes des 2 pastilles de `00-composants`

| étiquette | encre | sd | min→max | amplitude | contraste |
|---|---|---|---|---|---|
| `field-deep` | rgba(255,255,255,.38) | 24,6 | 14→105 | 91 | 3,52:1 |
| `#08093B` | idem | 26,7 | 14→105 | 91 | 3,52:1 |
| `field-deep-2` | idem | 23,7 | 21→110 | 89 | 3,58:1 |
| `#12134F` | idem | 22,1 | 21→110 | 89 | 3,58:1 |

Ici la bande 40-90 n'est **pas** atteinte — et c'est le seul endroit où j'ai
failli conclure « réfuté ». Le témoin l'en empêche : sur la MÊME rangée, la
troisième pastille porte les légendes `gc-deep` / `canvas de dégradé` en encre
sombre sur fond clair, indiscutablement lisibles, et elles mesurent
**sd 20,8 et 29,5, amplitude 112, contraste 3,34:1** — soit *moins* bien que les
étiquettes corrigées. La bande 40-90 vaut pour un glyphe épais sur sa boîte
serrée, pas pour une légende de 13 px. L'oracle valide ici, c'est le témoin,
et il classe les 4 étiquettes corrigées **au-dessus** du standard de légende
déjà accepté sur la page.

**J'ai regardé l'image** (`encre/trio0.png`) : les quatre étiquettes se lisent.
Rappel du PLAN : 1,8 · 2,0 · 2,7 · 2,8 avant correctif.

## 5. « Sans rien casser ailleurs » — test de bascule sur les 25 pages

Pour chaque page : capture pleine page, puis suppression de la règle
`.surface-sombre` du CSSOM (`deleteRule`), puis seconde capture, puis diff
pixel à pixel (seuil 3 niveaux de gris).

| pages | pixels changés par la règle |
|---|---|
| 22 pages (dont `01-accueil-noir`) | **0** |
| `index.html` | 0 règle présente, 0 |
| `17-modeles` | 1 185 px, zone unique 547x481 = la grille des 6 vignettes |
| `00-composants` | 1 041 px, **une seule bande, y 5938→5966** = la ligne des 4 étiquettes |

Deux pièges écartés en route :
- Les captures pleine page de `00-composants` et `03-offre` changeaient de
  hauteur entre les deux prises. **Témoin** : `03-offre` ne contient aucun
  `.surface-sombre`, et son diff « avec règle vs sans règle » (396 px) est
  **exactement identique** à son diff « avec règle vs avec règle » (396 px,
  même zone). C'est du bruit d'animation, pas la règle.
- Sur `00-composants`, la boîte englobante du diff faisait 3 580 px de haut :
  en regroupant les lignes en bandes, deux micro-bandes de 11 et 8 px
  (« Jean droit enfant », « Référence DNM-4412 ») sont du même bruit — mesuré
  à 19 px dans le témoin sans modification. Reste **une** bande réelle, 29 px.

Portée statique cohérente : la classe est portée par 8 éléments et 8 seulement
(6 dans `17-modeles`, 2 dans `00-composants`, sources et sortie concordantes) ;
aucun sélecteur d'attribut `[class*=…]` dans le projet ; aucune occurrence de
`surface-sombre` dans les `.mjs`.

## 6. Collision de noms et régime noir

- `.carte-sombre` (`composants.css:162,168,742`, `regime-noir.css:139`) et
  `.sur-sombre` sont des classes **distinctes** : la correspondance CSS est
  exacte, aucun sélecteur partiel n'existe dans le projet, et aucun des 8
  éléments ne porte deux de ces classes. Pas de collision.
- `regime-noir.css` n'est inliné que dans `sortie/01-accueil-noir.html`
  (unique page contenant `#121212`). Elle ne redéfinit **pas**
  `--c-text-on-dark*` : la règle y produirait de l'encre blanche, correcte sur
  fond sombre. Question sans objet de toute façon : **0 élément** y porte la
  classe, et le test de bascule y mesure **0 pixel** de différence.
- La règle est le miroir exact de `regime-noir.css:74-75` (`.carte-claire`),
  y compris la constante `#FFFFFF` en dur pour `--c-ink` / `--cleo-ink` — là-bas
  c'est `#0A0A0A` en dur. Convention respectée.

## 7. Balayage résiduel : reste-t-il de l'encre invisible ?

a) Balayage par jeton sur 24 pages (contraste calculé, seuil 2:1) : **40 cas
signalés, 40 faux positifs** vérifiés au pixel (amplitudes 41 à 247). Le calcul
par jeton est aveugle aux `background-image` en dégradé — il a même signalé le
« US » de la vignette #6 à 1,06:1 alors qu'il mesure 19,03:1. Ce balayage ne
vaut rien seul.

b) Balayage au pixel de **toutes** les feuilles textuelles des 2 pages de la
lentille (98 sur `17-modeles`, 403 sur `00-composants`), seuil amplitude < 25 :
- `17-modeles` : **0 cas**.
- `00-composants` : 1 cas, `.reponse` « Sur une règle encodée… », amplitude 0 —
  c'est un `<details>` replié, texte non peint. Faux positif.

Aucune encre invisible ne subsiste sur les deux pages corrigées, et la
correction n'en a créé aucune.

---

## Les failles réelles, du plus grave au moins grave

### F-a. La correction rend lisible une valeur FAUSSE
`sortie/00-composants.html:1548` et `:1551`. Les étiquettes annoncent
`#08093B` et `#12134F`. Le fond réellement peint mesure **rgb(15,14,13) =
#0F0E0D** et **rgb(22,21,20) = #161514** — ce sont les valeurs de
`commun/base.css:25-26` (« le noir chaud de harvey.ai »). La page qui documente
le design system affiche donc deux codes hexadécimaux qui ne sont plus ceux des
jetons. Avant le correctif l'erreur était invisible ; elle est maintenant
affichée en clair sur la page de référence. À corriger dans le même geste :
soit l'étiquette suit le jeton, soit le jeton revient au V5.

### F-b. Le correctif est posé à la main, il ne couvre pas la famille
Dans la même rangée `.kit-trio`, la troisième pastille porte `.gc-deep` —
classe **définie nulle part** dans les CSS (le PLAN le note déjà) — et ne porte
pas `.surface-sombre`. Elle rend aujourd'hui en clair (moyenne 247,8) alors
qu'elle est légendée « canvas de dégradé ». Le jour où `.gc-deep` sera définie
en sombre, ses deux légendes redeviendront invisibles, sans que rien ne le
signale. La règle corrige 8 éléments nommés, pas une règle de composition.

### F-c. Les 4 étiquettes restent sous le seuil AA
3,52 et 3,58:1 pour du texte de 13 px (AA exige 4,5:1). Ce n'est pas une
régression — la légende témoin de la même page est à 3,34:1, c'est le standard
maison — mais si l'accessibilité entre dans le cahier des charges, les
étiquettes de pastille sont sous le seuil des deux côtés, clair comme sombre.

### F-d. La bordure des pastilles est invisible sur le sombre
`border:1px solid var(--c-border)` = `rgba(0,0,0,0.08)` sur un fond à 15/255.
La règle ne rebascule que l'encre, pas `--c-border` (là où `regime-noir.css` le
fait au `:root`). Défaut préexistant, non aggravé, mais c'est le même angle mort
et il aurait pu être fermé par la même ligne.

## Faux positifs écartés

1. « La règle est enfermée dans un `@media` » — profondeur d'accolades **0**
   avant `.surface-sombre`, les 4 CSS balancés à 0.
2. « Les jetons `--c-text-on-dark*` n'existent pas » — `base.css:33-35`, et
   valeurs résolues confirmées sur les 8 éléments.
3. « Collision avec `.carte-sombre` » — noms distincts, aucun sélecteur
   d'attribut dans le projet, aucun élément ne porte les deux.
4. « `01-accueil-noir` est abîmée » — 0 élément porteur, **0 pixel** de
   différence au test de bascule.
5. « `00-composants` et `03-offre` changent au-delà des éléments visés » — la
   hauteur variable et les 396/19 px de diff sont du bruit de capture :
   `03-offre`, qui ne porte pas la classe, mesure le **même** diff avec et sans
   la règle.
6. « 40 textes sous 2:1 dans le projet » — balayage par jeton, 40/40 faux
   positifs au pixel (dont le « US » corrigé, mesuré à 19:1 alors que le calcul
   annonçait 1,06:1). Aveugle aux dégradés, comme prévu.
7. « Un texte invisible subsiste sur `00-composants` » — `<details>` replié.
8. « L'écart-type des étiquettes (22-27) est sous la bande 40-90, donc illisible »
   — le témoin lisible de la même rangée mesure 20,8-29,5. La bande ne
   s'applique pas à une légende de 13 px dans une boîte large.

## Ce que je n'ai pas pu tester

L'impression (`@media print`), et le rendu sur un écran non calibré. Les
mesures ci-dessus sont en sRGB, Chromium, sans profil.

---

Scripts jetables et captures :
`/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-refute/encre/`
(`toggle.mjs` bascule 25 pages, `toggle2.mjs` témoin de bruit, `loc.mjs`
localisation des bandes, `sweep.mjs` balayage pixel, `residuel.mjs` balayage par
jeton, `g3.png` et `trio0.png` les deux rendus regardés).
