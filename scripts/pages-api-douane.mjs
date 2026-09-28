/* ════════════════════════════════════════════════════════════════
   LES TROIS PAGES « CUSTOMS API » PAR PUBLIC, FR ET EN (28/09/2026).
   node scripts/pages-api-douane.mjs écrit pages/60-api-douane(-en).html, 61-api-douane-ecommerce(-en).html et
   62-api-douane-commissionnaires(-en).html. On retouche les textes ICI, jamais dans les fragments, pour que les deux
   langues gardent la même composition.

   Source du contenu : la refonte du portail développeur, PR Cleo-Labs-IA/cleo-legal-public#53
   (components/customs-landing/audiences.ts, CustomsLanding.tsx, HeroDemo.tsx, AnswerCard.tsx). Composition reprise,
   jamais son style : ici les jetons et la police de la V6 (commun/lanes/v6-zzzzzzzzzzzzzzzzzzzzzzz-douane.css).
   Chiffres (aucun inventé) :
   - couverture 112 / 249 territoires à la ligne nationale, 137 à 6 chiffres : lib/customs-facts.ts de la PR, relevé du
     25/09/2026 (GET /v2/customs/coverage/countries), mêmes chiffres que /fr/data ;
   - lots de 2 000 articles, idempotence 24 h, dossier gardé 400 jours, 1 unité + 1 par élément d'un kit : même fichier ;
   - Sandbox 200 unités, Starter 100 € (80 € à l'année) 100 000 unités / 60 req/min, Pro 349 € (279 €) 1 000 000 /
     300 req/min : lib/plans.ts de la PR, identiques à la page Data ;
   - la démo et les cartes réponse : captures réelles du 28/09/2026 (lib/customs-captures/2026-09-28-*.json de la PR),
     request_id 9d5bee8d… (T-shirt nu, US), 9be03b02… (T-shirt répondu, US), 96745a0f… (T-shirt, FR, cn8).
   Citations Reddit : mot pour mot en anglais ; traduites sur les pages FR, et dites traduites. Développeurs et
   commissionnaires : celles de la PR. E-commerce (revue fondatrice du 28/09) : commentaire t1_od7a4cy d'Angstyjay (auteur
   du fil, marchand basé aux États-Unis), 29/03/2026, relevé dans Chrome sans connexion le 28/09/2026 : « I had one person
   refused it at customs and the package got lost and I still had to refund them » ; extrait de 13 mots, contigu.
   Garanties techniques (bandeau développeurs) : portail /docs/customs, sections reliability (X-Request-Id, request_id des
   erreurs, Idempotency-Key 24 h), batches (erreur par ligne), webhooks (X-Cleo-Signature-V2 + X-Cleo-Timestamp) ;
   dataset_version : capture 96745a0f.
   Les réponses de l'API sont en anglais : sur les pages FR, questions et titres sont traduits, et la démo le dit.
   ════════════════════════════════════════════════════════════════ */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ICI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PORTAIL = 'https://legaldata-public.cleolabs.co'
const API = 'https://api.legaldata.cleolabs.co'
const EURLEX = 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32025R1926'
const MAIL = 'mailto:hello@cleolabs.co?subject=Customs%20API'
const HOTE = 'https://www.cleolabs.co'
const CHEMINS_JSON = JSON.parse(fs.readFileSync(path.join(ICI, 'commun/chemins.json'), 'utf8'))
/* Typographie française : espace insécable avant ? ! : ; % € et dans les guillemets. */
const fr = s => s.replace(/ ([?!:;%€»])/g, ' $1').replace(/« /g, '« ').replace(/(\d) (\d{3})\b/g, '$1 $2')

/* Les prix, une seule fois : les cartes « Tarifs » et le JSON-LD WebAPI (offers) les lisent ici. lib/plans.ts de la PR #53. */
const TARIFS = { sandbox: 0, starter: 100, starterAn: 80, pro: 349, proAn: 279 }
const SEO_JSON = JSON.parse(fs.readFileSync(path.join(ICI, 'commun/seo.json'), 'utf8'))

const ICONES = {
  oui: '<svg class="dg-marque" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  vous: '<svg class="dg-marque" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="6.5" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.8 17c.8-3.3 3.3-5.2 6.2-5.2s5.4 1.9 6.2 5.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  pret: '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M6 10.2l2.7 2.7L14.2 7.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  attente: '<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 5.5v5.5M10 14.2v.3" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
  etapes: [
    '<path d="M4 9l10-5 10 5v10l-10 5-10-5z"/><path d="M4 9l10 5 10-5M14 14v10"/>',
    '<rect x="5" y="3.5" width="18" height="21" rx="2.5"/><path d="M9 10h10M9 14h6M10 19l2.2 2.2L17 16.5"/>',
    '<path d="M14 3.5v12M9 11l5 5 5-5"/><rect x="4" y="19" width="20" height="5.5" rx="2"/>',
  ],
}
const iconeEtape = i => `<span class="dg-etape-icone"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES.etapes[i]}</svg></span>`

