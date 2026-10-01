# Trafic venu des assistants IA : vraie baisse ou défaut de mesure ?

Mesuré le 01/10/2026 vers 09 h 50 UTC, PostHog projet 67160 (fuseau UTC), site en ligne et build de la branche `fix/seo-0110-1-trafic-ia`.

## Conclusion

1. Ce n'est pas une chute de trafic : en comptant une visite IA par son référent OU par `utm_source`, on a 14, 13, 16 sessions sur les semaines du 06/09, 13/09, 20/09, puis 8 sessions sur les 4,4 premiers jours de la semaine du 27/09 (Q11).
2. Le « 13-17 → 4 → 1 » vient de la façon de compter : il exclut `gemini.google.com` (12 puis 4 pages vues, Q4) et les visites ChatGPT arrivées sans référent mais avec `utm_source=chatgpt.com` (8 puis 3 pages vues, Q9).
3. Le site en ligne capte bien le référent et l'utm, redirections 307/308 comprises (sonde navigateur) ; les options d'init PostHog sont identiques à celles de l'ancien site ; aucune page d'arrivée IA n'a été perdue (54 en 200, 4 en 308 vers une page vivante, 3 en 404 qui étaient déjà de fausses pages).
4. Un défaut de mesure existe dans la version à consentement de cette branche : accord donné sur la 2e page = la visite IA est comptée comme interne. Prouvé, corrigé, testé. Son effet passé sur les chiffres est proche de zéro (Q15).
5. Reste non tranché : ChatGPT n'envoie plus de référent depuis le 20/09 (0 page vue sur 11, contre 13 sur 15 la semaine du 13/09). Le changement précède la bascule de trois jours et le site n'y est pour rien d'après la sonde ; l'échantillon (6 sessions) ne permet pas de dire plus.

## Niveau de confiance

| Affirmation | Confiance | Pourquoi |
|---|---|---|
| Le site en ligne capte référent et utm | Élevée | Mesuré dans Chromium sur 5 adresses réelles, y compris via 307 et 308 |
| Aucune page d'arrivée IA perdue à la bascule | Élevée | 61 chemins rejoués un par un contre le site en ligne |
| Le défaut « accord sur la 2e page » et sa correction | Élevée | Reproduit avec la vraie bibliothèque PostHog 1.435, test qui échoue avant et passe après |
| Pas de vraie baisse du trafic IA | Moyenne | Volumes faibles (8 à 16 sessions par semaine), dernière semaine partielle, trou de mesure du 23/09 19 h UTC au 24/09 08 h UTC |
| Cause du passage de ChatGPT en « direct » | Faible | 6 sessions après le 20/09 ; côté ChatGPT probable, non prouvable d'ici |

## Requêtes et résultats bruts

Toutes passent par `POST https://eu.posthog.com/api/projects/67160/query/` avec `{"query":{"kind":"HogQLQuery","query":"…"}}`.

Deux filtres servent partout.

`AI` (référent seul, les 9 familles demandées) :
```
(properties.$referring_domain ilike '%chatgpt%' or properties.$referring_domain ilike '%openai%' or properties.$referring_domain ilike '%perplexity%' or properties.$referring_domain ilike '%claude%' or properties.$referring_domain ilike '%gemini%' or properties.$referring_domain ilike '%copilot%' or properties.$referring_domain ilike '%doubao%' or properties.$referring_domain ilike '%deepseek%' or properties.$referring_domain ilike '%mistral%')
```
`AIX` (référent OU utm) : `AI` auquel s'ajoute
```
or properties.utm_source ilike '%chatgpt%' or properties.utm_source ilike '%perplexity%' or properties.utm_source ilike '%gemini%' or properties.utm_source ilike '%claude%' or properties.utm_source ilike '%copilot%'
```

### Q1. Pages vues IA par semaine, référent seul
```
select toStartOfWeek(timestamp) w, count() n, count(distinct distinct_id) u from events where event='$pageview' and timestamp>='2026-08-02' and AI group by w order by w
```
```
w           n   u
2026-08-02  30  21
2026-08-09  8   6
2026-08-16  22  15
2026-08-23  16  12
2026-08-30  20  14
2026-09-06  23  13
2026-09-13  18  10
2026-09-20  16  12
2026-09-27  5   3
```
La semaine du 27/09 s'arrête au 01/10 09 h 50 UTC.

