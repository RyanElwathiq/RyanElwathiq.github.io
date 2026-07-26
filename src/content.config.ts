// ═══════════════════════════════════════════════════════════════
//  إعداد المدونة — بيعرّف شو الحقول المطلوبة بكل مقال
//  ما بتحتاج تعدّل هذا الملف إلا لو بدك تضيف حقل جديد للمقالات
// ═══════════════════════════════════════════════════════════════
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // كل ملفات .md جوا مجلد src/content/blog بتصير مقالات
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),         // عنوان المقال
    description: z.string(),   // وصف قصير (مهم لجوجل)
    date: z.coerce.date(),     // تاريخ النشر: YYYY-MM-DD
    lang: z.enum(['en', 'ar']), // لغة المقال
    tags: z.array(z.string()).default([]), // وسوم (اختياري)
    cover: z.string().optional(),          // صورة غلاف (اختياري)
    draft: z.boolean().default(false),     // true = مسودة، ما بتنشر
  }),
});

export const collections = { blog };
