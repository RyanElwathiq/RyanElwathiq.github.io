// ═══════════════════════════════════════════════════════════════
//  أغلفة الريلز للفيديوهات العمودية الثلاثة (2026-08-05)
//
//  نفس لغة reel-cover تبع الفيلم: لوجو فوق + سؤال الهوك بالوسط
//  (المربع الآمن لقصة شبكة البروفايل) + شارة + الدومين تحت —
//  ولمسة بصرية من الفيديو نفسه: واجهة/كروت/أشرطة.
//
//  التشغيل: node _check/lpcoversv.mjs
//  المخرجات: Promo-LP/video-N-*/reel-cover.png (1080×1920)
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const LP = 'D:/Ryan-Work/Brand-Ryan/Promo-LP';
const ACCENT = '#D9FF3F';
const BG = '#0E0F12';
const MUTED = '#A0A49B';

const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const mockRestaurant =
  'data:image/png;base64,' + readFileSync(`${LP}/assets/mock-restaurant.png`).toString('base64');

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/grotesk-latin-wght-normal.woff2'.replace('grotesk-latin-wght-normal', 'space-grotesk-latin-wght-normal'),
};

const shell = (visual, h1, h2, badge) => `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{width:1080px;height:1920px;background:${BG};position:relative;overflow:hidden;
       font-family:'Alexandria',sans-serif;color:#F2F3EE}
  h1,h2{line-height:1.4}
</style></head><body>
  <div style="position:absolute;inset:0;background:radial-gradient(70% 30% at 85% 4%, ${ACCENT}14, transparent 60%)"></div>
  <img src="${logo}" style="position:absolute;top:120px;left:50%;transform:translateX(-50%);width:125px;height:125px;
       filter:drop-shadow(0 0 30px ${ACCENT}44)">
  ${visual}
  <div style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;padding:0 56px">
    <h1 style="font-size:82px;font-weight:800;color:#F2F3EE;text-shadow:0 6px 50px rgba(0,0,0,.95)">${h1}</h1>
    <h2 style="font-size:66px;font-weight:800;color:${ACCENT};margin-top:18px;text-shadow:0 6px 50px rgba(0,0,0,.95)">${h2}</h2>
    <div style="display:inline-block;margin-top:52px;font-size:33px;font-weight:700;color:#F2F3EE;
         background:rgba(14,15,18,.75);border:1.5px solid ${ACCENT}66;border-radius:999px;padding:14px 42px">${badge}</div>
  </div>
  <p style="position:absolute;bottom:120px;left:0;width:100%;text-align:center;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:44px;font-weight:600;color:#F2F3EE;direction:ltr;
     text-shadow:0 4px 30px rgba(0,0,0,.9)">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;

// ١) المواقع: واجهة المطعم مايلة خلف النص، خافتة تحت
const v1 = shell(
  `<div style="position:absolute;left:50%;bottom:250px;width:900px;transform:translateX(-50%) rotate(-4deg);
     border-radius:20px;overflow:hidden;opacity:.5;box-shadow:0 40px 100px rgba(0,0,0,.7)">
     <img src="${mockRestaurant}" style="width:100%;display:block"></div>
   <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,${BG}EE 78%)"></div>`,
  'لقى إنستا؟ كمّل سكرول.',
  'لقى موقع؟ وثّق واشترى.',
  'فيديو المواقع · ٢٤ ثانية',
);

// ٢) الخدمات: كروت الأربع خدمات مصغرة تحت النص
const cards = ['استراتيجية', 'إعلانات ممولة', 'هوية بصرية', 'مواقع']
  .map(
    (n, i) => `<div style="width:220px;height:150px;background:#15171C;border:2px solid ${ACCENT}44;border-radius:18px;
      padding:18px;display:flex;flex-direction:column;justify-content:space-between">
      <span style="font-family:'Grotesk',sans-serif;font-size:26px;font-weight:700;color:${ACCENT}55;direction:ltr;text-align:left">٠${i + 1}</span>
      <span style="font-size:24px;font-weight:800">${n}</span></div>`,
  )
  .join('');
const v2 = shell(
  `<div style="position:absolute;left:50%;bottom:300px;transform:translateX(-50%);display:grid;
     grid-template-columns:repeat(2,220px);gap:22px;opacity:.85">${cards}</div>`,
  'في نوعين من شركات التسويق.',
  'أنا من النوع الثاني.',
  'فيديو الخدمات · ٢٤ ثانية',
);

// ٣) الإعلانات: أشرطة ROAS/CPL/CTR تحت النص
const bars = [
  ['ROAS', 420],
  ['CPL', 300],
  ['CTR', 360],
]
  .map(
    ([r, w]) => `<div style="display:flex;align-items:center;gap:24px">
      <span style="font-family:'Grotesk',sans-serif;font-size:36px;font-weight:700;width:120px;direction:ltr;text-align:left">${r}</span>
      <div style="width:${w}px;height:20px;background:linear-gradient(90deg,${ACCENT},${ACCENT}66);border-radius:999px"></div></div>`,
  )
  .join('');
const v3 = shell(
  `<div style="position:absolute;left:50%;bottom:320px;transform:translateX(-50%);display:flex;
     flex-direction:column;gap:26px;opacity:.9">${bars}</div>`,
  'دفعت ١٠٠ دينار بوست ممول؟',
  'وولا زبون.',
  'فيديو الإعلانات · ٢٥ ثانية',
);

const OUTS = [
  ['video-1-websites', v1],
  ['video-2-services', v2],
  ['video-3-paid-ads', v3],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');
for (const [dir, html] of OUTS) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${LP}/${dir}/reel-cover.png` });
  console.log('✅', dir, '/reel-cover.png');
}
await browser.close();
