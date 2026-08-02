// ═══════════════════════════════════════════════════════════════
//  استيراد مواد Knockout Media من صندوق وارد الموقع
//
//  المصدر: _SITE-INBOX\01-NEEDED\knockout media
//
//  ⚠️ التنقيح مقصود — المجلد فيه ٦٤ ملف بس مش كلهم شغل نهائي:
//     • `Post 4\background-*.jpg` خلفيات شغل، والنهائي بـ`compleated\`
//     • `Post 8\*not cutted*` نسخ قبل القص
//     • `clients.jpg` و`Services.jpg` مكرّرين مع نسخة `-01`
//     • ملف ٧ كيلو باسم هاش — مش تصميم
//     رفع الخام مع النهائي بيوسّخ المعرض ويخلّي الشغل يبان أضعف.
//
//    node _check/knockoutimport.mjs         ← ينفّذ
//    node _check/knockoutimport.mjs --dry   ← يعرض الاختيار بس
// ═══════════════════════════════════════════════════════════════
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = 'D:/Ryan-Work/_SITE-INBOX/01-NEEDED/knockout media';
const OUT = join(ROOT, 'public/assets/work/knockout');
const WORK = join(ROOT, 'src/data/work.json');
const DRY = process.argv.includes('--dry');

// أطول ضلع — أكبر من هيك ما بيضيف اشي عالشاشة وبيثقّل التحميل
const MAX = 1600;

// ─── ما بينرفع ───
const SKIP = [
  /Post 4[\\/]background-/i, // خلفيات شغل، النهائي بـcompleated
  /not cutted/i, // نسخ قبل القص
  /[\\/](clients|Services)\.jpg$/i, // مكرّرة مع نسخة -01
  /63c52af/i, // ملف ٧ كيلو، مش تصميم
];

function walk(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (/\.(jpe?g|png|webp)$/i.test(e.name)) out.push(p);
  }
  return out;
}

if (!existsSync(SRC)) {
  console.log(`❌ ما لقيت: ${SRC}`);
  process.exit(1);
}

const all = walk(SRC);
const rel = (p) => p.replace(SRC, '').replace(/^[\\/]/, '');

const skipped = all.filter((p) => SKIP.some((re) => re.test(p)));
const picked = all
  .filter((p) => !SKIP.some((re) => re.test(p)))
  // اللوجو أولاً، بعده الهايلايتس، بعدها البوستات بالترتيب
  .sort((a, b) => {
    const rank = (p) => (/KO High Quality/i.test(p) ? 0 : /highlits/i.test(p) ? 1 : 2);
    return rank(a) - rank(b) || rel(a).localeCompare(rel(b), 'en');
  });

console.log(`الموجود: ${all.length} · بينرفع: ${picked.length} · بينشال: ${skipped.length}\n`);
console.log('── بينشال ──');
skipped.forEach((p) => console.log('  ✗ ' + rel(p)));
console.log('\n── بينرفع ──');

const work = JSON.parse(readFileSync(WORK, 'utf8'));
const proj = work.projects.find((p) => p.id === 'knockout');
if (!proj) {
  console.log('❌ ما في مشروع knockout بـwork.json');
  process.exit(1);
}

// منكمّل الترقيم من بعد الموجود بدل ما ندعس عليه
const existing = readdirSync(OUT).filter((f) => /^knockout-\d+\.webp$/.test(f));
let next = existing.reduce((m, f) => Math.max(m, +f.match(/\d+/)[0]), 0) + 1;

const added = [];
for (const src of picked) {
  const name = `knockout-${String(next).padStart(2, '0')}.webp`;
  const md = await sharp(src).metadata();
  const long = Math.max(md.width, md.height);

  if (!DRY) {
    await sharp(src)
      .resize(long > MAX ? { width: md.width >= md.height ? MAX : null, height: md.height > md.width ? MAX : null } : undefined)
      .webp({ quality: 82, effort: 6 })
      .toFile(join(OUT, name));
  }

  const kb = DRY ? 0 : Math.round(statSync(join(OUT, name)).size / 1024);
  console.log(
    `  ${name}  ${String(md.width)}×${md.height}`.padEnd(34) +
      (DRY ? '' : `${String(kb).padStart(4)}KB  `) +
      rel(src),
  );
  added.push(`/assets/work/knockout/${name}`);
  next++;
}

if (DRY) {
  console.log('\n(معاينة فقط — ما انحفظ اشي)');
  process.exit(0);
}

const before = proj.gallery.length;
proj.gallery = [...proj.gallery, ...added.filter((s) => !proj.gallery.includes(s))];
writeFileSync(WORK, JSON.stringify(work, null, 2) + '\n', 'utf8');

console.log(`\n✅ معرض knockout: ${before} ← ${proj.gallery.length} صورة`);
