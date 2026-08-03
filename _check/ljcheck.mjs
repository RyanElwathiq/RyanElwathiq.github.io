// فحص «الرحلة المسرّبة» جوّا مقالة #61-٥ — عربي وإنجليزي
//   node _check/ljcheck.mjs [رابط]
//  بيلعب الرحلة مرتين (أحسن إصلاحات وأسوأها) ويتأكد من الخط والأختام
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

// الإصلاحات الصح معرّفة بكلمات مفتاحية (بعد الخلط ما منعرف الترتيب)
const RIGHT = [/وعد الإعلان|exact promise/, /سبب واحد قوي|one strong reason/, /قوالب|templates/, /عند الاستلام|Cash on delivery/];
const WRONG = [/غيّر الإعلان|Change the ad/, /منشورات|Post more/, /واتساب صاحب|owner's WhatsApp/, /خفض السعر|Cut the price/];

async function playJourney(board, page, patterns) {
  for (let s = 0; s < 4; s++) {
    await page.waitForTimeout(350);
    const fixes = board.locator('.lj-fix');
    const texts = await fixes.allTextContents();
    let idx = texts.findIndex((t) => patterns[s].test(t));
    if (idx < 0) idx = 0;
    await fixes.nth(idx).click();
    await page.waitForTimeout(350);
    await board.locator('[data-lj-next]').click();
  }
  await page.waitForTimeout(400);
}

const PAGES = [
  ['/ar/signals/ar-lesh-ma-bishtaru/', 'مهندس رحلات', 'الرحلة غرقانة'],
  ['/signals/en-clicks-no-sales/', 'A journey engineer', 'The journey is sinking'],
];

for (const [path, topStamp, lowStamp] of PAGES) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const board = page.locator('[data-leaky]');
  await board.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  check((await board.count()) === 1, 'اللعبة موجودة بالمقال');

  // ١) أحسن الإصلاحات
  await board.locator('[data-lj-start]').click();
  await playJourney(board, page, RIGHT);
  const nodesOn = await board.locator('.lj-node.on').count();
  check(nodesOn === 5, `خط الرحلة اتلوّن كامل (${nodesOn}/5)`);
  const final1 = (await board.locator('[data-lj-final]').textContent())?.trim();
  const stamp1 = (await board.locator('[data-lj-stamp]').textContent())?.trim();
  console.log(`     وصلوا: ${final1}`);
  check(stamp1 === topStamp, `أحسن مسار → «${stamp1}»`);

  // ٢) أسوأ الإصلاحات
  await board.locator('[data-lj-again]').click();
  await playJourney(board, page, WRONG);
  const final2 = (await board.locator('[data-lj-final]').textContent())?.trim();
  const stamp2 = (await board.locator('[data-lj-stamp]').textContent())?.trim();
  console.log(`     أسوأ مسار: ${final2} → «${stamp2}»`);
  check(stamp2 === lowStamp, `أسوأ مسار → «${stamp2}»`);
}

// لقطات (عربي)
await page.goto(BASE + PAGES[0][0], { waitUntil: 'networkidle' });
const board = page.locator('[data-leaky]');
await board.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await board.locator('[data-lj-start]').click();
await page.waitForTimeout(350);
const fx = board.locator('.lj-fix');
const tx = await fx.allTextContents();
let k = tx.findIndex((t) => RIGHT[0].test(t));
await fx.nth(k < 0 ? 0 : k).click();
await page.waitForTimeout(500);
await board.screenshot({ path: '_check/out/d65-station.png' });
await board.locator('[data-lj-next]').click();
for (let s = 1; s < 4; s++) {
  await page.waitForTimeout(350);
  const f2 = board.locator('.lj-fix');
  const t2 = await f2.allTextContents();
  let m2 = t2.findIndex((t) => RIGHT[s].test(t));
  await f2.nth(m2 < 0 ? 0 : m2).click();
  await page.waitForTimeout(350);
  await board.locator('[data-lj-next]').click();
}
await page.waitForTimeout(500);
await board.screenshot({ path: '_check/out/d65-end.png' });

// موبايل
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(BASE + PAGES[0][0], { waitUntil: 'networkidle' });
const mb = m.locator('[data-leaky]');
await mb.scrollIntoViewIfNeeded();
await m.waitForTimeout(600);
await mb.locator('[data-lj-start]').click();
await m.waitForTimeout(600);
await mb.screenshot({ path: '_check/out/d65-mobile.png' });
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `ولا تمرير أفقي عالموبايل (${overflow}px)`);
await m.close();

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ الرحلة المسرّبة سليمة بالعربي والإنجليزي');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
