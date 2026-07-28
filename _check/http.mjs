import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const bad = [];
p.on('response', r => { if (r.status() >= 400) bad.push(r.status() + ' ' + r.url()); });
for (const path of ['/ar/','/','/ar/loss/','/ar/brief/','/ar/signals/']) {
  await p.goto('https://ryanalali.me' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
}
console.log('طلبات فاشلة:', bad.length ? bad.slice(0,8) : 'ولا واحد ✓');
await b.close();
