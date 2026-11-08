/* ================= 2.1 · YOGA & DEHNEN (@ Joschy) =================
   Zusatzbereich, Kraft bleibt Hauptfokus. Eigene Posen-Bibliothek (YP), eigene Animationen (AN["y_…"]),
   12-Wochen-Plan in 3 Stufen, Schnell-Dehnen, Dehnen nach dem Training. Fortschritt in S.yoga (im Backup enthalten).
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
function drawFootBare(x,kit,a,t,kn,s,mini){const K=kit.K;const f=norm2([t[0]-a[0],t[1]-a[1]]);let n=[-f[1],f[0]];const kv=[kn[0]-a[0],kn[1]-a[1]];if(n[0]*kv[0]+n[1]*kv[1]>0)n=[-n[0],-n[1]];
  const Lp=(p,u,v)=>[p[0]+f[0]*u*s+n[0]*v*s,p[1]+f[1]*u*s+n[1]*v*s];
  const pts=[Lp(a,-3.1,1.8),Lp(a,-2.6,-1.9),Lp(a,1.2,-2.4),Lp(t,-4,-1.5),Lp(t,-.6,-.9),Lp(t,.9,.1),Lp(t,.5,1.5),Lp(t,-2,2),Lp(a,-2.6,2.5)];
  kit.blob(pts,K.skin,Lp(a,-3,0),Lp(t,1,0),2.5*s)}
/* yoga mat on the floor */
function drawMat(ctx,def,o,P,R,fl,front,tr){const cx=def.matX!=null?def.matX:(tr.bx0+tr.bx1)/2;const hw=front?Math.max(52,(tr.bx1-tr.bx0)/2+8):Math.max(70,Math.min(104,(tr.bx1-tr.bx0)/2+16));
  const A=P([cx-hw,fl]),B=P([cx+hw,fl]);const d=R(front?16:5);const k=front?.35:.9;
  ctx.save();ctx.beginPath();ctx.moveTo(A[0]+d*k,A[1]-d);ctx.lineTo(B[0]+(front?-d*k:d*k),B[1]-d);ctx.lineTo(B[0],B[1]);ctx.lineTo(A[0],A[1]);ctx.closePath();
  const g=ctx.createLinearGradient(0,A[1]-d,0,A[1]);g.addColorStop(0,"#123540");g.addColorStop(1,"#1d5565");ctx.fillStyle=g;ctx.fill();
  ctx.fillStyle="#0b222b";ctx.fillRect(A[0],A[1],B[0]-A[0],Math.max(1.5,R(1.8)));
  ctx.strokeStyle="rgba(62,230,255,.4)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();ctx.restore()}
/* strap (Gurt/Handtuch) from the hand to the foot */
const _yDrawExtra=drawExtraEq;
drawExtraEq=function(ctx,e,o,P,R,fl,front){if(e.t==="ystrap"){if(!o.hand||!o.toe)return;const a=P(o.hand),b=P(lerpP(o.ankle,o.toe,.55));ctx.save();ctx.strokeStyle="#c9a227";ctx.lineCap="round";ctx.lineWidth=Math.max(1.2,R(1.6));ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();ctx.restore();return}
  if(e.t==="yblock"){const c=P([e.x,fl]);const w=R(e.w||16),h=R(e.h||9);ctx.save();ctx.fillStyle="#6b4fa0";ctx.fillRect(c[0]-w/2,c[1]-h,w,h);ctx.fillStyle="rgba(255,255,255,.12)";ctx.fillRect(c[0]-w/2,c[1]-h,w,R(1.5));ctx.restore();return}
  return _yDrawExtra(ctx,e,o,P,R,fl,front)};

/* ---------- poses ---------- */
const YREG=[["schulter","Schulter & Nacken"],["brust","Brust & Arme"],["huefte","Hüfte"],["ruecken","Rücken"],["beine","Beine"],["ganz","Ganzkörper"]];
const YLV=["","Einstieg","Aufbau","Fortgeschritten"];
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
    an:{anchor:"hip",at:[0,51],A:{torso:8,thigh:-90,shin:180,upper:-90,fore:-90,foot:180,neck:22,lum:7,tho:3},B:{torso:12,thigh:-90,shin:180,upper:-92,fore:-90,foot:180,neck:-42,lum:-6,tho:-9},tempo:[3,.6,3,.6],ph:["Ausatmen · Katze","Einatmen · Kuh"]}},
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
    an:{anchor:"shoulder",at:[0,9],fixFeet:1,A:{torso:203,thigh:6,shin:-53,hand:[40,-6],bend:1,neck:-23},B:{torso:206,thigh:3,shin:-51,hand:[40,-6],bend:1,neck:-26}}},
  savasana:{n:"Endentspannung",sa:"Savasana",lv:1,r:"ganz",z:"Ganzkörper · Ruhe",sec:120,
    c:["Rückenlage, Beine und Arme locker ablegen","Handflächen nach oben, Augen schließen","Nichts mehr tun, einfach liegen"],a:"Natürlich atmen, nichts steuern.",
    an:{anchor:"hip",at:[0,8],A:{torso:180,thigh:0,shin:-2,foot:62,upper:-4,fore:-2,neck:0},B:{torso:180.6,thigh:0,shin:-2,foot:62,upper:-4,fore:-2,neck:0},tempo:[4,1,5,1]}},
  sukhasana:{n:"Bequemer Sitz mit Atmung",sa:"Sukhasana",lv:1,r:"ganz",z:"Atmung · Ankommen",sec:60,
    c:["Im Schneidersitz aufrecht sitzen, ggf. auf einem Kissen","Hände ruhen auf den Knien","Schultern sinken, Scheitel zieht nach oben"],a:"4 Sekunden ein, 6 Sekunden aus.",
    an:{view:"front",A:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],hR:[33,100],hL:[-33,100],bR:-1,bL:1},B:{yf:1,hy:13,kR:[39,18],aR:[-13,8],aL:[13,7],hR:[33,100],hL:[-33,100],bR:-1,bL:1},tempo:[4,.5,5.5,.5]}},
  tiefausfall:{n:"Tiefer Ausfallschritt kniend",sa:"Anjaneyasana",lv:1,r:"huefte",z:"Hüftbeuger · Oberschenkel vorn",sec:40,uni:1,
    c:["Ein Knie auf der Matte, vorderer Fuß weit vorn","Vorderes Knie über dem Knöchel","Becken sanft nach vorn-unten schieben, Oberkörper aufrecht"],a:"Ausatmen und die Hüfte etwas tiefer sinken lassen.",
    an:{anchor:"hip",at:[0,35],A:{torso:91,thigh:14,shin:-88,foot:0,thigh2:-142,shin2:180,foot2:180,handAt:[30,50],bend:1,neck:0},B:{torso:94,thigh:14,shin:-88,foot:0,thigh2:-142,shin2:180,foot2:180,handAt:[31,49],bend:1,neck:3}}},
  streckung:{n:"Ganzkörperstreckung",lv:1,r:"ganz",z:"Ganzer Körper",sec:30,
    c:["Rückenlage, Arme über den Kopf ablegen","Fingerspitzen und Fersen ziehen auseinander","Unterer Rücken bleibt weich am Boden"],a:"Einatmen und lang machen, ausatmen und lösen.",
    an:{anchor:"hip",at:[0,8],A:{torso:180,thigh:0,shin:-1,foot:58,upper:181,fore:180,neck:0},B:{torso:180,thigh:0,shin:-1,foot:14,upper:182,fore:182,neck:0}}},
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
    an:{anchor:"hip",at:[0,8],A:{torso:180,thigh:76,shin:78,foot:4,thigh2:0,shin2:-1,foot2:62,handAt:[-24,50],bend:1,neck:0},B:{torso:180,thigh:82,shin:84,foot:10,thigh2:0,shin2:-1,foot2:62,handAt:[-24,52],bend:1,neck:0},eq:[{t:"ystrap"}]}},
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
    an:{anchor:"hand",A:{upper:-90,fore:-90,torso:180,thigh:-15,shin:-90,foot:0,neck:6},B:{upper:-90,fore:-90,torso:178,thigh:-13,shin:-90,foot:0,neck:8}}},
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
    an:{anchor:"hip",at:[0,51],A:{torso:-45,thigh:-90,shin:180,foot:180,handAt:[96,3],bend:1,hand2:[20,-6],bend2:1,neck:38},B:{torso:-47,thigh:-90,shin:180,foot:180,handAt:[97,3],bend:1,hand2:[20,-5],bend2:1,neck:40}}},
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
    an:{anchor:"hip",at:[0,88],A:{torso:-20,thigh:-63,shin:-66,foot:0,thigh2:-118,shin2:-117,foot2:22,handAt:[36,14],bend:-1,neck:-8},B:{torso:-25,thigh:-63,shin:-66,foot:0,thigh2:-118,shin2:-117,foot2:22,handAt:[37,12],bend:-1,neck:-8},eq:[{t:"yblock",x:38}]}},
  sitzvorbeuge:{n:"Sitzende Vorbeuge",sa:"Paschimottanasana",lv:3,r:"beine",z:"Beinrückseite · Rücken",sec:40,
    c:["Langsitz, Beine gestreckt, Knie dürfen leicht gebeugt sein","Aus der Hüfte nach vorn neigen, Rücken lang","Hände an Schienbeine oder Füße, nicht ziehen"],a:"Ausatmen und den Oberkörper etwas sinken lassen.",
    an:{anchor:"hip",at:[0,9],A:{torso:38,thigh:4,shin:-4,foot:76,handAt:[76,11],bend:-1,neck:-14,tho:-3},B:{torso:33,thigh:4,shin:-4,foot:76,handAt:[78,11],bend:-1,neck:-16,tho:-4}}},
  bogen:{n:"Halber Bogen",sa:"Ardha Dhanurasana",lv:3,r:"huefte",z:"Oberschenkel vorn · Hüftbeuger · Brust",sec:20,uni:1,
    c:["Bauchlage, auf einen Unterarm stützen","Mit der anderen Hand den Fuß greifen","Fuß sanft in die Hand drücken, Knie bleibt am Boden"],a:"Ruhig weiteratmen, nicht ruckartig ziehen.",
    an:{anchor:"hip",at:[0,10],flip:1,A:{torso:148,thigh:2,shin:144,foot:150,thigh2:0,shin2:0,foot2:-12,handAt:[8,40],bend:-1,upper2:-90,fore2:180,neck:-4},B:{torso:147,thigh:2,shin:146,foot:152,thigh2:0,shin2:0,foot2:-12,handAt:[7,39],bend:-1,upper2:-90,fore2:180,neck:-4}}}
};
const YKEYS=Object.keys(YP);
/* animation defaults: barefoot, on the mat, breathing tempo */
for(const k of YKEYS){const d=YP[k].an;const def={floor:0,eq:[],tempo:[3.4,.8,4,.8],ph:YBR,mat:1,bare:1,lag:.04,...d};def.A={...d.A};def.B={...d.B};if(d.view==="front"&&def.floor===0)def.floor=0;AN["y_"+k]=def}

