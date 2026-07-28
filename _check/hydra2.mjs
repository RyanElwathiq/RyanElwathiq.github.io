import { chromium, devices } from '@playwright/test';
const b = await chromium.launch();
const BASE = process.argv[2] || 'https://ryanalali.me';
for (const path of ['/', '/ar/']) {
  const ctx = await b.newContext({ ...devices['Pixel 5'] });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message.slice(0,120)));
  p.on('console', m => m.type()==='error' && errs.push('CONSOLE ' + m.text().slice(0,120)));
  await p.goto(BASE + path, { waitUntil:'networkidle', timeout:120000 });
  await p.waitForTimeout(2500);
  // انزل على قسم الخسارة زي ما بيعمل الزائر
  await p.evaluate(() => {
    const el = document.querySelector('#loss');
    if (el) { const y = el.getBoundingClientRect().top + scrollY - 60; window.__lenis ? window.__lenis.scrollTo(y,{immediate:true}) : scrollTo(0,y); }
  });
  await p.waitForTimeout(3500);
  const st = await p.evaluate(() => {
    const isl = [...document.querySelectorAll('astro-island')];
    const loss = document.querySelector('#loss astro-island');
    const r = loss ? loss.getBoundingClientRect() : null;
    return {
      islands: isl.length,
      hydrated: isl.filter(i => !i.hasAttribute('ssr')).length,
      lossIsland: !!loss,
      lossHydrated: loss ? !loss.hasAttribute('ssr') : null,
      lossClient: loss ? loss.getAttribute('client') : null,
      lossRect: r ? `${Math.round(r.width)}x${Math.round(r.height)} @top ${Math.round(r.top)}` : null,
      number: document.querySelector('#loss .loss-big span')?.textContent,
    };
  });
  console.log(path, JSON.stringify(st));
  const n0 = await p.locator('#loss .loss-big span').first().textContent().catch(()=>null);
  await p.locator('#l-ind').tap().catch(e => console.log('  tap fail:', e.message.split('\n')[0]));
  await p.waitForTimeout(900);
  console.log('  قائمة مفتوحة:', await p.locator('.sel-list').count(), '| الرقم:', n0);
  console.log('  أخطاء:', errs.length ? errs.slice(0,4) : 'ولا واحد');
  await ctx.close();
}
await b.close();
