// فحص رحلة نموذج الطلب كاملة
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

await page.goto('http://localhost:4321/ar/brief/', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);

const out = {};

// ① التقدّم بدون اختيار خدمة → لازم يتمنع
await page.getByRole('button', { name: 'التالي' }).click();
await page.waitForTimeout(400);
out.blocksEmptyStep1 = await page.locator('.brief-err').isVisible();
out.err1 = (await page.locator('.brief-err').textContent().catch(() => '')) || '';

// ② نختار خدمتين وننتقل
await page.getByRole('button', { name: 'موقع إلكتروني', exact: true }).click();
await page.getByRole('button', { name: 'إعلانات مدفوعة', exact: true }).click();
out.chipsSelected = await page.locator('.brief-chip[aria-pressed="true"]').count();
await page.getByRole('button', { name: 'التالي' }).click();
await page.waitForTimeout(600);
out.step2Reached = await page.locator('#b-biz').isVisible();

// ③ نعبّي الخطوة ٢
await page.fill('#b-biz', 'كافيه الركن');
await page.selectOption('#b-budget', { index: 2 });
await page.fill('#b-details', 'كافيه بعمّان، بدنا نزيد الطلبات أونلاين.');
await page.getByRole('button', { name: 'التالي' }).click();
await page.waitForTimeout(600);
out.step3Reached = await page.locator('#b-email').isVisible();

// ④ إيميل غلط → لازم يتمنع
await page.fill('#b-name', 'ريّان');
await page.fill('#b-email', 'not-an-email');
await page.getByRole('button', { name: 'أرسل الطلب' }).click();
await page.waitForTimeout(400);
out.blocksBadEmail = await page.locator('.brief-err').isVisible();
out.err2 = (await page.locator('.brief-err').textContent().catch(() => '')) || '';

// ⑤ رجوع لورا شغّال؟
await page.getByRole('button', { name: /رجوع/ }).first().click();
await page.waitForTimeout(500);
out.backWorks = await page.locator('#b-biz').isVisible();
out.keptBiz = await page.inputValue('#b-biz');
await page.getByRole('button', { name: 'التالي' }).click();
await page.waitForTimeout(500);

// ⑥ إيميل صح → نتأكد إنه بيبني mailto صح (بدون ما نفتحه فعلياً)
await page.fill('#b-email', 'client@example.com');
page.on('dialog', (d) => d.dismiss());
await page.getByRole('button', { name: 'أرسل الطلب' }).click();
await page.waitForTimeout(1200);
out.doneScreen = await page.locator('.brief-done').isVisible().catch(() => false);
out.doneTitle = (await page.locator('.brief-done h3').textContent().catch(() => '')) || '';

await page.screenshot({ path: '_check/out/brief-done.png' });
console.log(JSON.stringify(out, null, 1));
console.log('errors:', errors.length, errors.slice(0, 3));
await browser.close();
