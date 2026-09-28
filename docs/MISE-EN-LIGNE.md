# Mise en ligne de www.cleolabs.co

Depuis le 28/09/2026, le site se construit et se met en ligne sur GitHub (`.github/workflows/site.yml`), plus depuis un Mac.

## Ce que fait la tâche `site`

- **Chaque jour** (10 h 45, 14 h 15, 17 h 15, heure d'été) : reprend l'article du jour de cleo-landing, reconstruit, teste, met en ligne s'il y a du nouveau, puis passe le garde SEO sur le domaine.
- **À chaque push** sur `review/wording-2309` : reconstruit, teste, met en ligne.
- **À la main** : onglet Actions → site → Run workflow.

Rien ne part si le build ou un test échoue. Après chaque mise en ligne, `scripts/controle-en-ligne.sh` relit l'accueil, le blog, `/api`, la politique de confidentialité et les 6 landings Ads. Au moindre écart, la tâche remet d'elle-même le déploiement précédent.

## Réglages (une fois)

| Où | Nom | Valeur |
|---|---|---|
| Settings → Secrets and variables → Actions → Secrets | `VERCEL_TOKEN` | jeton Vercel, portée équipe cleo-academys-projects |
| idem | `LANDING_TOKEN` | jeton GitHub fine-grained, dépôt `cleo-academy/cleo-landing`, Contents : Read-only |
| Settings → Secrets and variables → Actions → Variables | `SITE_MODE` | `essai` (build et tests seuls) puis `production` |

Sans `SITE_MODE=production`, la tâche ne met jamais rien en ligne.

## Hors du dépôt, et pourquoi ça marche quand même

Les photos de personnes et la police Satoshi (licence Fontshare) ne sont pas versionnées, parce que le dépôt est public. Quand leur source manque, `construire.mjs` reprend le fichier déjà fabriqué sur www.cleolabs.co, d'après `commun/images-manifeste.json`. Ce manifeste est réécrit par chaque build complet sur le Mac.

**Ajouter une nouvelle photo de personne** : il faut donc un build et une mise en ligne depuis le Mac (`node construire.mjs && vercel deploy sortie --prod --scope cleo-academys-projects`), puis pousser le manifeste. Sans cela, la tâche GitHub s'arrête sur `IMAGE ABSENTE` et ne met rien en ligne.

## Retour arrière manuel

`npx vercel promote <url-du-déploiement-précédent> --scope cleo-academys-projects`, ou Vercel → cleo-site-v6 → Deployments → Promote.
