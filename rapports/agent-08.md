# Agent 08 — retrait des font-size inline

Fichiers traités :
- `/Users/naomiehalioua/cleo-maquettes-edge/pages/05-marche.html`
- `/Users/naomiehalioua/cleo-maquettes-edge/pages/06-cas-client.html`

8 `font-size` inline repérés au grep, 8 retirés. Aucune classe d'échelle n'a eu
besoin d'être ajoutée : les 8 éléments portaient déjà une classe de l'échelle
(règle 2 — la classe reprend la main). Aucun `font-weight` inline en doublon sur
ces éléments. Éditions faites en remplacement de chaîne exacte, jamais par index.

## Changements

| # | fichier:ligne | ancien | nouveau |
|---|---|---|---|
| 1 | pages/05-marche.html:12 | `<h1 class="t-hero" style="font-size:clamp(2rem, 1.3rem + 2.6vw, 2.875rem);">` | `<h1 class="t-hero">` (style vidé → attribut supprimé) |
| 2 | pages/05-marche.html:33 | `<h2 class="t-h1" style="font-size:1.75rem;margin-bottom:22px">` | `<h2 class="t-h1" style="margin-bottom:22px">` |
| 3 | pages/05-marche.html:81 | `<h3 class="t-h1" style="margin:18px 0 14px;font-size:clamp(1.375rem, 1.1rem + 1vw, 1.875rem)">` | `<h3 class="t-h1" style="margin:18px 0 14px">` |
| 4 | pages/05-marche.html:95 | idem ligne 81 | `<h3 class="t-h1" style="margin:18px 0 14px">` |
| 5 | pages/05-marche.html:109 | idem ligne 81 | `<h3 class="t-h1" style="margin:18px 0 14px">` |
| 6 | pages/05-marche.html:217 | `<h2 class="t-display" style="font-size:clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)">` | `<h2 class="t-display">` (style vidé → attribut supprimé) |
| 7 | pages/06-cas-client.html:9 | `<h1 class="t-hero" style="font-size:clamp(2rem, 1.3rem + 2.4vw, 2.75rem);">` | `<h1 class="t-hero">` (style vidé → attribut supprimé) |
| 8 | pages/06-cas-client.html:142 | `<h2 class="t-display" style="font-size:clamp(1.75rem, 1.2rem + 1.8vw, 2.5rem)">` | `<h2 class="t-display">` (style vidé → attribut supprimé) |

Détail des deux cas où la classe présente ne correspond pas à la valeur inline
retirée, et où la règle 2 tranche en faveur de la classe :

- 05-marche.html:33 — inline 1.75rem (28 px, correspondance `.t-display`), classe
  présente `.t-h1`. La classe `.t-h1` est conservée telle quelle, rien n'est
  ajouté : le titre du formulaire passe donc de 28 px à 24 px, conformément à
  l'échelle.
- 05-marche.html:81 / 95 / 109 — inline `clamp(1.375rem, 1.1rem + 1vw, 1.875rem)`
  (28 px, correspondance `.t-display`), classe présente `.t-h1`. Même arbitrage :
  les trois titres de section alternée passent à 24 px.

Aucun clamp() n'a été écrit, uniquement supprimé (piège des espaces autour du `+`
non concerné).

## Laissé tel quel

- **pages/06-cas-client.html:26** — `style="width:100px;height:100px;border-radius:50%;object-fit:cover"`
  sur le portrait de Philippine. Pose width **et** height, et de toute façon aucun
  `font-size` : hors périmètre.
- **pages/06-cas-client.html:123** — `style="width:32px;height:32px;border-radius:50%;background:var(--accent);display:grid;place-items:center;flex:none"`
  sur la pastille d'icône `ico:publications`. Pastille d'icône (width + height),
  interdiction explicite d'y toucher ; elle ne porte pas de `font-size` de toute façon.
- **pages/05-marche.html:204** — `<div class="t-sm" style="font-weight:600">Philippine Tamic</div>`.
  `font-weight` inline sans `font-size` inline : la règle 5 ne s'applique qu'en
  accompagnement d'un `font-size` retiré. Laissé intact.
- **pages/05-marche.html:56** — `<div class="centre t-micro" style="letter-spacing:0.12em;text-transform:uppercase;margin-bottom:24px;">`.
  Pas de `font-size`, uniquement du letter-spacing/transform voulus. Non touché.
- **pages/06-cas-client.html:66 et 72** — `class="t-micro" style="line-height:1.65"` /
  `style="color:var(--c-field-pale);line-height:1.6"`. Pas de `font-size` inline,
  line-height et couleur volontaires. Non touchés.
- Classes hors échelle rencontrées (`t-lead`, `t-sm`, `t-micro`, `citation`,
  `etiquette`, `surtitre`) : aucune ne portait de `font-size` inline, donc rien à
  faire. Je ne les ai pas renommées vers l'échelle canonique, ce n'était pas la
  mission.
- Aucun `.css` de `commun/`, ni `commun/vignettes.html`, ni `sortie/` n'a été ouvert
  en écriture. `construire.mjs`, `capturer.mjs` et `verifier.mjs` n'ont pas été lancés.

## Contrôle

Vérification après édition :
`grep -nEi "font[ ]*-[ ]*size" pages/05-marche.html pages/06-cas-client.html` → 0 résultat.
Aucun `style=""` résiduel. Longueurs de fichiers inchangées (230 et 155 lignes),
donc aucun bloc emporté.

**font-size inline restants dans mes fichiers : 0**
