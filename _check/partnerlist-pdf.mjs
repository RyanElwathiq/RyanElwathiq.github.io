// ═══════════════════════════════════════════════════════════════
//  قائمة الزميل → PDF (2026-08-08)
//  التشغيل: node _check/partnerlist-pdf.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync } from 'fs';
import { chromium } from 'playwright';

const SRC = 'D:/Ryan-Work/Brand-Ryan/Outreach';
const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');
const rows = JSON.parse(readFileSync(`${SRC}/dfs/partner-100.json`, 'utf8'));

// ─── فحص أمان ───
// ⚠️ هاد الفحص كان بيطلع أخضر وهو أعمى: كان بيقارن نص خام، و«نيفين دبابنه»
//    بهاء بالبيانات ما بتساوي «دبابنة» بتاء مربوطة بقائمة المنع. فتسرّبت
//    لقائمة الزميل مرتين وطلعت بالـPDF. الرقم بيمسك اللي الاسم بيفلته.
const BANNED = ['love seat', 'أمجد كنعان', 'dabour', 'بسام منصور', 'trio palace',
  'البطيخي', 'ak dental', 'sbetan', 'نيفين دبابنة', 'teal by bana', 'maya khalaf',
  'w derma', 'الدرباشي', 'chicas', 'bebek', 'amazon hall', 'white hall'];
const BANNED_PHONES = ['798253922', '771909091', '65652231', '797111525',
  '790603340', '799243111', '798282411', '799333163', '779767666'];

