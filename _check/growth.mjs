import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport:{width:1440,height:900} });
p.on('pageerror', e => console.log('ERR', e.message.slice(0,90)));
await p.goto('http://localhost:4335/ar/', { waitUntil:'networkidle' });
await p.waitForTimeout(2500);
await p.evaluate(() => { const el=document.querySelector('#growth'); const y=el.getBoundingClientRect().top+scrollY-120; window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y); });
await p.waitForTimeout(1800);
const links = await p.evaluate(() => [...document.querySelectorAll('#growth .row .go')].map(a => a.getAttribute('href')));
console.log('روابط القصص:', links);
// اضغط على أول بطاقة (على الصورة مش على النص)
const img = await p.locator('#growth .row .media img').first().boundingBox();
await p.mouse.click(img.x + img.width/2, img.y + img.height/2);
await p.waitForTimeout(2500);
console.log('بعد الضغط على الصورة →', new URL(p.url()).pathname);
await p.screenshot({ path:'_check/out/growth-click.png' });
await b.close();
