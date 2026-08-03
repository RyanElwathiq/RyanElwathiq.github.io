// ═══════════════════════════════════════════════════════════════
//  بيانات «عداد الانتباه»
//
//  الفكرة: مليون شخص واقفين قدام باب شركتك مستعدين يسمعوا جملة
//  وحدة. بكل جولة بتختار شو تقلهم، والعداد بيفرجيك كم واحد ضل
//  واقف. وبآخر اللعبة بتكتب جملتك إنت وبنحللها بقواعد بسيطة.
//
//  ⚠️ الأرقام توضيحية لشكل العلاقة (الحكي عن حالك بيطفّش، الحكي
//     عن مشكلة العميل بيمسّك) — مش قياس علمي، والواجهة بتقولها.
//  ⚠️ كل جولة فيها ٣ خيارات: واحد «نحن» (أناني)، واحد عرض/ميزة
//     بلا سياق، وواحد بيحكي عن مشكلة العميل. الترتيب بينخلط
//     بالواجهة عشان ما يصير حفظ مكان.
//
//  ✏️ keep = نسبة اللي بيضلوا واقفين من اللي كانوا واقفين (٠-١)
// ═══════════════════════════════════════════════════════════════

export const ROUNDS = [
  {
    id: 'restaurant',
    ar: {
      scene: 'إنت مطعم، والمليون واقفين. شو أول جملة؟',
      options: [
        { text: 'نحن أفضل مطعم بالمنطقة وعنا أجود المكونات.', keep: 0.06, tag: 'حكي عن حالك', why: 'كل مطعم بيحكي نفس الجملة، فما بتعني إشي. الناس ما أجت تسمع عنك، أجت تشوف حالها.' },
        { text: 'خصم ٢٠٪ على كل المنيو هالأسبوع!', keep: 0.22, tag: 'عرض بلا سياق', why: 'الخصم بيمسك اللي أصلاً ناوي يشتري. الباقي ما اقتنعوا بالأصل، فالخصم عليه ما بيحرّكهم.' },
        { text: 'بتطلب أكل وبيوصلك بارد؟ عنا وصل خلال ٢٠ دقيقة أو الطلب علينا.', keep: 0.55, tag: 'مشكلة العميل', why: 'حكيت عن وجع بيعرفه (الأكل البارد) وربطته بوعد محدد قابل للمساءلة. هيك بيوقف الزائر.' },
      ],
    },
    en: {
      scene: 'You are a restaurant, and the million are standing there. Your first sentence?',
      options: [
        { text: 'We are the best restaurant in the area with the finest ingredients.', keep: 0.06, tag: 'Talking about yourself', why: 'Every restaurant says this exact sentence, so it means nothing. People did not come to hear about you. They came to see themselves.' },
        { text: '20% off the whole menu this week!', keep: 0.22, tag: 'Offer with no context', why: 'A discount holds whoever already meant to buy. The rest were never convinced in the first place, so a discount on it moves nothing.' },
        { text: 'Ordered food and it arrived cold? We deliver in 20 minutes or it is on us.', keep: 0.55, tag: "The customer's problem", why: 'You named a pain they know (cold food) and tied it to a specific, accountable promise. That is what stops a passerby.' },
      ],
    },
  },
  {
    id: 'clinic',
    ar: {
      scene: 'هلأ إنت عيادة أسنان. اللي ضلوا بيستنوا جملتك.',
      options: [
        { text: 'عيادتنا مجهزة بأحدث الأجهزة الألمانية وخبرة ١٥ سنة.', keep: 0.09, tag: 'حكي عن حالك', why: 'الأجهزة والخبرة مهمين، بس كمعلومة داعمة بعدين. كجملة أولى، الزائر لسا ما عرف ليش يهتم.' },
        { text: 'كشفية مجانية لأول ٥٠ حجز هالشهر.', keep: 0.24, tag: 'عرض بلا سياق', why: 'المجاني بيجذب، بس اللي انجذبوا للمجاني بس نادراً بيكملوا للعلاج المدفوع. جمهور كثير، نية قليلة.' },
        { text: 'مأجل موعد السنية من سنة لأنك خايف من الألم؟ نص مرضانا أجوا بنفس الخوف.', keep: 0.52, tag: 'مشكلة العميل', why: 'سميت الخوف الحقيقي اللي بيأجل الحجز، وطمّنته إنه مش لحاله. الجملة اللي بتفهم الناس بتوقفهم.' },
      ],
    },
    en: {
      scene: 'Now you are a dental clinic. The ones who stayed await your line.',
      options: [
        { text: 'Our clinic has the latest German equipment and 15 years of experience.', keep: 0.09, tag: 'Talking about yourself', why: 'Equipment and experience matter, but as supporting proof later. As an opening line, the visitor still has no reason to care.' },
        { text: 'Free checkup for the first 50 bookings this month.', keep: 0.24, tag: 'Offer with no context', why: 'Free attracts, but people drawn only by free rarely continue to paid treatment. Big crowd, little intent.' },
        { text: 'Postponing that tooth appointment for a year because you fear the pain? Half our patients came with the same fear.', keep: 0.52, tag: "The customer's problem", why: 'You named the real fear that delays the booking and told them they are not alone. The line that understands people stops them.' },
      ],
    },
  },
  {
    id: 'store',
    ar: {
      scene: 'متجر ملابس أونلاين. الجمهور عم يقل، اختار صح.',
      options: [
        { text: 'تشكيلة جديدة وصلت! تسوق الآن.', keep: 0.12, tag: 'عرض بلا سياق', why: '«وصل جديد» بيهم متابعينك الحاليين المخلصين بس. الغريب ما عنده سبب يفتح رابط لمحل ما بيعرفه.' },
        { text: 'نحن متجر رقم ١ بالأردن بتقييم ٤.٩ نجوم.', keep: 0.1, tag: 'حكي عن حالك', why: 'التقييم دليل ثقة ممتاز، بمكانه الصح: جنب زر الشراء. كجملة أولى هو ادعاء زي كل الادعاءات.' },
        { text: 'طلبتي قياسك المعتاد وأجاك واسع؟ جدول قياساتنا بالسنتيمتر، مش S وM وL.', keep: 0.5, tag: 'مشكلة العميل', why: 'أكبر خوف بشراء الأواعي أونلاين هو القياس. اللي بتحل هالخوف بجملة، بتاخد انتباه كل اللي انلسعوا قبل.' },
      ],
    },
    en: {
      scene: 'An online clothing store. The crowd is thinning, choose well.',
      options: [
        { text: 'New collection just landed! Shop now.', keep: 0.12, tag: 'Offer with no context', why: '"New arrivals" matters to your loyal existing followers only. A stranger has no reason to open a link to a store they do not know.' },
        { text: 'We are the #1 store in Jordan, rated 4.9 stars.', keep: 0.1, tag: 'Talking about yourself', why: 'The rating is excellent trust proof, in its right place: next to the buy button. As an opening line it is a claim like every claim.' },
        { text: 'Ordered your usual size and it came huge? Our size chart is in centimeters, not S, M and L.', keep: 0.5, tag: "The customer's problem", why: 'The biggest fear in buying clothes online is sizing. Solve that fear in one line and you get the attention of everyone burned before.' },
      ],
    },
  },
  {
    id: 'gym',
    ar: {
      scene: 'آخر جولة اختيار: نادي رياضي بشهر ١.',
      options: [
        { text: 'جسم الصيف بيبدأ من الشتا. اشترك هلأ.', keep: 0.2, tag: 'عرض بلا سياق', why: 'جملة حلوة، بس بتحكي عن هدف بعيد. الحوافز البعيدة أضعف من المشاكل الحاضرة.' },
        { text: 'أكبر نادي بالمدينة: ٣ طوابق وأجهزة ما إلها مثيل.', keep: 0.08, tag: 'حكي عن حالك', why: 'حجم النادي مشكلتك إنت مش مشكلة المشترك. هو بده يعرف شو رح يتغير فيه هو.' },
        { text: 'اشتركت السنة الماضية ورحت أسبوعين وبطلت؟ برنامجنا مبني عشان الأسبوع الثالث بالذات.', keep: 0.58, tag: 'مشكلة العميل', why: 'كل واحد جرب نادي بيعرف أزمة الأسبوع الثالث. سميتها بالاسم، فعرف إنك فاهم عليه أكثر من نفسه.' },
      ],
    },
    en: {
      scene: 'Last choice round: a gym in January.',
      options: [
        { text: 'Summer bodies are built in winter. Join now.', keep: 0.2, tag: 'Offer with no context', why: 'A nice line, but it speaks to a distant goal. Distant incentives are weaker than present problems.' },
        { text: 'The biggest gym in the city: 3 floors and unmatched equipment.', keep: 0.08, tag: 'Talking about yourself', why: "The gym's size is your problem, not the member's. They want to know what will change in them." },
        { text: 'Joined last year, went for two weeks, then quit? Our program is built for week three specifically.', keep: 0.58, tag: "The customer's problem", why: 'Everyone who tried a gym knows the week-three crisis. You named it, so they knew you understand them better than they do.' },
      ],
    },
  },
];

