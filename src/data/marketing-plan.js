// ═══════════════════════════════════════════════════════════════
//  بيانات «مولّد الخطة التسويقية»
//
//  الفكرة: ست أسئلة قصيرة (نوع النشاط · الجمهور · العقدة اللي
//  بتوقف البيع · الميزة · القنوات · هدف ٣ شهور) وبتطلع مسودة خطة
//  بسبعة أقسام مبنية على إجابات الزائر نفسه.
//
//  ⚠️ المسار الأساسي هلأ ذكي: الإجابات بتنبعت لنقطة /plan
//     بالـ Worker و«نبض» بيكتب خطة لحالة الزائر هو.
//  ⚠️ وكل اللي تحت (QUESTIONS و PLAN) هو **الاحتياطي**: لو النداء
//     فشل أو خلصت الحصة، المتصفح بيركّب نفس المسودة القديمة لحاله
//     وبلا أي طلب شبكة. يعني الزائر بيطلع بخطة بأي حال.
//     ⚠️ فلا تشيل ولا حقل من حقول الخيارات — الاحتياطي بينكسر.
//
//  ⚠️ قاعدة الصدق: ولا جملة هون بتوعد بنتيجة، ولا وحدة فيها سعر.
//     وكل خيار «ما بعرف» بينرد عليه باحترام لأنه أصدق جواب ممكن.
//
//  ✏️ ترتيب الأسئلة مهم: الجمهور قبل الرسالة، والعقدة قبل القنوات.
//     إذا بدك تضيف خيار، ضيفه بنفس الحقول تبع إخوته بالسطر.
// ═══════════════════════════════════════════════════════════════

