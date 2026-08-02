// ═══════════════════════════════════════════════════════════════
//  العقدة ثلاثية الأبعاد — تحدّي «اقفل الإشارة» (الغلاف الخفيف)
//
//  على العقدة نقطة ضوء ليمونية، وقدّامها حلقة هدف. مهمتك تلفّ
//  العقدة لحد ما النقطة تدخل الحلقة. كل ما قرّبت، قوّة الإشارة
//  بترتفع — ولما تقفلها بيطلعلك وقتك.
//
//  ⚠️⚠️ ليش الملف مقسوم؟ ⚠️⚠️
//  الرسم ثلاثي الأبعاد بحاجة three.js = ٨٨٠ كيلوبايت. لو نزّلناها
//  مع الصفحة، المتصفح بيتجمّد ٤١٧ جزء من الثانية بنص السكرول لكل
//  زائر — حتى اللي ما بده يلعب. فالمسرح بملف منفصل (KnotStage.jsx)
//  وما بينزل إلا لما يضغط الزائر «شغّل التجربة».
//
//  ┌──────────── 🎛️ لوحة التحكم ────────────┐
//  │ الإعدادات كلها: src/data/knot-config.js │
//  └─────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import { lazy, Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { KNOT } from '../data/knot-config.js';
import '../styles/knot.css';

// ⚠️ import() جوّا lazy = المتصفح ما بينزّل الملف إلا لحظة أول عرض
const KnotStage = lazy(() => import('./KnotStage.jsx'));

