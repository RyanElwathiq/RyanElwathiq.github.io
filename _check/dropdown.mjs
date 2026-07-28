// فحص قائمة الاختيار الجديدة + وجود الحاسبة بالصفحة الرئيسية
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:4331';
const b = await chromium.launch();
const errs = [];

const page = async (path, vw = { width: 1440, height: 900 }) => {
  const p = await b.newPage({ viewport: vw });
  p.on('console', (m) => m.type() === 'error' && errs.push(`${path} :: ${m.text()}`));
  p.on('pageerror', (e) => errs.push(`${path} :: PAGEERROR ${e.message}`));
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  return p;
};

// ⚠️ scrollIntoViewIfNeeded بتتخانق مع Lenis (السكرول الناعم بيرجّع الصفحة
//    لمكانها كل إطار). لهيك منمرّر عبر Lenis نفسه.
const scrollTo = async (p, sel) => {
  await p.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return;
    const y = el.getBoundingClientRect().top + scrollY - 220;
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, sel);
  await p.waitForTimeout(1600);
};

// ═══ 1) الحاسبة موجودة بالصفحة الرئيسية؟ ═══
for (const [path, label] of [['/ar/', 'AR home'], ['/', 'EN home']]) {
  const p = await page(path);
  const has = await p.locator('#loss .loss').count();
  const mark = await p.locator('[data-mark="loss"]').count();
  console.log(`${label}: section=${has} signal-mark=${mark}`);
  await p.close();
}

// ═══ 2) القائمة بتفتح وبتختار وبيتغيّر الرقم؟ ═══
for (const [path, sel] of [
  ['/ar/loss/', '#l-ind'],
  ['/ar/', '#l-site'],
  ['/loss/', '#l-ind'],
]) {
  const p = await page(path);
  const btn = p.locator(sel);
  await scrollTo(p, sel);

  const before = (await p.locator('.loss-big span').first().textContent()) || '';
  await btn.click();
  await p.waitForTimeout(450);

  if ((await p.locator('.sel-list').count()) === 0) {
    const d = await p.evaluate((s) => {
      const el = document.querySelector(s);
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return {
        scrollY: Math.round(scrollY),
        top: Math.round(r.top),
        expanded: el.getAttribute('aria-expanded'),
        hitting: top ? top.tagName + '.' + String(top.className).slice(0, 40) : null,
      };
    }, sel);
    console.log('  ⚠️ panel did not open:', JSON.stringify(d));
    await p.screenshot({ path: `_check/out/fail${path.replace(/\//g, '_')}.png` });
    await p.close();
    continue;
  }

  const listCount = await p.locator('.sel-list [role="option"]').count();
  const listVisible = await p.locator('.sel-list').first().isVisible();

  // ألوان فعلية — عشان نتأكد إنه النص مقروء مش أسود على غامق
  const style = await p.locator('.sel-list [role="option"]').first().evaluate((el) => {
    const cs = getComputedStyle(el);
    const list = getComputedStyle(el.parentElement);
    return { text: cs.color, listBg: list.backgroundColor };
  });

  // آخر خيار — عشان يشتغل مع القوائم القصيرة كمان
  await p.locator('.sel-list [role="option"]').nth(listCount - 1).click();
  await p.waitForTimeout(1100);
  const after = (await p.locator('.loss-big span').first().textContent()) || '';
  const stillOpen = await p.locator('.sel-list').count();

  console.log(
    `${path} ${sel}: options=${listCount} visible=${listVisible} closedAfterPick=${stillOpen === 0}`,
    `| ${before} -> ${after} ${before !== after ? 'CHANGED ✓' : 'NO CHANGE ✗'}`,
    `| text=${style.text} on ${style.listBg}`
  );

  await p.screenshot({ path: `_check/out/dd${path.replace(/\//g, '_')}.png` });
  await p.close();
}

// ═══ 3) الكيبورد ═══
{
  const p = await page('/ar/loss/');
  await scrollTo(p, '#l-ind');
  await p.locator('#l-ind').focus();
  await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  const opened = await p.locator('.sel-list').count();
  await p.keyboard.press('ArrowDown');
  await p.keyboard.press('ArrowDown');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(300);
  const closed = (await p.locator('.sel-list').count()) === 0;
  const val = await p.locator('#l-ind .sel-val').textContent();
  console.log(`keyboard: opened=${opened === 1} pickedByKeys=${closed} value="${val}"`);
  await p.keyboard.press('Enter');
  await p.waitForTimeout(250);
  await p.keyboard.press('Escape');
  await p.waitForTimeout(250);
  console.log('escape closes:', (await p.locator('.sel-list').count()) === 0);
  await p.close();
}

// ═══ 4) نموذج الطلب + الموبايل ═══
{
  const p = await page('/ar/brief/', { width: 390, height: 844 });
  await scrollTo(p, '.brief-nav');
  // خطوة ١ → خطوة ٢ (فيها قائمتين اختيار)
  await p.locator('.brief-chip').first().click();
  await p.locator('.brief-nav .btn-primary').click();
  await p.waitForTimeout(700);

  await p.locator('#b-budget').click();
  await p.waitForTimeout(400);
  const opts = await p.locator('.sel-list [role="option"]').count();
  await p.locator('.sel-list [role="option"]').nth(2).click();
  await p.waitForTimeout(400);
  const picked = await p.locator('#b-budget .sel-val').textContent();
  console.log(`brief mobile: options=${opts} picked="${picked}" closed=${(await p.locator('.sel-list').count()) === 0}`);
  await p.screenshot({ path: '_check/out/brief-mobile.png' });
  await p.close();
}

console.log('\nCONSOLE ERRORS:', errs.length ? errs : 'none');
await b.close();