// ─────────────────────────────────────────────
//  مصنّف الجولة الحرة — قواعد بسيطة شفافة، مش ذكاء اصطناعي
//  بينفحصوا بالترتيب وأول تطابق بيربح
// ─────────────────────────────────────────────
export const CLASSIFIER = {
  ar: [
    { id: 'you', re: '(نحن|احنا|إحنا|عنا |عندنا|فريقنا|خبرتنا|شركتنا|منتجاتنا|خدماتنا|الأفضل|الافضل|رقم واحد|رقم ١|الرواد|أجود|اجود)', keep: 0.08, tag: 'حكي عن حالك', why: 'الجملة بتحكي عنك إنت: نحن، عنا، الأفضل. العميل بيسمعها من الكل وما بيسمع فيها حاله. جرب تبلش من مشكلته هو.' },
    { id: 'offer', re: '(خصم|عرض|تخفيض|مجان|هدية|توصيل مجاني|٪|%|اشتري|اطلب الآن|اطلب هلأ|لفترة محدودة)', keep: 0.22, tag: 'عرض بلا سياق', why: 'بلشت بالعرض قبل ما تبني سبب للاهتمام. الخصم بيحرك المقتنعين أصلاً، والباقي بيحتاجوا يسمعوا مشكلتهم أول.' },
    { id: 'problem', re: '(\\?|؟|بتعاني|تعبت|زهقت|خايف|خايفة|جربت|بتضطر|مشكلتك|ليش |وجع|معاناة|بتنسى|بتتأخر|صعب عليك)', keep: 0.5, tag: 'مشكلة العميل', why: 'جملتك بتحكي عن العميل ومشكلته، وهاد بالضبط اللي بيوقف الناس: حسوا إنك عم تحكي عنهم مش عن حالك.' },
  ],
  en: [
    { id: 'you', re: '(\\bwe\\b|\\bour\\b|\\bus\\b|best|leading|number one|#1|finest|top[- ]rated|award)', keep: 0.08, tag: 'Talking about yourself', why: 'The line talks about you: we, our, the best. The customer hears it from everyone and never hears themselves in it. Try starting from their problem.' },
    { id: 'offer', re: '(discount|% off|sale|free|gift|limited time|buy now|order now|shop now)', keep: 0.22, tag: 'Offer with no context', why: 'You opened with the offer before building a reason to care. Discounts move the already-convinced. The rest need to hear their problem first.' },
    { id: 'problem', re: '(\\?|tired of|struggling|afraid|worried|sick of|your problem|why does|hurts|frustrat|you keep|hard to)', keep: 0.5, tag: "The customer's problem", why: 'Your line talks about the customer and their problem, and that is exactly what stops people: they felt you were talking about them, not yourself.' },
  ],
  // لو ولا قاعدة طابقت
  fallback: {
    ar: { keep: 0.15, tag: 'عامة', why: 'الجملة ما بتحكي عنك ولا عن العميل بوضوح، فمرقت زي أغلب المحتوى: بلا أثر. جرب تسمي مشكلة محددة جمهورك بيعرفها.' },
    en: { keep: 0.15, tag: 'Generic', why: 'The line speaks clearly about neither you nor the customer, so it passed like most content: without a trace. Try naming a specific problem your audience knows.' },
  },
};

