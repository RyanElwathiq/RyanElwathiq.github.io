// ═══════════════════════════════════════════════════════════════
//  بيانات «مترجم الباكجات»
//
//  الفكرة: الزائر بيركّب العرض اللي انعرض عليه (رقاقات: ١٥ تصميم،
//  ٨ ريلز، تعزيز...) وبيكبس «ترجم». اللعبة بتترجم كل بند من لغة
//  العروض للغة النتائج، وبعدها بتضوّي «معادلة البيع» بست طبقات
//  وبتبيّن أي طبقات العرض بيغطيها وأي طبقات ضايعة.
//
//  ⚠️ الترجمة مش سخرية من الباكجات — النبرة: «مش غلط، بس ناقص».
//     نفس نبرة صفحة الخدمات: صراحة بتبني ثقة، مش هجوم بيبني عداوة.
//
//  ✏️ بدك تضيف بند؟ ضيف عنصر بـ ITEMS: id فريد + layer من LAYERS
//     (أو null إذا البند ما بيغطي ولا طبقة فعلياً — زي «تقرير
//     لايكات») + نصوص ar/en. الرقاقة والترجمة بيظهروا لحالهم.
//  ✏️ بدك تعدّل الأحكام؟ VERDICTS تحت — أربع حالات محسوبة بالمحرّك.
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
//  طبقات معادلة البيع — الترتيب هو ترتيب العرض بالمقياس
//  q = السؤال اللي الطبقة بتجاوب عليه (بيظهر تحت اسمها)
// ─────────────────────────────────────────────────────────────
export const LAYERS = [
  {
    id: 'diag',
    ar: { name: 'التشخيص', q: 'مين الجمهور وليش ما بيشتري؟' },
    en: { name: 'Diagnosis', q: 'Who is the audience and why are they not buying?' },
  },
  {
    id: 'msg',
    ar: { name: 'الرسالة والعرض', q: 'شو منقول، وليش يختارك إنت؟' },
    en: { name: 'Message & offer', q: 'What do we say, and why pick you?' },
  },
  {
    id: 'exec',
    ar: { name: 'التنفيذ', q: 'تصاميم وفيديو ومحتوى' },
    en: { name: 'Execution', q: 'Designs, video, content' },
  },
  {
    id: 'reach',
    ar: { name: 'الوصول', q: 'مين رح يشوف كل هاد؟' },
    en: { name: 'Reach', q: 'Who is going to see all this?' },
  },
  {
    id: 'convert',
    ar: { name: 'التحويل', q: 'وين الزيارة بتصير طلب؟' },
    en: { name: 'Conversion', q: 'Where does a visit become an order?' },
  },
  {
    id: 'measure',
    ar: { name: 'القياس', q: 'شو منغيّر الشهر الجاي؟' },
    en: { name: 'Measurement', q: 'What do we change next month?' },
  },
];

