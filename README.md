# Homegym

Android-App für Krafttraining zu Hause: geführte Trainings mit animierten Übungen, Pausen-Timer, Fortschritt und dem Sprachassistenten **JAI**.

## Was die App kann
- **4-Wochen-Zyklus** mit 12 verschiedenen Einheiten als Push/Pull/Beine-Split (A Drücken · B Ziehen · C Beine), jede Muskelgruppe mit einer Woche Erholung. Komplett- oder Kurzversion, max. 60 Minuten inkl. Aufwärmen.
- **94 animierte Übungen** mit Technik-Hinweisen; Figuren abwechselnd Mann/Frau mit realistischen Bewegungsabläufen.
- **Ausstattung wählbar** (25 Geräte, Presets inkl. „Joschys Homegym“): Trainings passen sich automatisch an; „Tauschen“ bietet nur machbare Übungen derselben Muskelfunktion.
- **Pausen-Timer** mit Benachrichtigung und Bild-in-Bild-Mini-Fenster, auch wenn die App im Hintergrund ist.
- **JAI-Sprachassistent**: sagt Übungen, Sätze, Gewichte, Countdown und Bestwerte an (offline).
- Automatische Steigerung, Scheiben-Rechner, Verlauf mit Bestleistungen und Körpergewicht, Eiweiß-Zähler, Entlastungswoche, Datensicherung.
- Onboarding mit Name, Gewicht, Trainingstagen und Geräten.

## Installation
APK aus den [Releases](../../releases) herunterladen, auf dem Handy öffnen und „Installation aus unbekannten Quellen“ erlauben. Updates einfach drüber installieren, die Daten bleiben erhalten. Beim ersten Training die Benachrichtigungen zulassen. Bei aggressiven Akkusparmodi: Apps → Homegym → Akku → „Nicht eingeschränkt“.

## Projektstruktur
| Ordner | Inhalt |
|---|---|
| `src/` | `app.html` (gesamte Web-App: UI, Logik, Renderer, Bewegungs-Engine) und `program.js` (4-Wochen-Plan, wird beim Build über `/*PROGRAM*/` eingesetzt) |
| `java/` | Android-Hülle: `MainActivity` (WebView, Bild-in-Bild), `Bridge` (JS-Schnittstelle), `TimerService` (Foreground Service für den Pausen-Timer) |
| `android/` | apktool-Projekt: Manifest, Ressourcen, `assets/index.html`, `assets/jai/*.mp3`, kompilierte `classes.dex` |
| `tools/` | `build_html.py`, `build.sh` (kompletter Build) |
| `jai/` | Ansage-Liste (`manifest.json`), Schnitt-Skripte, Effekt-Kette, Prüftabelle der Clips |
| `tests/` | Playwright-Tests (Pläne/Geräte, UI, JAI, Hintergrund-Timer) |
| `docs/` | Prüfberichte |

## Build
Voraussetzungen: JDK, python3, npm. Die Werkzeuge (apktool 2.9.3, uber-apk-signer 1.3.0, dex2jar 2.4, android.jar API 34) nach `tools/.cache/` legen oder per Umgebungsvariable angeben, Details im Kopf von `tools/build.sh`.

```bash
tools/build.sh fonts   # Schriften per npm holen (einmalig)
tools/build.sh         # -> out/index.html und dist/Homegym.apk
```

Die Java-Klassen werden mit `--release 8` kompiliert (keine Lambdas), damit `dx` sie für minSdk 24 übersetzen kann.

## Tests
Benötigt Python-Playwright mit Chromium. Nach dem Build:

```bash
python3 tests/t17g.py    # Pläne, Geräte-Anpassung, Muskeltrennung
python3 tests/t17ui.py   # UI-Ablauf
python3 tests/t19.py     # JAI-Ansagen (lädt out/ über einen lokalen HTTP-Server)
python3 tests/t20.py     # Hintergrund-Timer/Bild-in-Bild mit nachgebildeter Android-Bridge
```

Screenshots landen in `/tmp/homegym-shots/` (änderbar über `HOMEGYM_SHOTS`).

## JAI-Stimme
JAI („Joschy's AI“) ist eine eigene, mit ElevenLabs entworfene Stimme (keine Nachbildung einer realen Person). Die 276 Ansagen wurden einmalig erzeugt, mit `jai/split.py` geschnitten, mit der Effekt-Kette „leicht“ aus `jai/fx.md` bearbeitet und liegen fertig in `android/assets/jai/`. Die App setzt sie zur Laufzeit zusammen, etwa Zahl + „Komma fünf“ + „Kilo“.

## Versionen
Siehe [CHANGELOG.md](CHANGELOG.md). Aktuell: **2.0**.
