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

const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/LinkedIn/ServicePage';
mkdirSync(OUT, { recursive: true });

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
const WORK = [
  { name: '1-work-luvit', img: 'luvit/coverFinal-01.webp', chip: 'براند متكامل من الصفر', title: 'LUV IT — العناية بالبشرة', line: 'هوية، تغليف، محتوى، وموقع إلكتروني' },
  { name: '2-work-orient', img: 'orient-enam/orient-enam-01.webp', chip: 'هوية بصرية', title: 'Orient ENAM', line: 'شعار ونظام هوية كامل' },
  {
    name: '3-work-ads',
    duo: ['D:/Ryan-Personal/Misc/abd/WhatsApp Image 2024-09-30 at 12.43.12 AM.jpeg', 'D:/Ryan-Personal/Misc/DESIGN.jpg'],
    chip: 'إعلانات سوشال',
    title: 'إعلانات بتوقّف السكرول',
    line: 'مفاهيم إبداعية لعملاء بمجالات مختلفة',
  },
  { name: '4-work-drsamir', img: 'dr-samir/dr-samir-01.webp', chip: 'محتوى طبي', title: 'عيادات وأطباء', line: 'محتوى بيبني ثقة المريض قبل ما يوصل العيادة' },
  { name: '5-work-mofakron', img: 'al-mofakron/al-mofakron-01.webp', chip: 'تصاميم سوشال', title: 'المفكرون للألمنيوم', line: 'حضور بصري ثابت ومتسق بالسوق' },
];

// ─── ٤ كروت خدمات ───
const SVC = [
  { name: '6-svc-diagnosis', kicker: 'أول خطوة بأي شغل', title: 'ما ببيع بوستات.\nبشخّص، وبعدها منبني.', points: ['تشخيص للوضع قبل أي التزام', 'نطاق مكتوب بسعر ثابت', 'قرارات بالأرقام مش بالإحساس'] },
  { name: '7-svc-websites', kicker: 'مواقع إلكترونية', title: 'موقع بيبيع،\nمش بس بيبيّن حلو', points: ['رحلة زبون مدروسة من الإعلان للطلب', 'سرعة وسيو من اليوم الأول', 'بيشتغل ٢٤/٧ — حتى وإنت نايم'] },
  { name: '8-svc-ads', kicker: 'إعلانات ممولة', title: 'ميزانية على قرارات،\nمش على تخمين', points: ['استهداف مبني على فهم زبونك', 'قياس لكل دينار وين راح', 'تقارير بتفهمها — مش أرقام استعراض'] },
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
  ${
    c.duo
      ? `<div style="flex:1;display:flex;gap:22px;margin-bottom:34px;min-height:0">
          ${c.duo.map((p) => `<div style="flex:1;border:2px solid ${ACCENT}66;border-radius:24px;overflow:hidden;box-shadow:0 0 60px ${ACCENT}22"><img src="${raw64(p)}" style="width:100%;height:100%;object-fit:cover;display:block"></div>`).join('')}
        </div>`
      : `<div style="flex:1;border:2px solid ${ACCENT}66;border-radius:24px;overflow:hidden;box-shadow:0 0 60px ${ACCENT}22;margin-bottom:34px">
          <img src="${img64(c.img)}" style="width:100%;height:100%;object-fit:cover;display:block">
        </div>`
  }
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

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
await page.route('http://post.local/**', async (route) => {
  const path = new URL(route.request().url()).pathname;
  if (FONTS[path]) return route.fulfill({ body: readFileSync(FONTS[path]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');

for (const c of WORK) {
  await page.setContent(workHtml(c), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${c.name}.png` });
  console.log(`✅ ${c.name}.png`);
}
for (const c of SVC) {
  await page.setContent(svcHtml(c), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${c.name}.png` });
  console.log(`✅ ${c.name}.png`);
}
await browser.close();
console.log('المخرجات:', OUT);
