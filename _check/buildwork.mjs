// بناء work.json من المعرض الحقيقي + فيديوهات يوتيوب
import fs from 'node:fs';

const W = 'D:/Ryan-Portfolio/site/src/data/work.json';
const work = JSON.parse(fs.readFileSync(W, 'utf8'));
const man = JSON.parse(fs.readFileSync('D:/Ryan-Portfolio/site/public/assets/work/manifest.json', 'utf8'));

// معرّفات يوتيوب حسب المشروع
const YT = {
  'dr-samir': ['UZiQXVxdAeU', 'gXRKerCFP2Y', 'METlVFy_yTg', '_SgZhLCRjzs'],
  arkan: ['65eGhthqMEY', 'eNZt72crddc', '2TLCAcTy55E'],
  orient: ['1OMyXBxrTQA'],
  'the-place': ['nuJWgPMmqG0'],
  'al-mofakron': ['b9vHzrtzllQ'],
  'al-razi': ['X_W7HjNdxjw'],
  knockout: ['XcHGVmU2s0Q', 'TsuV4VEjuVk', '1VOBWvisPgk', 'KoC5jMF3XII'],
};

// المشاريع الجديدة اللي لازم تنضاف
const NEW = [
  {
    id: 'fikra-nuqta', title: 'Fikra & Nuqta', titleAr: 'فكرة ونقطة',
    role: 'Creative Direction & Content Strategy', roleAr: 'إخراج إبداعي واستراتيجية محتوى',
    category: 'design', featured: true, order: 12, gal: 'fikra-nuqta',
    desc: 'Built a content-led direction for a marketing agency: composite imagery that stops the scroll, carrying ideas about how marketing actually works.',
    descAr: 'بنيت توجّهاً قائماً على المحتوى لوكالة تسويق: صور مركّبة توقف الزائر، وتحمل أفكاراً عن كيف يشتغل التسويق فعلاً.',
  },
  {
    id: 'the-corner', title: 'The Corner Salon', titleAr: 'صالون ذا كورنر',
    role: 'Visual Identity & Social Direction', roleAr: 'هوية بصرية وتوجّه سوشال',
    category: 'design', featured: false, order: 20, gal: 'the-corner',
    desc: 'Defined the visual language for a new salon: palette, art direction, and how services are presented across social.',
    descAr: 'حدّدت اللغة البصرية لصالون جديد: الألوان، التوجّه الفني، وطريقة عرض الخدمات على السوشال.',
  },
  {
    id: 'anfasak-oud', title: 'Anfasak Oud', titleAr: 'أنفاسك عود',
    role: 'Product Design', roleAr: 'تصميم منتج',
    category: 'design', featured: false, order: 21, gal: 'anfasak-oud',
    desc: 'Product visuals for a Kuwaiti perfume house — placing each bottle in a world that matches its scent.',
    descAr: 'تصاميم منتج لدار عطور كويتية — كل عبوة داخل عالم يوازي رائحتها.',
  },
  {
    id: 'stylomation', title: 'Stylomation', titleAr: 'ستايلوميشن',
    role: 'Logo & Brand System', roleAr: 'لوجو ونظام هوية',
    category: 'design', featured: false, order: 22, gal: 'stylomation',
    desc: 'Logo, identity, and a social system built to stay consistent as the brand grows.',
    descAr: 'لوجو وهوية ونظام سوشال مبني ليضل متناسقاً مع نمو العلامة.',
  },
  {
    id: 'the-place', title: 'The Place', titleAr: 'ذا بليس — المكان',
    role: 'Identity & Motion', roleAr: 'هوية وموشن',
    category: 'design', featured: false, order: 23, gal: 'the-place',
    desc: 'Identity and a logo intro for an architect and interior designer starting out.',
    descAr: 'هوية ومقدّمة لوجو لمهندس معماري ومصمم ديكور ببداياته.',
  },
  {
    id: 'dream-crests', title: 'Dream Crests', titleAr: 'دريم كرستس',
    role: 'Brand Identity & Content Plan', roleAr: 'هوية بصرية وخطة محتوى',
    category: 'design', featured: false, order: 24, gal: 'dream-crests',
    desc: 'Supervised the full visual identity for a real-estate developer: logo, social presence, ads, and a content plan for available units.',
    descAr: 'أشرفت على الهوية البصرية كاملة لمطوّر عقاري: اللوجو، الحضور الرقمي، الإعلانات، وخطة محتوى للشقق المتوفرة.',
  },
  {
    id: 'al-mofakron', title: 'Al-Mofakron Aluminium', titleAr: 'المفكرون للألمنيوم',
    role: 'Motion Graphics', roleAr: 'موشن جرافيك',
    category: 'video', featured: false, order: 25,
    desc: 'A short motion piece introducing the brand.', descAr: 'مقطع موشن قصير يعرّف بالعلامة.',
  },
  {
    id: 'al-razi', title: 'Al-Razi Library', titleAr: 'مكتبة الرازي',
    role: 'Motion Graphics', roleAr: 'موشن جرافيك',
    category: 'video', featured: false, order: 26,
    desc: 'Product cards that flip through the catalogue, built for Instagram.',
    descAr: 'كروت منتجات تتقلّب لتعرض الكتالوج، مبنية لإنستغرام.',
  },
  {
    id: 'knockout', title: 'Knockout Media', titleAr: 'نوك أوت ميديا',
    role: 'Motion & Design', roleAr: 'موشن وتصميم',
    category: 'video', featured: false, order: 27, gal: 'knockout',
    desc: 'Motion graphics and content for an early-stage media startup.',
    descAr: 'موشن جرافيك ومحتوى لشركة ميديا ناشئة.',
  },
];

