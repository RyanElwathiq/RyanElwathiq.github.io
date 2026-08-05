// ═══════════════════════════════════════════════════════════════
//  مصنع أغلفة فيديوهات الهبوط (2026-08-05)
//
//  أ) 10 أغلفة موقع 1280×720 (5 فيديوهات × لغتين) — بدل الفريمات
//     الخام. زر التشغيل والشيبة بيجوا من مكون LpFilm فوقها، فالوسط
//     مفضي عن قصد والهوك فوق.
//     ⚠️ أسماء جديدة -cover.jpg (قاعدة الكاش: محتوى جديد = اسم جديد)
//  ب) 4 أغلفة ريلز 1080×1920 للسوشال والهوية (عربي + إنجليزي)
//
//  التشغيل: node _check/lpcovers2.mjs
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const LP = 'D:/Ryan-Work/Brand-Ryan/Promo-LP';
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

// ─── أ) أغلفة الموقع 16:9 ───
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
    <h1 style="font-size:58px;font-weight:800;text-shadow:0 4px 40px rgba(0,0,0,.9)">${h1}</h1>
    <h2 style="font-size:44px;font-weight:800;color:${ACCENT};margin-top:12px;text-shadow:0 4px 40px rgba(0,0,0,.9)">${h2}</h2>
  </div>
  <p style="position:absolute;bottom:34px;${isAr ? 'left' : 'right'}:44px;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:26px;font-weight:600;color:${MUTED};direction:ltr">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;

const SITE_COVERS = [
  ['lp-websites-cover', site169(true, 'لقى صفحة إنستا؟ كمّل سكرول.', 'لقى موقع؟ وثّق واشترى.')],
  ['lp-websites-en-cover', site169(false, 'Found an Instagram page? They scroll on.', 'Found a website? They trust, they buy.')],
  ['lp-services-cover', site169(true, 'في نوعين من شركات التسويق.', 'أنا من النوع الثاني.')],
  ['lp-services-en-cover', site169(false, 'There are two kinds of marketing agencies.', "I'm the second kind.")],
  ['lp-paid-ads-cover', site169(true, 'دفعت ١٠٠ دينار بوست ممول؟', 'وولا زبون.')],
  ['lp-paid-ads-en-cover', site169(false, 'You paid 100 dinars for a boosted post?', 'And not one customer.')],
  ['lp-social-media-cover', site169(true, '٣ ثواني.', 'هاد كل الانتباه اللي بياخده بوستك.')],
  ['lp-social-media-en-cover', site169(false, '3 seconds.', "That's all the attention your post gets.")],
  ['lp-brand-identity-cover', site169(true, 'في علامات بتعرفها من بعيد.', 'الفرق مش اللوجو.')],
  ['lp-brand-identity-en-cover', site169(false, 'Some brands you know from across the street.', "The difference isn't the logo.")],
];

// ─── ب) أغلفة الريلز العمودية ───
const reel = (isAr, h1, h2, badge, visual) => `<!doctype html><html dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{width:1080px;height:1920px;background:${BG};position:relative;overflow:hidden;
       font-family:'${isAr ? 'Alexandria' : 'Grotesk'}','Alexandria',sans-serif;color:#F2F3EE}
  h1,h2{line-height:1.42}
</style></head><body>
  <div style="position:absolute;inset:0;background:radial-gradient(70% 30% at 85% 4%, ${ACCENT}14, transparent 60%)"></div>
  <img src="${logo}" style="position:absolute;top:120px;left:50%;transform:translateX(-50%);width:125px;height:125px;
       filter:drop-shadow(0 0 30px ${ACCENT}44)">
  ${visual}
  <div style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;padding:0 56px">
    <h1 style="font-size:80px;font-weight:800;text-shadow:0 6px 50px rgba(0,0,0,.95)">${h1}</h1>
    <h2 style="font-size:62px;font-weight:800;color:${ACCENT};margin-top:22px;text-shadow:0 6px 50px rgba(0,0,0,.95)">${h2}</h2>
    <div style="display:inline-block;margin-top:52px;font-size:33px;font-weight:700;color:#F2F3EE;
         background:rgba(14,15,18,.75);border:1.5px solid ${ACCENT}66;border-radius:999px;padding:14px 42px">${badge}</div>
  </div>
  <p style="position:absolute;bottom:120px;left:0;width:100%;text-align:center;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:44px;font-weight:600;direction:ltr;
     text-shadow:0 4px 30px rgba(0,0,0,.9)">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;

const socialVisual = `<div style="position:absolute;left:50%;bottom:270px;transform:translateX(-50%);text-align:center">
  <p style="font-family:'Grotesk',sans-serif;font-size:280px;font-weight:700;color:${ACCENT};opacity:.28;line-height:1">3</p></div>`;
const brandVisual = `<div style="position:absolute;left:50%;bottom:330px;transform:translateX(-50%);
  width:220px;height:220px;border-radius:36%;background:${ACCENT};opacity:.35;box-shadow:0 0 120px ${ACCENT}44"></div>`;

const REEL_COVERS = [
  ['video-4-social-media/reel-cover-ar', reel(true, '٣ ثواني.', 'هاد كل انتباه بوستك.', 'فيديو السوشال · ٤٦ ثانية', socialVisual)],
  ['video-4-social-media/reel-cover-en', reel(false, '3 seconds.', "That's all your post gets.", 'Social video · 0:46', socialVisual)],
  ['video-5-brand-identity/reel-cover-ar', reel(true, 'في علامات بتعرفها من بعيد.', 'الفرق مش اللوجو.', 'فيديو الهوية · دقيقة ونص', brandVisual)],
  ['video-5-brand-identity/reel-cover-en', reel(false, 'Some brands you just know.', "The difference isn't the logo.", 'Brand video · 1:32', brandVisual)],
];

const browser = await chromium.launch();
const p169 = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const pv = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
for (const pg of [p169, pv]) {
  await pg.route('http://post.local/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (FONTS[path]) return route.fulfill({ body: readFileSync(FONTS[path]), contentType: 'font/woff2' });
    route.fulfill({ body: '', contentType: 'text/html' });
  });
  await pg.goto('http://post.local/');
}
for (const [name, html] of SITE_COVERS) {
  await p169.setContent(html, { waitUntil: 'networkidle' });
  await p169.evaluate(() => document.fonts.ready);
  await p169.waitForTimeout(200);
  await p169.screenshot({ path: `${SITE}/${name}.jpg`, type: 'jpeg', quality: 88 });
  console.log('✅ site:', name);
}
for (const [name, html] of REEL_COVERS) {
  await pv.setContent(html, { waitUntil: 'networkidle' });
  await pv.evaluate(() => document.fonts.ready);
  await pv.waitForTimeout(200);
  await pv.screenshot({ path: `${LP}/${name}.png` });
  console.log('✅ reel:', name);
}
await browser.close();
