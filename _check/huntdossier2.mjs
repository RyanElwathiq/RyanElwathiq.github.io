// ═══════════════════════════════════════════════════════════════
//  ملف الصيد v2 — رسالتان لكل هدف (2026-08-08)
//
//  ليش نسختان؟ لأنه الأرقام الظاهرة أرقام محلات مش أرقام أصحاب
//  القرار. فاللي بيستقبل الرسالة موظفة استقبال أو مسؤول سوشال —
//  ورسالة البيع معه بتموت، لأنه ما بيقدر يقرر وما بيحب يوصّل عرض.
//
//  فالرسالة الأولى **ما بتبيع، بتسأل**: مين المسؤول؟ والحاجب بيدلّك
//  لأنه ما حاسس إنه بينصدّ بائع. والتانية للشخص نفسه، وبتبدأ باسمه.
//
//  ⚠️ وفوق كل هدف خانة فحص إجبارية: **متابعين إنستغرام**.
//     السبب بـ[[verify-before-you-pitch]] — رسالة «ما حدا بيلاقيك»
//     كانت رح تنبعت لحساب فيه ٢٢١ ألف متابع.
//
//  التشغيل: node _check/huntdossier2.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync } from 'fs';
import { chromium } from 'playwright';

const SRC = 'D:/Ryan-Work/Brand-Ryan/Outreach';
const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');

// الحاجب: نفس النص للكل — هو طلب توجيه مش عرض
const GATE = (name) => `مرحبا،

أنا ريّان، ببني مواقع وأنظمة حجز.

سؤال قصير: مين المسؤول عن الحضور الرقمي عندكم؟ عندي ملاحظة محددة عن ${name} وحابب أوصلها للشخص الصح.

بتقدروا تحوّلوا الرسالة أو تعطوني اسمه وأنا بكمّل معه.

شكراً`;

