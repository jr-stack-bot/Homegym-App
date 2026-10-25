# Prüfung aller JAI-Clips
Modell: Sprechzeit ≈ 0.272 + 0.136·Silben (gesprochene Form, „SZ“ = „Es Zett“). Grenzen 0,6–1,6×. Bereich: 0.64–1.43.
ASR: Whisper small (offline) zur Inhaltskontrolle; alle Clips inhaltlich korrekt (Abweichungen nur ASR-Schreibweisen wie „Facebooks“ für Face Pulls).
Korrigiert (batch_05 neu geschnitten): last_set, pr, inc_weight, same_weight, session_done.

| id | Silben | Dauer s | Sprechzeit s | erwartet s | Verhältnis | ASR |
|---|---|---|---|---|---|---|
| bar_only | 4 | 0.76 | 0.68 | 0.82 | 0.83 | Nur die Stange. |
| breathe | 13 | 3.22 | 2.32 | 2.05 | 1.13 | Ausatmen beim Drücken.  Einatmen beim Ablassen. |
| cd_1 | 1 | 0.41 | 0.35 | 0.41 | 0.86 | Eins. |
| cd_2 | 1 | 0.38 | 0.32 | 0.41 | 0.78 | 2 |
| cd_3 | 1 | 0.37 | 0.31 | 0.41 | 0.76 | 3 |
| clean_reps | 16 | 3.05 | 2.58 | 2.46 | 1.05 | Die letzten Wiederholungen dürfen schwer sein, aber sauber. |
| deload | 7 | 1.31 | 1.23 | 1.23 | 1.0 | Entlastungswoche aktiv. |
| done_hold | 2 | 0.52 | 0.42 | 0.54 | 0.77 | geschafft. |
| ex_airsquatx | 7 | 1.35 | 1.24 | 1.23 | 1.01 | Kniebeugen ohne Gewicht |
| ex_arnold | 3 | 0.81 | 0.72 | 0.68 | 1.06 | Arnold Press. |
| ex_ballcrunch | 5 | 0.99 | 0.91 | 0.95 | 0.95 | Crunch ist auf dem Ball. |
| ex_ballcurl | 5 | 1.22 | 1.13 | 0.95 | 1.18 | Bein curls auf dem Ball. |
| ex_bandcurl | 2 | 0.8 | 0.72 | 0.54 | 1.32 | und Curls. |
| ex_bandpress | 5 | 0.86 | 0.75 | 0.95 | 0.79 | dann Schulter drücken |
| ex_bandrow | 3 | 0.66 | 0.6 | 0.68 | 0.88 | Bandrudeln. |
| ex_bbcurl | 4 | 1.07 | 1.02 | 0.82 | 1.25 | Langhandel Curls |
| ex_bench | 3 | 0.62 | 0.5 | 0.68 | 0.73 | Bank drücken |
| ex_bikeint | 7 | 1.15 | 1.08 | 1.23 | 0.88 | Heimtrainer-Intervalle |
| ex_birddog | 2 | 0.65 | 0.51 | 0.54 | 0.94 | BurtDoc. |
| ex_boxing | 4 | 0.85 | 0.75 | 0.82 | 0.92 | Boxergrunden |
| ex_boxjump | 2 | 0.79 | 0.66 | 0.54 | 1.21 | Boxjumps. |
| ex_boxstep | 3 | 0.97 | 0.74 | 0.68 | 1.09 | Box Step Ups |
| ex_bss | 7 | 1.45 | 1.31 | 1.23 | 1.07 | vulgarische Splitsquads |
| ex_cableface | 6 | 1.15 | 1.03 | 1.09 | 0.94 | Facebooks am Kabel. |
| ex_cablefly | 6 | 0.99 | 0.93 | 1.09 | 0.85 | Fliegende am Kabel. |
| ex_cablepush | 7 | 1.38 | 1.19 | 1.23 | 0.97 | Triceps drücken am Kabel. |
| ex_cablerow | 5 | 1.0 | 0.94 | 0.95 | 0.99 | Rudern am Kabel. |
| ex_calf | 4 | 0.72 | 0.67 | 0.82 | 0.82 | Wadenheben. |
| ex_calfbw | 8 | 1.36 | 1.25 | 1.36 | 0.92 | Waden heben ohne Gewicht. |
| ex_chairdip | 3 | 0.81 | 0.71 | 0.68 | 1.04 | Dipps am Stuhl. |
| ex_chestrow | 6 | 1.24 | 1.06 | 1.09 | 0.97 | Brustgestütztes Rudern |
| ex_chinup | 6 | 1.2 | 1.09 | 1.09 | 1.0 | Chin-Ups im Untergriff |
| ex_climber | 5 | 0.97 | 0.91 | 0.95 | 0.95 | Mountain Climbers |
| ex_closegrip | 5 | 1.02 | 0.86 | 0.95 | 0.9 | Enges Bank drücken |
| ex_crunch | 2 | 0.66 | 0.61 | 0.54 | 1.12 | Crunches |
| ex_curl | 3 | 1.0 | 0.92 | 0.68 | 1.35 | BeatsApps Curls |
| ex_dbbench | 6 | 1.16 | 1.06 | 1.09 | 0.97 | Kurz Handelbank drücken. |
| ex_dbrow | 9 | 1.67 | 1.58 | 1.5 | 1.05 | Einarmiges Kurzhandel rudern. |
| ex_deadbug | 3 | 0.58 | 0.44 | 0.68 | 0.65 | That's Buck. |
| ex_deadlift | 3 | 0.62 | 0.57 | 0.68 | 0.84 | Kreuzheben. |
| ex_diamondpush | 6 | 0.97 | 0.88 | 1.09 | 0.81 | Enge Liegestütze. |
| ex_dips | 4 | 0.8 | 0.68 | 0.82 | 0.83 | Dipps am Barren. |
| ex_doorrow | 6 | 1.16 | 1.09 | 1.09 | 1.0 | Rudern am Türrahmen. |
| ex_ezcurl | 3 | 1.03 | 0.84 | 0.68 | 1.23 | SZ-Curls |
| ex_ezskull | 9 | 1.86 | 1.56 | 1.5 | 1.04 | SZ-Trizepsstrecken im Liegen. |
| ex_facepull | 3 | 0.77 | 0.68 | 0.68 | 1.0 | Facebooks. |
| ex_farmer | 3 | 0.81 | 0.69 | 0.68 | 1.01 | Farmers Walk |
| ex_feetpush | 10 | 1.58 | 1.45 | 1.64 | 0.89 | Liegestütze mit erhöhten Füßen. |
| ex_frontraise | 3 | 0.6 | 0.54 | 0.68 | 0.79 | Frontheben. |
| ex_frontsquat | 4 | 1.01 | 0.92 | 0.82 | 1.12 | Frontkniebeuge |
| ex_glutebridge | 4 | 0.73 | 0.56 | 0.82 | 0.68 | Glut-Bridge |
| ex_goblet | 4 | 0.73 | 0.6 | 0.82 | 0.73 | Goblet Squad |
| ex_goodmorning | 4 | 0.63 | 0.57 | 0.82 | 0.7 | Good morning. |
| ex_hammer | 3 | 0.79 | 0.73 | 0.68 | 1.07 | Hammer-Curls |
| ex_hipthrust | 2 | 0.69 | 0.58 | 0.54 | 1.06 | Hip thrust. |
| ex_incline | 4 | 0.84 | 0.71 | 0.82 | 0.87 | Schrägbank drücken. |
| ex_invrow | 4 | 0.74 | 0.64 | 0.82 | 0.78 | Bruder im Rack |
| ex_jumpjack | 3 | 0.63 | 0.57 | 0.68 | 0.84 | Ampelmann. |
| ex_jumprope | 3 | 0.78 | 0.69 | 0.68 | 1.01 | Seilspringen |
| ex_kbgoblet | 7 | 1.27 | 1.12 | 1.23 | 0.91 | Kettlebell Goblet Squad |
| ex_kbpress | 7 | 1.21 | 1.1 | 1.23 | 0.9 | Kettlebell Schulter drücken. |
| ex_kbrow | 5 | 1.06 | 0.99 | 0.95 | 1.04 | Kettlebell rudern |
| ex_kbswing | 4 | 0.94 | 0.86 | 0.82 | 1.05 | Kettlebell Swing |
| ex_kneeraise | 6 | 1.08 | 0.98 | 1.09 | 0.9 | Hängen des Knieheben. |
| ex_lateral | 3 | 0.7 | 0.65 | 0.68 | 0.95 | Seid heben. |
| ex_latpull | 6 | 1.17 | 1.08 | 1.09 | 0.99 | Latzin am Kabel. |
| ex_legcurl | 2 | 0.63 | 0.57 | 0.54 | 1.05 | Bein-Curl. |
| ex_legext | 3 | 0.73 | 0.62 | 0.68 | 0.91 | Beinstrecker |
| ex_legraise | 6 | 1.06 | 0.96 | 1.09 | 0.88 | Hängen das Bein heben. |
| ex_lunge | 4 | 0.86 | 0.81 | 0.82 | 0.99 | Ausfallschritte |
| ex_lungebwx | 8 | 1.52 | 1.35 | 1.36 | 0.99 | Ausfallschritte ohne Gewicht |
| ex_mbslam | 5 | 1.13 | 1.08 | 0.95 | 1.13 | Medizin-Ball-Slamms |
| ex_negpull | 7 | 1.1 | 1.04 | 1.23 | 0.85 | Negative Klimtzüge. |
| ex_ohext | 5 | 1.03 | 0.88 | 0.95 | 0.92 | Triceps über Kopf. |
| ex_ohp | 6 | 1.09 | 0.99 | 1.09 | 0.91 | Schulterdrücken stehend. |
| ex_ohpdb | 10 | 1.69 | 1.6 | 1.64 | 0.98 | Kurzhandelschulter drücken im Sitzen. |
| ex_pausesquat | 5 | 1.11 | 1.01 | 0.95 | 1.06 | Pausenkniebeuge |
| ex_pikepush | 6 | 0.91 | 0.8 | 1.09 | 0.73 | Pike-Liegestütze. |
| ex_plank | 4 | 0.91 | 0.82 | 0.82 | 1.0 | Unterarmstütz |
| ex_pullup | 3 | 0.72 | 0.66 | 0.68 | 0.97 | Klimtzüge |
| ex_pushdown | 6 | 1.28 | 1.14 | 1.09 | 1.05 | Triceps drücken am Band. |
| ex_pushup | 4 | 0.76 | 0.67 | 0.82 | 0.82 | Liegestütze. |
| ex_rdl | 7 | 1.32 | 1.23 | 1.23 | 1.0 | Rumänisches Kreuzheben. |
| ex_rdlbb | 11 | 1.97 | 1.88 | 1.77 | 1.06 | Rumänisches Kreuzheben mit Langhandel. |
| ex_revlunge | 6 | 1.3 | 1.13 | 1.09 | 1.04 | Ausfallschritte rückwärts. |
| ex_ringpush | 5 | 0.94 | 0.84 | 0.95 | 0.88 | Ring-Liegestütze |
| ex_ringrow | 3 | 0.77 | 0.72 | 0.68 | 1.06 | Ringrudern |
| ex_rollout | 3 | 0.73 | 0.67 | 0.68 | 0.98 | Bauchroller |
| ex_row | 5 | 1.01 | 0.92 | 0.95 | 0.96 | Langhandel rudern. |
| ex_rowint | 8 | 1.18 | 1.08 | 1.36 | 0.79 | Rudergerätintervalle |
| ex_run | 6 | 0.99 | 0.88 | 1.09 | 0.81 | Laufbandinterwalle |
| ex_russtwist | 4 | 0.94 | 0.82 | 0.82 | 1.0 | Russian Twists |
| ex_skull | 7 | 1.35 | 1.13 | 1.23 | 0.92 | Liegendes Trizepsstrecken. |
| ex_snowangel | 6 | 1.41 | 1.28 | 1.09 | 1.17 | Reverse Snow Angels |
| ex_squat | 3 | 0.69 | 0.64 | 0.68 | 0.94 | Kniebeuge |
| ex_stepup | 5 | 1.08 | 0.96 | 0.95 | 1.01 | Step-ups auf die Bank. |
| ex_superman | 3 | 0.62 | 0.55 | 0.68 | 0.81 | Superman. |
| ex_towelcurl | 3 | 1.01 | 0.89 | 0.68 | 1.31 | Hantuch Curls |
| ex_towelrow | 4 | 0.9 | 0.82 | 0.82 | 1.0 | Rudern am Tisch. |
| ex_trxcurl | 5 | 1.14 | 1.07 | 0.95 | 1.12 | Schlingentrainer Curls. |
| ex_wallsit | 3 | 0.67 | 0.6 | 0.68 | 0.88 | Wann sitzen? |
| ex_widepush | 6 | 1.11 | 0.99 | 1.09 | 0.91 | Breite Liegestütze |
| excellent | 4 | 0.83 | 0.73 | 0.82 | 0.89 | ausgezeichnet |
| finisher | 15 | 3.6 | 2.54 | 2.32 | 1.1 | Bonus-Finisher. Optional, aber empfehlenswert. |
| go | 2 | 0.63 | 0.54 | 0.54 | 0.99 | Los geht's! |
| goal_protein | 5 | 1.41 | 1.24 | 0.95 | 1.3 | Eiweißziel erreicht. |
| good | 2 | 0.61 | 0.51 | 0.54 | 0.94 | Sehr gut! |
| greet_evening | 14 | 2.31 | 2.04 | 2.18 | 0.93 | Guten Abend Joshi, alle Systeme sind bereit. |
| greet_evening_neutral | 12 | 2.48 | 1.73 | 1.91 | 0.91 | Guten Abend. Alle Systeme sind bereit. |
| greet_morning | 14 | 2.69 | 1.96 | 2.18 | 0.9 | Guten Morgen Joshi. Alle Systeme sind bereit. |
| greet_morning_neutral | 12 | 2.31 | 1.59 | 1.91 | 0.83 | Guten Morgen. Alle Systeme sind bereit. |
| greet_noon | 13 | 2.27 | 1.88 | 2.05 | 0.92 | Guten Tag Joshi, alle Systeme sind bereit. |
| greet_noon_neutral | 11 | 2.07 | 1.56 | 1.77 | 0.88 | Guten Tag, alle Systeme sind bereit. |
| halfway | 4 | 1.01 | 0.89 | 0.82 | 1.09 | Halbzeit erreicht. |
| hold | 2 | 0.5 | 0.35 | 0.54 | 0.64 | halten |
| inc_weight | 8 | 1.32 | 1.21 | 1.36 | 0.89 | Gewicht erhöhen empfohlen |
| last_ex | 4 | 0.79 | 0.71 | 0.82 | 0.87 | Letzte Übung. |
| last_set | 10 | 3.08 | 1.78 | 1.64 | 1.09 | Letzter Satz.  Volle Konzentration. |
| next_ex | 4 | 0.77 | 0.7 | 0.82 | 0.86 | Nächste Übung. |
| next_set | 3 | 0.79 | 0.68 | 0.68 | 1.0 | Nächster Satz. |
| num_001 | 1 | 0.46 | 0.41 | 0.41 | 1.0 | Eins. |
| num_002 | 1 | 0.45 | 0.4 | 0.41 | 0.98 | 2 |
| num_003 | 1 | 0.41 | 0.35 | 0.41 | 0.86 | 3 |
| num_004 | 1 | 0.41 | 0.37 | 0.41 | 0.91 | 4. |
| num_005 | 1 | 0.41 | 0.36 | 0.41 | 0.88 | 5 |
| num_006 | 1 | 0.49 | 0.38 | 0.41 | 0.93 | 6 |
| num_007 | 2 | 0.5 | 0.44 | 0.54 | 0.81 | 7 |
| num_008 | 1 | 0.43 | 0.35 | 0.41 | 0.86 | 8. |
| num_009 | 1 | 0.5 | 0.45 | 0.41 | 1.1 | 9. |
| num_010 | 1 | 0.47 | 0.42 | 0.41 | 1.03 | Sehen. |
| num_011 | 1 | 0.43 | 0.37 | 0.41 | 0.91 | Elf |
| num_012 | 1 | 0.54 | 0.48 | 0.41 | 1.18 | 12. |
| num_013 | 2 | 0.65 | 0.58 | 0.54 | 1.06 | 13 |
| num_014 | 2 | 0.65 | 0.58 | 0.54 | 1.06 | 14 |
| num_015 | 2 | 0.66 | 0.59 | 0.54 | 1.08 | 15. |
| num_016 | 2 | 0.72 | 0.62 | 0.54 | 1.14 | 16 |
| num_017 | 2 | 0.68 | 0.58 | 0.54 | 1.06 | 17. |
| num_018 | 2 | 0.64 | 0.59 | 0.54 | 1.08 | 18. |
| num_019 | 2 | 0.64 | 0.59 | 0.54 | 1.08 | 19. |
| num_020 | 2 | 0.66 | 0.61 | 0.54 | 1.12 | 20 |
| num_021 | 4 | 0.88 | 0.82 | 0.82 | 1.0 | 21 |
| num_022 | 4 | 1.05 | 0.99 | 0.82 | 1.21 | 22 |
| num_023 | 4 | 1.02 | 0.96 | 0.82 | 1.17 | 23. |
| num_024 | 4 | 1.03 | 0.96 | 0.82 | 1.17 | 24 |
| num_025 | 4 | 1.07 | 1.01 | 0.82 | 1.24 | 25 |
| num_026 | 4 | 0.99 | 0.91 | 0.82 | 1.11 | 26 |
| num_027 | 5 | 0.99 | 0.94 | 0.95 | 0.99 | 27 |
| num_028 | 4 | 0.9 | 0.82 | 0.82 | 1.0 | 28. |
| num_029 | 4 | 0.95 | 0.89 | 0.82 | 1.09 | 29 |
| num_030 | 2 | 0.63 | 0.58 | 0.54 | 1.06 | 30 |
| num_031 | 4 | 0.82 | 0.77 | 0.82 | 0.94 | 31. |
| num_032 | 4 | 0.96 | 0.92 | 0.82 | 1.12 | 32 |
| num_033 | 4 | 0.92 | 0.86 | 0.82 | 1.05 | 33 |
| num_034 | 4 | 0.98 | 0.93 | 0.82 | 1.14 | 34 |
| num_035 | 4 | 1.04 | 0.98 | 0.82 | 1.2 | 35 |
| num_036 | 4 | 1.07 | 1.01 | 0.82 | 1.24 | 36 |
| num_037 | 5 | 1.01 | 0.95 | 0.95 | 1.0 | 37 |
| num_038 | 4 | 0.93 | 0.86 | 0.82 | 1.05 | 38. |
| num_039 | 4 | 1.02 | 0.96 | 0.82 | 1.17 | 39 |
| num_040 | 2 | 0.65 | 0.57 | 0.54 | 1.05 | 40. |
| num_041 | 4 | 0.88 | 0.79 | 0.82 | 0.97 | 41 |
| num_042 | 4 | 0.92 | 0.85 | 0.82 | 1.04 | 42. |
| num_043 | 4 | 0.97 | 0.89 | 0.82 | 1.09 | 43 |
| num_044 | 4 | 0.93 | 0.84 | 0.82 | 1.03 | 44 |
| num_045 | 4 | 0.96 | 0.88 | 0.82 | 1.08 | 45 |
| num_046 | 4 | 1.15 | 1.04 | 0.82 | 1.27 | 46 |
| num_047 | 5 | 1.01 | 0.94 | 0.95 | 0.99 | 47 |
| num_048 | 4 | 0.94 | 0.83 | 0.82 | 1.01 | 48 |
| num_049 | 4 | 0.93 | 0.85 | 0.82 | 1.04 | 49. |
| num_050 | 2 | 0.65 | 0.57 | 0.54 | 1.05 | 50 |
| num_051 | 4 | 0.96 | 0.9 | 0.82 | 1.1 | 51 |
| num_052 | 4 | 1.03 | 0.96 | 0.82 | 1.17 | 52 |
| num_053 | 4 | 0.99 | 0.91 | 0.82 | 1.11 | 53 |
| num_054 | 4 | 1.0 | 0.93 | 0.82 | 1.14 | 54. |
| num_055 | 4 | 1.03 | 0.95 | 0.82 | 1.16 | 55 |
| num_056 | 4 | 1.0 | 0.92 | 0.82 | 1.12 | 56 |
| num_057 | 5 | 1.03 | 0.97 | 0.95 | 1.02 | 57 |
| num_058 | 4 | 0.98 | 0.9 | 0.82 | 1.1 | 58 |
| num_059 | 4 | 0.95 | 0.88 | 0.82 | 1.08 | 59 |
| num_060 | 2 | 0.62 | 0.54 | 0.54 | 0.99 | 60 |
| num_061 | 4 | 0.8 | 0.71 | 0.82 | 0.87 | 61 |
| num_062 | 4 | 0.93 | 0.84 | 0.82 | 1.03 | 62. |
| num_063 | 4 | 0.85 | 0.77 | 0.82 | 0.94 | 63. |
| num_064 | 4 | 0.9 | 0.82 | 0.82 | 1.0 | 64 |
| num_065 | 4 | 0.97 | 0.87 | 0.82 | 1.06 | 65 |
| num_066 | 4 | 0.99 | 0.86 | 0.82 | 1.05 | 66 |
| num_067 | 5 | 0.88 | 0.81 | 0.95 | 0.85 | 67 |
| num_068 | 4 | 0.87 | 0.78 | 0.82 | 0.95 | 68 |
| num_069 | 4 | 0.86 | 0.79 | 0.82 | 0.97 | 69. |
| num_070 | 2 | 0.65 | 0.54 | 0.54 | 0.99 | 70. |
| num_071 | 4 | 0.8 | 0.71 | 0.82 | 0.87 | 71 |
| num_072 | 4 | 0.93 | 0.86 | 0.82 | 1.05 | 72. |
| num_073 | 4 | 0.95 | 0.87 | 0.82 | 1.06 | 73. |
| num_074 | 4 | 0.87 | 0.75 | 0.82 | 0.92 | 74 |
| num_075 | 4 | 0.9 | 0.84 | 0.82 | 1.03 | 75. |
| num_076 | 4 | 1.01 | 0.91 | 0.82 | 1.11 | 76. |
| num_077 | 5 | 0.98 | 0.88 | 0.95 | 0.92 | 77. |
| num_078 | 4 | 0.91 | 0.8 | 0.82 | 0.98 | 78. |
| num_079 | 4 | 0.92 | 0.86 | 0.82 | 1.05 | 79 |
| num_080 | 2 | 0.7 | 0.63 | 0.54 | 1.16 | 80. |
| num_081 | 4 | 0.9 | 0.85 | 0.82 | 1.04 | 81 |
| num_082 | 4 | 1.07 | 1.01 | 0.82 | 1.24 | 82. |
| num_083 | 4 | 0.99 | 0.92 | 0.82 | 1.12 | 83. |
| num_084 | 4 | 1.01 | 0.96 | 0.82 | 1.17 | 84 |
| num_085 | 4 | 1.06 | 1.0 | 0.82 | 1.22 | 85 |
| num_086 | 4 | 1.14 | 1.05 | 0.82 | 1.28 | 86 |
| num_087 | 5 | 1.18 | 1.12 | 0.95 | 1.17 | 87 |
| num_088 | 4 | 1.04 | 0.98 | 0.82 | 1.2 | 88 |
| num_089 | 4 | 0.99 | 0.94 | 0.82 | 1.15 | 89 |
| num_090 | 2 | 0.69 | 0.65 | 0.54 | 1.19 | 90 |
| num_091 | 4 | 0.94 | 0.82 | 0.82 | 1.0 | 91. |
| num_092 | 4 | 0.98 | 0.86 | 0.82 | 1.05 | 92 |
| num_093 | 4 | 0.95 | 0.85 | 0.82 | 1.04 | 93. |
| num_094 | 4 | 0.97 | 0.87 | 0.82 | 1.06 | 94 |
| num_095 | 4 | 1.02 | 0.92 | 0.82 | 1.12 | 95 |
| num_096 | 4 | 1.09 | 0.98 | 0.82 | 1.2 | 96 |
| num_097 | 5 | 1.2 | 1.09 | 0.95 | 1.14 | 97 |
| num_098 | 4 | 1.01 | 0.9 | 0.82 | 1.1 | 98 |
| num_099 | 4 | 1.02 | 0.92 | 0.82 | 1.12 | 99 |
| num_100 | 2 | 0.52 | 0.42 | 0.54 | 0.77 | 100 |
| num_200 | 3 | 0.75 | 0.66 | 0.68 | 0.97 | 200 |
| num_hundert_prefix | 2 | 0.5 | 0.4 | 0.54 | 0.73 | Wundert. |
| paused | 4 | 0.92 | 0.81 | 0.82 | 0.99 | Timer pausiert. |
| per_side | 5 | 1.11 | 0.94 | 0.95 | 0.99 | Gewicht pro Seite. |
| plan_a | 7 | 2.02 | 1.76 | 1.23 | 1.43 | Training A wird geladen, die Tauben T. |
| plan_b | 6 | 1.31 | 1.2 | 1.09 | 1.1 | Training B wird geladen. |
| plan_c | 6 | 1.5 | 1.39 | 1.09 | 1.27 | Training C wird geladen. |
| pr | 8 | 2.57 | 1.44 | 1.36 | 1.06 | Neuer Bestwert.  Beeindruckend. |
| protein | 4 | 1.1 | 1.04 | 0.82 | 1.27 | Zeit für Eiweiß. |
| quick | 6 | 1.32 | 1.19 | 1.09 | 1.09 | Kurzes Training aktiv. |
| rest | 2 | 0.47 | 0.42 | 0.54 | 0.77 | Pause. |
| rest_day | 13 | 2.96 | 2.42 | 2.05 | 1.18 | Heute ist Ruhetag. Erholung ist Teil des Plans. |
| resume | 3 | 0.78 | 0.68 | 0.68 | 1.0 | Weiter geht's! |
| same_weight | 6 | 1.0 | 0.85 | 1.09 | 0.78 | Gewicht beibehalten. |
| session_done | 15 | 3.6 | 2.24 | 2.32 | 0.97 | Training abgeschlossen.  Hervorragende Arbeit, Joshi. |
| session_done_neutral | 13 | 2.75 | 2.15 | 2.05 | 1.05 | Training abgeschlossen.  Hervorragende Arbeit. |
| shoulders | 6 | 1.13 | 1.06 | 1.09 | 0.97 | Schultern locker lassen. |
| skip_warm | 7 | 1.08 | 0.99 | 1.23 | 0.81 | Aufwärmen übersprungen |
| slow | 6 | 1.32 | 1.21 | 1.09 | 1.11 | Langsam und kontrolliert. |
| ten_left | 5 | 0.98 | 0.84 | 0.95 | 0.88 | Noch 10 Sekunden. |
| tension | 10 | 2.31 | 1.85 | 1.64 | 1.13 | Erst Spannung aufbauen, dann bewegen. |
| u_bis | 1 | 0.33 | 0.27 | 0.41 | 0.66 | Bis. |
| u_je_seite | 3 | 0.68 | 0.63 | 0.68 | 0.92 | Je Seite. |
| u_kilo | 2 | 0.43 | 0.38 | 0.54 | 0.7 | Kilo. |
| u_komma_fuenf | 3 | 0.78 | 0.72 | 0.68 | 1.06 | Komma 5 |
| u_mal | 1 | 0.4 | 0.35 | 0.41 | 0.86 | Mal. |
| u_pro_seite | 3 | 0.7 | 0.64 | 0.68 | 0.94 | Pro Seite |
| u_saetze | 2 | 0.47 | 0.4 | 0.54 | 0.73 | Setze. |
| u_satz | 1 | 0.43 | 0.33 | 0.41 | 0.81 | Satz. |
| u_sekunden | 3 | 0.6 | 0.5 | 0.68 | 0.73 | Sekunden |
| u_sekunden_halten | 5 | 0.93 | 0.77 | 0.95 | 0.81 | Sekunden halten. |
| u_von | 1 | 0.41 | 0.31 | 0.41 | 0.76 | FUN |
| u_wiederholungen | 5 | 0.71 | 0.65 | 0.95 | 0.68 | Wiederholungen. |
| warm_armcircle | 3 | 0.82 | 0.75 | 0.68 | 1.1 | Arm kreisen |
| warm_armopen | 7 | 1.42 | 1.29 | 1.23 | 1.05 | Arme öffnen ohne Band. |
| warm_bike | 5 | 0.95 | 0.86 | 0.95 | 0.9 | Heimtrainer locker. |
| warm_bike_kurz | 4 | 1.14 | 1.01 | 0.82 | 1.24 | Heimtrainer Kurz |
| warm_cross | 5 | 1.15 | 1.03 | 0.95 | 1.08 | Cross-Trainer locker. |
| warm_cross_kurz | 4 | 1.08 | 1.01 | 0.82 | 1.24 | Cross Trainer Kurz |
| warm_done | 7 | 1.21 | 1.07 | 1.23 | 0.87 | Aufwärmen abgeschlossen. |
| warm_march | 7 | 1.19 | 1.1 | 1.23 | 0.9 | auf der Stelle marschieren. |
| warm_pullapart | 4 | 1.18 | 0.96 | 0.82 | 1.17 | Bend pull apart. |
| warm_rope | 5 | 1.14 | 1.03 | 0.95 | 1.08 | Seil springen locker. |
| warm_rower | 6 | 0.98 | 0.88 | 1.09 | 0.81 | Rudergerät locker |
| warm_rower_kurz | 5 | 1.24 | 1.08 | 0.95 | 1.13 | Brudergerät kurz. |
| warm_start | 5 | 1.0 | 0.93 | 0.95 | 0.97 | Aufwärmen beginnt. |
| warm_tread | 8 | 1.6 | 1.38 | 1.36 | 1.01 | Zügig gehen auf dem Laufband. |
| warm_tread_kurz | 9 | 1.77 | 1.58 | 1.5 | 1.05 | Kurzzügig gehen auf dem Laufband. |
| warmup_sets | 6 | 1.36 | 1.24 | 1.09 | 1.14 | Zuerst Aufwärmsätze. |
| water | 6 | 1.15 | 1.1 | 1.09 | 1.01 | Trink einen Schluck Wasser. |
| week_1 | 3 | 0.66 | 0.61 | 0.68 | 0.9 | Woche 1 |
| week_2 | 3 | 0.66 | 0.6 | 0.68 | 0.88 | Woche 2 |
| week_3 | 3 | 0.65 | 0.59 | 0.68 | 0.87 | Woche 3 |
| week_4 | 3 | 0.68 | 0.62 | 0.68 | 0.91 | Woche 4 |
| welcome_back | 7 | 1.43 | 1.27 | 1.23 | 1.03 | Willkommen zurück, Joshi. |
| welcome_back_neutral | 5 | 0.98 | 0.88 | 0.95 | 0.92 | Willkommen zurück! |

## Ausreißer
- keine
