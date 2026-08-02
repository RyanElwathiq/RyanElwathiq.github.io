// ═══════════════════════════════════════════════════════════════
//  مولّد أغلفة المشاريع
//
//  القاعدة اللي طلبها ريّان: «كل تصميم بيروح للرئيسية إله شكل خاص
//  فيه» — ممنوع ناخد تصميم عشوائي حتى لو حلو ونحطه كغلاف.
//
//  كيف بيشتغل:
//   ١. بيقرأ صور المشروع ويستخرج ألوانه السائدة  ← براند العميل
//   ٢. بيبني قالب HTML بهالألوان
//   ٣. بيحط طبقة خفيفة من هوية ريّان فوقها
//   ٤. لقطة 1080×1080 موحّدة لكل المشاريع
//
//  ليش استخراج الألوان بدل ما نكتبها بإيدنا؟ عشان يكون **ديناميكي**
//  زي ما طلب: مشروع جديد ينضاف لـ work.json ← غلافه بينولد بلا
//  ما حدا يحدّد ألوانه. والاستخراج بيصير بـ canvas جوّا المتصفح،
//  فما بدنا ولا مكتبة إضافية (sharp مش منصّبة أصلاً).
//
//  التشغيل:
//    node _check/covers.mjs                 ← كل المشاريع
//    node _check/covers.mjs al-mofakron     ← مشروع واحد
//    node _check/covers.mjs --dry           ← بلا حفظ، بس يعرض الألوان
// ═══════════════════════════════════════════════════════════════
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
const OUT = join(PUBLIC, 'assets/work/covers');

const work = JSON.parse(readFileSync(join(ROOT, 'src/data/work.json'), 'utf8'));

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DRY = process.argv.includes('--dry');

// ─── هوية ريّان ─── (نفس قيم tokens.css بالحرف)
const BRAND = { accent: '#D9FF3F', ink: '#0E0F12', text: '#F2F3EE' };

