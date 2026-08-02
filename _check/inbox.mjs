// ═══════════════════════════════════════════════════════════════
//  مستورد عام من صندوق وارد الموقع لأي مشروع
//
//  بياخد مجلد من `_SITE-INBOX`، بيحوّل صوره webp بحجم معقول،
//  وبيضيفهم لمعرض المشروع بـwork.json.
//
//  ⚠️ ما بيدعس على صور موجودة — بيكمّل الترقيم من بعد آخر وحدة.
//  ⚠️ الصور اللي بتنشال: خلفيات شغل ونسخ «not cutted» والمكرّرات.
//
//    node _check/inbox.mjs <معرّف-المشروع> <مجلد-داخل-الوارد> [--dry]
//    مثال:
//    node _check/inbox.mjs al-mofakron "01-NEEDED/al-mofakron"
// ═══════════════════════════════════════════════════════════════
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INBOX = 'D:/Ryan-Work/_SITE-INBOX';
const WORK = join(ROOT, 'src/data/work.json');

const [, , id, sub] = process.argv;
const DRY = process.argv.includes('--dry');
if (!id || !sub) {
  console.log('الاستعمال: node _check/inbox.mjs <معرّف-المشروع> <مجلد-داخل-الوارد> [--dry]');
  process.exit(1);
}

const MAX = 1600;
const SKIP = [/background-\d/i, /not cutted/i, /^_/, /\.txt$/i];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) out.push(p);
  }
  return out;
}

const SRC = join(INBOX, sub);
if (!existsSync(SRC)) {
  console.log(`❌ ما لقيت: ${SRC}`);
  process.exit(1);
}

const work = JSON.parse(readFileSync(WORK, 'utf8'));
const proj = work.projects.find((p) => p.id === id);
if (!proj) {
  console.log(`❌ ما في مشروع اسمه ${id} بـwork.json`);
  process.exit(1);
}

const OUT = join(ROOT, 'public/assets/work', id);
if (!DRY) mkdirSync(OUT, { recursive: true });

const all = walk(SRC);
const picked = all.filter((p) => !SKIP.some((re) => re.test(p.split(/[\\/]/).pop())));
const skipped = all.length - picked.length;

const existing = existsSync(OUT) ? readdirSync(OUT).filter((f) => new RegExp(`^${id}-\\d+\\.webp$`).test(f)) : [];
let next = existing.reduce((m, f) => Math.max(m, +f.match(/\d+/)[0]), 0) + 1;

console.log(`${id}: موجود ${all.length} · بينرفع ${picked.length} · بينشال ${skipped}\n`);

const added = [];
for (const src of picked.sort()) {
  const name = `${id}-${String(next).padStart(2, '0')}.webp`;
  const md = await sharp(src).metadata();
  const long = Math.max(md.width, md.height);

  if (!DRY) {
    let s = sharp(src);
    if (long > MAX) {
      s = s.resize(md.width >= md.height ? { width: MAX } : { height: MAX });
    }
    await s.webp({ quality: 82, effort: 6 }).toFile(join(OUT, name));
  }

  console.log(
    `  ${name}  ${md.width}×${md.height}`.padEnd(32) +
      (DRY ? '' : `${String(Math.round(statSync(join(OUT, name)).size / 1024)).padStart(4)}KB  `) +
      src.replace(SRC, '').replace(/^[\\/]/, ''),
  );
  added.push(`/assets/work/${id}/${name}`);
  next++;
}

if (DRY) {
  console.log('\n(معاينة فقط)');
  process.exit(0);
}

const before = proj.gallery?.length || 0;
proj.gallery = [...(proj.gallery || []), ...added.filter((s) => !(proj.gallery || []).includes(s))];
writeFileSync(WORK, JSON.stringify(work, null, 2) + '\n', 'utf8');

console.log(`\n✅ معرض ${id}: ${before} ← ${proj.gallery.length}`);
console.log(`   بعدها: node _check/covers.mjs ${id} && node _check/covers-webp.mjs`);
