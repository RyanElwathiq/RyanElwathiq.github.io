import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
p.on('pageerror', e => console.log('ERR', e.message.slice(0,80)));
for (const [path,name] of [['/ar/work/orient/','orient'],['/ar/work/dr-samir/','samir']]) {
  await p.goto('http://localhost:4331'+path, { waitUntil:'networkidle' });
  await p.waitForTimeout(2000);
  const r = await p.evaluate(() => ({
    shots: document.querySelectorAll('.shot img').length,
    films: document.querySelectorAll('.film iframe').length,
    broken: [...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).length,
  }));
  console.log(name, JSON.stringify(r));
  await p.evaluate(() => { const el=document.querySelector('.shots'); if(el){const y=el.getBoundingClientRect().top+scrollY-100; window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y);} });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `_check/out/proj-${name}.png` });
}
await b.close();
