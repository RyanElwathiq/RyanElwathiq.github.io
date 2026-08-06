// أغلفة الريلز العمودية — وكلاء AI + الاستراتيجية + فيلم الأرقام (2026-08-06)
// نفس لغة lpcoversv: لوجو فوق + هوك بالوسط + شارة + الدومين تحت
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const LP = 'D:/Ryan-Work/Brand-Ryan/Promo-LP';
const ACCENT = '#D9FF3F';
const BG = '#0E0F12';
const MUTED = '#A0A49B';

const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const shell = (visual, h1, h2, badge) => `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{width:1080px;height:1920px;background:${BG};position:relative;overflow:hidden;
       font-family:'Alexandria',sans-serif;color:#F2F3EE}
  h1,h2{line-height:1.42}
</style></head><body>
  <div style="position:absolute;inset:0;background:radial-gradient(70% 30% at 85% 4%, ${ACCENT}14, transparent 60%)"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(90% 40% at 50% 112%, #000000AA, transparent 70%)"></div>
  <img src="${logo}" style="position:absolute;top:120px;left:50%;transform:translateX(-50%);width:125px;height:125px;
       filter:drop-shadow(0 0 30px ${ACCENT}44)">
  ${visual}
  <div style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;padding:0 56px">
    <h1 style="font-size:80px;font-weight:800;text-shadow:0 6px 50px rgba(0,0,0,.95)">${h1}</h1>
    <h2 style="font-size:64px;font-weight:800;color:${ACCENT};margin-top:18px;text-shadow:0 6px 50px rgba(0,0,0,.95)">${h2}</h2>
    <div style="display:inline-block;margin-top:52px;font-size:33px;font-weight:700;
      border:2px solid ${ACCENT}88;border-radius:999px;padding:16px 44px;background:#12141AEE">${badge}</div>
  </div>
  <p style="position:absolute;bottom:140px;left:0;right:0;text-align:center;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:34px;font-weight:600;color:${MUTED};direction:ltr">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;

const threadV = (y, o = 0.35) => `<svg viewBox="0 0 1080 60" style="position:absolute;top:${y}px;left:0;width:100%;height:50px;opacity:${o}">
  <path d="M0,30 Q135,6 270,30 T540,30 T810,30 T1080,30" fill="none" stroke="${ACCENT}" stroke-width="2.5"/></svg>`;

const COVERS = [
  ['video-6-ai-agents', shell(
    `<div style="position:absolute;top:1300px;left:50%;transform:translateX(-50%);background:#151A0E;
       border:2px solid ${ACCENT}66;border-radius:22px;padding:22px 44px;font-size:34px;font-weight:700;
       box-shadow:0 0 40px ${ACCENT}22">وحدا رد عليه فوراً…</div>${threadV(1560)}`,
    'في موظف ما بينام،', 'وما بينسى.', '🤖 وكلاء الذكاء الاصطناعي',
  )],
  ['video-7-marketing-strategy', shell(
    `<div style="position:absolute;top:1300px;left:50%;transform:translateX(-50%);text-align:center;opacity:.75">
       <span style="position:relative;font-size:34px;font-weight:700;color:${MUTED}">جربت بوستات… جربت إعلانات…
         <span style="position:absolute;top:52%;right:0;left:0;height:3px;background:${ACCENT}"></span></span>
     </div>${threadV(1560)}`,
    'المشكلة مش بالتنفيذ.', 'المشكلة: ما في خطة.', '🧭 استراتيجية التسويق',
  )],
  ['film-2-numbers', shell(
    `<div style="position:absolute;top:1270px;left:50%;transform:translateX(-50%);display:flex;gap:40px;direction:ltr">
       <span style="font-family:'Grotesk','Alexandria',sans-serif;font-size:96px;font-weight:700;color:${ACCENT}">480</span>
       <span style="font-family:'Grotesk','Alexandria',sans-serif;font-size:96px;font-weight:700;color:${ACCENT};opacity:.6">320</span>
       <span style="font-family:'Grotesk','Alexandria',sans-serif;font-size:96px;font-weight:700;color:${ACCENT};opacity:.35">170</span>
     </div>${threadV(1560)}`,
    'قبل ما نحكي عن التسويق…', 'خلينا نحكي أرقام.', '📊 السوق الأردني بالأرقام',
  )],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');
for (const [dir, html] of COVERS) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${LP}/${dir}/reel-cover.png` });
  console.log('✅', dir);
}
await browser.close();
