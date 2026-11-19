/* ================= 2.1 · YOGA & DEHNEN (@ Joschy) =================
   Zusatzbereich, Kraft bleibt Hauptfokus. Eigene Posen-Bibliothek (YP), eigene Animationen (AN["y_…"]),
   24-Wochen-Plan in 3 Stufen (3.2: Anfänger, Fortgeschritten, Profi), Schnell-Dehnen, Dehnen nach dem Training. Fortschritt in S.yoga (im Backup enthalten).
   Yoga zählt NICHT in Verlauf, Wochenziel oder die Push/Pull/Legs-Erholung. */

/* ---------- engine additions (only used by yoga poses, existing exercises unchanged) ---------- */
/* front view with pelvis height (hy), side shift (hx), side bend (lean), head tilt (tilt), shrug (shr),
   free left arm (uaL/faL), hand targets (hR/hL, local frame) and free legs (kR/aR/kL/aL, world frame) */
function solveFrontY(p,g){const G=BODY[g||"m"].fr;const o={front:1};const shY=150+(p.br||0)+(p.shr||0);const Lc={};
  Lc.shL=[-G.sh+3,shY+(p.shrL||0)];Lc.shR=[G.sh-3,shY];Lc.neck=[0,shY+6];Lc.head=[0,shY+19];
  const us=p.us==null?1:p.us,fs=p.fs==null?1:p.fs;
  const armT=(sh,t,bend)=>{const e=ik2(sh,t,L.ua,L.fa,bend||1);const d=sub(t,e),l=Math.hypot(d[0],d[1])||1;const r=Math.min(l,L.fa);return[e,add(e,[d[0]/l*r,d[1]/l*r])]};
  if(p.hR){[Lc.elbR,Lc.handR]=armT(Lc.shR,p.hR,p.bR)}else{Lc.elbR=add(Lc.shR,V(p.ua,L.ua*us));Lc.handR=add(Lc.elbR,V(p.fa,L.fa*fs))}
  if(p.hL){[Lc.elbL,Lc.handL]=armT(Lc.shL,p.hL,p.bL)}
  else if(p.uaL!=null){const usL=p.usL==null?us:p.usL,fsL=p.fsL==null?fs:p.fsL;Lc.elbL=add(Lc.shL,V(p.uaL,L.ua*usL));Lc.handL=add(Lc.elbL,V(p.faL,L.fa*fsL))}
  else{Lc.elbL=[-Lc.elbR[0],Lc.elbR[1]];Lc.handL=[-Lc.handR[0],Lc.handR[1]]}
  const hx=p.hx||0,hy=p.hy!=null?p.hy:92,lean=p.lean||0;const c=Math.cos(rad(-lean)),sn=Math.sin(rad(-lean));
  const T=q=>{const d=[q[0],q[1]-92];return[hx+d[0]*c-d[1]*sn,hy+d[0]*sn+d[1]*c]};
  o.L=Lc;o._T={hx,hy,lean,tilt:p.tilt||0,rfirst:p.rf?1:0};o._us=us;o.shY=shY;
  for(const k in Lc)o[k]=T(Lc[k]);/* world positions (bounds) */
  o.hipL=T([-G.hipJ,92]);o.hipR=T([G.hipJ,92]);const s=p.s||10;
  o.ankR=p.aR?p.aR.slice():[G.hipJ+s,0];o.ankL=p.aL?p.aL.slice():p.aR?[-p.aR[0],p.aR[1]]:[-G.hipJ-s,0];
  const kneeDef=(h,a,sg)=>[(h[0]+a[0])/2+sg*1.5,(h[1]+a[1])/2];
  o.kneeR=p.kR?p.kR.slice():kneeDef(o.hipR,o.ankR,1);o.kneeL=p.kL?p.kL.slice():p.kR?[-p.kR[0],p.kR[1]]:kneeDef(o.hipL,o.ankL,-1);
  return o}
/* bare foot (side view) */
function drawFootBare(x,kit,a,t,kn,s,mini,fy){const K=kit.K;const F=footFrame(a,t,kn,s,fy);/* 2.2: rolls over the ball, heel + toes hinted */
  const Lp=(p,u,v)=>p===a?F.La(u,v):F.Lt(u,v);
  const pts=[Lp(a,-3.1,1.8),Lp(a,-2.6,-1.9),Lp(a,1.2,-2.4),F.Lb(.3,-1.9),Lp(t,-4,-1.5),Lp(t,-.6,-.9),Lp(t,.9,.1),Lp(t,.5,1.5),Lp(t,-2,2),F.Lb(0,2.1),Lp(a,-2.6,2.5)];
  kit.blob(pts,K.skin,Lp(a,-3,0),Lp(t,1,0),2.5*s);if(mini)return;
  x.strokeStyle="rgba(40,20,10,.3)";x.lineWidth=Math.max(.5,s*.32);x.lineCap="round";x.beginPath();
  for(const v of[-.5,.25]){const p0=Lp(t,-1.3,v),p1=Lp(t,.2,v+.15);x.moveTo(p0[0],p0[1]);x.lineTo(p1[0],p1[1])}
  const h0=Lp(a,-2.4,-1.2),h1=Lp(a,-3.05,.3),h2=Lp(a,-2.3,1.9);x.moveTo(h0[0],h0[1]);x.quadraticCurveTo(h1[0],h1[1],h2[0],h2[1]);x.stroke()}
/* yoga mat on the floor */
function drawMat(ctx,def,o,P,R,fl,front,tr){const cx=def.matX!=null?def.matX:(tr.bx0+tr.bx1)/2;const hw=front?Math.max(52,(tr.bx1-tr.bx0)/2+8):Math.max(70,Math.min(104,(tr.bx1-tr.bx0)/2+16));
  const A=P([cx-hw,fl]),B=P([cx+hw,fl]);const d=R(front?16:5);const k=front?.35:.9;
  ctx.save();ctx.beginPath();ctx.moveTo(A[0]+d*k,A[1]-d);ctx.lineTo(B[0]+(front?-d*k:d*k),B[1]-d);ctx.lineTo(B[0],B[1]);ctx.lineTo(A[0],A[1]);ctx.closePath();
  const g=ctx.createLinearGradient(0,A[1]-d,0,A[1]);g.addColorStop(0,"#123540");g.addColorStop(1,"#1d5565");ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle="#0b222b";ctx.fillRect(A[0],A[1],B[0]-A[0],Math.max(1.5,R(1.8)));
  ctx.strokeStyle=ACol(.4);ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();ctx.restore()}
/* strap (Gurt/Handtuch) from the hand to the foot; the block stands beside the foot (drawn behind the body) */
if(typeof EXTRA_EQ_LAYER!=="undefined")EXTRA_EQ_LAYER.yblock="back";
const _yDrawExtra=drawExtraEq;
drawExtraEq=function(ctx,e,o,P,R,fl,front){if(e.t==="ystrap"){if(!o.hand||!o.toe)return;const a=P(o.hand),b=P(lerpP(o.ankle,o.toe,.55));ctx.save();ctx.strokeStyle="#c9a227";ctx.lineCap="round";ctx.lineWidth=Math.max(1.2,R(1.6));ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.restore();return}
  if(e.t==="yblock"){const c=P([e.x,fl]);const w=R(e.w||16),h=R(e.h||9);ctx.save();ctx.fillStyle="#6b4fa0";ctx.fillRect(c[0]-w/2,c[1]-h,w,h);ctx.fillStyle="rgba(255,255,255,.12)";ctx.fillRect(c[0]-w/2,c[1]-h,w,R(1.5));ctx.restore();return}
  return _yDrawExtra(ctx,e,o,P,R,fl,front)};

/* ---------- poses ---------- */
const YREG=[["schulter","Schulter & Nacken"],["brust","Brust & Arme"],["huefte","Hüfte"],["ruecken","Rücken"],["beine","Beine"],["ganz","Ganzkörper"]];
const YLV=["","Anfänger","Fortgeschritten","Profi"];
const YBR=["Einatmen","Ausatmen"];
/* n: Name, sa: Sanskrit, lv: Stufe 1-3, r: Zielregion, z: Ziel kurz, sec: Haltezeit, uni: einseitig, c: Technik, a: Atem, an: Animation */
const YP={
  berg:{n:"Berghaltung",sa:"Tadasana",lv:1,r:"ganz",z:"Haltung · Atmung",sec:30,
    c:["Füße hüftbreit, Gewicht gleichmäßig auf beiden Füßen","Scheitel zieht nach oben, Schultern sinken nach hinten-unten","Arme locker, Handflächen leicht nach vorn"],a:"Ruhig durch die Nase ein und aus, Bauch weich.",
    an:{view:"front",A:{yf:1,ua:-84,fa:-86,s:5},B:{yf:1,ua:-82,fa:-84,s:5}}},
  schulterkreisen:{n:"Schulterkreisen",lv:1,r:"schulter",z:"Schultern · Nacken",sec:40,
    c:["Schultern langsam Richtung Ohren ziehen","Dann nach hinten und weit nach unten kreisen","Arme hängen locker, Nacken bleibt lang"],a:"Hochziehen beim Einatmen, nach hinten-unten beim Ausatmen.",
    an:{view:"front",A:{yf:1,ua:-86,fa:-88,s:6,shr:0},B:{yf:1,ua:-84,fa:-86,s:6,shr:7},tempo:[1.6,.3,2,.5],ph:["Hoch · einatmen","Zurück & runter"]}},
  nacken:{n:"Nackendehnung seitlich",lv:1,r:"schulter",z:"Seitlicher Nacken",sec:30,uni:1,
    c:["Ohr sanft Richtung Schulter sinken lassen","Die andere Schulter bewusst nach unten schieben","Gegenhand zieht leicht Richtung Boden, kein Ziehen am Kopf"],a:"Mit jedem Ausatmen den Nacken etwas mehr loslassen.",
    an:{view:"front",A:{yf:1,ua:-84,fa:-86,uaL:-100,faL:-102,s:6,tilt:6},B:{yf:1,ua:-84,fa:-86,uaL:-108,faL:-112,s:6,tilt:27},tempo:[3,1.5,3,.8],ph:["Sinken lassen","Lösen"]}},
  kinnbrust:{n:"Nacken lang machen",lv:1,r:"schulter",z:"Hinterer Nacken",sec:30,
    c:["Aufrecht stehen, Kinn langsam Richtung Brust","Hinterkopf zieht sanft nach oben","Schultern bleiben unten und weit"],a:"Einatmen aufrichten, ausatmen Kinn sinken lassen.",
    an:{anchor:"foot",noBal:1,A:{...STAND,upper:-90,fore:-88,neck:-6},B:{...STAND,upper:-90,fore:-88,neck:-38},tempo:[3,1.5,3,1]}},
  armquer:{n:"Arm vor der Brust",lv:1,r:"schulter",z:"Hintere Schulter",sec:30,uni:1,
    c:["Gestreckten Arm auf Schulterhöhe vor die Brust","Mit der anderen Hand oberhalb des Ellbogens sanft heranziehen","Schulter bleibt unten, Oberkörper dreht nicht mit"],a:"Lang ausatmen und die Schulter dabei sinken lassen.",
    an:{view:"front",A:{yf:1,ua:178,fa:180,us:.95,uaL:-112,faL:42,s:6,rf:1},B:{yf:1,ua:183,fa:186,us:.95,uaL:-114,faL:46,s:6,rf:1}}},
  trizeps:{n:"Überkopf-Armdehnung",lv:1,r:"schulter",z:"Trizeps · Lat",sec:30,uni:1,
    c:["Arm nach oben strecken, dann den Ellbogen beugen","Hand gleitet hinter dem Kopf zwischen die Schulterblätter","Kopf drückt sanft gegen den Oberarm, kein Hohlkreuz"],a:"Ruhig in die Flanke atmen.",
    an:{view:"front",A:{yf:1,ua:92,fa:-97,uaL:-118,faL:-35,s:6},B:{yf:1,ua:96,fa:-94,uaL:-118,faL:-35,s:6}}},
  adlerarm:{n:"Adlerarme",sa:"Garudasana-Arme",lv:1,r:"schulter",z:"Schulterblätter · oberer Rücken",sec:30,uni:1,
    c:["Arme vor dem Körper überkreuzen, Ellbogen übereinander","Unterarme umeinander wickeln, Handflächen zueinander","Ellbogen auf Schulterhöhe heben und leicht nach vorn schieben"],a:"In den Raum zwischen den Schulterblättern atmen.",
    an:{view:"front",A:{yf:1,ua:200,fa:94,us:.62,fs:.92,s:6},B:{yf:1,ua:208,fa:91,us:.6,fs:.9,s:6}}},
  brustoeffner:{n:"Brustöffner im Stehen",lv:1,r:"brust",z:"Brust · vordere Schulter",sec:30,
    c:["Hände hinter dem Rücken verschränken","Schulterblätter zusammen, Arme sanft nach hinten-unten","Brustbein hebt sich, Kinn bleibt waagerecht"],a:"Tief in die Brust einatmen.",
    an:{anchor:"foot",noBal:1,A:{...STAND,torso:90,upper:-118,fore:-122,neck:4},B:{...STAND,torso:93,upper:-128,fore:-131,neck:8},tempo:[3,1.5,3,1]}},
  wandengel:{n:"Wandengel",lv:1,r:"schulter",z:"Schulterblätter · Haltung",sec:45,
    c:["Rücken, Po und Hinterkopf an der Wand","Arme wie ein Torpfosten an die Wand legen","Langsam hoch- und runtergleiten, Rücken bleibt an der Wand"],a:"Hochgleiten beim Einatmen, runter beim Ausatmen.",
    an:{view:"front",A:{yf:1,ua:4,fa:90,s:6},B:{yf:1,ua:58,fa:84,s:6},tempo:[2.4,.4,2.8,.6],ph:["Hochgleiten","Runtergleiten"]}},
  seitbeuge:{n:"Seitbeuge im Stehen",lv:1,r:"ruecken",z:"Flanke · Seite",sec:30,uni:1,
    c:["Einen Arm über den Kopf strecken","Oberkörper zur Seite neigen, nicht nach vorn","Beide Füße drücken gleichmäßig in den Boden"],a:"In die gedehnte Flanke einatmen.",
    an:{view:"front",A:{yf:1,ua:-92,fa:-96,uaL:76,faL:38,s:6,lean:12},B:{yf:1,ua:-94,fa:-98,uaL:74,faL:32,s:6,lean:20}}},
  hueftkreisen:{n:"Hüftkreisen",lv:1,r:"huefte",z:"Hüfte · unterer Rücken",sec:40,
    c:["Hände an die Hüfte, Knie weich","Becken in großen, ruhigen Kreisen bewegen","Oberkörper bleibt ruhig über den Füßen"],a:"Gleichmäßig weiteratmen, nach der Hälfte Richtung wechseln.",
    an:{view:"front",A:{yf:1,hR:[13,100],hL:[-13,100],bR:1,bL:-1,s:10,hx:-7,lean:-6},B:{yf:1,hR:[13,100],hL:[-13,100],bR:1,bL:-1,s:10,hx:7,lean:6},tempo:[1.6,0,1.6,0],ph:["Kreisen","Kreisen"]}},
  katzekuh:{n:"Katze-Kuh",sa:"Marjaryasana-Bitilasana",lv:1,r:"ruecken",z:"Wirbelsäule · Rücken",sec:45,
    c:["Vierfüßlerstand: Hände unter den Schultern, Knie unter der Hüfte","Ausatmen: Rücken rund machen, Kinn zur Brust","Einatmen: Brust nach vorn, Blick leicht nach oben"],a:"Die Atmung führt die Bewegung.",
    an:{anchor:"hip",at:[0,51],A:{torso:10.5,thigh:-90,shin:180,upper:-90,fore:-90,foot:180,neck:22,lum:7,tho:3},B:{torso:10.7,thigh:-90,shin:180,upper:-90.5,fore:-90,foot:180,neck:-42,lum:-6,tho:-9},tempo:[3,.6,3,.6],ph:["Ausatmen → Katze","Einatmen → Kuh"]}},
  kind:{n:"Kindshaltung",sa:"Balasana",lv:1,r:"ruecken",z:"Rücken · Hüfte · Schultern",sec:45,
    c:["Auf die Fersen setzen, Knie hüftbreit","Oberkörper auf die Oberschenkel sinken lassen","Arme lang nach vorn, Stirn ruht auf der Matte"],a:"In den unteren Rücken atmen, er hebt und senkt sich.",
    an:{anchor:"hip",at:[0,20],A:{torso:-4,thigh:-20.5,shin:180,foot:180,handAt:[113,5],bend:1,neck:-16,lum:-2,tho:-3},B:{torso:-2,thigh:-20.5,shin:180,foot:180,handAt:[113,5],bend:1,neck:-18,lum:-2,tho:-4}}},
  kniebrust:{n:"Knie zur Brust",sa:"Apanasana",lv:1,r:"ruecken",z:"Unterer Rücken · Gesäß",sec:40,
    c:["Rückenlage, beide Knie zur Brust ziehen","Hände umfassen die Schienbeine","Kreuzbein bleibt am Boden, Schultern locker"],a:"Ausatmen: Knie etwas näher, einatmen: leicht lösen.",
    an:{anchor:"hip",at:[0,9],A:{torso:180,thigh:118,shin:-12,foot:20,handAt:[-24,40],bend:1,neck:0},B:{torso:180,thigh:128,shin:-8,foot:24,handAt:[-29,40],bend:1,neck:0}}},
  figur4:{n:"Taube im Liegen",sa:"Supta Kapotasana",lv:1,r:"huefte",z:"Gesäß · äußere Hüfte",sec:40,uni:1,
    c:["Rückenlage, einen Knöchel über das andere Knie legen","Hinter den Oberschenkel greifen und heranziehen","Oberes Knie sanft nach außen sinken lassen"],a:"Lang ausatmen, die Hüfte öffnet sich mit der Zeit.",
    an:{anchor:"hip",at:[0,9],A:{torso:180,thigh:100,shin:2,foot:40,thigh2:40,shin2:161,foot2:20,handAt:[-14,38],bend:1,neck:-4},B:{torso:180,thigh:106,shin:6,foot:40,thigh2:44,shin2:166,foot2:20,handAt:[-17,38],bend:1,neck:-4}}},
  schmetterling:{n:"Schmetterling",sa:"Baddha Konasana",lv:1,r:"huefte",z:"Innenseite Oberschenkel · Hüfte",sec:45,
    c:["Aufrecht sitzen, Fußsohlen zusammen","Hände umfassen die Füße","Knie sinken lassen, nicht nach unten drücken"],a:"Mit jedem Ausatmen dürfen die Knie etwas tiefer sinken.",
    an:{view:"front",A:{yf:1,hy:13,kR:[40,19],aR:[6,6],hR:[8,88],hL:[-8,88],bR:-1,bL:1},B:{yf:1,hy:13,kR:[42,15],aR:[6,6],hR:[8,88],hL:[-8,88],bR:-1,bL:1}}},
  sphinx:{n:"Sphinx",lv:1,r:"ruecken",z:"Unterer Rücken · Brust",sec:30,
    c:["Bauchlage, Ellbogen unter den Schultern","Unterarme parallel, Brust sanft nach vorn-oben","Po locker, Schultern weg von den Ohren"],a:"Ruhig in den Bauch atmen.",
    an:{anchor:"hip",at:[0,10],flip:1,A:{torso:157,thigh:0,shin:0,foot:-12,handAt:[-88,7],bend:1,neck:-18},B:{torso:158.5,thigh:0,shin:0,foot:-12,handAt:[-88,7],bend:1,neck:-20}}},
  bruecke:{n:"Brücke",sa:"Setu Bandhasana",lv:1,r:"huefte",z:"Hüftbeuger · Gesäß · Brust",sec:30,
    c:["Rückenlage, Füße hüftbreit nah am Po","Becken langsam Wirbel für Wirbel heben","Knie zeigen nach vorn, Nacken bleibt lang"],a:"Oben ruhig weiteratmen, ausatmen beim Ablegen.",
    an:{anchor:"shoulder",at:[0,9],fixFeet:1,A:{torso:203,thigh:6,shin:-53,hand:[40,-6],bend:1,neck:-26},B:{torso:206,thigh:3,shin:-51,hand:[40,-6],bend:1,neck:-30}}},
  savasana:{n:"Endentspannung",sa:"Savasana",lv:1,r:"ganz",z:"Ganzkörper · Ruhe",sec:120,
    c:["Rückenlage, Beine und Arme locker ablegen","Handflächen nach oben, Augen schließen","Nichts mehr tun, einfach liegen"],a:"Natürlich atmen, nichts steuern.",
    an:{anchor:"hip",at:[0,8],A:{torso:180,thigh:0,shin:-2,foot:62,upper:-4,fore:-2,neck:-9},B:{torso:180.6,thigh:0,shin:-2,foot:62,upper:-4,fore:-2,neck:-9},tempo:[4,1,5,1]}},
  sukhasana:{n:"Bequemer Sitz mit Atmung",sa:"Sukhasana",lv:1,r:"ganz",z:"Atmung · Ankommen",sec:60,
    c:["Im Schneidersitz aufrecht sitzen, ggf. auf einem Kissen","Hände ruhen auf den Knien","Schultern sinken, Scheitel zieht nach oben"],a:"4 Sekunden ein, 6 Sekunden aus.",
    an:{view:"front",A:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],hR:[33,100],hL:[-33,100],bR:-1,bL:1},B:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],hR:[33,100],hL:[-33,100],bR:-1,bL:1},tempo:[4,.5,5.5,.5]}},
  tiefausfall:{n:"Tiefer Ausfallschritt kniend",sa:"Anjaneyasana",lv:1,r:"huefte",z:"Hüftbeuger · Oberschenkel vorn",sec:40,uni:1,
    c:["Ein Knie auf der Matte, vorderer Fuß weit vorn","Vorderes Knie über dem Knöchel","Becken sanft nach vorn-unten schieben, Oberkörper aufrecht"],a:"Ausatmen und die Hüfte etwas tiefer sinken lassen.",
    an:{anchor:"hip",at:[0,35],A:{torso:91,thigh:14,shin:-88,foot:0,thigh2:-142,shin2:180,foot2:180,handAt:[30,50],bend:1,neck:0},B:{torso:94,thigh:14,shin:-88,foot:0,thigh2:-142,shin2:180,foot2:180,handAt:[31,49],bend:1,neck:3}}},
  streckung:{n:"Ganzkörperstreckung",lv:1,r:"ganz",z:"Ganzer Körper",sec:30,
    c:["Rückenlage, Arme über den Kopf ablegen","Fingerspitzen und Fersen ziehen auseinander","Unterer Rücken bleibt weich am Boden"],a:"Einatmen und lang machen, ausatmen und lösen.",
    an:{anchor:"hip",at:[0,8],A:{torso:180,thigh:0,shin:-1,foot:58,upper:181,fore:180,neck:-8},B:{torso:180,thigh:0,shin:-1,foot:14,upper:182,fore:182,neck:-8}}},
  sitzseitbeuge:{n:"Seitbeuge im Sitzen",lv:1,r:"ruecken",z:"Flanke · Rücken",sec:30,uni:1,
    c:["Im Schneidersitz eine Hand neben die Hüfte","Anderen Arm über den Kopf zur Seite strecken","Beide Sitzknochen bleiben am Boden"],a:"In die lange Seite atmen.",
    an:{view:"front",A:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],ua:-80,fa:-70,uaL:76,faL:38,lean:14},B:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],ua:-82,fa:-74,uaL:74,faL:30,lean:22}}},
  halbevorbeuge:{n:"Halbe Vorbeuge",sa:"Ardha Uttanasana",lv:1,r:"beine",z:"Beinrückseite · Rücken",sec:30,
    c:["Knie weich, Hüfte nach hinten schieben","Rücken lang und gerade, Hände auf den Oberschenkeln","Scheitel zieht nach vorn, Blick zum Boden"],a:"Einatmen und den Rücken lang machen.",
    an:{anchor:"foot",A:{shin:-93,thigh:-80,torso:14,handAt:[30,62],bend:-1,neck:-4},B:{shin:-93,thigh:-78,torso:12,handAt:[30,60],bend:-1,neck:-4}}},
  vorbeuge:{n:"Vorbeuge im Stehen",sa:"Uttanasana",lv:1,r:"beine",z:"Beinrückseite · Rücken",sec:30,
    c:["Füße hüftbreit, Knie deutlich gebeugt","Oberkörper hängt locker über den Oberschenkeln","Kopf und Arme schwer werden lassen"],a:"Ausatmen und noch etwas mehr loslassen.",
    an:{anchor:"foot",noBal:1,padT:24,A:{shin:-110,thigh:-50,torso:-55,handAt:[36,2],bend:1,neck:-14,lum:-2,tho:-4},B:{shin:-109,thigh:-52,torso:-59,handAt:[36,2],bend:1,neck:-14,lum:-2,tho:-5}}},
  fersensitz:{n:"Fersensitz mit Brustöffner",sa:"Vajrasana",lv:1,r:"brust",z:"Brust · Schultern",sec:30,
    c:["Auf die Fersen setzen, Knie zusammen","Hände hinter dem Rücken verschränken","Arme sanft nach hinten-unten ziehen, Brust hebt sich"],a:"Tief in die Brust einatmen.",
    an:{anchor:"hip",at:[0,20],A:{torso:92,thigh:-20.5,shin:180,foot:180,upper:-126,fore:-128,neck:4},B:{torso:94,thigh:-20.5,shin:180,foot:180,upper:-134,fore:-137,neck:8}}},
  beingurt:{n:"Beinrückseite mit Gurt",sa:"Supta Padangusthasana",lv:1,r:"beine",z:"Beinrückseite · Wade",sec:40,uni:1,
    c:["Rückenlage, Gurt oder Handtuch um den Fuß","Bein nach oben strecken, Knie darf leicht gebeugt sein","Anderes Bein liegt lang, Kopf bleibt am Boden"],a:"Ausatmen und das Bein ein kleines Stück heranziehen.",
    an:{anchor:"hip",at:[0,8],A:{torso:180,thigh:76,shin:78,foot:4,thigh2:0,shin2:-1,foot2:62,handAt:[-24,50],bend:1,neck:-6},B:{torso:180,thigh:82,shin:84,foot:10,thigh2:0,shin2:-1,foot2:62,handAt:[-24,52],bend:1,neck:-6},eq:[{t:"ystrap"}]}},
  /* ---- Stufe 2 · Aufbau ---- */
  krieger1:{n:"Krieger I",sa:"Virabhadrasana I",lv:2,r:"huefte",z:"Hüftbeuger · Beine · Schultern",sec:30,uni:1,
    c:["Großer Schritt, vorderes Knie über dem Knöchel","Hinterer Fuß schräg, Ferse am Boden","Arme nach oben, Schultern bleiben weg von den Ohren"],a:"Gleichmäßig weiteratmen, Bauch leicht fest.",
    an:{anchor:"hip",at:[0,62],A:{torso:90,thigh:-20,shin:-90,foot:0,thigh2:-139.5,shin2:-139.5,foot2:8,upper:92,fore:92,neck:2},B:{torso:92,thigh:-20,shin:-90,foot:0,thigh2:-139.5,shin2:-139.5,foot2:8,upper:95,fore:95,neck:6}}},
  krieger2:{n:"Krieger II",sa:"Virabhadrasana II",lv:2,r:"huefte",z:"Hüfte · Beine · Schultern",sec:30,uni:1,
    c:["Weiter Stand, vorderes Knie über dem Knöchel","Arme auf Schulterhöhe in beide Richtungen strecken","Blick über die vordere Hand, Becken zur Seite offen"],a:"Ruhig durch die Nase atmen, Schultern sinken.",
    an:{view:"front",A:{yf:1,hy:72,kR:[46,44],aR:[46,0],kL:[-35.5,36],aL:[-62,0],ua:0,fa:0,uaL:180,faL:180},B:{yf:1,hy:70,kR:[47,42],aR:[46,0],kL:[-35,35],aL:[-62,0],ua:2,fa:1,uaL:178,faL:179}}},
  umkrieger:{n:"Umgekehrter Krieger",sa:"Viparita Virabhadrasana",lv:2,r:"ruecken",z:"Flanke · Hüfte",sec:30,uni:1,
    c:["Aus Krieger II den vorderen Arm nach oben-hinten strecken","Hintere Hand gleitet am hinteren Bein entlang","Vorderes Knie bleibt gebeugt"],a:"Einatmen in die lange Flanke.",
    an:{view:"front",A:{yf:1,hy:72,kR:[46,44],aR:[46,0],kL:[-35.5,36],aL:[-62,0],ua:96,fa:104,uaL:-100,faL:-96,lean:-14},B:{yf:1,hy:71,kR:[46.5,43],aR:[46,0],kL:[-35.5,36],aL:[-62,0],ua:100,fa:110,uaL:-102,faL:-98,lean:-20}}},
  dreieck:{n:"Dreieck",sa:"Trikonasana",lv:2,r:"beine",z:"Beine · Flanke · Hüfte",sec:30,uni:1,
    c:["Weiter Stand, beide Beine gestreckt, Knie nicht durchdrücken","Oberkörper zur Seite über das vordere Bein neigen","Untere Hand ans Schienbein, obere Hand zur Decke"],a:"Lang einatmen, die Brust öffnet sich zur Seite.",
    an:{view:"front",A:{yf:1,hy:70,aR:[70,0],aL:[-70,0],hx:-6,lean:56,ua:-44,fa:-44,uaL:136,faL:136},B:{yf:1,hy:70,aR:[70,0],aL:[-70,0],hx:-6,lean:60,ua:-40,fa:-40,uaL:140,faL:140}}},
  hund:{n:"Herabschauender Hund",sa:"Adho Mukha Svanasana",lv:2,r:"schulter",z:"Schultern · Beinrückseite · Waden",sec:30,
    c:["Hände schulterbreit, Finger weit gespreizt","Hüfte nach hinten-oben, Rücken lang","Knie dürfen gebeugt sein, Fersen sinken Richtung Boden"],a:"Ruhig weiteratmen, Kopf hängt locker zwischen den Armen.",
    an:{anchor:"hand",A:{upper:-60,fore:-60,torso:-40,thigh:-110,shin:-110,foot:-16,neck:-6},B:{upper:-61,fore:-61,torso:-43,thigh:-108,shin:-104,foot:-6,neck:-6}}},
  hundpedal:{n:"Hund mit Beinwechsel",lv:2,r:"beine",z:"Waden · Beinrückseite",sec:40,
    c:["Im Herabschauenden Hund abwechselnd ein Knie beugen","Die andere Ferse sinkt Richtung Boden","Hüfte bleibt hoch, Schultern ruhig"],a:"Gleichmäßig atmen, Tempo langsam.",
    an:{anchor:"hand",A:{upper:-60,fore:-60,torso:-40,thigh:-108,shin:-106,thigh2:-112,shin2:-124,foot:-8,foot2:-48,neck:-6},B:{upper:-60,fore:-60,torso:-40,thigh:-112,shin:-124,thigh2:-108,shin2:-106,foot:-48,foot2:-8,neck:-6},tempo:[1.4,.3,1.4,.3],ph:["Wechseln","Wechseln"]}},
  kobra:{n:"Kobra",sa:"Bhujangasana",lv:2,r:"ruecken",z:"Rücken · Brust · Bauch",sec:20,
    c:["Bauchlage, Hände neben den Rippen","Brust mit der Rückenkraft heben, Arme helfen nur leicht","Ellbogen nah am Körper, Schambein bleibt am Boden"],a:"Einatmen heben, oben ruhig weiteratmen.",
    an:{anchor:"hip",at:[0,9],flip:1,A:{torso:158,thigh:0,shin:0,foot:-12,handAt:[-46,4],bend:1,neck:-12},B:{torso:155,thigh:0,shin:0,foot:-12,handAt:[-46,4],bend:1,neck:-14}}},
  drehsitz:{n:"Drehsitz",sa:"Ardha Matsyendrasana",lv:2,r:"ruecken",z:"Wirbelsäule · Gesäß",sec:30,uni:1,
    c:["Aufrecht sitzen, ein Bein aufstellen und über das andere setzen","Hintere Hand stützt hinter dem Po, anderer Arm umarmt das Knie","Erst lang machen, dann drehen, Blick über die Schulter"],a:"Einatmen aufrichten, ausatmen etwas weiter drehen.",
    an:{anchor:"hip",at:[0,9],A:{torso:94,thigh:52,shin:-86,foot:0,thigh2:3,shin2:-176,foot2:180,handAt:[-24,6],bend:1,hand2:[34,-30],bend2:-1,neck:0},B:{torso:96,thigh:54,shin:-86,foot:0,thigh2:3,shin2:-176,foot2:180,handAt:[-24,6],bend:1,hand2:[34,-28],bend2:-1,neck:0}}},
  malasana:{n:"Tiefe Hocke",sa:"Malasana",lv:2,r:"huefte",z:"Hüfte · Leiste · Waden",sec:30,
    c:["Füße etwas weiter als hüftbreit, Zehen nach außen","Tief in die Hocke, Fersen am Boden oder auf einer Decke","Hände vor der Brust, Ellbogen schieben die Knie sanft nach außen"],a:"Ruhig in den Beckenboden atmen.",
    an:{anchor:"foot",A:{shin:-123,thigh:20,torso:72,handAt:[14,62],bend:1,neck:6},B:{shin:-124,thigh:18,torso:74,handAt:[15,63],bend:1,neck:6}}},
  stuhl:{n:"Stuhl",sa:"Utkatasana",lv:2,r:"beine",z:"Oberschenkel · Gesäß · Schultern",sec:20,
    c:["Füße zusammen oder hüftbreit, in die Knie gehen","Gewicht auf den Fersen, Po nach hinten","Arme in Verlängerung des Oberkörpers nach oben"],a:"Gleichmäßig atmen, nicht die Luft anhalten.",
    an:{anchor:"foot",A:{shin:-112,thigh:-32,torso:64,upper:72,fore:74,neck:4},B:{shin:-114,thigh:-28,torso:63,upper:74,fore:76,neck:4}}},
  baum:{n:"Baum",sa:"Vrksasana",lv:2,r:"huefte",z:"Gleichgewicht · Hüfte",sec:30,uni:1,
    c:["Gewicht auf ein Bein, Fuß an die Innenseite der Wade (nie aufs Knie)","Knie zeigt zur Seite, Becken bleibt gerade","Hände vor der Brust, Blick auf einen festen Punkt"],a:"Langsam und gleichmäßig atmen.",
    an:{view:"front",A:{yf:1,hy:92,hx:-3,kL:[-12,46],aL:[-12,0],kR:[40,64],aR:[2,40],hR:[1.5,128],hL:[-1.5,128],bR:1,bL:-1},B:{yf:1,hy:92,hx:-3,kL:[-12,46],aL:[-12,0],kR:[41,63],aR:[2,40],hR:[1.5,129],hL:[-1.5,129],bR:1,bL:-1}}},
  tisch:{n:"Rückwärtiger Tisch",sa:"Ardha Purvottanasana",lv:2,r:"brust",z:"Brust · vordere Schulter · Hüfte",sec:20,
    c:["Sitzen, Hände hinter dem Po, Finger zeigen zu den Füßen","Hüfte heben, bis Oberkörper und Oberschenkel waagerecht sind","Knie über den Knöcheln, Kopf in Verlängerung"],a:"Oben ruhig weiteratmen.",
    an:{anchor:"hand",A:{upper:-90,fore:-90,torso:180,thigh:-20,shin:-90,foot:0,neck:6},B:{upper:-90,fore:-90,torso:178,thigh:-18,shin:-90,foot:0,neck:8}}},
  heuschrecke:{n:"Heuschrecke",sa:"Salabhasana",lv:2,r:"ruecken",z:"Rücken · Gesäß · hintere Schulter",sec:20,
    c:["Bauchlage, Arme neben dem Körper","Brust, Arme und Beine leicht anheben","Nacken lang, Blick schräg zum Boden"],a:"Oben gleichmäßig weiteratmen.",
    an:{anchor:"hip",at:[0,10],flip:1,A:{torso:170,thigh:6,shin:6,foot:-8,upper:4,fore:6,neck:-4},B:{torso:167,thigh:9,shin:9,foot:-8,upper:8,fore:10,neck:-4}}},
  welpe:{n:"Welpe",sa:"Uttana Shishosana",lv:2,r:"schulter",z:"Schultern · oberer Rücken",sec:30,
    c:["Vierfüßlerstand, Hände ein Stück nach vorn wandern lassen","Hüfte bleibt über den Knien, Brust sinkt Richtung Boden","Arme lang, Stirn oder Kinn auf der Matte"],a:"In die Brust und die Achseln atmen.",
    an:{anchor:"hip",at:[0,51],A:{torso:-34,thigh:-90,shin:180,foot:180,handAt:[104,5],bend:1,neck:12,tho:-2},B:{torso:-36,thigh:-90,shin:180,foot:180,handAt:[105,5],bend:1,neck:14,tho:-3}}},
  seitausfall:{n:"Seitlicher Ausfallschritt",sa:"Skandasana (sanft)",lv:2,r:"huefte",z:"Innenseite Oberschenkel · Leiste",sec:30,uni:1,
    c:["Weiter Stand, ein Knie beugen, anderes Bein gestreckt","Gewicht auf das gebeugte Bein, Ferse bleibt unten","Hände vor der Brust oder am Boden abstützen"],a:"Ausatmen und etwas tiefer sinken.",
    an:{view:"front",A:{yf:1,hy:54,hx:6,kR:[52,46],aR:[54,0],kL:[-40,27],aL:[-82,0],hR:[1.5,126],hL:[-1.5,126],bR:1,bL:-1},B:{yf:1,hy:50,hx:7,kR:[53,44],aR:[54,0],kL:[-41,25],aL:[-82,0],hR:[1.5,126],hL:[-1.5,126],bR:1,bL:-1}}},
  goettin:{n:"Göttin",sa:"Utkata Konasana",lv:2,r:"huefte",z:"Hüfte · Oberschenkel innen",sec:30,
    c:["Weiter Stand, Zehen zeigen nach außen","Knie über den Zehen beugen, Becken senkrecht nach unten","Arme wie Torpfosten, Schulterblätter zusammen"],a:"Gleichmäßig atmen, Bauch leicht fest.",
    an:{view:"front",A:{yf:1,hy:64,kR:[48,50],aR:[52,0],ua:4,fa:90},B:{yf:1,hy:61,kR:[49,48],aR:[52,0],ua:6,fa:90}}},
  happybaby:{n:"Glückliches Baby",sa:"Ananda Balasana",lv:2,r:"huefte",z:"Hüfte · Leiste · unterer Rücken",sec:30,
    c:["Rückenlage, Knie Richtung Achseln","Hände halten die Fußaußenkanten oder Kniekehlen","Fußsohlen zur Decke, Kreuzbein bleibt am Boden"],a:"Ruhig in den Bauch atmen, leicht hin und her schaukeln erlaubt.",
    an:{anchor:"hip",at:[0,9],A:{torso:180,thigh:148,shin:92,foot:4,handAt:[-40,56],bend:1,neck:0},B:{torso:180,thigh:152,shin:94,foot:4,handAt:[-42,56],bend:1,neck:0}}},
  faden:{n:"Faden einfädeln",lv:2,r:"schulter",z:"Hintere Schulter · oberer Rücken",sec:30,uni:1,
    c:["Vierfüßlerstand, einen Arm unter dem anderen durchschieben","Schulter und Schläfe sinken auf die Matte","Hüfte bleibt über den Knien"],a:"In die gedehnte Schulter atmen.",
    an:{anchor:"hip",at:[0,51],A:{torso:-37,thigh:-90,shin:180,foot:180,handAt:[96,3],bend:1,hand2:[22,-8],bend2:1,neck:21},B:{torso:-39,thigh:-90,shin:180,foot:180,handAt:[97,3],bend:1,hand2:[22,-7],bend2:1,neck:23}}},/* 2.2: shoulder and temple rest on the mat, the head stays above the floor */
  /* ---- Stufe 3 · Fortgeschritten (weiterhin sanft, keine Umkehrhaltungen) ---- */
  taube:{n:"Taube",sa:"Eka Pada Kapotasana (Vorstufe)",lv:3,r:"huefte",z:"Gesäß · äußere Hüfte · Hüftbeuger",sec:40,uni:1,
    c:["Vorderes Schienbein schräg vor dem Körper ablegen","Hinteres Bein lang nach hinten, Becken gerade","Bei Druck im Knie: Kissen unter die Hüfte oder Taube im Liegen"],a:"Ausatmen und den Oberkörper Stück für Stück sinken lassen.",
    an:{anchor:"hip",at:[0,15],A:{torso:86,thigh:-161,shin:-180,foot:-176,thigh2:-14,shin2:-178,foot2:180,handAt:[22,4],bend:-1,neck:0},B:{torso:84,thigh:-161,shin:-180,foot:-176,thigh2:-14,shin2:-178,foot2:180,handAt:[24,4],bend:-1,neck:-2}}},
  kamel:{n:"Kamel (sanft)",sa:"Ustrasana",lv:3,r:"brust",z:"Brust · Hüftbeuger · Bauch",sec:20,
    c:["Kniestand, Hände stützen den unteren Rücken","Hüfte nach vorn schieben, Brustbein hebt sich","Kopf bleibt in Verlängerung, nicht in den Nacken fallen"],a:"Einatmen in die Brust, langsam wieder aufrichten.",
    an:{anchor:"hip",at:[0,51],A:{torso:100,thigh:-86,shin:180,foot:180,handTo:"hip",bend:1,neck:6,lum:-2,tho:-3},B:{torso:108,thigh:-82,shin:180,foot:180,handTo:"hip",bend:1,neck:10,lum:-4,tho:-5}}},
  eidechse:{n:"Eidechse",sa:"Utthan Pristhasana",lv:3,r:"huefte",z:"Hüftbeuger · Leiste",sec:30,uni:1,
    c:["Aus dem tiefen Ausfallschritt beide Hände innen neben den vorderen Fuß","Hinteres Knie bleibt auf der Matte","Hüfte sinkt nach vorn-unten, Rücken lang"],a:"Lang ausatmen, Hüfte loslassen.",
    an:{anchor:"hip",at:[0,30],A:{torso:20,thigh:22,shin:-96,foot:0,thigh2:-136,shin2:180,foot2:180,handAt:[60,4],bend:1,neck:-8},B:{torso:17,thigh:22,shin:-96,foot:0,thigh2:-136,shin2:180,foot2:180,handAt:[60,4],bend:1,neck:-8}}},
  delfin:{n:"Delfin",sa:"Ardha Pincha Mayurasana",lv:3,r:"schulter",z:"Schultern · Rücken · Beinrückseite",sec:20,
    c:["Unterarme parallel auf der Matte, Ellbogen unter den Schultern","Hüfte nach hinten-oben schieben, Knie dürfen gebeugt bleiben","Kopf hängt frei, nicht auf den Boden drücken"],a:"Ruhig weiteratmen.",
    an:{anchor:"hand",A:{upper:-88,fore:0,torso:-50,thigh:-118,shin:-132,foot:0,neck:-4},B:{upper:-87,fore:0,torso:-52,thigh:-118,shin:-134,foot:0,neck:-4}}},
  fisch:{n:"Fisch (gestützt)",sa:"Matsyasana",lv:3,r:"brust",z:"Brust · Hals vorn",sec:20,
    c:["Rückenlage, Hände unter dem Po, auf die Unterarme stützen","Brustbein hebt sich, Schulterblätter zusammen","Kopf nur so weit nach hinten, wie es angenehm ist"],a:"Tief in die Brust atmen.",
    an:{anchor:"hip",at:[0,8],A:{torso:158,thigh:0,shin:-1,foot:40,handAt:[-14,4],bend:1,neck:-18},B:{torso:156,thigh:0,shin:-1,foot:40,handAt:[-14,4],bend:1,neck:-22}}},
  kuhgesicht:{n:"Kuhgesicht-Arme",sa:"Gomukhasana-Arme",lv:3,r:"schulter",z:"Schultern · Trizeps · Brust",sec:30,uni:1,
    c:["Ein Arm von oben, der andere von unten hinter den Rücken","Finger einhaken oder ein Handtuch zwischen die Hände","Oberer Ellbogen zeigt zur Decke, kein Hohlkreuz"],a:"In die Brust atmen, Schultern bleiben weit.",
    an:{view:"front",A:{yf:1,ua:93,fa:-98,uaL:-96,faL:76,fsL:.8,s:6},B:{yf:1,ua:96,fa:-95,uaL:-98,faL:80,fsL:.8,s:6}}},
  halbmond:{n:"Halbmond-Ausfallschritt",sa:"Anjaneyasana mit Armen",lv:3,r:"huefte",z:"Hüftbeuger · Brust · Schultern",sec:30,uni:1,
    c:["Tiefer Ausfallschritt, hinteres Knie auf der Matte","Arme über den Kopf strecken","Becken nach vorn, Brust sanft nach oben öffnen"],a:"Einatmen und lang nach oben wachsen.",
    an:{anchor:"hip",at:[0,37],A:{torso:94,thigh:12,shin:-88,foot:0,thigh2:-140,shin2:180,foot2:180,upper:96,fore:98,neck:6,lum:-1},B:{torso:98,thigh:12,shin:-88,foot:0,thigh2:-140,shin2:180,foot2:180,upper:102,fore:106,neck:10,lum:-2,tho:-2}}},
  seitwinkel:{n:"Gestreckter Seitwinkel",sa:"Utthita Parsvakonasana",lv:3,r:"ruecken",z:"Flanke · Hüfte · Beine",sec:30,uni:1,
    c:["Aus Krieger II den Unterarm auf den vorderen Oberschenkel legen","Oberen Arm schräg über den Kopf strecken","Eine lange Linie von der hinteren Ferse bis zu den Fingern"],a:"Einatmen in die obere Flanke.",
    an:{view:"front",A:{yf:1,hy:66,hx:4,kR:[48,42],aR:[48,0],kL:[-31,37],aL:[-58,0],lean:52,hR:[-2,118],bR:1,uaL:118,faL:116},B:{yf:1,hy:65,hx:4,kR:[48.5,41],aR:[48,0],kL:[-31,37],aL:[-58,0],lean:56,hR:[-2,118],bR:1,uaL:116,faL:114}}},
  pyramide:{n:"Pyramide",sa:"Parsvottanasana",lv:3,r:"beine",z:"Beinrückseite · Hüfte",sec:30,uni:1,
    c:["Mittelgroßer Schritt, beide Füße flach, Hüfte zeigt nach vorn","Mit langem Rücken über das vordere Bein beugen","Hände auf Klötze oder das Schienbein, vorderes Knie weich"],a:"Ausatmen und etwas tiefer sinken.",
    an:{anchor:"hip",at:[0,83],A:{torso:-20,thigh:-63,shin:-66,foot:0,thigh2:-118,shin2:-117,foot2:22,handAt:[36,14],bend:-1,neck:-8},B:{torso:-25,thigh:-63,shin:-66,foot:0,thigh2:-118,shin2:-117,foot2:22,handAt:[37,12],bend:-1,neck:-8},eq:[{t:"yblock",x:38}]}},
  sitzvorbeuge:{n:"Sitzende Vorbeuge",sa:"Paschimottanasana",lv:3,r:"beine",z:"Beinrückseite · Rücken",sec:40,
    c:["Langsitz, Beine gestreckt, Knie dürfen leicht gebeugt sein","Aus der Hüfte nach vorn neigen, Rücken lang","Hände an Schienbeine oder Füße, nicht ziehen"],a:"Ausatmen und den Oberkörper etwas sinken lassen.",
    an:{anchor:"hip",at:[0,9],A:{torso:38,thigh:4,shin:-4,foot:76,handAt:[76,11],bend:-1,neck:-14,tho:-3},B:{torso:33,thigh:4,shin:-4,foot:76,handAt:[78,11],bend:-1,neck:-16,tho:-4}}},
  bogen:{n:"Halber Bogen",sa:"Ardha Dhanurasana",lv:3,r:"huefte",z:"Oberschenkel vorn · Hüftbeuger · Brust",sec:20,uni:1,
    c:["Bauchlage, auf einen Unterarm stützen","Mit der anderen Hand den Fuß greifen","Fuß sanft in die Hand drücken, Knie bleibt am Boden"],a:"Ruhig weiteratmen, nicht ruckartig ziehen.",
    an:{anchor:"hip",at:[0,10],flip:1,A:{torso:148,thigh:2,shin:144,foot:150,thigh2:0,shin2:0,foot2:-12,handAt:[8,40],bend:-1,upper2:-90,fore2:180,neck:-4},B:{torso:147,thigh:2,shin:146,foot:152,thigh2:0,shin2:0,foot2:-12,handAt:[7,39],bend:-1,upper2:-90,fore2:180,neck:-4}}}
};
/* ================= 3.2 · MEHR YOGA: Anfänger · Fortgeschritten · Profi (@ Joschy) =================
   Stufen neu: 1 Anfänger, 2 Fortgeschritten, 3 Profi. Die 56 Haltungen bis 3.1: alte Stufe 1 und die sanften Haltungen der alten
   Stufe 2 -> Anfänger, die übrigen (bisher "Aufbau"/"Fortgeschritten", eher mittleres Niveau) -> Fortgeschritten.
   Profi-Haltungen haben eine leichtere Variante (alt), Umkehr- und Armbalance-Haltungen zusätzlich einen deutlichen Hinweis (risk). */
