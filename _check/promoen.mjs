// ═══════════════════════════════════════════════════════════════
//  مشاهد الفيلم التعريفي — النسخة الإنجليزية (2026-08-05)
//
//  توأم promo.mjs بنفس التوقيتات والضربات بالضبط (نفس الموسيقى
//  ونفس المونتاج) — بس النصوص إنجليزي بريطاني، الاتجاه LTR،
//  والعناوين بخط Grotesk (هوية الإنجليزي بالموقع).
//  السلوغان: Marketing that builds. Results you can measure.
//
//  التشغيل: node _check/promoen.mjs            ← كل المشاهد
//           node _check/promoen.mjs s4         ← مشهد واحد
//  المخرجات: D:\Ryan-Work\Brand-Ryan\Promo\scenes-en\sX.mp4
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, rmSync } from 'fs';
import { execSync } from 'child_process';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Promo';
const FPS = 30;
const W = 1920;
const H = 1080;
const FFMPEG = 'D:/Tools/ffmpeg/bin/ffmpeg.exe';

const only = (process.argv[2] || '').toLowerCase();

const BG = '#0E0F12';
const ACCENT = '#D9FF3F';
const MUTED = '#A0A49B';
const TEXT = '#F2F3EE';

const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');
const photo =
  'data:image/png;base64,' +
  readFileSync('D:/Ryan-Work/Brand-Ryan/Social/Profile/rayan-photo-brand.png').toString('base64');

