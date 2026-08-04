// ═══════════════════════════════════════════════════════════════
//  كروت صفحة الخدمات بلينكدإن (Service Page media) — 2026-08-04
//
//  ٨ كروت 1080×1080 بهوية الموقع: ٤ أعمال حقيقية ملفوفة بإطار
//  ليموني (نفس فلسفة نظام «الإطار»: محتوى العميل بألواننا إحنا)
//  + ٤ كروت خدمات بنفس صوت الموقع.
//
//  نفس تقنية postgen: HTML بيتصور بخطوط الموقع الحقيقية.
//  الاستخدام:  node _check/svc-cards.mjs
//  المخرجات:  D:\Ryan-Work\Brand-Ryan\Social\LinkedIn\ServicePage\
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'fs';

// ⚠️ درس 2026-08-04: ميديا صفحة الخدمات بلينكدإن بتنعرض بإطار
//    عريض وبتقص المربع — فالرفع من نسخ wide، والمربع بيضل للبوستات
const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/LinkedIn/ServicePage';
const OUT_SQ = 'D:/Ryan-Work/Brand-Ryan/Social/LinkedIn/Cards-Square';
mkdirSync(OUT, { recursive: true });
mkdirSync(OUT_SQ, { recursive: true });

const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const img64 = (p) => 'data:image/webp;base64,' + readFileSync(`public/assets/work/${p}`).toString('base64');
// صور من أرشيف ريّان الشخصي (سمح فيه 2026-08-04)
const raw64 = (p) => 'data:image/jpeg;base64,' + readFileSync(p).toString('base64');

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};
const BG = '#0E0F12';
const ACCENT = '#D9FF3F';
const MUTED = '#A0A49B';

// ─── ٤ كروت أعمال ───
// imgs: مسار مطلق (أرشيف ريّان) أو نسبي من public/assets/work
const RAW = 'D:/Ryan-Work/Brand-Ryan/Social/_Sources/linkedin-raw';
const WORK = [
  { name: '1-work-luvit', imgs: ['luvit/coverFinal-01.webp'], chip: 'براند متكامل من الصفر', title: 'LUV IT — العناية بالبشرة', line: 'هوية، تغليف، محتوى، وموقع إلكتروني' },
  { name: '2-work-pasticcini', imgs: [`${RAW}/p05.jpg`, `${RAW}/p06.jpg`], chip: 'هوية متكاملة', title: 'Pasticcini — معجنات', line: 'لوجو ونظام هوية، وتطبيقهم عالمحل والكشك' },
  { name: '3-work-orient', imgs: ['orient-enam/orient-enam-01.webp'], chip: 'هوية بصرية', title: 'Orient ENAM', line: 'شعار ونظام هوية كامل' },
  {
    name: '4-work-infinity',
    imgs: ['D:/Ryan-Personal/Misc/abd/WhatsApp Image 2024-09-30 at 12.43.12 AM.jpeg', `${RAW}/p08.jpg`, `${RAW}/p09.jpg`],
    chip: 'حملة سوشال متكاملة',
    title: 'INFINITY X PLUS',
    line: 'مفهوم إبداعي واحد ماشي على الحملة كلها',
  },
  {
    name: '5-work-products',
    imgs: [`${RAW}/p04.jpg`, 'D:/Ryan-Personal/Misc/DESIGN.jpg'],
    chip: 'إعلانات منتجات',
    title: 'منتجات بتنباع من الصورة',
    line: 'عطور وعناية بالبشرة — إعلانات بتبيع مش بس بتبيّن',
  },
  {
    name: '6-work-art',
    imgs: [`${RAW}/p03.jpg`, `${RAW}/p10.jpg`, `${RAW}/p02.jpg`],
    chip: 'مانيبيوليشن وتصميم إبداعي',
    title: 'خيال بينفّذ',
    line: 'لما الفكرة بدها صورة مش موجودة — منركّبها',
  },
  {
    name: '7-work-drsamir',
    imgs: [`${RAW}/p11.jpg`, `${RAW}/p12.jpg`],
    // ⚠️ fit: contain — طلب ريّان: التصميم كله يبين بلا ولا قصة
    fit: 'contain',
    chip: 'محتوى طبي',
    title: 'د. سمير القراعين — نسائية وتوليد',
    line: 'محتوى بيبني ثقة المريضة قبل ما توصل العيادة',
  },
  { name: '8-work-mofakron', imgs: ['al-mofakron/al-mofakron-01.webp'], chip: 'تصاميم سوشال', title: 'المفكرون للألمنيوم', line: 'حضور بصري ثابت ومتسق بالسوق' },
];