for(const k of["hund","krieger1","krieger2","welpe","faden","happybaby","kobra","stuhl","goettin"])YP[k].lv=1;
for(const k of["umkrieger","dreieck","hundpedal","drehsitz","malasana","baum","tisch","heuschrecke","seitausfall","taube","kamel","eidechse","delfin","fisch","kuhgesicht","halbmond","seitwinkel","pyramide","sitzvorbeuge","bogen"])YP[k].lv=2;
const YRISK={
  inv:"Umkehrhaltung: Nacken und Schultern tragen Gewicht. Nur mit Vorbereitung und aufgewärmt, anfangs an der Wand üben. Bei Schulter- oder Nackenbeschwerden, hohem Blutdruck oder Augenproblemen auslassen.",
  arm:"Armbalance: viel Last auf Handgelenken und Schultern, Kippgefahr nach vorn. Handgelenke vorher aufwärmen, Kissen vor den Kopf legen. Bei Handgelenk-, Schulter- oder Nackenbeschwerden auslassen.",
  wrist:"Stütz auf gestreckten Armen hinter dem Körper: belastet Schultern und Handgelenke stark. Handgelenke vorher aufwärmen, Hüfte nur so hoch wie die Schultern es erlauben. Bei Schulter- oder Handgelenkbeschwerden auslassen.",
  back:"Starke Rückbeuge: belastet Handgelenke, Schultern und den unteren Rücken. Nur nach Brücke und Kamel, gut aufgewärmt. Bei Schulter- oder Rückenbeschwerden auslassen."};
