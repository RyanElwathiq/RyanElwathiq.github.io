// ═══════════════════════════════════════════════════════════════
//  فحص: هل الفورم مركّب بصفحة الخدمة والخدمة مختارة سلفاً؟
//
//  ليش سكربت لحاله بدل الفحص من لوحة المتصفح؟ لأنه الفورم
//  بيتحمّل client:visible — يعني Astro بيستنى IntersectionObserver
//  يقول إنه ظهر بالشاشة. اللوحة المخفية ما بترسم إطارات فالمراقب
//  ما بينادى أبداً، والفورم بيضل SSR للأبد. Playwright بيفتح
//  متصفح حقيقي بيرسم فعلاً، فالمراقب بيشتغل صح.
//
//  ⚠️ ما غيّرنا التحميل لـ eager عشان نسهّل الفحص — التحميل عند
//     الظهور هو الصح: React ما بينزّل إلا لمن وصل للفورم، وسرعة
//     الصفحة جزء من ترتيب جوجل. الفحص بيتكيّف مع الكود، مش العكس.
//
//  التشغيل:  node _check/svcform.mjs http://localhost:4321
// ═══════════════════════════════════════════════════════════════
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:4321';

// المتوقّع: معرّف الخدمة ← النص اللي لازم ينختار بالفورم
const CASES = [
  { path: '/ar/services/paid-ads/', expect: 'إعلانات مدفوعة' },
  { path: '/ar/services/seo/', expect: 'تحسين محركات البحث (SEO)' },
  { path: '/ar/services/websites/', expect: 'موقع إلكتروني' },
  { path: '/services/video-editing/', expect: 'Video editing' },
  { path: '/services/consulting/', expect: 'Consulting or training' },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

let pass = 0;
const fails = [];

for (const c of CASES) {
  await page.goto(BASE + c.path, { waitUntil: 'networkidle' });

  // ننزل لقسم الفورم عشان المراقب يشتغل ويتحمّل
  await page.locator('#brief').scrollIntoViewIfNeeded();

  // منستنى الجزيرة تخلص تركيب (بتشيل خاصية ssr)
  await page
    .waitForFunction(
      () => {
        const i = [...document.querySelectorAll('astro-island')].find((x) =>
          (x.getAttribute('component-url') || '').includes('Brief'),
        );
        return i && !i.hasAttribute('ssr');
      },
      { timeout: 15000 },
    )
    .catch(() => {});

  const got = await page.$$eval('.brief-chip', (els) =>
    els.filter((e) => e.getAttribute('aria-pressed') === 'true').map((e) => e.textContent.trim()),
  );
  const total = await page.$$eval('.brief-chip', (e) => e.length);

  const ok = total > 0 && got.length === 1 && got[0] === c.expect;
  if (ok) pass++;
  else fails.push({ ...c, got, total });

  console.log(`${ok ? '✅' : '❌'}  ${c.path.padEnd(30)} → ${got.join('، ') || '(ولا وحدة)'}`);
}

console.log(`\n${pass}/${CASES.length} نجحت`);
if (fails.length) {
  console.log('\nالفشل:');
  fails.forEach((f) => console.log(`  ${f.path}: توقّعنا «${f.expect}» وإجانا [${f.got}] من ${f.total} خيار`));
}

await browser.close();
process.exit(fails.length ? 1 : 0);
