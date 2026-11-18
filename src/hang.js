/* ================= 3.3 · GRIFFKRAFT & HÄNGEN (@ Joschy) =================
   Ziel: von < 10 s auf 1–2 Minuten frei hängen.
   · Zieh-Tag (B): Block "Griffkraft & Hängen" nach den Hauptübungen, vor den Bonus-Finishern. 4 Stufen:
       1 Hängen mit Fußstütze → 2 aktives Schulterblatt-Hängen (5 × 10 s) → 3 freies Hängen (Zeit steigt) → 4 Handtuch-Hang.
   · Beintag (C): Farmer's Hold auf Zeit (Kurzhanteln → Kettlebells → Taschen/Kanister, je nach Geräten).
   · Steigerung (konservativ): alle Sätze ≥ Zielzeit und nicht "hart" → +5 s; oben in der Stufe → nächste Stufe.
     Zweimal das Ziel verfehlt → −5 s, auf der Mindestzeit → eine Stufe zurück. Entlastung, Wiedereinstieg und Kurz-Training ändern nichts.
     Der Stand wird jedes Mal aus dem Verlauf berechnet (keine zweite Wahrheit, Backups bleiben stimmig); S.hang.base = manuell gewählte Startstufe.
   · Hang-Test alle 4 Wochen (1 Versuch, max. Zeit frei hängend) → S.hang.tests, Kurve im Verlauf (Ziellinien 60 s / 120 s).
   · Hang-Pause an freien Tagen (3 × 10 s), freiwillig → S.hang.pauses, zählt nicht als Training.
   Die Items tragen fin:true + blk ("hang" / "grip"): sie fallen beim Kurz-Training weg, werden nie gekürzt und nie getauscht. */
const HG_KEYS=["hangsupp","scaphang","deadhang","towelhang"];
const GRIP_KEYS=["farmerhold","kbfarmhold","jughold"];
const HG_ALL=[...HG_KEYS,...GRIP_KEYS];
const HG_ST=[null,
  {k:"hangsupp",n:"Hängen mit Fußstütze",sets:3,start:15,min:10,top:45,step:5,t:"Füße auf Stuhl oder Kiste, die Arme tragen nur einen Teil des Gewichts. Gewöhnt Hände, Sehnen und Schultern ans Hängen."},
  {k:"scaphang",n:"Aktives Schulterblatt-Hängen",sets:5,start:10,min:10,top:20,step:5,t:"Frei hängen, Arme gestreckt, Schultern aktiv nach unten ziehen. Kurze Sätze, schützt die Schulter."},
  {k:"deadhang",n:"Freies Hängen",sets:3,start:15,min:10,top:60,step:5,t:"Längere Sätze frei hängend. Die Zeit steigt automatisch, sobald alle Sätze geschafft sind."},
  {k:"towelhang",n:"Handtuch-Hang",sets:3,start:10,min:10,top:30,step:5,t:"An zwei Handtüchern hängen: maximale Griffkraft. Endstufe, dazu alle 4 Wochen der Hang-Test."}];
const GR={sets:2,start:30,min:20,top:60,step:5};
const HG_TEST_DAYS=28,HG_PAUSE={n:3,hold:10,rest:30,prep:5};
const HG_SAFE="Bei Schmerzen in Schulter, Ellbogen oder Handgelenk sofort loslassen und abbrechen. Kontrolliert ein- und aussteigen (Füße auf Stuhl oder Kiste), nie ruckartig fallen lassen.";
const HG_WARN="Schulter & Gelenke: Bei Schmerz sofort loslassen und abbrechen. Kein Ruck, kein Schwingen.";
var HG_ON=false;/* var: planItems() may run before this block (very old running session at boot) – then without the block */

