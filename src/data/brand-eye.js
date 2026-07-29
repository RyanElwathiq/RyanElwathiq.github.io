// ═══════════════════════════════════════════════════════════════
//  بنك أسئلة «عين البراند»
//
//  ⚠️⚠️ اقرأ هذا قبل ما تضيف سؤال ⚠️⚠️
//  اللعبة ما فيها تصاميم مرسومة بالإيد. في **نموذج واحد** بيتغيّر
//  حسب متغيّرات (vars). النسخة المضبوطة بتستخدم القيم الافتراضية،
//  والنسخة الضعيفة بتستخدم قيمة واحدة مكسورة — وهاي القيمة هي
//  المبدأ اللي عم نعلّمه.
//
//  ليش هيك؟ لأنه لو رسمنا نسختين مختلفتين، اللعبة بتصير «شوف
//  الفرق». لما يكون الفرق متغيّر واحد بس، الزائر بيتعلّم قاعدة.
//
//  ✏️ عشان تضيف سؤال جديد: ضيف كائن فيه principle / q / why / bad
//     و bad = المتغيّرات المكسورة بس.
//
//  🤖 هذا الملف مصمّم عشان محرّك ذكاء اصطناعي يقدر يولّد أسئلة
//     بنفس الشكل بالضبط (شوف SCHEMA تحت). ما بيحتاج يعرف CSS —
//     بيحتاج بس يختار مبدأ ويكتب نص ويضبط أرقام.
// ═══════════════════════════════════════════════════════════════

// كم سؤال بكل لعبة (من كل البنك، عشوائي وبدون تكرار)
export const ROUNDS_PER_GAME = 10;
// ثواني لكل جولة — التحدي
export const SECONDS_PER_ROUND = 15;

// ─────────────────────────────────────────────────────────────
//  المتغيّرات المتاحة وقيمها المضبوطة
//  أي متغيّر مش مذكور بـ bad بياخد قيمته من هون
// ─────────────────────────────────────────────────────────────
export const DEFAULTS = {
  bodyOpacity: 0.78, // شفافية نص الوصف
  titleSize: 21, // حجم العنوان (بكسل)
  bodySize: 13, // حجم الوصف
  titleWeight: 700, // ثقل العنوان
  bodyWeight: 400, // ثقل الوصف
  pad: 26, // المسافة الداخلية
  gap: 8, // المسافة بين العناصر
  radius: 12, // زوايا العناصر
  ctaRadius: 12, // زوايا الزر (لازم يساوي radius بالنظام المضبوط)
  eyebrowColor: 'accent', // accent | pink | blue | gold
  bodyColor: 'muted',
  titleColor: 'text',
  ctaColor: 'accent',
  tracking: 0, // تباعد الحروف (em × ١٠٠)
  align: 'start', // start | center
  ctas: 1, // عدد الأزرار
  maxWidth: 34, // أقصى عرض للنص (بالحروف)
  ornament: 0, // زخرفة زايدة (٠ أو ١)
};

// 🤖 عقد البيانات للذكاء الاصطناعي — لا تغيّره بدون ما تحدّث المحرّك
export const SCHEMA = {
  principle: 'string — اسم المبدأ بلغة الصفحة',
  q: 'string — سؤال قصير: أي نسخة أقوى ولماذا يهم',
  why: 'string — شرح من ٢ لـ ٣ جمل، بصوت تسويقي مش أكاديمي',
  bad: 'object — متغيّر أو اثنين بالكثير من DEFAULTS بقيم مكسورة',
};