### Q4. Le même compte, par domaine
```
select toStartOfWeek(timestamp) w, properties.$referring_domain r, count() n, count(distinct distinct_id) u, count(distinct properties.$session_id) s from events where event='$pageview' and timestamp>='2026-08-02' and AI group by w,r order by w,r
```
```
w           r                  n   u  s
2026-08-02  chatgpt.com        18  13 13
2026-08-02  claude.ai          1   1  1
2026-08-02  gemini.google.com  5   4  5
2026-08-02  www.doubao.com     6   3  3
2026-08-09  chatgpt.com        4   2  2
2026-08-09  claude.ai          1   1  1
2026-08-09  gemini.google.com  2   2  2
2026-08-09  www.perplexity.ai  1   1  1
2026-08-16  chatgpt.com        8   7  7
2026-08-16  claude.ai          4   2  2
2026-08-16  gemini.google.com  6   3  4
2026-08-16  www.doubao.com     3   2  2
2026-08-16  www.perplexity.ai  1   1  1
2026-08-23  chatgpt.com        7   4  4
2026-08-23  claude.ai          3   3  3
2026-08-23  gemini.google.com  1   1  1
2026-08-23  www.doubao.com     2   2  2
2026-08-23  www.perplexity.ai  3   2  3
2026-08-30  chatgpt.com        5   2  2
2026-08-30  claude.ai          4   3  4
2026-08-30  gemini.google.com  7   6  6
2026-08-30  www.doubao.com     2   1  1
2026-08-30  www.perplexity.ai  2   2  2
2026-09-06  chatgpt.com        7   3  3
2026-09-06  claude.ai          8   3  4
2026-09-06  gemini.google.com  6   5  5
2026-09-06  www.perplexity.ai  2   2  2
2026-09-13  chatgpt.com        13  6  7
2026-09-13  gemini.google.com  5   4  4
2026-09-20  gemini.google.com  12  8  8
2026-09-20  www.perplexity.ai  4   4  4
2026-09-27  claude.ai          1   1  1
2026-09-27  gemini.google.com  4   2  3
```
Lecture : en retirant `gemini.google.com` de chaque semaine, on retrouve exactement les chiffres de départ, 17 (06/09), 13 (13/09), 4 (20/09), 1 (27/09). Le compte initial n'incluait donc pas Gemini. `chatgpt.com` disparaît comme référent à partir de la semaine du 20/09.

### Q9. ChatGPT, par référent OU par utm
```
select toStartOfWeek(timestamp) w, count() n, countIf(properties.$referring_domain ilike '%chatgpt%') avec_ref, countIf(properties.$referring_domain='$direct') direct, count(distinct properties.$session_id) s, count(distinct distinct_id) u from events where event='$pageview' and timestamp>='2026-08-02' and (properties.utm_source ilike '%chatgpt%' or properties.$referring_domain ilike '%chatgpt%' or properties.$referring_domain ilike '%openai%') group by w order by w
```
```
w           n   avec_ref  direct  s   u
2026-08-02  22  18        4       17  17
2026-08-09  8   4         4       3   3
2026-08-16  19  8         10      14  13
2026-08-23  20  7         10      14  14
2026-08-30  18  5         13      11  7
2026-09-06  7   7         0       3   3
2026-09-13  15  13        2       9   8
2026-09-20  8   0         8       3   3
2026-09-27  3   0         3       3   3
```
Lecture : ChatGPT arrive toujours, mais sans référent. Le mélange « avec référent / direct » existait déjà sur l'ancien site (10 directs sur 19 la semaine du 16/08, 13 sur 18 celle du 30/08). Après le 20/09 : 0 avec référent sur 11.

