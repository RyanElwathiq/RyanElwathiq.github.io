import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1100 } });
p.on('pageerror', e => console.log('ERR', e.message.slice(0,90)));
await p.goto('http://localhost:4333/ar/work/orient/', { waitUntil:'networkidle' });
await p.waitForTimeout(2000);
const r = await p.evaluate(() => ({
  blocks: [...document.querySelectorAll('.story .block')].map(b => ({ h: b.querySelector('h2')?.textContent, len: b.querySelector('p')?.textContent.length })),
  empty: document.querySelectorAll('.empty').length,
}));
console.log(JSON.stringify(r, null, 1));
await p.evaluate(() => { const el=document.querySelector('.story'); if(el){const y=el.getBoundingClientRect().top+scrollY-90; window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y);} });
await p.waitForTimeout(1800);
await p.screenshot({ path:'_check/out/story-orient.png' });
await b.close();
