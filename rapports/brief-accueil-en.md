# Le jumeau anglais de l'accueil, aligné sur le brief du 28/08

Fichier édité, et lui seul : `/Users/naomiehalioua/cleo-maquettes-edge/pages/01-accueil-en.html`
Source qui fait autorité : `/Users/naomiehalioua/cleo-maquettes-edge/pages/01-accueil.html`
Copie de l'avant : `…/scratchpad/01-accueil-en.avant.html`

La page a été réécrite en entier, assumée, jamais découpée par index de chaîne.
`PLAN.md` était déjà à la racine et couvrait ce travail, jumeau anglais compris :
la porte du plan était donc franchie avant que j'écrive.

## Les onze points, un par un

| # | Ce qui était là | Ce qui y est | Traduit ou recopié |
|---|---|---|---|
| 1 | Hero : « Contact us » + « Free trial » | **Book a demo**, seul, vers `https://meetings.hubspot.com/anaelle-guez/rendez-vous` | libellé pris dans `commun/pied-en.html`, qui sert déjà cette URL |
| 2 | rien au-dessus des logos | **Trusted by international brands and manufacturers** | traduit, sans chiffre |
| 3 | « Every function has been automated… » + chapô | **Eliminate product compliance blind spots. Once and for all.**, chapô supprimé | recopié tel quel |
| 4 | 3 « Free trial » (hero, Overview, CTA final) | **0** | les trois mènent au rendez-vous |
| 5 | « A standing reliance on outside firms… » | **It's like having a full compliance department without hiring one** | recopié tel quel, apostrophe droite comprise |
| 6 | les 3 features sans titre de section | section **Key features** + **Cleo makes product compliance simpler to manage** | surtitre recopié, titre traduit |
| 7 | Regulatory Change / Compliance / Research, gros paragraphes | **Regulatory Change Agent · Compliance Agent · Research Agent**, grande image, puces courtes | les noms et les onze puces recopiés tels quels du français |
| 8 | section CAS CLIENT + témoignage | **le témoignage seul** | le cas part avec ses trois chiffres |
| 9 | « What the machine proposes, a human validates. » | **Built by regulatory experts, for regulatory experts** | recopié tel quel |
| 10 | rien | **section L'ENCODAGE** : la dispersion à gauche, la règle encodée à droite | traduit |
| 11 | « A new country is no longer a project. » + 2 boutons | **Make compliance your competitive advantage.** + le paragraphe + **Request a demo** | titre et paragraphe traduits, le libellé du bouton recopié tel quel |

Le titre du hero et son sous-titre n'ont pas bougé d'un caractère : ils étaient
déjà les textes dictés.

## La citation de Philippine Tamic

Elle n'a pas été retraduite, et elle n'avait pas à l'être : la page anglaise
portait déjà la version vérifiée. Comparée caractère par caractère à la clé
`en:` de `/Users/naomiehalioua/cleo-landing/src/components/landing/DecathlonQuote.tsx`,
elle est **identique**. Elle sort du fichier telle qu'elle y est entrée.

## Les contrôles, et ce qu'ils rendent

Aucun script de la chaîne n'a été lancé. Les contrôles sont des mesures faites
sur les deux fichiers.

| Contrôle | Résultat |
|---|---|
| Nombre de balises FR / EN | **541 / 541** |
| Balises qui diffèrent | **1**, et c'est l'`alt` du portrait d'Anaëlle, traduit à dessein |
| Les 13 `src="img:…"` | **identiques**, dans le même ordre |
| Les 8 `href` | **identiques**, dans le même ordre |
| Les 18 `data-anim` | **identiques** |
| Les 185 `class` | **identiques**, dans le même ordre |
| Les 16 commentaires de section | **identiques**, `<!--NAV-->` et `<!--PIED-->` en place |
| « Free trial » / « Essai gratuit » | **0** |
| Élément portant deux `class` | **0** |
| `font-size` en `style=` inline | **0** |
| Monospace, `font-family`, `<code>` | **0** |
| Emoji dans le texte rendu | **0** |
| Tiret cadratin | **1**, à l'intérieur de la citation vérifiée, et nulle part ailleurs |
| Ensemble des chiffres de la page | **strictement le même qu'en français** |

Ce dernier contrôle est celui qui compte pour l'intégrité : j'ai extrait tous
les nombres des deux fichiers et comparé les deux ensembles. Ils sont égaux.
Aucun chiffre n'est né de la traduction.

## Trois choses à savoir

**Le ⚠️ du commentaire de l'encodage.** La consigne dit zéro emoji, et la
consigne dit aussi commentaires identiques. Le commentaire français porte un
⚠️ (« Naomie référençait une image d'exemple qui n'est pas passée dans le
message »). Je l'ai gardé au caractère près : c'est du commentaire, il ne
s'affiche pas, et le faire diverger aurait cassé le miroir sur le seul avis
qui compte pour la suite du travail. Rien dans le texte rendu ne porte d'emoji.

**La ligne de confiance a été traduite, pas reprise.** Le français dit « Aux
côtés de marques et de fabricants internationaux » et cette phrase existe déjà
dans 04-secteur, 05-marche, 09-texte et 20-campagne. Ces quatre pages n'ont pas
de jumeau anglais : il n'existait donc aucune version anglaise validée à
recopier. J'ai écrit **Trusted by international brands and manufacturers**,
c'est-à-dire la ligne de confiance que `PLAN.md` appelait, moins son chiffre.
Le « +1 000 » du plan n'est pas rendu : il n'est sourcé nulle part dans le
dépôt. La phrase se tient sans lui, exactement comme en français.

**Le bouton du hero dit « Book a demo », pas « Request a demo ».** Ce n'est pas
un choix : c'est le libellé que `commun/pied-en.html` sert déjà pour cette même
URL HubSpot. Le seul « Request a demo » de la page est celui de la clôture,
qui était dicté.
