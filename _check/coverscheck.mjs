// ═══════════════════════════════════════════════════════════════
//  فحص بصري للأغلفة بكل مكان بيظهروا فيه
//
//  بيلف على الأقسام بالاسم (مش برقم سكرول) — لأن الرئيسية فيها
//  مشهد سكرول طويل بالبداية، فالأرقام الثابتة بتوقع بمكان غلط.
//
//  ⚠️ بيفحص الديسكتوب والموبايل، لأن شريط الأعمال بيبدّل شكل
//     صندوق الغلاف عند 767px — ولو الصورة ما بدّلت معه، اسم
//     العميل اللي أسفل الغلاف بينقص.
//
//    node _check/coverscheck.mjs
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.argv[2] || 'http://localhost:4321';
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();

for (const [label, w, h] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });

  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));

  await page.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  console.log(`\n═══ ${label} (${w}×${h}) ═══`);

  for (const id of ['growth', 'work', 'designs', 'websites']) {
    const y = await page.evaluate((sel) => {
      const el = document.getElementById(sel);
      if (!el) return null;
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.__lenis?.scrollTo(top, { immediate: true }) ?? window.scrollTo(0, top);
      return top;
    }, id);

    if (y === null) {
      console.log(`⚠️ ما لقيت قسم #${id}`);
      continue;
    }
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `_check/out/cov-${label}-${id}.png` });
    console.log(`✅ #${id}`);
  }

  // الصورة اللي المتصفح اختارها فعلاً (currentSrc) — هي اللي بتهم
  const imgs = await page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter((i) => (i.currentSrc || i.src).includes('/covers/'))
      .map((i) => {
        const file = (i.currentSrc || i.src).split('/covers/')[1];
        const box = i.clientWidth / i.clientHeight;
        const img = i.naturalWidth / i.naturalHeight;
        return {
          file,
          ok: i.naturalWidth > 0,
          box: Math.round(i.clientWidth) + '×' + Math.round(i.clientHeight),
          // كم بالمئة من الصورة بينقص لما تتحط بصندوق بشكل ثاني
          crop: Math.round((1 - Math.min(box, img) / Math.max(box, img)) * 100),
        };
      }),
  );

  console.log(`\nأغلفة ظاهرة: ${imgs.length}`);
  imgs.forEach((i) =>
    console.log(
      `  ${i.ok ? '✅' : '❌'} ${i.file.padEnd(26)} صندوق ${i.box.padEnd(9)}` +
        (i.crop > 12 ? `⚠️ قص ${i.crop}%` : `قص ${i.crop}%`),
    ),
  );

  console.log(`أخطاء الكونسول: ${errors.length}`);
  errors.slice(0, 6).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
  await page.close();
}

await browser.close();
