// ═══════════════════════════════════════════════════════════════
//  تصوير الموقع الحي لمشهد البرومو S6 (2026-08-04)
//
//  مش لقطات شاشة — تسجيل فيديو حقيقي للموقع المنشور والأدوات
//  بتشتغل: حاسبة الخسارة بأرقامها بتعد، ولعبة «وظّف وكيلك»
//  بتايم لاينها بينبني حدث حدث. بلا مؤشر ماوس = إحساس مستقبلي
//  إنه الموقع بيتحرك لحاله.
//
//  التشغيل: node _check/promocap.mjs
//  المخرجات: Promo/capture/cap-loss.webm و cap-agent.webm
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, renameSync, readdirSync, rmSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Promo/capture';
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

async function record(name, drive) {
  const ctx = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: OUT, size: { width: 1920, height: 1080 } },
  });
  const page = await ctx.newPage();
  await drive(page);
  await ctx.close();
  // Playwright بيسمي الملف عشوائي — منلاقيه ومنعيد تسميته
  const webm = readdirSync(OUT).find((f) => f.endsWith('.webm') && !f.startsWith('cap-'));
  renameSync(`${OUT}/${webm}`, `${OUT}/${name}.webm`);
  console.log(`✅ ${name}.webm`);
}

// ─── ١) حاسبة الخسارة: السلايدر بيمشي والأرقام بتعد ───
await record('cap-loss', async (page) => {
  await page.goto('https://ryanalali.me/ar/loss/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const calc = page.locator('.loss-result');
  await calc.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  // منمشي سلايدر الربح تدريجياً — الرقم الكبير بيعد قدام الكاميرا
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
  await page.goto('https://ryanalali.me/ar/agent/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const board = page.locator('[data-agent-day]');
  await board.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  for (const i of [0, 2, 3]) {
    await board.locator('[data-ag-task]').nth(i).click();
    await page.waitForTimeout(450);
  }
  await board.locator('[data-ag-run]').click();
  // التايم لاين بينبني حدث حدث — منصوره وهو بيصير
  await page.waitForTimeout(6500);
});

await browser.close();
console.log('المخرجات:', OUT);