Object.assign(YP,{
  /* ---- Anfänger (neu) ---- */
  krokodil:{n:"Krokodil",sa:"Makarasana",lv:1,r:"ruecken",z:"Unterer Rücken · Entspannung",sec:45,
    c:["Bauchlage, Beine locker, Fersen fallen nach außen","Unterarme übereinander, Stirn ruht darauf","Schultern und Gesäß ganz weich werden lassen"],a:"In den Bauch atmen: er drückt gegen die Matte, der Rücken hebt sich leicht.",
    an:{anchor:"hip",at:[0,10],flip:1,A:{torso:175,thigh:0,shin:0,foot:-12,upper:197,fore:-2,neck:-6},B:{torso:175.8,thigh:0,shin:0,foot:-12,upper:197.5,fore:-2,neck:-6.5}}},
  liegschmetterling:{n:"Liegender Schmetterling",sa:"Supta Baddha Konasana",lv:1,r:"huefte",z:"Leiste · Innenseite Oberschenkel",sec:60,
    c:["Rückenlage, Fußsohlen zusammen, Füße nah am Becken","Knie sinken zu den Seiten, Kissen darunter erlaubt","Hände ruhen auf dem Bauch, Schultern weich"],a:"Lang ausatmen und die Knie schwer werden lassen.",
    an:{anchor:"hip",at:[0,10],A:{torso:180,thigh:38,shin:-124,foot:30,handAt:[-14,23],bend:1,neck:-4},B:{torso:180,thigh:35,shin:-126,foot:28,handAt:[-14,22.5],bend:1,neck:-4}}},
  armeheben:{n:"Arme heben",sa:"Urdhva Hastasana",lv:1,r:"schulter",z:"Schultern · Flanken · Haltung",sec:30,
    c:["Füße hüftbreit, Arme über vorn nach oben strecken","Schultern bleiben weg von den Ohren","Rippen sinken, kein Hohlkreuz, Blick leicht nach oben"],a:"Einatmen: Arme hoch. Ausatmen: Schultern sinken lassen.",
    an:{anchor:"foot",noBal:1,A:{...STAND,upper:84,fore:86,neck:3},B:{...STAND,torso:90,upper:94,fore:96,neck:8}}},
  ragdoll:{n:"Hängende Vorbeuge",sa:"Uttanasana-Variante",lv:1,r:"ruecken",z:"Rücken · Beinrückseite · Nacken",sec:40,
    c:["Knie deutlich beugen, Oberkörper über die Oberschenkel hängen","Mit den Händen die Ellbogen fassen","Kopf schwer, leicht hin und her pendeln erlaubt"],a:"Ausatmen und den Nacken ganz loslassen.",
    an:{anchor:"foot",noBal:1,padT:24,A:{shin:-108,thigh:-62,torso:-36,upper:-97,fore:174,neck:-16,lum:-2,tho:-4},B:{shin:-108,thigh:-63,torso:-39,upper:-99,fore:172,neck:-14,lum:-2,tho:-5}}},
  zehensitz:{n:"Zehensitz",sa:"Vajrasana mit aufgestellten Zehen",lv:1,r:"beine",z:"Fußsohlen · Zehen · Waden",sec:30,
    c:["Im Fersensitz die Zehen aufstellen","Gewicht langsam nach hinten auf die Fersen bringen","Hände auf den Oberschenkeln, Rücken aufrecht"],a:"Gleichmäßig atmen, bei starkem Ziehen etwas nach vorn kommen.",
    an:{anchor:"hip",at:[0,22],A:{torso:91,thigh:-20.5,shin:172,foot:-106,handAt:[27,25],bend:1,neck:0},B:{torso:93,thigh:-20.5,shin:172,foot:-106,handAt:[27,25],bend:1,neck:2}}},
  vierfuessler:{n:"Vierfüßler-Balance",sa:"Dandayamana Bharmanasana",lv:1,r:"ruecken",z:"Rücken · Gesäß · Gleichgewicht",sec:30,uni:1,
    c:["Vierfüßlerstand, Hände unter den Schultern","Einen Arm nach vorn und das andere Bein nach hinten strecken","Becken bleibt waagerecht, Bauch leicht fest"],a:"Ruhig weiteratmen, Blick zum Boden.",
    an:{anchor:"hip",at:[0,51],A:{torso:9,thigh:-90,shin:180,foot:180,thigh2:177,shin2:177,foot2:-92,upper:-90,fore:-90,upper2:8,fore2:8,neck:-12},B:{torso:9.6,thigh:-90,shin:180,foot:180,thigh2:179,shin2:179,foot2:-90,upper:-90,fore:-90,upper2:10,fore2:10,neck:-12}}},
  windloeser:{n:"Windlöser einbeinig",sa:"Ardha Pavanamuktasana",lv:1,r:"ruecken",z:"Unterer Rücken · Gesäß · Hüfte",sec:40,uni:1,
    c:["Rückenlage, ein Knie zur Brust ziehen","Anderes Bein liegt lang auf der Matte","Hände umfassen das Schienbein, Kopf bleibt am Boden"],a:"Ausatmen: Knie etwas näher, einatmen: leicht lösen.",
    an:{anchor:"hip",at:[0,9],A:{torso:180,thigh:118,shin:-12,foot:20,thigh2:0,shin2:-1,foot2:62,handAt:[-24,40],bend:1,neck:0},B:{torso:180,thigh:126,shin:-9,foot:23,thigh2:0,shin2:-1,foot2:62,handAt:[-28,40],bend:1,neck:0}}},
  beinewand:{n:"Beine hoch an der Wand",sa:"Viparita Karani",lv:1,r:"beine",z:"Beine · Entspannung",sec:60,
    c:["Seitlich an die Wand setzen, dann die Beine an der Wand hochschwingen","Gesäß eine Handbreit bis eine Unterarmlänge vor der Wand, Rücken liegt flach","Arme locker neben dem Körper"],a:"Ruhig und langsam atmen, die Beine werden leicht.",
    an:{anchor:"hip",at:[0,9],A:{torso:180,thigh:51,shin:51,foot:146,upper:-4,fore:-2,neck:-8},B:{torso:180.4,thigh:51.4,shin:51.4,foot:147,upper:-4,fore:-2,neck:-8},eq:[{t:"wall",x:64}]}},
  oberschenkel:{n:"Stehende Oberschenkeldehnung",sa:"Ardha Natarajasana-Vorstufe",lv:1,r:"beine",z:"Oberschenkel vorn · Hüftbeuger",sec:30,uni:1,
    c:["Auf einem Bein stehen, die Ferse zum Gesäß ziehen","Knie zeigen nach unten, Becken leicht nach vorn","Freie Hand an die Wand, wenn das Gleichgewicht wackelt"],a:"Ruhig weiteratmen, Blick auf einen festen Punkt.",
    an:{anchor:"foot",noBal:1,A:{...STAND,torso:87,thigh2:-110,shin2:80,foot2:160,hand:[-11,-56],bend:1,upper2:62,fore2:72,neck:0},B:{...STAND,torso:87,thigh2:-112,shin2:82,foot2:162,hand:[-12.5,-55.5],bend:1,upper2:66,fore2:76,neck:0}}},
  /* ---- Fortgeschritten (neu) ---- */
  robbe:{n:"Robbe",sa:"Sphinx-Variante",lv:2,r:"ruecken",z:"Unterer Rücken · Brust",sec:30,
    c:["Aus der Sphinx die Hände weit nach vorn setzen","Arme strecken, Brust hebt sich","Po und Beine bleiben weich, nur so hoch wie angenehm"],a:"Ruhig in den Bauch atmen, Schultern weg von den Ohren.",
    an:{anchor:"hip",at:[0,9],flip:1,A:{torso:146,thigh:0,shin:0,foot:-12,handAt:[-91,3],bend:1,neck:-14},B:{torso:144,thigh:0,shin:0,foot:-12,handAt:[-92,3],bend:1,neck:-16}}},
  stuhldreh:{n:"Gedrehter Stuhl",sa:"Parivrtta Utkatasana",lv:2,r:"ruecken",z:"Wirbelsäule · Oberschenkel",sec:20,uni:1,
    c:["Aus dem Stuhl die Hände vor der Brust zusammenlegen","Oberkörper drehen, Ellbogen an die Außenseite des Knies","Knie bleiben auf gleicher Höhe, Po nach hinten"],a:"Einatmen lang machen, ausatmen etwas weiter drehen.",
    an:{anchor:"foot",A:{shin:-112,thigh:-34,torso:42,handAt:[33,82],bend:-1,neck:10},B:{shin:-113,thigh:-32,torso:40,handAt:[34,80],bend:-1,neck:12}}},
  adler:{n:"Adler",sa:"Garudasana",lv:2,r:"schulter",z:"Gleichgewicht · Schultern · Hüfte",sec:20,uni:1,
    c:["Knie beugen, ein Bein über das andere schlagen","Arme vor dem Körper umeinander wickeln","Ellbogen auf Schulterhöhe, Becken sinkt gerade nach unten"],a:"Ruhig atmen, Blick auf einen festen Punkt.",
    an:{view:"front",A:{yf:1,hy:82,hx:3,aR:[8,0],kR:[17,42],kL:[17,54],aL:[9,22],ua:200,fa:94,us:.62,fs:.92},B:{yf:1,hy:80,hx:3,aR:[8,0],kR:[18,41],kL:[18,52],aL:[10,21],ua:206,fa:92,us:.6,fs:.9}}},
  brett:{n:"Brett",sa:"Phalakasana",lv:2,r:"ganz",z:"Bauch · Schultern · Rumpf",sec:20,
    c:["Hände unter den Schultern, Beine lang nach hinten","Eine gerade Linie vom Kopf bis zu den Fersen","Bauch fest, Hüfte weder zu hoch noch durchhängend"],a:"Gleichmäßig weiteratmen, nicht pressen.",
    an:{anchor:"hand",A:{upper:-90,fore:-90,torso:22,thigh:202,shin:204,foot:-24,neck:-6},B:{upper:-90,fore:-90,torso:21.5,thigh:201.5,shin:203.5,foot:-24.5,neck:-6}}},
  kopfknie:{n:"Kopf-zum-Knie-Haltung",sa:"Janu Sirsasana",lv:2,r:"beine",z:"Beinrückseite · Rücken",sec:40,uni:1,
    c:["Ein Bein lang, die andere Fußsohle an die Innenseite des Oberschenkels","Aus der Hüfte über das lange Bein beugen","Rücken lang, Hände an Schienbein oder Fuß"],a:"Ausatmen und den Oberkörper etwas sinken lassen.",
    an:{anchor:"hip",at:[0,9],A:{torso:40,thigh:4,shin:-4,foot:76,thigh2:5,shin2:184,foot2:150,handAt:[74,11],bend:-1,neck:-14,tho:-3},B:{torso:35,thigh:4,shin:-4,foot:76,thigh2:5,shin2:184,foot2:150,handAt:[77,11],bend:-1,neck:-16,tho:-4}}},
  bootkn:{n:"Halbes Boot",sa:"Ardha Navasana",lv:2,r:"ganz",z:"Bauch · Hüftbeuger · Rücken",sec:20,
    c:["Sitzen, Knie gebeugt, Oberkörper leicht zurücklehnen","Füße heben, Schienbeine parallel zum Boden","Arme nach vorn strecken, Brust bleibt offen"],a:"Gleichmäßig atmen, Rücken bleibt lang.",
    an:{anchor:"hip",at:[0,9],A:{torso:122,thigh:47,shin:0,foot:-6,upper:2,fore:2,neck:-24},B:{torso:120,thigh:49,shin:2,foot:-4,upper:4,fore:4,neck:-24}}},
  hund3:{n:"Dreibeiniger Hund",sa:"Eka Pada Adho Mukha Svanasana",lv:2,r:"beine",z:"Schultern · Beinrückseite · Hüfte",sec:20,uni:1,
    c:["Aus dem Herabschauenden Hund ein Bein lang nach hinten-oben heben","Becken bleibt gerade, Hüfte nicht aufdrehen","Hände drücken fest in die Matte"],a:"Ruhig weiteratmen.",
    an:{anchor:"hand",A:{upper:-60,fore:-60,torso:-40,thigh:-110,shin:-110,foot:-16,thigh2:142,shin2:142,foot2:228,neck:-6},B:{upper:-61,fore:-61,torso:-42,thigh:-108,shin:-106,foot:-8,thigh2:144,shin2:144,foot2:230,neck:-6}}},
  seitstuetz:{n:"Seitstütz",sa:"Vasisthasana",lv:2,r:"ganz",z:"Schultern · seitlicher Rumpf",sec:20,uni:1,
    c:["Aus dem Brett auf die Außenkante eines Fußes drehen","Unteres Handgelenk unter der Schulter, Füße übereinander","Obere Hand zur Decke, Hüfte bleibt oben"],a:"Ruhig atmen, Blick nach vorn oder zur oberen Hand.",
    an:{view:"front",floor:0,A:{yf:1,hx:4,hy:47,lean:60,aR:[-77,2],aL:[-77,11],ua:-30,fa:-30,uaL:150,faL:150},B:{yf:1,hx:4,hy:47.6,lean:59.6,aR:[-77,2],aL:[-77,11],ua:-30.4,fa:-30.4,uaL:148,faL:150}}},
  heldensitz:{n:"Heldensitz",sa:"Virasana",lv:2,r:"beine",z:"Oberschenkel vorn · Knie · Füße",sec:40,
    c:["Kniestand, Füße etwas weiter als die Hüfte auseinander","Gesäß zwischen die Fersen setzen, ggf. auf ein Kissen","Hände auf den Oberschenkeln, Rücken aufrecht"],a:"Ruhig durch die Nase atmen.",
    an:{anchor:"hip",at:[0,16],A:{torso:91,thigh:-15,shin:180,foot:180,handAt:[29,23],bend:1,neck:0},B:{torso:92.5,thigh:-15,shin:180,foot:180,handAt:[29,23],bend:1,neck:2}}},
  /* ---- Profi (neu): jede Haltung mit leichterer Variante (alt), Risiko-Haltungen mit Hinweis (risk) ---- */
  kraehe:{n:"Krähe",sa:"Bakasana",lv:3,r:"brust",z:"Arme · Handgelenke · Rumpf",sec:15,alt:"malasana",risk:"arm",
    c:["Aus der Hocke die Hände schulterbreit aufsetzen, Ellbogen leicht beugen","Knie hoch an die Oberarme, Blick nach vorn","Gewicht langsam nach vorn, erst ein Fuß, dann beide abheben"],a:"Gleichmäßig weiteratmen, nicht die Luft anhalten.",
    an:{anchor:"hand",A:{fore:-80,upper:-148,torso:-10,thigh:-19,shin:150,foot:160,thigh2:-21,shin2:148,foot2:158,neck:16},B:{fore:-81,upper:-147,torso:-11,thigh:-19,shin:150,foot:160,thigh2:-21,shin2:148,foot2:158,neck:17}}},
  umgbrett:{n:"Umgekehrtes Brett",sa:"Purvottanasana",lv:3,r:"brust",z:"Brust · vordere Schulter · Rückseite",sec:15,alt:"tisch",risk:"wrist",
    c:["Sitzen, Hände hinter dem Po, Finger zeigen zu den Füßen","Hüfte heben, bis der Körper eine gerade Linie bildet","Fußsohlen Richtung Boden, Kopf nur so weit zurück wie angenehm"],a:"Oben ruhig weiteratmen.",
    an:{anchor:"hand",A:{upper:-90,fore:-90,torso:159,thigh:-20,shin:-23,foot:-30,neck:16},B:{upper:-90,fore:-90,torso:158,thigh:-21,shin:-24,foot:-31,neck:20}}},
  delfinkopf:{n:"Delfin-Kopfstand-Vorbereitung",sa:"Ardha Sirsasana",lv:3,r:"schulter",z:"Schultern · Rumpf · Nacken",sec:20,alt:"delfin",risk:"inv",
    c:["Unterarme auf der Matte, Finger verschränkt, Scheitel vor den Händen","Knie strecken, mit den Füßen Richtung Kopf gehen","Druck kommt über die Unterarme, der Kopf trägt kaum Gewicht"],a:"Ruhig weiteratmen, bei Druck im Kopf sofort lösen.",
    an:{anchor:"hand",at:[0,3],A:{fore:0,upper:-125,torso:-70,thigh:-116,shin:-116,foot:0,neck:-18},B:{fore:0,upper:-125,torso:-72,thigh:-114,shin:-114,foot:-2,neck:-16}}},
  kopfstand:{n:"Kopfstand",sa:"Salamba Sirsasana",lv:3,r:"ganz",z:"Schultern · Rumpf · Gleichgewicht",sec:20,alt:"delfin",risk:"inv",
    c:["Aus der Delfin-Vorbereitung die Knie zur Brust ziehen, dann die Beine langsam strecken","Unterarme drücken fest in die Matte, Schultern weg von den Ohren","Anfangs mit dem Rücken nah an der Wand, langsam wieder ablegen"],a:"Ruhig und gleichmäßig atmen, danach in der Kindshaltung ausruhen.",
    an:{anchor:"hand",at:[0,3],A:{fore:0,upper:-125,torso:-90,thigh:90,shin:90,foot:92,neck:2},B:{fore:0,upper:-125,torso:-90.6,thigh:89.2,shin:89.6,foot:93,neck:2.6}}},
  unterarmvor:{n:"Unterarmstand-Vorbereitung",sa:"Ardha Pincha Mayurasana mit Bein",lv:3,r:"schulter",z:"Schultern · Rumpf",sec:15,uni:1,alt:"delfin",risk:"inv",
    c:["Im Delfin die Hüfte hoch, Unterarme parallel","Ein Bein lang nach hinten-oben heben","Schultern bleiben über den Ellbogen, Kopf frei"],a:"Gleichmäßig weiteratmen.",
    an:{anchor:"hand",A:{upper:-88,fore:0,torso:-50,thigh:-118,shin:-132,foot:0,thigh2:131,shin2:131,foot2:224,neck:-4},B:{upper:-87,fore:0,torso:-52,thigh:-118,shin:-134,foot:0,thigh2:133,shin2:133,foot2:226,neck:-4}}},
  schulterstand:{n:"Schulterstand",sa:"Salamba Sarvangasana",lv:3,r:"ganz",z:"Schultern · Nacken · Rumpf",sec:30,alt:"beinewand",risk:"inv",
    c:["Gefaltete Decke unter die Schultern, Kopf auf der Matte","Hüfte heben, Hände stützen den Rücken, Ellbogen schulterbreit","Beine nach oben strecken, Kopf dabei nie drehen"],a:"Ruhig atmen, Kinn bleibt locker Richtung Brust.",
    an:{anchor:"shoulder",at:[0,9],A:{torso:-92,thigh:90,shin:90,foot:94,upper:-7,fore:121,neck:-88},B:{torso:-91.4,thigh:90.6,shin:90.4,foot:95,upper:-7,fore:121,neck:-88.6}}},
  pflug:{n:"Pflug",sa:"Halasana",lv:3,r:"ruecken",z:"Rücken · Nacken · Beinrückseite",sec:20,alt:"kniebrust",risk:"inv",
    c:["Aus dem Schulterstand die Beine über den Kopf senken","Zehen Richtung Boden, Knie dürfen gebeugt sein","Arme lang auf der Matte, Nacken nie belasten oder drehen"],a:"Flach weiteratmen, Rücken langsam Wirbel für Wirbel abrollen.",
    an:{anchor:"shoulder",at:[0,9],A:{torso:-96,thigh:221,shin:221,foot:215,upper:-3,fore:-3,neck:-84},B:{torso:-95,thigh:222,shin:222,foot:216,upper:-3,fore:-3,neck:-85}}},
  rad:{n:"Rad",sa:"Urdhva Dhanurasana",lv:3,r:"brust",z:"Brust · Schultern · Hüftbeuger",sec:15,alt:"bruecke",risk:"back",
    c:["Rückenlage, Füße nah am Po, Hände neben den Ohren, Finger zu den Schultern","Erst auf den Scheitel, dann Arme und Beine strecken","Knie zeigen nach vorn, langsam mit dem Kinn zur Brust ablegen"],a:"Oben gleichmäßig weiteratmen.",
    an:{anchor:"hip",at:[0,75],A:{torso:205,thigh:-40,shin:-78,foot:0,handAt:[-63.5,1],bend:-1,neck:52,lum:-6,tho:-8},B:{torso:207,thigh:-40,shin:-77,foot:0,handAt:[-63.5,1],bend:-1,neck:50,lum:-7,tho:-9}}},
  kameltief:{n:"Kamel (tief)",sa:"Ustrasana",lv:3,r:"brust",z:"Brust · Hüftbeuger · Bauch",sec:15,alt:"kamel",risk:"back",
    c:["Kniestand, Zehen aufgestellt, Hüfte über den Knien","Brustbein heben, dann nacheinander die Hände an die Fersen","Hüfte schiebt nach vorn, Kopf folgt nur so weit wie angenehm"],a:"Einatmen in die Brust, langsam mit den Händen am Becken aufrichten.",
    an:{anchor:"hip",at:[0,51],A:{torso:155,thigh:-99,shin:172,foot:-100,handAt:[-51,15],bend:-1,neck:32,lum:-8,tho:-10},B:{torso:156,thigh:-100,shin:172,foot:-100,handAt:[-51.5,15],bend:-1,neck:36,lum:-8,tho:-11}}},
  taenzer:{n:"Tänzer",sa:"Natarajasana",lv:3,r:"huefte",z:"Gleichgewicht · Hüftbeuger · Schultern",sec:20,uni:1,alt:"oberschenkel",
    c:["Auf einem Bein stehen, den anderen Fuß hinten greifen","Fuß in die Hand drücken, Oberkörper neigt sich nach vorn","Freien Arm nach vorn strecken, Becken bleibt gerade"],a:"Ruhig weiteratmen, Blick auf einen festen Punkt.",
    an:{anchor:"foot",noBal:1,A:{shin:-90,thigh:-88,torso:24,thigh2:152,shin2:24,foot2:100,handAt:[2,132],bend:1,upper2:28,fore2:30,neck:12},B:{shin:-90,thigh:-88,torso:21,thigh2:154,shin2:22,foot2:100,handAt:[0,131],bend:1,upper2:26,fore2:28,neck:13}}},
  krieger3:{n:"Krieger III",sa:"Virabhadrasana III",lv:3,r:"beine",z:"Gleichgewicht · Beinrückseite · Rumpf",sec:20,uni:1,alt:"krieger1",
    c:["Auf einem Bein stehen, Oberkörper und anderes Bein waagerecht","Arme nach vorn strecken, eine Linie von den Fingern bis zur Ferse","Standbein leicht gebeugt, Becken bleibt gerade"],a:"Gleichmäßig atmen, Bauch leicht fest.",
    an:{anchor:"foot",A:{shin:-92,thigh:-90,torso:2,thigh2:180,shin2:180,foot2:-90,upper:-2,fore:-2,upper2:0,fore2:0,neck:10},B:{shin:-92,thigh:-90,torso:0,thigh2:178,shin2:178,foot2:-90,upper:-4,fore:-4,upper2:-2,fore2:-2,neck:11}}},
  halbmondbal:{n:"Halbmond",sa:"Ardha Chandrasana",lv:3,r:"beine",z:"Gleichgewicht · Beine · Flanke",sec:20,uni:1,alt:"dreieck",
    c:["Aus dem Dreieck das vordere Knie beugen, Hand auf einen Block vor den Fuß","Hinteres Bein waagerecht heben, Standbein strecken","Obere Hand zur Decke, Becken öffnet sich zur Seite"],a:"Ruhig weiteratmen, Blick nach vorn oder zum Boden.",
    an:{view:"front",A:{yf:1,hx:30,hy:99,lean:100,aR:[50,0],aL:[-58,126],ua:10,fa:10,uaL:190,faL:190},B:{yf:1,hx:30,hy:99.5,lean:99,aR:[50,0],aL:[-58,128],ua:9,fa:9,uaL:188,faL:189}}},
  drehhalbmond:{n:"Gedrehter Halbmond",sa:"Parivrtta Ardha Chandrasana",lv:3,r:"beine",z:"Gleichgewicht · Wirbelsäule · Beine",sec:20,uni:1,alt:"pyramide",
    c:["Standbein gestreckt, anderes Bein waagerecht nach hinten","Gegenhand auf einen Block unter der Schulter","Oberkörper dreht auf, obere Hand zur Decke"],a:"Einatmen lang machen, ausatmen drehen.",
    an:{anchor:"foot",noBal:1,A:{shin:-92,thigh:-88,torso:-16,thigh2:166,shin2:166,foot2:-104,handAt:[56,19],bend:1,upper2:88,fore2:88,neck:24},B:{shin:-92,thigh:-88,torso:-18,thigh2:164,shin2:164,foot2:-106,handAt:[56,19],bend:1,upper2:90,fore2:90,neck:26},eq:[{t:"yblock",x:56,w:13,h:18}]}},
  drehdreieck:{n:"Gedrehtes Dreieck",sa:"Parivrtta Trikonasana",lv:3,r:"beine",z:"Beinrückseite · Wirbelsäule · Hüfte",sec:30,uni:1,alt:"pyramide",
    c:["Pyramidenstand, beide Beine gestreckt, Hüfte zeigt nach vorn","Gegenhand neben den vorderen Fuß oder auf einen Block","Oberkörper aufdrehen, obere Hand zur Decke"],a:"Einatmen lang, ausatmen etwas weiter drehen.",
    an:{anchor:"hip",at:[0,83],A:{torso:-22,thigh:-63,shin:-66,foot:0,thigh2:-118,shin2:-117,foot2:22,handAt:[46,10],bend:-1,upper2:94,fore2:94,neck:20},B:{torso:-26,thigh:-63,shin:-66,foot:0,thigh2:-118,shin2:-117,foot2:22,handAt:[46,10],bend:-1,upper2:96,fore2:96,neck:22},eq:[{t:"yblock",x:46}]}},
  koenigstaube:{n:"Königstaube-Vorstufe",sa:"Eka Pada Rajakapotasana (Vorstufe)",lv:3,r:"huefte",z:"Hüftbeuger · Oberschenkel vorn · Brust",sec:20,uni:1,alt:"taube",
    c:["Aus der Taube aufrichten, Becken gerade","Hinteres Knie beugen, den Fuß mit der Hand greifen (oder Gurt)","Brustbein hebt sich, Nacken bleibt lang"],a:"Ruhig in die Brust atmen, nicht ruckartig ziehen.",
    an:{anchor:"hip",at:[0,15],A:{torso:98,thigh:-161,shin:62,foot:150,thigh2:-14,shin2:-178,foot2:180,handAt:[-20,42],bend:1,upper2:98,fore2:104,neck:10,lum:-3,tho:-4},B:{torso:101,thigh:-161,shin:64,foot:152,thigh2:-14,shin2:-178,foot2:180,handAt:[-21,43],bend:1,upper2:100,fore2:108,neck:14,lum:-4,tho:-5}}},
  halbspagat:{n:"Spagat-Vorbereitung",sa:"Ardha Hanumanasana",lv:3,r:"beine",z:"Beinrückseite · Hüftbeuger",sec:30,uni:1,alt:"pyramide",
    c:["Aus dem knienden Ausfallschritt die Hüfte über das hintere Knie","Vorderes Bein strecken, Zehen zeigen nach oben","Mit langem Rücken nach vorn beugen, Hände auf Blöcke"],a:"Ausatmen und etwas tiefer sinken, nie federn.",
    an:{anchor:"hip",at:[0,50],A:{torso:16,thigh:-30.7,shin:-30.7,foot:58,thigh2:-90,shin2:180,foot2:180,handAt:[46,9],bend:-1,neck:-10,tho:-3},B:{torso:12,thigh:-30.7,shin:-30.7,foot:58,thigh2:-90,shin2:180,foot2:180,handAt:[47,9],bend:-1,neck:-12,tho:-4},eq:[{t:"yblock",x:47}]}},
  echseunter:{n:"Echse auf den Unterarmen",sa:"Utthan Pristhasana (tief)",lv:3,r:"huefte",z:"Hüftbeuger · Leiste · Gesäß",sec:30,uni:1,alt:"eidechse",
    c:["Tiefer Ausfallschritt, beide Hände innen neben den vorderen Fuß","Unterarme nacheinander auf die Matte oder einen Block","Hinteres Knie bleibt am Boden, Hüfte sinkt"],a:"Lang ausatmen und die Hüfte loslassen.",
    an:{anchor:"hip",at:[0,31],A:{torso:6,thigh:22,shin:-96,foot:0,thigh2:-140,shin2:180,foot2:180,upper:-102,fore:0,neck:-6},B:{torso:4,thigh:22,shin:-96,foot:0,thigh2:-140,shin2:180,foot2:180,upper:-104,fore:0,neck:-7}}},
  bootvoll:{n:"Boot",sa:"Paripurna Navasana",lv:3,r:"ganz",z:"Bauch · Hüftbeuger · Rücken",sec:15,alt:"bootkn",
    c:["Aus dem Halben Boot die Beine strecken","Oberkörper und Beine bilden ein V, Rücken lang","Arme parallel zum Boden, Schultern sinken"],a:"Gleichmäßig weiteratmen, nicht pressen.",
    an:{anchor:"hip",at:[0,9],A:{torso:120,thigh:52,shin:52,foot:56,upper:0,fore:0,neck:-24},B:{torso:118,thigh:54,shin:54,foot:58,upper:2,fore:2,neck:-24}}},
  seitstuetzbein:{n:"Seitstütz mit gehobenem Bein",sa:"Vasisthasana-Variante",lv:3,r:"ganz",z:"Schultern · seitlicher Rumpf · Hüfte",sec:15,uni:1,alt:"seitstuetz",risk:"arm",
    c:["Aus dem Seitstütz das obere Bein gestreckt anheben","Hüfte bleibt oben, Becken kippt nicht nach hinten","Obere Hand zur Decke oder zum Fuß"],a:"Gleichmäßig atmen, Blick nach vorn.",
    an:{view:"front",floor:0,A:{yf:1,hx:4,hy:47,lean:60,aR:[-77,2],aL:[-66,52],ua:-30,fa:-30,uaL:150,faL:150},B:{yf:1,hx:4,hy:47.6,lean:59.6,aR:[-77,2],aL:[-66,55],ua:-30.4,fa:-30.4,uaL:146,faL:148}}},
  chaturanga:{n:"Chaturanga",sa:"Chaturanga Dandasana",lv:3,r:"brust",z:"Arme · Brust · Rumpf",sec:10,alt:"brett",risk:"arm",
    c:["Aus dem Brett nach vorn schieben und die Ellbogen nach hinten beugen","Oberarme eng am Körper, höchstens bis waagerecht","Körper bleibt eine gerade Linie, Schultern nicht unter Ellbogenhöhe"],a:"Ruhig weiteratmen, lieber kurz und sauber.",
    an:{anchor:"hand",A:{upper:-170,fore:-90,torso:11,thigh:191,shin:191,foot:-36,neck:-6},B:{upper:-168,fore:-89,torso:11.4,thigh:191.4,shin:191.4,foot:-36,neck:-6}}},
  hochhund:{n:"Heraufschauender Hund",sa:"Urdhva Mukha Svanasana",lv:3,r:"ruecken",z:"Brust · Bauch · unterer Rücken",sec:15,alt:"kobra",
    c:["Bauchlage, Hände neben den Rippen, Fußrücken auf der Matte","Arme strecken, Oberschenkel heben vom Boden ab","Schultern weg von den Ohren, Brust nach vorn-oben"],a:"Einatmen hinein, oben ruhig weiteratmen.",
    an:{anchor:"hip",at:[0,24],flip:1,A:{torso:150,thigh:-14,shin:-14,foot:-6,handAt:[-51,1],bend:1,neck:-16},B:{torso:148,thigh:-14.4,shin:-14.4,foot:-6,handAt:[-51,1],bend:1,neck:-18}}},
  feueratem:{n:"Feueratem im Sitz",sa:"Kapalabhati",lv:3,r:"ganz",z:"Atmung · Bauchmuskeln",sec:30,alt:"sukhasana",
    c:["Aufrecht im bequemen Sitz, Hände auf den Knien","Kurz und kräftig durch die Nase ausatmen, der Bauch zieht nach innen","Einatmen passiert von allein, anfangs nur 20–30 Atemzüge"],a:"Bei Schwindel sofort aufhören und ruhig atmen. Nicht bei hohem Blutdruck oder in der Schwangerschaft.",
    an:{view:"front",tempo:[.28,.06,.42,.08],ph:["Ausatmen","Einatmen"],A:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],hR:[33,100],hL:[-33,100],bR:-1,bL:1,shr:0},B:{yf:1,hy:12.6,kR:[39,18],aR:[-13,8],aL:[13,7],hR:[33,100],hL:[-33,100],bR:-1,bL:1,shr:1.6}}}
});

/* ================= 3.4 · YOGA-BIBLIOTHEK ERWEITERT (@ Joschy) =================
   58 neue Haltungen (Anfänger, Fortgeschritten, Profi). Jede neue Haltung hat eine leichtere Variante (alt); belastende Haltungen
   für Schulter, Hüfte oder Knie zusätzlich einen Achtung-Hinweis (risk). Animationen über dieselbe Engine (Stand -> Haltung -> Stand). */
Object.assign(YRISK,{
  shoulder:"Belastet die Schultern: nur so weit gehen, wie es schmerzfrei ist, Schultern weg von den Ohren. Bei Schulterbeschwerden die leichtere Variante nehmen.",
  hip:"Starke Hüftdehnung: langsam hineingehen, nichts erzwingen, Kissen oder Block unterlegen. Bei Hüft- oder Leistenbeschwerden die leichtere Variante nehmen.",
  knee:"Starke Kniebeugung: bei Druck oder Ziehen im Knie sofort lösen, Kissen unter Gesäß oder Knie legen. Bei Kniebeschwerden die leichtere Variante nehmen."});