/* ---------- exercises ---------- */
Object.assign(EX,{
  hangsupp:{n:"Hängen mit Fußstütze",eq:"Klimmzugstange · Stuhl oder Kiste",m:"Griffkraft · Unterarme · Schultern",type:"time",rest:60,inc:0,
    cues:["Stuhl oder Kiste vor die Stange stellen","Stange schulterbreit im Obergriff fassen","Füße auf dem Stuhl lassen, Knie gebeugt","Nur so viel Gewicht an die Hände geben, wie es sich gut anfühlt"],
    bad:["Schultern hängen ganz locker bis zu den Ohren","Mit den Füßen abspringen statt ruhig umzusetzen"],safe:HG_SAFE,note:"Stufe 1 von 4: Schritt für Schritt mehr Gewicht an die Arme, die Füße bleiben die Sicherung."},
  scaphang:{n:"Aktives Schulterblatt-Hängen",eq:"Klimmzugstange · Stuhl zum Aufsteigen",m:"Griffkraft · Schulterblätter · Lat",type:"time",rest:45,inc:0,
    cues:["Frei hängen, Arme gestreckt","Schultern weg von den Ohren nach unten ziehen","Brust leicht nach vorn, Körper ruhig","Spannung halten, nicht die Arme beugen"],
    bad:["Arme beugen (wird zum Klimmzug)","Schultern fallen zurück zu den Ohren","Schwingen"],safe:HG_SAFE,note:"Stufe 2 von 4: kurze, aktive Sätze. Die Schulter bleibt stabil, das schützt sie beim späteren langen Hängen."},
  deadhang:{n:"Freies Hängen",eq:"Klimmzugstange · Stuhl zum Aufsteigen",m:"Griffkraft · Unterarme · Schultern",type:"time",rest:75,inc:0,
    cues:["Über den Stuhl an die Stange, schulterbreiter Obergriff","Ganze Hand um die Stange, Daumen mit herum","Schultern leicht aktiv, Körper ruhig","Ruhig weiteratmen, vor dem Loslassen Füße zurück auf den Stuhl"],
    bad:["Schwingen und Strampeln","Ganz passiv in die Schultern sacken","Abspringen und hart landen"],safe:HG_SAFE,note:"Stufe 3 von 4: die Zeit steigt automatisch, wenn alle Sätze geschafft sind."},
  towelhang:{n:"Handtuch-Hang",eq:"Klimmzugstange · 2 Handtücher",m:"Griffkraft · Unterarme · Finger",type:"time",rest:75,inc:0,
    cues:["Zwei feste Handtücher über die Stange hängen","Je ein Handtuch mit einer Hand fest umgreifen","Über den Stuhl einsteigen, dann frei hängen","Schultern aktiv, ruhig atmen"],
    bad:["Dünne oder rutschige Handtücher","Ruckartig einsteigen","Ellbogen stark beugen"],safe:HG_SAFE+" Handtücher vorher auf festen Sitz prüfen.",note:"Stufe 4 von 4: die schwerste Griffvariante."},
  farmerhold:{n:"Farmer's Hold",eq:"Kurzhanteln",m:"Griffkraft · Unterarme · Rumpf",type:"time",rest:60,inc:2,
    cues:["Zwei schwere Kurzhanteln seitlich halten","Aufrecht stehen, Schultern nach hinten-unten","Bauch fest, ruhig atmen","Hanteln am Ende kontrolliert absetzen, Rücken gerade"],
    bad:["Schultern hängen nach vorn","Hanteln mit rundem Rücken aufheben"],safe:"Hanteln aus den Knien aufheben und absetzen. Bei Schmerz in Schulter, Ellbogen oder Handgelenk abbrechen.",note:"Zeit steigt um 5 s pro Einheit, ab 60 s geht es mit schwereren Hanteln wieder bei 30 s los."},
  kbfarmhold:{n:"Farmer's Hold mit Kettlebells",eq:"Kettlebells",m:"Griffkraft · Unterarme · Rumpf",type:"time",rest:60,inc:4,
    cues:["Zwei schwere Kettlebells seitlich halten","Aufrecht stehen, Schultern nach hinten-unten","Bauch fest, ruhig atmen","Kettlebells kontrolliert absetzen, Rücken gerade"],
    bad:["Schultern hängen nach vorn","Kettlebells schlagen gegen die Beine"],safe:"Kettlebells aus den Knien aufheben und absetzen. Bei Schmerz in Schulter, Ellbogen oder Handgelenk abbrechen.",note:"Zeit steigt um 5 s pro Einheit, ab 60 s kommt die nächste Kettlebell."},
  jughold:{n:"Farmer's Hold mit Taschen",eq:"Wasserkanister oder gefüllte Taschen",m:"Griffkraft · Unterarme · Rumpf",type:"time",rest:60,inc:0,wOpt:1,daily:"Wasserkanister oder gefüllte Einkaufstaschen",
    cues:["Zwei Wasserkanister oder schwer gefüllte Taschen nehmen","Seitlich halten, aufrecht stehen","Schultern nach hinten-unten, Bauch fest","Am Ende kontrolliert absetzen"],
    bad:["Henkel schneiden ein: Handtuch um den Griff","Oberkörper kippt zur Seite"],safe:"Henkel und Taschen vorher prüfen. Bei Schmerz in Schulter, Ellbogen oder Handgelenk abbrechen.",note:"Ohne Hanteln: Kanister oder Taschen. Wird es leicht, die Taschen schwerer packen."}
});
CATS.push(["griff","Griffkraft & Hängen"]);
for(const k of HG_ALL){CAT[k]="griff";SUB[k]="grip";MG_OF[k]=null}
Object.assign(NEEDS,{hangsupp:[["pullbar"],["rack"]],scaphang:[["pullbar"],["rack"]],deadhang:[["pullbar"],["rack"]],towelhang:[["pullbar"],["rack"]],farmerhold:[["db"]],kbfarmhold:[["kb"]]});

/* ---------- animations (motion engine; hang = anchored at the hands like the pull-up) ---------- */
/* towel: one strip per hand, folded over the bar, the end hangs below the fist (drawn behind the body) */
if(typeof EXTRA_EQ_LAYER!=="undefined")EXTRA_EQ_LAYER.towel="back";
{const _d=drawExtraEq;drawExtraEq=function(ctx,e,o,P,R,fl,front){if(e.t!=="towel")return _d(ctx,e,o,P,R,fl,front);
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  for(const[hk,dx]of[["hand2",-2.2],["hand",2.2]]){const h=o[hk];if(!h)continue;const x0=h[0]+dx*.4;
    const pts=[[x0-2.6,2.2],[x0,3.4],[x0+2.6,2.2],[h[0]+1.6,h[1]+6],[h[0]+.8,h[1]],[h[0]+.4,h[1]-9]];
    const pp=pts.map(P);ctx.strokeStyle="#8f8676";ctx.lineWidth=Math.max(2,R(5.2));ctx.beginPath();ctx.moveTo(pp[0][0],pp[0][1]);ctx.quadraticCurveTo(pp[1][0],pp[1][1]-R(1.5),pp[2][0],pp[2][1]);
    ctx.lineTo(pp[3][0],pp[3][1]);ctx.lineTo(pp[4][0],pp[4][1]);ctx.lineTo(pp[5][0],pp[5][1]);ctx.stroke();
    ctx.strokeStyle=hk==="hand"?"#e9e1cf":"#cbbfa6";ctx.lineWidth=Math.max(1.4,R(4));ctx.stroke();
    ctx.strokeStyle="rgba(120,90,60,.45)";ctx.lineWidth=Math.max(.6,R(.7));ctx.setLineDash([R(1.6),R(1.6)]);ctx.beginPath();ctx.moveTo(pp[3][0],pp[3][1]);ctx.lineTo(pp[5][0],pp[5][1]);ctx.stroke();ctx.setLineDash([])}
  ctx.restore()}}
{const _b=extraBounds;extraBounds=function(e,o,inc){if(e.t==="towel"){for(const hk of["hand","hand2"]){const h=o[hk];if(h){inc([h[0],4],4);inc([h[0],h[1]-10],4)}}return}return _b(e,o,inc)}}
/* active shoulder blades: an optional pose field "scap" adds to the computed elevation (negative = pulled down, body rises) */
{const _sc=scapOf;scapOf=function(def,p,o){const r=_sc(def,p,o);if(typeof p.scap==="number")r[0]+=p.scap;return r}}
{const HANG={upper:90,fore:90,torso:90,thigh:-95,shin:-100,foot:-60};
  const HOLD_UP={upper:-92,fore:-90,upper2:-88,fore2:-90};
  /* chair under the feet: seat top at y, legs down to the floor; back rest on the far side */
  const SY=-182.5,FL=SY-44;
  Object.assign(AN,{
    hangsupp:{anchor:"hand",A:{upper:90,fore:90,torso:93,thigh:-12,shin:-92,foot:2,neck:-2,scap:0},B:{upper:90,fore:90,torso:92,thigh:-13,shin:-93,foot:1,neck:-2,scap:-1.5},
      eq:[{t:"bar"},{t:"box",x:34,w:44,y:SY},{t:"chairback",x:76,y:SY,side:"r",h:40,lean:3}],floor:FL,tempo:[2,1,2,1],ph:["Halten","Atmen"],spine:[.9,.5]},
    scaphang:{anchor:"hand",A:{...HANG,scap:0},B:{upper:90,fore:90,torso:87,thigh:-91,shin:-97,foot:-58,scap:-7},eq:[{t:"bar"}],floor:null,tempo:[1.2,2,1.2,1],hseg:1,ph:["Schultern runter","Lösen","Aktiv halten"],spine:[.9,.5]},
    deadhang:{anchor:"hand",A:{...HANG,scap:-1},B:{upper:90,fore:90,torso:89,thigh:-93,shin:-99,foot:-58,scap:-2},eq:[{t:"bar"}],floor:null,tempo:[2,1,2,1],ph:["Halten","Atmen"],spine:[.9,.5]},
    towelhang:{anchor:"hand",at:[0,-24],A:{upper:91,fore:90,torso:90,thigh:-95,shin:-100,foot:-60,scap:-1},B:{upper:91,fore:90,torso:89,thigh:-93,shin:-99,foot:-58,scap:-2},eq:[{t:"bar"},{t:"towel"}],floor:null,tempo:[2,1,2,1],ph:["Halten","Atmen"],spine:[.9,.5]},
    farmerhold:{anchor:"foot",A:{...STAND,...HOLD_UP},B:{...STAND,torso:87.4,...HOLD_UP},eq:[{t:"db",at:"hand"},{t:"db",at:"hand2"}],floor:0,tempo:[2,1,2,1],ph:["Halten","Atmen"]},
    kbfarmhold:{anchor:"foot",A:{...STAND,...HOLD_UP},B:{...STAND,torso:87.4,...HOLD_UP},eq:[{t:"kb",at:"hand",off:[0,-8]},{t:"kb",at:"hand2",off:[0,-8]}],floor:0,tempo:[2,1,2,1],ph:["Halten","Atmen"]},
    jughold:{anchor:"foot",A:{...STAND,...HOLD_UP},B:{...STAND,torso:87.4,...HOLD_UP},eq:[{t:"pack",at:"hand",w:11,h:19,dy:12,col:"#5d8fb8"},{t:"pack",at:"hand2",w:11,h:19,dy:12,col:"#4f7ea3"}],floor:0,tempo:[2,1,2,1],ph:["Halten","Atmen"]}
  })}

