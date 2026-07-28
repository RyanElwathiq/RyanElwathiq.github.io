// نص الهيرو بيرفرف وقت التحميل؟ منراقب شفافيته أول ٣ ثواني
import { chromium, devices } from '@playwright/test';
const b = await chromium.launch();
for (const [name, ctxOpts] of [['ديسكتوب', { viewport:{width:1440,height:900} }], ['موبايل', devices['Pixel 5']]]) {
  const ctx = await b.newContext(ctxOpts);
  const p = await ctx.newPage();
  await p.addInitScript(() => {
    window.__op = [];
    const tick = () => {
      const el = document.querySelector('[data-seq-intro]');
      if (el) window.__op.push(+getComputedStyle(el).opacity);
      requestAnimationFrame(tick);
    };
    document.addEventListener('DOMContentLoaded', tick);
  });
  await p.goto('http://localhost:4331/ar/', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(3000);
  const ops = await p.evaluate(() => window.__op);
  // كم مرة نزلت الشفافية تحت ٠.٩ ورجعت؟
  let dips = 0, low = false;
  for (const o of ops) { if (o < 0.9 && !low) { low = true; dips++; } if (o > 0.98) low = false; }
  console.log(`${name.padEnd(9)} عيّنات=${ops.length} أقل شفافية=${Math.min(...ops).toFixed(2)} | رفرفات=${dips} ${dips === 0 ? '✓ ثابت' : '✗ بيرفرف'}`);
  await ctx.close();
}
await b.close();
