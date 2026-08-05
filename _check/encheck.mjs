// فحص النسخة الإنجليزية: ترتيب الرئيسية + فيلم Showcase + فيديوهات الهبوط
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const OUT = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';

// ١) الرئيسية الإنجليزية: الترتيب + الفيلم
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto('http://localhost:4330/', { waitUntil: 'load' });
await p.waitForTimeout(2000);
const home = await p.evaluate(() => {
  const shw = document.querySelector('[data-showcase] video');
  const order = [];
  for (const sel of [['showcase', '.shw'], ['about', '#about, [class*="about"]'], ['loss', '#loss']]) {
    const el = document.querySelector(sel[1]);
    if (el) order.push({ id: sel[0], top: Math.round(el.getBoundingClientRect().top + scrollY) });
  }
  return { filmSrc: shw ? shw.getAttribute('src') : null, order };
});
await p.evaluate(() => document.querySelector('[data-showcase]')?.scrollIntoView({ block: 'center' }));
await p.waitForTimeout(600);
await p.screenshot({ path: `${OUT}/en-home-film.png` });
// كبسة تشغيل الفيلم الإنجليزي
await p.locator('[data-shw-play]').click();
await p.waitForTimeout(2000);
const playing = await p.evaluate(async () => {
  const v = document.querySelector('[data-shw-video]');
  const t1 = v.currentTime;
  await new Promise((r) => setTimeout(r, 800));
  return { playing: v.currentTime > t1, src: (v.currentSrc || '').split('/').pop() };
});
console.log('home:', JSON.stringify({ ...home, playing }));
await p.close();

// ٢) صفحات الهبوط الإنجليزية
for (const [id, url] of [
  ['en-services', 'http://localhost:4330/services/'],
  ['en-websites', 'http://localhost:4330/services/websites/'],
  ['en-paid-ads', 'http://localhost:4330/services/paid-ads/'],
]) {
  const pg = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await pg.goto(url, { waitUntil: 'load' });
  await pg.waitForTimeout(1800);
  const r = await pg.evaluate(() => {
    const v = document.querySelector('[data-lpf-video]');
    return { film: v ? (v.getAttribute('src') || '').split('/').pop() : null };
  });
  console.log(id, JSON.stringify(r));
  await pg.close();
}
await b.close();
