import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4321/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const r = await page.evaluate(async () => {
  const before = window.scrollX;
  window.scrollTo(400, window.scrollY);
  await new Promise(r=>setTimeout(r,300));
  const after = window.scrollX;
  window.scrollTo(0, window.scrollY);
  // مين أعرض من الشاشة وغير مقصوص؟
  const vw = document.documentElement.clientWidth;
  const culprits = [];
  document.querySelectorAll('*').forEach(el=>{
    const b = el.getBoundingClientRect();
    if (b.width===0) return;
    if (b.right > vw + 2) {
      let n = el.parentElement, clipped = false;
      while (n && n !== document.body) {
        const ox = getComputedStyle(n).overflowX;
        if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') { clipped = true; break; }
        n = n.parentElement;
      }
      if (!clipped) culprits.push({ tag: el.tagName, cls:(el.className||'').toString().slice(0,40), right: Math.round(b.right) });
    }
  });
  return { canScrollX: after !== before, movedTo: after, vw, culprits: culprits.slice(0,6) };
});
console.log(JSON.stringify(r, null, 1));
await browser.close();
