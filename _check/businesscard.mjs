// ═══════════════════════════════════════════════════════════════
//  كرت الأعمال — «الخيط اللي بيكمل عالوجه التاني» (2026-08-08)
//
//  الفكرة: خيط ليموني بيدخل من حافة الوجه الأمامي وبيطلع من
//  الحافة المقابلة. ولما تقلب الكرت يميناً (الطريقة الطبيعية)،
//  الحافة اليمين للأمامي بتصير الحافة الشمال للخلفي — فالخيط
//  بيكمل من نفس الارتفاع بالضبط وبينحل لبياناته.
//  الكرت نفسه جزء من الفكرة، مش سطح للرسمة.
//
//  ⚠️ مقاسات الطباعة مش تقريبية:
//     · القص 85×55 مم (المقاس السائد بالأردن والمنطقة)
//     · نزيف 3 مم من كل جهة → 91×61 مم
//     · منطقة آمنة 4 مم جوّا القص — ولا نص بيقرب أكثر
//     · 300 DPI → 1075×721 بكسل
//
//  ⚠️ المخرج RGB مش CMYK. Playwright ما بيطلّع CMYK، والمطبعة
//     بتحوّل. والليموني #D9FF3F لون RGB ساطع **رح يبهت شوي**
//     بالتحويل — لازم ريّان يطلب بروفة مطبوعة قبل الكمية.
//
//  التشغيل: node _check/businesscard.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync, mkdirSync } from 'fs';
import { chromium } from '@playwright/test';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Business-Card';
mkdirSync(OUT, { recursive: true });

const DPI = 300;
const MM = DPI / 25.4;                 // بكسل لكل مليمتر
const px = (mm) => Math.round(mm * MM);
const W = px(91), H = px(61);          // مع النزيف
const BLEED = px(3);                   // حافة النزيف
const SAFE = BLEED + px(4);            // بداية المنطقة الآمنة

const INK = '#0E0F12';
const PAPER = '#F2F3EE';
const LIME = '#D9FF3F';
const MUTED_D = '#8E938A';             // على غامق
const MUTED_L = '#6B6F66';             // على فاتح

const logoW = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const logoB = 'data:image/png;base64,' + readFileSync('public/assets/logo-black.png').toString('base64');

