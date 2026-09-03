# en-25-skills, jumeau anglais de la page Skills

Fichier créé, un seul : `/Users/naomiehalioua/cleo-maquettes-edge/pages/25-skills-en.html`
Source recopiée : `/Users/naomiehalioua/cleo-maquettes-edge/pages/25-skills.html` (293 lignes)
Résultat : 293 lignes, alignement ligne à ligne avec la source.

Rien d'autre n'a été touché. `sortie/` n'a pas été ouvert.
Ni `construire.mjs`, ni `capturer.mjs`, ni `verifier.mjs` n'ont été lancés.

---

## Les contrôles, et ce qu'ils rendent

Mesures faites sur les deux fichiers, sans lancer la chaîne.

| Contrôle | FR | EN | Résultat |
|---|---|---|---|
| Nombre de balises | **535** | **535** | égal |
| Balises qui diffèrent, position par position | | | **0** |
| Attributs `class` | 115 | 115 | **identiques, même ordre** |
| Attributs `style` | 107 | 107 | **identiques, même ordre** |
| `href` | 2 | 2 | **identiques** (`12-article.html`, `11-blog.html`) |
| `src="img:…"` | 0 | 0 | la page n'en porte aucune |
| `data-anim` / `data-anim-groupe` | 1 + 4 | 1 + 4 | **identiques** |
| Commentaires (dont `<!--NAV-->`, `<!--RES-NAV:Skills-->`, `<!--CTA-->`, `<!--PIED-->`) | 13 | 13 | **identiques, texte compris** |
| Élément portant deux `class` | 0 | 0 | aucun |
| `font-size` en `style=` inline | 0 | 0 | aucun |
| `grid-template` en `style=` inline | 0 | 0 | les grilles restent en classes `.g2 .g3 .g4` |
| Tiret cadratin U+2014 | 0 | 0 | aucun |
| Tiret demi-cadratin U+2013 | 0 | 0 | aucun |
| `font-family`, `monospace` | 0 | 0 | aucun |
| Emoji | 0 | 0 | aucun (le `═` compté par la machine est un filet de commentaire, déjà dans la source) |

Une seule différence structurelle possible aurait été un `alt` : la page n'en a
pas. Les 535 balises sont donc identiques une à une, sans exception.

### La preuve que les nombres sont les mêmes

Tous les nombres du **texte visible** ont été extraits des deux fichiers
(commentaires et balises retirés) et les deux ensembles comparés. Ils sont
**strictement égaux**, occurrence par occurrence :

`01` ×1 · `02` ×1 · `03` ×1 · `6` ×1 · `18` ×3 · `27` ×3 · `45` ×6 ·
`71` ×1 (EN 71) · `106` ×1 (pays) · `963` ×1 (ASTM F963) · `15` ×1 et `15.247` ×1
(FCC Part 15) · `38.3` ×1 (UN38.3) · `1169/2011` ×1 · `1223/2009` ×2 ·
`2011/65` ×1 (RoHS) · `2014/53` ×1 (RED)

Rien en plus côté anglais, rien en moins. Aucun chiffre, aucune date, aucun nom
propre n'a été ajouté : la page en ligne cleolabs.co/en/skills affiche par
exemple « 250+ downloads », « 4 skills called », « 12 sources », « 0.6s » ; ces
chiffres ne sont **pas** dans la maquette française, ils ne sont donc pas entrés
dans la maquette anglaise.

---

## Ce qui vient de la vraie page anglaise

`https://www.cleolabs.co/en/skills` existe. Quand un texte français avait déjà
son équivalent anglais publié, j'ai repris **le texte publié** plutôt que ma
propre traduction :

- le chapô : « 45 open-source skills. One command to install. Works with Claude Code, Cursor, ChatGPT desktop, and any MCP client. »
- « 6 verticals. 45 skills. »
- les six cartes de verticales : Cosmetics, Food, Electronics, Toys, Textiles, Supplements, et leurs définitions (« INCI labelling, claims », « CE marking », « Fibre composition, Oeko-Tex, traceability, green claims », « health claims, novel food »)
- les trois temps : « Install. Ask. Ship. » et leurs trois descriptions
- « One question. One sourced answer. »
- les cinq questions de la FAQ
- le pied de bloc : « MIT · zero telemetry · zero account required »

