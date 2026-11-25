# Changelog

## 3.10
- **Start-Animation 5 s** bei jedem App-Start: 0–1 s dunkel, die Lampe flackert an · 1–2 s das Licht breitet sich aus, Neon, Uhr, Tafel und Urkunde werden sichtbar, die Chromgriffe glänzen, der Boxsack pendelt · 2–3,5 s zwei Wiederholungen (Dip und Hochdrücken) · 3,5–4 s Gold-Blitz und Kreidestaub · 4–5 s goldener Schriftzug „HOMEGYM“ mit „by Joschy“ (tiefer im Bild) · dann die App. Die App lädt darunter, Tippen überspringt jederzeit, bei „Bewegung reduzieren“ nur kurz das stehende, helle Bild (ohne Flackern und Partikel).
- **Wand**: roter Neon-Schriftzug „NEVER GIVE UP“ mit Glow (flackert mit dem Licht an), Wanduhr mit der echten Uhrzeit (Sekundenzeiger läuft), Kreidetafel mit dem heutigen Training wie auf dem Startbildschirm (z. B. „Heute: Drücken · Bankdrücken · Block 1 von 4“, sonst „erledigt“ oder „Ruhetag“), gerahmte Urkunde „Hang-Rekord“ mit dem besten Hang-Test (ohne Test: „bald!“).
- **Hantelablage** wie Joschys echte (schwarz, A-förmige Seitenteile, 2 schräge Etagen) vorn links, fast frontal: je Etage 5 Paare nebeneinander mit Abstand, zusammen 10 Paare 2,5–25 kg, jede Hantel so groß wie ihr Gewicht. 22,5 und 25 kg gibt es nur in der Animation; in der App (Joschy Gym, Gewichtsvorschläge, max. 20 kg) ändert sich nichts.
- Hantelbank rechts vorn schräg vor dem Scheibenständer; vor der Ablage steht nichts mehr.
- t39 neu (5 s ± 0,3, Flackern 0–1 s und Aufleuchten 1–2 s, Elemente, Ablage, Uhrzeit, Tafel aus dem App-Zustand, Urkunde mit/ohne Rekord, Ladezeit), t37/t38 auf die neuen Zeiten, Versionsprüfungen auf „3.10“ (als Text, nicht 3.1).

## 3.9
- **Start-Animation im Gym-Raum** (ca. 1,5 s): schwarzer Gummiboden aus Platten, Betonwand mit Schalungsfugen, warmer Spot von oben mit sichtbarem Lichtkegel. In der Mitte das rote Rack mit Figur und Langhantel wie bisher; links die Hantelablage mit 2 Etagen und Joschys Kurzhanteln Gummi PRO (2,5–20 kg) und davor schräg die Hantelbank; rechts der Scheibenständer mit Bumper Plates (Farben wie in den Übungen) und dahinter der Boxsack; ganz hinten im Halbdunkel Laufband und Crosstrainer.
- Ablauf: dunkel → Spot flackert an (Chromgriffe glänzen, Boxsack pendelt) → Dip und Stange hoch → Scheiben blitzen golden, Kreidestaub im Licht, Schriftzug „HOMEGYM“ → App. Tippen überspringt, bei „Bewegung reduzieren“ nur kurz das stehende Bild (ohne Flackern und Partikel).
- Nur SVG/CSS, die Geräte zeichnen dieselben Funktionen wie die Übungs-Animationen; App und Icon unverändert.
- Neuer Test t39 (Raum, Dauer ≤ 1,7 s, Tippen, reduzierte Bewegung).

## 3.8
- **Kurzhanteln wie Joschys Set Gummi PRO**: runde schwarze Gummiköpfe, Chrom-Griff mit Rändel, Chrom-Ring und rot-schwarze Gewichtsplakette mit der Zahl. Jedes Gewicht von 2,5 bis 20 kg hat seine eigene Größe nach Herstellermaßen; die Animation zeigt das Gewicht des aktuellen Satzes (sonst zuletzt benutzt, sonst 10 kg).
- **Langhantel**: die beiden Olympia-Stangen (20 kg) in **Silber oder Gold** mit dicken Hülsen. Wahl unter Einstellungen › Langhantel: Silber, Gold oder **Abwechselnd pro Training** (Standard, innerhalb einer Einheit gleich).
- **Richtige Scheiben**: die Animationen zeigen genau die Scheiben aus dem Scheiben-Rechner (größte innen) in Bumper-Farben: 25 rot, 20 blau, 15 gelb, 10 grün, 5 weiß, kleinere schwarz; voller Durchmesser ab 10 kg. Die Farbe jeder Scheibe ist einstellbar. Ohne Gewicht: 60 kg.
- Kurzhanteln sitzen in allen Animationen in der Hand, bei 20 kg ganz im Bild und nicht im Boden (Renegade Rows leicht angepasst); vor dem Gesicht werden sie ausgespart.
- **Icon**: Scheiben, Rack-Ecken und Rack-Füße ganz in der Safe-Zone. **Start-Animation**: zweiter Stern früher, Funkeln kräftiger.
- Einstellungen kommen ins Backup (Format v5 bleibt), alte Stände und Backups werden einmalig ergänzt.
- Neuer Test t38, t36 prüft zusätzlich: nach nativer Ansage am Pausenende keine zweite Ansage in der App.

