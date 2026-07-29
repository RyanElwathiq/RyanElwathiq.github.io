// ═══════════════════════════════════════════════════════════════
//  بناء بنك الأسئلة الشائعة
//
//  الأسئلة مبنية على بحث بمخاوف أصحاب الأعمال الحقيقية قبل ما
//  يشغّلوا مسوّق أو مبرمج مستقل — مش على تخمين. أهم ما طلع:
//   • أكبر خوف مش السعر، هو **الملكية**: مين بيملك الدومين
//     والموقع وحساب الإعلانات لو انتهت العلاقة
//   • الوصول للحسابات: كلمات السر بتنشارك وبتضيع السيطرة
//   • حساب Meta: الوكالات بتبني حساب العميل جوّا حسابها فالعميل
//     ما بيملك إشي
//   • قلق التركيز: المستقل بيشتغل مع كذا عميل
//   • قلق الاستمرارية: شو بيصير لو اختفى؟
//
//  التشغيل: node _check/faqbuild.mjs
//  ⚠️ بيكتب فوق src/data/faq.json — بس بيحافظ على الأسئلة
//     القديمة كلها ومرتّبها ضمن التصنيفات الجديدة
// ═══════════════════════════════════════════════════════════════
import fs from 'node:fs';

const P = 'D:/Ryan-Portfolio/site/src/data/faq.json';
const old = JSON.parse(fs.readFileSync(P, 'utf8'));

// التصنيفات — بالترتيب اللي بدنا الفلاتر تظهر فيه
const T = {
  work: ['Working together', 'طريقة الشغل'],
  own: ['Ownership', 'الملكية والوصول'],
  legal: ['Contracts', 'العقد والقانون'],
  money: ['Pricing', 'الأسعار'],
  results: ['Results', 'النتائج'],
  risk: ['Risk', 'المخاطر'],
};

const mk = (cat, q, qAr, a, aAr) => ({
  tag: T[cat][0],
  tagAr: T[cat][1],
  q,
  qAr,
  a,
  aAr,
});

// الأسئلة القديمة: منحافظ عليها بس منعيد تصنيفها
const keep = (qAr, cat) => {
  const it = old.items.find((x) => x.qAr === qAr);
  if (!it) throw new Error('ما لقيت السؤال القديم: ' + qAr);
  return { ...it, tag: T[cat][0], tagAr: T[cat][1] };
};

