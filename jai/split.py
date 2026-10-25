#!/usr/bin/env python3
"""Zerschneidet eine Batch-Aufnahme in Einzelclips.

Aufruf:
  python3 split.py <audio.mp3> <batch_name>            # IDs + Texte aus manifest.json (audio_order)
  python3 split.py <audio.mp3> --ids id1,id2,...        # IDs explizit (Texte aus manifest.json)
Optionen:
  --drop-first / --no-drop-first   Vorlauf-Segment verwerfen (Default: aus Manifest discard_first)
  --drop-last  / --no-drop-last    Nachlauf-Segment verwerfen (Default: aus Manifest discard_last)
  --out DIR       Zielordner (Default jai/clips)
  --dry-run       nur Zuordnung + Dauern ausgeben

Verfahren: Energiehülle (10-ms-Frames), Kandidaten-Pausen unterhalb einer
Schwelle, dann dynamische Programmierung: wählt genau N-1 Schnittpausen so,
dass die Segmentdauern zur erwarteten Dauer (nach Silbenzahl) passen und
lange Pausen bevorzugt geschnitten werden. Jeder Clip wird an den Rändern
von Stille befreit (Schwelle) und erhält 30 ms Fade-in/-out.
"""
import argparse, json, re, subprocess, sys, os
import numpy as np

MANIFEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "manifest.json")
SR_AN = 16000          # Analyse-Samplerate
FR = 160               # 10 ms
PAD = 0.025            # Rand nach Trim (s)
FADE = 0.03
MIN_GAP = 0.25          # Mindestpause für den Exakt-Modus (s)


def syllables(t):
    t = t.lower()
    t = re.sub(r"[^a-zäöüß]", " ", t)
    n = len(re.findall(r"(ei|ai|au|eu|äu|ie|[aeiouyäöü])", t))
    return max(1, n)


