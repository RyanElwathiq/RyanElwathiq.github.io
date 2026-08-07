// ═══════════════════════════════════════════════════════════════
//  «خيط الضوء» — سلسلة تصاميم السوشال (2026-08-07)
//
//  نظام واحد بثلاث تعبيرات، كلها ضوء ليموني مرسوم بالكود:
//    thread — الخيط الواصل: بينتهي بعقدة هي نقطة نهاية الجملة
//    break  — الخيط المقطوع: الفراغ نفسه هو الرسالة
//    stairs — درج الضوء: خطوات ضوء بمنظور، وشخص صغير طالع عليها
//             بمكان فاضي بعيد، وأشعة الضو المنكسرة هي اللي بتدلّه
//             (ملاحظة ريّان من الصور الأصلية اللي استلهمنا منها)
//
//  كل تصميم بمقاسين: post 1080×1080 · story 1080×1920
//  والجُمل كلها من صفحات خدماته حرفياً، مش كلام مؤلَّف.
//
//  التشغيل: node _check/lightthread.mjs [preview]
//  الناتج: D:/Ryan-Work/Brand-Ryan/Social/_Generated/light-thread/
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { readFileSync, mkdirSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/_Generated/light-thread';
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

// ─────────────────────────────────────────────────────────────
//  الجُمل — كلها منقولة حرفياً من صفحات الخدمات
// ─────────────────────────────────────────────────────────────
const SERIES = [
  {
    id: '01-social',
    motif: 'thread',
    eyebrow: 'إدارة السوشال ميديا',
    l1: 'النشر بلا <span class="kw">خُطَّة</span>',
    l2: 'مش استراتيجية',
  },
  {
    id: '02-consulting',
    motif: 'break',
    eyebrow: 'استشارة وتدريب',
    top: 'أحياناً ما بكون<br>ناقصك موظّف.',
    bot: 'بل حدا <span class="kw">بيفهّمك</span>.',
    lead: 'تدريب على حسابك انت، مش على أمثلة نظرية.',
  },
  {
    id: '03-seo',
    motif: 'stairs',
    eyebrow: 'تحسين محركات البحث',
    l1: 'الإعلان بيوقف لما توقف تدفع.',
    l2: 'والبحث بيضل <span class="kw">يجيبلك</span>.',
  },
  {
    id: '04-brand',
    motif: 'thread',
    eyebrow: 'الهوية البصرية',
    l1: 'تصميم اللوجو أسهل جزء.',
    l2: 'الـ<span class="kw">هُوِيَّة</span> إنه حدا يعرفك',
    l3: 'قبل ما يقرا اسمك',
  },
  {
    id: '05-data',
    motif: 'break',
    eyebrow: 'تحليل البيانات',
    top: 'عندك أرقام كثيرة.',
    bot: 'ولا وحدة بتقولك<br>شو تعمل <span class="kw">بُكرا</span>.',
    lead: 'تعرف شو بيشتغل قبل ما تصرف أكثر.',
  },
  {
    id: '06-agents',
    motif: 'stairs',
    eyebrow: 'وكلاء الذكاء الاصطناعي',
    l1: 'كل يوم بتعيد نفس الشغل بإيدك.',
    l2: 'وهو <span class="kw">بينعمل</span> لحاله.',
  },
];

// ─────────────────────────────────────────────────────────────
//  الأساس المشترك
// ─────────────────────────────────────────────────────────────
const base = (W, H) => `
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900;font-display:block}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF;font-display:block}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700;font-display:block}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${BG};position:relative;overflow:hidden;
       font-family:'Alexandria',sans-serif;color:${INK};-webkit-font-smoothing:antialiased}
  /* حبيبات: بتشيل الإحساس الرقمي المسطّح وبتعطي ملمس مطبوع */
  .grain{position:absolute;inset:-20%;opacity:.05;pointer-events:none;mix-blend-mode:overlay}
  .vig{position:absolute;inset:0;pointer-events:none;
       background:radial-gradient(125% 95% at 50% 42%, transparent 45%, #000000BB 100%)}
  .sig{position:absolute;bottom:${Math.round(H * 0.05)}px;left:${Math.round(W * 0.055)}px;right:${Math.round(W * 0.055)}px;
       display:flex;align-items:center;justify-content:space-between;direction:ltr;z-index:6}
  .sig img{width:${Math.round(W * 0.042)}px;height:${Math.round(W * 0.042)}px;opacity:.9}
  .sig span{font-family:'Grotesk','Alexandria',sans-serif;font-size:${Math.round(W * 0.021)}px;font-weight:600;
            color:${MUTED};letter-spacing:.02em}
  .kw{color:${ACCENT}}
  svg.art{position:absolute;inset:0;width:100%;height:100%;z-index:1}
  .txt{position:absolute;z-index:4}
  /* التشكيل بده متنفس فوق الحرف، وإلا بينقص */
  h1{line-height:1.55;letter-spacing:-.012em}
`;

const grainSvg = `<svg class="grain" xmlns="http://www.w3.org/2000/svg">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/></filter>
  <rect width="100%" height="100%" filter="url(#n)"/></svg>`;

const sig = (W) => `<div class="sig"><img src="${logo}"><span>ryanalali<b style="color:${ACCENT};font-weight:600">.me</b></span></div>`;

// فلتر توهج بإحداثيات صريحة (النِسَب بتلغي الأشكال المسطّحة)
const glowFilter = (id, W, H, dev = 10) =>
  `<filter id="${id}" filterUnits="userSpaceOnUse" x="${-W}" y="${-H}" width="${W * 3}" height="${H * 3}">
     <feGaussianBlur stdDeviation="${dev}" result="b"/>
     <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

// ─────────────────────────────────────────────────────────────
//  موتيف ٣ — درج الضوء
//  خطوات ضوء بمنظور نقطة واحدة، بتضوي أكثر كل ما قربت من
//  المصدر البعيد، وشخص صغير طالع عليها. الصِغَر مقصود: الفراغ
//  حوله هو اللي بيعطي إحساس المكان البعيد.
// ─────────────────────────────────────────────────────────────
const stairs = (W, H, opts = {}) => {
  const vpx = opts.vpx ?? W * 0.70;
  const vpy = opts.vpy ?? H * 0.30;
  const x0 = opts.x0 ?? W * 0.16;
  const y0 = opts.y0 ?? H * 0.90;
  const hw0 = opts.hw0 ?? W * 0.25;
  const N = opts.n ?? 10;
  const figAt = opts.figAt ?? 4;

  const P = (i) => {
    const t = i / N;
    const e = Math.pow(t, 1.28);
    return { cx: lerp(x0, vpx, e), y: lerp(y0, vpy, e), hw: lerp(hw0, W * 0.016, e), e };
  };

  // كل درجة: وجه علوي شفيف + حرف أمامي مضيّ
  let steps = '';
  for (let i = 0; i < N; i++) {
    const a = P(i);
    const b = P(i + 1);
    const op = 0.16 + 0.74 * a.e; // بيضوي أكثر باتجاه المصدر
    steps += `<polygon points="${a.cx - a.hw},${a.y} ${a.cx + a.hw},${a.y} ${b.cx + b.hw},${b.y} ${b.cx - b.hw},${b.y}"
        fill="${ACCENT}" opacity="${(op * 0.1).toFixed(3)}"/>
      <line x1="${a.cx - a.hw}" y1="${a.y}" x2="${a.cx + a.hw}" y2="${a.y}"
        stroke="${ACCENT}" stroke-width="${(2.6 - 1.7 * a.e).toFixed(2)}" opacity="${op.toFixed(3)}"
        stroke-linecap="round" filter="url(#stGlow)"/>`;
  }

  // أشعة منكسرة من المصدر البعيد — هي اللي «بتدلّه» عالطريق
  let rays = '';
  const rayDefs = [
    [-0.55, 0.55, ACCENT, 0.16],
    [-0.2, 0.85, '#FFFFFF', 0.1],
    [0.25, 0.7, ACCENT, 0.13],
    [0.7, 0.5, '#BFF2C8', 0.07],
  ];
  rayDefs.forEach(([dx, len, col, op]) => {
    const ex = vpx + dx * W * 0.9;
    const ey = vpy + len * H * 0.75;
    rays += `<line x1="${vpx}" y1="${vpy}" x2="${ex}" y2="${ey}" stroke="${col}"
      stroke-width="1.6" opacity="${op}" filter="url(#stGlow)"/>`;
  });

  // الشخص — ظل داكن على درجة مضيّة، بحجم صغير عمداً
  const f = P(figAt);
  const s = (H * 0.085) * (1 - f.e * 0.55); // بيصغر بالمنظور
  const fx = f.cx - f.hw * 0.15;
  const fy = f.y;
  // ⚠️ الشخص ظل **مملوء** مش خطوط: الخطوط المتساوية بتطلع «عود كبريت».
  //    الجذع مملوء ومخصّر، والأطراف أوتاد بأطراف مدوّرة، والرجل الأمامية
  //    مرفوعة على الدرجة الجاية عشان يبين طالع مش واقف. النِسَب: الراس
  //    سُبع الطول، وهاي النسبة اللي بتخلي الظل يقرا كإنسان.
  // ⚠️ النِسَب هي كل الحكاية: الراس ~١٦٪ من الطول والرجول ~٤٥٪.
  //    لما كان الراس ٢٤٪ الظل بيقرا طفل/عود كبريت مش شخص أنيق.
  const u = s / 58;
  const body = (fill, sw) => `
      <path d="M -4,-44 Q 1,-47.5 5.5,-43.5 L 4,-26 Q 0,-23.5 -3.5,-26 Z" fill="${fill}"/>
      <circle cx="2.5" cy="-52" r="4.6" fill="${fill}"/>
      <path d="M 1.5,-47.5 L 2,-44" stroke="${fill}" stroke-width="${sw * 0.55}" stroke-linecap="round"/>
      <g stroke="${fill}" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M -1,-26 L -7.5,-13 L -12,0" stroke-width="${sw}"/>
        <path d="M 2,-26 L 10,-19 L 12,-8.5" stroke-width="${sw}"/>
        <path d="M -0.5,-42 L -7,-33 L -9,-25" stroke-width="${sw * 0.7}"/>
        <path d="M 4.5,-42 L 11,-35 L 12,-27" stroke-width="${sw * 0.7}"/>
      </g>`;
  const fig = `<g transform="translate(${fx},${fy}) scale(${u.toFixed(3)})">
      <ellipse cx="-1" cy="1.5" rx="13" ry="2.4" fill="#000" opacity=".42"/>
      <g opacity=".22" filter="url(#stGlow)">${body(ACCENT, 5.6)}</g>
      ${body('#0A0B0D', 4.6)}
      <path d="M 5.5,-43.5 L 4,-26" stroke="${ACCENT}" stroke-width="1.1" fill="none" opacity=".42"/>
    </g>`;

  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>
      ${glowFilter('stGlow', W, H, 9)}
      <radialGradient id="src" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".55"/>
        <stop offset="45%" stop-color="${ACCENT}" stop-opacity=".12"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="${vpx}" cy="${vpy}" r="${W * 0.34}" fill="url(#src)"/>
    ${rays}${steps}${fig}
  </svg>`;
};