const items = [
  // ─────────── طريقة الشغل ───────────
  { ...keep('كيف بيبدأ المشروع عادةً؟', 'work'), open: true },
  keep('كم تعديل بيحقّلي؟', 'work'),
  keep('بتشتغل مع عملاء برا الأردن؟', 'work'),
  keep('قديش بياخد المشروع وقت؟', 'work'),

  mk(
    'work',
    'You are one person. What happens when you are busy with another client?',
    'إنت شخص واحد. شو بيصير لما تكون مشغول مع عميل ثاني؟',
    'I take a limited number of projects at a time, and I tell you the truth about my capacity before we start — not after. You get named delivery dates in writing. If something slips, you hear it from me first, not from a missed deadline. The trade for working with one person instead of an agency is that the person who understood your business is the same person doing the work.',
    'بشتغل على عدد محدود من المشاريع بنفس الوقت، وبقلّك الصراحة عن وقتي **قبل** ما نبدأ مش بعدين. بتاخد تواريخ تسليم مكتوبة بالاسم. ولو تأخّر إشي بتسمعها مني أول، مش من موعد فات. المقابل إنك بتشتغل مع شخص واحد بدل وكالة: نفس الشخص اللي فهم شغلك هو اللي بينفّذه.'
  ),
  mk(
    'work',
    'Do I have to write the content myself?',
    'لازم أكتب المحتوى بنفسي؟',
    'No. Copy is part of the work, in Arabic and English. What I do need from you is the raw material only you have: what customers actually ask you, which objections kill your deals, and what you sell that nobody else does. I turn that into the writing.',
    'لأ. الكتابة جزء من الشغل، عربي وإنجليزي. اللي بحتاجه منك هو المادة الخام اللي ما بتوجد إلا عندك: شو بيسألوك الزباين فعلاً، وشو الاعتراضات اللي بتقتل البيعة، وشو بتقدّم إنت وما بيقدّمه غيرك. أنا بحوّلها لكتابة.'
  ),

  // ─────────── الملكية والوصول ───────────
  { ...keep('مين بيملك الملفات بالنهاية؟', 'own'), open: false },
  mk(
    'own',
    'Whose name is the domain registered in?',
    'الدومين بيتسجّل باسم مين؟',
    'Yours. Always. The domain is the one thing that cannot be rebuilt, and it is the single most common way people get held hostage — the domain sits in the freelancer’s account, and the day you disagree you lose your address. Register it yourself with your own card and email, and add me as a user. If you already registered it through someone else, moving it to your name is the first thing I would fix.',
    'باسمك إنت. دايماً. الدومين هو الإشي الوحيد اللي ما بينبنى من جديد، وهو أكثر طريقة بيتحجز فيها الناس رهينة: الدومين بيكون بحساب المصمّم، وأول ما تختلفوا بتفقد عنوانك. سجّله إنت ببطاقتك وإيميلك، وضيفني كمستخدم. ولو مسجّل عند حدا ثاني، أول إشي بنصلّحه هو ترجيعه لاسمك.'
  ),
  mk(
    'own',
    'Who owns the hosting and the website files?',
    'مين بيملك الاستضافة وملفات الموقع؟',
    'You own both. Hosting goes on your account, and you get the full source — not just a live link. That means any developer after me can pick it up without starting over. A site you cannot move is not a site you own.',
    'إنت بتملك الاثنين. الاستضافة على حسابك، وبتاخد الملفات المصدرية كاملة — مش بس رابط شغّال. يعني أي مبرمج بعدي بيقدر يكمّل من مكانه بدون ما يبدأ من الصفر. الموقع اللي ما بتقدر تنقله مش موقعك.'
  ),
  mk(
    'own',
    'And the ad account and the Facebook page?',
    'وحساب الإعلانات وصفحة الفيسبوك؟',
    'They stay yours. The correct setup is that your business owns the Business Manager, the page, the ad account and the pixel, and I get partner access to work inside it. The wrong setup — the common one — is the agency building your ad account inside its own portfolio. It is faster for them and it means you own nothing: not the account, not the audiences, not the pixel history you paid to build.',
    'بتضل إلك. الإعداد الصح إنه شركتك بتملك الـ Business Manager والصفحة وحساب الإعلانات والبكسل، وأنا بوخذ صلاحية شريك أشتغل جوّاهم. الإعداد الغلط — وهو الشائع — إنه الوكالة تبني حساب إعلاناتك جوّا حسابها هي. أسرع إلها، ومعناه إنك ما بتملك إشي: لا الحساب ولا الجماهير ولا تاريخ البكسل اللي دفعت عشان تبنيه.'
  ),
  mk(
    'own',
    'Do I have to give you my passwords?',
    'لازم أعطيك كلمات السر تبعتي؟',
    'No, and you should not give them to anyone. Every serious platform has proper roles: Meta partner access, Google Ads manager access, WordPress user accounts, Shopify staff accounts. You add me with the permission I need and remove me with one click when we are done. Nobody changes a password and nobody gets locked out.',
    'لأ، ولا تعطيها لحدا أصلاً. كل منصة محترمة فيها صلاحيات جاهزة: شريك بالميتا، ومدير بجوجل، ومستخدم بالووردبريس، وموظّف بالشوبيفاي. بتضيفني بالصلاحية اللي بحتاجها، وبتشيلني بضغطة وحدة لما نخلص. ولا حدا بيغيّر كلمة سر ولا حدا بينقفل برّا.'
  ),
  mk(
    'own',
    'What exactly do I get on the last day?',
    'شو بستلم بالضبط بآخر يوم؟',
    'A handover, not a goodbye message: source files and design files, access to everything in your name, a short document with what is where and how to run it, and the accounts and passwords already in your control. If you can only reach your business through me, I built it wrong.',
    'تسليم، مش رسالة وداع: الملفات المصدرية وملفات التصميم، وصلاحيات كل إشي باسمك، وورقة قصيرة فيها شو وين وكيف بيتشغّل، والحسابات أصلاً بيدك. إذا ما بتقدر توصل لشغلك إلا من خلالي، يعني أنا بنيته غلط.'
  ),

  // ─────────── العقد والقانون ───────────
  mk(
    'legal',
    'Is there a written contract?',
    'في عقد مكتوب؟',
    'Yes, before any money moves. It names the deliverables, the dates, the price, how many revision rounds are included, what counts as out of scope, who owns what, and how either of us can end it. A contract is not a sign of distrust — it is what makes it possible to disagree about something without the whole project collapsing.',
    'إي، قبل ما يتحرّك أي مبلغ. بيسمّي التسليمات والتواريخ والسعر وعدد جولات التعديل وشو اللي بيعتبر خارج النطاق ومين بيملك شو وكيف أي طرف بيقدر ينهي. العقد مش دليل انعدام ثقة — هو اللي بيخلّينا نقدر نختلف على إشي بدون ما ينهار المشروع كله.'
  ),
  mk(
    'legal',
    'Will you sign an NDA?',
    'بتوقّع اتفاقية سرّية؟',
    'Yes, and I will suggest one if your work touches customer data, pricing, or anything you would not want a competitor reading. It runs both ways: your numbers stay yours, and nothing goes into my portfolio without you approving it first.',
    'إي، وبقترحها أنا لو شغلك فيه بيانات زباين أو أسعار أو أي إشي ما بتحب منافسك يقراه. وبتمشي بالاتجاهين: أرقامك بتضل إلك، وما بينزل إشي على معرض أعمالي إلا بموافقتك أنت أولاً.'
  ),
  mk(
    'legal',
    'Can I stop you from publishing my project in your portfolio?',
    'بقدر أمنعك تنشر مشروعي بأعمالك؟',
    'Completely. Publishing is opt-in, not opt-out. Some clients let me show the designs but not the numbers, some let me show numbers without the name, and some prefer nothing at all. All three are normal and none of them change the price.',
    'تماماً. النشر بموافقة، مش بالعكس. في عملاء بيسمحولي أعرض التصاميم بدون الأرقام، وفي بيسمحوا بالأرقام بدون الاسم، وفي بيفضّلوا ولا إشي. الثلاثة عاديين وولا واحد فيهم بيغيّر السعر.'
  ),
  mk(
    'legal',
    'Do I get a proper invoice?',
    'بستلم فاتورة رسمية؟',
    'You get a written invoice for every payment, with the scope and the dates on it, so it is a clean record for your books. If your business needs a specific invoice format for tax purposes, tell me at the start and we arrange it before the first payment rather than after.',
    'بتستلم فاتورة مكتوبة عن كل دفعة، وفيها النطاق والتواريخ، فبتكون سجل نظيف لدفاترك. ولو شركتك بدها شكل فاتورة معيّن لأغراض ضريبية، احكيلي من البداية ومنرتّبها قبل أول دفعة مش بعدها.'
  ),
  mk(
    'legal',
    'Who is responsible if the ads get rejected or the page gets restricted?',
    'مين مسؤول لو انرفض الإعلان أو انحظرت الصفحة؟',
    'I am responsible for running inside the platform rules and for fixing it when something is flagged — appeals, rewriting the creative, correcting the setup. What I cannot do is promise a platform will never make a mistake; Meta and Google restrict accounts wrongly all the time. What matters is that your assets are in your name, so a restriction is a problem to solve and not a business you lost access to.',
    'أنا مسؤول إني أشتغل ضمن قوانين المنصة وأصلّح لما ينحطّ علم: اعتراضات، وإعادة كتابة الإعلان، وتصحيح الإعداد. اللي ما بقدر أوعد فيه إنه المنصة ما بتغلط أبداً — ميتا وجوجل بيحظروا حسابات بالغلط كل يوم. المهم إنه أصولك باسمك، فالحظر بيصير مشكلة بتنحل مش شغل فقدت الوصول إله.'
  ),
  mk(
    'legal',
    'What about my customers’ data?',
    'وشو عن بيانات زبايني؟',
    'It stays inside your accounts and your tools, not mine. I do not export customer lists to my own devices, and any analytics or tracking I set up goes on your properties under your ownership. If we set up a CRM or a form, the data lands with you from day one.',
    'بتضل جوّا حساباتك وأدواتك، مش عندي. ما ببعّت قوائم زباين لأجهزتي، وأي تتبّع أو تحليلات بركّبها بتنحط على ملكيّاتك إنت. ولو ركّبنا CRM أو نموذج، البيانات بتنزل عندك من أول يوم.'
  ),

  // ─────────── الأسعار ───────────
  { ...keep('ليش ما في قائمة أسعار بالموقع؟', 'money'), open: false },
  keep('شو أصغر مشروع بتشتغله؟', 'money'),
  mk(
    'money',
    'How does payment work?',
    'كيف بتمشي الدفعات؟',
    'Split across milestones, not all at the start and not all at the end. Typically a first payment to book the time, one at an agreed midpoint, and the last on handover. You always know what has been delivered before the next payment is due.',
    'مقسّمة على مراحل، لا كلها بالبداية ولا كلها بالآخر. عادةً دفعة أولى بتحجز الوقت، وحدة بمنتصف متّفق عليه، والأخيرة عند التسليم. دايماً بتكون عارف شو انسلّم قبل ما تستحق الدفعة اللي بعدها.'
  ),
  mk(
    'money',
    'Is the ad budget included in your price?',
    'ميزانية الإعلانات محسوبة بسعرك؟',
    'No, and be careful with anyone who blurs that line. My fee is for the work. The ad budget goes from your card straight to Meta or Google, so you can see every dinar in the platform yourself. Mixing the two is how people end up unable to tell what they paid for reach and what they paid for a person.',
    'لأ، وخلّي بالك من أي حدا بيخلط الاثنين. أجري مقابل الشغل. وميزانية الإعلانات بتروح من بطاقتك مباشرة لميتا أو جوجل، فبتشوف كل دينار بالمنصة بعينك. الخلط بينهم هو السبب اللي بيخلّي الناس ما تعرف قدّيش دفعت وصول وقدّيش دفعت لشخص.'
  ),
  mk(
    'money',
    'Why is a website more expensive here than a template I can buy?',
    'ليش الموقع أغلى من قالب جاهز بقدر أشتريه؟',
    'Because a template is a shape and a website is a decision about what your visitor should do. The cost is not in the pages, it is in the structure: what goes first, what objection gets answered where, what you can measure afterwards. If your only need is a shape, a template is genuinely the smarter buy and I will tell you so.',
    'لأنه القالب شكل، والموقع قرار عن شو بدك الزائر يعمل. التكلفة مش بالصفحات، هي بالبنية: شو بيجي أول، وأي اعتراض بينحلّ وين، وشو بتقدر تقيسه بعدين. ولو اللي بتحتاجه فعلاً هو شكل بس، القالب هو الشراء الأذكى وأنا بقلّك هيك.'
  ),

  // ─────────── النتائج ───────────
  { ...keep('بتضمن النتائج؟', 'results'), open: false },
  keep('بحتاج إعلانات، ولا العضوي بيكفي؟', 'results'),
  mk(
    'results',
    'How will I know it is working?',
    'كيف بعرف إنه الشغل ماشي؟',
    'You get the numbers that matter to your business, not a screenshot of likes. Before we start we agree on two or three measures — leads, cost per lead, qualified enquiries, sales — and you see them on a fixed rhythm with what changed and what I am doing about it. A report that only ever contains good news is not a report.',
    'بتاخد الأرقام اللي بتهمّ شغلك، مش صورة شاشة للايكات. قبل ما نبدأ منتّفق على رقمين أو ثلاثة — عملاء محتملين، وكلفة العميل، والاستفسارات الجادّة، والمبيعات — وبتشوفهم على إيقاع ثابت مع شو تغيّر وشو عم أعمل بخصوصه. والتقرير اللي دايماً كله أخبار حلوة مش تقرير.'
  ),
  mk(
    'results',
    'How long before I see something?',
    'قديش بدها وقت لأشوف إشي؟',
    'Ads can show signal in days, but the first weeks are learning, not profit — anyone promising otherwise is spending your money to look good early. Organic content and SEO move in months, not weeks. What you should expect quickly is clarity: within the first two weeks you should know what is actually broken.',
    'الإعلانات ممكن تعطي إشارة خلال أيام، بس أول أسابيع تعلّم مش ربح — وأي حدا بيوعدك بغير هيك عم يصرف مصاريك عشان يبيّن حلو بدري. والمحتوى العضوي والسيو بيتحرّكوا بشهور مش أسابيع. اللي المفروض تتوقّعه بسرعة هو الوضوح: خلال أول أسبوعين لازم تكون عارف شو الخربان فعلاً.'
  ),

  // ─────────── المخاطر ───────────
  mk(
    'risk',
    'What if I am not happy with the direction?',
    'شو لو ما عجبني التوجّه؟',
    'You see the thinking before the polish. Direction gets approved on paper — structure, message, the argument we are making — before anything gets designed. That is deliberate: it is cheap to change a sentence and expensive to change a finished campaign. If the direction is wrong, we find out in week one.',
    'بتشوف التفكير قبل التلميع. التوجّه بينعتمد على ورق — البنية والرسالة والحجّة اللي رح نقولها — قبل ما ينتصمّم إشي. وهاد مقصود: تغيير جملة رخيص وتغيير حملة جاهزة غالي. فلو التوجّه غلط، منعرف بأول أسبوع.'
  ),
  mk(
    'risk',
    'What if you disappear halfway?',
    'شو لو اختفيت بنص الطريق؟',
    'Everything is in your accounts as we go, not handed over at the end — so at any moment you already hold the domain, the hosting, the ad account and the files. Work is committed as it is done, not saved on my machine until the final invoice. The honest answer to this question is not a promise, it is a setup where the promise does not matter.',
    'كل إشي بينحط بحساباتك أول بأول، مش بينتسلّم بالآخر — فبأي لحظة إنت أصلاً ماسك الدومين والاستضافة وحساب الإعلانات والملفات. والشغل بينرفع أول بأول مش محفوظ على جهازي لحد آخر فاتورة. والجواب الصادق على هذا السؤال مش وعد، هو إعداد بيخلّي الوعد ما إله لزوم.'
  ),
  mk(
    'risk',
    'Do you work with my competitors?',
    'بتشتغل مع منافسيني؟',
    'Not in the same category at the same time without telling you. If a competitor approaches me while we are working together, you hear about it from me and you decide. Exclusivity in a category can be written into the contract if it matters to you.',
    'مش بنفس المجال وبنفس الوقت بدون ما أخبرك. ولو تواصل معي منافس وإحنا شغّالين مع بعض، بتسمعها مني وإنت بتقرّر. والحصرية بمجالك بتنكتب بالعقد لو الموضوع بيفرق معك.'
  ),
  mk(
    'risk',
    'We tried an agency before and it went badly. Why is this different?',
    'جرّبنا وكالة قبل وكانت تجربة سيئة. ليش هاي غير؟',
    'Usually what went badly was not the work, it was the visibility: you did not know what was being done, you did not own the accounts, and you could not tell whether the money worked. So the fix is not "trust me more" — it is that everything is in your name, the plan is written down, and the numbers you get are the ones your business actually runs on. If those three are true, a bad month is a bad month and not a mystery.',
    'عادةً اللي كان سيّئ مش الشغل نفسه، هو الرؤية: ما كنت عارف شو عم بينعمل، ولا كنت مالك الحسابات، ولا قادر تعرف إذا المصاري اشتغلت. فالحل مش «ثق فيني أكثر» — الحل إنه كل إشي باسمك، والخطة مكتوبة، والأرقام اللي بتوصلك هي اللي شغلك ماشي عليها فعلاً. لو الثلاثة صحّوا، الشهر الضعيف بيصير شهر ضعيف مش لغز.'
  ),

  // ─────────── الأخير: الوظيفة ───────────
  keep('منفتح لوظيفة بدوام كامل؟', 'work'),
];

fs.writeFileSync(P, JSON.stringify({ items }, null, 2) + '\n', 'utf8');

const by = {};
items.forEach((i) => (by[i.tagAr] = (by[i.tagAr] || 0) + 1));
console.log(`✓ ${items.length} سؤال`);
Object.entries(by).forEach(([k, v]) => console.log(`  ${k.padEnd(18)} ${v}`));
