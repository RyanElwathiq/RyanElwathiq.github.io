// ═══════════════════════════════════════════════════════════════
//  فحص التطابق بين النسختين + فحص الخطوط
//
//  بيجاوب على سؤالين طلبهم ريّان:
//   ١) هل كل إشي بالموقع موجود بالإنجليزي كمان؟
//   ٢) هل كل إشي ماشي على الخط المعتمد؟
//
//  كيف بيشتغل:
//   • بيقارن كل صفحة عربية بمقابلتها الإنجليزية: نفس الأقسام؟
//     نفس عدد العناوين؟
//   • بيدوّر على نص عربي متسرّب بصفحة إنجليزية (والعكس) —
//     وهاي أكثر حالة بتصير: قسم انبنى بلغة وحدة وانحط بالاثنتين
//   • بيقرأ الخط الفعلي المستخدم لكل عنصر نص وبيقارنه بالمعتمد
//
//  التشغيل: node _check/parity.mjs [رابط]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4438';

// الخطوط المعتمدة (من tokens.css)
const OK_FONTS = ['space grotesk', 'alexandria'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`${base}/sitemap-0.xml`);
const xml = await page.content();
const all = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
  m[1].replace('https://ryanalali.me', '')
);

// أزواج: الصفحة الإنجليزية ومقابلتها العربية
const pairs = all
  .filter((p) => !p.startsWith('/ar/'))
  .map((en) => ({ en, ar: '/ar' + (en === '/' ? '/' : en) }))
  .filter((p) => all.includes(p.ar));

// ⚠️ مقالات «إشارات» إلها روابط مختلفة بكل لغة عن قصد — الرابط
//    جزء من السيو، فما بنترجم الرابط حرفياً. فبنقارنهم بالعدد
//    مش بالاسم، وإلا الفحص بيصرخ على إشي مضبوط.
const isPost = (p) => /\/signals\/[^/]+\//.test(p);
const postsEn = all.filter((p) => isPost(p) && !p.startsWith('/ar/'));
const postsAr = all.filter((p) => isPost(p) && p.startsWith('/ar/'));
const postGap = postsEn.length !== postsAr.length;

const orphansEn = all.filter(
  (p) => !p.startsWith('/ar/') && !isPost(p) && !all.includes('/ar' + (p === '/' ? '/' : p))
);
const orphansAr = all.filter(
  (p) => p.startsWith('/ar/') && !isPost(p) && !all.includes(p.replace(/^\/ar/, '') || '/')
);

async function scan(url) {
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  return page.evaluate((OK) => {
    const AR = /[؀-ۿ]/;
    const LAT = /[A-Za-z]{4,}/;

    const lang = document.documentElement.lang;
    const sections = [...document.querySelectorAll('main [id]')].map((e) => e.id);
    const headings = [...document.querySelectorAll('main h1, main h2, main h3')].map((h) =>
      (h.textContent || '').trim()
    );

    // ─── الخطوط ───
    // ⚠️ سكربتات وستايلات مش نصوص للزائر — بدونها الفحص بيعدّ
    //    كود الجافاسكربت كـ«نص إنجليزي متسرّب» بصفحة عربية
    const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'svg', 'path']);
    const isText = (el) => !SKIP.has(el.tagName) && !el.closest('script, style, noscript, template, svg');

    const badFonts = new Map();
    const seen = new Set();
    document.querySelectorAll('main *').forEach((el) => {
      const txt = (el.textContent || '').trim();
      if (!txt || el.children.length || !isText(el)) return; // العناصر الورقية بس
      const f = getComputedStyle(el).fontFamily.toLowerCase();
      const ok = OK.some((n) => f.includes(n));
      if (ok) return;
      const key = f.split(',')[0].replace(/["']/g, '').trim();
      if (seen.has(key + el.tagName)) return;
      seen.add(key + el.tagName);
      badFonts.set(key, (badFonts.get(key) || 0) + 1);
    });

    // ─── نص باللغة الغلط ───
    // أسماء منتجات وعلامات — إنجليزية عمداً بأي لغة
    const PROPER = /^(RAYAN ELWATHIQ|Meta|Facebook|Google|Instagram|WhatsApp|Hotjar|Microsoft|GA4|Ahrefs|Semrush|Screaming Frog|Looker|BigQuery|Search Console|Tag Manager|LinkedIn|YouTube|TikTok|Astro|WordPress|Shopify|Figma|Adobe|Canva|Notion|Photoshop|Illustrator|Premiere|After Effects|PageSpeed Insights|Rich Results)/i;

    const leaks = [];
    document.querySelectorAll('main *').forEach((el) => {
      if (el.children.length || !isText(el)) return;
      // نتجاهل العناصر اللي مكتوب عليها لغة مختلفة عمداً
      if (el.closest('[lang]') && el.closest('[lang]') !== document.documentElement) return;
      const txt = (el.textContent || '').trim();
      if (txt.length < 12) return;
      const hasAr = AR.test(txt);
      const hasLat = LAT.test(txt);
      if (lang === 'en' && hasAr) leaks.push(txt.slice(0, 60));
      if (lang === 'ar' && hasLat && !hasAr && !PROPER.test(txt)) leaks.push(txt.slice(0, 60));
    });

    return {
      lang,
      sections,
      headings: headings.length,
      badFonts: [...badFonts.entries()],
      leaks: leaks.slice(0, 6),
    };
  }, OK_FONTS);
}

