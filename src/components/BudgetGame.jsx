// ═══════════════════════════════════════════════════════════════
//  لعبة الميزانية — «وزّع ميزانيتك وشوف شو بترجّعلك»
//
//  ⚛️ هذا الملف مكتوب بـ React (مش Astro) لأنه فيه تفاعل مستمر:
//     كل ما تحرّك سلايدر، كل الأرقام بتتحدث فوراً.
//
//  📂 وين إيش:
//     • الأرقام والمعادلات ......... src/data/budget.js
//     • الحسابات .................. src/scripts/budget-engine.js
//     • التصميم ................... src/styles/budget.css
//     • النصوص .................... تحت مباشرة بمتغيّر t ✏️
// ═══════════════════════════════════════════════════════════════
import { useMemo, useState, useEffect } from 'react';
import { channels, PRESETS, DEFAULT_BUDGET, stepFor } from '../data/budget.js';
import { simulate, myAllocation, evenAllocation, diagnose } from '../scripts/budget-engine.js';
import '../styles/budget.css';

// ─────────────── النصوص (عدّل من هون) ───────────────
const COPY = {
  ar: {
    kicker: 'محاكاة',
    title: 'عندك ميزانية تسويق. وين بتحطها؟',
    sub: 'وزّع ميزانيتك على القنوات الخمس وشوف شو بترجّعلك. لما تخلص، بوريك توزيعي أنا وليش.',
    budgetLabel: 'ميزانيتك الشهرية:',
    zeroSum: 'كل دينار بتزيده على قناة، بيطلع من القنوات الثانية — زي الواقع بالضبط.',
    dinar: 'د',
    results: 'النتيجة المتوقّعة',
    statReach: 'وصول بالشهر الأول',
    statLeads: 'عميل محتمل بالشهر الأول',
    statCpl: 'تكلفة العميل الواحد',
    statSix: 'عملاء بالشهر السادس',
    statYear: 'عميل خلال سنة',
    unitJd: 'دينار',
    multFoundation: 'الأساس',
    multTrust: 'الثقة',
    multMix: 'التكامل',
    multHint: 'المضاعِفات: بتضرب نتيجة كل القنوات. أقل من 1.00 يعني بتخسر من نتيجتك.',
    compare: 'شوف توزيعي أنا',
    hide: 'خفّي المقارنة',
    reset: 'رجّع التوزيع للبداية',
    yours: 'توزيعك',
    mine: 'توزيعي',
    lead: 'عميل',
    compareTitle: 'شوف الفرق',
    compareWin: 'توزيعك أحسن من توزيعي 👏 وهاد مش سهل — شكلك بتفهم باللعبة.',
    compareTie: 'توزيعك قريب كتير من توزيعي. شغل حلو.',
    compareLose: 'نفس الميزانية بالضبط، والفرق بالتوزيع بس.',
    notesTitle: 'ليش',
    ctaText: 'بدك توزيع مبني على مشروعك إنت مش على متوسطات؟',
    ctaBtn: 'احكيلي عن مشروعك',
    disclaimer:
      'هاي محاكاة تعليمية مبنية على متوسطات السوق الأردني وتجربتي بالشغل. الأرقام تقريبية وبتتغيّر حسب مجالك ومنتجك وجودة التنفيذ. «عميل محتمل» = رسالة أو استفسار أو تعبئة نموذج — مش عملية بيع مكتملة.',
    more: 'افتح اللعبة كاملة ←',
    // ملاحظات بتظهر حسب توزيعك
    notes: {
      close: {
        h: 'إنت قريب من التوزيع الصح',
        p: 'وزّعت على أكثر من قناة وما ركّزت كل إشي بمكان واحد. هاي أهم خطوة، والباقي تفاصيل بتتظبط بالتجربة والأرقام.',
      },
      noWeb: {
        h: 'ما في موقع = بتدفع عشان توصل لناس وبعدين بتفقدهم',
        p: 'الإعلان بيوقّف الشخص. الموقع هو اللي بيقنعه. بدون موقع، كل قنواتك بتشتغل بـ 60٪ من قوّتها — ومحدا بيقدر يلاقيك على جوجل، ومحدا بيقدر يشتري وإنت نايم.',
      },
      noBrand: {
        h: 'ما في هوية = الناس بتشوفك بس ما بتتذكرك',
        p: 'الهوية ما بتجيبلك عميل لحالها، بس بتخلي كل عميل شافك يصدّقك ويتذكرك. هاي أرخص طريقة ترفع نتيجة كل القنوات الثانية دفعة وحدة.',
      },
      creatorHeavy: {
        h: 'المؤثرين ثقة مستعارة',
        p: 'بتجيب قفزة كبيرة بيوم واحد، وبعدين بتنسى. لما تخلص الحملة، ما بيضلّك إشي تملكه — لا محتوى، ولا جمهور، ولا بيانات.',
      },
      noAds: {
        h: 'بدون إعلانات، البداية بطيئة كتير',
        p: 'المحتوى العضوي والـ SEO بيرجّعوا أكثر على المدى الطويل، بس بيحتاجوا شهور. الإعلان بيشتري وقت — بيوصلك لناس من أول يوم بينما الباقي عم يكبر.',
      },
      noContent: {
        h: 'الـ SEO ما بيشتغل بدون محتوى',
        p: 'الموقع لحاله صفحة ساكنة. المحتوى هو اللي بيعطي جوجل إشي يفهرسه وبيعطي الناس سبب يرجعولك. صرفك على الموقع بيرجّع ضعف لما يكون وراه محتوى.',
      },
      allIn: {
        h: 'حطّيت كل إشي بقناة وحدة',
        p: 'كل قناة إلها سقف. بعده، كل دينار زيادة بنفس المكان بيرجّع أقل من اللي قبله. وبنفس الوقت، محدا بيشتري من أول لقاء — لما يشوفك بالإعلان وبعدين يلاقي محتواك وبعدين يفوت عالموقع، وقتها بيصدّقك.',
      },
    },
  },
  en: {
    kicker: 'Simulation',
    title: 'You have a marketing budget. Where does it go?',
    sub: 'Split your budget across the five channels and watch what comes back. When you are done, I will show you my split and why.',
    budgetLabel: 'Monthly budget:',
    zeroSum: 'Every dinar you add to one channel comes out of another — exactly like real life.',
    dinar: 'JD',
    results: 'Projected result',
    statReach: 'Reach in month 1',
    statLeads: 'Leads in month 1',
    statCpl: 'Cost per lead',
    statSix: 'Leads in month 6',
    statYear: 'Leads over a year',
    unitJd: 'JD',
    multFoundation: 'Foundation',
    multTrust: 'Trust',
    multMix: 'Compounding',
    multHint: 'Multipliers apply to every channel. Below 1.00 means you are losing results.',
    compare: 'Show me your split',
    hide: 'Hide comparison',
    reset: 'Reset allocation',
    yours: 'Yours',
    mine: 'Mine',
    lead: 'leads',
    compareTitle: 'Here is the difference',
    compareWin: 'Your split beats mine. That is not easy — you clearly know this game.',
    compareTie: 'Your split is very close to mine. Nicely done.',
    compareLose: 'Exact same budget. The only difference is where it went.',
    notesTitle: 'Why',
    ctaText: 'Want a split built on your business instead of averages?',
    ctaBtn: 'Tell me about your business',
    disclaimer:
      'This is an educational simulation based on Jordanian market averages and my own client work. Numbers are estimates and shift with your industry, product, and execution quality. A "lead" means a message, enquiry, or form fill — not a closed sale.',
    more: 'Open the full simulator →',
    notes: {
      close: {
        h: 'You are close to the right split',
        p: 'You spread across several channels instead of dumping everything in one. That is the hard part; the rest is fine-tuning against real numbers.',
      },
      noWeb: {
        h: 'No website means you pay to reach people, then lose them',
        p: 'Ads stop the scroll. The website is what convinces. Without one, every channel runs at about 60% of its power — nobody finds you on Google, and nobody can buy while you sleep.',
      },
      noBrand: {
        h: 'No identity means people see you but do not remember you',
        p: 'Brand work does not bring a lead on its own. It makes every lead that arrives believe you and remember you. It is the cheapest way to lift every other channel at once.',
      },
      creatorHeavy: {
        h: 'Creators are borrowed trust',
        p: 'You get a spike in a day, then it fades. When the campaign ends you own nothing — no content, no audience, no data.',
      },
      noAds: {
        h: 'Without ads, the first months are very slow',
        p: 'Organic content and SEO return more long term, but they need months. Ads buy time — they put you in front of people from day one while everything else grows.',
      },
      noContent: {
        h: 'SEO does not work without content',
        p: 'A website on its own is a static page. Content is what gives Google something to index and gives people a reason to come back. Your website spend returns double when there is content behind it.',
      },
      allIn: {
        h: 'You put everything in one channel',
        p: 'Every channel has a ceiling. Past it, each extra dinar in the same place returns less than the one before. And nobody buys on first contact — they believe you when they see your ad, then find your content, then land on your site.',
      },
    },
  },
};