export default function Knot({ lang = 'ar' }) {
  const isAr = lang === 'ar';
  // touched = سحب الزائر فعلاً (مش مجرد ضغطة أو رجّة ماوس)
  // moved   = مجموع مسافة السحب، عشان نميّز السحبة عن الرجّة
  const drag = useRef({ vx: 0, vy: 0, on: false, x: 0, y: 0, touched: false, moved: 0 });
  const barRef = useRef(null);
  const pctRef = useRef(null);
  const best = useRef(null);

  const [grabbing, setGrabbing] = useState(false);
  const [ok, setOk] = useState(true);
  const [touch, setTouch] = useState(false);
  const [locked, setLocked] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [visible, setVisible] = useState(false); // القسم على الشاشة؟
  const [started, setStarted] = useState(false); // ضغط الزائر «شغّل»؟
  const stage = useRef(null);
  const startAt = useRef(Date.now());

  // ⚠️ كل فحص للمتصفح لازم يصير هون — الصفحات بتتبنى على السيرفر
  //    وهناك ما في matchMedia ولا document.
  useEffect(() => {
    setTouch(matchMedia('(hover: none)').matches);
    try {
      const c = document.createElement('canvas');
      if (!(c.getContext('webgl2') || c.getContext('webgl'))) setOk(false);
    } catch {
      setOk(false);
    }
  }, []);

  // ⚠️ الرسم ثلاثي الأبعاد كان بيضل شغّال ٦٠ إطار بالثانية حتى وإنت
  //    بآخر الصفحة وما إلك علاقة فيه — يعني كرت الشاشة عم يشتغل عالفاضي
  //    طول الزيارة (بطارية اللابتوب بتنزل والمروحة بتصفّر). منوقفه لما
  //    يطلع برّا الشاشة ومنرجّعه لما يرجع.
  useEffect(() => {
    const el = stage.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { rootMargin: '200px' } // منشغّله شوي قبل ما يوصل عشان يكون جاهز
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // ⚠️ منحدّث الشريط مباشرة بالـ DOM مش بحالة React — لأن التحديث
  //    بيصير ٦٠ مرة بالثانية، ولو مرّرناه عبر React بيعيد رسم
  //    المكوّن كل إطار وبيثقّل الصفحة.
  const onProgress = useCallback((strength) => {
    if (barRef.current) barRef.current.style.width = `${(strength * 100).toFixed(1)}%`;
    if (pctRef.current) pctRef.current.textContent = `${Math.round(strength * 100)}%`;
  }, []);

  const onLock = useCallback(() => {
    setLocked(true);
    const took = (Date.now() - startAt.current) / 1000;
    setSeconds(took);
    if (best.current === null || took < best.current) best.current = took;
  }, []);

  const again = () => {
    setLocked(false);
    setResetKey((k) => k + 1);
    // ⚠️ لازم نصفّر كل إشي — لو ضلّت سرعة أو علامة «لعب» من الجولة
    //    اللي قبل، الجولة الجديدة بتقفل لحالها بدون ما يلمس الزائر
    drag.current.vx = 0;
    drag.current.vy = 0;
    drag.current.on = false;
    drag.current.touched = false;
    drag.current.moved = 0;
    startAt.current = Date.now();
  };

  const t = isAr
    ? {
        kicker: 'تحدّي',
        title: 'اقفل الإشارة.',
        sub: 'على العقدة نقطة ضوء، وقدّامها حلقة. لفّ العقدة لحد ما النقطة تدخل جوّا الحلقة. كل ما قرّبت، قوّة الإشارة بترتفع.',
        why: 'الشعار تبعي عقدة، وهون صارت مجسّم حقيقي بثلاثة أبعاد، مبني بـ React Three Fiber. مش صورة ولا فيديو.',
        strength: 'قوّة الإشارة',
        hint: 'اسحب لتلفّها',
        hintTouch: 'المس واسحب لتلفّها',
        locked: 'قفلت الإشارة 🎯',
        took: (s) => `بـ ${s.toFixed(1)} ثانية`,
        bestLabel: (s) => `أحسن وقت إلك: ${s.toFixed(1)} ثانية`,
        again: 'جرّب مرة ثانية',
        play: 'شغّل التجربة',
        playNote: 'مجسّم حقيقي ثلاثي الأبعاد، بينزّل لما تضغط بس',
        loading: 'جاري التحميل…',
        fallback: 'جهازك ما بيدعم الرسم ثلاثي الأبعاد، فهذا الشعار بصورة عادية.',
      }
    : {
        kicker: 'Challenge',
        title: 'Lock the signal.',
        sub: 'There is a light node on the knot, and a ring in front of it. Spin the knot until the node passes through the ring. The closer you get, the higher the signal strength.',
        why: 'My logo is a knot. Here it is as a real 3D object built with React Three Fiber. Not an image, not a video.',
        strength: 'Signal strength',
        hint: 'Drag to spin',
        hintTouch: 'Touch and drag to spin',
        locked: 'Signal locked 🎯',
        took: (s) => `in ${s.toFixed(1)}s`,
        bestLabel: (s) => `Your best: ${s.toFixed(1)}s`,
        again: 'Try again',
        play: 'Start the experience',
        playNote: 'A real 3D object. Only loads when you ask for it',
        loading: 'Loading…',
        fallback: 'Your device does not support 3D rendering, so here is the logo as an image.',
      };

  // ─── السحب ───
  const onDown = (e) => {
    if (locked) return;
    drag.current.on = true;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
    setGrabbing(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
    // ⚠️ عالّلمس منوقف السكرول الناعم طول اللعب، وإلا بيسرق الحركة
    //    من اللعبة وبتصير الصفحة تهرب منك وإنت بتحاول تلفّ العقدة.
    //    (على الماوس ما إله داعي — السحب بالماوس ما بيعمل سكرول)
    if (e.pointerType !== 'mouse') window.__lenis?.stop();
  };

  // ✏️ قد إيش لازم يسحب عشان تنحسب «لعبة» (بالبكسل)
  const DRAG_THRESHOLD = 12;

  const onMove = (e) => {
    if (!drag.current.on || locked) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current.vx = dx * KNOT.dragPower;
    drag.current.vy = dy * KNOT.dragPower;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;

    // سحبة حقيقية = مسافة واضحة، مش رجّة ماوس بمقدار بكسل
    drag.current.moved += Math.hypot(dx, dy);
    if (drag.current.moved > DRAG_THRESHOLD) drag.current.touched = true;
  };

  const onUp = () => {
    drag.current.on = false;
    setGrabbing(false);
    window.__lenis?.start();
  };

  if (!ok) {
    return (
      <div className="knot3d knot3d-fallback">
        <img src="/assets/logo-white.png" alt="" width="220" height="220" />
        <p>{t.fallback}</p>
      </div>
    );
  }

  return (
    <div className="knot3d">
      <div className="knot3d-copy">
        <p className="knot3d-kicker">{t.kicker}</p>
        <h2>{t.title}</h2>
        <p className="knot3d-sub">{t.sub}</p>

        {/* ─── مقياس قوّة الإشارة ─── */}
        <div className={`knot3d-meter ${locked ? 'is-locked' : ''}`}>
          <div className="knot3d-meter-top">
            <span>{t.strength}</span>
            <b ref={pctRef}>0%</b>
          </div>
          <div className="knot3d-bar">
            <span ref={barRef} />
          </div>
        </div>

        {locked && (
          <div className="knot3d-win" role="status">
            <strong>{t.locked}</strong>
            <span>{t.took(seconds)}</span>
            {best.current !== null && best.current < seconds && (
              <span className="knot3d-best">{t.bestLabel(best.current)}</span>
            )}
            <button type="button" className="btn btn-primary" onClick={again}>
              {t.again}
            </button>
          </div>
        )}

        <p className="knot3d-why">{t.why}</p>
      </div>

      <div
        ref={stage}
        className={`knot3d-stage ${started ? 'is-live' : ''} ${grabbing ? 'is-grabbing' : ''} ${
          locked ? 'is-locked' : ''
        }`}
        /* ⚠️ مشابك السحب ما بتشتغل إلا بعد ما تبلّش اللعبة. قبلها كانت
           تمسك الضغطة (setPointerCapture) وتخطفها من زر «شغّل التجربة»،
           فالزر ما كان ينضغط أبداً. */
        onPointerDown={started ? onDown : undefined}
        onPointerMove={started ? onMove : undefined}
        onPointerUp={started ? onUp : undefined}
        onPointerCancel={started ? onUp : undefined}
        onPointerLeave={started ? onUp : undefined}
      >
        {/* ⚠️ المسرح ما بينزّل إلا لما يضغط الزائر، شوف الشرح فوق */}
        {started ? (
          <Suspense fallback={<div className="knot3d-loading">{t.loading}</div>}>
            <KnotStage
              drag={drag}
              onProgress={onProgress}
              onLock={onLock}
              locked={locked}
              resetKey={resetKey}
              visible={visible}
            />
          </Suspense>
        ) : (
          <button type="button" className="knot3d-play" onClick={() => setStarted(true)}>
            <img src="/assets/logo-white.png" alt="" width="200" height="200" />
            <span className="knot3d-play-btn">{t.play}</span>
            <span className="knot3d-play-note">{t.playNote}</span>
          </button>
        )}

        {started && !locked && (
          <span className="knot3d-hint" aria-hidden="true">
            {touch ? t.hintTouch : t.hint}
          </span>
        )}
      </div>
    </div>
  );
}

