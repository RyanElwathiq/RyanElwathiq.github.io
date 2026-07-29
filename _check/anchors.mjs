// ═══════════════════════════════════════════════════════════════
//  فحص دقّة الروابط الداخلية (#work، #signals، #faq …)
//
//  ليش مهم: حطّينا content-visibility عالموبايل، وهي بتخلّي
//  المتصفح يقدّر ارتفاع الأقسام اللي برّا الشاشة بدل ما يحسبه.
//  لو الحسبة طاشت، الضغط على «الأسئلة» بيوقّفك بمكان غلط —
//  وهاي بالضبط فئة الأعطال اللي تعبنا فيها بهالمشروع.
//
//  المقياس: بعد الضغط، لازم أعلى القسم يكون قريب من أعلى الشاشة
//  (بحدود ارتفاع النافبار ± ٦٠ بكسل).
//
//  التشغيل: node _check/anchors.mjs [رابط] [عرض]
// ═══════════════════════════════════════════════════════════════
import { chromium, devices } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4412';
const width = +(process.argv[3] || 390);
const TOLERANCE = 60; // بكسل مسموحة
const NAV = 118; // ارتفاع الكبسولة اللي بنعوّضه بالأنكور

const browser = await chromium.launch();

async function check(path) {
  const ctx =
    width < 700
      ? await browser.newContext({ ...devices['Pixel 5'] })
      : await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);

  const ids = await page.evaluate(() =>
    // ⚠️ الأقسام بس — مش حقول النماذج (l-ind، biz-name…) لأنها
    //    مش أهداف تنقّل أصلاً
    [...document.querySelectorAll('main section[id], main > [id]')].map((e) => e.id).filter(Boolean)
  );

  const out = [];
  for (const id of ids) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    // نستخدم نفس الطريق اللي بيستخدمه الزائر: رابط أنكور
    await page.evaluate((i) => {
      const a = document.createElement('a');
      a.href = '#' + i;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }, id);

    // ⚠️ لازم نستنّى الحركة **تبدأ** قبل ما نستنّاها تخلص.
    //    أول نسخة كانت تقيس فوراً، فبتلاقي الصفحة لسا مكانها
    //    وبتحسبها «استقرّت» — فطلع الفحص إنه كل الروابط مكسورة
    //    بينما هي شغّالة تماماً. الفحص كان غلط مش الموقع.
    await page.waitForTimeout(900);
    let last = -1;
    let stable = 0;
    for (let i = 0; i < 60; i++) {
      const y = await page.evaluate(() => Math.round(window.scrollY));
      stable = y === last ? stable + 1 : 0;
      if (stable >= 3) break;
      last = y;
      await page.waitForTimeout(120);
    }

    const top = await page.evaluate((i) => {
      const el = document.getElementById(i);
      return el ? Math.round(el.getBoundingClientRect().top) : null;
    }, id);
    if (top === null) continue;
    // القسم لازم يوقف تحت الكبسولة تقريباً
    const off = Math.abs(top - NAV);
    out.push({ id, top, off, ok: off <= TOLERANCE });
  }

  await ctx.close();
  return out;
}

for (const path of ['/', '/ar/']) {
  const r = await check(path);
  const bad = r.filter((x) => !x.ok);
  console.log(`\n═══ ${path} · ${width < 700 ? 'موبايل' : 'ديسكتوب'} ═══`);
  console.log(`  ${r.length - bad.length}/${r.length} أنكور بمكانه الصحيح`);
  bad.forEach((x) => console.log(`  ⚠️ #${x.id} وقف على ${x.top}px (بعيد ${x.off}px)`));
  if (!bad.length) console.log('  ✓ كلهم مضبوطين');
}

await browser.close();
