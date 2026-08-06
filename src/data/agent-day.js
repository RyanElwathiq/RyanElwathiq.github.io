// ═══════════════════════════════════════════════════════════════
//  بيانات «جرّب توظّف وكيلك» — محاكاة يوم كامل من شغل وكيل ذكي
//
//  الفكرة: بدل ما نشرح للزائر شو بيعمل الوكيل، منخليه يعيّن واحد
//  ويتفرج عليه بيشتغل: بيختار مجاله + المهام اللي بتاكل وقته،
//  والمحاكاة بتعرض «يوم» كامل كتايم لاين حي، وبالآخر كم ساعة
//  رجعتله بالأسبوع.
//
//  ⚠️ كل شي حتمي (بلا AI وبلا عشوائية) — نفس الاختيارات بتطلّع
//     نفس اليوم، عشان الفحص يقدر يقيس والتكلفة صفر.
//  ⚠️ الساعات تقديرات **محافظة** عن قصد — نفس قاعدة حاسبة الخسارة:
//     رقم بينصدق أحسن من رقم بيبهر.
//
//  ✏️ بدك تضيف مجال؟ عنصر بـ INDUSTRIES بنفس الخانات (slots) —
//     الأحداث بتستعملها بصيغة {q1} {q2} {item} {booking} {follow}.
//  ✏️ بدك تضيف مهمة؟ عنصر بـ TASKS: ساعات + أحداث بوقت ثابت.
// ═══════════════════════════════════════════════════════════════

export const INDUSTRIES = [
  {
    key: 'rest',
    ar: {
      name: 'مطعم / كافيه',
      q1: 'في توصيل لمنطقتنا؟',
      q2: 'قديش بياخد الطلب وقت هلأ؟',
      item: 'طلب وجبة العيلة',
      booking: 'حجز طاولة لأربعة الساعة ٨',
      follow: 'سأل عن منيو المناسبات وسكت',
    },
    en: {
      name: 'Restaurant / cafe',
      q1: 'Do you deliver to our area?',
      q2: 'How long are orders taking right now?',
      item: 'a family-meal order',
      booking: 'the table-for-four booking at 8',
      follow: 'asked about the events menu then went quiet',
    },
  },
  {
    key: 'clinic',
    ar: {
      name: 'عيادة',
      q1: 'قديش الكشفية؟',
      q2: 'في دوام يوم السبت؟',
      item: 'موعد التنظيف',
      booking: 'موعد بكرا الساعة ٥',
      follow: 'سأل عن التقويم وما حجز',
    },
    en: {
      name: 'Clinic',
      q1: 'How much is the consultation?',
      q2: 'Are you open on Saturdays?',
      item: 'the cleaning appointment',
      booking: "tomorrow's 5 o'clock appointment",
      follow: 'asked about braces and never booked',
    },
  },
  {
    key: 'store',
    ar: {
      name: 'متجر أونلاين',
      q1: 'قديش رسوم التوصيل؟',
      q2: 'متوفر مقاس L؟',
      item: 'الطلبية رقم ٤٨٢',
      booking: 'تأكيد استلام الطلبية',
      follow: 'حط بالسلة وما كمّل الدفع',
    },
    en: {
      name: 'Online store',
      q1: 'How much is shipping?',
      q2: 'Is size L in stock?',
      item: 'order #482',
      booking: 'the delivery confirmation',
      follow: 'added to cart and never checked out',
    },
  },
  {
    key: 'salon',
    ar: {
      name: 'صالون',
      q1: 'في دور فاضي اليوم؟',
      q2: 'قديش صبغة الشعر؟',
      item: 'حجز العروس',
      booking: 'حجز السبت الصبح',
      follow: 'سألت عن باكج العروس وسكتت',
    },
    en: {
      name: 'Salon',
      q1: 'Any free slots today?',
      q2: 'How much is a hair colour?',
      item: 'the bridal booking',
      booking: 'the Saturday-morning booking',
      follow: 'asked about the bridal package then went quiet',
    },
  },
  {
    key: 'services',
    ar: {
      name: 'خدمات وصيانة',
      q1: 'بتشتغلوا برا عمّان؟',
      q2: 'قديش بتكلف المعاينة؟',
      item: 'طلب الصيانة الجديد',
      booking: 'معاينة بكرا الصبح',
      follow: 'أخد عرض سعر وما رد',
    },
    en: {
      name: 'Trades & services',
      q1: 'Do you work outside the city?',
      q2: 'How much is an inspection visit?',
      item: 'the new maintenance request',
      booking: "tomorrow morning's inspection",
      follow: 'took a quote and never replied',
    },
  },
];

