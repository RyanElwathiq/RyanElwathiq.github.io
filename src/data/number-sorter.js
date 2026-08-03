// ═══════════════════════════════════════════════════════════════
//  بيانات «فارز الأرقام»
//
//  الفكرة: نتائج حملة وهمية بتطلعلك بطاقة بطاقة، وبتفرز كل وحدة
//  بمكانها الصح: Lead (اهتمام) · Sale (بيع فعلي) · ROAS (عائد
//  الإنفاق) · زينة (رقم بيبين حلو وما بياكل خبز). بعد كل فرزة
//  بتقرأ ليش، وبالآخر بتعرف إذا بتقرأ الأرقام ولا بتتفرج عليها.
//
//  ⚠️ في بطاقتين مقصودتين تكسر التوقع: ROAS خاسر (لسا ROAS،
//     بس أقل من ١ يعني كل دينار بيرجع أقل من دينار) وLead بارد.
//     الفرز الصح مش مدح الرقم، هو معرفة نوعه.
//
//  ✏️ bucket: lead | sale | roas | vanity
// ═══════════════════════════════════════════════════════════════

export const BUCKETS = [
  { id: 'lead', ar: 'Lead · اهتمام', en: 'Lead · interest' },
  { id: 'sale', ar: 'Sale · بيع', en: 'Sale · purchase' },
  { id: 'roas', ar: 'ROAS · عائد', en: 'ROAS · return' },
  { id: 'vanity', ar: 'زينة', en: 'Vanity' },
];

export const CARDS = [
  {
    id: 'form',
    bucket: 'lead',
    ar: {
      text: '٣٢ شخص عبوا نموذج الطلب وتركوا أرقامهم',
      why: 'هاد Lead: حدا مد إيده وقال «مهتم». مش بيع بعد، بس أغلى إشارة قبل البيع. السؤال الجاي: مين بيتصل فيهم وبعد قديش؟',
    },
    en: {
      text: '32 people filled the order form and left their numbers',
      why: 'A lead: someone raised their hand and said "interested". Not a sale yet, but the most valuable pre-sale signal. Next question: who calls them, and how soon?',
    },
  },
  {
    id: 'cod',
    bucket: 'sale',
    ar: {
      text: 'زبونة أكدت طلبها ودفعت عند الاستلام',
      why: 'هاد Sale: فلوس دخلت فعلاً. وهاد الرقم الوحيد اللي بيدفع الرواتب، وكل الأرقام الثانية موجودة عشان توصله.',
    },
    en: {
      text: 'A customer confirmed her order and paid on delivery',
      why: 'A sale: money actually came in. The only number that pays salaries. Every other number exists to lead here.',
    },
  },
  {
    id: 'roas3',
    bucket: 'roas',
    ar: {
      text: 'الحملة صرفت ٤٠٠ دينار وجابت مبيعات بـ١٬٢٠٠',
      why: 'هاد ROAS: عائد الإنفاق الإعلاني. ١٢٠٠ على ٤٠٠ يعني ×٣، كل دينار رجع ثلاثة. الرقم اللي بيقرر تكمل الحملة ولا توقفها.',
    },
    en: {
      text: 'The campaign spent 400 JD and brought 1,200 in sales',
      why: 'ROAS: return on ad spend. 1,200 over 400 is 3x, every dinar returned three. The number that decides whether the campaign continues or stops.',
    },
  },
  {
    id: 'likes',
    bucket: 'vanity',
    ar: {
      text: '١٬٥٠٠ لايك على بوست الإعلان',
      why: 'زينة. اللايك لطيف وبيحسسك إنك شغال، بس محدا دفع فيه فاتورة. لو اللايكات بتبيع، كان أصحاب صفحات الميمز أغنى تجار البلد.',
    },
    en: {
      text: '1,500 likes on the ad post',
      why: 'Vanity. Likes are nice and make you feel busy, but nobody ever paid a bill with one. If likes sold, meme pages would be the richest merchants in town.',
    },
  },
  {
    id: 'reach',
    bucket: 'vanity',
    ar: {
      text: 'الإعلان وصل لـ٨٠ ألف شخص',
      why: 'زينة برضه. الوصول بيقلك كم واحد «مرق من قدامه» الإعلان، مش كم واحد اهتم. ٨٠ ألف مرقوا سريع بيساووا أقل من ٣٢ تركوا أرقامهم.',
    },
    en: {
      text: 'The ad reached 80,000 people',
      why: 'Also vanity. Reach tells you how many people the ad "passed by", not how many cared. 80,000 quick scrolls are worth less than 32 people who left their numbers.',
    },
  },
  {
    id: 'dms',
    bucket: 'lead',
    ar: {
      text: '٤٥ رسالة عالصفحة بتسأل عن السعر',
      why: 'هدول Leads سخنين: سؤال السعر معناه القرار قريب. وهون بالضبط بتربح أو بتخسر حسب سرعة الرد وجودته.',
    },
    en: {
      text: '45 messages on the page asking about the price',
      why: 'Hot leads: a price question means the decision is near. This is exactly where you win or lose based on reply speed and quality.',
    },
  },
  {
    id: 'roasbad',
    bucket: 'roas',
    ar: {
      text: 'كل دينار انصرف عالإعلان رجّع ٦٠ قرش مبيعات',
      why: 'هاد كمان ROAS، بس خاسر: أقل من ١ يعني الحملة بتاكل مصاري. معرفة نوع الرقم غير الحكم عليه، وROAS الخاسر أصدق صديق: بيقلك وقّف بدري.',
    },
    en: {
      text: 'Every dinar spent on the ad returned 0.6 in sales',
      why: 'Also ROAS, but a losing one: below 1 means the campaign eats money. Knowing the type is different from judging it, and a losing ROAS is your honest friend: it says stop early.',
    },
  },
  {
    id: 'comments',
    bucket: 'vanity',
    ar: {
      text: '١٢٠ تعليق عالبوست، ٩٠ منهم إيموجي وناس بتنادي أصحابها',
      why: 'زينة، مع استثناء صغير: التعليق اللي بيسأل سؤال حقيقي هو Lead متخفي. الـ٩٠ إيموجي لأ، بس الـ٥ اللي سألوا «كيف بطلب؟» ذهب.',
    },
    en: {
      text: '120 comments, 90 of them emojis and people tagging friends',
      why: 'Vanity, with one small exception: a comment asking a real question is a lead in disguise. The 90 emojis are not, but the 5 asking "how do I order?" are gold.',
    },
  },
  {
    id: 'repeat',
    bucket: 'sale',
    ar: {
      text: 'زبون قديم رجع اشترى للمرة الثالثة هالشهر',
      why: 'Sale، وأحلى نوع منه: البيع المتكرر بلا تكلفة إعلان جديدة. الزبون الراجع هو أرخص مبيعة وأقوى دليل إنه المنتج نفسه بيستاهل.',
    },
    en: {
      text: 'An old customer came back and bought for the third time this month',
      why: 'A sale, and the sweetest kind: repeat purchase with zero new ad cost. The returning customer is the cheapest sale and the strongest proof the product itself delivers.',
    },
  },
];

