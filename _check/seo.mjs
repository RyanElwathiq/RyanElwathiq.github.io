// ═══════════════════════════════════════════════════════════════
//  فحص السيو التقني — على ملفات dist نفسها
//
//  ليش على dist مش على المتصفح؟ لأنه جوجل بيقرأ الـ HTML اللي
//  بيرجع من السيرفر **قبل** ما يشتغل أي جافاسكربت. أي وسم بينحط
//  بالجافاسكربت ممكن جوجل ما يشوفه أبداً. فمنفحص المصدر نفسه.
//
//  الفحوصات (مبنية على قائمة seo-technical + hreflang + schema):
//   ١) العنوان: موجود · مش مكرر · طوله معقول
//   ٢) الوصف: موجود · مش مكرر · طوله معقول
//   ٣) canonical: موجود وبيشير لنفسه
//   ٤) hreflang: كل صفحة إنجليزي لازم تشاور على أختها العربي وبالعكس
//   ٥) JSON-LD: بيانات منظّمة (Person · WebSite · Article · Breadcrumb)
//   ٦) H1: واحد بالضبط بكل صفحة
//   ٧) ترتيب العناوين: ما نقفز من h2 لـ h4
//   ٨) الصور: كل صورة إلها alt
//   ٩) حجم الـ HTML: جوجل بيقرأ أول ٢ ميجا بس
//   ١٠) lang و dir على وسم html
//   ١١) الخريطة: كل صفحة موجودة بالـ sitemap
//
//  التشغيل: npm run build ثم node _check/seo.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const SITE = 'https://ryanalali.me';

if (!existsSync(DIST)) {
  console.error('✗ ما في مجلد dist — شغّل npm run build الأول');
  process.exit(1);
}

// ─── نجمع كل صفحات HTML ───
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    // ⚠️ ملف تحقق Google Search Console مش صفحة — محتواه سطر واحد
    //    مفروض من جوجل وممنوع نغيره، فما بينفحص كصفحة
    else if (name.endsWith('.html') && !/^google[0-9a-f]+\.html$/.test(name)) out.push(p);
  }
  return out;
}

// المسار → الرابط  (dist/ar/signals/index.html → /ar/signals/)
const toUrl = (p) =>
  '/' + relative(DIST, p).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '/');

const files = walk(DIST).sort();

// ─── أدوات استخراج بسيطة (بدون مكتبات) ───
const one = (html, re) => (html.match(re) || [])[1]?.trim();
const all = (html, re) => [...html.matchAll(re)];
const strip = (s) => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const pages = files.map((f) => {
  const html = readFileSync(f, 'utf8');
  const head = html.slice(0, html.indexOf('</head>') + 7);
  return {
    file: f,
    url: toUrl(f),
    bytes: Buffer.byteLength(html),
    html,
    lang: one(html, /<html[^>]*\slang="([^"]*)"/i),
    dir: one(html, /<html[^>]*\sdir="([^"]*)"/i),
    title: one(head, /<title[^>]*>([\s\S]*?)<\/title>/i),
    desc: one(head, /<meta\s+name="description"\s+content="([^"]*)"/i),
    canonical: one(head, /<link\s+rel="canonical"\s+href="([^"]*)"/i),
    robots: one(head, /<meta\s+name="robots"\s+content="([^"]*)"/i),
    og: {
      title: one(head, /<meta\s+property="og:title"\s+content="([^"]*)"/i),
      image: one(head, /<meta\s+property="og:image"\s+content="([^"]*)"/i),
      type: one(head, /<meta\s+property="og:type"\s+content="([^"]*)"/i),
    },
    hreflang: all(head, /<link\s+rel="alternate"[^>]*hreflang="([^"]*)"[^>]*href="([^"]*)"/gi).map(
      (m) => ({ lang: m[1], href: m[2] })
    ),
    jsonld: all(html, /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi).map(
      (m) => m[1]
    ),
    h1: all(html, /<h1[^>]*>([\s\S]*?)<\/h1>/gi).map((m) => strip(m[1])),
    heads: all(html, /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi).map((m) => ({
      lvl: +m[1],
      text: strip(m[2]),
    })),
    imgs: all(html, /<img\b([^>]*)>/gi).map((m) => m[1]),
  };
});

// ─── تجميع النتائج ───
const issues = []; // { sev, check, url, msg }
const add = (sev, check, url, msg) => issues.push({ sev, check, url, msg });

// صفحات التحويل (redirect) منستثنيها — قصدها مش الفهرسة
const isRedirect = (p) =>
  /http-equiv="refresh"/i.test(p.html) || /<meta[^>]*noindex/i.test(p.html);

