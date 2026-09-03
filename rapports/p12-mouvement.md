# P12 — mouvement.css : plus aucun « ease » implicite, le survol de carte glisse

Fichier touché, et lui seul : `/Users/naomiehalioua/cleo-maquettes-edge/commun/mouvement.css`
Sauvegarde de l'état d'avant : `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/b2f63723-bbd9-4e6c-bd21-a258f3d96771/scratchpad/mouvement.css.avant`

Rien d'autre n'a bougé (`find -newermt` ne rend que ce fichier). `sortie/` n'a pas
été ouvert. Ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs`, ni
`temoin.mjs` n'ont été lancés.

Les numéros de ligne « ancien » renvoient au fichier d'avant, les « nouveau » au
fichier tel qu'il est maintenant.

---

## Un changement par ligne

### Tâche 2.1 + 2.2 — le bloc des survols de carte

**ancien 51 → nouveau 56**
`.carte,.res-carte,.terme-carte,.ligne-liste{`
→ `.carte,.carte-encre,.res-carte,.terme-carte,.ligne-liste{`
(ajout de `.carte-encre`, tâche 2.2)

**ancien 52 → nouveau 57-58**
`transition:border-color var(--dur-survol) ease, box-shadow var(--dur-survol) ease,`
→ `transition:border-color var(--dur-survol) ease-out, box-shadow var(--dur-survol) ease-out,`
(deux `ease` nus → `ease-out`)

**ancien 53 → nouveau 58**
`transform 0.05s ease}`
→ `transform var(--dur-survol) ease-out}`
(tâche 2.3 côté carte : la durée passe de 0,05 s à 0,15 s, la courbe est choisie)

### Tâche 2.1 + 2.3 — le bouton

**ancien 54 → nouveau 59-60**
`.btn{transition:background var(--dur-survol) ease, border-color var(--dur-survol) ease,`
→ `.btn{transition:background var(--dur-survol) ease-out, border-color var(--dur-survol) ease-out,`

**ancien 55 → nouveau 60-61**
`color var(--dur-survol) ease, transform 0.05s ease, box-shadow var(--dur-survol) ease}`
→ `color var(--dur-survol) ease-out, transform var(--dur-survol) ease-out,`
  `box-shadow var(--dur-survol) ease-out}`
(le `transform` passe de 0,05 s à `var(--dur-survol)` : les cinq propriétés du
bouton partagent enfin une seule durée. Le `translateY(-1px)` n'a pas été
touché — il vit dans `composants.css:105`, qui n'est pas mon fichier, et il
relève de la DA.)

### Tâche 2.1 — la navigation et le pied

**ancien 56 → nouveau 62**
`transition:color var(--dur-survol) ease,` → `transition:color var(--dur-survol) ease-out,`

**ancien 57 → nouveau 63**
`background var(--dur-survol) ease}` → `background var(--dur-survol) ease-out}`

### Ajouts de commentaire (aucun effet de rendu)

**nouveau 50-55** — six lignes de commentaire au-dessus du bloc des survols, qui
écrivent noir sur blanc pourquoi le survol est en `ease-out` et pas sur
`var(--ease-reveal)` : 7,1 % de course à 20 % du budget contre 30,7 %. C'est le
piège mesuré, il est maintenant dans le fichier.

### Réparation de cascade (voir « Ce que j'ai trouvé en plus »)

**nouveau 68-87** — un bloc neuf, inséré après `.res-carte .lien svg,.bandeau .fleche`.
Rien n'a été retiré pour lui faire de la place.

```
[data-anim].vu.carte,[data-anim].vu.carte-encre,[data-anim].vu.res-carte,
[data-anim].vu.terme-carte,[data-anim].vu.ligne-liste,
[data-anim-groupe].vu > .carte,[data-anim-groupe].vu > .carte-encre,
[data-anim-groupe].vu > .res-carte,[data-anim-groupe].vu > .terme-carte,
[data-anim-groupe].vu > .ligne-liste{
  transition:opacity var(--dur-reveal) var(--ease-reveal),
             transform var(--dur-reveal) var(--ease-reveal),
             border-color var(--dur-survol) ease-out,
             box-shadow var(--dur-survol) ease-out}
