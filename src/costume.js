/* ================= 3.5 (@ Joschy): EXTRAS – Kampfsport-Kostüme =================
   19 frei gestaltete, generische Sport-Outfits für Mann und Frau (keine Marken, Logos, Schriftzeichen oder Figuren-Vorbilder).
   Freischaltung per Kennwort (nur als SHA-256-Hash im Code). Mit Kostüm: muskulöserer Körperbau (nur Zeichnung,
   Gelenke und Griffpunkte bleiben gleich). Ohne Kostüm läuft drawFig0 unverändert (pixelgleich zu 3.4).
   Alles hängt an den Gelenken des Rigs: Gürtel am Becken, Ärmel/Handschuhe an Ellbogen/Hand, Helme am Kopf. */
let COS=null,CX=null;const COS_BOOT=Date.now();
const COS_SALT="homegym·extras·",COS_HASH="fa936845fdd0be3bf2e547b1a8918bb92c44deb858682a886535f29f09bc5da3";
function sha256(m){const r=(x,n)=>x>>>n|x<<32-n,MW=Math.pow(2,32);const P=[],K=[],H=[];for(let c=2;P.length<64;c++){if(P.every(p=>c%p)){P.push(c)}}
  for(let i=0;i<64;i++){K[i]=(Math.pow(P[i],1/3)*MW)|0;if(i<8)H[i]=(Math.pow(P[i],1/2)*MW)|0}
  const b=unescape(encodeURIComponent(m)),l=b.length*8,w=[];for(let i=0;i<b.length;i++)w[i>>2]|=b.charCodeAt(i)<<(24-(i%4)*8);w[l>>5]|=0x80<<(24-l%32);w[((l+64>>9)<<4)+15]=l;
  for(let j=0;j<w.length;j+=16){const W=[];for(let i=0;i<16;i++)W[i]=w[j+i]|0;const a=H.slice();
    for(let i=0;i<64;i++){if(i>15){const x=W[i-15],y=W[i-2];W[i]=(r(x,7)^r(x,18)^x>>>3)+(r(y,17)^r(y,19)^y>>>10)+W[i-7]+W[i-16]|0}
      const t1=a[7]+(r(a[4],6)^r(a[4],11)^r(a[4],25))+(a[4]&a[5]^~a[4]&a[6])+K[i]+W[i]|0,t2=(r(a[0],2)^r(a[0],13)^r(a[0],22))+(a[0]&a[1]^a[0]&a[2]^a[1]&a[2])|0;
      a.unshift(t1+t2|0);a[4]=a[4]+t1|0;a.pop()}
    for(let i=0;i<8;i++)H[i]=H[i]+a[i]|0}
  return H.map(v=>(v>>>0).toString(16).padStart(8,"0")).join("")}
function exCheck(pw){return sha256(COS_SALT+String(pw||"").trim().toLowerCase())===COS_HASH}

/* ---------- costume table ---------- */
const GI=(c,belt,ex)=>Object.assign({top:c,bot:c,sl:1,fsl:.55,bl:.95,wide:1.3,jacket:1,lapel:c,belt:{c:belt,t0:.15,t1:.235,knot:1,ends:9},bare:1},ex||{});
const COSL=[
 ["karate","Karate",GI("#eceff1","#17191c")],
 ["judo","Judo",GI("#2f5d98","#e9ecee",{lapel:"#27507f",lw:1.5,fsl:.72})],
 ["bjj","BJJ",GI("#26292d","#5d3f8a",{fsl:.82,wide:1.05,lapel:"#1d2023",lw:1.3})],
 ["tkd","Taekwondo",GI("#f1f3f4","#141619",{lapel:"#141619",lw:.9,fsl:.9,armor:"hogu",ac:"#b0342e",ac2:"#eef0f1"})],
 ["box","Boxen",{top:"skin",bot:"#1c2532",bl:.44,wide:1,band:"#e6eaed",shoe:"#14171b",sole:"#e9eef1",boot:"#14171b",glove:{t:"box",c:"#a8262a"}},{top:"#1c2532",sl:0}],
 ["muay","Muay Thai",{top:"skin",bot:"#9e2a2c",bl:.3,wide:1.5,band:"#c9a640",glove:{t:"wrap",c:"#eef0ee"},ankle:"#eef0ee",bare:1},{top:"#9e2a2c",sl:0}],
 ["kick","Kickboxen",{top:"skin",bot:"#16191d",bl:.97,wide:1.1,stripe:"#e3e7ea",glove:{t:"box",c:"#25508c"},head:{t:"guard",c:"#25508c"},shin:{t:"guard",c:"#25508c"},bare:1},{top:"#25508c",sl:0}],
 ["ring","Ringen",{top:"#76243a",bot:"#76243a",sl:0,bl:.34,wide:.5,singlet:1,shoe:"#76243a",sole:"#e9eef1",boot:"#76243a",head:{t:"ear",c:"#1b1e22"}}],
 ["mma","MMA",{top:"skin",bot:"#2c3137",bl:.38,wide:.9,band:"#2c3137",glove:{t:"mma",c:"#17191c"},bare:1},{top:"#2c3137",sl:0}],
 ["sambo","Sambo",{top:"#ad2b2b",bot:"#ad2b2b",sl:1,fsl:.9,jacket:1,lapel:"#962424",lw:1.2,belt:{c:"#ad2b2b",t0:.15,t1:.235,knot:1,ends:8},bl:.34,wide:.6,shoe:"#ad2b2b",sole:"#e9eef1",boot:"#ad2b2b"}],
 ["kungfu","Kung-Fu",{top:"#17191c",bot:"#17191c",sl:1,fsl:1,cuff:"#e8ebee",frog:"#e8ebee",bl:.96,wide:1.2,belt:{c:"#6b7177",t0:.12,t1:.25,knot:1,ends:12},shoe:"#121416",sole:"#e9eef1"}],
 ["capo","Capoeira",{top:"skin",bot:"#f0f1ee",bl:.96,wide:1.2,belt:{c:"#2f6aa8",t0:.19,t1:.215,knot:1,ends:15,cord:1},bare:1},{top:"#f0f1ee",sl:0}],
 ["kendo","Kendo",{top:"#2a3a5c",bot:"#2a3a5c",sl:1,fsl:.45,bl:.98,wide:3,hakama:1,armor:"do",ac:"#2a1e19",ac2:"#5b6470",skirt:{c:"#2a3a5c",len:.42,add:2.4,n:4},head:{t:"men",c:"#2a3a5c",c2:"#b8bec4"},glove:{t:"kote",c:"#2a3a5c",c2:"#3d4f73"},bare:1}],
 ["ninja","Ninja",{top:"#1b1f26",bot:"#1b1f26",sl:1,fsl:1,bl:.97,wide:1.3,belt:{c:"#3b4149",t0:.13,t1:.25,knot:1,ends:9},head:{t:"hood",c:"#1b1f26"},shin:{t:"wrap",c:"#2c3139"},glove:{t:"mma",c:"#2c3139"},shoe:"#16191e",sole:"#2a2f35"}],
 ["samurai","Samurai",{top:"#3a4049",bot:"#2c323a",sl:1,fsl:.6,bl:.98,wide:2.6,hakama:1,armor:"samurai",ac:"#2b2521",ac2:"#8c7244",skirt:{c:"#2b2521",len:.46,add:2.6,n:4,plate:1},sode:1,head:{t:"kabuto",c:"#2b2521",c2:"#8c7244"},glove:{t:"kote",c:"#2b2521",c2:"#3a4049"},shoe:"#2b2521",sole:"#3b3029"}],
 ["glad","Gladiator",{top:"skin",bot:"#e4dac4",bl:.24,wide:1,armor:"glad",ac:"#6a4529",ac2:"#a7adb2",skirt:{c:"#6a4529",len:.3,add:1.5,n:5},manica:"#a7adb2",greave:"#a7adb2",head:{t:"galea",c:"#a7adb2"},glove:{t:"wrap",c:"#8a6a4b"},bare:1},{top:"#6a4529",sl:0}],
 ["krav","Krav Maga",{top:"#1a1c1f",bot:"#555a60",sl:.45,bl:.96,wide:1.1,shoe:"#1a1c1f",sole:"#e9eef1",glove:{t:"mma",c:"#2b2e33"}}],
 ["fecht","Fechten",{top:"#f2f3f1",bot:"#f2f3f1",sl:1,fsl:1,bl:.96,wide:.7,jline:1,knee:1,head:{t:"mask",c:"#1b1e22"},noTail:1,glove:{t:"fence",c:"#e6e7e3"},gl1:1,shoe:"#f2f3f1",sole:"#d5d9dd"}],
 ["sumo","Sumo",{top:"skin",bot:"skin",sl:0,bl:.02,mawashi:"#1d2026",bare:1},{top:"#4b535d",bot:"#4b535d",sl:.32,bl:.34,wide:0,body:1}]
];
const COSD={};for(const[id,n,m,f]of COSL)COSD[id]={id,n,m,f:Object.assign({},m,f||{})};
const COS_IDS=COSL.map(c=>c[0]);
function exNorm(e){const ok=v=>v==="none"||v==="rand"||!!COSD[v];const o=e&&typeof e==="object"&&!Array.isArray(e)?e:{};
  return{u:o.u===1||o.u===true?1:0,m:ok(o.m)?o.m:"none",f:ok(o.f)?o.f:"none"}}
