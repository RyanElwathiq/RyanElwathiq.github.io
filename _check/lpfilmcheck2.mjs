// فحص فلسفة الكبسة: الغطاء موجود، الكبسة بتشغل بالصوت، والإنجليزي بلا فيديو
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const OUT = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
for (const [id, url, vp] of [
  ['services', 'http://localhost:4330/ar/services/', { width: 1280, height: 800 }],
  ['websites-mobile', 'http://localhost:4330/ar/services/websites/', { width: 390, height: 844 }],
  ['paid-ads', 'http://localhost:4330/ar/services/paid-ads/', { width: 1280, height: 800 }],
  ['en-services', 'http://localhost:4330/services/', { width: 1280, height: 800 }],
]) {
  const p = await b.newPage({ viewport: vp });
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(2000);
  const before = await p.evaluate(() => ({
    cover: !!document.querySelector('[data-lpf-play]'),
    coverVisible: (() => {
      const c = document.querySelector('[data-lpf-play]');
      return c ? getComputedStyle(c).display !== 'none' : null;
    })(),
  }));
  let after = null;
  if (before.cover) {
    await p.evaluate(() => document.querySelector('[data-lpfilm]')?.scrollIntoView({ block: 'center' }));
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}/lpf-${id}-cover.png` });
    await p.locator('[data-lpf-play]').first().click();
    await p.waitForTimeout(1500);
    after = await p.evaluate(async () => {
      const v = document.querySelector('[data-lpf-video]');
      const c = document.querySelector('[data-lpf-play]');
      const t1 = v.currentTime;
      await new Promise((r) => setTimeout(r, 800));
      return {
        playing: v.currentTime > t1,
        muted: v.muted,
        coverHidden: getComputedStyle(c).display === 'none',
        controls: v.controls,
      };
    });
    await p.screenshot({ path: `${OUT}/lpf-${id}-playing.png` });
  }
  console.log(id, JSON.stringify({ ...before, after }));
  await p.close();
}
await b.close();
