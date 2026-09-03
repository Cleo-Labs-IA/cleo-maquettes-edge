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
