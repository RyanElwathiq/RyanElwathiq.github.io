// فحص صفحات الهبوط الممولة (2026-08-05) — قبل تشغيل حملة جوجل
// لكل صفحة: التحميل، أول شاشة (هيرو + CTA)، تطابق الرسالة، أخطاء الكونسول
import { chromium } from '@playwright/test';

const PAGES = [
  { id: 'websites', url: 'https://ryanalali.me/ar/services/websites/' },
  
  { id: 'paid-ads', url: 'https://ryanalali.me/ar/services/paid-ads/' },
];
const OUT = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';

const browser = await chromium.launch();
for (const vp of [
  { tag: 'desktop', width: 1280, height: 800 },
  { tag: 'mobile', width: 390, height: 844 },
]) {
  for (const pg of PAGES) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    const errors = [];
    page.on('console', (m) => {
      if (m.type() === 'error' && !/429|Failed to load resource/.test(m.text())) errors.push(m.text().slice(0, 120));
    });
    const t0 = Date.now();
    await page.goto(pg.url, { waitUntil: 'load' });
    const loadMs = Date.now() - t0;
    await page.waitForTimeout(1800);
    const info = await page.evaluate(() => {
      const vh = innerHeight;
      const aboveFold = (el) => el && el.getBoundingClientRect().top < vh;
      const h1 = document.querySelector('h1');
      const ctas = [...document.querySelectorAll('a.btn, button.btn, a[class*="cta"], .btn')].slice(0, 8).map((b) => ({
        text: (b.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
        above: b.getBoundingClientRect().top < vh,
        href: b.href || null,
      }));
      const bodyTop = document.body.innerText.slice(0, 1200);
      return {
        title: document.title,
        h1: h1 ? h1.textContent.trim().replace(/\s+/g, ' ') : null,
        h1Above: aboveFold(h1),
        ctas,
        hasDiagnosisAboveFold: /تشخيص/.test(bodyTop),
        briefLink: !!document.querySelector('a[href*="brief"], a[href*="#brief"]'),
        hScroll: document.documentElement.scrollWidth > innerWidth + 2,
      };
    });
    await page.screenshot({ path: `${OUT}/lp-${pg.id}-${vp.tag}.png` });
    console.log(JSON.stringify({ page: pg.id, vp: vp.tag, loadMs, ...info, consoleErrors: errors }, null, 1));
    await page.close();
  }
}
await browser.close();
