# Homegym 3.0 @ Joschy – neue Auswertung: Muskelgruppen, 1RM, Kalender/Serien, Körpermaße, Monatsbericht
import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,subprocess,time,json,sys,os,math,random
from datetime import datetime,timedelta,date
from zoneinfo import ZoneInfo
from playwright.async_api import async_playwright
D=_SHOTS.rstrip('/')
PORT=8793
srv=subprocess.Popen([sys.executable,'-m','http.server',str(PORT),'-d',_OUTDIR],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL);time.sleep(1)
U=f'http://127.0.0.1:{PORT}/index.html'
TZ=ZoneInfo('Europe/Berlin')
THEMES=['arc','ironman','toxic','cyber','sunset','ice','stealth','day']
FAIL=[]
def chk(c,m):
    print(('ok   ' if c else 'FAIL ')+m)
    if not c:FAIL.append(m)

# ---------------- independent oracle (Python) ----------------
GROUP={'bench':'brust','ohpdb':'schulter','ohp':'schulter','feetpush':'brust','lateral':'schulter','pushdown':'trizeps','highplank':'rumpf','boxing':None,
       'pullup':'ruecken','chestrow':'ruecken','facepull':'schulter','curl':'bizeps','hammer':'bizeps','farmer':None,
       'squat':'vorn','rdl':'hinten','calf':'waden','plank':'rumpf','kneeraise':'rumpf','run':None,'deadlift':'hinten','hipthrust':'hinten'}
TYPE={'bench':'bar','ohpdb':'db','ohp':'bar','feetpush':'bw','lateral':'db','pushdown':'band','highplank':'time','boxing':'time','pullup':'bw','chestrow':'db','facepull':'band',
      'curl':'db','hammer':'db','farmer':'time','squat':'bar','rdl':'db','calf':'db','plank':'time','kneeraise':'bw','run':'time','deadlift':'bar','hipthrust':'bar'}
NAME={'squat':'Kniebeuge','bench':'Bankdrücken','deadlift':'Kreuzheben','ohp':'Schulterdrücken stehend'}
GL=[('brust','Brust'),('ruecken','Rücken'),('schulter','Schultern'),('bizeps','Bizeps'),('trizeps','Trizeps'),('vorn','Beine vorn'),('hinten','Beine hinten/Gesäß'),('waden','Waden'),('rumpf','Bauch/Rumpf')]
MAIN=['squat','bench','deadlift','ohp']
def jround1(v):return math.floor(v*10+.5)/10
def f1(v):
    r=jround1(v);s=f"{abs(r):,.1f}".replace(',','X').replace('.',',').replace('X','.')
    if s.endswith(',0'):s=s[:-2]
    return ('-' if r<0 else '')+s
def fsign(v,u=''):
    r=jround1(v);return ('+' if r>0 else '−' if r<0 else '±')+f1(abs(r))+(' '+u if u else '')
def fkg_int(v):return f"{int(math.floor(v+.5)):,}".replace(',','.')
def fdur(sec):
    m=math.floor(sec/60+.5);h=m//60;return f"{h} Std. {m%60} Min." if h else f"{m} Min."
def done(s):return s.get('done',True) is not False
def e1(ex,s):
    if TYPE[ex] not in('bar','db') or not done(s):return None
    w,r=s['w'],s['r']
    return w*(1+r/30) if w>0 and 1<=r<=12 else None
def wstart(d):return d-timedelta(days=d.weekday())
def ldt(iso):return datetime.fromisoformat(iso.replace('Z','+00:00')).astimezone(TZ)

