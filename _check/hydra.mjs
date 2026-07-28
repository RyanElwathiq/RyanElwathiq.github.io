import { chromium, devices } from '@playwright/test';
const b = await chromium.launch();
const BASE = process.argv[2] || 'https://ryanalali.me';
for (const dev of ['Pixel 5', 'iPhone 12']) {
  const ctx = await b.newContext({ ...devices[dev] });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => m.type()==='error' && errs.push('CONSOLE ' + m.text()));
  p.on('response', r => r.status()>=400 && errs.push(r.status()+' '+r.url().split('/').pop()));
  await p.goto(BASE + '/ar/loss/', { waitUntil:'networkidle', timeout:120000 });
  await p.waitForTimeout(3500);
  const st = await p.evaluate(() => {
    const isl = [...document.querySelectorAll('astro-island')];
    return {
      islands: isl.length,
      hydrated: isl.filter(i => !i.hasAttribute('ssr')).length,
      clientAttrs: isl.map(i => i.getAttribute('client')),
      number: document.querySelector('.loss-big span')?.textContent,
      bootPresent: !!document.getElementById('boot'),
      bootVis: document.getElementById('boot') ? getComputedStyle(document.getElementById('boot')).visibility : '-',
      selBtn: !!document.querySelector('#l-ind'),
    };
  });
  console.log(dev, JSON.stringify(st));
  // جرّب تضغط
  await p.locator('#l-ind').tap().catch(e => console.log('  tap fail', e.message.split('\n')[0]));
  await p.waitForTimeout(900);
  console.log('  قائمة مفتوحة:', await p.locator('.sel-list').count());
  console.log('  أخطاء:', errs.length ? errs.slice(0,5) : 'ولا واحد');
  await ctx.close();
}
await b.close();
