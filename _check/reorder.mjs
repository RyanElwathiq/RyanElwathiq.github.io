// ═══════════════════════════════════════════════════════════════
//  إعادة ترتيب الصفحة الرئيسية: مشكلة → تفكير → إثبات → قرار
//
//  ⚠️⚠️ ليش أعدنا الترتيب؟ ⚠️⚠️
//  الترتيب القديم كان بيفتح على **مخرجات الإنتاج**: فيديو،
//  تصاميم، مواقع. يعني الزائر أول إشي بيشوفه هو «هذا الشخص
//  بيعمل حاجات حلوة» — فبينحكم عليه كمنفّذ، وبينسعّر كمنفّذ.
//  وقوّة ريّان الحقيقية هي التفكير التسويقي مش الإنتاج.
//
//  الترتيب الجديد بيبني الحجّة بالترتيب الصح:
//   ١) المشكلة   — قدّيش عم تخسر؟ وليش تصميم بينجح وتصميم لأ؟
//   ٢) كيف بفكّر — مين أنا، مهاراتي، الميزانية، المختبر
//   ٣) الإثبات   — قصص النمو بأرقامها، وبعدها كل الشغل
//   ٤) القرار    — كيف بشتغل، الأسئلة، ابدأ، تواصل
//
//  يعني لما يوصل الزائر لأعمالي، بيكون عارف إنه فيه مشكلة
//  وعارف كيف بفكّر — فبيقرأ الشغل كدليل، مش كمعرض.
//
//  ⚠️ الزائر اللي بدّه الشغل فوراً ما تأذّى: زر الهيرو «شوف
//     أعمالي» وشريط الإشارة والقائمة كلهم بيوصّلوه بضغطة.
//
//  التشغيل: node _check/reorder.mjs
// ═══════════════════════════════════════════════════════════════
import fs from 'node:fs';

// الترتيب الجديد — الأقسام بأسمائها زي ما هي مكتوبة بالصفحة
const ORDER = [
  'Hero',
  'Stats',
  // ─── ١) المشكلة ───
  'LossSection',
  'BrandEyeSection',
  // ─── ٢) كيف بفكّر ───
  'About',
  'Skills',
  'KnotSection',
  'BudgetSection',
  'LampLab',
  // ─── ٣) الإثبات ───
  'CaseRows',
  'WorkStrip',
  'DesignsGrid',
  'Websites',
  'Lab',
  'Signals',
  'Education',
  // ─── ٤) القرار ───
  'Pricing',
  'Faq',
  'BriefSection',
  'Contact',
  'Particles',
];

// تعليق بيتحط قبل كل مرحلة
const BANNERS = {
  LossSection: [
    '    <!-- ══════════════ ١) المشكلة ══════════════',
    '         الزائر لازم يعرف إنه عنده مشكلة قبل ما نعرض عليه حل.',
    '         «قدّيش عم تخسر» بتحوّل الغياب لرقم، و«عين البراند»',
    '         بتخلّيه يجرّب بعينه ليش تصميم بينجح وتصميم لأ. -->',
  ],
  About: [
    '    <!-- ══════════════ ٢) كيف بفكّر ══════════════',
    '         مين أنا، وشو بعرف، وكيف بفكّر بالميزانية وبالأفكار.',
    '         هون بينبني السبب اللي بيخلّي الشغل الجاي مقنع. -->',
  ],
  CaseRows: [
    '    <!-- ══════════════ ٣) الإثبات ══════════════',
    '         قصص النمو أول — لأنها الوحيدة اللي فيها أرقام.',
    '         وبعدها الشغل كله، وبالآخر التجارب اللي بتبيّن المسار. -->',
  ],
  Pricing: [
    '    <!-- ══════════════ ٤) القرار ══════════════',
    '         بعد ما شاف المشكلة والتفكير والإثبات: كيف بشتغل،',
    '         وشو أسئلته، وكيف يبدأ.',
    '         ⚠️ قاعدة ثابتة: الأسئلة الشائعة دايماً قبل التواصل. -->',
  ],
};

for (const [file, lang] of [
  ['D:/Ryan-Portfolio/site/src/pages/index.astro', 'en'],
  ['D:/Ryan-Portfolio/site/src/pages/ar/index.astro', 'ar'],
]) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);

  const mainStart = lines.findIndex((l) => l.includes('<main id="top"'));
  const mainEnd = lines.findIndex((l, i) => i > mainStart && l.trim() === '</main>');
  if (mainStart < 0 || mainEnd < 0) throw new Error('ما لقيت <main> بـ ' + file);

  const body = lines.slice(mainStart + 1, mainEnd);

  // ─── نجمع كل قسم مع تعليقاته اللي قبله ───
  const blocks = [];
  let pending = [];
  for (const line of body) {
    const t = line.trim();
    if (!t) continue;
    // تعليق؟ منخزّنه لحد ما يجي القسم اللي بيتبعه
    if (t.startsWith('<!--') || (pending.length && !t.startsWith('<'))) {
      pending.push(line);
      continue;
    }
    if (pending.length && !t.startsWith('<')) {
      pending.push(line);
      continue;
    }
    const m = t.match(/^<([A-Z][A-Za-z]*)/);
    if (m) {
      blocks.push({ name: m[1], lines: [...pending, line] });
      pending = [];
    } else {
      // سطر تكملة لقسم متعدّد الأسطر
      if (blocks.length) blocks[blocks.length - 1].lines.push(line);
      else pending.push(line);
    }
  }

  // ─── نرتّب ───
  const found = blocks.map((b) => b.name);
  const missing = ORDER.filter((n) => !found.includes(n));
  const extra = found.filter((n) => !ORDER.includes(n));
  if (missing.length || extra.length) {
    throw new Error(
      `عدم تطابق بـ ${file}\n  ناقص من الصفحة: ${missing.join(', ') || '—'}\n  زايد مش بالترتيب: ${extra.join(', ') || '—'}`
    );
  }

  const out = [];
  for (const name of ORDER) {
    if (BANNERS[name]) out.push('', ...BANNERS[name]);
    const b = blocks.find((x) => x.name === name);
    // ⚠️ منشيل التعليقات القديمة اللي بتحكي عن الترتيب القديم
    const kept = b.lines.filter(
      (l) => !/عن قصد|قبل الأسعار|بعد قائمة المهارات|قبل اللعبة/.test(l)
    );
    out.push(...kept);
  }

  const next = [...lines.slice(0, mainStart + 1), ...out, ...lines.slice(mainEnd)].join('\n');
  fs.writeFileSync(file, next, 'utf8');
  console.log(`✓ ${lang}: ${ORDER.length} قسم انترتّبوا`);
}
