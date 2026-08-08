// ═══════════════════════════════════════════════════════════════
//  ملف الصيد — لوحة التحكّم + جدول البيانات (2026-08-08)
//
//  هدول ملفان بينحطوا برأس مجلد «٨ — الصيد» عالدرايف:
//   ١) ابدأ من هون.pdf  — صفحة واحدة بتقول: أي ملف لأي شغلة،
//      وترتيب الخطوات، والقواعد الثلاث اللي ما بتنكسر.
//   ٢) أهدافي — بيانات.csv — الأهداف التسعة بأعمدة يقدر يعبّيها
//      بجوجل شيت وهو بالسيارة. فيه BOM عشان إكسل ما يكسر العربي.
//
//  التشغيل: node _check/huntindex.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync } from 'fs';
import { chromium } from 'playwright';

const HUNT = 'G:/My Drive/ريّان الواثق — مكتبة الحملة/٨ — الصيد';
const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');

// ─────────────────────────────────────────────────────────────
//  ١) جدول البيانات — تسعة أهداف
//  «فحص إنستغرام» عمود مستقل ومتروك فاضي عن قصد لسبعة منهم.
//  اللي انفحص فيه رقم، واللي ما انفحص فيه علامة سؤال — عشان
//  ما ينكتب رقم من الذاكرة.
// ─────────────────────────────────────────────────────────────
const COLS = ['#', 'النشاط', 'القطاع', 'التقييم', 'مراجعات', 'الهاتف',
  'إنستغرام', 'المتابعين', 'انفحص؟', 'زاوية الفتح', 'صاحب القرار',
  'رسالة الحاجب', 'رد الحاجب', 'رسالة القرار', 'الرد', 'النتيجة', 'ملاحظات'];

const ROWS = [
  ['١', 'عيادة د. نيفين دبابنة', 'جلدية وتجميل · الدوار السابع', '4.8', '1345', '+962798253922',
    '@clinicaneveen', '221880', 'نعم ✅', 'رابط البايو بيرجّع لإنستغرام — ما في مخرج',
    'د. نيفين دبابنة', '', '', '', '', '', ''],
  ['٢', 'Teal By Bana', 'صالونات · للسيدات فقط', '4.4', '1406', '+962771909091',
    '@tealbybana', '415000', 'نعم ✅', 'شكاوى مواعيد بالمراجعات + بلا نظام حجز',
    '', '', '', '', '', '', ''],
  ['٣', 'مركز د. مايا خلف لطب الأسنان', 'أسنان · الشميساني', '4.8', '238', '+96265652231',
    '', '', 'لأ ❗', 'بلا وصف + ٨ صور بس', 'د. مايا خلف (لينكدإن: dr-maya-khalaf-1a1ba81b)',
    '', '', '', '', '', ''],
  ['٤', 'W Derma Clinic — د. وليد العبادي', 'جلدية وتجميل', '4.7', '253', '+962797111525',
    '', '', 'لأ ❗', 'بيدفع لطبكان وvezeeta — بيستأجر علاقته بالمريض',
    'د. وليد العبادي (لينكدإن: waleed-abbadi-741b9439)', '', '', '', '', '', 'الأقرب للدفع — مقتنع أصلاً'],
  ['٥', 'Chicas Beauty Center', 'صالونات · شارع الملكة رانيا', '', '', '+962790603340',
    '', '', 'لأ ❗', '', '', '', '', '', '', '', '⚠️ Exa ما أكّد العنوان — تحقّق قبل أي رسالة'],
  ['٦', 'Bebek Halls', 'قاعات أفراح', '4.4', '1019', '+962799243111',
    '', '', 'لأ ❗', 'قاعد على دليل qa3at.com مع منافسيه بنفس الصفحة', '', '', '', '', '', '', ''],
  ['٧', 'قاعات البطيخي للأفراح', 'قاعات أفراح', '4.1', '1749', '+962798282411',
    '', '', 'لأ ❗', 'قاعد على دليل qa3at.com مع منافسيه بنفس الصفحة', '', '', '', '', '', '', ''],
  ['٨', 'Amazon Halls قاعات الأمازون', 'قاعات أفراح', '4.1', '1294', '+962799333163',
    '', '', 'لأ ❗', 'قاعد على دليل qa3at.com مع منافسيه بنفس الصفحة', '', '', '', '', '', '', ''],
  ['٩', 'White Hall', 'قاعات أفراح', '4.4', '790', '+962779767666',
    '', '', 'لأ ❗', 'قاعد على دليل qa3at.com مع منافسيه بنفس الصفحة', '', '', '', '', '', '', ''],
];

