// يستخرج نص PDF عبر pdf.js — نفس نوع المحرك اللي بتقرأ فيه أنظمة ATS
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const pdf64 = readFileSync(process.argv[2]).toString('base64');
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('about:blank');
await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs', type: 'module' });
await page.waitForTimeout(1500);
const text = await page.evaluate(async (b64) => {
  const { pdfjsLib } = globalThis;
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs';
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  const doc = await pdfjsLib.getDocument({ data: arr }).promise;
  let out = '';
  for (let p = 1; p <= doc.numPages; p++) {
    const tc = await (await doc.getPage(p)).getTextContent();
    out += tc.items.map((i) => i.str).join(' ') + '\n---PAGE---\n';
  }
  return out;
}, pdf64);
await browser.close();
console.log('chars:', text.length);
console.log(text.slice(0, 600));
