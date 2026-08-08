// ═══════════════════════════════════════════════════════════════
//  إعدادات Astro — ما في داعي تعدّل على هذا الملف
// ═══════════════════════════════════════════════════════════════
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

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

  integrations: [
    // ⚛️ React — بنستخدمه بس بالأجزاء التفاعلية (لعبة الميزانية مثلاً).
    //    باقي الموقع بيضل HTML خالص بدون أي جافاسكربت زيادة.
    react(),

    // 📝 MDX — بيخلي ملفات المقالات تقدر تحطّ فيها مكوّنات جاهزة
    //    (مثل لعبة الميزانية جوّا المقال). المقالات العادية بتضل .md
    mdx(),

    // بيولّد sitemap.xml تلقائياً لجوجل (مهم للـ SEO والإعلانات)
    sitemap({
      // ⚠️ صفحات /blog/ القديمة صارت مجرد تحويل لـ /signals/.
      //    منشيلها من الخريطة عشان ما نقول لجوجل «افهرسها» وبنفس
      //    الوقت نقوله «لا تفهرسها» — تناقض بيضرّ الترتيب.
      //    ونفس المنطق على /li/ — هاي روابط تتبّع لبوستات لينكدإن،
      //    صفحات تحويل بحتة عليها noindex. مالها محل بخريطة جوجل.
      filter: (page) => !/\/blog\//.test(page) && !/\/li\//.test(page),
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ar: 'ar' },
      },
    }),
  ],
});
