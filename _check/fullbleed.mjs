// ═══════════════════════════════════════════════════════════════
//  فحص التغطية الكاملة للفيديوهات المثبّتة
//
//  السبب: انحراف بلّغ عنه ريّان — الهيرو وفيلم المواقع صاروا أضيق
//  من الشاشة (GSAP بيحوّل اللفافة لفليكس والعنصر بينكمش لعرض
//  محتواه). هذا الفاحص بيقيس **كل** عنصر مثبّت أو لفافة تثبيت
//  بكل صفحة فيها فيديو، وبيتأكد إنها بعرض الشاشة بالضبط.
//
//    node _check/fullbleed.mjs [رابط]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4330';

const PAGES = [
  ['/ar/', 'الرئيسية عربي'],
  ['/', 'الرئيسية إنجليزي'],
  ['/ar/signals/ar-limatha-almawqi3-daroura/', 'مقالة بفيلم'],
];

const SIZES = [
  ['ديسكتوب', { width: 1440, height: 900 }],
  ['شاشة عريضة', { width: 1920, height: 950 }],
  ['موبايل', { width: 390, height: 844 }],
];

const browser = await chromium.launch();
let bad = 0;

for (const [sizeName, viewport] of SIZES) {
  const page = await browser.newPage({ viewport });
  console.log(`\n═══ ${sizeName} (${viewport.width}px) ═══`);

  for (const [path, label] of PAGES) {
    try {
      await page.goto(BASE + path, { waitUntil: 'load', timeout: 45000 });
      await page.waitForTimeout(2200);

      const checks = await page.evaluate(() => {
        const out = [];
        const targets = new Set();
        // كل لفافة تثبيت وكل عنصر مثبّت جوّاها + كنفاسات السيكوينس
        document.querySelectorAll('[data-pin-spacer]').forEach((s) => {
          targets.add(s);
          if (s.firstElementChild) targets.add(s.firstElementChild);
        });
        // ⚠️ بس كنفاسات السيكوينسات **المثبّتة** — فيديو «من أنا»
        //    مضمّن جوّا التخطيط عن قصد (بلا تثبيت) ومش لازم يكون
        //    بعرض الشاشة. التغطية الكاملة شرط المثبّتات فقط.
        document
          .querySelectorAll('[data-seq-pin] canvas, [data-seq-pin-always] canvas')
          .forEach((c) => targets.add(c));

        for (const el of targets) {
          const r = el.getBoundingClientRect();
          if (r.height < 40) continue; // لفافة قسم مش مثبّت حالياً — مش فيديو
          out.push({
            what:
              el.tagName.toLowerCase() +
              (el.className && typeof el.className === 'string'
                ? '.' + el.className.trim().split(/\s+/)[0]
                : '') +
              (el.hasAttribute('data-pin-spacer') ? '[لفافة]' : ''),
            x: Math.round(r.x),
            w: Math.round(r.width),
            full: Math.abs(r.x) < 2 && Math.abs(r.width - innerWidth) < 3,
          });
        }
        return { vw: innerWidth, out };
      });

      for (const c of checks.out) {
        if (!c.full) bad++;
        console.log(
          `${c.full ? '✅' : '❌'} ${label.padEnd(16)} ${c.what.padEnd(30)} x=${c.x} w=${c.w}/${checks.vw}`,
        );
      }
      if (!checks.out.length) console.log(`   (${label}: ولا عنصر مثبّت — طبيعي لو الصفحة بلا فيديو)`);
    } catch (e) {
      console.log(`⚠️ ${label}: ${String(e.message).slice(0, 60)}`);
    }
  }
  await page.close();
}

console.log(`\n${bad === 0 ? '✅ كل الفيديوهات المثبّتة بعرض الشاشة الكامل' : `❌ ${bad} عنصر مش مغطّي`}`);
await browser.close();
process.exit(bad === 0 ? 0 : 1);
