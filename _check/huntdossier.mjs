// ═══════════════════════════════════════════════════════════════
//  ملف الصيد المفصّل — أهداف ريّان العشرة (2026-08-08)
//
//  ⚠️ نصوص «شو بيستفيد هو» **بتنستخرج حرفياً** من ملف-السبت.md،
//     ما بتنعاد صياغتها. هي انكتبت بعد قراءة مراجعات كل نشاط،
//     وأي إعادة صياغة بتخسّر الدقة اللي جابتها.
//
//  ⚠️ الأرقام والهواتف مكتوبة بالإيد هون بس **مقروءة من نفس
//     الملف**، والسكربت بيفحص إنه كل هدف لقى نصه.
//
//  التشغيل: node _check/huntdossier.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync } from 'fs';
import { chromium } from 'playwright';

const SRC = 'D:/Ryan-Work/Brand-Ryan/Outreach';
const md = readFileSync(`${SRC}/ملف-السبت.md`, 'utf8');
const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');

// ─── استخراج كتلة «شو بيستفيد» اللي بعد عنوان الهدف ───
const wiifm = (anchor) => {
  const i = md.indexOf(anchor);
  if (i < 0) return null;
  const j = md.indexOf('### 🎯 شو بيستفيد', i);
  if (j < 0 || j - i > 2600) return null;
  const seg = md.slice(md.indexOf('\n', j) + 1, md.indexOf('\n---', j));
  return seg.split('\n').filter((l) => l.startsWith('>'))
    .map((l) => l.replace(/^>\s?/, '').replace(/\*\*/g, '')).join('\n').trim();
};

const T = [
  { n: 1, name: 'عيادة د. نيفين دبابنة', cat: 'جلدية وتجميل', tag: 'الأقوى',
    stats: '⭐4.8 · ١,٣٤٥ مراجعة · صفر سلبية بآخر ٣٠', phone: '0798253922',
    read: 'تشغيل نظيف تماماً. ما في إشي نصلحه، في إشي نظهّره. وقطاع الجلدية تذكرته عالية والمريضة بتقارن لأسابيع قبل ما تحجز.',
    anchor: '## ١) عيادة د. نيفين دبابنة' },
  { n: 2, name: 'Teal By Bana', cat: 'صالونات', tag: 'الأدق تطابقاً',
    stats: '⭐4.4 · ١,٤٠٦ مراجعة · ٢٠٪ سلبية · ٣ ردود مهنية', phone: '0771909091',
    read: 'أوضح تطابق بالقائمة كلها بين وجع موثّق وحل بنبيعه. الإشارات: حجز(٦) · انتظار(٤) · سعر(٢) من ٣٠ مراجعة. وهم بيردّوا مهني — بيهتموا فعلاً، بس القناة عاجزة.',
    anchor: '## ٢) Teal By Bana' },
  { n: 3, name: 'Dr. Maya Khalaf Dental Center', cat: 'أسنان', tag: '',
    stats: '⭐ · بلا وصف · ٨ صور بس', phone: '',
    read: 'الثغرات: بلا موقع · بلا وصف · ٨ صور بس.', anchor: '## ٣) Dr. Maya Khalaf' },
  { n: 4, name: 'W Derma Clinic — د. وليد العبادي', cat: 'جلدية', tag: '',
    stats: '⭐4.7 · ٢٥٣ مراجعة · صفر سلبية · ١٣ صورة', phone: '0797111525',
    read: 'نفس منطق نيفين دبابنة بحجم أصغر — تشغيل نظيف وحضور رقمي صفر.',
    anchor: '## ٤) W Derma Clinic' },
  { n: 5, name: 'المحامية آنا الدرباشي', cat: 'محاماة', tag: '',
    stats: '⭐5.0 · ٦٢ مراجعة · صفر سلبية', phone: '0796806709',
    read: '⭐٥ كاملة وهاد نادر. والمحاماة أعلى قطاع بالثقة: الموكّل بيقرا قبل ما يتصل. ⚠️ ٦٢ مراجعة رقم صغير مقارنة بالباقي، بس بالمحاماة هاد كثير — الناس ما بتحب توثّق قضاياها. لا تقارنه بقاعة أفراح.',
    anchor: '## ٥) المحامية آنا الدرباشي' },
  // ⚠️ الوحيد اللي ما كان إله نص «شو بيستفيد» بملف السبت.
  //    النص تحت **انكتب اليوم** من نفس معطياته المسجّلة بالملف
  //    (بلا ساعات عمل · ٥ صور · صفر سلبية بآخر ٢٤) — ولا ادعاء زايد.
  { n: 6, name: 'Chicas Beauty Center', cat: 'صالونات', tag: '',
    stats: '⭐4.6 · ١٠٩ مراجعة · صفر سلبية بآخر ٢٤', phone: '0790603340',
    read: 'صغير ونظيف، وملفه من أفقر الملفات. الثغرات: بلا موقع · بلا وصف · ٥ صور · بلا ساعات عمل.',
    anchor: '## ٦) Chicas Beauty Center',
    fresh: `«١٠٩ مراجعة وصفر شكوى بآخر ٢٤. الشغل عندكم نظيف.

بس ملفكم على جوجل بلا ساعات عمل — يعني لما حدا يفلتر «فاتح هلأ»، إنتوا ما بتظهروا. مش لأنكم مسكرين، لأنه جوجل ما بيعرف.

وخمس صور بملف صالون تجميل. والزبونة بتقرر بالصورة قبل ما تقرا.»` },
];

