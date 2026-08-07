// ═══════════════════════════════════════════════════════════════
//  تصدير ملفات العمل → HTML نظيف → PDF + Google Docs (2026-08-08)
//
//  ⚠️ كنت قلت لريّان إنه التحويل لجوجل دوكس بيكسر الجداول. **وهاد صح
//     لو رفعنا ماركداون خام.** بس لو حوّلناه HTML أول، جوجل بيستورد
//     الجداول كجداول حقيقية. فالحل: مسار واحد ومنه مخرجان.
//
//  ⚠️ ما في محوّل ماركداون مثبّت بالمشروع، فالمحوّل هون مكتوب بالإيد
//     ومغطّي **المجموعة اللي بنستعملها فعلاً**: عناوين · جداول · عريض ·
//     كود · اقتباس · قوائم · فواصل · روابط. مش محوّل عام.
//
//  ⚠️ الخط Alexandria مضمّن base64 — بلا هيك Playwright بيسقط على
//     خط النظام بصمت. (درس og.jpg)
//
//  التشغيل: node export-docs.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { chromium } from 'playwright';

const OUT_HTML = 'D:/Ryan-Work/Brand-Ryan/Exports/html';
const OUT_PDF = 'D:/Ryan-Work/Brand-Ryan/Exports/pdf';
mkdirSync(OUT_HTML, { recursive: true });
mkdirSync(OUT_PDF, { recursive: true });

const FONTS = 'D:/Ryan-Portfolio/site/node_modules/@fontsource-variable/alexandria/files';
const b64 = (f) => readFileSync(`${FONTS}/${f}`).toString('base64');

// ─── الملفات المصدَّرة ───
const SRC = [
  ['D:/Ryan-Work/Brand-Ryan/Outreach', 'ملف-السبت.md'],
  ['D:/Ryan-Work/Brand-Ryan/Outreach', 'قائمة-التحقّق.md'],
  ['D:/Ryan-Work/Brand-Ryan/Outreach', 'ملف-الشركات-الأمريكية.md'],
  ['D:/Ryan-Work/Brand-Ryan/Outreach', 'دفعة-السبت-وظائف.md'],
  ['D:/Ryan-Work/Brand-Ryan/Outreach', 'تقديمات-الوظائف.md'],
  ['D:/Ryan-Work/Brand-Ryan/Outreach', 'إصلاح-لينكدإن-عاجل.md'],
  ['D:/Ryan-Work/Brand-Ryan/Outreach', 'بحث-عميق-الخمسة.md'],
  ['D:/Ryan-Brain/wiki', 'الخطة-الموحدة.md'],
  ['D:/Ryan-Brain/wiki', 'منهجية-الصيد-والبحث.md'],
  ['D:/Ryan-Brain/wiki', 'طريقة-الصيد-المزدوج.md'],
  ['D:/Ryan-Brain/wiki', 'أدوات-CRM.md'],
  ['D:/Ryan-Brain/wiki', 'أدوات-أتمتة-التسويق.md'],
];

// ─── محوّل ماركداون مصغّر ───
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// السطر الواحد: عريض · كود · روابط · وصلات ويكي
const inline = (s) => {
  s = esc(s);
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\[\[([^\]]+)\]\]/g, '<em>$1</em>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
};

const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
const isSep = (l) => /^\s*\|[\s:|-]+\|\s*$/.test(l);
const cells = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

function mdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;
  let inFence = false, fence = [];

  while (i < lines.length) {
    const l = lines[i];

    // كتلة كود
    if (/^```/.test(l)) {
      if (inFence) { out.push(`<pre>${esc(fence.join('\n'))}</pre>`); fence = []; inFence = false; }
      else inFence = true;
      i++; continue;
    }
    if (inFence) { fence.push(l); i++; continue; }

    // جدول
    if (isTableRow(l) && isTableRow(lines[i + 1] ?? '') && isSep(lines[i + 1])) {
      const head = cells(l);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) { rows.push(cells(lines[i])); i++; }
      out.push(
        `<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>` +
        rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('') +
        `</tbody></table>`,
      );
      continue;
    }

    // عناوين
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) { out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`); i++; continue; }

    // فاصل
    if (/^\s*(---+|___+|\*\*\*+)\s*$/.test(l)) { out.push('<hr>'); i++; continue; }

    // اقتباس
    if (/^\s*>\s?/.test(l)) {
      const q = [];
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) { q.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      out.push(`<blockquote>${q.map((x) => inline(x)).join('<br>')}</blockquote>`);
      continue;
    }

    // قائمة
    if (/^\s*([-*·•]|\d+[.)])\s+/.test(l)) {
      const ord = /^\s*\d+[.)]\s+/.test(l);
      const items = [];
      while (i < lines.length && /^\s*([-*·•]|\d+[.)])\s+/.test(lines[i])) {
        items.push(inline(lines[i].replace(/^\s*([-*·•]|\d+[.)])\s+/, ''))); i++;
      }
      out.push(`<${ord ? 'ol' : 'ul'}>${items.map((x) => `<li>${x}</li>`).join('')}</${ord ? 'ol' : 'ul'}>`);
      continue;
    }

    if (l.trim() === '') { i++; continue; }

    // فقرة
    const para = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,4}\s|```|\s*>|\s*[-*·•]\s|\s*\d+[.)]\s)/.test(lines[i]) && !isTableRow(lines[i]) && !/^\s*---+\s*$/.test(lines[i])) {
      para.push(lines[i]); i++;
    }
    if (para.length) out.push(`<p>${para.map((x) => inline(x)).join('<br>')}</p>`);
    else i++;
  }
  return out.join('\n');
}

// ─── القالب ───
const wrap = (title, body) => `<!doctype html>
<html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>${esc(title)}</title><style>
@font-face{font-family:'Alexandria';font-weight:100 900;font-display:block;
  src:url(data:font/woff2;base64,${b64('alexandria-arabic-wght-normal.woff2')}) format('woff2');
  unicode-range:U+0600-06FF,U+0750-077F,U+0870-088E,U+08A0-08FF,U+FB50-FDFF,U+FE70-FEFF;}
