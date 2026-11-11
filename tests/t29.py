# Homegym 3.1 @ Joschy – Figuren: kein "Bart" bei der Frau, weiblicheres Gesicht/Pferdeschwanz, Frau/Mann-Proportionen.
# Vergleich gegen die eingefrorene 3.0 (tests/fixtures/v30/index.html = assets/index.html aus releases/Homegym-3.0.apk; anderer Ordner per HOMEGYM_V30): Gelenke + Griffpunkte identisch, Torso-Breiten verändert,
# Kinnbereich der Frau ohne dunkle Kontur (8 Designs, Seite + Front, stehend/liegend/Stütz), alle Übungen/Posen rendern, Tempo unverändert.
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
_V30=_os.environ.get('HOMEGYM_V30',_os.path.join(_REPO,'tests','fixtures','v30'))
if not _os.path.isfile(_os.path.join(_V30,'index.html')):raise SystemExit('FEHLT: 3.0-Vergleichsstand '+_V30+'/index.html (siehe tests/fixtures/README.txt)')
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright
NEW,OLD=8801,8802
srvs=[subprocess.Popen([sys.executable,'-m','http.server',str(p),'-d',d],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL) for p,d in[(NEW,_OUTDIR),(OLD,_V30)]];time.sleep(1)
THEMES=['arc','ironman','toxic','cyber','sunset','ice','stealth','day']
FAIL=[]
def chk(c,m):
    print(('ok   ' if c else 'FAIL ')+m)
    if not c:FAIL.append(m)
# render one frame into a fresh canvas, capture pose/transform (no RAF)
HELP=r"""window.__r=(key,g,f,W,H,still)=>{let host=document.getElementById('__h');if(!host){host=document.createElement('div');host.id='__h';host.style.cssText='position:fixed;left:0;top:0;z-index:99999';document.body.appendChild(host)}
  host.innerHTML='';const c=document.createElement('canvas');c.style.cssText=`width:${W}px;height:${H}px;display:block`;host.appendChild(c);
  attachAnim(c,key,still?{g,still:1}:{g});RUN.delete(c);c._t0=0;const T=c._loop?c._loop.T:cycT(c._def);let cap=null;const od=drawFig;drawFig=function(ctx,def,o,tr){cap={o,tr,def};return od.apply(this,arguments)};
  try{renderCanvas(c,f*T*1000)}finally{drawFig=od}return{c,cap,T}};
window.__pts=o=>{const m={};for(const q in o){const v=o[q];if(Array.isArray(v)&&v.length===2&&typeof v[0]==='number')m[q]=[+v[0].toFixed(6),+v[1].toFixed(6)];else if(q==='L'&&v)for(const k in v)m['L.'+k]=[+v[k][0].toFixed(6),+v[k][1].toFixed(6)]}return m};"""
GEO=r"""()=>{const out={};const keys=[...new Set(Object.keys(EX).map(animOf))].concat(YKEYS.map(k=>'y_'+k));
  for(const k of keys)for(const g of['m','f'])for(const f of[0,.21,.47,.73,.94]){const{cap}=__r(k,g,f,180,180,0);out[k+'|'+g+'|'+f]=__pts(cap.o)}return out}"""
DRAWN=r"""()=>{const bad=[];let n=0;const ex=Object.keys(EX),yk=YKEYS;
  for(const[list,pre]of[[ex,''],[yk,'y_']])for(const k0 of list){const k=pre?pre+k0:animOf(k0);for(const g of['m','f'])for(const[W,still,fs]of[[180,0,[0,.35,.7]],[72,1,[0]]])for(const f of fs){const{c}=__r(k,g,f,W,W,still);
    const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let a=0;for(let i=3;i<d.length;i+=8)if(d[i]>40)a++;n++;if(a<(W<110?40:300))bad.push([k0,g,W,f,a])}}
  return{n,bad}}"""
