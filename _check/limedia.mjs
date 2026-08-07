// ═══════════════════════════════════════════════════════════════
//  تصاميم Media للينكدإن — جوّا قسم الخبرة (2026-08-08)
//
//  الجمهور: مدير توظيف أمريكي بيتصفّح بسرعة. فالنص إنجليزي، والفكرة
//  لازم توصل من الشكل قبل ما يقرا.
//
//  ⚠️ قاعدة ريّان: **ولا تصميمين بنفس الشكل.** الضوء واللون هما اللغة
//     المشتركة، مش الشكل. كل واحد هون إله فكرة مجرّدة مستقلة:
//       ١) خيوط متشابكة وواحد بينفصل   ← التشخيص
//       ٢) حقل نقاط بفجوات              ← مسح السوق
//       ٣) أعمدة زمنية شاذة             ← كشف التلاعب
//       ٤) قمع بينضيّق لعلامة وحدة       ← تكلفة النتيجة
//       ٥) شبكة صفحات وسبعة مضيئة       ← الموقع
//
//  ⚠️ الخط Alexandria مضمّن base64 — بلا هيك Playwright بيسقط بصمت
//     على خط النظام. (نفس درس og.jpg)
//
//  المقاس 1200×627 — نفس نسبة معاينة لينكدإن، بيتعرض نظيف بالكاروسيل.
//  التشغيل: node _check/limedia.mjs
// ═══════════════════════════════════════════════════════════════
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/linkedin';
mkdirSync(OUT, { recursive: true });

const LIME = '#D9FF3F';
const INK = '#0E0F12';
const PAPER = '#F2F3EE';
const MUTE = '#8C9086';

const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');
const FF = `@font-face{font-family:'Alexandria Variable';font-weight:100 900;font-display:block;
  src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');}`;

// بذرة ثابتة — نفس الرسمة بكل تشغيل
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ═══ ١) التشخيص: خيوط متشابكة وواحد بينفصل نظيف ═══
const artDiagnose = () => {
  let p = '';
  for (let i = 0; i < 22; i++) {
    const y = 90 + rnd(i) * 340;
    const w1 = (rnd(i + 40) - 0.5) * 130;
    const w2 = (rnd(i + 80) - 0.5) * 130;
    p += `<path d="M 20 ${y} C 150 ${y + w1}, 300 ${y + w2}, 440 ${y + w1 * 0.4}"
           fill="none" stroke="${PAPER}" stroke-width="1.4" opacity="0.16"/>`;
  }
  // الخيط الواحد اللي بيخرج نظيف
  p += `<path d="M 20 300 C 170 240, 300 350, 470 296 S 660 250, 800 288"
         fill="none" stroke="${LIME}" stroke-width="4" stroke-linecap="round"/>`;
  p += `<circle cx="800" cy="288" r="8" fill="${LIME}"/>`;
  return `<svg viewBox="0 0 840 470" style="width:100%;height:100%">${p}</svg>`;
};

// ═══ ٢) مسح السوق: حقل نقاط، والفجوات هي الرسالة ═══
const artMarket = () => {
  let p = '';
  const cols = 34, rows = 15;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const gap = rnd(i) < 0.42;           // ٤٢٪ فجوة — قريبة من نسبة «بلا موقع»
      const x = 24 + c * 23.5, y = 40 + r * 27;
      p += gap
        ? `<circle cx="${x}" cy="${y}" r="3.4" fill="none" stroke="${LIME}" stroke-width="1.5" opacity="0.85"/>`
        : `<circle cx="${x}" cy="${y}" r="2.6" fill="${PAPER}" opacity="0.22"/>`;
    }
  }
  return `<svg viewBox="0 0 840 470" style="width:100%;height:100%">${p}</svg>`;
};

// ═══ ٣) كشف التلاعب: أعمدة موزّعة مقابل ثلاث قفزات ═══
const artReviews = () => {
  let p = '';
  // الطبيعي: موزّع على كل الأيام
  for (let i = 0; i < 27; i++) {
    const x = 30 + i * 14;
    const h = 26 + rnd(i) * 54;
    p += `<rect x="${x}" y="${250 - h}" width="6" height="${h}" rx="3" fill="${PAPER}" opacity="0.26"/>`;
  }
  p += `<text x="30" y="286" fill="${MUTE}" font-size="17" font-family="Alexandria Variable">peers: 27 days</text>`;
  // الشاذ: ثلاثة أعمدة عالية وبس
  for (const [i, x] of [520, 596, 672].entries()) {
    const h = [150, 118, 134][i];
    p += `<rect x="${x}" y="${250 - h}" width="26" height="${h}" rx="4" fill="${LIME}"/>`;
  }
  p += `<text x="520" y="286" fill="${LIME}" font-size="17" font-family="Alexandria Variable">this venue: 3 days</text>`;
  p += `<line x1="470" y1="60" x2="470" y2="300" stroke="${PAPER}" stroke-width="1" opacity="0.14" stroke-dasharray="5 7"/>`;
  return `<svg viewBox="0 0 840 380" style="width:100%;height:100%">${p}</svg>`;
};