/* ── Les mots communs aux trois publics ── */
const COMMUN = {
  en: {
    cta: 'Get an API key', docs: 'Read the documentation', note: '200 free units · no card · no sales call',
    produit: 'Product', destination: 'Destination', usa: 'United States',
    aVerifier: 'Needs your review', troisQuestions: '3 questions first', repondre: 'Answer them',
    vosReponses: 'Your answers', classer: 'Classify with these answers', pret: 'Ready for your review',
    recommencer: 'Start again', capture: 'Real answer captured 28 September 2026', live: 'Try it live in the sandbox',
    demoLabel: 'Example: a T-shirt sent to the United States',
    questions: [
      'Is the garment knitted or crocheted (chapter 61) or woven (chapter 62)?',
      'What is the fibre composition by weight (e.g. cotton 60%, polyester 40%)?',
      'Is it for men or boys, for women or girls, or for babies?',
    ],
    faits: [['Knitted or woven?', 'Knitted'], ['Worn by?', 'Men'], ['Main material', 'Cotton, 100%']],
    niveau6: 'International code, 6 digits', niveau8: 'EU code, 8 digits',
    titre6109: 'T-shirts, singlets and other vests; of cotton, knitted or crocheted',
    source: 'Source', texteOfficiel: '(official text)', note1: 'Chapter 61 Note 1', noteAdd2: 'Chapter 61 Additional Note 2',
    commentCaMarche: 'How it works',
    etapes: ['Send the product', 'Get the code, or the questions it still needs', 'Approve, then write back'],
    captureDu: 'Real answer, captured 28 September 2026.',
    livre: 'What Cleo delivers', controle: 'What stays in your hands', listeComplete: 'Full list in the docs', voirListe: 'See the list',
    controleListe: [
      'An official customs ruling stays with the customs authority. Cleo delivers documented suggestions.',
      '112 of 249 territories answer at the national tariff line and 137 at 6 digits, and every answer states its level. In the US, the digits past 6 for an entry are set with a licensed customs broker.',
      'Every cost says what it includes. A duty Cleo could not price is named and the cost is marked partial, never guessed.',
    ],
    tarifs: 'Start free. Pay monthly for volume.',
    plans: [
      { nom: 'Sandbox', eur: TARIFS.sandbox, prix: `€${TARIFS.sandbox}`, note: '200 units, lifetime · no card', debit: 'All endpoints', cta: 'Get an API key', href: `${PORTAIL}/signup`, principal: true },
      { nom: 'Starter', eur: TARIFS.starter, prix: `€${TARIFS.starter}`, mois: '/ month', note: `Or €${TARIFS.starterAn}/mo billed yearly · cancel anytime`, debit: '100,000 units / month · 60 requests / minute', cta: 'Choose Starter', href: `${PORTAIL}/buy/starter?cadence=monthly` },
      { nom: 'Pro', eur: TARIFS.pro, prix: `€${TARIFS.pro}`, mois: '/ month', note: `Or €${TARIFS.proAn}/mo billed yearly · cancel anytime`, debit: '1,000,000 units / month · 300 requests / minute', cta: 'Choose Pro', href: `${PORTAIL}/buy/pro?cadence=monthly` },
    ],
    entreprise: 'Enterprise volume or terms?', nousEcrire: 'Talk to us', poids: 'See request weight',
    faqTitre: 'Questions',
    faqFinal: { q: 'Is the code final?', a: 'No. It is a candidate with its sources, for your review. The importer, or the broker acting for them, decides what is declared.' },
    faqCout: { q: 'What does a call cost?', a: 'One classification costs 1 unit, plus 1 per part of a kit. The Sandbox gives 200 units, no card.' },
    final: 'Try it on one product from your catalog.', ingenieur: 'Talk to a customs engineer',
    avertissement: 'Cleo prepares documented suggestions. A qualified professional validates the final classification, the licences and the applicable declarations.',
    reponseComplete: 'See the full response', requete: 'Request, as sent',
  },
  fr: {
    cta: 'Obtenir une clé API', docs: 'Lire la documentation', note: '200 unités gratuites · sans carte · sans appel commercial',
    produit: 'Produit', destination: 'Destination', usa: 'États-Unis',
    aVerifier: 'À vérifier par vous', troisQuestions: '3 questions d’abord', repondre: 'Y répondre',
    vosReponses: 'Vos réponses', classer: 'Classer avec ces réponses', pret: 'Prêt pour votre validation',
    recommencer: 'Recommencer', capture: 'Réponse réelle capturée le 28 septembre 2026, traduite de l’anglais', live: 'Essayer en direct dans le sandbox',
    demoLabel: 'Exemple : un T-shirt envoyé aux États-Unis',
    questions: [
      'Le vêtement est-il en maille ou crocheté (chapitre 61), ou tissé (chapitre 62) ?',
      'Quelle est sa composition en fibres, en poids (par exemple coton 60 %, polyester 40 %) ?',
      'Est-il pour hommes ou garçonnets, pour femmes ou fillettes, ou pour bébés ?',
    ],
    faits: [['Maille ou tissé ?', 'Maille'], ['Porté par ?', 'Hommes'], ['Matière principale', 'Coton, 100 %']],
    niveau6: 'Code international, 6 chiffres', niveau8: 'Code UE, 8 chiffres',
    titre6109: 'T-shirts, maillots de corps et gilets de corps, de coton, en bonneterie',
    source: 'Source', texteOfficiel: '(texte officiel)', note1: 'Chapitre 61, note 1', noteAdd2: 'Chapitre 61, note complémentaire 2',
    commentCaMarche: 'Comment ça marche',
    etapes: ['Envoyez le produit', 'Recevez le code, ou les questions qui manquent', 'Validez, puis renvoyez le code'],
    captureDu: 'Réponse réelle, capturée le 28 septembre 2026, traduite de l’anglais.',
    livre: 'Ce que Cleo livre', controle: 'Ce qui reste sous votre contrôle', listeComplete: 'La liste complète dans la documentation', voirListe: 'Voir la liste',
    controleListe: [
      'Une décision douanière officielle reste du ressort de l’autorité douanière. Cleo livre des suggestions documentées.',
      '112 territoires sur 249 répondent à la ligne tarifaire nationale et 137 à 6 chiffres, et chaque réponse indique son niveau. Aux États-Unis, les chiffres au-delà du sixième se fixent avec un commissionnaire en douane agréé.',
      'Chaque coût dit ce qu’il inclut. Un droit que Cleo n’a pas pu chiffrer est nommé et le coût est marqué partiel, jamais deviné.',
    ],
    tarifs: 'Commencez gratuitement. Payez au mois pour le volume.',
    plans: [
      { nom: 'Sandbox', eur: TARIFS.sandbox, prix: `${TARIFS.sandbox} €`, note: '200 unités, à vie · sans carte', debit: 'Tous les endpoints', cta: 'Obtenir une clé API', href: `${PORTAIL}/signup`, principal: true },
      { nom: 'Starter', eur: TARIFS.starter, prix: `${TARIFS.starter} €`, mois: 'par mois', note: `Ou ${TARIFS.starterAn} € par mois facturé à l’année · résiliable à tout moment`, debit: '100 000 unités par mois · 60 requêtes par minute', cta: 'Choisir Starter', href: `${PORTAIL}/buy/starter?cadence=monthly` },
      { nom: 'Pro', eur: TARIFS.pro, prix: `${TARIFS.pro} €`, mois: 'par mois', note: `Ou ${TARIFS.proAn} € par mois facturé à l’année · résiliable à tout moment`, debit: '1 000 000 unités par mois · 300 requêtes par minute', cta: 'Choisir Pro', href: `${PORTAIL}/buy/pro?cadence=monthly` },
    ],
    entreprise: 'Un volume ou des conditions Enterprise ?', nousEcrire: 'Nous écrire', poids: 'Voir le poids des requêtes',
    faqTitre: 'Questions',
    faqFinal: { q: 'Le code est-il définitif ?', a: 'Non. C’est un candidat avec ses sources, à valider. L’importateur, ou le commissionnaire qui agit pour lui, décide de ce qui est déclaré.' },
    faqCout: { q: 'Combien coûte un appel ?', a: 'Un classement coûte 1 unité, plus 1 par élément d’un kit. Le Sandbox donne 200 unités, sans carte.' },
    final: 'Essayez-la sur un produit de votre catalogue.', ingenieur: 'Parler à un ingénieur douane',
    avertissement: 'Cleo prépare des suggestions documentées. Un professionnel compétent valide le classement final, les licences et les déclarations applicables.',
    reponseComplete: 'Voir la réponse complète', requete: 'La requête, telle qu’envoyée',
  },
}

