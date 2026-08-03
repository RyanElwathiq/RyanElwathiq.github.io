// ═══════════════════════════════════════════════════════════════
//  محرّك الأجسام الثلاثية لصفحات الخدمات (مهمة #59)
//
//  قرار ريّان: عنصر 3D **مخصّص لكل خدمة** — والتنفيذ محرّك واحد
//  وعشر هندسات، مش عشر أنظمة.
//
//  ⚠️ ليش مش Three.js وهي منصّبة أصلاً؟ لأن حزمتها ~١٥٠ كيلوبايت
//     مضغوطة — تلفون متوسط على شبكة أردنية بيدفع ثمنها بكل صفحة
//     خدمة. أجسامنا كلها **خطوط وِرفريم بلون الليموني** (نفس لغة
//     عقدة الهيرو)، وهاي بتنرسم بإسقاط ثلاثي بسيط بـ ~٤ كيلوبايت:
//     نقاط + حواف ← دوران ← إسقاط منظوري ← خطوط كانفاس. النتيجة
//     بالعين نفسها، والكلفة ١٪ منها.
//
//  التفاعل: الجسم بيدور لحاله ببطء، بيميل مع مؤشّر الماوس،
//  والضغطة بتعطيه نبضة (توهّج + دفعة دوران). موقوف برّا الشاشة
//  (IntersectionObserver)، وكثافة أقل عالموبايل، وثابت تماماً
//  مع «تقليل الحركة».
//
//  ✏️ إضافة خدمة جديدة = دالة هندسة جديدة بـ GEOMETRIES تحت.
// ═══════════════════════════════════════════════════════════════

const ACCENT = '#D9FF3F';

// ─────────────────────────────────────────────
//  أدوات بناء الهندسات
//  كل هندسة بترجع { points: [x,y,z][], edges: [a,b,accent?][] }
//  بإحداثيات داخل مكعّب ±1 تقريباً — المحرّك بيتكفّل بالباقي
// ─────────────────────────────────────────────

// عمود رأسي بين نقطتين
function col(points, edges, x, y0, y1, z, accent = 0) {
  const a = points.push([x, y0, z]) - 1;
  const b = points.push([x, y1, z]) - 1;
  edges.push([a, b, accent]);
}

// حلقة أفقية (دائرة مقطّعة) حول المركز
function ring(points, edges, r, y, seg = 28, accent = 0, tilt = 0) {
  const start = points.length;
  for (let i = 0; i < seg; i++) {
    const t = (i / seg) * Math.PI * 2;
    let x = Math.cos(t) * r;
    let yy = y;
    let z = Math.sin(t) * r;
    if (tilt) {
      const c = Math.cos(tilt), s = Math.sin(tilt);
      const y2 = yy * c - z * s;
      z = yy * s + z * c;
      yy = y2;
    }
    points.push([x, yy, z]);
  }
  for (let i = 0; i < seg; i++) edges.push([start + i, start + ((i + 1) % seg), accent]);
}

// ضجيج حتمي — نفس الشكل بكل تحميل (بلا Math.random عشان الثبات)
const hash = (i) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

