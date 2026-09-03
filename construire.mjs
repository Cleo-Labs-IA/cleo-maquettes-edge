/* ============================================================
   Assemble les maquettes autonomes.
   Un seul endroit modifie le CSS, la police et les images des 6 pages.
   Motif repris du repo cleo-landing : un extracteur genere, on n'edite
   jamais la sortie a la main.
   ============================================================ */
import fs from 'fs'
import path from 'path'
import sharp from '/Users/naomiehalioua/cleo-landing/node_modules/sharp/lib/index.js'

const ICI = '/Users/naomiehalioua/cleo-maquettes-edge'
const PUB = path.join('/Users/naomiehalioua/cleo-maquettes-edge', 'images/depot')
const CHEMINS = JSON.parse(fs.readFileSync(path.join(ICI, 'commun/chemins.json'), 'utf8'))
const LOCAL = path.join('/Users/naomiehalioua/cleo-maquettes-edge', 'images')
const POLICE = '/Users/naomiehalioua/Downloads/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff2'

const PAGES = [
  { fichier: '00-composants.html', titre: 'Kit',        source: 'kit de composants' },
  { fichier: '01-accueil.html',   titre: 'Accueil',     source: 'edgecomply.com/' },
  { fichier: '01-accueil.html',   titre: 'Accueil noir', source: 'edgecomply.com/', noir: true, sortie: '01-accueil-noir.html' },
  { fichier: '01-accueil-en.html', titre: 'Accueil EN', source: 'edgecomply.com/', en: true },
  { fichier: '02-entreprise.html', titre: 'Entreprise',  source: 'edgecomply.com/about-us' },
  { fichier: '03-offre.html',      titre: 'Offre',       source: 'edgecomply.com/services/product-compliance-audit' },
  { fichier: '04-secteur.html',    titre: 'Secteur',     source: 'edgecomply.com/industries/apparel-and-textiles' },
  { fichier: '05-marche.html',     titre: 'Marche',      source: 'edgecomply.com/markets/european-union-product-compliance' },
  { fichier: '06-cas-client.html', titre: 'Cas client',  source: 'edgecomply.com/customer-stories/avery-row' },
  { fichier: '07-chat.html',        titre: 'Research',    source: 'edgecomply.com/services/*' },
  { fichier: '08-reglementation.html', titre: 'Compliance', source: 'edgecomply.com/services/*' },
  { fichier: '09-texte.html',       titre: 'Un texte',    source: 'edgecomply.com/topics/reach-regulation-compliance' },
  { fichier: '10-ressources.html',  titre: 'Ressources',  source: 'edgecomply.com/library' },
  { fichier: '11-blog.html',        titre: 'Publications',source: 'edgecomply.com/library/blog' },
  { fichier: '12-article.html',     titre: 'Article',     source: 'edgecomply.com/library/blog/*' },
  { fichier: '13-glossaire.html',   titre: 'Glossaire',   source: 'edgecomply.com/library/glossary' },
  { fichier: '14-terme.html',       titre: 'Un terme',    source: 'edgecomply.com/library/glossary/*' },
  { fichier: '15-evenements.html',  titre: 'Rencontres',  source: 'edgecomply.com/library/events' },
  { fichier: '16-evenement.html',   titre: 'Une rencontre', source: 'edgecomply.com/library/events/*' },
  { fichier: '17-modeles.html',     titre: 'Modèles',     source: 'edgecomply.com/library/assets' },
  { fichier: '18-recrutement.html', titre: 'Recrutement', source: 'edgecomply.com/careers' },
  { fichier: '19-poste.html',       titre: 'Un poste',    source: 'edgecomply.com/jobs/*' },
  { fichier: '20-campagne.html',    titre: 'Campagne',    source: 'edgecomply.com/landing/ce-certification-guide' },
  { fichier: '21-inscription.html', titre: 'Inscription', source: 'edgecomply.com/waitlist' },
  { fichier: '22-legal.html',       titre: 'Légal',       source: 'edgecomply.com/terms' },
  { fichier: '23-research.html',    titre: 'Research',    source: 'cleolabs.co/fr/research' },
  { fichier: '24-blog.html',        titre: 'Blog',        source: 'cleolabs.co/fr/blog' },
  { fichier: '25-skills.html',      titre: 'Skills',      source: 'cleolabs.co/fr/skills' },
  { fichier: '26-legal-data.html',  titre: 'Legal Data',  source: 'cleolabs.co/fr/legal-data' },
  { fichier: '30-securite.html', titre: 'Sécurité', source: 'cleolabs.co/fr/security' },
  { fichier: '31-journal.html', titre: 'Journal', source: 'cleolabs.co/fr/changelog' },
  { fichier: '32-plan-action.html', titre: 'Plan action MARIA', source: 'cleolabs.co/fr/maria-action-plan' },
  { fichier: '33-fabricants.html', titre: 'Fabricants', source: 'cleolabs.co/fr/for/manufacturers' },
  { fichier: '34-importateurs.html', titre: 'Importateurs', source: 'cleolabs.co/fr/for/importers-distributors' },
  { fichier: '35-marketplaces.html', titre: 'Marketplaces', source: 'cleolabs.co/fr/for/marketplaces' },
  { fichier: '36-solutions.html', titre: 'Solutions', source: 'cleolabs.co/fr/solutions/product-compliance' },
  { fichier: '27-article-levee.html', titre: 'Article levee', source: 'cleolabs.co/fr/blog/cleo-labs-raises-1-5m-preseed' },
  { fichier: '27-article-levee-en.html', titre: 'Article levee EN', source: 'cleolabs.co/en/blog/cleo-labs-raises-1-5m-preseed', en: true },
  { fichier: '28-article-vivatech.html', titre: 'Article VivaTech', source: 'cleolabs.co/fr/blog/cleo-labs-vivatech-2026-scaleway-startup-challenge' },
  { fichier: '28-article-vivatech-en.html', titre: 'Article VivaTech EN', source: 'cleolabs.co/en/blog/cleo-labs-vivatech-2026-scaleway-startup-challenge', en: true },
  { fichier: '29-article-deel.html', titre: 'Article Deel', source: 'cleolabs.co/fr/blog/global-product-compliance-pitch-by-deel' },
  { fichier: '29-article-deel-en.html', titre: 'Article Deel EN', source: 'cleolabs.co/en/blog/global-product-compliance-pitch-by-deel', en: true },
  { fichier: '23-research-en.html',   titre: 'Research EN',   source: 'cleolabs.co/en/research', en: true },
  { fichier: '24-blog-en.html',       titre: 'Blog EN',       source: 'cleolabs.co/en/blog', en: true },
  { fichier: '25-skills-en.html',     titre: 'Skills EN',     source: 'cleolabs.co/en/skills', en: true },
  { fichier: '26-legal-data-en.html', titre: 'Legal Data EN', source: 'cleolabs.co/en/legal-data', en: true },
  // Vercel sert 404.html à la racine du dossier statique pour toute adresse inconnue.
  { fichier: '99-404.html', titre: '404', source: 'page introuvable', sortie: '404.html' },
]

/* Table des images : nom logique -> fichier source + largeur de rendu.
   Toute image citee dans un fragment DOIT figurer ici, sinon la
   construction echoue au lieu de laisser un trou silencieux. */
