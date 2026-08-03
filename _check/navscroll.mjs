// ضمانة الهبوط عالبداية — ٤ حالات (شوف Base.astro «ضمانة الهبوط»)
//   node _check/navscroll.mjs [رابط]
import { chromium } from '@playwright/test';
const BASE = process.argv[2] || 'http://localhost:4330';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 950 } });
let fail = 0;
const check = (ok, msg) => { if (!ok) fail++; console.log((ok ? '✅' : '❌') + ' ' + msg); };

await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
const link = p.locator('.latest li a').first();
await link.evaluate((el) => el.scrollIntoView({ block: 'center' }));
await p.waitForTimeout(1000);
await link.click();
await p.waitForURL('**/signals/**');
await p.waitForTimeout(3000);
check((await p.evaluate(() => window.scrollY)) < 50, 'كبسة مقالة ← بداية ثابتة');

await p.goBack();
await p.waitForTimeout(1500);
check((await p.evaluate(() => window.scrollY)) > 5000, 'الرجوع ← استعادة المكان');

await p.goto(BASE + '/ar/services/packages/launch/', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
const pl = p.locator('a[href="/ar/services/#packs"]').first();
await pl.evaluate((el) => el.scrollIntoView({ block: 'center' }));
await p.waitForTimeout(800);
await pl.click();
await p.waitForTimeout(2500);
check((await p.evaluate(() => window.scrollY)) > 500, 'رابط # ← لمرساه');

await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
const l2 = p.locator('.latest li a').nth(1);
await l2.evaluate((el) => el.scrollIntoView({ block: 'center' }));
await p.waitForTimeout(800);
await l2.click();
await p.waitForURL('**/signals/**');
await p.waitForTimeout(400);
await p.mouse.wheel(0, 800);
await p.waitForTimeout(1500);
check((await p.evaluate(() => window.scrollY)) > 200, 'سكرول المستخدم محترم');

console.log(fail ? '❌ ' + fail : '✅ ضمانة السكرول سليمة');
await b.close();
process.exit(fail ? 1 : 0);
