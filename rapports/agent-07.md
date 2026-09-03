# Agent 07 — `pages/17-modeles.html`, `pages/16-evenement.html`

Passe « épure » : retrait des `font-size` inline pour rendre la main aux classes
de l'échelle. 12 déclarations retirées, 0 restante. Aucun `.css` touché, aucune
commande de build lancée, `sortie/` intact.

## Changements

### `pages/16-evenement.html` — 6 changements

Les six éléments portaient **déjà** `class="t-h2"`. L'inline `1rem` (16 px)
écrasait la classe (18 px). Règle 2 appliquée : on retire l'inline, on ne pose
rien de plus, la classe reprend la main. Le `style=` devenait vide dans les six
cas, l'attribut est donc supprimé entier (règle 4).

| Ligne | Ancien | Nouveau |
|---|---|---|
| 45 | `<div class="t-h2" style="font-size:1rem">Accueil` | `<div class="t-h2">Accueil` |
| 47 | `<div class="t-h2" style="font-size:1rem">Ce que l'article 19 demande…` | `<div class="t-h2">Ce que l'article 19 demande…` |
| 50 | `<div class="t-h2" style="font-size:1rem">Démonstration : la règle encodée…` | `<div class="t-h2">Démonstration : la règle encodée…` |
| 53 | `<div class="t-h2" style="font-size:1rem">Échanges` | `<div class="t-h2">Échanges` |
| 62 | `<div class="t-h2" style="font-size:1rem">Anaëlle Guez` | `<div class="t-h2">Anaëlle Guez` |
| 66 | `<div class="t-h2" style="font-size:1rem">Naomie Halioua` | `<div class="t-h2">Naomie Halioua` |

Effet rendu : ces six titres passent de 16 px à 18 px, la valeur `.t-h2` de
l'échelle. Ce sont les quatre entrées du programme et les deux intervenantes.

### `pages/17-modeles.html` — 6 changements

| Ligne | Ancien | Nouveau |
|---|---|---|
| 21 | `<span style="font-size:2.5rem">ico:modeles</span>` | `<span>ico:modeles</span>` |
| 33 | `<span style="font-size:2.5rem">ico:etiquette</span>` | `<span>ico:etiquette</span>` |
| 45 | `<span style="font-size:2.5rem">ico:laboratoire</span>` | `<span>ico:laboratoire</span>` |
| 57 | `<span style="font-size:2.5rem">ico:recyclage</span>` | `<span>ico:recyclage</span>` |
| 69 | `<span style="font-size:2.5rem">ico:liste</span>` | `<span>ico:liste</span>` |
| 81 | `<span style="font-size:2.5rem">US</span>` | `<span class="t-display">US</span>` |

## Un écart assumé, à valider par l'orchestrateur

Les cinq spans `ico:` (21, 33, 45, 57, 69) : j'ai retiré le `font-size` **sans
poser `.t-display`**, alors que la correspondance dit `2.5rem → .t-display`.

Raison mesurée, pas supposée. `construire.mjs:285` remplace `ico:<nom>` par
`icone(nom, 20)`, et `construire.mjs:219` produit
`<svg class="ico" width="20" height="20" …>`. Le SVG porte ses attributs
`width`/`height` en dur : **le `font-size` du span n'a aucun effet sur lui**.
Après build ces spans ne contiennent aucun texte, seulement une icône de 20 px
dont la couleur est déjà pilotée par `composants.css:720`
(`.res-carte .vignette .ico{color:var(--c-text-2)}`).

Poser une classe de titre sur un conteneur sans texte n'aurait rien changé au
rendu et aurait sali la sémantique. Les retirer était en revanche nécessaire :
la vérification 1 du PLAN exige que les seules occurrences restantes soient
celles de la liste d'exclusions, et ces spans n'y figurent pas (la liste vise
les `style=` posant `width` **et** `height`, ce qui n'est pas leur forme).

Résultat : 0 occurrence restante, 0 changement visuel sur ces cinq vignettes.
Si tu préfères l'application littérale, une ligne suffit pour ajouter
`class="t-display"` aux cinq.

La sixième (ligne 81, `US`) est du **vrai texte**, pas un marqueur d'icône :
elle reçoit `.t-display` comme prévu. Elle passe de 40 px à 32 px.

## Laissé tel quel

| Où | Quoi | Pourquoi |
|---|---|---|
| `17-modeles` 27, 39, 51, 63, 75, 87 | `class="t-caption" style="color:var(--c-signal);font-weight:600"` | Aucun `font-size`. Le `font-weight:600` ne répète pas celui de `.t-caption`, il le surcharge volontairement pour la mention d'article. Hors périmètre. |
| `17-modeles` 20, 32, 44, 56, 68, 80 | `.vignette` avec `display:grid;place-items:center;background:linear-gradient(…)` | Aucun `font-size`. Mise en page et fond, à conserver. |
| `17-modeles` 24, 36, 48, 60, 72, 84 | `class="etiquette" style="align-self:flex-start"` | Aucun `font-size`. |
| `16-evenement` 44, 46, 49, 52 | `class="t-caption" style="flex:none;width:64px;"` | Aucun `font-size`. Gouttière horaire à largeur fixe, mise en page. |
| `16-evenement` 61, 65 | `<img style="width:56px;height:56px;border-radius:50%;object-fit:cover">` | Aucun `font-size`. Dimensionnement d'avatar. |
| `16-evenement` 71 | `class="t-caption" style="line-height:1.7"` | Aucun `font-size`. `line-height` voulu sur le bloc de citation, conservé (règle 4). |
| `16-evenement` 17-19, 70 | `class="t-label" style="margin-bottom:…"` | Aucun `font-size`, la classe s'applique déjà. |

## Contrôle d'intégrité

Édition par remplacement de chaîne exacte contre chaîne exacte (`perl -pe s///`
avec `\Q…\E`), jamais par calcul d'index. Aucun `clamp()` écrit, donc pas de
piège d'espaces autour du `+`.

- `diff` contre copie de sauvegarde : **exactement 12 lignes modifiées**, toutes
  des changements d'attribut sur place. Aucune ligne ajoutée ni supprimée.
- Nombre de lignes inchangé : `17-modeles` 105, `16-evenement` 82.
- Sauvegardes conservées dans le scratchpad de session.

font-size inline restants dans mes fichiers : 0