// أحكام حسب عدد الفرزات الصح من ٩
export const VERDICTS = [
  {
    min: 0,
    ar: { stamp: 'محاسب لايكات', text: 'الأرقام الحلوة خدعتك، وإنت مش لحالك: أغلب التقارير اللي بتنبعت لأصحاب المشاريع مبنية عالوصول واللايكات بالضبط عشان هيك. ارجع العب وإنت بتسأل عن كل رقم: هل حدا دفع؟' },
    en: { stamp: 'A likes accountant', text: 'The pretty numbers fooled you, and you are not alone: most reports sent to business owners are built on reach and likes for exactly this reason. Replay while asking about every number: did anyone pay?' },
  },
  {
    min: 5,
    ar: { stamp: 'بتفرز صح، غالباً', text: 'بتميز الأنواع الأساسية وبتغلط بالحدود: الـROAS الخاسر، التعليق اللي هو Lead متخفي. هاي الحدود بالضبط اللي بتفرق بين قراءة تقرير وفهمه.' },
    en: { stamp: 'You sort right, mostly', text: 'You tell the main types apart and slip at the edges: the losing ROAS, the comment that is a disguised lead. Those edges are exactly what separates reading a report from understanding it.' },
  },
  {
    min: 8,
    ar: { stamp: 'قارئ أرقام محترف', text: 'ما بتنخدع بالزينة وبتعرف كل رقم شو بيحكي. هاي المهارة اللي بتخليك تسأل شركة التسويق السؤال الصح: مش «كم لايك جبتوا؟»، «كم Lead، وشو صار فيهم؟»' },
    en: { stamp: 'A professional number reader', text: 'Vanity does not fool you and you know what every number says. This is the skill that lets you ask a marketing company the right question: not "how many likes?", but "how many leads, and what happened to them?"' },
  },
];