```

---

## Ce que j'ai trouvé en plus, et pourquoi j'ai ajouté un bloc

Ajouter `.carte-encre` à l'ancienne ligne 51 était nécessaire mais **ne suffisait
pas** à faire glisser la bordure. Deuxième cause, vérifiée dans le code :

1. Les trois cartes de features de l'accueil portent `data-anim="monte-court"`
   (`pages/01-accueil.html:158`, `:172`, `:186`). Elles sont donc à la fois une
   surface de survol et une cible de révélation.
2. `commun/mouvement.js` ajoute la classe `vu` **et ne la retire jamais**
   (`e.target.classList.add('vu'); obs.unobserve(e.target)`). La seule autre
   classe posée ensuite, `pose`, ne change que `will-change`.
3. Donc `[data-anim].vu` (poids 0,2,0) s'applique en permanence à ces cartes et
   l'emporte sur `.carte-encre` (poids 0,1,0), quel que soit l'ordre des
   fichiers. Sa liste de transition ne contient que `opacity` et `transform`.
   `border-color` et `box-shadow` n'y sont pas : ils changent donc **sans
   transition**, instantanément. C'est exactement le symptôme mesuré (valeur
   finale `rgba(255,255,255,0.22)` dès la première image, plus rien sur les 22
   suivantes ; et `commun/regime-noir.css:141-142` confirme que 0,22 est bien la
   valeur de survol en champ profond).
4. Même chose pour les cartes qui sont enfants directs d'un `[data-anim-groupe]`
   (`[data-anim-groupe].vu > *`, poids 0,2,0 lui aussi) : il y en a, par exemple
   `pages/03-offre.html:114` (`carte-encre p40`), `pages/04-secteur.html:141` et
   `:182` (`carte`), `pages/05-marche.html:144` (`carte`).

Le bloc neuf remonte à 0,2,0 + 1 classe = **0,3,0**, ce qui passe devant les deux
sélecteurs de révélation, et il **rejoue la révélation à l'identique** dans la
même liste (`opacity` et `transform` sur `--dur-reveal` / `--ease-reveal`). La
révélation de 12 px reste donc à 0,5 s sur notre courbe ; seuls `border-color` et
`box-shadow` s'ajoutent, à 0,15 s en `ease-out`.

### Le piège du transform, tel que je l'ai vérifié

Consigne : ne pas laisser une transition raccourcie écraser la révélation.

- Dans le bloc de survol (nouveau 56-58), `transform` est bien listé, mais à
  0,15 s. Il ne peut pas casser la révélation, parce que ce sélecteur pèse 0,1,0
  et que `[data-anim].vu` / `[data-anim-groupe].vu > *` pèsent 0,2,0 : la
  révélation gagne par **spécificité**, pas par ordre. Vérifié aussi que la
  spécificité, et non l'ordre, tranche ici — les deux poids sont différents.
- Dans le bloc neuf (0,3,0), `transform` est explicitement remis à
  `var(--dur-reveal) var(--ease-reveal)`. Il n'y a donc aucun endroit où
  `transform` tombe à 0,15 s ou 0,05 s sur un élément révélé.
- Jamais `all` : les propriétés sont listées une par une dans les deux blocs
  (vérifié : `grep -n "transition:all\|transition: all"` ne rend rien).
- Aucune carte ne bouge au survol de toute façon : `composants.css` n'a pas de
  `transform` sur `.carte:hover`, `.res-carte:hover` met `transform:none`
  (`composants.css:461`) et `regime-noir.css:142` met `transform:none` sur
  `.carte:hover,.carte-encre:hover`. Le seul `transform` de survol du site est le
  `translateY(-1px)` du bouton, et aucun bouton ne porte `data-anim` ni n'est
  enfant direct d'un `[data-anim-groupe]`.

---

## Déclarations en double : laquelle gagnait, avant

**Je n'ai supprimé aucune déclaration.** Mais il y a bien un doublon, et il faut
qu'il soit écrit quelque part, parce qu'il décide du rendu :

`commun/composants.css:164` déclare déjà
`.carte,.carte-tiede,.carte-encre,.carte-sombre{transition:box-shadow var(--dur-normal) var(--ease-apple)}`
et l'ancienne ligne 51 de `mouvement.css` déclarait une transition sur `.carte`.

**Qui gagnait avant mon changement :** les deux sélecteurs pèsent 0,1,0, donc
c'est l'ordre du fichier qui tranche, et `construire.mjs:336-343` insère les CSS
dans cet ordre : `base`, `composants`, `regime-noir`, **`mouvement` en dernier**.
`mouvement.css` gagnait donc déjà pour `.carte`. En revanche `.carte-encre`
n'était pas dans sa liste : pour elle, `composants.css:164` restait seul debout,
c'est-à-dire `box-shadow` en 250 ms `ease-apple` et **aucune transition sur
`border-color`**. C'est la deuxième moitié de l'explication du saut de bordure.

**Ce que ça change maintenant :** en ajoutant `.carte-encre` à la ligne 56 de
`mouvement.css`, sa `box-shadow` passe de 250 ms `ease-apple` à 150 ms
`ease-out`, exactement comme `.carte` depuis toujours. C'est un alignement, pas
une divergence — mais c'est un vrai changement de durée sur `.carte-encre`, et il
est visible au relevé.

J'ai laissé `composants.css:164` en place : ce n'est pas mon fichier, et
supprimer la déclaration perdante ne changerait rien au rendu tout en risquant de
casser `.carte-tiede` et `.carte-sombre`, que `mouvement.css` ne reprend pas.

---

## Vérifié

Tous les comptages sont faits à la commande, sur le fichier avant et après.

| Contrôle | Avant | Après |
| --- | --- | --- |
| `var(--dur-survol) ease` suivi de `,` ou `}` | **8** | 0 |
| `transform 0.05s ease` | 2 | 0 |
| Mots-clefs `ease` nus dans une transition (` ease,` ou ` ease}`) | **10** | **0** |
| `ease-out` | 0 | 13 |
| Chaîne `0.05s` où que ce soit dans le fichier | 2 | 0 |
| Déclarations `transition:` | 11 | 13 (+1 bloc neuf, +1 retour à la ligne du bloc `.btn`) |
| `transition:all` / `transition: all` | 0 | 0 |
| Accolades ouvrantes / fermantes | 45 / 45 | 45 / 45 |
| `clamp(` dans le fichier | 0 | 0 (rien à espacer, garde-fou 1 sans objet ici) |
| Monospace ou emoji ajoutés | — | 0 (diff des lignes ajoutées, grep) |
| Fichiers modifiés dans le dépôt | — | 1, `commun/mouvement.css` |

Autres points contrôlés :

- **Le compte de la consigne était bas.** La tâche annonçait « six fois »
  `var(--dur-survol) ease` sur les lignes 51 à 57. Il y en avait **huit**
  (deux ligne 52, deux ligne 54, deux ligne 55, une ligne 56, une ligne 57), plus
  deux `transform 0.05s ease`, soit **dix** courbes par défaut au total sur ce
  bloc. Les dix sont traitées.
- **Aucune découpe par index.** Deux remplacements de chaîne exacte, l'un pour le
  bloc de survol, l'autre pour déplacer le bloc neuf sous
  `.res-carte .lien svg`. Le `diff` complet avant/après tient en deux hunks et ne
  contient aucune ligne voisine mangée.
- **Aucun bloc en `position:absolute;bottom:N` touché.** Je n'ai retiré aucun
  contenu : le seul retrait du diff est le remplacement du bloc de survol par
  sa version en `ease-out`, à nombre de règles constant. Garde-fou 4 sans objet.
- **`.carte-claire` / `.surface-sombre` (garde-fou 5)** : aucune surface n'a
  changé de camp, je n'ai touché ni à une couleur ni à un fond.
- **Les autres feuilles étaient déjà propres** sur ce point : les 11 `transition:`
  de `composants.css` tournent toutes sur `var(--ease-apple)`, et
  `base.css:104` définit `--transition-hover: all var(--dur-fast) var(--ease-apple)`.
  Aucun `ease` nu ailleurs dans `commun/`.
- **`prefers-reduced-motion` intact** : le bloc `@media` (nouveau 97-102) coupe
  toujours tout avec `transition:none !important` et
  `*{transition-duration:0.01ms !important}`. Mon bloc neuf n'a pas de
  `!important` et passe donc bien dessous.
- **Le hero reste figé** : `[data-sans-anim]` (fin de fichier) n'est pas touché.

---

## Laissé / non fait

- **`ease-in-out` ligne 94** (`.scene img.fond{animation:souffle 22s ease-in-out infinite}`)
  laissé tel quel. Ce n'est pas un `ease` implicite : c'est une courbe nommée,
  choisie, sur une **animation** de 22 s et non sur une transition, et symétrique
  comme doit l'être une respiration en boucle. La cible « plus aucun ease
  implicite » est atteinte sans y toucher.
- **Le commentaire d'en-tête, ligne 6**, dit encore
  « survols 0,15 s ease sur fond et bordure, 0,05 s sur transform » à propos de
  legora. C'est le seul `ease` nu qui reste dans le fichier, et il est dans un
  commentaire, sans effet de rendu. **Il contredit la mesure de la tâche 2.1**
  (« chez la référence, ease n'apparaît JAMAIS »). Je ne l'ai pas réécrit :
  c'est le relevé de quelqu'un d'autre, daté du 26/08, et corriger un relevé que
  je n'ai pas pris moi-même reviendrait à le falsifier. **À trancher par qui a
  fait la mesure** : soit le relevé du 26/08 est à corriger, soit celui de la
  tâche 2.1 l'est. Les deux ne peuvent pas être vrais.
- **Le `translateY(-1px)` du bouton** n'a pas été retiré, comme demandé. Il vit
  dans `composants.css:105`, hors de mon périmètre de toute façon.
- **`composants.css:164`** laissé en place — voir la section sur le doublon.
- **`.carte-tiede` et `.carte-sombre`** ne sont toujours pas dans la liste des
  survols de `mouvement.css`. Elles gardent donc `box-shadow` en 250 ms
  `ease-apple` depuis `composants.css:164`, courbe choisie, pas de `ease` nu :
  hors cible de la tâche. Je ne les ai pas ajoutées parce que la tâche nommait
  `.carte-encre` et elle seule, et parce que je n'ai pas de relevé de leur
  survol.
- **Aucun script lancé**, donc aucune mesure image par image de ma part. Ce
  rapport démontre le raisonnement de cascade et donne les comptages de texte ;
  **la preuve du glissement de bordure reste à faire au relevé** de
  l'orchestrateur.

---

## Ce que l'orchestrateur doit regarder au relevé

1. La bordure d'une `.carte-encre` de l'accueil (`pages/01-accueil.html:158`)
   doit maintenant prendre ~150 ms pour aller à `rgba(255,255,255,0.22)`, au lieu
   d'y être dès la première image.
2. La révélation `monte-court` de ces mêmes cartes doit toujours faire ses 12 px
   en 500 ms. C'est le point à vérifier en priorité : c'est ce que le bloc neuf
   protège.
3. L'ombre d'une `.carte-encre` au survol passe de 250 ms à 150 ms. Changement
   attendu, pas une régression.
4. Le bouton ne doit plus tressaillir : ses cinq propriétés arrivent ensemble à
   150 ms, le pixel de levée compris.
