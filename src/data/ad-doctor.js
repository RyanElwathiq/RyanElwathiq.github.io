// ═══════════════════════════════════════════════════════════════
//  بيانات «طبيب الإعلان»
//
//  اللعبة بمرحلتين:
//  ١) فحص سريع بيصير بمتصفح الزائر (ببلاش وفوري): بيدوّر على
//     أربع أساسيات بنص الإعلان (بيبلّش بمدح حاله؟ في طلب واضح؟
//     في تفصيلة ملموسة؟ الطول معقول؟) وبيعرضها كعلامات حيوية.
//  ٢) التشخيص: «نبض» بيقرأ النص وبيرجّع أقوى إشي وأضعف إشي،
//     ثلاث ملاحظات (الوعد، الجمهور، الطلب)، ونسخة معدّلة جاهزة.
//
//  ⚠️ الفحص السريع مقصود يكون شكلي وصريح إنه شكلي. قيمته إنه
//     بيعطي الزائر إشي يقرأه بأول ثانية وهو مستني التشخيص،
//     وبيضل شغّال حتى لو الحصة اليومية خلصت أو الشبكة وقعت.
//
//  ✏️ بدك تضيف كلمة للفحص؟ زيدها بـ CUES. الكلمات بتنفحص
//     بالاحتواء البسيط (indexOf) فخليها مقاطع قصيرة وشائعة.
// ═══════════════════════════════════════════════════════════════

// ─── كلمات الفحص السريع ───
//  self : مقاطع بتدل إنه النص بلّش بمدح صاحب النشاط بدل الزبون
//  cta  : مقاطع بتدل إنه في طلب واضح باللي بيقرا
export const CUES = {
  ar: {
    self: [
      'نحن',
      'إحنا',
      'احنا',
      'بنقدم',
      'بنقدّم',
      'نقدم',
      'شركتنا',
      'مؤسستنا',
      'أفضل',
      'الأفضل',
      'أرقى',
      'رائد',
      'الرائدة',
      'متخصصون',
      'متخصصين',
      'خبرة',
      'يسرنا',
      'نفتخر',
      'جودة عالية',
      'أسعار منافسة',
    ],
    cta: [
      'اطلب',
      'اطلبي',
      'احجز',
      'احجزي',
      'تواصل',
      'كلمنا',
      'راسلنا',
      'راسلونا',
      'واتساب',
      'واتس',
      'رسالة',
      'الرابط',
      'رابط',
      'البايو',
      'سجل',
      'سجّل',
      'اشتري',
      'اشترك',
      'زورونا',
      'زورنا',
      'اتصل',
      'خاص',
      'كومنت',
      'علّق',
    ],
  },
  en: {
    self: [
      'we provide',
      'we offer',
      'we are',
      'we specialise',
      'we specialize',
      'our company',
      'our team',
      'the best',
      'best in',
      'leading',
      'premium quality',
      'high quality',
      'competitive prices',
      'years of experience',
      'we pride',
    ],
    cta: [
      'order',
      'book',
      'call',
      'dm',
      'message',
      'whatsapp',
      'link in bio',
      'sign up',
      'subscribe',
      'buy',
      'shop',
      'visit',
      'contact',
      'get in touch',
      'comment',
      'send us',
      'reply',
    ],
  },
};

