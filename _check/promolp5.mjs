// ═══════════════════════════════════════════════════════════════
//  فيديوهات خدمتي SEO والمونتاج (2026-08-06 صباحاً)
//
//  seo: 125ث فيوتشر بيس · BPM 62 · b(n)=0.89+0.968n
//       قوس: هادي ← ثابت ← جسر منخفض 64-78 ← ذروة 94+ ← خاتمة
//  montage: 145ث دراماتيكية سريعة · BPM 160.5 · b(n)=0.01+0.374n
//       المشاهد بتقص سريع عالضربات — الشكل نفسه بيثبت الرسالة
//
//  التشغيل: node _check/promolp5.mjs seo|montage ar|en [preview]
//  المخرج: Promo-LP/video-8/9-*/final-<lang>.mp4
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, rmSync } from 'fs';
import { execSync } from 'child_process';

const LP = 'D:/Ryan-Work/Brand-Ryan/Promo-LP';
const FFMPEG = 'D:/Tools/ffmpeg/bin/ffmpeg.exe';
const FPS = 30;
const W = 1920;
const H = 1080;

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
  h1{line-height:1.4}
  .num{font-family:'Grotesk','Alexandria',sans-serif;font-weight:700;color:${ACCENT};direction:ltr}
  .center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 130px}
</style></head><body>`;

const glow = (o = 1) =>
  `<div style="position:absolute;inset:0;background:radial-gradient(60% 50% at ${isAr ? '88%' : '12%'} 6%, ${ACCENT}${Math.max(
    0,
    Math.min(255, Math.round(14 * o)),
  )
    .toString(16)
    .padStart(2, '0')}, transparent 60%)"></div>`;

const thread = (p, y = 940, o = 0.5) => {
  const len = 2200;
  return `<svg viewBox="0 0 1920 60" style="position:absolute;top:${y}px;left:0;width:100%;height:60px;opacity:${o}">
    <path d="M0,30 Q240,6 480,30 T960,30 T1440,30 T1920,30" fill="none" stroke="${ACCENT}" stroke-width="3"
      stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - easeOut(p))}"/></svg>`;
};

const tail = (t, dur) =>
  `<div style="position:absolute;inset:0;background:#000;opacity:${easeOut(w(t, dur - 1.0, dur))}"></div>`;

const ending = (t, at) => {
  const lg = easeOut(w(t, at, at + 0.9));
  const sl = easeOut(w(t, at + 2, at + 3.1));
  const slogan = isAr
    ? `تسويق <span style="color:${ACCENT}">يبني</span>، ونتائج بتنقاس <span style="color:${ACCENT}">بالأرقام</span>.`
    : `Marketing that <span style="color:${ACCENT}">builds</span>. Results you can <span style="color:${ACCENT}">measure</span>.`;
  return `${glow(1.4)}<div class="center" style="gap:46px">
    <img src="${logo}" style="width:190px;height:190px;opacity:${lg};transform:scale(${0.72 + 0.28 * lg});
         filter:drop-shadow(0 0 ${36 * lg}px ${ACCENT}66)">
    <h1 style="font-size:62px;font-weight:800;opacity:${sl}">${slogan}</h1>
    <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:40px;color:${MUTED};direction:ltr;opacity:${sl}">ryanalali<span style="color:${ACCENT}">.me</span></p>
  </div>${thread(w(t, at + 1.5, at + 7), 960, 0.55)}`;
};

