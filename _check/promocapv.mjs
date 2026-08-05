// ═══════════════════════════════════════════════════════════════
//  تصوير الموقع الحي للنسخة العمودية 9:16 (2026-08-04)
//
//  نفس promocap.mjs بس بشاشة موبايل عمودية: منصور بعرض 720
//  (تخطيط الموبايل الحقيقي للموقع) والفيديو بينسجل 1080×1920.
//
//  التشغيل: node _check/promocapv.mjs
//  المخرجات: Promo/capture-v/cap-loss.webm و cap-agent.webm
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, renameSync, readdirSync, rmSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Promo/capture-v';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function record(name, drive) {
  const ctx = await browser.newContext({
    // ⚠️ بلاي رايت ما بيكبّر — لو حجم الفيديو أكبر من الشاشة بيحط
    // رمادي حواليها. منسجل بالحجم الطبيعي والمونتاج بيكبّر لـ 1080.
    viewport: { width: 720, height: 1280 },
    recordVideo: { dir: OUT, size: { width: 720, height: 1280 } },
  });
  const page = await ctx.newPage();
  await drive(page);
  await ctx.close();
  const webm = readdirSync(OUT).find((f) => f.endsWith('.webm') && !f.startsWith('cap-'));
  renameSync(`${OUT}/${webm}`, `${OUT}/${name}.webm`);
  console.log(`✅ ${name}.webm`);
}

// ─── ١) حاسبة الخسارة: السلايدر بيمشي والأرقام بتعد ───
await record('cap-loss', async (page) => {
  await page.goto('https://ryanalali.me/ar/loss/', { waitUntil: 'load' });
  await page.waitForTimeout(2500);
  const calc = page.locator('.loss-result');
  await calc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.evaluate(async () => {
    const s = document.getElementById('l-profit');
    const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    const from = Number(s.value);
    for (let i = 1; i <= 24; i++) {
      set.call(s, from + Math.round(((3000 - from) / 24) * i));
      s.dispatchEvent(new Event('input', { bubbles: true }));
      s.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((r) => setTimeout(r, 130));
    }
  });
  await page.waitForTimeout(2500);
});

// ─── ٢) لعبة «وظّف وكيلك»: اختيار مهام وتشغيل اليوم ───
await record('cap-agent', async (page) => {
  await page.goto('https://ryanalali.me/ar/agent/', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  const board = page.locator('[data-agent-day]');
  await board.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  for (const i of [0, 2, 3]) {
    await board.locator('[data-ag-task]').nth(i).click();
    await page.waitForTimeout(450);
  }
  await board.locator('[data-ag-run]').click();
  await page.waitForTimeout(6500);
});

await browser.close();
console.log('المخرجات:', OUT);