// ─── الفحص السريع: العناوين والنتائج ───
export const VITALS = {
  ar: {
    title: 'فحص سريع قبل التشخيص',
    hint: 'هاد فحص شكلي بيصير بمتصفحك وبيدوّر على أساسيات بس. التشخيص الحقيقي جاي تحته.',
    ok: 'تمام',
    warn: 'انتبه',
    score: 'الفحص السريع: {n} من {t} تمام',
    items: {
      promise: {
        label: 'البداية',
        ok: 'النص ما بيبلّش بمدح حالك، وهاي بداية صح.',
        warn: 'النص بيبلّش بمدح حالك مش بوعد للزبون. أول سطر هو اللي بيوقّف السكرول.',
      },
      cta: {
        label: 'الطلب',
        ok: 'في طلب واضح باللي بيقرا، وهاد بيقلّل التردد.',
        warn: 'ما في طلب واضح. شو بدك من اللي قرا الإعلان يعمل بالضبط؟',
      },
      specific: {
        label: 'التحديد',
        ok: 'في تفصيلة ملموسة بالنص، وهاي بتخلّي الوعد قابل للتصديق.',
        warn: 'ما في ولا تفصيلة ملموسة (مدة، عدد، شغلة بتفرق)، فالكلام بيضل عام.',
      },
      length: {
        label: 'الطول',
        ok: 'الطول معقول لنص إعلان.',
        short: 'قصير كثير. ما بيكفي يبني وعد ولا يعطي سبب.',
        long: 'طويل. أول سطرين هم اللي بينقروا، والباقي بيضيع.',
      },
    },
  },
  en: {
    title: 'A quick scan before the diagnosis',
    hint: 'This is a surface scan that runs in your browser and only looks for the basics. The real diagnosis comes below it.',
    ok: 'Fine',
    warn: 'Watch out',
    score: 'Quick scan: {n} of {t} fine',
    items: {
      promise: {
        label: 'The opening',
        ok: 'It does not open by praising yourself, and that is the right start.',
        warn: 'It opens by describing you, not by promising them. The first line is what stops the scroll.',
      },
      cta: {
        label: 'The ask',
        ok: 'There is a clear ask in there, and that lowers hesitation.',
        warn: 'There is no clear ask. What exactly should the reader do?',
      },
      specific: {
        label: 'Specifics',
        ok: 'There is a concrete detail in the copy, which makes the promise believable.',
        warn: 'Not one concrete detail (a duration, a number, something that differs), so it stays generic.',
      },
      length: {
        label: 'Length',
        ok: 'The length is reasonable for ad copy.',
        short: 'Very short. Not enough to build a promise or give a reason.',
        long: 'Long. The first two lines are what get read, the rest is lost.',
      },
    },
  },
};

// ─── نص جاهز للتجربة (زر «جرّب مثال») ───
//  مقصود يكون ضعيف بشكل واقعي: مدح للنفس، ولا تفصيلة، وطلب باهت.
export const SAMPLE = {
  ar: {
    ad: 'عرض خاص! أفضل خدمة تنظيف كنب بعمّان. جودة عالية وأسعار منافسة وفريق متخصص. تواصلوا معنا.',
    biz: 'محل تنظيف كنب وسجاد بعمّان، أغلب الطلبات بتيجي من الإنستا.',
  },
  en: {
    ad: 'Special offer! The best sofa cleaning service in Amman. High quality, competitive prices and a specialised team. Contact us.',
    biz: 'A sofa and carpet cleaning business in Amman, most orders come through Instagram.',
  },
};

// ─── نصوص بطاقة التشخيص ───
export const TEXTS = {
  ar: {
    dxTitle: 'التشخيص',
    strong: 'أقوى إشي بالإعلان',
    weak: 'أضعف إشي فيه',
    notesTitle: 'ثلاث ملاحظات تنفّذها اليوم',
    noteLabels: ['الوعد', 'الجمهور', 'الطلب'],
    rewriteTitle: 'نسخة معدّلة من إعلانك',
    rewriteHint: 'خدها كمسودة وعدّلها بلغتك إنت وبتفاصيلك الحقيقية قبل ما تنزّلها.',
    copy: 'انسخ النسخة',
    copied: 'انتسخت',
    copyFail: 'حدّد النص وانسخه بإيدك.',
    offerTitle: 'وقفة صادقة',
    disclosure:
      'شخّصه «نبض» (مساعد ريّان الذكي) من النص اللي كتبته بس، بلا ما يشوف حسابك ولا حسابك الإعلاني ولا أرقامك. هاي قراءة أولى بتفتح الطريق، مش حكم نهائي على إعلانك.',
  },
  en: {
    dxTitle: 'The diagnosis',
    strong: 'The strongest thing in it',
    weak: 'The weakest thing in it',
    notesTitle: 'Three notes you can act on today',
    noteLabels: ['The promise', 'The audience', 'The ask'],
    rewriteTitle: 'A rewritten version of your ad',
    rewriteHint: 'Treat it as a draft and put it back into your own words and your real details before you run it.',
    copy: 'Copy the version',
    copied: 'Copied',
    copyFail: 'Select the text and copy it manually.',
    offerTitle: 'An honest pause',
    disclosure:
      'Diagnosed by Nabd (Rayan\'s AI assistant) from the text you typed alone, without seeing your account, your ad account or your numbers. It is a first read that opens the way, not a final verdict on your ad.',
  },
};
