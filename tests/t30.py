# Homegym 3.2-3.4 @ Joschy – Yoga in 3 Stufen (96 Haltungen), 24-Wochen-Plan, Startstufe, Migration, Profi-Sicherheit; 41 neue Übungen ohne Geräte
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
_V31=_os.environ.get('HOMEGYM_V31',_os.path.join(_REPO,'tests','fixtures','v31'))
if not _os.path.isfile(_os.path.join(_V31,'index.html')):raise SystemExit('FEHLT: 3.1-Vergleichsstand '+_V31+'/index.html (siehe tests/fixtures/README.txt)')
_V33=_os.environ.get('HOMEGYM_V33',_os.path.join(_REPO,'tests','fixtures','v33'))
if not _os.path.isfile(_os.path.join(_V33,'index.html')):raise SystemExit('FEHLT: 3.3-Vergleichsstand '+_V33+'/index.html (siehe tests/fixtures/README.txt)')
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright
D=_SHOTS.rstrip('/');_os.makedirs(D+'/shots',exist_ok=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','8797','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
o33=subprocess.Popen([sys.executable,'-m','http.server','8799','-d',_V33],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
old=subprocess.Popen([sys.executable,'-m','http.server','8798','-d',_V31],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8797/index.html?nosplash=1';UO='http://127.0.0.1:8798/index.html?nosplash=1';U33='http://127.0.0.1:8799/index.html?nosplash=1'
CHECK=open(_os.path.join(_REPO,'tests','t30_yck.js'),encoding='utf-8').read()
fails=[]
def chk(c,msg):
    print(('ok   ' if c else 'FAIL ')+msg);(None if c else fails.append(msg))
PROFILE="()=>{S.profile={name:'Joschy',gear:[...JOSCHYGEAR],preset:'joschy'};S.settings.voiceMode='off';save();location.reload()}"
async def setup(pg,url):
    await pg.goto(url);await pg.wait_for_timeout(400);await pg.evaluate(PROFILE);await pg.wait_for_timeout(600)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},accept_downloads=True);pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await setup(pg,U)
        v=await pg.evaluate("[APP_VER,BK_VER]");chk(v==['3.13',5],'version 3.13, backup format 5 '+str(v))
        await pg.evaluate("go('set')");vl=await pg.text_content('#verLine');chk('Version 3.13 · @ Joschy' in vl,vl)
        bv=await pg.evaluate("()=>{const d=JSON.parse(backupText());return[d.appVer,typeof d.appVer,parseBackup(backupText()).st?1:0]}")
        chk(bv==['3.13','string',1],f'3.13 bleibt im Backup ein Text und ist lesbar {bv}')
        # 1) catalogue
        r=await pg.evaluate("""()=>{const lv=[1,2,3].map(l=>YKEYS.filter(k=>YP[k].lv===l).length);const bad=YKEYS.filter(k=>{const p=YP[k];return!p.n||!p.sa&&p.lv>1&&false||!(p.c.length>=2&&p.c.length<=3)||!p.a||!YREG.some(x=>x[0]===p.r)||!(p.sec>0)||!AN['y_'+k]});
          const prof=YKEYS.filter(k=>YP[k].lv===3);const noAlt=prof.filter(k=>!YP[k].alt||!YP[YP[k].alt]||YP[YP[k].alt].lv>=3);
          const bw=Object.keys(EX).filter(k=>EX[k].bwx);const bwBad=bw.filter(k=>!CAT[k]||!SUB[k]||!AN[animOf(k)]||(NEEDS[k]&&NEEDS[k].length)||!canDo(k)||mgOf(k)==null||![1,2,3].includes(EX[k].lvl)||!(EX[k].rr||EX[k].hr)||!['A','B','C'].some(d=>DAYEX[d].includes(k))||(EX[k].harder&&!EX[EX[k].harder]));
          const names=Object.keys(EX).map(k=>EX[k].n.toLowerCase());const dup=names.filter((n,i)=>names.indexOf(n)!==i);
          return{n:YKEYS.length,lv,bad,noAlt,bw:bw.length,bwBad,dup,ex:Object.keys(EX).length,days:['A','B','C'].map(d=>bw.filter(k=>DAYEX[d].includes(k)).length)}}""")
        print('catalogue',r)
        chk(150<=r['n']<=160 and r['lv'][2]>=36 and r['lv'][2]<=44 and not r['bad'],f"{r['n']} yoga poses, levels {r['lv']}, all complete")
        chk(not r['noAlt'],'every Profi pose has an easier (non-Profi) variant')
        chk(r['bw']>=30 and not r['bwBad'] and not r['dup'] and min(r['days'])>=8,f"{r['bw']} new bodyweight exercises (A/B/C {r['days']}), complete, no duplicates")
        # 2) everything renders for both figures (big + library preview)
        dr=await pg.evaluate("""()=>{const c=document.createElement('canvas');c.style.cssText='position:fixed;left:0;top:0;width:180px;height:180px';document.body.appendChild(c);const m=document.createElement('canvas');m.style.cssText='position:fixed;left:0;top:200px;width:72px;height:72px';document.body.appendChild(m);
          const bad=[];let n=0;const keys=[...Object.keys(EX).filter(k=>EX[k].bwx).map(animOf),...YKEYS.map(k=>'y_'+k)];
          const px=cv=>{const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;let a=0;for(let i=3;i<d.length;i+=8)if(d[i]>40)a++;return a};
          for(const k of keys)for(const g of['m','f']){attachAnim(c,k,{g});RUN.delete(c);c._t0=0;for(const t of[0,1.7,5.2]){renderCanvas(c,t*1000);n++;if(px(c)<300)bad.push([k,g,t])}
            attachAnim(m,k,{g,still:1});RUN.delete(m);renderCanvas(m,0);n++;if(px(m)<40)bad.push([k,g,'mini'])}
          c.remove();m.remove();return{n,bad}}""")
        chk(not dr['bad'],f"all new poses/exercises render for man and woman ({dr['n']} renders) {dr['bad'][:4]}")
        # 3) yoga loops: stand -> pose -> stand, speed <= 5 units/frame, floor, stages
        lp=await pg.evaluate(CHECK,None)
        bad=[x for x in lp if x['bad']];chk(len(lp)==2*r['n'] and not bad,f"yoga loops ({len(lp)}): start/end = stand, max step {max(x['step'] for x in lp)} <= 5, no floor/float issues {bad[:3]}")
        # 4) plan: 24 weeks, 3 stages, ~15 -> ~30 min, levels
        pl=await pg.evaluate("""()=>{const o=[];for(let w=1;w<=24;w++){const P=yPlan(w);o.push({w,st:P.stage,min:P.secs/60,max:Math.max(...P.items.map(x=>YP[x.k].lv)),first:P.items[0].part,last:P.items[P.items.length-1].k,regs:[...new Set(P.items.filter(x=>x.part==='main').map(x=>YP[x.k].r))]})}return o}""")
        st_ok=all(x['st']==(x['w']-1)//8+1 and x['max']<=x['st'] and x['first']=='warm' and x['last']=='savasana' and 'schulter' in x['regs'] and 'huefte' in x['regs'] for x in pl)
        dur={s:[round(x['min'],1) for x in pl if x['st']==s] for s in (1,2,3)}
        chk(st_ok and 14<=pl[0]['min']<=16.5 and 28<=pl[23]['min']<=31.5 and pl[8]['max']==2 and pl[16]['max']==3,f"plan 24 weeks / 3 stages, minutes per stage {dur}")
        chk(max(dur[1])<min(dur[3]) and sum(dur[1])/8<sum(dur[2])/8<sum(dur[3])/8,'plan gets longer from stage to stage')
        # 5) migration of 3.1 progress (stage 1, stage 2, complete) + idempotent + backup roundtrip
        ws=await pg.evaluate("weekStart(new Date()).getTime()")
        def oldstate(done,weeks_ago):
            return {'start':ws-weeks_ago*7*864e5,'done':{str(w):'2026-01-01T10:00:00.000Z' for w in done},'log':[{'date':'2026-01-01T10:00:00.000Z','kind':'plan','week':w,'dur':900,'n':12} for w in done]}
        for name,done,ago,exp in [('stage1',[1,2],5,{'week':3,'u2':False}),('stage2',[1,2,3,4,5,6],9,{'week':7,'u2':False}),('complete',list(range(1,13)),14,{'week':13,'u2':True})]:
            ys=oldstate(done,ago)
            await pg.evaluate("(y)=>{const st=JSON.parse(localStorage.getItem(KEY));st.yoga=y;delete st.yrun;localStorage.setItem(KEY,JSON.stringify(st));window.__hgLock=true;location.reload()}",ys);await pg.wait_for_timeout(600)
            a=await pg.evaluate("()=>({done:Object.keys(S.yoga.done).map(Number).sort((a,b)=>a-b),v:S.yoga.v,sl:S.yoga.startLv,log:S.yoga.log.length,c:yCur(),u2:yUnlocked(2),u3:yUnlocked(3),st:yStageCount(1)})")
            await pg.reload();await pg.wait_for_timeout(500)
            a2=await pg.evaluate("()=>({done:Object.keys(S.yoga.done).map(Number).sort((a,b)=>a-b),v:S.yoga.v})")
            chk(a['done']==done and a['v']==2 and a['sl']==1 and a['log']==len(done) and a['c']['week']==exp['week'] and a['u2']==exp['u2'] and not a['u3'] and a2==({'done':done,'v':2}),f"migration 3.1 {name}: done {len(done)} kept, week {a['c']['week']}, stage 2 unlocked {a['u2']}, idempotent")
        # backup roundtrip (current = complete) and import of a 3.1 backup
        bk=await pg.evaluate("backupText()");st=await pg.evaluate("(t)=>{const r=parseBackup(t);return{done:Object.keys(r.st.yoga.done).length,v:r.st.yoga.v}}",bk)
        old31=json.loads(bk);old31['appVer']='3.1';old31['state']['yoga']=oldstate([1,2,3,4,5],7)
        await pg.evaluate("(t)=>{const r=parseBackup(t);applyBackup(r.st)}",json.dumps(old31));await pg.wait_for_timeout(1200)
        im=await pg.evaluate("()=>({done:Object.keys(S.yoga.done).length,v:S.yoga.v,w:yCur().week})")
        chk(st=={'done':12,'v':2} and im=={'done':5,'v':2,'w':6},f"backup roundtrip {st} and 3.1 backup import migrated {im}")
        # 6) start stage: settings card, Profi only after the safety question
        await pg.evaluate("()=>{S.yoga={start:null,done:{},log:[]};save();go('set')}");await pg.wait_for_timeout(200)
        await pg.click('#yogaSetCard [data-ystart="2"]');await pg.wait_for_timeout(200)
        s2=await pg.evaluate("()=>({sl:S.yoga.startLv,c:yCur().week,u2:yUnlocked(2),u3:yUnlocked(3)})")
        await pg.click('#yogaSetCard [data-ystart="3"]');await pg.wait_for_timeout(250)
        sheet=await pg.text_content('#sheet');still=await pg.evaluate("S.yoga.startLv")
        await pg.click('#cOk');await pg.wait_for_timeout(250)
        s3=await pg.evaluate("()=>({sl:S.yoga.startLv,c:yCur().week,u3:yUnlocked(3)})")
        await pg.screenshot(path=D+'/shots/settings_yoga.png',full_page=True)
        chk(s2=={'sl':2,'c':9,'u2':True,'u3':False} and 'Umkehrhaltungen' in sheet and still==2 and s3=={'sl':3,'c':17,'u3':True},f"start stage: Anfänger default, Fortgeschritten {s2}, Profi after confirmation {s3}")
        await pg.evaluate("()=>{S.yoga.startLv=1;save();go('home')}");await pg.wait_for_timeout(200)
        await pg.click('#yPlanBtn');await pg.wait_for_timeout(300);ps=(await pg.text_content('#sheet')).lower()
        await pg.screenshot(path=D+'/shots/plan_sheet.png',full_page=True)
        chk('24-wochen-plan' in ps and 'stufe 3 · profi' in ps and 'startstufe' in ps and await pg.locator('[data-yweek]').count()==1,'plan sheet: 24 weeks, 3 stages, start stage picker')
        await pg.click('#sheet [data-close]')
        # 7) Profi safety: warning + "Leichtere Variante" swaps the pose for this run only
        res={}
        for k in ['kopfstand','schulterstand','pflug','rad','kraehe','unterarmvor']:
            await pg.evaluate("(k)=>{yStart('quick');const r=S.yrun;r.steps=[{k:'kind',sec:20,side:0,part:'main'},{k,sec:20,side:YP[k].uni?1:0,part:'main'},...(YP[k].uni?[{k,sec:20,side:2,part:'main'}]:[]),{k:'savasana',sec:20,side:0,part:'cool'}];r.i=1;r.ph='prep';r.end=Date.now()+5000;save();yRender()}",k);await pg.wait_for_timeout(150)
            t=await pg.text_content('#yogaInner');has=await pg.is_visible('#yAlt')
            if k=='kopfstand':await pg.screenshot(path=D+'/shots/run_kopfstand.png',full_page=True)
            await pg.click('#yAlt');await pg.wait_for_timeout(150)
            a=await pg.evaluate("(k)=>({cur:S.yrun.steps[S.yrun.i].k,alt:YP[k].alt,n:S.yrun.steps.length,has:S.yrun.steps.some(s=>s.k===k),done:S.yoga.done})",k)
            res[k]=('Achtung' in t and ('Umkehrhaltung' in t or 'Armbalance' in t or 'Rückbeuge' in t) and has and a['cur']==a['alt'] and not a['has'])
            await pg.evaluate("()=>{S.yrun=null;save();yClose()}")
        chk(all(res.values()),f'Profi inversions/arm balances: warning + easier variant swaps the pose {res}')
        # 8) library: filter by stage and region, previews still
        await pg.click('[data-tab=lib]');await pg.wait_for_timeout(200);await pg.click('[data-lm=yoga]');await pg.wait_for_timeout(300)
        t0=time.time();await pg.click('[data-ylv="3"]');await pg.wait_for_timeout(300)
        ks=await pg.eval_on_selector_all('[data-ypose]','e=>e.map(x=>x.dataset.ypose)');lv=await pg.evaluate("ks=>ks.every(k=>YP[k].lv===3)",ks)
        await pg.screenshot(path=D+'/shots/library_profi.png',full_page=True)
        await pg.click('[data-ylv="0"]');await pg.click('[data-yr="schulter"]');await pg.wait_for_timeout(200)
        ks2=await pg.eval_on_selector_all('[data-ypose]','e=>e.map(x=>x.dataset.ypose)')
        chk(len(ks)==r['lv'][2] and lv and ks2 and await pg.evaluate("ks=>ks.every(k=>YP[k].r==='schulter')",ks2),f'library filter Profi ({len(ks)}) and region')
        await pg.click('[data-yr=""]');await pg.wait_for_timeout(200)
        perf=await pg.evaluate("""async()=>{const t=performance.now();RENDER.lib();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));const m=[...document.querySelectorAll('[data-ymini]')];return{ms:Math.round(performance.now()-t),n:m.length,still:m.every(c=>c._still&&!c._loop)}}""")
        chk(perf['n']==r['n'] and perf['still'] and perf['ms']<1500,f"yoga library with {perf['n']} previews built in {perf['ms']} ms, previews are still images")
        # 9) preset "Ohne Geräte": 12 valid sessions
        nd=await pg.evaluate("""()=>{S.profile.gear=[];const req={A:['brust','schulter','trizeps'],B:['ruecken','bizeps'],C:['vorn','hinten','waden','rumpf']};const o=[];const cnt={};let badRep=[],badPool=[],badCov=[],badGear=[],hard=[],noEasy=[];
          for(let w=1;w<=4;w++)for(const d of DAYS){const it=planItems(d,false,w);const m=estMinFull(d,false,w);const main=it.filter(x=>!x.fin);
            for(const x of it){if(!canDo(x.ex))badGear.push(w+d+':'+x.ex);if(!x.fin&&!DAYEX[d].includes(x.ex))badPool.push(w+d+':'+x.ex);
              const e=EX[x.ex];const cap=e.type==='time'?60:(e.rr?e.rr[1]:20);if(x.hi>cap||x.lo>x.hi)badRep.push(w+d+':'+x.ex+' '+x.lo+'-'+x.hi)}
            for(const x of main){cnt[x.ex]=(cnt[x.ex]||0)+1;const lv=k=>EX[k].lvl||2;if(lv(x.ex)>=3)hard.push(w+d+':'+x.ex);S.session={plan:d,items:it};const pool=swapPool(x,d).slice(1);S.session=null;if(!pool.some(k=>lv(k)<=lv(x.ex)))noEasy.push(w+d+':'+x.ex+' '+pool.join(','))}const mg=new Set(main.map(x=>mgOf(x.ex)));for(const g of req[d])if(!mg.has(g))badCov.push(w+d+':'+g);o.push([w+d,+m.toFixed(1)])}
          S.profile.gear=[...JOSCHYGEAR];return{o,over:Object.entries(cnt).filter(([k,v])=>v>2),distinct:Object.keys(cnt).length,badRep,badPool,badCov,badGear,hard,noEasy}}""")
        print('ohne Geräte',nd['o'])
        chk(len(nd['o'])==12 and max(x[1] for x in nd['o'])<=60 and not nd['badGear'] and not nd['badPool'],'"Ohne Geräte": 12 sessions, all without gear, push/pull/legs pools kept, <= 60 min')
        chk(not nd['badCov'],f"'Ohne Geräte': every session covers its muscle groups {nd['badCov'][:4]}")
        chk(not nd['badRep'],f"'Ohne Geräte': rep/time targets within each exercise's limit {nd['badRep'][:4]}")
        chk(not nd['hard'],f"'Ohne Geräte': no hard (Stufe 3) exercise planned by default {nd['hard']}")
        chk(not nd['noEasy'],f"'Ohne Geräte': every slot offers an equally easy or easier alternative in the swap dialog {nd['noEasy'][:4]}")
        chk(not nd['over'] and nd['distinct']>=40,f"'Ohne Geräte': no exercise more than 2x per 4-week cycle ({nd['distinct']} different exercises) {nd['over']}")
        # 10) Joschys Homegym (and the other presets): plan identical to 3.1
        po=await ctx.new_page();await setup(po,UO)
        # 3.3 Griffkraft & Hängen (@ Joschy): the new block (blk items) is an intended addition; for the hour limit only assistance
        # and bonus sets may be shortened. Exercises, order and rep targets stay identical to 3.1 everywhere, and the main lifts
        # (Kniebeuge, Bankdrücken, Kreuzheben, Schulterdrücken, Rudern, Klimmzug incl. Negativ-Klimmzüge) keep their sets at EVERY
        # position (not only slot 0) – strict check of exercise, sets, reps and order.
        MAINRE=r"/Kniebeuge|Bankdrück|Kreuzheb|Schulterdrück|Rudern|Klimmz|Chin-up/i"
        PLAN="(g)=>{const M="+MAINRE+";S.profile.gear=eval(g);const o={};for(let w=1;w<=4;w++)for(const d of DAYS)o[w+d]=planItems(d,false,w).filter(x=>!x.blk).map(x=>[x.ex,x.sets,x.lo,x.hi,x.slot===0||M.test(EX[x.ex].n),!!x.fin]);S.profile.gear=[...JOSCHYGEAR];return o}"
        # 3.13: für das 10-min-Aufwärmen darf ein Bonus (fin) ganz wegfallen; alle anderen Übungen bleiben streng wie in 3.1
        def dropfin(a,b2):
            return {k:[y for y in b2[k] if not (y[5] and y[0] not in [x[0] for x in a[k]])] for k in b2}
        def same31(a,b2):
            b2=dropfin(a,b2)
            return a.keys()==b2.keys() and all(len(a[k])==len(b2[k]) and all(x[0]==y[0] and x[2:4]==y[2:4] and x[4]==y[4] and (x[1]==y[1] if y[4] else 1<=x[1]<=y[1]) for x,y in zip(a[k],b2[k])) for k in a)
        def mains(a):return sum(1 for k in a for x in a[k] if x[4])
        for g,name in [('[...JOSCHYGEAR]','Joschys Homegym'),('ALLGEAR','Alles')]:
            a=await pg.evaluate(PLAN,g);b2=await po.evaluate(PLAN,g)
            if not same31(a,b2):print('DIFF',[(k,x,y) for k in a for x,y in zip(a[k],b2[k]) if x!=y][:8])
            chk(same31(a,b2) and mains(b2)>=12,f'preset {name}: all 12 sessions as in 3.1, main lifts strict at every position ({mains(b2)} main-lift slots); plus grip block, only assistance/bonus sets may be shortened for the hour')
        a=await pg.evaluate(PLAN,'["db","bench","band"]');b2=await po.evaluate(PLAN,'["db","bench","band"]')
        # 3.4: Band-am-Rack-Übungen (Face Pulls, Trizepsdrücken am Band) brauchen Band + Rack -> bei "Nur Kurzhanteln" ersetzt durch eine Nebenübung (gleiche Sätze), sonst wie 3.1
        RB=('facepull','pushdown')
        fp=[(k,x[0]) for k in b2 for x,y in zip(a[k],b2[k]) if y[0] in RB]
        a2={k:[(list(y[:1])+list(x[1:4])+[y[4]] if y[0] in RB and not x[4] and x[1]==y[1] and x[0] not in RB else x) for x,y in zip(a[k],b2[k])]+a[k][len(b2[k]):] for k in a}
        def same31fp(a,b2):
            b2=dropfin(a,b2)
            return a.keys()==b2.keys() and all(len(a[k])==len(b2[k]) and all(x[0]==y[0] and (x[2:4]==y[2:4] or y[0] in RB) and x[4]==y[4] and (x[1]==y[1] if y[4] else 1<=x[1]<=y[1]) for x,y in zip(a[k],b2[k])) for k in a)
        chk(same31fp(a2,b2) and mains(b2)>=12 and fp and all(e not in RB for _,e in fp),f'preset Nur Kurzhanteln: all 12 sessions as in 3.1 except band+rack exercises -> {sorted(set(e for _,e in fp))}, main lifts strict at every position ({mains(b2)} slots); plus grip block')
        await po.close()
        sw=await pg.evaluate("()=>{const it=planItems('A',false,1)[0];const p=swapPool(it,'A');return{p,gear:p.filter(k=>TRANK[EX[k].type]<3).length,bw:p.filter(k=>EX[k].bwx).length}}")
        chk(sw['p'][0]=='bench' and sw['gear']>=2 and sw['bw']>=1,f"swap dialog (Joschy, bench): equipment first, bodyweight options added {sw['p']}")
        # 11) bodyweight progression: upper target reached -> next harder variant
        adv=await pg.evaluate("""()=>{S.profile.gear=[];const it={ex:'pushknee',sets:3,lo:8,hi:15};S.history=[{date:new Date(Date.now()-2*864e5).toISOString(),plan:'A',week:1,dur:3000,log:[{ex:'pushknee',sets:[{w:0,r:15,done:true},{w:0,r:15,done:true},{w:0,r:15,done:true}],eff:'ok'}]}];const t=suggest(it).why.replace(/<[^>]+>/g,'');S.history=[];S.profile.gear=[...JOSCHYGEAR];return t}""")
        chk('schwerere Variante: Liegestütze' in adv,'progression: Knie-Liegestütze at the top of the range -> suggests Liegestütze: '+adv[:90])
        ch=await pg.evaluate("()=>Object.keys(EX).filter(k=>EX[k].bwx&&EX[k].harder).map(k=>[k,EX[k].harder,SUB[k]===SUB[EX[k].harder]||CAT[k]===CAT[EX[k].harder],(EX[EX[k].harder].lvl||2)>(EX[k].lvl||2)]).filter(x=>!x[2]||!x[3])")
        chk(not ch,f'harder-variant chains stay in the same movement family and really get harder {ch}')
        ub=await pg.evaluate("()=>[YP.umgbrett.risk,YRISK[YP.umgbrett.risk]||'',YP.halbspagat.c[0]]")
        chk(ub[0]=='wrist' and 'Handgelenke' in ub[1] and 'knienden' in ub[2],'Umgekehrtes Brett has a shoulder/wrist note, text typo fixed')
        geo=await pg.evaluate("""()=>{const r={};const T=k=>cycT(AN[k]);const pts=o=>Object.entries(o).filter(([q,v])=>Array.isArray(v)&&v.length===2&&typeof v[0]==='number');
          let hd=1e9;for(let t=0;t<T('kneepike')*2;t+=1/30){const{o}=animPose(AN.kneepike,t,'m');hd=Math.min(hd,o.head[1])}r.kneepikeHead=+hd.toFixed(1);
          const back=k=>{const e=AN[k].eq.find(e=>e.t==='chairback');let pen=0;for(let t=0;t<T(k)*2;t+=1/30){const{o}=animPose(AN[k],t,'m');for(const[q,v]of pts(o)){if(q.startsWith('ankle')||q.startsWith('toe')||q.startsWith('hand'))continue;const top=e.y+(e.h||42);if(v[1]>e.y+2&&v[1]<top&&Math.abs(v[0]-e.x)<4)pen++}}return pen};
          r.pushincl=back('pushincl');r.chairstep=back('chairstep');return r}""")
        chk(geo['kneepikeHead']>=10 and geo['pushincl']==0 and geo['chairstep']==0,f'kneepike head stays above the floor, no body point inside the chair backrest {geo}')
        # 12) screenshots: no-gear exercise sheet
        await pg.click('[data-lm=kraft]');await pg.wait_for_timeout(200);await pg.evaluate("openExSheet('bsschair')");await pg.wait_for_timeout(500)
        sh=await pg.text_content('#sheet');await pg.screenshot(path=D+'/shots/ex_bsschair.png',full_page=True)
        chk('Alltagsgegenstand: Stuhl' in sh and 'Stufe: mittel' in sh and 'Schwerer: Pistol-Vorstufe zum Stuhl' in sh,'exercise sheet shows everyday item, level and next harder variant')
        # 13) 3.4: Zyklen 1-8 (gewohnter Plan + Runden mit neuen Übungen), alle Wochen/Tage, voll und kurz, alle Geräte-Einstellungen
        #     (4 Presets x Kettlebells ein/aus x Pausen kürzer/normal/länger): Hauptübungen nie weniger Sätze/Wdh. als 3.3, keine Einheit > 59 min
        DUMP=r"""(rfs)=>{const M=/Kniebeuge|Bankdrück|Kreuzheb|Schulterdrück|Rudern|Klimmz|Chin-up/i;const keep=JSON.stringify(S);const o={};
          const G={joschy:[...JOSCHYGEAR],all:ALLGEAR,dbonly:["db","bench","band"],none:[]};
          for(const [gn,g] of Object.entries(G))for(const km of [true,false])for(const rf of rfs)for(let c=1;c<=8;c++)for(let w=1;w<=4;w++)for(const d of DAYS)for(const q of [false,true]){
            S.profile={name:'J',gear:[...g],preset:'x',kbMix:km};S.settings.restF=rf;S.prog={v:1,block:w,done:[],cycle:c,units:0,dlLeft:0,dlAt:4};S.history=[];if(S.hang)S.hang.base=null;
            const it=planItems(d,q,w);o[[gn,km,rf,c,w,d,q].join('|')]=[estSecs(it,q),it.filter(x=>!x.fin&&(x.slot===0||M.test(EX[x.ex].n))).map(x=>[x.ex,x.sets,x.lo,x.hi])]}
          S=JSON.parse(keep);save();return o}"""
        p33=await ctx.new_page();await p33.goto(U33);await p33.wait_for_timeout(300)
        await p33.evaluate("()=>{S.profile={name:'J',gear:[...JOSCHYGEAR],preset:'x'};S.settings.voiceMode='off';save();location.reload()}");await p33.wait_for_timeout(600)
        RF=[.8,1,1.2];cur=await pg.evaluate(DUMP,RF);ref=await p33.evaluate(DUMP,RF);await p33.close()
        long=[(k,round(v[0]/60,1)) for k,v in cur.items() if v[0]>3540];less=[]
        for k,(sec,mm) in cur.items():
            g,km,rf,c,w,d,q=k.split('|');r=ref['|'.join([g,km,rf,'1',w,d,q])][1];rd={x[0]:x for x in r}
            for y in r:
                x=next((x for x in mm if x[0]==y[0]),None)
                if x is None or x[1]<y[1] or x[2]<y[2] or x[3]<y[3]:less.append((k,x,y))
        chk(not long and not less and len(cur)==4608,f'cycles 1-8 x 4 weeks x 3 days x full/quick x 24 gear settings ({len(cur)} units): main lifts never fewer sets/reps than 3.3 {less[:3]}, none over 59 min {long[:3]}')
        chk(not errs,'no JS errors '+str(errs[:3]))
        await b.close()
    print('RESULT',('ALL OK' if not fails else f'{len(fails)} FAILED'))
try: asyncio.run(main())
finally: srv.kill();old.kill();o33.kill()
sys.exit(1 if fails else 0)  # 3.8: Exit-Code ungleich 0 bei FAIL
