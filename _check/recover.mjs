// ═══════════════════════════════════════════════════════════════
//  استرجاع الصور من المحادثة القديمة
//
//  ريّان بعت عشرات التصاميم كصور ملصوقة بالشات، والقاعدة عندنا
//  إنه «الصور اللي بتنلصق بالمحادثة ما بتنحفظ عالقرص». طلع إنها
//  **بتنحفظ فعلاً** — جوّا ملف المحادثة نفسه كـbase64.
//
//  فبدل ما نطلب منه يبعتهم من جديد، منستخرجهم كلهم مع نص
//  الرسالة اللي إجت معها، وهيك بنعرف كل صورة لأي مشروع.
//
//    node _check/recover.mjs           ← يستخرج الكل
//    node _check/recover.mjs --list    ← يعدّ بس بدون حفظ
// ═══════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const JSONL =
  'C:/Users/rayan/.claude/projects/D---------------------luvit------/64d91bc9-3f46-454b-b899-6de5a9a7b223.jsonl';
const OUT = 'D:/Ryan-Work/_SITE-INBOX/05-unsorted/من-المحادثة-القديمة';
const LIST = process.argv.includes('--list');

if (!existsSync(JSONL)) {
  console.log('❌ ما لقيت ملف المحادثة');
  process.exit(1);
}

const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

const lines = readFileSync(JSONL, 'utf8').split('\n');
const groups = [];
const seen = new Set(); // المحادثة فيها تكرار بعد التلخيص

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

  // بصمة أول صورة تكفي لكشف التكرار
  const key = imgs[0].source.data.slice(0, 120) + '|' + imgs.length;
  if (seen.has(key)) return;
  seen.add(key);

  groups.push({ line: idx + 1, txt, imgs });
});

const total = groups.reduce((n, g) => n + g.imgs.length, 0);
const bytes = groups.reduce(
  (n, g) => n + g.imgs.reduce((a, i) => a + Math.round(i.source.data.length * 0.75), 0),
  0,
);
console.log(`مجموعات: ${groups.length} · صور: ${total} · تقريباً ${(bytes / 1048576).toFixed(0)} ميجا`);

if (LIST) {
  groups.forEach((g) => console.log(`[${g.line}] ${g.imgs.length} — ${g.txt.slice(0, 90) || '(بلا نص)'}`));
  process.exit(0);
}

mkdirSync(OUT, { recursive: true });
const manifest = [];

for (const g of groups) {
  const dir = join(OUT, `رسالة-${String(g.line).padStart(5, '0')}`);
  mkdirSync(dir, { recursive: true });

  const files = [];
  g.imgs.forEach((im, i) => {
    const ext = EXT[im.source.media_type] || 'bin';
    const name = `${String(i + 1).padStart(2, '0')}.${ext}`;
    writeFileSync(join(dir, name), Buffer.from(im.source.data, 'base64'));
    files.push(name);
  });

  // نص الرسالة جنب الصور — هو المفتاح لمعرفة كل صورة لأي مشروع
  writeFileSync(
    join(dir, '_الرسالة.txt'),
    `سطر المحادثة: ${g.line}\nعدد الصور: ${g.imgs.length}\n\n${g.txt || '(بعتها بدون نص)'}\n`,
    'utf8',
  );

  manifest.push({ line: g.line, count: g.imgs.length, dir: `رسالة-${String(g.line).padStart(5, '0')}`, text: g.txt });
}

writeFileSync(join(OUT, '_فهرس.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log(`\n✅ انحفظوا بـ ${OUT}`);
console.log(`   كل رسالة بمجلد، وجنبها نصها بملف _الرسالة.txt`);
