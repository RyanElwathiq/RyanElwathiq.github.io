// ═══════════════════════════════════════════════════════════════
//  توليد فيديو مقالة «عين البراند» — فوضى تصير نظام
//
//  ⚠️⚠️ ليش بنولّده بأنفسنا مش بأداة توليد؟ ⚠️⚠️
//  ريّان طلب «يكون ممتاز وما يبكسل ويكون بألوان البراند وما
//  يتولّد إشي غلط». أدوات التوليد بتعطي ألوان تقريبية وأشكال
//  ما بتتحكّم فيها. هون كل بكسل مرسوم من نظام الهوية نفسه:
//  ما في لون واحد برّا tokens.css، وما في ضغط إلا اللي منختاره.
//
//  الفكرة بتحكي المقال حرفياً:
//   • البداية: مربّعات مبعثرة، أحجام مختلفة، زوايا دوران عشوائية،
//     وألوان متفرّقة → «تصميم بلا نظام»
//   • النص: بتبدأ تنتظم بشبكة، الدوران بيروح، الأحجام بتتساوى
//   • النهاية: شبكة مضبوطة، كلها رمادية إلا قلّة ليمونية
//     → «لون هوية واحد + رماديات»
//
//  ⚠️ العشوائية مبذورة (seed ثابت) — يعني كل تشغيل بيطلع نفس
//     الفيديو بالضبط. بدونها ما بنقدر نعيد التوليد لو بدنا نعدّل.
//
//  التشغيل: node _check/makefilm.mjs
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'D:/Ryan-Portfolio/site/public/frames/brand-eye';
const FRAMES = 120;

// ⚠️ الألوان من tokens.css حرفياً — ولا لون مخترع
const C = {
  bg: '#0E0F12',
  surface: '#15171C',
  line: 'rgba(242,243,238,0.10)',
  muted: '#A0A49B',
  text: '#F2F3EE',
  accent: '#D9FF3F',
};

