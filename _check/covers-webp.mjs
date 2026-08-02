// ═══════════════════════════════════════════════════════════════
//  تحويل أغلفة المشاريع من PNG لـ WebP
//
//  ليش؟ مولّد الأغلفة (covers.mjs) بيطلّع PNG بجودة كاملة —
//  ٢١ ميجا لـ٢٤ غلاف. هذا كثير عالصفحة الرئيسية اللي بتعرضهم
//  كلهم. الـWebP بينزّلهم لحوالي ٢ ميجا بنفس الشكل تقريباً.
//
//  ⚠️ الـPNG ما بتنمسح — بتضل المصدر الأصلي لو بدنا نعيد التحويل
//     بجودة ثانية. اللي بينشر عالموقع هو الـWebP.
//
//  التشغيل:
//    node _check/covers-webp.mjs        ← كل الأغلفة
//    node _check/covers-webp.mjs 88     ← بجودة مخصّصة
// ═══════════════════════════════════════════════════════════════
import sharp from 'sharp';
import { readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIR = join(ROOT, 'public/assets/work/covers');

const QUALITY = Number(process.argv[2]) || 82;

const pngs = readdirSync(DIR)
  .filter((f) => f.endsWith('.png'))
  .sort();

if (!pngs.length) {
  console.log('ما في ولا PNG بـ public/assets/work/covers — شغّل covers.mjs الأول');
  process.exit(0);
}

let inSum = 0;
let outSum = 0;

for (const f of pngs) {
  const src = join(DIR, f);
  const dst = join(DIR, f.replace(/\.png$/, '.webp'));
  await sharp(src).webp({ quality: QUALITY, effort: 6 }).toFile(dst);

  const a = statSync(src).size;
  const b = statSync(dst).size;
  inSum += a;
  outSum += b;

  console.log(
    f.replace('.png', '').padEnd(16) +
      String(Math.round(a / 1024)).padStart(5) +
      'KB  →  ' +
      String(Math.round(b / 1024)).padStart(4) +
      'KB',
  );
}

console.log(
  `\n✅ ${pngs.length} غلاف (جودة ${QUALITY})   ` +
    `${(inSum / 1048576).toFixed(1)}MB  →  ${(outSum / 1048576).toFixed(1)}MB   ` +
    `(توفير ${Math.round((1 - outSum / inSum) * 100)}%)`,
);
