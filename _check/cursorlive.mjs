// الدائرة اللي بتلحق الماوس — بتختفي بعد التنقّل؟
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });

const state = async (tag) => {
  const r = await p.evaluate(() => {
    const root = document.documentElement;
    const dot = document.querySelector('[data-cursor-dot]');
    const wrap = document.querySelector('[data-cursor]');
    return {
      attr: root.hasAttribute('data-cursor-on'),
      wrapExists: !!wrap,
      display: wrap ? getComputedStyle(wrap).display : 'ما في',
      dotMoves: dot ? getComputedStyle(dot).transform : 'ما في',
      ready: !!window.__cursorReady,
      htmlAttrs: [...root.attributes].map((a) => a.name).join(','),
    };
  });
  const visible = r.attr && r.display !== 'none';
  console.log(
    `${tag.padEnd(30)} data-cursor-on=${String(r.attr).padEnd(5)} display=${String(r.display).padEnd(6)}` +
      ` ready=${r.ready}  ${visible ? '✓ باينة' : '✗ مختفية'}`
  );
  return visible;
};

await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
await p.mouse.move(700, 400);
await p.waitForTimeout(1500);
await state('1. تحميل مباشر');

// تنقّل بالضغط على رابط (ClientRouter — بدون إعادة تحميل)
await p.locator('.pill a[href*="signals"]').first().click();
await p.waitForTimeout(2200);
await p.mouse.move(720, 420);
await p.waitForTimeout(400);
await state('2. بعد الانتقال لإشارات');

await p.locator('.pill .brand').click();
await p.waitForTimeout(2500);
await p.mouse.move(690, 380);
await p.waitForTimeout(400);
await state('3. بعد الرجوع للرئيسية');

await p.reload({ waitUntil: 'networkidle' });
await p.mouse.move(700, 400);
await p.waitForTimeout(1500);
await state('4. بعد ريفرش');

await b.close();
