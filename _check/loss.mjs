import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.goto('http://localhost:4321/ar/loss/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1400);

const big = () => page.locator('.loss-big span').first().textContent();
const out = {};
out.start = await big();

// غيّر المجال لمطعم (نسبة ضياع أقل) → لازم الرقم ينزل
await page.selectOption('#l-ind', 'food');
await page.waitForTimeout(1000);
out.afterFood = await big();

// رجّع خدمات مهنية → لازم يرجع يعلى
await page.selectOption('#l-ind', 'services');
await page.waitForTimeout(1000);
out.afterServices = await big();

// زوّد الربح للعميل
await page.locator('#l-profit').fill('500');
await page.waitForTimeout(1000);
out.afterProfit500 = await big();

// «عندي موقع ضعيف» → لازم الخسارة تقل
await page.selectOption('#l-site', 'weak');
await page.waitForTimeout(1000);
out.afterWeakSite = await big();

const num = s => parseInt(String(s).replace(/[^\d]/g,''),10) || 0;
out.foodLowerThanServices = num(out.afterFood) < num(out.afterServices);
out.profitRaisedIt = num(out.afterProfit500) > num(out.afterServices);
out.weakSiteLoweredIt = num(out.afterWeakSite) < num(out.afterProfit500);

// التفصيل والمجموع
out.reasons = await page.locator('.loss-reasons li').count();
out.paybackText = (await page.locator('.loss-payback-body').textContent()).trim().slice(0,80);
out.ctaHref = await page.locator('.loss-cta a').getAttribute('href');
await page.screenshot({ path: '_check/out/loss-full.png', fullPage: false });
console.log(JSON.stringify(out, null, 1));
console.log('errors:', errors.length, errors.slice(0,3));
await browser.close();
