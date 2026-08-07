// ═══════════════════════════════════════════════════════════════
//  «خيط الضوء» — سلسلة مقال «أول إعلان ممول» (2026-08-07)
//
//  نفس لغة السلسلة الأم (ضوء ليموني بالكود، أرضية داكنة، حبيبات)
//  ⚠️ وقاعدة ريّان الحاكمة: **ولا تصميمين بنفس الشكل.**
//     خمس جُمل من المقال، وكل وحدة إلها فكرة مجرّدة مشتقّة من
//     معناها هي بالذات — ولا وحدة بتشبه الثانية ولا بتشبه
//     تصاميم سلسلة الخدمات:
//
//   gauge      عدّاد كامل بلا إبرة        ← بلا قياس ما إنت بتعلن
//   scrollstop تيار بيمرق وسطر واقف       ← الوعد بيوقّف السكرول
//   target     سهم بقلب الهدف… الغلط      ← النظام بيجيبلك اللي طلبته
//   reset      خط بيطلع وبيرجع للصفر      ← كل تعديل بيرجّع التعلّم
//   sieve      كثير بيدخل وواحد بيطلع     ← رقم واحد بيقرر
//
//  كل تصميم بمقاسين: post 1080×1080 · story 1080×1920
//  الجُمل كلها من المقال حرفياً.
//
//  التشغيل: node _check/lightads.mjs
//  الناتج: Social/_Generated/ad-article/  ← وبينتقل للدرايف بعدها
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/_Generated/ad-article';
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

const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const P = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

const SERIES = [
  {
    id: '01-qiyas',
    art: 'gauge',
    eyebrow: 'أول إعلان ممول',
    l1: 'بلا قياس، إنت مش عم تعلن.',
    l2: 'إنت عم تدفع لناس تشوفك',
    l3: 'وتتمنّى <span class="kw">الخير</span>.',
  },
  {
    id: '02-wa3d',
    art: 'scrollstop',
    eyebrow: 'كتابة الإعلان',
    l1: '«بنقدّم خدمات تنظيف» وصف.',
    l2: '«بننظّف الكنب بمكانه',
    l3: 'وبينشف بساعتين» <span class="kw">وعد</span>.',
  },
  {
    id: '03-hadaf',
    art: 'target',
    eyebrow: 'اختيار الهدف',
    l1: 'طلبت <span class="kw">تفاعل</span>؟',
    l2: 'بيجيبلك ناس بتحب تتفاعل',
    l3: 'وما بتشتري.',
  },
  {
    id: '04-ta3allum',
    art: 'reset',
    eyebrow: 'أول أيام الحملة',
    l1: 'كل تعديل بتعمله',
    l2: 'بيرجّع التعلّم <span class="kw">للصفر</span>.',
  },
  {
    id: '05-raqam',
    art: 'sieve',
    eyebrow: 'قراءة الأرقام',
    l1: 'رقم واحد بيقرر:',
    l2: '<span class="kw">تكلفة النتيجة الواحدة</span>.',
    l3: 'الباقي بيحسّسك بالإنجاز.',
  },
];

const base = (W, H) => `
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900;font-display:block}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF;font-display:block}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700;font-display:block}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${BG};position:relative;overflow:hidden;
       font-family:'Alexandria',sans-serif;color:${INK};-webkit-font-smoothing:antialiased}
  .grain{position:absolute;inset:-20%;opacity:.05;pointer-events:none;mix-blend-mode:overlay}
  .vig{position:absolute;inset:0;pointer-events:none;
       background:radial-gradient(125% 95% at 50% 42%, transparent 45%, #000000BB 100%)}
  .sig{position:absolute;bottom:${Math.round(H * 0.05)}px;left:${Math.round(W * 0.055)}px;right:${Math.round(W * 0.055)}px;
       display:flex;align-items:center;justify-content:space-between;direction:ltr;z-index:6}
  .sig img{width:${Math.round(W * 0.042)}px;height:${Math.round(W * 0.042)}px;opacity:.9}
  .sig span{font-family:'Grotesk','Alexandria',sans-serif;font-size:${Math.round(W * 0.021)}px;font-weight:600;color:${MUTED}}
  .kw{color:${ACCENT}}
  svg.art{position:absolute;inset:0;width:100%;height:100%;z-index:1}
  .txt{position:absolute;z-index:4}
  h1{line-height:1.55;letter-spacing:-.012em}
  .eye{font-size:var(--eye);font-weight:500;color:${MUTED};letter-spacing:.08em}
`;

