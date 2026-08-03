// فحص «عداد الانتباه» جوّا مقالة #61-٤ — عربي وإنجليزي
//   node _check/accheck.mjs [رابط]
//  بيلعب الجولات الأربعة (أحسن خيار وأسوأ خيار) + الجولة الحرة
//  بجمل من الأنواع الثلاثة، ويتأكد من العداد والأختام
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

// بيلعب ٤ جولات: pickBest=true بيختار الخيار صاحب أطول نص «مشكلة»؟
// أبسط وأثبت: منقرأ التاج بعد الاختيار — فمنختار حسب فهرس ثابت
// بعد الخلط ما منعرف مين الأحسن، فمنجرب الكل: منختار الزر اللي نصه
// فيه علامة استفهام (خيارات «مشكلة العميل» كلها أسئلة أو فيها ؟)
async function playRounds(board, page, best, freeText) {
  for (let r = 0; r < 4; r++) {
    await page.waitForTimeout(350);
    const opts = board.locator('.ac-opt');
    const texts = await opts.allTextContents();
    let idx = 0;
    if (best) {
      idx = texts.findIndex((t) => t.includes('؟') || t.includes('?'));
      if (idx < 0) idx = 0;
    } else {
      // الأسوأ: جملة «نحن/We» الأنانية
      idx = texts.findIndex((t) => /نحن|أكبر|رقم ١|We are|biggest|#1/.test(t));
      if (idx < 0) idx = 0;
    }
    await opts.nth(idx).click();
    await page.waitForTimeout(1200);
    await board.locator('[data-ac-next]').click();
  }
  // الجولة الحرة
  await page.waitForTimeout(350);
  await board.locator('[data-ac-input]').fill(freeText);
  await board.locator('[data-ac-say]').click();
  await page.waitForTimeout(1300);
  const tag = (await board.locator('[data-ac-tag]').textContent())?.trim();
  await board.locator('[data-ac-next]').click();
  await page.waitForTimeout(400);
  return tag;
}

const PAGES = [
  {
    path: '/ar/signals/ar-malyon-shakhs/',
    bestFree: 'تعبت من إعلانات ما بترجعلك ولا استفسار؟',
    bestTag: 'مشكلة العميل',
    worstFree: 'نحن أفضل شركة بالمنطقة وعنا أجود الخدمات',
    worstTag: 'حكي عن حالك',
    topStamp: 'بتعرف تمسّك جمهور',
  },
  {
    path: '/signals/en-million-people/',
    bestFree: 'Tired of ads that bring zero inquiries back?',
    bestTag: "The customer's problem",
    worstFree: 'We are the best company in the area',
    worstTag: 'Talking about yourself',
    topStamp: 'You know how to hold a crowd',
  },
];

for (const P of PAGES) {
  console.log(`\n${P.path}`);
  await page.goto(BASE + P.path, { waitUntil: 'networkidle' });
  const board = page.locator('[data-attention]');
  await board.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  check((await board.count()) === 1, 'اللعبة موجودة بالمقال');

  // ١) لعبة بأحسن الخيارات + جملة «مشكلة»
  await board.locator('[data-ac-start]').click();
  const tag1 = await playRounds(board, page, true, P.bestFree);
  check(tag1 === P.bestTag, `المصنّف عرف جملة المشكلة: «${tag1}»`);
  const finalText = (await board.locator('[data-ac-final]').textContent())?.trim();
  const stamp1 = (await board.locator('[data-ac-stamp]').textContent())?.trim();
  console.log(`     ضلوا: ${finalText}`);
  check(stamp1 === P.topStamp, `أحسن مسار → «${stamp1}»`);

  // ٢) إعادة بأسوأ الخيارات + جملة أنانية
  await board.locator('[data-ac-again]').click();
  const tag2 = await playRounds(board, page, false, P.worstFree);
  check(tag2 === P.worstTag, `المصنّف عرف الجملة الأنانية: «${tag2}»`);
  const stamp2 = (await board.locator('[data-ac-stamp]').textContent())?.trim();
  console.log(`     أسوأ مسار → «${stamp2}»`);
  check(stamp2 !== P.topStamp, 'الختم نزل بالمسار الأسوأ');
}

// لقطات (عربي): نص لعبة + النهاية
await page.goto(BASE + PAGES[0].path, { waitUntil: 'networkidle' });
const board = page.locator('[data-attention]');
await board.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await board.locator('[data-ac-start]').click();
await page.waitForTimeout(350);
const opts = board.locator('.ac-opt');
const texts = await opts.allTextContents();
let idx = texts.findIndex((t) => t.includes('؟'));
await opts.nth(idx < 0 ? 0 : idx).click();
await page.waitForTimeout(1300);
await board.screenshot({ path: '_check/out/d64-round.png' });
await playRoundsRest();
async function playRoundsRest() {
  await board.locator('[data-ac-next]').click();
  for (let r = 1; r < 4; r++) {
    await page.waitForTimeout(350);
    const o = board.locator('.ac-opt');
    const tx = await o.allTextContents();
    let k = tx.findIndex((t) => t.includes('؟'));
    await o.nth(k < 0 ? 0 : k).click();
    await page.waitForTimeout(1200);
    await board.locator('[data-ac-next]').click();
  }
  await page.waitForTimeout(350);
  await board.locator('[data-ac-input]').fill('تعبت من إعلانات ما بترجعلك ولا استفسار؟');
  await board.locator('[data-ac-say]').click();
  await page.waitForTimeout(1300);
  await board.locator('[data-ac-next]').click();
  await page.waitForTimeout(500);
  await board.screenshot({ path: '_check/out/d64-end.png' });
}

// موبايل
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(BASE + PAGES[0].path, { waitUntil: 'networkidle' });
const mb = m.locator('[data-attention]');
await mb.scrollIntoViewIfNeeded();
await m.waitForTimeout(600);
await mb.locator('[data-ac-start]').click();
await m.waitForTimeout(600);
await mb.screenshot({ path: '_check/out/d64-mobile.png' });
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `ولا تمرير أفقي عالموبايل (${overflow}px)`);
await m.close();

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ عداد الانتباه سليم بالعربي والإنجليزي');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