const T = [
  {
    n: 1, name: 'عيادة د. نيفين دبابنة', cat: 'جلدية وتجميل · الدوار السابع',
    stats: '⭐4.8 · ١,٣٤٥ مراجعة · ٥.٤٪ نجمة وحدة · ٨٩ صورة · موثّق',
    phone: '+962798253922', ig: '@clinicaneveen · ٢٢١,٨٨٠ متابع · موثّق ✅ مفحوص',
    data: 'وصف موجود · ساعات موجودة · مواضيع المراجعات: بوتوكس · ليزر · طاقم مميّز. ورابط البايو الوحيد بيوصل لريل تاني على إنستغرام.',
    dm: `صباح الخير دكتورة نيفين،

أنا ريّان، ببني مواقع وبشتغل بالتسويق الرقمي.

لفتني إشي بحسابك: الرابط الوحيد بالبايو بيوصل لريل تاني على إنستغرام. يعني ٢٢١ ألف متابع، والباب الوحيد للخروج بيرجّعهم جوّا.

وبنفس الوقت، اللي بيكتب «ليزر عمّان» أو «فيلر أسعار» على جوجل مش نفس اللي بيتصفح إنستغرام. هاد قرر وعم يقارن، وحضرتك مش هناك.

ما عندك مشكلة وصول. عندك ٢٢١ ألف دليل عالعكس. المشكلة إنه الوصول ما إله مكان يهبط فيه ويحجز.

إذا بيهمك، بحضّرلك تشخيص مكتوب بلا التزام.

ريّان الواثق · ryanalali.me`,
  },
  {
    n: 2, name: 'Teal By Bana', cat: 'صالونات · للسيدات فقط',
    stats: '⭐4.4 · ١,٤٠٦ مراجعة · ١١.٩٪ نجمة وحدة · ٤٨ صورة · موثّق',
    phone: '+962771909091', ig: '@tealbybana · ٤١٥,٠٠٠ متابع ✅ مفحوص',
    data: 'بلا وصف على جوجل · رابط البايو بيوصل لدبوس خرائط · إشارات المراجعات: حجز(٦) انتظار(٤) سعر(٢) من ٣٠ · بيردّوا على المراجعات بمهنية.',
    dm: `صباح الخير،

أنا ريّان، ببني مواقع وأنظمة حجز.

قريت آخر ٣٠ مراجعة عندكم. الشكوى مش على الشغل، على المواعيد. «بيقبل مواعيد فوق طاقته الاستيعابية» جملة زبونة حرفياً.

وبنفس الوقت عندكم ٤١٥ ألف متابع، والرابط الوحيد بالبايو بيوصل لدبوس على الخريطة. يعني ٤١٥ ألف واحدة، وطريق الحجز الوحيد مكالمة.

وهون بيصير المنطقي: ما حدا بيعرف كم كرسي فاضي بأي ساعة، لا اللي بتحجز ولا اللي بيسجّل. فالازدحام مش سوء إدارة، هو نتيجة حتمية.

وردودكم على المراجعات من أحسن اللي شفتها. إنتوا بتهتموا، القناة هي العاجزة.

إذا بيهمك، بفرجيك كيف بيشتغل نظام حجز بيعرف طاقتك الاستيعابية.

ريّان الواثق · ryanalali.me`,
  },
  {
    n: 3, name: 'مركز د. مايا خلف لطب الأسنان', cat: 'أسنان · الشميساني',
    stats: '⭐4.8 · ٢٣٨ مراجعة · ٤.٢٪ نجمة وحدة · ٨ صور · موثّق',
    phone: '+96265652231', ig: '❓ لازم تفحصه',
    data: 'بلا وصف على جوجل · ٨ صور بس · مواضيع المراجعات: مهارة وتعقيم وخبرة. ولا إنستغرام بالنتائج، بس إلها لينكدإن شخصي: dr-maya-khalaf-1a1ba81b — وهاد بيوصلك لها هي مش للعيادة.',
    dm: `صباح الخير،

أنا ريّان، ببني مواقع وأنظمة حجز للعيادات.

٢٣٨ مراجعة و⭐4.8 وأقل من ٥٪ سلبية. الشغل عندكم واضح إنه نظيف، والمراجعات بتحكي عن التعقيم والمهارة.

بس ملفكم على جوجل بلا وصف وفيه ٨ صور. واللي بيدوّر دكتور أسنان بيقرر بالصور والتفاصيل قبل ما يرفع سماعة.

وما عندكم مكان تملكوه يشرح الخدمات والفرق بين الحالات، فكل سؤال بيرجع مكالمة، وكل مكالمة وقت من طاقم العيادة.

إذا بيهمك، بحضّرلك تشخيص مكتوب بلا التزام.

ريّان الواثق · ryanalali.me`,
  },
  {
    n: 4, name: 'W Derma Clinic — د. وليد العبادي', cat: 'جلدية وتجميل',
    stats: '⭐4.7 · ٢٥٣ مراجعة · بلا موقع', phone: '+962797111525',
    ig: '❓ إنستغرام لازم تفحصه · لينكدإن: waleed-abbadi-741b9439',
    data: '🔴 موجود على طبكان وVezeeta، ومدرج كمان بعيادة Eden Aesthetics. يعني بيدفع لمنصات حجز أصلاً — هو مش غايب، هو مستأجر. ⚠️ وفي عيادة باسم قريب (Dr. Hussam Abbadi) وعندها موقع، تأكد إنك بتراسل الصح.',
    dm: `صباح الخير دكتور وليد،

أنا ريّان، ببني مواقع وأنظمة حجز.

لقيتك على طبكان وعلى Vezeeta. يعني إنت أصلاً مقتنع إنه المريض بيبحث ويحجز أونلاين، وبتدفع عشان تكون موجود هناك.

بس المنصة هي اللي بتملك المريض مش إنت. نفس الصفحة اللي بيحجز منها عندك بتعرض عليه دكاترة تانيين، وأول ما توقف الاشتراك بتختفي.

و٢٥٣ مراجعة وتقييم ٤.٧ — هاي سمعة بنيتها إنت، وقاعدة على منصة غيرك.

مش بقولك اترك المنصات. بقولك خليها قناة وحدة، مش القناة الوحيدة.

إذا بيهمك، بفرجيك شو بيتغيّر لما يصير في مكان إلك إنت.

ريّان الواثق · ryanalali.me`,
  },
  {
    n: 5, name: 'Chicas Beauty Center', cat: 'صالونات · شارع الملكة رانيا',
    stats: '⭐4.6 · ١٠٩ مراجعة · ٩.٢٪ نجمة وحدة · ٥ صور · موثّق',
    phone: '+962790603340', ig: '❓ لازم تفحصه · ⚠️ Exa ما لقاه بشارع الملكة رانيا — تحقق قبل الإرسال',
    data: '🔴 بلا ساعات عمل · بلا وصف · ٥ صور بس. أفقر ملف بالقائمة كلها.',
    dm: `صباح الخير،

أنا ريّان، ببني مواقع.

١٠٩ مراجعة وصفر شكوى بآخر ٢٤. شغلكم نظيف.

بس ملفكم على جوجل بلا ساعات عمل. يعني لما حدا يفلتر «فاتح هلأ»، ما بتظهروا. مش لأنكم مسكرين، لأنه جوجل ما بيعرف.

وخمس صور بملف صالون تجميل، والزبونة بتقرر بالصورة قبل ما تقرا.

هدول تصليحات بتاخد ساعة. إذا بيهمك بمرّها معك بلا مقابل.

ريّان الواثق · ryanalali.me`,
  },
];

