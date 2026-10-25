import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,subprocess,time,json,sys
from playwright.async_api import async_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8765','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8765/index.html'
async def onboard(pg,name):
    await pg.goto(U);await pg.wait_for_timeout(500)
    await pg.evaluate("""(n)=>{S.profile={name:n,gear:GEAR.map(g=>g.id)};S.settings.voiceMode='jai';save();location.reload()}""",name)
    await pg.wait_for_timeout(700)
async def main():
    ok=True
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        ctx=await b.new_context(viewport={'width':390,'height':844});pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        reqfail=[];pg.on('requestfailed',lambda r:reqfail.append(r.url))
        await onboard(pg,'Joschy')
        r=await pg.evaluate("""()=>({a:jaiKg(62.5),b:jaiKg(120),c:jaiKg(200),d:jaiKg(42),e:jaiNamed('session_done'),f:jaiRange(6,8)})""");print(r)
        assert r['a']==['num_062','u_komma_fuenf','u_kilo'],r['a']
        assert r['b']==['num_hundert_prefix','num_020','u_kilo'],r['b']
        assert r['c']==['num_200','u_kilo'] and r['e']=='session_done'
        # decode all clips
        dec=await pg.evaluate("""async()=>{const ac=new OfflineAudioContext(1,44100,44100);let ok=0,bad=[];for(const id of JAI_IDS){try{const b=await (await fetch('jai/'+id+'.mp3')).arrayBuffer();const a=await ac.decodeAudioData(b);if(a.duration>0.2&&a.duration<8)ok++;else bad.push(id+':'+a.duration)}catch(e){bad.push(id)}}return{ok,bad,n:JAI_IDS.size}}""")
        print('decode',dec);assert not dec['bad'] and dec['ok']==dec['n']
        # full training
        await pg.evaluate("window.__jaiLog.length=0")
        await pg.click('#startBtn');await pg.wait_for_timeout(1500)
        log1=await pg.evaluate("window.__jaiLog.slice()");print('intro',log1[:2])
        assert log1 and log1[0][0].startswith('greet_') and log1[0][0].endswith(('morning','noon','evening')) and 'warm_start' in log1[0]
        await pg.click('#wSkipAll');await pg.wait_for_timeout(1200)
        log2=await pg.evaluate("window.__jaiLog.slice(-1)[0]");print('ex',log2)
        assert any(x.startswith('ex_') for x in log2) and 'u_saetze' in log2
        played=await pg.evaluate("Object.values(JAI.cache).filter(a=>a.currentTime>0||a.ended).length");print('played audio elements',played)
        # set a weight 62.5 on current exercise and finish set -> rest -> end rest
        await pg.evaluate("(()=>{const ss=S.session;ss.log[ss.ei].sets.forEach(x=>x.w=62.5);save();renderTrain()})()")
        await pg.click('#doneSet');await pg.wait_for_timeout(400)
        await pg.evaluate("(()=>{S.session.restEnd=Date.now()+300;save()})()");await pg.wait_for_timeout(1200)
        log3=await pg.evaluate("window.__jaiLog.slice(-1)[0]");print('set',log3)
        assert log3[:3]==['go','u_satz','num_002'] and log3[-3:]==['num_062','u_komma_fuenf','u_kilo'],log3
        for _ in range(200):
            if await pg.is_visible('#saveS'):break
            if await pg.is_visible('#rs'):await pg.click('#rs');continue
            if await pg.is_visible('#sheetBg'):
                c=await pg.query_selector('#sheet [data-close], #hStop')
                if c: await c.click();continue
            await pg.click('#doneSet');await pg.wait_for_timeout(20)
        await pg.wait_for_timeout(600)
        log4=await pg.evaluate("window.__jaiLog.slice(-1)[0]");print('done',log4)
        assert log4[-1]=='session_done'
        await pg.click('#saveS');await pg.wait_for_timeout(300)
        # Lena neutral
        await pg.evaluate("(()=>{S.profile.name='Lena';save()})()")
        r2=await pg.evaluate("[jaiNamed('session_done'),jaiGreet()]");print('lena',r2);assert r2[0]=='session_done_neutral' and r2[1].endswith('_neutral')
        # settings
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(300)
        await pg.click('[data-vm=phone]');m=await pg.evaluate("voiceMode()");assert m=='phone'
        await pg.click('[data-vm=off]');assert await pg.evaluate("voiceMode()")=='off'
        await pg.click('[data-vm=jai]');await pg.click('#jaiTest');await pg.wait_for_timeout(1500)
        await pg.screenshot(path=_SHOTS+'settings.png',full_page=True)
        # legacy voice=false
        await pg.evaluate("(()=>{delete S.settings.voiceMode;S.settings.voice=false;})()");assert await pg.evaluate("voiceMode()")=='off'
        print('errors',errs,'reqfail',[u for u in reqfail][:5])
        assert not errs
        await b.close()
    srv.terminate();print('ALL OK')
asyncio.run(main())
