// ═══════════════════════════════════════════════════════════════
//  محتوى صفحات البكجات التفصيلية (/services/packages/*)
//
//  التركيبة نفسها (الاسم، لمين، البنود) بتيجي من services.json —
//  هون بس **القصة**: ليش كل قطعة موجودة، لمين البكج ولمين لأ،
//  كيف بيبلش، والأسئلة المتوقعة. نفس نبرة الموقع: صراحة بتبيع.
//
//  ⚠️ ولا سعر بأي مكان — القاعدة الثابتة: السعر من التشخيص.
//  ✏️ whyEach: مفتاحها id الخدمة من services.json — لو غيّرت
//     تركيبة بكج هناك، ضيف/شيل سطرها هون.
// ═══════════════════════════════════════════════════════════════

export const PACKS = {
  launch: {
    ar: {
      seoTitle: 'بكج البداية الصح: استراتيجية وهوية وموقع',
      seoDesc: 'البكج اللي بيبني الأساس بالترتيب الصح: بفهم السوق، ببني الهوية، وبطلّع موقع بيبيع. لمشروع جديد أو مشروع حاسس إنه مش مترتب.',
      story: 'أغلب المشاريع بتبلش من الآخر: إعلان ممول على هوية مش جاهزة وموقع مش موجود. النتيجة معروفة: كبسات بتروح عالفاضي، وميزانية بتنحرق مرتين — مرة عالإعلان ومرة على إعادة بناء اللي انبنى غلط. هاد البكج بيمشي بالترتيب الطبيعي: بفهم أول، ببني الهوية ثاني، وبطلّع الموقع ثالث. بالآخر بيكون عندك أساس كل اللي بعده بينبني عليه.',
      whyEach: {
        strategy: 'كل شي بيبلش من هون: مين جمهورك فعلاً، شو عرضك اللي بيميزك، وليش الناس بتشتري منك إنت. بدون هاي الإجابات، الهوية بتطلع ذوق شخصي والموقع بيطلع قالب.',
        branding: 'الهوية مش لوجو حلو — هي نظام كامل بيخلي الناس تتعرف عليك قبل ما تشوف اسمك. بتنبنى على قرارات الاستراتيجية، مش على «شو حلو».',
        websites: 'الموقع هو الأرض اللي بتملكها — مش حساب ممكن يتسكر أو خوارزمية بتتقلب. بينبني بهويتك وبرسالتك، وبيصير المكان اللي كل التسويق الجاي بيصب فيه.',
      },
      fit: ['مشروع جديد بده يبلش صح من أول يوم', 'مشروع شغّال بس حاسس إنه شكله ورسالته مش مرتبين', 'حدا جرب يعلن قبل هيك وحس إنه المصاري راحت عالفاضي'],
      notFit: ['بدك إعلانات هالأسبوع ونتائج بكرا — هاد بكج أساس مش بكج سرعة', 'أساسك جاهز فعلاً (هوية وموقع منيحين) — وقتها النمو الشهري أنسبلك'],
      faq: [
        { q: 'قديش بياخد وقت؟', a: 'حسب جاهزية المحتوى عندك وسرعة القرارات — والمدة الدقيقة بتطلع من جلسة التشخيص مع النطاق المكتوب. اللي بوعدك فيه: جدول واضح من أول أسبوع، مش «قريباً».' },
        { q: 'ليش ما في سعر معلن؟', a: 'لأنه موقع لمتجر بمئة منتج غير موقع تعريفي لعيادة، وهوية من الصفر غير تطوير هوية موجودة. السعر بيطلع من تشخيص مشروعك إنت، مكتوب بنطاق واضح، وثابت بعد الاتفاق.' },
        { q: 'ممكن آخد جزء من البكج بس؟', a: 'ممكن طبعاً — كل خدمة بتنطلب لحالها. بس الترتيب بيهم: موقع قبل الهوية بيتبنى مرتين، وهوية قبل الاستراتيجية بتطلع ذوق مش قرار.' },
      ],
    },
    en: {
      seoTitle: 'The Right Start: strategy, identity, site',
      seoDesc: 'The package that builds the foundation in the right order: understand the market, build the identity, ship a site that sells. For new or unstructured projects.',
      story: 'Most projects start from the end: paid ads on an unfinished identity and a website that does not exist. The result is familiar: clicks into the void, and a budget burned twice — once on the ads, once on rebuilding what was built wrong. This package walks the natural order: understand first, build the identity second, ship the website third. You end up with a foundation everything else stands on.',
      whyEach: {
        strategy: 'Everything starts here: who your audience really is, what makes your offer different, and why people would buy from you specifically. Without these answers, identity becomes personal taste and the website becomes a template.',
        branding: 'Identity is not a nice logo — it is a full system that makes people recognise you before reading your name. It is built on strategy decisions, not on "looks nice".',
        websites: 'The website is the land you own — not an account that can be closed or an algorithm that flips. Built on your identity and message, it becomes where all future marketing lands.',
      },
      fit: ['A new project that wants to start right from day one', 'A running project that feels visually and verbally unstructured', 'Someone who tried ads before and felt the money vanished'],
      notFit: ['You want ads this week and results tomorrow — this is a foundation package, not a speed package', 'Your foundation is genuinely ready (solid identity and site) — Monthly Growth fits you better'],
      faq: [
        { q: 'How long does it take?', a: 'Depends on your content readiness and decision speed — the exact timeline comes out of the diagnosis session with a written scope. What I promise: a clear schedule from week one, not "soon".' },
        { q: 'Why is there no listed price?', a: 'Because a store with a hundred products is not a clinic profile site, and identity from scratch is not an identity refresh. The price comes from diagnosing your project, written in a clear scope, fixed after agreement.' },
        { q: 'Can I take only part of the package?', a: 'Of course — every service can be ordered alone. But order matters: a site before identity gets built twice, and identity before strategy becomes taste, not decision.' },
      ],
    },
  },

  growth: {
    ar: {
      seoTitle: 'بكج النمو الشهري: سوشال وفيديو وإعلانات',
      seoDesc: 'إيقاع شهري واحد: محتوى بيبني ثقة، فيديو بيوقّف الإصبع، وإعلانات بتوسّع الوصول — بقياس واحد وقرارات بالأرقام.',
      story: 'المشكلة بالشغل الشهري المعتاد إنه قطع متفرقة: حدا بيصمم، حدا بيبوّست، وحدا «بيعمل بوست ممول» — وكل واحد بوادي. هاد البكج بيشغّل الثلاثة بإيقاع واحد: المحتوى بيبني الثقة، الفيديو بيمسك الانتباه، والإعلان بياخد أحسن اللي اشتغل وبيوصله لناس جداد. وكل شهر بيسكّر بأرقام بتقرر شو منعمل الشهر الجاي — مش بتقرير لايكات.',
      whyEach: {
        social: 'الحضور اليومي اللي بيبني الثقة — بس بنظام: كل بوست إله وظيفة برحلة العميل، مش نشر عشان النشر.',
        video: 'الريلز هي وقود الوصول اليوم، وأول ثانيتين بيقرروا كل شي. مونتاج مبني على رسالة، مش على موضة.',
        ads: 'التعزيز الذكي بياخد أحسن محتواك وبيحطه قدام جمهور جديد مستهدف — بدل ما يضل يلف على نفس المتابعين.',
      },
      fit: ['أساسك جاهز (هوية وموقع أو حساب مرتب) وبدك حركة مستمرة', 'عندك مبيعات بس واقفة عند سقف ومش عارف ليش', 'تعبت من شركات بتبعت تقرير لايكات آخر الشهر'],
      notFit: ['ما عندك هوية ولا موقع — بلش بالبداية الصح، وإلا منصرف عالإعلان مرتين', 'بدك «فايرال» وأرقام خيالية بأسبوع — الثقة بتنبنى بإيقاع مش بضربة حظ'],
      faq: [
        { q: 'شو بيوصلني كل شهر؟', a: 'خطة الشهر بأوله، تنفيذ بإيقاع ثابت، وبآخره أرقام بتنقرا: شو اشتغل، شو لأ، وشو منغيّر. التقرير عنا قرارات مش لايكات.' },
        { q: 'مين بيرد عالرسائل والتعليقات؟', a: 'بنتفق بالتشخيص: في مشاريع بتحب تمسك صوتها بنفسها وأنا بجهزلها القوالب، وفي مشاريع بديرلها التفاعل كامل. الثنتين بيشتغلوا — المهم يكون قرار مش صدفة.' },
        { q: 'متى بشوف نتائج؟', a: 'أول شهر بيبني البيانات والاتجاه، ومن الثاني بتبلش القرارات المبنية عالأرقام تبين. اللي بيوعدك بنتائج من أول أسبوع، اقرأ مقالتي عن ضمان المبيعات.' },
      ],
    },
    en: {
      seoTitle: 'Monthly Growth package: social, video, ads',
      seoDesc: 'One monthly rhythm: content that builds trust, video that stops the thumb, ads that widen reach — one measurement, decisions by numbers.',
      story: 'The problem with the usual monthly work is that it is scattered pieces: someone designs, someone posts, someone "boosts" — each in their own valley. This package runs all three on one rhythm: content builds trust, video holds attention, and ads take the best of what worked to new people. Every month closes with numbers that decide next month — not a likes report.',
      whyEach: {
        social: 'The daily presence that builds trust — but with a system: every post has a job in the customer journey, not posting for posting.',
        video: "Reels are today's reach fuel, and the first two seconds decide everything. Editing built on a message, not on a trend.",
        ads: 'Smart boosting takes your best content and puts it in front of new, targeted people — instead of circling the same followers.',
      },
      fit: ['Your foundation is ready (identity and a solid site or account) and you want steady motion', 'You have sales but hit a ceiling and cannot tell why', 'You are tired of agencies sending a likes report at month end'],
      notFit: ['No identity and no website — start with The Right Start, or we pay for ads twice', 'You want "viral" and wild numbers in a week — trust builds on rhythm, not luck'],
      faq: [
        { q: 'What do I get each month?', a: "The month's plan at its start, execution on a fixed rhythm, and readable numbers at its end: what worked, what did not, what we change. Our report is decisions, not likes." },
        { q: 'Who answers messages and comments?', a: 'We agree in the diagnosis: some projects like to keep their own voice and we prepare the templates; others want engagement fully managed. Both work — it just has to be a decision, not an accident.' },
        { q: 'When do I see results?', a: 'The first month builds data and direction; from the second, number-driven decisions start to show. Anyone promising results in week one — read my article on sales guarantees.' },
      ],
    },
  },

  system: {
    ar: {
      seoTitle: 'بكج المنظومة الكاملة: شريك نمو مش منفّذ',
      seoDesc: 'الدورة كاملة بتتكرر كل شهر: تشخيص، تنفيذ، قياس، وتحسين — استراتيجية وSEO وإعلانات وسوشال بمنظومة وحدة.',
      story: 'في فرق بين حدا بينفذلك مهام وحدا شريك بنمو مشروعك. المنظومة الكاملة هي الخيار الثاني: مش «شو بدك نعمل هالشهر؟» — أنا بجي عالطاولة بأرقام وتوصيات: هاد اشتغل ومنزيده، هاد بيخسر ومنوقفه، وهاي فرصة ما حدا شايفها. الدورة بتلف كل شهر: تشخيص، تنفيذ، قياس، تحسين — وكل لفة بتبني على اللي قبلها.',
      whyEach: {
        strategy: 'العقل المدبّر: كل قرار شهري بيرجع لسؤال «هل هاد بيقربنا من الهدف؟» مش لمزاج اللحظة.',
        seo: 'الاستثمار طويل النفس: بينما الإعلان بيجيب زباين اليوم، الـ SEO بيبني ظهورك اللي بيجيب زباين السنة الجاية ببلاش.',
        ads: 'محرك النتائج السريعة: حملات بتتحسن كل أسبوع بالأرقام — وقف الخاسر، زيد الرابح، جرب الجديد.',
        social: 'صوتك اليومي بالسوق: الحضور اللي بيخلي كل القنوات الثانية أقوى، لأنه الناس بتتشيك عليك قبل ما تشتري.',
      },
      fit: ['مشروع بده يكبر بجدية ومستعد يلتزم بدورة شهرية كاملة', 'صاحب قرار بده شريك بيفكر معه، مش منفذ بينتظر التعليمات', 'مشروع جرب القطع المتفرقة وشاف إنها ما بتحكي مع بعض'],
      notFit: ['ميزانيتك بالكاد بتغطي قناة وحدة — بلش بالنمو الشهري وكبر بعدين', 'بدك حدا «يجرب شهر ونشوف» — المنظومة بتحتاج نَفَس، والشهر الواحد بيقيس بس الاستعجال'],
      faq: [
        { q: 'شو الفرق عن النمو الشهري؟', a: 'النمو الشهري تنفيذ بإيقاع. المنظومة بتضيف الطبقة اللي فوقه: استراتيجية بتوجه، SEO بيبني للبعيد، وقياس بيقرر — يعني شريك بيفكر بمشروعك مش بس بينفذ.' },
        { q: 'كيف بتابع شو عم بيصير؟', a: 'أرقامك بتوصلك بإيقاع ثابت وبلغة مفهومة، ومكالمة شهرية منقرا فيها الدورة كاملة: شو صار، ليش، وشو الجاي. وإنت بتقرّر معي، مش بتتفرج.' },
        { q: 'ليش ما بتضمنلي مبيعات؟', a: 'لأنه ولا حدا صادق بيقدر — البيع بيعتمد على منتجك وسعرك وسوقك كمان. اللي بضمنه: منهجية كاملة بتشتغل، وميزانية ولا قرش منها بينصرف عالتخمين.' },
      ],
    },
    en: {
      seoTitle: 'The Full System: a growth partner',
      seoDesc: 'The full loop repeating monthly: diagnose, execute, measure, improve — strategy, SEO, ads and social as one system.',
      story: 'There is a difference between someone executing tasks and a partner in growing your project. The Full System is the second: not "what do you want this month?" — we come to the table with numbers and recommendations: this worked so we scale it, this loses so we stop it, and here is an opportunity nobody sees. The loop turns monthly: diagnose, execute, measure, improve — each turn building on the last.',
      whyEach: {
        strategy: 'The thinking layer: every monthly decision goes back to "does this move us toward the goal?", not the mood of the moment.',
        seo: "The long-game investment: while ads bring today's customers, SEO builds the visibility that brings next year's customers for free.",
        ads: 'The fast-results engine: campaigns improving weekly by the numbers — stop the loser, scale the winner, test the new.',
        social: 'Your daily voice in the market: the presence that makes every other channel stronger, because people check you before buying.',
      },
      fit: ['A project serious about growth, ready to commit to a full monthly loop', 'A decision-maker who wants a thinking partner, not an executor awaiting instructions', 'A project that tried scattered pieces and saw they never talk to each other'],
      notFit: ['Your budget barely covers one channel — start with Monthly Growth and scale later', 'You want someone to "try a month and see" — a system needs breath; one month only measures impatience'],
      faq: [
        { q: 'How is this different from Monthly Growth?', a: 'Monthly Growth is execution on a rhythm. The System adds the layer above it: strategy steering, SEO building long-term, and measurement deciding — a partner thinking about your project, not just executing.' },
        { q: 'How do I follow what is happening?', a: 'Your numbers arrive on a fixed rhythm in plain language, plus a monthly call reading the full loop: what happened, why, and what is next. You decide with us, not watch.' },
        { q: 'Why no sales guarantee?', a: 'Because nobody honest can — sales also depend on your product, price and market. What I guarantee: a complete method that works, and a budget where not one coin is spent on guessing.' },
      ],
    },
  },
};
