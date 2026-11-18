/* @ Joschy · Homegym t31: edge/overlay check for one real canvas over the whole animation loop.
   arg: {sel, keys:[[key,g,readoutText]], frames, still}  -> list of hits */
({sel,keys,frames,still,strip,thr})=>{const c=document.querySelector(sel);const st=c.closest('.stage');
  const ph=st?st.querySelector('.phase'):null;const ro=st?st.querySelector('.readout'):null;const tp=st?st.querySelector('.tempo'):null;
  strip=strip||2;thr=thr||90;const hits=[];
  for(const [key,g,rtext] of keys){if(!AN[key]){hits.push({key,g,err:'noanim'});continue}
    attachAnim(c,key,{g,still:!!still,phaseEl:ph});RUN.delete(c);c._t0=0;if(ro&&rtext!=null)ro.textContent=rtext;
    const T=c._loop?c._loop.T:cycT(AN[key]);const n=still?1:frames;let worst=null;
    for(let i=0;i<n;i++){const t=still?0:(i+.5)/n*T;c._done=false;renderCanvas(c,t*1000/animSpd());
      const cw=c.width,chh=c.height;if(!cw)continue;const d=c.getContext('2d').getImageData(0,0,cw,chh).data;const dp=cw/c.clientWidth;const sp=Math.max(1,Math.round(strip*dp));
      const A=(x,y)=>d[(y*cw+x)*4+3];let e={l:0,r:0,t:0,b:0};
      for(let y=0;y<chh;y++)for(let x=0;x<sp;x++){if(A(x,y)>thr)e.l++;if(A(cw-1-x,y)>thr)e.r++}
      for(let x=0;x<cw;x++)for(let y=0;y<sp;y++){if(A(x,y)>thr)e.t++;if(A(x,chh-1-y)>thr)e.b++}
      const cr=c.getBoundingClientRect();const ov={};
      for(const [nm,el] of [['phase',ph],['readout',ro],['tempo',tp]]){if(!el||!el.textContent.trim())continue;const r=el.getBoundingClientRect();
        const x0=Math.max(0,Math.floor((r.left-cr.left)*dp)),x1=Math.min(cw,Math.ceil((r.right-cr.left)*dp)),y0=Math.max(0,Math.floor((r.top-cr.top)*dp)),y1=Math.min(chh,Math.ceil((r.bottom-cr.top)*dp));let k=0;
        for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++)if(A(x,y)>thr)k++;if(k>2)ov[nm]=k}
      /* the stage clips the canvas: visible part of the canvas must be the whole canvas */
      let clip=0;if(st){const sr=st.getBoundingClientRect();clip=Math.max(0,cr.bottom-sr.bottom,sr.top-cr.top)}
      const bad=e.l+e.r+e.t+e.b>0||Object.keys(ov).length||clip>0.5;
      if(bad){const f={i,t:+t.toFixed(2),edge:e,ov,clip:+clip.toFixed(1),lbl:ph?ph.textContent:''};if(!worst)worst={key,g,n:0,first:f};worst.n++}}
    if(worst)hits.push(worst)}
  return hits}
