// ═══════════════════════════════════════════════════════════════
//  فيلم مقال «أول إعلان ممول» — النسخة العمودية 9:16 (2026-08-07)
//  ⚠️ مولّد آلياً من promolp7.mjs — عدّل الأصل مش هاد
//
//  125ث · BPM 60 · b(n) = n بالضبط (ضربة كل ثانية) · البار = 4ث
//  موسيقى: the_mountain — Electronic Elegant (Pixabay، الترخيص محفوظ)
//  ⚠️ الطاقة بتنزل عند 120 وبتموت عند 130، فالفيلم بيوقف 125
//     والخاتمة بتركب على الهدوء الطبيعي.
//
//  الفكرة الحاكمة: **نفس الأشكال المجرّدة اللي بتصاميم المقال،
//  بس متحركة.** العدّاد بيرسم نفسه وبيضل بلا إبرة، الخط بيطلع
//  وبيسقط للصفر أربع مرات، السهم بيطير ويصيب الهدف الغلط،
//  والغربال بينزّل تسعين نقطة ووحدة بتطلع. هيك الفيلم والتصاميم
//  بيحكوا نفس اللغة بدل ما يكونوا شغلتين منفصلتين.
//
//  التشغيل: node _check/promolp7v.mjs firstad ar|en [preview]
//  المخرج: Promo-LP/article-1-first-ad/final-<lang>.mp4
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, rmSync } from 'fs';
import { execSync } from 'child_process';

const LP = 'D:/Ryan-Work/Brand-Ryan/Promo-LP';
const FFMPEG = 'D:/Tools/ffmpeg/bin/ffmpeg.exe';
const FPS = 30;
const W = 1080;
const H = 1920;

