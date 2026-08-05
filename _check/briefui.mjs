// فحص سريع لواجهة فورم البريف الحية: تعبئة الخطوة الأولى والتقدم
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('https://ryanalali.me/ar/brief/', { waitUntil: 'load' });
await p.waitForTimeout(2500);
const step1 = await p.evaluate(() => document.body.innerText.slice(0, 300));
const inputs = await p.locator('.brief input:visible, .brief textarea:visible, section input:visible').count();
const nextBtn = p.locator('button:has-text("التالي")').first();
const hasNext = await nextBtn.count();
let advanced = false;
if (hasNext) {
  const before = await p.evaluate(() => document.body.innerText.length);
  const vis = p.locator('input:visible, textarea:visible');
  const n = await vis.count();
  for (let i = 0; i < n; i++) await vis.nth(i).fill('تجربة');
  await nextBtn.click();
  await p.waitForTimeout(900);
  const after = await p.evaluate(() => document.body.innerText.length);
  advanced = after !== before;
}
console.log(JSON.stringify({ inputs, hasNext: !!hasNext, advanced }));
await b.close();
