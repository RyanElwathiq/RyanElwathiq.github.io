// ═══════════════════════════════════════════════════════════════
//  فحص شامل — «العميل الزنخ»
//  بيدوّر على كل خلل ممكن: أخطاء، صور مكسورة، نصوص مقصوصة،
//  عناصر بتتراكم مع التنقّل، أزرار ما بتشتغل، مشاكل وصولية…
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';

const BASE = process.argv[2] || 'http://localhost:4331';
const b = await chromium.launch();
const findings = [];
const add = (sev, area, msg) => findings.push({ sev, area, msg });

const PAGES = [
  '/', '/ar/',
  '/videos/', '/ar/videos/',
  '/marketing/', '/ar/marketing/',
  '/designs/', '/ar/designs/',
  '/websites/', '/ar/websites/',
  '/signals/', '/ar/signals/',
  '/budget/', '/ar/budget/',
  '/loss/', '/ar/loss/',
  '/brief/', '/ar/brief/',
  '/signals/en-why-every-business-needs-a-website/',
  '/ar/signals/ar-limatha-almawqi3-daroura/',
];

// ─────────────────────────────────────────────
//  ١) فحص كل صفحة: أخطاء، صور، ميتا، وصولية
// ─────────────────────────────────────────────
for (const path of PAGES) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  const bad = [];
  p.on('pageerror', (e) => errs.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  p.on('response', (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));

  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);

  errs.forEach((e) => add('BUG', path, 'خطأ جافاسكربت: ' + e.slice(0, 140)));
  bad.forEach((e) => add('BUG', path, 'ملف ما تحمّل: ' + e.slice(0, 140)));

  const r = await p.evaluate(() => {
    const out = { imgs: [], meta: {}, a11y: [], text: [] };

    // صور مكسورة أو بدون وصف
    document.querySelectorAll('img').forEach((im) => {
      if (im.complete && im.naturalWidth === 0) out.imgs.push('مكسورة: ' + im.src.split('/').pop());
      if (!im.hasAttribute('alt')) out.imgs.push('بدون alt: ' + im.src.split('/').pop());
      // العناصر المثبّتة (النافبار) لازم تكون eager مش lazy — منتجاهلها
      const fixed = im.closest('header, nav, [class*="pill"], [class*="bar"]');
      if (!im.getAttribute('loading') && !fixed && im.getBoundingClientRect().top > innerHeight)
        out.imgs.push('بدون lazy: ' + im.src.split('/').pop());
    });

    // ميتا
    out.meta = {
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content || '',
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      og: !!document.querySelector('meta[property="og:image"]'),
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      h1: document.querySelectorAll('h1').length,
    };

    // أزرار وروابط بدون اسم مقروء
    document.querySelectorAll('a, button').forEach((el) => {
      const name = (el.innerText || '').trim() || el.getAttribute('aria-label') || el.title || '';
      if (!name && !el.querySelector('img[alt]:not([alt=""])'))
        out.a11y.push(el.tagName + '.' + String(el.className).slice(0, 34));
    });

    // نصوص مقصوصة (المحتوى أطول من الصندوق)
    document.querySelectorAll('h1,h2,h3,p,span,a,button,li').forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.overflow === 'visible' && cs.textOverflow !== 'ellipsis') return;
      if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0)
        out.text.push(el.tagName + '.' + String(el.className).slice(0, 30) + ` (${el.scrollWidth}>${el.clientWidth})`);
    });

    return out;
  });

  [...new Set(r.imgs)].forEach((i) => add(i.startsWith('مكسورة') ? 'BUG' : 'صغيرة', path, 'صورة ' + i));
  [...new Set(r.a11y)].forEach((a) => add('متوسطة', path, 'زر/رابط بدون اسم مقروء: ' + a));
  [...new Set(r.text)].slice(0, 3).forEach((t) => add('متوسطة', path, 'نص مقصوص: ' + t));

  const m = r.meta;
  if (!m.title) add('BUG', path, 'ما في عنوان صفحة');
  if (m.title && m.title.length > 65) add('صغيرة', path, `عنوان طويل (${m.title.length} حرف) — جوجل بيقصّه`);
  if (!m.desc) add('متوسطة', path, 'ما في وصف ميتا');
  if (m.desc && (m.desc.length < 70 || m.desc.length > 165))
    add('صغيرة', path, `طول الوصف ${m.desc.length} (المفضّل ٧٠–١٦٥)`);
  if (m.h1 !== 1) add('متوسطة', path, `عدد h1 = ${m.h1} (لازم واحد)`);
  if (!m.og) add('صغيرة', path, 'ما في og:image — الرابط بيطلع بدون صورة بالواتساب');
  if (!m.canonical) add('صغيرة', path, 'ما في canonical');
  const wantAr = path.startsWith('/ar/');
  if (wantAr && (m.lang !== 'ar' || m.dir !== 'rtl')) add('BUG', path, `lang/dir غلط: ${m.lang}/${m.dir}`);
  if (!wantAr && (m.lang !== 'en' || m.dir === 'rtl')) add('BUG', path, `lang/dir غلط: ${m.lang}/${m.dir}`);

  await p.close();
}

