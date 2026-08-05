// ═══════════════════════════════════════════════════════════════
//  واجهات المواقع المتخيلة لفيديو ١ (2026-08-05)
//
//  ٣ مشاريع متخيلة بثلاث هويات مختلفة تماماً (قواعد anti-slop:
//  بلا بنفسجي AI، بلا بيج+نحاسي، لكل واحد عائلة لونية خاصة).
//  بتظهر بالفيديو كتصور «هيك بيطلع موقعك» — مش شغل عملاء.
//
//  التشغيل: node _check/lpmocks.mjs
//  المخرجات: Promo-LP/assets/mock-{restaurant,clinic,store}.png
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Promo-LP/assets';
mkdirSync(OUT, { recursive: true });

const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
};

const W = 1560;
const H = 1000;

// إطار المتصفح المشترك — شريط غامق + نقاط + خانة عنوان
const frame = (url, body, bg) => `<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900;unicode-range:U+0000-00FF}
  *{margin:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;font-family:'Alexandria',sans-serif;background:#101216;padding:0;overflow:hidden}
  .chrome{height:52px;background:#1B1D22;display:flex;align-items:center;gap:18px;padding:0 22px;border-radius:18px 18px 0 0}
  .dots{display:flex;gap:7px}.dots i{width:11px;height:11px;border-radius:50%;display:block}
  .dots i:nth-child(1){background:#FF5F57}.dots i:nth-child(2){background:#FEBC2E}.dots i:nth-child(3){background:#28C840}
  .urlbar{flex:1;max-width:520px;margin-inline:auto;background:#0E0F12;color:#8A8F86;font-size:15px;
    padding:8px 18px;border-radius:999px;direction:ltr;text-align:center;font-family:'Alexandria',monospace}
  .site{height:${H - 52}px;background:${bg};overflow:hidden;position:relative}
</style></head><body>
  <div class="chrome"><div class="dots"><i></i><i></i><i></i></div><div class="urlbar">${url}</div><div style="width:33px"></div></div>
  <div class="site">${body}</div>
</body></html>`;

// ═══ ١) مطعم «زيتونة» — دافي: أخضر غامق + عظمي + عنبري ═══
const restaurant = frame(
  'zaytouna.jo',
  `<style>
    .z-nav{display:flex;justify-content:space-between;align-items:center;padding:26px 54px;color:#1E3A2A}
    .z-logo{font-size:26px;font-weight:800}.z-logo i{color:#D98E32;font-style:normal}
    .z-links{display:flex;gap:30px;font-size:16px;color:#4A5D50;font-weight:600}
    .z-hero{display:grid;grid-template-columns:1.1fr .9fr;align-items:center;padding:30px 54px 0;gap:40px}
    h1{font-size:58px;font-weight:800;color:#1E3A2A;line-height:1.3}
    .z-sub{font-size:20px;color:#4A5D50;margin-top:16px;line-height:1.8}
    .z-cta{display:inline-block;margin-top:28px;background:#1E3A2A;color:#F4F1E8;font-size:19px;font-weight:700;
      padding:16px 38px;border-radius:999px}
    .z-cta2{display:inline-block;margin-top:28px;margin-right:14px;color:#D98E32;font-size:19px;font-weight:700;
      padding:16px 10px}
    .dish{width:360px;height:360px;border-radius:50%;margin-inline:auto;position:relative;
      background:radial-gradient(circle at 35% 30%, #E8A94E, #D98E32 45%, #A8641C 90%);
      box-shadow:0 40px 80px rgba(30,58,42,.35), inset 0 -18px 40px rgba(120,60,10,.45)}
    .dish::before{content:'';position:absolute;inset:44px;border-radius:50%;
      background:radial-gradient(circle at 40% 35%, #FBF6EA, #F4F1E8 60%, #E4DCC8)}
    .dish::after{content:'زيتونة';position:absolute;inset:0;display:grid;place-items:center;
      font-size:40px;font-weight:800;color:#1E3A2A}
    .z-row{display:flex;gap:22px;padding:44px 54px 0}
    .z-card{flex:1;background:#fff;border-radius:20px;padding:22px 24px;box-shadow:0 14px 34px rgba(30,58,42,.10)}
    .z-card b{font-size:19px;color:#1E3A2A}.z-card p{font-size:15px;color:#7A8A7E;margin-top:6px}
    .z-card span{display:block;margin-top:10px;font-size:18px;font-weight:800;color:#D98E32}
  </style>
  <div class="z-nav"><div class="z-logo">زيتونة <i>·</i></div>
    <div class="z-links"><span>المنيو</span><span>قصتنا</span><span>الفروع</span><span>تواصل</span></div></div>
  <div class="z-hero">
    <div><h1>طعم البيت،<br>بمستوى مطعم.</h1>
      <p class="z-sub">مأكولات شامية بمكونات يومية طازة، وجلسة بتنسيك إنك برا البيت.</p>
      <span class="z-cta">احجز طاولة</span><span class="z-cta2">اطلب أونلاين ←</span></div>
    <div class="dish"></div>
  </div>
  <div class="z-row">
    <div class="z-card"><b>مقبلات شامية</b><p>حمص، متبل، كبة مقلية</p><span>من ٢.٥ د.أ</span></div>
    <div class="z-card"><b>مشاوي الفحم</b><p>مشكل مشاوي على الفحم البلدي</p><span>من ٨ د.أ</span></div>
    <div class="z-card"><b>حلويات البيت</b><p>كنافة نابلسية طازة كل ساعة</p><span>من ٣ د.أ</span></div>
  </div>`,
  'linear-gradient(180deg,#F4F1E8,#EFEAD9)',
);

