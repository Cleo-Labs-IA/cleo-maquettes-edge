# Rapport, agent `donnees` : `commun/seo.json`

Ecrit le 27/08/2026. Fichier produit : `/Users/naomiehalioua/cleo-maquettes-edge/commun/seo.json` (neuf, 25 pages).
Depot `cleo-landing` : lu, jamais ecrit. Aucun script de la maquette n'a ete lance.

## Source de verite, et un ecart qu'il faut connaitre

Le checkout local de `cleo-landing` est sur la branche `feat/cas-usage-16`, pas sur la production.
L'ecart est mesurable : la production a remplace les tirets cadratins des titres par des deux points.

| Champ | Depot local | Page servie |
|---|---|---|
| titre `/company` | `À Propos de Cleo Labs — Soutenue par Kima Ventures` | `À Propos de Cleo Labs : Soutenue par Kima Ventures` |
| `award` du JSON-LD | `Winner — The Pitch by Deel (Station F, 2026)` | `Winner: The Pitch by Deel (Station F, 2026)` |

**Toutes les valeurs `source: "site"` de `seo.json` viennent de la PAGE SERVIE**, relevee au curl le 27/08/2026,
entites HTML decodees. C'est ce que les moteurs indexent, et c'est deja sans tiret cadratin.
Le reste (blocs JSON-LD, tableau presse) a ete lu au depot **puis recoupe** sur le HTML servi.

## Un changement par ligne

1. Cree `commun/seo.json`, six objets : `entite`, `site`, `levee`, `presse`, `pages`, `structure`, plus un `_lisez_moi`.
2. `entite` : bloc `Organization` transcrit depuis `src/app/[locale]/layout.tsx:73-218`, recoupe sur le ld+json servi par `/fr`.
3. `entite` : `legalName` = `Cleo Corp SAS`, `foundingDate` = `2023`, `taxID` = `FR20984567883`, `iso6523Code` = `0009:FR20984567883`.
4. `entite` : adresse postale complete, les cinq champs (`17 rue Berteaux Dumas`, `Neuilly-sur-Seine`, `92200`, `Île-de-France`, `FR`).
5. `entite` : `logo` en `ImageObject`, `apple-touch-icon.png`, 180 x 180.
6. `entite` : `award` = `Winner: The Pitch by Deel (Station F, 2026)`, forme servie, sans tiret cadratin.
7. `entite` : `knowsAbout`, les 14 entrees, dans l'ordre du depot.
8. `entite` : `sameAs`, **5 gardes sur 6 declares**. Celui de Crunchbase est retire, slug fautif.
9. `entite` : `slogan` **non transcrit**, liste noire.
10. `entite` : `contactPoint` **non transcrit**, conflit d'adresses, voir plus bas.
11. `entite` : `jobTitle` de Naomie Halioua laisse a `null`, quatre libelles concurrents, aucun choisi.
12. `entite` : descriptions FR et EN gardees dans un couple `{fr, en}` au lieu du ternaire `isEn` du depot, contenu inchange.
13. `site` : bloc `WebSite` + `SearchAction` transcrit depuis `layout.tsx:256-277`, le `target` mis en gabarit `{locale}`.
14. `site` : URL de base `https://www.cleolabs.co`, gabarit canonique `/{locale}/{chemin}`.
15. `site` : les trois hreflang, `en`, `fr`, `x-default`, `x-default` pointant sur l'anglais. Mesure sur `/fr` et sur `/fr/company`.
16. `site` : les deux liens `llms.txt` et `llms-full.txt` du layout racine, tous deux verifies a 200.
17. `site` : `og.image.alt` laisse **vide** a dessein, la valeur du depot porte un tiret cadratin.
18. `site` : jeton de verification Google `google57f0014b89d60d67`, transcrit.
19. `levee` : les **deux** `FundingEvent`, celui du layout racine et celui de `/company`, gardes separement, avec leurs ecarts.
20. `levee` : montant 1 500 000 EUR, identique dans les deux blocs.
21. `levee` : les trois financeurs nommes, `Larry Berger` (`Founder of Amplify`), `La Financière Saint-James`, `Kima Ventures`.
22. `presse` : les 6 liens, URL au caractere pres, recoupees dans le HTML servi par `/fr`.
23. `presse` : le prix Deel donne en deux libelles, celui du depot conserve a part, celui a utiliser sans tiret cadratin.
24. `presse` : l'emoji trophee de `PressSection.tsx:82` **non transcrit**, le generateur les refuse.
25. `pages` : 25 entrees, clees par le nom de sortie (`p.sortie || p.fichier`), **meme ordre que la table PAGES**.
26. `pages` : 11 entrees `source: "site"`, titre et description recopies de la page servie, avec l'URL et le comptage de caracteres.
27. `pages` : 14 entrees `source: "redige"`, ecrites depuis le contenu de la maquette, chacune avec son `appui_contenu`.
28. `structure` : les 25 pages ont leur ou leurs `@type`, plus un bloc `_globaux` pour `Organization` et `WebSite`.
29. `structure` : `VideoObject`, pose sur toutes les pages du site reel, **non repris**, la maquette ne sert aucune video.
30. `structure` : `12-article.html` recoit `BlogPosting`, que le site reel ne pose sur aucun de ses 108 articles.