/* ---------- 12-Wochen-Plan: 3 Stufen à 4 Wochen, 1 Einheit pro Woche ---------- */
const YSTAGE=[null,{n:"Einstieg",cool:120,t:"Sanft ankommen: Schultern, Nacken und Hüfte mobilisieren."},{n:"Aufbau",cool:150,t:"Stehende Haltungen und Hund: mehr Weite, etwas mehr Kraft."},{n:"Fortgeschritten",cool:180,t:"Tiefere Hüft- und Schulteröffner, längere Haltezeiten. Weiterhin sanft."}];
const YW=[null,
  {w:["sukhasana","schulterkreisen","nacken","katzekuh"],m:["kind","armquer","adlerarm","wandengel","tiefausfall","figur4","schmetterling","kniebrust"]},
  {w:["sukhasana","schulterkreisen","kinnbrust","katzekuh"],m:["kind","trizeps","brustoeffner","seitbeuge","tiefausfall","figur4","schmetterling","bruecke","kniebrust"]},
  {w:["berg","schulterkreisen","nacken","hueftkreisen","katzekuh"],m:["halbevorbeuge","wandengel","adlerarm","tiefausfall","sphinx","kind","figur4","beingurt","schmetterling"]},
  {w:["sukhasana","sitzseitbeuge","schulterkreisen","katzekuh"],m:["vorbeuge","armquer","trizeps","fersensitz","tiefausfall","sphinx","bruecke","figur4","schmetterling","streckung"]},
  {w:["sukhasana","schulterkreisen","nacken","katzekuh"],m:["hund","tiefausfall","krieger1","krieger2","adlerarm","welpe","kobra","figur4","schmetterling","happybaby"]},
  {w:["berg","schulterkreisen","hueftkreisen","katzekuh"],m:["hund","krieger2","umkrieger","dreieck","goettin","faden","sphinx","drehsitz","figur4","kniebrust"]},
  {w:["sukhasana","sitzseitbeuge","schulterkreisen","katzekuh"],m:["hundpedal","stuhl","krieger1","baum","malasana","tisch","heuschrecke","welpe","drehsitz","happybaby","schmetterling"]},
  {w:["sukhasana","schulterkreisen","nacken","katzekuh","hund"],m:["krieger2","umkrieger","dreieck","seitausfall","goettin","faden","kobra","bruecke","drehsitz","figur4","happybaby"]},
  {w:["sukhasana","schulterkreisen","katzekuh","hund"],m:["tiefausfall","halbmond","krieger2","seitwinkel","pyramide","kuhgesicht","delfin","taube","sitzvorbeuge","bruecke"]},
  {w:["berg","schulterkreisen","hueftkreisen","katzekuh","hundpedal"],m:["krieger1","dreieck","seitwinkel","eidechse","welpe","kuhgesicht","bogen","kamel","taube","drehsitz","happybaby"]},
  {w:["sukhasana","sitzseitbeuge","katzekuh","hund"],m:["halbmond","pyramide","goettin","malasana","delfin","faden","fisch","heuschrecke","taube","sitzvorbeuge","schmetterling"]},
  {w:["sukhasana","schulterkreisen","nacken","katzekuh","hund"],m:["krieger2","umkrieger","seitwinkel","eidechse","kuhgesicht","adlerarm","kamel","fisch","taube","drehsitz","sitzvorbeuge","happybaby"]}];
