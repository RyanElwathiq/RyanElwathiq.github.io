// ═══════════════════════════════════════════════════════════════
//  إعدادات Astro — ما في داعي تعدّل على هذا الملف
// ═══════════════════════════════════════════════════════════════
import { defineConfig } from 'astro/config';

export default defineConfig({
  // عنوان الموقع النهائي (الدومين تبعك)
  site: 'https://ryanalali.me',

  // نظام اللغتين: الإنجليزي هو الأساسي (بدون /en بالرابط)
  // والعربي تحت /ar  (مثال: ryanalali.me/ar/videos)
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
