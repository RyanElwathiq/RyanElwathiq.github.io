// ═══════════════════════════════════════════════════════════════
//  توزيع أصول LUV IT على الموقع
//
//  الفرق عن distribute.mjs: هون كل صورة إلها **دور** مش بس عميل،
//  لأن صفحة LUV IT مصمّمة خصيصاً — كل مجموعة إلها مكانها وشكلها.
//
//  ⚠️ ثلاث معالجات مهمّة بتصير هون:
//   ١) قص الحواف السودا (letterbox) — ريّان لاحظ إنه في صور عرضية
//      فيها مساحات سودا فوق وتحت، ولو انحطّت زي ما هي بتبيّن بايخة.
//      المنطق: بنفحص أول وآخر الصفوف، وأي صف كله غامق وموحّد بنقصّه.
//   ٢) قص الشفاف — صور المنتجات المفرّغة (PNG) فيها هوامش فاضية
//      كبيرة، فبنقصّها عشان المنتج يعبّي مساحته.
//   ٣) عكس اللوجو الأسود — LOGO-001 أسود على خلفية شفافة، وموقعنا
//      خلفيته سودا فبيختفي. بنقلب الغامق لأبيض ونحافظ على السماوي.
//
//  ⚠️ الأصول بالـ OneDrive قراءة بس — ولا ملف بينكتب هناك.
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const SRC = "C:/Users/rayan/OneDrive/سطح المكتب/TayfLap Project/Luvit Project sup";
const OUT = 'D:/Ryan-Portfolio/site/public/assets/work/luvit';
const DATA = 'D:/Ryan-Portfolio/site/src/data/luvit.json';
const cat = JSON.parse(fs.readFileSync('D:/Ryan-Portfolio/_inbox/luvit/catalog.json', 'utf8'));
const meta = Object.fromEntries(cat.map((x) => [x.id, x]));

// مجلد المصدر لكل بادئة معرّف (نفس اللي بفهرسة luvit.mjs)
const DIR = {
  ROOT: '.',
  PROD: 'Product',
  COVER: 'profile cover',
  HIGH: 'luv it highlights projects',
  POST: 'Posts',
  POSTL: 'Posts luvit',
  PNG: 'pictures pngs',
  LOGO: 'logo',
};

// ─── مساعد: يولّد مدى معرّفات (مثلاً r('COVER',7,28)) ───
const r = (p, a, b) => {
  const out = [];
  for (let i = a; i <= b; i++) out.push(`${p}-${String(i).padStart(3, '0')}`);
  return out;
};

// ═══ الأدوار: كل دور إله مكان مختلف بالصفحة ═══
const ROLES = {
  // جلسة التصوير — ما استُخدمت بالأردن، وهي المادة الخام للسوق العالمي
  shoot: r('COVER', 7, 28),
  // منتجات مفرّغة على خلفية شفافة — بتنعرض فوق لون الهوية
  // ⚠️ PNG-009 مشيّل: هو نسخة ثانية من Oil Control وخلفيته بيضا مش
  //    شفافة، فكان بيبيّن مربّع أبيض بآخر الرفّ ويكسر الصف كله
  png: r('PNG', 1, 8),
  // الثلاثية: ثلاث بوستات مقصوصة من صورة وحدة — نفس النسبة بالضبط
  // ⚠️ ما بنحط معهم بوستات بنسب ثانية: الشبكة لازم تبيّن صورة وحدة
  //    متواصلة، وأي مقاس مختلف بيكسر الصف ويترك فراغ
  triptych: ['POST-012', 'POST-013', 'POST-014'],
  // الثلاثية الأولى قبل التقصيص
  triptychFirst: ['POST-009', 'POST-010'],
  // لوحات عريضة: كيف بتبيّن التصاميم لما تنصف جنب بعض
  boards: ['HIGH-001', 'HIGH-004', 'HIGH-016', 'HIGH-017', 'POST-011', 'POSTL-003'],
  // ستوريز فيسبوك وإنستغرام (طولية ٩:١٦)
  stories: ['HIGH-005', 'HIGH-006', 'HIGH-008', 'HIGH-009', 'HIGH-010', 'HIGH-018', 'HIGH-019', 'HIGH-020', 'HIGH-021'],
  // بوستات
  posts: [
    ...r('HIGH', 11, 15),
    'POST-001', 'POST-003', 'POST-004', 'POST-005', 'POST-006', 'POST-007',
    // معتمدة كمان بس بمقاسات مختلفة عن الثلاثية، فمكانها هون
    'POST-015', 'POSTL-001', 'POSTL-002', 'POSTL-004',
  ],
  highlights: ['HIGH-003', 'HIGH-007'],
  influencers: r('HIGH', 23, 26),
  soft: ['POST-008'],
  // صور منتجات فوتوغرافية
  products: ['ROOT-001', 'ROOT-002', 'ROOT-018', 'ROOT-019', 'ROOT-020'],
  // غلاف الفيسبوك: النتيجة المعتمدة
  coverFinal: ['ROOT-011', 'ROOT-017'],
  // ومحاولات الوصول إلها
  coverLab: [...r('ROOT', 5, 10), 'ROOT-014', 'ROOT-015', 'ROOT-016', 'COVER-030'],
  // تصاميم منتجات مينيمال
  minimal: ['PROD-019', ...r('COVER', 1, 5)],
  // تجارب قبل ما تستقرّ الهوية
  preIdentity: r('PROD', 1, 18),
  logo: ['LOGO-001', 'LOGO-002', 'LOGO-003'],
};

