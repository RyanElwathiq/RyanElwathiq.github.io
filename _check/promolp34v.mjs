// ═══════════════════════════════════════════════════════════════
//  النسخ العمودية 9:16 — وكلاء AI والاستراتيجية (2026-08-06)
//
//  توأم promolp3/promolp4 بنفس الضربات والنصوص، تخطيط 1080×1920:
//  تنفس أسطر عربي (1.42/1.55 — درس ريّان)، عناصر مكدسة.
//
//  التشغيل: node _check/promolp34v.mjs agents|strategy ar|en
//  المخرج: Promo-LP/video-6/7-*/final-v-<lang>.mp4
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
const w = (t, a, b) => clamp01((t - a) / (b - a));

const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const service = process.argv[2];
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
  h1{line-height:1.42}
  p{line-height:1.55}
  .center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 64px}
</style></head><body>`;

const glow = (o = 1) =>
  `<div style="position:absolute;inset:0;background:radial-gradient(70% 30% at ${isAr ? '85%' : '15%'} 4%, ${ACCENT}${Math.max(
    0,
    Math.min(255, Math.round(14 * o)),
  )
    .toString(16)
    .padStart(2, '0')}, transparent 60%)"></div>`;

const thread = (p, y = 1650, o = 0.5) => {
  const len = 1300;
  return `<svg viewBox="0 0 1080 60" style="position:absolute;top:${y}px;left:0;width:100%;height:60px;opacity:${o}">
    <path d="M0,30 Q135,6 270,30 T540,30 T810,30 T1080,30" fill="none" stroke="${ACCENT}" stroke-width="3"
      stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - easeOut(p))}"/></svg>`;
};

const tail = (t, dur) =>
  `<div style="position:absolute;inset:0;background:#000;opacity:${easeOut(w(t, dur - 1.0, dur))}"></div>`;

const ending = (t, at) => {
  const lg = easeOut(w(t, at, at + 0.8));
  const sl = easeOut(w(t, at + 1.6, at + 2.5));
  const slogan = isAr
    ? `تسويق <span style="color:${ACCENT}">يبني</span>،<br>ونتائج بتنقاس <span style="color:${ACCENT}">بالأرقام</span>.`
    : `Marketing that <span style="color:${ACCENT}">builds</span>.<br>Results you can <span style="color:${ACCENT}">measure</span>.`;
  return `${glow(1.4)}<div class="center" style="gap:56px">
    <img src="${logo}" style="width:200px;height:200px;opacity:${lg};transform:scale(${0.72 + 0.28 * lg});
         filter:drop-shadow(0 0 ${36 * lg}px ${ACCENT}66)">
    <h1 style="font-size:56px;font-weight:800;opacity:${sl}">${slogan}</h1>
    <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:40px;color:${MUTED};direction:ltr;opacity:${sl}">ryanalali<span style="color:${ACCENT}">.me</span></p>
  </div>${thread(w(t, at + 1, at + 5), 1680, 0.55)}`;
};

// ═══ وكلاء AI 105ث · b(n)=0.59+0.622n ═══
const agentsT = isAr
  ? {
      s1a: 'الساعة ٣:١٢ الفجر.',
      s1b: 'زبون بعت سؤال…',
      s1c: 'وحدا رد عليه فوراً.',
      s2: 'اسمه: وكيل ذكاء اصطناعي.',
      s3t: 'شو بيعمل؟',
      s3: ['بيرد عالاستفسارات', 'بيرتب المواعيد', 'بيتابع الزباين'],
      s4a: 'إنت بتنام، هو بيشتغل.',
      s4b: 'إنت بتبني، هو بيرتب.',
      s5t: 'ومربوط على أدواتك:',
      s5: ['واتساب', 'إيميل', 'موقعك'],
      s6a: 'الوظيفة اللي كانت بدها راتب وتدريب وشهور…',
      s6b: 'صارت نظام بيتركب بأسابيع.',
      s7a: 'جرّب «لعبة الوكيل» بنفس الصفحة:',
      s7b: 'شغّل يوم كامل، وشوف شو بيصير.',
      s8a: 'الخدمة قريباً.',
      s8b: 'سجّل بقائمة الانتظار وخذ سعر التأسيس.',
    }
  : {
      s1a: "It's 3:12 am.",
      s1b: 'A customer sent a question…',
      s1c: 'and someone replied instantly.',
      s2: "It's called an AI agent.",
      s3t: 'What does it do?',
      s3: ['Replies to enquiries', 'Books appointments', 'Follows up with customers'],
      s4a: 'You sleep, it works.',
      s4b: 'You build, it organises.',
      s5t: 'Plugged into your tools:',
      s5: ['WhatsApp', 'Email', 'Your website'],
      s6a: 'The job that needed a salary, training, and months…',
      s6b: 'is now a system installed in weeks.',
      s7a: 'Try the agent game on this page:',
      s7b: 'run a full day, and watch what happens.',
      s8a: 'Launching soon.',
      s8b: 'Join the waitlist, lock the founding price.',
    };

