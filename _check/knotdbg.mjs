import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', e => console.log('PAGEERROR:', e.message.slice(0,150)));
p.on('console', m => { if(m.type()==='error') console.log('CONSOLE:', m.text().slice(0,150)); });
p.on('requestfailed', r => { if(/Knot/.test(r.url())) console.log('REQ FAIL:', r.url().split('/').pop(), r.failure()?.errorText); });
await p.goto('http://localhost:4331/ar/', { waitUntil:'networkidle' });
await p.evaluate(() => { const el=document.querySelector('#knot'); const y=el.getBoundingClientRect().top+scrollY-80; window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y); });
await p.waitForTimeout(2000);
await p.locator('.knot3d-play').click();
await p.waitForTimeout(3500);
console.log(JSON.stringify(await p.evaluate(() => ({
  play: document.querySelectorAll('.knot3d-play').length,
  loading: document.querySelectorAll('.knot3d-loading').length,
  canvas: document.querySelectorAll('.knot3d-stage canvas').length,
  stageHTML: document.querySelector('.knot3d-stage')?.innerHTML.slice(0,180),
}))));
await b.close();