export const QUESTIONS = [
  // ─────────────────── ١. نوع النشاط ───────────────────
  //  الحقول: noun (بيدخل بجملة «عندك …») · decide (طبيعة قرار
  //  الشراء) · move90 (حركة الشهر الثاني، مربوطة بنوع النشاط)
  {
    id: 'biz',
    ar: {
      q: 'شو نوع نشاطك؟',
      hint: 'اختار الأقرب، مش لازم تكون مطابقة تماماً.',
      options: [
        {
          v: 'products',
          label: 'متجر منتجات (أونلاين أو محل)',
          noun: 'متجر منتجات',
          decide: 'قرار الشراء عند زبونك سريع: بيتقرر بثواني من الصورة والسعر وشكل الثقة.',
          move90: 'صوّر منتجاتك من جديد بصور بتشرح الحجم والاستعمال، مش صور حلوة بس.',
        },
        {
          v: 'service',
          label: 'خدمة بتنباع بجلسة أو عقد',
          noun: 'خدمة بتنباع بجلسة أو عقد',
          decide: 'قرار الشراء عندك بطيء وفيه محادثة، فبتربح بالوضوح وسرعة الرد مش بالمنظر.',
          move90: 'اكتب صفحة وحدة بتشرح كيف بتشتغل الخدمة خطوة خطوة، عشان الزبون يعرف شو رح يصير قبل ما يدفع.',
        },
        {
          v: 'food',
          label: 'مطعم أو كافيه أو حلويات',
          noun: 'مطعم أو كافيه',
          decide: 'القرار لحظي وبيتكرر: الجوع ما بيستنى، بس التكرار هو اللي بيربح مش الزيارة الأولى.',
          move90: 'قصّر طريق الطلب لكبستين، وحط طريقة الطلب بكل مكان بتظهر فيه.',
        },
        {
          v: 'clinic',
          label: 'عيادة أو مركز تجميل',
          noun: 'عيادة أو مركز',
          decide: 'القرار عندك فيه خوف: الناس بتشتري طمأنينة قبل ما تشتري الخدمة.',
          move90: 'انشر محتوى بيجاوب الأسئلة اللي بيستحوا يسألوها، بنتائج صادقة وبلا مبالغة.',
        },
        {
          v: 'b2b',
          label: 'بتبيع لشركات مش لأفراد',
          noun: 'نشاط بيبيع لشركات',
          decide: 'قرار الشراء عندك بيمر بأكثر من شخص، وبياخد وقت، وبينبنى على المرجعية والثقة.',
          move90: 'اكتب حالة عمل وحدة بالتفصيل: شو كانت المشكلة، شو عملت، وشو صار بعدها.',
        },
        {
          v: 'notsure',
          label: 'لسا ببلش، الفكرة أوضح من التفاصيل',
          noun: 'مشروع لسا ببداياته',
          decide: 'ولسا ما في تاريخ مبيعات كفاية تحكم عليه، وهاد طبيعي بهالمرحلة مش تقصير.',
          move90: 'قبل أي إعلان، بيع لعشر زباين بإيدك واسمع كلامهم. أول عشرة بيعلموك أكثر من أي خطة مكتوبة.',
        },
      ],
    },
    en: {
      q: 'What kind of business is it?',
      hint: 'Pick the closest one. It does not have to match exactly.',
      options: [
        {
          v: 'products',
          label: 'A product shop (online or on a street)',
          noun: 'a product shop',
          decide: 'Your buyer decides fast: seconds, off the photo, the price and how safe you look.',
          move90: 'Reshoot your products so the photos explain size and use, not just look pretty.',
        },
        {
          v: 'service',
          label: 'A service sold by session or contract',
          noun: 'a service sold by session or contract',
          decide: 'Your buyer decides slowly and through a conversation, so you win on clarity and reply speed, not on visuals.',
          move90: 'Write one page explaining how the work runs, step by step, so the buyer knows what happens before paying.',
        },
        {
          v: 'food',
          label: 'A restaurant, cafe or bakery',
          noun: 'a food or coffee business',
          decide: 'The decision is instant and repeatable: hunger does not wait, but the second visit is where the money is.',
          move90: 'Cut the ordering route down to two taps, and put that route everywhere you appear.',
        },
        {
          v: 'clinic',
          label: 'A clinic or treatment centre',
          noun: 'a clinic or treatment centre',
          decide: 'The decision carries fear. People buy reassurance before they buy the treatment.',
          move90: 'Publish answers to the questions people are too shy to ask, with honest results and no exaggeration.',
        },
        {
          v: 'b2b',
          label: 'You sell to companies, not individuals',
          noun: 'a business selling to other businesses',
          decide: 'More than one person signs off, it takes time, and it runs on references and trust.',
          move90: 'Write up one case in detail: what the problem was, what you did, what happened after.',
        },
        {
          v: 'notsure',
          label: 'Still starting. The idea is clearer than the details',
          noun: 'a business still at the start',
          decide: 'There is not enough sales history to judge yet, and at this stage that is normal rather than a failing.',
          move90: 'Before any advertising, sell to ten customers by hand and listen. The first ten teach you more than any written plan.',
        },
      ],
    },
  },

  // ─────────────────── ٢. الجمهور ───────────────────
  //  الحقول: short (بيدخل بجملة «وجمهورك …») · who · where · talk
  {
    id: 'aud',
    ar: {
      q: 'مين بتحاول توصله؟',
      hint: 'اختار اللي بتشوفه أكثر بين زباينك الحاليين.',
      options: [
        {
          v: 'local',
          label: 'ناس بمنطقة محددة قريبة مني',
          short: 'ناس بمنطقة محددة حواليك',
          who: 'جمهورك ساكن أو شغال حوالين مكانك، وقراره بيتأثر بالقرب والسمعة أكثر من الإعلان نفسه.',
          where: 'بتلاقيهم بمجموعات المنطقة، وبتوصيات الجيران، وبخرايط جوجل لما يدوروا على أقرب حدا.',
          talk: 'فاحكي معهم باسم المنطقة بالحرف، وبتفاصيل بيعرفوها: الشارع، الإشارة، أوقات الدوام.',
        },
        {
          v: 'care',
          label: 'نساء بيهمهم المظهر والعناية',
          short: 'نساء بيهمهم المظهر والعناية',
          who: 'جمهورك بيقارن كثير قبل ما يشتري، وبيسأل صاحباته قبل ما يسألك.',
          where: 'بتلاقيهم بالإنستغرام والتيك توك، وبيتفرجوا على أكثر من حساب بنفس الدقيقة.',
          talk: 'فاحكي عن النتيجة اللي بتشوفها المرآة، وكون صادق بالمكونات أو الطريقة، وبلا وعود.',
        },
        {
          v: 'parents',
          label: 'أهالي بيقرروا لعيالهم',
          short: 'أهالي بيقرروا لعيالهم',
          who: 'اللي بيدفع مش اللي بيستعمل، فرسالتك لازم تطمّن الأهل وتفرّح الولد بنفس الوقت.',
          where: 'بتلاقيهم بمجموعات الأهالي وبالواتساب أكثر بكثير ما بتلاقيهم بالإعلانات.',
          talk: 'فاحكي بلغة الأمان والوقت: شو بيوفر عليهم، وليش هو الخيار المريح إلهم.',
        },
        {
          v: 'owners',
          label: 'أصحاب مشاريع صغيرة',
          short: 'أصحاب مشاريع صغيرة',
          who: 'جمهورك بيوزن كل قرش، وعالأغلب انلدغ قبلك من حدا وعده وما نفّذ.',
          where: 'بتلاقيهم بلينكدإن ومجموعات التجار وبالتوصية الشخصية أكثر من أي إعلان.',
          talk: 'فاحكي بالوضوح: شو بياخد بالضبط، شو بيصير خطوة خطوة، وشو مش داخل بالخدمة.',
        },
        {
          v: 'cheap',
          label: 'ناس بيدوروا على أرخص سعر',
          short: 'ناس بيدوروا على أرخص سعر',
          who: 'جمهور بيقارن السعر أول شي، وبيمشي لأول واحد بينزل تحتك بكرا.',
          where: 'بتلاقيهم بكل مكان، وهاي بالضبط المشكلة: ولا مكان بيخصهم لحالهم.',
          talk: 'إذا هاد جمهورك فعلاً، لعبتك بتصير بالحجم والتكلفة مش بالرسالة. وإذا مش هو، جرّب تحدد جمهور بيدفع مقابل إشي غير السعر: وقت، ثقة، أو راحة بال.',
        },
        {
          v: 'everyone',
          label: 'صراحة ما حددت، بحس كل الناس ممكن يشتروا',
          short: 'لسا ما تحدد بدقة',
          who: 'ما حددت جمهورك بعد، وهاد أكثر جواب بينحكى ومش عيب. بس الرسالة المكتوبة للكل ما بتلمس ولا حدا.',
          where: 'فسؤال «وين بتلاقيهم» ما بينجاوب اليوم، بينجاوب بعد ما تحددهم.',
          talk: 'أرخص خطوة: افتح مسجات آخر عشر زباين اشتروا منك، واقرأ مين هنّ فعلاً وشو سألوا. جمهورك مكتوب هناك، مش بالتخمين.',
        },
      ],
    },
    en: {
      q: 'Who are you trying to reach?',
      hint: 'Pick the one you see most among your current buyers.',
      options: [
        {
          v: 'local',
          label: 'People inside one specific area near me',
          short: 'people inside one specific area near you',
          who: 'Your buyers live or work around you, and proximity and reputation move them more than any advert.',
          where: 'You find them in area groups, in neighbour recommendations, and on Google Maps when they search for the nearest option.',
          talk: 'So name the area out loud, and use details they recognise: the street, the landmark, your opening hours.',
        },
        {
          v: 'care',
          label: 'Women who care about appearance and skincare',
          short: 'women who care about appearance and skincare',
          who: 'They compare a lot before buying, and they ask their friends before they ask you.',
          where: 'You find them on Instagram and TikTok, looking at several accounts in the same minute.',
          talk: 'So talk about the result the mirror shows, be honest about ingredients or method, and promise nothing.',
        },
        {
          v: 'parents',
          label: 'Parents deciding for their children',
          short: 'parents deciding for their children',
          who: 'The payer is not the user, so the message has to reassure the parent and delight the child at the same time.',
          where: 'You find them in parent groups and on WhatsApp far more than in ad feeds.',
          talk: 'So speak the language of safety and time: what it saves them, and why it is the easy choice.',
        },
        {
          v: 'owners',
          label: 'Owners of small businesses',
          short: 'owners of small businesses',
          who: 'They weigh every coin, and most of them have already been burned by someone who promised and never delivered.',
          where: 'You find them on LinkedIn, in trade groups, and through personal referral more than through advertising.',
          talk: 'So be specific: exactly what they get, what happens step by step, and what is not included.',
        },
        {
          v: 'cheap',
          label: 'People hunting for the cheapest price',
          short: 'people hunting for the cheapest price',
          who: 'They compare price first, and they walk to whoever goes lower than you tomorrow.',
          where: 'They are everywhere, which is exactly the problem: no place belongs to them alone.',
          talk: 'If this really is your audience, your game becomes volume and cost rather than messaging. If it is not, try defining an audience that pays for something other than price: time, trust, or peace of mind.',
        },
        {
          v: 'everyone',
          label: 'Honestly I have not defined it. Anyone could buy',
          short: 'not defined precisely yet',
          who: 'Your audience is not defined yet, which is the most common answer there is and no shame at all. But a message written for everyone touches nobody.',
          where: 'So "where do I find them" is not a question for today. It gets answered after you define them.',
          talk: 'Cheapest first step: open the messages of your last ten paying customers and read who they actually are and what they asked. Your audience is written there, not in a guess.',
        },
      ],
    },
  },

  // ─────────────────── ٣. العقدة ───────────────────
  //  الحقول: name (اسم العقدة) · diag (تشخيص) · fix (الحركة
  //  المفصّلة) · month1 (نسخة قصيرة لخطة ٩٠ يوم) · watch (المقياس)
  {
    id: 'prob',
    ar: {
      q: 'شو أكثر إشي بتحس إنه بيوقف البيع؟',
      hint: 'وحدة بس، الأصعب فيهم.',
      options: [
        {
          v: 'noreach',
          label: 'محدا بيعرفني أصلاً',
          name: 'محدا بيعرفك لهلأ',
          diag: 'مشكلتك بأول محطة بالرحلة: الوصول. رسالتك مش ضعيفة بالضرورة، هي ببساطة ما وصلت.',
          fix: 'انشر بثبات على قناة وحدة لمدة شهر كامل، ولو ميزانيتك صفر. بهالمرحلة الثبات بيعمل أكثر من الإبداع.',
          month1: 'ثبّت النشر على قناة وحدة، أربع أسابيع بلا انقطاع.',
          watch: 'راقب: كم واحد جديد وصله محتواك هالأسبوع، وكم واحد منهم رجع شافك مرة ثانية.',
        },
        {
          v: 'noaction',
          label: 'بيشوفوني وبيمرقوا، ما في تفاعل',
          name: 'بيشوفوك وبيمرقوا',
          diag: 'الوصول شغال والرسالة لأ. يعني الناس عم توصل وما عم تلاقي سبب يوقفها.',
          fix: 'بدّل أول سطر بكل منشور: أول سطر بيحكي عن مشكلتهم مش عن منتجك. وقارن بعد عشر منشورات.',
          month1: 'أعد كتابة أول سطر بعشر منشورات، وقارن النتيجة.',
          watch: 'راقب: نسبة اللي وقفوا وتفاعلوا من أصل اللي وصلهم، مش عدد المتابعين.',
        },
        {
          v: 'slowreply',
          label: 'بيسألوا وبعدين بيختفوا',
          name: 'بيسألوا وبعدين بيختفوا',
          diag: 'هاد أغلى تسريب فيهم كلهم. هدول ناس رفعوا إيدهم وقالوا «مهتم»، وضاعوا بين السؤال والجواب.',
          fix: 'اكتب ردود جاهزة لأكثر خمس أسئلة بتتكرر عليك، وحدد وقت رد ما بيتجاوز الساعة بأوقات الدوام. هاي بتنعمل هالأسبوع وبلا ولا قرش.',
          month1: 'ردود جاهزة لأكثر خمس أسئلة، ووقت رد أقل من ساعة.',
          watch: 'راقب: كم استفسار وصلك، وكم واحد انرد عليه بأقل من ساعة، وكم منهم اشترى.',
        },
        {
          v: 'price',
          label: 'بيقولوا غالي',
          name: 'كلمة «غالي»',
          diag: 'كلمة «غالي» نادراً بتعني السعر. عالأغلب بتعني إنه القيمة مش واضحة، فالزبون ما لقي بشو يقارن.',
          fix: 'اكتب بالضبط شو داخل بالمنتج أو الخدمة وشو مش داخل. الوضوح بيقلل كلمة «غالي» أكثر من أي خصم.',
          month1: 'انشر بوضوح شو داخل وشو مش داخل، بمكان بيشوفه الكل.',
          watch: 'راقب: كم واحد سأل عن السعر وكمّل، وكم واحد وقف عنده. الفرق بيقلك إذا المشكلة بالسعر ولا بالشرح.',
        },
        {
          v: 'trust',
          label: 'ما بيثقوا فيني لأني جديد',
          name: 'الثقة، لأنك جديد',
          diag: 'الثقة ما بتنشترى بإعلان، بتنبنى بالدليل. ودليلك أقل من منافسك الأقدم، وهاد واقع مش رأي.',
          fix: 'اجمع ثلاث شهادات حقيقية، مكتوبة أو مسجلة، من ناس دفعوا فعلاً، وحطهم بمكان بيمر عليه أي زائر بأول عشر ثواني.',
          month1: 'ثلاث شهادات حقيقية، بمكان بينشاف من أول ثانية.',
          watch: 'راقب: كم واحد بيسألك سؤال شك («بتوصلوا؟» «في ضمانة؟»)، وهل قلّت هالأسئلة بعد ما حطيت الأدلة.',
        },
        {
          v: 'retention',
          label: 'بيشتروا مرة وما بيرجعوا',
          name: 'الزبون بيشتري مرة وما بيرجع',
          diag: 'مشكلتك بعد البيع مش قبله. وهاي أغلى مشكلة بهدوء: إنت بتدفع تكلفة زبون جديد كل مرة من الصفر.',
          fix: 'رتّب زباينك القدام بقائمة وحدة، وابعتلهم رسالة بالشهر إلها قيمة حقيقية بلا طلب شراء.',
          month1: 'ابنِ قائمة الزباين القدام، وابعت أول رسالة إلها قيمة.',
          watch: 'راقب: كم بالمية من طلبات هالشهر إجت من زبون اشترى قبل هيك. هاد الرقم لحاله بيقلب خطتك.',
        },
      ],
    },
    en: {
      q: 'What do you feel stops the sale most?',
      hint: 'One only. The hardest one.',
      options: [
        {
          v: 'noreach',
          label: 'Nobody knows I exist',
          name: 'nobody knows you exist yet',
          diag: 'Your problem sits at the first station of the journey: reach. The message is not necessarily weak, it simply has not arrived.',
          fix: 'Publish consistently on one channel for a full month, even on a zero budget. At this stage consistency does more than creativity.',
          month1: 'Publish on one channel, four weeks with no gaps.',
          watch: 'Watch: how many new people saw you this week, and how many of them came back for a second look.',
        },
        {
          v: 'noaction',
          label: 'They see me and scroll past',
          name: 'they see you and scroll past',
          diag: 'Reach works, the message does not. People are arriving and finding no reason to stop.',
          fix: 'Rewrite the first line of every post so it talks about their problem rather than your product. Then compare after ten posts.',
          month1: 'Rewrite the opening line of ten posts and compare.',
          watch: 'Watch: the share of people who stopped and engaged out of those reached, not your follower count.',
        },
        {
          v: 'slowreply',
          label: 'They ask, then they disappear',
          name: 'they ask, then disappear',
          diag: 'This is the most expensive leak of the lot. These people raised a hand and said "interested", then got lost between the question and the answer.',
          fix: 'Write ready answers for your five most repeated questions, and set a reply window that never passes an hour during working hours. It can be done this week and costs nothing.',
          month1: 'Ready answers for the top five questions, and a reply window under an hour.',
          watch: 'Watch: how many enquiries arrived, how many were answered inside the hour, and how many of those bought.',
        },
        {
          v: 'price',
          label: 'They say it is expensive',
          name: 'the word "expensive"',
          diag: '"Expensive" rarely means the price. Usually it means the value is unclear, so the buyer has nothing to compare against.',
          fix: 'Write exactly what is included in the product or service and what is not. Clarity kills the word "expensive" faster than any discount.',
          month1: 'Publish exactly what is included and what is not, somewhere everyone sees it.',
          watch: 'Watch: how many asked the price and carried on, and how many stopped there. The gap tells you whether the problem is the price or the explanation.',
        },
        {
          v: 'trust',
          label: 'They do not trust me because I am new',
          name: 'trust, because you are new',
          diag: 'Trust is not bought with an advert, it is built with proof. Your proof is thinner than the older competitor down the road, and that is a fact rather than an opinion.',
          fix: 'Collect three real testimonials, written or recorded, from people who actually paid, and place them where any visitor meets them in the first ten seconds.',
          month1: 'Three real testimonials, placed where they are seen first.',
          watch: 'Watch: how many people ask doubt questions ("do you deliver?", "is there a guarantee?"), and whether those questions drop once the proof is up.',
        },
        {
          v: 'retention',
          label: 'They buy once and never come back',
          name: 'they buy once and never return',
          diag: 'Your problem lives after the sale rather than before it. And it is quietly the most expensive one: you pay the cost of a brand new customer every single time.',
          fix: 'Organise your past customers into one list, and send one message a month that carries real value with no purchase attached.',
          month1: 'Build the past-customer list and send the first useful message.',
          watch: "Watch: what share of this month's orders came from someone who had bought before. That single number can turn the plan on its head.",
        },
      ],
    },
  },

  // ─────────────────── ٤. الميزة ───────────────────
  //  الحقول: msg (كيف بتنصاغ الرسالة) · proof (شو الدليل المطلوب)
  {
    id: 'edge',
    ar: {
      q: 'شو اللي بيميزك عن اللي جنبك؟',
      hint: 'وإذا ما بتعرف، في خيار صادق تحت.',
      options: [
        {
          v: 'quality',
          label: 'جودة أعلى من اللي حواليي',
          msg: 'الجودة. بس «جودة» كلمة بيقولها الكل، فشغلتك تحوّلها لتفصيلة بتنشاف: شو بالضبط بتعمله غير، وليش بيفرق مع الزبون.',
          proof: 'الدليل المطلوب: مقارنة صادقة، أو تفصيلة بالتصنيع أو التنفيذ بتشرحها بصورة أو فيديو قصير.',
        },
        {
          v: 'speed',
          label: 'أسرع تنفيذ أو توصيل',
          msg: 'السرعة، وهاي ميزة بتنقاس وبتنحكى برقم: خلال كم بيوصل، وخلال كم بترد.',
          proof: 'الدليل المطلوب: التزام مكتوب بوقت محدد، وشهادات زباين بتذكر السرعة بالاسم.',
        },
        {
          v: 'care',
          label: 'تعامل شخصي ومتابعة',
          msg: 'التعامل والمتابعة، وهاي أقوى ميزة ممكن يملكها مشروع صغير، لأنها بتفرق فعلاً وبصعوبة بتنقلد.',
          proof: 'الدليل المطلوب: محادثات حقيقية منشورة بإذن أصحابها، أو قصة زبون تابعته بعد ما دفع.',
        },
        {
          v: 'niche',
          label: 'بتخصص بإشي ضيق محدا بيعمله',
          msg: 'التخصص الضيق، وهاي أثمن وحدة بالقائمة: اللي بيعمل إشي واحد بيصير أول اسم بيجي على البال.',
          proof: 'الدليل المطلوب: انضباط تحكي عن هالإشي الواحد بس، وتوقف تنشر عن كل إشي ثاني بتعرف تعمله.',
        },
        {
          v: 'cheap',
          label: 'سعري أنسب',
          msg: 'السعر. وهاي ميزة بتشتغل بس إذا تكلفتك فعلاً أقل، لأنه أي حدا بيقدر يقلد سعرك خلال أسبوع.',
          proof: 'الدليل المطلوب: إنك تعرف تكلفتك الحقيقية للطلب الواحد. وإذا ما بتعرفها، هاي الشغلة اللي قبل أي إعلان.',
        },
        {
          v: 'none',
          label: 'صراحة ما بعرف شو بيميزني',
          msg: 'ولا إشي تقدر تسميه لهلأ، وهاد أصدق جواب وأصعبه. بلاش تخترع ميزة.',
          proof: 'الطريق: اسأل ثلاث زباين دفعوا فعلاً «ليش اشتريت مني؟» والجواب اللي بيتكرر مرتين هو ميزتك الحقيقية، مش اللي بتتمناها.',
        },
      ],
    },
    en: {
      q: 'What sets you apart from the shop next door?',
      hint: 'And if you do not know, there is an honest option below.',
      options: [
        {
          v: 'quality',
          label: 'Higher quality than the others around me',
          msg: 'quality. But everyone claims quality, so the job is turning it into one visible detail: what exactly you do differently, and why it matters to the buyer.',
          proof: 'Proof needed: an honest comparison, or one production detail shown in a photo or a short video.',
        },
        {
          v: 'speed',
          label: 'Faster delivery or turnaround',
          msg: 'speed, and speed is a measurable claim: within how long it arrives, and within how long you reply.',
          proof: 'Proof needed: a written commitment to a specific time, and testimonials that mention speed by name.',
        },
        {
          v: 'care',
          label: 'Personal treatment and follow-up',
          msg: 'the way you treat people and follow up, which is the strongest edge a small business can own, because it genuinely matters and is genuinely hard to copy.',
          proof: 'Proof needed: real conversations published with permission, or one story of a customer you followed up with after they paid.',
        },
        {
          v: 'niche',
          label: 'I specialise in something narrow nobody else does',
          msg: 'a narrow specialism, and this is the most valuable one on the list: whoever does one thing becomes the first name people recall.',
          proof: 'Proof needed: the discipline to talk about that one thing only, and to stop publishing about everything else you happen to be able to do.',
        },
        {
          v: 'cheap',
          label: 'My price suits people better',
          msg: 'price. That only works if your actual cost is lower, because anyone can copy your price within a week.',
          proof: 'Proof needed: knowing your true cost per order. If you do not know it, that is the job that comes before any advertising.',
        },
        {
          v: 'none',
          label: 'Honestly I do not know what sets me apart',
          msg: 'nothing you can name yet, which is the most honest answer and the hardest one. Do not invent an edge.',
          proof: 'The route: ask three paying customers "why did you buy from me?" The answer that repeats twice is your real edge, not the one you wish for.',
        },
      ],
    },
  },

  // ─────────────────── ٥. القنوات (اختيار متعدد) ───────────────────
  //  الحقول: role (دور القناة بالخطة) · first (أول حركة عليها)
  {
    id: 'chan',
    multi: true,
    ar: {
      q: 'شو القنوات المتاحة عندك فعلاً؟',
      hint: 'اختار كل اللي عندك. وممكن ما تختار ولا وحدة، وهاد جواب كمان.',
      options: [
        {
          v: 'insta',
          label: 'إنستغرام',
          role: 'واجهتك اليومية، وأغلب الناس بتحكم عليك من أول تسع صور.',
          first: 'رتّب أول تسع منشورات، وخلي البايو يقول شو بتبيع ولمين بجملة وحدة.',
        },
        {
          v: 'tiktok',
          label: 'تيك توك',
          role: 'أرخص وصول متاح هلأ، بس بيطلب صراحة وسرعة مش إنتاج فخم.',
          first: 'صوّر ثلاث فيديوهات بتجاوب أكثر ثلاث أسئلة بتتكرر عليك، بالموبايل وبأقل مونتاج.',
        },
        {
          v: 'whatsapp',
          label: 'واتساب وقوائم الزباين',
          role: 'أغلى قناة عندك وأكثر وحدة منسية: ناس عطتك رقمها بإرادتها.',
          first: 'رتّب الأرقام بقائمة وحدة، وابعت رسالة فيها قيمة حقيقية بلا طلب شراء.',
        },
        {
          v: 'site',
          label: 'موقع إلكتروني',
          role: 'المكان الوحيد اللي إنت متحكم فيه بالكامل، وبيشتغل وإنت نايم.',
          first: 'تأكد إنه بيفتح بسرعة عالموبايل، وإنه التواصل معك بكبسة وحدة.',
        },
        {
          v: 'ads',
          label: 'ميزانية إعلانات، ولو صغيرة',
          role: 'مكبّر صوت مش حل. بيكبّر اللي شغال، وبيكبّر الخلل بنفس القوة.',
          first: 'لا تشغّل الإعلان قبل ما تنفك العقدة اللي فوق. وبعدها ابدأ باختبار صغير على رسالتين مش وحدة.',
        },
        {
          v: 'offline',
          label: 'محل أو موقع فعلي وناس بتمرق',
          role: 'ناس بتمر قدامك كل يوم وما بتكلفك ولا قرش.',
          first: 'خلي الواجهة تقول شو بتبيع من مسافة عشر أمتار، وحط طريقة يتابعوك فيها بعد ما يمشوا.',
        },
      ],
    },
    en: {
      q: 'Which channels do you actually have?',
      hint: 'Pick all that apply. Picking none is allowed, and it is an answer too.',
      options: [
        {
          v: 'insta',
          label: 'Instagram',
          role: 'your daily shop window. Most people judge you off the first nine squares.',
          first: 'Organise the first nine posts, and make the bio say what you sell and to whom in one line.',
        },
        {
          v: 'tiktok',
          label: 'TikTok',
          role: 'the cheapest reach available right now, but it asks for honesty and speed rather than polished production.',
          first: 'Film three videos answering your three most repeated questions, on a phone, with almost no editing.',
        },
        {
          v: 'whatsapp',
          label: 'WhatsApp and customer lists',
          role: 'your most valuable channel and the most forgotten one: people who handed you their number voluntarily.',
          first: 'Organise the numbers into one list, and send a message carrying real value with no ask attached.',
        },
        {
          v: 'site',
          label: 'A website',
          role: 'the only place you fully control, and the one that works while you sleep.',
          first: 'Make sure it opens fast on a phone, and that reaching you is one tap away.',
        },
        {
          v: 'ads',
          label: 'An advertising budget, even a small one',
          role: 'an amplifier rather than a solution. It scales what works, and it scales the broken part just as loudly.',
          first: 'Do not switch adverts on before the knot above is untied. After that, start with a small test on two messages, not one.',
        },
        {
          v: 'offline',
          label: 'A shop or physical spot with passers-by',
          role: 'people walking past you every day at no cost to you at all.',
          first: 'Make the shopfront say what you sell from ten metres away, and give people a way to follow you after they walk on.',
        },
      ],
    },
  },

  // ─────────────────── ٦. هدف ٣ شهور ───────────────────
  //  الحقول: short · focus (حركة الشهر الثالث) · watch (المقياس)
  {
    id: 'goal',
    ar: {
      q: 'شو هدفك بالثلاث شهور الجاية؟',
      hint: 'هدف واحد. الأهداف المتعددة بتقتل بعضها.',
      options: [
        {
          v: 'firstsales',
          label: 'أول مبيعات ثابتة',
          short: 'أول مبيعات ثابتة',
          focus: 'كرّر اللي جاب أول بيعة بالضبط. مش تنويع، تكرار. أول عشر مبيعات بتيجي من إعادة حركة وحدة نجحت، مش من عشر حركات جديدة.',
          watch: 'راقب: كم بيعة بالأسبوع، ومن وين إجت كل وحدة بالاسم.',
        },
        {
          v: 'more',
          label: 'أضاعف الطلبات الحالية',
          short: 'مضاعفة الطلبات الحالية',
          focus: 'خذ المصدر اللي جايبلك أكثر طلبات وضاعف شغلك عليه لحاله، وقيس إذا الرقم بيكبر معه ولا بيوقف عند حد.',
          watch: 'راقب: عدد الطلبات بالأسبوع، ونسبة اللي إجت من كل مصدر.',
        },
        {
          v: 'leads',
          label: 'أجمع استفسارات جدية',
          short: 'استفسارات جدية',
          focus: 'اشتغل على جودة الاستفسار مش عدده. سؤال واحد من شخص جاهز يشتري بيساوي عشرين سؤال فضول.',
          watch: 'راقب: كم استفسار وصلك، وكم واحد منهم وصل لمرحلة السعر.',
        },
        {
          v: 'brand',
          label: 'الناس تعرفني وتتذكرني',
          short: 'إنه الناس تعرفك وتتذكرك',
          focus: 'ثبّت شكل واحد ولغة وحدة بكل اللي بتنشره. التذكّر بيجي من التكرار الممل، مش من التنويع الحلو.',
          watch: 'راقب: كم واحد وصلك وهو أصلاً بيعرف اسمك، بسؤال بسيط: «من وين سمعت فينا؟». وخلي ببالك إنه هاد أبطأ هدف بالقائمة، وثلاث شهور ما بتبيّنه. إذا محتاج مبيعات بسرعة، بدّل الهدف.',
        },
        {
          v: 'repeat',
          label: 'أخلي الزبون يرجع',
          short: 'إنه الزبون يرجع',
          focus: 'ابنِ سبب واحد يرجّعه: تذكير مربوط بوقت، عرض للزباين القدام بس، أو متابعة بعد الشراء بأسبوع.',
          watch: 'راقب: نسبة الطلبات الجاية من زباين قدام، وكم مرة بيشتري الزبون بالسنة بالمتوسط.',
        },
        {
          v: 'stopwaste',
          label: 'أوقف نزيف الميزانية وأعرف شو شغال',
          short: 'إنك توقف النزيف وتعرف شو شغال',
          focus: 'أوقف كل نشاط ما بتعرف تربطه بنتيجة. الإيقاف قرار تسويقي محترم، مش انسحاب.',
          watch: 'راقب: تكلفة الاستفسار الواحد وتكلفة الطلب الواحد. وإذا ما بتعرف تحسبهم، هاد أول إشي لازم ينحل.',
        },
      ],
    },
    en: {
      q: 'What is your goal for the next three months?',
      hint: 'One goal. Multiple goals kill each other.',
      options: [
        {
          v: 'firstsales',
          label: 'First steady sales',
          short: 'first steady sales',
          focus: 'repeat exactly what produced the first sale. Not variety, repetition. The first ten sales come from repeating one move that worked, not from ten new ones.',
          watch: 'Watch: sales per week, and where each one came from by name.',
        },
        {
          v: 'more',
          label: 'Double my current orders',
          short: 'doubling current orders',
          focus: 'take the source bringing the most orders and double your effort on that one alone, then measure whether the number scales with it or stalls.',
          watch: 'Watch: orders per week, and the share coming from each source.',
        },
        {
          v: 'leads',
          label: 'Collect serious enquiries',
          short: 'serious enquiries',
          focus: 'work on enquiry quality rather than quantity. One question from someone ready to buy is worth twenty curious ones.',
          watch: 'Watch: how many enquiries arrived, and how many of them reached the price conversation.',
        },
        {
          v: 'brand',
          label: 'Be known and remembered',
          short: 'being known and remembered',
          focus: 'lock one look and one voice across everything you publish. Being remembered comes from boring repetition, not from pleasant variety.',
          watch: 'Watch: how many arrivals already knew your name, from one simple question: "where did you hear about us?" And be warned, this is the slowest goal on the list and three months will not show it. If you need sales soon, change the goal.',
        },
        {
          v: 'repeat',
          label: 'Get the customer to come back',
          short: 'getting the customer to come back',
          focus: 'build one reason to return: a reminder tied to timing, an offer only past customers get, or a follow-up a week after the purchase.',
          watch: 'Watch: the share of orders coming from past customers, and how many times an average customer buys per year.',
        },
        {
          v: 'stopwaste',
          label: 'Stop the budget leak and find out what works',
          short: 'stopping the leak and finding out what works',
          focus: 'stop every activity you cannot connect to a result. Stopping is a respectable marketing decision, not a retreat.',
          watch: 'Watch: cost per enquiry and cost per order. If you cannot calculate them, that is the first thing to fix.',
        },
      ],
    },
  },
];

