import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://localhost:4321/ar/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

const out = {};
// ترتيب الأقسام
out.order = await page.evaluate(() =>
  [...document.querySelectorAll('section[id]')].map(s=>s.id)
    .filter(id=>['signals','faq','brief','contact'].includes(id)).join(' > '));

// النموذج موجود بالهوم؟ (client:visible فلازم ننزّل عليه)
await page.evaluate(() => { const el=document.querySelector('#brief');
  const y=el.getBoundingClientRect().top+scrollY-150;
  window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y); });
await page.waitForTimeout(2200);
out.formOnHome = await page.locator('#brief .brief-chips').isVisible();
out.chipCount = await page.locator('#brief .brief-chip').count();

// كل الأزرار اللي بتودي على /brief/ لسا شغالة؟
out.linksToBriefPage = await page.evaluate(() =>
  [...document.querySelectorAll('a[href*="/brief/"]')].map(a=>a.getAttribute('href')));

// نجرّب الزر اللي بقسم التواصل
const btn = page.locator('#contact a[href*="/brief/"]').first();
out.contactBtnText = (await btn.textContent()).trim();
await btn.click();
await page.waitForTimeout(2200);
out.landedOn = new URL(page.url()).pathname;
out.pageFormWorks = await page.locator('.brief-chips').isVisible();

console.log(JSON.stringify(out, null, 1));
console.log('errors:', errors.length, errors.slice(0,3));
await browser.close();