const IMAGES = {
  'cleo-logo':        ['cleo-logo.png', 200, 'png'],
  'humain-bureau':    ['human-desk.webp', 760],
  'humain-reunion':   ['human-meeting.webp', 760],
  'humain-presse':    ['human-clipboard.webp', 760],
  'humain-telephone': ['human-phone.webp', 700],
  'humain-detendu':   ['human-casual.webp', 700],
  'humain-passage':   ['human-crosswalk.webp', 760],
  'personne-detail':  ['person-detail.webp', 560],
  'personne-dirigeante': ['person-exec.webp', 560],
  'personne-equipe':  ['person-team.webp', 760],
  'chercheuse-1':     ['researcher-1.webp', 560],
  'chercheuse-2':     ['researcher-2.webp', 560],
  'equipe':           ['team.webp', 900],
  'station-f':        ['apropos-station-f.jpg', 1100],
  'paris':            ['cleo-paris.webp', 1000],
  'philippine':       ['philippine-tamic.jpg', 900],
  'anaelle':          ['author-anaelle.png', 200, 'png'],
  'naomie':           ['author-naomie.png', 200, 'png'],
  'alex':             ['author-alex.png', 200, 'png'],
  'darcial':          ['experts/darcial-mondjo.jpg', 200],
  'thezi':            ['experts/thezi-mabuza.jpg', 200],
  'veille-produit':   ['veille/produit-3b9ed4d5.png', 320, 'png'],
  // Les deux photographies de Naomie : la masse et l'unique, en vrai.
  'parc-voitures':    ['local/parc-voitures.jpg', 1100],
  'echangeur':        ['local/echangeur.jpg', 1100],
  'pneus':            ['local/pneus.jpg', 1100],
  /* La masse et l'unique, six variations. Images generees, ajoutees le 27/08 :
     aucun droit tiers, aucune marque reconnaissable, le bleu est le notre. */
  'classeurs':        ['local/classeurs.jpg', 1100],
  'cables':           ['local/cables.jpg', 1100],
  'chaines':          ['local/chaines.jpg', 1100],
  'flacons':          ['local/flacons.jpg', 1100],
  'vis':              ['local/vis.jpg', 1100],
  'semelles':         ['local/semelles.jpg', 1100],
  'briques':          ['local/briques.jpg', 1100],
  'fenetres':         ['local/fenetres.jpg', 1100],
  'produit-1':        ['product-1.webp', 520],
  'produit-2':        ['product-2.webp', 520],
  'produit-3':        ['product-3.webp', 520],
  'produit-4':        ['product-4.webp', 520],
  'sport':            ['sporting-goods-hero.webp', 900],
  'jean':             ['globe-produits/jean.png', 300, 'png'],
  'ours':             ['globe-produits/ours.png', 300, 'png'],
  'casque':           ['globe-produits/casque.png', 300, 'png'],
  'fauteuil':         ['globe-produits/fauteuil.png', 300, 'png'],
  'refrigerateur':    ['globe-produits/refrigerateur.png', 300, 'png'],
  'briquet':          ['globe-produits/briquet.png', 300, 'png'],
  /* Les sept produits du globe du hero, copiés dans le dépôt le 01/09 pour
     que la maquette porte ses propres fichiers. 240 px de large : la vignette
     se rend à 74 px de côté sur un hero de 520, soit 50 px d'image utile,
     100 px à deux pixels par point. Mesuré : 194 Ko de data URI pour les
     sept, contre 143 Ko à 200 px et 267 Ko à 300 px. */
  'globe-ours':          ['local/globe/ours.png', 240, 'png'],
  'globe-casque':        ['local/globe/casque.png', 240, 'png'],
  'globe-briquet':       ['local/globe/briquet.png', 240, 'png'],
  'globe-refrigerateur': ['local/globe/refrigerateur.png', 240, 'png'],
  'globe-voiture':       ['local/globe/voiture.png', 240, 'png'],
  'globe-fauteuil':      ['local/globe/fauteuil.png', 240, 'png'],
  'globe-jean':          ['local/globe/jean.png', 240, 'png'],
  'logo-decathlon':   ['logos/decathlon-2024.svg', 0, 'svg'],
  'logo-electrolux':  ['logos/electrolux-professional.avif', 260],
  'logo-balzac':      ['logos/balzac-paris.svg', 0, 'svg'],
  'logo-mercedes':    ['logos/mercedes-benz.svg', 0, 'svg'],
  'logo-sncf':        ['logos/sncf-reseau-color.png', 260, 'png'],
  'logo-loccitane':   ['logos/loccitane.svg', 0, 'svg'],
  'logo-nvidia':      ['local/nvidia.svg', 0, 'svg'],

  /* Serie « la masse et l'unique », §18 du DS V5 : une masse grise, un seul
     objet en bleu Cleo. Une famille de produits par image, ce qui permet de
     choisir la vignette sur le SUJET de l'article et non au hasard.
     34 familles, livrees par Naomie le 02/09/2026. Chaque image existe
     en deux tailles : la carte prend la large, la ligne de breve la fine. */
  'masse-ampoule':           ['local/serie/ampoule.jpg', 900],
  'masse-ampoule-carre':       ['local/serie/ampoule.jpg', 560],
  'masse-basket':            ['local/serie/basket.jpg', 900],
  'masse-basket-carre':        ['local/serie/basket.jpg', 560],
  'masse-biberon':           ['local/serie/biberon.jpg', 900],
  'masse-biberon-carre':       ['local/serie/biberon.jpg', 560],
  'masse-bougie':            ['local/serie/bougie.jpg', 900],
  'masse-bougie-carre':        ['local/serie/bougie.jpg', 560],
  'masse-brique-jouet':      ['local/serie/brique-jouet.jpg', 900],
  'masse-brique-jouet-carre':  ['local/serie/brique-jouet.jpg', 560],
  'masse-brosse-dents':      ['local/serie/brosse-dents.jpg', 900],
  'masse-brosse-dents-carre':  ['local/serie/brosse-dents.jpg', 560],
  'masse-canette':           ['local/serie/canette.jpg', 900],
  'masse-canette-carre':       ['local/serie/canette.jpg', 560],
  'masse-capsule':           ['local/serie/capsule.jpg', 900],
  'masse-capsule-carre':       ['local/serie/capsule.jpg', 560],
  'masse-casque':            ['local/serie/casque.jpg', 900],
  'masse-casque-carre':        ['local/serie/casque.jpg', 560],
  'masse-chargeur':          ['local/serie/chargeur.jpg', 900],
  'masse-chargeur-carre':      ['local/serie/chargeur.jpg', 560],
  'masse-chaussette':        ['local/serie/chaussette.jpg', 900],
  'masse-chaussette-carre':    ['local/serie/chaussette.jpg', 560],
  'masse-couche':            ['local/serie/couche.jpg', 900],
  'masse-couche-carre':        ['local/serie/couche.jpg', 560],
  'masse-couverts':          ['local/serie/couverts.jpg', 900],
  'masse-couverts-carre':      ['local/serie/couverts.jpg', 560],
  'masse-detergent':         ['local/serie/detergent.jpg', 900],
  'masse-detergent-carre':     ['local/serie/detergent.jpg', 560],
  'masse-ecouteurs':         ['local/serie/ecouteurs.jpg', 900],
  'masse-ecouteurs-carre':     ['local/serie/ecouteurs.jpg', 560],
  'masse-flacon':            ['local/serie/flacon.jpg', 900],
  'masse-flacon-carre':        ['local/serie/flacon.jpg', 560],
  'masse-gant':              ['local/serie/gant.jpg', 900],
  'masse-gant-carre':          ['local/serie/gant.jpg', 560],
  'masse-gourde':            ['local/serie/gourde.jpg', 900],
  'masse-gourde-carre':        ['local/serie/gourde.jpg', 560],
  'masse-lunettes':          ['local/serie/lunettes.jpg', 900],
  'masse-lunettes-carre':      ['local/serie/lunettes.jpg', 560],
  'masse-manette':           ['local/serie/manette.jpg', 900],
  'masse-manette-carre':       ['local/serie/manette.jpg', 560],
  'masse-montre':            ['local/serie/montre.jpg', 900],
  'masse-montre-carre':        ['local/serie/montre.jpg', 560],
  'masse-peluche':           ['local/serie/peluche.jpg', 900],
  'masse-peluche-carre':       ['local/serie/peluche.jpg', 560],
  'masse-pile':              ['local/serie/pile.jpg', 900],
  'masse-pile-carre':          ['local/serie/pile.jpg', 560],
  'masse-poele':             ['local/serie/poele.jpg', 900],
  'masse-poele-carre':         ['local/serie/poele.jpg', 560],
  'masse-rasoir':            ['local/serie/rasoir.jpg', 900],
  'masse-rasoir-carre':        ['local/serie/rasoir.jpg', 560],
  'masse-rouge-levres':      ['local/serie/rouge-levres.jpg', 900],
  'masse-rouge-levres-carre':  ['local/serie/rouge-levres.jpg', 560],
  'masse-savon':             ['local/serie/savon.jpg', 900],
  'masse-savon-carre':         ['local/serie/savon.jpg', 560],
  'masse-shampooing':        ['local/serie/shampooing.jpg', 900],
  'masse-shampooing-carre':    ['local/serie/shampooing.jpg', 560],
  'masse-skate':             ['local/serie/skate.jpg', 900],
  'masse-skate-carre':         ['local/serie/skate.jpg', 560],
  'masse-tasse':             ['local/serie/tasse.jpg', 900],
  'masse-tasse-carre':         ['local/serie/tasse.jpg', 560],
  'masse-telephone':         ['local/serie/telephone.jpg', 900],
  'masse-telephone-carre':     ['local/serie/telephone.jpg', 560],
  'masse-tshirt':            ['local/serie/tshirt.jpg', 900],
  'masse-tshirt-carre':        ['local/serie/tshirt.jpg', 560],
  'masse-velo':              ['local/serie/velo.jpg', 900],
  'masse-velo-carre':          ['local/serie/velo.jpg', 560],
  'masse-vernis':            ['local/serie/vernis.jpg', 900],
  'masse-vernis-carre':        ['local/serie/vernis.jpg', 560],
}

const cacheImg = new Map()
const DOSSIER_IMAGES = path.join(ICI, 'sortie', 'images')
fs.mkdirSync(DOSSIER_IMAGES, { recursive: true })
/* LES IMAGES SONT DES FICHIERS, plus des data URI. Mesuré le 03/09/2026 sur
   sortie-liart.vercel.app : 1,6 Mo de HTML pour l'accueil, 3,4 Mo pour le blog,
   et chaque page rechargeait ses images embarquées. En fichiers WebP le HTML
   retombe sous 300 Ko et le navigateur garde les images en cache d'une page à
   l'autre. Le chemin est absolu à la racine (/images/…) parce que les URL
   propres ont une profondeur variable (/fr, /fr/platform/research) : un chemin
   relatif se casserait. Les outils du chantier servent donc sortie/ en HTTP,
   voir commun/servir.mjs, et n'ouvrent plus les pages en file://. */
