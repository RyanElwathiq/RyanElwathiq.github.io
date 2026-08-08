// ═══════════════════════════════════════════════════════════════
//  ورقة متابعة الصيد — PDF للطباعة أو التعبئة على الشاشة
//
//  العشرة الأوائل معبّيين بأسمائهم من ملف السبت، وخانات المتابعة
//  فاضية. وتحتهم صفوف فاضية لأي حدا تراسله برّا القائمة.
//
//  ⚠️ الخط مضمّن base64 وإلا Playwright بيسقط على خط النظام.
//  التشغيل: node _check/hunttracker.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { chromium } from 'playwright';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Outreach';
mkdirSync(OUT, { recursive: true });
const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');

const INK = '#0E0F12', LIME = '#8FA800', SOFT = '#F4F5F0', MUTED = '#6B6F66', LINE = '#DDE0D6';

// [ الاسم , القطاع , ملاحظة الفتح ]
const TARGETS = [
  ['عيادة د. نيفين دبابنة', 'جلدية', '⭐ الأقوى · صفر سلبية بآخر ٣٠'],
  ['Teal By Bana', 'صالونات', '⭐ الأدق · حجز ٦ · انتظار ٤'],
  ['Dr. Maya Khalaf Dental', 'أسنان', 'بلا وصف · ٨ صور بس'],
  ['W Derma Clinic', 'جلدية', 'د. وليد العبادي'],
  ['المحامية آنا الدرباشي', 'محاماة', 'الموقع = الدليل الوحيد'],
  ['Chicas Beauty Center', 'صالونات', 'بلا ساعات عمل · ٥ صور'],
  ['Bebek Halls', 'أفراح', '٧٪ سلبية — الأنظف بالقاعات'],
  ['قاعات البطيخي', 'أفراح', '١,٧٤٩ مراجعة'],
  ['Amazon Halls', 'أفراح', 'حساسية سعر'],
  ['White Hall', 'أفراح', '⭐4.4 · ٧٩٠'],
];
const BLANKS = 8;
const MODE = process.argv[2] === 'blank' ? 'blank' : 'full';

const box = () => `<td class="bx"><span></span></td>`;
const row = (n, name, cat, note) => `<tr>
  <td class="n">${n}</td>
  <td class="nm">${name}${note ? `<em>${note}</em>` : ''}</td>
  <td class="ct">${cat}</td>
  <td></td><td></td>
  ${box()}${box()}${box()}${box()}${box()}
  <td></td>
</tr>`;

const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const N = MODE === 'blank' ? 18 : TARGETS.length + BLANKS;
let rows = Array.from({ length: N }, (_, i) =>
  MODE === 'blank' || i >= TARGETS.length
    ? row(AR(i + 1), '', '', '')
    : row(AR(i + 1), TARGETS[i][0], TARGETS[i][1], TARGETS[i][2])).join('');

const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-arabic-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block;unicode-range:U+0000-00FF}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Alex',sans-serif;color:${INK};font-size:9.5px}
h1{font-size:20px;font-weight:800;letter-spacing:-.3px}
.sub{font-size:11px;color:${MUTED};margin-top:4px}
.top{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid ${INK};padding-bottom:10px;margin-bottom:12px}
.fill{font-size:10.5px;color:${MUTED}}
.fill b{color:${INK}}
.u{display:inline-block;min-width:74px;border-bottom:1.4px solid ${LINE};margin:0 4px}
.hint{background:${SOFT};border-right:3px solid ${LIME};padding:9px 12px;border-radius:0 7px 7px 0;font-size:10px;line-height:1.65;margin-bottom:13px}
table{width:100%;border-collapse:collapse}
th{background:${INK};color:#fff;font-size:8.5px;font-weight:600;padding:7px 4px;line-height:1.25}
td{border-bottom:1px solid ${LINE};padding:0 5px;height:31px;vertical-align:middle}
tr:nth-child(even) td{background:#FAFBF7}
.n{width:20px;text-align:center;color:${MUTED};font-weight:700}
.nm{font-weight:700;font-size:10px}
.nm em{display:block;font-style:normal;font-weight:400;font-size:7.8px;color:${MUTED};margin-top:1px}
.ct{width:52px;font-size:8.5px;color:${MUTED}}
.bx{width:34px;text-align:center}
.bx span{display:inline-block;width:12px;height:12px;border:1.4px solid #A8AD9F;border-radius:2.5px}
.foot{margin-top:12px;font-size:9px;color:${MUTED};line-height:1.7}
.foot b{color:${INK}}
</style></head><body>

<div class="top">
  <div><h1>ورقة الصيد</h1><div class="sub">${MODE === "blank" ? "الهدف اليومي: <span class=\"u\" style=\"min-width:44px\"></span> رسالة" : "دفعة السبت ٩ آب ٢٠٢٦ · الهدف ١٠ رسائل"}</div></div>
  <div class="fill">التاريخ <span class="u"></span> &nbsp; انبعت <b><span class="u" style="min-width:38px"></span></b> &nbsp; ردّوا <b><span class="u" style="min-width:38px"></span></b></div>
</div>

<div class="hint">
  <b>القناة:</b> و = واتساب · إ = إنستغرام · ي = إيميل · ت = اتصال &nbsp;&nbsp;·&nbsp;&nbsp;
  <b>القاعدة:</b> ولا رسالة بلا سبب حقيقي، وولا معلومة عرفتها عنه بتترد عليه كنقد.<br>
  <b>وكل رد سلبي بيانات سوق</b> — سجّل السبب بالملاحظات، هو أثمن من الرد الإيجابي.
</div>

<table>
 <tr>
  <th>#</th><th style="text-align:right">النشاط</th><th>القطاع</th>
  <th>القناة</th><th>الوقت</th>
  <th>انبعت</th><th>شاف</th><th>ردّ</th><th>مهتم</th><th>مش مهتم</th>
  <th style="text-align:right">المتابعة والملاحظات</th>
 </tr>
 ${rows}
</table>

<div class="foot">
  <b>المتابعة:</b> ما ردّ خلال ٤٨ ساعة ← رسالة وحدة بس، بزاوية مختلفة. ما ردّ عليها ← اتركه وسجّل السبب.<br>
  <b>ولا تحذف صف.</b> اللي قال لأ اليوم بيانات لبكرا، واللي ما رد بيوريك أي زاوية ما بتشتغل.
</div>

</body></html>`;

const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(300);
const pdf = `${OUT}/ورقة الصيد — ${MODE === 'blank' ? 'فاضية' : 'متابعة'}.pdf`;
await p.pdf({ path: pdf, format: 'A4', printBackground: true,
  margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' } });
await b.close();
console.log(
  MODE === 'blank'
    ? `✅ ورقة فاضية (${N} صف) → ${pdf}`
    : `✅ ${TARGETS.length} معبّى + ${BLANKS} فاضي → ${pdf}`,
);
