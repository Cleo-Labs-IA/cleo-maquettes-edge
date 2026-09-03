# Passe 12, l'échelle. Rapport de `commun/composants.css`

Écrit le 27/08/2026. Fichier touché : `/Users/naomiehalioua/cleo-maquettes-edge/commun/composants.css`,
et lui seul. 847 lignes avant, 829 après. Sauvegarde de l'état d'avant :
`.../scratchpad/composants.AVANT.css`.

Aucun script du chantier n'a été lancé (`construire.mjs`, `capturer.mjs`,
`verifier.mjs`, `temoin.mjs` : zéro appel). Les mesures ci-dessous viennent
d'un banc à part, monté à la main, qui inline `base.css` + `composants.css`
et le vrai balisage des pages dans un navigateur à 1440 px.

---

## Tâche 1.1, les déclarations en double

### Le compte annoncé, et celui que je trouve

Le relevé annonçait 41 sélecteurs en double. Avec la règle « même chaîne de
sélecteur, déclarée deux fois ou plus », j'en trouve **56**, pour 125
occurrences. Ce n'est pas 41, et aucune règle de comptage que j'ai essayée ne
donne 41. Le partage utile est ailleurs :

- **34 se contredisent vraiment** : deux déclarations dans le MÊME contexte de
  cascade, l'une annulant l'autre en silence.
- **22 ne sont que des paliers responsive** : une déclaration de base et sa
  reprise dans une media query. C'est le fonctionnement normal d'une feuille,
  pas un défaut. Je ne les ai pas touchées.

### `.t-hero` : les deux déclarations retirées, le jeton posé explicitement

Constaté au source : ce n'est pas `.t-hero` qui est déclaré deux fois dans ce
fichier, c'est `.hero-epure .t-hero` (spécificité 0,2,0), lignes 723 et 757.
C'est bien la 757 qui gagnait, elle est plus bas et de même spécificité :
46,08 px rendus à 1440 (`clamp(2rem, 3.2vw, 3rem)`). La 723
(`clamp(2.25rem, 4.2vw, 3.5rem)`, 56 px plafonné) était morte à 100 %.

J'ai fusionné en une seule déclaration et posé le jeton **explicitement**,
pas par héritage. La raison est mesurable : `regime-noir.css:59` redéclare
`.t-hero` à `clamp(2.25rem, 4.4vw, 3.75rem)`, soit 60 px, et `regime-noir.css`
est inliné APRÈS `composants.css` (`construire.mjs:339-342`). Si je me
contentais de retirer la taille de `.hero-epure .t-hero`, la page
`01-accueil-noir` tomberait sur la déclaration de `regime-noir` et son hero
partirait à 60 px au lieu de 49. Le témoin le confirme : `01-accueil-noir`
rend 46,08 aujourd'hui, donc la règle 0,2,0 de `composants.css` bat déjà
celle de `regime-noir`.

`commun/composants.css:712` `clamp(2rem, 3.2vw, 3rem)` -> `clamp(2.125rem, 3.4vw, 3.125rem)`
soit **46,08 px -> 48,96 px à 1440**, la valeur exacte du jeton `base.css:128`.
Un commentaire de quatre lignes dit au-dessus pourquoi la valeur est recopiée
et qu'elle doit suivre le jeton.

### `.entete-section` : qui gagnait, et pourquoi je garde celle-là

Déclarée QUATRE fois, pas trois : 189, 620, 748 hors media, plus 644 dans un
`@media (max-width:1024px)`.

- **Celle qui gagnait : la 748** (`margin-bottom:72px; gap:14px`). Elle est la
  plus basse des trois hors media, à spécificité égale.
- La 620 (`margin-bottom:112px; gap:20px`), celle qui portait le relevé
  cleolabs, était **entièrement morte**.
- La 189 gardait `display:flex; flex-direction:column` (que personne d'autre
  ne redéclare) et perdait son `gap` et sa `margin-bottom`.