const grainSvg = `<svg class="grain" xmlns="http://www.w3.org/2000/svg">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;

const sig = () => `<div class="sig"><img src="${logo}"><span>ryanalali<b style="color:${ACCENT};font-weight:600">.me</b></span></div>`;

// فلتر بإحداثيات صريحة — النِسَب بتلغي الأشكال المسطّحة
const glowF = (id, W, H, dev = 9) =>
  `<filter id="${id}" filterUnits="userSpaceOnUse" x="${-W}" y="${-H}" width="${W * 3}" height="${H * 3}">
     <feGaussianBlur stdDeviation="${dev}" result="b"/>
     <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

// ═══ ١) gauge — عدّاد كامل… بلا إبرة ═══
// كل إشي موجود: القوس والشرطات والمحور. الناقص الوحيد هو اللي
// بيخلي العدّاد يعني إشي. وهاي هي الرسالة.
const artGauge = (W, H, cy) => {
  const cx = W * 0.5;
  const R = Math.min(W, H) * 0.21;
  let ticks = '';
  for (let i = 0; i <= 32; i++) {
    const a = lerp(-198, 18, i / 32);
    const major = i % 4 === 0;
    const [x0, y0] = P(cx, cy, R, a);
    const [x1, y1] = P(cx, cy, R - (major ? 22 : 11), a);
    ticks += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}"
      stroke="${ACCENT}" stroke-width="${major ? 2.6 : 1.5}" opacity="${(major ? 0.6 : 0.26).toFixed(2)}"
      stroke-linecap="round"/>`;
  }
  const [ax0, ay0] = P(cx, cy, R, -198);
  const [ax1, ay1] = P(cx, cy, R, 18);
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>${glowF('gG', W, H, 8)}
      <linearGradient id="gArc" gradientUnits="userSpaceOnUse" x1="${cx - R}" y1="0" x2="${cx + R}" y2="0">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".7"/>
        <stop offset="50%" stop-color="${ACCENT}" stop-opacity=".35"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity=".7"/></linearGradient>
    </defs>
    <path d="M ${ax0.toFixed(1)} ${ay0.toFixed(1)} A ${R} ${R} 0 1 1 ${ax1.toFixed(1)} ${ay1.toFixed(1)}"
      fill="none" stroke="url(#gArc)" stroke-width="3" stroke-linecap="round" filter="url(#gG)"/>
    ${ticks}
    <circle cx="${cx}" cy="${cy}" r="7" fill="none" stroke="${ACCENT}" stroke-width="2" opacity=".5"/>
    <circle cx="${cx}" cy="${cy}" r="2.4" fill="${ACCENT}" opacity=".8" filter="url(#gG)"/>
    <!-- الإبرة مش موجودة عمداً: بس أثر باهت جداً لمكانها -->
    <line x1="${cx}" y1="${cy}" x2="${P(cx, cy, R * 0.82, -128)[0].toFixed(1)}" y2="${P(cx, cy, R * 0.82, -128)[1].toFixed(1)}"
      stroke="${ACCENT}" stroke-width="2" opacity=".07" stroke-dasharray="3 9"/>
  </svg>`;
};

