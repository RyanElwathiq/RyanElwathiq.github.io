// ═══════════════════════════════════════════════════════════════
//  اللايت-بوكس: نافذة تشغيل الفيديو
//  أي زر عليه data-play="رقم_اليوتيوب" بيفتح الفيديو هون
//  (بنستخدم youtube-nocookie: خصوصية أعلى وبدون اقتراحات غريبة)
// ═══════════════════════════════════════════════════════════════
export function initLightbox() {
  const dialog = document.querySelector('[data-lightbox]');
  if (!dialog) return;

  const frameWrap = dialog.querySelector('[data-lightbox-frame]');
  const closeBtn = dialog.querySelector('[data-lightbox-close]');

  function open(videoId) {
    // منبني الآيفريم وقت الفتح بس (أداء أفضل، ما في تحميل مسبق)
    frameWrap.innerHTML = `<iframe
      src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1"
      title="Video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>`;
    dialog.showModal();
    document.documentElement.style.overflow = 'hidden';
  }

  function close() {
    dialog.close();
  }

  dialog.addEventListener('close', () => {
    frameWrap.innerHTML = ''; // وقف الفيديو فوراً عند الإغلاق
    document.documentElement.style.overflow = '';
  });

  // إغلاق بالضغط على الخلفية
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });

  closeBtn?.addEventListener('click', close);

  // أي عنصر بالصفحة عليه data-play بيفتح اللايت-بوكس
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
