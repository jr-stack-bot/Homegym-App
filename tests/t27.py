# Homegym 3.0 @ Joschy – Plan nach Einheiten, Migration, Wiedereinstieg, Anstrengung, Plateau, Aufwärmsätze, Zeit, Backup
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright
D=_SHOTS.rstrip('/')
srv=subprocess.Popen([sys.executable,'-m','http.server','8781','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8781/index.html'
FAIL=[]
def chk(c,m):
    print(('ok   ' if c else 'FAIL ')+m)
    if not c:FAIL.append(m)
# helpers inside the page: realistic 2.x states (dates relative to "now", weeks via the app's own weekStart)
HELP="""()=>{window.T={
 ago:d=>new Date(Date.now()-d*864e5).toISOString(),
 ws:()=>weekStart(new Date()).getTime(),
 sets:(w,rs)=>rs.map(r=>({w,r,done:true})),
 prof:()=>({name:'Joschy',gear:[...JOSCHYGEAR],gearV:2,preset:'joschy',weights:{db:[],kb:[8,12,16],band:[]}}),
 base:()=>({settings:{...DEF.settings,voiceMode:'off'},history:[],next:0,session:null,protein:{d:'',g:0,log:[]},body:[{d:'2026-01-01',kg:80}],profile:T.prof()}),
 rec:(date,plan,week,log)=>({date,plan,day:plan,week,dur:3000,log}),
 put:st=>{window.__hgLock=true;localStorage.setItem(KEY,JSON.stringify(st));sessionStorage.setItem('__before',JSON.stringify(st));location.reload()},
 same:()=>{const b=JSON.parse(sessionStorage.getItem('__before'));const j=JSON.stringify;return j(S.history)===j(b.history)&&j(S.profile)===j(b.profile)&&j(S.body)===j(b.body)&&S.cycleStart===b.cycleStart&&j(S.settings)===j({...DEF.settings,...b.settings})},
 finish:()=>{const ss=S.session;for(const l of ss.log)for(const s of l.sets)s.done=true;ss.phase='done';save();renderTrain()}
}}"""
async def boot(pg):
    await pg.wait_for_timeout(450);await pg.evaluate(HELP)
async def put(pg,js):
    async with pg.expect_navigation():await pg.evaluate("()=>{const st=("+js+")();T.put(st)}")
    await boot(pg)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},accept_downloads=True);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await boot(pg)
        r=await pg.evaluate("[APP_VER,BK_VER]");chk(r==['3.1',5],'version 3.1, backup format stays 5 '+str(r))

        # ===== 1) MIGRATION from realistic 2.3 states =====
        # 1a fresh 2.3 state in the middle of week 2: last week A,B,C (week 1), this week A (week 2)
        await put(pg,"""()=>{const st=T.base();const w=T.ws();st.cycleStart=w-WEEKMS;
          const lw=d=>new Date(w-WEEKMS+d*864e5+18*36e5).toISOString();
          st.history=[T.rec(lw(0),'A',1,[{ex:'bench',sets:T.sets(60,[8,8,7,7])},{ex:'lateral',sets:T.sets(8,[15,14,12])}]),T.rec(lw(2),'B',1,[{ex:'pullup',sets:T.sets(0,[8,7,6,6])}]),
            T.rec(lw(4),'C',1,[{ex:'squat',sets:T.sets(80,[8,8,8,8])}]),T.rec(new Date(Math.max(w+60e3,Date.now()-36e5)).toISOString(),'A',2,[{ex:'ohp',sets:T.sets(40,[8,8,7,6])}])];
          window.__before=JSON.stringify(st);return st}""")
        r=await pg.evaluate("()=>({p:S.prog,next:nextUnit(),txt:$('#nextCard').innerText,letter:$('.plan-letter').textContent,same:T.same()})")
        chk(r['same'],'1a no data loss: history, profile, body, settings, cycleStart identical')
        print('1a',r['p'])
        chk(r['p']['block']==2 and r['p']['done']==['A'] and r['next']=='B' and r['letter']=='B','1a mid week 2: block 2, A done, next B')
        chk('Block 2 von 4 · Einheit 2 von 3' in r['txt'] and 'NÄCHSTE EINHEIT' in r['txt'].upper(),'1a home shows next unit + position')
        # no data loss: compare with the state written before reload
        r=await pg.evaluate("""()=>{const h=S.history;return{n:h.length,rec:recordsCard().length>0,vol:totalVol(),ohp:h[3].log[0].sets.map(s=>s.w+'x'+s.r).join()}}""")
        chk(r['n']==4 and r['vol']==60*30+8*41+80*32+40*29 and r['ohp']=='40x8,40x8,40x7,40x6','1a history/volume unchanged '+str(r))
        # idempotent
        r=await pg.evaluate("()=>{const a=JSON.stringify(S.prog);const m=migrate3();return[m,a===JSON.stringify(S.prog)]}")
        await pg.reload();await boot(pg);r2=await pg.evaluate("[S.prog.block,S.prog.done.join(),S.prog.at]")
        chk(r==[False,True] and r2[:2]==[2,'A'],'1a migration idempotent (call + reload) '+str(r2))

        # 1b running session: started last week in week 2 (C, mid-exercise), A+B done that week; calendar is already week 3
        await put(pg,"""()=>{const st=T.base();const w=T.ws();st.cycleStart=w-2*WEEKMS;const lw=d=>w-WEEKMS+d*864e5+18*36e5;
          st.history=[T.rec(new Date(lw(0)).toISOString(),'A',2,[{ex:'ohp',sets:T.sets(40,[8,8,8,8])}]),T.rec(new Date(lw(2)).toISOString(),'B',2,[{ex:'chestrow',sets:T.sets(20,[10,10,9,9])}])];
          S.history=st.history;S.cycleStart=st.cycleStart;S.profile=st.profile;S.prog=null;
          const items=planItems('C',false,2);st.session={plan:'C',week:2,quick:false,items,warm:warmList(false),start:lw(4),phase:'work',wi:0,ei:1,si:1,warmEnd:null,
            log:items.map((it,i)=>({ex:it.ex,sets:Array.from({length:it.sets},(_,j)=>({w:i===0?100:20,r:it.lo,done:i===0||(i===1&&j===0)}))}))};
          delete S.prog;window.name=JSON.stringify(st.session);return st}""")
        r=await pg.evaluate("""()=>{const old=JSON.parse(window.name);const ss=S.session;const keep=JSON.stringify({...ss,unit:undefined})===JSON.stringify({...old,unit:undefined});
          return{p:S.prog,keep,unit:ss.unit,txt:$('#nextCard').innerText,btn:$('#startBtn').textContent}}""")
        print('1b',r['p'])
        chk(await pg.evaluate("T.same()"),'1b no data loss')
        chk(r['p']['block']==2 and r['p']['done']==['A','B'] and r['keep'] and r['unit'] is True,'1b running session intact, position from its own week')
        chk('Training läuft'.upper() in r['txt'].upper() and 'Block 2 von 4 · Einheit 3 von 3' in r['txt'] and r['btn']=='Training fortsetzen','1b home shows running C')
        await pg.click('#startBtn');await pg.wait_for_timeout(250)
        r=await pg.evaluate("[S.session.ei,S.session.si,S.session.log[0].sets.every(s=>s.done),S.session.log[1].sets[0].done]");chk(r==[1,1,True,True],'1b resumed at the same set '+str(r))
        await pg.evaluate("T.finish()");await pg.click('#saveS');await pg.wait_for_timeout(300)
        r=await pg.evaluate("[S.prog.block,S.prog.done.length,nextUnit(),S.history.length,S.history[2].unit,S.history[2].plan]");chk(r==[3,0,'A',3,True,'C'],'1b finishing C closes block 2 -> block 3 A '+str(r))

        # 1c gap > 14 days: last training 20 days ago -> re-entry offered on start
        await put(pg,"""()=>{const st=T.base();st.cycleStart=T.ws()-9*WEEKMS;
          st.history=[T.rec(T.ago(24),'B',2,[{ex:'pullup',sets:T.sets(0,[8,8,8,8])}]),T.rec(T.ago(20),'C',2,[{ex:'squat',sets:T.sets(80,[8,8,8,8])}])];
          st.history.unshift(T.rec(T.ago(27),'A',2,[{ex:'ohp',sets:T.sets(40,[8,8,8,8])},{ex:'dbbench',sets:T.sets(20,[12,12,12,12])},{ex:'lateral',sets:T.sets(8,[15,15,15])}]));return st}""")
        r=await pg.evaluate("[S.prog.block,S.prog.done.join(),cycleWeek(),nextUnit(),Math.floor(gapDays()),!!$('#gapHint')]")
        chk(await pg.evaluate("T.same()"),'1c no data loss')
        chk(r[0]==r[2]==2 and r[1]=='' and r[3]=='A' and r[4]==20 and r[5],'1c gap: calendar block kept, next A, hint shown '+str(r))
        norm=await pg.evaluate("()=>{const its=planItems('A',false,S.prog.block);return its.map(it=>({ex:it.ex,sets:it.sets,slot:it.slot,fin:!!it.fin,w:startW(it.ex,suggest(it))}))}")
        await pg.click('#startBtn');await pg.wait_for_timeout(250)
        chk(await pg.is_visible('#reYes') and 'Wiedereinstieg' in await pg.text_content('#sheet'),'1c re-entry sheet on start')
        await pg.click('#reYes');await pg.wait_for_timeout(250)
        r=await pg.evaluate("()=>({re:S.session.reentry,it:S.session.items.map(x=>({ex:x.ex,sets:x.sets})),w:S.session.log.map(l=>l.sets[0].w)})")
        okw=all((n['w']==0 and w==0) or (w<n['w'] and w>=n['w']*0.85) or (n['w']<=20 and w==n['w']) for n,w in zip(norm,r['w']))
        oks=all((n['fin'] or n['slot']==0) and s['sets']==n['sets'] or (not n['fin'] and n['slot']>0 and s['sets']==max(1,n['sets']-1)) for n,s in zip(norm,r['it']))
        print('1c weights',[n['w'] for n in norm],'->',r['w'])
        chk(r['re'] and okw and oks and r['w'][0]==37.5 and norm[0]['w']==42.5,'1c re-entry: about -10 % weight, one set less on assistance')
        await pg.screenshot(path=D+'/reentry_work.png')
        await pg.evaluate("()=>{S.session=null;save();closeTrain()}")
        await pg.click('#startBtn');await pg.wait_for_timeout(200);await pg.click('#reNo');await pg.wait_for_timeout(200)
        r=await pg.evaluate("[S.session.reentry,S.session.log[0].sets[0].w]");chk(r==[False,norm[0]['w']],'1c decline -> normal weights '+str(r))
        await pg.evaluate("()=>{S.session=null;save();closeTrain()}")

        # 1d old backup formats: v4 text backup + 2.3 backup (v5) without prog, imported -> migrated
        r=await pg.evaluate("""()=>{const w=T.ws();const h=[T.rec(new Date(Math.max(w+60e3,Date.now()-72e5)).toISOString(),'A',4,[{ex:'incline',sets:T.sets(20,[10,10,9,9])}]),T.rec(new Date(Math.max(w+120e3,Date.now()-36e5)).toISOString(),'B',4,[{ex:'dbrow',sets:T.sets(24,[10,10,10,10])}])];
          const v4={v:4,history:h,settings:{goal:3},body:[],next:0,cycleStart:w-3*WEEKMS,profile:{name:'Alt'}};
          const v5={app:'homegym',kind:'backup',v:5,appVer:'2.3',key:KEY,created:T.ago(1),state:{...T.base(),history:h,cycleStart:w-7*WEEKMS}};
          const a=parseBackup(JSON.stringify(v4)).st,c=parseBackup(JSON.stringify(v5)).st;window.__v4=JSON.stringify(v4);
          return{a:[a.prog.block,a.prog.done.join(),a.history.length,JSON.stringify(a.history)===JSON.stringify(h)],c:[c.prog.block,c.prog.done.join(),c.history.length]}}""")
        chk(r['a']==[4,'A,B',2,True] and r['c']==[4,'A,B',2],'1d parseBackup migrates v4 + 2.3 backups '+str(r))
        await pg.evaluate("()=>importBackupText(window.__v4)");await pg.wait_for_timeout(200)
        async with pg.expect_navigation():await pg.click('#cOk')
        await boot(pg)
        r=await pg.evaluate("[S.profile.name,S.history.length,S.prog.block,nextUnit(),S.history[1].log[0].sets.length,S.settings.goal]")
        chk(r==['Alt',2,4,'C',4,3],'1d v4 import -> block 4, next C, history kept '+str(r))

        # ===== 2) ORDER A->B->C over 13 units, variation per block, cycle wrap, quick + deload do not break it =====
        await put(pg,"()=>T.base()")
        seq=[]
        for i in range(14):
            if i==4:  # a short (quick) session in between: saved, but no plan unit
                r=await pg.evaluate("()=>{const n0=nextUnit(),p0=JSON.stringify(S.prog);S.settings.quick=true;save();startSession(n0);T.finish();return[n0,p0]}")
                await pg.click('#saveS');await pg.wait_for_timeout(150)
                q=await pg.evaluate("()=>[JSON.stringify(S.prog),S.history[S.history.length-1].quick,S.history[S.history.length-1].unit]")
                chk(q[0]==r[1] and q[1] is True and q[2] is False,'2 quick session saved but does not advance the plan')
                await pg.evaluate("()=>{S.settings.quick=false;save()}");continue
            if i==7:await pg.evaluate("()=>setDeload(true)")
            r=await pg.evaluate("""()=>{go('home');const k=$('.plan-letter').textContent;const pos=$('#posLine').innerText;startSession(k);const ss=S.session;const main=ss.items[0].orig||ss.items[0].ex;
              const want=dayDef(ss.week,k).items[0][0];T.finish();return{k,w:ss.week,main,want,pos,dl:!!ss.deload}}""")
            await pg.click('#saveS');await pg.wait_for_timeout(120)
            seq.append(r)
        plans=''.join(x['k'] for x in seq);weeks=[x['w'] for x in seq]
        print('2 order',plans,weeks)
        chk(plans=='ABCABCABCABCA' and weeks==[1,1,1,2,2,2,3,3,3,4,4,4,1],'2 order A->B->C over 13 units, block every 3, cycle wraps')
        chk(all(x['main']==x['want'] for x in seq) and len({x['main'] for x in seq[:12]})>=8,'2 each block uses its own PROGRAM variation')
        chk('Block 1 von 4 · Einheit 1 von 3' in seq[0]['pos'] and 'Block 3 von 4 · Einheit 2 von 3' in seq[7]['pos'],'2 position text')
        r=await pg.evaluate("[S.prog.cycle,S.prog.block,S.prog.done.join(),S.prog.units,S.settings.deload,S.prog.dlLeft]")
        chk(r==[2,1,'A',13,False,0] and [x['dl'] for x in seq][5:10]==[False,True,True,True,False],'2 cycle 2 starts, deload lasted exactly 3 units '+str(r))
        await pg.click('#monthBtn');await pg.wait_for_timeout(150);mt=await pg.text_content('#sheet');print('2 sheet',mt[:400]);await pg.click('#sheet [data-close]')
        chk(mt.startswith('Zyklusplan') and 'Block 1 · Grundkraftaktuell' in mt and 'A · Drücken · Bankdrücken ✓' in mt and 'B · Ziehen · Klimmzüge ▶ nächste' in mt and mt.count('✓')==1,'2 cycle sheet: cycle 2, A done, B next')
        await pg.screenshot(path=D+'/home_cycle2.png',full_page=True)

        # ===== 3) EFFORT question + influence on the suggestion =====
        await put(pg,"()=>T.base()")
        await pg.click('#startBtn');await pg.wait_for_timeout(200);await pg.click('#wSkipAll');await pg.wait_for_timeout(200)
        await pg.evaluate("()=>{const ss=S.session;ss.log[0].sets.forEach(x=>{x.w=60;x.r=8});ss.wu.skip=true;save();renderTrain()}")
        n0=await pg.evaluate("S.session.items[0].sets")
        for i in range(n0):
            await pg.click('#doneSet');await pg.wait_for_timeout(120)
            if i<n0-1:
                chk(not await pg.is_visible('#effQ'),'3 no effort question before the last set') if i==0 else None
                await pg.click('#rs');await pg.wait_for_timeout(100)
        vis=await pg.evaluate("[!$('#rest').hidden,!!$('#effQ'),S.session.restEnd>Date.now(),S.session.effFor]")
        chk(vis==[True,True,True,0],'3 effort question in the running rest after the last set '+str(vis))
        await pg.screenshot(path=D+'/effort_rest.png')
        await pg.click('#effQ [data-eff=easy]');await pg.wait_for_timeout(300)
        vis=await pg.evaluate("[!$('#rest').hidden,S.session.restEnd>Date.now(),S.session.log[0].eff,$('#effQ').innerText]")
        chk(vis[0] and vis[1] and vis[2]=='easy' and 'Gespeichert' in vis[3],'3 one tap stores effort, rest timer keeps running')
        await pg.click('#rs');await pg.evaluate("()=>{T.finish();const ss=S.session;ss.effFor=ss.items.length-1;save();renderTrain()}");await pg.wait_for_timeout(150)
        chk(await pg.is_visible('#trainInner #effQ') and await pg.is_visible('#saveS'),'3 effort question for the last exercise on the done screen')
        await pg.click('#trainInner [data-eff=hard]');await pg.wait_for_timeout(100)
        await pg.click('#saveS');await pg.wait_for_timeout(200)
        r=await pg.evaluate("()=>{const h=S.history[0];return[h.log[0].ex,h.log[0].eff,h.log.filter(l=>l.eff).length,h.log[h.log.length-1].eff]}");chk(r==['bench','easy',2,'hard'],'3 effort saved per exercise in history '+str(r))
        r=await pg.evaluate("""()=>{const it={ex:'bench',sets:4,lo:6,hi:8};const L=S.history[0].log[0];const o={};
          for(const e of['easy','ok','hard',null]){if(e)L.eff=e;else delete L.eff;const g=suggest(it);o[e||'none']=[g.w,g.why.replace(/<[^>]+>/g,'')]}
          L.sets=T.sets(60,[8,8,8,7]);L.eff='easy';const g=suggest(it);o.early=[g.w,g.why.replace(/<[^>]+>/g,'')];
          L.sets=T.sets(60,[6,5,5,5]);L.eff='hard';o.hard1=suggest(it).w;
          S.history.push(T.rec(new Date().toISOString(),'A',2,[{ex:'bench',sets:T.sets(60,[6,5,5,4]),eff:'hard'}]));const d=suggest(it);o.down=[d.w,d.why.replace(/<[^>]+>/g,'')];
          S.history.pop();L.sets=T.sets(60,[8,8,8,8]);L.eff='easy';
          const pk={ex:'plank',sets:3,lo:30,hi:45};S.history.push(T.rec(new Date().toISOString(),'C',1,[{ex:'plank',sets:T.sets(0,[45,45,45]),eff:'easy'}]));const gp=suggest(pk);o.plank=[gp.w,gp.dr,initSets(pk,gp)[0].r];
          S.history[1].log[0].eff='hard';S.history[1].log[0].sets=T.sets(0,[45,40,35]);o.plankHard=suggest(pk).dr;S.history.pop();
          S.profile.gear=[...JOSCHYGEAR,'kb'];S.profile.weights.kb=[8,12,16,20,24];const kb={ex:'kbswing',sets:3,lo:12,hi:15};
          S.history.push(T.rec(new Date().toISOString(),'C',1,[{ex:'kbswing',sets:T.sets(12,[15,15,15]),eff:'easy'}]));o.kbEasy=suggest(kb).w;S.history[1].log[0].eff='ok';o.kbOk=suggest(kb).w;S.history.pop();
          S.profile.gear=[...JOSCHYGEAR];return o}""")
        print('3 suggest',json.dumps(r,ensure_ascii=False))
        chk(r['easy'][0]==65 and 'leicht' in r['easy'][1] and '+5 kg' in r['easy'][1],'3 easy + top reached -> bigger step (+5 kg, explained)')
        chk(r['ok'][0]==62.5 and '+2,5 kg' in r['ok'][1] and r['none'][0]==62.5,'3 ok -> normal double progression (+2.5 kg)')
        chk(r['hard'][0]==60 and 'halten' in r['hard'][1].lower(),'3 hard -> hold weight')
        chk(r['early'][0]==62.5 and 'früher' in r['early'][1].lower(),'3 easy + almost top -> step earlier')
        chk(r['hard1']==60 and r['down'][0]==55 and '−5 kg' in r['down'][1],'3 hard + missed twice -> slight reduction to a loadable weight')
        chk(r['plank']==[0,10,55] and r['plankHard']==0,'3 timed exercise progresses in seconds, not kg')
        chk(r['kbEasy']==20 and r['kbOk']==16,'3 weight list: easy = two steps, ok = next weight')

        # ===== 4) PLATEAU card =====
        await put(pg,"""()=>{const st=T.base();for(let i=0;i<3;i++)st.history.push(T.rec(T.ago(12-i*3),'A',1,[{ex:'lateral',sets:T.sets(10,[13,13,12])},{ex:'plank',sets:T.sets(0,[45,45,40])}]));return st}""")
        r=await pg.evaluate("[!!plateauOf('lateral'),!!plateauOf('plank')]");chk(r==[False,False],'4 three sessions only (no baseline beaten yet) -> no card')
        await pg.evaluate("()=>{S.history.push(T.rec(T.ago(1),'A',1,[{ex:'lateral',sets:T.sets(10,[13,12,12])},{ex:'plank',sets:T.sets(0,[45,40,40])}]));save()}")
        r=await pg.evaluate("[!!plateauOf('lateral'),!!plateauOf('plank'),!!plateauOf('bench')]");chk(r==[True,True,False],'4 3 sessions without progress after a baseline -> plateau')
        r=await pg.evaluate("()=>{const h=S.history[3];h.log[0].sets[0].r=16;const a=!!plateauOf('lateral');h.log[0].sets[0].r=13;return a}");chk(r is False,'4 one more rep = progress -> no plateau')
        async def at(ex,day='A'):
            await pg.evaluate("([ex,day])=>{S.session=null;S.prog.block=1;S.prog.done=[];save();startSession(day);const ss=S.session;ss.phase='work';ss.ei=ss.items.findIndex(x=>x.ex===ex);ss.si=0;save();renderTrain()}",[ex,day]);await pg.wait_for_timeout(200)
        await at('lateral');chk(await pg.is_visible('#platCard'),'4 plateau card shown at the exercise')
        await pg.screenshot(path=D+'/plateau.png')
        t=await pg.text_content('#platCard');print('4 card',t);chk('Gewicht −10 %' in t and 'Neues Ziel 8–12' in t and 'Variante' in t and 'Später' in t,'4 card offers a/b/c/later')
        await pg.click('[data-plat=later]');await pg.wait_for_timeout(150)
        chk(not await pg.is_visible('#platCard'),'4 later hides the card')
        await at('lateral');chk(not await pg.is_visible('#platCard'),'4 later: not asked again before the next lateral session')
        await pg.evaluate("()=>{S.history.push(T.rec(new Date().toISOString(),'A',1,[{ex:'lateral',sets:T.sets(10,[12,12,12])}]));save()}")
        await at('lateral');chk(await pg.is_visible('#platCard'),'4 after the next lateral session the card is back')
        await pg.click('[data-plat=a]');await pg.wait_for_timeout(150)
        r=await pg.evaluate("()=>{const ss=S.session;return[ss.log[ss.ei].sets.map(s=>s.w).join(),!!S.plat.lateral.reset,!!plateauOf('lateral')]}");chk(r==['9,9,9',True,False],'4 option a: -10 % weight and progress counts anew '+str(r))
        await pg.evaluate("()=>{delete S.plat.lateral;save()}");await at('lateral')
        await pg.click('[data-plat=b]');await pg.wait_for_timeout(150)
        r=await pg.evaluate("()=>{const ss=S.session;const it=ss.items[ss.ei];const p=planItems('A',false,1).find(x=>x.ex==='lateral');return[it.lo,it.hi,p.lo,p.hi,S.rr.lateral.join('-'),ss.log[ss.ei].sets[0].r]}")
        chk(r==[8,12,8,12,'8-12',8],'4 option b: new rep target, also for later sessions '+str(r))
        await pg.evaluate("()=>{delete S.plat.lateral;delete S.rr.lateral;save()}");await at('lateral')
        await pg.click('[data-plat=c]');await pg.wait_for_timeout(200)
        chk('Übung tauschen' in await pg.text_content('#sheet'),'4 option c: variants from the slot pool')
        await pg.click('#sheet [data-swap]:not([style])');await pg.wait_for_timeout(200)
        r=await pg.evaluate("()=>{const ss=S.session;return ss.items[ss.ei].ex}");chk(r!='lateral','4 option c swapped to '+r)
        await pg.evaluate("()=>{S.session=null;save();closeTrain()}")
        await at('plank','C');t=await pg.text_content('#platCard') if await pg.is_visible('#platCard') else ''
        chk('Zeit −10 %' in t and ' s' in t,'4 timed exercise: plateau in seconds')
        await pg.click('[data-plat=a]');await pg.wait_for_timeout(150)
        r=await pg.evaluate("()=>{const ss=S.session;return ss.log[ss.ei].sets.map(s=>s.w+'/'+s.r).join()}");chk(r.startswith('0/'),'4 timed option a lowers seconds '+r)
        await pg.evaluate("()=>{S.session=null;save();closeTrain()}")

        # ===== 5) WARM-UP SETS =====
        await put(pg,"()=>T.base()")
        await pg.click('#startBtn');await pg.wait_for_timeout(200)
        r=await pg.evaluate("[S.session.warm.length,S.session.warm[0].sec,!!S.session.wu]");chk(r==[5,180,True],'5 shorter general warm-up with warm-up sets '+str(r))
        await pg.click('#wSkipAll');await pg.wait_for_timeout(200)
        await pg.evaluate("()=>{const ss=S.session;ss.log[0].sets.forEach(x=>x.w=60);save();renderTrain()}");await pg.wait_for_timeout(100)
        rows=await pg.eval_on_selector_all('#wuCard .wurow','e=>e.map(x=>x.innerText.replace(/\\s+/g," "))');print('5 rows',rows)
        chk(len(rows)==3 and rows[0].startswith('25 kg × 8') and rows[1].startswith('35 kg × 5') and rows[2].startswith('47,5 kg × 3') and 'Pro Seite: 10 + 2,5 + 1,25 kg' in rows[2],'5 bar 60 kg -> 25/35/47,5 kg with plates per side')
        await pg.evaluate("()=>{S.settings.plates={'20':2,'10':1,'5':1,'2.5':1};save();renderTrain()}");await pg.wait_for_timeout(100)
        rows2=await pg.eval_on_selector_all('#wuCard .wurow .num','e=>e.map(x=>x.innerText)');chk(rows2==['25 kg × 8','35 kg × 5','50 kg × 3'],'5 rounding follows the plates you own '+str(rows2))
        await pg.evaluate("()=>{S.settings.plates={...DEF.settings.plates};save();renderTrain()}");await pg.wait_for_timeout(100)
        await pg.click('[data-wu="0"]');await pg.wait_for_timeout(200)
        r=await pg.evaluate("[S.session.wu.sets[0].done,Math.round((S.session.wuEnd-Date.now())/1000),$('#rest').hidden,S.session.log[0].sets.some(s=>s.done)]")
        chk(r[0] and 43<=r[1]<=45 and r[2] and not r[3],'5 tick: short 45 s pause inline, no work set touched '+str(r))
        await pg.screenshot(path=D+'/warmup_sets.png')
        await pg.evaluate("()=>{S.session.wuEnd=Date.now()+300;save();renderTrain()}");await pg.wait_for_timeout(700)
        chk('nächsten Aufwärmsatz' in await pg.inner_text('#wuRest'),'5 pause ends inline')
        await pg.click('[data-wu="1"]');await pg.click('[data-wu="2"]');await pg.wait_for_timeout(150)
        chk('erledigt' in await pg.inner_text('#wuRest'),'5 all warm-up sets ticked')
        await pg.click('#doneSet');await pg.wait_for_timeout(150);await pg.click('#rs');await pg.wait_for_timeout(150)
        chk(not await pg.is_visible('#wuCard'),'5 card gone after the first work set')
        await pg.evaluate("T.finish()");await pg.click('#saveS');await pg.wait_for_timeout(200)
        r=await pg.evaluate("()=>{const h=S.history[0];const n=h.log[0].sets.length;return{n,items:S.history[0].log.length,wu:h.warmup,vol:totalVol(),logVol:h.log.reduce((a,l)=>a+l.sets.reduce((b,s)=>b+(EX[l.ex].type==='time'?0:s.w*s.r),0),0),best:h.log[0].sets.every(s=>s.w===60)}}")
        print('5 saved',r['wu'])
        chk(r['wu'] and r['wu'][0]['ex']=='bench' and [s['w'] for s in r['wu'][0]['sets']]==[25,35,47.5] and r['vol']==r['logVol'] and r['best'],'5 warm-up sets stored apart: not in log, records or volume')
        # dumbbell main lift with a weight list, bodyweight main lift, setting off
        r=await pg.evaluate("""()=>{S.profile.weights.db=[10,12.5,15,17.5,20,22.5,25];S.prog.block=3;S.prog.done=[];save();startSession('A');const ss=S.session;ss.log[0].sets.forEach(x=>x.w=25);
          const a=[ss.items[0].ex,wuRows(ss).map(x=>x.w).join()];S.session=null;S.prog.done=['A'];startSession('B');const b=[S.session.items[0].ex,!!S.session.wu,estBase(S.session.items,false)];S.session=null;
          S.settings.warmSets=false;S.prog.done=[];startSession('A');const c=[!!S.session.wu,S.session.warm.length,estBase(S.session.items,false)];S.session=null;S.settings.warmSets=true;S.prog.block=1;save();return{a,b,c}}""")
        chk(r['a']==['dbbench','10,15,20'],'5 dumbbells snap to your list '+str(r['a']))
        chk(r['b'][0] in('chinup','pullup') and r['b'][1] is False and r['b'][2]==480,'5 bodyweight main lift: no warm-up sets '+str(r['b']))
        chk(r['c']==[False,6,480],'5 setting off: no warm-up sets, full general warm-up '+str(r['c']))
        await pg.evaluate("closeTrain()")
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(150);chk(await pg.is_visible('[data-wsets="0"]'),'5 setting "Aufwärmsätze" in settings')
        await pg.click('[data-wsets="0"]');r=await pg.evaluate("S.settings.warmSets");await pg.click('[data-wsets="1"]');chk(r is False and await pg.evaluate("S.settings.warmSets") is True,'5 setting toggles')
        await pg.click('[data-tab=home]')

        # ===== 6) all 12 units <= 60 min incl. warm-up sets + bonus =====
        for g in ['[...JOSCHYGEAR]','ALLGEAR','[...JOSCHYGEAR,"kb"]','[]']:
            for rf in [1,1.2]:
                t=await pg.evaluate("""([g,rf])=>{S.profile.gear=eval(g);S.settings.restF=rf;const o=[];for(let w=1;w<=4;w++)for(const d of DAYS){const it=planItems(d,false,w);o.push({c:w+d,m:estMinFull(d,false,w),ws:wsOn(it),base:estBase(it,false)})}return o}""",[g,rf])
                worst=max(x['m'] for x in t);print('6',g,rf,'max',round(worst,1),'warm-up sets in',sum(1 for x in t if x['ws']),'of 12')
                chk(worst<=60 and all((x['base']==360+225) if x['ws'] else x['base']==480 for x in t),'6 all 12 units <= 60 min '+g+' restF '+str(rf))
        await pg.evaluate("()=>{S.profile.gear=[...JOSCHYGEAR];S.settings.restF=1;save()}")

        # ===== 7) BACKUP roundtrip with all new fields + tolerant validation =====
        await pg.evaluate("""()=>{S.plat={lateral:{later:T.ago(1)}};S.rr={curl:[12,15]};S.history.push(T.rec(T.ago(0),'B',1,[{ex:'curl',sets:T.sets(12,[12,12]),eff:'hard'}]));save()}""")
        before=await pg.evaluate("localStorage.getItem(KEY)")
        await pg.click('[data-tab=set]');await pg.click('#bkBtn');await pg.wait_for_timeout(150)
        async with pg.expect_download() as dl:await pg.click('#bkExport')
        d=await dl.value;path=D+'/homegym-backup.json';await d.save_as(path);bk=json.load(open(path))
        st=bk['state'];chk(st==json.loads(before) and st['prog']['v']==1 and st['rr']=={'curl':[12,15]} and 'plat' in st and any('warmup' in h for h in st['history']) and any(l.get('eff') for h in st['history'] for l in h['log']),'7 export contains prog, plat, rr, effort, warm-up sets')
        await pg.evaluate("()=>{closeSheet();S.history=[];S.prog={v:1,block:4,done:['A','B'],cycle:9};S.rr={};delete S.plat;save()}")
        await pg.click('#bkBtn');await pg.set_input_files('#bkFile',path);await pg.wait_for_timeout(300)
        async with pg.expect_navigation():await pg.click('#cOk')
        await boot(pg);after=await pg.evaluate("localStorage.getItem(KEY)")
        chk(json.loads(after)==json.loads(before),'7 import restores the identical state')
        r=await pg.evaluate("""()=>{const bk=JSON.parse(backupText());const s=bk.state;s.prog={block:9,done:'x'};s.history[0].log[0].eff='super';s.history[0].warmup='kaputt';s.rr={curl:[15,3],bench:[6,8],nope:[1,2]};s.plat={bench:'x',lateral:{later:'nie'}};
          s.settings.warmSets='ja';s.session={plan:'A',week:1,quick:false,items:[{ex:'bench',sets:1,lo:6,hi:8}],warm:[],start:1,phase:'work',wi:0,ei:0,si:0,log:[{ex:'bench',sets:[{w:40,r:8,done:false}],eff:'meh'}],wu:{ex:'bench',sets:[1]}};
          const st=parseBackup(JSON.stringify(bk)).st;return{prog:validProg(st.prog),eff:'eff' in st.history[0].log[0],wu:'warmup' in st.history[0],rr:st.rr,plat:st.plat,ws:'warmSets' in st.settings,ss:!!st.session,swu:'wu' in st.session,seff:'eff' in st.session.log[0],n:st.history.length}}""")
        print('7 tolerant',r)
        chk(r['prog'] and not r['eff'] and not r['wu'] and r['rr']=={'bench':[6,8]} and r['plat']=={'lateral':{}} and not r['ws'] and r['ss'] and not r['swu'] and not r['seff'],'7 parseBackup validates new fields tolerantly, history kept')

        await pg.click('[data-tab=set]');await pg.wait_for_timeout(150);v=await pg.text_content('#verLine');chk('Version 3.1 · @ Joschy' in v,v)
        # ===== 8) Abnahme-Fixes 3.0 =====
        # 8a warm-up sets follow a swapped first main lift (swap sheet, plateau "Variante", gear change); bodyweight -> no card
        await put(pg,"()=>T.base()")
        r=await pg.evaluate("""()=>{S.prog.block=1;S.prog.done=[];startSession('A');const ss=S.session;ss.phase='work';ss.ei=0;ss.si=0;ss.log[0].sets.forEach(x=>x.w=60);
          ss.wu.sets[0]={w:25,r:8,p:.4,done:true};save();renderTrain();const pool=swapPool(ss.items[0]);return{ex:ss.items[0].ex,pool,k:pool.find(k=>k!==ss.items[0].ex&&wuEx(k))}}""")
        print('8a pool',r)
        await pg.evaluate("openSwap()");await pg.wait_for_timeout(150);await pg.click(f'#sheet [data-swap="{r["k"]}"]');await pg.wait_for_timeout(200)
        q=await pg.evaluate("""()=>{const ss=S.session;ss.log[0].sets.forEach(x=>x.w=EX[ss.items[0].ex].type==='bar'?60:20);save();renderTrain();
          return{ex:ss.items[0].ex,wu:ss.wu&&ss.wu.ex,rows:wuRows(ss).length,anyDone:wuRows(ss).some(x=>x.done),card:!!$('#wuCard'),prev:ss.wuPrev}}""")
        print('8a after swap',q)
        chk(q['ex']==r['k'] and q['wu']==r['k'] and q['rows']>0 and not q['anyDone'] and q['card'],'8a swap of the first main lift -> warm-up sets recalculated for the new exercise')
        chk(q['prev']==[{'ex':r['ex'],'sets':[{'w':25,'r':8,'p':.4}]}],'8a warm-up set already ticked for the old exercise is kept')
        r2=await pg.evaluate("""()=>{const ss=S.session;const it=ss.items[0];const bwk=['pushup','feetpush','diamondpush'].find(k=>EX[k]&&!wuEx(k));
          ss.items[0]={...it,ex:bwk};ss.log[0]={ex:bwk,sets:initSets(ss.items[0],null)};const c=wuSync(ss);save();renderTrain();return[bwk,c,'wu' in ss,!!$('#wuCard'),wuActive(ss)]}""")
        chk(r2[1] is True and r2[2] is False and r2[3] is False and r2[4] is False,'8a new exercise without weight -> no warm-up card '+str(r2))
        r3=await pg.evaluate("""()=>{const ss=S.session;ss.items[0]={...ss.items[0],ex:'bench'};ss.log[0]={ex:'bench',sets:initSets(ss.items[0],null)};wuSync(ss);const a=[!!ss.wu,ss.wu&&ss.wu.ex];
          ss.log[0].sets[0].done=true;ss.items[0]={...ss.items[0],ex:'dbbench'};const b=wuSync(ss);ss.log[0].sets[0].done=false;return[...a,b,ss.wu.ex]}""")
        chk(r3==[True,'bench',False,'bench'],'8a back to a weighted lift -> card again; after a work set nothing changes '+str(r3))
        await pg.evaluate("()=>{const ss=S.session;ss.log[0].sets.forEach(x=>x.w=60);ss.wu.sets[0]={w:25,r:8,p:.4,done:true};T.finish()}");await pg.click('#saveS');await pg.wait_for_timeout(200)
        r=await pg.evaluate("S.history[S.history.length-1].warmup")
        chk(r==[{'ex':'bench','sets':[{'w':25,'r':8,'p':.4}]}]*2,'8a saved record keeps the warm-up sets ticked before the swap and after it '+str(r))
        # gear change during a session (adaptSession): barbell removed -> first lift replaced, warm-up follows
        r=await pg.evaluate("""()=>{S.profile.gear=[...JOSCHYGEAR];startSession('A');const ss=S.session;ss.phase='work';ss.ei=0;const a=ss.items[0].ex;
          S.profile.gear=S.profile.gear.filter(g=>g!=='barbell');const ch=adaptSession();const b=ss.items[0].ex;ss.log[0].sets.forEach(x=>x.w=20);
          const o={a,b,ch,wu:ss.wu?ss.wu.ex:null,rows:wuRows(ss).length,need:wuEx(b)};S.profile.gear=[...JOSCHYGEAR];S.session=null;save();closeTrain();return o}""")
        print('8a gear',r)
        chk(r['ch'] and r['a']!=r['b'] and (r['wu']==r['b'] and r['rows']>0 if r['need'] else r['wu'] is None),'8a gear change: warm-up recalculated for the replacement')
        # plateau option "Variante" on the first main lift
        await put(pg,"""()=>{const st=T.base();for(let i=0;i<4;i++)st.history.push(T.rec(T.ago(13-i*3),'A',1,[{ex:'bench',sets:T.sets(60,[8,7,7,6])}]));return st}""")
        await pg.evaluate("()=>{S.prog.block=1;S.prog.done=[];startSession('A');const ss=S.session;ss.phase='work';ss.ei=0;ss.si=0;save();renderTrain()}");await pg.wait_for_timeout(200)
        chk(await pg.is_visible('#platCard'),'8a plateau card on the first main lift')
        await pg.click('[data-plat=c]');await pg.wait_for_timeout(200)
        k=await pg.evaluate("()=>[...document.querySelectorAll('#sheet [data-swap]')].map(b=>b.dataset.swap).find(k=>k!=='bench'&&wuEx(k))")
        await pg.click(f'#sheet [data-swap="{k}"]');await pg.wait_for_timeout(200)
        r=await pg.evaluate("()=>{const ss=S.session;ss.log[0].sets.forEach(x=>x.w=EX[ss.items[0].ex].type==='bar'?60:20);save();renderTrain();return[ss.items[0].ex,ss.wu&&ss.wu.ex,wuRows(ss).length>0,!!$('#wuCard')]}")
        chk(r[0]==k and r[1]==k and r[2] and r[3],'8a plateau "Variante" -> warm-up sets for the new exercise '+str(r))
        await pg.evaluate("()=>{S.session=null;save();closeTrain()}")

        # 8b/8c suggestion texts: bodyweight with 0 kg = clear instruction; lightest kettlebell twice hard = weight stays, fewer reps
        r=await pg.evaluate("""()=>{const o={};const t=g=>g.why.replace(/<[^>]+>/g,'');const run=(ex,it,reps,eff)=>{S.history=[T.rec(T.ago(2),'B',1,[{ex,sets:T.sets(0,reps),eff}])];return t(suggest(it))};
          const pu={ex:'pullup',sets:4,lo:5,hi:8},iv={ex:'invrow',sets:3,lo:8,hi:12};
          o.easy=run('invrow',iv,[10,10,10],'easy');o.top=run('pullup',pu,[8,8,8,8],'ok');o.early=run('pullup',pu,[8,7,7,8],'easy');o.miss=run('pullup',pu,[6,5,4,4],null);o.hard=run('pullup',pu,[6,5,5,5],'hard');
          S.profile.gear=[...JOSCHYGEAR,'kb'];S.profile.weights.kb=[8,12,16];const kb={ex:'kbswing',sets:3,lo:12,hi:15};
          S.history=[T.rec(T.ago(5),'C',1,[{ex:'kbswing',sets:T.sets(8,[10,9,8]),eff:'hard'}]),T.rec(T.ago(2),'C',1,[{ex:'kbswing',sets:T.sets(8,[10,9,9]),eff:'hard'}])];
          const g=suggest(kb);o.kb=[g.w,t(g)];S.profile.gear=[...JOSCHYGEAR];S.history=[];return o}""")
        print('8b',json.dumps(r,ensure_ascii=False))
        chk(r['easy'].startswith('Ziel heute: 11–12 Wiederholungen pro Satz, weil letzte Einheit leicht'),'8b bodyweight, last unit easy -> "Ziel heute: 11–12 Wiederholungen pro Satz, weil …"')
        chk('schwerere Variante' in r['top'] and 'Zusatzgewicht' in r['top'] and 'langsamer' in r['top'],'8b upper target reached -> heavier variant / extra weight / slower tempo')
        chk(r['early'].startswith('Ziel heute: 8 Wiederholungen pro Satz') and r['miss'].startswith('Ziel heute: 5–8 Wiederholungen') and r['hard'].startswith('Ziel heute: 5–8'),'8b all bodyweight cases are full instructions')
        chk(all(not v[:1].islower() and 'Ziel heute' in v or 'Nächster Schritt' in v for v in [r['easy'],r['top'],r['early'],r['miss'],r['hard']]),'8b no sentence fragments')
        chk(r['kb'][0]==8 and 'leichtestes Gewicht und bleibt' in r['kb'][1] and '10–12 pro Satz' in r['kb'][1] and 'leichter' not in r['kb'][1] and 'halten' not in r['kb'][1].lower(),'8c lightest kettlebell, twice hard -> weight stays, lower rep target, no contradiction')

        # 8d prog.mig only on a real migration
        await put(pg,"()=>{const st=T.base();delete st.prog;return st}")
        r=await pg.evaluate("[validProg(S.prog),'mig' in S.prog]");chk(r==[True,False],'8d fresh install: no "mig" mark '+str(r))
        await put(pg,"()=>{const st=T.base();st.history=[T.rec(T.ago(1),'A',1,[{ex:'bench',sets:T.sets(40,[8,8])}])];return st}")
        r=await pg.evaluate("S.prog.mig");chk(r=='2.x','8d real 2.x data -> mig 2.x')

        # 8e migration in a new calendar week: block of last week begun (A, B done, C missing) -> continue with C of that block
        await put(pg,"""()=>{const st=T.base();const w=T.ws();st.cycleStart=w-WEEKMS;const lw=d=>new Date(w-WEEKMS+d*864e5+18*36e5).toISOString();
          st.history=[T.rec(lw(0),'A',1,[{ex:'bench',sets:T.sets(60,[8,8,7,7])}]),T.rec(lw(2),'B',1,[{ex:'pullup',sets:T.sets(0,[8,7,6,6])}])];return st}""")
        r=await pg.evaluate("[S.prog.block,S.prog.done.join(),nextUnit(),cycleWeek(),T.same(),S.prog.mig]")
        chk(r==[1,'A,B','C',2,True,'2.x'],'8e begun block of last week kept: block 1, next C (calendar already week 2) '+str(r))
        r=await pg.evaluate("()=>{const a=JSON.stringify(S.prog);return[migrate3(),a===JSON.stringify(S.prog)]}");await pg.reload();await boot(pg)
        r2=await pg.evaluate("[S.prog.block,S.prog.done.join()]");chk(r==[False,True] and r2==[1,'A,B'],'8e idempotent (call + reload) '+str(r2))
        await pg.evaluate("()=>{startSession(nextUnit());T.finish()}");await pg.click('#saveS');await pg.wait_for_timeout(200)
        r=await pg.evaluate("[S.history[S.history.length-1].plan,S.prog.block,S.prog.done.length,nextUnit()]");chk(r==['C',2,0,'A'],'8e C finishes block 1 -> block 2 A '+str(r))
        # last unit longer than ~21 days ago -> new block (calendar), nothing taken over
        await put(pg,"""()=>{const st=T.base();const w=T.ws();st.cycleStart=w-5*WEEKMS;
          st.history=[T.rec(T.ago(26),'A',1,[{ex:'bench',sets:T.sets(60,[8,8,7,7])}]),T.rec(T.ago(23),'B',1,[{ex:'pullup',sets:T.sets(0,[8,7,6,6])}])];st.history.forEach(h=>h.week=((Math.round((weekStart(new Date(h.date)).getTime()-st.cycleStart)/WEEKMS)%4)+4)%4+1);return st}""")
        r=await pg.evaluate("[S.prog.block,S.prog.done.join(),nextUnit(),cycleWeek(),T.same()]")
        chk(r[0]==r[3] and r[1]=='' and r[2]=='A' and r[4],'8e last unit > 21 days ago -> new block (calendar), next A '+str(r))
        # last week's block complete (A, B, C), nothing this week -> next block A
        await put(pg,"""()=>{const st=T.base();const w=T.ws();st.cycleStart=w-WEEKMS;const lw=d=>new Date(w-WEEKMS+d*864e5+18*36e5).toISOString();
          st.history=[T.rec(lw(0),'A',1,[{ex:'bench',sets:T.sets(60,[8])}]),T.rec(lw(2),'B',1,[{ex:'pullup',sets:T.sets(0,[8])}]),T.rec(lw(4),'C',1,[{ex:'squat',sets:T.sets(80,[8])}])];return st}""")
        r=await pg.evaluate("[S.prog.block,S.prog.done.join(),nextUnit()]");chk(r==[2,'','A'],'8e complete block last week -> block 2 A '+str(r))

        print('errors',errs);chk(not errs,'no JS errors')
        await b.close()
    srv.kill()
    print('RESULT','ALL OK' if not FAIL else 'FAIL %d'%len(FAIL))
asyncio.run(main())
