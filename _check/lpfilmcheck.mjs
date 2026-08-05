// فحص تركيب فيديوهات الهبوط: موجود، بيشتغل لحاله، وبلا كسر تخطيط
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const OUT = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
for (const [id, url] of [
  ['services', 'http://localhost:4330/ar/services/'],
  ['websites', 'http://localhost:4330/ar/services/websites/'],
  ['paid-ads', 'http://localhost:4330/ar/services/paid-ads/'],
]) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(2500);
  const r = await p.evaluate(async () => {
    const v = document.querySelector('.lp-video');
    if (!v) return { found: false };
    const t1 = v.currentTime;
    await new Promise((res) => setTimeout(res, 900));
    return {
      found: true,
      playing: v.currentTime > t1,
      muted: v.muted,
      loop: v.loop,
      w: Math.round(v.getBoundingClientRect().width),
      hScroll: document.documentElement.scrollWidth > innerWidth + 2,
    };
  });
  // سكرين عند الفيديو
  await p.evaluate(() => document.querySelector('.lp-video')?.scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(600);
  await p.screenshot({ path: `${OUT}/film-${id}.png` });
  console.log(id, JSON.stringify(r));
  await p.close();
}
await b.close();
