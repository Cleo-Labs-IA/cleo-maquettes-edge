# Bascule des maquettes vers cleolabs.co

Mesuré le 02/09/2026. Tous les chiffres ci-dessous viennent d'une commande,
aucun n'est estimé.

---

## Le lien de pré-déploiement

**https://sortie-liart.vercel.app** : 34 pages, toutes en 200.

Il ne peut pas être indexé, et cette fois pour la bonne raison. Le réglage
précédent était faux : `robots.txt` disait `Disallow: /` **et** chaque page
disait `noindex`. Ces deux consignes s'annulent. Un robot bloqué au
`robots.txt` ne charge jamais la page, donc ne lit jamais le `noindex`, et
l'URL peut ressortir en résultat sur ses seuls liens entrants.

Le réglage servi maintenant est l'inverse de l'intuition, et il est vérifié :

```
curl -sI https://sortie-liart.vercel.app/01-accueil.html | grep -i x-robots
  → x-robots-tag: noindex, nofollow, noarchive, nosnippet
curl -s  https://sortie-liart.vercel.app/robots.txt | grep Allow
  → Allow: /
```

On laisse crawler pour que le refus d'indexer soit lu. Il est servi deux fois,
en en-tête HTTP et dans la page.

---

## Ce que la bascule doit préserver, chiffré aujourd'hui

| Signal | Valeur au 02/09 | Valeur au 27/08 |
|---|---|---|
| URL au sitemap | **544** | 532 |
| Pages en 200 | **542** | 530 |
| Blocs JSON-LD | **4 070** | 3 974 |
| Canonical | **542** | 530 |
| Agents nommés au robots.txt | **8** | 8 |
| Mots indexables | **520 198** | 492 397 |

Le site a gagné 12 URL et 27 801 mots en six jours. Il produit pendant qu'on
refait sa forme, ce qui commande la règle de branche ci-dessous.

Empreinte du jour, `garde/reference.json`. Celle du 27/08 est conservée à
côté sous `garde/reference-2026-08-27.json`.

---

## La règle de branche, à lire avant d'ouvrir le dépôt

Le dépôt `~/cleo-landing` est sur `feat/cas-usage-16` :

```
retard sur origin/main : 46 commits
avance locale          : 66 commits
non commité            : 9 fichiers
fichiers sous blog/    : 83 ici, 120 sur origin/main
```

Porter depuis cette branche retirerait **37 fichiers de blog**. La production
sert **228 URL de blog**. On part de `origin/main`, sur une branche neuve, et
on y reporte ce qui mérite de l'être parmi les 66 commits d'avance.

```
cd ~/cleo-landing
git stash push -m "avant bascule 02/09"     # les 9 fichiers en cours
git fetch origin && git switch -c refonte-ds-v5 origin/main
```

---

## L'ordre des opérations

**1. Poser la garde, avant la première ligne modifiée.**

```
cd ~/cleo-maquettes-edge && node garde-seo.mjs capture
```

**2. Relever les fichiers qui émettent du signal, à chaque étape.**

Ils sont **53** aujourd'hui, contre 21 la semaine dernière. Le compte change,
donc on le refait, on ne le mémorise pas :

```
cd ~/cleo-landing
git ls-files 'src/**' | xargs grep -l \
  'application/ld+json\|generateMetadata\|export const metadata'
```

La règle simple « ne touche pas à `layout.tsx` » ne tient pas. Des composants
de présentation portent du structuré, `TeamSection.tsx` et `ArticleShell.tsx`
en tête. Ce relevé se relance avant chaque étape.

**3. Porter, page par page, dans cet ordre.**

On garde les URL, la structure et les gabarits. Seule la peau change.

| Ordre | Ce qu'on porte | Depuis |
|---|---|---|
| 1 | Le socle DS V5 : couleurs, échelle typo, composants | `commun/*.css` |
| 2 | L'accueil | `pages/01-accueil.html` |
| 3 | Les quatre pages ressources | `23-research` `24-blog` `25-skills` `26-legal-data` |
| 4 | Le reste des gabarits | les 22 autres |

**4. Contrôler après chaque page.**

```
cd ~/cleo-maquettes-edge && node garde-seo.mjs compare https://<preview>
```

Sortie 0, on continue. Sortie 1, on lit ce qui a bougé et on répare avant la
page suivante. Le garde a son témoin : il rend 1 sur `cleo-landing-audit`,
0 sur la production.

---

## Les trois copies publiques et périmées

Encore en ligne, encore ouvertes à GPTBot, PerplexityBot, ClaudeBot et
Google-Extended :

| Déploiement | URL | Âge |
|---|---|---|
| `cleo-apercu-landing` | 470 | 28 j |
| `cleo-apercu-agents` | 472 | 36 j |
| `cleo-landing-audit` | 270 | 152 j, sert encore la marque « Cleo Comply » |

Mesure qui tranche la question : **leurs canonical et leurs sitemaps pointent
tous vers `www.cleolabs.co`**. Elles ne portent donc aucune part de ton
référencement, et les protéger ne peut rien te coûter.

`cleo-apercu-landing` sert `scripts/apercu.sh`, ton outil d'aperçu. Celle-là
se protège par mot de passe plutôt qu'elle ne se supprime. La protection se
règle au tableau de bord Vercel, le CLI n'a pas d'option pour ça.

---

## Ce qui attend une décision de ta part

**« Trusted by +1 000 ».** le bloc est posé, sans le chiffre. Aucune source
nulle part, et je ne sais pas ce qu'il compte.

**La citation Decathlon.** le dépôt porte un extrait de 95 mots, la maquette
l'intégrale de 241 mots que tu m'as dictée. À trancher avant le portage.

**Les trois copies périmées.** protection ou suppression.
