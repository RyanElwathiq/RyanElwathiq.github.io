// ═══════════════════════════════════════════════════════════════
//  نصوص قصص المشاريع
//
//  ⚠️ القاعدة: نبلّش من **مشكلة العميل**، مش من «شو صمّمت».
//     العميل اللي بيقرأ ما بيهمّه إنك عملت ٣٢ تصميم — بيهمّه
//     إنك فهمت مشكلة زي مشكلته وحلّيتها.
//
//  ✏️ لتعديل أي نص: هون، وبعدها شغّل السكربت
// ═══════════════════════════════════════════════════════════════
import fs from 'node:fs';

const W = 'D:/Ryan-Portfolio/site/src/data/work.json';
const work = JSON.parse(fs.readFileSync(W, 'utf8'));

const S = {
  // ═══════════════════════ أورينت ═══════════════════════
  orient: {
    ar: {
      challenge:
        'شركة طاقة شمسية شغّالة من ٢٠١٥، ركّبت أنظمة لمنازل وفازت بعطاءات حكومية — بس هويتها البصرية كانت بتخلّيها تبيّن ورشة صغيرة. والأصعب: السوق كان مليان اعتقادات مغلوطة عن الطاقة الشمسية بتقتل البيع قبل ما يبلّش. الناس ما كانت ترفض السعر، كانت ترفض فكرة ما فهمتها.',
      approach:
        'اشتغلنا على خطّين مع بعض. الأول: بنينا الهوية من اللوجو لفوق — نظام كامل يشتغل على كل مقاس ومنصة، مش لوجو ملوّن وخلص. الثاني، وهو الأهم: بدل ما ننزّل صور منتجات، جمعنا الأسئلة والاعتراضات الحقيقية اللي بتوصل الشركة من السوق، وبنينا عليها حملة تثقيفية بتجاوب عليها وحدة وحدة — «شو بستفيد بالشتا؟» «الفاتورة مقابل سعر النظام» «هل فعلاً بوفّر؟».',
      result:
        '٣٢ قطعة بلغة بصرية واحدة، مرتّبة بحيث لما تنزل جنب بعض على الصفحة تبيّن كأنها رسمة وحدة متواصلة. والمحتوى بطّل يعلن — صار يناقش. وهاد الفرق بين صفحة بتنشر وصفحة بتبيع.',
    },
    en: {
      challenge:
        'A solar company operating since 2015 — installations in homes, wins in government tenders — but a visual identity that made them look like a small workshop. Worse: the market was full of misconceptions about solar that killed deals before they started. People were not rejecting the price. They were rejecting an idea they had not understood.',
      approach:
        'Two tracks at once. First, we rebuilt the identity from the logo up into a system that holds across every format and platform — not a coloured logo and done. Second, and more important: instead of posting product shots, we collected the real questions and objections reaching the company from the market, and built an educational campaign that answered them one by one — "what do I gain in winter?", "the bill versus the system cost", "does it actually save me anything?".',
      result:
        '32 pieces in a single visual language, sequenced so that when they sit side by side on the profile they read as one continuous image. And the content stopped announcing — it started arguing. That is the difference between a page that posts and a page that sells.',
    },
  },

  // ═══════════════════════ د. سمير ═══════════════════════
  'dr-samir': {
    ar: {
      challenge:
        'طبيب عنده خبرة حقيقية وحضور رقمي صفر. والمحتوى الطبي عادة بيقع بفخّين: يا بيطلع زي كتاب جامعي ما حدا بيقراه، يا بيطلع إعلان ما حدا بيصدّقه. والاثنين ما بيبنوا ثقة.',
      approach:
        'بنينا العلامة من الصفر: دليل هوية، هوية بصرية، نظام مونتاج، وكتابة خطافات. وأهم قرار كان بالمحتوى نفسه — بنيناه على اللي المرضى فعلاً بيسألوه وبيقلقوا منه، مش على اللي ممتع طبياً. وصمّمنا الكاروسيلز بحيث كل ثلاثة يبيّنوا كأنهم قطعة وحدة على شبكة الصفحة، فالزائر يحس إنه داخل مكان مرتّب مش صفحة عشوائية.',
      result:
        'من صفر لـ ٢٣٩٥ متابع عضوي خلال ٣٠ يوم، و٢٩٠ ألف مشاهدة على بوست واحد — بصفر إنفاق إعلاني. وهاد من أكبر المشاريع اللي أشرفت عليها: كتابة، إخراج، إشراف على التصوير، ومونتاج.',
    },
    en: {
      challenge:
        'A doctor with real expertise and zero digital presence. Medical content usually falls into one of two traps: it reads like a textbook nobody finishes, or like an ad nobody believes. Neither builds trust.',
      approach:
        'We built the brand from scratch: guidelines, visual identity, an editing system, and hook writing. The key decision was in the content itself — we built it around what patients actually ask and worry about, not around what is medically interesting. Carousels were designed in threes so they read as one piece on the profile grid, so a visitor lands in something organised rather than a random feed.',
      result:
        'From zero to 2,395 organic followers in 30 days, and 290K views on a single post — with zero ad spend. One of the largest projects I have run end to end: writing, direction, supervising the shoot, and editing.',
    },
  },

  // ═══════════════════════ أركان العنان ═══════════════════════
  arkan: {
    ar: {
      challenge:
        'تسويق العقارات كله بيبيّن نفس الإشي: لقطة درون، مساحة، سعر، رقم تلفون. والنتيجة إنه المشتري ما بيفرّق بين مشروع وثاني — فبيقرّر بالسعر لحاله، وهاي أسوأ أرضية تتنافس عليها.',
      approach:
        'بدأنا من الفكرة القصصية قبل ما نمسك كاميرا: شو الإحساس اللي بدنا نطلّعه، ومين اللي بيحكي، وليش يهمّه. وبعدها الإخراج الإبداعي والمونتاج، مع استشارات وإعلانات وجلسات تصوير محدودة.',
      result:
        'مجموعة فيديوهات بتحكي قصة المكان مش بس بتعرض مساحاته — والفرق بيبيّن بأول عشر ثواني.',
    },
    en: {
      challenge:
        'Real-estate marketing all looks the same: a drone shot, a floor area, a price, a phone number. The result is that buyers cannot tell one project from another — so they decide on price alone, which is the worst ground to compete on.',
      approach:
        'We started from the story before anyone picked up a camera: what feeling are we after, who is telling it, and why should they care. Then creative direction and editing, alongside consulting, light ad work, and a limited number of shoots.',
      result:
        'A set of films that tell the story of a place instead of listing its square metres — and the difference shows in the first ten seconds.',
    },
  },

  // ═══════════════════════ فكرة ونقطة ═══════════════════════
  'fikra-nuqta': {
    ar: {
      challenge:
        'وكالة تسويق ما بتقدر تسوّق لحالها. كانت تنزّل قوائم خدمات وتحكي للعملاء «ابنوا محتوى» — والتناقض هذا بيشوفه كل عميل محتمل قبل ما يتواصل.',
      approach:
        'حوّلنا التوجّه بالكامل لاستراتيجية الوصول بالمحتوى: كل بوست بيحمل فكرة عن كيف بيشتغل التسويق فعلاً، مش إعلان عن الوكالة. وبصرياً اشتغلنا بدمج الصور — أكثر من صورة وأكثر من مكان بتركيبة وحدة توقف الزائر عن السحب.',
      result:
        'صفحة بتثبت الكفاءة بدل ما تدّعيها. أقوى البوستات كانت اللي بتقول إشي مزعج وصحيح: «بتضيّع ميزانيتك التسويقية بدون نتائج؟» و«أقوى أنواع التسويق ما ببيّن إنه تسويق أصلاً».',
    },
    en: {
      challenge:
        'A marketing agency that could not market itself. It was posting service lists while telling clients to build content — and every prospect sees that contradiction before they ever get in touch.',
      approach:
        'We moved the whole account onto a content-led strategy: every post carries an idea about how marketing actually works, rather than an ad for the agency. Visually we worked in composite imagery — several photographs and several places fused into one frame that stops the scroll.',
      result:
        'A page that demonstrates competence instead of claiming it. The strongest posts were the ones that said something uncomfortable and true: "Is your marketing budget disappearing with nothing to show?" and "The strongest marketing never looks like marketing."',
    },
  },

  // ═══════════════════════ الباقي ═══════════════════════
  'the-corner': {
    ar: {
      challenge:
        'صالون جديد، وصاحبه لسا بيستكشف: مش واضح شو الطابع، ولا كيف بدها تبيّن الخدمات، ولا شو الفرق بينه وبين اللي جنبه.',
      approach:
        'اشتغلنا مجموعة تصاميم بتوضّح رؤية المشروع: لوحة الألوان، التوجّه الفني، وطريقة عرض الخدمات بشكل رمزي بدل قوائم أسعار.',
      result: 'هوية عامة واضحة لصفحاته، وأساس يقدر يبني عليه بدل ما يجرّب كل مرة من جديد.',
    },
    en: {
      challenge:
        'A new salon whose owner was still exploring: no clear character, no clear way to present services, no clear difference from the place next door.',
      approach:
        'We built a set of pieces that define the vision: palette, art direction, and a way of showing services symbolically instead of as a price list.',
      result: 'A clear visual identity for the social pages, and a base to build on instead of starting over every time.',
    },
  },

  'dream-crests': {
    ar: {
      challenge: 'مطوّر عقاري بده حضور رقمي من الصفر — لوجو، هوية، وخطة محتوى للشقق المتوفرة.',
      approach:
        'أشرفت على بناء الهوية البصرية كاملة، وبنينا التواجد الرقمي على منصات التواصل مع إعلانات وخطة محتوى بتوازن بين عرض الوحدات والمحتوى العام اللي بيبني الثقة.',
      result: 'هوية كاملة وحضور مرتّب بدل صفحات فاضية.',
    },
    en: {
      challenge: 'A real-estate developer starting from nothing digitally — logo, identity, and a content plan for available units.',
      approach:
        'I supervised the full visual identity and built the social presence, with ad work and a content plan balancing unit listings against the general content that actually builds trust.',
      result: 'A complete identity and an organised presence instead of empty pages.',
    },
  },

  stylomation: {
    ar: {
      challenge: 'شركة بدها لوجو وهوية — بس المشكلة الحقيقية إنها بدها نظام يضل متناسق كل ما تكبر.',
      approach: 'بنينا اللوجو والهوية مع نظام تصاميم سوشال ميديا مبني عشان يتوسّع، مش عشان يبيّن حلو بملف عرض.',
      result: 'هوية بتشتغل بعد التسليم مش بس يومه.',
    },
    en: {
      challenge: 'A company that wanted a logo and identity — but the real need was a system that stays consistent as they grow.',
      approach: 'We built the logo and identity alongside a social design system made to scale, not just to look good in a presentation deck.',
      result: 'An identity that keeps working after handover, not only on the day of it.',
    },
  },

  'the-place': {
    ar: {
      challenge: 'مهندس معماري ومصمم ديكور ببداياته — شغله حلو بس ما في إشي بيجمعه بصرياً.',
      approach: 'مجموعة تصاميم بهوية موحّدة، ومقدّمة لوجو متحرّكة تعطي حضوره طابع مميّز بأول ثانيتين من أي فيديو.',
      result: 'حضور بصري متماسك لمشروع لسا ببدايته.',
    },
    en: {
      challenge: 'An architect and interior designer starting out — good work, but nothing tying it together visually.',
      approach: 'A set of pieces in one identity, plus an animated logo intro that gives his presence a signature in the first two seconds of any film.',
      result: 'A coherent visual presence for a practice still in its early days.',
    },
  },

  'anfasak-oud': {
    ar: {
      challenge:
        'عطر ما بتقدر تشمّه من الشاشة. المشكلة كلها: كيف تخلّي الزائر يحس بالرائحة من صورة ثابتة.',
      approach: 'بنينا لكل عبوة عالم بصري يوازي رائحتها — الإضاءة والخامات والمكان بيحكوا اللي العبوة ما بتقدر تحكيه.',
      result: 'تصاميم منتج بتبيع إحساس مش زجاجة.',
    },
    en: {
      challenge: 'You cannot smell a perfume through a screen. That is the whole problem: making a still image carry a scent.',
      approach: 'Each bottle got a visual world matching its scent — light, materials, and place saying what the bottle cannot.',
      result: 'Product work that sells a feeling rather than a glass container.',
    },
  },

  knockout: {
    ar: {
      challenge: 'شركة ميديا ناشئة بحاجة محتوى وموشن جرافيك بميزانية بداية.',
      approach: 'مجموعة تصاميم وفيديوهات موشن — وهاد كان من المشاريع اللي تعلّمت فيها الموشن جرافيك عملياً وأنا بشتغل.',
      result: 'الشركة ما استمرت، بس الشغل ضل — وهو جزء صادق من مرحلة التعلّم.',
    },
    en: {
      challenge: 'An early-stage media startup needing content and motion graphics on a starting budget.',
      approach: 'A set of designs and motion pieces — this was one of the projects where I learned motion graphics by doing it on live work.',
      result: 'The company did not last, but the work did — and it is an honest part of the learning curve.',
    },
  },
};

let n = 0;
for (const p of work.projects) {
  const s = S[p.id];
  if (!s) continue;
  p.storyAr = { ...(p.storyAr || {}), ...s.ar };
  p.story = { ...(p.story || {}), ...s.en };
  n++;
}

fs.writeFileSync(W, JSON.stringify(work, null, 2) + '\n', 'utf8');
console.log(`قصص انكتبت: ${n} مشروع\n`);
work.projects.forEach((p) => {
  const has = p.storyAr && Object.keys(p.storyAr).length;
  console.log('  ' + p.id.padEnd(15) + (has ? `✓ ${Object.keys(p.storyAr).join(' · ')}` : '— لسا'));
});
