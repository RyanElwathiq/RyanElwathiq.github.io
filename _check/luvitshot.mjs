// ═══════════════════════════════════════════════════════════════
//  فحص بصري لصفحة LUV IT — لقطة لكل قسم + قياسات
//  التشغيل: node _check/luvitshot.mjs [رابط-الأساس] [عرض]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const [, , base = 'http://localhost:4321', w = '1440'] = process.argv;
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: +w, height: 900 }, deviceScaleFactor: 1.5 });
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));

await page.goto(`${base}/work/luvit/`, { waitUntil: 'networkidle' });
// ننزل لآخر الصفحة ونرجع — عشان كل الصور الكسولة تتحمّل وتنكشف العناصر
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 700) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1500);

const shots = [
  ['head', '.head'],
  ['identity', '.identity'],
  ['shelf', '.shelf'],
  ['boards', '.rail'],
  ['feed', '.feed'],
  ['stories', '.rail-tall'],
  ['posts', '.grid'],
  ['shoot', '.shoot-grid'],
  ['lab', '.lab-grid'],
];

for (const [name, sel] of shots) {
  const el = page.locator(sel).first();
  if (!(await el.count())) { console.log(`  ✗ ما لقيت ${sel}`); continue; }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await el.screenshot({ path: `_check/out/luv-${name}.png` });
}

// ─── قياسات: هل في صورة انحشرت بصندوق أو طلعت مساحة فاضية حواليها؟ ───
const m = await page.evaluate(() => {
  const bad = [];
  document.querySelectorAll('main.luv img').forEach((im) => {
    const r = im.getBoundingClientRect();
    if (!r.width) return;
    const natural = im.naturalWidth / im.naturalHeight;
    const shown = r.width / r.height;
    if (Math.abs(natural - shown) / natural > 0.02) {
      bad.push({ src: im.src.split('/').pop(), natural: +natural.toFixed(2), shown: +shown.toFixed(2) });
    }
  });
  return {
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    height: document.body.scrollHeight,
    squashed: bad,
    railScroll: [...document.querySelectorAll('.rail')].map((r) => ({
      cls: r.className,
      pan: r.scrollWidth - r.clientWidth,
    })),
  };
});

console.log('\n═══ قياسات صفحة LUV IT ═══');
console.log(`  طول الصفحة: ${m.height}px`);
console.log(`  خروج أفقي:  ${m.overflow}px ${m.overflow > 1 ? '⚠️' : '✓'}`);
console.log(`  الأشرطة:    ${m.railScroll.map((r) => r.pan + 'px').join(' · ')}`);
if (m.squashed.length) {
  console.log(`  ⚠️ صور نسبتها انكسرت: ${m.squashed.length}`);
  m.squashed.slice(0, 10).forEach((s) => console.log(`     ${s.src}  أصلي ${s.natural} → معروض ${s.shown}`));
} else console.log('  ✓ ولا صورة انحشرت — كلهم بنسبتهم الأصلية');
if (errors.length) console.log(`\n  ⚠️ أخطاء: ${errors.join(' | ')}`);
else console.log('  ✓ بدون أخطاء');

await browser.close();
