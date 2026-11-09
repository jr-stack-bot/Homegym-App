# Homegym 2.1 @ Joschy – Halte-Übungen, Finisher, Zeit, Geräte-Editor, Backup
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright
D=_SHOTS.rstrip('/')
srv=subprocess.Popen([sys.executable,'-m','http.server','8769','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8769/index.html'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},accept_downloads=True);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await pg.wait_for_timeout(400)
        await pg.evaluate("()=>{S.profile={name:'Joschy',gear:[...JOSCHYGEAR],preset:'joschy'};S.settings.voiceMode='off';save();location.reload()}");await pg.wait_for_timeout(600)
        assert 'Joschy' in await pg.title()
        # 1) split stays clean: every exercise in exactly one day pool, holds exist with animation
        r=await pg.evaluate("""()=>{const dup=[];const seen={};for(const d of DAYS)for(const k of DAYEX[d]){if(seen[k]&&seen[k]!==d)dup.push(k);seen[k]=d}
          const holds=Object.keys(EX).filter(isHoldEx);const bad=holds.filter(k=>!AN[animOf(k)]||!CAT[k]||!SUB[k]);
          const fins=Object.values(DAYHOLD).flat().filter(k=>!seen[k]);return{dup,holds,bad,fins}}""")
        print('holds',len(r['holds']),r['holds']);assert not r['dup'] and not r['bad'] and len(r['holds'])>=14,r
        # 2) all 12 sessions: hold finisher marked bonus, < 60 min incl. bonus (Joschy gear, all gear, +kb, longer rests)
        for g in ['[...JOSCHYGEAR]','ALLGEAR','[...JOSCHYGEAR,"kb"]','[]']:
            for rf in [1,1.2]:
                t=await pg.evaluate("""([g,rf])=>{S.profile.gear=eval(g);S.settings.restF=rf;const o=[];for(let w=1;w<=4;w++)for(const d of DAYS){const it=planItems(d,false,w);const hf=it.filter(x=>x.hfin);
                  o.push({c:w+d,m:estMinFull(d,false,w),hf:hf.length,hk:hf[0]&&hf[0].ex,last:it[it.length-1].hfin,inPool:hf[0]&&DAYHOLD[d].includes(hf[0].ex)})}return o}""",[g,rf])
                worst=max(x['m'] for x in t);print(g,rf,'max min',round(worst,1))
                assert all(x['hf']==1 and x['last'] and x['inPool'] for x in t),t
                assert worst<60,t
        await pg.evaluate("()=>{S.profile.gear=[...JOSCHYGEAR];S.settings.restF=1;save()}")
        # 3) training: hold finisher visible on home + month plan, swap dialog offers hold variants
        await pg.evaluate("()=>{S.pick={day:'A',ws:weekStart(new Date()).getTime()};S.cycleStart=weekStart(new Date()).getTime();save();go('home')}");await pg.wait_for_timeout(200)
        home=(await pg.inner_text('#v-home')).lower();assert 'bonus · halten' in home and 'hochstütz halten' in home and 'bonus +' in home,home
        await pg.click('#monthBtn');await pg.wait_for_timeout(150);mt=(await pg.inner_text('#sheet')).lower();assert 'hochstütz halten' in mt and 'superman halten' in mt;await pg.click('#sheet [data-close]')
        await pg.click('#startBtn');await pg.wait_for_timeout(300);await pg.click('#wSkipAll');await pg.wait_for_timeout(300)
        assert await pg.evaluate("S.session.items[0].ex")=='bench'
        await pg.click('#swapBtn');await pg.wait_for_timeout(200)
        sw=await pg.eval_on_selector_all('[data-swap]','e=>e.map(x=>x.dataset.swap)');print('swap bench',sw);assert 'benchpause' in sw and 'pushpause' in sw
        await pg.click('[data-swap=benchpause]');await pg.wait_for_timeout(300)
        wt=(await pg.inner_text('#trainInner')).lower();assert 'bankdrücken mit pause' in wt and 'halte-variante' in wt and 'halte-timer 2s' in wt
        r0=await pg.evaluate("S.session.log[0].sets[0].r");await pg.click('#holdBtn');await pg.wait_for_timeout(2600)
        assert await pg.is_hidden('#sheetBg') and await pg.evaluate("S.session.log[0].sets[0].r")==r0,'tempo hold timer must not overwrite reps'
        await pg.screenshot(path=D+'/work_hold.png')
        # jump to a pure-hold slot and check swap + timer writes seconds
        await pg.evaluate("()=>{const ss=S.session;ss.ei=ss.items.length-1;ss.si=0;save();renderTrain()}");await pg.wait_for_timeout(300)
        wt=(await pg.inner_text('#trainInner')).lower();assert 'halte-finisher' in wt and 'halte-timer' in wt,wt
        await pg.evaluate("()=>{const it=curItem();it.hi=2;save();renderTrain()}");await pg.click('#holdBtn');await pg.wait_for_timeout(2700)
        assert await pg.evaluate("S.session.log[S.session.ei].sets[0].r")==2
        # pull day: hold variants in swap for a row slot
        await pg.evaluate("()=>{S.session=null;save();closeTrain()}")
        r=await pg.evaluate("()=>{const o={};for(const d of DAYS)for(const it of planItems(d,false,1))o[d+':'+it.ex]=swapPool(it,d);return o}")
        assert 'pullhold' in r['B:pullup'] and 'curlhold' in r['B:curl'] and 'gobletpause' in r['C:squat'] and 'hollow' in r['C:plank'] and 'lungehold' in r['C:revlunge'],r
        assert not any(k in r['A:bench'] for k in ['highplank','plank']),'no pure hold for main lift'
        # 4) gear editor changes plan + kettlebell weights flow into suggestions
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(300)
        assert 'joschys geräte' in (await pg.inner_text('#gearCard')).lower() and 'Version 2.2' in await pg.inner_text('#verLine') and '@ Joschy' in await pg.inner_text('#verLine')
        await pg.click('[data-sgear=kb]');await pg.wait_for_timeout(100)
        chips=await pg.eval_on_selector_all('[data-wdel=kb]','e=>e.map(x=>+x.dataset.v)');assert chips==[8,12,16],chips
        await pg.fill('#wIn-kb','20');await pg.click('[data-wadd=kb]');await pg.click('[data-wdel=kb][data-v="8"]')
        await pg.fill('#wIn-db','10 12,5 15');await pg.click('[data-wadd=db]')
        await pg.click('[data-sgear=barbell]');await pg.click('#gearSave');await pg.wait_for_timeout(200)
        r=await pg.evaluate("()=>({w:S.profile.weights,g:S.profile.gear.includes('kb')&&!S.profile.gear.includes('barbell'),a:planItems('A',false,1).map(x=>x.ex),c:planItems('C',false,1).map(x=>x.ex),b:planItems('B',false,1).map(x=>x.ex)})")
        print('gear',r);assert r['w']['kb']==[12,16,20] and r['w']['db']==[10,12.5,15] and r['g']
        assert 'bench' not in r['a'] and 'squat' not in r['c'] and 'kbpushpress' in r['a'] and 'kbswing' in r['c'] and ('kbrow' in r['b'] or 'kbclean' in r['b'])
        s=await pg.evaluate("""()=>{const it={ex:'kbswing',sets:3,lo:12,hi:15};const a=startW('kbswing',suggest(it));
          S.history.push({date:new Date(Date.now()-864e5*3).toISOString(),plan:'C',day:'C',week:1,dur:3000,log:[{ex:'kbswing',sets:[{w:12,r:15,done:true},{w:12,r:15,done:true},{w:12,r:15,done:true}]},{ex:'goblet',sets:[{w:11,r:8,done:true}]}]});
          const up=suggest(it).w;S.history[S.history.length-1].log[0].sets.forEach(x=>x.w=20);const top=suggest(it);const g=suggest({ex:'goblet',sets:3,lo:10,hi:12}).w;return{a,up,top:top.w,topUp:top.up,g,step:stepW([10,12.5,15],12.5,1)}}""")
        print('weights',s);assert s['a']==12 and s['up']==16 and s['top']==20 and not s['topUp'] and s['g']==10 and s['step']==15
        await pg.screenshot(path=D+'/settings.png',full_page=True)
        # 5) backup export / import roundtrip (browser fallback)
        await pg.evaluate("()=>{S.body.push({d:'2026-01-01',kg:81.5});save()}")
        before=await pg.evaluate("localStorage.getItem(KEY)")
        await pg.click('#bkBtn');await pg.wait_for_timeout(150)
        async with pg.expect_download() as dl:await pg.click('#bkExport')
        d=await dl.value;assert d.suggested_filename=='homegym-backup.json';path=D+'/homegym-backup.json';await d.save_as(path)
        bk=json.load(open(path));assert bk['app']=='homegym' and bk['v']==5 and bk['state']==json.loads(before),'export = whole state'
        # mess up data, then restore
        await pg.evaluate("()=>{S.history=[];S.body=[];S.profile.name='Kaputt';S.profile.weights={};save()}")
        # invalid file first
        await pg.evaluate('closeSheet()');open(D+'/bad.json','w').write('{"foo":1}');await pg.click('[data-tab=set]');await pg.click('#bkBtn')
        await pg.set_input_files('#bkFile',D+'/bad.json');await pg.wait_for_timeout(300);assert 'keine Homegym' in await pg.inner_text('#sheet');await pg.click('#sheet [data-close]')
        open(D+'/newer.json','w').write(json.dumps({**bk,'v':99}));await pg.click('#bkBtn');await pg.set_input_files('#bkFile',D+'/newer.json');await pg.wait_for_timeout(300)
        assert 'neueren' in await pg.inner_text('#sheet');await pg.click('#sheet [data-close]')
        await pg.click('#bkBtn');await pg.set_input_files('#bkFile',path);await pg.wait_for_timeout(300)
        assert 'backup wiederherstellen?' in (await pg.inner_text('#sheet')).lower()
        async with pg.expect_navigation():await pg.click('#cOk')
        await pg.wait_for_timeout(500)
        r=await pg.evaluate("()=>({n:S.profile.name,h:S.history.length,b:S.body.some(x=>x.kg===81.5),w:S.profile.weights.kb,raw:localStorage.getItem(KEY)})")
        print('restored',{k:v for k,v in r.items() if k!='raw'});assert r['n']=='Joschy' and r['h']==1 and r['b'] and r['w']==[12,16,20]
        # old v4 text backup still importable
        await pg.evaluate("()=>{const t=JSON.stringify({v:4,history:[{date:new Date().toISOString(),plan:'A',week:1,dur:60,log:[{ex:'bench',sets:[{w:40,r:8,done:true}]}]}],settings:{goal:2},body:[],profile:{name:'Alt'}});importBackupText(t)}")
        await pg.wait_for_timeout(200)
        async with pg.expect_navigation():await pg.click('#cOk')
        await pg.wait_for_timeout(500);r=await pg.evaluate("[S.profile.name,S.history.length,Array.isArray(S.profile.gear),S.settings.goal]");print('v4',r);assert r==['Alt',1,True,2]
        # 5b) backup with a broken running session (log shorter than items): session dropped, rest restored, no "reading 'sets'"
        bad=json.load(open(path));bad['state']['session']={'plan':'A','week':1,'quick':False,'items':[{'ex':'bench','sets':3,'lo':6,'hi':8,'slot':0},{'ex':'row','sets':3,'lo':8,'hi':10,'slot':1}],
          'warm':[{'n':'x'}],'start':1,'phase':'work','wi':0,'ei':1,'si':0,'log':[{'ex':'bench','sets':[{'w':40,'r':8,'done':True}]}]}
        await pg.evaluate("t=>importBackupText(t)",json.dumps(bad));await pg.wait_for_timeout(200)
        async with pg.expect_navigation():await pg.click('#cOk')
        await pg.wait_for_timeout(500);r=await pg.evaluate("[S.session,S.history.length,S.profile.name]");print('broken session',r);assert r==[None,1,'Joschy'],r
        r=await pg.evaluate("""()=>{const st=d=>parseBackup(JSON.stringify(d)).st.session;const ok={plan:'A',week:1,items:[{ex:'bench',sets:1,lo:6,hi:8}],warm:[],start:1,phase:'work',wi:0,ei:0,si:0,log:[{ex:'bench',sets:[{w:40,r:8,done:false}]}]};
          const mk=s=>({app:'homegym',kind:'backup',v:BK_VER,state:{history:[],settings:{},body:[],session:s}});
          return[!!st(mk(ok)),st(mk({...ok,log:[]})),st(mk({...ok,items:[{ex:'nope',sets:1,lo:6,hi:8}],log:[{ex:'nope',sets:[{}]}]})),st(mk({...ok,ei:3})),st(mk({...ok,items:[{ex:'bench'}]})),st(mk({...ok,log:[{ex:'bench'}]}))]}""")
        print('validate',r);assert r==[True,None,None,None,None,None],r
        # 5c) gear switched off during a running session: undone dumbbell exercises replaced, finished sets kept
        await pg.evaluate("()=>{S.profile.gear=[...JOSCHYGEAR];S.cycleStart=weekStart(new Date()).getTime();save();startSession('A');const ss=S.session;ss.phase='work';ss.ei=1;ss.log[1].sets[0].done=true;save();closeTrain()}");await pg.wait_for_timeout(200)
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(200);await pg.click('[data-sgear=db]');await pg.click('#gearSave');await pg.wait_for_timeout(150)
        assert 'plan an neue geräte angepasst' in (await pg.inner_text('#toast')).lower()
        r=await pg.evaluate("()=>({e0:S.session.items[1].ex,d0:S.session.log[1].sets[0].done,ok:S.session.items.every((it,i)=>canDo(it.ex)||it.noGear||S.session.log[i].sets.some(x=>x.done)),same:S.session.items.every((it,i)=>it.ex===S.session.log[i].ex),ad:S.session.items.filter(x=>x.adapted).map(x=>x.orig+'>'+x.ex)})")
        print('adapt',r);assert r['e0']=='ohpdb' and r['d0'] and r['ok'] and r['same'] and r['ad'],r
        await pg.evaluate("()=>{S.session.ei=1;S.session.si=0;save();openTrain()}");await pg.wait_for_timeout(200);await pg.evaluate("()=>{closeTrain();S.session=null;S.profile.gear=[...JOSCHYGEAR];save()}")
        # 6) reset still clears everything (removeItem + fresh state)
        await pg.click('[data-tab=set]');await pg.click('#reset');await pg.click('#cOk');await pg.wait_for_timeout(300)
        await pg.reload();await pg.wait_for_timeout(400)
        r=await pg.evaluate("[S.history.length,!!(S.profile&&S.profile.name)]");assert r==[0,False] and await pg.is_visible('#onb'),r
        # 6b) first start: restore a backup straight from onboarding, no name/gear steps afterwards
        assert await pg.is_visible('#onbRestore')
        await pg.set_input_files('#bkFile',path);await pg.wait_for_timeout(300)
        assert await pg.is_visible('#cOk') and 'backup wiederherstellen?' in (await pg.inner_text('#sheet')).lower()
        async with pg.expect_navigation():await pg.click('#cOk')
        await pg.wait_for_timeout(500);r=await pg.evaluate("[S.profile.name,S.history.length]");print('onb restore',r)
        assert r==['Joschy',1] and await pg.is_hidden('#onb'),r
        # 7) library lists the new exercises, no errors
        print('errors',errs);assert not errs
        await b.close()
    srv.kill();print('ALL OK')
asyncio.run(main())