// ─────────────────────────────────────────────────────────────
//  موتيف ١ — الخيط الواصل (العقدة بتنقاس بعد تركيب النص)
// ─────────────────────────────────────────────────────────────
const threadArt = (W, H) => `<svg class="art" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="thr" gradientUnits="userSpaceOnUse" x1="0" y1="${H}" x2="${W * 0.83}" y2="${H * 0.35}">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".08"/>
      <stop offset="25%" stop-color="${ACCENT}" stop-opacity=".42"/>
      <stop offset="65%" stop-color="${ACCENT}" stop-opacity=".82"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="1"/>
    </linearGradient>
    ${glowFilter('thGlow', W, H, 10)}
  </defs>
  <path id="p" fill="none" stroke="url(#thr)" stroke-width="2.6" stroke-linecap="round" filter="url(#thGlow)"/>
  <circle id="c1" r="6.5" fill="${ACCENT}" filter="url(#thGlow)"/>
  <circle id="c2" r="18" fill="none" stroke="${ACCENT}" stroke-width="1.3" opacity=".4"/>
  <circle id="c3" r="36" fill="none" stroke="${ACCENT}" stroke-width="1" opacity=".14"/>
</svg>`;

// ─────────────────────────────────────────────────────────────
//  موتيف ٢ — الخيط المقطوع
// ─────────────────────────────────────────────────────────────
const breakArt = (W, H, yPos) => {
  const y = yPos;
  const rEnd = W * 0.62;
  const lEnd = W * 0.36;
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="tR" gradientUnits="userSpaceOnUse" x1="${W}" y1="0" x2="${rEnd}" y2="0">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".95"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity=".85"/>
      </linearGradient>
      <linearGradient id="tL" gradientUnits="userSpaceOnUse" x1="${lEnd}" y1="0" x2="0" y2="0">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".5"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity=".16"/>
      </linearGradient>
      <!-- ⚠️ الخط الأفقي إطاره صفر ارتفاع، فالفلتر بالنِسَب بيلغيه -->
      <filter id="brGlow" filterUnits="userSpaceOnUse" x="-60" y="${y - 110}" width="${W + 120}" height="220">
        <feGaussianBlur stdDeviation="9" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M ${W} ${y} L ${rEnd} ${y}" fill="none" stroke="url(#tR)" stroke-width="3" stroke-linecap="round" filter="url(#brGlow)"/>
    <circle cx="${rEnd}" cy="${y}" r="6" fill="${ACCENT}" filter="url(#brGlow)"/>
    <path d="M ${rEnd - 10} ${y} L ${lEnd + 10} ${y}" fill="none" stroke="${ACCENT}" stroke-width="1.6"
      stroke-dasharray="1.5 22" stroke-linecap="round" opacity=".28"/>
    <path d="M ${lEnd} ${y} L 0 ${y}" fill="none" stroke="url(#tL)" stroke-width="3" stroke-linecap="round" filter="url(#brGlow)" opacity=".9"/>
    <circle cx="${lEnd}" cy="${y}" r="4.5" fill="${ACCENT}" opacity=".55" filter="url(#brGlow)"/>
  </svg>`;
};

// ─────────────────────────────────────────────────────────────
//  بناء التصميم
// ─────────────────────────────────────────────────────────────
const build = (item, size) => {
  const post = size === 'post';
  const W = 1080;
  const H = post ? 1080 : 1920;
  const pad = Math.round(W * 0.078);
  const eyeSize = post ? 20 : 24;

  let art = '';
  let txt = '';
  let script = '';

  if (item.motif === 'thread') {
    const three = !!item.l3;
    const fs = post ? (three ? 62 : 72) : three ? 74 : 84;
    art = threadArt(W, H);
    txt = `<div class="txt" style="top:${post ? 250 : 620}px;right:${pad}px;width:${W - pad * 2}px;text-align:right">
        <p style="font-size:${eyeSize}px;font-weight:500;color:${MUTED};letter-spacing:.08em;margin-bottom:${post ? 34 : 44}px">${item.eyebrow}</p>
        <h1 style="font-size:${fs}px;font-weight:800;padding-bottom:16px">${item.l1}<br><span id="lastline">${item.l2}${
          three ? '<br>' + item.l3 : ''
        }</span></h1>
      </div>`;
    script = `<script>
      // العقدة = نقطة نهاية الجملة. لازم ننتظر الخط العربي قبل القياس،
      // وإلا بنقيس على خط احتياطي أضيق والعقدة بتوقع جوّا الكلمة.
      document.fonts.ready.then(function(){
        var el = document.getElementById('lastline');
        var r = el.getBoundingClientRect();
        var x = Math.round(r.left) - 48;   // بالعربي النهاية عاليسار (٤٨ عشان الحلقة الخارجية ما تلمس الحرف)
        var y = Math.round(r.bottom) - ${three ? 34 : 34};
        ['c1','c2','c3'].forEach(function(id){
          var c = document.getElementById(id);
          c.setAttribute('cx', x); c.setAttribute('cy', y);
        });
        document.getElementById('p').setAttribute('d',
          'M -60 ${H - 60} C ' + Math.round(${W} * 0.13) + ' ' + Math.round(${H} * 0.80) + ', ' +
          Math.round(${W} * 0.19) + ' ' + Math.round(${H} * 0.62) + ', ' + x + ' ' + y);
      });
    </script>`;
  } else if (item.motif === 'break') {
    const yBreak = post ? Math.round(H * 0.475) : Math.round(H * 0.5);
    const fs = post ? 64 : 76;
    art = breakArt(W, H, yBreak);
    txt = `<div class="txt" style="top:${post ? 178 : 560}px;right:${pad}px;left:${pad}px;text-align:right">
        <p style="font-size:${eyeSize}px;font-weight:500;color:${MUTED};letter-spacing:.08em;margin-bottom:${post ? 30 : 40}px">${item.eyebrow}</p>
        <h1 style="font-size:${fs}px;font-weight:800;padding-bottom:12px">${item.top}</h1>
      </div>
      <div class="txt" style="top:${post ? yBreak + 118 : yBreak + 150}px;right:${pad}px;left:${pad}px;text-align:right">
        <h1 style="font-size:${fs}px;font-weight:800;padding-bottom:12px">${item.bot}</h1>
        <p style="font-size:${post ? 23 : 28}px;font-weight:500;color:${MUTED};margin-top:${post ? 28 : 36}px;line-height:1.85">${item.lead}</p>
      </div>`;
  } else {
    // stairs — النص فوق والدرج بيملا الفراغ تحت.
    // ⚠️ ٧٠px بالستوري كان بيكسر «توقف / تدفع» بشكل بشع — ٦٢ بتخليه سطر واحد
    const fs = post ? 56 : 62;
    art = stairs(W, H, post
      ? { vpx: W * 0.72, vpy: H * 0.46, x0: W * 0.14, y0: H * 0.99, hw0: W * 0.24, n: 10, figAt: 4 }
      : { vpx: W * 0.70, vpy: H * 0.52, x0: W * 0.14, y0: H * 1.02, hw0: W * 0.26, n: 11, figAt: 4 });
    txt = `<div class="txt" style="top:${post ? 130 : 300}px;right:${pad}px;left:${pad}px;text-align:right">
        <p style="font-size:${eyeSize}px;font-weight:500;color:${MUTED};letter-spacing:.08em;margin-bottom:${post ? 28 : 38}px">${item.eyebrow}</p>
        <h1 style="font-size:${fs}px;font-weight:800;padding-bottom:14px">${item.l1}<br>${item.l2}</h1>
      </div>`;
  }

  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${base(W, H)}</style></head><body>
    <div style="position:absolute;inset:0;background:radial-gradient(70% 55% at 86% 12%, ${ACCENT}12, transparent 62%)"></div>
    ${art}${txt}
    <div class="vig"></div>${grainSvg}${sig(W)}${script}
  </body></html>`;
};

// ─────────────────────────────────────────────────────────────
const browser = await chromium.launch();
const only = process.argv[2] === 'preview' ? SERIES.slice(0, 3) : SERIES;

for (const size of ['post', 'story']) {
  const H = size === 'post' ? 1080 : 1920;
  const page = await browser.newPage({ viewport: { width: 1080, height: H } });
  await page.route('http://post.local/**', async (route) => {
    const p = new URL(route.request().url()).pathname;
    if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
    route.fulfill({ body: '', contentType: 'text/html' });
  });
  await page.goto('http://post.local/');
  for (const item of only) {
    await page.setContent(build(item, size), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(340);
    await page.screenshot({ path: `${OUT}/${item.id}-${size}.png`, type: 'png' });
    console.log('✅', `${item.id}-${size}`);
  }
  await page.close();
}
await browser.close();
