// فحص #60: البكجات ما فيها خدمات «قريباً» + الرقاقات بتوصل لصفحات موجودة
//   node _check/packs60.mjs [رابط]
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const BASE = process.argv[2] || 'http://localhost:4330';
const SOON = ['data-analysis', 'ai-agents-automation']; // خدمات لسا مش مقدَّمة
mkdirSync('_check/out', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

let fail = 0;
for (const path of ['/ar/services/', '/services/']) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  const packs = await page.evaluate(() =>
    [...document.querySelectorAll('.pack')].map((p) => ({
      name: p.querySelector('h3')?.textContent?.trim() || '؟',
      chips: [...p.querySelectorAll('a')].map((a) => ({
        label: a.textContent.trim(),
        href: a.getAttribute('href') || '',
      })),
    })),
  );

  console.log(`\n${path} — ${packs.length} بكجات:`);
  for (const p of packs) {
    const bad = p.chips.filter((c) => SOON.some((s) => c.href.includes('/' + s + '/')));
    const broken = [];
    for (const c of p.chips) {
      const r = await page.request.get(BASE + c.href);
      if (!r.ok()) broken.push(`${c.label} → ${r.status()}`);
    }
    const ok = !bad.length && !broken.length;
    if (!ok) fail++;
    console.log(
      `  ${ok ? '✅' : '❌'} ${p.name}: ${p.chips.map((c) => c.label).join(' · ')}` +
        (bad.length ? `  ⚠️ خدمة قريباً: ${bad.map((c) => c.label).join(', ')}` : '') +
        (broken.length ? `  ⚠️ رابط مكسور: ${broken.join(', ')}` : ''),
    );
  }
}

// لقطة لقسم البكجات بالعربي
await page.goto(BASE + '/ar/services/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.querySelector('.packs')?.scrollIntoView({ block: 'start' }));
await page.waitForTimeout(900);
await page.screenshot({ path: '_check/out/d60-packs-final.png' });

console.log(fail ? `\n❌ ${fail} مشاكل` : '\n✅ البكجات نظيفة: بلا خدمات قريباً، وكل الروابط شغالة');
await browser.close();
process.exit(fail ? 1 : 0);
