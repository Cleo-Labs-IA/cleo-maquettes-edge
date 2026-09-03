# Réfutation : « le SEO/GEO de cleolabs.co n'est pas menacé par le chantier de maquettes »

Lentille : duplication et indexation du déploiement de test.
Audit mené le 27 août 2026, 17h40–17h55 CEST. Aucun fichier modifié hors ce rapport.
Scripts de mesure : `/private/tmp/claude-501/-Users-naomiehalioua-cleo-maquettes-edge-sortie/scratch-refute-seo/`

## Verdict : REFUTE

L'affirmation ne tient que dans sa lecture la plus étroite — « à cette minute, Googlebot
ne peut pas lire les 26 pages ». Elle tombe sur trois points mesurés :

1. la protection posée il y a une heure est **une seule couche, pas deux** : le
   `Disallow: /` rend les 26 `noindex` illisibles par Google, de l'aveu de Google ;
2. la couche qui fonctionne — `robots.txt` — n'est **produite par aucun script** et
   **vérifiée par aucun test** : elle disparaît sans bruit à la première reconstruction propre ;
3. l'audit déclenché par la maquette a mis au jour **trois autres déploiements publics
   du VRAI site**, ~1 212 URL, `Allow: /` explicite pour GPTBot / ClaudeBot / PerplexityBot /
   CCBot / Google-Extended, contenu **périmé**. C'est 46× le volume de la maquette.

---

## 1. Ce qui tient : la protection de sortie-liart

Testé sur **les 26 pages**, pas une.

| Contrôle | Résultat |
|---|---|
| `https://sortie-liart.vercel.app/robots.txt` | HTTP 200, `User-agent: *` + `Disallow: /` |
| `<meta name="robots" content="noindex,nofollow">` | **26 / 26 pages**, HTTP 200 chacune |
| `sitemap.xml` sur la maquette | **404** — aucune liste d'URL offerte |
| Lien depuis le vrai site | **0 occurrence** de `sortie-liart` / `sortie-naomie` dans `/Users/naomiehalioua/cleo-landing` |
| Sitemap du vrai site | 532 `<loc>`, **532 sur `www.cleolabs.co`** — aucune fuite `.vercel.app` |
| `og:url` de la maquette | pointe vers `www.cleolabs.co`, jamais vers la maquette |

### Le trou que l'on redoutait est fermé

L'hypothèse « une URL `sortie-XXXX.vercel.app` d'avant la correction sert encore les
pages sans noindex » est **fausse**. Les 6 déploiements du projet ont été testés un par un :

```
sortie-m8itpxna6  sortie-n27anm871  sortie-baal454xj
sortie-bjdexwxyd  sortie-muss709c6  sortie-5xjsh19on
```

Tous répondent **302 → `https://vercel.com/sso-api?...`** et portent en en-tête
`x-robots-tag: noindex` posé par Vercel. Vérifié aussi sur le déploiement de 2 h,
celui d'avant la correction. `vercel inspect` ne révèle que **deux alias** :
`sortie-liart.vercel.app` (public) et `sortie-naomie-7307s-projects.vercel.app`
(302 SSO, donc fermé). `sortie.vercel.app` : 404 `DEPLOYMENT_NOT_FOUND`.

**Une seule porte ouverte sur la maquette : `sortie-liart.vercel.app`.**

---

## 2. Défaut 1 — les deux protections s'annulent

Google, `developers.google.com/search/docs/crawling-indexing/block-indexing`, mot pour mot :

> « For the `noindex` rule to be effective, the page or resource **must not** be blocked
> by a robots.txt file, and it has to be otherwise accessible to the crawler. »
> « If the page is blocked by a robots.txt file […] the crawler will never see the
> `noindex` rule, and the page can still appear in search results, for example if
> other pages link to it. »

Le déploiement porte **les deux à la fois**. Conséquence exacte :

- `Disallow: /` fonctionne → Googlebot ne télécharge rien → les 26 `noindex` ne sont
  **jamais lus**. Ils sont décoratifs.
- Si une URL de la maquette était découverte par un lien externe, Google pourrait
  l'afficher en résultat *sans description* — précisément le cas que le `noindex`
  était censé couvrir, et qu'il ne couvre pas ici.

Exactement **une** des deux couches est active à un instant donné, jamais deux.
Le piège opérationnel : quelqu'un qui « corrige » l'incohérence en ouvrant le
`robots.txt` pour rendre le `noindex` lisible **éteint la seule couche qui protège du
GEO** — les robots d'IA lisent `robots.txt`, ils ne lisent pas la balise `noindex`.

Pour la maquette, le bon réglage n'est ni l'un ni l'autre : c'est la **Deployment
Protection Vercel** (celle qui produit déjà le 302 SSO sur les 5 autres URL).

## 3. Défaut 2 — la protection n'a ni producteur ni test

- `construire.mjs` : n'écrit **jamais** `robots.txt`. Deux seules écritures disque,
  `fs.mkdirSync(…'sortie'…)` ligne 340 et `fs.writeFileSync(dest, doc)` ligne 463.
  Le `noindex`, lui, est bien dans le gabarit (ligne 439) — il survit aux rebuilds.
  `robots.txt` est un fichier **posé à la main**, horodaté 17:41:34 aujourd'hui.
