// ═══════════════════════════════════════════════════════════════
//  مولد مشاهد البرومو (2026-08-04) — الجزء «بالكود» من الفيديو
//
//  نفس فلسفة makefilm.mjs: كل بكسل من نظام الهوية، وseed ثابت —
//  كل تشغيل بيطلع نفس الفيديو بالضبط. 1920×1080 @ 30fps.
//
//  المشاهد (بالكود — لقطات الـ AI والموسيقى من هيكسفيلد بإيد ريّان):
//   S2 القلبة: «المشكلة مش بالبوستات.»
//   S3 التعريف: صورة ريّان بالهوية + الاسم واللقب
//   S4 الشغل: كروت الأعمال الثمانية بتطير من الفوضى للنظام
//   S5 الفلسفة: «ما ببيع بوستات. بشخّص، وبعدها منبني.»
//   S7 الختام: اللوجو + ryanalali.me
//
//  التشغيل: node _check/promo.mjs            ← كل المشاهد
//           node _check/promo.mjs s4         ← مشهد واحد للتجربة
//  المخرجات: D:\Ryan-Work\Brand-Ryan\Promo\scenes\sX.mp4
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

// ─── أدوات الحركة ───
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const easeInOut = (x) => (clamp01(x) < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
// نافذة: بتطلع من 0→1 بين a وb
const win = (t, a, b) => clamp01((t - a) / (b - a));
// عشوائية مبذورة — نفس القيم بكل تشغيل
const seeded = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const head = `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;background:${BG};overflow:hidden;position:relative;
       font-family:'Alexandria',system-ui,sans-serif;color:${TEXT}}
</style></head><body>`;

// وهج ليموني خافت بالزاوية — موجود بكل المشاهد للاستمرارية
const glow = (o = 1) =>
  `<div style="position:absolute;inset:0;background:radial-gradient(60% 50% at 88% 6%, ${ACCENT}${Math.round(
    14 * o,
  )
    .toString(16)
    .padStart(2, '0')}, transparent 60%)"></div>`;

// خيط الإشارة — بينرسم مع الوقت (dashoffset)
const thread = (t, y = 940, o = 0.5) => {
  const len = 2200;
  return `<svg viewBox="0 0 1920 60" style="position:absolute;top:${y}px;left:0;width:100%;height:60px;opacity:${o}">
    <path d="M0,30 Q240,6 480,30 T960,30 T1440,30 T1920,30" fill="none" stroke="${ACCENT}" stroke-width="3"
      stroke-dasharray="${len}" stroke-dashoffset="${len * (1 - easeOut(t))}"/></svg>`;
};

// ═══ S2 — القلبة (4 ثواني) ═══
const s2 = (t) => {
  const a1 = easeOut(win(t, 0.06, 0.2));
  const a2 = easeOut(win(t, 0.44, 0.6));
  return `${head}${glow()}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px">
    <h1 style="font-size:104px;font-weight:800;opacity:${a1};transform:translateY(${(1 - a1) * 40}px)">
      المشكلة مش بالبوستات.</h1>
    <h2 style="font-size:56px;font-weight:700;color:${ACCENT};opacity:${a2};transform:translateY(${(1 - a2) * 30}px)">
      المشكلة باللي ورا البوستات.</h2>
  </div>
  ${thread(win(t, 0.1, 0.9))}</body></html>`;
};

// ═══ S3 — التعريف (5 ثواني) ═══
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
      <h1 style="font-size:96px;font-weight:800;opacity:${nm};transform:translateX(${(1 - nm) * -40}px)">ريّان الواثق</h1>
      <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:52px;font-weight:600;color:${ACCENT};direction:ltr;text-align:right;
         opacity:${tg};transform:translateX(${(1 - tg) * -30}px)">Full Stack Marketer</p>
    </div>
  </div>
  ${thread(win(t, 0.2, 0.8))}</body></html>`;
};

// ═══ S4 — الشغل (11 ثانية): من الفوضى للنظام ═══
const s4 = (t) => {
  // الشبكة النهائية 4×2 — الكروت مربعة 396px
  const CW = 396;
  const GAP = 34;
  const cols = 4;
  const gx = (i) => (W - cols * CW - (cols - 1) * GAP) / 2 + (i % cols) * (CW + GAP);
  const gy = (i) => (H - 2 * CW - GAP) / 2 + Math.floor(i / cols) * (CW + GAP) + 20;

  const items = cards
    .map((src, i) => {
      // البداية: مبعثر ومدوّر (مبذور) — كل كرت بيوصل بوقته (stagger)
      const rx = (seeded(i) - 0.5) * 1500;
      const ry = (seeded(i + 8) - 0.5) * 800;
      const rr = (seeded(i + 16) - 0.5) * 40;
      const p = easeInOut(win(t, (0.5 + i) / 17, (2 + i) / 17));
      const x = rx + (gx(i) - rx) * p;
      const y = ry + (gy(i) - ry) * p;
      const rot = rr * (1 - p);
      const sc = 0.55 + 0.45 * p;
      // بالآخر: زوم بطيء جماعي
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
  <p style="position:absolute;top:44px;left:0;width:100%;text-align:center;font-size:54px;font-weight:800;
     opacity:${cap};transform:translateY(${(1 - cap) * -20}px)">شغل بمجالات مختلفة — <span style="color:${ACCENT}">وهوية وحدة ماسكة كل شي</span></p>
  </body></html>`;
};

