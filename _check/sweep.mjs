// كنس شامل: كل الصفحات — أخطاء، روابط مكسورة، تمرير أفقي، عناصر محجوبة
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4321';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// نجيب كل الصفحات من خريطة الموقع
await page.goto(`${base}/sitemap-0.xml`);
const xml = await page.content();
const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace('https://ryanalali.me', '')
);

const report = { pages: pages.length, errors: [], broken: [], overflow: [], obstructed: [], noise: [] };
const linkCache = new Map();

for (const p of pages) {
  const errs = [];
  // ⚠️ pageerror بيلتقط كمان استثناءات **إطارات** الصفحة — ومشغّل
  //    يوتيوب برمي أخطاء داخلية مصغّرة (زي «I`null») لما شبكته
  //    تتعثّر. منفحص الـ stack: لو بيشاور على يوتيوب فهو ضجيجهم،
  //    ولو رسالة مصغّرة بلا أي stack من ملفاتنا فمش منّا.
  const onErr = (e) => {
    const stack = String(e.stack || '');
    if (/youtube|ytimg|googlevideo/.test(stack)) {
      report.noise.push(`${p} :: [يوتيوب] ${String(e.message).slice(0, 60)}`);
      return;
    }
    if (!stack.includes(base) && /^[A-Za-z$_]{1,3}`/.test(String(e.message || ''))) {
      report.noise.push(`${p} :: [مصغّر خارجي] ${String(e.message).slice(0, 60)}`);
      return;
    }
    errs.push(`${p} :: ${e.message || e.text()}`);
  };
  page.on('pageerror', onErr);
  // ⚠️ منتجاهل رسائل الأخطاء الجاية من إطارات خارجية (يوتيوب).
  //    مشغّل يوتيوب بيسجّل أخطاءه الداخلية بكونسول الصفحة الأم،
  //    وهاي مش أخطاءنا وما منقدر نصلّحها — وكانت بتطلع إنذار كاذب
  //    على صفحات المشاريع اللي فيها فيديوهات.
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const from = m.location()?.url || '';
    if (/youtube|ytimg|googlevideo|doubleclick/.test(from)) return;
    // ⚠️ منحسب علينا بس الأخطاء اللي مصدرها ملفاتنا نفسها.
    //    مشغّل يوتيوب أحياناً بيسجّل أخطاءه **بدون عنوان مصدر**
    //    (طلع مرة «I`null» — كود مصغّر تبعه، وأكّدنا بالبحث إنه
    //    مش موجود بولا ملف من ملفاتنا) فكان بيمرق من فلتر العناوين
    //    وبيطلع إنذار كاذب. الأعطال الحقيقية بكودنا بتيجي دايماً
    //    بمصدر واضح، أو من pageerror اللي بيضل محسوب دايماً.
    if (!from.startsWith(base)) {
      report.noise.push(`${p} :: [${from || 'بلا مصدر'}] ${m.text().slice(0, 80)}`);
      return;
    }
    errs.push(`${p} :: ${m.text()}`);
  });

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
        // ⚠️ عناصر جوّا <details> مسكّرة مش «محجوبة» — هي مخفية عن
        //    قصد لحد ما تنفتح القائمة. كانت روابط قائمة الخدمات
        //    المنسدلة تطلع إنذار كاذب بكل صفحة من صفحات الموقع.
        const dd = el.closest('details');
        if (dd && !dd.open) continue;
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
if (report.noise.length) {
  console.log('ضجيج خارجي (للعلم، مش محسوب):', report.noise.length);
  report.noise.slice(0, 3).forEach((e) => console.log('   ~', e.slice(0, 120)));
}

await browser.close();