/* ── Les trois publics ── */
const PUBLICS = {
  dev: {
    fichier: '60-api-douane', exemple: 'fr',
    en: {
      surtitre: 'Customs classification API for ERP, TMS, e-commerce and brokerage software',
      h1: 'Build customs classification into your product without maintaining tariff schedules.',
      chapeau: 'Send the product’s characteristics, its destination and the date. Cleo returns the available code, the missing information, the sources and the review status.',
      cta1: ['Get an API key', `${PORTAIL}/signup`], cta2: ['Read the documentation', `${PORTAIL}/docs/customs`],
      citation: { texte: '“what is the equivalent HTS for Brazil, Russia, China”', qui: 'a user on r/CustomsBroker', url: 'https://www.reddit.com/r/CustomsBroker/comments/zy9seo/world_tariff/' },
      etapes: ['One item or a batch of 2,000, by REST, TypeScript SDK or MCP.', 'The level each country serves, and questions instead of guesses, with sources.', 'Approved codes write back, and any code can be re-checked on a date.'],
      garantiesTitre: 'Built to integrate', garantiesLien: 'Details in the documentation',
      garanties: ['A request id on every response and every error', 'Idempotency keys: a retry with the same key within 24 hours never runs twice', 'Batches report an error per line', 'Signed webhooks, with a timestamp', 'The tariff data version each answer read'],
      exempleTitre: 'One answer your product can show', exempleIntro: 'A men’s knitted cotton T-shirt sent to France.',
      livre: [
        'The coverage level of each answer: the national tariff line or 6 digits, stated in the response.',
        'The tariff data version the answer read, with the date it takes effect.',
        'A request id on every response and every error, to quote to support.',
        'Idempotency keys: the same key and body within 24 hours replays the answer at no extra cost.',
      ],
      controlePremier: 'Your users’ customs broker or importer of record files the declaration. Cleo prepares the data.',
      faq: [
        { q: 'Is it predictable to integrate?', a: 'Yes. The guarantees listed under “How it works” are detailed in the <a href="https://legaldata-public.cleolabs.co/docs/customs#reliability">documentation</a>, with the webhook signature check.' },
        { q: 'Which countries?', a: '112 of 249 territories answer at the national tariff line, the rest at 6 digits. Each answer says which level it used.' },
      ],
    },
    fr: {
      surtitre: 'API de classification douanière pour les logiciels ERP, TMS, e-commerce et douane',
      h1: 'Intégrez une API de classification douanière sans maintenir les nomenclatures pays par pays.',
      chapeau: 'Envoyez les caractéristiques du produit, sa destination et la date. Cleo retourne le code disponible, les informations manquantes, les sources et le statut de validation.',
      cta1: ['Obtenir une clé API', `${PORTAIL}/signup`], cta2: ['Lire la documentation', `${PORTAIL}/docs/customs`],
      citation: { texte: '« quel est l’équivalent HTS pour le Brésil, la Russie, la Chine »', qui: 'un utilisateur de r/CustomsBroker, traduit de l’anglais', url: 'https://www.reddit.com/r/CustomsBroker/comments/zy9seo/world_tariff/' },
      etapes: ['Un article ou un lot de 2 000, par REST, SDK TypeScript ou MCP.', 'Le niveau que sert chaque pays, et des questions plutôt que des suppositions, avec les sources.', 'Les codes validés reviennent dans vos systèmes, et tout code se revérifie à une date donnée.'],
      garantiesTitre: 'Prévisible à intégrer', garantiesLien: 'Le détail dans la documentation',
      garanties: ['Un identifiant de requête sur chaque réponse et chaque erreur', 'Des clés d’idempotence : une nouvelle tentative avec la même clé dans les 24 heures ne s’exécute jamais deux fois', 'Les lots signalent une erreur par ligne', 'Des webhooks signés et horodatés', 'La version des données tarifaires lue par chaque réponse'],
      exempleTitre: 'Une réponse que votre produit peut afficher', exempleIntro: 'Un T-shirt homme en coton, en maille, envoyé en France.',
      livre: [
        'Le niveau de couverture de chaque réponse : la ligne tarifaire nationale ou 6 chiffres, indiqué dans la réponse.',
        'La version des données tarifaires lue par la réponse, avec sa date d’entrée en vigueur.',
        'Un identifiant de requête sur chaque réponse et chaque erreur, à citer au support.',
        'Des clés d’idempotence : la même clé et le même corps dans les 24 heures rejouent la réponse sans coût supplémentaire.',
      ],
      controlePremier: 'Le commissionnaire en douane ou l’importateur de vos utilisateurs dépose la déclaration. Cleo prépare les données.',
      faq: [
        { q: 'L’intégration est-elle prévisible ?', a: 'Oui. Les garanties listées sous « Comment ça marche » sont détaillées dans la <a href="https://legaldata-public.cleolabs.co/docs/customs#reliability">documentation</a>, avec la vérification de signature des webhooks.' },
        { q: 'Quels pays ?', a: '112 territoires sur 249 répondent à la ligne tarifaire nationale, les autres à 6 chiffres. Chaque réponse indique le niveau utilisé.' },
      ],
    },
  },
  ecommerce: {
    fichier: '61-api-douane-ecommerce', exemple: 'fr',
    en: {
      surtitre: 'Customs API for Shopify and e-commerce teams',
      h1: 'Automate customs classification for your e-commerce catalog before checkout.',
      chapeau: 'Cleo identifies the missing characteristics, classifies each product for its destination, then writes back to Shopify only the approved codes.',
      cta1: ['Classify a product', `${PORTAIL}/playground?tab=classify`], cta2: ['See the Shopify workflow', `${PORTAIL}/docs/customs#connectors`],
      ctaNote: 'Shopify connector available for a first production pilot.',
      citation: { texte: '“I had one person refused it at customs and the package got lost”', qui: 'a merchant shipping from the US, on r/shopify', url: 'https://www.reddit.com/r/shopify/comments/1s4fei9/trying_to_ship_ddp_but_the_duties_line_show_0_at/' },
      etapes: ['Your whole catalog, from a Shopify pull or a CSV.', 'A vague title gets questions for your supplier, not a guessed code.', 'Only codes you approve go back, and a different existing code is never overwritten.'],
      exempleTitre: 'The same “T-shirt”, answered, for France', exempleIntro: 'Knitted, all cotton, for men, shipped to France.',
      exempleSuite: 'Approve it and it goes back to Shopify or your CSV.',
      livre: [
        'The missing product facts, as questions you can forward to your supplier.',
        'Your catalog classified for each destination, from a Shopify pull or a CSV, in batches of up to 2,000 items.',
        'A review step: you approve each code before it is used.',
        'Write-back to Shopify or your CSV of approved codes only, never over a different code already there.',
      ],
      controlePremier: 'Your customs broker or importer of record files the declaration. Cleo prepares the data.',
      faq: [
        { q: 'Will the duty at checkout be right?', a: 'The cost lists the parts it includes and names the parts it could not price. The carrier’s final bill and your checkout settings stay outside the API.' },
        { q: 'Does it change my Shopify products?', a: 'Only when you run the write-back, only with codes you approved, and never over a different code already there.' },
      ],
      faqFinal: { q: 'Is the code final?', a: 'No. It is a candidate with its sources, for your review. The importer, or the broker acting for them, decides what is declared. For a US entry, the full 10-digit line is set with your licensed customs broker.' },
    },
    fr: {
      surtitre: 'API douane pour les équipes Shopify et e-commerce',
      h1: 'Automatisez la classification douanière de votre catalogue e-commerce avant le passage en caisse.',
      chapeau: 'Cleo identifie les caractéristiques manquantes, classe chaque produit selon sa destination, puis renvoie vers Shopify uniquement les codes approuvés.',
      cta1: ['Classer un produit', `${PORTAIL}/playground?tab=classify`], cta2: ['Voir le flux Shopify', `${PORTAIL}/docs/customs#connectors`],
      ctaNote: 'Connecteur Shopify disponible pour un premier pilote en production.',
      citation: { texte: '« Une personne l’a refusé à la douane et le colis a été perdu »', qui: 'un marchand qui expédie depuis les États-Unis, sur r/shopify, traduit de l’anglais', url: 'https://www.reddit.com/r/shopify/comments/1s4fei9/trying_to_ship_ddp_but_the_duties_line_show_0_at/' },
      etapes: ['Tout votre catalogue, importé de Shopify ou d’un CSV.', 'Un titre vague reçoit des questions pour votre fournisseur, pas un code deviné.', 'Seuls les codes que vous validez repartent, et un autre code déjà en place n’est jamais écrasé.'],
      exempleTitre: 'Le même « T-shirt », une fois vos réponses données, pour la France', exempleIntro: 'En maille, tout coton, pour homme, expédié en France.',
      exempleSuite: 'Validez-le et il repart vers Shopify ou votre CSV.',
      livre: [
        'Les faits produit manquants, sous forme de questions à transmettre à votre fournisseur.',
        'Votre catalogue classé pour chaque destination, importé de Shopify ou d’un CSV, par lots de 2 000 articles au plus.',
        'Une étape de validation : vous approuvez chaque code avant qu’il serve.',
        'Le renvoi vers Shopify ou votre CSV des seuls codes approuvés, jamais par-dessus un autre code déjà en place.',
      ],
      controlePremier: 'Votre commissionnaire en douane ou votre importateur dépose la déclaration. Cleo prépare les données.',
      faq: [
        { q: 'Les droits affichés au paiement seront-ils justes ?', a: 'Le coût liste ce qu’il inclut et nomme ce qu’il n’a pas pu chiffrer. La facture finale du transporteur et vos réglages de paiement restent hors de l’API.' },
        { q: 'Modifie-t-elle mes produits Shopify ?', a: 'Seulement quand vous lancez le renvoi, seulement avec les codes validés, et jamais par-dessus un autre code déjà en place.' },
      ],
      faqFinal: { q: 'Le code est-il définitif ?', a: 'Non. C’est un candidat avec ses sources, à valider. L’importateur, ou le commissionnaire qui agit pour lui, décide de ce qui est déclaré. Pour une entrée aux États-Unis, la ligne complète à 10 chiffres se fixe avec votre commissionnaire en douane agréé.' },
    },
  },
  brokers: {
    fichier: '62-api-douane-commissionnaires', exemple: 'fr',
    en: {
      surtitre: 'For customs brokers, 3PLs and logistics teams',
      h1: 'Prepare verifiable customs classification dossiers for your clients.',
      chapeau: 'Cleo prepares the candidate codes, the questions to send back to your client, the tariff notes, the interpretation rules and the history of every approval.',
      cta1: ['Review a sample dossier', '63-api-douane-exemple-dossier-en.html'], cta2: ['Explore the API', `${PORTAIL}/docs/customs`],
      citation: { texte: '“We have to be able to explain to CBP how we arrived at a classification”', qui: 'a broker on r/CustomsBroker', url: 'https://www.reddit.com/r/CustomsBroker/comments/1m9vdpx/are_custom_brokers_in_danger_of_being_replaced_by/' },
      etapes: ['Client descriptions as they come: one line, a CSV, or a batch with a status per line.', 'Candidates with the notes they rest on and the ones set aside, or the questions to send back.', 'A named reviewer approves, the line locks, the dossier and approved lines export.'],
      exempleTitre: 'A candidate code, with the note behind it', exempleIntro: 'A men’s knitted cotton T-shirt declared into France.',
      exempleSuite: 'Also weighed: 6104 22 00, set aside. Your reviewer approves, asks for changes or rejects; the decision is named, dated and locked, and only approved lines export.',
      livre: [
        'Candidate codes, with the tariff notes and interpretation rules they rest on.',
        'The alternatives weighed and set aside, next to the code proposed.',
        'A JSON or PDF dossier to forward to a client or a carrier, kept 400 days.',
        'Human validation: a named reviewer approves, and the decision is dated and locked.',
      ],
      controlePremier: 'Booking, tracking and filing stay in your own tools. Cleo prepares the classification and acts as neither forwarder, broker nor importer of record.',
      faq: [
        { q: 'Who carries the decision?', a: 'Your team. Cleo is a copilot: it proposes candidates with sources, a named reviewer signs off, and every decision stays in the history.' },
        { q: 'What can I forward to a client or a carrier?', a: 'A JSON or PDF dossier with the code, the notes and sources, and its review state, kept 400 days; or a CSV of approved lines only.' },
        { q: 'Which classification rulings are available?', a: 'Cleo provides the available tariff notes and interpretation rules. Coverage of classification rulings is still limited and must be completed by the professional’s own research.' },
      ],
      sansFaqFinal: true,
      finalCta: ['Test Cleo on a file you’ve already classified', 'mailto:hello@cleolabs.co?subject=' + encodeURIComponent('Cleo pilot: an already-classified file')],
    },
    fr: {
      surtitre: 'Pour les commissionnaires en douane, 3PL et équipes logistiques',
      h1: 'Préparez des dossiers de classification douanière vérifiables pour vos clients.',
      chapeau: 'Cleo prépare les codes candidats, les questions à renvoyer au client, les notes tarifaires, les règles d’interprétation et l’historique de chaque validation.',
      cta1: ['Voir un exemple de dossier', '63-api-douane-exemple-dossier.html'], cta2: ['Explorer l’API', `${PORTAIL}/docs/customs`],
      citation: { texte: '« Nous devons pouvoir expliquer au CBP comment nous sommes arrivés à un classement »', qui: 'un commissionnaire sur r/CustomsBroker, traduit de l’anglais', url: 'https://www.reddit.com/r/CustomsBroker/comments/1m9vdpx/are_custom_brokers_in_danger_of_being_replaced_by/' },
      etapes: ['Les descriptions des clients telles qu’elles arrivent : une ligne, un CSV, ou un lot avec un statut par ligne.', 'Les candidats avec les notes qui les fondent et ceux écartés, ou les questions à renvoyer.', 'Un relecteur nommé valide, la ligne se verrouille, le dossier et les lignes validées s’exportent.'],
      exempleTitre: 'Un code candidat, avec la note qui le fonde', exempleIntro: 'Un T-shirt homme en coton, en maille, déclaré en France.',
      exempleSuite: 'Aussi pesé : 6104 22 00, écarté. Votre relecteur valide, demande des modifications ou rejette ; la décision est nommée, datée et verrouillée, et seules les lignes validées s’exportent.',
      livre: [
        'Les codes candidats, avec les notes tarifaires et les règles d’interprétation qui les fondent.',
        'Les alternatives pesées et écartées, à côté du code proposé.',
        'Un dossier JSON ou PDF à transmettre à un client ou à un transporteur, conservé 400 jours.',
        'Une validation humaine : un relecteur nommé valide, et la décision est datée et verrouillée.',
      ],
      controlePremier: 'Réservation, suivi et dépôt restent dans vos propres outils. Cleo prépare le classement et n’agit ni comme transitaire, ni comme commissionnaire, ni comme importateur.',
      faq: [
        { q: 'Qui porte la décision ?', a: 'Votre équipe. Cleo est un copilote : il propose des candidats avec leurs sources, un relecteur nommé valide, et chaque décision reste dans l’historique.' },
        { q: 'Que puis-je transmettre à un client ou à un transporteur ?', a: 'Un dossier JSON ou PDF avec le code, les notes et les sources, et son état de validation, conservé 400 jours ; ou un CSV des seules lignes validées.' },
        { q: 'Quelles décisions de classement sont disponibles ?', a: 'Cleo fournit les notes tarifaires et les règles d’interprétation disponibles. La couverture des décisions de classement reste limitée et doit être complétée par la recherche du professionnel.' },
      ],
      sansFaqFinal: true,
      finalCta: ['Tester Cleo sur un dossier déjà classé', 'mailto:hello@cleolabs.co?subject=' + encodeURIComponent('Pilote Cleo : dossier déjà classé')],
    },
  },
}

