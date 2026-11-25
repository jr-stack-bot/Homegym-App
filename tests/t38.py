# Homegym 3.8 @ Joschy – t38: Joschys Hanteln in den Animationen
# 1) Kurzhanteln (Set Gummi PRO): Maße je Gewicht, Animation zeigt das Gewicht des Satzes / zuletzt benutzt / Standard 10 kg,
#    Rand- und Bodenprüfung über alle Kurzhantel-Animationen beim größten Gewicht (20 kg), Mann/Frau, mit und ohne Kostüm.
# 2) Langhantel: Scheiben laut Scheiben-Rechner (größte innen), Bumper-Farben je Gewicht (Standard + eigene Farbe je Scheibe),
#    Stangenfarbe Silber/Gold/Abwechselnd pro Training (innerhalb einer Einheit gleich), Einstellungen, Speicherung, Backup v5,
#    Migration idempotent (auch 3.7-Backup).
# 3) App-Icon: Vordergrund ganz in der 66-dp-Safe-Zone; Start-Animation: zweiter Stern vor dem Ausblenden.
# Aufruf: python3 -I tests/t38.py  (HOMEGYM_OUT = Ordner mit index.html, Standard out/)
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
import asyncio,subprocess,time,sys,json,tempfile,zipfile,math
from PIL import Image
from playwright.async_api import async_playwright
_V37=tempfile.mkdtemp(prefix='hg37-')
with zipfile.ZipFile(_os.path.join(_REPO,'releases','Homegym-3.7.apk')) as z:open(_os.path.join(_V37,'index.html'),'wb').write(z.read('assets/index.html'))
srv=subprocess.Popen([sys.executable,'-m','http.server','8858','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
srv37=subprocess.Popen([sys.executable,'-m','http.server','8859','-d',_V37],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8858/index.html?nosplash=1';UR='http://127.0.0.1:8858/index.html';U37='http://127.0.0.1:8859/index.html?nosplash=1'
fails=[]
def chk(c,msg):
    print(('ok   ' if c else 'FAIL ')+msg);(None if c else fails.append(msg))
SET=[2.5,5,7.5,10,12.5,15,17.5,20]
# Herstellermaße (Ø Kopf, Gesamtlänge in cm), Griff 15 cm
DIMS={2.5:(13.5,26.5),5:(14.3,28),7.5:(14.3,31),10:(14.3,33),12.5:(14.3,35.5),15:(14.8,36.5),17.5:(15,38),20:(16,38)}
BASE="()=>({settings:{...DEF.settings,voiceMode:'off'},history:[],next:0,session:null,body:[],profile:{name:'Joschy',gear:[...JOSCHYGEAR],gearV:2,preset:'joschy',db37:1,weights:{db:JOSCHY_DB.slice(),kb:[8,12,16],band:[]}}})"
async def put(pg,js):
    async with pg.expect_navigation():await pg.evaluate("(st)=>{window.__hgLock=true;localStorage.setItem(KEY,JSON.stringify(st));location.reload()}",await pg.evaluate(js))
    await pg.wait_for_timeout(500)
async def reload(pg):
    async with pg.expect_navigation():await pg.evaluate("location.reload()")
    await pg.wait_for_timeout(500)
# Canvas-Hilfe: Animation an ein frisches Canvas hängen, ein Bild rendern, Gewichts-Kontext (ANW) zurückgeben
CV="""(a)=>{const cv=document.createElement('canvas');cv.style.cssText='width:300px;height:300px;display:block';document.body.appendChild(cv);
  attachAnim(cv,a.anim,{ex:a.ex,kg:a.kg,g:a.g||'m'});RUN.delete(cv);renderCanvas(cv,performance.now());const r={...ANW};cv.remove();return r}"""
EDGE="""()=>{const keys=[...new Set(Object.keys(EX).map(k=>[k,animOf(k)]).filter(([k,a])=>AN[a]&&(AN[a].eq||[]).some(e=>e.t==='db')).map(([k,a])=>a+'|'+k))].map(x=>x.split('|'));
 const seen=new Set();const res=[];const cid=Object.keys(COSD);let rec=null,trc=null;const ek=window.eqKit,df=window.drawFig0;
 window.eqKit=function(ctx,s,mini){const K=ek(ctx,s,mini);const db=K.dumbbell;K.dumbbell=function(h,dim,d,part,kg){const D=dbDims(kg);const off=D.off*s,rr=D.rr*s,th=D.th*s;const u=[-d[1],d[0]];
   for(const sg of(part==='near'?[1]:part==='far'?[-1]:[-1,1]))for(const q of[-1,1]){const c=[h[0]+d[0]*(sg*off+q*th/2),h[1]+d[1]*(sg*off+q*th/2)];const ex=Math.hypot(u[0]*rr,d[0]*rr*.5),ey=Math.hypot(u[1]*rr,d[1]*rr*.5);if(rec)rec.push({kg,b:[c[0]-ex,c[1]-ey,c[0]+ex,c[1]+ey]})}
   return db(h,dim,d,part,kg)};return K};
 window.drawFig0=function(ctx,def,o,tr,g,time,c){trc=tr;return df(ctx,def,o,tr,g,time,c)};
 try{for(const[a,ex]of keys){if(seen.has(a))continue;seen.add(a);const def=AN[a];
  for(const g of['m','f'])for(const cos of[null,0,3]){const cv=document.createElement('canvas');cv.style.cssText='width:300px;height:300px;display:block';document.body.appendChild(cv);
   attachAnim(cv,a,{ex,kg:20,g});RUN.delete(cv);cv._cos={[g]:cos==null?null:cid[cos]};const T=cycT(def);let minGap=1e9,minEdge=1e9,n=0,kgs=new Set();
   for(let i=0;i<40;i++){rec=[];trc=null;renderCanvas(cv,cv._t0+(i+.5)/40*T*1000/animSpd());const W=cv.clientWidth,H=cv.clientHeight;
     for(const r0 of rec){const r=r0.b;n++;kgs.add(r0.kg);minEdge=Math.min(minEdge,r[0],r[1],W-r[2],H-r[3]);if(trc&&trc.floor!=null)minGap=Math.min(minGap,trc.oy-trc.floor*trc.s-r[3])}}
   cv.remove();res.push({a,g,cos,n,kgs:[...kgs],minEdge,minGap:minGap>1e8?null:minGap})}}}finally{window.eqKit=ek;window.drawFig0=df}
 return res}"""
FACE="""()=>{const keys=[...new Set(Object.keys(EX).map(k=>animOf(k)).filter(a=>AN[a]&&AN[a].view!=="front"&&(AN[a].eq||[]).some(e=>e.t==="db"&&e.at==="hand")))];const out=[];
 for(const a of keys){const def=AN[a];for(const g of["m","f"]){const T=cycT(def);let worst=-1e9,wt=0;
  for(let i=0;i<80;i++){const t=(i+.5)/80*T;const o=animPose(def,t,g).o;const B=BODY[g];const e=def.eq.find(e=>e.t==="db");
   const u0=norm2(sub(o.sh,o.hip));let nF=[u0[1],-u0[0]];if(def.flip)nF=[-nF[0],-nF[1]];const face=nF[0]>=0?1:-1;
   let h=o.hand;const v=norm2(sub(h,o.elbow));h=add(h,[v[0]*B.hand*.25,v[1]*B.hand*.25]);const ds=e.dir?norm2(e.dir):CAM;const d=[ds[0],-ds[1]];const D=dbDims(20);
   const c=[h[0]+d[0]*D.off,h[1]+d[1]*D.off];let ov=-1e9;for(const fy of[.3,0,-.3,-.6,-.9])for(const fx of[.5,.8,1]){const m=add(o.head,[face*B.head*fx,B.head*fy]);ov=Math.max(ov,D.rr+.5-Math.hypot(c[0]-m[0],c[1]-m[1]))}if(ov>worst){worst=ov;wt=+t.toFixed(2)}}
  if(worst>0)out.push([a,g,+worst.toFixed(1),wt])}}return out}"""
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844});pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await pg.wait_for_timeout(500)
        v=await pg.evaluate("[APP_VER,BK_VER,JOSCHY_DB]");chk(v==['3.13',5,SET],f'Version 3.13, Backup-Format 5, Set {v}')
        await put(pg,BASE)
        # ---------- 1) Kurzhanteln ----------
        r=await pg.evaluate("(ks)=>ks.map(k=>{const L=dbLook(k),D=dbDims(k);return[L.D,L.W,D.rr,D.th,D.off]})",SET)
        chk(all(abs(r[i][0]-DIMS[k][0])<1e-9 and abs(r[i][1]-(DIMS[k][1]-15)/2)<1e-9 for i,k in enumerate(SET)),'Maße je Gewicht wie beim Hersteller (Ø Kopf, Kopfbreite = (Länge − 15 cm Griff) / 2)')
        chk(all(r[i+1][3]>=r[i][3] and r[i+1][2]>=r[i][2] for i in range(7)) and r[7][3]>1.9*r[0][3],'Köpfe wachsen mit dem Gewicht (Breite ×2 von 2,5 auf 20 kg, Durchmesser wächst mit)')
        seen=await pg.evaluate("""()=>{const out=[];const ek=window.eqKit;window.eqKit=function(c,s,m){const K=ek(c,s,m);const rh=K.rubberHead;K.dumbbell=function(h,dim,d,part,kg){out.push(kg);return ek(c,s,m).dumbbell(h,dim,d,part,kg)};return K};
          try{for(const kg of JOSCHY_DB){const cv=document.createElement('canvas');cv.style.cssText='width:300px;height:300px';document.body.appendChild(cv);attachAnim(cv,'curl',{ex:'curl',kg});RUN.delete(cv);renderCanvas(cv,performance.now());cv.remove()}}finally{window.eqKit=ek}
          return out}""")
        chk(sorted(set(seen))==SET,f'jede Hantel wird mit ihrem Gewicht gezeichnet {sorted(set(seen))}')
        r=await pg.evaluate(CV,{'anim':'dbbench','ex':'dbbench'});chk(r['db']==10 and not r['bb'],f"Bibliothek ohne Verlauf: Standard 10 kg {r['db']}")
        await pg.evaluate("()=>{S.history=[{date:new Date(Date.now()-864e5).toISOString(),plan:'A',day:'A',week:1,dur:3000,unit:true,log:[{ex:'dbbench',sets:[{w:12.5,r:10,done:true}]},{ex:'squat',sets:[{w:85,r:5,done:true}]}]}];save()}")
        r=await pg.evaluate(CV,{'anim':'dbbench','ex':'dbbench'});chk(r['db']==12.5,f"außerhalb des Trainings: zuletzt benutztes Gewicht 12,5 kg {r['db']}")
        await pg.evaluate("()=>{startSession('A');const ss=S.session;const i=ss.items.findIndex(x=>EX[x.ex].type==='db');ss.ei=i;ss.si=1;ss.phase='work';ss.log[i].sets.forEach((s,j)=>s.w=j===1?17.5:15);save();window.__dbEx=ss.items[i].ex}")
        ex=await pg.evaluate("window.__dbEx")
        r=await pg.evaluate(CV,{'anim':await pg.evaluate("animOf(window.__dbEx)"),'ex':ex});chk(r['db']==17.5,f"im Training: Gewicht des aktuellen Satzes ({ex}, Satz 2 = 17,5 kg) {r['db']}")
        await pg.evaluate("()=>{S.session=null;save()}")
        res=await pg.evaluate(EDGE)
        bad=[x for x in res if x['n']==0 or x['minEdge']<1 or (x['minGap'] is not None and x['minGap']<-1)]
        chk(len(res)>=200 and not bad and all(x['kgs']==[20] for x in res),f"Rand/Boden: {len(res)} Kurzhantel-Animationen (Mann/Frau, ohne/2 Kostüme) bei 20 kg ganz im Bild und nicht im Boden {[(x['a'],x['g'],x['cos'],round(x['minEdge'],1),x['minGap']) for x in bad][:6]}")
        r=await pg.evaluate(FACE)
        chk(not r,f'vorderer Hantelkopf bei 20 kg nie vor Gesicht, Mund oder Kinn (Goblet Squat, Drücken, Z-Press, Thruster …) {r}')
        src=open(_os.path.join(_REPO,'src','app.html'),encoding='utf-8').read();blk=src[src.find('function rubberHead'):src.find('function dumbbell(')]
        chk(blk and 'Gorilla' not in blk and 'fillText(t' in blk and 'rr*.9' in blk and 'pw=rr*.62' in blk,'Kurzhantel-Stirnseite: schwarz, Chrom-Ring außen, kleine rote Plakette mit Gewichtszahl, kein Herstellerlogo')
        # ---------- 2) Langhantel ----------
        r=await pg.evaluate("()=>[[40,60,100].map(w=>plateSplit(w).out),[25,20,15,10,5,2.5,1.25].map(plateHex),[25,20,15,10,5,2.5,1.25].map(plateRad)]")
        chk(r[0]==[[10],[20],[25,15]],f'Scheiben laut Scheiben-Rechner, größte innen: 40/60/100 kg -> {r[0]}')
        chk(r[1]==['#e0322b','#2f6be0','#f2bd2c','#2fb36a','#e8eef2','#2a2f35','#2a2f35'],f'Bumper-Standardfarben 25 rot, 20 blau, 15 gelb, 10 grün, 5 weiß, kleinere schwarz {r[1]}')
        chk(r[2][:4]==[1,1,1,1] and r[2][4]<1 and r[2][5]<r[2][4],f'voller Durchmesser ab 10 kg, darunter kleiner {r[2]}')
        stack=await pg.evaluate("""()=>{const out=[];const ek=window.eqKit;window.eqKit=function(c,s,m){const K=ek(c,s,m);const ps=K.plateStack;K.plateStack=function(h,r,list,d,near,gold){out.push({list:list.slice(),gold:!!gold,cols:list.map(plateHex)});return ps(h,r,list,d,near,gold)};return K};
          const run=(anim,kg,col)=>{const cv=document.createElement('canvas');cv.style.cssText='width:300px;height:300px';document.body.appendChild(cv);attachAnim(cv,anim,{ex:anim,kg,barCol:col});RUN.delete(cv);out.length=0;renderCanvas(cv,performance.now());cv.remove();return out.slice()};
          try{return{sq:run('squat',100,'gold'),bn:run('bench',60,'silver'),dl:run('deadlift',40,'gold'),lib:run('deadlift',undefined,'silver'),bare:run('bench',20,'silver')}}finally{window.eqKit=ek}}""")
        chk(stack['sq'] and stack['sq'][0]['list']==[25,15] and stack['sq'][0]['gold'] and stack['sq'][0]['cols']==['#e0322b','#f2bd2c'],f"Kniebeuge 100 kg, Gold: rot innen, gelb außen {stack['sq']}")
        chk(stack['bn'] and stack['bn'][0]['list']==[20] and not stack['bn'][0]['gold'],f"Bankdrücken 60 kg, Silber: eine blaue 20er je Seite {stack['bn']}")
        chk(stack['dl'] and stack['dl'][0]['list']==[10] and stack['dl'][0]['gold'],f"Kreuzheben 40 kg, Gold: grüne 10er {stack['dl']}")
        chk(stack['lib'] and stack['lib'][0]['list']==[20],f"ohne Gewicht: Standard 60 kg {stack['lib']}")
        chk(stack['bare'] and stack['bare'][0]['list']==[],f"20 kg = leere Stange {stack['bare']}")
        # Stangenfarbe: Standard abwechselnd pro Training, innerhalb einer Einheit gleich
        r=await pg.evaluate("""()=>{S.settings.barCol='alt';S.session=null;const h=S.history.slice();const o=[];
          S.history=[];o.push(barColOf());S.history=[h[0]];o.push(barColOf());S.history=[h[0],h[0]];o.push(barColOf());
          S.history=[h[0]];startSession('A');const a=barColOf();S.session.log[0].sets[0].done=true;S.history=[h[0],h[0]];const b=barColOf();save();
          S.settings.barCol='silver';const c=barColOf();S.settings.barCol='gold';const d=barColOf();S.settings.barCol='alt';S.history=[h[0]];S.session=null;save();return{o,a,b,c,d}}""")
        chk(r['o']==['silver','gold','silver'],f"Abwechselnd: Silber, Gold, Silber mit jedem Training {r['o']}")
        chk(r['a']=='gold' and r['b']=='gold',f"innerhalb einer Einheit bleibt die Farbe gleich {r['a']},{r['b']}")
        chk(r['c']=='silver' and r['d']=='gold','feste Wahl Silber / Gold')
        await reload(pg)
        chk(await pg.evaluate("S.settings.barCol")=='alt','Standard: Abwechselnd pro Training')
        await pg.evaluate("go('set')");await pg.wait_for_timeout(400)
        btn=await pg.query_selector('[data-barcol="gold"]');chk(btn is not None and len(await pg.query_selector_all('[data-barcol]'))==3,'Einstellungen: Wahl Silber / Gold / Abwechselnd pro Training')
        await btn.click();await pg.wait_for_timeout(300)
        await pg.select_option('#pcol5','#2a2f35');await pg.wait_for_timeout(300)
        await reload(pg)
        r=await pg.evaluate("[S.settings.barCol,S.settings.plateCol,plateHex(5),plateHex(25)]")
        chk(r[0]=='gold' and r[1]=={'5':'#2a2f35'} and r[2]=='#2a2f35' and r[3]=='#e0322b',f'gespeichert: Stange Gold, 5-kg-Scheibe schwarz {r}')
        bk=await pg.evaluate("backupText()");d=json.loads(bk)
        chk(d['v']==5 and d['state']['settings']['barCol']=='gold' and d['state']['settings']['plateCol']=={'5':'#2a2f35'},'Backup v5 enthält Stangen- und Scheibenfarben')
        await pg.evaluate("()=>{S.settings.barCol='alt';delete S.settings.plateCol;save()}")
        async with pg.expect_navigation():await pg.evaluate("(t)=>applyBackup(parseBackup(t).st)",bk)
        await pg.wait_for_timeout(600);r=await pg.evaluate("[S.settings.barCol,S.settings.plateCol]")
        chk(r==['gold',{'5':'#2a2f35'}],f'Backup wieder eingespielt {r}')
        r=await pg.evaluate("""()=>{const bad={app:'homegym',v:5,state:{history:[],settings:{barCol:'pink',plateCol:{'5':'red','x':'#123456','20':'#00ff00'}}}};const st=parseBackup(JSON.stringify(bad)).st;return[st.settings.barCol,st.settings.plateCol]}""")
        chk(r==['alt',{'20':'#00ff00'}],f'ungültige Werte im Backup werden bereinigt {r}')
        await pg.evaluate("go('set')");await pg.wait_for_timeout(300);await pg.click('#pcolReset');await pg.wait_for_timeout(300)
        chk(await pg.evaluate("S.settings.plateCol===undefined&&plateHex(5)==='#e8eef2'"),'Standardfarben wiederherstellen')
        # Migration: alter Stand (3.7) ohne Farben -> alt, idempotent; 3.7-Backup lesbar
        await put(pg,"()=>{const st=JSON.parse(JSON.stringify("+BASE[4:]+"));delete st.settings.barCol;return st}")
        raw1=await pg.evaluate("localStorage.getItem(KEY)");await pg.evaluate("save()");raw2=await pg.evaluate("localStorage.getItem(KEY)");await reload(pg);raw3=await pg.evaluate("localStorage.getItem(KEY)")
        chk(json.loads(raw2)['settings']['barCol']=='alt' and json.loads(raw2)==json.loads(raw3),'Migration: alter Stand bekommt "Abwechselnd", zweiter Start ändert nichts')
        p37=await ctx.new_page();await p37.goto(U37);await p37.wait_for_timeout(500)
        bk37=await p37.evaluate("(st)=>{localStorage.setItem(KEY,JSON.stringify(st));load();return backupText()}",await pg.evaluate(BASE));await p37.close()
        r=await pg.evaluate("(t)=>{const d=JSON.parse(t);const st=parseBackup(t).st;return[d.v,d.appVer,st.settings.barCol]}",bk37)
        chk(r==[5,'3.7','alt'],f'3.7-Backup (v5) lesbar, bekommt Standardfarbe {r}')
        # Geräteliste
        eq=await pg.evaluate("EQUIPMENT['Joschy Gym'].join(' | ')")
        chk('Olympia-Langhanteln (20 kg)' in eq and 'Silber' in eq and 'Gold' in eq,'Joschy Gym: 2 Olympia-Langhanteln (20 kg), Silber und Gold')
        chk(await pg.evaluate("+S.settings.bar")==20,'Stangengewicht bleibt 20 kg')
        # ---------- 3) Icon + Start-Animation ----------
        fg=Image.open(_os.path.join(_REPO,'android','res','mipmap-xxxhdpi','ic_launcher_foreground.png')).convert('RGBA');n=fg.size[0];a=fg.split()[3].load();c=n/2;lim=33/108*n;out=0
        for y in range(0,n,2):
            for x in range(0,n,2):
                if a[x,y]>40 and math.hypot(x+.5-c,y+.5-c)>lim:out+=1
        chk(out==0,f'Icon-Vordergrund ganz in der 66-dp-Safe-Zone ({out} Pixel außerhalb)')
        sp=await ctx.new_page();await sp.goto(UR);await sp.wait_for_timeout(120)
        r=await sp.evaluate("()=>{const s=[...document.querySelectorAll('#splash .splStar')].map(e=>getComputedStyle(e));return s.map(x=>[parseFloat(x.animationDelay),parseFloat(x.animationDuration),x.filter])}")
        await sp.close()
        chk(len(r)==2 and all(3.5<=x[0] and x[0]+x[1]<=4.1 and x[0]+.4*x[1]<4.0 for x in r) and r[0][0]<r[1][0] and 'drop-shadow' in r[1][2],f'Start-Animation (3.10): beide Sterne im Gold-Blitz 3,5–4 s, Höhepunkt vor dem Schriftzug, leuchten {r}')
        chk(not errs,f'keine JS-Fehler {errs[:3]}')
        await b.close()
asyncio.run(main());srv.terminate();srv37.terminate()
print('\nFEHLER:' if fails else '\nALLE OK',fails if fails else '')
sys.exit(1 if fails else 0)
