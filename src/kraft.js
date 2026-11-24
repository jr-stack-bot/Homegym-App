/* ================= KRAFT-BIBLIOTHEK +100 (@ Joschy) =================
   ~100 neue, verbreitete Kraft- und Körpergewichtsübungen: mit Joschys Geräten (Langhantel, Rack, Bank, Kurzhanteln,
   Klimmzugstange, Band; Kettlebells wenn aktiv) und viele ohne Geräte bzw. mit Alltagsgegenständen.
   · Jede Übung: Anleitung (cues), typische Fehler (bad), Atmung (atem), Sicherheit/Schulter-Hüfte (safe, jr), leichtere Variante (easy),
     Stufe (lvl), Wiederholungsbereich (rr / hr), Muskeln (m, MG_OF), Kategorie/Bewegungsmuster (CAT/SUB), Tag (DAYEX), Geräte (NEEDS), Animation (AN).
   · Plan: neue Übungen rotieren NUR auf Neben-/Zusatz-Plätzen (nie Hauptübungen, nie Bonus/Griff-Block), passend zum Tag und nur mit
     aktiven Geräten. Rhythmus: Zyklus 1, 3, 5 … = gewohnter Plan, Zyklus 2, 4 … = bis zu 2 Nebenplätze pro Einheit mit neuen Übungen
     (wechseln von Zyklus zu Zyklus). Rein aus S.prog.cycle berechnet: kein neuer Zustand, keine Migration, laufende Einheit unberührt.
   · Die bisherige Geräte-Anpassung (adaptCore) sieht die neuen Übungen nicht: Pläne im Zyklus 1 bleiben exakt wie vorher.
   · Tauschen: bietet zusätzlich bis zu 2 passende neue Übungen an. */
