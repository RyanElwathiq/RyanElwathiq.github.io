// ═══════════════════════════════════════════════════════════════
//  أداء الموبايل بظروف الأردن الحقيقية
//  جهاز متوسط (معالج أبطأ ٤ مرات) + نت ٤G عادي مش ممتاز
//  منقيس: قديش بينزّل، وإيمتى بيبين، وإيمتى بيصير يستجيب
// ═══════════════════════════════════════════════════════════════
import { chromium, devices } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const CPU = 4; // الجهاز المتوسط بالأردن أبطأ ~٤ مرات من اللابتوب

// ملفات تعريف الشبكة (تحميل بايت/ثانية، رفع، تأخير)
const NETS = {
  '4G عادي': { downloadThroughput: (4 * 1024 * 1024) / 8, uploadThroughput: (3 * 1024 * 1024) / 8, latency: 70 },
  '4G ضعيف': { downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 },
  '3G': { downloadThroughput: (780 * 1024) / 8, uploadThroughput: (330 * 1024) / 8, latency: 300 },
};

const b = await chromium.launch();

const run = async (netName, path) => {
  const ctx = await b.newContext({ ...devices['Pixel 5'] });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);

  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, ...NETS[netName] });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });

  // ⚠️ منسجّل لحظة اختفاء شاشة التحميل **من جوّا الصفحة**، مش من برّا،
  //    لأن أي قياس ثاني بالسكربت بيأخّر الملاحظة وبيطلع رقم كذّاب.
  await p.addInitScript(() => {
    window.__bootGone = null;
    const mo = new MutationObserver(() => {
      if (!document.getElementById('boot')) {
        window.__bootGone = Math.round(performance.now());
        mo.disconnect();
      }
    });
    document.addEventListener('DOMContentLoaded', () =>
      mo.observe(document.body, { childList: true, subtree: true })
    );
  });

  const bytes = { total: 0, js: 0, css: 0, img: 0, font: 0, other: 0 };
  p.on('response', async (r) => {
    try {
      const h = r.headers();
      const len = +(h['content-length'] || 0);
      const ct = h['content-type'] || '';
      const n = len || 0;
      bytes.total += n;
      if (/javascript/.test(ct)) bytes.js += n;
      else if (/css/.test(ct)) bytes.css += n;
      else if (/image|video/.test(ct)) bytes.img += n;
      else if (/font/.test(ct)) bytes.font += n;
      else bytes.other += n;
    } catch {}
  });

  const t0 = Date.now();
  await p.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 120000 });

  const paint = await p.evaluate(
    () =>
      new Promise((res) => {
        const out = { fcp: 0, lcp: 0 };
        try {
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') out.fcp = Math.round(e.startTime);
          }).observe({ type: 'paint', buffered: true });
          new PerformanceObserver((l) => {
            const es = l.getEntries();
            out.lcp = Math.round(es[es.length - 1].startTime);
          }).observe({ type: 'largest-contentful-paint', buffered: true });
        } catch {}
        setTimeout(() => res(out), 4500);
      })
  );

  // إيمتى بتروح شاشة التحميل = إيمتى بيحس الزائر إنه الموقع جهز
  let bootGone = null;
  try {
    await p.waitForFunction(() => window.__bootGone !== null, null, { timeout: 45000 });
    bootGone = await p.evaluate(() => window.__bootGone);
  } catch {}

  // مهام طويلة = اللحظات اللي بتتجمّد فيها الصفحة
  const blocking = await p.evaluate(
    () =>
      new Promise((res) => {
        let total = 0;
        let worst = 0;
        let n = 0;
        try {
          new PerformanceObserver((l) => {
            for (const e of l.getEntries()) {
              n++;
              total += e.duration;
              worst = Math.max(worst, e.duration);
            }
          }).observe({ type: 'longtask', buffered: true });
        } catch {}
        setTimeout(() => res({ n, total: Math.round(total), worst: Math.round(worst) }), 3000);
      })
  );

  const kb = (n) => (n / 1024).toFixed(0) + 'KB';
  console.log(
    `${netName.padEnd(9)} ${path.padEnd(9)} FCP=${String(paint.fcp).padStart(5)}ms LCP=${String(paint.lcp).padStart(5)}ms` +
      ` جاهز=${bootGone ? (bootGone / 1000).toFixed(1) + 's' : '✗ ما جهز'}` +
      ` | نزّل ${kb(bytes.total).padStart(7)} (js ${kb(bytes.js)} · صور ${kb(bytes.img)})` +
      ` | تجمّد ${blocking.total}ms (${blocking.n} مرات، أطولها ${blocking.worst}ms)`
  );

  await ctx.close();
  return { bytes, paint, bootGone, blocking };
};

console.log('═══ جهاز متوسط (معالج أبطأ ٤×) ═══\n');
for (const net of Object.keys(NETS)) {
  await run(net, '/ar/');
}
console.log('');
await run('4G ضعيف', '/ar/loss/');
await run('4G ضعيف', '/ar/brief/');

// ─── سلاسة السكرول عالموبايل بمعالج بطيء ───
console.log('\n═══ سلاسة السكرول (معالج أبطأ ٤×) ═══');
{
  const ctx = await b.newContext({ ...devices['Pixel 5'] });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(2500);

  const r = await p.evaluate(
    () =>
      new Promise((res) => {
        const f = [];
        let last = performance.now();
        let raf = requestAnimationFrame(function tick(now) {
          f.push(now - last);
          last = now;
          raf = requestAnimationFrame(tick);
        });
        const H = document.documentElement.scrollHeight - innerHeight;
        let y = 0;
        const step = () => {
          y += H / 50;
          scrollTo(0, y);
          if (y < H) setTimeout(step, 70);
          else
            setTimeout(() => {
              cancelAnimationFrame(raf);
              const s = [...f].sort((a, b) => a - b);
              res({
                median: +s[Math.floor(s.length / 2)].toFixed(1),
                p95: +s[Math.floor(s.length * 0.95)].toFixed(1),
                dropped: f.filter((x) => x > 32).length,
                n: f.length,
              });
            }, 400);
        };
        step();
      })
  );
  const pct = ((r.dropped / r.n) * 100).toFixed(0);
  console.log(`وسيط=${r.median}ms p95=${r.p95}ms مقطوعة=${r.dropped}/${r.n} (${pct}%)`);
  await ctx.close();
}


// ─── شو هو عنصر LCP بالضبط؟ ───
console.log('\n═══ عنصر LCP ═══');
{
  const ctx = await b.newContext({ ...devices['Pixel 5'] });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, ...NETS['4G ضعيف'] });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU });
  await p.goto(BASE + '/ar/', { waitUntil: 'domcontentloaded', timeout: 120000 });
  const r = await p.evaluate(() => new Promise((res) => {
    let last = null;
    new PerformanceObserver((l) => { const e = l.getEntries(); last = e[e.length-1]; })
      .observe({ type: 'largest-contentful-paint', buffered: true });
    setTimeout(() => res(last ? {
      t: Math.round(last.startTime),
      tag: last.element ? last.element.tagName + '.' + String(last.element.className).slice(0,30) : '?',
      size: last.size,
      url: (last.url || '').split('/').pop(),
    } : null), 6000);
  }));
  console.log(JSON.stringify(r));
  await ctx.close();
}
await b.close();