### Q8. Chaque page vue ChatGPT depuis le 19/09 (extrait de la requête complète depuis le 01/09, 47 lignes)
```
select timestamp, properties.$referring_domain r, properties.utm_source us, properties.$pathname p, properties.$browser b, properties.$device_type dt, properties.$os os, properties.$lib_version v, properties.$geoip_country_code c, substring(distinct_id,1,8) id from events where event='$pageview' and timestamp>='2026-09-01' and (properties.utm_source ilike '%chatgpt%' or properties.$referring_domain ilike '%chatgpt%' or properties.$referring_domain ilike '%openai%') order by timestamp
```
```
2026-09-19T06:48  chatgpt.com  chatgpt.com  /fr                                              Chrome         Desktop  Windows   FR
2026-09-21T10:05  $direct      chatgpt.com  /fr/blog/belgium-egg-salmonella-recall-2026      Mobile Safari  Mobile   iOS       BE
2026-09-26T05:08  $direct      chatgpt.com  /en/blog/cosmetic-regulation-by-country          Chrome         Desktop  Windows   SG
2026-09-26T10:21  $direct      chatgpt.com  /en/platform/compliance-service (x3)             Chrome         Desktop  Windows   RS
2026-09-26T10:21  $direct      chatgpt.com  /en/company                                      Chrome         Desktop  Windows   RS
2026-09-26T10:23  $direct      chatgpt.com  /en/careers                                      Chrome         Desktop  Windows   RS
2026-09-26T10:24  $direct      chatgpt.com  /en/compliance-as-a-service/product-compliance-assessment  Chrome  Desktop  Windows  RS
2026-09-28T09:04  $direct      chatgpt.com  /en/blog/saudi-saso-on-product-labelling-2026    Chrome         Desktop  Mac OS X  SA
2026-09-29T11:57  $direct      chatgpt.com  /en/blog/saudi-saso-on-product-labelling-2026 (x2)  Mobile Safari  Mobile  iOS    AE
```
Lecture : le dernier référent `chatgpt.com` date du 19/09. Avant la bascule du 23/09, aucune visite ChatGPT sur ordinateur n'est tracée entre le 20/09 et le 23/09 ; après, les 3 sessions sur ordinateur arrivent en direct. Avant le 19/09, Chrome sur Windows arrivait avec référent (10/09, 16/09, 18/09).

### Q5. `utm_source`, toutes valeurs, semaines du 13/09 au 27/09 (extrait de la requête depuis le 02/08, 38 lignes)
```
select toStartOfWeek(timestamp) w, properties.utm_source us, properties.$referring_domain r, count() n from events where event='$pageview' and timestamp>='2026-08-02' and properties.utm_source is not null and properties.utm_source!='' group by w,us,r order by w,n desc
```
```
2026-09-13  chatgpt.com  chatgpt.com        12
2026-09-13  chatgpt.com  $direct            2
2026-09-13  luma         $direct            1
2026-09-13  eeai.tv      eeai.tv            1
2026-09-20  gemini       gemini.google.com  8
2026-09-20  chatgpt.com  $direct            8
2026-09-20  substack     $direct            1
2026-09-20  gemini       $direct            1
2026-09-27  adwords      www.google.com     23
2026-09-27  google       $direct            6
2026-09-27  adwords      $direct            4
2026-09-27  gemini       gemini.google.com  3
2026-09-27  chatgpt.com  $direct            3
2026-09-27  gemini       $direct            1
```

### Q11. Trafic IA élargi (référent OU utm), par semaine
```
select toStartOfWeek(timestamp) w, count() pv, count(distinct properties.$session_id) s, count(distinct distinct_id) u, countIf(properties.$referring_domain='$direct') pv_direct from events where event='$pageview' and timestamp>='2026-08-02' and AIX group by w order by w
```
```
w           pv  s   u   pv_direct
2026-08-02  34  26  25  4
2026-08-09  12  7   7   4
2026-08-16  33  23  21  10
2026-08-23  29  23  22  10
2026-08-30  36  25  20  16
2026-09-06  23  14  13  0
2026-09-13  20  13  12  2
2026-09-20  25  16  16  9
2026-09-27  9   8   7   4
```

### Q12. Le même, par jour depuis le 14/09
```
select toDate(timestamp) d, count() pv, count(distinct properties.$session_id) s from events where event='$pageview' and timestamp>='2026-09-14' and AIX group by d order by d
```
```
09-14 1/1 · 09-15 1/1 · 09-16 8/3 · 09-17 1/1 · 09-18 7/5 · 09-19 1/1 · 09-20 2/2 · 09-21 3/3 · 09-22 3/3 · 09-23 3/3 · 09-25 7/3 · 09-26 7/2 · 09-27 1/1 · 09-28 5/4 · 09-29 3/3   (pages vues / sessions)
```
Aucune ligne le 24/09 (lendemain du trou de mesure), le 30/09 ni le 01/10.