## Comment chaque page a ete appariee

**Appariees a une page servie (11).** Le titre et la description sont recopies, jamais reecrits.

| Maquette | Page reelle | Comment |
|---|---|---|
| `01-accueil.html` | `/fr` | meme page |
| `01-accueil-en.html` | `/en` | meme page |
| `02-entreprise.html` | `/fr/company` | meme page |
| `05-marche.html` | `/fr/jurisdictions/european-union` | le marche de la maquette est l'Union europeenne, la juridiction existe |
| `10-ressources.html` | `/fr/resources` | meme page |
| `11-blog.html` | `/fr/blog` | meme page |
| `12-article.html` | `/fr/blog/eu-ppwr-packaging-conformity-2026` | seul article PPWR du corpus, 108 articles FR au sitemap |
| `13-glossaire.html` | `/fr/resources/glossary` | meme page |
| `18-recrutement.html` | `/fr/careers` | meme page |
| `21-inscription.html` | `/fr/meet` | cible des **10** liens « Essai gratuit » mesures sur `/fr`, et « Essai gratuit » est le CTA de la maquette |
| `22-legal.html` | `/fr/terms` | meme page |

**Sans equivalent (14).** Titre et description ecrits depuis le contenu de la maquette, sans ajouter un seul fait.

| Maquette | Pourquoi aucun appariement |
|---|---|
| `00-composants.html` | page de travail interne, absente du site |
| `01-accueil-noir.html` | variante de rendu de l'accueil, pas une page |
| `03-offre.html` | `/fr/product/radar` rend **404** |
| `04-secteur.html` | aucun secteur textile parmi les 10 slugs de `/industries` |
| `06-cas-client.html` | les 3 cas publies sont anonymises, aucun ne nomme Decathlon |
| `07-chat.html` | `/fr/product/chat` rend **404** |
| `08-reglementation.html` | `/fr/product/market-access` rend **404** |
| `09-texte.html` | aucun guide PPWR dans `/resources`, seulement ai-act, csrd, dora, product-compliance-retail |
| `14-terme.html` | le glossaire reel tient sur une page, aucune URL par terme |
| `15-evenements.html` | aucune route evenement, zero occurrence au sitemap |
| `16-evenement.html` | idem |
| `17-modeles.html` | `/fr/resources/data` publie des statistiques, pas des modeles |
| `19-poste.html` | les 2 postes reels sont `forward-deployed-engineer` et `legal-engineer`, a Paris |
| `20-campagne.html` | aucune route `/landing` |

## Verifie

- `JSON.parse` sur `commun/seo.json` : **passe**, 49 658 octets. Controle par `node -e`.
- Cles de tete : **7** (`_lisez_moi`, `entite`, `site`, `levee`, `presse`, `pages`, `structure`).
- `entite` : **23** cles. `site` : **12**. `levee` : **4**. `presse` : **6**. `pages` : **25**. `structure` : **27** dont 2 meta.
- `pages` : les 25 cles sont **identiques et dans le meme ordre** que la table PAGES de `construire.mjs:16`. Compare par script.
- `structure` couvre les **25** pages, aucune manquante.
- Repartition : **11** `source: "site"`, **14** `source: "redige"`. Somme 25.
- `sameAs` : **5** gardes sur **6** declares.
- `knowsAbout` : **14** entrees.
- `FundingEvent` : **2** blocs, **3** financeurs chacun.
- Presse : **6** articles, **3** portent une date, **3** n'en portent pas.
- Les 14 descriptions redigees tiennent toutes dans la fourchette 120-155 caracteres. Mesure : min 129, max 150.
- Les 14 titres rediges vont de 44 a 63 caracteres.
- **Zero tiret cadratin** et **zero emoji** dans les 50 valeurs que le generateur posera (`pages.*.titre`, `pages.*.description`). Controle par script.
- Aucune valeur de la liste noire n'est presente comme donnee reprenable : slogan Deel absent, `0,81` absent, `gdpr-compliance` absent, les deux noms de chercheuses absents, URL Crunchbase absente.
- Presse : les 6 URL du depot sont **identiques** aux 6 URL servies dans le HTML de `/fr`.
- Bloc `Organization` : compare champ par champ entre `layout.tsx` et le ld+json servi. Un seul ecart, `award`, deja documente.

