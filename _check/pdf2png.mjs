// يرندر صفحات PDF لصور PNG عبر pdf.js داخل كروميوم
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const SCRATCH = process.argv[2];
const pdf64 = readFileSync(`${SCRATCH}/cv.pdf`).toString('base64');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 2000 } });
await page.goto('https://mozilla.github.io/pdf.js/build/pdf.mjs', { waitUntil: 'load' }).catch(() => {});
await page.goto('about:blank');
await page.setContent('<body style="margin:0"><canvas id="c"></canvas></body>');
await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs', type: 'module' });
await page.waitForTimeout(1500);

const numPages = await page.evaluate(async (b64) => {
  const { pdfjsLib } = globalThis;
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  globalThis.__doc = await pdfjsLib.getDocument({ data: arr }).promise;
  return globalThis.__doc.numPages;
}, pdf64);
console.log('صفحات:', numPages);

for (let p = 1; p <= numPages; p++) {
  await page.evaluate(async (pn) => {
    const pg = await globalThis.__doc.getPage(pn);
    const vp = pg.getViewport({ scale: 2 });
    const c = document.getElementById('c');
    c.width = vp.width;
    c.height = vp.height;
    await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
  }, p);
  await page.locator('#c').screenshot({ path: `${SCRATCH}/cv-page${p}.png` });
  console.log(`✅ cv-page${p}.png`);
}
await browser.close();
