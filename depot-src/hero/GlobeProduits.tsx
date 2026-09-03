'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

/* ================================================================
   LE GLOBE, LES PRODUITS EN ORBITE, ET LA VILLE OU CHACUN SE VEND.

   Le globe est celui de Naomie (Rotating Particle Globe, canvas 2D,
   21 Ko, vendorise). C'est une sphere TOUT EN BLEU posee sur la page
   blanche : son rendu etant additif, il lui faut une sphere sombre,
   et c'est le bleu de marque qui la fait.

   Il s'attrape et se tourne a la main, comme l'animation d'origine.
   Le lacet ajoute par la main est lu sur etatRef et ajoute a l'angle
   des produits, sinon ils continueraient sur leur horloge pendant que
   le globe tourne sous eux, et les traits mentiraient.

   Trois objets tournent ensemble, a la meme periode de 12 s :
     - la vignette du produit, sur l'orbite exterieure ;
     - un point sur le globe, la ou ce produit se vend ;
     - le nom de la ville, pose contre ce point.
   Un trait relie la vignette a son point, pour qu'on lise « ce produit,
   la-bas ». Tout est CALCULE dans la meme boucle, donc le trait ne peut
   pas se desynchroniser de ce qu'il relie.

   Les villes ne sont pas decoratives : chaque produit est accroche au
   marche qui FAIT LA REGLE pour sa famille, aux coordonnees reelles de
   cette ville, et sa position a l'ecran sort de la projection meme du
   composant. Tourner le globe a la main deplace donc les produits comme
   il deplace ses propres points.
   ================================================================ */

const ParticleGlobe = dynamic(() => import('./RotatingParticleGlobe'), { ssr: false });

/** Un tour, en secondes. Egal a 12 s / vitesse du globe. */
const PERIODE = 12;
const VITESSE = 1;

/* Le composant dessine sa sphere a R = Math.min(W,H) * 0.4, donc elle
   n'occupe que 80 % de son canvas et son fond deborde de 20 % tout
   autour. On decoupe le canvas sur un disque un peu plus large que la
   sphere, juste assez pour garder l'eclat des particules de bord : le
   bleu s'arrete au globe et ne bave plus sur la page. */
const DISQUE = 0.86;

export type Produit = {
  fichier: string;
  nom: string;
  /** Le marche, ecrit sur le globe. */
  ville: string;
  /** Coordonnees REELLES de cette ville : le point tombe ou il doit. */
  lat: number;
  lon: number;
  /** Pourquoi cette ville pour ce produit. Rendu en infobulle. */
  regle: string;
};

/* LA LOGIQUE DES VILLES.

   Chaque produit est place sur le marche qui FAIT LA REGLE pour sa
   famille, pas sur une ville decorative, et aux coordonnees reelles de
   cette ville. Le globe cesse d'etre un decor : il dit ou se decide ce
   qui s'applique a l'objet qu'on lui accroche.

   Les references ci-dessous sont de notoriete, elles n'ont pas ete
   re-verifiees en source primaire pour cette maquette : a passer par
   l'API legale avant que quoi que ce soit sorte du local. */
export const PRODUITS: Produit[] = [
  {
    fichier: 'ours.png', nom: 'Peluche', ville: 'Bruxelles', lat: 50.85, lon: 4.35,
    regle: 'Sécurité des jouets, directive 2009/48/CE',
  },
  {
    fichier: 'casque.png', nom: 'Casque audio', ville: 'Tokyo', lat: 35.68, lon: 139.69,
    regle: 'Marquage PSE, loi japonaise sur la sécurité des appareils électriques',
  },
  {
    fichier: 'briquet.png', nom: 'Briquet', ville: 'Washington', lat: 38.9, lon: -77.04,
    regle: 'Briquets à sécurité enfant, 16 CFR 1210',
  },
  {
    fichier: 'refrigerateur.png', nom: 'Réfrigérateur', ville: 'Sydney', lat: -33.87, lon: 151.21,
    regle: 'Étiquetage énergétique GEMS, Australie',
  },
  {
    fichier: 'voiture.png', nom: 'Caisse automobile', ville: 'New Delhi', lat: 28.61, lon: 77.21,
    regle: 'Homologation véhicules, règles CMVR et normes AIS',
  },
  {
    fichier: 'fauteuil.png', nom: 'Fauteuil', ville: 'Sacramento', lat: 38.58, lon: -121.49,
    regle: 'Inflammabilité du mobilier rembourré, Californie TB 117-2013',
  },
  {
    fichier: 'jean.png', nom: 'Jean', ville: 'São Paulo', lat: -23.55, lon: -46.63,
    regle: 'Étiquetage textile, réglementation INMETRO, Brésil',
  },
];

