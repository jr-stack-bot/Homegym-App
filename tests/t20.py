import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright

srv=subprocess.Popen([sys.executable,'-m','http.server','8766','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8766/index.html'
MOCK="""window.__natLog=[];window.__vis=true;window.__played=0;window.__svcEnd=0;
window.Android={trainingState:function(j){},isVisible:function(){return window.__vis},wasPlayed:function(e){return +e===window.__played},restEnd:function(){return String(window.__svcEnd)},vibrate:function(){},speak:function(){},exit:function(){}};"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        ctx=await b.new_context(viewport={'width':390,'height':844});await ctx.add_init_script(MOCK);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await pg.wait_for_timeout(400)
        await pg.evaluate("""()=>{S.profile={name:'Joschy',gear:GEAR.map(g=>g.id)};S.settings.voiceMode='jai';save();location.reload()}""");await pg.wait_for_timeout(700)
        boot=await pg.evaluate("window.__natLog.slice()");print('boot',boot);assert boot and boot[-1]=={'active':False}
        await pg.click('#startBtn');await pg.wait_for_timeout(600)
        L=await pg.evaluate("window.__natLog.slice(-1)[0]");print('warm',L);assert L['active'] and L['phase']=='warm' and L['pip'] and L['notif']
        await pg.click('#wSkipAll');await pg.wait_for_timeout(600)
        L=await pg.evaluate("window.__natLog.slice(-1)[0]");print('set',L);assert L['phase']=='set' and 'Satz 1 von' in L['text']
        await pg.evaluate("(()=>{const ss=S.session;ss.log[ss.ei].sets.forEach(x=>x.w=62.5);save();renderTrain()})()")
        await pg.click('#doneSet');await pg.wait_for_timeout(400)
        L=await pg.evaluate("window.__natLog.slice(-1)[0]");print('rest',L)
        assert L['phase']=='rest' and L['endTime']>time.time()*1000 and L['endSeq'][:3]==['go','u_satz','num_002'] and 'Satz 2' in L['alert'] and '62,5 kg' in L['alert']
        # +15 in app -> new state
        e0=L['endTime'];await pg.click('#rp');await pg.wait_for_timeout(200)
        L=await pg.evaluate("window.__natLog.slice(-1)[0]");assert L['endTime']==e0+15000
        # PiP view
        await pg.evaluate("appPip(true)");await pg.wait_for_timeout(400)
        await pg.screenshot(path=_SHOTS+'pip_rest.png',clip={'x':0,'y':0,'width':390,'height':844})
        vis=await pg.evaluate("[getComputedStyle($('#pipView')).display,getComputedStyle($('#app')).display,getComputedStyle($('#rest')).display,$('#pipView').innerText]");print('pip',vis)
        assert vis[0]=='flex' and vis[1]=='none' and vis[2]=='none' and 'pause' in vis[3].lower()
        await pg.set_viewport_size({'width':180,'height':240});await pg.wait_for_timeout(400)
        await pg.screenshot(path=_SHOTS+'pip_small.png')
        await pg.evaluate("appPip(false)");await pg.set_viewport_size({'width':390,'height':844});await pg.wait_for_timeout(300)
        vis=await pg.evaluate("[getComputedStyle($('#pipView')).display,getComputedStyle($('#rest')).display]");assert vis[0]=='none' and vis[1]!='none',vis
        # background: rest ends while hidden -> no audio, no endRest
        await pg.evaluate("window.__jaiLog.length=0;window.__vis=false;S.session.restEnd=Date.now()+300;save()");await pg.wait_for_timeout(1200)
        st=await pg.evaluate("[window.__jaiLog.length,!$('#rest').hidden]");print('bg end',st);assert st==[0,True]
        # service played it -> on resume no double announcement, rest closes
        await pg.evaluate("window.__played=S.session.restEnd;window.__svcEnd=S.session.restEnd;window.__vis=true;appResume()");await pg.wait_for_timeout(700)
        st=await pg.evaluate("[window.__jaiLog.filter(s=>s[0]==='go'||s[0]==='last_set').length,$('#rest').hidden]");print('resume played',st);assert st==[0,True]
        # not played -> app announces on resume
        await pg.click('#doneSet');await pg.wait_for_timeout(300)
        await pg.evaluate("window.__jaiLog.length=0;window.__vis=false;S.session.restEnd=Date.now()+300;save()");await pg.wait_for_timeout(900)
        await pg.evaluate("window.__vis=true;appResume()");await pg.wait_for_timeout(700)
        st=await pg.evaluate("window.__jaiLog.slice()");print('resume not played',st);assert any(s and s[0] in('go','last_set') for s in st)
        # service +15 while in background -> app picks it up
        await pg.click('#doneSet');await pg.wait_for_timeout(300)
        await pg.evaluate("window.__vis=false;window.__svcEnd=S.session.restEnd+15000");await pg.evaluate("window.__vis=true;appResume()")
        d=await pg.evaluate("S.session.restEnd===window.__svcEnd");assert d
        await pg.click('#rs');await pg.wait_for_timeout(200)
        # pause training -> service stop
        await pg.evaluate("askPause()");await pg.click('#cOk');await pg.wait_for_timeout(300)
        L=await pg.evaluate("window.__natLog.slice(-1)[0]");print('paused',L);assert L=={'active':False}
        # settings toggles
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(300)
        await pg.click('[data-pip="0"]');await pg.click('[data-ntf="0"]')
        s=await pg.evaluate("[S.settings.pip,S.settings.notif]");assert s==[False,False],s
        await pg.screenshot(path=_SHOTS+'settings.png',full_page=True)
        await pg.click('[data-pip="1"]');await pg.click('[data-ntf="1"]')
        # resume training and finish
        await pg.click('[data-tab=home]');await pg.click('#startBtn');await pg.wait_for_timeout(500)
        for _ in range(250):
            if await pg.is_visible('#saveS'):break
            if await pg.is_visible('#rs'):await pg.click('#rs');continue
            if await pg.is_visible('#sheetBg'):
                c=await pg.query_selector('#sheet [data-close], #hStop')
                if c: await c.click();continue
            await pg.click('#doneSet');await pg.wait_for_timeout(15)
        L=await pg.evaluate("window.__natLog.slice(-1)[0]");assert L['phase']=='done',L
        await pg.click('#saveS');await pg.wait_for_timeout(300)
        L=await pg.evaluate("window.__natLog.slice(-1)[0]");assert L=={'active':False},L
        # no bridge: browser path works
        pg2=await (await b.new_context(viewport={'width':390,'height':844})).new_page();e2=[];pg2.on('pageerror',lambda e:e2.append(str(e)))
        await pg2.goto(U);await pg2.wait_for_timeout(400)
        await pg2.evaluate("""()=>{S.profile={name:'Lena',gear:GEAR.map(g=>g.id)};save();location.reload()}""");await pg2.wait_for_timeout(500)
        await pg2.click('#startBtn');await pg2.wait_for_timeout(300);await pg2.click('#wSkipAll');await pg2.click('#doneSet');await pg2.wait_for_timeout(300)
        assert not e2,e2
        print('errors',errs);assert not errs
        await b.close()
    srv.kill();print('ALL OK')
asyncio.run(main())
