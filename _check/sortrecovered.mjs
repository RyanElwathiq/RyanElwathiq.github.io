// ═══════════════════════════════════════════════════════════════
//  توزيع الصور المسترجَعة على مجلداتها
//
//  التوزيع مأخوذ **من كلام ريّان نفسه** بنفس الرسالة اللي بعت
//  فيها الصور — مش تخمين. رقم السطر بين قوسين هو موقع الرسالة
//  بملف المحادثة، عشان يتأكد أي حدا لاحقاً.
//
//    node _check/sortrecovered.mjs [--dry]
// ═══════════════════════════════════════════════════════════════
import { readdirSync, existsSync, mkdirSync, copyFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'D:/Ryan-Work/_SITE-INBOX/05-unsorted/من-المحادثة-القديمة';
const INBOX = 'D:/Ryan-Work/_SITE-INBOX';
const DRY = process.argv.includes('--dry');

// [مجلد الرسالة, أي صور, الوجهة, سبب التوزيع بكلام ريّان]
const MAP = [
  [
    'رسالة-16882',
    'all',
    '01-NEEDED/al-mofakron',
    '«هذول كمان مجموعه تصاميم لل al-mofkron للألمنيوم... اخر صوره هيه اللوجو تبعه»',
  ],
  [
    'رسالة-16781',
    [1, 2, 3],
    '01-NEEDED/al-mofakron',
    '«والصور اللي بعتتلك اياهم هسا هذول من تصاميم عملتهم للmofcron»',
  ],
  [
    'رسالة-16781',
    [4],
    '04-lab-misc',
    '«والصورة الرابعه لقيت تصميم من التصاميم الحلوة لمكامن... حطها بالـlab أو المكان الثاني»',
  ],
  [
    'رسالة-16781',
    [5, 6, 7],
    '03-lab-photo-manipulation',
    '«الصورة 5-6-7 من اهم الصور اللي لازم تكون موجوده بالتجارب، هيه صور photo manipulations بدون اي براند»',
  ],
  [
    'رسالة-16926',
    'all',
    '01-NEEDED/knockout media/من-المحادثة',
    '«هذول تصاميم تجريبيه لثلاثيات ل knockout media... والصور اللي خلفيتها صفره كانت مجموعه هايلايت»',
  ],
  ['رسالة-09898', 'all', '02-optional/orient', '«هاي لوجوهات Orient الجديده اللي حكيتلك عنها»'],
  [
    'رسالة-10039',
    'all',
    '02-optional/orient',
    '«هذا اللوجو الجديد لorient... حاول اعكس الوان اللوجو الاسود خليه ابيض»',
  ],
];

let moved = 0;
const log = [];

for (const [msgDir, which, dest, why] of MAP) {
  const from = join(SRC, msgDir);
  if (!existsSync(from)) {
    console.log(`⚠️ ما لقيت ${msgDir}`);
    continue;
  }

  const files = readdirSync(from)
    .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
    .sort();

  const picked = which === 'all' ? files : files.filter((f) => which.includes(+f.slice(0, 2)));
  if (!picked.length) continue;

  const to = join(INBOX, dest);
  if (!DRY) mkdirSync(to, { recursive: true });

  for (const f of picked) {
    // اسم واضح: من وين إجت وأي رقم — عشان ما ينداس على ملف موجود
    const name = `chat-${msgDir.replace('رسالة-', '')}-${f}`;
    if (!DRY) copyFileSync(join(from, f), join(to, name));
    moved++;
  }

  log.push({ msgDir, dest, count: picked.length, why });
  console.log(`${String(picked.length).padStart(3)} صورة  →  ${dest}`);
  console.log(`      السبب: ${why}`);
}

if (!DRY) {
  writeFileSync(join(SRC, '_التوزيع.json'), JSON.stringify(log, null, 2), 'utf8');
}
console.log(`\n${DRY ? '(معاينة) ' : '✅ '}${moved} صورة`);
