// ثمبنيل الفيديو للينكدإن — البوستر السينمائي + زر تشغيل + لوجو
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/LinkedIn/promo-thumb.png';
const poster = 'data:image/jpeg;base64,' + readFileSync('public/assets/promo/promo-poster.jpg').toString('base64');
const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const ACCENT = '#D9FF3F';

const html = `<!doctype html><html><head><meta charset="utf-8"><style>*{margin:0}</style></head>
<body style="width:1920px;height:1080px;position:relative;overflow:hidden">
  <img src="${poster}" style="width:100%;height:100%;object-fit:cover;display:block">
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,15,18,.05),rgba(14,15,18,.3))"></div>
  <!-- زر التشغيل -->
  <div style="position:absolute;left:50%;top:63%;transform:translate(-50%,-50%);width:150px;height:150px;
       border-radius:50%;background:${ACCENT};display:grid;place-items:center;
       box-shadow:0 0 0 18px ${ACCENT}33, 0 0 80px ${ACCENT}66">
    <svg width="56" height="56" viewBox="0 0 24 24" fill="#0E0F12"><path d="M8 5v14l11-7z"/></svg>
  </div>
  <!-- اللوجو والمدة -->
  <img src="${logo}" style="position:absolute;top:36px;left:44px;width:92px;height:92px;opacity:.95">
  <span style="position:absolute;bottom:32px;right:40px;font-family:system-ui;font-size:30px;font-weight:700;
        color:#F2F3EE;background:rgba(14,15,18,.75);border:1px solid ${ACCENT}55;border-radius:999px;padding:8px 26px">1:25</span>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.waitForTimeout(200);
await page.screenshot({ path: OUT });
await browser.close();
console.log('✅', OUT);
