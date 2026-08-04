// كوفر لينكدإن 1584×396 — نفس هوية مولّد البوستات
// ⚠️ صورة البروفايل بلينكدإن بتغطي الزاوية السفلية اليسارية —
//    فالنص متوسّط ومائل لليمين، والحافة اليسارية فاضية عن قصد
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/LinkedIn/linkedin-cover.png';
const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};
const BG = '#0E0F12';
const ACCENT = '#D9FF3F';
const MUTED = '#A0A49B';

const html = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
</style></head>
<body style="width:1584px;height:396px;background:
    radial-gradient(70% 120% at 88% 0%, ${ACCENT}16, transparent 60%),
    ${BG};
    font-family:'Alexandria',system-ui,sans-serif;color:#F2F3EE;
    position:relative;overflow:hidden;display:flex;align-items:center">

  <!-- خيط الإشارة -->
  <svg viewBox="0 0 1584 60" style="position:absolute;bottom:34px;left:0;width:100%;height:44px;opacity:.45">
    <path d="M0,30 Q198,8 396,30 T792,30 T1188,30 T1584,30" fill="none" stroke="${ACCENT}" stroke-width="3"/>
  </svg>

  <!-- المحتوى: متوسّط ومائل لليمين، بعيد عن دائرة صورة البروفايل -->
  <div style="padding-inline:110px 120px;width:100%;display:flex;align-items:center;justify-content:space-between;gap:60px">
    <div style="max-width:900px">
      <p style="font-size:30px;font-weight:700;color:${ACCENT};margin-bottom:14px">Full Stack Marketer</p>
      <h1 style="font-size:52px;font-weight:800;line-height:1.45">ما ببيع بوستات. بشخّص ليش مشروعك مش عم يبيع، وبعدها منبني.</h1>
      <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:27px;font-weight:600;color:${MUTED};margin-top:16px;direction:ltr;text-align:right">ryanalali.me</p>
    </div>
    <img src="${logo}" style="width:120px;height:120px;opacity:.95;flex-shrink:0">
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1584, height: 396 } });
await page.route('http://post.local/**', async (route) => {
  const path = new URL(route.request().url()).pathname;
  if (FONTS[path]) return route.fulfill({ body: readFileSync(FONTS[path]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: OUT });
console.log('✅', OUT);
await browser.close();
