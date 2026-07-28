// ═══════════════════════════════════════════════════════════════
//  الكاروسيل (السحب الأفقي بقسم الفيديوهات) — بيضل شغال بعد
//  التنقّل بين الصفحات ولا لأ؟
//
//  منقيس من ScrollTrigger نفسه (start/end) مش بالتخمين، لأن القسم
//  مثبّت فمواقعه بتتغيّر وهو شغال.
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();

const probe = async (p, tag) => {
  const r = await p.evaluate(async () => {
    const ST = window.__gsap?.core?.globals?.().ScrollTrigger;
    const wrap = document.querySelector('[data-hpan]');
    const track = document.querySelector('[data-hpan-track]');
    if (!ST || !wrap || !track) return { fatal: `ST=${!!ST} wrap=${!!wrap} track=${!!track}` };

    const all = ST.getAll();
    // التريجر تبع الكاروسيل: هو اللي مثبّت الـ wrap
    const st = all.find((t) => t.trigger === wrap || t.pin === wrap);

    const read = () => Math.round(new DOMMatrixReadOnly(getComputedStyle(track).transform).m41);
    const jump = (y) =>
      new Promise((res) => {
        window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
        setTimeout(res, 650);
      });

    const base = { triggers: all.length, pinned: all.filter((t) => t.pin).length, found: !!st };
    if (!st) return base;

    await jump(st.start + 5);
    const a = read();
    await jump(st.start + (st.end - st.start) * 0.6);
    const c = read();

    return {
      ...base,
      range: Math.round(st.end - st.start),
      from: a,
      to: c,
      delta: Math.abs(c - a),
      progress: +st.progress.toFixed(2),
    };
  });

  if (r.fatal) {
    console.log(`${tag.padEnd(24)} ✗ ${r.fatal}`);
    return;
  }
  const ok = r.found && r.delta > 40;
  console.log(
    `${tag.padEnd(24)} triggers=${r.triggers} pinned=${r.pinned} panTrigger=${r.found}` +
      (r.found ? ` range=${r.range}px x:${r.from}→${r.to} (${r.delta}px)` : '') +
      `  ${ok ? '✓ شغال' : '✗ واقف'}`
  );
  return ok;
};

const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', (e) => console.log('  PAGEERROR:', e.message));
p.on('console', (m) => m.type() === 'error' && console.log('  CONSOLE:', m.text()));

const home = async () => {
  await p.evaluate(() => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0)));
  await p.waitForTimeout(400);
  await p.locator('.pill .brand').click();
  await p.waitForTimeout(3200);
};

// ═══ 1) تحميل مباشر ═══
await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2800);
await probe(p, '1. تحميل مباشر');

// ═══ 2) روح لصفحة ثانية ورجاع باللوجو ═══
await p.evaluate(() => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0)));
await p.waitForTimeout(400);
await p.goto(BASE + '/ar/signals/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await home();
console.log('   (رجعنا على ' + new URL(p.url()).pathname + ')');
await probe(p, '2. رجوع باللوجو');

// ═══ 3) رجوع ثاني — تراكم ═══
await p.goto(BASE + '/ar/websites/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await home();
await probe(p, '3. رجوع ثاني');

// ═══ 4) زر رجوع المتصفح ═══
await p.goto(BASE + '/ar/videos/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
await p.goBack();
await p.waitForTimeout(3200);
await probe(p, '4. زر رجوع المتصفح');

// ═══ 5) النسخة الإنجليزية ═══
await p.goto(BASE + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2800);
await probe(p, '5. إنجليزي مباشر');
await p.goto(BASE + '/signals/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await home();
await probe(p, '6. إنجليزي بعد رجوع');

await b.close();