/* ---------- state ---------- */
function hgNorm(h){const o={v:1,tests:[],pauses:[],base:null};if(!h||typeof h!=="object"||Array.isArray(h))return o;
  const by=(a,f)=>{const m={};for(const x of Array.isArray(a)?a:[]){const y=f(x);if(y)m[y.d]=y}return Object.values(m).sort((p,q)=>p.d<q.d?-1:p.d>q.d?1:0)};
  o.tests=by(h.tests,x=>x&&typeof x==="object"&&validDk(x.d)&&isFinite(+x.s)&&+x.s>=0&&+x.s<=1800&&x.s!==""&&x.s!==null?{d:x.d,s:Math.round(+x.s)}:null).slice(-200);
  o.pauses=by(h.pauses,x=>x&&typeof x==="object"&&validDk(x.d)&&Number.isInteger(+x.n)&&+x.n>=1&&+x.n<=20&&x.n!==""&&x.n!==null?{d:x.d,n:+x.n}:null).slice(-400);
  const b=h.base;if(b&&typeof b==="object"&&!Array.isArray(b)&&[1,2,3,4].includes(b.stage)&&Number.isInteger(b.sec)&&b.sec>=5&&b.sec<=120&&typeof b.at==="string"&&isFinite(new Date(b.at).getTime()))o.base={stage:b.stage,sec:b.sec,at:b.at};
  return o}
function hgS(){if(!S.hang||S.hang.v!==1||!Array.isArray(S.hang.tests)||!Array.isArray(S.hang.pauses))S.hang=hgNorm(S.hang);return S.hang}
/* migration (idempotent): old states get an empty S.hang; a valid one stays byte-identical */
{const n=hgNorm(S.hang);if(JSON.stringify(n)!==JSON.stringify(S.hang)){S.hang=n;save()}}

/* history occurrences of the given exercises, oldest first */
function hgOcc(keys,after){const out=[];(Array.isArray(S.history)?S.history:[]).forEach((h,i)=>{if(!h||typeof h!=="object"||!Array.isArray(h.log))return;const t=new Date(h.date).getTime();if(!isFinite(t)||(after!=null&&t<=after))return;
  for(const l of h.log)if(l&&keys.includes(l.ex)&&Array.isArray(l.sets))out.push({h,l,t,i})});return out.sort((a,b)=>a.t-b.t||a.i-b.i)}
const hgSecs=l=>l.sets.filter(s=>sDone(s)).map(s=>Math.max(0,Math.round(+s.r||0)));
/* hang ladder, replayed from the history */
function hangState(){const H=hgS();const b=H.base;let st={stage:b?b.stage:1,sec:b?b.sec:HG_ST[1].start,miss:0,n:0,ev:null,last:null};
  for(const o of hgOcc(HG_KEYS,b?new Date(b.at).getTime():null)){const D=HG_ST[st.stage];const r=hgSecs(o.l);st.last={r,eff:effOf(o.l),t:o.t,ex:o.l.ex,sec:st.sec,stage:st.stage};st.n++;
    if(o.h.deload||o.h.reentry||o.h.quick||!r.length){st.ev="skip";continue}
    const hit=r.length>=D.sets&&r.every(x=>x>=st.sec);const eff=effOf(o.l);
    if(hit&&eff!=="hard"){st.miss=0;if(st.sec>=D.top){if(st.stage<4){st.stage++;st.sec=HG_ST[st.stage].start;st.ev="up"}else st.ev="top"}else{st.sec=Math.min(D.top,st.sec+D.step);st.ev="plus"}}
    else if(hit){st.miss=0;st.ev="hard"}
    else{st.miss++;st.ev="miss";if(st.miss>=2){st.miss=0;if(st.sec>D.min){st.sec=Math.max(D.min,st.sec-D.step);st.ev="minus"}else if(st.stage>1){st.stage--;const P=HG_ST[st.stage];st.sec=Math.max(P.min,P.top-10);st.ev="down"}else st.ev="miss2"}}}
  return st}
