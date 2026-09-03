# Passe 12, lentille encre et filets

27/08/2026. Deux fichiers touchés, eux seuls : `commun/base.css` et
`commun/regime-noir.css`. `sortie/` n'a pas été ouverte en écriture, aucun script
de la chaîne (construire / capturer / verifier / temoin) n'a été lancé.

Méthode : remplacement de chaîne EXACTE par un script qui déclare un nombre
d'occurrences attendu et REFUSE d'écrire si un seul compte tombe faux. Le script
a d'ailleurs refusé d'écrire au premier essai (base.css passait de 162 à 165
lignes) ; rien n'avait été écrit à ce moment, md5 des deux fichiers inchangés,
et j'ai corrigé avant de relancer. Sauvegarde des deux fichiers d'origine dans
le bac à sable de la session.

---

## Les changements, un par ligne

### base.css (162 lignes avant, 162 lignes après)

Le nombre de lignes est identique À DESSEIN : le dépôt et la mémoire d'équipe
citent `base.css:N` un peu partout (composants.css:737 cite « base.css:135-136 »,
une leçon cite « base.css:154 »). Aucune de ces références ne bouge.

| ligne | ancien | nouveau |
|---|---|---|
| base.css:29 | `/* ── Texte sur clair, V5 verbatim ── */` | `/* ── Texte sur clair, V5 ; --c-text-3 remonté à 0,54 le 27/08, 0,45 rendait 3,32:1 ── */` |
| base.css:32 | `--c-text-3: rgba(0,0,0,0.45);` | `--c-text-3: rgba(0,0,0,0.54);` |
| base.css:35 | `--c-text-on-dark-3: rgba(255,255,255,0.38);` | `--c-text-on-dark-3: rgba(255,255,255,0.45);` |
| base.css:37 | `/* ── Bordures : le filet de cleolabs.co ── */` | `/* ── Bordures, le filet de cleolabs.co ; --c-border 0,08 -> 0,13 le 27/08 (1,196 -> 1,347:1) ── */` |
| base.css:38 | `--c-border: rgba(0,0,0,0.08);` | `--c-border: rgba(0,0,0,0.13);` |
| base.css:133 | `.t-body{… line-height:1.72; …}` | `.t-body{… line-height:1.60; …}` |
| base.css:135 | `.t-caption{font-size:0.8125rem; …}` | `.t-caption{font-size:0.75rem; …}` |
| base.css:136 | `.t-label{font-size:0.6875rem; …}` | `.t-label{font-size:0.625rem; …}` |

Les deux lignes de commentaire ne sont pas de la décoration : elles disaient
« V5 verbatim » et « le filet de cleolabs.co » sur des valeurs qui ne sont plus
ni l'un ni l'autre. Laisser un commentaire faux dans un fichier de jetons coûte
plus cher que la valeur elle-même.

### regime-noir.css (195 lignes avant, 221 après ; les 195 premières intactes)

