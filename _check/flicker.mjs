// ═══════════════════════════════════════════════════════════════
//  كاشف رمشة الهيرو
//
//  ⚠️ النسخة الأولى كانت تراقب شفافية **حاوية** النص فتقول «ثابت»
//     وريّان لسا بيشوف رمش — الرمشة بأنيميشن السطور جوّاها.
//
//  الطريقة: كل ما أنيميشن CSS يبلّش بيطلق animationstart، ولما
//  ينقطع (عنصر انلف بـ pin-spacer مثلاً) بيطلق animationcancel.
//  أنيميشن الدخول لازم يبلّش **مرة وحدة بالضبط** لكل عنصر:
//    بداية ثانية لنفس العنصر = انعاد من الصفر = رمشة
//    إلغاء قبل الاكتمال = النص اختفى فجأة = رمشة كمان
//
//  بيفحص بسرعة المعالج الطبيعية (جهاز ريّان مش مخنوق — الخنق
//  بيضغط كل الأحداث لبعد أول رسمة فبيخبّي المشكلة)، وبيفحص
//  ثلاث حالات: تحميل بارد، ريفرش، ورجوع بالتنقل الداخلي.
//
//  ⚠️ تحصين ضد ضغط الجهاز (نتائج متذبذبة أول تشغيل بعد البناء):
//    ١. جولة إحماء قبل القياس — أول تحميل بعد البناء السيرفر والكاش
//       باردين، فالأنيميشن بتتأخر (~7 ثواني) وبتتقاطع مع خطوات الفاحص.
//    ٢. الانتظار تكيّفي: بعد المدة الأساسية بنستنى أي أنيميشن هيرو
//       محدود لسا شغال يخلص (بسقف) قبل ما نقرا النتائج أو ننتقل —
//       الفاحص ما بينتقل والأنيميشن نص طريق.
//    ٣. إلغاء وقع جوّا فترة سحب أسترو (astro:before-swap → after-swap
//       + ثانية ونص هامش) سببه تنقّل الفاحص نفسه مش الموقع — متجاهَل.
//    ٤. لو طلعت رمشات، بنعيد الفحص كامل ٣ جولات وبنقرر بالأغلبية —
//       الرمشة الحقيقية حتمية وبتظهر بكل جولة، الحدّية بتختفي.
//  منطق كشف الرمشة الحقيقية نفسه (بداية ثانية أو إلغاء بنفس الصفحة)
//  ما تغيّر.
//
//    node _check/flicker.mjs [رابط]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4330';

const browser = await chromium.launch();

const initRecorder = () => {
  window.__anim = [];
  window.__swapB = [];
  window.__swapA = [];
  window.__aid = 0;
  const rec = (kind) => (e) => {
    const t = e.target;
    if (!t.__aid) t.__aid = ++window.__aid;
    window.__anim.push({
      kind,
      name: e.animationName,
      el:
        (t.tagName || '?').toLowerCase() +
        '#' +
        t.__aid +
        (t.className && typeof t.className === 'string' ? '.' + t.className.trim().split(/\s+/)[0] : ''),
      at: Math.round(performance.now()),
      conn: t.isConnected ? 1 : 0,
    });
  };
  document.addEventListener('animationstart', rec('start'), true);
  document.addEventListener('animationcancel', rec('cancel'), true);
  // تنقّلات أسترو الداخلية — منسجّل بداية ونهاية كل سحب لنميّز
  // الإلغاءات اللي سببها الفاحص نفسه لما بينتقل بين الصفحات
  document.addEventListener('astro:before-swap', () => window.__swapB.push(Math.round(performance.now())), true);
  document.addEventListener('astro:after-swap', () => window.__swapA.push(Math.round(performance.now())), true);
};