async function cheminImage(nom) {
  if (cacheImg.has(nom)) return cacheImg.get(nom)
  const entree = IMAGES[nom]
  if (!entree) throw new Error(`IMAGE INCONNUE : "${nom}" — ajoute-la dans la table IMAGES`)
  const [rel, largeur, format] = entree
  const abs = rel.startsWith('local/') ? path.join(LOCAL, rel.slice(6)) : path.join(PUB, rel)
  if (!fs.existsSync(abs)) throw new Error(`IMAGE ABSENTE : ${abs}`)
  const ext = format === 'svg' ? 'svg' : format === 'png' ? 'png' : 'webp'
  const dest = path.join(DOSSIER_IMAGES, `${nom}.${ext}`)
  if (format === 'svg') fs.copyFileSync(abs, dest)
  else if (format === 'png') await sharp(abs).resize({ width: largeur, withoutEnlargement: true }).png({ compressionLevel: 9, quality: 82 }).toFile(dest)
  else await sharp(abs).resize({ width: largeur, withoutEnlargement: true }).webp({ quality: 72 }).toFile(dest)
  const chemin = `/images/${nom}.${ext}`
  cacheImg.set(nom, chemin)
  return chemin
}
const dataUri = cheminImage

/* ── §18. La masse et l'unique.
   « Le contenu de la grille vient du réel : vraies références, vrais
   pictogrammes, vraies étiquettes. » Ces références sont celles que
   Cleo suit effectivement. L'unique est le PPWR, dont le texte est au
   dépôt et dont la date d'application est connue. */
const REFERENCES = [
  'CE 1907/2006','UE 2023/988','CE 1272/2008','UE 2016/425','UE 2023/1542','UE 2024/1689',
  'UE 2024/2462','UE 2011/1007','CE 765/2008','UE 2019/1020','UE 2017/745','CE 1223/2009',
  'UE 2023/1115','UE 2019/904','UE 2022/2065','CE 850/2004','UE 2020/740','UE 2024/1781',
  'EN 71-1','EN 71-2','EN 71-3','EN 14682','EN 16781','ASTM F963','16 CFR 1500','16 CFR 1501',
  '16 CFR 1610','CPSIA 101','CPSIA 103','Prop 65','TSCA 6','FHSA','FTC 16 CFR 303','CA AB 1817',
  'NY S5648','WA HB 2647','SOR/2016-193','SOR/2011-17','CCPSA','GB 31701','GB 18401','GB 5296.4',
  'JIS L 1091','K 610-1','AS/NZS 1957','NOM-004-SE','INMETRO 561','TR CU 007','TR CU 017',
  'SASO 2203','UAE.S GSO 1956','IS 15625','TIS 2231','SNI 7617','PNS 1957','VCM 3-2019',
  'UE 2025/40','UE 2018/851','UE 94/62','CE 1935/2004','UE 10/2011','UE 2022/1616',
  'CE 178/2002','UE 1169/2011','UE 2023/2006','CE 396/2005','UE 2015/2283','CE 1333/2008',
  'UE 528/2012','CE 1107/2009','UE 2019/1021','CE 649/2012','UE 517/2014','CE 1005/2009',
  'UE 2023/1542','UE 2012/19','UE 2011/65','UE 2014/53','UE 2014/35','UE 2014/30',
  'UE 2006/42','UE 2023/1230','UE 305/2011','UE 2016/426','UE 2016/424','UE 2013/29',
]
function masse() {
  // La masse : 220 documents sur 20 colonnes. Le V5 en montre une grille
  // dense ; à 14 colonnes sur ce conteneur les pictogrammes faisaient
  // 100 px de haut et l'image ne disait plus « beaucoup ».
  const doc = '<svg viewBox="0 0 24 30" aria-hidden="true"><path d="M2.5 2.5A2.5 2.5 0 0 1 5 0h10.2L22 6.8V27.5A2.5 2.5 0 0 1 19.5 30h-15A2.5 2.5 0 0 1 2 27.5V2.5z" fill="currentColor"/></svg>'
  const TOTAL = 220, UNIQUE = 137   // l'unique au deux tiers, évident, jamais dissimulé
  const items = []
  for (let i = 0; i < TOTAL; i++) {
    if (i === UNIQUE) { items.push(`<div class="mass-item found">${doc}</div>`); continue }
    const alt = (i * 7 + (i % 5)) % 3 === 0
    const op = 0.80 + ((i * 13) % 7) * 0.03
    items.push(`<div class="mass-item${alt ? ' alt' : ''}" style="opacity:${op.toFixed(2)}">${doc}</div>`)
  }
  return `<div class="mass mass-20">${items.join('')}</div>`
}

function masseRefs() {
  const cases = REFERENCES.filter(r => r !== 'UE 2025/40').map((r, i) =>
    `<div class="mass-ref${(i % 3 === 0) ? ' alt' : ''}">${r}</div>`)
  cases.splice(32, 0, '<div class="mass-ref found">UE 2025/40<span class="mass-mark">art. 12 · 12.08.26</span></div>')
  return `<div class="mass-refs">${cases.join('')}</div>`
}

async function injecterImages(html) {
  const noms = [...new Set([...html.matchAll(/img:([a-z0-9-]+)/g)].map(m => m[1]))]
  for (const n of noms) {
    const uri = await dataUri(n)
    html = html.replaceAll(`img:${n}`, uri)
  }
  return html
}

/* ── Le composant de veille, PORTÉ EN BLOC depuis cleo-landing.
   Mémoire : une animation riche se porte en bloc, elle ne se retranscrit
   jamais. On reprend sa feuille, son markup et son IIFE tels quels ;
   seule la monospace est neutralisée, le DS V5 l'interdit. ── */
const REF = '/Users/naomiehalioua/cleo-maquettes-edge/depot-src/ref'
function litExport(fichier, nom) {
  const t = fs.readFileSync(`${REF}/${fichier}`, 'utf8')
  const i = t.indexOf('`', t.indexOf(`export const ${nom}`))
  const j = t.lastIndexOf('`')
  return t.slice(i + 1, j)
}
let veilleCss = '', veilleMarkup = '', veilleScript = ''
try {
  veilleCss = litExport('veilleCss.ts', 'VEILLE_CSS').replace(/var\(--cv-mono\)/g, "var(--font)")
  veilleMarkup = litExport('veilleMarkup.ts', 'VEILLE_MARKUP')
  // Le script n'est pas un template literal mais « export function monterVeille() ».
  // On retire le mot-clef export et on appelle la fonction, comme le fait React.
  const brut = fs.readFileSync(`${REF}/veilleScript.ts`, 'utf8')
  veilleScript = brut.slice(brut.indexOf('export function monterVeille'))
    .replace('export function monterVeille', 'function monterVeille')
  veilleScript += '\n;(function(){ function lancer(){ try { monterVeille() } catch(e) {} }\n'
    + 'if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", lancer); else lancer(); })();'
} catch (e) { console.log('  (composant veille indisponible : ' + e.message + ')') }

async function veille() {
  if (!veilleCss) return '<div class="t-caption">composant de veille indisponible</div>'
  let m = veilleMarkup
  const img = await dataUri('veille-produit')
  m = m.replace('/veille/produit-3b9ed4d5.png', img)
  // Le lien du Journal officiel pointe sur le texte réel (PPWR, CELEX 32025R0040) et plus sur « # ».
  m = m.replace('id="cv-f-lien" href="#"', 'id="cv-f-lien" href="https://eur-lex.europa.eu/eli/reg/2025/40/oj"')
  // Le gabarit porte des commentaires de chantier (« à remplacer ») : aucun ne sort.
  m = m.replace(/<!--[\s\S]*?-->/g, '')
  return `<style>${veilleCss}
.cv,.cv *{font-family:var(--font) !important}
/* Plancher typographique du composant sur téléphone (lane B, 03/09 : 8 à 11 px relevés) */
.cv-lien{display:inline-flex; align-items:center; min-height:44px}
.cv-det u,.cv-ech,.cv-k,.cv-lbl,.cv-c span,.cv-lien,.cv-v,.cv-etat span,.cv__count,.cv-s{font-size:11px !important}
@media (max-width:640px){ .cv-det u,.cv-ech,.cv-k,.cv-lbl,.cv-c span,.cv-lien,.cv-v,.cv-etat span,.cv__count,.cv-s{font-size:12px !important} }</style>
<div class="ecran-app">${m}</div>
<script>${veilleScript}</script>`
}

