// ═══════════════════════════════════════════════════════════════
//  بيانات «الرحلة المسرّبة»
//
//  الفكرة: ألف واحد كبسوا على إعلانك، وبين الكبسة والشراء رحلة
//  بأربع محطات، وكل محطة فيها تسريب. بكل محطة بتشوف العَرَض
//  (الأرقام) وبتختار إصلاح واحد من ثلاثة. الإصلاح الصح بيسكّر
//  الثقب، والغلط الشائع (اللي أغلب الناس بتعمله فعلاً) بيخلي
//  التسريب مستمر.
//
//  ⚠️ الخيارات الغلط مش أغبياء عن قصد — هي اللي بتنعمل فعلاً
//     بالسوق («جرّب إعلان جديد»، «نزّل السعر»). هاي هي العبرة:
//     التشخيص الغلط بيبين منطقي.
//  ⚠️ keep = نسبة اللي بيكملوا من هالمحطة حسب إصلاحك.
//
//  ✏️ بدك تعدّل محطة؟ هون. المحرّك بالمكوّن LeakyJourneySection.
// ═══════════════════════════════════════════════════════════════

export const STATIONS = [
  {
    id: 'landing',
    ar: {
      name: 'الهبطة',
      symptom: 'الإعلان وعد بـ«توصيل خلال ٢٠ دقيقة»، والكبسة بتفتح صفحة رئيسية عامة فيها كل شي. أغلب الناس بتطلع خلال ثوان.',
      fixes: [
        { text: 'غيّر الإعلان، يمكن الجمهور غلط', keep: 0.18, why: 'الإعلان عمل شغله: جاب ألف كبسة. اللي خان هو اللي بعد الكبسة. تغيير الإعلان هون حرق ميزانية على مشكلة مش موجودة.' },
        { text: 'خلي الكبسة تهبط على صفحة بتكمّل وعد الإعلان نفسه', keep: 0.55, why: 'هاد الإصلاح الصح: اللي كبس على «توصيل بـ٢٠ دقيقة» بده يشوف نفس الوعد قدامه، مش صفحة عامة بتخليه يدوّر. التطابق بين الإعلان والهبطة هو أول قانون بالرحلة.' },
        { text: 'ضيف بوب أب خصم ١٠٪ لما يفتح الصفحة', keep: 0.3, why: 'البوب أب ممكن يمسك شوية، بس المشكلة الأصلية ضلت: الصفحة مش متطابقة مع الوعد. رقّعت التسريب وما سكّرته.' },
      ],
    },
    en: {
      name: 'The landing',
      symptom: 'The ad promised "delivery in 20 minutes", and the click opens a generic homepage with everything on it. Most people leave within seconds.',
      fixes: [
        { text: 'Change the ad, maybe the audience is wrong', keep: 0.18, why: 'The ad did its job: a thousand clicks. What betrayed you is what came after the click. Changing the ad here burns budget on a problem that does not exist.' },
        { text: "Land the click on a page that continues the ad's exact promise", keep: 0.55, why: 'The right fix: whoever clicked "20-minute delivery" wants to see that same promise in front of them, not a generic page that makes them search. Ad-to-landing match is the first law of the journey.' },
        { text: 'Add a 10% discount popup on page open', keep: 0.3, why: 'The popup may hold a few, but the original problem remains: the page does not match the promise. You patched the leak without closing it.' },
      ],
    },
  },
  {
    id: 'offer',
    ar: {
      name: 'العرض',
      symptom: 'اللي ضلوا قروا الصفحة كلها... وطلعوا بلا ولا سؤال. السعر مخفي ورا «راسلنا»، والعرض ما بيوضح ليش إنت مش غيرك.',
      fixes: [
        { text: 'صور أحلى وفيديو أفخم للصفحة', keep: 0.2, why: 'الصفحة أصلاً حلوة كفاية عشان يقروها كاملة. المشكلة مش بصرية: هم ما فهموا ليش يختاروك ولا قديش بيكلف. الشكل ما بيجاوب هالسؤالين.' },
        { text: 'سعر واضح + سبب واحد قوي ليختاروك إنت', keep: 0.5, why: 'الإصلاح الصح: السعر المخفي بيقتل الثقة (شو عم يخبوا؟)، والعرض بلا تمييز بيخلي القرار يتأجل. وضوح + سبب = قرار.' },
        { text: 'زيد عدد المنشورات عالسوشال', keep: 0.15, why: 'مزيد من الناس رح يوصلوا لنفس الصفحة اللي ما بتقنع. كبّرت الطابور على باب مسكّر.' },
      ],
    },
    en: {
      name: 'The offer',
      symptom: 'The ones who stayed read the whole page... and left without a single question. The price hides behind "DM us", and the offer never says why you over anyone else.',
      fixes: [
        { text: 'Prettier photos and a fancier video', keep: 0.2, why: 'The page was already good enough that they read all of it. The problem is not visual: they did not learn why to pick you or what it costs. Looks answer neither question.' },
        { text: 'A clear price + one strong reason to pick you', keep: 0.5, why: 'The right fix: a hidden price kills trust (what are they hiding?), and an undifferentiated offer postpones the decision. Clarity + a reason = a decision.' },
        { text: 'Post more on social media', keep: 0.15, why: 'More people will reach the same unconvincing page. You lengthened the queue at a closed door.' },
      ],
    },
  },
  {
    id: 'reply',
    ar: {
      name: 'الرد',
      symptom: 'اللي اقتنعوا بعتوا رسائل. الرد بيجي بعد ست ساعات، وبنص الحالات «حياك خاص» بلا جواب عالسؤال.',
      fixes: [
        { text: 'خصم إضافي عشان يستنوا الرد', keep: 0.25, why: 'الخصم ما بيحل البطء، بيعوّض عنه بخسارة من هامشك. والزبون اللي سأل وما انجاوب راح لمنافس جاوبه، مش لخصمك.' },
        { text: 'قوالب رد جاهزة للأسئلة المتكررة + وقت رد أقصاه ساعة بأوقات الدوام', keep: 0.6, why: 'الإصلاح الصح: نص البيع عنا بيصير بالماسجات، والحرارة بتبرد بسرعة. أغلب الأسئلة متكررة أصلاً، فالقوالب بتخلي الرد سريع وكامل مش سريع وناقص.' },
        { text: 'حوّل كل الأسئلة على رقم واتساب صاحب المشروع', keep: 0.32, why: 'صاحب المشروع مشغول، فبيصير هو عنق الزجاجة الجديد. مركزت التسريب بدل ما سكّرته.' },
      ],
    },
    en: {
      name: 'The reply',
      symptom: 'The convinced ones sent messages. Replies arrive six hours later, and half of them say "DM us privately" without answering the question.',
      fixes: [
        { text: 'An extra discount so they wait for the reply', keep: 0.25, why: 'A discount does not fix slowness. It compensates for it out of your margin. And the customer who asked and got no answer went to a competitor who answered, not to your discount.' },
        { text: 'Ready templates for the repeated questions + a one-hour reply ceiling in working hours', keep: 0.6, why: 'The right fix: half of local sales happen in DMs, and heat cools fast. Most questions repeat anyway, so templates make replies fast and complete instead of fast and hollow.' },
        { text: "Forward all questions to the owner's WhatsApp", keep: 0.32, why: 'The owner is busy, so they become the new bottleneck. You centralised the leak instead of closing it.' },
      ],
    },
  },
  {
    id: 'checkout',
    ar: {
      name: 'الإتمام',
      symptom: 'وصلوا للدفع جاهزين. بس الدفع تحويل بنكي بس، والتوصيل «منرتب معك بالخاص». قسم بيقول «بكرا بكمّل» وبكرا ما بييجي.',
      fixes: [
        { text: 'ابعتلهم تذكير بعد يومين', keep: 0.35, why: 'التذكير بيرجّع قسم صغير، بس سبب التأجيل الأصلي (الدفع المعقد) لسا مكانه. رح يتذكروا... نفس العقبة.' },
        { text: 'دفع عند الاستلام + خيارات دفع متعددة + تأكيد فوري', keep: 0.65, why: 'الإصلاح الصح: بسوقنا، الدفع عند الاستلام مش رفاهية، هو شرط ثقة. كل خطوة إضافية بين «بدي أشتري» و«اشتريت» بتسرّب ناس.' },
        { text: 'خفض السعر ١٥٪', keep: 0.4, why: 'هدول أصلاً قابلين بالسعر، وصلوا للدفع! نزّلت هامشك لناس كانت رح تدفع، والعقبة الحقيقية (طريقة الدفع) ضلت.' },
      ],
    },
    en: {
      name: 'The checkout',
      symptom: 'They reached payment ready to buy. But payment is bank transfer only, and delivery is "we arrange in DMs". Some say "I will finish tomorrow" and tomorrow never comes.',
      fixes: [
        { text: 'Send a reminder after two days', keep: 0.35, why: 'The reminder brings a small share back, but the original cause of postponing (the complicated payment) is still there. They will remember... the same obstacle.' },
        { text: 'Cash on delivery + multiple payment options + instant confirmation', keep: 0.65, why: 'The right fix: in our market, cash on delivery is not a luxury, it is a trust requirement. Every extra step between "I want to buy" and "I bought" leaks people.' },
        { text: 'Cut the price 15%', keep: 0.4, why: 'These people already accepted the price. They reached checkout! You cut your margin for people who were going to pay, and the real obstacle (the payment method) stayed.' },
      ],
    },
  },
];

