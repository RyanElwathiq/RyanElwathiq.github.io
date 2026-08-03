// ═══════════════════════════════════════════════════════════════
//  بيانات «كشف الشركة»
//
//  الفكرة: محادثة وهمية مع شركة تسويق. الزائر بيسأل سؤال (إحنا
//  بنكتبه)، الشركة بترد، وهو لازم يحكم: الرد طبيعي ولا علم أحمر؟
//  بيتعلم يميّز الأعلام الحمراء الثلاثة بالتجربة مش بالقراءة.
//
//  ⚠️ مش كل الردود أعلام حمراء عن قصد — لو كله أحمر، اللعبة
//     بتصير «اكبس أحمر دايماً» وما حدا بيتعلم إشي. الردود
//     الطبيعية هي اللي بتخلي التمييز مهارة.
//  ⚠️ النبرة: الشركة الوهمية مش شريرة كرتونية — ردودها من النوع
//     اللي بتسمعه فعلاً بالسوق وبيبين منطقي لأول وهلة. هاي
//     الصعوبة الحقيقية وهاي اللعبة.
//
//  ✏️ بدك تضيف جولة؟ عنصر جديد بـ EXCHANGES: سؤال الزائر (q)،
//     رد الشركة (a)، flag (true = علم أحمر)، والشرح (why).
//     الترتيب مقصود (قوس قصة: بداية لطيفة، بعدين بتحمى) —
//     ما في خلط عشوائي.
// ═══════════════════════════════════════════════════════════════

export const EXCHANGES = [
  {
    id: 'opening',
    flag: true,
    ar: {
      q: 'مرحبا، بدي أفهم شو بتقدموا لمشروع زي مشروعي.',
      a: 'أهلين فيك! عنا ثلاث باكجات: برونزي ١٢ تصميم، فضي ١٥ تصميم + ٤ ريلز، وذهبي ٢٠ تصميم + ٨ ريلز + إدارة كاملة. أي واحد بيناسبك؟',
      why: 'أول علامة: أول رد كان قائمة أسعار، وولا سؤال واحد عن مشروعك أو مشكلتك أو جمهورك. العرض جاهز من قبل ما يعرفوا مين إنت.',
    },
    en: {
      q: 'Hi, I want to understand what you offer for a project like mine.',
      a: 'Welcome! We have three packages: bronze 12 designs, silver 15 designs + 4 reels, and gold 20 designs + 8 reels + full management. Which suits you?',
      why: 'First sign: the very first reply was a price list, with not one question about your project, problem or audience. The offer was ready before they knew who you are.',
    },
  },
  {
    id: 'goal',
    flag: false,
    ar: {
      q: 'مشكلتي إنه في زيارات عالحساب بس ما في مبيعات.',
      a: 'سؤال مهم قبل ما نحكي حلول: الزيارات هاي جاية من وين؟ وشو بيصير لما حدا يبعتلكم رسالة، مين بيرد وبعد قديش عادةً؟',
      why: 'رد طبيعي ومنيح: بدل ما يقفز عالحل، سأل عن مصدر الزيارات وسرعة الرد. هيك بيبلش التشخيص الصح.',
    },
    en: {
      q: 'My problem is the account gets visits but no sales.',
      a: 'An important question before we talk solutions: where do these visits come from? And when someone messages you, who replies and how fast, usually?',
      why: 'A healthy reply: instead of jumping to a solution, they asked about the traffic source and reply speed. That is how a real diagnosis starts.',
    },
  },
  {
    id: 'results',
    flag: true,
    ar: {
      q: 'طيب شو النتائج اللي بتتوقعوها لمشروعي؟',
      a: 'شغلنا بيحكي عنا! مطعم اشتغلنا معه ضاعف مبيعاته بشهرين، ومتجر وصلناه ٥٠ طلب باليوم. نفس النظام رح نطبقه معك وإن شاء الله نفس النتائج.',
      why: 'ثاني علامة: نتائج غيرك مش وعد إلك. كل مشروع غير: ميزانية، جمهور، عرض، سوق، مرحلة. «نفس النظام» على سوق مختلف ما بيعطي نفس الرقم.',
    },
    en: {
      q: 'So what results do you expect for my project?',
      a: 'Our work speaks for itself! A restaurant we worked with doubled its sales in two months, and a store reached 50 orders a day. We will apply the same system to you, and hopefully the same results.',
      why: "Second sign: other people's results are not your promise. Every project differs: budget, audience, offer, market, stage. The same system in a different market never yields the same number.",
    },
  },
  {
    id: 'study',
    flag: false,
    ar: {
      q: 'وليش ما بتقدروا تحكولي رقم متوقع من هلأ؟',
      a: 'لأنه لسا ما درسنا سوقك ولا منافسينك ولا عرضك. أول شهر منشتغل بميزانية اختبار صغيرة، ومنقرا الأرقام، وبعدها منقدر نحكي بتوقعات مبنية على بياناتك إنت مش على تخمين.',
      why: 'رد صادق: رفض يرمي رقم بالهوا، وشرح شو لازم يصير قبل التوقع (دراسة، اختبار، قياس). هيك بيحكي اللي فاهم.',
    },
    en: {
      q: 'Why can you not give me an expected number right now?',
      a: 'Because we have not studied your market, competitors or offer yet. The first month we run a small test budget, read the numbers, and then we can talk expectations built on your data, not on guessing.',
      why: 'An honest reply: they refused to throw a number in the air and explained what must happen before a forecast (study, test, measure). That is how someone competent talks.',
    },
  },
  {
    id: 'shape',
    flag: true,
    ar: {
      q: 'شو اللي بيميزكم عن باقي الشركات؟',
      a: 'جودة التصميم عنا ما إلها منافس، وفريق المونتاج تبعنا من أقوى الفرق. بتشوف الفرق من أول بوست: هوية مرتبة، ألوان مدروسة، وفيديوهات سينمائية.',
      why: 'ثالث علامة: كل الحكي عن الشكل (تصاميم، ألوان، مونتاج) وولا كلمة عن رسالة أو جمهور أو نتائج. التصميم بيوقف العين، بس الرسالة هي اللي بتحرك القرار.',
    },
    en: {
      q: 'What makes you different from other companies?',
      a: 'Our design quality has no competition, and our editing team is one of the strongest. You see the difference from the first post: tidy identity, studied colors, cinematic videos.',
      why: 'Third sign: everything is about the shape (designs, colors, editing) and not a word about message, audience or results. Design stops the eye, but the message moves the decision.',
    },
  },
  {
    id: 'report',
    flag: false,
    ar: {
      q: 'وكيف بعرف إنه الشغل ماشي صح؟',
      a: 'كل أسبوعين منبعتلك تقرير قصير: شو جرّبنا، شو اشتغل وشو لأ، وشو مغيرين الفترة الجاية. وأي بند مش واضح منحكيه بمكالمة، مش منخليه رقم معلق.',
      why: 'رد سليم: التقرير عن قرارات (شو منغيّر) مش عن أرقام استعراضية، وفي استعداد يشرح. هاد الفرق بين قياس حقيقي وورقة شكلية.',
    },
    en: {
      q: 'How will I know the work is on track?',
      a: 'Every two weeks you get a short report: what we tested, what worked and what did not, and what we are changing next. Anything unclear, we explain on a call instead of leaving it a hanging number.',
      why: 'A sound reply: the report is about decisions (what changes) not vanity numbers, and they are ready to explain. That is the difference between real measurement and decorative paperwork.',
    },
  },
  {
    id: 'guarantee',
    flag: true,
    ar: {
      q: 'صراحة خايف أدفع وما أشوف نتيجة.',
      a: 'خوفك بمحله، بس معنا ما في هالخوف: منضمنلك زيادة واضحة بالمبيعات من أول شهر، وإذا ما صارت، الشهر الثاني علينا. إحنا واثقين من شغلنا ١٠٠٪.',
      why: 'العلامة الأخطر: ضمان مبيعات قبل أي دراسة. البيع بيعتمد على عرضك وسعرك وسوقك، وهدول ولا واحد منهم بإيد الشركة. الثقة الزايدة قبل الفهم مش ثقة، بيع.',
    },
    en: {
      q: 'Honestly, I am afraid of paying and seeing nothing.',
      a: 'A fair fear, but with us it does not exist: we guarantee a clear sales increase from month one, and if it does not happen, month two is on us. We are 100% confident in our work.',
      why: 'The most dangerous sign: a sales guarantee before any study. Sales depend on your offer, price and market, none of which are in the company’s hands. Overconfidence before understanding is not confidence. It is selling.',
    },
  },
];

