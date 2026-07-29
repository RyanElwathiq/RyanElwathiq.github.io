// ═══════════════════════════════════════════════════════════════
//  فتح القائمة وسكّرها = الأقسام بتتداخل؟
//  منقارن مواقع الأقسام قبل وبعد
// ═══════════════════════════════════════════════════════════════
import { chromium, devices } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4335';
const b = await chromium.launch();

const run = async (label, ctxOpts) => {
  const ctx = await b.newContext(ctxOpts);
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('   PAGEERROR:', e.message.slice(0, 90)));

  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(3000);

  // ننزل لنص الصفحة (زي ريّان لما فتح القائمة)
  await p.evaluate(() => {
    const y = document.documentElement.scrollHeight * 0.25;
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
  });
  await p.waitForTimeout(1500);

  const snap = () =>
    p.evaluate(() => {
      const out = {};
      ['#work', '#growth', '#websites', '#knot', '#loss', '#pricing'].forEach((s) => {
        const el = document.querySelector(s);
        if (el) out[s] = Math.round(el.getBoundingClientRect().top + scrollY);
      });
      const ST = window.__gsap?.core?.globals?.().ScrollTrigger;
      return {
        pos: out,
        y: Math.round(scrollY),
        docH: document.documentElement.scrollHeight,
        spacers: document.querySelectorAll('.pin-spacer').length,
        triggers: ST ? ST.getAll().length : -1,
      };
    });

  const before = await snap();

  // افتح القائمة وسكّرها
  await p.locator('[data-menu-open]').click();
  await p.waitForTimeout(900);
  const menuOpen = await p.evaluate(() => !document.querySelector('[data-menu]').hidden);
  await p.locator('[data-menu-close]').click();
  await p.waitForTimeout(2500);

  const after = await snap();

  const moved = Object.keys(before.pos).filter((k) => Math.abs(before.pos[k] - after.pos[k]) > 8);
  console.log(
    `${label.padEnd(10)} القائمة فتحت=${menuOpen} | سكرول ${before.y}→${after.y} | ` +
      `ارتفاع ${before.docH}→${after.docH} | spacers ${before.spacers}→${after.spacers}`
  );
  if (moved.length) {
    console.log(`   ✗ ${moved.length} قسم زاح مكانه:`);
    moved.forEach((k) =>
      console.log(`      ${k}: ${before.pos[k]} → ${after.pos[k]}  (فرق ${after.pos[k] - before.pos[k]})`)
    );
  } else {
    console.log('   ✓ ولا قسم زاح');
  }
  await p.screenshot({ path: `_check/out/menu-${label}.png` });
  await ctx.close();
  return moved.length === 0;
};

const a = await run("ديسكتوب", { viewport: { width: 820, height: 900 } });
const c = await run('موبايل', { ...devices['Pixel 5'] });
await b.close();
console.log(`\n${a && c ? '✓ الاثنين سليمين' : '✗ لسا في مشكلة'}`);
