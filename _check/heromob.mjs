// فحص هيرو الموبايل بالكود: صفر تنزيل فريمات عالموبايل، والديسكتوب سليم
import { chromium } from '@playwright/test';
const BASE = process.argv[2] || 'http://localhost:4321';
const PV = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
const b = await chromium.launch();

for (const [name, vp] of [['mobile', { width: 375, height: 812 }], ['desktop', { width: 1280, height: 800 }]]) {
  const p = await b.newPage({ viewport: vp });
  const frameReqs = [];
  p.on('request', (r) => { if (r.url().includes('/frames/')) frameReqs.push(r.url().split('/frames/')[1]); });
  await p.goto(`${BASE}/ar/`, { waitUntil: 'load' });
  await p.waitForTimeout(3500);
  const state = await p.evaluate(() => {
    const h = document.querySelector('.hero');
    return {
      classes: h ? [...h.classList].join(' ') : null,
      codeFxVisible: !!document.querySelector('.code-fx') &&
        getComputedStyle(document.querySelector('.code-fx')).display !== 'none',
      knotOpacity: document.querySelector('.knot') ? getComputedStyle(document.querySelector('.knot')).opacity : null,
    };
  });
  console.log(`${name}: frames=${frameReqs.length} (${frameReqs.slice(0, 2).join(', ') || 'none'}) · ${JSON.stringify(state)}`);
  await p.screenshot({ path: `${PV}/hero-${name}.png` });
  await p.close();
}
await b.close();
