// فحص صفحات الخدمات: البنية، نموذج قائمة الانتظار، والفراغات
//   node _check/svccheck.mjs [رابط]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.argv[2] || 'http://localhost:4330';
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push('PAGE ERROR: ' + e.message));

const pages = [
  ['/ar/services/data-analysis/', 'ar'],
  ['/services/data-analysis/', 'en'],
  ['/ar/services/ai-agents-automation/', 'ar'],
  ['/services/ai-agents-automation/', 'en'],
  ['/ar/services/seo/', 'ar'],
];

for (const [path, lang] of pages) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);

  const info = await page.evaluate(() => {
    const f = document.querySelector('form[data-notify]');
    const el = (s) => document.querySelector(s);
    return {
      h1: (el('h1')?.textContent || '').slice(0, 60),
      badge: !!el('.soon-badge'),
      why: document.querySelectorAll('.why p').length,
      pain: document.querySelectorAll('.pain li').length,
      deliver: document.querySelectorAll('.deliver li').length,
      faq: document.querySelectorAll('details').length,
      form: !!f,
      wired: f?.dataset.wired === '1',
      fields: f ? [...f.querySelectorAll('input')].map((i) => i.name).join(',') : '',
      brief: !!el('#brief'),
    };
  });

  const ok = info.badge ? info.form && info.wired && !info.brief : info.brief && !info.form;
  console.log(
    `${ok ? '✅' : '❌'} ${path.padEnd(38)} ` +
      `${info.badge ? 'قريباً' : 'متاحة'} · ليش ${info.why} · وجع ${info.pain} · ` +
      `تسليم ${info.deliver} · أسئلة ${info.faq} · ` +
      (info.badge ? `نموذج ${info.wired ? 'مربوط' : 'مش مربوط ⚠️'} [${info.fields}]` : 'طلب مشروع'),
  );
}

await page.goto(BASE + '/ar/services/data-analysis/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelector('#notify')?.scrollIntoView());
await page.waitForTimeout(900);
await page.screenshot({ path: '_check/out/svc-notify.png' });

console.log(`\nأخطاء الكونسول: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log('  ! ' + e.slice(0, 140)));
await browser.close();