- La 644 (`margin-bottom:var(--s-48)`, l'intention responsive) était morte
  elle aussi : la 748 est hors media et plus bas, donc elle gagne à TOUTES les
  largeurs, y compris sous 1024 px.

**Mon choix : une seule déclaration, à la ligne 189, avec les valeurs qui
rendaient (`gap:14px; margin-bottom:72px`).** La 189 est la maison du
composant, dans le bloc « Grilles », à côté de `.duo` et des `.g2/.g3/.g4`.
Ce n'est pas « la dernière du fichier » : c'est la première, et j'y ai porté
la valeur de la dernière.

Conséquence de ce choix, traitée explicitement : remonter la déclaration au
dessus de la media query aurait **réveillé** la ligne 644 et changé la marge
sous 1024 px (72 -> 48). Ce déplacement-là, le témoin à 1440 px ne le verrait
pas. J'ai donc **supprimé la ligne 644** plutôt que de la ressusciter à
l'aveugle : elle n'a jamais rendu. Si tu veux l'intention responsive, elle
tient en une ligne à remettre dans le `@media (max-width:1024px)` de la
ligne 624 : `.entete-section{margin-bottom:var(--s-48)}`.

### `.t-caption` et `.t-label` : gardées, et `base.css` est à réparer

`composants.css:739-740` pose 12 et 10, les jetons de la DA.
`base.css:135-136` dit encore 13 et 11. **Les valeurs de `composants.css` sont
les bonnes et je les ai gardées telles quelles**, avec un commentaire au-dessus
qui dit que c'est `base.css` qu'il faut réparer et que ces deux lignes doivent
rester tant que ce n'est pas fait. À passer à l'agent qui tient `base.css`.

### Trois déclarations mortes retirées, aucune ressuscitée

Trois media queries posaient une valeur qu'une déclaration hors media, plus
bas dans le fichier, annulait à toutes les largeurs. Elles n'ont jamais rendu.
Je les retire au lieu de les réveiller, parce que le témoin mesure à 1440 px
et ne pourrait pas contrôler leur retour.

- `l.644` `.entete-section{margin-bottom:var(--s-48)}` (couverte par l'ex-748)
- `l.607` `.bande-logos .cellule{padding:16px 20px}` (couverte par l'ex-636).
  Le `min-width:110px` de la même ligne, lui, rendait : il reste.
- `l.589` `.alterne{gap:32px; padding:28px 0}` (couvertes par l'ex-625).
  Attention, la même ligne groupait `.alterne,.alterne.inverse` : sur
  `.alterne.inverse` la spécificité 0,2,0 rendait ces deux valeurs VIVANTES.
  J'ai donc scindé le sélecteur en deux (`commun/composants.css:588-589`)
  pour ne rien changer à `.alterne.inverse`.

### Les 34 qui se contredisent : ce que j'ai fait de chacune

Fusionnées (typographie et espacement), valeur gardée = celle qui rendait,
sauf ordre de la DA sur la taille :

| sélecteur | lignes avant | qui gagnait | valeur gardée | ligne après |
|---|---|---|---|---|
| `.entete-section` | 189, 620, 748 (+644 media) | 748 | `gap:14px; margin-bottom:72px` | 189 |
| `.nav .conteneur` | 54, 754 | 754 | `height:60px` | 54 |
| `.mega` | 69, 639 | 639 | `padding:30px 32px` | 69 |
| `.btn` | 101, 746 | 746 | `padding:12px 24px`, taille portée au cran 15 | 101 |
| `.btn-sm` | 114, 747 | 747 | `padding:9px 17px`, taille portée au cran 12 | 114 |
| `.coches` | 152, 627 | 627 | `gap:15px` | 152 |
| `.coches li` | 153, 745 | 745 | `line-height:1.6`, taille portée au cran 15 | 153 |
| `.p32` `.p40` `.p48` | 172, 626 | 626 | `40px` / `48px` / `64px` | 172 |
| `.g2` `.g3` `.g4` | 184-186, 624 | 624 | `var(--s-32)` / `28px` / `var(--s-24)` | 184-186 |
| `.duo` | 187, 623 | 623 | `gap:96px` | 187 |
| `.bande-logos .cellule` | 194, 636 (+607 media) | 636 | `padding:28px 38px; height:96px` | 194 |
| `.mesures .ligne` | 355, 632, 751 | 751 | `padding:26px 0` (identique à la 355) | 355 |
| `.mesures .valeur` | 357, 749 | 749 | `font-weight:400; letter-spacing:-0.015em`, taille au cran 32 | 357 |
| `.mesures .libelle` | 356, 750 | 750 | taille portée au cran 15 | 356 |
| `.chiffre` | 363, 752 | 752 | `font-weight:400; letter-spacing:-0.015em`, taille au cran 32 | 363 |
| `.faq summary` | 391, 634 | 634 | `padding:26px 4px` | 391 |
| `.faq .reponse` | 396, 635 | 635 | `padding:0 4px 28px` | 396 |
| `.temoignage` | 402, 633 | 633 | `gap:80px` | 402 |
| `.citation` | 403, 753 | 753 | `line-height:1.65`, taille au cran 15 | 403 |
| `.res-corps` | 452, 629 | 629 | `gap:88px` | 452 |
| `.res-tete` | 458, 628 | 628 | `margin-bottom:var(--s-64)` | 458 |
| `.res-carte .corps` | 462, 465 | 465 | `padding:20px 22px 24px` + flex | 464 |
| `.article h2` | 490, 637 | 637 pour la marge | `margin:56px 0 20px`, taille au cran 24 | 489 |
| `.cas-corps` | 522, 631 | 631 | `gap:96px` | 521 |
| `.alterne` | 540, 625 | 625 | `gap:96px; padding:var(--s-64) 0` | 539 |
| `.hero-epure .t-hero` | 723, 757 | 757 | taille = jeton `base.css:128` | 712 |
| `:root` en media | 587, 643 | 643, à valeur IDENTIQUE | `--pad-section` déclaré une fois (l.586) | 586 / 629 |

Fusionnées en plus, hors liste des doublons exacts : trois surcharges groupées
posaient une valeur par-dessus la maison du composant sans être des sélecteurs
identiques. Les laisser aurait rendu la passe incohérente.

| surcharge retirée | ce qu'elle écrasait | résultat |
|---|---|---|
| `l.755` `.nav-declencheur,.nav-fin .lien-secondaire{font-size:0.8125rem}` | l.59 et l.66 | taille posée à la maison, cran 12 |
| `l.756` `.mega-item b,.mega-liste a{font-size:0.8125rem}` | l.86 et l.91 | taille posée à la maison, cran 12 |
| `l.630` `.corps-sommaire,.corps-aside{gap:88px}` | l.513 et l.514 | `gap:88px` à la maison |
| `l.638` `.article p,.article li{margin-bottom:22px}` | l.493 et l.495 | `22px` à la maison |

**Laissées telles quelles, listées seulement** (quatre doublons qui ne touchent
ni la typographie ni l'espacement, donc hors périmètre de cette passe) :

- `.carte,.carte-tiede,.carte-encre,.carte-sombre` (l.162 et l.725) : `box-shadow`.
  La 162 pose `none`, la 725 pose `var(--shadow-sm)`. **C'est la 725 qui gagne**,
  elle est plus bas. C'est l'état de repos réel des cartes, et c'est ce qui rend
  la tâche 2.2b cohérente.
- `.scene` (l.204 et l.681) : `box-shadow:var(--shadow-lg)` deux fois, à valeur
  identique. Doublon strictement inerte.
- `.res-carte .vignette` (l.462, l.682, l.727) : `aspect-ratio` 16/10 puis 3/2
  (**la 682 gagne**), plus `box-shadow` à la 727. Géométrie et ombre, pas
  d'espacement.
- `:root` dans deux `@media (max-width:1024px)` (l.586 et l.629) : après retrait
  du `--pad-section` en double, les deux blocs ne partagent plus AUCUNE
  propriété. Le sélecteur est répété, il ne se contredit plus.

**Les 22 paliers responsive, non touchés** : `.alterne.inverse .texte`, `.arbre`,
`.carte-image`, `.carte-image .dessus`, `.cta-final .portrait`, `.cv`, `.cycle`,
`.cycle-noyau`, `.experts-duo`, `.g-features .feature-large`, `.hero-epure`,
`.hero-epure.hero-clos`, `.hero-globe`, `.hero-pied`, `.mass-20`, `.mass-refs`,
`.nav-liens`, `.nd`, `.pile-regles`, `.res-nav`, `.scene-large`,
`.scene-large .dessus`.

---

## Tâche 1.2, les tailles hors échelle

Les six familles annoncées ont été vérifiées au source avant édition. Deux
écarts entre le relevé et le fichier :

- `.cf-question` n'était pas à 11 px au source mais à **12,5 px** (l.290). Les
  11 px mesurés viennent d'un style inline dans `commun/vignettes.html:5`, qui
  n'est pas mon fichier. La règle CSS passe à 12 ; l'inline à 11 reste, à
  corriger ailleurs.
- `.t-hero` n'est pas déclaré nu dans ce fichier (voir plus haut).

Toutes les autres correspondaient. **75 déclarations de taille modifiées.**
Après la passe, les 98 tailles à valeur fixe du fichier sont TOUTES sur un des
huit crans, et il ne reste que deux `clamp()` : `.t-lead` (l.26, bornes 16 et
18, deux crans) et `.hero-epure .t-hero` (l.712, le jeton).


```
commun/composants.css:27   .t-sm                              font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:28   .t-micro                           font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:29   .t-h4                              font-size 1.0625rem    -> 1rem        (17 px -> 16 px)
commun/composants.css:30   .surtitre                          font-size 0.6875rem    -> 0.75rem     (11 px -> 12 px)
commun/composants.css:59   .nav-declencheur                   font-size 0.875rem     -> 0.75rem     (14 px -> 12 px)
commun/composants.css:66   .nav-fin .lien-secondaire          font-size 0.875rem     -> 0.75rem     (14 px -> 12 px)
commun/composants.css:76   .mega-titre                        font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:86   .mega-item b                       font-size 0.875rem     -> 0.75rem     (14 px -> 12 px)
commun/composants.css:91   .mega-liste a                      font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:96   .mega-pied                         font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:101  .btn                               font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:114  .btn-sm                            font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:125  .pilule,.tag                       font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:133  .pilule-dispo                      font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:140  .badge,.marqueur                   font-size 11px         -> 0.75rem     (11 px -> 12 px)
commun/composants.css:153  .coches li                         font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:211  .regle-flottante                   font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:215  .regle-flottante .drapeau          font-size 0.85rem      -> 0.9375rem   (13.6 px -> 15 px)
commun/composants.css:229  .ecran-tete .fil-ariane            font-size 11.5px       -> 12px        (11.5 px -> 12 px)
commun/composants.css:232  .fiche                             font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:236  .fiche-nom                         font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:253  .nd .titre                         font-size 11px         -> 12px        (11 px -> 12 px)
commun/composants.css:256  .nd .id                            font-size 9.5px        -> 10px        (9.5 px -> 10 px)
commun/composants.css:257  .nd .op                            font-size 8.5px        -> 10px        (8.5 px -> 10 px)
commun/composants.css:259  .nd .nb                            font-size 9px          -> 10px        (9 px -> 10 px)
commun/composants.css:265  .chemin-pilule                     font-size 11.5px       -> 12px        (11.5 px -> 12 px)
commun/composants.css:272  .barre-canevas span                font-size 11.5px       -> 12px        (11.5 px -> 12 px)
commun/composants.css:282  .ca-texte                          font-size 12.5px       -> 12px        (12.5 px -> 12 px)
commun/composants.css:285  .ca-mode                           font-size 10.5px       -> 10px        (10.5 px -> 10 px)
commun/composants.css:289  .cf-question                       font-size 12.5px       -> 12px        (12.5 px -> 12 px)
commun/composants.css:292  .cf-etape                          font-size 11.5px       -> 12px        (11.5 px -> 12 px)
commun/composants.css:296  .cf-reponse p                      font-size 12.5px       -> 12px        (12.5 px -> 12 px)
commun/composants.css:297  .cf-cite                           font-size 11.5px       -> 12px        (11.5 px -> 12 px)
commun/composants.css:311  .vv-date b                         font-size 12.5px       -> 12px        (12.5 px -> 12 px)
commun/composants.css:312  .vv-date span                      font-size 8px          -> 10px        (8 px -> 10 px)
commun/composants.css:316  .vv-ref                            font-size 8.5px        -> 10px        (8.5 px -> 10 px)
commun/composants.css:317  .vv-etat                           font-size 8px          -> 10px        (8 px -> 10 px)
commun/composants.css:322  .vv-bilan                          font-size 8.5px        -> 10px        (8.5 px -> 10 px)
commun/composants.css:328  .vignette-ecran .nd .id            font-size 8.5px        -> 10px        (8.5 px -> 10 px)
commun/composants.css:329  .vignette-ecran .nd .op            font-size 7.5px        -> 10px        (7.5 px -> 10 px)
commun/composants.css:330  .vignette-ecran .nd .nb            font-size 8px          -> 10px        (8 px -> 10 px)
commun/composants.css:345  .mass-ref                          font-size 11px         -> 12px        (11 px -> 12 px)
commun/composants.css:349  .mass-ref.found .mass-mark         font-size 9px          -> 10px        (9 px -> 10 px)
commun/composants.css:356  .mesures .libelle                  font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:357  .mesures .valeur                   font-size clamp(1.875rem, 3vw, 2.5rem) -> 2rem        (clamp(1.875rem, 3vw, 2.5rem) -> 32 px)
commun/composants.css:363  .chiffre                           font-size clamp(1.875rem, 2.6vw, 2.5rem) -> 2rem        (clamp(1.875rem, 2.6vw, 2.5rem) -> 32 px)
commun/composants.css:371  .comparatif th                     font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:403  .citation                          font-size 1.0625rem    -> 0.9375rem   (17 px -> 15 px)
commun/composants.css:414  .pied h4                           font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:416  .pied ul a                         font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:423  .pied-bas                          font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:428  .infolettre input                  font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:431  .infolettre button                 font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:438  .form-carte label                  font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:439  .form-carte input                  font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:454  .res-nav .titre                    font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:455  .res-nav a                         font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:466  .res-carte .lien                   font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:477  .terme-carte .def                  font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:489  .article h2                        font-size clamp(1.375rem,1.2rem + 1vw,1.75rem) -> 1.5rem      (clamp(1.375rem,1.2rem + 1vw,1.75rem) -> 24 px)
commun/composants.css:491  .article h3                        font-size 1.1875rem    -> 1.125rem    (19 px -> 18 px)
commun/composants.css:492  .article p                         font-size 1.0625rem    -> 1rem        (17 px -> 16 px)
commun/composants.css:494  .article li                        font-size 1.0625rem    -> 1rem        (17 px -> 16 px)
commun/composants.css:499  .article .source-citee             font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:505  .sommaire                          font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:506  .sommaire .titre                   font-size 0.6875rem    -> 0.75rem     (11 px -> 12 px)
commun/composants.css:515  .legal h2                          font-size 1.3125rem    -> 1.5rem      (21 px -> 24 px)
commun/composants.css:524  .fiche-laterale .cle               font-size 0.6875rem    -> 0.75rem     (11 px -> 12 px)
commun/composants.css:560  .kit-nav a                         font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:563  .kit-famille .num                  font-size 0.6875rem    -> 0.75rem     (11 px -> 12 px)
commun/composants.css:567  .kit-nom                           font-size 1.0625rem    -> 1rem        (17 px -> 16 px)
commun/composants.css:568  .kit-ou                            font-size 0.6875rem    -> 0.75rem     (11 px -> 12 px)
commun/composants.css:570  .kit-note                          font-size 0.875rem     -> 0.9375rem   (14 px -> 15 px)
commun/composants.css:667  .pastille-verre                    font-size 0.8125rem    -> 0.75rem     (13 px -> 12 px)
commun/composants.css:712  .hero-epure .t-hero                font-size clamp(2rem, 3.2vw, 3rem) -> clamp(2.125rem, 3.4vw, 3.125rem) (clamp(2rem, 3.2vw, 3rem) -> clamp(2.125rem, 3.4vw, 3.125rem))
```

### Les tailles qui n'étaient pas dans la liste et que j'ai corrigées quand même

La consigne disait de corriger les autres fuyards et de le dire. Les voici,
par famille :

- **17 px -> 16** : `.t-h4`, `.article p`, `.article li`, `.kit-nom`. Le 17 est
  à égale distance de 16 et de 18 ; je snappe vers le bas, la retenue d'échelle
  que le fichier revendique lui-même. `.citation` fait exception et va à 15,
  c'était l'ordre explicite.
- **19 px -> 18** : `.article h3`.
- **21 px -> 24** : `.legal h2`. Pas la valeur la plus proche par le bas, un
  choix de cohérence : `.article h2` et `.legal h2` sont le même objet, un
  titre de section de document long. Les deux valent maintenant 24, le cran
  `.t-h1`.
- **28 px -> 24** : `.article h2`, dont le `clamp` plafonnait à 28.
- **40 px -> 32** et **37,44 px -> 32** : `.mesures .valeur` et `.chiffre`, les
  grands nombres du geste Harvey. Leurs `clamp` ne touchaient aucun cran, ni en
  bas (30) ni en haut (40). Ils passent à plat sur le cran display, 32.
  **C'est le changement le plus contestable de la passe** : il retire 20 % à
  la taille des chiffres, sur 10 nœuds répartis sur 3 pages (02-entreprise,
  05-marche, 20-campagne) et 3 nœuds sur 00-composants. Retour arrière en deux
  lignes si tu préfères garder le geste : `commun/composants.css:357` et `:363`.
- **13,6 px -> 15** : `.regle-flottante .drapeau`, la taille du drapeau dans sa
  pastille de 24 px.
- **Les écrans produit en miniature** : ils descendaient jusqu'à 7,5 px. Le
  plancher de l'échelle est 10 (`.t-label`), pas 12. Tout ce qui était sous 10
  y remonte : `.nd .op` 8,5, `.vv-date span` 8, `.vv-etat` 8, `.vv-ref` 8,5,
  `.vv-bilan` 8,5, `.vignette-ecran .nd .id` 8,5, `.vignette-ecran .nd .op`
  7,5, `.vignette-ecran .nd .nb` 8. Conséquence assumée : les surcharges de
  `.vignette-ecran`, qui existaient pour rapetisser encore la miniature,
  rendent maintenant la même valeur que la version pleine taille. La vignette
  vit dans un cadre `height:224px; overflow:hidden` (l.331), donc le surplus
  est rogné, pas propagé.

---

## Tâche 2.2b, le survol n'enlève plus rien

`commun/composants.css:165` `.carte:hover,.carte-encre:hover{box-shadow:none; transform:none}`
-> `.carte:hover,.carte-encre:hover{box-shadow:var(--shadow-md)}`

L'état de repos des cartes est `var(--shadow-sm)` (l.725, qui gagne sur le
`none` de la l.163). Le survol passe donc de `sm` à `md`, une élévation, avec
les jetons existants (`base.css:92-93`). La transition est déjà déclarée pour
`box-shadow` (`mouvement.css:51-53` pour `.carte`, `composants.css:164` pour
`.carte-encre`), donc l'ombre monte, elle ne saute pas.

`transform:none` est retiré au passage : c'était une soustraction elle aussi,
inerte aujourd'hui (rien ne pose de `transform` au survol des cartes) mais qui
aurait annulé une élévation posée plus tard. `mouvement.css` étant inliné
après `composants.css`, l'agent mouvement garde la main.

Deux autres `box-shadow:none` au survol ont été VÉRIFIÉS et laissés, parce que
ce ne sont pas des soustractions : `l.170` `.sur-sombre .carte:hover` et
`l.461` `.res-carte:hover` portent tous deux sur un élément dont l'état de
repos est déjà `none`. Sur champ profond, le survol ajoute d'ailleurs déjà
quelque chose, `border-color:rgba(255,255,255,0.24)`.

---

## Ce que ça déplace, mesuré

Banc isolé, Chromium, 1440 x 900, vrai balisage extrait de `pages/01-accueil.html`
et `pages/00-composants.html`, `base.css` + `composants.css` inlinés. Avant
contre après.

**La pastille « Donnée manquante » tient encore sur sa ligne.** C'était la
question posée.

| | avant | après |
|---|---|---|
| taille de la pastille | 11 px | 12 px |
| largeur de la pastille | 152,30 px | 163,19 px (+7,1 %) |
| libellé « Proposition 65 » | 88,50 px | 82,69 px (la fiche passe de 13 à 12) |
| libellé + gouttière + pastille | 250,80 px | **255,88 px** |
| largeur utile de la ligne | 310 px | 310 px |
| marge restante | 59,20 px | **54,12 px** |
| pastille repliée sur deux lignes | non | **non** |
| hauteur de la ligne | 49,69 px | 51,39 px (+1,70) |
| hauteur de la fiche | 388,81 px | 395,63 px (+6,82) |

Les quatre pastilles du kit, hors contrainte : « Conforme » 88,98 -> 94,69 ·
« À vérifier » 86,42 -> 91,75 · « Non conforme » 119,39 -> 127,58 ·
« Donnée manquante » 152,30 -> 163,19. Hauteur 26,69 -> 28,39 pour les quatre.

**La citation passe bien de 10 lignes à 9**, comme annoncé. L'ampleur est plus
grande que l'estimation :

| | avant | après |
|---|---|---|
| taille | 17 px | 15 px |
| interligne | 27,54 px | 24,30 px |
| lignes | 10 | **9** |
| hauteur du bloc de citation | 275,31 px | 218,67 px, soit **-56,64 px** (estimation du brief : -43) |
| hauteur de la carte témoignage | 567,50 px | 540,00 px, soit **-27,50 px** |
| hauteur de la section | 695,50 px | 668,00 px |

La carte ne perd que 27,50 px et non 56,64 : le portrait de gauche porte un
`min-height:540px` qui absorbe la moitié du gain. Tout ce qui suit dans la
section témoignage remonte de 27,50 px.

**Les boutons**, qui portent le 14 px partout :

| bouton | avant | après |
|---|---|---|
| `.btn` « Essai gratuit » | 128,69 x 47,80 | 133,50 x 49,50 |
| `.btn` « Nous contacter » | 150,56 x 49,80 | 156,73 x 51,50 |
| `.btn-sm` « Voir la fiche » | 107,83 x 42,09 | 103,22 x 40,39 |

Un `.btn` gagne 4,8 à 6,2 px de large et 1,7 px de haut. Un `.btn-sm` en perd
4,6 et 1,7. Aucune marge n'a été retouchée pour compenser quoi que ce soit.

---

## Vérifié

1. **Aucune coupe par index de chaîne.** Les 132 modifications sont passées par
   un remplacement de chaîne exacte, chacune assortie d'un compte attendu ; le
   script refuse d'écrire un seul octet si un compte ne tombe pas juste. Il a
   d'ailleurs refusé une première fois, sur `.p32/.p40/.p48`, où le
   remplacement rendait la chaîne à supprimer ambiguë.
2. **Différentiel de cascade, avant contre après, à 1440, 1024 et 640 px.**
   Un outil recalcule la valeur effective de chaque couple (sélecteur,
   propriété) et compare. À 1440 px : 87 différences, et pas une de plus.
   77 portent sur les tailles (75 valeurs changées, plus 2 surcharges groupées
   retirées) ; 2 sont le survol des cartes ; les 8 dernières sont la re-clef de
   trois fusions dont la valeur effective ne bouge pas (`.article p/li`,
   `.corps-sommaire/.corps-aside`, `.faq .reponse`).
   **Zéro fusion d'espacement n'a bougé une valeur rendue.** À 1024 et 640 px :
   7 différences de plus, toutes dues à la scission de `.alterne` /
   `.alterne.inverse`, vérifiée par spécificité comme rigoureusement neutre.
3. **Doublons dans le même contexte : 34 avant, 4 après.** Les 4 restants sont
   les quatre listés plus haut, hors périmètre typographie et espacement.
4. **Tailles : 98 déclarations à valeur fixe, 98 sur un cran, 0 hors échelle.**
5. **`clamp()` : zéro opérateur collé.** Contrôle par expression régulière sur
   tout le fichier, `1.2rem+1vw` et compagnie n'existent pas. Il ne reste que
   deux `clamp`, dont un qui n'a pas d'opérateur du tout.
6. **Accolades : 537 ouvrantes, 537 fermantes. Commentaires : 59 `/*`,
   59 `*/`.** Aucun bloc laissé ouvert par une suppression.
7. **Zéro monospace, zéro emoji.** Les seuls caractères hors alphabet latin
   sont les filets de commentaire déjà présents.
8. Aucun fichier de `sortie/` ouvert ni modifié. Aucun script du chantier lancé.

---

## Laissé, non fait, et pourquoi

- **`base.css:135-136`, `.t-caption` 13 et `.t-label` 11.** Pas mon fichier.
  Les deux lignes de `composants.css` qui les corrigent (12 et 10) doivent
  rester en place tant que la réparation n'est pas faite, sinon la DA perd ses
  deux crans du bas. Signalé à l'agent qui tient `base.css`.
- **`regime-noir.css:59-63`.** Trois tailles hors des huit crans, uniquement
  sur `01-accueil-noir` : `.t-hero` 60 px (14 nœuds), `.t-display` 40 px
  (13 nœuds), `.t-h1` 26 px (6 nœuds). Ce sont les 26 px et une partie des
  40 px que le témoin voit. Pas mon fichier.
- **`base.css:123-124`**, la règle `code,kbd,samp,pre{font-size:0.94em}`
  produit les tailles relatives 13,16 et 11,2 px du relevé. Pas mon fichier.
- **Les tailles posées en style inline dans les pages**, que ma feuille ne peut
  pas atteindre : `commun/vignettes.html` (11 px sur `.cf-question`, 10 px sur
  `.cf-etape` et `.cf-cite`, 9 px sur `.cf-ref`), `pages/00-composants.html`
  (0,9rem soit 14,4 px sur `.sceau .nom`, 1,0625rem soit 17 px sur deux
  `.t-h2`, 0,875rem soit 14 px sur deux liens, 0,7rem soit 11,2 px sur trois
  `.regle-flottante`), et douze `font-size:1.25rem` (20 px) répartis sur
  03-offre, 04-secteur, 07-chat, 08-reglementation et 09-texte. C'est le vrai
  reste du chantier « zéro hors échelle » : une passe sur `pages/`, pas sur le
  CSS.
- **`index.html`**, généré par `index.mjs`, porte 24 nœuds à 22 px et 23 à
  11,2 px. Autre fichier, autre passe.
- **Le composant de veille**, importé en bloc depuis `cleo-landing`
  (`construire.mjs:182`), apporte son propre CSS et ses propres tailles. Hors
  périmètre par construction.
- **`.t-lead` (l.26) gardé en `clamp`.** Il rend 18 px à 1440, un cran, et ses
  deux bornes valent 16 et 18, deux crans. Il n'est fluide qu'entre les deux.
  L'aplatir changerait le rendu sous 933 px de large, un déplacement que le
  témoin à 1440 ne saurait pas mesurer.
- **Quatre doublons laissés** (`box-shadow`, `aspect-ratio`) : détail plus haut.
- **Les 22 paliers responsive** : ce n'est pas un défaut.
- **Aucune marge n'a été ajustée pour compenser un déplacement de taille.**
  C'était la consigne, et c'est ce qui rend le relevé d'après lisible.

## À décider par Naomie, une ligne chacun

1. Les grands nombres à 32 au lieu de 40. Si le geste Harvey doit rester
   grand, `commun/composants.css:357` et `:363` reviennent en deux lignes.
2. L'intention responsive de `.entete-section` sous 1024 px (marge 48 au lieu
   de 72), morte depuis toujours, retirée plutôt que réveillée à l'aveugle.
3. Même chose pour `.bande-logos .cellule` sous 640 px (padding 16/20) et pour
   `.alterne` sous 1024 px (padding 28), mortes toutes les deux.
