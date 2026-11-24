#!/usr/bin/env python3
"""Homegym App-Icon @ Joschy: erzeugt aus src/icon.svg alle Launcher-Ressourcen.

  mipmap-anydpi-v26/ic_launcher.xml          Adaptive Icon (Android 8+) mit Vorder-, Hintergrund und Monochrom-Ebene (13+)
  mipmap-<dichte>/ic_launcher_foreground.png  108 dp, Figur in der Safe-Zone (Kreis 66 dp)
  mipmap-<dichte>/ic_launcher_background.png  Anthrazit-Verlauf
  mipmap-<dichte>/ic_launcher_monochrome.png  einfarbige Silhouette mit Trennfugen (Themed Icons)
  mipmap-<dichte>/ic_launcher.png             klassisches Icon (Android 7), abgerundetes Quadrat

Aufruf: python3 -I tools/make_icons.py [vorschau.png]
Rendert mit Chromium (Python-Playwright, wie die Tests). Optional eine Vorschau: groß, rund, Squircle, 48 px.
"""
import asyncio, base64, io, os, sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter
from playwright.async_api import async_playwright

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SVG = open(os.path.join(REPO, 'src', 'icon.svg'), encoding='utf-8').read()
RES = os.path.join(REPO, 'android', 'res')
DENS = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}
BIG = 1296  # 108 x 12, Arbeitsauflösung

PAGE = """<!doctype html><html><head><style>html,body{margin:0;background:transparent}svg{display:block;width:%dpx;height:%dpx}
.hide{display:none}.only *{visibility:hidden}.only .show,.only .show *{visibility:visible}</style></head><body>%s</body></html>"""


async def shots():
    """renders the layers at BIG px: back, fore, and alpha masks for the monochrome layer"""
    out = {}
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': BIG, 'height': BIG})
        await pg.set_content(PAGE % (BIG, BIG, SVG))

        async def snap(js, arg=None):
            await pg.evaluate(js, arg)
            return Image.open(io.BytesIO(await pg.screenshot(omit_background=True))).convert('RGBA')
        reset = "()=>{const s=document.querySelector('svg');s.classList.remove('only');for(const e of s.querySelectorAll('.hide,.show'))e.classList.remove('hide','show')}"
        await pg.evaluate(reset)
        out['full'] = await snap("()=>{}")
        out['back'] = await snap("()=>{document.querySelector('#hgFore').classList.add('hide')}")
        await pg.evaluate(reset)
        out['fore'] = await snap("()=>{document.querySelector('#hgBack').classList.add('hide')}")
        # parts for the monochrome layer (drawing order), each as alpha
        parts = [('rack', '#hgRack,#hgHooks'), ('legs', '#hgLegs'), ('body', '#hgUpper > path, #hgUpper > rect, #hgUpper > g[id^=hgArm], #hgUpper > use'),
                 ('bar', '#hgBar'), ('head', '#hgUpper > path:nth-last-of-type(-n+3), #hgHead'), ('hands', '#hgHands'), ('cut', '.hgCut')]
        only = "(sel)=>{const s=document.querySelector('svg');document.querySelector('#hgBack').classList.add('hide');s.classList.add('only');for(const e of s.querySelectorAll(sel))e.classList.add('show')}"
        for name, sel in parts:
            await pg.evaluate(reset)
            out['m_' + name] = (await snap(only, sel)).split()[3]
        await b.close()
    return out


