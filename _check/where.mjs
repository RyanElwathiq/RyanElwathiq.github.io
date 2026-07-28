import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4331/ar/', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
console.log(JSON.stringify(await p.evaluate(() => {
  const out = [];
  document.querySelectorAll('main section[id], main > section, #knot, #lab, #loss, #budget').forEach(el => {
    const y = Math.round(el.getBoundingClientRect().top + scrollY);
    out.push({ id: el.id || el.className.split(' ')[0], y });
  });
  const isl = [...document.querySelectorAll('astro-island')].map(i => ({
    comp: i.getAttribute('component-export') || i.getAttribute('component-url')?.split('/').pop(),
    y: Math.round(i.getBoundingClientRect().top + scrollY),
    client: i.getAttribute('client'),
  }));
  return { sections: out.filter(s=>s.y>13000&&s.y<17000), islands: isl, docH: document.documentElement.scrollHeight };
}), null, 1));
await b.close();
