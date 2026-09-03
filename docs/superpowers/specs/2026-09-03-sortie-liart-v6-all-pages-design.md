# Sortie Liart — design V6 sur toutes les pages

## Décision validée

La maquette `liart-v6-application-1.html`, validée par Naomie comme « la bonne direction », devient la référence visuelle du site de prévisualisation `sortie-liart`. La reprise porte sur les 45 routes publiques recensées dans `commun/chemins.json`, ainsi que sur la page 404 et les trois routes d’atelier déjà générées.

Le changement est une nouvelle peau et une nouvelle composition, pas une réécriture éditoriale. Les textes, chiffres, liens, formulaires, médias, métadonnées, données structurées, comportements et routes existants restent inchangés.

## Langage visuel

- Fond de page chaud : `#F9F8F6`.
- Surface élevée : `#FFFFFF`.
- Champ pâle : `#EFEEFB`.
- Champ crème : `#F1EEE3`.
- Encre : `#1A1A1A`.
- Champ profond : `#08093B` ; profondeur interne : `#12134F`.
- Action sur clair : `#0008CF` ; signal actif sur profond : `#4D57FF`.
- Coins : `8px`, `16px`, `24px`, puis pilule `9999px`.
- Largeur de page : `1320px`; gouttière : `clamp(20px, 3vw, 42px)`.
- Ombre de carte : `0 1px 2px rgba(8,9,59,.035), 0 18px 48px rgba(8,9,59,.075)`.
- Police : Satoshi locale, déjà livrée par le générateur.

Le bleu reste un signal rare. Il ne sert jamais, seul, de verdict de conformité. Aucun vert décoratif n’est ajouté. Les statuts restent distinguables par texte et icône.

## Composition commune

Chaque page reçoit :

1. une navigation chaude et légèrement translucide, avec la structure, les destinations et le menu mobile existants ;
2. un seul grand champ profond par page, normalement la première section du `<main>`, inscrit dans la page avec un rayon de `24px` ;
3. des chapitres suivants sur fond chaud, blanc, pâle ou crème ;
4. des cartes blanches, généreuses, bordées très légèrement, avec un rayon de `24px` ;
5. un CTA de clôture crème ou blanc, jamais une seconde grande bande sombre ;
6. un footer chaud et lisible, sans créer de second champ profond.

Les contenus longs gardent une mesure de lecture confortable. Les listes, tableaux, formulaires, fiches produit, cartes de sources et composants interactifs conservent leurs structures et gagnent uniquement le langage de surface V6.

## Accueil

Sur desktop, le premier écran devient une composition deux colonnes dans un panneau profond arrondi : promesse et formulaire à gauche, globe produit validé à droite. Le globe, son animation, ses produits et ses coordonnées ne sont pas réécrits. Sur mobile, la composition repasse sur une colonne avec le texte avant le globe.

Les blocs produits deviennent des cartes claires et profondes visuellement par leur ombre, pas par un empilement de champs noirs. La méthode devient un grand champ pâle. Le témoignage, la clôture et la sécurité restent présents ; la sécurité devient une grille de cartes claires afin de respecter le champ profond unique.

## Familles de pages

- `home` : accueil FR/EN.
- `company-proof` : entreprise et cas client.
- `product` : plateforme, Research, Compliance Data et Compliance as a service.
- `audience` : fabricants, importateurs/distributeurs, marketplaces, solutions, secteurs et marché.
- `regulation` : texte réglementaire et Legal Data.
- `resource-index` : ressources, blogs, recherche, skills, glossaire, événements et modèles.
- `article` : articles, terme, événement et poste.
- `trust-conversion` : sécurité, carrière, journal, plan MARIA, inscription, légal et campagne.
- `preview` : kit de composants et variantes d’atelier.
- `not-found` : page 404.

Les familles ne changent pas le contenu. Elles permettent uniquement des corrections de composition ciblées après le socle commun.

## Isolation et retour arrière

Le générateur ajoute `data-cleo-ds="v6"`, `data-v6-family` et `data-v6-page` sur `<body>`, à partir d’un manifeste versionné. Toutes les règles V6 sont préfixées par `body[data-cleo-ds="v6"]`. Les feuilles existantes restent intactes ; les nouvelles feuilles sont concaténées après elles par le mécanisme de lanes déjà présent.

Retirer une page du manifeste retire son activation. Supprimer les feuilles `v6-*` et les attributs du générateur restaure intégralement la présentation précédente.

## Responsive et accessibilité

- Cibles tactiles : `44px` minimum.
- Aucun débordement horizontal à `390 × 844` ou `1440 × 1100`.
- Focus visible en `#0008CF` sur clair et en blanc sur profond.
- Le menu mobile conserve son état ARIA, la fermeture Échap et le retour de focus existants.
- `prefers-reduced-motion: reduce` rend immédiatement chaque contenu compréhensible.
- La taille du texte fonctionnel ne descend pas sous `14px` sur mobile, hors micro-étiquettes purement secondaires déjà validées.
- Un seul `<h1>` visible par route publique.

## Contrat de préservation

Le contrôle final compare les routes générées au manifeste et bloque si une page manque. Le build existant, `verifier.mjs`, `garde-seo.mjs`, les liens internes et les captures desktop/mobile sont exécutés sur les familles représentatives. Aucun déploiement Vercel ou portage dans `cleo-landing` ne fait partie de cette livraison locale.