const q = (v) => `"${String(v).replace(/"/g, '""')}"`;
const csv = '\uFEFF' + [COLS, ...ROWS].map((r) => r.map(q).join(',')).join('\r\n');
writeFileSync(`${HUNT}/أهدافي — بيانات.csv`, csv, 'utf8');
console.log(`✅ جدول البيانات: ${ROWS.length} هدف`);

// ─────────────────────────────────────────────────────────────
//  ٢) ورقة «ابدأ من هون»
// ─────────────────────────────────────────────────────────────
const INK = '#0E0F12', LIME = '#8FA800', SOFT = '#F4F5F0', MUTED = '#6B6F66', LINE = '#DDE0D6', RED = '#C24A4A';

const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-arabic-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block;unicode-range:U+0000-00FF}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Alex',sans-serif;color:${INK};font-size:9.6px;line-height:1.6}
.top{border-bottom:2.5px solid ${INK};padding-bottom:10px;margin-bottom:13px}
h1{font-size:21px;font-weight:800;letter-spacing:-.4px}
.sub{font-size:11px;color:${MUTED};margin-top:4px}
h2{font-size:13px;font-weight:800;margin:14px 0 7px;padding-right:9px;border-right:3px solid ${LIME}}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.f{background:${SOFT};border-radius:8px;padding:9px 11px}
.f .nm{font-weight:700;font-size:10px;margin-bottom:2px}
.f .ds{font-size:8.8px;color:${MUTED};line-height:1.55}
.f .tag{display:inline-block;font-size:7.4px;font-weight:700;letter-spacing:.6px;
  background:${INK};color:#fff;border-radius:3px;padding:1px 5px;margin-bottom:4px}
ol{padding-right:17px}
ol li{margin-bottom:6px;font-size:9.6px}
ol li b{font-weight:700}
.rule{border:1px solid ${LINE};border-right:3px solid ${RED};border-radius:0 8px 8px 0;
  padding:9px 11px;margin-bottom:7px;background:#FDFAFA}
.rule b{display:block;font-size:10px;margin-bottom:2px}
.rule span{font-size:9px;color:#55584F;line-height:1.65}
.day{border-collapse:collapse;width:100%;margin-top:5px}
.day td{border-bottom:1px solid ${LINE};padding:5px 7px;font-size:9.2px}
.day td:first-child{width:64px;font-weight:800;color:${LIME};direction:ltr;text-align:right}
.foot{margin-top:15px;border-top:1px solid ${LINE};padding-top:8px;
  font-size:8.6px;color:${MUTED};display:flex;justify-content:space-between}
</style></head><body>

<div class="top">
  <h1>الصيد · ابدأ من هون</h1>
  <div class="sub">مجلد ٨ · تسعة أهداف إلي ومية لحسام · الهدف ٤٠٠ دولار قبل ١٦ آب ٢٠٢٦</div>
</div>

<h2>شو في بالمجلد</h2>
<div class="grid">
  <div class="f"><span class="tag">أوراق العمل ١</span>
    <div class="nm">ملف الصيد المفصّل</div>
    <div class="ds">تسعة أهداف، ولكل واحد رسالتان: وحدة للموظف اللي بيرد، ووحدة لصاحب القرار. هاد اللي بتشتغل منه.</div></div>
  <div class="f"><span class="tag">أوراق العمل ٢</span>
    <div class="nm">ورقة المتابعة</div>
    <div class="ds">اطبعها وخليها جنبك. الأهداف معبّاة وفيها خانات تعليم بالقلم.</div></div>
  <div class="f"><span class="tag">أوراق العمل ٣</span>
    <div class="nm">ورقة متابعة فاضية</div>
    <div class="ds">نفس الشكل بلا أسماء، لأي هدف جديد بيجي بالطريق.</div></div>
  <div class="f"><span class="tag">هالمجلد</span>
    <div class="nm">جدول أهدافي (CSV)</div>
    <div class="ds">نفس التسعة بس كجدول. افتحه بجوجل شيت من الموبايل وعبّي وإنت برّا.</div></div>
  <div class="f"><span class="tag">حسام</span>
    <div class="nm">قائمة ١٠٠ هدف + السكربت</div>
    <div class="ds">القائمة اللي بتبعتها لحسام. بلا أسماء أهدافك التسعة، وبلا أي معلومة داخلية.</div></div>
  <div class="f"><span class="tag">بيانات خام</span>
    <div class="nm">بصمة الأهداف · JSON</div>
    <div class="ds">نتائج البحث الخام. ما بتحتاجها بالصيد، بتحتاجها لو بدك تراجع من وين إجت معلومة.</div></div>
</div>

<h2>الترتيب · كل هدف بيمرّ بنفس الخمس خطوات</h2>
<ol>
  <li><b>افتح إنستغرام ودوّر باسمه.</b> اكتب عدد المتابعين بالجدول قبل أي إشي ثاني. هاي مش خطوة اختيارية.</li>
  <li><b>ابعت رسالة الحاجب</b> على الرقم المكتوب. هاي ما بتبيع، بتسأل مين المسؤول بس.</li>
  <li><b>استنى الاسم</b>، وبعدها ابعت رسالة صاحب القرار وابدأها باسمه.</li>
  <li><b>بعد ٤٨ ساعة بلا رد:</b> رسالة وحدة بزاوية مختلفة. وبس.</li>
  <li><b>سجّل النتيجة</b>، حتى لو «لأ». وخصوصاً لو «لأ»، اكتب السبب.</li>
</ol>

<h2>ثلاث قواعد ما بتنكسر</h2>
<div class="rule"><b>١) افحص السوشال قبل ما تحكي إنه مش ظاهر</b>
  <span>د. نيفين عندها ٢٢١ ألف متابع وTeal عندها ٤١٥ ألف. جملة «ما حدا بيلاقيك» كانت رح تحرق الاثنين بسطر. القاعدة: ما بتنفي حضور ما فحصته.</span></div>
<div class="rule"><b>٢) ولا معلومة عرفتها عنه بتترد عليه كنقد</b>
  <span>هو بيسمع «موقعك ضعيف» كل أسبوع. من غريب بتقرا استعلاء وبتقفل الباب. استعمل المعلومة لتفهم وضعه، مش لتقيّمه.</span></div>
<div class="rule"><b>٣) ولا رسالة بلا سبب حقيقي</b>
  <span>إذا ما لقيت إشي تحكيه إله هو بالذات، لا تبعت. رسالة عامة بتكلّفك الهدف للأبد، ورسالة مؤجلة بتكلّفك يوم.</span></div>