def gen(now,weeks=27,seed=7,long=False):
    rnd=random.Random(seed);hist=[];yoga=[];body=[];meas=[]
    today=now.date();w0=wstart(today)-timedelta(weeks=weeks-1)
    for wi in range(weeks):
        ws=w0+timedelta(weeks=wi);block=wi%4+1
        if not long and wi in(5,12):continue
        days=[(0,'A'),(2,'B'),(4,'C')]
        if not long and wi in(8,17):days=[(2,'B')]
        if long:days=[(0,'A'),(1,'B'),(2,'C'),(3,'A'),(4,'B'),(5,'C')]
        for dd,plan in days:
            dt=datetime(ws.year,ws.month,ws.day,18,0,tzinfo=TZ)+timedelta(days=dd,minutes=rnd.randint(-40,40))
            if dt>=now-timedelta(minutes=5):continue
            quick=(not long and wi in(10,20) and plan=='C')
            hist.append(rec(dt,plan,block,wi,quick,rnd))
        if not long and wi==15:
            dt=datetime(ws.year,ws.month,ws.day,20,30,tzinfo=TZ)+timedelta(days=2)
            if dt<now:hist.append(rec(dt,'A',block,wi,True,rnd))
        sun=datetime(ws.year,ws.month,ws.day,9,0,tzinfo=TZ)+timedelta(days=6)
        if wi>=2 and wi%2==0 and sun<now:
            k=['plan','quick','post','repeat'][wi//2%4];yoga.append({'date':sun.astimezone(ZoneInfo('UTC')).strftime('%Y-%m-%dT%H:%M:%S.000Z'),'kind':k,'week':(wi//2) if k in('plan','repeat') else None,'dur':600+wi*13,'n':8})
        if wi==14:
            wd=datetime(ws.year,ws.month,ws.day,7,0,tzinfo=TZ)+timedelta(days=2)
            yoga.append({'date':wd.astimezone(ZoneInfo('UTC')).strftime('%Y-%m-%dT%H:%M:%S.000Z'),'kind':'post','week':None,'dur':300,'n':5})
        bd=ws+timedelta(days=6)
        if bd<=today:body.append({'d':bd.isoformat(),'kg':round(80+0.07*wi+(0.3 if wi%3==0 else 0),1)})
    m=date(today.year,today.month,1)
    for k in range(6,-1,-1):
        mm=(m.month-1-k)%12+1;yy=m.year+((m.month-1-k)//12);d=date(yy,mm,2)
        if d>today:continue
        e={'d':d.isoformat(),'brust':round(100+0.4*k*-1+5,1),'arm':round(36+0.25*(6-k),1),'taille':round(88-0.3*(6-k),1)}
        if k!=3:e['bein']=round(58+0.2*(6-k),1)
        meas.append(e)
    # one entry stored out of order (older date at the end), as can happen after restores
    if len(hist)>10:x=hist.pop(3);hist.append(x)
    return hist,yoga,body,meas

def rec(dt,plan,block,wi,quick,rnd):
    def S(w,rs,old=False):return [({'w':w,'r':r} if old else {'w':w,'r':r,'done':True}) for r in rs]
    old=wi<3
    if plan=='A':
        L=[('bench',S(round((60+1.25*wi)/2.5)*2.5,[8,8,7,6],old)),
           ('ohp',S(40+0.5*(wi//3)*2.5,[6,6,5],old)) if wi%3==0 else ('ohpdb',S(16+wi//4,[10,10,9],old)),
           ('feetpush',S(0,[12,11,10],old)),('lateral',S(8,[15,14,12],old)),('pushdown',S(0,[15,15,12],old)),('highplank',S(0,[30,35],old)),('boxing',S(0,[60,60,60],old))]
        L[0][1].append({'w':62.5,'r':5,'done':False})   # not done -> ignored
    elif plan=='B':
        L=[('pullup',S(0,[8,7,6,min(6,4+wi%4)],old)),('chestrow',S(20+0.5*wi,[10,10,9],old)),('facepull',S(0,[15,15],old)),('curl',S(12,[10,9,8+(wi%3)],old)),('hammer',S(12,[10,10],old)),('farmer',S(0,[40,40],old))]
    else:
        L=[('squat',S(round((80+1.25*wi+(rnd.choice([0,0,2.5,-2.5])))/2.5)*2.5,[8,8,7,7],old)+[{'w':0,'r':10,'done':True}]),('rdl',S(24+0.5*wi,[10,10,10],old)),('calf',S(20,[15,15,15],old)),
           ('plank',S(0,[45,45+wi],old)),('kneeraise',S(0,[10,10],old)),('run',S(0,[30,30,30,30],old))]
        if wi%4==1:L.insert(1,('deadlift',S(100+1.5*wi,[5,5,5],old)))
        if wi%4==3:L.insert(2,('hipthrust',S(60+wi,[10,10,13],old)))
    if quick:L=[(k,s[:2]) for k,s in L[:3]]
    log=[]
    for k,s in L:
        o={'ex':k,'sets':s}
        if wi>=6 and k in('bench','squat','pullup'):o['eff']=['easy','ok','hard'][wi%3]
        log.append(o)
    r={'date':dt.astimezone(ZoneInfo('UTC')).strftime('%Y-%m-%dT%H:%M:%S.000Z'),'plan':plan,'dur':2400+rnd.randint(0,2400),'log':log}
    if wi>=2:r['week']=block
    if wi>=6:r.update({'day':plan,'unit':not quick,'cyc':1+wi//12})
    if quick:r['quick']=True
    if wi==9 and plan=='C':r['deload']=True
    if wi==7 and plan=='A':r['warmup']=[{'ex':'bench','sets':[{'w':25,'r':8,'p':.4},{'w':37.5,'r':5,'p':.6}]}]
    return r

def oracle(now,hist,yoga,body,meas):
    ses=[]
    for i,h in enumerate(hist):
        t=ldt(h['date']);g={};rm={};sc={};sets=0;vol=0
        for l in h['log']:
            ex=l['ex']
            for s in l['sets']:
                if not done(s):continue
                sets+=1
                if GROUP[ex]:g[GROUP[ex]]=g.get(GROUP[ex],0)+1
                if TYPE[ex]!='time':vol+=s['w']*s['r']
                v=e1(ex,s) if TYPE[ex] in('bar','db') else (s['r'] if s['r']>0 else None)
                if v is None:continue
                if TYPE[ex] in('bar','db'):rm[ex]=max(rm.get(ex,0),v)
                sc[ex]=max(sc.get(ex,0),v)
        ses.append(dict(i=i,t=t,ws=wstart(t.date()),mon=(t.year,t.month),plan=h['plan'],quick=bool(h.get('quick')),dur=h['dur'],sets=sets,vol=vol,g=g,rm=rm,sc=sc,prs=[]))
    ses.sort(key=lambda s:(s['t'],s['i']))
    best={}
    for s in ses:
        for k,v in s['sc'].items():
            if k in best and v>best[k]+.01:s['prs'].append((k,v))
            best[k]=max(best.get(k,v),v)
    wk={}
    for s in ses:wk.setdefault(s['ws'],[]).append(s)
    cw=wstart(now.date())
    def gw(ws):
        g={}
        for s in wk.get(ws,[]):
            for k,v in s['g'].items():g[k]=g.get(k,0)+v
        return g
    weeks8=[cw-timedelta(weeks=7-i) for i in range(8)]
    O={'ses':ses,'cur':gw(cw),'w8':{k:[gw(w).get(k,0) for w in weeks8] for k,_ in GL},'weeks8':weeks8}
    first=ses[0]['ws'];W=[cw-timedelta(weeks=4-i) for i in range(4)];W=[w for w in W if w>=first]
    O['W4avg']={k:(sum(gw(w).get(k,0) for w in W)/len(W) if len(W)>=2 else None) for k,_ in GL}
    ok=lambda w:len(wk.get(w,[]))>=2
    cur=0;w=cw
    if not ok(w):w-=timedelta(weeks=1)
    while ok(w):cur+=1;w-=timedelta(weeks=1)
    bestrun=0;run=0;prev=None
    for w in sorted(x for x in wk if ok(x)):
        run=run+1 if prev is not None and w-prev==timedelta(weeks=1) else 1;bestrun=max(bestrun,run);prev=w
    O['streak']=(cur,max(bestrun,cur))
    def rminfo(k):
        pts=[(s['t'],s['rm'][k]) for s in ses if k in s['rm']]
        if not pts:return None
        b=pts[0]
        for p in pts:
            if p[1]>b[1]+1e-9:b=p
        a=now-timedelta(days=28);a2=now-timedelta(days=56)
        cur=max([v for t,v in pts if t>=a],default=None);prev=max([v for t,v in pts if a2<=t<a],default=None)
        if prev is None:
            old=[v for t,v in pts if t<a]
            if old:prev=old[-1]
        return dict(best=b,last=pts[-1],d4=None if cur is None or prev is None else cur-prev,n=len(pts))
    O['rm']={k:rminfo(k) for k in ['squat','bench','deadlift','ohp','chestrow','rdl','ohpdb']}
    def month(y,m):
        ms=[s for s in ses if s['mon']==(y,m)];ys=[x for x in yoga if (ldt(x['date']).year,ldt(x['date']).month)==(y,m)]
        g={}
        for s in ms:
            for k,v in s['g'].items():g[k]=g.get(k,0)+v
        py,pm=(y,m-1) if m>1 else (y-1,12)
        rm={}
        for k in MAIN:
            b=max([s['rm'][k] for s in ms if k in s['rm']],default=None)
            if b is None:continue
            p=max([s['rm'][k] for s in ses if s['mon']==(py,pm) and k in s['rm']],default=None)
            if p is None:
                older=[s['rm'][k] for s in ses if s['mon']<(y,m) and k in s['rm']]
                p=older[-1] if older else None
            rm[k]=(b,None if p is None else b-p)
        def md(lst,val):
            key=f"{y:04d}-{m:02d}";inm=[x for x in lst if x['d'][:7]==key and val(x) is not None]
            if not inm:return None
            bef=[x for x in lst if x['d'][:7]<key and val(x) is not None];base=bef[-1] if bef else inm[0];last=inm[-1]
            return (val(last),None if base is last else val(last)-val(base))
        return dict(n=len(ms),q=sum(s['quick'] for s in ms),dur=sum(s['dur'] for s in ms),vol=sum(s['vol'] for s in ms),yoga=len(ys),ydur=sum(x['dur'] for x in ys),
                    prs=sum(len(s['prs']) for s in ms),g=g,rm=rm,body=md(body,lambda x:x['kg']),meas={k:md(meas,lambda x,k=k:x.get(k)) for k in['brust','arm','taille','bein']})
    O['month']=month
    cal={}
    for s in ses:cal.setdefault(s['t'].date().isoformat(),[]).append('K' if s['quick'] else s['plan'])
    ycal={}
    for x in yoga:ycal.setdefault(ldt(x['date']).date().isoformat(),[]).append(x)
    O['cal']=cal;O['ycal']=ycal
    return O

HELP="""()=>{window.T={
 put:st=>{window.__hgLock=true;localStorage.setItem(KEY,JSON.stringify(st));location.reload()},
 base:()=>({settings:{...DEF.settings,voiceMode:'off'},history:[],next:0,session:null,protein:{d:'',g:0,log:[]},body:[],profile:{name:'Joschy',gear:[...JOSCHYGEAR],gearV:2,preset:'joschy'}}),
 ov:()=>{const W=document.documentElement.clientWidth;const bad=[];const root=document.querySelector('#v-hist:not([hidden])')||document.querySelector('#sheet');
   const sw=Math.max(document.documentElement.scrollWidth,document.body.scrollWidth);if(sw>W+1)bad.push('page '+sw);
   for(const r of [document.querySelector('#v-hist'),document.querySelector('#sheetBg:not([hidden]) #sheet')]){if(!r||r.hidden||r.offsetParent===null&&r.id!=='sheet')continue;
     for(const e of r.querySelectorAll('*')){const b=e.getBoundingClientRect();if(!b.width)continue;const cs=getComputedStyle(e);if(cs.position==='fixed')continue;
       if(b.right>W+.5||b.left<-.5)bad.push((e.id||e.className||e.tagName)+' x '+Math.round(b.left)+'-'+Math.round(b.right));
       if(!e.children.length&&e.clientWidth&&e.scrollWidth>e.clientWidth+1&&cs.overflow!=='hidden'&&e.tagName!=='SELECT'&&e.tagName!=='INPUT')bad.push((e.id||e.className||e.tagName)+' text '+e.scrollWidth+'>'+e.clientWidth+' '+e.textContent.slice(0,30));
       if(e.closest('.subtabs')&&e.tagName==='BUTTON'&&e.scrollWidth>e.clientWidth+1)bad.push('subtab cut '+e.textContent)}}
   return bad.slice(0,8)}
}}"""
async def boot(pg):
    await pg.wait_for_timeout(450);await pg.evaluate(HELP)
async def put(pg,st):
    async with pg.expect_navigation():await pg.evaluate("st=>T.put(st)",st)
    await boot(pg)
async def sub(pg,k):
    await pg.click(f'[data-hs="{k}"]');await pg.wait_for_timeout(120)
async def txt(pg,sel):return (await pg.inner_text(sel)).strip()

async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();ctx=await b.new_context(viewport={'width':390,'height':844},timezone_id='Europe/Berlin',locale='de-DE');pg=await ctx.new_page()
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await boot(pg)
        r=await pg.evaluate("[APP_VER,BK_VER,document.querySelector('#verLine')?1:0]");chk(r[:2]==['3.0',5],'version 3.0 / backup format 5 '+str(r))

        # ===== 0) empty state =====
        await put(pg,await pg.evaluate("T.base()"))
        await pg.evaluate("go('hist')");await pg.wait_for_timeout(150)
        empt={}
        for k in['kraft','muskeln','kalender','koerper','bericht']:
            await sub(pg,k);empt[k]=await txt(pg,'#hsub')
        chk('Noch keine Daten' in empt['kraft'] and 'Noch keine Trainings gespeichert' in empt['kraft'],'empty: Kraft friendly')
        chk('Noch keine Daten' in empt['muskeln'],'empty: Muskeln friendly')
        chk('Noch keine Daten in diesem Monat' in empt['kalender'] and '0' in await txt(pg,'#stCur') if False else 'Noch keine Daten' in empt['kalender'],'empty: Kalender friendly')
        chk('Noch keine Daten' in empt['koerper'],'empty: Körpermaße friendly')
        chk('Noch keine Daten für' in empt['bericht'],'empty: Bericht friendly')
        await pg.screenshot(path=f'{D}/empty_bericht.png',full_page=True)

        # ===== 1) synthetic 6-month history =====
        now=datetime.now(TZ)
        hist,yoga,body,meas=gen(now)
        O=oracle(now,hist,yoga,body,meas)
        print('sessions',len(hist),'yoga',len(yoga),'body',len(body),'meas',len(meas))
        st=await pg.evaluate("T.base()");st.update(history=hist,body=body,meas=meas,yoga={'start':None,'done':{},'log':yoga})
        await put(pg,st)
        await pg.evaluate("go('hist')");await pg.wait_for_timeout(200)
        chk(await pg.evaluate("HSUB")=='kraft' and await pg.evaluate("!!$('#rmCard')&&$('#rmCard').getBoundingClientRect().top<400"),'Kraft is the default sub-tab, 1RM card on top')
        # --- 1RM per exercise ---
        for k in['squat','bench','deadlift','ohp','chestrow']:
            I=O['rm'][k]
            await pg.select_option('#rmSel',k);await pg.wait_for_timeout(120)
            got=[await txt(pg,'#rmBest'),await txt(pg,'#rmLast'),await txt(pg,'#rmD4')]
            exp=[f1(I['best'][1])+' kg',f1(I['last'][1])+' kg','–' if I['d4'] is None else fsign(I['d4'])+' kg']
            chk(got==exp,f'1RM {k}: {got} == {exp}')
        r=await pg.evaluate("()=>[...$('#rmSel').querySelectorAll('optgroup')].map(g=>g.label+':'+[...g.children].map(o=>o.value).join(','))")
        chk(r[0]=='Hauptübungen:squat,bench,deadlift,ohp' and 'pullup' not in r[1] and 'lateral' in r[1],f'1RM selector: main lifts first, only weighted exercises {r}')
        chk('geschätzt' in (await txt(pg,'#rmCard')).lower() and 'epley' in (await txt(pg,'#rmCard')).lower(),'1RM marked as geschätzt (Epley)')
        r=await pg.evaluate("()=>{const c=$('#rmChart');const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let n=0;for(let i=3;i<d.length;i+=4)if(d[i]>0)n++;return n}")
        chk(r>2000,f'1RM chart drawn ({r} px)')
        # lateral: 8 kg x 15/14/12 -> only 12 reps count
        await pg.select_option('#rmSel','lateral');await pg.wait_for_timeout(100)
        chk(await txt(pg,'#rmBest')==f1(8*(1+12/30))+' kg','1RM only from sets with 1–12 reps (lateral 8×12)')
        await pg.screenshot(path=f'{D}/kraft_arc.png',full_page=True)

        # --- Muskeln ---
        await sub(pg,'muskeln')
        cur={k:int(await txt(pg,f'#mgNow [data-mg="{k}"] .mgv')) for k,_ in GL}
        chk(cur=={k:O['cur'].get(k,0) for k,_ in GL},f'sets per group this week {cur}')
        w8={k:[0 if t=='·' else int(t) for t in await pg.eval_on_selector_all(f'#mgHist [data-mgh="{k}"] .c','els=>els.map(e=>e.textContent)')] for k,_ in GL}
        chk(w8==O['w8'],'sets per group, last 8 weeks')
        if w8!=O['w8']:print(w8,'\n',O['w8'])
        kws=await pg.eval_on_selector_all('#mgHist .mgh span','els=>els.slice(1).map(e=>+e.textContent)')
        chk(kws==[w.isocalendar()[1] for w in O['weeks8']],f'ISO week numbers {kws}')
        # 3.0 fix: target = Plan-Soll from the user's own plan (sets per run A+B+C, current block + gear); warn only below ~70 % of 2 units/week
        soll=await pg.evaluate("mgSoll()")
        O['low']=[l for k,l in GL if O['W4avg'][k] is not None and soll.get(k,0)>0 and O['W4avg'][k]<.7*(2/3)*soll[k]]
        lowtxt=await txt(pg,'#mgLow') if await pg.query_selector('#mgLow') else ''
        chk(all(l in lowtxt for l in O['low']) and all((l not in lowtxt) for k,l in GL if l not in O['low']),f'low-volume hint vs Plan-Soll {O["low"]} | {lowtxt[:120]}')
        chk(all(f'Soll laut Plan: {soll[k]} Sätze pro Durchgang' in lowtxt for k,l in GL if l in O['low']),'low hint names the Soll laut Plan per run')
        mx=max([24]+[O['cur'].get(k,0) for k,_ in GL]+[soll.get(k,0) for k,_ in GL])
        zs=await pg.evaluate("()=>[...document.querySelectorAll('#mgNow .mgrow')].map(r=>{const z=r.querySelector('.zone');if(!z)return[r.dataset.mg,null];const b=z.parentElement.getBoundingClientRect(),q=z.getBoundingClientRect();return[r.dataset.mg,[(q.left-b.left)/b.width,(q.right-b.left)/b.width]]})")
        bad=[(k,z) for k,z in zs if (z is None)!=(soll.get(k,0)==0) or (z and (abs(z[1]-soll[k]/mx)>.02 or abs(z[0]-round(soll[k]*2/3)/mx)>.02))]
        chk(not bad and any(z for k,z in zs),f'marker = Plan-Soll per group (right edge 1 run, left edge 2 units/week) {bad[:3]} soll={soll}')
        info=await txt(pg,'#mgNow')
        chk('10–20' in info and 'Richtwert' in info and 'Zielbereich' not in info,'10–20 only as info line, no warning wording')
        await pg.screenshot(path=f'{D}/muskeln_arc.png',full_page=True)

        # --- Kalender ---
        await sub(pg,'kalender')
        chk([await txt(pg,'#stCur'),await txt(pg,'#stBest')]==[str(O['streak'][0]),str(O['streak'][1])],f'streaks cur/best {O["streak"]}')
        months_checked=0
        for back in range(0,4):
            if back:await pg.click('#calNav [data-mn="-1"]');await pg.wait_for_timeout(100)
            cells=await pg.evaluate("()=>[...document.querySelectorAll('.cal .cday:not(.pad)')].map(e=>({k:e.dataset.cd||null,d:+e.querySelector('.cdn').textContent,ck:(e.querySelector('.ck')||{}).textContent||'',y:!!e.querySelector('.cy'),btn:e.tagName==='BUTTON',cls:e.className}))")
            mname=await txt(pg,'#calNav .mname');y0=now.year;m0=now.month-back
            while m0<1:m0+=12;y0-=1
            bad=[]
            for c in cells:
                k=f"{y0:04d}-{m0:02d}-{c['d']:02d}";ex=O['cal'].get(k,[]);ey=k in O['ycal']
                expck=''.join(ex[:2])+('+' if len(ex)>2 else '')
                if c['ck']!=expck or c['y']!=ey or c['btn']!=(bool(ex) or ey):bad.append((k,c,ex,ey))
                if ex and ('p'+ex[0]) not in c['cls'].split():bad.append(('cls',k,c['cls']))
            chk(not bad and len(cells)>=28,f'calendar {mname}: marks A/B/C/K + yoga match {bad[:2]}')
            months_checked+=1
        # tap a day with one strength session -> session sheet; a day with session + yoga -> day sheet
        await pg.evaluate("()=>{calM=thisMonth();renderHsub()}")
        multi=[k for k in O['ycal'] if k in O['cal']]
        single=[k for k,v in O['cal'].items() if len(v)==1 and k not in O['ycal'] and k[:7]==now.strftime('%Y-%m')]
        if single:
            await pg.click(f'[data-cd="{single[-1]}"]');await pg.wait_for_timeout(150)
            t=await txt(pg,'#sheet');chk(('Training '+O['cal'][single[-1]][0]) in t or 'Kurz' in t,'tap day -> shows the session '+t[:60].replace('\n',' '))
            await pg.evaluate("closeSheet()")
        if multi:
            k=multi[0];await pg.evaluate("k=>{const[y,m]=k.split('-').map(Number);calM=new Date(y,m-1,1).getTime();renderHsub()}",k);await pg.wait_for_timeout(100)
            await pg.click(f'[data-cd="{k}"]');await pg.wait_for_timeout(150)
            t=await txt(pg,'#sheet');chk('Dehnen nach dem Training' in t and t.count('Sätze')==len(O['cal'][k]),'tap day with training + yoga -> day sheet lists both')
            await pg.screenshot(path=f'{D}/kalender_day_arc.png');await pg.evaluate("closeSheet()")
        await pg.evaluate("()=>{calM=thisMonth();renderHsub()}");await pg.wait_for_timeout(100)
        await pg.screenshot(path=f'{D}/kalender_arc.png',full_page=True)
        chk(await pg.evaluate("$('#calNav [data-mn=\"1\"]').disabled"),'calendar: no navigation into the future')

        # --- Bericht ---
        await sub(pg,'bericht')
        for back in(1,2,0):
            await pg.evaluate("b=>{const d=new Date();repM=new Date(d.getFullYear(),d.getMonth()-b,1).getTime();renderHsub()}",back);await pg.wait_for_timeout(120)
            y0=now.year;m0=now.month-back
            while m0<1:m0+=12;y0-=1
            M=O['month'](y0,m0);mn=await txt(pg,'#repNav .mname')
            got=dict(n=await txt(pg,'[data-r="n"] .num'),dur=await txt(pg,'[data-r="dur"] .num'),vol=await txt(pg,'[data-r="vol"] .num'),yoga=await txt(pg,'[data-r="yoga"] .num'),prs=await txt(pg,'[data-r="prs"]'))
            exp=dict(n=str(M['n']),dur=fdur(M['dur']),vol=fkg_int(M['vol'])+' kg',yoga=str(M['yoga']),prs=str(M['prs']))
            chk(got==exp,f'report {mn}: {got} == {exp}')
            g={k:int(await txt(pg,f'[data-rmg="{k}"] .num')) for k,_ in GL}
            chk(g=={k:M['g'].get(k,0) for k,_ in GL},f'report {mn}: sets per group')
            rm={}
            for e in await pg.query_selector_all('[data-rrm]'):rm[await e.get_attribute('data-rrm')]=(await e.inner_text()).replace('\n',' ').strip()
            erm={k:f"{NAME[k]} {f1(v)} kg"+('' if d is None else ' '+fsign(d,'kg')) for k,(v,d) in M['rm'].items()}
            chk({k:' '.join(v.split()) for k,v in rm.items()}=={k:' '.join(v.split()) for k,v in erm.items()},f'report {mn}: 1RM main lifts {rm} == {erm}')
            bd={}
            for e in await pg.query_selector_all('[data-rb]'):bd[await e.get_attribute('data-rb')]=' '.join((await e.inner_text()).split())
            eb={}
            lab={'kg':'Körpergewicht','brust':'Brust','arm':'Oberarm','taille':'Taille','bein':'Oberschenkel'}
            for k,v in [('kg',M['body'])]+list(M['meas'].items()):
                if v is None:continue
                u='kg' if k=='kg' else 'cm';eb[k]=' '.join(f"{lab[k]} {f1(v[0])} {u}{'' if v[1] is None else ' '+fsign(v[1],u)}".split())
            chk(bd==eb,f'report {mn}: body/measures {bd} == {eb}')
            if back==1:await pg.screenshot(path=f'{D}/bericht_arc.png',full_page=True)
        r=await pg.evaluate("()=>{const t=$('#repCard').innerText.replace(/\\d{2}\\.\\d{2}\\.\\d{2}/g,'');return[/\\d\\.\\d(?!\\d{2})/.test(t),t.toLowerCase().includes('monatsbericht')]}")
        chk(r==[False,True],f'report uses decimal comma {r}')

        # ===== 2) Körpermaße: anlegen / bearbeiten / löschen / Backup =====
        await sub(pg,'koerper')
        n0=await pg.evaluate("S.meas.length")
        await pg.click('#measAdd');await pg.wait_for_timeout(120)
        await pg.fill('#mD','2026-11-09');await pg.fill('#m_brust','106,5');await pg.fill('#m_arm','39');await pg.fill('#m_taille','abc');await pg.click('#mSave');await pg.wait_for_timeout(100)
        chk(await pg.is_visible('#mErr') and 'Taille' in await txt(pg,'#mErr'),'invalid value rejected with message')
        await pg.fill('#m_taille','');await pg.fill('#m_bein','61.2');await pg.click('#mSave');await pg.wait_for_timeout(200)
        r=await pg.evaluate("S.meas.find(x=>x.d==='2026-11-09')")
        chk(r=={'d':'2026-11-09','brust':106.5,'arm':39,'bein':61.2} and await pg.evaluate("S.meas.length")==n0+1,f'measure added (comma + point) {r}')
        chk(json.loads(await pg.evaluate("localStorage.getItem(KEY)"))['meas'][-1]['brust']==106.5,'measure saved in S / localStorage')
        await pg.click('[data-mk="arm"]');await pg.wait_for_timeout(100)
        chk(await txt(pg,'#measLast')=='39 cm','chart/info follows chosen measure (Oberarm)')
        idx=await pg.evaluate("S.meas.findIndex(x=>x.d==='2026-11-09')")
        await pg.click(f'[data-mi="{idx}"]');await pg.wait_for_timeout(120)
        chk(await pg.input_value('#m_brust')=='106,5','edit sheet shows decimal comma')
        await pg.fill('#m_arm','39,4');await pg.fill('#m_bein','');await pg.click('#mSave');await pg.wait_for_timeout(150)
        r=await pg.evaluate("S.meas.find(x=>x.d==='2026-11-09')");chk(r=={'d':'2026-11-09','brust':106.5,'arm':39.4},f'measure edited, cleared field removed {r}')
        idx=await pg.evaluate("S.meas.findIndex(x=>x.d==='2026-11-09')")
        await pg.click(f'[data-mi="{idx}"]');await pg.wait_for_timeout(100);await pg.click('#mDel');await pg.wait_for_timeout(100);await pg.click('#cOk');await pg.wait_for_timeout(150)
        chk(await pg.evaluate("S.meas.length")==n0 and not await pg.evaluate("S.meas.some(x=>x.d==='2026-11-09')"),'measure deleted')
        await pg.screenshot(path=f'{D}/koerper_arc.png',full_page=True)
        # backup roundtrip + tolerant validation
        r=await pg.evaluate("""()=>{const t=backupText();const a=parseBackup(t);const j=JSON.parse(t);
            j.state.meas=[...j.state.meas,{d:'2026-13-01',brust:100},{d:'2026-10-20',brust:'abc',arm:'38,5'},'x',null,{d:'2026-10-21'},{d:'2026-10-22',taille:5000},{d:'2026-10-23',bein:true}];
            const b=parseBackup(JSON.stringify(j));const k=JSON.parse(JSON.stringify(j));k.state.meas={kaputt:1};const c=parseBackup(JSON.stringify(k));delete k.state.meas;const d=parseBackup(JSON.stringify(k));
            return{same:JSON.stringify(a.st.meas)===JSON.stringify(S.meas),n:S.meas.length,b:b.st.meas.length,b20:b.st.meas.find(x=>x.d==='2026-10-20'),c:c.st.meas,d:d.st.meas===undefined,hist:b.n}}""")
        chk(r['same'] and r['b']==r['n']+1 and r['b20']=={'d':'2026-10-20','arm':38.5} and r['c']==[] and r['d'] and r['hist']==len(hist),f'backup: meas included, tolerant validation {r}')
        # full restore through the app (reload) keeps the measures
        bk=await pg.evaluate("backupText()");before=await pg.evaluate("JSON.stringify(S.meas)")
        await pg.evaluate("()=>{S.meas=[];save()}")
        async with pg.expect_navigation():await pg.evaluate("t=>applyBackup(parseBackup(t).st)",bk)
        await boot(pg);chk(await pg.evaluate("JSON.stringify(S.meas)")==before,'backup restore brings measures back')
        # old backup without meas + old state without meas: no crash
        await pg.evaluate("go('hist')");await sub(pg,'koerper');mt=await txt(pg,'#measCard');chk('körpermasse' in mt.lower() and 'oberarm' in mt.lower(),'Körper view after restore '+mt[:80])

        # ===== 3) alle 8 Designs: keine überlaufenden Texte, Screenshots arc/day/toxic =====
        for th in THEMES:
            await pg.evaluate("t=>{S.settings.theme=t;applyTheme(t);go('hist')}",th);await pg.wait_for_timeout(120)
            ov=[]
            for k in['kraft','muskeln','kalender','koerper','bericht']:
                await sub(pg,k)
                if k=='bericht':await pg.evaluate("()=>{const d=new Date();repM=new Date(d.getFullYear(),d.getMonth()-1,1).getTime();renderHsub()}")
                await pg.wait_for_timeout(80);o=await pg.evaluate("T.ov()")
                if o:ov.append((k,o))
                if th in('arc','day','toxic'):await pg.screenshot(path=f'{D}/{k}_{th}.png',full_page=True)
            await sub(pg,'koerper');await pg.click('#measAdd');await pg.wait_for_timeout(100);o=await pg.evaluate("T.ov()")
            if o:ov.append(('measSheet',o))
            if th in('arc','day','toxic'):await pg.screenshot(path=f'{D}/meassheet_{th}.png')
            await pg.evaluate("closeSheet()")
            chk(not ov,f'{th}: no overflowing text {ov[:3]}')
            # calendar plan colours distinct inside the design (letters carry the meaning anyway)
            cols=await pg.evaluate("()=>{const cs=getComputedStyle(document.documentElement);return['--cA','--cB','--cC'].map(k=>cs.getPropertyValue(k).trim())}")
            chk(len(set(cols))==3,f'{th}: A/B/C colours distinct {cols}')
        await pg.evaluate("()=>{S.settings.theme='arc';applyTheme('arc');save()}")

        # ===== 4) Performance mit 320 Einheiten =====
        hist2,yoga2,body2,meas2=gen(now,weeks=54,seed=3,long=True)
        print('long history',len(hist2))
        st=await pg.evaluate("T.base()");st.update(history=hist2,body=body2,meas=meas2,yoga={'start':None,'done':{},'log':yoga2})
        await put(pg,st)
        r=await pg.evaluate("""()=>{const t=[];let a=performance.now();go('hist');t.push(performance.now()-a);
            for(const k of['muskeln','kalender','koerper','bericht','kraft']){a=performance.now();HSUB=k;renderHist();t.push(performance.now()-a)}
            a=performance.now();for(let i=0;i<20;i++)stats();const cached=performance.now()-a;const o1=stats();ST=null;a=performance.now();stats();const cold=performance.now()-a;
            return{n:S.history.length,t:t.map(x=>+x.toFixed(1)),cached:+cached.toFixed(2),cold:+cold.toFixed(1),same:stats()===stats()}}""")
        print('perf',r)
        chk(r['n']>=300 and max(r['t'])<250 and r['cached']<5 and r['same'],f'300+ entries: render per sub-tab < 250 ms, stats cached {r}')
        O2=oracle(now,hist2,yoga2,body2,meas2)
        await sub(pg,'kalender');chk([await txt(pg,'#stCur'),await txt(pg,'#stBest')]==[str(O2['streak'][0]),str(O2['streak'][1])],f'long history streaks {O2["streak"]}')

        # ===== 4b) 3.0 fix: plan fulfilled exactly (2 or 3 units/week for 5 weeks) -> no warning; units missed (1 every 2 weeks) -> warning =====
        async def planned(per_week,every=1):
            return await pg.evaluate('''([pw,ev])=>{const st=T.base();st.history=[];const ws=weekStart(new Date()).getTime();let u=0;
              for(let w=6;w>=1;w--){if(w%ev)continue;for(let j=0;j<pw;j++){const d=DAYS[u%3];u++;const t=ws-w*WEEKMS+(1+2*j)*864e5+17*36e5;
                const its=planItems(d,false,1);st.history.push({date:new Date(t).toISOString(),plan:d,week:1,dur:3300,
                  log:its.map(it=>({ex:it.ex,sets:Array.from({length:it.sets},()=>({w:EX[it.ex].type==='bar'?40:EX[it.ex].type==='db'?10:0,r:it.lo,done:true}))}))})}}
              st.prog={v:1,block:1,done:[],cycle:1,units:u,dlLeft:0,dlAt:u};return st}''',[per_week,every])
        for pw in (3,2):
            await put(pg,await planned(pw));await pg.evaluate("go('hist')");await sub(pg,'muskeln')
            chk(not await pg.query_selector('#mgLow'),f'{pw} units/week exactly as planned -> no low warning')
        await pg.screenshot(path=f'{D}/muskeln_plan.png',full_page=True)
        await put(pg,await planned(1,2));await pg.evaluate("go('hist')");await sub(pg,'muskeln')
        lt=await txt(pg,'#mgLow') if await pg.query_selector('#mgLow') else ''
        chk('Weniger als im Plan' in lt and 'Soll laut Plan' in lt and 'Sätze pro Durchgang' in lt and 'ausgefallen' in lt,f'units really missed -> honest warning {lt[:140]}')

        # ===== 5) alte Einträge ohne neue Felder / kaputte Werte: keine Abstürze =====
        st=await pg.evaluate("T.base()");st['history']=[{'date':'2025-03-03T17:00:00.000Z','plan':'A','dur':1800,'log':[{'ex':'bench','sets':[{'w':'50','r':'8'},{'w':50,'r':8,'done':False}]}]},
            {'date':'2025-03-05T17:00:00.000Z','plan':'B','log':[{'ex':'pullup','sets':[{'w':0,'r':7}]}]},{'date':'2025-03-07T17:00:00.000Z','plan':'C','week':1,'log':[{'ex':'squat','sets':[]}]}]
        st['yoga']={'log':[{'date':'kaputt'},None,{'date':'2025-03-09T08:00:00.000Z','kind':'quick'}]};st['meas']='x'
        await put(pg,st);await pg.evaluate("go('hist')")
        for k in['kraft','muskeln','kalender','koerper','bericht']:await sub(pg,k)
        await pg.evaluate("()=>{repM=new Date(2025,2,1).getTime();renderHsub()}")
        chk(await txt(pg,'[data-r="n"] .num')=='3' and await txt(pg,'[data-r="yoga"] .num')=='1' and await txt(pg,'[data-r="vol"] .num')==fkg_int(400)+' kg','old entries (string numbers, no done/dur/week) counted without crash')
        chk(await pg.evaluate("Array.isArray(S.meas)&&S.meas.length===0"),'broken S.meas normalised to []')
        chk(not errs,f'no JS errors {errs[:3]}')
        await b.close()
    srv.kill()
    print('RESULT','ALL OK' if not FAIL else f'{len(FAIL)} FAILED')
    sys.exit(1 if FAIL else 0)
asyncio.run(main())
