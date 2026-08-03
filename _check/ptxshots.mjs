// لقطات نهائية لمقالة #61 — ديسكتوب + موبايل
//   node _check/ptxshots.mjs [رابط]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.argv[2] || 'http://localhost:4330';
const URL = BASE + '/ar/signals/ar-baakaj-am-numow/';
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();

// ─── ديسكتوب: أعلى المقال ───
const d = await browser.newPage({ viewport: { width: 1440, height: 950 } });
await d.goto(URL, { waitUntil: 'networkidle' });
await d.evaluate(() => window.scrollTo(0, 0));
await d.waitForTimeout(900);
await d.screenshot({ path: '_check/out/d61-top.png' });

// ديسكتوب: اللعبة بعد الترجمة (العرض الشائع)
const board = d.locator('[data-pack-translator]');
await board.scrollIntoViewIfNeeded();
await d.waitForTimeout(600);
await board.locator('[data-ptx-preset]').first().click();
await board.locator('[data-ptx-go]').click();
await d.waitForTimeout(3600);
await board.screenshot({ path: '_check/out/d61-verdict.png' });
await d.close();

// ─── موبايل: اللعبة قبل وبعد ───
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(URL, { waitUntil: 'networkidle' });
const mb = m.locator('[data-pack-translator]');
await mb.scrollIntoViewIfNeeded();
await m.waitForTimeout(900);
await mb.screenshot({ path: '_check/out/d61-mobile-build.png' });
await mb.locator('[data-ptx-preset]').first().click();
await mb.locator('[data-ptx-go]').click();
await m.waitForTimeout(3600);
await mb.screenshot({ path: '_check/out/d61-mobile-verdict.png' });

// موبايل: تمرير أفقي؟
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log(overflow > 1 ? `❌ تمرير أفقي عالموبايل: ${overflow}px` : '✅ ولا تمرير أفقي عالموبايل');
await m.close();

await browser.close();
console.log('✅ اللقطات بـ _check/out/');