function exS(){if(!S.extras||S.extras.m===undefined||S.extras.u===undefined)S.extras=exNorm(S.extras);return S.extras}
/* "Zufällig pro Training": fest pro Einheit (Start der Kraft-Einheit bzw. des Yoga-Ablaufs), sonst pro App-Start */
function cosSeed(){return(S.session&&S.session.start)||(S.yrun&&S.yrun.start)||COS_BOOT}
function cosRand(g,seed){let h=2166136261;const s=String(seed==null?cosSeed():seed)+"|"+g;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return COS_IDS[(h>>>0)%COS_IDS.length]}
function cosPick(c,g){let v;if(c&&c._cos){v=c._cos[g]}else{const e=S&&S.extras;if(!e||!e.u)return null;v=e[g]}if(v==="rand")v=cosRand(g);return COSD[v]?v:null}
const T3=h=>[shade(h,-.5),h,shade(h,.3)];
/* muscular build: wider shoulders, stronger arms and legs (joint + grip geometry unchanged: fr.sh, fr.hipJ, hand) */
const COS_BODY={};
function cosBody(g){if(COS_BODY[g])return COS_BODY[g];const B=JSON.parse(JSON.stringify(BODY[g]));const m=g==="m";
  const sc=(p,k,amp)=>{p.f[0]*=k;p.f[1]*=k;p.f[2]*=amp;p.b[0]*=k;p.b[1]*=k;p.b[2]*=amp};
  sc(B.ua,m?1.2:1.26,m?1.35:1.5);sc(B.fa,m?1.07:1.1,1.25);for(const q of[B.th.f,B.th.b]){q[1]*=m?1.07:1.06;q[2]*=m?1.25:1.2}sc(B.sn,m?1.05:1.04,1.25);
  B.delt*=m?1.22:1.38;B.neck*=m?1.15:1.1;B.knee*=1.05;B.fr.shV=(B.fr.shV||B.fr.sh)+(m?3:2.2);B.fr.ch+=m?1.8:.9;B.fr.wa+=m?.4:.3;
  B.tf=B.tf.map((v,i)=>i>=4&&i<=6?v*(m?1.09:1.04):v);
  return COS_BODY[g]=B}
function cosLook(C,g,l0){const L=Object.assign({},l0);const sk=l0.skin;
  L.top=C.top==="skin"?sk:T3(C.top);L.bot=C.bot==="skin"?sk:T3(C.bot);L.sleeve=C.top==="skin"?0:(C.sl||0);L.botLen=C.bl;
  if(C.shoe){L.shoe=T3(C.shoe);L.sole=C.sole||l0.sole}return L}
/* fit box with costume: helmets, armour and wide trousers need a little more room (constant over the loop: no zoom jumps) */
function cosFit(c,b){if(!cosPick(c,c._g))return b;return b._c||(b._c=Object.assign({},b,{x0:b.x0-3,x1:b.x1+3,y1:b.y1+5}))}
const COS_DEF=new WeakMap();
function cosDef(def,C){if(!C.bare||def.bare)return def;let d=COS_DEF.get(def);if(!d){d=Object.create(def);d.bare=true;COS_DEF.set(def,d)}return d}
/* public entry: same signature as before (tests wrap window.drawFig) */
function drawFig(ctx,def,o,tr,g,time,c){const id=cosPick(c,g);if(!id)return drawFig0(ctx,def,o,tr,g,time,c);
  const C=COSD[id][g];const b0=BODY[g],l0=LOOK[g];BODY[g]=cosBody(g);LOOK[g]=cosLook(C,g,l0);COS=C;
  try{return drawFig0(ctx,cosDef(def,C),o,tr,g,time,c)}finally{BODY[g]=b0;LOOK[g]=l0;COS=null;CX=null}}