## Trous laisses

1. **Trois dates de presse manquantes.** `PressSection.tsx` ne porte aucun champ date. Tech.eu, EU-Startups et FinTech Global ont leur date dans le chemin de l'URL, reprise avec sa provenance. **Vestbee, RegTech Analyst et The Legal Wire n'en ont aucune** : `date: null`.
2. **Le second `FundingEvent` n'a pas de date.** Celui de `/company` (`company/layout.tsx:81-94`) ne declare ni `date` ni `startDate`. Celui du layout racine dit `2026`. Non recopie de l'un a l'autre.
3. **Le titre de Naomie Halioua est a `null`.** Quatre libelles concurrents mesures : `layout.tsx:125` et `company/layout.tsx:76` disent `CRO & Co-founder` ; `i18n/sections/social-proof.ts:150` dit `Co-founder & Chief Research Officer` / `Co-fondatrice & Directrice de la Recherche` ; `data/authors.json:5` dit `Co-founder & CRO, AI Research`. Le sigle `CDO` n'apparait nulle part dans `cleo-landing`. A trancher.
4. **Aucune adresse de courriel dans le fichier.** Voir la liste noire.
5. **`og.image.alt` vide.** La seule valeur declaree porte un tiret cadratin. La maquette n'a pas d'og-image a elle non plus.
6. **`16-evenement.html` : le fuseau de l'heure et l'adresse du lieu.** La maquette dit « 19h » sans fuseau et « lieu communiqué à l'inscription ». Ni l'un ni l'autre devine.
7. **`19-poste.html` : pas de `datePosted`, pas de `baseSalary`.** Ni sur la maquette, ni sur les deux annonces reelles.
8. **`06-cas-client.html` : pas de `datePublished`.** Ni sur la maquette, ni sur les trois cas reels.
9. **`09-texte.html` : la date d'adoption du PPWR.** La maquette donne la date d'application, 12 aout 2026, pas l'adoption. `legislationDate` reste vide.
10. **Le chiffre 2 812 regles de `08-reglementation.html` vient de la maquette seule.** Il n'est recoupe nulle part dans `cleo-landing`. Signale dans l'entree de la page.
11. **`12-article.html` : le titre reel fait 236 caracteres et la description 458.** Transcrits tels quels parce que ce sont les valeurs servies, mais tres au-dessus des normes d'affichage. A trancher avant que le generateur les pose.
12. **`21-inscription.html` : ecart de contenu.** La page reelle promet une demo de 20 minutes, la maquette promet un acces a la plateforme dans la journee sans carte bancaire. Titre transcrit « Réserver une Démo », h1 de la maquette « Demander un accès ».
13. **`19-poste.html` : le poste de la maquette n'existe pas.** « Juriste, encodage réglementaire », Neuilly-sur-Seine. Les deux vrais sont a Paris. Le plus proche est `/fr/careers/legal-engineer`.
14. **`06-cas-client.html` : la maquette nomme Decathlon, le site anonymise.** Le nom et la citation de Philippine Tamic sont bien sources (`components/landing/DecathlonQuote.tsx`, rendus en clair sur `/fr`), mais les trois cas de `/fr/customers` disent « Un grand retailer mode européen ». Deux doctrines coexistent.
15. **`12-article.html` : `FAQPage` laisse conditionnel.** A n'ajouter que si le chantier 4 ajoute vraiment une section FAQ visible.

## Liste noire rencontree

Rencontree, non transcrite, notee.

