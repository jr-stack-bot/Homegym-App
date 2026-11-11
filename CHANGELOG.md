# Changelog

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