/* ══════════════════════════════════════════════════════════════════
   LE GLOBE AUX PRODUITS, PORTÉ EN BLOC depuis cleo-landing.

   Même règle que le composant de veille juste au-dessus : une animation
   riche se porte en bloc, elle ne se retranscrit jamais. Ce qui est repris
   MOT POUR MOT de la source, en six coupes :

     1. le moteur de la sphère — bruit déterministe, champ de points,
        icosaèdre subdivisé, la passe de dessin entière (11,5 Ko) ;
     2. la construction de sa configuration, props comprises ;
     3. ses écouteurs — attraper, tourner, la parallaxe au survol ;
     4. sa mise à la taille du canvas ;
     5. sa passe unique, celle que Framer sert au rendu statique ;
     6. sa boucle animée, gardée par un IntersectionObserver.

   Et de GlobeProduits.tsx : les sept produits avec leur ville et leurs
   coordonnées, les constantes de période et de disque, la perspective, le
   corps de boucle des orbites, et jusqu'aux réglages passés au globe
   (vitesse, densité, les sept couleurs) — retouchez-les dans cleo-landing,
   la maquette suit.

   CE QUI EST RÉÉCRIT, ET RIEN D'AUTRE : la monture. Les refs, les effets
   et le retour JSX d'un composant React n'ont pas d'équivalent hors React.
   La monture crée les deux éléments, puis appelle les six morceaux dans
   l'ordre même du composant.

   Une coupe dont la couture a bougé ÉCHOUE la construction, comme une image
   absente de la table IMAGES : jamais de trou silencieux.
   ══════════════════════════════════════════════════════════════════ */
const HERO = '/Users/naomiehalioua/cleo-maquettes-edge/depot-src/hero'

function coupe(texte, debut, fin, quoi, gardeFin) {
  const i = texte.indexOf(debut)
  if (i < 0) throw new Error(`COUTURE ABSENTE (${quoi}) : « ${debut.slice(0, 46)} »`)
  const j = texte.indexOf(fin, i + debut.length)
  if (j < 0) throw new Error(`COUTURE ABSENTE (${quoi}) : « ${fin.slice(0, 46)} »`)
  return texte.slice(i, gardeFin ? j + fin.length : j)
}

let globeScript = '', globeListe = null
try {
  const M = fs.readFileSync(`${HERO}/RotatingParticleGlobe.ts`, 'utf8')
  const P = fs.readFileSync(`${HERO}/GlobeProduits.tsx`, 'utf8')

  const moteur      = coupe(M, 'const DUR=12;', 'export default function ParticleGlobe', 'moteur')
  /* Deux mots seulement changent dans la config : useRef n'existe pas ici,
     et le « rendu statique » de Framer devient notre mouvement réduit. */
  const config      = coupe(M, 'const{style,motion={}', 'accent:!!m.accent}))};', 'config', true)
                        .replace(/useRef\(/g, 'reference(')
                        .replace('useIsStaticRenderer()', 'props.fige')
  const ecoutes     = coupe(M, 'const DPRof=()=>Math.min', 'canvas.addEventListener("pointercancel",endDrag);', 'écoutes', true)
  const aLaTaille   = coupe(M, 'const syncSize=()=>{', 'return DPR;};', 'mise à la taille', true)
  const passeUnique = coupe(M, 'if(isStatic){let raf=0;const paint=', 'ro.disconnect();};}', 'passe unique', true)
  const boucleGlobe = coupe(M, 'let raf=0;let running=false;let last=null;', 'start()// no IO support: fall back to always-on', 'boucle du globe', true) + '\n;}'

  const constantes  = coupe(P, '/** Un tour, en secondes.', 'export type Produit = {', 'constantes')
  const produits    = coupe(P, 'export const PRODUITS: Produit[] = [', '\n];', 'produits', true)
                        .replace('export const PRODUITS: Produit[] = [', 'const PRODUITS = [')
  const perspective = coupe(P, '/** Le rapprochement de perspective du composant. */', 'function Vignette(', 'perspective')
                        .replace(/:\s*number/g, '')
  const orbite      = coupe(P, 'const temps = (t - t0) / 1000;', '      raf = requestAnimationFrame(boucle);', 'orbites')
  /* Les réglages sont écrits en attributs JSX dans la source : name={{…}}
     devient name: {…}. Les valeurs, elles, ne sont pas touchées. */
  const reglages    = '{' + coupe(P, '          motion={{', '\n        />', 'réglages')
                        .replace(/(\w+)=\{\{([\s\S]*?)\}\}/g, '$1: {$2},') + '}'

  globeListe = new Function('return ' + produits.replace('const PRODUITS = ', '').replace(/;\s*$/, ''))()

  globeScript = `(function(){
${moteur}
${constantes}
${produits}
${perspective}

/* ── LA MONTURE. ──
   Le composant d'origine est un composant React : ses refs, ses effets et
   son retour JSX n'ont pas d'equivalent hors React. C'est la SEULE piece
   reecrite, et elle ne fait rien de plus que creer les deux elements puis
   appeler, dans l'ordre meme du composant, les morceaux repris tels quels :
   la config, les ecouteurs, la mise a la taille, la passe unique, la boucle. */
function monterSphere(hote, props){
  var reference = function(v){ return { current: v } };
${config}
  var wrap = document.createElement('div');
  var canvas = document.createElement('canvas');
  wrapRef.current = wrap; canvasRef.current = canvas;
  Object.assign(wrap.style, {position:"relative",overflow:"hidden",background:bgEdge,borderRadius:cornerRadius,width:"100%",height:"100%",minWidth:"120px",minHeight:"120px"});
  Object.assign(canvas.style, {width:"100%",height:"100%",display:"block",cursor:enableDrag?"grab":"default"});
  wrap.appendChild(canvas); hote.appendChild(wrap);
${ecoutes}
  var ctx = canvas.getContext("2d"); if (!ctx) return;
${aLaTaille}
${passeUnique}
${boucleGlobe}
}

/* ── LES PRODUITS EN ORBITE. ──
   Le corps de boucle est celui du composant, mot pour mot. Autour, ce qui
   etait des refs React devient des elements deja dans la page, et la prop
   « taille », qui valait 620 en dur, devient la mesure de la scene : elle
   vit ici dans un hero dont la hauteur est en clamp(). */
function monterGlobeProduits(hote){
  var mvtReduit = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var scene  = hote.querySelector('[data-gp]');
  var disque = hote.querySelector('[data-gp-disque]');
  var toile  = hote.querySelector('[data-gp-toile]');
  var svg    = hote.querySelector('[data-gp-traits]');
  if (!scene || !disque || !toile || !svg) return;

  var produits  = PRODUITS;
  var vignettes = { current: [].slice.call(hote.querySelectorAll('[data-gp-vignette]')) };
  var points    = { current: [].slice.call(hote.querySelectorAll('[data-gp-ville]')) };
  var traits    = { current: [].slice.call(svg.querySelectorAll('line')) };
  var etat      = { current: null };

  /* La scene est mesuree pour que L'ORBITE tienne dans la boite, pas la
     sphere : le bord exterieur d'une vignette porte a 0,47 + 0,155/2 du
     cote, et le hero coupe ce qui deborde. Le composant d'origine n'avait
     pas ce souci : il posait 620 px en dur dans une page libre. */
  var ORBITE = 0.47 + 0.155 / 2;
  var taille = 0, rayonOrbite = 0, c = 0;
  function poser(){
    var t = Math.min(hote.clientWidth, hote.clientHeight) / (ORBITE * 2);
    if (!t) return;
    taille = t; rayonOrbite = taille * 0.47; c = taille / 2;
    var cote = Math.round(taille * 0.155);
    scene.style.width = scene.style.height = taille + 'px';
    disque.style.width = disque.style.height = (taille * DISQUE) + 'px';
    disque.style.marginLeft = disque.style.marginTop = (-taille * DISQUE / 2) + 'px';
    toile.style.width = toile.style.height = taille + 'px';
    toile.style.marginLeft = toile.style.marginTop = (-taille / 2) + 'px';
    svg.setAttribute('viewBox', '0 0 ' + taille + ' ' + taille);
    for (var i = 0; i < vignettes.current.length; i++) {
      var v = vignettes.current[i];
      v.style.width = v.style.height = cote + 'px';
      v.style.marginLeft = v.style.marginTop = (-cote / 2) + 'px';
    }
  }

  var t0 = performance.now();
  var raf = 0;
  function boucle(t){
    if (!taille) { poser(); if (!taille) { raf = requestAnimationFrame(boucle); return; } }
${orbite}
    if (!mvtReduit) raf = requestAnimationFrame(boucle);
  }

  poser();
  var reglages = ${reglages};
  reglages.etatRef = etat;
  reglages.fige = mvtReduit;
  monterSphere(toile, reglages);
  /* Une passe tout de suite, avant la premiere peinture : sans elle on
     verrait les sept cartes empilees au centre le temps d'une image. */
  boucle(t0);

  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(poser).observe(hote);
  else window.addEventListener('resize', poser);
}

function lancer(){
  var hotes = document.querySelectorAll('[data-gp-hote]');
  for (var i = 0; i < hotes.length; i++) monterGlobeProduits(hotes[i]);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lancer);
else lancer();
})();`
} catch (e) { console.log('  (globe aux produits indisponible : ' + e.message + ')') }

/* La feuille : les valeurs sont celles des styles en ligne du composant
   React, transposées une à une. Rien n'y est inventé. */
const GLOBE_CSS = `
.gp{position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); font-family:var(--font)}
.gp-disque{position:absolute; top:50%; left:50%; border-radius:50%; overflow:hidden; z-index:1; cursor:grab}
.gp-toile{position:absolute; top:50%; left:50%}
.gp-traits{position:absolute; inset:0; width:100%; height:100%; z-index:2; pointer-events:none}
.gp-trait{stroke:#FFFFFF; stroke-width:1.2; stroke-dasharray:3 3}
.gp-ville{position:absolute; top:50%; left:50%; display:flex; align-items:center; gap:6px;
  white-space:nowrap; transform-origin:left center; pointer-events:none}
.gp-point{width:7px; height:7px; border-radius:999px; background:#FFFFFF;
  box-shadow:0 0 0 3px rgba(255,255,255,0.30); flex:0 0 auto}
.gp-nom{font-size:13px; font-weight:500; color:#FFFFFF; letter-spacing:-0.01em;
  text-shadow:0 1px 3px rgba(0,4,58,0.85), 0 0 10px rgba(0,4,58,0.65)}
.gp-vignette{position:absolute; top:50%; left:50%; will-change:transform, opacity}
.gp-carte{width:100%; height:100%; border-radius:20px; background:#FFFFFF;
  border:1px solid rgba(0,0,0,0.07); box-shadow:0 14px 34px rgba(10,16,48,0.14);
  display:flex; align-items:center; justify-content:center; padding:12px; overflow:hidden}
.gp-carte img{max-width:100%; max-height:100%; object-fit:contain}
/* Le voile du hero fondait le globe abstrait dans la page dès 52 % du rayon.
   L'orbite des produits passe à 94 % : elle disparaissait dessous. Le nouveau
   globe se découpe lui-même sur un disque, il n'a plus besoin d'être fondu ;
   le voile recule au-delà de l'orbite et ne garde plus que les coins. */
.hero-globe::after{background:radial-gradient(circle at center, transparent 0 85%, var(--c-field-deep) 100%)}
`

/* Le markup : sept fois trois objets, dans l'ordre du composant — les
   traits, puis les villes, puis les produits. Les noms de produits et de
   villes sont des NOMS : ils ne se traduisent pas, la page anglaise sert
   exactement les mêmes. */
async function globeProduits() {
  if (!globeScript || !globeListe) return '<div class="hero-globe"><div class="t-caption">globe aux produits indisponible</div></div>'
  const traits = globeListe.map(() => '<line class="gp-trait" opacity="0"></line>').join('')
  const villes = globeListe.map(p =>
    `<div class="gp-ville" data-gp-ville><span class="gp-point"></span><span class="gp-nom">${ech(p.ville)}</span></div>`).join('\n    ')
  const cartes = []
  for (const p of globeListe) {
    const uri = await dataUri('globe-' + p.fichier.replace('.png', ''))
    cartes.push(`<div class="gp-vignette" data-gp-vignette title="${ech(p.nom)} · ${ech(p.ville)} · ${ech(p.regle)}"><div class="gp-carte"><img src="${uri}" alt="${ech(p.nom)}"></div></div>`)
  }
  return `<style>${GLOBE_CSS}</style>
<div class="hero-globe" data-gp-hote>
  <div class="gp" data-gp>
    <div class="gp-disque" data-gp-disque><div class="gp-toile" data-gp-toile></div></div>
    <svg class="gp-traits" data-gp-traits viewBox="0 0 620 620" aria-hidden="true">${traits}</svg>
    ${villes}
    ${cartes.join('\n    ')}
  </div>
</div>
<script>${globeScript}</script>`
}

/* LA POLICE EST UN FICHIER, plus un data URI : 170 Ko par page qui ne se
   mettaient jamais en cache. Mesuré le 03/09/2026 : chaque page pesait 180 Ko
   à vide, la police seule. */
fs.mkdirSync(path.join(ICI, 'sortie', 'fonts'), { recursive: true })
fs.copyFileSync(POLICE, path.join(ICI, 'sortie', 'fonts', 'Satoshi-Variable.woff2'))
/* Le favicon est celui du vrai site, relevé le 03/09/2026 sur www.cleolabs.co/favicon.svg. */
const FAVICON = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(LOCAL, 'favicon.svg')).toString('base64')
fs.mkdirSync(path.join(ICI, 'sortie'), { recursive: true })
fs.copyFileSync(path.join(LOCAL, 'favicon.svg'), path.join(ICI, 'sortie', 'favicon.svg'))
/* UN SEUL BUILD À LA FOIS. Plusieurs lanes construisent en parallèle depuis le
   03/09/2026 : deux écritures croisées de sortie/ donneraient une page à moitié
   écrite à l'outil de capture de l'autre. Le verrou est un dossier, atomique. */
