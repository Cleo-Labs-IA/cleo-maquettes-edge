/* Lane B — diagnostic élément par élément : qui est sous 14 px sur téléphone,
   qui est une cible sous 40 px, quel paragraphe est trop large.
   node rapports/lane-B/diag.mjs 03-offre 07-chat … */
import { chromium } from '/Users/naomiehalioua/cleo-landing/node_modules/playwright/index.mjs'
import path from 'path'
import { servir } from '/Users/naomiehalioua/cleo-maquettes-edge/commun/servir.mjs'

const SORTIE = '/Users/naomiehalioua/cleo-maquettes-edge/sortie'
const cibles = process.argv.slice(2)
const { url } = await servir(SORTIE)
const b = await chromium.launch()

const CHEMIN = `(e)=>{const p=[];let n=e;while(n&&n.tagName!=='BODY'){let s=n.tagName.toLowerCase();if(n.className&&typeof n.className==='string'){const c=n.className.trim().split(/\\s+/).slice(0,3).join('.');if(c)s+='.'+c}p.unshift(s);n=n.parentElement}return p.slice(-4).join(' > ')}`

const SONDE = new Function('return ' + `() => {
  const chemin = ${CHEMIN}
  const cs = e => getComputedStyle(e)
  const vis = e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 }
  const textes = [...document.querySelectorAll('body *')].filter(e => vis(e) && e.children.length === 0 && e.textContent.trim())
  const petits = textes.filter(e => parseFloat(cs(e).fontSize) < 14)
    .map(e => ({ px: +parseFloat(cs(e).fontSize).toFixed(1), t: e.textContent.trim().replace(/\\s+/g,' ').slice(0,60), ou: chemin(e) }))
  const cib = [...document.querySelectorAll('a[href],button')].filter(e => { const b = e.getBoundingClientRect(); return b.width>0&&b.height>0&&(b.height<40||b.width<40) })
    .map(e => { const b = e.getBoundingClientRect(); return { w: Math.round(b.width), h: Math.round(b.height), t: e.textContent.trim().replace(/\\s+/g,' ').slice(0,40), ou: chemin(e) } })
  const paras = [...document.querySelectorAll('p')].filter(vis).map(p => ({ w: Math.round(p.getBoundingClientRect().width), t: p.textContent.trim().slice(0,50), ou: chemin(p) })).filter(x => x.w > 700).sort((a,b)=>b.w-a.w)
  // débordement : qui dépasse la fenêtre
  const trop = [...document.querySelectorAll('body *')].filter(e => { const b = e.getBoundingClientRect(); return b.width>0 && (b.right > window.innerWidth + 1) })
    .map(e => ({ right: Math.round(e.getBoundingClientRect().right), w: Math.round(e.getBoundingClientRect().width), ou: chemin(e) })).slice(0,12)
  // titres, dans l'ordre
  const titres = [...document.querySelectorAll('h1,h2,h3,h4')].filter(vis).map(h => ({ n: h.tagName, px: +parseFloat(cs(h).fontSize).toFixed(1), c: h.className, t: h.textContent.trim().replace(/\\s+/g,' ').slice(0,55) }))
  return { petits, cib, paras, trop, titres }
}`)()

for (const nom of cibles) {
  for (const [lab, vp] of [['DESKTOP 1440', { width:1440, height:900 }], ['MOBILE 390', { width:390, height:844 }]]) {
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor:1, isMobile: vp.width===390, hasTouch: vp.width===390 })
    const p = await ctx.newPage()
    await p.goto(`${url}/${nom}.html`, { waitUntil:'load' })
    await p.waitForTimeout(700)
    await p.evaluate(async () => { const h=document.body.scrollHeight; for(let y=0;y<h;y+=600){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,30))} window.scrollTo(0,0) })
    await p.waitForTimeout(500)
    const r = await p.evaluate(SONDE)
    console.log(`\n━━━━━ ${nom} — ${lab} ━━━━━`)
    if (lab.startsWith('DESKTOP')) {
      console.log('TITRES :'); r.titres.forEach(t => console.log(`   ${t.n} ${t.px}px .${t.c} — ${t.t}`))
      console.log('PARAGRAPHES > 700 px :'); r.paras.forEach(x => console.log(`   ${x.w}px  ${x.ou}  « ${x.t} »`))
    } else {
      console.log(`TEXTES < 14 px (${r.petits.length}) :`); r.petits.forEach(x => console.log(`   ${x.px}px  ${x.ou}  « ${x.t} »`))
    }
    console.log(`CIBLES < 40 px (${r.cib.length}) :`); r.cib.forEach(x => console.log(`   ${x.w}×${x.h}  ${x.ou}  « ${x.t} »`))
    if (r.trop.length) { console.log('DÉBORDE :'); r.trop.forEach(x => console.log(`   right ${x.right} (w ${x.w})  ${x.ou}`)) }
    await ctx.close()
  }
}
await b.close()
process.exit(0)