const KX_RISK={sh:"Schulter",hip:"Hüfte",knee:"Knie",wrist:"Handgelenk",back:"unterer Rücken"};
const KXD={
/* ---------------- BRUST (Tag A) ---------------- */
bbfloor:{n:"Bodendrücken mit Langhantel",eq:"Langhantel · Rack",m:"Brust · Trizeps",type:"bar",rest:120,inc:2.5,lvl:2,c:"brust",s:"chest",g:"brust",d:"A",nd:[["barbell","rack"]],easy:"dbfloor",
  cues:["Im Rack auf den Boden legen, Ablagen auf Stangenhöhe bei gestreckten Armen","Knie gebeugt, Füße fest am Boden","Stange zur unteren Brust ablassen, bis die Oberarme den Boden berühren","Kurz ablegen, dann kraftvoll hochdrücken"],
  bad:["Ellbogen knallen auf den Boden","Ellbogen ganz seitlich abgespreizt"],atem:"Beim Ablassen einatmen, beim Hochdrücken ausatmen.",
  safe:"Schulter: Der Boden begrenzt die Tiefe, das schont die Schulter. Ellbogen etwa 45° vom Körper."},
dbfloor:{n:"Kurzhantel-Bodendrücken",eq:"Kurzhanteln · Matte",m:"Brust · Trizeps",type:"db",rest:90,inc:2,lvl:1,c:"brust",s:"chest",g:"brust",d:"A",nd:[["db"]],easy:"pushknee",harder:"dbbench",
  cues:["Rückenlage, Knie gebeugt, Hanteln über der Brust","Hanteln langsam senken, bis die Oberarme den Boden berühren","Unten kurz ruhen lassen","Gerade nach oben drücken"],
  bad:["Ellbogen fallen hart auf den Boden","Hanteln kippen nach außen"],atem:"Beim Senken einatmen, beim Drücken ausatmen.",
  safe:"Schulter: schulterschonend, weil der Boden die Tiefe begrenzt. Hanteln aus den Knien auf die Brust rollen."},
bbincline:{n:"Schrägbankdrücken mit Langhantel",eq:"Langhantel · Bank · Rack",m:"Obere Brust · Schultern · Trizeps",type:"bar",rest:120,inc:2.5,lvl:2,c:"brust",s:"chest",g:"brust",d:"A",nd:[["barbell","rack","bench"]],easy:"incline",
  cues:["Bank auf etwa 30° im Rack, Stange knapp über Armlänge","Schulterblätter zurück und nach unten","Stange zur oberen Brust ablassen","Gerade nach oben drücken, Po bleibt auf der Bank"],
  bad:["Bank zu steil (wird zu Schulterdrücken)","Stange auf der Brust abfedern"],atem:"Beim Ablassen einatmen, beim Drücken ausatmen.",
  safe:"Schulter: Sicherheitsablagen knapp über der Brust einstellen. Bei Schulterschmerz Bank flacher stellen."},
squeezepress:{n:"Squeeze Press mit Kurzhanteln",eq:"Kurzhanteln · Bank",m:"Innere Brust · Trizeps",type:"db",rest:75,inc:2,lvl:1,c:"brust",s:"chest",g:"brust",d:"A",nd:[["db","bench"]],easy:"dbfloor",
  cues:["Rückenlage auf der Bank, Hanteln über der Brust","Hanteln fest gegeneinander drücken, Handflächen zueinander","Gemeinsam zur Brustmitte ablassen","Hochdrücken, ohne den Druck zu lösen"],
  bad:["Hanteln lösen sich voneinander","Schultern rollen nach vorn"],atem:"Beim Ablassen einatmen, beim Drücken ausatmen.",
  note:"Leichte Hanteln reichen, die Spannung kommt vom Zusammendrücken."},
dbpullover:{n:"Kurzhantel-Überzüge",eq:"Kurzhantel · Bank",m:"Brust · Lat · Trizeps",type:"db",rest:75,inc:2,lvl:2,c:"brust",s:"chest",g:"brust",d:"A",nd:[["db","bench"]],easy:"dbfloor",jr:"sh",
  cues:["Rückenlage auf der Bank, eine Hantel mit beiden Händen über der Brust","Arme fast gestreckt, Ellbogen leicht gebeugt","Hantel im Bogen hinter den Kopf senken","Im gleichen Bogen zurück über die Brust ziehen"],
  bad:["Zu tief hinter den Kopf","Hohlkreuz beim Senken"],atem:"Beim Senken einatmen, beim Zurückziehen ausatmen.",
  safe:"Schulter: nur so weit hinter den Kopf, wie es ohne Ziehen in der Schulter geht. Hantel sicher an der Scheibe umgreifen."},
pushleg:{n:"Einbeinige Liegestütze",eq:"Ohne Gerät · Matte",m:"Brust · Trizeps · Rumpf · Gesäß",type:"bw",rest:75,inc:0,lvl:2,rr:[6,12],c:"brust",s:"chest",g:"brust",d:"A",nd:[],easy:"pushup",
  cues:["Liegestütz-Position, Hände unter den Schultern","Ein gestrecktes Bein eine Handbreit vom Boden heben","Liegestütz ausführen, Bein bleibt oben, Hüfte gerade","Nach der Hälfte der Wiederholungen Bein wechseln"],
  bad:["Hüfte dreht auf","Hohlkreuz durch zu hohes Bein"],atem:"Beim Ablassen einatmen, beim Hochdrücken ausatmen."},
bandchest:{n:"Brustdrücken mit Band stehend",eq:"Widerstandsband · Rack",m:"Brust · Trizeps · Schultern",type:"band",rest:60,inc:0,lvl:1,c:"brust",s:"chest",g:"brust",d:"A",nd:[["band","rack"]],easy:"wallpush",
  cues:["Band hinter dir auf Brusthöhe am Rack befestigen","Schrittstellung, Bauch fest","Hände von der Brust nach vorn drücken, bis die Arme gestreckt sind","Langsam zurück zur Brust"],
  bad:["Oberkörper lehnt sich nach vorn","Schultern ziehen zu den Ohren"],atem:"Beim Drücken ausatmen, beim Zurückführen einatmen."},
plyopush:{n:"Explosive Liegestütze",eq:"Ohne Gerät · Matte",m:"Brust · Trizeps · Schnellkraft",type:"bw",rest:90,inc:0,lvl:3,rr:[4,8],c:"brust",s:"chest",g:"brust",d:"A",nd:[],easy:"pushup",jr:"wrist",
  cues:["Normale Liegestütz-Position","Kontrolliert ablassen","So explosiv hochdrücken, dass die Hände kurz abheben","Weich mit leicht gebeugten Armen landen"],
  bad:["Mit gestreckten Armen landen","Hüfte hängt durch"],atem:"Beim Ablassen einatmen, beim Abdrücken kräftig ausatmen.",
  safe:"Handgelenk und Schulter: nur ausgeruht und aufgewärmt. Bei Schmerz aufhören und normale Liegestütze machen."},
hindupush:{n:"Hindu-Liegestütze",eq:"Ohne Gerät · Matte",m:"Brust · Schultern · Trizeps · Mobilität",type:"bw",rest:75,inc:0,lvl:2,rr:[6,10],c:"brust",s:"chest",g:"brust",d:"A",nd:[],easy:"pushknee",jr:"sh",
  cues:["Start im umgekehrten V, Hüfte hoch","Brust im Bogen dicht über dem Boden nach vorn führen","Arme strecken, Brust hoch, Blick nach vorn","Hüfte zurück nach oben schieben"],
  bad:["Hüfte fällt durch, Hohlkreuz","Schultern zu den Ohren"],atem:"Beim Nach-vorn-Gleiten einatmen, beim Zurückschieben ausatmen.",
  safe:"Schulter: langsam beginnen, kleiner Bogen. Bei Ziehen in der Schulter auslassen."},
svend:{n:"Svend Press mit Hantelscheibe",eq:"Hantelscheibe",m:"Innere Brust · Schultern",type:"db",rest:60,inc:1.25,lvl:1,c:"brust",s:"chest",g:"brust",d:"A",nd:[["barbell"]],easy:"bandchest",
  cues:["Eine Hantelscheibe zwischen beide Handflächen nehmen","Vor der Brust fest zusammendrücken","Langsam nach vorn strecken","Zurück zur Brust, Druck nicht lösen"],
  bad:["Scheibe rutscht, zu wenig Druck","Schultern ziehen nach oben"],atem:"Beim Strecken ausatmen, beim Zurückführen einatmen.",
  note:"Mit kleinen Scheiben (5–10 kg) starten."},

/* ---------------- SCHULTER: Drücken & Heben (Tag A) ---------------- */
dbohpstand:{n:"Kurzhantel-Schulterdrücken stehend",eq:"Kurzhanteln",m:"Schultern · Trizeps · Rumpf",type:"db",rest:90,inc:2,lvl:2,c:"schulter",s:"press",g:"schulter",d:"A",nd:[["db"]],easy:"ohpdb",jr:"sh",
  cues:["Hanteln auf Schulterhöhe, Handflächen nach vorn oder zueinander","Po und Bauch fest, kein Hohlkreuz","Gerade über den Kopf drücken","Kontrolliert zurück auf Schulterhöhe"],
  bad:["Starkes Hohlkreuz","Schwung aus den Beinen"],atem:"Beim Drücken ausatmen, beim Ablassen einatmen.",
  safe:"Schulter: Neutralgriff (Handflächen zueinander) ist meist angenehmer. Nur schmerzfrei nach oben."},
ohpuni:{n:"Einarmiges Kurzhantel-Drücken",eq:"Kurzhantel",m:"Schultern · Trizeps · seitlicher Rumpf",type:"db",rest:75,inc:2,lvl:2,uni:1,c:"schulter",s:"press",g:"schulter",d:"A",nd:[["db"]],easy:"packpress",jr:"sh",
  cues:["Eine Hantel auf Schulterhöhe, freie Hand an die Hüfte","Rumpf fest, nicht zur Seite lehnen","Hantel gerade nach oben drücken","Langsam zurück, Seite wechseln"],
  bad:["Oberkörper kippt zur Seite","Hohlkreuz"],atem:"Beim Drücken ausatmen, beim Ablassen einatmen.",
  safe:"Schulter: Neutralgriff und leichtes Gewicht. Einseitig lässt sich die Bahn gut an die Schulter anpassen."},
bbpushpress:{n:"Push Press mit Langhantel",eq:"Langhantel · Rack",m:"Schultern · Trizeps · Beine",type:"bar",rest:120,inc:2.5,lvl:3,c:"schulter",s:"press",g:"schulter",d:"A",nd:[["barbell","rack"]],easy:"ohp",jr:"sh",
  cues:["Stange vorn auf den Schultern, wie beim Schulterdrücken","Kurz in die Knie (Dip), Oberkörper bleibt senkrecht","Aus den Beinen explosiv strecken und die Stange hochdrücken","Oben Arme gestreckt, kontrolliert zurück auf die Schultern"],
  bad:["Zu tiefer Dip (wird zur Kniebeuge)","Hohlkreuz oben"],atem:"Vor dem Dip einatmen und Bauch fest, oben ausatmen.",
  safe:"Schulter: schwerer als normales Drücken, nur mit sauberer Technik. Ablagen auf Schulterhöhe."},
zpress:{n:"Z-Press",eq:"Kurzhanteln · Boden",m:"Schultern · Trizeps · Rumpf",type:"db",rest:90,inc:2,lvl:3,c:"schulter",s:"press",g:"schulter",d:"A",nd:[["db"]],easy:"ohpdb",jr:"hip",
  cues:["Aufrecht auf den Boden setzen, Beine gestreckt","Hanteln auf Schulterhöhe","Ohne Lehne gerade nach oben drücken","Oberkörper bleibt senkrecht, kein Zurücklehnen"],
  bad:["Rücken rundet sich","Nach hinten lehnen"],atem:"Beim Drücken ausatmen, beim Ablassen einatmen.",
  safe:"Hüfte und Beinrückseite: Bei zu wenig Beweglichkeit Beine leicht grätschen oder auf ein Kissen setzen."},
landmine:{n:"Landmine-Drücken",eq:"Langhantel · Ecke oder Scheibe als Halt",m:"Obere Brust · Schultern · Rumpf",type:"bar",rest:90,inc:2.5,lvl:2,c:"schulter",s:"press",g:"schulter",d:"A",nd:[["barbell"]],easy:"bandchest",
  cues:["Ein Stangenende in eine Zimmerecke (Handtuch dazwischen) klemmen","Anderes Ende mit beiden Händen vor die Brust","Schräg nach vorn-oben drücken","Langsam zurück zur Brust"],
  bad:["Hohlkreuz","Stange rutscht in der Ecke"],atem:"Beim Drücken ausatmen, beim Zurückführen einatmen.",
  safe:"Schulter: Die schräge Bahn ist für die Schulter angenehmer als Drücken über Kopf."},
platefront:{n:"Frontheben mit Hantelscheibe",eq:"Hantelscheibe",m:"Vordere Schulter",type:"db",rest:60,inc:1.25,lvl:1,c:"schulter",s:"raise",g:"schulter",d:"A",nd:[["barbell"]],easy:"bottlefront",
  cues:["Scheibe mit beiden Händen seitlich greifen","Arme fast gestreckt bis auf Augenhöhe heben","Oben kurz halten","Langsam ablassen"],
  bad:["Schwung aus dem Rücken","Über Kopfhöhe reißen"],atem:"Beim Heben ausatmen, beim Ablassen einatmen."},
bandlateral:{n:"Seitheben mit Band",eq:"Widerstandsband",m:"Seitliche Schulter",type:"band",rest:60,inc:0,lvl:1,c:"schulter",s:"raise",g:"schulter",d:"A",nd:[["band"]],easy:"bottleraise",
  cues:["Mit beiden Füßen auf die Bandmitte stellen","Enden seitlich greifen, Ellbogen minimal gebeugt","Arme bis Schulterhöhe heben","Langsam gegen den Zug ablassen"],
  bad:["Schultern zu den Ohren","Über Schulterhöhe heben"],atem:"Beim Heben ausatmen, beim Ablassen einatmen."},
uprightrow:{n:"Aufrechtes Rudern mit Kurzhanteln",eq:"Kurzhanteln",m:"Seitliche Schulter · Nacken",type:"db",rest:60,inc:1,lvl:2,c:"schulter",s:"raise",g:"schulter",d:"A",nd:[["db"]],easy:"lateral",jr:"sh",
  cues:["Hanteln vor den Oberschenkeln, schulterbreit","Ellbogen führen nach oben-außen","Nur bis etwa Brusthöhe ziehen","Langsam ablassen"],
  bad:["Über Schulterhöhe ziehen","Hanteln zu eng"],atem:"Beim Ziehen ausatmen, beim Ablassen einatmen.",
  safe:"Schulter: kann die Schulter einklemmen. Nur bis Brusthöhe, leichtes Gewicht. Bei Schulterproblemen lieber Seitheben."},

/* ---------------- SCHULTER hinten & Nacken (Tag B) ---------------- */
wallslide:{n:"Wandgleiten (Wall Slides)",eq:"Ohne Gerät · Wand",daily:"Wand",m:"Hintere Schulter · Schulterblätter",type:"bw",rest:45,inc:0,lvl:1,rr:[8,12],c:"schulter",s:"rear",g:"schulter",d:"B",nd:[],easy:"ytw",
  cues:["Rücken, Po und Kopf an die Wand","Unterarme und Handrücken an der Wand, Arme wie ein W","Arme an der Wand nach oben schieben zum Y","Schulterblätter nach unten ziehen und zurück zum W"],
  bad:["Hohlkreuz, Rücken löst sich","Schultern zu den Ohren"],atem:"Beim Hochschieben ausatmen, beim Zurückführen einatmen.",
  note:"Ideal für gesunde Schultern und als Aufwärmen vor dem Drücken."},
bandextrot:{n:"Außenrotation mit Band",eq:"Widerstandsband",m:"Rotatorenmanschette · hintere Schulter",type:"band",rest:45,inc:0,lvl:1,c:"schulter",s:"rear",g:"schulter",d:"B",nd:[["band"]],easy:"wallslide",
  cues:["Band mit beiden Händen, Ellbogen fest an den Seiten, 90° gebeugt","Unterarme zeigen nach vorn","Hände nach außen drehen, Ellbogen bleiben am Körper","Langsam zurück"],
  bad:["Ellbogen lösen sich vom Körper","Zu starkes Band"],atem:"Beim Öffnen ausatmen, beim Zurückführen einatmen.",
  note:"Kleine Muskeln, leichtes Band. Gut für die Schultergesundheit."},
bandpullapart:{n:"Band Pull-Aparts",eq:"Widerstandsband",m:"Hintere Schulter · oberer Rücken",type:"band",rest:45,inc:0,lvl:1,c:"schulter",s:"rear",g:"schulter",d:"B",nd:[["band"]],easy:"wallslide",
  cues:["Band schulterbreit vor dem Körper auf Schulterhöhe","Arme fast gestreckt","Band auseinanderziehen, bis es die Brust berührt","Schulterblätter zusammen, langsam zurück"],
  bad:["Schultern zu den Ohren","Arme stark beugen"],atem:"Beim Auseinanderziehen ausatmen, beim Zurückführen einatmen."},
inclineyraise:{n:"Y-Heben auf der Schrägbank",eq:"Kurzhanteln · Bank",m:"Untere Trapezmuskeln · hintere Schulter",type:"db",rest:60,inc:1,lvl:2,c:"schulter",s:"rear",g:"schulter",d:"B",nd:[["db","bench"]],easy:"ytw",
  cues:["Bauchlage auf der schrägen Bank, Arme hängen","Daumen zeigen nach oben","Arme gestreckt schräg nach vorn-oben zum Y heben","Langsam ablassen"],
  bad:["Zu schwere Hanteln","Kopf in den Nacken"],atem:"Beim Heben ausatmen, beim Ablassen einatmen.",
  note:"Sehr leichte Hanteln (1–4 kg) reichen völlig."},
dbshrug:{n:"Kurzhantel-Shrugs",eq:"Kurzhanteln",m:"Nacken · oberer Trapezmuskel",type:"db",rest:60,inc:2,lvl:1,c:"ruecken",s:"trap",g:"ruecken",d:"B",nd:[["db"]],easy:"jughold",
  cues:["Aufrecht stehen, Hanteln seitlich","Schultern gerade nach oben zu den Ohren ziehen","Oben 1 Sekunde halten","Langsam ganz ablassen"],
  bad:["Schultern kreisen","Kopf nach vorn schieben"],atem:"Beim Hochziehen ausatmen, beim Ablassen einatmen."},
bbshrug:{n:"Langhantel-Shrugs",eq:"Langhantel · Rack",m:"Nacken · oberer Trapezmuskel",type:"bar",rest:75,inc:5,lvl:1,c:"ruecken",s:"trap",g:"ruecken",d:"B",nd:[["barbell","rack"]],easy:"dbshrug",
  cues:["Stange aus dem Rack auf Hüfthöhe nehmen","Schulterbreit greifen, Arme gestreckt","Schultern gerade nach oben ziehen","Oben halten, langsam ablassen"],
  bad:["Mit den Armen ziehen","Schwung aus den Knien"],atem:"Beim Hochziehen ausatmen, beim Ablassen einatmen."},

/* ---------------- TRIZEPS (Tag A) ---------------- */
kickback:{n:"Trizeps-Kickbacks",eq:"Kurzhantel · Bank",m:"Trizeps",type:"db",rest:60,inc:1,lvl:1,uni:1,c:"arme",s:"tri",g:"trizeps",d:"A",nd:[["db","bench"]],easy:"walltri",
  cues:["Hand und Knie auf der Bank, Rücken flach","Oberarm am Körper, parallel zum Boden","Unterarm nach hinten strecken","Langsam zurück, Oberarm bleibt still"],
  bad:["Oberarm schwingt mit","Zu schweres Gewicht"],atem:"Beim Strecken ausatmen, beim Zurückführen einatmen."},
bandohext:{n:"Trizepsstrecken über Kopf mit Band",eq:"Widerstandsband",m:"Trizeps (langer Kopf)",type:"band",rest:60,inc:0,lvl:1,c:"arme",s:"tri",g:"trizeps",d:"A",nd:[["band"]],easy:"walltri",jr:"sh",
  cues:["Ein Fuß hinten auf das Band, Band über den Rücken nach oben","Ellbogen zeigen nach vorn-oben, neben dem Kopf","Arme über dem Kopf strecken","Langsam beugen, Ellbogen bleiben eng"],
  bad:["Ellbogen gehen weit auseinander","Hohlkreuz"],atem:"Beim Strecken ausatmen, beim Beugen einatmen.",
  safe:"Schulter: Arme nur so hoch, wie es schmerzfrei geht. Sonst Trizepsdrücken am Band."},
bbtriext:{n:"Trizepsstrecken an der Stange (Körpergewicht)",eq:"Langhantel · Rack",m:"Trizeps · Rumpf",type:"bw",rest:75,inc:0,lvl:2,rr:[8,12],c:"arme",s:"tri",g:"trizeps",d:"A",nd:[["barbell","rack"]],easy:"walltri",
  cues:["Stange im Rack auf Hüfthöhe, schulterbreit greifen","Füße zurück, Körper gerade wie beim Liegestütz","Ellbogen beugen, Stirn unter die Stange senken","Ellbogen strecken, Körper bleibt gerade"],
  bad:["Ellbogen gehen weit auseinander","Hüfte knickt ein"],atem:"Beim Senken einatmen, beim Strecken ausatmen.",
  note:"Schwerer: Stange tiefer stellen. Leichter: Stange höher."},

/* ---------------- BIZEPS (Tag B) ---------------- */
concentration:{n:"Konzentrations-Curls",eq:"Kurzhantel · Bank",m:"Bizeps",type:"db",rest:60,inc:1,lvl:1,uni:1,c:"arme",s:"bi",g:"bizeps",d:"B",nd:[["db","bench"]],easy:"curl",
  cues:["Auf die Bank setzen, Ellbogen an die Innenseite des Oberschenkels","Arm hängt gestreckt","Hantel zur Schulter beugen","Oben anspannen, langsam ablassen"],
  bad:["Oberkörper schwingt","Ellbogen hebt vom Bein ab"],atem:"Beim Beugen ausatmen, beim Ablassen einatmen."},
inclinecurl:{n:"Schrägbank-Curls",eq:"Kurzhanteln · Bank",m:"Bizeps (langer Kopf)",type:"db",rest:60,inc:1,lvl:2,c:"arme",s:"bi",g:"bizeps",d:"B",nd:[["db","bench"]],easy:"curl",jr:"sh",
  cues:["Rückenlage auf der schrägen Bank (etwa 45°)","Arme hängen senkrecht nach unten","Hanteln beugen, Ellbogen bleiben hinten","Langsam ganz strecken"],
  bad:["Ellbogen wandern nach vorn","Schultern rollen nach vorn"],atem:"Beim Beugen ausatmen, beim Ablassen einatmen.",
  safe:"Schulter: Die Dehnung vorn in der Schulter ist stark. Bank steiler stellen, wenn es zieht."},
spidercurl:{n:"Spider Curls",eq:"Kurzhanteln · Bank",m:"Bizeps (kurzer Kopf)",type:"db",rest:60,inc:1,lvl:2,c:"arme",s:"bi",g:"bizeps",d:"B",nd:[["db","bench"]],easy:"curl",
  cues:["Bauchlage auf der schrägen Bank, Brust an der Kante","Arme hängen senkrecht nach unten","Hanteln zur Schulter beugen, Oberarme bleiben senkrecht","Oben anspannen, langsam ablassen"],
  bad:["Oberarme schwingen nach vorn","Schwung aus dem Oberkörper"],atem:"Beim Beugen ausatmen, beim Ablassen einatmen."},
revcurl:{n:"Reverse Curls mit Langhantel",eq:"Langhantel",m:"Unterarme · Bizeps",type:"bar",rest:60,inc:2.5,lvl:1,c:"arme",s:"bi",g:"bizeps",d:"B",nd:[["barbell"]],easy:"hammer",
  cues:["Stange im Obergriff, schulterbreit","Ellbogen am Körper","Stange zur Brust beugen, Handgelenke gerade","Langsam ablassen"],
  bad:["Handgelenke knicken ab","Schwung aus der Hüfte"],atem:"Beim Beugen ausatmen, beim Ablassen einatmen.",
  note:"Kräftigt die Unterarme, hilft auch beim Hängen und Griff."},
dragcurl:{n:"Drag Curls",eq:"Langhantel",m:"Bizeps",type:"bar",rest:60,inc:2.5,lvl:2,c:"arme",s:"bi",g:"bizeps",d:"B",nd:[["barbell"]],easy:"bbcurl",
  cues:["Stange im Untergriff vor den Oberschenkeln","Ellbogen nach hinten ziehen, Stange am Körper hochschleifen","Bis zur unteren Brust","Am Körper entlang langsam zurück"],
  bad:["Stange entfernt sich vom Körper","Schultern rollen nach vorn"],atem:"Beim Hochziehen ausatmen, beim Ablassen einatmen."},

/* ---------------- RÜCKEN (Tag B) ---------------- */
pendlay:{n:"Pendlay-Rudern",eq:"Langhantel",m:"Oberer Rücken · Lat",type:"bar",rest:120,inc:2.5,lvl:3,c:"ruecken",s:"rowp",g:"ruecken",d:"B",nd:[["barbell"]],easy:"row",jr:"back",
  cues:["Oberkörper waagerecht, Stange liegt am Boden","Rücken gerade, Bauch fest","Stange explosiv zum unteren Brustbein ziehen","Jede Wiederholung kurz am Boden ablegen"],
  bad:["Oberkörper richtet sich auf","Runder Rücken"],atem:"Am Boden einatmen und Bauch fest, beim Ziehen ausatmen.",
  safe:"Unterer Rücken: nur mit sicherer Hüftbeuge. Wird der Rücken rund, Gewicht runter."},
dbbentrow:{n:"Vorgebeugtes Rudern mit Kurzhanteln",eq:"Kurzhanteln",m:"Oberer Rücken · Lat · Bizeps",type:"db",rest:90,inc:2,lvl:2,c:"ruecken",s:"rowp",g:"ruecken",d:"B",nd:[["db"]],easy:"chestrow",jr:"back",
  cues:["Hüfte zurück, Oberkörper etwa 45° nach vorn","Hanteln hängen unter den Schultern","Ellbogen eng zur Hüfte ziehen","Langsam strecken"],
  bad:["Schwung aus dem Oberkörper","Runder Rücken"],atem:"Beim Ziehen ausatmen, beim Ablassen einatmen.",
  safe:"Unterer Rücken: Bei Rückenproblemen lieber brustgestützt auf der Bank rudern."},
renegade:{n:"Renegade Rows",eq:"Kurzhanteln",m:"Rücken · Rumpf · Schultern",type:"db",rest:90,inc:1,lvl:3,c:"ruecken",s:"rowp",g:"ruecken",d:"B",nd:[["db"]],easy:"dbrow",jr:"wrist",
  cues:["Liegestütz-Position auf zwei Hanteln, Füße breit","Hüfte ruhig und gerade","Eine Hantel zur Hüfte ziehen","Absetzen, Seite wechseln"],
  bad:["Hüfte dreht stark auf","Hanteln kippen"],atem:"Beim Ziehen ausatmen, beim Absetzen einatmen.",
  safe:"Handgelenk: nur mit stabilen Sechskant-Hanteln. Schulter bleibt über der Hand."},
bandlat:{n:"Latziehen mit Band kniend",eq:"Widerstandsband · Rack oder Klimmzugstange",m:"Lat · Bizeps",type:"band",rest:60,inc:0,lvl:1,c:"ruecken",s:"vert",g:"ruecken",d:"B",nd:[["band","pullbar"],["band","rack"]],easy:"towellat",
  cues:["Band oben an Stange oder Rack befestigen","Darunter knien, Arme gestreckt nach oben","Ellbogen nach unten zu den Rippen ziehen","Langsam nach oben zurück"],
  bad:["Mit dem Oberkörper nach hinten fallen","Schultern zu den Ohren"],atem:"Beim Ziehen ausatmen, beim Zurückführen einatmen.",
  note:"Gute Vorübung für Klimmzüge."},
straightarm:{n:"Überzüge am Band (gestreckte Arme)",eq:"Widerstandsband · Rack",m:"Lat · Trizeps (langer Kopf)",type:"band",rest:60,inc:0,lvl:1,c:"ruecken",s:"vert",g:"ruecken",d:"B",nd:[["band","rack"]],easy:"towellat",
  cues:["Band oben am Rack befestigen, ein Schritt zurück","Leicht vorbeugen, Arme gestreckt nach vorn-oben","Arme gestreckt bis zu den Oberschenkeln ziehen","Langsam zurück nach oben"],
  bad:["Arme beugen","Oberkörper wippt mit"],atem:"Beim Ziehen ausatmen, beim Zurückführen einatmen."},
scappull:{n:"Schulterblatt-Züge an der Stange",eq:"Klimmzugstange · Stuhl zum Aufsteigen",m:"Lat · Schulterblätter · Griffkraft",type:"bw",rest:60,inc:0,lvl:1,rr:[6,12],c:"ruecken",s:"vert",g:"ruecken",d:"B",nd:[["pullbar"],["rack"]],easy:"hangsupp",
  cues:["Frei hängen, Arme gestreckt","Schultern nach unten ziehen, der Körper hebt sich ein paar Zentimeter","Arme bleiben gestreckt","Langsam zurück in den Hang"],
  bad:["Arme beugen (wird zum Klimmzug)","Schwingen"],atem:"Beim Herunterziehen der Schultern ausatmen, beim Lösen einatmen.",
  safe:"Schulter: kontrolliert, kein Ruck. Über den Stuhl ein- und aussteigen.",note:"Baut genau die Kraft auf, die du für Klimmzüge und langes Hängen brauchst."},
kbgorilla:{n:"Gorilla-Rudern mit Kettlebells",eq:"Kettlebells",m:"Rücken · Rumpf",type:"db",rest:75,inc:4,lvl:2,c:"ruecken",s:"rowp",g:"ruecken",d:"B",nd:[["kb"]],easy:"kbrow",jr:"back",
  cues:["Breiter Stand, zwei Kettlebells zwischen den Füßen","Hüfte zurück, Rücken gerade, Oberkörper fast waagerecht","Abwechselnd eine Kettlebell zur Hüfte ziehen","Andere Hand drückt auf die zweite Kettlebell"],
  bad:["Runder Rücken","Oberkörper dreht auf"],atem:"Beim Ziehen ausatmen, beim Absetzen einatmen.",
  safe:"Unterer Rücken: Bauch fest, Hüfte bleibt hinten."},
invrowfeet:{n:"Rudern im Rack, Füße erhöht",eq:"Langhantel · Rack · Bank",m:"Oberer Rücken · Lat · Bizeps",type:"bw",rest:90,inc:2.5,lvl:3,rr:[6,10],c:"ruecken",s:"rowp",g:"ruecken",d:"B",nd:[["barbell","rack","bench"]],easy:"invrow",
  cues:["Stange im Rack etwa auf Hüfthöhe, Fersen auf der Bank","Körper gerade von Kopf bis Fuß","Brust zur Stange ziehen","Langsam ablassen"],
  bad:["Hüfte hängt durch","Kinn reckt zur Stange"],atem:"Beim Ziehen ausatmen, beim Ablassen einatmen."},
assistpull:{n:"Klimmzüge mit Fußstütze",eq:"Klimmzugstange · Stuhl oder Kiste",m:"Lat · Rücken · Bizeps",type:"bw",rest:90,inc:0,lvl:1,rr:[6,10],c:"ruecken",s:"vert",g:"ruecken",d:"B",nd:[["pullbar"],["rack"]],easy:"towellat",harder:"negpull",
  cues:["Stuhl unter die Stange, Füße oder Knie darauf","Schulterbreit greifen, erst Schultern nach unten ziehen","Hochziehen, die Beine helfen nur so viel wie nötig","Langsam ablassen"],
  bad:["Beine machen die ganze Arbeit","Halbe Wiederholungen"],atem:"Beim Hochziehen ausatmen, beim Ablassen einatmen.",
  note:"Mit der Zeit immer weniger mit den Beinen helfen."},

/* ---------------- BEINE (Tag C) ---------------- */
zercher:{n:"Zercher-Kniebeuge",eq:"Langhantel · Rack",m:"Beine · Gesäß · Rumpf · oberer Rücken",type:"bar",rest:150,inc:2.5,lvl:3,c:"beine",s:"sq",g:"vorn",d:"C",nd:[["barbell","rack"]],easy:"goblet",
  cues:["Stange in die Armbeugen legen (Polster oder Handtuch)","Hände vor der Brust verschränken, Ellbogen vorn","Aufrecht tief beugen","Kraftvoll hochdrücken, Oberkörper bleibt aufrecht"],
  bad:["Rücken rundet sich","Ellbogen fallen nach unten"],atem:"Oben einatmen, Bauch fest, beim Hochdrücken ausatmen.",
  safe:"Polster um die Stange, Ablagen knapp unter den tiefsten Punkt."},
boxsquat:{n:"Box-Kniebeuge",eq:"Langhantel · Rack · Bank",m:"Beine · Gesäß · Rumpf",type:"bar",rest:150,inc:5,lvl:2,c:"beine",s:"sq",g:"vorn",d:"C",nd:[["barbell","rack","bench"]],easy:"goblet",jr:"hip",
  cues:["Bank hinter dir, Stange auf dem oberen Rücken","Hüfte nach hinten, bis der Po die Bank kurz berührt","Spannung halten, nicht absitzen","Aus der Berührung kraftvoll hochdrücken"],
  bad:["Auf die Bank fallen","Ganz absitzen und locker lassen"],atem:"Oben einatmen und Bauch fest, beim Hochdrücken ausatmen.",
  safe:"Hüfte: Die Bank gibt eine feste, schmerzfreie Tiefe vor. Bankhöhe passend wählen."},
sumosquat:{n:"Sumo Squat mit Kurzhantel",eq:"Kurzhantel",m:"Innere Oberschenkel · Gesäß · Beine",type:"db",rest:75,inc:2,lvl:1,c:"beine",s:"sq",g:"vorn",d:"C",nd:[["db"]],easy:"airsquatx",jr:"hip",
  cues:["Breiter Stand, Fußspitzen nach außen","Eine Hantel senkrecht zwischen den Beinen halten","Tief beugen, Knie zeigen über die Füße","Über die Fersen hochdrücken"],
  bad:["Knie fallen nach innen","Oberkörper kippt nach vorn"],atem:"Beim Runtergehen einatmen, beim Hochdrücken ausatmen.",
  safe:"Hüfte: Stand nur so breit, wie es in der Hüfte angenehm ist."},
splitsquat:{n:"Split Squat mit Kurzhanteln",eq:"Kurzhanteln",m:"Beine · Gesäß",type:"db",rest:75,inc:2,lvl:1,uni:1,c:"beine",s:"uni",g:"vorn",d:"C",nd:[["db"]],easy:"lungebwx",harder:"bss",
  cues:["Große Schrittstellung, Hanteln seitlich","Beide Füße bleiben am Boden","Senkrecht runter, bis das hintere Knie knapp über dem Boden ist","Über die vordere Ferse hochdrücken"],
  bad:["Vorderes Knie fällt nach innen","Zu kurzer Schritt"],atem:"Beim Senken einatmen, beim Hochdrücken ausatmen."},
walklunge:{n:"Gehende Ausfallschritte",eq:"Kurzhanteln",m:"Beine · Gesäß",type:"db",rest:90,inc:2,lvl:2,uni:1,c:"beine",s:"uni",g:"vorn",d:"C",nd:[["db"]],easy:"lungebwx",
  cues:["Hanteln seitlich, aufrecht","Großer Schritt nach vorn, hinteres Knie zum Boden","Über das vordere Bein aufstehen und das hintere Bein nach vorn holen","Direkt in den nächsten Schritt"],
  bad:["Vorderes Knie kippt nach innen","Oberkörper fällt nach vorn"],atem:"Beim Senken einatmen, beim Aufstehen ausatmen.",
  note:"Wenig Platz? Zwei Schritte vor, umdrehen, zurück."},
curtsy:{n:"Curtsy Lunges (Knicks-Ausfallschritt)",eq:"Ohne Gerät",m:"Gesäß · Beine · Hüfte seitlich",type:"bw",rest:60,inc:0,lvl:2,uni:1,rr:[8,12],c:"beine",s:"uni",g:"vorn",d:"C",nd:[],easy:"lungebwx",jr:"hip",
  cues:["Hüftbreit stehen, Hände an der Hüfte","Ein Bein diagonal hinter das andere setzen, wie ein Knicks","Tief beugen, vorderes Knie über dem Fuß","Zurück in den Stand"],
  bad:["Vorderes Knie fällt nach innen","Hüfte dreht stark auf"],atem:"Beim Senken einatmen, beim Aufstehen ausatmen.",
  safe:"Hüfte: kleiner Kreuzschritt, wenn es außen an der Hüfte zieht."},
sidelunge:{n:"Seitliche Ausfallschritte",eq:"Ohne Gerät",m:"Beine · Gesäß · Innenseite Oberschenkel",type:"bw",rest:60,inc:0,lvl:1,uni:1,rr:[8,12],c:"beine",s:"uni",g:"vorn",d:"C",nd:[],easy:"airsquatx",harder:"cossack",jr:"hip",
  cues:["Hüftbreit stehen","Großer Schritt zur Seite, Hüfte nach hinten","Gebeugtes Knie über dem Fuß, anderes Bein gestreckt","Vom gebeugten Bein zurückdrücken"],
  bad:["Knie fällt nach innen","Rücken rundet sich"],atem:"Beim Schritt einatmen, beim Zurückdrücken ausatmen.",
  safe:"Hüfte: Schritt nur so breit, wie es angenehm ist."},
stepdown:{n:"Step-downs von der Bank",eq:"Bank oder Stufe",daily:"Treppenstufe",m:"Oberschenkel vorne · Kniestabilität",type:"bw",rest:60,inc:0,lvl:2,uni:1,rr:[8,12],c:"beine",s:"uni",g:"vorn",d:"C",nd:[],easy:"chairstep",
  cues:["Mit einem Bein auf die Bank, anderes Bein seitlich daneben in der Luft","Standbein langsam beugen","Ferse des freien Beins tippt kurz auf den Boden","Mit dem Standbein wieder strecken"],
  bad:["Knie fällt nach innen","Fallen statt langsam senken"],atem:"Beim Senken einatmen, beim Strecken ausatmen.",
  note:"Ohne Bank: eine Treppenstufe."},
sissy:{n:"Sissy Squat am Türrahmen",eq:"Ohne Gerät · Türrahmen",daily:"Türrahmen",m:"Oberschenkel vorne",type:"bw",rest:75,inc:0,lvl:3,rr:[6,10],c:"beine",s:"sq",g:"vorn",d:"C",nd:[],easy:"wallsit",jr:"knee",
  cues:["Mit einer Hand am Türrahmen festhalten","Auf die Fußballen, Knie schieben nach vorn","Oberkörper und Oberschenkel bleiben in einer Linie und lehnen nach hinten","Langsam zurück nach oben"],
  bad:["In der Hüfte abknicken","Zu tief bei Knieschmerz"],atem:"Beim Senken einatmen, beim Hochkommen ausatmen.",
  safe:"Knie: nur schmerzfrei und mit kleiner Tiefe beginnen."},
pistol:{n:"Pistol Squat",eq:"Ohne Gerät",m:"Beine · Gesäß · Gleichgewicht",type:"bw",rest:90,inc:0,lvl:3,uni:1,rr:[3,8],c:"beine",s:"uni",g:"vorn",d:"C",nd:[],easy:"pistolbox",jr:"knee",
  cues:["Auf einem Bein stehen, anderes Bein gestreckt nach vorn","Arme nach vorn zum Ausbalancieren","Ganz tief auf einem Bein beugen","Über die Ferse hochdrücken"],
  bad:["Ferse hebt ab","Knie fällt nach innen"],atem:"Beim Senken einatmen, beim Hochdrücken ausatmen.",
  safe:"Knie und Hüfte: erst die Vorstufe zum Stuhl sicher beherrschen."},
seatcalf:{n:"Wadenheben sitzend",eq:"Kurzhanteln · Bank",m:"Waden (Schollenmuskel)",type:"db",rest:45,inc:2,lvl:1,c:"beine",s:"calf",g:"waden",d:"C",nd:[["db","bench"]],easy:"calfbw",
  cues:["Auf die Bank setzen, Fußballen auf eine Scheibe oder ein Buch","Hanteln auf die Oberschenkel nah am Knie","Fersen so hoch wie möglich heben","Langsam tief absenken"],
  bad:["Wippen ohne Pause","Nur halbe Bewegung"],atem:"Beim Heben ausatmen, beim Senken einatmen."},
bbcalf:{n:"Wadenheben mit Langhantel",eq:"Langhantel · Rack",m:"Waden",type:"bar",rest:60,inc:5,lvl:2,c:"beine",s:"calf",g:"waden",d:"C",nd:[["barbell","rack"]],easy:"calf",
  cues:["Stange wie zur Kniebeuge auf den oberen Rücken","Fußballen auf eine Scheibe","Ganz hoch auf die Zehenspitzen","Oben halten, Ferse langsam tief absenken"],
  bad:["Knie beugen und wippen","Zu schnell"],atem:"Beim Heben ausatmen, beim Senken einatmen.",
  safe:"Ablagen auf Schulterhöhe einstellen."},
tibraise:{n:"Schienbein-Heben an der Wand",eq:"Ohne Gerät · Wand",daily:"Wand",m:"Schienbeinmuskel · Kniestabilität",type:"bw",rest:45,inc:0,lvl:2,rr:[12,20],c:"beine",s:"calf",g:"waden",d:"C",nd:[],easy:"calfbw",
  cues:["Rücken an die Wand, Füße etwa einen Fuß weit vor","Beine gestreckt","Zehenspitzen so hoch wie möglich ziehen","Langsam absenken"],
  bad:["Po löst sich von der Wand","Wippen"],atem:"Gleichmäßig weiteratmen.",
  note:"Stärkt die Vorderseite des Unterschenkels, gut für Knie und Sprunggelenk."},
dbsquat:{n:"Kniebeuge mit Kurzhanteln",eq:"Kurzhanteln",m:"Beine · Gesäß",type:"db",rest:90,inc:2,lvl:1,c:"beine",s:"sq",g:"vorn",d:"C",nd:[["db"]],easy:"airsquatx",
  cues:["Hanteln seitlich, Füße schulterbreit","Hüfte nach hinten und tief beugen","Brust bleibt oben, Hanteln hängen locker","Über die ganze Fußsohle hochdrücken"],
  bad:["Fersen heben ab","Hanteln stoßen an die Knie"],atem:"Beim Runtergehen einatmen, beim Hochdrücken ausatmen."},
assistsquat:{n:"Kniebeuge mit Halt am Türrahmen",eq:"Ohne Gerät · Türrahmen",daily:"Türrahmen",m:"Beine · Gesäß",type:"bw",rest:45,inc:0,lvl:1,rr:[10,15],c:"beine",s:"sq",g:"vorn",d:"C",nd:[],easy:"chairsit",harder:"airsquatx",
  cues:["Mit beiden Händen am Türrahmen festhalten","Füße schulterbreit, nah am Rahmen","Tief beugen, die Hände geben nur Halt","Aufrichten"],
  bad:["Mit den Armen hochziehen","Fersen heben ab"],atem:"Beim Runtergehen einatmen, beim Hochkommen ausatmen.",
  note:"Ideal zum Lernen der tiefen Kniebeuge."},
chairsit:{n:"Aufstehen vom Stuhl",eq:"Ohne Gerät · Stuhl",daily:"Stuhl",m:"Beine · Gesäß",type:"bw",rest:45,inc:0,lvl:1,rr:[10,15],c:"beine",s:"sq",g:"vorn",d:"C",nd:[],harder:"airsquatx",
  cues:["Vorn auf die Stuhlkante setzen, Füße hüftbreit","Arme nach vorn, Oberkörper leicht vorlehnen","Ohne Schwung aufstehen","Langsam wieder hinsetzen, nicht fallen lassen"],
  bad:["Mit Schwung aufstehen","Knie fallen nach innen"],atem:"Beim Aufstehen ausatmen, beim Hinsetzen einatmen.",
  safe:"Stuhl an die Wand stellen."},

/* ---------------- HÜFTE & PO (Tag C) ---------------- */
sumodl:{n:"Sumo-Kreuzheben",eq:"Langhantel",m:"Gesäß · Beine · innere Oberschenkel · Rücken",type:"bar",rest:150,inc:5,lvl:2,c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[["barbell"]],easy:"kbdl",jr:"hip",
  cues:["Breiter Stand, Fußspitzen nach außen, Stange über der Fußmitte","Innerhalb der Knie greifen, Brust raus","Knie nach außen drücken und den Boden wegschieben","Oben Hüfte strecken, kontrolliert ablassen"],
  bad:["Knie fallen nach innen","Hüfte schießt zuerst hoch"],atem:"Unten einatmen und Bauch fest, oben ausatmen.",
  safe:"Hüfte: Stand nur so breit, wie es schmerzfrei ist."},
rackpull:{n:"Rack Pulls (Teil-Kreuzheben)",eq:"Langhantel · Rack",m:"Rücken · Gesäß · Griffkraft",type:"bar",rest:150,inc:5,lvl:2,c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[["barbell","rack"]],easy:"rdlbb",
  cues:["Stange im Rack knapp unter Kniehöhe ablegen","Hüfte zurück, Rücken gerade, Stange an den Beinen","Hüfte nach vorn strecken und aufrichten","Kontrolliert zurück auf die Ablagen"],
  bad:["Nach hinten lehnen","Runder Rücken"],atem:"Unten einatmen und Bauch fest, oben ausatmen.",
  note:"Kürzerer Weg als Kreuzheben: schont den unteren Rücken und stärkt den Griff."},
dbdl:{n:"Kreuzheben mit Kurzhanteln",eq:"Kurzhanteln",m:"Gesäß · Beine · Rücken",type:"db",rest:120,inc:2,lvl:1,c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[["db"]],easy:"gmbw",
  cues:["Hanteln seitlich der Füße am Boden","Hüfte zurück, Knie beugen, Rücken gerade","Mit den Beinen den Boden wegdrücken und aufrichten","Kontrolliert zurück zum Boden"],
  bad:["Runder Rücken","Hanteln weit vor dem Körper"],atem:"Unten einatmen, beim Aufrichten ausatmen."},
kbdl:{n:"Kettlebell-Kreuzheben",eq:"Kettlebell",m:"Gesäß · Beine · Rücken",type:"db",rest:90,inc:4,lvl:1,c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[["kb"]],easy:"gmbw",
  cues:["Kettlebell zwischen den Füßen","Hüfte zurück, Rücken gerade, mit beiden Händen greifen","Aufrichten, Hüfte nach vorn","Kontrolliert zurück zum Boden"],
  bad:["Runder Rücken","Aus den Armen ziehen"],atem:"Unten einatmen, beim Aufrichten ausatmen."},
sglrdl:{n:"Einbeiniges Rumänisches Kreuzheben",eq:"Kurzhantel",m:"Beinbeuger · Gesäß · Gleichgewicht",type:"db",rest:75,inc:2,lvl:2,uni:1,c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[["db"]],easy:"rdl",jr:"hip",
  cues:["Auf einem Bein, Knie leicht gebeugt, Hantel in der Gegenhand","Hüfte zurück, freies Bein gestreckt nach hinten","Oberkörper und Bein bilden eine Linie","Über das Gesäß aufrichten"],
  bad:["Hüfte dreht auf","Rücken rundet sich"],atem:"Beim Vorbeugen einatmen, beim Aufrichten ausatmen.",
  safe:"Hüfte: Für mehr Halt eine Hand an die Wand. Nur so weit, wie die Hüfte gerade bleibt."},
sglhipthrust:{n:"Einbeiniger Hip Thrust an der Bank",eq:"Bank",m:"Gesäß · Beinbeuger",type:"bw",rest:60,inc:0,lvl:2,uni:1,rr:[8,12],c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[["bench"]],easy:"glutebridge",
  cues:["Schulterblätter an der Bankkante","Ein Fuß am Boden, anderes Knie zur Brust","Über die Ferse die Hüfte hochdrücken","Oben Po fest anspannen, langsam ablassen"],
  bad:["Hohlkreuz statt Hüftstreckung","Becken kippt zur Seite"],atem:"Beim Hochdrücken ausatmen, beim Ablassen einatmen."},
bbbridge:{n:"Glute Bridge mit Langhantel",eq:"Langhantel · Matte",m:"Gesäß · Beinbeuger",type:"bar",rest:90,inc:5,lvl:2,c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[["barbell"]],easy:"glutebridge",harder:"hipthrust",
  cues:["Rückenlage, Stange mit Polster über die Hüfte rollen","Füße hüftbreit, nah am Po","Hüfte hochdrücken, bis Knie, Hüfte und Schultern eine Linie bilden","Oben anspannen, langsam ablegen"],
  bad:["Hohlkreuz","Füße zu weit weg"],atem:"Beim Hochdrücken ausatmen, beim Ablegen einatmen.",
  safe:"Polster oder gefaltetes Handtuch um die Stange."},
frogpump:{n:"Frog Pumps",eq:"Ohne Gerät · Matte",m:"Gesäß",type:"bw",rest:45,inc:0,lvl:1,rr:[15,25],c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[],easy:"glutebridge",jr:"hip",
  cues:["Rückenlage, Fußsohlen aneinander, Knie fallen nach außen","Fersen nah am Po","Hüfte kurz und kräftig hochdrücken","Langsam ablegen"],
  bad:["Hohlkreuz","Knie ziehen zusammen"],atem:"Beim Hochdrücken ausatmen, beim Ablegen einatmen.",
  safe:"Hüfte: Knie nur so weit öffnen, wie es angenehm ist."},
donkeykick:{n:"Donkey Kicks",eq:"Ohne Gerät · Matte",m:"Gesäß",type:"bw",rest:45,inc:0,lvl:1,uni:1,rr:[12,15],c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[],easy:"glutebridge",
  cues:["Vierfüßlerstand, Hände unter den Schultern","Ein Knie bleibt 90° gebeugt","Fußsohle Richtung Decke drücken, bis der Oberschenkel waagerecht ist","Langsam zurück, Seite wechseln"],
  bad:["Hohlkreuz","Hüfte dreht auf"],atem:"Beim Hochdrücken ausatmen, beim Senken einatmen."},
bandkick:{n:"Kickbacks stehend mit Band",eq:"Widerstandsband · Rack",m:"Gesäß",type:"band",rest:45,inc:0,lvl:1,uni:1,c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[["band","rack"]],easy:"donkeykick",
  cues:["Band unten am Rack und um den Knöchel","Hände am Rack, leicht vorgebeugt","Bein gestreckt nach hinten drücken","Langsam zurück, kein Hohlkreuz"],
  bad:["Hohlkreuz","Oberkörper kippt nach vorn"],atem:"Beim Kicken ausatmen, beim Zurückführen einatmen."},
sidelyingabd:{n:"Seitliches Beinheben liegend",eq:"Ohne Gerät · Matte",m:"Hüfte seitlich · Gesäß",type:"bw",rest:45,inc:0,lvl:1,uni:1,rr:[12,20],c:"huefte",s:"abd",g:"hinten",d:"C",nd:[],easy:"glutebridge",
  cues:["Auf die Seite legen, Kopf auf dem Arm","Oberes Bein gestreckt, Fußspitze zeigt nach vorn","Bein langsam bis etwa 45° heben","Langsam ablassen"],
  bad:["Becken kippt nach hinten","Bein zu hoch reißen"],atem:"Beim Heben ausatmen, beim Ablassen einatmen.",
  note:"Kräftigt den seitlichen Gesäßmuskel, gut für Hüfte und Knie."},
bandwalk:{n:"Seitwärtsgehen mit Band",eq:"Widerstandsband",m:"Hüfte seitlich · Gesäß",type:"time",rest:45,inc:0,lvl:1,hr:[20,40],c:"huefte",s:"abd",g:"hinten",d:"C",nd:[["band"]],easy:"sidelyingabd",
  cues:["Band um beide Beine knapp über den Knien","Leicht in die Knie, Hüfte zurück","Kleine Schritte zur Seite, Band bleibt gespannt","Nach der Hälfte der Zeit Richtung wechseln"],
  bad:["Knie fallen nach innen","Oberkörper schwankt"],atem:"Gleichmäßig weiteratmen."},
bridgewalk:{n:"Bridge Walkouts",eq:"Ohne Gerät · Matte",m:"Beinbeuger · Gesäß · Rumpf",type:"bw",rest:60,inc:0,lvl:2,rr:[5,8],c:"huefte",s:"hamiso",g:"hinten",d:"C",nd:[],easy:"bridgehold",
  cues:["In die Glute Bridge, Hüfte oben","Mit kleinen Fersenschritten die Füße nach vorn wandern","So weit es geht, Hüfte bleibt oben","Zurückwandern"],
  bad:["Hüfte sinkt ab","Zu große Schritte"],atem:"Gleichmäßig weiteratmen, nicht pressen."},
slidecurl:{n:"Beincurls mit Handtuch",eq:"Ohne Gerät · Handtuch · glatter Boden",daily:"Handtuch",m:"Beinbeuger · Gesäß",type:"bw",rest:60,inc:0,lvl:2,rr:[8,12],c:"huefte",s:"hamiso",g:"hinten",d:"C",nd:[],easy:"bridgewalk",harder:"nordicneg",
  cues:["Rückenlage, Fersen auf ein Handtuch auf glattem Boden","Hüfte hoch in die Brücke","Beine langsam nach vorn strecken, Hüfte bleibt oben","Fersen wieder zum Po ziehen"],
  bad:["Hüfte sinkt ab","Zu schnell strecken"],atem:"Beim Strecken einatmen, beim Heranziehen ausatmen."},
pullthrough:{n:"Band Pull-Through",eq:"Widerstandsband · Rack",m:"Gesäß · Beinbeuger",type:"band",rest:60,inc:0,lvl:1,c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[["band","rack"]],easy:"gmbw",
  cues:["Band unten am Rack, mit dem Rücken zum Rack stehen","Band zwischen den Beinen, mit beiden Händen greifen","Hüfte weit nach hinten schieben","Hüfte kräftig nach vorn strecken, Po anspannen"],
  bad:["Mit den Armen ziehen","Runder Rücken"],atem:"Beim Vorbeugen einatmen, beim Aufrichten ausatmen."},
reversehyper:{n:"Reverse Hyperextension auf der Bank",eq:"Bank",m:"Gesäß · unterer Rücken · Beinbeuger",type:"bw",rest:60,inc:0,lvl:2,rr:[10,15],c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[["bench"]],easy:"superman",
  cues:["Bauchlage auf der Bank, Hüfte an der Kante, Beine hängen","Bank vorn fest greifen","Gestreckte Beine bis zur Waagerechten heben","Langsam senken"],
  bad:["Beine über die Waagerechte reißen (Hohlkreuz)","Schwung"],atem:"Beim Heben ausatmen, beim Senken einatmen."},
bridgemarch:{n:"Glute Bridge Marsch",eq:"Ohne Gerät · Matte",m:"Gesäß · Rumpf",type:"bw",rest:45,inc:0,lvl:2,rr:[8,12],c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[],easy:"glutebridge",harder:"sglbridge",
  cues:["Rückenlage, Hüfte in die Brücke hochdrücken","Ein Knie zur Brust heben, Becken bleibt waagerecht","Fuß absetzen, anderes Knie heben","Hüfte bleibt die ganze Zeit oben"],
  bad:["Becken kippt zur Seite","Hüfte sinkt ab"],atem:"Gleichmäßig weiteratmen."},
bridgechair:{n:"Glute Bridge mit Füßen auf dem Stuhl",eq:"Ohne Gerät · Stuhl",daily:"Stuhl",m:"Gesäß · Beinbeuger",type:"bw",rest:60,inc:0,lvl:2,rr:[10,15],c:"huefte",s:"hinge",g:"hinten",d:"C",nd:[],easy:"glutebridge",
  cues:["Rückenlage, Fersen auf die Sitzfläche","Knie etwa 90° gebeugt","Hüfte hochdrücken, Po fest","Langsam ablegen"],
  bad:["Hohlkreuz","Stuhl rutscht"],atem:"Beim Hochdrücken ausatmen, beim Ablegen einatmen.",
  safe:"Stuhl an die Wand stellen."},

/* ---------------- RUMPF (Tag C) ---------------- */
vup:{n:"V-Ups",eq:"Ohne Gerät · Matte",m:"Bauch · Hüftbeuger",type:"bw",rest:60,inc:0,lvl:3,rr:[6,12],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[],easy:"crunch",jr:"back",
  cues:["Rückenlage, Arme gestreckt über dem Kopf","Arme und gestreckte Beine gleichzeitig heben","Hände Richtung Füße, oben ein V","Langsam ablegen"],
  bad:["Mit Schwung hochreißen","Hohlkreuz beim Ablegen"],atem:"Beim Hochkommen ausatmen, beim Ablegen einatmen.",
  safe:"Unterer Rücken: Leichter mit gebeugten Knien."},
bicycle:{n:"Fahrrad-Crunches",eq:"Ohne Gerät · Matte",m:"Schräge Bauchmuskeln · Bauch",type:"bw",rest:45,inc:0,lvl:2,rr:[12,20],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[],easy:"crunch",
  cues:["Rückenlage, Hände leicht an den Schläfen","Schultern heben, Beine angehoben","Ellbogen zum gegenüberliegenden Knie drehen, anderes Bein strecken","Langsam die Seite wechseln"],
  bad:["Am Kopf ziehen","Zu hektisch"],atem:"Beim Drehen ausatmen."},
revcrunch:{n:"Reverse Crunches",eq:"Ohne Gerät · Matte",m:"Unterer Bauch",type:"bw",rest:45,inc:0,lvl:1,rr:[10,15],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[],easy:"deadbug",harder:"legraisefloor",
  cues:["Rückenlage, Knie 90° angewinkelt, Arme neben dem Körper","Knie zur Brust ziehen, das Becken rollt leicht ab","Kurz halten","Langsam zurück"],
  bad:["Mit Schwung","Kopf und Schultern drücken mit"],atem:"Beim Einrollen ausatmen, beim Zurückführen einatmen."},
situp:{n:"Sit-ups",eq:"Ohne Gerät · Matte",m:"Bauch · Hüftbeuger",type:"bw",rest:45,inc:0,lvl:2,rr:[10,15],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[],easy:"crunch",jr:"back",
  cues:["Rückenlage, Knie gebeugt, Füße am Boden","Arme vor der Brust verschränkt","Wirbel für Wirbel bis zum Sitzen aufrollen","Langsam zurückrollen"],
  bad:["Mit Schwung","Am Nacken ziehen"],atem:"Beim Aufrollen ausatmen, beim Zurückrollen einatmen.",
  safe:"Unterer Rücken: Bei Rückenproblemen lieber Crunches."},
shtap:{n:"Hochstütz mit Schulter-Tippen",eq:"Ohne Gerät · Matte",m:"Rumpf · Schultern",type:"bw",rest:45,inc:0,lvl:2,rr:[16,24],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[],easy:"kneeplank",jr:"wrist",
  cues:["Hochstütz, Füße etwas breiter","Eine Hand tippt auf die gegenüberliegende Schulter","Hüfte bleibt ruhig, kein Schaukeln","Hand zurück, Seite wechseln"],
  bad:["Hüfte schaukelt","Po zu hoch"],atem:"Gleichmäßig weiteratmen."},
plankupdown:{n:"Plank Up-Downs",eq:"Ohne Gerät · Matte",m:"Rumpf · Trizeps · Schultern",type:"bw",rest:60,inc:0,lvl:2,rr:[8,12],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[],easy:"plank",jr:"sh",
  cues:["Unterarmstütz","Eine Hand nach der anderen in den Hochstütz drücken","Wieder Arm für Arm auf die Unterarme","Hüfte bleibt ruhig"],
  bad:["Hüfte schaukelt stark","Po schiebt nach oben"],atem:"Gleichmäßig weiteratmen.",
  safe:"Schulter und Handgelenk: langsam, bei Schmerz Unterarmstütz halten."},
kneeplank:{n:"Unterarmstütz auf den Knien",eq:"Ohne Gerät · Matte",m:"Bauch · Rumpf",type:"time",rest:45,inc:0,lvl:1,hr:[20,40],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[],harder:"plank",
  cues:["Unterarme unter den Schultern, Knie am Boden","Gerade Linie von den Knien bis zum Kopf","Po und Bauch fest","Ruhig weiteratmen"],
  bad:["Po zeigt nach oben","Hohlkreuz"],atem:"Ruhig weiteratmen, nicht pressen.",note:"Der leichte Einstieg in den Unterarmstütz."},
plankleg:{n:"Unterarmstütz mit Beinheben",eq:"Ohne Gerät · Matte",m:"Rumpf · Gesäß",type:"bw",rest:45,inc:0,lvl:2,rr:[10,16],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[],easy:"plank",
  cues:["Unterarmstütz, Körper gerade","Ein gestrecktes Bein eine Handbreit anheben","Kurz halten, Hüfte bleibt ruhig","Absetzen, Seite wechseln"],
  bad:["Hohlkreuz beim Heben","Hüfte dreht auf"],atem:"Gleichmäßig weiteratmen."},
pallof:{n:"Pallof Press",eq:"Widerstandsband · Rack",m:"Rumpf · schräge Bauchmuskeln",type:"band",rest:45,inc:0,lvl:1,uni:1,c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[["band","rack"]],easy:"deadbug",
  cues:["Band seitlich auf Brusthöhe am Rack, seitlich dazu stehen","Griff mit beiden Händen vor der Brust","Arme gerade nach vorn drücken, der Zug will dich drehen","Nicht mitdrehen, langsam zurück"],
  bad:["Oberkörper dreht mit","Zu weit weg vom Rack"],atem:"Beim Drücken ausatmen, beim Zurückführen einatmen.",
  note:"Anti-Rotation: schützt den unteren Rücken."},
woodchop:{n:"Holzhacker mit Band",eq:"Widerstandsband · Rack",m:"Schräge Bauchmuskeln · Rumpf",type:"band",rest:45,inc:0,lvl:2,uni:1,c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[["band","rack"]],easy:"pallof",jr:"back",
  cues:["Band seitlich oben am Rack befestigen","Mit beiden Händen diagonal nach unten zur anderen Hüfte ziehen","Drehung aus dem Oberkörper, Hüfte und Füße drehen leicht mit","Langsam zurück nach oben"],
  bad:["Nur aus den Armen ziehen","Runder Rücken"],atem:"Beim Ziehen ausatmen, beim Zurückführen einatmen.",
  safe:"Unterer Rücken: kontrolliert drehen, keinen Schwung."},
suitcase:{n:"Koffer-Tragen einseitig",eq:"Kurzhantel",m:"Seitlicher Rumpf · Griffkraft",type:"time",rest:45,inc:2,lvl:1,hr:[30,45],uni:1,c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[["db"]],easy:"farmerhold",
  cues:["Eine schwere Hantel in einer Hand","Aufrecht gehen, nicht zur Hantel kippen","Schultern gerade, Bauch fest","Nach der Zeit Seite wechseln"],
  bad:["Oberkörper kippt zur Seite","Schulter hängt"],atem:"Ruhig und gleichmäßig weiteratmen."},
sidebend:{n:"Seitbeugen mit Kurzhantel",eq:"Kurzhantel",m:"Schräge Bauchmuskeln",type:"db",rest:45,inc:2,lvl:1,uni:1,c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[["db"]],easy:"russtwistbw",
  cues:["Aufrecht, eine Hantel seitlich","Langsam zur Hantelseite neigen","Über die andere Seite zurück aufrichten","Nicht nach vorn oder hinten kippen"],
  bad:["Oberkörper dreht","Zu schnell"],atem:"Beim Neigen einatmen, beim Aufrichten ausatmen."},
toesbar:{n:"Toes to Bar",eq:"Klimmzugstange",m:"Bauch · Hüftbeuger · Griffkraft",type:"bw",rest:90,inc:0,lvl:3,rr:[4,8],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[["pullbar"],["rack"]],easy:"legraise",jr:"sh",
  cues:["Frei hängen, Schultern aktiv","Gestreckte Beine bis zur Stange heben","Becken einrollen","Langsam ohne Schwung ablassen"],
  bad:["Starkes Schwingen","Beine fallen lassen"],atem:"Beim Heben ausatmen, beim Ablassen einatmen.",
  safe:"Schulter: nur ohne Schwung. Sonst Hängendes Knieheben."},
stirpot:{n:"Rühren auf dem Gymnastikball",eq:"Gymnastikball",m:"Rumpf · Schultern",type:"time",rest:60,inc:0,lvl:3,hr:[20,30],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[["gymball"]],easy:"plank",jr:"sh",
  cues:["Unterarme auf den Ball, Unterarmstütz","Kleine Kreise mit den Unterarmen ziehen","Hüfte bleibt ruhig und gerade","Nach der Hälfte die Richtung wechseln"],
  bad:["Hüfte hängt durch","Zu große Kreise"],atem:"Ruhig weiteratmen."},
balljack:{n:"Ball-Klappmesser",eq:"Gymnastikball",m:"Bauch · Rumpf · Schultern",type:"bw",rest:60,inc:0,lvl:2,rr:[8,12],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[["gymball"]],easy:"climber",
  cues:["Hochstütz, Schienbeine auf dem Ball","Knie zur Brust ziehen, der Ball rollt mit","Kurz halten","Beine zurück strecken, Hüfte bleibt gerade"],
  bad:["Hüfte hängt durch","Schultern weit hinter den Händen"],atem:"Beim Heranziehen ausatmen, beim Strecken einatmen."},
seatedtuck:{n:"Knieheben im Sitzen",eq:"Ohne Gerät · Stuhl",daily:"Stuhl",m:"Bauch · Hüftbeuger",type:"bw",rest:45,inc:0,lvl:1,rr:[10,15],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[],easy:"deadbug",
  cues:["Auf die Stuhlkante setzen, Hände greifen seitlich die Sitzfläche","Oberkörper leicht zurücklehnen","Knie zur Brust ziehen","Füße langsam zurück, ohne abzusetzen"],
  bad:["Rundrücken","Mit Schwung"],atem:"Beim Heranziehen ausatmen."},
crabwalk:{n:"Krebsgang",eq:"Ohne Gerät",m:"Trizeps · Schultern · Gesäß · Rumpf",type:"time",rest:45,inc:0,lvl:1,hr:[20,30],c:"rumpf",s:"core",g:"rumpf",d:"C",nd:[],easy:"floordip",jr:"wrist",
  cues:["Hinsetzen, Hände hinter dir, Finger zeigen zum Po","Hüfte anheben","Abwechselnd Hand und Fuß nach vorn setzen","Hüfte bleibt oben"],
  bad:["Po schleift am Boden","Schultern zu den Ohren"],atem:"Gleichmäßig weiteratmen.",
  safe:"Handgelenk und Schulter: bei Ziehen vorn in der Schulter auslassen."},
floordip:{n:"Dips am Boden",eq:"Ohne Gerät · Matte",m:"Trizeps · Schultern",type:"bw",rest:60,inc:0,lvl:1,rr:[10,15],c:"arme",s:"tri",g:"trizeps",d:"A",nd:[],easy:"walltri",harder:"chairdip",jr:"sh",
  cues:["Hinsetzen, Knie gebeugt, Hände hinter dir","Finger zeigen nach vorn zum Po","Po leicht anheben, Ellbogen nach hinten beugen","Arme wieder strecken"],
  bad:["Ellbogen gehen weit auseinander","Schultern zu den Ohren"],atem:"Beim Beugen einatmen, beim Strecken ausatmen.",
  safe:"Schulter: kleiner Bewegungsumfang, wenn vorn in der Schulter etwas zieht."},
backwidow:{n:"Back Widows",eq:"Ohne Gerät · Matte",m:"Oberer Rücken · Schulterblätter",type:"bw",rest:45,inc:0,lvl:1,rr:[8,12],c:"ruecken",s:"rear",g:"ruecken",d:"B",nd:[],easy:"snowangel",
  cues:["Rückenlage, Knie gebeugt, Ellbogen 90° neben dem Körper","Ellbogen in den Boden drücken","Der Oberkörper hebt sich leicht vom Boden","Kurz halten, langsam ablegen"],
  bad:["Mit dem Nacken ziehen","Hohlkreuz"],atem:"Beim Anheben ausatmen, beim Ablegen einatmen.",
  note:"Rückentraining ganz ohne Geräte."},

/* ---------------- KONDITION (Bonus) ---------------- */
highknees:{n:"Kniehebelauf auf der Stelle",eq:"Ohne Gerät",m:"Kondition · Hüftbeuger",type:"time",rest:30,inc:0,lvl:1,hr:[20,40],c:"cardio",d:"F",nd:[],easy:"jumpjack",
  cues:["Auf der Stelle laufen","Knie bis auf Hüfthöhe","Arme schwingen mit","Leise auf den Fußballen landen"],
  bad:["Zurücklehnen","Laut aufstampfen"],atem:"Gleichmäßig, kräftig atmen."},
shadowbox:{n:"Schattenboxen",eq:"Ohne Gerät",m:"Kondition · Schultern · Rumpf",type:"time",rest:30,inc:0,lvl:1,hr:[30,60],c:"cardio",d:"F",nd:[],easy:"jumpjack",
  cues:["Boxstellung, Hände vor dem Kinn","Gerade Schläge in die Luft","Nach jedem Schlag Hand zurück zur Deckung","Locker auf den Fußballen"],
  bad:["Arm ganz durchschlagen (Ellbogen überstrecken)","Deckung fällt"],atem:"Bei jedem Schlag kurz ausatmen.",
  safe:"Schulter: Schläge nicht ganz durchstrecken."},
skater:{n:"Skater-Sprünge",eq:"Ohne Gerät",m:"Kondition · Beine · Gesäß",type:"time",rest:45,inc:0,lvl:2,hr:[20,40],c:"cardio",d:"F",nd:[],easy:"sidelunge",jr:"knee",
  cues:["Seitlich von einem Bein auf das andere springen","Weich auf dem Ballen landen, Knie gebeugt","Anderes Bein schwingt hinter dem Standbein","Arme schwingen mit"],
  bad:["Harte Landung mit gestrecktem Knie","Knie fällt nach innen"],atem:"Gleichmäßig weiteratmen.",
  safe:"Knie: kleine Sprünge, wenn das Knie zwickt."},
thruster:{n:"Kurzhantel-Thruster",eq:"Kurzhanteln",m:"Beine · Schultern · Kondition",type:"time",rest:60,inc:2,lvl:2,hr:[30,40],c:"cardio",d:"F",nd:[["db"]],easy:"dbsquat",jr:"sh",
  cues:["Hanteln auf Schulterhöhe","Tief in die Kniebeuge","Aus der Kniebeuge kraftvoll aufstehen und die Hanteln über Kopf drücken","Hanteln zurück auf die Schultern, direkt weiter"],
  bad:["Hohlkreuz oben","Zu schwere Hanteln"],atem:"Unten einatmen, beim Drücken ausatmen.",
  safe:"Schulter: leichte Hanteln, nur schmerzfrei über Kopf."},
dbsnatch:{n:"Kurzhantel-Snatch einarmig",eq:"Kurzhantel",m:"Ganzkörper · Schnellkraft",type:"time",rest:60,inc:2,lvl:3,hr:[30,40],c:"cardio",d:"F",nd:[["db"]],easy:"kbswing",jr:"sh",
  cues:["Hantel zwischen den Füßen, Hüfte zurück","Explosiv aus Hüfte und Beinen strecken","Hantel nah am Körper nach oben ziehen und über Kopf fangen","Kontrolliert zurück, Seite wechseln"],
  bad:["Mit dem Arm reißen","Runder Rücken"],atem:"Unten einatmen, bei der Streckung ausatmen.",
  safe:"Schulter: nur mit sauberer Technik und leichtem Gewicht."},

/* ---------------- GRIFF ---------------- */
platepinch:{n:"Scheiben-Pinch halten",eq:"Hantelscheiben",m:"Fingerkraft · Griffkraft",type:"time",rest:60,inc:0,lvl:1,hr:[20,40],c:"arme",s:"fore",d:"",nd:[["barbell"]],easy:"farmerhold",wOpt:1,
  cues:["Je Hand zwei glatte Scheiben aneinanderlegen","Nur mit Fingern und Daumen greifen (Pinch)","Aufrecht stehen, Arme locker seitlich","Bis zur Zeit halten, kontrolliert absetzen"],
  bad:["Scheiben an den Körper lehnen","Schultern hängen nach vorn"],atem:"Ruhig weiteratmen.",
  note:"Trainiert den Daumen- und Fingergriff, hilft beim Hängen."}
};

