// ═══════════════════════════════════════════════════════════════
//  تداخل الأقسام — القياس **أثناء** الانتقال مش بعده
//
//  ليش؟ لأنه فحص overlap.mjs بيقيس بعد ما تستقر الصفحة، وطلع
//  نظيف بكل المسارات. بس اللي ريّان بيشوفه ممكن يكون وميض
//  بيروح — يعني الأقسام بتركب فوق بعض لجزء من ثانية أثناء
//  الانتقال، وبعدين بترجع مظبوطة قبل ما أي فحص يمسكها.
//
//  فهون منراقب باستمرار (كل ~١٠٠ملي) من قبل الضغط لحد بعد
//  ما تخلص الصفحة الجديدة، ومنسجّل أي لحظة فيها تداخل.
//
//  + منبطّئ المعالج ٤ أضعاف عشان نحاكي موبايل حقيقي — الأعطال
//    اللي سببها سباق توقيت بتظهر عالأجهزة البطيئة بس.
//
//  التشغيل: node _check/overlap-live.mjs [رابط]
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const base = process.argv[2] || 'http://localhost:4461';
const browser = await chromium.launch();

// المراقب بينحقن بالصفحة وبيضل يسجّل حتى وقت الانتقال
const WATCH = `(() => {
  if (window.__watch) return;
  window.__watch = [];
  const tick = () => {
    try {
      const secs = [...document.querySelectorAll('main > section, main > div.container')]
        .map(s => {
          const r = s.getBoundingClientRect();
          return { id: s.id || s.className.split(' ')[0], top: r.top + scrollY, bottom: r.bottom + scrollY, h: r.height };
        })
        .filter(b => b.h > 40);
      const bad = [];
      for (let i = 0; i < secs.length - 1; i++) {
        const gap = secs[i + 1].top - secs[i].bottom;
        if (gap < -24) bad.push(secs[i].id + ' ↔ ' + secs[i + 1].id + ' ' + Math.round(gap) + 'px');
      }
      if (bad.length) window.__watch.push({ t: Math.round(performance.now()), n: secs.length, bad });
    } catch (e) {}
  };
  setInterval(tick, 100);
  tick();
})()`;

async function watchRun(size, name, steps) {
  const page = await browser.newPage({ viewport: size });
  // المراقب بينحقن على كل صفحة جديدة كمان — عشان يشتغل بعد الانتقال
  await page.addInitScript(WATCH);

  // تبطيء المعالج ٤× (موبايل متوسط)
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));

  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  try {
    await steps(page);
  } catch (e) {
    /* لو فشلت خطوة، منكمّل ونشوف شو انسجّل */
  }
  await page.waitForTimeout(3200);

  const hits = await page.evaluate(() => window.__watch || []);
  await page.close();

  const tag = size.width < 500 ? 'موبايل ' : 'كمبيوتر';
  if (hits.length) {
    console.log(`  ⚠️ ${tag} ${name} — ${hits.length} لحظة فيها تداخل`);
    hits.slice(0, 4).forEach((h) => console.log(`       ${h.t}ms · ${h.n} قسم · ${h.bad.slice(0, 2).join(' | ')}`));
  } else {
    console.log(`  ✓  ${tag} ${name}`);
  }
  if (errs.length) console.log(`       ✗ ${errs[0].slice(0, 80)}`);
  return hits.length;
}

const wait = (p, ms) => p.waitForTimeout(ms);

const scenarios = [
  [
    'ضغط رابط ثم رجوع    ',
    async (p) => {
      await p.locator('a[href$="/designs/"]').first().click({ force: true });
      await wait(p, 2600);
      await p.goBack();
    },
  ],
  [
    'نزول ثم رابط ثم رجوع',
    async (p) => {
      await p.evaluate(() => scrollTo(0, document.body.scrollHeight * 0.6));
      await wait(p, 1600);
      await p.locator('a[href*="/work/"]').first().click({ force: true });
      await wait(p, 2600);
      await p.goBack();
    },
  ],
  [
    'رجوع سريع (بلا انتظار)',
    async (p) => {
      await p.locator('a[href$="/videos/"]').first().click({ force: true });
      await wait(p, 700); // ⚠️ بنرجع قبل ما تخلص — هون بتصير السباقات
      await p.goBack();
    },
  ],
  [
    'ثلاث انتقالات سريعة  ',
    async (p) => {
      for (const h of ['/designs/', '/videos/', '/websites/']) {
        await p.goto(base + h, { waitUntil: 'commit' });
        await wait(p, 900);
      }
      await p.goBack();
      await wait(p, 900);
      await p.goBack();
    },
  ],
];

console.log('\n═══ تداخل أثناء الانتقال (معالج مبطّأ ٤×) ═══\n');
let total = 0;
for (const size of [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
]) {
  for (const [name, steps] of scenarios) total += await watchRun(size, name, steps);
  console.log();
}

console.log(total === 0 ? '✓ ما ظهر تداخل ولا بلحظة وحدة\n' : `⚠️ ${total} لحظة تداخل\n`);
await browser.close();