/* ---------- helpers ---------- */
const cDim=(kit,h)=>kit.dimmed?mixHex(h,"#05090d",.55):h;
function cLine(x,kit,a,b,col,w,al){x.save();x.globalAlpha=al==null?1:al;x.strokeStyle=cDim(kit,col);x.lineWidth=Math.max(.5,w);x.lineCap="round";x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();x.restore()}
function cPoly(x,kit,pts,col,sm){x.beginPath();if(sm)smooth(x,pts);else polyPath(x,pts);x.fillStyle=typeof col==="string"?cDim(kit,col):kit.base(col);x.fill()}
function cEll(c,rx,ry,rot,n){const p=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2,u=Math.cos(a)*rx,v=Math.sin(a)*ry;p.push([c[0]+u*Math.cos(rot)-v*Math.sin(rot),c[1]+u*Math.sin(rot)+v*Math.cos(rot)])}return p}
/* point on a limb A->B at t, offset q in [-1,1] of the drawn half width (front q>0 / back q<0) */
function cLP(kit,A,B,prof,n,t,q,add_){const c=lerpP(A,B,t);const w=(q>=0?kit.wOf(prof.f,t):kit.wOf(prof.b,t))+(add_||0)*CX.s;return[c[0]+n[0]*w*q,c[1]+n[1]*w*q]}
function cTw(arr,t){const tt=CX.B.tt;if(t<=tt[0])return arr[0];for(let i=0;i<tt.length-1;i++)if(t<=tt[i+1]){const k=(t-tt[i])/(tt[i+1]-tt[i]);return arr[i]+(arr[i+1]-arr[i])*k}return arr[arr.length-1]}
/* belt ends hang with gravity from a knot (figure units), never below the floor */
function cEnds(x,kit,k,len,col,w,cord){const X=CX;for(const[dx,sp]of[[-.25,-.22],[.3,.26]]){const e=[k[0]+sp*len*.5+dx,Math.max(X.fl!=null?X.fl+1:-1e9,k[1]-len*(cord?.95:.9))];
  const m=[k[0]+sp*len*.25,k[1]-len*.5];x.save();x.strokeStyle=kit.base(T3(col));x.lineWidth=X.R(w);x.lineCap=cord?"round":"butt";x.beginPath();const a=X.P(k),b=X.P(m),c=X.P(e);x.moveTo(a[0],a[1]);x.quadraticCurveTo(b[0],b[1],c[0],c[1]);x.stroke();x.restore()}}

/* every costume overlay is clipped at the floor line: gloves, cuffs and wide trousers lie on the floor, never below it */
function cFloor(x){x.save();const X=CX;if(X&&X.fl!=null){const fy=X.P([0,X.fl])[1]+X.R(.4);const m=x.getTransform();x.setTransform(X.dpr,0,0,X.dpr,0,0);x.beginPath();x.rect(-1e4,-1e4,3e4,1e4+fy);x.clip();x.setTransform(m)}}
function cosLeg(x,...a){cFloor(x);try{return _cosLeg(x,...a)}finally{x.restore()}}
function cosArm(x,...a){cFloor(x);try{return _cosArm(x,...a)}finally{x.restore()}}
function cosHand(x,...a){cFloor(x);try{return _cosHand(x,...a)}finally{x.restore()}}
function cosFore(x,...a){cFloor(x);try{return _cosFore(x,...a)}finally{x.restore()}}
function cosTorso(x,...a){cFloor(x);try{return _cosTorso(x,...a)}finally{x.restore()}}
function cosHead(x,...a){cFloor(x);try{return _cosHead(x,...a)}finally{x.restore()}}
function cosTorsoF(...a){return _cosTorsoF(...a)}
function cosHeadF(...a){return _cosHeadF(...a)}
/* ---------- side view ---------- */
function _cosLeg(x,kit,H_,K_,A_,nT,nS,pT,pS,near){const C=COS,X=CX,K=LOOK[X.g],B=X.B,R=X.R,mini=X.mini;
  if(C.wide&&C.bl>=.8){const w=C.wide,ws=C.hakama?w*1.3:w*.8;kit.limb(H_,K_,pT,nT,K.bot,0,1,w);kit.cap(K_,R(B.knee+w*.85),K.bot);kit.limb(K_,A_,pS,nS,K.bot,0,C.bl,ws);
    if(C.hakama&&!mini){for(const q of[-.45,.1,.6])cLine(x,kit,cLP(kit,H_,K_,pT,nT,.15,q,w),cLP(kit,K_,A_,pS,nS,.92,q,ws),"#000000",R(.5),.28)}}
  else if(C.wide&&C.bl<.8)kit.limb(H_,K_,pT,nT,K.bot,0,C.bl,C.wide);
  if(C.stripe&&!mini){cLine(x,kit,cLP(kit,H_,K_,pT,nT,.06,.8,C.wide),cLP(kit,H_,K_,pT,nT,.98,.8,C.wide),C.stripe,R(.9),.9);cLine(x,kit,cLP(kit,K_,A_,pS,nS,.02,.8,C.wide*.8),cLP(kit,K_,A_,pS,nS,.92,.8,C.wide*.8),C.stripe,R(.9),.9)}
  if(C.jacket)kit.limb(H_,K_,pT,nT,K.top,0,.2,Math.max(C.wide||0,.6)+.5);
  if(C.mawashi)kit.limb(H_,K_,pT,nT,T3(C.mawashi),0,.13,1.7);
  if(C.skirt){const k=C.skirt;kit.limb(H_,K_,pT,nT,T3(k.c),0,k.len,k.add+(C.bl>=.8?C.wide||0:0));
    if(!mini){const ad=k.add+(C.bl>=.8?C.wide||0:0);if(k.plate){for(let i=1;i<=3;i++){const t=k.len*i/4;cLine(x,kit,cLP(kit,H_,K_,pT,nT,t,1,ad),cLP(kit,H_,K_,pT,nT,t,-1,ad),C.ac2||"#000",R(.55),.8)}}
      else for(let i=1;i<k.n;i++){const q=-1+2*i/k.n;cLine(x,kit,cLP(kit,H_,K_,pT,nT,.03,q,ad),cLP(kit,H_,K_,pT,nT,k.len*.97,q,ad),"#000000",R(.5),.35)}}}
  if(C.knee&&!mini)cLine(x,kit,cLP(kit,K_,A_,pS,nS,.16,1,C.wide),cLP(kit,K_,A_,pS,nS,.16,-1,C.wide),"#b9bec3",R(.7),.9);
  if(C.shin){const sc=T3(C.shin.c);if(C.shin.t==="guard"){kit.limb(K_,A_,pS,nS,sc,.08,.88,(C.bl>=.8?C.wide*.8:0)+1.1);kit.cap(K_,R(B.knee+.9+(C.bl>=.8?C.wide*.8:0)),sc)}
    else{kit.limb(K_,A_,pS,nS,sc,.25,.97,(C.bl>=.8?C.wide*.8:0)+.6);if(!mini)for(const t of[.4,.55,.7,.85])cLine(x,kit,cLP(kit,K_,A_,pS,nS,t,1,C.wide*.8+.6),cLP(kit,K_,A_,pS,nS,t+.08,-1,C.wide*.8+.6),"#000000",R(.45),.35)}}
  if(C.greave&&near){kit.limb(K_,A_,pS,nS,T3(C.greave),.06,.9,1);kit.cap(K_,R(B.knee+1.2),T3(C.greave));if(!mini)cLine(x,kit,cLP(kit,K_,A_,pS,nS,.12,.85,1),cLP(kit,K_,A_,pS,nS,.85,.85,1),"#ffffff",R(.6),.35)}
  if(C.boot)kit.limb(K_,A_,pS,nS,T3(C.boot),.7,1,.55);
  if(C.ankle)kit.limb(K_,A_,pS,nS,T3(C.ankle),.84,1,.45)}
