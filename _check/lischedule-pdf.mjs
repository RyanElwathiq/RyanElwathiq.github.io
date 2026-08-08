// ═══════════════════════════════════════════════════════════════
//  دفتر جدولة لينكدإن → PDF (2026-08-08)
//
//  ٣٧ بوست: ١٣ فيلم إنجليزي + ١٣ فيلم عربي + ١١ تصميم عربي.
//  كل بوست بصفحة لحاله: الملف، التاريخ والساعة للبروفايل وللصفحة،
//  النص كامل جاهز للقراءة، ومربعان تعليم.
//
//  ⚠️ الخط Alexandria مضمّن base64 — بلا هيك Playwright بيسقط على
//     خط النظام بصمت والعربي بيطلع بخط تاني. (درس og.jpg)
//
//  التشغيل: node _check/lischedule-pdf.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { chromium } from 'playwright';

const SP = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
const OUTDIR = 'D:/Ryan-Work/Brand-Ryan/LinkedIn-Schedule';
mkdirSync(OUTDIR, { recursive: true });

const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');

const films = JSON.parse(readFileSync(`${SP}/rows.json`, 'utf8'));
const designs = JSON.parse(readFileSync(`${SP}/design-rows.json`, 'utf8'));

const INK = '#0E0F12', LIME = '#8FA800', PAPER = '#FFFFFF', SOFT = '#F4F5F0', MUTED = '#6B6F66';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

const ALL = [
  ...films.map((r) => ({
    n: +r.n, lang: r.lang, kind: 'film',
    title: r.lang === 'en' ? r.enTitle : r.arTitle,
    day: r.day, pDate: r.pDate, gDate: r.gDate,
    time: r.lang === 'en' ? '6:00 PM' : '9:00 AM',
    base: r.base, media: '.mp4 + .jpg', text: r.text, link: r.link,
  })),
  ...designs.map((r) => ({
    n: +r.n, lang: 'ar', kind: 'design',
    title: r.title, day: r.day, pDate: r.pDate, gDate: r.gDate,
    time: '9:00 AM', base: r.base, media: '.png', text: r.text, link: r.link,
  })),
];

const row = (p) => `<tr>
  <td class="num">${AR(p.n)}</td>
  <td class="d">${p.day} ${p.pDate}</td>
  <td class="t"><code>${p.time}</code></td>
  <td class="f">${p.lang === 'en' ? 'EN' : 'ع'}</td>
  <td class="ti">${esc(p.title)}</td>
  <td class="g">${p.gDate}</td>
</tr>`;

const card = (p) => {
  const en = p.lang === 'en';
  return `<section class="card">
  <div class="head">
    <div class="badge ${en ? 'en' : 'ar'}">${AR(p.n)}</div>
    <div class="ttl">
      <h2 dir="${en ? 'ltr' : 'rtl'}">${esc(p.title)}</h2>
      <div class="meta">${p.kind === 'design' ? 'تصميم مربّع' : 'فيديو أفقي'} · ${en ? 'إنجليزي' : 'عربي'}</div>
    </div>
  </div>

  <table class="when">
    <tr><th></th><th>التاريخ</th><th>الساعة</th><th>تمّ</th></tr>
    <tr><td class="w">البروفايل</td><td>${p.day} ${p.pDate}</td><td><code>${p.time}</code></td><td class="box"></td></tr>
    <tr><td class="w">الصفحة</td><td>${p.gDate}</td><td><code>${p.time}</code></td><td class="box"></td></tr>
  </table>

  <div class="files"><span class="lbl">الملف</span> <code>${esc(p.base)}</code> <span class="ext">${p.media} + .txt</span></div>

  <pre class="copy" dir="${en ? 'ltr' : 'rtl'}">${esc(p.text)}</pre>
</section>`;
};

const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-arabic-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block;unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF,U+2700-27BF}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Alex',sans-serif;color:${INK};background:${PAPER};font-size:10.5px;line-height:1.75}
code{font-family:'Alex',monospace;background:${SOFT};padding:1px 5px;border-radius:3px;font-size:.94em;direction:ltr;display:inline-block}

