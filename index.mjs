/* Page d'index des maquettes : vignettes réelles, source EdgeComply de chaque
   gabarit, et les points restés ouverts. */
import fs from 'fs'
import sharp from '/Users/naomiehalioua/cleo-landing/node_modules/sharp/lib/index.js'

const POLICE = fs.readFileSync('/Users/naomiehalioua/Downloads/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff2').toString('base64')
const base = fs.readFileSync('commun/base.css', 'utf8')
const v6Lanes = fs.readdirSync('commun/lanes')
  .filter(fichier => /^v6-.*\.css$/.test(fichier))
  .sort()
  .map(fichier => fs.readFileSync(`commun/lanes/${fichier}`, 'utf8'))
  .join('\n')

const PAGES = [
  { f:'01-accueil.html',       t:'Accueil',      g:'Accueil',    src:'edgecomply.com/', blocs:14,
    note:"La masse et l'unique en hero, photo à règles flottantes, comparatif, témoignage." },
  { f:'01-accueil-noir.html', t:'Accueil, régime noir', g:'Accueil', src:'morpho.org', blocs:14,
    note:"Même fragment que l'accueil, sous la surcouche de tokens du régime noir." },
  { f:'02-entreprise.html',    t:'Entreprise',   g:'Entreprise', src:'edgecomply.com/about-us', blocs:8,
    note:"Hero pleine largeur, grille de portraits, chiffres en escalier, photo à cartes." },
  { f:'03-offre.html',         t:'Regulatory Change', g:'Feature', src:'edgecomply.com/services/*', blocs:11,
    note:"Variante « l'objet porte son marquage » : 84 parutions, une seule vous concerne." },
  { f:'07-chat.html',          t:'Research',         g:'Feature',    src:'edgecomply.com/services/*', blocs:10,
    note:"Un échange rendu tel quel, avec l'extrait cité et ce qui manque pour trancher." },
  { f:'08-reglementation.html',t:'Compliance Data',   g:'Feature',    src:'edgecomply.com/services/*', blocs:10,
    note:"Une règle encodée montrée dans sa forme réelle : condition, entrées, preuve." },
  { f:'04-secteur.html',       t:'Secteur',      g:'Segment',    src:'edgecomply.com/industries/*', blocs:9,
    note:"Hero à formulaire, bascule de champ, trois blocs alternés, sceaux de textes." },
  { f:'05-marche.html',        t:'Marché',       g:'Segment',    src:'edgecomply.com/markets/*', blocs:9,
    note:"Même gabarit que Secteur, hero en mosaïque de trois images." },
  { f:'09-texte.html',         t:'Un texte',     g:'Segment',    src:'edgecomply.com/topics/*', blocs:9,
    note:"Le PPWR pris article par article, avec ses quatre familles d'obligations." },
  { f:'06-cas-client.html',    t:'Cas client',   g:'Preuve',     src:'edgecomply.com/customer-stories/*', blocs:6,
    note:"Bande citation, fiche latérale collante, récit en trois temps." },
  { f:'10-ressources.html',    t:'Ressources',   g:'Ressources', src:'edgecomply.com/library', blocs:5,
    note:"Le hub : colonne latérale collante, une section par famille de ressource." },
  { f:'11-blog.html',          t:'Publications', g:'Ressources', src:'edgecomply.com/library/blog', blocs:4,
    note:"Une à la une en pleine largeur, puis la grille." },
  { f:'12-article.html',       t:'Article',      g:'Ressources', src:'edgecomply.com/library/blog/*', blocs:6,
    note:"Sommaire collant, corps de texte mesuré, citations à l'article, bloc de sources." },
  { f:'23-research.html',    t:'Recherche',    g:'Ressources', src:'cleolabs.co/fr/research', blocs:9,
    note:"Les travaux de recherche, la chaîne en cinq étapes, le livre blanc." },
  { f:'24-blog.html',        t:'Blog',         g:'Ressources', src:'cleolabs.co/fr/blog', blocs:6,
    note:"La série quotidienne, les guides, l'article de la levée en tête." },
  { f:'25-skills.html',      t:'Skills',       g:'Ressources', src:'cleolabs.co/fr/skills', blocs:6,
    note:"Les compétences de conformité, prêtes à l'emploi." },
  { f:'26-legal-data.html',  t:'Legal Data',   g:'Ressources', src:'cleolabs.co/fr/legal-data', blocs:6,
    note:"Le corpus : réglementations, autorités, codes douaniers, marchés." },
  { f:'13-glossaire.html',     t:'Glossaire',    g:'Ressources', src:'edgecomply.com/library/glossary', blocs:4,
    note:"Filtres par famille, cartes de terme, chargement par lots." },
  { f:'14-terme.html',         t:'Un terme',     g:'Ressources', src:'edgecomply.com/library/glossary/*', blocs:5,
    note:"La définition, le texte qui l'emploie, les termes voisins en colonne." },
  { f:'15-evenements.html',    t:'Rencontres',   g:'Ressources', src:'edgecomply.com/library/events', blocs:5,
    note:"Un événement à venir en carte large, la liste, puis les rediffusions." },
  { f:'16-evenement.html',     t:'Une rencontre',g:'Ressources', src:'edgecomply.com/library/events/*', blocs:5,
    note:"Hero à formulaire d'inscription, programme horaire, intervenantes." },
  { f:'17-modeles.html',       t:'Modèles',      g:'Ressources', src:'edgecomply.com/library/assets', blocs:4,
    note:"Documents téléchargeables, chacun portant l'article dont il vient." },
  { f:'18-recrutement.html',   t:'Recrutement',  g:'Entreprise', src:'edgecomply.com/careers', blocs:5,
    note:"Hero en mosaïque, ce qui nous tient, liste des postes ouverts." },
  { f:'19-poste.html',         t:'Un poste',     g:'Entreprise', src:'edgecomply.com/jobs/*', blocs:4,
    note:"Fiche de poste longue en carte, encart latéral collant." },
  { f:'20-campagne.html',      t:'Campagne',     g:'Conversion', src:'edgecomply.com/landing/*', blocs:5,
    note:"Page nue, sans navigation : couverture du guide, logos, trois chiffres." },
  { f:'21-inscription.html',   t:'Inscription',  g:'Conversion', src:'edgecomply.com/waitlist', blocs:3,
    note:"Le formulaire, puis le même écran une fois envoyé." },
  { f:'22-legal.html',         t:'Légal',        g:'Conversion', src:'edgecomply.com/terms', blocs:3,
    note:"Sommaire collant, corps de texte réglementaire mesuré." },
]