function _cosArm(x,kit,S_,E_,Hd,nU,nA,pU,near){const C=COS,X=CX,K=LOOK[X.g],B=X.B,R=X.R,mini=X.mini;
  if(C.fsl&&C.top!=="skin"){kit.cap(E_,R(B.elbow+.6),K.top);kit.limb(E_,Hd,B.fa,nA,K.top,0,C.fsl,.6);if(C.cuff)kit.limb(E_,Hd,B.fa,nA,T3(C.cuff),Math.max(0,C.fsl-.16),C.fsl,.8)}
  if(C.sode){kit.limb(S_,E_,pU,nU,T3(C.ac),0,.6,2.2);if(!mini)for(const t of[.15,.3,.45])cLine(x,kit,cLP(kit,S_,E_,pU,nU,t,1,2.2),cLP(kit,S_,E_,pU,nU,t,-1,2.2),C.ac2,R(.5),.85)}
  if(C.manica&&near){const mc=T3(C.manica);kit.limb(S_,E_,pU,nU,mc,.3,1,.8);kit.cap(E_,R(B.elbow+.9),mc);kit.limb(E_,Hd,B.fa,nA,mc,0,.8,.7);
    if(!mini)for(const t of[.45,.6,.75,.9])cLine(x,kit,cLP(kit,S_,E_,pU,nU,t,1,.8),cLP(kit,S_,E_,pU,nU,t,-1,.8),"#000000",R(.45),.35)}}
function _cosHand(x,kit,Hd,E_,hm,hk){const C=COS,X=CX;if(!C.glove)return false;if(C.gl1&&hk!=="hand"&&hk!=="handR")return false;
  const G=C.glove,B=X.B,g=X.g,s=X.s,mini=X.mini,K=LOOK[g],r=B.hand*s,col=T3(G.c);
  const flat=hm.m==="flat";const f=flat?hm.d:norm2(sub(Hd,E_));const n=[-f[1],f[0]];const up=flat?[0,-1]:n;
  if(G.t==="box"){const c=flat?[Hd[0]+f[0]*r*1.35+up[0]*r*.95,Hd[1]+f[1]*r*1.35+up[1]*r*.95]:[Hd[0]+f[0]*r*1.1,Hd[1]+f[1]*r*1.1];
    kit.limb([Hd[0]-f[0]*r*1.3,Hd[1]-f[1]*r*1.3],[Hd[0]+f[0]*r*.3,Hd[1]+f[1]*r*.3],{f:[1.15,1.2,0,.5,.3],b:[1.15,1.2,0,.5,.3]},n,col,0,1,B.hand*.0);
    kit.blob(cEll(c,r*1.9,r*1.62,Math.atan2(f[1],f[0]),mini?8:14),col,[c[0]-f[0]*r,c[1]-f[1]*r],[c[0]+f[0]*r,c[1]+f[1]*r],r*1.4);
    if(!mini){const tc=[c[0]-f[0]*r*.4+up[0]*r*1.35,c[1]-f[1]*r*.4+up[1]*r*1.35];kit.blob(cEll(tc,r*.85,r*.5,Math.atan2(f[1],f[0]),10),col);
      cLine(x,kit,[Hd[0]-f[0]*r*.9+n[0]*r*1.1,Hd[1]-f[1]*r*.9+n[1]*r*1.1],[Hd[0]-f[0]*r*.9-n[0]*r*1.1,Hd[1]-f[1]*r*.9-n[1]*r*1.1],"#e9ecee",r*.32,.85)}
    return true}
  if(G.t==="fence"||G.t==="kote"){const big=G.t==="kote";drawHand(x,kit,Hd,E_,g,s,mini,big?col:T3(G.c),hm.m,hm.d);
    const e2=norm2(sub(Hd,E_));const a=[Hd[0]-e2[0]*r*(big?2.6:2.1),Hd[1]-e2[1]*r*(big?2.6:2.1)];const pr={f:[big?1.45:1.15,big?1.3:1.05,0,.5,.3],b:[big?1.45:1.15,big?1.3:1.05,0,.5,.3]};
    kit.limb(a,Hd,{f:pr.f.map((v,i)=>i<2?v*B.hand:v),b:pr.b.map((v,i)=>i<2?v*B.hand:v)},[-e2[1],e2[0]],big?T3(G.c2):col,0,1);return true}
  /* mma pad / hand wraps: hand stays visible, padding over the back of the hand and the wrist */
  drawHand(x,kit,Hd,E_,g,s,mini,K.skin,hm.m,hm.d);
  const wrap=G.t==="wrap";const a=[Hd[0]-f[0]*r*(wrap?.9:.6),Hd[1]-f[1]*r*(wrap?.9:.6)],b=[Hd[0]+f[0]*r*(flat?1.5:1.05)+up[0]*r*(flat?.35:0),Hd[1]+f[1]*r*(flat?1.5:1.05)+up[1]*r*(flat?.35:0)];
  x.beginPath();capsule(x,a,b,r*(wrap?.78:.86),r*(wrap?.66:.8));x.fillStyle=kit.base(col);x.fill();
  if(!mini){if(wrap){for(const t of[.25,.55,.8])cLine(x,kit,[lerpP(a,b,t)[0]+n[0]*r*.7,lerpP(a,b,t)[1]+n[1]*r*.7],[lerpP(a,b,t+.12)[0]-n[0]*r*.7,lerpP(a,b,t+.12)[1]-n[1]*r*.7],"#000000",r*.12,.18)}
    else cLine(x,kit,[a[0]+(b[0]-a[0])*.32+n[0]*r*.85,a[1]+(b[1]-a[1])*.32+n[1]*r*.85],[a[0]+(b[0]-a[0])*.32-n[0]*r*.85,a[1]+(b[1]-a[1])*.32-n[1]*r*.85],"#000000",r*.18,.4)}
  return true}
