# Réfutation : la couche de tête câblée aujourd'hui est-elle valide ?

Audit adverse du 27/08/2026. Lentille : la validité de ce qui a été écrit
aujourd'hui dans la maquette, pas le principe du chantier.

**Affirmation testée :** « Le travail SEO et GEO des six derniers mois sur
cleolabs.co n'est pas menacé par le chantier de maquettes. »

**VERDICT : REFUTE.**

La couche de tête écrite aujourd'hui contient 236 défauts de schema.org que
le vrai site n'a pas. Le vrai site sert un JSON-LD propre ; la maquette sert
un JSON-LD dont la description de Cleo Labs, lue par une machine, est vide.
La décision enregistrée est de refaire les gabarits Next EN PRENANT LA
MAQUETTE COMME RÉFÉRENCE. Cette référence, telle qu'elle est aujourd'hui,
détruit la définition machine-lisible de l'entreprise.

---

## Le protocole

Tout est mesuré, rien n'est estimé.

- Vocabulaire schema.org officiel téléchargé (`schemaorg-current-https.jsonld`,
  3 219 nœuds) et interrogé par programme : existence des types, domaine et
  portée de chaque propriété.
- Contexte JSON-LD officiel téléchargé (`schema.org/docs/jsonldcontext.json`)
  pour trancher la question des cartes de langue.
- Expansion JSON-LD réelle exécutée avec la bibliothèque `jsonld`, pas
  raisonnée de tête.
- Les 11 pages cibles de cleolabs.co récupérées au curl le 27/08/2026 et
  passées AU MÊME validateur, pour séparer ce qui est hérité de ce qui est
  introduit.
- Scripts : `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-refute-seo/`
  (`valider.mjs`, `valider-live.mjs`, `comparer.mjs`, `inventions.mjs`).

---

## Défaut 1. La description de Cleo Labs est vide pour une machine

175 occurrences, 25 des 26 pages, 7 par page. Zéro sur le vrai site.

Le fichier `commun/seo.json` écrit les valeurs bilingues sous la forme
`{"fr": "…", "en": "…"}`. Ce n'est pas une carte de langue valide. Une carte
de langue exige `"@container": "@language"` dans le contexte. Mesure sur le
contexte officiel de schema.org : **zéro terme porte `@container`**, et
`description` y vaut simplement `{"@id": "schema:description"}`.

Expansion réelle du bloc Organization de la maquette :

```
"http://schema.org/description": [
  { "http://schema.org/en": [ { "@value": "english text" } ],
    "http://schema.org/fr": [ { "@value": "texte francais" } ] } ]
```

`schema:description` ne porte **aucun `@value`**. Elle porte un nœud anonyme
dont les deux propriétés, `schema:fr` et `schema:en`, n'existent pas dans le
vocabulaire. Un moteur qui demande « quelle est la description de Cleo Labs »
reçoit un nœud vide.

Les cinq chemins touchés, sur chaque page :

| chemin | pages |
| --- | --- |
| `Organization.description` | 25 |
| `Person.description` (les deux fondatrices) | 50 |
| `OfferCatalog.name` | 25 |
| `Service.name` (les deux offres du catalogue) | 50 |
| `WebSite.inLanguage` | 25 |

Le vrai site, lui, sert `"description": "Cleo Labs développe MARIA…"`, une
chaîne. Il choisit la langue au rendu. Le défaut est **introduit aujourd'hui**,
il n'est hérité de rien.

## Défaut 2. Onze fils d'Ariane sans aucune étape

Tous les blocs propres à la page sont le même tampon à cinq clés, seul le
`@type` change :

```json
{"@context":"…","@type":"BreadcrumbList","name":"<titre de la page>",
 "inLanguage":"fr-FR","isPartOf":{"@id":"https://www.cleolabs.co/#website"}}
```

Un `BreadcrumbList` sans `itemListElement` ne décrit rien. Google exige
`itemListElement`. Mesure sur les 26 pages construites :

| type | propriété requise absente | pages |
| --- | --- | --- |
| BreadcrumbList | `itemListElement` | 19 |
| FAQPage | `mainEntity` | 3 |
| JobPosting | `title`, `datePosted`, `description`, `hiringOrganization`, `jobLocation` | 1 (les 5) |
| Event | `startDate`, `location` | 1 (les 2) |
| Article, BlogPosting | `headline` | 2 |
| ItemList | `itemListElement` | 1 |

**31 propriétés requises manquantes. Zéro sur le vrai site.**

Pour comparaison, le fil d'Ariane que sert vraiment
`/fr/jurisdictions/european-union` :

```json
[{"@type":"ListItem","position":1,"name":"Home","item":"https://www.cleolabs.co"},
 {"@type":"ListItem","position":2,"name":"Juridictions","item":"https://www.cleolabs.co/fr/jurisdictions"},
 {"@type":"ListItem","position":3,"name":"Union européenne","item":"https://www.cleolabs.co/fr/jurisdictions/european-union"}]
```

