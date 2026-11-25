# Homegym 3.10 @ Joschy – t39: Start-Animation im Gym-Raum (5 s)
# 1) Raum vorhanden: Betonwand, Spot, Rack mit Figur aus dem Icon, Hantelablage (Canvas) mit 10 Paaren 2,5–25 kg + Scheibenständer,
#    Chromglanz auf 20 Griffen, Boxsack, Kreidestaub, Schriftzug HOMEGYM + „by Joschy“; Wand: Neon „NEVER GIVE UP“, Uhr, Kreidetafel, Urkunde.
#    Die App ist darunter schon aufgebaut. 22,5/25 kg nur in der Animation: App-Daten (JOSCHY_DB, Maße bis 20 kg) unverändert.
# 2) Dauer 5 s ± 0,3 (alle endlichen Splash-Animationen enden bis 5 s), Tippen überspringt (früh und mitten drin), Neuladen zeigt sie nicht noch einmal
# 3) Laufband, Crosstrainer, Bank, Lichtkegel und die Wand-Elemente ganz im Bild (nichts angeschnitten), Wand-Elemente überlappen sich nicht und sind lesbar
# 4) Uhr zeigt die echte Uhrzeit (Stunden-/Minutenzeiger), Sekundenzeiger läuft
# 5) Kreidetafel = nächstes/heutiges Training wie auf dem Startbildschirm; erledigt / Ruhetag / läuft; Urkunde mit und ohne Hang-Rekord
# 6) prefers-reduced-motion: stark verkürzt, kein Flackern, keine Partikel; Ladezeit mit und ohne Start-Animation
# Aufruf: python3 -I tests/t39.py  (HOMEGYM_OUT = Ordner mit index.html, Standard out/)
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
import asyncio,subprocess,time,sys,datetime
from playwright.async_api import async_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8860','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
UR='http://127.0.0.1:8860/index.html'
fails=[]
def chk(c,msg):
    print(('ok   ' if c else 'FAIL ')+msg);(None if c else fails.append(msg))
# misst im Browser: vom Start der Animation (Klasse run/still) bis die Start-Animation entfernt ist
OBS="""new MutationObserver(()=>{const s=document.getElementById('splash');if(s&&/\\b(run|still)\\b/.test(s.className)&&!window.__r)window.__r=performance.now();if(window.__r&&!s&&!window.__g)window.__g=performance.now()}).observe(document,{subtree:true,childList:true,attributes:true})"""
BOX="""e=>{if(!e)return null;const b=e.getBoundingClientRect();return{x0:Math.round(b.left),x1:Math.round(b.right),y0:Math.round(b.top),y1:Math.round(b.bottom),w:Math.round(b.width),h:Math.round(b.height)}}"""
ROOM="""()=>{const s=document.getElementById('splash'),r=s&&s.querySelector('.splRoom');if(!r)return null;const BOX="""+BOX+""";
 const an=[...document.getAnimations()].filter(a=>a.effect&&a.effect.target&&a.effect.target.closest&&a.effect.target.closest('#splash'));
 const fin=an.filter(a=>isFinite(a.effect.getTiming().iterations));
 const end=Math.max(0,...fin.map(a=>{const t=a.effect.getTiming();return (t.delay||0)+(+t.duration||0)*(t.iterations||1)}));
 const T=q=>{const e=r.querySelector(q);return e?(e.getAttribute('data-text')||e.textContent):null};
 const reps=getComputedStyle(s.querySelector('#hgUpper'));
 return{icon:!!r.querySelector('svg #hgUpper'),img:r.querySelectorAll('image').length,gl:r.querySelectorAll('.splGrips .splGl').length,dust:r.querySelectorAll('.splDust').length,
  kg:(r.querySelector('.splGrips')||{getAttribute:()=>''}).getAttribute('data-kg'),
  bag:!!r.querySelector('.splBag'),txt:T('.splTxt'),by:T('.splBy'),dark:!!r.querySelector('.splDark')&&!!r.querySelector('.splSpread'),end,splT:SPL_T,
  app:!!document.querySelector('#v-home').innerHTML,w:s.getBoundingClientRect().width,
  neon:T('.splNeonTxt'),neonOff:T('.splNeonOff'),board:T('.splBoard'),cert:T('.splCert'),clock:!!r.querySelector('.splClock'),
  reps:[reps.animationIterationCount,parseFloat(reps.animationDelay),parseFloat(reps.animationDuration)],
  inf:an.filter(a=>!isFinite(a.effect.getTiming().iterations)).map(a=>a.animationName),
  parts:Object.fromEntries(['splTread','splCross','splBench','splCone','splWallArt','splClock','splBoard','splCert','splNeonTxt'].map(c=>[c,BOX(r.querySelector('.'+c))])),
  fonts:[...r.querySelectorAll('.splChalk,.splRec,.splNeonTxt')].map(e=>Math.round(e.getBoundingClientRect().height)),

  run:window.__r}}"""
