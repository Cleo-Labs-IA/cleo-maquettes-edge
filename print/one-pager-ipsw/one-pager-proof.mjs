// Rejoue CHAQUE affirmation chiffree du one-pager contre sa source, sans reseau.
// Usage : node one-pager-proof.mjs   (sortie : claim · attendu · trouve · PASS/FAIL)
// Log d'assertions : assertions.md — 8/8 verified against source.
//
// Le principe : rien n'est compare a une valeur tapee de memoire. Chaque valeur
// attendue est LUE dans un fichier source, puis cherchee dans le HTML produit.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ICI = path.dirname(fileURLToPath(import.meta.url))
const HOME = process.env.HOME
const MAQUETTES = path.resolve(ICI, '../..')

const SRC = {
  canon: path.join(MAQUETTES, 'depot-src/CANONICAL-FACTS.md'),
  regle: path.join(HOME, 'cleo-essais-etiquetage/cleo-rules/eu/eu-2023-988-art19-d-avertissements-offre.yaml'),
  citation: path.join(HOME, 'cleo-landing/src/components/landing/DecathlonQuote.tsx'),
  livrable: path.join(ICI, 'one-pager.html'),
}

const lire = (f) => fs.readFileSync(f, 'utf8')
const canon = lire(SRC.canon)
const regle = lire(SRC.regle)
const html = lire(SRC.livrable)

// Le texte visible seul : ni CSS, ni commentaires, ni donnees embarquees.
const texte = html
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ')

const resultats = []
const verifier = (claim, source, attenduPresentDansSource, rendu) => {
  const sourceOk = attenduPresentDansSource()
  const renduOk = rendu()
  resultats.push({
    claim, source,
    verdict: sourceOk && renduOk ? 'PASS' : 'FAIL',
    detail: sourceOk ? (renduOk ? '' : 'absent du livrable') : 'absent de la source',
  })
}

// ── 1 a 4 : les chiffres du canon marketing, et rien d'autre ─────────────────
verifier('106 countries covered', 'CANONICAL-FACTS.md',
  () => /\*\*106 pays\*\*/.test(canon),
  () => /106\s*countries covered/.test(texte))

verifier('25,000 regulations indexed', 'CANONICAL-FACTS.md',
  () => /\*\*25 000\*\*/.test(canon),
  () => /25,000\s*regulations indexed/.test(texte))

verifier('19,000 regulatory authorities', 'CANONICAL-FACTS.md',
  () => /\*\*19 000\*\*/.test(canon),
  () => /19,000\s*regulatory authorities followed/.test(texte))

verifier('founded 2023', 'CANONICAL-FACTS.md',
  () => /fondée 2023/.test(canon),
  () => /founded 2023/.test(texte))

// ── 5 a 7 : la regle encodee qui porte le marquage de la masse ──────────────
const instrument = regle.match(/instrument:\s*(.+)/)[1]
const article = regle.match(/\n\s*article:\s*"?([^"\n]+)"?/)[1].trim()
const point = regle.match(/\n\s*point:\s*"?([^"\n]+)"?/)[1].trim()
const applicable = regle.match(/applicable_from:\s*"?([\d-]+)"?/)[1]

verifier('Regulation (EU) 2023/988', 'cleo-rules yaml (instrument ' + instrument.slice(0, 34) + '…)',
  () => /2023\/988/.test(instrument) && /32023R0988/.test(regle),
  () => /Regulation \(EU\) 2023\/988/.test(texte))

verifier('Article 19(d)', `cleo-rules yaml (article ${article}, point ${point})`,
  () => article === '19' && point === 'd',
  () => new RegExp(`Article ${article}\\(${point}\\)`).test(texte))

const [an, mois, jour] = applicable.split('-')
const moisCourt = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+mois - 1]
verifier(`applies since ${applicable}`, 'cleo-rules yaml (applicable_from)',
  () => applicable === '2024-12-13',
  () => new RegExp(`${+jour} ${moisCourt} ${an}`).test(texte))

// ── 8 : la citation, verbatim caractere par caractere ───────────────────────
const citationSrc = lire(SRC.citation).match(/en:\s*'((?:[^'\\]|\\.)*)'/)[1]
  .replace(/\\'/g, "'").replace(/\\u2019/g, '’')
verifier(`Decathlon quote (${citationSrc.length} car., verbatim EN)`, 'DecathlonQuote.tsx',
  () => citationSrc.length > 400,
  () => texte.includes(citationSrc.replace(/\s+/g, ' ')))

// ── Controles d'absence : ce qui ne doit PAS partir a l'impression ──────────
const interdits = [
  ['clients hors autorisation print', /Longchamp|\bBIC\b|\bPMU\b|Kiabi|NVIDIA/i],
  ['metrique secondaire retiree (sources officielles)', /3[ ,]700/],
  ['comptes de regles encodees melanges au canon', /2[ ,]812|2[ ,]860/],
  ['tiret cadratin hors citation', /—/],
  ['police monospace', /font-family[^;{}]*(monospace|courier)/i],
]
const texteHorsCitation = texte.replace(citationSrc.replace(/\s+/g, ' '), ' ')
// le CSS sans ses commentaires : c'est une declaration de police qu'on traque,
// pas le mot « monospace » ecrit dans une note de style.
const css = (html.match(/<style[\s\S]*?<\/style>/i) || [''])[0].replace(/\/\*[\s\S]*?\*\//g, ' ')
for (const [quoi, motif] of interdits) {
  const cible = quoi === 'police monospace' ? css : texteHorsCitation
  resultats.push({
    claim: 'absent : ' + quoi, source: 'controle de non-regression',
    verdict: motif.test(cible) ? 'FAIL' : 'PASS',
    detail: motif.test(cible) ? 'trouve dans le livrable' : '',
  })
}

// ── Sortie ──────────────────────────────────────────────────────────────────
const large = Math.max(...resultats.map((r) => r.claim.length))
for (const r of resultats) {
  console.log(`${r.verdict === 'PASS' ? '✓' : '✗'} ${r.claim.padEnd(large)}  ${r.verdict}  ${r.source}${r.detail ? ' — ' + r.detail : ''}`)
}
const echecs = resultats.filter((r) => r.verdict === 'FAIL')
const chiffres = resultats.filter((r) => !r.claim.startsWith('absent :'))
console.log(`\n${chiffres.filter((r) => r.verdict === 'PASS').length}/${chiffres.length} verified against source · ${resultats.length - chiffres.length} controles d'absence · ${echecs.length} echec(s)`)
process.exit(echecs.length ? 1 : 0)
