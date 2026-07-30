// ═══════════════════════════════════════════════════════════════
//  لقطات أغلفة لمشاريع المواقع
//
//  لمشروع «موقع»، أصدق صورة ممكنة هي الموقع نفسه — مش كرت مولّد.
//  هذا السكربت بيفتح الموقع، بيستنى الخطوط والصور تخلص، وبياخد
//  لقطة بعرض ١٤٤٠ وارتفاع ١٤٤٠ (مربّعة، لأنه بطاقة الأعمال مربّعة
//  و object-fit: cover بيقصّها لحاله).
//
//  ⚠️ بيستنى networkidle مش load — كثير مواقع بتحمّل صورها بعد
//     حدث load، فبتطلع اللقطة نص فاضية.
//
//  التشغيل: node _check/shots.mjs
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const jobs = [
  { id: 'plasmajo', url: 'https://plasmajo.com' },
  { id: 'portfolio', url: 'https://ryanalali.me' },
];

const OUT = 'public/assets/work';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const job of jobs) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1440 },
    deviceScaleFactor: 1,
  });
  try {
    await page.goto(job.url, { waitUntil: 'networkidle', timeout: 60000 });
    // شوية وقت زيادة لحركات الدخول عشان ما نمسك الصفحة وهي نص شفافة
    await page.waitForTimeout(3500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);

    const file = `${OUT}/${job.id}-site.jpg`;
    await page.screenshot({ path: file, type: 'jpeg', quality: 88 });
    console.log(`✓ ${job.id.padEnd(12)} → ${file}`);
  } catch (e) {
    console.log(`✗ ${job.id.padEnd(12)} → ${e.message.slice(0, 70)}`);
  }
  await page.close();
}

await browser.close();