CLOCK="""()=>{const c=document.querySelector('#splash .splClock');const rot=q=>{const m=/rotate\\(([-\\d.]+)/.exec(c.querySelector(q).getAttribute('transform'));return m?+m[1]:NaN};
 const sec=c.querySelector('.splSec'),a=sec.getAnimations()[0];const d=new Date();
 return{t:c.getAttribute('data-time'),h:rot('.splHr'),m:rot('.splMin'),s:rot('.splSecO'),now:[d.getHours(),d.getMinutes(),d.getSeconds()],run:a?a.playState:null,name:a?a.animationName:null,steps:a?getComputedStyle(sec).animationTimingFunction:null}}"""
# sichtbarer Inhalt der Canvas-Bilder (Ablage, Scheibenständer) in Bildschirm-Pixeln: Alpha > 0
IMGS="""async()=>{const out=[];for(const e of document.querySelectorAll('#splash .splRoom image')){const b=e.getBoundingClientRect(),u=e.getAttribute('href');if(!u){out.push(null);continue}
 const im=new Image();im.src=u;await im.decode();const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');x.drawImage(im,0,0);
 const d=x.getImageData(0,0,c.width,c.height).data;let x0=1e9,x1=-1,y0=1e9,y1=-1;for(let y=0;y<c.height;y++)for(let i=0;i<c.width;i++)if(d[(y*c.width+i)*4+3]>8){if(i<x0)x0=i;if(i>x1)x1=i;if(y<y0)y0=y;if(y>y1)y1=y}
 const sx=b.width/c.width,sy=b.height/c.height;out.push([Math.round(b.left+x0*sx),Math.round(b.left+(x1+1)*sx),Math.round(b.top+y0*sy),Math.round(b.top+(y1+1)*sy)])}return out}"""