function gripKey(){return GRIP_KEYS.find(k=>canDo(k))||"jughold"}
function gripStartW(k){const e=EX[k];if(e.wOpt)return 0;const t=Math.max(6,bodyKg()*.2);const L=wList(k);return L?snapW(L,t):Math.round(t)}
/* farmer's hold: seconds first (30 → 60 s), then the next weight from 30 s again */
function gripState(k){let st={sec:GR.start,w:gripStartW(k),miss:0,n:0,ev:null,last:null,cap:false};const e=EX[k];
  for(const o of hgOcc([k])){const r=hgSecs(o.l);const wu=Math.max(0,...o.l.sets.filter(s=>sDone(s)).map(s=>+s.w||0));st.last={r,eff:effOf(o.l),t:o.t,w:wu,sec:st.sec};st.n++;
    if(wu>0||e.wOpt)st.w=wu;
    if(o.h.deload||o.h.reentry||o.h.quick||!r.length){st.ev="skip";continue}
    const hit=r.length>=GR.sets&&r.every(x=>x>=st.sec);const eff=effOf(o.l);st.cap=false;
    if(hit&&eff!=="hard"){st.miss=0;if(st.sec>=GR.top){const nw=e.wOpt||!(st.w>0)?null:wUp(k,st.w,1);if(nw!=null&&nw>st.w+1e-9){st.w=nw;st.sec=GR.start;st.ev="wup"}else{st.ev="top";st.cap=true}}else{st.sec=Math.min(GR.top,st.sec+GR.step);st.ev="plus"}}
    else if(hit){st.miss=0;st.ev="hard"}
    else{st.miss++;st.ev="miss";if(st.miss>=2){st.miss=0;if(st.sec>GR.min){st.sec=Math.max(GR.min,st.sec-GR.step);st.ev="minus"}else if(st.w>0&&!e.wOpt){const nw=wFloor(k,st.w-Math.max(e.inc||2,st.w*.1));if(nw<st.w-1e-9){st.w=nw;st.sec=GR.start;st.ev="wdown"}}}}}
  return st}
function hgLastTest(){const T=hgS().tests;return T.length?T[T.length-1]:null}
function hgDaysTo(){const l=hgLastTest();if(!l)return 0;return Math.max(0,HG_TEST_DAYS-Math.floor((dT(todayKey())-dT(l.d))/864e5))}
function hgTestDue(){return canDo("deadhang")&&hgDaysTo()<=0}
function hgPauseKey(stage){return stage<=1?"hangsupp":stage===2?"scaphang":"deadhang"}

/* ---------- plan: block after the main exercises, before the bonus finishers ---------- */
function hangMix(day,items){if(!HG_ON||!Array.isArray(items))return items;let blk=null;
  if(day==="B"&&canDo("deadhang")){const st=hangState();const D=HG_ST[st.stage];blk={ex:D.k,sets:D.sets,lo:st.sec,hi:st.sec,fin:true,blk:"hang",stage:st.stage}}
  else if(day==="C"){const k=gripKey();const g=gripState(k);blk={ex:k,sets:GR.sets,lo:g.sec,hi:g.sec,fin:true,blk:"grip"}}
  if(!blk)return items;const out=items.map(x=>({...x}));let at=out.findIndex(x=>x.fin);if(at<0)at=out.length;out.splice(at,0,blk);return out.map((x,i)=>({...x,slot:i}))}
const hgList=r=>r.map(x=>x+" s").join(" / ");
function hangWhy(it){const st=hangState();const D=HG_ST[st.stage];const tgt=`<b>${D.sets} × ${st.sec} s</b>`;const L=st.last;const n=`Stufe ${st.stage} von 4`;
  switch(st.ev){
    case null:return`${n}: <b>${esc(D.n)}</b>. Ziel heute: ${tgt}. Schaffst du alle Sätze, kommen beim nächsten Mal 5 s dazu.`;
    case"plus":return`Letztes Mal alle Sätze geschafft (${hgList(L.r)}). Heute <b>+5 s</b>: ${tgt}.`;
    case"up":return`<b>Neue Stufe!</b> ${n}: <b>${esc(D.n)}</b>, Start mit ${tgt}. ${esc(D.t)}`;
    case"top":return`Endstufe geschafft (${hgList(L.r)}). ${tgt} halten und alle 4 Wochen beim Hang-Test schauen, wie lange du frei hängst.`;
    case"hard":return`Alle Sätze geschafft, aber hart: <b>Zeit halten</b> (${tgt}) und festigen.`;
    case"miss":return`Ziel letztes Mal verfehlt (${hgList(L.r)}): gleiche Zeit, ${tgt}. Lieber sauber und ruhig halten.`;
    case"minus":return`<b>−5 s</b>, weil zweimal das Ziel verfehlt. Heute ${tgt}, dann wieder aufbauen.`;
    case"down":return`<b>Eine Stufe zurück</b> (${n}: ${esc(D.n)}), weil zweimal das Ziel verfehlt. Heute ${tgt}, in Ruhe neu aufbauen.`;
    case"miss2":return`Noch einmal ${tgt}. Kurz und sauber ist besser als lang und verkrampft.`;
    default:return`${n}: <b>${esc(D.n)}</b>. Ziel heute: ${tgt}.`}}
function gripWhy(it){const k=it.ex;const e=EX[k];const st=gripState(k);const kg=st.w>0?`, <b>${fmtKg(st.w)} kg je Hand</b>`:"";const tgt=`<b>${GR.sets} × ${st.sec} s</b>${kg}`;const L=st.last;
  switch(st.ev){
    case null:return e.wOpt?`Farmer's Hold mit Kanistern oder Taschen: ${tgt}. Gewicht in kg ist freiwillig. Schaffst du alle Sätze, kommen 5 s dazu.`
      :`Farmer's Hold: schwer halten, ruhig atmen. Start: ${tgt}. Schaffst du alle Sätze, kommen 5 s dazu, ab ${GR.top} s geht's schwerer weiter.`;
    case"plus":return`Letztes Mal alle Sätze geschafft (${hgList(L.r)}). Heute <b>+5 s</b>: ${tgt}.`;
    case"wup":return`<b>${GR.top} s geschafft:</b> heute schwerer, ${tgt}, wieder ab ${GR.start} s.`;
    case"top":return`<b>${GR.top} s geschafft.</b> ${e.wOpt?"Pack die Taschen oder Kanister etwas schwerer":"Schwerer geht mit deiner Ausstattung nicht"} – heute ${tgt}.`;
    case"hard":return`Alle Sätze geschafft, aber hart: <b>Zeit halten</b>, ${tgt}.`;
    case"miss":return`Ziel letztes Mal verfehlt (${hgList(L.r)}): gleiche Zeit, ${tgt}.`;
    case"minus":return`<b>−5 s</b>, weil zweimal das Ziel verfehlt: ${tgt}.`;
    case"wdown":return`<b>Leichter</b>, weil zweimal das Ziel verfehlt: ${tgt}, neu aufbauen.`;
    default:return`Heute ${tgt}.`}}
{const _sg=suggest;suggest=function(item){if(item&&HG_KEYS.includes(item.ex))return{w:0,last:[],dr:0,mode:"hang",up:["plus","up"].includes(hangState().ev),why:hangWhy(item)};
  if(item&&GRIP_KEYS.includes(item.ex)){const g=gripState(item.ex);return{w:g.w,last:[],dr:0,mode:"grip",up:["plus","wup"].includes(g.ev),why:gripWhy(item)}}
  return _sg(item)}}
