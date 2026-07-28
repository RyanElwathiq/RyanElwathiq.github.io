import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', e => console.log('PAGEERROR', e.message.slice(0,100)));
await p.goto('http://localhost:4331/ar/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.evaluate(() => { const el=document.querySelector('#lab'); const y=el.getBoundingClientRect().top+scrollY; window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y); });
await p.waitForTimeout(1800);
await p.screenshot({ path: '_check/out/lamp-off.png' });

// اسحب الحبل يمين وشمال ثم لتحت
const box = await p.locator('[data-cord]').boundingBox();
if (!box) { console.log('ما لقيت اللمبة'); } else {
  const cx = box.x + box.width/2, cy = box.y + box.height/2;
  await p.mouse.move(cx, cy); await p.mouse.down();
  for (let i=0;i<12;i++) await p.mouse.move(cx + 90*Math.sin(i/2), cy + i*3);
  await p.screenshot({ path: '_check/out/lamp-swing.png' });
  await p.mouse.move(cx, cy + 70);
  await p.mouse.up();
  await p.waitForTimeout(1400);
  await p.screenshot({ path: '_check/out/lamp-on.png' });
  const lit = await p.evaluate(() => document.querySelector('[data-lab]').hasAttribute('data-lit'));
  const armT = await p.evaluate(() => getComputedStyle(document.querySelector('[data-arm]')).transform);
  console.log('اضاءت =', lit, '| transform الذراع =', armT.slice(0,40));
}
await b.close();