/* forearm overlay for the "grip hand in front of a plate" redraw */
function _cosFore(x,kit,E_,H_,n,t0){const C=COS,K=LOOK[CX.g],B=CX.B;if(C.fsl&&C.top!=="skin"&&C.fsl>t0)kit.limb(E_,H_,B.fa,n,K.top,t0,C.fsl,.6);if(C.manica)kit.limb(E_,H_,B.fa,n,T3(C.manica),t0,.8,.7)}
function _cosTorso(x,kit,Z){const C=COS,X=CX,K=LOOK[X.g],B=X.B,R=X.R,P=X.P,mini=X.mini;const{ax,nF,tp}=Z;
  const PT=(t,v)=>P(add(ax(t),[nF[0]*v,nF[1]*v]));const tf=t=>cTw(B.tf,t),tb=t=>cTw(B.tb,t);
  const band=(t0,t1,col,lines)=>{x.save();x.beginPath();smooth(x,tp);x.clip();x.beginPath();polyPath(x,[PT(t0,40),PT(t1,40),PT(t1,-40),PT(t0,-40)]);x.fillStyle=kit.base(col);x.fill();
    if(lines&&!mini){cLine(x,kit,PT(t1,40),PT(t1,-40),"#000000",R(.5),.3);cLine(x,kit,PT(t0,40),PT(t0,-40),"#000000",R(.5),.3)}x.restore()};
  const shell=(t0,t1,gf,gb,col)=>{const pts=[];const N=mini?4:8;for(let i=0;i<=N;i++){const t=t0+(t1-t0)*i/N;pts.push(PT(t,tf(t)+gf))}for(let i=N;i>=0;i--){const t=t0+(t1-t0)*i/N;pts.push(PT(t,gb==null?-tb(t)*.1:-(tb(t)+gb)))}kit.blob(pts,T3(col),P(ax(t0)),P(ax(t1)),R(14));return pts};
  if(C.jacket)band(.22,-.5,K.top);
  if(C.singlet&&!mini){x.save();x.beginPath();smooth(x,tp);x.clip();cLine(x,kit,PT(.94,tf(.94)*.5),PT(.62,tf(.62)*1.1),"#000000",R(.6),.25);x.restore()}
  if(C.lapel&&C.jacket){x.save();x.beginPath();smooth(x,tp);x.clip();x.strokeStyle=kit.base(T3(C.lapel));x.lineWidth=R(3*(C.lw||1));x.lineCap="butt";x.beginPath();const a=PT(.98,tf(.98)*.15),b=PT(.62,tf(.62)*.85),c=PT(.24,tf(.24)+1);x.moveTo(a[0],a[1]);x.quadraticCurveTo(b[0],b[1],c[0],c[1]);x.stroke();
    if(!mini){x.strokeStyle="rgba(0,0,0,.28)";x.lineWidth=Math.max(.5,R(.45));x.stroke()}x.restore()}
  if(C.jline&&!mini){x.save();x.beginPath();smooth(x,tp);x.clip();cLine(x,kit,PT(.97,tf(.97)*.4),PT(.3,tf(.3)*.75),"#9aa1a8",R(.6),.8);cLine(x,kit,PT(.9,-tb(.9)*.5),PT(.55,-tb(.55)*.9),"#9aa1a8",R(.5),.5);x.restore()}
  if(C.frog&&!mini){x.save();x.beginPath();smooth(x,tp);x.clip();for(const t of[.5,.62,.74,.86])cLine(x,kit,PT(t,tf(t)-2.2),PT(t,tf(t)+.5),C.frog,R(.9),.9);x.restore()}
  if(C.band)band(.18,.245,T3(C.band),true);
  if(C.armor==="samurai"){shell(.3,1.0,1.6,1.6,C.ac);if(!mini)for(let t=.38;t<.95;t+=.1)cLine(x,kit,PT(t,tf(t)+1.6),PT(t,-(tb(t)+1.6)),C.ac2,R(.5),.85)}
  if(C.armor==="do"||C.armor==="hogu"){shell(C.armor==="do"?.42:.3,.95,1.7,null,C.ac);if(C.armor==="do"){const m=[];for(let i=0;i<=4;i++){const t=.86+.1*i/4;m.push(PT(t,tf(t)+1.9))}for(let i=4;i>=0;i--){const t=.86+.1*i/4;m.push(PT(t,0))}kit.blob(m,T3(C.ac2))}
    else if(!mini){const a=PT(.93,tf(.93)+1.5),b=PT(.32,tf(.32)+1.5);cLine(x,kit,a,b,C.ac2,R(.8),.8)}}
  if(C.armor==="glad"){band(.12,.27,T3(C.ac),true);if(!mini){for(const v of[.7,.2,-.4])x.fillStyle=cDim(kit,C.ac2),x.beginPath(),circ(x,PT(.195,v*(v>0?tf(.195):tb(.195))),R(.9)),x.fill()}
    x.save();x.beginPath();smooth(x,tp);x.clip();x.strokeStyle=kit.base(T3(C.ac));x.lineWidth=R(2.2);x.beginPath();const a=PT(.99,tf(.99)*.2),b=PT(.42,-tb(.42)*1.1);x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();x.restore()}
  if(C.mawashi){const pts=[];for(const t of[-.06,.04,.14,.25])pts.push(PT(t,tf(t)+1.8));for(const t of[.25,.14,.04,-.06])pts.push(PT(t,-(tb(t)+1.8)));kit.blob(pts,T3(C.mawashi),P(ax(-.06)),P(ax(.25)),R(12));
    if(!mini){for(const t of[.05,.15])cLine(x,kit,PT(t,tf(t)+1.6),PT(t,-(tb(t)+1.6)),"#ffffff",R(.4),.12);kit.blob(cEll(PT(.17,-(tb(.17)+2.4)),R(3),R(2.4),0,10),T3(C.mawashi))}}
  if(C.belt){const b=C.belt;if(b.cord){x.save();x.beginPath();smooth(x,tp);x.clip();x.strokeStyle=kit.base(T3(b.c));x.lineWidth=R(1.3);x.beginPath();const a=PT((b.t0+b.t1)/2,40),c=PT((b.t0+b.t1)/2,-40);x.moveTo(a[0],a[1]);x.lineTo(c[0],c[1]);x.stroke();x.restore()}
    else band(b.t0,b.t1,T3(b.c),true);
    if(b.knot){const tc=(b.t0+b.t1)/2;const k=add(ax(tc),[nF[0]*(tf(tc)+.6),nF[1]*(tf(tc)+.6)]);kit.blob(cEll(P(k),R(b.cord?1.2:2.1),R(b.cord?1.2:1.6),0,8),T3(b.c));cEnds(x,kit,k,b.ends||9,b.c,b.cord?.9:1.7,b.cord)}}}