/* farmer's hold with dumbbells: weights from the dumbbell list (if any) */
{const _wg=wGearOf;wGearOf=function(k){if(k==="farmerhold")return"db";return _wg(k)}}
/* block items: never swapped, never replaced by a cardio finisher */
{const _sp=swapPool;swapPool=function(it,day){if(it&&it.blk)return[it.ex];return _sp(it,day)}}
{const _as=adaptSession;adaptSession=function(){const ss=S.session;if(!ss||!Array.isArray(ss.items)||!Array.isArray(ss.log))return _as();let ch=false;const hold=[];
  ss.items.forEach((it,i)=>{if(!it||!it.blk)return;const lg=ss.log[i];const any=lg&&Array.isArray(lg.sets)&&lg.sets.some(x=>x&&x.done);
    if(!canDo(it.ex)&&!any){const k=it.blk==="grip"?gripKey():null;if(k&&k!==it.ex){const g=gripState(k);const ni={...it,ex:k,lo:g.sec,hi:g.sec};delete ni.noGear;ss.items[i]=ni;ss.log[i]={ex:k,sets:initSets(ni,suggest(ni))};if(i===ss.ei){ss.si=0;ss.annEi=null}ch=true}
      else if(!it.noGear){it.noGear=true;ch=true}}else if(canDo(it.ex)&&it.noGear){delete it.noGear;ch=true}
    hold.push([i,ss.items[i]]);ss.items[i]={ex:"__hg"}});
  let r;try{r=_as()}finally{for(const[i,it]of hold)ss.items[i]=it}return r||ch}}
HG_ON=true;

/* ---------- training screen ---------- */
{const _wv=workView;workView=function(){let h=_wv();const ss=S.session;const it=ss&&ss.items[ss.ei];if(!it||!HG_ALL.includes(it.ex))return h;
  if(GRIP_KEYS.includes(it.ex))h=h.replace('Zusatz kg <small class="opt">optional</small>',EX[it.ex].wOpt?'kg je Hand <small class="opt">optional</small>':"kg je Hand");
  let x="";const hang=HG_KEYS.includes(it.ex);
  /* 3.3 (@ Joschy): hanging is body weight only – no "Zusatz kg" stepper, the seconds stepper takes the full width */
  h=h.replace(/<span class="tempo">[^<]*<\/span>/,`<span class="tempo">${it.hi} s</span>`);/* 3.3: hold time instead of the 2s · 2s tempo */
  if(hang)h=h.replace(/<div class="steppers">\s*<div class="stepper"><span class="label">Zusatz kg[\s\S]*?<\/div><\/div>/,'<div class="steppers" style="grid-template-columns:1fr">');
  if(ss.si===0&&it.blk)x+=`<div class="hint" id="hgHint"><b>Griffkraft & Hängen:</b> ${hang?"Zeit läuft mit dem Halte-Timer. Stopp, sobald du loslassen musst: die Sekunden werden eingetragen.":"Halte-Timer starten, Hanteln ruhig halten."}</div>`;
  if(hang&&ss.si===0&&hgTestDue())x+=`<div class="hint" id="hgTestHint"><b>Hang-Test fällig</b> (alle 4 Wochen): 1 Versuch, so lange wie möglich frei hängen. Am besten jetzt, vor dem ersten Satz. <button class="btn small" id="hgTestW" style="margin-top:6px">Hang-Test starten</button></div>`;
  x+=`<div class="ywarn" id="hgWarnT" role="note">${esc(HG_WARN)}</div>`;
  const m='<div class="row" style="flex-wrap:wrap;gap:8px">';return h.includes(m)?h.replace(m,x+m):h+x}}
{const _bw=bindWork;bindWork=function(){_bw();const b=$("#hgTestW");if(b)b.onclick=()=>hgRun("test")}}
/* exercise details: stage tag + shoulder warning */
{const _oe=openExSheet;openExSheet=function(key){_oe(key);if(!HG_ALL.includes(key))return;const tl=$("#sheet .tagline");
  const tag=HG_KEYS.includes(key)?(i=>`Zieh-Tag · Stufe ${i} von 4${canDo(key)&&hangState().stage===i?" · aktuell":""}`)(HG_KEYS.indexOf(key)+1):`Beintag · Griffkraft${canDo(key)&&gripKey()===key?" · aktuell":""}`;
  if(tl)tl.insertAdjacentHTML("beforeend",`<span class="tag" id="hgTag">${esc(tag)}</span>`);
  /* 3.3 (@ Joschy): hold exercises have no lowering/lifting tempo – the stage shows the hold time instead */
  const tp=$("#sheet .stage .tempo"),ro=$("#sheet .stage .readout");if(tp)tp.remove();if(ro)ro.textContent=`HALTEN · ${hgHoldLabel(key)}`;
  $("#sheet").insertAdjacentHTML("beforeend",`<div class="ywarn" id="hgWarn" role="alert"><b>Achtung Schulter & Gelenke:</b> Bei Schmerz in Schulter, Ellbogen oder Handgelenk sofort abbrechen. Du hattest Schulterprobleme: lieber kürzer und sauber als lang und verkrampft. Nie ruckartig einsteigen oder abspringen.</div>`)}}

function hgHoldLabel(key){if(HG_KEYS.includes(key)){const i=HG_KEYS.indexOf(key)+1,D=HG_ST[i],st=hangState();return st.stage===i&&canDo(key)?`${D.sets} × ${st.sec} s`:`${D.sets} × ${D.start}–${D.top} s`}
  return gripKey()===key&&canDo(key)?`${GR.sets} × ${gripState(key).sec} s`:`${GR.sets} × ${GR.start}–${GR.top} s`}

