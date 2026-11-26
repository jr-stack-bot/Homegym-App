# Homegym 3.5 @ Joschy – t35: Extras (Kampfsport-Kostüme): Freischaltung per Kennwort (nur Hash im Code, tolerant bei
# Groß-/Kleinschreibung), freundliche Meldung bei falschem Kennwort, Speicherung in homegym.v1 (S.extras, idempotente Migration),
# Backup v5 mit Feld, alte Backups ohne Feld (echtes 3.2-Backup aus tests/fixtures/v32), "Zufällig pro Training", Vorschau.
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
_V32=_os.environ.get('HOMEGYM_V32',_os.path.join(_REPO,'tests','fixtures','v32'))
if not _os.path.isfile(_os.path.join(_V32,'index.html')):raise SystemExit('FEHLT: 3.2-Vergleichsstand '+_V32+'/index.html (siehe tests/fixtures/README.txt)')
import asyncio,subprocess,time,json,sys,re
from playwright.async_api import async_playwright
SH=_os.path.join(_SHOTS,'t35');_os.makedirs(SH,exist_ok=True)
srv=subprocess.Popen([sys.executable,'-m','http.server','8851','-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
old=subprocess.Popen([sys.executable,'-m','http.server','8852','-d',_V32],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U='http://127.0.0.1:8851/index.html?nosplash=1';UO='http://127.0.0.1:8852/index.html?nosplash=1'
PW=_os.environ.get('HOMEGYM_EXTRAS_PW','')  # Kennwort nicht im Repo: per Umgebungsvariable übergeben
if not PW:raise SystemExit('FEHLT: Umgebungsvariable HOMEGYM_EXTRAS_PW (Extras-Kennwort)')
fails=[]
def chk(c,msg):
    print(('ok   ' if c else 'FAIL ')+msg,flush=True);(None if c else fails.append(msg))
PROFILE="()=>{localStorage.clear();S=JSON.parse(JSON.stringify(DEF));S.profile={name:'Joschy',gear:[...JOSCHYGEAR],gearV:2,preset:'joschy'};S.settings.voiceMode='off';save();location.reload()}"
async def page(b,url=U,fresh=True):
    ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True);pg=await ctx.new_page()
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' and 'jai/' not in m.text and 'Failed to load' not in m.text else None)
    await pg.goto(url);await pg.wait_for_timeout(300)
    if fresh:
        async with pg.expect_navigation():await pg.evaluate(PROFILE)
        await pg.wait_for_timeout(400)
    return ctx,pg,errs
async def reload(pg):
    await pg.reload();await pg.wait_for_timeout(400)
RAW="()=>JSON.parse(localStorage.getItem(KEY)).extras"
DIFF="""([k,g,a,b])=>{const c=document.createElement('canvas');c.style.cssText='width:200px;height:220px';document.body.appendChild(c);const img=v=>{attachAnim(c,k,{g});RUN.delete(c);c._t0=0;if(v!==undefined)c._cos={[g]:v};c._done=false;renderCanvas(c,700);return c.getContext('2d').getImageData(0,0,c.width,c.height).data};
  const A=img(a),B=img(b);let n=0;for(let i=3;i<A.length;i+=4)if(Math.abs(A[i]-B[i])>40||Math.abs(A[i-1]-B[i-1])>40)n++;c.remove();return n}"""
async def main():
  html=open(_os.path.join(_OUTDIR,'index.html'),encoding='utf-8').read()
  chk(PW.lower() not in html.lower(),'Kennwort steht nicht im Klartext in index.html (nur als Hash)')
  async with async_playwright() as p:
    b=await p.chromium.launch()
    # ---- echtes 3.2-Backup (ohne extras) ----
    ctx,po,_=await page(b,UO)
    bk32=await po.evaluate("()=>{S.history=[{date:new Date(Date.now()-5*864e5).toISOString(),plan:'A',day:'A',week:1,dur:3000,unit:true,cyc:1,log:[{ex:'bench',sets:[{w:60,r:8,done:true}]}]}];save();return{ver:APP_VER,t:backupText()}}")
    await ctx.close();chk(bk32['ver']=='3.2' and '"extras"' not in bk32['t'],f"Fixture: Backup vom echten 3.2-Stand erzeugt (ohne Feld extras)")
    ctx,pg,errs=await page(b)
    r=await pg.evaluate("()=>({ver:APP_VER,bk:BK_VER,ex:JSON.parse(localStorage.getItem(KEY)).extras,pick:[cosPick(null,'m'),cosPick(null,'f')],n:COS_IDS.length,names:COS_IDS.map(k=>COSD[k].n)})")
    chk(r['ver']=='3.14' and r['bk']==5,f"Version 3.14, Backup-Format bleibt v{r['bk']}")
    chk(r['ex']=={'u':0,'m':'none','f':'none'} and r['pick']==[None,None],f"Neuer Stand: Extras gesperrt, kein Kostüm {r['ex']}")
    chk(r['n']==19 and len(set(r['names']))==19,f"19 Kostüme: {', '.join(r['names'])}")
    # ---- Einstellungen: Extras gesperrt, falsches Kennwort ----
    await pg.click('[data-tab=set]');await pg.wait_for_timeout(200)
    chk(await pg.locator('#exCard #exPw').count()==1 and await pg.locator('#exSelm').count()==0,'Einstellungen: Bereich „Extras“ mit Kennwortfeld, keine Kostümwahl vor der Freischaltung')
    await pg.locator('#exCard').scroll_into_view_if_needed();await pg.locator('#exCard').screenshot(path=SH+'/extras_locked.png')
    await pg.fill('#exPw',PW[:-1]+'x');await pg.click('#exGo');await pg.wait_for_timeout(150)
    m=await pg.locator('#exMsg').inner_text();ex=await pg.evaluate(RAW)
    chk('leider nicht' in m and ex['u']==0 and await pg.locator('#exSelm').count()==0,f"Falsches Kennwort: freundliche Meldung „{m}“, bleibt gesperrt")
    await pg.locator('#exCard').screenshot(path=SH+'/extras_wrong.png')
    await pg.fill('#exPw','');await pg.click('#exGo');await pg.wait_for_timeout(100)
    chk('Bitte' in await pg.locator('#exMsg').inner_text(),'Leeres Kennwort: Hinweis statt Fehler')
    tol=await pg.evaluate("p=>[exCheck(p.toUpperCase()),exCheck('  '+p.toLowerCase()+' '),exCheck(p.split('').map((c,i)=>i%2?c.toUpperCase():c.toLowerCase()).join('')),exCheck(p+'2'),exCheck('')]",PW)
    chk(tol==[True,True,True,False,False],f"Kennwort tolerant bei Groß-/Kleinschreibung und Leerzeichen {tol}")
    # ---- Freischalten ----
    await pg.fill('#exPw',PW.upper());await pg.click('#exGo');await pg.wait_for_timeout(300)
    ex=await pg.evaluate(RAW);n=await pg.locator('#exSelm option').count()
    chk(ex=={'u':1,'m':'none','f':'none'} and n==21 and await pg.locator('#exSelf option').count()==21,f"Freigeschaltet und gespeichert {ex}; je Mann/Frau 21 Optionen (Kein Kostüm, Zufällig, 19 Kostüme)")
    await reload(pg);await pg.click('[data-tab=set]');await pg.wait_for_timeout(200)
    chk(await pg.evaluate(RAW)=={'u':1,'m':'none','f':'none'} and await pg.locator('#exSelm').count()==1,'Freischaltung bleibt nach Neustart erhalten (einmalig)')
    await pg.select_option('#exSelm','samurai');await pg.select_option('#exSelf','sumo');await pg.wait_for_timeout(500)
    ex=await pg.evaluate(RAW);pk=await pg.evaluate("()=>[cosPick(null,'m'),cosPick(null,'f')]")
    chk(ex['m']=='samurai' and ex['f']=='sumo' and pk==['samurai','sumo'],f"Getrennte Wahl Mann/Frau gespeichert {ex}")
    pv=await pg.evaluate("()=>['m','f'].map(g=>{const c=$('#exCv'+g);const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>100)n++;return[c._key,c._cos[g],n]})")
    chk(all(x[0]=='squat' and x[2]>2000 for x in pv) and pv[0][1]=='samurai' and pv[1][1]=='sumo',f"Vorschau-Figuren animiert mit gewähltem Kostüm {pv}")
    await pg.locator('#exCard').scroll_into_view_if_needed();await pg.wait_for_timeout(300);await pg.locator('#exCard').screenshot(path=SH+'/extras_unlocked.png')
    d1=await pg.evaluate(DIFF,['squat','m','none','samurai']);d2=await pg.evaluate(DIFF,['squat','f',None,'none'])
    chk(d1>3000,f"Kostüm verändert die Figur sichtbar ({d1} px)")
    # ---- Migration idempotent ----
    r=await pg.evaluate("()=>{const a=exNorm({u:'x',m:'foo',f:'glad',z:1});const b=exNorm(a);return[a,b,exNorm(null),exNorm([1]),exNorm({u:true,m:'rand'})]}")
    chk(r[0]=={'u':0,'m':'none','f':'glad'} and r[1]==r[0] and r[2]=={'u':0,'m':'none','f':'none'} and r[3]==r[2] and r[4]=={'u':1,'m':'rand','f':'none'},f"exNorm tolerant und idempotent {r}")
    await pg.evaluate("()=>{const st=JSON.parse(localStorage.getItem(KEY));st.extras={u:1,m:'kaputt',f:'kendo'};localStorage.setItem(KEY,JSON.stringify(st))}")
    await reload(pg);a=await pg.evaluate("()=>localStorage.getItem(KEY)");await reload(pg);b2=await pg.evaluate("()=>localStorage.getItem(KEY)")
    chk(json.loads(a)['extras']=={'u':1,'m':'none','f':'kendo'} and a==b2,'Migration beim Start: kaputter Wert repariert, zweiter Start ändert nichts')
    # ---- Backup / Restore ----
    r=await pg.evaluate("""()=>{S.extras={u:1,m:'glad',f:'fecht'};save();const t=backupText();const d=JSON.parse(t);const p=parseBackup(t);const no=JSON.parse(t);delete no.state.extras;const p2=parseBackup(JSON.stringify(no));
      const bad=JSON.parse(t);bad.state.extras='x';const p3=parseBackup(JSON.stringify(bad));return{v:d.v,ex:d.state.extras,rt:p.st.extras,none:p2.st.extras,bad:p3.st.extras}}""")
    chk(r['v']==5 and r['ex']=={'u':1,'m':'glad','f':'fecht'} and r['rt']==r['ex'],f"Backup v5 enthält extras, Roundtrip unverändert {r['rt']}")
    chk(r['none']=={'u':0,'m':'none','f':'none'} and r['bad']==r['none'],'Backup ohne/mit kaputtem Feld: lesbar, Extras gesperrt')
    t=await pg.evaluate("()=>backupText()")
    await pg.evaluate("()=>{S.extras={u:0,m:'none',f:'none'};save()}")
    async with pg.expect_navigation():await pg.evaluate("t=>applyBackup(parseBackup(t).st)",t)
    await pg.wait_for_timeout(500);chk(await pg.evaluate(RAW)=={'u':1,'m':'glad','f':'fecht'},'Wiederherstellen: Freischaltung und Wahl kommen zurück')
    r=await pg.evaluate("t=>{const p=parseBackup(t);return{n:p.n,ex:p.st.extras,h:p.st.history.length}}",bk32['t'])
    chk(r['n']==1 and r['ex']=={'u':0,'m':'none','f':'none'},f"Altes 3.2-Backup lesbar: {r['n']} Einheit, Extras gesperrt")
    async with pg.expect_navigation():await pg.evaluate("t=>applyBackup(parseBackup(t).st)",bk32['t'])
    await pg.wait_for_timeout(500);r=await pg.evaluate("()=>({ex:JSON.parse(localStorage.getItem(KEY)).extras,h:S.history.length,pick:cosPick(null,'m')})")
    chk(r['ex']=={'u':0,'m':'none','f':'none'} and r['h']==1 and r['pick'] is None,f"3.2-Backup eingespielt: Verlauf da, Kostüme gesperrt {r}")
    # ---- Zufällig pro Training ----
    await pg.evaluate("()=>{S.extras={u:1,m:'rand',f:'rand'};S.session=null;S.yrun=null;save()}");await reload(pg)
    r=await pg.evaluate("()=>{startSession('A');const a=[cosPick(null,'m'),cosPick(null,'f')];const same=[...Array(30)].every(()=>cosPick(null,'m')===a[0]&&cosPick(null,'f')===a[1]);return{a,same,start:S.session.start}}")
    ids=await pg.evaluate("COS_IDS");await reload(pg);r2=await pg.evaluate("()=>[cosPick(null,'m'),cosPick(null,'f'),S.session&&S.session.start]")
    chk(r['same'] and r2[:2]==r['a'] and r2[2]==r['start'] and all(x in ids for x in r['a']),f"Zufällig: in der Einheit fest, auch nach Neustart {r['a']}")
    r=await pg.evaluate("()=>{const s=new Set();for(let i=0;i<24;i++){S.session.start=1700000000000+i*86400000+i*7;s.add(cosPick(null,'m'))}return s.size}")
    chk(r>=6,f"Zufällig: neue Einheiten bekommen wechselnde Kostüme ({r} verschiedene bei 24 Einheiten)")
    r=await pg.evaluate("()=>{S.session=null;save();yStart('quick');const a=cosPick(null,'f');const ok=[...Array(20)].every(()=>cosPick(null,'f')===a);const st=S.yrun.start;S.yrun=null;save();yClose();return{a,ok,st:!!st}}")
    chk(r['ok'] and r['st'],f"Zufällig: Yoga-Ablauf behält sein Kostüm ({r['a']})")
    d=await pg.evaluate("()=>{S.extras={u:1,m:'none',f:'none'};save();return 1}")
    d3=await pg.evaluate(DIFF,['deadlift','m',None,'none'])
    chk(d3==0,f"„Kein Kostüm“ zeichnet exakt wie ohne Freischaltung ({d3} px)")
    chk(not errs,f"keine JS-Fehler {errs[:3]}")
    await b.close()
  print('RESULT','ALL OK' if not fails else 'FAILS: '+'; '.join(fails))
try:asyncio.run(main())
finally:srv.kill();old.kill()
sys.exit(1 if fails else 0)  # 3.8: Exit-Code ungleich 0 bei FAIL
