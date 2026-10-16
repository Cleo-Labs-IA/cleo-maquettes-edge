/* LE RELAIS DU MAC NE PEUT PLUS ÉCRASER LA PRODUCTION AVEC DU CODE ANCIEN (01/10/2026).
   Sans réseau ni déploiement : des dépôts git temporaires, un « origin » local, et de faux node, curl, vercel et npm
   qui écrivent chacun de leurs appels dans un journal. Le vrai scripts/relais-blog.sh tourne en entier.
     A. clone en retard avec un commit local : il se met à jour, le commit local est rebasé, l'article part par push ;
     B. clone en conflit avec origin : sortie ≠ 0, rien n'est construit, poussé ni mis en ligne, dépôt intact ;
     C. arbre de travail modifié : arrêt, la modification est conservée ;
     D. push refusé par origin : sortie 6, écrit en clair, commit du relais annulé ;
     E. un second relais, après le premier, se met à jour et constate qu'il n'y a rien de nouveau ;
     F. un commit local jamais poussé, sans article nouveau : construit, testé, poussé ;
     G. origin apporte une nouvelle version du relais : il se relance une fois avec elle.
   TÉMOIN NÉGATIF : le script d'avant (tests/relais-blog-temoin-cfbc9e3.sh.txt, copie de
   `git show cfbc9e3:scripts/relais-blog.sh`) passe les mêmes scénarios A, B et D et doit y échouer. Il est en zsh :
   là où zsh manque (GitHub Actions), le témoin est sauté, et c'est écrit. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const DEPOT = path.dirname(path.dirname(new URL(import.meta.url).pathname))
const NOUVEAU = fs.readFileSync(path.join(DEPOT, 'scripts/relais-blog.sh'), 'utf8')
const TEMOIN_BRUT = fs.readFileSync(path.join(DEPOT, 'tests/relais-blog-temoin-cfbc9e3.sh.txt'), 'utf8')
// Le témoin fixe son PATH en dur (/opt/homebrew/bin en tête) : on retire cette seule ligne pour qu'il n'appelle que les faux outils.
const LIGNE_PATH = /^export PATH=.*\n/m
assert.match(TEMOIN_BRUT, LIGNE_PATH, 'le témoin doit contenir sa ligne export PATH')
const TEMOIN = TEMOIN_BRUT.replace(LIGNE_PATH, '')
assert.match(TEMOIN, /vercel deploy sortie --prod/, 'le témoin est bien le script qui déployait')
assert.doesNotMatch(NOUVEAU, /^[^#\n]*\bvercel\s+(?:deploy|promote|alias|--)/m, 'le relais du Mac ne contient plus aucune commande vercel')
const ou = nom => { const r = spawnSync('/bin/sh', ['-c', `command -v ${nom}`], { encoding: 'utf8' }); return r.status === 0 ? r.stdout.trim() : null }
const GIT = ou('git'); assert.ok(GIT, 'git introuvable')
const ZSH = fs.existsSync('/bin/zsh') ? '/bin/zsh' : ou('zsh')

const racine = fs.mkdtempSync(path.join(os.tmpdir(), 'cleo-relais-a-jour-'))
let numero = 0

function monde(variante, { dejaPorte = false } = {}) {
  const base = path.join(racine, `${++numero}-${variante}`)
  const bin = path.join(base, 'bin'), home = path.join(base, 'home'), blogsrc = path.join(base, 'blogsrc')
  for (const d of [bin, home, blogsrc, path.join(base, 'tmp')]) fs.mkdirSync(d, { recursive: true })
  const outil = (nom, corps) => { fs.writeFileSync(path.join(bin, nom), `#!/bin/bash\necho "${nom} $*" >> "$RELAIS_JOURNAL"\n${corps}\n`); fs.chmodSync(path.join(bin, nom), 0o755) }
  // node : `-e` va au vrai node (la liste des articles manquants est donc calculée pour de vrai) ; le porteur ajoute à
  // blog/brut.json les pages présentes dans $BLOGSRC et écrit leur fragment ; build et tests ne font que s'inscrire au journal.
  outil('node', `case "$1" in
  -e|-p) exec "$NODE_REEL" "$@" ;;
  blog/porter.mjs) exec "$NODE_REEL" -e '
    const fs = require("fs"); const b = JSON.parse(fs.readFileSync("blog/brut.json", "utf8"))
    for (const f of fs.readdirSync(process.env.BLOGSRC).sort()) { const m = f.match(/^(fr|en)-(.+)\\.html$/)
      if (m && !b.some(a => a.langue === m[1] && a.slug === m[2])) { b.push({ langue: m[1], slug: m[2] }); fs.writeFileSync("pages/blog/" + m[2] + (m[1] === "en" ? "-en" : "") + ".html", "<p>porté</p>") } }
    fs.writeFileSync("blog/brut.json", JSON.stringify(b))' ;;
esac
exit 0`)
  outil('curl', `sortie=""; while [ $# -gt 0 ]; do [ "$1" = "-o" ] && sortie="$2"; shift; done
[ -n "$sortie" ] && echo "<article>article du jour</article>" > "$sortie"; printf 200`)
  outil('vercel', 'echo "https://faux-deploiement.vercel.app"')
  outil('npm', 'exit 0')
  fs.symlinkSync(GIT, path.join(bin, 'git'))
  const journal = path.join(base, 'journal.txt')
  const env = {
    PATH: `${bin}:/usr/bin:/bin`, RELAIS_PATH: `${bin}:/usr/bin:/bin`, HOME: home, TMPDIR: path.join(base, 'tmp'), LANG: 'C.UTF-8',
    BLOGSRC: blogsrc, ANCIEN_SITE: 'https://alias.invalid', NODE_REEL: process.execPath, RELAIS_JOURNAL: journal,
    GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_TERMINAL_PROMPT: '0',
    GIT_AUTHOR_NAME: 'Test', GIT_AUTHOR_EMAIL: 'test@exemple.test', GIT_COMMITTER_NAME: 'Test', GIT_COMMITTER_EMAIL: 'test@exemple.test',
  }
  // Ceinture et bretelles : dans cet environnement, « vercel » ne peut être que le faux.
  assert.equal(spawnSync('/bin/sh', ['-c', 'command -v vercel'], { env, encoding: 'utf8' }).stdout.trim(), path.join(bin, 'vercel'))
  const git = (dossier, ...args) => {
    const r = spawnSync(GIT, args, { cwd: dossier, env, encoding: 'utf8' })
    if (r.status !== 0) throw new Error(`git ${args.join(' ')} (${dossier}) : ${r.stderr}`)
    return r.stdout.trim()
  }
  const ecrire = (dossier, fichier, contenu) => { fs.mkdirSync(path.dirname(path.join(dossier, fichier)), { recursive: true }); fs.writeFileSync(path.join(dossier, fichier), contenu) }
  const commit = (dossier, message, fichiers) => { for (const [f, c] of Object.entries(fichiers)) ecrire(dossier, f, c); git(dossier, 'add', '-A'); git(dossier, 'commit', '-q', '-m', message); return git(dossier, 'rev-parse', 'HEAD') }

  // Le dépôt du site : un origin nu, une graine, puis les clones.
  const origine = path.join(base, 'origine.git'); git(base, 'init', '-q', '--bare', '-b', 'site', origine)
  const graine = path.join(base, 'graine'); git(base, 'clone', '-q', origine, graine); git(graine, 'checkout', '-q', '-b', 'site')
  ecrire(graine, 'scripts/relais-blog.sh', variante === 'temoin' ? TEMOIN : NOUVEAU); fs.chmodSync(path.join(graine, 'scripts/relais-blog.sh'), 0o755)
  commit(graine, 'graine', {
    'scripts/relais-ci.sh': 'TESTS="tests/un.mjs tests/deux.mjs"\n', 'LISEZ.txt': 'ligne de départ\n',
    'blog/brut.json': JSON.stringify(dejaPorte ? [{ langue: 'fr', slug: 'article-du-jour' }, { langue: 'en', slug: 'article-du-jour' }] : []),
    'pages/blog/.gitkeep': '', 'pages/24-blog.html': 'fr\n', 'pages/24-blog-en.html': 'en\n', 'commun/v6-routes.json': '{}\n',
  })
  git(graine, 'push', '-q', 'origin', 'site')
  const cloner = nom => { const d = path.join(base, nom); git(base, 'clone', '-q', origine, d); return d }
  // cleo-landing : son origin/main porte blog-posts.json, avec l'article du jour.
  const landingOrigine = path.join(base, 'landing.git'); git(base, 'init', '-q', '--bare', '-b', 'main', landingOrigine)
  const landing = path.join(home, 'cleo-landing'); git(base, 'clone', '-q', landingOrigine, landing); git(landing, 'checkout', '-q', '-b', 'main')
  commit(landing, 'article du jour', { 'src/data/blog-posts.json': JSON.stringify([{ slug: 'article-du-jour' }]) }); git(landing, 'push', '-q', 'origin', 'main')

  const lancer = (depot, extra = {}) => {
    const j = extra.RELAIS_JOURNAL || journal
    fs.writeFileSync(j, '')
    const script = path.join(depot, 'scripts/relais-blog.sh')
    const r = variante === 'temoin'
      ? spawnSync(ZSH, [script, depot], { cwd: base, env: { ...env, ...extra }, encoding: 'utf8', timeout: 120_000 })
      : spawnSync(script, [depot], { cwd: base, env: { ...env, ...extra }, encoding: 'utf8', timeout: 120_000 })
    return { code: r.status, sortie: (r.stdout || '') + (r.stderr || ''), journal: fs.readFileSync(j, 'utf8').split('\n').filter(Boolean) }
  }
  const tete = dossier => git(dossier, 'rev-parse', 'HEAD')
  const teteOrigine = () => git(origine, 'rev-parse', 'refs/heads/site')
  const contient = (dossier, sha) => spawnSync(GIT, ['merge-base', '--is-ancestor', sha, 'HEAD'], { cwd: dossier, env }).status === 0
  const propre = dossier => git(dossier, 'status', '--porcelain', '--untracked-files=no') === ''
  return { base, origine, blogsrc, git, commit, ecrire, cloner, lancer, tete, teteOrigine, contient, propre }
}
const appels = (r, outil) => r.journal.filter(l => l.startsWith(outil + ' '))
const construit = r => r.journal.some(l => /^node (blog\/porter\.mjs|blog\/fragments\.mjs|construire\.mjs|tests\/)/.test(l))

/* Chaque scénario rend la liste [nom du contrôle, réussi ?]. Le nouveau script doit tout réussir, le témoin échouer. */
const SCENARIOS = {
  'A. clone en retard avec un commit local': variante => {
    const m = monde(variante); const mac = m.cloner('mac'); const autre = m.cloner('autre')
    const correctif = m.commit(autre, 'sécurité : correctif du 30/09', { 'securite.txt': 'CSP\n' }); m.git(autre, 'push', '-q', 'origin', 'site')
    m.commit(mac, 'local : commit jamais poussé', { 'local.txt': 'local\n' })
    const r = m.lancer(mac)
    const sujets = m.git(mac, 'log', '--format=%s').split('\n')
    return [r, [
      ['sortie 0', r.code === 0],
      ['le clone contient le correctif d\'origin avant de construire', m.contient(mac, correctif) && fs.existsSync(path.join(mac, 'securite.txt'))],
      ['le commit local est rebasé au-dessus du correctif', sujets.indexOf('local : commit jamais poussé') >= 0 && sujets.indexOf('local : commit jamais poussé') < sujets.indexOf('sécurité : correctif du 30/09')],
      ['l\'article est porté, commité et poussé : origin = le clone', m.teteOrigine() === m.tete(mac) && JSON.parse(m.git(m.origine, 'show', 'refs/heads/site:blog/brut.json')).length === 2
        && m.git(m.origine, 'ls-tree', '-r', '--name-only', 'refs/heads/site').split('\n').includes('pages/blog/article-du-jour-en.html')],
      ['les tests de scripts/relais-ci.sh sont lancés', appels(r, 'node').some(l => l === 'node tests/un.mjs') && appels(r, 'node').some(l => l === 'node tests/deux.mjs')],
      ['aucune mise en ligne depuis le Mac (vercel jamais appelé)', appels(r, 'vercel').length === 0],
      ['arbre propre à la fin', m.propre(mac)],
    ]]
  },
  'B. clone en conflit avec origin': variante => {
    const m = monde(variante); const mac = m.cloner('mac'); const autre = m.cloner('autre')
    m.commit(autre, 'origin : réécrit la ligne', { 'LISEZ.txt': 'ligne réécrite sur origin\n' }); m.git(autre, 'push', '-q', 'origin', 'site')
    const local = m.commit(mac, 'local : réécrit la même ligne', { 'LISEZ.txt': 'ligne réécrite sur le Mac\n' })
    const origineAvant = m.teteOrigine()
    const r = m.lancer(mac)
    return [r, [
      ['sortie différente de 0', r.code !== 0 && r.code !== null],
      ['le conflit est écrit en clair', /CONFLIT/.test(r.sortie)],
      ['rien n\'est téléchargé, porté, construit ni testé', !construit(r) && appels(r, 'curl').length === 0],
      ['aucune mise en ligne : ni vercel, ni push', appels(r, 'vercel').length === 0 && m.teteOrigine() === origineAvant],
      ['abandon propre : le clone est comme avant, sans rebase en cours', m.tete(mac) === local && m.propre(mac) && !fs.existsSync(path.join(mac, '.git/rebase-merge')) && !fs.existsSync(path.join(mac, '.git/rebase-apply'))],
    ]]
  },
  'C. arbre de travail modifié': variante => {
    const m = monde(variante); const mac = m.cloner('mac')
    m.ecrire(mac, 'LISEZ.txt', 'travail en cours, pas commité\n')
    const r = m.lancer(mac)
    return [r, [
      ['sortie 3', r.code === 3],
      ['rien n\'est construit ni mis en ligne', !construit(r) && appels(r, 'vercel').length === 0],
      ['la modification en cours est conservée', fs.readFileSync(path.join(mac, 'LISEZ.txt'), 'utf8') === 'travail en cours, pas commité\n'],
    ]]
  },
  'D. push refusé par origin': variante => {
    const m = monde(variante); const mac = m.cloner('mac')
    fs.writeFileSync(path.join(m.origine, 'hooks/pre-receive'), '#!/bin/sh\necho "refus de test" >&2\nexit 1\n'); fs.chmodSync(path.join(m.origine, 'hooks/pre-receive'), 0o755)
    const avant = m.tete(mac)
    const r = m.lancer(mac)
    return [r, [
      ['sortie 6', r.code === 6],
      ['le refus est écrit en clair, avec la réponse de git', /PUSH REFUSÉ/.test(r.sortie) && /refus de test/.test(r.sortie)],
      ['aucune mise en ligne (vercel jamais appelé)', appels(r, 'vercel').length === 0],
      ['le commit du relais est annulé, le clone reste propre et aligné sur origin', m.tete(mac) === avant && m.tete(mac) === m.teteOrigine() && m.propre(mac)],
    ]]
  },
  'E. le second relais ne trouve rien de nouveau': variante => {
    const m = monde(variante); const premier = m.cloner('ci'); const second = m.cloner('mac')
    const r1 = m.lancer(premier)                       // le premier relais porte et pousse l'article
    const apres = m.teteOrigine()
    const blogsrc2 = path.join(m.base, 'blogsrc-du-second'); fs.mkdirSync(blogsrc2)
    const r = m.lancer(second, { BLOGSRC: blogsrc2 })  // le second n'a jamais vu l'article, ni sa page
    return [r, [
      ['le premier relais a bien porté et poussé', r1.code === 0 && apres === m.tete(premier) && JSON.parse(m.git(m.origine, 'show', 'refs/heads/site:blog/brut.json')).length === 2],
      ['sortie 0', r.code === 0],
      ['il s\'est mis à jour sur le commit du premier', m.tete(second) === apres],
      ['il constate qu\'il n\'y a rien de nouveau', /aucun article nouveau/.test(r.sortie) && appels(r, 'curl').length === 0 && !construit(r)],
      ['origin n\'a pas bougé', m.teteOrigine() === apres],
    ]]
  },
  'F. commit local jamais poussé, sans article nouveau': variante => {
    const m = monde(variante, { dejaPorte: true }); const mac = m.cloner('mac')
    const local = m.commit(mac, 'local : commit jamais poussé', { 'local.txt': 'local\n' })
    const r = m.lancer(mac)
    return [r, [
      ['sortie 0', r.code === 0],
      ['build et tests passent avant le push', appels(r, 'node').includes('node construire.mjs') && appels(r, 'node').includes('node tests/deux.mjs') && !appels(r, 'node').includes('node blog/porter.mjs')],
      ['le commit local est poussé tel quel', m.teteOrigine() === local],
      ['aucune mise en ligne depuis le Mac', appels(r, 'vercel').length === 0],
    ]]
  },
  'G. le relais lui-même change avec la mise à jour': variante => {
    const m = monde(variante); const mac = m.cloner('mac'); const autre = m.cloner('autre')
    m.commit(autre, 'relais : nouvelle version', { 'scripts/relais-blog.sh': NOUVEAU.replace('relais du blog, dépôt', 'relais du blog (version suivante), dépôt') }); m.git(autre, 'push', '-q', 'origin', 'site')
    const r = m.lancer(mac)
    return [r, [
      ['sortie 0', r.code === 0],
      ['il se relance une fois avec la nouvelle version, qui fait le travail', (r.sortie.match(/relance avec la nouvelle version/g) || []).length === 1 && /version suivante/.test(r.sortie)],
      ['le script garde son bit exécutable', (fs.statSync(path.join(mac, 'scripts/relais-blog.sh')).mode & 0o111) !== 0],
      ['l\'article est poussé', m.teteOrigine() === m.tete(mac) && JSON.parse(m.git(m.origine, 'show', 'refs/heads/site:blog/brut.json')).length === 2],
    ]]
  },
}