const vignettes = {}
for (const p of PAGES) {
  const src = `captures/${p.f.replace('.html','')}-1.png`
  if (!fs.existsSync(src)) { console.log('vignette absente :', src); continue }
  const buf = await sharp(src).resize({ width: 640 }).extract({ left: 0, top: 0, width: 640, height: 460 })
    .webp({ quality: 74 }).toBuffer()
  vignettes[p.f] = 'data:image/webp;base64,' + buf.toString('base64')
}

const cartes = PAGES.map(p => `
    <a class="carte-maquette" href="${p.f}">
      <div class="vignette"><img src="${vignettes[p.f] || ''}" alt=""></div>
      <div class="corps">
        <div class="ligne-tete">
          <h3>${p.t}</h3>
          <span class="compte">${p.g} · ${p.blocs} blocs</span>
        </div>
        <p class="note">${p.note}</p>
        <div class="source">Composition relevée sur <span class="ref">${p.src}</span></div>
      </div>
    </a>`).join('')

const doc = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Maquettes Cleo V5 — champ profond</title>
<meta name="description" content="Porte d'entrée des maquettes de travail Cleo Labs : 24 gabarits en design system V5, champ profond, régime clair et régime noir.">
<meta name="robots" content="noindex,nofollow">
<style>
@font-face{font-family:"Satoshi";src:url(data:font/woff2;base64,${POLICE}) format("woff2");font-weight:300 900;font-display:swap}
${base}
${v6Lanes}
body{background:var(--c-surface);color:var(--c-text)}
code,kbd,samp,pre{font-family:var(--font);font-variant-numeric:tabular-nums}
.ref{font-variant-numeric:tabular-nums}
.entete{padding:88px 0 56px}
.grille{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;padding-bottom:72px}
.carte-maquette{display:block;min-width:0;background:var(--c-white);
  border:none;border-radius:var(--r-lg);overflow:hidden;box-shadow:none;
  transition:transform 240ms var(--ease-luxury)}
.carte-maquette:hover{transform:translateY(-2px);box-shadow:var(--shadow-md)}
.vignette{aspect-ratio:640/460;overflow:hidden;background:var(--c-card)}
.vignette img{width:100%;height:100%;object-fit:cover;object-position:top}
.corps{padding:24px 26px 26px}
.ligne-tete{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:10px}
.corps h3{font-size:1.375rem;font-weight:500;letter-spacing:-0.02em;color:var(--c-ink)}
.compte{font-size:0.6875rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:var(--c-text-3);white-space:nowrap}
.note{font-size:0.875rem;line-height:1.6;color:var(--c-text-2);margin:0 0 14px}
.source{font-size:0.75rem;color:var(--c-text-3)}
.source .ref{font-family:inherit;font-size:0.7rem;font-variant-numeric:tabular-nums;letter-spacing:0.01em;
  background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px}
