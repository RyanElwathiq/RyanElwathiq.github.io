// ═══════════════════════════════════════════════════════════════
//  بيانات «مختبر الهوك»
//
//  اللعبة بجزئين:
//  ١) التسخين: ثلاث مواجهات، بكل وحدة بدايتين لنفس الريل —
//     وحدة كليشيه مستهلك ووحدة فيها مشهد حقيقي. الزائر بيختار
//     وبيقرا ليش وحدة بتوقف الإصبع والثانية بتمرق.
//  ٢) المختبر: الزائر بيكتب شو بيبيع ونقطة قوته، و«نبض» بيرجّع
//     ثلاث بدايات بثلاث زوايا، كل وحدة معها شو يتصوّر بأول لقطة.
//
//  ⚠️ الزوايا الثلاث (ANGLES) مكرّرة بالبرومبت بالووركر كمان.
//     لو غيّرت وحدة هون، غيّرها بـ handleHooks وإلا الشرح
//     اللي بيقراه الزائر بيصير غير اللي بيوصله من الموديل.
//
//  ✏️ بدك تضيف مواجهة؟ ضيف كائن كامل بـ ROUNDS، وضيف سطر
//     بـ TEXTS[lang].steps (عدّاد «سؤال كذا من كذا»).
// ═══════════════════════════════════════════════════════════════

// ─── الجزء الأول: التسخين ───
//  good = البداية اللي بتوقف · bad = الكليشيه المستهلك
export const ROUNDS = [
  {
    id: 'stain',
    ar: {
      q: 'ريل لمنظف بقع. أي بداية بتوقف إصبعك بأول ثانيتين؟',
      good: '«البقعة هاي عمرها ثلاث سنين، وهاد آخر يوم إلها.»',
      bad: '«توقف الآن! لن تصدق شو رح يصير لهالبقعة.»',
      why: 'الأولى بتحط قدامك مشهد إله عمر وإله نهاية، فبتحس فيه بثانية وبتستنى تشوف. الثانية بتوعد بمفاجأة بلا ما تعطي ولا معلومة، والمشاهد سمع «لن تصدق» ألف مرة قبل هيك وإصبعه بيتحرك قبل ما يخلّص السطر.',
    },
    en: {
      q: 'A reel for a stain remover. Which opening stops your thumb in the first two seconds?',
      good: '"This stain is three years old, and today is its last day."',
      bad: '"Stop scrolling! You will not believe what happens to this stain."',
      why: 'The first puts a scene in front of you that has an age and an ending, so you feel it instantly and wait to see. The second promises a surprise without handing over a single fact, and everyone has heard "you will not believe" a thousand times already.',
    },
  },
  {
    id: 'clothes',
    ar: {
      q: 'ريل لمحل أواعي. أي بداية بتشتغل أكثر؟',
      good: '«نفس الفستان على ثلاث بنات بأطوال مختلفة. شوفي التالتة.»',
      bad: '«أجمل التصاميم وأحدث الموديلات، تسوقوا الآن!»',
      why: 'الأولى بتفتح سؤال بالراس («شو صار بالتالتة؟») والعين بتضل واقفة لحد ما تعرف الجواب. الثانية بتوصف حالها بدل ما توري، وهاي جملة بتنقال بأي محل أواعي بالأردن فما بتميّز حدا.',
    },
    en: {
      q: 'A reel for a clothing shop. Which opening works harder?',
      good: '"The same dress on three women of different heights. Watch the third one."',
      bad: '"The finest designs and the newest styles, shop now!"',
      why: 'The first opens a question in your head ("what happened with the third?") and the eye stays until it gets an answer. The second describes itself instead of showing, and it is a line any clothing shop could say, so it separates nobody from anybody.',
    },
  },
  {
    id: 'repair',
    ar: {
      q: 'ريل لورشة تصليح موبايلات. مين فيهم بتوقف عندها؟',
      good: '«سبعة من كل عشرة موبايلات بتيجينا مش خربانة.»',
      bad: '«خدمة سريعة وجودة عالية، زورونا اليوم!»',
      why: 'الأولى رقم من شغلهم هم، وبتكسر التوقع: إنت جاي تسمع عن تصليح وطلع الكلام إنه أغلبها ما بدها تصليح. التناقض بيوقف العين لأنه بده تفسير. الثانية وعد عام بيقدر أي حدا يقوله، وعشان هيك محدا بيصدقه.',
    },
    en: {
      q: 'A reel for a phone repair shop. Which one holds you?',
      good: '"Seven out of ten phones that reach us are not actually broken."',
      bad: '"Fast service and high quality, visit us today!"',
      why: 'The first is a number from their own bench, and it breaks the expectation: you came to hear about repairs and were told most of them need none. A contradiction holds the eye because it demands an explanation. The second is a generic promise anyone could make, which is exactly why nobody believes it.',
    },
  },
];

// ─── الزوايا الثلاث اللي بيرجّعها المختبر ───
//  ⚠️ نفس الترتيب ونفس المعنى موجودين ببرومبت handleHooks بالووركر
export const ANGLES = [
  {
    ar: { name: 'سؤال يوجع', hint: 'سؤال بيلمس مشكلة بيعيشها زبونك فعلاً، مش سؤال عام بينطبق على الكل.' },
    en: { name: 'A question that stings', hint: 'A question that touches a problem your customer actually lives, not a generic one.' },
  },
  {
    ar: { name: 'مشهد فضولي', hint: 'لقطة بتفتح سؤال، والعين بتضل واقفة لحد ما تشوف الجواب.' },
    en: { name: 'A curious scene', hint: 'A frame that opens a question, and the eye stays until it sees the answer.' },
  },
  {
    ar: { name: 'رقم أو تناقض', hint: 'رقم من شغلك إنت، أو جملة بتكسر اللي المشاهد متوقعه.' },
    en: { name: 'A number or a contradiction', hint: 'A number from your own work, or a line that breaks what the viewer expects.' },
  },
];

// ─── نصوص واجهة اللعبة ───
export const TEXTS = {
  ar: {
    steps: ['مواجهة ١ من ٣', 'مواجهة ٢ من ٣', 'مواجهة ٣ من ٣'],
    right: 'صح، هاي اللي بتوقف الإصبع.',
    wrong: 'الثانية أقوى، وهاد السبب:',
    next: 'المواجهة الجاي',
    toLab: 'افتح المختبر',
    anglesTitle: 'الثلاث زوايا اللي بتشتغل بأول ثانيتين',
    nums: ['١', '٢', '٣'],
  },
  en: {
    steps: ['Round 1 of 3', 'Round 2 of 3', 'Round 3 of 3'],
    right: 'Right, that is the one that stops the thumb.',
    wrong: 'The other one is stronger, and here is why:',
    next: 'Next round',
    toLab: 'Open the lab',
    anglesTitle: 'The three angles that work in the first two seconds',
    nums: ['1', '2', '3'],
  },
};