const VERROU = path.join(ICI, 'sortie', '.construction-en-cours')
for (let i = 0; ; i++) {
  try { fs.mkdirSync(VERROU); break }
  catch { if (i >= 180) throw new Error('verrou tenu depuis 3 min, retirer ' + VERROU + ' si aucun build ne tourne'); await new Promise(r => setTimeout(r, 1000)) }
}
process.on('exit', () => { try { fs.rmdirSync(VERROU) } catch {} })
/* LE CSS DES LANES : chaque lane écrit le sien dans commun/lanes/<lane>.css,
   concaténé après composants.css. Personne ne touche composants.css pendant
   qu'une lane tourne : c'est ce qui rend les territoires réellement disjoints. */
const dossierLanes = path.join(ICI, 'commun/lanes')
const lanesCss = fs.existsSync(dossierLanes)
  ? fs.readdirSync(dossierLanes).filter(f => f.endsWith('.css')).sort()
      .map(f => `/* ── lane ${f} ── */\n` + fs.readFileSync(path.join(dossierLanes, f), 'utf8')).join('\n')
  : ''
/* Les commentaires des feuilles sont des notes d'atelier (mesures, sources, dont
   edgecomply.com) : ils ne sortent pas dans la page. Mesuré le 03/09/2026 : 192 mentions
   d'edgecomply sur 47 pages, toutes dans le CSS inclus. */
const sansCommentairesCss = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\n{3,}/g, '\n\n')
const base = fs.readFileSync(path.join(ICI, 'commun/base.css'), 'utf8')
const regimeNoir = fs.existsSync(path.join(ICI, 'commun/regime-noir.css'))
  ? fs.readFileSync(path.join(ICI, 'commun/regime-noir.css'), 'utf8') : ''
const composants = fs.readFileSync(path.join(ICI, 'commun/composants.css'), 'utf8')
const mouvement = fs.existsSync(path.join(ICI, 'commun/mouvement.css'))
  ? fs.readFileSync(path.join(ICI, 'commun/mouvement.css'), 'utf8') : ''
const mouvementJs = fs.existsSync(path.join(ICI, 'commun/mouvement.js'))
  ? fs.readFileSync(path.join(ICI, 'commun/mouvement.js'), 'utf8') : ''
/* Les icônes : style relevé sur le module Framer « Moon Sleep »
   (viewBox 24, tracés pleins, une couleur en currentColor). */
const brutIcones = fs.readFileSync(path.join(ICI, 'commun/icones.js'), 'utf8')
const ICONES = {}
for (const m of brutIcones.matchAll(/^\s{2}([a-z]+):\s*'([^']+)'/gm)) ICONES[m[1]] = m[2]
function icone(nom, taille) {
  const d = ICONES[nom]
  if (!d) throw new Error(`ICÔNE INCONNUE : « ${nom} » — ajoute-la dans commun/icones.js`)
  return `<svg class="ico" width="${taille || 20}" height="${taille || 20}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`
}

const globeJs = fs.existsSync(path.join(ICI, 'commun/globe.js'))
  ? fs.readFileSync(path.join(ICI, 'commun/globe.js'), 'utf8') : ''
const CTA = `
<!-- ═══ FIN DE PAGE ═══ -->
<section class="section sur-sombre" style="padding-top:0">
  <div class="conteneur">
    <div class="carte-encre p48">
      <div class="cta-final">
        <img class="portrait" src="img:anaelle" alt="">
        <div>
          <div class="t-caption" style="margin-bottom:10px"><b style="color:var(--c-text-on-dark)">30 minutes</b> avec l'équipe, pour regarder votre catalogue</div>
          <h2 class="t-display">Faites de la conformité votre avantage concurrentiel.</h2>
          <p class="t-body" style="margin:20px 0 0;max-width:560px">Avec Cleo, une gamme se relève sur 106 pays depuis la même base de règles, et chaque obligation retenue porte l'article et la date qui la fondent.</p>
          <div style="margin-top:28px;display:flex;gap:14px;flex-wrap:wrap">
            <a class="btn btn-marque" href="https://meetings.hubspot.com/anaelle-guez/rendez-vous">Voir une démo
              <span class="rond"><svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`

/* Le même bloc, en anglais. Même structure, mêmes href, mêmes classes :
   seule la langue change, jamais la composition. */
