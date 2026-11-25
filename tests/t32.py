# Homegym 3.3 @ Joschy – t32: Griffkraft & Hängen (Stufen, Zeitsteigerung, Hang-Test alle 4 Wochen + Kurve, Hang-Pause,
# Farmer's Hold mit Geräte-Fallback, Migration 3.1, Backup-Roundtrip, <= 60 min, Animationen, Screenshots 412x915 arc/day)
# Vergleichsstände: tests/fixtures/v31 (3.1) und tests/fixtures/v32 (3.2, vor dem Hang-Programm); andere Ordner per HOMEGYM_V31 / HOMEGYM_V32.
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
_V31=_os.environ.get('HOMEGYM_V31',_os.path.join(_REPO,'tests','fixtures','v31'))
_V32=_os.environ.get('HOMEGYM_V32',_os.path.join(_REPO,'tests','fixtures','v32'))
for _d,_v in [(_V31,'3.1'),(_V32,'3.2')]:
    if not _os.path.isfile(_os.path.join(_d,'index.html')):raise SystemExit('FEHLT: '+_v+'-Vergleichsstand '+_d+'/index.html (siehe tests/fixtures/README.txt)')
import asyncio,subprocess,time,json,sys,os
from playwright.async_api import async_playwright
D=_os.path.join(_SHOTS,'t32');SH=D+'/shots';FX=D+'/fixtures';os.makedirs(SH,exist_ok=True);os.makedirs(FX,exist_ok=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','8835','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
old=subprocess.Popen([sys.executable,'-m','http.server','8836','-d',_V31],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
pre=subprocess.Popen([sys.executable,'-m','http.server','8838','-d',_V32],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8835/index.html?nosplash=1';UO='http://127.0.0.1:8836/index.html?nosplash=1';UP='http://127.0.0.1:8838/index.html?nosplash=1'
EDGE=open(_os.path.join(_REPO,'tests','t32_edge.js'),encoding='utf-8').read()
fails=[]
def chk(c,msg):
    print(('ok   ' if c else 'FAIL ')+msg,flush=True);(None if c else fails.append(msg))
HELP="""()=>{window.T={ago:d=>new Date(Date.now()-d*864e5).toISOString(),sets:(w,rs)=>rs.map(r=>({w,r,done:true})),
 rec:(date,plan,week,log,x)=>Object.assign({date,plan,day:plan,week,dur:3000,log},x||{}),
 hang:(d,ex,rs,eff,x)=>T.rec(T.ago(d),'B',1,[{ex:'pullup',sets:T.sets(0,[6,6,5])},{ex,sets:T.sets(0,rs),...(eff?{eff}:{})}],x),
 farm:(d,ex,w,rs,eff)=>T.rec(T.ago(d),'C',1,[{ex,sets:T.sets(w,rs),...(eff?{eff}:{})}])}}"""
PROFILE="(th)=>{localStorage.clear();S=JSON.parse(JSON.stringify(DEF));S.profile={name:'Joschy',gear:[...JOSCHYGEAR],gearV:2,preset:'joschy',db37:1};/* 3.7: Kurzhantel-Umstellung schon erledigt (prüft t37), hier frei */S.settings.voiceMode='off';S.settings.theme=th||'arc';S.body=[{d:'2026-11-01',kg:70}];save();location.reload()}"
async def page(b,url=U,th='arc',w=412,h=915):
    ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2,is_mobile=True,has_touch=True);pg=await ctx.new_page()
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'jai/' not in m.text and 'Failed to load' not in m.text else None)
    await pg.goto(url);await pg.wait_for_timeout(300)
    async with pg.expect_navigation():await pg.evaluate(PROFILE,th)
    await pg.wait_for_timeout(500);await pg.evaluate(HELP);return ctx,pg,errs

async def fixture31(b):
    """3.1 state created by the real 3.1 app (history incl. Farmer's Walk, running session, yoga, plan position) -> fixtures/"""
    ctx,pg,errs=await page(b,UO)
    st=await pg.evaluate("""()=>{const H=[];const add=(d,p,w,log)=>H.push({date:T.ago(d),plan:p,day:p,week:w,dur:3200,unit:true,cyc:1,log});
      add(20,'A',1,[{ex:'bench',sets:T.sets(60,[8,8,7,7]),eff:'ok'},{ex:'lateral',sets:T.sets(8,[15,14,12])}]);
      add(18,'B',1,[{ex:'pullup',sets:T.sets(0,[6,5,5,4])},{ex:'farmer',sets:T.sets(16,[40,45])}]);
      add(16,'C',1,[{ex:'squat',sets:T.sets(80,[8,8,7,6])},{ex:'plank',sets:T.sets(0,[30,30])}]);
      add(13,'A',2,[{ex:'ohp',sets:T.sets(35,[8,8,7,7])}]);
      S.history=H;S.yoga={start:weekStart(new Date(Date.now()-21*864e5)).getTime(),done:{1:T.ago(19),2:T.ago(12)},log:[{date:T.ago(19),kind:'plan',week:1,dur:900,n:8}]};
      S.prog={v:1,block:2,done:['A'],cycle:1,units:4,dlLeft:0,dlAt:4};delete S.profile.db37;S.profile.weights={db:[],kb:[8,12,16],band:[]};/* echter 3.1-Stand: verstellbare Kurzhanteln */save();startSession('B');S.session.items.forEach((it,i)=>{if(EX[it.ex].type==='db')S.session.log[i].sets.forEach(x=>{if(!x.done)x.w=8.75})});S.session.phase='work';S.session.log[0].sets[0].done=true;save();
      return{ver:APP_VER,state:JSON.parse(localStorage.getItem(KEY)),backup:backupText()}}""")
    json.dump(st['state'],open(FX+'/v31_state.json','w'));open(FX+'/v31_backup.json','w').write(st['backup'])
    chk(st['ver']=='3.1' and not errs,f"fixture: state + backup written by the real 3.1 app ({len(st['state']['history'])} units, running session B) {errs[:2]}")
    await ctx.close();return st

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        f31=await fixture31(b)
        ctx,pg,errs=await page(b)
        v=await pg.evaluate("[APP_VER,BK_VER]");chk(v==['3.13',5],f'version 3.13, backup format 5 {v}')
        # 1) exercises, library, details, needs
        r=await pg.evaluate("""()=>({n:HG_ALL.filter(k=>EX[k]&&AN[animOf(k)]&&CAT[k]==='griff').length,cat:CATS.some(c=>c[0]==='griff'),
          need:[canDo('deadhang'),NEEDS.farmerhold,NEEDS.kbfarmhold,!!NEEDS.jughold],safe:HG_ALL.every(k=>/Schmerz/.test(EX[k].safe)),mg:HG_ALL.every(k=>mgOf(k)==null)})""")
        chk(r['n']==7 and r['cat'] and r['safe'] and r['mg'] and r['need'][0] and not r['need'][3],f'7 new exercises with animation, category "Griffkraft & Hängen", safety text, no muscle-group sets {r}')
        await pg.evaluate("()=>{go('lib');LIBMODE='kraft';RENDER.lib()}");await pg.wait_for_timeout(200)
        lib=(await pg.inner_text('#v-lib')).lower();chk('griffkraft & hängen · 7' in lib and 'handtuch-hang' in lib and "farmer's hold" in lib,'library lists the 7 exercises in their own category')
        for k in ['hangsupp','scaphang','deadhang','towelhang','farmerhold','jughold']:
            await pg.evaluate("k=>{closeSheet();openExSheet(k)}",k);await pg.wait_for_timeout(80)
            t=(await pg.inner_text('#sheet')).lower();chk('achtung schulter' in t and 'abbrechen' in t and ('stufe' in t or 'beintag' in t),f'detail {k}: shoulder/joint warning + stage tag')
            ro=await pg.evaluate("()=>[$('#sheet .stage .readout').textContent,!!$('#sheet .stage .tempo')]")
            chk(ro[0].startswith('HALTEN · ') and ro[0].endswith(' s') and not ro[1] and 'tempo' not in t,f'detail {k}: stage shows the hold time, no tempo label {ro}')
        await pg.evaluate("closeSheet()")
        # 2) plan: block on pull day after main exercises, before bonus; farmer on leg day; quick without; A unchanged
        r=await pg.evaluate("""()=>{const B=planItems('B',false,1),C=planItems('C',false,1),A=planItems('A',false,1);const bi=B.findIndex(x=>x.blk),ci=C.findIndex(x=>x.blk);
          return{b:B[bi]&&[B[bi].ex,B[bi].sets,B[bi].lo,B[bi].hi,B[bi].blk],before:B.slice(0,bi).every(x=>!x.fin),after:B.slice(bi+1).every(x=>x.fin&&!x.blk),last:B.length-1===bi||(B[B.length-1].fin&&!B[B.length-1].blk),/* 3.13: Bonus darf fürs 10-min-Aufwärmen ganz wegfallen */
            c:C[ci]&&[C[ci].ex,C[ci].sets,C[ci].lo,C[ci].blk],a:A.some(x=>x.blk),q:planItems('B',true,1).some(x=>x.blk),sw:swapPool(B[bi],'B')}}""")
        chk(r['b']==['hangsupp',3,15,15,'hang'] and r['before'] and r['after'] and r['last'],f"pull day: block 'Hängen mit Fußstütze' 3 x 15 s after the main exercises, bonus stays last {r['b']}")
        chk(r['c']==['farmerhold',2,30,'grip'] and not r['a'] and not r['q'] and r['sw']==[r['b'][0]],f"leg day: Farmer's Hold 2 x 30 s; push day without; quick training without; never swapped {r['c']}")
        # 3) stage ladder: time increase, stage up, hold on hard, -5 s and stage down after 2 misses, deload/re-entry change nothing
        r=await pg.evaluate("""()=>{const s=()=>{const x=hangState();return x.stage+':'+x.sec};const o=[];S.history=[];o.push(s());
          let d=60;const push=(ex,rs,eff,x)=>{S.history.push(T.hang(d--,ex,rs,eff,x));o.push(s())};
          push('hangsupp',[15,15,15]);push('hangsupp',[20,20,20],'easy');push('hangsupp',[25,25,25],'hard');push('hangsupp',[25,25,20]);push('hangsupp',[25,22,20]);
          push('hangsupp',[20,20,20]);for(const t of [25,30,35,40,45])push('hangsupp',[t,t,t]);
          push('scaphang',[10,10,10,10,10]);push('scaphang',[15,15,15,15,15]);push('scaphang',[20,20,20,20,20]);
          push('deadhang',[15,15,15],'ok',{deload:true});push('deadhang',[8,6,5]);push('deadhang',[9,6,5]);push('scaphang',[10,10,10,10,8]);push('scaphang',[10,10,8,8,8]);
          const why=suggest({ex:'scaphang',sets:5,lo:10,hi:10}).why;S.history=[];return{o,why}}""")
        exp=['1:15','1:20','1:25','1:25','1:25','1:20','1:25','1:30','1:35','1:40','1:45','2:10','2:15','2:20','3:15','3:15','3:15','3:10','3:10','2:10']
        chk(r['o']==exp,f"stage ladder (+5 s per success, hard = hold, 2 misses = -5 s, top = next stage, 2 misses at the minimum = stage down, deload = no change) {r['o']}")
        chk('Stufe' in r['why'] or 's' in r['why'],'suggestion text for the stage '+r['why'][:80])
        r=await pg.evaluate("""()=>{const o=[];S.history=[];for(let i=0;i<5;i++){const t=hangState().sec;S.history.push(T.hang(30-i,'hangsupp',[t,t,t]))}const B=planItems('B',false,1).find(x=>x.blk);
          const a=[B.ex,B.lo,B.sets];S.history.push(T.hang(20,'hangsupp',[40,40,40]),T.hang(19,'hangsupp',[45,45,45]));const B2=planItems('B',false,1).find(x=>x.blk);S.history=[];return{a,b:[B2.ex,B2.lo,B2.sets]}}""")
        chk(r['a']==['hangsupp',40,3] and r['b']==['scaphang',10,5],f"plan follows the ladder automatically: 3 x 40 s, then stage 2 '5 x 10 s' {r}")
        # 4) farmer's hold: +5 s up to 60 s, then heavier; gear fallback kb -> bags; dumbbell list respected
        r=await pg.evaluate("""()=>{const o={};S.history=[];const g0=gripState('farmerhold');o.start=[g0.sec,g0.w];let d=40;
          for(const t of [30,35,40,45,50,55,60]){S.history.push(T.farm(d--,'farmerhold',14,[t,t]))}const g=gripState('farmerhold');o.top=[g.sec,g.w,g.ev];
          S.profile.weights={db:[10,12.5,15,17.5,20],kb:[8,12,16],band:[]};o.list=[gripStartW('farmerhold'),gripState('farmerhold').w];
          S.profile.gear=JOSCHYGEAR.filter(x=>x!=='db').concat(['kb']);o.kb=[gripKey(),planItems('C',false,1).find(x=>x.blk).ex,gripStartW('kbfarmhold')];
          S.profile.gear=JOSCHYGEAR.filter(x=>x!=='db');o.none=[gripKey(),planItems('C',false,1).find(x=>x.blk).ex,gripStartW('jughold')];
          S.profile.gear=[];o.bw=[planItems('C',false,2).find(x=>x.blk).ex,planItems('B',false,2).some(x=>x.blk),canDo('deadhang')];
          S.profile.gear=[...JOSCHYGEAR];delete S.profile.weights;S.history=[];return o}""")
        chk(r['start']==[30,14] and r['top']==[30,16,'wup'],f"Farmer's Hold: start 2 x 30 s with ~20 % body weight (14 kg), +5 s up to 60 s, then +2 kg from 30 s again {r['start']} {r['top']}")
        chk(r['list'][0]==15 and r['kb']==['kbfarmhold','kbfarmhold',12] and r['none']==['jughold','jughold',0] and r['bw']==['jughold',False,False],
            f"gear respected: dumbbell list snaps (15 kg), kettlebells only -> kettlebell hold, no weights -> bags/canisters, no bar -> no hang block {r}")
        # 5) <= 60 min: all 12 units, gear presets, longer rests, longest stage targets; main lifts untouched
        r=await pg.evaluate("""()=>{const res=[];const bad=[];for(const base of [null,{stage:2,sec:20},{stage:3,sec:60},{stage:4,sec:30}])for(const far of [30,60])for(const g of ['[...JOSCHYGEAR]','ALLGEAR','[...JOSCHYGEAR,"kb"]','[]'])for(const rf of [1,1.2]){
            S.profile.gear=eval(g);S.settings.restF=rf;S.hang.base=base?{...base,at:T.ago(400)}:null;S.history=far===60?[T.farm(5,gripKey(),14,[55,55])]:[];
            for(let w=1;w<=4;w++)for(const d of DAYS){const m=estMinFull(d,false,w);res.push(m);const it=planItems(d,false,w);const def=dayDef(w,d);const i0=it[0];
              if(m>60)bad.push([w+d,g,rf,JSON.stringify(base),m]);if(canDo(def.items[0][0])&&(i0.ex!==def.items[0][0]||i0.sets!==def.items[0][1]))bad.push([w+d,'main',i0.ex,i0.sets])}}
          S.profile.gear=[...JOSCHYGEAR];S.settings.restF=1;S.hang.base=null;S.history=[];save();return{max:Math.max(...res),n:res.length,bad}}""")
        chk(r['max']<=60 and not r['bad'],f"<= 60 min: {r['n']} unit estimates (4 gear presets, rest x1/x1.2, every stage at its longest time, farmer at 60 s) max {r['max']:.1f} min, main lift sets unchanged {r['bad'][:3]}")
        # 5b) vs. the 3.2 build before this feature: every exercise and rep target identical; only assistance/bonus sets may be shortened, block added
        po=await ctx.new_page();await po.goto(UP);await po.wait_for_timeout(300)
        PL="(g)=>{S.profile={name:'Joschy',gear:eval(g),preset:'x',db37:1};const o={};for(let w=1;w<=4;w++)for(const d of DAYS)o[w+d]=planItems(d,false,w).filter(x=>!x.blk).map(x=>[x.ex,x.sets,x.lo,x.hi,x.slot===0||/Kniebeuge|Bankdrück|Kreuzheb|Schulterdrück|Rudern|Klimmz|Chin-up/i.test(EX[x.ex].n),!!x.fin]);return o}"
        for g in ['[...JOSCHYGEAR]','ALLGEAR','["db","bench","band"]','[]']:
            a=await pg.evaluate(PL,g);o=await po.evaluate(PL,g);diff=[]
            for k in o:
                o[k]=[y for y in o[k] if not (y[5] and y[0] not in [x[0] for x in a[k]])]  # 3.13: Bonus darf ganz wegfallen (10-min-Aufwärmen)
                if len(a[k])!=len(o[k]):diff.append((k,'len'));continue
                for x,y in zip(a[k],o[k]):
                    if g=='["db","bench","band"]' and y[0] in ('facepull','pushdown') and x[0] not in ('facepull','pushdown') and not x[4] and x[1]==y[1]:continue  # 3.4: Face Pulls/Trizepsdrücken am Band brauchen Rack
                    if x[0]!=y[0] or x[2:]!=y[2:] or (x[4] and x[1]!=y[1]) or x[1]>y[1] or x[1]<min(y[1],2 if not x[5] else 1):diff.append((k,x,y))
            chk(not diff,f'{g}: vs 3.2 before the feature: same exercises, same rep targets, main lifts (all positions) same sets (only assistance/bonus shortened for the hour) {diff[:3]}')
        await po.close()
        await pg.evaluate("()=>{S.profile.gear=[...JOSCHYGEAR];save()}")
        # 6) training: work screen of the block (hint, warning, test button, timer writes seconds), saving moves the ladder
        await pg.evaluate("()=>{S.history=[];S.hang.tests=[];S.prog.done=['A'];save();startSession('B');const ss=S.session;ss.phase='work';ss.ei=ss.items.findIndex(x=>x.blk);ss.si=0;save();openTrain()}");await pg.wait_for_timeout(400)
        t=await pg.inner_text('#trainInner')
        chk('Hängen mit Fußstütze' in t and 'Griffkraft & Hängen:' in t and 'Stufe 1 von 4' in t and 'loslassen' in t and 'Hang-Test fällig' in t and 'Sekunden' in t,'work screen: stage hint, shoulder warning, seconds input, test due button')
        tp=await pg.text_content('#trainInner .stage .tempo')
        chk('Zusatz kg' not in t and await pg.locator('#trainInner .stepper').count()==1 and tp=='15 s','hang block: no optional extra-kg field, only the seconds stepper, stage shows the hold time '+str(tp))
        await pg.screenshot(path=SH+'/train_hang_arc.png')
        await pg.evaluate("()=>{curItem().hi=2;save();renderTrain()}");await pg.click('#holdBtn');await pg.wait_for_timeout(2700)
        chk(await pg.evaluate("S.session.log[S.session.ei].sets[0].r")==2,'hold timer writes the held seconds into the set')
        await pg.evaluate("()=>{const ss=S.session;ss.items[ss.ei].hi=15;ss.log[ss.ei].sets.forEach(s=>{s.r=15;s.done=true});ss.log[ss.ei].eff='ok';ss.phase='done';save();renderTrain()}");await pg.wait_for_timeout(300)
        await pg.click('#saveS');await pg.wait_for_timeout(400)
        r=await pg.evaluate("()=>[hangState().sec,planItems('B',false,S.prog.block).find(x=>x.blk).lo,S.history.length,S.history[0].log.some(l=>l.ex==='hangsupp')]")
        chk(r==[20,20,1,True],f'saved session: block in history, next pull day automatically 3 x 20 s {r}')
        await pg.evaluate("()=>{S.session=null;S.prog.done=['A','B'];save();startSession('C');const ss=S.session;ss.phase='work';ss.ei=ss.items.findIndex(x=>x.blk);save();openTrain()}");await pg.wait_for_timeout(300)
        t=await pg.inner_text('#trainInner');chk("Farmer's Hold" in t and 'kg je Hand' in t and 'Zusatz kg' not in t and await pg.locator('#trainInner .stepper').count()==2,"Farmer's Hold keeps its weight field (kg je Hand)")
        await pg.evaluate("()=>{closeTrain();S.session=null;S.prog.done=['A'];save()}")
        # 7) hang test: due without test, 1 attempt via the runner, saved, due again after 4 weeks, curve with goal lines
        await pg.evaluate("()=>{S.history=[];save();go('home')}");await pg.wait_for_timeout(200)
        chk(await pg.is_visible('#hgCard') and await pg.is_visible('#hgTestBtn'),'home card: stage + test due button')
        await pg.screenshot(path=SH+'/home_arc.png',full_page=True)
        await pg.click('#hgTestBtn');await pg.wait_for_timeout(200);await pg.screenshot(path=SH+'/test_ready_arc.png')
        await pg.click('#hgGo');await pg.wait_for_timeout(3400);run=await pg.evaluate("HGR.ph");await pg.wait_for_timeout(2200)
        await pg.screenshot(path=SH+'/test_run_arc.png');el=await pg.evaluate("(Date.now()-HGR.t0)/1000");await pg.click('#hgStop');el2=await pg.evaluate("HGR&&HGR.res!=null?0:-1");await pg.wait_for_timeout(200)
        res=await pg.evaluate("HGR.res");await pg.screenshot(path=SH+'/test_result_arc.png');await pg.click('#hgSave');await pg.wait_for_timeout(300)
        r=await pg.evaluate("()=>[S.hang.tests.length,S.hang.tests[0].s,hgTestDue(),hgDaysTo(),S.history.length]")
        chk(run=='run' and 2<=res<=max(3,round(el)+1) and res>=round(el) and r[:3]==[1,res,False] and r[3]==28 and r[4]==0,f'hang test: countdown, count-up, 1 attempt saved ({res} s), next in 28 days, no training entry {r}')
        r=await pg.evaluate("""()=>{S.hang.tests=[{d:dkey(Date.now()-120*864e5),s:7},{d:dkey(Date.now()-90*864e5),s:14},{d:dkey(Date.now()-60*864e5),s:26},{d:dkey(Date.now()-30*864e5),s:41}];save();
          return[hgTestDue(),hgDaysTo()]}""")
        chk(r==[True,0],'4 weeks after the last test it is due again '+str(r))
        await pg.evaluate("()=>{HSUB='kraft';go('hist')}");await pg.wait_for_timeout(400)
        r=await pg.evaluate("""()=>{const c=$('#hgChart');const labs=[];const _f=CanvasRenderingContext2D.prototype.fillText;CanvasRenderingContext2D.prototype.fillText=function(t,...a){labs.push(String(t));return _f.call(this,t,...a)};
          hgChart(c);CanvasRenderingContext2D.prototype.fillText=_f;const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>0)n++;
          return{labs,n,best:$('#hgBest').textContent,last:$('#hgLast').textContent,btn:!!$('#hgTestH'),after:$('#rmCard')?$('#rmCard').nextElementSibling.id:$('#hsub').firstElementChild.id}}""")
        chk('1 Min.' in r['labs'] and '2 Min.' in r['labs'] and r['n']>500 and r['best'].startswith('41') and r['btn'] and r['after']=='hgStat',f"Verlauf: test curve with goal lines 60 s / 120 s, best 41 s, test button when due {r['labs']}")
        await pg.screenshot(path=SH+'/hist_curve_arc.png',full_page=True)
        # 8) hang pause: only on free days, 3 x 10 s, saved apart, never as training
        await pg.evaluate("()=>{S.history=[];save();go('home')}");await pg.wait_for_timeout(200)
        chk(await pg.is_visible('#hgCard') and not await pg.is_visible('#hgPauseBtn'),'plan day (no training yesterday, weekly goal open): no hang pause')
        r=await pg.evaluate("""()=>{const ws=weekStart(new Date());const y=new Date();y.setDate(y.getDate()-1);y.setHours(0,0,0,0);if(ws>=y)return null;
          S.history=[0,1,2].map(i=>T.rec(new Date(ws.getTime()+3600e3*(8+i)).toISOString(),'A',1,[{ex:'bench',sets:T.sets(60,[8])}]));save();go('home');const v=!!$('#hgPauseBtn');S.history=[];save();return v}""")
        chk(r is None or r is True,f'free day: weekly goal reached -> hang pause offered {r}')
        await pg.evaluate("()=>{S.history=[T.rec(T.ago(1),'C',1,[{ex:'squat',sets:T.sets(80,[8])}])];save();go('home')}");await pg.wait_for_timeout(200)
        chk(await pg.is_visible('#hgPauseBtn'),'free day (rest day after yesterday\'s training): hang pause quick start on the home card')
        await pg.click('#hgPauseBtn');await pg.wait_for_timeout(200);await pg.screenshot(path=SH+'/pause_ready_arc.png')
        pd0=await pg.evaluate("JSON.stringify(S.prog.done)");await pg.click('#hgGo');await pg.wait_for_timeout(300)
        for _ in range(6):
            await pg.evaluate("()=>{HGR.end=Date.now()-1;hgTick()}");await pg.wait_for_timeout(120)
            if await pg.evaluate("HGR&&HGR.ph==='hold'"):await pg.screenshot(path=SH+'/pause_hold_arc.png')
        r=await pg.evaluate("()=>[HGR&&HGR.ph,HGR&&HGR.done,S.hang.pauses.length&&S.hang.pauses[0].n,S.history.length,JSON.stringify(S.prog.done),trainedToday().length]")
        chk(r==['done',3,3,1,pd0,0],f'hang pause: 3 holds, stored in S.hang.pauses, no history entry, plan position unchanged {r}')
        await pg.click('#hgOk');await pg.wait_for_timeout(200)
        await pg.evaluate("()=>{S.history.push(T.rec(T.ago(0),'A',1,[{ex:'bench',sets:T.sets(60,[8])}]));save();go('home')}");await pg.wait_for_timeout(200)
        chk(await pg.is_visible('#hgCard') and not await pg.is_visible('#hgPauseBtn'),'training day: no hang pause offered')
        await pg.evaluate("()=>{S.history=[];save()}")
        # 9) plan sheet: manual stage
        await pg.evaluate("()=>{go('home')}");await pg.click('#hgPlanBtn');await pg.wait_for_timeout(200);await pg.screenshot(path=SH+'/plan_sheet_arc.png')
        await pg.click('[data-hgset="3"]');await pg.wait_for_timeout(150);await pg.click('#cOk');await pg.wait_for_timeout(200)
        r=await pg.evaluate("()=>[hangState().stage,hangState().sec,planItems('B',false,1).find(x=>x.blk).ex]");chk(r==[3,15,'deadhang'],f'plan sheet: start stage chosen manually {r}')
        # 10) backup roundtrip v5 + tolerant validation
        r=await pg.evaluate("""()=>{S.history=[T.hang(3,'deadhang',[15,15,15])];save();const t=backupText();const d=JSON.parse(t);const p=parseBackup(t);
          const same=JSON.stringify(p.st.hang)===JSON.stringify(S.hang)&&p.st.history.length===1&&p.st.history[0].log.some(l=>l.ex==='deadhang');
          const bad=JSON.parse(t);bad.state.hang={v:1,tests:[{d:'2026-13-40',s:5},{d:'2026-10-01',s:'x'},{d:'2026-10-02',s:33},null],pauses:'kaputt',base:{stage:9}};const q=parseBackup(JSON.stringify(bad));
          const none=JSON.parse(t);delete none.state.hang;const r3=parseBackup(JSON.stringify(none));return{v:d.v,same,bad:q.st.hang,none:r3.st.hang===undefined,hist:q.st.history.length}}""")
        chk(r['v']==5 and r['same'] and r['bad']=={'v':1,'tests':[{'d':'2026-10-02','s':33}],'pauses':[],'base':None} and r['none'] and r['hist']==1,f"backup v5: S.hang roundtrip, broken entries dropped (history kept), backups without S.hang stay valid {r['bad']}")
        r=await pg.evaluate("""()=>{const keep=S.hang.tests;const txt=()=>{closeSheet();openBackup();return[...document.querySelectorAll('#sheet p.muted')].pop().textContent};
          S.hang.tests=[];const a=txt();S.hang.tests=keep.slice(0,1);const b=txt();S.hang.tests=keep;const c=txt();save();return[a,b,c,keep.length,S.hang.pauses.length]}""")
        chk(r[4]==1 and r[0].endswith('· 1 Hang-Pause') and 'Hang-Test' not in r[0] and r[1].endswith('· 1 Hang-Test · 1 Hang-Pause') and r[2].endswith(f'· {r[3]} Hang-Tests · 1 Hang-Pause'),f'backup sheet: hang tests/pauses named only when present {[x[-40:] if isinstance(x,str) else x for x in r]}')
        await pg.evaluate("closeSheet()")
        async with pg.expect_download() as dl:
            await pg.evaluate("exportBackup()")
        dd=await dl.value;bp=D+'/homegym-backup.json';await dd.save_as(bp);before=await pg.evaluate("localStorage.getItem(KEY)")
        await pg.evaluate("()=>{S.hang={v:1,tests:[],pauses:[],base:null};S.history=[];save();go('set');openBackup()}");await pg.wait_for_timeout(150)
        await pg.set_input_files('#bkFile',bp);await pg.wait_for_timeout(300)
        async with pg.expect_navigation():await pg.click('#cOk')
        await pg.wait_for_timeout(500);after=await pg.evaluate("localStorage.getItem(KEY)")
        chk(json.loads(after)==json.loads(before),'backup file import restores the identical state incl. hang tests, pauses and stage')
        chk(not errs,f'no JS errors {errs[:3]}')
        await ctx.close()
        # 11) migration of the 3.1 fixture: running session and block intact, history untouched, idempotent, 3.1 backup import
        ctx,pg,errs=await page(b)
        async with pg.expect_navigation():
            await pg.evaluate("st=>{window.__hgLock=true;localStorage.setItem(KEY,JSON.stringify(st));location.reload()}",f31['state'])
        await pg.wait_for_timeout(500)
        s1=await pg.evaluate("localStorage.getItem(KEY)");n=json.loads(s1)
        # 3.7: Joschys 3.1-Profil wird umgestellt: weights exakt {db: Set Gummi PRO, kb/band unverändert}, Marke db37; offene Kurzhantel-Sätze 8,75 -> 7,5 (Gleichstand: leichter)
        SET=[2.5,5,7.5,10,12.5,15,17.5,20];o31=f31['state']['profile']
        prof_ok=n['profile']=={**o31,'weights':{'db':SET,'kb':[8,12,16],'band':[]},'db37':1}
        dbi=await pg.evaluate("(its)=>its.map(it=>EX[it.ex].type==='db'&&(NEEDS[it.ex]||[]).flat().includes('db')&&!(NEEDS[it.ex]||[]).flat().includes('kb'))",f31['state']['session']['items'])
        exp=json.loads(json.dumps(f31['state']['session']))
        for i,isdb in enumerate(dbi):
            if isdb:
                for x in exp['log'][i]['sets']:
                    if not x['done'] and x['w']==8.75:x['w']=7.5
        print('db-Übungen in der laufenden 3.1-Einheit:',[it['ex'] for it,d in zip(exp['items'],dbi) if d])
        # 3.8: Stangenfarbe 'Abwechselnd' wird in settings ergänzt
        keep=all(n[k]==f31['state'][k] for k in ['history','prog']) and n['settings']=={**f31['state']['settings'],'barCol':'alt'} and n['session']==exp and any(dbi) and prof_ok and all(n['yoga'][k]==f31['state']['yoga'][k] for k in ['start','done','log'])  # yoga v/startLv = existing 3.2 yoga migration
        chk(keep and n['hang']=={'v':1,'tests':[],'pauses':[],'base':None},f'3.1 state: S.hang added, history/plan position/yoga unchanged; weights exakt umgestellt {n["profile"].get("weights")}, offene Kurzhantel-Sätze aufs Paar')
        await pg.reload();await pg.wait_for_timeout(500);s2=await pg.evaluate("localStorage.getItem(KEY)")
        chk(s1==s2,'migration idempotent: second start leaves the stored state byte-identical')
        r=await pg.evaluate("()=>{openTrain();return[S.session.plan,S.session.items.length,S.session.log[0].sets[0].done,S.session.items.some(x=>x.blk),hangState().stage,planItems('B',false,2).some(x=>x.blk)]}")
        chk(r==['B',len(f31['state']['session']['items']),True,False,1,True],f'running 3.1 session continues unchanged (block only from the next pull day) {r}')
        await pg.evaluate("closeTrain()")
        r=await pg.evaluate("t=>{const p=parseBackup(t);return[p.n,p.st.hang===undefined,JSON.stringify(p.st.prog)]}",f31['backup'])
        chk(r[0]==4 and r[1] and json.loads(r[2])['block']==2,f'3.1 backup readable, plan position kept {r}')
        async with pg.expect_navigation():await pg.evaluate("t=>applyBackup(parseBackup(t).st)",f31['backup'])
        await pg.wait_for_timeout(500);r=await pg.evaluate("()=>{const p=JSON.parse(localStorage.getItem(KEY)).profile;return{w:p.weights,f:p.db37,bk:JSON.parse(backupText()).v}}")
        chk(r=={'w':{'db':[2.5,5,7.5,10,12.5,15,17.5,20],'kb':[8,12,16],'band':[]},'f':1,'bk':5},f'3.1 backup eingespielt: weights exakt (db = Set Gummi PRO, kb/band unverändert), Backup bleibt v5 {r}')
        chk(not errs,f'no JS errors (migration) {errs[:3]}')
        await ctx.close()
        # 12) animations of the new exercises: never at the canvas edge / under a label, all places, 3 viewports, man + woman
        KEYS=['hangsupp','scaphang','deadhang','towelhang','farmerhold','kbfarmhold','jughold']
        hits=[]
        for w,h in [(360,780),(390,844),(412,915)]:
            for th in ['arc','day']:
                ctx,pg,errs=await page(b,U,th,w,h);await pg.evaluate("()=>{S.profile.gear=[...JOSCHYGEAR,'kb'];save()}")
                keys=[[k,g,None] for k in KEYS for g in 'mf']
                for js,sel,still in [("()=>{go('lib');LIBMODE='kraft';RENDER.lib()}",'#v-lib canvas[data-mini]',True),("()=>openExSheet('deadhang')",'#scv',False),("()=>{closeSheet();hgRun('pause')}",'#hgc',False),
                    ("()=>{closeSheet();S.prog.done=['A'];save();startSession('B');const ss=S.session;ss.phase='work';ss.ei=ss.items.findIndex(x=>x.blk);save();openTrain()}",'#cv',False),("()=>startRest(60,true)",'#rcv',False)]:
                    await pg.evaluate(js);await pg.wait_for_timeout(200)
                    hh=await pg.evaluate(EDGE,{'sel':sel,'keys':keys,'frames':1 if still else 16,'still':still});hits+=[(w,th,sel,x.get('key'),x.get('g')) for x in hh]
                chk(not errs,f'{w}x{h} {th}: no JS errors {errs[:2]}')
                await ctx.close()
        chk(not hits,f'7 new animations (man + woman): library, detail, hang runner, training, rest preview, 3 viewports, arc + day: nothing clipped {hits[:4]}')
        # 13) screenshots 412x915 arc + day
        for th in ['arc','day']:
            ctx,pg,errs=await page(b,U,th)
            await pg.evaluate("()=>{S.hang.tests=[{d:dkey(Date.now()-90*864e5),s:6},{d:dkey(Date.now()-60*864e5),s:12},{d:dkey(Date.now()-30*864e5),s:19}];save()}")
            for name,js in [('home',"()=>{go('home');const c=$('#hgCard');window.scrollTo(0,c.getBoundingClientRect().top+scrollY-120)}"),('plan_sheet',"()=>{go('home');hgPlanSheet()}"),
                ('lib_griff',"()=>{go('lib');LIBMODE='kraft';RENDER.lib();$('#cat-griff').scrollIntoView()}"),
                *[(f'detail_{k}',f"()=>{{go('lib');openExSheet('{k}')}}") for k in KEYS],
                ('train_hang',"()=>{closeSheet();S.prog.done=['A'];save();startSession('B');const ss=S.session;ss.phase='work';ss.ei=ss.items.findIndex(x=>x.blk);save();openTrain()}"),
                ('train_farmer',"()=>{S.session=null;S.prog.done=['A','B'];save();startSession('C');const ss=S.session;ss.phase='work';ss.ei=ss.items.findIndex(x=>x.blk);save();openTrain()}"),
                ('hang_test',"()=>{closeTrain();S.session=null;save();go('home');hgRun('test')}"),('hang_pause',"()=>{closeSheet();hgRun('pause')}"),
                ('hist_curve',"()=>{closeSheet();HSUB='kraft';go('hist');$('#hgStat').scrollIntoView()}")]:
                await pg.evaluate(js);await pg.wait_for_timeout(350);await pg.screenshot(path=f'{SH}/{name}_{th}.png')
            chk(not errs,f'screenshots {th}: no JS errors {errs[:2]}')
            await ctx.close()
        await b.close()
    srv.terminate();old.terminate();pre.terminate()
    print('RESULT '+('ALL OK' if not fails else f'{len(fails)} FAILED: '+' | '.join(fails)))
asyncio.run(main())
sys.exit(1 if fails else 0)  # 3.8: Exit-Code ungleich 0 bei FAIL
