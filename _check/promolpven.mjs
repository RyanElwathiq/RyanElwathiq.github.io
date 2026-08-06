// ═══════════════════════════════════════════════════════════════
//  النسخ العمودية 9:16 الإنجليزية — المواقع والفهرس والإعلانات
//  (2026-08-06) — آخر نواقص أسطول الفيديو
//
//  توأم promolpv.mjs بنفس التخطيط العمودي والضربات بالضبط،
//  ونصوصه من promolpen.mjs حرفياً (إنجليزي بريطاني، LTR،
//  عناوين Grotesk، وواجهات الموك بنسخها الإنجليزية).
//
//  ⚠️ الإنجليزي أعرض من العربي بنفس عدد الكلمات، فالأحجام هون
//     أصغر شوي من العربي العمودي وإلا بينكسر السطر بشكل بشع
//     على عرض ١٠٨٠.
//
//  التشغيل: node _check/promolpven.mjs 1|2|3 [preview]
//  المخرج: Promo-LP/video-N-*/final-v-en.mp4
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
const seeded = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const mocks = ['mock-restaurant-en', 'mock-clinic-en', 'mock-store-en'].map(
  (f) => 'data:image/png;base64,' + readFileSync(`${LP}/assets/${f}.png`).toString('base64'),
);

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const head = `<!doctype html><html dir="ltr"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${BG};overflow:hidden;position:relative;
       font-family:'Grotesk','Alexandria',system-ui,sans-serif;color:${TEXT}}
  h1,h2{font-family:'Grotesk','Alexandria',sans-serif;letter-spacing:-0.5px;line-height:1.24}
  p{line-height:1.4}
  .center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 60px}
</style></head><body>`;