## Défaut 3. Trente propriétés posées sur des types qui ne les portent pas

`isPartOf` a pour domaine `CreativeWork` seul. `inLanguage` ne couvre ni
`ItemList`, ni `Service`, ni `JobPosting`, ni `DefinedTerm`.

| propriété sur type | occurrences |
| --- | --- |
| `inLanguage` + `isPartOf` sur BreadcrumbList | 38 |
| `inLanguage` + `isPartOf` sur Service | 10 |
| `inLanguage` + `isPartOf` sur DefinedTerm, ItemList, JobPosting | 6 |
| `isPartOf` sur Event | 1 |

**Zéro sur le vrai site.**

## Défaut 4. Le titre de Naomie est `null` sur 25 pages

La maquette écrit `"jobTitle": null` pour Naomie Halioua. Le vrai site sert
`"jobTitle": "CRO & Co-founder"`. `null` disparaît à l'expansion : la
propriété n'existe plus. Le trou est documenté dans `seo.json` (quatre
libellés concurrents au dépôt, aucun tranché), mais il est expédié tel quel
dans 25 pages, et un port le ferait perdre au vrai site.

## Défaut 5. robots.txt et noindex s'annulent

Mesure sur le déploiement :

```
GET https://sortie-liart.vercel.app/robots.txt  -> 200
  User-agent: *
  Disallow: /
GET https://sortie-liart.vercel.app/01-accueil.html -> 200
  <meta name="robots" content="noindex,nofollow">
  (aucun en-tête X-Robots-Tag ; pas de vercel.json)
```

Documentation Google, verbatim :

> « If the page is blocked by a robots.txt file or the crawler can't access
> the page, the crawler will never see the `noindex` rule, and the page can
> still appear in search results, for example if other pages link to it. »

Le `Disallow: /` empêche la lecture du `noindex`. Les deux protections
posées il y a une heure se neutralisent. Aujourd'hui le risque est latent :
`sitemap.xml` rend 404 sur le déploiement et rien de public ne pointe vers
lui. Il devient réel dès qu'un lien apparaît.

Il faut choisir : soit un `vercel.json` qui pose `X-Robots-Tag: noindex,
nofollow` en en-tête (lisible même sous blocage), soit retirer le
`Disallow: /` pour que le `noindex` soit lu. Pas les deux dans l'état actuel.

## Défaut 6. Une couche Open Graph deux fois plus courte

| | maquette | vrai site |
| --- | --- | --- |
| balises `og:` | 6 par page | 9 à 10 |
| balises `twitter:` | 3 par page | 5 |
| `og:image` | **0 / 26 pages** | présente |
| `twitter:site`, `twitter:image` | **0 / 26 pages** | présentes |

De plus, `twitter:title` et `twitter:description` de la maquette recopient le
titre et la description de la page, alors que le vrai site sert des valeurs
Twitter distinctes :

- maquette : `Conformité Produit Automatisée pour les Marques Internationales | Cleo Labs`
- vrai site : `Cleo Labs : Conformité Produit Automatisée pour les Marques Internationales`

## Défaut 7. L'article passe de TechArticle complet à BlogPosting vide

`12-article.html` déclare :

```json
{"@type":"BlogPosting","name":"<titre>","url":"…","inLanguage":"fr-FR","isPartOf":{…}}
```

Le vrai site sert, sur la même URL, un `TechArticle` avec `headline`,
`description`, `datePublished`, `dateModified`, `author` (Person avec
jobTitle, url, worksFor) et `publisher`. `seo.json` affirme que les articles
réels ne portent « AUCUN BlogPosting ni Article ». La première moitié est
vraie (zéro `BlogPosting` au dépôt), la seconde est fausse :
`src/components/blog/ArticleShell.tsx` émet un `TechArticle`, servi et mesuré.

Le blog compte 108 articles au sitemap. Un port sur ce modèle les
appauvrirait tous.

## Défaut 8. 05-marche porte le canonical d'une page qu'elle n'est pas

L'appariement d'URL est juste, le contenu ne l'est pas.

| | maquette 05-marche | /fr/jurisdictions/european-union |
| --- | --- | --- |
| H1 | Conformité produit dans l'Union européenne. Texte par texte. | Conformité réglementaire dans l'UE |
| intertitres | Réserver un premier échange · La mise en conformité, en quatre temps · Les textes qui structurent le marché européen · Un nouveau pays n'est plus un projet | Principales autorités de régulation · Réglementations couvertes · Conformité par industrie dans l'UE · Approfondissements réglementaires · Questions fréquentes · Prêt à maîtriser la conformité dans l'UE ? |

La page emprunte le titre, la description et le canonical d'une page dont
elle ne reprend aucune section. Elle affirme une équivalence qui n'existe pas.

---

