// ═══════════════════════════════════════════════════════════════
//  محرّك توليد الأفكار
//
//  بياخد إجابات الزائر (المجال + الهدف) وبيركّب منها فكرة محتوى
//  مخصصة: خطاف + شكل + زاوية + إثبات + خاتمة.
//
//  ⚠️ هاي المرحلة الأولى: توليد محلي بالكامل (بدون إنترنت، بدون
//     تكلفة، وما بيفشل أبداً). المرحلة الجاية: وصله بنموذج ذكاء
//     اصطناعي عبر Cloudflare Worker — والدالة generateIdea
//     بتضل نفسها، بس مصدر النص بيتغيّر.
//
//  ┌──────────── 🎛️ لوحة التحكم ────────────┐
//  │ AVOID_REPEAT : كم فكرة نتذكرها عشان     │
//  │                ما نكررها بنفس الجلسة    │
//  └─────────────────────────────────────────┘
// ═══════════════════════════════════════════════════════════════
import data from '../data/ideas.json';

const AVOID_REPEAT = 6;

// ذاكرة قصيرة: آخر الأفكار اللي طلعت، عشان ما تتكرر
const recent = [];

// اختيار عشوائي مع تجنّب آخر اختيار
function pick(arr, avoid) {
  if (!arr || !arr.length) return null;
  if (arr.length === 1) return arr[0];
  let choice;
  let guard = 0;
  do {
    choice = arr[Math.floor(Math.random() * arr.length)];
    guard++;
  } while (avoid && choice === avoid && guard < 8);
  return choice;
}

// تعبئة القوالب: {biz} {pain} {desire}
function fill(template, vars) {
  return template
    .replace(/\{biz\}/g, vars.biz)
    .replace(/\{pain\}/g, vars.pain)
    .replace(/\{desire\}/g, vars.desire);
}

/**
 * بيولّد فكرة محتوى
 * @param {object} answers  { industry, goal, biz }
 * @param {'ar'|'en'} lang
 */
export function generateIdea(answers, lang = 'ar') {
  const isAr = lang === 'ar';
  const ind = data.industries.find((i) => i.id === answers.industry) || data.industries[0];
  const goalId = answers.goal || 'awareness';

  const pain = pick(isAr ? ind.pains : ind.painsEn);
  const desire = pick(isAr ? ind.desires : ind.desiresEn);
  const proof = pick(isAr ? ind.proof : ind.proofEn);

  const bizName = (answers.biz || '').trim() || (isAr ? ind.labelAr : ind.label);

  const hookList = data.hooks[isAr ? goalId : goalId + 'En'] || data.hooks.awareness;
  const format = pick(data.formats[goalId] || data.formats.awareness);
  const angle = pick(data.angles);
  const closer = pick(data.closers);

  let hook = fill(pick(hookList), { biz: bizName, pain, desire });

  // ما نكرر نفس الخطاف بنفس الجلسة
  let guard = 0;
  while (recent.includes(hook) && guard < 10) {
    hook = fill(pick(hookList), { biz: bizName, pain, desire });
    guard++;
  }
  recent.push(hook);
  if (recent.length > AVOID_REPEAT) recent.shift();

  return {
    hook,
    format: isAr ? format.labelAr : format.label,
    angle: isAr ? angle.labelAr : angle.label,
    proof,
    closer: isAr ? closer.labelAr : closer.label,
    biz: bizName,
  };
}

export const industries = data.industries;
export const goals = data.goals;
