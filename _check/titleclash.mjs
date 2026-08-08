// ═══════════════════════════════════════════════════════════════
//  كاشف تصادم العناوين (2026-08-08)
//
//  ليش؟ لأنه جوجل رفض يفهرس /websites/ بالضبط لهالسبب: كان
//  عنوانها بيستهدف نفس كلمات /services/websites/، فاعتبرهم
//  صفحتين على نفس السؤال واختار وحدة.
//
//  السكربت بيقارن كلمات كل عنوان مع كل عنوان تاني (بعد ما يشيل
//  كلمات الوصل) وبيطلّع أي زوج تشابهه ٦٠٪ أو أكثر.
//
//  ⚠️ صفحات /li/ و/ig/ مستثناة — هي تحويلات عليها noindex.
//
//  التشغيل: node _check/titleclash.mjs   (بعد npm run build)
// ═══════════════════════════════════════════════════════════════
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const D = 'dist';
const walk = (d, a = []) => {
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) walk(p, a);
    else if (f.name === 'index.html') a.push(p);
  }
  return a;
};

const SKIP = /[\\/](li|ig)[\\/]/;
const STOP = new Set(
  ('the and a an in of to for that with you i it is my me not just how what your' +
   ' rayan elwathiq jordan' +
   ' من في على مش بس عن اللي هاي هاد ريان ريّان الواثق').split(/\s+/),
);

// ⚠️ \p{M} لازم تكون بالمجموعة المسموحة: بدونها الشدّة والحركات
//    بتنشال وبتنكسر الكلمة العربية لنصين («ريّان» ← «ري» + «ان»)،
//    والنتيجة تصادمات وهمية بالجملة.
const key = (t) =>
  new Set(
    t.toLowerCase().replace(/[^\p{L}\p{N}\p{M}\s]/gu, ' ').split(/\s+/)
      .filter((w) => w.length > 1 && !STOP.has(w)),
  );

const rows = walk(D)
  .filter((p) => !SKIP.test(p))
  .map((p) => {
    const h = readFileSync(p, 'utf8');
    const t = ((h.match(/<title>([^<]*)</) || [])[1] || '').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
    return {
      url: '/' + p.replace(/^dist[\\/]/, '').replace(/index\.html$/, '').replace(/\\/g, '/'),
      t,
      k: key(t),
    };
  });

const hits = [];
for (let i = 0; i < rows.length; i++) {
  for (let j = i + 1; j < rows.length; j++) {
    const a = rows[i], b = rows[j];
    // عنوان بكلمتين معنويتين ما بينفع نحكم عليه — أي مشترك بيطلع نسبة عالية
    if (a.k.size < 3 || b.k.size < 3) continue;
    // نتجاهل زوج العربي/الإنجليزي لنفس الصفحة — هدول hreflang مش تصادم
    if (a.url.replace('/ar/', '/') === b.url.replace('/ar/', '/')) continue;
    const inter = [...a.k].filter((w) => b.k.has(w)).length;
    const sim = inter / Math.min(a.k.size, b.k.size);
    if (sim >= 0.6) hits.push([Math.round(sim * 100), a, b]);
  }
}
hits.sort((x, y) => y[0] - x[0]);

console.log(`فُحص ${rows.length} صفحة`);
if (!hits.length) console.log('✅ ولا تصادم عناوين');
else {
  console.log(`⚠️ ${hits.length} زوج متصادم:`);
  hits.slice(0, 10).forEach(([s, a, b]) =>
    console.log(`  ${s}%  ${a.url}  ↔  ${b.url}\n       "${a.t}"\n       "${b.t}"`),
  );
}
