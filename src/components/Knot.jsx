// ═══════════════════════════════════════════════════════════════
//  العقدة ثلاثية الأبعاد — شعارك بس تقدر تلعب فيه
//
//  ليش موجودة: الشعار تبعك عقدة. هون بتصير مجسّم حقيقي بثلاثة
//  أبعاد الزائر بيمسكه ويلفّه بإيده. وهي كمان **إثبات عملي**
//  إنك بتشتغل React و3D — مش بس مكتوب بقائمة المهارات.
//
//  🧠 تقنياً: React Three Fiber (وهي غلاف React حوالين three.js).
//
//  ┌──────────── 🎛️ لوحة التحكم ────────────┐
//  │ كل الإعدادات بمتغيّرات KNOT تحت مباشرة  │
//  └─────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useState, useEffect } from 'react';
import '../styles/knot.css';

const KNOT = {
  color: '#D9FF3F', // لون البراند
  radius: 1, // حجم العقدة
  tube: 0.23, // سماكة الأنبوب (أنحف = أقرب لخطوط الشعار)
  p: 2, // عدد اللفّات (غيّرها بتتغيّر شكل العقدة)
  q: 3,
  autoSpin: 0.16, // سرعة الدوران التلقائي
  dragPower: 0.0055, // قد إيش بتستجيب للسحب
  friction: 0.94, // كل ما قرّبت من 1 كل ما ضلّت تلف أطول بعد ما تفلّها
};

function KnotMesh({ drag }) {
  const mesh = useRef();
  const wire = useRef();

  useFrame((_, delta) => {
    if (!mesh.current) return;
    // الاحتكاك: العقدة بتبطّئ تدريجياً بعد ما يفلّها الزائر
    drag.current.vx *= KNOT.friction;
    drag.current.vy *= KNOT.friction;

    const rx = drag.current.vy;
    const ry = drag.current.vx + KNOT.autoSpin * delta;

    mesh.current.rotation.x += rx;
    mesh.current.rotation.y += ry;
    if (wire.current) {
      wire.current.rotation.x = mesh.current.rotation.x;
      wire.current.rotation.y = mesh.current.rotation.y;
    }
  });

  const args = [KNOT.radius, KNOT.tube, 240, 32, KNOT.p, KNOT.q];

  return (
    <group>
      {/* الجسم المصمت */}
      <mesh ref={mesh}>
        <torusKnotGeometry args={args} />
        {/* ⚠️ الإضاءة البيضاء القوية كانت بتغسل اللون وتحوّله زيتوني.
            فخفّفناها وزوّدنا التوهّج الذاتي عشان يضل لون البراند. */}
        <meshStandardMaterial
          color={KNOT.color}
          emissive={KNOT.color}
          emissiveIntensity={0.55}
          roughness={0.42}
          metalness={0.3}
        />
      </mesh>

      {/* شبكة خطوط فوقه — بتعطيه إحساس «إشارة» بدل كرة بلاستيك */}
      <mesh ref={wire} scale={1.012}>
        <torusKnotGeometry args={[KNOT.radius, KNOT.tube, 120, 12, KNOT.p, KNOT.q]} />
        <meshBasicMaterial color={KNOT.color} wireframe transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

export default function Knot({ lang = 'ar' }) {
  const isAr = lang === 'ar';
  const drag = useRef({ vx: 0, vy: 0, on: false, x: 0, y: 0 });
  const [grabbing, setGrabbing] = useState(false);
  const [ok, setOk] = useState(true);
  const [touch, setTouch] = useState(false);

  // ⚠️ كل فحص للمتصفح لازم يصير هون مش فوق بجسم المكوّن.
  //    الصفحات بتتبنى على السيرفر أول، وهناك ما في متصفح ولا
  //    matchMedia — فأي استدعاء برّا useEffect بيكسر البناء.
  useEffect(() => {
    setTouch(matchMedia('(hover: none)').matches);
    // لو الجهاز ما بيدعم WebGL منعرض الشعار العادي بدل ما ينكسر
    try {
      const c = document.createElement('canvas');
      if (!(c.getContext('webgl2') || c.getContext('webgl'))) setOk(false);
    } catch {
      setOk(false);
    }
  }, []);

  const t = isAr
    ? {
        kicker: 'تجربة',
        title: 'هاي عقدتي. جرّب تلفّها.',
        sub: 'الشعار تبعي عقدة — وهون صارت مجسّم حقيقي بثلاثة أبعاد بتمسكه وتلفّه بإيدك. مبني بـ React Three Fiber، مش صورة ولا فيديو.',
        hint: 'اسحب لتلفّها',
        hintTouch: 'المس واسحب لتلفّها',
        fallback: 'جهازك ما بيدعم الرسم ثلاثي الأبعاد، فهذا الشعار بصورة عادية.',
      }
    : {
        kicker: 'Experiment',
        title: 'This is my knot. Try spinning it.',
        sub: 'My logo is a knot — here it is as a real 3D object you can grab and spin. Built with React Three Fiber. Not an image, not a video.',
        hint: 'Drag to spin',
        hintTouch: 'Touch and drag to spin',
        fallback: 'Your device does not support 3D rendering, so here is the logo as an image.',
      };

  // ─── السحب ───
  const onDown = (e) => {
    drag.current.on = true;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
    setGrabbing(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e) => {
    if (!drag.current.on) return;
    drag.current.vx = (e.clientX - drag.current.x) * KNOT.dragPower;
    drag.current.vy = (e.clientY - drag.current.y) * KNOT.dragPower;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
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
      </div>

      <div
        className={`knot3d-stage ${grabbing ? 'is-grabbing' : ''}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={onUp}
      >
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 45 }}
          dpr={[1, 1.6]} /* منحدّ الدقة عشان ما يثقل على الأجهزة الضعيفة */
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.7} />
          {/* ضوء أبيض خفيف للمعان فقط */}
          <pointLight position={[4, 4, 5]} intensity={38} color="#ffffff" />
          {/* ضوءان ليمونيان بيحافظوا على لون الهوية من كل الجهات */}
          <pointLight position={[-5, -3, -2]} intensity={70} color={KNOT.color} />
          <pointLight position={[0, 3, -5]} intensity={45} color={KNOT.color} />
          <Suspense fallback={null}>
            <KnotMesh drag={drag} />
          </Suspense>
        </Canvas>

        <span className="knot3d-hint" aria-hidden="true">
          {touch ? t.hintTouch : t.hint}
        </span>
      </div>
    </div>
  );
}
