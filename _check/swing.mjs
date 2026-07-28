// اللمبة بتروح مع الإيد ولا عكسها؟
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:4331/ar/', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
await p.evaluate(() => { const el=document.querySelector('#lab'); const y=el.getBoundingClientRect().top+scrollY; window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y); });
await p.waitForTimeout(1600);

const bulbX = () => p.evaluate(() => Math.round(document.querySelector('.bulb').getBoundingClientRect().left));
const box = await p.locator('[data-cord]').boundingBox();
const cx = box.x + box.width/2, cy = box.y + box.height/2;

for (const [dir, dx] of [['يمين', 120], ['شمال', -120]]) {
  await p.mouse.move(cx, cy);
  await p.mouse.down();
  const before = await bulbX();
  for (let i=1;i<=8;i++) await p.mouse.move(cx + dx*i/8, cy + 10);
  await p.waitForTimeout(300);
  const after = await bulbX();
  const moved = after - before;
  const ok = (dx > 0 && moved > 8) || (dx < 0 && moved < -8);
  console.log(`سحب لل${dir.padEnd(5)}: اللمبة تحركت ${moved > 0 ? 'يمين' : 'شمال'} ${Math.abs(moved)}px  ${ok ? '✓ مع الإيد' : '✗ عكس الإيد'}`);
  await p.mouse.up();
  await p.waitForTimeout(1500);
}
await b.close();
