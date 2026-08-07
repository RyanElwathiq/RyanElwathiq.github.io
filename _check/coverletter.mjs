// ═══════════════════════════════════════════════════════════════
//  مولّد رسائل التقديم (2026-08-07)
//
//  ⚠️ قاعدة ريّان: ولا شرطة طويلة (—). هي بصمة كتابة آلية معروفة،
//     وأي حدا بيقرا سير ذاتية كثير بيلقطها بثانية. الترقيم كله
//     نقاط وفواصل ونقطتين.
//
//  والتنسيق ATS-friendly: نص حقيقي، بلا صور ولا أعمدة ولا جداول.
//
//  التشغيل: node coverletter.mjs overcome|wolff
// ═══════════════════════════════════════════════════════════════
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const WHO = process.argv[2] || 'overcome';

const HEAD = {
  name: 'RAYAN AL-WATHIQ BILLAH AL-ALI',
  line: 'Digital Marketing &amp; SEO Consultant',
  meta: 'Amman, Jordan &nbsp;·&nbsp; ryan.elwathiq@gmail.com &nbsp;·&nbsp; +962 778 492 690',
  meta2: 'ryanalali.me &nbsp;·&nbsp; linkedin.com/in/rayan-elwathiq',
};

const LETTERS = {
  overcome: {
    file: 'Ryan_AlWathiq_CoverLetter_OvercomeMedia.pdf',
    to: 'The Overcome Media',
    re: 'Re: SEO Specialist (Local + AI Search)',
    body: `
<p>Hello,</p>

<p>I want to give you the straight answer to your question first, because you
asked for a local business I helped rank and I would rather be upfront than
clever. I do not yet have a client campaign with a ranking result I can point
to. I am early in building my consultancy. You would find that out in week one
anyway, so here it is in line one.</p>

<p>What I can show you is how I work, on the exact things your posting asks for.</p>

<p>You mention review strategy and spam fighting. Last week I looked at a wedding
venue in Amman with 2,140 Google reviews and a 4.5 rating. A recent reviewer
claimed the reviews were being collected at the end of each event rather than
left by guests. Rather than take that at face value, I pulled the last 30
reviews for that venue and for five competing venues, and compared four things:</p>

<ul>
  <li>How many separate days the reviews landed on. The venue: 3. Its peers: 21 to 27.</li>
  <li>How many reviews carried no written text. The venue: 13 percent. Its peers: 67 to 90 percent.</li>
  <li>Share of five star ratings. The venue: 87 percent. Its peers: 57 to 77 percent.</li>
  <li>Spread across days of the week. The venue: Wednesday, Thursday and Friday only, nothing on the other four. Its peers: all seven days.</li>
</ul>

<p>The text ratio is the one that gives it away, and it runs backwards from
normal behaviour. Real customers tap stars and move on. When nearly every
review carries written text, one person is usually writing them. It does not
prove intent, since asking guests to review on their way out would produce a
similar shape, but either way that review count is not a traction signal. I
took the venue off my own prospect list because of it.</p>

<p>That analysis sits on top of a wider one. I profiled 2,169 businesses across
23 sectors in Amman using DataForSEO, auditing every Google Business Profile
for website presence, booking links, descriptions, photo counts, payment
attributes and rating distribution. The gaps were not evenly spread. Seventy
three percent of auto repair shops had no website at all, against eighteen
percent of travel agencies. That is the kind of segmentation I would use to
decide where prospecting effort actually pays for you.</p>

<p>On answer engines: I came across a five star review where the customer wrote
that she found the salon through ChatGPT. That salon has no website. The only
thing a model could read about her was her Google reviews. It is the clearest
argument I have seen that answer engine visibility is now part of local search
rather than something bolted on beside it.</p>

<p>On my own site, ryanalali.me: 130 pages and more, bilingual Arabic and
English, clean structured data and hreflang, zero crawl errors on audit, with
Search Console and GA4 connected. It is new and not yet ranking. I would
rather you see the honest state of it than read a claim about it. I also
build and run my own Google Ads search campaign, which is where I caught a
competitor brand name leaking into our search terms and quietly eating
impressions.</p>

<p>One practical note before you spend time on me. I am based in Amman, so 7am
to 4pm Eastern lands as 2pm to 11pm here. I have thought it through and I am
willing to work it. I would rather raise it now than have it surprise either
of us later.</p>

<p>Thank you for reading this far.</p>
`,
  },

  wolff: {
    file: 'Ryan_AlWathiq_CoverLetter_WolffConstruction.pdf',
    to: 'Wolff Construction LLC',
    re: 'Re: 1099 SEO Specialist',
    body: `
<p>Hello,</p>

<p>Six answers, in the order you asked for them.</p>

<p><b>Sites I have ranked.</b> Being straight with you: I do not have a portfolio
of client sites with ranking histories yet. I am building my consultancy and I
am early in it. The site I am working on now is my own, ryanalali.me. It runs
to 130 pages and more, bilingual Arabic and English, with clean structured
data, hreflang, XML sitemaps, zero crawl errors on audit, and Search Console
and GA4 connected. It is new and not yet ranking. You can open it and check
the technical state yourself rather than take my word for it.</p>

<p><b>Case study.</b> The closest thing I have is analysis rather than a ranking
climb. I profiled 2,169 businesses across 23 sectors in Amman using DataForSEO,
auditing every Google Business Profile for website presence, booking links,
description, photo count, payment attributes, hours and rating distribution.
Two findings that would matter to you. First, the share of businesses with no
website varies enormously by trade: seventy three percent of auto repair shops,
fifty three percent of gyms, forty six percent of wedding venues, but only
eighteen percent of travel agencies. Contractor adjacent trades are
consistently the least digitised, which is the market you are in. Second,
Google Maps data on website presence is unreliable. Of the businesses flagged
as having no website, I verified each against a live SERP and found real sites
for several, including one venue with 1,557 reviews. I catch that before it
becomes a problem rather than after.</p>

<p><b>Tools.</b> Google Search Console, GA4, Google Business Profile, Google Ads,
Google Tag Manager, Google Keyword Planner, DataForSEO across its SERP,
keyword, business data and on page APIs, crawl auditing, schema and JSON-LD
authoring, WordPress, and Ahrefs and SEMrush at a fundamentals level.</p>

<p><b>Hourly rate.</b> Twenty five dollars an hour. I am also open to a structure
where part of the rate is tied to ranking outcomes. I would rather be paid for
results than for hours, and I am comfortable being measured.</p>

<p><b>My strategy for ranking a new local business site.</b></p>

<p>Weeks one and two are foundation, and the Google Business Profile comes
before the website. For a local contractor the map pack usually brings calls
before organic does. That means fixing the primary category, writing the
description around services people actually search for, adding real photos,
setting service areas, and making the name, address and phone identical
everywhere they appear. Inconsistent business details across directories is
the most common thing I find and the least glamorous to fix.</p>

<p>Weeks two to four are architecture, built on intent. Keyword research
anchored on what someone types when they are ready to hire, not when they are
reading. Emergency roof repair in a named city, not how to fix a roof. One
page per service per city, each answering the questions that come before a
phone call: what it costs, how long it takes, whether you are licensed, how
fast you can come out. LocalBusiness and Service schema, a clean internal
linking structure, and speed work against Core Web Vitals.</p>

<p>Weeks four to twelve are proof and authority. A steady review acquisition
process, asked for properly and never manufactured. Local citations on
directories that actually matter in that market rather than a bulk blast.
Content that answers the questions people ask before hiring, because those
pages earn links and they also convert. Links from suppliers, trade
associations and local press before anything else.</p>

<p>Throughout, I measure calls and booked jobs rather than rankings. A number
one position that does not ring the phone is a vanity metric. I report in the
client's terms: leads, cost per lead, and which pages produced them.</p>

<p>One thing I will flag honestly. Nobody can guarantee page one and I will not.
What I can commit to is a site Google can crawl, understand and trust, and a
monthly report that shows you exactly what moved and what did not.</p>

<p>Thanks for your time.</p>
`,
  },
};

