// غلاف الفيلم الرئيسي الإنجليزي 16:9 — نفس نمط باقي أغلفة الأفلام (site169)
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const SITE = 'D:/Ryan-Portfolio/site/public/assets/lpf';
const ACCENT = '#D9FF3F';
const BG = '#0E0F12';
const MUTED = '#A0A49B';
const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const site169 = (isAr, h1, h2) => `<!doctype html><html dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{width:1280px;height:720px;background:${BG};position:relative;overflow:hidden;
       font-family:'${isAr ? 'Alexandria' : 'Grotesk'}','Alexandria',sans-serif;color:#F2F3EE}
  h1,h2{line-height:1.4}
</style></head><body>
  <div style="position:absolute;inset:0;background:radial-gradient(60% 50% at ${isAr ? '88%' : '12%'} 6%, ${ACCENT}16, transparent 60%)"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(90% 60% at 50% 115%, #000000AA, transparent 70%)"></div>
  <svg viewBox="0 0 1280 60" style="position:absolute;bottom:120px;left:0;width:100%;height:44px;opacity:.4">
    <path d="M0,30 Q160,8 320,30 T640,30 T960,30 T1280,30" fill="none" stroke="${ACCENT}" stroke-width="2.5"/></svg>
  <img src="${logo}" style="position:absolute;top:36px;${isAr ? 'right' : 'left'}:44px;width:78px;height:78px;opacity:.95">
  <div style="position:absolute;top:150px;left:0;width:100%;text-align:center;padding:0 110px">
    <h1 style="font-size:58px;font-weight:800;color:${MUTED};text-shadow:0 4px 40px rgba(0,0,0,.9)">${h1}</h1>
    <h2 style="font-size:50px;font-weight:800;color:${ACCENT};margin-top:12px;text-shadow:0 4px 40px rgba(0,0,0,.9)">${h2}</h2>
  </div>
  <p style="position:absolute;bottom:34px;${isAr ? 'left' : 'right'}:44px;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:26px;font-weight:600;color:${MUTED};direction:ltr">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;

const COVERS = [
  ['lp-main-en-cover', site169(false, "The problem isn't the posts.", "It's what sits behind them.")],
  ['lp-main-cover', site169(true, 'المشكلة مش بالبوستات.', 'المشكلة باللي ورا البوستات.')],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');
for (const [name, html] of COVERS) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${SITE}/${name}.jpg`, type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1280, height: 720 } });
  console.log('✅', name);
}
await browser.close();