// تنسيق الأرقام: بنستخدم الأرقام الإنجليزية بالنسختين
// (زي باقي أرقام الموقع — أسهل بالقراءة السريعة)
const fmt = (n) => Math.round(n).toLocaleString('en-US');

export default function BudgetGame({
  lang = 'ar',
  compact = false, // true = النسخة المختصرة (الصفحة الرئيسية والمقال)
  moreHref = '/budget/', // رابط النسخة الكاملة (بيظهر بالنسخة المختصرة بس)
  contactHref = '/#contact',
}) {
  const isAr = lang === 'ar';
  const t = COPY[isAr ? 'ar' : 'en'];

  const [total, setTotal] = useState(DEFAULT_BUDGET);
  const [alloc, setAlloc] = useState(() => evenAllocation(DEFAULT_BUDGET));
  const [revealed, setRevealed] = useState(false);

  const step = stepFor(total);
  const spent = channels.reduce((s, c) => s + (alloc[c.key] || 0), 0);

  const mine = useMemo(() => simulate(myAllocation(total)), [total]);
  const yours = useMemo(() => simulate(alloc), [alloc]);
  const notes = useMemo(() => diagnose(alloc, spent), [alloc, spent]);

  // ⚠️ تصحيح المجموع — خطوتين، وكل وحدة ضرورية:
  //
  //    1) كل رقم لازم يكون من مضاعفات «خطوة السلايدر». ليش؟
  //       لأن السلايدر بالمتصفح بيقرّب أي قيمة لأقرب خطوة. فلو
  //       حطّينا 32 وخطوتنا 10، السلايدر بيوقف على 30 بينما الرقم
  //       المكتوب بيضل 32 — والمقبض بيبيّن بمكان غلط.
  //
  //    2) بعد التقريب، المجموع ممكن يزيد أو ينقص خطوة أو اثنتين،
  //       فبنرجّع الفرق على أكبر قناة (وإذا ما كفّت، على اللي بعدها).
  const normalize = (obj, sum, skipKey, stp = step) => {
    const others = channels.filter((c) => c.key !== skipKey);
    others.forEach((c) => {
      obj[c.key] = Math.round((obj[c.key] || 0) / stp) * stp;
    });

    let diff = sum - channels.reduce((s, c) => s + (obj[c.key] || 0), 0);
    if (diff === 0) return obj;

    // من الأكبر للأصغر، عشان الفرق ما يوقّع قناة صغيرة تحت الصفر
    const order = [...others].sort((a, b) => (obj[b.key] || 0) - (obj[a.key] || 0));
    for (const c of order) {
      if (diff === 0) break;
      const room = diff > 0 ? diff : -Math.min(-diff, obj[c.key] || 0);
      obj[c.key] = (obj[c.key] || 0) + room;
      diff -= room;
    }
    return obj;
  };

  // ─── تغيير الميزانية: بنحافظ على نفس النِسب اللي اختارها الزائر ───
  const changeTotal = (next) => {
    setAlloc((prev) => {
      const old = channels.reduce((s, c) => s + (prev[c.key] || 0), 0);
      if (!old) return normalize(evenAllocation(next), next, null, stepFor(next));
      const out = {};
      channels.forEach((c) => {
        out[c.key] = Math.round(((prev[c.key] || 0) / old) * next);
      });
      // ⚠️ خطوة السلايدر بتتغيّر مع الميزانية، فبنمرّر الخطوة الجديدة
      return normalize(out, next, null, stepFor(next));
    });
    setTotal(next);
    setRevealed(false);
  };

  // ─── تحريك سلايدر ───
  // ⚠️ الميزانية ثابتة، فلما ترفع قناة لازم القنوات الثانية تنزل.
  //    بنوزّع الباقي عليهم بنفس نِسبهم الحالية — يعني لو كان صرفك
  //    على الإعلانات ضعف المحتوى، بيضل ضعفه بعد التعديل.
  //    بدون هالمنطق، السلايدرات بتوصل لطريق مسدود وما بترفع أبداً.
  const setChannel = (key, raw) => {
    setAlloc((prev) => {
      const value = Math.max(0, Math.min(raw, total));
      const others = channels.filter((c) => c.key !== key);
      const pool = total - value; // اللي بينوزّع على باقي القنوات
      const prevOthers = others.reduce((s, c) => s + (prev[c.key] || 0), 0);

      const next = { [key]: value };
      if (prevOthers > 0) {
        others.forEach((c) => {
          next[c.key] = Math.round(((prev[c.key] || 0) / prevOthers) * pool);
        });
      } else {
        // كل الباقي صفر؟ منوزّع بالتساوي
        others.forEach((c) => (next[c.key] = Math.round(pool / others.length)));
      }
      return normalize(next, total, key);
    });
  };

  // ⚠️ Lenis (السكرول الناعم) بياخد لمسة الإصبع لحاله، فبيمنع
  //    سحب السلايدر عالموبايل. منوقّفه وقت السحب بس ومنرجّعه بعدها.
  //    وبنضمن إنه يرجع يشتغل حتى لو انحذف المكوّن والإصبع لسا نازل
  useEffect(() => () => window.__lenis?.start(), []);

  const holdScroll = {
    onPointerDown: () => window.__lenis?.stop(),
    onPointerUp: () => window.__lenis?.start(),
    onPointerCancel: () => window.__lenis?.start(),
    onTouchEnd: () => window.__lenis?.start(),
  };

  // ─── شريط التوزيع الملوّن فوق ───
  const stackWidth = (jd) => (total ? `${(jd / total) * 100}%` : '0%');

  const chan = (key) => channels.find((c) => c.key === key);
  const nameOf = (key) => chan(key)[isAr ? 'ar' : 'en'].name;

  // النتيجة اللي بتتقارن: عملاء الشهر السادس (بتوري الصورة الكاملة)
  const diff = yours.leads6 - mine.leads6;
  const verdict = diff > 5 ? 'win' : diff > -12 ? 'tie' : 'lose';

  return (
    <div className="bud">
      {/* ═══ الترويسة ═══ */}
      <div className="bud-head">
        <p className="bud-kicker">{t.kicker}</p>
        {compact ? <h2 className="bud-title">{t.title}</h2> : <h1 className="bud-title">{t.title}</h1>}
        <p className="bud-sub">{t.sub}</p>
      </div>

      {/* ═══ اختيار الميزانية ═══ */}
      <div className="bud-budget">
        <span className="bud-budget-label">{t.budgetLabel}</span>
        <div className="bud-chips">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className="bud-chip"
              aria-pressed={total === p}
              onClick={() => changeTotal(p)}
            >
              {fmt(p)} {t.dinar}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ شريط التوزيع ═══ */}
      <div className="bud-stack" aria-hidden="true">
        {channels.map((c) => (
          <div
            key={c.key}
            className="bud-stack-seg"
            style={{ width: stackWidth(alloc[c.key] || 0), background: c.color }}
          />
        ))}
        {/* لو ضل إشي مش موزّع (بالنادر، بس منغطّيه) بيبين مقلّم */}
        <div
          className="bud-stack-seg bud-stack-rest"
          style={{ width: stackWidth(Math.max(0, total - spent)) }}
        />
      </div>

      <p className="bud-remain">{t.zeroSum}</p>

      {/* ═══ السلايدرات + النتائج ═══ */}
      <div className="bud-grid">
        {/* ─── السلايدرات ─── */}
        <div className="bud-sliders" {...holdScroll}>
          {channels.map((c) => {
            const jd = alloc[c.key] || 0;
            const pct = total ? Math.round((jd / total) * 100) : 0;
            const info = c[isAr ? 'ar' : 'en'];
            return (
              <div className="bud-row" key={c.key}>
                <div className="bud-row-top">
                  <span className="bud-name">
                    <span className="bud-dot" style={{ background: c.color }} />
                    {info.name}
                  </span>
                  <span className="bud-amount">
                    {fmt(jd)} {t.dinar} <span>· {pct}%</span>
                  </span>
                </div>
                <p className="bud-note">{info.note}</p>
                <input
                  className="bud-range"
                  style={{ '--c': c.color }}
                  type="range"
                  min="0"
                  max={total}
                  step={step}
                  value={jd}
                  aria-label={info.name}
                  aria-valuetext={`${fmt(jd)} ${t.dinar}`}
                  onChange={(e) => setChannel(c.key, Number(e.target.value))}
                />
              </div>
            );
          })}
        </div>

        {/* ─── لوحة النتائج ─── */}
        <div className="bud-panel">
          <p className="bud-panel-title">{t.results}</p>

          <div className="bud-stats">
            <div>
              <p className="bud-stat-label">{t.statLeads}</p>
              <p className="bud-stat-value is-accent">{fmt(yours.leads1)}</p>
            </div>
            <div>
              <p className="bud-stat-label">{t.statCpl}</p>
              <p className="bud-stat-value">
                {yours.cpl ? yours.cpl.toFixed(1) : '—'}
                <span className="bud-stat-unit">{t.dinar}</span>
              </p>
            </div>
            <div>
              <p className="bud-stat-label">{t.statSix}</p>
              <p className="bud-stat-value">{fmt(yours.leads6)}</p>
            </div>
            {!compact && (
              <div>
                <p className="bud-stat-label">{t.statYear}</p>
                <p className="bud-stat-value">{fmt(yours.year)}</p>
              </div>
            )}
          </div>

          {/* ─── المضاعِفات (النسخة الكاملة بس) ─── */}
          {!compact && (
            <div className="bud-mults">
              {[
                { name: t.multFoundation, v: yours.foundation, max: 1.35 },
                { name: t.multTrust, v: yours.trust, max: 1.2 },
                { name: t.multMix, v: yours.mix, max: 1.2 },
              ].map((m) => (
                <div className="bud-mult" key={m.name}>
                  <span className="bud-mult-name">{m.name}</span>
                  <span className="bud-mult-bar">
                    <span
                      className={`bud-mult-fill ${m.v < 1 ? 'is-low' : ''}`}
                      style={{ width: `${Math.min(100, (m.v / m.max) * 100)}%` }}
                    />
                  </span>
                  <span className="bud-mult-val">×{m.v.toFixed(2)}</span>
                </div>
              ))}
              <p className="bud-note" style={{ marginBottom: 0, marginTop: 4 }}>
                {t.multHint}
              </p>
            </div>
          )}

          <div className="bud-actions">
            <button type="button" className="btn btn-primary" onClick={() => setRevealed((v) => !v)}>
              {revealed ? t.hide : t.compare}
            </button>
            <button
              type="button"
              className="bud-reset"
              onClick={() => {
                setAlloc(normalize(evenAllocation(total), total, null));
                setRevealed(false);
              }}
            >
              {t.reset}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ المقارنة ═══ */}
      {revealed && (
        <div className="bud-compare">
          <h3 className="bud-compare-title">{t.compareTitle}</h3>
          <p className="bud-compare-sub">
            {verdict === 'win' ? t.compareWin : verdict === 'tie' ? t.compareTie : t.compareLose}
          </p>

          {/* شريطين: توزيعك وتوزيعي */}
          <div className="bud-versus">
            {[
              { label: t.yours, a: alloc, r: yours, mineRow: false },
              { label: t.mine, a: myAllocation(total), r: mine, mineRow: true },
            ].map((row) => (
              <div className="bud-vs-row" key={row.label}>
                <span className={`bud-vs-name ${row.mineRow ? 'is-mine' : ''}`}>{row.label}</span>
                <span className="bud-stack" style={{ marginBottom: 0 }} aria-hidden="true">
                  {channels.map((c) => (
                    <span
                      key={c.key}
                      className="bud-stack-seg"
                      style={{ width: stackWidth(row.a[c.key] || 0), background: c.color }}
                    />
                  ))}
                </span>
                <span className="bud-vs-score">
                  {fmt(row.r.leads6)} {t.lead}
                </span>
              </div>
            ))}
          </div>

          {/* ملاحظات على توزيعك */}
          <div className="bud-notes">
            {notes.map((code) => {
              const [base, arg] = code.split(':');
              const n = t.notes[base];
              if (!n) return null;
              return (
                <div className="bud-note-card" key={code}>
                  <h4>{arg ? `${n.h}: ${nameOf(arg)}` : n.h}</h4>
                  <p>{n.p}</p>
                </div>
              );
            })}
          </div>

          <div className="bud-cta">
            <a className="btn btn-primary" href={contactHref}>
              {t.ctaBtn}
            </a>
            <span className="bud-note" style={{ marginBottom: 0 }}>
              {t.ctaText}
            </span>
          </div>
        </div>
      )}

      <p className="bud-disclaimer">{t.disclaimer}</p>

      {compact && (
        <a className="bud-more" href={moreHref}>
          {t.more}
        </a>
      )}
    </div>
  );
}
