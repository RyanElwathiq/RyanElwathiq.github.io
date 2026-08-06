// ═══════════════════════════════════════════════════════════════
//  محرك السكرول-سيكوينس (زي أبل): فيديو مفكفك لفريمات WebP
//  بينرسم على Canvas وبيتحرك فريم-فريم مع سكرول الزائر
//
//  بيشتغل على أي عدد من الفيديوهات بالصفحة. كل عنصر عليه data-seq
//  بيصير سيكوينس مستقل، وإعداداته بتنقرأ من خصائصه بالـ HTML:
//
//    data-seq-desktop="/frames/xxx/"   ← مجلد فريمات الشاشات الكبيرة
//    data-seq-mobile="/frames/yyy/"    ← مجلد فريمات الموبايل (اختياري)
//    data-seq-pin                      ← موجودة = الفيديو بيتثبّت (زي الهيرو)
//                                        غايبة = بيتحرك بمكانه بدون تثبيت
//    data-seq-length="3"               ← طول رحلة السكرول (بعدد الشاشات)
//                                        بيشتغل بس مع data-seq-pin
//    data-seq-end="bottom bottom"      ← (للغير مثبّت) وين تخلص رحلة الفيديو
//                                        الافتراضي: لما السكشن يصير ظاهر كامل
//
//  ┌──────────── 🎛️ لوحة التحكم العامة ────────────┐
//  │ INTRO_FADE_END  : متى يختفي النص الافتتاحي     │
//  │ OUTRO_START     : متى تظهر الجملة الختامية      │
//  │ INTRO_LIFT_RATIO: قديش يرتفع النص الافتتاحي    │
//  │ OUTRO_RISE_RATIO: قديش تطلع الجملة الختامية    │
//  │ MOBILE_BREAKPOINT: حد التبديل لفريمات الموبايل │
//  └────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const INTRO_FADE_END = 0.24;
const OUTRO_START = 0.66;
const INTRO_LIFT_RATIO = 0.22;
const OUTRO_RISE_RATIO = 0.09;
const MOBILE_BREAKPOINT = 768;
// ⚠️ ٦ تنزيلات متوازية كانت تزاحم السكرول وتعمل تقطيع خفيف على
//    الأجهزة المتوسطة. ٣ بتخلّي التحميل أهدأ والحركة أنعم.
const PRELOAD_CONCURRENCY = 3;

// شغّل كل السيكوينسات الموجودة بالصفحة
// (بترجع Promise بمصفوفة دوال تنظيف — المسار الحي للموبايل بيسجّل
//  مستمعين على window ولازم ينشالوا قبل الانتقال لصفحة ثانية،
//  وmotion.js بياخدها وبيسجّلها عنده)
export function initSequences() {
  const all = [...document.querySelectorAll('[data-seq]')];
  return Promise.all(
    all.map((section, i) =>
      setupOne(section, all.length - i).catch(() => {
        // أي فشل → منرجع للوضع الثابت بهدوء بدل ما ينكسر الموقع
        section.classList.add('seq-static');
      })
    )
  );
}