.cover{height:1020px;display:flex;flex-direction:column;justify-content:center;padding:0 46px;page-break-after:always}
.cover h1{font-size:38px;font-weight:800;line-height:1.3;letter-spacing:-.5px}
.cover .sub{font-size:14px;color:${MUTED};margin-top:10px}
.rule{margin-top:30px;border-right:4px solid ${LIME};background:${SOFT};padding:16px 18px;border-radius:0 8px 8px 0}
.rule b{font-size:13px}
.clock{display:flex;gap:12px;margin-top:22px}
.clock div{flex:1;background:${INK};color:#fff;border-radius:10px;padding:16px 18px}
.clock .big{font-size:26px;font-weight:800;color:#D9FF3F;direction:ltr;display:block;margin-bottom:2px}
.zones{margin-top:22px;width:100%;border-collapse:collapse}
.zones td{padding:6px 10px;border-bottom:1px solid #E6E7E1}
.zones td:last-child{text-align:left;direction:ltr;font-weight:700}

h3.sec{font-size:19px;font-weight:800;margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid ${INK}}
table.list{width:100%;border-collapse:collapse;font-size:10px}
table.list th{background:${INK};color:#fff;padding:7px 6px;font-weight:600;font-size:9.5px}
table.list td{padding:6px;border-bottom:1px solid #EBECE7;vertical-align:middle}
table.list tr:nth-child(even) td{background:#FAFBF7}
.num{font-weight:800;width:26px;text-align:center;color:${MUTED}}
.t code{font-size:9px}
.f{width:28px;text-align:center;font-weight:700;font-size:9px;color:${LIME}}
.g{color:${MUTED};font-size:9.5px}
.ti{font-weight:600}

.card{page-break-inside:avoid;border:1.5px solid #E4E6DF;border-radius:12px;padding:16px 18px;margin-bottom:14px}
.head{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.badge{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;
       font-size:16px;font-weight:800;flex:none}
.badge.en{background:${INK};color:#D9FF3F}
.badge.ar{background:#D9FF3F;color:${INK}}
.ttl h2{font-size:15px;font-weight:800;line-height:1.35}
.ttl .meta{font-size:9px;color:${MUTED};margin-top:1px}

table.when{border-collapse:collapse;margin-bottom:9px;font-size:10px}
table.when th{font-size:8.5px;color:${MUTED};font-weight:600;padding:0 10px 3px;text-align:right}
table.when td{padding:4px 10px;border-top:1px solid #EBECE7}
table.when .w{font-weight:700;color:${MUTED};font-size:9.5px}
.box{width:34px}
.box::after{content:'';display:block;width:13px;height:13px;border:1.5px solid ${MUTED};border-radius:3px;margin:0 auto}

.files{font-size:9px;color:${MUTED};margin-bottom:9px}
.files .lbl{font-weight:700}
.files code{font-size:8.5px;max-width:100%}
.files .ext{color:#9BA093}

pre.copy{background:${SOFT};border-radius:8px;padding:12px 14px;font-family:'Alex',sans-serif;
         font-size:10px;line-height:1.85;white-space:pre-wrap;word-wrap:break-word}
</style></head><body>

<div class="cover">
  <h1>دفتر جدولة لينكدإن</h1>
  <div class="sub">٣٧ بوست · ٩ آب ← ٢٨ أيلول ٢٠٢٦ · البروفايل والصفحة</div>

  <div class="clock">
    <div><span class="big">6:00 PM</span> البوست الإنجليزي</div>
    <div><span class="big">9:00 AM</span> البوست العربي</div>
  </div>

  <div class="rule">
    <b>ما في أي حساب توقيت.</b><br>
    شاشة الجدولة بلينكدإن مكتوب فوقها <code>GMT+03:00, based on your location</code> — يعني
    الساعة اللي بتكتبها هي ساعة عمّان مباشرة. اكتب الرقم زي ما هو ولا تحوّل.
  </div>

  <table class="zones">
    <tr><td colspan="2"><b>وليش ٦:٠٠ مساءً للإنجليزي؟</b> بساعة وحدة بتغطي أمريكا كلها:</td></tr>
    <tr><td>نيويورك</td><td>11:00 AM</td></tr>
    <tr><td>لوس أنجلوس</td><td>8:00 AM</td></tr>
    <tr><td>لندن</td><td>4:00 PM</td></tr>
    <tr><td>عمّان</td><td>6:00 PM</td></tr>
  </table>

  <div class="rule" style="margin-top:20px">
    <b>بوست واحد باليوم لكل حساب.</b><br>
    بوستين بأقل من ١٨ ساعة بيخنقوا بعض. بس البروفايل والصفحة حسابين منفصلين —
    فبوست عالصفحة ما بياخد من وصول البروفايل ولا ذرة.
  </div>

  <div class="rule" style="margin-top:20px">
    <b>الملفات كلها بمجلد واحد:</b> <code>D:\\Ryan-Work\\Brand-Ryan\\LinkedIn-Schedule</code><br>
    كل بوست إله ملفات بنفس الرقم: الميديا، الغلاف، والنص. رتّب المجلد بالاسم وامشي من فوق لتحت.
  </div>
</div>

<h3 class="sec">الجدول كامل</h3>
<table class="list">
  <tr><th>#</th><th>البروفايل</th><th>الساعة</th><th></th><th>المحتوى</th><th>الصفحة</th></tr>
  ${ALL.map(row).join('')}
</table>

<div style="page-break-before:always"></div>
<h3 class="sec">النصوص — واحد واحد</h3>
${ALL.map(card).join('')}

</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
const pdf = `${OUTDIR}/جدول لينكدإن — ٣٧ بوست.pdf`;
await page.pdf({
  path: pdf, format: 'A4', printBackground: true,
  margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
});
await browser.close();
writeFileSync(`${OUTDIR}/_debug.html`, html, 'utf8');
console.log(`✅ ${ALL.length} بوست → ${pdf}`);
