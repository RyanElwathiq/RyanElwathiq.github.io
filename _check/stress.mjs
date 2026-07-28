// ═══════════════════════════════════════════════════════════════
//  اختبار إجهاد — «عميل ملّان بيلعب بالموقع»
//  بنجرّب نكسّر كل إشي: ضغط عشوائي، سحب جنوني، إعادة متكررة،
//  تنقّل بسرعة، وسلايدرات بتتحرك بلا رحمة.
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();
const problems = [];
const P = (m) => { problems.push(m); console.log('   ✗ ' + m); };

const newPage = async (vw = { width: 1440, height: 900 }) => {
  const p = await b.newPage({ viewport: vw });
  p.on('pageerror', (e) => P('خطأ جافاسكربت: ' + e.message.slice(0, 110)));
  p.on('console', (m) => m.type() === 'error' && P('خطأ كونسول: ' + m.text().slice(0, 110)));
  return p;
};

const goKnot = async (p) => {
  await p.evaluate(() => {
    const el = document.querySelector('#knot');
    const y = el.getBoundingClientRect().top + scrollY - 120;
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
  });
  await p.waitForTimeout(1800);
};

const meter = (p) => p.locator('.knot3d-meter b').textContent();
const won = (p) => p.locator('.knot3d-win').count();

// ═══ ١) العقدة: بتفوز لحالها بدون لعب؟ ═══
console.log('\n══ العقدة: بتشتغل لحالها؟ ══');
{
  const p = await newPage();
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await goKnot(p);

  const m0 = await meter(p);
  await p.waitForTimeout(9000); // نستنى ٩ ثواني بدون ما نلمس إشي
  const m1 = await meter(p);
  const w = await won(p);
  console.log(`   بدون أي لمسة: المقياس ${m0} → ${m1} | فاز=${w}`);
  if (w > 0) P('العقدة فازت لحالها بدون ما يلعب الزائر');
  if (m1 !== '0%') P(`المقياس بيتحرك لحاله (${m1}) بدون لعب`);
  await p.close();
}

// ═══ ٢) العقدة: ضغطة بدون سحب ═══
console.log('\n══ العقدة: ضغط بدون سحب ══');
{
  const p = await newPage();
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await goKnot(p);
  const box = await p.locator('.knot3d-stage').boundingBox();
  for (let i = 0; i < 25; i++) {
    await p.mouse.click(box.x + box.width / 2 + (i % 5), box.y + box.height / 2 + (i % 3));
  }
  await p.waitForTimeout(4000);
  const m = await meter(p);
  const w = await won(p);
  console.log(`   ٢٥ ضغطة بدون سحب: المقياس=${m} فاز=${w}`);
  if (w > 0) P('فازت من ضغطات بدون سحب حقيقي');
  if (m !== '0%') P(`المقياس تحرّك (${m}) من ضغطات بدون سحب`);
  await p.close();
}

// ═══ ٣) العقدة: سحب جنوني + إعادة متكررة ═══
console.log('\n══ العقدة: سحب عنيف وإعادة متكررة ══');
{
  const p = await newPage();
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await goKnot(p);
  const box = await p.locator('.knot3d-stage').boundingBox();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  let rounds = 0;
  for (let r = 0; r < 6; r++) {
    await p.mouse.move(cx, cy);
    await p.mouse.down();
    for (let i = 0; i < 40; i++) {
      await p.mouse.move(cx + Math.sin(i / 2) * 220, cy + Math.cos(i / 3) * 150);
    }
    await p.mouse.up();
    await p.waitForTimeout(1400);
    if ((await won(p)) > 0) {
      rounds++;
      // اضغط «جرّب مرة ثانية» فوراً وبسرعة
      await p.locator('.knot3d-win button').click();
      await p.waitForTimeout(500);
      const wAfter = await won(p);
      const mAfter = await meter(p);
      if (wAfter > 0) P('بعد «جرّب مرة ثانية» ضلّت شاشة الفوز');
      if (mAfter !== '0%') P(`بعد الإعادة المقياس بدأ من ${mAfter} مش من صفر`);
      await p.waitForTimeout(3500);
      if ((await won(p)) > 0) P('فازت لحالها فوراً بعد الإعادة (بدون لعب)');
    }
  }
  console.log(`   ${rounds} جولة فوز من ٦ محاولات سحب عنيف`);
  await p.close();
}

// ═══ ٤) الرندر بيوقف لما يطلع القسم برّا الشاشة؟ ═══
console.log('\n══ الرسم ثلاثي الأبعاد برّا الشاشة ══');
{
  const p = await newPage();
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await goKnot(p);
  await p.waitForTimeout(1200);

  const sample = async (label) => {
    const r = await p.evaluate(
      () =>
        new Promise((res) => {
          let n = 0;
          const t0 = performance.now();
          const tick = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(tick); else res(n); };
          requestAnimationFrame(tick);
        })
    );
    return r;
  };
  const onScreen = await sample();
  await p.evaluate(() => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0)));
  await p.waitForTimeout(1500);
  const offScreen = await sample();
  const stopped = await p.evaluate(() => {
    const c = document.querySelector('.knot3d-stage canvas');
    return !!c;
  });
  console.log(`   إطارات/ثانية على الشاشة=${onScreen} برّاها=${offScreen} (الكانفس موجود=${stopped})`);
  await p.close();
}