/* ── La requête et la réponse de la capture France (96745a0f…), pour la page développeurs ── */
const REQUETE_FR = { item_id: 'SKU-TS-FR', description: 'Men\'s knitted cotton T-shirt', country: 'FR', system: 'cn8',
  facts: { material: 'cotton', process: 'knitted', composition: [{ material: 'cotton', percent: 100 }], audience: 'men' } }
const CURL = `curl -X POST ${API}/v2/customs/classifications \\
  -H "Authorization: Bearer $CLEO_API_KEY" -H "Content-Type: application/json" \\
  -d @- &lt;&lt;'JSON'
{ "item_id": "SKU-TS-FR", "country": "FR", "system": "cn8",
  "description": "Men's knitted cotton T-shirt",
  "facts": { "material": "cotton", "process": "knitted", "audience": "men",
    "composition": [{ "material": "cotton", "percent": 100 }] } }
JSON`
const ech = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function exemple(ex, L) {
  if (ex === 'us') return { niveau: L.niveau6, code: '6109 10', titre: L.titre6109, sources: [L.note1], statutPret: true }
  /* EU line title is only « Of cotton » / « de coton » (capture 96745a0f) ; the 6-digit heading title is the one the API
     returned for 6109 10 in the US capture (9d5bee8d), as PR #53 does. */
  const ligne = L === COMMUN.fr ? 'Ligne : « de coton »' : 'Line: “Of cotton”'
  return { niveau: L.niveau8, code: '6109 10 00', titre: `${L.titre6109}. ${ligne}`, sources: [L.noteAdd2, L.note1], statutPret: true }
}

