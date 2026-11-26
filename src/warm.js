/* ================= 3.14 · KATEGORIE AUFWÄRMEN (@ Joschy) =================
   Eigene Kategorie in der Übungsbibliothek (Reiter „Aufwärmen“ neben Kraft und Yoga & Dehnen) mit eigens fürs Aufwärmen
   gemachten Übungen: sanft, dynamisch, ohne Sprünge, schulter- und hüftfreundlich. Unterart „Dehnen“ (s:1) = dynamische
   Dehnungen (aktiv, rhythmisch in die Endposition, kurze Halteteile höchstens 15–20 s), Bereiche Nacken bis Waden.
   Diese Übungen sind der Hauptpool des 10-min-Aufwärmens (WPOOL, Logik aus 3.13: 5 min Crosstrainer, dann ca. 5 min
   wechselnde Übungen passend zum Tag, je Einheit mindestens eine Dehnübung). Bestehende Übungen nur noch dort, wo sinnvoll.
   Felder: n Name, r Bereich (im Pool c = Tage, an denen die Übung zum Bereich des Tages zählt), z Zielbereich, s Dehnen, d Tage (A Push · B Pull · C Beine), pos 0 liegend/sitzend · 1 kniend ·
   2 stehend, g Gruppe (nur eine je Block), nd Geräte (Alternativen wie NEEDS), dos Dauer bzw. Wiederholungen,
   t Anleitung, b Atmung, x Achtung, an Animation (AN["w_"+k]). JAI-Clip "warm_"+k fehlt noch: dann bleibt JAI still. */