// ═══════════════════════════════════════════════════════════════
//  البنك — كل عنصر: المبدأ · السؤال · الشرح · الخلل
// ═══════════════════════════════════════════════════════════════
const AR = [
  {
    principle: 'التباين',
    q: 'أي وحدة بتقدر تقراها بسرعة؟',
    why: 'التباين مش ذوق — هو وصول. النص الباهت بيبيّن «راقي» على شاشة المصمّم، وبيختفي على شاشة الزبون بالشمس. أول سؤال بأي هوية: بينقرا ولا لأ؟',
    bad: { bodyOpacity: 0.18 },
  },
  {
    principle: 'التباين',
    q: 'أي وحدة بتشتغل على تلفون بالشارع؟',
    why: 'نص رمادي فاتح على خلفية غامقة بينجح بالمكتب وبيفشل برّا. لو ما بتقدر تقراه وأنت ماشي، ما بينقرا.',
    bad: { bodyColor: 'faint', titleColor: 'faint' },
  },
  {
    principle: 'التسلسل',
    q: 'أي وحدة بتعرف من وين تبلّش تقرا؟',
    why: 'لما كل إشي بنفس الحجم، ما في إشي مهم. التسلسل بيقول للعين: هون ابدأ، وبعدين هون. بدونه الزائر بيقرر يمشي بدل ما يقرر يقرأ.',
    bad: { titleSize: 13, titleWeight: 500 },
  },
  {
    principle: 'التسلسل',
    q: 'أي وحدة العنوان فيها عنوان فعلاً؟',
    why: 'الفرق بين العنوان والوصف لازم يبيّن من بعيد. فرق حجم بسيط ما بيكفي — العين بتحتاج قفزة واضحة عشان تعرف الترتيب.',
    bad: { titleSize: 15 },
  },
  {
    principle: 'الانضباط اللوني',
    q: 'أي وحدة بتبيّن علامة وحدة؟',
    why: 'كل لون بتضيفه بيقسم الانتباه. لون هوية واحد + رماديات = العين بتعرف وين تروح. أربع ألوان = ما في لون بيميّزك.',
    bad: { eyebrowColor: 'pink', bodyColor: 'blue', titleColor: 'gold', ctaColor: 'violet' },
  },
  {
    principle: 'الانضباط اللوني',
    q: 'أي وحدة لونها بيخدم المعنى؟',
    why: 'لون الهوية سلاح — لما تستخدمه على كل إشي بيفقد قوّته. خلّيه على الفعل المطلوب بس، والباقي رمادي.',
    bad: { eyebrowColor: 'accent', titleColor: 'accent', bodyColor: 'accent' },
  },
  {
    principle: 'المساحة',
    q: 'أي وحدة بتحسّها أغلى؟',
    why: 'المساحة الفاضية مش ضياع — هي اللي بتقول «هذا العنصر يستاهل مساحته». التزاحم بيوحي بالرخص حتى لو المحتوى نفسه.',
    bad: { pad: 8, gap: 2 },
  },
  {
    principle: 'المساحة',
    q: 'أي وحدة العناصر فيها بتتنفّس؟',
    why: 'المسافات بين العناصر بتشتغل زي علامات الترقيم. بدونها الجملة كلها بتصير كلمة وحدة طويلة.',
    bad: { gap: 1 },
  },
  {
    principle: 'الاتساق',
    q: 'أي وحدة بتبيّن نظام مش مجموعة قرارات؟',
    why: 'زوايا مختلفة بنفس البطاقة معناها إنه ما في نظام. الاتساق هو الفرق بين هوية وبين تصميم انعمل مرة.',
    bad: { ctaRadius: 999 },
  },
  {
    principle: 'الاتساق',
    q: 'أي وحدة بتحسّها من نفس العائلة؟',
    why: 'قاعدة واحدة للزوايا بكل الموقع = العين بتتعرّف عليك حتى بدون لوجو. اختلاف الزوايا بين عنصر وعنصر بيكسر هالتعرّف.',
    bad: { radius: 0, ctaRadius: 999 },
  },
  {
    principle: 'التركيز',
    q: 'أي وحدة بتعرف شو المطلوب منك؟',
    why: 'ثلاث أزرار = ولا زر. كل تصميم إله فعل واحد أساسي، والباقي بيصير روابط هادية. هاد الفرق بين صفحة بتنشر وصفحة بتبيع.',
    bad: { ctas: 3 },
  },
  {
    principle: 'التركيز',
    q: 'أي وحدة ما بتخلّيك تفكّر؟',
    why: 'كل خيار إضافي بتحطّه بيأخّر القرار. لما يكون في فعل واحد واضح، نسبة التحويل بتطلع — مش لأن التصميم أحلى، لأن ما في تردّد.',
    bad: { ctas: 2 },
  },
  {
    principle: 'المحاذاة',
    q: 'أي وحدة بتحسّها مضبوطة؟',
    why: 'العين بتشوف الخطوط الوهمية. لما بعض العناصر على اليمين وبعضها بالنص، بتحسّ إنه في إشي غلط حتى لو ما عرفت شو.',
    bad: { align: 'center' },
  },
  {
    principle: 'الثقل',
    q: 'أي وحدة الثقيل فيها ثقيل فعلاً؟',
    why: 'لما كل الكلام غامق، ما في كلام غامق. الثقل زي رفع الصوت — بينفع لكلمة، وبيصير صراخ لو استخدمته للجملة كلها.',
    bad: { bodyWeight: 700 },
  },
  {
    principle: 'التباعد',
    q: 'أي وحدة بتنقرا بسلاسة؟',
    why: 'تباعد الحروف الزايد بيبيّن «تصميم» بس بيبطّئ القراءة. استخدمه للعناوين القصيرة، وما تلمسه بالنص العادي.',
    bad: { tracking: 22 },
  },
  {
    principle: 'طول السطر',
    q: 'أي وحدة بتقرا سطرها لآخره؟',
    why: 'السطر الطويل بيضيّع العين وهي راجعة لبداية السطر اللي بعده. من ٤٥ لـ ٧٥ حرف — هاي المنطقة اللي بتنقرا بدون تعب.',
    bad: { maxWidth: 90 },
  },
  {
    principle: 'الهدوء',
    q: 'أي وحدة ما فيها ضجيج؟',
    why: 'كل عنصر زخرفي بتضيفه لازم يشتغل. الزخرفة اللي ما بتقول إشي بتاخد انتباه من اللي بيقول.',
    bad: { ornament: 1 },
  },
  {
    principle: 'حجم النص',
    q: 'أي وحدة مريحة للقراءة؟',
    why: 'النص الصغير بيبيّن أنيق بالماكيت وبيصير عذاب على تلفون. القاعدة البسيطة: لو بدك تقرّب عينك، هو صغير.',
    bad: { bodySize: 9 },
  },
];

