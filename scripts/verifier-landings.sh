#!/bin/bash
# A lancer APRES CHAQUE deploiement de cleo-site-v6 (www.cleolabs.co).
# Verifie que les landings Google Ads peuvent charger Google Ads et le calendrier HubSpot,
# et que le reste du site garde sa CSP stricte. Sort en erreur (code 1) si quelque chose casse.
set -u
KO=0
LP_URLS="https://www.cleolabs.co/en/lp/product-compliance-assessment https://www.cleolabs.co/fr/lp/mandataire-ue https://www.cleolabs.co/es/lp/evaluacion-marcado-ce"
REQUIS="pagead2.googlesyndication.com www.googletagmanager.com www.googleadservices.com googleads.g.doubleclick.net meetings.hubspot.com js.hs-scripts.com clarity.ms"
for u in $LP_URLS; do
  csp=$(curl -s -D - -o /dev/null -H "Accept-Language: $(echo "${u#https://www.cleolabs.co/}" | cut -d/ -f1)" "$u" | tr -d '\r' | grep -i '^content-security-policy:' || true)
  if [ -z "$csp" ]; then echo "OK   $u (pas de CSP)"; continue; fi
  for h in $REQUIS; do
    echo "$csp" | grep -q "$h" || { echo "KO   $u : la CSP n'autorise pas $h"; KO=1; }
  done
  echo "$csp" | grep -q "frame-src[^;]*meetings.hubspot.com" || { echo "KO   $u : frame-src n'autorise pas meetings.hubspot.com (calendrier bloque)"; KO=1; }
  [ $KO -eq 0 ] && echo "OK   $u"
done
home=$(curl -s -D - -o /dev/null -L https://www.cleolabs.co/fr | tr -d '\r' | grep -i '^content-security-policy:' || true)
echo "$home" | grep -q "default-src 'self'" && echo "OK   reste du site : CSP stricte conservee" || echo "INFO reste du site : CSP stricte absente (a verifier si voulu)"
[ $KO -eq 0 ] && echo "=> TOUT EST BON" || { echo "=> NE PAS LAISSER EN PROD : corriger vercel.json (voir POUR-NAOMIE-CSP.md)"; exit 1; }
