// ═══════════════════════════════════════════════════════════════
//  الأقسام بتتداخل لما تفوت من الهامبرجر على «الأعمال»؟
//  منقيس: بعد التنقّل، وين صار قسم الأعمال فعلاً، وهل في أقسام
//  مثبّتة لسا مغطّية الشاشة وهي المفروض راحت.
// ═══════════════════════════════════════════════════════════════
import { chromium, devices } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();

const check = async (label, viaMenu) => {
  const ctx = await b.newContext({ ...devices['Pixel 5'] });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => console.log('   PAGEERROR', e.message.slice(0, 90)));
  // منبلّش من صفحة ثانية زي ما عمل ريّان
  await p.goto(BASE + '/ar/websites/', { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(2000);

  if (viaMenu) {
    await p.locator('[data-menu-btn], .menu-btn, .burger, button[aria-label*="قائمة"]').first().click().catch(async () => {
      await p.locator('.pill button').first().click();
    });
    await p.waitForTimeout(800);
    await p.locator('[data-menu] a[href*="#work"]').first().click();
  } else {
    await p.goto(BASE + '/ar/#work', { waitUntil: 'networkidle', timeout: 120000 });
  }
  await p.waitForTimeout(5000);

  const r = await p.evaluate(() => {
    const vh = innerHeight;
    const work = document.querySelector('#work');
    const workRect = work ? work.getBoundingClientRect() : null;
    // عناصر الهيرو المثبّتة — المفروض تكون طالعة من الشاشة
    const bad = [];
    ['[data-seq-outro]', '[data-seq-intro]', '.beam', '.lamp-arm', '.glow'].forEach((s) => {
      document.querySelectorAll(s).forEach((el) => {
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        const visible = cs.visibility !== 'hidden' && +cs.opacity > 0.05 && b.width > 0 && b.height > 0;
        const inView = b.bottom > 0 && b.top < vh;
        // متداخل مع قسم الأعمال؟
        if (visible && inView && workRect && b.top < workRect.bottom && b.bottom > workRect.top) {
          bad.push(`${s} (${Math.round(b.top)}..${Math.round(b.bottom)}) op=${cs.opacity}`);
        }
      });
    });
    return {
      workTop: workRect ? Math.round(workRect.top) : null,
      scrollY: Math.round(scrollY),
      docH: document.documentElement.scrollHeight,
      spacers: document.querySelectorAll('.pin-spacer').length,
      overlap: bad,
    };
  });

  const ok = r.workTop !== null && Math.abs(r.workTop - 118) < 260 && r.overlap.length === 0;
  console.log(
    `${label.padEnd(26)} قسم الأعمال عند ${r.workTop}px (المفروض ~١١٨) | تداخل=${r.overlap.length} | spacers=${r.spacers}  ${ok ? '✓' : '✗'}`
  );
  r.overlap.slice(0, 3).forEach((o) => console.log('      ↳ ' + o));
  await p.screenshot({ path: `_check/out/navbug-${label.replace(/[^\w]/g, '')}.png` });
  await ctx.close();
  return ok;
};

await check('من الهامبرجر', true);
await check('برابط مباشر', false);
await b.close();
