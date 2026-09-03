# Brief châssis, 28/08 : tout mène à la démo

Cinq fichiers touchés, eux seuls. `sortie/` n'a pas été ouvert, aucun script
n'a été lancé.

## Une ligne par changement

| # | Fichier | Avant | Après |
|---|---------|-------|-------|
| 1 | `commun/bandeau-nav.html` l.134 | `<a class="btn btn-marque btn-sm" href="21-inscription.html">Essai gratuit</a>` | même balise, même classe, `href="https://meetings.hubspot.com/anaelle-guez/rendez-vous"`, libellé **Voir une démo** |
| 2 | `commun/bandeau-nav-en.html` l.134 | idem, `Free trial` | même href, libellé **Book a demo** |
| 3 | `commun/pied.html` l.17, colonne Cleo | `<li><a href="#">Essai gratuit</a></li>` | `<li><a href="https://meetings.hubspot.com/anaelle-guez/rendez-vous">Voir une démo</a></li>` |
| 4 | `commun/pied.html` l.18, colonne Cleo | absent | **ajout** `<li><a href="21-inscription.html">Demander un accès</a></li>` |
| 5 | `commun/pied-en.html` l.17, colonne Cleo | `<li><a href="#">Free trial</a></li>` | **Book a demo**, même href hubspot |
| 6 | `commun/pied-en.html` l.18 | absent | **ajout** `<li><a href="21-inscription.html">Request access</a></li>` |
| 7 | `construire.mjs`, constante `CTA` | h2 « On regarde vos produits ensemble ? » | h2 **« Faites de la conformité votre avantage concurrentiel. »** |
| 8 | `construire.mjs`, constante `CTA` | pas de paragraphe | `<p class="t-body">` avec le texte dicté, mot pour mot |
| 9 | `construire.mjs`, constante `CTA` | 2 boutons, `Essai gratuit` + `Réserver un créneau`, `href="#"` | **1 seul bouton**, `btn btn-marque`, libellé **Request a demo**, vers le lien hubspot |
| 10 | `construire.mjs`, constante `CTA_EN` | h2 « Shall we look at your products together? » | h2 **« Make compliance your competitive advantage. »** |
| 11 | `construire.mjs`, constante `CTA_EN` | pas de paragraphe | même `<p class="t-body">`, en anglais, même structure |
| 12 | `construire.mjs`, constante `CTA_EN` | 2 boutons, `Start for free` + `Book a slot` | **1 seul bouton**, **Request a demo**, **le même href** que la version française |

Rien d'autre n'a bougé dans `construire.mjs` : ni la liste des 25 pages, ni les
contrôles bloquants, ni le reste des gabarits.

## Où j'ai reposé la page orpheline

**Dans le pied de page, colonne « Cleo », sous l'appel à la démo**, en français
comme en anglais : « Demander un accès » / « Request access » vers
`21-inscription.html`.

J'ai choisi le pied plutôt que le méga-menu pour deux raisons vérifiées dans le
CSS : `composants.css` l.596 met `.nav-liens{display:none}` sous 1024 px, donc
une entrée posée dans un méga-menu disparaît sur téléphone, alors que le pied
reste visible sur tous les gabarits ; et le pied est injecté sur les mêmes 25
pages que la nav, le maillage est donc identique.

Le libellé est repris de la page elle-même, qui titre son formulaire « Demander
un accès » et dont le bouton dit « Demander l'accès ». Aucun parcours inventé,
aucune promesse ajoutée.

## Vérifié, avec les comptages

1. **`grep -i` de « essai gratuit », « free trial », « start for free », « book a
   slot », « réserver un créneau » sur les cinq fichiers → 0, 0, 0, 0, 0.**
2. **Balises, avant → après :**
   - `bandeau-nav.html` 341 → **341** (inchangé)
   - `bandeau-nav-en.html` 341 → **341** (inchangé)
   - `pied.html` 280 → **284**
   - `pied-en.html` 280 → **284**
   Les +4 des deux pieds sont exactement le `<li>` ajouté par la tâche 3
   (`<li>`, `<a>`, `</a>`, `</li>`). Les deux langues bougent du même nombre,
   elles restent jumelles.
