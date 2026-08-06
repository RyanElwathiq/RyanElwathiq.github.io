// ═══════════════════════════════════════════════════════════════
//  «خيط الضوء» — نموذجان تجريبيان لسلسلة تصاميم السوشال
//
//  الفكرة: خيط ضوء ليموني واحد مرسوم بالكود بيمشي بالتصميم،
//  وجملة من فلسفة ريّان (مأخوذة حرفياً من صفحات الخدمات)،
//  وتشكيل على الكلمة المفتاح لحالها، وتوقيع ثابت.
//
//  نموذج أ — «الخيط الواصل»: الخيط بيمشي من زاوية الفراغ وبينتهي
//            بعقدة مضيّة هي **نقطة نهاية الجملة** حرفياً.
//            (موقع العقدة بينقاس بالكود بعد ما يتركّب النص،
//             عشان ما تلزق بالحروف ولا تنط فوقها)
//  نموذج ب — «الخيط المقطوع»: الخيط ماشي أفقي وبينقطع، والفراغ
//            نفسه هو الرسالة، والجملة مقسومة على طرفَي القطع.
//
//  تشغيل:  node _check/threadsamples.mjs
//  الناتج: D:/Ryan-Work/Brand-Ryan/Social/_Generated/
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/_Generated';
mkdirSync(OUT, { recursive: true });

const ACCENT = '#D9FF3F';
const BG = '#0E0F12';
const INK = '#F2F3EE';
const MUTED = '#8A8E85';

const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

// الأساس المشترك: خطوط + حبيبات ورق + ظل طرفي + توقيع
const base = `
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900;font-display:block}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF;font-display:block}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700;font-display:block}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1080px;background:${BG};position:relative;overflow:hidden;
       font-family:'Alexandria',sans-serif;color:${INK};-webkit-font-smoothing:antialiased}
  /* حبيبات: بتشيل الإحساس الرقمي المسطّح وبتعطي ملمس مطبوع */
  .grain{position:absolute;inset:-20%;opacity:.05;pointer-events:none;mix-blend-mode:overlay}
  .vig{position:absolute;inset:0;background:radial-gradient(125% 95% at 50% 42%, transparent 45%, #000000BB 100%);
       pointer-events:none}
  .sig{position:absolute;bottom:54px;left:64px;right:64px;display:flex;align-items:center;
       justify-content:space-between;direction:ltr;z-index:5}
  .sig img{width:44px;height:44px;opacity:.9}
  .sig span{font-family:'Grotesk','Alexandria',sans-serif;font-size:22px;font-weight:600;
            color:${MUTED};letter-spacing:.02em}
  .kw{color:${ACCENT}}
  /* نقطة نهاية الجملة: مخفية، بس مكانها هو اللي بيحدد وين تنتهي العقدة */
  .anchor{display:inline-block;width:1px;height:1px;vertical-align:baseline}
  svg.art{position:absolute;inset:0;width:100%;height:100%;z-index:1}
  .txt{position:absolute;z-index:3}
`;

const grainSvg = `<svg class="grain" xmlns="http://www.w3.org/2000/svg">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/></filter>
  <rect width="100%" height="100%" filter="url(#n)"/></svg>`;

const sig = `<div class="sig"><img src="${logo}"><span>ryanalali<b style="color:${ACCENT};font-weight:600">.me</b></span></div>`;

const glowDefs = (id) => `<filter id="${id}" x="-70%" y="-70%" width="240%" height="240%">
  <feGaussianBlur stdDeviation="10" result="b"/><feMerge>
  <feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

// ─────────────────────────────────────────────────────────────
// نموذج أ — «الخيط الواصل»
// جملة سطرين، والخيط بيطلع من زاوية الفراغ تحت وبينتهي بعقدة
// هي نقطة الجملة. موقع العقدة بينقاس بعد التركيب مش بالتخمين.
// ─────────────────────────────────────────────────────────────
const sampleA = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${base}
  .txt{top:250px;right:88px;width:800px;text-align:right}
  .eyebrow{font-size:20px;font-weight:500;color:${MUTED};letter-spacing:.08em;margin-bottom:38px}
  h1{font-size:76px;font-weight:800;line-height:1.55;letter-spacing:-.012em;padding-bottom:16px}
</style></head><body>
  <div style="position:absolute;inset:0;background:radial-gradient(72% 55% at 86% 14%, ${ACCENT}12, transparent 62%)"></div>

  <svg class="art" viewBox="0 0 1080 1080">
    <defs>
      <linearGradient id="thread" gradientUnits="userSpaceOnUse" x1="0" y1="1080" x2="900" y2="380">
        <stop offset="0%"   stop-color="${ACCENT}" stop-opacity=".08"/>
        <stop offset="25%"  stop-color="${ACCENT}" stop-opacity=".42"/>
        <stop offset="65%"  stop-color="${ACCENT}" stop-opacity=".82"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity="1"/>
      </linearGradient>
      ${glowDefs('glow')}
    </defs>
    <path id="p" fill="none" stroke="url(#thread)" stroke-width="2.6" stroke-linecap="round" filter="url(#glow)"/>
    <circle id="c1" r="6.5" fill="${ACCENT}" filter="url(#glow)"/>
    <circle id="c2" r="18"  fill="none" stroke="${ACCENT}" stroke-width="1.3" opacity=".4"/>
    <circle id="c3" r="36"  fill="none" stroke="${ACCENT}" stroke-width="1"   opacity=".14"/>
  </svg>

  <div class="txt">
    <p class="eyebrow">إدارة السوشال ميديا</p>
    <h1>النشر بلا <span class="kw">خُطَّة</span><br><span id="lastline">مش استراتيجية</span></h1>
  </div>

  <div class="vig"></div>${grainSvg}${sig}
  <script>
    // ⚠️ لازم ننتظر تحميل الخط العربي قبل القياس — لو قسنا وهو لسا
    //    على الخط الاحتياطي بيطلع السطر أضيق والعقدة بتوقع جوّا الكلمة.
    document.fonts.ready.then(() => {
      // العقدة = نقطة الجملة. بنقيس السطر الأخير بعنصر ملفوف حواليه
      // (مش بعنصر فاضي، لأن ترتيب العربي ثنائي الاتجاه بيرجّع
      //  إحداثيات مضلّلة للعناصر الفاضية).
      const r = document.getElementById('lastline').getBoundingClientRect();
      const x = Math.round(r.left) - 36;   // بالعربي نهاية الجملة عاليسار
      const y = Math.round(r.bottom) - 34;
      for (const id of ['c1','c2','c3']) {
        const c = document.getElementById(id);
        c.setAttribute('cx', x); c.setAttribute('cy', y);
      }
      // قوس واحد هادي من زاوية تحت-يسار لحد العقدة، بلا كسرات ولا التفاف
      document.getElementById('p').setAttribute('d',
        \`M -60 1000 C 140 880, 205 655, \${x} \${y}\`);
    });
  </script>
</body></html>`;

