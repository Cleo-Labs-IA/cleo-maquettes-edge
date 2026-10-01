# Lot 5 : le relais du Mac ne peut plus écraser la production

Branche `fix/seo-0110-5-relais`, 01/10/2026. Rien n'a été poussé ni déployé.

## 1. Ce qui s'est passé

Le Mac et GitHub mettaient tous les deux le site en ligne. Le script du Mac ne faisait jamais de `git pull`, cachait l'échec de son push derrière « push différé », puis lançait quand même `vercel deploy --prod`. Le 01/10 à 10 h 59, avec 13 commits de retard, il a remis en ligne un site sans les correctifs de sécurité du 30/09.

## 2. Ce qui change

- **Le Mac ne déploie plus.** `scripts/relais-blog.sh` est réécrit : il se met à jour sur origin (avance rapide, rebase des commits locaux, arrêt net au moindre conflit), porte l'article, construit, lance les mêmes tests que GitHub, commite, pousse. C'est le push qui déclenche la tâche GitHub `site`, seule à mettre en ligne. Le script ne contient plus aucune commande `vercel`.
- **Un push refusé se voit.** Il est écrit en clair dans le journal avec la réponse de git, le commit du relais est annulé, le code de sortie est 6.
- **GitHub relaie le blog sans le Mac et sans jeton.** `scripts/blog-posts-public.mjs` reconstitue les métadonnées depuis les pages publiques, derrière la même validation stricte.
- **Une seule liste de tests** pour les deux relais : la ligne `TESTS=` de `scripts/relais-ci.sh`, que le script du Mac relit. Elle gagne deux tests, 10 au total.
- **Le Mac prenait Node 18.** L'ancien PATH mettait `/usr/local/bin` (Node 18.20.3) avant nvm. Le porteur sécurisé exige Node 22 : la répétition sur copie a échoué là-dessus au premier essai. Le script choisit maintenant le Node le plus récent de nvm et s'arrête en clair sous Node 22.

## 3. La preuve

`node tests/relais-a-jour.mjs` : des dépôts git temporaires avec un origin local, de faux `node`, `curl`, `vercel` et `npm` qui notent chaque appel. Aucun réseau, aucun déploiement. Le vrai script tourne en entier.

| Scénario | Résultat avec le nouveau script |
|---|---|
| A. clone en retard, un commit local | à jour, commit local rebasé au-dessus du correctif, article poussé, `vercel` jamais appelé (7 contrôles) |
| B. clone en conflit avec origin | sortie ≠ 0, rien téléchargé, construit ni poussé, clone intact (5 contrôles) |
| C. arbre de travail modifié | sortie 3, la modification en cours est conservée (3 contrôles) |
| D. push refusé par origin | sortie 6, refus écrit en clair, commit du relais annulé (4 contrôles) |
| E. second relais après le premier | se met à jour, « aucun article nouveau », origin ne bouge pas (5 contrôles) |
| F. commit local jamais poussé, pas d'article | construit, testé, poussé (4 contrôles) |
| G. origin apporte une nouvelle version du relais | il se relance une fois avec elle (4 contrôles) |

**Témoin négatif** : l'ancien script (`tests/relais-blog-temoin-cfbc9e3.sh.txt`, copie exacte de `git show cfbc9e3:scripts/relais-blog.sh`, dont seule la ligne `export PATH` est retirée pour qu'il n'appelle que les faux outils) rejoue A, B et D. Il échoue 5 contrôles sur 7 en A, 5 sur 5 en B, 4 sur 4 en D, et atteint `vercel deploy sortie --prod` les trois fois. Le témoin est en zsh : sur GitHub Actions, où zsh manque, il est sauté et le test l'écrit.

## 4. Les trois questions posées

**Un push du Mac déclenche-t-il la mise en ligne, sans boucle ?** Oui. `site.yml` écoute `push` sur `review/wording-2309` et ne bloque (`go=0`) que l'événement `schedule` sans article nouveau. Le commit de blog fait par la tâche elle-même part avec le `GITHUB_TOKEN` : GitHub ne déclenche aucune tâche pour un push fait avec ce jeton, donc pas de boucle.

