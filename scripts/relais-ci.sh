#!/usr/bin/env bash
# RELAIS DU BLOG HORS DU MAC (28/09/2026), appelé par .github/workflows/site.yml. C'est lui qui précède toute mise en ligne.
# 1. blog-posts.json : avec le secret LANDING_TOKEN, lu dans cleo-landing (API GitHub, lecture seule) ; sans lui (01/10/2026),
#    reconstitué par scripts/blog-posts-public.mjs depuis le plan du site et les pages publiques de l'alias Vercel de
#    cleo-landing, derrière la même validation stricte (blog/securite-contenu.mjs) ;
# 2. HTML rendu des SEULS articles absents de blog/brut.json, depuis ce même alias ;
# 3. portage incrémental + fragments s'il y a du nouveau (ou FORCER=1), puis build et tests, toujours.
# Écrit nouveaux=<n> et articles=<chemins> dans $GITHUB_OUTPUT. Toute étape en échec arrête tout : rien ne part en ligne.
# La ligne TESTS="…" est aussi lue par scripts/relais-blog.sh (le Mac) : une seule liste pour les deux relais.
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
else
  echo "::notice::LANDING_TOKEN absent : métadonnées du blog reconstituées depuis les pages publiques de $ANCIEN"
  ANCIEN_SITE="$ANCIEN" node scripts/blog-posts-public.mjs
fi
# Les couples langue/slug que le dernier portage ne connaît pas encore. blog/brut.json est versionné : si l'autre relais
# (le Mac, ou un passage précédent) a déjà porté et poussé l'article, il n'y a plus rien de nouveau ici.
manquants=$(node -e '
  const fs = require("fs")
  const p = JSON.parse(fs.readFileSync(process.env.BLOGSRC + "/blog-posts.json", "utf8"))
  const deja = new Set(JSON.parse(fs.readFileSync("blog/brut.json", "utf8")).map(a => a.langue + "/" + a.slug))
  for (const a of (Array.isArray(p) ? p : Object.values(p))) for (const l of ["fr", "en"]) if (!deja.has(l + "/" + a.slug)) console.log(l + "/" + a.slug)')
for ls in $manquants; do
  l="${ls%%/*}"; slug="${ls#*/}"; f="$BLOGSRC/$l-$slug.html"
  # Sans jeton, le repli a déjà téléchargé et vérifié la page ; avec le jeton, on la télécharge ici.
  if [ ! -s "$f" ]; then
    code=$(curl -sL -A "Mozilla/5.0 (cleo-site relais)" -o "$f" -w '%{http_code}' "$ANCIEN/$l/blog/$slug")
    if [ "$code" != "200" ] || ! grep -q '<article' "$f"; then echo "::error::article $l/$slug introuvable sur $ANCIEN ($code)"; exit 1; fi
  fi
  echo "téléchargé $l/$slug"; nouveaux=$((nouveaux+1)); articles="$articles /$l/blog/$slug"
done
if [ "$nouveaux" != "0" ] || [ "${FORCER:-0}" = "1" ]; then
  node blog/porter.mjs
  node blog/fragments.mjs
fi

node construire.mjs > /tmp/build.log 2>&1 || { tail -30 /tmp/build.log; exit 1; }
tail -3 /tmp/build.log
TESTS="tests/landings-ads.mjs tests/v6-structure.mjs tests/seo-accueil.mjs tests/servir-routes.mjs tests/blog-securite.mjs tests/blog-sans-jeton.mjs tests/securite-critique.mjs tests/relais-a-jour.mjs tests/csp-atlas-browser.mjs tests/csp-formulaires-browser.mjs tests/sitemap-dates.mjs tests/image-partage.mjs tests/titres-courts.mjs tests/traceurs-referent-browser.mjs"
for t in $TESTS; do
  node "$t" > /tmp/test.log 2>&1 || { echo "::error::test en échec : $t"; tail -20 /tmp/test.log; exit 1; }
  echo "OK $t"
done
echo "nouveaux=$nouveaux" >> "$SORTIE_GH"
echo "articles=$articles" >> "$SORTIE_GH"
echo "relais : $nouveaux page(s) d'article nouvelle(s)"
