// ═══════════════════════════════════════════════════════════════
//  فيديوهات الخدمات — الدفعة الثانية (2026-08-05 المسا)
//
//  خدمتين × لغتين، كل فيديو بطول موسيقاه كاملة (شرط ريّان) وكل
//  قصّة على ضربة حقيقية من beatscan:
//   social: فلاش نيوز 46.5ث · BPM 114.5 · b(n)=0.29+0.524n
//   brand:  ملحمية 92.2ث · BPM 62 · b(n)=0.24+0.968n
//           (هدوء 0-12 ← صعود 12 ← جسر هادي 50-63 ← دروب 64)
//  إيقاع القراءة مريح عن قصد — الزائر بيقرأ مش بيلاحق.
//
//  التشغيل: node _check/promolp2.mjs social ar|en
//           node _check/promolp2.mjs brand ar|en
//  المخرج: Promo-LP/video-4/5-*/final-<lang>.mp4
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
const easeInOut = (x) => (clamp01(x) < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const w = (t, a, b) => clamp01((t - a) / (b - a));
const seeded = (i) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

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
  h1{line-height:1.35}
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

// الختام الموحد: السلوغان + اللوجو + الدومين
const ending = (t, at) => {
  const lg = easeOut(w(t, at, at + 0.8));
  const sl = easeOut(w(t, at + 1.6, at + 2.5));
  const slogan = isAr
    ? `تسويق <span style="color:${ACCENT}">يبني</span>، ونتائج بتنقاس <span style="color:${ACCENT}">بالأرقام</span>.`
    : `Marketing that <span style="color:${ACCENT}">builds</span>. Results you can <span style="color:${ACCENT}">measure</span>.`;
  return `${glow(1.4)}<div class="center" style="gap:46px">
    <img src="${logo}" style="width:190px;height:190px;opacity:${lg};transform:scale(${0.72 + 0.28 * lg});
         filter:drop-shadow(0 0 ${36 * lg}px ${ACCENT}66)">
    <h1 style="font-size:62px;font-weight:800;opacity:${sl}">${slogan}</h1>
    <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:40px;color:${MUTED};direction:ltr;opacity:${sl}">ryanalali<span style="color:${ACCENT}">.me</span></p>
  </div>${thread(w(t, at + 1, at + 5), 960, 0.55)}`;
};

// ═══════════════════════════════════════════════════════════════
//  السوشال ميديا · 46.5ث · قصّات على b(n)=0.29+0.524n
// ═══════════════════════════════════════════════════════════════
const socialT = isAr
  ? {
      s1a: 'هاد كل الانتباه اللي بياخده بوستك.',
      s1b: 'ثواني',
      s2: 'إذا ما وقّف الإبهام…',
      s2b: 'ما صار إشي.',
      s3a: 'السوشال مش بوستات حلوة.',
      s3b: ['رسالة', 'توقيت', 'قياس'],
      s3c: 'نظام:',
      s4: ['خطة محتوى شهرية', 'هوية ثابتة بكل بوست', 'أرقام واضحة كل أسبوع'],
      s5a: 'جرّب لعبة «عداد الانتباه» بنفس الصفحة،',
      s5b: 'وشوف بنفسك أي بوست بيعيش.',
    }
  : {
      s1a: "That's all the attention your post gets.",
      s1b: 'seconds',
      s2: "If the thumb doesn't stop…",
      s2b: 'nothing happened.',
      s3a: "Social isn't pretty posts.",
      s3b: ['Message', 'Timing', 'Measurement'],
      s3c: "It's a system:",
      s4: ['A monthly content plan', 'One identity on every post', 'Clear numbers every week'],
      s5a: 'Try the attention counter on this page,',
      s5b: 'and see for yourself which post survives.',
    };

const social = (t) => {
  const DUR = 46.5;
  let s = '';
  if (t < 7.62) {
    // S1: العداد 3←0 بينبض مع الضربة
    const a = easeOut(w(t, 0.29, 1.1));
    const val = Math.max(0, 3 - Math.floor(w(t, 1.3, 6.5) * 4));
    const pulse = 1 + 0.05 * Math.pow(Math.max(0, Math.cos(((t - 0.29) / 0.524) * Math.PI * 2)), 3);
    s = `${glow(0.7)}<div class="center" style="gap:20px">
      <p style="font-family:'Grotesk','Alexandria',sans-serif;font-size:300px;font-weight:700;color:${ACCENT};line-height:1;
         opacity:${a};transform:scale(${pulse})">${val}</p>
      <p style="font-size:40px;color:${MUTED};opacity:${a}">${socialT.s1b}</p>
      <h1 style="font-size:56px;font-weight:800;opacity:${easeOut(w(t, 2.4, 3.2))}">${socialT.s1a}</h1>
    </div>`;
  } else if (t < 15.48) {
    // S2: كروت فيد بتمرق بسرعة وواحد بيوقف بحدود ليمونية
    const cards = [...Array(7)]
      .map((_, i) => {
        const y = 1200 - ((t - 7.62) * 620 + i * 300) % 2100;
        const stop = i === 3 && t > 11.8;
        const yy = stop ? Math.max(y, 330) : y;
        return `<div style="position:absolute;left:${560 + (i % 2) * 420}px;top:${yy}px;width:380px;height:260px;
          background:#17191E;border-radius:18px;border:2px solid ${stop ? ACCENT : '#22252B'};
          ${stop ? `box-shadow:0 0 60px ${ACCENT}33;` : ''}opacity:.9">
          <div style="height:14px;width:${140 + seeded(i) * 160}px;background:#2A2D34;border-radius:99px;margin:26px 28px 0"></div>
          <div style="height:14px;width:${100 + seeded(i + 9) * 180}px;background:#22252B;border-radius:99px;margin:14px 28px 0"></div></div>`;
      })
      .join('');
    const a1 = easeOut(w(t, 8.2, 9.0));
    const a2 = easeOut(w(t, 12.05, 12.8));
    s = `${glow()}${cards}
      <h1 style="position:absolute;top:120px;left:0;width:100%;text-align:center;font-size:60px;font-weight:800;opacity:${a1}">${socialT.s2}</h1>
      <h1 style="position:absolute;bottom:130px;left:0;width:100%;text-align:center;font-size:72px;font-weight:800;color:${ACCENT};opacity:${a2}">${socialT.s2b}</h1>`;
  } else if (t < 23.34) {
    const a1 = easeOut(w(t, 15.48, 16.3));
    const chips = socialT.s3b
      .map((c, i) => {
        const p = easeOut(w(t, 18.1 + i * 1.05, 18.8 + i * 1.05));
        return `<span style="display:inline-block;margin:0 14px;background:#15171C;border:2px solid ${ACCENT}55;border-radius:999px;
          padding:20px 44px;font-size:44px;font-weight:800;opacity:${p};transform:translateY(${(1 - p) * 26}px)">${c}</span>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:56px">
      <h1 style="font-size:76px;font-weight:800;opacity:${a1}">${socialT.s3a}</h1>
      <p style="font-size:48px;color:${MUTED};opacity:${easeOut(w(t, 17.05, 17.7))}">${socialT.s3c}</p>
      <div>${chips}</div>
    </div>`;
  } else if (t < 31.2) {
    const rows = socialT.s4
      .map((r, i) => {
        const p = easeOut(w(t, 23.5 + i * 1.57, 24.3 + i * 1.57));
        return `<div style="display:flex;align-items:center;gap:26px;opacity:${p};transform:translate${isAr ? 'X' : 'X'}(${(1 - p) * (isAr ? 40 : -40)}px)">
          <span style="width:16px;height:16px;background:${ACCENT};border-radius:4px;flex-shrink:0"></span>
          <span style="font-size:54px;font-weight:700">${r}</span></div>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:44px;align-items:flex-start;padding:0 320px">${rows}</div>${thread(w(t, 24, 30))}`;
  } else if (t < 38.82) {
    const a1 = easeOut(w(t, 31.2, 32.0));
    const a2 = easeOut(w(t, 33.3, 34.1));
    s = `${glow(1.1)}<div class="center" style="gap:40px">
      <h1 style="font-size:58px;font-weight:800;opacity:${a1}">${socialT.s5a}</h1>
      <h1 style="font-size:64px;font-weight:800;color:${ACCENT};opacity:${a2}">${socialT.s5b}</h1>
    </div>`;
  } else {
    s = ending(t, 38.82);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

// ═══════════════════════════════════════════════════════════════
//  الهوية البصرية · 92.2ث · b(n)=0.24+0.968n · القوس الدرامي:
//  هدوء ← صعود 11.85 ← نظام ← جسر هادي 50.6 ← دروب 63.2 ← ختام
// ═══════════════════════════════════════════════════════════════
const brandT = isAr
  ? {
      s1a: 'في علامات بتشوفها مرة…',
      s1b: 'وبتنساها بنفس اللحظة.',
      s2: 'وفي علامات بتعرفها من بعيد، قبل ما تقرأ الاسم.',
      s3: 'الفرق مش اللوجو.',
      s4a: 'الفرق نظام:',
      s4b: ['لون بيثبت', 'خط بيحكي', 'نبرة ما بتتغير'],
      s5a: 'الهوية الصح بتشتغل بكل مكان:',
      s5b: ['بوست', 'فاتورة', 'لافتة', 'موقع'],
      s6a: 'وبتضل ثابتة…',
      s6b: 'لما الترندات تروح وتيجي.',
      s7a: 'جرّب «عين البراند» بنفس الصفحة:',
      s7b: 'شوف بعينك ليش تصميم بيثبت، وتصميم بينتسى.',
    }
  : {
      s1a: 'Some brands you see once…',
      s1b: 'and forget instantly.',
      s2: 'And some you know from across the street, before you read the name.',
      s3: "The difference isn't the logo.",
      s4a: "It's a system:",
      s4b: ['A colour that sticks', 'A typeface that speaks', 'A voice that never changes'],
      s5a: 'Real identity works everywhere:',
      s5b: ['A post', 'An invoice', 'A sign', 'A website'],
      s6a: 'And it holds steady…',
      s6b: 'while trends come and go.',
      s7a: 'Try the Brand Eye on this page:',
      s7b: 'see why one design sticks, and another disappears.',
    };

const brand = (t) => {
  const DUR = 92.2;
  let s = '';
  if (t < 11.85) {
    // S1: الهمس بالهدوء
    const a1 = easeOut(w(t, 1.2, 2.6));
    const a2 = easeOut(w(t, 6.0, 7.4));
    s = `${glow(0.4)}<div class="center" style="gap:52px">
      <h1 style="font-size:64px;font-weight:700;color:${MUTED};opacity:${a1}">${brandT.s1a}</h1>
      <h1 style="font-size:56px;font-weight:700;color:#5C6058;opacity:${a2}">${brandT.s1b}</h1>
    </div>`;
  } else if (t < 19.6) {
    // S2: الصعود الموسيقي — العلامة اللي بتنعرف من بعيد
    const a = easeOut(w(t, 11.85, 12.9));
    const ring = easeInOut(w(t, 12.5, 17.5));
    s = `${glow(0.9)}
      <div style="position:absolute;left:50%;top:300px;transform:translateX(-50%);width:${180 + ring * 60}px;height:${180 + ring * 60}px;
        border-radius:${50 - ring * 28}%;background:${ACCENT};opacity:.92;
        box-shadow:0 0 ${60 + ring * 60}px ${ACCENT}55"></div>
      <h1 style="position:absolute;bottom:250px;left:0;width:100%;text-align:center;font-size:64px;font-weight:800;padding:0 200px;
        opacity:${a};transform:translateY(${(1 - a) * 30}px)">${brandT.s2}</h1>`;
  } else if (t < 29.28) {
    const a = easeOut(w(t, 19.6, 20.5));
    s = `${glow(1.2)}<div class="center">
      <h1 style="font-size:120px;font-weight:800;opacity:${a};transform:scale(${1.12 - 0.12 * a})">${brandT.s3}</h1>
    </div>`;
  } else if (t < 40.9) {
    // S4: النظام — ثلاث بطاقات رمزية عالضربات
    const a0 = easeOut(w(t, 29.28, 30.1));
    const cards = brandT.s4b
      .map((c, i) => {
        const p = easeOut(w(t, 31.2 + i * 1.94, 32.2 + i * 1.94));
        const visual =
          i === 0
            ? `<div style="width:110px;height:110px;border-radius:24px;background:${ACCENT};margin-inline:auto"></div>`
            : i === 1
              ? `<p style="font-size:92px;font-weight:800;line-height:1;color:${TEXT}">${isAr ? 'ش' : 'Aa'}</p>`
              : `<p style="font-size:64px;font-weight:800;color:${TEXT}">&ldquo;&nbsp;&rdquo;</p>`;
        return `<div style="width:420px;height:380px;background:#15171C;border:2px solid ${ACCENT}44;border-radius:26px;
          padding:48px 30px;display:flex;flex-direction:column;justify-content:space-between;align-items:center;
          opacity:${p};transform:scale(${1.35 - 0.35 * p});filter:blur(${(1 - p) * 8}px)">
          ${visual}<p style="font-size:40px;font-weight:800">${c}</p></div>`;
      })
      .join('');
    s = `${glow()}
      <p style="position:absolute;top:100px;left:0;width:100%;text-align:center;font-size:52px;font-weight:800;opacity:${a0}">${brandT.s4a}</p>
      <div style="position:absolute;top:280px;left:0;width:100%;display:flex;justify-content:center;gap:44px">${cards}</div>`;
  } else if (t < 50.58) {
    const a0 = easeOut(w(t, 40.9, 41.8));
    const chips = brandT.s5b
      .map((c, i) => {
        const p = easeOut(w(t, 42.9 + i * 1.45, 43.8 + i * 1.45));
        return `<span style="display:inline-block;margin:0 16px;border:2px solid ${ACCENT}66;border-radius:18px;
          padding:26px 54px;font-size:48px;font-weight:800;background:#12141A;opacity:${p};transform:translateY(${(1 - p) * 30}px)">${c}</span>`;
      })
      .join('');
    s = `${glow()}<div class="center" style="gap:70px">
      <h1 style="font-size:64px;font-weight:800;opacity:${a0}">${brandT.s5a}</h1>
      <div>${chips}</div>
    </div>${thread(w(t, 42, 49))}`;
  } else if (t < 63.15) {
    // S6: الجسر الهادي — السطر الشاعري ببطء
    const a1 = easeOut(w(t, 51.5, 53.5));
    const a2 = easeOut(w(t, 56.5, 58.5));
    s = `${glow(0.35)}<div class="center" style="gap:58px">
      <h1 style="font-size:76px;font-weight:800;opacity:${a1}">${brandT.s6a}</h1>
      <h1 style="font-size:60px;font-weight:700;color:${MUTED};opacity:${a2}">${brandT.s6b}</h1>
    </div>`;
  } else if (t < 76) {
    // S7: الدروب الثاني — لعبة عين البراند
    const a1 = easeOut(w(t, 63.15, 64.0));
    const a2 = easeOut(w(t, 66.1, 67.0));
    const pulse = 1 + 0.35 * Math.pow(Math.max(0, Math.cos(((t - 63.15) / 0.968) * Math.PI * 2)), 3);
    s = `${glow(pulse)}<div class="center" style="gap:48px">
      <h1 style="font-size:66px;font-weight:800;opacity:${a1}">${brandT.s7a}</h1>
      <h1 style="font-size:58px;font-weight:800;color:${ACCENT};opacity:${a2}">${brandT.s7b}</h1>
    </div>`;
  } else {
    s = ending(t, 76);
  }
  return `${head}${s}${tail(t, DUR)}</body></html>`;
};

// ═══════════════════════════════════════════════════════════════
const CONF = {
  social: {
    dir: 'video-4-social-media',
    music: 'sonican-flash-news-breakthrough-loop-222252.mp3',
    fn: social,
    dur: 46.5,
  },
  brand: {
    dir: 'video-5-brand-identity',
    music: 'comastudio-abstract-epic-technology-electronica_star-197960.mp3',
    fn: brand,
    dur: 92.2,
  },
};

const pick = CONF[service];
if (!pick) {
  console.log('حدد: node _check/promolp2.mjs social|brand ar|en');
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