## 3.7
- **Neue Kurzhanteln**: Joschys Geräte („Joschy Gym“ und „Zubehör“) mit dem Set **Gummi PRO** (feste Paare 2,5 · 5 · 7,5 · 10 · 12,5 · 15 · 17,5 · 20 kg) und der Hantelablage; die verstellbaren Kurzhanteln sind raus.
- **Gewichtsvorschläge nur mit vorhandenen Paaren**: erst die Wiederholungen voll machen (bei großen Sprüngen 2 Extra-Wdh.), dann genau ein Paar weiter; 20 kg ist das Maximum, danach geht es über Wiederholungen, Tempo oder einen Satz mehr.
- **Einmalige Umstellung** gespeicherter Daten: Joschys Kurzhantel-Liste wird auf das neue Set gesetzt, offene Sätze springen aufs nächste Paar (im Zweifel leichter). Andere Presets bleiben unverändert, Backup-Format bleibt v5, alte Backups bleiben lesbar.
- **Neues App-Icon** (Power Rack, goldene Langhantel, Athlet) als Adaptive Icon mit Monochrom-Ebene für Android 13.
- **Start-Animation** (ca. 1 s: Kniebeuge, Glanzstreifen und Funkeln über den Goldscheiben; Tippen überspringt, bei „Bewegung reduzieren“ stark verkürzt) und ein kurzer **Gold-Glanz** im App-Kopf nach einem Training.
- **Fix Ansagen**: In der Pause kommt einmal „Als Nächstes“ + Name, beim Start jeder Übung der Name mit Sätzen und Gewicht; die doppelte Zusatz-Ansage „Nächste Übung“ entfällt, auch wenn die Pause im Hintergrund endet.
- Hauptübungen und Plan unverändert, jede Einheit ≤ 59 Minuten.

## 3.6
- **JAI sagt die Namen an**: bei Kraft, Aufwärmen, Hang-Block, Yoga und Dehnen nennt JAI zu Beginn jeder Übung bzw. Haltung den Namen.
- In der **Pause vor der nächsten Übung** kommt „Als Nächstes“ und danach der Name.
- 317 neue Namens-Clips (alle 259 Übungen und 154 Yoga-Haltungen sind jetzt abgedeckt), gleiche Stimme und gleicher Klang wie bisher.
- Die Ansagen laufen nacheinander und überlappen nicht; „Halbzeit“ wird nicht mehr abgeschnitten. Die Einstellung „Sprachassistent“ gilt auch hier, Backup-Format unverändert.

## 3.5
- **Extras: Kampfsport-Kostüme** (unter Einstellungen › Extras, mit Kennwort freischaltbar):
  - **19 frei gestaltete Kostüme** für Mann und Frau: Karate, Judo, BJJ, Taekwondo, Boxen, Muay Thai, Kickboxen, Ringen, MMA, Sambo, Kung-Fu, Capoeira, Kendo, Ninja, Samurai, Gladiator, Krav Maga, Fechten und Sumo. Generische Sportkleidung in sportüblichen Farben, ohne Marken, Logos oder Schriftzeichen.
  - Mit Kostüm wirkt die Figur **muskulöser** (breitere Schultern, kräftigere Arme und Beine). Kleidung, Gürtel, Handschuhe und Helme laufen in allen Kraft-, Yoga- und Hang-Animationen mit.
  - Getrennte Wahl für **Mann und Frau**: „Kein Kostüm“, ein festes Kostüm oder **„Zufällig pro Training“** (bleibt bis zum Ende der Einheit gleich), mit animierter Vorschau.
  - Die Freischaltung bleibt gespeichert und ist im **Backup** enthalten (Format unverändert, ältere Backups bleiben lesbar).
- Ohne Kostüm sieht die Figur **genau so aus wie in 3.4**.

