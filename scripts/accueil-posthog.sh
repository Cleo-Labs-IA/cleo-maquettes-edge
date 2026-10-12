#!/bin/bash
# La variante « PostHog » de l'accueil (quatre blocs, Service d'abord), rangée dans pages/variantes/posthog.
# Ce script la construit à la place de l'accueil actif, puis passe ses propres tests.
# Il ne déploie rien. Pour revenir à l'accueil actif : node construire.mjs
set -euo pipefail
cd "$(dirname "$0")/.."
# Le build réécrit deux registres versionnés ; ils décrivent l'accueil actif, on les remet tels quels en sortant.
GARDE=$(mktemp -d)
cp commun/dates-pages.json commun/images-manifeste.json "$GARDE/"
trap 'cp "$GARDE/dates-pages.json" "$GARDE/images-manifeste.json" commun/' EXIT
VARIANTE=posthog node construire.mjs > /tmp/build-posthog.log 2>&1 || { tail -30 /tmp/build-posthog.log; exit 1; }
tail -3 /tmp/build-posthog.log
for t in tests/home-posthog.mjs tests/home-posthog-prices-proof.mjs tests/home-posthog-browser.mjs tests/seo-accueil-posthog.mjs; do
  node "$t" > /tmp/test-posthog.log 2>&1 || { echo "test en échec : $t"; tail -20 /tmp/test-posthog.log; exit 1; }
  echo "OK $t"
done