// ═══ ٢) scrollstop — تيار بيمرق، وسطر واحد واقف ═══
const artScrollStop = (W, H, top, bottom) => {
  const stopAt = lerp(top, bottom, 0.52);
  let bars = '';
  for (let i = 0; i < 22; i++) {
    const y = lerp(top, bottom, i / 21);
    if (Math.abs(y - stopAt) < 26) continue;
    const wI = W * (0.24 + rnd(i) * 0.44);
    const x = W * 0.5 - wI / 2 + (rnd(i + 30) - 0.5) * W * 0.1;
    // البارات ممطوطة وباهتة = حركة سكرول
    const h = 3 + rnd(i + 60) * 3;
    bars += `<rect x="${x.toFixed(1)}" y="${(y - h / 2).toFixed(1)}" width="${wI.toFixed(1)}" height="${h.toFixed(1)}"
      rx="${(h / 2).toFixed(1)}" fill="${ACCENT}" opacity="${(0.07 + rnd(i + 90) * 0.13).toFixed(3)}"/>`;
  }
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>${glowF('ssG', W, H, 10)}</defs>
    ${bars}
    <!-- السطر اللي وقف: واضح وحاد ومضيّ، وله ظل ساكن تحته -->
    <rect x="${(W * 0.12).toFixed(1)}" y="${(stopAt - 4).toFixed(1)}" width="${(W * 0.76).toFixed(1)}" height="8"
      rx="4" fill="${ACCENT}" filter="url(#ssG)"/>
    <rect x="${(W * 0.12).toFixed(1)}" y="${(stopAt + 14).toFixed(1)}" width="${(W * 0.44).toFixed(1)}" height="3"
      rx="1.5" fill="${ACCENT}" opacity=".3"/>
  </svg>`;
};

// ═══ ٣) target — سهم بقلب الهدف… الغلط ═══
const artTarget = (W, H, cy) => {
  const sx = W * 0.34;
  const sy = cy + H * 0.02;
  const sR = Math.min(W, H) * 0.075;
  const bx = W * 0.68;
  const by = cy - H * 0.035;
  const bR = Math.min(W, H) * 0.145;
  const rings = (x, y, R, n, op, sw) =>
    [...Array(n)].map((_, i) => `<circle cx="${x}" cy="${y}" r="${(R * (1 - i / n)).toFixed(1)}" fill="none"
      stroke="${ACCENT}" stroke-width="${sw}" opacity="${(op * (1 - i * 0.12)).toFixed(3)}"/>`).join('');
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>${glowF('tgG', W, H, 8)}</defs>
    <!-- الهدف الكبير اللي كان المفروض تصيبه: معتم وما حدا لمسه -->
    ${rings(bx, by, bR, 4, 0.13, 2)}
    <!-- الهدف الصغير: مصاب بدقة كاملة… بس هو الغلط -->
    ${rings(sx, sy, sR, 3, 0.85, 2.4)}
    <circle cx="${sx}" cy="${sy}" r="4.5" fill="${ACCENT}" filter="url(#tgG)"/>
    <!-- ⚠️ السهم بيجي من فوق مش من جنب: أول نسخة كان بيقطع الهدف
         الكبير فبتلخبط أي هدف انصاب -->
    <line x1="${(sx + sR * 1.5).toFixed(1)}" y1="${(sy - sR * 4.4).toFixed(1)}" x2="${(sx + 4).toFixed(1)}" y2="${(sy - 6).toFixed(1)}"
      stroke="${ACCENT}" stroke-width="2.6" stroke-linecap="round" filter="url(#tgG)"/>
    <path d="M ${(sx + sR * 1.5).toFixed(1)} ${(sy - sR * 4.4).toFixed(1)} l 15 4 M ${(sx + sR * 1.5).toFixed(1)} ${(sy - sR * 4.4).toFixed(1)} l -2 15"
      stroke="${ACCENT}" stroke-width="2.2" stroke-linecap="round" fill="none" opacity=".75"/>
  </svg>`;
};

