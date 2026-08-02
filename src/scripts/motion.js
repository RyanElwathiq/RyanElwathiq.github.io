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
import { initSignalBar, refreshSignalBar } from './signal.js';
import { initRails } from './rails.js';

gsap.registerPlugin(ScrollTrigger);

// عالموبايل شريط عنوان المتصفح بيظهر ويختفي مع السكرول وبيغيّر ارتفاع الشاشة.
// بدون هالسطر، كل تغيير ارتفاع بيعيد حساب نقاط التثبيت وبتصير الأقسام تنط.
ScrollTrigger.config({ ignoreMobileResize: true });

const SMOOTH_DURATION = 1.15;
const COUNTER_TIME = 1.6;
// المسافة اللي بنتركها فوق القسم لما ننط عليه
// = ارتفاع شريط الإشارة + كبسولة التنقل + مسافة تنفّس
const NAV_OFFSET = 118;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
let cleanups = [];

// ═══════════════════════════════════════════════════════════════
//  حركة سكرول آمنة — كل قفزة لقسم بتمرق من هون
//
//  ⚠️⚠️ عطل حقيقي كان هون ⚠️⚠️
//  لما الزائر مفعّل «تقليل الحركة» بجهازه، السكرول الناعم (Lenis)
//  ما بينشغّل أصلاً وبيضل null. وروابط الأقسام كانت تنادي
//  lenis.scrollTo مباشرة → بترمي خطأ وما بيصير ولا إشي: الضغط
//  على «الأسئلة» أو «تواصل» ما بيوديك لأي مكان.
//  والزائر اللي مفعّل هالخيار غالباً بيكون محتاجه فعلاً.
//  الحل: Lenis إذا موجود، وإلا سكرول المتصفح العادي.
// ═══════════════════════════════════════════════════════════════
function scrollToY(y, immediate) {
  if (lenis) {
    lenis.scrollTo(
      y,
      immediate ? { immediate: true, force: true } : { duration: ANCHOR_DURATION }
    );
    return;
  }
  window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
}

function resizeScroll() {
  if (lenis) lenis.resize();
}

// ─────────────────────────────────────────────
//  تنظيف كل شي قبل الانتقال لصفحة ثانية
// ─────────────────────────────────────────────
function destroy() {
  // kill(true) بتشيل كمان مساحات التثبيت (pin-spacer) من الصفحة.
  // بدونها بتضل مساحات فاضية بالصفحة الجديدة وبتتداخل الأقسام.
  ScrollTrigger.getAll().forEach((t) => t.kill(true));
  ScrollTrigger.clearScrollMemory('manual');
  cleanups.forEach((fn) => fn());
  cleanups = [];
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
}

// ─────────────────────────────────────────────
//  1) السكرول الناعم (Lenis)
// ─────────────────────────────────────────────
function setupSmoothScroll() {
  if (reduceMotion) return;

  const instance = new Lenis({ duration: SMOOTH_DURATION, smoothWheel: true });
  lenis = instance;

  const raf = (time) => instance.raf(time * 1000);
  instance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  cleanups.push(() => gsap.ticker.remove(raf));

  // ⚠️⚠️ أهم سطر بالملف ⚠️⚠️
  // Lenis بيحفظ ارتفاع الصفحة عنده مرة وحدة. والأقسام المثبّتة
  // (الهيرو، شريط الفيديو، فيديو المواقع) بتضيف آلاف البكسلات
  // للصفحة **بعد** ما يحسب. فكان يفضل شايف الصفحة أقصر مما هي،
  // وبيرفض ينزل أبعد من الحد القديم — وهاد اللي كان يخلي زر
  // «كيف بشتغل» يوقف قبل القسم بـ 2000 بكسل.
  // فكل ما ScrollTrigger يعيد الحساب، منخلي Lenis يعيد قياس الصفحة.
  const onRefresh = () => instance.resize();
  ScrollTrigger.addEventListener('refresh', onRefresh);
  cleanups.push(() => ScrollTrigger.removeEventListener('refresh', onRefresh));

  window.__lenis = lenis;
  window.__gsap = gsap;
}

