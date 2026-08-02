// ═══════════════════════════════════════════════════════════════
//  فحص دورات التنقل: بينتقل بين الصفحات كذا مرة وبعدها بيجرّب
//  الأشياء اللي بتتكسر بالتراكم:
//   ١) فتح فيديو (عطل اللايت-بوكس: مستمعين متراكمين ماسكين
//      نوافذ صفحات محذوفة — كل ضغطة كانت ترمي أخطاء)
//   ٢) عدد مستمعي السكرول (تسريب شبكة أمان الظهور بـ Base)
//   ٣) صفر أخطاء كونسول طول الدورة
//
//    node _check/navcycle.mjs [رابط]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4330';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));

// منراقب كم مستمع سكرول مسجّل على window (كشف التراكم)
await page.addInitScript(() => {
  window.__scrollListeners = 0;
  const origAdd = window.addEventListener.bind(window);
  const origRemove = window.removeEventListener.bind(window);
  window.addEventListener = (t, ...a) => {
    if (t === 'scroll') window.__scrollListeners++;
    return origAdd(t, ...a);
  };
  window.removeEventListener = (t, ...a) => {
    if (t === 'scroll') window.__scrollListeners--;
    return origRemove(t, ...a);
  };
});

await page.goto(BASE + '/ar/', { waitUntil: 'load' });
await page.waitForTimeout(1500);
const before = await page.evaluate(() => window.__scrollListeners);

// ─── ٨ انتقالات ذهاب-إياب ───
for (let i = 0; i < 4; i++) {
  await page.click('a[href="/ar/designs/"]');
  await page.waitForTimeout(900);
  await page.goBack();
  await page.waitForTimeout(900);
}
const after = await page.evaluate(() => window.__scrollListeners);

console.log(`مستمعي السكرول: قبل ${before} ← بعد ٨ انتقالات ${after}`);
const leak = after - before;
console.log(leak > 4 ? `❌ تراكم واضح (+${leak})` : `✅ بلا تراكم يذكر (+${leak})`);

// ─── فتح فيديو بعد كل هالدورات ───
await page.click('a[href="/ar/videos/"]');
await page.waitForTimeout(1200);
const errsBefore = errors.length;
const played = await page
  .evaluate(() => {
    const btn = document.querySelector('[data-play]');
    if (!btn) return false;
    btn.click();
    return true;
  })
  .catch(() => false);
await page.waitForTimeout(900);

const dlgOpen = await page.evaluate(
  () => !!document.querySelector('[data-lightbox]')?.open,
);
const clickErrs = errors.length - errsBefore;
console.log(
  `فتح الفيديو: ${played ? (dlgOpen ? '✅ النافذة فتحت' : '❌ ما فتحت') : '⚠️ ما لقيت زر'} · أخطاء الضغطة: ${clickErrs === 0 ? '✅ صفر' : '❌ ' + clickErrs}`,
);

console.log(`\nأخطاء الكونسول طول الدورة: ${errors.length === 0 ? '✅ صفر' : '❌ ' + errors.length}`);
errors.slice(0, 6).forEach((e) => console.log('  ! ' + e.slice(0, 130)));

const ok = leak <= 4 && dlgOpen && clickErrs === 0 && errors.length === 0;
await browser.close();
process.exit(ok ? 0 : 1);
