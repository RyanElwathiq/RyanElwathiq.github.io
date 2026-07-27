// كنس شامل: كل الصفحات — أخطاء، روابط مكسورة، تمرير أفقي، عناصر محجوبة
import { chromium } from '@playwright/test';

const base = 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// نجيب كل الصفحات من خريطة الموقع
await page.goto(`${base}/sitemap-0.xml`);
const xml = await page.content();
const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace('https://ryanalali.me', '')
);

const report = { pages: pages.length, errors: [], broken: [], overflow: [], obstructed: [] };
const linkCache = new Map();

for (const p of pages) {
  const errs = [];
  const onErr = (e) => errs.push(`${p} :: ${e.message || e.text()}`);
  page.on('pageerror', onErr);
  page.on('console', (m) => m.type() === 'error' && errs.push(`${p} :: ${m.text()}`));

  await page.goto(base + p, { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(700);

  // تمرير أفقي؟
  // ⚠️ ما منقارن scrollWidth بعرض الشاشة — هذا بيعطي إنذار كاذب.
  //    شريط المهارات المتحرّك أعرض من الشاشة عمداً، بس مقصوص
  //    فالزائر ما بيقدر يمرّر. الفحص الصح: نجرّب نمرّر فعلاً.
  const of = await page.evaluate(async () => {
    const before = window.scrollX;
    window.scrollTo(400, window.scrollY);
    await new Promise((r) => setTimeout(r, 200));
    const moved = window.scrollX !== before;
    window.scrollTo(0, window.scrollY);
    return moved;
  });
  if (of) report.overflow.push(p);

  // روابط داخلية
  const hrefs = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href').split('#')[0])
  );
  for (const h of hrefs) {
    if (!h || linkCache.has(h)) continue;
    const r = await page.request.get(base + h).catch(() => null);
    const ok = r && r.ok();
    linkCache.set(h, ok);
    if (!ok) report.broken.push(`${p} → ${h}`);
  }

  // عناصر محجوبة عن الضغط (بعد نزول للنص)
  const bad = await page.evaluate(async () => {
    const NAV = 120;
    const H = document.documentElement.scrollHeight;
    const found = [];
    for (const frac of [0, 0.5, 1]) {
      const y = Math.round((H - innerHeight) * frac);
      window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 350));
      for (const el of document.querySelectorAll('a[href], button')) {
        const b = el.getBoundingClientRect();
        if (b.width < 8 || b.height < 8 || b.top < NAV || b.bottom > innerHeight) continue;
        const cs = getComputedStyle(el);
        if (cs.pointerEvents === 'none' || parseFloat(cs.opacity) < 0.05) continue;
        const hit = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        if (!hit || el === hit || el.contains(hit) || hit.contains(el)) continue;
        found.push((el.textContent || '').trim().slice(0, 22));
      }
    }
    return found;
  });
  if (bad.length) report.obstructed.push(`${p}: ${bad.join(', ')}`);

  report.errors.push(...errs);
  page.removeListener('pageerror', onErr);
}

console.log('صفحات مفحوصة   :', report.pages);
console.log('أخطاء           :', report.errors.length);
report.errors.slice(0, 6).forEach((e) => console.log('   !', e.slice(0, 150)));
console.log('روابط مكسورة    :', report.broken.length, report.broken.slice(0, 5));
console.log('تمرير أفقي      :', report.overflow.length, report.overflow.slice(0, 5));
console.log('عناصر محجوبة    :', report.obstructed.length, report.obstructed.slice(0, 5));

await browser.close();
