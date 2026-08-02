// ═══════════════════════════════════════════════════════════════
//  جوردينا — شغل تجريبي بالتعاون مع المصمم عماد أرباش
//
//  ريّان: «تصاميم تجريبيه لشركه جوردينا فمكانهم اللاب لانهم مش
//  مشاريع حقيقيه» و«اتساوت بالتعاون مع المصمم عماد ارباش».
//
//  ⚠️ الكريدت مقصود ومطلوب: بيعزّز الثقة. وصياغته لازم تقول
//     **شو كان دور كل واحد** — مش «هذا شغل غيري».
//
//    node _check/jordina.mjs
// ═══════════════════════════════════════════════════════════════
import sharp from 'sharp';
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = 'D:/Ryan-Work/_SITE-INBOX/05-unsorted/من-المحادثة-الحالية';
const OUT = join(ROOT, 'public/assets/work/lab');
const LAB = join(ROOT, 'src/data/lab.json');
const WORK = join(ROOT, 'src/data/work.json');

// ─── الصور ───
const dirs = existsSync(SRC) ? readdirSync(SRC).filter((d) => d.startsWith('رسالة-')) : [];
mkdirSync(OUT, { recursive: true });

const shots = [];
let n = 1;
for (const d of dirs.sort()) {
  const files = readdirSync(join(SRC, d))
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();
  for (const f of files) {
    const name = `jordina-${String(n).padStart(2, '0')}.webp`;
    const md = await sharp(join(SRC, d, f)).metadata();
    let s = sharp(join(SRC, d, f));
    if (Math.max(md.width, md.height) > 1400) {
      s = s.resize(md.width >= md.height ? { width: 1400 } : { height: 1400 });
    }
    await s.webp({ quality: 86, effort: 6 }).toFile(join(OUT, name));
    console.log(
      `  ${name}  ${md.width}×${md.height}`.padEnd(30) +
        `${String(Math.round(statSync(join(OUT, name)).size / 1024)).padStart(4)}KB`,
    );
    shots.push(`/assets/work/lab/${name}`);
    n++;
  }
}

// ─── مجموعة المختبر ───
const lab = JSON.parse(readFileSync(LAB, 'utf8'));
const group = {
  label: 'Jordina. Spec work',
  labelAr: 'جوردينا، شغل تجريبي',
  phase: 'Today',
  phaseAr: 'اليوم',
  line: 'Key visuals for a carbonated pomegranate line. Product lighting, a splash that reads as taste rather than mess, and three takes on the same can — spec work, no brief and no client sign-off.',
  lineAr: 'مفاتيح بصرية لخط مشروب غازي بنكهة الرمّان. إضاءة منتج، ورشّة بتقرأ كطعم مش كفوضى، وثلاث معالجات لنفس العبوة — شغل تجريبي، بلا بريف وبلا اعتماد عميل.',
  credit: 'Produced in collaboration with designer Emad Arbash.',
  creditAr: 'أُنتجت بالتعاون مع المصمم عماد أرباش.',
  shots,
};

lab.tracks.lab = lab.tracks.lab.filter((g) => g.label !== group.label);
// بعد «وي للاتصالات» — الاثنين شغل تجريبي على علامة
const i = lab.tracks.lab.findIndex((g) => g.label === 'WE Telecom. Fictional');
lab.tracks.lab.splice(i === -1 ? lab.tracks.lab.length : i + 1, 0, group);
writeFileSync(LAB, JSON.stringify(lab, null, 2) + '\n', 'utf8');

// ─── كريدت أورينت ───
//  ريّان: «في صفحه اورينت كمان بعض من التصاميم كانت بالتعاون
//  معاه». فالصياغة بتقول «جزء من التصاميم» مش المشروع كله.
const work = JSON.parse(readFileSync(WORK, 'utf8'));
const orient = work.projects.find((p) => p.id === 'orient');
if (orient) {
  const out = {};
  for (const [k, v] of Object.entries(orient)) {
    out[k] = v;
    if (k === 'roleAr') {
      out.credit = 'Part of the design work was produced in collaboration with designer Emad Arbash.';
      out.creditAr = 'جزء من التصاميم أُنتج بالتعاون مع المصمم عماد أرباش.';
    }
  }
  work.projects[work.projects.indexOf(orient)] = out;
  writeFileSync(WORK, JSON.stringify(work, null, 2) + '\n', 'utf8');
  console.log('\n✅ كريدت أورينت انضاف');
}

console.log(`✅ مجموعة «${group.labelAr}» — ${shots.length} صور`);
console.log(`   ترتيب المختبر: ${lab.tracks.lab.map((g) => g.labelAr).join(' · ')}`);
