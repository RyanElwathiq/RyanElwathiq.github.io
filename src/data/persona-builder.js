// ═══════════════════════════════════════════════════════════════
//  بيانات «ارسم عميلك»
//
//  الفكرة بجزئين:
//  ١) الفخ: بتعرّف جمهورك بالطريقة المعتادة (عمر، جنس، مكان) —
//     واللعبة بتوريك إنه هالوصف بينطبق على مئات الآلاف وما بيقول
//     عنهم ولا معلومة بتنفع بالبيع.
//  ٢) البناء: خمس أسئلة عن مشكلته وخوفه واعتراضه، وبطاقة
//     البيرسونا بتترسم قدامك جواب جواب — وبالآخر بتنقرا كوصف
//     شخص حقيقي بتعرف تحكي معه.
//
//  ⚠️ frag = القطعة اللي بتنضاف لجملة البيرسونا. الجمل مصممة
//     تتركب ورا بعض بسلاسة: «صاحب مشروع + [مشكلة]. جرب + [تجربة].
//     أكثر شي بيخوفه + [خوف]. وقبل ما يدفع بيسأل حاله + [اعتراض].
//     والجملة اللي بتوقفه: + [جملة]».
//
//  ✏️ بدك تضيف خيار؟ text (اللي بينعرض) + frag (اللي بيدخل
//     بالبطاقة). خلي الـ frag متوافق نحوياً مع القالب.
// ═══════════════════════════════════════════════════════════════

// ─── الجزء الأول: الاستهداف المعتاد (الفخ) ───
export const DEMO = {
  ar: {
    intro: 'خلينا نبلش بالطريقة اللي الكل بيعرّف فيها جمهوره:',
    age: { label: 'العمر', options: ['١٨ - ٢٥', '٢٥ - ٣٥', '٣٥ - ٤٥', '٤٥+'] },
    gender: { label: 'الجنس', options: ['الكل', 'رجال', 'نساء'] },
    place: { label: 'المكان', options: ['عمّان', 'الزرقاء', 'إربد', 'كل الأردن'] },
    trap: 'تمام، هاد وصف بينطبق على مئات آلاف الأشخاص. سؤال واحد: شو بتعرف عن أي واحد منهم بيساعدك تبيعله؟ ...ولا معلومة. العمر والمكان بيحددوا مين بيشوف إعلانك، بس ما بيكتبوا ولا كلمة فيه.',
  },
  en: {
    intro: 'Let us start the way everyone defines their audience:',
    age: { label: 'Age', options: ['18 - 25', '25 - 35', '35 - 45', '45+'] },
    gender: { label: 'Gender', options: ['Everyone', 'Men', 'Women'] },
    place: { label: 'Location', options: ['Amman', 'Zarqa', 'Irbid', 'All of Jordan'] },
    trap: 'Done. This description fits hundreds of thousands of people. One question: what do you know about any of them that helps you sell to them? ...Nothing. Age and location decide who sees your ad, but they write not a single word of it.',
  },
};

