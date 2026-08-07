// ═══════════════════════════════════════════════════════════════
//  «خيط الضوء» — سلسلة تصاميم السوشال (2026-08-07)
//
//  ⚠️ قاعدة ريّان الحاكمة: **ولا تصميمين بنفس الشكل.**
//     أول نسخة استخدمت «درج الضوء» بتصميمين بنفس الزاوية بالضبط
//     فطلعوا نسخة واحدة. من هون وجاي: **الضوء هو اللغة المشتركة،
//     مش الشكل المشترك.** كل تصميم إله فكرة مجرّدة خاصة فيه،
//     مشتقّة من معنى جملته هي بالذات:
//
//   scatter  — شرارات متفرقة بلا اتجاه، وخيط واحد بيشقّها  (نشر بلا خطة)
//   gap      — خطان ما بيلتقوا أبداً، والجسر الناقص بينهم  (حدا بيفهمك)
//   twolines — خط بينقطع فجأة، وخط بيكبر ويتفرّع للأبد      (إعلان مقابل SEO)
//   mark     — علامة ناقصة بتنعرف قبل ما تكتمل             (الهوية)
//   field    — حقل نقاط متساوية، ولا وحدة بتدلّك            (أرقام بلا معنى)
//   stairs   — درج بيضوي لحاله، بلا حدا يمشي عليه           (بينعمل لحاله)
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
// عشوائية ثابتة: نفس البذرة = نفس التصميم كل مرة (مهم للتكرار)
const rnd = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const SERIES = [
  {
    id: '01-social',
    art: 'scatter',
    eyebrow: 'إدارة السوشال ميديا',
    l1: 'النشر بلا <span class="kw">خُطَّة</span>',
    l2: 'مش استراتيجية',
  },
  {
    id: '02-consulting',
    art: 'gap',
    eyebrow: 'استشارة وتدريب',
    top: 'أحياناً ما بكون<br>ناقصك موظّف.',
    bot: 'بل حدا <span class="kw">بيفهمك</span>.',
    lead: 'تدريب على حسابك انت، مش على أمثلة نظرية.',
  },
  {
    id: '03-seo',
    art: 'twolines',
    eyebrow: 'تحسين محركات البحث',
    l1: 'الإعلان بيوقف لما تبطّل تدفع عليه.',
    l2: 'والـ<span class="kw">SEO</span> بيضل معك للأبد،',
    l3: 'بل وبيتطوّر.',
  },
  {
    id: '04-brand',
    art: 'mark',
    eyebrow: 'الهوية البصرية',
    l1: 'تصميم اللوجو أسهل جزء.',
    l2: 'الـ<span class="kw">هُوِيَّة</span> إنه حدا يعرفك',
    l3: 'قبل ما يقرا اسمك',
  },
  {
    id: '05-data',
    art: 'field',
    eyebrow: 'تحليل البيانات',
    top: 'عندك أرقام كثيرة.',
    bot: 'ولا وحدة بتقولك<br>شو تعمل <span class="kw">بُكرا</span>.',
    lead: 'تعرف شو بيشتغل قبل ما تصرف أكثر.',
  },
  {
    id: '06-agents',
    art: 'stairs',
    eyebrow: 'وكلاء الذكاء الاصطناعي',
    l1: 'كل يوم بتعيد نفس الشغل بإيدك.',
    l2: 'وهو <span class="kw">بينعمل</span> لحاله.',
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
  .sig span{font-family:'Grotesk','Alexandria',sans-serif;font-size:${Math.round(W * 0.021)}px;font-weight:600;
            color:${MUTED};letter-spacing:.02em}
  .kw{color:${ACCENT}}
  svg.art{position:absolute;inset:0;width:100%;height:100%;z-index:1}
  .txt{position:absolute;z-index:4}
  h1{line-height:1.55;letter-spacing:-.012em}  /* التشكيل بده متنفس فوق الحرف */
  .eye{font-size:var(--eye);font-weight:500;color:${MUTED};letter-spacing:.08em}
`;

const grainSvg = `<svg class="grain" xmlns="http://www.w3.org/2000/svg">
  <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/></filter>
  <rect width="100%" height="100%" filter="url(#n)"/></svg>`;

const sig = () => `<div class="sig"><img src="${logo}"><span>ryanalali<b style="color:${ACCENT};font-weight:600">.me</b></span></div>`;

// فلتر توهج بإحداثيات صريحة — النِسَب بتلغي الأشكال المسطّحة (صفر ارتفاع)
const glowF = (id, W, H, dev = 9) =>
  `<filter id="${id}" filterUnits="userSpaceOnUse" x="${-W}" y="${-H}" width="${W * 3}" height="${H * 3}">
     <feGaussianBlur stdDeviation="${dev}" result="b"/>
     <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

// ═══ ١) scatter — ضجيج بلا اتجاه، وخيط واحد بيشقّه ═══
const artScatter = (W, H, band) => {
  let dashes = '';
  for (let i = 0; i < 64; i++) {
    const x = rnd(i) * W;
    const y = band[0] + rnd(i + 90) * (band[1] - band[0]);
    const a = rnd(i + 200) * Math.PI;
    const len = 7 + rnd(i + 300) * 22;
    const op = 0.08 + rnd(i + 400) * 0.24;
    dashes += `<line x1="${(x - Math.cos(a) * len).toFixed(1)}" y1="${(y - Math.sin(a) * len).toFixed(1)}"
      x2="${(x + Math.cos(a) * len).toFixed(1)}" y2="${(y + Math.sin(a) * len).toFixed(1)}"
      stroke="${ACCENT}" stroke-width="2" opacity="${op.toFixed(3)}" stroke-linecap="round"/>`;
  }
  const y0 = band[1] - (band[1] - band[0]) * 0.12;
  const y1 = band[0] + (band[1] - band[0]) * 0.2;
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="sc" gradientUnits="userSpaceOnUse" x1="0" y1="${y0}" x2="${W}" y2="${y1}">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".05"/>
        <stop offset="45%" stop-color="${ACCENT}" stop-opacity=".7"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity="1"/>
      </linearGradient>${glowF('scG', W, H, 8)}
    </defs>
    ${dashes}
    <!-- بلا عقدة نهاية هون عمداً: الخيط بيطلع برّا الكادر، وهاي هي
         الرسالة — الاستراتيجية رايحة على مكان، مش واقفة عند نقطة -->
    <path d="M -40 ${y0} C ${W * 0.3} ${y0 + 40}, ${W * 0.62} ${y1 - 30}, ${W + 40} ${y1}"
      fill="none" stroke="url(#sc)" stroke-width="3" stroke-linecap="round" filter="url(#scG)"/>
  </svg>`;
};

// ═══ ٢) gap — خطان ما بيلتقوا، والجسر الناقص بينهم ═══
const artGap = (W, H, yA) => {
  const yB = yA + H * 0.075;
  const ax = W * 0.58;
  const bx = W * 0.40;
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="gA" gradientUnits="userSpaceOnUse" x1="${W}" y1="0" x2="${ax}" y2="0">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".95"/><stop offset="100%" stop-color="${ACCENT}" stop-opacity=".9"/>
      </linearGradient>
      <linearGradient id="gB" gradientUnits="userSpaceOnUse" x1="${bx}" y1="0" x2="0" y2="0">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".5"/><stop offset="100%" stop-color="${ACCENT}" stop-opacity=".14"/>
      </linearGradient>
      <filter id="gG" filterUnits="userSpaceOnUse" x="-60" y="${yA - 140}" width="${W + 120}" height="${H * 0.3 + 280}">
        <feGaussianBlur stdDeviation="8" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <path d="M ${W} ${yA} L ${ax} ${yA}" stroke="url(#gA)" stroke-width="3" stroke-linecap="round" fill="none" filter="url(#gG)"/>
    <circle cx="${ax}" cy="${yA}" r="6" fill="${ACCENT}" filter="url(#gG)"/>
    <path d="M ${bx} ${yB} L 0 ${yB}" stroke="url(#gB)" stroke-width="3" stroke-linecap="round" fill="none" filter="url(#gG)"/>
    <circle cx="${bx}" cy="${yB}" r="4.5" fill="${ACCENT}" opacity=".55" filter="url(#gG)"/>
    <!-- الجسر اللي مش موجود: منحنى منقّط بيربط الطرفين وما بيلمسهم -->
    <path d="M ${ax - 12} ${yA} Q ${(ax + bx) / 2} ${(yA + yB) / 2} ${bx + 12} ${yB}"
      stroke="${ACCENT}" stroke-width="1.6" stroke-dasharray="1.5 20" stroke-linecap="round" fill="none" opacity=".3"/>
  </svg>`;
};

// ═══ ٣) twolines — واحد بينقطع فجأة، وواحد بيتفرّع للأبد ═══
const artTwoLines = (W, H, yTop) => {
  const yBot = yTop + H * 0.30; // مسافة واسعة: الفروع بتطلع تملا الفراغ
  const cut = W * 0.46;
  // الفروع بتكبر كل ما مشينا لليسار (= مع الوقت)، وكل فرع بيطلّع فرع صغير.
  // بترتفع باتجاه المكان اللي الإعلان تركه فاضي — هاي هي الرسالة.
  let branches = '';
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const sx = lerp(W * 0.84, W * 0.13, t);
    const rise = (H * 0.055 + H * 0.20 * t) * (0.82 + rnd(i + 7) * 0.36);
    const lean = 14 + rnd(i + 21) * 26;
    const op = (0.2 + t * 0.62).toFixed(2);
    const sw = (1.3 + t * 1.6).toFixed(2);
    const ex = sx - lean;
    const ey = yBot - rise;
    branches += `<path d="M ${sx} ${yBot} C ${sx - lean * 0.2} ${yBot - rise * 0.45}, ${ex + lean * 0.35} ${yBot - rise * 0.78}, ${ex} ${ey}"
      stroke="${ACCENT}" stroke-width="${sw}" opacity="${op}" fill="none" stroke-linecap="round" filter="url(#tlG)"/>`;
    if (i > 1) {
      const bx = sx - lean * 0.42;
      const by = yBot - rise * 0.52;
      branches += `<path d="M ${bx} ${by} C ${bx + 12} ${by - rise * 0.14}, ${bx + 26} ${by - rise * 0.2}, ${bx + 34} ${by - rise * 0.3}"
        stroke="${ACCENT}" stroke-width="${(Number(sw) * 0.6).toFixed(2)}" opacity="${(Number(op) * 0.7).toFixed(2)}" fill="none" stroke-linecap="round"/>`;
    }
    branches += `<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${(1.6 + t * 2).toFixed(1)}" fill="${ACCENT}" opacity="${op}" filter="url(#tlG)"/>`;
  }
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="tlA" gradientUnits="userSpaceOnUse" x1="${W}" y1="0" x2="${cut}" y2="0">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".9"/><stop offset="75%" stop-color="${ACCENT}" stop-opacity=".85"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity=".5"/>
      </linearGradient>
      <linearGradient id="tlB" gradientUnits="userSpaceOnUse" x1="${W}" y1="0" x2="0" y2="0">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".18"/><stop offset="100%" stop-color="${ACCENT}" stop-opacity=".95"/>
      </linearGradient>
      <filter id="tlG" filterUnits="userSpaceOnUse" x="-60" y="${yTop - 200}" width="${W + 120}" height="${H * 0.5 + 400}">
        <feGaussianBlur stdDeviation="8" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <!-- الإعلان: بيمشي وبينقطع بضربة حادة، وبعدها ولا إشي -->
    <path d="M ${W} ${yTop} L ${cut} ${yTop}" stroke="url(#tlA)" stroke-width="3.4" stroke-linecap="butt" fill="none" filter="url(#tlG)"/>
    <line x1="${cut}" y1="${yTop - 15}" x2="${cut}" y2="${yTop + 15}" stroke="${ACCENT}" stroke-width="2.4" opacity=".8" filter="url(#tlG)"/>
    <!-- الـSEO: بيبلش خفيف وبيقوى وبيطلّع فروع كل ما مشى -->
    <path d="M ${W} ${yBot} L 0 ${yBot}" stroke="url(#tlB)" stroke-width="3" stroke-linecap="round" fill="none" filter="url(#tlG)"/>
    ${branches}
  </svg>`;
};

// ═══ ٤) mark — علامة ناقصة بتنعرف قبل ما تكتمل ═══
const artMark = (W, H, cy) => {
  const cx = W * 0.5;
  const R = Math.min(W, H) * 0.19;
  // أقواس متقطّعة: العين بتكمّل الشكل لحالها
  const segs = [
    [-95, -18], [8, 62], [96, 132], [168, 196], [214, 250], [286, 330],
  ];
  const arc = (a0, a1, r, sw, op) => {
    const p = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    const large = a1 - a0 > 180 ? 1 : 0;
    return `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}"
      fill="none" stroke="${ACCENT}" stroke-width="${sw}" opacity="${op}" stroke-linecap="round" filter="url(#mkG)"/>`;
  };
  let arcs = segs.map(([a, b], i) => arc(a, b, R, 3.2, (0.35 + i * 0.11).toFixed(2))).join('');
  arcs += segs.slice(0, 4).map(([a, b], i) => arc(a + 22, b - 14, R * 0.58, 2.2, (0.18 + i * 0.08).toFixed(2))).join('');
  let ticks = '';
  for (let i = 0; i < 7; i++) {
    const a = (i * 360) / 7 - 20;
    const r0 = R * 1.22;
    const r1 = R * 1.34;
    const c = Math.cos((a * Math.PI) / 180);
    const s = Math.sin((a * Math.PI) / 180);
    ticks += `<line x1="${(cx + r0 * c).toFixed(1)}" y1="${(cy + r0 * s).toFixed(1)}"
      x2="${(cx + r1 * c).toFixed(1)}" y2="${(cy + r1 * s).toFixed(1)}"
      stroke="${ACCENT}" stroke-width="2" opacity="${(0.14 + rnd(i) * 0.3).toFixed(2)}" stroke-linecap="round"/>`;
  }
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>${glowF('mkG', W, H, 9)}
      <radialGradient id="mkC" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".16"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${R * 1.9}" fill="url(#mkC)"/>
    ${arcs}${ticks}
  </svg>`;
};

