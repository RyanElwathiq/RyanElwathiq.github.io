// ═══════════════════════════════════════════════════════════════
//  إعادة توليد فريمات الهيرو — الحل الجذري للتبكسل
//
//  ⚠️⚠️ المشكلة الأصلية ⚠️⚠️
//  ريّان لاحظ إنه فيديو الهيرو مبكسل، عالموبايل وبعدين عالديسكتوب
//  كمان. النسخة القديمة كانت ١٠٨٠×١٩٢٠ بـ ٢٥ كيلوبايت للفريم —
//  يعني ضغط قاسي جداً، وبيعمل مربّعات بالمساحات الملساء.
//  وقتها ما كان في ffmpeg عالجهاز فغطّيناها بطبقة حبيبات.
//
//  ⚠️⚠️ ليش الحل هو **تصغير** المقاس مش تكبيره ⚠️⚠️
//  الكانفس عالموبايل بيرسم بعرض ~٤٩٠ بكسل فعلياً (٣٩٣ شاشة ×
//  ١.٢٥ كثافة). يعني ١٠٨٠ كان ضِعف اللي بينعرض — كنا ندفع
//  بايتات على بكسلات ما حدا بيشوفها، وناخد الفرق ضغطاً.
//  ٧٢٠×١٢٨٠ بجودة عالية بتبيّن **أنظف** من ١٠٨٠ بجودة واطية،
//  وبحجم أقل كمان.
//
//  التشغيل: node _check/reframe.mjs
//  ⚠️ بيكتب فوق public/frames/mobile و desktop
// ═══════════════════════════════════════════════════════════════
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const FF = 'D:/Tools/ffmpeg/bin/ffmpeg.exe';
const SRC = 'D:/Ryan-Portfolio/_source-media';
const OUT = 'D:/Ryan-Portfolio/site/public/frames';

// المقاس المستهدف والجودة لكل نسخة
const JOBS = [
  {
    name: 'mobile',
    src: 'hero-mobile.mp4',
    // ⚠️ أصغر من الأصل عن قصد — شوف الشرح فوق
    scale: '720:-2',
    quality: 78,
  },
  {
    name: 'desktop',
    src: 'hero-desktop.mp4',
    // الديسكتوب بيرسم بكثافة ٢ لكن الكانفس بعرض الشاشة، و١٤٤٠
    // بتغطّي أغلب الشاشات بدون هدر
    scale: '1440:-2',
    quality: 76,
  },
];

const size = (dir) =>
  fs
    .readdirSync(dir)
    .reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0);

for (const job of JOBS) {
  const dir = path.join(OUT, job.name);
  const before = fs.existsSync(dir) ? size(dir) : 0;
  const beforeCount = fs.existsSync(dir) ? fs.readdirSync(dir).length : 0;

  // مجلد مؤقّت — ما بنمسح القديم إلا بعد ما ننجح
  const tmp = dir + '__new';
  if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true });
  fs.mkdirSync(tmp, { recursive: true });

  console.log(`\n▶ ${job.name}: ${job.scale} · جودة ${job.quality}`);
  execFileSync(
    FF,
    [
      '-v', 'error',
      '-i', path.join(SRC, job.src),
      // lanczos = أنظف خوارزمية تصغير، بتحافظ على الحواف
      '-vf', `scale=${job.scale}:flags=lanczos`,
      '-c:v', 'libwebp',
      '-quality', String(job.quality),
      // ضغط بلا فقدان مطفي، وجهد الضغط على الأعلى
      '-compression_level', '6',
      '-preset', 'picture',
      '-an',
      path.join(tmp, 'frame_%04d.webp'),
    ],
    { stdio: 'inherit' }
  );

  // ⚠️ ffmpeg بيبدأ الترقيم من ١ والموقع بيتوقّع من ٠ —
  //    بدون إعادة التسمية أول فريم بيضيع وآخر واحد ما بينلاقى
  const files = fs.readdirSync(tmp).sort();
  files.forEach((f, i) => {
    fs.renameSync(
      path.join(tmp, f),
      path.join(tmp, `r_${String(i).padStart(4, '0')}.webp`)
    );
  });
  fs.readdirSync(tmp).forEach((f) => {
    fs.renameSync(path.join(tmp, f), path.join(tmp, f.replace(/^r_/, 'frame_')));
  });

  const after = size(tmp);
  const afterCount = fs.readdirSync(tmp).length;

  if (afterCount !== beforeCount) {
    console.log(`  ⚠️ عدد الفريمات تغيّر: ${beforeCount} → ${afterCount}`);
  }

  fs.rmSync(dir, { recursive: true, force: true });
  fs.renameSync(tmp, dir);

  console.log(
    `  ${beforeCount} فريم · ${(before / 1048576).toFixed(1)}MB → ` +
      `${afterCount} فريم · ${(after / 1048576).toFixed(1)}MB ` +
      `(${after > before ? '+' : ''}${Math.round((after / before - 1) * 100)}%)`
  );
}

// ⚠️ ملف الفهرس لازم يتحدّث بنفس الشكل القديم بالضبط —
//    سكربت الحركة بيقرأ منه frame_count و filename_pattern،
//    ولو كتبناه بشكل مختصر بيكسر السيكوينس.
for (const job of JOBS) {
  const dir = path.join(OUT, job.name);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp')).sort();
  const frames = files.map((f, i) => ({
    index: i,
    file: f,
    timestamp: Math.round((i / 24) * 10000) / 10000,
    bytes: fs.statSync(path.join(dir, f)).size,
  }));
  fs.writeFileSync(
    path.join(dir, 'manifest.json'),
    JSON.stringify(
      {
        source: job.src,
        source_fps: 24,
        frame_count: files.length,
        format: 'webp',
        quality: job.quality,
        scale: job.scale,
        filename_pattern: 'frame_%04d.webp',
        total_bytes: frames.reduce((n, f) => n + f.bytes, 0),
        frames,
      },
      null,
      2
    )
  );
}
console.log('\n✓ خلص');