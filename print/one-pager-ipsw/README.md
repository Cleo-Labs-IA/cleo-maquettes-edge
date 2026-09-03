# One-pager A4 recto/verso, side event IPSW

Papier remis en main propre à **Product Safety in the Age of AI**, Bruxelles, 9 septembre 2026.
Anglais, ~100 exemplaires. DA V6 du site, portée en print.

Chiffres imprimés : 8/8 verified against source, log dans `assertions.md`.

## Fabriquer

```bash
npm install qrcode --no-save     # seule dépendance, non versionnée
node construire.mjs              # PDF + aperçus PNG + mesures
node construire.mjs --mesure     # mesures seules, n'écrit rien
node one-pager-proof.mjs         # rejoue chaque chiffre contre sa source
```

Playwright est emprunté à `~/cleo-landing/node_modules`, comme `capturer.mjs` du dépôt.

## Ce qui vient d'ailleurs, et n'est jamais retapé

| Élément | Source lue à la construction |
|---|---|
| Citation Philippine Tamic (EN) | `~/cleo-landing/src/components/landing/DecathlonQuote.tsx` |
| Logo Cleo | `~/cleo-landing/public/logo-blue.svg` |
| Satoshi variable | `sortie/fonts/Satoshi-Variable.woff2` |
| Chiffres publics | `depot-src/CANONICAL-FACTS.md`, via `one-pager-proof.mjs` |
| Règle du marquage | `~/cleo-essais-etiquetage/cleo-rules/eu/eu-2023-988-art19-d-avertissements-offre.yaml` |

## Contrôles bloquants de `construire.mjs`

Un défaut vécu par contrôle : contenu coupé par la feuille (le verso débordait de 43 mm au
premier tirage) · une police monospace · plus d'un élément coloré dans la masse · plus d'un
champ profond par page · un pied collé au contenu.

## Impression

PDF A4 exact (209,9 × 297,0 mm), sans fond perdu. Les aplats profonds touchent les bords :
si l'imprimeur demande du fond perdu, le dire, la feuille se régénère avec marge de coupe et
repères. Recto/verso, reliure bord long, pas de tête-bêche.
