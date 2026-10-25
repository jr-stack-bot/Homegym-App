/* split: push-pull-legs */
/* 4-week cycle. items: [key, sets, lo, hi]; fin: finisher */
const PROGRAM=[
 {theme:"Grundkraft",days:[
   {key:"A",name:"Drücken · Bankdrücken",items:[["bench",4,6,8],["ohpdb",3,8,12],["feetpush",3,8,15],["lateral",3,12,15],["pushdown",3,10,15],["ohext",2,10,12]],fin:["boxing",3,45,60]},
   {key:"B",name:"Ziehen · Klimmzüge",items:[["pullup",4,5,8],["chestrow",4,8,12],["invrow",3,8,12],["facepull",3,12,15],["curl",3,10,12],["hammer",2,10,12]],fin:["farmer",3,40,60]},
   {key:"C",name:"Beine · Kniebeuge",items:[["squat",4,5,8],["rdl",3,8,12],["revlunge",3,8,12],["calf",3,12,15],["plank",3,30,45],["kneeraise",3,10,15]],fin:["run",4,30,45]}]},
 {theme:"Schulter & Hüfte",days:[
   {key:"A",name:"Drücken · Schulterdrücken",items:[["ohp",4,5,8],["dbbench",4,8,12],["pushup",3,10,15],["lateral",3,12,15],["ohext",3,10,12],["frontraise",2,10,12]],fin:["boxing",3,45,60]},
   {key:"B",name:"Ziehen · Brustgestütztes Rudern",items:[["chestrow",4,8,10],["negpull",3,5,8],["dbrow",3,8,12],["facepull",3,12,15],["bbcurl",3,8,12],["hammer",2,10,12]],fin:["run",4,30,45]},
   {key:"C",name:"Beine · Kreuzheben",items:[["deadlift",3,5,6],["goblet",3,10,12],["hipthrust",3,8,12],["stepup",3,8,12],["calf",3,12,15],["deadbug",3,8,10]],fin:["run",4,30,45]}]},
 {theme:"Kurzhantel & Kontrolle",days:[
   {key:"A",name:"Drücken · Kurzhantel-Bank",items:[["dbbench",4,6,8],["arnold",3,8,12],["diamondpush",3,8,15],["lateral",3,12,15],["pikepush",2,8,12],["skull",3,10,12]],fin:["run",4,30,45]},
   {key:"B",name:"Ziehen · Chin-ups",items:[["chinup",4,6,8],["dbrow",3,8,12],["invrow",3,8,12],["facepull",3,12,15],["curl",3,10,12],["hammer",2,10,12]],fin:["farmer",3,40,60]},
   {key:"C",name:"Beine · Frontkniebeuge",items:[["frontsquat",4,5,8],["rdlbb",3,8,10],["lunge",3,8,12],["calf",3,12,15],["crunch",3,12,15],["birddog",2,8,10]],fin:["run",4,30,45]}]},
 {theme:"Einbeinig & Volumen",days:[
   {key:"A",name:"Drücken · Schrägbank & eng",items:[["incline",4,8,10],["closegrip",3,6,8],["feetpush",3,10,15],["lateral",3,12,15],["frontraise",2,10,12],["pushdown",3,12,15]],fin:["boxing",3,45,60]},
   {key:"B",name:"Ziehen · Einarmiges Rudern",items:[["dbrow",4,8,10],["pullup",3,5,8],["invrow",3,8,12],["facepull",3,12,15],["bbcurl",3,8,12],["hammer",3,10,12]],fin:["run",4,30,45]},
   {key:"C",name:"Beine · Split Squat & Hüftstoß",items:[["bss",3,8,10],["hipthrust",4,8,12],["goblet",3,10,15],["goodmorning",3,8,10],["calf",3,12,15],["plank",3,40,60],["legraise",3,8,12]],fin:["run",4,30,45]}]}
];