const HALLS = [
  { n: 7, name: 'Bebek Halls', stats: '⭐4.4 · ١,٠١٩ · ٧٪ سلبية بس', note: 'الأنظف بالقاعات · الشكوى الوحيدة مواقف سيارات' },
  { n: 8, name: 'قاعات البطيخي', stats: '⭐4.1 · ١,٧٤٩', note: '٢٠٪ سلبية أغلبها بلا نص — الوجع مش واضح' },
  { n: 9, name: 'Amazon Halls', stats: '⭐4.1 · ١,٢٩٤', note: '«الأسعار حدث ولا حرج» — حساسية سعر' },
  { n: 10, name: 'White Hall', stats: '⭐4.4 · ٧٩٠', note: '٢٧٪ — شكوى تنظيم فعالية كبيرة' },
];
const HALL_ANGLE = wiifm('### 💡 مفتاح قطاع القاعات') ||
  md.slice(md.indexOf('**الزاوية:**')).split('\n---')[0].replace(/[>*]/g, '').trim();

// ─── فحص: كل هدف لقى نصه ───
const missing = T.filter((t) => !t.fresh && !wiifm(t.anchor));
if (missing.length) { console.error('🔴 ما لقيت نص «شو بيستفيد» لـ:', missing.map((m) => m.name).join(' · ')); process.exit(1); }
console.log('✅ ' + T.filter(t=>!t.fresh).length + ' لقيوا نصوصهم حرفياً من ملف السبت · ' + T.filter(t=>t.fresh).length + ' انكتب اليوم');

const INK = '#0E0F12', LIME = '#8FA800', SOFT = '#F4F5F0', MUTED = '#6B6F66', LINE = '#DDE0D6';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const track = () => `<table class="tk"><tr>
  <td>القناة <span class="u"></span></td><td>الوقت <span class="u"></span></td>
  <td><i></i> انبعت</td><td><i></i> ردّ</td><td><i></i> مهتم</td>
  <td class="nt">ملاحظات <span class="u" style="min-width:150px"></span></td></tr></table>`;

const card = (t) => `<section class="c">
  <div class="hd"><div class="num">${AR(t.n)}</div>
    <div class="ti"><h2>${esc(t.name)}${t.tag ? `<b class="tg">${t.tag}</b>` : ''}</h2>
      <div class="mt">${esc(t.cat)} &nbsp;·&nbsp; ${esc(t.stats)}${t.phone ? ` &nbsp;·&nbsp; <span class="ph">${t.phone}</span>` : ''}</div></div></div>
  <p class="rd">${esc(t.read)}</p>
  <div class="wf"><span class="lb">شو بيستفيد هو${t.fresh ? ' &nbsp;·&nbsp; انكتب اليوم' : ''}</span>
    <p>${esc(t.fresh || wiifm(t.anchor)).replace(/\n\n?/g, '<br>')}</p></div>
  ${track()}
</section>`;

