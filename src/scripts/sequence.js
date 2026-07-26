// ═══════════════════════════════════════════════════════════════
//  محرك السكرول-سيكوينس (زي أبل): فيديو مفكفك لفريمات WebP
//  بينرسم على Canvas وبيتحرك فريم-فريم مع سكرول الزائر
//
//  ┌─────────────── لوحة التحكم — عدّل من هون ───────────────┐
//  │ SCROLL_LENGTH : طول رحلة السكرول (3 = ثلاث شاشات)        │
//  │ INTRO_FADE_END: النص الافتتاحي بيختفي عند هالنسبة (0-1)  │
//  │ OUTRO_START   : النص الختامي بيبدأ يظهر عند هالنسبة      │
//  └───────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SCROLL_LENGTH = 3;      // 👈 كم شاشة بيضل الهيرو مثبّت وانت بتسكرول
const INTRO_FADE_END = 0.22;  // 👈 العنوان الافتتاحي بيختفي بأول 22% من الرحلة
const OUTRO_START = 0.68;     // 👈 الجملة الختامية بتبدأ تظهر عند 68%

// الموبايل بياخد فريمات عمودية، والديسكتوب بياخد عريضة
const MOBILE_BREAKPOINT = 768;

export async function initSequence() {
  const section = document.querySelector('[data-seq]');
  if (!section) return;

  const canvas = section.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const intro = section.querySelector('[data-seq-intro]');
  const outro = section.querySelector('[data-seq-outro]');
  const fallback = section.querySelector('[data-seq-fallback]');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── اختيار مجلد الفريمات حسب حجم الشاشة ───
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const dir = isMobile ? section.dataset.seqMobile : section.dataset.seqDesktop;

  // ─── تحميل المانيفست (وصف الفريمات) ───
  let manifest;
  try {
    const res = await fetch(`${dir}manifest.json`);
    if (!res.ok) throw new Error('no manifest');
    manifest = await res.json();
  } catch {
    // ما في فريمات؟ منوقع بهدوء على الخلفية الثابتة (العقدة)
    if (fallback) fallback.style.opacity = '1';
    section.classList.add('seq-static');
    return;
  }

  const count = manifest.frame_count;
  const pad = String(manifest.filename_pattern.match(/%0(\d+)d/)[1]);
  const name = (i) => `${dir}frame_${String(i).padStart(Number(pad), '0')}.webp`;

  // ─── تحميل الصور: الفريم الأول فوراً، والباقي بالخلفية ───
  const images = new Array(count);
  const loaded = new Array(count).fill(false);
  let current = 0;

  const load = (i) =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        images[i] = img;
        loaded[i] = true;
        resolve();
      };
      img.onerror = resolve;
      img.src = name(i);
    });

  await load(0); // أول فريم لازم يبين فوراً

  // ─── الرسم بأسلوب "cover" (يغطي الشاشة مهما كان قياسها) ───
  function draw(i) {
    // لو الفريم المطلوب لسا ما نزل، منرسم أقرب فريم جاهز قبله
    let k = i;
    while (k > 0 && !loaded[k]) k--;
    const img = images[k];
    if (!img) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth * dpr;
    const ch = canvas.clientHeight * dpr;
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }

    const ir = img.width / img.height;
    const cr = cw / ch;
    let dw, dh;
    if (cr > ir) {
      dw = cw;
      dh = cw / ir;
    } else {
      dh = ch;
      dw = ch * ir;
    }
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  }

  draw(0);

  // أي تغيير بحجم الكانفاس (فتح النافذة، تدوير الجهاز، تكبير...)
  // → منعيد الرسم فوراً عشان ما تبين الصورة مبكسلة
  const ro = new ResizeObserver(() => draw(current));
  ro.observe(canvas);
  document.addEventListener('visibilitychange', () => draw(current));

  // باقي الفريمات بتنزل بالخلفية (٦ بنفس الوقت — توازن سرعة/ضغط)
  (async () => {
    const CONCURRENCY = 6;
    let next = 1;
    async function worker() {
      while (next < count) {
        const i = next++;
        await load(i);
        if (i === current) draw(i); // لو وصلنا وهو المطلوب حالياً، ارسمه
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  })();

  // ─── وضع «تقليل الحركة»: صورة ثابتة بدون تثبيت ولا سكرَب ───
  if (reduceMotion) {
    section.classList.add('seq-static');
    if (intro) intro.style.opacity = '1';
    return;
  }

  // ─── ربط السكرول بالفريمات ───
  const state = { frame: 0 };

  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: () => `+=${window.innerHeight * SCROLL_LENGTH}`,
    pin: section.querySelector('[data-seq-sticky]'),
    scrub: 0.5,
    onUpdate(self) {
      // نسبة السكرول (0 → 1) بتتحول لرقم فريم
      const target = Math.round(self.progress * (count - 1));
      if (target !== state.frame) {
        state.frame = target;
        current = target;
        draw(target);
      }

      // النص الافتتاحي بيذوب ويرتفع بأول جزء من الرحلة
      if (intro) {
        const p = Math.min(self.progress / INTRO_FADE_END, 1);
        intro.style.opacity = String(1 - p);
        intro.style.transform = `translateY(${p * -60}px)`;
        intro.style.pointerEvents = p >= 1 ? 'none' : '';
      }

      // الجملة الختامية بتظهر بنهاية الرحلة
      if (outro) {
        const p = gsap.utils.clamp(0, 1, (self.progress - OUTRO_START) / (1 - OUTRO_START - 0.05));
        outro.style.opacity = String(p);
        outro.style.transform = `translateY(${(1 - p) * 40}px)`;
      }
    },
  });

  // عند تغيير قياس النافذة منعيد الرسم (والـ ScrollTrigger بيظبط حاله)
  window.addEventListener('resize', () => draw(state.frame), { passive: true });
}
