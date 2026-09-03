# Rapport F — l'encre des surfaces sombres + le double attribut class

Agent F. Écrit le 27/08/2026. Trois fichiers assignés, trois fichiers touchés.
Ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs` n'ont été lancés.

## Contrôles préalables (avant toute écriture)

| Vérification demandée | Commande | Résultat |
|---|---|---|
| `.surface-sombre` est libre | `grep -rn 'surface-sombre' commun/ pages/` | **0 occurrence** — nom libre |
| `.carte-sombre` non réutilisé | `grep -rn 'carte-sombre' commun/*.css` | 4 occurrences (composants.css:162,168,742 ; regime-noir.css:139) — **pas touché** |
| `--c-text-on-dark` existe | `grep -n 'c-text-on-dark' commun/base.css` | **base.css:33** `#FFFFFF` |
| `--c-text-on-dark-2` existe | idem | **base.css:34** `rgba(255,255,255,0.64)` |
| `--c-text-on-dark-3` existe | idem | **base.css:35** `rgba(255,255,255,0.38)` |

Les trois jetons existent : la règle a été écrite.

Contrôle supplémentaire, non demandé mais nécessaire avant d'ajouter en fin de
fichier : **la fin de `composants.css` est-elle à l'intérieur d'un `@media` ouvert ?**
La dernière `@media` s'ouvre ligne 733 et se ferme ligne 737 ; le solde d'accolades
sur tout le fichier était de 0 (538 ouvrantes / 538 fermantes). La fin du fichier
est donc bien au niveau racine, la règle ajoutée n'est enfermée dans aucune requête
média. Sans ce contrôle, `.surface-sombre` n'aurait existé qu'en dessous de 1024 px.

## Changements — un par ligne

### `commun/composants.css` (TÂCHE A.1)

```
commun/composants.css:759   (fin de fichier)  ->  +7 lignes ajoutées (760-766)
```

Ajout en fin de fichier, au niveau racine, du commentaire dicté et de la règle :

```css
.surface-sombre{--c-text:var(--c-text-on-dark); --c-text-2:var(--c-text-on-dark-2);
  --c-text-3:var(--c-text-on-dark-3); --c-ink:#FFFFFF; --cleo-ink:#FFFFFF}
```

Aucune ligne existante n'a été modifiée : le `diff` ne rend qu'un `759a760,766`,
c'est-à-dire une pure addition après la dernière ligne.

### `pages/17-modeles.html` (TÂCHES A.2 et F1)

```
pages/17-modeles.html:3   <section class="sur-sombre gc-deep" class="section-serree" style="padding-bottom:var(--s-64)">
                       -> <section class="sur-sombre gc-deep section-serree" style="padding-bottom:var(--s-64)">
pages/17-modeles.html:20  <div class="vignette" style="…"> -> <div class="vignette surface-sombre" style="…">
pages/17-modeles.html:32  <div class="vignette" style="…"> -> <div class="vignette surface-sombre" style="…">
pages/17-modeles.html:44  <div class="vignette" style="…"> -> <div class="vignette surface-sombre" style="…">
pages/17-modeles.html:56  <div class="vignette" style="…"> -> <div class="vignette surface-sombre" style="…">
pages/17-modeles.html:68  <div class="vignette" style="…"> -> <div class="vignette surface-sombre" style="…">
pages/17-modeles.html:80  <div class="vignette" style="…"> -> <div class="vignette surface-sombre" style="…">
```

Le `style=` inline est intact sur les 7 lignes (`…` = le `style` d'origine, repris
octet pour octet — le `diff` intégral ci-dessous le montre).
La classe du second attribut était bien `section-serree` sur cette page : lue, pas
présumée. 6 vignettes attendues, **6 trouvées, 6 corrigées**.

### `pages/00-composants.html` (TÂCHE A.3)

```
pages/00-composants.html:109  <div style="…background:var(--c-field-deep)…">   -> <div class="surface-sombre" style="…">
pages/00-composants.html:112  <div style="…background:var(--c-field-deep-2)…"> -> <div class="surface-sombre" style="…">
```

Les deux pastilles ont été repérées **par leur `background`** (`grep -n 'c-field-deep'`
rend exactement ces deux lignes dans tout le fichier), pas par leur numéro de ligne.
Aucune des deux ne portait d'attribut `class` : la classe a été ajoutée, rien n'a été
remplacé. Rien d'autre n'a été touché dans la planche de composants.

## Vérifié

**1. Comptage de balises, avant / après.**

| Fichier | Lignes | `<div` / `</div>` | `<section` | `class="` |
|---|---|---|---|---|
| `composants.css` | 759 → **766** (+7 = le bloc ajouté) | 0 → 0 | 0 → 0 | 0 → 0 |
| `17-modeles.html` | 105 → **105** (identique) | 44/44 → **44/44** | 2 → **2** | 61 → **60** |
| `00-composants.html` | 403 → **403** (identique) | 205/205 → **205/205** | 7 → **7** | 354 → **356** |

Les deux variations de `class="` sont exactement celles attendues et se lisent :
`-1` sur 17-modeles = la fusion des deux attributs de la ligne 3 en un seul ;
`+2` sur 00-composants = les deux attributs `class` créés de toutes pièces sur les
pastilles. Les `<div>` ouvrants et fermants restent appariés partout — rien n'a été
mangé. Les deux pages ont **exactement le même nombre de lignes qu'avant**.

**2. Le contrôle du double attribut, exigé sur chacun de mes fichiers.**

```
grep -c 'class="[^"]*"[^>]*class="' <fichier>
  pages/17-modeles.html      0   (valait 1 avant)
  pages/00-composants.html   0   (valait 0 avant)
  commun/composants.css      0
```

**3. Diff ligne à ligne contre une copie prise avant édition.**
Copie de sécurité des 3 fichiers faite avant la première écriture, puis `diff`
intégral après. Le diff rend **exactement 9 lignes modifiées et 7 ajoutées, et rien
d'autre** : 1 (section) + 6 (vignettes) + 2 (pastilles) + le bloc CSS. Aucun bloc
déplacé, aucune section tronquée. Copies conservées dans le scratchpad de session,
sous `…/scratchpad/avant/`.

**4. Aucun découpage par index.** Les 9 lignes ont été changées par remplacement de
CHAÎNE EXACTE (les 6 vignettes en un seul remplacement, leur balise étant identique
au caractère près). Le bloc CSS a été ajouté par `cat >>`, donc en pure append :
aucun octet au-dessus de la ligne 759 n'a été relu ni réécrit.

**5. Pas de `clamp()` écrit.** La règle ajoutée n'en contient aucun ; le piège des
espaces autour du `+` ne s'applique pas ici. Vérifié quand même qu'aucune ligne
existante n'a bougé (voir 3).

**6. La chaîne de causalité, lue dans le code (pas dans une capture).**
Cette passe ne serait qu'une classe posée au hasard si personne ne lisait ces jetons.
Vérifié que chaque cible les consomme réellement :

- `commun/composants.css:720` — `.res-carte .vignette .ico{color:var(--c-text-2)}`.
  Les icônes des vignettes lisent bien `--c-text-2`, que la règle bascule.
- `construire.mjs:219` — `icone()` rend `<svg class="ico" … fill="currentColor">`.
  Le marqueur `ico:modeles` devient donc bien un `.ico` : le sélecteur ci-dessus
  atteint sa cible. (Les 6 vignettes contiennent 5 marqueurs `ico:` et un
  `<span class="t-display">US</span>`.)
- `commun/base.css:129` — `.t-display{… color:var(--c-ink)}`. La 6e vignette, celle
  du « US », est donc réparée par `--c-ink:#FFFFFF` de la même règle. C'est ce qui
  justifie d'avoir inclus cette 6e vignette, qui ne contient pourtant pas d'icône.
- `commun/base.css:135` — `.t-caption{… color:var(--c-text-3)}`. Les étiquettes des
  deux pastilles de palette lisent `--c-text-3`, que la règle bascule.
- Ordre de chargement (`construire.mjs:203-208`) : base → regime-noir → composants
  → mouvement. La règle, en fin de `composants.css`, passe donc **après**
  `regime-noir.css`. Elle a la même spécificité (0,1,0) que `.carte-claire`
  (`regime-noir.css:74`) dont elle est le miroir, mais sur des sélecteurs disjoints :
  aucune des deux ne peut se disputer un élément avec l'autre.

**7. Ce que je n'ai PAS vérifié, et qui reste à faire par l'orchestrateur.**
Je n'ai lancé ni `construire.mjs` ni `verifier.mjs` : je n'ai donc **aucune mesure
au pixel après correction**. Tout le point 6 est une vérification par lecture du
code, pas par rendu. Les écarts-types cités dans le commentaire CSS (2,7 pour les
icônes de 17-modeles, 1,8 pour les étiquettes de 00-composants) sont **les mesures
de l'orchestrateur, recopiées telles quelles** dans le commentaire qui m'a été
dicté ; je ne les ai pas reproduites moi-même et je ne les certifie pas.

## Laissé tel quel

- **`pages/00-composants.html:115`, la 3e pastille `.gc-deep`.** Elle est dans le même
  trio et porte les mêmes étiquettes `.t-caption`, mais elle ne pose **aucun**
  `background` — elle s'en remet à la classe `.gc-deep`, qui n'est définie dans
  aucun CSS (`grep -rn 'gc-deep' commun/*.css` : 0 définition ; c'est aussi le
  constat de `PLAN.md`). Elle ne rend donc pas une surface sombre aujourd'hui, et
  ma consigne visait les fonds `--c-field-deep` / `--c-field-deep-2`. Lui poser
  `.surface-sombre` rendrait ses étiquettes blanches sur un fond clair, soit
  exactement le défaut inverse. **Signalé, non corrigé** : le vrai défaut ici est
  la classe morte `.gc-deep`, qui n'est pas dans mon périmètre.
- **`.gc-deep` sur `pages/17-modeles.html:3`.** Conservée dans l'attribut fusionné,
  à sa place et dans l'ordre d'origine, bien qu'elle soit morte elle aussi. La
  fusion ne devait rien retirer.
- **Le reste de `00-composants.html`.** Aucune autre ligne touchée : c'est la planche
  de composants, ses tailles explicites sont voulues.
- **Les autres `.vignette` du dépôt** (`.vignette-ecran`, `commun/vignettes.html`) :
  hors périmètre, non touchées.
- **Les 11 autres pages au double attribut `class`** listées dans `PLAN.md`
  (`10-ressources`, `11-blog`, `12-article`, `13-glossaire`, `14-terme`,
  `15-evenements`, `16-evenement`, `18-recrutement`, `19-poste`, `22-legal`,
  `21-inscription`) : elles ne me sont pas assignées, je n'y ai pas touché.
- **`sortie/`** : pas ouvert, pas modifié. Le rebuild appartient à l'orchestrateur.
