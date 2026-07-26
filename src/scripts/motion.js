// ═══════════════════════════════════════════════════════════════
//  نظام الحركة العام — GSAP + Lenis
//  (حركة الهيرو السينمائي بملف منفصل: sequence.js)
//
//  ┌────────────────── 🎛️ لوحة التحكم ──────────────────┐
//  │ SMOOTH_DURATION : نعومة السكرول (1.15 = ناعم)       │
//  │ REVEAL_Y        : من وين بتطلع العناصر (بيكسل)      │
//  │ REVEAL_DURATION : مدة ظهور العنصر (ثواني)           │
//  │ STAGGER_GAP     : الفرق الزمني بين عناصر المجموعة   │
//  │ COUNTER_TIME    : مدة عد الأرقام (ثواني)            │
//  └──────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css'; // ستايلات Lenis الأساسية (مطلوبة عشان السكرول يشتغل صح)
import { initSequences } from './sequence.js';
import { initLightbox } from './lightbox.js';

gsap.registerPlugin(ScrollTrigger);

// عالموبايل شريط عنوان المتصفح بيظهر ويختفي مع السكرول وبيغيّر ارتفاع الشاشة.
// بدون هالسطر، كل تغيير ارتفاع بيعيد حساب نقاط التثبيت وبتصير الأقسام تنط.
ScrollTrigger.config({ ignoreMobileResize: true });

const SMOOTH_DURATION = 1.15;
const REVEAL_Y = 34;
const REVEAL_DURATION = 0.9;
const STAGGER_GAP = 0.09;
const COUNTER_TIME = 1.6;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────────
//  1) السكرول الناعم (Lenis)
// ─────────────────────────────────────────────
if (!reduceMotion) {
  const lenis = new Lenis({ duration: SMOOTH_DURATION, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis; // مقبض للفحص والتنقّل البرمجي
  window.__gsap = gsap;

  // روابط الأنكور (#work وغيرها) بتسكرول بنعومة مع تعويض ارتفاع النافبار
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -68 });
  });
}

// ─────────────────────────────────────────────
//  2) أنيميشن دخول الهيرو (مرة واحدة عند فتح الصفحة)
// ─────────────────────────────────────────────
if (!reduceMotion) {
  const heroLines = document.querySelectorAll('[data-hero-line]');
  const heroFades = document.querySelectorAll('[data-hero-fade]');

  if (heroLines.length) {
    gsap.set(heroFades, { y: 26 });
    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
    intro.from(heroLines, { yPercent: 115, duration: 1.1, stagger: 0.12 });
    intro.to(heroFades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, '-=0.55');
  }
}

// ─────────────────────────────────────────────
//  3) ظهور العناصر مع السكرول
//     حط  data-reveal  على أي عنصر بدك يظهر بنعومة
//     حط  data-stagger على حاوية عشان أولادها يظهروا واحد ورا واحد
// ─────────────────────────────────────────────
if (!reduceMotion) {
  // عناصر منفردة
  ScrollTrigger.batch('[data-reveal]:not([data-hero-fade])', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: REVEAL_DURATION,
        stagger: STAGGER_GAP,
        ease: 'power3.out',
        overwrite: true,
      }),
  });
  gsap.set('[data-reveal]:not([data-hero-fade])', { y: REVEAL_Y });

  // مجموعات: الأولاد بيظهروا بالتتابع
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    const kids = group.children;
    gsap.set(kids, { opacity: 0, y: REVEAL_Y });
    ScrollTrigger.create({
      trigger: group,
      start: 'top 85%',
      once: true,
      onEnter: () =>
        gsap.to(kids, {
          opacity: 1,
          y: 0,
          duration: REVEAL_DURATION,
          stagger: STAGGER_GAP,
          ease: 'power3.out',
        }),
    });
  });
} else {
  // «تقليل الحركة»: كل إشي ظاهر فوراً
  document.querySelectorAll('[data-reveal], [data-stagger] > *').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}

