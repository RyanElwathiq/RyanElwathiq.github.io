// فحص تطابق الرسالة عصفحات الهبوط الممولة الثلاث (شرط انطلاق الحملة)
// السؤال: هل وعد الإعلان (تشخيص مجاني) وزر واضح ظاهرين فوق الطية؟ ديسكتوب + موبايل
import { chromium } from '@playwright/test';

const PV = 'C:/Users/rayan/AppData/Local/Temp/claude/D---------------------luvit------/e55a5e15-c646-483b-9bf6-e656e386b383/scratchpad';
const BASE = process.argv[2] || 'https://ryanalali.me';
const PAGES = [
  ['websites', `${BASE}/ar/services/websites/`],
  ['services', `${BASE}/ar/services/`],
  ['paid-ads', `${BASE}/ar/services/paid-ads/`],
];
const VIEWS = [
  ['desktop', { width: 1280, height: 800 }],
  ['mobile', { width: 375, height: 812 }],
];

const b = await chromium.launch();
for (const [vname, vp] of VIEWS) {
  const p = await b.newPage({ viewport: vp });
  for (const [name, url] of PAGES) {
    await p.goto(url, { waitUntil: 'load' });
    await p.waitForTimeout(1800);
    const r = await p.evaluate(() => {
      const H = window.innerHeight;
      const vis = (el) => {
        if (!el) return false;
        const b = el.getBoundingClientRect();
        return b.top >= 0 && b.top < H && b.height > 0;
      };
      // أي عنصر فوق الطية بيحكي عن التشخيص المجاني
      const txt = [...document.querySelectorAll('h1,h2,p,a,button,span')].filter(
        (e) => /تشخيص|مجاني/.test(e.textContent) && vis(e),
      );
      // زر/رابط CTA فوق الطية بيودي عالبريف أو الفورم
      const cta = [...document.querySelectorAll('a,button')].filter(
        (e) => (/brief|#notify|#packs/.test(e.getAttribute('href') || '') || /تشخيص|ابدأ|احجز|اطلب/.test(e.textContent)) && vis(e),
      );
      return {
        promiseAboveFold: txt.length,
        promiseSample: txt[0]?.textContent.trim().slice(0, 60) || null,
        ctaAboveFold: cta.length,
        ctaSample: cta[0]?.textContent.trim().slice(0, 40) || null,
      };
    });
    console.log(`${vname}/${name}:`, JSON.stringify(r));
    await p.screenshot({ path: `${PV}/match-${vname}-${name}.png` });
  }
  await p.close();
}
await b.close();