const agents = (t) => {
  const DUR = 105;
  const T = agentsT;
  let s = '';
  if (t < 10.54) {
    const a1 = easeOut(w(t, 0.8, 2.0));
    const a2 = easeOut(w(t, 3.3, 4.4));
    const a3 = easeOut(w(t, 6.8, 7.9));
    s = `${glow(0.4)}
      <p style="position:absolute;top:360px;left:0;width:100%;text-align:center;font-family:'Grotesk','Alexandria',sans-serif;
         font-size:88px;font-weight:700;color:${MUTED};opacity:${a1}">03:12</p>
      <div class="center" style="gap:44px;padding-top:120px">
        <div style="background:#17191E;border:2px solid #22252B;border-radius:22px;padding:28px 44px;
             font-size:40px;line-height:1.55;opacity:${a2};transform:translateY(${(1 - a2) * 26}px)">${T.s1b}</div>
        <div style="background:#151A0E;border:2px solid ${ACCENT}66;border-radius:22px;padding:28px 44px;
             font-size:40px;line-height:1.55;font-weight:700;opacity:${a3};transform:translateY(${(1 - a3) * 26}px);
             box-shadow:0 0 40px ${ACCENT}22">${T.s1c}</div>
      </div>`;
  } else if (t < 18.0) {
    const a = easeOut(w(t, 10.54, 11.1));
    const pulse = 1.1 + 0.5 * Math.pow(Math.max(0, Math.cos(((t - 10.54) / 0.622) * Math.PI * 2)), 3);
    s = `${glow(pulse)}<div class="center">
      <h1 style="font-size:76px;font-weight:800;opacity:${a};transform:scale(${1.14 - 0.14 * a})">${T.s2}</h1>
    </div>`;
  } else if (t < 28.0) {
    const a0 = easeOut(w(t, 18.0, 18.7));
    const chips = T.s3
      .map((c, i) => {
        const p = easeOut(w(t, 19.9 + i * 1.87, 20.8 + i * 1.87));
        return `<div style="display:flex;align-items:center;gap:26px;opacity:${p};transform:translateY(${(1 - p) * 24}px)">
          <span style="width:18px;height:18px;background:${ACCENT};border-radius:50%;flex-shrink:0;
            box-shadow:0 0 20px ${ACCENT}88"></span>
          <span style="font-size:50px;font-weight:800">${c}</span></div>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:52px;align-items:flex-start;padding:0 120px">
      <p style="align-self:center;font-size:44px;color:${MUTED};opacity:${a0}">${T.s3t}</p>
      ${chips}
    </div>`;
  } else if (t < 36.7) {
    const a1 = easeOut(w(t, 28.0, 28.7));
    const a2 = easeOut(w(t, 31.7, 32.4));
    s = `${glow()}<div class="center" style="gap:60px">
      <h1 style="font-size:64px;font-weight:800;opacity:${a1}">${T.s4a}</h1>
      <h1 style="font-size:64px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s4b}</h1>
    </div>${thread(w(t, 29, 35.5))}`;
  } else if (t < 47.9) {
    // الشبكة عمودياً: العقدة فوق والأدوات مثلث تحتها
    const a0 = easeOut(w(t, 36.7, 37.5));
    const node = easeOut(w(t, 38.0, 39.2));
    const pos = [
      [270, 1120],
      [810, 1120],
      [540, 1360],
    ];
    const chips = T.s5
      .map((c, i) => {
        const p = easeOut(w(t, 39.2 + i * 1.24, 40.0 + i * 1.24));
        const [x, y] = pos[i];
        return `<div style="position:absolute;left:${x}px;top:${y}px;transform:translateX(-50%) translateY(${(1 - p) * 30}px);
          border:2px solid ${ACCENT}66;border-radius:999px;padding:20px 44px;font-size:40px;font-weight:800;
          background:#12141A;opacity:${p}">${c}</div>
          <svg viewBox="0 0 1080 1920" style="position:absolute;inset:0;width:100%;height:100%;opacity:${p * 0.8}">
            <path d="M${x},${y} Q${(x + 540) / 2},${(y + 800) / 2} 540,800" fill="none" stroke="${ACCENT}" stroke-width="3"
              style="filter:drop-shadow(0 0 8px ${ACCENT}66)"/></svg>`;
      })
      .join('');
    s = `${glow()}
      <p style="position:absolute;top:420px;left:0;width:100%;text-align:center;font-size:48px;font-weight:800;opacity:${a0}">${T.s5t}</p>
      <div style="position:absolute;left:540px;top:800px;transform:translate(-50%,-50%) scale(${0.6 + 0.4 * node});
        width:150px;height:150px;border-radius:50%;background:${ACCENT};opacity:${node};
        box-shadow:0 0 ${70 * node}px ${ACCENT}77;display:grid;place-items:center">
        <img src="${logo}" style="width:90px;height:90px;filter:brightness(0)"></div>
      ${chips}`;
  } else if (t < 59.7) {
    const a1 = easeOut(w(t, 49.0, 51.0));
    const a2 = easeOut(w(t, 54.0, 56.0));
    s = `${glow(0.35)}<div class="center" style="gap:56px">
      <h1 style="font-size:52px;font-weight:700;color:${MUTED};opacity:${a1}">${T.s6a}</h1>
      <h1 style="font-size:62px;font-weight:800;opacity:${a2}">${T.s6b}</h1>
    </div>`;
  } else if (t < 71.5) {
    const a1 = easeOut(w(t, 59.7, 60.4));
    const a2 = easeOut(w(t, 62.8, 63.6));
    const pulse = 1 + 0.35 * Math.pow(Math.max(0, Math.cos(((t - 59.7) / 0.622) * Math.PI * 2)), 3);
    s = `${glow(pulse)}<div class="center" style="gap:52px">
      <h1 style="font-size:56px;font-weight:800;opacity:${a1}">${T.s7a}</h1>
      <h1 style="font-size:50px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s7b}</h1>
    </div>`;
  } else if (t < 82.0) {
    const a1 = easeOut(w(t, 71.5, 72.3));
    const a2 = easeOut(w(t, 74.0, 74.9));
    s = `${glow(1.1)}<div class="center" style="gap:48px">
      <h1 style="font-size:62px;font-weight:800;opacity:${a1}">${T.s8a}</h1>
      <div style="border:2px solid ${ACCENT};border-radius:999px;padding:26px 52px;font-size:40px;line-height:1.55;font-weight:800;
        color:${ACCENT};opacity:${a2};transform:translateY(${(1 - a2) * 24}px)">${T.s8b}</div>
    </div>`;
  } else {
    s = ending(t, 82.0);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

// ═══ الاستراتيجية 113.55ث · b(n)=0.325+0.574n ═══
const strategyT = isAr
  ? {
      s1: ['جربت بوستات يومية.', 'جربت إعلانات ممولة.', 'وجربت حتى تنزل السعر.'],
      s1d: 'ونفس النتيجة كل مرة.',
      s2a: 'المشكلة مش بالتنفيذ.',
      s2b: 'المشكلة: ما في خطة.',
      s3t: 'الاستراتيجية جواب مكتوب على:',
      s3: ['مين عميلك بالضبط؟', 'ليش يختارك إنت مش غيرك؟', 'بأي قناة بتوصله؟', 'وقديش تصرف، وعلى شو؟'],
      s4a: 'مش ملف بيقعد بالدرج.',
      s4b: 'خطة بتنفذها لحالك، أو بنفذها معك.',
      s6a: 'قبل ما تصرف دينار واحد كمان…',
      s6b: 'لازم تعرف: على مين، وليش.',
      s7t: 'شو بيوصلك؟',
      s7: ['تحليل سوق ومنافسين حقيقي', 'جمهورك: مين، وين، وشو بيوجعه', 'عرضك بجملة يفهمها العميل', 'خطة قنوات بأرقام مستهدفة'],
      s8a: 'كل قناة إلها دور.',
      s8b: 'وكل دينار إله سبب.',
      s9a: 'ابدأ بجلسة تشخيص مجانية.',
      s9b: 'ما تتردد، عبي الفورم واشرحلي عن مشروعك.',
    }
  : {
      s1: ['You tried daily posts.', 'You tried paid ads.', 'You even tried cutting prices.'],
      s1d: 'Same result, every time.',
      s2a: "The problem isn't the execution.",
      s2b: "The problem: there's no plan.",
      s3t: 'Strategy is a written answer to:',
      s3: ['Who exactly is your customer?', 'Why you, and not anyone else?', 'Which channel reaches them?', 'What to spend, and on what?'],
      s4a: 'Not a file that sits in a drawer.',
      s4b: 'A plan you run yourself, or we run together.',
      s6a: 'Before you spend one more dinar…',
      s6b: 'know who it is for, and why.',
      s7t: 'What you get:',
      s7: ['Real market and competitor analysis', 'Your audience: who, where, what hurts', 'Your offer in one clear sentence', 'A channel plan with target numbers'],
      s8a: 'Every channel has a role.',
      s8b: 'Every dinar has a reason.',
      s9a: 'Start with a free diagnosis.',
      s9b: 'Fill the form and tell me about your business.',
    };

const strategy = (t) => {
  const DUR = 113.55;
  const T = strategyT;
  let s = '';
  if (t < 18.12) {
    const chips = T.s1
      .map((c, i) => {
        const at = 1.47 + i * 3.44;
        const p = easeOut(w(t, at, at + 0.9));
        const cut = easeOut(w(t, 12.38, 13.3));
        return `<div style="position:relative;opacity:${p * (1 - cut * 0.55)};transform:translateY(${(1 - p) * 24}px)">
          <span style="font-size:46px;font-weight:700;color:${TEXT}">${c}</span>
          <span style="position:absolute;top:52%;${isAr ? 'right' : 'left'}:0;height:4px;background:${ACCENT};
            width:${cut * 100}%;box-shadow:0 0 14px ${ACCENT}88"></span>
        </div>`;
      })
      .join('');
    const d = easeOut(w(t, 12.38, 13.2));
    s = `${glow(0.4)}<div class="center" style="gap:46px">
      ${chips}
      <h1 style="font-size:56px;font-weight:800;margin-top:30px;opacity:${d};transform:translateY(${(1 - d) * 20}px)">${T.s1d}</h1>
    </div>`;
  } else if (t < 24.43) {
    const a1 = easeOut(w(t, 18.12, 18.7));
    const a2 = easeOut(w(t, 20.99, 21.6));
    const pulse = 1.1 + 0.5 * Math.pow(Math.max(0, Math.cos(((t - 18.12) / 0.574) * Math.PI * 2)), 3);
    s = `${glow(pulse)}<div class="center" style="gap:52px">
      <h1 style="font-size:62px;font-weight:800;color:${MUTED};opacity:${a1};transform:scale(${1.1 - 0.1 * a1})">${T.s2a}</h1>
      <h1 style="font-size:74px;font-weight:800;opacity:${a2};transform:scale(${1.14 - 0.14 * a2})">${T.s2b}</h1>
    </div>`;
  } else if (t < 35.35) {
    const a0 = easeOut(w(t, 24.43, 25.1));
    const chips = T.s3
      .map((c, i) => {
        const p = easeOut(w(t, 25.58 + i * 1.72, 26.5 + i * 1.72));
        return `<div style="display:flex;align-items:center;gap:24px;opacity:${p};transform:translateY(${(1 - p) * 24}px)">
          <span style="width:18px;height:18px;background:${ACCENT};border-radius:50%;flex-shrink:0;
            box-shadow:0 0 20px ${ACCENT}88"></span>
          <span style="font-size:46px;font-weight:800">${c}</span></div>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:48px;align-items:flex-start;padding:0 100px">
      <p style="align-self:center;font-size:42px;color:${MUTED};opacity:${a0}">${T.s3t}</p>
      ${chips}
    </div>`;
  } else if (t < 50.26) {
    const a1 = easeOut(w(t, 35.35, 36.0));
    const a2 = easeOut(w(t, 38.21, 38.9));
    s = `${glow()}<div class="center" style="gap:56px">
      <h1 style="font-size:56px;font-weight:800;color:${MUTED};opacity:${a1}">${T.s4a}</h1>
      <h1 style="font-size:58px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s4b}</h1>
    </div>${thread(w(t, 36.5, 47))}`;
  } else if (t < 69.78) {
    const a1 = easeOut(w(t, 53.0, 55.0));
    const a2 = easeOut(w(t, 58.5, 60.5));
    s = `${glow(0.35)}<div class="center" style="gap:56px">
      <h1 style="font-size:52px;font-weight:700;color:${MUTED};opacity:${a1}">${T.s6a}</h1>
      <h1 style="font-size:62px;font-weight:800;opacity:${a2}">${T.s6b}</h1>
    </div>`;
  } else if (t < 80.68) {
    const a0 = easeOut(w(t, 69.78, 70.4));
    const pulse = 1 + 0.45 * Math.pow(Math.max(0, Math.cos(((t - 69.78) / 0.574) * Math.PI * 2)), 3);
    const chips = T.s7
      .map((c, i) => {
        const p = easeOut(w(t, 70.35 + i * 1.72, 71.3 + i * 1.72));
        return `<div style="display:flex;align-items:center;gap:24px;opacity:${p};transform:translateY(${(1 - p) * 24}px)">
          <span style="width:18px;height:18px;background:${ACCENT};border-radius:50%;flex-shrink:0;
            box-shadow:0 0 20px ${ACCENT}88"></span>
          <span style="font-size:44px;font-weight:800">${c}</span></div>`;
      })
      .join('');
    s = `${glow(pulse)}<div class="center" style="gap:44px;align-items:flex-start;padding:0 90px">
      <p style="align-self:center;font-size:42px;color:${MUTED};opacity:${a0}">${T.s7t}</p>
      ${chips}
    </div>`;
  } else if (t < 91.02) {
    const a1 = easeOut(w(t, 80.68, 81.4));
    const a2 = easeOut(w(t, 84.13, 84.9));
    s = `${glow()}<div class="center" style="gap:56px">
      <h1 style="font-size:66px;font-weight:800;opacity:${a1}">${T.s8a}</h1>
      <h1 style="font-size:66px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s8b}</h1>
    </div>${thread(w(t, 82, 89.5))}`;
  } else if (t < 100.8) {
    const a1 = easeOut(w(t, 91.6, 92.4));
    const a2 = easeOut(w(t, 94.0, 94.9));
    s = `${glow(0.9)}<div class="center" style="gap:52px">
      <h1 style="font-size:60px;font-weight:800;opacity:${a1}">${T.s9a}</h1>
      <div style="background:#151A0E;border:2px solid ${ACCENT}88;border-radius:22px;padding:28px 48px;
           font-size:38px;line-height:1.55;font-weight:700;opacity:${a2};transform:translateY(${(1 - a2) * 24}px);
           box-shadow:0 0 44px ${ACCENT}26">${T.s9b}</div>
    </div>`;
  } else {
    s = ending(t, 100.8);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

const CONF = {
  agents: {
    dir: 'video-6-ai-agents',
    music: 'soundgalleryby-futuristic-electronic-aggressive-dark-sport-future-rave-cyberpunk-194357.mp3',
    fn: agents,
    dur: 105,
  },
  strategy: {
    dir: 'video-7-marketing-strategy',
    music: 'sigmamusicart-funk-background-198849.mp3',
    fn: strategy,
    dur: 113.55,
  },
};

const pick = CONF[service];
if (!pick) {
  console.log('حدد: node _check/promolp34v.mjs agents|strategy ar|en');
  process.exit(1);
}

const dir = `${LP}/${pick.dir}`;
const frames = `${dir}/frames-v-${lang}`;
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

// معاينة: node _check/promolp34v.mjs <svc> <lang> preview
if (process.argv[4] === 'preview') {
  const PV = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
  const times = service === 'agents' ? [5, 14, 22, 31, 42, 55, 65, 76, 90] : [8, 20, 30, 42, 61, 75, 86, 96, 106];
  for (const pt of times) {
    await page.setContent(pick.fn(pt), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${PV}/pv-${service}-${lang}-${String(pt).replace('.', '_')}.png` });
  }
  await browser.close();
  console.log('✅ معاينة جاهزة');
  process.exit(0);
}

const total = Math.round(pick.dur * FPS);
process.stdout.write(`🎬 ${service}-v-${lang}: ${total} إطار `);
for (let f = 0; f < total; f++) {
  await page.setContent(pick.fn(f / FPS), { waitUntil: f === 0 ? 'networkidle' : 'load' });
  if (f === 0) await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${frames}/f${String(f).padStart(4, '0')}.png` });
  if (f % 120 === 0) process.stdout.write('·');
}
await browser.close();

const fadeSt = (pick.dur - 1.6).toFixed(2);
execSync(
  `"${FFMPEG}" -y -framerate ${FPS} -i "${frames}/f%04d.png" -i "${dir}/${pick.music}" ` +
    `-filter_complex "[1:a]atrim=0:${pick.dur},afade=t=in:d=0.15,afade=t=out:st=${fadeSt}:d=1.6[a]" ` +
    `-map 0:v -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k ` +
    `-movflags +faststart -shortest "${dir}/final-v-${lang}.mp4"`,
  { stdio: 'pipe' },
);
rmSync(frames, { recursive: true, force: true });
console.log(` ✅ ${pick.dir}/final-v-${lang}.mp4`);