// ═══════════════════════════════════════════════════════════════
//  نصوص الخطة الثابتة: عناوين الأقسام والجمل الرابطة
//  ⚠️ الترتيب هون هو ترتيب الأقسام السبعة بالمخرج.
// ═══════════════════════════════════════════════════════════════
export const PLAN = {
  ar: {
    titles: [
      'وين إنت هلأ',
      'مين بتحكي معه',
      'رسالتك بجملة وحدة',
      'العقدة اللي بتنفك أول',
      'قنواتك ودور كل وحدة',
      'تسعين يوم على ثلاث حركات',
      'الأرقام اللي بتراقبها',
    ],
    have: 'عندك',
    // ⚠️ الفاصلة عربية هون ولاتينية بالإنجليزي — كانت مكتوبة جوّا
    //    المكوّن فطلعت فاصلة عربية بنص جملة إنجليزية
    comma: '، ',
    audLead: 'وجمهورك',
    knotLead: 'وأكبر عقدة بتوقف البيع هلأ:',
    goalLead: 'وهدف الثلاث شهور:',
    baseNote: 'الخطة كلها تحت مبنية على هالسطر. إذا السطر مش دقيق، عدّله قبل ما تكمّل.',
    edgeLead: 'اللي بيميزك حسب جوابك:',
    edgeTail: 'وأي منشور أو إعلان ما بيخدم هالجملة، ما بينزل.',
    fixLead: 'أول حركة عملية:',
    moveLead: 'أول حركة:',
    months: ['الشهر الأول:', 'الشهر الثاني:', 'الشهر الثالث:'],
    noChannels:
      'ما اخترت ولا قناة، وهاد بحد ذاته أول خطوة: اختار وحدة بس، واشتغل عليها شهر كامل قبل ما تفتح غيرها.',
    manyChannels:
      'اخترت أكثر من ثلاث قنوات. بصراحة، قناة وحدة شغالة صح بتعمل أكثر من أربعة نص شغل. رتبهم بالأولوية وابدأ بالأولى.',
    weekly:
      'ورقم واحد بس اكتبه كل أسبوع بورقة: كم واحد سأل، وكم واحد اشترى. باقي الأرقام بتفهمها بعدين.',
    honesty:
      'هاي مسودة أولى، مش خطة نهائية. مبنية على ست إجابات وبلا أرقامك الحقيقية: كم واحد بيسألك بالشهر، من وين إجا، وقديش بتكلفك المبيعة الوحدة. الخطة الجدية بتبلش من هالأرقام، وهاي بتقلك من وين تبلش تجمعهم. وممكن كمان تطلع إنك ما بتحتاج حدا يشتغل معك، بتحتاج تنفّذ اللي فوق.',
    copyHead: 'مسودة خطة تسويقية · ryanalali.me',
    copyNote: 'ملاحظة:',
  },
  en: {
    titles: [
      'Where you stand',
      'Who you are talking to',
      'Your message in one line',
      'The knot you untie first',
      'Your channels and what each one is for',
      'Ninety days in three moves',
      'The numbers you watch',
    ],
    have: 'You have',
    comma: ', ',
    audLead: 'and your audience is',
    knotLead: 'The biggest knot stopping the sale right now:',
    goalLead: 'And the three-month goal:',
    baseNote: 'Everything below is built on that line. If the line is not accurate, fix it before you read on.',
    edgeLead: 'What sets you apart, by your answer:',
    edgeTail: 'Anything you publish that does not serve that line does not go out.',
    fixLead: 'First practical move:',
    moveLead: 'First move:',
    months: ['Month one:', 'Month two:', 'Month three:'],
    noChannels:
      'You picked no channel, and that is the first step by itself: pick one, and work it for a full month before you open another.',
    manyChannels:
      'You picked more than three channels. Honestly, one channel done properly beats four done halfway. Rank them and start with the first.',
    weekly:
      'And one number, written by hand every week: how many asked, how many bought. The rest of the numbers can wait.',
    honesty:
      'This is a first draft, not a finished plan. It is built on six answers and none of your real numbers: how many people ask you in a month, where they came from, and what one sale costs you. A serious plan starts from those numbers, and this one tells you where to start collecting them. It may also turn out that you do not need anyone working with you, you need to execute what is above.',
    copyHead: 'Draft marketing plan · ryanalali.me',
    copyNote: 'Note:',
  },
};

