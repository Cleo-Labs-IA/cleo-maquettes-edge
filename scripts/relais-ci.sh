#!/usr/bin/env bash
# RELAIS DU BLOG HORS DU MAC (28/09/2026), appelé par .github/workflows/site.yml. Remplace scripts/relais-blog.sh (launchd).
# 1. blog-posts.json frais depuis cleo-landing (API GitHub, jeton LANDING_TOKEN en lecture seule) ;
# 2. HTML rendu des SEULS articles absents de blog/brut.json, depuis l'alias Vercel de cleo-landing ;
# 3. portage incrémental + fragments s'il y a du nouveau (ou FORCER=1), puis build et tests, toujours.
# Sans LANDING_TOKEN : pas de relais, build et tests seuls sur les fichiers versionnés.
# Écrit nouveaux=<n> et articles=<chemins> dans $GITHUB_OUTPUT. Toute étape en échec arrête tout : rien ne part en ligne.
set -euo pipefail
: "${BLOGSRC:?BLOGSRC manquant}"
ANCIEN="${ANCIEN_SITE:-https://cleo-landing-cleo-academys-projects.vercel.app}"
SORTIE_GH="${GITHUB_OUTPUT:-/dev/null}"
mkdir -p "$BLOGSRC"
nouveaux=0; articles=""

if [ -n "${LANDING_TOKEN:-}" ]; then
  node scripts/curl-auth.mjs LANDING_TOKEN -fsSL -H "Accept: application/vnd.github.raw" \
    "https://api.github.com/repos/cleo-academy/cleo-landing/contents/src/data/blog-posts.json?ref=main" -o "$BLOGSRC/blog-posts.json"
  unset LANDING_TOKEN
  # Les couples langue/slug que le dernier portage ne connaît pas encore.
  manquants=$(node -e '
    const fs = require("fs")
    const p = JSON.parse(fs.readFileSync(process.env.BLOGSRC + "/blog-posts.json", "utf8"))
    const deja = new Set(JSON.parse(fs.readFileSync("blog/brut.json", "utf8")).map(a => a.langue + "/" + a.slug))
    for (const a of (Array.isArray(p) ? p : Object.values(p))) for (const l of ["fr", "en"]) if (!deja.has(l + "/" + a.slug)) console.log(l + "/" + a.slug)')
  for ls in $manquants; do
    l="${ls%%/*}"; slug="${ls#*/}"; f="$BLOGSRC/$l-$slug.html"
    code=$(curl -sL -A "Mozilla/5.0 (cleo-site relais)" -o "$f" -w '%{http_code}' "$ANCIEN/$l/blog/$slug")
    if [ "$code" != "200" ] || ! grep -q '<article' "$f"; then echo "::error::article $l/$slug introuvable sur $ANCIEN ($code)"; exit 1; fi
    echo "téléchargé $l/$slug"; nouveaux=$((nouveaux+1)); articles="$articles /$l/blog/$slug"
  done
  if [ "$nouveaux" != "0" ] || [ "${FORCER:-0}" = "1" ]; then
    node blog/porter.mjs
    node blog/fragments.mjs
  fi
else
  echo "::warning::LANDING_TOKEN absent : pas de relais du blog, build et tests seuls"
fi

node construire.mjs > /tmp/build.log 2>&1 || { tail -30 /tmp/build.log; exit 1; }
tail -3 /tmp/build.log
for t in tests/landings-ads.mjs tests/v6-structure.mjs tests/seo-accueil.mjs tests/servir-routes.mjs tests/blog-securite.mjs tests/securite-critique.mjs tests/csp-atlas-browser.mjs tests/csp-formulaires-browser.mjs tests/traceurs-referent-browser.mjs; do
  node "$t" > /tmp/test.log 2>&1 || { echo "::error::test en échec : $t"; tail -20 /tmp/test.log; exit 1; }
  echo "OK $t"
done
echo "nouveaux=$nouveaux" >> "$SORTIE_GH"
echo "articles=$articles" >> "$SORTIE_GH"
echo "relais : $nouveaux page(s) d'article nouvelle(s)"
