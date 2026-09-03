# Réfutation — lentille « mots-symboles »

**Affirmation attaquée** : « Après correction, AUCUN mot-symbole ni logo n'est illisible
sur les 25 pages construites, et aucun logo lisible n'a été cassé. »

**Verdict : RÉFUTÉE.** La seconde moitié tient (les deux correctifs sont bons, rien n'a
été cassé par ricochet). La première moitié tombe : trois mots-symboles restent sous
2:1 au pixel, dont le mot-symbole **Cleo** lui-même sur `01-accueil-noir.html`.

## Méthode

Oracle = le pixel, jamais le jeton. Chromium 1440×900, `deviceScaleFactor` 2 puis 3,
pages ouvertes en `file://` depuis `sortie/`. Pour chacune des 25 pages : recensement
de **tous** les `<img>` (218 au total), sélection de ceux qui portent une marque
(alt de marque, `.wordmark`, `.ca-logo`, filtre inline, appartenance à `.bande-logos`)
→ 120 images mesurées. Pour chacune : capture de l'élément tel qu'il est peint,
puis écart-type de luminance et contraste WCAG entre le 2e et le 98e centile.

Deux pièges neutralisés :
- **Nav collante** : chaque mesure a été refaite avec l'élément garé au milieu de la
  fenêtre (`scrollBy(rect.top - 420)`), hors des 64 px que la barre `position:sticky`
  repeint. Les deux passes donnent les mêmes chiffres au centième.
- **Zoom flatteur** : tout ce qui est conclu « illisible » a aussi été regardé à
  l'échelle 1:1, en contexte, pas seulement agrandi ×6.

Témoin négatif systématique : un élément voisin du même conteneur.

## Ce qui casse l'affirmation

### 1. Le mot-symbole Cleo de la nav — 1,97:1 — `sortie/01-accueil-noir.html`

Encre relevée `rgb(14,42,215)` sur fond de barre `rgb(24,24,24)` → **1,97:1**,
écart-type 0,019. Sur la **même barre**, le lien « Produit » mesure **15,03:1**.
Le mot-symbole de la marque est l'élément le moins lisible de sa propre barre,
7,6 fois moins que le texte à côté.

Mécanisme, vérifié et non supposé : `commun/composants.css:56`
`.nav-logo img{filter:none !important}` annule le `filter:brightness(0) invert(1)`
inline de `commun/bandeau-nav.html:4`. Le logo rend donc en bleu natif. Sur les
21 pages claires (barre `rgba(255,255,255,0.60)`) c'est sans conséquence : 8,79:1.
Sur l'unique page en régime noir (barre `rgba(24,24,24,0.72)`, `regime-noir.css:42`),
c'est un aplat bleu sur noir. `regime-noir.css` n'a aucune règle `.nav-logo`.

### 2. Le logo Decathlon de la citation — 1,35:1 — `sortie/01-accueil-noir.html`

`<img alt="Decathlon" style="height:22px;opacity:0.5">`, sans filtre
(`pages/01-accueil.html`, bloc citation). Encre `rgb(43,49,108)` sur `rgb(33,33,33)`
→ **1,35:1**, écart-type 0,005 : la capture est quasi uniforme. Le bleu marine
Decathlon reste bleu marine en régime noir. La règle `regime-noir.css:124`
(`.bande-logos img{… brightness(0) invert(1)}`) ne l'atteint pas : cette image est
isolée, hors `.bande-logos`. Même image sur la page claire : 2,52:1.

### 3. L'Occitane dans la bande de logos claire — 1,61:1

`commun/composants.css:195` : `.bande-logos img{opacity:0.52; filter:grayscale(1)}`.
Le doré du logo, désaturé, atterrit sur `rgb(199,198,197)` — à un cheveu du fond
`rgb(249,248,246)`. **1,61:1** pour le mot, **1,47:1** pour la ligne « EN PROVENCE »
qui disparaît. Écart-type 0,089 contre 0,264 pour Decathlon dans la **même bande**,
au même réglage : ce n'est donc pas la bande qui est en cause, c'est ce logo-là.
Présent sur `sortie/00-composants.html`, `sortie/01-accueil.html`,
`sortie/20-campagne.html`.

## Ce qui tient — les deux correctifs sont bons

| Correctif | Mesure | Regardé |
|---|---|---|
| `pages/20-campagne.html:5` → `brightness(0)` | **19,79:1**, noir `rgb(0,0,0)` sur `rgb(249,248,246)` | oui, « cleo » noir net |
| `pages/00-composants.html:245` → `brightness(0)` | **18,49:1**, `rgb(1,1,1)` sur `rgb(242,241,239)` | oui, lisible à 12 px |

Et rien n'a été cassé par ricochet :
- Logo du pied (`commun/pied.html:108`, `brightness(0) invert(1)`) : **19,28:1**,
  blanc sur `rgb(15,14,13)`, identique sur les 24 pages qui portent le pied. Regardé.
- Bande de logos en section sombre (04, 05, 09, 01-noir) : 6,08 à 7,21:1.
- Logo de nav sur les 21 pages claires : 8,79:1.
- `sortie/index.html` n'est pas périmé sur ce point : sa vignette de la page campagne
  montre déjà le logo noir corrigé.

## Faux positifs écartés

- **`.wordmark` de la signature de pied, 1,17:1 sur 24 pages.** Un calcul de contraste
  seul le condamnerait. `composants.css:436` lui donne `opacity:0.07` : c'est un
  filigrane décoratif, voulu, pas un mot-symbole à lire. Écarté.
- **Balzac Paris et Mercedes à `cr(p10,p90)` = 1,03 et 2,07.** Statistique trompeuse :
  ces logos sont si fins que 90 % de la boîte est du fond. Au 2e/98e centile ils
  mesurent 3,57 et 4,28 sur clair, 6,08 sur sombre. Lisibles. Écarté.
- **Le piège `.nav-logo img{filter:none !important}` sur les 21 pages claires.** Le
  mécanisme est bien réel (filtre calculé = `none`, vérifié au navigateur), mais bleu
  sur blanc à 8,79:1 se lit très bien. Le piège ne mord que sur la page noire.
- **`sortie/index.html`** : 22 `<img>`, tous des vignettes de pages, aucun mot-symbole
  propre. Aucun `img:` ni `ico:` non substitué dans les 25 pages.

## Ce qu'il faudrait corriger

1. `commun/regime-noir.css` — ajouter `.nav-logo img{filter:brightness(0) invert(1) !important}`
   (spécificité égale à `composants.css:56`, donc il faut le `!important` et un ordre
   d'injection postérieur, ce qui est le cas : `construire.mjs:308` injecte le régime
   noir après les composants).
2. `pages/01-accueil.html:~217` — le Decathlon de la citation a besoin du même
   traitement conditionnel que la bande, ou d'une variante claire.
3. `commun/composants.css:195` — le logo L'Occitane passe sous la barre à
   `opacity:0.52`. Soit une opacité propre à ce logo, soit un `brightness()` qui
   l'assombrit avant la désaturation.