Object.assign(YP,{
  /* ---- 3.4 · Anfänger ---- */
  palme:{n:"Palme",sa:"Talasana",lv:1,r:"ganz",z:"Gleichgewicht · Waden · Flanken",sec:20,alt:"armeheben",
    c:["Arme über vorn nach oben strecken, Handflächen zueinander","Langsam auf die Fußballen kommen, Fersen heben","Bauch leicht fest, Blick auf einen festen Punkt"],a:"Einatmen auf die Zehen, oben ruhig weiteratmen.",
    an:{anchor:"foot",noBal:1,A:{...STAND,at:[0,6.5],foot:-36,torso:89,upper:91,fore:92,neck:4},B:{...STAND,at:[0,7.5],foot:-43,torso:89.5,upper:92,fore:93,neck:6}}},
  rueckbeuge:{n:"Stehende Rückbeuge",sa:"Anuvittasana",lv:1,r:"brust",z:"Brust · Bauch · Hüftbeuger",sec:20,alt:"armeheben",
    c:["Füße hüftbreit, Hände stützen das Becken oder Arme nach oben","Becken leicht nach vorn, Brustbein hebt sich nach oben-hinten","Nur so weit wie angenehm, Kopf fällt nicht in den Nacken"],a:"Einatmen in die Brust, ausatmen langsam aufrichten.",
    an:{anchor:"foot",noBal:1,A:{shin:-96,thigh:-93,torso:100,upper:100,fore:103,neck:8,lum:2,tho:1},B:{shin:-97,thigh:-94,torso:105,upper:106,fore:110,neck:12,lum:3,tho:1.5}}},
  kniestand:{n:"Knie zur Brust im Stehen",sa:"Tadasana mit Knie",lv:1,r:"huefte",z:"Gesäß · Hüfte · Gleichgewicht",sec:20,uni:1,alt:"windloeser",
    c:["Auf einem Bein stehen, Standbein weich","Anderes Knie heben und mit beiden Händen zur Brust ziehen","Oberkörper aufrecht, Schultern sinken"],a:"Ruhig weiteratmen, Blick auf einen festen Punkt.",
    an:{anchor:"foot",noBal:1,A:{...STAND,torso:89,thigh2:58,shin2:-104,foot2:-20,handAt:[21,116.5],bend:-1,neck:0},B:{...STAND,torso:90,thigh2:64,shin2:-100,foot2:-16,handAt:[18,118.5],bend:-1,neck:2}}},
  wandhund:{n:"Halber Hund an der Wand",sa:"Ardha Adho Mukha Svanasana",lv:1,r:"schulter",z:"Schultern · Brust · Beinrückseite",sec:30,alt:"armeheben",
    c:["Hände auf Hüfthöhe schulterbreit an die Wand","Zurückgehen, bis Oberkörper und Arme eine Linie bilden","Brust sinkt sanft Richtung Boden, Knie dürfen weich sein"],a:"Ausatmen und die Brust etwas tiefer sinken lassen.",
    an:{anchor:"foot",noBal:1,A:{shin:-94,thigh:-86,torso:-2,upper:4,fore:3,neck:-2,lum:-1,tho:-1},B:{shin:-94,thigh:-85,torso:-7,upper:6,fore:5,neck:-1,lum:-1.5,tho:-1.5},eq:[{t:"wall",x:121}]}},
  reiter:{n:"Reiterhaltung",sa:"Ashwa Sanchalanasana",lv:1,r:"huefte",z:"Hüftbeuger · Leiste · Beine",sec:30,uni:1,alt:"tiefausfall",
    c:["Großer Schritt, hinteres Knie auf der Matte","Hände links und rechts neben den vorderen Fuß","Brust nach vorn, Becken sinkt, Blick nach vorn"],a:"Ausatmen und die Hüfte etwas tiefer sinken lassen.",
    an:{anchor:"hip",at:[0,34],A:{torso:28,thigh:15,shin:-96,foot:0,thigh2:-140,shin2:180,foot2:180,handAt:[46,3],bend:-1,neck:24},B:{torso:29,thigh:15,shin:-96,foot:0,thigh2:-140,shin2:180,foot2:180,handAt:[46,3],bend:-1,neck:28}}},
  loewe:{n:"Löwe",sa:"Simhasana",lv:1,r:"ganz",z:"Gesicht · Hals · Atmung",sec:30,alt:"fersensitz",
    c:["Im Fersensitz die Hände auf die Oberschenkel, Finger gespreizt","Einatmen durch die Nase","Kräftig durch den Mund ausatmen, Zunge raus, Blick nach oben"],a:"Ausatmen mit einem lauten „Haaa“, 3–5 Wiederholungen.",
    an:{anchor:"hip",at:[0,20],tempo:[2.2,.3,1.4,.9],ph:["Einatmen","Ausatmen · Zunge raus"],A:{torso:76,thigh:-20.5,shin:180,foot:180,handAt:[34,21],bend:1,neck:4},B:{torso:66,thigh:-20.5,shin:180,foot:180,handAt:[37,20],bend:1,neck:16}}},
  tiger:{n:"Tiger",sa:"Vyaghrasana",lv:1,r:"ruecken",z:"Rücken · Gesäß · Hüftbeuger",sec:30,uni:1,alt:"katzekuh",
    c:["Vierfüßlerstand, Hände unter den Schultern","Ausatmen: Knie Richtung Nase, Rücken rund","Einatmen: Bein nach hinten-oben, Knie gebeugt, Blick nach vorn"],a:"Die Atmung führt die Bewegung.",
    an:{anchor:"hip",at:[0,51],tempo:[3,.6,3,.6],ph:["Ausatmen · Knie zur Nase","Einatmen · Bein hoch"],A:{torso:9,thigh:-90,shin:180,foot:180,thigh2:-40,shin2:175,foot2:180,upper:-90,fore:-90,neck:-30,lum:-5,tho:-7},B:{torso:10,thigh:-90,shin:180,foot:180,thigh2:165,shin2:80,foot2:150,upper:-90,fore:-90,neck:24,lum:5,tho:2}}},
  kniebrett:{n:"Brett auf den Knien",sa:"Ardha Phalakasana",lv:1,r:"ganz",z:"Bauch · Schultern · Rumpf",sec:20,alt:"vierfuessler",
    c:["Hände unter den Schultern, Knie hinter der Hüfte ablegen","Eine gerade Linie von den Knien bis zum Kopf","Bauch fest, Schultern weg von den Ohren"],a:"Gleichmäßig weiteratmen, nicht pressen.",
    an:{anchor:"hand",A:{upper:-90,fore:-90,torso:32,thigh:212,shin:180,foot:180,neck:-8},B:{upper:-90,fore:-90,torso:31.6,thigh:211.6,shin:180,foot:180,neck:-8}}},
  /* ---- 3.4 · Fortgeschritten ---- */
  hoherausfall:{n:"Hoher Ausfallschritt",sa:"Ashta Chandrasana",lv:2,r:"huefte",z:"Hüftbeuger · Beine · Gleichgewicht",sec:30,uni:1,alt:"tiefausfall",
    c:["Großer Schritt, vorderes Knie über dem Knöchel","Hintere Ferse gehoben, hinteres Bein lang","Arme nach oben, Becken gerade nach vorn"],a:"Einatmen lang nach oben, ausatmen tiefer sinken.",
    an:{anchor:"hip",at:[0,54],A:{torso:90,thigh:-10,shin:-90,foot:0,thigh2:-150,shin2:-150,foot2:-50,upper:93,fore:95,neck:3},B:{torso:92,thigh:-10,shin:-90,foot:0,thigh2:-150,shin2:-150,foot2:-50,upper:98,fore:100,neck:6}}},
  demkrieger:{n:"Demütiger Krieger",sa:"Baddha Virabhadrasana",lv:2,r:"schulter",z:"Schultern · Hüfte · Beine",sec:20,uni:1,alt:"krieger1",risk:"shoulder",
    c:["Aus Krieger I die Hände hinter dem Rücken verschränken","Oberkörper an der Innenseite des vorderen Knies nach unten sinken lassen","Arme Richtung Decke, bei Schulterdruck Hände an die Hüfte"],a:"Ausatmen beim Sinken, unten ruhig weiteratmen.",
    an:{anchor:"hip",at:[0,62],A:{torso:-38,thigh:-20,shin:-90,foot:0,thigh2:-139.5,shin2:-139.5,foot2:8,upper:118,fore:116,neck:6,tho:-2},B:{torso:-42,thigh:-20,shin:-90,foot:0,thigh2:-139.5,shin2:-139.5,foot2:8,upper:112,fore:110,neck:4,tho:-2.5}}},
  drehausfall:{n:"Gedrehter Ausfallschritt",sa:"Parivrtta Anjaneyasana",lv:2,r:"ruecken",z:"Wirbelsäule · Hüftbeuger",sec:30,uni:1,alt:"tiefausfall",
    c:["Tiefer Ausfallschritt, hinteres Knie auf der Matte","Hände vor der Brust zusammen, Ellbogen außen ans vordere Knie","Erst lang machen, dann drehen, Blick nach oben"],a:"Einatmen lang machen, ausatmen etwas weiter drehen.",
    an:{anchor:"hip",at:[0,35],A:{torso:52,thigh:14,shin:-88,foot:0,thigh2:-142,shin2:180,foot2:180,upper:-72,fore:88,neck:30,tho:-1},B:{torso:48,thigh:14,shin:-88,foot:0,thigh2:-142,shin2:180,foot2:180,upper:-74,fore:86,neck:34,tho:-1.5}}},
  achtpunkt:{n:"Acht-Punkt-Haltung",sa:"Ashtanga Namaskara",lv:2,r:"brust",z:"Brust · Schultern · Arme",sec:15,alt:"welpe",
    c:["Aus dem Vierfüßlerstand Knie, Brust und Kinn ablegen","Hüfte bleibt oben, Ellbogen eng am Körper","Hände unter den Schultern, Zehen aufgestellt"],a:"Ruhig weiteratmen, Schultern weg von den Ohren.",
    an:{anchor:"hip",at:[16,47],A:{torso:-43.5,thigh:-110,shin:180,foot:180,handAt:[52,2],bend:-1,neck:50,tho:1},B:{torso:-44,thigh:-110.5,shin:180,foot:180,handAt:[52,2],bend:-1,neck:51,tho:1}}},
  unterarmstuetz:{n:"Unterarmstütz",sa:"Makara Adho Mukha Svanasana",lv:2,r:"ganz",z:"Bauch · Schultern · Rumpf",sec:20,alt:"kniebrett",
    c:["Unterarme parallel, Ellbogen unter den Schultern","Beine lang nach hinten, Zehen aufgestellt","Körper bildet eine gerade Linie, Bauch und Gesäß fest"],a:"Gleichmäßig weiteratmen, nicht pressen.",
    an:{anchor:"hand",at:[0,3],A:{upper:-88,fore:0,torso:11,thigh:191,shin:191,foot:-30,neck:-6},B:{upper:-88,fore:0,torso:10.6,thigh:190.6,shin:190.6,foot:-30.4,neck:-6}}},
  /* ---- 3.4 · Profi ---- */
  stehspagat:{n:"Stehender Spagat",sa:"Urdhva Prasarita Eka Padasana",lv:3,r:"beine",z:"Beinrückseite · Hüfte · Gleichgewicht",sec:20,uni:1,alt:"hund3",
    c:["Aus der Vorbeuge die Hände neben den Standfuß","Ein Bein lang nach hinten-oben heben","Becken bleibt gerade, Kopf hängt locker zum Schienbein"],a:"Ausatmen und das Bein etwas höher, nie federn.",
    an:{anchor:"foot",noBal:1,A:{shin:-91,thigh:-86,torso:-80,thigh2:108,shin2:110,foot2:128,handAt:[16,1.5],bend:-1,neck:-10,lum:-1,tho:-3},B:{shin:-91,thigh:-86,torso:-82,thigh2:112,shin2:114,foot2:132,handAt:[16,1.5],bend:-1,neck:-10,lum:-1,tho:-3.5}}},
  /* ---- 3.4 · Batch 2: Sitzen, Liegen, Umkehr ---- */
  stab:{n:"Stabhaltung",sa:"Dandasana",lv:1,r:"ruecken",z:"Rücken · Haltung · Beinrückseite",sec:30,alt:"sukhasana",
    c:["Langsitz, Beine gestreckt, Zehen zeigen nach oben","Hände neben der Hüfte, Finger nach vorn","Scheitel zieht nach oben, Brust weit, Knie dürfen leicht gebeugt sein"],a:"Einatmen und lang werden, ausatmen Schultern sinken lassen.",
    an:{anchor:"hip",at:[0,9],A:{torso:93,thigh:0,shin:-1,foot:80,handAt:[8,9],bend:-1,neck:-2},B:{torso:92,thigh:0,shin:-1,foot:82,handAt:[8,9],bend:-1,neck:-1}}},
  schneidervor:{n:"Vorbeuge im Schneidersitz",sa:"Adho Mukha Sukhasana",lv:1,r:"huefte",z:"Gesäß · äußere Hüfte · Rücken",sec:40,alt:"sukhasana",
    c:["Im Schneidersitz aufrecht sitzen","Hände nach vorn auf die Matte wandern lassen","Rücken lang, Gesäß bleibt am Boden, nach der Hälfte Beine andersherum kreuzen"],a:"Ausatmen und die Hände ein Stück weiter wandern lassen.",
    an:{anchor:"hip",at:[0,9],A:{torso:42,thigh:31,shin:-136,foot:-8,thigh2:23,shin2:-145,foot2:-4,handAt:[78,4],bend:-1,neck:-12,lum:-1.5,tho:-2.5},B:{torso:38,thigh:31,shin:-136,foot:-8,thigh2:23,shin2:-145,foot2:-4,handAt:[80,4],bend:-1,neck:-14,lum:-2,tho:-3}}},
  marichi1:{n:"Marichi-Vorbeuge",sa:"Marichyasana I",lv:2,r:"beine",z:"Beinrückseite · Hüfte · Schultern",sec:30,uni:1,alt:"kopfknie",risk:"shoulder",
    c:["Langsitz, ein Bein aufstellen, Fuß nah am Gesäß","Arm von innen um das aufgestellte Schienbein legen","Mit langem Rücken über das gestreckte Bein beugen, Hände hinter dem Rücken fassen oder Gurt"],a:"Einatmen lang machen, ausatmen etwas tiefer sinken.",
    an:{anchor:"hip",at:[0,9],A:{torso:36,thigh:60,shin:-94,foot:0,thigh2:0,shin2:-1,foot2:76,upper:-84,fore:186,neck:-10,tho:-3},B:{torso:33,thigh:60,shin:-94,foot:0,thigh2:0,shin2:-1,foot2:76,upper:-86,fore:184,neck:-12,tho:-3.5}}},
  marichi3:{n:"Marichi-Drehsitz",sa:"Marichyasana III",lv:2,r:"ruecken",z:"Wirbelsäule · Gesäß · Schultern",sec:30,uni:1,alt:"drehsitz",
    c:["Langsitz, ein Bein aufstellen, das andere bleibt lang","Hintere Hand stützt hinter dem Po, Ellbogen außen ans aufgestellte Knie","Erst lang machen, dann drehen, Blick über die Schulter"],a:"Einatmen aufrichten, ausatmen etwas weiter drehen.",
    an:{anchor:"hip",at:[0,9],A:{torso:93,thigh:53,shin:-87,foot:0,thigh2:0,shin2:-1,foot2:76,handAt:[-18,9],bend:1,upper2:-35,fore2:85,neck:6},B:{torso:94,thigh:53,shin:-87,foot:0,thigh2:0,shin2:-1,foot2:76,handAt:[-18,9],bend:1,upper2:-37,fore2:86,neck:8}}},
  bharadvaja:{n:"Bharadvaja-Drehsitz",sa:"Bharadvajasana",lv:2,r:"ruecken",z:"Wirbelsäule · Schultern · Hüfte",sec:30,uni:1,alt:"sitzseitbeuge",
    c:["Sitzen, beide Beine gebeugt zu einer Seite ablegen","Hand ans äußere Knie, andere Hand hinter dem Po","Erst lang machen, dann zur Seite der Knie weg drehen"],a:"Einatmen aufrichten, ausatmen sanft weiterdrehen.",
    an:{anchor:"hip",at:[0,9],A:{torso:82,thigh:6,shin:178,foot:180,thigh2:2,shin2:176,foot2:182,handAt:[42,20],bend:-1,upper2:-112,fore2:-100,neck:6},B:{torso:83,thigh:6,shin:178,foot:180,thigh2:2,shin2:176,foot2:182,handAt:[42,20],bend:-1,upper2:-113,fore2:-101,neck:8}}},
  liegheld:{n:"Liegender Held",sa:"Supta Virasana",lv:2,r:"beine",z:"Oberschenkel vorn · Hüftbeuger · Knie",sec:30,alt:"heldensitz",risk:"knee",
    c:["Aus dem Heldensitz die Hände hinter den Po setzen","Auf die Unterarme und langsam auf den Rücken sinken, Kissen erlaubt","Knie bleiben zusammen, Rücken nicht ins Hohlkreuz"],a:"Ruhig in den Bauch atmen, über die Unterarme wieder hochkommen.",
    an:{anchor:"hip",at:[0,16],A:{torso:188,thigh:-15,shin:180,foot:180,upper:-6,fore:-3,neck:-13},B:{torso:187.4,thigh:-15,shin:180,foot:180,upper:-6,fore:-3,neck:-13.4}}},
  bruecke1:{n:"Einbeinige Brücke",sa:"Eka Pada Setu Bandhasana",lv:2,r:"huefte",z:"Gesäß · Hüftbeuger · Rumpf",sec:20,uni:1,alt:"bruecke",
    c:["Aus der Brücke das Becken oben halten","Ein Bein lang nach oben strecken, Fuß gebeugt","Becken bleibt waagerecht, Standfuß drückt in die Matte"],a:"Gleichmäßig weiteratmen, ausatmen beim Ablegen.",
    an:{anchor:"shoulder",at:[0,9],A:{torso:204,thigh:5,shin:-53,foot:0,thigh2:75,shin2:76,foot2:165,hand:[40,-6],bend:1,neck:-27,lum:.4},B:{torso:204,thigh:5,shin:-53,foot:0,thigh2:79,shin2:80,foot2:169,hand:[40,-6],bend:1,neck:-27,lum:.8}}},
  superman:{n:"Superman",sa:"Viparita Shalabhasana",lv:2,r:"ruecken",z:"Rücken · Gesäß · Schultern",sec:15,alt:"heuschrecke",risk:"shoulder",
    c:["Bauchlage, Arme lang nach vorn","Arme, Brust und Beine gleichzeitig leicht anheben","Nacken lang, Blick zum Boden, nicht ins Hohlkreuz pressen"],a:"Oben gleichmäßig weiteratmen.",
    an:{anchor:"hip",at:[0,10],flip:1,A:{torso:168,thigh:8,shin:8,foot:-6,upper:172,fore:174,neck:-4},B:{torso:165,thigh:11,shin:11,foot:-6,upper:168,fore:170,neck:-6}}},
  halbheuschrecke:{n:"Halbe Heuschrecke",sa:"Ardha Salabhasana",lv:1,r:"ruecken",z:"Unterer Rücken · Gesäß",sec:20,uni:1,alt:"krokodil",
    c:["Bauchlage, Arme neben dem Körper, Kinn auf der Matte","Ein gestrecktes Bein langsam anheben","Becken bleibt am Boden, nicht verdrehen"],a:"Einatmen heben, ausatmen ablegen.",
    an:{anchor:"hip",at:[0,10],flip:1,A:{torso:176,thigh:0,shin:0,foot:-12,thigh2:14,shin2:14,foot2:-4,upper:2,fore:2,neck:-6},B:{torso:176,thigh:0,shin:0,foot:-12,thigh2:17,shin2:17,foot2:-4,upper:2,fore:2,neck:-6}}},
  bogenvoll:{n:"Bogen",sa:"Dhanurasana",lv:3,r:"brust",z:"Brust · Hüftbeuger · Schultern",sec:15,alt:"bogen",risk:"back",
    c:["Bauchlage, Knie beugen, mit beiden Händen die Fußgelenke fassen","Füße in die Hände drücken, Brust und Oberschenkel heben","Knie nicht weiter als hüftbreit, Nacken lang"],a:"Einatmen heben, oben ruhig weiteratmen, ausatmen ablegen.",
    an:{anchor:"hip",at:[0,10],flip:1,A:{torso:138,thigh:16,shin:132,foot:150,thigh2:16,shin2:132,foot2:150,handAt:[14,57],bend:-1,neck:-10},B:{torso:135,thigh:19,shin:130,foot:148,thigh2:19,shin2:130,foot2:148,handAt:[14,60],bend:-1,neck:-12}}},
  frosch:{n:"Frosch",sa:"Bhekasana",lv:3,r:"beine",z:"Oberschenkel vorn · Knie · Brust",sec:15,alt:"bogen",risk:"knee",
    c:["Bauchlage, auf die Unterarme stützen","Beide Knie beugen, die Hände auf die Fußrücken legen","Füße sanft Richtung Boden neben die Hüfte drücken, Brust hebt sich"],a:"Ruhig weiteratmen, nicht ruckartig drücken.",
    an:{anchor:"hip",at:[0,10],flip:1,A:{torso:152,thigh:0,shin:165,foot:200,thigh2:0,shin2:163,foot2:198,handAt:[-2,26],bend:1,neck:-8},B:{torso:154,thigh:0,shin:167,foot:202,thigh2:0,shin2:165,foot2:200,handAt:[-2,25],bend:1,neck:-9}}},
  spagat:{n:"Spagat",sa:"Hanumanasana",lv:3,r:"beine",z:"Beinrückseite · Hüftbeuger · Leiste",sec:30,uni:1,alt:"eidechse",risk:"hip",
    c:["Aus der Spagat-Vorbereitung das vordere Bein nach vorn gleiten lassen","Hinteres Bein lang nach hinten, Becken zeigt nach vorn","Blöcke unter die Hände oder ein Kissen unter das Becken, nie federn"],a:"Ruhig und lang ausatmen, nur so tief wie es angenehm ist.",
    an:{anchor:"hip",at:[0,12],A:{torso:90,thigh:-6,shin:-6,foot:80,thigh2:-172,shin2:-174,foot2:180,upper:92,fore:94,neck:4},B:{torso:92,thigh:-6,shin:-6,foot:80,thigh2:-172,shin2:-174,foot2:180,upper:96,fore:98,neck:6}}},
  ohrendruck:{n:"Ohrendruck",sa:"Karnapidasana",lv:3,r:"ruecken",z:"Rücken · Nacken · Gesäß",sec:15,alt:"kniebrust",risk:"inv",
    c:["Aus dem Pflug die Knie beugen und neben die Ohren sinken lassen","Arme lang auf der Matte oder Hände stützen den Rücken","Nacken nie belasten oder drehen, langsam abrollen"],a:"Flach weiteratmen, der Bauch ist zusammengedrückt.",
    an:{anchor:"shoulder",at:[0,9],A:{torso:-85,thigh:248,shin:200,foot:180,upper:-3,fore:-3,neck:-95},B:{torso:-84,thigh:249,shin:201,foot:181,upper:-3,fore:-3,neck:-96}}},
  halbschulter:{n:"Halber Schulterstand",sa:"Viparita Karani Mudra",lv:3,r:"ganz",z:"Schultern · Rumpf · Beine",sec:30,alt:"beinewand",risk:"inv",
    c:["Rückenlage, Beine über den Kopf schwingen, Hände stützen das Becken","Ellbogen schulterbreit auf der Matte, Becken ruht in den Händen","Beine schräg nach oben, Kopf nie drehen"],a:"Ruhig atmen, langsam Wirbel für Wirbel ablegen.",
    an:{anchor:"shoulder",at:[0,9],A:{torso:-125,thigh:100,shin:100,foot:104,upper:0,fore:85,neck:-55},B:{torso:-124.4,thigh:100.6,shin:100.6,foot:105,upper:0,fore:85,neck:-55.6}}},
  schildkroete:{n:"Schildkröte",sa:"Kurmasana",lv:3,r:"ruecken",z:"Rücken · Beinrückseite · Hüfte",sec:20,alt:"sitzvorbeuge",risk:"hip",
    c:["Grätschsitz, Knie leicht gebeugt, Oberkörper nach vorn","Arme unter den Knien hindurch zur Seite strecken","Brust sinkt zur Matte, Beine langsam strecken, nicht ziehen"],a:"Lang ausatmen und den Rücken loslassen.",
    an:{anchor:"hip",at:[0,9],A:{torso:12,thigh:8,shin:-14,foot:60,upper:-168,fore:-178,neck:-32,lum:-2,tho:-4},B:{torso:11,thigh:8,shin:-13,foot:61,upper:-168,fore:-178,neck:-33,lum:-2.5,tho:-4.5}}},
  reiher:{n:"Reiher",sa:"Krounchasana",lv:3,r:"beine",z:"Beinrückseite · Oberschenkel vorn",sec:20,uni:1,alt:"beingurt",risk:"knee",
    c:["Ein Bein im Heldensitz nach hinten falten, anderes Knie aufstellen","Fuß mit beiden Händen fassen und das Bein nach oben strecken","Rücken lang, Brust zum Schienbein, Gurt erlaubt"],a:"Einatmen lang machen, ausatmen das Bein etwas heranholen.",
    an:{anchor:"hip",at:[0,9],A:{torso:96,thigh:2,shin:178,foot:180,thigh2:70,shin2:70,foot2:100,handAt:[31,95],bend:-1,neck:-24},B:{torso:97,thigh:2,shin:178,foot:180,thigh2:73,shin2:73,foot2:103,handAt:[27,96.5],bend:-1,neck:-26}}},
  zehenboot:{n:"Zehen-Boot",sa:"Ubhaya Padangusthasana",lv:3,r:"beine",z:"Beinrückseite · Bauch · Gleichgewicht",sec:15,alt:"bootkn",
    c:["Sitzen, Knie gebeugt, die großen Zehen fassen","Auf die Sitzknochen zurückrollen und beide Beine strecken","Rücken lang, Brust offen, Knie dürfen leicht gebeugt bleiben"],a:"Gleichmäßig weiteratmen, Blick nach vorn-oben.",
    an:{anchor:"hip",at:[0,9],A:{torso:108,thigh:71,shin:71,foot:96,handAt:[30,96],bend:-1,neck:-10},B:{torso:107,thigh:72,shin:72,foot:97,handAt:[28.4,96.5],bend:-1,neck:-12}}},
  pfau:{n:"Pfau",sa:"Mayurasana",lv:3,r:"brust",z:"Handgelenke · Arme · Rumpf",sec:10,alt:"brett",risk:"arm",
    c:["Kniend die Hände mit den Fingern zu den Füßen aufsetzen","Ellbogen in den Bauch, Oberkörper weit nach vorn legen","Beine lang nach hinten und abheben, Körper waagerecht"],a:"Ruhig weiteratmen, lieber kurz und sauber.",
    an:{anchor:"hand",A:{fore:-95,upper:-160,torso:-6,thigh:186,shin:186,foot:186,neck:14},B:{fore:-94,upper:-159,torso:-5.5,thigh:186.5,shin:186.5,foot:186,neck:15}}},
  handstand:{n:"Handstand",sa:"Adho Mukha Vrksasana",lv:3,r:"schulter",z:"Schultern · Handgelenke · Rumpf",sec:15,alt:"delfin",risk:"inv",
    c:["Aus dem Hund die Füße heranlaufen, Hände schulterbreit, Finger gespreizt","Ein Bein heben und mit Schwung über die Hände kommen, anfangs an der Wand","Arme gestreckt, Bauch fest, Blick zwischen die Hände"],a:"Gleichmäßig weiteratmen, kontrolliert wieder ablegen.",
    an:{anchor:"hand",A:{fore:-90,upper:-90,torso:-90,thigh:90,shin:90,foot:92,neck:20},B:{fore:-90.6,upper:-90.6,torso:-90.8,thigh:89.4,shin:89.8,foot:93,neck:21}}},
  unterarmstand:{n:"Unterarmstand",sa:"Pincha Mayurasana",lv:3,r:"schulter",z:"Schultern · Rumpf · Gleichgewicht",sec:15,alt:"delfin",risk:"inv",
    c:["Aus dem Delfin die Füße heranlaufen, Unterarme parallel","Ein Bein heben und kontrolliert hochschwingen, anfangs an der Wand","Schultern über den Ellbogen, Kopf frei, Blick nach vorn"],a:"Ruhig weiteratmen, langsam ablegen und in der Kindshaltung ausruhen.",
    an:{anchor:"hand",at:[0,3],A:{fore:0,upper:-90,torso:-90,thigh:90,shin:90,foot:92,neck:40},B:{fore:0,upper:-90.6,torso:-90.8,thigh:89.4,shin:89.8,foot:93,neck:41}}},
  kopfkniestand:{n:"Kopf-zum-Knie im Stand",sa:"Dandayamana Janushirasana",lv:3,r:"beine",z:"Gleichgewicht · Beinrückseite · Rumpf",sec:20,uni:1,alt:"beingurt",
    c:["Auf einem Bein stehen, den anderen Fuß mit beiden Händen fassen","Bein nach vorn strecken, Standbein bleibt fest","Ellbogen nach unten, Oberkörper sinkt Richtung Knie"],a:"Ruhig weiteratmen, Blick auf einen festen Punkt.",
    an:{anchor:"foot",noBal:1,A:{shin:-86,thigh:-82,torso:2,thigh2:0,shin2:0,foot2:80,handAt:[80,96],bend:-1,neck:-18,tho:-3},B:{shin:-86,thigh:-82,torso:-2,thigh2:-1,shin2:-1,foot2:80,handAt:[80,94],bend:-1,neck:-20,tho:-4}}},
  drehvorbeuge:{n:"Gedrehte Vorbeuge",sa:"Parivrtta Uttanasana",lv:2,r:"ruecken",z:"Wirbelsäule · Beinrückseite",sec:20,uni:1,alt:"vorbeuge",
    c:["Aus der Vorbeuge eine Hand unter die Schulter auf die Matte","Andere Hand an die Hüfte, dann Arm zur Decke strecken","Knie weich, Hüfte bleibt gerade über den Füßen"],a:"Einatmen lang machen, ausatmen aufdrehen.",
    an:{anchor:"foot",noBal:1,padT:24,A:{shin:-104,thigh:-62,torso:-50,handAt:[40,2],bend:1,upper2:88,fore2:88,neck:22,lum:-1,tho:-2},B:{shin:-104,thigh:-62,torso:-52,handAt:[40,2],bend:1,upper2:92,fore2:92,neck:26,lum:-1,tho:-2}}},
  /* ---- 3.4 · Batch 3: Frontansicht (Stand, Sitz, Seitlage) ---- */
  stern:{n:"Fünfzackiger Stern",sa:"Utthita Tadasana",lv:1,r:"ganz",z:"Ganzkörper · Schultern · Haltung",sec:20,alt:"berg",
    c:["Weiter Stand, Füße parallel","Arme auf Schulterhöhe weit zur Seite strecken","Scheitel, Fingerspitzen und Füße ziehen in fünf Richtungen auseinander"],a:"Einatmen und weit werden, ausatmen Schultern sinken lassen.",
    an:{view:"front",A:{yf:1,hy:75,aR:[62,0],ua:6,fa:8},B:{yf:1,hy:74.6,aR:[62,0],ua:10,fa:13}}},
  sitzberg:{n:"Sitzender Berg",sa:"Parvatasana",lv:1,r:"schulter",z:"Schultern · Flanken · Haltung",sec:30,alt:"sukhasana",
    c:["Im Schneidersitz aufrecht sitzen","Finger verschränken, Handflächen nach oben über den Kopf strecken","Schultern weg von den Ohren, Rippen sinken"],a:"Einatmen nach oben wachsen, ausatmen Schultern sinken lassen.",
    an:{view:"front",A:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],hR:[2.5,205],hL:[-2.5,205],bR:1,bL:-1},B:{yf:1,hy:13.4,kR:[39,18],aR:[-13,8],aL:[13,7],hR:[2.5,207],hL:[-2.5,207],bR:1,bL:-1}}},
  sitzdreh:{n:"Drehung im Schneidersitz",sa:"Parivrtta Sukhasana",lv:1,r:"ruecken",z:"Wirbelsäule · Schultern",sec:30,uni:1,alt:"sukhasana",
    c:["Im Schneidersitz aufrecht sitzen","Eine Hand ans gegenüberliegende Knie, die andere hinter den Po","Einatmen lang machen, ausatmen sanft drehen, Blick über die Schulter"],a:"Einatmen aufrichten, ausatmen ein kleines Stück weiter drehen.",
    an:{view:"front",A:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],hR:[-12,101],bR:-1,uaL:-112,faL:-104,tilt:-10,lean:-3},B:{yf:1,hy:13.3,kR:[39,18],aR:[-13,8],aL:[13,7],hR:[-14,102],bR:-1,uaL:-114,faL:-106,tilt:-14,lean:-4}}},
  graetsche:{n:"Grätsche im Sitzen",sa:"Upavistha Konasana",lv:1,r:"huefte",z:"Oberschenkel innen · Beinrückseite",sec:40,alt:"schmetterling",
    c:["Langsitz, Beine weit zur Seite öffnen, Zehen zeigen nach oben","Hände vor dem Körper auf die Matte","Rücken lang, aus der Hüfte leicht nach vorn neigen"],a:"Ausatmen und die Hände ein Stück nach vorn wandern lassen.",
    an:{view:"front",A:{yf:1,hy:13,kR:[46,10],aR:[82,4],hR:[17,86],hL:[-17,86],bR:-1,bL:1,br:-8},B:{yf:1,hy:13,kR:[46,10],aR:[82,4],hR:[17,85],hL:[-17,85],bR:-1,bL:1,br:-11}}},
  wechselatmung:{n:"Wechselatmung",sa:"Nadi Shodhana",lv:1,r:"ganz",z:"Atmung · Ruhe · Konzentration",sec:60,alt:"sukhasana",
    c:["Aufrecht im bequemen Sitz, linke Hand auf dem Knie","Rechter Daumen schließt das rechte Nasenloch, Ringfinger das linke","Links ein, rechts aus, rechts ein, links aus, ruhig und gleichmäßig"],a:"Etwa 4 Sekunden ein, 6 Sekunden aus, ohne zu pressen.",
    an:{view:"front",tempo:[4,.6,5.4,.6],ph:["Links einatmen","Rechts ausatmen"],A:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],ua:-70,us:.5,fa:124,fs:1.1,hL:[-33,100],bL:1,tilt:-2},B:{yf:1,hy:13.4,kR:[39,18],aR:[-13,8],aL:[13,7],ua:-70,us:.5,fa:125,fs:1.12,hL:[-33,100],bL:1,tilt:2,br:.6}}},
  bienenatmung:{n:"Bienenatmung",sa:"Bhramari",lv:1,r:"ganz",z:"Atmung · Nacken · Entspannung",sec:60,alt:"sukhasana",
    c:["Aufrecht im bequemen Sitz, Augen schließen","Daumen verschließen sanft die Ohren, Finger liegen auf der Stirn","Mit geschlossenem Mund summend ausatmen wie eine Biene"],a:"Normal einatmen, lang und summend ausatmen, 5–7 Runden.",
    an:{view:"front",tempo:[3.4,.4,6,.6],ph:["Einatmen","Summend ausatmen"],A:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],ua:20,fa:165},B:{yf:1,hy:13.3,kR:[39,18],aR:[-13,8],aL:[13,7],ua:21,fa:165,br:.4}}},
  wiege:{n:"Baby-Wiege",sa:"Hindolasana",lv:1,r:"huefte",z:"Gesäß · äußere Hüfte",sec:30,uni:1,alt:"figur4",
    c:["Aufrecht sitzen, ein Schienbein anheben","Knie in eine Ellenbeuge, Fuß in die andere, wie ein Baby halten","Rücken lang, sanft hin und her wiegen"],a:"Ruhig in die Hüfte atmen.",
    an:{view:"front",A:{yf:1,hy:13,kR:[36,52],aR:[-17,58],kL:[-39,18],aL:[13,7],hR:[34,135],hL:[-17,135],bR:1,bL:-1},B:{yf:1,hy:13,hx:1.5,lean:2,kR:[37.5,54],aR:[-15.5,59],kL:[-39,18],aL:[13,7],hR:[34,136],hL:[-17,136],bR:1,bL:-1}}},
  halblotus:{n:"Halber Lotus",sa:"Ardha Padmasana",lv:2,r:"huefte",z:"Hüfte · Knie · Haltung",sec:40,uni:1,alt:"sukhasana",risk:"knee",
    c:["Im Schneidersitz einen Fuß auf den gegenüberliegenden Oberschenkel legen","Fußsohle zeigt nach oben, Knie sinkt Richtung Boden","Nie am Fuß ziehen: zwickt das Knie, zurück in den Schneidersitz"],a:"Ruhig und gleichmäßig atmen, Schultern sinken.",
    an:{view:"front",A:{yf:1,hy:13,kR:[33,16],aR:[-22,22],kL:[-39,18],aL:[13,7],hR:[30,96],hL:[-36,98],bR:-1,bL:1},B:{yf:1,hy:13.4,kR:[33,16],aR:[-22,22],kL:[-39,18],aL:[13,7],hR:[30,96],hL:[-36,98],bR:-1,bL:1}}},
  lotus:{n:"Lotus",sa:"Padmasana",lv:3,r:"huefte",z:"Hüfte · Knie · Haltung",sec:40,alt:"halblotus",risk:"knee",
    c:["Aus dem Halben Lotus den zweiten Fuß auf den anderen Oberschenkel legen","Beide Knie sinken Richtung Boden, Rücken aufrecht","Nur mit offenen Hüften: Druck im Knie heißt sofort lösen"],a:"Ruhig und gleichmäßig atmen, nach der Hälfte die Beine andersherum kreuzen.",
    an:{view:"front",A:{yf:1,hy:13,kR:[33,16],aR:[-22,22],aL:[22,23],hR:[30,96],hL:[-30,96],bR:-1,bL:1},B:{yf:1,hy:13.4,kR:[33,16],aR:[-22,22],aL:[22,23],hR:[30,96],hL:[-30,96],bR:-1,bL:1}}},
  kuhgesichtsitz:{n:"Kuhgesicht",sa:"Gomukhasana",lv:2,r:"huefte",z:"Äußere Hüfte · Schultern · Trizeps",sec:30,uni:1,alt:"kuhgesicht",risk:"hip",
    c:["Knie übereinander stapeln, Füße neben die Hüften","Ein Arm von oben, der andere von unten hinter den Rücken, Gurt erlaubt","Beide Sitzknochen am Boden, Kissen darunter wenn nötig"],a:"Ruhig in Hüfte und Brust atmen.",
    an:{view:"front",A:{yf:1,hy:13,kR:[-14,22],aR:[-38,6],kL:[14,14],aL:[38,6],ua:93,fa:-98,uaL:-96,faL:76,fsL:.8},B:{yf:1,hy:13.4,kR:[-14,22],aR:[-38,6],kL:[14,14],aL:[38,6],ua:96,fa:-95,uaL:-98,faL:80,fsL:.8}}},
  feuerholz:{n:"Feuerholz",sa:"Agnistambhasana",lv:2,r:"huefte",z:"Äußere Hüfte · Gesäß",sec:30,uni:1,alt:"figur4",risk:"hip",
    c:["Schienbeine übereinander stapeln, Knöchel auf das andere Knie","Füße gebeugt, Knie sinken lassen, Kissen erlaubt","Rücken lang, wer mag neigt sich leicht nach vorn"],a:"Lang ausatmen, die Hüfte öffnet sich langsam.",
    an:{view:"front",A:{yf:1,hy:13,kR:[30,26],aR:[-25,24],kL:[-32,17],aL:[22,12],hR:[28,104],hL:[-30,100],bR:-1,bL:1},B:{yf:1,hy:13,kR:[30,25],aR:[-25,23.5],kL:[-32,17],aL:[22,12],hR:[28,103],hL:[-30,99],bR:-1,bL:1,br:-3}}},
  drehkopfknie:{n:"Gedrehtes Kopf-zum-Knie",sa:"Parivrtta Janu Sirsasana",lv:2,r:"ruecken",z:"Flanke · Beinrückseite · Rücken",sec:30,uni:1,alt:"sitzseitbeuge",
    c:["Ein Bein zur Seite strecken, andere Fußsohle an den Oberschenkel","Seitlich über das gestreckte Bein neigen, untere Hand innen am Bein","Oberen Arm über den Kopf strecken, Brust öffnet sich nach oben"],a:"Einatmen in die obere Flanke.",
    an:{view:"front",A:{yf:1,hy:13,kR:[48,9],aR:[86,5],kL:[-40,14],aL:[6,7],lean:38,hR:[57,133],bR:-1,uaL:62,faL:50,tilt:8},B:{yf:1,hy:13,kR:[48,9],aR:[86,5],kL:[-40,14],aL:[6,7],lean:42,hR:[58,131],bR:-1,uaL:60,faL:46,tilt:10}}},
  graetschseit:{n:"Seitbeuge im Grätschsitz",sa:"Parsva Upavistha Konasana",lv:2,r:"ruecken",z:"Flanke · Innenseite Oberschenkel",sec:30,uni:1,alt:"sitzseitbeuge",
    c:["Grätsche im Sitzen, Zehen zeigen nach oben","Zur Seite über ein Bein neigen, Unterarm innen ans Bein","Oberen Arm über den Kopf, beide Sitzknochen bleiben am Boden"],a:"In die lange Seite atmen.",
    an:{view:"front",A:{yf:1,hy:13,kR:[46,10],aR:[82,4],lean:34,hR:[50,128],bR:-1,uaL:66,faL:54,tilt:6},B:{yf:1,hy:13,kR:[46,10],aR:[82,4],lean:38,hR:[52,127],bR:-1,uaL:64,faL:50,tilt:8}}},
  seitunterarm:{n:"Seitstütz auf dem Unterarm",sa:"Salamba Vasisthasana",lv:2,r:"ganz",z:"Seitlicher Rumpf · Schultern",sec:20,uni:1,alt:"seitstuetz",risk:"shoulder",
    c:["Seitlich liegen, Ellbogen unter der Schulter, Füße übereinander","Hüfte heben, bis der Körper eine gerade Linie bildet","Obere Hand an die Hüfte oder zur Decke, Kopf in Verlängerung"],a:"Gleichmäßig weiteratmen, nicht pressen.",
    an:{view:"front",A:{yf:1,hx:4,hy:35,lean:75,aR:[-80,2],aL:[-80,10],ua:-15,fa:-15,fs:.3,uaL:165,faL:165},B:{yf:1,hx:4,hy:35.6,lean:74.6,aR:[-80,2],aL:[-80,10],ua:-15.4,fa:-15.4,fs:.3,uaL:162,faL:164}}},
  liegevishnu:{n:"Vishnus Liegehaltung",sa:"Anantasana (Vorstufe)",lv:2,r:"beine",z:"Oberschenkel innen · Hüfte",sec:30,uni:1,alt:"beingurt",
    c:["Seitlich liegen, Kopf ruht in der unteren Hand","Oberes Knie beugen und den großen Zeh oder den Fuß greifen","Bein Richtung Decke strecken, nur so weit wie es geht, Gurt erlaubt"],a:"Ruhig weiteratmen, Becken bleibt senkrecht.",
    an:{view:"front",A:{yf:1,hx:0,hy:22,lean:90,aR:[-88,4],kR:[-44,8],kL:[18,72],aL:[52,84],ua:90,fa:200,hL:[-62,144],bL:1,tilt:-6},B:{yf:1,hx:0,hy:22,lean:90,aR:[-88,4],kR:[-44,8],kL:[20,74],aL:[55,88],ua:90,fa:200,hL:[-65,146],bL:1,tilt:-6}}},
  goettinseit:{n:"Seitbeuge in der Göttin",sa:"Parsva Utkata Konasana",lv:2,r:"huefte",z:"Hüfte · Flanke · Oberschenkel innen",sec:20,uni:1,alt:"goettin",
    c:["Göttin: weiter Stand, Knie über den Zehen gebeugt","Einen Unterarm auf den Oberschenkel legen","Anderen Arm über den Kopf strecken, Brust bleibt offen"],a:"In die obere Flanke einatmen, ausatmen tiefer sinken.",
    an:{view:"front",A:{yf:1,hy:64,kR:[48,50],aR:[52,0],lean:28,hR:[36,104],bR:1,uaL:78,faL:62},B:{yf:1,hy:62,kR:[49,48],aR:[52,0],lean:31,hR:[36,103],bR:1,uaL:76,faL:58}}},
  stehtaube:{n:"Stehende Taube",sa:"Eka Pada Utkatasana",lv:2,r:"huefte",z:"Gesäß · äußere Hüfte · Gleichgewicht",sec:20,uni:1,alt:"figur4",risk:"hip",
    c:["Auf einem Bein stehen, den anderen Knöchel aufs Knie legen","Wie auf einen Stuhl nach hinten-unten setzen","Hände vor der Brust, Fuß gebeugt, Rücken lang"],a:"Ruhig weiteratmen, Blick auf einen festen Punkt.",
    an:{view:"front",A:{yf:1,hx:-4,hy:70,aL:[-15,0],kL:[-18,38],kR:[40,58],aR:[-10,42],hR:[1.5,128],hL:[-1.5,128],bR:1,bL:-1},B:{yf:1,hx:-4,hy:68,aL:[-15,0],kL:[-18,37],kR:[41,56],aR:[-10,40.5],hR:[1.5,128],hL:[-1.5,128],bR:1,bL:-1}}},
  lotusstand:{n:"Halber Lotus im Stand",sa:"Ardha Baddha Padmasana",lv:3,r:"huefte",z:"Gleichgewicht · Hüfte · Knie",sec:20,uni:1,alt:"baum",risk:"knee",
    c:["Auf einem Bein stehen, den anderen Fuß hoch in die Leiste legen","Knie zeigt nach unten-außen, Becken bleibt gerade","Hände vor der Brust, bei Druck im Knie zurück in den Baum"],a:"Langsam und gleichmäßig atmen.",
    an:{view:"front",A:{yf:1,hx:-4,aL:[-13,0],kL:[-14.5,46],kR:[30,58],aR:[-8,80],hR:[1.5,128],hL:[-1.5,128],bR:1,bL:-1},B:{yf:1,hx:-4,aL:[-13,0],kL:[-14.5,46],kR:[31,57],aR:[-8,80],hR:[1.5,129],hL:[-1.5,129],bR:1,bL:-1}}},
  handzeh:{n:"Hand zum großen Zeh",sa:"Utthita Hasta Padangusthasana",lv:3,r:"beine",z:"Gleichgewicht · Beinrückseite · Hüfte",sec:20,uni:1,alt:"baum",risk:"hip",
    c:["Auf einem Bein stehen, Knie heben und den großen Zeh fassen","Bein langsam zur Seite strecken, Standbein fest","Anderen Arm zur Seite, Becken bleibt gerade, Gurt erlaubt"],a:"Ruhig weiteratmen, Blick auf einen festen Punkt.",
    an:{view:"front",A:{yf:1,hx:-6,aL:[-15,0],kL:[-16.5,46],kR:[35,124],aR:[66,152],hR:[72,151],bR:1,uaL:180,faL:180},B:{yf:1,hx:-6,aL:[-15,0],kL:[-16.5,46],kR:[36,125],aR:[67,154],hR:[73,153],bR:1,uaL:178,faL:180}}},
  waage:{n:"Waage",sa:"Tolasana",lv:3,r:"brust",z:"Arme · Handgelenke · Rumpf",sec:10,alt:"halblotus",risk:"arm",
    c:["Im Lotus oder Schneidersitz die Hände neben die Hüften","Arme strecken und das Becken mit den Beinen vom Boden heben","Bauch fest, Schultern weg von den Ohren"],a:"Kurz halten und gleichmäßig weiteratmen.",
    an:{view:"front",A:{yf:1,hy:32,kR:[33,35],aR:[-22,41],aL:[22,42],br:-32,hR:[26,60],hL:[-26,60],bR:-1,bL:1},B:{yf:1,hy:32.8,kR:[33,35.8],aR:[-22,41.8],aL:[22,42.8],br:-32,hR:[26,59.2],hL:[-26,59.2],bR:-1,bL:1}}},
  /* ---- 3.4 · weitere Seitenansicht ---- */
  yogamudra:{n:"Yoga-Mudra",sa:"Yoga Mudrasana",lv:2,r:"schulter",z:"Schultern · Brust · Rücken",sec:30,alt:"kind",risk:"shoulder",
    c:["Im Fersensitz die Hände hinter dem Rücken verschränken","Oberkörper auf die Oberschenkel sinken, Stirn zur Matte","Arme nur so weit nach oben, wie die Schultern es erlauben"],a:"Ausatmen und den Nacken lang loslassen.",
    an:{anchor:"hip",at:[0,20],A:{torso:-4,thigh:-20.5,shin:180,foot:180,upper:110,fore:104,neck:-16,lum:-2,tho:-3},B:{torso:-2,thigh:-20.5,shin:180,foot:180,upper:104,fore:100,neck:-18,lum:-2,tho:-4}}},
  wandl:{n:"L-Handstand an der Wand",sa:"Ardha Adho Mukha Vrksasana",lv:3,r:"schulter",z:"Schultern · Handgelenke · Rumpf",sec:20,alt:"delfin",risk:"inv",
    c:["Mit dem Rücken zur Wand sitzen, Abstand der Hände merken","Hände dort aufsetzen, Füße an der Wand hochlaufen bis auf Hüfthöhe","Hüfte über den Schultern, Körper bildet ein L, langsam zurück"],a:"Gleichmäßig weiteratmen, nicht die Luft anhalten.",
    an:{anchor:"hand",A:{fore:-90,upper:-90,torso:-90,thigh:180,shin:180,foot:90,neck:20},B:{fore:-90.5,upper:-90.5,torso:-91,thigh:180.5,shin:180.5,foot:90.5,neck:21},eq:[{t:"wall",x:-95}]}}
});
const YKEYS=Object.keys(YP).sort((a,b)=>YP[a].lv-YP[b].lv);/* 3.2: library sorted by level (stable) */
/* animation defaults: barefoot, on the mat, breathing tempo */
for(const k of YKEYS){const d=YP[k].an;const def={floor:0,eq:[],tempo:[3.4,.8,4,.8],ph:YBR,mat:1,bare:1,lag:.04,...d};def.A={...d.A};def.B={...d.B};if(d.view==="front"&&def.floor===0)def.floor=0;AN["y_"+k]=def}