const N = (s) => (s || '').toLowerCase().replace(/[ً-ْـ]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();
const D = (s) => (s || '').replace(/\D/g, '');

const leak = rows.filter((r) => BANNED.some((b) => N(r.name).includes(N(b)))
  || BANNED_PHONES.some((p) => D(r.phone).endsWith(p)));
if (leak.length) { console.error('🔴 تسرّب:', leak.map((l) => `${l.name} (${l.phone})`).join(' | ')); process.exit(1); }

// وتكرار: نفس الرقم بيتكرر لما النشاط مسجّل بقطاعين
const dup = Object.entries(rows.reduce((m, r) => ((m[D(r.phone)] = (m[D(r.phone)] || 0) + 1), m), {}))
  .filter(([k, v]) => k && v > 1);
if (dup.length) { console.error('🔴 تكرار:', dup.map(([k, v]) => `${k}×${v}`).join(', ')); process.exit(1); }

console.log(`✅ فحص الاستبعاد (بتطبيع عربي + رقم): ${rows.length} صف نضيف، بلا تكرار`);

const INK = '#0E0F12', LIME = '#8FA800', SOFT = '#F4F5F0', MUTED = '#6B6F66', LINE = '#DDE0D6';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

const tr = (r) => `<tr>
  <td class="n">${AR(r.n)}</td>
  <td class="nm">${esc(r.name)}</td>
  <td class="ct">${esc(r.cat)}</td>
  <td class="num">${r.rating}</td>
  <td class="num">${AR(r.votes.toLocaleString('en'))}</td>
  <td class="ph">${esc(r.phone)}</td>
  <td class="ag">${esc(r.angle)}</td>
  <td class="bx"><span></span></td><td class="bx"><span></span></td><td class="bx"><span></span></td>
</tr>`;

const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-arabic-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block;unicode-range:U+0000-00FF}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Alex',sans-serif;color:${INK};font-size:8.6px}
h1{font-size:19px;font-weight:800;letter-spacing:-.3px}
.sub{font-size:10.5px;color:${MUTED};margin-top:4px}
.top{border-bottom:2.5px solid ${INK};padding-bottom:9px;margin-bottom:11px}
.card{background:${SOFT};border-right:3px solid ${LIME};padding:9px 12px;border-radius:0 7px 7px 0;font-size:9.5px;line-height:1.7;margin-bottom:9px}
.card b{color:${INK}}
table{width:100%;border-collapse:collapse}
thead{display:table-header-group}
th{background:${INK};color:#fff;font-size:7.8px;font-weight:600;padding:6px 3px}
td{border-bottom:1px solid ${LINE};padding:4px 4px;vertical-align:middle}
tr:nth-child(even) td{background:#FAFBF7}
tr{page-break-inside:avoid}
.n{width:18px;text-align:center;color:${MUTED};font-weight:700;font-size:7.6px}
.nm{font-weight:700;font-size:9px;line-height:1.35}
.ct{width:60px;font-size:7.8px;color:${MUTED}}
.num{width:32px;text-align:center;font-size:8px}
.ph{width:76px;font-size:7.8px;color:#3D4139;direction:ltr;text-align:right}
.ag{font-size:8px;color:${MUTED};line-height:1.4}
.bx{width:22px;text-align:center}
.bx span{display:inline-block;width:10px;height:10px;border:1.3px solid #A8AD9F;border-radius:2px}
.scr{margin-bottom:12px}
.scr h2{font-size:14px;font-weight:800;margin-bottom:5px}
.why{font-size:9px;color:${MUTED};line-height:1.7;margin-bottom:8px}
.why b{color:${INK}}
.mm{border-radius:8px;padding:9px 11px;margin-bottom:7px}
.mm.g{background:#F7F8F4;border:1px dashed #CFD3C7}
.mm.d{background:${SOFT}}
.ml{display:block;font-size:7.6px;font-weight:700;letter-spacing:1px;color:${LIME};margin-bottom:3px}
.mm pre{font-family:'Alex',sans-serif;font-size:9px;line-height:1.75;white-space:pre-wrap}
table.ex{width:100%;border-collapse:collapse;font-size:8.6px;margin-top:6px}
table.ex th{background:${INK};color:#fff;font-size:7.8px;padding:5px}
table.ex td{border-bottom:1px solid ${LINE};padding:5px 6px;line-height:1.6}
table.ex td:first-child{width:118px;font-weight:700;color:${MUTED}}
</style></head><body>

<div class="top">
  <h1>قائمة أهداف — ١٠٠ نشاط بلا موقع إلكتروني</h1>
  <div class="sub">عمّان والأردن · مفرزة من مسح ٢,١٦٩ نشاط بـ٢٣ قطاع · ٩ آب ٢٠٢٦</div>
</div>

<div class="card">
  <b>كلهم بلا موقع، تقييمهم ٤.٢ فما فوق، وعندهم ٣٠ مراجعة على الأقل.</b>
  يعني نشاط شغّال وناسه راضية — بس ما إله مكان على الإنترنت غير خرائط جوجل.
  <br><b>«زاوية الفتح»</b> هي أوضح ثغرة بملفه، وبتنشاف لأي حدا بيفتح الخريطة. استعملها لتفهم وضعه، مش لتنتقده.
</div>

<div class="card" style="border-right-color:#C24A4A">
  <b>قاعدتان ما بتنكسروا:</b><br>
  <b>١)</b> ولا معلومة عرفتها عنه بتترد عليه كنقد. صاحب المشروع بيسمع «موقعك ضعيف» كل أسبوع، ومن غريب بتقرا استعلاء وبتقفل الباب بسطر.<br>
  <b>٢)</b> ولا رسالة بلا سبب حقيقي. لو ما لقيت شي تحكيه إله هو، لا تبعت.
  <br><b>وكل رد سلبي بيانات</b> — سجّل السبب، هو أثمن من الرد الإيجابي.
</div>

<div class="scr">
  <h2>السكربت — رسالتان لكل هدف</h2>
  <p class="why"><b>ليش رسالتان؟</b> الرقم المكتوب رقم المحل، واللي بيرد موظف ما بيقدر يقرر.
  فالأولى <b>ما بتبيع، بتسأل</b> مين المسؤول. والتانية للشخص نفسه.
  <b>وقبل الاثنين: افتح إنستغرام ودوّر باسمه.</b> إذا طلع عنده عشرات الآلاف من المتابعين، لا تحكي أبداً إنه مش ظاهر.</p>

  <div class="mm g"><span class="ml">١) للحاجب — واتساب على الرقم المكتوب</span><pre>مرحبا،

أنا [اسمك]، بشتغل مع ريّان الواثق ببناء المواقع وأنظمة الحجز.

سؤال قصير: مين المسؤول عن الحضور الرقمي عندكم؟ عندي ملاحظة محددة عن [اسم النشاط] وحابب أوصلها للشخص الصح.

بتقدروا تحوّلوا الرسالة أو تعطوني اسمه وأنا بكمّل معه.

شكراً</pre></div>

  <div class="mm d"><span class="ml">٢) لصاحب القرار — بدّل السطر الوسط بس</span><pre>مرحبا [الاسم]،

أنا [اسمك]، ببني مواقع وأنظمة حجز.

[⭐ التقييم] و[عدد] مراجعة. الشغل عندكم واضح إنه نظيف، وهاد الجزء الصعب اللي إنتوا خلصتوه.

★ [حط هون «زاوية الفتح» من الجدول، بجملة وحدة] ★

وما عندكم مكان تملكوه يستقبل اللي بيدوّر عنكم. فكل سؤال بيرجع مكالمة، وكل مكالمة وقت من طاقمكم.

إذا بيهمك، منحضّرلك تشخيص مكتوب بلا أي التزام.

[اسمك] · ryanalali.me</pre></div>

  <table class="ex"><tr><th>لو زاوية الفتح كانت</th><th style="text-align:right">اكتب هالجملة</th></tr>
    <tr><td>بلا ساعات عمل</td><td>«ملفكم بلا ساعات عمل، يعني لما حدا يفلتر «فاتح هلأ» ما بتظهروا. مش لأنكم مسكرين، لأنه جوجل ما بيعرف.»</td></tr>
    <tr><td>٥ صور بس</td><td>«خمس صور بملفكم، والزبون بيقرر بالصورة قبل ما يقرا.»</td></tr>
    <tr><td>ملفه بلا وصف</td><td>«ملفكم بلا وصف، فأول انطباع عنكم فاضي.»</td></tr>
    <tr><td>الملف غير موثّق</td><td>«ملفكم غير موثّق، يعني أي حدا يقدر يعدّل بياناتكم وإنتوا ما بتعرفوا.»</td></tr>
    <tr><td>نسبة نجمة وحدة عالية</td><td>لا تذكرها أبداً. افتح بالصور أو الوصف بدلها.</td></tr>
  </table>

  <p class="why" style="margin-top:8px"><b>وبعد ٤٨ ساعة بلا رد:</b> رسالة وحدة بس بزاوية مختلفة. ما ردّ عليها، اتركه وسجّل السبب.
  <b>ولا تحذف صف</b> — اللي قال لأ اليوم بيانات لبكرا.</p>
</div>

<div style="page-break-before:always"></div>
<table>
 <thead><tr>
  <th>#</th><th style="text-align:right">النشاط</th><th>القطاع</th><th>⭐</th><th>مراجعات</th>
  <th style="text-align:right">الهاتف</th><th style="text-align:right">زاوية الفتح</th>
  <th>انبعت</th><th>ردّ</th><th>مهتم</th>
 </tr></thead>
 <tbody>${rows.map(tr).join('')}</tbody>
</table>

</body></html>`;

const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(350);
const pdf = `${SRC}/قائمة الزميل — ١٠٠ هدف.pdf`;
await p.pdf({ path: pdf, format: 'A4', printBackground: true,
  margin: { top: '11mm', bottom: '11mm', left: '9mm', right: '9mm' } });
await b.close();
console.log(`✅ ${rows.length} هدف → ${pdf}`);