def envelope(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "s16le", "-ac", "1",
                          "-ar", str(SR_AN), "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.int16).astype(float) / 32768
    n = len(x) // FR
    rms = np.sqrt((x[:n * FR].reshape(n, FR) ** 2).mean(1) + 1e-12)
    return 20 * np.log10(rms)


def runs_below(db, th, minlen):
    sil = db < th
    out, i, n = [], 0, len(db)
    while i < n:
        if sil[i]:
            j = i
            while j < n and sil[j]:
                j += 1
            if j - i >= minlen:
                out.append((i, j))
            i = j
        else:
            i += 1
    return out


def align(db, texts, th, gth=None):
    n = len(db)
    gth = th if gth is None else gth
    speech = np.where(db >= th)[0]
    s0, s1 = int(speech[0]), int(speech[-1]) + 1
    N = len(texts)
    # Exakt-Modus: klare Pausen >= MIN_GAP, deren Anzahl genau N-1 ist
    long_gaps = [(a, b) for a, b in runs_below(db, th, int(MIN_GAP * 100)) if a > s0 and b < s1]
    if len(long_gaps) == N - 1:
        st = [s0] + [b for a, b in long_gaps]
        en = [a for a, b in long_gaps] + [s1]
        align.mode = f"exakt ({len(long_gaps)} Pausen >= {int(MIN_GAP*1000)} ms)"
        return list(zip(st, en)), np.array([syllables(t) for t in texts], float) * ((s1 - s0) / sum(syllables(t) for t in texts))
    align.mode = f"Schätzung per DP (Pausen >= {int(MIN_GAP*1000)} ms: {len(long_gaps)}, erwartet {N-1})"
    gaps = [(a, b) for a, b in runs_below(db, gth, 3) if a > s0 and b < s1]
    if len(gaps) < N - 1:
        raise SystemExit(f"Zu wenige Pausen ({len(gaps)}) für {N} Segmente")
    syl = np.array([syllables(t) for t in texts], float)
    gaplen = np.array([b - a for a, b in gaps], float)
    total_speech = (s1 - s0) - gaplen.sum() * 0.6
    per = total_speech / (syl.sum() + 0.0)
    exp = syl * per + 8           # erwartete Dauer in Frames (inkl. Grundlänge)
    # Grenzen: index -1 = Start s0, len(gaps) = Ende s1
    G = len(gaps)
    starts = [s0] + [b for a, b in gaps]        # Segmentstart nach Grenze i (i=-1..G-1) -> starts[i+1]
    ends = [a for a, b in gaps] + [s1]          # Segmentende an Grenze j (j=0..G) -> ends[j]
    cum = np.concatenate([[0], np.cumsum(gaplen)])
    LAM = 0.35   # Strafe pro übersprungenem Pausen-Frame
    MU = 0.25    # Bonus pro geschnittenem Pausen-Frame
    INF = 1e18
    # dp[k][j]: bester Wert, wenn Segment k an Grenze j endet
    dp = np.full((N, G + 1), INF)
    bp = np.full((N, G + 1), -2, int)

    def segcost(k, i, j):  # Segment k von Grenze i (-1..) bis Grenze j
        st, en = starts[i + 1], ends[j]
        if en <= st:
            return INF
        d = en - st
        skipped = cum[j] - cum[i + 1] if j > i + 1 else 0.0
        e = exp[k]
        return ((d - e) / e) ** 2 * 40 + LAM * skipped

    for j in range(G + 1):
        c = segcost(0, -1, j)
        if c < INF:
            dp[0][j] = c - (MU * gaplen[j] if j < G else 0)
            bp[0][j] = -1
    for k in range(1, N):
        jr = range(k, G + 1) if k < N - 1 else [G]
        for j in jr:
            best, arg = INF, -2
            for i in range(k - 1, j):
                if dp[k - 1][i] >= INF:
                    continue
                c = dp[k - 1][i] + segcost(k, i, j)
                if c < best:
                    best, arg = c, i
            if arg != -2:
                dp[k][j] = best - (MU * gaplen[j] if j < G else 0)
                bp[k][j] = arg
    if dp[N - 1][G] >= INF:
        raise SystemExit("Keine gültige Zuordnung gefunden")
    bounds, j = [], G
    for k in range(N - 1, -1, -1):
        i = bp[k][j]
        bounds.append((starts[i + 1], ends[j]))
        j = i
    bounds.reverse()
    return bounds, exp


def has_inner_break(t):
    return bool(re.search(r"[.,!?;:]\s+\S", t.strip()))


def align_pauses(db, texts, th, min_cand=0.05, until=None):
    """Für Batches mit '…'-Trennung: Kandidaten = Pausen >= min_cand.
    Ohne until: DP wählt genau N-1 Pausen; Pausen innerhalb eines Eintrags sind nur
    bei Einträgen mit innerem Satzzeichen erlaubt (sonst hohe Strafe).
    Mit until (s): nur der Teil bis zur letzten Pause vor until wird sequenziell
    zugeordnet (alle Pausen dort müssen Eintragsgrenzen sein); gibt die Anzahl
    zugeordneter Einträge zurück."""
    speech = np.where(db >= th)[0]
    s0, s1 = int(speech[0]), int(speech[-1]) + 1
    gaps = [(a, b) for a, b in runs_below(db, th, int(min_cand * 100)) if a > s0 and b < s1]
    N = len(texts)
    syl = np.array([len(t) for t in texts], float)   # Zeichen statt Silben (stabiler)
    if until is not None:
        U = int(until * 100)
        pre = [g for g in gaps if g[1] <= U and (g[1] - g[0]) >= int(MIN_GAP * 100)]
        st = [s0] + [b for a, b in pre]
        en = [a for a, b in pre]
        k = len(en)
        bad = [texts[i] for i in range(min(k, N)) if has_inner_break(texts[i])]
        align_pauses.mode = (f"Präfix bis {until:.1f} s: {k} vollständige Segmente sequenziell zugeordnet"
                      + (f"; WARNUNG innere Satzzeichen in {bad}" if bad else "; keine Einträge mit innerer Pause"))
        k = min(k, N)
        return list(zip(st[:k], en[:k])), syl[:k] * 0 + 1
    G = len(gaps)
    if G < N - 1:
        raise SystemExit(f"Zu wenige Pausen ({G}) für {N} Segmente")
    gl = np.array([b - a for a, b in gaps], float)
    starts = [s0] + [b for a, b in gaps]
    ends = [a for a, b in gaps] + [s1]
    cum = np.concatenate([[0], np.cumsum(gl)])
    speech_total = (s1 - s0) - gl.sum()
    per = speech_total / syl.sum()
    exp = syl * per
    inner = [has_inner_break(t) for t in texts]
    INF = 1e18
    HARD = int(MIN_GAP * 100)   # Pausen >= MIN_GAP nur innerhalb von Einträgen mit innerem Satzzeichen
    dp = np.full((N, G + 1), INF); bp = np.full((N, G + 1), -2, int)
    def cost(k, i, j):
        st, en = starts[i + 1], ends[j]
        if en <= st: return INF
        skipped = cum[j] - cum[i + 1] if j > i + 1 else 0.0
        if not inner[k] and j > i + 1 and max(gl[i + 1:j]) >= HARD: return INF
        sp = (en - st) - skipped
        return ((sp - exp[k]) / exp[k]) ** 2 * 10 + 0.3 * skipped
    for j in range(G + 1):
        c = cost(0, -1, j)
        if c < INF: dp[0][j] = c - (0.02 * gl[j] if j < G else 0); bp[0][j] = -1
    for k in range(1, N):
        for j in (range(k, G + 1) if k < N - 1 else [G]):
            best, arg = INF, -2
            for i in range(max(k - 1, j - 25), j):
                if dp[k - 1][i] >= INF: continue
                c = dp[k - 1][i] + cost(k, i, j)
                if c < best: best, arg = c, i
            if arg != -2:
                dp[k][j] = best - (0.02 * gl[j] if j < G else 0); bp[k][j] = arg
    if dp[N - 1][G] >= INF:
        raise SystemExit("Keine gültige Zuordnung (Pausen passen nicht zu den Einträgen)")
    bounds, j, chosen = [], G, []
    for k in range(N - 1, -1, -1):
        i = bp[k][j]; bounds.append((starts[i + 1], ends[j])); j = i
    bounds.reverse()
    nin = sum(1 for k in range(N) if inner[k])
    skipped_total = G - (N - 1)
    align_pauses.mode = (f"Pausen-DP: {G} Pausen >= {int(min_cand*1000)} ms, {N-1} als Grenzen, "
                  f"{skipped_total} innerhalb von Einträgen (Pausen >= {HARD*10} ms nur bei {nin} Einträgen mit innerem Satzzeichen)")
    return bounds, exp


def trim(db, a, b, th):
    seg = np.where(db[a:b] >= th)[0]
    if len(seg) == 0:
        return a, b
    return a + int(seg[0]), a + int(seg[-1]) + 1


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("audio")
    ap.add_argument("batch", nargs="?")
    ap.add_argument("--ids")
    ap.add_argument("--drop-first", dest="drop_first", action="store_true", default=None)
    ap.add_argument("--no-drop-first", dest="drop_first", action="store_false")
    ap.add_argument("--drop-last", dest="drop_last", action="store_true", default=None)
    ap.add_argument("--no-drop-last", dest="drop_last", action="store_false")
    ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "clips"))
    ap.add_argument("--th", type=float, default=None, help="Stille-Schwelle dB (Default auto)")
    ap.add_argument("--gap-th", type=float, default=None, help="Schwelle für Schnittpausen dB (Default Schwelle+8)")
    ap.add_argument("--min-gap", type=float, default=0.25, help="Mindestpause Exakt-Modus in s")
    ap.add_argument("--strict", action="store_true", help="abbrechen, wenn Exakt-Modus nicht greift")
    ap.add_argument("--pauses", action="store_true", help="Pausen-DP für '…'-getrennte Batches (Default, wenn Manifest separator hat)")
    ap.add_argument("--until", type=float, default=None, help="nur bis zu dieser Zeit (s) zuordnen; Rest bleibt pending")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    m = json.load(open(MANIFEST))
    text = {e["id"]: e["text"] for g in m["groups"].values() for e in g}
    binfo = m["batches"].get(a.batch, {}) if a.batch else {}
    ids = a.ids.split(",") if a.ids else binfo.get("audio_order", binfo.get("order"))
    if not ids:
        raise SystemExit("Keine IDs angegeben")
    df = a.drop_first if a.drop_first is not None else binfo.get("discard_first", False)
    dl = a.drop_last if a.drop_last is not None else binfo.get("discard_last", False)
    texts = ([text["_lead"]] if df else []) + [text[i] for i in ids] + ([text["_tail"]] if dl else [])
    labels = (["_lead"] if df else []) + ids + (["_tail"] if dl else [])
    db = envelope(a.audio)
    th = a.th if a.th is not None else max(-38.0, float(np.percentile(db, 10)) + 6)
    gth = a.gap_th if a.gap_th is not None else th + 8
    global MIN_GAP
    MIN_GAP = a.min_gap
    if a.pauses or binfo.get("separator") or a.until is not None:
        bounds, exp = align_pauses(db, texts, th, until=a.until)
        align.mode = align_pauses.mode if hasattr(align_pauses, "mode") else align.mode
    else:
        bounds, exp = align(db, texts, th, gth)
    if a.strict and not (align.mode.startswith("exakt") or align.mode.startswith("Pausen-DP") or align.mode.startswith("Präfix")):
        raise SystemExit("ABBRUCH (--strict): " + align.mode)
    os.makedirs(a.out, exist_ok=True)
    unsafe = set()
    for k in range(len(bounds) - 1):
        if bounds[k + 1][0] - bounds[k][1] < int(MIN_GAP * 100):
            unsafe.update({labels[k], labels[k + 1]})
    report = []
    for lab, t, (s, e), ex in zip(labels, texts, bounds, exp):
        s, e = trim(db, s, e, th)
        ts, te = max(0, s / 100 - PAD), e / 100 + PAD
        dur = te - ts
        report.append((lab, t, round(ts, 2), round(dur, 2), round(ex / 100, 2)))
        if lab.startswith("_") or a.dry_run or lab in unsafe:
            continue
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{ts:.3f}", "-t", f"{dur:.3f}", "-i", a.audio,
                        "-af", f"afade=t=in:d={FADE},afade=t=out:st={max(0, dur - FADE):.3f}:d={FADE}",
                        "-ar", "44100", "-ac", "1", "-b:a", "128k", os.path.join(a.out, lab + ".mp3")], check=True)
    for r in report:
        flag = "  !" if r[3] < 0.5 * r[4] or r[3] > 1.8 * r[4] else ""
        print(f"{r[0]:<28} {r[1]:<40} start {r[2]:>6}s  dauer {r[3]:>5}s  erwartet {r[4]:>5}s{flag}")
    us = [l for l in labels if l in unsafe and not l.startswith("_")]
    if us:
        print(f"UNSICHER (Grenzpause < {int(MIN_GAP*1000)} ms, nicht geschrieben):", ",".join(us))
    if len(bounds) < len(labels):
        print("NICHT ZUGEORDNET (pending):", ",".join(labels[len(bounds):]))
    print("Modus:", align.mode)
    print(f"Schwelle {th:.1f} dB, Pausen-Schwelle {gth:.1f} dB, Segmente {len(bounds)}, Clips geschrieben: "
          f"{0 if a.dry_run else sum(1 for r in report if not r[0].startswith('_'))}")


if __name__ == "__main__":
    main()