def mono(o):
    """white silhouette: parts stacked, every part cuts a thin gap into what lies behind it, face details cut out"""
    gap = max(3, BIG // 220)
    m = Image.new('L', (BIG, BIG), 0)
    for k in ('rack', 'legs', 'body', 'bar', 'head', 'hands'):
        a = o['m_' + k].point(lambda v: 255 if v > 110 else 0)
        halo = a.filter(ImageFilter.MaxFilter(2 * gap + 1))
        m = ImageChops.subtract(m, halo)
        m = ImageChops.lighter(m, a)
    cut = o['m_cut'].point(lambda v: 255 if v > 90 else 0).filter(ImageFilter.MaxFilter(3))
    m = ImageChops.subtract(m, cut)
    m = m.filter(ImageFilter.GaussianBlur(1.2))
    img = Image.new('RGBA', (BIG, BIG), (255, 255, 255, 0))
    img.putalpha(m)
    return img


def shape_mask(size, kind):
    """anti-aliased mask (4x supersampled): circle, squircle (superellipse n=5) or rounded square"""
    S = size * 4
    im = Image.new('L', (S, S), 0)
    d = ImageDraw.Draw(im)
    if kind == 'circle':
        d.ellipse((0, 0, S - 1, S - 1), fill=255)
    elif kind == 'rounded':
        d.rounded_rectangle((0, 0, S - 1, S - 1), radius=int(S * .22), fill=255)
    else:
        n = 5.0; r = (S - 1) / 2; pts = []
        import math
        for i in range(720):
            t = 2 * math.pi * i / 720; c, s = math.cos(t), math.sin(t)
            pts.append((r + r * math.copysign(abs(c) ** (2 / n), c), r + r * math.copysign(abs(s) ** (2 / n), s)))
        d.polygon(pts, fill=255)
    return im.resize((size, size), Image.LANCZOS)


def adaptive(o, size, kind):
    """what a launcher shows: background + foreground, central 72 of 108 dp, cut to the mask shape"""
    comp = Image.alpha_composite(o['back'], o['fore'])
    c = BIG * 18 // 108
    comp = comp.crop((c, c, BIG - c, BIG - c)).resize((size, size), Image.LANCZOS)
    comp.putalpha(ImageChops.multiply(comp.split()[3], shape_mask(size, kind)))
    return comp


def legacy(o, size):
    """Android 7: full composition (central 80 dp, a bit larger), rounded square"""
    comp = Image.alpha_composite(o['back'], o['fore'])
    c = BIG * 14 // 108
    comp = comp.crop((c, c, BIG - c, BIG - c)).resize((size, size), Image.LANCZOS)
    comp.putalpha(ImageChops.multiply(comp.split()[3], shape_mask(size, 'rounded')))
    return comp


def write_res(o):
    mo = mono(o)
    for d, f in DENS.items():
        dd = os.path.join(RES, 'mipmap-' + d); os.makedirs(dd, exist_ok=True)
        n = round(108 * f)
        for name, img in (('foreground', o['fore']), ('background', o['back']), ('monochrome', mo)):
            img.resize((n, n), Image.LANCZOS).save(os.path.join(dd, f'ic_launcher_{name}.png'), optimize=True)
        legacy(o, round(48 * f)).save(os.path.join(dd, 'ic_launcher.png'), optimize=True)
    v26 = os.path.join(RES, 'mipmap-anydpi-v26'); os.makedirs(v26, exist_ok=True)
    open(os.path.join(v26, 'ic_launcher.xml'), 'w', encoding='utf-8').write(
        '<?xml version="1.0" encoding="utf-8"?>\n<!-- Homegym App-Icon @ Joschy -->\n'
        '<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">\n'
        '    <background android:drawable="@mipmap/ic_launcher_background"/>\n'
        '    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>\n'
        '    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>\n'
        '</adaptive-icon>\n')
    return mo


def preview(o, mo, path):
    W, H = 1500, 640
    bg = Image.new('RGBA', (W, H), (14, 16, 20, 255))
    d = ImageDraw.Draw(bg)
    try:
        from PIL import ImageFont
        fnt = ImageFont.truetype('DejaVuSans.ttf', 18)
    except Exception:
        fnt = None
    items = [('rounded', 420, 'groß'), ('circle', 260, 'rund'), ('squircle', 260, 'Squircle')]
    x = 40
    for kind, s, _ in items:
        img = adaptive(o, s, kind); bg.alpha_composite(img, (x, (H - s) // 2 - 10)); x += s + 50
    i48 = adaptive(o, 48, 'squircle'); bg.alpha_composite(i48, (x, H // 2 - 70))
    bg.alpha_composite(adaptive(o, 48, 'circle'), (x + 64, H // 2 - 70))
    bg.alpha_composite(i48.resize((144, 144), Image.NEAREST), (x, H // 2))
    # monochrome (Android 13 themed, tinted) small
    t = adaptive({'back': Image.new('RGBA', (BIG, BIG), (32, 52, 44, 255)), 'fore': Image.composite(Image.new('RGBA', (BIG, BIG), (190, 236, 210, 255)), Image.new('RGBA', (BIG, BIG), (0, 0, 0, 0)), mo.split()[3])}, 96, 'circle')
    bg.alpha_composite(t, (x + 150, H // 2 - 70 - 24))
    for (lx, txt) in ((40, 'groß (eckige Maske)'), (510, 'rund'), (820, 'Squircle'), (x, '48 px · Monochrom')):
        d.text((lx, H - 40), txt, fill=(170, 176, 186, 255), font=fnt)
    d.text((40, 16), 'Homegym App-Icon @ Joschy', fill=(200, 206, 214, 255), font=fnt)
    bg.convert('RGB').save(path)


if __name__ == '__main__':
    o = asyncio.run(shots())
    mo = write_res(o)
    if len(sys.argv) > 1:
        preview(o, mo, sys.argv[1])
    print('Icons geschrieben nach', RES)
