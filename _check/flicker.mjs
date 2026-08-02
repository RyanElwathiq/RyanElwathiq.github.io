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
//    node _check/flicker.mjs [رابط]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4330';

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

await page.addInitScript(() => {
  window.__anim = [];
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
    });
  };
  document.addEventListener('animationstart', rec('start'), true);
  document.addEventListener('animationcancel', rec('cancel'), true);
});

function report(label, events) {
  const heroEv = events.filter((e) => e.name.startsWith('hero-'));
  const byEl = new Map();
  for (const e of heroEv) {
    const k = e.name + ' @ ' + e.el;
    byEl.set(k, (byEl.get(k) || []).concat(`${e.kind}@${e.at}ms`));
  }

  let flicker = 0;
  console.log(`\n═══ ${label} ═══`);
  if (!byEl.size) console.log('  (ولا حدث أنيميشن هيرو انسجّل)');
  for (const [k, evs] of [...byEl.entries()].sort()) {
    const starts = evs.filter((s) => s.startsWith('start')).length;
    const cancels = evs.filter((s) => s.startsWith('cancel')).length;
    const bad = starts - 1 + cancels;
    flicker += Math.max(0, bad);
    console.log(`${bad > 0 ? '❌' : '✅'} ${k.padEnd(40)} ${evs.join('  ')}`);
  }
  console.log(`رمشات: ${flicker}`);
  return flicker;
}

// ─── ١: تحميل بارد ───
await page.goto(BASE + '/ar/', { waitUntil: 'load' });
await page.waitForTimeout(4000);
const r1 = report('تحميل بارد', await page.evaluate(() => window.__anim));

// ─── ٢: ريفرش (أقرب لحالة ريّان «لما افتح الصفحه اول مره») ───
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(4000);
const r2 = report('ريفرش', await page.evaluate(() => window.__anim));

// ─── ٣: رحت على صفحة ورجعت بالتنقل الداخلي ───
await page.evaluate(() => (window.__anim.length = 0));
await page.click('a[href="/ar/designs/"]');
await page.waitForTimeout(1600);
await page.evaluate(() => (window.__anim.length = 0));
await page.goBack();
await page.waitForTimeout(4000);
const backAll = await page.evaluate(() => ({ href: location.pathname, ev: window.__anim }));
console.log(`\n(بعد الرجوع: ${backAll.href} · مجموع أحداث الأنيميشن: ${backAll.ev.length})`);
const r3 = report('رجوع بالتنقل الداخلي', backAll.ev);

const total = r1 + r2 + r3;
console.log(`\n${total === 0 ? '✅ ولا رمشة بالحالات الثلاث' : `❌ المجموع: ${total} رمشة`}`);
await browser.close();
process.exit(total === 0 ? 0 : 1);
