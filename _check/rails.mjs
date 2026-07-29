// ═══════════════════════════════════════════════════════════════
//  فحص الأشرطة الأفقية — الأعطال اللي بلّغ عنها ريّان
//   ١) عجلة الماوس فوق الشريط: الصفحة لازم تنزل عادي (كانت بتعلق)
//   ٢) حركة إصبعين أفقية: الشريط لازم ينسحب
//   ٣) السحب بالماوس: الشريط لازم ينسحب ويطير بعد الإفلات
//   ٤) الأزرار
//
//  ⚠️ الموقع فيه سكرول ناعم (Lenis) وصور كسولة، فأي قياس بدون
//     ما تستنّى الصفحة تستقر بيطلع غلط. لهيك في settle() ولهيك
//     منستخدم hover() اللي بيوصل للعنصر بأمان بدل إحداثيات يدوية.
//
//  التشغيل: node _check/rails.mjs [رابط]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4399';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
await page.goto(`${base}/work/luvit/`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

async function settle() {
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const y = await page.evaluate(() => Math.round(window.scrollY));
    if (y === last) return;
    last = y;
    await page.waitForTimeout(100);
  }
}

const rail = page.locator('[data-rail]').first();
const wrap = page.locator('[data-rail-wrap]').first();
const railX = () => rail.evaluate((el) => Math.round(Math.abs(el.scrollLeft)));
const reset = async () => {
  await rail.evaluate((el) => (el.scrollLeft = 0));
  await page.waitForTimeout(250);
};

// نوصل للشريط ونستنّى الصفحة تهدا تماماً
await rail.hover();
await settle();
await rail.hover();
const pan = await rail.evaluate((el) => el.scrollWidth - el.clientWidth);

// ─── ١) عجلة عمودية فوق الشريط: الصفحة لازم تتحرّك ───
const y0 = await page.evaluate(() => Math.round(window.scrollY));
await page.mouse.wheel(0, 500);
await page.waitForTimeout(1000);
const vertical = (await page.evaluate(() => Math.round(window.scrollY))) - y0;

// ─── ٢) عجلة أفقية (حركة إصبعين على الماوس باد) ───
await rail.hover();
await settle();
await rail.hover();
await reset();
await page.mouse.wheel(320, 0);
await page.waitForTimeout(700);
const horizontal = await railX();

// ─── ٣) سحب بالماوس ───
await reset();
const b = await rail.boundingBox();
const sy = b.y + b.height / 2;
const sx = b.x + b.width * 0.75;
await page.mouse.move(sx, sy);
await page.mouse.down();
for (let s = 1; s <= 10; s++) {
  await page.mouse.move(sx - s * 28, sy);
  await page.waitForTimeout(16);
}
await page.mouse.up();
await page.waitForTimeout(900);
const dragged = await railX();

// ─── ٤) الأزرار ───
await reset();
const wrapState = await wrap.getAttribute('class');
await wrap.locator('[data-rail-next]').click();
await page.waitForTimeout(900);
const byButton = await railX();

// ─── ٥) الشريط الثاني (الستوريز) ───
const rail2 = page.locator('[data-rail]').nth(1);
const pan2 = await rail2.evaluate((el) => el.scrollWidth - el.clientWidth);

const ok = (v) => (v ? '✓' : '✗');
console.log('\n═══ فحص الشريط ═══');
console.log(`  مسافة السحب: اللوحات ${pan}px · الستوريز ${pan2}px`);
console.log(`  ${ok(vertical > 200)} عجلة عمودية → الصفحة نزلت ${vertical}px`);
console.log(`  ${ok(horizontal > 100)} عجلة أفقية  → الشريط انسحب ${horizontal}px`);
console.log(`  ${ok(dragged > 150)} سحب بالماوس  → الشريط انسحب ${dragged}px`);
console.log(`  ${ok(byButton > 100)} زر التالي     → الشريط انسحب ${byButton}px  [${wrapState}]`);
if (errs.length) console.log(`\n  ⚠️ أخطاء: ${errs.join(' | ')}`);

await browser.close();