// ─────────────────────────────────────────────
//  4) عدّادات الأرقام
//     <strong data-counter="2395" data-suffix="">0</strong>
//     data-counter = الرقم النهائي | data-suffix = لاحقة (K أو % أو +)
// ─────────────────────────────────────────────
document.querySelectorAll('[data-counter]').forEach((el) => {
  const target = parseFloat(el.dataset.counter);
  const suffix = el.dataset.suffix || '';
  const isAr = document.documentElement.lang === 'ar';
  const fmt = (v) => Math.round(v).toLocaleString(isAr ? 'ar-EG' : 'en-US') + suffix;

  if (reduceMotion) {
    el.textContent = fmt(target);
    return;
  }

  const state = { v: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    once: true,
    onEnter: () =>
      gsap.to(state, {
        v: target,
        duration: COUNTER_TIME,
        ease: 'power2.out',
        onUpdate: () => (el.textContent = fmt(state.v)),
      }),
  });
});

// ─────────────────────────────────────────────
//  5) نص «من أنا»: الكلمات بتضوّي كلمة كلمة مع السكرول
//     حط data-words على الفقرة وخلاص — التقسيم بيصير لحاله
// ─────────────────────────────────────────────
document.querySelectorAll('[data-words]').forEach((p) => {
  const words = p.textContent.trim().split(/\s+/);
  p.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
  const spans = p.querySelectorAll('.w');

  if (reduceMotion) return;

  gsap.set(spans, { opacity: 0.18 });
  gsap.to(spans, {
    opacity: 1,
    stagger: 0.06,
    ease: 'none',
    scrollTrigger: {
      trigger: p,
      start: 'top 78%',
      end: 'bottom 45%',
      scrub: 0.6,
    },
  });
});

// ─────────────────────────────────────────────
//  6) السحب الأفقي (قسم الفيديوهات عالديسكتوب)
//     السكرول العمودي بيتحول لحركة أفقية للبطاقات
// ─────────────────────────────────────────────
if (!reduceMotion) {
  // بنقيس مسافة السحب من موقع آخر بطاقة فعلياً.
  // (ما بنستخدم scrollWidth لأنه بيتجاهل الحشوة الأخيرة بالفلكس،
  //  فكانت آخر بطاقة «شوف الكل» تنقص من الطرف بالنسخة الإنجليزية)
  const measurePan = (wrap, track) => {
    const isRtl = document.documentElement.dir === 'rtl';
    const last = track.lastElementChild;
    if (!last) return 0;

    const prevX = gsap.getProperty(track, 'x');
    gsap.set(track, { x: 0 }); // نصفّر الإزاحة عشان القياس يطلع صح

    const w = wrap.getBoundingClientRect();
    const l = last.getBoundingClientRect();
    const cs = getComputedStyle(track);
    const pad = parseFloat(isRtl ? cs.paddingInlineStart : cs.paddingInlineEnd) || 0;

    const dist = isRtl
      ? Math.max(0, w.left - l.left + pad)
      : Math.max(0, l.right - w.right + pad);

    gsap.set(track, { x: prevX });
    return dist;
  };

  ScrollTrigger.matchMedia({
    '(min-width: 768px)': () => {
      document.querySelectorAll('[data-hpan]').forEach((wrap) => {
        const track = wrap.querySelector('[data-hpan-track]');
        if (!track) return;
        const isRtl = document.documentElement.dir === 'rtl';

        gsap.to(track, {
          // بالعربي بنسحب لليمين، وبالإنجليزي لليسار
          x: () => (isRtl ? measurePan(wrap, track) : -measurePan(wrap, track)),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: () => `+=${measurePan(wrap, track)}`,
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            invalidateOnRefresh: true,
            // أقل من أولوية الهيرو عشان الهيرو ينحسب قبله
            refreshPriority: 1,
          },
        });
      });
    },
  });
}

// ─────────────────────────────────────────────
//  7) الهيرو السينمائي + اللايت-بوكس
// ─────────────────────────────────────────────
initLightbox();

// الفيديوهات بتحمّل بشكل غير متزامن، فبعد ما تخلص كلها منرتّب نقاط
// التثبيت ومنعيد حساب مواقعها. بدون هالخطوة كان قسم الفيديو يظهر
// لجزء من الثانية بنص الهيرو وبعدين ينط لمكانه الصح.
initSequences().then(() => {
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
});

// وكمان بعد ما تخلص الصور والخطوط تحميل (بتغيّر ارتفاع الصفحة)
window.addEventListener('load', () => ScrollTrigger.refresh());
