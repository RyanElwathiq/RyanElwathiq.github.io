// ═══════════════════════════════════════════════════════════════
//  حاسبة الخسارة — «قديش عم تخسر كل شهر بدون موقع؟»
//
//  هاي **أداة بيع** مش لعبة. الفكرة إنها تقلب السؤال:
//  بدل «قديش رح يكلفني الموقع؟» → «قديش عم يكلفني إني بدونه؟»
//
//  📂 وين إيش:
//     • الأرقام والنسب ....... src/data/loss.js
//     • المعادلة ............. src/scripts/loss-engine.js
//     • التصميم .............. src/styles/loss.css
//     • النصوص ............... تحت مباشرة بمتغيّر COPY ✏️
// ═══════════════════════════════════════════════════════════════
import { useEffect, useMemo, useRef, useState } from 'react';
import { industries, siteStates, reasons, DEFAULTS, LIMITS } from '../data/loss.js';
import { calcLoss } from '../scripts/loss-engine.js';
import Select from './Select.jsx';
import '../styles/loss.css';

const COPY = {
  ar: {
    kicker: 'حاسبة',
    title: 'قديش عم تخسر كل شهر بدون موقع؟',
    sub: 'مش قديش رح يكلفك الموقع، قديش عم يكلفك إنك بدونه. عبّي أربع خانات وشوف الرقم.',
    qIndustry: 'مجال مشروعك',
    qSite: 'وضعك الحالي أونلاين',
    qProfit: 'متوسط ربحك من العميل الواحد',
    qClients: 'كم عميل بيجيك بالشهر حالياً',
    jd: 'دينار',
    client: 'عميل',
    resultLabel: 'تقديرياً، عم تخسر',
    perMonth: 'كل شهر',
    yearLabel: 'خلال سنة',
    threeLabel: 'خلال ٣ سنين',
    clientsLost: 'عميل ضايع بالشهر',
    whereTitle: 'من وين بتيجي الخسارة',
    paybackTitle: 'وبالمقابل',
    paybackBody: (m, cost) =>
      `موقع بـ ${cost.toLocaleString('en-US')} دينار بيرجّع تكلفته خلال ${m} تقريباً، وبعدها بيضل يشتغل.`,
    months: (n) => (n < 1 ? 'أقل من شهر' : n < 2 ? 'شهر' : n < 11 ? `${n.toFixed(1)} شهور` : `${(n / 12).toFixed(1)} سنة`),
    cta: 'احكيلي عن مشروعك',
    ctaNote: 'بنحسبها سوا على أرقامك إنت، مش على متوسطات.',
    disclaimer:
      'الأرقام تقديرية ومبنية على متوسطات محافظة للسوق الأردني، قصدنا نقلّلها مش نضخّمها. النتيجة الحقيقية بتعتمد على مجالك ومنافسيك وجودة التنفيذ. الحاسبة بتوريك حجم المشكلة، مش وعد بربح.',
  },
  en: {
    kicker: 'Calculator',
    title: 'How much are you losing every month without a website?',
    sub: 'Not what a website costs you. What not having one costs you. Fill four fields and see the number.',
    qIndustry: 'Your industry',
    qSite: 'Your situation online',
    qProfit: 'Average profit per customer',
    qClients: 'Customers per month right now',
    jd: 'JD',
    client: 'customers',
    resultLabel: 'You are losing roughly',
    perMonth: 'every month',
    yearLabel: 'over a year',
    threeLabel: 'over 3 years',
    clientsLost: 'lost customers a month',
    whereTitle: 'Where the loss comes from',
    paybackTitle: 'And on the other side',
    paybackBody: (m, cost) =>
      `A ${cost.toLocaleString('en-US')} JD website pays for itself in about ${m}, and then keeps working.`,
    months: (n) => (n < 1 ? 'under a month' : n < 2 ? 'a month' : n < 11 ? `${n.toFixed(1)} months` : `${(n / 12).toFixed(1)} years`),
    cta: 'Tell me about your project',
    ctaNote: 'We work it out on your numbers, not on averages.',
    disclaimer:
      'These are estimates based on deliberately conservative Jordanian market averages. We aimed low, not high. Real results depend on your industry, competitors, and execution. This shows the size of the problem, it is not a promise of profit.',
  },
};

