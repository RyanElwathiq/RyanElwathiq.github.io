// ═══════════════════════════════════════════════════════════════
//  بيانات «معادلة البيع»
//
//  الفكرة: الإعلان مقفول على «ممتاز» عن قصد — ١٠٠٠ كبسة ثابتة.
//  الزائر بيحرّك خمس عوامل (العرض، السعر، الثقة، الصفحة، الرد)
//  وبيشوف القمع بينهار أو بيفتح. الرسالة: الإعلان بيجيب الزيارة،
//  والبيع بيصير (أو بيموت) بالباقي.
//
//  ⚠️ الأرقام توضيحية لشكل العلاقة (ضرب مش جمع: عامل واحد ميت
//     بيقتل الكل) — مش توقع لأي مشروع، والواجهة بتقول هاد صراحةً.
//
//  ✏️ بدك تعدّل عامل أو نص؟ هون. المعادلة نفسها بالمكوّن
//     (SalesEquationSection.astro — دالة model).
// ═══════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────
//  العوامل الخمسة — الترتيب هو ترتيب العرض
//  start = وضعية البداية (وضع «شائع» مقصود مش ٥٠/٥٠ محايد)
// ─────────────────────────────────────────────
export const FACTORS = [
  {
    id: 'offer',
    start: 35,
    ar: { name: 'قوة العرض', q: 'ليش يشتروا منك إنت؟' },
    en: { name: 'Offer strength', q: 'Why buy from you specifically?' },
  },
  {
    id: 'price',
    start: 45,
    ar: { name: 'وضوح السعر', q: 'واضح ومنطقي لجمهورك؟' },
    en: { name: 'Price clarity', q: 'Clear and sensible for your audience?' },
  },
  {
    id: 'trust',
    start: 40,
    ar: { name: 'الثقة', q: 'تقييمات، حضور، ناس بتحكي عنك' },
    en: { name: 'Trust', q: 'Reviews, presence, people vouching' },
  },
  {
    id: 'page',
    start: 30,
    ar: { name: 'الصفحة', q: 'وين بتهبط الكبسة؟' },
    en: { name: 'The page', q: 'Where does the click land?' },
  },
  {
    id: 'reply',
    start: 25,
    ar: { name: 'سرعة الرد', q: 'قديش بياخد الرد عالرسالة؟' },
    en: { name: 'Reply speed', q: 'How long until a message gets answered?' },
  },
];

// ─────────────────────────────────────────────
//  وضعيات جاهزة
// ─────────────────────────────────────────────
export const SCENARIOS = [
  {
    id: 'common',
    values: { offer: 35, price: 45, trust: 40, page: 30, reply: 25 },
    ar: { label: 'الوضع اللي منشوفه كل يوم' },
    en: { label: 'The everyday situation' },
  },
  {
    id: 'fixed',
    // ⚠️ معايرة مقصودة: هاي القيم لازم توصل ختم «منظومة بتبيع»
    //    (فوق ٤٠ بيع) — هي لحظة المكافأة بالقصة. لو عدّلت المعادلة
    //    بالمكوّن، شغّل sqcheck.mjs يتأكد إنها لسا بتوصل.
    values: { offer: 90, price: 90, trust: 90, page: 90, reply: 95 },
    ar: { label: 'بعد الشغل الصح' },
    en: { label: 'After the real work' },
  },
];

// ─────────────────────────────────────────────
//  مراحل القمع — الأسماء بس، الحساب بالمكوّن
// ─────────────────────────────────────────────
export const STAGES = [
  { id: 'clicks', ar: 'كبسوا عالإعلان', en: 'Clicked the ad' },
  { id: 'stayed', ar: 'ضلّوا بالصفحة', en: 'Stayed on the page' },
  { id: 'asked', ar: 'استفسروا', en: 'Inquired' },
  { id: 'bought', ar: 'اشتروا', en: 'Bought' },
];

