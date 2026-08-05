// تشخيص حي: مقارنة فيديو الرئيسية (شغال) بفيديو الهبوط (مش شغال)
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
const responses = [];
p.on('response', (r) => {
  if (r.url().includes('.mp4')) responses.push({ url: r.url().split('/').pop(), status: r.status(), headers: { ct: r.headers()['content-type'], cl: r.headers()['content-length'], ar: r.headers()['accept-ranges'], cf: r.headers()['cf-cache-status'] } });
});
await p.goto('https://ryanalali.me/services/websites/', { waitUntil: 'load' });
await p.waitForTimeout(2500);
await p.evaluate(() => document.querySelector('[data-lpfilm]')?.scrollIntoView({ block: 'center' }));
await p.locator('[data-lpf-play]').first().click();
await p.waitForTimeout(4000);
const state = await p.evaluate(() => {
  const v = document.querySelector('[data-lpf-video]');
  return { t: v.currentTime, paused: v.paused, ready: v.readyState, net: v.networkState, err: v.error ? v.error.code : null };
});
console.log(JSON.stringify({ state, responses }, null, 1));
await b.close();