function page(cle, langue) {
  const P = PUBLICS[cle], T = P[langue], L = COMMUN[langue], en = langue === 'en'
  const sfx = en ? '-en' : ''
  const x = exemple(P.exemple, L)
  const sources = `${L.source}${en ? ':' : ' :'} ${x.sources.map(s => `<a href="${EURLEX}">${s}</a>`).join(', ')} ${L.texteOfficiel}`
  const demo = `<div class="dg-demo" data-dg-demo data-etat="questions" role="group" aria-label="${L.demoLabel}">
        <dl class="dg-demo-requete"><div><dt>${L.produit}</dt><dd>T-shirt</dd></div><div><dt>${L.destination}</dt><dd>${L.usa}</dd></div></dl>
        <div class="dg-demo-corps" aria-live="polite">
          <div data-vue="questions">
            <p class="dg-statut">${ICONES.attente}<span><b>${L.aVerifier}</b> · ${L.troisQuestions}</span></p>
            <ol class="dg-questions">${L.questions.map(q => `<li>${q}</li>`).join('')}</ol>
            <button type="button" class="dg-cta-2" data-aller="faits">${L.repondre}</button>
          </div>
          <div data-vue="faits" hidden>
            <p class="dg-statut"><span><b>${L.vosReponses}</b></span></p>
            <dl class="dg-faits">${L.faits.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
            <button type="button" class="dg-cta-2" data-aller="reponse">${L.classer}</button>
          </div>
          <div data-vue="reponse" hidden>
            <p class="dg-statut dg-statut-pret">${ICONES.pret}<span><b>${L.pret}</b></span></p>
            <p class="dg-niveau">${L.niveau6}</p>
            <p class="dg-code">6109 10</p>
            <p class="dg-code-titre">${L.titre6109}</p>
            <p class="dg-source">${L.source}${en ? ':' : ' :'} <a href="${EURLEX}">${L.note1}</a> ${L.texteOfficiel}</p>
            <button type="button" class="dg-lien" data-aller="questions">${L.recommencer}</button>
          </div>
        </div>
        <div class="dg-demo-pied"><p>${L.capture}</p><a href="${PORTAIL}/playground?tab=classify">${L.live}</a></div>
      </div>`

  const carte = `<article class="dg-carte dg-reponse" aria-label="${en ? 'Example answer' : 'Exemple de réponse'}">
          <p class="dg-petit">${T.exempleIntro} ${L.captureDu}</p>
          <p class="dg-statut dg-statut-pret">${ICONES.pret}<span><b>${L.pret}</b></span></p>
          <p class="dg-niveau">${x.niveau}</p>
          <p class="dg-code">${x.code}</p>
          <p class="dg-code-titre">${x.titre}</p>
          <p class="dg-source">${sources}</p>${T.exempleSuite ? `
          <p class="dg-suite">${T.exempleSuite}</p>` : ''}
        </article>`
  const code = cle === 'dev' ? `
        <div class="dg-code-bloc">
          <p class="dg-petit">${L.requete}</p>
          <pre class="dg-pre"><code>${CURL}</code></pre>
          <details class="dg-plie">
            <summary>${L.reponseComplete}</summary>
            <pre class="dg-pre"><code>${ech(JSON.stringify({ status: 'classified', candidates: [
              { code: '61091000', system: 'cn8', title: { en: 'Of cotton', fr: 'de coton' }, confidence: 0.95, evidence: [{ kind: 'additional_note', ref: 'Chapter 61 Additional Note 2' }, { kind: 'chapter_note', ref: 'Chapter 61 Note 1' }] },
              { code: '61042200', system: 'cn8', title: { en: 'Of cotton', fr: 'de coton' }, confidence: 0.75, evidence: [{ kind: 'chapter_note', ref: 'Chapter 61 Note 9' }] },
            ] }, null, 2))}</code></pre>
            <p class="dg-petit">request_id 96745a0f-305f-4188-ba21-42edb7ebc449 · ${en ? 'top 2 of 5 candidates, evidence excerpts removed' : '2 premiers candidats sur 5, extraits de preuve retirés'}</p>
          </details>
        </div>` : ''

  const faq = [...T.faq, ...(T.sansFaqFinal ? [] : [T.faqFinal || L.faqFinal]), L.faqCout]
  /* JSON-LD de l'API (28/09/2026) : décrit ce que la page montre. Description = la meta de seo.json, offres = les trois
     cartes « Tarifs » ci-dessous (même objet L.plans), fournisseur = l'Organization du site par son @id. Pas de
     termsOfService : legaldata-public.cleolabs.co/terms dit encore « Full terms are being finalized » (relevé le 28/09). */
  const nomFichier = `${P.fichier}${sfx}.html`
  const webApi = {
    '@context': 'https://schema.org', '@type': 'WebAPI',
    name: en ? 'Customs Classification API' : 'API de classification douanière',
    description: SEO_JSON.pages[nomFichier].description,
    url: HOTE + CHEMINS_JSON.pages[nomFichier].chemin,
    provider: { '@id': SEO_JSON.entite['@id'] },
    documentation: `${PORTAIL}/docs/customs`,
    offers: L.plans.map(p => ({ '@type': 'Offer', name: p.nom, price: p.eur, priceCurrency: 'EUR', description: p.note, url: p.href,
      ...(p.mois ? { priceSpecification: { '@type': 'UnitPriceSpecification', price: p.eur, priceCurrency: 'EUR', unitCode: 'MON', unitText: en ? 'month' : 'mois' } } : {}) })),
  }
  const ldWebApi = `<script type="application/ld+json">${JSON.stringify(webApi).replace(/</g, '\\u003c')}</script>`
  const chev = '<svg class="chev" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'

  let h = `<!--NAV-->
<!-- ═══ CUSTOMS API, ${cle.toUpperCase()} (${langue}) ═══ généré par scripts/pages-api-douane.mjs, ne pas retoucher à la main.
     Source : PR cleo-legal-public#53, captures réelles du 28/09/2026. -->
<div class="dg">
<section class="dg-hero" id="haut">
  <div class="conteneur dg-hero-grille">
    <div class="dg-hero-texte">
      <p class="dg-surtitre">${T.surtitre}</p>
      <h1>${T.h1}</h1>
      <p class="dg-chapeau">${T.chapeau}</p>
      <div class="dg-actions"><a class="dg-cta"${T.cta1[1].endsWith('/signup') ? ' data-cta="signup"' : ''} href="${T.cta1[1]}">${T.cta1[0]}</a><a class="dg-cta-2" href="${T.cta2[1]}">${T.cta2[0]}</a></div>
      ${T.ctaNote ? `<p class="dg-petit dg-cta-note">${T.ctaNote}</p>
      ` : ''}<p class="dg-petit">${L.note}</p>
    </div>
    ${demo}
  </div>
</section>

<section class="dg-citation" aria-label="${en ? 'What buyers say' : 'Ce que disent les acheteurs'}">
  <div class="conteneur">
    <blockquote><p>${T.citation.texte} <a href="${T.citation.url}">${T.citation.qui}</a></p></blockquote>
  </div>
</section>

<section class="dg-section" id="comment">
  <div class="conteneur">
    <h2>${L.commentCaMarche}</h2>
    <ol class="dg-etapes">${L.etapes.map((t, i) => `
      <li class="dg-carte">${iconeEtape(i)}<h3>${i + 1}. ${t}</h3><p>${T.etapes[i]}</p></li>`).join('')}
    </ol>
  </div>
</section>
${T.garanties ? `
<section class="dg-garanties" id="garanties" aria-labelledby="garanties-titre">
  <div class="conteneur">
    <p class="dg-surtitre" id="garanties-titre">${T.garantiesTitre}</p>
    <ul class="dg-garanties-liste">${T.garanties.map(g => `<li>${ICONES.oui}<span>${g}</span></li>`).join('')}</ul>
    <p class="dg-petit"><a class="dg-lien-texte" href="${PORTAIL}/docs/customs#reliability">${T.garantiesLien}</a></p>
  </div>
</section>
` : ''}
<section class="dg-section dg-teinte" id="exemple">
  <div class="conteneur">
    <h2>${T.exempleTitre}</h2>
    <div class="dg-exemple${code ? ' dg-exemple-duo' : ''}">
        ${carte}${code}
    </div>
  </div>
</section>

<section class="dg-section" id="perimetre">
  <div class="conteneur dg-duo">
    <div class="dg-carte">
      <h2>${L.livre}</h2>
      <ul class="dg-puces">${T.livre.map(t => `<li>${ICONES.oui}<span>${t}</span></li>`).join('')}</ul>
    </div>
    <div class="dg-carte">
      <h2>${L.controle}</h2>
      <ul class="dg-puces">${[T.controlePremier, ...L.controleListe].map((t, i) => `<li>${ICONES.vous}<span>${t}${i === 2 ? ` <a href="${PORTAIL}/docs/customs#coverage">${L.voirListe}</a>` : ''}</span></li>`).join('')}</ul>
      <p class="dg-renvoi"><a href="${PORTAIL}/docs/customs#not-yet">${L.listeComplete}</a></p>
    </div>
  </div>
</section>

<section class="dg-section dg-teinte" id="tarifs">
  <div class="conteneur">
    <h2>${L.tarifs}</h2>
    <div class="dg-plans">${L.plans.map(p => `
      <article class="dg-carte dg-plan">
        <h3>${p.nom}</h3>
        <p class="dg-prix">${p.prix}${p.mois ? ` <small>${p.mois}</small>` : ''}</p>
        <p class="dg-petit">${p.note}</p>
        <p class="dg-debit">${p.debit}</p>
        <a class="${p.principal ? 'dg-cta' : 'dg-cta-2'}"${p.principal ? ' data-cta="signup"' : ''} href="${p.href}">${p.cta}</a>
      </article>`).join('')}
    </div>
    <div class="dg-entreprise"><p>${L.entreprise}</p><a class="dg-cta-2" href="${MAIL}">${L.nousEcrire}</a><a class="dg-lien-texte" href="${PORTAIL}/pricing">${L.poids}</a></div>
  </div>
</section>

<section class="dg-section" id="questions">
  <div class="conteneur">
    <h2>${L.faqTitre}</h2>
    <div class="dg-faq" data-schema="faq">${faq.slice(0, 4).map(f => `
      <details>
        <summary>${f.q}${chev}</summary>
        <div class="reponse">${f.a}</div>
      </details>`).join('')}
    </div>
  </div>
</section>

<section class="dg-section dg-teinte dg-final" id="commencer">
  <div class="conteneur">
    <h2>${L.final}</h2>
    <div class="dg-actions">${T.finalCta
      ? `<a class="dg-cta" href="${T.finalCta[1]}">${T.finalCta[0]}</a><a class="dg-cta-2" data-cta="signup" href="${PORTAIL}/signup">${L.cta}</a>`
      : `<a class="dg-cta" data-cta="signup" href="${PORTAIL}/signup">${L.cta}</a><a class="dg-cta-2" href="${MAIL}">${L.ingenieur}</a>`}</div>
    <p class="dg-petit dg-avertissement">${L.avertissement}</p>
  </div>
</section>
</div>
<script>
(function(){
  var d = document.querySelector('[data-dg-demo]'); if (!d) return;
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-aller]'); if (!b) return;
    var etat = b.getAttribute('data-aller');
    d.setAttribute('data-etat', etat);
    [].forEach.call(d.querySelectorAll('[data-vue]'), function (v) { v.hidden = v.getAttribute('data-vue') !== etat });
    var suite = d.querySelector('[data-vue="' + etat + '"] button'); if (suite) suite.focus({ preventScroll: true });
  });
})();
</script>
${ldWebApi}
<!--PIED-->
`
  if (!en) h = fr(h.replace(/<(script|pre)[\s\S]*?<\/\1>/g, m => m.replace(/ /g, '\u0001'))).replace(/\u0001/g, ' ')
  return h
}

