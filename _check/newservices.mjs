// ═══════════════════════════════════════════════════════════════
//  خدمتين جديدتين بحالة «قريباً»
//
//  ريّان طلبهم صراحةً 2026-08-02، وطلب إنه كل وحدة يكون إلها
//  صفحة كاملة فيها الشرح والوجع والأهمية والقصة — مش بس بادج.
//
//    node _check/newservices.mjs
// ═══════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const F = join(ROOT, 'src/data/services.json');
const doc = JSON.parse(readFileSync(F, 'utf8'));

const data = {
  id: 'data',
  slug: 'data-analysis',
  order: 9,
  soon: true,
  briefValue: { ar: 'تحليل البيانات', en: 'Data analysis' },
  proof: '/websites',
  ar: {
    name: 'تحليل البيانات',
    menuDesc: 'تعرف شو بيشتغل قبل ما تصرف أكثر',
    h1: 'عندك أرقام كثيرة. بس ولا وحدة فيهم بتقولك شو تعمل بكرا',
    seoDesc:
      'تحليل بيانات التسويق بالأردن: توحيد أرقام الموقع والإعلانات والسوشال بلوحة وحدة، وربط الزيارة بالمبيعة، وتقرير شهري بلغة قرارات.',
    intro:
      'كل منصة بتعطيك لوحة أرقام، وكل وحدة بتحكي لغة ثانية. النتيجة إنك بتفتح أربع شاشات، وبتطلع منهم بإحساس مش بقرار. تحليل البيانات مش «تقرير أحلى» — هو إنك تعرف بالظبط وين تحط الدينار الجاي.',
    why: [
      'أغلب الشغلات هون ما بتعاني من قلّة بيانات، بتعاني من إنه ما حدا حوّل البيانات لقرار. الأرقام موجودة، بس مبعثرة وبتتناقض، فبتنتهي بإنك تقرّر بالإحساس وتسمّيه خبرة.',
      'وأخطر رقم بالتسويق هو الوصول. بيبيّن كبير وبيريّح النفس وما بيعني إشي لحاله. شفت ميزانيات انحرقت لشهور لأنه ما حدا فصل «كم واحد شافني» عن «كم واحد دفع».',
      'الفرق اللي بتحسّه فعلاً: بدل ما تسأل «كيف كان الشهر؟» بتسأل «شو أوقف وشو أزيد؟» — وبيكون في جواب مكتوب مش رأي.',
    ],
    pain: [
      'كل منصة بتعطيك رقم مختلف عن نفس الحملة، وما بتعرف مين الصادق فيهم',
      'بتشوف «٥٠ ألف وصول» وما بتعرف إذا جابولك ولا زبون واحد',
      'صارلك شهور بتصرف على إعلان وما حدا قالك إذا بيربح ولا بيخسر',
      'بياناتك بأربع أماكن، وكل مرة بدك تقرير بتضيّع يوم تجمّعهم بإيدك',
    ],
    deliver: [
      'لوحة وحدة بتجمع مصادرك كلها: الموقع، الإعلانات، السوشال، والمبيعات',
      'تعريف مكتوب لكل رقم — شو بيقيس بالضبط ومن وين إجا',
      'ربط الزيارة بالمبيعة: تعرف أي قناة جابت فلوس مش وصول',
      'تقرير شهري بلغة قرارات: وقّف هذا، زيد هذا، جرّب هذا',
      'تنبيه لما رقم مهم ينزل — بوقته مش بعد ما يخلص الشهر',
      'تسليم الملكية: اللوحة والحسابات باسمك إنت، مش عندي',
    ],
    faq: [
      {
        q: 'ليش خدمة لحالها ومش جزء من التسويق؟',
        a: 'لأنها بتشتغل حتى لو التسويق مش معي. كثير ناس عندهم وكالة أو موظف شغّال، بس ما حدا بيقدر يقولهم بالأرقام شو اللي بيرجع فلوس. القياس لازم يكون مستقل عن اللي بينفّذ، وإلا صار كل واحد بيصحّح على حاله.',
      },
      {
        q: 'شو بتحتاج مني عشان تبلّش؟',
        a: 'صلاحية قراءة على حساباتك — تحليلات الموقع، مدير إعلانات، وصفحات السوشال. وإذا عندك مبيعات مسجّلة بأي مكان حتى لو إكسل، بتفيد كثير. ما بحتاج ولا كلمة سر، الصلاحيات بتنعطى وبتنسحب منك بأي لحظة.',
      },
      {
        q: 'إذا ما عندي مبيعات أونلاين، بتنفع؟',
        a: 'أيوه، بس القياس بيصير مختلف. بنقيس المكالمات ورسائل الواتس وطلبات التسعير بدل الشراء المباشر، وبنربطهم بمصدرهم. المهم إنه يكون في حدث بتعرف إنه بيقرّب الفلوس.',
      },
      {
        q: 'ليش مكتوب «قريباً» مش متاحة هلق؟',
        a: 'لأني ما بحب أبيع إشي قبل ما يكون النظام جاهز وقابل للتكرار. القاعدة عم تنبنى هلق. سجّل إيميلك وبكون إنت أول واحد يعرف لما تفتح، وبتاخد أول شهر بسعر التأسيس.',
      },
    ],
  },
  en: {
    name: 'Data analysis',
    menuDesc: 'Know what is working before you spend more',
    h1: 'You have plenty of numbers. Not one of them tells you what to do tomorrow',
    seoDesc:
      'Marketing data analysis in Jordan: one dashboard across site, ads, social and sales, visits tied to revenue, and a monthly report written as decisions.',
    intro:
      'Every platform hands you a dashboard, and every one speaks a different language. So you open four screens and come out with a feeling instead of a decision. Data analysis is not a prettier report. It is knowing exactly where the next dinar goes.',
    why: [
      'Most businesses here do not suffer from a lack of data. They suffer because nobody turned the data into a decision. The numbers exist, scattered and contradicting each other, so you end up deciding on instinct and calling it experience.',
      'And the most dangerous number in marketing is reach. It looks big, it feels good, and on its own it means nothing. I have watched budgets burn for months because nobody separated "how many saw me" from "how many paid me".',
      'The difference you actually feel: instead of asking "how was the month", you ask "what do I stop and what do I double" — and there is a written answer instead of an opinion.',
    ],
    pain: [
      'Every platform reports a different number for the same campaign, and you cannot tell which one is honest',
      'You see "50K reach" with no idea whether it produced a single customer',
      'You have been paying for an ad for months and nobody has told you if it makes or loses money',
      'Your data lives in four places, and every report costs you a day of copy-paste',
    ],
    deliver: [
      'One dashboard pulling all your sources together: site, ads, social, sales',
      'A written definition for every number — what it measures and where it came from',
      'Visits tied to revenue, so you know which channel brought money, not reach',
      'A monthly report written as decisions: stop this, scale that, test this',
      'An alert when an important number drops, while you can still act on it',
      'Ownership handover: the dashboard and accounts stay in your name, not mine',
    ],
    faq: [
      {
        q: 'Why is this its own service and not part of marketing?',
        a: 'Because it works even when the marketing is not mine. Plenty of people already have an agency or an in-house person, and still nobody can tell them in numbers what actually returns money. Measurement has to be independent from execution, otherwise everyone is grading their own homework.',
      },
      {
        q: 'What do you need from me to start?',
        a: 'Read access to your accounts: site analytics, ads manager, social pages. If sales are recorded anywhere, even a spreadsheet, that helps a lot. I never need a password, and you can revoke access at any moment.',
      },
      {
        q: 'I do not sell online. Does this still work?',
        a: 'Yes, the measurement just changes shape. We track calls, WhatsApp messages and quote requests instead of purchases, and tie each to its source. What matters is having an event you know moves money closer.',
      },
      {
        q: 'Why does it say coming soon?',
        a: 'Because I do not sell something before the system behind it is repeatable. The foundation is being built now. Leave your email and you will be the first to know when it opens, with founding pricing on the first month.',
      },
    ],
  },
};