.regle{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px;padding:40px 0 88px;border-top:1px solid var(--c-border)}
.regle h4{font-size:0.9375rem;font-weight:600;margin:0 0 14px;color:var(--c-ink)}
.regle ul{margin:0;padding-left:18px}
.regle li{font-size:0.875rem;line-height:1.7;color:var(--c-text-2);margin-bottom:7px}
.regle b{color:var(--c-text)}
@media (max-width:1024px){:root{--gouttiere:28px}}
@media (max-width:900px){.grille,.regle{grid-template-columns:minmax(0,1fr)}}
</style>
</head>
<body data-cleo-ds="v6" data-v6-family="preview" data-v6-page="index">
<div class="conteneur">
  <header class="entete">
    <div class="t-label" style="margin-bottom:18px">Maquettes de travail</div>
    <h1 class="t-hero" style="max-width:900px">Le site EdgeComply, <span class="attenue">en DS Cleo V5, champ profond.</span></h1>
    <p class="t-body" style="max-width:640px;margin-top:22px">
      Vingt-deux gabarits couvrant les 261 URL de leur site, plus un kit qui montre chaque composant seul. La composition, les proportions et le rythme viennent
      d'eux. Tout l'habillage vient du Design System Cleo V5, décliné sur le champ profond.
    </p>
  </header>

  <a href="00-composants.html" style="display:block;margin-bottom:24px;padding:26px 30px;
    border-radius:var(--r-lg);background:var(--card-bg);border:var(--card-border);
    box-shadow:var(--card-edge),var(--card-ring),var(--card-shadow)">
    <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap">
      <div style="flex:1;min-width:280px">
        <div class="t-label" style="margin-bottom:10px">Commencer ici</div>
        <div style="font-size:1.375rem;font-weight:600;letter-spacing:-0.02em;color:var(--c-ink);margin-bottom:8px">Le kit de composants</div>
        <div style="font-size:0.875rem;line-height:1.6;color:var(--c-text-2)">Chaque bloc isolé, avec son nom et les pages où il sert. Plus rapide à lire que les pages entières.</div>
      </div>
      <span style="color:var(--c-signal)"><svg width="20" height="20" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </div>
  </a>

  <div class="grille">${cartes}
  </div>

  <div class="regle">
    <div>
      <h4>Ce qui vient d'EdgeComply</h4>
      <ul>
        <li>L'ordre des sections de chaque gabarit</li>
        <li>Les proportions : conteneur 1340&nbsp;px, colonne texte 600&nbsp;px</li>
        <li>Le rythme typographique 58 / 48 / 36&nbsp;px, interlignes serrés</li>
        <li>Les gestes : titre en deux teintes, listes à puces cochées, sceaux de textes, tableau comparatif, fiche latérale collante</li>
        <li>Ce qui ne vient pas d'eux : leur fond sombre est un choix de marque, le nôtre est le champ profond du V5</li>
      </ul>
    </div>
    <div>
      <h4>Ce qui vient du Design System V5</h4>
      <ul>
        <li>Satoshi seule, aucune monospace, chiffres tabulaires</li>
        <li>Champ profond <b>#08093B</b>, strate interne <b>#12134F</b></li>
        <li>Signal <b>#4D57FF</b> sur ce fond, la valeur que le V5 emploie pour l'élément trouvé</li>
        <li>Statuts éclaircis à teinte constante : <b>#3FD08A</b> · <b>#E0A63C</b> · <b>#FF6B60</b>, tous ≥ 6,7:1</li>
        <li>Rayons 8 / 16 / 24 / pilule, espacement ×4, section à 128&nbsp;px</li>
        <li>Verre à trois couches et boutons à arête haute, recettes V5</li>
      </ul>
    </div>
  </div>
</div>
</body>
</html>`

// Controle d'equilibre : une balise laissee ouverte imbrique tout le
// reste du document sans qu'aucune erreur ne s'affiche. Vecu le 26/08.
let ko = 0
for (const b of ['div', 'a', 'p', 'span', 'code', 'ul', 'li', 'h1', 'h3', 'h4', 'header', 'nav']) {
  const o = (doc.match(new RegExp(`<${b}\\b`, 'g')) || []).length
  const f = (doc.match(new RegExp(`</${b}>`, 'g')) || []).length
  if (o !== f) { console.log(`  ECHEC index : <${b}> ${o} ouverts / ${f} fermes`); ko++ }
}
if (/font-family\s*:[^;'"]*monospace/i.test(doc)) { console.log('  ECHEC index : monospace'); ko++ }
if (ko) process.exit(1)

fs.writeFileSync('sortie/index.html', doc)
console.log(`sortie/index.html  ${Math.round(doc.length / 1024)} Ko`)