const BG = '#0E0F12';
const ACCENT = '#D9FF3F';
const MUTED = '#A0A49B';
const TEXT = '#F2F3EE';

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOut = (x) => (clamp01(x) < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const w = (t, a, b) => clamp01((t - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const P = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];

const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const lang = process.argv[3] === 'en' ? 'en' : 'ar';
const isAr = lang === 'ar';

const head = `<!doctype html><html dir="${isAr ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${BG};overflow:hidden;position:relative;
       font-family:'${isAr ? 'Alexandria' : 'Grotesk'}','Alexandria',system-ui,sans-serif;color:${TEXT}}
  ${isAr ? '' : "h1,h2{font-family:'Grotesk','Alexandria',sans-serif;letter-spacing:-0.5px}"}
  h1{line-height:1.45}
  svg.art{position:absolute;inset:0;width:100%;height:100%}
  .center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 68px}
</style></head><body>`;

const glow = (o = 1) =>
  `<div style="position:absolute;inset:0;background:radial-gradient(60% 50% at ${isAr ? '88%' : '12%'} 6%, ${ACCENT}${Math.max(0, Math.min(255, Math.round(14 * o))).toString(16).padStart(2, '0')}, transparent 60%)"></div>`;

const tail = (t, dur) => `<div style="position:absolute;inset:0;background:#000;opacity:${easeOut(w(t, dur - 1.4, dur))}"></div>`;

const gF = (id, dev = 10) =>
  `<filter id="${id}" filterUnits="userSpaceOnUse" x="${-W}" y="${-H}" width="${W * 3}" height="${H * 3}">
     <feGaussianBlur stdDeviation="${dev}" result="b"/>
     <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

// ─────────────────────────────────────────────────────────────
//  الأشكال المتحركة — نفس مجرّدات التصاميم
// ─────────────────────────────────────────────────────────────

// العدّاد: بيرسم نفسه، وبيضل بلا إبرة للأبد
const artGauge = (p, cx, cy, R) => {
  const arcP = easeInOut(clamp01(p * 1.5));
  let ticks = '';
  for (let i = 0; i <= 32; i++) {
    const tp = clamp01((p - 0.25) * 2.2 - (i / 32) * 0.55);
    if (tp <= 0) continue;
    const a = lerp(-198, 18, i / 32);
    const major = i % 4 === 0;
    const [x0, y0] = P(cx, cy, R, a);
    const [x1, y1] = P(cx, cy, R - (major ? 26 : 13), a);
    ticks += `<line x1="${x0.toFixed(1)}" y1="${y0.toFixed(1)}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}"
      stroke="${ACCENT}" stroke-width="${major ? 3 : 1.7}" opacity="${((major ? 0.62 : 0.28) * easeOut(tp)).toFixed(3)}" stroke-linecap="round"/>`;
  }
  const [ax0, ay0] = P(cx, cy, R, -198);
  const [ax1, ay1] = P(cx, cy, R, 18);
  const len = Math.PI * R * 1.2;
  return `<svg class="art" viewBox="0 0 ${W} ${H}"><defs>${gF('gg', 9)}</defs>
    <path d="M ${ax0.toFixed(1)} ${ay0.toFixed(1)} A ${R} ${R} 0 1 1 ${ax1.toFixed(1)} ${ay1.toFixed(1)}"
      fill="none" stroke="${ACCENT}" stroke-width="3.4" stroke-linecap="round" opacity=".55"
      stroke-dasharray="${len}" stroke-dashoffset="${(len * (1 - arcP)).toFixed(1)}" filter="url(#gg)"/>
    ${ticks}
    <circle cx="${cx}" cy="${cy}" r="9" fill="none" stroke="${ACCENT}" stroke-width="2.4" opacity="${(0.5 * easeOut(clamp01((p - 0.55) * 3))).toFixed(2)}"/>
    <circle cx="${cx}" cy="${cy}" r="3" fill="${ACCENT}" opacity="${(0.85 * easeOut(clamp01((p - 0.6) * 3))).toFixed(2)}" filter="url(#gg)"/>
  </svg>`;
};

// الخط اللي بيطلع وبيسقط للصفر — بينرسم تدريجياً مع الوقت
const artSaw = (p, baseY) => {
  const segs = 4;
  const segW = W / segs;
  const total = segs;
  const done = p * total;
  let path = `M 0 ${baseY}`;
  let dots = '';
  for (let i = 0; i < segs; i++) {
    const local = clamp01(done - i);
    if (local <= 0) break;
    const x0 = i * segW;
    const peak = H * (0.16 + i * 0.028);
    const xPeak = x0 + segW * 0.82;
    const rise = clamp01(local / 0.75);
    const cxr = lerp(x0, xPeak, easeInOut(rise));
    const cyr = baseY - peak * easeInOut(rise);
    path += ` C ${x0 + (cxr - x0) * 0.35} ${baseY - (baseY - cyr) * 0.3}, ${x0 + (cxr - x0) * 0.7} ${baseY - (baseY - cyr) * 0.85}, ${cxr.toFixed(1)} ${cyr.toFixed(1)}`;
    if (local > 0.75) {
      const fall = clamp01((local - 0.75) / 0.25);
      dots += `<circle cx="${xPeak.toFixed(1)}" cy="${(baseY - peak).toFixed(1)}" r="6" fill="${ACCENT}" filter="url(#sg)"/>`;
      path += ` L ${xPeak} ${lerp(baseY - peak, baseY, easeInOut(fall)).toFixed(1)}`;
      if (fall >= 1 && i < segs - 1) path += ` L ${x0 + segW} ${baseY}`;
    }
  }
  return `<svg class="art" viewBox="0 0 ${W} ${H}"><defs>${gF('sg', 9)}</defs>
    <line x1="0" y1="${baseY}" x2="${W}" y2="${baseY}" stroke="${ACCENT}" stroke-width="1.6" opacity=".22"/>
    <path d="${path}" fill="none" stroke="${ACCENT}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" opacity=".9" filter="url(#sg)"/>
    ${dots}</svg>`;
};

// الهدفان: السهم بيطير ويصيب الصغير، والكبير بيضل معتم
const artTarget = (p, cx, cy) => {
  const sx = cx - W * 0.20;
  const sy = cy + 20;
  const sR = 74;
  const bx = cx + W * 0.22;
  const by = cy - 34;
  const bR = 150;
  const rings = (x, y, R, n, op, sw, pr) =>
    [...Array(n)].map((_, i) => {
      const q = clamp01((pr - i * 0.1) * 2);
      return q <= 0 ? '' : `<circle cx="${x}" cy="${y}" r="${(R * (1 - i / n)).toFixed(1)}" fill="none"
        stroke="${ACCENT}" stroke-width="${sw}" opacity="${(op * (1 - i * 0.12) * easeOut(q)).toFixed(3)}"/>`;
    }).join('');
  const fly = easeInOut(clamp01((p - 0.45) / 0.35));
  const ax = lerp(sx + sR * 3.4, sx + 4, fly);
  const ay = lerp(sy - sR * 6.2, sy - 6, fly);
  const hit = clamp01((p - 0.78) * 5);
  return `<svg class="art" viewBox="0 0 ${W} ${H}"><defs>${gF('tg', 9)}</defs>
    ${rings(bx, by, bR, 4, 0.13, 2.4, clamp01(p * 1.6))}
    ${rings(sx, sy, sR, 3, 0.85, 2.8, clamp01(p * 2))}
    ${fly > 0 ? `<line x1="${(ax + 120).toFixed(1)}" y1="${(ay - 44).toFixed(1)}" x2="${ax.toFixed(1)}" y2="${ay.toFixed(1)}"
      stroke="${ACCENT}" stroke-width="3" stroke-linecap="round" opacity="${(0.9 * fly).toFixed(2)}" filter="url(#tg)"/>` : ''}
    <circle cx="${sx}" cy="${sy}" r="${(5 + 14 * hit).toFixed(1)}" fill="${ACCENT}" opacity="${(1 - hit * 0.55).toFixed(2)}" filter="url(#tg)"/>
  </svg>`;
};

// الغربال: النقاط بتنزل وبتضيق، ووحدة بتطلع
const artSieve = (p, cx, top, neckY) => {
  const mouth = W * 0.30;
  // ⚠️ أول نسخة كل النقاط كانت تنزل بنفس اللحظة، فبآخر المشهد
  //    بتتكوّم كلها بالرقبة وبتضيع فكرة «الكثرة». هون كل نقطة إلها
  //    طور خاص وبتدور بحلقة، فبأي لحظة في نقاط بكل ارتفاع = تيار.
  let dots = '';
  const gate = easeOut(clamp01(p * 3)); // بيفتح الحنفية بالتدريج
  for (let i = 0; i < 90; i++) {
    const phase = rnd(i);
    const t = (p * 1.45 + phase) % 1;
    if (rnd(i + 200) > gate) continue;
    const y = lerp(top, neckY - 26, t);
    const spread = lerp(mouth, W * 0.012, Math.pow(t, 1.5));
    const x = cx + (rnd(i + 40) - 0.5) * 2 * spread;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(2.6 + rnd(i + 80) * 2.8).toFixed(1)}"
      fill="${ACCENT}" opacity="${(0.26 + (1 - t) * 0.34).toFixed(3)}"/>`;
  }
  const out = easeOut(clamp01((p - 0.72) * 3.6));
  return `<svg class="art" viewBox="0 0 ${W} ${H}"><defs>${gF('vg', 9)}</defs>
    <path d="M ${cx - mouth} ${top} L ${cx - 22} ${neckY}" stroke="${ACCENT}" stroke-width="2.4" opacity=".3" fill="none"/>
    <path d="M ${cx + mouth} ${top} L ${cx + 22} ${neckY}" stroke="${ACCENT}" stroke-width="2.4" opacity=".3" fill="none"/>
    ${dots}
    <circle cx="${cx}" cy="${(neckY + 54).toFixed(1)}" r="${(9 * out).toFixed(1)}" fill="${ACCENT}" filter="url(#vg)"/>
    <circle cx="${cx}" cy="${(neckY + 54).toFixed(1)}" r="${(26 * out).toFixed(1)}" fill="none" stroke="${ACCENT}" stroke-width="1.6" opacity="${(0.4 * out).toFixed(2)}"/>
  </svg>`;
};

