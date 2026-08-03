// كفر واتساب بزنس — مصمم بالكود (بلا توليد) بجودة مضاعفة
//   node _check/wa-cover.mjs
//  المقاس: 1211×681 (مواصفة واتساب) مرسوم بدقة ×2 = 2422×1362
//  ⚠️ صورة البروفايل الدائرية بتركب أسفل-نص الكفر — فالمحتوى
//     المهم كله فوق وعالأطراف، والنص-الأسفل متروك فاضي عمداً.
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/avatars';
mkdirSync(OUT, { recursive: true });

const W = 1211;
const H = 681;
const icon = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const ACCENT = '#D9FF3F';

const html = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
</style></head>
<body style="width:${W}px;height:${H}px;background:
    radial-gradient(75% 90% at 85% 0%, ${ACCENT}1c, transparent 55%),
    radial-gradient(60% 80% at 8% 100%, ${ACCENT}10, transparent 60%),
    #0E0F12;
    font-family:'Alexandria',system-ui,sans-serif;color:#F2F3EE;
    position:relative;overflow:hidden">

  <!-- خيط الإشارة: خافت بالخلفية عبر الحزام الأوسط -->
  <svg viewBox="0 0 1211 120" style="position:absolute;top:280px;left:0;width:100%;height:120px;opacity:.35">
    <path d="M0,60 L40,58 L55,75 L70,30 L85,80 L100,45 L115,68 L130,38 L150,72 L170,50 L195,64
             Q280,20 420,60 T720,60 T1020,60 T1211,60"
          fill="none" stroke="${ACCENT}" stroke-width="3.5"
          style="filter:drop-shadow(0 0 10px ${ACCENT}66)"/>
  </svg>

  <!-- ⚠️ كل المحتوى بالحزام الأوسط: واتساب بيقص فوق وتحت حسب
       الشاشة، ودائرة البروفايل بتغطي أسفل-النص — فالوسط هو الآمن -->
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;
      padding-inline:84px;gap:40px">

    <!-- الجهة اليمين (بداية RTL): الأيقونة + الاسم مكتوب حاد -->
    <div style="display:flex;align-items:center;gap:28px">
      <img src="${icon}" style="width:150px;height:150px;filter:drop-shadow(0 0 26px ${ACCENT}44)">
      <div>
        <p style="font-size:46px;font-weight:800;line-height:1.3">ريّان الواثق</p>
        <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:22px;font-weight:600;
            color:${ACCENT};letter-spacing:.14em;direction:ltr;margin-top:6px">RAYAN ELWATHIQ</p>
      </div>
    </div>

    <!-- الجهة الشمال: التموضع + الرابط -->
    <div style="text-align:start;max-width:30ch">
      <p style="font-size:29px;font-weight:800;line-height:1.65;margin-bottom:14px">
        تشخيص قبل التنفيذ.<br>وقرارات بالأرقام، مش بالإحساس.
      </p>
      <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:25px;font-weight:600;
          color:${ACCENT};direction:ltr">ryanalali.me</p>
    </div>
  </div>
</body></html>`;

const browser = await chromium.launch();
// deviceScaleFactor: 2 → البكسلات مضاعفة، الكفر ما ببكسل عالشاشات الحديثة
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
await page.route('http://cover.local/**', async (route) => {
  const path = new URL(route.request().url()).pathname;
  if (FONTS[path]) return route.fulfill({ body: readFileSync(FONTS[path]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://cover.local/');
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: `${OUT}/wa-cover.png` });
await browser.close();
console.log('✅ wa-cover.png (2422×1362 فعلياً)');