## 3.4
- **58 neue Yoga-Haltungen** (jetzt 154):
  - **Rotation nur beim Wiederholen einer Woche**: der erste Durchgang bleibt wie bisher, ab dem zweiten werden bis zu 2 Haltungen im Hauptteil und das Ankommen durch Haltungen derselben Zielregion ersetzt (höchstens die Stufe der Woche).
  - **Schnell-Dehnen und Dehnen nach dem Training** wechseln **wöchentlich** zwischen der bisherigen und einer neuen Variante.
  - Knopf **„Andere Haltung“** im laufenden Ablauf tauscht die aktuelle Haltung gegen eine passende Alternative.
- **100 neue Kraftübungen** (jetzt 259):
  - Im Plan nur auf **Nebenplätzen in jedem zweiten Zyklus**; die **Hauptübungen bleiben unverändert**, jede Einheit bleibt bei **≤ 59 Minuten**.
  - **„Tauschen“** bietet auch die neuen Übungen an.
  - Die neuen Übungen kürzen nie eine Hauptübung: Wird eine Einheit zu lang, werden zuerst Neben- und Bonussätze gekürzt, danach kommt eine kürzere neue Übung (oder die gewohnte) auf den Nebenplatz.
- **Übungsblatt** mit den Abschnitten **Atmung**, **Leichter** und **Achtung**.
- **Geräte-Fixes**: Brustdrücken mit Band, Pallof Press, Face Pulls, Überzüge am Band, Kickbacks mit Band, Band Pull-Through, Holzhacker mit Band und Trizepsdrücken am Band brauchen Band **und Rack** (bei „Nur Kurzhanteln“ nicht mehr im Plan); Zercher-Kniebeuge, Gorilla-Rudern (zwei Kettlebells vom Boden) und Toes to Bar korrekt animiert.
- **Katze-Kuh**: Beschriftung korrigiert. **Layout-Fix** bei 130 % Schriftgröße.

## 3.3
- **Griffkraft & Hängen** (neu, Ziel: 1–2 Minuten frei hängen):
  - Am **Zieh-Tag** ein eigener Block nach den Hauptübungen in **4 Stufen**: Hängen mit Fußstütze → aktives Schulterblatt-Hängen → freies Hängen → Handtuch-Hang. Die Zeit steigt automatisch um 5 s, oben in der Stufe geht es eine Stufe weiter; zweimal verfehlt gibt es 5 s weniger.
  - Am **Beintag** **Farmer's Hold** auf Zeit, passend zu den Geräten (Kurzhanteln, Kettlebells oder Taschen/Kanister).
  - **Hang-Test alle 4 Wochen** (1 Versuch) mit Kurve im Verlauf und Ziellinien 1 und 2 Minuten; freiwillige **Hang-Pause** (3 × 10 s) an freien Tagen.
  - **Sicherheits-Hinweise** für Schulter, Ellbogen und Handgelenk. Hauptübungen bleiben unverändert, jede Einheit bleibt bei max. 60 Minuten.
- **Anzeige-Fixes**:
  - Figuren werden nicht mehr am Bildrand oder unter Beschriftungen abgeschnitten; kein Überlauf bei 360 px Breite oder großer Schrift, lange Blätter scrollen statt die Animation zu quetschen.
  - Halte-Übungen zeigen auf der Bühne „Halten · Zeit“ statt Tempo, beim Hängen gibt es kein Feld „Zusatz kg“, Übungen mit Körpergewicht ohne „Gewicht wählen“-Hinweis.
  - Hang-Pause nur an freien Tagen (Ruhetag nach einem Training oder Wochenziel erreicht), nicht an Plan-Tagen; das Backup nennt Hang-Tests und Hang-Pausen nur, wenn vorhanden.

## 3.2
- **Mehr Yoga in drei Stufen**:
  - Yoga wächst von **56 auf 96 Haltungen**, neu eingeteilt in die Stufen **Anfänger**, **Fortgeschritten** und **Profi**.
  - **24-Wochen-Plan** mit **einer Einheit pro Woche** (je Stufe 8 Wochen); die nächste Stufe wird frei, wenn die vorherige geschafft ist.
  - **Startstufe wählbar**: Anfänger ist voreingestellt, Fortgeschritten direkt wählbar, Profi erst nach einer **Sicherheitsabfrage**.
  - Profi-Haltungen (Umkehrhaltungen, Armbalancen, tiefe Rückbeugen) zeigen **Sicherheits-Hinweise** und bieten eine **„Leichtere Variante“**, die die Haltung für diese Einheit austauscht.
  - Der bisherige **Yoga-Fortschritt wird übernommen**, auch aus Backups der Version 3.1.