// ─────────────────────────────────────────────────────────────
// نموذج ب — «الخيط المقطوع»
// الخيط ماشي أفقي بعرض التصميم كله وبينقطع بفراغ واسع بالنص.
// الجملة مقسومة على طرفَي القطع: الطرف الأول المشكلة، والثاني الحل.
// ─────────────────────────────────────────────────────────────
const sampleB = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${base}
  .top{top:196px;right:92px;left:92px;text-align:right}
  .bot{top:642px;right:92px;left:92px;text-align:right}
  h1{font-size:70px;font-weight:800;line-height:1.5;letter-spacing:-.012em;padding-bottom:12px}
  .eyebrow{font-size:20px;font-weight:500;color:${MUTED};letter-spacing:.08em;margin-bottom:32px}
  .lead{font-size:23px;font-weight:500;color:${MUTED};margin-top:30px;line-height:1.85;
        max-width:520px;margin-right:0;margin-left:auto;text-align:right}
</style></head><body>
  <div style="position:absolute;inset:0;background:radial-gradient(90% 40% at 50% 50%, ${ACCENT}0D, transparent 68%)"></div>

  <svg class="art" viewBox="0 0 1080 1080">
    <defs>
      <!-- الطرف اليمين: صلب من الحافة وبيخف لما يقرب من القطع -->
      <linearGradient id="tR" gradientUnits="userSpaceOnUse" x1="1080" y1="0" x2="700" y2="0">
        <stop offset="0%"   stop-color="${ACCENT}" stop-opacity=".95"/>
        <stop offset="70%"  stop-color="${ACCENT}" stop-opacity=".9"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity=".85"/>
      </linearGradient>
      <!-- الطرف اليسار: أضعف، لأنه هو الجزء اللي ما وصل -->
      <linearGradient id="tL" gradientUnits="userSpaceOnUse" x1="380" y1="0" x2="0" y2="0">
        <stop offset="0%"   stop-color="${ACCENT}" stop-opacity=".55"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity=".2"/>
      </linearGradient>
      <!-- ⚠️ الخط الأفقي إطاره صفر ارتفاع، فالفلتر بالنِسَب بيلغيه كلياً.
           لهيك منطقة الفلتر هون محدّدة بإحداثيات صريحة مش بنسبة. -->
      <filter id="g2" filterUnits="userSpaceOnUse" x="-60" y="400" width="1200" height="224">
        <feGaussianBlur stdDeviation="9" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- الطرف الجاي من اليمين (المشكلة) -->
    <path d="M 1080 512 L 700 512" fill="none" stroke="url(#tR)" stroke-width="3"
          stroke-linecap="round" filter="url(#g2)"/>
    <circle cx="700" cy="512" r="6" fill="${ACCENT}" filter="url(#g2)"/>

    <!-- القطع: ٣٢٠px فراغ، وفيه أثر منقّط باهت لوين كان لازم يوصل -->
    <path d="M 690 512 L 390 512" fill="none" stroke="${ACCENT}" stroke-width="1.6"
          stroke-dasharray="1.5 22" stroke-linecap="round" opacity=".28"/>

    <!-- الطرف اللي ما وصل (الحل) -->
    <path d="M 380 512 L 0 512" fill="none" stroke="url(#tL)" stroke-width="3"
          stroke-linecap="round" filter="url(#g2)"/>
    <circle cx="380" cy="512" r="4.5" fill="${ACCENT}" opacity=".55" filter="url(#g2)"/>
  </svg>

  <div class="txt top">
    <p class="eyebrow">استشارة وتدريب</p>
    <h1>أحياناً مش<br>ناقصك موظّف.</h1>
  </div>

  <div class="txt bot">
    <h1>ناقصك حدا <span class="kw">يِفَهّمَك</span>.</h1>
    <p class="lead">تدريب على حسابك انت، مش على أمثلة نظرية.</p>
  </div>

  <div class="vig"></div>${grainSvg}${sig}
</body></html>`;

const SAMPLES = [
  ['thread-sample-a', sampleA],
  ['thread-sample-b', sampleB],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');
for (const [name, html] of SAMPLES) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  await page.screenshot({ path: `${OUT}/${name}.png`, type: 'png' });
  console.log('✅', `${OUT}/${name}.png`);
}
await browser.close();