// ═══════════════════════════════════════════════════════════════
//  النقوش — «إشي بسيط بيعبّر عن المشروع» (طلب ريّان)
//
//  كلها SVG مرسوم بالكود، بلا ولا ملف صورة. بينرسم بلون الليموني
//  بشفافية خفيفة فوق التدرّجات، فبيقرا كنسيج مش كرسمة.
//
//  ✏️ المشروع بياخد نقشه من حقل `motif` بـ work.json، وإذا ما
//     كان محدّد بياخد نقش فئته تلقائياً. يعني بيشتغل بلا إعداد،
//     وبتقدر تخصّص لما تحتاج.
// ═══════════════════════════════════════════════════════════════
const MOTIF = {
  // شبكة قوائم وعوارض — ألمنيوم وواجهات وعمارة
  grid: (c) =>
    `<pattern id="m" width="120" height="120" patternUnits="userSpaceOnUse">
       <path d="M0 0H120M0 60H120M0 0V120M60 0V120" stroke="${c}" stroke-width="1.6" fill="none"/>
       <path d="M0 0L120 120M120 0L0 120" stroke="${c}" stroke-width=".7" opacity=".5" fill="none"/>
     </pattern>`,
  // موجات — عناية بالبشرة، ماء، هدوء
  waves: (c) =>
    `<pattern id="m" width="180" height="90" patternUnits="userSpaceOnUse">
       <path d="M0 45q45-38 90 0t90 0" stroke="${c}" stroke-width="1.8" fill="none"/>
       <path d="M0 78q45-38 90 0t90 0" stroke="${c}" stroke-width="1" opacity=".55" fill="none"/>
     </pattern>`,
  // أعمدة متدرّجة — نمو، أرقام، تسويق
  bars: (c) =>
    `<pattern id="m" width="150" height="150" patternUnits="userSpaceOnUse">
       <rect x="14" y="96" width="16" height="54" fill="${c}" opacity=".8"/>
       <rect x="48" y="66" width="16" height="84" fill="${c}" opacity=".65"/>
       <rect x="82" y="34" width="16" height="116" fill="${c}" opacity=".5"/>
       <rect x="116" y="10" width="16" height="140" fill="${c}" opacity=".35"/>
     </pattern>`,
  // إطارات لقطات — فيديو ومونتاج
  frames: (c) =>
    `<pattern id="m" width="140" height="100" patternUnits="userSpaceOnUse">
       <rect x="10" y="14" width="120" height="72" rx="6" stroke="${c}" stroke-width="1.6" fill="none"/>
       <path d="M0 26H10M0 74H10M130 26H140M130 74H140" stroke="${c}" stroke-width="3"/>
     </pattern>`,
  // نقاط شبكة — محتوى وسوشال
  dots: (c) =>
    `<pattern id="m" width="70" height="70" patternUnits="userSpaceOnUse">
       <circle cx="18" cy="18" r="3.4" fill="${c}"/>
       <circle cx="52" cy="52" r="2" fill="${c}" opacity=".6"/>
     </pattern>`,
  // أقواس — هوية وأزياء وجمال
  arcs: (c) =>
    `<pattern id="m" width="160" height="160" patternUnits="userSpaceOnUse">
       <circle cx="0" cy="80" r="58" stroke="${c}" stroke-width="1.6" fill="none"/>
       <circle cx="160" cy="80" r="58" stroke="${c}" stroke-width="1.6" fill="none"/>
       <circle cx="80" cy="80" r="22" stroke="${c}" stroke-width=".9" opacity=".6" fill="none"/>
     </pattern>`,
  // مسارات دائرة — مواقع وتقنية
  circuit: (c) =>
    `<pattern id="m" width="130" height="130" patternUnits="userSpaceOnUse">
       <path d="M20 0v42h42M110 130V88H68M0 100h34v30" stroke="${c}" stroke-width="1.6" fill="none"/>
       <circle cx="62" cy="42" r="4.5" fill="${c}"/>
       <circle cx="68" cy="88" r="4.5" fill="${c}"/>
     </pattern>`,
};

// النقش الافتراضي حسب فئة المشروع — عشان يشتغل بلا إعداد
const CAT_MOTIF = { video: 'frames', design: 'arcs', website: 'circuit', marketing: 'bars' };

// ═══════════════════════════════════════════════════════════════
//  التنويع المحكوم
//
//  ⚠️ ثلاث تخطيطات مش تخطيط واحد — عشان الشبكة ما تبيّن نسخة
//     كربونية. بس التوزيع **حتمي** (بالترتيب داخل الفئة) مش
//     عشوائي: نفس المشروع بياخد نفس التخطيط كل مرة نولّد، وإلا
//     كل تشغيل بيغيّر شكل الموقع كله بلا سبب.
// ═══════════════════════════════════════════════════════════════
const LAYOUTS = ['corner', 'stack', 'band'];

// ═══════════════════════════════════════════════════════════════
//  استخراج الألوان السائدة من صورة
//
//  الطريقة: نرسم الصورة مصغّرة على canvas ونعدّ الألوان بعد ما
//  نقرّبها لشبكة خشنة (تجميع). بعدين نرتّبهم بالتكرار.
//
//  ⚠️ منتجاهل الألوان القريبة جداً من الأبيض أو الأسود، لأنها
//     بالعادة خلفية أو نص مش لون البراند. ومنتجاهل الرمادي
//     (تشبّع منخفض) لنفس السبب — بدنا اللون اللي بيميّز العلامة.
// ═══════════════════════════════════════════════════════════════
async function dominantColors(page, url) {
  return page.evaluate(async (src) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = () => rej(new Error('image failed: ' + src));
      img.src = src;
    });

    const W = 120;
    const H = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * W));
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H).data;

    const bucket = new Map();
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 200) continue; // شفاف
      const r = d[i], g = d[i + 1], b = d[i + 2];

      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      const light = (max + min) / 2 / 255;
      const sat = max === min ? 0 : (max - min) / (light > 0.5 ? 510 - max - min : max + min);

      // بره النطاق المفيد: قريب من الأبيض/الأسود، أو رمادي
      if (light < 0.12 || light > 0.93 || sat < 0.14) continue;

      const k = `${r >> 4},${g >> 4},${b >> 4}`;
      const e = bucket.get(k) || { n: 0, r: 0, g: 0, b: 0 };
      e.n++; e.r += r; e.g += g; e.b += b;
      bucket.set(k, e);
    }

    const list = [...bucket.values()]
      .sort((a, b) => b.n - a.n)
      .slice(0, 5)
      .map((e) => {
        const to = (v) => Math.round(v / e.n).toString(16).padStart(2, '0');
        return { hex: '#' + to(e.r) + to(e.g) + to(e.b), n: e.n };
      });

    return list;
  }, url);
}