/* ---------- registrieren: EX, Kategorie, Bewegungsmuster, Muskelgruppe, Tag, Geräte ---------- */
const KX_KEYS=Object.keys(KXD);
const KX_FIN={shadowbox:["A"],dbsnatch:["B"],thruster:["C"],highknees:["A","B","C"],skater:["A","B","C"]};
for(const k of KX_KEYS){const{c,s,g,d,nd,...e}=KXD[k];EX[k]={...e,kx:1};CAT[k]=c;if(s)SUB[k]=s;MG_OF[k]=g||null;if(nd&&nd.length)NEEDS[k]=nd;
  if(d==="F")for(const D of KX_FIN[k]||DAYS)DAYFIN[D].push(k);else if(d)DAYEX[d].push(k)}
/* Wiederholungsbereich der neuen Übungen (beim Tauschen/Rotieren); Zeitübungen über hr wie bisher */
{const _rf=repsFor;repsFor=function(it,k){if(k!==it.ex&&EX[k]&&EX[k].kx&&EX[k].type!=="time"&&EX[k].rr&&EX[it.ex].type!=="time")return{lo:EX[k].rr[0],hi:EX[k].rr[1]};return _rf(it,k)}}
/* die Geräte-Anpassung (3.1/3.2) bleibt exakt wie vorher: sie sieht die neuen Übungen nicht */
{const _ac=adaptCore;adaptCore=function(day,items,usage){const sv={};for(const D of DAYS){sv[D]=[DAYEX[D],DAYFIN[D]];DAYEX[D]=DAYEX[D].filter(k=>!(EX[k]&&EX[k].kx));DAYFIN[D]=DAYFIN[D].filter(k=>!(EX[k]&&EX[k].kx))}
  try{return _ac(day,items,usage)}finally{for(const D of DAYS){DAYEX[D]=sv[D][0];DAYFIN[D]=sv[D][1]}}}}