// ═══ ٤) reset — خط بيطلع وبيرجع للصفر ═══
const artReset = (W, H, baseY) => {
  const segs = 4;
  const segW = W / segs;
  let path = `M 0 ${baseY}`;
  let drops = '';
  for (let i = 0; i < segs; i++) {
    const x0 = i * segW;
    const peak = H * (0.075 + i * 0.012); // بيحاول يطلع أعلى كل مرة
    const xPeak = x0 + segW * 0.82;
    path += ` C ${x0 + segW * 0.3} ${baseY - peak * 0.35}, ${x0 + segW * 0.6} ${baseY - peak * 0.9}, ${xPeak} ${baseY - peak}`;
    path += ` L ${xPeak} ${baseY}`; // السقوط العمودي للصفر
    drops += `<circle cx="${xPeak.toFixed(1)}" cy="${(baseY - peak).toFixed(1)}" r="4" fill="${ACCENT}" filter="url(#rsG)"/>
      <line x1="${xPeak.toFixed(1)}" y1="${(baseY - peak).toFixed(1)}" x2="${xPeak.toFixed(1)}" y2="${baseY}"
        stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="2 7" opacity=".4"/>`;
    if (i < segs - 1) path += ` L ${x0 + segW} ${baseY}`;
  }
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>${glowF('rsG', W, H, 8)}</defs>
    <line x1="0" y1="${baseY}" x2="${W}" y2="${baseY}" stroke="${ACCENT}" stroke-width="1.4" opacity=".22"/>
    <path d="${path}" fill="none" stroke="${ACCENT}" stroke-width="2.8" stroke-linecap="round"
      stroke-linejoin="round" opacity=".85" filter="url(#rsG)"/>
    ${drops}
  </svg>`;
};

// ═══ ٥) sieve — كثير بيدخل، واحد بيطلع ═══
const artSieve = (W, H, top, bottom) => {
  const cx = W * 0.5;
  const mouth = W * 0.34;
  const neckY = lerp(top, bottom, 0.72);
  // ⚠️ أول نسخة كانت النقاط باهتة وقليلة فبانت «غبار» مش «أرقام كثيرة».
  //    العدد والوضوح هما اللي بيخلوا الازدحام يقرا.
  let dots = '';
  for (let i = 0; i < 90; i++) {
    const t = rnd(i);
    const y = lerp(top, neckY - 26, t);
    const spread = lerp(mouth, W * 0.03, Math.pow(t, 1.5));
    const x = cx + (rnd(i + 40) - 0.5) * 2 * spread;
    const r = 2.4 + rnd(i + 80) * 2.6;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${ACCENT}"
      opacity="${(0.26 + (1 - t) * 0.34).toFixed(3)}"/>`;
  }
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>${glowF('svG', W, H, 8)}</defs>
    <!-- جدارا القمع: بيضيقوا لحد فتحة وحدة -->
    <path d="M ${cx - mouth} ${top} L ${cx - W * 0.028} ${neckY}" stroke="${ACCENT}" stroke-width="2" opacity=".3" fill="none"/>
    <path d="M ${cx + mouth} ${top} L ${cx + W * 0.028} ${neckY}" stroke="${ACCENT}" stroke-width="2" opacity=".3" fill="none"/>
    ${dots}
    <!-- الواحد اللي طلع: هو الوحيد المضيّ -->
    <circle cx="${cx}" cy="${(neckY + 46).toFixed(1)}" r="7" fill="${ACCENT}" filter="url(#svG)"/>
    <circle cx="${cx}" cy="${(neckY + 46).toFixed(1)}" r="20" fill="none" stroke="${ACCENT}" stroke-width="1.4" opacity=".4"/>
    <line x1="${cx}" y1="${(neckY + 6).toFixed(1)}" x2="${cx}" y2="${(neckY + 32).toFixed(1)}"
      stroke="${ACCENT}" stroke-width="2" opacity=".55" stroke-linecap="round"/>
  </svg>`;
};

const build = (it, size) => {
  const post = size === 'post';
  const W = 1080;
  const H = post ? 1080 : 1920;
  const pad = Math.round(W * 0.078);
  const eye = post ? 20 : 24;
  const three = !!it.l3;

  const head = (top, fs) =>
    `<div class="txt" style="top:${top}px;right:${pad}px;left:${pad}px;text-align:right;--eye:${eye}px">
      <p class="eye" style="margin-bottom:${post ? 28 : 38}px">${it.eyebrow}</p>
      <h1 style="font-size:${fs}px;font-weight:800;padding-bottom:16px">${it.l1}<br>${it.l2}${three ? '<br>' + it.l3 : ''}</h1>
    </div>`;

  let art = '';
  let txt = '';
  if (it.art === 'gauge') {
    art = artGauge(W, H, post ? H * 0.74 : H * 0.75);
    txt = head(post ? 140 : 380, post ? 52 : 62);
  } else if (it.art === 'scrollstop') {
    art = artScrollStop(W, H, post ? H * 0.50 : H * 0.54, post ? H * 0.95 : H * 0.95);
    txt = head(post ? 130 : 350, post ? 50 : 60);
  } else if (it.art === 'target') {
    art = artTarget(W, H, post ? H * 0.72 : H * 0.74);
    txt = head(post ? 160 : 420, post ? 58 : 70);
  } else if (it.art === 'reset') {
    // ⚠️ الجملة سطرين بس، فكان بيصير فراغ ميت بين النص والرسم.
    //    النص نزل والرسم طلع لحد ما لمسوا بعض بصرياً.
    art = artReset(W, H, post ? H * 0.74 : H * 0.78);
    txt = head(post ? 270 : 620, post ? 62 : 76);
  } else {
    art = artSieve(W, H, post ? H * 0.48 : H * 0.52, post ? H * 0.94 : H * 0.94);
    txt = head(post ? 130 : 350, post ? 50 : 60);
  }

  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${base(W, H)}</style></head><body>
    <div style="position:absolute;inset:0;background:radial-gradient(70% 55% at 86% 12%, ${ACCENT}12, transparent 62%)"></div>
    ${art}${txt}<div class="vig"></div>${grainSvg}${sig()}
  </body></html>`;
};

const browser = await chromium.launch();
for (const size of ['post', 'story']) {
  const H = size === 'post' ? 1080 : 1920;
  const page = await browser.newPage({ viewport: { width: 1080, height: H } });
  await page.route('http://post.local/**', async (route) => {
    const p = new URL(route.request().url()).pathname;
    if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
    route.fulfill({ body: '', contentType: 'text/html' });
  });
  await page.goto('http://post.local/');
  for (const it of SERIES) {
    await page.setContent(build(it, size), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/${it.id}-${size}.png`, type: 'png' });
    console.log('✅', `${it.id}-${size}`);
  }
  await page.close();
}
await browser.close();
