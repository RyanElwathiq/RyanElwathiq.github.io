// ═══════════════════════════════════════════════════════════════
//  اللايت-بوكس: نافذة تشغيل الفيديو
//  أي زر عليه data-play="رقم_اليوتيوب" بيفتح الفيديو هون
//  (بنستخدم youtube-nocookie: خصوصية أعلى وبدون اقتراحات غريبة)
//
//  ⚠️⚠️ عطل تراكمي كان هون (انصلح 2026-08-03) ⚠️⚠️
//  initLightbox بتنادى مع كل انتقال صفحة (من motion.js)، وكانت
//  كل مرة تسجّل مستمع click جديد على document بلا ما تشيل القديم.
//  والمستمعين القدام ماسكين نافذة الصفحة القديمة المحذوفة — فكل
//  ضغطة فيديو كانت تحاول تفتح نوافذ ميتة (showModal على عنصر
//  برّا الصفحة بيرمي خطأ) قبل ما توصل للنافذة الحية.
//
//  الحل: المستمع بينسجّل **مرة وحدة بالجلسة**، وبيدوّر على
//  النافذة الحالية لحظة الضغط مش لحظة التسجيل. وربط أزرار
//  النافذة نفسها بيصير كسول مع حارس على العنصر.
// ═══════════════════════════════════════════════════════════════
let hooked = false;

// بيجهّز نافذة الصفحة الحالية (مرة وحدة لكل نافذة — في حارس)
function wireDialog(dialog) {
  if (dialog.dataset.lbWired) return;
  dialog.dataset.lbWired = '1';

  const frameWrap = dialog.querySelector('[data-lightbox-frame]');
  const closeBtn = dialog.querySelector('[data-lightbox-close]');

  dialog.addEventListener('close', () => {
    frameWrap?.replaceChildren(); // وقف الفيديو فوراً عند الإغلاق
    document.documentElement.style.overflow = '';
  });

  // إغلاق بالضغط على الخلفية
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });

  closeBtn?.addEventListener('click', () => dialog.close());
}

function open(videoId) {
  const dialog = document.querySelector('[data-lightbox]');
  if (!dialog) return;
  wireDialog(dialog);

  const frameWrap = dialog.querySelector('[data-lightbox-frame]');
  if (!frameWrap) return;

  // ⚠️ أرقام اليوتيوب بتتكتب بإيدك بملف work.json. لو انلزق معها
  //    رابط كامل أو رمز غريب، منشيله هون — بنقبل بس الحروف
  //    والأرقام والشرطات (وهاد شكل رقم اليوتيوب الحقيقي).
  const safeId = String(videoId || '').replace(/[^A-Za-z0-9_-]/g, '');
  if (!safeId) return;

  // منبني الآيفريم وقت الفتح بس (أداء أفضل، ما في تحميل مسبق)
  const frame = document.createElement('iframe');
  frame.src = `https://www.youtube-nocookie.com/embed/${safeId}?autoplay=1&rel=0&modestbranding=1`;
  frame.title = 'Video player';
  frame.allow =
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  frame.allowFullscreen = true;
  frameWrap.replaceChildren(frame);

  dialog.showModal();
  document.documentElement.style.overflow = 'hidden';
}

export function initLightbox() {
  if (hooked) return;
  hooked = true;

  // أي عنصر بالصفحة عليه data-play بيفتح اللايت-بوكس.
  // كل شي بينقرأ لحظة الضغط، فالانتقالات بين الصفحات ما بتأثر.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-play]');
    if (!btn) return;
    const id = btn.dataset.play;
    if (id) {
      e.preventDefault();
      open(id);
    }
  });
}
