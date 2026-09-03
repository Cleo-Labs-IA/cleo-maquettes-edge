# Assertion log — cleo-one-pager-a4.pdf

**8/8 verified against source · 0 marked estimate · 0 unverified · 5 contrôles d'absence, tous verts**

Rejouable sans réseau : `node one-pager-proof.mjs` (sortie `13 ✓`, code 0).
Témoin négatif exécuté le 03/09/2026 : `25,000` remplacé par `24,000` dans le livrable
fait tomber l'assertion 2 (`7/8`, code 1). Le contrôle n'est donc pas circulaire.

## Le livrable

One-pager A4 recto/verso, anglais, pour le side event **Product Safety in the Age of AI**,
Bruxelles, 9 septembre 2026. Public : industriels d'abord, régulateurs ensuite.
Tiré à ~100 exemplaires.

- Fabrication : `node construire.mjs` → `cleo-one-pager-a4.pdf` + `apercu-recto.png` + `apercu-verso.png`
- Mesuré au navigateur en `media: print` : recto 260 mm de contenu sur 297, verso 215,9 mm,
  0 élément coupé, 0 monospace, 1 seul élément coloré dans la masse, au plus 1 champ profond par page.
- PDF vérifié : 2 pages, MediaBox 209,9 × 297,0 mm.

## Le schéma du recto

Les quatre parutions, le produit et les trois verdicts sont ceux du **radar de l'accueil V6**
(`sortie/01-accueil.html`, direction B choisie par Naomie le 03/09/2026) : CPSIA section 101(a),
REACH annexe XVII, Proposition 65, et 21 CFR 101 qui ne touche pas le produit. Rien d'inventé.
Les traits sont tracés au chargement à partir des positions réelles, comme sur le site : un texte
plus long ne les décale pas.

## Les chiffres

Le canon (`depot-src/CANONICAL-FACTS.md`, figé par Naomie le 09/06/2026) est la source unique
des valeurs publiques. Ce sont des **chiffres marketing revendiqués**, pas des counts base :
la règle du canon interdit de mélanger les deux dans un même livrable, ce que ce one-pager tient.

| # | Valeur imprimée | Source | Vérification | Verdict |
|---|---|---|---|---|
| 1 | 106 countries covered | `depot-src/CANONICAL-FACTS.md` · Couverture pays | `**106 pays**` présent | PASS |
| 2 | 25,000 regulations indexed | `depot-src/CANONICAL-FACTS.md` · Régulations | `**25 000**` présent | PASS |
| 3 | 19,000 regulatory authorities followed | `depot-src/CANONICAL-FACTS.md` · Autorités | `**19 000**` présent | PASS |
| 4 | founded 2023 | `depot-src/CANONICAL-FACTS.md` · Fondation | « fondée 2023, société constituée 2024 » | PASS |
| 5 | Regulation (EU) 2023/988 | `cleo-rules/eu/eu-2023-988-art19-d-avertissements-offre.yaml` · `source.instrument` + CELEX `32023R0988` | lu dans le YAML | PASS |
| 6 | Article 19(d) | même règle · `source.article: "19"`, `source.point: "d"` | lu dans le YAML | PASS |
| 7 | applies since 13 Dec 2024 | même règle · `applicable_from: "2024-12-13"` | lu dans le YAML, reformaté en anglais | PASS |
| 8 | Citation Philippine Tamic, 496 caractères | `cleo-landing/src/components/landing/DecathlonQuote.tsx` · clé `en` | **injectée à la construction depuis le composant**, jamais retapée : verbatim par construction | PASS |

La ligne « Coverage figures published by Cleo Labs. » est imprimée sous les trois chiffres :
elle dit d'où ils viennent, sans les faire passer pour des counts base.

## Ce qui est volontairement ABSENT

| Retiré | Raison |
|---|---|
| Logos clients | Choix de Naomie le 03/09/2026 : aucun logo sur ce tirage |
| Longchamp · BIC · PMU · Kiabi | Interdits en print depuis le 03/07/2026 (`reference_cleo_print_client_clearance`) |
| NVIDIA | Présent dans la maquette du site, jamais tracé comme client |
| Balzac Paris · Mercedes-Benz · L'Occitane · SNCF Réseau | Sur cleolabs.co mais sans sign-off écrit tracé |
| 3 700+ sources officielles | Retiré des livrables print sur instruction de Naomie du 03/07/2026 |
| 2 812 règles encodées · 46 juridictions · 11 validées | Comptent autre chose que le canon marketing : les mélanger est interdit par le canon. À dire à la keynote, où le ratio de signature humaine a son contexte, pas sur le papier |
| ÷100 time-to-compliance · ÷10 coût · marché RegTech | Hors canon |
| « relues par des juristes du domaine » | Faux : 11 règles `validated`, `validated_by` jamais rempli |

## Confiance

- Chiffres 1 à 4 : **canon marketing confirmé par Naomie (data owner) le 09/06/2026**, non
  re-vérifiés contre Supabase, le canon le précise lui-même (unités marketing ≠ counts base).
  Les MCP `supabase-insight-prod` et `supabase-comply` étaient hors service le 03/09/2026,
  ce qui ne change rien ici : aucun count base n'est imprimé.
- Chiffres 5 à 7 : **vérifiés dans la règle encodée elle-même**, celle qui sert la démo de la
  keynote (RSGP article 19 d). Le papier et la scène disent donc la même chose.
- Chiffre 8 : **verbatim par construction**, le texte n'existe qu'à un seul endroit.
