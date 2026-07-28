import { chromium, devices } from '@playwright/test';
const b = await chromium.launch();
const BASE = process.argv[2] || 'https://ryanalali.me';
const cases = [
  { name: 'عادي',                opts: {} },
  { name: 'تقليل الحركة',        opts: { reducedMotion: 'reduce' } },
  { name: 'دخول برابط #contact', opts: {}, path: '/#contact' },
  { name: 'تقليل حركة + #contact', opts: { reducedMotion: 'reduce' }, path: '/#contact' },
];
for (const c of cases) {
  const ctx = await b.newContext({ ...devices['Pixel 5'], ...c.opts });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0,90)));
  await p.goto(BASE + (c.path || '/'), { waitUntil:'networkidle', timeout:120000 });
  await p.waitForTimeout(3000);
  await p.evaluate(() => {
    const el = document.querySelector('#loss');
    if (el) { const y = el.getBoundingClientRect().top + scrollY - 60; window.__lenis ? window.__lenis.scrollTo(y,{immediate:true}) : scrollTo(0,y); }
  });
  await p.waitForTimeout(3000);
  const r = await p.evaluate(() => ({
    big: document.querySelector('#loss .loss-big span')?.textContent,
    year: document.querySelectorAll('#loss .loss-mini b')[0]?.textContent?.trim(),
    reason: document.querySelector('#loss .loss-reason-top span')?.textContent?.trim(),
  }));
  console.log(`${c.name.padEnd(22)} كبير=${r.big} سنة=${r.year} سبب=${r.reason} ${r.big === '0' ? '✗ عالق' : '✓'}`, errs[0]||'');
  await ctx.close();
}
await b.close();
