// الحالة اللي وصفها ريّان: إنت أصلاً عالصفحة الرئيسية وبتضغط اللوجو
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:4331';
const b = await chromium.launch();

const probe = async (p, tag) => {
  const r = await p.evaluate(async () => {
    const ST = window.__gsap?.core?.globals?.().ScrollTrigger;
    const wrap = document.querySelector('[data-hpan]');
    const track = document.querySelector('[data-hpan-track]');
    if (!ST || !wrap || !track) return { fatal: `ST=${!!ST} wrap=${!!wrap} track=${!!track}` };
    const st = ST.getAll().find((t) => t.trigger === wrap || t.pin === wrap);
    const read = () => Math.round(new DOMMatrixReadOnly(getComputedStyle(track).transform).m41);
    const jump = (y) =>
      new Promise((res) => {
        window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
        setTimeout(res, 650);
      });
    const meta = {
      triggers: ST.getAll().length,
      pinned: ST.getAll().filter((t) => t.pin).length,
      spacers: document.querySelectorAll('.pin-spacer').length,
      docH: document.documentElement.scrollHeight,
      found: !!st,
    };
    if (!st) return meta;
    await jump(st.start + 5);
    const a = read();
    await jump(st.start + (st.end - st.start) * 0.7);
    const c = read();
    return { ...meta, range: Math.round(st.end - st.start), from: a, to: c, delta: Math.abs(c - a) };
  });
  if (r.fatal) return console.log(`${tag.padEnd(30)} ✗ ${r.fatal}`);
  console.log(
    `${tag.padEnd(30)} trig=${r.triggers} pin=${r.pinned} spacers=${r.spacers} docH=${r.docH}` +
      (r.found ? ` range=${r.range} pan=${r.delta}px` : ' panTrigger=MISSING') +
      `  ${r.found && r.delta > 30 ? '✓' : '✗'}`
  );
};

const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', (e) => console.log('  PAGEERROR:', e.message));
p.on('console', (m) => m.type() === 'error' && console.log('  CONSOLE:', m.text()));

await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
await probe(p, '1. تحميل مباشر');

// ═══ اضغط اللوجو وإنت أصلاً عالرئيسية ═══
for (let i = 2; i <= 4; i++) {
  await p.evaluate(() => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0)));
  await p.waitForTimeout(500);
  await p.locator('.pill .brand').click();
  await p.waitForTimeout(3200);
  await probe(p, `${i}. ضغطة لوجو رقم ${i - 1}`);
}

// ═══ زر أنكور #top ═══
await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
const anchors = await p.locator('a[href$="#top"]').count();
console.log(`   (روابط #top: ${anchors})`);
if (anchors) {
  await p.locator('a[href$="#top"]').first().click();
  await p.waitForTimeout(2500);
  await probe(p, '5. بعد زر #top');
}

await b.close();
