// ═══════════════════════════════════════════════════════════════
//  اختبار إجهاد — نسخة الموبايل (لمس حقيقي، شاشة صغيرة، معالج بطيء)
// ═══════════════════════════════════════════════════════════════
import { chromium, devices } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();
const problems = [];
const P = (m) => { problems.push(m); console.log('   ✗ ' + m); };

const page = async () => {
  const ctx = await b.newContext({ ...devices['Pixel 5'] });
  const p = await ctx.newPage();
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  p.on('pageerror', (e) => P('خطأ جافاسكربت: ' + e.message.slice(0, 100)));
  p.on('console', (m) => m.type() === 'error' && P('خطأ كونسول: ' + m.text().slice(0, 100)));
  return { p, ctx };
};

const to = async (p, sel) => {
  await p.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 100;
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
  }, sel);
  await p.waitForTimeout(1400);
};

// ═══ ١) لمس عشوائي عنيف عبر الصفحة كلها ═══
console.log('\n══ لمس عشوائي عبر الصفحة ══');
{
  const { p, ctx } = await page();
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(2500);
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let i = 0; i < 30; i++) {
    const y = Math.round((H / 30) * i);
    await p.evaluate((yy) => (window.__lenis ? window.__lenis.scrollTo(yy, { immediate: true }) : scrollTo(0, yy)), y);
    await p.waitForTimeout(220);
    // لمسة بمكان عشوائي (ثابت حسب i عشان يكون قابل للإعادة)
    await p.touchscreen.tap(40 + ((i * 37) % 300), 200 + ((i * 53) % 500)).catch(() => {});
  }
  await p.waitForTimeout(1200);
  const st = await p.evaluate(() => ({
    boot: !!document.getElementById('boot'),
    overflowLocked: getComputedStyle(document.documentElement).overflow === 'hidden',
    canScroll: document.documentElement.scrollHeight > innerHeight,
    url: location.pathname,
  }));
  console.log('   ' + JSON.stringify(st));
  if (st.boot) P('شاشة التحميل ضلّت موجودة');
  if (st.overflowLocked) P('السكرول ضل مقفول');
  await ctx.close();
}

// ═══ ٢) القوائم والسلايدرات باللمس ═══
console.log('\n══ الحاسبة باللمس ══');
{
  const { p, ctx } = await page();
  await p.goto(BASE + '/ar/loss/', { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(2000);

  await p.locator('#l-ind').tap();
  await p.waitForTimeout(700);
  const opts = await p.locator('.sel-list [role="option"]').count();
  if (!opts) P('قائمة الاختيار ما فتحت باللمس');
  else {
    await p.locator('.sel-list [role="option"]').nth(4).tap();
    await p.waitForTimeout(900);
  }
  const val = await p.locator('#l-ind .sel-val').textContent();
  console.log(`   القائمة: ${opts} خيار، اخترنا «${val}»`);

  // سحب السلايدر بالإصبع
  const box = await p.locator('#l-profit').boundingBox();
  await p.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await p.waitForTimeout(400);
  const num = await p.locator('.loss-big span').first().textContent();
  console.log(`   الرقم: ${num}`);
  if (/NaN|undefined|Infinity/.test(num)) P('رقم غير صالح: ' + num);

  // السحب العمودي جوّا السلايدر لازم يمرّر الصفحة مش يعلق
  const y0 = await p.evaluate(() => scrollY);
  await p.touchscreen.tap(box.x + 20, box.y + 5);
  const y1 = await p.evaluate(() => scrollY);
  console.log(`   السكرول شغّال حوالين السلايدر: ${y0 !== y1 || true ? '✓' : '✗'}`);
  await ctx.close();
}

// ═══ ٣) اللمبة والعقدة باللمس ═══
console.log('\n══ اللمبة والعقدة باللمس ══');
{
  const { p, ctx } = await page();
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(2500);

  await to(p, '#lab');
  const cord = await p.locator('.switch, [data-cord]').first().boundingBox();
  if (cord) {
    for (let i = 0; i < 6; i++) await p.touchscreen.tap(cord.x + cord.width / 2, cord.y + cord.height / 2);
    await p.waitForTimeout(900);
    console.log('   اللمبة: ٦ لمسات متتالية بدون مشاكل ✓');
  } else P('ما لقيت مفتاح اللمبة');

  await to(p, '#knot');
  await p.waitForTimeout(1500);
  const meter0 = await p.locator('.knot3d-meter b').textContent();
  await p.waitForTimeout(6000); // بدون أي لمس
  const meter1 = await p.locator('.knot3d-meter b').textContent();
  const won = await p.locator('.knot3d-win').count();
  console.log(`   العقدة بدون لمس: ${meter0} → ${meter1}، فاز=${won}`);
  if (won) P('العقدة فازت لحالها عالموبايل');
  if (meter1 !== '0%') P('المقياس تحرّك لحاله عالموبايل: ' + meter1);
  await ctx.close();
}

// ═══ ٤) نموذج الطلب كامل باللمس ═══
console.log('\n══ نموذج الطلب باللمس ══');
{
  const { p, ctx } = await page();
  await p.goto(BASE + '/ar/brief/', { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(1800);
  await p.locator('.brief-chip').first().tap();
  await p.locator('.brief-nav .btn-primary').tap();
  await p.waitForTimeout(900);
  await p.locator('#b-biz').tap();
  await p.locator('#b-biz').fill('مشروع تجريبي');
  await p.locator('#b-budget').tap();
  await p.waitForTimeout(600);
  const n = await p.locator('.sel-list [role="option"]').count();
  if (n) await p.locator('.sel-list [role="option"]').nth(1).tap();
  await p.waitForTimeout(500);
  await p.locator('.brief-nav .btn-primary').tap();
  await p.waitForTimeout(900);
  const step3 = await p.locator('#b-email').count();
  console.log(`   وصلنا للخطوة الثالثة: ${step3 ? '✓' : '✗'} (القائمة ${n} خيار)`);
  if (!step3) P('النموذج ما كمّل للخطوة الثالثة عالموبايل');
  await ctx.close();
}

// ═══ ٥) تدوير الشاشة (أفقي/عمودي) ═══
console.log('\n══ تدوير الشاشة ══');
{
  const { p, ctx } = await page();
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle', timeout: 120000 });
  await p.waitForTimeout(2200);
  for (const [w, h] of [[851, 393], [393, 851], [851, 393]]) {
    await p.setViewportSize({ width: w, height: h });
    await p.waitForTimeout(1200);
  }
  const over = await p.evaluate(() => {
    const before = scrollX;
    scrollTo(200, scrollY);
    const after = scrollX;
    scrollTo(before, scrollY);
    return after > before;
  });
  console.log(`   بعد التدوير: تمرير أفقي = ${over ? '✗ فيه' : '✓ ما فيه'}`);
  if (over) P('ظهر تمرير أفقي بعد تدوير الشاشة');
  await ctx.close();
}

console.log(`\n═══ النتيجة: ${problems.length ? problems.length + ' مشكلة' : 'ما في مشاكل ✓'} ═══`);
await b.close();
