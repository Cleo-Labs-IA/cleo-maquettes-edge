#!/usr/bin/env bash
# RELAIS DU BLOG SUR LE MAC (23/09/2026, réécrit le 01/10/2026). Le Mac NE MET PLUS RIEN EN LIGNE.
# Il se met à jour sur origin, télécharge l'article du jour, le porte, construit, teste, commite et POUSSE.
# C'est le push qui déclenche .github/workflows/site.yml, seule chaîne à mettre en ligne (contrôle et retour arrière compris).
#
# Pourquoi : jusqu'au 01/10/2026 ce script ne faisait jamais de `git pull`, avalait l'échec du push (« push différé »)
# puis lançait `vercel deploy sortie --prod`. Le 01/10 à 10 h 59, avec 13 commits de retard, il a remis en production un
# site sans les correctifs de sécurité du 30/09. Garde-fous, prouvés par tests/relais-a-jour.mjs :
#   1. arbre de travail pas propre (chemins suivis), HEAD détaché ou rebase en cours : arrêt, rien n'est touché ;
#   2. `git fetch`, puis avance rapide sur origin/<branche> ; commits locaux non poussés : rebase ; au moindre conflit,
#      `git rebase --abort`, journal explicite, code 5, aucune étape suivante ;
#   3. un push refusé s'écrit en clair dans le journal, annule le commit du relais et sort en code 6.
#
# Usage : scripts/relais-blog.sh [dossier-du-depot]   (par défaut ~/cleo-site-v6)
# Lancé par launchd (scripts/com.cleolabs.relais-blog.plist). Journal : ~/Library/Logs/cleo-relais-blog.log
# FORCER=1      reporte tout le blog et pousse, même sans article nouveau.
# SANS_DEPLOI=1 essai : mise à jour, portage, build et tests, puis l'arbre est remis en état. Ni commit ni push.
# Codes de sortie : 0 fait ou rien à faire · 1 étape en échec · 3 dépôt pas en état · 4 fetch impossible ·
#                   5 mise à jour impossible (conflit) · 6 push refusé.
# Tout le fichier tient dans des fonctions : bash le lit en entier avant d'agir, la mise à jour peut donc le réécrire.
set -uo pipefail
TMP=""

