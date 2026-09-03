# Reprendre depuis le téléphone

Écrit le 01/09/2026.

---

## D'abord : rien ne tourne, tu peux fermer

Les quatre agents ont rendu avant ton départ. **Tout est construit, vérifié et
déployé.** Tu peux fermer le terminal et éteindre le Mac, rien ne se perd.

État à l'instant : **30 pages, 0 souci** au vérificateur, deux témoins actifs.
Les quatre pages neuves répondent 200 en ligne.

**https://sortie-liart.vercel.app**

| Page | |
|---|---|
| `/23-research.html` | La science derrière l'intelligence |
| `/24-blog.html` | Actualités et analyses |
| `/25-skills.html` | Les skills |
| `/26-legal-data.html` | Le corpus |
| `/index.html` | Les 27 maquettes, avec leurs vignettes |

---

## Pour travailler depuis le téléphone : ce qui manque

`claude.ai/code` depuis ton navigateur mobile ouvre une session **cloud**. Elle
ne voit pas ton Mac : elle clone un dépôt git et travaille dedans.

Or **`~/cleo-maquettes-edge` n'est pas un dépôt git** (vérifié :
`fatal: not a git repository`). Il n'y a donc rien à cloner.

Il pèse 73 Mo, dont **57 Mo de généré** : `sortie/` (23 Mo) et `captures/`
(34 Mo) se reconstruisent en une commande et n'ont rien à faire dans un dépôt.
**Le vrai chantier fait 16 Mo** : les 27 gabarits, les 5 feuilles, les scripts,
les images sources.

---

## Ce que je fais dès que tu dis oui

1. `git init`, avec un `.gitignore` qui exclut `sortie/`, `captures/` et
   `temoins/`.
2. Un premier commit du chantier réel.
3. Un dépôt **privé** sur l'organisation `Cleo-Labs-IA`, et je pousse.

**Pourquoi j'attends ton feu vert** : le chantier contient la citation de
Philippine Tamic, quatre noms de clients et la fiche « à confirmer avec
Decathlon avant toute publication ». Même privé, un dépôt est un endroit de
plus où ces éléments existent. C'est ta décision, pas la mienne.

---

## Le message à coller depuis ton téléphone

Une fois le dépôt poussé, ouvre `claude.ai/code`, choisis le dépôt
`cleo-maquettes-edge`, et colle ceci :

```
Chantier : les maquettes Cleo en DS V5, 27 gabarits.

Avant toute chose, lis ces trois fichiers, dans cet ordre :
  1. DEPUIS-MON-TEL.md        — l'état où on s'est arrêtés
  2. rapports/carte-REPONSE.md — la règle de portage vers cleolabs.co
  3. commun/seo.json           — les titres, descriptions et le structuré

La chaîne, dans cet ordre, jamais autrement :
  node construire.mjs      → construit les 29 pages dans sortie/
  node capturer.mjs <page> → capture, sans argument il fait tout
  node index.mjs           → refait la porte d'entrée
  node verifier.mjs        → 30 pages, doit rendre 0 souci

Les règles dures du chantier :
  · Ne JAMAIS éditer sortie/ : c'est généré.
  · Une grille qui doit se replier vit dans une CLASSE, jamais en style=
    inline : l'inline gagne sur la media query.
  · Une surface claire dans une section sombre porte .carte-claire, une
    surface sombre porte .surface-sombre. Sinon le texte rend blanc sur
    blanc, et c'est sorti quatre fois.
  · Un élément ne porte qu'UN attribut class. Deux, et le second est jeté
    en silence sans qu'aucun contrôle le voie.
  · Zéro monospace, zéro emoji, zéro tiret cadratin.
  · AUCUN chiffre qui ne soit pas dans docs/CANONICAL-FACTS.md du dépôt
    cleo-landing : 106 pays, 25 000 réglementations, 19 000 autorités.
    On n'affiche pas les 3 700 sources.
  · Aucun nom de client au-delà de Decathlon, Balzac Paris, Mercedes-Benz,
    L'Occitane et NVIDIA.

Ce qui reste à faire, dans l'ordre :
```

Puis tu ajoutes ce que tu veux, par exemple :

```
1. Écrire les jumeaux anglais de 23-research, 24-blog, 25-skills et
   26-legal-data. Structure identique, seuls les textes changent.
2. Le chiffre « Trusted by +1 000 » : je te le donnerai, ne l'invente pas.
3. Les 4 textes à 10 px sur l'accueil : dis-moi s'ils tiennent sur téléphone.
```

---

## Ce qui attend encore ta réponse

**« Trusted by +1 000 »** — la ligne est posée sans le chiffre. Aucune source
nulle part, et je ne sais pas ce qu'il compte.

**Les trois copies publiques et périmées du site** —
`cleo-apercu-landing`, `cleo-apercu-agents`, `cleo-landing-audit`, ouvertes à
GPTBot, PerplexityBot, ClaudeBot et Google-Extended. C'est le seul point de la
semaine qui touche vraiment le GEO. Protection par mot de passe, ou suppression.

**La citation Decathlon, deux versions** — le dépôt `cleo-landing` porte un
extrait de 95 mots, la maquette porte l'intégrale de 241 mots que tu m'as
dictée. À trancher avant tout portage : laquelle fait foi.
