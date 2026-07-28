import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.addInitScript(() => {
  window.__lt = [];
  try { new PerformanceObserver(l=>{for(const e of l.getEntries()) window.__lt.push({t:Math.round(e.startTime),d:Math.round(e.duration)});}).observe({entryTypes:['longtask']}); } catch {}
});
await p.goto('http://localhost:4331/ar/', { waitUntil:'networkidle' });
await p.evaluate(() => { const el=document.querySelector('#lab'); const y=el.getBoundingClientRect().top+scrollY; window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y); });
await p.waitForTimeout(2500);
await p.evaluate(() => { window.__lt.length = 0; window.__t0 = performance.now();
  window.__f=[]; let last=performance.now();
  (function tick(now){ window.__f.push(now-last); last=now; requestAnimationFrame(tick); })(performance.now());
});

const box = await p.locator('[data-cord]').boundingBox();
const cx = box.x + box.width/2, cy = box.y + box.height/2;
await p.mouse.move(cx, cy);
await p.mouse.down();
for (let i=1;i<=20;i++) { await p.mouse.move(cx, cy + i*5); await p.waitForTimeout(16); }
await p.mouse.up();
await p.waitForTimeout(2500);

const r = await p.evaluate(() => {
  const f = window.__f;
  const s=[...f].sort((a,b)=>a-b);
  return { long: window.__lt, worst: Math.round(Math.max(...f)), median:+s[Math.floor(s.length/2)].toFixed(1), bad: f.filter(x=>x>50).length, n:f.length,
    lit: document.querySelector('[data-lab]').hasAttribute('data-lit') };
});
console.log(`أثناء سحب اللمبة: وسيط=${r.median}ms أسوأ=${r.worst}ms تعليقات=${r.bad}/${r.n} | أضاءت=${r.lit}`);
console.log('مهام طويلة:', r.long.length ? r.long.map(x=>x.d+'ms').join(' · ') : 'ولا وحدة');
await b.close();