// أحكام النهاية حسب عدد اللي أتموا الشراء من ١٠٠٠
export const VERDICTS = [
  {
    min: 0,
    ar: { stamp: 'الرحلة غرقانة', text: 'الألف كبسة ضاعوا بالطريق، وهاد بيصير لما الإصلاحات تروح عالأعراض بدل الأسباب. لاحظ إنه ولا إصلاح غلط كان «غبي»: كلها أشياء بتنعمل فعلاً كل يوم.' },
    en: { stamp: 'The journey is sinking', text: 'The thousand clicks got lost on the way, and that happens when fixes target symptoms instead of causes. Notice that no wrong fix was "stupid": they are all things actually done every day.' },
  },
  {
    min: 15,
    ar: { stamp: 'سكّرت كم ثقب', text: 'وصّلت ناس للآخر، وخسرت ناس بمحطات كان إلها إصلاح أدق. ارجع شوف وين اخترت الحل المريح بدل الحل الصح، هاد الفرق بين الترقيع والهندسة.' },
    en: { stamp: 'You closed some holes', text: 'You got people to the end and lost people at stations that had a sharper fix. Look back at where you picked the comfortable fix over the right one. That is the difference between patching and engineering.' },
  },
  {
    min: 80,
    ar: { stamp: 'مهندس رحلات', text: 'شخّصت كل محطة صح: طابقت الوعد، وضّحت العرض، سرّعت الرد، وسهّلت الدفع. هيك بتشتغل الرحلة لما حدا يهندسها بدل ما يرقّعها.' },
    en: { stamp: 'A journey engineer', text: 'You diagnosed every station right: matched the promise, clarified the offer, sped up the reply, eased the payment. This is how the journey works when someone engineers it instead of patching it.' },
  },
];