console.log('\n═══ تطابق النسختين ═══');
let mismatch = 0;
const fontProblems = new Map();
const leakPages = [];

for (const { en, ar } of pairs) {
  const a = await scan(en);
  const b = await scan(ar);

  const missingInAr = a.sections.filter((s) => !b.sections.includes(s));
  const missingInEn = b.sections.filter((s) => !a.sections.includes(s));
  const headDiff = Math.abs(a.headings - b.headings);

  const bad = missingInAr.length || missingInEn.length || headDiff > 1;
  if (bad) {
    mismatch++;
    console.log(`⚠️ ${en}`);
    if (missingInAr.length) console.log(`     ناقص بالعربي : ${missingInAr.join(', ')}`);
    if (missingInEn.length) console.log(`     ناقص بالإنجليزي: ${missingInEn.join(', ')}`);
    if (headDiff > 1) console.log(`     عدد العناوين: إنجليزي ${a.headings} · عربي ${b.headings}`);
  }

  [a, b].forEach((r, i) => {
    r.badFonts.forEach(([f, n]) => fontProblems.set(f, (fontProblems.get(f) || 0) + n));
    if (r.leaks.length) leakPages.push({ page: i === 0 ? en : ar, leaks: r.leaks });
  });
}

if (!mismatch) console.log('✓ كل الصفحات متطابقة بالأقسام');

if (orphansEn.length) console.log(`\n⚠️ صفحات إنجليزية بلا مقابل عربي: ${orphansEn.join(', ')}`);
if (orphansAr.length) console.log(`⚠️ صفحات عربية بلا مقابل إنجليزي: ${orphansAr.join(', ')}`);
if (postGap)
  console.log(`⚠️ عدد مقالات إشارات مختلف: إنجليزي ${postsEn.length} · عربي ${postsAr.length}`);
if (!orphansEn.length && !orphansAr.length && !postGap)
  console.log(`✓ كل صفحة إلها مقابل باللغة الثانية (والمقالات ${postsEn.length} بكل لغة)`);

console.log('\n═══ الخطوط ═══');
if (!fontProblems.size) console.log('✓ كل النصوص على الخط المعتمد');
else [...fontProblems.entries()].sort((a, b) => b[1] - a[1]).forEach(([f, n]) => console.log(`  ⚠️ ${f} — ${n} عنصر`));

console.log('\n═══ نص باللغة الغلط ═══');
if (!leakPages.length) console.log('✓ ما في نص متسرّب');
else
  leakPages.slice(0, 8).forEach((p) => {
    console.log(`  ⚠️ ${p.page}`);
    p.leaks.forEach((l) => console.log(`       ${l}`));
  });

await browser.close();
