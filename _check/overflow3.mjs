import { chromium } from '@playwright/test';
const browser = await chromium.launch();
for (const [w,h,label] of [[1440,900,'ديسكتوب'],[390,844,'موبايل']]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto('http://localhost:4321/ar/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const r = await page.evaluate(async () => {
    const before = window.scrollX;
    window.scrollTo(500, window.scrollY);          // نحاول نمرّر أفقياً
    await new Promise(r=>setTimeout(r,250));
    const after = window.scrollX;
    window.scrollTo(0, window.scrollY);
    return { canScrollX: after !== before, movedTo: after,
      docScrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      bodyScrollW: document.body.scrollWidth };
  });
  console.log(label, JSON.stringify(r));
  await page.close();
}
await browser.close();
