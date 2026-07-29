import { chromium } from '@playwright/test';
const b = await chromium.launch();
for (const path of ['/work/dr-samir/','/work/knockout/','/ar/work/dr-samir/']) {
  const p = await b.newPage({ viewport:{width:1440,height:900} });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  p.on('console', m => m.type()==='error' && errs.push('CONSOLE: ' + m.text()));
  p.on('response', r => r.status()>=400 && errs.push(r.status()+' '+r.url()));
  await p.goto('http://localhost:4333'+path, { waitUntil:'networkidle' });
  await p.waitForTimeout(2500);
  console.log(path, '→', errs.length ? errs.slice(0,4) : 'نظيف');
  await p.close();
}
await b.close();