// ═══ ٢) عيادة «نور» — بارد نظيف: أزرق ثلجي + أبيض ═══
const clinic = frame(
  'noorclinic.jo',
  `<style>
    .n-nav{display:flex;justify-content:space-between;align-items:center;padding:26px 54px}
    .n-logo{font-size:25px;font-weight:800;color:#16303E}.n-logo i{color:#2E86AB;font-style:normal}
    .n-links{display:flex;gap:28px;font-size:16px;color:#5E7684;font-weight:600}
    .n-hero{display:grid;grid-template-columns:1.05fr .95fr;align-items:center;padding:34px 54px 0;gap:44px}
    h1{font-size:56px;font-weight:800;color:#16303E;line-height:1.35}
    .n-sub{font-size:19px;color:#5E7684;margin-top:16px;line-height:1.8}
    .n-cta{display:inline-block;margin-top:26px;background:#2E86AB;color:#fff;font-size:19px;font-weight:700;
      padding:16px 40px;border-radius:14px;box-shadow:0 14px 30px rgba(46,134,171,.28)}
    .n-chips{display:flex;gap:12px;margin-top:26px}
    .n-chip{background:#fff;border:1.5px solid #D7E4EB;color:#16303E;font-size:14px;font-weight:600;
      padding:9px 18px;border-radius:999px}
    .n-panel{background:#fff;border-radius:24px;padding:30px;box-shadow:0 24px 60px rgba(22,48,62,.12)}
    .n-panel b{font-size:20px;color:#16303E}
    .n-field{margin-top:16px;background:#F0F5F8;border-radius:12px;padding:15px 18px;font-size:15px;color:#5E7684}
    .n-book{margin-top:18px;background:#16303E;color:#fff;text-align:center;font-size:17px;font-weight:700;
      padding:15px;border-radius:12px}
  </style>
  <div class="n-nav"><div class="n-logo">عيادة نور <i>+</i></div>
    <div class="n-links"><span>خدماتنا</span><span>الأطباء</span><span>النتائج</span><span>احجز</span></div></div>
  <div class="n-hero">
    <div><h1>بشرتك بإيد أمينة،<br>ونتيجتها بتحكي عنا.</h1>
      <p class="n-sub">عيادة جلدية وتجميل بعمّان. استشارة أولى، تشخيص واضح، وخطة علاج على قد حالتك.</p>
      <span class="n-cta">احجزي استشارتك</span>
      <div class="n-chips"><span class="n-chip">ترخيص وزارة الصحة</span><span class="n-chip">+١٢ سنة خبرة</span><span class="n-chip">أجهزة FDA</span></div></div>
    <div class="n-panel"><b>احجزي موعدك خلال دقيقة</b>
      <div class="n-field">الاسم الكامل</div>
      <div class="n-field">رقم الهاتف</div>
      <div class="n-field">نوع الاستشارة ▾</div>
      <div class="n-book">تأكيد الحجز</div></div>
  </div>`,
  'linear-gradient(180deg,#F5F8FA,#EAF1F5)',
);