/* ================= 2.2 · Yoga "ganzer Weg" (@ Joschy) =================
   Every pose runs as an endless loop, independent of the hold countdown:
   stand (relaxed, breathing) -> into the pose -> hold (the authored A/B breathing animation) -> back -> stand.
   Generic transition system instead of 56 hand animations: intermediate keyframes (half kneel, kneel, heel sit,
   all fours, squat, sit, supine, prone, wide stance, ...) in a canonical joint-angle form, monotone splines through
   them, planted hands/feet (IK, steps with a small arc), knees/hips pinned while they rest on the floor, a floor
   guard that never lets the body sink into the mat. Library minis stay still (end pose). */
const YL={stand:1.6,hold:[4,6]};
/* two-bone IK without the reach clamp of ik2 (a straight leg stays straight); the bend side is either a fixed sign
   (cross product of root->end and root->mid) or the solution nearest to a reference point */
const ylCross=(a,e,m)=>{const d=sub(e,a),w=sub(m,a);return d[0]*w[1]-d[1]*w[0]};
function ylIK(a,t,l1,l2,ref,sg){const d=sub(t,a);let D=Math.hypot(d[0],d[1])||1e-6;const u=[d[0]/D,d[1]/D];D=Math.max(Math.abs(l1-l2)+1e-3,Math.min(l1+l2,D));
  const x=(l1*l1-l2*l2+D*D)/(2*D),h=Math.sqrt(Math.max(0,l1*l1-x*x));const m1=[a[0]+u[0]*x-u[1]*h,a[1]+u[1]*x+u[0]*h],m2=[a[0]+u[0]*x+u[1]*h,a[1]+u[1]*x-u[0]*h];
  let m;if(sg)m=ylCross(a,t,m1)*sg>=0?m1:m2;else m=Math.hypot(m1[0]-ref[0],m1[1]-ref[1])<=Math.hypot(m2[0]-ref[0],m2[1]-ref[1])?m1:m2;
  const e=sub(t,m),l=Math.hypot(e[0],e[1])||1;return[m,add(m,[e[0]/l*l2,e[1]/l*l2])]}
const ylAng=v=>Math.atan2(v[1],v[0])*180/Math.PI;
const ylWrap=(a,lo)=>{a=((a-lo)%360+360)%360;return a+lo};
const ylS=x=>x<=0?0:x>=1?1:x*x*(3-2*x);
function ylPts(o,f){for(const k in o){const v=o[k];if(Array.isArray(v)&&v.length===2&&typeof v[0]==="number")o[k]=f(v,k)}return o}
function ylMove(o,d){return ylPts(o,v=>[v[0]+d[0],v[1]+d[1]])}
function ylMir(o){const q={...o};ylPts(q,v=>[-v[0],v[1]]);if(q._hA!=null)q._hA=180-q._hA;return q}
/* ---------- side view ---------- */
const YL_SEG=[["sh","hip"],["neck","sh"],["head","neck"],["knee","hip"],["ankle","knee"],["toe","ankle"],["knee2","hip"],["ankle2","knee2"],["toe2","ankle2"],["elbow","sh"],["hand","elbow"],["elbow2","sh"],["hand2","elbow2"]];
const YL_PAR=[-1,0,1,0,3,4,0,6,7,0,9,0,11];
/* anatomical windows of the relative joint angles (figure facing +x): interpolation never folds a joint the wrong way */
const YL_WIN=[0,-180,-180,-300,-200,-90,-300,-200,-90,-280,-130,-280,-130];
/* keyframe from world targets: hip, torso, neck; legs via ankle target (IK, knee ref) or angles; arms via hand target or angles */
function ylKF(s){const o={};if(s.foot){const k=sub(s.foot,V(s.sn1,L.sh));s.hip=sub(k,V(s.th1,L.th))}o.hip=s.hip.slice();o.sh=add(o.hip,V(s.torso,L.to));const ha=s.torso+(s.neck||0);o.neck=add(o.sh,V(ha,L.ne));o.head=add(o.sh,V(ha,L.ne+L.hd));o._hA=ha;
  for(const n of[1,2]){const K=n===1?"knee":"knee2",A=n===1?"ankle":"ankle2",T=n===1?"toe":"toe2";
    if(s["a"+n]){[o[K],o[A]]=ylIK(o.hip,s["a"+n],L.th,L.sh,s["k"+n]||add(o.hip,[30,-20]))}else{o[K]=add(o.hip,V(s["th"+n],L.th));o[A]=add(o[K],V(s["sn"+n],L.sh))}
    o[T]=add(o[A],V(s["f"+n]!=null?s["f"+n]:0,11))}
  for(const n of[1,2]){const E=n===1?"elbow":"elbow2",H=n===1?"hand":"hand2";
    if(s["h"+n]){[o[E],o[H]]=ylIK(o.sh,s["h"+n],L.ua,L.fa,s["e"+n]||add(o.sh,V(s.torso-150,20)))}else{o[E]=add(o.sh,V(s["u"+n],L.ua));o[H]=add(o[E],V(s["fo"+n],L.fa))}}
  o._lum=s.lum!=null?s.lum:.6;o._tho=s.tho!=null?s.tho:-1;return o}
/* intermediate keyframes, built facing +x (prone poses are mirrored afterwards) */
const YLK={
  st:()=>ylKF({hip:[0,92],torso:88,neck:0,th1:-90,sn1:-90,f1:0,th2:-91,sn2:-91,f2:0,u1:-91,fo1:-85,u2:-88,fo2:-83,lum:1,tho:-1.1}),
  fold:()=>ylKF({foot:[0,0],sn1:-98,th1:-66,f1:0,th2:-67,sn2:-99,f2:0,torso:8,neck:-10,u1:-96,fo1:-92,u2:-94,fo2:-90,lum:-.5,tho:-2}),
  hkn:()=>ylKF({hip:[0,35],torso:88,neck:0,a1:[46,0],k1:[45,47],f1:0,a2:[-82,6.5],k2:[-36,6],f2:180,h1:[36,50],e1:[30,70],h2:[34,49],e2:[28,70]}),
  kn:()=>ylKF({hip:[0,52],torso:88,neck:0,a1:[-44,4.6],k1:[2,5],f1:180,a2:[-45,4.4],k2:[.5,4.8],f2:180,u1:-92,fo1:-84,u2:-89,fo2:-82,lum:.4}),
  hs:()=>ylKF({hip:[-42,23.5],torso:90,neck:-2,a1:[-46,4.2],k1:[2,4.2],f1:180,a2:[-47,4],k2:[1,4],f2:180,h1:[-16,24],e1:[-34,40],h2:[-17,24],e2:[-35,40],lum:.2}),
  af:()=>ylKF({hip:[0,53],torso:8,neck:-16,a1:[-45,5],k1:[1,5],f1:180,a2:[-46,4.8],k2:[-.5,5],f2:180,u1:-94,fo1:-84,u2:-95,fo2:-85,lum:.2,tho:-.6}),
  prone:()=>ylKF({hip:[0,10],torso:3,neck:-8,th1:181,sn1:180,f1:192,th2:180,sn2:180,f2:190,h1:[50,2.5],e1:[36,30],h2:[49,2.4],e2:[35,30],lum:-.4}),
  proneb:()=>ylKF({hip:[0,10],torso:3,neck:-6,th1:181,sn1:180,f1:192,th2:180,sn2:180,f2:190,h1:[6,3],e1:[34,16],h2:[5,3.2],e2:[33,16],lum:-.4}),
  sq:()=>ylKF({hip:[-14,26],torso:64,neck:-8,a1:[0,0],k1:[28,40],f1:0,a2:[-1,.2],k2:[27,40],f2:0,h1:[26,40],e1:[8,40],h2:[25,39],e2:[7,40],lum:-1}),
  sitk:()=>ylKF({hip:[-46,9],torso:98,neck:-2,a1:[0,0],k1:[-20,46],f1:0,a2:[-1,.2],k2:[-21,46],f2:0,h1:[-16,40],e1:[-44,44],h2:[-17,39],e2:[-45,44],lum:-.4}),
  hook:(P,fd)=>ylKF({hip:[0,9],torso:180,neck:0,a1:[fd||46,0],k1:[(fd||46)/2,46],f1:0,a2:[(fd||46)-1,.2],k2:[(fd||46)/2-1,46],f2:0,u1:-3,fo1:-2,u2:-5,fo2:-3,lum:0,tho:0}),
  lsit:()=>ylKF({hip:[0,9],torso:94,neck:-4,th1:0,sn1:-1,f1:76,th2:1,sn2:-1,f2:74,h1:[30,19],e1:[6,40],h2:[29,18],e2:[5,40],lum:-.3})
};
/* path per pose: [keyframe, contact used to line it up with the next keyframe]; the pose itself comes last */
const YLP_S={stand:[["st","ankle"]],fold:[["st","ankle"],["fold","ankle"]],step:[["st","ankle"]],
  kneel:[["st","ankle"],["hkn","knee2"],["kn","knee"]],four:[["st","ankle"],["hkn","knee2"],["kn","knee"],["af","knee"]],
  dog:[["st","ankle"],["hkn","knee2"],["kn","knee"],["af","hand"]],prone:[["st","ankle"],["hkn","knee2"],["kn","knee"],["af","hand"],["prone","hip"]],proneb:[["st","ankle"],["hkn","knee2"],["kn","knee"],["af","hand"],["prone","hip"],["proneb","hip"]],
  heel:[["st","ankle"],["hkn","knee2"],["kn","knee"],["hs","knee"]],lunge:[["st","ankle"],["lunge","ankle"]],sit:[["st","ankle"],["sq","ankle"],["sitk","hip"]],lsit:[["st","ankle"],["sq","ankle"],["sitk","hip"],["lsit","hip"]],
  sup:[["st","ankle"],["sq","ankle"],["sitk","hip"],["hook","hip"]],tisch:[["st","ankle"],["sq","ankle"],["sitk","ankle"]],
  bridge:[["st","ankle"],["sq","ankle"],["sitk","hip"],["hook","ankle",69]]};
const YL_PATH={kinnbrust:"stand",brustoeffner:"stand",halbevorbeuge:"stand",vorbeuge:"fold",stuhl:"stand",malasana:"stand",krieger1:"step",pyramide:"step",
  tiefausfall:"lunge",halbmond:"lunge",eidechse:"lunge",kamel:"kneel",fersensitz:"kneel",kind:"heel",katzekuh:"four",welpe:"four",faden:"four",
  hund:"dog",hundpedal:"dog",delfin:"dog",taube:"dog",sphinx:"prone",kobra:"prone",heuschrecke:"proneb",bogen:"prone",
  drehsitz:"sit",tisch:"tisch",sitzvorbeuge:"lsit",fisch:"lsit",kniebrust:"sup",figur4:"sup",happybaby:"sup",beingurt:"sup",savasana:"sup",streckung:"sup",bruecke:"bridge"};
/* lunge with the back knee lifted, derived from the half-kneeling pose itself (toes tucked under) */
YLK.lunge=P=>ylKF({hip:add(P.hip,[-6,22]),torso:80,neck:0,a1:P.ankle,k1:add(P.knee,[0,4]),f1:0,a2:[P.ankle2[0]+16,9],k2:[P.knee2[0]+6,34],f2:-38,
  h1:add(lerpP(P.hip,P.knee,.75),[-2,26]),e1:add(P.hip,[20,70]),h2:add(lerpP(P.hip,P.knee,.75),[-3,25]),e2:add(P.hip,[18,70])});
/* ---- 3.2: new keyframes and paths (Profi: crow, headstand, shoulder stand, wheel, half split) ---- */
Object.assign(YLK,{
  /* deep squat, hands planted in front (crow) */
  sqh:()=>ylKF({hip:[-18,30],torso:28,neck:-10,a1:[0,0],k1:[22,42],f1:0,a2:[-1,.2],k2:[21,42],f2:0,h1:[50,1],e1:[44,30],h2:[49,1.2],e2:[43,30],lum:-1}),
  /* kneeling, forearms and crown on the mat (dolphin / headstand set-up) */
  fk:()=>ylKF({hip:[0,52],torso:-24,neck:-64,a1:[-44,4.6],k1:[2,5],f1:180,a2:[-45,4.4],k2:[.5,4.8],f2:180,h1:[64.2,3],e1:[35.2,3],h2:[63.2,3.2],e2:[34.2,3.2],lum:.2,tho:-.6}),
  /* dolphin walk-in: legs straight, hips high (hands at the origin) */
  dk:()=>ylKF({hip:[-40.2,78.6],torso:-60,neck:-28,a1:[-88,.3],k1:[-64,40],f1:0,a2:[-89,.4],k2:[-65,40],f2:0,h1:[0,3],e1:[-29,3],h2:[-1,3.2],e2:[-30,3.2],lum:0,tho:-.4}),
  /* tucked headstand: hips over the shoulders, knees to the chest */
  tk:()=>ylKF({hip:[-11.2,86.4],torso:-90,neck:2,th1:240,sn1:48,f1:68,th2:242,sn2:50,f2:70,h1:[0,3],e1:[-29,3],h2:[-1,3.2],e2:[-30,3.2],lum:0,tho:-.4}),
  /* supine, knees to the chest, arms long on the mat */
  kc:()=>ylKF({hip:[0,9],torso:180,neck:0,th1:118,sn1:-12,f1:20,th2:120,sn2:-10,f2:22,u1:-4,fo1:-2,u2:-5,fo2:-3,lum:0,tho:0}),
  /* hips lifted over the shoulders, hands support the back, knees bent over the face */
  lift:()=>ylKF({hip:[19.8,63.5],torso:250,neck:-70,th1:135,sn1:95,f1:120,th2:137,sn2:97,f2:122,h1:[22,30],e1:[31,4],h2:[21,31],e2:[30,4.2],lum:0,tho:0}),
  /* supine, feet close to the seat, hands planted beside the ears (wheel set-up) */
  hookh:()=>ylKF({hip:[0,9],torso:180,neck:0,a1:[46,0],k1:[23,46],f1:0,a2:[45,.2],k2:[22,46],f2:0,h1:[-65,1],e1:[-50,40],h2:[-64,1.2],e2:[-49,40],lum:0,tho:0})});