const real = pages.filter((p) => !isRedirect(p));
const redirects = pages.length - real.length;

// ═══ ١) العنوان ═══
const titles = new Map();
for (const p of real) {
  if (!p.title) add('عالي', 'العنوان', p.url, 'ما في عنوان');
  else {
    const n = p.title.length;
    if (n > 65) add('متوسط', 'العنوان', p.url, `طويل ${n} حرف (جوجل بيقص عند ~٦٠)`);
    if (n < 15) add('متوسط', 'العنوان', p.url, `قصير ${n} حرف`);
    const k = p.title.toLowerCase();
    titles.set(k, [...(titles.get(k) || []), p.url]);
  }
}
for (const [t, urls] of titles)
  if (urls.length > 1) add('عالي', 'العنوان', urls.join(' · '), `عنوان مكرر: «${t.slice(0, 45)}»`);

// ═══ ٢) الوصف ═══
const descs = new Map();
for (const p of real) {
  if (!p.desc) add('عالي', 'الوصف', p.url, 'ما في وصف');
  else {
    const n = p.desc.length;
    if (n > 165) add('منخفض', 'الوصف', p.url, `طويل ${n} حرف (بينقص عند ~١٦٠)`);
    if (n < 60) add('متوسط', 'الوصف', p.url, `قصير ${n} حرف`);
    const k = p.desc.toLowerCase();
    descs.set(k, [...(descs.get(k) || []), p.url]);
  }
}
for (const [, urls] of descs)
  if (urls.length > 1) add('متوسط', 'الوصف', urls.join(' · '), 'وصف مكرر بين صفحات');

// ═══ ٣) canonical ═══
for (const p of real) {
  if (!p.canonical) add('عالي', 'canonical', p.url, 'ما في canonical');
  else {
    const want = SITE + p.url;
    if (p.canonical !== want)
      add('عالي', 'canonical', p.url, `بيشير لـ ${p.canonical} بدل ${want}`);
  }
}

// ═══ ٤) hreflang — الأخت العربية/الإنجليزية ═══
//  القاعدة: /x/ ↔ /ar/x/   والرئيسية / ↔ /ar/
const urlSet = new Set(real.map((p) => p.url));
const sibling = (u) => (u.startsWith('/ar/') ? '/' + u.slice(4) : '/ar' + u);

for (const p of real) {
  const sib = sibling(p.url);
  const hasSib = urlSet.has(sib);
  const tags = new Map(p.hreflang.map((h) => [h.lang, h.href]));

  if (!hasSib) continue; // صفحة بلغة وحدة — مش مشكلة

  for (const [lang, want] of [
    ['en', SITE + (p.url.startsWith('/ar/') ? sib : p.url)],
    ['ar', SITE + (p.url.startsWith('/ar/') ? p.url : sib)],
    ['x-default', SITE + (p.url.startsWith('/ar/') ? sib : p.url)],
  ]) {
    if (!tags.has(lang)) add('عالي', 'hreflang', p.url, `ناقص hreflang="${lang}"`);
    else if (tags.get(lang) !== want)
      add('عالي', 'hreflang', p.url, `hreflang="${lang}" بيشير لـ ${tags.get(lang)} بدل ${want}`);
  }
}

// ═══ ٥) البيانات المنظّمة ═══
let ldOk = 0;
for (const p of real) {
  if (!p.jsonld.length) {
    add('عالي', 'البيانات المنظّمة', p.url, 'ما في JSON-LD نهائياً');
    continue;
  }
  for (const raw of p.jsonld) {
    try {
      const o = JSON.parse(raw);
      const nodes = o['@graph'] || (Array.isArray(o) ? o : [o]);
      for (const n of nodes) {
        if (!n['@type']) add('متوسط', 'البيانات المنظّمة', p.url, 'عقدة بدون @type');
        else ldOk++;
      }
    } catch (e) {
      add('عالي', 'البيانات المنظّمة', p.url, `JSON-LD مكسور: ${e.message.slice(0, 50)}`);
    }
  }
}

// ═══ ٦) H1 ═══
for (const p of real) {
  if (p.h1.length === 0) add('عالي', 'H1', p.url, 'ما في h1');
  else if (p.h1.length > 1)
    add('متوسط', 'H1', p.url, `${p.h1.length} عناوين h1: ${p.h1.map((t) => t.slice(0, 22)).join(' | ')}`);
}

