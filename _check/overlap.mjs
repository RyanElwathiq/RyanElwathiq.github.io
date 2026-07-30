// ═══════════════════════════════════════════════════════════════
//  «لما أفوت على صفحة وأطلع منها الأقسام بتتداخل ببعض»
//
//  المرة اللي قبل جرّبت مسارين بس وما ظهر. هالمرة بنجرّب كل
//  الطرق اللي ممكن ريّان يستخدمها، وبكل الأحجام:
//
//   ١) زر الرجوع بالمتصفح بعد ما تفوت على صفحة مشروع
//   ٢) ضغط رابط بالقائمة (انتقال أسترو بدون إعادة تحميل)
//   ٣) الرجوع بعد ما تكون نزّلت لآخر الصفحة
//   ٤) تبديل اللغة ورجوع
//   ٥) انتقالين ورا بعض (أ ← ب ← ج ← رجوع رجوع)
//   ٦) رجوع والقائمة مفتوحة
//
//  بيقيس ٤ إشارات، مش شكل الصفحة:
//   • تداخل: قسم بيبدأ فوق نهاية اللي قبله
//   • ارتفاع الصفحة: لو زاد فجأة = مساحات تثبيت زايدة
//   • pin-spacer: مساحات ScrollTrigger — لو تضاعفت فهي السبب
//   • أخطاء الصفحة أثناء الانتقال («Transition was aborted»)
//
//  التشغيل: node _check/overlap.mjs [رابط]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4461';
const browser = await chromium.launch();

const SIZES = [
  { name: 'موبايل ', width: 390, height: 844 },
  { name: 'كمبيوتر', width: 1440, height: 900 },
];

// قياس حالة الصفحة — نفس القياس قبل وبعد
const snap = (page) =>
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
      const gap = boxes[i + 1].top - boxes[i].bottom;
      // ⚠️ عتبة ١٢ بكسل: بعض الأقسام مصمّمة تتداخل شوي بالتصميم
      if (gap < -12) bad.push(`${boxes[i].id} ↔ ${boxes[i + 1].id} (${gap}px)`);
    }

    return {
      sections: boxes.length,
      bad,
      docH: document.documentElement.scrollHeight,
      pins: document.querySelectorAll('.pin-spacer').length,
      overflow: getComputedStyle(document.body).overflow,
      y: Math.round(window.scrollY),
    };
  });

const settle = (page, ms = 2600) => page.waitForTimeout(ms);

// نمرّ على كل الصفحة عشان الصور الكسولة تنزّل، وبعدين نرجع لفوق
async function primeLazy(page) {
  await page.evaluate(async () => {
    const step = innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2200);
}

async function run(size, name, steps) {
  const page = await browser.newPage({ viewport: { width: size.width, height: size.height } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));

  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await settle(page);

  // ⚠️ لازم نمرّ على كل الصفحة قبل القياس الأول.
  //    بدون هالخطوة: الصور تحت الشاشة كسولة وما نزلت، فالأقسام
  //    بترجع بارتفاع ناقص. وبعد الرجوع بتكون نزلت وارتفاعها زاد —
  //    فبيطلع «الصفحة انتفخت ٩٣٧٦ بكسل» وهو مش عطل أصلاً.
  //    منقارن صفحة مقروءة بالكامل بصفحة مقروءة بالكامل.
  await primeLazy(page);
  const before = await snap(page);

  let note = '';
  try {
    note = (await steps(page)) || '';
  } catch (e) {
    note = 'فشل: ' + e.message.slice(0, 50);
  }
  await settle(page);
  const after = await snap(page);
  await page.close();

  const grew = after.docH - before.docH;
  const pinDiff = after.pins - before.pins;
  const broke =
    after.bad.length > before.bad.length ||
    Math.abs(grew) > 300 ||
    pinDiff !== 0 ||
    after.sections !== before.sections;

  console.log(
    `  ${broke ? '⚠️' : '✓ '} ${size.name} ${name.padEnd(26)} ` +
      `أقسام ${before.sections}→${after.sections} · ` +
      `ارتفاع ${grew >= 0 ? '+' : ''}${grew} · ` +
      `تثبيت ${before.pins}→${after.pins} · ` +
      `تداخل ${before.bad.length}→${after.bad.length}` +
      (note ? ` · ${note}` : '')
  );
  if (after.bad.length) after.bad.slice(0, 3).forEach((b) => console.log(`        ↳ ${b}`));
  if (errs.length) console.log(`        ✗ ${errs[0].slice(0, 80)}`);
  return broke;
}

// ─── السيناريوهات ───
const scenarios = [
  [
    'رجوع بعد صفحة مشروع',
    async (p) => {
      await p.goto(base + '/work/luvit/', { waitUntil: 'networkidle' });
      await settle(p, 2000);
      await p.goBack();
    },
  ],
  [
    'رجوع بعد نزول للآخر',
    async (p) => {
      await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75));
      await settle(p, 1500);
      await p.goto(base + '/work/dr-samir/', { waitUntil: 'networkidle' });
      await settle(p, 2000);
      await p.goBack();
    },
  ],
  [
    'انتقال بالقائمة',
    async (p) => {
      const link = p.locator('a[href$="/designs/"]').first();
      if (!(await link.count())) return 'ما لقيت الرابط';
      await link.click({ force: true });
      await settle(p, 2200);
      await p.goBack();
    },
  ],
  [
    'تبديل اللغة ورجوع',
    async (p) => {
      await p.goto(base + '/ar/', { waitUntil: 'networkidle' });
      await settle(p, 2200);
      await p.goBack();
    },
  ],
  [
    'انتقالين ورا بعض',
    async (p) => {
      await p.goto(base + '/designs/', { waitUntil: 'networkidle' });
      await settle(p, 1600);
      await p.goto(base + '/videos/', { waitUntil: 'networkidle' });
      await settle(p, 1600);
      await p.goBack();
      await settle(p, 1600);
      await p.goBack();
    },
  ],
  [
    'رجوع والقائمة مفتوحة',
    async (p) => {
      const burger = p.locator('[data-menu-toggle], .burger, button[aria-label*="enu"]').first();
      if (await burger.count()) {
        await burger.click({ force: true });
        await settle(p, 900);
      }
      await p.goto(base + '/loss/', { waitUntil: 'networkidle' });
      await settle(p, 2000);
      await p.goBack();
    },
  ],
];

console.log('\n═══ تداخل الأقسام بعد التنقّل ═══\n');
let hits = 0;
for (const size of SIZES) {
  for (const [name, steps] of scenarios) {
    if (await run(size, name, steps)) hits++;
  }
  console.log();
}

console.log(hits === 0 ? '✓ ما ظهر أي تداخل بأي مسار\n' : `⚠️ ${hits} مسار فيه مشكلة\n`);
await browser.close();
