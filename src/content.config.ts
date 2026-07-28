// ═══════════════════════════════════════════════════════════════
//  إعداد المدونة — بيعرّف شو الحقول المطلوبة بكل مقال
//  ما بتحتاج تعدّل هذا الملف إلا لو بدك تضيف حقل جديد للمقالات
// ═══════════════════════════════════════════════════════════════
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  // كل ملفات .md (والـ .mdx) جوا مجلد src/content/blog بتصير مقالات
  // ملاحظة: .mdx = نفس الـ .md بالضبط، بس بيسمحلك تحطّ مكوّنات
  //         تفاعلية جوّا المقال (مثل لعبة الميزانية).
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),         // عنوان المقال (اللي بيظهر بالصفحة)
    // عنوان مختصر لتبويب المتصفح ونتائج جوجل بس (اختياري).
    // ليش؟ جوجل بيقصّ أي عنوان أطول من ~٦٠ حرف. فبتخلي العنوان
    // الظاهر بالمقال طويل وجذّاب، وهاد الحقل بيعطي جوجل نسخة قصيرة.
    seoTitle: z.string().optional(),
    description: z.string(),   // وصف قصير (مهم لجوجل)
    date: z.coerce.date(),     // تاريخ النشر: YYYY-MM-DD
    lang: z.enum(['en', 'ar']), // لغة المقال
    tags: z.array(z.string()).default([]), // وسوم (اختياري)
    cover: z.string().optional(),          // صورة غلاف (اختياري)
    // فيديو بيتحرك مع السكرول بآخر المقال (اختياري)
    // مثال: film: '/frames/blog-web/'
    film: z.string().optional(),
    // اسم ملف نفس المقال باللغة الثانية (بدون .md)
    // بيخلي زر تبديل اللغة ينقلك لنفس المقال مش لقائمة المقالات
    alt: z.string().optional(),
    draft: z.boolean().default(false),     // true = مسودة، ما بتنشر
  }),
});

export const collections = { blog };