// ═══ ٥) field — حقل نقاط متساوية، ولا وحدة بتدلّك ═══
const artField = (W, H, top, bottom) => {
  const cols = 13;
  const rows = Math.max(4, Math.round(((bottom - top) / W) * cols));
  const dx = W / (cols + 1);
  const dy = (bottom - top) / (rows + 1);
  let dots = '';
  const holeC = 8;
  const holeR = Math.floor(rows / 2);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = dx * (c + 1);
      const y = top + dy * (r + 1);
      // خفوت عالأطراف عشان الحقل يحس إنه بيمتد برّا الكادر
      const edge = Math.min(1, Math.min(c, cols - 1 - c) / 3.2) * Math.min(1, Math.min(r, rows - 1 - r) / 2.2);
      const op = 0.16 + 0.34 * edge;
      if (r === holeR && c === holeC) {
        dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="none"
          stroke="${ACCENT}" stroke-width="2" opacity=".85" filter="url(#fdG)"/>`;
      } else {
        dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.1" fill="${ACCENT}" opacity="${op.toFixed(3)}"/>`;
      }
    }
  }
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>${glowF('fdG', W, H, 7)}</defs>${dots}
  </svg>`;
};

// ═══ ٦) stairs — درج بيضوي لحاله، بلا حدا يمشي عليه ═══
const artStairs = (W, H, o) => {
  const { vpx, vpy, x0, y0, hw0, n } = o;
  const P = (i) => {
    const t = i / n;
    const e = Math.pow(t, 1.28);
    return { cx: lerp(x0, vpx, e), y: lerp(y0, vpy, e), hw: lerp(hw0, W * 0.016, e), e };
  };
  let steps = '';
  for (let i = 0; i < n; i++) {
    const a = P(i);
    const b = P(i + 1);
    // ⚠️ بلا شخص هون عمداً: الرسالة «بينعمل لحاله»، فالدرج بيضوي
    //    بتتابع موجي كإنه بيشتغل بلا إيد
    const wave = 0.55 + 0.45 * Math.sin(i * 0.9 - 0.6);
    const op = (0.12 + 0.68 * a.e) * wave + 0.08;
    steps += `<polygon points="${a.cx - a.hw},${a.y} ${a.cx + a.hw},${a.y} ${b.cx + b.hw},${b.y} ${b.cx - b.hw},${b.y}"
        fill="${ACCENT}" opacity="${(op * 0.09).toFixed(3)}"/>
      <line x1="${a.cx - a.hw}" y1="${a.y}" x2="${a.cx + a.hw}" y2="${a.y}"
        stroke="${ACCENT}" stroke-width="${(2.6 - 1.7 * a.e).toFixed(2)}" opacity="${op.toFixed(3)}"
        stroke-linecap="round" filter="url(#stG)"/>`;
  }
  let rays = '';
  [[-0.5, 0.5, ACCENT, 0.14], [-0.15, 0.8, '#FFFFFF', 0.09], [0.3, 0.66, ACCENT, 0.12]].forEach(([dx, len, col, op]) => {
    rays += `<line x1="${vpx}" y1="${vpy}" x2="${vpx + dx * W * 0.9}" y2="${vpy + len * H * 0.7}"
      stroke="${col}" stroke-width="1.5" opacity="${op}" filter="url(#stG)"/>`;
  });
  return `<svg class="art" viewBox="0 0 ${W} ${H}">
    <defs>${glowF('stG', W, H, 9)}
      <radialGradient id="src" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${ACCENT}" stop-opacity=".5"/>
        <stop offset="45%" stop-color="${ACCENT}" stop-opacity=".11"/>
        <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/></radialGradient>
    </defs>
    <circle cx="${vpx}" cy="${vpy}" r="${W * 0.32}" fill="url(#src)"/>
    ${rays}${steps}
  </svg>`;
};

// ─────────────────────────────────────────────────────────────
const build = (it, size) => {
  const post = size === 'post';
  const W = 1080;
  const H = post ? 1080 : 1920;
  const pad = Math.round(W * 0.078);
  const eye = post ? 20 : 24;
  const three = !!it.l3;
  let art = '';
  let txt = '';

  const head3 = (top, fs) =>
    `<div class="txt" style="top:${top}px;right:${pad}px;left:${pad}px;text-align:right;--eye:${eye}px">
      <p class="eye" style="margin-bottom:${post ? 30 : 40}px">${it.eyebrow}</p>
      <h1 style="font-size:${fs}px;font-weight:800;padding-bottom:16px">${it.l1}<br>${it.l2}${three ? '<br>' + it.l3 : ''}</h1>
    </div>`;

  if (it.art === 'scatter') {
    art = artScatter(W, H, post ? [H * 0.52, H * 0.93] : [H * 0.55, H * 0.94]);
    txt = head3(post ? 190 : 480, post ? 72 : 84);
  } else if (it.art === 'gap') {
    const yA = post ? H * 0.45 : H * 0.47;
    const fs = post ? 64 : 76;
    art = artGap(W, H, yA);
    txt = `<div class="txt" style="top:${post ? 160 : 520}px;right:${pad}px;left:${pad}px;text-align:right;--eye:${eye}px">
        <p class="eye" style="margin-bottom:${post ? 28 : 38}px">${it.eyebrow}</p>
        <h1 style="font-size:${fs}px;font-weight:800;padding-bottom:12px">${it.top}</h1>
      </div>
      <div class="txt" style="top:${Math.round(yA + H * 0.135)}px;right:${pad}px;left:${pad}px;text-align:right">
        <h1 style="font-size:${fs}px;font-weight:800;padding-bottom:12px">${it.bot}</h1>
        <p style="font-size:${post ? 23 : 28}px;font-weight:500;color:${MUTED};margin-top:${post ? 26 : 34}px;line-height:1.85">${it.lead}</p>
      </div>`;
  } else if (it.art === 'twolines') {
    // ⚠️ ٥٤px كان بيكسر «عليه.» و«بل وبيتطوّر.» كل وحدة لحالها — الجملة طويلة
    art = artTwoLines(W, H, post ? H * 0.53 : H * 0.56);
    txt = head3(post ? 130 : 360, post ? 46 : 56);
  } else if (it.art === 'mark') {
    art = artMark(W, H, post ? H * 0.70 : H * 0.72);
    txt = head3(post ? 150 : 400, post ? 58 : 68);
  } else if (it.art === 'field') {
    const fs = post ? 62 : 74;
    // الحقل بيمتد لتحت الكادر: بيحسّس إنه الأرقام أكثر من اللي شايفه
    art = artField(W, H, post ? H * 0.52 : H * 0.56, post ? H * 0.93 : H * 0.94);
    txt = `<div class="txt" style="top:${post ? 160 : 470}px;right:${pad}px;left:${pad}px;text-align:right;--eye:${eye}px">
        <p class="eye" style="margin-bottom:${post ? 28 : 38}px">${it.eyebrow}</p>
        <h1 style="font-size:${fs}px;font-weight:800;padding-bottom:12px">${it.top}</h1>
        <h1 style="font-size:${fs}px;font-weight:800;padding-bottom:12px;margin-top:${post ? 8 : 14}px">${it.bot}</h1>
        <p style="font-size:${post ? 23 : 28}px;font-weight:500;color:${MUTED};margin-top:${post ? 26 : 34}px;line-height:1.85">${it.lead}</p>
      </div>`;
  } else {
    art = artStairs(W, H, post
      ? { vpx: W * 0.72, vpy: H * 0.46, x0: W * 0.14, y0: H * 0.99, hw0: W * 0.24, n: 10 }
      : { vpx: W * 0.70, vpy: H * 0.52, x0: W * 0.14, y0: H * 1.02, hw0: W * 0.26, n: 11 });
    txt = head3(post ? 130 : 300, post ? 56 : 62);
  }

  return `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>${base(W, H)}</style></head><body>
    <div style="position:absolute;inset:0;background:radial-gradient(70% 55% at 86% 12%, ${ACCENT}12, transparent 62%)"></div>
    ${art}${txt}<div class="vig"></div>${grainSvg}${sig()}
  </body></html>`;
};

const browser = await chromium.launch();
const only = process.argv[2] === 'preview' ? SERIES : SERIES;
for (const size of ['post', 'story']) {
  const H = size === 'post' ? 1080 : 1920;
  const page = await browser.newPage({ viewport: { width: 1080, height: H } });
  await page.route('http://post.local/**', async (route) => {
    const p = new URL(route.request().url()).pathname;
    if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
    route.fulfill({ body: '', contentType: 'text/html' });
  });
  await page.goto('http://post.local/');
  for (const it of only) {
    await page.setContent(build(it, size), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(320);
    await page.screenshot({ path: `${OUT}/${it.id}-${size}.png`, type: 'png' });
    console.log('✅', `${it.id}-${size}`);
  }
  await page.close();
}
await browser.close();
