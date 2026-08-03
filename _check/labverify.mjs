// فحص «لمبة الأفكار» الشامل — عربي وإنجليزي عالموقع الحي
//   node _check/labverify.mjs [رابط]
//  بيفحص: التعبئة والتوليد · الفكرة المحلية بتظهر · فكرة الذكاء
//  الاصطناعي بتوصل (أو رسالة الحد بترجع بأدب) · **وأهم شي**:
//  زر «راسلني» متعبى بسياق الزائر كامل + الفكرة (وعد «بتوصلني»)
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.argv[2] || 'https://ryanalali.me';
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));

let ideaStatus = 0;
page.on('response', (r) => {
  if (r.url().includes('/idea') && r.request().method() === 'POST') ideaStatus = r.status();
});

let fail = 0;
const check = (ok, msg) => {
  if (!ok) fail++;
  console.log(`  ${ok ? '✅' : '❌'} ${msg}`);
};

// ⚠️ الرئيسية فيها أقسام مثبّتة (GSAP) وسكرول ناعم — القفز الآلي
//    الفوري (scrollIntoView) بيخلي التثبيتات تعيد حساباتها والعناصر
//    تتحرك لحظة الكبسة. الحل: سكرول بالعجلة تدريجياً زي إنسان
//    حقيقي لحد ما العنصر يستقر بنص الشاشة، بعدين كبسة عادية
//    (بفحص التصادم الكامل — يعني لو في غطا حقيقي بتفشل).
async function clickCentered(locator) {
  const page = locator.page();
  for (let i = 0; i < 60; i++) {
    const box = await locator.boundingBox();
    if (box) {
      const vh = 950;
      const center = box.y + box.height / 2;
      const off = center - vh / 2;
      if (Math.abs(off) < 120) break;
      await page.mouse.wheel(0, Math.max(-600, Math.min(600, off)));
    } else {
      await page.mouse.wheel(0, 500);
    }
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(700); // التثبيتات والسكرول الناعم يستقروا
  await locator.click({ timeout: 8000 });
}

const PAGES = [
  { path: '/ar/', notes: 'مطعمي بالزرقاء والليل فاضي تماماً', bizName: 'مطعم الاختبار' },
  { path: '/', notes: 'my cafe is empty on weekday nights', bizName: 'Test Cafe' },
];

for (const P of PAGES) {
  console.log(`\n${P.path}`);
  ideaStatus = 0;
  await page.goto(BASE + P.path, { waitUntil: 'networkidle' });
  const lab = page.locator('#lab');
  await lab.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);

  // ٠) سحب الحبل — القسم مقفول عن قصد لحد ما اللمبة تضوي
  //    (لمسة سريعة عالمقبض بتشغّلها — نفس تجربة الزائر)
  await clickCentered(lab.locator('[data-cord]'));
  await page.waitForTimeout(900);
  check(await lab.evaluate((el) => el.hasAttribute('data-lit')), 'الحبل اشتغل واللمبة ضوت');

  // ١) التعبئة: مجال + هدف + اسم + تفاصيل
  await clickCentered(lab.locator('[data-industry]').first());
  await clickCentered(lab.locator('[data-goal]').first());
  const inputs = lab.locator('input[type="text"], input:not([type]), textarea');
  await lab.locator('input').first().fill(P.bizName);
  await lab.locator('textarea').first().fill(P.notes);

  // ٢) التوليد
  await clickCentered(lab.locator('[data-generate]'));
  await page.waitForTimeout(1200);
  const result = lab.locator('[data-lab-result]');
  check(!(await result.isHidden()), 'شاشة النتيجة ظهرت');

  // ٣) الفكرة المحلية (الهوك والفورمات) اتعبت فوراً
  const hook = (await lab.locator('[data-r-hook]').textContent())?.trim() || '';
  check(hook.length > 10, `الفكرة المحلية موجودة: «${hook.slice(0, 50)}...»`);

  // ٤) فكرة الذكاء الاصطناعي — منستنى الرد (لحد ٢٥ ثانية)
  let aiText = '';
  for (let i = 0; i < 25 && !aiText; i++) {
    await page.waitForTimeout(1000);
    aiText = (await lab.locator('[data-ai-text]').textContent())?.trim() || '';
  }
  if (ideaStatus === 429) {
    console.log('     (وصلنا حد اليوم من فحوصات سابقة — الرسالة اللطيفة بتظهر بدل الفكرة)');
    check(aiText.length > 10, `رسالة الحد ظهرت بأدب: «${aiText.slice(0, 60)}...»`);
  } else {
    check(ideaStatus === 200, `استدعاء المحرّك رجع ${ideaStatus}`);
    check(aiText.length > 20, `فكرة الذكاء وصلت: «${aiText.slice(0, 60)}...»`);
  }

  // ٥) الوعد: «بتوصلني لو تواصلت» — الإيميل متعبى بالسياق كامل
  const mailHref = (await lab.locator('[data-ask-mail]').getAttribute('href')) || '';
  const decoded = decodeURIComponent(mailHref);
  check(mailHref.startsWith('mailto:'), 'زر التواصل رابط إيميل');
  check(decoded.includes(P.notes), 'تفاصيل الزائر جوّا الإيميل (السياق بيوصل)');
  check(decoded.includes(P.bizName), 'اسم المشروع جوّا الإيميل');
  check(decoded.includes(hook.slice(0, 20)), 'الفكرة نفسها جوّا الإيميل');
}

// لقطة النتيجة (عربي)
await page.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
const lab = page.locator('#lab');
await lab.scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await clickCentered(lab.locator('[data-cord]'));
await page.waitForTimeout(900);
await clickCentered(lab.locator('[data-industry]').first());
await clickCentered(lab.locator('[data-goal]').nth(1));
await lab.locator('textarea').first().fill('محل حلويات والزباين بيجوا مرة وما بيرجعوا');
await clickCentered(lab.locator('[data-generate]'));
await page.waitForTimeout(9000);
await lab.screenshot({ path: '_check/out/lab-live.png' });

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
console.log(fail || errors.length ? `\n❌ ${fail} فشل` : '\n✅ لمبة الأفكار شغالة ١٠٠٪ والوعد صادق');
await browser.close();
process.exit(fail || errors.length ? 1 : 0);