- `verifier.mjs` : **zéro** occurrence de `robots`, `noindex`, `canonical`, `hreflang`,
  `og:`, `ld+json`. Le harnais qui garde ce chantier ne regarde rien de ce qui a été
  câblé aujourd'hui.
- `cleo-maquettes-edge` **n'est pas un dépôt git** (`fatal: not a git repository`).
  Aucun historique, aucune récupération possible du fichier s'il saute.

Donc : `rm -rf sortie && node construire.mjs`, ou un build sur une autre machine,
et la seule couche active disparaît **en silence**, sans qu'aucun test ne tombe.

---

## 4. Défaut 3 — le vrai danger n'est pas la maquette

L'audit des projets Vercel du même scope (`vercel projects ls`) a trouvé **trois
déploiements publics du VRAI site cleolabs.co**, tous ouverts :

| Projet | Dernière mise à jour | URL au sitemap | robots.txt | meta robots |
|---|---|---|---|---|
| `cleo-apercu-landing.vercel.app` | 22 j | **470** | `Allow: /` | `index, follow` |
| `cleo-apercu-agents.vercel.app` | 30 j | **472** | `Allow: /` | `index, follow` |
| `cleo-landing-audit.vercel.app` | 146 j | **270** | `Allow: /` | `index, follow` |

Leur `robots.txt` est la copie mot pour mot de celui du vrai site — y compris
l'invitation nominative aux robots d'IA :

```
User-Agent: GPTBot          Allow: /
User-Agent: ChatGPT-User    Allow: /
User-Agent: PerplexityBot   Allow: /
User-Agent: ClaudeBot       Allow: /
User-Agent: anthropic-ai    Allow: /
User-Agent: Google-Extended Allow: /
User-Agent: CCBot           Allow: /
```

**Ce qui protège** : le `canonical` pointe vers `www.cleolabs.co` sur 25/26, 25/26 et
26/26 pages échantillonnées (26 chemins tirés régulièrement du sitemap). Les sitemaps
servis par ces hôtes ne listent que des URL `www.cleolabs.co`, jamais les leurs.
Pour l'index Google, c'est le remède standard et il joue son rôle.

**Ce qui ne protège pas** : `rel=canonical` est un signal d'indexation. Les crawlers
d'IA ne le lisent pas — ils lisent `robots.txt`, et `robots.txt` dit d'entrer.
Le corpus de marque est donc offert en double, sous un hôte `vercel.app`, aux moteurs
dont dépend précisément le travail GEO.

**Et le double est périmé.** Mesure sur `/fr/company` :

- les trois aperçus : `<title>À Propos de Cleo Labs — Soutenue par Kima Ventures | Cleo Labs`
- le vrai site : `<title>À Propos de Cleo Labs : Soutenue par Kima Ventures | Cleo Labs`

Le tiret cadratin que la charge éditoriale a supprimé du vrai site vit encore sur les
trois aperçus. `cleo-landing-audit` sert 34 974 caractères de texte sur cette page
contre 40 301 sur le vrai site, soit **−13 %** : une version d'il y a cinq mois.

Volume comparé : **26 pages** côté maquette, **~1 212 URL** côté aperçus.

À porter honnêtement : ces trois projets **ne sont pas le chantier de maquettes**.
L'audit les a trouvés, il ne les a pas créés. Mais ils sont dans la lentille
« autres déploiements publics du même contenu », et ils pèsent 46× plus lourd.

---

## 5. La duplication réelle, chiffrée

Méthode : extraction du texte visible (scripts, styles, SVG, commentaires et balises
retirés), découpage en phrases, conservation des phrases de **≥ 12 mots**, intersection
exacte page maquette ↔ page `cleolabs.co` désignée par son `canonical`.

**4 phrases identiques sur 134 — 3 %.**

| Page | phrases ≥12 mots (maquette) | communes | % |
|---|---|---|---|
| 01-accueil ↔ /fr | 21 | 2 | 10 % |
| 01-accueil-en ↔ /en | 21 | 1 | 5 % |
| 12-article ↔ /fr/blog/eu-ppwr-packaging-conformity-2026 | 33 | 1 | 3 % |
| 02-entreprise, 05-marche, 10-ressources, 11-blog, 13-glossaire, 18-recrutement, 21-inscription, 22-legal | 59 | **0** | 0 % |

Les 4 phrases communes, ce sont les **verbatims clients** (citation Decathlon en FR et
sa traduction EN) et le **chapô de l'article PPWR** :

> « chez decathlon, notre défi est de capter des informations très précises au milieu
> d'un volume massif de réglementations produits à l'international… »
> « la loi européenne sur les emballages s'applique dans 20 jours : le vrai piège du
> 12 août n'est pas l'échéance… »

Ce qui **est** dupliqué, c'est la métadonnée câblée aujourd'hui :

- **9 titres sur 11** identiques au caractère près au vrai site
- **5 meta descriptions sur 11** identiques au caractère près
- `og:url` de 11 pages pointant sur `www.cleolabs.co`

