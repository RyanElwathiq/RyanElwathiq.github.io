// ═══════════════════════════════════════════════════════════════
//  فحص عطلين بلّغ عنهم ريّان أكثر من مرة وما انحلّوا:
//
//   ١) «لما أفوت على صفحة وأطلع منها الأقسام بتتداخل ببعض»
//      السبب المتوقّع: مساحات التثبيت (pin-spacer) بتضل من
//      الصفحة القديمة، أو ScrollTrigger ما بيعيد الحساب بعد
//      الانتقال — فالأقسام بتحسب مواقعها غلط وبتركب فوق بعض.
//
//   ٢) «الهيرو بيرندر أكثر من مرة أول ما أعمل ريفرش»
//      السبب المتوقّع: تقدّم السكرول بينط لأرقام مختلفة وقت
//      إعادة الحساب، فالنص يذوب ويرجع أكثر من مرة.
//
//  ⚠️ الفحص بيقيس مش بيتفرّج:
//   • التداخل: بيقارن حدود كل قسم بالقسم اللي بعده
//   • الرندر: بيراقب شفافية نص الهيرو ويعدّ كم مرة ارتدّت
//
//  التشغيل: node _check/navbugs.mjs [رابط]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4447';
const browser = await chromium.launch();

// ─────────────────────────────────────────────
//  ١) تداخل الأقسام بعد التنقّل
// ─────────────────────────────────────────────
async function overlapAfterNav(lang) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));

  const home = lang === 'ar' ? '/ar/' : '/';
  await page.goto(base + home, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);

  const measure = () =>
    page.evaluate(() => {
      const secs = [...document.querySelectorAll('main > section, main > div.container')];
      const boxes = secs
        .map((s) => {
          const r = s.getBoundingClientRect();
          return {
            id: s.id || s.className.split(' ')[0] || s.tagName,
            top: Math.round(r.top + window.scrollY),
            bottom: Math.round(r.bottom + window.scrollY),
            h: Math.round(r.height),
          };
        })
        .filter((b) => b.h > 40);

      const bad = [];
      for (let i = 0; i < boxes.length - 1; i++) {
        // تداخل حقيقي = القسم التالي بيبدأ فوق نهاية اللي قبله
        const gap = boxes[i + 1].top - boxes[i].bottom;
        if (gap < -12) bad.push(`${boxes[i].id} ↔ ${boxes[i + 1].id} (${gap}px)`);
      }
      return { count: boxes.length, bad, pinSpacers: document.querySelectorAll('.pin-spacer').length };
    });

  const before = await measure();

  // نفوت على صفحة داخلية ونرجع — نفس اللي بيعمله ريّان
  await page.click(`a[href*="/work/"], a[href*="/marketing/"]`).catch(() => {});
  await page.waitForTimeout(2200);
  await page.goBack();
  await page.waitForTimeout(2600);

  const after = await measure();
  await page.close();
  return { lang, before, after, errs };
}

// ─────────────────────────────────────────────
//  ٢) الهيرو: كم مرة بيرندر عند الريفرش؟
// ─────────────────────────────────────────────
async function heroFlash(lang) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const home = lang === 'ar' ? '/ar/' : '/';
  await page.goto(base + home, { waitUntil: 'commit' });

  // منراقب شفافية نص الهيرو من أول لحظة
  const flips = await page.evaluate(async () => {
    const rec = [];
    const t0 = performance.now();
    const id = setInterval(() => {
      const el = document.querySelector('[data-seq-intro]');
      if (el) rec.push([Math.round(performance.now() - t0), parseFloat(getComputedStyle(el).opacity)]);
    }, 30);
    await new Promise((r) => setTimeout(r, 4500));
    clearInterval(id);

    // كم مرة ارتدّت الشفافية باتجاه معاكس؟
    let flips = 0;
    let dir = 0;
    let prev = rec[0]?.[1] ?? 1;
    const at = [];
    for (const [t, v] of rec) {
      const d = v - prev;
      if (Math.abs(d) > 0.06) {
        const nd = Math.sign(d);
        if (dir && nd !== dir) {
          flips++;
          at.push(t + 'ms');
        }
        dir = nd;
      }
      prev = v;
    }
    return { flips, at: at.slice(0, 6), samples: rec.length };
  });

  await page.close();
  return { lang, ...flips };
}

console.log('\n═══ ١) تداخل الأقسام بعد التنقّل ═══');
for (const lang of ['en', 'ar']) {
  const r = await overlapAfterNav(lang);
  const tag = lang === 'ar' ? 'عربي  ' : 'إنجليزي';
  console.log(
    `  ${tag} قبل: ${r.before.count} قسم · تداخل ${r.before.bad.length} · مساحات تثبيت ${r.before.pinSpacers}`
  );
  console.log(
    `          بعد: ${r.after.count} قسم · تداخل ${r.after.bad.length} · مساحات تثبيت ${r.after.pinSpacers}`
  );
  if (r.after.bad.length) r.after.bad.slice(0, 5).forEach((b) => console.log(`          ⚠️ ${b}`));
  if (r.errs.length) console.log(`          ✗ ${r.errs[0].slice(0, 60)}`);
}

console.log('\n═══ ٢) وميض الهيرو عند التحميل ═══');
for (const lang of ['en', 'ar']) {
  const r = await heroFlash(lang);
  const tag = lang === 'ar' ? 'عربي  ' : 'إنجليزي';
  console.log(
    `  ${tag} ارتدّ ${r.flips} مرة ${r.flips === 0 ? '✓' : '⚠️'}` +
      (r.at.length ? ` — عند ${r.at.join(' · ')}` : '')
  );
}

await browser.close();
