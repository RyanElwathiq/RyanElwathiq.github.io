// ═══════════════════════════════════════════════════════════════
//  شو بيتغيّر بالصفحة الرئيسية بين «تحميل مباشر» و«رجوع باللوجو»؟
//  منقيس كل قسم: ارتفاعه، شفافيته، وإذا في حركة شغالة عليه.
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:4331';
const b = await chromium.launch();

const snapshot = (p) =>
  p.evaluate(() => {
    const out = {};
    document.querySelectorAll('main > section, main > div, [data-hpan], .marquee-track, .track, .film, canvas').forEach((el) => {
      const key =
        (el.id ? '#' + el.id : '') + el.tagName + '.' + String(el.className).split(' ').slice(0, 2).join('.');
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      out[key] = {
        h: Math.round(r.height),
        w: Math.round(r.width),
        op: cs.opacity,
        disp: cs.display,
        vis: cs.visibility,
        anim: cs.animationName,
        playState: cs.animationPlayState,
        transform: cs.transform === 'none' ? 'none' : 'set',
      };
    });
    const ST = window.__gsap?.core?.globals?.().ScrollTrigger;
    out.__meta = {
      docHeight: document.documentElement.scrollHeight,
      triggers: ST ? ST.getAll().length : -1,
      pinned: ST ? ST.getAll().filter((t) => t.pin).length : -1,
      pinSpacers: document.querySelectorAll('.pin-spacer').length,
      lenis: !!window.__lenis,
      htmlClass: document.documentElement.className,
      islands: document.querySelectorAll('astro-island').length,
      hydrated: [...document.querySelectorAll('astro-island')].filter((i) => !i.hasAttribute('ssr')).length,
    };
    return out;
  });

const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', (e) => console.log('  PAGEERROR:', e.message));
p.on('console', (m) => m.type() === 'error' && console.log('  CONSOLE:', m.text()));

await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
const before = await snapshot(p);

await p.goto(BASE + '/ar/signals/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1600);
await p.locator('.pill .brand').click();
await p.waitForTimeout(3500);
console.log('رجعنا على:', new URL(p.url()).pathname, '\n');
const after = await snapshot(p);

const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])];
let diffs = 0;
for (const k of keys) {
  const a = before[k];
  const c = after[k];
  if (!a) { console.log(`+ ظهر جديد : ${k}`); diffs++; continue; }
  if (!c) { console.log(`- اختفى    : ${k}  ${JSON.stringify(a)}`); diffs++; continue; }
  const changed = Object.keys(a).filter((f) => String(a[f]) !== String(c[f]));
  if (changed.length) {
    console.log(`~ تغيّر     : ${k}`);
    changed.forEach((f) => console.log(`             ${f}: ${a[f]}  →  ${c[f]}`));
    diffs++;
  }
}
console.log(diffs ? `\n${diffs} فرق` : '\nما في أي فرق');
await b.close();