// ─── المهام — كل وحدة: ساعات أسبوعية (محافظة) + أحداث يومها ───
export const TASKS = [
  {
    key: 'faq',
    icon: '💬',
    hours: 5,
    ar: {
      label: 'الرد على نفس الأسئلة المتكررة',
      events: [
        { t: '08:42', x: 'زبون سأل: «{q1}» — الوكيل رد بالجواب المعتمد خلال ٧ ثواني.' },
        { t: '13:07', x: 'سؤال ثاني: «{q2}» — انرد عليه وإنت عالغدا، وما حدا استنى.' },
        { t: '17:24', x: 'نفس سؤال الصبح انسأل للمرة الخامسة — الوكيل ما بيمل، جاوب بنفس الدقة.' },
      ],
    },
    en: {
      label: 'Answering the same questions again and again',
      events: [
        { t: '08:42', x: 'A customer asked: “{q1}” — the agent replied with your approved answer in 7 seconds.' },
        { t: '13:07', x: 'Another one: “{q2}” — answered while you were at lunch. Nobody waited.' },
        { t: '17:24', x: "The morning's question came in for the fifth time — the agent never gets bored, same precise answer." },
      ],
    },
  },
  {
    key: 'booking',
    icon: '📅',
    hours: 4,
    ar: {
      label: 'تأكيد وتذكير المواعيد',
      events: [
        { t: '09:00', x: 'بعت تذكير لطيف عن {booking} — التأكيد وصل خلال دقيقتين.' },
        { t: '16:30', x: 'زبون طلب تأجيل — الوكيل نقل الموعد وعدّل الجدول وبعت التأكيد الجديد.' },
      ],
    },
    en: {
      label: 'Confirming and reminding about appointments',
      events: [
        { t: '09:00', x: 'Sent a friendly reminder about {booking} — confirmed within two minutes.' },
        { t: '16:30', x: 'A customer asked to reschedule — the agent moved it, fixed the calendar, and sent the new confirmation.' },
      ],
    },
  },
  {
    key: 'follow',
    icon: '🔁',
    hours: 4,
    ar: {
      label: 'متابعة اللي سأل وما اشترى',
      events: [
        { t: '11:15', x: 'واحد {follow} من يومين — الوكيل بعتله متابعة لطيفة بلا إلحاح.' },
        { t: '19:40', x: 'رجع رد عالمتابعة وكمّل — بيع كان رح يضيع لولا رسالة وحدة بوقتها.' },
      ],
    },
    en: {
      label: 'Following up with people who asked and never bought',
      events: [
        { t: '11:15', x: 'Someone {follow} two days ago — the agent sent one gentle follow-up, no pressure.' },
        { t: '19:40', x: 'They replied and completed the purchase — a sale that would have quietly died without one well-timed message.' },
      ],
    },
  },
  {
    key: 'after',
    icon: '🌙',
    hours: 3,
    ar: {
      label: 'الرد برا أوقات الدوام',
      events: [
        { t: '06:45', x: 'سؤال وصل قبل ما تصحى — انرد عليه، والزبون حس إنه في حدا صاحي عشانه.' },
        { t: '22:58', x: 'رسالة بالليل: «{q1}» — انردت فوراً. نص الباحثين بالليل بيشتروا من أول واحد بيرد.' },
      ],
    },
    en: {
      label: 'Replying outside working hours',
      events: [
        { t: '06:45', x: 'A question arrived before you woke up — answered, and the customer felt someone was awake for them.' },
        { t: '22:58', x: 'A late-night message: “{q1}” — answered instantly. Night browsers buy from whoever replies first.' },
      ],
    },
  },
  {
    key: 'orders',
    icon: '🧾',
    hours: 3,
    ar: {
      label: 'تجميع الطلبات والبيانات بمكان واحد',
      events: [
        { t: '12:20', x: '{item} انسجل لحاله بالجدول: الاسم، التفاصيل، والتواصل — بلا نسخ ولصق.' },
        { t: '20:15', x: 'يومك اتلخص: كل الطلبات والأسئلة بمكان واحد مرتب، مش مبعثرة عالشاشات.' },
      ],
    },
    en: {
      label: 'Collecting orders and details in one place',
      events: [
        { t: '12:20', x: '{item} logged itself into the sheet: name, details, contact — no copy-paste.' },
        { t: '20:15', x: 'Your day summarised: every order and question in one tidy place instead of five screens.' },
      ],
    },
  },
  {
    key: 'review',
    icon: '⭐',
    hours: 2,
    ar: {
      label: 'طلب تقييم بعد كل خدمة',
      events: [
        { t: '18:05', x: 'كل اللي انخدموا اليوم وصلتهم رسالة شكر + رابط تقييم — التقييمات بتتراكم وإنت نايم.' },
      ],
    },
    en: {
      label: 'Asking for a review after every job',
      events: [
        { t: '18:05', x: "Everyone served today got a thank-you + a review link — reviews stack up while you sleep." },
      ],
    },
  },
  {
    key: 'report',
    icon: '📊',
    hours: 2,
    ar: {
      label: 'تقرير أسبوعي بالأرقام',
      events: [
        { t: '21:00', x: 'وصلك الملخص: شو انباع، مين سأل عن شو، وشو أكثر سؤال اتكرر — قرارات بكرا صارت أسهل.' },
      ],
    },
    en: {
      label: 'A weekly report with the numbers',
      events: [
        { t: '21:00', x: 'Your summary arrived: what sold, who asked about what, and the most repeated question — tomorrow’s decisions just got easier.' },
      ],
    },
  },
];

