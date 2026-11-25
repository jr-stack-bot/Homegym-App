# Homegym 3.13 @ Joschy – t40: Aufwärmen 10 min, Crosstrainer zuerst, danach wechselnde Mobilisation passend zum Tag
# 1) Dauer ca. 10 min (±1) für jede Einheit, Kurz, mit/ohne Aufwärmsätze; Cardio (Crosstrainer bzw. Ersatz) immer zuerst
# 2) Abwechslung: 12 aufeinanderfolgende Einheiten -> mind. 8 verschiedene Blöcke, nie derselbe Block zweimal hintereinander
#    (auch nicht bei gleichem Tag hintereinander); deterministisch (gleiche Eingabe = gleicher Block)
# 3) Auswahl passt zum Tag (Push: Schultern/Brust/BWS, Pull: Schulterblätter/Lat/Griff, Beine: Hüfte/Knie/Sprunggelenk/Gesäß)
# 4) Stabil beim Neuladen (in S.session gespeichert), auch wenn sich der Verlauf ändert
# 5) Geräte werden beachtet (Band, Klimmzugstange/Rack, Crosstrainer-Ersatz, ohne Geräte)
# 6) alle Aufwärmübungen haben Animation (Mann/Frau, mit/ohne Kostüm zeichnen etwas), Anleitung, Atmung, Achtung
# 7) Hauptübungen exakt wie 3.12 (releases/Homegym-3.12.apk), Übungslisten gleich, keine Einheit > 59 min (Zyklen 1-8, 24 Geräte-Einstellungen, voll/kurz)
# 8) JAI: Übungen ohne Clip bleiben still (Liste wird ausgegeben)
# Aufruf: python3 -I tests/t40.py  (HOMEGYM_OUT = Ordner mit index.html, Standard out/)
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
import asyncio,subprocess,time,sys,json,tempfile,zipfile
from playwright.async_api import async_playwright
_V312=tempfile.mkdtemp(prefix='hg312-')
with zipfile.ZipFile(_os.path.join(_REPO,'releases','Homegym-3.12.apk')) as z:open(_os.path.join(_V312,'index.html'),'wb').write(z.read('assets/index.html'))
srv=subprocess.Popen([sys.executable,'-m','http.server','8871','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
srv2=subprocess.Popen([sys.executable,'-m','http.server','8872','-d',_V312],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8871/index.html?nosplash=1';UR='http://127.0.0.1:8872/index.html?nosplash=1'
fails=[]
def chk(c,msg):
    print(('ok   ' if c else 'FAIL ')+msg);(None if c else fails.append(msg))
PROFILE="()=>{S.profile={name:'Joschy',gear:[...JOSCHYGEAR],preset:'joschy'};S.settings.voiceMode='off';save();location.reload()}"
DUMP=r"""()=>{const M=/Kniebeuge|Bankdrück|Kreuzheb|Schulterdrück|Rudern|Klimmz|Chin-up/i;const keep=JSON.stringify(S);const o={};
  const G={joschy:[...JOSCHYGEAR],all:ALLGEAR,dbonly:["db","bench","band"],none:[]};
  for(const [gn,g] of Object.entries(G))for(const km of [true,false])for(const rf of [.8,1,1.2])for(let c=1;c<=8;c++)for(let w=1;w<=4;w++)for(const d of DAYS)for(const q of [false,true]){
    S.profile={name:'J',gear:[...g],preset:'x',kbMix:km};S.settings.restF=rf;S.prog={v:1,block:w,done:[],cycle:c,units:0,dlLeft:0,dlAt:4};S.history=[];if(S.hang)S.hang.base=null;
    const it=planItems(d,q,w);o[[gn,km,rf,c,w,d,q].join('|')]=[estSecs(it,q),it.map(x=>[x.ex,x.sets,x.lo,x.hi,!x.fin&&(x.slot===0||M.test(EX[x.ex].n)),!!x.fin])]}
  S=JSON.parse(keep);save();return o}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844});pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await pg.wait_for_timeout(400);await pg.evaluate(PROFILE);await pg.wait_for_timeout(700)
        v=await pg.evaluate("[APP_VER,BK_VER]");chk(v==['3.13',5],f'Version 3.13, Backup-Format 5 {v}')
        # 1) Dauer und Crosstrainer zuerst
        r=await pg.evaluate("""()=>{const o=[];for(const d of DAYS)for(let n=0;n<12;n++)for(const q of [false,true])for(const ws of [false,true]){const l=warmList(q,ws,d,n);
          o.push({d,n,q,ws,sec:l.reduce((a,w)=>a+(w.sec||30),0),first:l[0].anim,fn:l[0].n,rest:l.slice(1).map(w=>w.k)})}
          return{o,est:[estBase([],false),estBase([],true)]}}""")
        o=r['o'];bad=[x for x in o if not (540<=x['sec']<=660)]
        chk(not bad and r['est']==[600,600],f"Aufwärmen 10 min ±1 in allen {len(o)} Fällen (Tag × Einheit × Kurz × Aufwärmsätze), Zeitansatz 600 s {bad[:2]} {r['est']}")
        chk(all(x['first']=='cross' and x['fn'].startswith('Crosstrainer') and len(x['rest'])>=4 for x in o),'Crosstrainer immer zuerst, danach mind. 4 Mobilisationsübungen')
        # 2) Abwechslung über 12 aufeinanderfolgende Einheiten (A,B,C im Wechsel; n = Zähler)
        r=await pg.evaluate("""()=>{const sig=l=>l.slice(1).map(w=>w.k).join(',');const seq=[];for(let n=0;n<12;n++){const d=DAYS[n%3];seq.push(d+':'+sig(warmList(false,true,d,n)))}
          const same=[];for(const d of DAYS)for(let n=0;n<60;n++){if(sig(warmList(false,true,d,n))===sig(warmList(false,true,d,n+1)))same.push(d+n)}
          const per={};for(const d of DAYS){const s=new Set();for(let n=0;n<12;n++)s.add(sig(warmList(false,true,d,n)));per[d]=s.size}
          const det=sig(warmList(false,true,'B',7))===sig(warmList(false,true,'B',7));
          const ord=new Set();for(let n=0;n<12;n++)ord.add(warmList(false,true,'A',n)[1].k);
          return{seq,same,per,det,first:ord.size}}""")
        seq=r['seq'];cons=[i for i in range(1,len(seq)) if seq[i]==seq[i-1]]
        print('   12 Einheiten:',*seq,sep='\n     ')
        chk(len(set(seq))>=8 and not cons,f"12 aufeinanderfolgende Einheiten: {len(set(seq))} verschiedene Blöcke, keiner zweimal hintereinander")
        chk(not r['same'] and min(r['per'].values())>=8 and r['det'] and r['first']>=3,f"gleicher Tag hintereinander nie identisch (n 0-60), je Tag {r['per']} verschiedene Blöcke in 12 Einheiten, deterministisch, wechselnde erste Übung ({r['first']})")
        # 3) passt zum Tag
        r=await pg.evaluate("""()=>{const P={};for(const d of DAYS)P[d]=wpPool(d).map(w=>w.k);const off=[];for(const d of DAYS)for(let n=0;n<40;n++)for(const w of warmList(false,true,d,n).slice(1)){const p=WPOOL.find(x=>x.k===w.k);if(!p||!p.d.includes(d))off.push(d+':'+w.k)}
          const reg={A:/Schulter|Brust|Arm|Wand|Faden|Katze|Pull|Außen|Y-T-W/i,B:/Schulter|Rudern|Hängen|Welpe|Schwimmer|Pull|Arm|Y-T-W|Faden|Katze|Bird|Wand|Außen/i,C:/Hüft|Knie|Wade|Schienbein|Bridge|Ausfall|Bird|Bein|Katze/i};
          const miss=[];for(const d of DAYS)for(const k of P[d]){const w=WPOOL.find(x=>x.k===k);if(!reg[d].test(w.n))miss.push(d+':'+w.n)}
          const legsInPush=P.A.filter(k=>/C/.test(WPOOL.find(x=>x.k===k).d)&&!/A/.test(WPOOL.find(x=>x.k===k).d));
          return{P,off,miss,legsInPush,jump:WPOOL.filter(w=>/jj|jump|rope|skater|plyo/.test(w.an)).map(w=>w.k)}}""")
        print('   Pool:',{d:len(x) for d,x in r['P'].items()})
        chk(not r['off'] and not r['miss'] and not r['legsInPush'] and not r['jump'] and all(len(x)>=10 for x in r['P'].values()),f"Auswahl passt zum Tag, Pool je Tag >= 10 (Joschys Geräte), keine Sprünge {r['off'][:3]} {r['miss'][:3]} {r['jump']}")
        # 4) stabil beim Neuladen
        a=await pg.evaluate("()=>{S.history=[];S.prog={v:1,block:1,done:[],cycle:1,units:0,dlLeft:0,dlAt:0};save();startSession('A');save();return S.session.warm.map(w=>w.k||w.anim)}")
        await pg.reload();await pg.wait_for_timeout(700)
        b1=await pg.evaluate("S.session.warm.map(w=>w.k||w.anim)")
        await pg.evaluate("()=>{S.history.push({date:new Date().toISOString(),plan:'C',week:1,dur:3000,log:[]});save()}");await pg.reload();await pg.wait_for_timeout(700)
        b2=await pg.evaluate("[S.session.warm.map(w=>w.k||w.anim),warmList(false,true,'A',1).map(w=>w.k||w.anim)]")
        chk(a==b1==b2[0] and b2[1]!=a,f'Auswahl bleibt beim Neuladen fest (auch wenn sich der Verlauf ändert) {a}')
        await pg.evaluate("()=>{openTrain()}");await pg.wait_for_timeout(300)
        await pg.evaluate("()=>{S.session.wi=1;save();renderTrain()}");await pg.wait_for_timeout(300)
        t=await pg.inner_text('#train');chk('Atmung:' in t and 'Achtung:' in t and '2 / ' in t,'Aufwärm-Ansicht zeigt Anleitung, Atmung und Achtung')
        await pg.screenshot(path=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots').rstrip('/')+'_t40_warm.png')
        await pg.evaluate("()=>{S.session=null;save();closeTrain()}")
        # 5) Geräte
        r=await pg.evaluate("""()=>{const keep=JSON.stringify(S.profile);const run=g=>{S.profile.gear=g;const o=[];for(const d of DAYS)for(let n=0;n<30;n++)o.push(warmList(false,true,d,n));return o};
          const ks=L=>new Set(L.flatMap(l=>l.slice(1).map(w=>w.k)));const sec=L=>L.map(l=>l.reduce((a,w)=>a+w.sec,0));
          const none=run([]),nb=run(JOSCHYGEAR.filter(g=>g!=='band'&&g!=='pullbar'&&g!=='rack')),row=run(['rower']),rope=run(['rope']),jo=run([...JOSCHYGEAR]);
          const res={none:[...ks(none)],noneFirst:[...new Set(none.map(l=>l[0].anim))],nb:[...ks(nb)],rowFirst:[...new Set(row.map(l=>l[0].anim))],rope:[...new Set(rope.map(l=>l[0].anim+l.length))],
            ropeSec:[Math.min(...sec(rope)),Math.max(...sec(rope))],noneSec:[Math.min(...sec(none)),Math.max(...sec(none))],jo:[...ks(jo)]};
          res.gearBad=[];for(const[g,L]of[[[],none],[['rower'],row],[['rope'],rope]])for(const l of L)for(const w of l.slice(1)){const p=WPOOL.find(x=>x.k===w.k);if(p.nd&&!p.nd.some(s=>s.every(x=>g.includes(x))))res.gearBad.push(w.k)}
          S.profile=JSON.parse(keep);save();return res}""")
        NEEDG={'pullapart','aussenrot','bandrudern','hangstuetz'}
        chk(not r['gearBad'] and not (NEEDG & set(r['none'])) and not (NEEDG & set(r['nb'])) and r['noneFirst']==['march'] and r['rowFirst']==['rowint'] and 'armopen' in r['none'],
            f"Geräte beachtet: ohne Band/Stange keine Band- oder Hängeübung, ohne Crosstrainer Ersatz-Cardio (marschieren, Rudergerät) {r['gearBad']}")
        chk(540<=r['ropeSec'][0] and r['ropeSec'][1]<=660 and 540<=r['noneSec'][0] and r['noneSec'][1]<=660,f"auch mit Seil (3 min) und ohne Geräte ca. 10 min {r['ropeSec']} {r['noneSec']} {r['rope']}")
        chk({'pullapart','aussenrot','bandrudern','hangstuetz'} <= set(r['jo']),'mit Joschys Geräten kommen Band- und Hängeübungen vor')
        # 6) Animationen, Texte
        r=await pg.evaluate("""()=>{const bad=[],txt=[],blank=[];const c=document.createElement('canvas');c.style.cssText='width:200px;height:200px;position:fixed;left:0;top:0';document.body.appendChild(c);
          for(const w of WPOOL){if(!AN[w.an]){bad.push(w.k);continue}if(!(w.t&&w.b&&w.x&&w.n))txt.push(w.k);
            for(const g of ['m','f'])for(const cos of [null,'karate','box']){attachAnim(c,w.an,{g});c._cos=cos?{m:cos,f:cos}:null;const T=cycT(AN[w.an]);for(const f of [0,.5]){const now=performance.now();c._t0=now-f*T*1000;renderCanvas(c,now);
              const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=16)if(d[i]>0)n++;if(n<200)blank.push(w.k+g+cos)}RUN.delete(c)}}
          c.remove();return{bad,txt,blank,n:WPOOL.length}}""")
        chk(not r['bad'] and not r['txt'] and not r['blank'],f"alle {r['n']} Aufwärmübungen haben Animation (Mann/Frau, ohne/mit Kostüm), Anleitung, Atmung, Achtung {r['bad']} {r['txt']} {r['blank'][:4]}")
        # 8) JAI
        r=await pg.evaluate("()=>{const miss=WPOOL.filter(w=>!JAI_IDS.has(w.j)).map(w=>w.k);const seq=WPOOL.filter(w=>!JAI_IDS.has(w.j)).map(w=>jaiWarmSeq({...w,anim:w.an}).length);const ok=WPOOL.filter(w=>JAI_IDS.has(w.j)).every(w=>jaiWarmSeq({...w,anim:w.an})[0]===w.j);return{miss,seq,ok}}")
        print('   ohne JAI-Clip:',r['miss'])
        chk(all(x==0 for x in r['seq']) and r['ok'],'JAI: vorhandene Clips werden genutzt, ohne Clip bleibt JAI still')
        # 7) Hauptübungen gegen 3.12, 59 min
        p2=await ctx.new_page();await p2.goto(UR);await p2.wait_for_timeout(400);await p2.evaluate(PROFILE);await p2.wait_for_timeout(700)
        cur=await pg.evaluate(DUMP);ref=await p2.evaluate(DUMP);await p2.close()
        over=[(k,round(v[0]/60,1)) for k,v in cur.items() if v[0]>3540];less=[];diff=[]
        for k in cur:
            a_=cur[k][1];r_=ref[k][1]
            if [x[0] for x in a_]!=[x[0] for x in r_]:diff.append(k)
            for x,y in zip(a_,r_):
                if y[4] and (x[0]!=y[0] or x[1]!=y[1] or x[2:4]!=y[2:4]):less.append((k,x,y))
        chk(len(cur)==4608 and not over and not less and not diff,f'{len(cur)} Einheiten (Zyklen 1-8, 24 Geräte-Einstellungen, voll/kurz): Hauptübungen mit Sätzen/Wdh. exakt wie 3.12, gleiche Übungen, keine > 59 min {over[:2]} {less[:2]} {diff[:2]}')
        chk(not errs,'keine JS-Fehler '+str(errs[:3]))
        await b.close()
    print('RESULT',('ALL OK' if not fails else f'{len(fails)} FAILED'))
try: asyncio.run(main())
finally: srv.kill();srv2.kill()
sys.exit(1 if fails else 0)