/* ---------- Plan: Rotation auf Nebenplätzen ---------- */
const KX_MAINRE=/Kniebeuge|Bankdrück|Kreuzheb|Schulterdrück|Rudern|Klimmz|Chin-up/i;/* Hauptübungen (wie die Prüfung): nie ersetzt, nie eingesetzt */
const KX_CTX={w:null};
function kxCycle(){const p=S&&S.prog;return validProg(p)?p.cycle:1}
function kxRound(){const c=kxCycle();return c%2===0?c/2:0}/* 0 = gewohnter Plan; 1, 2, … = Runde mit neuen Übungen */
function kxSlotOk(it){return!!it&&!it.fin&&!it.blk&&!it.kb&&it.slot>0&&EX[it.ex]&&!EX[it.ex].kx&&!KX_MAINRE.test(EX[it.ex].n)}
function kxRotPool(day,it){const isT=EX[it.ex].type==="time";const rear=SUB[it.ex]==="rear"||it.ex==="facepull";const r0=TRANK[EX[it.ex].type]??3;
  return KX_KEYS.filter(k=>DAYEX[day].includes(k)&&(rear?SUB[k]==="rear":SUB[k]===SUB[it.ex])&&canDo(k)&&!EX[k].jr&&(EX[k].lvl||2)<=2&&!KX_MAINRE.test(EX[k].n)&&(EX[k].type==="time")===isT&&AN[animOf(k)]
    &&(TRANK[EX[k].type]??3)<=Math.max(r0,1))}/* mit Gewicht bleibt mit Gewicht (Hantel/Langhantel), Band/Körpergewicht dürfen alles */
