// ═══════════════════════════════════════════════════════════════
//  فحص تسرّب داخل الـPDF نفسه (2026-08-08)
//
//  ليش أداة مستقلة؟ لأنه grep على ملف PDF بيكذب — النص جوّاه
//  مضغوط ومرمّز بأرقام جليفات مش يونيكود، فالبحث بيرجع «نضيف»
//  عن أي إشي. لازم نفكّه بـpdf.js متل ما بيفكّه القارئ.
//
//  وقبله كان في كذبة تانية: المقارنة كانت نص خام، و«دبابنه» بهاء
//  ما بتساوي «دبابنة» بتاء مربوطة — فهون التطبيع إجباري، والرقم
//  هو الحكم لأنه ما بينكتب بطريقتين.
//
//  التشغيل: node _check/pdfleak.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync } from 'fs';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';

const HUNT = 'G:/My Drive/ريّان الواثق — مكتبة الحملة/٨ — الصيد';

// أهداف ريّان: ممنوعة بأي ملف بينمشي لحسام
const NAMES = ['نيفين', 'teal by bana', 'مايا خلف', 'w derma', 'العبادي',
  'chicas', 'bebek', 'البطيخي', 'amazon hall', 'white hall'];
const PHONES = ['798253922', '771909091', '65652231', '797111525',
  '790603340', '799243111', '798282411', '799333163', '779767666'];
// الثمانية تبع قائمة التحقّق: ممنوعة بأي ملف بيطلع برّا الجهاز
const FLAGGED = ['love seat', 'أمجد كنعان', 'dabour', 'بسام منصور',
  'trio palace', 'ak dental', 'sbetan'];

const N = (s) => s.toLowerCase().replace(/[ً-ْـ]/g, '')
  .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ');

// ⚠️ pdf.js بيرجّع العربي **حرف حرف بشكله التقديمي** (U+FB50–FEFF) وبترتيب
//    بصري معكوس. يعني «نيفين» بتطلع سلسلة أشكال مقلوبة، والبحث عنها بالنص
//    العادي بيرجع «ما لقيت» وهو ما بحث بإشي. لازم:
//      ١) نلزق الحروف بلا مسافات  ٢) NFKC يرجّعهم لأشكالهم الأساسية
//      ٣) نعكس السلسلة لترتيبها المنطقي  ٤) وبعدها نطبّع ونقارن
const unshape = (s) => [...s.normalize('NFKC')].reverse().join('');

const text = async (f) => {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(readFileSync(f)), useSystemFonts: true }).promise;
  let raw = '';
  for (let i = 1; i <= doc.numPages; i++) raw += (await (await doc.getPage(i)).getTextContent()).items.map((x) => x.str).join('');
  return { raw, ar: unshape(raw), pages: doc.numPages };
};

// الملفات اللي بتطلع لحدا تاني · وشو ممنوع فيها · وكلمة بتثبت إنه الاستخراج اشتغل
const CHECKS = [
  [`${HUNT}/للزميل حسام/قائمة ١٠٠ هدف + السكربت.pdf`, [...NAMES, ...FLAGGED], PHONES, 'الهاتف'],
  [`${HUNT}/أوراق العمل/٣ — ورقة متابعة فاضية.pdf`, [...NAMES, ...FLAGGED], PHONES, 'النشاط'],
];

let bad = 0, blind = 0;
for (const [f, names, phones, CANARY] of CHECKS) {
  const { raw, ar, pages } = await text(f);
  const hay = N(raw) + ' ' + N(ar);
  const digits = raw.replace(/\D/g, '');

  const canary = N(ar).includes(N(CANARY)) || N(raw).includes(N(CANARY));
  const hits = [...names.filter((x) => hay.includes(N(x))), ...phones.filter((p) => digits.includes(p))];

  console.log(`${!canary ? '⚫' : hits.length ? '🔴' : '✅'} ${f.split('/').pop()}  (${pages} صفحة · ${raw.length} حرف)`);
  if (!canary) { console.log(`     ⚫ الاستخراج ما لقى «${CANARY}» — الفحص أعمى، ما بينعتمد عليه`); blind++; }
  if (hits.length) { console.log(`     ← ${hits.join(', ')}`); bad += hits.length; }
}
console.log(`\n${blind ? '⚫ الفحص فشل — لا تعتمد النتيجة' : bad ? '🔴 ما بينبعت' : '✅ بيتبعت لحسام زي ما هو'}`);
process.exit(bad || blind ? 1 : 0);