### Q6. `$initial_referring_domain`
```
select toStartOfWeek(timestamp) w, properties.$initial_referring_domain r, count() n from events where event='$pageview' and timestamp>='2026-08-02' and (properties.$initial_referring_domain ilike '%chatgpt%' or … '%openai%' … '%perplexity%' … '%claude%' … '%gemini%' … '%copilot%') group by w,r order by w,r
```
0 ligne sur toute la période, avant comme après : la propriété n'est pas posée sur les événements (`person_profiles:'identified_only'`, ancien et nouveau site). Elle ne peut pas servir. `$session_entry_referring_domain` donne les mêmes ordres de grandeur que Q4 (29 lignes, même forme, dernière semaine : claude.ai 1, gemini.google.com 4).

### Q17. Ensemble du site par semaine, part du direct
```
select toStartOfWeek(timestamp) w, count() pv, countIf(properties.$referring_domain='$direct') direct, round(100*countIf(properties.$referring_domain='$direct')/count(),1) pct_direct, countIf(properties.$referring_domain ilike '%google%' and properties.$referring_domain not ilike '%gemini%') google, count(distinct properties.$session_id) sessions from events where event='$pageview' and timestamp>='2026-08-30' and properties.$host='www.cleolabs.co' group by w order by w
```
```
w           pv    direct  pct_direct  google  sessions
2026-08-30  1015  436     43.0        493     791
2026-09-06  987   433     43.9        476     765
2026-09-13  942   438     46.5        433     755
2026-09-20  827   295     35.7        461     682
2026-09-27  549   216     39.3        284     405
```
Lecture : aucun événement n'est sans référent au sens « propriété absente » (Q7 : `sansref` = 0 sur toutes les lignes) ; la part du direct baisse (46,5 % → 35,7 % → 39,3 %), elle ne monte pas. Un référent qui se perdrait gonflerait le direct : c'est l'inverse. La baisse du direct en volume n'est pas expliquée par ce rapport.

### Q7. Version de la bibliothèque et options, par jour depuis le 18/09 (51 lignes)
```
select toDate(timestamp) d, properties.$lib_version v, properties.$config_defaults cd, count() n, countIf(properties.$referrer is null) sansref, countIf(properties.$referring_domain='$direct') direct, countIf(properties.$process_person_profile=true) pp from events where event='$pageview' and timestamp>='2026-09-18' and properties.$host='www.cleolabs.co' group by d,v,cd order by d,v
```
Sur les 51 lignes : `cd` = `2026-01-30` partout, `sansref` = 0 partout, `pp` = 0 partout, versions 1.433.5 à 1.435.6 qui montent sans rupture au 23/09. Même réglage avant et après.

