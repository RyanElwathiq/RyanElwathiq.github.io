// ═══════════════════════════════════════════════════════════════
//  دفتر جدولة إنستغرام → PDF (2026-08-08)
//
//  نفس تواريخ لينكدإن بالضبط — بس النسخة العمودية بدل الأفقية،
//  والساعة وحدة للكل (٨:٠٠ مساءً، ذروة إنستغرام بالأردن).
//
//  ⚠️ الخط Alexandria مضمّن base64 وإلا Playwright بيسقط على خط
//     النظام بصمت.
//
//  التشغيل: node _check/igschedule-pdf.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { chromium } from 'playwright';

const SP = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
const OUTDIR = 'D:/Ryan-Work/Brand-Ryan/Instagram-Schedule';
mkdirSync(OUTDIR, { recursive: true });

const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');
const rows = JSON.parse(readFileSync(`${SP}/ig-rows.json`, 'utf8'));

const INK = '#0E0F12', LIME = '#8FA800', SOFT = '#F4F5F0', MUTED = '#6B6F66';
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const TIME = '8:00 PM';

const kindLabel = (r) => (r.kind === 'design' ? 'بوست مربّع' : 'ريلز عمودي');

const row = (r) => `<tr>
  <td class="num">${AR(+r.n)}</td>
  <td class="d">${r.day} ${r.date}</td>
  <td class="f">${r.lang === 'en' ? 'EN' : 'ع'}</td>
  <td class="k">${r.kind === 'design' ? 'تصميم' : 'ريلز'}</td>
  <td class="ti">${esc(r.title)}</td>
</tr>`;

const card = (r) => {
  const en = r.lang === 'en';
  return `<section class="card">
  <div class="head">
    <div class="badge ${en ? 'en' : 'ar'}">${AR(+r.n)}</div>
    <div class="ttl">
      <h2 dir="${en ? 'ltr' : 'rtl'}">${esc(r.title)}</h2>
      <div class="meta">${kindLabel(r)} · ${en ? 'إنجليزي' : 'عربي'}</div>
    </div>
    <div class="when"><b>${r.day} ${r.date}</b><span><code>${TIME}</code></span></div>
    <div class="chk"></div>
  </div>

  <div class="files"><span class="lbl">الملف</span> <code>${esc(r.base)}</code>
    <span class="ext">${r.kind === 'design' ? '.png + (ستوري).png' : '.mp4 + .jpg غلاف'} + .txt</span></div>

  <pre class="copy" dir="${en ? 'ltr' : 'rtl'}">${esc(r.cap)}</pre>
  ${r.story ? `<div class="story"><span class="slbl">وستوري نفس اليوم</span><pre dir="rtl">${esc(r.story)}</pre></div>` : ''}
</section>`;
};

const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-arabic-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block;unicode-range:U+0000-00FF,U+2000-206F,U+2190-21FF,U+2700-27BF}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Alex',sans-serif;color:${INK};background:#fff;font-size:10.5px;line-height:1.75}
code{font-family:'Alex',monospace;background:${SOFT};padding:1px 5px;border-radius:3px;font-size:.94em;direction:ltr;display:inline-block}

