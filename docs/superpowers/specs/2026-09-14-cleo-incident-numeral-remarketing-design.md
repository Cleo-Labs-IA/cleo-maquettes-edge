# Cleo Incident Response, remarketing sur le modèle Numeral

Statut : design éditorial proposé, non implémenté

Référence de travail : dépôt `cleo-maquettes-edge`, branche `design/v6-trois-entrees`, base locale `799d024`

## Sources de conception

Le modèle commercial est relevé sur les pages officielles de Numeral : [accueil](https://www.numeral.com/), [tarifs](https://www.numeral.com/pricing), [registrations](https://www.numeral.com/product/registrations), [filings and remittance](https://www.numeral.com/product/filing-and-remittance), [garantie](https://www.numeral.com/legal/guarantee) et [programme partenaires](https://www.numeral.com/partner-program).

Les choix Cleo s'appuient sur les livrables de recherche suivants :

- [déconstruction du site Numeral](../../../../RecallDesk-analysis/post-crisis-workstreams/11-numeral-site-teardown.md) ;
- [limites de l'analogie](../../../../RecallDesk-analysis/post-crisis-workstreams/12-numeral-analogy-limits.md) ;
- [options de positionnement Cleo](../../../../RecallDesk-analysis/post-crisis-workstreams/13-numeral-to-cleo-options.md) ;
- [migration route par route de la V6](../../../../RecallDesk-analysis/post-crisis-workstreams/14-v6-to-incident-migration-map.md).

## Décision

Cleo adopte une seule catégorie commerciale : **Product Incident Response**.

Le site ne présente plus `Compliance as a Service`, `Data` et `Enterprise` comme trois offres équivalentes. Il présente un parcours unique :

1. un courrier d'autorité ou un incident entre dans Cleo ;
2. Cleo structure les faits, les demandes et les pièces ;
3. les agents préparent le travail ;
4. les équipes, experts et avocats valident les décisions engageantes ;
5. le dossier reste cohérent jusqu'à sa clôture.

Le parallèle avec Numeral porte sur l'architecture commerciale : un résultat simple en tête, un outil gratuit qui ouvre le dossier, une exécution facturée par unité de travail, une couche humaine visible et un plan Enterprise. Il ne porte ni sur une promesse d'autonomie juridique complète, ni sur une garantie de résultat réglementaire.

## Catégorie et promesse

### Nom de catégorie

**Product Incident Response**

Usage français dans le corps de page : **gestion des incidents produit**.

### Signature principale

**Incident produit, sous contrôle.**

### Promesse développée

> Dès qu'un défaut, une plainte grave ou un courrier d'autorité arrive, Cleo rassemble les faits, prépare les réponses et coordonne vos équipes, experts et avocats jusqu'à la clôture.

### Principe de confiance

> Les agents font avancer le dossier. Les experts et avocats valident ce qui engage.

### Ce que le site doit faire comprendre immédiatement

- Cleo intervient après le premier signal, pas seulement avant la mise sur le marché.
- Cleo fournit un espace de travail et une exécution, pas une bibliothèque de règles isolée.
- Le moteur réglementaire et les données alimentent chaque étape du dossier.
- Les humains habilités gardent les décisions juridiques, techniques et commerciales.
- Le client peut garder son cabinet d'avocats et ses experts habituels.

## Architecture de l'offre

| Niveau | Rôle commercial | Unité proposée | Statut avant publication |
|---|---|---|---|
| Décodeur de courrier | Entrée gratuite | Un courrier analysé | À construire et tester |
| Dossier incident | Produit principal | Un dossier activé | À construire et cadrer |
| Pack réponse autorité | Exécution spécialisée | Une autorité et un marché | Périmètre et tarif à valider |
| Pack action corrective | Exécution spécialisée | Une action corrective pilotée | Périmètre et tarif à valider |
| Pack clôture et recours | Extension | Un dossier de clôture ou de recours | Partenaires et périmètre à valider |
| Enterprise | Plan organisationnel | Environnement, intégrations et gouvernance | Sur devis |

La donnée réglementaire devient le moteur de ces offres. Elle reste accessible par API et serveur MCP pour les clients qui l'intègrent à leurs propres systèmes, mais elle ne concurrence plus la promesse principale sur l'accueil.

## Navigation cible

### Barre principale

- Produit
- Solutions
- Experts et partenaires
- Ressources
- Tarifs
- Connexion
- CTA : `Décrypter un courrier`

### Menu Produit

- `Dossier incident` : centraliser les faits, acteurs, décisions et preuves.
- `Réponses aux autorités` : relier chaque demande à une réponse et à une pièce.
- `Actions correctives et rappels` : coordonner périmètre, opérations et communications.
- `Clôture et recours` : conserver la preuve, préparer la clôture et les dossiers de recours.
- `Product Safety Engine` : données réglementaires, API et serveur MCP.

### Menu Solutions

- Fabricants
- Importateurs et distributeurs
- Retailers et marketplaces
- Équipes juridiques et conformité
- Opérations internationales

### Menu Experts et partenaires

- Travailler avec votre cabinet
- Experts techniques et laboratoires
- Devenir partenaire

## Accueil, copy deck complet

### Navigation

CTA principal : `Décrypter un courrier`

CTA secondaire dans le menu Produit : `Ouvrir un dossier incident`

### Hero

Surtitre :

> Product Incident Response

Titre :

> Incident produit, sous contrôle.

Chapeau :

> Dès qu'un défaut, une plainte grave ou un courrier d'autorité arrive, Cleo rassemble les faits, prépare les réponses et coordonne vos équipes, experts et avocats jusqu'à la clôture.

CTA principal :

> Décrypter un courrier d'autorité

CTA secondaire :

> Faire prendre en charge mon incident

Ligne de confiance :

> Les agents font avancer le dossier. Les experts et avocats valident ce qui engage.

Direction visuelle : conserver le champ profond V6. Remplacer le globe pré-crise par un dossier incident vivant. Le visuel montre un courrier entrant, une chronologie, les demandes extraites, les pièces associées et les validations humaines. Le mouvement doit rendre le passage du document dispersé au dossier structuré compréhensible sans texte supplémentaire.

### Preuve de marque

Titre :

> La technologie de conformité produit de Cleo, appliquée au moment où chaque fait compte.

Règle de publication : les logos et témoignages existants ne doivent jamais laisser entendre que les entreprises concernées utilisent déjà Cleo pour gérer des incidents ou des rappels. Tant qu'un cas incident n'est pas documenté et autorisé, la page qualifie précisément la preuve existante comme une preuve de conformité produit.

### Bloc catégorie

Surtitre :

> Expertise humaine. Exécution agentique.

Titre :

> Cleo prend en charge le dossier de bout en bout.

Introduction :

> Un incident produit traverse le juridique, la qualité, les opérations, le service client et la direction. Cleo leur donne un dossier commun, maintient les faits à jour et prépare le travail attendu à chaque étape.

Carte `Qualifier l'incident` :

> Importez le courrier, la plainte, le rapport de laboratoire ou le signal terrain. Cleo identifie le produit, les lots, les marchés, les acteurs et les informations encore manquantes.

Carte `Répondre aux autorités` :

> Cleo extrait chaque demande explicite, prépare la trame de réponse et relie chaque affirmation à sa source ou à sa pièce justificative.

Carte `Conduire l'action corrective` :

> Les équipes suivent le périmètre produit, les décisions, les responsables, les partenaires et les communications depuis le même dossier.

Carte `Clôturer et apprendre` :

> Cleo assemble l'historique validé, les preuves remises et les décisions prises pour la clôture, les recours et les futurs dossiers.

CTA :

> Voir comment Cleo gère un incident

### Décodeur gratuit

Surtitre :

> Commencer gratuitement

Titre :

> Un courrier d'autorité. Chaque demande, chaque pièce, chaque date explicite.

Chapeau :

> Déposez le courrier. Cleo structure ce que l'autorité demande, les informations déjà disponibles et les contributions à réunir.

Sorties affichées :

- demandes et sous-questions extraites ;
- dates écrites dans le courrier, sans calcul juridique automatique ;
- produit, marché et entités mentionnés ;
- pièces disponibles et informations manquantes ;
- responsables à inviter dans le dossier ;
- aperçu du pack de réponse.

Microcopy sous l'import :

> Ce diagnostic structure le courrier. Votre conseil valide l'interprétation juridique et la réponse finale.

CTA :

> Décrypter mon courrier

État sans courrier :

> Vous n'avez pas encore reçu de courrier ? Ouvrez un dossier à partir d'une plainte, d'un rapport de test ou d'un signal terrain.

CTA alternatif :

> Ouvrir un dossier incident

### Moteur de dossier

Surtitre :

> Un dossier. Les mêmes faits, à chaque étape.

Titre :

> Cleo transforme les pièces dispersées en travail vérifiable.

Capacité `Chronologie probatoire` :

> Chaque événement, version, décision et validation rejoint une chronologie commune.

Capacité `Demande vers réponse vers preuve` :

> Chaque demande de l'autorité reste reliée à la réponse préparée et aux pièces qui la fondent.

Capacité `Périmètre produit` :

> Les références, lots, marchés, canaux et partenaires concernés restent visibles dans le même espace.

Capacité `Playbooks par marché` :

> Le dossier appelle les règles, autorités et modèles utiles au produit et au marché concernés.

Capacité `Brief de décision` :

> Cleo rassemble les faits établis, les questions ouvertes et les options à valider par les décideurs.

Capacité `Exports prêts à revoir` :

> Les équipes produisent un pack cohérent pour l'autorité, le cabinet, l'assureur ou la direction.

CTA :

> Explorer le dossier incident

### Couche humaine

Surtitre :

> Votre équipe reste aux commandes

Titre :

> Les agents préparent. Les personnes habilitées décident.

Bloc `Incident concierge` :

> Un interlocuteur Cleo organise le dossier, relance les contributeurs et maintient la prochaine étape visible.

Bloc `Experts produit` :

> Les spécialistes produit et conformité relisent le périmètre, les preuves techniques et les livrables qui relèvent de leur compétence.

Bloc `Votre cabinet d'avocats` :

> Vos avocats gardent la décision juridique. Cleo leur livre les faits, les sources et les pièces dans un dossier prêt à décider.

Bloc `Partenaires techniques` :

> Les laboratoires et experts externes peuvent recevoir une demande précise et remettre leur contribution dans le dossier.

CTA principal :

> Faire prendre en charge mon incident

CTA secondaire :

> Travailler avec mon cabinet

### Solutions par organisation

Titre :

> Le même dossier, adapté à votre rôle dans la chaîne produit.

`Fabricants` :

> Rassemblez conception, qualité, production, lots et preuves techniques.

`Importateurs et distributeurs` :

> Reliez le fabricant, les marchés, les stocks, les clients et les obligations locales.

`Retailers et marketplaces` :

> Coordonnez vendeurs, références, retraits, communications et demandes d'autorité.

`Équipes juridiques et conformité` :

> Donnez aux décideurs un dossier sourcé et conservez chaque validation.

### Intégrations

Titre :

> Cleo travaille avec les systèmes qui détiennent déjà les faits.

Texte :

> Connectez les documents, tickets, données produit, stocks, ventes, retours et contacts nécessaires au dossier. L'intégration commence par les sources utiles au cas, puis s'étend avec le plan Enterprise.

Règle de publication : n'afficher que les intégrations effectivement disponibles ou un libellé explicite `sur demande`. Ne jamais présenter un logo comme une intégration active sur la seule base d'un export manuel.

### Tarification

Surtitre :

> Une tarification alignée sur le travail réalisé

Titre :

> Commencez par le courrier. Activez le dossier quand Cleo doit agir avec vous.

Carte `Décodeur de courrier` :

> Gratuit

> Extraction des demandes, dates explicites, acteurs, pièces et informations manquantes.

CTA : `Décrypter un courrier`

Carte `Dossier incident` :

> Par dossier activé

> Espace partagé, chronologie, périmètre produit, collecte de preuves, décisions et exports.

CTA : `Ouvrir un dossier`

Carte `Packs d'exécution` :

> Selon l'autorité, le marché et l'action à conduire

> Réponse autorité, action corrective, rappel, clôture ou recours, avec le niveau d'expertise convenu.

CTA : `Cadrer mon incident`

Carte `Enterprise` :

> Sur devis

> Gouvernance, intégrations, environnements, modèles internes, portefeuille de dossiers et accompagnement dédié.

CTA : `Parler à l'équipe`

Note interne : aucun montant, délai de livraison ou périmètre géographique ne peut être publié avant validation opérationnelle et commerciale.

### Engagement de processus

Titre proposé :

> Chaque demande reste visible jusqu'à sa résolution dans le dossier.

Texte proposé :

> Cleo relie chaque demande explicite du courrier à une réponse et à une pièce, ou désigne l'information manquante et son responsable avant l'export final.

Statut : **retenu hors publication** jusqu'à ce que le produit applique ce contrôle de manière déterministe et que les conditions commerciales définissent le périmètre, les exclusions et le recours du client. Une éventuelle garantie financière ne doit couvrir qu'une erreur de processus imputable à Cleo. Elle ne doit jamais promettre l'acceptation de l'autorité, l'absence de sanction, l'absence de rappel ou un résultat juridique.

### Preuve client

Titre temporaire :

> Voyez le dossier en situation.

Contenu de lancement : une démonstration clairement étiquetée `scénario illustratif`, fondée sur un cas public et sans marque cliente.

Contenu cible : un cas autorisé montrant le point de départ, les acteurs coordonnés, les livrables produits et la manière dont le dossier a été clôturé. Aucun gain chiffré ne sera publié sans source primaire et validation du client.

### Clôture

Titre :

> Le prochain courrier ne doit pas devenir un nouveau système à inventer.

Chapeau :

> Ouvrez le dossier. Cleo organise les faits, le travail et les validations à partir de ce qui existe déjà.

CTA principal :

> Décrypter un courrier d'autorité

CTA secondaire :

> Parler à un expert

## Page Produit, Dossier incident

### Hero

Titre :

> Tout l'incident dans un seul dossier.

Chapeau :

> Cleo rassemble les signaux, les produits, les marchés, les personnes, les décisions et les preuves. Chaque équipe travaille sur les mêmes faits et voit la prochaine contribution attendue.

CTA principal : `Ouvrir un dossier incident`

CTA secondaire : `Voir un dossier exemple`

### Séquence de page

- `Entrée` : courrier, plainte, test, retour terrain ou alerte interne.
- `Qualification` : produit, lots, marchés, acteurs et informations manquantes.
- `Décision` : faits établis, questions ouvertes, options et validations.
- `Exécution` : réponses, actions correctives, communications et contributions externes.
- `Clôture` : dossier final, historique, preuves et enseignements.

### États essentiels

- information extraite, à confirmer ;
- information confirmée avec source ;
- information manquante avec responsable ;
- décision en attente de validation ;
- décision validée avec auteur et date ;
- livrable en préparation ;
- livrable prêt à revoir ;
- livrable approuvé ;
- dossier clôturé.

## Page Réponses aux autorités

### Hero

Titre :

> Chaque demande de l'autorité trouve sa réponse et sa preuve.

Chapeau :

> Cleo transforme le courrier en plan de réponse, collecte les contributions, prépare les livrables et conserve les validations dans le même dossier.

### Livrables proposés

- matrice demande, réponse, preuve ;
- liste des informations manquantes et responsables ;
- projet de réponse sourcé ;
- annexes et index des pièces ;
- journal des versions et validations ;
- pack exportable pour revue et envoi.

### Limite publique

> Le client et ses conseils valident l'interprétation, la stratégie et l'envoi final.

## Page Actions correctives et rappels

### Hero

Titre :

> Une décision corrective, un plan partagé par toute l'entreprise.

Chapeau :

> Cleo relie le périmètre produit, les marchés, les stocks, les partenaires, les messages et les preuves d'exécution dans un dossier commun.

### Modules proposés

- périmètre références, lots et marchés ;
- registre des décisions et validations ;
- plan d'actions par équipe ;
- packs distributeurs, retailers et marketplaces ;
- trames de communication soumises à validation ;
- suivi des preuves d'exécution ;
- dossier de clôture.

### Limite publique

Le site ne doit pas promettre un rappel autonome, une notification automatique à toutes les autorités ou une qualification juridique sans validation humaine. Les envois automatisés ne peuvent être annoncés que marché par marché, après validation technique et juridique.

## Page Product Safety Engine

Cette page reprend les actifs utiles de l'offre `Data` actuelle sans rester une entrée commerciale concurrente.

### Hero

Titre :

> Le moteur réglementaire derrière chaque dossier incident.

Chapeau :

> Cleo relie les faits du dossier aux règles, autorités et sources officielles utiles au produit et au marché concernés.

### Blocs à conserver

- méthode d'encodage des sources ;
- accès API ;
- serveur MCP ;
- explorateur de couverture ;
- traçabilité vers l'article et la date d'entrée en vigueur.

### CTA

> Brancher le Product Safety Engine

## Page Enterprise

Enterprise devient un plan de déploiement du même produit.

### Hero

Titre :

> La gestion des incidents produit à l'échelle de votre organisation.

Chapeau :

> Cleo adapte le dossier, les accès, les intégrations, les modèles et la gouvernance à vos marques, marchés et équipes.

### Blocs

- environnements et droits d'accès ;
- modèles et circuits de validation internes ;
- intégrations aux systèmes source ;
- portefeuille de dossiers et gouvernance ;
- équipe Cleo dédiée ;
- API et serveur MCP ;
- options d'hébergement uniquement si elles sont effectivement disponibles et contractuelles.

CTA : `Parler à l'équipe Enterprise`

## Page Tarifs

La page doit rendre les unités de facturation compréhensibles avant de publier les montants.

### Principes

- gratuit pour le décryptage initial ;
- activation par dossier ;
- exécution facturée par pack défini ;
- Enterprise sur devis ;
- expertise externe affichée séparément lorsqu'elle n'est pas comprise ;
- aucun abonnement présenté comme obligatoire pour traiter un premier incident.

### Questions fréquentes

`Puis-je garder mon cabinet d'avocats ?`

> Oui. Vos avocats gardent les décisions juridiques. Cleo organise les faits, les pièces, les contributions et les versions pour leur permettre de décider et de revoir plus vite.

`Que fait le décodeur gratuit ?`

> Il extrait la structure explicite du courrier et prépare la liste de travail. Il ne rend pas d'avis juridique et n'envoie aucun document à l'autorité.

`Quand le dossier devient-il payant ?`

> Quand vous demandez à Cleo d'ouvrir l'espace partagé, de coordonner les contributeurs ou de produire un pack d'exécution.

`Les experts externes sont-ils inclus ?`

> Le devis précise les expertises incluses. Cleo affiche séparément toute intervention externe ajoutée au dossier.

`Cleo envoie-t-elle les réponses aux autorités ?`

> Le mode d'envoi dépend du marché, de l'autorité et du mandat donné. Le client et ses conseils valident toujours le livrable final.

## Parcours du décodeur gratuit

### Entrée

Le visiteur peut déposer un courrier ou coller son texte. Le produit demande seulement les informations indispensables au traitement initial. Il explique la confidentialité applicable avec des affirmations déjà vérifiées par l'équipe sécurité.

### Analyse

Le produit sépare clairement :

- le texte explicite du courrier ;
- les informations extraites ;
- les hypothèses à confirmer ;
- les informations absentes ;
- les questions qui nécessitent un avis humain.

### Résultat gratuit

Le visiteur obtient une vue lisible des demandes, dates explicites, acteurs, pièces et manques. Chaque élément renvoie au passage source du courrier.

### Conversion

CTA principal : `Créer le dossier à partir de ce courrier`

CTA secondaire : `Inviter mon équipe ou mon cabinet`

Le contexte déjà extrait entre dans le dossier. Le visiteur ne ressaisit pas les mêmes informations.

### Cas d'erreur

- document illisible : demander une nouvelle version sans produire d'extraction spéculative ;
- plusieurs courriers : séparer les sources et proposer leur rattachement au même dossier ;
- date ambiguë : montrer le texte source et demander confirmation ;
- produit non identifié : ouvrir une question assignable ;
- langue non prise en charge : l'annoncer avant conversion ;
- document hors sujet : expliquer le périmètre et proposer l'ouverture manuelle d'un dossier.

## Modèle humain et partenaires

### Principe

Cleo n'oppose jamais logiciel, experts et avocats. Le site montre leur division du travail.

| Acteur | Rôle affiché |
|---|---|
| Agent Cleo | Extraire, structurer, rapprocher, préparer et relancer |
| Incident concierge | Organiser le dossier et les contributeurs |
| Équipe client | Confirmer les faits et exécuter les décisions |
| Expert produit ou laboratoire | Valider les éléments relevant de son expertise |
| Cabinet d'avocats | Valider l'analyse, la stratégie et les actes juridiques |

### Programme partenaires proposé

- co-traitement avec le cabinet choisi par le client ;
- espace partenaire avec dossiers et demandes assignées ;
- modèles et playbooks propres au partenaire ;
- option de marque blanche à étudier ;
- apport d'affaires et règles de rémunération à valider avant publication ;
- contenu conjoint fondé sur des cas autorisés.

## Migration depuis le site actuel

| Élément actuel | Nouvelle fonction |
|---|---|
| `Compliance as a Service` | Devient l'exécution humaine et agentique au sein du dossier incident |
| `Data` | Devient `Product Safety Engine`, le moteur de sources et de règles |
| `Enterprise` | Devient un plan du produit principal |
| Veille offerte | Devient un module de contexte et de préparation, pas la promesse principale |
| Chat Cleo | Devient une interface du dossier, pas une offre indépendante |
| Catalogue de prestations amont | Reste accessible en ressource ou dans une offre secondaire, sans occuper l'accueil incident |
| Solutions par rôle | Se réécrivent autour du rôle joué pendant l'incident |
| Cas Decathlon | Reste une preuve de conformité produit, explicitement qualifiée comme telle |
| Page sécurité | Reste une page de confiance, après audit de chaque affirmation |

Les routes publiques existantes doivent être préservées ou redirigées de façon explicite lors de l'implémentation. Aucun changement de route ne fait partie de ce document.

## Ordre de construction produit

### Première livraison

- décodeur de courrier d'autorité ;
- extraction traçable vers le passage source ;
- demandes, dates explicites, acteurs, pièces et manques ;
- création du dossier à partir du résultat ;
- assignation et validation humaine ;
- export de la matrice demande, réponse, preuve.

### Livraison suivante

- périmètre produit, lots et marchés ;
- chronologie probatoire ;
- collecte de preuves et relances ;
- modèles de réponse par type d'autorité ;
- circuits de revue pour l'équipe et le cabinet.

### Extension

- plans d'actions correctives ;
- coordination des rappels ;
- packs partenaires et communications ;
- dossier de clôture et recours ;
- intégrations Enterprise ;
- programme partenaires.

### Hors promesse de lancement

- qualification juridique autonome de l'obligation de notifier ;
- soumission automatique universelle aux autorités ;
- décision autonome de rappel ;
- garantie d'absence de sanction ou de rappel ;
- couverture universelle de tous produits et marchés ;
- contentieux complet et représentation en justice.

## Événements de mesure

Aucun objectif chiffré n'est fixé dans ce design. Les événements à instrumenter sont :

- `authority_letter_decoder_started`
- `authority_letter_uploaded`
- `authority_letter_analysis_completed`
- `authority_letter_analysis_failed`
- `incident_case_creation_started`
- `incident_case_created`
- `counsel_invited`
- `expert_invited`
- `response_pack_requested`
- `corrective_action_pack_requested`
- `enterprise_contact_submitted`

Les propriétés doivent distinguer la source d'entrée, le type de signal, le rôle du visiteur et l'étape atteinte, sans enregistrer le contenu confidentiel des documents dans l'outil d'analytics.

## Garde-fous de copie

- Utiliser la voix active et nommer l'acteur.
- Ne pas utiliser de tiret cadratin dans la copie publique.
- Ne pas dénigrer les cabinets, consultants, équipes internes ou outils existants.
- Ne pas présenter une fonctionnalité prévue comme déjà disponible.
- Ne pas publier de montant, délai, couverture, résultat client ou garantie sans preuve et validation.
- Ne pas transformer une date extraite d'un courrier en délai juridique calculé sans revue compétente.
- Ne pas qualifier automatiquement un incident de notifiable dans la copie publique.
- Ne pas employer un logo ou témoignage pour suggérer un usage incident non documenté.
- Relier chaque affirmation sécurité à la page et à la preuve interne correspondantes.

## Audit des affirmations

La copie proposée dans ce document n'utilise aucun chiffre marketing, montant, délai de livraison, volume de couverture, taux de performance ou résultat client. Les seules unités mentionnées décrivent le modèle de facturation proposé et ne constituent pas une statistique.

Avant mise en ligne, chaque bloc reçoit un statut :

- `EXISTE` : la fonctionnalité est disponible et testée ;
- `BUILD` : la fonctionnalité doit être livrée avant publication ;
- `OPS` : le service doit être cadré et staffé ;
- `LEGAL` : la formulation ou le mandat doit être validé ;
- `PROOF` : une preuve client ou produit doit être jointe.

La publication bloque toute affirmation marquée autrement que `EXISTE`, ou la reformule clairement comme une demande de contact sans promesse de disponibilité.

## Critères d'acceptation du futur site

- Le hero nomme l'incident produit sans parler d'une offre pré-crise.
- Le visiteur comprend l'entrée gratuite et l'offre payante sans devoir comparer plusieurs piliers.
- Data apparaît comme le moteur du dossier et Enterprise comme un plan.
- Chaque page produit montre ce que l'agent prépare et qui valide.
- Le décodeur distingue texte source, extraction, hypothèse et information manquante.
- Aucun logo ne suggère un usage incident non prouvé.
- Aucun montant, délai, garantie ou intégration non validé ne paraît public.
- La copie ne contient aucun tiret cadratin.
- Les routes actuelles disposent d'un plan de conservation ou de redirection.
- Le design V6 validé reste la référence visuelle.

## Périmètre de l'implémentation suivante

Après validation de ce copy deck, l'implémentation doit commencer par une maquette locale de l'accueil français et du décodeur, sans déploiement. Les fichiers existants à modifier devront être relus avec les changements concurrents au moment de l'exécution. La version anglaise, les autres pages produit, les redirections et le déploiement formeront des lots séparés.