// ═══ ٧) ترتيب العناوين ═══
for (const p of real) {
  let prev = 0;
  for (const h of p.heads) {
    if (prev && h.lvl > prev + 1)
      add('منخفض', 'ترتيب العناوين', p.url, `قفزة h${prev} → h${h.lvl} عند «${h.text.slice(0, 28)}»`);
    prev = h.lvl;
  }
}

// ═══ ٨) alt للصور ═══
for (const p of real) {
  const bad = p.imgs.filter((a) => !/\salt\s*=/.test(a));
  if (bad.length)
    add('متوسط', 'alt الصور', p.url, `${bad.length} صورة بدون alt — أول وحدة: ${(bad[0].match(/src="([^"]*)"/) || [])[1] || '?'}`);
}

// ═══ ٩) حجم الـ HTML (جوجل بيقرأ أول ٢ ميجا) ═══
for (const p of real) {
  if (p.bytes > 2_000_000)
    add('عالي', 'حجم الصفحة', p.url, `${(p.bytes / 1e6).toFixed(2)} ميجا — فوق حد جوجل`);
  else if (p.bytes > 500_000)
    add('منخفض', 'حجم الصفحة', p.url, `${Math.round(p.bytes / 1024)} كيلو`);
}

// ═══ ١٠) lang و dir ═══
for (const p of real) {
  const wantLang = p.url.startsWith('/ar/') || p.url === '/ar/' ? 'ar' : 'en';
  const wantDir = wantLang === 'ar' ? 'rtl' : 'ltr';
  if (p.lang !== wantLang) add('عالي', 'lang', p.url, `lang="${p.lang}" المفروض "${wantLang}"`);
  if (p.dir !== wantDir) add('متوسط', 'dir', p.url, `dir="${p.dir}" المفروض "${wantDir}"`);
}

// ═══ ١١) الخريطة ═══
const smFile = join(DIST, 'sitemap-0.xml');
if (!existsSync(smFile)) add('عالي', 'الخريطة', '—', 'ما في sitemap-0.xml');
else {
  const sm = readFileSync(smFile, 'utf8');
  const inMap = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  for (const p of real) {
    const u = SITE + p.url;
    if (!inMap.has(u) && !inMap.has(u.replace(/\/$/, '')))
      add('متوسط', 'الخريطة', p.url, 'مش بالخريطة');
  }
  // وهل الخريطة فيها hreflang؟
  if (!/xhtml:link/.test(sm)) add('متوسط', 'الخريطة', '—', 'الخريطة بدون روابط اللغات (xhtml:link)');
}

// ═══ ١٢) og و twitter ═══
for (const p of real) {
  if (!p.og.title) add('منخفض', 'المعاينة', p.url, 'ما في og:title');
  if (!p.og.image) add('متوسط', 'المعاينة', p.url, 'ما في og:image');
}

// ─────────────────────────────────────────────
//  التقرير
// ─────────────────────────────────────────────
const order = { عالي: 0, متوسط: 1, منخفض: 2 };
const icon = { عالي: '✗', متوسط: '⚠', منخفض: '·' };

console.log(`\n═══════════ فحص السيو التقني ═══════════`);
console.log(`  ${real.length} صفحة مفهرسة · ${redirects} تحويل · ${ldOk} عقدة بيانات منظّمة\n`);

// نجمّع حسب نوع الفحص عشان ما يطلع ٢٠٠ سطر متشابه
const byCheck = new Map();
for (const i of issues) {
  const k = i.sev + '|' + i.check;
  byCheck.set(k, [...(byCheck.get(k) || []), i]);
}

const sorted = [...byCheck.entries()].sort((a, b) => {
  const [sa, ca] = a[0].split('|');
  const [sb, cb] = b[0].split('|');
  return order[sa] - order[sb] || ca.localeCompare(cb);
});

for (const [k, list] of sorted) {
  const [sev, check] = k.split('|');
  console.log(`${icon[sev]} ${check} — ${list.length} حالة  (${sev})`);
  const seen = new Set();
  for (const i of list) {
    if (seen.size >= 3) break;
    if (seen.has(i.msg)) continue;
    seen.add(i.msg);
    console.log(`    ${i.url.slice(0, 46)}  →  ${i.msg}`);
  }
  if (list.length > seen.size) console.log(`    … و${list.length - seen.size} كمان`);
  console.log();
}

const c = (s) => issues.filter((i) => i.sev === s).length;
console.log(`───────────────────────────────────────`);
console.log(`  عالي ${c('عالي')} · متوسط ${c('متوسط')} · منخفض ${c('منخفض')}`);
console.log(issues.length === 0 ? '  ✓ نظيف تماماً\n' : '');