// ─────────────────────────────────────────────
//  الهندسات العشر — كل خدمة وشكلها
// ─────────────────────────────────────────────
const GEOMETRIES = {
  // SEO: تضاريس ترتيب — أعمدة بارتفاعات متفاوتة، وعمود واحد صاعد
  // ومتوّج بحلقة مدار (الزاحف بيلف حواليه)
  seo(density) {
    const points = [], edges = [];
    const N = Math.round(6 * density) + 3;
    // شبكة أرضية بتربط قواعد الأعمدة — بدونها الأعمدة بتبين
    // «مطر» عائم مش تضاريس واقفة على أرض
    const base = [];
    for (let i = 0; i < N; i++) {
      base.push([]);
      for (let j = 0; j < N; j++) {
        const x = (i / (N - 1) - 0.5) * 2;
        const z = (j / (N - 1) - 0.5) * 2;
        base[i].push(points.push([x, 0.55, z]) - 1);
        const h = 0.15 + hash(i * 31 + j) * 0.55;
        const isStar = i === Math.floor(N * 0.6) && j === Math.floor(N * 0.4);
        col(points, edges, x, 0.55, 0.55 - (isStar ? 1.15 : h), z, isStar ? 1 : 0);
      }
    }
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N - 1; j++) {
        edges.push([base[i][j], base[i][j + 1], 0]);
        edges.push([base[j][i], base[j + 1][i], 0]);
      }
    ring(points, edges, 0.5, -0.75, 30, 1, 0.3);
    return { points, edges };
  },

  // المواقع: لوحة دارة — شبكة أرضية وعقد مرفوعة بروافع
  websites(density) {
    const points = [], edges = [];
    const N = Math.round(5 * density) + 3;
    const start = points.length;
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N; j++)
        points.push([(i / (N - 1) - 0.5) * 2, 0.45, (j / (N - 1) - 0.5) * 2]);
    for (let i = 0; i < N; i++)
      for (let j = 0; j < N - 1; j++) {
        edges.push([start + i * N + j, start + i * N + j + 1, 0]);
        edges.push([start + j * N + i, start + (j + 1) * N + i, 0]);
      }
    // روافع عند عقد مختارة
    for (let k = 0; k < N + 2; k++) {
      const i = Math.floor(hash(k * 7) * N);
      const j = Math.floor(hash(k * 13 + 5) * N);
      const x = (i / (N - 1) - 0.5) * 2;
      const z = (j / (N - 1) - 0.5) * 2;
      col(points, edges, x, 0.45, 0.45 - 0.35 - hash(k) * 0.5, z, k % 3 === 0 ? 1 : 0);
    }
    return { points, edges };
  },

  // الإعلانات: أعمدة نتائج بحلقة راديال — مخطط أداء دائري
  ads(density) {
    const points = [], edges = [];
    const N = Math.round(14 * density) + 6;
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2;
      const r = 0.85;
      const h = 0.25 + hash(i * 3) * 0.75;
      const accent = i === Math.floor(N * 0.7) ? 1 : 0;
      const x = Math.cos(t) * r, z = Math.sin(t) * r;
      col(points, edges, x, 0.5, 0.5 - h * (accent ? 1.3 : 1), z, accent);
    }
    ring(points, edges, 0.85, 0.5, 36, 0);
    return { points, edges };
  },

  // الهوية: مدارات هوية — ثلاث حلقات متعاشقة بميلان مختلف
  branding(density) {
    const points = [], edges = [];
    const seg = Math.round(26 * density) + 12;
    ring(points, edges, 0.9, 0, seg, 0, 0);
    ring(points, edges, 0.9, 0, seg, 0, Math.PI / 3);
    ring(points, edges, 0.9, 0, seg, 1, -Math.PI / 3);
    ring(points, edges, 0.16, 0, 12, 1, Math.PI / 5);
    return { points, edges };
  },

  // السوشال: كوكبة شبكة — نقاط على كرة وخيوط بين الجيران
  social(density) {
    const points = [], edges = [];
    const N = Math.round(22 * density) + 10;
    for (let i = 0; i < N; i++) {
      // توزيع فيبوناتشي عالكرة — منتظم وبلا عشوائية
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = i * 2.39996;
      points.push([Math.cos(t) * r * 0.95, y * 0.95, Math.sin(t) * r * 0.95]);
    }
    // كل نقطة بتتوصل بأقرب جارتين
    for (let i = 0; i < N; i++) {
      const d = [];
      for (let j = 0; j < N; j++) {
        if (i === j) continue;
        const dx = points[i][0] - points[j][0];
        const dy = points[i][1] - points[j][1];
        const dz = points[i][2] - points[j][2];
        d.push([dx * dx + dy * dy + dz * dz, j]);
      }
      d.sort((a, b) => a[0] - b[0]);
      edges.push([i, d[0][1], i % 7 === 0 ? 1 : 0]);
      edges.push([i, d[1][1], 0]);
    }
    return { points, edges };
  },

  // الفيديو: إطارات عائمة بالعمق — فيلم متفكك
  video(density) {
    const points = [], edges = [];
    const N = Math.round(4 * density) + 2;
    for (let k = 0; k < N; k++) {
      const z = (k / (N - 1) - 0.5) * 1.7;
      const s = 0.85 - Math.abs(z) * 0.18;
      const rot = (hash(k * 9) - 0.5) * 0.5;
      const c = Math.cos(rot), si = Math.sin(rot);
      const start = points.length;
      const corners = [[-s, -s * 0.62], [s, -s * 0.62], [s, s * 0.62], [-s, s * 0.62]];
      for (const [x, y] of corners) points.push([x * c - y * si, x * si + y * c, z]);
      const accent = k === Math.floor(N / 2) ? 1 : 0;
      for (let i = 0; i < 4; i++) edges.push([start + i, start + ((i + 1) % 4), accent]);
    }
    return { points, edges };
  },

  // الاستراتيجية: طبقات قرار — ثلاث مستويات ومسار صاعد بينهم
  strategy(density) {
    const points = [], edges = [];
    const N = Math.round(4 * density) + 2;
    const levels = [0.6, 0, -0.6];
    for (const y of levels) {
      const start = points.length;
      for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++)
          points.push([(i / (N - 1) - 0.5) * 1.8, y, (j / (N - 1) - 0.5) * 1.8]);
      for (let i = 0; i < N; i++)
        for (let j = 0; j < N - 1; j++) {
          edges.push([start + i * N + j, start + i * N + j + 1, 0]);
          edges.push([start + j * N + i, start + (j + 1) * N + i, 0]);
        }
    }
    // المسار الصاعد
    const path = [];
    for (let k = 0; k < 3; k++) {
      const i = Math.floor(hash(k * 17 + 2) * N);
      const j = Math.floor(hash(k * 23 + 4) * N);
      path.push(points.push([(i / (N - 1) - 0.5) * 1.8, levels[2 - k], (j / (N - 1) - 0.5) * 1.8]) - 1);
    }
    for (let k = 0; k < path.length - 1; k++) edges.push([path[k], path[k + 1], 1]);
    return { points, edges };
  },

  // الاستشارة: حلقتان متشابكتان — حوار طرفين
  consulting(density) {
    const points = [], edges = [];
    const seg = Math.round(26 * density) + 12;
    // حلقتين متعاشقتين زي حلقات السلسلة
    const start1 = points.length;
    for (let i = 0; i < seg; i++) {
      const t = (i / seg) * Math.PI * 2;
      points.push([Math.cos(t) * 0.62 - 0.32, Math.sin(t) * 0.62, 0]);
    }
    for (let i = 0; i < seg; i++) edges.push([start1 + i, start1 + ((i + 1) % seg), 0]);
    const start2 = points.length;
    for (let i = 0; i < seg; i++) {
      const t = (i / seg) * Math.PI * 2;
      points.push([Math.cos(t) * 0.62 + 0.32, 0, Math.sin(t) * 0.62]);
    }
    for (let i = 0; i < seg; i++) edges.push([start2 + i, start2 + ((i + 1) % seg), 1]);
    return { points, edges };
  },

  // تحليل البيانات: محاور وسحابة نقاط وخط اتجاه صاعد
  data(density) {
    const points = [], edges = [];
    // المحاور الثلاثة
    const o = points.push([-0.9, 0.7, -0.7]) - 1;
    const ax = points.push([0.95, 0.7, -0.7]) - 1;
    const ay = points.push([-0.9, -0.85, -0.7]) - 1;
    const az = points.push([-0.9, 0.7, 0.9]) - 1;
    edges.push([o, ax, 0], [o, ay, 0], [o, az, 0]);
    // سحابة النقاط (نقاط منفردة بتنرسم كنقط)
    const N = Math.round(22 * density) + 8;
    for (let i = 0; i < N; i++) {
      points.push([
        -0.7 + hash(i * 3) * 1.5,
        0.55 - hash(i * 7 + 1) * 1.2,
        -0.55 + hash(i * 11 + 2) * 1.3,
      ]);
    }
    // خط الاتجاه
    const trend = [];
    for (let k = 0; k < 5; k++) {
      trend.push(points.push([-0.8 + k * 0.4, 0.5 - k * 0.28 - hash(k) * 0.1, -0.2 + hash(k * 5) * 0.3]) - 1);
    }
    for (let k = 0; k < trend.length - 1; k++) edges.push([trend[k], trend[k + 1], 1]);
    return { points, edges };
  },

  // وكلاء AI: طبقات عصبية — عقد بثلاث طبقات وخيوط بينها
  'ai-automation'(density) {
    const points = [], edges = [];
    const layers = [3, Math.round(4 * density) + 1, 3];
    const layerIdx = [];
    layers.forEach((n, li) => {
      const idxs = [];
      for (let i = 0; i < n; i++) {
        const y = (i / (n - 1 || 1) - 0.5) * 1.5;
        idxs.push(points.push([(li - 1) * 0.85, y, (hash(li * 9 + i) - 0.5) * 0.3]) - 1);
      }
      layerIdx.push(idxs);
    });
    for (let li = 0; li < layerIdx.length - 1; li++) {
      for (const a of layerIdx[li]) {
        for (const b of layerIdx[li + 1]) {
          const accent = (a + b) % 5 === 0 ? 1 : 0;
          edges.push([a, b, accent]);
        }
      }
    }
    return { points, edges };
  },
};

