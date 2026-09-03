/* ════════════════════════════════════════════════════════════════
   GLOBE DE PARTICULES — valeurs du composant Framer de la landing
   (cleo-landing/src/components/landing/hero/RotatingParticleGlobe.ts),
   rejouées en canvas 2D sans React.
     R = min(W,H) × 0.40           la sphère n'occupe que 80 % du canvas
     persp(z) = 1 / (1 − 0.28 z)
     ay = temps/12 × 2π + tiltY    ax = −0.25 + tiltX
     composite « lighter »          ⚠ additif : un fond clair l'efface
   ════════════════════════════════════════════════════════════════ */
(function () {
  var COULEUR_POINT = '#b9c8ff', COULEUR_FIL = '#d7e1ff', ACCENT = '#8ce1ff';
  var FOND_CENTRE = '#151413', FOND_BORD = '#0F0E0D';

  function monte(hote) {
    var c = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    hote.appendChild(c);
    var ctx = c.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, R = 0;
    var souris = { tiltX: 0, tiltY: 0, cx: -1e6, cy: -1e6 };

    // Répartition de Fibonacci : la seule qui ne fait pas d'amas aux pôles
    var N = 1700, pts = [];
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var th = i * Math.PI * (3 - Math.sqrt(5));
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    // Les parallèles et méridiens du filaire
    var fil = [];
    for (var lat = -60; lat <= 60; lat += 30) {
      var l = [];
      for (var lo = 0; lo <= 360; lo += 6) l.push(ll(lat, lo));
      fil.push(l);
    }
    for (var lo2 = 0; lo2 < 360; lo2 += 30) {
      var m = [];
      for (var la2 = -90; la2 <= 90; la2 += 6) m.push(ll(la2, lo2));
      fil.push(m);
    }
    function ll(lat, lon) {
      var a = lat * Math.PI / 180, b = lon * Math.PI / 180;
      return [Math.cos(a) * Math.cos(b), Math.sin(a), Math.cos(a) * Math.sin(b)];
    }
    function rot(p, ay, ax) {
      var x = p[0], y = p[1], z = p[2];
      var ca = Math.cos(ay), sa = Math.sin(ay);
      var x1 = x * ca - z * sa, z1 = x * sa + z * ca;
      var cb = Math.cos(ax), sb = Math.sin(ax);
      var y1 = y * cb - z1 * sb, z2 = y * sb + z1 * cb;
      return [x1, y1, z2];
    }

    function taille() {
      var r = hote.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      c.width = W * dpr; c.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * 0.44;
    }

    var t0 = performance.now(), brut = null, actif = true;
    function peint(now) {
      if (!actif) return;
      var t = (now - t0) / 1000;
      var ay = t / 12 * Math.PI * 2 + souris.tiltY;
      var ax = -0.25 + souris.tiltX;

      var g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
      g.addColorStop(0, FOND_CENTRE); g.addColorStop(1, FOND_BORD);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = 'lighter';

      // le filaire, derrière
      ctx.lineWidth = 0.6;
      for (var f = 0; f < fil.length; f++) {
        ctx.beginPath();
        var ouvert = false;
        for (var k = 0; k < fil[f].length; k++) {
          var p = rot(fil[f][k], ay, ax);
          if (p[2] > 0.02) { ouvert = false; continue; }
          var kk = 1 / (1 - 0.28 * p[2]);
          var X = W / 2 + p[0] * R * kk, Y = H / 2 - p[1] * R * kk;
          if (!ouvert) { ctx.moveTo(X, Y); ouvert = true; } else ctx.lineTo(X, Y);
        }
        ctx.strokeStyle = 'rgba(215,225,255,0.10)';
        ctx.stroke();
      }

      // les particules
      for (var i2 = 0; i2 < pts.length; i2++) {
        var q = rot(pts[i2], ay, ax);
        var kf = 1 / (1 - 0.28 * q[2]);
        var x2 = W / 2 + q[0] * R * kf, y2 = H / 2 - q[1] * R * kf;
        var prof = (q[2] + 1) / 2;              // 0 devant, 1 derrière
        var alpha = 0.20 + (1 - prof) * 0.72;
        var rayon = (0.55 + (1 - prof) * 1.20) * kf;
        ctx.fillStyle = 'rgba(185,200,255,' + alpha.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(x2, y2, rayon, 0, 6.2832); ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      brut = requestAnimationFrame(peint);
    }

    function surSouris(e) {
      var r = hote.getBoundingClientRect();
      souris.tiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
      souris.tiltX = ((e.clientY - r.top) / r.height - 0.5) * 0.3;
    }
    function surSortie() { souris.tiltX = 0; souris.tiltY = 0; }

    taille();
    var ro = ('ResizeObserver' in window) ? new ResizeObserver(taille) : null;
    if (ro) ro.observe(hote); else window.addEventListener('resize', taille);
    hote.addEventListener('mousemove', surSouris);
    hote.addEventListener('mouseleave', surSortie);

    // la boucle ne tourne qu'à l'écran, et pas sur un onglet caché
    var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
      var vu = es[0].isIntersecting;
      if (vu && !brut) { actif = true; t0 = performance.now() - 1; brut = requestAnimationFrame(peint); }
      if (!vu && brut) { actif = false; cancelAnimationFrame(brut); brut = null; }
    }, { threshold: 0.01 }) : null;
    if (io) io.observe(hote); else brut = requestAnimationFrame(peint);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && brut) { actif = false; cancelAnimationFrame(brut); brut = null; }
      else if (!document.hidden && !brut) { actif = true; t0 = performance.now() - 1; brut = requestAnimationFrame(peint); }
    });
  }

  function lance() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var hotes = document.querySelectorAll('[data-globe]');
    for (var i = 0; i < hotes.length; i++) monte(hotes[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', lance);
  else lance();
})();
