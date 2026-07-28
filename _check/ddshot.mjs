import { chromium } from '@playwright/test';
const b = await chromium.launch();

const go = async (path, sel, name, vw) => {
  const p = await b.newPage({ viewport: vw });
  await p.goto('http://localhost:4331' + path, { waitUntil: 'networkidle' });
  await p.evaluate((s) => {
    const el = document.querySelector(s);
    const y = el.getBoundingClientRect().top + scrollY - 200;
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, sel);
  await p.waitForTimeout(1800);
  await p.locator(sel).click();
  await p.waitForTimeout(700);
  await p.screenshot({ path: `_check/out/${name}.png` });
  await p.close();
};

await go('/ar/', '#l-ind', 'open-ar-home', { width: 1440, height: 900 });
await go('/ar/', '#l-ind', 'open-ar-mobile', { width: 390, height: 844 });
await go('/', '#l-site', 'open-en-home', { width: 1440, height: 900 });

// القسم كامل بالصفحة الرئيسية بدون فتح القائمة
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4331/ar/', { waitUntil: 'networkidle' });
await p.evaluate(() => {
  const y = document.querySelector('#loss').getBoundingClientRect().top + scrollY;
  window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y);
});
await p.waitForTimeout(2000);
await p.screenshot({ path: '_check/out/home-loss.png' });
await p.close();

await b.close();
console.log('done');
