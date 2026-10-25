import os as _os
_REPO=_os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
_OUTDIR=_os.environ.get('HOMEGYM_OUT',_os.path.join(_REPO,'out'))
_SHOTS=_os.environ.get('HOMEGYM_SHOTS','/tmp/homegym-shots/');_os.makedirs(_SHOTS,exist_ok=True)
import asyncio,sys
from playwright.async_api import async_playwright
U='file://'+(sys.argv[1] if len(sys.argv)>1 else _os.path.join(_OUTDIR,'index.html'));OUT=_SHOTS
async def run(pg):
    await pg.click('#startBtn');await pg.wait_for_timeout(300)
    if await pg.is_visible('#wSkipAll'): await pg.click('#wSkipAll');await pg.wait_for_timeout(300)
    for _ in range(200):
        if await pg.is_visible('#saveS'): break
        if await pg.is_visible('#rs'): await pg.click('#rs'); continue
        await pg.click('#doneSet'); await pg.wait_for_timeout(15)
    await pg.click('#saveS');await pg.wait_for_timeout(200);return await pg.evaluate("S.history.length")
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch();errs=[]
        for name,gear,shot in [('Joschy',None,'g17_onb_joschy.png'),('Lena',['kb','rings','box','rope','mball','abwheel'],'g17_onb_lena.png'),('Tom',['cable','bench','ez','dip','bike','gymball','legmach'],None)]:
            ctx=await b.new_context(device_scale_factor=2);pg=await ctx.new_page();await pg.set_viewport_size({'width':390,'height':844})
            pg.on('pageerror',lambda e: errs.append(str(e)));pg.on('console',lambda m: errs.append(m.text) if m.type=='error' else None)
            await pg.goto(U);await pg.wait_for_timeout(300)
            await pg.fill('#onbName',name);await pg.click('#onbGo');await pg.wait_for_timeout(200)
            if gear:
                for g in gear: await pg.click(f'[data-ogear="{g}"]')
            sel=await pg.evaluate("[...document.querySelectorAll('[data-ogear][aria-pressed=true]')].map(b=>b.dataset.ogear)")
            chips=await pg.evaluate("[...document.querySelectorAll('[data-opreset][aria-pressed=true]')].map(b=>b.dataset.opreset)")
            groups=await pg.evaluate("[...document.querySelectorAll('#onbInner .label')].map(x=>x.textContent)")
            if shot: await pg.screenshot(path=OUT+shot,full_page=True)
            print(name,'selected',len(sel),'chips',chips,'groups',groups)
            await pg.click('#onbFin');await pg.wait_for_timeout(300)
            items=await pg.evaluate("planItems(nextDay()||'A',false).map(x=>x.ex+(x.adapted?'*':''))")
            print('  today',items)
            print('  saved trainings',await run(pg))
            if name=='Tom':
                await pg.click('[data-tab=set]');await pg.wait_for_timeout(300);await pg.screenshot(path=OUT+'g17_settings.png',full_page=True)
                await pg.click('[data-tab=lib]');await pg.wait_for_timeout(600);await pg.screenshot(path=OUT+'g17_lib.png')
                grey=await pg.evaluate("[...document.querySelectorAll('.libitem')].length")
                print('  lib items',grey)
            await ctx.close()
        print('errors',errs)
        await b.close()
asyncio.run(main())