// ─────────────────────────────────────────────
//  1ب) روابط الأقسام (#work، #designs، #pricing…)
//
//  ⚠️⚠️ ليش دالة مستقلة؟ ⚠️⚠️
//  كانت مكتوبة جوّا setupSmoothScroll، وهديك بترجع من أولها لو
//  الزائر مفعّل «تقليل الحركة». يعني كل روابط الأقسام كانت
//  **مش مسجّلة أصلاً** لهالزائر — الضغط على «الأسئلة» ما بيعمل
//  إشي غير إنه يحط # بالرابط. طلعت بفحص _check/anchors.mjs.
//  هلق بتنسجّل دايماً، والحركة بتمرق من scrollToY اللي بيتصرّف
//  مع الحالتين.
// ─────────────────────────────────────────────
function setupAnchors() {
  const onClick = (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;

    const url = new URL(a.href, location.href);
    if (url.pathname !== location.pathname || !url.hash) return;

    const target = document.querySelector(url.hash);
    if (!target) return;

    e.preventDefault();
    history.pushState(null, '', url.hash);

    // ⚠️ Lenis بيحسب مسافة الحركة مرة وحدة بالبداية. وبما إن الأقسام
    //    المثبّتة (الهيرو، شريط الفيديو، فيديو المواقع) بتغيّر مواقع
    //    اللي بعدها وإحنا عم نمرق فيها، الحركة كانت توقف بمكان غلط —
    //    وهاد اللي كان يخلي «كيف بشتغل» يوقف قبل القسم بـ 2000 بكسل.
    //    الحل: نتحرك أول، وبعدين نصحّح على دفعات لحد ما نستقر.
    // ⚠️ لو الزائر ضغط قبل ما تستقر الصفحة، بتكون مساحات التثبيت
    //    لسا ما انحسبت، فـ Lenis بيشوف الصفحة أقصر مما هي وبيقصّ
    //    الحركة — فالزر بيبين كأنه ما بيعمل إشي. فمنجبر إعادة
    //    الحساب أول ما يضغط، وهاي بتحدّث Lenis كمان.
    ScrollTrigger.refresh();
    resizeScroll();

    const y0 = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    const distance = Math.abs(y0 - window.scrollY);

    // ⚠️ المسافات الطويلة بتنط فوراً بدل ما تنزلق.
    //    السبب: الانزلاق الطويل بيمرق بثلاث أقسام مثبّتة، وكل
    //    قسم بيغيّر ارتفاع الصفحة وهو داخل وطالع — فالحركة
    //    بتتوه بالطريق وما بتوصل. وهاد اللي كان يخلي زر
    //    «تواصل معي» (16 ألف بكسل) ما يشتغل، بينما «شوف أعمالي»
    //    (قريب) يشتغل عادي. وكمان انزلاق 16 ألف بكسل تجربة سيئة.
    const isFarJump = distance > window.innerHeight * 2.5;

    scrollToY(y0, isFarJump);

    settleTo(url.hash, isFarJump ? FAR_RETRIES : ANCHOR_RETRIES);

    // شبكة أمان أخيرة: لو ما وصلنا لأي سبب، منجبر القفزة.
    // (ما منستخدم سكرول المتصفح العادي لأن Lenis بتتحكم بالسكرول
    //  وبترجّعه لمكانها — فمنستخدم Lenis نفسها بوضع فوري)
    const fallback = setTimeout(() => {
      const el = document.querySelector(url.hash);
      if (!el) return;
      if (Math.abs(el.getBoundingClientRect().top - NAV_OFFSET) < 120) return;

      ScrollTrigger.refresh();
      resizeScroll();
      const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      scrollToY(y, true);
    }, 2600);
    cleanups.push(() => clearTimeout(fallback));
  };
  document.addEventListener('click', onClick);
  cleanups.push(() => document.removeEventListener('click', onClick));
}

// ─────────────────────────────────────────────
//  2) لما توصل الصفحة ومعها أنكور (#designs مثلاً)
//     منقفز على القسم مباشرة بدل ما نبلّش من فوق
// ─────────────────────────────────────────────
// مواعيد التصحيح (بالملي ثانية)
// عند فتح صفحة بأنكور: منصحّح من البداية وعلى دفعات متقاربة
const HASH_RETRIES = [0, 50, 120, 250, 450, 750, 1100, 1600, 2200, 3000];
// عند الضغط على زر أنكور: منستنى الحركة تخلص وبعدين منصحّح
const ANCHOR_DURATION = 1;
const ANCHOR_RETRIES = [1100, 1300, 1550, 1900, 2400, 3000];
// القفزات البعيدة بتنط فوراً، فالتصحيح بيبدأ من أول لحظة
const FAR_RETRIES = [60, 160, 320, 600, 1000, 1600, 2400];

