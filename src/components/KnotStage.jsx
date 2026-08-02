// ═══════════════════════════════════════════════════════════════
//  مسرح العقدة ثلاثية الأبعاد — الجزء التقيل (three.js)
//
//  ⚠️⚠️ هذا الملف منفصل عن قصد ⚠️⚠️
//  three.js لحالها ٨٨٠ كيلوبايت. لما كانت مدموجة مع الغلاف، كان
//  المتصفح يقراها كلها بلحظة وصولك للقسم ويتجمّد ٤١٧ جزء من الثانية
//  بنص السكرول — حتى للزائر اللي ما بده يلعب.
//  الآن ما بتنزل إلا لما يضغط «شغّل التجربة».
//
//  ✏️ الإعدادات (السرعة، الاحتكاك، مسافة القفل): src/data/knot-config.js
// ═══════════════════════════════════════════════════════════════
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { KNOT } from '../data/knot-config.js';

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
      {/* ═══ حلقة الهدف، ثابتة بالفراغ ═══ */}
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

export default function KnotStage({ drag, onProgress, onLock, locked, resetKey, visible }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 45 }}
      dpr={[1, 1.6]}
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
  );
}
