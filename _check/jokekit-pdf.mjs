// ═══════════════════════════════════════════════════════════════
//  الطقم الفكاهي «انمسكت» → مجلد + PDF (2026-08-08)
//
//  ٦ بوستات على الجمعة والسبت ١٤-١٥ آب — الأيام الوحيدة الفاضية
//  بجدولي لينكدإن وإنستغرام. المحتوى الشخصي بيمشي عالويكند أحسن
//  من محتوى الخدمات، وما بيزاحم ولا بوست مجدول.
//
//  ⚠️ الخط مضمّن base64 وإلا Playwright بيسقط على خط النظام.
//  التشغيل: node _check/jokekit-pdf.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { chromium } from 'playwright';

const SP = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
const LIB = 'G:/My Drive/ريّان الواثق — مكتبة الحملة/٤ — تصاميم السوشال/ما تحاول تتهبل';
const FILM = 'D:/Ryan-Work/Brand-Ryan/Promo-LP/joke-caught';
const OUT = 'D:/Ryan-Work/Brand-Ryan/Joke-Kit';
mkdirSync(OUT, { recursive: true });

const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');
const kit = JSON.parse(readFileSync(`${SP}/joke-kit.json`, 'utf8'));
kit.forEach((k) => { if (k.text === 'SAME_AS_1') k.text = kit[0].text; });

// ─── نسخ الميديا لمجلد واحد ───
const SRC = {
  'caught-h.mp4': `${FILM}/caught-h.mp4`,
  'caught-v.mp4': `${FILM}/caught-v.mp4`,
  'ما-تحاول-تتهبل.png': `${LIB}/بوست مربع/ما-تحاول-تتهبل.png`,
  'dont-try-it-EN.png': `${LIB}/بوست مربع/dont-try-it-EN.png`,
  'ما-تحاول-تتهبل (ستوري).png': `${LIB}/ستوري طولي/ما-تحاول-تتهبل.png`,
  'dont-try-it-EN (ستوري).png': `${LIB}/ستوري طولي/dont-try-it-EN.png`,
};
const missing = [];
for (const [dst, src] of Object.entries(SRC)) {
  if (!existsSync(src)) { missing.push(dst); continue; }
  copyFileSync(src, `${OUT}/${dst}`);
}
kit.forEach((k, i) => {
  const t = k.text;
  if (/[—–]/.test(t) && k.lang === 'en') throw new Error(`em-dash بنص ${i + 1}`);
  writeFileSync(`${OUT}/${String(i + 1).padStart(2, '0')} - ${k.platform} - ${k.day} ${k.date}.txt`,
    '\uFEFF' + t.replace(/\n/g, '\r\n'), 'utf8');
});

const INK = '#0E0F12', LIME = '#8FA800', SOFT = '#F4F5F0', MUTED = '#6B6F66';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

const card = (k, i) => `<section class="card">
  <div class="head">
    <div class="badge ${k.lang === 'en' ? 'en' : 'ar'}">${AR(i + 1)}</div>
    <div class="ttl">
      <h2 dir="${k.lang === 'en' ? 'ltr' : 'rtl'}">${esc(k.title)}</h2>
      <div class="meta">${k.platform} · ${k.kind}</div>
    </div>
    <div class="when"><b>${k.day} ${k.date}</b><span><code>${k.time}</code></span></div>
    <div class="chk"></div>
  </div>
  <div class="files"><span class="lbl">الملف</span> <code>${esc(k.media)}</code>
    · <span class="lbl">الرابط</span> <code>${esc(k.link)}</code></div>
  <pre class="copy" dir="${k.lang === 'en' ? 'ltr' : 'rtl'}">${esc(k.text)}</pre>
</section>`;

