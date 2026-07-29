// ═══════════════════════════════════════════════════════════════
//  فحص التقطيع على كل صفحات الموقع
//  بيسكرول الصفحة كاملة على جهاز متوسط (معالج أبطأ ٤×) ومنقيس
//  كل إطار: قديش أخد، وكم إطار انقطع، ووين بالضبط صار التقطيع.
//
//  التشغيل: node _check/jankall.mjs [رابط] [عرض]
//   العرض 390 = موبايل · 1440 = ديسكتوب
// ═══════════════════════════════════════════════════════════════
import { chromium, devices } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4410';
const width = +(process.argv[3] || 390);
const CPU = 4;
// إطار طبيعي ١٦.٧ms — أي إطار فوق ٣٢ يعني انقطعت لقطة
const DROP = 32;

const browser = await chromium.launch();

async function scan(path) {
  const ctx =
    width < 700
      ? await browser.newContext({ ...devices['Pixel 5'] })
      : await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });

  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));

  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);

  const r = await page.evaluate(
    async ([DROP]) => {
      const frames = [];
      let last = performance.now();
      let stop = false;
      const tick = (t) => {
        frames.push({ ms: t - last, y: window.scrollY });
        last = t;
        if (!stop) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);

      const H = document.body.scrollHeight;
      const stepPx = Math.max(120, Math.round(H / 90));
      for (let y = 0; y <= H; y += stepPx) {
        window.scrollTo(0, y);
        await new Promise((res) => setTimeout(res, 32));
      }
      stop = true;
      await new Promise((res) => setTimeout(res, 120));

      const ms = frames.map((f) => f.ms).sort((a, b) => a - b);
      const drops = frames.filter((f) => f.ms > DROP);
      // وين صار أسوأ تقطيع؟ (نسبة من طول الصفحة)
      const worst = frames.reduce((a, f) => (f.ms > a.ms ? f : a), { ms: 0, y: 0 });
      return {
        height: H,
        total: frames.length,
        median: Math.round(ms[Math.floor(ms.length / 2)] || 0),
        p95: Math.round(ms[Math.floor(ms.length * 0.95)] || 0),
        drops: drops.length,
        worstMs: Math.round(worst.ms),
        worstAt: H ? Math.round((worst.y / H) * 100) : 0,
      };
    },
    [DROP]
  );

  await ctx.close();
  return { ...r, errs };
}

const pages = process.argv[4]
  ? [process.argv[4]]
  : ['/', '/ar/', '/work/luvit/', '/ar/work/luvit/', '/marketing/', '/designs/', '/websites/', '/videos/', '/budget/', '/loss/', '/brief/', '/signals/'];

console.log(`\n═══ التقطيع · ${width < 700 ? 'موبايل' : 'ديسكتوب'} · معالج أبطأ ${CPU}× ═══`);
console.log('الصفحة'.padEnd(20) + 'وسيط  p95   مقطوعة        أسوأ إطار');
console.log('─'.repeat(64));

let bad = 0;
for (const p of pages) {
  const r = await scan(p);
  const pct = Math.round((r.drops / r.total) * 100);
  const flag = pct > 12 || r.p95 > 60 ? '⚠️' : '✓';
  if (flag === '⚠️') bad++;
  console.log(
    `${flag} ${p.padEnd(18)}${String(r.median + 'ms').padEnd(6)}${String(r.p95 + 'ms').padEnd(6)}` +
      `${String(r.drops + '/' + r.total).padEnd(9)}(${String(pct + '%').padEnd(4)}) ${r.worstMs}ms عند ${r.worstAt}%` +
      (r.errs.length ? `  ✗ ${r.errs[0].slice(0, 40)}` : '')
  );
}
console.log('─'.repeat(64));
console.log(bad ? `⚠️ ${bad} صفحة بحاجة شغل` : '✓ كل الصفحات سلسة');

await browser.close();
