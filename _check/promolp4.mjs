// ═══════════════════════════════════════════════════════════════
//  فيديو خدمة استراتيجية التسويق (2026-08-06) — عالفانك
//
//  113.55ث · BPM 104.5 · b(n)=0.325+0.574n
//  القوس: مقدمة هادية 0-17.5 ← جروف أول 18.1 ← جسر هادي 50.3
//  ← جروف ثاني 69.8 ← خاتمة بتخفت 102+
//  القصة: جرب كل اشي وما مشي ← ما في خطة ← السؤالين ← شو بتاخد
//  ← كل دينار إله سبب ← تشخيص مجاني ← السلوغان
//
//  التشغيل: node _check/promolp4.mjs strategy ar|en
//  المخرج: Promo-LP/video-7-marketing-strategy/final-<lang>.mp4
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

// b(n) = 0.325 + 0.574n
const strategy = (t) => {
  const DUR = 113.55;
  let s = '';
  if (t < 18.12) {
    // S1: المقدمة الهادية — ثلاث محاولات بتنشطب، والنتيجة وحدة
    const chips = T.s1
      .map((c, i) => {
        const at = 1.47 + i * 3.44; // b(2), b(8), b(14)
        const p = easeOut(w(t, at, at + 0.9));
        const cut = easeOut(w(t, 12.38, 13.3)); // الشطب لما تظهر النتيجة b(21)
        return `<div style="position:relative;opacity:${p * (1 - cut * 0.55)};transform:translateY(${(1 - p) * 24}px)">
          <span style="font-size:52px;font-weight:700;color:${TEXT}">${c}</span>
          <span style="position:absolute;top:52%;${isAr ? 'right' : 'left'}:0;height:4px;background:${ACCENT};
            width:${cut * 100}%;box-shadow:0 0 14px ${ACCENT}88"></span>
        </div>`;
      })
      .join('');
    const d = easeOut(w(t, 12.38, 13.2));
    s = `${glow(0.4)}<div class="center" style="gap:40px">
      ${chips}
      <h1 style="font-size:64px;font-weight:800;margin-top:26px;opacity:${d};transform:translateY(${(1 - d) * 20}px)">${T.s1d}</h1>
    </div>`;
  } else if (t < 24.43) {
    // S2: الدروب الأول — التشخيص
    const a1 = easeOut(w(t, 18.12, 18.7));
    const a2 = easeOut(w(t, 20.99, 21.6));
    const pulse = 1.1 + 0.5 * Math.pow(Math.max(0, Math.cos(((t - 18.12) / 0.574) * Math.PI * 2)), 3);
    s = `${glow(pulse)}<div class="center" style="gap:50px">
      <h1 style="font-size:78px;font-weight:800;color:${MUTED};opacity:${a1};transform:scale(${1.1 - 0.1 * a1})">${T.s2a}</h1>
      <h1 style="font-size:92px;font-weight:800;opacity:${a2};transform:scale(${1.14 - 0.14 * a2})">${T.s2b}</h1>
    </div>`;
  } else if (t < 35.35) {
    // S3: الأسئلة الأربعة عالضربات
    const a0 = easeOut(w(t, 24.43, 25.1));
    const chips = T.s3
      .map((c, i) => {
        const p = easeOut(w(t, 25.58 + i * 1.72, 26.5 + i * 1.72)); // b(44,47,50,53)
        return `<div style="display:flex;align-items:center;gap:26px;opacity:${p};transform:translateY(${(1 - p) * 24}px)">
          <span style="width:18px;height:18px;background:${ACCENT};border-radius:50%;flex-shrink:0;
            box-shadow:0 0 20px ${ACCENT}88"></span>
          <span style="font-size:54px;font-weight:800">${c}</span></div>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:42px;align-items:flex-start;padding:0 430px">
      <p style="align-self:center;font-size:46px;color:${MUTED};opacity:${a0}">${T.s3t}</p>
      ${chips}
    </div>`;
  } else if (t < 50.26) {
    // S4: مش ملف بالدرج
    const a1 = easeOut(w(t, 35.35, 36.0));
    const a2 = easeOut(w(t, 38.21, 38.9));
    s = `${glow()}<div class="center" style="gap:54px">
      <h1 style="font-size:72px;font-weight:800;color:${MUTED};opacity:${a1}">${T.s4a}</h1>
      <h1 style="font-size:76px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s4b}</h1>
    </div>${thread(w(t, 36.5, 47))}`;
  } else if (t < 69.78) {
    // S6: الجسر الهادي — سؤالا الصفحة (نفس تكوين جسر الوكلاء)
    const a1 = easeOut(w(t, 53.0, 55.0));
    const a2 = easeOut(w(t, 58.5, 60.5));
    s = `${glow(0.35)}<div class="center" style="gap:56px">
      <h1 style="font-size:60px;font-weight:700;color:${MUTED};opacity:${a1}">${T.s6a}</h1>
      <h1 style="font-size:72px;font-weight:800;opacity:${a2}">${T.s6b}</h1>
    </div>`;
  } else if (t < 80.68) {
    // S7: الدروب الثاني — التسليمات عالضربات
    const a0 = easeOut(w(t, 69.78, 70.4));
    const pulse = 1 + 0.45 * Math.pow(Math.max(0, Math.cos(((t - 69.78) / 0.574) * Math.PI * 2)), 3);
    const chips = T.s7
      .map((c, i) => {
        const p = easeOut(w(t, 70.35 + i * 1.72, 71.3 + i * 1.72)); // b(122,125,128,131)
        return `<div style="display:flex;align-items:center;gap:26px;opacity:${p};transform:translateY(${(1 - p) * 24}px)">
          <span style="width:18px;height:18px;background:${ACCENT};border-radius:50%;flex-shrink:0;
            box-shadow:0 0 20px ${ACCENT}88"></span>
          <span style="font-size:52px;font-weight:800">${c}</span></div>`;
      })
      .join('');
    s = `${glow(pulse)}<div class="center" style="gap:40px;align-items:flex-start;padding:0 400px">
      <p style="align-self:center;font-size:46px;color:${MUTED};opacity:${a0}">${T.s7t}</p>
      ${chips}
    </div>`;
  } else if (t < 91.02) {
    // S8: كل قناة إلها دور، وكل دينار إله سبب
    const a1 = easeOut(w(t, 80.68, 81.4));
    const a2 = easeOut(w(t, 84.13, 84.9));
    s = `${glow()}<div class="center" style="gap:54px">
      <h1 style="font-size:82px;font-weight:800;opacity:${a1}">${T.s8a}</h1>
      <h1 style="font-size:82px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s8b}</h1>
    </div>${thread(w(t, 82, 89.5))}`;
  } else if (t < 100.8) {
    // S9: الدعوة — تشخيص مجاني
    const a1 = easeOut(w(t, 91.6, 92.4));
    const a2 = easeOut(w(t, 94.0, 94.9));
    s = `${glow(0.9)}<div class="center" style="gap:48px">
      <h1 style="font-size:74px;font-weight:800;opacity:${a1}">${T.s9a}</h1>
      <div style="background:#151A0E;border:2px solid ${ACCENT}88;border-radius:22px;padding:26px 52px;
           font-size:42px;font-weight:700;opacity:${a2};transform:translateY(${(1 - a2) * 24}px);
           box-shadow:0 0 44px ${ACCENT}26">${T.s9b}</div>
    </div>`;
  } else {
    s = ending(t, 100.8);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

const CONF = {
  strategy: {
    dir: 'video-7-marketing-strategy',
    music: 'sigmamusicart-funk-background-198849.mp3',
    fn: strategy,
    dur: 113.55,
  },
};

const pick = CONF[service];
if (!pick) {
  console.log('حدد: node _check/promolp4.mjs strategy ar|en');
  process.exit(1);
}

const dir = `${LP}/${pick.dir}`;
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

// وضع المعاينة: node _check/promolp4.mjs strategy ar preview — لقطات مفتاحية بلا رندر كامل
if (process.argv[4] === 'preview') {
  const PV = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
  for (const pt of [8, 13.5, 19.5, 31, 40, 61, 76, 86, 96, 105]) {
    await page.setContent(pick.fn(pt), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${PV}/prev-${lang}-${String(pt).replace('.', '_')}.png` });
  }
  await browser.close();
  console.log('✅ معاينة جاهزة');
  process.exit(0);
}

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
