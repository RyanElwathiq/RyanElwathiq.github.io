// فحص صفحة «هذا البورتفوليو» المخصصة — عربي وإنجليزي
//   node _check/pfcheck.mjs [رابط]
//  بيفحص: العدادات بتعد · ٩ مميزات وروابطها شغالة · مسار الاستفادة
//  بينعلم وبينحفظ · الخارطة · وصفر أخطاء كونسول
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

for (const path of ['/ar/work/portfolio/', '/work/portfolio/']) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // ١) العدادات بتوصل لأرقامها بعد الظهور
  await page.locator('.stats').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  const counts = await page.$$eval('[data-count]', (els) =>
    els.map((el) => ({ target: el.dataset.count, text: el.textContent })),
  );
  check(counts.length === 6, `ست إحصائيات (${counts.length})`);
  const nonZero = counts.filter((c) => c.target !== '0');
  check(
    nonZero.every((c) => c.text && c.text !== '0' && c.text !== '٠'),
    'العدادات وصلت لأرقامها',
  );

  // ٢) المميزات التسعة وروابطها
  const feats = await page.locator('.feat').count();
  check(feats === 9, `تسع مميزات (${feats})`);
  const links = await page.$$eval('.feat-cta', (as) => as.map((a) => a.getAttribute('href')));
  for (const href of links) {
    const r = await page.request.get(BASE + href.split('#')[0]);
    check(r.ok(), `رابط الميزة ${href} → ${r.status()}`);
  }

  // ٣) مسار الاستفادة: علامتان + الشريط بيتحرك وبينحفظ
  await page.locator('.guide').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.locator('[data-step-check]').nth(0).click();
  await page.locator('[data-step-check]').nth(1).click();
  await page.waitForTimeout(600);
  const doneCount = await page.locator('.step.is-done').count();
  check(doneCount === 2, `علامتان اتعلمتا (${doneCount})`);
  const width = await page.locator('[data-guide-fill]').evaluate((el) => el.style.width);
  check(width === '40%', `الشريط عند ٤٠٪ (${width})`);
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.guide').scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  check((await page.locator('.step.is-done').count()) === 2, 'العلامات انحفظت بعد إعادة التحميل');
  // تنظيف عشان الفحص الجاي
  await page.evaluate(() => localStorage.removeItem('pf-guide'));

  // ٤) الخارطة
  const roadItems = await page.locator('.road-item').count();
  check(roadItems === 5, `خمس محطات بالخارطة (${roadItems})`);

  // ٥) ممنوع ذكر الذكاء الاصطناعي كأداة بناء
  const body = await page.evaluate(() => document.body.innerText);
  check(!/مبني بالذكاء|built with AI|built using AI|بواسطة الذكاء/i.test(body), 'ولا ذكر للبناء بالذكاء الاصطناعي');
}

// لقطات (عربي)
await page.goto(BASE + '/ar/work/portfolio/', { waitUntil: 'networkidle' });
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(900);
await page.screenshot({ path: '_check/out/pf-hero.png' });
await page.locator('.stats').scrollIntoViewIfNeeded();
await page.waitForTimeout(1800);
await page.locator('.stats').screenshot({ path: '_check/out/pf-stats.png' });
await page.locator('.guide').scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await page.locator('.guide').screenshot({ path: '_check/out/pf-guide.png' });

// موبايل
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(BASE + '/ar/work/portfolio/', { waitUntil: 'networkidle' });
await m.waitForTimeout(900);
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `ولا تمرير أفقي عالموبايل (${overflow}px)`);
await m.screenshot({ path: '_check/out/pf-mobile.png' });
await m.close();

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ صفحة البورتفوليو المخصصة سليمة');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
