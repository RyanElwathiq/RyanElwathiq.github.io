// ═══════════════════════════════════════════════════════════════
//  إضافة الشغل المسترجَع لقسم التجارب
//
//  ١. ٣ صور معالجة صور من `03-lab-photo-manipulation`
//     ريّان بنفسه: «من اهم الصور اللي لازم تكون موجوده بالتجارب،
//     هيه صور photo manipulations بدون اي براند».
//     ⚠️ هدول أعلى دقة من اللي بمجلد نماذج (ملفات مش لقطات شاشة)
//        فبينحطوا **أول** المجموعة.
//
//  ٢. تصميم مكامن من `04-lab-misc` ← «هويات وشغل متفرّق»
//     بمسار البدايات، لأنه شغل عميل بعلامة مش تجربة بلا بريف.
//
//    node _check/labextra.mjs
// ═══════════════════════════════════════════════════════════════
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const INBOX = 'D:/Ryan-Work/_SITE-INBOX';
const LAB = join(ROOT, 'src/data/lab.json');

const lab = JSON.parse(readFileSync(LAB, 'utf8'));

async function convert(srcDir, outDir, prefix, startAt) {
  if (!existsSync(srcDir)) return [];
  mkdirSync(outDir, { recursive: true });
  const files = readdirSync(srcDir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();
  const out = [];
  let n = startAt;
  for (const f of files) {
    const name = `${prefix}-${String(n).padStart(2, '0')}.webp`;
    const md = await sharp(join(srcDir, f)).metadata();
    let s = sharp(join(srcDir, f));
    if (Math.max(md.width, md.height) > 1400) {
      s = s.resize(md.width >= md.height ? { width: 1400 } : { height: 1400 });
    }
    await s.webp({ quality: 86, effort: 6 }).toFile(join(outDir, name));
    console.log(
      `  ${name}  ${md.width}×${md.height}`.padEnd(30) +
        `${String(Math.round(statSync(join(outDir, name)).size / 1024)).padStart(4)}KB  ${f}`,
    );
    out.push(name);
    n++;
  }
  return out;
}

// ─── ١) معالجة الصور ───
console.log('معالجة الصور (ملفات أصلية، مش لقطات شاشة):');
const manip = await convert(
  join(INBOX, '03-lab-photo-manipulation'),
  join(ROOT, 'public/assets/work/lab'),
  'manip-hi',
  1,
);

const g = lab.tracks.lab.find((x) => x.label === 'Photo manipulation');
if (g && manip.length) {
  const paths = manip.map((n) => `/assets/work/lab/${n}`);
  // الأعلى دقة أولاً — هي اللي بتمسك العين والباقي سياق
  g.shots = [...paths, ...g.shots.filter((s) => !paths.includes(s))];
  g.line =
    'Thirteen techniques, each solved on its own: a creature composited into a moonlit sky, fruit rebuilt as a bottle, a portrait built out of type, dispersion, a painted double exposure. No client and no brief — these are the reps behind everything that came after.';
  g.lineAr =
    'تلاث عشرة تقنية، كل وحدة محلولة لحالها: مخلوق مركّب بسما مقمرة، وفاكهة معاد بناؤها كعبوة، وبورتريه مبني من حروف، وتفتيت، وتعريض مزدوج مرسوم. بلا عميل وبلا بريف — هاي التمارين اللي وراها كل اللي إجا بعدين.';
  console.log(`\n✅ مجموعة معالجة الصور: ${g.shots.length} صورة`);
}

// ─── ٢) مكامن ← هويات وشغل متفرّق ───
console.log('\nشغل متفرّق:');
const misc = await convert(
  join(INBOX, '04-lab-misc'),
  join(ROOT, 'public/assets/work/misc'),
  'misc-extra',
  1,
);

const start = lab.tracks.start.find((x) => x.labelAr === 'هويات وشغل متفرّق');
if (start && misc.length) {
  const paths = misc.map((n) => `/assets/work/misc/${n}`);
  start.shots = [...start.shots.filter((s) => !paths.includes(s)), ...paths];
  console.log(`✅ «هويات وشغل متفرّق»: ${start.shots.length} صورة`);
}

writeFileSync(LAB, JSON.stringify(lab, null, 2) + '\n', 'utf8');