const CARDS_DIR = 'D:/Ryan-Work/Brand-Ryan/Social/LinkedIn/Cards-Square';
const CARD_FILES = [
  '1-work-luvit.png',
  '2-work-pasticcini.png',
  '3-work-orient.png',
  '4-work-infinity.png',
  '5-work-products.png',
  '6-work-art.png',
  '7-work-drsamir.png',
  '8-work-mofakron.png',
];
const cards = CARD_FILES.map((f) => 'data:image/png;base64,' + readFileSync(`${CARDS_DIR}/${f}`).toString('base64'));

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOut = (x) => (clamp01(x) < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const win = (t, a, b) => clamp01((t - a) / (b - a));
const seeded = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const head = `<!doctype html><html dir="ltr"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${BG};overflow:hidden;position:relative;
       font-family:'Grotesk','Alexandria',system-ui,sans-serif;color:${TEXT}}
  h1,h2{font-family:'Grotesk','Alexandria',sans-serif;letter-spacing:-0.5px}
</style></head><body>`;

const glow = (o = 1) =>
  `<div style="position:absolute;inset:0;background:radial-gradient(60% 50% at 12% 6%, ${ACCENT}${Math.round(
    14 * o,
  )
    .toString(16)
    .padStart(2, '0')}, transparent 60%)"></div>`;

const thread = (t, y = 940, o = 0.5) => {
  const len = 2200;
  return `<svg viewBox="0 0 1920 60" style="position:absolute;top:${y}px;left:0;width:100%;height:60px;opacity:${o}">
    <path d="M0,30 Q240,6 480,30 T960,30 T1440,30 T1920,30" fill="none" stroke="${ACCENT}" stroke-width="3"
      stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - easeOut(t))}"/></svg>`;
};

// ═══ S2 — القلبة (5 ثواني) ═══
const s2 = (t) => {
  const a1 = easeOut(win(t, 0.06, 0.2));
  const a2 = easeOut(win(t, 0.44, 0.6));
  return `${head}${glow()}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;text-align:center">
    <h1 style="font-size:92px;font-weight:700;opacity:${a1};transform:translateY(${(1 - a1) * 40}px)">
      The problem isn't the posts.</h1>
    <h2 style="font-size:54px;font-weight:700;color:${ACCENT};opacity:${a2};transform:translateY(${(1 - a2) * 30}px)">
      It's what's behind the posts.</h2>
  </div>
  ${thread(win(t, 0.1, 0.9))}</body></html>`;
};

// ═══ S3 — التعريف (6 ثواني) ═══
const s3 = (t) => {
  const ph = easeOut(win(t, 0.05, 0.17));
  const nm = easeOut(win(t, 0.2, 0.33));
  const tg = easeOut(win(t, 0.37, 0.5));
  return `${head}${glow()}
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:90px">
    <div style="width:400px;height:400px;border-radius:50%;overflow:hidden;flex-shrink:0;
         border:4px solid ${ACCENT};box-shadow:0 0 90px ${ACCENT}44;
         opacity:${ph};transform:scale(${0.86 + 0.14 * ph})">
      <img src="${photo}" style="width:100%;height:100%;object-fit:cover"></div>
    <div>
      <h1 style="font-size:88px;font-weight:700;opacity:${nm};transform:translateX(${(1 - nm) * 40}px)">Rayan Al-Wathiq</h1>
      <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:50px;font-weight:600;color:${ACCENT};
         opacity:${tg};transform:translateX(${(1 - tg) * 30}px)">Full Stack Marketer</p>
    </div>
  </div>
  ${thread(win(t, 0.2, 0.8))}</body></html>`;
};

// ═══ S4 — الشغل (17 ثانية): من الفوضى للنظام ═══
const s4 = (t) => {
  const CW = 396;
  const GAP = 34;
  const cols = 4;
  const gx = (i) => (W - cols * CW - (cols - 1) * GAP) / 2 + (i % cols) * (CW + GAP);
  const gy = (i) => (H - 2 * CW - GAP) / 2 + Math.floor(i / cols) * (CW + GAP) + 20;

  const items = cards
    .map((src, i) => {
      const rx = (seeded(i) - 0.5) * 1500;
      const ry = (seeded(i + 8) - 0.5) * 800;
      const rr = (seeded(i + 16) - 0.5) * 40;
      const p = easeInOut(win(t, (0.5 + i) / 17, (2 + i) / 17));
      const x = rx + (gx(i) - rx) * p;
      const y = ry + (gy(i) - ry) * p;
      const rot = rr * (1 - p);
      const sc = 0.55 + 0.45 * p;
      const zoom = 1 + 0.045 * easeInOut(win(t, 0.82, 1));
      return `<div style="position:absolute;left:${x}px;top:${y}px;width:${CW}px;height:${CW}px;
        transform:rotate(${rot}deg) scale(${sc * zoom});border-radius:18px;overflow:hidden;
        border:2px solid ${ACCENT}55;box-shadow:0 18px 60px rgba(0,0,0,.5);opacity:${0.25 + 0.75 * p}">
        <img src="${src}" style="width:100%;height:100%;object-fit:cover"></div>`;
    })
    .join('');

  const cap = easeOut(win(t, 0.647, 0.706));
  return `${head}${glow()}
  ${items}
  <p style="position:absolute;top:44px;left:0;width:100%;text-align:center;font-size:48px;font-weight:700;font-family:'Grotesk','Alexandria',sans-serif;
     opacity:${cap};transform:translateY(${(1 - cap) * -20}px)">Different industries. <span style="color:${ACCENT}">One identity holding everything together.</span></p>
  </body></html>`;
};

// ═══ S5 — الفلسفة (8 ثواني) ═══
const s5 = (t) => {
  const a1 = easeOut(win(t, 0.04, 0.125));
  const a2 = easeOut(win(t, 0.25, 0.375));
  const a3 = easeOut(win(t, 0.55, 0.625));
  return `${head}${glow()}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px;text-align:center">
    <h1 style="font-size:100px;font-weight:700;opacity:${a1};transform:scale(${0.94 + 0.06 * a1})">I don't sell posts.</h1>
    <h1 style="font-size:80px;font-weight:700;opacity:${a2}">
      I <span style="color:${ACCENT}">diagnose</span>, then I <span style="color:${ACCENT}">build</span>.</h1>
    <p style="font-size:36px;color:${MUTED};opacity:${a3};font-family:'Alexandria',sans-serif">Strategy · Paid ads · Brand identity · Websites that sell</p>
  </div>
  ${thread(win(t, 0.15, 0.85))}</body></html>`;
};

// ═══ S7 — الختام (13 ثانية) ═══
const s7 = (t) => {
  const lg = easeOut(win(t, 0.04, 0.115));
  const ur = easeOut(win(t, 0.17, 0.23));
  const cta = easeOut(win(t, 0.27, 0.35));
  return `${head}${glow(1.4)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:38px;text-align:center">
    <img src="${logo}" style="width:220px;height:220px;opacity:${lg};transform:scale(${0.7 + 0.3 * lg});
         filter:drop-shadow(0 0 ${40 * lg}px ${ACCENT}66)">
    <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:84px;font-weight:600;
       opacity:${ur};transform:translateY(${(1 - ur) * 24}px)">ryanalali<span style="color:${ACCENT}">.me</span></p>
    <p style="font-size:38px;color:${MUTED};opacity:${cta};font-family:'Alexandria',sans-serif">Marketing that builds. Results you can measure.</p>
  </div>
  ${thread(win(t, 0.3, 0.9), 980, 0.6)}</body></html>`;
};

// ═══ STRANS — خيوط الإشارة (4 ثواني) ═══
const strans = (t) => {
  const lines = [0, 1, 2, 3, 4]
    .map((i) => {
      const y = 240 + i * 150;
      const p = easeInOut(win(t, i * 0.12, 0.55 + i * 0.1));
      const fadeAll = 1 - easeOut(win(t, 0.82, 1));
      const len = 2400;
      const wob = Math.sin(t * 6.28 * 2 + i) * 14;
      return `<svg viewBox="0 0 1920 120" style="position:absolute;top:${y + wob}px;left:0;width:100%;height:120px;opacity:${(0.25 + 0.75 * p) * fadeAll}">
        <path d="M0,60 Q240,${20 + i * 8} 480,60 T960,60 T1440,60 T1920,60" fill="none" stroke="${ACCENT}"
          stroke-width="${3 + i * 0.5}" stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - p)}"
          style="filter:drop-shadow(0 0 ${8 + 10 * p}px ${ACCENT}88)"/></svg>`;
    })
    .join('');
  return `${head}${glow(1.2)}${lines}</body></html>`;
};

// ═══ STATS — الموقع بالأرقام (9 ثواني) ═══
const stats = (t) => {
  const items = [
    { n: 130, plus: '+', label: 'pages of real content', at: 1 },
    { n: 9, plus: '', label: 'articles you learn by playing', at: 3 },
    { n: 8, plus: '', label: 'games and tools, all free', at: 5 },
  ];
  const secs = 9;
  const cols = items
    .map((it) => {
      const p = easeOut(win(t, it.at / secs, (it.at + 1.2) / secs));
      const val = Math.round(it.n * p);
      return `<div style="text-align:center;opacity:${p};transform:translateY(${(1 - p) * 30}px)">
        <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:150px;font-weight:700;color:${ACCENT}">${val}${p > 0.95 ? it.plus : ''}</p>
        <p style="font-size:32px;color:#E8EAE3;margin-top:6px;font-family:'Alexandria',sans-serif">${it.label}</p></div>`;
    })
    .join('');
  const cap = easeOut(win(t, 7 / secs, 8 / secs));
  return `${head}${glow()}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:60px;text-align:center">
    <div style="display:flex;gap:140px;align-items:start">${cols}</div>
    <p style="font-size:40px;font-weight:700;color:${TEXT};opacity:${cap};font-family:'Grotesk','Alexandria',sans-serif">None of this is talk. <span style="color:${ACCENT}">A live site, try it yourself.</span></p>
  </div>
  ${thread(win(t, 0.15, 0.75))}</body></html>`;
};

const SCENES = [
  { id: 'strans', fn: strans, secs: 4 },
  { id: 'stats', fn: stats, secs: 9 },
  { id: 's2', fn: s2, secs: 5 },
  { id: 's3', fn: s3, secs: 6 },
  { id: 's4', fn: s4, secs: 17 },
  { id: 's5', fn: s5, secs: 8 },
  { id: 's7', fn: s7, secs: 13 },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');

for (const sc of SCENES) {
  if (only && sc.id !== only) continue;
  const dir = `${OUT}/frames-en/${sc.id}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const total = Math.round(sc.secs * FPS);
  process.stdout.write(`🎬 ${sc.id}: ${total} إطار `);
  for (let f = 0; f < total; f++) {
    await page.setContent(sc.fn(f / (total - 1)), { waitUntil: f === 0 ? 'networkidle' : 'load' });
    if (f === 0) await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${dir}/f${String(f).padStart(4, '0')}.png` });
    if (f % 30 === 0) process.stdout.write('·');
  }
  mkdirSync(`${OUT}/scenes-en`, { recursive: true });
  execSync(
    `"${FFMPEG}" -y -framerate ${FPS} -i "${dir}/f%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "${OUT}/scenes-en/${sc.id}.mp4"`,
    { stdio: 'pipe' },
  );
  console.log(` ✅ scenes-en/${sc.id}.mp4`);
}
await browser.close();
console.log('\nالمخرجات:', `${OUT}/scenes-en/`);
