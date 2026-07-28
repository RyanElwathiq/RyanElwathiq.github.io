// فحص الموقع الحقيقي بعد النشر
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const errs = [];

for (const [path, sel] of [
  ['/ar/', '#l-ind'],
  ['/', '#l-site'],
]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', (e) => errs.push(path + ' ' + e.message));
  p.on('console', (m) => m.type() === 'error' && errs.push(path + ' ' + m.text()));
  await p.goto('https://ryanalali.me' + path, { waitUntil: 'networkidle' });

  const mark = await p.locator('[data-mark="loss"]').count();
  await p.evaluate((s) => {
    const y = document.querySelector(s).getBoundingClientRect().top + scrollY - 200;
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
  }, sel);
  await p.waitForTimeout(2200);

  const before = await p.locator('.loss-big span').first().textContent();
  await p.locator(sel).click();
  await p.waitForTimeout(600);
  const n = await p.locator('.sel-list [role="option"]').count();
  await p.locator('.sel-list [role="option"]').nth(n - 1).click();
  await p.waitForTimeout(1100);
  const after = await p.locator('.loss-big span').first().textContent();

  console.log(`${path}: mark=${mark} options=${n} | ${before} -> ${after} ${before !== after ? '✓' : '✗'}`);
  await p.close();
}

console.log('errors:', errs.length ? errs : 'none');
await b.close();