/* ---- La projection du globe, reprise a l'identique de son code ----
   ll() puis rot(), puis la perspective et le placement a l'ecran. Les
   produits tombent ainsi exactement la ou le globe met ce point, et
   suivent le lacet ET le basculement quand on l'attrape. */
const ll = (lat: number, lon: number) => {
  const a = (lat * Math.PI) / 180;
  const o = (lon * Math.PI) / 180;
  return { x: Math.cos(a) * Math.cos(o), y: Math.sin(a), z: Math.cos(a) * Math.sin(o) };
};

const rot = (p: { x: number; y: number; z: number }, ay: number, ax: number) => {
  const cy = Math.cos(ay);
  const sy = Math.sin(ay);
  const x = p.x * cy + p.z * sy;
  const z0 = -p.x * sy + p.z * cy;
  const y0 = p.y;
  const cx = Math.cos(ax);
  const sx = Math.sin(ax);
  return { x, y: y0 * cx - z0 * sx, z: y0 * sx + z0 * cx };
};

/** Le rapprochement de perspective du composant. */
const persp = (z: number) => 1 / (1 - z * 0.28);
/** Son inclinaison de repos. */
const AX_REPOS = -0.25;
/** Le rayon de sa sphere, en fraction du cote. */
const R_SPHERE = 0.4;