function _cosHead(x,kit){const C=COS,X=CX;if(!C.head)return;const o=X.o,def=X.def;const hu=V(o._hA!=null?o._hA:o._torso+(def.A.neck||0)+(o._neckOff||0),1);let hF=[hu[1],-hu[0]];if(def.flip)hF=[-hF[0],-hF[1]];
  const r=X.B.head,hd=o.head;const at=(f,v)=>X.P(add(hd,[hF[0]*f*r+hu[0]*v*r,hF[1]*f*r+hu[1]*v*r]));cHeadDraw(x,kit,C.head,at,X.R(r),false)}
/* shared head gear: at(f,v) = head frame (f forward/right, v up) in head radii; hr = head radius on screen; fr = front view */
function cHeadDraw(x,kit,H,at,hr,fr){const X=CX,mini=X.mini,col=T3(H.c),K=LOOK[X.g];const ln=(a,b,c,w,al)=>cLine(x,kit,a,b,c,w,al);
  const eye=(f,v)=>{if(mini)return;const e=at(f,v);x.fillStyle="#f2eee8";x.beginPath();x.ellipse(e[0],e[1],hr*.12,hr*.065,0,0,7);x.fill();x.fillStyle="#140b07";x.beginPath();x.arc(e[0]+(fr?0:hr*.05),e[1],hr*.055,0,7);x.fill()};
  if(H.t==="guard"){if(fr){x.beginPath();smooth(x,[at(0,1.3),at(.95,.95),at(1.12,.1),at(.95,-.75),at(.55,-1.1),at(-.55,-1.1),at(-.95,-.75),at(-1.12,.1),at(-.95,.95)]);{const c=at(0,-.08);x.moveTo(c[0]+hr*.6,c[1]);x.ellipse(c[0],c[1],hr*.6,hr*.82,0,0,7,true)}x.fillStyle=kit.base(col);x.fill("evenodd")}
      else{kit.blob([at(.72,.55),at(.52,1.12),at(-.25,1.27),at(-.98,.92),at(-1.14,.2),at(-1,-.42),at(-.55,-.76),at(.18,-1.04),at(.46,-.96),at(.3,-.55),at(.42,-.1),at(.5,.3)],col,at(0,1),at(-1,-.2),hr);
        if(!mini){const e=at(-.2,-.05);x.beginPath();x.ellipse(e[0],e[1],hr*.34,hr*.4,0,0,7);x.fillStyle=kit.base([shade(H.c,-.6),shade(H.c,-.25),H.c]);x.fill()}}
    if(!mini)ln(at(fr?-.7:.55,fr?1.08:.9),at(fr?.7:-.85,fr?1.08:.75),"#ffffff",hr*.08,.25);return}
  if(H.t==="ear"){for(const sx of fr?[-1,1]:[0]){const e=fr?at(sx*1.02,.02):at(-.2,-.02);kit.blob(cEll(e,hr*(fr?.22:.38),hr*.42,0,10),col)}
    ln(at(fr?-.9:-.2,fr?.3:.38),at(0,1.14),H.c,hr*.16);if(fr)ln(at(.9,.3),at(0,1.14),H.c,hr*.16);ln(at(fr?-.8:-.2,-.4),at(fr?0:.4,-1.08),H.c,hr*.1);if(fr)ln(at(.8,-.4),at(0,-1.08),H.c,hr*.1);return}
  if(H.t==="hood"){if(fr)kit.blob([at(0,1.3),at(.98,.92),at(1.1,.05),at(.95,-.75),at(.5,-1.15),at(0,-1.25),at(-.5,-1.15),at(-.95,-.75),at(-1.1,.05),at(-.98,.92)],col);
      else kit.blob([at(.98,.5),at(.6,1.13),at(-.25,1.29),at(-1.05,.92),at(-1.2,.2),at(-1.05,-.5),at(-.55,-1.02),at(.2,-1.1),at(.82,-.86),at(1.16,-.4),at(1.22,-.1),at(1.1,.05)],col);
    const sl=fr?[at(-.66,.2),at(.66,.2),at(.6,-.17),at(-.6,-.17)]:[at(.42,.3),at(1.13,.3),at(1.16,-.02),at(.42,-.02)];x.beginPath();smooth(x,sl);x.fillStyle=kit.base(K.skin);x.fill();
    if(fr){eye(-.34,.02);eye(.34,.02)}else eye(.66,.14);return}
  if(H.t==="mask"){const mesh=fr?cEll(at(0,.02),hr*1.0,hr*1.22,0,16):[at(.22,1.06),at(.86,.82),at(1.32,.2),at(1.32,-.48),at(1.02,-1.02),at(.42,-1.16),at(.2,-.55)];
    /* hood (Haube) over the back of the head and the nape: hair and ponytail are tucked in */
    if(fr)cPoly(x,kit,cEll(at(0,-.02),hr*1.12,hr*1.34,0,16),"#e9ebe8",true);
    else{cPoly(x,kit,[at(.3,1.12),at(-.35,1.36),at(-1.12,1.0),at(-1.3,.2),at(-1.22,-.65),at(-.9,-1.25),at(-.2,-1.5),at(.35,-1.2),at(.3,-.4)],"#e9ebe8",true);
      if(!mini){ln(at(-.95,.75),at(-1.1,-.9),"#000000",hr*.05,.18);ln(at(-.3,1.3),at(-1.2,.0),"#000000",hr*.05,.12)}}
    ln(fr?at(-1,.6):at(.25,1.0),fr?at(1,.6):at(-.92,.55),H.c,hr*(fr?.2:.22));
    const bib=fr?[at(-.75,-.95),at(.75,-.95),at(.62,-1.55),at(-.62,-1.55)]:[at(.42,-1.08),at(1.08,-.95),at(1.0,-1.48),at(.25,-1.52)];cPoly(x,kit,bib,"#eef0ef",true);
    x.save();x.globalAlpha=.55;cPoly(x,kit,mesh,H.c,true);x.restore();
    if(!mini){x.save();x.beginPath();smooth(x,mesh);x.clip();x.strokeStyle="rgba(170,180,190,.35)";x.lineWidth=Math.max(.4,hr*.035);x.beginPath();for(let i=-6;i<=6;i++){const a=at(i*.2,1.4),b=at(i*.2,-1.4),c=at(-1.5,i*.22),d=at(1.5,i*.22);x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.moveTo(c[0],c[1]);x.lineTo(d[0],d[1])}x.stroke();x.restore();
      x.beginPath();smooth(x,mesh);x.strokeStyle=cDim(kit,"#5e666e");x.lineWidth=Math.max(.6,hr*.09);x.stroke()}return}
  if(H.t==="men"){/* kendo helmet: padded hood, grill over the face (face stays visible), flaps to the shoulders */
    if(fr){kit.blob([at(-1.15,-.3),at(-1.55,-1.5),at(-.55,-1.62),at(-.7,-.6)],col);kit.blob([at(1.15,-.3),at(1.55,-1.5),at(.55,-1.62),at(.7,-.6)],col);kit.blob([at(0,1.35),at(1.05,1.0),at(1.22,.1),at(1.1,-.7),at(.75,-.6),at(.8,.7),at(-.8,.7),at(-.75,-.6),at(-1.1,-.7),at(-1.22,.1),at(-1.05,1.0)],col)}
    else{kit.blob([at(-.95,-.15),at(-1.4,-1.5),at(-.3,-1.66),at(.1,-1.0)],col);kit.blob([at(.55,1.1),at(-.3,1.34),at(-1.1,.95),at(-1.28,.2),at(-1.15,-.6),at(-.6,-1.0),at(.1,-.95),at(.25,.2),at(.4,.75)],col)}
    const gr=fr?cEll(at(0,-.05),hr*.86,hr*1.08,0,14):[at(.3,.95),at(.95,.75),at(1.3,.15),at(1.28,-.55),at(.95,-1.02),at(.35,-1.05),at(.2,-.2)];
    x.save();x.globalAlpha=.22;cPoly(x,kit,gr,"#0b0e12",true);x.restore();
    if(!mini){x.save();x.beginPath();smooth(x,gr);x.clip();for(let i=-4;i<=5;i++){const v=i*.22;ln(at(-1.6,v),at(1.6,v),H.c2,hr*.07,.95)}ln(at(fr?0:.95,1.2),at(fr?0:1.05,-1.2),H.c2,hr*.08,.95);x.restore()}
    x.beginPath();smooth(x,gr);x.strokeStyle=cDim(kit,H.c2);x.lineWidth=Math.max(.7,hr*.12);x.stroke();return}
  if(H.t==="kabuto"||H.t==="galea"){const kb=H.t==="kabuto";
    if(fr){if(kb){kit.blob([at(-.85,.35),at(-1.45,-.45),at(-1.25,-.7),at(-.75,-.2)],col);kit.blob([at(.85,.35),at(1.45,-.45),at(1.25,-.7),at(.75,-.2)],col)}
        else{kit.blob([at(-.98,.4),at(-1.05,-.55),at(-.62,-.8),at(-.58,.1)],col);kit.blob([at(.98,.4),at(1.05,-.55),at(.62,-.8),at(.58,.1)],col)}
        kit.blob([at(-1.02,.38),at(-.95,1.0),at(0,1.42),at(.95,1.0),at(1.02,.38),at(.4,.45),at(-.4,.45)],col,at(0,1.4),at(0,.3),hr);ln(at(kb?-1.2:-1.08,.36),at(kb?1.2:1.08,.36),kb?H.c2:H.c,hr*.16)}
    else{if(kb){kit.blob([at(-.6,.5),at(-1.08,.5),at(-1.55,-.3),at(-1.3,-.62),at(-.45,-.15)],col);if(!mini)for(const v of[.2,-.1,-.38])ln(at(-1.0,v+.05),at(-1.42,v-.08),H.c2,hr*.06,.9)}
        else{kit.blob([at(.15,.42),at(.62,.36),at(.66,-.48),at(.25,-.82),at(-.05,-.3)],col);kit.blob([at(-.7,.45),at(-1.12,.45),at(-1.25,-.2),at(-.8,-.3)],col)}
        kit.blob([at(.8,.48),at(.6,1.12),at(-.25,1.36),at(-1.02,.98),at(-1.16,.42)],col,at(0,1.3),at(-1,.3),hr);ln(at(kb?1.25:1.1,.38),at(-1.2,.45),kb?H.c2:H.c,hr*.14)}
    if(!mini){ln(at(fr?0:.4,1.38),at(fr?0:-.6,1.22),"#ffffff",hr*.06,.18);if(kb)ln(at(fr?-.3:.1,.48),at(fr?.3:.6,.47),H.c2,hr*.08,.9)}return}}

