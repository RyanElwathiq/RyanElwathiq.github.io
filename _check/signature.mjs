// ═══════════════════════════════════════════════════════════════
//  توقيع الإيميل — عربي وإنجليزي (2026-08-08)
//
//  ⚠️ توقيع الإيميل مش صفحة ويب. قيوده حقيقية:
//     · جداول بس — flex وgrid بينكسروا بأوتلوك
//     · ستايل inline بس — أي <style> بينشال بجيميل
//     · روابط صور مطلقة https — الصور المحلية ما بتظهر للمستقبل
//     · بلا خطوط مخصصة — Alexandria ما بتنزل، فالبديل خط النظام
//
//  ⚠️ اللوجو محطوط جوّا مربع غامق بـbgcolor مش بـCSS، عشان
//     الوضع الليلي بأي برنامج ما يقدر يخفيه. المربع بيحمل خلفيته
//     معه.
//
//  ⚠️ والتوقيع كله جوّا كرت فاتح بـbgcolor (قرار ريّان 2026-08-08):
//     بلاه، برنامج بريد بيعتّم الخلفية وما بيفتّح النص بيخلي
//     الاسم والروابط شبه مخفيين. الكرت بيحمل خلفيته معه فبيضل
//     مقروء بأي ثيم.
//
//  ⚠️ الشكل مقصود إنه مختلف عن التوقيع المرجعي اللي شفناه: هداك خط
//     أحمر عمودي بجنب اللوجو، وهذا خيط ليموني أفقي, لغة «خيط الضوء».
//     (الاسم انشال من هون: الريبو PUBLIC.)
//
//  التشغيل: node _check/signature.mjs
// ═══════════════════════════════════════════════════════════════
import { writeFileSync, mkdirSync } from 'fs';
import { chromium } from 'playwright';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Signature';
mkdirSync(OUT, { recursive: true });

const INK = '#0E0F12';
const LIME = '#D9FF3F';
const LIME_D = '#7E9400'; // نسخة غامقة للنص على أبيض — الليموني نفسه ما بينقرا
const MUTED = '#6B6F66';
const PAPER = '#F2F3EE'; // ورق الهوية — الكرت اللي بيحمل خلفيته معه
const LOGO = 'https://ryanalali.me/assets/logo-white.png';

// ⚠️ حط رقمك هون لو بدك يظهر، أو خليه فاضي وبينشال السطر كله
const PHONE = '';

const T = {
  en: {
    dir: 'ltr',
    name: 'Rayan Elwathiq',
    role: 'Marketer and digital experience designer',
    tag: 'Marketing that builds. Results you can measure.',
    li: 'LinkedIn',
    font: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  ar: {
    dir: 'rtl',
    name: 'ريّان الواثق',
    role: 'مسوّق ومصمّم تجارب رقمية',
    tag: 'تسويق يبني، ونتائج بتنقاس بالأرقام.',
    li: 'لينكدإن',
    font: "'Segoe UI', Tahoma, Arial, sans-serif",
  },
};

const sig = (L) => {
  const link = (href, text) =>
    `<a href="${href}" style="color:${INK};text-decoration:none;font-weight:600">${text}</a>`;
  const dot = `<span style="color:${LIME_D};padding:0 7px">&bull;</span>`;

  const contacts = [
    link('mailto:ryan@ryanalali.me', 'ryan@ryanalali.me'),
    link('https://ryanalali.me', 'ryanalali.me'),
    link('https://www.linkedin.com/in/rayan-elwathiq', L.li),
  ];
  if (PHONE) contacts.splice(1, 0, link('tel:' + PHONE.replace(/\s/g, ''), PHONE));

  return `<table cellpadding="0" cellspacing="0" border="0" bgcolor="${PAPER}" dir="${L.dir}" style="border-collapse:collapse;background-color:${PAPER};border-radius:12px">
<tr><td style="padding:17px 21px">
<table cellpadding="0" cellspacing="0" border="0" dir="${L.dir}" style="border-collapse:collapse;font-family:${L.font};direction:${L.dir}">
 <tr>
  <td style="padding:0 ${L.dir === 'rtl' ? '0 0 14px' : '14px 0 0'};vertical-align:middle">
   <table cellpadding="0" cellspacing="0" border="0" bgcolor="${INK}" style="border-collapse:collapse;background-color:${INK};border-radius:10px">
    <tr><td align="center" valign="middle" width="58" height="58" style="width:58px;height:58px;padding:0">
     <img src="${LOGO}" width="34" height="34" alt="" style="display:block;border:0;width:34px;height:34px">
    </td></tr>
   </table>
  </td>
  <td style="vertical-align:middle;padding:0">
   <div style="font-size:17px;font-weight:700;color:${INK};line-height:1.3;letter-spacing:-0.2px">${L.name}</div>
   <div style="font-size:12.5px;color:${MUTED};line-height:1.5;padding-top:2px">${L.role}</div>
  </td>
 </tr>
 <tr><td colspan="2" style="padding:11px 0 0">
   <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tr>
    <td bgcolor="${LIME}" height="3" width="46" style="background-color:${LIME};height:3px;width:46px;line-height:3px;font-size:0">&nbsp;</td>
    <td bgcolor="#E8EAE2" height="3" width="150" style="background-color:#E8EAE2;height:3px;width:150px;line-height:3px;font-size:0">&nbsp;</td>
   </tr></table>
 </td></tr>
 <tr><td colspan="2" style="padding:10px 0 0;font-size:12.5px;color:${INK};line-height:1.7">
   ${contacts.join(dot)}
 </td></tr>
 <tr><td colspan="2" style="padding:6px 0 0;font-size:11.5px;color:${MUTED};line-height:1.6">
   ${L.tag}
 </td></tr>
</table>
</td></tr></table>`;
};

const html = { en: sig(T.en), ar: sig(T.ar) };
writeFileSync(`${OUT}/توقيع-انجليزي.html`, html.en, 'utf8');
writeFileSync(`${OUT}/توقيع-عربي.html`, html.ar, 'utf8');

// ─── معاينة: نفس التوقيع فوق أبيض وفوق غامق ───
const page = `<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;font-family:'Segoe UI',Arial,sans-serif}
.pane{padding:34px 38px}
.lbl{font-size:11px;letter-spacing:1.5px;font-weight:700;margin-bottom:16px;text-transform:uppercase}
.light{background:#fff}.light .lbl{color:#9AA093}
.dark{background:#1B1C1F}.dark .lbl{color:#6E7268}
hr{border:0;border-top:1px solid #ECEEE8;margin:0}
</style></head><body>
<div class="pane light"><div class="lbl">English &middot; light</div>${html.en}</div><hr>
<div class="pane light"><div class="lbl">عربي &middot; light</div>${html.ar}</div>
<div class="pane dark"><div class="lbl">English &middot; dark mode</div>${html.en}</div>
</body></html>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 720, height: 780 }, deviceScaleFactor: 2 });
await p.setContent(page, { waitUntil: 'networkidle' });
await p.waitForTimeout(400);
await p.screenshot({ path: `${OUT}/معاينة.png`, fullPage: true });
await b.close();

console.log(`✅ التوقيعان + المعاينة → ${OUT}`);
console.log(PHONE ? `الرقم مضمّن: ${PHONE}` : '⚠️ بلا رقم هاتف — عدّل PHONE بالسكربت لو بدك تضيفه');
