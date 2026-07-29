// فحص: أي صورة من صور LUV IT فيها فعلاً حواف داكنة فوق/تحت؟
// (ريّان لاحظ حواف سودا بصفحة المراجعة — بدنا نتأكد إذا هي بالملفات
//  نفسها ولا بس بصندوق العرض بصفحة المراجعة)
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

const man = JSON.parse(fs.readFileSync('D:/Ryan-Portfolio/site/src/data/luvit.json', 'utf8'));
const files = Object.entries(man).flatMap(([role, a]) =>
  a.map((x) => ({ role, id: x.id, path: 'D:/Ryan-Portfolio/site/public' + x.file }))
);

const blank = 'D:/Ryan-Portfolio/site/_check/out/_b.html';
fs.writeFileSync(blank, '<!doctype html><meta charset="utf-8">');
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage();
await p.goto(pathToFileURL(blank).href);

const hits = [];
for (const f of files) {
  const r = await p.evaluate(async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(img, 0, 0);
    // صف داكن = متوسط سطوعه أقل من ٤٠ (من ٢٥٥) وكل عيّناته متقاربة
    const dark = (y) => {
      const d = x.getImageData(0, y, c.width, 1).data;
      const step = Math.max(1, Math.round(c.width / 40)) * 4;
      let sum = 0, n = 0;
      for (let i = 0; i < d.length; i += step) {
        if (d[i + 3] < 8) return false;
        sum += (d[i] + d[i + 1] + d[i + 2]) / 3;
        n++;
      }
      return sum / n < 40;
    };
    let top = 0, bot = 0;
    while (top < c.height * 0.4 && dark(top)) top++;
    while (bot < c.height * 0.4 && dark(c.height - 1 - bot)) bot++;
    return { top, bot, h: c.height };
  }, pathToFileURL(f.path).href);
  if (r.top + r.bot > 2) hits.push({ ...f, ...r });
}
await b.close();

if (!hits.length) console.log('✓ ولا صورة فيها حواف داكنة — الحواف اللي بصفحة المراجعة كانت من صندوق العرض');
else hits.forEach((h) => console.log(`${h.role.padEnd(14)} ${h.id}  فوق ${h.top}px  تحت ${h.bot}px  (من ${h.h})`));
