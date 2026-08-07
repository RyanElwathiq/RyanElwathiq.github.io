// ═══════════════════════════════════════════════════════════════
//  صورة المشاركة (og:image) — اللي بتظهر بالواتساب ولينكدإن (2026-08-08)
//
//  ⚠️ المشكلة بالقديمة: الشعار بس، **ولا كلمة**. اللي بيستلم الرابط
//     بالواتساب بيشوف عقدة خضرا وما بيعرف شو هي ولا ليش يكبس.
//     وكمان فيها شريطان أسودان (صورة 16:9 محشورة بـ1200×630).
//
//  ⚠️ الواتساب بيقصّ المعاينة الصغيرة **لمربّع من النص**. ولهيك كل
//     إشي مهم لازم يكون بالوسط، والأطراف تضل هامش مش محتوى.
//
//  ⚠️ حجم الملف مهم: الواتساب بيفشل بجلب صور أكبر من ~٣٠٠ كيلو.
//     ولهيك JPEG بجودة ٨٨ مش PNG — الفرق بالشكل صفر والحجم ربع.
//
//  ⚠️ نسختان: العربية هي الافتراضية (روابط الواتساب بتروح لأردنيين)،
//     والإنجليزية للصفحات الإنجليزية.
//
//  التشغيل: node _check/ogimage.mjs
// ═══════════════════════════════════════════════════════════════
import { chromium } from 'playwright';
import { readFileSync } from 'fs';

const PUB = 'D:/Ryan-Portfolio/site/public';
const LIME = '#D9FF3F';
const INK = '#0E0F12';
const PAPER = '#F2F3EE';
const MUTE = '#9CA096';

// الشعار انبيدج base64 — عشان الرندر ما يعتمد على سيرفر شغّال
const logo = 'data:image/png;base64,' + readFileSync(`${PUB}/assets/logo-white.png`).toString('base64');

// ═══════════════════════════════════════════════════════════════
//  ⚠️ الخط: Alexandria Variable — وهو خط الهوية المعتمد
//     (`--font-ar` بـ src/styles/tokens.css · حزمة
//      @fontsource-variable/alexandria).
//
//  ⚠️ أول نسخة انرندرت بخط النظام Segoe UI وطلع شكل عربي غريب
//     مش من الهوية. **أي صورة فيها عربي لازم تحمّل ملف الخط نفسه
//     مضمّناً base64** — الرندر بـPlaywright ما بيقرا من node_modules
//     ولا من سيرفر، وبيسقط بصمت على خط النظام بلا ما يحذّرك.
// ═══════════════════════════════════════════════════════════════
const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');
const fontFaces = `
  @font-face{font-family:'Alexandria Variable';font-style:normal;font-weight:100 900;
    font-display:block;src:url(data:font/woff2;base64,${b64('alexandria-arabic-wght-normal.woff2')}) format('woff2');
    unicode-range:U+0600-06FF,U+0750-077F,U+0870-088E,U+08A0-08FF,U+FB50-FDFF,U+FE70-FEFF;}
  @font-face{font-family:'Alexandria Variable';font-style:normal;font-weight:100 900;
    font-display:block;src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');
    unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+2122,U+2212;}
`;

const build = (t) => `<!doctype html><html dir="${t.dir}"><head><meta charset="utf-8"><style>
  ${fontFaces}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:${INK};position:relative;overflow:hidden;
       font-family:'Alexandria Variable',${t.dir === 'rtl' ? 'Tahoma' : 'Inter'},sans-serif;
       color:${PAPER};display:flex;align-items:center;justify-content:center}
  .glow{position:absolute;left:50%;top:-30%;width:900px;height:900px;transform:translateX(-50%);
        background:radial-gradient(circle, ${LIME}1c 0%, transparent 65%)}
  /* ⚠️ المنطقة الآمنة: ٩٠٠×٥٣٠ بالوسط — برّاها بينقصّ بالواتساب */
  .safe{position:relative;width:900px;height:530px;display:flex;flex-direction:column;
        align-items:center;justify-content:center;text-align:center;gap:0}
  .logo{width:74px;height:74px;opacity:.96;margin-bottom:30px}
  .big{font-size:${t.big};line-height:1.14;font-weight:800;letter-spacing:${t.ls};max-width:860px}
  .lime{color:${LIME}}
  .sub{font-size:29px;color:${MUTE};font-weight:500;margin-top:26px;letter-spacing:.01em}
  .rule{width:64px;height:3px;background:${LIME};border-radius:2px;margin:34px 0 22px}
  .url{font-size:33px;font-weight:700;letter-spacing:.02em}
</style></head><body>
  <div class="glow"></div>
  <div class="safe">
    <img class="logo" src="${logo}" alt="">
    <div class="big">${t.big1}<br><span class="lime">${t.big2}</span></div>
    <div class="sub">${t.sub}</div>
    <div class="rule"></div>
    <div class="url">ryanalali.me</div>
  </div>
</body></html>`;

const V = [
  {
    file: 'og.jpg',
    dir: 'rtl',
    big: '70px',
    ls: '-.005em',
    big1: 'ما ببيع بوستات.',
    big2: 'بشخّص، وبعدها ببني.',
    // ⚠️ ممنوع الفاصل «·» بين أرقام عربية — بيلتبس معها وبيقرا «٧ ٠ أدوات».
    //    الحل: تركيب عربي طبيعي بحرف العطف بدل الفواصل.
    sub: 'أكثر من ١٣٠ صفحة، و٧ أدوات تفاعلية بتجرّبها مجاناً',
  },
  {
    file: 'og-en.jpg',
    dir: 'ltr',
    big: '68px',
    ls: '-.022em',
    big1: 'I don’t sell posts.',
    big2: 'I diagnose, then build.',
    sub: '130+ pages · 7 interactive tools · free to try',
  },
];

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const t of V) {
  await p.setContent(build(t), { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250); // ⚠️ لازم ننتظر تحميل الخط فعلياً — بلا هيك بينرندر بخط بديل
  await p.screenshot({
    path: `${PUB}/${t.file}`,
    type: 'jpeg',
    quality: 88,
    clip: { x: 0, y: 0, width: 1200, height: 630 },
    timeout: 20000,
  });
  console.log(`✅ ${t.file}`);
}
await browser.close();
