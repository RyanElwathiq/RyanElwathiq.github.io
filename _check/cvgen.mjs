// ═══════════════════════════════════════════════════════════════
//  مولد السيرة الذاتية v2.0 (2026-08-05) — إنجليزي، ATS-صديق
//
//  المبادئ (من سكيلات resume-ats-optimizer + bullet-writer):
//  - عمود واحد، بلا جداول/صور/هيدر-فوتر — نص حقيقي 100%
//  - عناوين أقسام قياسية بيعرفها كل ATS
//  - إنجازات بمعادلة X-Y-Z: النتيجة + القياس + الطريقة
//  - لمسات الهوية (ليموني + Grotesk) بس بلا ما تكسر القراءة الآلية
//
//  التشغيل: node _check/cvgen.mjs
//  المخرج: D:\Ryan-Work\Brand-Ryan\My cv's\Rayan_Al-Wathiq_CV_2026_2.0.pdf
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { readFileSync } from 'fs';

const OUT = "D:/Ryan-Work/Brand-Ryan/My cv's/Rayan_Al-Wathiq_CV_2026_2.0.pdf";
const ACCENT = '#D9FF3F';
const INK = '#16181D';
const MUTED = '#5C6058';

const FONTS = {
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-latin.woff2') format('woff2');font-weight:100 900}
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0;box-sizing:border-box}
  body{font-family:'Alexandria',Georgia,serif;color:${INK};font-size:9.9pt;line-height:1.46}
  .name{font-family:'Grotesk','Alexandria',sans-serif;font-size:24pt;font-weight:700;letter-spacing:.5px}
  .name-rule{width:64px;height:5px;background:${ACCENT};margin:6px 0 10px}
  .title{font-size:11.5pt;font-weight:600;color:${INK}}
  .contact{font-size:9.4pt;color:${MUTED};margin-top:5px}
  .contact b{color:${INK};font-weight:600}
  h2{font-family:'Grotesk','Alexandria',sans-serif;font-size:11.5pt;font-weight:700;letter-spacing:1.2px;
     text-transform:uppercase;margin:12px 0 6px;padding-right:10px;
     border-bottom:1.5px solid ${INK};padding-bottom:3px;position:relative}
  h2::before{content:'';display:inline-block;width:9px;height:9px;background:${ACCENT};margin-right:8px}
  .entry{break-inside:avoid;margin-bottom:7px}
  .role{font-size:10.6pt;font-weight:700}
  .role .when{font-weight:400;font-style:italic;color:${MUTED};font-size:9.4pt}
  .org{font-size:9.4pt;color:${MUTED};margin-bottom:2px}
  ul{padding-left:16px;margin-top:2px}
  li{margin-bottom:2px}
  li b{font-weight:700}
  .skills li{margin-bottom:2px}
  .note{font-size:8.6pt;font-style:italic;color:${MUTED};margin-top:12px;border-top:.5px solid #D8DAD2;padding-top:6px}
  a{color:${INK};text-decoration:none;border-bottom:1.5px solid ${ACCENT}}
</style></head><body>

<div class="name">RAYAN AL-WATHIQ BILLAH AL-ALI</div>
<div class="name-rule"></div>
<div class="title">Digital Marketing &amp; Growth Specialist — Full-Funnel Marketer</div>
<div class="contact">Amman, Jordan | Open to Remote / Hybrid | <b>ryan.elwathiq@gmail.com</b> | +962 778 492 690<br>
LinkedIn: linkedin.com/in/rayan-elwathiq | Portfolio: <b>ryanalali.me</b></div>

<h2>Professional Summary</h2>
<p>Full-funnel digital marketer who diagnoses before executing: I find out why a business isn't selling, then build the fix — strategy, paid campaigns, brand identity, and websites that sell. Hands-on experience with SEO, Meta Ads, CRM lead management, and end-to-end creative production across 7+ client engagements in the Jordanian and regional market. My method is public: <b>ryanalali.me</b>, a bilingual 132-page marketing platform I built solo, where every claim is a working tool visitors can test.</p>

<h2>Featured Project — ryanalali.me (2026)</h2>
<div class="entry"><ul>
<li>Designed, wrote, and shipped a bilingual (Arabic/English) <b>132-page marketing platform solo</b> — positioning, brand identity, UX, copywriting, SEO, and analytics — as a live, testable demonstration of full-funnel marketing method.</li>
<li>Turned marketing education into engagement with <b>7 interactive articles</b> (playable simulations of real marketing decisions) and <b>8 free tools</b> — ad-budget simulator, revenue-loss calculator, AI-powered idea lab — that convert visitors into qualified leads.</li>
<li>Automated the lead pipeline end to end: an on-site AI assistant plus a Telegram agent that triages inquiries, drafts replies, and sends a daily digest — with <b>every step measured in GA4</b> through custom events.</li>
<li>Passed a full technical SEO audit with <b>zero errors</b> across all pages; produced an 85-second brand film end-to-end, from storyboard and licensed music to a beat-synced final edit.</li>
</ul></div>

<h2>Professional Experience</h2>

<div class="entry">
<div class="role">Freelance Digital Marketing &amp; Creative Consultant <span class="when">| 2023 – Present</span></div>
<div class="org">Self-employed | Amman, Jordan | Project-based | Remote-ready — selected engagements below</div>
</div>

<div class="entry">
<div class="role">Dr. Samir Al-Qarain — Personal Medical Brand (Instagram) <span class="when">| Completed</span></div>
<ul>
<li>Grew a brand-new Instagram account <b>from 0 to 2,395 followers organically in 30 days</b> — zero ad spend — by building the full content system: brand guidelines, visual identity, video QA, and an editing pipeline from scratch.</li>
<li>Directed short-form video reaching <b>290K and 42.9K views</b> on single posts through strategic hook writing, pacing edits, and platform-native formatting; page averaged 250 new followers/week at peak (Insights).</li>
</ul></div>

<div class="entry">
<div class="role">LUVIT Skincare — Brand Launch, Turkish Label Entering Jordan <span class="when">| Active</span></div>
<ul>
<li>Leading end-to-end digital brand development: visual identity, e-commerce store, content strategy, and a phased organic growth plan across all online channels.</li>
<li>Integrated AI-assisted design tooling into the production workflow, <b>cutting design turnaround by ~40%</b> while maintaining brand consistency.</li>
</ul></div>

<div class="entry">
<div class="role">Al Asimah Travel &amp; Tourism — Marketing Support &amp; Training <span class="when">| Completed</span></div>
<ul>
<li>Trained account managers on Meta Ads end to end — objectives, targeting, budget setup, A/B testing — enabling the team's <b>first self-run paid campaign within the same week</b> of training.</li>
<li>Recovered compromised social accounts and implemented two-factor authentication and access-management protocols; advised on positioning and lead-generation content priorities.</li>
</ul></div>

<div class="entry">
<div class="role">UCMAS Kindergarten — Education Services <span class="when">| Completed</span></div>
<ul>
<li>Built a practical marketing system from the ground up — content pillars, monthly calendar, visual templates, brand guidelines — leaving the client a <b>self-sufficient, repeatable framework</b>.</li>
<li>Wrote WhatsApp and DM inquiry-handling scripts that standardised enrollment follow-up, targeting a response-time cut <b>from 24 hours to under 2</b>; mapped content topics to parent search intent.</li>
</ul></div>

<div class="entry">
<div class="role">Fekra w Nogta — Marketing Agency Collaboration <span class="when">| Completed</span></div>
<ul>
<li>Delivered creative assets and campaign concepts across <b>4+ client briefs</b> — statics, story formats, copywriting — while restructuring the internal production workflow to cut brief-to-delivery time.</li>
</ul></div>

<div class="entry">
<div class="role">Tango Production &amp; Nahar Electronics — Short Engagements <span class="when">| Completed</span></div>
<ul>
<li>Edited three short-form promotional videos (caption overlays, brand sequencing, platform-native formatting) and designed a product-campaign creative series focused on offer clarity and CTR.</li>
</ul></div>

<h2>Education</h2>
<div class="entry">
<div class="role">B.Sc. Digital Supply Chain Management <span class="when">| 07/2025 – Expected 03/2029</span></div>
<div class="org">Philadelphia University | Jerash, Jordan</div>
<ul>
<li>Deliberately chose supply chain over a pure marketing degree: building fluency in data analysis, ERP systems (SAP, Oracle), and demand forecasting to bridge marketing strategy with operational execution.</li>
</ul></div>

<h2>Skills</h2>
<div class="entry"><ul class="skills">
<li><b>Paid Media &amp; Analytics:</b> Meta Ads Manager, Facebook Pixel, conversion tracking, ROAS / CPL / CTR monitoring, Google Ads, GA4, Google Tag Manager, Google Search Console</li>
<li><b>SEO:</b> keyword research, on-page optimisation, technical SEO, structured data, Google Keyword Planner, SEMrush / Ahrefs (fundamentals), WordPress SEO</li>
<li><b>CRM &amp; Automation:</b> pipeline setup, lead segmentation, follow-up workflow design, HubSpot &amp; Mailchimp (fundamentals), Zapier basics, marketing automation concepts</li>
<li><b>Content &amp; Campaigns:</b> content strategy, editorial calendars, bilingual copywriting (Arabic / English), Meta Business Suite, Instagram, Facebook, TikTok</li>
<li><b>Design &amp; Creative:</b> Adobe Photoshop, Illustrator, Premiere Pro, After Effects, Canva, CapCut, AI-assisted asset creation</li>
<li><b>Reporting:</b> KPI dashboards, performance reporting, Microsoft Office, Google Workspace</li>
</ul></div>

<h2>Certifications</h2>
<div class="entry"><ul class="skills">
<li><b>WordPress &amp; Digital Marketing</b> — DOT Jordan / YGA Youth Go (05/2026)</li>
<li><b>Media Buyer</b> — Wynbrooke Advertising Academy</li>
<li><b>Meta Ads &amp; Facebook Marketing</b> — Udemy</li>
<li><b>Google Ads Mastery: Lead Generation</b> — Udemy</li>
<li><b>SEO Guide: Rank Better on Google</b> — Udemy</li>
<li><b>Graphic Design: Photoshop &amp; Illustrator</b> — Excellence Institute, 4-month programme</li>
<li><b>Adobe After Effects</b> — Design in Motion School</li>
</ul></div>

<h2>Languages</h2>
<div class="entry"><ul class="skills">
<li><b>Arabic:</b> Native &nbsp;|&nbsp; <b>English:</b> Professional working proficiency</li>
</ul></div>

<p class="note">Specific client campaign metrics (CTR, ROAS, CPL) are client-owned data; details available in interviews, as standard practice in the Jordanian market.</p>

</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.pdf({
  path: OUT,
  format: 'A4',
  margin: { top: '13mm', bottom: '13mm', left: '15mm', right: '15mm' },
  printBackground: true,
});
await browser.close();
console.log('✅', OUT);
