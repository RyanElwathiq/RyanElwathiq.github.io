// ═══════════════════════════════════════════════════════════════
//  محرّك «لعبة الميزانية» — الحسابات كلها هون
//
//  ما فيه ولا رقم بهذا الملف. كل الأرقام بـ src/data/budget.js
//  هذا الملف بس بيطبّق المعادلات عليها.
//
//  📖 المنطق باختصار:
//     1) منحنى الإشباع: كل دينار زيادة بنفس القناة بيرجّع أقل
//     2) مضاعف «الأساس»: بدون موقع، كل إعلاناتك بتخسر جزء منها
//     3) مضاعف «الثقة»: الهوية بتضاعف نتيجة كل القنوات
//     4) مضاعف «التكامل»: محدا بيشتري من أول لقاء
//     5) التراكم: في قنوات بتوقف لما توقف تدفع، وفي قنوات بتكبر
// ═══════════════════════════════════════════════════════════════
import {
  channels,
  FOUNDATION,
  TRUST,
  MIX,
  SEO_NEEDS_CONTENT,
  MARKET_SCALE,
  MY_MIX,
} from '../data/budget.js';

// ─── منحنى الإشباع ───
// أول دينار بيرجّع كامل، والدينار رقم 5000 بنفس القناة بيرجّع فتات.
// هاي معادلة الاستجابة الإعلانية المعروفة (exponential saturation).
const effective = (jd, saturation) => saturation * (1 - Math.exp(-jd / saturation));

// ─── منحنى المضاعِف (للأساس والثقة) ───
// بيبدأ من floor، وبيرتفع لـ floor+gain كل ما زاد الصرف
const curve = (jd, { floor, gain, scale }) => floor + gain * (1 - Math.exp(-jd / scale));

// كم بيكبر أثر القناة بالشهر رقم m (بيوصل لكامل التراكم بالشهر 6)
const growth = (compound, month) => 1 + (compound - 1) * (Math.min(month, 6) - 1) / 5;

/**
 * بتحسب نتيجة توزيع معيّن.
 * @param {object} alloc  مثال: { ads: 300, content: 250, web: 220, brand: 130, creators: 100 }
 * @returns النتيجة كاملة + تفصيل كل قناة
 */
export function simulate(alloc) {
  const webJd = alloc.web || 0;
  const brandJd = alloc.brand || 0;
  const contentJd = alloc.content || 0;
  const spent = channels.reduce((sum, c) => sum + (alloc[c.key] || 0), 0);

  // ─── المضاعِفات: بتتحسب مرة وحدة وبتنطبق على كل القنوات ───

  // 1) الأساس (من صرف الموقع)
  const foundation = curve(webJd, FOUNDATION);

  // 2) الثقة (من صرف الهوية)
  const trust = curve(brandJd, TRUST);

  // 3) التكامل (من عدد القنوات الفعّالة)
  const active = spent
    ? channels.filter((c) => ((alloc[c.key] || 0) / spent) * 100 >= MIX.activeShare).length
    : 0;
  const mix = MIX.floor + MIX.gain * (active / channels.length);

  // الـ SEO بيحتاج محتوى عشان يشتغل
  const seoFuel = curve(contentJd, SEO_NEEDS_CONTENT);

  // كل ما كبرت الميزانية، كبر السوق المتاح (فسقف الإشباع بيرتفع)
  const scale = Math.pow(Math.max(spent, 1) / 1000, MARKET_SCALE);

  let reach = 0;
  let leads1 = 0;
  let leads6 = 0;
  let year = 0;

  const perChannel = channels.map((c) => {
    const jd = alloc[c.key] || 0;

    const eff = effective(jd, c.saturation * scale);
    const r = eff * c.reachPerJd;

    // ⚠️ الموقع والهوية ما بينضربوش بمضاعف نفسهم — هُمّ المضاعف
    const boost = (c.key === 'web' || c.key === 'brand' ? trust : foundation * trust) * mix;

    // تراكم الموقع مرهون بالمحتوى، باقي القنوات تراكمها ثابت
    const compound = c.key === 'web' ? 1 + (c.compound - 1) * seoFuel : c.compound;

    const base = r * c.leadRate * boost;
    const l6 = base * compound;

    // مجموع السنة: بنجمع كل شهر لحاله لأن التراكم بيكبر مع الوقت
    let l12 = 0;
    for (let m = 1; m <= 12; m++) l12 += base * growth(compound, m);

    reach += r;
    leads1 += base;
    leads6 += l6;
    year += l12;

    return { key: c.key, jd, reach: r, leads1: base, leads6: l6, color: c.color };
  });

  return {
    spent,
    reach: Math.round(reach),
    leads1: Math.round(leads1),
    leads6: Math.round(leads6),
    year: Math.round(year),
    // تكلفة العميل المحتمل = المصروف ÷ العملاء (بالشهر الأول)
    cpl: leads1 > 0 ? spent / leads1 : 0,
    foundation,
    trust,
    mix,
    active,
    perChannel,
  };
}

/** بترجّع توزيعي أنا بالدينار حسب الميزانية الكلية */
export function myAllocation(total) {
  const out = {};
  channels.forEach((c) => {
    out[c.key] = Math.round((total * (MY_MIX[c.key] || 0)) / 100);
  });
  return out;
}

/** توزيع البداية: الميزانية كلها موزّعة بالتساوي على القنوات الخمس */
export function evenAllocation(total) {
  const out = {};
  const each = Math.round(total / channels.length);
  channels.forEach((c) => (out[c.key] = each));
  return out;
}

/**
 * بتقرأ توزيع الزائر وبترجّع أهم 3 ملاحظات عليه (كأكواد بس —
 * النصوص نفسها موجودة بالمكوّن عشان تكون سهلة التعديل).
 */
export function diagnose(alloc, total) {
  if (!total) return [];
  const share = (k) => ((alloc[k] || 0) / total) * 100;
  const notes = [];

  if (share('web') < 8) notes.push('noWeb');
  if (share('brand') < 5) notes.push('noBrand');

  const biggest = channels.reduce((a, b) => (share(a.key) > share(b.key) ? a : b));
  if (share(biggest.key) > 55) notes.push(`allIn:${biggest.key}`);

  if (share('creators') > 30) notes.push('creatorHeavy');
  if (share('ads') < 5) notes.push('noAds');
  if (share('content') < 8) notes.push('noContent');

  // قريب من توزيعي؟ ما في فرق أكبر من 10 نقاط بأي قناة
  const close = channels.every((c) => Math.abs(share(c.key) - (MY_MIX[c.key] || 0)) <= 10);
  if (close) notes.unshift('close');

  return notes.slice(0, 3);
}