/* ---------- mini runner in a sheet: hang test (count up, 1 attempt) and hang pause (3 × 10 s) ---------- */
let HGR=null;
function hgRun(kind){audio();const st=hangState();const ak=kind==="test"?"deadhang":hgPauseKey(st.stage);
  HGR={kind,ak,ph:"ready",i:0,end:0,t0:0,res:null,done:0,cd:null};const test=kind==="test";
  openSheet(`<div class="row between"><div><div class="label">${test?"Alle 4 Wochen · 1 Versuch":"Freier Tag · freiwillig"}</div><h2 style="font-size:26px;margin-top:4px">${test?"Hang-Test":"Hang-Pause"}</h2></div><button class="iconbtn" data-close aria-label="Schließen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
   <div class="stage"><canvas id="hgc"></canvas><span class="phase" id="hgph"></span><span class="readout">${test?"FREI HÄNGEN · MAX. ZEIT":esc(EX[ak].n.toUpperCase())}</span></div>
   <div class="hgrun"><div class="label" id="hgLbl"></div><div class="num" id="hgT"></div>${test?"":`<div class="hgdots" id="hgDots"></div>`}</div>
   <p class="muted" id="hgTxt" style="margin:0;font-size:13.5px"></p>
   <div class="ywarn" role="note">${esc(HG_WARN)}</div>
   <div id="hgBtns" class="ybtns"></div>`);
  attachAnim($("#hgc"),ak,{phaseEl:$("#hgph")});hgRunRender()}
function hgRunRender(){const r=HGR;if(!r||!$("#hgBtns"))return;const test=r.kind==="test";const lbl=$("#hgLbl"),tx=$("#hgTxt"),bt=$("#hgBtns");
  const B=(id,t,p)=>`<button class="btn ${p?"primary":""}" id="${id}">${t}</button>`;
  if(r.ph==="ready"){lbl.textContent="Bereit";$("#hgT").textContent=test?"0:00":HG_PAUSE.hold+" s";
    tx.innerHTML=test?"Stuhl unter die Stange, schulterbreit greifen. Nach dem Start zählt die Uhr 3 Sekunden runter, dann frei hängen, so lange es sauber geht. <b>Nur ein Versuch.</b>":`${HG_PAUSE.n} × ${HG_PAUSE.hold} s ${esc(EX[r.ak].n)} mit ${HG_PAUSE.rest} s Pause. Freiwillig, zählt nicht als Training.`;
    bt.innerHTML=B("hgGo","Start",1)}
  else if(r.ph==="result"){lbl.textContent="Ergebnis";$("#hgT").textContent=mmss(r.res);const b=hgS().tests.reduce((m,x)=>Math.max(m,x.s),0);
    tx.innerHTML=`Du hast <b>${r.res} s</b> frei gehangen.${b?` Bisheriger Bestwert: ${b} s.`:" Das ist dein Startwert."} Ziel: 60 s, dann 120 s.`;bt.innerHTML=B("hgSave","Speichern",1)+B("hgDrop","Verwerfen")}
  else if(r.ph==="done"){lbl.textContent="Geschafft";$("#hgT").textContent="✓";tx.innerHTML=`${r.done} von ${HG_PAUSE.n} Halten erledigt. Gut für Griff und Sehnen – zählt nicht als Training.`;bt.innerHTML=B("hgOk","Fertig",1)}
  else{bt.innerHTML=test&&r.ph==="run"?B("hgStop","Losgelassen · Stopp",1):B("hgStop","Stopp")}
  const d=$("#hgDots");if(d)d.innerHTML=Array.from({length:HG_PAUSE.n},(_,i)=>`<i class="${i<r.done?"on":""}${i===r.done&&r.ph==="hold"?" cur":""}"></i>`).join("");
  const on=(id,f)=>{const e=$("#"+id);if(e)e.onclick=f};
  on("hgGo",()=>{audio();r.ph="prep";r.end=Date.now()+(test?3:HG_PAUSE.prep)*1000;hgRunRender();hgTick();clearInterval(holdT);holdT=setInterval(hgTick,200)});
  on("hgStop",()=>{clearInterval(holdT);if(test){if(r.ph==="run"){r.res=Math.max(0,Math.round((Date.now()-r.t0)/1000));r.ph="result";beep(990,.3);vib(200)}else{r.ph="ready"}hgRunRender()}else hgPauseEnd()});
  on("hgSave",()=>{const H=hgS();const d=todayKey();H.tests=H.tests.filter(x=>x.d!==d);H.tests.push({d,s:r.res});H.tests.sort((a,b)=>a.d<b.d?-1:1);save();HGR=null;closeSheet();hgRefresh();toast(`Hang-Test gespeichert: ${r.res} s`)});
  on("hgDrop",()=>{HGR=null;closeSheet();toast("Test verworfen")});
  on("hgOk",()=>{HGR=null;closeSheet();hgRefresh()});
  hgTick()}
function hgTick(){const r=HGR;const t=$("#hgT"),lbl=$("#hgLbl");if(!r||!t){clearInterval(holdT);return}const now=Date.now();const test=r.kind==="test";
  if(r.ph==="prep"){const left=(r.end-now)/1000;if(left<=0){if(test){r.ph="run";r.t0=r.end;beep(990,.25);vib(120)}else{r.ph="hold";r.end+=HG_PAUSE.hold*1000;beep(880,.15);vib(80)}hgRunRender();return}
    lbl.textContent=test?"Greif die Stange":"Gleich: "+EX[r.ak].n;const s=Math.ceil(left);t.textContent=s;if(s!==r.cd){r.cd=s;if(s<=3)beep(660,.08)}return}
  if(r.ph==="run"){lbl.textContent="Frei hängen";t.textContent=mmss((now-r.t0)/1000);return}
  if(r.ph==="hold"||r.ph==="rest"){let left=(r.end-now)/1000;
    if(left<=0){if(r.ph==="hold"){r.done++;beep(990,.3);vib(250);if(r.done>=HG_PAUSE.n){hgPauseEnd();return}r.ph="rest";r.end+=HG_PAUSE.rest*1000}else{r.ph="hold";r.end+=HG_PAUSE.hold*1000;beep(880,.15);vib(80)}hgRunRender();return}
    lbl.textContent=r.ph==="hold"?`Halten · ${r.done+1} von ${HG_PAUSE.n}`:"Pause";const s=Math.ceil(left);t.textContent=r.ph==="hold"?s+" s":mmss(left);if(s!==r.cd){r.cd=s;if(s<=3&&s>0)beep(660,.08)}}}
function hgPauseEnd(){const r=HGR;clearInterval(holdT);if(!r)return;if(r.done>0){const H=hgS();const d=todayKey();const o=H.pauses.find(x=>x.d===d);if(o)o.n=Math.min(20,o.n+r.done);else H.pauses.push({d,n:r.done});H.pauses.sort((a,b)=>a.d<b.d?-1:1);save()}
  if(r.done>0){r.ph="done";hgRunRender()}else{HGR=null;closeSheet();toast("Hang-Pause abgebrochen")}}