// ═══════════════════════════════════════════════════════════════
//  أقسام النسخة الذكية (اللي بيكتبها «نبض»)
//
//  ⚠️ AI_KEYS لازم تطابق PLAN_SECTIONS بـ worker/src/index.js حرف
//     بحرف. لو غيّرت مفتاح هون بلا ما تغيّره هناك، القسم بيوصل
//     فاضي والتحقق بالـ Worker بيرفض الخطة كلها وبترجع للاحتياطي.
//
//  ⚠️ العناوين مكتوبة هون مش مولّدة: هيك اللغة تبعتنا محفوظة، وما
//     في عنوان بيطلع بصيغة غريبة ولا بعلامة Markdown قدام الزائر.
// ═══════════════════════════════════════════════════════════════
export const AI_KEYS = ['now', 'aud', 'offer', 'chan', 'days30', 'kpi', 'week'];

export const AI_TITLES = {
  ar: [
    'وين إنت هلأ',
    'مين جمهورك',
    'عرضك ورسالتك',
    'قنواتك بالأولويات',
    'خطة الثلاثين يوم',
    'مؤشرات القياس',
    'أول خطوة هالأسبوع',
  ],
  en: [
    'Where you stand today',
    'Who your audience is',
    'Your offer and your message',
    'Your channels, in priority order',
    'The thirty day plan',
    'The numbers you measure',
    'Your first move this week',
  ],
};