@font-face{font-family:'Alexandria';font-weight:100 900;font-display:block;
  src:url(data:font/woff2;base64,${b64('alexandria-latin-wght-normal.woff2')}) format('woff2');
  unicode-range:U+0000-00FF,U+2000-206F;}
@page{size:A4;margin:16mm 14mm}
*{box-sizing:border-box}
body{font-family:'Alexandria',Tahoma,sans-serif;font-size:10.5pt;line-height:1.75;
     color:#16181c;margin:0;padding:0}
h1{font-size:20pt;font-weight:800;margin:0 0 4px;letter-spacing:-.01em}
h2{font-size:14.5pt;font-weight:800;margin:24px 0 8px;padding-bottom:6px;border-bottom:2px solid #D9FF3F}
h3{font-size:12pt;font-weight:700;margin:18px 0 6px;color:#2a2d33}
h4{font-size:11pt;font-weight:700;margin:14px 0 4px;color:#3a3d44}
p{margin:0 0 9px}
ul,ol{margin:0 0 10px;padding-inline-start:22px}
li{margin-bottom:4px}
strong{font-weight:700}
code{font-family:Consolas,monospace;font-size:9.4pt;background:#f1f2ee;padding:1px 5px;
     border-radius:4px;direction:ltr;display:inline-block}
pre{font-family:Consolas,monospace;font-size:9pt;background:#14161a;color:#eef0e8;
    padding:12px 14px;border-radius:8px;direction:ltr;text-align:left;
    white-space:pre-wrap;word-break:break-word;margin:0 0 12px}
blockquote{margin:0 0 12px;padding:9px 14px;background:#fafbf5;
           border-inline-start:3px solid #D9FF3F;border-radius:0 6px 6px 0}
table{width:100%;border-collapse:collapse;margin:0 0 14px;font-size:9.6pt;page-break-inside:avoid}
th{background:#14161a;color:#F2F3EE;font-weight:700;padding:7px 9px;text-align:start;
   border:1px solid #14161a}
td{padding:6px 9px;border:1px solid #dcdfd6;vertical-align:top}
tbody tr:nth-child(even){background:#f8f9f4}
hr{border:0;border-top:1px solid #e2e5db;margin:20px 0}
a{color:#4a5a12;text-decoration:underline}
.doc-head{border-bottom:3px solid #D9FF3F;padding-bottom:12px;margin-bottom:20px}
.doc-head .m{font-size:8.6pt;color:#6b6f66;margin-top:4px}
</style></head><body>
<div class="doc-head"><h1>${esc(title)}</h1>
<div class="m">ريّان الواثق · ryanalali.me · صُدّر 2026-08-08</div></div>
${body}
</body></html>`;

// ─── التشغيل ───
const browser = await chromium.launch();
const p = await browser.newPage();
let n = 0;

for (const [dir, name] of SRC) {
  let md;
  try { md = readFileSync(`${dir}/${name}`, 'utf8'); }
  catch { console.log(`⚠️  ما لقيت: ${name}`); continue; }

  const title = name.replace(/\.md$/, '').replace(/-/g, ' ');
  const html = wrap(title, mdToHtml(md));
  const base = name.replace(/\.md$/, '');

  writeFileSync(`${OUT_HTML}/${base}.html`, html, 'utf8');

  await p.setContent(html, { waitUntil: 'domcontentloaded' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: `${OUT_PDF}/${base}.pdf`, format: 'A4', printBackground: true });

  n++;
  console.log(`✅ ${base}`);
}
await browser.close();
console.log(`\n📁 ${n} ملف\n   HTML: ${OUT_HTML}\n   PDF : ${OUT_PDF}`);