// ═══ SEO 125ث · b(n)=0.89+0.968n ═══
const seoT = isAr
  ? {
      s1a: 'بتكتب اسم شغلك بجوجل…',
      s1b: 'وبتلاقي منافسك. مش إنت.',
      s2a: 'الإعلان بيوقف لما توقف تدفع.',
      s2b: 'البحث بيضل يجيبلك زباين وانت نايم.',
      s3t: 'والـ SEO مش «كلمات مفتاحية بالنص»:',
      s3: ['بنية تقنية بتنقرا صح', 'محتوى بيجاوب سؤال حقيقي', 'سرعة بتنقاس من زوار حقيقيين'],
      s4a: 'وفي شغلة جديدة:',
      s4b: 'الناس صارت تسأل ChatGPT بدل ما تبحث.',
      s4c: 'والتهيئة للـ AI صارت جزء من الشغل.',
      s5t: 'شو بيوصلك؟',
      s5: ['فحص تقني كامل', 'كلمات السوق الأردني الحقيقية', 'Schema بتطلّع نتيجتك مميزة', 'تقرير شهري بترتيبك وزوارك'],
      s6a: 'الصفحة الأولى؟ ما حدا بيقدر يضمنها.',
      s6b: 'اللي بضمنه: موقع جوجل بيفهمه وبيحترمه.',
      s7a: 'وأول ما توصل؟',
      s7b: 'زوار كل شهر، وانت نايم.',
      s8a: 'ابدأ بجلسة تشخيص مجانية.',
      s8b: 'ما تتردد، عبي الفورم واشرحلي عن مشروعك.',
    }
  : {
      s1a: 'Type your own business into Google…',
      s1b: 'and find your competitor. Not you.',
      s2a: 'Ads stop the moment you stop paying.',
      s2b: 'Search keeps bringing customers while you sleep.',
      s3t: 'And SEO is not "keywords in the text":',
      s3: ['A technical structure that reads right', 'Content that answers a real question', 'Speed measured from real visitors'],
      s4a: 'And something new:',
      s4b: 'People now ask ChatGPT instead of searching.',
      s4c: 'Optimising for AI answers is part of the job.',
      s5t: 'What you get:',
      s5: ['A full technical audit', 'Real Jordanian market keywords', 'Schema that makes your result stand out', 'A monthly report of rankings and visitors'],
      s6a: 'Page one? Nobody can guarantee it.',
      s6b: 'What I guarantee: a site Google understands and respects.',
      s7a: 'And once you get there?',
      s7b: 'Visitors every month, while you sleep.',
      s8a: 'Start with a free diagnosis.',
      s8b: 'Fill the form and tell me about your business.',
    };

