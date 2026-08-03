// فحص «مترجم الباكجات» جوّا مقالة #61 — عربي وإنجليزي
//   node _check/ptxcheck.mjs [رابط]
//  بيفحص: العرض الشائع → ديكور رقمي · الشغل الصح → نظام نمو ·
//  فاضي → عرض فاضي · التعديل بيرجّعك · صفر أخطاء كونسول
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
  ['/ar/signals/ar-baakaj-am-numow/', 'ديكور رقمي', 'نظام نمو', 'عرض فاضي'],
  ['/signals/en-package-or-growth/', 'Digital decor', 'A growth system', 'An empty offer'],
];

for (const [path, decor, system, empty] of PAGES) {
  console.log(`\n${path}`);
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const board = page.locator('[data-pack-translator]');
  await board.scrollIntoViewIfNeeded();
  check((await board.count()) === 1, 'اللعبة موجودة بالمقال');

  // ١) العرض الشائع → ديكور رقمي (تنفيذ + وصول بس)
  await board.locator('[data-ptx-preset]').first().click();
  const pressed = await board.locator('[data-ptx-chip][aria-pressed="true"]').count();
  check(pressed === 6, `العرض الجاهز علّم ٦ بنود (${pressed})`);
  await board.locator('[data-ptx-go]').click();
  await page.waitForTimeout(3200);
  const rows = await board.locator('.ptx-row.in').count();
  const on = await board.locator('.ptx-layer.on').count();
  const stamp1 = (await board.locator('[data-ptx-stamp]').textContent())?.trim();
  check(rows === 6, `٦ صفوف ترجمة ظهروا (${rows})`);
  check(on === 2, `طبقتين مضويتين بس: تنفيذ ووصول (${on})`);
  check(stamp1 === decor, `الختم: «${stamp1}»`);
  check(!(await board.locator('[data-ptx-actions]').isHidden()), 'أزرار التشخيص ظهرت');

  // ٢) تعديل → الشغل الصح → نظام نمو (كل الطبقات تقريباً)
  await board.locator('[data-ptx-edit]').click();
  check(!(await board.locator('[data-ptx-build]').isHidden()), 'التعديل رجّع مرحلة التركيب');
  await board.locator('[data-ptx-preset]').nth(1).click();
  await board.locator('[data-ptx-go]').click();
  await page.waitForTimeout(3800);
  const on2 = await board.locator('.ptx-layer.on').count();
  const stamp2 = (await board.locator('[data-ptx-stamp]').textContent())?.trim();
  check(on2 === 6, `الست طبقات ضوّت (${on2})`);
  check(stamp2 === system, `الختم: «${stamp2}»`);

  // ٣) فاضي → عرض فاضي
  await board.locator('[data-ptx-edit]').click();
  await board.locator('[data-ptx-clear]').click();
  await board.locator('[data-ptx-go]').click();
  await page.waitForTimeout(1400);
  const stamp3 = (await board.locator('[data-ptx-stamp]').textContent())?.trim();
  check(stamp3 === empty, `الختم الفاضي: «${stamp3}»`);
  await board.locator('[data-ptx-edit]').click();
}

// لقطات: اللعبة قبل وبعد الترجمة (عربي)
await page.goto(BASE + PAGES[0][0], { waitUntil: 'networkidle' });
const board = page.locator('[data-pack-translator]');
await board.scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await board.screenshot({ path: '_check/out/d61-game-build.png' });
await board.locator('[data-ptx-preset]').first().click();
await board.locator('[data-ptx-go]').click();
await page.waitForTimeout(3600);
await board.screenshot({ path: '_check/out/d61-game-verdict.png' });

// لقطة أعلى المقال
await page.goto(BASE + PAGES[0][0], { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.screenshot({ path: '_check/out/d61-article-top.png' });

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ اللعبة سليمة بالعربي والإنجليزي');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
