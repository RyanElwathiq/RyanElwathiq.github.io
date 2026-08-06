// ═══════════════════════════════════════════════════════════════
//  الفيلم الثاني — «فيلم الأرقام» (2026-08-06)
//
//  الفكرة: قصة السوق الأردني بأرقامنا الحقيقية المدفوعة —
//  DataForSEO (البحث الشهري) + مصيدة الموقع الغايب (خرائط جوجل).
//  112ث عالملحمية · BPM 89 · b(n)=0.60+0.674n
//  القوس: مقدمة هادية 0-8.5 ← دفع ثابت ← السلوغان كخلاصة منطقية
//
//  التشغيل: node _check/promofilm2.mjs numbers ar|en [preview]
//  المخرج: Promo-LP/film-2-numbers/final-<lang>.mp4
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

const T = isAr
  ? {
      s1a: 'قبل ما نحكي عن التسويق…',
      s1b: 'خلينا نحكي أرقام.',
      s2t: 'كل شهر بالأردن:',
      s2: [
        [480, 'حدا بيدور على شركة تسويق الكتروني'],
        [320, 'بيكتبوا: تسويق الكتروني'],
        [170, 'بدهم ينشئوا موقع الكتروني'],
      ],
      s3t: 'وبنفس الوقت، بعمّان:',
      s3: [
        [26, 'من أنجح المطاعم… بلا موقع'],
        [46, 'من أنجح الصالونات… بلا موقع'],
        [34, 'من عيادات الأسنان… بلا موقع'],
      ],
      s3c: 'في مطعم بـ ١٧ ألف مراجعة، وما إله موقع.',
      s4a: 'الطلب موجود.',
      s4b: 'العرض غايب.',
      s5a: 'وهاي مش آراء ولا إحساس.',
      s5b: 'هاي بيانات مدفوعة، من السوق نفسه.',
      s6t: 'وهيك بشتغل:',
      s6: ['بشخّص بالأرقام قبل أي قرش', 'ببني اللي السوق بيطلبه فعلاً', 'بقيس كل خطوة بعد التنفيذ'],
      s7a: 'مشروعك يا بيكون من اللي بيدوروا…',
      s7b: 'يا من اللي ما حدا بيلاقيهم.',
      s8a: 'ابدأ بجلسة تشخيص مجانية.',
      s8b: 'وخلي قراراتك الجاية كلها بالأرقام.',
    }
  : {
      s1a: 'Before we talk about marketing…',
      s1b: "let's talk numbers.",
      s2t: 'Every month in Jordan:',
      s2: [
        [480, 'people search for a digital marketing company'],
        [320, 'type: digital marketing'],
        [170, 'want a website built'],
      ],
      s3t: 'Meanwhile, in Amman:',
      s3: [
        [26, 'of the top restaurants… have no website'],
        [46, 'of the top salons… have no website'],
        [34, 'of dental clinics… have no website'],
      ],
      s3c: "There's a restaurant with 17,000 reviews and no website.",
      s4a: 'The demand is there.',
      s4b: 'The supply is missing.',
      s5a: 'And this is not opinion or gut feeling.',
      s5b: 'This is paid data, from the market itself.',
      s6t: 'And this is how I work:',
      s6: ['Diagnose with numbers before any spend', 'Build what the market actually asks for', 'Measure every step after it ships'],
      s7a: 'Your business is either among those being searched for…',
      s7b: 'or among those nobody can find.',
      s8a: 'Start with a free diagnosis.',
      s8b: 'And make your next decisions with numbers.',
    };

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

// عداد بيصعد للرقم المستهدف
const count = (target, p) => Math.round(target * easeOut(p));

