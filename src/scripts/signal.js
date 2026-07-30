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
  // المسار: منقيس عليه مكان السحب
  const track = bar.querySelector('[data-signal-marks]') || bar.querySelector('[data-signal-track]');

  const isAr = document.documentElement.lang === 'ar';
  const cleanups = [];

  // ملاحظة: الكشف التدريجي للجديلة صار بالقص (clip-path)
  // مش بالخط المتقطّع — بنحط النسبة بمتغيّر --p وCSS بيقص الباقي.

  // ═══════════════════════════════════════════════════════════════
  //  ٠) تثبيت الشريط والكبسولة على «الشاشة المرئية»
  //
  //  المشكلة اللي بتحلّها هاي:
  //  عالموبايل، شريط عنوان المتصفح بينسحب لفوق وأنت نازل بالصفحة.
  //  وقتها المتصفح **ما بيحرّك** العناصر الثابتة (position:fixed)
  //  معه — بيخليها مربوطة بأعلى «صفحة التخطيط» اللي صارت مخفية
  //  فوق حافة الشاشة. فالشريط بينقصّ من فوق وبتختفي محتوياته،
  //  وبيرجع طبيعي أول ما تطلع لأن الشريط تبع المتصفح بيرجع.
  //
  //  ⚠️ ما بتشوف هالمشكلة أبداً عالكمبيوتر، ولا حتى بأدوات فحص
  //     الموبايل — لأنها بتصير بس مع شريط المتصفح الحقيقي.
  //
  //  الحل: بنقيس كل لحظة قديش «الشاشة المرئية» نازلة عن «صفحة
  //  التخطيط»، وبننزّل الشريط والكبسولة بنفس المقدار. عالكمبيوتر
  //  الفرق دايماً صفر، فما بيصير ولا إشي.
  // ═══════════════════════════════════════════════════════════════
  const vv = window.visualViewport;
  if (vv) {
    const navPill = document.querySelector('.nav');

    let lastDrop = -1;

    const pinToVisualTop = () => {
      // بنقيس المسافة بطريقتين ومناخذ الأكبر، لأن المتصفحات
      // بتبلّغ عنها بشكل مختلف:
      //  • offsetTop : المسافة بين أعلى الشاشة المرئية وأعلى
      //                صفحة التخطيط (هاي الأدق لحالة شريط المتصفح)
      //  • pageTop - scrollY : نفس القياس بس محسوب من إحداثيات
      //                        الصفحة (احتياط لو الأولى رجّعت صفر)
      const byOffset = vv.offsetTop || 0;
      const byPage = (vv.pageTop ?? 0) - window.scrollY;
      const drop = Math.max(0, Math.round(Math.max(byOffset, byPage)));

      // ما منلمس الستايل إلا لما يتغيّر الرقم فعلاً — بدون هالشرط
      // منكتب على العنصر بكل إطار سكرول وبيصير الموقع أثقل
      if (drop === lastDrop) return;
      lastDrop = drop;

      const t = drop > 0 ? `translate3d(0, ${drop}px, 0)` : 'translateZ(0)';
      bar.style.transform = t;
      if (navPill) navPill.style.transform = t;
    };

    // بنسمع من كل المصادر: الشاشة المرئية بترسل أحداثها لحالها،
    // والسكرول العادي بيمسك الحالات اللي ما بترسل حدث
    vv.addEventListener('resize', pinToVisualTop);
    vv.addEventListener('scroll', pinToVisualTop);
    window.addEventListener('scroll', pinToVisualTop, { passive: true });
    window.addEventListener('resize', pinToVisualTop);
    pinToVisualTop();

    cleanups.push(() => {
      vv.removeEventListener('resize', pinToVisualTop);
      vv.removeEventListener('scroll', pinToVisualTop);
      window.removeEventListener('scroll', pinToVisualTop);
      window.removeEventListener('resize', pinToVisualTop);
      // منرجّع الشريط لوضعه الطبيعي قبل الانتقال لصفحة ثانية
      bar.style.transform = '';
      if (navPill) navPill.style.transform = '';
    });
  }

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

  // حالة تهدئة الرجفة أثناء القفزات السريعة (شوف الشرح بـ update)
  let lastP = 0;
  let hushed = false;
  let settleBadge = 0;
  cleanups.push(() => clearTimeout(settleBadge));

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
        // بعد إخفاء الاسم منعيد قياس الأيقونة لوحدها
        lastRight = el.getBoundingClientRect().right;
      } else {
        lastRight = r.right;
      }
    });

    // ═══════════════════════════════════════════════════════════
    //  ٣) نبعّد المتلاصقين
    //
    //  ⚠️⚠️ عطل حقيقي كان هون ⚠️⚠️
    //  العلامات بتتحط بموقعها الحقيقي بالنسبة لطول الصفحة. ولما
    //  قسمين قريبين من بعض، أيقوناتهم بتتراكب فوق بعض حرفياً —
    //  فالضغط على وحدة بيوصل للثانية، والأولى بتصير مش قابلة
    //  للضغط أصلاً.
    //  هاد اللي خلّى ريّان يقول «عين البراند مش موجودة»: هي
    //  موجودة، بس مدفونة تحت «من أنا».
    //  الحل: بعد التوزيع، منمشي على الترتيب ومنزحزح أي علامة
    //  قريبة أكثر من اللازم — إزاحة بصرية صغيرة، والرابط بيضل
    //  رايح لقسمه الصحيح.
    // ═══════════════════════════════════════════════════════════
    const trackEl = marks[0]?.parentElement;
    if (!trackEl) return;
    const trackW = trackEl.getBoundingClientRect().width;
    if (trackW <= 0) return;

    // أقل فراغ بين علامة وعلامة (بالبكسل)
    const CLEAR = 6;

    // ⚠️ منقيس العرض الحقيقي لكل علامة مش رقم ثابت: العلامة اللي
    //    اسمها ظاهر عرضها ٨٠ بكسل واللي أيقونة بس عرضها ١٩ —
    //    فخطوة ثابتة بتفشل مع الخليط. ومنعيد الحساب مرتين لأن
    //    الإزاحة نفسها بتغيّر المواقع.
    const seq = marks
      .filter((m) => m.style.display !== 'none')
      .map((m) => ({ el: m, at: parseFloat(m.dataset.at || '0') * 100 }))
      .sort((a, b) => a.at - b.at);

    for (let pass = 0; pass < 2; pass++) {
      let prevRight = -Infinity;
      seq.forEach((s) => {
        const w = s.el.getBoundingClientRect().width || 20;
        // العلامة متمركزة على موقعها، فنصف عرضها بيطلع لكل جهة
        const halfPct = (w / 2 / trackW) * 100;
        const clearPct = (CLEAR / trackW) * 100;
        const wantLeft = s.at - halfPct;
        const left = Math.max(wantLeft, prevRight + clearPct);
        s.pos = Math.min(left + halfPct, 100);
        prevRight = s.pos + halfPct;
      });

      // تجاوزنا الطرف؟ منرجّع الكل للورا بنفس المقدار
      const over = prevRight - 100;
      if (over > 0) seq.forEach((s) => (s.pos = Math.max(0, s.pos - over)));

      seq.forEach((s) => {
        s.el.style.insetInlineStart = s.pos.toFixed(2) + '%';
        s.at = s.pos; // الجولة الجاية بتنطلق من الموقع الجديد
      });
    }
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

    // ⚠️⚠️ ليش التحقّق من التغيّر الكبير؟ ⚠️⚠️
    //  شارة النسبة بتمرق فوق أسماء الأقسام وهي ماشية، ومنخفي
    //  الاسم اللي هي واقفة فوقه. بس لما الزائر يضغط على قسم بعيد،
    //  الشارة بتطير من ٢٪ لـ ٨٠٪ بلحظة — فبتمرق فوق **كل**
    //  الأسماء وحدة وحدة، وكل وحدة بتختفي وبترجع بسرعة.
    //  النتيجة اللي وصفها ريّان: «كأنه الكود بينكتب وبينمسح
    //  وبيرجع ينكتب بسرعة».
    //  الحل: أثناء الحركة السريعة منوقّف الفحص ومنرجّع كل الأسماء،
    //  ولما تهدا الحركة منحسب مرة وحدة بس.
    const fast = Math.abs(p - lastP) > 0.012;
    lastP = p;

    if (!pct) return;

    if (fast) {
      if (!hushed) {
        hushed = true;
        marks.forEach((m) => m.removeAttribute('data-under-badge'));
      }
      clearTimeout(settleBadge);
      settleBadge = setTimeout(() => {
        hushed = false;
        syncBadge();
      }, 140);
      return;
    }
    if (!hushed) syncBadge();
  };

  // بتحسب أي اسم مغطّى بالشارة — بتنادى لما تهدا الحركة بس
  const syncBadge = () => {
    if (!pct) return;
    const b = pct.getBoundingClientRect();
    marks.forEach((m) => {
      const name = m.querySelector('.name');
      if (!name || m.hasAttribute('data-crowded')) {
        m.removeAttribute('data-under-badge');
        return;
      }
      const r = name.getBoundingClientRect();
      const hit = b.left < r.right + BADGE_GAP && b.right > r.left - BADGE_GAP;
      // ⚠️ منكتب بس لما الحالة تتغيّر فعلاً.
      //    الكتابة بنفس القيمة مع كل حركة سكرول بتعتبر تغيير عند
      //    المتصفح، فبيعيد حساب التنسيق بلا داعي — وهاد جزء من
      //    الرجفة اللي لاحظها ريّان.
      const had = m.hasAttribute('data-under-badge');
      if (hit === had) return;
      if (hit) m.setAttribute('data-under-badge', '');
      else m.removeAttribute('data-under-badge');
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

  // ═══════════════════════════════════════════════════════════
  //  ٣ب) سحب شارة النسبة = تمرير الموقع
  //
  //  زي شريط التمرير تبع المتصفح بالضبط: بتضغط على المربّع اللي
  //  فيه النسبة، وبتضل ضاغط وتسحب يمين أو شمال، والصفحة بتمشي
  //  معك مباشرة. ولما تفلت بتوقف.
  //
  //  ⚠️ الحركة فورية بدون نعومة عن قصد: السحب لازم يحسّ إنه
  //     ملزوق بإصبعك. لو مرّرناه على السكرول الناعم بيتأخّر عنك
  //     وبتحسّه معلّق.
  //  ⚠️ بالعربي الشريط معكوس (RTL) فالحساب بينعكس معه.
  // ═══════════════════════════════════════════════════════════
  if (pct && track) {
    let dragging = false;

    const applyFromX = (clientX) => {
      const r = track.getBoundingClientRect();
      if (r.width <= 0) return;
      let p = (clientX - r.left) / r.width;
      if (document.documentElement.dir === 'rtl') p = 1 - p;
      p = Math.min(1, Math.max(0, p));

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = p * max;
      const lenisNow = window.__lenis;
      if (lenisNow) lenisNow.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
      update();
    };

    const onDown = (e) => {
      dragging = true;
      pct.setPointerCapture?.(e.pointerId);
      pct.classList.add('is-dragging');
      document.documentElement.classList.add('signal-dragging');
      applyFromX(e.clientX);
      e.preventDefault();
    };

    const onMove = (e) => {
      if (!dragging) return;
      applyFromX(e.clientX);
      e.preventDefault();
    };

    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      pct.releasePointerCapture?.(e.pointerId);
      pct.classList.remove('is-dragging');
      document.documentElement.classList.remove('signal-dragging');
      // بعد ما يفلت منرجّع فحص الأسماء مرة وحدة
      hushed = false;
      syncBadge();
    };

    pct.addEventListener('pointerdown', onDown);
    pct.addEventListener('pointermove', onMove);
    pct.addEventListener('pointerup', onUp);
    pct.addEventListener('pointercancel', onUp);
    cleanups.push(() => {
      pct.removeEventListener('pointerdown', onDown);
      pct.removeEventListener('pointermove', onMove);
      pct.removeEventListener('pointerup', onUp);
      pct.removeEventListener('pointercancel', onUp);
      document.documentElement.classList.remove('signal-dragging');
    });
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