<div class="rule" style="border-right-color:${LIME};background:#FAFBF5"><b>وقاعدة استبعاد دائمة: المحاماة</b>
  <span>المادة ٦٠ من قانون نقابة المحامين بتمنع المحامي من الإعلان عن حاله، والمادة ٦٣ بتحط العقوبة. أي مكتب محاماة مستبعد من كل القوائم تلقائياً. مش خوف، هو ببساطة عرض ما بيقدر يقبله.</span></div>

<h2>إيقاع اليوم</h2>
<table class="day">
  <tr><td>9:00 ص</td><td><b>الصيد</b> · رسائل جديدة من ملف الصيد. افحص إنستغرام لكل واحد قبل.</td></tr>
  <tr><td>1:00 م</td><td><b>التفاعل</b> · بوست اليوم مجدول لحاله. هون بتعلّق وبتردّ بس. ولا تنشر يدوي فوق المجدول.</td></tr>
  <tr><td>7:00 م</td><td><b>المتابعة</b> · اللي صارله ٤٨ ساعة بلا رد، وتعبئة الجدول.</td></tr>
</table>

<div class="foot"><span>ريّان الواثق · ryanalali.me</span><span>٩ آب ٢٠٢٦</span></div>
</body></html>`;

const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(350);
const pdf = `${HUNT}/٠ — ابدأ من هون.pdf`;
await p.pdf({ path: pdf, format: 'A4', printBackground: true,
  margin: { top: '12mm', bottom: '11mm', left: '11mm', right: '11mm' } });
await b.close();
console.log(`✅ ${pdf}`);
