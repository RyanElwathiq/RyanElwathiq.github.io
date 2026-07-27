// ═══════════════════════════════════════════════════════════════
//  محرّك شريط الإشارة
//
//  بيعمل ٤ أشياء:
//   ١) يرسم الجديلة الليمونية بمقدار ما نزلت بالصفحة
//   ٢) يحرّك شارة النسبة معك
//   ٣) يحط علامات الأقسام بأماكنها الصح (وبيعيد حسابها لما
//      يتغيّر ارتفاع الصفحة بسبب الأقسام المثبّتة)
//   ٤) يشغّل ساعة عمّان الحية
//
//  ┌──────────── 🎛️ لوحة التحكم ────────────┐
//  │ CLOCK_TICK : كل قديش تتحدث الساعة (ملي) │
//  └─────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
const CLOCK_TICK = 1000;

export function initSignalBar() {
  const bar = document.querySelector('[data-signal]');
  if (!bar) return () => {};

  const strands = bar.querySelectorAll('[data-strand]');
  const pct = bar.querySelector('[data-signal-pct]');
  const knot = bar.querySelector('[data-signal-knot]');
  const marks = [...bar.querySelectorAll('[data-mark]')];
  const clock = bar.querySelector('[data-signal-clock]');

  const isAr = document.documentElement.lang === 'ar';
  const cleanups = [];

  // ─────────────────────────────────────────────
  //  ١) الساعة — توقيت عمّان مهما كان جهاز الزائر وين
  // ─────────────────────────────────────────────
  if (clock) {
    const fmt = new Intl.DateTimeFormat(isAr ? 'ar-EG' : 'en-GB', {
      timeZone: 'Asia/Amman',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const tick = () => (clock.textContent = fmt.format(new Date()));
    tick();
    const id = setInterval(tick, CLOCK_TICK);
    cleanups.push(() => clearInterval(id));
  }

  // ─────────────────────────────────────────────
  //  ٢) أماكن علامات الأقسام
  //     بتنحسب كنسبة من طول الصفحة القابل للسكرول
  // ─────────────────────────────────────────────
  const placeMarks = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;

    marks.forEach((m) => {
      const el = document.getElementById(m.dataset.mark);
      if (!el) {
        m.style.display = 'none';
        return;
      }
      const y = el.getBoundingClientRect().top + window.scrollY;
      const p = Math.min(1, Math.max(0, y / max));
      m.style.insetInlineStart = (p * 100).toFixed(2) + '%';
      m.dataset.at = p;
    });
  };

  // ─────────────────────────────────────────────
  //  ٣) التحديث مع كل حركة سكرول
  // ─────────────────────────────────────────────
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

    // الجديلة: بنكشف منها بمقدار التقدّم
    strands.forEach((s) => {
      s.style.strokeDashoffset = String(1 - p);
    });

    // شارة النسبة
    if (pct) {
      pct.textContent = Math.round(p * 100) + '%';
      pct.style.insetInlineStart = (p * 100).toFixed(2) + '%';
    }

    // العقدة بتكتمل بآخر الصفحة
    if (knot) {
      if (p > 0.985) knot.setAttribute('data-complete', '');
      else knot.removeAttribute('data-complete');
    }

    // العلامات اللي مرقنا عليها بتصير أوضح
    marks.forEach((m) => {
      if (parseFloat(m.dataset.at || '1') <= p) m.setAttribute('data-passed', '');
      else m.removeAttribute('data-passed');
    });
  };

  // ⚠️ منربط التحديث بمصدرين:
  //  ١) حدث السكرول العادي للمتصفح
  //  ٢) حدث Lenis نفسه — وهو المصدر الأدق لأن Lenis هو اللي
  //     بيحرّك الصفحة فعلياً، وبيرسل الحدث بنفس لحظة الحركة.
  //     بدونه ممكن الشريط ما يتحدث بحالات معيّنة.
  window.addEventListener('scroll', update, { passive: true });
  cleanups.push(() => window.removeEventListener('scroll', update));

  const lenis = window.__lenis;
  if (lenis && typeof lenis.on === 'function') {
    lenis.on('scroll', update);
    cleanups.push(() => lenis.off && lenis.off('scroll', update));
  }

  // ─────────────────────────────────────────────
  //  ٤) الضغط على علامة = تنقّل للقسم
  // ─────────────────────────────────────────────
  marks.forEach((m) => {
    const go = () => {
      const el = document.getElementById(m.dataset.mark);
      if (!el) return;
      const target = '#' + m.dataset.mark;
      // منستخدم نفس منطق الأنكور بملف motion.js عشان يوصل بدقة
      const link = document.createElement('a');
      link.href = target;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
    };
    m.addEventListener('click', go);
    cleanups.push(() => m.removeEventListener('click', go));
  });

  // ─────────────────────────────────────────────
  //  ٥) إعادة الحساب لما يتغيّر ارتفاع الصفحة
  //     (الأقسام المثبّتة والصور بتغيّره وهي عم تحمّل)
  // ─────────────────────────────────────────────
  const recalc = () => {
    placeMarks();
    update();
  };

  recalc();
  [200, 600, 1200, 2200].forEach((ms) => {
    const id = setTimeout(recalc, ms);
    cleanups.push(() => clearTimeout(id));
  });

  window.addEventListener('resize', recalc, { passive: true });
  window.addEventListener('load', recalc);
  cleanups.push(() => window.removeEventListener('resize', recalc));
  cleanups.push(() => window.removeEventListener('load', recalc));

  // منرجع دالة تنظيف عشان تنستدعى عند الانتقال لصفحة ثانية
  return () => cleanups.forEach((fn) => fn());
}

// بيتصدّر عشان motion.js يعيد حساب العلامات بعد ما يخلص التثبيت
export function refreshSignalBar() {
  window.dispatchEvent(new Event('resize'));
}
