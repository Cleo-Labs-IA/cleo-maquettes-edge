# Home preview — price assertion log

Checked on 2026-10-12 before the four prices were added to the FR/EN home preview.

## Queries

    curl -L --max-time 30 -A 'Mozilla/5.0' -sS https://www.cleolabs.co/fr/platform/compliance-service | rg -n -o '.{0,140}(399|1.?200|3.?800|1.?500|essais non compris|par catégorie).{0,220}'
    curl -L --max-time 30 -A 'Mozilla/5.0' -sS https://www.cleolabs.co/fr/compliance-as-a-service/evaluation-de-conformite | rg -n -o '.{0,140}(399|par produit).{0,220}'
    curl -L --max-time 30 -A 'Mozilla/5.0' -sS https://www.cleolabs.co/fr/compliance-as-a-service/mandataire-ue | rg -n -o '.{0,140}(1.?500|par an|par catégorie).{0,220}'
    git show 4a7fceb:pages/37-compliance-service.html | rg -n '399|1.?200|3.?800|1.?500'

## Raw observations and deduplication

| Claim | Live raw observation | Versioned source | Deduplication | Confidence | Verdict |
| --- | --- | --- | --- | --- | --- |
| Assessment — 399 € per product | 6 occurrences on the official offer page; the dedicated page also shows the same amount and unit | 5 raw occurrences at 4a7fceb, 4 rendered occurrences after excluding the source comment | Card, table, FAQ and JSON-LD are one tariff claim | High | PASS |
| Labelling — 1,200 € per product | Official pricing-table row: “À partir de 1 200 € par produit” | 3 client-visible occurrences at 4a7fceb | Card, table and FAQ are one tariff claim | High | PASS |
| CE marking — 3,800 € per product, testing excluded | 3 occurrences on the official offer page, all with the testing exclusion | Lines 62, 103 and 141 at 4a7fceb | Card, table and FAQ are one tariff claim | High | PASS |
| EU authorised representative — 1,500 € per year, per category | 4 relevant occurrences on the official offer page; the dedicated page confirms period and unit | 4 raw occurrences at 4a7fceb, 3 rendered occurrences after excluding the source comment | Card, table, FAQ and JSON-LD are one tariff claim | High | PASS |

Verified: 4/4 numbers checked against source · 0 marked estimate · 0 unverified

- 399 € · official Cleo offer + assessment page + 4a7fceb · queries above · PASS
- 1,200 € · official Cleo offer + 4a7fceb · queries above · PASS
- 3,800 € · official Cleo offer + 4a7fceb · queries above · PASS
- 1,500 € · official Cleo offer + authorised-representative page + 4a7fceb · queries above · PASS
