#!/usr/bin/env node
import { spawn } from 'node:child_process'

const [nomSecret, ...argumentsCurl] = process.argv.slice(2)
if (!/^[A-Z][A-Z0-9_]*(?:TOKEN|SECRET|KEY)$/.test(nomSecret || '') || argumentsCurl.length === 0) {
  console.error('usage : curl-auth.mjs NOM_DU_SECRET [arguments curl]')
  process.exit(64)
}
if (argumentsCurl.some(argument => ['-v', '--verbose', '--trace', '--trace-ascii', '--trace-config', '--libcurl'].includes(argument))) {
  console.error('curl-auth : option de trace interdite pour une requête authentifiée')
  process.exit(64)
}

const secret = process.env[nomSecret]
if (!secret) {
  console.error(`curl-auth : ${nomSecret} absent`)
  process.exit(64)
}
if (!/^[A-Za-z0-9._~+/=-]+$/.test(secret)) {
  console.error(`curl-auth : ${nomSecret} contient un caractère interdit`)
  process.exit(64)
}

const environnementCurl = { ...process.env }
delete environnementCurl[nomSecret]
delete process.env[nomSecret]

const curl = spawn('curl', ['--config', '-', ...argumentsCurl], {
  env: environnementCurl,
  stdio: ['pipe', 'inherit', 'inherit'],
})
curl.on('error', erreur => {
  console.error(`curl-auth : impossible de lancer curl (${erreur.code || 'erreur'})`)
  process.exitCode = 127
})
curl.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exitCode = code ?? 1
})
curl.stdin.on('error', erreur => {
  if (erreur.code !== 'EPIPE') throw erreur
})
curl.stdin.end(`header = "Authorization: Bearer ${secret}"\n`)