const CTA_EN = `
<!-- ═══ FIN DE PAGE ═══ -->
<section class="section sur-sombre" style="padding-top:0">
  <div class="conteneur">
    <div class="carte-encre p48">
      <div class="cta-final">
        <img class="portrait" src="img:anaelle" alt="">
        <div>
          <div class="t-caption" style="margin-bottom:10px"><b style="color:var(--c-text-on-dark)">30 minutes</b> with the team, to go through your catalogue</div>
          <h2 class="t-display">Make compliance your competitive advantage.</h2>
          <p class="t-body" style="margin:20px 0 0;max-width:560px">With Cleo, a range is assessed across 106 countries from the same rule base, and every obligation retained carries the article and the date behind it.</p>
          <div style="margin-top:28px;display:flex;gap:14px;flex-wrap:wrap">
            <a class="btn btn-marque" href="https://meetings.hubspot.com/anaelle-guez/rendez-vous">Request a demo
              <span class="rond"><svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7.5 3.5 11 7l-3.5 3.5" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`

/* La barre latérale des ressources, alignée sur le méga-menu « Ressources » depuis le
   03/09/2026 (lane D : Recherche et Skills ne marquaient rien d'actif, et les pages
   anglaises recevaient la barre française). Le marqueur de page garde son ancien
   libellé : « Recherche » et « Publications » sont reconnus par alias. */
const resNav = (actif, en) => {
  const liens = en
    ? [['10-ressources.html','Tout','All'],['24-blog-en.html','Blog','Blog'],['23-research-en.html','Recherche','Research'],['25-skills-en.html','Skills','Skills'],
       ['26-legal-data-en.html','Legal Data','Legal Data'],['15-evenements.html','Rencontres','Events'],['17-modeles.html','Modèles','Templates'],['13-glossaire.html','Glossaire','Glossary']]
    : [['10-ressources.html','Tout','Tout'],['24-blog.html','Blog','Blog'],['23-research.html','Recherche','Travaux de recherche'],['25-skills.html','Skills','Skills'],
       ['26-legal-data.html','Legal Data','Legal Data'],['15-evenements.html','Rencontres','Rencontres'],['17-modeles.html','Modèles','Modèles'],['13-glossaire.html','Glossaire','Glossaire']]
  const cle = actif === 'Publications' ? 'Blog' : actif
  return `<nav class="res-nav">
    <div class="titre">${en ? 'Resources' : 'Ressources'}</div>
    ${liens.map(([h,k,t]) => `<a href="${h}"${k === cle ? ' class="actif"' : ''}>${t}</a>`).join('\n    ')}
  </nav>`
}

const ecranArbre = fs.readFileSync(path.join(ICI, 'commun/ecran-arbre.html'), 'utf8')
const ecranChat = fs.readFileSync(path.join(ICI, 'commun/ecran-chat.html'), 'utf8')
const ecranChatFil = fs.readFileSync(path.join(ICI, 'commun/ecran-chat-fil.html'), 'utf8')

// Les vignettes : le même écran, en réduction, pour les cartes du tiers.
const brutVignettes = fs.readFileSync(path.join(ICI, 'commun/vignettes.html'), 'utf8')
const VIGNETTES = {}
for (const bloc of brutVignettes.split(/<!--VIGNETTE:/).slice(1)) {
  const nom = bloc.slice(0, bloc.indexOf('-->')).trim()
  VIGNETTES[nom] = bloc.slice(bloc.indexOf('-->') + 3).trim()
}

/* ── LA COUCHE DE TÊTE. ──
   Mesuré le 27/08 : le <head> produit ici faisait cinq lignes, et le <title>
   sortait à 14 caractères (« Cleo — Offre ») contre 75 sur le vrai site, parce
   qu'il reprenait le champ `titre` de la table PAGES, qui est une étiquette de
   NAVIGATION INTERNE au chantier. Ni description, ni canonical, ni hreflang,
   ni JSON-LD.
   commun/seo.json porte les vraies valeurs, transcrites depuis cleo-landing et
   depuis les pages servies. Les clés préfixées d'un souligné sont des notes de
   provenance : elles ne sortent jamais dans le document. */
/* LE JUMEAU LINGUISTIQUE, DÉDUIT DES FICHIERS PRÉSENTS et jamais d'une table.
   « x.html » a pour jumeau « x-en.html » et réciproquement, à condition que le
   fragment existe VRAIMENT dans pages/ : un sélecteur qui mène à une page
   absente est pire que pas de sélecteur. Deux tables en dur valaient tant qu'une
   seule page avait un jumeau ; oublier d'en mettre une à jour ferait mentir le
   sélecteur ET les hreflang. */
function jumeauLangue(nom) {
  const jum = nom.endsWith('-en.html') ? nom.replace(/-en\.html$/, '.html')
                                       : nom.replace(/\.html$/, '-en.html')
  return fs.existsSync(path.join(ICI, 'pages', jum)) ? jum : null
}

const notesSeo = []   // les notes de la couche de tete, PAS le journal des controles
const SEO = JSON.parse(fs.readFileSync(path.join(ICI, 'commun/seo.json'), 'utf8'))
const sansNotes = (o, langue) => {
  if (Array.isArray(o)) return o.map(x => sansNotes(x, langue))
  if (o && typeof o === 'object') {
    /* UNE CARTE DE LANGUE N'EST PAS UNE VALEUR schema.org.
       seo.json range les textes bilingues en { fr: '…', en: '…' } pour garder
       les deux versions. Servie telle quelle, la machine lit un OBJET là où
       elle attend une chaîne : mesuré le 28/08, la description de Cleo Labs
       était vide pour un moteur sur les 26 pages, 175 cartes au total, quand
       le vrai site sert une chaîne. On résout à la langue de la page. */
    const cles = Object.keys(o).filter(k => !k.startsWith('_'))
    if (cles.length && cles.every(k => k === 'fr' || k === 'en')) {
      return sansNotes(o[langue] !== undefined ? o[langue] : (o.fr !== undefined ? o.fr : o.en), langue)
    }
    const r = {}
    for (const [k, v] of Object.entries(o)) if (!k.startsWith('_')) r[k] = sansNotes(v, langue)
    return r
  }
  return o
}
const ech = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// Un <script> ne se termine que sur la séquence </script> : c'est la seule à neutraliser.
const ldjson = (o, langue) => JSON.stringify(sansNotes(o, langue)).replace(/<\/script/gi, '<\\/script')

/* LE MENU SUR TÉLÉPHONE est déduit des méga-menus : mêmes libellés, mêmes
   liens, jamais une seconde liste à tenir à jour. Le bouton entre dans
   .nav-fin, le panneau ferme le <nav>. */