const byId = Object.fromEntries(work.projects.map((p) => [p.id, p]));

// ─── ربط المعرض والفيديوهات بالمشاريع الموجودة ───
const GAL = { orient: 'orient-enam', 'dr-samir': 'dr-samir', arkan: 'arkan-al-anan' };
for (const [pid, slug] of Object.entries(GAL)) {
  if (byId[pid] && man[slug]) byId[pid].gallery = man[slug].map((x) => x.file);
}

// ─── إضافة المشاريع الجديدة ───
for (const n of NEW) {
  if (byId[n.id]) continue;
  const { gal, ...rest } = n;
  const proj = {
    ...rest,
    youtube: '',
    preview: '',
    cover: man[gal]?.[0]?.file || '/assets/logo-white.png',
    stats: [],
  };
  if (gal && man[gal]) proj.gallery = man[gal].map((x) => x.file);
  work.projects.push(proj);
  byId[n.id] = proj;
}

// ─── الفيديوهات ───
for (const [pid, ids] of Object.entries(YT)) {
  if (!byId[pid]) continue;
  byId[pid].videos = ids;
  if (!byId[pid].youtube) byId[pid].youtube = ids[0];
}

// ─── أورينت: ترقية لمشروع مميّز بغلاف اللوجو الجديد ───
if (byId.orient) {
  byId.orient.featured = true;
  byId.orient.order = 1;
  byId.orient.title = 'Orient Enam Solar';
  byId.orient.titleAr = 'أورينت إنعام للطاقة الشمسية';
  byId.orient.role = 'Brand Rebuild & Content Campaign';
  byId.orient.roleAr = 'إعادة بناء هوية وحملة محتوى';
  byId.orient.cover = '/assets/clients/orient-h-white.png';
}

fs.writeFileSync(W, JSON.stringify(work, null, 2) + '\n', 'utf8');

console.log(`المشاريع: ${work.projects.length}\n`);
work.projects.forEach((p) =>
  console.log(
    '  ' + p.id.padEnd(15) + p.category.padEnd(10) +
      String(p.gallery?.length || 0).padStart(3) + ' صورة  ' +
      String(p.videos?.length || 0) + ' فيديو  ' + (p.featured ? '★' : '')
  )
);
