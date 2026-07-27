// فحص المؤشّر المخصّص بماوس حقيقي
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:4321/ar/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

const read = () =>
  page.evaluate(() => {
    const r = document.documentElement;
    const dot = document.querySelector('[data-cursor-dot]');
    const ring = document.querySelector('[data-cursor-ring]');
    return {
      on: r.hasAttribute('data-cursor-on'),
      hot: r.hasAttribute('data-cursor-hot'),
      dotT: dot?.style.transform || '',
      ringT: ring?.style.transform || '',
      ringSize: ring ? getComputedStyle(ring).width : null,
      dotSize: dot ? getComputedStyle(dot).width : null,
      bodyCursor: getComputedStyle(document.body).cursor,
    };
  });

// ١) نحرّك الماوس لمكان فاضي
await page.mouse.move(200, 700);
await page.waitForTimeout(600);
const idle = await read();

// ٢) نمرّر على زر
const btn = page.locator('.btn').first();
const box = await btn.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.waitForTimeout(700);
const overBtn = await read();
await page.screenshot({ path: '_check/out/cursor-hover.png' });

// ٣) نضغط
await page.mouse.down();
await page.waitForTimeout(250);
const down = await page.evaluate(() => document.documentElement.hasAttribute('data-cursor-down'));
await page.mouse.up();

console.log('idle      :', JSON.stringify(idle));
console.log('over btn  :', JSON.stringify(overBtn));
console.log('mousedown :', down);
console.log('ring grew :', parseFloat(overBtn.ringSize) > parseFloat(idle.ringSize));
console.log('dot grew  :', parseFloat(overBtn.dotSize) > parseFloat(idle.dotSize));
console.log('follows   :', idle.dotT !== overBtn.dotT);
console.log('errors    :', errors.length);

await browser.close();
