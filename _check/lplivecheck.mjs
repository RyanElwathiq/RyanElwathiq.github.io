// فحص حي: كبسة عالغطاء وقراءة حالة الفيديو وأخطائه بالتفصيل
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const reqs = [];
p.on('response', (r) => {
  if (r.url().includes('/assets/lp/')) reqs.push({ url: r.url().split('/').pop(), status: r.status() });
});
await p.goto('https://ryanalali.me/ar/services/websites/', { waitUntil: 'load' });
await p.waitForTimeout(2500);
await p.evaluate(() => document.querySelector('[data-lpfilm]')?.scrollIntoView({ block: 'center' }));
await p.locator('[data-lpf-play]').first().click();
await p.waitForTimeout(3500);
const state = await p.evaluate(() => {
  const v = document.querySelector('[data-lpf-video]');
  return {
    currentTime: v.currentTime,
    paused: v.paused,
    readyState: v.readyState,
    networkState: v.networkState,
    error: v.error ? { code: v.error.code, message: v.error.message } : null,
    src: (v.currentSrc || '').split('/').pop(),
  };
});
console.log(JSON.stringify({ state, reqs }, null, 1));
await b.close();