### Q14. Trou de mesure à la bascule (pages vues par heure, `www.cleolabs.co`)
```
select toStartOfHour(timestamp) h, count() pv from events where event='$pageview' and properties.$host='www.cleolabs.co' and ((timestamp>='2026-09-23 12:00:00' and timestamp<'2026-09-24 14:00:00') or timestamp>='2026-09-28 00:00:00') group by h order by h
```
```
2026-09-23T17:00Z 5 · 18:00Z 6 · 19:00Z 3 · (rien de 20:00Z à 07:00Z) · 2026-09-24T08:00Z 1 · 09:00Z 9 · 10:00Z 10
```
Le trou va du 23/09 20 h UTC au 24/09 08 h UTC. Les 14 pages vues entre 17 h et 20 h UTC viennent après la bascule de 17 h 19 UTC (pages de l'ancien site encore ouvertes ou en cache, non vérifié).

### Q13 et Q16. Quand la version à consentement a-t-elle été en ligne ?
```
select toDate(timestamp) d, count() pv, countIf(properties.first_touch_utm_source is not null) ft, countIf(properties.gclid is not null) gclid from events where event='$pageview' and timestamp>='2026-09-22' and properties.$host='www.cleolabs.co' group by d order by d
```
```
09-22 152/0 · 09-23 162/0 · 09-24 108/0 · 09-25 136/0 · 09-26 65/0 · 09-27 66/0 · 09-28 123/5 · 09-29 151/12 · 09-30 163/12 · 10-01 40/3   (pages vues / dont first_touch)
```
`first_touch_*` n'est posé que par la version à consentement. Il apparaît à partir du 28/09 14 h UTC et jusqu'au 01/10 01 h UTC (Q16, 21 heures distinctes) : cette version a bien servi par périodes. Le 01/10 à 09 h 40 UTC, les 4 pages testées en ligne (`/en`, `/fr`, `/en/legal-data`, un article) ne la portent pas (`curl | grep -c cleo_consentement` = 0).

### Q15. Sessions dont l'entrée a pour référent le site lui-même (signature du défaut corrigé)
```
select toDate(mn) d, count() sessions, countIf(r ilike '%cleolabs.co') entree_interne, countIf(r='$direct') entree_directe from (select properties.$session_id sid, min(timestamp) mn, argMin(properties.$referring_domain, timestamp) r from events where event='$pageview' and timestamp>='2026-09-14' and properties.$host='www.cleolabs.co' group by sid) group by d order by d
```
```
d      sessions  entree_interne  entree_directe
09-14  126  0  53      09-23  128  1  35
09-15  136  1  59      09-24  86   0  26
09-16  141  1  72      09-25  105  0  46
09-17  130  0  50      09-26  53   0  24
09-18  113  0  44      09-27  55   0  26
09-19  56   0  35      09-28  95   0  35
09-20  46   0  22      09-29  106  0  36
09-21  133  0  55      09-30  122  1  44
09-22  131  0  41      10-01  25   0  9
```
Lecture : 1 session du 28/09 au 01/10. Le défaut corrigé plus bas n'explique donc pas les chiffres passés ; la correction est préventive, pour le jour où la version à consentement reste en ligne.

### Q10. Pages d'arrivée des sessions IA avant la bascule, rejouées contre le site en ligne
```
select p, count() sessions from (select properties.$session_id sid, argMin(properties.$pathname, timestamp) p from events where event='$pageview' and timestamp>='2026-08-02' and timestamp<'2026-09-23 17:19:00' and AIX group by sid) group by p order by sessions desc, p
```
61 chemins, 141 sessions. Chacun rejoué le 01/10 par `curl -s -o /dev/null -w '%{http_code}\t%{redirect_url}' -H "Referer: https://chatgpt.com/" "https://www.cleolabs.co<chemin>?utm_source=chatgpt.com"` :

| Réponse | Chemins | Sessions | Détail |
|---|---|---|---|
| 200 | 54 | 126 | dont `/en` (12), les articles Corée (9), passeport produit (7), halal Indonésie (7) |
| 308 | 4 | 12 | `/en/industries/retail` (6), `/en/industries/cosmetics` (4), `/en/industries/food-beverage` (1) → `/en/industries` ; `/en/jurisdictions` (1) → `/en/legal-data`. La cible répond 200 et `?utm_source=chatgpt.com` est conservé dans `location` |
| 404 | 3 | 3 | `/en/blog/eu`, `/en/blog/shein`, `/en/blog/vietnam-import-decree-31-2026-aircon-customs-rule` |

Les 3 chemins en 404 n'étaient pas de vraies pages : l'ancien site répond 200 avec le titre « Blog | Cleo Labs » à n'importe quelle adresse sous `/en/blog/` (vérifié avec `/en/blog/zzz-nexiste-pas` → 200), et le troisième slug est absent de `cleo-landing/src/data/blog-posts.json` (`grep -c` = 0). Le 404 d'aujourd'hui est la bonne réponse.

### Sonde navigateur sur le site en ligne (01/10, Chromium, envois vers PostHog coupés)
Une page d'une autre origine porte un lien vers le site, clic réel, puis lecture de `document.referrer` et de `posthog.calculateEventProperties('$pageview', {})`.

| Adresse cliquée | Adresse finale | `$referring_domain` | `utm_source` |
|---|---|---|---|
| `www.cleolabs.co/en/blog/saudi-saso-on-product-labelling-2026?utm_source=chatgpt.com` | la même | origine de départ | chatgpt.com |
| `www.cleolabs.co/en/industries/cosmetics?utm_source=chatgpt.com` (308) | `/en/industries?utm_source=chatgpt.com` | origine de départ | chatgpt.com |
| `cleolabs.co/en/legal-data` (307 vers www) | `www.cleolabs.co/en/legal-data` | origine de départ | absent |
| `www.cleolabs.co/` (307) | `/fr` | origine de départ | absent |
| `www.cleolabs.co/en/blog/korea-cosmetics-safety-assessment-2026` | la même | origine de départ | absent |

5 sur 5 : le référent traverse les redirections et PostHog le lit. Le site en ligne ne renvoie pas d'en-tête `Referrer-Policy` (`curl -sI https://www.cleolabs.co/en`), ce qui n'a aucun effet sur le référent entrant ; la branche pose `strict-origin-when-cross-origin`, sans effet non plus sur l'entrant.

### Options d'init, ancien et nouveau site
`~/cleo-landing/src/app/[locale]/layout.tsx` ligne 243 et le site en ligne portent la même ligne : `posthog.init('phc_…',{api_host:'https://eu.i.posthog.com',defaults:'2026-01-30',person_profiles:'identified_only'})`. Seule différence de régime : l'ancien site mesurait par défaut et coupait au refus (`CookieConsent.tsx`, `opt_out_capturing`) ; la version à consentement de cette branche ne mesure qu'après accord.

## Ce qui a été corrigé

Le défaut, reproduit avec la vraie bibliothèque PostHog sur le build de la branche servi sous `https://www.cleolabs.co` avec sa CSP :

| Scénario (arrivée depuis chatgpt.com avec `?utm_source=chatgpt.com`) | Avant | Après |
|---|---|---|
| Accord sur la page d'arrivée | chatgpt.com, utm présent | inchangé |
| Accord sur la 2e page | `$referring_domain` = `www.cleolabs.co`, `utm_source` absent | chatgpt.com, utm présent |
| Refus, ou aucun choix | PostHog non chargé, 0 envoi | inchangé |

- `commun/traceurs.html` : l'origine du référent externe d'arrivée (`https://hôte/`, sans chemin ni requête) et l'heure du premier contact rejoignent l'attribution déjà gardée dans `sessionStorage` (`cleo_attribution`). Après accord, `before_send` les reporte sur l'événement seulement si PostHog annonce notre propre hôte comme référent ou n'a pas l'utm, et seulement dans les 30 minutes du premier contact. Rien n'est envoyé avant accord.
- `tests/traceurs-referent-browser.mjs` : 5 cas dans Chromium. L'attendu est l'origine d'où le navigateur part réellement, écrite en dur. Témoins négatifs : arrivée directe (rien d'inventé), premier contact de plus de 30 minutes (pas de report), refus (0 requête PostHog). Échoue sur le code d'avant (`'www.cleolabs.co' !== 'chatgpt.com'`), passe après.
- `scripts/relais-ci.sh` : le test rejoint la liste de la CI.