// priority = أولوية التحديث. الأعلى بينحسب أول.
// لازم العناصر اللي فوق بالصفحة تنحسب قبل اللي تحتها، وإلا بتطلع
// الأقسام بأماكن غلط لحظة التحميل (كان قسم الفيديو يقفز بنص الهيرو)
async function setupOne(section, priority) {
  const canvas = section.querySelector('canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const intro = section.querySelector('[data-seq-intro]');
  const outro = section.querySelector('[data-seq-outro]');
  const fallback = section.querySelector('[data-seq-fallback]');
  const sticky = section.querySelector('[data-seq-sticky]');

  const scrollLength = parseFloat(section.dataset.seqLength || '3');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── التثبيت ───
  // الهيرو (data-seq-pin-always) بيتثبّت بكل الأجهزة.
  // باقي الفيديوهات بتتثبّت بالديسكتوب بس — عالموبايل التثبيت المتعدد
  // كان بيسبب تداخل الأقسام وتكرارها، فبتشتغل بدون تثبيت وبتضل حلوة.
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

  // طلب ريّان (2026-08-06): تسلسل الفريمات عالموبايل ثقيل مهما انضغط.
  // القسم اللي حامل data-seq-code-mobile بياخد رسمة الكود الحية بدله:
  // صفر تنزيل صور، والحركة CSS خالصة. الديسكتوب ما بينلمس أبداً.
  if (isMobile && section.hasAttribute('data-seq-code-mobile')) {
    if (fallback) fallback.style.opacity = '1';
    section.classList.add('seq-static', 'seq-code');
    return;
  }

  const shouldPin =
    section.hasAttribute('data-seq-pin-always') ||
    (section.hasAttribute('data-seq-pin') && !isMobile);

  // ─── اختيار مجلد الفريمات حسب حجم الشاشة ───
  const dir =
    (isMobile && section.dataset.seqMobile) || section.dataset.seqDesktop;
  if (!dir) return;

  // ─── تحميل المانيفست (وصف الفريمات) ───
  let manifest;
  try {
    const res = await fetch(`${dir}manifest.json`);
    if (!res.ok) throw new Error('no manifest');
    manifest = await res.json();
  } catch {
    // ما في فريمات؟ منوقع بهدوء على الصورة الاحتياطية
    if (fallback) fallback.style.opacity = '1';
    section.classList.add('seq-static');
    return;
  }

  const count = manifest.frame_count;
  const padLen = Number(manifest.filename_pattern.match(/%0(\d+)d/)[1]);
  const name = (i) => `${dir}frame_${String(i).padStart(padLen, '0')}.webp`;

  const images = new Array(count);
  const loaded = new Array(count).fill(false);
  let current = 0;

  const load = (i) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        images[i] = img;
        loaded[i] = true;
        resolve();
      };
      img.onerror = resolve;
      img.src = name(i);
    });

  await load(0); // أول فريم لازم يبين فوراً

  // ─── الرسم بأسلوب "cover" (يغطي المساحة كاملة مهما كان قياسها) ───
  function draw(i) {
    // لو الفريم المطلوب لسا ما نزل، منرسم أقرب فريم جاهز قبله
    let k = i;
    while (k > 0 && !loaded[k]) k--;
    const img = images[k];
    if (!img) return;

    // ⚠️ عالموبايل منقصّ كثافة البكسل لـ ١.٢٥ بدل ٢.
    //    ليش؟ الفريم بينرسم من جديد مع كل حركة سكرول، وبكثافة ٢
    //    المتصفح بيكتب ٤ أضعاف البكسلات كل إطار — وهاد كان جزء
    //    كبير من التقطيع على تلفون متوسط.
    //    والفرق بالعين؟ ما بيبيّن: الفريمات نفسها مضغوطة، وفوقها
    //    طبقة حبيبات بتغطّي أي نعومة زايدة.
    const isPhone = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isPhone ? 1.25 : 2);
    const cw = Math.round(canvas.clientWidth * dpr);
    const ch = Math.round(canvas.clientHeight * dpr);
    if (cw === 0 || ch === 0) return;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }

    const ir = img.width / img.height;
    const cr = cw / ch;
    let dw, dh;
    if (cr > ir) {
      dw = cw;
      dh = cw / ir;
    } else {
      dh = ch;
      dw = ch * ir;
    }
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  draw(0);

  // أي تغيير بحجم الكانفاس → إعادة رسم فورية (عشان ما تبين الصورة مبكسلة)
  new ResizeObserver(() => draw(current)).observe(canvas);
  document.addEventListener('visibilitychange', () => draw(current));

  // ═══════════════════════════════════════════════════════════════
  //  تنزيل الفريمات — على مراحل، ومتأخّر لو القسم بعيد
  //
  //  ⚠️ المشكلة اللي كانت: كل الفريمات (١٢١ للهيرو) كانت تنزل
  //     بالترتيب ١،٢،٣… ولكل سيكوينسات الصفحة بنفس اللحظة. النتيجة
  //     عالموبايل: ٤ ميغا تحميل، والزائر مستني.
  //
  //  الحل شقّين:
  //  ١) القسم البعيد ما بيبلّش ينزّل إلا لما يقرب من الشاشة.
  //  ٢) الترتيب صار «قفزات»: أول جولة كل فريم رابع (٠،٤،٨…) —
  //     يعني بربع التحميل بيصير السكرول شغّال على طول المدى، وبعدها
  //     منملّي الفراغات ومنزيد النعومة. (draw بترسم أقرب فريم جاهز،
  //     فما بيبين أي نقص).
  // ═══════════════════════════════════════════════════════════════
  const preload = () => {
    // ⚠️ عالموبايل منوقف عند القفزة ٢ — يعني نص عدد الفريمات بس.
    //    ليش؟ الهيرو ١٢٠ فريم = ٣ ميغا، وهاد كثير على نت أردني.
    //    ٦٠ فريم على مدى ٣ شاشات سكرول لسا ناعمة، والفريم الناقص
    //    بينرسم مكانه أقرب فريم جاهز فما بيبين فرق تقريباً.
    //    ✏️ بدك نعومة أعلى عالموبايل؟ شيل الشرط وخليها [4, 2, 1].
    const strides = isMobile ? [4, 2] : [4, 2, 1];

    const order = [];
    for (const stride of strides) {
      for (let i = stride; i < count; i += stride) {
        if (!order.includes(i)) order.push(i);
      }
    }

    let next = 0;
    async function worker() {
      while (next < order.length) {
        const i = order[next++];
        if (loaded[i]) continue;
        await load(i);
        if (i === current) draw(i);
      }
    }
    Promise.all(Array.from({ length: PRELOAD_CONCURRENCY }, worker));
  };

  // القسم قريب من الشاشة؟ نزّل هلق. بعيد؟ استنّى لما يقرب.
  // ⚠️ المسار الحي للموبايل (تحت) بيشغّل التحميل بنفسه من موقع
  //    القسم الحقيقي — المراقب هون للمسار المثبّت/الديسكتوب بس.
  let preloadStarted = false;
  const startPreload = () => {
    if (preloadStarted) return;
    preloadStarted = true;
    preload();
  };

  const useLiveScrub = !shouldPin && isMobile;

  if (typeof IntersectionObserver === 'undefined') {
    startPreload();
  } else if (!useLiveScrub) {
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        startPreload();
      },
      { rootMargin: '150% 0px' } // بيبلّش قبل شاشة ونص من وصوله
    );
    io.observe(section);
  }

  // ─── وضع «تقليل الحركة»: صورة ثابتة بدون تثبيت ولا سكرَب ───
  if (reduceMotion) {
    section.classList.add('seq-static');
    if (intro) intro.style.opacity = '1';
    return;
  }

  // ─── ربط السكرول بالفريمات ───
  let frame = 0;

  // ═══════════════════════════════════════════════════════════════
  //  ⚠️⚠️ المسار الحي — علاج «الفيديو معلّق عالموبايل» ⚠️⚠️
  //
  //  عالموبايل الأقسام البعيدة عليها content-visibility: auto
  //  (شوف global.css) — يعني ارتفاعها **تقديري** (٧٠٠ بكسل) لحد
  //  ما توصلها، وأول ما تنرسم بياخد ارتفاعها الحقيقي. النتيجة:
  //  مواقع كل اللي تحتها بتزحف آلاف البكسلات عن الأرقام اللي
  //  حفظها ScrollTrigger وقت الحساب — قسناها: انحراف ٢٦٧٦ بكسل
  //  عند قسم المواقع. فالتمرير الحقيقي بيمرق عن النطاق المحفوظ
  //  والفيديو بيضل واقف عالفريم الأول، وحتى مراقب التحميل ما
  //  بيوصله الحدث لأن القسم «مقفّز» لحظة المراقبة.
  //
  //  الحل: الفيديو غير المثبّت عالموبايل ما بيعتمد على أرقام
  //  محفوظة أبداً — بيقرأ موقعه الحقيقي (getBoundingClientRect)
  //  مع كل حركة سكرول وبيحسب تقدّمه منه مباشرة. محصّن ضد أي
  //  زحف، وقراءة عنصر واحد بالإطار ما بتنحس.
  //  (الديسكتوب بيضل على ScrollTrigger — ما عليه content-visibility
  //   والتثبيت بده نظامه الكامل.)
  // ═══════════════════════════════════════════════════════════════
  if (useLiveScrub) {
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight;

      // التحميل بيبلّش لما يصير القسم على بعد شاشتين ونص
      if (r.top < vh * 2.5) startPreload();

      // نفس نطاق النسخة المثبّتة سابقاً: الرحلة من دخوله من تحت
      // (top = vh) لظهوره كامل (bottom = vh)
      const p = Math.min(1, Math.max(0, (vh - r.top) / (r.height || 1)));

      const target = Math.round(p * (count - 1));
      if (target !== frame) {
        frame = target;
        current = target;
        draw(target);
      }

      if (intro) {
        const ip = Math.min(p / INTRO_FADE_END, 1);
        intro.style.opacity = String(1 - ip);
      }
      if (outro) {
        const op = Math.min(1, Math.max(0, (p - OUTRO_START) / (1 - OUTRO_START - 0.05)));
        outro.style.opacity = String(op);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    const lenis = window.__lenis;
    if (lenis && typeof lenis.on === 'function') lenis.on('scroll', onScroll);

    update();

    // دالة تنظيف — motion.js بيسجّلها وبينفّذها قبل مغادرة الصفحة
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (lenis && typeof lenis.off === 'function') lenis.off('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }

  // هل العنصر بأعلى الصفحة؟ (بيغيّر نطاق الرحلة — شوف تحت)
  const atPageTop = section.getBoundingClientRect().top + window.scrollY < window.innerHeight * 0.5;

  // ═══════════════════════════════════════════════════════════════
  //  ⚠️⚠️ اللفافة الثابتة — علاج رمشة نص الهيرو من جذرها ⚠️⚠️
  //
  //  GSAP لما يثبّت عنصر بيلفّه بـ pin-spacer بيصنعه بنفسه، ونقل
  //  عنصر بالصفحة بيعيد تشغيل كل أنيميشن CSS جوّاه من الصفر. ومع
  //  إعادات الحساب وقت التحميل كان نص الهيرو يدخل وينقطع ويرجع —
  //  قسناها بـ _check/flicker.mjs: ١٤ رمشة بالريفرش الواحد.
  //
  //  الحل: اللفافة موجودة بالـ HTML سلفاً (div[data-pin-spacer]
  //  حوالين العنصر المثبّت)، ومنمرّرها لـ GSAP بخاصية pinSpacer —
  //  فبيستعملها بدل ما يصنع وحدة، وما بينقل ولا عنصر أبداً.
  // ═══════════════════════════════════════════════════════════════
  const pinned = shouldPin ? sticky || section : null;
  const spacer =
    pinned && pinned.parentElement?.hasAttribute('data-pin-spacer')
      ? pinned.parentElement
      : undefined;

  ScrollTrigger.create({
    trigger: section,
    // ─── مثبّت: الرحلة تبدأ لما يوصل أعلى الشاشة وتاخد المسافة المحددة
    // ─── غير مثبّت: الرحلة تبدأ لما يدخل من تحت وتخلص لما يصير ظاهر بالكامل
    //     (مهم: مش 'bottom top' لأنها بتخلي آخر الفيديو يشتغل والسكشن طالع
    //      من الشاشة، فالزائر ما بيلحق يشوف النهاية)
    // ⚠️ للعناصر غير المثبّتة اللي بأعلى الصفحة تماماً: نطاق
    //    'top bottom' → 'bottom bottom' بيخلص قبل ما يبدأ الزائر
    //    ينزل أصلاً، فالفيديو بيطلع ثابت. فمنبدأ من أعلى الشاشة.
    start: shouldPin ? 'top top' : atPageTop ? 'top top' : 'top bottom',
    end: shouldPin
      ? () => `+=${window.innerHeight * scrollLength}`
      : section.dataset.seqEnd || (atPageTop ? 'bottom top' : 'bottom bottom'),
    pin: pinned || false,
    pinSpacer: spacer,
    anticipatePin: shouldPin ? 1 : 0,
    scrub: 0.5,
    invalidateOnRefresh: true,
    refreshPriority: priority,
    onUpdate(self) {
      // ⚠️⚠️ ليش منجبر التقدّم صفر لما نكون بأعلى الصفحة؟ ⚠️⚠️
      //  شفافية نص الهيرو مربوطة بتقدّم السكرول. ووقت التحميل
      //  ScrollTrigger بيعيد الحساب أربع مرات (١٢٠ · ٤٠٠ · ٩٠٠ · ١٨٠٠
      //  مللي) لأن ارتفاعات الأقسام بتتغيّر وهي عم تتشكّل. وبكل مرة
      //  كان التقدّم ينط لرقم غلط للحظة — فالنص يذوب ويرجع، يذوب
      //  ويرجع. هاد اللي كان بيبيّن كأن الهيرو بيتحمّل ٣ مرات.
      //  الحقيقة البسيطة: إذا الزائر بأعلى الصفحة، التقدّم صفر. نقطة.
      const atTop = window.scrollY <= 1;
      const prog = atTop ? 0 : self.progress;

      const target = Math.round(prog * (count - 1));
      if (target !== frame) {
        frame = target;
        current = target;
        draw(target);
      }

      // النص الافتتاحي: بيرتفع ويصغر ويذوب مع سكرولك
      if (intro) {
        const p = Math.min(prog / INTRO_FADE_END, 1);
        const lift = window.innerHeight * INTRO_LIFT_RATIO;
        intro.style.opacity = String(1 - p);
        intro.style.transform = `translate3d(0, ${-p * lift}px, 0) scale(${1 - p * 0.06})`;
        intro.style.pointerEvents = p >= 1 ? 'none' : '';
      }

      // الجملة الختامية: بتطلع من تحت وبتوضح
      if (outro) {
        const p = gsap.utils.clamp(
          0,
          1,
          (prog - OUTRO_START) / (1 - OUTRO_START - 0.05)
        );
        outro.style.opacity = String(p);
        outro.style.transform = `translate3d(0, ${(1 - p) * OUTRO_RISE_RATIO * window.innerHeight}px, 0)`;
      }
    },
  });
}
