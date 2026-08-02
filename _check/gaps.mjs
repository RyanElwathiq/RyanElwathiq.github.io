// ═══════════════════════════════════════════════════════════════
//  فاحص الفراغ تحت الصور
//
//  المشكلة اللي بيدوّر عليها (شكوى ريّان المتكرّرة): بطاقة جوّاها
//  صورة بنسبتها الطبيعية، والبطاقة جوّا شبكة CSS. الشبكة بتمدّد
//  كل بطاقة لارتفاع أطول بطاقة بالصف (`align-items: stretch` هو
//  الافتراضي)، بس الصورة بتضل بنسبتها — فبيبين لون البطاقة
//  الداكن تحت الصورة كفراغ أسود بيكسّر شكل الصفحة.
//
//  الطريقة: منقيس كل عنصر جوّاه صورة وحدة، ومنقارن ارتفاع
//  العنصر بارتفاع الصورة. الفرق = الفراغ.
//
//    node _check/gaps.mjs <رابط> [عرض]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4330';
const W = +(process.argv[3] || 1440);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: 950 } });

// ─── نجمع صفحات الموقع من خريطة الروابط ───
await page.goto(BASE + '/ar/', { waitUntil: 'domcontentloaded' });
const links = await page.evaluate(() =>
  [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href')))],
);
const pages = [...new Set(['/ar/', '/', ...links])]
  .filter((h) => !h.includes('#') && !/\.(xml|txt|jpg|png|webp|pdf)$/i.test(h))
  .slice(0, 60);

const findings = [];

for (const path of pages) {
  try {
    await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 40000 });
    // ننزل لآخر الصفحة عشان الصور الكسولة تتحمّل والأقسام تنكشف
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 600) {
        window.__lenis?.scrollTo(y, { immediate: true }) ?? window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.__lenis?.scrollTo(0, { immediate: true }) ?? window.scrollTo(0, 0);
    });
    await page.waitForTimeout(900);

    const gaps = await page.evaluate(() => {
      const out = [];
      for (const img of document.querySelectorAll('img')) {
        const box = img.closest('figure, .shot, .frame, .card, li, article');
        if (!box) continue;
        // بس الحاويات اللي فيها صورة وحدة — غير هيك الفرق طبيعي
        if (box.querySelectorAll('img, video').length !== 1) continue;

        const bs = getComputedStyle(box);
        const bb = box.getBoundingClientRect();
        const ib = img.getBoundingClientRect();
        if (!bb.height || !ib.height) continue;

        // نطرح الحشوة والنص اللي جوّا الحاوية عن قصد
        const pad = parseFloat(bs.paddingTop) + parseFloat(bs.paddingBottom);
        let textH = 0;
        for (const c of box.children) {
          if (c === img || c.contains(img)) continue;
          const r = c.getBoundingClientRect();
          if (r.height) textH += r.height;
        }

        const gap = bb.height - ib.height - pad - textH;
        if (gap <= 14) continue;

        // فراغ حقيقي بس إذا كانت الحاوية إلها لون/حدود بتبيّن
        const painted =
          bs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(bs.borderTopWidth) > 0;
        if (!painted) continue;

        out.push({
          sel:
            box.tagName.toLowerCase() +
            (box.className && typeof box.className === 'string'
              ? '.' + box.className.trim().split(/\s+/).slice(0, 3).join('.')
              : ''),
          gap: Math.round(gap),
          pct: Math.round((gap / bb.height) * 100),
          src: img.currentSrc.split('/').slice(-2).join('/'),
        });
      }
      return out;
    });

    if (gaps.length) {
      // نجمّعهم حسب نوع الحاوية عشان التقرير يضل مقروء
      const byS = new Map();
      for (const g of gaps) {
        const e = byS.get(g.sel) || { n: 0, max: 0, maxPct: 0, ex: '' };
        e.n++;
        if (g.gap > e.max) {
          e.max = g.gap;
          e.maxPct = g.pct;
          e.ex = g.src;
        }
        byS.set(g.sel, e);
      }
      findings.push({ path, total: gaps.length, byS: [...byS.entries()] });
    }
    process.stdout.write(gaps.length ? '×' : '·');
  } catch {
    process.stdout.write('!');
  }
}

console.log(`\n\n═══ فراغات تحت الصور — عرض ${W}px ═══\n`);
if (!findings.length) {
  console.log('✅ ولا فراغ');
} else {
  let total = 0;
  for (const f of findings) {
    total += f.total;
    console.log(`${f.path}  (${f.total} صورة)`);
    for (const [sel, e] of f.byS) {
      console.log(`   ${sel.padEnd(30)} ×${String(e.n).padStart(3)}  أكبر فراغ ${e.max}px (${e.maxPct}%)  مثال: ${e.ex}`);
    }
  }
  console.log(`\nالمجموع: ${total} صورة بـ${findings.length} صفحة`);
}

await browser.close();
