import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/ar/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const out = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const bad = [];
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    // بالعربي الفائض بيطلع من اليسار، وبالإنجليزي من اليمين
    const over = Math.max(r.right - vw, -r.left);
    if (over > 2) {
      bad.push({
        tag: el.tagName,
        cls: (el.className || '').toString().slice(0, 40),
        overBy: Math.round(over),
        w: Math.round(r.width),
      });
    }
  });
  return { vw, scrollWidth: document.documentElement.scrollWidth, count: bad.length, top: bad.slice(0, 12) };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