// ─── ٤ كروت خدمات ───
const SVC = [
  { name: '9-svc-diagnosis', kicker: 'أول خطوة بأي شغل', title: 'ما ببيع بوستات.\nبشخّص، وبعدها منبني.', points: ['تشخيص للوضع قبل أي التزام', 'نطاق مكتوب بسعر ثابت', 'قرارات بالأرقام مش بالإحساس'] },
  { name: '10-svc-websites', kicker: 'مواقع إلكترونية', title: 'موقع بيبيع،\nمش بس بيبيّن حلو', points: ['رحلة زبون مدروسة من الإعلان للطلب', 'سرعة وسيو من اليوم الأول', 'بيشتغل ٢٤/٧ — حتى وإنت نايم'] },
  { name: '11-svc-ads', kicker: 'إعلانات ممولة', title: 'ميزانية على قرارات،\nمش على تخمين', points: ['استهداف مبني على فهم زبونك', 'قياس لكل دينار وين راح', 'تقارير بتفهمها — مش أرقام استعراض'] },
];

const head = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
</style></head>`;

const signal = (bottom) => `<svg viewBox="0 0 1080 60" style="position:absolute;bottom:${bottom}px;left:0;width:100%;height:56px;opacity:.4">
  <path d="M0,30 Q135,8 270,30 T540,30 T810,30 T1080,30" fill="none" stroke="${ACCENT}" stroke-width="3"/></svg>`;

const footer = `<div style="display:flex;align-items:center;justify-content:space-between">
  <span style="font-family:'Grotesk','Alexandria',sans-serif;font-size:28px;font-weight:600;color:${MUTED};direction:ltr">ryanalali.me</span>
  <img src="${logo}" style="width:76px;height:76px;opacity:.95"></div>`;

const workHtml = (c) => `${head}
<body style="width:1080px;height:1080px;background:radial-gradient(90% 60% at 86% 6%, ${ACCENT}12, transparent 60%), ${BG};
  font-family:'Alexandria',system-ui,sans-serif;color:#F2F3EE;display:flex;flex-direction:column;padding:70px;position:relative;overflow:hidden">
  ${signal(140)}
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
    <span style="font-size:24px;font-weight:700;color:${ACCENT};border:2px solid ${ACCENT}55;border-radius:999px;padding:8px 24px">${c.chip}</span>
  </div>
  <h1 style="font-size:52px;font-weight:800;line-height:1.35;margin-bottom:10px">${c.title}</h1>
  <p style="font-size:26px;color:${MUTED};line-height:1.6;margin-bottom:28px">${c.line}</p>
  <div style="flex:1;display:flex;gap:${c.imgs.length > 2 ? 18 : 22}px;margin-bottom:34px;min-height:0">
    ${c.imgs
      .map(
        (p) =>
          `<div style="flex:1;border:2px solid ${ACCENT}66;border-radius:24px;overflow:hidden;box-shadow:0 0 60px ${ACCENT}22;background:#15161A"><img src="${
            p.startsWith('D:') ? raw64(p) : img64(p)
          }" style="width:100%;height:100%;object-fit:${c.fit || 'cover'};display:block"></div>`,
      )
      .join('')}
  </div>
  ${footer}
</body></html>`;

const svcHtml = (c) => `${head}
<body style="width:1080px;height:1080px;background:radial-gradient(90% 60% at 86% 8%, ${ACCENT}14, transparent 60%), ${BG};
  font-family:'Alexandria',system-ui,sans-serif;color:#F2F3EE;display:flex;flex-direction:column;justify-content:space-between;padding:90px;position:relative;overflow:hidden">
  ${signal(170)}
  <div>
    <p style="font-size:30px;font-weight:700;color:${ACCENT};margin-bottom:30px">${c.kicker}</p>
    <h1 style="font-size:76px;font-weight:800;line-height:1.4;white-space:pre-line;margin-bottom:48px">${c.title}</h1>
    <ul style="list-style:none;padding:0;display:grid;gap:16px">
      ${c.points.map((p) => `<li style="display:flex;gap:18px;align-items:baseline;font-size:33px;line-height:1.65;color:#E8EAE3"><span style="color:${ACCENT};font-weight:800">·</span><span>${p}</span></li>`).join('')}
    </ul>
  </div>
  ${footer}
