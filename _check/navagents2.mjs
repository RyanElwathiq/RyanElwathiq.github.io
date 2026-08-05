// فحص ما قبل النشر: تنقل ناعم رئيسية ← خدمات ← وكلاء AI ثم كبسة الفيديو (البناء المحلي)
// نفس فلو مشكلة ريّان اللي انصلحت بـ video.load()
import { chromium } from '@playwright/test';
const BASE = process.argv[2] || 'http://localhost:4321';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto(`${BASE}/ar/`, { waitUntil: 'load' });
await p.waitForTimeout(2000);
await p.evaluate(() => { const a = [...document.querySelectorAll('a')].find((x) => x.href.endsWith('/ar/services/')); a?.click(); });
await p.waitForTimeout(2500);
await p.evaluate(() => { const a = [...document.querySelectorAll('a')].find((x) => x.href.includes('/services/ai-agents-automation/')); a?.click(); });
await p.waitForTimeout(2500);
const nav = await p.evaluate(() => location.pathname);
await p.evaluate(() => document.querySelector('[data-lpfilm]')?.scrollIntoView({ block: 'center' }));
await p.locator('[data-lpf-play]').first().click();
await p.waitForTimeout(3500);
const state = await p.evaluate(() => {
  const v = document.querySelector('[data-lpf-video]');
  return {
    path: location.pathname,
    src: v.currentSrc.split('/').pop(),
    poster: (v.getAttribute('poster') || '').split('/').pop(),
    t: Math.round(v.currentTime * 10) / 10,
    paused: v.paused,
    ready: v.readyState,
    err: v.error ? v.error.code : null,
  };
});
console.log(JSON.stringify({ nav, state }));
await b.close();
