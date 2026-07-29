// ═══════════════════════════════════════════════════════════════
//  الأشرطة الأفقية (الكاروسيلات) — سحب + عجلة + لمس
//
//  ⚠️⚠️ ثلاث مشاكل حقيقية كانت هون ⚠️⚠️
//
//  ١) عجلة الماوس فوق الشريط كانت **بتجمّد الصفحة**.
//     السبب: كان مكتوب data-lenis-prevent على الشريط، فالسكرول
//     الناعم (Lenis) بيتجاهل العجلة تماماً، والمتصفح ما بيقدر
//     يمرّر الشريط عمودياً (هو أفقي بس) — فما بيصير ولا إشي.
//     الحل: شيلنا data-lenis-prevent، وصار العمودي يمرّر الصفحة
//     عادي، وإحنا بنتدخّل بس بالأفقي.
//
//  ٢) حركة الإصبعين على الماوس باد (تمرير أفقي) ما كانت تشتغل،
//     لأن Lenis بياخد كل أحداث العجلة. الحل: منمسك الحدث على
//     الشريط ومنوقّف انتشاره لما يكون الأفقي أقوى من العمودي.
//
//  ٣) التصميم كان بيوحي إنه بينسحب بالماوس — وما كان بينسحب.
//
//  ⚠️⚠️ ليش ما استخدمنا GSAP Draggable؟ ⚠️⚠️
//  جرّبناها بـ type:'scrollLeft' وطلعت تكسر الشريط: Draggable
//  بتلفّ محتوى العنصر بـ div جديد (ScrollProxy) وبتحوّل التمرير
//  لـ transform. النتيجة: scrollWidth بيصير = clientWidth، يعني
//  الأزرار وscroll-snap و«وصلت للطرف» كلهم بيبطلوا يشتغلوا.
//  فالسحب هون مكتوب بأحداث المؤشّر على التمرير الأصلي — أبسط،
//  وبيحافظ على كل إشي بيعطيه المتصفح مجاناً.
//
//  ✏️ الاستخدام: حط data-rail على العنصر اللي بينسحب
// ═══════════════════════════════════════════════════════════════

// أقل حركة بالبكسل عشان نعتبرها «سحبة» مش «ضغطة»
const DRAG_MIN = 6;
// معامل تباطؤ الاندفاع بعد ما تفلت (٠.٩٥ = بيطول شوي)
const FRICTION = 0.94;

export function initRails() {
  const cleanups = [];

  document.querySelectorAll('[data-rail]').forEach((rail) => {
    const pannable = () => rail.scrollWidth - rail.clientWidth > 2;

    // ═══ ١) العجلة والماوس باد ═══
    const onWheel = (e) => {
      if (!pannable()) return;

      // أفقي أقوى من عمودي = المستخدم بده يمرّر الشريط
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // ⚠️ stopPropagation ضرورية: Lenis سامع على window، ومنمنع
        //    الحدث يوصله عشان ما ياخد الحركة ويحوّلها سكرول عمودي
        e.stopPropagation();
        e.preventDefault();
        rail.scrollLeft += e.deltaX;
      }
      // عمودي؟ ما منعمل إشي — منخلّي Lenis يمرّر الصفحة زي ما لازم
    };
    rail.addEventListener('wheel', onWheel, { passive: false });
    cleanups.push(() => rail.removeEventListener('wheel', onWheel));

    // ═══ ٢) السحب بالماوس مع اندفاع ═══
    let down = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let vel = 0;
    let raf = 0;

    const glide = () => {
      vel *= FRICTION;
      if (Math.abs(vel) < 0.4) {
        raf = 0;
        return;
      }
      rail.scrollLeft -= vel;
      raf = requestAnimationFrame(glide);
    };

    const onDown = (e) => {
      // اللمس بيتصرّف لحاله (touch-action: pan-y بالـ CSS)
      if (e.pointerType === 'touch' || !pannable()) return;
      down = true;
      moved = false;
      startX = lastX = e.clientX;
      startScroll = rail.scrollLeft;
      lastT = e.timeStamp;
      vel = 0;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < DRAG_MIN) return;

      if (!moved) {
        moved = true;
        rail.classList.add('is-dragging');
        // ⚠️ من هون ونازل منمسك المؤشّر: لو الزائر طلع برّا الشريط
        //    وهو ساحب، السحبة بتضل شغّالة بدل ما تنقطع فجأة
        rail.setPointerCapture?.(e.pointerId);
      }

      rail.scrollLeft = startScroll - dx;

      const dt = e.timeStamp - lastT;
      if (dt > 0) vel = ((e.clientX - lastX) / dt) * 16; // بكسل بالإطار
      lastX = e.clientX;
      lastT = e.timeStamp;
      e.preventDefault();
    };

    const onUp = (e) => {
      if (!down) return;
      down = false;
      rail.releasePointerCapture?.(e.pointerId);
      if (!moved) return;
      rail.classList.remove('is-dragging');
      if (Math.abs(vel) > 1) raf = requestAnimationFrame(glide);
    };

    // ⚠️ بعد السحبة المتصفح بيطلق click على الصورة اللي تحت الإصبع.
    //    بدونها كل سحبة كانت بتفتح صورة أو تروح لرابط.
    const onClick = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    rail.addEventListener('pointerdown', onDown);
    rail.addEventListener('pointermove', onMove);
    rail.addEventListener('pointerup', onUp);
    rail.addEventListener('pointercancel', onUp);
    rail.addEventListener('click', onClick, true);
    cleanups.push(() => {
      rail.removeEventListener('pointerdown', onDown);
      rail.removeEventListener('pointermove', onMove);
      rail.removeEventListener('pointerup', onUp);
      rail.removeEventListener('pointercancel', onUp);
      rail.removeEventListener('click', onClick, true);
      if (raf) cancelAnimationFrame(raf);
    });

    // ═══ ٣) الأزرار وحالة الأطراف ═══
    const wrap = rail.closest('[data-rail-wrap]');
    if (!wrap) return;

    const step = () => Math.max(240, rail.clientWidth * 0.8);
    const go = (dir) => () =>
      rail.scrollTo({ left: rail.scrollLeft + dir * step(), behavior: 'smooth' });

    wrap.querySelectorAll('[data-rail-prev]').forEach((b) => {
      const fn = go(-1);
      b.addEventListener('click', fn);
      cleanups.push(() => b.removeEventListener('click', fn));
    });
    wrap.querySelectorAll('[data-rail-next]').forEach((b) => {
      const fn = go(1);
      b.addEventListener('click', fn);
      cleanups.push(() => b.removeEventListener('click', fn));
    });

    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      // ⚠️ بالعربي (RTL) المتصفح بيعطي scrollLeft بالسالب
      const x = Math.abs(rail.scrollLeft);
      wrap.classList.toggle('at-start', x < 4);
      wrap.classList.toggle('at-end', x > max - 4);
      wrap.classList.toggle('no-pan', max < 4);
    };
    sync();
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    // الصور كسولة، فمسافة السحب بتكبر بعد ما تحمّل — منعيد الحساب
    const ro = new ResizeObserver(sync);
    ro.observe(rail);
    cleanups.push(() => {
      rail.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      ro.disconnect();
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
