# JAI Stimm-Effekte (ffmpeg)

Ausgabe jeweils: `-ar 44100 -ac 1 -b:a 128k`. Gemeinsamer Schluss aller Ketten (Lautheit ~-16 LUFS, Peak <= -1.3 dBFS):
`acompressor=threshold=-22dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14.5:TP=-0.5:LRA=11,aresample=44100,alimiter=limit=0.84:attack=2:release=50:level=0`

## leicht (klar, technischer Glanz)
```
ffmpeg -i IN.mp3 -af "highpass=f=120,equalizer=f=3000:t=q:w=1:g=3,aeval='val(0)*(0.9+0.1*sin(2*PI*40*t))':c=same,flanger=delay=1:depth=1:regen=-20:width=40:speed=0.3,aecho=0.8:0.4:7|13:0.25|0.15,acompressor=threshold=-22dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14.5:TP=-0.5:LRA=11,aresample=44100,alimiter=limit=0.84:attack=2:release=50:level=0" -ar 44100 -ac 1 -b:a 128k OUT.mp3
```

## mittel (deutlich künstlich)
```
ffmpeg -i IN.mp3 -af "highpass=f=150,lowpass=f=7000,aeval='val(0)*(0.7+0.3*sin(2*PI*40*t))':c=same,aphaser=in_gain=0.6:out_gain=0.9:delay=2:decay=0.4:speed=0.5:type=t,equalizer=f=2500:t=q:w=1:g=4,aecho=0.8:0.5:5|11|17:0.3|0.2|0.15,acompressor=threshold=-22dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14.5:TP=-0.5:LRA=11,aresample=44100,alimiter=limit=0.84:attack=2:release=50:level=0" -ar 44100 -ac 1 -b:a 128k OUT.mp3
```

## stark (Roboter, verständlich; Robotisierung parallel zum Original)
```
ffmpeg -i IN.mp3 -filter_complex "[0:a]highpass=f=120,asplit=2[d][r];[r]afftfilt=real='hypot(re,im)':imag='0':win_size=512:overlap=0.75,volume=0.8[rb];[d][rb]amix=inputs=2:weights='0.5 0.7':normalize=0,aeval='val(0)*(0.55+0.45*sin(2*PI*50*t))':c=same,acrusher=bits=8:mix=0.25:mode=log:aa=1,lowpass=f=7500,equalizer=f=2500:t=q:w=1:g=3,aecho=0.8:0.5:6|14:0.35|0.2,acompressor=threshold=-22dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14.5:TP=-0.5:LRA=11,aresample=44100,alimiter=limit=0.84:attack=2:release=50:level=0[out]" -map "[out]" -ar 44100 -ac 1 -b:a 128k OUT.mp3
```

Hinweis: Ringmod-Anteil steckt im aeval-Term (0.9+0.1 / 0.7+0.3 / 0.55+0.45 bei 40/40/50 Hz). Batch-Skript: siehe fx.sh-Logik oben.