| ligne | ancien | nouveau |
|---|---|---|
| regime-noir.css:18 | `--c-text-3: rgba(255,255,255,0.34);` | `--c-text-3: rgba(255,255,255,0.47);` |
| regime-noir.css:20 | `--c-border: rgba(255,255,255,0.09);` | `--c-border: rgba(255,255,255,0.13);` |
| regime-noir.css:23 | `--c-filet-sombre: rgba(255,255,255,0.11);` | `--c-filet-sombre: rgba(255,255,255,0.13);` |
| regime-noir.css:53 | `--pad-section: 148px;` | `--pad-section: 144px;` |
| regime-noir.css:75 | `--c-text-3:rgba(0,0,0,0.45);` | `--c-text-3:rgba(0,0,0,0.54);` |
| regime-noir.css:78 | `.ecran-tete .fil-ariane{color:rgba(0,0,0,0.45)}` | `…0.54)}` |
| regime-noir.css:81 | `.nd .id,.nd .op,.nd .nb{color:rgba(0,0,0,0.45); …}` | `…0.54); …}` |
| regime-noir.css:87 | `.cf-etape{color:rgba(0,0,0,0.45)}` | `…0.54)}` |
| regime-noir.css:92 | `.fiche-ref{color:rgba(0,0,0,0.45)}` | `…0.54)}` |
| regime-noir.css:98 | `.fiche .m-manquant{… color:rgba(0,0,0,0.45)}` | `…0.54)}` |
| regime-noir.css:99 | `.vv-etat{… color:rgba(0,0,0,0.45)}` | `…0.54)}` |
| regime-noir.css:101 | `.vv-date span{color:rgba(0,0,0,0.45)}` | `…0.54)}` |
| regime-noir.css:106 | `.flottant .t-micro{color:rgba(0,0,0,0.45)}` | `…0.54)}` |
| regime-noir.css:180 | `.flottant .t-micro{color:rgba(0,0,0,0.45)}` | `…0.54)}` |
| regime-noir.css:184 | `[style*="background:var(--c-white)"] .t-caption{color:rgba(0,0,0,0.45)}` | `…0.54)}` |
| regime-noir.css:197-221 | (rien) | bloc AJOUTÉ en fin de fichier, tâche 2.7 |

Le bloc 2.7 est en FIN de fichier, pas à sa place « logique ». Deux raisons :
aucun numéro de ligne existant ne bouge, et la règle est la dernière du dernier
fichier inliné, donc elle gagne les égalités de spécificité sans avoir à forcer.

Contenu du bloc, lignes 213 à 221 :

```
[style*="color:var(--c-blue)"]{color:var(--c-periwinkle) !important}
.carte-claire [style*="color:var(--c-blue)"],.ecran-app [style*="color:var(--c-blue)"],
.fiche [style*="color:var(--c-blue)"],.flottant [style*="color:var(--c-blue)"]{color:var(--c-blue) !important}
.nav-item:hover .nav-declencheur{color:var(--c-periwinkle)}
.mega-liste a:hover{color:var(--c-periwinkle)}
```

---

## Vérifié

**Comptages du script (il refusait d'écrire si l'un tombait faux)**

- base.css : 8 remplacements, 8 attendus, tous à 1 occurrence.
- regime-noir.css : 4 remplacements de jetons à 1 occurrence + **11 littéraux
  `rgba(0,0,0,0.45)` -> `rgba(0,0,0,0.54)`**.
- Après passe : `grep -c "rgba(0,0,0,0.45)"` rend **0** dans les deux fichiers.

**Combien de littéraux, et où.** Le brief en annonçait « environ 8, entre les
lignes 78 et 99 ». Il y en a **11 dans tout le fichier**, dont **6 seulement**
dans la fenêtre 78-99. Les 5 autres sont aux lignes 75, 101, 106, 180 et 184 ;
la 75 est la plus importante des onze : c'est la redéfinition de `--c-text-3`
pour `.ecran-app, .fiche, .carte-claire`, soit le miroir exact de base.css:32.
La laisser à 0,45 aurait fait mentir la réparation sur toutes les surfaces
claires du régime noir. Les 11 sont de l'encre (`color:` ou le jeton), aucune
n'est une bordure ni un fond : rien de structurel n'a bougé.

**Ratios calculés (formule WCAG 2.x, composition alpha faite avant le calcul)**

| jeton | fond | avant | après |
|---|---|---|---|
| `--c-text-3` clair | `#F9F8F6` | 3,32:1 | **4,53:1** |
| `--c-text-3` clair | `#FFFFFF` | 3,35:1 | **4,59:1** |
| `--c-text-3` clair | `--c-card #F0EFEC` | 3,28:1 | **4,44:1** |
| `--c-text-on-dark-3` | `--c-field-deep #0F0E0D` | 3,55:1 | **4,53:1** |
| `--c-text-on-dark-3` | `#161514` | 3,58:1 | **4,52:1** |
| `--c-text-3` noir | `--c-surface #181818` | 3,12:1 | **4,78:1** |
| `--c-text-3` noir | carte `#212121` | 3,09:1 | **4,62:1** |
| `--c-text-3` noir | pied `#121212` | 3,10:1 | **4,83:1** |
| littéraux 0,45 -> 0,54 | `#FAFAF9` (écran app) | 3,33:1 | **4,54:1** |

