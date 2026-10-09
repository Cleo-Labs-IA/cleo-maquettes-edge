/* 28/09/2026 : la politique de confidentialité n'avait pas été portée en V6 (/en/privacy et /fr/privacy en 404 sur
   www.cleolabs.co). Ce script la reprend MOT POUR MOT depuis cleo-landing, fichier src/app/[locale]/privacy/page.tsx
   tel qu'il est sur origin/main (celui que sert l'ancien site, « Last updated: 2026-09-14 »), et écrit les deux
   fragments pages/56-confidentialite.html (FR) et pages/56-confidentialite-en.html (EN). Aucun mot n'est écrit ici :
   seuls la mise en page et le sommaire (« Sur cette page », repris de 22-legal) viennent de la V6.
   Relancer : node scripts/porter-confidentialite.mjs [chemin du page.tsx] */
import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'
const ICI = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const SOURCE = 'src/app/[locale]/privacy/page.tsx'
const tsx = process.argv[2] ? fs.readFileSync(process.argv[2], 'utf8')
  : execFileSync('git', ['-C', '/Users/naomiehalioua/cleo-landing', 'show', `origin/main:${SOURCE}`], { encoding: 'utf8' })
const debut = tsx.indexOf('const LAST_UPDATED'), fin = tsx.indexOf('export default')
if (debut < 0 || fin < 0) throw new Error('page.tsx : structure inattendue')
const content = new Function(tsx.slice(debut, fin) + '\nreturn content')()
const ech = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const LIBELLES = { fr: { etiquette: 'Légal', sommaire: 'Sur cette page' }, en: { etiquette: 'Legal', sommaire: 'On this page' } }
for (const langue of ['fr', 'en']) {
  const c = content[langue], L = LIBELLES[langue]
  const ancre = i => `section-${i + 1}`
  const sections = c.sections.map((s, i) => [
    `        <h2 id="${ancre(i)}">${ech(s.title)}</h2>`,
    `        <p>${ech(s.content)}</p>`,
    s.list ? `        <ul>\n${s.list.map(x => `          <li>${ech(x)}</li>`).join('\n')}\n        </ul>` : '',
    s.after ? `        <p>${ech(s.after)}</p>` : '',
  ].filter(Boolean).join('\n')).join('\n\n')
  const html = `<!-- Politique de confidentialité, reprise mot pour mot de cleo-landing ${SOURCE} (origin/main) par
     scripts/porter-confidentialite.mjs. Ne pas retoucher le texte ici : le changer dans la source, puis relancer. -->
<!--NAV-->

<section class="sur-sombre section-serree">
  <div class="conteneur legal-tete">
    <div class="t-label" style="margin-bottom:18px">${L.etiquette}</div>
    <h1 class="t-titre-page">${ech(c.title)}</h1>
    <p class="t-caption" style="margin-top:16px">${ech(c.lastUpdated)}</p>
  </div>
</section>

<section class="section ra-corps-section">
  <div class="conteneur">
    <div class="corps-sommaire">
      <nav class="sommaire">
        <div class="titre">${L.sommaire}</div>
${c.sections.map((s, i) => `        <a href="#${ancre(i)}"${i === 0 ? ' class="actif"' : ''}>${ech(s.title)}</a>`).join('\n')}
      </nav>

      <div class="legal">
        <p>${ech(c.intro)}</p>

${sections}
      </div>
    </div>
  </div>
</section>

<!--PIED-->
`
  const cible = path.join(ICI, 'pages', langue === 'fr' ? '56-confidentialite.html' : '56-confidentialite-en.html')
  fs.writeFileSync(cible, html)
  console.log(`${path.relative(ICI, cible)} : ${c.sections.length} sections, ${c.lastUpdated}`)
}