const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-arabic-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block;unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF,U+2700-27BF}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Alex',sans-serif;color:${INK};background:#fff;font-size:10.5px;line-height:1.75}
code{font-family:'Alex',monospace;background:${SOFT};padding:1px 5px;border-radius:3px;font-size:.94em;direction:ltr;display:inline-block}
.cover{padding:24px 0 30px}
.cover h1{font-size:34px;font-weight:800;line-height:1.3}
.cover .sub{font-size:13px;color:${MUTED};margin-top:8px}
.rule{margin-top:18px;border-right:4px solid ${LIME};background:${SOFT};padding:14px 17px;border-radius:0 8px 8px 0}
.rule b{font-size:12.5px}
h3.sec{font-size:18px;font-weight:800;margin:22px 0 12px;padding-bottom:7px;border-bottom:2px solid ${INK}}
.card{page-break-inside:avoid;border:1.5px solid #E4E6DF;border-radius:12px;padding:15px 17px;margin-bottom:13px}
.head{display:flex;align-items:center;gap:11px;margin-bottom:9px}
.badge{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:800;flex:none}
.badge.en{background:${INK};color:#D9FF3F}
.badge.ar{background:#D9FF3F;color:${INK}}
.ttl{flex:1}
.ttl h2{font-size:14px;font-weight:800;line-height:1.35}
.ttl .meta{font-size:9px;color:${MUTED};margin-top:1px}
.when{text-align:left;font-size:10px;line-height:1.5}
.when span{display:block;margin-top:2px}
.chk{width:15px;height:15px;border:1.5px solid ${MUTED};border-radius:3px;flex:none}
.files{font-size:9px;color:${MUTED};margin-bottom:8px}
.files .lbl{font-weight:700}
pre.copy{background:${SOFT};border-radius:8px;padding:11px 13px;font-family:'Alex',sans-serif;font-size:10px;line-height:1.85;white-space:pre-wrap;word-wrap:break-word}
</style></head><body>

<div class="cover">
  <h1>الطقم الفكاهي — «انمسكت»</h1>
  <div class="sub">٦ بوستات · الجمعة والسبت ١٤ و١٥ آب · لينكدإن وإنستغرام</div>

  <div class="rule">
    <b>ليش الجمعة والسبت؟</b><br>
    لأنهم اليومان الوحيدان الفاضيان بجدولي لينكدإن وإنستغرام. فهالطقم بينضاف
    <b>بلا ما يزاحم ولا بوست مجدول</b> وبلا ما نغيّر أي تاريخ. والمحتوى الشخصي
    بيمشي عالويكند أحسن من محتوى الخدمات أصلاً.
  </div>

  <div class="rule">
    <b>القصة حقيقية، وكل ادعاء فيها مفحوص.</b><br>
    الوكيل بيقرا كل طلب بيوصل الموقع ويرد عليه · الرد بيوصل بأقل من دقيقة ·
    الرد بالعربي. كلها انفحصت حي يوم ٨ آب.<br>
    نص الطلب الهبل بالفيديو <b>تمثيل مش اقتباس</b>، وما في ولا سطر بيدّعي إنه لقطة شاشة.
  </div>

  <div class="rule">
    <b>ليش هالبوست بيبيع أكثر من بوست خدمة؟</b><br>
    لأنه بيوري إنه النظام شغّال فعلاً، والنكتة عليك إنت مش على العميل.
    الناس بتشارك اللي بيضحّكها، وبتتذكر اللي بيوريها إشي مش شايفته كل يوم.
  </div>

  <div class="rule">
    <b>الملفات:</b> <code>D:\\Ryan-Work\\Brand-Ryan\\Joke-Kit</code>
  </div>
</div>

<h3 class="sec">البوستات</h3>
${kit.map(card).join('')}

</body></html>`;

const browser = await chromium.launch();
const p = await browser.newPage();
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(350);
const pdf = `${OUT}/الطقم الفكاهي — ٦ بوستات.pdf`;
await p.pdf({ path: pdf, format: 'A4', printBackground: true,
  margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
await browser.close();
console.log(`✅ ${kit.length} بوست → ${OUT}`);
console.log(missing.length ? `⚠️ ميديا ناقصة: ${missing.join(', ')}` : 'كل الميديا موجودة');