- **Mehr Übungen ohne Geräte**:
  - **41 neue Körpergewichtsübungen** für Drücken, Ziehen sowie Beine und Rumpf, teils mit Alltagsgegenständen (Wand, Stuhl, Tisch, Handtuch, Rucksack, Wasserflaschen).
  - Jede neue Übung hat eine **Stufe** (leicht / mittel / schwer); ist das obere Wiederholungsziel in allen Sätzen geschafft, schlägt die Steigerung die **nächst schwerere Variante** vor.
  - Das Preset **„Ohne Geräte“** verteilt die Übungen über die **12 Einheiten** des Plans abwechslungsreich, schwere Varianten gibt es über „Tauschen“ und die Steigerung.
- **Pläne mit Geräten bleiben unverändert.**

## 3.1
- **Figuren überarbeitet**:
  - **Frau**: Kinnschatten entfernt (wirkte wie ein Bart), weiblicheres Gesicht, der Pferdeschwanz fällt natürlich, mehr Brust und Hüfte bei schmalerer Taille.
  - **Mann**: athletischer mit breiteren Schultern, kräftigeren Armen und Oberschenkeln und Muskelzeichnung.
  - Bewegungen und Griffpunkte bleiben unverändert.

## 3.0
- **Plan nach erledigten Einheiten** statt nach Kalenderwochen: Der 4-Wochen-Plan läuft Einheit für Einheit weiter (A → B → C, je drei Einheiten ein Block), es fällt keine Einheit mehr aus, wenn eine Woche ausfällt. Der bisherige Stand wird beim Update automatisch übernommen, ein laufendes Training bleibt erhalten. Nach mehr als **14 Tagen Pause** gibt es einen leichteren Wiedereinstieg.
- **Klügere Steigerung**: Nach dem letzten Satz einer Übung fragt die App kurz „leicht / passend / hart“. Daraus und aus den geschafften Wiederholungen entstehen die Vorschläge für das nächste Mal, jeweils **mit Begründung** (z. B. +5 kg nach „leicht“, +2,5 kg nach „passend“, Gewicht halten nach „hart“, bei wiederholt verfehltem Ziel eine leichte Reduktion). Halte-Übungen steigern in Sekunden, Gewichtslisten in den vorhandenen Stufen.
- **Plateau-Vorschlag**: Nach **3 Einheiten ohne Fortschritt** bei einer Übung schlägt eine Karte vor: Gewicht −10 %, neues Wiederholungsziel, eine Variante – oder „Später“.
- **Aufwärmsätze** vor der ersten Hauptübung (z. B. 25 / 35 / 47,5 kg bei 60 kg Arbeitsgewicht) mit **Scheibenanzeige pro Seite** und kurzer Pause; das allgemeine Aufwärmen wird dafür kürzer. Aufwärmsätze zählen nicht in Volumen oder Bestwerte und lassen sich in den Einstellungen abschalten.
- **Auswertung mit fünf Bereichen** im Verlauf:
  - **Kraft**: geschätzte Maximalkraft (1RM, Epley) je Übung mit Kurve, Bestwert, letztem Wert und Veränderung über 4 Wochen.
  - **Muskeln**: Sätze pro Muskelgruppe je Woche im Vergleich zum **Plan-Soll**.
  - **Kalender** mit Trainingstagen, Yoga und **Serien** (Wochen in Folge mit mindestens zwei Trainings).
  - **Körpermaße**: Gewicht und Umfänge (Brust, Arm, Taille, Bein) erfassen und verfolgen.
  - **Monatsbericht**: Trainings, Zeit, Volumen, Bestleistungen, Muskelgruppen, Kraft- und Körperentwicklung im Vergleich zum Vormonat.
- **Alles im Backup**: Plan-Stand, Anstrengungs-Angaben, Plateau-Entscheidungen, Aufwärmsätze und Körpermaße werden mitgesichert; **alte Backups** (auch aus 2.x) lassen sich weiterhin einspielen.

## 2.3
- **Acht Designs zur Auswahl**: Arc Blau, Iron Man, Toxic, Cyber, Sunset, Eis, Stealth und Tag – jedes mit eigener Farbwelt, eigenem Hintergrund-Effekt, eigener Rahmenform und Schrift. Die Figuren in den Animationen übernehmen die Akzentfarbe des Designs.
- Auswahl in den **Einstellungen** als Kachelauswahl mit Live-Vorschau; das gewählte Design wird gespeichert und ist im **Backup** enthalten.
- **Status- und Navigationsleiste** passen sich dem Design an (beim hellen Design „Tag“ mit dunklen Symbolen).
- Hintergrund-Effekte **pausieren im Training** und bei der System-Einstellung **„Bewegung reduzieren“**.