## 6. Les canonical : protecteurs, et l'inventaire ne colle pas

Le `canonical` inter-domaines vers `cleolabs.co` est **le bon geste**, pas un danger.
La doc Google qualifie `rel=canonical` de « strong signal that the specified URL should
become canonical », et laisse Google trancher — c'est un signal fort, pas une directive.
Ils pointent dans la bonne direction. Deux réserves :

1. sur une page en `noindex` **et** en `Disallow`, le canonical n'est jamais lu. Il ne
   sert qu'en filet, le jour où l'une des deux protections tombe ;
2. **15 pages sur 26 n'ont ni `canonical` ni `og:url`** : `00-composants`,
   `01-accueil-noir`, `03-offre`, `04-secteur`, `06-cas-client`, `07-chat`,
   `08-reglementation`, `09-texte`, `14-terme`, `15-evenements`, `16-evenement`,
   `17-modeles`, `19-poste`, `20-campagne`, `index`.
   Elles ne risquent rien de plus **aujourd'hui** (Google ne peut pas les atteindre),
   mais elles sont sans filet si le `robots.txt` saute, et une page recopiée plus tard
   vers une vraie URL partirait sans canonical auto-référent.

Au passage, l'inventaire annoncé ne correspond pas au mesuré. « 3 blocs JSON-LD par
page » : la mesure donne **104 blocs sur 26 pages, de 0 à 6 par page**.
`index.html` en a **zéro**. Les 104 blocs sont tous du JSON **valide** (0 erreur de
parsing) et ne référencent que `www.cleolabs.co` (18 URL) plus les profils officiels
(LinkedIn ×3, X, YouTube, Product Hunt, Wikidata `Q138466568`, Kima Ventures) —
aucune URL étrangère, aucune donnée inventée détectée.

---

## 7. Faux positifs — ce qui semblait un danger et n'en est pas

- **« Les anciennes URL de déploiement servent encore les pages sans noindex. »**
  Faux. 6/6 en 302 SSO + `x-robots-tag: noindex`.
- **« La maquette duplique le contenu du vrai site. »**
  Faux au niveau du corps de texte : 3 %. C'est la métadonnée qui est dupliquée.
- **« Les canonical vers cleolabs.co sont dangereux. »**
  Non. C'est le remède standard, et il pointe dans le bon sens.
- **« La maquette expose un sitemap. »** Faux : 404.
- **« Le vrai site pointe vers la maquette. »** Faux : 0 occurrence dans `cleo-landing`.
- **« Un second alias public existe. »** Faux : `sortie-naomie-7307s-projects` est en 302 SSO.

## 8. Ce que je n'ai pas pu mesurer

Il n'y a **ni Search Console ni outil de mots-clés** sur cette machine. Je peux mesurer
l'**exposition** ; je ne peux pas mesurer l'**indexation**. Une recherche web sur les
trois hôtes `.vercel.app` n'a rien remonté, mais l'absence de résultat dans un moteur
tiers ne prouve pas l'absence dans l'index de Google. Aucune affirmation de ce rapport
ne repose sur un chiffre de trafic, de position ou de volume de recherche.

---

## 9. À faire, par urgence

**Aujourd'hui**
1. Activer la **Deployment Protection** sur le projet Vercel `sortie` (celle qui produit
   déjà le 302 SSO ailleurs). C'est la seule mesure qui ferme la porte sans dépendre
   d'un fichier posé à la main. Le `robots.txt` et le `noindex` deviennent alors du filet.
2. Décider du sort des trois aperçus du vrai site. Trois options, par ordre de solidité :
   Deployment Protection ; ou `X-Robots-Tag: noindex, nofollow` en en-tête via
   `vercel.json` sur ces projets ; ou suppression pure de `cleo-landing-audit` (146 j,
   plus personne ne s'en sert). Le `canonical` seul ne suffit pas contre les robots d'IA.
   ⚠️ `cleo-apercu-landing` est référencé par `/Users/naomiehalioua/cleo-landing/scripts/apercu.sh`
   et sert de lien d'aperçu quotidien — le protéger, pas le supprimer.

**Cette semaine**
3. Faire produire `sortie/robots.txt` par `construire.mjs`, au lieu de le poser à la main.
4. Ajouter à `verifier.mjs` quatre contrôles qui échouent au build : `robots.txt` présent
   et contenant `Disallow: /` ; `noindex` sur 26/26 pages ; `canonical` sur les pages qui
   ont une contrepartie réelle ; JSON-LD parsable.
5. `git init` sur `cleo-maquettes-edge`. Aujourd'hui, un `rm` mal placé est définitif.

**Avant la prochaine mise en ligne**
6. Trancher l'incohérence `Disallow` / `noindex` **dans le bon sens** : garder
   `Disallow: /` (c'est lui qui protège le GEO), et documenter dans le fichier que le
   `noindex` est un filet volontairement illisible par Google, pour que personne ne
   « corrige » en ouvrant le robots.txt.
7. Poser un `canonical` auto-référent ou une contrepartie réelle sur les 15 pages qui
   n'en ont pas, avant qu'une de ces pages ne migre vers une vraie URL.
