// واجهات المواقع المتخيلة — النسخة الإنجليزية (2026-08-05)
// نفس الهويات الثلاث بس LTR وإنجليزي بريطاني، لفيديو المواقع الإنجليزي.
// المخرجات: Promo-LP/assets/mock-{restaurant,clinic,store}-en.png
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'fs';

const OUT = 'D:/Ryan-Work/Brand-Ryan/Promo-LP/assets';
mkdirSync(OUT, { recursive: true });

const FONTS = {
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const W = 1560;
const H = 1000;

const frame = (url, body, bg) => `<!doctype html><html dir="ltr"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{width:${W}px;height:${H}px;font-family:'Alexandria',sans-serif;background:#101216;padding:0;overflow:hidden}
  h1{font-family:'Grotesk','Alexandria',sans-serif;letter-spacing:-0.5px}
  .chrome{height:52px;background:#1B1D22;display:flex;align-items:center;gap:18px;padding:0 22px;border-radius:18px 18px 0 0}
  .dots{display:flex;gap:7px}.dots i{width:11px;height:11px;border-radius:50%;display:block}
  .dots i:nth-child(1){background:#FF5F57}.dots i:nth-child(2){background:#FEBC2E}.dots i:nth-child(3){background:#28C840}
  .urlbar{flex:1;max-width:520px;margin-inline:auto;background:#0E0F12;color:#8A8F86;font-size:15px;
    padding:8px 18px;border-radius:999px;text-align:center}
  .site{height:${H - 52}px;background:${bg};overflow:hidden;position:relative}
</style></head><body>
  <div class="chrome"><div class="dots"><i></i><i></i><i></i></div><div class="urlbar">${url}</div><div style="width:33px"></div></div>
  <div class="site">${body}</div>
</body></html>`;

// ═══ ١) Zaytouna — مطعم ═══
const restaurant = frame(
  'zaytouna.jo',
  `<style>
    .z-nav{display:flex;justify-content:space-between;align-items:center;padding:26px 54px;color:#1E3A2A}
    .z-logo{font-size:26px;font-weight:800}.z-logo i{color:#D98E32;font-style:normal}
    .z-links{display:flex;gap:30px;font-size:16px;color:#4A5D50;font-weight:600}
    .z-hero{display:grid;grid-template-columns:1.1fr .9fr;align-items:center;padding:30px 54px 0;gap:40px}
    h1{font-size:56px;font-weight:700;color:#1E3A2A;line-height:1.25}
    .z-sub{font-size:19px;color:#4A5D50;margin-top:16px;line-height:1.7}
    .z-cta{display:inline-block;margin-top:28px;background:#1E3A2A;color:#F4F1E8;font-size:18px;font-weight:700;
      padding:16px 38px;border-radius:999px}
    .z-cta2{display:inline-block;margin-top:28px;margin-left:14px;color:#D98E32;font-size:18px;font-weight:700;
      padding:16px 10px}
    .dish{width:360px;height:360px;border-radius:50%;margin-inline:auto;position:relative;
      background:radial-gradient(circle at 35% 30%, #E8A94E, #D98E32 45%, #A8641C 90%);
      box-shadow:0 40px 80px rgba(30,58,42,.35), inset 0 -18px 40px rgba(120,60,10,.45)}
    .dish::before{content:'';position:absolute;inset:44px;border-radius:50%;
      background:radial-gradient(circle at 40% 35%, #FBF6EA, #F4F1E8 60%, #E4DCC8)}
    .dish::after{content:'Zaytouna';position:absolute;inset:0;display:grid;place-items:center;
      font-family:'Grotesk',sans-serif;font-size:38px;font-weight:700;color:#1E3A2A}
    .z-row{display:flex;gap:22px;padding:44px 54px 0}
    .z-card{flex:1;background:#fff;border-radius:20px;padding:22px 24px;box-shadow:0 14px 34px rgba(30,58,42,.10)}
    .z-card b{font-size:18px;color:#1E3A2A}.z-card p{font-size:15px;color:#7A8A7E;margin-top:6px}
    .z-card span{display:block;margin-top:10px;font-size:17px;font-weight:800;color:#D98E32}
  </style>
  <div class="z-nav"><div class="z-logo">Zaytouna <i>·</i></div>
    <div class="z-links"><span>Menu</span><span>Our story</span><span>Branches</span><span>Contact</span></div></div>
  <div class="z-hero">
    <div><h1>Home cooking,<br>restaurant standard.</h1>
      <p class="z-sub">Levantine dishes made fresh every day, and a seating you will not want to leave.</p>
      <span class="z-cta">Book a table</span><span class="z-cta2">Order online →</span></div>
    <div class="dish"></div>
  </div>
  <div class="z-row">
    <div class="z-card"><b>Levantine mezze</b><p>Hummus, moutabal, fried kibbeh</p><span>from JD 2.5</span></div>
    <div class="z-card"><b>Charcoal grills</b><p>Mixed grill over real charcoal</p><span>from JD 8</span></div>
    <div class="z-card"><b>House desserts</b><p>Fresh knafeh every hour</p><span>from JD 3</span></div>
  </div>`,
  'linear-gradient(180deg,#F4F1E8,#EFEAD9)',
);

// ═══ ٢) Noor Clinic — عيادة ═══
const clinic = frame(
  'noorclinic.jo',
  `<style>
    .n-nav{display:flex;justify-content:space-between;align-items:center;padding:26px 54px}
    .n-logo{font-size:24px;font-weight:800;color:#16303E;font-family:'Grotesk',sans-serif}.n-logo i{color:#2E86AB;font-style:normal}
    .n-links{display:flex;gap:28px;font-size:16px;color:#5E7684;font-weight:600}
    .n-hero{display:grid;grid-template-columns:1.05fr .95fr;align-items:center;padding:34px 54px 0;gap:44px}
    h1{font-size:52px;font-weight:700;color:#16303E;line-height:1.3}
    .n-sub{font-size:18px;color:#5E7684;margin-top:16px;line-height:1.7}
    .n-cta{display:inline-block;margin-top:26px;background:#2E86AB;color:#fff;font-size:18px;font-weight:700;
      padding:16px 40px;border-radius:14px;box-shadow:0 14px 30px rgba(46,134,171,.28)}
    .n-chips{display:flex;gap:12px;margin-top:26px}
    .n-chip{background:#fff;border:1.5px solid #D7E4EB;color:#16303E;font-size:14px;font-weight:600;
      padding:9px 18px;border-radius:999px}
    .n-panel{background:#fff;border-radius:24px;padding:30px;box-shadow:0 24px 60px rgba(22,48,62,.12)}
    .n-panel b{font-size:19px;color:#16303E}
    .n-field{margin-top:16px;background:#F0F5F8;border-radius:12px;padding:15px 18px;font-size:15px;color:#5E7684}
    .n-book{margin-top:18px;background:#16303E;color:#fff;text-align:center;font-size:16px;font-weight:700;
      padding:15px;border-radius:12px}
  </style>
  <div class="n-nav"><div class="n-logo">Noor Clinic <i>+</i></div>
    <div class="n-links"><span>Services</span><span>Doctors</span><span>Results</span><span>Book</span></div></div>
  <div class="n-hero">
    <div><h1>Your skin in safe hands,<br>results that speak for us.</h1>
      <p class="n-sub">Dermatology and aesthetics in Amman. A first consultation, a clear diagnosis, and a plan built for your case.</p>
      <span class="n-cta">Book your consultation</span>
      <div class="n-chips"><span class="n-chip">MoH licensed</span><span class="n-chip">12+ years</span><span class="n-chip">FDA devices</span></div></div>
    <div class="n-panel"><b>Book in under a minute</b>
      <div class="n-field">Full name</div>
      <div class="n-field">Phone number</div>
      <div class="n-field">Consultation type ▾</div>
      <div class="n-book">Confirm booking</div></div>
  </div>`,
  'linear-gradient(180deg,#F5F8FA,#EAF1F5)',
);

// ═══ ٣) Malameh — متجر ═══
const store = frame(
  'malameh.jo',
  `<style>
    .m-nav{display:flex;justify-content:space-between;align-items:center;padding:26px 54px;color:#F2F2F0}
    .m-logo{font-size:25px;font-weight:800;font-family:'Grotesk',sans-serif}.m-logo i{color:#FF6B4A;font-style:normal}
    .m-links{display:flex;gap:28px;font-size:16px;color:#9EA09A;font-weight:600}
    .m-cart{background:#FF6B4A;color:#111113;font-size:15px;font-weight:800;padding:10px 22px;border-radius:999px}
    .m-hero{padding:38px 54px 0;color:#F2F2F0}
    h1{font-size:54px;font-weight:700;line-height:1.25}
    h1 i{color:#FF6B4A;font-style:normal}
    .m-sub{font-size:18px;color:#9EA09A;margin-top:14px}
    .m-grid{display:flex;gap:24px;padding:38px 54px 0}
    .m-card{flex:1;border-radius:20px;overflow:hidden;background:#1A1A1D}
    .m-img{height:200px}
    .m-1 .m-img{background:linear-gradient(135deg,#2A2A2E,#3E3E44 60%,#FF6B4A22)}
    .m-2 .m-img{background:linear-gradient(135deg,#33302B,#4A443A 60%,#FF6B4A22)}
    .m-3 .m-img{background:linear-gradient(135deg,#26292E,#38414A 60%,#FF6B4A22)}
    .m-info{padding:16px 20px;color:#F2F2F0}
    .m-info b{font-size:16px}.m-info p{font-size:14px;color:#9EA09A;margin-top:4px}
    .m-price{display:flex;justify-content:space-between;align-items:center;margin-top:12px}
    .m-price span{font-size:17px;font-weight:800;color:#FF6B4A}
    .m-add{background:#F2F2F0;color:#111113;font-size:13px;font-weight:800;padding:7px 16px;border-radius:999px}
  </style>
  <div class="m-nav"><div class="m-logo">Malameh <i>/</i></div>
    <div class="m-links"><span>New in</span><span>Men</span><span>Women</span><span>Sale</span></div>
    <span class="m-cart">Cart · 2</span></div>
  <div class="m-hero"><h1>Your style, delivered <i>in 48 hours</i><br>anywhere in Jordan.</h1>
    <p class="m-sub">A hand-picked collection, free returns within 14 days, cash on delivery.</p></div>
  <div class="m-grid">
    <div class="m-card m-1"><div class="m-img"></div><div class="m-info"><b>Oversized jacket</b><p>Heavy cotton, 4 colours</p>
      <div class="m-price"><span>JD 24</span><span class="m-add">Add to cart</span></div></div></div>
    <div class="m-card m-2"><div class="m-img"></div><div class="m-info"><b>Everyday sneaker</b><p>Light and easy to walk in</p>
      <div class="m-price"><span>JD 32</span><span class="m-add">Add to cart</span></div></div></div>
    <div class="m-card m-3"><div class="m-img"></div><div class="m-info"><b>Crossbody bag</b><p>Water-resistant faux leather</p>
      <div class="m-price"><span>JD 18</span><span class="m-add">Add to cart</span></div></div></div>
  </div>`,
  '#111113',
);

const MOCKS = [
  ['mock-restaurant-en', restaurant],
  ['mock-clinic-en', clinic],
  ['mock-store-en', store],
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
