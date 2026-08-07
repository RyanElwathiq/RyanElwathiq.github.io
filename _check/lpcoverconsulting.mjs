// أغلفة فيديو الاستشارة والتدريب (2026-08-06)
// ٣ أغلفة: 16:9 عربي + 16:9 إنجليزي للموقع، و9:16 للريلز
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const SITE = 'D:/Ryan-Portfolio/site/public/assets/lpf';
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

const fontFaces = `
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}`;

// ─── غلاف الموقع 16:9 ───
const site169 = (isAr, h1, h2) => `<!doctype html><html dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>${fontFaces}
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
  <div style="position:absolute;top:158px;left:0;width:100%;text-align:center;padding:0 110px">
    <h1 style="font-size:54px;font-weight:800;color:${MUTED};text-shadow:0 4px 40px rgba(0,0,0,.9)">${h1}</h1>
    <h2 style="font-size:52px;font-weight:800;color:${ACCENT};margin-top:14px;text-shadow:0 4px 40px rgba(0,0,0,.9)">${h2}</h2>
  </div>
  <p style="position:absolute;bottom:34px;${isAr ? 'left' : 'right'}:44px;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:26px;font-weight:600;color:${MUTED};direction:ltr">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;

// ─── غلاف الريلز 9:16 (عربي وإنجليزي) ───
const REEL_T = {
  ar: {
    // تصحيح ريّان 2026-08-07: «مش ناقصك» صارت «ما بكون ناقصك … بل»
    h1: 'أحياناً ما بكون ناقصك موظّف.',
    h2: 'بل حدا بيفهمك.',
    badge: '🎓 استشارة وتدريب',
    line: ['بتدفع مقابل المعرفة، ', 'وبتضل معك', '.'],
  },
  en: {
    h1: "Sometimes you don't need another hire.",
    h2: 'You need someone to explain it.',
    badge: '🎓 Consulting and training',
    line: ['You pay for the knowledge, ', 'and it stays with you', '.'],
  },
};

const reel = (lang) => {
  const t = REEL_T[lang];
  const isAr = lang === 'ar';
  return `<!doctype html><html dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>${fontFaces}
  *{margin:0;box-sizing:border-box}
  body{width:1080px;height:1920px;background:${BG};position:relative;overflow:hidden;
       font-family:'${isAr ? 'Alexandria' : 'Grotesk'}','Alexandria',sans-serif;color:#F2F3EE}
  h1,h2{line-height:1.42}
</style></head><body>
  <div style="position:absolute;inset:0;background:radial-gradient(70% 30% at 85% 4%, ${ACCENT}14, transparent 60%)"></div>
  <div style="position:absolute;inset:0;background:radial-gradient(90% 40% at 50% 112%, #000000AA, transparent 70%)"></div>
  <img src="${logo}" style="position:absolute;top:120px;left:50%;transform:translateX(-50%);width:125px;height:125px;
       filter:drop-shadow(0 0 30px ${ACCENT}44)">
  <!-- ⚠️ سطر عادي مش بقّة: البادج تحت العنوان بقّة كمان، وبقّتين
       قريبين من بعض بيبينوا مكررين وبياكلوا الهرمية -->
  <div style="position:absolute;top:1360px;left:0;right:0;text-align:center;padding:0 70px;
       font-size:${isAr ? 36 : 32}px;font-weight:600;color:${MUTED};white-space:nowrap">${t.line[0]}<span style="color:${ACCENT}">${t.line[1]}</span>${t.line[2]}</div>
  <svg viewBox="0 0 1080 60" style="position:absolute;top:1560px;left:0;width:100%;height:50px;opacity:.35">
    <path d="M0,30 Q135,6 270,30 T540,30 T810,30 T1080,30" fill="none" stroke="${ACCENT}" stroke-width="2.5"/></svg>
  <div style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;padding:0 56px">
    <h1 style="font-size:${isAr ? 72 : 64}px;font-weight:800;text-shadow:0 6px 50px rgba(0,0,0,.95)">${t.h1}</h1>
    <h2 style="font-size:${isAr ? 66 : 58}px;font-weight:800;color:${ACCENT};margin-top:18px;text-shadow:0 6px 50px rgba(0,0,0,.95)">${t.h2}</h2>
    <div style="display:inline-block;margin-top:52px;font-size:33px;font-weight:700;
      border:2px solid ${ACCENT}88;border-radius:999px;padding:16px 44px;background:#12141AEE">${t.badge}</div>
  </div>
  <p style="position:absolute;bottom:140px;left:0;right:0;text-align:center;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:34px;font-weight:600;color:${MUTED};direction:ltr">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;
};

const browser = await chromium.launch();

// 16:9
const p169 = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await p169.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await p169.goto('http://post.local/');
for (const [name, html] of [
  // ⚠️ اسم جديد بعد تصحيح النص (قاعدة كاش كلاودفلير: تغيير المحتوى
  //    = اسم ملف جديد، وإلا الزائر بيضل يشوف النسخة القديمة المخزّنة)
  ['lp-consulting-3-cover', site169(true, 'أحياناً ما بكون ناقصك موظّف.', 'بل حدا بيفهمك.')],
  ['lp-consulting-en-cover', site169(false, "Sometimes you don't need another hire.", 'You need someone to explain it.')],
]) {
  await p169.setContent(html, { waitUntil: 'networkidle' });
  await p169.evaluate(() => document.fonts.ready);
  await p169.waitForTimeout(200);
  await p169.screenshot({ path: `${SITE}/${name}.jpg`, type: 'jpeg', quality: 88 });
  console.log('✅', name);
}
await p169.close();

// 9:16
const p916 = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await p916.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await p916.goto('http://post.local/');
for (const [file, lang] of [
  ['reel-cover.png', 'ar'],
  ['reel-cover-en.png', 'en'],
]) {
  await p916.setContent(reel(lang), { waitUntil: 'networkidle' });
  await p916.evaluate(() => document.fonts.ready);
  await p916.waitForTimeout(200);
  await p916.screenshot({ path: `${LP}/video-10-consulting/${file}` });
  console.log('✅ video-10-consulting/' + file);
}

await browser.close();