Object.assign(YLP_S,{
  crow:[["st","ankle"],["sq","ankle"],["sqh","hand"]],
  dk:[["st","ankle"],["hkn","knee2"],["kn","knee"],["fk","hand"]],
  hs:[["st","ankle"],["hkn","knee2"],["fk","hand"],["dk","hand"],["tk","hand"]],
  ss:[["st","ankle"],["sq","ankle"],["sitk","hip"],["kc","sh"],["lift","sh"]],
  wheel:[["st","ankle"],["sq","ankle"],["sitk","hip"],["hook","hip"],["hookh","ankle"]],
  hsp:[["st","ankle"],["hkn","knee2"]]});
/* extra contact points that may pin the body (shoulders stay on the mat while the hips go up) */
const YLP_PIN={ss:[["sh",12]],wheel:[["sh",12]]};
Object.assign(YL_PATH,{krokodil:"prone",liegschmetterling:"sup",armeheben:"stand",ragdoll:"fold",zehensitz:"heel",vierfuessler:"four",windloeser:"sup",beinewand:"sup",oberschenkel:"stand",
  robbe:"prone",stuhldreh:"stand",brett:"dog",kopfknie:"lsit",bootkn:"sit",hund3:"dog",heldensitz:"heel",
  kraehe:"crow",umgbrett:"tisch",delfinkopf:"dk",kopfstand:"hs",unterarmvor:"dog",schulterstand:"ss",pflug:"ss",rad:"wheel",kameltief:"kneel",taenzer:"stand",krieger3:"stand",
  drehhalbmond:"stand",drehdreieck:"step",koenigstaube:"dog",halbspagat:"hsp",echseunter:"lunge",bootvoll:"sit",chaturanga:"dog",hochhund:"prone"});
let ylPinX=null;
function ylCanS(o){const a=[],l=[];for(const[c,p]of YL_SEG){const d=sub(o[c],o[p]);a.push(ylAng(d));l.push(Math.hypot(d[0],d[1]))}return{hip:o.hip.slice(),a,l,lum:o._lum||0,tho:o._tho||0}}
function ylVecS(c,mir,prev){const v=[c.hip[0],c.hip[1]];const rel=[];for(let i=0;i<13;i++){if(i===0){let t=c.a[0];if(prev!=null){while(t-prev>180)t-=360;while(t-prev<-180)t+=360}rel.push(t)}
    else{const lo=mir?-YL_WIN[i]-360:YL_WIN[i];rel.push(rel[YL_PAR[i]]+ylWrap(c.a[i]-c.a[YL_PAR[i]],lo))}}return v.concat(rel,c.l,[c.lum,c.tho])}
/* channels hold absolute angles, unwrapped so that every joint angle stays inside its anatomical window:
   a limb that keeps its world direction while the body turns stays still in between, too */
function ylFKS(v){const a=[];for(let i=0;i<13;i++)a.push(v[2+i]);const o={hip:[v[0],v[1]]};
  YL_SEG.forEach(([c,p],i)=>{o[c]=add(o[p],V(a[i],v[15+i]))});o._hA=a[2];o._torso=a[0];o._lum=v[28];o._tho=v[29];return o}
/* contact analysis of one segment between two keyframes */
const YL_PIN=[["hip",12],["knee",9],["knee2",9],["ankle",9],["ankle2",9],["hand",7],["hand2",7]];
const YL_EFF=[["ankle","knee","hip","toe",9],["ankle2","knee2","hip","toe2",9],["hand","elbow","sh",null,10],["hand2","elbow2","sh",null,10]];
const YL_CLR=[["hip",7],["sh",6],["head",8.5],["neck",3],["knee",4],["knee2",4],["elbow",3],["elbow2",3],["toe",.3],["toe2",.3]];
function ylSegInfo(A,B,mir,slide){const pin=(ylPinX?YL_PIN.concat(ylPinX):YL_PIN).find(([k,t])=>A[k][1]<t&&B[k][1]<t&&Math.hypot(A[k][0]-B[k][0],A[k][1]-B[k][1])<3);
  const eff=YL_EFF.map(([e,m,r,toe,t])=>{const on=A[e][1]<t&&B[e][1]<t;const d=Math.hypot(A[e][0]-B[e][0],A[e][1]-B[e][1]);
    const ca=ylCross(A[r],A[e],A[m]),cb=ylCross(B[r],B[e],B[m]);const dflt=(e.startsWith('ankle')?1:-1)*(mir?-1:1);const sa=Math.abs(ca)>25?Math.sign(ca):0,sb=Math.abs(cb)>25?Math.sign(cb):0;
    /* bend side per keyframe (a nearly straight limb takes the side of the other keyframe); if the sides differ the elbow/knee swings over (2D projection of a rotation) */
    const sg=sa||sb||dflt,sg2=sb||sa||dflt;
    /* knee (or elbow) resting on the floor in both keyframes: the shin lies on the mat, plain FK + pin keeps it there */
    const midOn=e.startsWith("ankle")&&A[m][1]<9&&B[m][1]<9&&Math.hypot(A[m][0]-B[m][0],A[m][1]-B[m][1])<3;
    return{e,m,r,toe,sg,sg2,d,a:A[e],b:B[e],mode:midOn?"free":on?(d<3?"fix":((slide&&slide.includes(e))||d<10)?"slide":"step"):"free",lift:Math.min(e.startsWith("hand")?70:12,3+d*.1+(e.startsWith("hand")?Math.max(0,d-50)*.6:0)),fa:A[e][1],fb:B[e][1]}});
  const clr=YL_CLR.map(([k,r])=>[k,r,Math.min(0,A[k][1]-r),Math.min(0,B[k][1]-r)]);return{pin:pin&&pin[0],pa:pin&&A[pin[0]],pb:pin&&B[pin[0]],eff,clr}}
function ylApplyS(o,I,t){if(I.pin){const tg=lerpP(I.pa,I.pb,t);ylMove(o,sub(tg,o[I.pin]))}
  const ik=new Set();for(const E of I.eff)if(E.mode!=="free")ik.add(E.m),ik.add(E.toe);
  const liftBy=all=>{let lift=0;for(const[k,r,ca,cb]of I.clr){if(all?(k==='toe'||k==='toe2'||k.startsWith('elbow')):ik.has(k))continue;const alw=lerp(ca,cb,t)-.2;const c=o[k][1]-r;if(c<alw)lift=Math.max(lift,alw-c)}return lift};
  const LN=I.eff.map(E=>[Math.hypot(...sub(o[E.m],o[E.r])),Math.hypot(...sub(o[E.e],o[E.m])),E.toe?sub(o[E.toe],o[E.e]):null]);
  const solve=()=>{I.eff.forEach((E,j)=>{const[ln1,ln2,ft]=LN[j];let tg=null;
    if(E.mode==="fix")tg=lerpP(E.a,E.b,t);
    else if(E.mode==="step"){const w=ylS((t-.06)/.88);tg=add(lerpP(E.a,E.b,w),[0,E.lift*Math.sin(Math.PI*w)])}
    else if(E.mode==="slide")tg=lerpP(E.a,E.b,ylS(t));
    else{const fl=Math.min(lerp(E.fa,E.fb,t),E.toe?3.5:1.5);if(o[E.e][1]<fl)tg=[o[E.e][0],fl]}
    /* the foot rolls over the ball: if the toes would go into the floor, the ankle rises instead */
    if(ft){const base=tg||o[E.e];const ty=base[1]+ft[1];if(ty<0)tg=[base[0],base[1]-ty]}
    if(tg&&E.mode==="free"){/* free hand/foot below the floor: pushed up onto the floor (continuous, reads as foreshortening) */
      o[E.e]=[o[E.e][0],tg[1]];if(o[E.m][1]<tg[1])o[E.m]=[o[E.m][0],tg[1]];if(ft)o[E.toe]=add(o[E.e],ft);tg=null}
    const fm=o[E.m].slice(),fe=o[E.e].slice();
    if(tg){
      if(E.sg===E.sg2)[o[E.m],o[E.e]]=ylIK(o[E.r],tg,ln1,ln2,o[E.m],E.sg);
      else{const p1=ylIK(o[E.r],tg,ln1,ln2,o[E.m],E.sg),p2=ylIK(o[E.r],tg,ln1,ln2,o[E.m],E.sg2);o[E.m]=lerpP(p1[0],p2[0],ylS(t));o[E.e]=tg.slice()}
      /* a hand moving to a new spot follows an arc (IK); close to the shoulder it swings by joint angles instead */
      if(E.mode==="step"&&!E.toe&&E.d>40){const w=ylS((t-.06)/.88),D=Math.hypot(...sub(tg,o[E.r]));const bl=1-ylS((D-10)/16);/* only where the target passes the shoulder (IK would flip) */o[E.m]=lerpP(o[E.m],fm,bl);o[E.e]=lerpP(o[E.e],fe,bl);
        if(o[E.e][1]<1.5)o[E.e]=[o[E.e][0],1.5];if(o[E.m][1]<3)o[E.m]=[o[E.m][0],3]}if(ft)o[E.toe]=add(o[E.e],ft)}})};
  let l=liftBy(false);if(l)ylMove(o,[0,l]);const keep={};for(const E of I.eff)keep[E.e]=o[E.e].slice();solve();
  l=liftBy(true);if(l>.05){ylMove(o,[0,l]);for(const E of I.eff){o[E.e]=keep[E.e].slice()}solve()}
  for(const[k,r,ca,cb]of I.clr)if(k.startsWith('elbow')){const fl=r+lerp(ca,cb,t);if(o[k][1]<fl)o[k]=[o[k][0],fl]}/* an elbow never digs into the mat */
  return o}
/* ---------- front view ---------- */
function ylCanF(o,g){const T=o._T||{hx:0,hy:92,lean:0,tilt:0,rfirst:0};const Q=o.L;
  const arm=(s,e,h)=>{const u=sub(Q[e],Q[s]),f=sub(Q[h],Q[e]);return[ylAng(u),Math.hypot(u[0],u[1]),ylAng(f)-ylAng(u),Math.hypot(f[0],f[1])]};
  const kn=(h,k,a)=>{const d=sub(o[a],o[h]),w=sub(o[k],o[h]);const l2=d[0]*d[0]+d[1]*d[1]||1,l=Math.sqrt(l2);return[(w[0]*d[0]+w[1]*d[1])/l2,(d[0]*w[1]-d[1]*w[0])/l]};
  return{g,T:{...T},shY:o.shY,us:o._us==null?1:o._us,L:{shL:Q.shL,shR:Q.shR,neck:Q.neck,head:Q.head},aR:arm("shR","elbR","handR"),aL:arm("shL","elbL","handL"),
    ankR:o.ankR.slice(),ankL:o.ankL.slice(),kR:kn("hipR","kneeR","ankR"),kL:kn("hipL","kneeL","ankL")}}
function ylVecF(c,w){w=w||[-120,-240];const T=c.T;const v=[T.hx,T.hy,T.lean||0,T.tilt||0,c.shY,c.us];for(const k of["shL","shR","neck","head"])v.push(c.L[k][0],c.L[k][1]);
  v.push(ylWrap(c.aR[0],-200),c.aR[1],ylWrap(c.aR[2],w[0]),c.aR[3],ylWrap(c.aL[0],20),c.aL[1],ylWrap(c.aL[2],w[1]),c.aL[3]);
  v.push(...c.ankR,...c.ankL,...c.kR,...c.kL);return v}
function ylFKF(v,g,rf){const G=BODY[g].fr;const o={front:1,_T:{hx:v[0],hy:v[1],lean:v[2],tilt:v[3],rfirst:rf},shY:v[4],_us:v[5]};const L_={shL:[v[6],v[7]],shR:[v[8],v[9]],neck:[v[10],v[11]],head:[v[12],v[13]]};
  L_.elbR=add(L_.shR,V(v[14],v[15]));L_.handR=add(L_.elbR,V(v[14]+v[16],v[17]));L_.elbL=add(L_.shL,V(v[18],v[19]));L_.handL=add(L_.elbL,V(v[18]+v[20],v[21]));o.L=L_;
  const c=Math.cos(rad(-v[2])),sn=Math.sin(rad(-v[2]));const T=q=>{const d=[q[0],q[1]-92];return[v[0]+d[0]*c-d[1]*sn,v[1]+d[0]*sn+d[1]*c]};
  for(const k in L_)o[k]=T(L_[k]);o.hipL=T([-G.hipJ,92]);o.hipR=T([G.hipJ,92]);o.ankR=[v[22],v[23]];o.ankL=[v[24],v[25]];
  const kn=(h,a,p)=>{const d=sub(a,h);const l=Math.hypot(d[0],d[1])||1;return add(h,[d[0]*p[0]-d[1]/l*p[1],d[1]*p[0]+d[0]/l*p[1]])};
  o.kneeR=kn(o.hipR,o.ankR,[v[26],v[27]]);o.kneeL=kn(o.hipL,o.ankL,[v[28],v[29]]);return o}
const YLFR={st:{yf:1,ua:-85,fa:-87,s:5}};
/* 3.2: front-view entries for side plank and half moon (stand -> squat -> sit -> side sit / stand -> wide -> triangle) */
const YLFP_SIDE=()=>[{yf:1,hy:38,kR:[27,47],aR:[13,0],ua:-62,fa:-74},{yf:1,hy:13,kR:[23,44],aR:[14,1],hR:[25,108],hL:[-25,108],bR:1,bL:-1},
  {yf:1,hx:6,hy:15,lean:42,aR:[-66,2],aL:[-68,9],ua:-48,fa:-48,uaL:120,faL:110}];
const YLFP={seitstuetz:YLFP_SIDE,seitstuetzbein:YLFP_SIDE,
  halbmondbal:(P,g,legH,st)=>{const aR=P.ankR.slice(),aL=[-50,0];let hx=(aR[0]+st.ankL[0])/2*.7;const a={...YLFR.st,hx,hy:legH(hx,aR,st.ankL),aR,aL:st.ankL.slice()};
    hx=(aR[0]+aL[0])/2;const b={...YLFR.st,hx,hy:legH(hx,aR,aL),aR,aL};return[a,b,{yf:1,hx:4,hy:74,lean:58,aR,aL,ua:-32,fa:-32,uaL:148,faL:148}]}};
function ylFrontPath(k,P,g){const st=solveFrontY(YLFR.st,g);const out=[st];const G=BODY[g].fr;
  const legH=(hx,aR,aL)=>{const dx=Math.max(Math.abs(aR[0]-(hx+G.hipJ)),Math.abs(aL[0]-(hx-G.hipJ)));return Math.min(92,Math.sqrt(Math.max(0,92*92-dx*dx)))-.4};
  const wide=Math.abs(P.ankR[0]-st.ankR[0])>6&&P.ankR[1]<1&&P.ankL[1]<1;
  if(YLFP[k]){for(const q of YLFP[k](P,g,legH,st))out.push(solveFrontY(q,g));return out}
  if(k==="baum")out.push(solveFrontY({...YLFR.st,hx:-6,lean:-2,ua:-82,fa:-80},g));
  else if(P._T&&P._T.hy<40){/* sitting on the floor: squat down, sit, then fold the legs */
    out.push(solveFrontY({yf:1,hy:38,kR:[27,47],aR:[13,0],ua:-62,fa:-74},g));
    out.push(solveFrontY({yf:1,hy:13,kR:[23,44],aR:[14,1],hR:[25,108],hL:[-25,108],bR:1,bL:-1},g))}
  else if(wide){const aR=P.ankR,aL0=st.ankL;let hx=(aR[0]+aL0[0])/2*.7;out.push(solveFrontY({...YLFR.st,hx,hy:legH(hx,aR,aL0),aR:aR.slice(),aL:aL0.slice()},g));
    hx=(aR[0]+P.ankL[0])/2;out.push(solveFrontY({...YLFR.st,hx,hy:legH(hx,aR,P.ankL),aR:aR.slice(),aL:P.ankL.slice()},g))}
  return out}
function ylFrontSeg(A,B){const st=[];for(const s of["ankR","ankL"]){const on=A[s][1]<3&&B[s][1]<3;const d=Math.hypot(A[s][0]-B[s][0],A[s][1]-B[s][1]);st.push({s,mode:on?(d<2?"fix":d<12?"slide":"step"):"free",a:A[s],b:B[s],lift:Math.min(12,4+d*.08)})}return st}
function ylApplyF(v,I,t){const ix={ankR:22,ankL:24};let moved=null,fixed=null;
  for(const E of I){const j=ix[E.s];if(E.mode==="fix"){const p=lerpP(E.a,E.b,t);v[j]=p[0];v[j+1]=p[1];fixed=p}
    else if(E.mode==="step"){const w=ylS((t-.15)/.7);const p=add(lerpP(E.a,E.b,w),[0,E.lift*Math.sin(Math.PI*w)]);v[j]=p[0];v[j+1]=p[1];moved=E}
    else if(E.mode==="slide"){const p=lerpP(E.a,E.b,ylS(t));v[j]=p[0];v[j+1]=p[1]}
    else if(v[j+1]<0)v[j+1]=0}
  if(moved&&fixed){const w=Math.sin(Math.PI*ylS(t));v[0]+=w*.45*(fixed[0]-v[0])}/* weight over the standing foot while the other one steps */
  return v}
/* ---------- the loop ---------- */
function ylHoldInfo(def){const T=cycT(def);const n=Math.max(1,Math.round(5/T));const dur=Math.max(YL.hold[0],Math.min(YL.hold[1],n*T));return{n,T,dur,f:n*T/dur}}
function ylBuild(def,g){const key=Object.keys(AN).find(k=>AN[k]===def)||"";const k=key.slice(2);const H=ylHoldInfo(def);
  const P0=animPose(def,0,g).o,P1=animPose(def,H.dur*H.f,g).o;const front=def.view==="front";let keys,keysX,segE,segX;
  if(front){const mids=ylFrontPath(k,P0,g);keys=[...mids,P0];keysX=[P1,...mids.slice().reverse()]}
  else{const mir=!!def.flip;const typ=YL_PATH[k]||"stand";const spec=YLP_S[typ];const Pm=mir?ylMir(P0):P0;
    const ks=spec.map(([n,,arg])=>YLK[n](Pm,arg));ks.push(Pm);
    for(let i=ks.length-2;i>=0;i--){const c=spec[i][1];ks[i]=ylMove({...ks[i]},[ks[i+1][c][0]-ks[i][c][0],0])}
    const mids=ks.slice(0,-1).map(o=>mir?ylMir(o):o);keys=[...mids,P0];keysX=[P1,...mids.slice().reverse()]}
  const mk=(K,pi)=>{const n=K.length;const vec=[];let prev=null;const C=front?K.map(o=>ylCanF(o,g)):K.map(ylCanS);
    /* front elbows fold towards the body: a lowered arm folds behind the back, a raised arm behind the head */
    const W=front?[Math.sin(rad(C[pi].aR[0]))<-.2?-240:-120,Math.sin(rad(C[pi].aL[0]))<-.2?-120:-240]:null;
    for(const c of C){const v=front?ylVecF(c,W):ylVecS(c,!!def.flip,prev);if(!front)prev=v[2];vec.push(v)}
    const xs=[0];for(let i=1;i<n;i++){let d=0;for(const p of front?["hipR","shR","head","ankR","ankL","handR","handL"]:["hip","sh","head","knee","ankle","ankle2","hand","hand2"]){const a=K[i-1][p],b=K[i][p];if(a&&b)d=Math.max(d,Math.hypot(a[0]-b[0],a[1]-b[1]))}xs.push(xs[i-1]+Math.pow(Math.max(12,d),.8)+6)}
    const tot=xs[n-1]||1;const xn=xs.map(x=>x/tot);const seg=[];for(let i=0;i<n-1;i++)seg.push(front?ylFrontSeg(K[i],K[i+1]):ylSegInfo(K[i],K[i+1],!!def.flip));
    return{K,vec,xn,seg,rf:C.map(c=>front?(c.T.rfirst||0):0),n}};
  ylPinX=front?null:(YLP_PIN[YL_PATH[k]]||null);const E=mk(keys,keys.length-1),X=mk(keysX,0);ylPinX=null;const ns=keys.length-1;const L0={front,g};ylWarp(L0,E,YL_SLOW[k],1);ylWarp(L0,X,YL_SLOW[k],0);
  const entry=Math.max(3,Math.min(4.5,2.2+.8*ns)),exit=Math.max(3,Math.min(4,entry-.4));/* the way back is at most ~12 % quicker than the way in */const T=YL.stand+entry+H.dur+exit;
  const L_={def,g,front,E,X,H,entry,exit,T,k};L_.b=ylBounds(L_);return L_}
function ylPath(P,s){const n=P.n;let i=0;while(i<n-2&&s>P.xn[i+1])i++;const t=Math.max(0,Math.min(1,(s-P.xn[i])/((P.xn[i+1]-P.xn[i])||1)));
  const v=P.vec[0].map((_,j)=>n===2?lerp(P.vec[0][j],P.vec[1][j],s):hermite(P.xn,P.vec.map(x=>x[j]),s));return{v,i,t}}
/* time warp: the path is re-timed by how far the fastest joint travels (sampled), with a soft trapezoid velocity profile,
   so no single stretch (a foot step when standing up, a leg unfolding) runs much faster than the rest */
function ylTransRaw(L_,P,s){const{v,i,t}=ylPath(P,s);if(L_.front){ylApplyF(v,P.seg[i],t);return ylFKF(v,L_.g,t<.5?P.rf[i]:P.rf[i+1])}return ylApplyS(ylFKS(v),P.seg[i],t)}
/* a few poses get extra time for one stretch of the way (half bow: the knee bends, the heel comes over to the buttock and the
   hand reaches back calmly instead of the shin flicking up) */
const YL_SLOW={bogen:{w:2.2,wx:1.4}};
function ylWarp(L_,P,slow,isEntry){const N=360,pts=o=>{const m=[];for(const q in o){const v=o[q];if(Array.isArray(v)&&v.length===2&&typeof v[0]==="number")m.push(v)}return m};
  let prev=pts(ylTransRaw(L_,P,0));const d=[0];for(let i=1;i<=N;i++){const m=pts(ylTransRaw(L_,P,i/N));let mx=0;for(let j=0;j<m.length;j++)mx=Math.max(mx,Math.hypot(m[j][0]-prev[j][0],m[j][1]-prev[j][1]));d.push(mx);prev=m}
  if(slow){const b=isEntry?P.xn[P.n-2]:P.xn[1];for(let i=1;i<=N;i++){const x=i/N,r=ylS(((isEntry?x-b:b-x)+.04)/.08);d[i]*=1+((isEntry?slow.w:slow.wx)-1)*r}}
  const sm=d.map((_,i)=>{if(!i)return 0;let a=0,n=0;for(let j=Math.max(1,i-4);j<=Math.min(N,i+4);j++){a+=d[j];n++}return a/n});
  const tot=sm.reduce((a,b)=>a+b,0)||1;const c=[0];for(let i=1;i<=N;i++)c.push(c[i-1]+sm[i]+tot*.15/N);
  const C=c[N];P.wc=c.map(x=>x/C)}
const ylEase=u=>{const a=.3;/* smooth velocity ramps over the first and last 30 %, constant in between (peak 1.4x the mean) */
  const r=x=>x<=0?0:x>=a?x-a/2:(x*x*x/(a*a)-x*x*x*x/(2*a*a*a));return r(u)/(1-a)-(u>1-a?r(u-(1-a))/(1-a):0)};
/* a short time filter (about +-0.03 s, shrinking to zero at both ends) rounds off the kinks where one keyframe segment
   hands over to the next; convex weights, so nothing that stays above the mat can dip into it */
function ylTrans(L_,P,u){const D=Math.min(.007,u,1-u);if(D<1e-4)return ylTrans1(L_,P,u);const o=ylTrans1(L_,P,u),W=[.1,.2,.4,.2,.1];
  const ss=[-2,-1,1,2].map(j=>ylTrans1(L_,P,u+j*D/2));ylPts(o,(v,k)=>{let x=v[0]*.4,y=v[1]*.4;for(let j=0;j<4;j++){const q=ss[j][k];const w=W[j<2?j:j+1];x+=q[0]*w;y+=q[1]*w}return[x,y]});return o}
function ylTrans1(L_,P,u){let s;if(P.wc){const e=Math.max(0,Math.min(1,ylEase(u)));const c=P.wc,N=c.length-1;let lo=0,hi=N;while(hi-lo>1){const m=(lo+hi)>>1;if(c[m]<=e)lo=m;else hi=m}
    s=(lo+(e-c[lo])/((c[hi]-c[lo])||1))/N}else s=ylS(u);const{v,i,t}=ylPath(P,s);
  if(L_.front){ylApplyF(v,P.seg[i],t);return ylFKF(v,L_.g,t<.5?P.rf[i]:P.rf[i+1])}
  return ylApplyS(ylFKS(v),P.seg[i],t)}
function ylStandO(L_,p){const br=Math.sin(Math.PI*p);/* one calm breath while standing, zero at both ends (no jump into the transition) */if(L_.front){const o=solveFrontY({...YLFR.st,br:br*.6},L_.g);o._br=br;return o}
  const o=ylFKS(L_.E.vec[0]);o._br=br;return o}
function yLoopPose(L_,time){const def=L_.def;const T=L_.T;let t=((time%T)+T)%T;const noEq={...def,eq:def.eq.filter(e=>e.t!=="ystrap")};
  if(reduce){const r=animPose(def,0,L_.g);return{o:r.o,ph:r.ph,dd:def}}
  const s0=YL.stand/2;/* the relaxed stand is split: first and last frame of every loop are the stand */
  if(t<s0||t>=T-s0)return{o:ylStandO(L_,t<s0?(t+s0)/(2*s0):(t-T+s0)/(2*s0)),lbl:"Ankommen · atmen",dd:noEq,ph:0,stage:"stand"};t-=s0;
  if(t<L_.entry){const o=ylTrans(L_,L_.E,t/L_.entry);o._br=0;return{o,lbl:"Hineingehen",dd:noEq,ph:0,stage:"in"}}t-=L_.entry;
  if(t<L_.H.dur){const r=animPose(def,t*L_.H.f,L_.g);return{o:r.o,ph:r.ph,dd:def,stage:"hold"}}t-=L_.H.dur;
  const o=ylTrans(L_,L_.X,Math.min(1,t/L_.exit));o._br=0;return{o,lbl:"Lösen · zurück",dd:noEq,ph:1,stage:"out"}}
function ylBounds(L_){let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const inc=(p,r)=>{x0=Math.min(x0,p[0]-r);x1=Math.max(x1,p[0]+r);y0=Math.min(y0,p[1]-r);y1=Math.max(y1,p[1]+r)};
  const was=reduce;for(let i=0;i<=144;i++){const{o}=yLoopPose(L_,i/144*L_.T+.001);for(const k in o){const v=o[k];if(Array.isArray(v)&&v.length===2&&typeof v[0]==="number")inc(v,bndR(k))}}
  const b0=boundsOf(L_.def,L_.g);/* 3.3: same margins as boundsOf (hand/foot outline, hair) */x0=Math.min(x0,b0.x0);x1=Math.max(x1,b0.x1);y1=Math.max(y1,b0.y1);y0=Math.min(y0,0);return{x0,y0,x1,y1}}
function yLoopOf(def,g){def._yl=def._yl||{};return def._yl[g]||(def._yl[g]=ylBuild(def,g))}
{const _att=attachAnim;attachAnim=function(canvas,key,opts={}){_att(canvas,key,opts);const def=AN[key];
  if(def&&def.mat&&!opts.still&&!opts.noLoop){canvas._loop=yLoopOf(def,canvas._g);canvas._b=canvas._loop.b}else canvas._loop=null}}

/* ---- 3.4 (@ Joschy): Wege für die neuen Haltungen ---- */
Object.assign(YL_PATH,{palme:"stand",rueckbeuge:"stand",kniestand:"stand",wandhund:"stand",reiter:"lunge",loewe:"heel",tiger:"four",kniebrett:"four",
  hoherausfall:"step",demkrieger:"step",drehausfall:"lunge",achtpunkt:"four",unterarmstuetz:"dog",stehspagat:"fold"});
Object.assign(YL_PATH,{stab:"lsit",schneidervor:"sit",marichi1:"lsit",marichi3:"sit",bharadvaja:"sit",liegheld:"heel",bruecke1:"bridge",superman:"prone",halbheuschrecke:"proneb",
  bogenvoll:"prone",frosch:"prone",spagat:"split",ohrendruck:"ss",halbschulter:"ss",schildkroete:"lsit",reiher:"sit",zehenboot:"sit",pfau:"crow",handstand:"hand",unterarmstand:"pin",
  kopfkniestand:"stand",drehvorbeuge:"fold"});
