// ═══════════════════════════════════════════════════════════════
//  مولّد كتالوج الواتساب — صور + نصوص لكل خدمة متاحة وكل بكج
//
//  بيقرأ services.json مباشرة (فما بيغلط بالنصوص ولا بينسى خدمة)
//  وبيطلع لكل عنصر: بطاقة مربعة 1080 بهوية الموقع + ملف نصوص
//  جاهز للنسخ بخانات الكتالوج (الاسم، الوصف، الرابط).
//
//  ⚠️ خدمات «قريباً» مستثناة عن قصد — نفس قاعدة البكجات:
//     ما منبيع إشي لسا مش جاهز.
//  الاستخدام:  node _check/catalog-gen.mjs
//  المخرجات:   D:\Ryan-Work\Brand-Ryan\Social\WhatsApp\Catalog\
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';

const services = JSON.parse(readFileSync('src/data/services.json', 'utf8'));
const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/WhatsApp/Catalog';
mkdirSync(OUT, { recursive: true });

const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};
const ACCENT = '#D9FF3F';

// ─── العناصر: الخدمات المتاحة + البكجات ───
const items = [];
for (const s of services.services) {
  if (s.soon) continue;
  items.push({
    file: `svc-${s.id}`,
    eyebrow: 'خدمة',
    title: s.ar.name,
    line: s.ar.menuDesc || '',
    url: `ryanalali.me/ar/services/${s.slug}`,
    descForCatalog: (s.ar.seoDesc || s.ar.menuDesc || '').slice(0, 280),
  });
}
for (const pk of services.packages.ar.items) {
  items.push({
    file: `pack-${pk.id}`,
    eyebrow: 'بكج',
    title: pk.name,
    line: pk.who,
    url: 'ryanalali.me/ar/services',
    descForCatalog: `${pk.who}. ${pk.line}`.slice(0, 280),
  });
}

// ─── البطاقة ───
const card = (it) => `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
</style></head>
<body style="width:1080px;height:1080px;background:
    radial-gradient(80% 55% at 85% 0%, ${ACCENT}18, transparent 58%),#0E0F12;
    font-family:'Alexandria',system-ui,sans-serif;color:#F2F3EE;position:relative;
    display:flex;flex-direction:column;justify-content:space-between;padding:84px">
  <div>
    <p style="font-size:30px;font-weight:700;color:${ACCENT};margin-bottom:30px">${it.eyebrow}</p>
    <h1 style="font-size:${it.title.length > 16 ? 74 : 88}px;font-weight:800;line-height:1.35;margin-bottom:34px">${it.title}</h1>
    <p style="font-size:36px;line-height:1.75;color:#C9CCC2;max-width:24ch">${it.line}</p>
  </div>
  <div style="display:flex;align-items:center;justify-content:space-between">
    <span style="font-family:'Grotesk','Alexandria',sans-serif;font-size:28px;font-weight:600;color:${ACCENT};direction:ltr">${it.url}</span>
    <img src="${logo}" style="width:88px;height:88px;opacity:.95">
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
await page.route('http://cat.local/**', async (route) => {
  const path = new URL(route.request().url()).pathname;
  if (FONTS[path]) return route.fulfill({ body: readFileSync(FONTS[path]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});

const lines = ['═══ نصوص كتالوج الواتساب — انسخ لكل عنصر ═══', ''];
for (const it of items) {
  await page.goto('http://cat.local/');
  await page.setContent(card(it), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${it.file}.png` });
  console.log('✅', it.file);
  lines.push(
    `▣ ${it.title} (${it.file}.png)`,
    `الاسم: ${it.title}`,
    `الوصف: ${it.descForCatalog}`,
    `الرابط: https://${it.url}/`,
    `السعر: اتركه فاضي (السعر من التشخيص)`,
    '',
  );
}
writeFileSync(`${OUT}/كتالوج-النصوص.txt`, lines.join('\n'), 'utf8');
await browser.close();
console.log(`\n${items.length} عنصر + كتالوج-النصوص.txt ← ${OUT}`);