const WX_REG=[["push","Oberkörper Push"],["pull","Oberkörper Pull"],["beine","Beine"],["rumpf","Rumpf & Ganzkörper"]];
const WX_DAYN={A:"Training A",B:"Training B",C:"Training C"};
const WST={shin:-90,thigh:-90,torso:88};
const WVF={shin:186,thigh:-90,torso:10,foot:180,at:[-45.7,.2]};/* Vierfüßler: Knie bei (0,5), Hüfte darüber */
const WX={
  /* ---------- Oberkörper Push: Schulter, Brust, Brustwirbelsäule ---------- */
  armkreuz:{n:"Arme kreuzen vor der Brust",r:"push",z:"Brust · vordere Schulter",d:"A",pos:2,dos:"60 s · ruhiger Rhythmus",
    t:"Aufrecht stehen, Arme seitlich auf Schulterhöhe. Arme vor der Brust locker überkreuzen, dann weit öffnen. Oben und unten liegenden Arm abwechseln.",
    b:"Öffnen beim Einatmen, kreuzen beim Ausatmen.",x:"Nicht nach hinten schwingen, nur so weit öffnen, wie die Schulter frei bleibt.",
    an:{view:"front",A:{yf:1,ua:0,us:1,fa:0,fs:1,uaL:180,usL:1,faL:180,fsL:1,s:10},B:{yf:1,ua:6,us:-.5,fa:6,fs:-.5,uaL:186,usL:-.5,faL:186,fsL:-.5,s:10},tempo:[1,.2,1,.2],ph:["Kreuzen","Öffnen"]}},
  ellbkreis:{n:"Ellbogenkreisen",r:"push",z:"Schultergelenk · Schulterblatt",d:"A",pos:2,dos:"60 s · 30 s vorwärts, 30 s rückwärts",
    t:"Fingerspitzen locker auf die Schultern legen. Mit den Ellbogen große, langsame Kreise malen: vorn hoch, über oben nach hinten und unten.",
    b:"Hoch beim Einatmen, runter beim Ausatmen.",x:"Kreise nur so groß, wie es schmerzfrei ist. Nacken locker, Schultern nicht hochziehen.",
    an:{anchor:"foot",noBal:1,A:{...WST,upper:-90,fore:75},B:{...WST,upper:270,fore:435},K:[{t:.33,upper:30,fore:195},{t:.66,upper:150,fore:315}],tempo:[2.6,0,2.6,0],ph:["Kreisen","Kreisen"]}},
  scapwand:{n:"Schulterblatt-Liegestütz an der Wand",r:"push",z:"Sägemuskel · Schulterblatt",d:"A",pos:2,g:"wand",dos:"12–15 Wiederholungen",
    t:"Hände schulterbreit an die Wand, Arme gestreckt. Nur die Schulterblätter bewegen: Brust ein kleines Stück zur Wand sinken lassen, dann die Wand wegschieben.",
    b:"Einatmen beim Sinken, ausatmen beim Wegschieben.",x:"Arme bleiben fast gestreckt, kleine Bewegung. Schultern weg von den Ohren.",
    an:{anchor:"foot",noBal:1,A:{shin:-110,thigh:-110,torso:70,handAt:[110,139],bend:-1,foot:0,neck:4},B:{shin:-112.5,thigh:-112.5,torso:68,handAt:[110,139],bend:-1,foot:0,neck:6},eq:[{t:"wall",x:121.5}],tempo:[1.2,.6,1.2,.6],ph:["Sinken","Wegschieben"]}},
  bwsvf:{n:"BWS-Drehung im Vierfüßler",r:"push",z:"Brustwirbelsäule · Brust",d:"AB",pos:1,g:"bws",dos:"60 s · je Seite 30 s",
    t:"Vierfüßlerstand, eine Hand an den Hinterkopf. Ellbogen erst unter dem Körper Richtung anderer Hand führen, dann weit zur Decke aufdrehen. Nach 30 s Seite wechseln.",
    b:"Ausatmen nach unten, einatmen beim Aufdrehen.",x:"Drehung kommt aus der Brustwirbelsäule, die Hüfte bleibt über den Knien. Ohne Druck am Kopf.",
    an:{anchor:"foot",mat:1,A:{...WVF,upper:-45,fore:102,neck:-6},B:{...WVF,torso:14,upper:75,fore:290,neck:24},K:[{t:.5,torso:12,upper:10,fore:160,neck:8}],tempo:[1.6,.5,1.6,.5],ph:["Aufdrehen","Zurück"]}},
  bwsbank:{n:"BWS-Streckung an der Bank",r:"push",z:"Brustwirbelsäule · Lat · Trizeps",d:"A",pos:1,g:"bws",nd:[["bench"]],dos:"10 Wiederholungen, unten 2–3 s",
    t:"Vor der Bank knien, Ellbogen auf die Bank, Handflächen zusammen. Po Richtung Fersen schieben und die Brust zwischen den Armen sanft Richtung Boden sinken lassen, kurz halten, zurück.",
    b:"Ausatmen beim Sinken, einatmen beim Zurückkommen.",x:"Kein Hohlkreuz im unteren Rücken, Bauch leicht fest. Bei Ziehen vorn in der Schulter weniger tief.",
    an:{anchor:"foot",mat:1,A:{shin:185,thigh:-80,torso:15,foot:180,at:[-45.8,0],upper:-41,fore:123,neck:0},B:{shin:185,thigh:-67,torso:-5,foot:180,at:[-45.8,0],upper:5,fore:170,neck:4},eq:[{t:"box",x:60,w:52,y:40}],tempo:[2,1.5,1.6,.5],ph:["Brust sinken","Zurück"]}},
  halo:{n:"Halo mit leichter Kurzhantel",r:"push",z:"Schultergürtel · obere Brustwirbelsäule",d:"A",pos:2,nd:[["db"]],dos:"8 Kreise je Richtung",
    t:"Leichteste Kurzhantel (2,5 oder 5 kg) mit beiden Händen vor der Brust halten. In einem engen Kreis um den Kopf führen, dicht am Kopf vorbei. Nach 8 Kreisen die Richtung wechseln.",
    b:"Gleichmäßig weiteratmen.",x:"Ganz leichtes Gewicht, kleiner Kreis nah am Kopf. Rumpf bleibt ruhig, kein Hohlkreuz. Bei Schulterbeschwerden ohne Gewicht oder weglassen.",
    an:{view:"front",A:{yf:1,ua:-75,fa:136,uaL:-105,faL:44,s:10},B:{yf:1,ua:285,fa:136,uaL:255,faL:44,s:10},K:[{t:.25,ua:0,fa:136,uaL:75,faL:-20},{t:.5,ua:60,fa:162,uaL:120,faL:18},{t:.75,ua:105,fa:200,uaL:180,faL:44}],eq:[{t:"db",at:"handR"}],tempo:[2.4,0,2.4,0],ph:["Kreisen","Kreisen"]}},
  pendel:{n:"Armpendeln vorgebeugt",r:"push",z:"Schultergelenk (Entlastung)",d:"AB",pos:2,dos:"60 s · je Arm 30 s",
    t:"Leicht vorbeugen, eine Hand stützt sich am Oberschenkel ab. Der andere Arm hängt locker und pendelt ruhig vor und zurück, wie ein Pendel. Nach 30 s Arm wechseln.",
    b:"Ruhig und tief atmen.",x:"Der Arm wird nur pendeln gelassen, nicht aktiv geschwungen. Rücken lang.",
    an:{anchor:"foot",noBal:1,A:{shin:-100,thigh:-70,torso:15,upper:-110,fore:-108,hand2:[-34,-41],bend2:1,neck:6},B:{shin:-100,thigh:-70,torso:15,upper:-72,fore:-74,hand2:[-34,-41],bend2:1,neck:6},tempo:[1.1,0,1.1,0],ph:["Pendeln","Pendeln"]}},
  armschwung:{n:"Arme vor und zurück schwingen",r:"push",z:"Schultern · Brust",d:"AB",pos:2,g:"arme",dos:"60 s · locker",
    t:"Hüftbreit stehen, Knie weich. Die Arme im Wechsel locker vor und zurück schwingen, vorn bis etwa Schulterhöhe. Die Knie federn leicht mit.",
    b:"Gleichmäßig weiteratmen.",x:"Nicht in die Endposition reißen, der Schwung bleibt locker und klein genug für die Schulter.",
    an:{anchor:"foot",A:{shin:-92,thigh:-88,torso:88,upper:-12,fore:-2,upper2:-140,fore2:-134},B:{shin:-92,thigh:-88,torso:88,upper:-140,fore:-134,upper2:-12,fore2:-2},tempo:[.9,0,.9,0],ph:["Schwingen","Schwingen"]}},
  armwechsel:{n:"Arme im Wechsel zur Decke strecken",r:"push",z:"Schulterbeugung · Lat",d:"A",pos:2,g:"arme",dos:"60 s · im Wechsel",
    t:"Aufrecht stehen. Einen Arm vorn hoch zur Decke strecken, der andere sinkt nach unten. Im ruhigen Wechsel, oben kurz lang machen.",
    b:"Einatmen beim Strecken.",x:"Nur so hoch, wie es in der Schulter angenehm bleibt, Rippen bleiben unten.",
    an:{view:"front",A:{yf:1,ua:-95,us:1,fa:-95,fs:1,uaL:-85,usL:-1,faL:-85,fsL:-1,s:10},B:{yf:1,ua:-95,us:-1,fa:-95,fs:-1,uaL:-85,usL:1,faL:-85,fsL:1,s:10},tempo:[1.4,.5,1.4,.5],ph:["Rechts hoch","Links hoch"]}},
  brustwand:{n:"Brustöffner an der Wand",r:"push",s:1,z:"Brust · vordere Schulter",d:"A",pos:2,g:"wand",dos:"60 s · je Seite 30 s, vorn 2 s",
    t:"Seitlich zur Wand stehen, Hand und Unterarm hinter dir auf Schulterhöhe an die Wand. Oberkörper sanft nach vorn und von der Wand wegdrehen, bis die Brust zieht, 2 s halten, zurück. Nach 30 s Seite wechseln.",
    b:"Ausatmen beim Wegdrehen.",x:"Arm nicht höher als die Schulter, nur ein leichtes Ziehen. Kein Kribbeln im Arm.",
    an:{anchor:"foot",noBal:1,A:{shin:-90,thigh:-90,torso:88,handAt:[-42,150],bend:1,upper2:-95,fore2:-82},B:{shin:-94,thigh:-94,torso:80,handAt:[-42,150],bend:1,upper2:-95,fore2:-80},eq:[{t:"wall",x:-46}],tempo:[1.6,2,1.4,.5],ph:["Wegdrehen","Zurück"]}},
  armquer:{n:"Arm quer zur Brust im Wechsel",r:"push",s:1,z:"Hintere Schulter · Schulterblatt",d:"AB",pos:2,dos:"60 s · je Seite 2–3 s halten",
    t:"Einen Arm gestreckt quer vor die Brust führen, die andere Hand zieht sanft am Oberarm, 2–3 s halten. Lösen und Seite wechseln.",
    b:"Ausatmen beim Heranziehen.",x:"Am Oberarm ziehen, nicht am Ellbogengelenk. Schulter bleibt unten.",
    an:{view:"front",A:{yf:1,ua:182,fa:182,uaL:-60,faL:120,s:8},B:{yf:1,ua:-120,fa:60,uaL:-2,faL:-2,s:8},K:[{t:.5,ua:240,fa:250,uaL:-60,faL:-70}],tempo:[1.4,2.2,1.4,2.2],ph:["Rechts quer","Links quer"]}},
  nackenneig:{n:"Nacken-Neigen im Wechsel",r:"rumpf",s:1,z:"Seitlicher Nacken",d:"AB",pos:2,g:"nacken",dos:"60 s · je Seite 3 s",
    t:"Aufrecht stehen, Arme hängen. Ohr langsam Richtung Schulter sinken lassen, 3 s halten, über die Mitte zur anderen Seite.",
    b:"Ausatmen beim Sinken lassen.",x:"Nur neigen, nicht kreisen. Die gegenüberliegende Schulter bleibt unten, kein Ziehen mit der Hand.",
    an:{view:"front",A:{yf:1,ua:-86,fa:-88,s:6,tilt:-27},B:{yf:1,ua:-86,fa:-88,s:6,tilt:27},tempo:[2.4,3,2.4,3],ph:["Zur Seite","Zur anderen Seite"]}},
  /* ---------- Oberkörper Pull: Schulterblätter, Lat, Griff bzw. Unterarme ---------- */
  diagpull:{n:"Diagonale Pull-Aparts mit Band",r:"pull",z:"Schulterblätter · hintere Schulter",d:"B",pos:2,g:"pa",nd:[["band"]],dos:"10 je Diagonale",
    t:"Leichtes Band vor der Brust. Eine Hand zieht schräg nach oben außen, die andere schräg nach unten außen, Schulterblätter zusammen. Langsam zurück, nach 10 die Diagonale wechseln.",
    b:"Ausatmen beim Auseinanderziehen.",x:"Leichtestes Band, Arme fast gestreckt. Die obere Hand nur so hoch, wie es schmerzfrei geht.",
    an:{view:"front",A:{yf:1,ua:210,us:.3,fa:210,fs:.3,uaL:-30,usL:.3,faL:-30,fsL:.3,s:10},B:{yf:1,ua:37,us:1,fa:37,fs:1,uaL:-140,usL:1,faL:-140,fsL:1,s:10},K:[{t:.4,ua:100,us:.2,fa:100,fs:.2,uaL:-85,usL:.3,faL:-85,fsL:.3}],eq:[{t:"bandHands"}],tempo:[1,.4,1.4,.3],ph:["Auseinander","Zurück"]}},
  bandpulldown:{n:"Band-Zug von oben zur Brust",r:"pull",z:"Lat · untere Schulterblattmuskeln",d:"B",pos:2,nd:[["band"]],dos:"12 Wiederholungen",
    t:"Leichtes Band über dem Kopf, Hände weit. Band auseinanderziehen und die Ellbogen nach unten zu den Rippen führen, bis die Hände auf Schulterhöhe sind. Langsam zurück nach oben.",
    b:"Ausatmen beim Herunterziehen.",x:"Oben nicht ins Hohlkreuz gehen. Nur so hoch, wie die Schulter frei bleibt.",
    an:{view:"front",A:{yf:1,ua:65,fa:70,s:10},B:{yf:1,ua:-40,fa:75,s:10},eq:[{t:"bandHands"}],tempo:[1.2,.5,1.4,.3],ph:["Runterziehen","Hoch"]}},
  scaprow:{n:"Schulterblatt-Rudern vorgebeugt",r:"pull",z:"Mittlerer Trapez · Rautenmuskeln",d:"B",pos:2,nd:[["db"]],dos:"12–15 Wiederholungen",
    t:"Mit leichten Kurzhanteln (2,5 kg) leicht vorbeugen, Rücken lang, Arme hängen. Schulterblätter zusammen- und nach unten ziehen, die Ellbogen gehen nur ein kleines Stück mit. Langsam lösen.",
    b:"Ausatmen beim Zusammenziehen.",x:"Kein volles Rudern, die Bewegung kommt aus den Schulterblättern. Rücken gerade.",
    an:{anchor:"foot",noBal:1,A:{shin:-95,thigh:-70,torso:40,upper:-90,fore:-90,neck:-6},B:{shin:-95,thigh:-70,torso:41,upper:-112,fore:-84,neck:-6},eq:[{t:"db",at:"hand"},{t:"db",at:"hand2"}],tempo:[1,.6,1.4,.3],ph:["Zusammen","Lösen"]}},
  kinn:{n:"Kinn einziehen an der Wand",r:"pull",z:"Tiefe Nackenmuskeln · Haltung",d:"AB",pos:2,g:"nacken",dos:"10 Wiederholungen, 3 s halten",
    t:"Mit Rücken und Po an die Wand stellen. Kinn waagerecht nach hinten schieben, als würdest du ein Doppelkinn machen, der Hinterkopf geht zur Wand. 3 s halten, lösen.",
    b:"Ruhig weiteratmen, nicht pressen.",x:"Nicht nicken, der Blick bleibt geradeaus. Nur sanfter Druck.",
    an:{anchor:"foot",noBal:1,A:{shin:-90,thigh:-90,torso:90,neck:-5,upper:-92,fore:-90},B:{shin:-90,thigh:-90,torso:90,neck:6,upper:-92,fore:-90},eq:[{t:"wall",x:-14}],tempo:[1,3,1,.6],ph:["Kinn zurück","Lösen"]}},
  handgelenk:{n:"Handgelenk-Schaukel im Vierfüßler",r:"pull",z:"Handgelenke · Unterarme",d:"AB",pos:1,dos:"60 s · langsam",
    t:"Vierfüßlerstand, Hände flach unter den Schultern, Finger gespreizt. Den Körper langsam über die Hände nach vorn schieben und zurück Richtung Fersen.",
    b:"Gleichmäßig weiteratmen.",x:"Nur so weit nach vorn, wie die Handgelenke es mögen. Ganze Hand bleibt am Boden.",
    an:{anchor:"foot",mat:1,A:{...WVF,thigh:-82.5,handAt:[57,1],bend:-1},B:{...WVF,thigh:-100,handAt:[57,1],bend:-1},tempo:[1.5,.5,1.5,.5],ph:["Nach vorn","Zurück"]}},
  ellbdruck:{n:"Ellbogen-Druck in Rückenlage",r:"pull",z:"Schulterblätter · oberer Rücken",d:"B",pos:0,dos:"10 Wiederholungen, 3 s halten",
    t:"Rückenlage, Beine aufgestellt, Oberarme am Körper, Unterarme zeigen zur Decke. Ellbogen in den Boden drücken, die Brust hebt sich ein kleines Stück, Schulterblätter zusammen. 3 s halten, lösen.",
    b:"Ausatmen beim Drücken.",x:"Kopf bleibt am Boden, kein Hohlkreuz. Kleine Bewegung.",
    an:{anchor:"shoulder",mat:1,A:{at:[0,9],torso:180,thigh:40,shin:-57,upper:-9,fore:90,neck:0},B:{at:[0,13],torso:176,thigh:40,shin:-57,upper:-16,fore:92,neck:12},tempo:[1.2,2.5,1.4,.5],ph:["Drücken","Lösen"]}},
  latrack:{n:"Lat-Schaukel am Rack",r:"pull",s:1,z:"Lat · Rücken · Achsel",d:"B",pos:2,nd:[["rack"]],dos:"10 Wiederholungen, unten 2 s",
    t:"Stange im Rack auf Hüfthöhe, Hände schulterbreit darauf. Einen Schritt zurück, Hüfte nach hinten schieben und die Brust zwischen den gestreckten Armen sinken lassen, 2 s halten, zurück.",
    b:"Ausatmen beim Sinken.",x:"Nur bis zu einem angenehmen Ziehen in der Achsel, kein Druck vorn in der Schulter. Stange vorher sicher einhängen.",
    an:{anchor:"foot",noBal:1,A:{shin:-95,thigh:-84,torso:20,handAt:[110,95],bend:-1,neck:0},B:{shin:-95,thigh:-80,torso:-5,handAt:[110,95],bend:-1,neck:-8},eq:[{t:"rackbar",at:[110,95]}],tempo:[1.8,2,1.4,.5],ph:["Sinken","Zurück"]}},
  rueckenrund:{n:"Rücken rund und lang im Stand",r:"pull",s:1,z:"Rücken · Brustwirbelsäule",d:"BC",pos:2,dos:"10 Wiederholungen",
    t:"Füße hüftbreit, Knie gebeugt, Hände auf die Oberschenkel. Rücken langsam rund machen, Kinn zur Brust, dann lang machen und die Brust nach vorn schieben.",
    b:"Ausatmen rund, einatmen lang.",x:"Weich bewegen, ohne Ruck. Im unteren Rücken nur ein kleines Hohlkreuz.",
    an:{anchor:"foot",noBal:1,A:{shin:-105,thigh:-55,torso:40,hand:[16,-48],bend:-1,neck:-34,lum:7,tho:3},B:{shin:-105,thigh:-55,torso:44,hand:[16,-48],bend:-1,neck:6,lum:-5,tho:-6},tempo:[2,.5,2,.5],ph:["Rund","Lang"]}},
  latseit:{n:"Seitneigung mit Armzug im Wechsel",r:"pull",s:1,z:"Lat · Flanke",d:"AB",pos:2,dos:"60 s · je Seite 2 s",
    t:"Hüftbreit stehen. Einen Arm über den Kopf führen und den Oberkörper zur Seite neigen, 2 s lang machen. Über die Mitte zur anderen Seite.",
    b:"In die gedehnte Flanke einatmen.",x:"Nur zur Seite neigen, nicht nach vorn. Oberer Arm locker, Schulter nicht zum Ohr ziehen.",
    an:{view:"front",A:{yf:1,ua:-92,fa:-96,uaL:76,faL:38,s:8,lean:12},B:{yf:1,ua:104,fa:142,uaL:272,faL:276,s:8,lean:-12},K:[{t:.25,ua:-92,fa:-96,uaL:170,faL:175,lean:6},{t:.5,ua:-90,fa:-90,uaL:270,faL:270,lean:0},{t:.75,ua:10,fa:10,uaL:270,faL:270,lean:-6}],tempo:[2.4,1.6,2.4,1.6],ph:["Zur Seite","Zur anderen Seite"]}},
  brustschwimm:{n:"Brustschwimm-Arme im Stand",r:"pull",z:"Schulterblätter · hintere Schulter",d:"B",pos:2,g:"arme",dos:"12 Züge",
    t:"Aufrecht stehen, Arme nach vorn strecken. Wie beim Brustschwimmen weit zur Seite öffnen, Ellbogen zu den Rippen ziehen, Schulterblätter zusammen, wieder nach vorn strecken.",
    b:"Einatmen beim Öffnen, ausatmen beim Strecken.",x:"Schultern bleiben unten, ohne Schwung.",
    an:{view:"front",A:{yf:1,ua:180,us:.25,fa:180,fs:.25,s:10},B:{yf:1,ua:320,us:1,fa:430,fs:1,s:10},K:[{t:.3,ua:270,us:.22,fa:270,fs:.22},{t:.62,ua:360,us:1,fa:360,fs:1}],tempo:[1.8,.4,1.6,.3],ph:["Öffnen & ziehen","Nach vorn"]}},
  /* ---------- Beine: Hüfte, Knie, Sprunggelenk, Gesäß ---------- */
  beinpendel:{n:"Beinpendel vor und zurück",r:"beine",s:1,z:"Hüftbeuger · Beinrückseite",d:"C",pos:2,g:"pendel",dos:"60 s · je Bein 30 s",
    t:"Seitlich an Wand oder Rack festhalten. Ein Bein locker vor und zurück pendeln lassen, mit jedem Schwung etwas weiter, Oberkörper bleibt aufrecht. Nach 30 s Bein wechseln.",
    b:"Gleichmäßig weiteratmen.",x:"Kontrolliert pendeln, nicht kicken. Nur so weit, wie die Hüfte frei bleibt.",
    an:{anchor:"foot",noBal:1,A:{shin:-92,thigh:-88,torso:88,thigh2:-48,shin2:-58,foot2:20,upper:-65,fore:-40,hand2:[12,-24],bend2:-1},B:{shin:-92,thigh:-88,torso:86,thigh2:-125,shin2:-122,foot2:-40,upper:-65,fore:-40,hand2:[12,-24],bend2:-1},K:[{t:.5,thigh2:-88,shin2:-112,foot2:-15}],eq:[{t:"post",x:16,w:7,h:180}],tempo:[.95,0,.95,0],ph:["Pendeln","Pendeln"]}},
  beinpendelseit:{n:"Beinpendel seitlich",r:"beine",s:1,z:"Adduktoren · seitliche Hüfte",d:"C",pos:2,g:"pendel",dos:"60 s · je Bein 30 s",
    t:"Seitlich neben Wand oder Rack-Pfosten stehen und mit einer Hand festhalten. Ein Bein locker vor dem Standbein seitlich hin und her pendeln, langsam etwas weiter. Nach 30 s Bein wechseln.",
    b:"Gleichmäßig weiteratmen.",x:"Becken bleibt gerade, kleiner Ausschlag reicht. Nicht kicken.",
    an:{view:"front",A:{yf:1,hx:-3,lean:-3,aR:[4,7],aL:[-12,0],kL:[-11,46],hR:[13,100],hL:[-40,128],bR:1,bL:1},B:{yf:1,hx:-4,lean:-6,aR:[52,18],aL:[-12,0],kL:[-11,46],hR:[13,100],hL:[-40,128],bR:1,bL:1},eq:[{t:"post",x:-50,w:7,h:180}],tempo:[.9,0,.9,0],ph:["Pendeln","Pendeln"]}},
  vfkreis:{n:"Knie-Kreisen im Vierfüßler",r:"beine",z:"Hüftgelenk · Gesäß",d:"C",pos:1,g:"vf",dos:"60 s · je Seite 30 s",
    t:"Vierfüßlerstand. Ein Knie leicht anheben und mit dem Knie langsame Kreise malen: nach vorn unter den Bauch, zur Seite, nach hinten. Richtung wechseln, dann Seite wechseln.",
    b:"Gleichmäßig weiteratmen.",x:"Kleine Kreise, Rücken bleibt ruhig. Zwickt die Hüfte, Kreis kleiner machen.",
    an:{anchor:"hip",at:[0,51],mat:1,A:{torso:10,thigh:-88,shin:182,foot:180,thigh2:-90,shin2:186,foot2:180,upper:-90,fore:-90},B:{torso:10,thigh:-100,shin:175,foot:170,thigh2:-90,shin2:186,foot2:180,upper:-90,fore:-90},K:[{t:.33,thigh:-65,shin:180,foot:190},{t:.66,thigh:-150,shin:160,foot:150}],tempo:[2.2,0,2.2,0],ph:["Kreisen","Kreisen"]}},
  schaukel:{n:"Vierfüßler-Schaukel zum Fersensitz",r:"beine",z:"Hüfte · Gesäß · unterer Rücken",d:"C",pos:1,g:"vf",dos:"10 Wiederholungen",
    t:"Vierfüßlerstand, Hände bleiben liegen. Po langsam Richtung Fersen schieben, Rücken lang, dann zurück in den Vierfüßlerstand.",
    b:"Ausatmen nach hinten, einatmen nach vorn.",x:"Nur so weit nach hinten, wie der Rücken lang bleibt und die Hüfte nicht zwickt.",
    an:{anchor:"foot",mat:1,A:{...WVF,handAt:[57,1],bend:-1},B:{...WVF,thigh:-35,torso:4,handAt:[57,1],bend:-1,neck:-6},tempo:[2,.5,1.6,.4],ph:["Nach hinten","Nach vorn"]}},
  ruecksknie:{n:"Rückwärtsschritt mit Knieheben",r:"beine",z:"Hüftbeuger · Gesäß · Knie",d:"C",pos:2,g:"lunge",dos:"8 je Seite",
    t:"Kleiner Schritt nach hinten in einen flachen Ausfallschritt, dann das hintere Bein nach vorn holen und das Knie bis etwa Hüfthöhe heben. Arme schwingen gegengleich mit.",
    b:"Einatmen beim Schritt zurück, ausatmen beim Knieheben.",x:"Ruhig, ohne Sprung. Flacher Schritt, das vordere Knie zeigt über den Fuß.",
    an:{anchor:"foot",noBal:1,A:{shin:-100,thigh:-40,torso:85,thigh2:-115,shin2:-142.5,foot2:-25,upper:-60,fore:-30,upper2:-120,fore2:-100},B:{shin:-90,thigh:-90,torso:86,thigh2:-5,shin2:-95,foot2:-10,upper:-120,fore:-100,upper2:-50,fore2:-20},K:[{t:.5,shin:-92,thigh:-88,torso:88,thigh2:-80,shin2:-112,foot2:-20,upper:-90,fore:-70,upper2:-90,fore2:-70}],tempo:[1.4,.4,1.4,.3],ph:["Knie hoch","Schritt zurück"]}},
  squatstand:{n:"Hocke zum Stand",r:"beine",s:1,z:"Beinrückseite · Hüfte · Adduktoren",d:"C",pos:2,g:"ham",dos:"8 Wiederholungen",
    t:"Füße schulterbreit, Knie weich, nach vorn beugen und die Schienbeine oder Zehen greifen. In eine echte Hocke sinken, Brust aufrecht, die Ellbogen drücken innen die Knie nach außen. Dann mit den Händen an den Beinen die Beine wieder strecken.",
    b:"Ausatmen beim Strecken der Beine.",x:"Nur so tief in die Hocke, wie die Hüfte frei bleibt. Hände dürfen auch an die Schienbeine.",
    an:{anchor:"foot",noBal:1,A:{shin:-100,thigh:-60,torso:-25,handAt:[13,12],bend:-1,neck:-8},B:{shin:-125,thigh:-10,torso:55,handAt:[17,38],bend:-1,neck:10},K:[{t:.5,shin:-112,thigh:-40,torso:0,handAt:[15,24],neck:2}],tempo:[2,.8,2,.8],ph:["In die Hocke","Beine strecken"]}},
  fersepo:{n:"Ferse zum Po im Wechsel",r:"beine",s:1,z:"Oberschenkel vorn · Hüftbeuger",d:"C",pos:2,dos:"60 s · je Seite 2 s",
    t:"Aufrecht stehen, eine Ferse Richtung Po führen und den Fuß kurz mit der Hand fassen, 2 s, Knie zeigt nach unten. Abstellen, Seite wechseln.",
    b:"Gleichmäßig weiteratmen.",x:"Becken aufrichten, Po fest, kein Hohlkreuz. Bei Bedarf an der Wand festhalten.",
    an:{anchor:"foot",noBal:1,A:{shin:-92,thigh:-86,torso:90,thigh2:-90,shin2:-92,foot2:0,hand2:[2,-56],bend2:1,upper:-75,fore:-55},B:{shin:-92,thigh:-86,torso:90,thigh2:-110,shin2:95,foot2:150,hand2:[-19.4,-55.6],bend2:1,upper:-60,fore:-35},K:[{t:.5,thigh2:-118,shin2:-170,foot2:-60,hand2:[-6,-56]}],tempo:[1.2,2,1.2,.6],ph:["Ferse zum Po","Abstellen"]}},
  fusspumpe:{n:"Fußgelenk-Pumpe auf der Bank",r:"beine",z:"Sprunggelenk · Waden · Schienbein",d:"C",pos:0,g:"fuss",nd:[["bench"]],dos:"20 Wiederholungen",
    t:"Auf die Bank setzen, Beine gestreckt, Fersen am Boden. Zehen kräftig zu dir anziehen, dann weit wegstrecken, in ruhigem Rhythmus.",
    b:"Gleichmäßig weiteratmen.",x:"Ohne Krampf, nur bis zu einem angenehmen Ziehen.",
    an:{anchor:"hip",at:[0,46],A:{torso:95,thigh:-28,shin:-28,foot:62,handAt:[-12,48],bend:1},B:{torso:95,thigh:-28,shin:-28,foot:-8,handAt:[-12,48],bend:1},eq:[{t:"box",x:-40,w:52,y:42}],tempo:[.8,.4,.8,.4],ph:["Anziehen","Strecken"]}},
  kniehueft:{n:"Kniende Hüftbeuge",r:"beine",z:"Gesäß · Beinrückseite",d:"C",pos:1,dos:"12 Wiederholungen",
    t:"Aufrecht knien, Arme vor der Brust. Hüfte nach hinten schieben, Oberkörper neigt sich mit langem Rücken nach vorn, dann mit festem Po die Hüfte wieder nach vorn schieben.",
    b:"Einatmen nach hinten, ausatmen beim Aufrichten.",x:"Knie weich unterlegen. Oben nicht ins Hohlkreuz drücken.",
    an:{anchor:"foot",mat:1,A:{...WVF,thigh:-90,torso:90,hand:[14,-26],bend:-1,neck:0},B:{...WVF,thigh:-55,torso:55,hand:[16,-24],bend:-1,neck:-8},tempo:[1.4,.4,1,.5],ph:["Hüfte zurück","Aufrichten"]}},
  hamstringpendel:{n:"Beinpendel in Rückenlage",r:"beine",s:1,z:"Beinrückseite · Wade",d:"C",pos:0,g:"ham",dos:"60 s · je Bein 30 s",
    t:"Rückenlage, ein Bein aufgestellt. Das andere Bein gestreckt langsam anheben, bis die Rückseite zieht, Zehen zu dir, 2 s halten, ablegen.",
    b:"Ausatmen beim Anheben.",x:"Becken bleibt am Boden. Knie darf leicht gebeugt sein, nur so hoch, wie die Hüfte frei bleibt.",
    an:{anchor:"shoulder",mat:1,A:{at:[0,9],torso:180,thigh:-5,shin:-5,foot:85,thigh2:40,shin2:-57,foot2:0,upper:-9,fore:-5,neck:0},B:{at:[0,9],torso:180,thigh:70,shin:70,foot:150,thigh2:40,shin2:-57,foot2:0,upper:-9,fore:-5,neck:0},tempo:[1.4,1.6,1.4,.4],ph:["Bein hoch","Ablegen"]}},
  scheibenwischer:{n:"Scheibenwischer im Sitzen",r:"beine",z:"Hüftrotation · Gesäß",d:"C",pos:0,dos:"60 s · langsam",
    t:"Sitzen, Hände hinter dem Körper aufstützen, Füße weit aufgestellt. Beide Knie langsam zu einer Seite Richtung Boden sinken lassen, über die Mitte zur anderen Seite.",
    b:"Ausatmen beim Sinken.",x:"Nur so weit, wie es angenehm ist. Bei Hüftschmerz Füße enger stellen und kleiner bewegen.",
    an:{view:"front",mat:1,A:{yf:1,hy:9,aR:[48,2],aL:[-48,2],kR:[50,20],kL:[6,30],hR:[34,84],hL:[-34,84],bR:1,bL:-1},B:{yf:1,hy:9,aR:[48,2],aL:[-48,2],kR:[-6,30],kL:[-50,20],hR:[34,84],hL:[-34,84],bR:1,bL:-1},K:[{t:.5,kR:[30,46],kL:[-30,46]}],tempo:[2,.6,2,.6],ph:["Zur Seite","Zur anderen Seite"]}},
  wadenwand:{n:"Wadenwippe an der Wand",r:"beine",s:1,z:"Waden · Achillessehne",d:"C",pos:2,g:"fuss",dos:"60 s · je Seite 30 s, vorn 2 s",
    t:"Schrittstellung vor der Wand, Hände an der Wand. Das hintere Bein gestreckt, Ferse bleibt am Boden. Hüfte sanft Richtung Wand schieben, bis die Wade zieht, 2 s, zurück. Nach 30 s Seite wechseln.",
    b:"Ausatmen beim Vorschieben.",x:"Hintere Ferse bleibt unten, Fuß zeigt gerade nach vorn.",
    an:{anchor:"foot",noBal:1,fix2:1,A:{shin:-92,thigh:-90,torso:82,thigh2:-112,shin2:-112,foot2:-22,handAt:[59,140],bend:-1,neck:4},B:{shin:-110,thigh:-76,torso:78,thigh2:-128,shin2:-128,foot2:-38,handAt:[59,136],bend:-1,neck:4},eq:[{t:"wall",x:72}],tempo:[1.6,2,1.4,.4],ph:["Hüfte zur Wand","Zurück"]}},
  schmetterling:{n:"Schmetterling mit Knie-Wippen",r:"beine",s:1,z:"Adduktoren · Leiste",d:"C",pos:0,dos:"60 s · locker wippen",
    t:"Aufrecht sitzen, Fußsohlen zusammen, Hände an den Füßen. Knie locker und klein auf und ab wippen lassen.",
    b:"Gleichmäßig weiteratmen.",x:"Nicht mit den Händen auf die Knie drücken. Rücken lang.",
    an:{view:"front",mat:1,A:{yf:1,hy:9,aR:[6,4],aL:[-6,4],kR:[38,30],kL:[-38,30],hR:[9,92],hL:[-9,92],bR:1,bL:-1},B:{yf:1,hy:9,aR:[6,4],aL:[-6,4],kR:[44,17],kL:[-44,17],hR:[9,92],hL:[-9,92],bR:1,bL:-1},tempo:[.7,0,.7,0],ph:["Wippen","Wippen"]}},
  kniegegen:{n:"Knie zur Gegenschulter im Sitzen",r:"beine",s:1,z:"Gesäß · Hüfte außen",d:"C",pos:0,dos:"60 s · je Seite 2–3 s halten",
    t:"Aufrecht sitzen, ein Bein lang. Das andere Knie mit beiden Händen Richtung Gegenschulter ziehen, bis der Po zieht, 2–3 s halten, lösen. Nach 30 s Seite wechseln.",
    b:"Ausatmen beim Heranziehen.",x:"Sanft ziehen, kein Druck in der Leiste. Rücken bleibt lang.",
    an:{view:"front",mat:1,A:{yf:1,hy:9,kR:[30,40],aR:[40,4],kL:[-14,8],aL:[-16,4],hR:[26,112],hL:[14,108],bR:1,bL:1},B:{yf:1,hy:9,kR:[-4,58],aR:[-22,30],kL:[-14,8],aL:[-16,4],hR:[-2,134],hL:[-10,132],bR:1,bL:1},tempo:[1.6,2.4,1.4,.6],ph:["Heranziehen","Lösen"]}},
  hamsweep:{n:"Fersenstand mit Hüftbeuge",r:"beine",s:1,z:"Beinrückseite · Wade",d:"C",pos:2,g:"ham",dos:"60 s · je Seite 30 s",
    t:"Einen Fuß einen halben Schritt nach vorn, Ferse am Boden, Zehen hoch, hinteres Knie leicht gebeugt. Hüfte nach hinten schieben und mit den Händen am vorderen Bein entlang nach unten streichen, wieder aufrichten.",
    b:"Ausatmen beim Vorbeugen.",x:"Rücken bleibt lang, nur bis zu einem Ziehen hinten am Oberschenkel.",
    an:{anchor:"foot",noBal:1,fix2:1,A:{shin:-80,thigh:-80,torso:88,foot:50,thigh2:-100,shin2:-112,foot2:2,upper:-100,fore:-95},B:{shin:-70,thigh:-70,torso:38,foot:60,thigh2:-105,shin2:-112,foot2:2,upper:-70,fore:-62},tempo:[1.6,.6,1.4,.4],ph:["Vorbeugen","Aufrichten"]}},
  hufttor:{n:"Hüft-Tor öffnen und schließen",r:"beine",z:"Hüftgelenk · Gesäß",d:"C",pos:2,dos:"6 je Seite und Richtung",
    t:"Aufrecht stehen, Hände an der Hüfte. Ein Knie vorn auf Hüfthöhe heben, zur Seite öffnen und abstellen. Dann rückwärts: zur Seite heben, nach vorn schließen.",
    b:"Gleichmäßig weiteratmen.",x:"Langsam und klein genug, dass die Hüfte nicht zwickt. Bei Bedarf festhalten.",
    an:{view:"front",A:{yf:1,aR:[12,0],kR:[11,46],aL:[-12,0],kL:[-11,46],hR:[13,100],hL:[-13,100],bR:1,bL:-1},B:{yf:1,hx:-3,lean:-4,aR:[40,74],kR:[50,108],aL:[-12,0],kL:[-11,46],hR:[13,100],hL:[-13,100],bR:1,bL:-1},K:[{t:.45,hx:-3,lean:-3,aR:[8,80],kR:[10,120]}],tempo:[1.8,.5,1.8,.5],ph:["Öffnen","Schließen"]}},
  ausfallarme:{n:"Ausfallschritt rückwärts mit Armen nach oben",r:"beine",s:1,z:"Hüftbeuger · Oberschenkel vorn",d:"C",pos:2,g:"lunge",dos:"6 je Seite, 2 s halten",
    t:"Großer, ruhiger Schritt nach hinten, hinteres Knie Richtung Boden. Po fest, beide Arme nach oben strecken, 2 s lang machen, dann zurück in den Stand.",
    b:"Einatmen beim Strecken.",x:"Kein Hohlkreuz, Becken leicht aufrichten. Arme nur so hoch, wie die Schulter mag.",
    an:{anchor:"foot",noBal:1,A:{...WST,thigh2:-92,shin2:-94,upper:-90,fore:-90},B:{shin:-100,thigh:-25,torso:92,thigh2:-118,shin2:-160,foot2:-25,upper:92,fore:96},tempo:[1.8,2,1.6,.5],ph:["Schritt & strecken","Zurück"]}},
  seitkniebeuge:{n:"Seitschritt mit Kniebeuge",r:"beine",z:"Oberschenkel · Gesäß · Hüfte",d:"C",pos:2,dos:"8 je Seite",
    t:"Ruhiger Schritt zur Seite, Füße etwas weiter als schulterbreit, in eine halbe Kniebeuge sinken. Aufrichten, Füße wieder zusammen, zur anderen Seite.",
    b:"Einatmen runter, ausatmen hoch.",x:"Halbe Tiefe reicht, Knie zeigen über die Füße.",
    an:{view:"front",A:{yf:1,aR:[12,0],kR:[11,46],aL:[-12,0],kL:[-11,46],hR:[10,118],hL:[-10,118],bR:1,bL:-1},B:{yf:1,hy:74,hx:16,aR:[50,0],kR:[46,38],aL:[-12,0],kL:[-4,38],hR:[10,118],hL:[-10,118],bR:1,bL:-1},K:[{t:.35,hx:8,hy:90,aR:[34,8],kR:[28,48]}],tempo:[1.5,.4,1.3,.4],ph:["Schritt & beugen","Zurück"]}},
  /* ---------- Rumpf bzw. Ganzkörper ---------- */
  raupe:{n:"Raupe (Inchworm)",r:"rumpf",z:"Ganzkörper · Beinrückseite · Schultern",d:"ABC",pos:2,dos:"4–5 Wiederholungen, langsam",
    t:"Aus dem Stand nach vorn beugen, Hände vor die Füße. Mit den Händen langsam bis in den hohen Stütz laufen, kurz halten, zurücklaufen und aufrollen.",
    b:"Gleichmäßig weiteratmen.",x:"Nur so weit hinauslaufen, wie die Schultern es mögen. Knie dürfen gebeugt sein.",
    an:{anchor:"foot",noBal:1,A:{shin:-90,thigh:-90,torso:88,handAt:[14,100],bend:-1,foot:0,at:[0,0],neck:0},B:{shin:200,thigh:200,torso:20,handAt:[141,4],bend:-1,foot:-70,at:[0,10.5],neck:-4},K:[{t:.09,handAt:[32,84]},{t:.18,torso:10,handAt:[44,60]},{t:.35,shin:-92,thigh:-80,torso:-70,handAt:[30,2],foot:0,at:[0,0],neck:-20},{t:.65,shin:240,thigh:240,torso:-40,handAt:[110,2],foot:-40,at:[0,7.5],neck:-14}],tempo:[6,1,6,1],ph:["Hinauslaufen","Zurücklaufen"]}},
  rumpfdreh:{n:"Rumpfdrehen im Stehen",r:"rumpf",z:"Brustwirbelsäule · Rumpf",d:"AB",pos:2,dos:"60 s · locker",
    t:"Etwas mehr als hüftbreit stehen, Knie weich. Oberkörper locker nach rechts und links drehen, die Arme schwingen lose mit, Hüfte bleibt weitgehend vorn.",
    b:"Gleichmäßig weiteratmen.",x:"Locker drehen, nicht reißen. Die Bewegung wird nach und nach größer.",
    an:{view:"front",A:{yf:1,ua:-20,us:.7,fa:-40,fs:.6,uaL:0,usL:.6,faL:0,fsL:.6,s:14,hx:1},B:{yf:1,ua:180,us:.6,fa:180,fs:.6,uaL:200,usL:.7,faL:220,fsL:.6,s:14,hx:-1},tempo:[1,0,1,0],ph:["Drehen","Drehen"]}},
  kniehover:{n:"Knie schweben im Vierfüßler",r:"rumpf",z:"Tiefe Bauchmuskeln · Schultergürtel",d:"ABC",pos:1,g:"vf",dos:"8 Wiederholungen, 3 s halten",
    t:"Vierfüßlerstand, Zehen aufgestellt. Bauch leicht fest und die Knie zwei, drei Zentimeter vom Boden lösen, 3 s schweben, absetzen.",
    b:"Ruhig weiteratmen, nicht pressen.",x:"Rücken bleibt flach wie ein Tisch, Hände drücken den Boden weg.",
    an:{anchor:"foot",mat:1,A:{shin:176,thigh:-90,torso:10,foot:-52,at:[-44,8],handAt:[57,1],bend:-1},B:{shin:181,thigh:-90,torso:6,foot:-52,at:[-44,8],handAt:[57,1],bend:-1},tempo:[.9,3,.9,.8],ph:["Schweben","Absetzen"]}},
  weltbeste:{n:"Weltbeste Dehnung",r:"rumpf",s:1,z:"Hüftbeuger · Brustwirbelsäule · Leiste",d:"AC",pos:1,g:"lunge",dos:"60 s · je Seite 3 Durchgänge",
    t:"Aus dem Stütz einen Fuß neben die Hand stellen, hinteres Knie am Boden. Ellbogen innen Richtung Fuß sinken lassen, dann denselben Arm weit zur Decke aufdrehen und dem Blick folgen lassen. Nach 3 Durchgängen Seite wechseln.",
    b:"Ausatmen nach unten, einatmen beim Aufdrehen.",x:"Hinteres Knie weich ablegen, nur so tief, wie die Hüfte frei bleibt. Aufdrehen aus dem Brustkorb.",
    an:{anchor:"foot",noBal:1,mat:1,A:{shin:-115,thigh:-5,torso:10,thigh2:-117.7,shin2:180,foot2:180,upper:-95,fore:-50,hand2:[-7,-54.8],bend2:-1,neck:-10},B:{shin:-115,thigh:-5,torso:12,thigh2:-117.7,shin2:180,foot2:180,upper:88,fore:90,hand2:[-7,-56],bend2:-1,neck:30},K:[{t:.5,upper:-10,fore:0,neck:10}],tempo:[2,1,2,.8],ph:["Aufdrehen","Ellbogen runter"]}},
  ausfalldreh:{n:"Ausfallschritt mit Rotation",r:"rumpf",s:1,z:"Hüftbeuger · Brustwirbelsäule",d:"AC",pos:2,g:"lunge",dos:"6 je Seite",
    t:"Ruhiger Schritt nach vorn in einen Ausfallschritt, Hände vor der Brust. Unten den Oberkörper zum vorderen Bein drehen und die Arme öffnen, zurückdrehen, in den Stand. Seiten abwechseln.",
    b:"Ausatmen beim Drehen.",x:"Vorderes Knie über dem Fuß, Becken bleibt gerade. Nur so tief, wie es angenehm ist.",
    an:{anchor:"foot",noBal:1,A:{...WST,thigh2:-92,shin2:-94,hand:[14,-12],bend:-1,hand2:[12,-13],bend2:-1},B:{shin:-100,thigh:-20,torso:88,thigh2:-115,shin2:-165,foot2:-20,upper:0,fore:0,upper2:180,fore2:180},K:[{t:.6,shin:-100,thigh:-20,torso:88,thigh2:-115,shin2:-165,foot2:-20}],tempo:[2,1.2,1.8,.5],ph:["Schritt & drehen","Zurück"]}},
  ellbknie:{n:"Ellbogen zum Gegenknie im Stand",r:"rumpf",z:"Schräge Bauchmuskeln · Hüftbeuger",d:"BC",pos:2,dos:"10 je Seite",
    t:"Aufrecht stehen, Fingerspitzen locker an die Schläfen. Ein Knie heben und den Gegenellbogen mit leichter Drehung Richtung Knie führen. Ruhig im Wechsel.",
    b:"Ausatmen, wenn Knie und Ellbogen sich nähern.",x:"Knie und Ellbogen müssen sich nicht berühren. Nicht am Kopf ziehen.",
    an:{view:"front",A:{yf:1,aR:[12,0],kR:[11,46],aL:[-12,0],kL:[-11,46],hR:[12,166],hL:[-12,166],bR:1,bL:-1},B:{yf:1,hx:3,lean:10,aR:[12,0],kR:[11,46],aL:[-10,76],kL:[-2,114],hR:[12,166],hL:[-12,166],bR:1,bL:-1},tempo:[1,.4,1,.4],ph:["Zusammen","Zurück"]}},
  diagstreck:{n:"Diagonales Strecken im Stand",r:"rumpf",z:"Ganzkörper · Flanke",d:"ABC",pos:2,dos:"60 s · im Wechsel",
    t:"Aufrecht stehen. Einen Arm schräg nach oben strecken und gleichzeitig das Gegenbein seitlich antippen, den Körper lang machen. Zurück, andere Seite.",
    b:"Einatmen beim Strecken.",x:"Arm nur so hoch, wie die Schulter frei bleibt. Kein Hohlkreuz.",
    an:{view:"front",A:{yf:1,ua:60,fa:62,uaL:-96,faL:-94,aR:[12,0],kR:[11,46],aL:[-40,3],kL:[-24,47],lean:-5},B:{yf:1,ua:-84,fa:-86,uaL:-240,faL:-242,aR:[40,3],kR:[24,47],aL:[-12,0],kL:[-11,46],lean:5},K:[{t:.5,ua:-60,fa:-70,uaL:-120,faL:-110,aR:[12,0],kR:[11,46],aL:[-12,0],kL:[-11,46],lean:0}],tempo:[1.6,.8,1.6,.8],ph:["Strecken","Andere Seite"]}},
  abrollen:{n:"Abrollen und Aufrollen",r:"rumpf",s:1,z:"Rücken · Beinrückseite",d:"BC",pos:2,dos:"6 Wiederholungen",
    t:"Hüftbreit stehen, Knie weich. Kinn zur Brust und Wirbel für Wirbel nach unten abrollen, Arme hängen, unten 2 s locker hängen. Langsam wieder aufrollen, der Kopf kommt zuletzt.",
    b:"Ausatmen beim Abrollen, einatmen beim Aufrollen.",x:"Knie gebeugt lassen, langsam. Bei Schwindel kleiner bewegen.",
    an:{anchor:"foot",noBal:1,A:{shin:-91,thigh:-88,torso:88,upper:-90,fore:-90,neck:0,lum:1,tho:-1},B:{shin:-95,thigh:-76,torso:-28,upper:-92,fore:-68,neck:-30,lum:6,tho:4},K:[{t:.4,torso:40,neck:-40,upper:-100,fore:-100,lum:4,tho:4}],tempo:[3,2,3,.6],ph:["Abrollen","Aufrollen"]}},
  zehenstreck:{n:"Strecken auf die Zehenspitzen",r:"rumpf",z:"Ganzkörper · Waden · Schultern",d:"AB",pos:2,dos:"10 Wiederholungen",
    t:"Hüftbreit stehen. Arme vorn nach oben strecken und gleichzeitig auf die Zehenspitzen gehen, ganz lang machen, langsam zurück.",
    b:"Einatmen beim Strecken, ausatmen beim Absenken.",x:"Arme nur so hoch, wie es in der Schulter angenehm ist. Bei Bedarf an der Wand festhalten.",
    an:{anchor:"foot",noBal:1,plantToe:1,A:{...WST,upper:-88,fore:-88,foot:0,at:[0,0]},B:{shin:-90,thigh:-90,torso:90,upper:88,fore:90,foot:-38,at:[0,0],neck:4},tempo:[1.4,1,1.4,.4],ph:["Strecken","Absenken"]}},
  beckenkipp:{n:"Beckenkippen in Rückenlage",r:"rumpf",z:"Unterer Rücken · tiefe Bauchmuskeln",d:"BC",pos:0,dos:"12 Wiederholungen",
    t:"Rückenlage, Beine aufgestellt. Den unteren Rücken sanft in den Boden drücken, das Becken kippt leicht nach hinten, dann ein kleines Hohlkreuz machen. Ruhig im Wechsel.",
    b:"Ausatmen beim Drücken, einatmen beim Hohlkreuz.",x:"Kleine Bewegung, Po bleibt am Boden.",
    an:{anchor:"shoulder",mat:1,A:{at:[0,9],torso:180,thigh:40,shin:-57,upper:-9,fore:-5,neck:0,lum:-4,tho:-1},B:{at:[0,9],torso:181,thigh:42,shin:-55,upper:-9,fore:-5,neck:0,lum:5,tho:1},tempo:[1.4,.5,1.4,.5],ph:["Rücken flach","Hohlkreuz"]}},
  stepjack:{n:"Step-Jacks (Hampelmann ohne Sprung)",r:"rumpf",z:"Ganzkörper · Kreislauf",d:"ABC",pos:2,dos:"60 s · im Wechsel",
    t:"Aufrecht stehen. Ein Bein zur Seite tippen und gleichzeitig die Arme seitlich über den Kopf führen. Zurück und zur anderen Seite, ganz ohne Sprung.",
    b:"Gleichmäßig weiteratmen.",x:"Arme nur so hoch, wie die Schulter frei bleibt, Knie weich.",
    an:{view:"front",A:{yf:1,ua:66,fa:72,aR:[42,2],kR:[26,47],aL:[-12,0],kL:[-11,46],lean:-3},B:{yf:1,ua:66,fa:72,aR:[12,0],kR:[11,46],aL:[-42,2],kL:[-26,47],lean:3},K:[{t:.5,ua:-75,fa:-80,aR:[12,0],kR:[11,46],aL:[-12,0],kL:[-11,46],lean:0}],tempo:[1.4,.2,1.4,.2],ph:["Rechts","Links"]}}
};
const WX_KEYS=Object.keys(WX);
for(const k of WX_KEYS){const d=WX[k].an;const def={eq:[],floor:0,tempo:[1.4,.4,1.4,.4],ph:["",""],lag:.08,noLoop:1/* Matte ja, aber ohne Yoga-Weg aus dem Stand */,...d};def.A={...d.A};def.B={...d.B};if(d.K)def.K=d.K.map(x=>({...x}));AN["w_"+k]=def}
/* Pool: neue Übungen zuerst, dazu ausgewählte bestehende (wo sinnvoll). nd/g/pos wie in 3.13, s = Dehnen */
{const KEEP={wandengel:"A",katzekuh:"ABC",pullapart:"B",aussenrot:"AB",bruecke:"C",kniewand:"C",birddog:"BC"};
  const CORE={wandengel:"A",pullapart:"B",aussenrot:"AB",bruecke:"C",kniewand:"C"};const RC={push:"A",pull:"B",beine:"C",rumpf:""};
  const old=WPOOL.filter(w=>KEEP[w.k]).map(w=>({...w,d:KEEP[w.k],c:CORE[w.k]||"",g:w.k==="pullapart"?"pa":w.k==="kniewand"?"fuss":w.k==="wandengel"?"wand":w.k==="katzekuh"||w.k==="birddog"?"vf":w.g}));
  /* 3.14 Abnahme: Halo nur in der Bibliothek, nicht im Aufwärm-Pool (Überkopf-Kreis bei Schulterbeschwerden heikel) */
  const NOPOOL=new Set(["halo"]);
  const neu=WX_KEYS.filter(k=>!NOPOOL.has(k)).map(k=>{const w=WX[k];return{k,n:w.n,an:"w_"+k,d:w.d,c:[...w.d].filter(x=>RC[w.r]===x).join(""),j:"warm_"+k,pos:w.pos,g:w.g,nd:w.nd,s:w.s?1:0,t:w.t,b:w.b,x:w.x,dos:w.dos,nw:1}});
  WPOOL.splice(0,WPOOL.length,...neu,...old)}
