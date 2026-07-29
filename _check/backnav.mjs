// ═══════════════════════════════════════════════════════════════
//  أنيميشن قسم المواقع بيتعطّل بعد زر الرجوع؟
//  منقيس: هل الفيديو بيتحرّك مع السكرول قبل وبعد الرجوع
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', (e) => console.log('   PAGEERROR:', e.message.slice(0, 100)));

// بيقيس: هل الكانفاس بيتغيّر محتواه مع السكرول جوّا نطاق السيكوينس؟
const probe = async (tag) => {
  const r = await p.evaluate(async () => {
    const ST = window.__gsap?.core?.globals?.().ScrollTrigger;
    const secs = [...document.querySelectorAll('[data-seq]')];
    if (!secs.length) return { fatal: 'ما لقيت أي data-seq' };
    const ST2 = ST;
    const all2 = ST2 ? ST2.getAll() : [];
    const jump = (y) =>
      new Promise((res) => {
        window.__lenis ? window.__lenis.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y);
        setTimeout(res, 650);
      });
    const snapOf = (canvas) => {
      const c = document.createElement('canvas');
      c.width = 40; c.height = 24;
      c.getContext('2d').drawImage(canvas, 0, 0, 40, 24);
      return c.getContext('2d').getImageData(0, 0, 40, 24).data.join(',').slice(0, 400);
    };
    const out = [];
    for (const sec of secs) {
      const canvas = sec.querySelector('canvas');
      const st = all2.find((t) => t.trigger === sec || t.pin === sec);
      const name = sec.className.split(' ')[0] || sec.id || '?';
      if (!st || !canvas) { out.push({ name, ok: false, why: !st ? 'ما في تريجر' : 'ما في كانفاس' }); continue; }
      await jump(st.start + 20);
      const a = snapOf(canvas);
      await jump(st.start + (st.end - st.start) * 0.6);
      const c = snapOf(canvas);
      out.push({ name, ok: a !== c, range: Math.round(st.end - st.start), top: Math.round(sec.getBoundingClientRect().top + scrollY) });
    }
    return { triggers: all2.length, pinned: all2.filter(t=>t.pin).length, seqs: out };
  });

  if (r.fatal) { console.log(`${tag.padEnd(22)} ✗ ${r.fatal}`); return r; }
  console.log(`${tag.padEnd(22)} triggers=${r.triggers} pin=${r.pinned}`);
  r.seqs.forEach((s) =>
    console.log(`     ${(s.name||'?').padEnd(12)} ${s.ok ? '✓ بيتحرّك' : '✗ واقف' + (s.why ? ' ('+s.why+')' : '')}${s.range ? '  range='+s.range : ''}`)
  );
  return r;
};

// ١) تحميل مباشر للصفحة الرئيسية
await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
await probe('1. تحميل مباشر');

// ٢) روح لصفحة ثانية بالضغط، وبعدين زر الرجوع
await p.evaluate(() => (window.__lenis ? window.__lenis.scrollTo(0, { immediate: true }) : scrollTo(0, 0)));
await p.waitForTimeout(500);
await p.locator('.pill a[href*="websites"], .pill a[href*="signals"]').first().click();
await p.waitForTimeout(2500);
console.log('   (رحنا على ' + new URL(p.url()).pathname + ')');
await p.goBack();
await p.waitForTimeout(4000);
console.log('   (رجعنا على ' + new URL(p.url()).pathname + ')');
await probe('2. بعد زر الرجوع');

// ٣) رجوع ثاني
await p.locator('.pill a[href*="websites"], .pill a[href*="signals"]').first().click();
await p.waitForTimeout(2200);
await p.goBack();
await p.waitForTimeout(4000);
await probe('3. رجوع ثاني');

await p.screenshot({ path: '_check/out/backnav.png' });
await b.close();