const L = LETTERS[WHO];
if (!L) { console.log('استخدم: overcome أو wolff'); process.exit(1); }

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @page { size: A4; margin: 18mm 20mm; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: Calibri, "Segoe UI", Arial, sans-serif;
         font-size: 10.7pt; line-height: 1.62; color: #1a1a1a; }
  .name { font-size: 17pt; font-weight: 700; letter-spacing: .5px; margin: 0; }
  .rule { height: 3px; width: 46px; background: #c8e01b; margin: 7px 0 9px; }
  .role { font-size: 10.5pt; font-weight: 600; color: #333; margin: 0 0 4px; }
  .meta { font-size: 9pt; color: #555; margin: 0; }
  .sep { border: 0; border-top: 1px solid #ddd; margin: 15px 0 14px; }
  .to { font-size: 10.5pt; font-weight: 600; margin: 0 0 2px; }
  .re { font-size: 10.5pt; margin: 0 0 14px; color: #333; }
  p { margin: 0 0 10px; text-align: left; }
  ul { margin: 4px 0 12px; padding-left: 18px; }
  li { margin-bottom: 4px; }
  b { font-weight: 600; }
  .sign { margin-top: 16px; }
  .sign .n { font-weight: 700; }
  .sign .u { color: #555; font-size: 9.5pt; }
</style></head><body>
  <p class="name">${HEAD.name}</p>
  <div class="rule"></div>
  <p class="role">${HEAD.line}</p>
  <p class="meta">${HEAD.meta}</p>
  <p class="meta">${HEAD.meta2}</p>
  <hr class="sep">
  <p class="to">${L.to}</p>
  <p class="re">${L.re}</p>
  ${L.body}
  <div class="sign">
    <p class="n" style="margin:0">Ryan Al-Wathiq</p>
    <p class="u" style="margin:0">ryanalali.me</p>
  </div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
const out = `D:/Ryan-Work/Brand-Ryan/My cv's/${L.file}`;
await page.pdf({ path: out, format: 'A4', printBackground: true });
await browser.close();

// فحص: ولا شرطة طويلة
const dash = /—|–/.test(L.body) ? '🔴 في شرطة طويلة!' : '✅ ولا شرطة طويلة';
console.log(`${dash}\n📄 ${out}`);
