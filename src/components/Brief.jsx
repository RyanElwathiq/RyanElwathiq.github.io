// ═══════════════════════════════════════════════════════════════
//  نموذج الطلب — «احكيلي عن مشروعك»
//
//  ثلاث خطوات بحركة انتقال، مع شريط تقدّم. قسّمناه لخطوات مش
//  صفحة وحدة طويلة لأن النموذج الطويل بيخوّف الزائر ويهرب منه.
//
//  ⚠️ كيف بتوصلك الطلبات حالياً:
//     الموقع ثابت على GitHub Pages — يعني ما فيه سيرفر يستقبل
//     النماذج. فالزر بيفتح بريد الزائر ومعبّى كل الإجابات جاهزة،
//     وهو بيضغط إرسال. بتوصلك كإيميل عادي.
//     وفي زر «انسخ الطلب» كمان لو ما عنده بريد مضبوط عجهازه.
//
//  🔜 لما نعمل Cloudflare Worker (نفس اللي حنربط فيه مختبر
//     الأفكار بالذكاء الاصطناعي)، بنغيّر دالة submit تحت وبس —
//     وقتها بينبعت الطلب لحاله بدون ما يفتح بريد الزائر.
//
//  ✏️ كل النصوص والخيارات بمتغيّر COPY تحت
// ═══════════════════════════════════════════════════════════════
import { useEffect, useMemo, useState } from 'react';
import Select from './Select.jsx';
import servicesData from '../data/services.json';
import '../styles/brief.css';

