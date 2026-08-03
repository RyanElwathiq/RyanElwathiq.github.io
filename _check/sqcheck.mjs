// فحص «معادلة البيع» جوّا مقالة #61-٢ — عربي وإنجليزي
//   node _check/sqcheck.mjs [رابط]
//  بيفحص: القمع بيتحدث مع السلايدرز · الوضعيتين الجاهزتين ·
//  الختمين المتناقضين · أضعف حلقة · صفر أخطاء كونسول
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

const PAGES = [
  ['/ar/signals/ar-daman-almabi3at/', 'الإعلان بريء', 'منظومة بتبيع'],
  ['/signals/en-sales-guarantee/', 'The ad is innocent', 'A system that sells'],
];

for (const [path, lowStamp, highStamp] of PAGES) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const board = page.locator('[data-sales-eq]');
  await board.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  check((await board.count()) === 1, 'اللعبة موجودة بالمقال');

  const sales = async () => Number(await board.locator('[data-sq-sales]').evaluate((el) => el.textContent.replace(/[^0-9٠-٩]/g, '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))));

  // ١) الوضع الشائع (البداية) — مبيعات قليلة وأضعف حلقة ظاهرة
  const s1 = await sales();
  check(s1 >= 0 && s1 <= 15, `الوضع الشائع: ${s1} بيع (قليل زي ما لازم)`);
  check(!(await board.locator('[data-sq-weak]').isHidden()), 'سطر «أضعف حلقة» ظاهر');

  // ٢) كل السلايدرز صفر — الختم القاسي
  for (const id of ['offer', 'price', 'trust', 'page', 'reply']) {
    await board.locator(`[data-sq-range="${id}"]`).fill('0');
  }
  await page.waitForTimeout(400);
  const s0 = await sales();
  const st0 = (await board.locator('[data-sq-stamp]').textContent())?.trim();
  check(s0 <= 1, `كل شي صفر: ${s0} بيع`);
  check(st0 === lowStamp, `الختم: «${st0}»`);

  // ٣) وضعية «بعد الشغل الصح» — القمع بيفتح والختم بينقلب
  await board.locator('[data-sq-scenario]').nth(1).click();
  await page.waitForTimeout(600);
  const s2 = await sales();
  const st2 = (await board.locator('[data-sq-stamp]').textContent())?.trim();
  check(s2 > 25, `بعد الشغل الصح: ${s2} بيع`);
  check(st2 === highStamp, `الختم: «${st2}»`);

  // ٤) كل شي ١٠٠ — أضعف حلقة بتختفي (ما في حلقة ضعيفة)
  for (const id of ['offer', 'price', 'trust', 'page', 'reply']) {
    await board.locator(`[data-sq-range="${id}"]`).fill('100');
  }
  await page.waitForTimeout(400);
  check(await board.locator('[data-sq-weak]').isHidden(), 'سطر «أضعف حلقة» اختفى لما كله عالي');
}

// لقطات
await page.goto(BASE + PAGES[0][0], { waitUntil: 'networkidle' });
const board = page.locator('[data-sales-eq]');
await board.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await board.screenshot({ path: '_check/out/d62-common.png' });
await board.locator('[data-sq-scenario]').nth(1).click();
await page.waitForTimeout(800);
await board.screenshot({ path: '_check/out/d62-fixed.png' });

// موبايل
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(BASE + PAGES[0][0], { waitUntil: 'networkidle' });
const mb = m.locator('[data-sales-eq]');
await mb.scrollIntoViewIfNeeded();
await m.waitForTimeout(800);
await mb.screenshot({ path: '_check/out/d62-mobile.png' });
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `ولا تمرير أفقي عالموبايل (${overflow}px)`);
await m.close();

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ معادلة البيع سليمة بالعربي والإنجليزي');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