const HALLS = [
  { n: 6, name: 'Bebek Halls', stats: '⭐4.4 · ١,٠١٩ · ١٠.٣٪ · ٣٢٤ صورة', phone: '+962799243111',
    note: 'الأنظف بالقاعات · سعة ٩٠٠ · فيسبوك رسمي: facebook.com/BebekHalls · على qa3at وعروس الأردن' },
  { n: 7, name: 'قاعات البطيخي للأفراح', stats: '⭐4.1 · ١,٧٤٩ · ٥.٧٪ · ٢٦٥ صورة', phone: '+962798282411',
    note: '⚠️ «مراقبة خفيفة» بقائمة التحقّق، تواصل عادي بلا أي إشارة · رقم ثانٍ 0795922606 · المقابلين شارع الحرية' },
  { n: 8, name: 'Amazon Halls قاعات الأمازون', stats: '⭐4.1 · ١,٢٩٤ · ٩.٢٪ · ٢٣٢ صورة', phone: '+962799333163',
    note: 'اليادودة · «الأسعار حدث ولا حرج» = حساسية سعر فلا تفتح بالسعر · ولا أثر رقمي برّا جوجل' },
  { n: 9, name: 'White Hall', stats: '⭐4.4 · ٧٩٠ · ٥.٨٪ · ٤٨٧ صورة', phone: '+962779767666',
    note: 'طريق المطار · شاشات خارجية ٢٠٠ متر · مسجّلة باسم whitehalljordan · على qa3at وteketat' },
];

const HALL_DM = `صباح الخير،

أنا ريّان، ببني مواقع.

العروسة بتقارن ٥ لـ٦ قاعات على مدى شهور. وأول مكان بتلاقيكم فيه أدلة زي قاعات وعروس الأردن.

والمشكلة إنه بنفس الصفحة اللي فيها قاعتكم، منافسينكم بضغطة وحدة. والدليل هو اللي بيقرر مين يطلع فوق، مش إنتوا.

وبعد ما تشوفكم، بدها تعرف السعة والباكجات والتواريخ الفاضية. وهاد كله عندكم بيصير بمكالمة وزيارة، يعني لازم تختاركم قبل ما تشوفكم.

والقاعة اللي بتوريها هاد قبل ما ترفع سماعة بتكسب الجولة الأولى.

وصفقة العرس بآلاف الدنانير. يعني موقع بيرجع من حجز واحد.

ريّان الواثق · ryanalali.me`;

