import json,os,re,subprocess,sys
from concurrent.futures import ThreadPoolExecutor
import os as _os
_D=_os.path.dirname(_os.path.abspath(__file__))
SRC=_os.environ.get('JAI_CLIPS',_os.path.join(_D,'clips'));OUT=_os.environ.get('JAI_OUT',_os.path.join(_D,'..','android','assets','jai'));TMP=_os.environ.get('JAI_TMP','/tmp/jaifx')
FX="highpass=f=120,equalizer=f=3000:t=q:w=1:g=3,aeval='val(0)*(0.9+0.1*sin(2*PI*40*t))':c=same,flanger=delay=1:depth=1:regen=-20:width=40:speed=0.3,aecho=0.8:0.4:7|13:0.25|0.15,acompressor=threshold=-22dB:ratio=3:attack=5:release=80:makeup=2"
def run(c):return subprocess.run(c,capture_output=True,text=True)
def proc(f):
    i=f[:-4];src=f'{SRC}/{f}';t=f'{TMP}/{i}.wav'
    # pad 150 ms so echo tail is kept, then fx
    run(['ffmpeg','-y','-v','error','-i',src,'-af',f'apad=pad_dur=0.15,{FX},aresample=44100','-ac','1',t])
    # measure loudness (pad to >=0.4s for ebur128 by looping not needed; use astats RMS fallback)
    r=run(['ffmpeg','-v','info','-i',t,'-af','ebur128=peak=true','-f','null','-'])
    m=re.findall(r'I:\s+(-?[\d.]+) LUFS',r.stderr)
    lufs=float(m[-1]) if m else None
    if lufs is None or lufs<-60:
        r=run(['ffmpeg','-v','info','-i',t,'-af','astats=metadata=0','-f','null','-'])
        rms=re.findall(r'RMS level dB:\s+(-?[\d.]+)',r.stderr);lufs=float(rms[-1])+3 if rms else -20
    g=-16-lufs
    dur=float(run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',t]).stdout.strip())
    fo=max(0.01,dur-0.03)
    r=run(['ffmpeg','-y','-v','error','-i',t,'-af',f'volume={g:.2f}dB,alimiter=limit=0.7:attack=1:release=40:level=0,afade=t=in:d=0.012,afade=t=out:st={fo:.3f}:d=0.03','-ac','1','-ar','44100','-b:a','64k',f'{OUT}/{i}.mp3'])
    return i,lufs,g,r.returncode
files=sorted(os.listdir(SRC))
with ThreadPoolExecutor(8) as ex: res=list(ex.map(proc,files))
bad=[x for x in res if x[3]!=0];print('done',len(res),'bad',bad)
