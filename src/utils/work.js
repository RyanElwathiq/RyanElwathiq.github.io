// ═══════════════════════════════════════════════════════════════
//  منطق اختيار الأعمال — مكان واحد بيتحكم بكل الأقسام
//
//  ┌──────────── 🎛️ كيف تتحكم بشو يظهر بالهوم ────────────┐
//  │                                                          │
//  │  1) الترتيب: حقل  "order"  بملف work.json               │
//  │     الرقم الأصغر بيظهر أول. غيّر الأرقام تغيّر الترتيب.  │
//  │                                                          │
//  │  2) العدد: HOME_LIMIT تحت (الافتراضي 4)                 │
//  │     أول 4 أعمال من كل قسم بيظهروا بالصفحة الرئيسية       │
//  │     والباقي بينحطوا تلقائياً بصفحة القسم («المزيد»)      │
//  │                                                          │
//  │  3) تحكّم يدوي بمشروع معيّن: حقل  "home"  (اختياري)      │
//  │     "home": true   →  ثبّته بالهوم مهما كان ترتيبه       │
//  │     "home": false  →  لا تظهره بالهوم أبداً              │
//  │     ما حطيت الحقل  →  بيمشي على الترتيب والعدد عادي      │
//  │                                                          │
//  └──────────────────────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import work from '../data/work.json';

// كم عمل يظهر بالصفحة الرئيسية من كل قسم
export const HOME_LIMIT = 4;

// كل أعمال قسم معيّن، مرتبة حسب order
export function byCategory(category) {
  return work.projects
    .filter((p) => p.category === category)
    .sort((a, b) => a.order - b.order);
}

// الأعمال اللي بتظهر بالصفحة الرئيسية من قسم معيّن
export function forHome(category, limit = HOME_LIMIT) {
  const all = byCategory(category);

  // المثبّتة يدوياً ("home": true) بتيجي أول، وبتحجز مكانها
  const pinned = all.filter((p) => p.home === true);

  // الباقي: نستثني اللي مكتوب عليها "home": false
  const rest = all.filter((p) => p.home !== true && p.home !== false);

  return [...pinned, ...rest].slice(0, limit);
}

// هل في أعمال زيادة عن اللي ظاهر بالهوم؟
// (بنستخدمها عشان زر «المزيد» يظهر بس لما يكون في فعلاً مزيد)
export function hasMore(category, limit = HOME_LIMIT) {
  return byCategory(category).length > limit;
}

export const links = work.links;
