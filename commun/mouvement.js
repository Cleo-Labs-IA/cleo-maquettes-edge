/* Le moteur : un IntersectionObserver, rien d'autre.
   Il n'écoute ni la molette ni le scroll — capter wheel avec
   preventDefault a déjà cassé le défilement de la landing le 30/07. */
(function () {
  var lance = function () {
    var cibles = document.querySelectorAll('[data-anim], [data-anim-groupe], .pile-regles, .mass');
    if (!cibles.length) return;
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < cibles.length; i++) cibles[i].classList.add('vu');
      return;
    }
    var obs = new IntersectionObserver(function (entrees) {
      for (var j = 0; j < entrees.length; j++) {
        var e = entrees[j];
        if (!e.isIntersecting) continue;
        e.target.classList.add('vu');
        obs.unobserve(e.target);
        // on rend la main au navigateur une fois l'arrivée finie
        (function (el) {
          setTimeout(function () { el.classList.add('pose'); }, 1100);
        })(e.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    for (var k = 0; k < cibles.length; k++) {
      // ce qui est déjà à l'écran au chargement arrive tout de suite
      var r = cibles[k].getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) { cibles[k].classList.add('vu'); continue; }
      obs.observe(cibles[k]);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lance);
  else lance();
})();

/* Le menu sur téléphone, posé le 03/09/2026. Le panneau est dans la page,
   généré par construire.mjs : ici on l'ouvre et on le ferme.
   17/09/2026, « rendre le menu réellement modal pour les lecteurs d'écran » :
   - à l'ouverture, tout ce qui n'est ni le panneau ni le bouton devient inerte (attribut inert : ni lu, ni
     focalisable, ni cliquable), le focus entre dans le panneau et Tab boucle à l'intérieur ;
   - à la fermeture (bouton du panneau, bouton de la barre, Échap, lien suivi, passage en grand écran), l'inertie
     est retirée et le focus revient au bouton de la barre ;
   - le bouton de la barre annonce l'action (« Ouvrir le menu » / « Fermer le menu »). */
(function(){
  var b = document.querySelector('.nav-burger'), m = document.getElementById('menu-mobile');
  if (!b || !m) return;
  var inertes = [];
  var FOCUSABLES = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function rendreInerte(){
    // Remonte du panneau et du bouton jusqu'au body : chaque frère qui ne contient ni l'un ni l'autre devient inerte.
    var garder = [m, b];
    garder.forEach(function(el){
      for (var n = el; n && n !== document.body; n = n.parentElement) {
        var p = n.parentElement; if (!p) break;
        for (var k = 0; k < p.children.length; k++) {
          var f = p.children[k];
          if (f === n || f.tagName === 'SCRIPT' || f.hasAttribute('inert')) continue;
          if (garder.some(function(g){ return f.contains(g); })) continue;
          f.setAttribute('inert', ''); inertes.push(f);
        }
      }
    });
  }
  function leverInertie(){ inertes.forEach(function(f){ f.removeAttribute('inert'); }); inertes = []; }
  function ouvrir(){
    m.hidden = false; b.setAttribute('aria-expanded', 'true');
    b.setAttribute('aria-label', b.getAttribute('data-libelle-fermer') || 'Fermer le menu');
    document.documentElement.classList.add('menu-ouvert');
    rendreInerte();
    var premier = m.querySelector(FOCUSABLES); if (premier) premier.focus();
  }
  function fermer(rendreFocus){
    if (m.hidden) return;
    m.hidden = true; b.setAttribute('aria-expanded', 'false');
    b.setAttribute('aria-label', b.getAttribute('data-libelle-ouvrir') || 'Ouvrir le menu');
    document.documentElement.classList.remove('menu-ouvert');
    leverInertie();
    if (rendreFocus) b.focus();
  }
  b.addEventListener('click', function(){ if (m.hidden) ouvrir(); else fermer(true); });
  var croix = m.querySelector('.mm-fermer'); if (croix) croix.addEventListener('click', function(){ fermer(true); });
  m.addEventListener('click', function(e){ if (e.target.closest('a')) fermer(false); });
  window.addEventListener('resize', function(){ if (window.innerWidth > 1024) fermer(false); });
  document.addEventListener('keydown', function(e){
    if (m.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); fermer(true); return; }
    if (e.key !== 'Tab') return;
    var liste = Array.prototype.filter.call(m.querySelectorAll(FOCUSABLES), function(el){ return el.getClientRects().length; });
    if (!liste.length) return;
    var premier = liste[0], dernier = liste[liste.length - 1];
    if (!m.contains(document.activeElement)) { e.preventDefault(); premier.focus(); return; }
    if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
    else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
  });
})();

/* ────────────────────────────────────────────────────────────────
   LES MÉGA-MENUS AU CLAVIER, posés le 03/09/2026.
   Mesuré la veille sur l'URL en ligne : les quatre .nav-declencheur
   prenaient bien le focus (Tab n° 3 à 6), mais Entrée puis Espace
   laissaient le compte de panneaux ouverts à ZÉRO, et aucun ne
   portait aria-expanded. Les 25 liens des trois panneaux étaient
   donc hors d'atteinte au clavier en desktop.
   Le survol marchait, lui : il reste tel quel dans composants.css
   (.nav-item:hover .mega). On n'ajoute qu'un second chemin.
   « Entreprise » est un <a> sans panneau : il est laissé de côté,
   sans aria-expanded, parce qu'il n'expose rien.
   ──────────────────────────────────────────────────────────────── */
(function(){
  var barre = document.querySelector('.nav');
  if (!barre) return;
  var items = [].slice.call(barre.querySelectorAll('.nav-item'));
  var paires = [];
  items.forEach(function(item, i){
    var decl = item.querySelector('.nav-declencheur');
    var mega = item.querySelector('.mega');
    if (!decl || !mega || decl.tagName !== 'BUTTON') return;
    /* Les attributs sont posés ici, pas dans le fragment : construire.mjs
       lit `<button class="nav-declencheur">` au caractère près pour bâtir
       le panneau téléphone, et un attribut de plus dans la balise casse
       le build. */
    if (!mega.id) mega.id = 'mega-' + (i + 1);
    decl.setAttribute('type', 'button');
    decl.setAttribute('aria-haspopup', 'true');
    decl.setAttribute('aria-expanded', 'false');
    decl.setAttribute('aria-controls', mega.id);
    paires.push({ item: item, decl: decl, mega: mega });
  });
  if (!paires.length) return;

  function estOuvert(p){ return p.item.classList.contains('ouvert'); }
  function fermer(p){ p.item.classList.remove('ouvert'); p.decl.setAttribute('aria-expanded', 'false'); }
  function fermerLesAutres(sauf){ paires.forEach(function(p){ if (p !== sauf) fermer(p); }); }
  function ouvrir(p){ fermerLesAutres(p); p.item.classList.add('ouvert'); p.decl.setAttribute('aria-expanded', 'true'); }

  paires.forEach(function(p){
    /* Un <button> déclenche click sur Entrée ET sur Espace, et absorbe
       le défilement d'Espace : une seule écoute suffit pour les trois
       gestes (souris, Entrée, Espace). */
    p.decl.addEventListener('click', function(e){
      e.preventDefault();
      if (estOuvert(p)) fermer(p); else ouvrir(p);
    });
    /* Le focus qui sort de l'item referme : sans ça, Tab au-delà du
       dernier lien laissait un panneau ouvert derrière le visiteur. */
    p.item.addEventListener('focusout', function(e){
      if (!p.item.contains(e.relatedTarget)) fermer(p);
    });
  });

  /* Un seul panneau à la fois, y compris quand la souris passe d'un
     menu ouvert au clavier vers son voisin. */
  items.forEach(function(it){
    it.addEventListener('mouseenter', function(){
      paires.forEach(function(p){ if (p.item !== it) fermer(p); });
    });
  });

  /* Échap ferme et RE-DONNE le focus au déclencheur : sinon le focus
     reste sur un lien devenu invisible et le Tab suivant repart du haut. */
  document.addEventListener('keydown', function(e){
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    for (var i = 0; i < paires.length; i++) {
      if (!estOuvert(paires[i])) continue;
      fermer(paires[i]);
      paires[i].decl.focus();
      return;
    }
  });

  /* Un clic hors d'un item de la barre ferme. Le clic sur le
     déclencheur lui-même remonte jusqu'ici : il est dans un .nav-item,
     donc il ne se referme pas dans la foulée de sa propre ouverture. */
  document.addEventListener('click', function(e){
    if (e.target && e.target.closest && e.target.closest('.nav-item')) return;
    fermerLesAutres(null);
  });
})();

/* ────────────────────────────────────────────────────────────────
   MOUVEMENT DU SYSTÈME CLEO, refonte du 15/09/2026 (SYSTEME.md). Les
   références Framer mesurées ne bougent presque pas au défilement : on
   garde l'entrée mot à mot du SEUL h1 et une apparition simple, une fois,
   à l'entrée dans l'écran. Retirés : inclinaison des cartes, halo, boutons
   aimantés, fil de lecture, h2 mot à mot. Rendu : v6-zzzzzzzzzz-mouvement-moderne.css.
   ──────────────────────────────────────────────────────────────── */
(function () {
  var corps = document.body;
  if (!corps || corps.getAttribute('data-cleo-ds') !== 'v6') return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Le h1 : chaque mot dans un span, les espaces gardées pour que le texte se coupe comme avant.
  var titres = document.querySelectorAll('main h1');
  for (var t = 0; t < titres.length; t++) {
    var h = titres[t];
    if (h.querySelector('.mm-mot, .av-mot, .fx-mot, .av-compte') || h.closest('[aria-hidden="true"]')) continue;
    var rang = 0;
    (function decoupe(noeud) {
      var enfants = Array.prototype.slice.call(noeud.childNodes);
      for (var k = 0; k < enfants.length; k++) {
        var n = enfants[k];
        if (n.nodeType === 3) {
          if (!n.textContent.trim()) continue;
          // 15/09/2026 : la ponctuation haute du français (« : ; ? ! ») reste collée au mot d'avant par une espace insécable,
          // sinon le « : » devenait un mot à part et tombait seul en tête de ligne (vu sur la fiche Mandataire).
          var texte = n.textContent.replace(/[   ]([:;?!»])/g, ' $1').replace(/(«)[   ]/g, '$1 ');
          var morceaux = texte.split(/([ \t\n\r]+)/), frag = document.createDocumentFragment();
          for (var m = 0; m < morceaux.length; m++) {
            if (!morceaux[m]) continue;
            if (/^[ \t\n\r]+$/.test(morceaux[m])) { frag.appendChild(document.createTextNode(morceaux[m])); continue; }
            var s = document.createElement('span');
            s.className = 'mm-mot';
            s.style.setProperty('--i', rang++);
            s.textContent = morceaux[m];
            frag.appendChild(s);
          }
          noeud.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !/^(svg|img|br)$/i.test(n.tagName)) decoupe(n);
      }
    })(h);
  }

  // L'apparition : seuls les blocs SOUS le pli attendent, rien ne clignote au chargement.
  var blocs = document.querySelectorAll('[data-apparait], [data-apparait-groupe]');
  if (!blocs.length || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('mm-js');
  var obs = new IntersectionObserver(function (entrees) {
    for (var j = 0; j < entrees.length; j++) {
      if (!entrees[j].isIntersecting) continue;
      entrees[j].target.classList.remove('mm-attend');
      obs.unobserve(entrees[j].target);
    }
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  for (var b = 0; b < blocs.length; b++) {
    if (blocs[b].getBoundingClientRect().top < window.innerHeight * 0.94) continue;
    blocs[b].classList.add('mm-attend');
    obs.observe(blocs[b]);
  }
})();

/* ────────────────────────────────────────────────────────────────
   PAGE SERVICE, LA LISTE DES CAS (15/09/2026, à la Moritz) : à la
   souris, survoler un cas le choisit, comme un clic. Au clavier et au
   toucher, le bouton radio suffit. Rendu : v6-zzzzzzzzzz-service-cas.css.
   ──────────────────────────────────────────────────────────────── */
(function () {
  if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener('pointerover', function (e) {
    var l = e.target && e.target.closest ? e.target.closest('.sc-cas-label') : null;
    if (!l) return;
    var r = document.getElementById(l.htmlFor);
    if (r && !r.checked) r.checked = true;
  }, { passive: true });
})();

/* ────────────────────────────────────────────────────────────────
   MENU LATÉRAL DES RESSOURCES (.res-nav, .sommaire), 16/09/2026.
   Naomie : « couverture la page marche pas bien ». Mesuré au clic sur la
   page 26 : le lien actif restait « Le périmètre » quel que soit le
   chapitre lu. Ici le lien actif suit le chapitre dont le titre a passé la
   barre ; au clic, il bascule tout de suite. IntersectionObserver
   seulement, comme le reste du fichier : aucune écoute du défilement.
   ──────────────────────────────────────────────────────────────── */
(function () {
  var liens = [].slice.call(document.querySelectorAll('.res-nav a[href^="#"], .sommaire a[href^="#"]'));
  if (!liens.length) return;
  var paires = liens.map(function (a) { return { a: a, cible: document.getElementById(a.getAttribute('href').slice(1)) }; })
    .filter(function (p) { return p.cible; });
  if (!paires.length) return;
  function activer(p) {
    paires.forEach(function (q) {
      var on = q === p;
      q.a.classList.toggle('actif', on);
      if (on) q.a.setAttribute('aria-current', 'true'); else q.a.removeAttribute('aria-current');
    });
  }
  // Après un clic, le lien choisi reste actif le temps du défilement vers son titre : sur un article aux chapitres
  // courts, le titre suivant entre aussi dans le haut de l'écran et aurait pris la main (mesuré sur 12-article).
  var verrou = 0;
  function calculer() {
    if (Date.now() < verrou) return;
    // Un chapitre devient actif quand son titre entre dans les 40 % hauts de l'écran (lu, pas seulement atteint).
    var ligne = Math.round(window.innerHeight * 0.4), courant = paires[0];
    paires.forEach(function (p) { if (p.cible.getBoundingClientRect().top - ligne <= 0) courant = p; });
    activer(courant);
  }
  paires.forEach(function (p) { p.a.addEventListener('click', function () { verrou = Date.now() + 1200; activer(p); }); });
  if (!('IntersectionObserver' in window)) return;
  var seuils = []; for (var i = 0; i <= 20; i++) seuils.push(i / 20);
  var obs = new IntersectionObserver(calculer, { rootMargin: '0px 0px -60% 0px', threshold: seuils });
  // Les titres, et leur bloc parent : un bloc haut change de ratio tous les 5 %, ce qui recalcule entre deux titres.
  paires.forEach(function (p) { obs.observe(p.cible); if (p.cible.parentElement) obs.observe(p.cible.parentElement); });
  calculer();
})();
