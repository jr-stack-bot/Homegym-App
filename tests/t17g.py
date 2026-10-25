import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,json,random,sys
from playwright.async_api import async_playwright
U='file://'+(sys.argv[1] if len(sys.argv)>1 else _os.path.join(_OUTDIR,'index.html'));OUT=_SHOTS
CHECK="""()=>{const r=[];for(let w=1;w<=4;w++)for(const d of DAYS){const it=planItems(d,false,w);const main=it.filter(x=>!x.fin);const ks=it.map(x=>x.ex);
  const bad=ks.filter(k=>!canDo(k));const dup=ks.length!==new Set(ks).size;const off=main.filter(x=>!DAYEX[d].includes(x.ex)).map(x=>x.ex);const fin=it.filter(x=>x.fin).map(x=>x.ex).filter(k=>!DAYFIN[d].includes(k));
  const min=(480+main.reduce((a,x)=>a+itemSecs(x),0))/60;const noanim=ks.filter(k=>!AN[animOf(k)]);
  const q=planItems(d,true,w);r.push({w,d,n:main.length,min:Math.round(min*10)/10,qn:q.length,bad,dup,off,fin,noanim,ks:ks.join(',')})}
  const warm=warmList(false).map(x=>x.anim).filter(a=>!AN[a]);return{r,warm,warmN:warmList(false)[0].n}}"""
# muscle-group sanity per day by German name (fachlich)
FACH="""()=>{const A=/Bizeps|Curl|Rudern|Klimmz|Latzieh|Kreuzheb|Kniebeug|Squat|Ausfall|Step|Waden|Bauch|Crunch|Beinheb|Knieheb/;const B=/Bankdr|Liegest|Dips|Trizeps|Schulterdr|Seithe|Frontheb|Fliegende|Kniebeug|Squat|Ausfall|Waden|Bauch|Crunch/;const C=/Bankdr|Liegest|Dips|Trizeps|Curl(?!s auf)|Bizeps|Rudern am|Latzieh|Schulterdr|Klimmz/;
  const bad=[];for(let w=1;w<=4;w++)for(const d of DAYS)for(const x of planItems(d,false,w)){if(x.fin)continue;const n=EX[x.ex].n;const re={A,B,C}[d];if(re.test(n)&&!(d==='C'&&/Beincurl/.test(n)))bad.push(w+d+' '+n)}return bad}"""
NEW=["kb","ez","dip","cable","legmach","rings","trx","box","mball","abwheel","rope","gymball","roller","rower","bike"]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();errs=[];ok=True
        ctx=await b.new_context();pg=await ctx.new_page()
        pg.on('pageerror',lambda e: errs.append(str(e)));pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
        await pg.goto(U);await pg.wait_for_timeout(300)
        allg=await pg.evaluate("ALLGEAR")
        random.seed(17)
        mixes=[('all',allg),('none',[]),('dbonly',['db','bench','band']),('joschy',await pg.evaluate("JOSCHYGEAR"))]
        mixes.append(('mix1 kb+rings+box+rope',['kb','rings','box','rope','mball']))
        mixes.append(('mix2 cable+bench+ez+dip+bike',['cable','bench','ez','dip','bike','abwheel']))
        mixes.append(('mix3 random',random.sample(allg,8)))
        mixes.append(('mix4 trx+gymball+rower+legmach',['trx','gymball','rower','legmach','pullbar']))
        for name,g in mixes:
            res=await pg.evaluate("(g)=>{S.profile={name:'T',gear:g,gearV:2};return null}",g)
            out=await pg.evaluate(CHECK);r=out['r']
            probs=[x for x in r if x['n']<4 or x['min']>60 or x['bad'] or x['dup'] or x['off'] or x['fin'] or x['noanim'] or x['qn']<2]
            fach=await pg.evaluate(FACH)
            print(f"{name}: gear={len(g)} problems={len(probs)} fach={len(fach)} warm='{out['warmN']}' warmNoAnim={out['warm']} min={min(x['min'] for x in r)}-{max(x['min'] for x in r)}")
            for x in probs: print('   P',x)
            for f in fach: print('   F',f)
            ok&=not probs and not fach and not out['warm']
            if name.startswith('mix') or name=='all':
                for x in r[:3]+r[9:12]: print('     ',x['w'],x['d'],x['min'],x['ks'])
        # new exercises used somewhere?
        used=await pg.evaluate("""(mixes)=>{const s=new Set();for(const g of mixes){S.profile={name:'T',gear:g,gearV:2};for(let w=1;w<=4;w++)for(const d of DAYS)for(const x of planItems(d,false,w))s.add(x.ex)}return[...s]}""",[m[1] for m in mixes])
        newex=await pg.evaluate("['kbswing','kbgoblet','kbpress','kbrow','dips','ringrow','ringpush','trxcurl','latpull','cablerow','cablepush','cablefly','cableface','ezcurl','ezskull','boxjump','boxstep','mbslam','russtwist','rollout','jumprope','ballcrunch','ballcurl','rowint','bikeint','legext','legcurl']")
        print('new exercises reachable via adaptation:',[k for k in newex if k in used])
        print('only via swap/library:',[k for k in newex if k not in used])
        # swap pools machbar
        sw=await pg.evaluate("""(mixes)=>{const bad=[];for(const g of mixes){S.profile={name:'T',gear:g,gearV:2};for(let w=1;w<=4;w++)for(const d of DAYS){const it=planItems(d,false,w);S.session={plan:d,items:it};
          for(const x of it){for(const k of swapPool(x,d)){if(!canDo(k))bad.push('nocan '+k);if(!x.fin&&!DAYEX[d].includes(k))bad.push(d+' off '+k);if(x.fin&&!DAYFIN[d].includes(k))bad.push(d+' finoff '+k)}}S.session=null}}return bad}""",[m[1] for m in mixes])
        print('swap problems',sw[:10],len(sw));ok&=not sw
        # migration
        mig=await pg.evaluate("""()=>{localStorage.setItem(KEY,JSON.stringify({settings:{},history:[{date:new Date().toISOString(),plan:'A',week:1,dur:100,log:[]}],profile:{name:'Joschy',gear:['barbell','rack','bench','db','pullbar','band','grips','bag','tread','cross']}}));load();
          const a=[...S.profile.gear].sort().join(',');localStorage.setItem(KEY,JSON.stringify({settings:{},history:[],profile:{name:'Ali',gear:['db','band']}}));load();const b=S.profile.gear.join(',');
          localStorage.setItem(KEY,JSON.stringify({settings:{},history:[],profile:{name:'Old'}}));load();const c=[...S.profile.gear].sort().join(',');
          localStorage.setItem(KEY,JSON.stringify({settings:{},history:[],profile:{name:'X',gearV:2,gear:['barbell','rack','bench','db','pullbar','band','grips','bag','tread','cross']}}));load();const d=S.profile.gear.length;
          localStorage.removeItem(KEY);load();return{a,b,c,d,j:[...JOSCHYGEAR].sort().join(',')}}""")
        print('migration',mig);ok&=mig['a']==mig['j'] and mig['b']=='db,band' and mig['c']==mig['j'] and mig['d']==10
        print('errors',errs);ok&=not errs
        print('ALL OK' if ok else 'FAILED')
        await b.close()
asyncio.run(main())