function Vignette({ p, taille }: { p: Produit; taille: number }) {
  /* La disponibilite se teste au montage plutot qu'avec onError : le
     navigateur charge l'image du rendu serveur AVANT que React ne pose
     ses gestionnaires, donc un onError arrive trop tard. */
  const [absente, setAbsente] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setAbsente(false);
    img.onerror = () => setAbsente(true);
    img.src = `/globe-produits/${p.fichier}`;
  }, [p.fichier]);

  return (
    <div
      style={{
        width: taille,
        height: taille,
        borderRadius: 20,
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 14px 34px rgba(10,16,48,0.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        overflow: 'hidden',
      }}
      title={`${p.nom} · ${p.ville} — ${p.regle}`}
    >
      {absente ? (
        <span
          style={{
            fontSize: 11,
            lineHeight: 1.35,
            textAlign: 'center',
            color: '#8C8C8C',
            fontFamily: 'Satoshi, system-ui, sans-serif',
          }}
        >
          {p.nom}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/globe-produits/${p.fichier}`}
          alt={p.nom}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      )}
    </div>
  );
}

export function GlobeProduits({
  taille = 620,
  produits = PRODUITS,
  /** Le fond derriere le globe. 'transparent' quand il se pose dans une
   *  page qui a deja le sien, sinon on voit un carre blanc. */
  fond = '#FFFFFF',
}: {
  taille?: number;
  produits?: Produit[];
  fond?: string;
}) {
  const rayonOrbite = taille * 0.47;
  const rayonGlobe = taille * 0.33;
  const cote = Math.round(taille * 0.155);

  const vignettes = useRef<(HTMLDivElement | null)[]>([]);
  const points = useRef<(HTMLDivElement | null)[]>([]);
  const traits = useRef<(SVGLineElement | null)[]>([]);
  /** L'etat d'interaction du globe, relaye par le composant.
   *  drag.offY = lacet a la main, drag.offX = basculement a la main,
   *  mouse.tiltY / tiltX = la parallaxe au survol. */
  const etat = useRef<{
    drag?: { offY?: number; offX?: number };
    mouse?: { tiltY?: number; tiltX?: number };
  } | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const t0 = performance.now();
    const c = taille / 2;

    const boucle = (t: number) => {
      const temps = (t - t0) / 1000;
      const e = etat.current;
      //  Les deux angles du composant, dans sa propre formule :
      //    ay = temps / 12 * 2pi + parallaxe + lacet a la main
      //    ax = -0,25         + parallaxe + basculement a la main
      //  Les produits suivent donc la rotation ET le basculement.
      const ay = (temps / PERIODE) * Math.PI * 2 * VITESSE + (e?.mouse?.tiltY ?? 0) + (e?.drag?.offY ?? 0);
      const ax = AX_REPOS + (e?.mouse?.tiltX ?? 0) + (e?.drag?.offX ?? 0);
      const R = taille * R_SPHERE;

      produits.forEach((p, i) => {
        const q = rot(ll(p.lat, p.lon), ay, ax);
        const k = persp(q.z);
        //  a l'ecran, comme le composant place ses propres reperes
        const xp = q.x * R * k;
        const yp = -q.y * R * k;
        //  q.z > 0 : le point est sur la face visible
        const devant = q.z > 0;
        const vue = Math.max(0, Math.min(1, (q.z - 0.02) / 0.28));

        //  la vignette se pose dans le prolongement du rayon qui va du
        //  centre vers la ville : elle reste donc toujours au-dessus de
        //  son point, quelle que soit la rotation
        const norme = Math.hypot(xp, yp) || 1;
        const xv = (xp / norme) * rayonOrbite;
        const yv = (yp / norme) * rayonOrbite;

        const v = vignettes.current[i];
        if (v) {
          v.style.transform = `translate3d(${xv}px, ${yv}px, 0) scale(${0.82 + 0.18 * Math.max(0, q.z)})`;
          v.style.opacity = String(0.06 + 0.94 * vue);
          v.style.zIndex = devant ? '3' : '0';
        }

        const pt = points.current[i];
        if (pt) {
          pt.style.transform = `translate3d(${xp}px, ${yp}px, 0) scale(${0.85 + 0.15 * Math.max(0, q.z)})`;
          pt.style.opacity = String(vue);
          pt.style.zIndex = devant ? '2' : '0';
        }

        const tr = traits.current[i];
        if (tr) {
          tr.setAttribute('x1', String(c + xp));
          tr.setAttribute('y1', String(c + yp));
          tr.setAttribute('x2', String(c + xv));
          tr.setAttribute('y2', String(c + yv));
          tr.setAttribute('opacity', String(vue * 0.5));
        }
      });

      raf = requestAnimationFrame(boucle);
    };

    raf = requestAnimationFrame(boucle);
    return () => cancelAnimationFrame(raf);
  }, [produits, rayonOrbite, rayonGlobe, taille, cote]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: taille,
        aspectRatio: '1',
        margin: '0 auto',
        background: fond,
      }}
    >
      {/* Le globe, TOUT EN BLEU, sur la page blanche.

          Son rendu empile les particules en fusion additive : sur un
          fond clair tout sature et le globe s'efface. Il lui faut donc
          une sphere sombre, et c'est le bleu de marque qui la fait, du
          plus clair au centre au plus profond sur les bords. Plus
          d'inversion de couleurs : la couleur est reglee a la source.

          Le globe s'attrape et se tourne, comme dans l'animation
          d'origine, et son etat d'interaction est relaye par etatRef
          pour que les produits suivent la main. */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: taille * DISQUE,
          height: taille * DISQUE,
          marginLeft: (-taille * DISQUE) / 2,
          marginTop: (-taille * DISQUE) / 2,
          borderRadius: '50%',
          overflow: 'hidden',
          zIndex: 1,
          cursor: 'grab',
        }}
      >
        <ParticleGlobe
          etatRef={etat}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: taille,
            height: taille,
            marginLeft: -taille / 2,
            marginTop: -taille / 2,
          }}
          motion={{ speed: VITESSE, density: 55, particleSize: 1, autoPlay: true }}
          layers={{ showWireframe: true, showStars: false, showHotspots: true, showMarkers: false }}
          interaction={{ enableDrag: true, enableParallax: true }}
          appearance={{
            bgCenter: '#1A28D8',
            bgEdge: '#00043A',
            dotColor: '#AFC0FF',
            wireColor: '#7C8CF0',
            markerColor: '#FFFFFF',
            accentColor: '#9FD4FF',
            hotColor: '#5B6BFF',
            cornerRadius: '0px',
          }}
        />
      </div>

      {/* les traits qui relient chaque produit a sa ville */}
      <svg
        viewBox={`0 0 ${taille} ${taille}`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {produits.map((p, i) => (
          <line
            key={p.fichier}
            ref={(el) => {
              traits.current[i] = el;
            }}
            stroke="#FFFFFF"
            strokeWidth={1.2}
            strokeDasharray="3 3"
            opacity={0}
          />
        ))}
      </svg>

      {/* le nom de la ville, pose sur le globe */}
      {produits.map((p, i) => (
        <div
          key={`ville-${p.fichier}`}
          ref={(el) => {
            points.current[i] = el;
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            transformOrigin: 'left center',
            pointerEvents: 'none',
            fontFamily: 'Satoshi, system-ui, sans-serif',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: '#FFFFFF',
              boxShadow: '0 0 0 3px rgba(255,255,255,0.30)',
              flex: '0 0 auto',
            }}
          />
          {/* halo blanc : le nom se pose sur les points du globe */}
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              textShadow:
                '0 1px 3px rgba(0,4,58,0.85), 0 0 10px rgba(0,4,58,0.65)',
            }}
          >
            {p.ville}
          </span>
        </div>
      ))}

      {/* les produits */}
      {produits.map((p, i) => (
        <div
          key={p.fichier}
          ref={(el) => {
            vignettes.current[i] = el;
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginLeft: -cote / 2,
            marginTop: -cote / 2,
            willChange: 'transform, opacity',
          }}
        >
          <Vignette p={p} taille={cote} />
        </div>
      ))}
    </div>
  );
}