</body></html>`;

// ─── القوالب العريضة (1536×804) — النص يمين والشغل يسار ───
const workHtmlW = (c) => `${head}
<body style="width:1536px;height:804px;background:radial-gradient(70% 110% at 90% 0%, ${ACCENT}12, transparent 60%), ${BG};
  font-family:'Alexandria',system-ui,sans-serif;color:#F2F3EE;display:flex;gap:44px;padding:56px 64px;position:relative;overflow:hidden">
  ${signal(26)}
  <div style="width:430px;flex-shrink:0;display:flex;flex-direction:column">
    <span style="align-self:flex-start;font-size:21px;font-weight:700;color:${ACCENT};border:2px solid ${ACCENT}55;border-radius:999px;padding:7px 20px;margin-bottom:22px">${c.chip}</span>
    <h1 style="font-size:42px;font-weight:800;line-height:1.4;margin-bottom:12px">${c.title}</h1>
    <p style="font-size:21px;color:${MUTED};line-height:1.7">${c.line}</p>
    <div style="margin-top:auto;display:flex;align-items:center;gap:16px">
      <img src="${logo}" style="width:56px;height:56px;opacity:.95">
      <span style="font-family:'Grotesk','Alexandria',sans-serif;font-size:23px;font-weight:600;color:${MUTED};direction:ltr">ryanalali.me</span>
    </div>
  </div>
  <div style="flex:1;display:flex;gap:16px;min-width:0">
    ${c.imgs
      .map(
        (p) =>
          `<div style="flex:1;border:2px solid ${ACCENT}66;border-radius:22px;overflow:hidden;box-shadow:0 0 50px ${ACCENT}22;background:#15161A"><img src="${
            p.startsWith('D:') ? raw64(p) : img64(p)
          }" style="width:100%;height:100%;object-fit:${c.fit || 'cover'};display:block"></div>`,
      )
      .join('')}
  </div>
</body></html>`;

const svcHtmlW = (c) => `${head}
<body style="width:1536px;height:804px;background:radial-gradient(70% 110% at 90% 0%, ${ACCENT}14, transparent 60%), ${BG};
  font-family:'Alexandria',system-ui,sans-serif;color:#F2F3EE;display:flex;gap:70px;padding:78px 84px;position:relative;overflow:hidden">
  ${signal(26)}
  <div style="width:600px;flex-shrink:0;display:flex;flex-direction:column">
    <p style="font-size:26px;font-weight:700;color:${ACCENT};margin-bottom:22px">${c.kicker}</p>
    <h1 style="font-size:62px;font-weight:800;line-height:1.4;white-space:pre-line">${c.title}</h1>
    <div style="margin-top:auto;display:flex;align-items:center;gap:16px">
      <img src="${logo}" style="width:56px;height:56px;opacity:.95">
      <span style="font-family:'Grotesk','Alexandria',sans-serif;font-size:23px;font-weight:600;color:${MUTED};direction:ltr">ryanalali.me</span>
    </div>
  </div>
  <ul style="list-style:none;padding:0;margin:auto 0;display:grid;gap:22px;flex:1">
    ${c.points.map((p) => `<li style="display:flex;gap:16px;align-items:baseline;font-size:30px;line-height:1.65;color:#E8EAE3"><span style="color:${ACCENT};font-weight:800">·</span><span>${p}</span></li>`).join('')}
  </ul>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
await page.route('http://post.local/**', async (route) => {
  const path = new URL(route.request().url()).pathname;
  if (FONTS[path]) return route.fulfill({ body: readFileSync(FONTS[path]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');

const shoot = async (html, path) => {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path });
  console.log(`✅ ${path.split('/').pop()}`);
};

// العريض (للرفع بلينكدإن)
await page.setViewportSize({ width: 1536, height: 804 });
for (const c of WORK) await shoot(workHtmlW(c), `${OUT}/${c.name}.png`);
for (const c of SVC) await shoot(svcHtmlW(c), `${OUT}/${c.name}.png`);

// المربع (للبوستات لاحقاً)
await page.setViewportSize({ width: 1080, height: 1080 });
for (const c of WORK) await shoot(workHtml(c), `${OUT_SQ}/${c.name}.png`);
for (const c of SVC) await shoot(svcHtml(c), `${OUT_SQ}/${c.name}.png`);

await browser.close();
console.log('العريض:', OUT, '· المربع:', OUT_SQ);
