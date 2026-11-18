Testdaten für tests/t29.py (Homegym @ Joschy)

v30/index.html  eingefrorener Stand der Version 3.0, byte-gleich zu assets/index.html aus
                releases/Homegym-3.0.apk. t29 vergleicht die aktuelle Figur (out/index.html)
                mit diesem Stand: Gelenke und Griffpunkte müssen identisch bleiben, nur
                Körperform und Gesicht dürfen sich ändern.

Neu erzeugen:   unzip -p releases/Homegym-3.0.apk assets/index.html > tests/fixtures/v30/index.html
Anderer Ordner: Umgebungsvariable HOMEGYM_V30=<ordner mit index.html>

Testdaten für tests/t30.py

v31/index.html  eingefrorener Stand der Version 3.1, byte-gleich zu android/assets/index.html aus
                Commit 7f0aa3d (= assets/index.html aus releases/Homegym-3.1.apk). t30 spielt damit
                ein 3.1-Backup ein und prüft die Übernahme des Yoga-Fortschritts nach 3.2.

Neu erzeugen:   git show 7f0aa3d:android/assets/index.html > tests/fixtures/v31/index.html
Anderer Ordner: Umgebungsvariable HOMEGYM_V31=<ordner mit index.html>

Testdaten für tests/t32.py

v32/index.html  eingefrorener Stand der Version 3.2, byte-gleich zu android/assets/index.html aus
                Commit 7a3ce77 (= assets/index.html aus releases/Homegym-3.2.apk). t32 prüft damit, dass
                das Hang-/Griffkraft-Programm nur einen Block ergänzt: gleiche Übungen und Wiederholungsziele,
                Hauptübungen mit gleichen Sätzen. Den 3.1-Stand (v31) nutzt t32 für Migration und Backup.

Neu erzeugen:   git show 7a3ce77:android/assets/index.html > tests/fixtures/v32/index.html
Anderer Ordner: Umgebungsvariable HOMEGYM_V32=<ordner mit index.html>
