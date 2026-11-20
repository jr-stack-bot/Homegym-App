# Homegym 3.6 @ Joschy – t36: JAI sagt die Namen der Übungen und Yoga-Haltungen an.
# 1) Abdeckung: jede Übung (EX: program.js, kraft.js, hang.js) und jede Yoga-Haltung hat einen Clip, jede Clip-Datei existiert.
# 2) Abgefangene Audio-Wiedergabe: Reihenfolge der Ansagen in einer Krafteinheit, einer Yoga-Einheit und im Hang-Block,
#    keine Überlappung, Name nie doppelt, JAI aus = still, fehlender Clip = kein Fehler.
# Aufruf: python3 -I tests/t36.py  (HOMEGYM_OUT = Ordner mit index.html + jai/, Standard out/)
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
import asyncio,subprocess,time,sys
from playwright.async_api import async_playwright
srv=subprocess.Popen([sys.executable,'-m','http.server','8836','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8836/index.html'
fails=[]
def chk(c,msg):
    print(('ok   ' if c else 'FAIL ')+msg);(None if c else fails.append(msg))
# fake playback: every clip "plays" 120 ms; overlaps (play while another clip is still running) are counted
FAKE="""(()=>{window.__played=[];window.__overlap=[];let cur=null;
  HTMLMediaElement.prototype.play=function(){const id=(this.src||'').split('/').pop().replace('.mp3','');
    if(cur&&cur!==this&&!cur.__end)window.__overlap.push([cur.__id,id]);cur=this;this.__id=id;this.__end=false;window.__played.push(id);
    const me=this;clearTimeout(me.__t);me.__t=setTimeout(()=>{me.__end=true;me.onended&&me.onended()},120);return Promise.resolve()};
  HTMLMediaElement.prototype.pause=function(){this.__end=true;clearTimeout(this.__t)};})()"""
PROFILE="()=>{S.profile={name:'Joschy',gear:[...JOSCHYGEAR],preset:'joschy'};S.settings.voiceMode='jai';save();location.reload()}"
async def page(b):
    ctx=await b.new_context(viewport={'width':390,'height':844});await ctx.add_init_script(FAKE);pg=await ctx.new_page()
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
    await pg.goto(U);await pg.wait_for_timeout(400);await pg.evaluate(PROFILE);await pg.wait_for_timeout(700);return pg,errs
async def settle(pg):
    for _ in range(40):
        if not await pg.evaluate("JAI.speaking"):break
        await pg.wait_for_timeout(100)
async def run_kraft(pg,plan,from_blk=False):
    """runs a strength session; returns list of (kind, item index, sequence)"""
    await pg.evaluate(f"(()=>{{startSession('{plan}');openTrain()}})()");await pg.wait_for_timeout(500);await settle(pg)
    await pg.click('#wSkipAll');
    await pg.evaluate("""(fb)=>{const ss=S.session;let st=0;if(fb){st=Math.max(0,ss.items.findIndex(x=>x.blk)-1)}
      ss.items=ss.items.map(x=>({...x,sets:2}));ss.log.forEach(l=>l.sets=l.sets.slice(0,2));if(st){ss.ei=st;ss.si=0}save();renderTrain()}""",from_blk)
    ev=[]
    for _ in range(80):
        await pg.wait_for_timeout(700);await settle(pg)
        if await pg.is_visible('#saveS'):break
        ph=await pg.evaluate("S.session&&S.session.phase")
        if ph=='done':break
        if await pg.is_visible('#sheetBg'):
            c=await pg.query_selector('#sheet [data-close], #hStop')
            if c:await c.click();continue
        if await pg.is_visible('#rest'):
            await pg.evaluate("(()=>{S.session.restEnd=Date.now()+150;save()})()");continue
        await pg.click('#doneSet')
    return ev
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        pg,errs=await page(b)
        v=await pg.evaluate("[APP_VER,BK_VER]");chk(v==['3.6',5],'Version 3.6, Backup-Format bleibt 5 '+str(v))
        # ---------- 1) coverage ----------
        r=await pg.evaluate("""async()=>{const exMiss=Object.keys(EX).filter(k=>!jaiEx(k).length),yMiss=Object.keys(YP).filter(k=>!jaiYoga(k).length);
          const prog=[...new Set(PROGRAM.flatMap(b=>b.days.flatMap(d=>[...d.items.map(x=>x[0]),d.fin[0]])))].filter(k=>!jaiEx(k).length);
          const kx=Object.keys(KXD).filter(k=>!jaiEx(k).length),hg=HG_ALL.filter(k=>!jaiEx(k).length);
          const own=Object.keys(EX).filter(k=>jaiEx(k)[0]!=='ex_'+k);
          const files=[];for(const id of JAI_IDS){const r=await fetch('jai/'+id+'.mp3',{method:'HEAD'});if(!r.ok)files.push(id)}
          return{ex:Object.keys(EX).length,yp:Object.keys(YP).length,exMiss,yMiss,prog,kx,hg,own,files,ids:JAI_IDS.size,nx:JAI_IDS.has('u_als_naechstes'),
            al:['seitstuetz','unterarmstuetz','superman'].map(k=>jaiYoga(k)[0])}}""")
        chk(not r['exMiss'] and not r['prog'] and not r['kx'] and not r['hg'],f"alle {r['ex']} Übungen (program/kraft/hang) haben einen Namens-Clip {r['exMiss'][:5]}")
        chk(not r['own'],f"jede Übung hat ihren eigenen Clip (kein Ausweichen auf die Basisübung) {r['own'][:5]}")
        chk(not r['yMiss'],f"alle {r['yp']} Yoga-Haltungen haben einen Namens-Clip {r['yMiss'][:5]}")
        chk(r['al']==['ex_sideplank','ex_plank','ex_superman'],'Yoga-Doppel nutzen vorhandene Clips '+str(r['al']))
        chk(r['nx'] and not r['files'],f"{r['ids']} Clip-IDs, jede Datei existiert {r['files'][:5]}")
        disk=set(f[:-4] for f in _os.listdir(_os.path.join(_OUTDIR,'jai')) if f.endswith('.mp3'))
        ids=set(await pg.evaluate("[...JAI_IDS]"));chk(ids<=disk,f"alle IDs als Datei in jai/ ({len(disk)} Dateien)")
        # ---------- 2a) Kraft (Plan A) ----------
        await pg.evaluate("window.__jaiLog.length=0;window.__played.length=0;window.__overlap.length=0")
        await run_kraft(pg,'A')
        log=await pg.evaluate("window.__jaiLog.slice()");items=await pg.evaluate("S.session.items.map(x=>'ex_'+x.ex)")
        played=await pg.evaluate("window.__played.slice()");ov=await pg.evaluate("window.__overlap.slice()")
        print('Kraft-Ansagen:');[print('  ',s) for s in log if any(x.startswith('ex_') or x=='u_als_naechstes' for x in s)]
        starts=[s for s in log if 'u_saetze' in s];nexts=[s for s in log if 'u_als_naechstes' in s]
        chk(len(starts)==len(items) and all(s.count(it)==1 and sum(x.startswith('ex_') for x in s)==1 for s,it in zip(starts,items)),f"Kraft: jede der {len(items)} Übungen sagt beim Start ihren Namen genau einmal")
        chk(len(nexts)==len(items)-1 and all(s[s.index('u_als_naechstes')+1:]==[it] for s,it in zip(nexts,items[1:])),"Kraft: in jeder Pause vor einer neuen Übung 'Als Nächstes' + Name")
        order=[x for x in played if x=='u_als_naechstes' or x in items]
        exp=[items[0]]+[y for it in items[1:] for y in ('u_als_naechstes',it,it)]
        chk(order==exp,'Kraft: Abspielreihenfolge Name → Als Nächstes → Name (Start) stimmt')
        chk(not ov,f"Kraft: keine überlappenden Ansagen {ov[:3]}")
        chk(any(s[:1]==['halfway'] and 'u_als_naechstes' in s for s in log) or any(s==['halfway'] for s in log),'Kraft: Halbzeit kommt in derselben Sequenz (wird nicht abgeschnitten)')
        await pg.click('#saveS');await pg.wait_for_timeout(300)
        # ---------- 2b) Hang-Block (Plan B) ----------
        await pg.evaluate("window.__jaiLog.length=0;window.__played.length=0;window.__overlap.length=0")
        await run_kraft(pg,'B',True)
        log=await pg.evaluate("window.__jaiLog.slice()");it=await pg.evaluate("S.session.items.map(x=>({id:'ex_'+x.ex,blk:!!x.blk}))");ov=await pg.evaluate("window.__overlap.slice()")
        hb=[x['id'] for x in it if x['blk']];print('Hang-Block:',hb);[print('  ',s) for s in log if any(x in hb for x in s)]
        chk(hb and all(any(s[-2:]==['u_als_naechstes',h] for s in log) and any('u_saetze' in s and h in s for s in log) for h in hb),'Hang-Block: Als Nächstes + Name in der Pause, Name beim Start')
        chk(not ov,f"Hang: keine überlappenden Ansagen {ov[:3]}")
        await pg.click('#saveS');await pg.wait_for_timeout(300)
        # ---------- 2c) Yoga (Schnell-Dehnen + Plan-Einheit) ----------
        for kind in ['quick','post']:
            await pg.evaluate("window.__jaiLog.length=0;window.__played.length=0;window.__overlap.length=0")
            await pg.evaluate(f"(()=>{{yStart('{kind}',{{day:'C'}});const r=S.yrun;r.steps.forEach(s=>s.sec=6);r.end=Date.now()+300;save()}})()")
            steps=await pg.evaluate("S.yrun.steps.map(s=>({k:s.k,side:s.side||0,c:jaiYoga(s.k)[0]}))")
            for _ in range(len(steps)*2+4):
                await pg.wait_for_timeout(900);await settle(pg)
                if await pg.evaluate("!S.yrun||S.yrun.ph==='done'"):break
                await pg.evaluate("(()=>{const r=S.yrun;if(r&&r.end)r.end=Date.now()+50})()")
            await pg.wait_for_timeout(600)
            log=[s for s in await pg.evaluate("window.__jaiLog.slice()") if s not in (['cd_1'],['cd_2'],['cd_3'])];ov=await pg.evaluate("window.__overlap.slice()")
            print(f'Yoga {kind} ({len(steps)} Schritte):');[print('  ',s) for s in log[:8]]
            hold=[s for s in log if 'u_sekunden_halten' in s];prep=[s for s in log if 'u_als_naechstes' in s]
            okh=len(hold)==len(steps) and all((st['c'] in s)==(st['side']!=2) and s.count(st['c'])<=1 and (st['side']==2 or s.index(st['c'])<s.index('u_sekunden_halten')) for s,st in zip(hold,steps))
            chk(okh,f"Yoga {kind}: Name beim Start jeder Haltung (nicht erneut bei Seite 2)")
            np_=[st for st in steps[1:] if st['side']!=2]  # erste Haltung: keine Pause davor
            chk(len(prep)==len(np_) and all(s[-2:]==['u_als_naechstes',st['c']] for s,st in zip(prep,np_)),f"Yoga {kind}: in der Pause 'Als Nächstes' + Name")
            chk(not ov,f"Yoga {kind}: keine überlappenden Ansagen {ov[:3]}")
            chk(sum(s.count('halfway') for s in log)<=1,f"Yoga {kind}: Halbzeit höchstens einmal")
            await pg.evaluate("(()=>{if(S.yrun){S.yrun=null;save()}yClose()})()")
        # ---------- 3) JAI aus / Handy-Stimme / fehlender Clip ----------
        await pg.evaluate("window.__played.length=0;S.settings.voiceMode='off';save()")
        await pg.evaluate("(()=>{yStart('quick');S.yrun.end=Date.now()+50;save()})()");await pg.wait_for_timeout(1500)
        chk(await pg.evaluate("window.__played.length")==0,'JAI aus: keine Namensansagen')
        await pg.evaluate("(()=>{S.yrun=null;save();yClose();S.settings.voiceMode='jai';save()})()")
        r=await pg.evaluate("""async()=>{JAI_IDS.delete('yoga_baum');JAI_IDS.delete('ex_bench');window.__played.length=0;await jaiPlay(['u_als_naechstes',...jaiYoga('baum'),...jaiEx('bench')]);return{y:jaiYoga('baum'),e:jaiEx('bench'),p:window.__played.slice()}}""")
        chk(r['y']==[] and r['p']==['u_als_naechstes'],'fehlender Clip: kein Fehler, nur vorhandene Clips '+str(r))
        chk(not errs,'keine JS-Fehler '+str(errs[:3]))
        await b.close()
asyncio.run(main());srv.terminate()
print('\nFEHLER:' if fails else '\nALLE OK',fails if fails else '')
sys.exit(1 if fails else 0)
