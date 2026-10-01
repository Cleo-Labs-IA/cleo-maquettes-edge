#!/usr/bin/env bash
# CONTRÔLE APRÈS MISE EN LIGNE (28/09/2026) : les adresses dont une panne coûte de l'argent ou du référencement.
# Usage : scripts/controle-en-ligne.sh [hôte] [chemins supplémentaires…]   (hôte par défaut https://www.cleolabs.co)
# Code 1 au premier chemin qui ne répond pas 200 (307 accepté pour les landings, redirection de langue) après 3 essais.
set -uo pipefail
HOTE="${1:-https://www.cleolabs.co}"; shift || true
CHEMINS=(/fr /en /fr/blog /en/blog /fr/privacy /en/privacy /api/regulations /sitemap.xml /robots.txt /llms.txt /og-image.jpg
  /fonts/Satoshi-Variable.woff2 /favicon.svg
  /en/lp/product-compliance-assessment /en/lp/product-compliance-assessment-electronics /en/lp/product-compliance-assessment-toys
  /en/lp/regulation-mapping /en/lp/choose-eu-authorized-representative /en/lp/eu-product-compliance "$@")
echecs=0
for c in "${CHEMINS[@]}"; do
  [ -z "$c" ] && continue
  for essai in 1 2 3; do
    code=$(curl -s -o /dev/null -w '%{http_code}' -H 'Cache-Control: no-cache' "$HOTE$c?controle=$(date +%s)")
    { [ "$code" = "200" ] || { [[ "$c" == */lp/* ]] && [ "$code" = "307" ]; }; } && break
    sleep 10
  done
  if [ "$code" = "200" ] || { [[ "$c" == */lp/* ]] && [ "$code" = "307" ]; }; then echo "$code $c"; else echo "ÉCHEC $code $c"; echecs=$((echecs+1)); fi
done
# 01/10/2026 : une landing peut répondre 200 et ne plus pouvoir charger Google Ads ni le calendrier (CSP globale).
if [ "$HOTE" = "https://www.cleolabs.co" ]; then bash "$(dirname "$0")/verifier-landings.sh" || echecs=$((echecs+1)); fi
[ "$echecs" = "0" ] && echo "contrôle en ligne : tout répond" || { echo "contrôle en ligne : $echecs adresse(s) en échec"; exit 1; }