// ─────────────────────────────────────────────────────────────
//  بنود العروض — كل بند: الرقاقة (label) + الترجمة الصريحة (real)
//  layer: أي طبقة بيضوّي — أو null إذا بيضوّي ولا شي (وهاد قصة
//  بحد ذاتها: «تقرير شهري» بيبيّن قياس وهو مش قياس)
// ─────────────────────────────────────────────────────────────
export const ITEMS = [
  // ── اللي بتلاقيه بكل عرض ──
  {
    id: 'designs15',
    layer: 'exec',
    ar: {
      label: '١٥ تصميم شهرياً',
      real: '١٥ قطعة تنفيذ. السؤال المهم: مبنية على شو؟ إذا ما في جواب، فهي ١٥ تخمين حلو الشكل.',
    },
    en: {
      label: '15 designs a month',
      real: 'Fifteen pieces of execution. The real question: built on what? If there is no answer, they are fifteen good-looking guesses.',
    },
  },
  {
    id: 'reels8',
    layer: 'exec',
    ar: {
      label: '٨ ريلز',
      real: 'حركة عالحساب، والريلز فعلاً بتوصل. بس الريل اللي مش مبني على رسالة بيوصل لناس ما بيشتروا.',
    },
    en: {
      label: '8 reels',
      real: 'Motion on the account, and reels do travel. But a reel with no message behind it travels to people who never buy.',
    },
  },
  {
    id: 'videos4',
    layer: 'exec',
    ar: {
      label: '٤ فيديوهات مونتاج',
      real: 'أقوى فورمات اليوم. وقوته كلها بأول ثانيتين، وأول ثانيتين قرار رسالة مش قرار مونتاج.',
    },
    en: {
      label: '4 edited videos',
      real: "Today's strongest format. All its power sits in the first two seconds, and those are a message decision, not an editing one.",
    },
  },
  {
    id: 'daily',
    layer: 'exec',
    ar: {
      label: 'نشر يومي',
      real: 'حضور مستمر. الحضور بيذكّر فيك، بس لحاله ما بيقنع حدا يدفع.',
    },
    en: {
      label: 'Daily posting',
      real: 'Constant presence. Presence reminds people you exist. It does not, on its own, convince anyone to pay.',
    },
  },
  {
    id: 'manage',
    layer: 'exec',
    ar: {
      label: 'إدارة الصفحة',
      real: 'حدا بيهتم بالحساب، وهاد منيح. بس إدارة صفحة بلا اتجاه هي ترتيب مقعد بسيارة واقفة.',
    },
    en: {
      label: 'Page management',
      real: 'Someone tends the account, which is good. But managing a page with no direction is adjusting the seat of a parked car.',
    },
  },
  {
    id: 'boost',
    layer: 'reach',
    ar: {
      label: 'تعزيز البوستات',
      real: 'دفع لميتا عشان توصل أبعد. توصيل رسالة ضعيفة لناس أكثر بيكلف أكثر وبيبيع أقل.',
    },
    en: {
      label: 'Boosting posts',
      real: 'Paying Meta to go further. Delivering a weak message to more people costs more and sells less.',
    },
  },
  {
    id: 'reports',
    layer: null, // ⚠️ مقصودة: تقرير اللايكات بيبيّن قياس وهو مش قياس
    ar: {
      label: 'تقرير شهري',
      real: 'إذا التقرير أرقام لايكات ووصول، فهو ورقة مش قياس. القياس الحقيقي بيجاوب: شو منغيّر الشهر الجاي؟',
    },
    en: {
      label: 'Monthly report',
      real: 'If the report is likes and reach numbers, it is paperwork, not measurement. Real measurement answers: what do we change next month?',
    },
  },
  // ── اللي نادراً بتلاقيه بالعروض ──
  {
    id: 'research',
    layer: 'diag',
    ar: {
      label: 'دراسة سوق وجمهور',
      real: 'هون بيبدأ التسويق الحقيقي: مين بيشتري، ليش بيشتري، وليش لأ. كل شي بعده بينبني على هاد.',
    },
    en: {
      label: 'Market & audience research',
      real: 'This is where real marketing starts: who buys, why they buy, and why they do not. Everything else is built on this.',
    },
  },
  {
    id: 'competitors',
    layer: 'diag',
    ar: {
      label: 'تحليل منافسين',
      real: 'مش عشان تقلّدهم. عشان تعرف وين الفجوة اللي بتفوت منها، وشو الرسالة اللي محدا حكاها.',
    },
    en: {
      label: 'Competitor analysis',
      real: 'Not to copy them. To find the gap you can enter through, and the message nobody has said yet.',
    },
  },
  {
    id: 'strategy',
    layer: 'msg',
    ar: {
      label: 'استراتيجية ورسالة',
      real: 'القرار الأهم: شو منحكي ولمين. بدونه كل التصاميم والريلز اجتهادات شخصية.',
    },
    en: {
      label: 'Strategy & message',
      real: 'The decision that rules the rest: what we say and to whom. Without it, every design and reel is a personal guess.',
    },
  },
  {
    id: 'offer',
    layer: 'msg',
    ar: {
      label: 'بناء العرض',
      real: 'السبب اللي بيخلي الزبون يختارك إنت مش غيرك. أقوى قطعة بالمعادلة وأكثر وحدة منسية.',
    },
    en: {
      label: 'Offer building',
      real: 'The reason a customer picks you over anyone else. The strongest piece of the equation, and the most forgotten.',
    },
  },
  {
    id: 'landing',
    layer: 'convert',
    ar: {
      label: 'صفحة هبوط',
      real: 'المكان اللي الزيارة بتتحول فيه لطلب. إعلان قوي بيوصّل لصفحة ضعيفة معناه ميزانية بتنصب بمصفاة.',
    },
    en: {
      label: 'Landing page',
      real: 'Where a visit turns into an order. A strong ad pointing at a weak page is budget poured through a sieve.',
    },
  },
  {
    id: 'reply',
    layer: 'convert',
    ar: {
      label: 'نظام رد سريع',
      real: 'نص البيع عنا بيصير بالمسجات. رد بعد ست ساعات بيقتل أشطر حملة.',
    },
    en: {
      label: 'Fast-reply system',
      real: 'Half of local sales happen in DMs. A six-hour reply kills the smartest campaign.',
    },
  },
  {
    id: 'tracking',
    layer: 'measure',
    ar: {
      label: 'تتبع وقياس نتائج',
      real: 'الأرقام اللي بتقرر: وقّف شو، زيد شو، وجرّب شو. بدونها كل شهر بيبدأ من الصفر.',
    },
    en: {
      label: 'Tracking & measurement',
      real: 'The numbers that decide what to stop, what to scale, and what to test. Without them every month starts from zero.',
    },
  },
];

