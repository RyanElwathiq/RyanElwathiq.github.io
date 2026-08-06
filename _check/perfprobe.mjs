// فحص أداء سريع: حجم النقل، عدد الطلبات، وأثقل الأصول عند فتح الرئيسية
import { chromium } from '@playwright/test';
const BASE = process.argv[2] || 'https://ryanalali.me';
const b = await chromium.launch();

for (const [name, vp] of [['mobile', { width: 375, height: 812 }], ['desktop', { width: 1280, height: 800 }]]) {
  const p = await b.newPage({ viewport: vp });
  const reqs = [];
  p.on('response', async (r) => {
    try {
      const len = +(r.headers()['content-length'] || 0);
      reqs.push({ url: r.url().replace(BASE, ''), len, type: r.request().resourceType() });
    } catch {}
  });
  const t0 = Date.now();
  await p.goto(`${BASE}/ar/`, { waitUntil: 'load' });
  const loadMs = Date.now() - t0;
  await p.waitForTimeout(2500);
  const totalKB = Math.round(reqs.reduce((n, r) => n + r.len, 0) / 1024);
  const byType = {};
  for (const r of reqs) byType[r.type] = (byType[r.type] || 0) + r.len;
  const fcp = await p.evaluate(() =>
    Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0),
  );
  console.log(`═══ ${name}: load=${loadMs}ms · FCP=${fcp}ms · ${reqs.length} طلب · ~${totalKB}KB منقول ═══`);
  for (const [t, n] of Object.entries(byType).sort((a, b) => b[1] - a[1]))
    console.log(`  ${t}: ${Math.round(n / 1024)}KB`);
  console.log('  أثقل 5:');
  for (const r of [...reqs].sort((a, b) => b.len - a.len).slice(0, 5))
    console.log(`    ${Math.round(r.len / 1024)}KB · ${r.url.slice(0, 80)}`);
  await p.close();
}
await b.close();
