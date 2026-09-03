/* GENERE PAR scripts/extract-veille.mjs — NE PAS EDITER A LA MAIN.
   Source : /Users/naomiehalioua/Downloads/cleo-composants/cleo-veille-animation.html
   (artefact 2bd199a4-ab28-4be5-a0b7-25be3d861a30, version du 04/08/2026)
   Le corps du composant, verbatim, l'image sortie du base64. */

export const VEILLE_MARKUP = `<div class="cv" role="img"
     aria-label="Veille réglementaire en continu. Cinq textes officiels réels arrivent avec leur date de détection et leur date d’application. Chacun est confronté à la fiche d’un produit du catalogue : trois le touchent et affichent l’avance prise sur l’échéance, deux sont hors périmètre.">

  <div class="cv__hd">
    <div>
      <p class="cv-t"><i></i>Veille en continu</p>
      <p class="cv-s">3 700 sources officielles · relevé du 4 août 2026 · textes réels</p>
    </div>
    <div class="cv__count"><b id="cv-hits">0</b> / <span id="cv-vus">0</span> textes touchent ce produit</div>
  </div>

  <div class="cv__scene" id="cv-scene">
    <svg class="cv__link" id="cv-link" aria-hidden="true" focusable="false"><g id="cv-beams"></g></svg>

    <div class="cv__flux">
      <div class="cv-lbl">Textes détectés</div>
      <div class="cv__list" id="cv-list"></div>
    </div>

    <div>
      <!-- LE PRODUIT : exemple de catalogue, à remplacer -->
      <div class="cv__prod" id="cv-prod">
        <img src="/veille/produit-3b9ed4d5.png" alt="">
        <span class="cv-nom">Coupe-vent à capuche</span>
        <span class="cv-ref">réf. CV-118 · polyamide enduit<br>FR · UK · DE</span>
        <span class="cv-etat" id="cv-etat"><i></i><span id="cv-etat-txt">Conforme au 4 août 2026</span></span>
      </div>

      <div class="cv__fiche" id="cv-fiche">
        <p class="cv-k">Le texte qui vient d’arriver</p>
        <p class="cv-h" id="cv-f-titre"></p>
        <span class="cv-m" id="cv-f-meta"></span>
        <span class="cv-gain" id="cv-f-gain"></span>
        <a class="cv-lien" id="cv-f-lien" href="#" target="_blank" rel="noopener">ouvrir au Journal officiel ↗</a>
      </div>
    </div>
  </div>
</div>`;