try {
  for (const [nom, scenario] of Object.entries(SCENARIOS)) {
    const [r, controles] = scenario('nouveau')
    const rates = controles.filter(([, ok]) => !ok).map(([n]) => n)
    assert.deepEqual(rates, [], `${nom} : contrôles en échec avec le relais actuel\n--- sortie (code ${r.code})\n${r.sortie}\n--- journal\n${r.journal.join('\n')}`)
    console.log(`OK  ${nom} (${controles.length} contrôles)`)
  }
  if (!ZSH) {
    console.log('TÉMOIN SAUTÉ : zsh absent de cette machine, l\'ancien script (zsh) ne peut pas tourner ici. Il tourne sur le Mac.')
  } else {
    const attendus = {
      'A. clone en retard avec un commit local': ['le clone contient le correctif d\'origin avant de construire', 'aucune mise en ligne depuis le Mac (vercel jamais appelé)'],
      'B. clone en conflit avec origin': ['sortie différente de 0', 'aucune mise en ligne : ni vercel, ni push'],
      'D. push refusé par origin': ['sortie 6', 'aucune mise en ligne (vercel jamais appelé)'],
    }
    for (const [nom, doiventEchouer] of Object.entries(attendus)) {
      const [r, controles] = SCENARIOS[nom]('temoin')
      const rates = controles.filter(([, ok]) => !ok).map(([n]) => n)
      for (const controle of doiventEchouer) assert.ok(rates.includes(controle), `TÉMOIN ${nom} : l'ancien script aurait dû échouer sur « ${controle} »\n--- sortie (code ${r.code})\n${r.sortie}\n--- journal\n${r.journal.join('\n')}`)
      const deploie = r.journal.find(l => l.startsWith('vercel deploy sortie --prod'))
      assert.ok(deploie, `TÉMOIN ${nom} : l'ancien script devait atteindre vercel deploy --prod`)
      console.log(`OK  TÉMOIN ${nom} : l'ancien script échoue (${rates.length}/${controles.length} contrôles), il atteint « ${deploie.slice(0, 32)} »`)
    }
  }
} finally {
  fs.rmSync(racine, { recursive: true, force: true })
}
console.log('Relais du Mac : toujours à jour sur origin avant de construire, jamais de mise en ligne, conflit et push refusé arrêtent tout.')
