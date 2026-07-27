import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://localhost:4321/ar/', { waitUntil: 'networkidle' });
await page.evaluate(() => { const el=document.querySelector('#knot');
  const y=el.getBoundingClientRect().top+scrollY-100;
  window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y); });
await page.waitForTimeout(3000);

const out = {};
const pct = () => page.locator('.knot3d-meter-top b').textContent();
const won = () => page.locator('.knot3d-win').count();

// ① ما بيفوز لحاله: نستنى ٤ ثواني بدون ما نلمس
out.startPct = await pct();
await page.waitForTimeout(4000);
out.afterWaitPct = await pct();
out.autoWon = (await won()) > 0;

// ② نلعب: نلف لحد ما نقفل (بحد أقصى ٦٠ محاولة)
const box = await page.locator('.knot3d-stage').boundingBox();
const cx = box.x + box.width/2, cy = box.y + box.height/2;
let tries = 0, best = 0;
for (; tries < 60; tries++) {
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i=1;i<=8;i++){ await page.mouse.move(cx + i*18, cy + (i%3)*6); await page.waitForTimeout(14); }
  await page.mouse.up();
  await page.waitForTimeout(160);
  const p = parseInt((await pct()).replace('%','')) || 0;
  if (p > best) best = p;
  if (await won()) break;
}
out.triesToWin = tries;
out.bestPctSeen = best;
out.won = (await won()) > 0;
if (out.won) {
  out.winText = (await page.locator('.knot3d-win strong').textContent()).trim();
  out.timeText = (await page.locator('.knot3d-win span').first().textContent()).trim();
  // زر «جرّب مرة ثانية»
  await page.locator('.knot3d-win .btn').click();
  await page.waitForTimeout(900);
  out.resetWorks = (await won()) === 0;
  out.pctAfterReset = await pct();
}
await page.screenshot({ path: '_check/out/knot-win.png' });
console.log(JSON.stringify(out, null, 1));
console.log('errors:', errors.length);
await browser.close();
