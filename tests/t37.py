# Homegym 3.7 @ Joschy – t37: Joschys neue Kurzhanteln (Set Gummi PRO, feste Paare 2,5–20 kg)
# 1) Migration: alter Stand (verstellbare Kurzhanteln = leere Liste) -> neues Set, laufende Kurzhantel-Sätze aufs nächste Paar,
#    idempotent, andere Presets/eigene Listen unverändert, altes Backup (v5) lesbar und wird umgestellt.
# 2) Gewichtsrundung auf vorhandene Paare (bei Gleichstand abrunden), Steigerung erst über Wiederholungen, Maximum 20 kg je Hand.
# 3) Plan und Hauptübungen wie in 3.6 (Vergleich mit releases/Homegym-3.6.apk), keine Einheit über 59 min.
# 4) Start-Animation (3.10: 5 s, genaue Dauer in t39; Tippen überspringt, reduced motion kurz, Flag ?nosplash) und Gold-Glanz im Kopf nach einem Training.
# Aufruf: python3 -I tests/t37.py  (HOMEGYM_OUT = Ordner mit index.html, Standard out/)
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
import asyncio,subprocess,time,sys,json,tempfile,zipfile
from playwright.async_api import async_playwright
_V36=tempfile.mkdtemp(prefix='hg36-')
with zipfile.ZipFile(_os.path.join(_REPO,'releases','Homegym-3.6.apk')) as z:open(_os.path.join(_V36,'index.html'),'wb').write(z.read('assets/index.html'))
srv=subprocess.Popen([sys.executable,'-m','http.server','8853','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
srv36=subprocess.Popen([sys.executable,'-m','http.server','8854','-d',_V36],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8853/index.html?nosplash=1';UR='http://127.0.0.1:8853/index.html';U36='http://127.0.0.1:8854/index.html'
fails=[]
def chk(c,msg):
    print(('ok   ' if c else 'FAIL ')+msg);(None if c else fails.append(msg))
SET=[2.5,5,7.5,10,12.5,15,17.5,20]
# alter Stand von Joschy (3.6): Preset Joschys Homegym, Kurzhanteln verstellbar (leere Liste), laufende Einheit mit Kurzhantel-Sätzen
OLD="""()=>{const ago=d=>new Date(Date.now()-d*864e5).toISOString();return{settings:{...DEF.settings,voiceMode:'off'},next:0,protein:{d:'',g:0,log:[]},body:[{d:'2026-01-01',kg:82}],
  profile:{name:'Joschy',gear:[...JOSCHYGEAR],gearV:2,preset:'joschy',weights:{db:[],kb:[8,12,16],band:[]}},
  history:[{date:ago(3),plan:'A',day:'A',week:1,dur:3000,unit:true,log:[{ex:'dbbench',sets:[{w:11,r:10,done:true},{w:11,r:10,done:true}]},{ex:'lateral',sets:[{w:8,r:15,done:true}]}]}],
  session:{plan:'A',week:1,phase:'work',ei:0,si:1,start:Date.now()-6e5,warm:[],unit:true,
    items:[{ex:'lateral',sets:3,lo:12,hi:15,slot:0},{ex:'curl',sets:3,lo:10,hi:12,slot:1},{ex:'bench',sets:3,lo:6,hi:8,slot:2},{ex:'kbswing',sets:2,lo:12,hi:15,slot:3}],
    log:[{ex:'lateral',sets:[{w:8,r:15,done:true},{w:8,r:15,done:false},{w:8.75,r:15,done:false}]},{ex:'curl',sets:[{w:23,r:10,done:false},{w:11,r:10,done:false},{w:9,r:10,done:false}]},
         {ex:'bench',sets:[{w:62.5,r:8,done:false},{w:62.5,r:8,done:false},{w:62.5,r:8,done:false}]},{ex:'kbswing',sets:[{w:12,r:12,done:false},{w:12,r:12,done:false}]}]}}}"""
async def put(pg,js):
    async with pg.expect_navigation():await pg.evaluate("(st)=>{window.__hgLock=true;localStorage.setItem(KEY,JSON.stringify(st));location.reload()}",await pg.evaluate(js))
    await pg.wait_for_timeout(500)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844});pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await pg.wait_for_timeout(500)
        v=await pg.evaluate("[APP_VER,BK_VER,JOSCHY_DB]");chk(v==['3.11',5,SET],f'Version 3.11, Backup-Format 5, Set {v}')
        # ---------- 1) Migration ----------
        await put(pg,OLD)
        r=await pg.evaluate("()=>{const st=JSON.parse(localStorage.getItem(KEY));return{w:st.profile.weights,f:st.profile.db37,gear:st.profile.gear,pre:st.profile.preset,log:st.session.log.map(l=>l.sets.map(s=>s.w)),h:st.history[0].log.map(l=>l.sets.map(s=>s.w))}}")
        print('migriert',r)
        chk(r['w']['db']==SET and r['w']['kb']==[8,12,16] and r['f']==1 and r['pre']=='joschy' and 'db' in r['gear'],'Joschys Kurzhanteln -> Set Gummi PRO, Kettlebells/Preset unverändert')
        chk(r['log'][0]==[8,7.5,7.5],'laufende Sätze Seitheben: erledigt bleibt 8, offen 8 -> 7,5 und 8,75 -> 7,5 (Gleichstand: abrunden) '+str(r['log'][0]))
        chk(r['log'][1]==[20,10,10],'laufende Sätze Curls: 23 -> 20 (Maximum), 11 -> 10, 9 -> 10 (nächstes Paar) '+str(r['log'][1]))
        chk(r['log'][2]==[62.5]*3 and r['log'][3]==[12,12],'Langhantel und Kettlebell bleiben unverändert')
        chk(r['h']==[[11,11],[8]],'Verlauf bleibt unverändert')
        raw1=await pg.evaluate("localStorage.getItem(KEY)")
        async with pg.expect_navigation():await pg.evaluate("location.reload()")
        await pg.wait_for_timeout(500);raw2=await pg.evaluate("localStorage.getItem(KEY)")
        chk(json.loads(raw1)==json.loads(raw2),'Migration ist idempotent (zweiter Start ändert nichts)')
        # eigene Änderung danach bleibt
        await pg.evaluate("()=>{S.profile.weights.db=[2.5,5,10];save()}")
        async with pg.expect_navigation():await pg.evaluate("location.reload()")
        await pg.wait_for_timeout(500);chk(await pg.evaluate("S.profile.weights.db")==[2.5,5,10],'spätere eigene Liste wird nicht überschrieben')
        # andere Presets / Listen
        cases=[("{name:'Anna',gear:['db','bench','band'],gearV:2,preset:'dbonly',weights:{db:[],kb:[8,12,16],band:[]}}",False,'Nur Kurzhanteln (fremdes Profil)'),
               ("{name:'Anna',gear:[...JOSCHYGEAR],gearV:2,preset:'joschy',weights:{db:[6,8,10],kb:[8,12,16],band:[]}}",False,'Preset Joschy mit eigener Liste'),
               ("{name:'Anna',gear:[...ALLGEAR],gearV:2,preset:'all'}",False,'Preset Alles'),
               ("{name:'Joschy',gear:['db','bench','band'],gearV:2,preset:'dbonly',weights:{db:[5,7.5],kb:[8,12,16],band:[]}}",True,'Joschys eigene Liste unter Nur Kurzhanteln'),
               ("{name:'Anna',gear:[...JOSCHYGEAR],gearV:2,preset:'joschy',weights:{db:[5,7.5],kb:[8,12,16],band:[]}}",True,'Preset Joschys Homegym mit den alten Paaren')]
        for prof,mig,label in cases:
            await put(pg,"()=>({settings:{...DEF.settings,voiceMode:'off'},history:[],next:0,session:null,body:[],profile:"+prof+"})")
            r=await pg.evaluate("()=>{const st=JSON.parse(localStorage.getItem(KEY));return{p:st.profile,ref:"+prof+"}}")
            if mig:chk(r['p']['weights']['db']==SET and r['p']['db37']==1,f'{label}: umgestellt')
            else:chk(r['p']==r['ref'],f'{label}: unverändert {r["p"].get("weights")}')
        # altes Backup (v5, aus 3.6) lesbar, nach dem Einspielen umgestellt, neues Backup bleibt v5
        p36=await ctx.new_page();await p36.goto(U36);await p36.wait_for_timeout(500)
        bk=await p36.evaluate("(st)=>{localStorage.setItem(KEY,JSON.stringify(st));load();return backupText()}",await pg.evaluate(OLD));await p36.close()
        r=await pg.evaluate("(t)=>{const r=parseBackup(t);return{v:JSON.parse(t).v,app:JSON.parse(t).appVer,n:r.n,db:r.st.profile.weights.db}}",bk)
        chk(r['v']==5 and r['app']=='3.6' and r['n']==1 and r['db']==[],f'3.6-Backup (v5) lesbar {r}')
        async with pg.expect_navigation():await pg.evaluate("(t)=>applyBackup(parseBackup(t).st)",bk)
        await pg.wait_for_timeout(600)
        r=await pg.evaluate("()=>({db:S.profile.weights.db,h:S.history.length,bk:JSON.parse(backupText()).v})")
        chk(r['db']==SET and r['h']==1 and r['bk']==5,f'nach dem Einspielen umgestellt, neues Backup weiter v5 {r}')
        # ---------- 2) Rundung und Steigerung ----------
        r=await pg.evaluate("""()=>{S.session=null;S.profile={name:'Joschy',gear:[...JOSCHYGEAR],gearV:2,preset:'joschy',db37:1,weights:{db:JOSCHY_DB.slice(),kb:[8,12,16],band:[]}};
          const H=(ex,w,reps,eff)=>{S.history=[{date:new Date(Date.now()-3*864e5).toISOString(),plan:'A',day:'A',week:1,dur:3000,log:[{ex,eff,sets:reps.map(r=>({w,r,done:true}))}]}]};
          const it={ex:'curl',sets:3,lo:10,hi:12};const o={};
          H('curl',5,[12,12,12],'ok');o.a=suggest(it);H('curl',5,[14,14,14],'ok');o.b=suggest(it);
          H('curl',15,[12,12,12],'ok');o.c=suggest(it);H('curl',10,[12,12,12],'easy');o.d=suggest(it);H('curl',10,[14,14,14],'easy');o.e=suggest(it);
          H('curl',10,[12,11,12],'easy');o.f=suggest(it);H('curl',20,[12,12,12],'ok');o.g=suggest(it);H('curl',20,[15,15,15],'easy');o.h=suggest(it);
          H('curl',8,[11,11,11],'ok');o.i=suggest(it);H('curl',24,[12,12,12],'ok');o.j=suggest(it);H('curl',7.5,[8,7,6],'hard');S.history.unshift({...S.history[0],date:new Date(Date.now()-6*864e5).toISOString()});o.k=suggest(it);
          o.sets=initSets(it,o.a).map(s=>[s.w,s.r]);o.setsB=initSets(it,o.b).map(s=>[s.w,s.r]);
          o.start=startW('goblet',null);o.step=[stepW(JOSCHY_DB,20,1),stepW(JOSCHY_DB,2.5,-1),stepW(JOSCHY_DB,7.5,1)];
          /* alle Kurzhantel-Übungen x Gewichte x Ergebnisse: Vorschlag immer ein vorhandenes Paar, nie über 20 kg */
          const bad=[];const dbx=Object.keys(EX).filter(k=>wGearOf(k)==='db'&&EX[k].type==='db'&&canDo(k));
          for(const k of dbx)for(let w=1;w<=30;w+=.5)for(const [rs,ef] of [[[12,12,12],'ok'],[[15,15,15],'easy'],[[12,11,12],'easy'],[[6,5,5],'hard'],[[20,20,20],'easy']]){
            H(k,w,rs,ef);if(ef==='hard')S.history.unshift({...S.history[0]});const s=suggest({ex:k,sets:3,lo:8,hi:12});if(!JOSCHY_DB.includes(s.w)||s.w>20)bad.push([k,w,ef,s.w])}
          S.settings.deload=true;H('dbbench',20,[12,12,12],'ok');o.dl=suggest({ex:'dbbench',sets:3,lo:8,hi:12}).w;S.settings.deload=false;
          S.history=[];return{...Object.fromEntries(Object.entries(o).map(([k,v])=>[k,v&&v.w!=null?{w:v.w,mode:v.mode,rt:v.rt,why:v.why}:v])),bad:bad.slice(0,5),nbad:bad.length,ndb:dbx.length}}""")
        for k in 'abcdefghijk':print(' ',k,r[k])
        chk(r['a']['w']==5 and r['a']['rt']==14,'5 kg, alle 12 geschafft: großer Sprung (+50 %) -> erst 14 Wdh., Paar bleibt')
        chk(r['b']['w']==7.5 and r['b']['rt']==10,'5 kg mit 14 Wdh.: nächstes Paar 7,5 kg, Start wieder bei 10 Wdh.')
        chk(r['c']['w']==17.5,'15 kg, alle 12: kleiner Sprung (+17 %) -> direkt 17,5 kg')
        chk(r['d']['w']==10 and r['d']['rt']==14 and r['e']['w']==12.5,'leicht: nie zwei Paare auf einmal (10 -> erst 14 Wdh., dann 12,5)')
        chk(r['f']['w']==10 and r['f']['rt']==12,'leicht, aber nicht alle Wdh.: kein früher Sprung, erst die Wiederholungen voll')
        chk(r['g']['w']==20 and r['g']['mode']=='top' and 'schwerstes Paar' in r['g']['why'] and r['h']['w']==20 and 'Tempo' in r['h']['why'],'20 kg ist das Maximum: weiter über Wiederholungen, Tempo oder Sätze')
        chk(r['i']['w']==7.5 and r['j']['w']==20,'altes Gewicht wird aufs nächste Paar gerundet (8 -> 7,5, 24 -> 20)')
        chk(r['k']['w']==5,'zweimal hart: ein Paar leichter (7,5 -> 5)')
        chk(r['sets']==[[5,14]]*3 and r['setsB']==[[7.5,10]]*3,'Sätze übernehmen Paar und Wiederholungsziel '+str(r['sets'][:1]+r['setsB'][:1]))
        chk(r['start']==7.5 and r['step']==[20,2.5,10],'Startgewicht und +/- springen nur zwischen vorhandenen Paaren, nie über 20 kg '+str([r['start'],r['step']]))
        chk(r['nbad']==0 and r['ndb']>=20,f"{r['ndb']} Kurzhantel-Übungen x Gewichte 1–30 kg x Ergebnisse: Vorschlag immer ein Paar aus dem Set, max. 20 kg {r['bad']}")
        chk(r['dl'] in SET and r['dl']==12.5,'Entlastung (60 %) landet ebenfalls auf einem Paar '+str(r['dl']))
        # ---------- 3) Plan wie in 3.6, <= 59 min ----------
        DUMP="""(db)=>{const keep=JSON.stringify(S);const o={};for(const c of [1,2,3])for(let w=1;w<=4;w++)for(const d of DAYS)for(const q of [false,true]){
            S.profile={name:'J',gear:[...JOSCHYGEAR],preset:'joschy',weights:{db,kb:[8,12,16],band:[]}};S.prog={v:1,block:w,done:[],cycle:c,units:0,dlLeft:0,dlAt:4};S.history=[];if(S.hang)S.hang.base=null;
            const it=planItems(d,q,w);o[[c,w,d,q].join('|')]=[estSecs(it,q),it.map(x=>[x.ex,x.sets,x.lo,x.hi])]}S=JSON.parse(keep);save();return o}"""
        p36=await ctx.new_page();await p36.goto(U36);await p36.wait_for_timeout(500)
        ref=await p36.evaluate(DUMP,[]);await p36.close();cur=await pg.evaluate(DUMP,SET)
        diff=[k for k in ref if ref[k][1]!=cur.get(k,[0,None])[1]];long=[(k,round(v[0]/60,1)) for k,v in cur.items() if v[0]>3540]
        chk(len(cur)==len(ref)==72 and not diff,f'Plan (Zyklen 1–3 x 4 Blöcke x A/B/C x voll/kurz) identisch zu 3.6 {diff[:3]}')
        chk(not long,f'keine Einheit über 59 min {long[:3]}')
        # Geräte-Karte zeigt Joschy Gym / Zubehör
        await pg.evaluate("()=>{S.profile={name:'Joschy',gear:[...JOSCHYGEAR],gearV:2,preset:'joschy',db37:1,weights:{db:JOSCHY_DB.slice(),kb:[8,12,16],band:[]}};save();go('set')}");await pg.wait_for_timeout(300)
        t=await pg.text_content('#gearCard');chips=await pg.eval_on_selector_all('[data-wdel=db]','e=>e.map(x=>+x.dataset.v)')
        chk('Joschy Gym' in t and 'Zubehör' in t and 'Gummi PRO' in t and '2 Etagen' in t and 'Verstellbare Kurzhanteln' not in t and chips==SET,'Geräte-Karte: Joschy Gym und Zubehör mit dem neuen Set, Gewichtsliste = Paare')
        # ---------- 4) Start-Animation und Gold-Glanz ----------
        chk(await pg.evaluate("!document.getElementById('splash')"),'Flag ?nosplash: keine Start-Animation')
        await pg.evaluate("()=>{S.history=[];S.session=null;save();window.__hgShine=Date.now();go('home')}");await pg.wait_for_timeout(100)
        r=await pg.evaluate("()=>{const m=document.querySelector('#hgMark');const a=m&&m.classList.contains('shine');go('home');const b=document.querySelector('#hgMark').classList.contains('shine');return[a,b]}")
        chk(r==[True,False],'Gold-Glanz über den Scheiben im Kopf einmal nach dem Training '+str(r))
        async def fresh(**kw):
            c=await b.new_context(viewport={'width':390,'height':844},**kw);q=await c.new_page();e=[];q.on('pageerror',lambda x:e.append(str(x)));return c,q,e
        c,q,e=await fresh();t0=time.time();await q.goto(UR);await q.wait_for_selector('#splash.run',timeout=2000)
        vis=await q.evaluate("()=>{const s=document.getElementById('splash');const r=s.getBoundingClientRect();return{w:r.width,h:r.height,svg:!!s.querySelector('#hgUpper'),fl:s.querySelectorAll('.splSweep').length*10+s.querySelectorAll('.splStar').length,app:!!document.querySelector('#v-home').innerHTML}}")
        await q.wait_for_selector('#splash',state='detached',timeout=8000);dt=time.time()-t0
        chk(vis['w']==390 and vis['svg'] and vis['fl']==12 and vis['app'] and 4.7<=dt<=6.0,f'Start-Animation: Icon groß über der schon fertigen App, nach {dt:.2f} s weg (5 s + Laden, Soll 4,7–6,0 s) {vis}')
        async with q.expect_navigation():await q.evaluate("location.reload()")
        await q.wait_for_timeout(150);chk(await q.evaluate("!document.getElementById('splash')"),'nach einem Neuladen (z. B. Backup) keine zweite Start-Animation');await c.close()
        c,q,e=await fresh();await q.goto(UR);await q.wait_for_selector('#splash.run');t0=time.time();await q.mouse.click(195,420)
        await q.wait_for_selector('#splash',state='detached',timeout=1000);chk(time.time()-t0<.6 and not e,f'Tippen überspringt ({time.time()-t0:.2f} s)');await c.close()
        c,q,e=await fresh(reduced_motion='reduce');t0=time.time();await q.goto(UR);await q.wait_for_selector('#splash',state='detached',timeout=2000)
        chk(time.time()-t0<1.0 and not e,f'reduced motion: stark verkürzt ({time.time()-t0:.2f} s)');await c.close()
        chk(not errs,f'keine JS-Fehler {errs[:3]}')
        await b.close()
    srv.terminate();srv36.terminate()
    print('\nt37:', 'ALLES OK' if not fails else f'{len(fails)} FEHLER');sys.exit(1 if fails else 0)
asyncio.run(main())
