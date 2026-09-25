#!/bin/zsh
# RELAIS DU BLOG QUOTIDIEN (23/09/2026). L'article du jour atterrit dans cleo-landing (PR daily-article/*, merge à 10 h).
# Ce relais le fait passer dans le site statique : blog-posts.json frais depuis origin/main de cleo-landing, HTML des
# articles nouveaux téléchargé depuis l'ancien site, portage, fragments, build, tests, déploiement du projet Vercel sortie.
# Usage : scripts/relais-blog.sh [dossier-du-depot]   (par défaut ~/cleo-maquettes-edge-avant-vendre)
# Lancé chaque jour à 10 h 40 par launchd (scripts/com.cleolabs.relais-blog.plist). Journal : ~/Library/Logs/cleo-relais-blog.log
# FORCER=1 relance portage, build et déploiement même sans article nouveau. SANS_DEPLOI=1 s'arrête avant la mise en ligne (essai).
set -u
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.nvm/versions/node/v24.2.0/bin:/usr/bin:/bin"
DEPOT="${1:-$HOME/cleo-maquettes-edge-avant-vendre}"
export BLOGSRC="${BLOGSRC:-$HOME/cleo-blog-source}"
LANDING="$HOME/cleo-landing"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
# Où lire le HTML rendu des articles : le domaine tant qu'il sert l'ancien site, puis l'alias Vercel de cleo-landing
# (le même que ANCIEN_SITE dans construire.mjs) une fois le domaine basculé.
ANCIEN="${ANCIEN_SITE:-https://www.cleolabs.co}"
dit() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" }
cd "$DEPOT" || { dit "dépôt introuvable : $DEPOT"; exit 1 }
dit "relais du blog, dépôt $DEPOT, branche $(git rev-parse --abbrev-ref HEAD)"
git -C "$LANDING" fetch -q origin || { dit "fetch cleo-landing impossible"; exit 1 }
git -C "$LANDING" show origin/main:src/data/blog-posts.json > "$BLOGSRC/blog-posts.json" || { dit "blog-posts.json illisible"; exit 1 }
nouveaux=0
for slug in $(node -e 'const p=require(process.env.BLOGSRC+"/blog-posts.json");for(const a of (Array.isArray(p)?p:Object.values(p)))console.log(a.slug)'); do
  for l in fr en; do
    f="$BLOGSRC/$l-$slug.html"
    if [ ! -s "$f" ]; then
      code=$(curl -sL -A "$UA" -o "$f" -w '%{http_code}' "$ANCIEN/$l/blog/$slug")
      if [ "$code" = "200" ] && grep -q '<article' "$f"; then nouveaux=$((nouveaux+1)); dit "téléchargé $l/$slug"; else rm -f "$f"; dit "échec $l/$slug ($code)"; fi
    fi
  done
done
# Chaque jour, quoi qu'il arrive : le garde SEO relit les 590 adresses de référence sur le domaine et refuse de se taire.
if node garde-seo.mjs verifier https://www.cleolabs.co > /tmp/relais-garde.log 2>&1; then dit "garde SEO : aucun signal dégradé sur www.cleolabs.co"; else dit "GARDE SEO EN ÉCHEC sur www.cleolabs.co :"; grep -E "DÉGRADATION|^  /" /tmp/relais-garde.log | head -12; fi
if [ "$nouveaux" = "0" ] && [ "${FORCER:-0}" != "1" ]; then dit "aucun article nouveau, rien à faire"; exit 0; fi
node blog/porter.mjs > /tmp/relais-porter.log 2>&1 || { dit "porter en échec"; tail -5 /tmp/relais-porter.log; exit 1 }
node blog/fragments.mjs > /tmp/relais-fragments.log 2>&1 || { dit "fragments en échec"; tail -5 /tmp/relais-fragments.log; exit 1 }
node construire.mjs > /tmp/relais-build.log 2>&1 || { dit "build en échec"; tail -5 /tmp/relais-build.log; exit 1 }
for t in tests/v6-structure.mjs tests/seo-accueil.mjs tests/servir-routes.mjs; do node "$t" > /tmp/relais-test.log 2>&1 || { dit "test en échec : $t"; tail -5 /tmp/relais-test.log; exit 1 }; done
git add pages/blog blog commun/v6-routes.json pages/24-blog.html pages/24-blog-en.html && git commit -q -m "blog : relais quotidien, $nouveaux fichier(s) nouveau(x) ($(date '+%d/%m/%Y'))" && dit "commité $(git rev-parse --short HEAD)"
git push -q origin HEAD 2>/dev/null && dit "poussé" || dit "push différé (hook ou réseau), le commit reste local"
if [ "${SANS_DEPLOI:-0}" = "1" ]; then dit "SANS_DEPLOI=1 : build et tests faits, pas de mise en ligne"; exit 0; fi
url=$(vercel deploy sortie --prod --yes --scope cleo-academys-projects 2>&1 | grep -oE 'https://[a-z0-9.-]*vercel.app' | tail -1)
dit "déployé : ${url:-?}"
