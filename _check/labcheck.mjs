// فحص قسم التجارب بعد إضافة مجموعة معالجة الصور
//   node _check/labcheck.mjs [رابط]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.argv[2] || 'http://localhost:4330';
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));

await page.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

const y = await page.evaluate(() => {
  const el = document.getElementById('lab-work');
  if (!el) return null;
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.__lenis?.scrollTo(top, { immediate: true }) ?? window.scrollTo(0, top);
  return top;
});
if (y === null) {
  console.log('❌ ما لقيت قسم #lab-work');
  process.exit(1);
}
await page.waitForTimeout(2000);
await page.screenshot({ path: '_check/out/lab-top.png' });

// كل المجموعات وعدد صورها، وشو انحمّل فعلاً
const info = await page.evaluate(() => {
  const sec = document.getElementById('lab-work');
  const imgs = [...sec.querySelectorAll('img')];
  return {
    text: sec.innerText.split('\n').filter(Boolean).slice(0, 40),
    manip: imgs.filter((i) => i.src.includes('manip-')).map((i) => ({
      f: i.src.split('/').pop(),
      ok: i.naturalWidth > 0,
      nat: i.naturalWidth + '×' + i.naturalHeight,
      box: Math.round(i.clientWidth) + '×' + Math.round(i.clientHeight),
    })),
    total: imgs.length,
  };
});

console.log('نصوص القسم:');
info.text.forEach((t) => console.log('  ' + t));
console.log(`\nصور معالجة الصور الظاهرة: ${info.manip.length} من أصل ${info.total} صورة بالقسم`);
info.manip.forEach((i) =>
  console.log(`  ${i.ok ? '✅' : '⏳'} ${i.f.padEnd(16)} أصلية ${i.nat.padEnd(10)} صندوق ${i.box}`),
);
console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));

await browser.close();
