# Agent 06 — `pages/00-composants.html`

Fichier traité : `/Users/naomiehalioua/cleo-maquettes-edge/pages/00-composants.html` (403 lignes)
Périmètre reçu : planche de composants, **`.cta-final` seul**, tout le reste laissé et justifié.

## Changements

*Aucun.* Zéro édition sur ce fichier.

**Raison : le bloc `.cta-final` n'existe pas dans ce fichier.**

`grep -c "cta-final" pages/00-composants.html` → `0`.

La fin de page arrive sur cette planche par un **placeholder**, pas par du HTML écrit ici :

```
383:      <div class="kit-cadre nu"><!--CTA--></div>
```

`<!--CTA-->` est remplacé au build par la constante `CTA` de `construire.mjs`
(`construire.mjs:224` la déclare, `construire.mjs:286` fait le `replace`).
C'est là, et seulement là, que vit le `.cta-final` — avec le font-size fautif :

```
construire.mjs:229      <div class="cta-final">
construire.mjs:232        <h2 class="t-display" style="font-size:clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)">On regarde vos produits ensemble ?</h2>
```

`construire.mjs` est attribué à l'**agent 02** par PLAN.md ligne 87
(`pages/01-accueil.html` + `construire.mjs` (bloc `.cta-final`)). Je n'y touche pas :
c'est un fichier qui ne m'est pas assigné, et deux agents écrivant le même fichier
est exactement le mode de perte à éviter.

**Conséquence pour l'orchestrateur** : dès que l'agent 02 retire ce `font-size` inline,
le `.cta-final` de la planche 00 passe à 32 px tout seul au rebuild, sans qu'une seule
ligne de `pages/00-composants.html` ait bougé. Rien à reprendre ici ensuite.

## Laissé tel quel

Les 12 déclarations `font-size` inline du fichier, toutes hors périmètre.
Motif commun : **PLAN.md § « Ce qu'on ne touche pas », point 3** — la planche de
composants montre volontairement les blocs à leur taille de démonstration, c'est sa
fonction ; seul le `.cta-final` était à corriger.

| Ligne | Déclaration | Élément | Motif de non-touche |
|---|---|---|---|
| 148 | `font-size:0.75rem` | `.regle-flottante` FR, démo « Hero à photo » | Planche de démo (PLAN §3) |
| 148 | `width:20px;height:20px;font-size:0.7rem` | `.drapeau` FR | **Pastille d'icône** : pose `width` + `height` (PLAN §1) |
| 149 | `font-size:0.75rem` | `.regle-flottante` UE | Planche de démo (PLAN §3) |
| 149 | `width:20px;height:20px;font-size:0.7rem` | `.drapeau` UE | **Pastille d'icône** (PLAN §1) |
| 150 | `font-size:0.75rem` | `.regle-flottante` UK | Planche de démo (PLAN §3) |
| 150 | `width:20px;height:20px;font-size:0.7rem` | `.drapeau` UK | **Pastille d'icône** (PLAN §1) |
| 220 | `font-size:0.9rem` | `.sceau .dedans .nom` — REACH | Planche de démo (PLAN §3) |
| 227 | `font-size:0.9rem` | `.sceau .dedans .nom` — PPWR | Planche de démo (PLAN §3) |
| 298 | `font-size:0.875rem` | lien « Lire la définition », carte de terme | Planche de démo (PLAN §3) |
| 301 | `font-size:0.875rem` | lien « Lire la définition », carte de terme | Planche de démo (PLAN §3) |
| 312 | `font-size:1.0625rem` | `.t-h2` de `.ligne-liste` — Side event IPSW | Planche de démo (PLAN §3) |
| 316 | `font-size:1.0625rem` | `.t-h2` de `.ligne-liste` — Juriste | Planche de démo (PLAN §3) |

Deux remarques sans action, pour la passe suivante si Naomie veut la faire :

- Lignes 148-150 : les six `font-size` sont sur le même élément visuel. Les trois
  `.drapeau` sont des pastilles d'icône protégées par PLAN §1 dans **tous** les cas,
  y compris hors planche de démo. Les trois `.regle-flottante` à `0.75rem` rendent
  déjà 12 px, soit exactement `.t-caption` en épure : elles sont sur l'échelle par
  coïncidence, une correction ne changerait aucun pixel.
- Lignes 312 et 316 : `.t-h2` porte un inline `1.0625rem` (17 px) qui écrase la
  classe (18 px). C'est le seul écart de la planche qui n'est pas voulu comme
  démonstration de taille — mais il n'est pas dans mon périmètre (`.cta-final` seul),
  je le signale sans le corriger.

## Vérification

- `grep -o "font-size" pages/00-composants.html | wc -l` → `12` (inchangé, aucune édition)
- `grep -c "cta-final" pages/00-composants.html` → `0`
- Aucune découpe par index de chaîne : aucune écriture du tout.
- Aucun `clamp()` écrit, donc aucun risque d'espace manquant autour du `+`.
- `construire.mjs`, `sortie/`, `commun/*.css`, `commun/vignettes.html` : non ouverts en écriture.

font-size inline restants dans mes fichiers : 12
