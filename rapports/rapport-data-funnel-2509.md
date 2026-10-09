# Page Data : l'API vendue en direct (25/09/2026)

Branche `feat/data-page-funnel`, dépôt cleo-site-v6. Fichiers : `pages/39-data.html`, `pages/39-data-en.html`,
`commun/lanes/v6-zzzzzzzz-39-data.css`.

## Base de la branche

Le worktree partait de `origin/main` (5f05785), qui a 55 commits de retard sur `origin/review/wording-2309` (645e80c),
la branche du site en ligne depuis la bascule du 23/09. Ces 55 commits touchent la page Data (liens vers
legaldata-public, section usage retirée, cartes tarifaires alignées sur le portail) et `construire.mjs` (chemin `ICI`
relatif ; sur 5f05785 il pointait en dur sur `~/cleo-maquettes-edge`). La branche, sans commit propre, a été avancée
en fast-forward sur 645e80c avant tout travail.

## Ce qui change

1. Haut de page : même titre, sous-titre nouveau, boutons « Get my sandbox key » (/signup) et « Try it without an account »
   (playground?tab=classify).
2. Customs Classification API, badge « In production » : titre et sous-titre du brief, requête réelle
   `POST /v2/customs/classifications` (T-shirt France), réponse réelle tronquée (ambiguous, 610910 à 0.95,
   Chapter 61 Additional Note 2, 61091000 cn8 EU à 0.92), trois puces, « Try it without an account » et « Docs ».
   Legal Data API en carte large sous le bloc Customs.
3. Nouvelle section `#acces`, les trois portes (déjà visée par les pages 52 et 53, l'ancre n'existait pas).
4. Tarifs : Sandbox, Starter (buy/starter?cadence=monthly), Pro (buy/pro?cadence=monthly), Enterprise ; ligne
   « One unit per request » sous les cartes.
5. Couverture : bloc 106 / 25 000 / 19 000 inchangé, ligne douane mesurée ajoutée.
6. FAQ : coût mis à jour, question sandbox ajoutée (7 questions, JSON-LD FAQPage régénéré).

## Chiffres et leur source

| Chiffre | Source | Statut |
|---|---|---|
| Sandbox 0 €, 200 unités à vie ; Starter 100 € (80 €), 100 000/mois, 60 req/min ; Pro 349 € (279 €), 1 000 000/mois, 300 req/min | décision de Naomie du 25/09 (brief) | décision, pas encore visible sur le portail |
| 112 pays sur 249 à la ligne nationale, 26 nomenclatures | `GET /v2/customs/coverage/countries` du 25/09 : 112 `national`, 137 `hs6_only`, 26 systèmes distincts ; mêmes chiffres dans /docs/customs | vérifié |
| Lots de 2 000 articles, webhooks, retour CSV | /docs/customs, 25/09 (« accepts 1 to 2,000 items ») | vérifié |
| 30 appels par jour sans compte | /playground?tab=classify, 25/09 (« 30 free calls left today on this IP ») | vérifié |
| Requête et réponse du T-shirt | capture réelle du 25/09 (docs-examples/classify-tshirt-fr-facts.json) | vérifié |
| Support le jour même et appel d'onboarding (Pro) | /pricing du portail, 25/09 | vérifié |
| 106, 25 000, 19 000 | chiffres canon du site, décision du 17/09 | inchangés |

## Tests

- `node construire.mjs` : 341 pages, tous les contrôles passent.
- `tests/audit-html.mjs`, `tests/seo-accueil.mjs`, `tests/servir-routes.mjs` (341 routes) : OK.
- `tests/v6-structure.mjs` : OK sans `sortie/index.html` ; `tests/v6-index.mjs` : OK après `node index.mjs`. Les deux
  tests se contredisent sur la présence de la galerie `index.html` ; conflit antérieur, sans lien avec la page Data.
- `garde-seo.mjs verifier` ne tourne pas en local (pas de sitemap dans `sortie/`). Comparaison ciblée prod contre local
  sur /en/data et /fr/data : titre, description, canonical, hreflang, og, types JSON-LD et h1 identiques ; FAQ 6 → 7
  questions, h2 6 → 7. Aucune URL ajoutée ni retirée.
- Jumeaux : même suite de 273 balises, classes, id et liens externes en FR et EN. Aucun débordement horizontal à
  1280 et 390 px, grilles identiques (tarifs 4 puis 1 colonne, portes 3 puis 1, Customs 2 puis 1).

Captures (non versionnées, `rapports/**/*.png` est ignoré) : `rapports/data-funnel-{en,fr}-{1280,390}.png`.

## Points ouverts

- Le portail legaldata-public affiche encore « Free, 3 API calls total » sur /pricing et « 3 free calls » sur /signup.
  La page promet 200 unités : à aligner côté portail avant de publier.
- L'ancre `#request-weight` n'existe pas sur /pricing (elle est sur /docs/customs#request-weight). Le lien va donc sur
  /pricing, comme le prévoit le brief.
- /docs/customs dit que le connecteur Shopify n'a jamais tourné sur une boutique réelle. La puce dit donc « un
  connecteur Shopify open source » et non « écriture Shopify ».
- Les liens buy/starter et buy/pro n'ont pas été appelés (ils peuvent ouvrir une session de paiement).