const FONTS = {
  '/__f/ar.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/lat.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/gro.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

// ─── نقطة العبور: نفس الارتفاع بالوجهين ───
const CROSS = 0.62;                    // ٦٢٪ من الارتفاع
const cy = H * CROSS;

// الخيط الأمامي: بيدخل شمال منخفض، بيرتفع، وبيطلع يمين عند cy
const threadFront = () => {
  const y0 = H * 0.80;
  return `M -10,${y0} C ${W * 0.26},${y0} ${W * 0.30},${H * 0.50} ${W * 0.56},${H * 0.55} S ${W * 0.86},${cy} ${W + 10},${cy}`;
};
// الخيط الخلفي: بيدخل شمال عند cy وبينتهي **عند الإيميل نفسه**.
// النقطة مش زينة — هي نقطة الإيميل. الخيط بيقول: تابعني، هون بتلاقيني.
const DOT_X = W * 0.235, DOT_Y = H * 0.395;
const threadBack = () =>
  `M -10,${cy} C ${W * 0.06},${cy} ${W * 0.10},${H * 0.47} ${DOT_X},${DOT_Y}`;

const head = (bg, fam) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Alexandria';src:url('/__f/ar.woff2') format('woff2');font-weight:100 900}
@font-face{font-family:'Alexandria';src:url('/__f/lat.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
@font-face{font-family:'Grotesk';src:url('/__f/gro.woff2') format('woff2');font-weight:300 800}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:${bg};position:relative;overflow:hidden;
     font-family:'${fam}','Alexandria',sans-serif;-webkit-font-smoothing:antialiased}
svg.th{position:absolute;inset:0;width:${W}px;height:${H}px;overflow:visible}
</style></head><body>`;

// ═══ الوجه الأمامي ═══
const front = `${head(INK, 'Grotesk')}
<div style="position:absolute;inset:0;background:
  radial-gradient(46% 62% at 86% ${CROSS * 100}%, ${LIME}1C, transparent 62%),
  radial-gradient(70% 50% at 30% 120%, #00000099, transparent 70%)"></div>

<svg class="th" viewBox="0 0 ${W} ${H}">
  <path d="${threadFront()}" fill="none" stroke="${LIME}" stroke-width="${px(0.5)}"
        stroke-linecap="round" opacity=".22" filter="blur(${px(0.8)}px)"/>
  <path d="${threadFront()}" fill="none" stroke="${LIME}" stroke-width="${px(0.42)}" stroke-linecap="round"/>
</svg>

<img src="${logoW}" style="position:absolute;left:${SAFE}px;top:${SAFE}px;width:${px(9)}px;height:${px(9)}px;opacity:.96">

<div style="position:absolute;left:${SAFE}px;top:${H * 0.335}px">
  <div style="font-size:${px(6.4)}px;font-weight:800;color:#F7F8F4;letter-spacing:${px(-0.09)}px;line-height:1">Rayan Elwathiq</div>
  <div style="font-size:${px(2.5)}px;font-weight:600;color:${MUTED_D};letter-spacing:${px(0.16)}px;
       margin-top:${px(2.4)}px;text-transform:uppercase">Marketer &nbsp;&middot;&nbsp; Digital experience designer</div>
</div>

<div style="position:absolute;right:${SAFE}px;bottom:${SAFE}px;font-family:'Grotesk';
     font-size:${px(2.9)}px;font-weight:700;color:${MUTED_D};letter-spacing:${px(0.05)}px">
  ryanalali<span style="color:${LIME}">.me</span></div>
</body></html>`;

// ═══ الوجه الخلفي ═══
const rows = [
  ['ryan@ryanalali.me', 'Grotesk'],
  ['ryanalali.me', 'Grotesk'],
  ['linkedin.com/in/rayan-elwathiq', 'Grotesk'],
];
const back = `${head(PAPER, 'Grotesk')}
<div style="position:absolute;inset:0;background:radial-gradient(44% 58% at 16% ${CROSS * 100}%, ${LIME}22, transparent 64%)"></div>

<svg class="th" viewBox="0 0 ${W} ${H}">
  <path d="${threadBack()}" fill="none" stroke="${LIME}" stroke-width="${px(0.42)}" stroke-linecap="round"/>
  <circle cx="${DOT_X}" cy="${DOT_Y}" r="${px(1.5)}" fill="${LIME}"/>
</svg>

<div style="position:absolute;left:${DOT_X + px(3.6)}px;top:${DOT_Y - px(2.9)}px">
  ${rows.map(([t], i) => `<div style="font-size:${px(3.35)}px;font-weight:${i === 0 ? 700 : 500};
      color:${i === 0 ? INK : '#3D4139'};letter-spacing:${px(0.01)}px;line-height:${px(5.8)}px">${t}</div>`).join('')}
</div>

<img src="${logoB}" style="position:absolute;right:${SAFE}px;top:${SAFE}px;width:${px(8)}px;height:${px(8)}px;opacity:.9">

<div style="position:absolute;right:${SAFE}px;bottom:${SAFE}px;font-family:'Alexandria';
     font-size:${px(2.75)}px;font-weight:600;color:${MUTED_L};direction:rtl;text-align:right">
  تسويق يبني، ونتائج بتنقاس بالأرقام.</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.route('http://card.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://card.local/');

for (const [name, html] of [['وجه-أمامي', front], ['وجه-خلفي', back]]) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(260);
  await page.screenshot({ path: `${OUT}/${name}.png`, clip: { x: 0, y: 0, width: W, height: H } });
  console.log('✅', name, `${W}×${H}px · 91×61مم مع النزيف`);
}
await browser.close();

// ═══════════════════════════════════════════════════════════════
//  معاينة: (١) الوجهان كما بينطبعوا (٢) برهان استمرار الخيط
//  عند القلب (٣) نسخة عليها خطوط القص والمنطقة الآمنة للمطبعة
// ═══════════════════════════════════════════════════════════════
import { readFileSync as rf } from 'fs';
const b64 = (p) => 'data:image/png;base64,' + rf(p).toString('base64');
const F = b64(`${OUT}/وجه-أمامي.png`), B = b64(`${OUT}/وجه-خلفي.png`);
const S = 0.62; // تصغير للمعاينة

const prev = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#fff;font-family:'Segoe UI',Arial,sans-serif;padding:40px 44px;width:${Math.round(W * S * 2 + 180)}px}
.lbl{font-size:12px;letter-spacing:1.6px;font-weight:700;color:#9AA093;text-transform:uppercase;margin:0 0 14px}
.note{font-size:13px;color:#6B6F66;margin:10px 0 0;line-height:1.6}
.card{width:${W * S}px;height:${H * S}px;display:block;border-radius:9px;box-shadow:0 6px 22px #0000001f}
.row{display:flex;gap:26px;align-items:flex-start}
.sec{margin-bottom:46px}
.flip{display:flex;gap:0}
.flip img{border-radius:0}
.flip img:first-child{border-radius:9px 0 0 9px}
.flip img:last-child{border-radius:0 9px 9px 0}
.seam{width:2px;background:repeating-linear-gradient(#D9D9D9 0 6px,transparent 6px 12px)}
</style></head><body>

<div class="sec">
  <p class="lbl">الوجهان كما بينطبعوا</p>
  <div class="row"><img class="card" src="${F}"><img class="card" src="${B}"></div>
</div>

<div class="sec">
  <p class="lbl">وهاي الفكرة: الخيط بيكمل لما تقلبه</p>
  <div class="flip"><img class="card" src="${F}"><div class="seam"></div><img class="card" src="${B}"></div>
  <p class="note">حافة اليمين للوجه الأمامي بتصير حافة الشمال للخلفي لما تقلب الكرت.
  والخيط بيخرج ويدخل من <b>نفس الارتفاع بالضبط (٦٢٪)</b>، فبيكمل بلا قطع &mdash; وبينتهي عند إيميلك.</p>
</div>

</body></html>`;

const b2 = await chromium.launch();
const p2 = await b2.newPage({ viewport: { width: Math.round(W * S * 2 + 180), height: 900 }, deviceScaleFactor: 2 });
await p2.setContent(prev, { waitUntil: 'networkidle' });
await p2.waitForTimeout(300);
await p2.screenshot({ path: `${OUT}/معاينة.png`, fullPage: true });

// نسخة المطبعة: خطوط القص والمنطقة الآمنة
for (const [name, src] of [['وجه-أمامي', F], ['وجه-خلفي', B]]) {
  await p2.setViewportSize({ width: W, height: H });
  await p2.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0}body{width:${W}px;height:${H}px;position:relative}
  img{position:absolute;inset:0;width:${W}px;height:${H}px}
  .g{position:absolute;pointer-events:none}
  .trim{left:${BLEED}px;top:${BLEED}px;width:${W - BLEED * 2}px;height:${H - BLEED * 2}px;outline:2px dashed #FF3B7F}
  .safe{left:${SAFE}px;top:${SAFE}px;width:${W - SAFE * 2}px;height:${H - SAFE * 2}px;outline:2px dashed #24C3FF}
  </style></head><body><img src="${src}"><div class="g trim"></div><div class="g safe"></div></body></html>`,
    { waitUntil: 'networkidle' });
  await p2.waitForTimeout(150);
  await p2.screenshot({ path: `${OUT}/دليل-${name}.png`, clip: { x: 0, y: 0, width: W, height: H } });
}
await b2.close();
console.log('✅ معاينة + نسختا الدليل (وردي = خط القص · أزرق = المنطقة الآمنة)');