relais() {
  # Node 22 au moins (package.json) : le porteur sécurisé ne tourne pas sous le Node 18 de /usr/local/bin, que l'ancien
  # PATH prenait en premier (constaté le 01/10/2026). On prend le Node le plus récent de nvm, sinon celui du système.
  export PATH="${RELAIS_PATH:-/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin}"
  if [ -z "${RELAIS_PATH:-}" ]; then
    local d
    for d in $(ls -d "$HOME"/.nvm/versions/node/v*/bin 2>/dev/null | sort -V -r); do
      if [ -x "$d/node" ] && [ "$("$d/node" -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)" -ge 22 ]; then PATH="$d:$PATH"; break; fi
    done
  fi
  local majeure; majeure=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)
  if [ "${majeure:-0}" -lt 22 ] 2>/dev/null; then dit "ARRÊT : Node 22 ou plus est requis, trouvé « $(node -v 2>/dev/null || echo aucun) » ($(command -v node || echo introuvable))"; return 1; fi
  local DEPOT="${1:-$HOME/cleo-site-v6}"
  export BLOGSRC="${BLOGSRC:-$HOME/cleo-blog-source}"
  local LANDING="${LANDING:-$HOME/cleo-landing}"
  # Le HTML rendu des articles : l'alias Vercel de cleo-landing (www.cleolabs.co sert le site statique depuis le 23/09).
  local ANCIEN="${ANCIEN_SITE:-https://cleo-landing-cleo-academys-projects.vercel.app}"
  local UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36'
  TMP=$(mktemp -d "${TMPDIR:-/tmp}/relais-blog.XXXXXX") || { dit "dossier temporaire impossible"; return 1; }
  trap '[ -z "$TMP" ] || rm -rf "$TMP"' EXIT

  local SOI; SOI="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
  cd "$DEPOT" || { dit "dépôt introuvable : $DEPOT"; return 1; }
  dit "relais du blog, dépôt $DEPOT, branche $(git rev-parse --abbrev-ref HEAD 2>/dev/null)"

  # ── 1. Se mettre exactement à jour sur origin, ou s'arrêter. ────────────────────────────────────────────────
  local empreinte; empreinte=$(git hash-object "$SOI" 2>/dev/null || echo "?")
  mettre_a_jour || return $?
  local branche; branche=$(git symbolic-ref --short HEAD)
  if [ "$(git hash-object "$SOI" 2>/dev/null || echo "?")" != "$empreinte" ] && [ "${RELAIS_RELANCE:-0}" != "1" ]; then
    dit "le relais lui-même a changé avec la mise à jour : relance avec la nouvelle version"
    rm -rf "$TMP"; TMP=""; RELAIS_RELANCE=1 exec "$SOI" "$@"
  fi
  local avance; avance=$(git rev-list --count "origin/$branche..HEAD")

  # ── 2. blog-posts.json frais (cleo-landing, origin/main) et pages des articles que blog/brut.json ne connaît pas. ──
  mkdir -p "$BLOGSRC"
  git -C "$LANDING" fetch -q origin 2> "$TMP/landing.log" || { dit "fetch cleo-landing impossible :"; cat "$TMP/landing.log"; return 1; }
  git -C "$LANDING" show origin/main:src/data/blog-posts.json > "$TMP/blog-posts.json" 2> "$TMP/landing.log" || { dit "blog-posts.json illisible :"; cat "$TMP/landing.log"; return 1; }
  rm -f "$BLOGSRC/blog-posts.json"; cp "$TMP/blog-posts.json" "$BLOGSRC/blog-posts.json" || { dit "écriture de $BLOGSRC/blog-posts.json impossible"; return 1; }
  # Le critère est le même que dans scripts/relais-ci.sh : un couple langue/slug absent de blog/brut.json, le fichier
  # VERSIONNÉ. Si la CI a déjà porté l'article, la mise à jour ci-dessus l'a apporté et il n'y a plus rien à faire.
  local manquants
  manquants=$(node -e '
    const fs = require("fs")
    const p = JSON.parse(fs.readFileSync(process.env.BLOGSRC + "/blog-posts.json", "utf8"))
    const deja = new Set(JSON.parse(fs.readFileSync("blog/brut.json", "utf8")).map(a => a.langue + "/" + a.slug))
    for (const a of (Array.isArray(p) ? p : Object.values(p))) {
      if (typeof a.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a.slug) || a.slug.length > 100) { console.error("slug hors format"); process.exit(1) }
      for (const l of ["fr", "en"]) if (!deja.has(l + "/" + a.slug)) console.log(l + "/" + a.slug)
    }') || { dit "liste des articles illisible (blog-posts.json ou blog/brut.json)"; return 1; }
  local nouveaux=0 ls l slug f code
  for ls in $manquants; do
    l="${ls%%/*}"; slug="${ls#*/}"; f="$BLOGSRC/$l-$slug.html"
    code=$(curl -sL -A "$UA" -o "$TMP/page.html" -w '%{http_code}' "$ANCIEN/$l/blog/$slug")
    if [ "$code" != "200" ] || ! grep -q '<article' "$TMP/page.html"; then
      dit "ARRÊT : article $l/$slug introuvable sur $ANCIEN (code $code). Rien n'est commité ni poussé ; nouvel essai au prochain passage."
      return 1
    fi
    rm -f "$f"; cp "$TMP/page.html" "$f" || { dit "écriture de $f impossible"; return 1; }
    nouveaux=$((nouveaux+1)); dit "téléchargé $l/$slug"
  done

  # ── 3. Chaque jour, quoi qu'il arrive : le garde SEO relit les adresses de référence sur le domaine. ───────────
  if node garde-seo.mjs verifier https://www.cleolabs.co > "$TMP/garde.log" 2>&1; then dit "garde SEO : aucun signal dégradé sur www.cleolabs.co"
  else dit "GARDE SEO EN ÉCHEC sur www.cleolabs.co :"; grep -E "DÉGRADATION|^  /" "$TMP/garde.log" | head -12; fi
  remettre_en_etat   # le garde ne doit rien laisser derrière lui sur les chemins suivis

  if [ "$nouveaux" = "0" ] && [ "${FORCER:-0}" != "1" ] && [ "$avance" = "0" ]; then dit "aucun article nouveau, rien à faire"; return 0; fi
  [ "$avance" = "0" ] || dit "$avance commit(s) local(aux) encore jamais poussé(s) : ils partiront avec ce relais, après build et tests"

  # ── 4. Portage, build, tests. La liste des tests est celle de scripts/relais-ci.sh, lue dans ce fichier. ───────
  if [ ! -d node_modules/sanitize-html ] || [ ! -d node_modules/playwright ] || [ ! -d node_modules/sharp ]; then
    dit "dépendances absentes : npm ci"
    npm ci --no-audit --no-fund > "$TMP/npm.log" 2>&1 || { dit "npm ci en échec"; tail -8 "$TMP/npm.log"; return 1; }
  fi
  if [ "$nouveaux" != "0" ] || [ "${FORCER:-0}" = "1" ]; then
    etape "porter" node blog/porter.mjs || return 1
    etape "fragments" node blog/fragments.mjs || return 1
  fi
  etape "build" node construire.mjs || return 1
  local tests t; tests=$(sed -n 's/^TESTS="\(.*\)"$/\1/p' scripts/relais-ci.sh)
  [ -n "$tests" ] || { dit "liste des tests introuvable dans scripts/relais-ci.sh (ligne TESTS=\"…\")"; remettre_en_etat; return 1; }
  for t in $tests; do etape "test $t" node "$t" || return 1; done
  dit "build et tests verts ($(echo $tests | wc -w | tr -d ' ') tests)"

  if [ "${SANS_DEPLOI:-0}" = "1" ]; then
    dit "SANS_DEPLOI=1 : essai terminé, ni commit ni push. Fichiers suivis que le portage aurait versionnés : $(git status --porcelain --untracked-files=no | wc -l | tr -d ' ')"
    remettre_en_etat; return 0
  fi

  # ── 5. Commit de tout ce que le portage modifie (mêmes chemins que l'étape « Versionner » de site.yml), puis push. ─
  local avant; avant=$(git rev-parse HEAD)
  # Un chemin de la liste qui n'existe pas dans ce dépôt ferait échouer git add : on ne garde que ceux qui existent.
  local chemins=() c
  for c in pages/blog blog commun/v6-routes.json commun/dates-pages.json pages/24-blog.html pages/24-blog-en.html; do [ -e "$c" ] && chemins+=("$c"); done
  if [ -n "$(git status --porcelain -- "${chemins[@]}")" ]; then
    git add -A -- "${chemins[@]}" && git commit -q -m "blog : relais quotidien, $nouveaux page(s) nouvelle(s) ($(date '+%d/%m/%Y'))" \
      || { dit "commit impossible"; git reset -q --hard "$avant"; return 1; }
    dit "commité $(git rev-parse --short HEAD)"
  else
    dit "le portage ne change rien à ce qui est versionné : pas de commit"
  fi
  if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    dit "ARRÊT : le relais a modifié des fichiers suivis hors de la liste versionnée, rien n'est poussé :"; git status --short --untracked-files=no | head -12
    git reset -q --hard "$avant"; return 1
  fi
  if [ "$(git rev-list --count "origin/$branche..HEAD")" = "0" ]; then dit "rien à pousser"; return 0; fi
  if ! git push -q origin "HEAD:refs/heads/$branche" > "$TMP/push.log" 2>&1; then
    dit "PUSH REFUSÉ vers origin/$branche. Rien n'est mis en ligne. Réponse de git :"; sed 's/^/    /' "$TMP/push.log" | head -12
    if [ "$(git rev-parse HEAD)" != "$avant" ]; then git reset -q --hard "$avant"; dit "commit du relais annulé (le portage sera refait au prochain passage, après mise à jour)"; fi
    return 6
  fi
  dit "poussé $(git rev-parse --short HEAD) sur origin/$branche : la mise en ligne est faite par GitHub Actions (tâche site)"
  return 0
}

