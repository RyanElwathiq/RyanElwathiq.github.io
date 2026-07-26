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
const PRELOAD_CONCURRENCY = 6; // كم فريم بينزل بنفس الوقت

// شغّل كل السيكوينسات الموجودة بالصفحة
export function initSequences() {
  document.querySelectorAll('[data-seq]').forEach((section) => {
    setupOne(section).catch(() => {
      // أي فشل → منرجع للوضع الثابت بهدوء بدل ما ينكسر الموقع
      section.classList.add('seq-static');
    });
  });
}

async function setupOne(section) {
  const canvas = section.querySelector('canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const intro = section.querySelector('[data-seq-intro]');
  const outro = section.querySelector('[data-seq-outro]');
  const fallback = section.querySelector('[data-seq-fallback]');
  const sticky = section.querySelector('[data-seq-sticky]');

  const shouldPin = section.hasAttribute('data-seq-pin');
  const scrollLength = parseFloat(section.dataset.seqLength || '3');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── اختيار مجلد الفريمات حسب حجم الشاشة ───
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
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

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

  // باقي الفريمات بتنزل بالخلفية
  (async () => {
    let next = 1;
    async function worker() {
      while (next < count) {
        const i = next++;
        await load(i);
        if (i === current) draw(i);
      }
    }
    await Promise.all(Array.from({ length: PRELOAD_CONCURRENCY }, worker));
  })();

  // ─── وضع «تقليل الحركة»: صورة ثابتة بدون تثبيت ولا سكرَب ───
  if (reduceMotion) {
    section.classList.add('seq-static');
    if (intro) intro.style.opacity = '1';
    return;
  }

  // ─── ربط السكرول بالفريمات ───
  let frame = 0;

  ScrollTrigger.create({
    trigger: section,
    // ─── مثبّت: الرحلة تبدأ لما يوصل أعلى الشاشة وتاخد المسافة المحددة
    // ─── غير مثبّت: الرحلة تبدأ لما يدخل من تحت وتخلص لما يصير ظاهر بالكامل
    //     (مهم: مش 'bottom top' لأنها بتخلي آخر الفيديو يشتغل والسكشن طالع
    //      من الشاشة، فالزائر ما بيلحق يشوف النهاية)
    start: shouldPin ? 'top top' : 'top bottom',
    end: shouldPin
      ? () => `+=${window.innerHeight * scrollLength}`
      : section.dataset.seqEnd || 'bottom bottom',
    pin: shouldPin ? sticky || section : false,
    scrub: 0.5,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const target = Math.round(self.progress * (count - 1));
      if (target !== frame) {
        frame = target;
        current = target;
        draw(target);
      }

      // النص الافتتاحي: بيرتفع ويصغر ويذوب مع سكرولك
      if (intro) {
        const p = Math.min(self.progress / INTRO_FADE_END, 1);
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
          (self.progress - OUTRO_START) / (1 - OUTRO_START - 0.05)
        );
        outro.style.opacity = String(p);
        outro.style.transform = `translate3d(0, ${(1 - p) * OUTRO_RISE_RATIO * window.innerHeight}px, 0)`;
      }
    },
  });
}
