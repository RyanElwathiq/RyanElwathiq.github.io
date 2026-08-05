// غلاف الريل العمودي (إنستغرام الحساب الشخصي) — 1080×1920
// فريم المدينة من الفيلم + الهوية: لوجو، سؤال الهوك، الدومين.
// ⚠️ شبكة البروفايل بتقص الغلاف — العناصر المهمة بالمربع الوسطاني.
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const SCRATCH =
  'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/Instagram/reel-cover.png';

const city = 'data:image/jpeg;base64,' + readFileSync(`${SCRATCH}/city-frame-v.jpg`).toString('base64');
const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const ACCENT = '#D9FF3F';
const BG = '#0E0F12';

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const html = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
</style></head>
<body style="width:1080px;height:1920px;position:relative;overflow:hidden;background:${BG};font-family:'Alexandria',sans-serif">
  <img src="${city}" style="width:100%;height:100%;object-fit:cover;display:block">
  <!-- تعتيم للقراءة: خفيف فوق، أقوى بالوسط والتحت -->
  <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,15,18,.35) 0%,rgba(14,15,18,.15) 25%,rgba(14,15,18,.55) 55%,rgba(14,15,18,.82) 100%)"></div>
  <!-- وهج الهوية -->
  <div style="position:absolute;inset:0;background:radial-gradient(70% 30% at 85% 4%, ${ACCENT}12, transparent 60%)"></div>

  <!-- اللوجو فوق -->
  <img src="${logo}" style="position:absolute;top:130px;left:50%;transform:translateX(-50%);width:130px;height:130px;
       filter:drop-shadow(0 0 30px ${ACCENT}44)">

  <!-- المنطقة الآمنة (المربع الوسطاني): الهوك + الشارة -->
  <div style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;padding:0 60px">
    <h1 style="font-size:96px;font-weight:800;color:#F2F3EE;line-height:1.25;text-shadow:0 6px 50px rgba(0,0,0,.95)">مشروعك بيعلن…</h1>
    <h2 style="font-size:72px;font-weight:800;color:${ACCENT};margin-top:14px;text-shadow:0 6px 50px rgba(0,0,0,.95)">وما حدا بيشتري؟</h2>
    <div style="display:inline-block;margin-top:56px;font-size:34px;font-weight:700;color:#F2F3EE;
         background:rgba(14,15,18,.75);border:1.5px solid ${ACCENT}66;border-radius:999px;padding:14px 42px">
      الفيلم التعريفي · ٨٥ ثانية</div>
  </div>

  <!-- الدومين تحت -->
  <p style="position:absolute;bottom:120px;left:0;width:100%;text-align:center;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:46px;font-weight:600;color:#F2F3EE;direction:ltr;
     text-shadow:0 4px 30px rgba(0,0,0,.9)">ryanalali<span style="color:${ACCENT}">.me</span></p>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: OUT });
await browser.close();
console.log('✅', OUT);