# chin samples: side = head frame (forward f, up v) of the new face outline; front = head-radius units
CHIN=r"""([key,g,f])=>{const{c,cap}=__r(key,g,f,390,420,0);const o=cap.o,tr=cap.tr,def=cap.def;const B=BODY[g];const s=tr.s,dpr=c.width/390;const ctx=c.getContext('2d');
  const px=([X,Y])=>{const d=ctx.getImageData(Math.round(X*dpr),Math.round(Y*dpr),1,1).data;return[d[0],d[1],d[2],d[3]]};const lum=p=>.2126*p[0]+.7152*p[1]+.0722*p[2];
  let S=[],Rf=[];
  if(!o.front){const hA=o._hA!=null?o._hA:o._torso+(def.A.neck||0)+(o._neckOff||0);const hu=[Math.cos(hA*Math.PI/180),Math.sin(hA*Math.PI/180)];let hF=[hu[1],-hu[0]];if(def.flip)hF=[-hF[0],-hF[1]];
    const at=(F,v)=>{const w=[o.head[0]+(hF[0]*F+hu[0]*v)*B.head,o.head[1]+(hF[1]*F+hu[1]*v)*B.head];return[tr.ox+w[0]*s,tr.oy-w[1]*s]};
    for(const F of[.3,.45,.6,.72])for(const v of[-.47,-.56,-.64])S.push(at(F,v));Rf=[at(.35,-.12),at(.2,.05),at(.45,.55)]}
  else{const T=o._T;let hx=o.L.head[0],hy=o.L.head[1];/* local -> world like drawFront (lean about the pelvis); tilt ignored (only for crops without tilt) */
    const ln=T.lean||0,c_=Math.cos(-ln*Math.PI/180),sn=Math.sin(-ln*Math.PI/180);const d=[hx,hy-92];const w=[T.hx+d[0]*c_-d[1]*sn,T.hy+d[0]*sn+d[1]*c_];const H=[tr.ox+w[0]*s,tr.oy-w[1]*s],hr=B.head*s;
    for(const X of[-.22,0,.22])for(const Y of[.72,.8,.88])S.push([H[0]+X*hr,H[1]+Y*hr]);Rf=[[H[0]-.62*hr,H[1]+.15*hr],[H[0]+.62*hr,H[1]+.15*hr]]}
  const ref=Rf.map(px).map(lum).reduce((a,b)=>a+b,0)/Rf.length;const v=S.map(px);const L=v.map(lum);const mn=Math.min(...L);
  return{ref:+ref.toFixed(1),min:+mn.toFixed(1),ratio:+(mn/ref).toFixed(3),opaque:v.every(p=>p[3]>200)}}"""
WIDTH=r"""([key,g,f])=>{const{c,cap}=__r(key,g,f,390,420,0);const tr=cap.tr,o=cap.o;const ox=c._offB.getContext('2d');const dpr=c.width/390;const out={};
  for(const[n,y]of[['chest',o.shY-12],['waist',o.shY-31],['shoulder',o.shY]]){const Y=Math.round((tr.oy-y*tr.s)*dpr);const d=ox.getImageData(0,Y,c.width,1).data;const cx=Math.round((tr.ox+o.L.neck[0]*tr.s)*dpr);
    let l=cx,r=cx;while(l>0&&d[(l-1)*4+3]>128)l--;while(r<c.width-1&&d[(r+1)*4+3]>128)r++;out[n]=+((r-l)/dpr/tr.s).toFixed(2)}
  return out}"""
SIDEW=r"""([key,g,f])=>{const{c,cap}=__r(key,g,f,390,420,0);const tr=cap.tr,o=cap.o;const ox=c._offB.getContext('2d');const dpr=c.width/390;const out={};
  for(const[n,t]of[['bust',.74],['waist',.45],['seat',.12]]){const y=o.hip[1]+(o.sh[1]-o.hip[1])*t,x0=o.hip[0]+(o.sh[0]-o.hip[0])*t;const Y=Math.round((tr.oy-y*tr.s)*dpr);const d=ox.getImageData(0,Y,c.width,1).data;const cx=Math.round((tr.ox+x0*tr.s)*dpr);
    let l=cx,r=cx;while(l>0&&d[(l-1)*4+3]>128)l--;while(r<c.width-1&&d[(r+1)*4+3]>128)r++;out[n]=+((r-l)/dpr/tr.s).toFixed(2)}return out}"""
ARMW=r"""([key,g,f])=>{const{c,cap}=__r(key,g,f,390,420,0);const tr=cap.tr,o=cap.o;const ox=c._offB.getContext('2d');const dpr=c.width/390;
  const m=[(o.shR[0]+o.elbR[0])/2,(o.shR[1]+o.elbR[1])/2];const X=Math.round((tr.ox+m[0]*tr.s)*dpr),Y0=Math.round((tr.oy-m[1]*tr.s)*dpr);const d=ox.getImageData(X,0,1,c.height).data;
  let a=Y0,b=Y0;while(a>0&&d[(a-1)*4+3]>128)a--;while(b<c.height-1&&d[(b+1)*4+3]>128)b++;return+((b-a)/dpr/tr.s).toFixed(2)}"""
PERF=r"""()=>{const ks=['squat','bench','deadlift','pushup','curl','lateral','y_hund','y_krieger2','y_savasana','run'];const t0=performance.now();let n=0;
  for(let rep=0;rep<3;rep++)for(const k of ks)for(const g of['m','f'])for(let i=0;i<8;i++){__r(k,g,i/8,390,420,0);n++}return(performance.now()-t0)/n}"""
