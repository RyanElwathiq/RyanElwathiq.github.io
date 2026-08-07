// أغلفة فيلم مقال «أول إعلان ممول» (2026-08-07)
// ٢ للموقع 16:9 (عربي وإنجليزي) + ٢ للريلز 9:16
// ⚠️ الغلاف بيستخدم نفس مجرّد المشهد الأقوى بالفيلم: العدّاد بلا إبرة
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const SITE = 'D:/Ryan-Portfolio/site/public/assets/lpf';
const LP = 'D:/Ryan-Work/Brand-Ryan/Promo-LP/article-1-first-ad';
const ACCENT = '#D9FF3F';
const BG = '#0E0F12';
const MUTED = '#A0A49B';
const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};
const faces = `
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}`;

const P = (cx, cy, r, d) => [cx + r * Math.cos((d * Math.PI) / 180), cy + r * Math.sin((d * Math.PI) / 180)];

// العدّاد بلا إبرة — نفس مجرّد الفيلم والتصميم
const gauge = (W, cx, cy, R) => {
  let t = '';
  for (let i = 0; i <= 32; i++) {
    const a = -198 + (216 * i) / 32;
    const M = i % 4 === 0;
    const [x0, y0] = P(cx, cy, R, a);
    const [x1, y1] = P(cx, cy, R - (M ? 20 : 10), a);
    t += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}"
      stroke="${ACCENT}" stroke-width="${M ? 2.4 : 1.4}" opacity="${M ? 0.6 : 0.26}" stroke-linecap="round"/>`;
  }
  const [ax, ay] = P(cx, cy, R, -198);
  const [bx, by] = P(cx, cy, R, 18);
  return `<svg viewBox="0 0 ${W} ${W}" style="position:absolute;inset:0;width:100%;height:100%">
    <defs><filter id="g" filterUnits="userSpaceOnUse" x="${-W}" y="${-W}" width="${W * 3}" height="${W * 3}">
      <feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
    <path d="M ${ax.toFixed(1)} ${ay.toFixed(1)} A ${R} ${R} 0 1 1 ${bx.toFixed(1)} ${by.toFixed(1)}"
      fill="none" stroke="${ACCENT}" stroke-width="2.8" opacity=".5" stroke-linecap="round" filter="url(#g)"/>
    ${t}
    <circle cx="${cx}" cy="${cy}" r="7" fill="none" stroke="${ACCENT}" stroke-width="2" opacity=".5"/>
    <circle cx="${cx}" cy="${cy}" r="2.4" fill="${ACCENT}" opacity=".8" filter="url(#g)"/>
  </svg>`;
};

const site169 = (isAr, h1, h2) => `<!doctype html><html dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>${faces}
  *{margin:0;box-sizing:border-box}
  body{width:1280px;height:720px;background:${BG};position:relative;overflow:hidden;
       font-family:'${isAr ? 'Alexandria' : 'Grotesk'}','Alexandria',sans-serif;color:#F2F3EE}
  h1,h2{line-height:1.4}
</style></head><body>
  <div style="position:absolute;inset:0;background:radial-gradient(60% 50% at ${isAr ? '88%' : '12%'} 6%, ${ACCENT}16, transparent 60%)"></div>
  <!-- ⚠️ العدّاد لازم يبين نصه على الأقل: بالـ16:9 الارتفاع ٧٢٠ بس -->
  <div style="position:absolute;left:0;top:-40px;width:100%;height:1280px">${gauge(1280, 640, 640, 215)}</div>
  <div style="position:absolute;inset:0;background:radial-gradient(90% 60% at 50% 118%, #000000BB, transparent 66%)"></div>
  <img src="${logo}" style="position:absolute;top:36px;${isAr ? 'right' : 'left'}:44px;width:78px;height:78px;opacity:.95">
  <div style="position:absolute;top:150px;left:0;width:100%;text-align:center;padding:0 110px">
    <h1 style="font-size:${isAr ? 54 : 46}px;font-weight:800;color:${MUTED};text-shadow:0 4px 40px rgba(0,0,0,.9)">${h1}</h1>
    <h2 style="font-size:${isAr ? 50 : 44}px;font-weight:800;color:${ACCENT};margin-top:14px;text-shadow:0 4px 40px rgba(0,0,0,.9)">${h2}</h2>
  </div>
  <p style="position:absolute;bottom:34px;${isAr ? 'left' : 'right'}:44px;font-family:'Grotesk','Alexandria',sans-serif;
     font-size:26px;font-weight:600;color:${MUTED};direction:ltr">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;

const reel = (isAr, h1, h2, badge) => `<!doctype html><html dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>${faces}
  *{margin:0;box-sizing:border-box}
  body{width:1080px;height:1920px;background:${BG};position:relative;overflow:hidden;
       font-family:'${isAr ? 'Alexandria' : 'Grotesk'}','Alexandria',sans-serif;color:#F2F3EE}
  h1,h2{line-height:1.42}
</style></head><body>
  <div style="position:absolute;inset:0;background:radial-gradient(70% 30% at ${isAr ? '85%' : '15%'} 4%, ${ACCENT}14, transparent 60%)"></div>
  <div style="position:absolute;left:0;top:900px;width:100%;height:1080px">${gauge(1080, 540, 520, 250)}</div>
  <div style="position:absolute;inset:0;background:radial-gradient(90% 40% at 50% 112%, #000000AA, transparent 70%)"></div>
  <img src="${logo}" style="position:absolute;top:120px;left:50%;transform:translateX(-50%);width:125px;height:125px;
       filter:drop-shadow(0 0 30px ${ACCENT}44)">
  <div style="position:absolute;left:0;right:0;top:44%;transform:translateY(-50%);text-align:center;padding:0 56px">
    <h1 style="font-size:${isAr ? 68 : 58}px;font-weight:800;text-shadow:0 6px 50px rgba(0,0,0,.95)">${h1}</h1>
    <h2 style="font-size:${isAr ? 62 : 54}px;font-weight:800;color:${ACCENT};margin-top:18px;text-shadow:0 6px 50px rgba(0,0,0,.95)">${h2}</h2>
    <div style="display:inline-block;margin-top:52px;font-size:33px;font-weight:700;
      border:2px solid ${ACCENT}88;border-radius:999px;padding:16px 44px;background:#12141AEE">${badge}</div>
  </div>
  <p style="position:absolute;bottom:140px;left:0;right:0;text-align:center;font-family:'Grotesk','Alexandria',sans-serif;
     font-size:34px;font-weight:600;color:${MUTED};direction:ltr">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;

const browser = await chromium.launch();
const mk = async (wpx, hpx, jobs) => {
  const p = await browser.newPage({ viewport: { width: wpx, height: hpx } });
  await p.route('http://post.local/**', async (r) => {
    const u = new URL(r.request().url()).pathname;
    if (FONTS[u]) return r.fulfill({ body: readFileSync(FONTS[u]), contentType: 'font/woff2' });
    r.fulfill({ body: '', contentType: 'text/html' });
  });
  await p.goto('http://post.local/');
  for (const [path, html, jpeg] of jobs) {
    await p.setContent(html, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(220);
    await p.screenshot(jpeg ? { path, type: 'jpeg', quality: 88 } : { path });
    console.log('✅', path.split('/').pop());
  }
  await p.close();
};

await mk(1280, 720, [
  [`${SITE}/lp-firstad-cover.jpg`, site169(true, 'بلا قياس، إنت مش عم تعلن.', 'إنت عم تدفع وتتمنّى الخير.'), true],
  [`${SITE}/lp-firstad-en-cover.jpg`, site169(false, "Without measurement, you're not advertising.", "You're paying, and hoping."), true],
]);
await mk(1080, 1920, [
  [`${LP}/reel-cover.png`, reel(true, 'بلا قياس،', 'إنت مش عم تعلن.', '📊 أول إعلان ممول')],
  [`${LP}/reel-cover-en.png`, reel(false, 'Without measurement,', "you're not advertising.", '📊 Your first paid ad')],
]);
await browser.close();
