import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/ar/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const out = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  let worst = null;
  document.querySelectorAll('*').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    const over = Math.max(r.right - vw, -r.left);
    if (over > 2 && (!worst || over > worst.over)) {
      // نطلع سلسلة الآباء عشان نعرف مين السيكشن المسؤول
      const chain = [];
      let n = el;
      while (n && n !== document.body) {
        chain.push(n.tagName + (n.className ? '.' + n.className.toString().split(' ')[0] : '') + (n.id ? '#' + n.id : ''));
        n = n.parentElement;
      }
      worst = { over: Math.round(over), chain: chain.slice(0, 7), overflowX: getComputedStyle(el).overflowX };
    }
  });
  return { vw, scrollWidth: document.documentElement.scrollWidth, worst,
    bodyOverflowX: getComputedStyle(document.body).overflowX };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
