// فحص «فارز الأرقام» جوّا مقالة #61-٧ — عربي وإنجليزي
//   node _check/nscheck.mjs [رابط]
//  بيفرز التسع بطاقات كلها صح (بيقرأ صنف كل بطاقة من بياناتها)
//  وبعدين كلها بصندوق واحد، ويتأكد من النتيجتين
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.argv[2] || 'http://localhost:4330';
mkdirSync('_check/out', { recursive: true });

// أصناف البطاقات بنصوصها (من number-sorter.js) — للعربي والإنجليزي
const MAP = [
  [/نموذج الطلب|order form/, 'lead'],
  [/عند الاستلام|paid on delivery/, 'sale'],
  [/١٬٢٠٠|1,200/, 'roas'],
  [/لايك|likes on/, 'vanity'],
  [/٨٠ ألف|80,000/, 'vanity'],
  [/بتسأل عن السعر|asking about the price/, 'lead'],
  [/٦٠ قرش|returned 0.6/, 'roas'],
  [/إيموجي|emojis/, 'vanity'],
  [/للمرة الثالثة|third time/, 'sale'],
];

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

async function playAll(board, page, strategy) {
  for (let r = 0; r < 9; r++) {
    await page.waitForTimeout(300);
    const text = (await board.locator('[data-ns-card]').textContent()) || '';
    let bucket = 'vanity';
    if (strategy === 'right') {
      for (const [re, b] of MAP) if (re.test(text)) bucket = b;
    } else {
      bucket = 'lead'; // كله بصندوق واحد = أغلبه غلط
    }
    await board.locator(`[data-ns-bucket="${bucket}"]`).click();
    await page.waitForTimeout(250);
    await board.locator('[data-ns-next]').click();
  }
  await page.waitForTimeout(400);
}

const PAGES = [
  ['/ar/signals/ar-la-tikhlot-alarqam/', 'قارئ أرقام محترف'],
  ['/signals/en-lead-sale-roas/', 'A professional number reader'],
];

for (const [path, topStamp] of PAGES) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const board = page.locator('[data-sorter]');
  await board.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  check((await board.count()) === 1, 'اللعبة موجودة بالمقال');

  // ١) فرز صح كامل
  await board.locator('[data-ns-start]').click();
  await playAll(board, page, 'right');
  const score1 = (await board.locator('[data-ns-score]').textContent())?.trim();
  const stamp1 = (await board.locator('[data-ns-stamp]').textContent())?.trim();
  console.log(`     ${score1}`);
  check(stamp1 === topStamp, `فرز كامل صح → «${stamp1}»`);

  // ٢) كله بصندوق واحد → ختم أوطى
  await board.locator('[data-ns-again]').click();
  await playAll(board, page, 'wrong');
  const stamp2 = (await board.locator('[data-ns-stamp]').textContent())?.trim();
  const score2 = (await board.locator('[data-ns-score]').textContent())?.trim();
  console.log(`     كله Lead: ${score2} → «${stamp2}»`);
  check(stamp2 !== topStamp, 'الختم نزل بالفرز الغلط');
}

// لقطات (عربي)
await page.goto(BASE + PAGES[0][0], { waitUntil: 'networkidle' });
const board = page.locator('[data-sorter]');
await board.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await board.locator('[data-ns-start]').click();
await page.waitForTimeout(400);
const text = (await board.locator('[data-ns-card]').textContent()) || '';
let bucket = 'vanity';
for (const [re, b] of MAP) if (re.test(text)) bucket = b;
await board.locator(`[data-ns-bucket="${bucket}"]`).click();
await page.waitForTimeout(400);
await board.screenshot({ path: '_check/out/d67-sort.png' });

// موبايل
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(BASE + PAGES[0][0], { waitUntil: 'networkidle' });
const mb = m.locator('[data-sorter]');
await mb.scrollIntoViewIfNeeded();
await m.waitForTimeout(600);
await mb.locator('[data-ns-start]').click();
await m.waitForTimeout(500);
await mb.screenshot({ path: '_check/out/d67-mobile.png' });
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `ولا تمرير أفقي عالموبايل (${overflow}px)`);
await m.close();

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ فارز الأرقام سليم بالعربي والإنجليزي');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
