// ═══════════════════════════════════════════════════════════════
//  النسخة العمودية 9:16 لفيديو الاستشارة والتدريب (2026-08-06)
//
//  توأم promolp6 بنفس الضربات ونفس النصوص، تخطيط 1080×1920.
//  تنفس أسطر عربي 1.42/1.55 (درس ريّان) وأحجام أصغر لأن العرض أضيق.
//
//  التشغيل: node _check/promolp6v.mjs consulting ar|en [preview]
//  المخرج: Promo-LP/video-10-consulting/final-v-<lang>.mp4
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
  .center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 68px}
</style></head><body>`;

const glow = (o = 1) =>
  `<div style="position:absolute;inset:0;background:radial-gradient(70% 30% at ${isAr ? '85%' : '15%'} 4%, ${ACCENT}${Math.max(
    0,
    Math.min(255, Math.round(14 * o)),
  )
    .toString(16)
    .padStart(2, '0')}, transparent 60%)"></div>`;

const thread = (p, y = 1620, o = 0.5) => {
  const len = 1300;
  return `<svg viewBox="0 0 1080 60" style="position:absolute;top:${y}px;left:0;width:100%;height:56px;opacity:${o}">
    <path d="M0,30 Q135,6 270,30 T540,30 T810,30 T1080,30" fill="none" stroke="${ACCENT}" stroke-width="3"
      stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - easeOut(p))}"/></svg>`;
};

const tail = (t, dur) =>
  `<div style="position:absolute;inset:0;background:#000;opacity:${easeOut(w(t, dur - 1.2, dur))}"></div>`;

const T = isAr
  ? {
      s1a: 'بتدفع لوكالة كل شهر.',
      s1b: 'وحاسس إنك بتقدر تعملها بنفسك.',
      s2a: 'أحياناً مش ناقصك موظّف.',
      s2b: 'ناقصك حدا يفهّمك.',
      s3a: 'بالاستشارة بتدفع مقابل المعرفة.',
      s3b: 'وبتضل معك.',
      s4t: 'بالجلسة:',
      s4: ['نشوف وين المشكلة فعلاً', 'تدريب على حسابك انت', 'قائمة مهام مرتّبة بالأولوية', 'تسجيل ومواد بتضل معك'],
      s5a: 'التنفيذ بيصير عندك.',
      s5b: 'مش عند حدا ثاني.',
      s6a: 'ابدأ بجلسة تشخيص مجانية.',
      s6b: 'احكيلي عن مشروعك.',
    }
  : {
      s1a: 'You pay an agency every month.',
      s1b: 'And you feel you could do it yourself.',
      s2a: "Sometimes you don't need another hire.",
      s2b: 'You need someone to explain it.',
      s3a: 'In consulting you pay for the knowledge.',
      s3b: 'And it stays with you.',
      s4t: 'In the session:',
      s4: ['We find where the problem really is', 'Training on your own account', 'A task list in priority order', 'A recording and notes that stay'],
      s5a: 'The execution becomes yours.',
      s5b: "Not somebody else's.",
      s6a: 'Start with a free diagnosis.',
      s6b: 'Tell me about your business.',
    };

const ending = (t, at) => {
  const lg = easeOut(w(t, at, at + 1.1));
  const sl = easeOut(w(t, at + 2.2, at + 3.4));
  const slogan = isAr
    ? `تسويق <span style="color:${ACCENT}">يبني</span>، ونتائج بتنقاس <span style="color:${ACCENT}">بالأرقام</span>.`
    : `Marketing that <span style="color:${ACCENT}">builds</span>. Results you can <span style="color:${ACCENT}">measure</span>.`;
  return `${glow(1.4)}<div class="center" style="gap:52px">
    <img src="${logo}" style="width:170px;height:170px;opacity:${lg};transform:scale(${0.72 + 0.28 * lg});
         filter:drop-shadow(0 0 ${34 * lg}px ${ACCENT}66)">
    <h1 style="font-size:56px;font-weight:800;opacity:${sl}">${slogan}</h1>
    <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:36px;color:${MUTED};direction:ltr;opacity:${sl}">ryanalali<span style="color:${ACCENT}">.me</span></p>
  </div>${thread(w(t, at + 1.8, at + 7.5), 1650, 0.55)}`;
};

