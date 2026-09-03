/* GENERE PAR scripts/extract-veille.mjs — NE PAS EDITER A LA MAIN.
   Source : /Users/naomiehalioua/Downloads/cleo-composants/cleo-veille-animation.html
   (artefact 2bd199a4-ab28-4be5-a0b7-25be3d861a30, version du 04/08/2026)
   La feuille de style du composant, telle quelle. */

export const VEILLE_CSS = `.cv{
  --cv-blue:var(--c-blue,#0008CF);
  --cv-blue-soft:var(--c-blue-light,rgba(0,8,207,.06));
  --cv-blue-med:var(--c-blue-med,rgba(0,8,207,.12));
  --cv-ink:var(--c-ink,#1A1A1A);
  --cv-txt:var(--c-text-2,rgba(0,0,0,.62));
  --cv-mute:var(--c-text-3,rgba(0,0,0,.45));
  --cv-line:var(--c-border,rgba(0,0,0,.08));
  --cv-line2:var(--c-border-hover,rgba(0,0,0,.15));
  --cv-card:var(--c-card,#F0EFEC);
  --cv-r:var(--r-md,16px); --cv-rl:var(--r-lg,24px);
  --cv-mono:var(--mono,ui-monospace,SFMono-Regular,Menlo,Consolas,monospace);
  --cv-sh:var(--sh-md,0 8px 32px rgba(0,0,0,.06));
  --cv-shl:var(--sh-lg,0 16px 48px rgba(0,0,0,.08));
  font-family:inherit;color:var(--cv-ink);
  background:var(--cv-card);border-radius:var(--cv-rl);padding:26px 28px 28px}
.cv *{box-sizing:border-box}
.cv a{color:inherit}

.cv__hd{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:20px}
.cv__hd .cv-t{font-size:13.5px;font-weight:600;margin:0;display:flex;align-items:center;gap:9px}
.cv__hd .cv-t i{width:7px;height:7px;border-radius:99px;background:var(--cv-blue);flex:none;
  box-shadow:0 0 0 0 var(--cv-blue-med);animation:cv-pulse 2.4s infinite}
@keyframes cv-pulse{0%{box-shadow:0 0 0 0 var(--cv-blue-med)}70%{box-shadow:0 0 0 7px rgba(0,8,207,0)}100%{box-shadow:0 0 0 0 rgba(0,8,207,0)}}
.cv__hd .cv-s{font-size:12px;color:var(--cv-mute);margin:3px 0 0}
.cv__count{margin-left:auto;font-family:var(--cv-mono);font-size:11px;background:#fff;
  border:1px solid var(--cv-line);border-radius:99px;padding:6px 13px;white-space:nowrap}
.cv__count b{color:var(--cv-blue)}

.cv__scene{position:relative;display:grid;grid-template-columns:1fr 272px;gap:52px;align-items:start}
.cv__link{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:visible}
.cv-beam{stroke:var(--cv-blue);stroke-width:1.7;fill:none;stroke-linecap:round;
  stroke-dasharray:var(--cv-len);stroke-dashoffset:var(--cv-len);opacity:0}
.cv-beam.is-on{animation:cv-fly 1s cubic-bezier(.4,0,.2,1) forwards}
@keyframes cv-fly{0%{opacity:1;stroke-dashoffset:var(--cv-len)}72%{opacity:1;stroke-dashoffset:0}100%{opacity:0;stroke-dashoffset:0}}

.cv__flux{position:relative;z-index:2}
.cv__flux .cv-lbl{display:flex;align-items:center;gap:9px;font-family:var(--cv-mono);font-size:9.5px;
  letter-spacing:.09em;text-transform:uppercase;color:var(--cv-mute);margin-bottom:11px}
.cv__flux .cv-lbl:after{content:"";flex:1;height:1px;background:var(--cv-line)}
.cv__list{display:flex;flex-direction:column;gap:7px;min-height:340px}

.cv-txt{background:#fff;border:1px solid var(--cv-line);border-radius:var(--cv-r);padding:12px 14px;
  display:grid;grid-template-columns:70px 1fr 128px;gap:14px;align-items:center;
  opacity:0;transform:translateY(-8px);transition:opacity .4s,transform .4s,border-color .3s,background .3s}
.cv-txt.is-in{opacity:1;transform:none}
.cv-txt.is-hit{border-color:var(--cv-blue);background:var(--cv-blue-soft)}
.cv-txt.is-out{opacity:.5}
.cv-txt .cv-det{font-family:var(--cv-mono);font-size:9px;color:var(--cv-mute);line-height:1.3;letter-spacing:.04em}
.cv-txt .cv-det b{display:block;font-size:14px;color:var(--cv-ink);font-weight:600;letter-spacing:-.02em}
.cv-txt .cv-det u{display:block;text-decoration:none;text-transform:uppercase;font-size:8px;margin-bottom:2px;opacity:.7}
.cv-txt .cv-c{min-width:0}
.cv-txt .cv-c b{display:block;font-size:13px;font-weight:600;line-height:1.32}
.cv-txt.is-out .cv-c b{color:var(--cv-txt)}
.cv-txt .cv-c span{display:block;font-family:var(--cv-mono);font-size:9.5px;color:var(--cv-mute);margin-top:4px}
.cv-txt .cv-r{text-align:right}
.cv-txt .cv-v{display:inline-block;font-size:10px;font-weight:600;border-radius:99px;padding:4px 10px;white-space:nowrap}
.cv-txt .cv-v.is-yes{background:var(--cv-blue);color:#fff}
.cv-txt .cv-v.is-no{background:rgba(0,0,0,.05);color:var(--cv-mute)}
.cv-txt .cv-ech{display:block;font-family:var(--cv-mono);font-size:9px;color:var(--cv-mute);margin-top:5px}
.cv-txt.is-hit .cv-ech{color:var(--cv-blue)}

.cv__prod{position:relative;z-index:2;background:#fff;border:1px solid var(--cv-line);
  border-radius:var(--cv-r);box-shadow:var(--cv-shl);padding:16px;text-align:center;transition:box-shadow .3s}
.cv__prod.is-hit{box-shadow:0 0 0 3px var(--cv-blue-med),var(--cv-shl)}
.cv__prod img{width:104px;height:auto;display:block;margin:0 auto 10px;
  filter:drop-shadow(0 10px 16px rgba(0,0,0,.18))}
.cv__prod .cv-nom{display:block;font-size:14px;font-weight:600;line-height:1.3}
.cv__prod .cv-ref{display:block;font-family:var(--cv-mono);font-size:9.5px;color:var(--cv-mute);
  margin-top:5px;line-height:1.45;background:none;padding:0}
.cv__prod .cv-etat{display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:10.5px;
  font-weight:600;border:1px solid var(--cv-line);border-radius:99px;padding:5px 12px;transition:all .3s}
.cv__prod .cv-etat i{width:6px;height:6px;border-radius:99px;background:var(--cv-mute);transition:background .3s}
.cv__prod.is-hit .cv-etat{border-color:var(--cv-blue);color:var(--cv-blue)}
.cv__prod.is-hit .cv-etat i{background:var(--cv-blue)}

.cv__fiche{margin-top:12px;background:#fff;border:1px solid var(--cv-line);border-radius:var(--cv-r);
  padding:14px 15px;text-align:left;opacity:0;transform:translateY(6px);
  transition:opacity .4s,transform .4s;min-height:150px}
.cv__fiche.is-on{opacity:1;transform:none}
.cv__fiche .cv-k{font-family:var(--cv-mono);font-size:9px;letter-spacing:.08em;text-transform:uppercase;
  color:var(--cv-mute);margin:0 0 9px}
.cv__fiche .cv-h{font-size:12.5px;font-weight:600;line-height:1.35;margin:0}
.cv__fiche .cv-m{display:block;font-family:var(--cv-mono);font-size:9.5px;color:var(--cv-mute);margin-top:7px;line-height:1.6}
.cv__fiche .cv-gain{display:block;margin-top:10px;padding-top:10px;border-top:1px solid var(--cv-line);
  font-size:11px;line-height:1.45;color:var(--cv-txt)}
.cv__fiche .cv-gain b{color:var(--cv-blue);font-weight:600}
.cv__fiche .cv-lien{display:inline-block;margin-top:9px;font-family:var(--cv-mono);font-size:9.5px;color:var(--cv-blue)}

@media (prefers-reduced-motion:reduce){
  .cv__hd .cv-t i{animation:none}
  .cv-beam{opacity:.45;stroke-dashoffset:0;animation:none!important}
  .cv-txt,.cv__fiche{opacity:1;transform:none}
}
@media (max-width:900px){
  .cv{padding:20px}
  .cv__scene{grid-template-columns:1fr;gap:22px}
  .cv__link{display:none}
  .cv-txt{grid-template-columns:56px 1fr;gap:11px}
  .cv-txt .cv-r{grid-column:2;text-align:left;margin-top:2px}
  .cv__list{min-height:0}
}`;
