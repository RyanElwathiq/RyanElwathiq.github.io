// القائمة جوّا المقال — نتأكد إنه ستايل المقال ما بيلمسها
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', (e) => console.log('ERR', e.message));
await p.goto('http://localhost:4331/ar/signals/ar-limatha-almawqi3-daroura/', { waitUntil: 'networkidle' });
await p.evaluate(() => {
  const y = document.querySelector('#l-ind').getBoundingClientRect().top + scrollY - 200;
  window.__lenis ? window.__lenis.scrollTo(y, { immediate: true }) : scrollTo(0, y);
});
await p.waitForTimeout(2200);
await p.locator('#l-ind').click();
await p.waitForTimeout(600);
const s = await p.locator('.sel-list [role="option"]').first().evaluate((el) => {
  const cs = getComputedStyle(el);
  const l = getComputedStyle(el.parentElement);
  return { color: cs.color, listBg: l.backgroundColor, listStyle: cs.listStyleType, padding: cs.padding, fontSize: cs.fontSize };
});
console.log('options:', await p.locator('.sel-list [role="option"]').count(), JSON.stringify(s));
await p.screenshot({ path: '_check/out/article-dd.png' });
await b.close();
