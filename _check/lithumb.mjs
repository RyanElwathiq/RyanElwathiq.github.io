// ═══════════════════════════════════════════════════════════════
//  ثمبنيل Featured للينكدإن (2026-08-08)
//
//  ليش مخصّص؟ لأن لينكدإن بيسحب أول صورة أو الأيقونة، وبتطلع
//  شعار صغير على أسود — بتنقرا «رابط» مش «شغل يستاهل تكبس عليه».
//
//  المقاس 1200×627 — نسبة معاينة الروابط القياسية (1.91:1).
//  ⚠️ الثمبنيل بينشاف صغير بالفيد، فالنص لازم يكون قليل وكبير.
//     أي سطر تحت 30px بيختفي عملياً.
//
//  التشغيل: node _check/lithumb.mjs
// ═══════════════════════════════════════════════════════════════
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/linkedin';
mkdirSync(OUT, { recursive: true });

const LIME = '#D9FF3F';
const INK = '#0E0F12';
const PAPER = '#F2F3EE';
const MUTE = '#A0A49B';

// خيط الإشارة — نفس المجرّد اللي بكل الأفلام
const thread = (y, o) => `
<svg viewBox="0 0 1200 627" style="position:absolute;inset:0;width:100%;height:100%">
  <path d="M -40 ${y} C 260 ${y - 46}, 470 ${y + 40}, 720 ${y - 14} S 1080 ${y - 62}, 1240 ${y - 30}"
        fill="none" stroke="${LIME}" stroke-width="3" opacity="${o}" stroke-linecap="round"/>
</svg>`;

const glow = `<div style="position:absolute;right:-160px;top:-160px;width:620px;height:620px;
  background:radial-gradient(circle, ${LIME}22 0%, transparent 68%);pointer-events:none"></div>`;

const page = (big, small) => `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:627px;background:${INK};position:relative;overflow:hidden;
       font-family:"Segoe UI",Inter,system-ui,-apple-system,sans-serif;color:${PAPER}}
  .pad{position:absolute;inset:0;padding:74px 86px;display:flex;flex-direction:column;justify-content:space-between}
  .kicker{font-size:21px;letter-spacing:.30em;color:${LIME};font-weight:700;text-transform:uppercase}
  .big{font-size:86px;line-height:1.02;font-weight:800;letter-spacing:-.024em;max-width:960px}
  .small{font-size:31px;color:${MUTE};font-weight:500;margin-top:26px;letter-spacing:.005em}
  .foot{display:flex;align-items:baseline;gap:20px}
  .url{font-size:38px;font-weight:700;color:${PAPER}}
  .dot{width:11px;height:11px;border-radius:50%;background:${LIME};display:inline-block;margin-bottom:6px}
</style></head><body>
  ${glow}
  ${thread(508, 0.5)}
  ${thread(556, 0.13)}
  <div class="pad">
    <div class="kicker">Ryan Al-Wathiq</div>
    <div>
      <div class="big">${big}</div>
      <div class="small">${small}</div>
    </div>
    <div class="foot"><span class="dot"></span><span class="url">ryanalali.me</span></div>
  </div>
</body></html>`;

const VARIANTS = [
  {
    file: 'featured-a-dont-take-my-word.png',
    big: `Don’t take my<br>word for it.`,
    small: `130+ pages · 7 interactive tools · free to try`,
  },
  {
    file: 'featured-b-i-dont-sell-posts.png',
    big: `I don’t sell posts.<br>I diagnose, then build.`,
    small: `Strategy · Paid ads · SEO · Websites that sell`,
  },
];

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1200, height: 627 }, deviceScaleFactor: 2 });
for (const v of VARIANTS) {
  await p.setContent(page(v.big, v.small), { waitUntil: 'domcontentloaded' });
  // ⚠️ clip صريح: بلا هيك الالتقاط بينتظر حساب ارتفاع الصفحة كاملة وبيعلّق
  await p.screenshot({ path: `${OUT}/${v.file}`, clip: { x: 0, y: 0, width: 1200, height: 627 }, timeout: 20000 });
  console.log(`✅ ${OUT}/${v.file}`);
}
await browser.close();
