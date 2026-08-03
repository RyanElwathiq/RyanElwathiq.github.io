// فحص «ارسم عميلك» جوّا مقالة #61-٦ — عربي وإنجليزي
//   node _check/pbcheck.mjs [رابط]
//  بيمر بالفخ (الاستهداف) وببني البيرسونا كاملة ويتأكد من المقارنة
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.argv[2] || 'http://localhost:4330';
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));

let fail = 0;
const check = (ok, msg) => {
  if (!ok) fail++;
  console.log(`  ${ok ? '✅' : '❌'} ${msg}`);
};

const PAGES = ['/ar/signals/ar-min-3amilak/', '/signals/en-who-is-your-customer/'];

for (const path of PAGES) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const board = page.locator('[data-persona]');
  await board.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  check((await board.count()) === 1, 'اللعبة موجودة بالمقال');

  // ١) الفخ: غيّر اختيار العمر واعتمد
  await board.locator('[data-pb-group="0"] [data-pb-pill]').nth(1).click();
  await board.locator('[data-pb-adopt]').click();
  await page.waitForTimeout(300);
  check(!(await board.locator('[data-pb-trap]').isHidden()), 'رسالة الفخ ظهرت بعد الاعتماد');

  // ٢) البناء: جاوب الخمس أسئلة (ثاني خيار دايماً)
  await board.locator('[data-pb-tobuild]').click();
  for (let q = 0; q < 5; q++) {
    await page.waitForTimeout(300);
    await board.locator('.pb-opt').nth(1).click();
  }
  await page.waitForTimeout(1000);

  // ٣) النهاية: المقارنة
  check(!(await board.locator('[data-pb-end]').isHidden()), 'شاشة المقارنة ظهرت بعد الأسئلة الخمسة');
  const oldT = (await board.locator('[data-pb-oldtext]').textContent())?.trim() || '';
  const newT = (await board.locator('[data-pb-newtext]').textContent())?.trim() || '';
  console.log(`     الاستهداف: ${oldT}`);
  console.log(`     البيرسونا: ${newT.slice(0, 90)}...`);
  check(oldT.length > 5 && oldT.split('·').length === 3, 'بطاقة الاستهداف اتركبت من الخيارات الثلاثة');
  check(newT.length > 80 && !newT.includes('{'), 'جملة البيرسونا اتركبت كاملة بلا فتحات قالب');

  // ٤) الإعادة بترجع للبداية
  await board.locator('[data-pb-again]').click();
  await page.waitForTimeout(300);
  check(!(await board.locator('[data-pb-demo]').isHidden()), 'الإعادة رجّعت لجزء الاستهداف');
}

// لقطات (عربي): البناء + المقارنة
await page.goto(BASE + PAGES[0], { waitUntil: 'networkidle' });
const board = page.locator('[data-persona]');
await board.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await board.locator('[data-pb-adopt]').click();
await page.waitForTimeout(300);
await board.locator('[data-pb-tobuild]').click();
for (let q = 0; q < 3; q++) {
  await page.waitForTimeout(300);
  await board.locator('.pb-opt').first().click();
}
await page.waitForTimeout(500);
await board.screenshot({ path: '_check/out/d66-build.png' });
for (let q = 0; q < 2; q++) {
  await page.waitForTimeout(300);
  await board.locator('.pb-opt').first().click();
}
await page.waitForTimeout(1100);
await board.screenshot({ path: '_check/out/d66-end.png' });

// موبايل
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(BASE + PAGES[0], { waitUntil: 'networkidle' });
const mb = m.locator('[data-persona]');
await mb.scrollIntoViewIfNeeded();
await m.waitForTimeout(600);
await mb.screenshot({ path: '_check/out/d66-mobile.png' });
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `ولا تمرير أفقي عالموبايل (${overflow}px)`);
await m.close();

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ ارسم عميلك سليمة بالعربي والإنجليزي');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