function wxCan(k){const n=WX[k].nd;return!n||n.some(s=>s.every(hasGear))}
function wxGear(k){const n=WX[k].nd;if(!n)return"Ohne Geräte";return n.map(a=>a.map(id=>(GEAR.find(g=>g.id===id)||{l:id}).l).join(" + ")).join(" oder ")}
function wxRegName(r){const x=WX_REG.find(a=>a[0]===r);return x?x[1]:r}

/* ---------- Bibliothek: dritter Reiter „Aufwärmen“ ---------- */
let WLF={r:"",s:0};
libSeg=function(){return`<div class="seg" id="libSeg"><button data-lm="kraft" aria-pressed="${LIBMODE==="kraft"}">Kraft</button><button data-lm="yoga" aria-pressed="${LIBMODE==="yoga"}">Yoga & Dehnen</button><button data-lm="warm" aria-pressed="${LIBMODE==="warm"}">Aufwärmen</button></div>`};
function renderWarmLib(){const ks=WX_KEYS.filter(k=>(!WLF.r||WX[k].r===WLF.r)&&(!WLF.s||(WLF.s===1?WX[k].s:!WX[k].s)));const nS=WX_KEYS.filter(k=>WX[k].s).length;
  $("#v-lib").innerHTML=`${libSeg()}<h1 style="font-size:34px">Aufwärmen</h1><p class="muted" style="margin:-8px 0 0">${WX_KEYS.length} Übungen fürs Aufwärmen, davon ${nS} dynamische Dehnungen. Sanft, ohne Sprünge, schulter- und hüftfreundlich. Im Training kommen sie nach 5 Minuten Crosstrainer, passend zum Tag.</p>
   <div class="label">Bereich</div><div class="row" style="flex-wrap:wrap;gap:6px"><button class="chip" data-wr="" aria-pressed="${!WLF.r}">Alle</button>${WX_REG.map(([k,l])=>`<button class="chip" data-wr="${k}" aria-pressed="${WLF.r===k}">${esc(l)}</button>`).join("")}</div>
   <div class="label">Art</div><div class="row" style="flex-wrap:wrap;gap:6px">${[[0,"Alle"],[2,"Mobilisation & Aktivierung"],[1,"Dehnen"]].map(([v,l])=>`<button class="chip" data-ws="${v}" aria-pressed="${WLF.s===v}">${l}</button>`).join("")}</div>
   <div class="label" id="wCount">${ks.length} Übungen</div>
   ${ks.map(k=>{const w=WX[k];const ok=wxCan(k);return`<button class="libitem${ok?"":" off"}" data-wx="${k}"><canvas data-wmini="${k}"></canvas><span><b>${esc(w.n)}</b><small>${ok?esc(wxRegName(w.r))+" · "+esc(w.z):"Gerät fehlt: "+esc(wxGear(k))}</small></span><span class="sr">${w.s?`<span class="tag wtag">Dehnen</span>`:""}</span></button>`}).join("")||`<div class="empty">Keine Übung für diese Auswahl.</div>`}`;
  bindLibSeg();for(const c of document.querySelectorAll("[data-wmini]"))attachAnim(c,"w_"+c.dataset.wmini,{still:1});
  for(const b of document.querySelectorAll("[data-wr]"))b.onclick=()=>{WLF.r=b.dataset.wr;renderWarmLib()};
  for(const b of document.querySelectorAll("[data-ws]"))b.onclick=()=>{WLF.s=+b.dataset.ws;renderWarmLib()};
  for(const b of document.querySelectorAll("[data-wx]"))b.onclick=()=>openWarmSheet(b.dataset.wx)}