const YQUICK=["schulterkreisen","armquer","adlerarm","katzekuh","tiefausfall","figur4","kind"];
const YPOST={A:["brustoeffner","armquer","trizeps","kind","sphinx"],B:["adlerarm","trizeps","seitbeuge","katzekuh","kind"],C:["tiefausfall","figur4","halbevorbeuge","schmetterling","kniebrust"]};
const YPREP=6,YSW=5,YPART={warm:"Aufwärmen",main:"Hauptteil",cool:"Endentspannung"};
function yStageOf(w){return Math.min(3,Math.max(1,Math.ceil(w/4)))}
function yTarget(w){return Math.round((15+(w-1)*10/11)*60)}
function ySecs(items){let s=0;for(const it of items){const sd=it.uni?2:1;s+=YPREP+sd*it.sec+(sd-1)*YSW}return s}
function yItem(k,part,fix,sec){const p=YP[k];return{k,part,uni:!!p.uni,sec:sec!=null?sec:part==="warm"?Math.round(p.sec*.8/5)*5:p.sec,fix:!!fix}}
/* scale the hold times so the whole session meets the target duration (overhead and the final relaxation stay fixed) */
function yScale(items,target){const over=items.reduce((a,x)=>a+YPREP+(x.uni?YSW:0),0);const F=items.filter(x=>x.fix).reduce((a,x)=>a+x.sec*(x.uni?2:1),0);
  const H=items.filter(x=>!x.fix).reduce((a,x)=>a+x.sec*(x.uni?2:1),0);const f=Math.max(.5,Math.min(2.4,(target-over-F)/(H||1)));
  return items.map(x=>x.fix?x:{...x,sec:Math.max(15,Math.min(90,Math.round(x.sec*f/5)*5))})}
