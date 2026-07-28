// ═══════════════════════════════════════════════════════════════
//  فهرسة أعمال ريّان
//
//  بياخد مجلد الأعمال (أسماء واتساب بلا معنى) وبيطلّع:
//   • رقم ثابت لكل ملف   (IMG-001 … / VID-001 …)
//   • صورة مصغّرة لكل إشي (حتى الفيديوهات — بناخد كادر من نصّه)
//   • ملف catalog.json فيه كل التفاصيل
//   • صفحة index.html بتعرضهم كلهم عشان ريّان يتفرّج ويقول
//     «هاي لمين» بدون ما يفتح ٢٠٠ ملف واحد واحد
//
//  ⚠️ ما بيعدّل ولا بيمسح ولا بينقل أي ملف أصلي. قراءة بس.
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SRC = "C:\\Users\\rayan\\OneDrive\\سطح المكتب\\My cv's\\Samples Of Best Work";
const OUT = 'D:\\Ryan-Portfolio\\_inbox';
const THUMBS = path.join(OUT, 'thumbs');

fs.mkdirSync(THUMBS, { recursive: true });

const list = (dir, exts) => {
  const p = path.join(SRC, dir);
  if (!fs.existsSync(p)) return [];
  return fs
    .readdirSync(p)
    .filter((f) => exts.includes(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => ({ file: f, full: path.join(p, f) }));
};

const images = list('Pic', ['.jpeg', '.jpg', '.png', '.webp']);
const videos = list('videos', ['.mp4', '.mov', '.webm']);
console.log(`صور: ${images.length} · فيديوهات: ${videos.length}`);

// ⚠️ المتصفح بيمنع صفحة على about:blank من قراءة ملفات file:// —
//    لهيك منفتح صفحة فاضية **من نفس النظام** ومنسمحله يقرأ الملفات.
//    بدون هالسطرين كل الصور والفيديوهات بترجع «ما قدر يقرأه».
const blank = path.join(OUT, '_blank.html');
fs.writeFileSync(blank, '<!doctype html><meta charset="utf-8"><title>catalog</title>');

const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await b.newPage({ viewport: { width: 900, height: 900 } });
await page.goto(pathToFileURL(blank).href);
const items = [];

// ─── الصور ───
for (let i = 0; i < images.length; i++) {
  const it = images[i];
  const id = `IMG-${String(i + 1).padStart(3, '0')}`;
  try {
    const data = await page.evaluate(async (url) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      const W = 460;
      const c = document.createElement('canvas');
      const scale = Math.min(1, W / img.naturalWidth);
      c.width = Math.round(img.naturalWidth * scale);
      c.height = Math.round(img.naturalHeight * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      return {
        w: img.naturalWidth,
        h: img.naturalHeight,
        thumb: c.toDataURL('image/jpeg', 0.72),
      };
    }, pathToFileURL(it.full).href);

    fs.writeFileSync(
      path.join(THUMBS, `${id}.jpg`),
      Buffer.from(data.thumb.split(',')[1], 'base64')
    );

    const ratio = data.w / data.h;
    items.push({
      id,
      type: 'image',
      original: it.file,
      w: data.w,
      h: data.h,
      ratio: +ratio.toFixed(2),
      shape: ratio > 1.25 ? 'عرضي' : ratio < 0.8 ? 'طولي' : 'مربّع',
      kb: Math.round(fs.statSync(it.full).size / 1024),
      belongsTo: '', // ← ريّان بيعبّيها
      use: '',
      note: '',
    });
  } catch (e) {
    console.log(`  ✗ ${id} ${it.file}: ${String(e).slice(0, 60)}`);
  }
  if ((i + 1) % 25 === 0) console.log(`  صور: ${i + 1}/${images.length}`);
}

// ─── الفيديوهات ───
for (let i = 0; i < videos.length; i++) {
  const it = videos[i];
  const id = `VID-${String(i + 1).padStart(3, '0')}`;
  try {
    const data = await page.evaluate(
      async (url) =>
        new Promise((resolve, reject) => {
          const v = document.createElement('video');
          v.muted = true;
          v.preload = 'metadata';
          v.src = url;
          const fail = setTimeout(() => reject(new Error('انتهى الوقت')), 25000);
          v.onerror = () => { clearTimeout(fail); reject(new Error('ما قدر يقرأه')); };
          v.onloadedmetadata = () => {
            // كادر من ربع الفيديو — عادةً أوضح من أول كادر (بيكون أسود)
            v.currentTime = Math.min(v.duration * 0.25, 3);
          };
          v.onseeked = () => {
            clearTimeout(fail);
            const W = 460;
            const c = document.createElement('canvas');
            const scale = Math.min(1, W / v.videoWidth);
            c.width = Math.round(v.videoWidth * scale);
            c.height = Math.round(v.videoHeight * scale);
            c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
            resolve({
              w: v.videoWidth,
              h: v.videoHeight,
              dur: v.duration,
              thumb: c.toDataURL('image/jpeg', 0.72),
            });
          };
        }),
      pathToFileURL(it.full).href
    );

    fs.writeFileSync(
      path.join(THUMBS, `${id}.jpg`),
      Buffer.from(data.thumb.split(',')[1], 'base64')
    );

    const ratio = data.w / data.h;
    items.push({
      id,
      type: 'video',
      original: it.file,
      w: data.w,
      h: data.h,
      ratio: +ratio.toFixed(2),
      shape: ratio > 1.25 ? 'عرضي' : ratio < 0.8 ? 'ريلز/طولي' : 'مربّع',
      seconds: +data.dur.toFixed(1),
      mb: +(fs.statSync(it.full).size / 1048576).toFixed(1),
      belongsTo: '',
      use: '',
      note: '',
    });
    console.log(`  ${id} ✓ ${data.w}×${data.h} ${data.dur.toFixed(1)}s`);
  } catch (e) {
    console.log(`  ✗ ${id} ${it.file}: ${String(e).slice(0, 60)}`);
    items.push({ id, type: 'video', original: it.file, error: String(e).slice(0, 80), belongsTo: '', use: '', note: '' });
  }
}

await b.close();

fs.writeFileSync(path.join(OUT, 'catalog.json'), JSON.stringify(items, null, 2), 'utf8');
console.log(`\n✓ ${items.length} عنصر بملف catalog.json`);
