// ═══════════════════════════════════════════════════════════════
//  نظام الحركة العام — GSAP + Lenis
//  (حركة الفيديوهات بملف منفصل: sequence.js)
//
//  ⚠️ الموقع بينتقل بين الصفحات بدون إعادة تحميل (ClientRouter)،
//     فكل الحركة لازم تتنظّف عند مغادرة الصفحة وتتشغّل من جديد
//     عند الوصول للصفحة الجديدة. هاد اللي بيعمله هذا الملف.
//
//  ┌────────────────── 🎛️ لوحة التحكم ──────────────────┐
//  │ SMOOTH_DURATION : نعومة السكرول (1.15 = ناعم)       │
//  │ COUNTER_TIME    : مدة عد الأرقام (ثواني)            │
//  │ NAV_OFFSET      : ارتفاع كبسولة التنقل (للأنكور)    │
//  └──────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { initSequences } from './sequence.js';
import { initLightbox } from './lightbox.js';

gsap.registerPlugin(ScrollTrigger);

// عالموبايل شريط عنوان المتصفح بيظهر ويختفي مع السكرول وبيغيّر ارتفاع الشاشة.
// بدون هالسطر، كل تغيير ارتفاع بيعيد حساب نقاط التثبيت وبتصير الأقسام تنط.
ScrollTrigger.config({ ignoreMobileResize: true });

const SMOOTH_DURATION = 1.15;
const COUNTER_TIME = 1.6;
const NAV_OFFSET = 86;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
let cleanups = [];

// ─────────────────────────────────────────────
//  تنظيف كل شي قبل الانتقال لصفحة ثانية
// ─────────────────────────────────────────────
function destroy() {
  ScrollTrigger.getAll().forEach((t) => t.kill());
  cleanups.forEach((fn) => fn());
  cleanups = [];
  if (lenis) {
    gsap.ticker.remove(lenis.raf);
    lenis.destroy();
    lenis = null;
  }
}

// ─────────────────────────────────────────────
//  1) السكرول الناعم (Lenis)
// ─────────────────────────────────────────────
function setupSmoothScroll() {
  if (reduceMotion) return;

  lenis = new Lenis({ duration: SMOOTH_DURATION, smoothWheel: true });
  const raf = (time) => lenis.raf(time * 1000);
  lenis.raf = lenis.raf.bind(lenis);

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  cleanups.push(() => gsap.ticker.remove(raf));

  window.__lenis = lenis;
  window.__gsap = gsap;

  // روابط الأنكور (#work، #designs…) بتسكرول بنعومة مع تعويض النافبار
  const onClick = (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;
    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;
    const target = document.querySelector(url.hash);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -NAV_OFFSET });
  };
  document.addEventListener('click', onClick);
  cleanups.push(() => document.removeEventListener('click', onClick));
}

// ─────────────────────────────────────────────
//  2) لما توصل الصفحة ومعها أنكور (#designs مثلاً)
//     منقفز على القسم مباشرة بدل ما نبلّش من فوق
// ─────────────────────────────────────────────
// مواعيد التصحيح (بالملي ثانية) — بنصحّح الموقع عند كل وحدة منها
const HASH_RETRIES = [0, 50, 120, 250, 450, 750, 1100, 1600, 2200, 3000];

function jumpToHash() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (!target) return;

  // ⚠️ ارتفاع الصفحة بيتغيّر وهي عم تتشكّل (الفيديوهات بتحجز مساحات
  //    التثبيت، والصور بتحمّل). فمنط، منقيس من جديد، ومنصحّح على دفعات
  //    لحد ما نستقر على القسم الصح بالضبط.
  const timers = [];
  let settled = false;

  const step = () => {
    if (settled) return;
    const el = document.querySelector(location.hash);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    const drift = Math.abs(y - window.scrollY);
    if (drift < 3) {
      settled = true;
      return;
    }

    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  };

  HASH_RETRIES.forEach((ms) => timers.push(setTimeout(step, ms)));
  cleanups.push(() => timers.forEach(clearTimeout));
}

// ─────────────────────────────────────────────
//  3) أنيميشن دخول الهيرو (مرة عند فتح الصفحة)
// ─────────────────────────────────────────────
function setupHeroIntro() {
  if (reduceMotion) return;
  const heroLines = document.querySelectorAll('[data-hero-line]');
  const heroFades = document.querySelectorAll('[data-hero-fade]');
  if (!heroLines.length) return;

  gsap.set(heroFades, { y: 26 });
  const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro.from(heroLines, { yPercent: 115, duration: 1.1, stagger: 0.12 });
  intro.to(heroFades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, '-=0.55');
}