const EN = [
  {
    principle: 'Contrast',
    q: 'Which one can you read instantly?',
    why: 'Contrast is not taste, it is access. Faded text looks refined on a designer’s monitor and disappears on a customer’s phone in daylight. First question of any identity: can it be read?',
    bad: { bodyOpacity: 0.18 },
  },
  {
    principle: 'Contrast',
    q: 'Which one survives a phone in the street?',
    why: 'Pale grey on dark passes in the office and fails outdoors. If you cannot read it while walking, it does not get read.',
    bad: { bodyColor: 'faint', titleColor: 'faint' },
  },
  {
    principle: 'Hierarchy',
    q: 'Which one tells you where to start?',
    why: 'When everything is the same size, nothing is important. Hierarchy tells the eye: begin here, then here. Without it the visitor decides to leave instead of deciding to read.',
    bad: { titleSize: 13, titleWeight: 500 },
  },
  {
    principle: 'Hierarchy',
    q: 'Which one actually has a headline?',
    why: 'The gap between headline and body must be visible from across the room. A small size difference is not a hierarchy — the eye needs a clear jump to read the order.',
    bad: { titleSize: 15 },
  },
  {
    principle: 'Colour discipline',
    q: 'Which one reads as a single brand?',
    why: 'Every colour you add splits attention. One brand colour plus neutrals means the eye knows where to go. Four colours means no colour is yours.',
    bad: { eyebrowColor: 'pink', bodyColor: 'blue', titleColor: 'gold', ctaColor: 'violet' },
  },
  {
    principle: 'Colour discipline',
    q: 'Which one uses colour to mean something?',
    why: 'Your brand colour is a weapon — spend it on everything and it stops cutting. Keep it for the action you want, and let the rest go grey.',
    bad: { eyebrowColor: 'accent', titleColor: 'accent', bodyColor: 'accent' },
  },
  {
    principle: 'Space',
    q: 'Which one feels more expensive?',
    why: 'Whitespace is not waste — it is what says this element deserves its room. Crowding reads as cheap even when the content is identical.',
    bad: { pad: 8, gap: 2 },
  },
  {
    principle: 'Space',
    q: 'Which one lets the elements breathe?',
    why: 'Spacing between elements works like punctuation. Remove it and the whole sentence becomes one long word.',
    bad: { gap: 1 },
  },
  {
    principle: 'Consistency',
    q: 'Which one looks like a system, not a set of decisions?',
    why: 'Different corner radii inside one card means there is no system. Consistency is the difference between an identity and a design that happened once.',
    bad: { ctaRadius: 999 },
  },
  {
    principle: 'Consistency',
    q: 'Which one feels like the same family?',
    why: 'One radius rule across the site means people recognise you before they see the logo. Mixing radii element by element breaks that recognition.',
    bad: { radius: 0, ctaRadius: 999 },
  },
  {
    principle: 'Focus',
    q: 'Which one tells you what to do?',
    why: 'Three buttons is no button. Every design has one primary action, and the rest become quiet links. That is the difference between a page that posts and a page that sells.',
    bad: { ctas: 3 },
  },
  {
    principle: 'Focus',
    q: 'Which one does not make you think?',
    why: 'Every extra option delays the decision. One clear action lifts conversion — not because it is prettier, but because there is nothing to weigh.',
    bad: { ctas: 2 },
  },
  {
    principle: 'Alignment',
    q: 'Which one feels squared off?',
    why: 'The eye sees invisible lines. When some elements sit left and others sit centred, something feels wrong even when you cannot name it.',
    bad: { align: 'center' },
  },
  {
    principle: 'Weight',
    q: 'Which one has real emphasis?',
    why: 'When all the copy is bold, none of it is. Weight is like raising your voice — it works for a word and becomes shouting across a paragraph.',
    bad: { bodyWeight: 700 },
  },
  {
    principle: 'Letter spacing',
    q: 'Which one reads smoothly?',
    why: 'Extra letter spacing looks designed and slows reading down. Use it on short headlines and leave body text alone.',
    bad: { tracking: 22 },
  },
  {
    principle: 'Line length',
    q: 'Which one do you finish the line of?',
    why: 'Long lines lose the eye on its way back to the next line. Forty-five to seventy-five characters is the range that reads without effort.',
    bad: { maxWidth: 90 },
  },
  {
    principle: 'Quiet',
    q: 'Which one has no noise?',
    why: 'Every decorative element has to earn its place. Ornament that says nothing steals attention from what does.',
    bad: { ornament: 1 },
  },
  {
    principle: 'Text size',
    q: 'Which one is comfortable to read?',
    why: 'Small type looks elegant in a mockup and becomes punishment on a phone. Simple rule: if you lean in, it is too small.',
    bad: { bodySize: 9 },
  },
];

export const BANK = { ar: AR, en: EN };
