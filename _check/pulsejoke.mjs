// ═══════════════════════════════════════════════════════════════
//  «ما تحاول تتهبل» — تصاميم فكاهية (2026-08-08)
//
//  الفكرة: اسم الوكيل «نبض». فالتصميم خط نبض ماشي هادي وبيقفز
//  قفزة وحدة — لحظة ما وصله الطلب الهبل. ولا شكل بيتكرر مع أي
//  تصميم قبله بالمكتبة (خيط الضوء والعدّادات كلها أشكال تانية).
//
//  والنكتة على ريّان نفسه مش على العميل: هو اللي حاول يتهبل على
//  الفورم تبعه، والوكيل ردّ عليه بجدية. هيك بتضحك وبتبيع بنفس
//  الوقت — لأنها بتوري إنه النظام شغّال فعلاً.
//
//  ⚠️ الادعاء الوحيد بالتصميم: «بيقرا كل طلب بيوصل الموقع وبيرد».
//     وهاد صحيح ومفحوص حي 2026-08-08.
//  ⚠️ الخط بينحمّل عبر route من node_modules — Playwright ما بيقرا
//     خطوط الموقع لحاله.
//
//  التشغيل: node _check/pulsejoke.mjs
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync } from 'fs';

const OUT = 'G:/My Drive/ريّان الواثق — مكتبة الحملة/٤ — تصاميم السوشال/ما تحاول تتهبل';
mkdirSync(`${OUT}/بوست مربع`, { recursive: true });
mkdirSync(`${OUT}/ستوري طولي`, { recursive: true });

const ACCENT = '#D9FF3F';
const BG = '#0E0F12';
const MUTED = '#A0A49B';
const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');

