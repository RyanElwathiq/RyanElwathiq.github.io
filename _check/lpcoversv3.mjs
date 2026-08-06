// أغلفة الريلز العمودية — SEO والمونتاج، عربي وإنجليزي (2026-08-06)
// نفس لغة lpcoversv2: لوجو فوق + هوك بالوسط + شارة + سطر داعم + الدومين تحت
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

const threadV = (y, o = 0.35) => `<svg viewBox="0 0 1080 60" style="position:absolute;top:${y}px;left:0;width:100%;height:50px;opacity:${o}">
  <path d="M0,30 Q135,6 270,30 T540,30 T810,30 T1080,30" fill="none" stroke="${ACCENT}" stroke-width="2.5"/></svg>`;

const shell = (isAr, visual, h1, h2, badge, h1s = 72, h2s = 66) => `<!doctype html><html dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{width:1080px;height:1920px;background:${BG};position:relative;overflow:hidden;
       font-family:'${isAr ? 'Alexandria' : 'Grotesk'}','Alexandria',sans-serif;color:#F2F3EE}
  h1,h2{line-height:1.42}
</style></head><body>
  <div style="position:absolute;inset:0;background:radial-gradient(70% 30% at ${isAr ? '85%' : '15%'} 4%, ${ACCENT}14, transparent 60%)"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(90% 40% at 50% 112%, #000000AA, transparent 70%)"></div>
  <img src="${logo}" style="position:absolute;top:120px;left:50%;transform:translateX(-50%);width:125px;height:125px;
       filter:drop-shadow(0 0 30px ${ACCENT}44)">
  ${visual}
  <div style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;padding:0 56px">
    <h1 style="font-size:${h1s}px;font-weight:800;text-shadow:0 6px 50px rgba(0,0,0,.95)">${h1}</h1>
    <h2 style="font-size:${h2s}px;font-weight:800;color:${ACCENT};margin-top:18px;text-shadow:0 6px 50px rgba(0,0,0,.95)">${h2}</h2>
    <div style="display:inline-block;margin-top:52px;font-size:33px;font-weight:700;
      border:2px solid ${ACCENT}88;border-radius:999px;padding:16px 44px;background:#12141AEE">${badge}</div>
  </div>
  <p style="position:absolute;bottom:140px;left:0;right:0;text-align:center;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:34px;font-weight:600;color:${MUTED};direction:ltr">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;

// السطر الداعم: نص عادي مش بقّة، عشان ما يتنافس مع الشارة
// ⚠️ top بينتقل لتحت لما يكون فوقه رقم كبير، وإلا بيتراكبوا
const support = (txt, hi, tail, size = 36, top = 1360) =>
  `<div style="position:absolute;top:${top}px;left:0;right:0;text-align:center;padding:0 70px;
     font-size:${size}px;font-weight:600;color:${MUTED};white-space:nowrap">${txt}<span style="color:${ACCENT}">${hi}</span>${tail}</div>`;

const COVERS = [
  // ─── SEO ───
  ['video-8-seo/reel-cover.png', shell(true,
    `${support('الإعلان بيوقف. ', 'البحث بيضل', '.')}${threadV(1560)}`,
    'بتكتب اسم شغلك بجوجل…', 'وبتلاقي منافسك. مش إنت.', '🔍 تحسين محركات البحث', 66, 60,
  )],
  ['video-8-seo/reel-cover-en.png', shell(false,
    `${support('Ads stop. ', 'Search keeps going', '.', 32)}${threadV(1560)}`,
    'Type your business into Google…', 'and find your competitor.', '🔍 Search engine optimisation', 58, 54,
  )],
  // ─── المونتاج ───
  ['video-9-video-editing/reel-cover.png', shell(true,
    `<div style="position:absolute;top:1240px;left:0;right:0;text-align:center;line-height:1">
       <span style="font-family:'Grotesk','Alexandria',sans-serif;font-size:110px;font-weight:700;color:${ACCENT};direction:ltr">290K</span>
     </div>${support('مشاهدة على منشور واحد. ', 'مش حظ', '.', 34, 1400)}${threadV(1600)}`,
    'فيديوهاتك حلوة.', 'بس ما حدا بيكمّلها.', '🎬 مونتاج ريلز وإعلانات', 70, 64,
  )],
  ['video-9-video-editing/reel-cover-en.png', shell(false,
    `<div style="position:absolute;top:1240px;left:0;right:0;text-align:center;line-height:1">
       <span style="font-family:'Grotesk','Alexandria',sans-serif;font-size:110px;font-weight:700;color:${ACCENT};direction:ltr">290K</span>
     </div>${support('views on one post. ', 'Not luck', '.', 32, 1400)}${threadV(1600)}`,
    'Your videos look good.', 'But nobody finishes them.', '🎬 Reels and ad editing', 62, 58,
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
for (const [file, html] of COVERS) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${LP}/${file}` });
  console.log('✅', file);
}
await browser.close();