function openWarmSheet(k){const w=WX[k];const ok=wxCan(k);
  openSheet(`<div class="row between"><div><div class="label">Aufwärmen · ${esc(wxRegName(w.r))}</div><h2 style="font-size:28px;margin-top:4px">${esc(w.n)}</h2></div><button class="iconbtn" data-close aria-label="Schließen"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
   <div class="stage"><canvas id="wsc"></canvas><span class="phase" id="wsp"></span><span class="readout">${esc(w.z.toUpperCase())}</span></div>
   <div class="tagline">${w.s?`<span class="tag wtag">Dehnen · dynamisch</span>`:`<span class="tag">Mobilisation & Aktivierung</span>`}<span class="tag">${esc(w.dos)}</span><span class="tag">${esc(wxGear(k))}</span><span class="tag">${WPOOL.some(p=>p.k===k)?"Aufwärmen "+[...w.d].map(d=>WX_DAYN[d]).join(", "):"nicht im automatischen Aufwärmen"}</span></div>
   <div><div class="label" style="margin-bottom:8px">So geht's</div><p style="margin:0">${esc(w.t)}</p></div>
   <div class="hint"><b>Atmung:</b> ${esc(w.b)}</div><div class="ywarn"><b>Achtung:</b> ${esc(w.x)}</div>
   ${ok?"":`<div class="hint"><b>Gerät fehlt:</b> ${esc(wxGear(k))}. Im Aufwärmen wird diese Übung nicht eingeplant.</div>`}`);
  attachAnim($("#wsc"),"w_"+k,{phaseEl:$("#wsp")})}
{const st=document.createElement("style");st.textContent=`.tag.wtag{color:var(--gold);border-color:rgba(245,183,46,.45)}`;document.head.appendChild(st);
  const _lib=renderLib;renderLib=function(){if(LIBMODE==="warm"){renderWarmLib();return}_lib()};RENDER.lib=renderLib}