const FONTS = {
  '/__f/ar.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/lat.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/gro.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

// ─── خط النبض: هادي طول الطريق، وقفزة وحدة عند ٥٨٪ ───
const pulsePath = (w, h) => {
  const mid = h / 2;
  const pts = [];
  for (let x = 0; x <= w; x += 4) {
    const r = x / w;
    let y = mid + Math.sin(x / 26) * 3.5 + Math.sin(x / 61) * 2;
    // القفزة: مركّبة زي تخطيط القلب — نزلة صغيرة، قفزة عالية، نزلة عميقة، رجوع
    const c = 0.58 * w;
    const d = x - c;
    if (Math.abs(d) < 74) {
      if (d > -74 && d <= -34) y = mid + 13 * Math.sin(((d + 74) / 40) * Math.PI);
      else if (d > -34 && d <= 4) y = mid - (h * 0.42) * Math.sin(((d + 34) / 38) * Math.PI);
      else if (d > 4 && d <= 40) y = mid + (h * 0.20) * Math.sin(((d - 4) / 36) * Math.PI);
      else y = mid - 8 * Math.sin(((d - 40) / 34) * Math.PI);
    }
    pts.push(`${x.toFixed(0)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
};

const spikeX = (w) => 0.58 * w - 15;

const shell = ({ W, H, isAr, kicker, h1, h2, sub, tag, pw, ph, logoTop, gapTop }) => {
  const dir = isAr ? 'rtl' : 'ltr';
  const fam = isAr ? 'Alexandria' : 'Grotesk';
  return `<!doctype html><html dir="${dir}"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alexandria';src:url('/__f/ar.woff2') format('woff2');font-weight:100 900}
@font-face{font-family:'Alexandria';src:url('/__f/lat.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
@font-face{font-family:'Grotesk';src:url('/__f/gro.woff2') format('woff2');font-weight:300 800}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:${BG};position:relative;overflow:hidden;
     font-family:'${fam}','Alexandria',sans-serif;color:#F2F3EE}
.g1{position:absolute;inset:0;background:radial-gradient(52% 30% at 58% 50%, ${ACCENT}14, transparent 64%)}
.g2{position:absolute;inset:0;background:radial-gradient(84% 44% at 50% 112%, #000000AA, transparent 70%)}
.logo{position:absolute;top:${logoTop}px;${isAr ? 'right' : 'left'}:${W * 0.072}px;width:${W * 0.075}px;opacity:.92}
.kick{position:absolute;top:${logoTop + 8}px;${isAr ? 'left' : 'right'}:${W * 0.072}px;
      font-size:${W * 0.026}px;font-weight:700;letter-spacing:${W * 0.004}px;color:${ACCENT}}
.stack{position:absolute;top:${gapTop}px;left:0;width:100%;height:calc(100% - ${gapTop}px - ${H * 0.30}px);
       display:flex;flex-direction:column;justify-content:center;gap:${H * 0.055}px;padding:0 ${W * 0.082}px}
h1{font-size:${W * (isAr ? 0.086 : 0.078)}px;font-weight:800;line-height:1.3}
h2{font-size:${W * (isAr ? 0.086 : 0.078)}px;font-weight:800;line-height:1.3;color:${ACCENT};margin-top:${W * 0.004}px}
.pulse{position:relative;width:${pw}px;height:${ph}px;align-self:center;flex:none}
.dot{position:absolute;width:${W * 0.026}px;height:${W * 0.026}px;border-radius:50%;background:${ACCENT};
     box-shadow:0 0 ${W * 0.05}px ${ACCENT};transform:translate(-50%,-50%)}
.stem{position:absolute;height:1.5px;background:${ACCENT}77;transform:translateY(-50%)}
.tag{position:absolute;font-size:${W * 0.027}px;font-weight:700;color:${ACCENT};white-space:nowrap;
     transform:translateY(-50%);direction:${dir}}
.sub{position:absolute;bottom:${H * 0.145}px;left:0;width:100%;padding:0 ${W * 0.082}px;
     font-size:${W * 0.032}px;line-height:1.65;color:${MUTED}}
.dom{position:absolute;bottom:${H * 0.062}px;${isAr ? 'left' : 'right'}:${W * 0.082}px;direction:ltr;
     font-family:'Grotesk','Alexandria',sans-serif;font-size:${W * 0.03}px;font-weight:700;color:${MUTED}}
</style></head><body>
<div class="g1"></div><div class="g2"></div>
<img class="logo" src="${logo}">
<div class="kick">${kicker}</div>

<div class="stack">
  <div><h1>${h1}</h1><h2>${h2}</h2></div>

  <div class="pulse">
    <svg viewBox="0 0 ${pw} ${ph}" style="width:100%;height:100%;overflow:visible">
      <polyline points="${pulsePath(pw, ph)}" fill="none" stroke="${ACCENT}" stroke-width="4"
        stroke-linejoin="round" stroke-linecap="round" opacity=".95"/>
    </svg>
    <div class="stem" style="left:${spikeX(pw) + W * 0.02}px;top:${ph * 0.5 - ph * 0.42}px;width:${W * 0.035}px"></div>
    <div class="dot" style="left:${spikeX(pw)}px;top:${ph * 0.5 - ph * 0.42}px"></div>
    <div class="tag" style="left:${spikeX(pw) + W * 0.062}px;top:${ph * 0.5 - ph * 0.42}px">${tag}</div>
  </div>
</div>

<div class="sub">${sub}</div>
<div class="dom">ryanalali<span style="color:${ACCENT}">.me</span></div>
</body></html>`;
};

const AR = {
  isAr: true,
  kicker: 'قصة حقيقية',
  h1: 'حاولت أتهبل',
  h2: 'على الفورم تبعي.',
  tag: 'هون انمسكت',
  sub: 'الوكيل اللي بنيته بيقرا كل طلب بيوصل الموقع، وبيرد عليه.<br>حتى لما اللي كاتبه يكون أنا، الساعة ٣ الفجر.',
};
const EN = {
  isAr: false,
  kicker: 'TRUE STORY',
  h1: 'I tried to mess',
  h2: 'with my own form.',
  tag: 'caught',
  sub: 'The agent I built reads every brief that hits the site, and answers it.<br>Including the one its creator wrote at 3am.',
};

const SIZES = [
  ['بوست مربع', 1080, 1080, 760, 210, 72, 175],
  ['ستوري طولي', 1080, 1920, 790, 250, 210, 430],
];

for (const t of [AR, EN]) {
  const txt = [t.h1, t.h2, t.sub, t.tag].join(' ');
  if (/[—–]/.test(txt)) throw new Error('em-dash بالنص');
}

const browser = await chromium.launch();
for (const [folder, W, H, pw, ph, logoTop, gapTop] of SIZES) {
  const p = await browser.newPage({ viewport: { width: W, height: H } });
  await p.route('http://joke.local/**', async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (FONTS[path]) return route.fulfill({ body: readFileSync(FONTS[path]), contentType: 'font/woff2' });
    route.fulfill({ body: '', contentType: 'text/html' });
  });
  await p.goto('http://joke.local/');
  for (const [name, t] of [['ما-تحاول-تتهبل', AR], ['dont-try-it-EN', EN]]) {
    await p.setContent(shell({ W, H, pw, ph, logoTop, gapTop, ...t }), { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(220);
    await p.screenshot({ path: `${OUT}/${folder}/${name}.png`, clip: { x: 0, y: 0, width: W, height: H } });
    console.log('✅', folder, name);
  }
  await p.close();
}
await browser.close();