/* alle 12 Einheiten einer Runde werden zusammen gewählt: jede neue Übung höchstens 2× pro Zyklus */
const KX_MEMO={k:null,v:null};
function kxRoundPlan(r){const key=r+"|"+myGear().slice().sort().join(",")+"|"+kbOn()+"|"+JSON.stringify(S.settings||{});if(KX_MEMO.k===key)return KX_MEMO.v;
  const res={},use={};
  for(let w=1;w<=PROGRAM.length;w++)for(const d of DAYS){const out=_kxBase(d,w);const used=new Set(out.map(x=>x.ex));
    const el=out.map((x,i)=>i).filter(i=>kxSlotOk(out[i])&&kxRotPool(d,out[i]).length);const di=DAYS.indexOf(d);const pick={};let n=0;
    for(let j=0;j<el.length&&n<2;j++){const i=el[(r+di+w+j)%el.length];if(pick[i])continue;const pool=kxRotPool(d,out[i]).filter(k=>!used.has(k)&&(use[k]||0)<2);if(!pool.length)continue;
      const k=pool[(r-1+w+j)%pool.length];pick[i]=k;used.add(k);use[k]=(use[k]||0)+1;n++}
    res[w+d]={base:JSON.stringify(out),pick}}
  KX_MEMO.k=key;KX_MEMO.v=res;return res}
