"""Satzbewusster Neuschnitt: Einträge werden auf Folgen von Äußerungen (Pausen >= 150 ms) abgebildet.
DP über (Eintrag, Äußerung). Ein Eintrag kann 1..5 Äußerungen umfassen; zwei Einträge können sich eine
Äußerung teilen (TTS hat nicht pausiert) -> beide UNSICHER."""
import json,sys,math,numpy as np,subprocess,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import split as S
M=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'manifest.json')));T={e['id']:e['text'] for g in M['groups'].values() for e in g}
def units(db,th=-38,mingap=15):
    sp=np.where(db>=th)[0];s0,s1=int(sp[0]),int(sp[-1])+1
    gaps=[(a,b) for a,b in S.runs_below(db,th,mingap) if a>s0 and b<s1]
    st=[s0]+[b for a,b in gaps];en=[a for a,b in gaps]+[s1]
    return list(zip(st,en)),[(b-a)/100 for a,b in gaps]
def nsent(t):return max(1,len([c for c in t.strip() if c in '.!?']))
def solve(db,labels,rate=None,th=-38):
    U,G=units(db,th);texts=[T[l] for l in labels];syl=[S.syllables(t) for t in texts]
    if rate is None:rate=sum(b-a for a,b in U)/100/sum(syl)
    N,K=len(labels),len(U);INF=1e18
    exp=[s*rate for s in syl]
    def dur(i,j):return (U[j-1][1]-U[i][0])/100   # units i..j-1 incl. inner gaps
    def speech(i,j):return sum((U[q][1]-U[q][0]) for q in range(i,j))/100
    def inner(i,j):return G[i:j-1]
    best={(0,0):(0,None)}
    for k in range(N):
        for j in range(K+1):
            if (k,j) not in best:continue
            c0=best[(k,j)][0]
            # single entry takes c units
            for c in range(1,6):
                if j+c>K:break
                sp=speech(j,j+c);r=sp/exp[k]
                cost=4*math.log(r)**2
                ig=inner(j,j+c)
                # inner gaps allowed roughly up to number of sentence/comma breaks
                brk=nsent(texts[k])-1+texts[k].count(',')
                if len(ig)>brk:cost+=3*(len(ig)-brk)
                cost+=sum(max(0,g-0.9)*2 for g in ig)
                bg=G[j+c-1] if j+c-1<len(G) else 1.5
                cost+=max(0,0.7-bg)*3
                key=(k+1,j+c);v=c0+cost
                if v<best.get(key,(INF,))[0]:best[key]=(v,(k,j,c,'one'))
            # two entries share one unit
            if k+1<N and j+1<=K:
                sp=speech(j,j+1);r=sp/(exp[k]+exp[k+1]);cost=4*math.log(r)**2+2.5
                key=(k+2,j+1);v=c0+cost
                if v<best.get(key,(INF,))[0]:best[key]=(v,(k,j,1,'shared'))
    if (N,K) not in best:raise SystemExit('kein Pfad')
    path=[];cur=(N,K)
    while cur!=(0,0):
        v,(k,j,c,kind)=best[cur];path.append((k,j,c,kind));cur=(k,j)
    path.reverse();res=[]
    for k,j,c,kind in path:
        a,b=U[j][0],U[j+c-1][1]
        if kind=='one':res.append(dict(id=labels[k],a=a,b=b,units=c,speech=speech(j,j+c),exp=exp[k],ok=True))
        else:
            for q in (k,k+1):res.append(dict(id=labels[q],a=a,b=b,units=1,speech=speech(j,j+1),exp=exp[q],ok=False))
    return res,rate
def write(res,audio,out):
    for r in res:
        if r['id'].startswith('_') or not r['ok']:continue
        ts=max(0,r['a']/100-S.PAD);d=r['b']/100+S.PAD-ts
        subprocess.run(['ffmpeg','-y','-v','error','-ss',f'{ts:.3f}','-t',f'{d:.3f}','-i',audio,'-af',f'afade=t=in:d={S.FADE},afade=t=out:st={max(0,d-S.FADE):.3f}:d={S.FADE}','-ar','44100','-ac','1','-b:a','128k',os.path.join(out,r['id']+'.mp3')],check=True)
if __name__=='__main__':
    b=sys.argv[1];raw=sys.argv[2];info=M['batches'][b]
    labels=(['_lead'] if info.get('discard_first') else [])+info['audio_order']+(['_tail'] if info.get('discard_last') else [])
    db=S.envelope(raw);res,rate=solve(db,labels)
    for r in res:print(f"{r['id']:<24}{T[r['id']][:46]:<48}{r['a']/100:7.2f} units {r['units']} speech {r['speech']:5.2f} exp {r['exp']:5.2f} ratio {r['speech']/r['exp']:4.2f} {'' if r['ok'] else 'UNSICHER'}")
    if len(sys.argv)>3:write(res,raw,sys.argv[3])
