// فحص سحب العقدة ثلاثية الأبعاد
// ⚠️ ما منستخدم canvas.toDataURL — كانفس WebGL بيمسح محتواه بعد
//    كل إطار فبيرجع صورة فاضية. منقارن لقطات شاشة حقيقية بدلها.
import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:4321/ar/', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  const el = document.querySelector('#knot');
  const y = el.getBoundingClientRect().top + scrollY - 100;
  window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
});
await page.waitForTimeout(3000);

const stage = page.locator('.knot3d-stage');
const out = {};
out.canvasExists = await page.locator('.knot3d-stage canvas').isVisible();

const shot = async () => (await stage.screenshot()).toString('base64');
const diff = (a, b) => {
  if (a.length !== b.length) return 100;
  let d = 0;
  for (let i = 0; i < a.length; i += 37) if (a[i] !== b[i]) d++;
  return Math.round((d / (a.length / 37)) * 100);
};

// ① بتدور لحالها؟
const a = await shot();
await page.waitForTimeout(1600);
const b = await shot();
out.autoSpinDiffPct = diff(a, b);
out.autoSpins = out.autoSpinDiffPct > 1;

// ② السحب بيغيّر الزاوية؟
const box = await stage.boundingBox();
const cx = box.x + box.width / 2;
const cy = box.y + box.height / 2;
await page.mouse.move(cx, cy);
await page.mouse.down();
out.grabbingClass = await page.locator('.knot3d-stage.is-grabbing').count();
for (let i = 1; i <= 14; i++) {
  await page.mouse.move(cx + i * 16, cy + i * 4);
  await page.waitForTimeout(16);
}
const c1 = await shot();
out.dragDiffPct = diff(b, c1);
out.dragWorks = out.dragDiffPct > 1;

// ③ بتضل تلف بعد ما نفلّها (بالعطالة)؟
await page.mouse.up();
await page.waitForTimeout(120);
const d1 = await shot();
await page.waitForTimeout(700);
const d2 = await shot();
out.inertiaDiffPct = diff(d1, d2);
out.hasInertia = out.inertiaDiffPct > 1;
out.grabbingCleared = (await page.locator('.knot3d-stage.is-grabbing').count()) === 0;

await page.screenshot({ path: '_check/out/knot-dragged.png' });
console.log(JSON.stringify(out, null, 1));
console.log('errors:', errors.length, errors.slice(0, 3));
await browser.close();
