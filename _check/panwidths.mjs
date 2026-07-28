// الكاروسيل على عروض شاشات مختلفة — قبل وبعد الرجوع باللوجو
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:4331';
const WIDTHS = [1024, 1152, 1280, 1366, 1440, 1600, 1920, 2560];
const b = await chromium.launch();

for (const w of WIDTHS) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  const errs = [];
  p.on('pageerror', (e) => errs.push(e.message));

  const measure = async () =>
    p.evaluate(async () => {
      const ST = window.__gsap?.core?.globals?.().ScrollTrigger;
      const wrap = document.querySelector('[data-hpan]');
      const track = document.querySelector('[data-hpan-track]');
      const st = ST?.getAll().find((t) => t.trigger === wrap || t.pin === wrap);
      if (!st) return { pinned: false, cards: track?.children.length };
      const read = () => Math.round(new DOMMatrixReadOnly(getComputedStyle(track).transform).m41);
      const jump = (y) =>
        new Promise((r) => {
          window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
          setTimeout(r, 600);
        });
      await jump(st.start + 5);
      const a = read();
      await jump(st.end - 5);
      const c = read();
      return { pinned: true, cards: track.children.length, range: Math.round(st.end - st.start), pan: Math.abs(c - a) };
    });

  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  const fresh = await measure();

  await p.evaluate(() => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0)));
  await p.waitForTimeout(400);
  await p.locator('.pill .brand').click();
  await p.waitForTimeout(3000);
  const back = await measure();

  const fmt = (r) => (r.pinned ? `مثبّت range=${r.range} سحب=${r.pan}px` : `قسم عادي (${r.cards} بطاقات)`);
  const same = JSON.stringify(fresh) === JSON.stringify(back);
  console.log(
    `${String(w).padStart(4)}px  أول: ${fmt(fresh).padEnd(30)} بعد الرجوع: ${fmt(back).padEnd(30)}` +
      ` ${same ? '✓ نفسه' : '✗ اختلف'}${errs.length ? ' ⚠️ ' + errs[0] : ''}`
  );
  await p.close();
}
await b.close();
