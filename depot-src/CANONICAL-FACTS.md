# Faits canoniques Cleo Labs — source de vérité unique (GEO)

> Toute surface publique (site, llms.txt, Product Hunt, Wikidata, kit presse, decks) DOIT utiliser EXACTEMENT ces valeurs. Des chiffres divergents = les moteurs génératifs ne corroborent pas = pas de citation.
> Verrouillé le 2026-06-09 par Naomie. Principe : « le dernier est le meilleur » (chiffres Atlas récents) + « aligner sur la presse » (figée).
> ⚠️ Source : valeurs confirmées par Naomie (data owner). Non vérifiées indépendamment contre Supabase (pas d'accès).

| Fait | Valeur canonique | Notes |
|---|---|---|
| **Levée** | 1,5 M€ pre-seed | Larry Berger/Amplify, La Financière Saint-James, Kima Ventures. Corroboré presse + site. |
| **Couverture** | **90 juridictions** | Aligné sur l'API le 2026-09-29 : `GET /v2/coverage` totals.jurisdictions = 90 (= `/v2/atlas/stats` jurisdictions_documented). Dire « juridictions », pas « pays » : la liste compte l'UE, l'ASEAN, des États fédérés. Remplace 106 pays (gardé le 2026-09-17). Volatil : 91 le 2026-09-28. |
| **Régulations** | **55 782** | `GET /v2/atlas/stats` regulations_canonical (fiches distinctes après fusion canonique ; 271 694 au total). Remplace 25 000. |
| **Autorités réglementaires** | **3 098** | `GET /v2/authorities`, 31 pages, 3 098 slugs uniques (= authorities_spine ; 2 391 avec un canal de veille vérifié). Remplace 19 000. |
| **Sources officielles** | 183 | `GET /v2/atlas/stats` sources_active = `/v2/coverage` totals.sources (151 avec documents > 0). Métrique secondaire. Remplace 3 700+. |
| **Douane, ligne nationale** | 112 pays et territoires sur 249, 26 nomenclatures | `GET /v2/customs/coverage/countries` : 112 « national », 137 « hs6_only ». |

> **TRIPLE HEADLINE depuis le 2026-09-29 (à valider par Naomie, PR fix/imp-site-numbers) : 90 juridictions · 55 782 réglementations · 3 098 autorités réglementaires.** L'ancien triple 106 / 25 000 / 19 000 (confirmé le 2026-06-09, gardé le 2026-09-17) est contredit par l'API.
| **Fondation** | **fondée 2023, société constituée 2024** | Réconcilie presse (2023) + SAS (2024-02-01). |
| **Moteur** | MARIA (Multi-Agent Regulatory Intelligence Architecture) | |
| **Clients (presse)** | Decathlon, Electrolux Professional | + Longchamp, BIC, PMU, Kiabi (site). |
| **Fondatrices** | Anaëlle Guez (CEO), Naomie Halioua | **2 cofondatrices uniquement.** Alexandre Bloch = membre de l'équipe (listé "maker" sur PH, OK), PAS cofondateur → n'ira pas dans Wikidata P112. |

## Surfaces à aligner sur ce canon
- [ ] Product Hunt — fiche "Cleo Atlas Legal API" à corriger : 256 000 / 177 jurid. → 25 000 / 106 pays (décision Naomie 2026-06-29, on purge 256 000 partout). Clarifier aussi le statut d'Alexandre Bloch.
- [ ] Site cleolabs.co — propager "fondée 2023, constituée 2024". NE PAS publier "177 juridictions" ni "256 000 (Atlas)" — purgés (décision 2026-06-29).
- [ ] llms.txt / llms-full.txt / llms-fr.txt — idem fondation + juridictions + Atlas.
- [ ] Wikidata Q138466568 — inception : garder 2024 (constitution) OU 2023 (fondation) selon la formulation.
- [ ] Kit presse / decks — référencer ce fichier.

## Règle
Toute nouvelle valeur chiffrée publique passe par ce fichier d'abord. Si un chiffre n'est pas ici, il ne se publie pas.
