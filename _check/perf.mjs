// ═══════════════════════════════════════════════════════════════
//  السلاسة والتحميل الكسول
//  • كل صورة تحت الشاشة الأولى لازم loading="lazy"
//  • الفيديوهات: preload وحجمها
//  • السكرول: كم إطار بيسقط؟ وفي «مهام طويلة» بتوقف الصفحة؟
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();

// ─── ١) تدقيق الصور والفيديوهات ───
for (const path of ['/ar/', '/', '/ar/loss/', '/ar/signals/ar-limatha-almawqi3-daroura/']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);

  const r = await p.evaluate(() => {
    const vh = innerHeight;
    const out = { eagerBelow: [], lazyAbove: [], noSize: [], vids: [] };
    document.querySelectorAll('img').forEach((im) => {
      const top = im.getBoundingClientRect().top + scrollY;
      const lazy = im.getAttribute('loading') === 'lazy';
      const name = im.getAttribute('src')?.split('/').pop() || '?';
      if (top > vh * 1.5 && !lazy) out.eagerBelow.push(`${name} @${Math.round(top)}px`);
      if (top < vh && lazy) out.lazyAbove.push(`${name} @${Math.round(top)}px`);
      if (!im.getAttribute('width') || !im.getAttribute('height')) out.noSize.push(name);
    });
    document.querySelectorAll('video').forEach((v) => {
      const top = v.getBoundingClientRect().top + scrollY;
      out.vids.push(
        `${(v.currentSrc || v.src || '?').split('/').pop()} preload=${v.preload} @${Math.round(top)}px` +
          `${v.hasAttribute('playsinline') ? '' : ' ⚠️بدون playsinline'}`
      );
    });
    return out;
  });

  const say = (label, arr) => arr.length && console.log(`  ${label}: ${[...new Set(arr)].join(' · ')}`);
  console.log(`\n── ${path}`);
  say('صور تحت الشاشة بدون lazy', r.eagerBelow);
  say('صور فوق الشاشة معمولة lazy (بتأخّر الظهور)', r.lazyAbove);
  say('صور بدون width/height (بتسبب قفزة بالتخطيط)', r.noSize);
  say('فيديوهات', r.vids);
  if (!r.eagerBelow.length && !r.lazyAbove.length && !r.noSize.length) console.log('  ✓ الصور مضبوطة');
  await p.close();
}

// ─── ٢) سلاسة السكرول ───
console.log('\n══ سلاسة السكرول ══');
for (const [path, label] of [['/ar/', 'الرئيسية عربي'], ['/', 'الرئيسية إنجليزي']]) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);

  const r = await p.evaluate(
    () =>
      new Promise((res) => {
        const frames = [];
        const long = [];
        let po;
        try {
          po = new PerformanceObserver((l) => l.getEntries().forEach((e) => long.push(Math.round(e.duration))));
          po.observe({ entryTypes: ['longtask'] });
        } catch {}

        let last = performance.now();
        let raf;
        const tick = (now) => {
          frames.push(now - last);
          last = now;
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        // سكرول متدرّج عبر الصفحة كلها
        const H = document.documentElement.scrollHeight - innerHeight;
        let y = 0;
        const step = () => {
          y += H / 60;
          window.__lenis ? window.__lenis.scrollTo(y) : scrollTo(0, y);
          if (y < H) setTimeout(step, 60);
          else
            setTimeout(() => {
              cancelAnimationFrame(raf);
              po?.disconnect();
              const sorted = [...frames].sort((a, b) => a - b);
              res({
                frames: frames.length,
                median: +sorted[Math.floor(sorted.length / 2)].toFixed(1),
                p95: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1),
                worst: +Math.max(...frames).toFixed(1),
                dropped: frames.filter((f) => f > 32).length,
                longTasks: long.length,
                longWorst: long.length ? Math.max(...long) : 0,
              });
            }, 500);
        };
        step();
      })
  );

  const pct = ((r.dropped / r.frames) * 100).toFixed(1);
  console.log(
    `${label.padEnd(18)} وسيط الإطار=${r.median}ms p95=${r.p95}ms أسوأ=${r.worst}ms` +
      ` | إطارات مقطوعة=${r.dropped}/${r.frames} (${pct}%)` +
      ` | مهام طويلة=${r.longTasks} (أطولها ${r.longWorst}ms)` +
      `  ${r.dropped / r.frames < 0.08 ? '✓ سلس' : '✗ في تقطيع'}`
  );
  await p.close();
}

await b.close();