Le seul point qui reste sous 4,5 est `--c-text-3` clair sur `--c-card #F0EFEC`
à 4,44:1 et sur `--c-field-pale #F2F1EF` à 4,46:1. C'est le jeton cible du brief,
je ne l'ai pas dépassé de ma propre initiative : monter à 0,55 mettrait ces deux
fonds à 4,52 et 4,54. C'est un cran à trancher, pas à prendre en douce.

**Tâche 2.6, le filet.** Mesures faites, et une découverte qui compte :

| filet | avant | après |
|---|---|---|
| clair, sur carte `#FFFFFF` | 1,196:1 | **1,347:1** |
| clair, sur fond `#F9F8F6` | 1,195:1 | **1,345:1** |
| sombre 0,11 posé sur la carte `#212121` | 1,404:1 | **1,503:1** (à 0,13) |
| sombre 0,09 (`--c-border`) posé sur `#181818` | 1,162:1 | **1,329:1** |

Le 1,196:1 clair du brief est confirmé au millième. Le « 1,387:1 en sombre » ne
retombe sur aucune de mes deux lectures (je trouve 1,242 si le filet est composé
sur le fond de page, 1,404 s'il est composé sur la carte elle-même) ; l'écart est
faible et ne change pas la décision, mais je le signale plutôt que de recopier un
chiffre que je n'ai pas su reproduire.

**Tâche 2.4, l'interligne.** 15 x 1,60 = **24,00 px**, sur la grille de 4 ET de 8.
Les quatre autres valeurs du chantier ne tombent sur aucune des deux grilles :
1,66 -> 24,90 ; 1,70 -> 25,50 ; 1,72 -> 25,80 ; 1,78 -> 26,70.

**Tâche 2.7, résolution de cascade vérifiée par un résolveur indépendant** qui
relit le fichier ÉCRIT (pas mon intention) et classe les règles par !important,
puis spécificité, puis ordre :

- le lien « Voir les autres cas » (`.t-body` + `style="…color:var(--c-blue)…"`
  dans une `.carte`, pages/01-accueil.html:270) : gagnant = regime-noir.css:213,
  `var(--c-periwinkle)`. **#8A93FF sur #212121 = 5,89:1**, contre 1,48:1 avant.
- la citation CPSIA (`.t-caption` bleu dans `.carte-claire` +
  `style="background:var(--c-white)"`, pages/01-accueil.html:94) : gagnant =
  regime-noir.css:214-215, `var(--c-blue)` = #0008CF, exactement la valeur que
  regime-noir.css:185 lui donnait déjà. **Aucune régression** : les deux règles
  sont à égalité de spécificité (0,2,0) et à !important, l'ordre tranche pour la
  mienne, et elles rendent la MÊME couleur.

Le jeton employé existe bien : `--c-periwinkle: #8A93FF` est déclaré à
base.css:57 et le régime noir ne le redéfinit pas. Vérifié aussi que `--c-blue`
n'est PAS redéfini dans regime-noir.css (seul `--c-blue-light` l'est, ligne 26),
donc le garde-fou des îlots clairs rend bien #0008CF.

**Contrôles de structure**, après écriture :

- accolades : base.css 37 ouvrantes / 37 fermantes ; regime-noir.css 127 / 127.
- commentaires : base.css 25 `/*` / 25 `*/` ; regime-noir.css 18 / 18.
- `clamp()` : 6 dans les deux fichiers, **aucun ne contient de `+`**, donc pas de
  piège d'espaces. Le script refusait d'écrire si un `clamp()` contenait un `+`
  sans espaces autour.