// ─────────────────────────────────────────────
//  أحكام حسب عدد المبيعات (من ١٠٠٠ كبسة)
//  ⚠️ النبرة زي باقي الموقع: صريحة بلا شماتة
// ─────────────────────────────────────────────
export const BANDS = [
  {
    max: 3,
    ar: {
      stamp: 'الإعلان بريء',
      text: 'ألف كبسة من إعلان ممتاز، وبالكاد بيع. المشكلة مش بالإعلان ولا بعدد البوستات: المعادلة مليانة ثقوب، وكل كبسة بتدفع حقها بتسرّب منها.',
    },
    en: {
      stamp: 'The ad is innocent',
      text: 'A thousand clicks from an excellent ad, and barely a sale. The problem is not the ad or the posting count: the equation is full of holes, and every click you paid for leaks through them.',
    },
  },
  {
    max: 15,
    ar: {
      stamp: 'في نبض، بس في نزيف',
      text: 'في مبيعات، بس شوف قديش ضاع بالطريق. العوامل الواطية فوق هي بالضبط وين الميزانية بتنحرق. اشتغل عليها قبل ما تزيد ميزانية الإعلان.',
    },
    en: {
      stamp: 'A pulse, but bleeding',
      text: 'There are sales, but look how much was lost on the way. The low factors above are exactly where the budget burns. Fix them before you raise the ad spend.',
    },
  },
  {
    max: 40,
    ar: {
      stamp: 'المعادلة عم تشتغل',
      text: 'هيك بتبين المنظومة لما أغلب القطع بمكانها. الفرق بينك وبين النتيجة الفوق مش إعلان أقوى، هو العوامل اللي لسا مش عالمستوى.',
    },
    en: {
      stamp: 'The equation is working',
      text: 'This is what the system looks like when most pieces are in place. The gap between you and the next level is not a stronger ad, it is the factors still below par.',
    },
  },
  {
    max: Infinity,
    ar: {
      stamp: 'منظومة بتبيع',
      text: 'نفس الإعلان بالضبط، نفس الألف كبسة. الفرق كله صار برا الإعلان: عرض بيقنع، سعر واضح، ثقة مبنية، صفحة بتبيع، ورد سريع. هاي هي المعادلة.',
    },
    en: {
      stamp: 'A system that sells',
      text: 'The exact same ad, the same thousand clicks. The whole difference happened outside the ad: a convincing offer, a clear price, built trust, a selling page, and fast replies. That is the equation.',
    },
  },
];

// أضعف حلقة — جملة موجهة لكل عامل لما يكون هو الأوطى
export const BOTTLENECK = {
  offer: {
    ar: 'أضعف حلقة عندك: العرض. الناس شافت ووصلت، بس ما لقت سبب تختارك إنت.',
    en: 'Your weakest link: the offer. People saw and arrived, but found no reason to pick you.',
  },
  price: {
    ar: 'أضعف حلقة عندك: السعر. مش إنه غالي بالضرورة، إنه مش واضح أو مش مبرر.',
    en: 'Your weakest link: the price. Not necessarily expensive, just unclear or unjustified.',
  },
  trust: {
    ar: 'أضعف حلقة عندك: الثقة. الزائر اقتنع بالعرض وخاف يدفع لحدا ما بيعرفه.',
    en: 'Your weakest link: trust. The visitor liked the offer and feared paying someone unknown.',
  },
  page: {
    ar: 'أضعف حلقة عندك: الصفحة. الإعلان وعد بإشي، والكبسة هبطت على إشي ثاني.',
    en: 'Your weakest link: the page. The ad promised one thing, the click landed on another.',
  },
  reply: {
    ar: 'أضعف حلقة عندك: الرد. الإعلان جاب الزبون سخن، والصمت برّده.',
    en: 'Your weakest link: the reply. The ad brought the customer in hot, and silence cooled them.',
  },
};