1. **`/resources/gdpr-compliance`.** Verifie : **404**, et **8 occurrences** dans le sitemap servi (2 `<loc>` plus leurs alternates). Le layout existe au depot et porte `Article`, `FAQPage`, `Legislation`. **Non repris** : ni comme modele de `09-texte.html`, ni ailleurs. Le gabarit de guide de texte a ete pris sur `ai-act-compliance`, qui repond.
2. **Le score F1 de 0,81 de `/research`.** Rencontre, non transcrit. Aucun chiffre de `/research` n'entre dans le fichier.
3. **Le `sameAs` Crunchbase au slug fautif.** Rencontre a `layout.tsx:197` et servi sur toutes les pages. **Retire.** 6 declares, 5 gardes. L'URL fautive n'est meme pas recopiee dans les notes du fichier, pour qu'aucun generateur ne la reprenne.
4. **Les definitions concurrentes de MARIA.** Une seule chose est sourcable sans ambiguite : le developpe de l'acronyme, `MARIA (Multi-Agent Regulatory Intelligence Architecture)`, **14 occurrences sur 14** dans `cleo-landing`, aucune variante. C'est la seule forme reprise, dans `knowsAbout` et dans la description transcrite de l'`Organization`. Aucune definition en prose n'a ete ajoutee.
5. **Les titres concurrents de Naomie Halioua.** `jobTitle` laisse a `null`, les quatre libelles listes dans un champ `_jobTitle_trou`. Aucun choisi.
6. **Les deux adresses `hello@` et `contact@`.** `cleo-landing` ne connait que celle en `contact`, servie 6 fois sur `/fr`, 12 fois sur `/fr/terms`. Celle en `hello` vit dans `pages/22-legal.html` de la maquette. **Aucune des deux n'est ecrite dans `seo.json`**, `contactPoint` est absent du bloc `entite`. A trancher.
7. **Le slogan « The Deel of product compliance ».** Present au depot (`layout.tsx:92`) et servi. **Champ `slogan` non transcrit.** Le prix, lui, est un fait et il est la : `award` = `Winner: The Pitch by Deel (Station F, 2026)`, plus le libelle de la section presse.
8. **Les deux chercheuses inventees.** `i18n/sections/research.ts:79-80`, tableau `researchers`. **Jamais citees.** Leurs deux cles d'image `chercheuse-1` et `chercheuse-2` (`construire.mjs:58-59`) ne sont referencees nulle part dans `seo.json`.
9. **La collision « mica ».** Aucune mention de MiCA n'a ete ajoutee de mon fait. Le sigle apparait uniquement a l'interieur de deux descriptions transcrites au caractere pres (`/fr/resources/glossary` et la liste `keyRegulations` du bloc UE), ou il designe bien le reglement crypto-actifs dans une enumeration de textes. Aucun rapprochement avec un article de chimie n'est fait.
10. **L'emoji trophee** de `PressSection.tsx:82`. Non transcrit.
11. **Les tirets cadratins.** Les titres du depot en portent, les pages servies non. Ce sont les pages servies qui font foi ici. Verifie : zero tiret cadratin dans les 50 valeurs posees.

## Trois defauts du site reel, rencontres en passant

Ils ne sont pas dans la liste noire fournie. Ils ne sont pas repris non plus.

- **Aucun article du blog ne porte `BlogPosting` ni `Article`.** Zero occurrence de `BlogPosting` dans tout `cleo-landing`. Les 108 articles FR servent `WebPage` + `BreadcrumbList` + `FAQPage`. La maquette pose `BlogPosting` sur `12-article.html`.
- **`/fr/customers` et `/fr/scan` repondent 200 mais sont absents du sitemap.** Mesure : `sitemap=0`, `http=200` pour les deux. Les trois cas clients ne sont declares nulle part.
- **`/fr/product/radar`, `/fr/product/chat`, `/fr/product/market-access` rendent 404** alors que les trois pages existent au depot avec leur `generateMetadata`. Ce sont exactement les trois features de la maquette. Leurs descriptions au depot sont a un mot pres celles des heros de la maquette.

## Ce que le chantier 1 doit encore trancher

Quatre decisions, aucune n'est de mon ressort : le titre de Naomie, l'adresse de courriel, le titre de 236 caracteres
de `12-article.html`, et l'ecart de promesse entre `21-inscription.html` et `/fr/meet`.
Les quatre sont marquees dans le fichier par un champ `_trou` ou `_alerte` a cote de la valeur concernee.