- zéro monospace introduit, zéro emoji. Les seuls caractères nouveaux sont des
  lettres (`H Q È î œ` et `>`), venues de mes commentaires.
- `sortie/01-accueil-noir.html` daté 13:40, mes fichiers 15:09 : la sortie n'a pas
  été touchée et attend la reconstruction de l'orchestrateur.

**Tâche 1.1b, l'échelle.** Après réparation, base.css porte 12 px et 10 px exacts
(`0.75rem` et `0.625rem` à racine 16 px). composants.css:739-740 disait déjà 12 et
10 et le commentaire de l'agent frère demandait explicitement cette réparation :
les deux fichiers disent désormais la même chose, donc **la valeur rendue ne
change pas**. Ce qui change, c'est que base.css ne ment plus.

---

## Le point 128, sans y toucher

`base.css:128` ne porte PAS le jeton 49 px. Il porte :

```
.t-hero{font-size:clamp(2.125rem, 3.4vw, 3.125rem); …}
```

La borne haute est `3.125rem` = **50,00 px**. Le jeton 49 px vaut `3.0625rem`.
Écart d'un pixel, non touché comme demandé.

Deux conséquences à signaler, toutes deux hors de mes fichiers, donc non touchées :

- `composants.css:712` (`.hero-epure .t-hero`) porte le MÊME clamp `3.125rem`.
  L'agent frère y a recopié base.css:128 pour ne pas retomber sur le clamp du
  régime noir, comme la leçon du 27/08 le demandait. Corriger 50 -> 49 exigera
  donc de toucher les DEUX lignes en même temps, sinon la spécificité (0,2,0) de
  `.hero-epure .t-hero` fait gagner l'ancienne valeur.
- `regime-noir.css:59-62` porte des clamps NETTEMENT plus hauts que les jetons :
  `.t-hero` monte à `3.75rem` = 60 px (jeton 49) et `.t-display` à `2.5rem` = 40 px
  (jeton 32). Ce sont mes fichiers, mais ce n'est aucune de mes six tâches, donc
  je les laisse. Voir « Laissé » ci-dessous, c'est lié au +386 px.

---

## Ce que ça casse : où surtitre et corps se touchent

La hiérarchie d'encre à trois niveaux se resserre. Mesuré :

| régime | `--c-text-2` | `--c-text-3` avant | `--c-text-3` après | écart -2 / -3 |
|---|---|---|---|---|
| clair, `#F9F8F6` | 6,08:1 | 3,32:1 | 4,53:1 | 2,76 pt -> **1,56 pt** |
| noir, `#181818` | 5,25:1 | 3,12:1 | 4,78:1 | 2,13 pt -> **0,46 pt** |
| champ profond, `#0F0E0D` | 8,14:1 | 3,55:1 | 4,53:1 | 4,59 pt -> **3,61 pt** |

**Le point qui se jugera à l'œil, et il est unique : le régime noir.** À 0,47
contre 0,50, `--c-text-3` et `--c-text-2` sont à 0,46 point de contraste l'un de
l'autre. Optiquement c'est le MÊME gris. Sur `01-accueil-noir.html`, la
hiérarchie d'encre à trois niveaux tombe à deux niveaux. Ce n'est pas un défaut à
corriger en baissant autre chose, c'est un arbitrage : soit on accepte que le
régime noir n'ait que deux encres, soit `--c-text-2` remonte (0,50 est le relevé
Morpho, c'est un choix de DA), soit `--c-text-3` s'arrête à 0,45 et on assume
4,50:1 tout juste.

**Les endroits, comptés dans `pages/` : 34 cas** où un surtitre est collé à un
titre ou à un corps sur la ligne suivante. Ils se répartissent en deux familles
qui ne posent pas du tout le même problème.