const SIZES = [
  { name: 'desktop', w: 1440, h: 810, cols: 9, rows: 5 },
  { name: 'mobile', w: 720, h: 1280, cols: 5, rows: 9 },
];

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const S of SIZES) {
  const dir = S.name === 'desktop' ? OUT : path.join(OUT, 'mobile');
  fs.mkdirSync(dir, { recursive: true });

  const page = await browser.newPage({ viewport: { width: S.w, height: S.h } });
  await page.setContent('<canvas id="c"></canvas><style>html,body{margin:0;background:#0E0F12}</style>');

  const frames = await page.evaluate(
    async ({ S, C, FRAMES }) => {
      const cv = document.getElementById('c');
      cv.width = S.w;
      cv.height = S.h;
      const x = cv.getContext('2d');

      // عشوائية مبذورة — نفس النتيجة كل مرة
      let seed = 20260730;
      const rnd = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };

      const N = S.cols * S.rows;
      const cellW = S.w / (S.cols + 1);
      const cellH = S.h / (S.rows + 1);
      const box = Math.min(cellW, cellH) * 0.56;

      // كل مربّع: مكانه بالفوضى ومكانه بالنظام
      const items = [];
      for (let r = 0; r < S.rows; r++) {
        for (let c = 0; c < S.cols; c++) {
          const gx = cellW * (c + 1);
          const gy = cellH * (r + 1);
          items.push({
            gx,
            gy,
            // الفوضى: إزاحة وحجم ودوران عشوائي
            cx: gx + (rnd() - 0.5) * cellW * 2.1,
            cy: gy + (rnd() - 0.5) * cellH * 2.1,
            rot: (rnd() - 0.5) * 1.5,
            scale: 0.45 + rnd() * 1.5,
            // نسبة صغيرة بتضل ليمونية بالنهاية — «لون واحد»
            lit: rnd() < 0.09,
            // لون الفوضى: متفرّق عن قصد
            hue: rnd(),
            delay: rnd() * 0.25,
          });
        }
      }

      const ease = (t) => (t < 0 ? 0 : t > 1 ? 1 : 1 - Math.pow(1 - t, 3));
      const out = [];

      for (let f = 0; f < FRAMES; f++) {
        const p = f / (FRAMES - 1);

        x.fillStyle = C.bg;
        x.fillRect(0, 0, S.w, S.h);

        // خطوط الشبكة بتظهر مع الترتيب — «النظام بيبيّن»
        const gridA = ease((p - 0.42) / 0.35) * 0.5;
        if (gridA > 0.01) {
          x.strokeStyle = `rgba(242,243,238,${0.07 * gridA})`;
          x.lineWidth = 1;
          for (let c = 1; c <= S.cols; c++) {
            x.beginPath();
            x.moveTo(cellW * c, 0);
            x.lineTo(cellW * c, S.h);
            x.stroke();
          }
          for (let r = 1; r <= S.rows; r++) {
            x.beginPath();
            x.moveTo(0, cellH * r);
            x.lineTo(S.w, cellH * r);
            x.stroke();
          }
        }

        for (const it of items) {
          // كل مربّع بيبدأ ينتظم بوقت مختلف شوي
          const t = ease((p - it.delay) / (1 - it.delay - 0.12));

          const cx = it.cx + (it.gx - it.cx) * t;
          const cy = it.cy + (it.gy - it.cy) * t;
          const rot = it.rot * (1 - t);
          const sc = it.scale + (1 - it.scale) * t;
          const w = box * sc;

          x.save();
          x.translate(cx, cy);
          x.rotate(rot);

          // الفوضى ملوّنة، والنظام رمادي + قلّة ليمونية
          let fill;
          if (t < 0.999) {
            const chaos = 1 - t;
            const h = Math.round(it.hue * 360);
            fill = `hsla(${h}, ${Math.round(55 * chaos)}%, ${Math.round(42 + 8 * chaos)}%, ${0.35 + 0.4 * (1 - chaos)})`;
          } else {
            fill = C.surface;
          }
          x.fillStyle = fill;

          // الزوايا بتتساوى مع الترتيب — «الاتساق»
          const rad = (2 + 10 * t) * (w / box);
          x.beginPath();
          x.roundRect(-w / 2, -w / 2, w, w, rad);
          x.fill();

          // الحدود بتنضبط بالآخر
          x.strokeStyle = it.lit
            ? `rgba(217,255,63,${0.25 + 0.75 * t})`
            : `rgba(242,243,238,${0.06 + 0.1 * t})`;
          x.lineWidth = it.lit ? 1.5 : 1;
          x.stroke();

          // المربّعات الليمونية بتضوّي بالنهاية
          if (it.lit && t > 0.55) {
            const g = ease((t - 0.55) / 0.45);
            x.fillStyle = `rgba(217,255,63,${0.1 + 0.72 * g})`;
            x.beginPath();
            x.roundRect(-w / 2, -w / 2, w, w, rad);
            x.fill();
          }

          x.restore();
        }

        out.push(cv.toDataURL('image/webp', 0.9).split(',')[1]);
      }
      return out;
    },
    { S, C, FRAMES }
  );

  frames.forEach((b64, i) => {
    fs.writeFileSync(
      path.join(dir, `frame_${String(i).padStart(4, '0')}.webp`),
      Buffer.from(b64, 'base64')
    );
  });

  const bytes = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.webp'))
    .reduce((n, f) => n + fs.statSync(path.join(dir, f)).size, 0);

  fs.writeFileSync(
    path.join(dir, 'manifest.json'),
    JSON.stringify(
      {
        source: 'generated (brand system)',
        source_fps: 24,
        frame_count: frames.length,
        format: 'webp',
        width: S.w,
        height: S.h,
        filename_pattern: 'frame_%04d.webp',
        total_bytes: bytes,
      },
      null,
      2
    )
  );

  console.log(
    `✓ ${S.name}: ${frames.length} فريم · ${S.w}×${S.h} · ${(bytes / 1048576).toFixed(2)}MB ` +
      `(${Math.round(bytes / frames.length / 1024)}KB للفريم)`
  );
  await page.close();
}

await browser.close();