3. **Équilibre ouvertes/fermées par balise**, mesuré fichier par fichier :
   `pied.html` et `pied-en.html` li 42/42, a 44/44, ul 10/10, div 30/30 ;
   `bandeau-nav.html` et `bandeau-nav-en.html` a 45/45, div 34/34. Aucun
   déséquilibre, et les deux paires FR/EN sont identiques au comptage près.
4. **Un seul `class=` par élément** : `grep` d'un second `class="` dans la même
   balise → 0 sur les quatre fragments.
5. **Zéro tiret cadratin ni demi-cadratin** dans les quatre fragments → 0.
   Le texte ajouté dans `construire.mjs` n'en contient pas non plus.
6. **`node --check construire.mjs` → syntaxe OK.** Les deux constantes sont des
   littéraux de gabarit valides ; le texte français contient des apostrophes,
   aucun backtick ni `${`.
7. **Le lien hubspot est présent une fois par fragment** (4 × 1) et **deux fois
   dans `construire.mjs`** (CTA et CTA_EN), au même href exact.
8. **Le contrôle de liens morts de `verifier.mjs` ne criera pas** : sa regex l.25
   saute les URL absolues (`if (/^(https?:)?\/\//.test(m[1])) continue`), et
   `21-inscription.html` figure bien dans la liste des pages construites
   (`construire.mjs` l.40), donc le lien du pied résout.
9. **Le contrôle d'équilibre `<p>` du builder** (l.510) reste vert : le bloc CTA
   ajoute un `<p>` et un `</p>`.
10. **Encre sur champ sombre** : le paragraphe porte `t-body`, et
    `base.css` l.147 fait `.sur-sombre .t-body{color:var(--c-text-on-dark-2)}`.
    Le bloc est dans `section.sur-sombre > .carte-encre`, l'encre bascule.
11. **Marge du paragraphe posée en dur.** `base.css` ne remet pas `p{margin:0}`
    (seuls `h1..h4` l.122), donc un `<p>` nu hériterait de la marge du
    navigateur. J'ai écrit `margin:20px 0 0`, comme le fait déjà
    `21-inscription.html`. Aucune `font-size` en inline, la classe seule décide.
12. **Zéro chiffre nouveau.** Le seul nombre du bloc CTA, « 30 minutes », était
    déjà là avant moi.

## Non fait, et pourquoi

- **Je n'ai pas retiré le chapô « 30 minutes avec l'équipe, pour regarder votre
  catalogue ».** Ta dictée donne un titre, un texte et un bouton, elle ne dit
  rien du chapô. Le supprimer aurait changé la composition sans consigne, et
  la phrase reste vraie avec un bouton de démo. **Dis-moi si tu le veux
  enlevé**, c'est une ligne.
- **Je n'ai pas touché aux pages.** `pages/01-accueil.html`, `02-entreprise`,
  `03-offre`, `04-secteur`, `05-marche`, `06-cas-client`, `07-chat`,
  `08-reglementation`, `09-texte` et `00-composants` portent encore leurs
  propres boutons « Essai gratuit » en dur : ils ne sont pas dans mon
  périmètre. Le compte global de « Essai gratuit » ne tombera à 0 que quand ces
  pages seront traitées.
- **Je n'ai pas modifié `commun/seo.json`**, qui décrit encore
  `21-inscription.html` par son ancien rôle (« c'est la cible des 10 liens
  Essai gratuit ») aux lignes 647 et 1087. Hors périmètre, mais à reprendre :
  la description ne correspond plus au maillage.
- **Je n'ai lancé ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs`, ni
  `temoin.mjs`**, comme demandé. Les contrôles ci-dessus sont statiques :
  comptages, équilibre de balises, `node --check`, et lecture des règles CSS et
  des contrôles du builder. **Le rendu n'a pas été regardé**, la construction
  reste à faire par qui pilote le chantier.
- **Aucun libellé sans source.** Le bouton dit « Request a demo » dans les deux
  langues parce que c'est le terme que tu as dicté ; la nav et le pied disent
  « Voir une démo » / « Book a demo », les libellés du brief.