// ─── الجزء الثاني: أسئلة البيرسونا ───
export const QUESTIONS = [
  {
    id: 'problem',
    ar: {
      q: 'شو المشكلة اللي بتخلي عميلك يفكر فيك أصلاً؟',
      options: [
        { text: 'بيدفع على تسويق وإعلانات وما بيشوف نتيجة', frag: 'بيدفع على تسويق من زمان وما عم يشوف نتيجة بتذكر' },
        { text: 'بده يبلش مشروع وما بيعرف من وين', frag: 'بده يبلش مشروعه وما بيعرف من وين يمسك الخيط' },
        { text: 'شغله منيح بس محدا بيعرف عنه', frag: 'شغله منيح بس حاسس إنه مخفي عن السوق ومحدا بيعرفه' },
        { text: 'بيبيع، بس أقل بكثير من اللي بيستاهله', frag: 'بيبيع، بس عارف إنه المفروض يبيع أضعاف هيك' },
      ],
    },
    en: {
      q: 'What problem makes your customer think of you in the first place?',
      options: [
        { text: 'Pays for marketing and ads and sees no result', frag: 'has been paying for marketing for a while without a result worth mentioning' },
        { text: 'Wants to start a project and has no idea where from', frag: 'wants to start a project and cannot find the thread to pull' },
        { text: 'Great work, but nobody knows about them', frag: 'does great work but feels invisible to the market' },
        { text: 'Sells, but far less than they deserve', frag: 'sells, but knows they should be selling multiples of this' },
      ],
    },
  },
  {
    id: 'tried',
    ar: {
      q: 'شو جرب قبل ما يوصلك؟',
      options: [
        { text: 'شركة تسويق باعته باكج وما تغير إشي', frag: 'جرب شركة تسويق باعته باكج شهري وما تغير إشي' },
        { text: 'اشتغل بإيده: بوستات وتصاميم من تطبيقات', frag: 'جرب يشتغل بإيده ببوستات وتصاميم سريعة' },
        { text: 'بوّست (Boost) عشوائي من التلفون', frag: 'جرب يعمل Boost من تلفونه على أمل تفرق' },
        { text: 'ولا إشي، لسا خايف يجرب', frag: 'لسا ما جرب إشي جدي لأنه خايف يحرق مصاري عالفاضي' },
      ],
    },
    en: {
      q: 'What did they try before reaching you?',
      options: [
        { text: 'A marketing company sold them a package, nothing changed', frag: 'tried a marketing company that sold them a monthly package, and nothing changed' },
        { text: 'DIY: posts and app-made designs', frag: 'tried doing it themselves with quick posts and app-made designs' },
        { text: 'Random boosts from the phone', frag: 'tried boosting from their phone hoping it would matter' },
        { text: 'Nothing yet, afraid to try', frag: 'has not tried anything serious yet, afraid of burning money for nothing' },
      ],
    },
  },
  {
    id: 'fear',
    ar: {
      q: 'شو أكثر إشي بيخوفه؟',
      options: [
        { text: 'يدفع كمان مرة ويطلع نفس القصة', frag: 'يدفع لحدا جديد ويطلع نفس قصة اللي قبله' },
        { text: 'ينضحك عليه لأنه مش فاهم بالتسويق', frag: 'ينضحك عليه لأنه مش من عالم التسويق وما بيعرف يميز' },
        { text: 'يضيع وقته بشغل بيلحق ولا بيخلص', frag: 'يعلق بمشروع تسويق طويل بياخد وقته وما بيوصل لإشي' },
        { text: 'ينجح الإعلان وما يلحق عالطلبات', frag: 'حتى النجاح بيخوفه: شو لو أجت طلبات أكثر من طاقته؟' },
      ],
    },
    en: {
      q: 'What scares them the most?',
      options: [
        { text: 'Paying again and getting the same story', frag: 'paying someone new and getting the same story as the last one' },
        { text: 'Being fooled because they do not know marketing', frag: 'being fooled because marketing is not their world and they cannot tell good from bad' },
        { text: 'Wasting time on work that never ends', frag: 'getting stuck in a long marketing project that eats time and arrives nowhere' },
        { text: 'The ad working and orders overwhelming them', frag: 'even success scares them: what if more orders come than they can handle?' },
      ],
    },
  },
  {
    id: 'objection',
    ar: {
      q: 'شو السؤال اللي براسه قبل ما يدفعلك؟',
      options: [
        { text: '«شو بيضمنلي إنك مش زي غيرك؟»', frag: '«شو بيضمنلي إنك مش زي غيرك؟»' },
        { text: '«ليش أسعارك هيك؟ في أرخص»', frag: '«ليش أدفع هالسعر وفي أرخص؟»' },
        { text: '«هل فعلاً بحتاج كل هاد ولا بوستات وبس؟»', frag: '«هل بحتاج كل هاد فعلاً ولا بوستات وبكفي؟»' },
        { text: '«ليش ما أعملها بحالي ببلاش؟»', frag: '«ليش ما أعملها بحالي ببلاش؟»' },
      ],
    },
    en: {
      q: 'What question sits in their head before paying you?',
      options: [
        { text: '"What guarantees you are not like the others?"', frag: '"what guarantees you are not like the others?"' },
        { text: '"Why these prices? There are cheaper options"', frag: '"why pay this when there are cheaper options?"' },
        { text: '"Do I really need all this, or just posts?"', frag: '"do I really need all this, or are posts enough?"' },
        { text: '"Why not do it myself for free?"', frag: '"why not do it myself for free?"' },
      ],
    },
  },
  {
    id: 'trigger',
    ar: {
      q: 'شو الجملة اللي لو سمعها بيوقف ويقول «هاد فاهمني»؟',
      options: [
        { text: '«المشكلة مش بعدد البوستات»', frag: '«المشكلة مش بعدد البوستات.»' },
        { text: '«ما بضمنلك مبيعات، وهاي أصدق جملة رح تسمعها»', frag: '«ما بضمنلك مبيعات، وهاي أصدق جملة رح تسمعها.»' },
        { text: '«خلينا نعرف ليش ما عم تبيع قبل ما نحكي أسعار»', frag: '«خلينا نعرف ليش ما عم تبيع، قبل ما نحكي أسعار.»' },
        { text: '«شغلك حلو، بس محدا شايفه»', frag: '«شغلك حلو، بس محدا شايفه.»' },
      ],
    },
    en: {
      q: 'What sentence would make them stop and say "this one gets me"?',
      options: [
        { text: '"The problem is not the number of posts"', frag: '"the problem is not the number of posts."' },
        { text: '"I cannot guarantee sales, and that is the most honest thing you will hear"', frag: '"I cannot guarantee sales, and that is the most honest thing you will hear."' },
        { text: '"Let us find out why you are not selling before we talk prices"', frag: '"let us find out why you are not selling, before we talk prices."' },
        { text: '"Your work is good, but nobody sees it"', frag: '"your work is good, but nobody sees it."' },
      ],
    },
  },
];