// بيصحّح موقع السكرول على دفعات لحد ما القسم يستقر تحت النافبار بالضبط
function settleTo(hash, schedule) {
  const timers = [];
  let settled = false;

  const step = () => {
    if (settled) return;
    const el = document.querySelector(hash);
    if (!el) return;

    // نتأكد إن Lenis عارف الارتفاع الحقيقي قبل ما نطلب منه يتحرك
    resizeScroll();

    const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    const drift = Math.abs(y - window.scrollY);
    if (drift < 4) {
      settled = true;
      return;
    }

    scrollToY(y, true);
  };

  schedule.forEach((ms) => timers.push(setTimeout(step, ms)));
  cleanups.push(() => timers.forEach(clearTimeout));
}

// ⚠️ ارتفاع الصفحة بيتغيّر وهي عم تتشكّل (الفيديوهات بتحجز مساحات
//    التثبيت، والصور بتحمّل). فمنط، منقيس من جديد، ومنصحّح على دفعات.
function jumpToHash() {
  if (!location.hash) return;
  if (!document.querySelector(location.hash)) return;
  settleTo(location.hash, HASH_RETRIES);
}

// ─────────────────────────────────────────────
//  3) أنيميشن دخول الهيرو (مرة عند فتح الصفحة)
// ─────────────────────────────────────────────
// ⚠️ أنيميشن دخول الهيرو انتقل بالكامل للـ CSS داخل Hero.astro.
//    ليش؟ لأنه كان هون بـ GSAP، فالنص كان يضل مخفي لحد ما ينزّل
//    ملف GSAP (١٤٤ كيلوبايت) ويشتغل — وعلى تلفون متوسط بالأردن
//    هاد ٣ ثواني والزائر قاعد يتفرّج على فراغ.
//    الأنيميشن بالـ CSS بيبلّش مع أول رسمة وبدون أي جافاسكربت.

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
      // ⚠️ منبني العناصر بدل ما نكتب HTML كنص.
      //    لو كتبنا HTML، أي جملة فيها رمز زي & أو < كانت بتنكسر
      //    أو بتنعرض غلط. هيك الكلمة بتنحط كنص خالص مهما كانت.
      const frag = document.createDocumentFragment();
      words.forEach((w, i) => {
        if (i) frag.append(' ');
        const span = document.createElement('span');
        span.className = 'w';
        span.textContent = w;
        frag.append(span);
      });
      p.replaceChildren(frag);
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
// أقل مسافة سحب تستاهل نثبّت القسم عشانها (بالبكسل)
const MIN_PAN = 120;

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

        // ⚠️ لو البطاقات بتزبط بالشاشة، ما في إشي ينسحب. وبدون هالفحص
        //    كنا منثبّت القسم ومنوقف الصفحة عنده وهو ما بيتحرك ولا بكسل —
        //    فبيحس الزائر إنه الكاروسيل «راح». بهاي الحالة منخليه قسم
        //    عادي بينزل مع السكرول، أحسن من قسم مثبّت واقف.
        if (measurePan(wrap, track) < MIN_PAN) return;

        // ⚠️ اللفافة الثابتة (data-pin-spacer حوالين القسم): بدونها
        //    GSAP بينقل القسم بالصفحة وبيعيد تشغيل أنيميشن CSS
        //    جوّاه — نفس رمشة الهيرو. شوف الشرح بـ sequence.js
        const spacer = wrap.parentElement?.hasAttribute('data-pin-spacer')
          ? wrap.parentElement
          : undefined;

        gsap.to(track, {
          x: () => (isRtl ? measurePan(wrap, track) : -measurePan(wrap, track)),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: () => `+=${measurePan(wrap, track)}`,
            pin: true,
            pinSpacer: spacer,
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

// ─────────────────────────────────────────────
//  إضاءة الإطار على الموبايل
//  الماوس عنده :hover، والإصبع لأ. فلما يضغط الزائر على صورة
//  بأي إطار (.frame) منحطّ كلاس .lit فتشتغل نفس الحركة: الخط
//  الليموني واللمعة والتكبير الخفيف.
//  ⚠️ إطار واحد مضيّ بنفس الوقت — عشان الصفحة ما تصير شجرة نور
// ─────────────────────────────────────────────
function setupTouchLight() {
  if (!window.matchMedia('(hover: none)').matches) return () => {};

  let lit = null;
  const clear = () => {
    if (lit) lit.classList.remove('lit');
    lit = null;
  };

  const onDown = (e) => {
    const f = e.target.closest('.frame');
    if (f === lit) return;
    clear();
    if (f) {
      f.classList.add('lit');
      lit = f;
    }
  };

  document.addEventListener('pointerdown', onDown, { passive: true });
  return () => {
    document.removeEventListener('pointerdown', onDown);
    clear();
  };
}

// ═══════════════════════════════════════════════════════════════
//  التشغيل
// ═══════════════════════════════════════════════════════════════
function init() {
  setupSmoothScroll();
  // ⚠️ لازم تنادى دايماً — مش جوّا setupSmoothScroll. شوف الشرح فوقها
  setupAnchors();

  setupCounters();
  setupWordGlow();
  setupHorizontalPan();
  initLightbox();
  cleanups.push(initSignalBar());
  cleanups.push(initRails());
  cleanups.push(setupTouchLight());

  // الفيديوهات بتحمّل بشكل غير متزامن، فبعد ما تخلص كلها منرتّب
  // نقاط التثبيت ومنعيد حساب مواقعها. بدون هالخطوة كان قسم الفيديو
  // يظهر لجزء من الثانية بنص الهيرو وبعدين ينط لمكانه الصح.
  initSequences().then(() => {
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    // ارتفاع الصفحة تغيّر بعد التثبيت → شريط الإشارة لازم يعيد الحساب
    refreshSignalBar();
    jumpToHash();
  });

  jumpToHash();

  // ⚠️ بعد الانتقال بين الصفحات، ارتفاعات الأقسام بتضل تتغيّر لجزء من
  //    الثانية (مساحات التثبيت بتتحسب، الصور بتحمّل). بدون إعادة حساب
  //    متكررة كانت الأقسام تتداخل ببعضها لحظة السكرول.
  [120, 400, 900, 1800].forEach((ms) => {
    const t = setTimeout(() => ScrollTrigger.refresh(), ms);
    cleanups.push(() => clearTimeout(t));
  });

  // ═══════════════════════════════════════════════════════════════
  //  ⚠️ الرجوع بزر المتصفح وإنت واقف بنص الصفحة
  //
  //  لما ترجع، المتصفح بيرجّعك لنفس مكان السكرول **قبل** ما نظام
  //  الحركة يبني مساحات التثبيت من جديد. يعني الصفحة بتكون واقفة
  //  عند بكسل ١٢٠٠٠ بينما ارتفاعها الحقيقي لسا ما انحسب — فالأقسام
  //  المثبّتة بتحسب مواقعها غلط، والفيديو بيوقف عند فريم عشوائي
  //  وما بيتحرك مع السكرول. وما بيزبط إلا بريفرش.
  //
  //  الحل: لو رجعنا لمكان مش أول الصفحة، منعمل إعادة حساب **كاملة**
  //  (refresh(true) بتعيد قياس كل إشي من الصفر مش بس المواقع)،
  //  وبعدها منرجّع السكرول لمكانه بالضبط.
  // ═══════════════════════════════════════════════════════════════
  if (window.scrollY > 4) {
    const hardRefresh = setTimeout(() => {
      const y = window.scrollY;
      ScrollTrigger.refresh(true);
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(y, { immediate: true, force: true });
      } else {
        window.scrollTo(0, y);
      }
    }, 260);
    cleanups.push(() => clearTimeout(hardRefresh));
  }
}

// astro:page-load بتشتغل بأول تحميل وبعد كل انتقال بين الصفحات
document.addEventListener('astro:page-load', init);

// قبل مغادرة الصفحة: ننظّف كل شي عشان ما يتراكم ويتداخل
// ⚠️ try/catch مقصود: لو رمى أي خطأ جوّا هذا الحدث، المتصفح بيلغي
//    الانتقال كله («Transition was aborted») — وبتطلع الصفحة الجديدة
//    ومعها بقايا تثبيت الصفحة القديمة، فبتشوف أقسام فوق بعض وما
//    بتزبط إلا بريفرش. أي فشل بالتنظيف أهون من انتقال ملغي.
document.addEventListener('astro:before-swap', () => {
  try {
    destroy();
  } catch (err) {
    console.warn('[motion] فشل التنظيف قبل الانتقال:', err);
  }
});

// ═══════════════════════════════════════════════════════════════
//  شبكة أمان بعد كل انتقال: بقايا مساحات التثبيت
//  لو ضلّت مساحة تثبيت (pin-spacer) من الصفحة القديمة وما إلها
//  تريجر حيّ، بتزيح كل اللي تحتها وبتتداخل الأقسام. منشيلها.
// ═══════════════════════════════════════════════════════════════
document.addEventListener('astro:after-swap', () => {
  document.querySelectorAll('.pin-spacer').forEach((sp) => {
    // مساحة تثبيت بدون محتوى = بقايا. منفكّها ومنرجّع اللي جوّاها.
    if (!sp.firstElementChild) sp.remove();
  });
});

// بعد ما تخلص الصور والخطوط تحميل (بتغيّر ارتفاع الصفحة)
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
  jumpToHash();
});
