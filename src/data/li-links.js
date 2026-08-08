// ═══════════════════════════════════════════════════════════════
//  جدول روابط لينكدإن القصيرة — ryanalali.me/li/<slug>
//
//  ⚠️ لازم يكون بملف مستقل مش جوّا الصفحة: Astro بيرفع
//     getStaticPaths() لسكوب لحاله، فما بيقدر يشوف أي متغيّر
//     مكتوب بالـfrontmatter — بس بيشوف الـimports.
//
//  ⚠️ ما تحذف ولا slug موجود ولا تغيّر اسمه. الروابط منشورة
//     ببوستات لينكدإن، والبوست المجدول **ما بينعدّل**.
//     أي slug بينحذف = رابط مكسور ببوست منشور.
// ═══════════════════════════════════════════════════════════════

export const CAMPAIGNS = {
  en: { base: '/', campaign: 'en-films' },
  ar: { base: '/ar/', campaign: 'ar-films' },
};

// slug → [ اللغة , اسم الفيلم (توثيق داخلي، ما بيظهر لحدا) ]
export const LINKS = {
  // ── الأفلام الإنجليزية (جدول ٩ آب ← ٦ أيلول) ──
  'numbers': ['en', 'The Numbers Film'],
  'agents': ['en', 'AI Agents'],
  'seo': ['en', 'SEO'],
  'strategy': ['en', 'Marketing Strategy'],
  'first-ad': ['en', 'Your First Paid Ad'],
  'websites': ['en', 'Websites'],
  'editing': ['en', 'Video Editing'],
  'consulting': ['en', 'Consulting and Training'],
  'ads': ['en', 'Paid Ads'],
  'brand': ['en', 'Brand Identity'],
  'social': ['en', 'Social Media'],
  'main': ['en', 'The Main Film'],
  'services': ['en', 'Services Index'],

  // ── الأفلام العربية (نفس الأفلام، مسار الاثنين والأربعاء) ──
  'arqam': ['ar', 'فيلم الأرقام'],
  'wukala': ['ar', 'وكلاء الذكاء'],
  'seo-ar': ['ar', 'SEO'],
  'istratijiya': ['ar', 'استراتيجية التسويق'],
  'awal-ielan': ['ar', 'أول إعلان ممول'],
  'mawaqe': ['ar', 'المواقع'],
  'montaj': ['ar', 'المونتاج'],
  'istisharah': ['ar', 'الاستشارة'],
  'ielanat': ['ar', 'الإعلانات الممولة'],
  'hawiya': ['ar', 'الهوية البصرية'],
  'social-ar': ['ar', 'السوشال ميديا'],
  'film': ['ar', 'الفيلم الرئيسي'],
  'khadamat': ['ar', 'فهرس الخدمات'],

  // ── تصاميم «خيط الضوء» (٦) ──
  'd-social': ['ar', 'خيط الضوء: سوشال'],
  'd-consulting': ['ar', 'خيط الضوء: استشارة'],
  'd-seo': ['ar', 'خيط الضوء: SEO'],
  'd-brand': ['ar', 'خيط الضوء: هوية'],
  'd-data': ['ar', 'خيط الضوء: بيانات'],
  'd-agents': ['ar', 'خيط الضوء: وكلاء'],

  // ── الطقم الفكاهي «انمسكت» (١٤-١٥ آب) ──
  'caught': ['en', 'Caught by my own robot'],
  'inmasakt': ['ar', 'حاولت أتهبل على الفورم تبعي'],

  // ── تصاميم «أول إعلان ممول» (٥) ──
  'd-ad1': ['ar', 'بلا قياس'],
  'd-ad2': ['ar', 'وعد مش وصف'],
  'd-ad3': ['ar', 'الهدف الغلط'],
  'd-ad4': ['ar', 'التعلّم بيرجع للصفر'],
  'd-ad5': ['ar', 'رقم واحد بيقرر'],
};

export function targetFor(id) {
  const [lang] = LINKS[id];
  const { base, campaign } = CAMPAIGNS[lang];
  return {
    lang,
    base,
    target:
      `${base}?utm_source=linkedin&utm_medium=social` +
      `&utm_campaign=${campaign}&utm_content=${id}`,
  };
}