const INK = '#0E0F12', LIME = '#8FA800', SOFT = '#F4F5F0', MUTED = '#6B6F66', LINE = '#DDE0D6';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const msg = (label, txt, kind) =>
  `<div class="m ${kind}"><span class="ml">${label}</span><pre>${esc(txt)}</pre></div>`;
const track = () => `<table class="tk"><tr>
  <td><i></i> بعتت للحاجب</td><td><i></i> وصلت لصاحب القرار</td>
  <td><i></i> ردّ</td><td><i></i> مهتم</td>
  <td class="nt">الاسم اللي وصلتله <span class="u"></span></td></tr></table>`;

const card = (t) => `<section class="c">
  <div class="hd"><div class="num">${AR(t.n)}</div>
    <div class="ti"><h2>${esc(t.name)}</h2><div class="mt">${esc(t.cat)}</div></div>
    <div class="ph">${t.phone}</div></div>
  <div class="st">${esc(t.stats)}</div>
  <div class="ig ${t.ig.includes('❓') ? 'todo' : 'ok'}"><b>إنستغرام:</b> ${esc(t.ig)}
    ${t.ig.includes('❓') ? '<span class="u" style="min-width:120px"></span> متابع' : ''}</div>
  <p class="rd">${esc(t.data)}</p>
  ${msg('١) للحاجب — اللي بيستقبل الرسالة', GATE(t.name), 'g')}
  ${msg('٢) لصاحب القرار', t.dm, 'd')}
  ${track()}
</section>`;