// ═══ ٥) السلايدرات: تحريك عنيف ═══
console.log('\n══ السلايدرات ══');
{
  const p = await newPage();
  await p.goto(BASE + '/ar/loss/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  for (const sel of ['#l-profit', '#l-clients']) {
    const box = await p.locator(sel).boundingBox();
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await p.mouse.down();
    for (let i = 0; i < 60; i++) {
      await p.mouse.move(box.x + (box.width * (i % 20)) / 20, box.y + box.height / 2);
    }
    await p.mouse.up();
  }
  await p.waitForTimeout(1200);
  const n = await p.locator('.loss-big span').first().textContent();
  const nan = /NaN|Infinity|undefined/.test(n);
  console.log(`   الرقم بعد التحريك العنيف: ${n} ${nan ? '' : '✓'}`);
  if (nan) P('الحاسبة طلّعت رقم غير صالح: ' + n);
  await p.close();
}

// ═══ ٦) الميزانية: تحريك كل السلايدرات لأقصاها ═══
console.log('\n══ لعبة الميزانية ══');
{
  const p = await newPage();
  await p.goto(BASE + '/ar/budget/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  const n = await p.locator('.bud-range').count();
  for (let i = 0; i < n; i++) {
    const s = p.locator('.bud-range').nth(i);
    const box = await s.boundingBox();
    if (!box) continue;
    await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await p.mouse.down();
    await p.mouse.move(box.x + box.width + 200, box.y + box.height / 2);
    await p.mouse.move(box.x - 200, box.y + box.height / 2);
    await p.mouse.up();
  }
  await p.waitForTimeout(900);
  const total = await p.evaluate(() => {
    const el = [...document.querySelectorAll('*')].find((e) =>
      /\b1000\b|\b١٠٠٠\b/.test(e.childNodes.length === 1 ? e.textContent : '')
    );
    return el ? el.textContent.trim().slice(0, 40) : 'ما لقيت المجموع';
  });
  const vals = await p.evaluate(() =>
    [...document.querySelectorAll('.bud-range')].map((r) => +r.value).reduce((a, c) => a + c, 0)
  );
  console.log(`   مجموع المخصّصات بعد التعذيب = ${vals} (لازم ١٠٠٠)`);
  if (vals !== 1000) P(`مجموع الميزانية صار ${vals} بدل ١٠٠٠`);
  await p.close();
}

// ═══ ٧) تنقّل سريع جداً (نقر متتابع) ═══
console.log('\n══ تنقّل سريع ══');
{
  const p = await newPage();
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  for (let i = 0; i < 10; i++) {
    await p.locator('.pill a').nth(i % 4).click({ timeout: 5000 }).catch(() => {});
    await p.waitForTimeout(350); // ما منستنى الصفحة تخلص — عن قصد
  }
  await p.waitForTimeout(3500);
  const st = await p.evaluate(() => {
    const ST = window.__gsap?.core?.globals?.().ScrollTrigger;
    return {
      triggers: ST ? ST.getAll().length : -1,
      spacers: document.querySelectorAll('.pin-spacer').length,
      cursors: document.querySelectorAll('[data-cursor]').length,
      cursorOn: document.documentElement.hasAttribute('data-cursor-on'),
      canvases: document.querySelectorAll('canvas').length,
    };
  });
  console.log('   بعد ١٠ نقرات تنقّل سريعة:', JSON.stringify(st));
  if (st.cursors > 1) P(`تكرّر المؤشّر ${st.cursors} مرات`);
  if (!st.cursorOn) P('المؤشّر انطفى بعد التنقّل السريع');
  if (st.spacers > 4) P(`تراكمت مساحات تثبيت: ${st.spacers}`);
  await p.close();
}

// ═══ ٨) نموذج الطلب: إدخالات خبيثة ═══
console.log('\n══ نموذج الطلب ══');
{
  const p = await newPage();
  await p.goto(BASE + '/ar/brief/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);
  await p.locator('.brief-chip').first().click();
  await p.locator('.brief-nav .btn-primary').click();
  await p.waitForTimeout(700);
  const nasty = '<script>alert(1)</script> & "quotes" \'x\' \\ %00 😀';
  await p.locator('#b-biz').fill(nasty);
  await p.locator('#b-details').fill(nasty.repeat(20));
  await p.locator('.brief-nav .btn-primary').click();
  await p.waitForTimeout(700);
  const injected = await p.evaluate(() => document.querySelectorAll('script:not([src]):not([type])').length);
  const shown = await p.locator('body').innerText();
  console.log(`   سكربتات محقونة=${injected} | الصفحة لسا شغالة=${shown.length > 50 ? '✓' : '✗'}`);
  if (/alert\(1\)/.test(await p.evaluate(() => document.body.innerHTML))) {
    const asText = await p.evaluate(() => document.body.innerHTML.includes('&lt;script&gt;'));
    if (!asText) P('نص المستخدم انحقن كـ HTML مش كنص');
  }
  await p.close();
}

console.log(`\n═══ النتيجة: ${problems.length ? problems.length + ' مشكلة' : 'ما في مشاكل ✓'} ═══`);
await b.close();