dit() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }

# Remet les fichiers SUIVIS dans l'état du dernier commit. Appelé seulement après une mise à jour réussie, donc sur un
# arbre que le relais a trouvé propre : tout ce qui diffère vient de lui. Les fichiers non suivis ne sont pas touchés.
remettre_en_etat() { [ -z "$(git status --porcelain --untracked-files=no)" ] || git reset -q --hard HEAD; }

# etape <nom> <commande…> : lance, et en cas d'échec écrit la fin de la sortie, remet l'arbre en état, rend 1.
etape() {
  local nom="$1"; shift
  if "$@" > "$TMP/etape.log" 2>&1; then return 0; fi
  dit "ARRÊT : $nom en échec, rien n'est commité ni poussé :"; tail -8 "$TMP/etape.log" | sed 's/^/    /'
  remettre_en_etat; return 1
}

# Se met exactement à jour sur origin/<branche>. 0 = HEAD contient origin/<branche>. Sinon rien n'a bougé.
mettre_a_jour() {
  local branche amont retard avance
  branche=$(git symbolic-ref -q --short HEAD) || { dit "ARRÊT : HEAD détaché, le relais ne sait pas sur quelle branche se mettre à jour"; return 3; }
  if [ -d "$(git rev-parse --git-path rebase-merge)" ] || [ -d "$(git rev-parse --git-path rebase-apply)" ] || [ -f "$(git rev-parse --git-path MERGE_HEAD)" ]; then
    dit "ARRÊT : un rebase ou une fusion est en cours dans ce dépôt, à terminer à la main"; return 3
  fi
  if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
    dit "ARRÊT : l'arbre de travail n'est pas propre, le relais ne touche à rien. Fichiers suivis modifiés :"; git status --short --untracked-files=no | head -12
    return 3
  fi
  git fetch -q origin > "$TMP/fetch.log" 2>&1 || { dit "ARRÊT : git fetch origin impossible :"; sed 's/^/    /' "$TMP/fetch.log" | head -8; return 4; }
  amont="origin/$branche"
  git rev-parse -q --verify "refs/remotes/$amont" > /dev/null || { dit "ARRÊT : $amont n'existe pas"; return 4; }
  retard=$(git rev-list --count "HEAD..$amont"); avance=$(git rev-list --count "$amont..HEAD")
  if [ "$retard" = "0" ]; then
    dit "à jour sur $amont ($(git rev-parse --short "$amont"))"
  elif [ "$avance" = "0" ]; then
    git merge -q --ff-only "$amont" > "$TMP/maj.log" 2>&1 || { dit "ARRÊT : avance rapide sur $amont impossible :"; sed 's/^/    /' "$TMP/maj.log" | head -8; return 5; }
    dit "mis à jour : $retard commit(s) repris de $amont ($(git rev-parse --short HEAD))"
  else
    dit "$retard commit(s) de retard et $avance commit(s) local(aux) non poussé(s) : rebase sur $amont"
    if ! git rebase -q "$amont" > "$TMP/maj.log" 2>&1; then
      git rebase --abort > /dev/null 2>&1
      dit "ARRÊT : CONFLIT entre les commits locaux et $amont. Rebase abandonné, le dépôt est comme avant. Rien n'est construit, commité, poussé ni mis en ligne."
      sed 's/^/    /' "$TMP/maj.log" | head -8
      dit "à faire à la main : cd $(pwd) && git status, puis git rebase $amont (ou git reset --hard $amont si les commits locaux sont déjà sur origin)"
      return 5
    fi
    dit "rebase fait : $avance commit(s) local(aux) reposé(s) sur $amont"
  fi
  [ "$(git merge-base HEAD "$amont")" = "$(git rev-parse "$amont")" ] || { dit "ARRÊT : HEAD ne contient pas $amont après la mise à jour"; return 5; }
}

relais "$@"
exit $?