// ─────────────────────────────────────────────
//  أحكام النهاية — حسب كم واحد ضل من المليون
// ─────────────────────────────────────────────
export const VERDICTS = [
  {
    min: 0,
    ar: { stamp: 'الشارع فضي', text: 'المليون مشيوا، وهاد اللي بيصير فعلاً لما المحتوى كله «نحن منقدم». الناس ما بتنتظر إعلان، بتنتظر حدا يحكي عنها هي.' },
    en: { stamp: 'The street is empty', text: 'The million walked away, and that is what actually happens when all the content is "we offer". People are not waiting for an ad. They are waiting for someone to talk about them.' },
  },
  {
    min: 8000,
    ar: { stamp: 'ضل جمهور محترم', text: 'مسكت جزء منيح، وخسرت جزء عالجمل اللي بتحكي عنك بدل ما تحكي عنهم. لاحظ الفرق: كل ما جملتك اقتربت من مشكلتهم، وقفوا أكثر.' },
    en: { stamp: 'A decent crowd stayed', text: 'You held a good share and lost a share on the lines that talk about you instead of them. Notice the pattern: the closer your line got to their problem, the more of them stopped.' },
  },
  {
    min: 30000,
    ar: { stamp: 'بتعرف تمسّك جمهور', text: 'اخترت الجمل اللي بتحكي عن العميل، وهاي أندر مهارة بالمحتوى. المحتوى مش حكي مستمر عن الخدمة، هو محادثة بتبدأ من مشكلة اللي قدامك.' },
    en: { stamp: 'You know how to hold a crowd', text: 'You picked the lines that talk about the customer, and that is the rarest content skill. Content is not continuous talk about the service. It is a conversation that starts from the problem of whoever is in front of you.' },
  },
];
