// ═══════════════════════════════════════════════════════════════
//  فهرسة مشروع LUV IT
//  نفس نظام الأعمال: رقم ثابت + مصغّرة + صفحة مراجعة
//  ⚠️ قراءة بس — الأصول بالـ OneDrive ما بتتلمس
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SRC = "C:/Users/rayan/OneDrive/سطح المكتب/TayfLap Project/Luvit Project sup";
const OUT = 'D:/Ryan-Portfolio/_inbox/luvit';
const THUMBS = path.join(OUT, 'thumbs');
fs.mkdirSync(THUMBS, { recursive: true });

const EXT = ['.jpg', '.jpeg', '.png', '.webp'];
// المجلد → بادئة المعرّف (عشان نعرف من الرقم شو نوعه)
const GROUPS = {
  '.': 'ROOT',
  Product: 'PROD',
  'profile cover': 'COVER',
  'luv it highlights projects': 'HIGH',
  Posts: 'POST',
  'Posts luvit': 'POSTL',
  'pictures pngs': 'PNG',
  logo: 'LOGO',
};

const files = [];
for (const [dir, prefix] of Object.entries(GROUPS)) {
  const full = dir === '.' ? SRC : path.join(SRC, dir);
  if (!fs.existsSync(full)) continue;
  // ⚠️ بحث بالعمق: في مجلدات فرعية جوّا المجلدات (مثلاً profile cover)
  //    وأول نسخة كانت بتفوّتها فضاع نص الصور.
  const walk = (d, depth = 0) => {
    if (depth > 3) return [];
    let out = [];
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const fp = path.join(d, e.name);
      if (e.isDirectory()) {
        if (dir === '.' ) continue; // الجذر بيتعامل مع ملفاته بس (المجلدات إلها مدخلاتها)
        out = out.concat(walk(fp, depth + 1));
      } else if (EXT.includes(path.extname(e.name).toLowerCase())) out.push(fp);
    }
    return out;
  };
  const list = walk(full).sort();
  list.forEach((fp, i) =>
    files.push({
      id: `${prefix}-${String(i + 1).padStart(3, '0')}`,
      group: dir,
      full: fp,
      name: path.relative(full, fp).split(path.sep).join('/'),
    })
  );
}
console.log(`لقينا ${files.length} صورة\n`);

const blank = path.join(OUT, '_b.html');
fs.writeFileSync(blank, '<!doctype html><meta charset="utf-8">');
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 900, height: 900 } });
await p.goto(pathToFileURL(blank).href);

const items = [];
let done = 0;
for (const f of files) {
  try {
    const r = await p.evaluate(async (url) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      const W = 460;
      const c = document.createElement('canvas');
      const s = Math.min(1, W / img.naturalWidth);
      c.width = Math.round(img.naturalWidth * s);
      c.height = Math.round(img.naturalHeight * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      return { w: img.naturalWidth, h: img.naturalHeight, thumb: c.toDataURL('image/jpeg', 0.72) };
    }, pathToFileURL(f.full).href);

    fs.writeFileSync(path.join(THUMBS, `${f.id}.jpg`), Buffer.from(r.thumb.split(',')[1], 'base64'));
    const ratio = r.w / r.h;
    items.push({
      id: f.id,
      group: f.group,
      original: f.name,
      w: r.w,
      h: r.h,
      shape: ratio > 1.25 ? 'عرضي' : ratio < 0.8 ? 'طولي' : 'مربّع',
      kb: Math.round(fs.statSync(f.full).size / 1024),
      belongsTo: '',
    });
    if (++done % 25 === 0) console.log(`  ${done}/${files.length}…`);
  } catch (e) {
    console.log(`  ✗ ${f.id} ${f.name}: ${String(e).slice(0, 50)}`);
  }
}

fs.writeFileSync(path.join(OUT, 'catalog.json'), JSON.stringify(items, null, 2), 'utf8');
fs.unlinkSync(blank);
await b.close();

const by = items.reduce((m, x) => ((m[x.group] = (m[x.group] || 0) + 1), m), {});
console.log(`\n✓ ${items.length} عنصر\n`);
Object.entries(by).forEach(([g, n]) => console.log(`  ${g.padEnd(28)} ${n}`));
