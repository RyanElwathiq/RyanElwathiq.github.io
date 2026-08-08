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

// ─── فحص أمان: ولا اسم من الممنوعين تسرّب ───
const BANNED = ['love seat', 'أمجد كنعان', 'dabour', 'بسام منصور', 'trio palace',
  'البطيخي', 'ak dental', 'sbetan', 'نيفين دبابنة', 'teal by bana', 'maya khalaf',
  'w derma', 'الدرباشي', 'chicas', 'bebek', 'amazon hall', 'white hall'];
const leak = rows.filter((r) => BANNED.some((b) => r.name.toLowerCase().includes(b.toLowerCase())));
if (leak.length) { console.error('🔴 تسرّب:', leak.map((l) => l.name).join(', ')); process.exit(1); }
console.log('✅ فحص الاستبعاد: ولا اسم ممنوع بالقائمة');

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