const seo = (t) => {
  const DUR = 125;
  const T = seoT;
  let s = '';
  if (t < 7.67) {
    const a1 = easeOut(w(t, 1.86, 2.9));
    const a2 = easeOut(w(t, 4.76, 5.8));
    s = `${glow(0.4)}<div class="center" style="gap:52px">
      <h1 style="font-size:64px;font-weight:700;color:${MUTED};opacity:${a1}">${T.s1a}</h1>
      <h1 style="font-size:76px;font-weight:800;opacity:${a2}">${T.s1b}</h1>
    </div>`;
  } else if (t < 19.29) {
    const a1 = easeOut(w(t, 7.67, 8.5));
    const a2 = easeOut(w(t, 11.54, 12.4));
    s = `${glow(0.8)}<div class="center" style="gap:54px">
      <h1 style="font-size:64px;font-weight:700;color:${MUTED};opacity:${a1}">${T.s2a}</h1>
      <h1 style="font-size:72px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s2b}</h1>
    </div>`;
  } else if (t < 34.77) {
    const a0 = easeOut(w(t, 19.29, 20.1));
    const chips = T.s3
      .map((c, i) => {
        const p = easeOut(w(t, 21.23 + i * 2.9, 22.2 + i * 2.9));
        return `<div style="display:flex;align-items:center;gap:26px;opacity:${p};transform:translateY(${(1 - p) * 24}px)">
          <span style="width:18px;height:18px;background:${ACCENT};border-radius:50%;flex-shrink:0;
            box-shadow:0 0 20px ${ACCENT}88"></span>
          <span style="font-size:54px;font-weight:800">${c}</span></div>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:46px;align-items:flex-start;padding:0 430px">
      <p style="align-self:center;font-size:48px;color:${MUTED};opacity:${a0}">${T.s3t}</p>
      ${chips}
    </div>`;
  } else if (t < 48.31) {
    const a1 = easeOut(w(t, 34.77, 35.6));
    const a2 = easeOut(w(t, 37.67, 38.5));
    const a3 = easeOut(w(t, 41.54, 42.4));
    s = `${glow()}<div class="center" style="gap:48px">
      <p style="font-size:48px;color:${MUTED};opacity:${a1}">${T.s4a}</p>
      <h1 style="font-size:70px;font-weight:800;opacity:${a2}">${T.s4b}</h1>
      <h1 style="font-size:58px;font-weight:800;color:${ACCENT};opacity:${a3}">${T.s4c}</h1>
    </div>`;
  } else if (t < 63.8) {
    const a0 = easeOut(w(t, 48.31, 49.1));
    const chips = T.s5
      .map((c, i) => {
        const p = easeOut(w(t, 50.25 + i * 2.9, 51.2 + i * 2.9));
        return `<div style="display:flex;align-items:center;gap:26px;opacity:${p};transform:translateY(${(1 - p) * 24}px)">
          <span style="width:18px;height:18px;background:${ACCENT};border-radius:50%;flex-shrink:0;
            box-shadow:0 0 20px ${ACCENT}88"></span>
          <span style="font-size:52px;font-weight:800">${c}</span></div>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:42px;align-items:flex-start;padding:0 430px">
      <p style="align-self:center;font-size:46px;color:${MUTED};opacity:${a0}">${T.s5t}</p>
      ${chips}
    </div>`;
  } else if (t < 78.4) {
    // الجسر الهادي — الصدق المعتاد
    const a1 = easeOut(w(t, 66.0, 68.0));
    const a2 = easeOut(w(t, 71.0, 73.0));
    s = `${glow(0.35)}<div class="center" style="gap:56px">
      <h1 style="font-size:60px;font-weight:700;color:${MUTED};opacity:${a1}">${T.s6a}</h1>
      <h1 style="font-size:66px;font-weight:800;opacity:${a2}">${T.s6b}</h1>
    </div>`;
  } else if (t < 94.0) {
    const a1 = easeOut(w(t, 78.4, 79.2));
    const a2 = easeOut(w(t, 82.28, 83.1));
    s = `${glow(1.1)}<div class="center" style="gap:54px">
      <h1 style="font-size:76px;font-weight:800;opacity:${a1}">${T.s7a}</h1>
      <h1 style="font-size:84px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s7b}</h1>
    </div>${thread(w(t, 80, 91))}`;
  } else if (t < 107.5) {
    const a1 = easeOut(w(t, 94.0, 94.9));
    const a2 = easeOut(w(t, 96.9, 97.8));
    s = `${glow(0.9)}<div class="center" style="gap:48px">
      <h1 style="font-size:74px;font-weight:800;opacity:${a1}">${T.s8a}</h1>
      <div style="background:#151A0E;border:2px solid ${ACCENT}88;border-radius:22px;padding:26px 52px;
           font-size:42px;font-weight:700;opacity:${a2};transform:translateY(${(1 - a2) * 24}px);
           box-shadow:0 0 44px ${ACCENT}26">${T.s8b}</div>
    </div>`;
  } else {
    s = ending(t, 107.5);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

// ═══ المونتاج 145ث · b(n)=0.01+0.374n — قص سريع عالضربات ═══
const montT = isAr
  ? {
      s1a: 'فيديوهاتك حلوة.',
      s1b: 'بس ما حدا بيكمّلها.',
      s2a: 'أول ثانيتين بيقرروا كل إشي.',
      s3w: ['هوك', 'قصة', 'قطع', 'إيقاع', 'صوت', 'نص', 'لون', 'توقيت'],
      s4a: 'المونتاج مش قص ولصق.',
      s4b: 'هو ترتيب ما بيخلي المشاهد يلاقي لحظة يطلع فيها.',
      s5t: 'شو بيوصلك؟',
      s5: ['إيقاع مبني على نقطة التوقف', 'ترجمة موقّتة، لأنه أغلب الناس بلا صوت', 'ألوان بتطابق هويتك', 'نسخ عمودي وأفقي ومربع'],
      s6n: '290K',
      s6a: 'مشاهدة على منشور واحد.',
      s6b: 'مش حظ. إيقاع مدروس.',
      s7a: 'الفيديو اللي بيوقف الإبهام بيبيع.',
      s7b: 'واللي بينسحب عليه سكيب… كإنه ما انعمل.',
      s8a: 'ابدأ بجلسة تشخيص مجانية.',
      s8b: 'ما تتردد، عبي الفورم واشرحلي عن مشروعك.',
    }
  : {
      s1a: 'Your videos look good.',
      s1b: 'But nobody finishes them.',
      s2a: 'The first two seconds decide everything.',
      s3w: ['Hook', 'Story', 'Cut', 'Rhythm', 'Sound', 'Text', 'Colour', 'Timing'],
      s4a: 'Editing is not cut and paste.',
      s4b: 'It is ordering things so the viewer never finds a moment to leave.',
      s5t: 'What you get:',
      s5: ['Rhythm built on the drop-off point', 'Timed captions, because most people watch muted', 'Colour grading matched to your brand', 'Vertical, horizontal, and square versions'],
      s6n: '290K',
      s6a: 'views on a single post.',
      s6b: 'Not luck. Deliberate rhythm.',
      s7a: 'The video that stops the thumb sells.',
      s7b: 'The one that gets skipped… may as well not exist.',
      s8a: 'Start with a free diagnosis.',
      s8b: 'Fill the form and tell me about your business.',
    };

const montage = (t) => {
  const DUR = 145;
  const T = montT;
  const b = (n) => 0.01 + n * 0.374;
  let s = '';
  if (t < 6.0) {
    const a1 = easeOut(w(t, 0.76, 1.6));
    const a2 = easeOut(w(t, 3.0, 3.8));
    s = `${glow(0.4)}<div class="center" style="gap:52px">
      <h1 style="font-size:70px;font-weight:700;color:${MUTED};opacity:${a1}">${T.s1a}</h1>
      <h1 style="font-size:78px;font-weight:800;opacity:${a2}">${T.s1b}</h1>
    </div>`;
  } else if (t < 16.5) {
    const a = easeOut(w(t, 6.0, 6.7));
    const val = Math.max(0, 2 - Math.floor(w(t, 8.0, 13.0) * 3));
    const pulse = 1 + 0.06 * Math.pow(Math.max(0, Math.cos(((t - 6.0) / 0.374 / 2) * Math.PI)), 3);
    s = `${glow(0.8)}<div class="center" style="gap:20px">
      <p class="num" style="font-size:300px;line-height:1;opacity:${a};transform:scale(${pulse})">${val}</p>
      <h1 style="font-size:58px;font-weight:800;opacity:${easeOut(w(t, 9.0, 9.9))}">${T.s2a}</h1>
    </div>`;
  } else if (t < 38.0) {
    // القص السريع: كلمة كل ~2.6ث (7 ضربات) — الشكل بيشرح المضمون
    const seg = 2.618; // 7 ضربات
    const idx = Math.min(T.s3w.length - 1, Math.floor((t - 16.83) / seg));
    const st = 16.83 + idx * seg;
    const p = w(t, st, st + 0.25);
    const flash = 1 - w(t, st, st + 0.5) * 0.5;
    s = `${glow(0.6 + flash * 0.8)}<div class="center">
      <h1 style="font-size:${150 - idx * 2}px;font-weight:800;color:${idx % 2 ? ACCENT : TEXT};
        opacity:${easeOut(p)};transform:scale(${1.25 - 0.25 * easeOut(p)})">${T.s3w[idx]}</h1>
    </div>`;
  } else if (t < 56.0) {
    const a1 = easeOut(w(t, 38.4, 39.2));
    const a2 = easeOut(w(t, 42.15, 43.1));
    s = `${glow()}<div class="center" style="gap:54px">
      <h1 style="font-size:76px;font-weight:800;opacity:${a1}">${T.s4a}</h1>
      <h1 style="font-size:56px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s4b}</h1>
    </div>${thread(w(t, 40, 53))}`;
  } else if (t < 80.0) {
    const a0 = easeOut(w(t, 56.0, 56.8));
    const chips = T.s5
      .map((c, i) => {
        const p = easeOut(w(t, 58.25 + i * 4.49, 59.2 + i * 4.49));
        return `<div style="display:flex;align-items:center;gap:26px;opacity:${p};transform:translateY(${(1 - p) * 24}px)">
          <span style="width:18px;height:18px;background:${ACCENT};border-radius:50%;flex-shrink:0;
            box-shadow:0 0 20px ${ACCENT}88"></span>
          <span style="font-size:52px;font-weight:800">${c}</span></div>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:42px;align-items:flex-start;padding:0 400px">
      <p style="align-self:center;font-size:46px;color:${MUTED};opacity:${a0}">${T.s5t}</p>
      ${chips}
    </div>`;
  } else if (t < 98.0) {
    const p = w(t, 80.4, 83.5);
    const kk = Math.round(290 * easeOut(p));
    const a2 = easeOut(w(t, 85.5, 86.4));
    const a3 = easeOut(w(t, 89.2, 90.1));
    s = `${glow(1.1)}<div class="center" style="gap:30px">
      <p class="num" style="font-size:220px;line-height:1">${kk}K</p>
      <h1 style="font-size:56px;font-weight:800;opacity:${a2}">${T.s6a}</h1>
      <h1 style="font-size:62px;font-weight:800;color:${ACCENT};opacity:${a3}">${T.s6b}</h1>
    </div>`;
  } else if (t < 116.0) {
    const a1 = easeOut(w(t, 98.4, 99.3));
    const a2 = easeOut(w(t, 103.2, 104.1));
    s = `${glow()}<div class="center" style="gap:54px">
      <h1 style="font-size:72px;font-weight:800;opacity:${a1}">${T.s7a}</h1>
      <h1 style="font-size:64px;font-weight:800;color:${MUTED};opacity:${a2}">${T.s7b}</h1>
    </div>${thread(w(t, 100, 113))}`;
  } else if (t < 128.5) {
    const a1 = easeOut(w(t, 116.0, 116.9));
    const a2 = easeOut(w(t, 119.0, 119.9));
    s = `${glow(0.9)}<div class="center" style="gap:48px">
      <h1 style="font-size:74px;font-weight:800;opacity:${a1}">${T.s8a}</h1>
      <div style="background:#151A0E;border:2px solid ${ACCENT}88;border-radius:22px;padding:26px 52px;
           font-size:42px;font-weight:700;opacity:${a2};transform:translateY(${(1 - a2) * 24}px);
           box-shadow:0 0 44px ${ACCENT}26">${T.s8b}</div>
    </div>`;
  } else {
    s = ending(t, 128.5);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

const CONF = {
  seo: {
    dir: 'video-8-seo',
    music: 'nastelbom-electronic-electronic-bass-435079.mp3',
    fn: seo,
    dur: 125,
  },
  montage: {
    dir: 'video-9-video-editing',
    music: 'audiocoffee-dramatic-epic-technology-116642.mp3',
    fn: montage,
    dur: 145,
  },
};

const pick = CONF[service];
if (!pick) {
  console.log('حدد: node _check/promolp5.mjs seo|montage ar|en [preview]');
  process.exit(1);
}

const dir = `${LP}/${pick.dir}`;
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
  const times = service === 'seo' ? [4, 13, 27, 40, 55, 70, 85, 99, 112] : [4, 11, 25, 45, 65, 87, 105, 120, 133];
  for (const pt of times) {
    await page.setContent(pick.fn(pt), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${PV}/p5-${service}-${lang}-${pt}.png` });
  }
  await browser.close();
  console.log('✅ معاينة جاهزة');
  process.exit(0);
}

const frames = `${dir}/frames-${lang}`;
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const total = Math.round(pick.dur * FPS);
process.stdout.write(`🎬 ${service}-${lang}: ${total} إطار `);
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
    `-movflags +faststart -shortest "${dir}/final-${lang}.mp4"`,
  { stdio: 'pipe' },
);
rmSync(frames, { recursive: true, force: true });
console.log(` ✅ ${pick.dir}/final-${lang}.mp4`);
