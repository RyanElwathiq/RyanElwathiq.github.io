// ═══════════════════════════════════════════════════════════════
//  أغلفة الريلز الناقصة (2026-08-08) — ٣ عربي + ٦ إنجليزي
//
//  نفس نمط الأغلفة الستة عشر الموجودة: لوجو فوق بهالة · سطران
//  (أبيض ثم ليموني) · شارة بحدود ليمونية · سطر مشطوب اختياري ·
//  موجة · الدومين تحت. 1080×1920.
//
//  ⚠️ النصوص كلها من الأفلام نفسها حرفياً — ولا سطر مخترع.
//  ⚠️ الخط بينحمّل من node_modules عبر route، لأنه Playwright
//     ما بيقرا خطوط الموقع لحاله وبيسقط على خط النظام بصمت.
//
//  التشغيل: node _check/reelcovers-missing.mjs
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const OUT = 'G:/My Drive/ريّان الواثق — مكتبة الحملة/٣ — أغلفة الريلز';
const ACCENT = '#D9FF3F';
const BG = '#0E0F12';
const MUTED = '#A0A49B';
const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');

const FONTS = {
  '/__f/ar.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/lat.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/gro.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const page = (isAr, h1, h2, badge, strike) => `<!doctype html><html dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alexandria';src:url('/__f/ar.woff2') format('woff2');font-weight:100 900}
@font-face{font-family:'Alexandria';src:url('/__f/lat.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
@font-face{font-family:'Grotesk';src:url('/__f/gro.woff2') format('woff2');font-weight:300 800}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1920px;background:${BG};position:relative;overflow:hidden;
     font-family:'${isAr ? 'Alexandria' : 'Grotesk'}','Alexandria',sans-serif;color:#F2F3EE}
.glow{position:absolute;inset:0;background:radial-gradient(58% 34% at 50% 46%, ${ACCENT}12, transparent 62%)}
.glow2{position:absolute;inset:0;background:radial-gradient(80% 40% at 50% 108%, #000000AA, transparent 70%)}
.logo{position:absolute;top:130px;left:50%;transform:translateX(-50%);width:96px;height:96px;
      filter:drop-shadow(0 0 34px ${ACCENT}55)}
.mid{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;flex-direction:column;
     align-items:center;justify-content:center;padding:0 74px;gap:26px}
h1{font-size:${isAr ? 78 : 70}px;font-weight:800;line-height:1.28;text-align:center;
   text-shadow:0 6px 46px rgba(0,0,0,.95)}
h2{font-size:${isAr ? 74 : 66}px;font-weight:800;line-height:1.28;text-align:center;color:${ACCENT};
   text-shadow:0 6px 46px rgba(0,0,0,.95)}
.badge{margin-top:14px;border:2.5px solid ${ACCENT}AA;border-radius:999px;padding:18px 46px;
       font-size:36px;font-weight:700;color:#F2F3EE}
.strike{margin-top:52px;font-size:34px;color:${MUTED};text-decoration:line-through;
        text-decoration-color:${ACCENT}CC;text-decoration-thickness:3px;opacity:.85}
.wave{position:absolute;bottom:230px;left:0;width:100%;height:70px;opacity:.5}
.dom{position:absolute;bottom:110px;left:50%;transform:translateX(-50%);direction:ltr;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:40px;font-weight:700;color:${MUTED}}
</style></head><body>
<div class="glow"></div><div class="glow2"></div>
<img class="logo" src="${logo}">
<div class="mid">
  <h1>${h1}</h1>
  <h2>${h2}</h2>
  <div class="badge">${badge}</div>
  ${strike ? `<div class="strike">${strike}</div>` : ''}
</div>
<svg class="wave" viewBox="0 0 1080 70"><path d="M0,38 Q135,10 270,38 T540,38 T810,38 T1080,38"
  fill="none" stroke="${ACCENT}" stroke-width="3"/></svg>
<div class="dom">ryanalali<span style="color:${ACCENT}">.me</span></div>
</body></html>`;

// [ اسم الملف , عربي؟ , سطر ١ , سطر ٢ , الشارة , السطر المشطوب ]
const COVERS = [
  ['00-الفيلم-الرئيسي', true, 'المشكلة مش بالبوستات.', 'المشكلة باللي ورا البوستات.', '🎬 الفيلم الرئيسي', 'نشروا… دفعوا… جرّبوا…'],
  ['04-السوشال-ميديا', true, 'عندك ٣ ثواني.', 'إذا ما وقّف الإبهام، ما صار إشي.', '📱 السوشال ميديا', null],
  ['05-الهوية-البصرية', true, 'الفرق مش اللوجو.', 'الفرق نظام.', '🎨 الهوية البصرية', null],

  ['00-فيلم-الأرقام-EN', false, 'Before we talk marketing,', "let's talk numbers.", '📊 Market Data', null],
  ['01-المواقع-EN', false, 'Found an Instagram page?', 'They kept scrolling.', '🖥 Websites', null],
  ['02-فهرس-الخدمات-EN', false, 'Two kinds of agencies.', 'One asks why.', '🧭 Services', null],
  ['03-الإعلانات-الممولة-EN', false, 'It brought you likes.', 'And not one customer.', '🎯 Paid Ads', 'likes… reach… comments…'],
  ['06-وكلاء-الذكاء-EN', false, '3:12 in the morning.', 'Somebody answered.', '🤖 AI Agents', null],
  ['07-استراتيجية-التسويق-EN', false, "The problem isn't execution.", 'There is no plan.', '🧠 Strategy', 'daily posts… paid ads… lower price…'],
];

for (const c of COVERS) {
  const t = [c[2], c[3], c[5]].filter(Boolean).join(' ');
  if (/[—–]/.test(t)) throw new Error(`em-dash بـ${c[0]}`);
}

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await p.route('http://cov.local/**', async (route) => {
  const path = new URL(route.request().url()).pathname;
  if (FONTS[path]) return route.fulfill({ body: readFileSync(FONTS[path]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await p.goto('http://cov.local/');
for (const [name, isAr, h1, h2, badge, strike] of COVERS) {
  await p.setContent(page(isAr, h1, h2, badge, strike), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(220);
  await p.screenshot({ path: `${OUT}/${name}.png`, clip: { x: 0, y: 0, width: 1080, height: 1920 } });
  console.log('✅', name);
}
await browser.close();
