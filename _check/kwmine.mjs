// ═══════════════════════════════════════════════════════════════
//  منقّب الكلمات (2026-08-05) — اقتراحات بحث جوجل الحية للأردن
//
//  بيسحب الاقتراحات الحقيقية (اللي بتظهر وأنت بتكتب) لكل بذرة
//  وبذرة+حرف وبذرة+سؤال — هاي طلبات ناس حقيقيين، بتعطينا
//  long tail وpain points ما منتخيلها من راسنا.
//  الأرقام (حجم/منافسة/سعر) بتيجي بعدها من Keyword Planner.
//
//  التشغيل: node _check/kwmine.mjs
//  المخرج: Promo-LP/../Outreach/كلمات-خام.json + عرض ملخص
// ═══════════════════════════════════════════════════════════════
import { writeFileSync } from 'fs';

const SEEDS = [
  // مواقع (المجموعة ١)
  'تصميم موقع الكتروني',
  'انشاء موقع الكتروني',
  'تصميم متجر الكتروني',
  'برمجة مواقع',
  'عمل موقع الكتروني',
  'سعر تصميم موقع',
  'شركة تصميم مواقع',
  // تسويق عام (المجموعة ٢)
  'شركة تسويق الكتروني',
  'تسويق رقمي',
  'خدمات تسويق',
  'مسوق الكتروني',
  'ادارة سوشال ميديا',
  'خطة تسويقية',
  // إعلانات (المجموعة ٣)
  'اعلانات ممولة',
  'ادارة اعلانات',
  'اعلانات انستقرام',
  'اعلانات جوجل',
  'اعلان فيسبوك',
  // pain points
  'ليش ما في مبيعات',
  'الاعلان ما بيبيع',
  'زيادة مبيعات',
  'مشروعي ما بيبيع',
  'كيف ازيد زباين',
];

const EXPANDERS = ['', ' الاردن', ' عمان', ' كم', ' سعر', ' افضل'];

const all = new Map();

async function suggest(q) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=ar&gl=jo&q=${encodeURIComponent(q)}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j?.[1]) ? j[1] : [];
  } catch {
    return [];
  }
}

let done = 0;
for (const seed of SEEDS) {
  for (const ex of EXPANDERS) {
    const q = seed + ex;
    const res = await suggest(q);
    for (const s of res) {
      if (!all.has(s)) all.set(s, q);
    }
    done++;
    if (done % 20 === 0) process.stdout.write('·');
    await new Promise((r) => setTimeout(r, 350));
  }
}

const list = [...all.keys()];
writeFileSync('D:/Ryan-Work/Brand-Ryan/Outreach/كلمات-خام.json', JSON.stringify({ pulled: new Date().toISOString().slice(0, 10), count: list.length, keywords: list }, null, 1), 'utf8');
console.log(`\n📦 ${list.length} عبارة حقيقية انسحبت`);
// عرض عينات مصنفة بدائياً
const jo = list.filter((k) => /الاردن|عمان|اربد|الزرقاء/.test(k));
const price = list.filter((k) => /سعر|كم|تكلفة|اسعار/.test(k));
const pain = list.filter((k) => /ليش|ما بي|كيف|مش عم/.test(k));
console.log('🇯🇴 جغرافية:', jo.length, '· 💰 سعرية:', price.length, '· 😖 pain:', pain.length);
console.log('\nعينات جغرافية:', jo.slice(0, 12).join(' | '));
console.log('\nعينات سعرية:', price.slice(0, 10).join(' | '));
console.log('\nعينات pain:', pain.slice(0, 10).join(' | '));
