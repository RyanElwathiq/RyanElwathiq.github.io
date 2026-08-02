// ═══════════════════════════════════════════════════════════════
//  استيراد دراسات معالجة الصور لقسم «التجارب»
//
//  المصدر: D:\Ryan-Personal\Misc\نماذج
//  شغل ريّان القديم — أكّده بنفسه: «اكتشفت أعمال كثيرة كنت
//  عاملها من زمان... بإفكتات حلوة كنت أجرّب فيها».
//
//  ⚠️ الصور صغيرة أصلاً (٣٩٥–٨٠١ بكسل عرض) لأنها لقطات شاشة
//     مش ملفات مصدر. ممنوع نكبّرها — التكبير بيزيد الحجم وما
//     بيرجّع ولا تفصيلة. لو ريّان لقى الملفات الأصلية، بدّلها
//     وشغّل هذا السكربت مرة ثانية.
//
//    node _check/labimport.mjs
// ═══════════════════════════════════════════════════════════════
import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = 'D:/Ryan-Personal/Misc/نماذج';
const OUT = join(ROOT, 'public/assets/work/lab');
const LAB = join(ROOT, 'src/data/lab.json');

// الترتيب مقصود: الأقوى بصرياً أولاً عشان أول صفّ يمسك العين
const ORDER = [
  ['Screenshot_2.png', 'تعريض مزدوج مرسوم بالفرشاة'],
  ['Screenshot_5.png', 'تركيب تحت الماء'],
  ['Screenshot_10.png', 'تفكّك بالدخان'],
  ['Screenshot_9.png', 'تفتيت وجزيئات'],
  ['Screenshot_7.png', 'بورتريه مبني من حروف'],
  ['Screenshot_1.png', 'تدرّج نيون'],
  ['Screenshot_8.png', 'بورتريه فيكتور'],
  ['Screenshot_6.png', 'تعريض مزدوج بالبلاستيك، أبيض وأسود'],
  ['Screenshot_4.png', 'دمج نسيج خشن'],
  ['Screenshot_3.png', 'تأثير الرسم بالألوان'],
];

if (!existsSync(SRC)) {
  console.log(`❌ ما لقيت المجلد: ${SRC}`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const shots = [];
for (let i = 0; i < ORDER.length; i++) {
  const [file, note] = ORDER[i];
  const src = join(SRC, file);
  if (!existsSync(src)) {
    console.log(`⚠️ ناقصة: ${file}`);
    continue;
  }
  const name = `manip-${String(shots.length + 1).padStart(2, '0')}.webp`;
  const dst = join(OUT, name);

  const md = await sharp(src).metadata();
  await sharp(src).webp({ quality: 88, effort: 6 }).toFile(dst);

  shots.push(`/assets/work/lab/${name}`);
  console.log(
    `${name}  ${String(md.width).padStart(4)}×${String(md.height).padEnd(4)} ` +
      `${String(Math.round(statSync(src).size / 1024)).padStart(4)}KB → ` +
      `${String(Math.round(statSync(dst).size / 1024)).padStart(3)}KB  ${note}`,
  );
}

const lab = JSON.parse(readFileSync(LAB, 'utf8'));

const group = {
  label: 'Photo manipulation',
  labelAr: 'معالجة الصور',
  phase: 'Before all this',
  phaseAr: 'قبل هذا كله',
  line: 'Ten techniques, each solved on its own: a neon grade, a portrait built out of type, dispersion, a painted double exposure. No client and no brief — these are the reps behind everything that came after.',
  lineAr: 'عشر تقنيات، كل وحدة محلولة لحالها: تدرّج نيون، وبورتريه مبني من حروف، وتفتيت، وتعريض مزدوج مرسوم. بلا عميل وبلا بريف — هاي التمارين اللي وراها كل اللي إجا بعدين.',
  shots,
};

// بينحط آخر مسار «التجارب»: الشغل الحالي أولاً، والتمارين بعده
lab.tracks.lab = lab.tracks.lab.filter((g) => g.labelAr !== group.labelAr);
lab.tracks.lab.push(group);

writeFileSync(LAB, JSON.stringify(lab, null, 2) + '\n', 'utf8');
console.log(`\n✅ مجموعة «${group.labelAr}» — ${shots.length} صور`);
console.log(`   مسار التجارب: ${lab.tracks.lab.map((g) => g.labelAr).join(' · ')}`);
