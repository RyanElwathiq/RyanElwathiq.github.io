// فحص Google Analytics (مهمة #65)
//   node _check/gacheck.mjs                    ← محلي: بيتأكد إنه GA **ما بيشتغل**
//   node _check/gacheck.mjs https://ryanalali.me ← حي: بيتأكد إنه بيبعت page_view
//                                                 عالتحميل وعالتنقل الداخلي
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4330';
const isLive = BASE.includes('ryanalali.me');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

let fail = 0;
const check = (ok, msg) => {
  if (!ok) fail++;
  console.log(`  ${ok ? '✅' : '❌'} ${msg}`);
};

const gaLoads = [];
const pageViews = [];
const cfLoads = [];
page.on('request', (r) => {
  const u = r.url();
  if (u.includes('googletagmanager.com/gtag/js')) gaLoads.push(u);
  if (u.includes('cloudflareinsights.com')) cfLoads.push(u);
  // GA4 بيبعت الأحداث على /g/collect — و page_view بيظهر بـ en=
  if (u.includes('/g/collect')) {
    const en = new URL(u).searchParams.get('en');
    pageViews.push(en);
  }
});

console.log(isLive ? '\n═══ فحص الموقع الحي ═══' : '\n═══ فحص محلي (لازم GA يكون نايم) ═══');
await page.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);

if (!isLive) {
  // محلياً: الحارسان لازم يمنعوا التحميل كلياً
  check(gaLoads.length === 0, `سكربت GA ما اتحمّل محلياً (${gaLoads.length})`);
  check(cfLoads.length === 0, `سكربت كلاودفلير ما اتحمّل محلياً (${cfLoads.length})`);
  check(pageViews.length === 0, 'ولا حدث انبعت محلياً');
  const hasTag = await page.evaluate(() => typeof window.gtag);
  check(hasTag === 'undefined', 'gtag مش معرّف محلياً');
} else {
  // حي: التحميل + page_view الأولى
  check(gaLoads.length > 0, 'سكربت GA اتحمّل');
  check(cfLoads.length > 0, 'سكربت كلاودفلير اتحمّل');
  const pv1 = pageViews.filter((e) => e === 'page_view').length;
  check(pv1 >= 1, `page_view انبعتت عالتحميل الأول (${pv1})`);

  // التنقل الداخلي (ClientRouter بدون إعادة تحميل) لازم يبعت وحدة جديدة
  const before = pageViews.filter((e) => e === 'page_view').length;
  await page.click('a[href="/ar/signals/"]');
  await page.waitForTimeout(3000);
  const after = pageViews.filter((e) => e === 'page_view').length;
  check(after > before, `التنقل الداخلي بعت page_view جديدة (${before} → ${after})`);
  check(after - before <= 1, 'وبلا عدّ مزدوج');
}

console.log(fail ? `\n❌ ${fail} فشل` : '\n✅ GA مضبوط');
await browser.close();
process.exit(fail ? 1 : 0);
