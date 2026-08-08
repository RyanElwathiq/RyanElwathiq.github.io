// ═══════════════════════════════════════════════════════════════
//  غلاف صفحة الشركة بلينكدإن (2026-08-08)
//
//  ⚠️ المقاس 1128×191 — شريط طويل ورفيع جداً (نسبة 5.9:1).
//     وهاد بيغيّر التصميم كلياً: سطر واحد كبير وبس. أي تصميم فيه
//     أكثر من فكرة بينضغط ويصير غير مقروء.
//
//  ⚠️ الشعار بيقع فوق الجهة اليسرى (RTL: اليمنى بالعرض الفعلي) وبيغطي
//     دائرة قطرها ~١٦٠px من الغلاف. فالنص لازم يبعد عن الطرف الأيسر.
//
//  ⚠️ الأطراف بتنقص على الشاشات الضيقة — المحتوى بمنطقة آمنة بالوسط.
//
//  التشغيل: node _check/licover.mjs
// ═══════════════════════════════════════════════════════════════
import { chromium } from 'playwright';
import { readFileSync, mkdirSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Social/linkedin';
mkdirSync(OUT, { recursive: true });

const LIME = '#D9FF3F';
const INK = '#0E0F12';
const PAPER = '#F2F3EE';
const MUTE = '#9DA196';

const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');
const FF = `@font-face{font-family:'Alexandria';font-weight:100 900;font-display:block;
  src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');}`;

// خيط الإشارة — بيمشي بطول الشريط، نفس المجرّد اللي بالأفلام
const thread = `
<svg viewBox="0 0 1128 191" preserveAspectRatio="none"
     style="position:absolute;inset:0;width:100%;height:100%">
  <path d="M -20 132 C 180 96, 330 156, 520 120 S 830 78, 1160 108"
        fill="none" stroke="${LIME}" stroke-width="2.4" opacity="0.55" stroke-linecap="round"/>
  <path d="M -20 152 C 200 122, 360 176, 560 142 S 860 104, 1160 130"
        fill="none" stroke="${LIME}" stroke-width="1.6" opacity="0.16" stroke-linecap="round"/>
</svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  ${FF}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1128px;height:191px;background:${INK};position:relative;overflow:hidden;
       font-family:'Alexandria',Inter,sans-serif;color:${PAPER}}
  .glow{position:absolute;right:-8%;top:-120%;width:520px;height:520px;
        background:radial-gradient(circle, ${LIME}22 0%, transparent 66%)}
  /* ⚠️ padding-left كبير: مكان الشعار اللي بيركبه لينكدإن فوق الغلاف */
  .pad{position:absolute;inset:0;padding:0 58px 0 224px;
       display:flex;flex-direction:column;justify-content:center}
  .big{font-size:38px;font-weight:800;letter-spacing:-.022em;line-height:1.1}
  .lime{color:${LIME}}
  .sub{font-size:16.5px;color:${MUTE};font-weight:500;margin-top:9px;letter-spacing:.012em}
</style></head><body>
  <div class="glow"></div>
  ${thread}
  <div class="pad">
    <div class="big">I don’t sell posts. <span class="lime">I diagnose, then build.</span></div>
    <div class="sub">Strategy · Paid ads · SEO · Brand · Websites that sell &nbsp;|&nbsp; Amman, Jordan &nbsp;|&nbsp; ryanalali.me</div>
  </div>
</body></html>`;

const browser = await chromium.launch();
const p = await browser.newPage({ viewport: { width: 1128, height: 191 }, deviceScaleFactor: 2 });
await p.setContent(html, { waitUntil: 'domcontentloaded' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(180);
await p.screenshot({ path: `${OUT}/company-cover.png`, clip: { x: 0, y: 0, width: 1128, height: 191 }, timeout: 20000 });
await browser.close();
console.log(`✅ ${OUT}/company-cover.png  (1128×191 @2x)`);