const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-arabic-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block;unicode-range:U+0000-00FF}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Alex',sans-serif;color:${INK};font-size:10px;line-height:1.6}
h1{font-size:21px;font-weight:800;letter-spacing:-.3px}
.top{border-bottom:2.5px solid ${INK};padding-bottom:9px;margin-bottom:12px}
.sub{font-size:11px;color:${MUTED};margin-top:4px}
.rule{background:${SOFT};border-right:3px solid #C24A4A;padding:9px 12px;border-radius:0 7px 7px 0;font-size:9.5px;line-height:1.7;margin-bottom:14px}
.c{page-break-inside:avoid;border:1.4px solid #E4E6DF;border-radius:11px;padding:13px 15px;margin-bottom:11px}
.hd{display:flex;gap:11px;align-items:flex-start;margin-bottom:7px}
.num{width:26px;height:26px;flex:none;border-radius:7px;background:${INK};color:#D9FF3F;
     font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center}
.ti h2{font-size:13.5px;font-weight:800;line-height:1.3}
.tg{font-size:8.5px;font-weight:700;color:${LIME};margin-right:6px;vertical-align:middle}
.mt{font-size:9px;color:${MUTED};margin-top:2px}
.ph{direction:ltr;display:inline-block;font-weight:700;color:#3D4139}
.rd{font-size:9.5px;color:#3D4139;margin-bottom:8px}
.wf{background:${SOFT};border-radius:8px;padding:10px 12px;margin-bottom:8px}
.wf .lb{display:block;font-size:8px;font-weight:700;letter-spacing:1.2px;color:${LIME};margin-bottom:4px}
.wf p{font-size:10px;line-height:1.85}
table.tk{width:100%;border-collapse:collapse;font-size:8.5px;color:${MUTED}}
table.tk td{border-top:1px solid ${LINE};padding:6px 4px}
.tk i{display:inline-block;width:10px;height:10px;border:1.3px solid #A8AD9F;border-radius:2px;vertical-align:-1px;margin-left:3px}
.u{display:inline-block;min-width:46px;border-bottom:1.2px solid ${LINE};margin:0 3px}
.nt{width:42%}
table.h{width:100%;border-collapse:collapse;font-size:9.5px;margin-bottom:9px}
table.h th{background:${INK};color:#fff;font-size:8.2px;padding:6px 5px}
table.h td{border-bottom:1px solid ${LINE};padding:6px 5px}
table.h .hn{font-weight:700}
table.h .hs{font-size:8.5px;color:${MUTED}}
</style></head><body>

<div class="top">
  <h1>ملف الصيد المفصّل</h1>
  <div class="sub">أهداف ريّان العشرة · السبت ٩ آب ٢٠٢٦ · كلهم بلا موقع إلكتروني</div>
</div>

<div class="rule">
  <b>القاعدة اللي بتحكم كل رسالة:</b> البيانات بتقرر <b>شو بتحكي</b>، وما بتصير هي الحكي.
  ولا معلومة عرفتها عنه بتترد عليه كنقد — صاحب المشروع بيسمع «موقعك ضعيف» كل أسبوع،
  ومن غريب بتقرا استعلاء.<br>
  <b>ونصوص «شو بيستفيد» تحت مكتوبة بعد قراءة مراجعات كل نشاط</b> — استعملها كما هي أو قريب منها.
</div>

${T.map(card).join('')}

<section class="c">
  <div class="hd"><div class="num">٧-١٠</div>
    <div class="ti"><h2>قاعات الأفراح<b class="tg">أربعة أهداف · زاوية واحدة</b></h2>
      <div class="mt">ولا وحدة من السبع قاعات إلها موقع · ولا وحدة بترد على مراجعة</div></div></div>
  <table class="h"><tr><th>#</th><th style="text-align:right">القاعة</th><th style="text-align:right">الأرقام</th><th style="text-align:right">الانتباهة</th></tr>
  ${HALLS.map((h) => `<tr><td style="text-align:center;color:${MUTED}">${AR(h.n)}</td>
    <td class="hn">${esc(h.name)}</td><td class="hs">${esc(h.stats)}</td><td class="hs">${esc(h.note)}</td></tr>`).join('')}
  </table>
  <div class="wf"><span class="lb">الزاوية المشتركة</span><p>${esc(HALL_ANGLE).replace(/\n/g, '<br>')}</p></div>
  <p class="rd" style="margin:0"><b>وشكاواهم كلها تنظيمية</b> (ازدحام، مقاعد، تنسيق) — مش عن المكان نفسه.
  <b>وصفقة العرس بآلاف الدنانير — يعني موقع بيرجع من حجز واحد.</b></p>
  ${track()}
</section>

</body></html>`;

const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(350);
const pdf = `${SRC}/ملف الصيد المفصّل — أهدافي.pdf`;
await p.pdf({ path: pdf, format: 'A4', printBackground: true,
  margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' } });
await b.close();
console.log(`✅ ${T.length} هدف مفصّل + ٤ قاعات → ${pdf}`);
