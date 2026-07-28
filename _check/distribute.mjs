// ═══════════════════════════════════════════════════════════════
//  توزيع التصاميم على مجلدات المشاريع
//
//  بياخد كل صوره صالحة من الأرشيف، بيحوّلها WebP بحجم مناسب للويب،
//  وبيحطّها بمجلد مشروعها باسم مفهوم.
//
//  ⚠️ الأصول بالـ OneDrive ما بتتلمس — قراءة بس.
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ARCHIVE = "C:/Users/rayan/OneDrive/سطح المكتب/My cv's/Samples Of Best Work/Pic";
const OUT = 'D:/Ryan-Portfolio/site/public/assets/work';
const MAX_W = 1400; // أكبر عرض للصورة على الموقع
const QUALITY = 0.84;

// اسم المجلد لكل عميل (بالإنجليزي عشان الروابط تضل نظيفة)
const SLUG = {
  'Orient Enam': 'orient-enam',
  'د. سمير القراعين': 'dr-samir',
  'فكرة ونقطة': 'fikra-nuqta',
  'أنفاسك عود': 'anfasak-oud',
  'The Corner': 'the-corner',
  'أركان العنان': 'arkan-al-anan',
  'Knockout Media': 'knockout',
  Stylomation: 'stylomation',
  'The Place': 'the-place',
  'Dream Crests': 'dream-crests',
  Progress: 'progress',
  'صور تخرّج (محامية)': 'graduation',
  'عيادات (ADjust / El-Kay)': 'clinics',
  'سبا (MLR / Halem)': 'spa',
  Tampa: 'tampa',
  'Nada Fayyad': 'nada-fayyad',
  'مكتبة الرازي': 'al-razi',
  'مختبر شخصي': 'lab',
  'غير مصنّف': 'misc',
};

const items = JSON.parse(fs.readFileSync('D:/Ryan-Portfolio/_inbox/labelled.json', 'utf8'));
const cat = JSON.parse(fs.readFileSync('D:/Ryan-Portfolio/_inbox/catalog.json', 'utf8'));
const meta = Object.fromEntries(cat.map((x) => [x.id, x]));

const imgs = items.filter((x) => x.id.startsWith('IMG') && x.group !== 'DROP');
console.log(`صور للتوزيع: ${imgs.length}\n`);

const blank = path.join(OUT, '..', '_b.html');
fs.mkdirSync(path.dirname(blank), { recursive: true });
fs.writeFileSync(blank, '<!doctype html><meta charset="utf-8">');

const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage();
await p.goto(pathToFileURL(blank).href);

const manifest = {};
const counters = {};
let done = 0;
let bytesIn = 0;
let bytesOut = 0;

for (const it of imgs) {
  const m = meta[it.id];
  if (!m) continue;
  const slug = SLUG[it.client] || 'misc';
  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });

  counters[slug] = (counters[slug] || 0) + 1;
  const name = `${slug}-${String(counters[slug]).padStart(2, '0')}.webp`;
  const src = path.join(ARCHIVE, m.original);
  if (!fs.existsSync(src)) { console.log(`  ✗ ما لقيت ${m.original}`); continue; }

  try {
    const r = await p.evaluate(
      async ([url, maxW, q]) => {
        const img = new Image();
        img.src = url;
        await img.decode();
        const scale = Math.min(1, maxW / img.naturalWidth);
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * scale);
        c.height = Math.round(img.naturalHeight * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        return { w: c.width, h: c.height, data: c.toDataURL('image/webp', q) };
      },
      [pathToFileURL(src).href, MAX_W, QUALITY]
    );

    const buf = Buffer.from(r.data.split(',')[1], 'base64');
    fs.writeFileSync(path.join(dir, name), buf);
    bytesIn += fs.statSync(src).size;
    bytesOut += buf.length;

    (manifest[slug] ||= []).push({
      file: `/assets/work/${slug}/${name}`,
      id: it.id,
      w: r.w,
      h: r.h,
      kb: Math.round(buf.length / 1024),
      note: it.note,
    });
    done++;
    if (done % 30 === 0) console.log(`  ${done}/${imgs.length}…`);
  } catch (e) {
    console.log(`  ✗ ${it.id}: ${String(e).slice(0, 60)}`);
  }
}

fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
fs.unlinkSync(blank);
await b.close();

console.log(`\n═══ النتيجة ═══`);
Object.entries(manifest)
  .sort((a, b) => b[1].length - a[1].length)
  .forEach(([k, v]) => console.log(`  ${k.padEnd(16)} ${String(v.length).padStart(3)} صورة`));
console.log(
  `\nالحجم: ${(bytesIn / 1048576).toFixed(1)}MB → ${(bytesOut / 1048576).toFixed(1)}MB ` +
    `(وفّرنا ${Math.round((1 - bytesOut / bytesIn) * 100)}%)`
);
