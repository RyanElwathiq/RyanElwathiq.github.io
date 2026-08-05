// فحص ألعاب صفحات الخدمات: موجودة، تفاعلية، وريسبونسف (بلا سكرول أفقي)
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const MAP = {
  websites: '.loss-result, [class*="loss"]',
  'paid-ads': '[class*="bud"]',
  'brand-identity': '[class*="eye"], [class*="be-"]',
  'social-media': '[class*="ac-"], [class*="attention"]',
  'video-editing': '[class*="lab"]',
  'marketing-strategy': '[class*="pb"], [class*="persona"]',
  seo: '[class*="lj"], [class*="leaky"]',
  consulting: '[class*="cd"], [class*="detector"]',
  'data-analysis': '[class*="ns"], [class*="sorter"]',
};
const fails = [];
for (const lang of ['ar', 'en']) {
  for (const [slug, sel] of Object.entries(MAP)) {
    const base = lang === 'ar' ? '/ar' : '';
    for (const vp of [{ w: 390, h: 844 }, { w: 1280, h: 800 }]) {
      const p = await b.newPage({ viewport: { width: vp.w, height: vp.h } });
      const errs = [];
      p.on('pageerror', (e) => errs.push(String(e).slice(0, 80)));
      await p.goto(`http://localhost:4330${base}/services/${slug}/`, { waitUntil: 'load' });
      await p.waitForTimeout(1600);
      const r = await p.evaluate((s) => ({
        game: !!document.querySelector(s),
        hScroll: document.documentElement.scrollWidth > innerWidth + 2,
      }), sel);
      if (!r.game || r.hScroll || errs.length) fails.push({ lang, slug, vp: vp.w, ...r, errs });
      await p.close();
    }
  }
}
console.log(fails.length ? JSON.stringify(fails, null, 1) : '✅ 36/36 فحص نظيف: اللعبة موجودة وبلا سكرول أفقي وبلا أخطاء JS');
await b.close();