YL_SLOW.bogenvoll=YL_SLOW.bogen;YL_SLOW.frosch=YL_SLOW.bogen;
/* handstand: fold -> walk the feet in (hands planted) -> tuck over the hands; forearm stand: kneel -> all fours -> dolphin -> tuck */
Object.assign(YLK,{
  hdog:()=>ylKF({hip:[-60,90],torso:-50,neck:-20,a1:[-70,0],k1:[-50,45],f1:0,a2:[-71,.2],k2:[-51,45],f2:0,h1:[0,0],e1:[-20,30],h2:[-1,.2],e2:[-21,30],lum:0,tho:-.4}),
  htk:()=>ylKF({hip:[0,116],torso:-90,neck:20,th1:240,sn1:50,f1:70,th2:242,sn2:52,f2:72,h1:[0,0],e1:[1,30],h2:[-1,.2],e2:[0,30],lum:0,tho:-.4}),
  fk2:()=>ylKF({hip:[0,52],torso:-24,neck:-26,a1:[-44,4.6],k1:[2,5],f1:180,a2:[-45,4.4],k2:[.5,4.8],f2:180,h1:[64.2,3],e1:[35.2,3],h2:[63.2,3.2],e2:[34.2,3.2],lum:.2,tho:-.6}),
  ptk:()=>ylKF({hip:[-29,92],torso:-90,neck:40,th1:240,sn1:48,f1:68,th2:242,sn2:50,f2:70,h1:[0,3],e1:[-29,3],h2:[-1,3.2],e2:[-30,3.2],lum:0,tho:-.4})});
Object.assign(YLP_S,{hand:[["st","ankle"],["fold","ankle"],["hdog","hand"],["htk","hand"]],
  pin:[["st","ankle"],["hkn","knee2"],["fk2","hand"],["dk","hand"],["ptk","hand"]]});
YLP_PIN.hand=null;
YL_SLOW.handstand={w:1.5,wx:1.8};
/* full split: half kneel -> half split with the hands on the mat -> slide into the split */
YLK.hspk=()=>ylKF({hip:[0,50],torso:32,neck:-8,th1:-30.7,sn1:-30.7,f1:58,th2:-90,sn2:180,f2:180,h1:[42,3],e1:[46,30],h2:[41,3.2],e2:[45,30],lum:-.4,tho:-1});
YLP_S.split=[["st","ankle"],["hkn","knee2"],["hspk","knee2"]];
Object.assign(YL_PATH,{yogamudra:"heel",wandl:"wall"});
/* L at the wall: fold -> hands planted, feet walk back to the wall -> feet climb to hip height */
YLK.wl1=()=>ylKF({hip:[-48,72],torso:-35,neck:-20,a1:[-95,24],k1:[-70,40],f1:90,a2:[-95,23],k2:[-71,40],f2:90,h1:[0,0],e1:[-14,30],h2:[-1,.2],e2:[-15,30],lum:0,tho:-.4});
YLP_S.wall=[["st","ankle"],["fold","ankle"],["hdog","hand"],["wl1","hand"]];
Object.assign(YLFP,{seitunterarm:YLFP_SIDE,liegevishnu:YLFP_SIDE,
  stehtaube:()=>[{...YLFR.st,hx:-5,lean:-2,ua:-82,fa:-80}],lotusstand:()=>[{...YLFR.st,hx:-5,lean:-2,ua:-82,fa:-80}],
  handzeh:()=>[{...YLFR.st,hx:-6,lean:-1,ua:-82,fa:-80},{yf:1,hx:-6,aL:[-15,0],kL:[-16.5,46],kR:[12,124],aR:[14,82],hR:[20,100],bR:1,uaL:-100,faL:-95}]});


/* ---------- 3.2 · 24-Wochen-Plan: 3 Stufen à 8 Wochen (Anfänger, Fortgeschritten, Profi), 1 Einheit pro Woche, ca. 15 -> 30 Min.
   Die Wochen 1–12 behalten ihre Nummer (bis 3.1: 12 Wochen in Stufen à 4): alte Stufen 1+2 = Anfänger Woche 1–8, alte Stufe 3 = Fortgeschritten Woche 9–12. ---------- */
const YN=24,YPW=8;
const YSTAGE=[null,{n:"Anfänger",cool:120,t:"Sanft ankommen: Schultern, Nacken und Hüfte mobilisieren, Hund und Krieger kennenlernen."},{n:"Fortgeschritten",cool:150,t:"Stehende Haltungen, Hüft- und Schulteröffner, längere Haltezeiten. Weiterhin ohne Umkehrhaltungen."},{n:"Profi",cool:180,t:"Balancen, Armbalancen und Umkehrhaltungen mit Vorbereitung. Jede Profi-Haltung hat eine leichtere Variante."}];
const YW=[null,
  {w:["sukhasana","schulterkreisen","nacken","katzekuh"],m:["kind","armquer","adlerarm","wandengel","tiefausfall","figur4","schmetterling","kniebrust"]},
  {w:["sukhasana","schulterkreisen","kinnbrust","katzekuh"],m:["kind","trizeps","brustoeffner","seitbeuge","tiefausfall","figur4","schmetterling","bruecke","kniebrust"]},
  {w:["berg","schulterkreisen","nacken","hueftkreisen","katzekuh"],m:["halbevorbeuge","wandengel","adlerarm","tiefausfall","sphinx","kind","figur4","beingurt","schmetterling"]},
  {w:["sukhasana","sitzseitbeuge","schulterkreisen","katzekuh"],m:["vorbeuge","armquer","trizeps","fersensitz","tiefausfall","sphinx","bruecke","figur4","schmetterling","streckung"]},
  {w:["sukhasana","schulterkreisen","nacken","katzekuh"],m:["hund","tiefausfall","krieger1","krieger2","adlerarm","welpe","kobra","figur4","schmetterling","happybaby","beinewand"]},
  {w:["berg","armeheben","hueftkreisen","katzekuh"],m:["vierfuessler","hund","krieger2","goettin","faden","sphinx","windloeser","figur4","liegschmetterling","kniebrust"]},
  {w:["sukhasana","sitzseitbeuge","schulterkreisen","katzekuh"],m:["stuhl","krieger1","oberschenkel","ragdoll","welpe","krokodil","kobra","zehensitz","happybaby","schmetterling","beinewand"]},
  {w:["sukhasana","schulterkreisen","nacken","katzekuh","hund"],m:["armeheben","krieger2","goettin","tiefausfall","faden","vierfuessler","sphinx","bruecke","figur4","liegschmetterling","beingurt"]},
  {w:["sukhasana","schulterkreisen","katzekuh","hund"],m:["tiefausfall","halbmond","krieger2","seitwinkel","pyramide","kuhgesicht","delfin","taube","sitzvorbeuge","bruecke","brett"]},
  {w:["berg","schulterkreisen","hueftkreisen","katzekuh","hundpedal"],m:["krieger1","dreieck","seitwinkel","eidechse","welpe","kuhgesicht","bogen","kamel","taube","drehsitz","happybaby","adler"]},
  {w:["sukhasana","sitzseitbeuge","katzekuh","hund"],m:["halbmond","pyramide","goettin","malasana","delfin","faden","fisch","heuschrecke","taube","sitzvorbeuge","schmetterling","hund3"]},
  {w:["sukhasana","schulterkreisen","nacken","katzekuh","hund"],m:["krieger2","umkrieger","seitwinkel","eidechse","kuhgesicht","adlerarm","kamel","fisch","taube","drehsitz","sitzvorbeuge","happybaby","heldensitz"]},
  {w:["sukhasana","schulterkreisen","katzekuh","hund"],m:["stuhldreh","dreieck","umkrieger","seitausfall","robbe","heuschrecke","bootkn","delfin","taube","kopfknie","drehsitz","liegschmetterling"]},
  {w:["berg","armeheben","hueftkreisen","katzekuh","hundpedal"],m:["baum","adler","krieger2","seitwinkel","brett","seitstuetz","kobra","bogen","kamel","tisch","eidechse","windloeser"]},
  {w:["heldensitz","sitzseitbeuge","katzekuh","hund"],m:["hund3","halbmond","pyramide","malasana","kuhgesicht","delfin","fisch","robbe","taube","sitzvorbeuge","kopfknie","happybaby"]},
  {w:["sukhasana","schulterkreisen","nacken","katzekuh","hund"],m:["stuhldreh","dreieck","seitwinkel","adler","brett","seitstuetz","bootkn","heuschrecke","kamel","taube","drehsitz","sitzvorbeuge","schmetterling"]},
  {w:["sukhasana","schulterkreisen","katzekuh","hund","armeheben"],m:["krieger2","dreieck","halbmondbal","krieger1","krieger3","brett","chaturanga","kobra","bootkn","bootvoll","adlerarm","taube","drehsitz","sitzvorbeuge","happybaby"]},
  {w:["berg","armeheben","hueftkreisen","katzekuh","hundpedal"],m:["oberschenkel","taenzer","pyramide","drehdreieck","brett","hochhund","delfin","malasana","kraehe","eidechse","echseunter","fisch","kuhgesicht","liegschmetterling"]},
  {w:["sukhasana","schulterkreisen","nacken","katzekuh","hund"],m:["krieger3","drehhalbmond","halbmondbal","seitstuetz","seitstuetzbein","delfin","delfinkopf","tiefausfall","halbspagat","taube","koenigstaube","bruecke","beinewand","windloeser"]},
  {w:["heldensitz","sitzseitbeuge","katzekuh","hund","armeheben"],m:["brett","chaturanga","hochhund","malasana","kraehe","umgbrett","kamel","kameltief","delfinkopf","adlerarm","bruecke","schulterstand","kniebrust","sitzvorbeuge","happybaby"]},
  {w:["berg","armeheben","hueftkreisen","katzekuh","hund3"],m:["krieger2","halbmondbal","drehdreieck","taenzer","unterarmvor","delfinkopf","eidechse","echseunter","halbspagat","bootvoll","schulterstand","pflug","fisch","liegschmetterling"]},
  {w:["sukhasana","schulterkreisen","nacken","katzekuh","hund"],m:["stuhldreh","krieger3","drehhalbmond","seitstuetzbein","kraehe","delfinkopf","kopfstand","kind","koenigstaube","bogen","bruecke","rad","kopfknie","happybaby"]},
  {w:["feueratem","schulterkreisen","katzekuh","hund","armeheben"],m:["brett","chaturanga","hochhund","hund3","taenzer","halbmondbal","unterarmvor","kopfstand","kind","kuhgesicht","kameltief","schulterstand","pflug","sitzvorbeuge","liegschmetterling"]},
  {w:["feueratem","sitzseitbeuge","katzekuh","hund","armeheben"],m:["krieger3","drehdreieck","drehhalbmond","seitstuetzbein","kraehe","echseunter","halbspagat","koenigstaube","kopfstand","kind","welpe","rad","schulterstand","pflug","beinewand"]}];
const YQUICK=["schulterkreisen","armquer","adlerarm","katzekuh","tiefausfall","figur4","kind"];
const YPOST={A:["brustoeffner","armquer","trizeps","kind","sphinx"],B:["adlerarm","trizeps","seitbeuge","katzekuh","kind"],C:["tiefausfall","figur4","halbevorbeuge","schmetterling","kniebrust"]};
const YPREP=6,YSW=5,YPART={warm:"Aufwärmen",main:"Hauptteil",cool:"Endentspannung"};
function yStageOf(w){return Math.min(3,Math.max(1,Math.ceil(w/YPW)))}
function yTarget(w){return Math.round((15+(w-1)*15/(YN-1))*60)}
function ySecs(items){let s=0;for(const it of items){const sd=it.uni?2:1;s+=YPREP+sd*it.sec+(sd-1)*YSW}return s}
function yItem(k,part,fix,sec){const p=YP[k];return{k,part,uni:!!p.uni,sec:sec!=null?sec:part==="warm"?Math.round(p.sec*.8/5)*5:p.sec,fix:!!fix}}
/* scale the hold times so the whole session meets the target duration (overhead and the final relaxation stay fixed) */
function yScale(items,target){const over=items.reduce((a,x)=>a+YPREP+(x.uni?YSW:0),0);const F=items.filter(x=>x.fix).reduce((a,x)=>a+x.sec*(x.uni?2:1),0);
  const H=items.filter(x=>!x.fix).reduce((a,x)=>a+x.sec*(x.uni?2:1),0);const f=Math.max(.5,Math.min(2.4,(target-over-F)/(H||1)));
  return items.map(x=>x.fix?x:{...x,sec:Math.max(15,Math.min(90,Math.round(x.sec*f/5)*5))})}
function yPlan(w){w=Math.min(YN,Math.max(1,w|0));const st=yStageOf(w);const d=YW[w];
  let items=[...d.w.map(k=>yItem(k,"warm")),...d.m.map(k=>yItem(k,"main")),yItem("savasana","cool",1,YSTAGE[st].cool)];items=yScale(items,yTarget(w));
  const secs=ySecs(items);return{week:w,stage:st,items,secs,min:Math.round(secs/60)}}
function yQuick(){const items=yScale(YQUICK.map(k=>yItem(k,"main")),300);return{items,secs:ySecs(items),min:Math.round(ySecs(items)/60)}}
function yPost(day){const items=yScale((YPOST[day]||YQUICK).map(k=>yItem(k,"main")),300);return{items,secs:ySecs(items),min:Math.round(ySecs(items)/60)}}
function ySteps(items){const out=[];for(const it of items){if(it.uni){out.push({k:it.k,sec:it.sec,side:1,part:it.part},{k:it.k,sec:it.sec,side:2,part:it.part})}else out.push({k:it.k,sec:it.sec,side:0,part:it.part})}return out}

/* ---------- state (S.yoga: start, done[week], log) ---------- */
function yS(){if(!S.yoga||typeof S.yoga!=="object"||Array.isArray(S.yoga))S.yoga={start:null,done:{},log:[]};const y=S.yoga;
  if(!y.done||typeof y.done!=="object"||Array.isArray(y.done))y.done={};if(!Array.isArray(y.log))y.log=[];else if(y.log.some(l=>!l||typeof l!=="object"))y.log=y.log.filter(l=>l&&typeof l==="object");if(typeof y.start!=="number")y.start=null;
  yMigrate(y);return y}
/* 3.2 migration (idempotent): the 12 weeks up to 3.1 keep their numbers in the 24-week plan (old stages 1+2 = Anfänger weeks 1–8, old stage 3 =
   Fortgeschritten weeks 9–12), so every finished unit stays finished and unlocks the same; only invalid week keys are dropped. */
function yMigrate(y){if(y.v!==2){for(const k of Object.keys(y.done)){const w=+k;if(!(Number.isInteger(w)&&w>=1&&w<=YN)||!y.done[k])delete y.done[k]}y.v=2}
  if(![1,2,3].includes(y.startLv))y.startLv=1}
