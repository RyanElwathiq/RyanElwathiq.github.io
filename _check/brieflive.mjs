// ═══════════════════════════════════════════════════════════════
//  فحص الفورم من أوله لآخره — كأني زائر حقيقي
//
//  ما بيفحص الكود، بيفحص التجربة: بيضغط الخيارات، بيكتب
//  بالحقول، بيضغط «أرسل»، وبيتأكد إنه الطلب فعلاً راح للـ Worker
//  ورجع ٢٠٠ — وإنه الزائر شاف رسالة نجاح.
//
//  ⚠️ مهم: بيراقب طلب الشبكة نفسه، مش بس الشاشة. لأنه ممكن
//     تطلع «تم» والطلب ما وصل — وهاي أسوأ حالة ممكنة.
//
//  التشغيل: node _check/brieflive.mjs [رابط]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4470';
const browser = await chromium.launch();

async function run(path, lang) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  const calls = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('response', async (r) => {
    if (r.url().includes('/brief') || r.url().includes('/idea')) {
      calls.push({ url: r.url().split('/').pop(), status: r.status() });
    }
  });

  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const brief = page.locator('#brief, [id="brief"]').first();
  await brief.scrollIntoViewIfNeeded().catch(() => {});
  await page.waitForTimeout(1200);

  const out = { lang, steps: [], calls, errs };

  // ─── الخطوة ١: خدمة ───
  const chip = page.locator('.brief-chip, [data-service], .brief button').first();
  if (await chip.count()) {
    await chip.click({ force: true });
    out.steps.push('خدمة ✓');
  }
  await page.waitForTimeout(400);

  const next = () => page.getByRole('button', { name: /التالي|Next/i }).first();
  if (await next().count()) {
    await next().click({ force: true });
    await page.waitForTimeout(700);
    out.steps.push('التالي ✓');
  }

  // ─── الخطوة ٢: تفاصيل ───
  const fills = [
    ['input', 0, 'فحص آلي — تجاهله'],
    ['textarea', 0, 'هذا فحص تلقائي من سكربت brieflive.mjs. لو وصلك، الفورم شغّال.'],
  ];
  for (const [sel, i, val] of fills) {
    const el = page.locator(`.brief ${sel}`).nth(i);
    if (await el.count()) await el.fill(val).catch(() => {});
  }
  if (await next().count()) {
    await next().click({ force: true });
    await page.waitForTimeout(700);
    out.steps.push('التالي ٢ ✓');
  }

  // ─── الخطوة ٣: بيانات التواصل ───
  const inputs = page.locator('.brief input:visible');
  const n = await inputs.count();
  for (let i = 0; i < n; i++) {
    const el = inputs.nth(i);
    const type = (await el.getAttribute('type')) || 'text';
    const ph = ((await el.getAttribute('placeholder')) || '').toLowerCase();
    if (type === 'email' || ph.includes('@')) await el.fill('brieflive-test@example.com');
    else if (ph.includes('07') || type === 'tel') await el.fill('0790000000');
    else await el.fill('فحص آلي');
  }
  out.steps.push(`عبّى ${n} حقل ✓`);

  // ─── إرسال ───
  const send = page.getByRole('button', { name: /أرسل|Send/i }).first();
  if (!(await send.count())) {
    out.steps.push('✗ ما لقيت زر الإرسال');
    await page.close();
    return out;
  }
  await send.click({ force: true });
  await page.waitForTimeout(9000);

  // ─── شو شاف الزائر؟ ───
  // ⚠️ منقيس العنصر نفسه مش كلمات مفتاحية بالنص.
  //    أول نسخة كانت تدوّر على كلمات، فطلعت «ولا رسالة» بالإنجليزي
  //    مع إنه الشاشة ظاهرة — فحص كذّاب بيخبّي عطل حقيقي.
  out.screen = await page.evaluate(() => {
    const b = document.querySelector('.brief');
    const err = b?.querySelector('.brief-err')?.textContent?.trim() || '';
    const head = b?.querySelector('.brief-done h3, .done h3');
    return {
      err,
      done: !!head,
      title: head?.textContent?.trim() || '',
    };
  });

  await page.close();
  return out;
}

console.log('\n═══ فحص الفورم الحيّ ═══\n');
for (const [path, lang] of [
  ['/brief/', 'إنجليزي'],
  ['/ar/brief/', 'عربي  '],
]) {
  const r = await run(path, lang);
  const sent = r.calls.find((c) => c.url === 'brief');
  console.log(`  ${lang}  ${r.steps.join(' · ')}`);
  console.log(
    `          طلب الشبكة: ${sent ? `POST /brief → ${sent.status} ${sent.status === 200 ? '✓' : '✗'}` : '✗ ما انبعت ولا طلب'}`
  );
  console.log(
    `          شاشة الزائر: ${r.screen?.err ? '⚠️ ' + r.screen.err.slice(0, 60) : r.screen?.done ? 'رسالة نجاح ✓' : '⚠️ ولا رسالة'}`
  );
  if (r.errs.length) console.log(`          ✗ خطأ: ${r.errs[0].slice(0, 80)}`);
  console.log();
}

await browser.close();
