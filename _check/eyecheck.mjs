// فحص «عين البراند» بعد توصيل المحرّك الذكي + عناصر الإعادة
//   node _check/eyecheck.mjs [رابط]
//  بيفحص: طلب /brand-eye بينجح وبيرجع أسئلة · اللعبة بتخلص ١٠ جولات ·
//  ملخص «ركّز على» · رسالة «أسئلة بتتجدد» · السجل بينحفظ وبيظهر عالغطا
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.argv[2] || 'http://localhost:4330';
const URL = BASE + '/ar/signals/ar-3ain-al-brand/';
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));

let aiRounds = -1;
page.on('response', async (r) => {
  // ⚠️ الـ OPTIONS (preflight) جسمه فاضي — بيكسر r.json() لو ما فلترناه
  if (r.url().includes('/brand-eye') && r.request().method() === 'POST') {
    try {
      const d = await r.json();
      aiRounds = (d.rounds || []).length;
    } catch (e) {
      aiRounds = -2;
    }
  }
});

let fail = 0;
const check = (ok, msg) => {
  if (!ok) fail++;
  console.log(`  ${ok ? '✅' : '❌'} ${msg}`);
};

await page.goto(URL, { waitUntil: 'networkidle' });
const board = page.locator('[data-brand-eye]');
await board.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);

// ١) أول لعبة كاملة
await board.locator('[data-bx-start]').click();
await page.waitForTimeout(2500); // مهلة طلب المحرّك
check(aiRounds >= 0, `طلب المحرّك الذكي رجّع ${aiRounds} سؤال`);

for (let r = 0; r < 10; r++) {
  await board.locator('[data-bx-opt="0"]').click();
  await page.waitForTimeout(250);
  await board.locator('[data-bx-next]').click();
  await page.waitForTimeout(250);
}

const end = board.locator('[data-bx-end]');
check(!(await end.isHidden()), 'شاشة النتيجة ظهرت بعد ١٠ جولات');
const score1 = (await board.locator('[data-bx-score]').textContent())?.trim();
console.log(`     النتيجة: ${score1}`);
const focusVisible = !(await board.locator('[data-bx-focus]').isHidden());
const freshVisible = !(await board.locator('[data-bx-fresh]').isHidden());
console.log(`     «ركّز على»: ${focusVisible ? 'ظاهرة' : 'مخفية (علامة كاملة؟)'}`);
check(freshVisible === (aiRounds > 0), `رسالة «الأسئلة بتتجدد» ${freshVisible ? 'ظاهرة' : 'مخفية'} (متسقة مع المحرّك)`);
await board.screenshot({ path: '_check/out/eye-end.png' });

// ٢) السجل انحفظ؟
const rec = await page.evaluate(() => localStorage.getItem('bx-record'));
check(!!rec, `السجل انحفظ: ${rec}`);

// ٣) بعد إعادة تحميل: الرقم القياسي عالغطا
await page.reload({ waitUntil: 'networkidle' });
await board.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
const recLine = board.locator('[data-bx-record]');
check(!(await recLine.isHidden()), `سطر الرقم القياسي عالغطا: «${(await recLine.textContent())?.trim()}»`);
await board.screenshot({ path: '_check/out/eye-cover.png' });

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 160)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ اللعبة المطوّرة سليمة');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