.cover{height:1020px;display:flex;flex-direction:column;justify-content:center;padding:0 46px;page-break-after:always}
.cover h1{font-size:38px;font-weight:800;line-height:1.3;letter-spacing:-.5px}
.cover .sub{font-size:14px;color:${MUTED};margin-top:10px}
.rule{margin-top:22px;border-right:4px solid ${LIME};background:${SOFT};padding:15px 18px;border-radius:0 8px 8px 0}
.rule b{font-size:13px}
.big1{margin-top:22px;background:${INK};color:#fff;border-radius:12px;padding:20px 24px}
.big1 span{font-size:34px;font-weight:800;color:#D9FF3F;direction:ltr;display:block}

h3.sec{font-size:19px;font-weight:800;margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid ${INK}}
table.list{width:100%;border-collapse:collapse;font-size:10px}
table.list th{background:${INK};color:#fff;padding:7px 6px;font-weight:600;font-size:9.5px}
table.list td{padding:6px;border-bottom:1px solid #EBECE7}
table.list tr:nth-child(even) td{background:#FAFBF7}
.num{font-weight:800;width:26px;text-align:center;color:${MUTED}}
.f{width:28px;text-align:center;font-weight:700;font-size:9px;color:${LIME}}
.k{width:46px;font-size:9px;color:${MUTED}}
.ti{font-weight:600}

.card{page-break-inside:avoid;border:1.5px solid #E4E6DF;border-radius:12px;padding:15px 17px;margin-bottom:13px}
.head{display:flex;align-items:center;gap:11px;margin-bottom:10px}
.badge{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;
       font-size:15px;font-weight:800;flex:none}
.badge.en{background:${INK};color:#D9FF3F}
.badge.ar{background:#D9FF3F;color:${INK}}
.ttl{flex:1}
.ttl h2{font-size:14.5px;font-weight:800;line-height:1.35}
.ttl .meta{font-size:9px;color:${MUTED};margin-top:1px}
.when{text-align:left;font-size:10px;line-height:1.5}
.when span{display:block;margin-top:2px}
.chk{width:15px;height:15px;border:1.5px solid ${MUTED};border-radius:3px;flex:none}

.files{font-size:9px;color:${MUTED};margin-bottom:8px}
.files .lbl{font-weight:700}
.files code{font-size:8.5px}
.files .ext{color:#9BA093}

pre.copy{background:${SOFT};border-radius:8px;padding:11px 13px;font-family:'Alex',sans-serif;
         font-size:10px;line-height:1.85;white-space:pre-wrap;word-wrap:break-word}
.story{margin-top:8px;border-right:3px solid #D9DBD2;padding-right:10px}
.story .slbl{font-size:8.5px;color:${MUTED};font-weight:700}
.story pre{font-family:'Alex',sans-serif;font-size:9.5px;line-height:1.7;white-space:pre-wrap;color:#3C4038;margin-top:2px}
</style></head><body>

<div class="cover">
  <h1>دفتر جدولة إنستغرام</h1>
  <div class="sub">${AR(rows.length)} بوست · نفس تواريخ لينكدإن · ريلز وتصاميم</div>

  <div class="big1"><span>8:00 PM</span> كل بوستات إنستغرام، عربي وإنجليزي</div>

  <div class="rule">
    <b>ليش وقت واحد للكل، بعكس لينكدإن؟</b><br>
    لينكدإن منصة شغل، فالوقت بيتبع دوام الجمهور. إنستغرام منصة مسا —
    وجمهورك عليها أردني بغالبيته. ٨:٠٠ مساءً هي ذروة السكرول بالأردن، والإنجليزي
    بنفس الساعة بيوقع ١:٠٠ ظهراً بنيويورك وهاي كمان ساعة قوية.
  </div>

  <div class="rule">
    <b>إنستغرام ما بيسمح روابط بالكابشن.</b><br>
    عشان هيك كل الكابشنات بتنتهي بـ«الرابط بالبايو» بدل رابط مكتوب.
    <b>وحط بالبايو:</b> <code>ryanalali.me/ig</code> — بيوصل لنفس الموقع بس بيقول لـGA4
    إنه الزائر جاي من إنستغرام. ونفس الرابط بينفع لستيكر الرابط بالستوري.
  </div>

  <div class="rule">
    <b>نفس تواريخ لينكدإن بالضبط.</b><br>
    نفس الفيلم بينزل بنفس اليوم عالمنصتين — بس لينكدإن بياخد النسخة الأفقية
    وإنستغرام بياخد العمودية. منصتان منفصلتان، فما في أي خنق ولا تعارض.
  </div>

  <div class="rule">
    <b>الملفات:</b> <code>D:\\Ryan-Work\\Brand-Ryan\\Instagram-Schedule</code><br>
    كل بوست إله ملفاته بنفس الرقم. الريلز معه غلافه، والتصميم معه نسخة الستوري الطولية.
  </div>
</div>

<h3 class="sec">الجدول كامل</h3>
<table class="list">
  <tr><th>#</th><th>التاريخ</th><th></th><th>النوع</th><th>المحتوى</th></tr>
  ${rows.map(row).join('')}
</table>

<div style="page-break-before:always"></div>
<h3 class="sec">الكابشنات — واحد واحد</h3>
${rows.map(card).join('')}

</body></html>`;

const browser = await chromium.launch();
const p = await browser.newPage();
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(400);
const pdf = `${OUTDIR}/جدول إنستغرام — ${rows.length} بوست.pdf`;
await p.pdf({ path: pdf, format: 'A4', printBackground: true,
  margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
await browser.close();
console.log(`✅ ${rows.length} بوست → ${pdf}`);