// ─────────────────────────────────────────────
//  ٢) تراكم مع التنقّل — أخطر إشي بموقع بدون إعادة تحميل
// ─────────────────────────────────────────────
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', (e) => add('BUG', 'تنقّل', 'خطأ: ' + e.message.slice(0, 120)));
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);

  const count = () =>
    p.evaluate(() => {
      const ST = window.__gsap?.core?.globals?.().ScrollTrigger;
      return {
        triggers: ST ? ST.getAll().length : -1,
        spacers: document.querySelectorAll('.pin-spacer').length,
        islands: document.querySelectorAll('astro-island').length,
        canvases: document.querySelectorAll('canvas').length,
        videos: document.querySelectorAll('video').length,
        cursors: document.querySelectorAll('[data-cursor]').length,
        lenisEls: document.querySelectorAll('.lenis').length,
        docH: document.documentElement.scrollHeight,
      };
    });

  const first = await count();
  for (let i = 0; i < 6; i++) {
    await p.goto(BASE + (i % 2 ? '/ar/websites/' : '/ar/signals/'), { waitUntil: 'networkidle' });
    await p.waitForTimeout(900);
    await p.locator('.pill .brand').click();
    await p.waitForTimeout(2400);
  }
  const last = await count();

  for (const k of Object.keys(first)) {
    if (first[k] !== last[k])
      add(k === 'docH' ? 'متوسطة' : 'BUG', 'تنقّل', `${k} تغيّر بعد ٦ تنقّلات: ${first[k]} → ${last[k]}`);
  }
  await p.close();
}

// ─────────────────────────────────────────────
//  ٣) كل زر بالصفحة الرئيسية بيشتغل؟
// ─────────────────────────────────────────────
for (const home of ['/ar/', '/']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + home, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2200);

  const links = await p.evaluate(() =>
    [...document.querySelectorAll('a[href]')].map((a) => ({
      href: a.getAttribute('href'),
      text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0, 30),
    }))
  );

  for (const l of links) {
    if (!l.href || l.href.startsWith('http') || l.href.startsWith('mailto') || l.href.startsWith('tel')) continue;
    if (l.href.startsWith('#') || l.href.includes('#')) {
      const hash = '#' + l.href.split('#')[1];
      const exists = await p.locator(hash).count();
      if (!exists) add('BUG', home, `رابط لقسم مش موجود: ${l.href} («${l.text}»)`);
    }
  }
  await p.close();
}

// ─────────────────────────────────────────────
//  ٤) الموبايل: تمرير أفقي، عناصر ضيقة، أزرار صغيرة
// ─────────────────────────────────────────────
for (const path of ['/ar/', '/', '/ar/loss/', '/ar/brief/', '/ar/signals/']) {
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);

  const r = await p.evaluate(() => {
    const out = { over: [], small: [] };
    const vw = document.documentElement.clientWidth;
    document.querySelectorAll('body *').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) return;
      if (b.right > vw + 2 || b.left < -2) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.overflow === 'hidden' || cs.overflowX === 'clip') return;
        // لو في جدّ بيقصّه أو بيمرّره (زي شريط البطاقات الأفقي) فهو مش مشكلة
        let n = el.parentElement;
        while (n && n !== document.body) {
          const p = getComputedStyle(n).overflowX;
          if (['hidden', 'clip', 'auto', 'scroll'].includes(p)) return;
          n = n.parentElement;
        }
        out.over.push(el.tagName + '.' + String(el.className).slice(0, 30) + ` (${Math.round(b.left)}..${Math.round(b.right)})`);
      }
    });
    // أزرار أصغر من ٤٤ بكسل صعب تضغطها بالإصبع
    document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
      const b = el.getBoundingClientRect();
      if (b.height > 0 && b.height < 32 && b.width < 120)
        out.small.push(el.tagName + '.' + String(el.className).slice(0, 26) + ` ${Math.round(b.width)}×${Math.round(b.height)}`);
    });
    return out;
  });

  const realScroll = await p.evaluate(() => {
    const before = scrollX;
    scrollTo(200, scrollY);
    const after = scrollX;
    scrollTo(before, scrollY);
    return after > before;
  });
  if (realScroll) add('BUG', path + ' (موبايل)', 'الصفحة بتتمرّر أفقياً');
  [...new Set(r.over)].slice(0, 4).forEach((o) => add('متوسطة', path + ' (موبايل)', 'عنصر خارج الشاشة: ' + o));
  [...new Set(r.small)].slice(0, 3).forEach((s) => add('صغيرة', path + ' (موبايل)', 'زر صغير عاللمس: ' + s));
  await p.close();
}

// ─────────────────────────────────────────────
//  ٥) الكيبورد: في مؤشّر تركيز باين؟
// ─────────────────────────────────────────────
{
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + '/ar/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1800);
  let noRing = 0;
  const seen = [];
  for (let i = 0; i < 14; i++) {
    await p.keyboard.press('Tab');
    const r = await p.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const cs = getComputedStyle(el);
      return {
        tag: el.tagName + '.' + String(el.className).slice(0, 24),
        outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
        shadow: cs.boxShadow !== 'none',
        border: cs.borderColor,
      };
    });
    if (r && !r.outline && !r.shadow) { noRing++; seen.push(r.tag); }
  }
  if (noRing > 4)
    add('متوسطة', 'كيبورد', `${noRing} من ١٤ عنصر بدون مؤشّر تركيز باين (مثال: ${seen.slice(0, 2).join(', ')})`);
  await p.close();
}

// ═══════════════════════════════════════════════════════════════
const order = { BUG: 0, متوسطة: 1, صغيرة: 2 };
findings.sort((a, b) => order[a.sev] - order[b.sev]);
console.log(`\n═══ ${findings.length} ملاحظة ═══\n`);
let cur = '';
for (const f of findings) {
  if (f.sev !== cur) { cur = f.sev; console.log(`\n──── ${cur} ────`); }
  console.log(`  [${f.area}] ${f.msg}`);
}
await b.close();