function avecMenuMobile(navHtml) {
  const groupes = []
  for (const bloc of navHtml.split(/<div class="nav-item(?:\s[^"]*)?">/).slice(1)) {
    const m = bloc.match(/<(button|a) class="nav-declencheur"(?: href="([^"]*)")?>([\s\S]*?)<\/\1>/)
    if (!m) continue
    const titre = m[3].replace(/<svg[\s\S]*?<\/svg>/g, '').trim()
    if (m[2]) { groupes.push({ titre, href: m[2] }); continue }
    const liens = []
    for (const a of bloc.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      const b = a[2].match(/<b>([\s\S]*?)<\/b>/)
      const texte = (b ? b[1] : a[2]).replace(/<span class="mega-badge">[\s\S]*?<\/span>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
      if (texte) liens.push({ href: a[1], texte })
    }
    groupes.push({ titre, liens })
  }
  const fin = navHtml.match(/<div class="nav-fin">([\s\S]*?)<\/div>/)
  if (!fin) throw new Error('nav : .nav-fin introuvable')
  const actions = [...fin[1].matchAll(/<a class="([^"]*)" href="([^"]+)">([\s\S]*?)<\/a>/g)]
    .map(a => ({ classe: a[1], href: a[2], texte: a[3].replace(/<[^>]+>/g, '').trim() }))
  const panneau = `<div class="menu-mobile" id="menu-mobile" hidden>
${groupes.map(g => g.href
    ? `  <div class="mm-groupe"><a href="${g.href}">${g.titre}</a></div>`
    : `  <div class="mm-groupe"><div class="mm-titre">${g.titre}</div>
${g.liens.map(l => `    <a href="${l.href}">${l.texte}</a>`).join('\n')}
  </div>`).join('\n')}
  <div class="mm-actions">
${actions.map(a => `    <a class="${a.classe.includes('btn') ? 'btn btn-marque' : 'mm-lien'}" href="${a.href}">${a.texte}</a>`).join('\n')}
  </div>
</div>`
  const bouton = '<button class="nav-burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="menu-mobile"><span></span><span></span></button>'
  let out = navHtml.replace(/(<a class="btn btn-marque btn-sm" href="[^"]+">[^<]*<\/a>)(\s*<\/div>)/, `$1\n      ${bouton}$2`)
  if (out === navHtml) throw new Error('nav : bouton de menu non posé')
  const n = out.lastIndexOf('</nav>')
  if (n < 0) throw new Error('nav : </nav> introuvable')
  return out.slice(0, n) + panneau + '\n' + out.slice(n)
}
const nav = avecMenuMobile(fs.readFileSync(path.join(ICI, 'commun/bandeau-nav.html'), 'utf8'))
const pied = fs.readFileSync(path.join(ICI, 'commun/pied.html'), 'utf8')
/* Les fragments anglais quand ils existent, les français sinon : une page
   en:true se construit même avant que l'anglais soit écrit. */
function litOuRepli(rel, repli) {
  const abs = path.join(ICI, rel)
  return fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : repli
}
const navEn = fs.existsSync(path.join(ICI, 'commun/bandeau-nav-en.html'))
  ? avecMenuMobile(fs.readFileSync(path.join(ICI, 'commun/bandeau-nav-en.html'), 'utf8')) : nav
const piedEn = litOuRepli('commun/pied-en.html', pied)


fs.mkdirSync(path.join(ICI, 'sortie'), { recursive: true })
const journal = []

for (const p of PAGES) {
  const src = path.join(ICI, 'pages', p.fichier)
  if (!fs.existsSync(src)) { console.log(`  (pas encore ecrite : ${p.fichier})`); continue }
  let corps = fs.readFileSync(src, 'utf8')
  /* Le repère <main> et le lien d'évitement : le contenu vit entre la barre et
     le pied. Mesuré le 03/09 : aucune page n'avait de <main>. */
  const aNav = corps.includes('<!--NAV-->')
  const evitement = `<a class="lien-evitement" href="#contenu">${p.en ? 'Skip to content' : 'Aller au contenu'}</a>`
  corps = corps.replace('<!--NAV-->', evitement + '\n' + (p.en ? navEn : nav) + '\n<main id="contenu">')
  corps = corps.replace('<!--PIED-->', (aNav ? '</main>\n' : '') + (p.en ? piedEn : pied))
  corps = corps.replace('<!--MASSE-->', masse()).replace('<!--MASSE-REFS-->', masseRefs())
  corps = corps.replace(/ico:([a-z]+)(?::(\d+))?/g, (_, n, t) => icone(n, t ? +t : 20))
  /* LE SÉLECTEUR DE LANGUE. Il n'apparaît QUE là où un jumeau existe :
     seule l'accueil en a un dans cette maquette, et un sélecteur qui mène
     à une page absente est pire que pas de sélecteur. */
  const jum = jumeauLangue(p.sortie || p.fichier)
  corps = corps.replace('<!--LANGUE-->', jum
    ? `<div class="nav-langue"><span class="actif">${p.en ? 'EN' : 'FR'}</span><a href="${jum}">${p.en ? 'FR' : 'EN'}</a></div>`
    : '')
  corps = corps.replace('<!--CTA-->', p.en ? CTA_EN : CTA)
  corps = corps.replace('<!--ECRAN-ARBRE-->', ecranArbre).replace('<!--ECRAN-CHAT-->', ecranChat)
  corps = corps.replace('<!--ECRAN-CHAT-FIL-->', ecranChatFil)
  corps = corps.replace('<!--ECRAN-CHAT-VIGNETTE-->', VIGNETTES.chat || '')
    .replace('<!--ECRAN-ARBRE-VIGNETTE-->', VIGNETTES.arbre || '')
    .replace('<!--VEILLE-VIGNETTE-->', VIGNETTES.veille || '')
  if (corps.includes('<!--VEILLE-->')) corps = corps.replace('<!--VEILLE-->', await veille())
  if (corps.includes('<!--GLOBE-PRODUITS-->')) corps = corps.replace('<!--GLOBE-PRODUITS-->', await globeProduits())
  corps = corps.replace(/<!--RES-NAV:([^>]*)-->/g, (_, a) => resNav(a.trim(), !!p.en))
  corps = await injecterImages(corps)
  /* AUCUN COMMENTAIRE HTML NE SORT. Mesuré le 03/09/2026 : 515 commentaires servis sur
     46 pages, dont « composition relevée sur edgecomply.com » cinq fois sur l'accueil
     en ligne. Les marqueurs de l'atelier non résolus (NAV, PIED, CTA…) restent, pour
     que le contrôle « fragment commun non injecté » puisse encore les voir. */
  corps = corps.replace(/<!--(?!(?:NAV|PIED|CTA|MASSE|MASSE-REFS|ECRAN-[A-Z-]+|VEILLE|GLOBE-PRODUITS|RES-NAV:[^>]*|LANGUE)-->)[\s\S]*?-->/g, '')

  const nomSortie = p.sortie || p.fichier
  const seoP = SEO.pages[nomSortie]
  const langue = p.en ? 'en' : 'fr'
  const titre = seoP && seoP.titre ? seoP.titre : `Cleo — ${p.titre}`
  if (!seoP) notesSeo.push(`  (pas de fiche SEO : ${nomSortie}, titre de repli)`)
  /* L'URL CANONIQUE EST CELLE DU VRAI SITE, ou rien.
     Vécu le 27/08 : j'ai d'abord construit le canonical depuis le nom de
     fichier de la maquette, ce qui donnait https://www.cleolabs.co/01-accueil.html
     — mesuré à 404. Un canonical vers une page inexistante est pire que pas de
     canonical : il désigne le vide comme original. Quand la page a un équivalent
     servi (source « site »), on prend SON url. Sinon on n'en déclare aucune. */
  const url = seoP && seoP.source === 'site' && seoP.url_source ? seoP.url_source : null

  /* Le jumeau linguistique : SEULE l'accueil en a un dans cette maquette.
     On ne fabrique pas d'alternate vers un fichier qui n'existe pas. */
  const jumeau = jumeauLangue(nomSortie)
  const nomFr = p.en ? jumeau : nomSortie, nomEn = p.en ? nomSortie : jumeau
  const urlFr = jumeau && SEO.pages[nomFr] && SEO.pages[nomFr].url_source
  const urlEn = jumeau && SEO.pages[nomEn] && SEO.pages[nomEn].url_source
  const alternates = (jumeau && urlFr && urlEn) ? [
    `<link rel="alternate" hreflang="fr" href="${urlFr}">`,
    `<link rel="alternate" hreflang="en" href="${urlEn}">`,
    `<link rel="alternate" hreflang="x-default" href="${urlEn}">`,
  ].join('\n') : ''

  const desc = seoP && seoP.description ? seoP.description : ''
  const metaDesc = desc ? `<meta name="description" content="${ech(desc)}">` : ''
  const og = [
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Cleo Labs">`,
    `<meta property="og:locale" content="${langue === 'en' ? 'en_US' : 'fr_FR'}">`,
    `<meta property="og:title" content="${ech(titre)}">`,
    desc ? `<meta property="og:description" content="${ech(desc)}">` : '',
    url ? `<meta property="og:url" content="${url}">` : '',
    // og:image : aucune image sourçable pour la maquette, on n'invente pas d'URL.
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${ech(titre)}">`,
    desc ? `<meta name="twitter:description" content="${ech(desc)}">` : '',
  ].filter(Boolean).join('\n')

  /* Le structuré : l'entité et le site sur TOUTES les pages, puis ce que
     seo.json déclare pour celle-ci. */
  /* La levée vit DANS l'Organization sur le vrai site, portée par le layout
     racine, donc sur toutes les pages. seo.json la range à part pour garder la
     trace de ses deux sources : on la recolle ici, à sa place. */
  const entite = sansNotes(SEO.entite, langue)
  const evt = (SEO.levee && SEO.levee.evenements || [])[0]
  if (evt) {
    const f = sansNotes(evt, langue)
    delete f.porte_par; delete f.fichier
    // Le nom du tour est bilingue dans le magasin : on sert celui de la page.
    entite.funding = f
  }
  const blocs = [entite, SEO.site.webSite]
  /* ON N'ÉMET QUE CE QU'ON PEUT REMPLIR.
     Mesuré le 28/08 : la version précédente estampillait inLanguage et
     isPartOf sur TOUS les types, alors que ces deux propriétés ont pour
     domaine CreativeWork seul — 60 violations. Et elle déclarait des
     BreadcrumbList et des FAQPage SANS leur propriété obligatoire :
     30 blocs incomplets, ce qui est pire que pas de bloc du tout, un
     moteur les rejette au lieu de les ignorer. */
  const CREATIVE = new Set(['WebPage', 'WebSite', 'Article', 'BlogPosting', 'TechArticle',
    'Blog', 'CollectionPage', 'AboutPage', 'ContactPage', 'FAQPage', 'SoftwareApplication'])
  const REQUIS = { BreadcrumbList: ['itemListElement'], FAQPage: ['mainEntity'],
    ItemList: ['itemListElement'], JobPosting: ['title', 'datePosted', 'hiringOrganization'],
    Event: ['startDate', 'location'], HowTo: ['step'], Article: ['headline'],
    BlogPosting: ['headline'], TechArticle: ['headline'] }
  const st = SEO.structure[nomSortie]
  if (st && Array.isArray(st.types)) {
    for (const type of st.types) {
      if (type === 'Organization' || type === 'WebSite') continue
      const props = sansNotes((st.proprietes && st.proprietes[type]) || {}, langue)
      const bloc = { '@context': 'https://schema.org', '@type': type }
      if (!props.name) bloc.name = titre
      if (url && !props.url) bloc.url = url
      if (CREATIVE.has(type)) {
        bloc.inLanguage = langue === 'en' ? 'en-US' : 'fr-FR'
        bloc.isPartOf = { '@id': SEO.site.webSite['@id'] }
      }
      Object.assign(bloc, props)
      // Une propriété obligatoire absente : on n'émet pas le bloc, et on le dit.
      const trous = (REQUIS[type] || []).filter(k => !(k in bloc))
      if (trous.length) { notesSeo.push(`  (${nomSortie} : ${type} non emis, il manque ${trous.join(', ')})`); continue }
      blocs.push(bloc)
    }
  }
  const structure = blocs.map(b =>
    `<script type="application/ld+json">${ldjson(b, langue)}</script>`).join('\n')

  /* Aucun commentaire HTML ne sort dans la page : le « noindex » est là parce que
     ces pages reprennent le contenu de www.cleolabs.co et lui nuiraient en
     duplication ; la source de composition (p.source) reste dans la table PAGES.
     Mesuré le 03/09 par la lane B : ces deux commentaires étaient servis 47 fois. */
  let doc = `<!doctype html>
<html lang="${langue}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" type="image/svg+xml" href="${FAVICON}">
<meta name="robots" content="noindex,nofollow">
<title>${ech(titre)}</title>
${metaDesc}
${url ? `<link rel="canonical" href="${url}">` : ''}
${alternates}
${og}
${structure}
<style>
@font-face{font-family:"Satoshi";src:url(/fonts/Satoshi-Variable.woff2) format("woff2");
  font-weight:300 900;font-style:normal;font-display:swap}
${sansCommentairesCss(base + '\n' + composants + '\n' + lanesCss + '\n' + (p.noir ? regimeNoir : '') + '\n' + mouvement)}
</style>
</head>
<body>
${corps}
<script>${mouvementJs}</script>
<script>${corps.includes('data-globe') ? globeJs : ''}</script>
</body>
</html>`
  /* Chargement différé : toute image après la première section. La première
     section porte le hero, qui doit peindre tout de suite. */
  { const coupe = doc.indexOf('</section>')
    if (coupe > 0) doc = doc.slice(0, coupe) + doc.slice(coupe).replace(/<img\b(?![^>]*\bloading=)/g, '<img loading="lazy" decoding="async"') }
  /* Liens propres. La maquette s'ouvre sur des URL calquees sur les routes
     REELLES de www.cleolabs.co, pour qu'elle se lise comme le site final et
     que le portage garde les memes adresses. Les ancres sont preservees. */
  doc = doc.replace(/href="(\d\d-[a-z0-9-]+\.html)(#[^"]*)?"/g, (tout, fichier, ancre) => {
    const c = CHEMINS.pages[fichier]
    return c ? `href="${c.chemin}${ancre || ''}"` : tout
  })
  const dest = path.join(ICI, 'sortie', p.sortie || p.fichier)
  fs.writeFileSync(dest, doc)
  journal.push({ fichier: p.sortie || p.fichier, ko: Math.round(doc.length / 1024) })
  console.log(`  ${(p.sortie || p.fichier).padEnd(22)} ${String(Math.round(doc.length / 1024)).padStart(5)} Ko`)
}

