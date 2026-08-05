// فحص حي: كبسة رابط واتساب لازم تدفع wa_click بالـ dataLayer
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('https://ryanalali.me/ar/services/data-analysis/', { waitUntil: 'load' });
await p.waitForTimeout(2500);
const out = await p.evaluate(() => {
  const a = document.querySelector('a[href*="wa.me/"], a[href*="api.whatsapp.com"]');
  if (!a) return { found: false };
  a.addEventListener('click', (e) => e.preventDefault()); // بلا فتح واتساب فعلياً
  a.click();
  const ev = (window.dataLayer || []).filter((x) => x[0] === 'event' && x[1] === 'wa_click');
  return { found: true, href: a.href, fired: ev.length, sample: ev[0] ? JSON.stringify(ev[0][2]) : null };
});
console.log(JSON.stringify(out));
await b.close();
