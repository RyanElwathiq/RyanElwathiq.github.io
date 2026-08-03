// فحص «كشف الشركة» جوّا مقالة #61-٣ — عربي وإنجليزي
//   node _check/cdcheck.mjs [رابط]
//  بيلعب المحادثة كاملة بحكمين مختلفين ويتأكد من النتيجة والأختام
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

// الأعلام بالترتيب (من company-detector.js): جولات 1,3,5,7 أعلام
const FLAGS = [true, false, true, false, true, false, true];

async function playAll(board, page, strategy) {
  // strategy: دالة بترجع 'flag' أو 'normal' حسب رقم الجولة
  for (let r = 0; r < FLAGS.length; r++) {
    await page.waitForTimeout(2200); // مؤشر الكتابة + الرد
    const kind = strategy(r);
    await board.locator(`[data-cd-choose="${kind}"]`).click();
    await page.waitForTimeout(350);
    await board.locator('[data-cd-next]').click();
  }
  await page.waitForTimeout(500);
}

const PAGES = [
  ['/ar/signals/ar-dikor-raqami/', 'كاشف محترف'],
  ['/signals/en-digital-decor/', 'A professional detector'],
];

// ─── جولات اليوم من نبض: منزيّفها عشان الفحص ثابت وما يحرق رصيد ───
const AI_ROUNDS = Array.from({ length: 6 }, (_, k) => ({
  q: 'سؤال تجريبي رقم ' + (k + 1),
  a: 'رد تجريبي من الشركة رقم ' + (k + 1),
  flag: k % 2 === 0,
  why: 'شرح تجريبي للجولة رقم ' + (k + 1),
}));
await page.route('**/detector-rounds', (route) =>
  route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true, rounds: AI_ROUNDS, day: 'test' }) })
);

for (const [path, topStamp] of PAGES) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const board = page.locator('[data-company-detector]');
  await board.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  check((await board.count()) === 1, 'اللعبة موجودة بالمقال');

  // ١) لعبة بكل الأجوبة صح → الختم الأعلى
  await board.locator('[data-cd-start]').click();
  await playAll(board, page, (r) => (FLAGS[r] ? 'flag' : 'normal'));
  const bubbles = await board.locator('.cd-b-co:not(.cd-typing)').count();
  check(bubbles === 7, `٧ ردود من الشركة ظهروا (${bubbles})`);
  const score = (await board.locator('[data-cd-score]').textContent())?.trim();
  const stamp = (await board.locator('[data-cd-stamp]').textContent())?.trim();
  console.log(`     ${score}`);
  check(stamp === topStamp, `كل الأجوبة صح → «${stamp}»`);

  // ١.٥) جولات اليوم من نبض — الزر ظهر وبينلعب صح
  const bonusBtn = board.locator('[data-cd-bonus]');
  check(!(await bonusBtn.isHidden()), 'زر «جولات اليوم» ظهر بعد النتيجة');
  check(
    ((await bonusBtn.textContent()) || '').includes(path.startsWith('/ar') ? '٦' : '6'),
    'الزر بيبين عدد الجولات'
  );
  if (path.startsWith('/ar')) {
    await bonusBtn.click();
    await page.waitForTimeout(300);
    check((await board.locator('.cd-note').count()) === 1, 'ملاحظة «بيكتبها نبض» ظهرت أول المحادثة');
    for (let r = 0; r < 6; r++) {
      await page.waitForTimeout(2200);
      await board.locator(`[data-cd-choose="${r % 2 === 0 ? 'flag' : 'normal'}"]`).click();
      await page.waitForTimeout(350);
      await board.locator('[data-cd-next]').click();
    }
    await page.waitForTimeout(500);
    const bScore = (await board.locator('[data-cd-score]').textContent())?.trim() || '';
    console.log(`     جولات اليوم: ${bScore}`);
    check(bScore.includes('٦'), 'نتيجة جولات اليوم محسوبة على ٦');
    check(await bonusBtn.isHidden(), 'الزر اختفى بعد ما انلعبت جولات اليوم');
  }

  // ٢) إعادة: كله «طبيعي» → بيمسك بس الردود النظيفة (٣ صح)
  await board.locator('[data-cd-again]').click();
  await playAll(board, page, () => 'normal');
  const stamp2 = (await board.locator('[data-cd-stamp]').textContent())?.trim();
  const score2 = (await board.locator('[data-cd-score]').textContent())?.trim();
  console.log(`     كله طبيعي: ${score2} → «${stamp2}»`);
  check(stamp2 !== topStamp, 'الختم نزل لما فاتته الأعلام');
  const notes = await board.locator('.cd-note').count();
  check(notes === 7, `شرح بعد كل جولة (${notes})`);
}

// لقطات: نص المحادثة + النتيجة (عربي)
await page.goto(BASE + PAGES[0][0], { waitUntil: 'networkidle' });
const board = page.locator('[data-company-detector]');
await board.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await board.locator('[data-cd-start]').click();
for (let r = 0; r < 3; r++) {
  await page.waitForTimeout(2200);
  await board.locator(`[data-cd-choose="${FLAGS[r] ? 'flag' : 'normal'}"]`).click();
  await page.waitForTimeout(350);
  if (r < 2) await board.locator('[data-cd-next]').click();
}
await page.waitForTimeout(400);
await board.screenshot({ path: '_check/out/d63-chat.png' });
await board.locator('[data-cd-next]').click();
for (let r = 3; r < 7; r++) {
  await page.waitForTimeout(2200);
  await board.locator(`[data-cd-choose="${FLAGS[r] ? 'flag' : 'normal'}"]`).click();
  await page.waitForTimeout(350);
  await board.locator('[data-cd-next]').click();
}
await page.waitForTimeout(500);
await board.screenshot({ path: '_check/out/d63-end.png' });

// موبايل
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(BASE + PAGES[0][0], { waitUntil: 'networkidle' });
const mb = m.locator('[data-company-detector]');
await mb.scrollIntoViewIfNeeded();
await m.waitForTimeout(600);
await mb.locator('[data-cd-start]').click();
await m.waitForTimeout(2400);
await mb.screenshot({ path: '_check/out/d63-mobile.png' });
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `ولا تمرير أفقي عالموبايل (${overflow}px)`);
await m.close();

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ كشف الشركة سليمة بالعربي والإنجليزي');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
