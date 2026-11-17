(KS)=>{const R={hip:7,sh:6,head:8.5,knee:4,knee2:4,elbow:3,elbow2:3,toe:0,toe2:0,ankle:0,ankle2:0,hand:0,hand2:0};
  const pts=o=>{const m={};for(const q in o){const v=o[q];if(Array.isArray(v)&&v.length===2&&typeof v[0]==='number')m[q]=v}return m};
  const same=(a,b)=>{let d=0;for(const q in a)if(b[q])d=Math.max(d,Math.hypot(a[q][0]-b[q][0],a[q][1]-b[q][1]));return d};
  const res=[];
  for(const k of (KS||YKEYS)){const def=AN['y_'+k];for(const g of['m','f']){const L_=yLoopOf(def,g);const bad=[];const dt=1/60;
    // timing: stand 1-2 s, in 3-5 s, hold 4-6 s (animation), back 3-4 s
    if(!(YL.stand>=1&&YL.stand<=2&&L_.entry>=3&&L_.entry<=5&&L_.H.dur>=4&&L_.H.dur<=6&&L_.exit>=3&&L_.exit<=4))bad.push('timing');
    // start and end frame are the relaxed stand, identical (seamless loop)
    const r0=yLoopPose(L_,0),r1=yLoopPose(L_,L_.T-1e-4);if(r0.stage!=='stand'||r1.stage!=='stand')bad.push('stand-stage');
    const o0=r0.o;const upright=o0.front?Math.min(o0.hipL[1],o0.hipR[1])>85&&o0.ankL[1]<1&&o0.ankR[1]<1:o0.hip[1]>85&&o0.ankle[1]<1&&o0.ankle2[1]<1&&o0.head[1]>160;if(!upright)bad.push('not-upright');
    if(same(pts(o0),pts(r1.o))>1.5)bad.push('loop-seam');
    // order of the stages over one cycle
    const seq=[];let hpen={},hclr=1e9;
    // hold phase = the authored end pose animation (exact)
    let hd=0;for(let t=0;t<L_.H.dur;t+=.25){const lt=YL.stand/2+L_.entry+t;const a=yLoopPose(L_,lt);if(a.stage!=='hold')continue;const b=animPose(def,t*L_.H.f,g).o;hd=Math.max(hd,same(pts(a.o),pts(b)));
      if(!b.front){let mn=1e9;for(const q in R){hpen[q]=Math.max(hpen[q]||0,-(b[q][1]-R[q]));mn=Math.min(mn,b[q][1]-R[q])}hclr=Math.min(hclr,mn)}else hclr=Math.min(hclr,Math.min(b.ankL[1],b.ankR[1],b.hipL[1]-13,b.hipR[1]-13))}
    if(hd>.01)bad.push('hold!=pose '+hd.toFixed(2));
    let prev=null,pv=null,step=0,acc=0,pen=0,flo=0,stepAt='';
    for(let t=0;t<=L_.T+1e-9;t+=dt){const r=yLoopPose(L_,t);if(!seq.length||seq[seq.length-1]!==r.stage)seq.push(r.stage);const m=pts(r.o);
      if(prev){for(const q in m){if(!prev[q])continue;const d=Math.hypot(m[q][0]-prev[q][0],m[q][1]-prev[q][1]);if(d>step){step=d;stepAt=q+'@'+t.toFixed(2)}
        if(pv&&pv[q]){const a=Math.hypot(m[q][0]-2*prev[q][0]+pv[q][0],m[q][1]-2*prev[q][1]+pv[q][1]);acc=Math.max(acc,a)}}}
      pv=prev;prev=m;const o=r.o;
      if(o.front){pen=Math.max(pen,-Math.min(o.ankL[1],o.ankR[1]));flo=Math.max(flo,Math.min(o.ankL[1],o.ankR[1],o.hipL[1]-13,o.hipR[1]-13)-Math.max(0,hclr))}
      else{let mn=1e9;for(const q in R){pen=Math.max(pen,-(o[q][1]-R[q])-(hpen[q]||0));mn=Math.min(mn,o[q][1]-R[q])}flo=Math.max(flo,mn-Math.max(0,hclr))}}
    if(seq.join()!=='stand,in,hold,out,stand')bad.push('stages '+seq.join());
    if(step>5)bad.push('jump '+step.toFixed(1)+' '+stepAt);
    if(acc>8)bad.push('snap '+acc.toFixed(1));
    if(pen>2)bad.push('floor '+pen.toFixed(1));
    if(flo>3.5)bad.push('floating '+flo.toFixed(1));
    res.push({k,g,bad,step:+step.toFixed(1),acc:+acc.toFixed(1),T:+L_.T.toFixed(1)})}}
  return res}