1. **Surtitre contre CORPS, 4 cas, ce sont eux qui touchent.**
   `pages/01-accueil.html:123-124` (« Ce qui entre » -> « Journaux officiels »),
   `:138-139` (« Ce qui sort » -> « Obligations testables »), plus les deux
   jumeaux dans `01-accueil-en.html`. Un `.t-label` de 10 px en `--c-text-3`
   posé sur un `.t-body` de 15 px en `--c-text-2`. En clair : 4,53 contre 6,08,
   ça tient encore. **En noir : 4,78 contre 5,25, c'est plat.** Et c'est
   précisément le bloc « cycle » de la page noire. À regarder en premier.

2. **Surtitre contre TITRE, 30 cas** (`.surtitre`/`.t-label` suivi d'un
   `.t-h1`/`.t-display`/`.t-hero`). Là, le titre est en `--c-ink` à 15,3:1 face
   à un surtitre à 4,53:1 : l'écart reste de plus de 10 points, la hiérarchie
   ne bouge pas. Cas représentatifs : 01-accueil:54, :159, :173, :188, :310 ;
   02-entreprise:9 ; 06-cas-client:8, :80, :90, :108 ; 14-terme:5 ; 19-poste:5 ;
   21-inscription:7 ; 22-legal:5.

Un cas mixte à surveiller : `15-evenements.html:44` et `16-evenement.html:44/46/
49/52`, où un `.t-caption` de 12 px sert d'horaire au-dessus d'un `.t-h2` de
18 px. Le titre est en `--c-ink`, donc ça tient, mais ce sont les seuls endroits
où un `.t-caption` fait office de surtitre plutôt que de légende.

---

## Doublons : lesquels, et lequel gagne aujourd'hui

**Je n'ai supprimé AUCUNE déclaration en double.** Aucune de mes six tâches ne le
demandait, et le garde-fou est clair. Voici ceux que j'ai trouvés, avec le
gagnant actuel, pour que la décision soit prise en connaissance de cause.

1. **`.flottant .t-micro`, regime-noir.css:106 et :180.** Sélecteur identique,
   valeur identique. **Gagne aujourd'hui : la 180**, par ORDRE du fichier (même
   spécificité 0,2,0, la dernière déclarée l'emporte). J'ai changé LES DEUX à
   0,54 : quelle que soit celle qu'on supprimera plus tard, la valeur rendue sera
   juste. Supprimer la 180 et garder la 106 ne changerait rien non plus, elles
   sont désormais strictement identiques.

2. **`.t-caption` et `.t-label`, base.css:135-136 contre composants.css:739-740.**
   `construire.mjs` inline base.css PUIS composants.css PUIS regime-noir.css PUIS
   mouvement.css. Spécificité égale (0,1,0), donc **composants.css gagne par
   l'ordre**. C'est bien lui qui portait 12 et 10 jusqu'ici, exactement comme le
   dit son commentaire ligne 737. Après ma réparation les deux disent 12 et 10,
   la valeur rendue est inchangée, et les deux lignes de composants.css sont
   devenues inertes POUR LA TAILLE. Elles ne le sont pas pour tout :
   `letter-spacing` diffère encore, **base.css:136 dit `0.15em`, composants.css:740
   dit `0.13em`, et c'est le 0,13em qui gagne**. Si quelqu'un supprime
   composants.css:740 en pensant nettoyer un doublon, l'approche des surtitres
   passe de 0,13 à 0,15 em sur tout le site. Le nettoyage appartient au
   propriétaire de composants.css, pas à moi.

3. **`.mesure` et `.mesure-centree`, base.css:158-159 contre base.css:161-162.**
   Dans MON fichier, et déclarés deux fois à 3 lignes d'écart :
   `.mesure` 600px puis 640px, `.mesure-centree` 640px puis 680px. **Gagnent
   aujourd'hui : les lignes 161 et 162**, par ordre (spécificité égale). Les
   lignes 158-159 sont mortes. Je ne les ai PAS supprimées : ce n'est aucune de
   mes tâches, et surtout supprimer la mauvaise des deux rétrécit toutes les
   colonnes de texte du site de 40 px d'un coup. À faire dans une passe qui le
   mesure.

