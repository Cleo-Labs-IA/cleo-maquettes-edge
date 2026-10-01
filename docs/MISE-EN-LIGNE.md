# Mise en ligne de www.cleolabs.co

**Une seule chaîne met le site en ligne : la tâche GitHub `site`** (`.github/workflows/site.yml`). Depuis le 01/10/2026, le Mac ne déploie plus rien.

## Qui fait quoi

| | Met en ligne ? | Ce qu'il fait |
|---|---|---|
| Tâche GitHub `site` | **Oui, elle seule** | Relais du blog, build, tests, `vercel deploy --prod`, contrôle des adresses, retour arrière automatique |
| Mac, launchd `com.cleolabs.relais-blog` (10 h 40 et 14 h 10) | **Non** | Se met à jour sur origin, porte l'article du jour, construit, teste, commite, **pousse**. Le push déclenche la tâche `site` |

### La tâche `site`

- **Chaque jour** (10 h 45, 14 h 15, 17 h 15, heure d'été) : reprend l'article du jour de cleo-landing, reconstruit, teste, met en ligne s'il y a du nouveau, versionne le portage, puis passe le garde SEO sur le domaine.
- **À chaque push** sur `review/wording-2309` (y compris un push du relais du Mac) : reconstruit, teste, met en ligne.
- **À la main** : onglet Actions → site → Run workflow. La case « forcer » relit tous les articles.

Rien ne part si le build ou un test échoue. Après chaque mise en ligne, `scripts/controle-en-ligne.sh` relit l'accueil, le blog, `/api`, la politique de confidentialité et les 6 landings Ads. Au moindre écart, la tâche remet d'elle-même le déploiement précédent.

Le commit de blog que la tâche pousse elle-même part avec le `GITHUB_TOKEN` : GitHub ne déclenche aucune tâche pour ce push, il n'y a donc pas de boucle.

### D'où viennent les métadonnées du blog

- **Avec le secret `LANDING_TOKEN`** : `blog-posts.json` est lu dans le dépôt privé `cleo-academy/cleo-landing`.
- **Sans lui** : `scripts/blog-posts-public.mjs` le reconstitue depuis le plan du site et les pages publiques de l'alias `cleo-landing-cleo-academys-projects.vercel.app` (JSON-LD de chaque article), derrière la même validation stricte. Mesuré le 01/10/2026 sur les 142 articles : titre, description, date, catégorie, auteur, temps de lecture, couverture, mots-clés et FAQ sont identiques au fichier privé, et le porteur produit les mêmes pages à l'octet près.
- Limite du mode sans jeton : la correction d'un article **déjà porté** (un titre, une FAQ) n'est reprise qu'en lançant la tâche à la main avec « forcer ».
- **Titre court d'un article (son `<title>`), dans l'ordre** : (1) la ligne du slug dans `blog/titres-courts.json` ; (2) sinon le `seoTitle` de l'article dans `blog-posts.json` de cleo-landing (sans jeton : le `<title>` de la page publique quand il diffère du titre long), gardé dans `blog/brut.json` sous `titreCourt` ; (3) sinon le titre long coupé au mot. Le titre long (h1, og:title, JSON-LD) vient toujours de `title` ou du `headline` du JSON-LD, jamais du `<title>`. Règle dans `blog/titre-court.mjs`, preuve : `node tests/titre-court-source.mjs`.

### Le relais du Mac (`scripts/relais-blog.sh`)

Il a remis en production du code ancien le 01/10/2026 à 10 h 59 : il ne faisait jamais de `git pull`, avalait l'échec de son push, puis déployait quand même. Il est réécrit pour que ce soit impossible :

1. arbre de travail pas propre, HEAD détaché ou rebase en cours : il s'arrête sans rien toucher (code 3) ;
2. `git fetch`, puis avance rapide sur `origin/<branche>` ; s'il a des commits locaux jamais poussés, il les rebase ; au moindre conflit il abandonne le rebase et s'arrête (code 5) ;
3. il télécharge les pages des articles que `blog/brut.json` ne connaît pas, porte, construit, lance **la même liste de tests que la tâche GitHub** (ligne `TESTS=` de `scripts/relais-ci.sh`) ;
4. il commite et pousse. Un push refusé s'écrit en clair dans le journal, annule le commit du relais et sort en code 6 ;
5. il ne contient plus aucune commande `vercel`.

Si la tâche GitHub a déjà porté l'article, le Mac le reçoit en se mettant à jour et constate qu'il n'y a rien de nouveau (et inversement) : les deux comparent `blog-posts.json` à `blog/brut.json`, qui est versionné.

`SANS_DEPLOI=1` : essai complet sans commit ni push. `FORCER=1` : reporte tout le blog. Journal : `~/Library/Logs/cleo-relais-blog.log`. Preuve : `node tests/relais-a-jour.mjs`.

## Ce qu'il reste à faire à la main

1. **Avant le prochain passage de 10 h 40 : arrêter l'ancien relais.** Le launchd lance le script du clone `~/cleo-site-v6`, qui ne se met jamais à jour tout seul : tant que ce clone n'a pas reçu la nouvelle version, c'est l'ancien script qui tourne, et il déploie encore. Le plus sûr, puisque la tâche GitHub relaie le blog sans le Mac :

   ```
   launchctl bootout gui/$(id -u)/com.cleolabs.relais-blog
   mv ~/Library/LaunchAgents/com.cleolabs.relais-blog.plist ~/Library/LaunchAgents/com.cleolabs.relais-blog.plist.off
   ```

   La première ligne l'arrête tout de suite, la seconde l'empêche de revenir à la prochaine ouverture de session. Vérifier : `launchctl list | grep relais-blog` ne rend rien.

   Pour garder le Mac en secours à la place : une fois cette branche fusionnée, `cd ~/cleo-site-v6 && git status && git pull --ff-only`, une seule fois. Ensuite le script se met à jour seul.

2. **Créer `LANDING_TOKEN`** (facultatif depuis le repli sans jeton, utile pour que les corrections d'anciens articles suivent d'elles-mêmes) :
   - GitHub → photo de profil → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token ;
   - Resource owner : `cleo-academy` ; Repository access : Only select repositories → `cleo-academy/cleo-landing` ;
   - Repository permissions → **Contents : Read-only** (Metadata : Read-only se coche seul). Rien d'autre ;
   - le coller dans `Cleo-Labs-IA/cleo-maquettes-edge` → Settings → Secrets and variables → Actions → onglet Secrets → New repository secret, nom `LANDING_TOKEN`.

## Réglages (une fois)

| Où | Nom | Valeur |
|---|---|---|
| Settings → Secrets and variables → Actions → Secrets | `VERCEL_TOKEN` | jeton Vercel, portée équipe cleo-academys-projects |
| idem | `LANDING_TOKEN` | facultatif, voir ci-dessus |
| Settings → Secrets and variables → Actions → Variables | `SITE_MODE` | `essai` (build et tests seuls) puis `production` |

Sans `SITE_MODE=production`, la tâche ne met jamais rien en ligne.

## Hors du dépôt, et pourquoi ça marche quand même

Les photos de personnes et la police Satoshi (licence Fontshare) ne sont pas versionnées, parce que le dépôt est public. Quand leur source manque, `construire.mjs` reprend le fichier déjà fabriqué sur www.cleolabs.co, d'après `commun/images-manifeste.json`. Ce manifeste est réécrit par chaque build complet sur le Mac.

**Ajouter une nouvelle photo de personne** : c'est le seul cas qui demande encore un build et une mise en ligne depuis le Mac. Toujours depuis un clone à jour : `git pull --ff-only && node construire.mjs && vercel deploy sortie --prod --scope cleo-academys-projects`, puis pousser le manifeste. Sans cela, la tâche GitHub s'arrête sur `IMAGE ABSENTE` et ne met rien en ligne.

## Retour arrière manuel

`npx vercel promote <url-du-déploiement-précédent> --scope cleo-academys-projects`, ou Vercel → cleo-site-v6 → Deployments → Promote.
