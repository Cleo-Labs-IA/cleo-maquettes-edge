/* GENERE PAR scripts/extract-veille.mjs — NE PAS EDITER A LA MAIN.
   Source : /Users/naomiehalioua/Downloads/cleo-composants/cleo-veille-animation.html
   (artefact 2bd199a4-ab28-4be5-a0b7-25be3d861a30, version du 04/08/2026)
   L'animation. Le corps de son IIFE est repris verbatim ; seul
   le demontage est ajoute, pour que React puisse la retirer. */

/* eslint-disable */
// @ts-nocheck
export function monterVeille() {/* Données réelles — regulation_articles, insight prod, relevé du 04.08.2026.
     det = date de détection par Cleo · app = date d’application du texte
     avance = jours entre les deux · reste = jours avant l’échéance au 04.08.2026 */
  var CV_TEXTES = [
    { det:"2026-06-05", detJ:"05", detM:"juin", app:"2028-11-01", appTxt:"1 nov. 2028", avance:880, reste:820,
      touche:false, titre:"MDR : règles UDI pour montures, verres et lunettes de lecture", ref:"Règlement délégué (UE) 2025/1920",
      url:"https://eur-lex.europa.eu/eli/reg_del/2025/1920/oj" },

    { det:"2026-06-17", detJ:"17", detM:"juin", app:"2026-08-06", appTxt:"6 août 2026", avance:50, reste:2,
      touche:true, titre:"Limites d’émission de formaldéhyde applicables en août 2026", ref:"REACH ann. XVII · règlement (UE) 2023/1464",
      url:"https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:32023R1464",
      jo:"Journal officiel de l’Union européenne", etat:"Un essai à refaire" },

    { det:"2026-07-01", detJ:"01", detM:"juil.", app:"2026-08-12", appTxt:"12 août 2026", avance:42, reste:8,
      touche:true, titre:"PPWR : obligations emballages applicables au 12 août 2026", ref:"Règlement (UE) 2025/40 · CELEX 32025R0040",
      url:"https://eur-lex.europa.eu/legal-content/FR/ALL/?uri=CELEX%3A32025R0040",
      jo:"Journal officiel de l’Union européenne", etat:"Un emballage à déclarer" },

    { det:"2026-07-07", detJ:"07", detM:"juil.", app:"2026-08-02", appTxt:"2 août 2026", avance:26, reste:-2,
      touche:false, titre:"AI Act : obligations de transparence pour les systèmes d’IA", ref:"Règlement (UE) 2024/1689",
      url:"https://eur-lex.europa.eu/FR/legal-content/summary/rules-for-trustworthy-artificial-intelligence-in-the-eu.html" },

    { det:"2026-07-22", detJ:"22", detM:"juil.", app:"2026-10-01", appTxt:"1 oct. 2026", avance:71, reste:58,
      touche:true, titre:"Restriction PFHxA applicable aux textiles et aux chaussures", ref:"REACH ann. XVII · règlement (UE) 2024/2462",
      url:"https://eur-lex.europa.eu/legal-content/FR/TXT/PDF/?uri=OJ%3AL_202402462",
      jo:"Journal officiel de l’Union européenne", etat:"Une substance à faire doser" }
  ];

  var CV_INTERVALLE = 3400;
  var CV_MAX = 5;

  var scene = document.getElementById('cv-scene');
  var liste = document.getElementById('cv-list');
  var beams = document.getElementById('cv-beams');
  var prod  = document.getElementById('cv-prod');
  var fiche = document.getElementById('cv-fiche');
  if (!scene || !liste || !beams || !prod || !fiche) return function () {};

  var etatTxt = document.getElementById('cv-etat-txt');
  var elHits = document.getElementById('cv-hits');
  var elVus  = document.getElementById('cv-vus');
  var fTitre = document.getElementById('cv-f-titre');
  var fMeta  = document.getElementById('cv-f-meta');
  var fGain  = document.getElementById('cv-f-gain');
  var fLien  = document.getElementById('cv-f-lien');

  var sobre = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hits = 0, vus = 0, curseur = 0, minuteur = null;

  /* --- ajoute a l'integration : de quoi tout retirer --- */
  var minuteries = [];
  var observateur = null;
  var amorce = false;
  function poser(f, d) { var id = setTimeout(f, d); minuteries.push(id); return id; }
  function surVisibilite() { document.hidden ? arreter() : demarrer(); }
  function demontage() {
    if (minuteur) { clearInterval(minuteur); minuteur = null; }
    minuteries.forEach(clearTimeout);
    minuteries = [];
    if (observateur) observateur.disconnect();
    document.removeEventListener('visibilitychange', surVisibilite);
    while (beams.firstChild) beams.removeChild(beams.firstChild);
  }

  function echeance(t) {
    if (t.reste > 0)  return 'dans ' + t.reste + ' j';
    if (t.reste === 0) return 'aujourd’hui';
    return 'depuis ' + (-t.reste) + ' j';
  }

  function ligne(t) {
    var e = document.createElement('div');
    e.className = 'cv-txt';
    e.innerHTML =
      '<span class="cv-det"><u>détecté</u><b>' + t.detJ + '</b>' + t.detM + '</span>' +
      '<span class="cv-c"><b>' + t.titre + '</b><span>' + t.ref + '</span></span>' +
      '<span class="cv-r"><span class="cv-v ' + (t.touche ? 'is-yes' : 'is-no') + '">' +
        (t.touche ? 'touche ce produit' : 'hors périmètre') + '</span>' +
        '<span class="cv-ech">applicable ' + echeance(t) + '</span></span>';
    return e;
  }

  function trait(depuis) {
    var s = scene.getBoundingClientRect();
    var a = depuis.getBoundingClientRect();
    var b = prod.getBoundingClientRect();
    var x1 = a.right - s.left, y1 = a.top - s.top + a.height / 2;
    var x2 = b.left  - s.left, y2 = b.top - s.top + b.height / 2;
    var mx = x1 + (x2 - x1) * 0.55;
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + mx + ',' + y1 + ' ' + mx + ',' + y2 + ' ' + x2 + ',' + y2);
    p.setAttribute('class', 'cv-beam');
    beams.appendChild(p);
    p.style.setProperty('--cv-len', p.getTotalLength());
    requestAnimationFrame(function () { p.classList.add('is-on'); });
    poser(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 1300);
  }

  function etape() {
    var t = CV_TEXTES[curseur % CV_TEXTES.length];
    curseur++;

    var e = ligne(t);
    liste.insertBefore(e, liste.firstChild);
    while (liste.children.length > CV_MAX) liste.removeChild(liste.lastChild);
    requestAnimationFrame(function () { e.classList.add('is-in'); });

    vus++; elVus.textContent = vus;

    poser(function () {
      if (!t.touche) { e.classList.add('is-out'); return; }
      trait(e);
      poser(function () {
        e.classList.add('is-hit');
        hits++; elHits.textContent = hits;
        prod.classList.add('is-hit');
        etatTxt.textContent = t.etat;
        fiche.classList.remove('is-on');
        poser(function () {
          fTitre.textContent = t.titre;
          fMeta.innerHTML = t.ref + '<br>applicable le ' + t.appTxt;
          fGain.innerHTML = 'Détecté <b>' + t.avance + ' jours</b> avant l’échéance.';
          fLien.href = t.url;
          fiche.classList.add('is-on');
        }, 160);
        poser(function () { prod.classList.remove('is-hit'); }, 2400);
      }, 780);
    }, 380);

    if (curseur % CV_TEXTES.length === 0) {
      poser(function () {
        hits = 0; vus = 0;
        elHits.textContent = '0'; elVus.textContent = '0';
        liste.innerHTML = '';
        fiche.classList.remove('is-on');
      }, 2800);
    }
  }

  etape();
  if (sobre) { etape(); etape(); return demontage; }

  function demarrer() {
    if (!amorce) { amorce = true; poser(etape, 260); poser(etape, 1150); }
    if (!minuteur) minuteur = setInterval(etape, CV_INTERVALLE);
  }
  function arreter()  { if (minuteur) { clearInterval(minuteur); minuteur = null; } }

  if ('IntersectionObserver' in window) {
    observateur = new IntersectionObserver(function (e) { e[0].isIntersecting ? demarrer() : arreter(); },
      { threshold: 0.2 });
    observateur.observe(scene);
  } else { demarrer(); }
  document.addEventListener('visibilitychange', surVisibilite);

  return demontage;
}