function _kxBase(d,w){return _kxKb(d,adaptItems(d,adaptBase(w,d),w))}
let _kxKb=null;
function kxMix(day,items,week){const r=kxRound();if(!r||!week)return items;const P=kxRoundPlan(r)[week+day];if(!P||P.base!==JSON.stringify(items))return items;
  return items.map((it,i)=>{const k=P.pick[i];return k?{...it,ex:k,...repsFor({...it},k),rot:1,orig:it.ex,lo0:it.lo,hi0:it.hi}:{...it}})}
{const _pi=planItems;planItems=function(day,quick,week){const prev=KX_CTX.w,pd=KX_CTX.d;KX_CTX.w=week||progBlock();KX_CTX.d=day;try{return _pi(day,quick,week)}finally{KX_CTX.w=prev;KX_CTX.d=pd}}}
/* 3.4: Die neuen Übungen auf Nebenplätzen dürfen nie Hauptübungen kürzen. Maßstab ist der gewohnte Plan (wie 3.3, gleiche
   Einstellungen): jede Hauptübung behält mindestens dessen Sätze, die Einheit bleibt <= 59 min. Reicht das Kürzen von Neben-/
   Bonussätzen nicht, kommt auf den Nebenplatz eine kürzere neue Übung, sonst wieder die gewohnte Übung. */
{const _fh=fitHour;const isM=x=>x.slot===0||KX_MAINRE.test(EX[x.ex].n);const back=it=>{const{rot:_r,orig:_o,lo0:_l,hi0:_h,...r}=it;return{...r,ex:it.orig,lo:it.lo0??it.lo,hi:it.hi0??it.hi}};
  fitHour=function(items){if(!items.some(x=>x.rot&&x.orig))return _fh(items);
    const ref=_fh(items.map(x=>x.rot&&x.orig?back(x):x));const need={};for(const x of ref)if(!x.fin&&isM(x))need[x.ex]=x.sets;
    const ok=o=>estSecs(o,false)<=3540&&o.every(x=>x.fin||!(x.ex in need)||x.sets>=need[x.ex]);
    let cur=items.map(x=>({...x}));let out=_fh(cur);const day=KX_CTX.d;const one=it=>estSecs([it],false)-estSecs([],false);
    for(let g=0;g<8&&!ok(out);g++){const rot=cur.map((x,i)=>i).filter(i=>cur[i].rot&&cur[i].orig&&EX[cur[i].orig]);if(!rot.length)break;let best=null;
      for(const i of rot.slice().reverse()){const it=cur[i];const base=back(it);const used=new Set(cur.map(x=>x.ex));
        const pool=day?kxRotPool(day,base).filter(k=>!used.has(k)).map(k=>({...it,ex:k,...repsFor({...base},k)})).filter(c=>one(c)<one(it)).sort((a,b)=>one(a)-one(b)):[];
        for(const c of pool){const t=cur.map((x,j)=>j===i?c:x);if(ok(_fh(t))){best=t;break}}if(best)break}
      if(!best){const i=rot[rot.length-1];best=cur.map((x,j)=>j===i?back(x):x)}
      cur=best;out=_fh(cur)}
    return out}}
{const _km=kbMix;_kxKb=_km;kbMix=function(day,items){const it=_km(day,items);return KX_CTX.w?kxMix(day,it,KX_CTX.w):it}}

/* ---------- Tauschen: zusätzlich bis zu 2 passende neue Übungen ---------- */
{const _sp=swapPool;swapPool=function(it,day){const base=_sp(it,day);if(it.hfin||it.blk||it.fin)return base;day=day||(S.session&&S.session.plan)||"A";
  const used=new Set((S.session&&S.session.items||[]).map(x=>x.ex));const isT=k=>EX[k].type==="time";const sub=SUB[it.ex];const rear=it.ex==="facepull"||sub==="rear";
  const have=base.filter(k=>EX[k].kx).length;if(have>=2)return base;const lv=k=>EX[k].lvl||2,l0=lv(it.ex);
  const add_=KX_KEYS.filter(k=>!base.includes(k)&&!used.has(k)&&k!==it.ex&&(DAYEX[day]||[]).includes(k)&&(rear?["rear","rowp"].includes(SUB[k]):SUB[k]===sub)&&isT(k)===isT(it.ex)&&canDo(k)&&AN[animOf(k)])
    .sort((a,b)=>(!!EX[a].jr)-(!!EX[b].jr)||Math.abs(lv(a)-l0)-Math.abs(lv(b)-l0));
  return[...base,...add_.slice(0,2-have)]}}

/* ---------- Übungsblatt: Atmung, leichtere Variante, Hinweis für Schulter/Hüfte ---------- */
{const _os=openExSheet;openExSheet=function(key){_os(key);const e=EX[key];if(!e||!e.kx)return;const sh=$("#sheet");if(!sh)return;
  const ol=sh.querySelector("ol.cues");const box=ol&&ol.parentElement;if(!box)return;
  const tl=sh.querySelector(".tagline");if(tl&&e.easy&&EX[e.easy]){const t=document.createElement("span");t.className="tag";t.textContent="Leichter: "+EX[e.easy].n;tl.appendChild(t)}
  if(tl&&e.jr&&KX_RISK[e.jr]){const t=document.createElement("span");t.className="tag";t.textContent="Achtung: "+KX_RISK[e.jr];tl.appendChild(t)}
  if(e.atem){const d=document.createElement("div");d.innerHTML=`<div class="label" style="margin-bottom:8px">Atmung</div><p class="muted" style="margin:0;font-size:14px">${esc(e.atem)}</p>`;box.after(d)}}}

/* ---------- Animationen (Motion-Engine wie die bestehenden Übungen; Mann und Frau) ---------- */
/* eigene Geräte: kband = Band zu einem Gelenk (auch Vorderansicht), lmbar = Landmine-Stange mit Drehpunkt am Boden,
   fplate = Hantelscheibe in der Vorderansicht (hochkant), kneeband = Miniband um die Knie, towelpad = Handtuch unter der Ferse,
   rackpin = Rack-Pfosten mit Ablage, fdb = Kurzhantel in der Vorderansicht an einem beliebigen Gelenk */
if(typeof EXTRA_EQ_LAYER!=="undefined")Object.assign(EXTRA_EQ_LAYER,{kband:"front",lmbar:"front",fplate:"front",kneeband:"front",towelpad:"back",rackpin:"back"});
{const _d=drawExtraEq;drawExtraEq=function(ctx,e,o,P,R,fl,front){const mini=ctx.canvas.clientWidth<110;const f0=fl!=null?fl:0;
  const steel=(a,b,w)=>{const A=P(a),B=P(b);ctx.strokeStyle="#7d8a93";ctx.lineWidth=Math.max(1,R(w));ctx.lineCap="round";ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke();
    if(!mini){ctx.strokeStyle="rgba(240,246,250,.55)";ctx.lineWidth=Math.max(.6,R(w*.3));ctx.beginPath();ctx.moveTo(A[0],A[1]);ctx.lineTo(B[0],B[1]);ctx.stroke()}};
  if(e.t==="kband"){const a=typeof e.at==="string"?o[e.at]:e.at;if(!a)return;const EQ=eqKit(ctx,R(1),mini);ctx.save();EQ.band(P(e.from),P(a),1,e.sag!=null?e.sag:.05);if(e.at2&&o[e.at2])EQ.band(P(e.from2||e.from),P(o[e.at2]),1,e.sag!=null?e.sag:.05);ctx.restore();return}
  if(e.t==="kneeband"){const a=o.kneeR,b=o.kneeL;if(!a||!b)return;const EQ=eqKit(ctx,R(1),mini);ctx.save();EQ.band(P([a[0]-2,a[1]+4]),P([b[0]+2,b[1]+4]),1,.02);ctx.restore();return}
  if(e.t==="lmbar"){const h=o[e.at||"hand"];if(!h)return;const pv=[e.px,f0+2];const d=norm2(sub(h,pv));const end=add(h,[d[0]*14,d[1]*14]);ctx.save();/* 3.8: Stange in Joschys Farbe (Silber/Gold) */if(typeof ANW!=="undefined"&&ANW.gold)eqKit(ctx,R(1),mini).rod(P(pv),P(end),Math.max(1,R(2.6)),false,true);else steel(pv,end,2.6);
    const EQ=eqKit(ctx,R(1),mini);EQ.plate(P(add(h,[d[0]*9,d[1]*9])),e.r||15,CSS[e.c||"--p10"]||CSS["--accent"],CAM,null,true);ctx.restore();return}
  if(e.t==="fplate"){const h=o[e.at];if(!h)return;const c=add(h,[0,e.dy||0]);const A=P([c[0]-(e.w||2.6),c[1]+(e.h||15)]);const w=R(2*(e.w||2.6)),hh=R(2*(e.h||15));ctx.save();
    const g=ctx.createLinearGradient(A[0],0,A[0]+w,0);g.addColorStop(0,"#1b2025");g.addColorStop(.5,CSS[e.c||"--p10"]||"#888");g.addColorStop(1,"#0d1013");ctx.fillStyle=g;ctx.beginPath();ctx.roundRect?ctx.roundRect(A[0],A[1],w,hh,R(1.2)):ctx.rect(A[0],A[1],w,hh);ctx.fill();ctx.restore();return}
  if(e.t==="towelpad"){const a=o[e.at||"ankle"];if(!a)return;const A=P([a[0]-8,f0+2.6]),B=P([a[0]+9,f0]);ctx.save();ctx.fillStyle="#d9cdb3";ctx.fillRect(A[0],A[1],B[0]-A[0],B[1]-A[1]);ctx.restore();return}
  if(e.t==="kpad")return;
  if(e.t==="rackpin"){ctx.save();steel([e.x,f0],[e.x,e.h||190],3.4);steel([e.x-9,e.y],[e.x+9,e.y],2.4);ctx.restore();return}
  return _d(ctx,e,o,P,R,fl,front)}}
{const _b=extraBounds;extraBounds=function(e,o,inc){if(e.t==="kband"){inc(e.from,3);if(e.from2)inc(e.from2,3);return}if(e.t==="lmbar"){inc([e.px,0],3);const h=o[e.at||"hand"];if(h)inc(h,(e.r||15)+14);return}
  if(e.t==="fplate"){const h=o[e.at];if(h)inc(add(h,[0,e.dy||0]),(e.h||15)+1);return}if(e.t==="rackpin"){inc([e.x,e.h||190],4);inc([e.x,0]);return}if(e.t==="kpad"){for(const p of e.pts)inc(p,2);return}if(e.t==="kneeband"||e.t==="towelpad")return;return _b(e,o,inc)}}
/* Ableitung von einer bestehenden Animation (wie holdAnim): eigene Kopie, Zwischenspeicher der Engine entfernt */
function kxA(base,o){const b=AN[base];const d={...b,...o,A:{...b.A,...(o.A||{})},B:{...b.B,...(o.B||{})},tempo:(o.tempo||b.tempo).slice(),ph:(o.ph||b.ph).slice()};
  for(const k of["_pl","_f2","_ff","_pt","_pu","_lt","_tn","_sw","_gm","_bb","_lag","_hum"])delete d[k];for(const k in o)if(o[k]===undefined)delete d[k];return d}