/* La table des chemins propres sert deux fois : ici pour reecrire les liens,
   et plus bas pour ecrire les reecritures que Vercel appliquera. */
/* Blocage d'indexation. Piege verifie le 27/08 sur ce deploiement meme :
   « Disallow: / » dans robots.txt ET « noindex » dans la page s'ANNULENT.
   Le robot bloque par robots.txt ne charge jamais la page, donc ne lit
   jamais le noindex, et l'URL peut ressortir en resultat sur les seuls
   liens entrants. La bonne combinaison est l'inverse de l'intuition :
   on LAISSE crawler, et on refuse l'indexation dans l'en-tete HTTP et
   dans la page. */
fs.writeFileSync(path.join(ICI, 'sortie', 'robots.txt'),
`# Maquette de travail Cleo Labs. Deploiement jetable, jamais un site public.
# On autorise volontairement le crawl : c'est la seule facon pour qu'un robot
# LISE le « noindex » servi en en-tete HTTP et dans chaque page. Un
# « Disallow: / » ici rendrait ce noindex invisible et donc inoperant.
User-agent: *
Allow: /
`)
/* Les URL propres. Vercel sert le fichier plat derriere l'adresse calquee sur
   le vrai site : aucune duplication de fichier, et la barre d'adresse dit
   « /fr/company » comme en production. La racine mene a /fr, comme le 307
   que sert deja www.cleolabs.co. */
const reecritures = Object.entries(CHEMINS.pages)
  .map(([fichier, c]) => ({ source: c.chemin, destination: '/' + fichier }))
fs.writeFileSync(path.join(ICI, 'sortie', 'vercel.json'), JSON.stringify({
  headers: [{ source: '/(.*)', headers: [
    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet' }] }],
  redirects: [{ source: '/', destination: CHEMINS.racine, permanent: false }],
  rewrites: [...reecritures, { source: '/apercu', destination: '/index.html' }]
}, null, 2))
console.log(`  ${reecritures.length} URL propres, calquees sur les routes de www.cleolabs.co`)
console.log("  robots.txt + vercel.json : crawl autorise, indexation refusee (en-tete + page)")

if (notesSeo.length) { console.log(`\n  couche de tete, ${notesSeo.length} note(s) :`); notesSeo.forEach(n => console.log(n)) }

/* Controles bloquants : ce qui a deja coute une iteration par le passe */
let erreurs = 0
for (const j of journal) {
  const t = fs.readFileSync(path.join(ICI, 'sortie', j.fichier), 'utf8')
  const restants = [...t.matchAll(/(?:src="|url\()img:([a-z0-9-]+)/g)].map(m => m[1])
  if (restants.length) { console.log(`  ECHEC ${j.fichier} : marqueurs non resolus -> ${[...new Set(restants)].join(', ')}`); erreurs++ }
  if (!t.includes('font-family:"Satoshi"')) { console.log(`  ECHEC ${j.fichier} : Satoshi absent`); erreurs++ }
  if (/@import|https?:\/\/fonts\./.test(t)) { console.log(`  ECHEC ${j.fichier} : police externe importee`); erreurs++ }
  if (t.includes('<!--NAV-->') || t.includes('<!--PIED-->')) { console.log(`  ECHEC ${j.fichier} : fragment commun non injecte`); erreurs++ }
  // clamp() mal forme : « 1.4rem+3.2vw » sans espaces est invalide et la
  // declaration tombe en silence. Vecu le 26/08 : tous les titres a 32px.
  for (const balise of ['div', 'section', 'ul', 'table', 'aside', 'p']) {
    const o = (t.match(new RegExp(`<${balise}\\b`, 'g')) || []).length
    const f = (t.match(new RegExp(`</${balise}>`, 'g')) || []).length
    if (o !== f) { console.log(`  ECHEC ${j.fichier} : <${balise}> ${o} ouverts / ${f} fermes`); erreurs++ }
  }
  if (/^\s*"\d[^"]*">/m.test(t)) { console.log(`  ECHEC ${j.fichier} : fragment de balise orphelin`); erreurs++ }
  // Le DS V5 interdit la monospace dans le produit et les supports :
  // les references reglementaires sont en Satoshi, chiffres tabulaires.
  if (/font-family\s*:[^;'"]*monospace/i.test(t)) { console.log(`  ECHEC ${j.fichier} : monospace, interdite par le DS V5`); erreurs++ }
  if (/ico:[a-z]+/.test(t)) { console.log(`  ECHEC ${j.fichier} : marqueur d'icône non résolu`); erreurs++ }
  // Passe du 03/09/2026 : plus aucun lien mort, aucun champ figé, aucune note interne servie.
  if (!j.fichier.startsWith('00-')) {
    const morts = (t.match(/href="#"/g) || []).length
    if (morts) { console.log(`  ECHEC ${j.fichier} : ${morts} lien(s) href="#"`); erreurs++ }
    if (/<input[^>]*\bdisabled\b/.test(t)) { console.log(`  ECHEC ${j.fichier} : champ de formulaire disabled`); erreurs++ }
    if (/Feature \d sur 3|Fiche à confirmer|à confirmer avec Decathlon|Grille tarifaire à|Le même écran, une fois|Cleo Comply/.test(t)) {
      console.log(`  ECHEC ${j.fichier} : note interne ou mention retirée encore servie`); erreurs++ }
  }
  // DA V5 §18 : un seul element colore par grille, sans exception.
  for (const bloc of t.match(/<div class="mass[^"]*">[\s\S]*?(?=<\/div>\s*<\/div>)/g) || []) {
    const n = (bloc.match(/\bfound\b/g) || []).length
    if (n !== 1) { console.log(`  ECHEC ${j.fichier} : grille avec ${n} element(s) colore(s), le DS en veut 1`); erreurs++ }
  }
  const clampsCasses = [...t.matchAll(/clamp\([^)]*\d(?:rem|em|px|vw)\+\d[^)]*\)/g)]
  if (clampsCasses.length) { console.log(`  ECHEC ${j.fichier} : ${clampsCasses.length} clamp() sans espace autour du +`); erreurs++ }
}
console.log(erreurs ? `\n${erreurs} controle(s) en echec` : `\n${journal.length} page(s), tous les controles passent`)
process.exit(erreurs ? 1 : 0)
