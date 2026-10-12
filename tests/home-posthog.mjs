import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cas = [
  {
    langue: 'FR',
    fichier: '43-accueil-avant-vendre.html',
    service: '37-compliance-service.html',
    data: '39-data.html',
    prestations: ['54-service-evaluation.html', '45-service-etiquetage.html', '55-service-marquage-ce.html', '51-service-mandataire.html'],
    cta: 'Voir les prestations et les prix',
    phraseSeo: 'Conformité produit automatisée pour les marques internationales',
  },
  {
    langue: 'EN',
    fichier: '43-accueil-avant-vendre-en.html',
    service: '37-compliance-service-en.html',
    data: '39-data-en.html',
    prestations: ['54-service-evaluation-en.html', '45-service-etiquetage-en.html', '55-service-marquage-ce-en.html', '51-service-mandataire-en.html'],
    cta: 'See the services and prices',
    phraseSeo: 'Automated product compliance for global brands',
  },
]

const occurrences = (texte, motif) => [...texte.matchAll(motif)].length
const texteVisible = html => html.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const message = (c, texte) => c.langue + ' : ' + texte

for (const c of cas) {
  const html = fs.readFileSync(path.join(racine, 'pages', c.fichier), 'utf8')
  const visibles = texteVisible(html)
  const hero = (html.match(/<section class="[^"]*hp-hero[^"]*">([\s\S]*?)<\/section>/) || [])[1] || ''
  const primaire = html.match(/<a\b[^>]*data-home-primary[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/)
  const secondaire = html.match(/<a\b[^>]*data-home-secondary[^>]*href="([^"]+)"[^>]*>/)
  const prestations = [...html.matchAll(/<article\b[^>]*data-home-service[^>]*>[\s\S]*?<a\b[^>]*class="[^"]*\bhp-bouton\b[^"]*"[^>]*href="([^"]+)"/g)]
    .map(correspondance => correspondance[1])

  assert.equal(occurrences(html, /<section class="[^"]*\bhp-bloc\b[^"]*"/g), 4, message(c, 'exactement quatre blocs'))
  assert.equal(occurrences(html, /<h1\b/g), 1, message(c, 'un seul h1'))
  assert.ok(visibles.toLowerCase().includes(c.phraseSeo.toLowerCase()), message(c, 'expression SEO visible'))
  assert.ok(primaire, message(c, 'CTA Service principal absent'))
  assert.equal(primaire?.[1], c.service, message(c, 'route du CTA Service'))
  assert.equal(texteVisible(primaire?.[2] || ''), c.cta, message(c, 'libellé du CTA Service'))
  assert.ok(secondaire, message(c, 'lien Data secondaire absent'))
  assert.equal(secondaire?.[1], c.data, message(c, 'route Data secondaire'))
  assert.ok((primaire?.index ?? Infinity) < (secondaire?.index ?? -1), message(c, 'Data doit suivre Services dans le DOM'))
  assert.ok(!hero.includes('meetings.hubspot.com'), message(c, 'aucun HubSpot dans le hero'))
  assert.equal(occurrences(html, /data-home-service/g), 4, message(c, 'quatre prestations directes'))
  assert.deepEqual(prestations, c.prestations, message(c, 'routes des quatre prestations'))
  assert.equal(occurrences(html, /class="[^"]*\bhp-etape\b/g), 3, message(c, 'trois étapes courtes'))
  assert.ok(html.includes('data-schema="howto"'), message(c, 'HowTo visible'))
  assert.equal(occurrences(html, /meetings\.hubspot\.com\/anaelle-guez\/rendez-vous/g), 1, message(c, 'un seul HubSpot dans le fragment, en fin de parcours'))

  for (const ancien of ['ac-aller', 'ac-manifeste-scene', 'ac-roue', 'ac-questions', 'data-schema="faq"']) {
    assert.ok(!html.includes(ancien), message(c, 'ancien bloc retiré (' + ancien + ')'))
  }
  assert.ok(!/\bEnterprise\b/.test(visibles), message(c, 'pas de troisième route Enterprise'))
}

console.log('Accueil PostHog : 4 blocs, Services prioritaire, Data secondaire et HubSpot en fin de parcours (FR/EN).')
