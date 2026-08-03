// ═══════════════════════════════════════════════════════════════
//  مولّد تصاميم البوستات — «آلية التصاميم» (طلب ريّان 2026-08-04)
//
//  الفكرة: بدل ما ندفع على تصميم كل بوست، ريّان بيكتب النص بملف
//  JSON (عربي بالملفات دايماً — قاعدة التيرمينال) والمولّد بيطلع
//  تصميمين بهوية الموقع بالضبط: مربع 1080×1080 (إنستا/لينكدإن)
//  وستوري 1080×1920. نفس تقنية مولّد الأغلفة: HTML بيتصور.
//
//  الاستخدام:
//    node _check/postgen.mjs مسار-الملف.json
//
//  شكل الملف (شوف أمثلة جاهزة بـ D:\Ryan-Work\Brand-Ryan\posts\_src):
//  {
//    "name": "launch",            ← اسم ملفات المخرجات
//    "template": "announce",      ← announce | article | quote
//    "lang": "ar",
//    "eyebrow": "سطر صغير فوق",
//    "title": "العنوان الكبير",
//    "lines": ["سطر", "سطر"],     ← نقاط/مميزات (اختياري)
//    "chip": "فيها لعبة",         ← وسم ليموني (اختياري)
//    "url": "ryanalali.me"
//  }
//
//  المخرجات: D:\Ryan-Work\Brand-Ryan\posts\<name>-sq.png و <name>-story.png
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'fs';

const cfgPath = process.argv[2];
if (!cfgPath) {
  console.error('❌ مرّر مسار ملف JSON: node _check/postgen.mjs المسار');
  process.exit(1);
}
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
const OUT = 'D:/Ryan-Work/Brand-Ryan/posts';
mkdirSync(OUT, { recursive: true });

const isAr = cfg.lang !== 'en';
const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');

// خطوط الموقع نفسها (نفس مصادر مولّد الأغلفة)
const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

// 🎛️ لوحة الهوية
const BG = '#0E0F12';
const ACCENT = '#D9FF3F';
const MUTED = '#A0A49B';

const html = (W, H) => {
  const story = H > W;
  const Y = (n) => Math.round(n * (story ? 1.25 : 1)) + 'px';
  const pad = story ? 90 : 76;

  const linesHtml = (cfg.lines || [])
    .map(
      (l) =>
        `<li style="display:flex;gap:16px;align-items:baseline;font-size:${Y(34)};line-height:1.7;color:#E8EAE3">
           <span style="color:${ACCENT};font-weight:800">·</span><span>${l}</span></li>`,
    )
    .join('');

  const chip = cfg.chip
    ? `<span style="display:inline-block;font-size:${Y(26)};font-weight:700;color:${ACCENT};
         border:2px solid ${ACCENT}55;border-radius:999px;padding:${Y(8)} ${Y(24)};margin-bottom:${Y(28)}">${cfg.chip}</span>`
    : '';

  // بالـ quote العنوان بياخد المساحة كلها بحجم أكبر
  const isQuote = cfg.template === 'quote';
  const titleSize = isQuote ? 76 : (cfg.title || '').length > 40 ? 56 : 64;

  return `<!doctype html><html dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
    @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
    @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
    @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
    *{margin:0;box-sizing:border-box}
  </style></head>
  <body style="width:${W}px;height:${H}px;background:
      radial-gradient(90% 60% at ${isAr ? '86%' : '14%'} 8%, ${ACCENT}14, transparent 60%),
      ${BG};
      font-family:'Alexandria',system-ui,sans-serif;color:#F2F3EE;
      display:flex;flex-direction:column;justify-content:space-between;
      padding:${pad}px;position:relative;overflow:hidden">

    <!-- خيط الإشارة — توقيع الهوية أسفل التصميم -->
    <svg viewBox="0 0 1080 60" style="position:absolute;bottom:${Y(150)};left:0;width:100%;height:${Y(60)};opacity:.5">
      <path d="M0,30 Q135,${story ? 6 : 10} 270,30 T540,30 T810,30 T1080,30" fill="none" stroke="${ACCENT}" stroke-width="3"/>
    </svg>

    <div>
      ${cfg.eyebrow ? `<p style="font-size:${Y(28)};font-weight:700;color:${ACCENT};margin-bottom:${Y(26)}">${cfg.eyebrow}</p>` : ''}
      ${chip}
      <h1 style="font-size:${Y(titleSize)};font-weight:800;line-height:1.4;letter-spacing:0;max-width:${story ? '100%' : '88%'}">${cfg.title || ''}</h1>
      ${linesHtml ? `<ul style="list-style:none;padding:0;margin-top:${Y(44)};display:grid;gap:${Y(6)}">${linesHtml}</ul>` : ''}
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between">
      <span style="font-family:'Grotesk','Alexandria',sans-serif;font-size:${Y(30)};font-weight:600;color:${MUTED};direction:ltr">${cfg.url || 'ryanalali.me'}</span>
      <img src="${logo}" style="width:${Y(84)};height:${Y(84)};opacity:.95">
    </div>
  </body></html>`;
};

const browser = await chromium.launch();
const page = await browser.newPage();
await page.route('http://post.local/**', async (route) => {
  const path = new URL(route.request().url()).pathname;
  if (FONTS[path]) return route.fulfill({ body: readFileSync(FONTS[path]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});

for (const [W, H, suffix] of [
  [1080, 1080, 'sq'],
  [1080, 1920, 'story'],
]) {
  await page.setViewportSize({ width: W, height: H });
  await page.goto('http://post.local/');
  await page.setContent(html(W, H), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/${cfg.name}-${suffix}.png` });
  console.log(`✅ ${cfg.name}-${suffix}.png`);
}
await browser.close();
console.log('المخرجات:', OUT);
