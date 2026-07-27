// لقطة لقسم معيّن: node _check/section.mjs <url> <selector> <name> [w] [h]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const [, , url, sel, name, w = '1440', h = '900'] = process.argv;
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2 });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(900);

// ننزل للقسم بهدوء عشان الحركات تشتغل طبيعي
await page.evaluate((s) => {
  const el = document.querySelector(s);
  const y = el.getBoundingClientRect().top + window.scrollY - 100;
  window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y);
}, sel);
await page.waitForTimeout(2500);

await page.screenshot({ path: `_check/out/${name}.png` });
console.log(`SHOT: _check/out/${name}.png  | errors: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
await browser.close();