// ─── قالب الغلاف ───
function html(p, colors, layout) {
  // ✏️ حقل `brand` بـ work.json بيتغلّب على الاستخراج — لازم لما
  //    تكون صورة المشروع بلا ألوان (لوجو أبيض مثلاً)
  const manual = Array.isArray(p.brand) ? p.brand : null;
  const c1 = manual?.[0] || colors[0]?.hex || '#2A2E36';
  const c2 = manual?.[1] || colors[1]?.hex || c1;
  const c3 = manual?.[2] || colors[2]?.hex || c2;

  const title = p.titleAr || p.title;
  const role = p.roleAr || p.role || '';

  const motifKey = p.motif || CAT_MOTIF[p.category] || 'grid';
  const motifSvg = (MOTIF[motifKey] || MOTIF.grid)(BRAND.accent);
  const motifUrl =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080"><defs>${motifSvg}</defs><rect width="1080" height="1080" fill="url(%23m)"/></svg>`,
    ).replace(/%2523/g, '%23');

  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8">
<style>
  /* الخطوط من node_modules مباشرة — بتنخدم عبر معترض الشبكة تحت */
  @font-face{font-family:'Alexandria Variable';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900;font-display:block}
  @font-face{font-family:'Alexandria Variable';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;font-display:block;unicode-range:U+0000-00FF}
  @font-face{font-family:'Space Grotesk Variable';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700;font-display:block}
