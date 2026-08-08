// ═══════════════════════════════════════════════════════════════
//  «Caught by my own robot» — فيلم فكاهي إنجليزي (2026-08-08)
//
//  ٤٠ ثانية. القصة حقيقية: ريّان جرّب يكتب طلب هبل على الفورم
//  تبع موقعه، والوكيل «نبض» قرأه ورد عليه بجدية خلال أقل من دقيقة.
//
//  ⚠️ كل ادعاء بالفيلم مفحوص:
//     · الوكيل بيقرا كل طلب بيوصل الموقع وبيرد — مفحوص حي 2026-08-08
//     · الرد بيوصل الصندوق بأقل من دقيقة — نفس الفحص
//     · الرد بالعربي — نعم
//     نص الطلب الهبل بالفيديو **تمثيل** مش اقتباس حرفي، وما في
//     ولا سطر بيدّعي إنه لقطة شاشة.
//
//  ⚠️ ولا em-dash بأي نص — قاعدة ريّان.
//  ⚠️ الخط بينحمّل عبر route، وإلا Playwright بيسقط على خط النظام.
//
//  التشغيل: node _check/jokefilm.mjs h|v [preview]
//  المخرج: Promo-LP/joke-caught/caught-<h|v>.mp4
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync, rmSync } from 'fs';
import { execSync } from 'child_process';

const FFMPEG = 'D:/Tools/ffmpeg/bin/ffmpeg.exe';
const LP = 'D:/Ryan-Work/Brand-Ryan/Promo-LP';
const MUSIC = `${LP}/Music/sigmamusicart-funk-background-198849.mp3`;
const FPS = 30;
const DUR = 40;

const ori = process.argv[2] === 'v' ? 'v' : 'h';
const V = ori === 'v';
const W = V ? 1080 : 1920;
const H = V ? 1920 : 1080;
const S = W / 1920; // معامل التحجيم مقابل التصميم الأفقي

const BG = '#0E0F12';
const ACCENT = '#D9FF3F';
const MUTED = '#A0A49B';
const TEXT = '#F2F3EE';

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
const w = (t, a, b) => clamp01((t - a) / (b - a));
const px = (n) => `${(n * S).toFixed(1)}px`;

const logo = 'data:image/png;base64,' + readFileSync('public/assets/logo-white.png').toString('base64');

const FONTS = {
  '/__f/ar.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/lat.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/gro.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const head = `<!doctype html><html dir="ltr"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alexandria';src:url('/__f/ar.woff2') format('woff2');font-weight:100 900}
@font-face{font-family:'Alexandria';src:url('/__f/lat.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
@font-face{font-family:'Grotesk';src:url('/__f/gro.woff2') format('woff2');font-weight:300 800}
*{margin:0;padding:0;box-sizing:border-box}
body{width:${W}px;height:${H}px;background:${BG};overflow:hidden;position:relative;
     font-family:'Grotesk','Alexandria',sans-serif;color:${TEXT}}
.c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
   padding:0 ${px(160)};text-align:center}
h1{font-size:${px(V ? 88 : 82)};font-weight:800;line-height:1.26;letter-spacing:${px(-1)}}
.lime{color:${ACCENT}}
.mut{color:${MUTED}}
</style></head><body>`;

const glow = (o = 1) =>
  `<div style="position:absolute;inset:0;background:radial-gradient(56% 34% at 50% 48%, ${ACCENT}${Math.round(
    18 * o,
  ).toString(16).padStart(2, '0')}, transparent 64%)"></div>`;
const vig = () =>
  `<div style="position:absolute;inset:0;background:radial-gradient(86% 46% at 50% 112%, #000000AA, transparent 70%)"></div>`;
const fadeOut = (t) =>
  `<div style="position:absolute;inset:0;background:#000;opacity:${easeOut(w(t, DUR - 1.1, DUR))}"></div>`;

// ─── خط النبض (نفس شكل التصاميم) ───
const pulse = (pw, ph, prog) => {
  const mid = ph / 2;
  const pts = [];
  const spikeAt = 0.58 * pw;
  const on = prog > 0;
  for (let x = 0; x <= pw; x += 4) {
    let y = mid + Math.sin(x / 26) * 3.5 + Math.sin(x / 61) * 2;
    const d = x - spikeAt;
    if (on && Math.abs(d) < 74) {
      const k = easeOut(prog);
      if (d > -74 && d <= -34) y = mid + 13 * k * Math.sin(((d + 74) / 40) * Math.PI);
      else if (d > -34 && d <= 4) y = mid - ph * 0.42 * k * Math.sin(((d + 34) / 38) * Math.PI);
      else if (d > 4 && d <= 40) y = mid + ph * 0.2 * k * Math.sin(((d - 4) / 36) * Math.PI);
      else y = mid - 8 * k * Math.sin(((d - 40) / 34) * Math.PI);
    }
    pts.push(`${x.toFixed(0)},${y.toFixed(1)}`);
  }
  return pts.join(' ');
};