/* gerader Körper vom Fußgelenk aus (Liegestütz-Linie): Winkel b, Zehen am Boden */
const kxPl=(b,f)=>({shin:b+180,thigh:b+180,torso:b,foot:f==null?-70:f});
const kxSh=(b,ay)=>[Math.cos(rad(b))*150,ay+Math.sin(rad(b))*150];
const DB=a=>({t:"db",at:a||"hand"});
Object.assign(AN,{
  /* ---- Brust ---- */
  bbfloor:kxA("kbfloor",{eq:[{t:"plate",at:"hand",c:"--p20",r:18}],B:{hand:[12,16]}}),
  dbfloor:kxA("kbfloor",{eq:[DB()]}),
  bbincline:kxA("incline",{eq:[{t:"bench"},{t:"plate",at:"hand",c:"--p20",r:19}]}),
  squeezepress:kxA("dbbench",{A:{hand:[3,58]},B:{hand:[14,14]},tempo:[1.8,.4,1.2,.5]}),
  dbpullover:{anchor:"hip",A:{torso:180,thigh:-20,shin:-95,upper:92,fore:98},B:{torso:180,thigh:-20,shin:-95,upper:168,fore:174},K:[{t:.5,upper:130,fore:138}],eq:[{t:"bench"},DB()],tempo:[2,.4,1.6,.4],ph:["Senken","Zurückziehen"]},
  pushleg:{anchor:"hand",A:{upper:-90,fore:-90,torso:20,thigh:200,shin:200,thigh2:186,shin2:186,foot:-70,foot2:-80},B:{upper:-165,fore:-55,torso:8,thigh:188,shin:188,thigh2:174,shin2:174,foot:-82,foot2:-74},eq:[],floor:0,tempo:[1.8,.3,1.1,.5],ph:["Ablassen","Drücken"]},
  plyopush:{anchor:"foot",at:[0,10.3],noBal:1,A:{...kxPl(19.2),handAt:[141,0],bend:-1},B:{...kxPl(7),handAt:[141,0],bend:-1},K2:[{t:.14,...kxPl(22.5),handAt:[141,8]}],eq:[{t:"kpad",pts:[[192,96],[-16,0]]}],floor:0,tempo:[1.1,.2,.55,.6],ph:["Ablassen","Explosiv hoch"]},
  hindupush:{anchor:"foot",at:[0,8],noBal:1,A:{...kxPl(50,-30),torso:-45,handAt:[141,0],bend:-1,neck:0},B:{...kxPl(10,-45),torso:32,handAt:[141,0],bend:-1,neck:0},K:[{t:.5,...kxPl(16,-40),torso:6,handAt:[141,0]}],eq:[],floor:0,tempo:[2.8,.5,2.8,.5],ph:["Nach vorn gleiten","Hüfte zurück"]},
  bandchest:{anchor:"foot",A:{...STAND,hand:[10,-14],bend:-1},B:{...STAND,torso:86,hand:[56,-12],bend:-1},eq:[{t:"post",x:-34,w:7,h:180},{t:"band",from:[-31,140]}],floor:0,tempo:[1,.4,1.6,.4],ph:["Drücken","Zurück"]},
  svend:{anchor:"foot",A:{...STAND,hand:[12,-16],bend:-1},B:{...STAND,torso:87,hand:[50,-14],bend:-1},eq:[{t:"plate",at:"hand",c:"--p10",r:14}],floor:0,tempo:[1.4,.5,1.6,.4],ph:["Strecken","Zurück"]},
  /* ---- Schulter ---- */
  dbohpstand:kxA("ohp",{eq:[DB()]}),
  ohpuni:kxA("ohp",{A:{hand2:[4,-52],bend2:1},B:{hand2:[4,-52],bend2:1},eq:[DB()]}),
  bbpushpress:kxA("kbpushpress",{eq:[{t:"plate",at:"hand",c:"--p20",r:19}]}),
  zpress:{anchor:"hip",at:[0,9],A:{torso:90,thigh:0,shin:0,foot:80,hand:[10,2],bend:-1},B:{torso:90,thigh:0,shin:0,foot:80,hand:[-2,60],bend:-1},K:[{t:.25,hand:[9.5,15]},{t:.5,hand:[6,34]}],eq:[DB()],floor:0,tempo:[1.2,.4,1.8,.5],ph:["Drücken","Ablassen"]},
  landmine:{anchor:"foot",A:{...STAND,thigh2:-110,shin2:-118,foot2:-20,torso:84,hand:[14,-10],bend:-1},B:{...STAND,thigh2:-110,shin2:-118,foot2:-20,torso:80,hand:[44,30],bend:-1},fix2:1,eq:[{t:"lmbar",px:205,r:15}],floor:0,tempo:[1.2,.4,1.8,.5],ph:["Drücken","Zurück"]},
  platefront:kxA("frontraise",{eq:[{t:"plate",at:"hand",c:"--p10",r:14}],B:{upper:2,fore:8}}),
  bandlateral:kxA("lateral",{eq:[{t:"kband",from:[13,1],at:"handR"},{t:"kband",from:[-13,1],at:"handL"}]}),
  uprightrow:{view:"front",A:{yf:1,hR:[8,92],hL:[-8,92],bR:1,bL:-1,s:10},B:{yf:1,hR:[8,134],hL:[-8,134],bR:1,bL:-1,s:10},eq:[{t:"db",at:"handR"},{t:"db",at:"handL"}],floor:0,tempo:[1,.4,1.6,.4],ph:["Ziehen","Ablassen"]},
  wallslide:{view:"front",A:{yf:1,ua:-12,fa:82,s:10},B:{yf:1,ua:52,fa:66,s:10},eq:[],floor:0,tempo:[1.4,.4,1.6,.4],ph:["Hochschieben","Zurück zum W"]},
  bandextrot:{view:"front",A:{ua:-88,us:1,fa:-150,fs:.32,s:10},B:{ua:-88,us:1,fa:-8,fs:.95,s:10},eq:[{t:"bandHands"}],floor:0,tempo:[1,.5,1.6,.3],ph:["Nach außen","Zurück"]},
  inclineyraise:kxA("chestrow",{A:{hand:undefined,upper:-90,fore:-88},B:{hand:undefined,upper:26,fore:28},K:[{t:.5,upper:-30,fore:-28}],eq:[{t:"benchF"},DB()],tempo:[1.2,.5,1.8,.4],ph:["Heben","Ablassen"]}),
  dbshrug:{anchor:"foot",A:{...STAND,upper:-92,fore:-90,scap:0},B:{...STAND,upper:-92,fore:-90,scap:7},eq:[DB()],floor:0,tempo:[.9,.8,1.4,.4],ph:["Hochziehen","Ablassen"]},
  bbshrug:{anchor:"foot",A:{...STAND,upper:-90,fore:-88,scap:0},B:{...STAND,upper:-90,fore:-88,scap:7},eq:[{t:"plate",at:"hand",c:"--p20",r:19}],floor:0,tempo:[.9,.8,1.4,.4],ph:["Hochziehen","Ablassen"]},
  /* ---- Trizeps ---- */
  kickback:{anchor:"foot",A:{shin:-95,thigh:-72,torso:12,upper:190,fore:-92,upper2:-80,fore2:-80},B:{shin:-95,thigh:-72,torso:12,upper:192,fore:188,upper2:-80,fore2:-80},eq:[{t:"box",x:42,w:54,y:42},DB()],floor:0,tempo:[1,.6,1.6,.4],ph:["Strecken","Zurück"]},
  bandohext:kxA("ohext",{eq:[{t:"band",from:[-16,2]}]}),
  bbtriext:{anchor:"foot",at:[0,10],noBal:1,A:{...kxPl(40),handAt:[170,92],bend:-1},B:{...kxPl(31),handAt:[170,92],bend:1},eq:[{t:"rackbar",at:[170,92]}],floor:0,tempo:[1.8,.3,1.2,.5],ph:["Beugen","Strecken"]},
  /* ---- Bizeps ---- */
  concentration:{anchor:"hip",at:[0,46],A:{torso:55,thigh:0,shin:-90,upper:-82,fore:-88,hand2:[34,-40],bend2:1},B:{torso:55,thigh:0,shin:-90,upper:-82,fore:62,hand2:[34,-40],bend2:1},K:[{t:.6,fore:10}],eq:[{t:"box",x:-28,w:42,y:38},DB()],floor:"auto",tempo:[1.2,.4,2,.4],ph:["Beugen","Ablassen"]},
  inclinecurl:{anchor:"hip",A:{torso:135,thigh:-5,shin:-95,upper:-96,fore:-94},B:{torso:135,thigh:-5,shin:-95,upper:-96,fore:62},K:[{t:.6,fore:10}],eq:[{t:"bench"},DB()],tempo:[1.2,.4,2,.4],ph:["Beugen","Ablassen"]},
  spidercurl:kxA("chestrow",{A:{hand:undefined,upper:-90,fore:-90},B:{hand:undefined,upper:-90,fore:70},K:[{t:.6,fore:12}],eq:[{t:"benchF"},DB()],tempo:[1.2,.4,2,.4],ph:["Beugen","Ablassen"]}),
  revcurl:kxA("bbcurl",{tempo:[1.2,.5,2.2,.4]}),
  dragcurl:{anchor:"foot",A:{...STAND,hand:[6,-60],bend:1},B:{...STAND,hand:[9,-16],bend:1},K:[{t:.5,hand:[9,-38]}],eq:[{t:"plate",at:"hand",c:"--p10",r:16}],floor:0,tempo:[1.2,.4,1.8,.4],ph:["Hochziehen","Ablassen"]},
  /* ---- Rücken ---- */
  pendlay:{anchor:"foot",A:{shin:-100,thigh:-42,torso:9,hand:[0,-60],bend:-1},B:{shin:-100,thigh:-42,torso:9,hand:[-18,-24],bend:-1},eq:[{t:"plate",at:"hand",c:"--p20",r:21}],floor:0,tempo:[.7,.3,1.4,.6],ph:["Ziehen","Ablegen"]},
  dbbentrow:kxA("row",{A:{shin:-100,thigh:-50,torso:38,hand:[-4,-58]},B:{shin:-100,thigh:-50,torso:38,hand:[-26,-28]},eq:[DB()]}),
  renegade:{anchor:"foot",at:[0,10.3],noBal:1,A:{...kxPl(22),handAt:[139,9.5],bend:-1,hand2:[0,-60],bend2:-1},B:{...kxPl(22),handAt:[118,40],bend:-1,hand2:[0,-60],bend2:-1},eq:[{t:"db",at:"hand",dir:[1,.22]}]/* 3.8: Hantel liegt quer am Boden, große Köpfe bleiben über dem Boden */,floor:0,tempo:[1,.4,1.4,.5],ph:["Ziehen","Absetzen"]},
  bandlat:{anchor:"hip",at:[0,50],A:{torso:92,thigh:-90,shin:180,foot:180,hand:[6,58],bend:-1},B:{torso:96,thigh:-90,shin:180,foot:180,hand:[16,6],bend:-1},eq:[{t:"band",from:[6,232]}],floor:0,tempo:[1.1,.5,1.8,.4],ph:["Ziehen","Zurück"]},
  straightarm:{anchor:"foot",A:{...STAND,torso:76,upper:32,fore:36},B:{...STAND,torso:76,upper:-78,fore:-76},eq:[{t:"post",x:150,w:7,h:205},{t:"band",from:[147,190]}],floor:0,tempo:[1.1,.5,1.7,.4],ph:["Runterziehen","Zurück"]},
  scappull:kxA("scaphang",{tempo:[.9,.6,1.3,.5],hseg:undefined,ph:["Schultern runter","Lösen"]}),
  kbgorilla:{anchor:"foot",A:{shin:-105,thigh:-30,torso:4,hand:[1,-55],bend:-1,hand2:[-2,-55],bend2:-1},B:{shin:-105,thigh:-30,torso:4,hand:[-22,-20],bend:-1,hand2:[-2,-55],bend2:-1},eq:[{t:"kb",at:"hand"},{t:"kb",at:"hand2"}],floor:0,tempo:[1,.4,1.6,.4],ph:["Ziehen","Absetzen"]},
  invrowfeet:{anchor:"foot",at:[0,44],A:{shin:-5,thigh:-5,torso:175,handAt:[-149,117],bend:1,foot:75},B:{shin:-19,thigh:-19,torso:161,handAt:[-149,117],bend:1,foot:62},eq:[{t:"rackbar",at:[-149,117]},{t:"box",x:-14,w:46,y:40}],floor:0,tempo:[1.1,.5,1.8,.4],ph:["Ziehen","Ablassen"]},
  assistpull:kxA("hangsupp",{A:{thigh:40,shin:-95,foot:0},B:{upper:-48.6,fore:102.9,torso:92,thigh:40,shin:-95,foot:0,scap:0},K:[{t:.13,upper:86,fore:90}],fixFeet:1,floor:-210,eq:[{t:"bar"},{t:"box",x:14,w:44,y:-134.1},{t:"chairback",x:56,y:-134.1,side:"r",h:40,lean:3}],tempo:[1.4,.4,1.8,.5],ph:["Hochziehen","Ablassen"]}),
  /* ---- Beine ---- */
  zercher:kxA("frontsquat",{path:{pt:"elbow",via:"torso",dx:5},A:{upper:-166,fore:-88},B:{upper:-160,fore:-72},eq:[{t:"plate",at:"elbow",c:"--p20",r:19}]}),/* 3.4: Stange in den Armbeugen (Bauch/untere Brust), Oberarme nach unten, Unterarme waagerecht */
  boxsquat:kxA("squat",{B:{shin:-104,thigh:-6,torso:48},K:undefined,eq:[{t:"box",x:-75,w:46,y:42},{t:"plate",at:"back",c:"--p25",r:19}]}),
  sumosquat:{view:"front",A:{yf:1,hy:90,aR:[30,0],aL:[-30,0],hR:[3,94],hL:[-3,94],bR:-1,bL:1},B:{yf:1,hy:56,aR:[30,0],aL:[-30,0],kR:[40,42],kL:[-40,42],hR:[3,96],hL:[-3,96],bR:-1,bL:1},eq:[{t:"db",at:"handR"}],floor:0,tempo:[1.8,.3,1.2,.5],ph:["Runter","Hoch"]},
  splitsquat:kxA("lunge",{A:{shin:-68,thigh:-50,torso:86,thigh2:-125,shin2:-140,foot2:-50},tempo:[2,.4,1.4,.5]}),
  curtsy:{view:"front",A:{yf:1,hy:91,aR:[10,0],aL:[-10,0],hR:[16,95],hL:[-16,95],bR:1,bL:-1},B:{yf:1,hy:60,hx:-6,aR:[-22,2],kR:[-6,16],aL:[-14,0],kL:[-12,44],hR:[16,95],hL:[-16,95],bR:1,bL:-1},K:[{t:.4,aR:[-6,6]}],eq:[],floor:0,tempo:[1.6,.3,1.2,.5],ph:["Kreuzschritt runter","Zurück"]},
  sidelunge:{view:"front",A:{yf:1,hy:91,aR:[10,0],aL:[-10,0],hR:[12,108],hL:[-12,108],bR:1,bL:-1},B:{yf:1,hy:58,hx:26,aR:[58,0],kR:[56,36],aL:[-12,0],kL:[-1,46],hR:[12,108],hL:[-12,108],bR:1,bL:-1},K:[{t:.35,aR:[32,7]}],eq:[],floor:0,tempo:[1.6,.3,1.2,.5],ph:["Schritt zur Seite","Zurück"]},
  stepdown:{anchor:"foot",at:[0,40],noBal:1,A:{...STAND,thigh2:-65,shin2:-85,foot2:-10,hand:[10,-50],bend:1},B:{shin:-132,thigh:-17,torso:76,thigh2:-60,shin2:-80,foot2:-12,hand:[40,-22],bend:1},eq:[{t:"box",x:-64,w:80,y:40}],floor:0,tempo:[2,.3,1.2,.5],ph:["Langsam runter","Hochdrücken"]},
  sissy:{anchor:"foot",plantToe:1,noBal:1,A:{...STAND,foot:-28,at:[0,8],handAt:[-20,106],bend:1},B:{shin:-140,thigh:-32,torso:142,foot:-46,at:[0,9],handAt:[-20,106],bend:1},eq:[{t:"post",x:-22,w:7}],floor:0,tempo:[2,.3,1.4,.5],ph:["Zurücklehnen","Hoch"]},
  pistol:kxA("pistolbox",{B:{shin:-126,thigh:0,torso:54,thigh2:8,shin2:6,upper:6,fore:8,foot2:84},eq:[]}),
  seatcalf:{anchor:"foot",plantToe:1,noBal:1,A:{shin:-90,thigh:0,torso:90,foot:0,at:[0,0],hand:[40,-46],bend:-1},B:{shin:-90,thigh:10,torso:90,foot:-42,at:[0,8],hand:[40,-46],bend:-1},eq:[{t:"box",x:-70,w:46,y:39},DB()],floor:0,tempo:[.9,.8,1.6,.4],ph:["Fersen hoch","Senken"]},
  bbcalf:kxA("calf",{A:{handTo:"back",bend:1,upper:undefined,fore:undefined},B:{handTo:"back",bend:1,upper:undefined,fore:undefined},eq:[{t:"plate",at:"back",c:"--p25",r:19}]}),
  tibraise:{anchor:"foot",noBal:1,A:{shin:-75,thigh:-75,torso:100,foot:0,upper:-96,fore:-92},B:{shin:-75,thigh:-75,torso:100,foot:30,upper:-96,fore:-92},eq:[{t:"wall",x:-40}],floor:0,tempo:[.8,.4,1.2,.4],ph:["Zehen hoch","Senken"]},
  dbsquat:kxA("airsquat",{A:{upper:-90,fore:-90},B:{upper:-80,fore:-82},eq:[DB()]}),
  assistsquat:kxA("airsquat",{A:{handAt:[44,114],bend:-1,upper:undefined,fore:undefined},B:{handAt:[44,114],bend:-1,upper:undefined,fore:undefined},eq:[{t:"post",x:48,w:7}],noBal:1}),
  chairsit:{lag:.12,anchor:"foot",noBal:1,A:{...STAND,upper:-80,fore:-70},B:{shin:-100,thigh:-2,torso:62,upper:2,fore:4},eq:[{t:"box",x:-66,w:44,y:40},{t:"chairback",x:-64,y:40,side:"l",h:42,lean:-3}],floor:0,tempo:[1.8,.6,1.2,.6],ph:["Hinsetzen","Aufstehen"]},
  /* ---- Hüfte ---- */
  sumodl:kxA("deadlift",{A:{shin:-98,thigh:-38,torso:42}}),
  rackpull:kxA("deadlift",{A:{shin:-96,thigh:-58,torso:38},eq:[{t:"rackpin",x:-6,y:36},{t:"plate",at:"hand",c:"--p25",r:24}]}),
  dbdl:kxA("deadlift",{A:{shin:-112,thigh:-8,torso:28},eq:[DB(),DB("hand2")]}),
  kbdl:kxA("deadlift",{A:{shin:-112,thigh:-8,torso:28},eq:[{t:"kb",at:"hand"}]}),
  sglrdl:{lag:.1,anchor:"foot",noBal:1,A:{...STAND,thigh2:-96,shin2:-104,foot2:-30,upper:-92,fore:-90},B:{shin:-97,thigh:-78,torso:8,thigh2:-182,shin2:-184,foot2:-95,upper:-92,fore:-90},K:[{t:.3,torso:62,thigh2:-150}],eq:[DB()],tempo:[2.4,.5,2.4,.5],ph:["Vorbeugen","Aufrichten"]},
  sglhipthrust:kxA("hipthrust",{A:{thigh2:96,shin2:-12},B:{thigh2:70,shin2:-38},fixFeet:undefined,eq:[{t:"box",x:-42,w:40,y:40}]}),
  bbbridge:kxA("glutebridge",{eq:[{t:"plate",at:"hip",c:"--p20",r:16,dy:9}]}),
  frogpump:kxA("glutebridge",{A:{thigh:52,shin:-48},B:{thigh:22,shin:-40},tempo:[.7,.5,1,.3]}),
  donkeykick:kxA("birddog",{A:{thigh2:-90,shin2:180},B:{thigh:-178,shin:94,foot:178,upper:-90,fore:-90},tempo:[1,.6,1.4,.4],ph:["Hochdrücken","Senken"]}),
  bandkick:{anchor:"foot",noBal:1,A:{...STAND,torso:78,thigh2:-94,shin2:-98,foot2:-10,handAt:[40,110],bend:-1},B:{...STAND,torso:74,thigh2:-128,shin2:-132,foot2:-50,handAt:[40,110],bend:-1},eq:[{t:"post",x:46,w:7},{t:"kband",from:[42,8],at:"ankle2"}],floor:0,tempo:[1,.5,1.4,.4],ph:["Kick","Zurück"]},
  sidelyingabd:{view:"front",floor:0,eq:[],tempo:[1,.5,1.6,.4],ph:["Heben","Senken"],A:{yf:1,hx:12,hy:14,lean:88,aR:[-76,9],kR:[-34,12],aL:[-80,3],kL:[-36,6],ua:86,fa:160,uaL:-96,faL:-84},B:{yf:1,hx:12,hy:14,lean:88,aR:[-70,48],kR:[-30,32],aL:[-80,3],kL:[-36,6],ua:86,fa:160,uaL:-96,faL:-84}},
  bandwalk:{view:"front",A:{yf:1,hy:84,hx:-4,aR:[18,0],aL:[-26,0],kR:[16,44],kL:[-20,44],hR:[12,104],hL:[-12,104],bR:1,bL:-1},B:{yf:1,hy:84,hx:4,aR:[26,0],aL:[-18,0],kR:[20,44],kL:[-16,44],hR:[12,104],hL:[-12,104],bR:1,bL:-1},K:[{t:.5,aR:[26,6]}],K2:[{t:.5,aL:[-26,6]}],eq:[{t:"kneeband"}],floor:0,tempo:[.6,.1,.6,.1],ph:["Schritt","Schritt"]},
  bridgewalk:kxA("glutebridge",{A:{torso:205,thigh:5,shin:-52,neck:-25},B:{torso:196,thigh:-6,shin:-22,neck:-12},tempo:[1.6,.4,1.6,.4],ph:["Füße nach vorn","Zurück"]}),
  slidecurl:{anchor:"shoulder",at:[0,9],A:{torso:190,thigh:-8,shin:-8,foot:80,upper:-8,fore:-2,neck:-10},B:{torso:205,thigh:20,shin:-75,foot:20,upper:-8,fore:-2,neck:-25},eq:[{t:"towelpad",at:"ankle"}],floor:0,tempo:[1.6,.4,1.2,.5],ph:["Strecken","Heranziehen"]},
  pullthrough:{anchor:"foot",A:{...STAND,hand:[8,-62],bend:-1},B:{shin:-96,thigh:-65,torso:28,hand:[-30,-46],bend:-1},eq:[{t:"post",x:-110,w:7,h:150},{t:"band",from:[-107,12]}],floor:0,tempo:[1.8,.3,1.2,.5],ph:["Hüfte zurück","Strecken"]},
  reversehyper:{anchor:"hip",at:[0,50],flip:1,A:{torso:2,thigh:208,shin:208,foot:-100,hand:[30,-34],bend:1,neck:-6},B:{torso:2,thigh:180,shin:180,foot:-90,hand:[30,-34],bend:1,neck:-6},eq:[{t:"box",x:-6,w:74,y:42}],floor:0,tempo:[1,.6,1.6,.4],ph:["Beine heben","Senken"]},
  bridgemarch:kxA("glutebridge",{A:{torso:205,thigh:5,shin:-52,thigh2:72,shin2:-20,neck:-25},B:{torso:205,thigh:72,shin:-20,thigh2:5,shin2:-52,neck:-25},K:[{t:.5,thigh:5,shin:-52,thigh2:5,shin2:-52}],tempo:[1.4,.4,1.4,.4],fixFeet:undefined,ph:["Knie hoch","Wechseln"]}),
  bridgechair:{lag:.1,anchor:"shoulder",at:[0,9],fixFeet:1,A:{torso:180,thigh:58,shin:-12,hand:[40,-6],bend:1,neck:0},B:{torso:206,thigh:24,shin:-40,hand:[40,-6],bend:1,neck:-25},eq:[{t:"box",x:108,w:44,y:40},{t:"chairback",x:150,y:40,side:"r",h:40,lean:3}],floor:0,tempo:[1,.8,1.6,.4],ph:["Hüfte hoch","Ablegen"]},
  /* ---- Rumpf ---- */
  vup:{anchor:"hip",at:[0,9],A:{torso:180,thigh:2,shin:2,foot:80,upper:182,fore:182,neck:-6},B:{torso:132,thigh:46,shin:46,foot:120,upper:58,fore:54,neck:-14},eq:[],floor:0,tempo:[1,.3,1.4,.5],ph:["Hoch zum V","Ablegen"]},
  bicycle:{anchor:"hip",at:[0,9],A:{torso:158,thigh:62,shin:-8,thigh2:16,shin2:14,foot:10,foot2:20,hand:[-10,12],bend:1,neck:-12},B:{torso:156,thigh:16,shin:14,thigh2:62,shin2:-8,foot:20,foot2:10,hand:[-8,10],bend:1,neck:-12},eq:[],floor:0,tempo:[.8,.2,.8,.2],ph:["Drehen","Wechseln"]},
  revcrunch:{anchor:"shoulder",at:[0,9],A:{torso:180,thigh:90,shin:0,foot:10,upper:0,fore:0},B:{torso:198,thigh:128,shin:40,foot:50,upper:-2,fore:0,neck:-20},eq:[],floor:0,tempo:[1,.5,1.4,.4],ph:["Einrollen","Zurück"]},
  situp:{anchor:"hip",at:[0,9],A:{torso:180,thigh:50,shin:-60,foot:0,hand:[18,-14],bend:1},B:{torso:82,thigh:50,shin:-60,foot:0,hand:[18,-14],bend:1},K:[{t:.45,torso:140}],fixFeet:1,eq:[],floor:0,tempo:[1.2,.4,1.6,.4],ph:["Aufrollen","Zurückrollen"]},
  shtap:{anchor:"foot",at:[0,10.3],noBal:1,A:{...kxPl(19),handAt:[141,2],bend:-1,hand2:[0,-56],bend2:-1},B:{...kxPl(19),handAt:[150,44],bend:-1,hand2:[0,-56],bend2:-1},eq:[{t:"kpad",pts:[[176,82],[-12,0]]}],floor:0,tempo:[1,.4,1,.4],ph:["Tippen","Zurück"]},
  plankupdown:{anchor:"foot",at:[0,10.3],noBal:1,A:{...kxPl(8.5),handAt:[178,1.5],bend:1},B:{...kxPl(20),handAt:[141,0],bend:-1},K:[{t:.5,...kxPl(15),handAt:[160,10]}],eq:[],floor:0,tempo:[1,.6,1,.6],ph:["Hoch in den Stütz","Runter auf die Unterarme"]},
  kneeplank:kxA("plank",{A:{thigh:-24,shin:-2,foot:-10},B:{thigh:-24.6,shin:-2.6,foot:-10}}),
  plankleg:kxA("plank",{A:{thigh2:-8.8,shin2:-8.8,foot2:-98.8},B:{thigh:-9.4,shin:-9.4,thigh2:6,shin2:6,foot2:-84},tempo:[1,.8,1.2,.4],ph:["Bein heben","Absetzen"]}),
  pallof:{view:"front",A:{ua:-100,us:1,fa:135,fs:.42,s:12},B:{ua:-120,us:.3,fa:-110,fs:.3,s:12},eq:[{t:"kband",from:[112,136],at:"handR",at2:"handL"}],floor:0,tempo:[1,1,1.4,.4],ph:["Drücken & halten","Zurück"]},
  woodchop:{view:"front",A:{yf:1,lean:-6,hx:3,ua:52,fa:58,uaL:22,faL:40,s:14},B:{yf:1,lean:10,hx:-4,ua:-150,fa:-142,uaL:-118,faL:-126,s:14},eq:[{t:"kband",from:[118,205],at:"handR"}],floor:0,tempo:[1.2,.4,1.8,.4],ph:["Diagonal ziehen","Zurück"]},
  suitcase:kxA("farmer",{eq:[DB()]}),
  sidebend:{view:"front",A:{yf:1,lean:0,ua:-86,fa:-86,s:10},B:{yf:1,lean:-16,ua:-90,fa:-90,s:10},eq:[{t:"db",at:"handR"}],floor:0,tempo:[1.4,.3,1.4,.4],ph:["Neigen","Aufrichten"]},
  toesbar:kxA("legraise",{tempo:[2.4,.4,2.4,.4],B:{upper:108,fore:110,torso:116,thigh:94,shin:94,foot:70}}),
  stirpot:{anchor:"foot",at:[0,10.3],noBal:1,A:{...kxPl(33),upper:-76,fore:4},B:{...kxPl(33.5),upper:-102,fore:-4},eq:[{t:"gymball",x:136,y:30,r:30}],floor:0,tempo:[.9,0,.9,0],ph:["Kreisen","Kreisen"]},
  balljack:{anchor:"hand",A:{upper:-90,fore:-90,torso:-2,thigh:182,shin:182,foot:-70},B:{upper:-96,fore:-92,torso:-20,thigh:-32,shin:178,foot:-170},eq:[{t:"mball",at:"ankle",r:28,dy:-30,c:"gym"}],floor:0,tempo:[1,.5,1.3,.4],ph:["Knie ran","Strecken"]},
  seatedtuck:{anchor:"hip",at:[0,48],A:{torso:108,thigh:-12,shin:-42,foot:-20,handAt:[6,42],bend:1},B:{torso:112,thigh:46,shin:-58,foot:-40,handAt:[6,42],bend:1},eq:[{t:"box",x:-30,w:44,y:40},{t:"chairback",x:-28,y:40,side:"l",h:42,lean:-3}],floor:0,tempo:[1,.4,1.4,.4],ph:["Knie ran","Strecken"]},
  crabwalk:{anchor:"hip",at:[0,40],A:{torso:158,thigh:14,shin:-94,thigh2:4,shin2:-98,foot:0,foot2:0,upper:-98,fore:-94,upper2:-92,fore2:-90},B:{torso:158,thigh:4,shin:-98,thigh2:14,shin2:-94,foot:0,foot2:0,upper:-92,fore:-90,upper2:-98,fore2:-94},K:[{t:.5,thigh:12,shin:-90}],K2:[{t:.5,thigh2:12,shin2:-90}],eq:[],floor:0,tempo:[.7,.1,.7,.1],ph:["Schritt","Schritt"]},
  floordip:{anchor:"hand",at:[-38,0],fixFeet:1,A:{upper:-80,fore:-80,torso:135,thigh:28,shin:-78,foot:8},B:{upper:-122,fore:-58,torso:136,thigh:40,shin:-70,foot:0},eq:[],floor:0,tempo:[1.4,.3,1.1,.5],ph:["Beugen","Strecken"]},
  backwidow:{anchor:"hip",at:[0,9],A:{torso:180,thigh:50,shin:-60,foot:0,upper:-2,fore:88,neck:0},B:{torso:166,thigh:50,shin:-60,foot:0,upper:-18,fore:84,neck:-6},eq:[],floor:0,tempo:[1,.8,1.4,.4],ph:["Ellbogen drücken","Ablegen"]},
  /* ---- Kondition ---- */
  highknees:kxA("march",{A:{thigh:-4,shin:-96,thigh2:-92,shin2:-100,upper:-40,fore:40,upper2:-120,fore2:-90},B:{thigh:-92,shin:-100,thigh2:-4,shin2:-96,upper:-120,fore:-90,upper2:-40,fore2:40},tempo:[.32,0,.32,0]}),
  shadowbox:kxA("boxing",{eq:[]}),
  skater:{anchor:"hip",at:[0,84],A:{torso:72,thigh:-70,shin:-112,foot:0,thigh2:-125,shin2:-160,foot2:-70,upper:-40,fore:-10,upper2:-140,fore2:-120},B:{torso:72,thigh:-125,shin:-160,foot:-70,thigh2:-70,shin2:-112,foot2:0,upper:-140,fore:-120,upper2:-40,fore2:-10},eq:[],floor:"auto",tempo:[.5,.15,.5,.15],ph:["Sprung","Sprung"]},
  thruster:{lag:.12,anchor:"foot",A:{shin:-120,thigh:-10,torso:62,hand:[9,2],bend:-1},B:{...STAND,hand:[-3,60],bend:-1},K:[{t:.5,shin:-96,thigh:-80,torso:84,hand:[9.5,10]}],K2:[{t:.5,shin:-95,thigh:-85,torso:86,hand:[9,4]}],eq:[DB()],floor:0,tempo:[1,.3,1.4,.3],ph:["Hoch & drücken","Runter"]},
  dbsnatch:{lag:.1,anchor:"foot",A:{shin:-106,thigh:-40,torso:30,upper:-94,fore:-92},B:{...STAND,upper:94,fore:92},K:[{t:.45,shin:-92,thigh:-86,torso:84,upper:-40,fore:-40},{t:.72,upper:30,fore:80}],eq:[DB()],floor:0,tempo:[1,.4,1.3,.4],ph:["Explosiv hoch","Zurück"]},
  /* ---- Griff ---- */
  platepinch:{view:"front",A:{ua:-86,fa:-86,s:10},B:{ua:-85.4,fa:-85.4,s:10,br:1},eq:[{t:"fplate",at:"handR",c:"--p10"},{t:"fplate",at:"handL",c:"--p10"}],floor:0,tempo:[2,1,2,1],ph:["Halten","Atmen"]}
});
Object.assign(ANIM_OF,{bandpullapart:"pullapart",walklunge:"lunge"});
