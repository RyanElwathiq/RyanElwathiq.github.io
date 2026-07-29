import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', e => console.log('ERR', e.message.slice(0,90)));
await p.goto('http://localhost:4332/ar/work/orient/', { waitUntil:'networkidle' });
await p.waitForTimeout(2000);
await p.locator('[data-play]').first().click();
await p.waitForTimeout(1500);
const r = await p.evaluate(() => {
  const d = document.querySelector('[data-lightbox]');
  if (!d || !d.open) return { open:false };
  const b = d.getBoundingClientRect();
  return {
    open: true,
    rect: `${Math.round(b.left)},${Math.round(b.top)} ${Math.round(b.width)}×${Math.round(b.height)}`,
    cx: Math.round(b.left + b.width/2), cy: Math.round(b.top + b.height/2),
    vw: innerWidth, vh: innerHeight,
    margin: getComputedStyle(d).margin,
  };
});
const okX = Math.abs(r.cx - r.vw/2) < 20, okY = Math.abs(r.cy - r.vh/2) < 20;
console.log(`الفيديو: ${r.rect}  مركزه(${r.cx},${r.cy}) مركز الشاشة(${r.vw/2},${r.vh/2})`);
console.log(`متوسّط أفقياً: ${okX?'✓':'✗'}  عمودياً: ${okY?'✓':'✗'}  | margin=${r.margin}`);
await p.screenshot({ path:'_check/out/lightbox.png' });
await b.close();
