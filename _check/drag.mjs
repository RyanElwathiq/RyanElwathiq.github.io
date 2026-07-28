// ═══════════════════════════════════════════════════════════════
//  كل إشي بينسحب بالموقع: هل الدائرة بتلحق الإصبع وقت السحب؟
//  (المشكلة اللي لقاها ريّان بحبل اللمبة — منفحص كل الباقي كمان)
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();

const dotPos = (p) =>
  p.evaluate(() => {
    const d = document.querySelector('[data-cursor-dot]');
    if (!d) return null;
    const m = new DOMMatrixReadOnly(getComputedStyle(d).transform);
    return { x: Math.round(m.m41), y: Math.round(m.m42) };
  });

const test = async (name, path, sel, dx, dy) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', (e) => console.log('   PAGEERROR:', e.message.slice(0, 90)));
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.mouse.move(700, 400);
  await p.waitForTimeout(1200);

  const el = p.locator(sel).first();
  await p.evaluate((s) => {
    const e = document.querySelector(s);
    if (!e) return;
    const y = e.getBoundingClientRect().top + scrollY - 320;
    window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
  }, sel);
  await p.waitForTimeout(1600);

  const box = await el.boundingBox();
  if (!box) { console.log(`${name.padEnd(24)} ✗ ما لقيت ${sel}`); await p.close(); return; }

  const sx = box.x + box.width / 2;
  const sy = box.y + box.height / 2;
  await p.mouse.move(sx, sy);
  await p.waitForTimeout(300);
  const before = await dotPos(p);

  // السحبة
  await p.mouse.down();
  for (let i = 1; i <= 8; i++) {
    await p.mouse.move(sx + (dx * i) / 8, sy + (dy * i) / 8);
    await p.waitForTimeout(45);
  }
  await p.waitForTimeout(200);
  const during = await dotPos(p);
  await p.mouse.up();
  await p.waitForTimeout(200);

  const want = { x: Math.round(sx + dx), y: Math.round(sy + dy) };
  const off = Math.round(Math.hypot(during.x - want.x, during.y - want.y));
  console.log(
    `${name.padEnd(24)} بداية(${before.x},${before.y}) → وقت السحب(${during.x},${during.y})` +
      ` المفروض(${want.x},${want.y}) فرق=${off}px  ${off < 12 ? '✓ بتلحق' : '✗ عالقة'}`
  );
  await p.close();
};

await test('حبل اللمبة', '/ar/', '[data-cord]', 0, 120);
await test('العقدة ثلاثية الأبعاد', '/ar/', '.knot3d canvas', 160, 60);
await test('سلايدر الميزانية', '/ar/', '.bud-range', 120, 0);
await test('سلايدر الخسارة', '/ar/loss/', '#l-profit', 120, 0);
await test('شريط الفيديو', '/ar/', '[data-hpan-track]', -150, 0);

await b.close();
