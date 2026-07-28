// دمج ملاحظات ريّان مع الفهرس، وتجميعها بمشاريع
import fs from 'node:fs';

const raw = fs.readFileSync('D:/Ryan-Portfolio/_inbox/labels.txt', 'utf8');
const cat = JSON.parse(fs.readFileSync('D:/Ryan-Portfolio/_inbox/catalog.json', 'utf8'));
const byId = Object.fromEntries(cat.map((x) => [x.id, x]));

// ─── قواعد التصنيف: أول تطابق بيفوز ───
const RULES = [
  { key: 'DROP', re: /احذف|ما تستخدم|مكرر لاورينت|احذفها/, client: '—' },
  { key: 'orient', re: /orient|اورينت/i, client: 'Orient Enam', kind: 'طاقة شمسية' },
  { key: 'samir', re: /سمير|القراع/i, client: 'د. سمير القراعين', kind: 'علامة شخصية طبية' },
  { key: 'fikra', re: /فكره ونقطه|فكرة ونقطة/, client: 'فكرة ونقطة', kind: 'وكالة تسويق' },
  { key: 'anfasak', re: /خلطات الكويت|انفاسك|حتال/, client: 'أنفاسك عود', kind: 'عطور' },
  { key: 'corner', re: /the corner/i, client: 'The Corner', kind: 'صالون' },
  { key: 'arkan', re: /اركان العنان|arkan/i, client: 'أركان العنان', kind: 'عقارات' },
  { key: 'knockout', re: /knockout/i, client: 'Knockout Media', kind: 'ميديا' },
  { key: 'stylo', re: /stylomation/i, client: 'Stylomation', kind: 'هوية' },
  { key: 'place', re: /the place|المكان/i, client: 'The Place', kind: 'عمارة وديكور' },
  { key: 'dream', re: /dream crests/i, client: 'Dream Crests', kind: 'عقارات' },
  { key: 'progress', re: /progress/i, client: 'Progress', kind: 'عقارات' },
  { key: 'lawyer', re: /خريجه|محاميه/, client: 'صور تخرّج (محامية)', kind: 'معالجة صور' },
  { key: 'elkay', re: /el-\s?kay|adjust|الغده الدرقيه/i, client: 'عيادات (ADjust / El-Kay)', kind: 'طبي' },
  { key: 'razi', re: /الرازي/, client: 'مكتبة الرازي', kind: 'متجر' },
  { key: 'mlr', re: /mlr spa|halem/i, client: 'سبا (MLR / Halem)', kind: 'تجريبي' },
  { key: 'tampa', re: /tampa/i, client: 'Tampa', kind: 'تجزئة' },
  { key: 'nada', re: /nada fayyad/i, client: 'Nada Fayyad', kind: 'أزياء' },
  { key: 'lab', re: /تجريبي|وهمي|عشوائي|صقل|تطوير مهارات|اجرب|ببداياتي|بداياتي/, client: 'مختبر شخصي', kind: 'تجارب' },
];

const items = [];
for (const line of raw.split('\n')) {
  const m = line.match(/^(IMG-\d{3}|VID-\d{3})\s*=\s*(.+)$/);
  if (!m) continue;
  const [, id, note] = m;
  const rule = RULES.find((r) => r.re.test(note)) || { key: 'other', client: 'غير مصنّف' };
  items.push({ id, note: note.trim(), group: rule.key, client: rule.client, kind: rule.kind || '', meta: byId[id] || null });
}

fs.writeFileSync('D:/Ryan-Portfolio/_inbox/labelled.json', JSON.stringify(items, null, 2), 'utf8');

// ─── التقرير ───
const g = {};
for (const it of items) (g[it.client] ||= []).push(it);
const rows = Object.entries(g).sort((a, b) => b[1].length - a[1].length);

console.log(`مصنّف: ${items.length} من ${cat.length}\n`);
console.log('العميل'.padEnd(26) + 'صور  فيديو  المجموع');
console.log('─'.repeat(52));
for (const [client, arr] of rows) {
  const im = arr.filter((x) => x.id.startsWith('IMG')).length;
  const vi = arr.length - im;
  console.log(client.padEnd(26) + String(im).padEnd(6) + String(vi).padEnd(7) + arr.length);
}
const drop = items.filter((x) => x.group === 'DROP').length;
console.log('─'.repeat(52));
console.log(`للحذف: ${drop} · للاستخدام: ${items.length - drop}`);