// ─────────────────────────────────────────────
//  4) عدّادات الأرقام
//     <strong data-counter="2395" data-suffix="K">0</strong>
//     مربوطة بـ IntersectionObserver مش بمكتبة الحركة، عشان
//     الرقم يبين حتى لو GSAP اتأخر بالتحميل.
// ─────────────────────────────────────────────
function setupCounters() {
  document.querySelectorAll('[data-counter]').forEach((el) => {
    const target = parseFloat(el.dataset.counter);
    const suffix = el.dataset.suffix || '';
    const isAr = document.documentElement.lang === 'ar';
    const fmt = (v) => Math.round(v).toLocaleString(isAr ? 'ar-EG' : 'en-US') + suffix;

    if (reduceMotion) {
      el.textContent = fmt(target);
      return;
    }

    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      const state = { v: 0 };
      gsap.to(state, {
        v: target,
        duration: COUNTER_TIME,
        ease: 'power2.out',
        onUpdate: () => (el.textContent = fmt(state.v)),
      });
    };

    const inView = () => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    };

    if (inView()) {
      run();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (io.disconnect(), run())),
      { rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    cleanups.push(() => io.disconnect());

    // شبكة أمان: لو المراقبة ما اشتغلت، الرقم بيظهر بدل ما يضل صفر
    const t = setTimeout(() => !done && inView() && run(), 1500);
    cleanups.push(() => clearTimeout(t));
  });
}

// ─────────────────────────────────────────────
//  5) نص «من أنا»: الكلمات بتضوّي كلمة كلمة مع السكرول
// ─────────────────────────────────────────────
function setupWordGlow() {
  document.querySelectorAll('[data-words]').forEach((p) => {
    // لو انقسم أصلاً (رجعنا للصفحة بدون تحميل) ما نعيد التقسيم
    if (!p.querySelector('.w')) {
      const words = p.textContent.trim().split(/\s+/);
      p.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
    }
    const spans = p.querySelectorAll('.w');
    if (reduceMotion) return;

    gsap.set(spans, { opacity: 0.18 });
    gsap.to(spans, {
      opacity: 1,
      stagger: 0.06,
      ease: 'none',
      scrollTrigger: { trigger: p, start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
    });
  });
}

// ─────────────────────────────────────────────
//  6) السحب الأفقي (قسم الفيديوهات عالديسكتوب)
//     السكرول العمودي بيتحول لحركة أفقية للبطاقات
// ─────────────────────────────────────────────
function setupHorizontalPan() {
  if (reduceMotion) return;

  // بنقيس مسافة السحب من موقع آخر بطاقة فعلياً.
  // (ما بنستخدم scrollWidth لأنه بيتجاهل الحشوة الأخيرة بالفلكس،
  //  فكانت آخر بطاقة «شوف الكل» تنقص من الطرف بالنسخة الإنجليزية)
  const measurePan = (wrap, track) => {
    const isRtl = document.documentElement.dir === 'rtl';
    const last = track.lastElementChild;
    if (!last) return 0;

    const prevX = gsap.getProperty(track, 'x');
    gsap.set(track, { x: 0 });

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

  const mm = ScrollTrigger.matchMedia({
    '(min-width: 768px)': () => {
      document.querySelectorAll('[data-hpan]').forEach((wrap) => {
        const track = wrap.querySelector('[data-hpan-track]');
        if (!track) return;
        const isRtl = document.documentElement.dir === 'rtl';

        gsap.to(track, {
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
            refreshPriority: 1,
          },
        });
      });
    },
  });
  if (mm && typeof mm.kill === 'function') cleanups.push(() => mm.kill());
}

// ═══════════════════════════════════════════════════════════════
//  التشغيل
// ═══════════════════════════════════════════════════════════════
function init() {
  setupSmoothScroll();
  setupHeroIntro();
  setupCounters();
  setupWordGlow();
  setupHorizontalPan();
  initLightbox();

  // الفيديوهات بتحمّل بشكل غير متزامن، فبعد ما تخلص كلها منرتّب
  // نقاط التثبيت ومنعيد حساب مواقعها. بدون هالخطوة كان قسم الفيديو
  // يظهر لجزء من الثانية بنص الهيرو وبعدين ينط لمكانه الصح.
  initSequences().then(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    jumpToHash();
  });

  jumpToHash();
}

// أول تحميل للموقع
init();

// عند كل انتقال لصفحة جديدة (بدون إعادة تحميل)
document.addEventListener('astro:after-swap', init);

// قبل مغادرة الصفحة: ننظّف كل شي عشان ما يتراكم
document.addEventListener('astro:before-swap', destroy);

// بعد ما تخلص الصور والخطوط تحميل (بتغيّر ارتفاع الصفحة)
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  jumpToHash();
});