// أكبر عرض لكل دور — الستوري ما بتحتاج ١٦٠٠ بكسل، واللوحات العريضة بتحتاج
const MAXW = {
  shoot: 1500, png: 1100, triptych: 1080, triptychFirst: 1080, boards: 2000,
  stories: 760, posts: 1080, highlights: 760, influencers: 900, soft: 1080,
  products: 1200, coverFinal: 1800, coverLab: 1400, minimal: 1000,
  preIdentity: 900, logo: 900,
};
const QUALITY = 0.85;

// عكس الأسود لأبيض — للوجو الشفاف بس
const INVERT = new Set(['LOGO-001']);
// قص الشفاف — للمنتجات المفرّغة
const TRIM_ALPHA = new Set(ROLES.png);

fs.mkdirSync(OUT, { recursive: true });
const blank = path.join(OUT, '_b.html');
fs.writeFileSync(blank, '<!doctype html><meta charset="utf-8">');
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.goto(pathToFileURL(blank).href);

const manifest = {};
let done = 0, bytesIn = 0, bytesOut = 0, cropped = 0;
const total = Object.values(ROLES).flat().length;

for (const [role, ids] of Object.entries(ROLES)) {
  let n = 0;
  for (const id of ids) {
    const m = meta[id];
    if (!m) { console.log(`  ✗ ما لقيت ${id} بالفهرس`); continue; }
    const base = DIR[id.split('-')[0]];
    const src = base === '.' ? path.join(SRC, m.original) : path.join(SRC, base, m.original);
    if (!fs.existsSync(src)) { console.log(`  ✗ ما لقيت ملف ${id}: ${m.original}`); continue; }

    const name = `${role}-${String(++n).padStart(2, '0')}.webp`;
    try {
      const out = await page.evaluate(
        async ([url, maxW, q, doInvert, doTrimAlpha]) => {
          const img = new Image();
          img.src = url;
          await img.decode();

          // ⚠️ لوحة الرسم عند كروم إلها سقف (~٢٦٨ مليون بكسل). في صور
          //    بالجلسة ٢٩٧ مليون بكسل — أول نسخة رسمتها بحجمها الأصلي
          //    فطلعت اللوحة فاضية، وفحص «الحواف السودا» قرأ الفراغ حواف
          //    وقصّ الصورة كلها. الحل: نفحص على نسخة مصغّرة، وبعدين
          //    نقصّ من الصورة الأصلية بإحداثيات محسوبة.
          const ANALYZE = 1400;
          const a = Math.min(1, ANALYZE / Math.max(img.naturalWidth, img.naturalHeight));
          const src = document.createElement('canvas');
          src.width = Math.max(1, Math.round(img.naturalWidth * a));
          src.height = Math.max(1, Math.round(img.naturalHeight * a));
          const sx = src.getContext('2d', { willReadFrequently: true });
          sx.drawImage(img, 0, 0, src.width, src.height);

          const W = src.width, H = src.height;
          let x0 = 0, y0 = 0, x1 = W, y1 = H;

          if (doTrimAlpha) {
            // ── قص الهوامش الشفافة تماماً ──
            const d = sx.getImageData(0, 0, W, H).data;
            const step = Math.max(1, Math.round(Math.min(W, H) / 400));
            let minX = W, minY = H, maxX = -1, maxY = -1;
            for (let y = 0; y < H; y += step) {
              for (let x = 0; x < W; x += step) {
                if (d[(y * W + x) * 4 + 3] > 12) {
                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  if (y < minY) minY = y;
                  if (y > maxY) maxY = y;
                }
              }
            }
            if (maxX > minX) {
              const pad = Math.round(Math.min(W, H) * 0.02);
              x0 = Math.max(0, minX - pad); y0 = Math.max(0, minY - pad);
              x1 = Math.min(W, maxX + pad); y1 = Math.min(H, maxY + pad);
            }
          } else {
            // ── قص الحواف السودا (letterbox) ──
            // صف بيتعدّ «حافة» إذا كل عيّناته غامقة (أو شفافة)
            const rowIsBar = (y) => {
              const d = sx.getImageData(0, y, W, 1).data;
              const step = Math.max(1, Math.round(W / 60)) * 4;
              for (let i = 0; i < d.length; i += step) {
                if (d[i + 3] < 8) continue; // شفاف = مش محتوى
                if (d[i] > 26 || d[i + 1] > 26 || d[i + 2] > 26) return false;
              }
              return true;
            };
            const colIsBar = (x) => {
              const d = sx.getImageData(x, 0, 1, H).data;
              const step = Math.max(1, Math.round(H / 60)) * 4;
              for (let i = 0; i < d.length; i += step) {
                if (d[i + 3] < 8) continue;
                if (d[i] > 26 || d[i + 1] > 26 || d[i + 2] > 26) return false;
              }
              return true;
            };
            // ما بنقصّ أكثر من ٣٥٪ من أي بُعد — حماية من صورة غامقة أصلاً
            const capY = Math.floor(H * 0.35), capX = Math.floor(W * 0.35);
            while (y0 < capY && rowIsBar(y0)) y0++;
            while (y1 > H - capY && rowIsBar(y1 - 1)) y1--;
            while (x0 < capX && colIsBar(x0)) x0++;
            while (x1 > W - capX && colIsBar(x1 - 1)) x1--;
          }

          // حارس لفحص الحواف السودا بس: لو القص أكل أكثر من ٧٠٪ فأكيد
          // الفحص غلط (صورة غامقة أصلاً) — نتراجع بدل ما نطلّع صورة فاضية.
          // ⚠️ ما بينطبق على قص الشفاف: هناك القص الكبير طبيعي — منتج
          //    مفرّغ بوسط ٥٠٠٠×٥٠٠٠ ممكن يكون ربع المساحة، وأول نسخة
          //    كان الحارس بيلغي القص فبتضل الهوامش الفاضية.
          if (!doTrimAlpha && (x1 - x0) * (y1 - y0) < W * H * 0.3) {
            x0 = 0; y0 = 0; x1 = W; y1 = H;
          }

          // نرجّع الإحداثيات لمقياس الصورة الأصلية عشان القص يطلع بدقّتها
          const CW = img.naturalWidth, CH = img.naturalHeight;
          const sx0 = Math.round((x0 / W) * CW), sy0 = Math.round((y0 / H) * CH);
          const cw = Math.round(((x1 - x0) / W) * CW), ch = Math.round(((y1 - y0) / H) * CH);

          const scale = Math.min(1, maxW / cw);
          const c = document.createElement('canvas');
          c.width = Math.round(cw * scale);
          c.height = Math.round(ch * scale);
          const cx = c.getContext('2d', { willReadFrequently: true });
          cx.drawImage(img, sx0, sy0, cw, ch, 0, 0, c.width, c.height);

          if (doInvert) {
            // الأسود → أبيض، والألوان تضل مكانها (اللوجو السماوي ما بينمسّ)
            const im = cx.getImageData(0, 0, c.width, c.height);
            const d = im.data;
            for (let i = 0; i < d.length; i += 4) {
              if (d[i + 3] < 8) continue;
              const max = Math.max(d[i], d[i + 1], d[i + 2]);
              const min = Math.min(d[i], d[i + 1], d[i + 2]);
              // رمادي/أسود = فرق بسيط بين القنوات وقيمة منخفضة
              if (max - min < 30 && max < 110) {
                const v = 255 - max;
                d[i] = d[i + 1] = d[i + 2] = v;
              }
            }
            cx.putImageData(im, 0, 0);
          }

          return {
            w: c.width, h: c.height,
            trimmed: x0 > 0 || y0 > 0 || x1 < W || y1 < H,
            // بالمقياس الأصلي عشان الرقم يكون مفهوم
            barPx: Math.round(((y0 + (H - y1)) / H) * CH),
            data: c.toDataURL('image/webp', q),
          };
        },
        [pathToFileURL(src).href, MAXW[role], QUALITY, INVERT.has(id), TRIM_ALPHA.has(id)]
      );

      const buf = Buffer.from(out.data.split(',')[1], 'base64');
      fs.writeFileSync(path.join(OUT, name), buf);
      bytesIn += fs.statSync(src).size;
      bytesOut += buf.length;
      if (out.trimmed) cropped++;
      if (out.barPx > 4) console.log(`  ✂ ${id} → قصّينا ${out.barPx}px حواف سودا`);

      (manifest[role] ||= []).push({
        file: `/assets/work/luvit/${name}`,
        id,
        w: out.w,
        h: out.h,
        kb: Math.round(buf.length / 1024),
      });
      if (++done % 20 === 0) console.log(`  ${done}/${total}…`);
    } catch (e) {
      console.log(`  ✗ ${id}: ${String(e).slice(0, 70)}`);
    }
  }
}

fs.writeFileSync(DATA, JSON.stringify(manifest, null, 2), 'utf8');
fs.unlinkSync(blank);
await browser.close();

console.log('\n═══ أصول LUV IT ═══');
Object.entries(manifest).forEach(([k, v]) =>
  console.log(`  ${k.padEnd(15)} ${String(v.length).padStart(3)} صورة`)
);
console.log(`\n  انقصّت حوافها: ${cropped}`);
console.log(
  `  الحجم: ${(bytesIn / 1048576).toFixed(1)}MB → ${(bytesOut / 1048576).toFixed(1)}MB ` +
    `(وفّرنا ${Math.round((1 - bytesOut / bytesIn) * 100)}%)`
);