// ═══ S5 — الفلسفة (6 ثواني) ═══
const s5 = (t) => {
  const a1 = easeOut(win(t, 0.04, 0.125));
  const a2 = easeOut(win(t, 0.25, 0.375));
  const a3 = easeOut(win(t, 0.55, 0.625));
  return `${head}${glow()}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:44px">
    <h1 style="font-size:110px;font-weight:800;opacity:${a1};transform:scale(${0.94 + 0.06 * a1})">ما ببيع بوستات.</h1>
    <h1 style="font-size:88px;font-weight:800;opacity:${a2}">
      <span style="color:${ACCENT}">بشخّص</span>، وبعدها <span style="color:${ACCENT}">منبني</span>.</h1>
    <p style="font-size:38px;color:${MUTED};opacity:${a3}">استراتيجية · إعلانات ممولة · هوية · مواقع بتبيع</p>
  </div>
  ${thread(win(t, 0.15, 0.85))}</body></html>`;
};

// ═══ S7 — الختام (4.5 ثواني) ═══
const s7 = (t) => {
  const lg = easeOut(win(t, 0.04, 0.115));
  const ur = easeOut(win(t, 0.17, 0.23));
  const cta = easeOut(win(t, 0.27, 0.35));
  return `${head}${glow(1.4)}
  <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:38px">
    <img src="${logo}" style="width:220px;height:220px;opacity:${lg};transform:scale(${0.7 + 0.3 * lg});
         filter:drop-shadow(0 0 ${40 * lg}px ${ACCENT}66)">
    <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:84px;font-weight:600;direction:ltr;
       opacity:${ur};transform:translateY(${(1 - ur) * 24}px)">ryanalali<span style="color:${ACCENT}">.me</span></p>
    <p style="font-size:40px;color:${MUTED};opacity:${cta}">جرّب طريقة تفكيري — قبل ما نحكي كلمة</p>
  </div>
  ${thread(win(t, 0.3, 0.9), 980, 0.6)}</body></html>`;
};

const SCENES = [
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
  const dir = `${OUT}/frames/${sc.id}`;
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
  mkdirSync(`${OUT}/scenes`, { recursive: true });
  execSync(
    `"${FFMPEG}" -y -framerate ${FPS} -i "${dir}/f%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "${OUT}/scenes/${sc.id}.mp4"`,
    { stdio: 'pipe' },
  );
  console.log(` ✅ scenes/${sc.id}.mp4`);
}
await browser.close();
console.log('\nالمخرجات:', `${OUT}/scenes/`);