function hgRefresh(){if(S.session&&!$("#train").hidden){renderTrain();return}if(TAB==="home")renderHome();else if(TAB==="hist")renderHist()}

/* ---------- home card ---------- */
function hgWeekPauses(){const ws=dkey(weekStart(new Date()).getTime());return hgS().pauses.filter(x=>x.d>=ws).reduce((a,x)=>a+x.n,0)}
function hgTestLine(){const l=hgLastTest();if(!l)return"Hang-Test: noch keiner – der erste zeigt deinen Startwert.";const d=hgDaysTo();
  return`Letzter Hang-Test: <b>${l.s} s</b> (${fDs(dT(l.d))})${d>0?` · nächster in ${d} Tag${d===1?"":"en"}`:" · wieder fällig"}`}
/* 3.3 (@ Joschy): a free day = no training running or done today AND either a training yesterday (rest day between two units)
   or the weekly goal already reached. Any other day is a plan day (next unit due) – then no hang pause, the grip stays fresh. */
function hgFreeDay(){if(S.session||trainedToday().length)return false;const y=new Date();y.setDate(y.getDate()-1);const yk=dkey(y.getTime());
  if(S.history.some(h=>h&&h.date&&dkey(new Date(h.date).getTime())===yk))return true;const ws=weekStart(new Date());
  return S.history.filter(h=>h&&new Date(h.date)>=ws).length>=(S.settings.goal||3)}
function hgHomeCard(){if(!canDo("deadhang"))return"";const st=hangState();const D=HG_ST[st.stage];const free=hgFreeDay();const due=hgTestDue();const wp=hgWeekPauses();
  return`<div class="card hgcard" id="hgCard"><div class="row between"><div class="label">Zusatz · Griffkraft & Hängen</div><button class="chip" id="hgPlanBtn">Plan</button></div>
   <div><b class="ytitle">Stufe ${st.stage} von 4 · ${esc(D.n)}</b><div class="muted" style="font-size:13px">Am Zieh-Tag: ${D.sets} × ${st.sec} s · Ziel: 1–2 Min. frei hängen</div></div>
   <div class="row between" style="gap:10px;align-items:center"><div class="muted" style="font-size:13px;min-width:0" id="hgTestLine">${hgTestLine()}</div>${due?`<button class="btn small" id="hgTestBtn">Hang-Test</button>`:""}</div>
   ${free?`<div class="row" style="gap:6px;flex-wrap:wrap;align-items:center"><button class="chip" id="hgPauseBtn">Hang-Pause · ${HG_PAUSE.n} × ${HG_PAUSE.hold} s</button><span class="muted" style="font-size:12px">freiwillig, für freie Tage${wp?` · diese Woche ${wp}×`:""}</span></div>`:""}</div>`}
function hgBindHome(){const b=(id,f)=>{const e=$(id);if(e)e.onclick=f};b("#hgPlanBtn",hgPlanSheet);b("#hgTestBtn",()=>hgRun("test"));b("#hgPauseBtn",()=>hgRun("pause"))}
function hgPlanSheet(){const st=hangState();const gk=gripKey();const g=gripState(gk);const ok=canDo("deadhang");
  openSheet(`<div class="row between"><h2 style="font-size:24px">Griffkraft & Hängen</h2><button class="iconbtn" data-close aria-label="Schließen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
   <p class="muted" style="margin:0;font-size:13.5px">Ziel: 1–2 Minuten frei an der Stange hängen. Der Block kommt am Zieh-Tag nach den Hauptübungen. Schaffst du alle Sätze (und war es nicht hart), steigt die Zeit um 5 s; oben in der Stufe geht es eine Stufe weiter. Zweimal verfehlt: 5 s weniger, auf der Mindestzeit eine Stufe zurück.</p>
   ${ok?"":`<div class="hint"><b>Gerät fehlt:</b> Für das Hängen brauchst du eine Klimmzugstange oder ein Power Rack (Einstellungen → Geräte).</div>`}
   ${HG_ST.slice(1).map((D,i)=>{const s=i+1;const cur=s===st.stage;return`<div class="hgst${cur?" cur":""}" data-hgst="${s}"><div style="min-width:0"><b>Stufe ${s} · ${esc(D.n)}${s<st.stage?" ✓":""}</b><div class="muted" style="font-size:12.5px">${D.sets} × ${D.start}–${D.top} s · ${esc(D.t)}</div></div>${cur?`<span class="tag">aktuell</span>`:ok?`<button class="btn small ghost" data-hgset="${s}">Hier starten</button>`:""}</div>`}).join("")}
   <div class="hint"><b>Beintag · ${esc(EX[gk].n)}:</b> ${GR.sets} × ${g.sec} s${g.w>0?` mit ${fmtKg(g.w)} kg je Hand`:""}. +5 s pro Einheit, ab ${GR.top} s ${EX[gk].wOpt?"die Taschen schwerer packen":"das nächste Gewicht"}.</div>
   <div class="hint"><b>Hang-Test:</b> alle 4 Wochen 1 Versuch, so lange wie möglich frei hängen. ${hgTestLine()}</div>
   <div class="ywarn" role="note">${esc(HG_SAFE)}</div>
   <button class="btn block" data-close>Schließen</button>`);
  for(const b of document.querySelectorAll("[data-hgset]"))b.onclick=()=>{const s=+b.dataset.hgset;const D=HG_ST[s];
    confirmSheet(`Mit Stufe ${s} weitermachen?`,`${D.n}: ab jetzt ${D.sets} × ${D.start} s am Zieh-Tag. Dein bisheriger Verlauf bleibt erhalten.${s>=3?" Nur wählen, wenn du schon sicher frei hängen kannst.":""}`,"Ja, Stufe "+s,()=>{hgS().base={stage:s,sec:D.start,at:new Date().toISOString()};save();toast("Hang-Programm: Stufe "+s);hgRefresh()})}}

