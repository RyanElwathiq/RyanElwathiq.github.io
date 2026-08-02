// ═══════════════════════════════════════════════════════════════
//  تعليق مشروع مؤقتاً (مش حذف)
//
//  ريّان طلب يشيل `tango` لأنه ما لاقي شغلهم. بدل ما نمسح
//  البيانات ونعيد كتابتها لما يلاقيهم، منشيلها من الموقع
//  ومنحفظها بمجلد المشروع بصندوق الوارد — فلما تيجي الصور،
//  المدخل جاهز جنبها.
//
//    node _check/park.mjs <معرّف-المشروع>
//    node _check/park.mjs <معرّف> --restore   ← يرجّعه
// ═══════════════════════════════════════════════════════════════
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORK = join(ROOT, 'src/data/work.json');
const INBOX = 'D:/Ryan-Work/_SITE-INBOX/01-NEEDED';

const id = process.argv[2];
const RESTORE = process.argv.includes('--restore');
if (!id) {
  console.log('الاستعمال: node _check/park.mjs <معرّف-المشروع> [--restore]');
  process.exit(1);
}

const doc = JSON.parse(readFileSync(WORK, 'utf8'));
const parkDir = join(INBOX, id);
const parkFile = join(parkDir, '_محفوظ-من-الموقع.json');

if (RESTORE) {
  if (!existsSync(parkFile)) {
    console.log(`❌ ما في مدخل محفوظ لـ${id}`);
    process.exit(1);
  }
  const entry = JSON.parse(readFileSync(parkFile, 'utf8'));
  if (doc.projects.some((p) => p.id === id)) {
    console.log(`⚠️ ${id} موجود أصلاً بالموقع`);
    process.exit(0);
  }
  doc.projects.push(entry);
  doc.projects.sort((a, b) => (a.order || 99) - (b.order || 99));
  writeFileSync(WORK, JSON.stringify(doc, null, 2) + '\n', 'utf8');
  console.log(`✅ ${id} رجع للموقع. شغّل: node _check/covers.mjs ${id}`);
  process.exit(0);
}

const i = doc.projects.findIndex((p) => p.id === id);
if (i === -1) {
  console.log(`❌ ما لقيت مشروع اسمه ${id}`);
  process.exit(1);
}

const [entry] = doc.projects.splice(i, 1);
mkdirSync(parkDir, { recursive: true });
writeFileSync(parkFile, JSON.stringify(entry, null, 2) + '\n', 'utf8');
writeFileSync(WORK, JSON.stringify(doc, null, 2) + '\n', 'utf8');

// الأغلفة المولّدة بتنشال — بتترجع بأمر واحد لو رجع المشروع
let removed = 0;
for (const f of [`${id}.webp`, `${id}-wide.webp`, `${id}.png`, `${id}-wide.png`]) {
  const p = join(ROOT, 'public/assets/work/covers', f);
  if (existsSync(p)) {
    unlinkSync(p);
    removed++;
  }
}

console.log(`✅ ${id} انشال من الموقع (${doc.projects.length} مشروع باقي)`);
console.log(`   المدخل محفوظ: ${parkFile}`);
console.log(`   أغلفة مولّدة انشالت: ${removed}`);
console.log(`   للرجعة: node _check/park.mjs ${id} --restore`);