async def page(b,port):
    pg=await b.new_page(viewport={'width':390,'height':844},device_scale_factor=2);errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    await pg.goto(f'http://127.0.0.1:{port}/index.html');await pg.wait_for_timeout(500)
    await pg.evaluate("()=>{S.profile={name:'Joschy',gear:[...JOSCHYGEAR],preset:'joschy'};S.settings.voiceMode='off';save();location.reload()}");await pg.wait_for_timeout(700)
    await pg.evaluate("()=>{"+HELP+"}");return pg,errs
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pn,en=await page(b,NEW);po,eo=await page(b,OLD)
        v=await pn.evaluate("[APP_VER,BK_VER,typeof BODY.f.fr.shV]");chk(v==['3.1',5,'number'],'version 3.1 / backup format 5 '+str(v))
        await pn.evaluate("go('set')");vl=await pn.text_content('#verLine');chk('Version 3.1 · @ Joschy' in vl,vl)
        # 1) joints + grip points identical to 3.0 (all strength animations + yoga loops incl. transitions, both figures, 5 moments)
        gn=await pn.evaluate(GEO);go=await po.evaluate(GEO)
        diff=[(k,q) for k in go for q in go[k] if gn.get(k,{}).get(q)!=go[k][q]]
        miss=[k for k in go if set(go[k])-set(gn.get(k,{}))]
        chk(len(gn)==len(go)>=150*2*5 and not diff and not miss,f'joints/grip points identical to 3.0: {len(gn)} frames, diffs {len(diff)} {diff[:4]}')
        grip=[q for k in gn for q in gn[k] if q in('_gH','_gH2')];chk(len(grip)>500,f'grip centres compared ({len(grip)} hand-to-device points)')
        # 2) every exercise (111) + yoga pose (56) renders for both figures, big + 72 px preview
        r=await pn.evaluate(DRAWN);chk(r['n']>=(111+56)*2*4 and not r['bad'],f"all exercises/poses render: {r['n']} renders, empty {r['bad'][:5]}")
        # 3) chin region of the woman: no dark contour/shadow colour, every design (side, front, lying, plank), 3.0 shows the problem
        cases=[('curl',.3),('squat',.3),('bench',0),('pushup',.3),('y_kobra',.5),('lateral',.3),('y_berg',.5)]
        worst={};old_bad=0
        for th in THEMES:
            for pg in(pn,po):await pg.evaluate(f"()=>{{S.settings.theme='{th}';applyTheme('{th}')}}")
            for k,f in cases:
                a=await pn.evaluate(CHIN,[k,'f',f]);o=await po.evaluate(CHIN,[k,'f',f])
                worst[th]=min(worst.get(th,9),a['ratio']);old_bad+=o['ratio']<.86
                if not(a['ratio']>=.86 and a['opaque']):chk(False,f'chin {th} {k} {a}')
            chk(worst[th]>=.86,f'chin clean in design {th}: darkest chin pixel >= 86 % of cheek brightness (min {worst[th]})')
        chk(old_bad>=len(THEMES),f'3.0 reference fails the same chin check ({old_bad} of {len(THEMES)*len(cases)} cases dark)')
        for pg in(pn,po):await pg.evaluate("()=>{S.settings.theme='arc';applyTheme('arc')}")
        # 4) torso widths measurably changed (front: shoulder/chest/waist, side: bust/waist/seat)
        for g in['m','f']:
            a=await pn.evaluate(WIDTH,['lateral',g,.3]);o=await po.evaluate(WIDTH,['lateral',g,.3]);print(' front',g,'3.0',o,'3.1',a)
            if g=='m':chk(a['shoulder']>o['shoulder']+4 and a['chest']>o['chest']+6 and a['waist']<o['waist'],'man: broader shoulders + chest, narrower waist (V)')
            else:chk(a['chest']>o['chest']+1.5 and a['waist']<o['waist']-1,'woman: more bust, narrower waist (front)')
            aw=await pn.evaluate(ARMW,['lateral',g,.3]);ow=await po.evaluate(ARMW,['lateral',g,.3]);print(' upper arm',g,ow,'->',aw)
            if g=='m':chk(aw>ow*1.15,f'man: upper arm at least 15 % thicker ({ow} -> {aw})')
            a=await pn.evaluate(SIDEW,['curl',g,0]);o=await po.evaluate(SIDEW,['curl',g,0]);print(' side ',g,'3.0',o,'3.1',a)
            if g=='f':chk(a['seat']>o['seat']+2.5 and a['bust']>o['bust']+1.5 and a['waist']<o['waist'],'woman: more hip/seat + bust, narrower waist (side)')
            else:chk(a['bust']>o['bust']+4 and a['waist']<o['waist'],'man: deeper chest, narrower waist (side)')
        # 5) performance unchanged (render time per frame within 25 % of 3.0)
        tn=min([await pn.evaluate(PERF) for _ in range(2)]);to=min([await po.evaluate(PERF) for _ in range(2)])
        chk(tn<=to*1.25+.15,f'render time per frame {tn:.2f} ms (3.0: {to:.2f} ms)')
        chk(not en,'no JS errors 3.1 '+str(en[:3]))
        await b.close()
    print('ALL OK' if not FAIL else 'FAILED: '+str(len(FAIL)))
try: asyncio.run(main())
finally:
    for s in srvs:s.kill()