function yPlan(w){w=Math.min(12,Math.max(1,w|0));const st=yStageOf(w);const d=YW[w];
  let items=[...d.w.map(k=>yItem(k,"warm")),...d.m.map(k=>yItem(k,"main")),yItem("savasana","cool",1,YSTAGE[st].cool)];items=yScale(items,yTarget(w));
  const secs=ySecs(items);return{week:w,stage:st,items,secs,min:Math.round(secs/60)}}
function yQuick(){const items=yScale(YQUICK.map(k=>yItem(k,"main")),300);return{items,secs:ySecs(items),min:Math.round(ySecs(items)/60)}}
function yPost(day){const items=yScale((YPOST[day]||YQUICK).map(k=>yItem(k,"main")),300);return{items,secs:ySecs(items),min:Math.round(ySecs(items)/60)}}
function ySteps(items){const out=[];for(const it of items){if(it.uni){out.push({k:it.k,sec:it.sec,side:1,part:it.part},{k:it.k,sec:it.sec,side:2,part:it.part})}else out.push({k:it.k,sec:it.sec,side:0,part:it.part})}return out}

/* ---------- state (S.yoga: start, done[week], log) ---------- */
function yS(){if(!S.yoga||typeof S.yoga!=="object"||Array.isArray(S.yoga))S.yoga={start:null,done:{},log:[]};const y=S.yoga;
  if(!y.done||typeof y.done!=="object"||Array.isArray(y.done))y.done={};if(!Array.isArray(y.log))y.log=[];if(typeof y.start!=="number")y.start=null;return y}