// ─────────────────────────────────────────────────────────────
//  عروض جاهزة — كبسة وحدة بتعبّي الرقاقات
//  typical = العرض اللي بتشوفه كل يوم · full = شكل الشغل الصح
// ─────────────────────────────────────────────────────────────
export const PRESETS = [
  {
    id: 'typical',
    items: ['designs15', 'reels8', 'daily', 'manage', 'boost', 'reports'],
    ar: { label: 'العرض اللي بتشوفه كل يوم' },
    en: { label: 'The offer you see every day' },
  },
  {
    id: 'full',
    items: ['research', 'strategy', 'offer', 'designs15', 'videos4', 'boost', 'landing', 'reply', 'tracking'],
    ar: { label: 'شكل الشغل الصح' },
    en: { label: 'What real work looks like' },
  },
];

// ─────────────────────────────────────────────────────────────
//  الأحكام — المحرّك بيختار وحدة حسب الطبقات المغطاية:
//  decor   = تنفيذ و/أو وصول بس (الباكج الكلاسيكي)
//  lecture = تفكير بلا تنفيذ (عكس المشكلة، ونادر بس بيصير)
//  partial = خليط فيه فجوات
//  system  = ٥ طبقات أو أكثر
//  stamp = الختم اللي بينطبع عالشاشة · text = الشرح تحته
// ─────────────────────────────────────────────────────────────
export const VERDICTS = {
  decor: {
    ar: {
      stamp: 'ديكور رقمي',
      text: 'هاد العرض كله تنفيذ ووصول: شغل بينشاف، بس ولا بند فيه بيجاوب ليش الناس ما بتشتري. مش غلط تشتريه. الغلط تتوقع منه يحل البيع.',
    },
    en: {
      stamp: 'Digital decor',
      text: 'This offer is all execution and reach: work that gets seen, but not one item answers why people are not buying. Buying it is not the mistake. Expecting it to fix sales is.',
    },
  },
  lecture: {
    ar: {
      stamp: 'محاضرة بلا تنفيذ',
      text: 'تفكير واستراتيجية بلا أي تنفيذ ولا وصول. الخطة اللي ما بتتنفذ رأي مكتوب حلو. النمو بده العقل والإيد مع بعض.',
    },
    en: {
      stamp: 'A lecture, no hands',
      text: 'Thinking and strategy with no execution and no reach. A plan nobody executes is a nicely written opinion. Growth needs the brain and the hands together.',
    },
  },
  partial: {
    ar: {
      stamp: 'بداية، بس فيها فجوات',
      text: 'في قطع صح بهاد العرض، بس المعادلة بتشتغل كاملة أو بتسرّب. الطبقات المطفية فوق هي بالضبط وين المصاري رح تضيع.',
    },
    en: {
      stamp: 'A start, with gaps',
      text: 'There are right pieces in this offer, but the equation either runs complete or it leaks. The unlit layers above are exactly where the money will go missing.',
    },
  },
  system: {
    ar: {
      stamp: 'نظام نمو',
      text: 'هاد مش باكج. هاي منظومة: تشخيص، رسالة، تنفيذ، وصول، تحويل، وقياس بيشتغلوا مع بعض. إذا حدا عرض عليك هيك فعلاً، خليك معه.',
    },
    en: {
      stamp: 'A growth system',
      text: 'This is not a package. It is a system: diagnosis, message, execution, reach, conversion and measurement working together. If someone actually offered you this, stay with them.',
    },
  },
  empty: {
    ar: {
      stamp: 'عرض فاضي',
      text: 'ولا بند. على الأقل ما في شي بينباع بالوهم. علّم البنود اللي بالعرض اللي قدامك وجرّب.',
    },
    en: {
      stamp: 'An empty offer',
      text: 'Not a single item. On the bright side, nothing is being oversold. Tick what the offer in front of you includes and try again.',
    },
  },
};