const ai = {
  id: 'ai-automation',
  slug: 'ai-agents-automation',
  order: 10,
  soon: true,
  briefValue: { ar: 'وكلاء ذكاء اصطناعي وأتمتة', en: 'AI agents & automation' },
  proof: '/websites',
  ar: {
    name: 'وكلاء ذكاء اصطناعي وأتمتة',
    menuDesc: 'شغل بيعيد نفسه كل يوم، خليه ينعمل لحاله',
    h1: 'كل يوم بتعيد نفس الشغل بإيدك. وهو بينعمل لحاله',
    seoDesc:
      'بناء وكلاء ذكاء اصطناعي وأتمتة للشغلات بالأردن: رد آلي بمعلوماتك إنت، تجميع الطلبات من كل القنوات، وتقارير بتتجهّز لحالها.',
    intro:
      'مش كل إشي بدّه موظف جديد. في شغل بتعيده كل يوم بنفس الترتيب — الرد على نفس السؤال، نقل الطلب من الإنستغرام للواتس، تجهيز نفس التقرير. هذا الشغل بينعمل لحاله، وإنت بتفضى للشغل اللي فعلاً بدّه عقلك.',
    why: [
      'الذكاء الاصطناعي صار موضة، وأغلب اللي بينباع منه ألعاب: أداة حلوة بتشتغل بالعرض وبتنكسر أول ما تلمس شغلك الحقيقي. الفرق مش بالنموذج، الفرق إنه يكون مربوط ببياناتك وقنواتك وناسك.',
      'وأول وجع بيروح هو الرد. الزبون بيسأل نفس الأربع أسئلة، وإنت بترد عليهم عشر مرات باليوم، وبالليل بيسأل حدا وما بترد فبيروح لغيرك. وكيل مربوط بمعلوماتك بيرد بلغتك ٢٤ ساعة، وبيحوّلك اللي بدّه بني آدم.',
      'وهاد الموقع نفسه هو المثال: نموذج الطلب اللي قدامك بيوصلني إيميل وتيليجرام بنفس اللحظة، وفيه مساعد بيولّد أفكار من مدخلات الزائر. مبني على Cloudflare Workers وشغّال فعلاً — مش سلايد بعرض.',
    ],
    pain: [
      'بترد على نفس الأسئلة عشر مرات باليوم، وبالليل بيروح اللي ما لقى رد',
      'الطلبات بتضيع بين الإنستغرام والواتس والإيميل وما في مكان بيجمعهم',
      'بتقعد ساعتين تجهّز تقرير كل شهر وهو بينعمل بدقيقة',
      'جرّبت أدوات ذكاء اصطناعي وطلعت ألعاب — حلوة بالعرض وما ربطت بشغلك',
    ],
    deliver: [
      'وكيل بيرد على أسئلة عملائك من **معلوماتك إنت**، مش من الإنترنت',
      'تحويل ذكي: اللي بدّه بني آدم بيوصلك فوراً مع خلاصة الحكي',
      'صندوق واحد بيجمع الطلبات من كل قنواتك بدل ما تلاحقهم',
      'أتمتة التقارير: بتتجهّز وبتوصلك بوقتها بلا ما تفتح ولا شاشة',
      'حدود ومصاريف واضحة: سقف يومي للاستهلاك عشان ما تتفاجأ بفاتورة',
      'تسليم بالمفتاح: كل إشي بحسابك إنت، وبتقدر توقّفه بأي لحظة',
    ],
    faq: [
      {
        q: 'شو الفرق بين هذا و«شات بوت» جاهز؟',
        a: 'الشات بوت الجاهز بيرد من سيناريو مكتوب سلفاً، فأول سؤال بره السيناريو بينكسر. الوكيل بيقرأ من مصدر معلوماتك إنت — أسعارك، خدماتك، سياستك — وبيجاوب على أسئلة ما حدا توقّعها. والأهم إنه بيعرف إمتى يوقف ويحوّلك.',
      },
      {
        q: 'بيحكي عربي منيح؟',
        a: 'أيوه، وهاي انفحصت مش انفترضت. النماذج الحديثة بتفهم العامية الأردنية وبترد فيها. واللي بينكسر عادةً مش النموذج، هو طريقة إرسال النص العربي بين الأنظمة — وهاي مشكلة تقنية إلها حل معروف.',
      },
      {
        q: 'قديش بتكلّف التشغيل شهرياً؟',
        a: 'حسب عدد الرسائل، وبينحط سقف من أول يوم. الفكرة إنه تعرف أعلى فاتورة ممكنة قبل ما تشغّل، مش بعدين. وبقدرلك أرخص خيار بينفع لحالتك حتى لو كان مجاني.',
      },
      {
        q: 'ليش مكتوب «قريباً»؟',
        a: 'لأني عم أشتغل على النسخة اللي بتنركّب لأي شغلة بأيام مش بشهور. الأساس شغّال ومجرّب على هذا الموقع. سجّل إيميلك وبكون إنت أول واحد يعرف لما تفتح.',
      },
    ],
  },
  en: {
    name: 'AI agents & automation',
    menuDesc: 'Work that repeats itself every day should run itself',
    h1: 'You redo the same work by hand every day. It can run itself',
    seoDesc:
      'AI agents and automation for businesses in Jordan: replies from your own information, requests collected from every channel, and reports that build themselves.',
    intro:
      'Not everything needs another hire. Some work repeats in exactly the same order every day — the same question answered, a request moved from Instagram to WhatsApp, the same report assembled. That work can run itself, and you get your head back for the work that actually needs it.',
    why: [
      'AI became a trend, and most of what gets sold is a toy: a nice demo that breaks the moment it touches real work. The difference is not the model. It is whether it is wired into your data, your channels and your people.',
      'The first pain it removes is replying. Customers ask the same four questions, you answer them ten times a day, and the one who asks at midnight goes to someone else. An agent wired to your information answers in your language around the clock, and hands over anyone who needs a human.',
      'This site is the example. The brief form in front of you reaches me by email and Telegram in the same second, and there is an assistant that generates ideas from what a visitor types. Built on Cloudflare Workers and actually running — not a slide in a deck.',
    ],
    pain: [
      'You answer the same questions ten times a day, and lose whoever asks after hours',
      'Requests scatter across Instagram, WhatsApp and email with nothing pulling them together',
      'You spend two hours a month assembling a report that could build itself in a minute',
      'You tried AI tools and got toys — great in a demo, never wired into your actual work',
    ],
    deliver: [
      'An agent that answers your customers from **your own information**, not the internet',
      'Smart handover: anyone who needs a human reaches you instantly, with the conversation summarised',
      'One inbox collecting requests from every channel instead of you chasing them',
      'Automated reporting: assembled and delivered on time without opening a screen',
      'Clear limits and costs: a daily spend cap so no invoice surprises you',
      'Handover by key: everything under your account, and you can switch it off any moment',
    ],
    faq: [
      {
        q: 'How is this different from an off-the-shelf chatbot?',
        a: 'An off-the-shelf bot answers from a script, so the first question outside the script breaks it. An agent reads from your own source of truth — your prices, services, policy — and answers questions nobody scripted. More importantly, it knows when to stop and hand over.',
      },
      {
        q: 'Does it handle Arabic properly?',
        a: 'Yes, and that was tested rather than assumed. Current models understand Jordanian dialect and reply in it. What usually breaks is not the model but how Arabic text is passed between systems, and that is a technical problem with a known fix.',
      },
      {
        q: 'What does it cost to run per month?',
        a: 'It depends on message volume, and a cap is set on day one. The point is that you know the highest possible bill before switching it on, not after. And I will point you at the cheapest option that fits, even when that option is free.',
      },
      {
        q: 'Why does it say coming soon?',
        a: 'Because I am building the version that installs into any business in days rather than months. The foundation already runs on this site. Leave your email and you will be first to know when it opens.',
      },
    ],
  },
};

// ما بينتكرروا لو انشغّل السكربت مرتين
doc.services = doc.services.filter((s) => s.id !== data.id && s.id !== ai.id);
doc.services.push(data, ai);
doc.services.sort((a, b) => a.order - b.order);

writeFileSync(F, JSON.stringify(doc, null, 2) + '\n', 'utf8');
console.log(`✅ ${doc.services.length} خدمة`);
doc.services.forEach((s) => console.log(`   ${s.order}. ${s.ar.name}${s.soon ? '  (قريباً)' : ''}`));
