// ═══════════════════════════════════════════════════════════════
//  محرّك «حاسبة الخسارة»
//
//  ما فيه ولا رقم بهذا الملف — كل الأرقام بـ src/data/loss.js
//
//  📖 المعادلة بالكلام:
//    إذا بتخسر 40% من العملاء المحتملين وإنت بدون موقع، فالـ 20
//    عميل اللي بيجوك هم الـ 60% الباقية. يعني المحتمل الكلي 33،
//    والضايع 13 عميل بالشهر. اضربهم بربحك من العميل = خسارتك.
//
//  ⚠️ ليش منحسبها هيك مش «×40% من عملائك»؟ لأن الـ 40% نسبة من
//     **المحتمل**، مش من الواصل. والفرق كبير: 20×0.4 = 8 عملاء،
//     بينما الحساب الصح 13. الطريقة الغلط بتقلّل الرقم الحقيقي.
// ═══════════════════════════════════════════════════════════════
import { industries, reasons, siteStates, SITE_COST } from '../data/loss.js';

const find = (list, key) => list.find((x) => x.key === key) || list[0];

/**
 * @param {object} input { industry, site, profit, clients }
 */
export function calcLoss({ industry, site, profit, clients }) {
  const ind = find(industries, industry);
  const st = find(siteStates, site);

  // نسبة الضياع الفعلية بعد ما نحسب وضع موقعك الحالي
  const miss = Math.min(0.85, ind.missRate * st.factor);

  // العملاء المحتملين الكليين، والضايع منهم
  const reached = Math.max(0, clients);
  const potential = miss < 1 ? reached / (1 - miss) : reached;
  const lostClients = Math.max(0, potential - reached);

  const monthly = lostClients * Math.max(0, profit);
  const yearly = monthly * 12;
  const threeYears = yearly * 3;

  // توزيع الخسارة على أسبابها
  const breakdown = reasons.map((r) => ({
    key: r.key,
    share: r.share,
    clients: lostClients * r.share,
    money: monthly * r.share,
  }));

  // بعد قديش بيرجّع الموقع تكلفته
  const payback = monthly > 0 ? SITE_COST / monthly : null;

  return {
    missPct: miss * 100,
    potential,
    lostClients,
    monthly,
    yearly,
    threeYears,
    breakdown,
    payback, // بالشهور
    siteCost: SITE_COST,
  };
}
