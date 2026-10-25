#!/usr/bin/env python3
"""Baut die eigenständige index.html aus src/app.html + src/program.js und bettet die Schriften ein.

Aufruf: python3 tools/build_html.py <ausgabe.html>
Schriften: Ordner mit den entpackten npm-Paketen @fontsource/rajdhani, @fontsource/orbitron,
@fontsource/instrument-sans (Umgebungsvariable FONTS_DIR, Standard: tools/.cache).
"""
import base64, glob, os, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS = os.environ.get('FONTS_DIR', os.path.join(REPO, 'tools', '.cache'))


def face(fam, pkg, w):
    hits = glob.glob(os.path.join(FONTS, f'fontsource-{pkg}-*', 'package', 'files', f'{pkg}-latin-{w}-normal.woff2'))
    if not hits:
        sys.exit(f'Schrift fehlt: {pkg} {w}. Erst tools/build.sh fonts ausführen oder FONTS_DIR setzen.')
    b = base64.b64encode(open(hits[0], 'rb').read()).decode()
    return f"@font-face{{font-family:'{fam}';font-style:normal;font-weight:{w};font-display:swap;src:url(data:font/woff2;base64,{b}) format('woff2')}}"


fonts = [face('Rajdhani', 'rajdhani', w) for w in (600, 700)]
fonts += [face('Orbitron', 'orbitron', w) for w in (600, 700, 800)]
fonts += [face('Instrument Sans', 'instrument-sans', w) for w in (400, 600)]

src = open(os.path.join(REPO, 'src', 'app.html'), encoding='utf-8').read().replace('/*FONTS*/', '\n'.join(fonts))
prog = open(os.path.join(REPO, 'src', 'program.js'), encoding='utf-8').read()
assert src.count('/*PROGRAM*/') == 1, 'Marker /*PROGRAM*/ fehlt in app.html'
src = src.replace('/*PROGRAM*/', prog)
page = ('<!doctype html><html lang="de"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">'
        '<meta name="theme-color" content="#03060b"></head><body>' + src + '</body></html>')
open(sys.argv[1], 'w', encoding='utf-8').write(page)
print('geschrieben', sys.argv[1], len(page), 'Zeichen')