const html = `<!doctype html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-arabic-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Alex';src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');font-weight:100 900;font-display:block;unicode-range:U+0000-00FF}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Alex',sans-serif;color:${INK};font-size:9.5px;line-height:1.6}
h1{font-size:21px;font-weight:800;letter-spacing:-.3px}
.top{border-bottom:2.5px solid ${INK};padding-bottom:9px;margin-bottom:11px}
.sub{font-size:11px;color:${MUTED};margin-top:4px}
.rule{background:${SOFT};border-right:3px solid #C24A4A;padding:9px 12px;border-radius:0 7px 7px 0;font-size:9.5px;line-height:1.7;margin-bottom:9px}
.rule.g{border-right-color:${LIME}}
.c{page-break-inside:avoid;border:1.4px solid #E4E6DF;border-radius:11px;padding:12px 14px;margin-bottom:10px}
.hd{display:flex;gap:10px;align-items:center;margin-bottom:6px}
.num{width:25px;height:25px;flex:none;border-radius:7px;background:${INK};color:#D9FF3F;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center}
.ti{flex:1}.ti h2{font-size:13px;font-weight:800;line-height:1.3}
.mt{font-size:8.5px;color:${MUTED}}
.hd .ph{direction:ltr;font-size:10px;font-weight:700;color:#3D4139}
.st{font-size:9px;color:${MUTED};margin-bottom:5px}
.ig{font-size:9px;padding:5px 8px;border-radius:5px;margin-bottom:6px}
.ig.ok{background:#F0F5E4;color:#4A5A28}
.ig.todo{background:#FDF0EF;color:#8C3A34}
.rd{font-size:9px;color:#3D4139;margin-bottom:7px}
.m{border-radius:8px;padding:8px 10px;margin-bottom:6px}
.m.g{background:#F7F8F4;border:1px dashed #CFD3C7}
.m.d{background:${SOFT}}
.ml{display:block;font-size:7.8px;font-weight:700;letter-spacing:1px;color:${LIME};margin-bottom:3px}
.m pre{font-family:'Alex',sans-serif;font-size:9.3px;line-height:1.75;white-space:pre-wrap}
table.tk{width:100%;border-collapse:collapse;font-size:8.2px;color:${MUTED}}
table.tk td{border-top:1px solid ${LINE};padding:5px 3px}
.tk i{display:inline-block;width:9px;height:9px;border:1.3px solid #A8AD9F;border-radius:2px;vertical-align:-1px;margin-left:3px}
.u{display:inline-block;min-width:56px;border-bottom:1.2px solid ${LINE};margin:0 3px}
.nt{width:34%}
table.h{width:100%;border-collapse:collapse;font-size:9px;margin-bottom:7px}
table.h th{background:${INK};color:#fff;font-size:8px;padding:5px}
table.h td{border-bottom:1px solid ${LINE};padding:5px}
</style></head><body>

<div class="top"><h1>ملف الصيد · نسخة ٢</h1>
  <div class="sub">٩ أهداف · رسالتان لكل واحد · السبت ٩ آب ٢٠٢٦</div></div>

<div class="rule">
  <b>⚠️ افحص إنستغرام قبل ما تبعت. كل مرة.</b><br>
  رسالة «ما حدا بيلاقيك» كانت رح تنبعت لد. نيفين وعندها <b>٢٢١ ألف متابع</b>، ولـTeal وعندها <b>٤١٥ ألف</b>.
  ٣٠ ثانية بتطبيق إنستغرام بتمنع حرق هدف. <b>واكتب الرقم بالخانة</b> قبل ما تبعت.
</div>

<div class="rule g">
  <b>ليش رسالتان؟</b> الأرقام الظاهرة أرقام محلات مش أصحاب قرار. الأولى <b>ما بتبيع، بتسأل</b> مين المسؤول —
  والحاجب بيدلّك لأنه ما حاسس إنه بيصدّ بائع. والتانية للشخص نفسه وبتبدأ باسمه.<br>
  <b>ولا معلومة عرفتها عنه بتترد عليه كنقد.</b>
</div>

${T.map(card).join('')}

<section class="c">
  <div class="hd"><div class="num">٦-٩</div>
    <div class="ti"><h2>قاعات الأفراح — أربعة أهداف، زاوية واحدة</h2>
      <div class="mt">ولا وحدة من السبع قاعات إلها موقع · ولا وحدة بترد على مراجعة</div></div></div>
  <table class="h"><tr><th>#</th><th style="text-align:right">القاعة</th><th style="text-align:right">الأرقام</th><th>الهاتف</th><th style="text-align:right">الانتباهة</th></tr>
  ${HALLS.map((h) => `<tr><td style="text-align:center;color:${MUTED}">${AR(h.n)}</td>
    <td style="font-weight:700">${esc(h.name)}</td><td style="font-size:8.3px;color:${MUTED}">${esc(h.stats)}</td>
    <td style="direction:ltr;font-size:8.5px;font-weight:700">${h.phone}</td>
    <td style="font-size:8.3px;color:${MUTED}">${esc(h.note)}</td></tr>`).join('')}
  </table>
  <div class="ig todo"><b>إنستغرام الأربعة:</b> افحصهم واكتب المتابعين
    <span class="u" style="min-width:200px"></span></div>
  ${msg('١) للحاجب', GATE('القاعة'), 'g')}
  ${msg('٢) لصاحب القرار — نفس النص للأربعة', HALL_DM, 'd')}
  <p class="rd" style="margin:6px 0 0"><b>وشكاواهم كلها تنظيمية</b> (ازدحام، مقاعد، تنسيق) مش عن المكان نفسه.
  <b>ولا وحدة من الرسائل فيها نقد.</b></p>
  ${track()}
</section>

</body></html>`;

const b = await chromium.launch();
const p = await b.newPage();
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(350);
const pdf = `${SRC}/ملف الصيد — نسخة ٢ برسالتين.pdf`;
await p.pdf({ path: pdf, format: 'A4', printBackground: true,
  margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' } });
await b.close();
console.log(`✅ ${T.length} مفصّل + ٤ قاعات · ${(T.length + 1) * 2} رسالة → ${pdf}`);
