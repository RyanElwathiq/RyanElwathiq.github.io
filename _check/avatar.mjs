// مولّد صورة البروفايل (واتساب/فيسبوك/إنستا) من اللوجو — بلا أي توليد مدفوع
//   node _check/avatar.mjs
//  ٣ نسخ 1024×1024 بتطلع على D:\Ryan-Work\Brand-Ryan\avatars\
//  اللوجو بينحط بالكود حرفياً (بلا تشويه) على خلفيات الهوية.
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/avatars';
mkdirSync(OUT, { recursive: true });

// اللوجو بيدخل الصفحة كـ data URI — بلا سيرفر ولا شبكة
const logoWhite = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const logoBlack = 'data:image/png;base64,' + readFileSync('public/assets/logo-black.png').toString('base64');

// 🎛️ النسخ الثلاث — عدّل الأحجام والتوهج من هون
const VARIANTS = [
  {
    name: 'avatar-dark-glow', // غامق + توهج ليموني خفيف ورا اللوجو (المرشح الأساسي)
    html: `<div style="width:1024px;height:1024px;background:
        radial-gradient(58% 58% at 50% 46%, rgba(217,255,63,.16), transparent 70%),
        #0E0F12;display:grid;place-items:center">
      <img src="${logoWhite}" style="width:560px;height:560px;filter:drop-shadow(0 0 46px rgba(217,255,63,.35))">
    </div>`,
  },
  {
    name: 'avatar-lime', // ليموني صريح + لوجو أسود — أعلى وضوح بحجم دائرة الواتساب الصغير
    html: `<div style="width:1024px;height:1024px;background:
        radial-gradient(70% 70% at 50% 38%, #E4FF66, #D9FF3F 60%, #C2E82F);
        display:grid;place-items:center">
      <img src="${logoBlack}" style="width:600px;height:600px">
    </div>`,
  },
  {
    name: 'avatar-dark-ring', // غامق + حلقة ليمونية بتأطر اللوجو
    html: `<div style="width:1024px;height:1024px;background:#0E0F12;display:grid;place-items:center">
      <div style="width:720px;height:720px;border:10px solid #D9FF3F;border-radius:50%;
          display:grid;place-items:center;box-shadow:0 0 90px rgba(217,255,63,.22), inset 0 0 60px rgba(217,255,63,.07)">
        <img src="${logoWhite}" style="width:460px;height:460px">
      </div>
    </div>`,
  },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
for (const v of VARIANTS) {
  await page.setContent(`<body style="margin:0">${v.html}</body>`);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${v.name}.png` });
  console.log('✅', v.name);
}
await browser.close();
console.log('المخرجات:', OUT);
