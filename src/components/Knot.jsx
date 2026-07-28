// ═══════════════════════════════════════════════════════════════
//  العقدة ثلاثية الأبعاد — تحدّي «اقفل الإشارة»
//
//  الفكرة (وليش صار فيها إنجاز):
//  على العقدة نقطة ضوء ليمونية. وقدّامها حلقة هدف ثابتة بالفراغ.
//  مهمتك: تلفّ العقدة لحد ما النقطة تدخل جوّا الحلقة.
//  كل ما قرّبت، «قوّة الإشارة» بترتفع والعقدة بتضوي أكثر —
//  ولما تقفلها بتنفجر بوميض وبيطلعلك الوقت اللي أخذته.
//
//  ليش هالتحدّي بالذات؟ لأنه بيحكي نفس لغة الموقع: إشارة بتضبّطها
//  لحد ما تقفل. مش مجرد مجسّم بيلف بلا هدف.
//
//  🧠 تقنياً: React Three Fiber (غلاف React حوالين three.js).
//
//  ┌──────────── 🎛️ لوحة التحكم ────────────┐
//  │ كل الإعدادات بمتغيّر KNOT تحت مباشرة    │
//  └─────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import '../styles/knot.css';

const KNOT = {
  color: '#D9FF3F',
  radius: 1,
  tube: 0.23,
  p: 2,
  q: 3,
  idleSpin: 0.14, // دوران خفيف قبل ما يبدأ اللعب
  dragPower: 0.006, // قوة استجابة السحب
  friction: 0.93, // العطالة بعد ما تفلّها
  nodeAt: 1.45, // بعد نقطة الضوء عن المركز
  lockDist: 0.42, // قد إيش لازم تقرب عشان تقفل
  reach: 2.6, // المسافة اللي بيبدأ عندها العدّاد يحسب
};

// موقع حلقة الهدف: قدّام العقدة مباشرة باتجاه الكاميرا
const TARGET = new THREE.Vector3(0, 0, KNOT.nodeAt);

