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
   Citations Reddit : les trois de la PR, mot pour mot en anglais ; traduites sur les pages FR, et dites traduites.
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
/* Typographie française : espace insécable avant ? ! : ; % € et dans les guillemets. */
const fr = s => s.replace(/ ([?!:;%€»])/g, ' $1').replace(/« /g, '« ').replace(/(\d) (\d{3})\b/g, '$1 $2')

const ICONES = {
  oui: '<svg class="dg-marque" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  non: '<svg class="dg-marque" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>',
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
    pasUnMoteur: 'Not another HS search box', neFaitPas: 'What it doesn’t do', listeComplete: 'Full list in the docs', voirListe: 'See the list',
    oui: [
      'Not a free lookup box: it asks for the facts a code depends on.',
      'Never one code with an opaque score: the candidates, why, and the official source.',
      'A precise coverage list, not a vague promise: 112 of 249 territories at the national line.',
      'It talks to your systems (API, batches, Shopify or CSV, webhooks, MCP) instead of adding a dashboard.',
    ],
    non: [
      'No customs ruling: only a customs authority issues one.',
      '137 of 249 territories answer at 6 digits only. In the US, the digits past 6 for an entry are set with a licensed customs broker.',
      'The cost can be marked partial: a missing duty is named, never guessed.',
    ],
    tarifs: 'Start free. Pay monthly for volume.',
    plans: [
      { nom: 'Sandbox', prix: '€0', note: '200 units, lifetime · no card', debit: 'All endpoints', cta: 'Get an API key', href: `${PORTAIL}/signup`, principal: true },
      { nom: 'Starter', prix: '€100', mois: '/ month', note: 'Or €80/mo billed yearly · cancel anytime', debit: '100,000 units / month · 60 requests / minute', cta: 'Choose Starter', href: `${PORTAIL}/buy/starter?cadence=monthly` },
      { nom: 'Pro', prix: '€349', mois: '/ month', note: 'Or €279/mo billed yearly · cancel anytime', debit: '1,000,000 units / month · 300 requests / minute', cta: 'Choose Pro', href: `${PORTAIL}/buy/pro?cadence=monthly` },
    ],
    entreprise: 'Enterprise volume or terms?', nousEcrire: 'Talk to us', poids: 'See request weight',
    faqTitre: 'Questions',
    faqFinal: { q: 'Is the code final?', a: 'No. It is a candidate with its sources, for your review. The importer, or the broker acting for them, decides what is declared.' },
    faqCout: { q: 'What does a call cost?', a: 'One classification costs 1 unit, plus 1 per part of a kit. The Sandbox gives 200 units, no card.' },
    final: 'Try it on one product from your catalog.', ingenieur: 'Talk to a customs engineer',
    avertissement: 'These suggestions are informational only. Final customs classification, export licensing and product certification must be validated by a licensed broker or competent authority. Misclassification or missed dual-use controls carry legal liability.',
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
    pasUnMoteur: 'Pas un moteur de recherche de codes SH de plus', neFaitPas: 'Ce qu’elle ne fait pas', listeComplete: 'La liste complète dans la documentation', voirListe: 'Voir la liste',
    oui: [
      'Pas une recherche gratuite de plus : elle demande les faits dont dépend le code.',
      'Jamais un code seul avec un score opaque : les candidats, leurs raisons et la source officielle.',
      'Une liste de couverture précise, pas une promesse vague : 112 territoires sur 249 à la ligne nationale.',
      'Elle parle à vos systèmes (API, lots, Shopify ou CSV, webhooks, MCP) au lieu d’ajouter un tableau de bord.',
    ],
    non: [
      'Aucune décision douanière : seule une autorité douanière en rend une.',
      '137 territoires sur 249 répondent à 6 chiffres seulement. Aux États-Unis, les chiffres au-delà du sixième se fixent avec un commissionnaire en douane agréé.',
      'Le coût peut être marqué partiel : un droit manquant est nommé, jamais deviné.',
    ],
    tarifs: 'Commencez gratuitement. Payez au mois pour le volume.',
    plans: [
      { nom: 'Sandbox', prix: '0 €', note: '200 unités, à vie · sans carte', debit: 'Tous les endpoints', cta: 'Obtenir une clé API', href: `${PORTAIL}/signup`, principal: true },
      { nom: 'Starter', prix: '100 €', mois: 'par mois', note: 'Ou 80 € par mois facturé à l’année · résiliable à tout moment', debit: '100 000 unités par mois · 60 requêtes par minute', cta: 'Choisir Starter', href: `${PORTAIL}/buy/starter?cadence=monthly` },
      { nom: 'Pro', prix: '349 €', mois: 'par mois', note: 'Ou 279 € par mois facturé à l’année · résiliable à tout moment', debit: '1 000 000 unités par mois · 300 requêtes par minute', cta: 'Choisir Pro', href: `${PORTAIL}/buy/pro?cadence=monthly` },
    ],
    entreprise: 'Un volume ou des conditions Enterprise ?', nousEcrire: 'Nous écrire', poids: 'Voir le poids des requêtes',
    faqTitre: 'Questions',
    faqFinal: { q: 'Le code est-il définitif ?', a: 'Non. C’est un candidat avec ses sources, à valider. L’importateur, ou le commissionnaire qui agit pour lui, décide de ce qui est déclaré.' },
    faqCout: { q: 'Combien coûte un appel ?', a: 'Un classement coûte 1 unité, plus 1 par élément d’un kit. Le Sandbox donne 200 unités, sans carte.' },
    final: 'Essayez-la sur un produit de votre catalogue.', ingenieur: 'Parler à un ingénieur douane',
    avertissement: 'Ces suggestions sont données à titre d’information. Le classement douanier final, les licences d’exportation et la certification des produits doivent être validés par un commissionnaire agréé ou une autorité compétente. Une erreur de classement ou un contrôle de double usage manqué engage la responsabilité juridique.',
    reponseComplete: 'Voir la réponse complète', requete: 'La requête, telle qu’envoyée',
  },
}