function yCalWeek(){const y=yS();if(!y.start)return 1;return Math.max(1,Math.round((weekStart(new Date()).getTime()-y.start)/WEEKMS)+1)}
function yFirstOpen(){const y=yS();for(let w=1;w<=12;w++)if(!y.done[w])return w;return 13}
function yStageDone(st){const y=yS();for(let w=st*4-3;w<=st*4;w++)if(!y.done[w])return false;return true}
function yStageCount(st){const y=yS();let n=0;for(let w=st*4-3;w<=st*4;w++)if(y.done[w])n++;return n}
function yUnlocked(st){for(let s=1;s<st;s++)if(!yStageDone(s))return false;return true}
function yDoneThisWeek(){const ws=weekStart(new Date()).getTime();return yS().log.some(l=>l.kind==="plan"&&new Date(l.date).getTime()>=ws)}
/* current plan week: advances with the calendar, never skips an open week, one unit per calendar week */
function yCur(){const fo=yFirstOpen();if(fo>12)return{week:12,complete:true,wait:false,next:null};const w=Math.min(fo,yCalWeek());const wait=!!yS().done[w]||yDoneThisWeek();return{week:wait?fo:w,complete:false,wait,next:fo}}
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
function ySideSwitch(){const r=S.yrun;if(!r)return;const st=yCurStep();if(st.side!==1)return;yJump(r.i+1)}
function yAskClose(){const r=S.yrun;if(!r)return;if(r.ph==="done"){S.yrun=null;save();yClose();return}
  confirmSheet("Einheit beenden?",r.kind==="plan"?"Die Woche zählt erst, wenn die Einheit bis zum Ende gelaufen ist. Bei Schmerzen ist Aufhören immer richtig.":"Du kannst jederzeit neu starten.","Beenden",()=>{S.yrun=null;save();yClose()},`<button class="btn block" id="yLater">Pausieren & später weiter</button>`,()=>{$("#yLater").onclick=()=>{closeSheet();if(!S.yrun.paused)yPauseToggle();yClose()}})}

