// ═══════════════════════════════════════════════════════════════
//  استرجاع صور من أي محادثة (مش بس القديمة)
//
//  نفس فكرة recover.mjs بس بتاخد ملف المحادثة كوسيط، وبتقدر
//  تحدّد آخر N مجموعة بس — لما ريّان يبعت صور بالمحادثة الحالية.
//
//    node _check/recover2.mjs                    ← آخر محادثة، آخر مجموعة
//    node _check/recover2.mjs --last 3           ← آخر ٣ مجموعات
//    node _check/recover2.mjs --out <مجلد>
// ═══════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'C:/Users/rayan/.claude/projects/D---------------------luvit------';
const args = process.argv.slice(2);
const LAST = +(args[args.indexOf('--last') + 1] || 1);
const OUT = args.includes('--out')
  ? args[args.indexOf('--out') + 1]
  : 'D:/Ryan-Work/_SITE-INBOX/05-unsorted/من-المحادثة-الحالية';

// أحدث ملف محادثة
const file = readdirSync(DIR)
  .filter((f) => f.endsWith('.jsonl'))
  .map((f) => ({ f, t: statSync(join(DIR, f)).mtimeMs }))
  .sort((a, b) => b.t - a.t)[0].f;

console.log('المحادثة: ' + file);

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
const lines = readFileSync(join(DIR, file), 'utf8').split('\n');
const groups = [];

lines.forEach((line, idx) => {
  if (!line) return;
  let o;
  try {
    o = JSON.parse(line);
  } catch {
    return;
  }
  const m = o.message || {};
  if (m.role !== 'user' || !Array.isArray(m.content)) return;
  const imgs = m.content.filter((c) => c.type === 'image' && c.source?.data);
  if (!imgs.length) return;
  const txt = m.content
    .filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  groups.push({ line: idx + 1, txt, imgs });
});

const take = groups.slice(-LAST);
console.log(`مجموعات بالمحادثة: ${groups.length} · بنستخرج آخر ${take.length}\n`);

mkdirSync(OUT, { recursive: true });
for (const g of take) {
  const dir = join(OUT, `رسالة-${String(g.line).padStart(5, '0')}`);
  mkdirSync(dir, { recursive: true });
  g.imgs.forEach((im, i) => {
    const name = `${String(i + 1).padStart(2, '0')}.${EXT[im.source.media_type] || 'bin'}`;
    writeFileSync(join(dir, name), Buffer.from(im.source.data, 'base64'));
  });
  writeFileSync(join(dir, '_الرسالة.txt'), `سطر: ${g.line}\n\n${g.txt}\n`, 'utf8');
  console.log(`[${g.line}] ${g.imgs.length} صورة — ${g.txt.slice(0, 80)}`);
}
console.log(`\n✅ ${OUT}`);
