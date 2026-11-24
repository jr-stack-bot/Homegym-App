# Homegym 3.9 @ Joschy – t39: Start-Animation im Gym-Raum
# 1) Raum vorhanden (Betonwand, Gummiboden, Spot, Rack mit Figur aus dem Icon, Hantelablage + Scheibenständer als Canvas-Bilder,
#    Chromglanz auf 8 Griffen, Boxsack, Kreidestaub, Schriftzug HOMEGYM), App ist darunter schon aufgebaut
# 2) Dauer höchstens 1,7 s (alle Splash-Animationen enden bis 1,5 s), Tippen überspringt, Neuladen zeigt sie nicht noch einmal
# 3) prefers-reduced-motion: stark verkürzt, kein Flackern, keine Partikel
# Aufruf: python3 -I tests/t39.py  (HOMEGYM_OUT = Ordner mit index.html, Standard out/)
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
import asyncio,subprocess,time,sys
from playwright.async_api import async_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8860','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
UR='http://127.0.0.1:8860/index.html'
fails=[]
def chk(c,msg):
    print(('ok   ' if c else 'FAIL ')+msg);(None if c else fails.append(msg))
# misst im Browser: vom Start der Animation (Klasse run/still) bis die Start-Animation entfernt ist
OBS="""new MutationObserver(()=>{const s=document.getElementById('splash');if(s&&/\\b(run|still)\\b/.test(s.className)&&!window.__r)window.__r=performance.now();if(window.__r&&!s&&!window.__g)window.__g=performance.now()}).observe(document,{subtree:true,childList:true,attributes:true})"""
ROOM="""()=>{const s=document.getElementById('splash'),r=s&&s.querySelector('.splRoom');if(!r)return null;
 const an=[...document.getAnimations()].filter(a=>a.effect&&a.effect.target&&a.effect.target.closest&&a.effect.target.closest('#splash'));
 const end=Math.max(0,...an.map(a=>{const t=a.effect.getTiming();return (t.delay||0)+(+t.duration||0)}));
 return{icon:!!r.querySelector('svg #hgUpper'),img:r.querySelectorAll('image').length,gl:r.querySelectorAll('.splGl').length,dust:r.querySelectorAll('.splDust').length,
  bag:!!r.querySelector('.splBag'),txt:(r.querySelector('.splTxt')||{}).textContent,dark:!!r.querySelector('.splDark'),end,splT:SPL_T,app:!!document.querySelector('#v-home').innerHTML,
  vb:r.getAttribute('viewBox'),w:s.getBoundingClientRect().width}}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        async def fresh(w=360,h=780,**kw):
            c=await b.new_context(viewport={'width':w,'height':h},**kw);await c.add_init_script(OBS);q=await c.new_page();e=[];q.on('pageerror',lambda x:e.append(str(x)));return c,q,e
        for w,h in[(360,780),(412,915),(1280,800)]:
            c,q,e=await fresh(w,h);await q.goto(UR);await q.wait_for_selector('#splash.run',timeout=2000);t0=time.time()
            r=await q.evaluate(ROOM)
            await q.wait_for_selector('#splash',state='detached',timeout=3000);dt=await q.evaluate("(window.__g-window.__r)/1000")
            chk(r and r['icon'] and r['img']==2 and r['gl']==8 and r['dust']>=8 and r['bag'] and r['txt']=='HOMEGYM' and r['dark'] and r['app'] and r['w']==w,f'{w}x{h}: Gym-Raum mit Rack/Figur, Geräten, Glanz, Staub, Schriftzug {r}')
            chk(r and r['splT']<=1500 and r['end']<=1500 and dt<=1.7,f'{w}x{h}: Dauer {r and r["end"]:.0f} ms Animation, {dt:.2f} s bis weg ab Start (Soll ≤ 1,7 s)')
            chk(not e,f'{w}x{h}: keine JS-Fehler {e[:2]}')
            if w==360:
                async with q.expect_navigation():await q.evaluate("location.reload()")
                await q.wait_for_timeout(150);chk(await q.evaluate("!document.getElementById('splash')"),'nach Neuladen keine zweite Start-Animation')
            await c.close()
        c,q,e=await fresh();await q.goto(UR);await q.wait_for_selector('#splash.run');await q.wait_for_timeout(200);t0=time.time();await q.mouse.click(180,400)
        await q.wait_for_selector('#splash',state='detached',timeout=1000);chk(time.time()-t0<.5 and not e,f'Tippen überspringt ({time.time()-t0:.2f} s)');await c.close()
        c,q,e=await fresh(reduced_motion='reduce');await q.goto(UR);await q.wait_for_selector('#splash.still',timeout=2000);t0=time.time()
        r=await q.evaluate("()=>{const s=document.getElementById('splash');return{dust:s.querySelectorAll('.splDust').length,flick:getComputedStyle(s.querySelector('.splDark')).animationName,dip:getComputedStyle(s.querySelector('#hgUpper')).animationName,txt:+getComputedStyle(s.querySelector('.splTxt')).opacity}}")
        await q.wait_for_selector('#splash',state='detached',timeout=2000);dt=await q.evaluate("(window.__g-window.__r)/1000")
        chk(r['dust']==0 and r['flick']=='none' and r['dip']=='none' and r['txt']==1 and dt<.8 and not e,f'reduced motion: kurz ({dt:.2f} s), kein Flackern, keine Partikel {r}')
        c2,q2,e2=await fresh();await q2.goto(UR+'?nosplash=1');await q2.wait_for_timeout(200);chk(await q2.evaluate("!document.getElementById('splash')"),'Flag ?nosplash: keine Start-Animation')
        await b.close()
    srv.terminate()
    print('\nt39:', 'ALLES OK' if not fails else f'{len(fails)} FEHLER');sys.exit(1 if fails else 0)
asyncio.run(main())