// ─────────────────────────────────────────────────────────────
const T = isAr
  ? {
      s1a: 'كبست زر الترويج.',
      s1b: 'صرفت. وما طلع بإيدك إشي تقدر تقراه.',
      s2a: 'زر الترويج مش حملة.',
      s2b: 'البوست بيكبّر انتشار محتوى اشتغل.',
      s2c: 'والحملة بتبلّش من هدف مربوط بمبيعات.',
      s3a: 'بلا قياس، إنت مش عم تعلن.',
      s3b: 'إنت عم تدفع لناس تشوفك وتتمنّى الخير.',
      s4t: 'قبل ما تصرف أول قرش:',
      s4: ['ملكية الحسابات باسمك إنت', 'بكسل وحدث واحد بيعني فلوس', 'هدف مبيعات مش تفاعل', 'وعد مش وصف'],
      s5a: 'طلبت تفاعل؟',
      s5b: 'بيجيبلك ناس بتحب تتفاعل وما بتشتري.',
      s6a: 'أول أيام الحملة النظام بيتعلّم.',
      s6b: 'وكل تعديل بترجّعه للصفر.',
      s7a: 'رقم واحد بيقرر:',
      s7b: 'تكلفة النتيجة الواحدة.',
      s8a: 'المقال كامل بالموقع، ومعه «طبيب الإعلانات».',
      s8b: 'الصق نص إعلانك وشوف التشخيص.',
    }
  : {
      s1a: 'You hit the boost button.',
      s1b: 'You spent. And got nothing you could read.',
      s2a: 'Boosting is not a campaign.',
      s2b: 'A boost widens reach for content that already worked.',
      s2c: 'A campaign starts from a goal tied to sales.',
      s3a: "Without measurement, you're not advertising.",
      s3b: "You're paying people to see you, and hoping.",
      s4t: 'Before you spend a single coin:',
      s4: ['Own the accounts in your own name', 'One pixel, one event that means money', 'A sales goal, not engagement', 'A promise, not a description'],
      s5a: 'You asked for engagement?',
      s5b: 'You get people who love engaging and never buy.',
      s6a: 'In the first days the system is learning.',
      s6b: 'And every edit sends it back to zero.',
      s7a: 'One number decides:',
      s7b: 'the cost of a single result.',
      s8a: 'The full guide is on the site, with the Ad Doctor.',
      s8b: 'Paste your ad copy and see the diagnosis.',
    };

