// ═══════════════════════════════════════════════════════════════
//  أداة فحص بصري بـ Playwright — متصفح حقيقي
//
//  ليش مهمة: أدوات الفحص السابقة كانت بمتصفح بدون شاشة، يعني
//  الحركات (rAF) موقوفة والمراقبة (IntersectionObserver) ما
//  بتشتغل — فكنت أقيس الأرقام بدل ما أشوف. هاي بتشوف فعلاً.
//
//  التشغيل:
//    node _check/shot.mjs <رابط> <اسم-اللقطة> [عرض] [ارتفاع] [نزول]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const [, , url = 'http://localhost:4321/ar/', name = 'shot', w = '1440', h = '900', scrollTo = '0'] =
  process.argv;

mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: +w, height: +h },
  deviceScaleFactor: 2,
});

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

if (+scrollTo > 0) {
  await page.evaluate((y) => window.__lenis?.scrollTo(y, { immediate: true }) ?? scrollTo(0, y), +scrollTo);
  await page.waitForTimeout(1400);
}

await page.screenshot({ path: `_check/out/${name}.png` });

console.log(`SHOT: _check/out/${name}.png`);
console.log(`errors: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));

await browser.close();