4. **`.btn-primaire,.btn-marque` et `.nav .btn-marque`, regime-noir.css:116/118
   contre :175/176.** Valeurs identiques des deux côtés. **Gagnent : les 175-176**,
   par ordre. Sans effet visible, signalé pour l'inventaire.

---

## Laissé, non fait, et pourquoi

**base.css:41 n'avait rien à changer.** Le brief demandait « 0,08 -> 0,13 dans
base.css:38 ET :41 ». La ligne 41 est `--c-filet-sombre: rgba(255,255,255,0.13)`,
elle était **déjà à 0,13**. Rien touché, rien à toucher.

**Le filet de `.carte` ne vient PAS de `--c-border`, et ma correction ne
l'atteint pas.** C'est le point le plus important de ce rapport pour la tâche 2.6.
`composants.css:162` déclare `.carte,.carte-tiede,.carte-encre,.carte-sombre
{background:var(--c-white); border:none; …}`. `border:none` pose `border-style:
none`. Toutes les règles qui suivent, dans composants.css comme dans
regime-noir.css, ne posent qu'un `border-color` : composants.css:169
(`.sur-sombre .carte` -> `var(--c-filet-sombre)`), composants.css:170 (survol),
regime-noir.css:140 (`rgba(255,255,255,0.11)` en dur). **Un `border-color` sans
`border-style` ne dessine rien.** Vérifié : aucune règle ne redonne un
`border-style` à `.carte`, et aucune page ne le fait en inline. Donc `.carte` n'a
AUCUN filet aujourd'hui, dans les deux régimes, et le mesuré « la carte se sépare
de son filet à 1,196:1 » décrit une carte qui n'en a pas.

Ce que `--c-border` à 0,13 change VRAIMENT : les **29 consommations** de
`var(--c-border)` dans composants.css, qui elles portent bien un `border-style`.
Les principales : `.nav` (bord bas, ligne 53), le verre (70), `.btn-clair` (111),
les pilules (126), **`.carte-lavande` (171, le seul type de carte qui ait un vrai
filet)**, le chrome des écrans app (226, 233, 241, 243, 258, 259, 265, 270, 273,
289, 307), `.mesures` (354-355), `.comparatif td` (372), `.faq` (389-390),
`.sommaire a` (508), `.kit-cadre` (571). C'est là qu'il faudra regarder au relevé,
pas sur `.carte`.

**regime-noir.css:22, `--c-filet: rgba(255,255,255,0.11)`, laissé à 0,11.** Le
brief nomme :20 et :23, pas :22. Je ne l'ai pas bougé. Conséquence à connaître :
`--c-filet` et `--c-filet-sombre` disaient la même chose (0,11) et disent
maintenant deux choses différentes (0,11 et 0,13).

**Les 7 littéraux `rgba(255,255,255,0.11)` de regime-noir.css, laissés.** Lignes
131, 140, 143, 156, 161, 163, 171. Ils court-circuitent `--c-filet-sombre` :
monter le jeton à 0,13 ne les touche pas, et ce sont eux qui portent les filets
du régime noir sur `.infolettre`, `.carte-lavande`, `.mesures`, `.faq`,
`.comparatif`, `.sommaire`, `.ligne-icone`, `.kit-ou`. **En clair : la tâche 2.6
n'atteint quasiment rien en régime noir tant que ces 7 littéraux sont là.** Ce
n'était pas dans le brief (qui ne demandait de suivre le mouvement que pour les
littéraux d'encre 0,45), je ne les ai pas changés de moi-même, et je le signale
comme le prochain geste évident.

**`rgba(0,0,0,0.5)` à regime-noir.css:88** (`.cf-cite`, `.cf-placeholder`,
`.vv-ref`), laissé. Il n'était pas nommé, et il est maintenant PLUS PÂLE (0,50)
que ses voisins de bloc passés à 0,54, ce qui est une petite incohérence
d'inventaire, pas un défaut de contraste (0,50 rend 3,84:1, encore sous 4,5).
Si on veut le seuil partout, c'est la ligne suivante à traiter.

