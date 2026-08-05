// فحص التعديلات على بناء حديث (4330): الزر والسطر فوق الطية
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const OUT = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
for (const [id, url] of [
  ['services', 'http://localhost:4330/ar/services/'],
  ['websites', 'http://localhost:4330/ar/services/websites/'],
  ['paid-ads', 'http://localhost:4330/ar/services/paid-ads/'],
]) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const vh = innerHeight;
    const above = (sel) => {
      const el = [...document.querySelectorAll(sel)].find((e) => e.offsetParent !== null);
      return el ? el.getBoundingClientRect().top < vh : null;
    };
    return {
      heroBtnAbove: above('.hero-btn'),
      heroNoteAbove: above('.hero-note'),
      noteText: document.querySelector('.hero-note')?.textContent.trim() || null,
      hScroll: document.documentElement.scrollWidth > innerWidth + 2,
    };
  });
  await p.screenshot({ path: `${OUT}/v-${id}.png` });
  console.log(id, JSON.stringify(r));
  await p.close();
}
await b.close();
