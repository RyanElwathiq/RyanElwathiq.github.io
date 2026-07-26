// ═══════════════════════════════════════════════════════════════
//  نظام الحركة العام — GSAP + Lenis
//  (حركة الهيرو السينمائي بملف منفصل: sequence.js)
//
//  ┌────────────── لوحة التحكم ──────────────┐
//  │ SMOOTH_DURATION : نعومة السكرول          │
//  │   (1 = عادي، 1.15 = ناعم، 1.6 = زبدة)    │
//  └──────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initSequence } from './sequence.js';

gsap.registerPlugin(ScrollTrigger);

const SMOOTH_DURATION = 1.15; // 👈 نعومة السكرول

// احترام إعداد «تقليل الحركة» عند المستخدم (وصولية — إجباري)
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─────────────────────────────────────────────
//  1) السكرول الناعم (Lenis)
// ─────────────────────────────────────────────
if (!reduceMotion) {
  const lenis = new Lenis({
    duration: SMOOTH_DURATION,
    smoothWheel: true,
  });

  // ربط Lenis مع ساعة GSAP عشان يكونوا متزامنين تماماً
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
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

    // سطور العنوان بتطلع من ورا القناع سطر سطر
    intro.from(heroLines, {
      yPercent: 115,
      duration: 1.1,
      stagger: 0.12,
    });

    // الوصف والأزرار بيظهروا بعدها بنعومة
    intro.to(heroFades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 }, '-=0.55');
  }
}

// ─────────────────────────────────────────────
//  3) الهيرو السينمائي (فريمات مع السكرول)
// ─────────────────────────────────────────────
initSequence();