export const TEXTS = {
  ar: {
    eyebrow: 'جرّبها بنفسك',
    title: 'وظّف وكيلك — وتفرّج عليه يوم كامل',
    lede: 'اختار مجالك، علّم على المهام اللي بتاكل يومك، وشغّل المحاكاة: هيك بيبين يومك لما يكون في وكيل ذكي شغال معك.',
    step1: 'شو مجالك؟',
    step2: 'شو المهام اللي بتاكل وقتك؟ (علّم على اللي بتحسه)',
    run: 'شغّل اليوم ▶',
    runHint: 'علّم على مهمة عالأقل',
    dayTitle: 'يومك مع الوكيل',
    doneTitle: 'اليوم خلص. الحصيلة:',
    // {n} و {h} بينتبدلوا بالجافاسكربت وقت التشغيل
    // قاعدة العدد: ٣-١٠ جمع («مهام»)، وغيرها مفرد («مهمة»)
    tasksDone: '{n} مهمة انعملت بلا ما تلمس تلفونك',
    tasksDoneFew: '{n} مهام انعملت بلا ما تلمس تلفونك',
    hoursBack: 'و~{h} ساعة بالأسبوع رجعت لإلك',
    human: 'اللي ضل إلك: القرار والذوق والعلاقة مع زباينك — هاد اللي ولا وكيل بيعمله عنك.',
    note: 'الأرقام تقديرية ومحافظة عن قصد. الوكيل الحقيقي بينبني على شغلك إنت وبنحسب أرقامه سوا.',
    ctaWait: 'سجّلني بقائمة الانتظار',
    again: 'جرّب تركيبة ثانية',
  },
  en: {
    eyebrow: 'Try it yourself',
    title: 'Hire your agent — and watch it work a full day',
    lede: 'Pick your industry, tick the tasks eating your day, and run the simulation: this is what your day looks like with an AI agent on the team.',
    step1: 'What is your field?',
    step2: 'Which tasks eat your time? (tick what feels familiar)',
    run: 'Run the day ▶',
    runHint: 'Tick at least one task',
    dayTitle: 'Your day with the agent',
    doneTitle: 'Day over. The tally:',
    tasksDone: '{n} tasks handled without you touching your phone',
    tasksDoneFew: '{n} tasks handled without you touching your phone',
    hoursBack: 'and ~{h} hours a week back in your hands',
    human: 'What stays yours: the decisions, the taste, and the relationships — no agent does that for you.',
    note: 'Deliberately conservative estimates. A real agent is built around your business, and we work out its numbers together.',
    ctaWait: 'Put me on the waitlist',
    again: 'Try another mix',
  },
};