## Ce qui tient, et qu'il ne faut pas casser

Cinq contrôles cherchaient un défaut et n'en ont pas trouvé.

**Les titres et descriptions sont exacts, au caractère près.** 11 paires
comparées après décodage des entités, apostrophes typographiques
(U+2019) et droites (U+0027) distinguées. **11 identiques sur 11.** Aucune
entité mal décodée, aucun tiret cadratin, aucune espace insécable parasite.
La transcription documentée dans `seo.json` a été faite proprement.

**Les 11 canonical pointent au bon endroit.** Les 11 URL rendent **HTTP 200**,
sans redirection, et chacune est exactement le canonical que la page vraie
déclare pour elle-même. Aucun canonical ne désigne une mauvaise page.

**Les hreflang du vrai site sont réciproques.** `/fr` et `/en` déclarent le
même triplet (`en` → /en, `fr` → /fr, `x-default` → /en). La maquette le
recopie exactement. Comme l'adresse de la maquette n'appartient à aucun
ensemble de retour, sa déclaration est inerte, pas nuisible.

**`FundingEvent` est invalide, mais ce n'est pas la faute du chantier.**
Mesures : `https://schema.org/FundingEvent` rend **404**. `FundingEvent`,
`fundingTotal` et `date` sur ce type sont absents des 3 219 nœuds du
vocabulaire. La propriété `funding` a pour portée `Grant`, pas
`FundingEvent`. **Mais le même bloc fautif est servi par cleolabs.co
aujourd'hui, sur 12 des pages mesurées.** La maquette l'a recopié fidèlement.
C'est un défaut du vrai site à corriger, pas une menace créée par la maquette.

**Le robots.txt a bien été déployé.** Il rend 200 et porte `Disallow: /`. La
duplication publique des 26 pages est fermée au niveau du crawl. Le
déploiement n'a pas de sitemap (404) et rien de public n'y pointe.

---

## Le tableau qui tranche

Même validateur, deux corpus, le 27/08/2026.

| défaut | maquette | cleolabs.co en ligne |
| --- | --- | --- |
| cartes de langue `{fr,en}` invalides | **175** | 0 |
| propriétés requises manquantes | **31** | 0 |
| violations de domaine | **30** | 0 |
| valeurs `null` | **25** | 0 |
| type inconnu `FundingEvent` | 25 | 12 (hérité) |
| `fundingTotal` inconnue | 25 | 12 (hérité) |

**236 défauts introduits aujourd'hui. Zéro équivalent sur le site en ligne.**

---

## À faire

### Urgent, avant tout port

1. **Remplacer les 175 cartes `{fr, en}` par une chaîne simple.** La page
   construite connaît déjà sa langue (`inLanguage` vaut `fr-FR` ou `en-US`).
   Contrôle d'acceptation : `jsonld.expand` du bloc Organization doit rendre
   un `schema:description` portant un `@value`. Aujourd'hui il n'en porte pas.
2. **Trancher entre robots.txt et noindex.** Soit un `vercel.json` sur le
   projet `sortie` avec `X-Robots-Tag: noindex, nofollow`, soit retirer le
   `Disallow: /`. Contrôle : `curl -I` doit montrer l'en-tête, ou
   `robots.txt` ne doit plus bloquer.
3. **Remplir ou retirer les blocs vides.** Un `BreadcrumbList` sans
   `itemListElement`, un `FAQPage` sans `mainEntity`, un `JobPosting` sans
   ses cinq propriétés valent moins que rien du tout. 31 manques à traiter.
4. **Retirer `inLanguage` et `isPartOf`** de BreadcrumbList, Service,
   DefinedTerm, ItemList, Event et JobPosting. 30 occurrences.
5. **Trancher le `jobTitle` de Naomie.** Quatre libellés concurrents au
   dépôt ; 25 pages expédient `null` aujourd'hui, alors que le site en ligne
   sert « CRO & Co-founder ».

### Ensuite

6. **Corriger deux annotations fausses de `commun/seo.json`** : le chiffre
   2 812 est bien dans `cleo-landing/src/components/landing/ref/chiffresVerifies.ts`
   (la note dit qu'il ne l'est pas) ; les articles du blog portent bien un
   `TechArticle` via `ArticleShell.tsx` (la note dit qu'ils ne portent aucun
   type Article).
7. **Aligner 12-article sur `TechArticle`** avec `headline`, `datePublished`,
   `author`, ou écrire que la maquette ne porte pas le gabarit d'article.
8. **Ajouter `og:image`, `twitter:site`, `twitter:image`**, ou inscrire dans
   `seo.json` que la couche Open Graph est délibérément à 6 balises sur 10.
9. **Remonter à part le défaut `FundingEvent` de cleolabs.co.** `funding`
   attend un `Grant` ou un `MonetaryGrant`. Ce correctif appartient au vrai
   site, pas au chantier de maquettes.