// b(n) = 0.57 + 0.622n — نفس توقيتات النسخة الأفقية بالضبط
const consulting = (t) => {
  const DUR = 61.5;
  let s = '';
  if (t < 8.03) {
    const a1 = easeOut(w(t, 3.06, 4.3));
    const a2 = easeOut(w(t, 5.55, 6.8));
    s = `${glow(0.35)}<div class="center" style="gap:48px">
      <h1 style="font-size:66px;font-weight:800;opacity:${a1};transform:translateY(${(1 - a1) * 26}px)">${T.s1a}</h1>
      <h1 style="font-size:54px;font-weight:700;color:${MUTED};opacity:${a2};transform:translateY(${(1 - a2) * 22}px)">${T.s1b}</h1>
    </div>`;
  } else if (t < 15.5) {
    const a1 = easeOut(w(t, 8.03, 9.2));
    const a2 = easeOut(w(t, 10.52, 11.7));
    s = `${glow(0.8)}<div class="center" style="gap:52px">
      <h1 style="font-size:64px;font-weight:800;color:${MUTED};opacity:${a1}">${T.s2a}</h1>
      <h1 style="font-size:82px;font-weight:800;color:${ACCENT};opacity:${a2};transform:scale(${1.08 - 0.08 * a2})">${T.s2b}</h1>
    </div>${thread(w(t, 11.8, 15.2))}`;
  } else if (t < 25.45) {
    const a1 = easeOut(w(t, 15.5, 16.7));
    const a2 = easeOut(w(t, 18.0, 19.2));
    s = `${glow(0.6)}<div class="center" style="gap:50px">
      <h1 style="font-size:62px;font-weight:800;opacity:${a1}">${T.s3a}</h1>
      <h1 style="font-size:76px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s3b}</h1>
    </div>`;
  } else if (t < 37.89) {
    const a0 = easeOut(w(t, 25.45, 26.4));
    const pulse = 1 + 0.4 * Math.pow(Math.max(0, Math.cos(((t - 25.45) / 0.622) * Math.PI * 2)), 3);
    const chips = T.s4
      .map((c, i) => {
        const at = 26.69 + i * 1.866;
        const p = easeOut(w(t, at, at + 1.0));
        return `<div style="display:flex;align-items:center;gap:22px;opacity:${p};transform:translateY(${(1 - p) * 22}px)">
          <span style="width:15px;height:15px;background:${ACCENT};border-radius:50%;flex-shrink:0;
            box-shadow:0 0 18px ${ACCENT}88"></span>
          <span style="font-size:46px;font-weight:800;text-align:${isAr ? 'right' : 'left'}">${c}</span></div>`;
      })
      .join('');
    s = `${glow(pulse)}<div class="center" style="gap:44px;align-items:flex-start;padding:0 78px">
      <p style="align-self:center;font-size:42px;color:${MUTED};opacity:${a0};margin-bottom:10px">${T.s4t}</p>
      ${chips}
    </div>`;
  } else if (t < 45.35) {
    const a1 = easeOut(w(t, 37.89, 39.1));
    const a2 = easeOut(w(t, 40.38, 41.6));
    s = `${glow(0.8)}<div class="center" style="gap:48px">
      <h1 style="font-size:76px;font-weight:800;opacity:${a1}">${T.s5a}</h1>
      <h1 style="font-size:64px;font-weight:800;color:${ACCENT};opacity:${a2}">${T.s5b}</h1>
    </div>${thread(w(t, 41.5, 44.9))}`;
  } else if (t < 52.82) {
    const a1 = easeOut(w(t, 45.35, 46.5));
    const a2 = easeOut(w(t, 47.84, 49.0));
    s = `${glow(1)}<div class="center" style="gap:46px">
      <h1 style="font-size:66px;font-weight:800;opacity:${a1}">${T.s6a}</h1>
      <div style="background:#151A0E;border:2px solid ${ACCENT}88;border-radius:20px;padding:24px 44px;
           font-size:40px;font-weight:700;opacity:${a2};transform:translateY(${(1 - a2) * 22}px);
           box-shadow:0 0 40px ${ACCENT}26">${T.s6b}</div>
    </div>`;
  } else {
    s = ending(t, 52.82);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

const CONF = {
  consulting: {
    dir: 'video-10-consulting',
    music: 'evgeny_bardyuzha-abstract-electronic-everything-feels-new-15241.mp3',
    fn: consulting,
    dur: 61.5,
  },
};

const pick = CONF[process.argv[2]];
if (!pick) {
  console.log('حدد: node _check/promolp6v.mjs consulting ar|en [preview]');
  process.exit(1);
}

const dir = `${LP}/${pick.dir}`;
const frames = `${dir}/framesv-${lang}`;
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
  for (const pt of [6.9, 12, 19.4, 33, 41.7, 49.2, 57]) {
    await page.setContent(pick.fn(pt), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${PV}/consv-${lang}-${String(pt).replace('.', '_')}.png` });
  }
  await browser.close();
  console.log('✅ معاينة عمودية جاهزة');
  process.exit(0);
}

const total = Math.round(pick.dur * FPS);
process.stdout.write(`🎬 consulting-v-${lang}: ${total} إطار `);
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
    `-filter_complex "[1:a]atrim=0:${pick.dur},afade=t=in:d=0.2,afade=t=out:st=${fadeSt}:d=1.6[a]" ` +
    `-map 0:v -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k ` +
    `-movflags +faststart -shortest "${dir}/final-v-${lang}.mp4"`,
  { stdio: 'pipe' },
);
rmSync(frames, { recursive: true, force: true });
console.log(` ✅ ${pick.dir}/final-v-${lang}.mp4`);
