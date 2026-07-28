import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const loaded = [];
p.on('response', r => { if (/KnotStage/.test(r.url())) loaded.push('نزّل KnotStage'); });
p.on('pageerror', e => console.log('ERR', e.message.slice(0,90)));
await p.goto('http://localhost:4331/ar/', { waitUntil:'networkidle' });
await p.evaluate(() => { const el=document.querySelector('#knot'); const y=el.getBoundingClientRect().top+scrollY-80; window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y); });
await p.waitForTimeout(2500);
console.log('قبل الضغط: three.js نزّل؟', loaded.length ? '✗ نزّل' : '✓ لأ');
console.log('زر التشغيل ظاهر:', await p.locator('.knot3d-play').count() === 1 ? '✓' : '✗');

await p.locator('.knot3d-play').click();
await p.waitForTimeout(4000);
console.log('بعد الضغط: three.js نزّل؟', loaded.length ? '✓ آه' : '✗ لأ');
console.log('الكانفس ظهر:', await p.locator('.knot3d-stage canvas').count() === 1 ? '✓' : '✗');

// جرّب تلعب
const box = await p.locator('.knot3d-stage').boundingBox();
const cx = box.x + box.width/2, cy = box.y + box.height/2;
await p.mouse.move(cx, cy); await p.mouse.down();
for (let i=0;i<40;i++) await p.mouse.move(cx + Math.sin(i/2)*200, cy + Math.cos(i/3)*140);
await p.mouse.up();
await p.waitForTimeout(2000);
console.log('المقياس تحرّك:', await p.locator('.knot3d-meter b').textContent());
await p.screenshot({ path: '_check/out/knot-play.png' });
await b.close();
