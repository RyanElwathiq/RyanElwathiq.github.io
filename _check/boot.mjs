// شاشة التحميل: بتظهر، بتروح، وما بتعلق أبداً
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();

// ─── ١) نت بطيء: بتظهر وبتروح؟ ───
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  // منبطّئ كل الملفات عشان نقلّد نت ضعيف
  await p.route('**/*', async (route) => {
    await new Promise((r) => setTimeout(r, 220));
    route.continue();
  });

  const t0 = Date.now();
  await p.goto(BASE + '/ar/', { waitUntil: 'commit' });
  await p.waitForTimeout(600);
  const shown = await p.locator('#boot').isVisible().catch(() => false);
  await p.screenshot({ path: '_check/out/boot-slow.png' });
  console.log(`نت بطيء: الشاشة ظهرت = ${shown ? '✓' : '✗'}`);

  await p.waitForFunction(() => !document.getElementById('boot'), null, { timeout: 20000 });
  console.log(`           وراحت بعد ${((Date.now() - t0) / 1000).toFixed(1)}s ✓`);
  const scrollOk = await p.evaluate(() => {
    scrollTo(0, 400);
    return scrollY > 0 || document.documentElement.scrollHeight > innerHeight;
  });
  console.log(`           السكرول رجع طبيعي = ${scrollOk ? '✓' : '✗'}`);
  await ctx.close();
}

// ─── ٢) نت سريع: ما بتزعج ───
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const t0 = Date.now();
  await p.goto(BASE + '/ar/', { waitUntil: 'load' });
  await p.waitForFunction(() => !document.getElementById('boot'), null, { timeout: 15000 });
  console.log(`نت سريع : راحت بعد ${((Date.now() - t0) / 1000).toFixed(2)}s ✓`);
  await p.close();
}

// ─── ٣) ما بتطلع كل ما تتنقّل ───
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.locator('.pill a[href*="signals"]').first().click();
  await p.waitForTimeout(1200);
  const again = await p.locator('#boot').count();
  const stuck = await p.evaluate(() => document.documentElement.classList.contains('boot-on'));
  console.log(`بعد التنقّل: طلعت مرة ثانية = ${again ? '✗ طلعت' : '✓ لأ'} | السكرول محبوس = ${stuck ? '✗' : '✓ لأ'}`);
  await p.locator('.pill .brand').click();
  await p.waitForTimeout(1800);
  const again2 = await p.locator('#boot').count();
  console.log(`بعد الرجوع : طلعت مرة ثانية = ${again2 ? '✗ طلعت' : '✓ لأ'}`);
  await p.close();
}

// ─── ٤) لو الجافاسكربت وقع، ما بتحبس الزائر ───
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  await p.goto(BASE + '/ar/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(900);
  const covering = await p.locator('#boot').isVisible().catch(() => false);
  console.log(`بدون جافاسكربت: الشاشة مغطّية المحتوى = ${covering ? '⚠️ آه' : '✓ لأ'}`);
  await p.screenshot({ path: '_check/out/boot-nojs.png' });
  await p.close();
}

await b.close();