# Ladezeit: App-Start (DOMContentLoaded; das Inline-Skript mit Aufbau der App und des Raums läuft davor) mit und ohne Start-Animation
DCL="document.addEventListener('DOMContentLoaded',()=>{window.__dcl=performance.now()})"
HOME="""()=>{const h=document.querySelector('#nextCard h2').textContent.split(' · ');const m=/Block (\\d) von 4/.exec(document.querySelector('#posLine').textContent);return['Heute: '+h[0],h[1]||'',m?'Block '+m[1]+' von 4':'']}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        async def fresh(w=360,h=780,**kw):
            c=await b.new_context(viewport={'width':w,'height':h},**kw);await c.add_init_script(OBS);q=await c.new_page();e=[];q.on('pageerror',lambda x:e.append(str(x)));return c,q,e
        PAIRS=sorted([2.5,5,7.5,10,12.5,15,17.5,20,22.5,25]*2)
        for w,h in[(360,780),(412,915),(1280,800)]:
            c,q,e=await fresh(w,h);await q.goto(UR);await q.wait_for_selector('#splash.run',timeout=2000)
            r=await q.evaluate(ROOM);home=await q.evaluate(HOME);await q.wait_for_function("[...document.querySelectorAll('#splash .splRoom image')].every(e=>e.getAttribute('href'))",timeout=3000);r['imgs']=await q.evaluate(IMGS)
            await q.wait_for_selector('#splash',state='detached',timeout=7000);dt=await q.evaluate("(window.__g-window.__r)/1000")
            kg=sorted(float(x) for x in (r['kg'] or '').split(',') if x)
            chk(r and r['icon'] and r['img']==2 and r['gl']==20 and kg==PAIRS and r['dust']>=8 and r['bag'] and r['txt']=='HOMEGYM' and r['by']=='by Joschy' and r['dark'] and r['app'] and r['w']==w,
                f'{w}x{h}: Gym-Raum mit Rack/Figur, Ablage mit 10 Paaren 2,5–25 kg (20 Griffe glänzen), Staub, Schriftzug + by Joschy {dict((k,r[k]) for k in ("img","gl","dust","txt","by"))}')
            chk(r['neon']=='NEVER GIVE UP' and r['neonOff']=='NEVER GIVE UP' and r['clock'] and r['board'] and r['cert'],f'{w}x{h}: Wand: Neon, Uhr, Tafel „{r["board"]}“, Urkunde „{r["cert"]}“')
            chk(r['board']==' | '.join(x for x in home if x),f'{w}x{h}: Tafel = Startbildschirm {home}')
            chk(r['cert']=='Hang-Rekord: bald!',f'{w}x{h}: Urkunde ohne Hang-Test: {r["cert"]}')
            chk(r['splT']==5000 and 4600<=r['end']<=5000 and 4.7<=dt<=5.3,f'{w}x{h}: Dauer {r["end"]:.0f} ms Animation, {dt:.2f} s bis weg ab Start (Soll 5 s ± 0,3)')
            chk(r['reps'][0]=='2' and abs(r['reps'][1]-2)<.01 and abs(r['reps'][1]+2*r['reps'][2]-3.5)<.01 and r['inf']==['splSec'],f'{w}x{h}: zwei Wiederholungen 2–3,5 s {r["reps"]}, endlos nur der Sekundenzeiger {r["inf"]}')
            pa=r['parts'];ok=all(pa.get(k) and pa[k]['w']>8 and pa[k]['h']>8 for k in pa)
            inside=all(pa[k]['x0']>=0 and pa[k]['x1']<=w and pa[k]['y0']>=0 for k in pa if k!='splCone') and len(r['imgs'])==2 and all(i and i[0]>=0 and i[1]<=w for i in r['imgs'])
            chk(ok and (inside or w>900) and pa['splCone']['w']>w*.3,f'{w}x{h}: Laufband, Crosstrainer, Bank, Lichtkegel, Wand-Elemente sichtbar, nichts angeschnitten {r["imgs"]}')
            wall=['splWallArt','splClock','splBoard','splCert'];ov=[(a,b2) for i,a in enumerate(wall) for b2 in wall[i+1:] if not(pa[a]['x1']<=pa[b2]['x0'] or pa[b2]['x1']<=pa[a]['x0'] or pa[a]['y1']<=pa[b2]['y0'] or pa[b2]['y1']<=pa[a]['y0'])]
            chk(not ov and (min(r['fonts'])>=8 or w>900),f'{w}x{h}: Wand-Elemente überlappen nicht {ov}, Schrift lesbar (Zeilenhöhen {r["fonts"]} px)')
            chk(r['run']<1500,f'{w}x{h}: Start-Animation läuft {r["run"]:.0f} ms nach dem Seitenstart')
            chk(not e,f'{w}x{h}: keine JS-Fehler {e[:2]}')
            if w==360:
                async with q.expect_navigation():await q.evaluate("location.reload()")
                await q.wait_for_timeout(150);chk(await q.evaluate("!document.getElementById('splash')"),'nach Neuladen keine zweite Start-Animation')
                v=await q.evaluate("[JOSCHY_DB.join(),JSON.stringify(dbDims(25))===JSON.stringify(dbDims(20)),Object.keys(DB_LOOK).map(Number).sort((a,b)=>a-b).join()]")
                chk(v==['2.5,5,7.5,10,12.5,15,17.5,20',True,'2.5,5,7.5,10,12.5,15,17.5,20'],f'App unverändert: Joschys Kurzhanteln bis 20 kg, keine Maße über 20 kg {v}')
            await c.close()
        # Uhr
        c,q,e=await fresh();await q.goto(UR);await q.wait_for_selector('#splash.run');cl=await q.evaluate(CLOCK);await c.close()
        hh,mm,ss=map(int,cl['t'].split(':'));t0=hh*3600+mm*60+ss;t1=cl['now'][0]*3600+cl['now'][1]*60+cl['now'][2]
        chk(abs((t1-t0+43200)%86400-43200)<=5 and abs(cl['h']-((hh%12)+mm/60)*30)<.05 and abs(cl['m']-(mm+ss/60)*6)<.05 and abs(cl['s']-ss*6)<.01 and cl['run']=='running' and cl['name']=='splSec' and 'steps' in (cl['steps'] or ''),
            f'Uhr zeigt die echte Uhrzeit {cl["t"]} (jetzt {cl["now"]}), Zeiger h {cl["h"]}° m {cl["m"]}° s {cl["s"]}°, Sekundenzeiger läuft ({cl["run"]}, {cl["steps"]})')
        # Tafel und Urkunde aus dem App-Zustand
        async def board(setup):
            c,q,e=await fresh();await q.goto(UR+'?nosplash=1');await q.evaluate(setup);await q.goto(UR);await q.wait_for_selector('#splash.run',timeout=3000)
            v=await q.evaluate("()=>[document.querySelector('#splash .splBoard').getAttribute('data-text'),document.querySelector('#splash .splCert').getAttribute('data-text'),document.querySelector('#splash .splRec').textContent]")
            hm=await q.evaluate(HOME);await c.close();return v,hm,e
        H="(d)=>({date:d.toISOString(),plan:'A',day:'A',week:1,dur:3000,unit:true,cyc:1,log:[{ex:'bench',sets:[{w:60,r:8,done:true}]}]})"
        v,hm,e=await board("()=>{const H="+H+";S.history=[H(new Date())];save()}")
        chk(v[0]=='Heute: erledigt ✓ | Stark gemacht!' and not e,f'heute schon trainiert -> Tafel „{v[0]}“')
        v,hm,e=await board("()=>{const H="+H+";const ws=weekStart(new Date()),td=new Date();const d=td.getDay()===1?new Date(td.getTime()+864e5):new Date(ws.getTime()+12*36e5);S.settings.goal=2;S.history=[H(d),H(new Date(d.getTime()+60e3))];save()}")
        chk(v[0]=='Heute: Ruhetag | Wochenziel geschafft' and not e,f'Wochenziel erreicht -> Tafel „{v[0]}“')
        v,hm,e=await board("()=>{S.history=[];S.pick=null;save()}")
        chk(v[0]==' | '.join(x for x in hm if x) and v[0].startswith('Heute: ') and 'Block 1 von 4' in v[0] and not e,f'nichts trainiert -> nächste Einheit vom Startbildschirm „{v[0]}“')
        v,hm,e=await board("()=>{S.history=[];S.prog.done=['A'];save()}")
        chk(v[0]==' | '.join(x for x in hm if x) and v[0]!='Heute: Drücken | Bankdrücken | Block 1 von 4' and not e,f'nach Einheit A -> nächste Einheit „{v[0]}“ = Startbildschirm {hm}')
        v,hm,e=await board("()=>{S.history=[];beginUnit('B');save()}")
        chk(v[0].startswith('Heute: Ziehen | ') and v[0].endswith('läuft · Block 1 von 4') and not e,f'Training läuft -> Tafel „{v[0]}“')
        v,hm,e=await board("()=>{const H=hgS();const d=new Date(Date.now()-20*864e5);const k=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');H.tests=[{d:k,s:37},{d:todayKey(),s:52}];save()}")
        chk(v[1]=='Hang-Rekord: 52 s' and v[2]=='52 s' and not e,f'Urkunde mit Hang-Rekord (bester von 37/52 s): „{v[1]}“')
        # Ladezeit
        async def start(url):
            c,q,e=await fresh();await c.add_init_script(DCL);await q.goto(url);await q.wait_for_function('window.__dcl>0');
            v=await q.evaluate("[window.__dcl,!!document.querySelector('#splash .splRoom'),!!document.querySelector('#v-home').innerHTML]");await c.close();return v
        mit=[];ohne=[]
        for _ in range(5):mit.append(await start(UR));ohne.append(await start(UR+'?nosplash=1'))
        m=sorted(x[0] for x in mit[1:])[1];o=sorted(x[0] for x in ohne[1:])[1]
        chk(all(x[1] and x[2] for x in mit) and not any(x[1] for x in ohne) and m-o<250,f'Ladezeit: App-Start mit Start-Animation {m:.0f} ms, ohne {o:.0f} ms (+{m-o:.0f} ms, Grenze +250 ms), App darunter fertig')
        # Tippen überspringt (früh und mitten in den Wiederholungen)
        for wait in(200,2600):
            c,q,e=await fresh();await q.goto(UR);await q.wait_for_selector('#splash.run');await q.wait_for_timeout(wait);t0=time.time();await q.mouse.click(180,400)
            await q.wait_for_selector('#splash',state='detached',timeout=1000);chk(time.time()-t0<.5 and not e,f'Tippen nach {wait} ms überspringt ({time.time()-t0:.2f} s)');await c.close()
        # reduced motion
        c,q,e=await fresh(reduced_motion='reduce');await q.goto(UR);await q.wait_for_selector('#splash.still',timeout=2000)
        r=await q.evaluate("()=>{const s=document.getElementById('splash'),g=q=>getComputedStyle(s.querySelector(q));return{dust:s.querySelectorAll('.splDust').length,flick:g('.splDark').animationName,lamp:g('.splLampOn').animationName,neon:+g('.splNeon').opacity,neonA:g('.splNeon').animationName,dip:g('#hgUpper').animationName,txt:+g('.splTxt').opacity,by:+g('.splBy').opacity,dark:+g('.splDark').opacity,spread:+g('.splSpread').opacity}}")
        await q.wait_for_selector('#splash',state='detached',timeout=2000);dt=await q.evaluate("(window.__g-window.__r)/1000")
        chk(r['dust']==0 and r['flick']=='none' and r['lamp']=='none' and r['neonA']=='none' and r['neon']==1 and r['dip']=='none' and r['txt']==1 and r['by']==1 and r['dark']==0 and r['spread']==0 and dt<.8 and not e,f'reduced motion: kurz ({dt:.2f} s), kein Flackern, keine Partikel, alles hell {r}')
        await c.close()
        c2,q2,e2=await fresh();await q2.goto(UR+'?nosplash=1');await q2.wait_for_timeout(200);chk(await q2.evaluate("!document.getElementById('splash')"),'Flag ?nosplash: keine Start-Animation')
        await b.close()
    srv.terminate()
    print('\nt39:', 'ALLES OK' if not fails else f'{len(fails)} FEHLER');sys.exit(1 if fails else 0)
asyncio.run(main())