// ─── قالب تركيب البيرسونا ───
//  {p} مشكلة · {t} تجربة · {f} خوف · {o} اعتراض · {g} الجملة
export const TEMPLATE = {
  ar: 'صاحب مشروع {p}. {t}. أكثر إشي بيخوفه إنه {f}. وقبل ما يدفع لحدا، السؤال اللي براسه: {o}. والجملة اللي بتوقفه بمنتصف السكرول: {g}',
  en: 'A business owner who {p}. They {t}. What scares them most is {f}. Before paying anyone, the question in their head is: {o}. And the line that stops their scroll: {g}',
};

export const TEXTS = {
  ar: {
    demoCard: 'الاستهداف المعتاد',
    personaCard: 'البيرسونا اللي رسمتها',
    verdictTitle: 'شوف الفرق',
    verdict: 'الوصف الأول بيقلك مين ممكن يشوف إعلانك. الوصف الثاني بيكتبلك الإعلان نفسه: المشكلة اللي بتفتح فيها، الخوف اللي بتطمنه، الاعتراض اللي بتجاوب عليه قبل ما ينسأل، والجملة اللي بتوقف السكرول. هاد الفرق بين تحكي عن شريحة وتحكي مع شخص.',
    note: 'هاي بيرسونا من خيارات جاهزة للتوضيح. البيرسونا الحقيقية لمشروعك بتنبني من محادثات زباينك الفعليين، ومن أسئلتهم بالماسجات، ومن سبب آخر ثلاث مبيعات صارت.',
  },
  en: {
    demoCard: 'The usual targeting',
    personaCard: 'The persona you drew',
    verdictTitle: 'See the difference',
    verdict: 'The first description tells you who might see your ad. The second one writes the ad itself: the problem you open with, the fear you calm, the objection you answer before it is asked, and the line that stops the scroll. That is the difference between talking about a segment and talking with a person.',
    note: 'This persona is built from ready-made options for illustration. Your real persona is built from your actual customer conversations, their DM questions, and the reason behind your last three sales.',
  },
};