function yBase(){return(yS().startLv-1)*YPW+1}
function yCalWeek(){const y=yS();if(!y.start)return 1;return Math.max(1,Math.round((weekStart(new Date()).getTime()-y.start)/WEEKMS)+1)}
function yFirstOpen(){const y=yS();for(let w=yBase();w<=YN;w++)if(!y.done[w])return w;return YN+1}
function yStageDone(st){const y=yS();for(let w=(st-1)*YPW+1;w<=st*YPW;w++)if(!y.done[w])return false;return true}
function yStageCount(st){const y=yS();let n=0;for(let w=(st-1)*YPW+1;w<=st*YPW;w++)if(y.done[w])n++;return n}
function yUnlocked(st){const sl=yS().startLv;for(let s=1;s<st;s++)if(s>=sl&&!yStageDone(s))return false;return true}/* stages below the chosen start stage count as skipped */
function yDoneThisWeek(){const ws=weekStart(new Date()).getTime();return yS().log.some(l=>l.kind==="plan"&&new Date(l.date).getTime()>=ws)}
/* current plan week: advances with the calendar, never skips an open week, one unit per calendar week */
function yCur(){const fo=yFirstOpen();if(fo>YN)return{week:YN,complete:true,wait:false,next:null};const y=yS();let skip=0;for(let w=1;w<fo;w++)if(!y.done[w])skip++;/* weeks skipped by the start stage */const w=Math.min(fo,yCalWeek()+skip);const wait=!!yS().done[w]||yDoneThisWeek();return{week:wait?fo:w,complete:false,wait,next:fo}}
function yValidRun(r){return r&&typeof r==="object"&&Array.isArray(r.steps)&&r.steps.length&&r.steps.every(s=>s&&YP[s.k]&&s.sec>0)&&typeof r.i==="number"}
(function yInit(){yS();if(S.yrun&&!yValidRun(S.yrun))S.yrun=null;if(S.yrun&&S.yrun.ph!=="done"&&!S.yrun.paused){/* app was closed: continue paused at the current pose */const r=S.yrun;const st=r.steps[Math.min(r.i,r.steps.length-1)];r.paused=true;r.left=r.ph==="hold"?st.sec:yPrepOf(r);r.end=null}})();
function yPrepOf(r){const st=r.steps[r.i];return st&&st.side===2?YSW:YPREP}
function trainedToday(){const t=todayKey();return S.history.filter(h=>{const d=new Date(h.date);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")===t})}

/* ---------- start / run ---------- */
let yT=null;
function yStart(kind,opt={}){let items,title,week=null,day=null;
  if(kind==="plan"||kind==="repeat"){week=opt.week||yCur().week;const st=yStageOf(week);
    if(!yUnlocked(st)){toast(`Stufe ${st} ist noch gesperrt`);return false}
    const c=yCur();if(kind==="plan"&&(c.complete||c.wait||week!==c.week)){toast(c.wait?"Diese Woche ist Yoga schon erledigt":"Diese Woche ist noch nicht dran");return false}
    if(kind==="repeat"&&!yS().done[week]){toast("Erst die aktuelle Woche machen");return false}
    items=yPlan(week).items;title=`Yoga · Woche ${week}`}
  else if(kind==="post"){day=opt.day||null;items=yPost(day).items;title="Dehnen nach dem Training"}
  else{kind="quick";items=yQuick().items;title="Schnell-Dehnen"}
  const now=Date.now();S.yrun={kind,week,day,title,steps:ySteps(items),i:0,ph:"prep",end:now+8000,paused:false,left:0,start:now,ann:-1,half:0};save();
  if(jaiOn())jaiPreload(["hold","u_sekunden_halten","u_je_seite","cd_1","cd_2","cd_3","done_hold","good","paused","resume","halfway",...new Set(S.yrun.steps.flatMap(s=>jaiNum(s.sec)))]);
  yOpen();return true}
function yOpen(){if(!S.yrun)return;closeSheet();$("#yoga").hidden=false;yRender();clearInterval(yT);yT=setInterval(yTick,250);nativeState(true)}
function yClose(){clearInterval(yT);yT=null;$("#yoga").hidden=true;nativeState(true);if(TAB==="home")renderHome()}
function yCurStep(){const r=S.yrun;return r&&r.steps[Math.min(r.i,r.steps.length-1)]}
function yHoldEnd(){const r=S.yrun;const st=yCurStep();if(!r||!st||r.end==null)return null;return r.ph==="prep"?r.end+st.sec*1000:r.end}
/* advance the state machine (timestamp based: catches up after the app was in the background) */
function yAdvance(quiet){const r=S.yrun;if(!r||r.ph==="done")return;
  if(r.ph==="prep"){r.ph="hold";r.end=r.end+yCurStep().sec*1000}
  else{r.i++;if(r.i>=r.steps.length){yFinish();return}r.ph="prep";r.end=r.end+yPrepOf(r)*1000}
  if(!quiet)yAnnounce()}
function yAnnounce(){const r=S.yrun;if(!r||r.ph==="done"||nativeBg())return;const st=yCurStep();const p=YP[st.k];const key=r.i+":"+r.ph;if(r.ann===key)return;r.ann=key;
  if(r.ph==="hold"){beep(880,.12);vib(80);announce(`${p.n}. ${st.sec} Sekunden halten${st.side===1?", je Seite":""}`,[...jaiNum(st.sec),"u_sekunden_halten",...(st.side===1?["u_je_seite"]:[])])}
  else if(st.side===2){vib(60);announce("Seite wechseln",[])}/* no JAI clip for this: stays silent */
  else{announce(`Gleich: ${p.n}`,[])}
  if(!r.half&&r.i>=r.steps.length/2&&r.steps.length>5){r.half=1;setTimeout(()=>announce("Halbzeit",["halfway"],{interrupt:false}),1600)}}
function yTick(){const r=S.yrun;if(!r||$("#yoga").hidden)return;if(r.ph==="done"){return}
  const now=Date.now();let changed=false;
  if(!r.paused&&r.end!=null){let n=0;const bg=nativeBg();while(r.ph!=="done"&&now>=r.end&&n<400){const last=now<r.end+1500;yAdvance(bg||!last);n++;changed=true}}
  if(changed){save();yRender();nativeState();return}
  const left=r.paused?r.left:(r.end-now)/1000;const st=yCurStep();const tot=r.ph==="prep"?yPrepOf(r):st.sec;
  const t=$("#yTm");if(t)t.textContent=r.ph==="prep"?Math.max(0,Math.ceil(left)):mmss(left);const rc=$("#yRc");if(rc)rc.style.strokeDashoffset=String(Y_C*(1-Math.max(0,Math.min(1,left/tot))));
  const ck=$("#yClock");if(ck)ck.textContent=mmss((now-r.start)/1000);
  if(!r.paused&&r.ph==="hold"){const s=Math.ceil(left);if(s!==yTick._s){yTick._s=s;if(s<=3&&s>0&&!nativeBg()){if(jaiOn())jaiPlay(["cd_"+s]);else beep(660,.08)}}}}
function yFinish(){const r=S.yrun;const y=yS();const now=Date.now();r.ph="done";r.end=null;
  const rec={date:new Date().toISOString(),kind:r.kind,week:r.week,dur:Math.round((now-r.start)/1000),n:new Set(r.steps.map(s=>s.k)).size};
  y.log.push(rec);if(y.log.length>300)y.log.splice(0,y.log.length-300);
  if(r.kind==="plan"&&r.week){y.done[r.week]=rec.date;if(!y.start)y.start=weekStart(new Date()).getTime()}
  r.rec=rec;save();if(!nativeBg()){beep(990,.3);vib(300);setTimeout(()=>announce("Einheit geschafft. Sehr gut!",["done_hold","good"],{pling:true}),250)}}
function yPauseToggle(){const r=S.yrun;if(!r||r.ph==="done")return;const now=Date.now();
  if(r.paused){r.end=now+r.left*1000;r.paused=false;announce("Weiter",["resume"])}else{r.left=Math.max(0,(r.end-now)/1000);r.end=null;r.paused=true;announce("Pausiert",["paused"])}
  save();yRender();nativeState()}
function yJump(i){const r=S.yrun;if(!r)return;r.i=i;if(r.i>=r.steps.length){yFinish();save();yRender();nativeState();return}r.ph="prep";const d=yPrepOf(r);if(r.paused)r.left=d;else r.end=Date.now()+d*1000;r.ann=-1;save();yRender();nativeState();yAnnounce()}
function ySkip(){const r=S.yrun;if(!r||r.ph==="done")return;const st=yCurStep();let j=r.i+1;if(st.side===1&&r.steps[j]&&r.steps[j].k===st.k&&r.steps[j].side===2)j++;yJump(j)}
/* 3.2: swap the current Profi pose for its easier variant, only for this run (both sides, hold time kept) */
function yUseAlt(){const r=S.yrun;if(!r||r.ph==="done")return;const st=yCurStep();const p=YP[st.k];const alt=p&&p.alt;if(!alt||!YP[alt])return;
  let i0=r.i;if(st.side===2&&r.steps[i0-1]&&r.steps[i0-1].k===st.k)i0--;let i1=i0+1;if(r.steps[i0].side===1&&r.steps[i1]&&r.steps[i1].k===st.k&&r.steps[i1].side===2)i1++;
  const rep=ySteps([{k:alt,sec:st.sec,uni:!!YP[alt].uni,part:st.part}]);r.steps.splice(i0,i1-i0,...rep);r.alts=(r.alts||0)+1;yJump(i0);toast("Leichtere Variante: "+YP[alt].n)}
function ySideSwitch(){const r=S.yrun;if(!r)return;const st=yCurStep();if(st.side!==1)return;yJump(r.i+1)}
function yAskClose(){const r=S.yrun;if(!r)return;if(r.ph==="done"){S.yrun=null;save();yClose();return}
  confirmSheet("Einheit beenden?",r.kind==="plan"?"Die Woche zählt erst, wenn die Einheit bis zum Ende gelaufen ist. Bei Schmerzen ist Aufhören immer richtig.":"Du kannst jederzeit neu starten.","Beenden",()=>{S.yrun=null;save();yClose()},`<button class="btn block" id="yLater">Pausieren & später weiter</button>`,()=>{$("#yLater").onclick=()=>{closeSheet();if(!S.yrun.paused)yPauseToggle();yClose()}})}

/* ---------- views ---------- */
const Y_C=2*Math.PI*44;
function yRegName(r){const x=YREG.find(a=>a[0]===r);return x?x[1]:r}
function yRender(){const r=S.yrun;const el=$("#yogaInner");if(!r||!el)return;
  if(r.ph==="done"){const rec=r.rec||{dur:0,n:0};
    el.innerHTML=`<div style="text-align:center;padding:18px 0 6px"><div class="donecheck">✓</div><h1 style="font-size:34px;margin-top:10px">Einheit geschafft</h1><p class="muted" style="margin:6px 0 0">${esc(r.title)}${r.kind==="plan"?` · Stufe ${YSTAGE[yStageOf(r.week)].n}`:""}</p></div>
     <div class="stats">${statTile(mmss(rec.dur),"Dauer")}${statTile(rec.n,"Haltungen")}${statTile(r.kind==="plan"?r.week+"/"+YN:"–","Plan-Woche")}</div>
     ${r.kind==="plan"?`<div class="hint">${r.week%YPW===0?`<b>Stufe ${YSTAGE[yStageOf(r.week)].n} abgeschlossen.</b> ${r.week<YN?`Stufe ${YSTAGE[yStageOf(r.week)+1].n} ist jetzt freigeschaltet.`:"Der ganze Plan ist geschafft."}`:"Nächste Yoga-Einheit ab nächster Woche, am besten an einem Tag ohne Krafttraining."}</div>`:`<div class="hint">Zählt nicht zum Krafttraining und nicht zur Erholung zwischen Drücken, Ziehen und Beinen.</div>`}
     <button class="btn primary block" id="yDone" style="margin-top:auto">Fertig</button>`;
    $("#yDone").onclick=()=>{S.yrun=null;save();yClose();toast("Yoga gespeichert")};return}
  const st=yCurStep();const p=YP[st.k];const n=r.steps.length;const prep=r.ph==="prep";
  const nxt=r.steps[r.i+1];const nxtTxt=nxt?(nxt.k===st.k&&nxt.side===2?"Seite wechseln":YP[nxt.k].n):"Ende der Einheit";
  const pct=Math.round(100*(r.i+(prep?0:.5))/n);
  el.innerHTML=`<div class="tbar"><button class="iconbtn" id="yX" aria-label="Yoga beenden"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <div style="text-align:center;min-width:0"><div class="label">${esc(r.title)} · ${YPART[st.part]||""}</div><div class="num" id="yClock" style="font-size:18px">${mmss((Date.now()-r.start)/1000)}</div></div>
    <button class="iconbtn" id="yInfo" aria-label="Haltung erklären"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg></button></div>
   <div class="progress" aria-label="Fortschritt der Einheit"><span style="width:${pct}%"></span></div>
   <div class="row between" style="font-size:12.5px"><span class="muted" id="yPos">Haltung ${r.i+1} von ${n}</span><span class="muted">Danach: ${esc(nxtTxt)}</span></div>
   <div class="ysafe" role="note">Bei Schmerz sofort abbrechen – nur sanft dehnen.</div>${p.risk?`<div class="ywarn" role="alert" id="yRisk"><b>Achtung:</b> ${esc(YRISK[p.risk])}</div>`:""}
   <div class="stage ystage"><canvas id="ycv" ${st.side===2?'style="transform:scaleX(-1)"':""}></canvas><span class="phase" id="yph"></span><span class="tempo">${esc(YLV[p.lv])}</span><span class="readout">${esc(yRegName(p.r).toUpperCase())}${st.side?` · SEITE ${st.side}`:""}</span></div>
   <div class="row between" style="align-items:center;gap:12px">
     <div style="min-width:0"><div class="label" id="yLbl">${prep?(st.side===2?"Seite wechseln":"Gleich geht's los"):r.paused?"Pausiert":"Halten"}</div><h1 class="exname" style="font-size:30px">${esc(p.n)}</h1>
       <div class="muted" style="font-size:13px">${p.sa?esc(p.sa)+" · ":""}${esc(p.z)}${st.side?` · Seite ${st.side} von 2`:""}</div></div>
     <div class="yring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="yb"/><circle cx="50" cy="50" r="44" class="yf${prep?" yp":""}" id="yRc" stroke-dasharray="${Y_C}" stroke-dashoffset="0"/></svg><div class="t num" id="yTm"></div></div></div>
   <div class="hint"><b>Atem:</b> ${esc(p.a)}</div>
   <ol class="cues">${p.c.map(c=>`<li>${esc(c)}</li>`).join("")}</ol>
   <div class="ybtns"><button class="btn ${r.paused?"primary":""}" id="yP">${r.paused?"Weiter":"Pause"}</button>${st.side===1?`<button class="btn" id="yS">Seite wechseln</button>`:""}<button class="btn ghost" id="yN">Überspringen</button></div>${p.alt&&YP[p.alt]?`<button class="btn block" id="yAlt">Leichtere Variante: ${esc(YP[p.alt].n)}</button>`:""}`;
  /* 2.2: the stand -> pose -> stand loop runs independently of the countdown; a re-render of the same step keeps its loop time */
  const now_=performance.now();if(!yRender._a||yRender._a.i!==r.i||yRender._a.k!==st.k)yRender._a={i:r.i,k:st.k,t0:now_};
  attachAnim($("#ycv"),"y_"+st.k,{phaseEl:$("#yph"),offset:now_-yRender._a.t0});
  $("#yX").onclick=yAskClose;$("#yInfo").onclick=()=>yPoseSheet(st.k);$("#yP").onclick=()=>{audio();yPauseToggle()};$("#yN").onclick=ySkip;const sb=$("#yS");if(sb)sb.onclick=ySideSwitch;const ab=$("#yAlt");if(ab)ab.onclick=yUseAlt;
  yTick._s=null;yTick()}
function yPoseSheet(k){const p=YP[k];const inW=[];for(let w=1;w<=YN;w++)if(YW[w].w.includes(k)||YW[w].m.includes(k))inW.push(w);
  openSheet(`<div class="row between"><div><div class="label">${esc(YLV[p.lv])} · ${esc(yRegName(p.r))}</div><h2 style="font-size:28px;margin-top:4px">${esc(p.n)}</h2>${p.sa?`<div class="muted" style="font-size:13px">${esc(p.sa)}</div>`:""}</div><button class="iconbtn" data-close aria-label="Schließen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
   <div class="stage"><canvas id="ysc"></canvas><span class="phase" id="ysp"></span><span class="readout">${esc(p.z.toUpperCase())}</span></div>
   <div class="tagline"><span class="tag">${p.sec} s halten</span>${p.uni?`<span class="tag">einseitig · Seite wechseln</span>`:`<span class="tag">beidseitig</span>`}${inW.length?`<span class="tag">Plan: Woche ${inW.join(", ")}</span>`:""}</div>
   <div><div class="label" style="margin-bottom:8px">So geht's</div><ol class="cues">${p.c.map(c=>`<li>${esc(c)}</li>`).join("")}</ol></div>
   <div class="hint"><b>Atem:</b> ${esc(p.a)}</div>${p.risk?`<div class="ywarn"><b>Achtung:</b> ${esc(YRISK[p.risk])}</div>`:""}${p.alt&&YP[p.alt]?`<div class="hint"><b>Leichtere Variante:</b> ${esc(YP[p.alt].n)} – im Ablauf mit „Leichtere Variante“ tauschen.</div>`:""}<div class="ysafe">Bei Schmerz sofort abbrechen – nur sanft dehnen.</div>`);
  attachAnim($("#ysc"),"y_"+k,{phaseEl:$("#ysp")})}
function yPlanSheet(){const c=yCur();const y=yS();
  openSheet(`<div class="row between"><h2 style="font-size:24px">Yoga · 24-Wochen-Plan</h2><button class="iconbtn" data-close aria-label="Schließen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
   <p class="muted" style="margin:0;font-size:13.5px">Eine Einheit pro Woche, am besten an einem Tag ohne Krafttraining. Aufwärmen, Hauptteil für Schultern und Hüfte, dann Endentspannung. Die nächste Stufe wird frei, wenn alle 8 Wochen der vorherigen geschafft sind.</p>
   ${yStartPick()}
   ${[1,2,3].map(st=>{const un=yUnlocked(st);const skip=st<y.startLv;return`<div class="card${un?"":" ylock"}" data-stage="${st}"><div class="row between"><div class="label">Stufe ${st} · ${YSTAGE[st].n}</div><span class="tag">${skip?"übersprungen · "+yStageCount(st)+" / "+YPW:un?yStageCount(st)+" / "+YPW:"gesperrt"}</span></div>
     <div class="muted" style="font-size:12.5px">${un?esc(YSTAGE[st].t):`Wird freigeschaltet, wenn Stufe ${st-1} abgeschlossen ist (${yStageCount(st-1)} von ${YPW} Einheiten).`}</div>
     ${Array.from({length:YPW},(_,i)=>{const w=(st-1)*YPW+1+i;const P=yPlan(w);const done=!!y.done[w];const cur=!c.complete&&w===c.week;
       const act=!un?"":cur&&!c.wait?`<button class="btn small" data-yweek="${w}">Starten</button>`:done?`<button class="btn small ghost" data-yrep="${w}">Wiederholen</button>`:cur&&c.wait?`<span class="tag">ab nächster Woche</span>`:"";
       return`<div class="ywk" data-w="${w}"><div style="min-width:0"><b>Woche ${w}${done?" ✓":""}</b> <span class="muted" style="font-size:12.5px">· ca. ${P.min} Min.</span><div class="muted" style="font-size:12px">${P.items.filter(x=>x.part==="main").map(x=>esc(YP[x.k].n)).join(" · ")}</div></div>${act}</div>`}).join("")}</div>`}).join("")}
   <button class="btn block" data-close>Schließen</button>`);
  for(const b of document.querySelectorAll("[data-yweek]"))b.onclick=()=>yStart("plan",{week:+b.dataset.yweek});
  for(const b of document.querySelectorAll("[data-yrep]"))b.onclick=()=>yStart("repeat",{week:+b.dataset.yrep});
  yBindStartPick(yPlanSheet)}
/* 3.2 · Startstufe (Yoga-Einstellungen): Standard Anfänger, Profi nur nach Sicherheitsabfrage; erledigte Einheiten bleiben immer erhalten */
function yStartPick(){const sl=yS().startLv;return`<div class="ystartpick"><div class="label">Startstufe</div><div class="seg" id="yLvSeg">${[1,2,3].map(l=>`<button type="button" data-ystart="${l}" aria-pressed="${sl===l}">${YLV[l]}</button>`).join("")}</div>
  <div class="muted" style="font-size:12px">Ab welcher Stufe dein Plan beginnt. Niedrigere Stufen gelten dann als übersprungen, erledigte Wochen bleiben erhalten.</div></div>`}
function yBindStartPick(rerender){for(const b of document.querySelectorAll("[data-ystart]"))b.onclick=()=>{const l=+b.dataset.ystart;const y=yS();if(l===y.startLv)return;
  const apply=()=>{y.startLv=l;save();toast("Startstufe: "+YLV[l]);if(rerender)rerender()};
  if(l===3)confirmSheet("Mit Profi starten?","Profi enthält Armbalancen und Umkehrhaltungen (Krähe, Kopfstand, Schulterstand, Pflug, Rad). Nur wählen, wenn du die Fortgeschritten-Haltungen sicher beherrschst und keine Schulter-, Nacken- oder Rückenbeschwerden hast. Jede Profi-Haltung lässt sich im Ablauf durch eine leichtere Variante ersetzen.","Ja, mit Profi starten",apply);
  else apply()}}
function yHomeCard(){const c=yCur();const r=S.yrun;const tt=trainedToday();const P=yPlan(c.week);const st=yStageOf(c.week);
  let main;
  if(r&&r.ph!=="done")main=`<div class="row between"><div><b class="ytitle">${esc(r.title)}</b><div class="muted" style="font-size:13px">läuft · Haltung ${Math.min(r.i+1,r.steps.length)} von ${r.steps.length}</div></div><button class="btn small" id="yResume">Fortsetzen</button></div>`;
  else if(c.complete)main=`<div><b class="ytitle">Plan geschafft ✓</b><div class="muted" style="font-size:13px">Alle 24 Wochen erledigt. Einheiten lassen sich im Plan wiederholen.</div></div>`;
  else if(c.wait)main=`<div><b class="ytitle">Yoga diese Woche erledigt ✓</b><div class="muted" style="font-size:13px">Woche ${c.next} von ${YN} ab Montag · ca. ${yPlan(c.next).min} Min.</div></div>`;
  else main=`<div class="row between"><div style="min-width:0"><b class="ytitle">Woche ${c.week} von ${YN} · ${YSTAGE[st].n}</b><div class="muted" style="font-size:13px">ca. ${P.min} Min. · ${tt.length?"heute lieber nur dehnen":"am besten an einem Tag ohne Krafttraining"}</div></div><button class="btn small" id="yStartBtn">Starten</button></div>`;
  return`<div class="card ycard" id="yCard"><div class="row between"><div class="label">Zusatz · Yoga & Dehnen</div><button class="chip" id="yPlanBtn">Plan</button></div>${main}
   <div class="row" style="gap:6px;flex-wrap:wrap">${tt.length?`<button class="chip" id="yPostBtn">Dehnen nach dem Training · 5 Min.</button>`:""}<button class="chip" id="yQuickBtn">Schnell-Dehnen · 5 Min.</button></div></div>`}
function yBindHome(){const b=(id,fn)=>{const e=$(id);if(e)e.onclick=fn};
  b("#yStartBtn",()=>{audio();yStart("plan")});b("#yResume",()=>{audio();yOpen()});b("#yPlanBtn",yPlanSheet);b("#yQuickBtn",()=>{audio();yStart("quick")});
  b("#yPostBtn",()=>{audio();const t=trainedToday();yStart("post",{day:t.length?t[t.length-1].plan:null})})}

/* ---------- yoga library (inside "Übungen", as a toggle next to strength) ---------- */
let LIBMODE="kraft",YLF={lv:0,r:""};
function libSeg(){return`<div class="seg" id="libSeg"><button data-lm="kraft" aria-pressed="${LIBMODE==="kraft"}">Kraft</button><button data-lm="yoga" aria-pressed="${LIBMODE==="yoga"}">Yoga & Dehnen</button></div>`}
function bindLibSeg(){for(const b of document.querySelectorAll("[data-lm]"))b.onclick=()=>{LIBMODE=b.dataset.lm;RENDER.lib();window.scrollTo(0,0)}}
function renderYogaLib(){const ks=YKEYS.filter(k=>(!YLF.lv||YP[k].lv===YLF.lv)&&(!YLF.r||YP[k].r===YLF.r));
  $("#v-lib").innerHTML=`${libSeg()}<h1 style="font-size:34px">Yoga & Dehnen</h1><p class="muted" style="margin:-8px 0 0">${YKEYS.length} Haltungen in drei Stufen (Anfänger, Fortgeschritten, Profi), Schwerpunkt Schultern und Hüfte. Zusatz zum Krafttraining.</p>
   <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn small" id="yLibPlan">24-Wochen-Plan</button><button class="btn small ghost" id="yLibQuick">Schnell-Dehnen · 5 Min.</button></div>
   <div class="label">Stufe</div><div class="row" style="flex-wrap:wrap;gap:6px">${[0,1,2,3].map(l=>`<button class="chip" data-ylv="${l}" aria-pressed="${YLF.lv===l}">${l?YLV[l]:"Alle"}</button>`).join("")}</div>
   <div class="label">Region</div><div class="row" style="flex-wrap:wrap;gap:6px"><button class="chip" data-yr="" aria-pressed="${!YLF.r}">Alle</button>${YREG.map(([k,l])=>`<button class="chip" data-yr="${k}" aria-pressed="${YLF.r===k}">${esc(l)}</button>`).join("")}</div>
   <div class="label" id="yCount">${ks.length} Haltungen</div>
   ${ks.map(k=>{const p=YP[k];return`<button class="libitem" data-ypose="${k}"><canvas data-ymini="${k}"></canvas><span><b>${esc(p.n)}</b><small>${esc(YLV[p.lv])} · ${esc(yRegName(p.r))}${p.sa?" · "+esc(p.sa):""}${p.risk?" · ⚠":""}</small></span><span class="sr">${p.sec} s${p.uni?" je S.":""}</span></button>`}).join("")||`<div class="empty">Keine Haltung für diese Auswahl.</div>`}
   <div class="ysafe">Bei Schmerz sofort abbrechen – nur sanft dehnen.</div>`;
  bindLibSeg();for(const c of document.querySelectorAll("[data-ymini]"))attachAnim(c,"y_"+c.dataset.ymini,{still:1});
  for(const b of document.querySelectorAll("[data-ylv]"))b.onclick=()=>{YLF.lv=+b.dataset.ylv;renderYogaLib()};
  for(const b of document.querySelectorAll("[data-yr]"))b.onclick=()=>{YLF.r=b.dataset.yr;renderYogaLib()};
  for(const b of document.querySelectorAll("[data-ypose]"))b.onclick=()=>yPoseSheet(b.dataset.ypose);
  $("#yLibPlan").onclick=yPlanSheet;$("#yLibQuick").onclick=()=>{audio();yStart("quick")}}

/* ---------- hooks into the app (wrapping, the strength code stays untouched) ---------- */
{const st=document.createElement("style");st.textContent=`
.ysafe{font-size:12.5px;color:var(--warn-text);border:1px solid rgba(245,183,46,.35);background:rgba(245,183,46,.06);border-radius:4px;padding:6px 10px;text-align:center}
.ystage canvas{height:min(42vh,290px)}
.yring{position:relative;width:112px;height:112px;flex:none}
.yring svg{width:100%;height:100%;transform:rotate(-90deg)}
.yring circle{fill:none;stroke-width:7}.yring .yb{stroke:rgba(var(--ac),.13)}.yring .yf{stroke:var(--arc);filter:drop-shadow(0 0 5px var(--arc));transition:stroke-dashoffset .25s linear}.yring .yf.yp{stroke:var(--gold);filter:none}
.yring .t{position:absolute;inset:0;display:grid;place-items:center;font-size:28px;font-weight:700}
.ybtns{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px;margin-top:auto}
.ycard .ytitle{font-family:var(--display);font-size:17px;letter-spacing:.04em;text-transform:uppercase}
.ywk{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--line)}
.ylock{opacity:.55}
.ywarn{font-size:12.5px;color:var(--warn-text);border:1px solid rgba(245,90,46,.55);background:rgba(245,90,46,.10);border-radius:4px;padding:7px 10px;line-height:1.35}
.ystartpick{display:grid;gap:6px}
#libSeg{margin-bottom:2px}
body.pip #yoga{display:none!important}`;document.head.appendChild(st);
  const ov=document.createElement("div");ov.id="yoga";ov.className="overlay";ov.hidden=true;ov.innerHTML=`<div class="inner" id="yogaInner"></div>`;document.body.insertBefore(ov,$("#onb"))}
{const _home=renderHome;renderHome=function(){_home();const wk=document.querySelector("#v-home .week");const card=wk&&wk.closest(".card");const h=yHomeCard();
    if(card)card.insertAdjacentHTML("afterend",h);else $("#v-home").insertAdjacentHTML("beforeend",h);yBindHome()};RENDER.home=renderHome;
  const _lib=renderLib;renderLib=function(){if(LIBMODE==="yoga"){renderYogaLib();return}_lib();$("#v-lib").insertAdjacentHTML("afterbegin",libSeg());bindLibSeg()};RENDER.lib=renderLib;
  const _dv=doneView;doneView=function(){const h=_dv();const b=`<button class="btn block" id="postS">Speichern & 5 Min. dehnen</button>`;const m='<button class="btn ghost block" id="backS">';return h.includes(m)?h.replace(m,b+m):h+b};
  const _bd=bindDone;bindDone=function(){_bd();const b=$("#postS");if(b)b.onclick=()=>{const day=S.session&&S.session.plan;$("#saveS").onclick();yStart("post",{day})}};
  const _ns=nativeState;nativeState=function(force){if(yNative(force))return;return _ns(force)};
  const _pip=pipRender;pipRender=function(){const v=$("#pipView");if(v&&S.yrun&&!$("#yoga").hidden){yPip(v);return}return _pip()};
  const _back=window.appBack;window.appBack=function(){if(!$("#yoga").hidden&&$("#sheetBg").hidden&&$("#onb").hidden){yAskClose();return}return _back()};
  const _set=renderSet;renderSet=function(){_set();const v=$("#verLine");const h=`<div class="card" id="yogaSetCard"><div class="label">Yoga</div>${yStartPick()}<button class="btn small" id="ySetPlan">24-Wochen-Plan öffnen</button></div>`;
    if(v)v.insertAdjacentHTML("beforebegin",h);else $("#v-set").insertAdjacentHTML("beforeend",h);yBindStartPick(()=>RENDER.set());const b=$("#ySetPlan");if(b)b.onclick=yPlanSheet};RENDER.set=renderSet;
  const _res=window.appResume;window.appResume=function(){_res();if(S.yrun&&!$("#yoga").hidden){yTick();nativeState(true)}};
  const _bk=openBackup;openBackup=function(){_bk();const y=yS();const p=[...document.querySelectorAll("#sheet p.muted")].pop();if(p)p.textContent+=` · ${y.log.length} Yoga-Einheiten (Plan: ${Object.keys(y.done).length}/${YN} Wochen)`}}
function yNative(force){const A=nat();if(!A||!S.yrun||$("#yoga").hidden)return false;const r=S.yrun;const st=yCurStep();const p=YP[st.k];
  const o={active:true,pip:S.settings.pip!==false,notif:S.settings.notif!==false,jai:jaiOn(),sound:S.settings.sound!==false,start:r.start,yoga:true};
  if(r.ph==="done"){o.phase="done";o.title="Yoga geschafft";o.text="Tippen zum Abschließen"}
  else if(r.paused){o.phase="set";o.title="Yoga pausiert";o.text=p.n}
  else{const nx=r.steps[r.i+1];o.phase="rest";o.endTime=yHoldEnd();o.title=`Yoga · ${p.n}${st.side?" · Seite "+st.side:""}`;o.text=`Haltung ${r.i+1} von ${r.steps.length} · ${r.title}`;
    o.alert=nx?(nx.k===st.k&&nx.side===2?"Seite wechseln: "+p.n:"Weiter: "+YP[nx.k].n):"Yoga-Einheit geschafft";o.endSeq=[]}
  const j=JSON.stringify(o);if(!force&&j===nativeState._last)return true;nativeState._last=j;window.__natLog&&window.__natLog.push(o);try{A.trainingState(j)}catch(e){}return true}
function yPip(v){const r=S.yrun;if(r.ph==="done"){v.innerHTML=`<div class="pipL">Yoga</div><div class="pipT">✓</div><div class="pipS">Geschafft</div>`;return}
  const st=yCurStep();const now=Date.now();const left=r.paused?r.left:Math.max(0,(r.end-now)/1000);const tot=r.ph==="prep"?yPrepOf(r):st.sec;const C=2*Math.PI*44;const off=C*(1-Math.max(0,Math.min(1,left/tot)));
  v.innerHTML=`<div class="pipL">${r.paused?"Pausiert":r.ph==="prep"?(st.side===2?"Seite wechseln":"Gleich"):"Halten"}</div><div class="pipRing"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="pb"/><circle cx="50" cy="50" r="44" class="pf" stroke-dasharray="${C}" stroke-dashoffset="${off}"/></svg><div class="pipT">${mmss(left)}</div></div><div class="pipS">${esc(YP[st.k].n)}</div><div class="pipS2">${r.i+1}/${r.steps.length}${st.side?" · Seite "+st.side:""}</div>`}
if(S.yrun&&S.yrun.ph==="done"){/* finished before the app closed: keep the result, just clear the run */S.yrun=null;save()}
/* ================= 3.4 · Rotation & Auswahl in den Abläufen (@ Joschy) =================
   Die neuen Haltungen kommen ohne neue Abläufe in die bestehenden:
   - 24-Wochen-Plan: beim Wiederholen einer Woche werden bis zu 2 Haltungen (Hauptteil) und das Ankommen durch passende
     Alternativen ersetzt (gleiche Zielregion bei Schulter/Hüfte, Stufe <= Stufe der Woche). Der erste Durchgang bleibt wie bisher.
   - Schnell-Dehnen und Dehnen nach dem Training: wöchentlich abwechselnd die bisherige und eine neue Variante.
   - Im laufenden Ablauf: „Andere Haltung“ tauscht die aktuelle Haltung gegen eine passende Alternative (nur für diesen Durchgang).
   Haltezeiten werden wie bisher über yScale auf die Zieldauer gebracht, die Dauer der Abläufe bleibt gleich. */
const YROT={
  /* Schultern (bleibt Schulter) */
  schulterkreisen:["sitzberg","wandhund"],armquer:["wandhund"],trizeps:["sitzberg"],adlerarm:["wandhund"],wandengel:["sitzberg","wandhund"],brustoeffner:["rueckbeuge"],
  armeheben:["sitzberg","wandhund"],hund:["wandhund"],welpe:["yogamudra","wandhund"],faden:["wandhund","yogamudra"],kuhgesicht:["yogamudra","demkrieger"],delfin:["yogamudra"],
  adler:["demkrieger"],delfinkopf:["wandl"],unterarmvor:["unterarmstand","handstand"],
  /* Hüfte (bleibt Hüfte) */
  tiefausfall:["reiter","hoherausfall"],figur4:["wiege","feuerholz"],schmetterling:["graetsche","schneidervor","halblotus"],liegschmetterling:["graetsche"],happybaby:["graetsche","schneidervor"],
  bruecke:["bruecke1"],krieger1:["hoherausfall"],krieger2:["goettinseit"],goettin:["goettinseit"],halbmond:["hoherausfall"],eidechse:["reiter","hoherausfall"],
  taube:["feuerholz","kuhgesichtsitz","stehtaube"],malasana:["graetsche","schneidervor"],bogen:["bruecke1"],seitausfall:["goettinseit"],baum:["stehtaube"],
  koenigstaube:["kuhgesichtsitz","lotus"],taenzer:["lotusstand"],echseunter:["feuerholz","lotus"],
  /* Rücken, Brust, Beine, Ganzkörper */
  katzekuh:["tiger"],vierfuessler:["tiger","halbheuschrecke"],sphinx:["halbheuschrecke","tiger"],kobra:["halbheuschrecke","superman"],krokodil:["halbheuschrecke"],windloeser:["kind","kniebrust"],
  seitbeuge:["sitzdreh"],sitzseitbeuge:["sitzdreh"],kniebrust:["stab"],ragdoll:["drehvorbeuge"],stuhldreh:["drehausfall","drehvorbeuge"],drehsitz:["marichi3","bharadvaja"],
  seitwinkel:["drehausfall","graetschseit"],umkrieger:["graetschseit"],heuschrecke:["superman"],robbe:["superman"],hochhund:["superman"],pflug:["ohrendruck"],
  kamel:["rueckbeuge","achtpunkt"],fisch:["rueckbeuge"],tisch:["achtpunkt"],fersensitz:["rueckbeuge"],kraehe:["pfau","waage"],chaturanga:["pfau"],umgbrett:["bogenvoll"],rad:["bogenvoll"],kameltief:["bogenvoll"],
  beingurt:["liegevishnu","marichi1"],pyramide:["marichi1","kopfkniestand"],sitzvorbeuge:["marichi1","beingurt"],kopfknie:["marichi1","liegevishnu"],heldensitz:["liegheld","frosch"],oberschenkel:["liegheld"],
  zehensitz:["liegheld"],halbspagat:["spagat"],krieger3:["stehspagat","kopfkniestand"],halbmondbal:["stehspagat"],drehhalbmond:["kopfkniestand"],drehdreieck:["reiher"],
  streckung:["stern","palme"],brett:["unterarmstuetz","kniebrett"],seitstuetz:["seitunterarm"],seitstuetzbein:["seitunterarm"],bootkn:["unterarmstuetz"],bootvoll:["seitunterarm"],
  kopfstand:["halbschulter"],schulterstand:["halbschulter"],
  /* Ankommen (Aufwärmen) */
  sukhasana:["wechselatmung","bienenatmung"],feueratem:["wechselatmung"]};
/* Alternativen einer Haltung in beide Richtungen (die neue Haltung lässt sich auch zurücktauschen) */
function yRotGroup(k){const g=[k,...(YROT[k]||[])];for(const o in YROT)if(YROT[o].includes(k)&&!g.includes(o))g.push(o);return g.filter(x=>YP[x])}
function yRound(w){return yS().log.filter(l=>l&&l.week===w&&(l.kind==="plan"||l.kind==="repeat")).length}
/* Plan: Durchgang 0 = unverändert; ab dem 2. Durchgang einer Woche werden bis zu 2 Hauptteil-Haltungen und das Ankommen rotiert */
function yRotate(items,stage,r){if(!r)return items;const used=new Set(items.map(x=>x.k));const out=items.map(x=>({...x}));
  const pick=(x,i)=>{const c=(YROT[x.k]||[]).filter(k=>YP[k]&&YP[k].lv<=stage&&!used.has(k));if(!c.length)return false;const k=c[(r-1+i)%c.length];used.delete(x.k);used.add(k);Object.assign(x,yItem(k,x.part,x.fix));return true};
  const main=out.filter(x=>x.part==="main"&&(YROT[x.k]||[]).some(k=>YP[k]&&YP[k].lv<=stage));let n=0;
  for(let j=0;j<main.length&&n<2;j++){const x=main[(2*(r-1)+j)%main.length];if(pick(x,n))n++}
  for(const x of out)if(x.part==="warm"&&(x.k==="sukhasana"||x.k==="feueratem"||(x.k==="katzekuh"&&r%2===0)))pick(x,0);
  return out}
{const _plan=yPlan;yPlan=function(w,round){w=Math.min(YN,Math.max(1,w|0));const P=_plan(w);const r=round!=null?round:yRound(w);if(!r)return P;
    const st=yStageOf(w);const cool=P.items.filter(x=>x.part==="cool");const items=yScale(yRotate(P.items.filter(x=>x.part!=="cool").map(x=>yItem(x.k,x.part)),st,r).concat(cool.map(x=>yItem(x.k,"cool",1,x.sec))),yTarget(w));
    const secs=ySecs(items);return{...P,items,secs,min:Math.round(secs/60),round:r}}}
/* Schnell-Dehnen und Dehnen nach dem Training: wöchentlich abwechselnd (Kalenderwoche gerade/ungerade) */
const YQUICK2=["schulterkreisen","wandhund","adlerarm","tiger","reiter","wiege","kind"];
const YPOST2={A:["wandhund","armquer","trizeps","kind","sphinx"],B:["adlerarm","trizeps","seitbeuge","katzekuh","schneidervor"],C:["tiefausfall","wiege","halbevorbeuge","graetsche","kniebrust"]};
function yAltWeek(){return Math.round(weekStart(new Date()).getTime()/WEEKMS)%2===1}
{const _q=yQuick;yQuick=function(){if(!yAltWeek())return _q();const items=yScale(YQUICK2.map(k=>yItem(k,"main")),300);return{items,secs:ySecs(items),min:Math.round(ySecs(items)/60)}}
  const _p=yPost;yPost=function(day){if(!yAltWeek()||!YPOST2[day])return _p(day);const items=yScale(YPOST2[day].map(k=>yItem(k,"main")),300);return{items,secs:ySecs(items),min:Math.round(ySecs(items)/60)}}}
/* Auswahl im laufenden Ablauf: nächste passende Alternative (Stufe <= Stufe der Plan-Woche bzw. der Haltung), beide Seiten, Haltezeit bleibt */
function ySwapNext(){const r=S.yrun;if(!r||r.ph==="done")return null;const st=yCurStep();if(!st)return null;const lim=r.kind==="plan"||r.kind==="repeat"?yStageOf(r.week):Math.max(1,YP[st.k].lv);
  let base=r.orig&&r.orig[r.i];if(!base||!yRotGroup(base).includes(st.k))base=st.k;const g=yRotGroup(base).filter(k=>YP[k].lv<=lim&&(k===st.k||!r.steps.some(s=>s.k===k)));if(g.length<2)return null;const i=g.indexOf(st.k);return g[(i+1)%g.length]}
function ySwap(){const r=S.yrun;const nk=ySwapNext();if(!nk)return;const st=yCurStep();let base=r.orig&&r.orig[r.i];if(!base||!yRotGroup(base).includes(st.k))base=st.k;
  let i0=r.i;if(st.side===2&&r.steps[i0-1]&&r.steps[i0-1].k===st.k)i0--;let i1=i0+1;if(r.steps[i0].side===1&&r.steps[i1]&&r.steps[i1].k===st.k&&r.steps[i1].side===2)i1++;
  const rep=ySteps([{k:nk,sec:st.sec,uni:!!YP[nk].uni,part:st.part}]);r.steps.splice(i0,i1-i0,...rep);
  /* remember the original pose of the slot (index based), so the group stays the same while cycling */
  const o=r.orig||{};const shifted={};for(const k in o){const j=+k;shifted[j<i0?j:j>=i1?j-(i1-i0)+rep.length:j]=o[k]}for(let j=i0;j<i0+rep.length;j++)shifted[j]=base;r.orig=shifted;
  r.swaps=(r.swaps||0)+1;yJump(i0);toast("Andere Haltung: "+YP[nk].n)}
{const _r=yRender;yRender=function(){_r();const r=S.yrun;if(!r||r.ph==="done")return;const nk=ySwapNext();if(!nk)return;const ab=$("#yAlt");
    const b=`<button class="btn${ab?"":" block"}" id="ySwap">Andere Haltung: ${esc(YP[nk].n)}</button>`;
    if(ab){ab.insertAdjacentHTML("beforebegin",`<div class="yalts"></div>`);const w=ab.previousElementSibling;w.appendChild(ab);ab.classList.remove("block");w.insertAdjacentHTML("beforeend",b)}
    else{const yb=document.querySelector("#yogaInner .ybtns");if(yb)yb.insertAdjacentHTML("afterend",b)}
    $("#ySwap").onclick=()=>{audio();ySwap()}}}
{const st=document.createElement("style");st.textContent=`.yalts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}.yalts .btn,#ySwap{white-space:normal;line-height:1.2}`;document.head.appendChild(st)}