const glow = (o = 1) =>
  `<div style="position:absolute;inset:0;background:radial-gradient(70% 30% at 15% 4%, ${ACCENT}${Math.max(
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
  `<div style="position:absolute;inset:0;background:#000;opacity:${easeOut(w(t, dur - 0.9, dur))}"></div>`;

// الخاتمة المشتركة — نفس تكوين العمودي العربي بأحجام إنجليزية
const ending = (t, a1Text, a1At, lgAt) => {
  const a1 = a1Text ? easeOut(w(t, a1At, a1At + 0.55)) : 0;
  const lg = easeOut(w(t, lgAt, lgAt + 0.55));
  return `${glow(1.4)}<div class="center" style="gap:58px">
    ${a1Text ? `<p style="font-size:46px;font-weight:700;opacity:${a1}">${a1Text}</p>` : ''}
    <img src="${logo}" style="width:190px;height:190px;opacity:${lg};transform:scale(${0.72 + 0.28 * lg});
         filter:drop-shadow(0 0 ${34 * lg}px ${ACCENT}66)">
    <h1 style="font-size:50px;font-weight:700;opacity:${lg}">Marketing that <span style="color:${ACCENT}">builds</span>.<br>Results you can <span style="color:${ACCENT}">measure</span>.</h1>
    <p style="font-size:36px;color:${MUTED};opacity:${lg}">ryanalali<span style="color:${ACCENT}">.me</span></p>
  </div>`;
};

// ═══ فيديو ١ عمودي إنجليزي — المواقع (23.62) ═══
const v1 = (t) => {
  const DUR = 23.62;
  let s = '';

  if (t < 4.19) {
    const q = 'zaytouna restaurant amman';
    const typed = q.slice(0, Math.round(w(t, 0.4, 2.1) * q.length));
    const intro = easeOut(w(t, 0.15, 0.8));
    const slam = easeOut(w(t, 2.3, 2.75));
    s = `${glow(0.7)}<div class="center" style="gap:52px">
      <p style="font-size:42px;color:${MUTED};opacity:${intro}">The customer saw your ad…</p>
      <div style="width:940px;max-width:96%;background:#1B1D22;border:2px solid ${ACCENT}33;border-radius:999px;
           padding:24px 36px;display:flex;align-items:center;gap:18px;opacity:${intro}">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${MUTED}" stroke-width="2.4"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>
        <span style="font-size:30px;color:${TEXT};min-height:42px">${typed}<span style="opacity:${
          Math.floor(t * 2.4) % 2 ? 1 : 0
        };color:${ACCENT}">|</span></span></div>
      <h1 style="font-size:76px;font-weight:700;color:${ACCENT};opacity:${slam};transform:scale(${1.16 - 0.16 * slam})">then searched<br>for you.</h1>
    </div>`;
  } else if (t < 7.98) {
    const a1 = easeOut(w(t, 4.19, 4.7));
    const a2 = easeOut(w(t, 6.09, 6.6));
    s = `${glow()}<div class="center" style="gap:78px">
      <p style="font-size:48px;font-weight:700;color:${MUTED};opacity:${a1};transform:translateY(${(1 - a1) * 30}px)">Found an Instagram page?<br>They keep scrolling.</p>
      <p style="font-size:56px;font-weight:800;color:${TEXT};opacity:${a2};transform:translateY(${(1 - a2) * 30}px)">Found a proper website?<br><span style="color:${ACCENT}">They trust, they buy.</span></p>
    </div>`;
  } else if (t < 13.67) {
    const starts = [7.98, 9.87, 11.77];
    const ends = [9.87, 11.77, 13.67];
    const cards = starts
      .map((st, i) => {
        const fin = easeOut(w(t, st, st + 0.45));
        const fout = i < 2 ? easeOut(w(t, ends[i] - 0.3, ends[i])) : 0;
        const op = fin * (1 - fout);
        if (op <= 0.01) return '';
        const y = (1 - fin) * 46 - fout * 18;
        const sc = 0.965 + 0.035 * fin - 0.02 * fout;
        return `<div style="position:absolute;left:40px;top:430px;width:1000px;
          transform:translateY(${y}px) scale(${sc});opacity:${op};
          border-radius:20px;overflow:hidden;box-shadow:0 40px 110px rgba(0,0,0,.65)">
          <img src="${mocks[i]}" style="width:100%;display:block"></div>`;
      })
      .join('');
    const cap = easeOut(w(t, 12.4, 12.9));
    s = `${glow()}${cards}
      <p style="position:absolute;bottom:340px;left:0;width:100%;text-align:center;font-size:40px;font-weight:800;padding:0 50px;
         opacity:${cap}">A website that sells: <span style="color:${ACCENT}">fast, clear,<br>every button there for a reason.</span></p>`;
  } else if (t < 19.36) {
    const a1 = easeOut(w(t, 13.67, 14.2));
    const a2 = easeOut(w(t, 15.56, 16.1));
    const a3 = easeOut(w(t, 17.46, 17.95));
    s = `${glow()}<div class="center" style="gap:64px">
      <h1 style="font-size:60px;font-weight:700;opacity:${a1};transform:translateY(${(1 - a1) * 26}px)">Built deliberately,<br>not randomly.</h1>
      <p style="font-size:46px;font-weight:700;color:${ACCENT};opacity:${a2};transform:translateY(${(1 - a2) * 24}px)">A fixed price from day one,<br>no surprises.</p>
      <p style="font-size:36px;color:${TEXT};opacity:${a3}">With a TCO report showing<br>where every dinar goes.</p>
    </div>${thread(w(t, 14, 18.8))}`;
  } else {
    s = ending(t, null, 0, 19.36);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

// ═══ فيديو ٢ عمودي إنجليزي — الفهرس (23.9) · الدروب عند 8.19 ═══
const v2 = (t) => {
  const DUR = 23.9;
  let s = '';

  if (t < 4.0) {
    const a = easeOut(w(t, 0.5, 1.6));
    s = `<div class="center">
      <p style="font-size:52px;font-weight:700;color:${MUTED};opacity:${a};transform:scale(${0.96 + 0.04 * a})">There are two kinds<br>of marketing agencies.</p>
    </div>`;
  } else if (t < 8.19) {
    const a1 = easeOut(w(t, 4.0, 4.55));
    const a2 = easeOut(w(t, 5.9, 6.45));
    s = `<div class="center" style="gap:80px">
      <p style="font-size:48px;font-weight:700;color:${MUTED};opacity:${a1};transform:translateY(${(1 - a1) * 26}px)">One sells you<br>a ready-made package…</p>
      <p style="font-size:56px;font-weight:800;color:${TEXT};opacity:${a2};transform:translateY(${(1 - a2) * 26}px)">The other asks:<br>why aren't you selling?</p>
    </div>`;
  } else if (t < 12.38) {
    const a1 = easeOut(w(t, 8.19, 8.62));
    const a2 = easeOut(w(t, 10.28, 10.75));
    const pulse = 1.1 + 0.5 * Math.pow(Math.max(0, Math.cos(((t - 8.19) / 0.524) * Math.PI * 2)), 3);
    s = `${glow(pulse)}<div class="center" style="gap:68px">
      <h1 style="font-size:76px;font-weight:700;opacity:${a1};transform:scale(${1.14 - 0.14 * a1})">I'm the<br>second kind.</h1>
      <h1 style="font-size:62px;font-weight:700;opacity:${a2}">I <span style="color:${ACCENT}">diagnose</span>,<br>then I <span style="color:${ACCENT}">build</span>.</h1>
    </div>`;
  } else if (t < 18.67) {
    // كروت الخدمات 2×2 — نفس شبكة العمودي العربي
    const cards = [
      { n: '01', name: 'Strategy', line: 'The plan before the tools', at: 12.38 },
      { n: '02', name: 'Paid ads', line: 'Every dinar measured', at: 13.43 },
      { n: '03', name: 'Brand identity', line: 'A look that sticks', at: 14.48 },
      { n: '04', name: 'Websites', line: 'They sell, not just look good', at: 15.52 },
    ];
    const CW = 452;
    const CH = 400;
    const GAP = 40;
    const x0 = (W - 2 * CW - GAP) / 2;
    const y0 = (H - 2 * CH - GAP) / 2 - 60;
    const items = cards
      .map((c, i) => {
        const p = easeOut(w(t, c.at, c.at + 0.6));
        if (p <= 0) return '';
        const sc = 1.6 - 0.6 * p;
        const blur = (1 - p) * 10;
        const cx = x0 + (i % 2) * (CW + GAP);
        const cy = y0 + Math.floor(i / 2) * (CH + GAP);
        return `<div style="position:absolute;left:${cx}px;top:${cy}px;width:${CW}px;height:${CH}px;
          background:#15171C;border:2px solid ${ACCENT}44;border-radius:24px;padding:36px 32px;
          transform:scale(${sc});filter:blur(${blur}px);box-shadow:0 30px 80px rgba(0,0,0,.6);
          display:flex;flex-direction:column;justify-content:space-between">
          <p style="font-size:50px;font-weight:700;color:${ACCENT}55;text-align:left">${c.n}</p>
          <div><p style="font-size:36px;font-weight:700">${c.name}</p>
          <p style="font-size:23px;color:${MUTED};margin-top:10px">${c.line}</p></div></div>`;
      })
      .join('');
    const cap = easeOut(w(t, 16.57, 17.05));
    s = `${glow()}${items}
      <p style="position:absolute;bottom:250px;left:0;width:100%;text-align:center;font-size:38px;font-weight:800;padding:0 50px;
         opacity:${cap}">And every service tells you<br><span style="color:${ACCENT}">exactly what you get.</span></p>`;
  } else {
    s = ending(t, 'Play with the tools, see the<br>numbers, then decide.', 18.67, 20.76);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

// ═══ فيديو ٣ عمودي إنجليزي — الإعلانات (25.29) · الطاقة عند 8.27 ═══
const v3 = (t) => {
  const DUR = 25.29;
  let s = '';

  if (t < 4.4) {
    const a = easeOut(w(t, 0.3, 1.1));
    const val = Math.round(100 - 60 * easeInOut(w(t, 0.53, 4.4)));
    s = `${glow(0.4)}<div class="center" style="gap:34px">
      <p style="font-size:40px;color:${MUTED};opacity:${a}">You paid 100 dinars<br>for a boosted post.</p>
      <p style="font-size:250px;font-weight:700;color:${TEXT};opacity:${a};line-height:1">${val}</p>
      <p style="font-size:34px;color:${MUTED};opacity:${a}">dinars, and dropping…</p>
    </div>`;
  } else if (t < 8.27) {
    const a = easeOut(w(t, 4.4, 4.9));
    const hearts = [...Array(14)]
      .map((_, i) => {
        const born = 4.4 + seeded(i) * 3.0;
        const p = w(t, born, born + 2.4);
        if (p <= 0 || p >= 1) return '';
        const x = 80 + seeded(i + 20) * 900;
        const y = 1600 - p * 1200;
        const sc = 0.6 + seeded(i + 40) * 0.9;
        return `<div style="position:absolute;left:${x}px;top:${y}px;font-size:${54 * sc}px;
          color:#6A6E64;opacity:${1 - p};transform:rotate(${(seeded(i + 60) - 0.5) * 30}deg)">♥</div>`;
      })
      .join('');
    const val = Math.round(40 - 40 * easeInOut(w(t, 4.4, 7.8)));
    s = `${glow(0.4)}${hearts}<div class="center" style="gap:30px">
      <h1 style="font-size:68px;font-weight:700;opacity:${a}">It got you likes…</h1>
      <p style="font-size:120px;font-weight:700;color:${MUTED};opacity:${a * 0.8};line-height:1">${val}</p>
    </div>`;
  } else if (t < 14.46) {
    const slam = easeOut(w(t, 8.27, 8.75));
    const fadeSlam = 1 - easeOut(w(t, 10.3, 10.9));
    const th = easeInOut(w(t, 10.6, 13.2));
    const cap = easeOut(w(t, 11.4, 12.0));
    const len = 1100;
    const threads = [0, 1, 2]
      .map((i) => {
        const y0 = 640 + i * 300;
        const yMerge = 940;
        const y = y0 + (yMerge - y0) * th;
        return `<svg viewBox="0 0 1080 60" style="position:absolute;top:${y - 30}px;left:0;width:100%;height:60px;opacity:${th > 0 ? 0.9 : 0}">
          <path d="M0,30 Q270,${18 + i * 8} 540,30 T1080,30" fill="none" stroke="${ACCENT}"
            stroke-width="3.5" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - th)}"
            style="filter:drop-shadow(0 0 10px ${ACCENT}77)"/></svg>`;
      })
      .join('');
    s = `${glow(0.6 + th)}
      <h1 style="position:absolute;top:300px;left:0;width:100%;text-align:center;font-size:80px;font-weight:700;padding:0 50px;
        opacity:${slam * Math.max(fadeSlam, 0.35)};transform:scale(${1.18 - 0.18 * slam})">And not one<br>customer.</h1>
      ${threads}
      <p style="position:absolute;bottom:280px;left:0;width:100%;text-align:center;font-size:38px;font-weight:700;padding:0 60px;
         opacity:${cap}">The right ad reaches <span style="color:${ACCENT}">the right people</span>,<br>with <span style="color:${ACCENT}">the right message</span>,<br>and every dinar <span style="color:${ACCENT}">measured</span>.</p>`;
  } else if (t < 20.65) {
    const rows = ['ROAS', 'CPL', 'CTR'];
    const bars = rows
      .map((r, i) => {
        const st = 14.46 + i * 0.774;
        const p = easeOut(w(t, st, st + 0.9));
        const beatPulse = 0.9 + 0.1 * Math.pow(Math.max(0, Math.cos(((t - 0.53) / 0.774) * Math.PI * 2)), 2);
        const bw = (300 + seeded(i + 3) * 320) * p * beatPulse;
        return `<div style="display:flex;align-items:center;gap:28px;opacity:${p}">
          <span style="font-size:46px;font-weight:700;color:${TEXT};width:150px;text-align:left">${r}</span>
          <div style="width:${bw}px;height:24px;background:linear-gradient(90deg,${ACCENT},${ACCENT}66);border-radius:999px"></div></div>`;
      })
      .join('');
    const cap = easeOut(w(t, 17.5, 18.05));
    s = `${glow()}<div class="center" style="gap:46px;align-items:flex-start;padding-left:110px">
      ${bars}
      <p style="align-self:center;margin-top:40px;font-size:38px;font-weight:700;opacity:${cap};padding:0 40px;text-align:center">They aren't riddles.<br><span style="color:${ACCENT}">Try the budget simulator</span><br>and see where your money goes.</p>
    </div>`;
  } else {
    s = ending(t, "Don't hesitate: fill the form<br>and tell me everything.", 20.65, 22.6);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

// ═══════════════════════════════════════════════════════════════
const VIDEOS = {
  1: { dir: 'video-1-websites', music: 'website music.mp3', fn: v1, dur: 23.62 },
  2: { dir: 'video-2-services', music: 'osynthw-minimal-retro-synthwave-background-353064.mp3', fn: v2, dur: 23.9 },
  3: { dir: 'video-3-paid-ads', music: 'ads video.mp3', fn: v3, dur: 25.29 },
};

const pick = VIDEOS[process.argv[2]];
if (!pick) {
  console.log('حدد الفيديو: node _check/promolpven.mjs 1|2|3 [preview]');
  process.exit(1);
}

const dir = `${LP}/${pick.dir}`;
const frames = `${dir}/frames-v-en`;
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

if (process.argv[3] === 'preview') {
  const PV = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
  const pts = { 1: [2.6, 6.5, 12.5, 17, 21], 2: [2, 6.5, 10.5, 16.5, 22], 3: [3, 6, 12, 18, 23.5] }[process.argv[2]];
  for (const pt of pts) {
    await page.setContent(pick.fn(pt), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${PV}/ven-${process.argv[2]}-${String(pt).replace('.', '_')}.png` });
  }
  await browser.close();
  console.log('✅ معاينة جاهزة');
  process.exit(0);
}

const total = Math.round(pick.dur * FPS);
process.stdout.write(`🎬 ${pick.dir} عمودي إنجليزي: ${total} إطار `);
for (let f = 0; f < total; f++) {
  await page.setContent(pick.fn(f / FPS), { waitUntil: f === 0 ? 'networkidle' : 'load' });
  if (f === 0) await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${frames}/f${String(f).padStart(4, '0')}.png` });
  if (f % 120 === 0) process.stdout.write('·');
}
await browser.close();

const fadeSt = (pick.dur - 1.5).toFixed(2);
execSync(
  `"${FFMPEG}" -y -framerate ${FPS} -i "${frames}/f%04d.png" -i "${dir}/${pick.music}" ` +
    `-filter_complex "[1:a]atrim=0:${pick.dur},afade=t=in:d=0.15,afade=t=out:st=${fadeSt}:d=1.5[a]" ` +
    `-map 0:v -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k ` +
    `-movflags +faststart -shortest "${dir}/final-v-en.mp4"`,
  { stdio: 'pipe' },
);
rmSync(frames, { recursive: true, force: true });
console.log(` ✅ ${pick.dir}/final-v-en.mp4`);
