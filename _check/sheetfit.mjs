// ═══════════════════════════════════════════════════════════════
//  فحص: هل قائمة الموبايل بتضبط بالشاشة وكل مجموعاتها بتوصلها؟
//
//  المشكلة اللي رصدها ريّان: عنوان «خدماتي» ما كان يبين.
//  السبب: .sheet كان عليها justify-content: center بلا overflow.
//  لما المحتوى يطول عن الشاشة، التوسيط بيوزّع الزيادة فوق وتحت،
//  **والجزء اللي فوق بيصير غير قابل للوصول** — ولا سكرول بيوصله.
//
//  الفحص بيتأكد من ثلاثة أشياء على مقاسات تلفونات حقيقية:
//   ١. ولا مجموعة فوق حدّ الشاشة وهي غير قابلة للتمرير
//   ٢. عنوان كل مجموعة ظاهر وبلونه الصح (ليموني)
//   ٣. القائمة بتفتح من فوق مش من وين وقفت آخر مرة
//
//  التشغيل:  node _check/sheetfit.mjs http://localhost:4321
// ═══════════════════════════════════════════════════════════════
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://localhost:4321';
const ACCENT = 'rgb(217, 255, 63)';

// تلفونات حقيقية — الأول أقصر شاشة شائعة، والأخير أطول
const PHONES = [
  { name: 'iPhone SE', w: 375, h: 667 },
  { name: 'iPhone 12', w: 390, h: 844 },
  { name: 'Galaxy S20', w: 360, h: 800 },
];

const browser = await chromium.launch();
let fails = 0;

for (const lang of ['/ar/', '/']) {
  for (const p of PHONES) {
    const page = await browser.newPage({ viewport: { width: p.w, height: p.h } });
    await page.goto(BASE + lang, { waitUntil: 'networkidle' });

    await page.click('[data-menu-open]');
    await page.waitForTimeout(700);

    const r = await page.evaluate((accent) => {
      const sheet = document.querySelector('[data-menu]');
      const groups = [...document.querySelectorAll('.sheet-group')];
      const sheetBox = sheet.getBoundingClientRect();

      return {
        scrollTop: sheet.scrollTop,
        scrollable: sheet.scrollHeight > sheet.clientHeight,
        overflowPx: sheet.scrollHeight - sheet.clientHeight,
        groups: groups.map((g) => {
          const title = g.querySelector('.sheet-title');
          const tb = title.getBoundingClientRect();
          return {
            name: title.textContent.trim(),
            // فوق حدّ الشاشة وما بينوصله؟ (بالنسبة للقائمة نفسها)
            aboveTop: tb.top < sheetBox.top - 1,
            color: getComputedStyle(title).color,
            links: g.querySelectorAll('a').length,
          };
        }),
      };
    }, ACCENT);

    const cut = r.groups.filter((g) => g.aboveTop);
    const wrongColor = r.groups.filter((g) => g.color !== ACCENT);
    const ok = cut.length === 0 && wrongColor.length === 0 && r.scrollTop === 0;
    if (!ok) fails++;

    console.log(
      `${ok ? '✅' : '❌'} ${lang.padEnd(5)} ${p.name.padEnd(11)} ${p.w}×${p.h}  ` +
        `مجموعات:${r.groups.length}  ` +
        `${r.scrollable ? `بتنسكرل +${r.overflowPx}px` : 'بتزبط كاملة'}  ` +
        `تبدأ من:${r.scrollTop}` +
        (cut.length ? `  ⚠️ مقصوص فوق: ${cut.map((g) => g.name).join('، ')}` : '') +
        (wrongColor.length ? `  ⚠️ لون غلط: ${wrongColor.map((g) => g.name).join('، ')}` : ''),
    );

    await page.close();
  }
}

await browser.close();
console.log(fails ? `\n❌ ${fails} حالة فشلت` : '\n✅ كل الحالات نجحت');
process.exit(fails ? 1 : 0);
