#!/usr/bin/env node

let sortie = ''
for await (const morceau of process.stdin) sortie += morceau

for (const [nom, valeur] of Object.entries(process.env)) {
  if (!/(?:TOKEN|SECRET|PASSWORD|AUTH)$/i.test(nom) || typeof valeur !== 'string' || valeur.length < 8) continue
  sortie = sortie.split(valeur).join('[SECRET REDACTED]')
}

sortie = sortie
  .replace(/((?:--token|-t)\s+)(?:"[^"]*"|'[^']*'|\S+)/gi, '$1[SECRET REDACTED]')
  .replace(/(authorization\s*:\s*bearer\s+)\S+/gi, '$1[SECRET REDACTED]')
  .replace(/([?&](?:token|secret|password)=)[^\s&]+/gi, '$1[SECRET REDACTED]')
  .replace(/("(?:token|secret|password)"\s*:\s*")[^"]+("?)/gi, '$1[SECRET REDACTED]$2')

process.stdout.write(sortie)