/* ---------- views ---------- */
const Y_C=2*Math.PI*44;
function yRegName(r){const x=YREG.find(a=>a[0]===r);return x?x[1]:r}
function yRender(){const r=S.yrun;const el=$("#yogaInner");if(!r||!el)return;
  if(r.ph==="done"){const rec=r.rec||{dur:0,n:0};
    el.innerHTML=`<div style="text-align:center;padding:18px 0 6px"><div class="donecheck">✓</div><h1 style="font-size:34px;margin-top:10px">Einheit geschafft</h1><p class="muted" style="margin:6px 0 0">${esc(r.title)}${r.kind==="plan"?` · Stufe ${YSTAGE[yStageOf(r.week)].n}`:""}</p></div>
     <div class="stats">${statTile(mmss(rec.dur),"Dauer")}${statTile(rec.n,"Haltungen")}${statTile(r.kind==="plan"?r.week+"/12":"–","Plan-Woche")}</div>
     ${r.kind==="plan"?`<div class="hint">${r.week%4===0?`<b>Stufe ${yStageOf(r.week)} abgeschlossen.</b> ${r.week<12?`Stufe ${yStageOf(r.week)+1} ist jetzt freigeschaltet.`:"Der ganze Plan ist geschafft."}`:"Nächste Yoga-Einheit ab nächster Woche, am besten an einem Tag ohne Krafttraining."}</div>`:`<div class="hint">Zählt nicht zum Krafttraining und nicht zur Erholung zwischen Drücken, Ziehen und Beinen.</div>`}
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
   <div class="ysafe" role="note">Bei Schmerz sofort abbrechen – nur sanft dehnen.</div>
   <div class="stage ystage"><canvas id="ycv" ${st.side===2?'style="transform:scaleX(-1)"':""}></canvas><span class="phase" id="yph"></span><span class="tempo">${esc(YLV[p.lv])}</span><span class="readout">${esc(yRegName(p.r).toUpperCase())}${st.side?` · SEITE ${st.side}`:""}</span></div>
   <div class="row between" style="align-items:center;gap:12px">
     <div style="min-width:0"><div class="label" id="yLbl">${prep?(st.side===2?"Seite wechseln":"Gleich geht's los"):r.paused?"Pausiert":"Halten"}</div><h1 class="exname" style="font-size:30px">${esc(p.n)}</h1>
       <div class="muted" style="font-size:13px">${p.sa?esc(p.sa)+" · ":""}${esc(p.z)}${st.side?` · Seite ${st.side} von 2`:""}</div></div>
     <div class="yring"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" class="yb"/><circle cx="50" cy="50" r="44" class="yf${prep?" yp":""}" id="yRc" stroke-dasharray="${Y_C}" stroke-dashoffset="0"/></svg><div class="t num" id="yTm"></div></div></div>
   <div class="hint"><b>Atem:</b> ${esc(p.a)}</div>
   <ol class="cues">${p.c.map(c=>`<li>${esc(c)}</li>`).join("")}</ol>
   <div class="ybtns"><button class="btn ${r.paused?"primary":""}" id="yP">${r.paused?"Weiter":"Pause"}</button>${st.side===1?`<button class="btn" id="yS">Seite wechseln</button>`:""}<button class="btn ghost" id="yN">Überspringen</button></div>`;
  attachAnim($("#ycv"),"y_"+st.k,{phaseEl:$("#yph")});
  $("#yX").onclick=yAskClose;$("#yInfo").onclick=()=>yPoseSheet(st.k);$("#yP").onclick=()=>{audio();yPauseToggle()};$("#yN").onclick=ySkip;const sb=$("#yS");if(sb)sb.onclick=ySideSwitch;
  yTick._s=null;yTick()}
function yPoseSheet(k){const p=YP[k];const inW=[];for(let w=1;w<=12;w++)if(YW[w].w.includes(k)||YW[w].m.includes(k))inW.push(w);
  openSheet(`<div class="row between"><div><div class="label">${esc(YLV[p.lv])} · ${esc(yRegName(p.r))}</div><h2 style="font-size:28px;margin-top:4px">${esc(p.n)}</h2>${p.sa?`<div class="muted" style="font-size:13px">${esc(p.sa)}</div>`:""}</div><button class="iconbtn" data-close aria-label="Schließen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
   <div class="stage"><canvas id="ysc"></canvas><span class="phase" id="ysp"></span><span class="readout">${esc(p.z.toUpperCase())}</span></div>
   <div class="tagline"><span class="tag">${p.sec} s halten</span>${p.uni?`<span class="tag">einseitig · Seite wechseln</span>`:`<span class="tag">beidseitig</span>`}${inW.length?`<span class="tag">Plan: Woche ${inW.join(", ")}</span>`:""}</div>
   <div><div class="label" style="margin-bottom:8px">So geht's</div><ol class="cues">${p.c.map(c=>`<li>${esc(c)}</li>`).join("")}</ol></div>
   <div class="hint"><b>Atem:</b> ${esc(p.a)}</div><div class="ysafe">Bei Schmerz sofort abbrechen – nur sanft dehnen.</div>`);
  attachAnim($("#ysc"),"y_"+k,{phaseEl:$("#ysp")})}
function yPlanSheet(){const c=yCur();const y=yS();
  openSheet(`<div class="row between"><h2 style="font-size:24px">Yoga · 12-Wochen-Plan</h2><button class="iconbtn" data-close aria-label="Schließen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
   <p class="muted" style="margin:0;font-size:13.5px">Eine Einheit pro Woche, am besten an einem Tag ohne Krafttraining. Aufwärmen, Hauptteil für Schultern und Hüfte, dann Endentspannung. Die nächste Stufe wird frei, wenn alle 4 Wochen der vorherigen geschafft sind.</p>
   ${[1,2,3].map(st=>{const un=yUnlocked(st);return`<div class="card${un?"":" ylock"}" data-stage="${st}"><div class="row between"><div class="label">Stufe ${st} · ${YSTAGE[st].n}</div><span class="tag">${un?yStageCount(st)+" / 4":"gesperrt"}</span></div>
     <div class="muted" style="font-size:12.5px">${un?esc(YSTAGE[st].t):`Wird freigeschaltet, wenn Stufe ${st-1} abgeschlossen ist (${yStageCount(st-1)} von 4 Einheiten).`}</div>
     ${[0,1,2,3].map(i=>{const w=(st-1)*4+1+i;const P=yPlan(w);const done=!!y.done[w];const cur=!c.complete&&w===c.week;
       const act=!un?"":cur&&!c.wait?`<button class="btn small" data-yweek="${w}">Starten</button>`:done?`<button class="btn small ghost" data-yrep="${w}">Wiederholen</button>`:cur&&c.wait?`<span class="tag">ab nächster Woche</span>`:"";
       return`<div class="ywk" data-w="${w}"><div style="min-width:0"><b>Woche ${w}${done?" ✓":""}</b> <span class="muted" style="font-size:12.5px">· ca. ${P.min} Min.</span><div class="muted" style="font-size:12px">${P.items.filter(x=>x.part==="main").map(x=>esc(YP[x.k].n)).join(" · ")}</div></div>${act}</div>`}).join("")}</div>`}).join("")}
   <button class="btn block" data-close>Schließen</button>`);
  for(const b of document.querySelectorAll("[data-yweek]"))b.onclick=()=>yStart("plan",{week:+b.dataset.yweek});
  for(const b of document.querySelectorAll("[data-yrep]"))b.onclick=()=>yStart("repeat",{week:+b.dataset.yrep})}
function yHomeCard(){const c=yCur();const r=S.yrun;const tt=trainedToday();const P=yPlan(c.week);const st=yStageOf(c.week);
  let main;
  if(r&&r.ph!=="done")main=`<div class="row between"><div><b class="ytitle">${esc(r.title)}</b><div class="muted" style="font-size:13px">läuft · Haltung ${Math.min(r.i+1,r.steps.length)} von ${r.steps.length}</div></div><button class="btn small" id="yResume">Fortsetzen</button></div>`;
  else if(c.complete)main=`<div><b class="ytitle">Plan geschafft ✓</b><div class="muted" style="font-size:13px">Alle 12 Wochen erledigt. Einheiten lassen sich im Plan wiederholen.</div></div>`;
  else if(c.wait)main=`<div><b class="ytitle">Yoga diese Woche erledigt ✓</b><div class="muted" style="font-size:13px">Woche ${c.next} von 12 ab Montag · ca. ${yPlan(c.next).min} Min.</div></div>`;
  else main=`<div class="row between"><div style="min-width:0"><b class="ytitle">Woche ${c.week} von 12 · ${YSTAGE[st].n}</b><div class="muted" style="font-size:13px">ca. ${P.min} Min. · ${tt.length?"heute lieber nur dehnen":"am besten an einem Tag ohne Krafttraining"}</div></div><button class="btn small" id="yStartBtn">Starten</button></div>`;
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
  $("#v-lib").innerHTML=`${libSeg()}<h1 style="font-size:34px">Yoga & Dehnen</h1><p class="muted" style="margin:-8px 0 0">${YKEYS.length} anfängertaugliche Haltungen, Schwerpunkt Schultern und Hüfte. Zusatz zum Krafttraining.</p>
   <div class="row" style="gap:6px;flex-wrap:wrap"><button class="btn small" id="yLibPlan">12-Wochen-Plan</button><button class="btn small ghost" id="yLibQuick">Schnell-Dehnen · 5 Min.</button></div>
   <div class="label">Stufe</div><div class="row" style="flex-wrap:wrap;gap:6px">${[0,1,2,3].map(l=>`<button class="chip" data-ylv="${l}" aria-pressed="${YLF.lv===l}">${l?YLV[l]:"Alle"}</button>`).join("")}</div>
   <div class="label">Region</div><div class="row" style="flex-wrap:wrap;gap:6px"><button class="chip" data-yr="" aria-pressed="${!YLF.r}">Alle</button>${YREG.map(([k,l])=>`<button class="chip" data-yr="${k}" aria-pressed="${YLF.r===k}">${esc(l)}</button>`).join("")}</div>
   <div class="label" id="yCount">${ks.length} Haltungen</div>
   ${ks.map(k=>{const p=YP[k];return`<button class="libitem" data-ypose="${k}"><canvas data-ymini="${k}"></canvas><span><b>${esc(p.n)}</b><small>${esc(YLV[p.lv])} · ${esc(yRegName(p.r))}${p.sa?" · "+esc(p.sa):""}</small></span><span class="sr">${p.sec} s${p.uni?" je S.":""}</span></button>`}).join("")||`<div class="empty">Keine Haltung für diese Auswahl.</div>`}
   <div class="ysafe">Bei Schmerz sofort abbrechen – nur sanft dehnen.</div>`;
  bindLibSeg();for(const c of document.querySelectorAll("[data-ymini]"))attachAnim(c,"y_"+c.dataset.ymini,{still:1});
  for(const b of document.querySelectorAll("[data-ylv]"))b.onclick=()=>{YLF.lv=+b.dataset.ylv;renderYogaLib()};
  for(const b of document.querySelectorAll("[data-yr]"))b.onclick=()=>{YLF.r=b.dataset.yr;renderYogaLib()};
  for(const b of document.querySelectorAll("[data-ypose]"))b.onclick=()=>yPoseSheet(b.dataset.ypose);
  $("#yLibPlan").onclick=yPlanSheet;$("#yLibQuick").onclick=()=>{audio();yStart("quick")}}

/* ---------- hooks into the app (wrapping, the strength code stays untouched) ---------- */
{const st=document.createElement("style");st.textContent=`
.ysafe{font-size:12.5px;color:#f5c26b;border:1px solid rgba(245,183,46,.35);background:rgba(245,183,46,.06);border-radius:4px;padding:6px 10px;text-align:center}
.ystage canvas{height:min(42vh,290px)}
.yring{position:relative;width:112px;height:112px;flex:none}
.yring svg{width:100%;height:100%;transform:rotate(-90deg)}
.yring circle{fill:none;stroke-width:7}.yring .yb{stroke:rgba(62,230,255,.13)}.yring .yf{stroke:var(--arc);filter:drop-shadow(0 0 5px var(--arc));transition:stroke-dashoffset .25s linear}.yring .yf.yp{stroke:var(--gold);filter:none}
.yring .t{position:absolute;inset:0;display:grid;place-items:center;font-size:28px;font-weight:700}
.ybtns{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:8px;margin-top:auto}
.ycard .ytitle{font-family:var(--display);font-size:17px;letter-spacing:.04em;text-transform:uppercase}
.ywk{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--line)}
.ylock{opacity:.55}
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
  const _res=window.appResume;window.appResume=function(){_res();if(S.yrun&&!$("#yoga").hidden){yTick();nativeState(true)}};
  const _bk=openBackup;openBackup=function(){_bk();const y=yS();const p=[...document.querySelectorAll("#sheet p.muted")].pop();if(p)p.textContent+=` · ${y.log.length} Yoga-Einheiten (Plan: ${Object.keys(y.done).length}/12 Wochen)`}}
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