// ═══ ٣) متجر «ملامح» — جريء: أسود فحمي + مرجاني ═══
const store = frame(
  'malameh.jo',
  `<style>
    .m-nav{display:flex;justify-content:space-between;align-items:center;padding:26px 54px;color:#F2F2F0}
    .m-logo{font-size:26px;font-weight:800}.m-logo i{color:#FF6B4A;font-style:normal}
    .m-links{display:flex;gap:28px;font-size:16px;color:#9EA09A;font-weight:600}
    .m-cart{background:#FF6B4A;color:#111113;font-size:15px;font-weight:800;padding:10px 22px;border-radius:999px}
    .m-hero{padding:38px 54px 0;color:#F2F2F0}
    h1{font-size:60px;font-weight:800;line-height:1.25}
    h1 i{color:#FF6B4A;font-style:normal}
    .m-sub{font-size:19px;color:#9EA09A;margin-top:14px}
    .m-grid{display:flex;gap:24px;padding:38px 54px 0}
    .m-card{flex:1;border-radius:20px;overflow:hidden;background:#1A1A1D}
    .m-img{height:200px}
    .m-1 .m-img{background:linear-gradient(135deg,#2A2A2E,#3E3E44 60%,#FF6B4A22)}
    .m-2 .m-img{background:linear-gradient(135deg,#33302B,#4A443A 60%,#FF6B4A22)}
    .m-3 .m-img{background:linear-gradient(135deg,#26292E,#38414A 60%,#FF6B4A22)}
    .m-info{padding:16px 20px;color:#F2F2F0}
    .m-info b{font-size:17px}.m-info p{font-size:14px;color:#9EA09A;margin-top:4px}
    .m-price{display:flex;justify-content:space-between;align-items:center;margin-top:12px}
    .m-price span{font-size:18px;font-weight:800;color:#FF6B4A}
    .m-add{background:#F2F2F0;color:#111113;font-size:13px;font-weight:800;padding:7px 16px;border-radius:999px}
  </style>
  <div class="m-nav"><div class="m-logo">ملامح <i>/</i></div>
    <div class="m-links"><span>جديدنا</span><span>رجالي</span><span>نسائي</span><span>تخفيضات</span></div>
    <span class="m-cart">السلة · ٢</span></div>
  <div class="m-hero"><h1>ستايلك بيوصلك <i>خلال ٤٨ ساعة</i><br>لأي مكان بالأردن.</h1>
    <p class="m-sub">تشكيلة مختارة بعناية، إرجاع مجاني خلال ١٤ يوم، والدفع عند الاستلام.</p></div>
  <div class="m-grid">
    <div class="m-card m-1"><div class="m-img"></div><div class="m-info"><b>جاكيت أوفرسايز</b><p>قطن تقيل، ٤ ألوان</p>
      <div class="m-price"><span>٢٤ د.أ</span><span class="m-add">أضف للسلة</span></div></div></div>
    <div class="m-card m-2"><div class="m-img"></div><div class="m-info"><b>حذاء يومي</b><p>خفيف ومريح للمشي</p>
      <div class="m-price"><span>٣٢ د.أ</span><span class="m-add">أضف للسلة</span></div></div></div>
    <div class="m-card m-3"><div class="m-img"></div><div class="m-info"><b>شنتة كروس</b><p>جلد صناعي مقاوم</p>
      <div class="m-price"><span>١٨ د.أ</span><span class="m-add">أضف للسلة</span></div></div></div>
  </div>`,
  '#111113',
);

const MOCKS = [
  ['mock-restaurant', restaurant],
  ['mock-clinic', clinic],
  ['mock-store', store],
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');
for (const [name, html] of MOCKS) {
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('✅', name);
}
await browser.close();