</style>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1080px;height:1080px;overflow:hidden}

  .cover{
    position:relative;width:1080px;height:1080px;overflow:hidden;
    /* ═══ ألوان براند العميل ═══ مستخرجة من صوره هو */
    background:
      radial-gradient(120% 90% at 18% 12%, ${c1} 0%, transparent 62%),
      radial-gradient(105% 85% at 86% 78%, ${c2} 0%, transparent 58%),
      radial-gradient(85% 70% at 50% 105%, ${c3} 0%, transparent 55%),
      ${BRAND.ink};
    font-family:'Alexandria Variable','Space Grotesk Variable',system-ui,sans-serif;
    color:${BRAND.text};
  }

  /* ═══ شغل العميل نفسه، معالَج ═══
     ⚠️ ريّان حذّر: «مش مجرد صورة مأخوذة من أحد التصاميم». عشان
        هيك الصورة مش معروضة كما هي — هي **مادة خام**: مقصوصة
        بدائرة، مطموسة، ومدموجة بلون البراند بوضع soft-light.
        النتيجة نسيج بيحكي عن المشروع بدون ما يكون لقطة منه.
     ⚠️ ولو الصورة ما انقرأت، الغلاف بيضل شغّال بالتدرّجات لحالها. */
  .shot{
    position:absolute;top:-6%;inset-inline-start:-10%;
    width:86%;aspect-ratio:1;border-radius:50%;
    background-image:url('${p.__shot || ''}');
    background-size:cover;background-position:center;
    filter:blur(46px) saturate(1.5);
    opacity:.5;mix-blend-mode:soft-light;
  }
  .shot2{
    position:absolute;bottom:-14%;inset-inline-end:-12%;
    width:64%;aspect-ratio:1;border-radius:50%;
    background-image:url('${p.__shot || ''}');
    background-size:cover;background-position:30% 70%;
    filter:blur(58px) saturate(1.4);
    opacity:.34;mix-blend-mode:soft-light;
  }

  /* ═══ طبقة هوية ريّان ═══
     خفيفة عن قصد: ما بدها تغطي لون العميل، بدها تقول «هذا شغل
     ريّان» بصمت. حبيبات + تعتيم متدرّج + إطار ليموني رفيع. */
  .grain{
    position:absolute;inset:0;opacity:.16;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
  }
  .veil{
    position:absolute;inset:0;
    background:linear-gradient(to top, ${BRAND.ink}f2 0%, ${BRAND.ink}66 34%, transparent 62%);
  }
  .edge{
    position:absolute;inset:26px;border-radius:24px;
    border:1.5px solid ${BRAND.accent}2e;
  }

  /* الشريط الليموني — العنصر الوحيد المشبع من هوية ريّان */
  .bar{
    position:absolute;top:26px;inset-inline-start:26px;
    height:6px;width:132px;border-radius:99px;background:${BRAND.accent};
  }

  .kicker{
    position:absolute;top:52px;inset-inline-end:56px;
    font-size:21px;font-weight:600;letter-spacing:.02em;
    color:${BRAND.accent};opacity:.92;
  }

  /* ═══ النقش ═══ العنصر اللي بيقول شو هذا المشروع */
  .motif{
    position:absolute;inset:0;opacity:.19;
    -webkit-mask-image:radial-gradient(78% 62% at ${
      layout === 'stack' ? '78% 70%' : layout === 'band' ? '50% 22%' : '22% 30%'
    }, #000 0%, transparent 74%);
    mask-image:radial-gradient(78% 62% at ${
      layout === 'stack' ? '78% 70%' : layout === 'band' ? '50% 22%' : '22% 30%'
    }, #000 0%, transparent 74%);
  }

  /* ═══ ثلاث تخطيطات ═══ */
  .foot{position:absolute;inset-inline:64px}

  /* corner: النص أسفل، الافتراضي */
  .l-corner .foot{bottom:70px}

  /* stack: النص بالنص، متمركز عمودياً وبمحاذاة البداية */
  .l-band .foot{top:50%;transform:translateY(-50%)}
  .l-band h1{font-size:${title.length > 22 ? 68 : 84}px}

  /* band: النص أسفل بس بشريط معتم خلفه */
  .l-stack .foot{
    bottom:0;inset-inline:0;padding:56px 64px 66px;
    background:linear-gradient(to top, ${BRAND.ink}fa, ${BRAND.ink}d0 62%, transparent);
  }

  h1{
    font-size:${title.length > 22 ? 62 : title.length > 14 ? 76 : 92}px;
    font-weight:800;line-height:1.12;letter-spacing:-.01em;
    margin-bottom:16px;text-wrap:balance;
  }
  .role{font-size:26px;font-weight:500;color:${BRAND.text};opacity:.7;line-height:1.45}

  .mark{
    position:absolute;bottom:64px;inset-inline-end:64px;
    display:flex;align-items:center;gap:11px;
    font-family:'Space Grotesk Variable',sans-serif;
    font-size:19px;font-weight:600;color:${BRAND.text};opacity:.5;
  }
  .dot{width:9px;height:9px;border-radius:99px;background:${BRAND.accent}}
</style></head><body>
<div class="cover l-${layout}">
  ${p.__shot ? '<div class="shot"></div><div class="shot2"></div>' : ''}
  <div class="motif" style="background-image:url('${motifUrl}')"></div>
  <div class="grain"></div>
  <div class="veil"></div>
  <div class="edge"></div>
  <div class="bar"></div>
  <div class="kicker">${escapeHtml(catLabel(p.category))}</div>
  <div class="foot">
    <h1>${escapeHtml(title)}</h1>
    ${role ? `<div class="role">${escapeHtml(role)}</div>` : ''}
  </div>
  <div class="mark"><span class="dot"></span>ryanalali.me</div>
</div>
</body></html>`;
}

const CAT = {
  video: 'فيديو',
  design: 'تصميم',
  website: 'موقع',
  marketing: 'تسويق',
};
const catLabel = (c) => CAT[c] || 'شغل';
const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);

// ═══════════════════════════════════════════════════════════════
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });

// ═══════════════════════════════════════════════════════════════
//  خادم وهمي
//
//  ⚠️ ليش ما استخدمنا setContent مباشرة؟ لأنه بيخلّي الصفحة بلا
//     أصل (about:blank)، فالروابط النسبية زي /assets/x.webp ما
//     بتنحل، **وcanvas بيتلوّث** فـ getImageData بيرمي خطأ أمني
//     ومنفقد استخراج الألوان كله. أول محاولة فشلت ٢٤/٢٤ لهالسبب.
//
//  الحل: نخدم كل اشي من أصل واحد وهمي، فالصفحة والصور والخطوط
//  كلهم same-origin وما في تلوّث ولا مشاكل روابط.
// ═══════════════════════════════════════════════════════════════
const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

let pageHtml = '<html><body></body></html>';

await page.route('http://covers.local/**', async (route) => {
  const path = decodeURIComponent(new URL(route.request().url()).pathname);

  if (path === '/' || path === '/index.html') {
    return route.fulfill({ contentType: 'text/html; charset=utf-8', body: pageHtml });
  }

  const font = FONTS[path];
  if (font) {
    const fp = join(ROOT, font);
    if (existsSync(fp)) return route.fulfill({ contentType: 'font/woff2', body: readFileSync(fp) });
  }

  const fp = join(PUBLIC, path);
  if (existsSync(fp)) return route.fulfill({ body: readFileSync(fp) });

  return route.fulfill({ status: 404, body: '' });
});

if (!DRY) mkdirSync(OUT, { recursive: true });

const targets = work.projects.filter((p) => !only.length || only.includes(p.id));
console.log(`المشاريع: ${targets.length}\n`);

for (const p of targets) {
  // مصدر الألوان: أول صورة بالمعرض، وإلا الغلاف الحالي
  const src = (p.gallery && p.gallery[0]) || p.cover;
  let colors = [];
  try {
    pageHtml = '<!doctype html><html><body></body></html>';
    await page.goto('http://covers.local/', { waitUntil: 'domcontentloaded' });
    colors = await dominantColors(page, src);
  } catch (e) {
    console.log(`  ⚠️ ${p.id}: ما قدرت أقرأ ${src} — ${String(e.message).slice(0, 70)}`);
  }

  const hexes = colors.map((c) => c.hex).join(' ') || '(بلا ألوان — رح يستخدم الافتراضي)';
  console.log(`${p.id.padEnd(16)} ${hexes}`);

  if (DRY) continue;

  // الصورة بتنمرّر للقالب بس إذا كانت موجودة فعلاً على القرص،
  // وإلا الغلاف بيتبني بالتدرّجات لحالها بلا ما ينكسر
  p.__shot = existsSync(join(PUBLIC, src)) ? src : '';

  // التخطيط حتمي: ترتيب المشروع داخل فئته. نفس المشروع بياخد نفس
  // التخطيط كل مرة، فالموقع ما بيتغيّر شكله بلا سبب مع كل تشغيل.
  const sameCat = work.projects.filter((x) => x.category === p.category);
  const layout = LAYOUTS[sameCat.indexOf(p) % LAYOUTS.length];

  pageHtml = html(p, colors, layout);
  await page.goto('http://covers.local/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(OUT, `${p.id}.png`), type: 'png' });
}

await browser.close();
console.log(DRY ? '\n(معاينة ألوان فقط)' : `\n✅ الأغلفة بـ public/assets/work/covers/`);
