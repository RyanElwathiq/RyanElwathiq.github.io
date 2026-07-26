// ═══════════════════════════════════════════════════════════════
//  نظام الحركة — GSAP + Lenis
//  كل أنيميشن بالموقع بيتعرّف هون (ملف واحد، نظام واحد)
// ═══════════════════════════════════════════════════════════════
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

// احترام إعداد «تقليل الحركة» عند المستخدم (وصولية — إجباري)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion) {
  // ─────────────────────────────────────────────
  //  1) السكرول الناعم (Lenis)
  // ─────────────────────────────────────────────
  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
  });

  // ربط Lenis مع ساعة GSAP عشان يكونوا متزامنين تماماً
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // ─────────────────────────────────────────────
  //  2) أنيميشن دخول الـ Hero (بيشتغل مرة عند فتح الصفحة)
  // ─────────────────────────────────────────────
  const heroLines = document.querySelectorAll('[data-hero-line]');
  const heroFades = document.querySelectorAll('[data-hero-fade]');
  const knot = document.querySelector('[data-knot]');

  if (heroLines.length) {
    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // سطور العنوان بتطلع من تحت القناع سطر سطر
    intro.from(heroLines, {
      yPercent: 115,
      duration: 1.1,
      stagger: 0.12,
    });

    // النص والأزرار بيظهروا بعدها بنعومة
    intro.to(
      heroFades,
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
      '-=0.55'
    );

    // العقدة بتتنفّس للوجود: تكبير خفيف + ظهور
    if (knot) {
      intro.fromTo(
        knot,
        { opacity: 0, scale: 0.88, rotate: -8 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.6, ease: 'power3.out' },
        0.2
      );
    }
  }

  // تجهيز عناصر الظهور: نحطها تحت شوي قبل ما تبين
  gsap.set(heroFades, { y: 26 });

  // ─────────────────────────────────────────────
  //  3) حركة العقدة مع السكرول (باراللاكس + دوران بطيء)
  // ─────────────────────────────────────────────
  if (knot) {
    // دوران مستمر بطيء جداً (دورة كاملة كل 120 ثانية)
    gsap.to(knot.querySelector('img'), {
      rotate: 360,
      duration: 120,
      repeat: -1,
      ease: 'none',
    });

    // مع السكرول: العقدة بتنزاح لفوق أبطأ من الصفحة (عمق)
    gsap.to(knot, {
      yPercent: -30,
      ease: 'none',
      scrollTrigger: {
        trigger: '[data-hero]',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
} else {
  // وضع «تقليل الحركة»: كل إشي ظاهر وثابت
  document.querySelectorAll('[data-knot]').forEach((el) => {
    el.style.opacity = '1';
  });
}
