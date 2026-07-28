import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = 'D:/Ryan-Portfolio/_inbox/incoming';
const blank = path.join(ROOT, '_b.html');
fs.writeFileSync(blank, '<!doctype html><meta charset="utf-8">');
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage();
await p.goto(pathToFileURL(blank).href);

for (const dir of ['orient-enam/from-markitng']) {
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) continue;
  console.log(`\n═══ ${dir} ═══`);
  for (const f of fs.readdirSync(d).sort()) {
    const full = path.join(d, f);
    const kb = Math.round(fs.statSync(full).size / 1024);
    const ext = path.extname(f).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) {
      console.log(`  ⚠️  ${f}  (${ext || 'بدون امتداد'}) — مش صورة`);
      continue;
    }
    try {
      const r = await p.evaluate(async (url) => {
        const img = new Image();
        img.src = url;
        await img.decode();
        // هل فيها شفافية؟
        const c = document.createElement('canvas');
        c.width = Math.min(img.naturalWidth, 200);
        c.height = Math.round((c.width / img.naturalWidth) * img.naturalHeight);
        const x = c.getContext('2d');
        x.drawImage(img, 0, 0, c.width, c.height);
        const px = x.getImageData(0, 0, c.width, c.height).data;
        let clear = 0;
        for (let i = 3; i < px.length; i += 4) if (px[i] < 250) clear++;
        return { w: img.naturalWidth, h: img.naturalHeight, alpha: clear / (px.length / 4) };
      }, pathToFileURL(full).href);
      const tp = r.alpha > 0.02 ? 'شفافة ✓' : 'خلفية مصمتة';
      console.log(`  ${String(r.w).padStart(5)}×${String(r.h).padEnd(5)} ${String(kb).padStart(5)}KB  ${tp.padEnd(14)} ${f}`);
    } catch (e) {
      console.log(`  ✗ ${f}: ${String(e).slice(0, 50)}`);
    }
  }
}
await b.close();
