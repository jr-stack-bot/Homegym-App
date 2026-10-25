set -e
LN="acompressor=threshold=-22dB:ratio=3:attack=5:release=80:makeup=2,loudnorm=I=-14.5:TP=-0.5:LRA=11,aresample=44100,alimiter=limit=0.84:attack=2:release=50:level=0"
LEICHT="highpass=f=120,equalizer=f=3000:t=q:w=1:g=3,aeval='val(0)*(0.9+0.1*sin(2*PI*40*t))':c=same,flanger=delay=1:depth=1:regen=-20:width=40:speed=0.3,aecho=0.8:0.4:7|13:0.25|0.15,$LN"
MITTEL="highpass=f=150,lowpass=f=7000,aeval='val(0)*(0.7+0.3*sin(2*PI*40*t))':c=same,aphaser=in_gain=0.6:out_gain=0.9:delay=2:decay=0.4:speed=0.5:type=t,equalizer=f=2500:t=q:w=1:g=4,aecho=0.8:0.5:5|11|17:0.3|0.2|0.15,$LN"
STARK="[0:a]highpass=f=120,asplit=2[d][r];[r]afftfilt=real='hypot(re,im)':imag='0':win_size=512:overlap=0.75,volume=0.8[rb];[d][rb]amix=inputs=2:weights='0.5 0.7':normalize=0,aeval='val(0)*(0.55+0.45*sin(2*PI*50*t))':c=same,acrusher=bits=8:mix=0.25:mode=log:aa=1,lowpass=f=7500,equalizer=f=2500:t=q:w=1:g=3,aecho=0.8:0.5:6|14:0.35|0.2,$LN[out]"
cd "$(dirname "$0")"
for n in 1 3; do
  in=previews/p$n.mp3
  ffmpeg -y -v error -i $in -af "$LEICHT" -ar 44100 -ac 1 -b:a 128k demo/JAI_Stimme${n}_leicht.mp3
  ffmpeg -y -v error -i $in -af "$MITTEL" -ar 44100 -ac 1 -b:a 128k demo/JAI_Stimme${n}_mittel.mp3
  ffmpeg -y -v error -i $in -filter_complex "$STARK" -map "[out]" -ar 44100 -ac 1 -b:a 128k demo/JAI_Stimme${n}_stark.mp3
done
for f in demo/*.mp3; do
  echo "== $f"; ffmpeg -hide_banner -nostats -i $f -af ebur128=peak=true,astats=measure_overall=Peak_level+Noise_floor:measure_perchannel=none -f null - 2>&1 | grep -E "^\s+I:|Peak:|Peak level|Noise floor" | tail -4
done
