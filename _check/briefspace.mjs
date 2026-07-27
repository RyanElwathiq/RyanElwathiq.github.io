import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
await page.goto('http://localhost:4321/ar/brief/', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);
// نروح للخطوة ٢ (اللي بالصورة)
await page.getByRole('button', { name: 'موقع إلكتروني', exact: true }).click();
await page.getByRole('button', { name: 'التالي' }).click();
await page.waitForTimeout(700);
const m = await page.evaluate(() => {
  const g = (s) => document.querySelector(s);
  const cs = (s, p) => getComputedStyle(g(s))[p];
  const rows = [...document.querySelectorAll('.brief-field')].map(f => {
    const l = f.querySelector('label').getBoundingClientRect();
    const i = f.querySelector('input,select,textarea').getBoundingClientRect();
    return { labelToField: Math.round(i.top - l.bottom) };
  });
  const fields = [...document.querySelectorAll('.brief-field')].map(f=>f.getBoundingClientRect());
  const vGaps = [];
  for (let i=1;i<fields.length;i++) if (fields[i].top > fields[i-1].bottom) vGaps.push(Math.round(fields[i].top - fields[i-1].bottom));
  return { gridGap: cs('.brief-grid','gap'), inputPad: cs('.brief-field input','padding'),
    fontSize: cs('.brief-field input','fontSize'), labelGaps: rows.map(r=>r.labelToField), rowGaps: vGaps,
    textareaMin: cs('.brief-field textarea','minHeight') };
});
console.log(JSON.stringify(m, null, 1));
await page.screenshot({ path: '_check/out/brief-space.png' });
await browser.close();
