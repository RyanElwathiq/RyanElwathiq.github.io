// ═══════════════════════════════════════════════════════════════
//  تشخيص: وين بالضبط بتعلق الصفحة، وليش الهيرو بيرمش
//  منراقب: إعادة حسابات ScrollTrigger + الإطارات الطويلة + موقع الهيرو
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });

await p.addInitScript(() => {
  window.__log = { refresh: [], flash: [], long: [] };
  // كل مهمة طويلة (تجميدة) بننسجّلها مع وقتها
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        window.__log.long.push({ t: Math.round(e.startTime), d: Math.round(e.duration) });
    }).observe({ entryTypes: ['longtask'] });
  } catch {}
});

await p.goto(BASE + '/ar/', { waitUntil: 'domcontentloaded' });

// نراقب إعادة حسابات ScrollTrigger + وضع الهيرو
await p.evaluate(() => {
  const hook = setInterval(() => {
    const ST = window.__gsap?.core?.globals?.().ScrollTrigger;
    if (!ST) return;
    clearInterval(hook);
    ST.addEventListener('refresh', () => window.__log.refresh.push(Math.round(performance.now())));
  }, 30);

  // مراقبة الهيرو: الشفافية + الموقع
  const intro = () => document.querySelector('[data-seq-intro]');
  let last = null;
  const tick = () => {
    const el = intro();
    if (el) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const cur = cs.opacity + '|' + Math.round(r.top);
      if (last !== null && cur !== last)
        window.__log.flash.push({ t: Math.round(performance.now()), from: last, to: cur });
      last = cur;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

await p.waitForTimeout(5000);
const log = await p.evaluate(() => window.__log);

console.log(`إعادة حسابات ScrollTrigger: ${log.refresh.length} مرة عند ${log.refresh.join(' · ')}ms`);
console.log(`\nتغيّرات الهيرو (شفافية|موقع): ${log.flash.length}`);
log.flash.slice(0, 14).forEach((f) => console.log(`   ${String(f.t).padStart(5)}ms  ${f.from}  →  ${f.to}`));
console.log(`\nمهام طويلة (تجميدات): ${log.long.length}`);
log.long.filter((x) => x.d > 60).slice(0, 10).forEach((x) => console.log(`   ${String(x.t).padStart(5)}ms  ${x.d}ms`));

// ─── الآن: تقطيع السكرول ───
console.log('\n═══ تقطيع السكرول ═══');
const scroll = await p.evaluate(
  () =>
    new Promise((res) => {
      const f = [];
      const marks = [];
      let last = performance.now();
      let raf = requestAnimationFrame(function tick(now) {
        const dt = now - last;
        f.push(dt);
        if (dt > 50) marks.push({ y: Math.round(scrollY), dt: Math.round(dt) });
        last = now;
        raf = requestAnimationFrame(tick);
      });
      const H = document.documentElement.scrollHeight - innerHeight;
      let y = 0;
      const step = () => {
        y += H / 90;
        window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
        if (y < H) setTimeout(step, 50);
        else
          setTimeout(() => {
            cancelAnimationFrame(raf);
            const s = [...f].sort((a, b) => a - b);
            res({
              median: +s[Math.floor(s.length / 2)].toFixed(1),
              worst: Math.round(Math.max(...f)),
              bad: f.filter((x) => x > 50).length,
              n: f.length,
              docH: H,
              marks: marks.slice(0, 12),
            });
          }, 400);
      };
      step();
    })
);
console.log(`وسيط=${scroll.median}ms أسوأ=${scroll.worst}ms تعليقات(>50ms)=${scroll.bad}/${scroll.n}`);
console.log('أماكن التعليق (موقع السكرول من أصل ' + scroll.docH + '):');
scroll.marks.forEach((m) => console.log(`   y=${String(m.y).padStart(6)}  (${Math.round((m.y / scroll.docH) * 100)}%)  ${m.dt}ms`));

await b.close();