const COPY = {
  ar: {
    kicker: 'ابدأ مشروعك',
    title: 'احكيلي عن مشروعك',
    sub: 'ثلاث خطوات قصيرة، وبرجعلك خلال ٢٤–٤٨ ساعة برأي واضح: شو بينفع، شو ما بينفع، ومن وين نبدأ.',
    steps: ['الخدمة', 'المشروع', 'التواصل'],
    // ─── الخطوة ١ ───
    q1: 'شو بتحتاج؟',
    q1hint: 'اختار كل اللي بينطبق عليك.',
    services: [
      'موقع إلكتروني',
      'هوية بصرية',
      'إعلانات مدفوعة',
      'إدارة سوشال ميديا',
      'مونتاج فيديو',
      'استراتيجية تسويق',
      'تحسين محركات البحث (SEO)',
      'استشارة أو تدريب',
      'إشي ثاني',
    ],
    // ─── الخطوة ٢ ───
    q2biz: 'اسم مشروعك',
    q2bizPh: 'مثلاً: كافيه الركن',
    // ⚠️ سؤال جديد: الاسم لحاله ما بيقول اشي. «نضال للتجارة» ما
    //    بتعرّفنا شو بيبيع، بينما «كافيه» بتعرّفنا. بلا هالسطر
    //    الرد بيطلع عام.
    q2what: 'بشو بيشتغل؟',
    q2whatPh: 'مثلاً: كافيه ومحمصة بن',
    q2budget: 'الميزانية التقريبية',
    budgets: ['لسا ما حدّدت', 'أقل من ٥٠٠ د', '٥٠٠ – ٢٠٠٠ د', '٢٠٠٠ – ٥٠٠٠ د', 'فوق ٥٠٠٠ د'],
    q2when: 'إيمتى بدك تبدأ؟',
    whens: ['بأسرع وقت', 'خلال شهر', 'خلال ٣ شهور', 'بس بستكشف'],

    // ═══════════════════════════════════════════════════════════
    //  الأسئلة الثلاثة — بدل المربّع الواحد
    //
    //  كان في مربّع واحد اسمه «احكيلي عن المشروع» وتحته placeholder
    //  فيه ثلاث أسئلة. مشكلتان بهاد:
    //   • الـ placeholder بيختفي أول ما يبلّش يكتب، فبينسى السؤال
    //   • ثلاث أسئلة بمربّع واحد = جواب على وحدة أو ولا وحدة
    //
    //  الحل: ثلاث خانات، كل وحدة سؤال واحد بعنوان **ثابت** (مش
    //  placeholder)، ومثال حقيقي بيعلّمه العمق المطلوب.
    //  والأمثلة مقصودة تكون لمشاريع صغيرة — عشان اللي عنده بسطة
    //  ما يحس إنه المكان مش إله.
    // ═══════════════════════════════════════════════════════════
    q2pain: 'شو المشكلة اللي مخلّيتك تدوّر عن حدا؟',
    q2painPh: 'مثلاً: محلي من سنتين، اللي بيجي بيرجع وراضي. بس ما في زباين جداد خالص.',
    q2tried: 'شو جرّبت قبل، وشو صار؟',
    q2triedPh: 'مثلاً: بوستات ممولة بـ٢٠٠ دينار. إجت رسايل «كم السعر؟» وما اشترى ولا واحد.',
    q2win: 'لو زبط الشغل، شو بيتغيّر عندك؟',
    q2winPh: 'مثلاً: ١٠ طلبات بالأسبوع بدل ٣، وأقدر أوظّف حدا يساعدني.',
    q2optional: 'اختياري. بس بيفرق كثير',

    // ─── مقياس قوة الإشارة ───
    sigLabel: 'قوة إشارتك',
    sig0: 'ما وصلني اشي بعد',
    sig1: 'إشارة ضعيفة، ردّي رح يكون عام',
    sig2: 'إشارة واضحة',
    sig3: 'إشارة قوية، هيك بقدر أفيدك فعلاً',
    // ─── الخطوة ٣ ───
    q3name: 'اسمك',
    q3namePh: 'الاسم الكامل',
    q3email: 'إيميلك',
    q3emailPh: 'name@example.com',
    q3phone: 'رقمك (اختياري)',
    q3phonePh: '+962 …',
    // ─── أزرار ───
    next: 'التالي',
    back: 'رجوع',
    send: 'أرسل الطلب',
    copy: 'انسخ الطلب',
    copied: 'انتسخ ✓',
    // ─── تحقّق ───
    errService: 'اختار خدمة وحدة على الأقل.',
    errName: 'اكتب اسمك.',
    errEmail: 'اكتب إيميل صحيح.',
    // ⚠️ الرسالة بتقول له شو يعمل، مش بس إنه في خطأ. زر «انسخ
    //    الطلب» موجود تحت أصلاً فما بيضيع اللي كتبه.
    errSend: 'ما قدرنا نبعت الطلب. جرّب كمان مرة، أو انسخ الطلب من الزر تحت وابعتهولي واتساب.',
    sending: 'عم نبعت…',
    // ─── بعد الإرسال ───
    // ⚠️ كان مكتوب «فتحت بريدك» أيام ما الفورم كان بيفتح mailto.
    //    هلق الطلب بيوصل مباشرة — والنص لازم يقول اللي بيصير فعلاً،
    //    وإلا الزائر بيقعد يستنى بريد ما رح يفتح.
    doneTitle: 'وصلني طلبك',
    doneBody:
      'قرأته أنا شخصياً. مش نموذج آلي. برجعلك خلال ٢٤ ساعة، وغالباً أسرع. وإذا استعجلت، احكيني واتساب مباشرة.',
    doneAgain: 'ابدأ طلب جديد',
    orReach: 'أو تواصل معي مباشرة:',
    note: 'ما بشارك تفاصيل مشروعك مع حدا. بترجعلك مني شخصياً.',
  },
  en: {
    kicker: 'Start a project',
    title: 'Tell me about your project',
    sub: 'Three short steps, and I get back to you within 24–48 hours with a clear opinion: what works, what does not, and where to start.',
    steps: ['Service', 'Project', 'Contact'],
    q1: 'What do you need?',
    q1hint: 'Pick everything that applies.',
    services: [
      'Website',
      'Brand identity',
      'Paid ads',
      'Social media management',
      'Video editing',
      'Marketing strategy',
      'SEO',
      'Consulting or training',
      'Something else',
    ],
    q2biz: 'Business name',
    q2bizPh: 'e.g. Corner Cafe',
    q2what: 'What does it do?',
    q2whatPh: 'e.g. cafe and coffee roastery',
    q2budget: 'Rough budget',
    budgets: ['Not decided yet', 'Under 500 JD', '500 – 2,000 JD', '2,000 – 5,000 JD', 'Over 5,000 JD'],
    q2when: 'When do you want to start?',
    whens: ['As soon as possible', 'Within a month', 'Within 3 months', 'Just exploring'],

    q2pain: 'What problem sent you looking for help?',
    q2painPh: "e.g. Two years open, everyone who comes returns happy, but no new customers at all.",
    q2tried: 'What have you already tried, and what happened?',
    q2triedPh: 'e.g. 200 JD on boosted posts. Got "how much?" messages, nobody bought.',
    q2win: 'If this works, what changes for you?',
    q2winPh: 'e.g. 10 orders a week instead of 3, enough to hire someone.',
    q2optional: 'Optional, but it makes a real difference',

    sigLabel: 'Signal strength',
    sig0: 'Nothing received yet',
    sig1: 'Weak signal. My reply will be generic',
    sig2: 'Clear signal',
    sig3: 'Strong signal. Now I can actually help',
    q3name: 'Your name',
    q3namePh: 'Full name',
    q3email: 'Your email',
    q3emailPh: 'name@example.com',
    q3phone: 'Phone (optional)',
    q3phonePh: '+962 …',
    next: 'Next',
    back: 'Back',
    send: 'Send the brief',
    copy: 'Copy the brief',
    copied: 'Copied ✓',
    errService: 'Pick at least one service.',
    errName: 'Please enter your name.',
    errEmail: 'Please enter a valid email.',
    errSend: 'We could not send the brief. Try again, or copy it with the button below and send it over WhatsApp.',
    sending: 'Sending…',
    doneTitle: 'Your brief reached me',
    doneBody:
      'I read it myself. No automated form in between. You will hear back within 24 hours, usually sooner. In a hurry? Message me on WhatsApp directly.',
    doneAgain: 'Start another brief',
    orReach: 'Or reach me directly:',
    note: 'I do not share your project details with anyone. You hear back from me personally.',
  },
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

// ⚠️ preselect: معرّف خدمة (أو رابطها) بتنختار تلقائياً.
//    بتستخدمها صفحات الخدمات لما الفورم يكون مركّب جوّاها —
//    وقتها ما في ?s= بالرابط، فلازم تجي كخاصية.
export default function Brief({ lang = 'ar', email = '', whatsapp = '', asH1 = false, preselect = '' }) {
  const isAr = lang === 'ar';
  const t = COPY[isAr ? 'ar' : 'en'];

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // اتجاه الحركة: 1 لقدام، -1 لورا
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState('');
  const [sending, setSending] = useState(false);
  // فخّ السبام: حقل مخفي عن الإنسان، الروبوتات بتعبّيه لأنها
  // بتقرأ الـ HTML مش الشاشة. لو انتعبّى، الـ Worker بيتجاهل الطلب.
  const [trap, setTrap] = useState('');

  const [services, setServices] = useState([]);
  const [biz, setBiz] = useState('');
  const [what, setWhat] = useState('');
  const [budget, setBudget] = useState(t.budgets[0]);
  const [when, setWhen] = useState(t.whens[0]);
  // ثلاث خانات بدل خانة وحدة — شوف الشرح عند q2pain بالنصوص فوق
  const [pain, setPain] = useState('');
  const [tried, setTried] = useState('');
  const [win, setWin] = useState('');
  const [name, setName] = useState('');
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');

  const toggleService = (s) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  // ═══════════════════════════════════════════════════════════
  //  اختيار الخدمة تلقائياً من الرابط  (?s=seo مثلاً)
  //
  //  ليش؟ لما الزائر ييجي من صفحة خدمة معيّنة، إنه يقعد يدوّر
  //  على نفس الخدمة بالقائمة من جديد خطوة ضايعة بتخسّرنا ناس.
  //
  //  ⚠️ بينقرا بـ useEffect مش بقيمة أولية، لأن الصفحة بتنبني
  //     عالسيرفر (ما في window هناك) — والقراءة الأولية بتسبب
  //     اختلاف بين HTML السيرفر والمتصفح.
  //  ⚠️ الاسم بيجي من services.json نفسه، فلو تغيّر نص الخدمة
  //     بمكان واحد ما بينكسر الاختيار بصمت. وإذا الاسم مش
  //     موجود بالقائمة، ما بيصير اشي — بلا أخطاء.
  //  ⚠️ منقبل المعرّف (id) أو الرابط (slug) لأنهم بيختلفوا
  //     بخمس خدمات: ads ↔ paid-ads، social ↔ social-media...
  //     ومين ما شاف الرابط /services/paid-ads/ رح يكتب
  //     ?s=paid-ads طبيعي. لو قبلنا واحد بس، بيفشل بصمت.
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    // الخاصية أول، وإلا الرابط. صفحات الخدمات بتمرّر الخاصية
    // لأنه الفورم مركّب جوّاها فما في ?s=، وصفحة /brief/ بتاخد
    // من الرابط لما ييجي الزائر من زر «ابدأ الطلب».
    const id = preselect || new URLSearchParams(window.location.search).get('s');
    if (!id) return;
    const svc = servicesData.services.find((x) => x.id === id || x.slug === id);
    const label = svc?.briefValue?.[isAr ? 'ar' : 'en'];
    if (label && t.services.includes(label)) setServices([label]);
  }, [isAr, t.services, preselect]);

  // ═══════════════════════════════════════════════════════════
  //  دمج الأسئلة الثلاثة بحقل details واحد
  //
  //  ليش منجمّعهم بدل ما نبعتهم منفصلين؟ لأنه الـ Worker وقاعدة
  //  البيانات بيتوقّعوا حقل `details` واحد. لو بعتنا ثلاثة حقول
  //  جديدة، بدها تعديل بالـ Worker وترحيل لجدول D1 والطلبات
  //  القديمة بتصير ناقصة أعمدة.
  //  بالدمج: صفر تعديل بالخلفية، وكلود بياخد نص **مرتّب بعناوين**
  //  أوضح من فقرة مبعثرة. والعناوين بتساعده يفهم أي جزء شو.
  //  والفاضي بينشال — عشان ما يوصل «جرّب قبل: —» بلا فايدة.
  // ═══════════════════════════════════════════════════════════
  const details = useMemo(() => {
    const L = isAr
      ? ['المشكلة', 'جرّب قبل', 'شكل النجاح عنده']
      : ['The problem', 'Already tried', 'What success looks like'];
    return [
      pain && `${L[0]}: ${pain.trim()}`,
      tried && `${L[1]}: ${tried.trim()}`,
      win && `${L[2]}: ${win.trim()}`,
    ]
      .filter(Boolean)
      .join('\n\n');
  }, [pain, tried, win, isAr]);

  // اسم المشروع + شو بيشتغل، بسطر واحد
  const bizFull = useMemo(
    () => [biz.trim(), what.trim()].filter(Boolean).join(': '),
    [biz, what],
  );

  // ═══════════════════════════════════════════════════════════
  //  قوة الإشارة
  //
  //  مش زينة: هي تغذية راجعة فورية بتخلي الزائر يكتب أكثر.
  //  الناس بتستجيب لمؤشر تقدّم بيتحرك وهي بتكتب أكثر بكثير من
  //  جملة «كل ما حكيت أكثر كل ما كان ردّي أدق» — لأن الجملة
  //  وعد مجرّد، والمؤشر نتيجة بيشوفها بعينه.
  //
  //  والمقياس مربوط بلغة البراند (إشارة/Signal) مش مجرد شريط.
  //
  //  ⚠️ المقياس على **مجموع** الثلاثة مش على كل وحدة، عشان اللي
  //     بيكتب فقرة كاملة بخانة وحدة ما ينعاقب.
  // ═══════════════════════════════════════════════════════════
  //  ⚠️ العتبات معايرة على الأمثلة اللي تحت الخانات: كل مثال
  //     ٥٥–٧٠ حرف، فاللي بيعبّي الثلاثة متل الأمثلة بيوصل ~١٧٥.
  //     أول معايرة كانت ٣ = ١٨٠+، يعني اللي عمل كل المطلوب بيوقف
  //     عند «واضحة» وما بياخد المكافأة — وهاي بتحبط بدل ما تشجّع.
  //     صارت ١٤٠ عشان الالتزام بالأمثلة يوصل «قوية» بمساحة مريحة.
  const signal = useMemo(() => {
    const n = (pain + tried + win).replace(/\s+/g, ' ').trim().length;
    if (n === 0) return 0;
    if (n < 60) return 1;
    if (n < 140) return 2;
    return 3;
  }, [pain, tried, win]);

  // ─── نص الطلب النهائي ───
  const briefText = useMemo(() => {
    const L = isAr
      ? ['الخدمات', 'المشروع', 'الميزانية', 'البداية', 'التفاصيل', 'الاسم', 'الإيميل', 'الهاتف']
      : ['Services', 'Business', 'Budget', 'Timeline', 'Details', 'Name', 'Email', 'Phone'];
    return [
      `${L[0]}: ${services.join('، ') || '، '}`,
      `${L[1]}: ${bizFull || '. '}`,
      `${L[2]}: ${budget}`,
      `${L[3]}: ${when}`,
      '',
      `${L[4]}:`,
      details || ': ',
      '',
      `${L[5]}: ${name}`,
      `${L[6]}: ${mail}`,
      `${L[7]}: ${phone || '. '}`,
    ].join('\n');
  }, [services, bizFull, budget, when, details, name, mail, phone, isAr]);

  // ═══════════════════════════════════════════════════════════
  //  الإرسال
  //
  //  كان بيفتح برنامج البريد عند الزائر (mailto) — ونص الناس
  //  بتوقف عند هالخطوة. صار بيروح للـ Worker مباشرة، والطلب
  //  بيوصل ريّان إيميل وتنبيه تيليجرام بنفس اللحظة.
  //
  //  ⚠️ لو الإرسال فشل لأي سبب (نت الزائر، الخدمة واقعة)، ما
  //     منقوله «تم». منرجّعه للفورم مع رسالة وزر «انسخ الطلب»
  //     الموجود أصلاً — عشان ما يضيع طلب حقيقي بالصمت.
  // ═══════════════════════════════════════════════════════════
  const API = 'https://ryanalali-api.ryanalali-api.workers.dev';

  const submit = async () => {
    if (sending) return;
    setErr('');
    setSending(true);

    const stop = new AbortController();
    const timer = setTimeout(() => stop.abort(), 20000);

    try {
      const r = await fetch(API + '/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: stop.signal,
        body: JSON.stringify({
          // ⚠️ biz بينبعت كـ bizFull («الاسم — شو بيشتغل») و details
          //    بينبعت مدموج من الأسئلة الثلاثة. أسماء الحقول ما
          //    تغيّرت عن قصد — الـ Worker وجدول D1 ما بدهم أي تعديل.
          lang, name, mail, phone, biz: bizFull, budget, when, services, details,
          // فخّ السبام — الحقل المخفي تحت. الإنسان ما بيشوفه
          website: trap,
        }),
      });
      if (!r.ok) throw new Error('send-failed');
      setDone(true);
    } catch {
      setErr(t.errSend);
    } finally {
      clearTimeout(timer);
      setSending(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(briefText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* بعض المتصفحات بتمنع النسخ بدون إذن — منتجاهلها بهدوء */
    }
  };

  const go = (to) => {
    setErr('');
    if (to > step) {
      if (step === 0 && services.length === 0) return setErr(t.errService);
      if (step === 2) {
        if (!name.trim()) return setErr(t.errName);
        if (!isEmail(mail)) return setErr(t.errEmail);
      }
    }
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const reset = () => {
    setDone(false);
    setStep(0);
    setServices([]);
    setBiz('');
    setDetails('');
    setName('');
    setMail('');
    setPhone('');
  };

  const pct = ((step + 1) / 3) * 100;

  // ═══ بعد الإرسال ═══
  if (done) {
    return (
      <div className="brief brief-done">
        <div className="brief-check" aria-hidden="true">
          <svg viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="24" />
            <path d="M14 27l8 8 16-17" />
          </svg>
        </div>
        <h3>{t.doneTitle}</h3>
        <p>{t.doneBody}</p>
        <div className="brief-actions">
          <button type="button" className="btn btn-primary" onClick={copy}>
            {copied ? t.copied : t.copy}
          </button>
          <button type="button" className="brief-link" onClick={reset}>
            {t.doneAgain}
          </button>
        </div>
        <p className="brief-reach">
          {t.orReach}{' '}
          <a href={`mailto:${email}`}>{email}</a>
          {whatsapp && (
            <>
              {' · '}
              <a href={whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="brief">
      <div className="brief-head">
        <p className="brief-kicker">{t.kicker}</p>
        {/* بالصفحة المخصّصة بيصير h1. كل صفحة لازم يكون فيها عنوان
            رئيسي واحد بالضبط (جوجل وقارئ الشاشة بيعتمدوا عليه) */}
        {asH1 ? <h1>{t.title}</h1> : <h2>{t.title}</h2>}
        <p className="brief-sub">{t.sub}</p>
      </div>

      {/* ─── شريط التقدّم ─── */}
      <div className="brief-progress">
        <div className="brief-bar">
          <span style={{ width: `${pct}%` }} />
        </div>
        <ol className="brief-steps">
          {t.steps.map((s, i) => (
            <li key={s} className={i === step ? 'is-now' : i < step ? 'is-done' : ''}>
              <b>{String(i + 1).padStart(2, '0')}</b> {s}
            </li>
          ))}
        </ol>
      </div>

      {/* ─── الخطوات ─── */}
      <div className="brief-panel" key={step} data-dir={dir}>
        {step === 0 && (
          <>
            <label className="brief-q">{t.q1}</label>
            <p className="brief-hint">{t.q1hint}</p>
            <div className="brief-chips">
              {t.services.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="brief-chip"
                  aria-pressed={services.includes(s)}
                  onClick={() => toggleService(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <div className="brief-grid">
            <div className="brief-field">
              <label htmlFor="b-biz">{t.q2biz}</label>
              <input id="b-biz" value={biz} onChange={(e) => setBiz(e.target.value)} placeholder={t.q2bizPh} />
            </div>
            <div className="brief-field">
              <label htmlFor="b-what">{t.q2what}</label>
              <input id="b-what" value={what} onChange={(e) => setWhat(e.target.value)} placeholder={t.q2whatPh} />
            </div>
            <div className="brief-field">
              <label htmlFor="b-budget">{t.q2budget}</label>
              <Select
                id="b-budget"
                value={budget}
                onChange={setBudget}
                options={t.budgets.map((b) => ({ value: b, label: b }))}
                ariaLabel={t.q2budget}
              />
            </div>
            <div className="brief-field">
              <label htmlFor="b-when">{t.q2when}</label>
              <Select
                id="b-when"
                value={when}
                onChange={setWhen}
                options={t.whens.map((w) => ({ value: w, label: w }))}
                ariaLabel={t.q2when}
              />
            </div>
            {/* ═══ الأسئلة الثلاثة ═══
                كل سؤال بعنوان ثابت فوقه. مش placeholder، عشان
                يضل باين وهو بيكتب. والمثال بيعلّمه العمق المطلوب. */}
            <div className="brief-field is-wide">
              <label htmlFor="b-pain">{t.q2pain}</label>
              <textarea
                id="b-pain"
                rows={3}
                value={pain}
                onChange={(e) => setPain(e.target.value)}
                placeholder={t.q2painPh}
              />
            </div>

            <div className="brief-field is-wide">
              <label htmlFor="b-tried">
                {t.q2tried} <span className="brief-opt">{t.q2optional}</span>
              </label>
              <textarea
                id="b-tried"
                rows={3}
                value={tried}
                onChange={(e) => setTried(e.target.value)}
                placeholder={t.q2triedPh}
              />
            </div>

            <div className="brief-field is-wide">
              <label htmlFor="b-win">
                {t.q2win} <span className="brief-opt">{t.q2optional}</span>
              </label>
              <textarea
                id="b-win"
                rows={3}
                value={win}
                onChange={(e) => setWin(e.target.value)}
                placeholder={t.q2winPh}
              />
            </div>

            {/* ═══ مقياس قوة الإشارة ═══
                aria-live عشان قارئ الشاشة يسمع التغيّر. بس polite
                مش assertive، عشان ما يقاطعه بكل حرف بيكتبه. */}
            <div className="brief-field is-wide">
              <div className="sig" data-level={signal}>
                <div className="sig-head">
                  <span className="sig-label">{t.sigLabel}</span>
                  <span className="sig-state" aria-live="polite">
                    {[t.sig0, t.sig1, t.sig2, t.sig3][signal]}
                  </span>
                </div>
                <div
                  className="sig-bars"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={3}
                  aria-valuenow={signal}
                  aria-label={t.sigLabel}
                >
                  <i /><i /><i />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="brief-grid">
            <div className="brief-field">
              <label htmlFor="b-name">{t.q3name}</label>
              <input id="b-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.q3namePh} />
            </div>
            <div className="brief-field">
              <label htmlFor="b-email">{t.q3email}</label>
              <input
                id="b-email"
                type="email"
                inputMode="email"
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                placeholder={t.q3emailPh}
              />
            </div>
            <div className="brief-field">
              <label htmlFor="b-phone">{t.q3phone}</label>
              <input
                id="b-phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.q3phonePh}
              />
            </div>
          </div>
        )}
      </div>

      {/* ═══ فخّ السبام ═══
          الروبوت بيقرأ الـ HTML وبيعبّي أي حقل بيلاقيه، والإنسان
          ما بيشوفه أصلاً. لو انتعبّى، الـ Worker بيتجاهل الطلب.
          ⚠️ display:none بس، مع tabIndex=-1 و aria-hidden عشان
             قارئ الشاشة ما يوصله ويحيّر مستخدم كفيف. */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
          />
        </label>
      </div>

      {err && (
        <p className="brief-err" role="alert">
          {err}
        </p>
      )}

      {/* ─── التنقّل ─── */}
      <div className="brief-nav">
        {step > 0 && (
          <button type="button" className="brief-link" onClick={() => go(step - 1)}>
            ← {t.back}
          </button>
        )}
        {step < 2 ? (
          <button type="button" className="btn btn-primary" onClick={() => go(step + 1)}>
            {t.next}
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            disabled={sending}
            onClick={() => {
              if (!name.trim()) return setErr(t.errName);
              if (!isEmail(mail)) return setErr(t.errEmail);
              submit();
            }}
          >
            {sending ? t.sending : t.send}
          </button>
        )}
      </div>

      <p className="brief-note">{t.note}</p>
    </div>
  );
}
