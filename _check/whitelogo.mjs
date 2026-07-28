// نسخة بيضا من لوجو أورينت — النص الأسود بيصير أبيض، البرتقالي بيضل زي ما هو
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SRC = 'D:/Ryan-Portfolio/_inbox/incoming/orient-enam/from-markitng';
const OUT = 'D:/Ryan-Portfolio/site/public/assets/clients';
fs.mkdirSync(OUT, { recursive: true });

const blank = path.join(SRC, '_b.html');
fs.writeFileSync(blank, '<!doctype html><meta charset="utf-8">');
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage();
await p.goto(pathToFileURL(blank).href);

const jobs = [
  { from: '1.png', to: 'orient-h', label: 'أفقي' },
  { from: '2.png', to: 'orient-stack', label: 'عمودي' },
];

for (const j of jobs) {
  const full = path.join(SRC, j.from);
  if (!fs.existsSync(full)) { console.log('✗ ما لقيت', j.from); continue; }

  const res = await p.evaluate(async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height);
    const px = d.data;
    let changed = 0;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i + 3] < 8) continue; // شفاف — ما بنلمسه
      const r = px[i], g = px[i + 1], bl = px[i + 2];
      // البرتقالي = الأحمر أعلى بكثير من الأزرق. منخلّيه زي ما هو.
      const isOrange = r > 150 && r - bl > 40;
      if (isOrange) continue;
      // أي إشي غامق (النص) بيصير أبيض
      const lum = 0.299 * r + 0.587 * g + 0.114 * bl;
      if (lum < 140) {
        px[i] = 242; px[i + 1] = 243; px[i + 2] = 238; // أبيض الهوية
        changed++;
      }
    }
    x.putImageData(d, 0, 0);
    return { w: c.width, h: c.height, changed, png: c.toDataURL('image/png') };
  }, pathToFileURL(full).href);

  fs.writeFileSync(path.join(OUT, `${j.to}-white.png`), Buffer.from(res.png.split(',')[1], 'base64'));
  fs.copyFileSync(full, path.join(OUT, `${j.to}.png`));
  const kb = (n) => Math.round(fs.statSync(path.join(OUT, n)).size / 1024);
  console.log(`${j.label.padEnd(7)} ${res.w}×${res.h}  بكسل تحوّل=${res.changed}  →  ${j.to}-white.png (${kb(j.to + '-white.png')}KB) + ${j.to}.png (${kb(j.to + '.png')}KB)`);
}

// اللوجو القديم للمقارنة
const old = 'D:/Ryan-Portfolio/_inbox/incoming/orient-enam/old Orient enam logo .png';
if (fs.existsSync(old)) {
  fs.copyFileSync(old, path.join(OUT, 'orient-old.png'));
  console.log('القديم   انتسخ → orient-old.png');
}

fs.unlinkSync(blank);
await b.close();