const numbers = (t) => {
  const DUR = 112;
  let s = '';
  if (t < 8.69) {
    // المقدمة الهادية — b(3)=2.62 · b(7)=5.32
    const a1 = easeOut(w(t, 2.62, 3.6));
    const a2 = easeOut(w(t, 5.32, 6.3));
    s = `${glow(0.4)}<div class="center" style="gap:52px">
      <h1 style="font-size:64px;font-weight:700;color:${MUTED};opacity:${a1}">${T.s1a}</h1>
      <h1 style="font-size:84px;font-weight:800;opacity:${a2}">${T.s1b}</h1>
    </div>`;
  } else if (t < 22.17) {
    // شلال البحث الشهري — العناوين عالضربات b(12)=8.69، الصفوف كل ضربتين×3
    const a0 = easeOut(w(t, 8.69, 9.4));
    const rowsH = T.s2
      .map(([n, label], i) => {
        const at = 10.71 + i * 2.7; // b(15,19,23)
        const p = w(t, at, at + 1.6);
        const a = easeOut(w(t, at, at + 0.7));
        return `<div style="display:flex;align-items:baseline;gap:36px;opacity:${a};transform:translateY(${(1 - a) * 26}px)">
          <span class="num" style="font-size:120px;line-height:1">${count(n, p)}</span>
          <span style="font-size:44px;font-weight:700">${label}</span></div>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:54px;align-items:flex-start;padding:0 280px">
      <p style="align-self:center;font-size:50px;color:${MUTED};opacity:${a0}">${T.s2t}</p>
      ${rowsH}
    </div>`;
  } else if (t < 35.65) {
    // مصيدة الموقع الغايب — نسب بأشرطة b(32)=22.17
    const a0 = easeOut(w(t, 22.17, 22.9));
    const bars = T.s3
      .map(([n, label], i) => {
        const at = 23.5 + i * 2.7;
        const p = w(t, at, at + 1.5);
        const a = easeOut(w(t, at, at + 0.7));
        return `<div style="width:100%;opacity:${a}">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px">
            <span style="font-size:42px;font-weight:700">${label}</span>
            <span class="num" style="font-size:76px;line-height:1">${count(n, p)}%</span></div>
          <div style="height:14px;background:#1B1E24;border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${easeOut(p) * n}%;background:${ACCENT};border-radius:99px;
              box-shadow:0 0 18px ${ACCENT}66"></div></div></div>`;
      })
      .join('');
    const c = easeOut(w(t, 32.3, 33.2));
    s = `${glow()}<div class="center" style="gap:44px;padding:0 320px">
      <p style="font-size:50px;color:${MUTED};opacity:${a0}">${T.s3t}</p>
      ${bars}
      <h1 style="font-size:46px;font-weight:800;color:${ACCENT};margin-top:8px;opacity:${c}">${T.s3c}</h1>
    </div>`;
  } else if (t < 46.43) {
    // الفجوة b(52)=35.65 · b(57)=39.02
    const a1 = easeOut(w(t, 35.65, 36.4));
    const a2 = easeOut(w(t, 39.02, 39.8));
    s = `${glow()}<div class="center" style="gap:54px">
      <h1 style="font-size:92px;font-weight:800;opacity:${a1}">${T.s4a}</h1>
      <h1 style="font-size:92px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s4b}</h1>
    </div>${thread(w(t, 37, 45))}`;
  } else if (t < 58.56) {
    // مصدر البيانات b(68)=46.43 · b(73)=49.80
    const a1 = easeOut(w(t, 46.43, 47.2));
    const a2 = easeOut(w(t, 49.8, 50.6));
    s = `${glow(0.7)}<div class="center" style="gap:56px">
      <h1 style="font-size:64px;font-weight:700;color:${MUTED};opacity:${a1}">${T.s5a}</h1>
      <h1 style="font-size:72px;font-weight:800;opacity:${a2}">${T.s5b}</h1>
    </div>`;
  } else if (t < 72.04) {
    // منهج الشغل — b(86)=58.56، رقائق كل ضربتين
    const a0 = easeOut(w(t, 58.56, 59.3));
    const chips = T.s6
      .map((c, i) => {
        const p = easeOut(w(t, 60.58 + i * 2.7, 61.5 + i * 2.7));
        return `<div style="display:flex;align-items:center;gap:26px;opacity:${p};transform:translateY(${(1 - p) * 24}px)">
          <span style="width:18px;height:18px;background:${ACCENT};border-radius:50%;flex-shrink:0;
            box-shadow:0 0 20px ${ACCENT}88"></span>
          <span style="font-size:54px;font-weight:800">${c}</span></div>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:46px;align-items:flex-start;padding:0 430px">
      <p style="align-self:center;font-size:48px;color:${MUTED};opacity:${a0}">${T.s6t}</p>
      ${chips}
    </div>`;
  } else if (t < 84.17) {
    // القلبة — b(106)=72.04 · b(111)=75.41
    const a1 = easeOut(w(t, 72.04, 72.9));
    const a2 = easeOut(w(t, 75.41, 76.3));
    s = `${glow()}<div class="center" style="gap:54px">
      <h1 style="font-size:66px;font-weight:800;opacity:${a1}">${T.s7a}</h1>
      <h1 style="font-size:66px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s7b}</h1>
    </div>${thread(w(t, 73.5, 82.5))}`;
  } else if (t < 96.31) {
    // الدعوة — b(124)=84.17 · b(129)=87.55
    const a1 = easeOut(w(t, 84.17, 85.0));
    const a2 = easeOut(w(t, 87.55, 88.4));
    s = `${glow(0.9)}<div class="center" style="gap:48px">
      <h1 style="font-size:74px;font-weight:800;opacity:${a1}">${T.s8a}</h1>
      <div style="background:#151A0E;border:2px solid ${ACCENT}88;border-radius:22px;padding:26px 52px;
           font-size:42px;font-weight:700;opacity:${a2};transform:translateY(${(1 - a2) * 24}px);
           box-shadow:0 0 44px ${ACCENT}26">${T.s8b}</div>
    </div>`;
  } else {
    s = ending(t, 96.31);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

const CONF = {
  numbers: {
    dir: 'film-2-numbers',
    music: 'playsound-epic-abstract-technology-141199.mp3',
    fn: numbers,
    dur: 112,
  },
};

const pick = CONF[service];
if (!pick) {
  console.log('حدد: node _check/promofilm2.mjs numbers ar|en [preview]');
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
  for (const pt of [6, 16, 30, 40, 52, 65, 78, 90, 101]) {
    await page.setContent(pick.fn(pt), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${PV}/f2-${lang}-${pt}.png` });
  }
  await browser.close();
  console.log('✅ معاينة جاهزة');
  process.exit(0);
}

const frames = `${dir}/frames-${lang}`;
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });

const total = Math.round(pick.dur * FPS);
process.stdout.write(`🎬 numbers-${lang}: ${total} إطار `);
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