À relire par qui porte la conformité : la branche garde désormais dans `sessionStorage`, avant accord, l'origine du site d'où vient le visiteur. C'est la même logique que les `utm_*` déjà gardés là depuis le 28/09, mais c'est une donnée de plus.

## Ce qui reste hors de portée

- Pourquoi ChatGPT n'envoie plus de référent depuis le 20/09. Rien dans le site ne l'explique. Pour continuer à compter ChatGPT, il faut filtrer sur `utm_source` en plus du référent (filtre `AIX` ci-dessus) ; Gemini et Perplexity gardent leur référent.
- Les visiteurs qui refusent ou ignorent le bandeau ne sont pas mesurés par PostHog quand la version à consentement est en ligne. C'est le choix voulu. Vercel Web Analytics, sans cookie et hors bandeau, est servi (`/_vercel/insights/script.js` → 200) et peut donner les référents de tous les visiteurs ; son tableau de bord n'a pas été consulté ici.
- Le trou du 23/09 20 h UTC au 24/09 08 h UTC ne se rattrape pas.
- Quelle version du traceur était en ligne à quelle heure entre le 28/09 et le 01/10 : seules les heures où `first_touch_*` apparaît sont connues (Q16). `vercel ls --prod` liste 20 déploiements de production en 8 jours, de deux comptes.
- La baisse du direct en volume (438 → 295 → 216 par semaine, Q17) n'est pas expliquée ici.
- Rien n'est déployé : la correction vit sur la branche.