// ─── عدّاد بيعدّ للرقم الجديد بدل ما ينط عليه ───
//
//  ⚠️⚠️ ليش الكود هيك ومش أبسط؟ ⚠️⚠️
//  الرقم منكتبه مباشرة على الصفحة (textContent) مش عبر React، لأنه
//  بيتغيّر ٦٠ مرة بالثانية ولو مرّرناه عبر React بيعيد رسم المكوّن
//  كل إطار. بس المشكلة: React بيعتبر النص اللي جوّا <span>0</span>
//  ملكه، فأي إعادة رسم بترجّعه صفر — وبما إن الأنيميشن ما بيعيد
//  الاشتغال إلا لما تتغيّر القيمة، الرقم بيضل **عالق على صفر للأبد**.
//  وهاد بالضبط اللي صار عالموبايل: الأرقام الكبيرة صفر بينما أرقام
//  «من وين بتيجي الخسارة» (اللي بيرسمها React) صحيحة.
//
//  الحل تلات طبقات:
//   ١) بعد كل إعادة رسم منرجّع الرقم اللي إحنا كاتبينه.
//   ٢) دالة التنسيق بمرجع ثابت، عشان الأنيميشن ما يعيد الاشتغال
//      مع كل رسمة بلا داعي.
//   ٣) لو الأنيميشن ما اشتغل لأي سبب، الرقم النهائي بينكتب فوراً.
function useCounter(value, ref, format) {
  const from = useRef(0);
  const shown = useRef(0);
  const fmt = useRef(format);
  fmt.current = format;

  // (١) بعد كل رسمة: نرجّع الرقم لمكانه
  useEffect(() => {
    if (ref.current) ref.current.textContent = fmt.current(shown.current);
  });

  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    const b = value;
    const dur = 650;
    let raf = 0;

    const write = (v) => {
      shown.current = v;
      if (ref.current) ref.current.textContent = fmt.current(v);
    };

    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      // تباطؤ بالنهاية عشان الحركة تحس طبيعية
      const eased = 1 - Math.pow(1 - t, 3);
      write(a + (b - a) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = b;
    };
    raf = requestAnimationFrame(tick);

    // (٣) شبكة أمان: لو ما وصل للنهاية خلال ثانية ونص، نحطّه فوراً
    const safety = setTimeout(() => {
      if (from.current !== b) {
        cancelAnimationFrame(raf);
        from.current = b;
        write(b);
      }
    }, 1500);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [value, ref]);
}

const money = (n) => Math.round(n).toLocaleString('en-US');