/* ---------- front view ---------- */
function _cosTorsoF(x,kit,tor,shY,hipY,G){const C=COS,X=CX,K=LOOK[X.g],B=X.B,R=X.R,P=X.P,mini=X.mini;
  const clip=f=>{x.save();x.beginPath();smooth(x,tor);x.clip();f();x.restore()};const rect=(y0,y1,col)=>{const a=P([-60,y0]),b=P([60,y1]);x.fillStyle=typeof col==="string"?cDim(kit,col):kit.base(col);x.fillRect(a[0],a[1],b[0]-a[0],b[1]-a[1])};
  const fem=X.g==="f";
  if(C.jacket)clip(()=>rect(hipY+12.5,hipY-20,K.top));
  if(C.lapel&&C.jacket){clip(()=>{x.beginPath();polyPath(x,[P([-B.neck*1.15,shY+6]),P([B.neck*1.15,shY+6]),P([0,shY-(fem?8:15)])]);x.fillStyle=kit.base(K.skin);x.fill();
    const lw=R(3.2*(C.lw||1));x.lineCap="butt";for(const[a,b]of[[[B.neck*1.2,shY+6],[-G.wa*.25,hipY+15]],[[-B.neck*1.2,shY+6],[G.wa*.55,hipY+13]]]){const A=P(a),Bb=P(b);x.strokeStyle=kit.base(T3(C.lapel));x.lineWidth=lw;x.beginPath();x.moveTo(A[0],A[1]);x.lineTo(Bb[0],Bb[1]);x.stroke();if(!mini){x.strokeStyle="rgba(0,0,0,.25)";x.lineWidth=Math.max(.5,R(.45));x.stroke()}}})}
  if(C.singlet&&!mini)clip(()=>{for(const sx of[-1,1])cLine(x,kit,P([sx*B.neck*1.3,shY+5]),P([sx*G.ch*.75,shY-14]),"#000000",R(.6),.25)});
  if(C.jline&&!mini)clip(()=>cLine(x,kit,P([B.neck*1.1,shY+5]),P([G.wa*.55,hipY+14]),"#9aa1a8",R(.6),.8));
  if(C.frog&&!mini)clip(()=>{cLine(x,kit,P([0,shY+4]),P([0,hipY+14]),"#000000",R(.5),.4);for(const dy of[8,14.5,21,27.5])cLine(x,kit,P([-3.2,shY-dy]),P([3.2,shY-dy]),C.frog,R(.9),.9)});
  if(C.band)clip(()=>{rect(hipY+15.5,hipY+10,T3(C.band));if(!mini)cLine(x,kit,P([-40,hipY+10]),P([40,hipY+10]),"#000000",R(.5),.3)});
  if(C.armor==="samurai"){kit.blob([P([-G.ch-1.8,shY-2]),P([G.ch+1.8,shY-2]),P([G.ch+2,shY-20]),P([G.wa+2.6,hipY+12]),P([-G.wa-2.6,hipY+12]),P([-G.ch-2,shY-20])],T3(C.ac),P([0,hipY]),P([0,shY]),R(G.sh));
    if(!mini)for(let y=shY-8;y>hipY+13;y-=6.5)cLine(x,kit,P([-G.ch-1.4,y]),P([G.ch+1.4,y]),C.ac2,R(.5),.85)}
  if(C.armor==="do"||C.armor==="hogu"){const d=C.armor==="do";kit.blob([P([-G.ch-.8,shY-(d?7:3)]),P([G.ch+.8,shY-(d?7:3)]),P([G.ch+1.8,shY-20]),P([G.wa+2.6,hipY+(d?15:12)]),P([0,hipY+(d?12:9)]),P([-G.wa-2.6,hipY+(d?15:12)]),P([-G.ch-1.8,shY-20])],T3(C.ac),P([0,hipY]),P([0,shY]),R(G.sh));
    if(d)kit.blob([P([-G.ch*.85,shY-1]),P([G.ch*.85,shY-1]),P([G.ch*.9,shY-8]),P([-G.ch*.9,shY-8])],T3(C.ac2));else if(!mini)cLine(x,kit,P([0,shY-5]),P([0,hipY+11]),C.ac2,R(.8),.7)}
  if(C.armor==="glad"){clip(()=>{rect(hipY+20,hipY+9,T3(C.ac));x.strokeStyle=kit.base(T3(C.ac));x.lineWidth=R(2.4);x.beginPath();const a=P([(G.shV||G.sh)*.72,shY+2]),b=P([-G.wa-2,hipY+18]);x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()});
    if(!mini)for(const xx of[-6,0,6]){x.fillStyle=cDim(kit,C.ac2);x.beginPath();circ(x,P([xx,hipY+14.5]),R(.9));x.fill()}}
  if(C.mawashi){kit.blob([P([-G.hi-2.2,hipY+19]),P([G.hi+2.2,hipY+19]),P([G.hi+2.6,hipY+2]),P([3.6,hipY+1]),P([2.2,hipY-14]),P([-2.2,hipY-14]),P([-3.6,hipY+1]),P([-G.hi-2.6,hipY+2])],T3(C.mawashi),P([0,hipY-10]),P([0,hipY+19]),R(10));
    if(!mini)for(const y of[hipY+8,hipY+14])cLine(x,kit,P([-G.hi-1.6,y]),P([G.hi+1.6,y]),"#ffffff",R(.4),.12)}
  if(C.belt){const b=C.belt;const yc=hipY+12.5,hw=b.cord?.65:(b.t1-b.t0)*30;clip(()=>{rect(yc+hw,yc-hw,T3(b.c));if(!mini&&!b.cord)cLine(x,kit,P([-40,yc-hw]),P([40,yc-hw]),"#000000",R(.5),.3)});
    if(b.knot){const k=[1.5,yc];kit.blob(cEll(P(k),R(b.cord?1.2:2.2),R(b.cord?1.2:1.7),0,8),T3(b.c));cEnds(x,kit,k,b.ends||9,b.c,b.cord?.9:1.7,b.cord)}}}
