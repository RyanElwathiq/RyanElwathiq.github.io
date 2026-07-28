import { chromium } from '@playwright/test';
const b = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1400, height: 1000 } });
await p.goto('file:///D:/Ryan-Portfolio/_inbox/index.html');
await p.waitForTimeout(2500);
await p.screenshot({ path: '_check/out/sheet.png' });
console.log('بطاقات:', await p.locator('.c').count());
await b.close();
