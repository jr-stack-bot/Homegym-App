# Homegym 2.2 @ Joschy – Yoga "ganzer Weg": jede Haltung als Schleife Stand -> hinein -> halten -> zurück -> Stand
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright
D=_SHOTS.rstrip('/')
srv=subprocess.Popen([sys.executable,'-m','http.server','8781','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8781/index.html'
CHECK=r"""()=>{const R={hip:7,sh:6,head:8.5,knee:4,knee2:4,elbow:3,elbow2:3,toe:0,toe2:0,ankle:0,ankle2:0,hand:0,hand2:0};
  const pts=o=>{const m={};for(const q in o){const v=o[q];if(Array.isArray(v)&&v.length===2&&typeof v[0]==='number')m[q]=v}return m};
  const same=(a,b)=>{let d=0;for(const q in a)if(b[q])d=Math.max(d,Math.hypot(a[q][0]-b[q][0],a[q][1]-b[q][1]));return d};
  const res=[];
  for(const k of YKEYS){const def=AN['y_'+k];for(const g of['m','f']){const L_=yLoopOf(def,g);const bad=[];const dt=1/60;
    // timing: stand 1-2 s, in 3-5 s, hold 4-6 s (animation), back 3-4 s
    if(!(YL.stand>=1&&YL.stand<=2&&L_.entry>=3&&L_.entry<=5&&L_.H.dur>=4&&L_.H.dur<=6&&L_.exit>=3&&L_.exit<=4))bad.push('timing');
    // start and end frame are the relaxed stand, identical (seamless loop)
    const r0=yLoopPose(L_,0),r1=yLoopPose(L_,L_.T-1e-4);if(r0.stage!=='stand'||r1.stage!=='stand')bad.push('stand-stage');
    const o0=r0.o;const upright=o0.front?Math.min(o0.hipL[1],o0.hipR[1])>85&&o0.ankL[1]<1&&o0.ankR[1]<1:o0.hip[1]>85&&o0.ankle[1]<1&&o0.ankle2[1]<1&&o0.head[1]>160;if(!upright)bad.push('not-upright');
    if(same(pts(o0),pts(r1.o))>1.5)bad.push('loop-seam');
    // order of the stages over one cycle
    const seq=[];let hpen={},hclr=1e9;
    // hold phase = the authored end pose animation (exact)
    let hd=0;for(let t=0;t<L_.H.dur;t+=.25){const lt=YL.stand/2+L_.entry+t;const a=yLoopPose(L_,lt);if(a.stage!=='hold')continue;const b=animPose(def,t*L_.H.f,g).o;hd=Math.max(hd,same(pts(a.o),pts(b)));
      if(!b.front){let mn=1e9;for(const q in R){hpen[q]=Math.max(hpen[q]||0,-(b[q][1]-R[q]));mn=Math.min(mn,b[q][1]-R[q])}hclr=Math.min(hclr,mn)}else hclr=Math.min(hclr,Math.min(b.ankL[1],b.ankR[1],b.hipL[1]-13,b.hipR[1]-13))}
    if(hd>.01)bad.push('hold!=pose '+hd.toFixed(2));
    let prev=null,pv=null,step=0,acc=0,pen=0,flo=0,stepAt='';
    for(let t=0;t<=L_.T+1e-9;t+=dt){const r=yLoopPose(L_,t);if(!seq.length||seq[seq.length-1]!==r.stage)seq.push(r.stage);const m=pts(r.o);
      if(prev){for(const q in m){if(!prev[q])continue;const d=Math.hypot(m[q][0]-prev[q][0],m[q][1]-prev[q][1]);if(d>step){step=d;stepAt=q+'@'+t.toFixed(2)}
        if(pv&&pv[q]){const a=Math.hypot(m[q][0]-2*prev[q][0]+pv[q][0],m[q][1]-2*prev[q][1]+pv[q][1]);acc=Math.max(acc,a)}}}
      pv=prev;prev=m;const o=r.o;
      if(o.front){pen=Math.max(pen,-Math.min(o.ankL[1],o.ankR[1]));flo=Math.max(flo,Math.min(o.ankL[1],o.ankR[1],o.hipL[1]-13,o.hipR[1]-13)-Math.max(0,hclr))}
      else{let mn=1e9;for(const q in R){pen=Math.max(pen,-(o[q][1]-R[q])-(hpen[q]||0));mn=Math.min(mn,o[q][1]-R[q])}flo=Math.max(flo,mn-Math.max(0,hclr))}}
    if(seq.join()!=='stand,in,hold,out,stand')bad.push('stages '+seq.join());
    if(step>5)bad.push('jump '+step.toFixed(1)+' '+stepAt);
    if(acc>8)bad.push('snap '+acc.toFixed(1));
    if(pen>2)bad.push('floor '+pen.toFixed(1));
    if(flo>3.5)bad.push('floating '+flo.toFixed(1));
    res.push({k,g,bad,step:+step.toFixed(1),acc:+acc.toFixed(1),T:+L_.T.toFixed(1)})}}
  return res}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844});pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await pg.wait_for_timeout(400)
        await pg.evaluate("()=>{S.profile={name:'Joschy',gear:[...JOSCHYGEAR],preset:'joschy'};S.settings.voiceMode='off';save();location.reload()}");await pg.wait_for_timeout(600)
        # 1) all 56 poses x m/f: loop structure, stand at start/end, hold = end pose, smooth, floor, no floating
        r=await pg.evaluate(CHECK)
        bad=[x for x in r if x['bad']];print('loops',len(r),'worst step',max(x['step'] for x in r),'worst snap',max(x['acc'] for x in r),'T',min(x['T'] for x in r),'-',max(x['T'] for x in r))
        assert len(r)==2*56 and not bad,bad
        # 2) every loop actually renders (both figures, 12 moments), no exceptions
        n=await pg.evaluate("""()=>{const c=document.createElement('canvas');c.style.cssText='position:fixed;left:0;top:0;width:200px;height:220px';document.body.appendChild(c);let n=0,bad=[];
          for(const k of YKEYS)for(const g of['m','f']){attachAnim(c,'y_'+k,{g});RUN.delete(c);c._t0=0;if(!c._loop){bad.push(k);continue}for(let i=0;i<12;i++){renderCanvas(c,i*c._loop.T/12*1000/animSpd());const x=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let px=0;for(let j=3;j<x.length;j+=16)if(x[j]>0)px++;if(px<300)bad.push([k,g,i]);n++}}
          c.remove();return{n,bad}}""")
        print('frames rendered',n['n']);assert not n['bad'],n['bad']
        # 3) library minis stay still end poses, the detail sheet shows the loop
        await pg.click('[data-tab=lib]');await pg.wait_for_timeout(200);await pg.click('[data-lm=yoga]');await pg.wait_for_timeout(400)
        lb=await pg.evaluate("()=>{const m=[...document.querySelectorAll('[data-ymini]')];return{n:m.length,still:m.every(c=>c._still&&!c._loop)}}")
        assert lb['n']==56 and lb['still'],lb
        await pg.screenshot(path=D+'/library.png')
        await pg.click('[data-ypose="katzekuh"]');await pg.wait_for_timeout(300)
        sh=await pg.evaluate("()=>{const c=document.getElementById('ysc');return{loop:!!c._loop,still:c._still}}");assert sh['loop'] and not sh['still'],sh
        await pg.wait_for_timeout(2600);lbl=await pg.text_content('#ysp');print('sheet phase',lbl);assert lbl in('Hineingehen','Ankommen · atmen')
        await pg.screenshot(path=D+'/sheet.png');await pg.click('#sheet [data-close]')
        # 4) run screen: loop runs independently of the countdown, ring/countdown unchanged, loop time survives re-renders
        await pg.evaluate("()=>{yStart('quick');const r=S.yrun;r.steps=[{k:'kind',sec:30,side:0,part:'main'},{k:'figur4',sec:30,side:1,part:'main'},{k:'figur4',sec:30,side:2,part:'main'}];r.i=0;r.ph='hold';r.end=Date.now()+30000;save();yRender()}")
        await pg.wait_for_timeout(300)
        ru=await pg.evaluate("()=>{const c=document.getElementById('ycv');return{loop:!!c._loop,ring:!!document.getElementById('yRc'),tm:document.getElementById('yTm').textContent,t0:c._t0}}")
        assert ru['loop'] and ru['ring'] and ru['tm'],ru
        await pg.wait_for_timeout(800);await pg.evaluate("()=>yRender()");t0b=await pg.evaluate("document.getElementById('ycv')._t0")
        assert abs(t0b-ru['t0'])<2,('loop restarted on re-render',t0b,ru['t0'])
        await pg.wait_for_timeout(3200);await pg.screenshot(path=D+'/run.png')
        await pg.click('#yS') if await pg.is_visible('#yS') else None
        await pg.evaluate("()=>{yJump(1)}");await pg.wait_for_timeout(200)
        t0c=await pg.evaluate("document.getElementById('ycv')._t0");assert t0c-t0b>500,'new pose starts its loop from the stand'
        await pg.evaluate("()=>{S.yrun=null;save();yClose()}")
        # 5) animation speed setting slows the loop too
        sp=await pg.evaluate("""()=>{const mk=()=>{const c=document.createElement('canvas');c.style.cssText='position:fixed;left:0;top:0;width:220px;height:240px';document.body.appendChild(c);attachAnim(c,'y_hund',{g:'m'});RUN.delete(c);c._t0=0;return c};
          const px=c=>Array.from(c.getContext('2d').getImageData(0,0,c.width,c.height).data);S.settings.animSpd=.75;const a=mk();renderCanvas(a,6000);const A=px(a);
          S.settings.animSpd=1;const b=mk();renderCanvas(b,4500);const B=px(b);const c2=mk();renderCanvas(c2,6000);const C=px(c2);let dAB=0,dAC=0;for(let i=0;i<A.length;i++){dAB+=Math.abs(A[i]-B[i]);dAC+=Math.abs(A[i]-C[i])}a.remove();b.remove();c2.remove();return{dAB,dAC}}""")
        print('speed',sp);assert sp['dAB']==0 and sp['dAC']>1000,sp
        # 6) version + footer
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(200);v=await pg.text_content('#verLine');assert 'Version 3.1' in v and '@ Joschy' in v,v
        print('errors',errs);assert not errs
        await b.close()
    print('ALL OK')
try: asyncio.run(main())
finally: srv.kill()
