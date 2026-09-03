import assert from 'node:assert/strict'
import * as audit from '../commun/audit-html.mjs'

assert.equal(typeof audit.htmlPourStructure, 'function', 'le vérificateur doit exposer un filtre de structure HTML')
assert.equal(typeof audit.imageCasseeChargee, 'function', 'le vérificateur doit distinguer image différée et image cassée')

const fixture = '<style>.x::after{content:"<a>"}</style><script>/* <a> */</script><a href="/">OK</a>'
const structure = audit.htmlPourStructure(fixture)
assert.equal((structure.match(/<a\b/g) || []).length, 1, 'les balises écrites dans CSS/JS ne comptent pas')
assert.equal((structure.match(/<\/a>/g) || []).length, 1, 'la structure visible reste intacte')

assert.equal(audit.imageCasseeChargee({ complete: false, naturalWidth: 0 }), false, 'une image lazy non chargée n’est pas cassée')
assert.equal(audit.imageCasseeChargee({ complete: true, naturalWidth: 0 }), true, 'une image chargée sans pixels est cassée')
assert.equal(audit.imageCasseeChargee({ complete: true, naturalWidth: 120 }), false, 'une image chargée avec pixels est valide')

console.log('Audit du vérificateur : structure visible et images différées distinguées.')
