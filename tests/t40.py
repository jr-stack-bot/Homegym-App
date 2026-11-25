# Homegym 3.13 @ Joschy – t40: Aufwärmen 10 min, Crosstrainer zuerst, danach wechselnde Mobilisation passend zum Tag
# 1) Dauer ca. 10 min (±1) für jede Einheit, Kurz, mit/ohne Aufwärmsätze; Cardio (Crosstrainer bzw. Ersatz) immer zuerst
# 2) Abwechslung: Zähler je Tag (wie oft der Tag im Verlauf steht); am selben Tag nie derselbe Block zweimal hintereinander,
#    höchstens die Hälfte wiederholt (soweit der Pool reicht, auch ohne Geräte/Seil); 12 Einheiten je Tag mind. 8 verschiedene Blöcke
# 3) Auswahl passt zum Tag (Push: Schultern/Brust/BWS, Pull: Schulterblätter/Lat/Griff, Beine: Hüfte/Knie/Sprunggelenk/Gesäß)
# 4) Stabil beim Neuladen (in S.session gespeichert), auch wenn sich der Verlauf ändert
# 5) Geräte werden beachtet (Band, Klimmzugstange/Rack, Crosstrainer-Ersatz, ohne Geräte)
# 6) alle Aufwärmübungen haben Animation (Mann/Frau, mit/ohne Kostüm zeichnen etwas), Anleitung, Atmung, Achtung
# 7) gegen 3.12 (releases/Homegym-3.12.apk), Zyklen 1-8, 5 Gerätesets x Aufwärmsätze x KB x Pausen, voll/kurz, <= 59 min:
#    geschützt (Slot 0-2, Block-Steigerung, Grundübungen) exakt wie 3.12; Nebenübungen 2..Plan-Sätze, Reihenfolge gleich;
#    Bonus ganz oder gar nicht (nie 1 Satz); Griff-/Hang-Block unverändert; Kurztraining komplett wie 3.12
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
DUMP=r"""()=>{const M=/Kniebeuge|Bankdrück|Kreuzheb|Schulterdrück|Rudern|Klimmz|Chin-up/i;
 const BP=(d,k)=>{const v=new Set();let n=0;for(let w=1;w<=PROGRAM.length;w++)for(const it of dayDef(w,d).items)if(it[0]===k){n++;v.add(it.slice(1).join('/'))}return n>=2&&v.size>1};
 const keep=JSON.stringify(S);const o={};
 const G={joschy:[...JOSCHYGEAR],all:ALLGEAR,dbonly:["db","bench","band"],none:[],nokb:[...JOSCHYGEAR,"kb"]};
 for(const [gn,g] of Object.entries(G))for(const ws of [true,false])for(const km of [true,false])for(const rf of [.8,1,1.2])for(let c=1;c<=8;c++)for(let w=1;w<=4;w++)for(const d of DAYS)for(const q of [false,true]){
  S.profile={name:'J',gear:[...g],preset:'x',kbMix:km};S.settings.restF=rf;S.settings.warmSets=ws;S.prog={v:1,block:w,done:[],cycle:c,units:0,dlLeft:0,dlAt:4};S.history=[];if(S.hang)S.hang.base=null;
  const it=planItems(d,q,w);let ni=0;o[[gn,ws,km,rf,c,w,d,q].join('|')]=[estSecs(it,q),it.map(x=>{const i0=ni;const p=!x.fin&&(ni++<=2||M.test(EX[x.ex].n)||BP(d,x.orig||x.ex)||BP(d,x.ex));const pl=x.fin?null:((dayDef(w,d).items[i0]||[])[1]||null);return[x.ex,x.sets,x.lo,x.hi,p,x.fin?(x.blk?'blk':'fin'):'',pl]})]}
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
        # 2) Abwechslung: Zähler je Tag; gleicher Tag hintereinander nie identisch, höchstens die Hälfte gleich (soweit der Pool reicht)
        VAR="""(g)=>{const keep=JSON.stringify(S.profile);S.profile.gear=g;const res={};for(const d of DAYS){const L=wpPool(d);const B=[];for(let m=0;m<40;m++)B.push(warmList(false,true,d,m).slice(1).map(w=>w.k));
            const cnt=B[0].length;const eff=new Set(L.map(w=>w.g||w.k)).size;const lim=Math.max(Math.floor(cnt/2),2*cnt-eff);let same=0,over=0,maxov=0;
            for(let m=1;m<B.length;m++){const ov=B[m].filter(k=>B[m-1].includes(k)).length;maxov=Math.max(maxov,ov);if(B[m].join()===B[m-1].join())same++;if(ov>lim)over++}
            res[d]={pool:L.length,cnt,lim,maxov,same,over,dist12:new Set(B.slice(0,12).map(b=>b.join())).size,det:warmList(false,true,d,7).map(w=>w.k).join()===warmList(false,true,d,7).map(w=>w.k).join()}}
          S.profile=JSON.parse(keep);return res}"""
        for g,name in [('[...JOSCHYGEAR]','Joschy'),('[]','ohne Geräte'),('["rope"]','nur Seil'),('["db","bench","band"]','Nur Kurzhanteln')]:
            r=await pg.evaluate('()=>('+VAR+')('+g+')')
            ok=all(x['same']==0 and x['over']==0 and x['det'] for x in r.values()) and (name!='Joschy' or all(x['lim']==x['cnt']//2 and x['dist12']>=8 for x in r.values()))
            chk(ok,f"{name}: je Tag 40 Einheiten hintereinander nie gleich, Überschneidung mit dem letzten Block desselben Tags <= Grenze; Tag:(Pool,Anzahl,Grenze,max. gleich,verschieden in 12) {dict((k,(v['pool'],v['cnt'],v['lim'],v['maxov'],v['dist12'])) for k,v in r.items())}")
        r=await pg.evaluate("()=>{const s=new Set();for(let m=0;m<12;m++)s.add(warmList(false,true,'A',m)[1].k);const seq=[];for(let i=0;i<12;i++){const d=DAYS[i%3];seq.push(d+':'+warmList(false,true,d,Math.floor(i/3)).slice(1).map(w=>w.k).join(','))}return{first:s.size,seq}}")
        print('   12 Einheiten A/B/C:',*r['seq'],sep='\n     ')
        chk(r['first']>=3 and len(set(r['seq']))==12,f"12 aufeinanderfolgende Einheiten: 12 verschiedene Blöcke, wechselnde erste Übung ({r['first']})")
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
        await pg.evaluate("()=>{S.history.push({date:new Date().toISOString(),plan:'A',week:1,dur:3000,log:[]});save()}");await pg.reload();await pg.wait_for_timeout(700)
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
        over=[(k,round(v[0]/60,1)) for k,v in cur.items() if v[0]>3540];prot=[];side=[];fin1=[];blk=[];quick=[];nb=nb0=0
        for k in cur:
            a_=cur[k][1];r_=ref[k][1]
            if k.endswith('|true'):
                if a_!=r_:quick.append(k)
                continue
            if [x[:4] for x in a_ if x[4]]!=[x[:4] for x in r_ if x[4]]:prot.append(k)
            if [x[:4] for x in a_ if x[5]=='blk']!=[x[:4] for x in r_ if x[5]=='blk']:blk.append(k)
            rs=[x for x in r_ if not x[4] and not x[5]];it=iter([x[0] for x in rs])
            for x in [x for x in a_ if not x[4] and not x[5]]:
                y=next((y for y in rs if y[0]==x[0]),None)
                if y is None or x[2:4]!=y[2:4] or not 2<=x[1]<=max(y[1],y[6] or 0,2):side.append((k,x,y))  # höchstens wie im Plan (3.12 hatte evtl. schon gekürzt)
            if not all(any(e==z for z in it) for e in [x[0] for x in a_ if not x[4] and not x[5]]):side.append((k,'Reihenfolge'))
            fin1+=[(k,x) for x in a_ if x[5]=='fin' and x[1]<2]
            nf=sum(1 for x in a_ if x[5]=='fin');rf=sum(1 for x in r_ if x[5]=='fin');nb+=nf<rf;nb0+=nf==0<rf
        print(f'   Bonus gekürzt/gestrichen: {nb} von 5760 vollen Einheiten weniger Bonus-Übungen, {nb0} ganz ohne Bonus')
        chk(len(cur)==11520 and not over,f'{len(cur)} Einheiten (Zyklen 1-8, 5 Gerätesets x Aufwärmsätze x KB x Pausen, voll/kurz): keine > 59 min {over[:2]}')
        chk(not prot,f'geschützte Übungen (Slot 0-2, Block-Steigerung, Grundübungen) mit Sätzen/Wdh./Reihenfolge exakt wie 3.12 {prot[:3]}')
        chk(not side and not blk,f'Nebenübungen nur 2..Plan-Sätze (nie 1), gleiche Wdh. und Reihenfolge; Griff-/Hang-Block unverändert {side[:2]} {blk[:2]}')
        chk(not fin1,f'kein Bonus mit nur 1 Satz/Runde {fin1[:2]}')
        chk(not quick,f'Kurztraining: alle Kurz-Einheiten exakt wie 3.12 {quick[:3]}')
        chk(not errs,'keine JS-Fehler '+str(errs[:3]))
        await b.close()
    print('RESULT',('ALL OK' if not fails else f'{len(fails)} FAILED'))
try: asyncio.run(main())
finally: srv.kill();srv2.kill()
sys.exit(1 if fails else 0)