// asH1: بالصفحة المخصّصة العنوان لازم يكون h1 (كل صفحة إلها عنوان رئيسي
// واحد — جوجل بيعتمد عليه، وقارئ الشاشة بيبني عليه خريطة الصفحة)
export default function LossCalc({ lang = 'ar', briefHref = '/brief/', asH1 = false }) {
  const isAr = lang === 'ar';
  const t = COPY[isAr ? 'ar' : 'en'];

  const [industry, setIndustry] = useState(DEFAULTS.industry);
  const [site, setSite] = useState(DEFAULTS.site);
  const [profit, setProfit] = useState(DEFAULTS.profit);
  const [clients, setClients] = useState(DEFAULTS.clients);

  const r = useMemo(
    () => calcLoss({ industry, site, profit, clients }),
    [industry, site, profit, clients]
  );

  const mRef = useRef(null);
  const yRef = useRef(null);
  const tRef = useRef(null);
  const cRef = useRef(null);
  useCounter(r.monthly, mRef, money);
  useCounter(r.yearly, yRef, money);
  useCounter(r.threeYears, tRef, money);
  useCounter(r.lostClients, cRef, (v) => v.toFixed(1));

  const maxShare = Math.max(...r.breakdown.map((b) => b.money), 1);

  // الخيارات بلغة الزائر — منجهّزها هون عشان القائمة تاخدها جاهزة
  const indOpts = industries.map((i) => ({ value: i.key, label: isAr ? i.ar : i.en }));
  const siteOpts = siteStates.map((s) => ({ value: s.key, label: isAr ? s.ar : s.en }));

  return (
    <div className="loss">
      <div className="loss-head">
        <p className="loss-kicker">{t.kicker}</p>
        {asH1 ? <h1>{t.title}</h1> : <h2>{t.title}</h2>}
        <p className="loss-sub">{t.sub}</p>
      </div>

      <div className="loss-grid">
        {/* ─── المدخلات ─── */}
        <div className="loss-inputs">
          <div className="loss-field">
            <label htmlFor="l-ind">{t.qIndustry}</label>
            <Select id="l-ind" value={industry} onChange={setIndustry} options={indOpts} ariaLabel={t.qIndustry} />
          </div>

          <div className="loss-field">
            <label htmlFor="l-site">{t.qSite}</label>
            <Select id="l-site" value={site} onChange={setSite} options={siteOpts} ariaLabel={t.qSite} />
          </div>

          <div className="loss-field">
            <label htmlFor="l-profit">
              {t.qProfit} <b>{money(profit)} {t.jd}</b>
            </label>
            <input
              id="l-profit"
              type="range"
              min={LIMITS.profit.min}
              max={LIMITS.profit.max}
              step={LIMITS.profit.step}
              value={profit}
              onChange={(e) => setProfit(+e.target.value)}
            />
          </div>

          <div className="loss-field">
            <label htmlFor="l-clients">
              {t.qClients} <b>{clients} {t.client}</b>
            </label>
            <input
              id="l-clients"
              type="range"
              min={LIMITS.clients.min}
              max={LIMITS.clients.max}
              step={LIMITS.clients.step}
              value={clients}
              onChange={(e) => setClients(+e.target.value)}
            />
          </div>
        </div>

        {/* ─── النتيجة ─── */}
        <div className="loss-result">
          <p className="loss-result-label">{t.resultLabel}</p>
          <p className="loss-big">
            <span ref={mRef}>0</span>
            <i>{t.jd}</i>
          </p>
          <p className="loss-per">{t.perMonth}</p>

          <div className="loss-mini">
            <div>
              <span className="loss-mini-label">{t.yearLabel}</span>
              <b>
                <span ref={yRef}>0</span> {t.jd}
              </b>
            </div>
            <div>
              <span className="loss-mini-label">{t.threeLabel}</span>
              <b>
                <span ref={tRef}>0</span> {t.jd}
              </b>
            </div>
            <div>
              <span className="loss-mini-label">{t.clientsLost}</span>
              <b>
                <span ref={cRef}>0</span>
              </b>
            </div>
          </div>
        </div>
      </div>

      {/* ─── من وين بتيجي الخسارة ─── */}
      {/* ⚠️ نفس منطق asH1: لما الحاسبة تكون هي عنوان الصفحة (h1)،
          هذا العنوان لازم يصير h2. مش h3، عشان ما نقفز درجة */}
      {asH1 ? (
        <h2 className="loss-block-title">{t.whereTitle}</h2>
      ) : (
        <h3 className="loss-block-title">{t.whereTitle}</h3>
      )}
      <ul className="loss-reasons">
        {r.breakdown.map((b) => {
          const info = reasons.find((x) => x.key === b.key)[isAr ? 'ar' : 'en'];
          return (
            <li key={b.key}>
              <div className="loss-reason-top">
                <b>{info.t}</b>
                <span>
                  {money(b.money)} {t.jd}
                </span>
              </div>
              <div className="loss-reason-bar">
                <span style={{ width: `${(b.money / maxShare) * 100}%` }} />
              </div>
              <p>{info.d}</p>
            </li>
          );
        })}
      </ul>

      {/* ─── متى بيرجّع تكلفته ─── */}
      {r.payback !== null && r.monthly > 0 && (
        <div className="loss-payback">
          <p className="loss-payback-title">{t.paybackTitle}</p>
          <p className="loss-payback-body">{t.paybackBody(t.months(r.payback), r.siteCost)}</p>
        </div>
      )}

      <div className="loss-cta">
        <a className="btn btn-primary" href={briefHref}>
          {t.cta}
        </a>
        <span>{t.ctaNote}</span>
      </div>

      <p className="loss-disclaimer">{t.disclaimer}</p>
    </div>
  );
}
