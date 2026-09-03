Un fichier CSS par lane, concaténé après composants.css par construire.mjs.
Une lane n'écrit QUE dans son fichier ici et dans ses pages : jamais dans
base.css, composants.css ni construire.mjs. Préfixer les sélecteurs par la
page ou le composant possédé, jamais de règle sur une balise nue (h1, p, a).