/* ---------- Verlauf: hang test curve with goal lines 60 s and 120 s ---------- */
function hgStatCard(){const T=hgS().tests;if(!T.length&&!canDo("deadhang"))return"";const best=T.reduce((m,x)=>Math.max(m,x.s),0);const l=hgLastTest();const d=hgDaysTo();
  return`<div class="card" id="hgStat"><div class="row between"><div class="label">Hang-Test · frei hängen</div><span class="tag">alle 4 Wochen</span></div>
   <div class="kpis"><div><span class="num" id="hgBest">${T.length?best:"–"}<small> s</small></span><span class="kl">Bestwert</span></div><div><span class="num" id="hgLast">${l?l.s:"–"}<small> s</small></span><span class="kl">Zuletzt${l?" · "+fDs(dT(l.d)):""}</span></div><div><span class="num">${T.length?Math.min(100,Math.round(best/1.2))+"<small> %</small>":"–"}</span><span class="kl">von 2 Min.</span></div></div>
   <canvas id="hgChart" class="tchart" aria-label="Hang-Test über die Zeit mit Ziellinien 60 und 120 Sekunden"></canvas>
   <div class="muted fine">Gestrichelt: Ziel 1 Min. (60 s) und 2 Min. (120 s). ${!T.length?"Noch kein Test – der erste zeigt deinen Startwert.":d>0?`Nächster Test in ${d} Tag${d===1?"":"en"}.`:"Der nächste Test ist fällig."}</div>
   ${hgTestDue()?`<button class="btn small" id="hgTestH">Hang-Test starten</button>`:""}</div>`}
function hgChart(c){if(!c)return;const pts=hgS().tests.map(x=>({t:dT(x.d),v:x.s}));const dpr=Math.min(devicePixelRatio||1,2),W=c.clientWidth,Hh=c.clientHeight;if(!W||!Hh)return;
  c.width=Math.round(W*dpr);c.height=Math.round(Hh*dpr);const x=c.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);x.clearRect(0,0,W,Hh);const ff=getComputedStyle(document.body).fontFamily;x.font="11px "+ff;
  const mx=Math.max(130,...pts.map(p=>p.v*1.1));const L0=Math.ceil(x.measureText(String(Math.round(mx))).width)+12,R0=44,T0=10,B0=20;
  const Y=v=>T0+(Hh-T0-B0)*(1-v/mx);const tA=pts.length?pts[0].t:Date.now(),tB=pts.length?pts[pts.length-1].t:tA,span=Math.max(1,tB-tA);const X=t=>pts.length<2?(L0+W-R0)/2:L0+(W-L0-R0)*(t-tA)/span;
  x.strokeStyle=CSS["--line"];x.lineWidth=1;x.fillStyle=CSS["--faint"];x.textAlign="right";
  for(const v of[0,30,90]){const y=Y(v);x.beginPath();x.moveTo(L0,y);x.lineTo(W-R0,y);x.stroke();x.fillText(String(v),L0-6,y+4)}
  for(const[v,lab]of[[60,"1 Min."],[120,"2 Min."]]){const y=Y(v);x.save();x.setLineDash([5,4]);x.strokeStyle=CSS["--gold"];x.lineWidth=1.4;x.beginPath();x.moveTo(L0,y);x.lineTo(W-R0,y);x.stroke();x.restore();
    x.fillStyle=CSS["--gold"];x.textAlign="left";x.fillText(lab,W-R0+5,y+4);x.textAlign="right";x.fillStyle=CSS["--faint"];x.fillText(String(v),L0-6,y+4)}
  if(!pts.length){x.fillStyle=CSS["--muted"];x.font="13px "+ff;x.textAlign="center";x.fillText("Noch kein Test",(L0+W-R0)/2,Y(30)-6);return}
  x.fillStyle=CSS["--muted"];x.textAlign="left";x.fillText(fDs(tA),L0,Hh-5);if(pts.length>1){x.textAlign="right";x.fillText(fDs(tB),W-R0,Hh-5)}
  if(pts.length>1){const g=x.createLinearGradient(0,T0,0,Hh-B0);g.addColorStop(0,ACol(.26));g.addColorStop(1,ACol(0));x.beginPath();pts.forEach((p,i)=>i?x.lineTo(X(p.t),Y(p.v)):x.moveTo(X(p.t),Y(p.v)));x.lineTo(X(tB),Y(0));x.lineTo(X(tA),Y(0));x.closePath();x.fillStyle=g;x.fill();
    x.beginPath();pts.forEach((p,i)=>i?x.lineTo(X(p.t),Y(p.v)):x.moveTo(X(p.t),Y(p.v)));x.strokeStyle=CSS["--accent"];x.lineWidth=2.2;x.lineJoin="round";x.stroke()}
  for(const p of pts){x.beginPath();x.arc(X(p.t),Y(p.v),p===pts[pts.length-1]?4.5:2.6,0,7);x.fillStyle=CSS["--accent"];x.fill()}}
{const _rh=renderHsub;renderHsub=function(){_rh();if(HSUB!=="kraft")return;const h=hgStatCard();if(!h)return;const rc=$("#rmCard");if(rc)rc.insertAdjacentHTML("afterend",h);else{const el=$("#hsub");if(el)el.insertAdjacentHTML("afterbegin",h)}
  const b=$("#hgTestH");if(b)b.onclick=()=>hgRun("test");hgChart($("#hgChart"))};
  const _hr=histRedraw;histRedraw=function(){_hr();if(TAB==="hist")hgChart($("#hgChart"))};
  const _home=renderHome;renderHome=function(){_home();const h=hgHomeCard();if(!h)return;const y=$("#yCard");const wk=document.querySelector("#v-home .week");const card=y||(wk&&wk.closest(".card"));
    if(card)card.insertAdjacentHTML("afterend",h);else $("#v-home").insertAdjacentHTML("beforeend",h);hgBindHome()};RENDER.home=renderHome;
  const _bk=openBackup;openBackup=function(){_bk();const H=hgS();const p=[...document.querySelectorAll("#sheet p.muted")].pop();const t=H.tests.length,n=H.pauses.length;const parts=[t?`${t} Hang-Test${t===1?"":"s"}`:"",n?`${n} Hang-Pause${n===1?"":"n"}`:""].filter(Boolean);if(p&&parts.length)p.textContent+=` · ${parts.join(" · ")}`}}
/* backup: S.hang validated tolerantly (broken entries are dropped, never the history); older backups simply have none */
{const _s3=sanitize3;sanitize3=function(st){const r=_s3(st);if(st.hang!=null)st.hang=hgNorm(st.hang);return r||st}}
{const st=document.createElement("style");st.textContent=`
.hgcard .ytitle{font-family:var(--display);font-size:17px;letter-spacing:.04em;text-transform:uppercase}
.hgrun{display:grid;justify-items:center;gap:2px}
.hgrun .num{font-size:56px;line-height:1}
.hgdots{display:flex;gap:8px;margin-top:4px}.hgdots i{width:12px;height:12px;border-radius:50%;border:1px solid var(--line2)}.hgdots i.on{background:var(--arc);border-color:var(--arc)}.hgdots i.cur{border-color:var(--arc);box-shadow:0 0 6px var(--arc)}
.hgst{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-top:1px solid var(--line)}
.hgst.cur b{color:var(--arc)}`;document.head.appendChild(st)}
