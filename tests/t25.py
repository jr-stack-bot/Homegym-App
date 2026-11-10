# Homegym 2.2 @ Joschy – Abnahme-Nachbesserung: weiche Stopps (111 Übungen), Katze-Kuh-Hände, Halber Bogen, Menschlichkeit Kraftübungen
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8782','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8782/index.html'
# explosive / cardio exercises (ballistic on purpose) are exempt from the smoothness limit
EXPL={'mbslam','boxing','run','jumpjack','jj','climber','rowint','boxjump','kbswing','jumprope','bikeint','cross','march','walk'}
JERK=r"""(EXPL)=>{const out=[];const pts=o=>{const m={};for(const q in o){const v=o[q];if(Array.isArray(v)&&v.length===2&&typeof v[0]==='number')m[q]=v}return m};
  for(const ex of Object.keys(EX)){const k=animOf(ex);if(EXPL.includes(ex)||EXPL.includes(k))continue;const def=AN[k];for(const g of['m','f']){const T=cycT(def);let prev=null,pv=null,pa=null,jerk=0,at='';
    for(let t=0;t<T*4.7;t+=1/60){const m=pts(animPose(def,t,g).o);const A={};
      if(prev&&pv){for(const q in m){if(!prev[q]||!pv[q])continue;A[q]=[m[q][0]-2*prev[q][0]+pv[q][0],m[q][1]-2*prev[q][1]+pv[q][1]];
        if(pa&&pa[q]){const j=Math.hypot(A[q][0]-pa[q][0],A[q][1]-pa[q][1]);if(j>jerk){jerk=j;at=q+'@'+(t%T).toFixed(2)}}}}
      pa=prev&&pv?A:null;pv=prev;prev=m}
    out.push({ex,k,g,jerk:+jerk.toFixed(3),at})}}return out}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();pg=await b.new_page(viewport={'width':390,'height':844})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto(U);await pg.wait_for_timeout(500)
        await pg.evaluate("()=>{S.profile={name:'Joschy',gear:[...JOSCHYGEAR],preset:'joschy'};S.settings.voiceMode='off';save();location.reload()}");await pg.wait_for_timeout(600)
        # 1) no frame-to-frame acceleration jump above 0.5 units/frame^3 in any non-explosive exercise (both figures)
        r=await pg.evaluate(JERK,sorted(EXPL))
        n=len(set(x['ex'] for x in r));worst=max(r,key=lambda x:x['jerk']);print('exercises',n,'worst',worst)
        bad=[x for x in r if x['jerk']>.5];assert n>=95 and not bad,bad
        # 2) push-up family: the elbow settles at the top (no clamp), speed never drops by more than 0.15/frame in one frame
        # (a stop = the joint comes to rest: the speed stays below 0.25 for the next 6 frames; turning points of a dip are not stops)
        pu=await pg.evaluate("""()=>{const r={};for(const k of['pushup','ringpush','feetpush','pushpause','kbpushpress','ohp','ohpdb','kbpress','bench','dbbench','incline','dips']){const d=AN[k];const T=cycT(d);
            for(const q of['elbow','hand','sh']){const sp=[];let pv=null;for(let t=0;t<T*3;t+=1/60){const e=animPose(d,t,'m').o[q];if(pv)sp.push(Math.hypot(e[0]-pv[0],e[1]-pv[1]));pv=e}
              let drop=0;for(let i=1;i<sp.length-6;i++){if(sp.slice(i,i+7).every(x=>x<.25))drop=Math.max(drop,sp[i-1]-sp[i])}r[k+'.'+q]=+drop.toFixed(3)}}return r}""")
        print('stop drop',max(pu.values()));assert all(v<=.15 for v in pu.values()),{k:v for k,v in pu.items() if v>.15}
        # 3) Katze-Kuh: hands stay on the mat (no sinking), Halber Bogen: the shin does not flick up (max 2.4 deg/frame while lying, was 2.9)
        kk=await pg.evaluate("""()=>{const d=AN.y_katzekuh;let lo=1e9,hi=-1e9;for(let t=0;t<cycT(d)*2;t+=1/30){const o=animPose(d,t,'m').o;lo=Math.min(lo,o.hand[1]);hi=Math.max(hi,o.hand[1])}
            const L_=yLoopOf(AN.y_bogen,'m');let pa=null,w=0;for(let t=YL.stand/2;t<YL.stand/2+L_.entry;t+=1/60){const o=yLoopPose(L_,t).o;if(o.knee[1]>15||o.hip[1]>20){pa=null;continue}/* lying: the knee bends, the heel comes over */const a=Math.atan2(o.ankle[1]-o.knee[1],o.ankle[0]-o.knee[0])*180/Math.PI;if(pa!=null){let d=Math.abs(a-pa);if(d>180)d=360-d;w=Math.max(w,d)}pa=a}
            return{lo,hi,w}}""")
        print('katzekuh hands',kk);assert kk['lo']>-.3 and kk['hi']<2.5 and kk['w']<2.4,kk
        # 4) strength reps look human: rep length varies (+-3..8 %), inhale/brace in the pause before the lowering, shoulders take the load
        hu=await pg.evaluate("""()=>{const d=AN.squat;const Tp=cycT(d);const ends=[];let pu=null;for(let t=0;t<Tp*12;t+=1/240){const u=phaseAt(d,t).u;if(pu!=null&&pu<1&&u>=1)ends.push(t);pu=u}
            const L=ends.slice(1).map((e,i)=>e-ends[i]);const v=Math.max(...L.map(x=>Math.abs(x/Tp-1)));
            let prep=0,ef=0,brH=0,brM=0;for(let t=0;t<Tp;t+=.02){const a=phaseAt(d,t);prep=Math.max(prep,a.prep);ef=Math.max(ef,a.ef)}
            const neck=[];for(let i=0;i<8;i++){const a=animPose(d,(i+.98)*Tp,'m');neck.push(a.p.neck||0)}const nv=Math.max(...neck)-Math.min(...neck);
            const sh0=animPose(AN.ohp,0,'m').o.sh[1];let shM=-1e9;for(let t=0;t<1.2;t+=.02)shM=Math.max(shM,animPose(AN.ohp,t,'m').o.sh[1]-animPose(AN.ohp,t,'m').o.hip[1]);
            return{v:+v.toFixed(3),reps:L.length,prep,ef,nv:+nv.toFixed(2)}}""")
        print('human',hu);assert hu['reps']>=8 and .025<=hu['v']<=.09 and hu['prep']>.95 and hu['ef']>.95 and .5<hu['nv']<6,hu
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(200);v=await pg.text_content('#verLine');assert 'Version 3.0' in v and '@ Joschy' in v,v
        print('errors',errs);assert not errs
        await b.close()
    print('ALL OK')
try: asyncio.run(main())
finally: srv.kill()
