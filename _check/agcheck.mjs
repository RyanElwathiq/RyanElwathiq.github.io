// فحص «وظّف وكيلك» بصفحة خدمة وكلاء الذكاء — عربي وإنجليزي
//   node _check/agcheck.mjs [رابط]
//  بيختار مجال ومهام، بيشغّل اليوم، وبيتأكد من التايم لاين والحصيلة
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

const PAGES = ['/ar/services/ai-agents-automation/', '/services/ai-agents-automation/'];

for (const path of PAGES) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const board = page.locator('[data-agent-day]');
  await board.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  check((await board.count()) === 1, 'اللعبة موجودة بالصفحة');

  // بلا مهام → تلميح مش تشغيل
  await board.locator('[data-ag-run]').click();
  await page.waitForTimeout(200);
  check(!(await board.locator('[data-ag-hint]').isHidden()), 'بلا مهام: طلع التلميح');
  check(await board.locator('[data-ag-day]').isHidden(), 'واليوم ما اشتغل');

  // مجال ثاني + ٣ مهام → تشغيل
  await board.locator('[data-ag-ind]').nth(1).click();
  for (const i of [0, 2, 3]) await board.locator('[data-ag-task]').nth(i).click();
  await board.locator('[data-ag-run]').click();
  await page.waitForTimeout(6000);

  const rows = await board.locator('[data-ag-feed] li').count();
  check(rows === 7, `التايم لاين اكتمل (${rows}/7 أحداث لثلاث مهام)`);
  check(!(await board.locator('[data-ag-sum]').isHidden()), 'الحصيلة ظهرت');
  const count = (await board.locator('[data-ag-count]').textContent())?.trim() || '';
  const hours = (await board.locator('[data-ag-hours]').textContent())?.trim() || '';
  console.log(`     ${count} · ${hours}`);
  check(
    path.startsWith('/ar') ? count.includes('٧') && count.includes('مهام') : count.includes('7'),
    'عدد المهام المنجزة صحيح (وبصيغة الجمع بالعربي)'
  );
  check(hours.includes(path.startsWith('/ar') ? '١٢' : '12'), 'الساعات = مجموع المهام الثلاث (5+4+3)');
  const cta = await board.locator('.ag-actions a').getAttribute('href');
  check(cta === '#notify', `زر القائمة بيودي عالنموذج (${cta})`);

  // الأحداث انتعبّت بخانات المجال المختار (مش قوالب فاضية)
  const feedText = (await board.locator('[data-ag-feed]').textContent()) || '';
  check(!feedText.includes('{'), 'ولا فتحة قالب ظاهرة بالأحداث');

  // إعادة
  await board.locator('[data-ag-again]').click();
  await page.waitForTimeout(200);
  check(!(await board.locator('[data-ag-setup]').isHidden()), 'الإعادة رجّعت للإعداد');
}

// اللعبة ما بتطلع بصفحات الخدمات الثانية
await page.goto(BASE + '/ar/services/websites/', { waitUntil: 'networkidle' });
check((await page.locator('[data-agent-day]').count()) === 0, 'ما بتظهر بصفحة خدمة ثانية');

// ─── صفحة الهبوط /agent/ (القمع) ───
for (const path of ['/ar/agent/', '/agent/']) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  check((await page.locator('[data-agent-day]').count()) === 1, 'اللعبة بقلب القمع');
  check((await page.locator('.agp-card').count()) === 3, 'بطاقات الوجع الثلاث');
  check((await page.locator('.agp-q').count()) === 3, 'أسئلة القمع الثلاثة');
  const cta = await page.locator('.agp-end a.btn-primary').getAttribute('href');
  check((cta || '').includes('/services/ai-agents-automation/#notify'), `زر النهاية بيودي عالقائمة (${cta})`);
  const gameCta = await page.locator('[data-agent-day] .ag-actions a').getAttribute('href');
  check((gameCta || '').includes('#notify'), 'وزر اللعبة نفسها كمان');
}

// ─── بطاقة الرئيسية ───
for (const [home, target] of [
  ['/ar/', '/ar/agent/'],
  ['/', '/agent/'],
]) {
  await page.goto(BASE + home, { waitUntil: 'networkidle' });
  const tz = page.locator('.agt-card');
  check((await tz.count()) === 1, `بطاقة الوكيل موجودة بـ ${home}`);
  check((await tz.getAttribute('href')) === target, `وبتودي على ${target}`);
}

// لقطات (عربي)
await page.goto(BASE + PAGES[0], { waitUntil: 'networkidle' });
const b2 = page.locator('[data-agent-day]');
await b2.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await b2.screenshot({ path: '_check/out/ag-setup.png' });
for (const i of [0, 1, 3]) await b2.locator('[data-ag-task]').nth(i).click();
await b2.locator('[data-ag-run]').click();
await page.waitForTimeout(6500);
await b2.screenshot({ path: '_check/out/ag-day.png' });

// موبايل
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(BASE + PAGES[0], { waitUntil: 'networkidle' });
const mb = m.locator('[data-agent-day]');
await mb.scrollIntoViewIfNeeded();
await m.waitForTimeout(600);
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check(overflow <= 1, `ولا تمرير أفقي عالموبايل (${overflow}px)`);
await mb.screenshot({ path: '_check/out/ag-mobile.png' });
await m.close();

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ «وظّف وكيلك» سليمة بالعربي والإنجليزي');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
