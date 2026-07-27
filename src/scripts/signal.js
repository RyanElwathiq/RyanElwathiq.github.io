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

  const live = bar.querySelector('[data-live]');
  const pct = bar.querySelector('[data-signal-pct]');
  const knot = bar.querySelector('[data-signal-knot]');
  const marks = [...bar.querySelectorAll('[data-mark]')];
  const clock = bar.querySelector('[data-signal-clock]');

  const isAr = document.documentElement.lang === 'ar';
  const cleanups = [];

  // ملاحظة: الكشف التدريجي للجديلة صار بالقص (clip-path)
  // مش بالخط المتقطّع — بنحط النسبة بمتغيّر --p وCSS بيقص الباقي.

  // ─────────────────────────────────────────────
  //  ١) الساعة — توقيت عمّان مهما كان جهاز الزائر وين
  // ─────────────────────────────────────────────
  if (clock) {
    // ✏️ نظام 12 ساعة (بيطلع معه ص/م أو AM/PM).
    //    بدك ترجّعه 24 ساعة؟ خلّي hour12 تساوي false
    //    ⚠️ hour: 'numeric' مش '2-digit' — عشان تطلع «٣:٤٥ م»
    //       مش «٠٣:٤٥ م»، لأن الصفر قبل الرقم بنظام 12 ساعة بشع
    // en-US مش en-GB: بريطانيا بتكتب «pm» صغيرة، وأمريكا «PM» كبيرة
    // وهي أوضح بحجم الخط الصغير تبع الشريط
    const fmt = new Intl.DateTimeFormat(isAr ? 'ar-EG' : 'en-US', {
      timeZone: 'Asia/Amman',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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
  const MARK_GAP = 10; // أقل مسافة مسموحة بين اسمين (بكسل)
  const BADGE_GAP = 6; // هامش حول شارة النسبة قبل ما تخفي الاسم

  const placeMarks = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;

    // ١) نحط كل علامة بمكانها حسب موقع قسمها الفعلي
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
      m.removeAttribute('data-crowded');
    });

    // ٢) كشف التزاحم: لو اسمين متلاصقين، منخفي الثاني ومنخلي شرطته
    //    (بدون هالخطوة كانت الأسماء تتراكب فوق بعض بالأقسام القريبة)
    const boxes = marks
      .filter((m) => m.style.display !== 'none')
      .map((m) => ({ el: m, r: m.getBoundingClientRect() }))
      .sort((a, b) => a.r.left - b.r.left);

    let lastRight = -Infinity;
    boxes.forEach(({ el, r }) => {
      if (r.left < lastRight + MARK_GAP) {
        el.setAttribute('data-crowded', '');
        // بعد إخفاء الاسم منعيد قياس الشرطة لوحدها
        lastRight = el.getBoundingClientRect().right;
      } else {
        lastRight = r.right;
      }
    });
  };

  // ─────────────────────────────────────────────
  //  ٣) التحديث مع كل حركة سكرول
  // ─────────────────────────────────────────────
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

    // الجديلة: بنكشف منها بمقدار التقدّم (القص بـ CSS)
    if (live) live.style.setProperty('--p', p.toFixed(4));

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

    // ⚠️ شارة النسبة بتمرق فوق أسماء الأقسام وهي ماشية.
    //    فبنخفي الاسم اللي هي واقفة فوقه، وبنرجّعه أول ما تبتعد.
    if (pct) {
      const b = pct.getBoundingClientRect();
      marks.forEach((m) => {
        const name = m.querySelector('.name');
        if (!name || m.hasAttribute('data-crowded')) {
          m.removeAttribute('data-under-badge');
          return;
        }
        const r = name.getBoundingClientRect();
        const hit = b.left < r.right + BADGE_GAP && b.right > r.left - BADGE_GAP;
        if (hit) m.setAttribute('data-under-badge', '');
        else m.removeAttribute('data-under-badge');
      });
    }
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