**Les trois autres interlignes, vus et non touchés** comme demandé, une seule à
la fois. Ils ne sont d'ailleurs PAS dans mes deux fichiers, ils sont tous dans
composants.css : `:26` `.t-lead` à 1,66 ; `:403` `.citation` à 1,65 ; `:528`
`.recit p,.recit li` à **1,78** (celui-là n'était pas dans la liste du brief).
Dans mes fichiers il reste `body` à 1,7 (base.css:115) et `.t-body-lg` à 1,7
(base.css:134), plus les interlignes de titres, qui sont un autre sujet.
Le chantier a donc **6 déclarations à 1,6** (toutes dans composants.css) et 5
valeurs différentes au-dessus de 1,6, pas 4.

**Le « +386 px » de la tâche 2.8 ne se reconstitue pas.** Compté sur la page
noire : 7 éléments `.section`, mais 4 d'entre eux annulent leur `padding-top` en
inline et un cinquième annule les deux. Il ne reste que **8 rembourrages
réellement pilotés par `--pad-section`** :

| section | style inline | rembourrages pris au jeton |
|---|---|---|
| 1 | `padding:0 0 84px` | 0 |
| 2 | `padding-top:56px` | 1 |
| 3 | (aucun) | 2 |
| 4 | `padding-top:0` | 1 |
| 5 | `padding-top:0` | 1 |
| 6 | (aucun) | 2 |
| 7 | `padding-top:0` | 1 |

Donc : **148 -> 144 fait exactement -32 px** sur `01-accueil-noir.html` (8 x 4).
Et l'écart avec le régime clair n'est pas de 386 px de ce fait : 148 contre 128
ne pèse que 8 x 20 = **160 px**, soit 41 % du +386. Le reste vient d'ailleurs, et
le suspect le plus probable est `regime-noir.css:59-62` : `.t-display` y monte à
40 px contre 32 en clair, et la page noire porte **8** `.t-display`. Je ne l'ai
pas touché (hors brief), mais l'orchestrateur devrait s'attendre à ne récupérer
que 32 px sur cette tâche, pas 386.

**Aucun PLAN.md écrit dans le dépôt.** Le brief tenait déjà le plan complet
(fichier, ligne, ancien -> nouveau, contrôle), l'orchestrateur rejoue le relevé
derrière moi, et la consigne du chantier est de ne pas poser de PLAN.md pour le
banc. Les sauvegardes des deux fichiers d'origine sont dans le bac à sable de la
session si un retour arrière est nécessaire.

---

## À re-mesurer par l'orchestrateur, dans cet ordre

1. **Le bloc « cycle » de `01-accueil-noir.html`** (`.t-label` sur `.t-body`,
   pages/01-accueil.html:123 et :138). 0,46 point de contraste entre les deux
   encres, ça se juge à l'œil et ça peut demander un arbitrage sur `--c-text-2`.
2. **Le lien « Voir les autres cas »**, qui doit rendre #8A93FF, et la citation
   CPSIA juste au-dessus, qui doit rester #0008CF. Les deux sont sur la même page.
3. **Les hauteurs de page**, partout : `.t-body` passe de 25,8 à 24,0 px de ligne,
   soit -1,8 px par ligne de corps sur les 25 pages. Sur un paragraphe de 9
   lignes ça fait -16 px, et la carte qui le contient peut se désaligner de sa
   voisine. C'est le changement de cette passe qui touche le plus de pixels.
4. **La page noire**, qui doit perdre 32 px et pas davantage.
5. **Les filets** sur `.carte-lavande`, `.mesures`, `.faq`, `.comparatif`,
   `.sommaire`, `.kit-cadre` et le chrome des écrans app : c'est là que
   `--c-border` se voit, pas sur `.carte`.