/* ── L'EXEMPLE DE DOSSIER (commissionnaires), 28/09/2026 ──
   Le bouton « Voir un exemple de dossier » ouvre un vrai dossier, pas la doc. Source : la capture du 25/09/2026,
   GET /v2/customs/classifications/{id}/dossier (scripts/captures/2026-09-25-dossier-fr.json), et son PDF tel que
   capturé, jamais retouché (commun/documents/customs-dossier-example-2026-09-25.pdf, copié dans sortie/documents/).
   Aucun appel réseau. L'identifiant de classification est remplacé par « example » sur la page HTML seulement.
   Les textes renvoyés par l'API (description, justifications, question, avertissement) sont servis tels quels ;
   seuls les libellés de la page sont traduits. Pompe hydraulique à engrenages, FR, needs_information, 5 candidats cn8. */
const DOSSIER = JSON.parse(fs.readFileSync(path.join(ICI, 'scripts/captures/2026-09-25-dossier-fr.json'), 'utf8'))
const PDF_DOSSIER = '/documents/customs-dossier-example-2026-09-25.pdf'
const PDF_KO = Math.max(1, Math.round(fs.statSync(path.join(ICI, 'commun/documents/customs-dossier-example-2026-09-25.pdf')).size / 1024))
const codeLisible = c => String(c).replace(/^(\d{4})(\d{2})(\d{2})$/, '$1 $2 $3')