function report(label, events, swapB = [], swapA = []) {
  // فترات سحب أسترو [قبل − 50ms، بعد + 1500ms]: إلغاء جوّا هالفترة
  // سببه تنقّل الفاحص نفسه، بوجهيه اللي شفناهم تحت الضغط:
  //   أ. أنيميشن الصفحة الرايحة بلّشت متأخرة (حتى بفجوة التحضير اللي
  //      قبل استبدال الـ DOM) وانقطعت لما الصفحة انشالت.
  //   ب. سكربت الموقع اللي بيمنع إعادة أنيميشن الدخول عند الرجوع وصل
  //      متأخر (~600ms بعد السحبة) فلغّى أنيميشنات لحقت بلّشت — عالجهاز
  //      الهادي بيسبق أول فريم وما بيصير إشي، فهاد أثر ضغط مش رمشة.
  // إلغاء أبعد من ثانية ونص عن أي سحبة = اختفاء حقيقي وبينحسب. كشف
  // «البداية الثانية» (انعادت من الصفر) ما بيتأثر بهالتجاهل إطلاقاً
  const navSpans = swapB.map((b) => {
    const a = swapA.find((x) => x >= b);
    return [b - 50, (a !== undefined ? a : b + 300) + 1500];
  });
  const heroEv = events.filter((e) => e.name.startsWith('hero-'));
  const byEl = new Map();
  for (const e of heroEv) {
    const k = e.name + ' @ ' + e.el;
    byEl.set(k, (byEl.get(k) || []).concat([e]));
  }

  let flicker = 0;
  console.log(`\n═══ ${label} ═══`);
  if (!byEl.size) console.log('  (ولا حدث أنيميشن هيرو انسجّل)');
  for (const [k, evs] of [...byEl.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    evs.sort((a, b) => a.at - b.at);
    const starts = evs.filter((e) => e.kind === 'start').length;
    let cancels = 0;
    const parts = [];
    for (const e of evs) {
      if (e.kind !== 'cancel') {
        parts.push(`${e.kind}@${e.at}ms`);
        continue;
      }
      const byNav = navSpans.some(([lo, hi]) => e.at >= lo && e.at <= hi);
      if (byNav) {
        parts.push(`cancel@${e.at}ms(تنقّل الفاحص—متجاهَل)`);
      } else {
        cancels++;
        parts.push(`cancel@${e.at}ms${e.conn === 0 ? '(عنصر مشال)' : ''}`);
      }
    }
    const bad = starts - 1 + cancels;
    flicker += Math.max(0, bad);
    console.log(`${bad > 0 ? '❌' : '✅'} ${k.padEnd(40)} ${parts.join('  ')}`);
  }
  console.log(`رمشات: ${flicker}`);
  return flicker;
}

// انتظار تكيّفي: المدة الأساسية ثابتة، وتحت الضغط بنمدّد (بسقف) لحد ما
// كل أنيميشنات الهيرو المحدودة تخلص — اللانهائية (لوب) مستثناة
async function settle(page, base = 4000, extraCap = 6000) {
  await page.waitForTimeout(base);
  const deadline = Date.now() + extraCap;
  for (;;) {
    const busy = await page.evaluate(() =>
      document.getAnimations().some((a) => {
        if (!a.animationName || !a.animationName.startsWith('hero-')) return false;
        const t = a.effect && a.effect.getTiming ? a.effect.getTiming() : null;
        if (t && t.iterations === Infinity) return false;
        return a.playState === 'running' || a.pending;
      })
    );
    if (!busy || Date.now() > deadline) break;
    await page.waitForTimeout(250);
  }
}

async function runOnce(round) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(initRecorder);

  // ─── إحماء: أول تحميل بعد البناء بيكون بارد (سيرفر + كاش) —
  //     منسخّن الصفحتين قبل القياس حتى ما تتأخر الأنيميشن ع الفاضي ───
  await page.goto(BASE + '/ar/', { waitUntil: 'load' });
  await page.waitForTimeout(1200);
  await page.goto(BASE + '/ar/designs/', { waitUntil: 'load' });
  await page.waitForTimeout(800);

  // ─── ١: تحميل بارد ───
  await page.goto(BASE + '/ar/', { waitUntil: 'load' });
  await settle(page);
  let snap = await page.evaluate(() => ({ ev: window.__anim, b: window.__swapB, a: window.__swapA }));
  const r1 = report('تحميل بارد', snap.ev, snap.b, snap.a);

  // ─── ٢: ريفرش (أقرب لحالة ريّان «لما افتح الصفحه اول مره») ───
  await page.reload({ waitUntil: 'load' });
  await settle(page);
  snap = await page.evaluate(() => ({ ev: window.__anim, b: window.__swapB, a: window.__swapA }));
  const r2 = report('ريفرش', snap.ev, snap.b, snap.a);

  // ─── ٣: رحت على صفحة ورجعت بالتنقل الداخلي ───
  await page.evaluate(() => (window.__anim.length = 0));
  await page.click('a[href="/ar/designs/"]');
  // ما منرجع وأنيميشن صفحة التصاميم لسا شغالة — هاد كان مصدر الإلغاء الكاذب
  await settle(page, 1600);
  await page.evaluate(() => (window.__anim.length = 0));
  await page.goBack();
  await settle(page);
  const backAll = await page.evaluate(() => ({ href: location.pathname, ev: window.__anim, b: window.__swapB, a: window.__swapA }));
  console.log(
    `\n(بعد الرجوع: ${backAll.href} · مجموع أحداث الأنيميشن: ${backAll.ev.length} · سحبات B=[${backAll.b.join(',')}] A=[${backAll.a.join(',')}])`
  );
  const r3 = report('رجوع بالتنقل الداخلي', backAll.ev, backAll.b, backAll.a);

  await context.close();
  const total = r1 + r2 + r3;
  console.log(`\n— جولة ${round}: ${total === 0 ? '✅ ولا رمشة' : `❌ ${total} رمشة`} —`);
  return total;
}

// ─── التشغيل: جولة وحدة، ولو طلعت رمشات منعيد ومنقرر بالأغلبية ───
const totals = [await runOnce(1)];
if (totals[0] > 0) {
  console.log('\n⚠️ في رمشات — الرمشة الحقيقية حتمية وبتتكرر، منعيد جولتين ومنقرر بالأغلبية…');
  totals.push(await runOnce(2));
  totals.push(await runOnce(3));
}
const failing = totals.filter((t) => t > 0).length;
const isReal = failing >= (totals.length === 1 ? 1 : 2);

if (totals.length === 1) {
  console.log('\n✅ ولا رمشة بالحالات الثلاث');
} else {
  console.log(
    `\nالجولات: [${totals.join(' · ')}] → ${
      isReal
        ? `❌ رمشة حقيقية (تكررت بـ${failing}/3 جولات)`
        : `✅ نتيجة حدّية (${failing}/3 جولات بس، ما تكررت) — مش رمشة حقيقية`
    }`
  );
}
await browser.close();
process.exit(isReal ? 1 : 0);