**Si les deux portent le même article le même jour ?** Les deux relais comparent `blog-posts.json` à `blog/brut.json`, qui est versionné. Le second, une fois à jour, ne trouve plus rien : c'est le scénario E. L'ancien critère du Mac (la page existe-t-elle dans `~/cleo-blog-source`) aurait refait le portage. Reste le cas où les deux tournent dans les mêmes minutes : un des deux push est refusé. Côté Mac, code 6 et commit annulé, le passage suivant ne trouve rien. Côté GitHub, l'étape « Versionner » vérifie maintenant que la branche contient déjà les articles avant de se dire en échec. Cette étape n'a pas pu être essayée sur GitHub (rien n'est poussé) ; sa ligne de comparaison a été essayée à la main dans les deux sens.

**Peut-on se passer de `LANDING_TOKEN` ?** Oui, c'est implémenté.

- `/en/blog/rss.xml` sur l'alias public est un faux 200 : il sert l'index du blog (titre « Blog | Cleo Labs », aucun `<article>`), comme tout slug inconnu. Inutilisable.
- `/sitemap.xml` est réel : 142 articles, chacun en deux langues.
- Champs exigés par `blog/securite-contenu.mjs` : `slug`, `title`, `description`, `category`, `author`, `date`, `readTime`, `keywords`. Facultatifs : `coverImage`, `faq`, `featured`, `tweet`, `related`, `coverAspect`. `blog/porter.mjs` et `blog/fragments.mjs` lisent `slug`, `title`, `description`, `date`, `category`, `readTime`, `author`, `coverImage`, `faq`.
- Où ils se trouvent dans la page rendue : `title`, `description`, `date`, `category`, `author`, `coverImage` dans le JSON-LD `TechArticle` ; `faq` dans le JSON-LD `FAQPage` ; `keywords` dans les balises `article:tag` ; `readTime` dans le texte affiché de l'article (seul champ absent du JSON-LD).
- Mesure sur les 284 pages locales contre le vrai fichier : 0 écart sur ces 10 champs pour les 142 articles. Le porteur et les fragments, lancés avec le fichier reconstitué, produisent les mêmes fichiers à l'octet près (`diff -r` vide). Le repli lancé en direct sur l'alias rend le même fichier que hors ligne.
- Ce qui n'est pas dans le HTML : `featured`, `tweet`, `related`, `coverAspect`. Aucun n'est lu par le générateur.
- Limite : la correction d'un article déjà porté n'est reprise qu'avec « forcer ». Avec le jeton elle suit toute seule au portage suivant.

## 5. Les six pages repassées par le porteur sécurisé

Les 6 pages (`eu-garan-guarantee-label-2026`, `china-toy-safety-standard-2026`, `new-zealand-pop-chemicals-restriction-2026`, FR et EN) ressortent **identiques** : diff vide sur les pages et sur leurs entrées de `blog/brut.json`. Elles étaient déjà saines.

Ce que le passage a révélé à côté : le correctif de sécurité du 30/09 avait ajouté l'assainissement sans régénérer les fichiers versionnés. Le porteur sécurisé change **51 autres pages** et autant d'entrées de `blog/brut.json` : commentaires React `<!-- -->` retirés, `&nbsp;` normalisés, et **4 pages perdent un lien de source en `http://`** (le lien reste en texte, sans adresse) : `us-cpsc-treadmill-reporting-fine-2026` et `china-cosmetics-safety-standard-2026`, FR et EN. Ces changements sont dans le commit, sinon le premier relais les aurait emportés sous l'étiquette « relais quotidien ». À décider par Naomie : repasser ces deux sources en `https://` dans cleo-landing.

## Ce qui reste à faire à la main

1. **Avant demain 10 h 40.** Le launchd lance le script du clone `~/cleo-site-v6`, qui a encore l'ancienne version et ne se met jamais à jour seul. Au prochain article il redéploiera du code ancien. Arrêter le launchd :
   `launchctl bootout gui/$(id -u)/com.cleolabs.relais-blog` puis `mv ~/Library/LaunchAgents/com.cleolabs.relais-blog.plist ~/Library/LaunchAgents/com.cleolabs.relais-blog.plist.off`.
   Ou, pour garder le Mac en secours, après fusion de cette branche : `cd ~/cleo-site-v6 && git status && git pull --ff-only`, une fois.
2. **Pousser et fusionner cette branche** dans `review/wording-2309`.
3. **`LANDING_TOKEN`, facultatif.** Jeton GitHub fine-grained, Resource owner `cleo-academy`, dépôt `cleo-academy/cleo-landing` seul, Repository permissions → Contents : Read-only. À coller dans `Cleo-Labs-IA/cleo-maquettes-edge` → Settings → Secrets and variables → Actions → Secrets, nom `LANDING_TOKEN`.

## Non vérifié, à savoir

- `blog/fragments.mjs` cherche les couvertures de 4 articles « maison » dans `~/cleo-landing/public/blog-bank/`, un dossier qui n'existe que sur le Mac. Sur le Mac, 1 de ces 4 cartes de l'index du blog a sa vraie image ; sur GitHub elle retomberait sur l'image par défaut. Écart possible entre un portage GitHub et un portage Mac sur cette carte, pas mesuré sur GitHub.
- L'étape « Versionner » de `site.yml` et le repli sans jeton n'ont pas tourné sur GitHub Actions, seulement en local.

## Pour vérifier

- `node tests/relais-a-jour.mjs` et `node tests/blog-sans-jeton.mjs` rendent 0.
- Boucle complète : `node construire.mjs` (355 pages) puis les 10 tests de `scripts/relais-ci.sh`, tous verts.
- Répétition sur copie jetable (clone local, origin pointant sur ce worktree, `brut.json` privé des 3 derniers articles) avec `SANS_DEPLOI=1` : 6 pages téléchargées, garde SEO sans signal dégradé, build et 10 tests verts, code 0, arbre remis propre, 3 min 29.
- `git ls-files -s scripts/relais-blog.sh` commence par `100755`.

10/10 chiffres de ce rapport vérifiés par commande le 01/10/2026 (284 pages, 142 articles, 0 écart, 51 pages, 4 liens, 7 scénarios, 3 témoins, 10 tests, 355 pages, 3 min 29).
