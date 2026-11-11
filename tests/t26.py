# Homegym 2.3 @ Joschy – Designs: 8 Themes, Live-Vorschau, Persistenz, Backup, Kontrast, Canvas-Akzent, Effekt-Layer, Frame-Zeit
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright
D=_SHOTS.rstrip('/')
srv=subprocess.Popen([sys.executable,'-m','http.server','8795','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8795/index.html'
THEMES=['arc','ironman','toxic','cyber','sunset','ice','stealth','day']
SEED="""()=>{const n=Date.now();S.profile={name:'Joschy',gear:[...JOSCHYGEAR],preset:'joschy'};S.settings.voiceMode='off';
 S.history=[];for(let i=0;i<4;i++)S.history.push({date:new Date(n-864e5*(12-i*3)).toISOString(),plan:'ABC'[i%3],day:'ABC'[i%3],week:1,dur:3000,log:[{ex:'squat',sets:[{w:50+i*2.5,r:8,done:true}]}]});
 S.body=[{d:new Date(n-864e5*20).toISOString(),kg:82},{d:new Date(n-864e5*2).toISOString(),kg:81}];S.session=null;S.yrun=null;save();location.reload()}"""
# contrast of real elements: text colour against the composited background below it
CONTRAST="""()=>{const P=s=>{const m=String(s).match(/rgba?\\(([^)]+)\\)/);if(!m)return null;const v=m[1].split(/[ ,\\/]+/).filter(Boolean).map(Number);return[v[0],v[1],v[2],v.length>3?v[3]:1]};
 const hex=h=>{h=h.trim();if(h[0]!=='#')return P(h);return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16),1]};
 const over=(f,b)=>[0,1,2].map(i=>f[i]*f[3]+b[i]*(1-f[3])).concat(1);
 const L=c=>{const a=c.slice(0,3).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*a[0]+.7152*a[1]+.0722*a[2]};
 const CR=(a,b)=>{const x=L(a),y=L(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 const cs=getComputedStyle(document.documentElement);const V=k=>cs.getPropertyValue(k).trim();
 const bg=hex(V('--bg')),panel=over(P(V('--panel'))||hex(V('--panel')),bg),tab=over(P(V('--tabbg'))||hex(V('--tabbg')),bg),sheet=hex(V('--sheet2'));
 const col=sel=>{const e=document.querySelector(sel);return e?P(getComputedStyle(e).color):null};
 const r={};const add=(k,f,b)=>{if(f)r[k]=+CR(over(f,b),b).toFixed(2)};
 add('h1/bg',col('#v-set h1'),bg);add('fg/panel',hex(V('--fg')),panel);add('muted/panel',col('#v-set .card p.muted'),panel);add('muted/bg',hex(V('--muted')),bg);
 add('label/panel',col('#v-set .card .label'),panel);add('tab/tabbg',col('.tabs button:not([aria-current=page])'),tab);add('tabOn/tabbg',col('.tabs button[aria-current=page]'),tab);
 add('accent/bg',hex(V('--accent')),bg);add('accent/panel',hex(V('--accent')),panel);add('ink/accent(toast)',hex(V('--accent-ink')),hex(V('--accent')));add('ink/fg(chip on)',hex(V('--accent-ink')),hex(V('--fg')));
 add('btnInk/btn1',hex(V('--btn-ink')),hex(V('--btn1')));add('btnInk/btn2',hex(V('--btn-ink')),hex(V('--btn2')));
 add('good/panel',hex(V('--good')),panel);add('warn/panel',hex(V('--warn')),panel);add('bad/panel',hex(V('--bad')),panel);add('warnText/bg',hex(V('--warn-text')),bg);
 add('fg/sheet',hex(V('--fg')),sheet);add('muted/sheet',hex(V('--muted')),sheet);return r}"""
async def main():
    fails=[]
    def chk(c,msg):
        if not c:fails.append(msg);print('FAIL',msg)
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        ctx=await b.new_context(viewport={'width':390,'height':844},accept_downloads=True);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await pg.wait_for_timeout(400)
        # 0) defaults: fresh state -> arc, version 2.3
        r=await pg.evaluate("[S.settings.theme,document.documentElement.dataset.theme,APP_VER,THEME_KEYS.join()]");print('default',r)
        chk(r[0]=='arc' and r[1]=='arc' and r[2]=='3.1' and r[3]=='arc,ironman,toxic,cyber,sunset,ice,stealth,day','default theme/version '+str(r))
        await pg.evaluate(SEED);await pg.wait_for_timeout(700)
        # 1) every design over all main screens: no JS errors, no horizontal overflow, tiles + live preview
        acc={};contrast={};
        for th in THEMES:
            await pg.evaluate("go('set')");await pg.wait_for_timeout(120)
            await pg.click(f'[data-th="{th}"]');await pg.wait_for_timeout(150)
            r=await pg.evaluate("""(th)=>({dt:document.documentElement.dataset.theme,st:S.settings.theme,sel:[...document.querySelectorAll('[data-th]')].filter(t=>t.getAttribute('aria-checked')==='true').map(t=>t.dataset.th),
               n:document.querySelectorAll('.thtile').length,saved:JSON.parse(localStorage.getItem(KEY)).settings.theme,ac:CSS.ac,col:ACol(.5),meta:document.querySelector('meta[name=theme-color]').content,bg:getComputedStyle(document.documentElement).getPropertyValue('--bg').trim(),
               prev:[...document.querySelectorAll('.thprev')].map(e=>getComputedStyle(e).backgroundColor)})""",th)
            chk(r['dt']==th and r['st']==th and r['sel']==[th] and r['n']==8 and r['saved']==th,f'live preview {th} {r}')
            chk(r['meta']==r['bg'],f'theme-color meta {th} {r["meta"]} {r["bg"]}')
            chk(len(set(r['prev']))>=7,f'tile previews show own colours {r["prev"]}')
            acc[th]=r['ac'];chk(r['col']==f"rgba({r['ac']},0.5)" or r['col']==f"rgba({r['ac']},.5)",f'canvas colour helper {th} {r["col"]}')
            contrast[th]=await pg.evaluate(CONTRAST)
            ov=[]
            async def scr(name):
                await pg.wait_for_timeout(160);w=await pg.evaluate("Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)")
                if w>391:ov.append((name,w))
            for t in ['home','lib','hist','tips','set']:
                await pg.evaluate(f"go('{t}')");await scr(t)
            await pg.evaluate("go('lib')");await pg.click('[data-lm=yoga]');await scr('yogalib');await pg.click('[data-lm=kraft]')
            await pg.evaluate("go('home')");await pg.evaluate("openExSheet('bss')");await scr('sheet');await pg.evaluate("closeSheet()")
            await pg.click('#startBtn');await pg.wait_for_timeout(200);await scr('warm');await pg.click('#wSkipAll');await scr('train')
            fx=await pg.evaluate("[FX.k,!!FX.raf]")
            chk(not fx[1],f'effect layer must pause during training {th} {fx}')
            await pg.click('#doneSet');await scr('rest')
            await pg.evaluate("()=>{stopTimers();S.session=null;save();$('#train').hidden=true;$('#rest').hidden=true;go('home')}")
            await pg.evaluate("()=>{yStart('quick');const r=S.yrun;r.i=1;r.ph='hold';r.end=Date.now()+20000;save();yRender()}");await scr('yoga')
            await pg.evaluate("()=>{S.yrun=null;save();$('#yoga').hidden=true;go('home')}")
            await pg.evaluate("openOnboarding()");await scr('onboarding');await pg.evaluate("()=>{$('#onb').hidden=true}")
            await pg.wait_for_timeout(250);fx2=await pg.evaluate("[FX.k,!!FX.raf||!!FX.tm,FX.c?FX.c.hidden:null]")
            if th in('ironman','toxic','cyber','sunset','ice'):chk(fx2[0]==th and fx2[1] and fx2[2]==False,f'effect running on calm screen {th} {fx2}')
            else:chk(fx2[0]=='' and not fx2[1],f'no effect for {th} {fx2}')
            chk(not ov,f'horizontal overflow {th} {ov}')
            print(th,'ok' if not ov else ov,'errors so far',len(errs))
        chk(len(set(acc.values()))==8,f'8 distinct accents {acc}')
        # 2) contrast (WCAG AA 4.5:1 for main texts)
        for th,r in contrast.items():
            low={k:v for k,v in r.items() if v<4.5}
            print('contrast',th,'min',min(r.values()),low or '')
            chk(not low,f'contrast {th} {low}')
        # 3) canvas accent follows the design (same pose, two designs -> different glow pixels)
        cv=await pg.evaluate("""()=>{const c=document.createElement('canvas');c.style.cssText='position:fixed;left:0;top:0;width:300px;height:260px;z-index:999';document.body.appendChild(c);const o={};
          for(const th of['arc','toxic','ironman','day']){applyTheme(th);attachAnim(c,'squat',{g:'m'});RUN.delete(c);c._t0=0;renderCanvas(c,1500);const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
            let R=0,G=0,B=0,n=0;for(let i=0;i<d.length;i+=4){if(d[i+3]>8&&d[i+3]<200){R+=d[i];G+=d[i+1];B+=d[i+2];n++}}o[th]=[Math.round(R/n),Math.round(G/n),Math.round(B/n)]}
          c.remove();applyTheme(curTheme());return o}""")
        print('canvas glow avg rgb',cv)
        chk(cv['toxic'][1]>cv['toxic'][0]+30 and cv['ironman'][0]>cv['ironman'][2]+30 and cv['arc'][2]>cv['arc'][0]+30,f'canvas accent colours {cv}')
        chk(len({tuple(v) for v in cv.values()})==4,'canvas differs per design')
        # 4) persistence: restart keeps the design, applied before the app script runs (no blue flash)
        await pg.evaluate("go('set')");await pg.click('[data-th="ice"]');await pg.reload();await pg.wait_for_timeout(600)
        r=await pg.evaluate("[document.documentElement.dataset.theme,S.settings.theme,getComputedStyle(document.body).backgroundColor]");print('restart',r)
        chk(r[:2]==['ice','ice'],'theme after restart '+str(r))
        html=open(_os.path.join(_OUTDIR,'index.html')).read();i_s=html.index('<script>');i_st=html.index('<style>');i_app=html.index('"use strict"')
        chk(i_s<i_st<i_app and 'data-theme' in html[i_s:i_st],'early theme script before the stylesheet')
        async def strip(route):
            resp=await route.fetch();t=await resp.text();k=t.index('<script>\n"use strict";');await route.fulfill(response=resp,body=t[:k]+'</body></html>')
        p2=await ctx.new_page();await p2.route('**/index.html',strip);await p2.goto(U);await p2.wait_for_timeout(200)
        r=await p2.evaluate("[document.documentElement.dataset.theme,getComputedStyle(document.documentElement).backgroundColor,getComputedStyle(document.body).backgroundColor,typeof S]");print('early (app script removed)',r)
        chk(r[0]=='ice' and r[1]=='rgb(12, 15, 19)' and r[3]=='undefined','design applied without the app script '+str(r));await p2.close()
        # unknown value in local storage -> arc
        await pg.evaluate("()=>{const s=JSON.parse(localStorage.getItem(KEY));s.settings.theme='neon';localStorage.setItem(KEY,JSON.stringify(s))}");await pg.reload();await pg.wait_for_timeout(500)
        r=await pg.evaluate("[document.documentElement.dataset.theme,S.settings.theme]");chk(r==['arc','arc'],'unknown stored theme -> arc '+str(r))
        # 5) backup roundtrip + validation
        await pg.evaluate("go('set')");await pg.click('[data-th="cyber"]')
        r=await pg.evaluate("""()=>{const t=backupText();const d=JSON.parse(t);const p=parseBackup(t);const bad=JSON.parse(t);bad.state.settings.theme='<script>';const q=parseBackup(JSON.stringify(bad));
           const nos=JSON.parse(t);delete nos.state.settings.theme;const q2=parseBackup(JSON.stringify(nos));const arr=JSON.parse(t);arr.state.settings=[1];const q3=parseBackup(JSON.stringify(arr));
           return{appVer:d.appVer,inBk:d.state.settings.theme,rt:p.st.settings.theme,bad:q.st.settings.theme,missing:q2.st.settings.theme,arr:q3.st.settings.theme}}""");print('backup',r)
        chk(r=={'appVer':'3.1','inBk':'cyber','rt':'cyber','bad':'arc','missing':'arc','arr':'arc'},'backup theme '+str(r))
        bk=await pg.evaluate("backupText()")
        await pg.evaluate("go('set')");await pg.click('[data-th="day"]');await pg.wait_for_timeout(100)
        await pg.evaluate("(t)=>importBackupText(t)",bk);await pg.wait_for_timeout(200);await pg.click('#cOk');await pg.wait_for_timeout(1200)
        r=await pg.evaluate("[document.documentElement.dataset.theme,S.settings.theme,S.history.length]");print('restored',r);chk(r[:2]==['cyber','cyber'] and r[2]==4,'backup restore keeps theme '+str(r))
        bad=json.loads(bk);bad['state']['settings']['theme']='plasma'
        await pg.evaluate("(t)=>importBackupText(t)",json.dumps(bad));await pg.wait_for_timeout(200);await pg.click('#cOk');await pg.wait_for_timeout(1200)
        r=await pg.evaluate("[document.documentElement.dataset.theme,S.settings.theme]");print('restored unknown',r);chk(r==['arc','arc'],'unknown theme in backup -> arc '+str(r))
        # 6) reduced motion: no effect layer
        p3=await (await b.new_context(viewport={'width':390,'height':844},reduced_motion='reduce')).new_page()
        await p3.goto(U);await p3.evaluate("()=>{S.profile={name:'J',gear:[...JOSCHYGEAR]};S.settings.theme='sunset';S.settings.voiceMode='off';save();location.reload()}");await p3.wait_for_timeout(700)
        r=await p3.evaluate("[document.documentElement.dataset.theme,FX.k,!!FX.raf,!!FX.tm]");print('reduced motion',r);chk(r==['sunset','sunset',False,False],'reduced motion stops the effect '+str(r))
        # 7) frame time of the figure canvas per design + cost of one effect frame
        perf=await pg.evaluate("""()=>{const c=document.createElement('canvas');c.style.cssText='position:fixed;left:0;top:0;width:390px;height:250px';document.body.appendChild(c);const o={};
          for(const th of['arc','ironman','day']){applyTheme(th);const r={};for(const k of['squat','bench','y_hund']){attachAnim(c,k,{});RUN.delete(c);c._t0=0;for(let i=0;i<20;i++)renderCanvas(c,i*16.7);const a=performance.now();for(let i=0;i<150;i++)renderCanvas(c,i*16.7);r[k]=+((performance.now()-a)/150).toFixed(2)}o[th]=r}
          c.remove();const fx={};for(const th of['ironman','toxic','cyber','sunset','ice']){applyTheme(th);FX.last=0;for(let i=0;i<20;i++){fxFrame(1000+i*33);cancelAnimationFrame(FX.raf);FX.raf=0}const a=performance.now();for(let i=0;i<200;i++){fxFrame(2000+i*33);cancelAnimationFrame(FX.raf);FX.raf=0}fx[th]=+((performance.now()-a)/200).toFixed(3)}
          applyTheme(curTheme());fxKick();return{figMsPerFrame:o,fxMsPerFrame:fx}}""")
        print('perf',json.dumps(perf))
        for th,r in perf['figMsPerFrame'].items():chk(max(r.values())<perf['figMsPerFrame']['arc'][max(r,key=r.get)]*1.5+1.5,f'figure frame time {th} {r}')
        chk(max(perf['fxMsPerFrame'].values())<1.5,'effect frame too expensive '+str(perf['fxMsPerFrame']))
        # 8) footer
        await pg.evaluate("go('set')");v=await pg.text_content('#verLine');chk('Version 3.1 · @ Joschy' in v,v)
        await pg.screenshot(path=D+'/settings.png')
        chk(not errs,'JS errors '+str(errs[:5]))
        await b.close()
    srv.terminate()
    print('RESULT','FAIL '+str(len(fails)) if fails else 'ALL OK')
    sys.exit(1 if fails else 0)
asyncio.run(main())
