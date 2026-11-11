# Homegym 2.2 @ Joschy – natürliche Bewegungen: Tempo, Atmung, Gelenke, Hände/Füße, Animationstempo-Einstellung, Backup
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright
D=_SHOTS.rstrip('/')
srv=subprocess.Popen([sys.executable,'-m','http.server','8777','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8777/index.html'
BALLISTIC=['mbslam','boxing','run','walk','jj','kbswing','boxjump','climber','jumprope','kbclean','kbpushpress','rowint','bikeint','cross','march','farmer','armcircle','russtwist']
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},accept_downloads=True);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await pg.wait_for_timeout(400)
        await pg.evaluate("()=>{S.profile={name:'Joschy',gear:[...JOSCHYGEAR],preset:'joschy'};S.settings.voiceMode='off';save();location.reload()}");await pg.wait_for_timeout(600)
        assert 'Joschy' in await pg.title()
        # 1) every EX animation renders (m + f, 3 moments), no exceptions, figure visible
        r=await pg.evaluate("""()=>{const bad=[],miss=[];let n=0;const c=document.createElement('canvas');c.style.cssText='position:fixed;left:0;top:0;width:200px;height:220px';document.body.appendChild(c);
          for(const k of Object.keys(EX)){const a=animOf(k);if(!AN[a]){miss.push(k);continue}
            for(const g of['m','f'])for(const t of[.4,1.7,3.1]){try{attachAnim(c,a,{g});RUN.delete(c);c._t0=0;renderCanvas(c,t*1000);const x=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let px=0;for(let i=3;i<x.length;i+=16)if(x[i]>0)px++;if(px<400)bad.push([k,g,t,px]);n++}catch(e){bad.push([k,g,t,String(e)])}}}
          c.remove();return{n,bad,miss,ex:Object.keys(EX).length}}""")
        print('EX anims rendered',r['ex'],'frames',r['n']);assert not r['bad'] and not r['miss'] and r['ex']>=100,r
        # 2) tempo: strength reps ~1 s concentric, ~2 s eccentric, visible pauses; holds keep a clear pause
        t=await pg.evaluate("""()=>{const o={};for(const k of['squat','bench','deadlift','pullup','row','ohp','curl','lunge','goblet','pushup'])o[k]=AN[k].tempo.slice();
          const norm=Object.keys(AN).filter(k=>AN[k]._tn).length;const holds={gobletpause:AN.gobletpause.tempo,benchpause:AN.benchpause.tempo,pushpause:AN.pushpause.pause,curlhold:AN.curlhold.pause};return{o,norm,holds}}""")
        print('tempo',t['o'],'normalized',t['norm'])
        for k,v in t['o'].items():
            assert sorted([v[0],v[2]])==[1,2] and min(v[1],v[3])>=.3,(k,v)
        assert t['norm']>=60 and t['holds']['gobletpause'][1]>=3 and t['holds']['benchpause'][1]>=2 and t['holds']['pushpause']['s']>=3,t
        # concentric faster than eccentric in the real phase function (squat: A->B = down)
        ph=await pg.evaluate("""()=>{const d=AN.squat;const T=cycT(d);let down=0,up=0;const dt=.01;for(let x=0;x<T;x+=dt){const c=phaseCore(d,x);if(c.dir>0)down+=dt;if(c.dir<0)up+=dt}return{down,up}}""")
        assert abs(ph['down']-2)<.05 and abs(ph['up']-1)<.05,ph
        # 3) smooth: no position jumps / velocity steps between 60 fps frames for every EX animation
        sm=await pg.evaluate("""(BAL)=>{const res=[];const keys=[...new Set(Object.keys(EX).map(animOf))];
          for(const k of keys){const d=AN[k];const T=d.gait?d.tempo.reduce((a,b)=>a+b,0):cycT(d);const dt=1/60;const n=Math.min(900,Math.ceil(2.1*T/dt)+4);const P=[];
            for(let i=0;i<n;i++){const{o}=animPose(d,1.3+i*dt,'m');const m={};for(const q in o){const v=o[q];if(Array.isArray(v)&&v.length===2&&typeof v[0]==='number')m[q]=v}P.push(m)}
            let sp=0,st=0;for(let i=2;i<n-2;i++)for(const q in P[i])for(const ax of[0,1]){const f=j=>P[j][q][ax];const d2=j=>f(j+1)-2*f(j)+f(j-1);sp=Math.max(sp,Math.abs(d2(i)-(d2(i-1)+d2(i+1))/2));st=Math.max(st,Math.abs(f(i+1)-f(i)))}
            res.push([k,+sp.toFixed(3),+st.toFixed(2),BAL.includes(k)])}return res}""",BALLISTIC)
        badS=[x for x in sm if (x[1]>(5 if x[3] else 1.0)) or (x[2]>(14 if x[3] else 4))]
        print('smooth worst',sorted(sm,key=lambda x:-x[1])[:5]);assert not badS,badS
        # turning points: velocity ~0 and acceleration continuous at the bottom/top (no hard stop)
        tp=await pg.evaluate("""()=>{const d=AN.squat;const T=cycT(d);const u=x=>phaseCore(d,x).u;const h=1e-3;let mx=0;for(let x=.02;x<T-.02;x+=.005){const a1=(u(x+h)-2*u(x)+u(x-h))/(h*h),a2=(u(x+2*h)-2*u(x+h)+u(x))/(h*h);mx=Math.max(mx,Math.abs(a2-a1))}
          const L=lagTab(d);let over=0;for(const v of L.ut)over=Math.max(over,v-1,-v);let ulo=0;for(const v of L.ul)ulo=Math.max(ulo,v-1,-v);return{accStep:mx,trunkOvershoot:over,armOutOfRange:ulo}}""")
        print('turning points',tp);assert tp['accStep']<1.5 and 0<tp['trunkOvershoot']<.03 and tp['armOutOfRange']<1e-3,tp
        # 4) alive: breathing (stronger in holds), sway while standing, front weight shift
        al=await pg.evaluate("""()=>{const amp=(k)=>{let lo=9,hi=-9;for(let t=0;t<8;t+=.05){const b=poseFlow(AN[k],t).p._br;lo=Math.min(lo,b);hi=Math.max(hi,b)}return hi-lo};
          const head=(k)=>{let lo=1e9,hi=-1e9;const d=AN[k];const T=cycT(d);for(let t=0;t<12;t+=.05){const pa=phaseAt(d,t);if(pa.u>.001)continue;const{o}=animPose(d,t,'m');lo=Math.min(lo,o.head[0]);hi=Math.max(hi,o.head[0])}return hi-lo};
          const fr=()=>{let lo=1e9,hi=-1e9;for(let t=0;t<8;t+=.1){const{o}=animPose(AN.lateral,t,'m');lo=Math.min(lo,o.hipR[0]);hi=Math.max(hi,o.hipR[0])}return hi-lo};
          return{plank:amp('plank'),squat:amp('squat'),yoga:amp('y_berg'),swayHead:head('curl'),frontShift:fr()}}""")
        print('alive',al);assert al['plank']>1.8 and al['yoga']>1.8 and .6<al['squat']<1.9 and .3<al['swayHead']<4 and 1<al['frontShift']<4,al
        # 5) joints: knees never hyperextend (side view, all strength animations), segment lengths kept, head never folds
        jt=await pg.evaluate("""()=>{window.__ks={};const bad=[];for(const k of Object.keys(AN)){if(k.startsWith('y_'))continue;const d=AN[k];if(d.view==='front')continue;window.__ksk=k;
            for(let t=0;t<7;t+=.11){const{o,p}=animPose(d,t,'m');
              const H=o.hip,K=o.knee,A=o.ankle,T=o.toe;const th=sub(K,H),sh=sub(A,K),ft=sub(T,A);const c1=(th[0]*sh[1]-th[1]*sh[0])/(Math.hypot(...th)*Math.hypot(...sh)),c2=(sh[0]*ft[1]-sh[1]*ft[0])/(Math.hypot(...sh)*Math.hypot(...ft));
              if(Math.abs(c2)>=.34&&c1*c2>.02)bad.push([k,'knee',+t.toFixed(2)]);
              const l1=Math.hypot(...th),l2=Math.hypot(...sub(o.elbow,o.sh)),l3=Math.hypot(...sh);if(Math.abs(l1-L.th)>1||Math.abs(l3-L.sh)>1||(!d.A.handTo&&Math.abs(l2-L.ua)>1))bad.push([k,'len',+l1.toFixed(1),+l3.toFixed(1),+l2.toFixed(1)]);
              if(o._hA!=null&&!d.gait){let r=((o._hA-o._torso)%360+540)%360-180;if(Math.abs(r)>36)bad.push([k,'neck',r|0])}}}
          const ks=[...new Set(bad.map(x=>x[0]+':'+x[1]))];return{ks,bad:bad.slice(0,12),n:bad.length,mirrored:window.__ks}}""")
        print('joints',jt['n'],jt['mirrored']);assert jt['n']==0 and not jt['mirrored'],jt
        # 6) hands & feet: grips on bars/handles, open hands otherwise, flat palms on the floor
        hd=await pg.evaluate("""()=>{const g=k=>gripOf(AN[k]);const fl=k=>{const d=AN[k];const{o}=animPose(d,1,'m');return o.hand[1]-floorOf(d)};
          return{bench:g('bench').hand&&g('bench').hand2,pull:g('pullup').hand,row:g('row').hand,curl:g('curl').hand&&g('curl').hand2,dl:g('deadlift').hand,lat:g('lateral').handR&&g('lateral').handL,
            air:!g('airsquat').hand,lunge:!g('lungebw').hand,plankFlat:!g('plank').hand&&fl('plank')<5.5,run:g('run').hand}}""")
        print('hands',hd);assert all(hd.values()),hd
        # 7) animation speed setting: settings UI, persisted, real effect on the animation, in the backup
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(250)
        v=await pg.text_content('#verLine');assert 'Version 3.1 · @ Joschy' in v,v
        assert await pg.locator('[data-aspd]').count()==2
        await pg.click('[data-aspd="0.75"]');await pg.wait_for_timeout(150)
        st=await pg.evaluate("()=>({s:S.settings.animSpd,f:animSpd(),ls:JSON.parse(localStorage.getItem(KEY)).settings.animSpd,p:document.querySelector('[data-aspd=\"0.75\"]').getAttribute('aria-pressed')})")
        assert st=={'s':.75,'f':.75,'ls':.75,'p':'true'},st
        await pg.screenshot(path=D+'/settings.png',full_page=True)
        eq=await pg.evaluate("""()=>{const mk=()=>{const c=document.createElement('canvas');c.style.cssText='position:fixed;left:0;top:0;width:220px;height:240px';document.body.appendChild(c);attachAnim(c,'squat',{g:'m'});RUN.delete(c);c._t0=0;return c};
          const px=c=>Array.from(c.getContext('2d').getImageData(0,0,c.width,c.height).data);const a=mk();renderCanvas(a,2400);const A=px(a);/* 0.75x: 2.4 s real = 1.8 s animation */
          S.settings.animSpd=1;const b=mk();renderCanvas(b,1800);const B=px(b);const c2=mk();renderCanvas(c2,2400);const C=px(c2);S.settings.animSpd=.75;
          let dAB=0,dAC=0;for(let i=0;i<A.length;i++){dAB+=Math.abs(A[i]-B[i]);dAC+=Math.abs(A[i]-C[i])}a.remove();b.remove();c2.remove();return{dAB,dAC}}""")
        print('speed check',eq);assert eq['dAB']==0 and eq['dAC']>1000,eq
        bk=await pg.evaluate("()=>{const t=backupText();const d=JSON.parse(t);const r=parseBackup(t);return{v:d.appVer,s:d.state.settings.animSpd,rt:r.st.settings.animSpd}}")
        print('backup',bk);assert bk=={'v':'3.1','s':.75,'rt':.75},bk
        # restore a backup with normal speed -> setting comes back
        await pg.evaluate("()=>{const d=JSON.parse(backupText());d.state.settings.animSpd=1;window.__bk=JSON.stringify(d)}")
        await pg.evaluate("()=>applyBackup(parseBackup(window.__bk).st)");await pg.wait_for_timeout(1200)
        assert await pg.evaluate("animSpd()")==1
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(200);assert await pg.get_attribute('[data-aspd="1"]','aria-pressed')=='true'
        # 8) library minis stay still and cheap (no follower tables), training view animates
        await pg.click('[data-tab=lib]');await pg.wait_for_timeout(500)
        lb=await pg.evaluate("()=>{const m=[...document.querySelectorAll('[data-mini]')];return{n:m.length,still:m.every(c=>c._still),tabs:m.filter(c=>c._def&&c._def._lt).length}}")
        print('library',lb);assert lb['n']>=20 and lb['still'] and lb['tabs']==0,lb
        await pg.screenshot(path=D+'/library.png')
        await pg.evaluate("()=>{S.pick={day:'A',ws:weekStart(new Date()).getTime()};save();go('home')}");await pg.wait_for_timeout(200)
        await pg.click('#startBtn');await pg.wait_for_timeout(300);await pg.click('#wSkipAll');await pg.wait_for_timeout(1300)
        await pg.screenshot(path=D+'/work.png')
        fps=await pg.evaluate("()=>new Promise(res=>{let n=0;const t0=performance.now();const f=()=>{n++;if(performance.now()-t0<1500)requestAnimationFrame(f);else res(n/1.5)};requestAnimationFrame(f)})")
        print('fps (headless)',round(fps));assert fps>40
        await pg.evaluate("()=>{S.session=null;save();closeTrain()}")
        print('errors',errs);assert not errs
        await b.close()
    print('ALL OK')
try: asyncio.run(main())
finally: srv.kill()
