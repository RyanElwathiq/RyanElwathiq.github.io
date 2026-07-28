// شريط الأدوات الليموني المتحرك — بيضل يلف بعد التنقّل؟
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:4331';
const b = await chromium.launch();

const probe = async (p, tag) => {
  const r = await p.evaluate(async () => {
    const t = document.querySelector('.marquee-track');
    const wrap = document.querySelector('.marquee');
    if (!t) return { fatal: 'ما في .marquee-track' };
    const read = () => Math.round(new DOMMatrixReadOnly(getComputedStyle(t).transform).m41);
    const cs = getComputedStyle(t);
    const cw = getComputedStyle(wrap);
    const a = read();
    await new Promise((r) => setTimeout(r, 1400));
    const c = read();
    return {
      anim: cs.animationName,
      dur: cs.animationDuration,
      state: cs.animationPlayState,
      wrapH: Math.round(wrap.getBoundingClientRect().height),
      wrapVisible: cw.display !== 'none' && cw.visibility !== 'hidden' && cw.opacity !== '0',
      spans: t.children.length,
      from: a,
      to: c,
      moved: Math.abs(c - a),
    };
  });
  if (r.fatal) return console.log(`${tag.padEnd(28)} ✗ ${r.fatal}`);
  console.log(
    `${tag.padEnd(28)} anim=${r.anim} state=${r.state} spans=${r.spans} h=${r.wrapH} ` +
      `x:${r.from}→${r.to} (${r.moved}px)  ${r.moved > 5 ? '✓ بيلف' : '✗ واقف'}`
  );
};

const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
p.on('pageerror', (e) => console.log('  PAGEERROR:', e.message));

const toMarquee = async () => {
  await p.evaluate(() => {
    const y = document.querySelector('.marquee').getBoundingClientRect().top + scrollY - 300;
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
  });
  await p.waitForTimeout(900);
};

await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2800);
await toMarquee();
await probe(p, '1. تحميل مباشر');

// ضغطة لوجو وإنت عالرئيسية
for (let i = 1; i <= 3; i++) {
  await p.evaluate(() => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0)));
  await p.waitForTimeout(400);
  await p.locator('.pill .brand').click();
  await p.waitForTimeout(2800);
  await toMarquee();
  await probe(p, `${i + 1}. ضغطة لوجو ${i}`);
}

// رجوع من صفحة ثانية
await p.goto(BASE + '/ar/signals/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
await p.locator('.pill .brand').click();
await p.waitForTimeout(3000);
await toMarquee();
await probe(p, '5. رجوع من إشارات');

// إنجليزي
await p.goto(BASE + '/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2800);
await toMarquee();
await probe(p, '6. إنجليزي مباشر');
await p.locator('.pill .brand').click();
await p.waitForTimeout(2800);
await toMarquee();
await probe(p, '7. إنجليزي بعد لوجو');

await b.close();