const ending = (t, at) => {
  const lg = easeOut(w(t, at, at + 1.4));
  const sl = easeOut(w(t, at + 2.6, at + 4.0));
  const slogan = isAr
    ? `تسويق <span style="color:${ACCENT}">يبني</span>، ونتائج بتنقاس <span style="color:${ACCENT}">بالأرقام</span>.`
    : `Marketing that <span style="color:${ACCENT}">builds</span>. Results you can <span style="color:${ACCENT}">measure</span>.`;
  return `${glow(1.4)}<div class="center" style="gap:48px">
    <img src="${logo}" style="width:170px;height:170px;opacity:${lg};transform:scale(${0.74 + 0.26 * lg});
         filter:drop-shadow(0 0 ${36 * lg}px ${ACCENT}66)">
    <h1 style="font-size:50px;font-weight:800;opacity:${sl}">${slogan}</h1>
    <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:34px;color:${MUTED};direction:ltr;opacity:${sl}">ryanalali<span style="color:${ACCENT}">.me</span></p>
  </div>`;
};

// b(n) = n — ضربة كل ثانية بالضبط
const firstad = (t) => {
  const DUR = 125;
  let s = '';

  if (t < 12) {
    // S1 — الهوك عالمقدمة الهادية
    const a1 = easeOut(w(t, 3, 4.4));
    const a2 = easeOut(w(t, 7, 8.4));
    s = `${glow(0.32)}<div class="center" style="gap:54px">
      <h1 style="font-size:64px;font-weight:800;opacity:${a1};transform:translateY(${(1 - a1) * 26}px)">${T.s1a}</h1>
      <h1 style="font-size:48px;font-weight:700;color:${MUTED};opacity:${a2};transform:translateY(${(1 - a2) * 22}px)">${T.s1b}</h1>
    </div>`;
  } else if (t < 28) {
    // S2 — الفرق الجوهري
    const a1 = easeOut(w(t, 12, 13.4));
    const a2 = easeOut(w(t, 17, 18.4));
    const a3 = easeOut(w(t, 22, 23.4));
    s = `${glow(0.6)}<div class="center" style="gap:46px">
      <h1 style="font-size:70px;font-weight:800;opacity:${a1};transform:scale(${1.06 - 0.06 * a1})">${T.s2a}</h1>
      <h1 style="font-size:44px;font-weight:700;color:${MUTED};opacity:${a2}">${T.s2b}</h1>
      <h1 style="font-size:48px;font-weight:800;color:${ACCENT};opacity:${a3}">${T.s2c}</h1>
    </div>`;
  } else if (t < 46) {
    // S3 — العدّاد بلا إبرة (نفس مجرّد التصميم، متحرك)
    const a1 = easeOut(w(t, 28, 29.4));
    const a2 = easeOut(w(t, 33, 34.6));
    s = `${glow(0.8)}${artGauge(w(t, 30, 43), W * 0.5, H * 0.72, 250)}
      <div style="position:absolute;top:300px;left:0;width:100%;text-align:center;padding:0 60px">
        <h1 style="font-size:60px;font-weight:800;opacity:${a1}">${T.s3a}</h1>
        <h1 style="font-size:46px;font-weight:700;color:${ACCENT};margin-top:26px;opacity:${a2}">${T.s3b}</h1>
      </div>`;
  } else if (t < 70) {
    // S4 — الخطوات عالضربات (ذروة الطاقة)
    const a0 = easeOut(w(t, 46, 47.2));
    const chips = T.s4
      .map((c, i) => {
        const at = 49 + i * 4;
        const p = easeOut(w(t, at, at + 1.3));
        return `<div style="display:flex;align-items:center;gap:28px;opacity:${p};transform:translateY(${(1 - p) * 24}px)">
          <span style="width:18px;height:18px;background:${ACCENT};border-radius:50%;flex-shrink:0;box-shadow:0 0 22px ${ACCENT}88"></span>
          <span style="font-size:46px;font-weight:800">${c}</span></div>`;
      })
      .join('');
    s = `${glow(1)}<div class="center" style="gap:40px;align-items:flex-start;padding:0 80px">
      <p style="align-self:center;font-size:40px;color:${MUTED};opacity:${a0};margin-bottom:12px">${T.s4t}</p>
      ${chips}
    </div>`;
  } else if (t < 86) {
    // S5 — الهدف الغلط
    const a1 = easeOut(w(t, 70, 71.4));
    const a2 = easeOut(w(t, 75, 76.6));
    s = `${glow(0.9)}${artTarget(w(t, 71, 84), W * 0.5, H * 0.70)}
      <div style="position:absolute;top:290px;left:0;width:100%;text-align:center;padding:0 60px">
        <h1 style="font-size:62px;font-weight:800;color:${ACCENT};opacity:${a1}">${T.s5a}</h1>
        <h1 style="font-size:46px;font-weight:700;margin-top:24px;opacity:${a2}">${T.s5b}</h1>
      </div>`;
  } else if (t < 100) {
    // S6 — التعلّم بيرجع للصفر
    const a1 = easeOut(w(t, 86, 87.4));
    const a2 = easeOut(w(t, 91, 92.6));
    s = `${glow(0.7)}${artSaw(w(t, 87, 99), H * 0.84)}
      <div style="position:absolute;top:320px;left:0;width:100%;text-align:center;padding:0 60px">
        <h1 style="font-size:58px;font-weight:800;opacity:${a1}">${T.s6a}</h1>
        <h1 style="font-size:54px;font-weight:800;color:${ACCENT};margin-top:24px;opacity:${a2}">${T.s6b}</h1>
      </div>`;
  } else if (t < 113) {
    // S7 — الغربال: رقم واحد بيقرر
    const a1 = easeOut(w(t, 100, 101.4));
    const a2 = easeOut(w(t, 104, 105.6));
    s = `${glow(0.9)}${artSieve(w(t, 100.5, 112), W * 0.5, H * 0.44, H * 0.82)}
      <div style="position:absolute;top:290px;left:0;width:100%;text-align:center;padding:0 60px">
        <h1 style="font-size:54px;font-weight:700;color:${MUTED};opacity:${a1}">${T.s7a}</h1>
        <h1 style="font-size:64px;font-weight:800;color:${ACCENT};margin-top:20px;opacity:${a2}">${T.s7b}</h1>
      </div>`;
  } else if (t < 121) {
    // S8 — الدعوة
    const a1 = easeOut(w(t, 113, 114.4));
    const a2 = easeOut(w(t, 116, 117.4));
    s = `${glow(1.1)}<div class="center" style="gap:50px">
      <h1 style="font-size:52px;font-weight:800;opacity:${a1}">${T.s8a}</h1>
      <div style="background:#151A0E;border:2px solid ${ACCENT}88;border-radius:22px;padding:28px 56px;
           font-size:38px;font-weight:700;opacity:${a2};transform:translateY(${(1 - a2) * 24}px);
           box-shadow:0 0 46px ${ACCENT}26">${T.s8b}</div>
    </div>`;
  } else {
    s = ending(t, 121);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

const CONF = {
  firstad: {
    dir: 'article-1-first-ad',
    music: 'Music/the_mountain-electronic-elegant-155584.mp3',
    fn: firstad,
    dur: 125,
  },
};

const pick = CONF[process.argv[2]];
if (!pick) { console.log('حدد: node _check/promolp7.mjs firstad ar|en [preview]'); process.exit(1); }

const dir = `${LP}/${pick.dir}`;
mkdirSync(dir, { recursive: true });
const frames = `${dir}/frames-${lang}`;
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');

if (process.argv[4] === 'preview') {
  const PV = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
  for (const pt of [9, 24, 40, 62, 82, 97, 110, 118, 124]) {
    await page.setContent(pick.fn(pt), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${PV}/fav-${lang}-${pt}.png` });
  }
  await browser.close();
  console.log('✅ معاينة جاهزة');
  process.exit(0);
}

const total = Math.round(pick.dur * FPS);
process.stdout.write(`🎬 firstad-${lang}: ${total} إطار `);
for (let f = 0; f < total; f++) {
  await page.setContent(pick.fn(f / FPS), { waitUntil: f === 0 ? 'networkidle' : 'load' });
  if (f === 0) await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${frames}/f${String(f).padStart(4, '0')}.png` });
  if (f % 300 === 0) process.stdout.write('·');
}
await browser.close();

const fadeSt = (pick.dur - 2.0).toFixed(2);
execSync(
  `"${FFMPEG}" -y -framerate ${FPS} -i "${frames}/f%04d.png" -i "${LP}/${pick.music}" ` +
    `-filter_complex "[1:a]atrim=0:${pick.dur},afade=t=in:d=0.3,afade=t=out:st=${fadeSt}:d=2.0[a]" ` +
    `-map 0:v -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k ` +
    `-movflags +faststart -shortest "${dir}/final-v-${lang}.mp4"`,
  { stdio: 'pipe' },
);
rmSync(frames, { recursive: true, force: true });
console.log(` ✅ ${pick.dir}/final-v-${lang}.mp4`);
