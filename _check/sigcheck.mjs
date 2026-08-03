// فحص قسم «إشارات» بالرئيسية بعد تحديث 2026-08-04 — عربي وإنجليزي
//   node _check/sigcheck.mjs [رابط]
//  بيتأكد: ٤ أحدث مقالات (بالترتيب) · وسم «فيها لعبة» · عدّاد
//  «في غيرهم» حي · بطاقة الألعاب بطلت «قريباً»
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
  ['/ar/', 'ar-la-tikhlot-alarqam', 'فيها لعبة', 'قريباً'],
  ['/', 'en-lead-sale-roas', 'has a game', 'soon'],
];

for (const [path, newestSlug, gameTag, soonWord] of PAGES) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const sec = page.locator('[data-signals]');
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);

  // ١) أربع مقالات
  const items = await sec.locator('.latest li').count();
  check(items === 4, `أربع إشارات معروضات (${items})`);

  // ٢) الأحدث أول (مقالة فارز الأرقام هي الأحدث)
  const firstHref = await sec.locator('.latest li a').first().getAttribute('href');
  check(firstHref?.includes(newestSlug), `الأحدث أول: ${firstHref}`);

  // ٣) وسم اللعبة على الأربعة (كلهم فيهم ألعاب)
  const chips = await sec.locator('.latest .gchip').count();
  check(chips === 4, `وسم «${gameTag}» على الأربعة (${chips})`);

  // ٤) بطاقة الألعاب بطلت «قريباً»
  const whatHtml = await sec.locator('.what').innerHTML();
  const gamesCard = /ألعاب تفاعلية|Games inside/.test(whatHtml);
  check(gamesCard, 'بطاقة الألعاب موجودة بالنص الجديد');
  const soonCount = await sec.locator('.what .soon').count();
  check(soonCount === 0, `ولا بطاقة «${soonWord}» ضلت (${soonCount})`);

  // ٥) عدّاد «في غيرهم» — لازم يذكر عدد (٥ حالياً: ٩ مقالات - ٤)
  const moreText = (await sec.locator('.more').textContent())?.trim() || '';
  check(/[٥5]/.test(moreText), `عدّاد الباقي حي: «${moreText}»`);
}

// لقطة
await page.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
const sec = page.locator('[data-signals]');
await sec.locator('.latest').scrollIntoViewIfNeeded();
await page.waitForTimeout(1300);
await sec.screenshot({ path: '_check/out/signals-new.png' });

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ قسم الإشارات المحدّث سليم');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
