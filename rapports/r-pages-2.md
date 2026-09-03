# Rapport, lot pages 2

Renommage des trois features sur mes huit fichiers.
Monitoring -> Regulatory Change · Research -> Research (inchangé) · Réglementation -> Compliance.

Aucun fichier de `sortie/` touché. Aucun script lancé (ni construire, ni capturer, ni vérifier).

## Changements

Quatre lignes modifiées, cinq occurrences renommées. Toutes par remplacement de chaîne exacte,
avec assertion « la chaîne apparaît exactement une fois » avant écriture.

- `pages/00-composants.html:43` `<span class="kit-ou">Accueil · Réglementation</span>` -> `<span class="kit-ou">Accueil · Compliance</span>`
- `pages/00-composants.html:49` `<span class="kit-ou">Accueil · Monitoring</span>` -> `<span class="kit-ou">Accueil · Regulatory Change</span>`
- `pages/00-composants.html:92` `<span class="kit-ou">Monitoring</span>` -> `<span class="kit-ou">Regulatory Change</span>`
- `pages/06-cas-client.html:58` `<div class="valeur">Monitoring<br>Research<br>Réglementation</div>` -> `<div class="valeur">Regulatory Change<br>Research<br>Compliance</div>`

Pourquoi celles-là : les trois `.kit-ou` de la planche de composants sont des libellés d'index,
ils disent sur quelle page feature le composant sert. La ligne de `06-cas-client` est le champ
« Features utilisées » de la fiche latérale, qui énumère les trois features nommément.

Rien d'autre n'a été touché sur `00-composants.html`, conformément à la consigne.

## Vérifié

- « Monitoring » restant sur les huit fichiers : 0.
- « Regulatory Change » posé : 3 occurrences. « Compliance » posé comme nom de feature : 2 occurrences
  (les deux autres hits de « Compliance » sont le titre de poste de Philippine Tamic, intitulé réel, non touché).
- « Research » : 9 occurrences, toutes inchangées, réparties sur 5 fichiers
  (00-composants 3, 06-cas-client 1, ecran-chat 2, ecran-chat-fil 2, vignettes 1).
- Racine « réglementation / réglementaire » : 18 occurrences restantes, toutes jugées une par une (détail plus bas).
- Deux attributs `class` sur une même balise : 0 sur les huit fichiers.
- `clamp(` : 0 occurrence, donc rien à vérifier côté espaces autour du `+`.
- `font-family` ou déclaration monospace : 0. Le seul mot « monospace » est du texte de note qui dit
  justement de ne pas en mettre.
- Équilibre `<div>` / `</div>` inchangé et pair sur les huit fichiers : 203/203, 89/89, 41/41, 26/26,
  24/24, 8/8, 14/14, 46/46.
- Aucune découpe par index de chaîne, aucun `style=` ajouté, aucun `font-size` inline ajouté,
  aucune classe supprimée, aucun chiffre ajouté ni modifié.

## Laissé, avec la raison

Nom commun, aucun rapport avec la feature :

- `pages/00-composants.html:203` « volume massif de réglementations produits » : verbatim du témoignage Decathlon, on ne touche pas à une citation.
- `pages/00-composants.html:244` « La réglementation encodée » : ligne de positionnement Cleo sous le nom dans le tableau comparatif.
- `pages/00-composants.html:295` « des tâches définies par la réglementation » : définition du terme Mandataire.
- `pages/00-composants.html:314` « Juriste, encodage réglementaire » : intitulé de poste, adjectif.
- `pages/00-composants.html:322` et `:371` « affirmation réglementaire », « couverture réglementaire » : adjectifs.
- `pages/02-entreprise.html:84` et `:93` « Expert réglementaire », « Experte réglementaire » : rôles de l'équipe.
- `pages/02-entreprise.html:131` « Pays dont la réglementation est suivie » : libellé de mesure, nom commun.
- `pages/02-entreprise.html:132` « Réglementations indexées » : nom commun au pluriel, majuscule de début de libellé seulement.
- `pages/02-entreprise.html:133` « Autorités et organismes réglementaires » : adjectif.
- `pages/02-entreprise.html:163` « veille réglementaire » (MARIA) et `:187` « complexité réglementaire » : adjectifs.
- `pages/06-cas-client.html:29` « réglementations produits » : verbatim du témoignage.
- `pages/19-poste.html:6` et `:20` « encodage réglementaire », « un texte réglementaire » : titre de poste et adjectif.

Deux occurrences ambiguës, laissées volontairement, à trancher :

- `pages/12-article.html:90` « C'est exactement ce que la Réglementation encodée de Cleo produit ».
  Le R majuscule fait penser au nom de la feature, mais c'est du corps de texte d'article, pas un
  libellé de nav, un surtitre de carte, un titre de page feature ni un libellé d'index. Deux sorties
  possibles, aucune n'est un simple renommage : passer en minuscule pour retomber sur la ligne de
  positionnement maison (« la réglementation encodée de Cleo », graphie déjà utilisée en
  00-composants:244), ou réécrire la phrase autour de « Compliance ». Ça change la copie d'un article,
  je ne le fais pas sans arbitrage.
- `pages/19-poste.html:67` encadré « En bref », champ « Équipe » valant « Réglementation ».
  C'est un nom d'équipe interne sur une fiche de poste, pas un libellé de navigation. Si les équipes
  internes suivent les noms de features, ça devient « Compliance » ; si elles gardent leur nom métier
  français, ça reste. Besoin de la réponse avant de toucher.

## Non fait, hors périmètre

- `commun/pied.html:47-49` porte les trois entrées de pied (« Monitoring », « Research »,
  « Réglementation »). Le fichier n'est pas dans ma liste, je ne l'ai pas ouvert pour édition,
  seulement constaté. À couvrir par le lot qui possède `commun/pied.html` et le bandeau de nav,
  sinon le pied restera désaccordé avec les pages.
- Quatre tirets cadratins préexistants, non introduits par moi et non retirés faute de mandat :
  `pages/00-composants.html:253` et `:255` (le « — » vaut « non » dans le tableau comparatif, c'est un
  signe, pas de la ponctuation de phrase), `commun/vignettes.html:30` et `:34`
  (« Art. 6 §4 — Critères de conception », « Article 7 — Contenu recyclé », dans les titres de nœuds).
  Les deux derniers sont de la ponctuation de titre et gagneraient à passer en virgule ou deux-points.

## Trous laissés ouverts

Aucun fait manquant à combler : le renommage n'a réclamé ni chiffre, ni parcours, ni client, ni
certification. Rien n'a été inventé.
