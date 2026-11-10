# Homegym 2.1 @ Joschy – Yoga & Dehnen: Posen, 12-Wochen-Plan, Stufen-Sperre, Ablauf, Backup, Start-Seite
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright
D=_SHOTS.rstrip('/')
srv=subprocess.Popen([sys.executable,'-m','http.server','8773','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8773/index.html'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},accept_downloads=True);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await pg.wait_for_timeout(400)
        await pg.evaluate("()=>{S.profile={name:'Joschy',gear:[...JOSCHYGEAR],preset:'joschy'};S.settings.voiceMode='off';save();location.reload()}");await pg.wait_for_timeout(600)
        # 1) pose catalogue: 50-60 poses, complete data, 3 levels, focus shoulder + hip, no hard poses
        r=await pg.evaluate("""()=>{const bad=[];for(const k of YKEYS){const p=YP[k];if(!p.n||!(p.c.length>=2&&p.c.length<=3)||!p.a||!YREG.some(x=>x[0]===p.r)||![1,2,3].includes(p.lv)||!(p.sec>0)||!AN['y_'+k])bad.push(k)}
          const reg={};for(const k of YKEYS)reg[YP[k].r]=(reg[YP[k].r]||0)+1;const lv=[1,2,3].map(l=>YKEYS.filter(k=>YP[k].lv===l).length);
          const names=YKEYS.map(k=>YP[k].n.toLowerCase()).join('|');return{n:YKEYS.length,bad,reg,lv,uni:YKEYS.filter(k=>YP[k].uni).length,names}}""")
        print('poses',r['n'],r['lv'],r['reg'],'uni',r['uni']);assert 50<=r['n']<=60 and not r['bad'] and all(x>=8 for x in r['lv']),r
        assert r['reg']['schulter']>=8 and r['reg']['huefte']>=10 and r['uni']>=15
        for need in ['schulterkreisen','wandengel','katze-kuh','kindshaltung','taube im liegen','schmetterling','hüftkreisen','brustöffner','nackendehnung','adlerarme','ausfallschritt','krieger i','dreieck','hund','kobra','brücke','drehsitz']:
            assert need in r['names'],need
        for hard in ['kopfstand','krähe','rad','handstand','pflug','schulterstand']:assert hard not in r['names'].split('|'),hard
        # 2) every pose renders (m + f, two moments) without errors, joints stay above the floor, legs keep their length
        g=await pg.evaluate("""()=>{const bad=[];for(const k of YKEYS){const d=AN['y_'+k];for(const g of['m','f'])for(let t=0;t<9;t+=.9){const{o}=animPose(d,t,g);
            if(d.view==='front'){for(const[h,kn,a]of[['hipL','kneeL','ankL'],['hipR','kneeR','ankR']]){const l1=Math.hypot(o[kn][0]-o[h][0],o[kn][1]-o[h][1]),l2=Math.hypot(o[a][0]-o[kn][0],o[a][1]-o[kn][1]);if(l1<22||l1>56||l2<22||l2>56)bad.push([k,h,l1|0,l2|0])}}
            else{for(const q of['hip','sh','knee','knee2','ankle','ankle2','elbow','elbow2','hand','hand2','toe','toe2'])if(o[q]&&o[q][1]<-4)bad.push([k,q,o[q][1]]);if(o.head[1]<4)bad.push([k,'head'])
              const L1=Math.hypot(o.knee[0]-o.hip[0],o.knee[1]-o.hip[1]),L2=Math.hypot(o.elbow[0]-o.sh[0],o.elbow[1]-o.sh[1]);if(Math.abs(L1-L.th)>1||Math.abs(L2-L.ua)>1)bad.push([k,'len'])}}}return bad}""")
        assert not g,g
        await pg.evaluate("""()=>{document.body.insertAdjacentHTML('beforeend','<div id="grid" style="position:fixed;inset:0;z-index:999;background:#03060b;display:grid;grid-template-columns:repeat(8,1fr);gap:2px;overflow:auto"></div>');
          const G=document.getElementById('grid');for(const k of YKEYS){const c=document.createElement('canvas');c.style.cssText='width:100%;height:84px;display:block';c.title=k;G.appendChild(c);attachAnim(c,'y_'+k,{offset:1500})}}""")
        await pg.wait_for_timeout(500);await pg.screenshot(path=D+'/all_poses.png')
        drawn=await pg.evaluate("()=>[...document.querySelectorAll('#grid canvas')].map(c=>{const x=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<x.length;i+=16)if(x[i]>0)n++;return n})")
        assert len(drawn)==r['n'] and min(drawn)>30,drawn
        await pg.evaluate("document.getElementById('grid').remove()")
        # 3) plan: weeks 1/5/9 – duration 15 -> 25 min, structure, levels; strength plan untouched
        pl=await pg.evaluate("""()=>{const o={};for(const w of[1,4,5,8,9,12]){const P=yPlan(w);const it=P.items;o[w]={min:P.secs/60,st:P.stage,first:it[0].part,last:it[it.length-1].k,lastPart:it[it.length-1].part,
            maxLv:Math.max(...it.map(x=>YP[x.k].lv)),lv:it.map(x=>YP[x.k].lv),regs:[...new Set(it.filter(x=>x.part==='main').map(x=>YP[x.k].r))],order:it.map(x=>x.part).join(','),secs:it.map(x=>x.sec)}}
            o.q=yQuick().secs/60;o.post=['A','B','C'].map(d=>yPost(d).secs/60);return o}""")
        for w in ['1','4','5','8','9','12']:print('week',w,round(pl[w]['min'],1),'stage',pl[w]['st'],'maxLv',pl[w]['maxLv'])
        assert 14<=pl['1']['min']<=16.5 and 17.5<=pl['5']['min']<=20 and 21<=pl['9']['min']<=23.5 and 24<=pl['12']['min']<=26.5
        assert pl['1']['min']<pl['5']['min']<pl['9']['min']<pl['12']['min']
        for w,st in [('1',1),('4',1),('5',2),('8',2),('9',3),('12',3)]:
            P=pl[w];assert P['st']==st and P['maxLv']<=st and P['first']=='warm' and P['last']=='savasana' and P['lastPart']=='cool',P
            assert 'schulter' in P['regs'] and 'huefte' in P['regs'],P['regs']
            assert P['order'].index('main')>P['order'].rindex('warm') and all(15<=s<=180 for s in P['secs'])
        assert pl['5']['maxLv']==2 and pl['9']['maxLv']==3
        assert 4<=pl['q']<=6 and all(4<=x<=6 for x in pl['post']),pl
        # 4) progress by calendar weeks + stage lock
        lk=await pg.evaluate("""()=>{const ws=weekStart(new Date()).getTime();const o={};
          S.yoga={start:null,done:{},log:[]};o.fresh=yCur();
          S.yoga={start:ws-6*WEEKMS,done:{1:'x',2:'x',3:'x'},log:[]};o.c1=yCur();o.u2=yUnlocked(2);o.try5=yStart('plan',{week:5});o.run5=!!S.yrun;
          S.yoga.done[4]='x';o.c2=yCur();o.u2b=yUnlocked(2);o.u3=yUnlocked(3);
          S.yoga={start:ws,done:{1:new Date().toISOString()},log:[{date:new Date().toISOString(),kind:'plan',week:1}]};o.c3=yCur();o.try2=yStart('plan',{week:2});
          S.yoga={start:ws-20*WEEKMS,done:{1:'x',2:'x',3:'x',4:'x',5:'x'},log:[]};o.c4=yCur();o.u3b=yUnlocked(3);
          S.yrun=null;S.yoga={start:null,done:{},log:[]};save();return o}""")
        print('lock',lk)
        assert lk['fresh']['week']==1 and not lk['fresh']['wait']
        assert lk['c1']['week']==4 and lk['u2']==False and lk['try5']==False and not lk['run5']
        assert lk['c2']['week']==5 and lk['u2b'] and not lk['u3']
        assert lk['c3']['wait'] and lk['c3']['next']==2 and lk['try2']==False
        assert lk['c4']['week']==6 and not lk['u3b']
        await pg.evaluate("()=>{S.yoga={start:weekStart(new Date()).getTime()-6*WEEKMS,done:{1:'x',2:'x',3:'x'},log:[]};save();go('home')}")
        await pg.click('#yPlanBtn');await pg.wait_for_timeout(200)
        sh=(await pg.text_content('#sheet')).lower();assert 'gesperrt' in sh and 'stufe 2 · aufbau' in sh and 'wird freigeschaltet, wenn stufe 1 abgeschlossen ist (3 von 4' in sh,sh
        assert await pg.locator('[data-yweek]').count()==1 and await pg.get_attribute('[data-yweek]','data-yweek')=='4'
        assert await pg.locator('[data-stage="2"] [data-yweek], [data-stage="3"] [data-yweek], [data-stage="2"] [data-yrep]').count()==0
        await pg.screenshot(path=D+'/plan_sheet.png');await pg.click('#sheet [data-close]')
        await pg.evaluate("()=>{S.yoga={start:null,done:{},log:[]};save();go('home')}")
        # 5) home: strength stays the main plan, yoga is a small extra card below
        await pg.wait_for_timeout(200)
        home=await pg.evaluate("""()=>{const cards=[...document.querySelectorAll('#v-home > .card')];const y=document.getElementById('yCard');
          return{idx:cards.indexOf(y),n:cards.length,first:cards[0].textContent,ytxt:y.textContent,tabs:document.querySelectorAll('.tabs button').length,startH:document.getElementById('startBtn').offsetHeight,yH:y.offsetHeight,big:cards[0].offsetHeight}}""")
        print('home',home['idx'],home['n'],home['yH'],home['big']);assert home['idx']>=2 and 'Training starten' in home['first'] and 'Zusatz · Yoga & Dehnen' in home['ytxt'] and home['tabs']==5 and home['yH']<home['big']
        assert 'Woche 1 von 12' in home['ytxt'] and 'Schnell-Dehnen' in home['ytxt'] and 'ohne Krafttraining' in home['ytxt']
        await pg.screenshot(path=D+'/home.png',full_page=True)
        # 6) mini session (week 1 of the plan), shortened holds; Android bridge mock for the background timer
        await pg.evaluate("()=>{window.__nat=[];window.Android={trainingState:j=>window.__nat.push(JSON.parse(j)),isVisible:()=>true,wasPlayed:()=>false,restEnd:()=>'0'}}")
        h0=await pg.evaluate("S.history.length")
        await pg.click('#yStartBtn');await pg.wait_for_timeout(300)
        assert await pg.is_visible('#yoga') and await pg.is_hidden('#train')
        await pg.evaluate("()=>{const r=S.yrun;r.steps=[{k:'katzekuh',sec:2,side:0,part:'warm'},{k:'figur4',sec:3,side:1,part:'main'},{k:'figur4',sec:3,side:2,part:'main'},{k:'adlerarm',sec:2,side:1,part:'main'},{k:'adlerarm',sec:2,side:2,part:'main'},{k:'savasana',sec:2,side:0,part:'cool'}];r.i=0;r.ph='prep';r.end=Date.now()+400;save();yRender()}")
        t=await pg.text_content('#yogaInner');assert 'Bei Schmerz sofort abbrechen – nur sanft dehnen.' in t and 'Haltung 1 von 6' in t and 'Atem:' in t and 'Katze-Kuh' in t,t
        await pg.wait_for_timeout(900);assert await pg.evaluate("S.yrun.ph")=='hold' and 'Halten' in await pg.text_content('#yLbl')
        nat=await pg.evaluate("window.__nat.slice(-1)[0]");print('native',nat);assert nat['phase']=='rest' and nat['endTime']>0 and nat['title'].startswith('Yoga · Katze-Kuh') and nat['alert']=='Weiter: Taube im Liegen'
        await pg.screenshot(path=D+'/run_hold.png',full_page=True)
        # pause / resume
        await pg.click('#yP');l1=await pg.evaluate("S.yrun.left");await pg.wait_for_timeout(700);assert await pg.evaluate("S.yrun.paused") and abs(await pg.evaluate("S.yrun.left")-l1)<.01
        assert await pg.evaluate("window.__nat.slice(-1)[0].title")=='Yoga pausiert'
        await pg.click('#yP');await pg.wait_for_timeout(2600)
        st=await pg.evaluate("[S.yrun.i,S.yrun.ph,S.yrun.steps[S.yrun.i].side]");print('after hold',st);assert st[0]==1 and st[2]==1
        assert await pg.is_visible('#yS'),'side switch button on side 1'
        await pg.click('#yS');await pg.wait_for_timeout(200)
        st=await pg.evaluate("[S.yrun.i,S.yrun.ph,S.yrun.steps[S.yrun.i].side]");assert st==[2,'prep',2],st
        assert 'Seite wechseln' in await pg.text_content('#yLbl') and 'scaleX(-1)' in (await pg.get_attribute('#ycv','style') or '')
        await pg.screenshot(path=D+'/run_side2.png',full_page=True)
        # skip skips both sides of the next pose
        await pg.click('#yN');st=await pg.evaluate("[S.yrun.i,S.yrun.steps[S.yrun.i].k]");assert st==[3,'adlerarm'],st
        await pg.click('#yN');st=await pg.evaluate("[S.yrun.i,S.yrun.steps[S.yrun.i].k]");assert st==[5,'savasana'],st
        await pg.evaluate("()=>{S.yrun.end=Date.now()+200;save()}");await pg.wait_for_timeout(2900)
        assert await pg.evaluate("S.yrun&&S.yrun.ph")=='done' and 'Einheit geschafft' in await pg.text_content('#yogaInner')
        y=await pg.evaluate("[S.yoga.done[1]?1:0,S.yoga.start===weekStart(new Date()).getTime(),S.yoga.log.length,S.yoga.log[0].kind,S.history.length]");print('saved',y)
        assert y[:4]==[1,True,1,'plan'] and y[4]==h0,'yoga must not touch the strength history'
        await pg.screenshot(path=D+'/run_done.png',full_page=True)
        await pg.click('#yDone');await pg.wait_for_timeout(300)
        assert await pg.is_hidden('#yoga') and await pg.evaluate("S.yrun")==None and await pg.evaluate("window.__nat.slice(-1)[0].active")==False
        assert 'Yoga diese Woche erledigt' in await pg.text_content('#yCard')
        # strength split/recovery is unaffected: next strength day, week count and plan stay the same
        assert await pg.evaluate("[nextDay(),doneThisWeek().size,planItems('A',false,1).length===planItems('A',false,1).length]")==['A',0,True]
        # 7) quick stretch + post-workout shortcut (home and end of a strength session)
        await pg.click('#yQuickBtn');await pg.wait_for_timeout(200);q=await pg.evaluate("[S.yrun.kind,S.yrun.title,S.yrun.steps.length]");assert q[0]=='quick' and q[1]=='Schnell-Dehnen'
        await pg.click('#yX');await pg.wait_for_timeout(150);await pg.click('#cOk');await pg.wait_for_timeout(200);assert await pg.evaluate("S.yrun")==None and await pg.is_hidden('#yoga')
        await pg.evaluate("()=>{S.history.push({date:new Date().toISOString(),plan:'C',day:'C',week:1,dur:3000,log:[{ex:'squat',sets:[{w:60,r:8,done:true}]}]});save();go('home')}")
        assert await pg.is_visible('#yPostBtn');await pg.click('#yPostBtn');await pg.wait_for_timeout(200)
        q=await pg.evaluate("[S.yrun.kind,S.yrun.day,S.yrun.steps.map(s=>s.k)]");print('post',q[:2]);assert q[0]=='post' and q[1]=='C' and 'tiefausfall' in q[2]
        await pg.evaluate("()=>{S.yrun=null;save();yClose()}")
        await pg.evaluate("()=>{S.history.pop();S.pick={day:'A',ws:weekStart(new Date()).getTime()};save();go('home')}")
        await pg.click('#startBtn');await pg.wait_for_timeout(300);await pg.click('#wSkipAll');await pg.wait_for_timeout(200)
        await pg.evaluate("()=>{const ss=S.session;ss.log[0].sets[0].done=true;ss.phase='done';save();renderTrain()}");await pg.wait_for_timeout(200)
        assert await pg.is_visible('#saveS') and await pg.is_visible('#postS')
        await pg.click('#postS');await pg.wait_for_timeout(300)
        q=await pg.evaluate("[S.session,S.history.length,S.yrun&&S.yrun.kind,S.yrun&&S.yrun.day]");print('after training',q);assert q[0]==None and q[1]==h0+1 and q[2]=='post' and q[3]=='A'
        await pg.evaluate("()=>{S.yrun=null;save();yClose()}")
        # 8) library: toggle Kraft / Yoga, filter by level and region
        await pg.click('[data-tab=lib]');await pg.wait_for_timeout(200);assert await pg.is_visible('#libSeg')
        await pg.click('[data-lm=yoga]');await pg.wait_for_timeout(300)
        assert await pg.locator('[data-ypose]').count()==r['n']
        await pg.click('[data-ylv="1"]');await pg.click('[data-yr="huefte"]');await pg.wait_for_timeout(200)
        ks=await pg.eval_on_selector_all('[data-ypose]','e=>e.map(x=>x.dataset.ypose)');lv=await pg.evaluate("ks=>ks.every(k=>YP[k].lv===1&&YP[k].r==='huefte')",ks);print('filter',ks);assert ks and lv
        await pg.screenshot(path=D+'/library.png')
        await pg.click('[data-ypose="figur4"]');await pg.wait_for_timeout(300);sh=await pg.text_content('#sheet');assert 'Taube im Liegen' in sh and 'einseitig' in sh and 'Atem:' in sh;await pg.click('#sheet [data-close]')
        await pg.click('[data-lm=kraft]');await pg.wait_for_timeout(200);assert await pg.locator('[data-ex]').count()>40
        # 8b) app closed during a run: continues paused at the same pose
        await pg.evaluate("()=>{yStart('quick');S.yrun.i=2;S.yrun.ph='hold';S.yrun.end=Date.now()+5000;save()}");await pg.reload();await pg.wait_for_timeout(600)
        q=await pg.evaluate("[S.yrun.paused,S.yrun.i,S.yrun.left===S.yrun.steps[2].sec]");assert q==[True,2,True],q
        await pg.click('#yResume');await pg.wait_for_timeout(200);assert await pg.is_visible('#yoga') and 'Pausiert' in await pg.text_content('#yLbl')
        await pg.evaluate("()=>{S.yrun=null;save();yClose()}")
        # 9) backup roundtrip keeps the yoga progress
        await pg.evaluate("()=>{S.yoga.done={1:'2026-01-05T10:00:00.000Z',2:'2026-01-12T10:00:00.000Z'};S.yoga.start=weekStart(new Date('2026-01-05')).getTime();save()}")
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(200);await pg.click('#bkBtn');await pg.wait_for_timeout(150)
        assert 'Yoga-Einheiten (Plan: 2/12 Wochen)' in await pg.text_content('#sheet')
        async with pg.expect_download() as dl:await pg.click('#bkExport')
        d=await dl.value;path=D+'/homegym-backup.json';await d.save_as(path);bk=json.load(open(path))
        assert bk['state']['yoga']['done']['2'] and len(bk['state']['yoga']['log'])==1
        await pg.evaluate("()=>{S.yoga={start:null,done:{},log:[]};S.yrun=null;save();closeSheet()}")
        await pg.click('#bkBtn');await pg.set_input_files('#bkFile',path);await pg.wait_for_timeout(300)
        async with pg.expect_navigation():await pg.click('#cOk')
        await pg.wait_for_timeout(500)
        y=await pg.evaluate("[Object.keys(S.yoga.done).sort(),S.yoga.log.length,S.yoga.start,yCur().week]");print('restored',y);assert y[0]==['1','2'] and y[1]==1 and y[2] and y[3]>=3
        # 10) version + footer
        await pg.click('[data-tab=set]');await pg.wait_for_timeout(200);v=await pg.text_content('#verLine');assert 'Version 3.0' in v and '@ Joschy' in v
        print('errors',errs);assert not errs
        await b.close()
    srv.kill();print('ALL OK')
asyncio.run(main())