/* ── Les trois publics ── */
const PUBLICS = {
  dev: {
    fichier: '60-api-douane', exemple: 'fr',
    en: {
      surtitre: 'For ERP, TMS, e-commerce and brokerage software teams',
      h1: 'Build customs classification into your product without maintaining tariff schedules.',
      chapeau: 'Send product facts, destination and date. Cleo returns the available HS or national code, missing questions, sources and review status through one API.',
      cta1: ['Get an API key', `${PORTAIL}/signup`], cta2: ['Read the documentation', `${PORTAIL}/docs/customs`],
      citation: { texte: '“what is the equivalent HTS for Brazil, Russia, China”', qui: 'a user on r/CustomsBroker', url: 'https://www.reddit.com/r/CustomsBroker/comments/zy9seo/world_tariff/' },
      etapes: ['One item or a batch of 2,000, by REST, TypeScript SDK or MCP.', 'The level each country serves, and questions instead of guesses, with sources.', 'Approved codes write back, and any code can be re-checked on a date.'],
      exempleTitre: 'One answer your product can show', exempleIntro: 'A men’s knitted cotton T-shirt sent to France.',
      nonPremier: 'Not your users’ customs broker or importer of record. It files nothing.',
      faq: [
        { q: 'Is it predictable to integrate?', a: 'Every response carries a request id to quote to support. Batches report an error per line, a retry with the same idempotency key within 24 hours never runs twice, and webhooks are signed.' },
        { q: 'Which countries?', a: '112 of 249 territories answer at the national tariff line, the rest at 6 digits. Each answer says which level it used.' },
      ],
    },
    fr: {
      surtitre: 'Pour les équipes logicielles ERP, TMS, e-commerce et douane',
      h1: 'Intégrez la classification douanière à votre produit, sans maintenir les tarifs douaniers.',
      chapeau: 'Envoyez les faits produit, la destination et la date. Cleo renvoie, par une seule API, le code SH ou national disponible, les questions manquantes, les sources et le statut de validation.',
      cta1: ['Obtenir une clé API', `${PORTAIL}/signup`], cta2: ['Lire la documentation', `${PORTAIL}/docs/customs`],
      citation: { texte: '« quel est l’équivalent HTS pour le Brésil, la Russie, la Chine »', qui: 'un utilisateur de r/CustomsBroker, traduit de l’anglais', url: 'https://www.reddit.com/r/CustomsBroker/comments/zy9seo/world_tariff/' },
      etapes: ['Un article ou un lot de 2 000, par REST, SDK TypeScript ou MCP.', 'Le niveau que sert chaque pays, et des questions plutôt que des suppositions, avec les sources.', 'Les codes validés reviennent dans vos systèmes, et tout code se revérifie à une date donnée.'],
      exempleTitre: 'Une réponse que votre produit peut afficher', exempleIntro: 'Un T-shirt homme en coton, en maille, envoyé en France.',
      nonPremier: 'Ni le commissionnaire en douane ni l’importateur de vos utilisateurs. Elle ne dépose rien.',
      faq: [
        { q: 'L’intégration est-elle prévisible ?', a: 'Chaque réponse porte un identifiant de requête à citer au support. Les lots signalent une erreur par ligne, une nouvelle tentative avec la même clé d’idempotence dans les 24 heures ne s’exécute jamais deux fois, et les webhooks sont signés.' },
        { q: 'Quels pays ?', a: '112 territoires sur 249 répondent à la ligne tarifaire nationale, les autres à 6 chiffres. Chaque réponse indique le niveau utilisé.' },
      ],
    },
  },
  ecommerce: {
    fichier: '61-api-douane-ecommerce', exemple: 'us',
    en: {
      surtitre: 'For Shopify and e-commerce teams',
      h1: 'Put approved customs data on every product before it ships.',
      chapeau: 'Cleo asks for missing product facts, classifies catalogs in bulk, maps codes to each destination and writes back only approved classifications.',
      cta1: ['Classify a product', `${PORTAIL}/playground?tab=classify`], cta2: ['See the Shopify workflow', `${PORTAIL}/docs/customs#connectors`],
      citation: { texte: '“Shopify is still collecting duty on products that should be duty-free”', qui: 'a merchant on r/shopify', url: 'https://www.reddit.com/r/shopify/comments/1nm0puv/is_shopify_applying_usmca_exemptions_when/' },
      etapes: ['Your whole catalog, from a Shopify pull or a CSV.', 'A vague title gets questions for your supplier, not a guessed code.', 'Only codes you approve go back, and a different existing code is never overwritten.'],
      exempleTitre: 'The same “T-shirt”, once you answer', exempleIntro: 'Knitted, all cotton, for men, shipped to the United States.',
      exempleSuite: 'Approve it and it goes back to Shopify or your CSV. For a US entry, the full 10-digit line is set with your licensed customs broker.',
      nonPremier: 'Not your customs broker or importer of record. It files nothing.',
      faq: [
        { q: 'Will the duty at checkout be right?', a: 'The cost lists the parts it includes and names the parts it could not price. The carrier’s final bill and your checkout settings stay outside the API.' },
        { q: 'Does it change my Shopify products?', a: 'Only when you run the write-back, only with codes you approved, and never over a different code already there.' },
      ],
    },
    fr: {
      surtitre: 'Pour les équipes Shopify et e-commerce',
      h1: 'Mettez des données douanières validées sur chaque produit avant son expédition.',
      chapeau: 'Cleo demande les faits produit manquants, classe les catalogues en masse, associe les codes à chaque destination et ne renvoie que les classements validés.',
      cta1: ['Classer un produit', `${PORTAIL}/playground?tab=classify`], cta2: ['Voir le flux Shopify', `${PORTAIL}/docs/customs#connectors`],
      citation: { texte: '« Shopify perçoit encore des droits sur des produits qui devraient en être exonérés »', qui: 'un marchand sur r/shopify, traduit de l’anglais', url: 'https://www.reddit.com/r/shopify/comments/1nm0puv/is_shopify_applying_usmca_exemptions_when/' },
      etapes: ['Tout votre catalogue, importé de Shopify ou d’un CSV.', 'Un titre vague reçoit des questions pour votre fournisseur, pas un code deviné.', 'Seuls les codes que vous validez repartent, et un autre code déjà en place n’est jamais écrasé.'],
      exempleTitre: 'Le même « T-shirt », une fois vos réponses données', exempleIntro: 'En maille, tout coton, pour homme, expédié aux États-Unis.',
      exempleSuite: 'Validez-le et il repart vers Shopify ou votre CSV. Pour une entrée aux États-Unis, la ligne complète à 10 chiffres se fixe avec votre commissionnaire en douane agréé.',
      nonPremier: 'Ni votre commissionnaire en douane ni votre importateur. Elle ne dépose rien.',
      faq: [
        { q: 'Les droits affichés au paiement seront-ils justes ?', a: 'Le coût liste ce qu’il inclut et nomme ce qu’il n’a pas pu chiffrer. La facture finale du transporteur et vos réglages de paiement restent hors de l’API.' },
        { q: 'Modifie-t-elle mes produits Shopify ?', a: 'Seulement quand vous lancez le renvoi, seulement avec les codes validés, et jamais par-dessus un autre code déjà en place.' },
      ],
    },
  },
  brokers: {
    fichier: '62-api-douane-commissionnaires', exemple: 'fr',
    en: {
      surtitre: 'For customs brokers, 3PLs and logistics teams',
      h1: 'Turn incomplete product data into a classification dossier your team can review.',
      chapeau: 'Cleo returns candidate codes, missing questions, tariff notes, interpretation rules and a complete approval history.',
      cta1: ['Review a sample dossier', `${PORTAIL}/docs/customs#dossier`], cta2: ['Explore the API', `${PORTAIL}/docs/customs`],
      citation: { texte: '“We have to be able to explain to CBP how we arrived at a classification”', qui: 'a broker on r/CustomsBroker', url: 'https://www.reddit.com/r/CustomsBroker/comments/1m9vdpx/are_custom_brokers_in_danger_of_being_replaced_by/' },
      etapes: ['Client descriptions as they come: one line, a CSV, or a batch with a status per line.', 'Candidates with the notes they rest on and the ones set aside, or the questions to send back.', 'A named reviewer approves, the line locks, the dossier and approved lines export.'],
      exempleTitre: 'A candidate code, with the note behind it', exempleIntro: 'A men’s knitted cotton T-shirt declared into France.',
      exempleSuite: 'Also weighed: 6104 22 00, set aside. Your reviewer approves, asks for changes or rejects; the decision is named, dated and locked, and only approved lines export.',
      nonPremier: 'Not a forwarding platform, broker or importer of record: no booking, tracking or filing.',
      faq: [
        { q: 'Who carries the decision?', a: 'Your team. Cleo is a copilot: it proposes candidates with sources, a named reviewer signs off, and every decision stays in the history.' },
        { q: 'What can I forward to a client or a carrier?', a: 'A JSON or PDF dossier with the code, the notes and sources, and its review state, kept 400 days; or a CSV of approved lines only.' },
      ],
    },
    fr: {
      surtitre: 'Pour les commissionnaires en douane, 3PL et équipes logistiques',
      h1: 'Transformez des données produit incomplètes en un dossier de classement que votre équipe peut vérifier.',
      chapeau: 'Cleo renvoie des codes candidats, les questions manquantes, les notes tarifaires, les règles d’interprétation et un historique de validation complet.',
      cta1: ['Voir un exemple de dossier', `${PORTAIL}/docs/customs#dossier`], cta2: ['Explorer l’API', `${PORTAIL}/docs/customs`],
      citation: { texte: '« Nous devons pouvoir expliquer au CBP comment nous sommes arrivés à un classement »', qui: 'un commissionnaire sur r/CustomsBroker, traduit de l’anglais', url: 'https://www.reddit.com/r/CustomsBroker/comments/1m9vdpx/are_custom_brokers_in_danger_of_being_replaced_by/' },
      etapes: ['Les descriptions des clients telles qu’elles arrivent : une ligne, un CSV, ou un lot avec un statut par ligne.', 'Les candidats avec les notes qui les fondent et ceux écartés, ou les questions à renvoyer.', 'Un relecteur nommé valide, la ligne se verrouille, le dossier et les lignes validées s’exportent.'],
      exempleTitre: 'Un code candidat, avec la note qui le fonde', exempleIntro: 'Un T-shirt homme en coton, en maille, déclaré en France.',
      exempleSuite: 'Aussi pesé : 6104 22 00, écarté. Votre relecteur valide, demande des modifications ou rejette ; la décision est nommée, datée et verrouillée, et seules les lignes validées s’exportent.',
      nonPremier: 'Ni une plateforme de transit, ni un commissionnaire, ni un importateur : aucune réservation, aucun suivi, aucun dépôt.',
      faq: [
        { q: 'Qui porte la décision ?', a: 'Votre équipe. Cleo est un copilote : il propose des candidats avec leurs sources, un relecteur nommé valide, et chaque décision reste dans l’historique.' },
        { q: 'Que puis-je transmettre à un client ou à un transporteur ?', a: 'Un dossier JSON ou PDF avec le code, les notes et les sources, et son état de validation, conservé 400 jours ; ou un CSV des seules lignes validées.' },
      ],
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

  const faq = [...T.faq, L.faqFinal, L.faqCout]
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
      <p class="dg-petit">${L.note}</p>
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
      <h2>${L.pasUnMoteur}</h2>
      <ul class="dg-puces">${L.oui.map((t, i) => `<li>${ICONES.oui}<span>${t}${i === 2 ? ` <a href="${PORTAIL}/docs/customs#coverage">${L.voirListe}</a>` : ''}</span></li>`).join('')}</ul>
    </div>
    <div class="dg-carte">
      <h2>${L.neFaitPas}</h2>
      <ul class="dg-puces">${[T.nonPremier, ...L.non].map(t => `<li>${ICONES.non}<span>${t}</span></li>`).join('')}</ul>
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
    <div class="dg-actions"><a class="dg-cta" data-cta="signup" href="${PORTAIL}/signup">${L.cta}</a><a class="dg-cta-2" href="${MAIL}">${L.ingenieur}</a></div>
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
<!--PIED-->
`
  if (!en) h = fr(h.replace(/<(script|pre)[\s\S]*?<\/\1>/g, m => m.replace(/ /g, '\u0001'))).replace(/\u0001/g, ' ')
  return h
}

for (const cle of Object.keys(PUBLICS)) for (const langue of ['fr', 'en']) {
  const nom = `${PUBLICS[cle].fichier}${langue === 'en' ? '-en' : ''}.html`
  fs.writeFileSync(path.join(ICI, 'pages', nom), page(cle, langue))
  console.log('  écrit pages/' + nom)
}
