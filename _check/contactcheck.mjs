// فحص منطقة التواصل الجديدة (2026-08-03) — عربي وإنجليزي
//   node _check/contactcheck.mjs [رابط]
//  بيتأكد: زر الاتصال والرقم انشالوا · CV/Drive/Notion انشالوا ·
//  البطاقات الأربعة الجداد بروابطها الصح · الداخلية بلا تبويب جديد
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
  ['/ar/', ['/ar/services/#packs', '/ar/signals/', '/ar/#lab'], 'behance'],
  ['/', ['/services/#packs', '/signals/', '/#lab'], 'behance'],
];

for (const [path, internals, external] of PAGES) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const contact = page.locator('#contact');
  await contact.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // ١) زر الاتصال والرقم راحوا
  const telLinks = await contact.locator('a[href^="tel:"]').count();
  check(telLinks === 0, 'ولا رابط tel: بالقسم');
  const html = await contact.innerHTML();
  check(!/tel:|اتصل بي|Call me/.test(html), 'زر «اتصل بي» انشال');
  check(!/سيرتي|نوشن|درايف|CV|Notion|Drive archive|Download my/.test(html), 'بطاقات CV/نوشن/درايف انشالوا');
  check(!/توظيف|internship/i.test(html), 'سطر «تدريب أو توظيف» انشال (التوجه الجديد)');

  // ٢) الأزرار: ٣ (طلب، إيميل، لينكدإن)
  const btns = await contact.locator('.actions a').count();
  check(btns === 3, `ثلاثة أزرار بالضبط (${btns})`);

  // ٣) البطاقات الأربعة بروابطها
  const cards = contact.locator('.res');
  check((await cards.count()) === 4, `أربع بطاقات (${await cards.count()})`);
  for (const href of internals) {
    const card = contact.locator(`.res[href="${href}"]`);
    check((await card.count()) === 1, `بطاقة داخلية → ${href}`);
    const target = await card.getAttribute('target');
    check(target === null, `  بلا تبويب جديد (${href})`);
  }
  const behanceCard = contact.locator(`.res[href*="${external}"]`);
  check((await behanceCard.count()) === 1, 'بطاقة Behance موجودة وخارجية');
  check((await behanceCard.getAttribute('target')) === '_blank', '  بتفتح بتبويب جديد');
}

// ٤) الرقم ما بيظهر كنص بأي مكان بالصفحتين
for (const [path] of PAGES) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const body = await page.evaluate(() => document.body.innerText);
  check(!/07[789]\d{7}|\+962\s?7/.test(body), `${path} ما فيها رقم هاتف ظاهر كنص`);
}

// لقطات
await page.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
const contact = page.locator('#contact');
await contact.scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
await contact.screenshot({ path: '_check/out/contact-new.png' });

const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
const mc = m.locator('#contact');
await mc.scrollIntoViewIfNeeded();
await m.waitForTimeout(1200);
await mc.screenshot({ path: '_check/out/contact-new-mobile.png' });
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `ولا تمرير أفقي عالموبايل (${overflow}px)`);
await m.close();

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ منطقة التواصل الجديدة سليمة');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