## 2.2
- **Menschlichere Bewegungen**: weiches Tempo (1 s hoch, 2 s runter) mit sanften Umkehrpunkten, sichtbare Atmung, Gewichtsverlagerung, natürlichere Wirbelsäule, Schultern und Knie; Hände mit Fingern, Füße rollen ab.
- **Yoga als ganzer Weg**: jede Haltung läuft als Schleife Stehen → in die Pose → halten → zurück → Stehen.
- Neue Einstellung **Animationstempo**.
- Fixes: Drehsitz, Liegestütz-Stopp, Katze-Kuh, Scheibe beim Schulterdrücken.

## 2.1
- **Halte-Übungen** (17, z. B. Hochstütz halten, Hollow Hold, Klimmzüge mit Halt oben) mit eigenen Animationen; jede Einheit endet mit einem **Bonus-Finisher** als Halte-Übung, alle 12 Einheiten bleiben inkl. Bonus unter 60 Minuten. „Tauschen“ bietet passende Halte-Varianten an.
- **Geräte-Editor** in den Einstellungen: Geräte an- und abwählen, **Gewichtslisten** je Gerät (Kurzhanteln, Kettlebells, Bänder); Gewichtsvorschläge nutzen nur vorhandene Gewichte. **Kettlebell-Rotation**: „In den Plan einmischen“ oder „Nur als Ersatz“.
- **Backup / Wiederherstellen** als Datei (homegym-backup.json), auch direkt beim ersten Start im Onboarding. Fremde Dateien und Backups aus neueren Versionen werden mit Hinweis abgelehnt, ältere Backups (v4) bleiben lesbar.
- **Yoga & Dehnen** als Zusatzbereich: 56 Haltungen mit Animation, Atem-Hinweisen und Seitenwechsel, **12-Wochen-Plan** in 3 Stufen, **Schnell-Dehnen** und Dehnen nach dem Training; Bibliothek mit Filter nach Stufe und Körperregion. Yoga zählt nicht in Verlauf, Wochenziel oder Erholung des Kraftplans.
- Fixes: Gerät während eines laufenden Trainings abgewählt → offene Übungen werden ersetzt, erledigte Sätze bleiben; Backup mit defektem laufendem Training wird ohne Fehler eingelesen; unterbrochene Yoga-Einheit wird pausiert an derselben Haltung fortgesetzt.

## 2.0
- Pausen-Timer läuft sichtbar weiter, wenn die App verlassen wird: Benachrichtigung mit Live-Countdown und „+15 s“, Vibration und JAI-Ansage am Pausenende im Hintergrund.
- Bild-in-Bild: Beim Verlassen während des Trainings schrumpft die App zu einem Mini-Fenster mit Timer.
- Android-Hülle neu in Java (Foreground Service, Notification-Channel, PiP).

## 1.9
- Sprachassistent **JAI**: eigene, mit ElevenLabs entworfene Stimme mit leichtem Roboter-Effekt, 276 vorab aufgenommene Ansagen, offline.
- Einstellung: JAI · Handy-Stimme · Aus.

## 1.8
- Neue Bewegungs-Engine: Keyframes, realistisches Timing, feste Füße/Hände, Stange über der Fußmitte, Gleichgewicht, Wirbelsäule und Schulterblätter.

## 1.7
- 25 Geräte (gruppiert), 94 Übungen. Figuren neu gezeichnet: durchgehende Silhouette, Hände am Griff, detaillierte Geräte.

## 1.6
- Geräteauswahl im Onboarding und in den Einstellungen; Trainings passen sich an die vorhandene Ausstattung an. Preset „Joschys Homegym“.

## 1.5
- Namensabfrage beim ersten Start, persönliche Begrüßung, „Alle Daten löschen“.

## 1.4
- 4-Wochen-Zyklus mit 12 Einheiten als Push/Pull/Beine-Split, Monatsplan, Zykluswoche in den Einstellungen.

## 1.3
- 51 Übungen, automatische Rotation, Tauschen, Bonus-Finisher, Bibliothek nach Muskelgruppen.

## 1.2
- Realistische Figuren, ruhigeres Design, Sprachansagen, Kurztraining, Eiweiß-Zähler, Körpergewicht, Bestleistungen, Entlastungswoche.

## 1.1
- HUD-Design und Hologramm-Figuren (Mann/Frau).

## 1.0
- Erste Version: 3 Ganzkörper-Trainings, animierte Übungen, Pausen-Timer, Scheiben-Rechner, Verlauf, Tipps.
