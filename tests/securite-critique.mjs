import assert from 'node:assert/strict'
import fs from 'node:fs'
import { spawnSync } from 'node:child_process'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
assert.equal(pkg.dependencies['sanitize-html'], '2.17.7')
assert.equal(pkg.dependencies.sharp, '0.35.5')
assert.equal(pkg.devDependencies.vercel, '59.16.0')

const workflow = fs.readFileSync('.github/workflows/site.yml', 'utf8')
assert.doesNotMatch(workflow, /(?:^|\s)(?:--token|-t)(?:\s|$)/m, 'le token Vercel ne doit jamais être un argument CLI')
assert.doesNotMatch(workflow, /npx\s+(?:--yes\s+)?vercel/i, 'le workflow utilise uniquement la version verrouillée')
assert.match(workflow, /\.\/node_modules\/\.bin\/vercel/)
assert.match(workflow, /scripts\/rediger-sortie\.mjs/)

const construction = fs.readFileSync('construire.mjs', 'utf8')
assert.match(construction, /Content-Security-Policy/)
assert.match(construction, /script-src-attr 'none'/)
assert.match(construction, /object-src 'none'/)
assert.match(construction, /frame-ancestors 'none'/)

const secret = 'secret-vercel-123456'
const redaction = spawnSync(process.execPath, ['scripts/rediger-sortie.mjs'], {
  input: `--token ${secret}\nAuthorization: Bearer ${secret}\n{"token":"${secret}"}\n`,
  encoding: 'utf8', env: { ...process.env, VERCEL_TOKEN: secret },
})
assert.equal(redaction.status, 0)
assert.doesNotMatch(redaction.stdout, new RegExp(secret))
assert.match(redaction.stdout, /SECRET REDACTED/)

console.log('Critiques sécurité validés : CSP, Vercel verrouillé, aucun token en argument ou log.')