// ═══ ٤) تكلفة النتيجة: كثير بيدخلوا، واحد بيطلع ═══
const artCost = () => {
  let p = '';
  for (let i = 0; i < 64; i++) {
    const x = 40 + (i % 16) * 30;
    const y = 44 + Math.floor(i / 16) * 26;
    p += `<circle cx="${x}" cy="${y}" r="3" fill="${PAPER}" opacity="${0.10 + rnd(i) * 0.16}"/>`;
  }
  p += `<path d="M 40 168 L 800 168 L 470 330 Z" fill="none" stroke="${PAPER}" stroke-width="1.5" opacity="0.2"/>`;
  p += `<circle cx="470" cy="356" r="10" fill="${LIME}"/>`;
  p += `<line x1="470" y1="330" x2="470" y2="344" stroke="${LIME}" stroke-width="3"/>`;
  return `<svg viewBox="0 0 840 400" style="width:100%;height:100%">${p}</svg>`;
};

// ═══ ٥) الموقع: شبكة صفحات، وسبعة منها بتضوي ═══
const artSite = () => {
  let p = '';
  const cols = 26, rows = 10;
  const lit = new Set([31, 58, 97, 134, 176, 203, 241]); // سبع أدوات
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const x = 26 + c * 31, y = 40 + r * 40;
      p += lit.has(i)
        ? `<rect x="${x}" y="${y}" width="20" height="27" rx="2.5" fill="${LIME}"/>`
        : `<rect x="${x}" y="${y}" width="20" height="27" rx="2.5" fill="none" stroke="${PAPER}" stroke-width="1.2" opacity="0.20"/>`;
    }
  }
  return `<svg viewBox="0 0 840 460" style="width:100%;height:100%">${p}</svg>`;
};

const page = (t) => `<!doctype html><html><head><meta charset="utf-8"><style>
  ${FF}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:627px;background:${INK};position:relative;overflow:hidden;
       font-family:'Alexandria Variable',Inter,sans-serif;color:${PAPER};display:flex}
  .glow{position:absolute;right:-14%;bottom:-40%;width:760px;height:760px;
        background:radial-gradient(circle, ${LIME}18 0%, transparent 66%)}
  .wrap{position:relative;flex:1;display:flex;flex-direction:column;padding:56px 66px 50px}
  .kick{font-size:16px;letter-spacing:.26em;color:${LIME};font-weight:700;text-transform:uppercase}
  .h{font-size:44px;font-weight:800;letter-spacing:-.02em;line-height:1.12;margin-top:14px;max-width:900px}
  .art{flex:1;margin:24px 0 14px;min-height:0}
  .foot{display:flex;justify-content:space-between;align-items:flex-end;gap:24px}
  .note{font-size:20px;color:${MUTE};font-weight:500;max-width:760px;line-height:1.4}
  .url{font-size:19px;font-weight:700;color:${PAPER};white-space:nowrap;opacity:.9}
</style></head><body>
  <div class="glow"></div>
  <div class="wrap">
    <div class="kick">${t.kick}</div>
    <div class="h">${t.h}</div>
    <div class="art">${t.art()}</div>
    <div class="foot"><div class="note">${t.note}</div><div class="url">ryanalali.me</div></div>
  </div>
</body></html>`;

const V = [
  { file: 'li-1-diagnose.png', kick: 'How I work', art: artDiagnose,
    h: 'I diagnose before I build.',
    note: 'Everything looks tangled until you find the one line that actually carries the business.' },
  { file: 'li-2-market.png', kick: 'Market analysis', art: artMarket,
    h: '2,169 businesses. 23 sectors.<br>The gaps were not even.',
    note: '73% of auto repair shops had no website. Travel agencies: 18%. The pitch that works in one vertical is the wrong pitch in another.' },
  { file: 'li-3-reviews.png', kick: 'Signal vs noise', art: artReviews,
    h: 'A 4.5 rating that meant nothing.',
    note: '2,140 reviews landing on 3 days while every competitor spread across 21 to 27. Review count is not always traction.' },
  { file: 'li-4-cost.png', kick: 'Paid search', art: artCost,
    h: 'One number decides everything.',
    note: 'Cost per result. Not reach, not impressions, not engagement. I read impression share lost to rank and to budget separately, because they are different problems.' },
  { file: 'li-5-site.png', kick: 'Proof, not claims', art: artSite,
    h: '130+ pages. 7 built from scratch.',
    note: 'Seven long-form articles, each carrying an original interactive tool I wrote in code. Try them before you ever speak to me.' },
];

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1200, height: 627 }, deviceScaleFactor: 2 });
for (const t of V) {
  await p.setContent(page(t), { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(180);
  await p.screenshot({ path: `${OUT}/${t.file}`, clip: { x: 0, y: 0, width: 1200, height: 627 }, timeout: 20000 });
  console.log(`✅ ${t.file}`);
}
await browser.close();