function Scene({ drag, onProgress, onLock, locked, resetKey }) {
  const group = useRef();
  const node = useRef();
  const started = useRef(false);
  const tmp = useRef(new THREE.Vector3());

  // كل جولة جديدة: منرجّع العقدة لزاوية عشوائية
  // ⚠️ مش عشوائية بالكامل: لازم نقطة الضوء تبدأ **بالجهة المقابلة**
  //    للحلقة. أول نسخة كانت عشوائية تماماً، فصار إنه أحياناً
  //    تبدأ اللعبة والنقطة أصلاً جوّا الحلقة — يعني بتفوز بصفر
  //    حركة ومن غير ما تلمس إشي. وهاد بيلغي اللعبة أصلاً.
  useEffect(() => {
    if (!group.current) return;
    const spread = 0.9; // شوي عشوائية حوالين الجهة المقابلة
    group.current.rotation.set(
      (Math.random() - 0.5) * spread,
      Math.PI + (Math.random() - 0.5) * spread,
      (Math.random() - 0.5) * 0.6
    );
    started.current = false;
  }, [resetKey]);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;

    // ⚠️⚠️ «بدأ اللعب» بتتقرّر من سحبة حقيقية بس ⚠️⚠️
    //  قبل هيك كنا منعتبرها بدأت لو كان في **أي سرعة** بالعقدة.
    //  والمشكلة إنه العقدة بتلف لحالها قبل اللعب (idleSpin)، وأي
    //  رجّة بسيطة بالماوس كانت بتخلّي السرعة > صفر — فبتنحسب «لعب»،
    //  وبتقفل الإشارة لحالها وبيطلع «جرّب مرة ثانية» فجأة بدون ما
    //  يعمل الزائر إشي. هلق بتتفعّل من onMove بعد مسافة سحب واضحة.
    started.current = drag.current.touched === true;

    if (locked) {
      // بعد القفل: بتلف بهدوء كمكافأة
      g.rotation.y += 0.25 * delta;
    } else {
      // العطالة
      drag.current.vx *= KNOT.friction;
      drag.current.vy *= KNOT.friction;

      g.rotation.x += drag.current.vy;
      g.rotation.y += drag.current.vx;

      // قبل أول لمسة بتلف لحالها عشان تبيّن إنها حيّة
      if (!started.current) g.rotation.y += KNOT.idleSpin * delta;
    }

    // قوّة الإشارة = قد إيش نقطة الضوء قريبة من الحلقة
    if (node.current) {
      // ⚠️ قبل ما يبلّش الزائر، المقياس بيضل صفر. اللفّة التلقائية
      //    كانت بتحرّك النسبة لحالها فبيحس الزائر إنه الرقم عم يلعب
      //    بلا سبب — والمقياس المفروض يعكس شغله هو مش شغل الأنيميشن.
      if (!started.current && !locked) {
        onProgress(0);
        return;
      }
      node.current.getWorldPosition(tmp.current);
      const dist = tmp.current.distanceTo(TARGET);
      const strength = Math.max(0, Math.min(1, 1 - dist / KNOT.reach));
      onProgress(strength, dist);
      if (!locked && dist < KNOT.lockDist) onLock();
    }
  });

  const args = [KNOT.radius, KNOT.tube, 240, 32, KNOT.p, KNOT.q];

  return (
    <>
      {/* ═══ حلقة الهدف — ثابتة بالفراغ ═══ */}
      <mesh position={TARGET} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.34, 0.032, 16, 48]} />
        <meshBasicMaterial
          color={KNOT.color}
          transparent
          opacity={locked ? 0 : 0.75}
        />
      </mesh>

      {/* ═══ العقدة + نقطة الضوء ═══ */}
      <group ref={group}>
        <mesh>
          <torusKnotGeometry args={args} />
          <meshStandardMaterial
            color={KNOT.color}
            emissive={KNOT.color}
            emissiveIntensity={locked ? 0.95 : 0.5}
            roughness={0.42}
            metalness={0.3}
          />
        </mesh>

        {/* شبكة خطوط خفيفة فوقه */}
        <mesh scale={1.012}>
          <torusKnotGeometry args={[KNOT.radius, KNOT.tube, 120, 12, KNOT.p, KNOT.q]} />
          <meshBasicMaterial color={KNOT.color} wireframe transparent opacity={0.16} />
        </mesh>

        {/* نقطة الضوء اللي لازم تدخلها بالحلقة */}
        <mesh ref={node} position={[0, 0, KNOT.nodeAt]}>
          <sphereGeometry args={[0.13, 24, 24]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <pointLight position={[0, 0, KNOT.nodeAt]} intensity={12} distance={2.2} color="#ffffff" />
      </group>
    </>
  );
}

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
        why: 'الشعار تبعي عقدة — وهون صارت مجسّم حقيقي بثلاثة أبعاد، مبني بـ React Three Fiber. مش صورة ولا فيديو.',
        strength: 'قوّة الإشارة',
        hint: 'اسحب لتلفّها',
        hintTouch: 'المس واسحب لتلفّها',
        locked: 'قفلت الإشارة 🎯',
        took: (s) => `بـ ${s.toFixed(1)} ثانية`,
        bestLabel: (s) => `أحسن وقت إلك: ${s.toFixed(1)} ثانية`,
        again: 'جرّب مرة ثانية',
        fallback: 'جهازك ما بيدعم الرسم ثلاثي الأبعاد، فهذا الشعار بصورة عادية.',
      }
    : {
        kicker: 'Challenge',
        title: 'Lock the signal.',
        sub: 'There is a light node on the knot, and a ring in front of it. Spin the knot until the node passes through the ring. The closer you get, the higher the signal strength.',
        why: 'My logo is a knot — here it is as a real 3D object built with React Three Fiber. Not an image, not a video.',
        strength: 'Signal strength',
        hint: 'Drag to spin',
        hintTouch: 'Touch and drag to spin',
        locked: 'Signal locked 🎯',
        took: (s) => `in ${s.toFixed(1)}s`,
        bestLabel: (s) => `Your best: ${s.toFixed(1)}s`,
        again: 'Try again',
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
        className={`knot3d-stage ${grabbing ? 'is-grabbing' : ''} ${locked ? 'is-locked' : ''}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
      >
        <Canvas
          camera={{ position: [0, 0, 4.4], fov: 45 }}
          dpr={[1, 1.6]} /* حدّ الدقة عشان ما يثقل على الأجهزة الضعيفة */
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          frameloop={visible ? 'always' : 'never'}
        >
          <ambientLight intensity={0.7} />
          <pointLight position={[4, 4, 5]} intensity={38} color="#ffffff" />
          <pointLight position={[-5, -3, -2]} intensity={70} color={KNOT.color} />
          <pointLight position={[0, 3, -5]} intensity={45} color={KNOT.color} />
          <Suspense fallback={null}>
            <Scene
              drag={drag}
              onProgress={onProgress}
              onLock={onLock}
              locked={locked}
              resetKey={resetKey}
            />
          </Suspense>
        </Canvas>

        {!locked && (
          <span className="knot3d-hint" aria-hidden="true">
            {touch ? t.hintTouch : t.hint}
          </span>
        )}
      </div>
    </div>
  );
}