function _cosHeadF(x,kit,hd,hr){const C=COS;if(!C.head)return;const at=(f,v)=>[hd[0]+f*hr,hd[1]-v*hr];cHeadDraw(x,kit,C.head,at,hr,true)}

/* ---------- Einstellungen › Extras ---------- */
function extrasCard(){const e=exS();
  if(!e.u)return`<form class="card" id="exCard" autocomplete="off"><div class="label">Extras</div><p class="muted" style="margin:0;font-size:13px">Mit einem Kennwort lassen sich hier Extras freischalten.</p>
   <label class="field" for="exPw"><span class="muted" style="font-size:13px">Kennwort</span><input type="password" id="exPw" maxlength="40" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></label>
   <button class="btn small" type="submit" id="exGo">Freischalten</button><p class="muted" id="exMsg" role="status" aria-live="polite" style="margin:0;font-size:13px" hidden></p></form>`;
  const opts=v=>[["none","Kein Kostüm"],["rand","Zufällig pro Training"],...COSL.map(c=>[c[0],c[1]])].map(([k,l])=>`<option value="${k}"${v===k?" selected":""}>${esc(l)}</option>`).join("");
  const col=(g,l)=>`<div class="field" style="min-width:0;gap:6px"><span class="label">${l}</span><canvas id="exCv${g}" aria-label="Vorschau ${l}" style="width:100%;height:170px;display:block;border-radius:12px;background:rgba(0,0,0,.18)"></canvas>
     <select id="exSel${g}" aria-label="Kostüm ${l}">${opts(e[g])}</select><span class="muted" id="exNow${g}" style="font-size:12px;min-height:15px"></span></div>`;
  return`<div class="card" id="exCard"><div class="label">Extras · Kampfsport-Kostüme</div><p class="muted" style="margin:0;font-size:13px">Die Figur trägt in allen Animationen das gewählte Kostüm und wirkt dabei etwas muskulöser. „Zufällig pro Training“ wählt zu jeder Einheit ein Kostüm, das bis zum Ende gleich bleibt.</p>
   <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${col("m","Mann")}${col("f","Frau")}</div></div>`}
function exNowTxt(g){const v=exS()[g];return v==="rand"?"Gerade: "+COSD[cosRand(g)].n:""}
function bindExtras(){const e=exS();const f=$("#exCard");if(!f)return;
  if(!e.u){f.onsubmit=ev=>{ev.preventDefault();const pw=$("#exPw").value;const m=$("#exMsg");
      if(exCheck(pw)){S.extras=Object.assign(exS(),{u:1});save();toast("Extras freigeschaltet");renderSet();const c=$("#exCard");if(c&&c.scrollIntoView)c.scrollIntoView({block:"center"})}
      else{m.hidden=false;m.textContent=pw.trim()?"Das Kennwort passt leider nicht. Versuch es gern noch einmal.":"Bitte gib zuerst ein Kennwort ein.";$("#exPw").select&&$("#exPw").select()}};return}
  for(const g of["m","f"]){const cv=$("#exCv"+g),sel=$("#exSel"+g),nw=$("#exNow"+g);attachAnim(cv,"squat",{g});cv._cos={[g]:e[g]};nw.textContent=exNowTxt(g);
    sel.onchange=()=>{const v=sel.value;if(v!=="none"&&v!=="rand"&&!COSD[v])return;exS()[g]=v;save();cv._cos={[g]:v};nw.textContent=exNowTxt(g)}}}