// ─── نص بيتكتب حرف حرف ───
const typed = (full, p) => {
  const n = Math.floor(clamp01(p) * full.length);
  return full.slice(0, n);
};

const BRIEF = `hi
i need a website
budget: 3 dinars
deadline: yesterday
make it go viral pls`;

const line = (txt, o, y = 0, cls = '') =>
  `<h1 class="${cls}" style="opacity:${o};transform:translateY(${px(y)})">${txt}</h1>`;

const scene = (t) => {
  let body = '';

  // ١) البناء — 0 إلى 4.5
  if (t < 4.6) {
    const a = easeOut(w(t, 0.3, 1.4));
    body = `${glow(a)}<div class="c">
      ${line('I built an AI agent', a, (1 - a) * 26)}
      ${line('for my own website.', easeOut(w(t, 0.9, 2.0)), (1 - easeOut(w(t, 0.9, 2.0))) * 26, 'lime')}
    </div>`;
  }
  // ٢) الاختبار — 4.6 إلى 9
  else if (t < 9.0) {
    const a = easeOut(w(t, 4.8, 5.8));
    const b = easeOut(w(t, 6.8, 7.8));
    body = `${glow(0.6)}<div class="c">
      ${line('Then I tested it.', a, (1 - a) * 22)}
      ${line('Professionally.', b, (1 - b) * 22, 'lime')}
    </div>`;
  }
  // ٣) الكتابة — 9 إلى 17.6
  else if (t < 17.6) {
    const p = w(t, 9.4, 15.6);
    const txt = typed(BRIEF, p).replace(/\n/g, '<br>');
    const caret = Math.floor(t * 2) % 2 && p < 1 ? `<span style="color:${ACCENT}">|</span>` : '';
    const boxIn = easeOut(w(t, 9.0, 9.6));
    body = `${glow(0.35)}<div class="c">
      <div style="width:100%;max-width:${px(1180)};opacity:${boxIn};transform:scale(${0.97 + 0.03 * boxIn})">
        <div style="text-align:left;font-size:${px(26)};color:${MUTED};letter-spacing:${px(3)};
             font-weight:700;margin-bottom:${px(18)}">TELL ME ABOUT YOUR PROJECT</div>
        <div style="border:${px(3)} solid #23262C;border-radius:${px(20)};background:#14161B;
             padding:${px(40)} ${px(46)};min-height:${px(V ? 520 : 400)};text-align:left;
             font-size:${px(V ? 52 : 46)};line-height:1.62;color:${TEXT}">${txt}${caret}</div>
      </div>
    </div>`;
  }
  // ٤) النبض والقفزة — 17.6 إلى 23
  else if (t < 23.0) {
    const pw = V ? 860 : 1200;
    const ph = V ? 300 : 260;
    const spike = w(t, 19.2, 19.9);
    const tag = easeOut(w(t, 19.9, 20.5));
    const sub = easeOut(w(t, 21.0, 21.8));
    body = `${glow(0.4 + 0.6 * spike)}<div class="c">
      <div style="position:relative;width:${px(pw)};height:${px(ph)}">
        <svg viewBox="0 0 ${pw} ${ph}" style="width:100%;height:100%;overflow:visible">
          <polyline points="${pulse(pw, ph, spike)}" fill="none" stroke="${ACCENT}"
            stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/></svg>
        <div style="position:absolute;left:${((0.58 * pw - 15) / pw) * 100}%;top:${(0.5 - 0.42 * spike) * 100}%;
             width:${px(30)};height:${px(30)};border-radius:50%;background:${ACCENT};
             box-shadow:0 0 ${px(56)} ${ACCENT};transform:translate(-50%,-50%);opacity:${spike}"></div>
        <div style="position:absolute;left:${((0.58 * pw + 60) / pw) * 100}%;top:${(0.5 - 0.42) * 100}%;
             transform:translateY(-50%);font-size:${px(40)};font-weight:800;color:${ACCENT};opacity:${tag}">caught</div>
      </div>
      <div style="margin-top:${px(70)};font-size:${px(44)};color:${MUTED};opacity:${sub}">
        Less than a minute later, my inbox.</div>
    </div>`;
  }
  // ٥) الحقائق — 23 إلى 31
  else if (t < 31.0) {
    const rows = [
      ['It read it.', 23.4],
      ['It replied. In Arabic.', 25.4],
      ['In under a minute.', 27.4],
    ];
    body = `${glow(0.5)}<div class="c" style="gap:${px(34)}">
      ${rows
        .map(([txt, at], i) => {
          const o = easeOut(w(t, at, at + 0.85));
          return `<h1 style="opacity:${o};transform:translateY(${px((1 - o) * 20)});
                  ${i === 2 ? `color:${ACCENT}` : ''}">${txt}</h1>`;
        })
        .join('')}
    </div>`;
  }
  // ٦) البنش لاين — 31 إلى 35.4
  else if (t < 35.4) {
    const a = easeOut(w(t, 31.2, 32.2));
    const b = easeOut(w(t, 33.0, 34.0));
    body = `${glow(0.7)}<div class="c">
      ${line('I got out-professionaled', a, (1 - a) * 24)}
      ${line('by my own software.', b, (1 - b) * 24, 'lime')}
    </div>`;
  }
  // ٧) الختام — 35.4 إلى 40
  else {
    const lg = easeOut(w(t, 35.6, 36.5));
    const s1 = easeOut(w(t, 36.8, 37.7));
    const s2 = easeOut(w(t, 38.0, 38.9));
    body = `${glow(1.1)}<div class="c" style="gap:${px(40)}">
      <img src="${logo}" style="width:${px(190)};opacity:${lg};transform:scale(${0.74 + 0.26 * lg});
           filter:drop-shadow(0 0 ${px(40 * lg)} ${ACCENT}66)">
      <h1 style="opacity:${s1};font-size:${px(V ? 62 : 58)}">It answers every brief<br>that hits the site.</h1>
      <div style="opacity:${s2};font-size:${px(44)};font-weight:700;color:${MUTED};direction:ltr">
        ryanalali<span style="color:${ACCENT}">.me</span></div>
    </div>`;
  }

  return `${head}${body}${vig()}${fadeOut(t)}</body></html>`;
};

// ─── فحص: ولا em-dash بأي نص ───
{
  const all = [BRIEF, 'I built an AI agent', 'for my own website.', 'Then I tested it.', 'Professionally.',
    'caught', 'Less than a minute later, my inbox.', 'It read it.', 'It replied. In Arabic.', 'In under a minute.',
    'I got out-professionaled', 'by my own software.', 'It answers every brief that hits the site.'].join(' ');
  if (/[—–]/.test(all)) throw new Error('em-dash بنص الفيلم');
}

const dir = `${LP}/joke-caught`;
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.route('http://joke.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://joke.local/');

if (process.argv[3] === 'preview') {
  const PV = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
  for (const pt of [2, 7, 14, 20.3, 26, 33, 38]) {
    await page.setContent(scene(pt), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `${PV}/joke-${ori}-${String(pt).replace('.', '_')}.png` });
  }
  await browser.close();
  console.log('✅ معاينة جاهزة');
  process.exit(0);
}

const frames = `${dir}/frames-${ori}`;
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames, { recursive: true });
const total = Math.round(DUR * FPS);
process.stdout.write(`🎬 caught-${ori}: ${total} إطار `);
for (let f = 0; f < total; f++) {
  await page.setContent(scene(f / FPS), { waitUntil: f === 0 ? 'networkidle' : 'load' });
  if (f === 0) await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${frames}/f${String(f).padStart(4, '0')}.png` });
  if (f % 120 === 0) process.stdout.write('·');
}
await browser.close();

const fadeSt = (DUR - 1.5).toFixed(2);
execSync(
  `"${FFMPEG}" -y -framerate ${FPS} -i "${frames}/f%04d.png" -i "${MUSIC}" ` +
    `-filter_complex "[1:a]atrim=0:${DUR},afade=t=in:d=0.2,afade=t=out:st=${fadeSt}:d=1.5,volume=0.8[a]" ` +
    `-map 0:v -map "[a]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k ` +
    `-movflags +faststart -shortest "${dir}/caught-${ori}.mp4"`,
  { stdio: 'pipe' },
);
rmSync(frames, { recursive: true, force: true });
console.log(` ✅ joke-caught/caught-${ori}.mp4`);
