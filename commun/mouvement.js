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
   généré par construire.mjs : ici on ne fait que l'ouvrir et le fermer. */
(function(){
  var b = document.querySelector('.nav-burger'), m = document.getElementById('menu-mobile');
  if (!b || !m) return;
  function fermer(){ m.hidden = true; b.setAttribute('aria-expanded', 'false'); document.documentElement.classList.remove('menu-ouvert'); }
  b.addEventListener('click', function(){
    var ouvrir = m.hidden;
    m.hidden = !ouvrir; b.setAttribute('aria-expanded', ouvrir ? 'true' : 'false');
    document.documentElement.classList.toggle('menu-ouvert', ouvrir);
  });
  m.addEventListener('click', function(e){ if (e.target.closest('a')) fermer(); });
  window.addEventListener('resize', function(){ if (window.innerWidth > 1024) fermer(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') fermer(); });
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
   MOUVEMENT « DERNIÈRE GÉNÉRATION », posé le 15/09/2026 (Naomie : « plus
   animé, plus moderne, selon les blogs Framer »). Titres découpés mot à
   mot, cartes et boutons sous la souris, fil de lecture sous la barre.
   Rien si l'utilisateur demande de réduire les animations. Le rendu vit
   dans commun/lanes/v6-zzzzzzzzzz-mouvement-moderne.css.
   ──────────────────────────────────────────────────────────────── */
(function () {
  var corps = document.body;
  if (!corps || corps.getAttribute('data-cleo-ds') !== 'v6') return;
  var nav = document.querySelector('.nav');
  if (nav && !nav.querySelector('.mm-progres')) {
    var fil = document.createElement('span');
    fil.className = 'mm-progres';
    fil.setAttribute('aria-hidden', 'true');
    nav.appendChild(fil);
  }
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Les titres : chaque mot dans un span, les espaces gardées entre eux pour que le texte se coupe comme avant.
  var titres = document.querySelectorAll('main h1, main h2');
  for (var t = 0; t < titres.length; t++) {
    var h = titres[t];
    if (h.querySelector('.mm-mot, .av-mot, .av-compte') || h.closest('[aria-hidden="true"]')) continue;
    var rang = 0;
    (function decoupe(noeud) {
      var enfants = Array.prototype.slice.call(noeud.childNodes);
      for (var k = 0; k < enfants.length; k++) {
        var n = enfants[k];
        if (n.nodeType === 3) {
          if (!n.textContent.trim()) continue;
          var morceaux = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          for (var m = 0; m < morceaux.length; m++) {
            if (!morceaux[m]) continue;
            if (/^\s+$/.test(morceaux[m])) { frag.appendChild(document.createTextNode(morceaux[m])); continue; }
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

  // Sous la souris seulement.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  var CARTES = '.av-carte, .dt-usage, .av-garantie, .dt-client-carte, .dt-skill, .dt-offre-carte, .tk-case';
  var BOUTONS = '.hq-bouton, .tk-bouton, .btn-marque, [class*="-bouton"]';
  var carte = null, bouton = null;
  function lacheCarte() {
    if (!carte) return;
    carte.classList.remove('mm-survol');
    ['--mm-x', '--mm-y', '--mm-rx', '--mm-ry'].forEach(function (p) { carte.style.removeProperty(p); });
    carte = null;
  }
  function lacheBouton() {
    if (!bouton) return;
    bouton.style.removeProperty('--mm-bx');
    bouton.style.removeProperty('--mm-by');
    bouton = null;
  }
  document.addEventListener('pointermove', function (e) {
    var cible = e.target && e.target.closest ? e.target : null;
    var c = cible && cible.closest(CARTES);
    if (c && !c.closest('main')) c = null;
    if (carte && carte !== c) lacheCarte();
    if (c) {
      carte = c;
      c.classList.add('mm-survol');
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mm-x', (x * 100).toFixed(1) + '%');
      c.style.setProperty('--mm-y', (y * 100).toFixed(1) + '%');
      c.style.setProperty('--mm-rx', ((0.5 - y) * 4).toFixed(2) + 'deg');
      c.style.setProperty('--mm-ry', ((x - 0.5) * 5).toFixed(2) + 'deg');
    }
    var b = cible && cible.closest(BOUTONS);
    if (bouton && bouton !== b) lacheBouton();
    if (b) {
      bouton = b;
      var rb = b.getBoundingClientRect();
      b.style.setProperty('--mm-bx', (((e.clientX - rb.left) / rb.width - 0.5) * 8).toFixed(1) + 'px');
      b.style.setProperty('--mm-by', (((e.clientY - rb.top) / rb.height - 0.5) * 6).toFixed(1) + 'px');
    }
  }, { passive: true });
  document.addEventListener('pointerout', function (e) { if (!e.relatedTarget) { lacheCarte(); lacheBouton(); } });
})();