// الافتراضي لأي خدمة بلا هندسة مخصّصة — كوكبة السوشال محايدة
const fallbackGeometry = GEOMETRIES.social;

// ─────────────────────────────────────────────
//  المحرّك
// ─────────────────────────────────────────────
function startOne(canvas) {
  const service = canvas.dataset.s3d || '';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isPhone = window.innerWidth < 768;

  // كثافة أقل عالموبايل — «منتحكم بشو بيظهر» مش منقلّل الجمال
  const density = isPhone ? 0.6 : 1;
  const { points, edges } = (GEOMETRIES[service] || fallbackGeometry)(density);

  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;
  const dpr = Math.min(window.devicePixelRatio || 1, isPhone ? 1.5 : 2);

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width));
    h = Math.max(1, Math.round(r.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // حالة الحركة
  let t = hash(service.length * 7) * 100; // كل خدمة بتبلّش من زاوية مختلفة
  let targetTiltX = 0, targetTiltY = 0;
  let tiltX = 0, tiltY = 0;
  let pulse = 0; // نبضة الضغطة
  let raf = 0;
  let visible = true;

  const proj = new Array(points.length);

  function draw() {
    ctx.clearRect(0, 0, w, h);

    const rotY = t * 0.22 + tiltY;
    const rotX = 0.42 + tiltX;
    const cy = Math.cos(rotY), sy = Math.sin(rotY);
    const cx = Math.cos(rotX), sx = Math.sin(rotX);
    const scale = Math.min(w, h) * 0.34;
    const D = 3.4;

    for (let i = 0; i < points.length; i++) {
      const [px, py, pz] = points[i];
      // دوران Y ثم X
      let x = px * cy + pz * sy;
      let z = -px * sy + pz * cy;
      let y = py * cx - z * sx;
      z = py * sx + z * cx;
      const f = D / (D - z);
      proj[i] = [w / 2 + x * scale * f, h / 2 + y * scale * f, z];
    }

    const glow = 1 + pulse * 1.6;
    ctx.lineCap = 'round';

    for (const [a, b, accent] of edges) {
      const [x1, y1, z1] = proj[a];
      const [x2, y2, z2] = proj[b];
      const depth = (z1 + z2) / 2; // من -1 تقريباً (بعيد) لـ +1 (قريب)
      const near = Math.min(1, Math.max(0, (depth + 1.1) / 2.2));

      if (accent) {
        const a2 = 0.55 + near * 0.45;
        ctx.strokeStyle = `rgba(217,255,63,${Math.min(1, a2 * glow)})`;
        ctx.lineWidth = 1.6 + near * 0.9 + pulse * 1.2;
        // توهّج للحواف المميزة — عالديسكتوب بس (كلفة عالموبايل)
        if (!isPhone) {
          ctx.shadowColor = ACCENT;
          ctx.shadowBlur = 10 + pulse * 18;
        }
      } else {
        ctx.strokeStyle = `rgba(217,255,63,${(0.08 + near * 0.26) * (1 + pulse * 0.4)})`;
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
      }
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // النقاط المنفردة (اللي مش طرف أي حافة) بتنرسم كنقط — لسحابة البيانات
    for (let i = 0; i < points.length; i++) {
      const used = edgeUse[i];
      if (used) continue;
      const [x, y, z] = proj[i];
      const near = Math.min(1, Math.max(0, (z + 1.1) / 2.2));
      ctx.fillStyle = `rgba(217,255,63,${0.25 + near * 0.55})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.6 + near * 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // مين من النقاط مستعمل بحافة؟ (يتحسب مرة وحدة)
  const edgeUse = new Array(points.length).fill(0);
  for (const [a, b] of edges) {
    edgeUse[a] = 1;
    edgeUse[b] = 1;
  }

  function loop() {
    t += 0.016;
    tiltX += (targetTiltX - tiltX) * 0.06;
    tiltY += (targetTiltY - tiltY) * 0.06;
    pulse *= 0.94;
    draw();
    raf = visible ? requestAnimationFrame(loop) : 0;
  }

  // «تقليل الحركة»: رسمة وحدة ثابتة وخلص
  if (reduce) {
    draw();
    return () => ro.disconnect();
  }

  // الميلان مع المؤشّر — على القسم الأب عشان مساحة التفاعل أوسع
  const stage = canvas.closest('[data-s3d-stage]') || canvas;
  const onMove = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse') return;
    const r = stage.getBoundingClientRect();
    targetTiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.7;
    targetTiltX = ((e.clientY - r.top) / r.height - 0.5) * 0.45;
  };
  const onLeave = () => {
    targetTiltX = 0;
    targetTiltY = 0;
  };
  // الضغطة = نبضة
  const onDown = () => {
    pulse = 1;
  };
  stage.addEventListener('pointermove', onMove, { passive: true });
  stage.addEventListener('pointerleave', onLeave);
  stage.addEventListener('pointerdown', onDown, { passive: true });

  // موقوف برّا الشاشة — ما منحرق بطارية على إشي مش منشاف
  const io = new IntersectionObserver(
    (entries) => {
      const wasVisible = visible;
      visible = entries[0].isIntersecting;
      if (visible && !wasVisible && !raf) raf = requestAnimationFrame(loop);
    },
    { rootMargin: '80px' },
  );
  io.observe(canvas);

  raf = requestAnimationFrame(loop);

  return () => {
    visible = false;
    if (raf) cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    stage.removeEventListener('pointermove', onMove);
    stage.removeEventListener('pointerleave', onLeave);
    stage.removeEventListener('pointerdown', onDown);
  };
}

// ─────────────────────────────────────────────
//  التشغيل والتنظيف — نفس نمط Particles بالضبط
// ─────────────────────────────────────────────
export function initService3D() {
  const stops = [...document.querySelectorAll('canvas[data-s3d]')].map(startOne);
  return () => stops.forEach((fn) => fn && fn());
}
