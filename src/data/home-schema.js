// ═══════════════════════════════════════════════════════════════
//  البيانات المنظّمة للصفحة الرئيسية (عربي وإنجليزي)
//
//  ليش ملف مشترك؟ عشان لما تضيف سؤال أو تغيّر خدمة، ما تضطر
//  تعدّل بمكانين وتنسى وحدة — الصفحتين بتقرأوا من هون.
//
//  شو بتعمل هالبيانات فعلياً؟
//   • FAQPage — جوجل بيعرض أسئلتك مفتوحة تحت رابط الموقع بالنتائج،
//     فبتاخد مساحة أكبر من أي منافس بنفس الصفحة.
//   • ProfessionalService — بيقول لجوجل إنه هذا **نشاط خدمي بالأردن**
//     مش مجرد صفحة شخصية، وبيربطه بقائمة الخدمات والأسعار.
//
//  ⚠️ جوجل بيعرض أول ~١٠ أسئلة بالعادة، بس منحطهم كلهم لأنه
//     أدوات الذكاء الاصطناعي بتقرأهم كلهم لما تجاوب عن شغلك.
// ═══════════════════════════════════════════════════════════════
import faq from './faq.json';

const HOME = 'https://ryanalali.me';
const ME = HOME + '/#me';

// الأسئلة → FAQPage
function faqPage(lang) {
  const ar = lang === 'ar';
  return {
    '@type': 'FAQPage',
    '@id': `${HOME}${ar ? '/ar/' : '/'}#faq`,
    inLanguage: ar ? 'ar-JO' : 'en',
    mainEntity: faq.items.map((it) => ({
      '@type': 'Question',
      name: ar ? it.qAr : it.q,
      acceptedAnswer: { '@type': 'Answer', text: ar ? it.aAr : it.a },
    })),
  };
}

// الخدمات → ProfessionalService + قائمة عروض
function service(lang) {
  const ar = lang === 'ar';
  const names = ar
    ? ['بالمشروع', 'اشتراك شهري', 'استشارة أو تدريب']
    : ['Per project', 'Monthly retainer', 'Consulting or training'];

  const skills = ar
    ? [
        'التسويق الرقمي',
        'تحسين محركات البحث',
        'إعلانات مدفوعة',
        'تحليل البيانات',
        'هوية بصرية',
        'مونتاج فيديو',
        'إدارة علاقات العملاء',
      ]
    : [
        'Digital marketing',
        'SEO',
        'Paid media',
        'Data analysis',
        'Brand identity',
        'Video editing',
        'CRM',
      ];

  return {
    '@type': 'ProfessionalService',
    '@id': HOME + '/#service',
    name: ar ? 'ريّان الواثق، تسويق ونموّ' : 'Rayan Elwathiq، Marketing & Growth',
    url: HOME + (ar ? '/ar/' : '/'),
    inLanguage: ar ? 'ar-JO' : 'en',
    founder: { '@id': ME },
    provider: { '@id': ME },
    areaServed: [
      { '@type': 'Country', name: ar ? 'الأردن' : 'Jordan' },
      { '@type': 'Place', name: ar ? 'الشرق الأوسط' : 'Middle East' },
    ],
    address: { '@type': 'PostalAddress', addressCountry: 'JO', addressLocality: ar ? 'عمّان' : 'Amman' },
    knowsAbout: skills,
    // ⚠️ ما بنحطّ أرقام أسعار بالبيانات المنظّمة — السعر عندنا
    //    بيتحدّد بعد المكالمة، وأي رقم ثابت هون بيصير وعد.
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: ar ? 'طرق الشغل' : 'How I work',
      itemListElement: names.map((n, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: { '@type': 'Service', name: n, provider: { '@id': ME } },
      })),
    },
  };
}

export function homeSchema(lang) {
  return [service(lang), faqPage(lang)];
}