L'inventaire des 45 skills (les deux blocs « 27 par famille de produit » et
« 18 de méthode ») n'existe pas sur la page en ligne : ces libellés sont ma
traduction des descriptions françaises, sans ajout.

## Ce qui n'a pas été traduit, à dessein

- **Les 45 noms de skills** (`cosmetics-compliance`, `substance-screening`, …).
  Ce sont les identifiants exposés par le serveur MCP : les traduire les
  rendrait faux. Ils sortent caractère pour caractère comme en français.
- **Skills**, le titre `h1`, et **Skills Library** dans la FAQ : nom d'offre.
- **Les textes réglementaires et leurs numéros** : PPWR-style intact partout,
  CPNP, EU 1223/2009, FDA MoCRA, FSMA, INCO 1169/2011, EFSA, nutri-score, FCC,
  RED, RoHS, REACH, PSE Japan, EN 71, CPSIA, ASTM F963, Oeko-Tex, DGCCRF,
  FDA DSHEA, novel food, CSRD, CSDDD, EUDR, UN38.3, DOT, SVHC.
- **La commande d'installation** `npx -y @cleo-labs/skills-mcp@latest`, les noms
  de clients (Claude Code, Claude Desktop, Cursor, Continue, ChatGPT desktop),
  les places de marché (Amazon, Shopify, Etsy, Walmart, TikTok Shop), MCP,
  stdio, MIT, INCI, CAS.
- **Le marqueur `<!--RES-NAV:Skills-->`** : même clé qu'en français, c'est un
  identifiant interne au générateur.
- **Les commentaires de section**, laissés en français : ce sont des notes
  d'atelier, jamais rendues, et le jumeau de l'accueil les garde aussi
  identiques.

## Les trois arbitrages de vocabulaire, déclarés

1. `UE` → `EU` dans les numéros de directive : `RED 2014/53/UE` devient
   `RED 2014/53/EU`, `RoHS 2011/65/UE` devient `RoHS 2011/65/EU`. C'est la forme
   officielle du **même** texte, pas un autre texte. Le numéro ne bouge pas.
   Idem pour « déclaration UE de conformité » → « EU declaration of conformity »
   et « déclaration UE » (carte Jouets) → « EU declaration ».
2. `REP` → `EPR` et `MACF` → `CBAM` dans `sustainability-compliance` et
   `packaging-compliance` : ce sont les sigles anglais officiels des mêmes
   instruments (responsabilité élargie du producteur, mécanisme d'ajustement
   carbone aux frontières). Laissés en français, ils seraient illisibles pour un
   lecteur anglophone. Aucun instrument n'est ajouté ni retiré : cinq sigles
   entrent, cinq sortent.
3. Les guillemets français « quoi » / « comment » de la FAQ deviennent les
   guillemets anglais courbes (`&ldquo;what&rdquo;` / `&ldquo;how&rdquo;`), comme
   sur le jumeau de l'accueil.

Traductions non littérales assumées, deux : « gilets » (sporting-goods) rendu
par `vests`, faute de source qui dise s'il s'agit de gilets de sauvetage ; et
« porteurs » (toy) rendu par `ride-ons`, terme du secteur.

## Le point ouvert, que je n'ai pas touché

`construire.mjs` ligne 44 ne déclare que `25-skills.html`. Le jumeau anglais
n'est **pas** dans la table `PAGES` : tant qu'une ligne
`{ fichier: '25-skills-en.html', titre: 'Skills EN', source: 'cleolabs.co/en/skills', en: true }`
n'y est pas ajoutée, la page ne sera pas construite. C'est une modification d'un
fichier existant : elle demande un `PLAN.md` et un feu vert, je m'arrête donc
ici et je le signale.

Deuxième point, hérité et identique en français : `resNav()` (ligne 517) ne
connaît que des libellés français (Tout, Rencontres, Modèles, Publications,
Glossaire) et la clé `Skills` ne correspond à aucune entrée, donc aucun lien
n'est marqué actif. Le comportement est le même des deux côtés ; le corriger
serait un changement de générateur, hors mission.
