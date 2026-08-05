// إعادة إنتاج مشكلة ريّان: دخول الرئيسية ثم التنقل الناعم لصفحة خدمة ثم كبسة الفيديو
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto('https://ryanalali.me/', { waitUntil: 'load' });
await p.waitForTimeout(2000);
// التنقل من القائمة (client-side navigation) للخدمات ثم المواقع
await p.evaluate(() => { const a = [...document.querySelectorAll('a')].find((x) => x.href.endsWith('/services/')); a?.click(); });
await p.waitForTimeout(2500);
await p.evaluate(() => { const a = [...document.querySelectorAll('a')].find((x) => x.href.includes('/services/websites/')); a?.click(); });
await p.waitForTimeout(2500);
const nav = await p.evaluate(() => location.pathname);
await p.evaluate(() => document.querySelector('[data-lpfilm]')?.scrollIntoView({ block: 'center' }));
await p.locator('[data-lpf-play]').first().click();
await p.waitForTimeout(3500);
const state = await p.evaluate(() => {
  const v = document.querySelector('[data-lpf-video]');
  return { path: location.pathname, t: v.currentTime, paused: v.paused, ready: v.readyState, net: v.networkState, err: v.error ? v.error.code : null };
});
console.log(JSON.stringify({ nav, state }));
await b.close();