function pageDossier(langue) {
  const en = langue === 'en', D = DOSSIER.response.data, it = D.item
  const T = en ? {
    surtitre: 'Customs API · sample dossier',
    h1: 'A real customs classification dossier, as the API returns it',
    chapeau: 'A hydraulic gear pump for agricultural tractors, declared into France. Cleo retained no code yet: it lists the candidates it weighed, with the chapter note behind them, and asks the one question that decides the heading.',
    etiquette: 'Real API output, captured 25 September 2026',
    pdf: 'Download the PDF dossier', pdfNote: `PDF, ${PDF_KO} KB, exactly as the API rendered it. It shows the real classification id.`,
    docs: 'How dossiers work',
    avantRevue: 'This dossier predates the review workflow, so it has no review block.',
    avantRevueSuite: 'A reviewed dossier also shows its review state: approved, rejected or changes requested, the approved code and when it was approved. Each decision names its reviewer in the review history.',
    voirRevue: 'What a review adds', produit: 'The product', idCl: 'Classification id', idArticle: 'Item id', desc: 'Description, as sent',
    dest: 'Destination', france: 'France (EU CN, 8 digits)', cree: 'Created', creeVal: '25 September 2026, 10:50 UTC', requete: 'Request',
    faits: 'Facts sent', faitsNoms: { material: 'Material', use: 'Use', process: 'Process' },
    statut: 'Status', statutVal: 'Needs information', codeRetenu: 'No code retained',
    ouverte: 'The question still open', manque: 'Missing fact', pourquoi: 'Why it matters', departage: 'Decides',
    langueQ: 'Returned in French, because the request asked for lang "fr".',
    traduction: 'Translation: What is the machine’s function (e.g. pumping liquids, compressing a gas, producing mechanical power, cutting or shaping a material, refrigerating)?',
    candidats: 'Candidates considered', candidatsIntro: 'Five codes, in the order the API returned them. None is retained until the open question is answered.',
    confiance: 'Confidence', justif: 'Rationale', preuve: 'Evidence', extrait: 'Read the excerpt', sansPreuve: 'No evidence attached, as returned.',
    texteOfficiel: '(official text)', versions: 'Tariff data versions', sources: 'Sources and licences', aucune: 'None recorded in this capture.',
    avert: 'Disclaimer, as returned', retour: 'Back to Customs API for brokers', final: 'Get the same dossier on your own products.',
    virgule: n => String(n),
  } : {
    surtitre: 'API douane · exemple de dossier',
    h1: 'Un vrai dossier de classification douanière, tel que l’API le renvoie',
    chapeau: 'Une pompe hydraulique à engrenages pour tracteurs agricoles, déclarée en France. Cleo n’a encore retenu aucun code : il liste les candidats pesés, avec la note de chapitre qui les fonde, et pose la seule question qui tranche la position.',
    etiquette: 'Sortie réelle de l’API, capturée le 25 septembre 2026',
    pdf: 'Télécharger le dossier PDF', pdfNote: `PDF, ${PDF_KO} Ko, tel que l’API l’a produit. Il porte le vrai identifiant de classification.`,
    docs: 'Comment fonctionnent les dossiers',
    avantRevue: 'Ce dossier précède le circuit de validation : il n’a donc pas de bloc de validation.',
    avantRevueSuite: 'Un dossier validé montre aussi son état de validation : approuvé, rejeté ou modifications demandées, le code approuvé et sa date d’approbation. Chaque décision nomme son relecteur dans l’historique des validations.',
    voirRevue: 'Ce qu’ajoute une validation', produit: 'Le produit', idCl: 'Identifiant de classification', idArticle: 'Identifiant article', desc: 'Description, telle qu’envoyée',
    dest: 'Destination', france: 'France (NC de l’UE, 8 chiffres)', cree: 'Créé le', creeVal: '25 septembre 2026, 10 h 50 UTC', requete: 'Requête',
    faits: 'Faits envoyés', faitsNoms: { material: 'Matière', use: 'Usage', process: 'Procédé' },
    statut: 'Statut', statutVal: 'Informations manquantes', codeRetenu: 'Aucun code retenu',
    ouverte: 'La question encore ouverte', manque: 'Fait manquant', pourquoi: 'Pourquoi il compte', departage: 'Tranche',
    langueQ: 'Renvoyée en français, car la requête demandait lang « fr ».',
    traduction: '',
    candidats: 'Les candidats pesés', candidatsIntro: 'Cinq codes, dans l’ordre où l’API les a renvoyés. Aucun n’est retenu tant que la question ouverte n’a pas de réponse. Justifications en anglais, telles que renvoyées.',
    confiance: 'Confiance', justif: 'Justification', preuve: 'Preuve', extrait: 'Lire l’extrait', sansPreuve: 'Aucune preuve jointe, tel que renvoyé.',
    texteOfficiel: '(texte officiel)', versions: 'Versions des données tarifaires', sources: 'Sources et licences', aucune: 'Aucune enregistrée dans cette capture.',
    avert: 'Avertissement, tel que renvoyé', retour: 'Retour à l’API douane pour les commissionnaires', final: 'Obtenez le même dossier sur vos propres produits.',
    virgule: n => String(n).replace('.', ','),
  }
  const L = COMMUN[langue]
  const q = it.questions[0]
  const faits = Object.entries(D.query_facts).map(([k, v]) => `<div><dt>${T.faitsNoms[k] || ech(k)}</dt><dd>${ech(v)}</dd></div>`).join('')
  const candidat = c => {
    const preuves = Array.isArray(c.evidence) ? c.evidence.map(e => `
            <p class="dg-source">${T.preuve}${en ? ':' : ' :'} <a href="${ech(e.url)}">${ech(e.ref)}</a> ${T.texteOfficiel} · ${ech(e.kind)} · ${ech(e.source_version)}</p>
            <details class="dg-extrait"><summary>${T.extrait}</summary><blockquote><p>${ech(e.excerpt)}</p></blockquote></details>`).join('')
      : `
            <p class="dg-source">${T.sansPreuve}</p>`
    return `
          <li class="dg-carte dg-candidat">
            <p class="dg-niveau">${ech(c.system)} · ${ech(c.country)} · ${T.confiance} ${T.virgule(c.confidence)}</p>
            <p class="dg-code">${codeLisible(c.code)}</p>
            <p class="dg-code-titre">${ech(c.title[langue] || c.title.en)}</p>
            <p class="dg-justif"><b>${T.justif}.</b> ${ech(c.rationale)}</p>${preuves}
          </li>`
  }
  let h = `<!--NAV-->
<!-- ═══ CUSTOMS API, EXEMPLE DE DOSSIER (${langue}) ═══ généré par scripts/pages-api-douane.mjs, ne pas retoucher à la main.
     Source : capture du 25/09/2026, scripts/captures/2026-09-25-dossier-fr.json. -->
<div class="dg dg-dossier">
<section class="dg-hero" id="haut">
  <div class="conteneur">
    <p class="dg-surtitre">${T.surtitre}</p>
    <h1>${T.h1}</h1>
    <p class="dg-chapeau">${T.chapeau}</p>
    <p class="dg-etiquette">${T.etiquette}</p>
    <div class="dg-actions"><a class="dg-cta" href="${PDF_DOSSIER}" type="application/pdf">${T.pdf}</a><a class="dg-cta-2" href="${PORTAIL}/docs/customs#dossier">${T.docs}</a></div>
    <p class="dg-petit">${T.pdfNote}</p>
  </div>
</section>

<section class="dg-citation dg-avant-revue" aria-label="${T.voirRevue}">
  <div class="conteneur">
    <p><b>${T.avantRevue}</b> ${T.avantRevueSuite} <a href="${PORTAIL}/docs/customs#review">${T.voirRevue}</a></p>
  </div>
</section>

<section class="dg-section" id="produit">
  <div class="conteneur dg-duo">
    <div class="dg-carte">
      <h2>${T.produit}</h2>
      <dl class="dg-faits">
        <div><dt>${T.idCl}</dt><dd>example</dd></div>
        <div><dt>${T.idArticle}</dt><dd>${ech(D.item_id)}</dd></div>
        <div><dt>${T.dest}</dt><dd>${T.france}</dd></div>
        <div><dt>${T.cree}</dt><dd>${T.creeVal}</dd></div>
      </dl>
      <p class="dg-petit dg-desc-titre">${T.desc}</p>
      <p class="dg-desc" lang="fr">${ech(D.description)}</p>
      <p class="dg-petit dg-desc-titre">${T.requete}</p>
      <pre class="dg-pre"><code>${ech(DOSSIER.request.method)} /v2/customs/classifications/example/dossier</code></pre>
    </div>
    <div class="dg-carte">
      <h2>${T.faits}</h2>
      <dl class="dg-faits">${faits}</dl>
      <p class="dg-statut dg-statut-dossier">${ICONES.attente}<span><b>${T.statut}${en ? ':' : ' :'} ${T.statutVal}</b> · <code>${ech(it.status)}</code> · ${T.codeRetenu}</span></p>
    </div>
  </div>
</section>

<section class="dg-section dg-teinte" id="question">
  <div class="conteneur">
    <h2>${T.ouverte}</h2>
    <div class="dg-carte dg-question">
      <p class="dg-question-texte" lang="fr">${ech(q.question)}</p>
      <p class="dg-petit">${T.langueQ}</p>${T.traduction ? `
      <p class="dg-traduction">${T.traduction}</p>` : ''}
      <dl class="dg-faits">
        <div><dt>${T.manque}</dt><dd><code>${ech(q.fact)}</code></dd></div>
        <div><dt>${T.departage}</dt><dd><code>${ech(q.discriminates)}</code></dd></div>
      </dl>
      <p class="dg-justif"><b>${T.pourquoi}.</b> <span lang="en">${ech(q.why)}</span></p>
    </div>
  </div>
</section>

<section class="dg-section" id="candidats">
  <div class="conteneur">
    <h2>${T.candidats}</h2>
    <p class="dg-intro">${T.candidatsIntro}</p>
    <ol class="dg-candidats">${it.considered_candidates.map(candidat).join('')}
    </ol>
  </div>
</section>

<section class="dg-section dg-teinte" id="traces">
  <div class="conteneur dg-duo">
    <div class="dg-carte">
      <h2>${T.versions}</h2>
      <p class="dg-petit">${D.dataset_versions.length ? ech(JSON.stringify(D.dataset_versions)) : T.aucune}</p>
      <h2 class="dg-h2-suite">${T.sources}</h2>
      <p class="dg-petit">${D.sources_and_licences.length ? ech(JSON.stringify(D.sources_and_licences)) : T.aucune}</p>
    </div>
    <div class="dg-carte">
      <h2>${T.avert}</h2>
      <p class="dg-petit" lang="en">${ech(D.advisory_disclaimer)}</p>
    </div>
  </div>
</section>

<section class="dg-section dg-final" id="commencer">
  <div class="conteneur">
    <h2>${T.final}</h2>
    <div class="dg-actions"><a class="dg-cta" data-cta="signup" href="${PORTAIL}/signup">${L.cta}</a><a class="dg-cta-2" href="${PUBLICS.brokers.fichier}${en ? '-en' : ''}.html">${T.retour}</a></div>
    <p class="dg-petit dg-avertissement">${L.avertissement}</p>
  </div>
</section>
</div>
<!--PIED-->
`
  if (!en) h = fr(h.replace(/<(script|pre)[\s\S]*?<\/\1>/g, m => m.replace(/ /g, '\u0001'))).replace(/\u0001/g, ' ')
  return h
}
for (const langue of ['fr', 'en']) {
  const nom = `63-api-douane-exemple-dossier${langue === 'en' ? '-en' : ''}.html`
  fs.writeFileSync(path.join(ICI, 'pages', nom), pageDossier(langue))
  console.log('  écrit pages/' + nom)
}

for (const cle of Object.keys(PUBLICS)) for (const langue of ['fr', 'en']) {
  const nom = `${PUBLICS[cle].fichier}${langue === 'en' ? '-en' : ''}.html`
  fs.writeFileSync(path.join(ICI, 'pages', nom), page(cle, langue))
  console.log('  écrit pages/' + nom)
}