// ─────────────────────────────────────────────
//  أحكام النهاية — حسب عدد الأحكام الصحيحة من مجموع الجولات
// ─────────────────────────────────────────────
export const VERDICTS = [
  {
    min: 0,
    ar: {
      stamp: 'صيد اليوم: ولا علم',
      text: 'ولا يهمك، هاي الردود مصممة تبين منطقية، وهيك هي فعلاً بالسوق. ارجع جرّب وركّز على سؤال واحد: هل الشركة عم تحكي عني أنا، ولا عن حالها؟',
    },
    en: {
      stamp: "Today's catch: nothing",
      text: 'No worries. These replies are designed to sound reasonable, and that is exactly how they sound in the market. Try again with one question in mind: is the company talking about me, or about itself?',
    },
  },
  {
    min: 3,
    ar: {
      stamp: 'عينك بتتفتح',
      text: 'مسكت شوية أعلام وفاتك شوية. الفخ إنه العلم الأحمر ما بيجي أحمر، بيجي بجملة واثقة ومريحة. راجع اللي فاتك فوق، هو بالضبط اللي رح تسمعه بأول مكالمة حقيقية.',
    },
    en: {
      stamp: 'Your eye is opening',
      text: 'You caught some flags and missed some. The trap is that a red flag never arrives red. It arrives as a confident, comforting sentence. Review what you missed above. It is exactly what you will hear on a real first call.',
    },
  },
  {
    min: 6,
    ar: {
      stamp: 'كاشف محترف',
      text: 'ما بتنباع بسهولة. ميّزت الردود اللي بتحكي عن مشروعك من الردود اللي بتبيعك حكي حلو. خذ هاي العين معك على أول اجتماع جاي.',
    },
    en: {
      stamp: 'A professional detector',
      text: 'You are not easily sold. You told the replies that talk about your project apart from the ones selling you sweet talk. Take this eye with you into your next first meeting.',
    },
  },
];
