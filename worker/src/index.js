// ═══════════════════════════════════════════════════════════════
//  Worker واحد بيخدم شغلتين بموقع ryanalali.me
//
//   POST /brief  → طلب مشروع من الفورم
//                  بيوصل ريّان إيميل + تنبيه تيليجرام
//   POST /idea   → فكرة تسويقية مولّدة بالذكاء الاصطناعي
//                  (مختبر الأفكار — قسم «تجارب»)
//
//  ليش Worker أصلاً؟ الموقع ملفات ثابتة على GitHub Pages، وما
//  بيقدر يشغّل كود سيرفر. فالفورم كان بيفتح برنامج البريد عند
//  الزائر (mailto) — ونص الناس بتوقف عند هالخطوة وما بتبعت.
//
//  ⚠️ المفاتيح السرّية ما بتنكتب هون ولا بأي ملف بالريبو.
//     ريّان بيحطّها من لوحة Cloudflare (Settings → Variables →
//     Secrets)، وبتوصل للكود عبر `env` وقت التشغيل بس.
// ═══════════════════════════════════════════════════════════════

// ─── مين مسموح يستدعي هذا الـ Worker ───
// بدون هالقائمة أي موقع بالدنيا بيقدر يستهلك رصيدك ويبعتلك طلبات
const ALLOWED = [
  'https://ryanalali.me',
  'https://www.ryanalali.me',
  // للتجربة المحلية وقت التطوير
  'http://localhost:4321',
  'http://localhost:4330',
  'http://localhost:4460',
  'http://localhost:4461',
  'http://localhost:4462',
  'http://localhost:4470',
];

// ═══════════════════════════════════════════════════════════════
//  موديل توليد الأفكار — بيشتغل بمسارين
//
//  إذا المفتاح ANTHROPIC_KEY موجود  → كلود
//  إذا مش موجود                     → Workers AI (مجاني)
//
//  ⚠️ تصحيح مهم (٣١ تموز ٢٠٢٦) — لا تصدّق النسخة القديمة من
//     هذا التعليق. كان مكتوب هون إنه Workers AI «ما بيعرف يقرأ
//     عربي» مع أرقام فحص. **الاستنتاج كان غلط.**
//
//     السبب: تيرمينال Git Bash على ويندوز بيحوّل أي محرف غير
//     إنجليزي بأمر الشيل لعلامة استفهام. فكل فحوصاتنا كانت
//     بتبعت «؟؟؟؟» للموديل بدل العربي. الموديل ما شاف عربي ولا
//     مرة — عشان هيك كان بيرد عن «وصفات وبهارات» لمحل شاورما.
//     والإنجليزي نجح لأنه ASCII وبيمرّ من التيرمينال سليم.
//
//     لما بعتنا نفس السؤال بملف UTF-8 (بدل وسيط سطر أوامر)،
//     llama-3.3-70b و llama-4-scout الاثنين طلّعوا أفكار
//     أردنية ممتازة ومحدّدة للزرقاء.
//
//  📏 قاعدة للفحص من هون ورايح: أي طلب فيه عربي لازم ينبعت
//     بـ --data-binary @file.json والملف مكتوب بـ Node بـ utf8.
//     ممنوع نحط عربي جوّا -d '...' بسطر الأوامر.
//
//  فالمسار المجاني شغّال فعلاً. كلود بيضل أغنى وأدق، بس المجاني
//  مش «كلام فاضي» زي ما كتبنا غلط.
// ═══════════════════════════════════════════════════════════════
const CF_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const CLAUDE_MODEL = 'claude-opus-5';

// ═══════════════════════════════════════════════════════════════
//  الحد اليومي لمختبر الأفكار (مهمة #52)
//
//  ليش؟ المختبر مفتوح للكل بلا إيميل ولا التزام، وكل ضغطة ممكن
//  تكون استدعاء كلود بيسحب من رصيد ريّان. بلا سقف، شخص واحد
//  (أو سكربت) بيقدر يحرق الرصيد بليلة.
//
//  سقفين:
//   • للزائر باليوم  — عادل: خمس أفكار بتكفي أي مهتم حقيقي
//   • لليوم كله      — صمّام أمان لو حدا لفّ على عناوين كثيرة
//
//  ⚠️ العدّ «بالحجز المسبق»: منحجز قبل استدعاء الموديل، ولو فشل
//     الاستدعاء منرجّع الحجز. هيك الرصيد محمي حتى من طلبات
//     متوازية، والزائر ما بيخسر محاولة على فشل مش ذنبه.
//  ⚠️ منخزّن بصمة مختصرة من الـ IP مش الـ IP نفسه — ما منحتفظ
//     ببيانات تعريفية لزوار ما طلبوا إشي.
// ═══════════════════════════════════════════════════════════════
const IDEA_PER_VISITOR_DAY = 5;
const IDEA_GLOBAL_DAY = 150;

// جدول العدّادات بينبنى لحاله أول استعمال (مرة لكل نسخة Worker)
let quotaTableReady = null;
const ensureQuotaTable = (env) =>
  (quotaTableReady ||= env.LEADS.exec(
    'CREATE TABLE IF NOT EXISTS idea_quota (day TEXT NOT NULL, who TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, who))',
  ));

async function visitorKey(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('idea:' + ip));
  return [...new Uint8Array(buf)]
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// بيحاول يحجز محاولة. بيرجع { ok } أو { ok:false, scope, message }
async function reserveIdeaQuota(env, request, isAr) {
  await ensureQuotaTable(env);
  const day = new Date().toISOString().slice(0, 10);
  const who = await visitorKey(request);

  // صف الزائر وصف اليوم الكلي ('*') — منزيد الاثنين بضربة وحدة
  await env.LEADS.batch([
    env.LEADS.prepare(
      'INSERT INTO idea_quota (day, who, n) VALUES (?1, ?2, 1) ON CONFLICT(day, who) DO UPDATE SET n = n + 1',
    ).bind(day, who),
    env.LEADS.prepare(
      "INSERT INTO idea_quota (day, who, n) VALUES (?1, '*', 1) ON CONFLICT(day, who) DO UPDATE SET n = n + 1",
    ).bind(day),
  ]);

  const rows = await env.LEADS.prepare(
    "SELECT who, n FROM idea_quota WHERE day = ?1 AND who IN (?2, '*')",
  )
    .bind(day, who)
    .all();

  let mine = 0;
  let all = 0;
  for (const r of rows.results || []) {
    if (r.who === '*') all = r.n;
    else mine = r.n;
  }

  // ⚠️ المحاولة المحجوبة بترجّع حجزها — ما استهلكت موديل.
  //    بدون هالسطر، زائر واصل حدّه بيقدر بمحاولات فاضية متكررة
  //    يكبّر العدّاد الكلي لحد ما يسكّر المختبر عن **الكل**.
  //    مع الاسترجاع: عدّاده بيثبت عند حدّه (بيضل محجوب)، والعدّاد
  //    الكلي بيعكس الاستهلاك الحقيقي بس.
  if (mine > IDEA_PER_VISITOR_DAY) {
    await refundIdeaQuota(env, request);
    return {
      ok: false,
      scope: 'visitor',
      message: isAr
        ? 'خلصت أفكار اليوم — خمسة بتكفي تبلّش فيهم. ارجعلي بكرا، أو إذا الموضوع جدّي عبّي طلب مشروع وبنحكي بتفصيل أعمق.'
        : 'That is your five ideas for today — enough to start with. Come back tomorrow, or if this is serious, send a project brief and we will go deeper.',
    };
  }

  if (all > IDEA_GLOBAL_DAY) {
    await refundIdeaQuota(env, request);
    return {
      ok: false,
      scope: 'day',
      message: isAr
        ? 'المختبر أخد نصيبه اليوم وارتاح. ارجعلي بكرا الصبح — أو عبّي طلب مشروع وبوصلك رد شخصي مش مولّد.'
        : 'The lab has done its share for today. Come back tomorrow morning — or send a project brief and you will get a personal reply, not a generated one.',
    };
  }

  return { ok: true };
}

// بيرجّع الحجز لما يفشل استدعاء الموديل — مش ذنب الزائر
async function refundIdeaQuota(env, request) {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const who = await visitorKey(request);
    await env.LEADS.batch([
      env.LEADS.prepare('UPDATE idea_quota SET n = n - 1 WHERE day = ?1 AND who = ?2 AND n > 0').bind(day, who),
      env.LEADS.prepare("UPDATE idea_quota SET n = n - 1 WHERE day = ?1 AND who = '*' AND n > 0").bind(day),
    ]);
  } catch (e) {
    // فشل الاسترجاع مش نهاية الدنيا — أسوأ حالة: محاولة محسوبة زيادة
  }
}

// ─────────────────────────────────────────────
//  أدوات صغيرة
// ─────────────────────────────────────────────
const cors = (origin) => ({
  'Access-Control-Allow-Origin': ALLOWED.includes(origin) ? origin : ALLOWED[0],
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
});

const json = (data, status, origin) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...cors(origin) },
  });

// تنظيف أي نص جاي من الزائر قبل ما نحطّه بإيميل أو نبعته للموديل
const clean = (v, max = 2000) =>
  String(v ?? '')
    .replace(/[ --]/g, '')
    .trim()
    .slice(0, max);

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ─────────────────────────────────────────────
//  ١) طلب المشروع
// ─────────────────────────────────────────────
async function handleBrief(request, env, origin, ctx) {
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'bad-json' }, 400, origin);

  // فخّ السبام: حقل مخفي ما بيشوفه إنسان. لو انتعبّى فهو روبوت.
  // منرجّع «تمام» عشان الروبوت ما يعرف إنه انكشف ويجرّب طريقة ثانية.
  if (clean(body.website)) return json({ ok: true }, 200, origin);

  const f = {
    name: clean(body.name, 120),
    mail: clean(body.mail, 160),
    phone: clean(body.phone, 60),
    biz: clean(body.biz, 200),
    budget: clean(body.budget, 120),
    when: clean(body.when, 120),
    services: (Array.isArray(body.services) ? body.services : []).slice(0, 12).map((s) => clean(s, 80)),
    details: clean(body.details, 4000),
    lang: body.lang === 'ar' ? 'ar' : 'en',
  };

  // أقل إشي لازم يكون فيه اسم وطريقة تواصل — وإلا الطلب ما بينفع
  if (!f.name || !f.mail) return json({ error: 'missing-fields' }, 422, origin);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.mail)) return json({ error: 'bad-email' }, 422, origin);

  const isAr = f.lang === 'ar';
  const L = isAr
    ? ['الخدمات', 'النشاط', 'الميزانية', 'التوقيت', 'التفاصيل', 'الاسم', 'الإيميل', 'الهاتف']
    : ['Services', 'Business', 'Budget', 'Timing', 'Details', 'Name', 'Email', 'Phone'];

  const rows = [
    [L[0], f.services.join('، ') || '—'],
    [L[1], f.biz || '—'],
    [L[2], f.budget || '—'],
    [L[3], f.when || '—'],
    [L[4], f.details || '—'],
    [L[5], f.name],
    [L[6], f.mail],
    [L[7], f.phone || '—'],
  ];

  const subject = isAr ? `طلب مشروع — ${f.biz || f.name}` : `Project brief — ${f.biz || f.name}`;
  const plain = rows.map(([k, v]) => `${k}: ${v}`).join('\n');

  const html = `<div dir="${isAr ? 'rtl' : 'ltr'}" style="font-family:system-ui,Segoe UI,Arial;background:#0E0F12;color:#F2F3EE;padding:28px;border-radius:14px">
    <p style="color:#D9FF3F;font-weight:700;margin:0 0 14px">${escapeHtml(subject)}</p>
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:8px 0;color:#A0A49B;white-space:nowrap;vertical-align:top">${escapeHtml(
              k
            )}</td><td style="padding:8px 12px;vertical-align:top">${escapeHtml(v).replace(
              /\n/g,
              '<br>'
            )}</td></tr>`
        )
        .join('')}
    </table>
  </div>`;

  // ═══════════════════════════════════════════════════════════
  //  ١) الأول: نوصّل الطلب لريّان — وهاد اللي بيستنى عليه الزائر
  //
  //  ⚠️ لازم يكون سريع. كنّا بننادي كلود قبل ما نرد، فالفورم
  //     صار ياخد ١٥ ثانية والمهلة عند الزائر ٢٠ — أي بطء بكلود
  //     كان بيعرضله رسالة فشل كاذبة بينما كل إشي وصل فعلاً.
  //     هلق الرد بيرجع فوراً، والباقي بيكمّل بالخلفية.
  // ═══════════════════════════════════════════════════════════
  const urgent = [];

  if (env.RESEND_KEY) {
    urgent.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.MAIL_FROM || 'Brief <onboarding@resend.dev>',
          to: [env.MAIL_TO],
          // ⚠️ reply_to = إيميل الزائر، فبتقدر ترد عليه بضغطة وحدة
          reply_to: f.mail,
          subject,
          text: plain,
          html,
        }),
      })
    );
  }

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const msg = `📩 *${subject}*\n\n` + rows.map(([k, v]) => `*${k}:* ${v}`).join('\n');
    urgent.push(
      fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: msg.slice(0, 4000),
          parse_mode: 'Markdown',
        }),
      })
    );
  }

  if (!urgent.length) return json({ error: 'not-configured' }, 503, origin);

  const results = await Promise.allSettled(urgent);
  const delivered = results.filter((r) => r.status === 'fulfilled' && r.value.ok).length;

  // ⚠️ لو ولا وحدة وصلت، منرجّع خطأ عشان الفورم يعرض للزائر
  //    زر «انسخ الطلب» بدل ما يقوله «تم» وهو ما وصل
  if (!delivered) return json({ error: 'delivery-failed' }, 502, origin);

  // ═══════════════════════════════════════════════════════════
  //  ٢) بالخلفية: الرد الأوّلي للعميل
  //
  //  الفكرة: العميل بيبعت طلبه ويقعد يستنى. الانتظار الصامت هو
  //  اللحظة اللي بيروح فيها لحدا تاني. فبنبعتله رد بيقرأ وضعه،
  //  بيعطيه خطوة يقدر يعملها هو، وبيوضّحله شكل التعاون — فبيضل
  //  دافي لحد ما ريّان يرد شخصياً.
  //
  //  ⚠️ الرد بيقول صراحةً إنه قراءة أوّلية فورية. ريّان بيبيع
  //     قياس ومصداقية — ولو انكشف إنه رد آلي مدّعى إنه شخصي،
  //     الخسارة أكبر بكثير من الدفء اللي بيكسبه.
  //
  //  ⚠️ waitUntil بيخلّي الـ Worker يكمّل هالشغل بعد ما يرجّع
  //     الرد للزائر. لو فشل، الطلب وصل ريّان بأي حال — الرد
  //     إضافة مش شرط، وما بيأثر على اللي شافه الزائر.
  // ═══════════════════════════════════════════════════════════
  if (env.ANTHROPIC_KEY) {
    ctx.waitUntil(sendClientReply(env, f, isAr));
  } else {
    // ما في رد آلي — بس الطلب لازم ينحفظ بأي حال
    ctx.waitUntil(saveLead(env, f, null));
  }

  return json({ ok: true, delivered }, 200, origin);
}

// ─────────────────────────────────────────────
//  حفظ الطلب بالقاعدة
//
//  ⚠️ الإيميل وتيليجرام تنبيهات مش أرشيف — بتضيع بالبحث وبتتحذف.
//     هون كل طلب بيضل محفوظ وبتقدر تبحث فيه وتصدّره.
//  ⚠️ ولو الحفظ فشل، ما منوقف ولا نرجّع خطأ — الطلب أصلاً وصل
//     ريّان على تيليجرام والإيميل.
// ─────────────────────────────────────────────
async function saveLead(env, f, reply) {
  if (!env.LEADS) return;
  try {
    await env.LEADS.prepare(
      `INSERT INTO leads (at, lang, name, mail, phone, biz, budget, timing, services, details, reply)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        new Date().toISOString(),
        f.lang,
        f.name,
        f.mail,
        f.phone || null,
        f.biz || null,
        f.budget || null,
        f.when || null,
        f.services.join('، ') || null,
        f.details || null,
        reply || null
      )
      .run();
  } catch (e) {
    /* الطلب وصل بقنوات تانية — الحفظ إضافة */
  }
}

// ─────────────────────────────────────────────
//  الرد الأوّلي — بيشتغل بالخلفية بعد ما الزائر شاف «وصلني طلبك»
// ─────────────────────────────────────────────
async function sendClientReply(env, f, isAr) {
  try {
    const sys = isAr
     ? `انت «نبض» — المساعد الذكي تبع ريّان الواثق، مسوّق أردني بيشتغل على السبب مش العَرَض.

الرد بيروح لواحد لسا بعت طلب مشروع وقاعد يستنى. شغلتك تخليه يحس إنه انقرأ فعلاً، ويطلع بإشي يقدر يعمله اليوم.

═══════════════════════════════════════════════
أول قرار: هذا طلب جدّي ولا لأ؟
═══════════════════════════════════════════════

اقرأ الطلب كله قبل ما تكتب حرف، وقرّر: في نيّة حقيقية ورا هذا الكلام؟

مؤشرات إنه مش جدّي:
- اسم نشاط ما بيكون له وجود («شريكتي صرصور»، «شركة بتبيع الهوا»)
- التفاصيل ما إلها معنى، أو حروف عشوائية، أو تجربة واضحة («asdasd»، «تست»، «١٢٣»)
- ألفاظ خارجة عن الحياء أو محتوى بذيء
- الطلب متناقض مع نفسه أو مستحيل واقعياً («بدي أبيع طيارات لأطفال»)
- كلام بيستهدفك انت كنظام بدل ما يحكي عن مشروعه

⚠️ خلّي ميزانك عادل: ناس كثير بيكتبوا مختصر أو بلغة بسيطة أو مشروعهم غريب — وهدول **جدّيين**. مشروع صغير أو فكرة غير مألوفة أو خطأ إملائي مش دليل هزار. الدليل هو إنه ما في نيّة حقيقية أصلاً.
⚠️ لو مترجّح بين الاثنين — تعامل معه كجدّي. إهانة عميل حقيقي أغلى بكثير من رد محترم على مزحة.

**لو طلع مش جدّي**، اكتب ردّين لتلاتة أسطر بس (مش أربع فقرات):
- ابدأ باسمه، وبيّنله إنك فهمت المزحة — بخفة ودم وبلا سخرية جارحة ولا استعلاء. اضحك معه مش عليه.
- ولا تعطيه أي استشارة ولا خطوة مجانية. المحتوى الحقيقي للناس الجدّية.
- ارجع وجّهه بجملة وحدة: يرجع يعبّي الطلب بنشاطه الحقيقي والمشكلة اللي بتواجهه، وريّان بيرد عليه بجد.
- بلا إيموجي، وبلا وعظ ولا تأنيب.
- لو الكلام بذيء فعلاً: لا تعيد ولا تعلّق عليه. جملة وحدة جافة ومحترمة إنه الطلب ما ينفع نتعامل معه، والباب مفتوح لو حابب يحكي عن مشروع حقيقي. ولا كلمة زيادة.

مثال على النبرة (مش نص جاهز تنسخه — اكتب من عندك حسب حالته):
«خالد، «صرصور لبيع الطيارات للبنات الصغار» — والله فكرة ما سبقك فيها حدا، وهاد بحد ذاته إنجاز. بس خلينا نكون واقعيين شوي: لو عندك مشروع حقيقي وفي مشكلة قاعدة تكسر راسك، اكتبها وريّان بيقرأها بنفسه ويرد عليك بجد.»

═══════════════════════════════════════════════
ولو الطلب جدّي — وهاي الحالة الغالبة:
═══════════════════════════════════════════════

اكتب أربع فقرات قصيرة، بلا عناوين وبلا نقاط:

١) اقرأ وضعه بكلامك انت. مش «شكراً على طلبك» — بل الجملة اللي بتوري إنك فهمت المشكلة الحقيقية ورا اللي كتبه. لو كتب «الناس بتيجي مرة وما بترجع» فالمشكلة مش التسويق، المشكلة سبب عدم الرجوع.

٢) خطوة وحدة يقدر يعملها هالأسبوع بنفسه، بلا ما يدفع ولا فلس. محدّدة لنشاطه هو، مش نصيحة عامة.

٣) لو اشتغلنا سوا، كيف بتبدأ: مكالمة نفهم فيها الوضع، بعدها نطاق مكتوب بمخرجات وجدول وسعر ثابت. بلا أرقام ولا وعود بنتائج.

٤) سطرين: ريّان بيقرأ الطلب بنفسه وبيرجعله خلال ٢٤ ساعة.

═══════════════════════════════════════════════
ممنوع تدّعي إنك شفت إشي
═══════════════════════════════════════════════

انت ما شفت حسابه ولا موقعه ولا إعلاناته. كل اللي عندك هو النص اللي كتبه بالفورم. ممنوع منعاً باتاً تكتب جملة بتوحي إنك فحصت إشي.

غلط: «حسابك عامل زي كتالوج معلّق»
صح: «من وصفك، الأغلب إنه الحساب عامل زي كتالوج معلّق»

غلط: «موقعك بطيء والصور مش مضغوطة»
صح: «لما نفحص الموقع، أول إشي منشوفه سرعته وحجم الصور»

استخدم صيغ زي: «من كلامك…»، «الأغلب إنه…»، «لو الوضع زي ما وصفت…»، «لما نفحص… منعرف بالضبط».

هذي مش شكليات: لو خمّنت غلط وحكيت بيقين، العميل بيعرف إنك ما فحصت إشي، وبيخسر ثقته بالرد كله من أول جملة.

═══════════════════════════════════════════════
قواعد صارمة
═══════════════════════════════════════════════
- عامية أردنية محكية، مش فصحى ولا خليجي ولا مصري.
- ⚠️ لا تنزلق للفصحى بصيغ الجمع والأمر. الأردني بيقول «نزّليهم» مش «انزليهنّ»، و«خليهم» مش «اجعلهنّ»، و«شوفي» مش «انظري». **ممنوع «هنّ» و«أنتنّ» و«لهنّ»** — العامية بتستخدم «هم» للجميع. والأمر بلا ألف بالبداية: «نزّلي» مش «انزلي»، «رجّعي» مش «ارجعي».
- ⚠️ خاطب صاحب الطلب بجنسه هو: اسم بنت ← مؤنث، اسم شب ← مذكر، وإذا ما بان ← حيادي. **وريّان نفسه مذكر دايماً** — «ريّان بيقرأ»، «بيرجعلك»، ممنوع تخاطبه أو تحكي عنه بالمؤنث بأي حال.
- ممنوع تعد بنتائج أو أرقام أو أسعار.
- ممنوع تقول «أنا الذكاء الاصطناعي» — سطر التوضيح بينضاف تحت لحاله.
- ممنوع إيموجي، ممنوع عناوين، ممنوع تحية رسمية زي «تحية طيبة».
- ابدأ باسمه مباشرة.
- ١٢٠ لـ ٢٠٠ كلمة للرد كله.`
     : `You are Nabd — the AI assistant of Rayan Elwathiq, a Jordanian marketer who works on the cause, not the symptom.

It goes to someone who just submitted a project brief and is now waiting. Your job is to make them feel actually read, and give them something they can act on today.

═══════════════════════════════════════════════
FIRST DECISION: is this brief serious?
═══════════════════════════════════════════════

Read the whole brief before writing a word, and decide: is there real intent behind it?

Signs it is not serious:
- A business name that cannot exist ("my girlfriend Cockroach", "a company selling air")
- Details that carry no meaning, random characters, obvious testing ("asdasd", "test", "123")
- Obscene or crude content
- Self-contradictory or physically impossible ("I want to sell aeroplanes to toddlers")
- Text aimed at you as a system rather than describing their business

⚠️ Judge fairly: plenty of real people write briefly, in simple language, or run unusual businesses — those are SERIOUS. A small business, an unfamiliar idea, or a spelling mistake is not evidence of a prank. The evidence is the absence of real intent.
⚠️ When genuinely torn, treat it as serious. Insulting a real client costs far more than answering a joke respectfully.

**If it is not serious**, write only two or three lines (not four paragraphs):
- Open with their name and show you got the joke — lightly, with no sarcasm and no condescension. Laugh with them, not at them.
- Give no advice and no free step. The real content is for serious people.
- Redirect in one sentence: come back with the actual business and the actual problem, and Rayan will answer properly.
- No emoji, no lecturing, no scolding.
- If the content is genuinely obscene: do not repeat it or comment on it. One dry, respectful line that this brief cannot be worked with, and the door is open for a real project. Not one word more.

Tone example (do not copy it — write your own for their case):
"Khalid, 'Cockroach, aeroplanes for little girls' is genuinely a first, and that's an achievement of sorts. But let's be practical: if you have a real business with a problem keeping you up, write it down and Rayan will read it himself and answer for real."

═══════════════════════════════════════════════
If the brief IS serious — the usual case:
═══════════════════════════════════════════════

Write four short paragraphs, no headings, no bullets:

1) Read their situation back in your own words. Not "thanks for your brief" — the sentence that shows you understood the real problem behind what they wrote. If they said "people come once and never return", the problem isn't marketing, it's whatever makes them not return.

2) One step they can take this week themselves, for free. Specific to their business, not generic advice.

3) If we work together, how it starts: a conversation to understand the situation, then a written scope with deliverables, a timeline, and a fixed price. No numbers, no promises of results.

4) Two lines: Rayan reads the brief himself and gets back within 24 hours.

═══════════════════════════════════════════════
NEVER CLAIM YOU LOOKED AT ANYTHING
═══════════════════════════════════════════════

You have not seen their account, their site, or their ads. All you have is the text they typed into the form. Never write a sentence implying you inspected anything.

Wrong: "Your account reads like a hanging catalogue"
Right: "From how you describe it, the account probably reads like a hanging catalogue"

Wrong: "Your site is slow and the images aren't compressed"
Right: "When we audit the site, speed and image weight are the first things we'd look at"

Use hedges: "from what you wrote…", "most likely…", "if it's as you describe…", "once we look, we'll know exactly…".

This is not politeness: if you guess wrong while sounding certain, they know you never looked, and the whole reply loses credibility from the first line.

Strict rules:
- Match their gender in any gendered language; **Rayan himself is always male**.
- No promises of results, numbers, or prices.
- Never say "I am an AI" — the disclosure line is appended separately below.
- No emoji, no headings, no formal salutation.
- Open with their name.
- 120 to 200 words total.`;

    const facts = [
     `${isAr ? 'الاسم' : 'Name'}: ${f.name}`,
     `${isAr ? 'النشاط' : 'Business'}: ${f.biz || '—'}`,
     `${isAr ? 'الخدمات اللي طلبها' : 'Services requested'}: ${f.services.join('، ') || '—'}`,
     `${isAr ? 'التوقيت' : 'Timing'}: ${f.when || '—'}`,
     `${isAr ? 'كلامه بالحرف' : 'In their own words'}: ${f.details || (isAr ? 'ما كتب تفاصيل' : 'no details given')}`,
    ].join('\n');


    // ⚠️ stripMarkdown هون كمان — هذا المسار بيستدعي كلود مباشرة
    //    مش عبر askAI، فبيفوت من غير فلترة لو ما نظّفناه بإيدنا.
    //    ورد العميل بينبعت إيميل، والعنوان الـ markdown بيطلع فيه
    //    كعلامة # حرفية قدام عميل حقيقي.
    const reply = stripMarkdown(await askClaude(env, sys, facts));

    // منحفظ أول إشي — حتى لو الرد فشل، الطلب لازم يضل بالأرشيف
    await saveLead(env, f, reply);
    if (!reply) return;

    // ═══════════════════════════════════════════════════════════
    //  سطر التوضيح
    //
    //  بينضاف بالكود مش بالموديل، عشان ما يقدر يشيله ولا يعدّله.
    //
    //  ⚠️ الصياغة مقصودة: بتقول صراحة إنه مساعد ذكي كتبه.
    //     كان مكتوب «قراءة أوّلية فورية» — وهاي بتلمّح للأتمتة بس
    //     ما بتسمّيها. والعميل اللي بيقرا رد بهالعمق بيفترض إنه
    //     ريّان كتبه بإيده، ولو اكتشف بعدين إنه AI الثقة بتنكسر
    //     أقوى من لو عرف من الأول.
    //     وكل الموقع مبني على الصراحة (صفحات الخدمات بتقول
    //     «ما بضمن الصفحة الأولى»)، فهاد المكان ما بيصير يكون
    //     الاستثناء. والاسم بيحوّل الشفافية من اعتذار لميزة.
    // ═══════════════════════════════════════════════════════════
    const disclosure = isAr
      ? 'هذي قراءة أوّلية كتبها «نبض» — مساعد ريّان الذكي — فور وصول طلبك.\nريّان بيقرأ طلبك بنفسه وبيرجعلك خلال ٢٤ ساعة.'
      : 'This is a first read written by Nabd — Rayan\'s AI assistant — the moment your brief arrived.\nRayan reads your brief himself and will get back to you within 24 hours.';

    const clientHtml = `<div dir="${isAr ? 'rtl' : 'ltr'}" style="font-family:system-ui,Segoe UI,Arial;max-width:560px;font-size:16px;line-height:1.9;color:#1a1a1a">
      ${escapeHtml(reply)
        .split('\n')
        .filter((p) => p.trim())
        .map((p) => `<p style="margin:0 0 16px">${p}</p>`)
        .join('')}
      <p style="margin:28px 0 0;padding-top:16px;border-top:1px solid #e5e5e5;font-size:13px;color:#777">
        ${escapeHtml(disclosure)}
      </p>
    </div>`;

    const jobs = [
      // ─── للعميل ───
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.MAIL_FROM || 'Rayan Elwathiq <onboarding@resend.dev>',
          to: [f.mail],
          // ⚠️ لو رد العميل، بيوصل ريّان مباشرة.
          //    REPLY_TO منفصل عن MAIL_TO عن قصد: MAIL_TO هو «وين
          //    بتوصلني الطلبات» (صندوق شغّال ومضمون)، و REPLY_TO هو
          //    «شو بيشوف العميل ويرد عليه» (عنوان رسمي على دومينك).
          //    لو ضلّوا شي واحد، ما بتقدر تغيّر واحد بلا ما تكسر التاني.
          //    وبيرجع لـ MAIL_TO لحاله إذا ما انحدد.
          reply_to: env.REPLY_TO || env.MAIL_TO,
          subject: isAr ? `وصلني طلبك — ${f.biz || f.name}` : `Got your brief — ${f.biz || f.name}`,
          text: `${reply}\n\n—\n${disclosure}`,
          html: clientHtml,
        }),
      }),
    ];

    // ─── ولريّان: نفس الرد + رابط واتساب بضغطة وحدة ───
    //  ليش رابط بدل إرسال تلقائي؟ لأنه واتساب ما بيسمح لرقم
    //  أعمال يبعت نص حر لحدا ما راسله أول — لازم قالب معتمد من
    //  Meta، ورد استشاري طويل ما بيعدّي كقالب. فبتبعته انت
    //  بضغطة، وبيوصل من رقمك الحقيقي وهاد أصلاً أصدق.
    if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
      const digits = String(f.phone || '').replace(/\D/g, '');
      // 07xxxxxxxx → 9627xxxxxxxx (الأردن)
      const intl = digits.startsWith('00')
        ? digits.slice(2)
        : digits.startsWith('0')
          ? '962' + digits.slice(1)
          : digits;
      const wa = intl.length >= 11 ? `https://wa.me/${intl}?text=${encodeURIComponent(reply)}` : null;

      jobs.push(
        fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: `✍️ الرد الأوّلي (انبعت له عالإيميل):\n\n${reply}`.slice(0, 4000),
            ...(wa
              ? { reply_markup: { inline_keyboard: [[{ text: '📲 ابعتهولو واتساب', url: wa }]] } }
              : {}),
          }),
        })
      );
    }

    await Promise.allSettled(jobs);
  } catch (e) {
    // بالخلفية — ما في حدا يشوف الخطأ، والطلب وصل بأي حال
  }


}

// ─────────────────────────────────────────────
//  ٢) مختبر الأفكار
// ─────────────────────────────────────────────
async function handleIdea(request, env, origin) {
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'bad-json' }, 400, origin);

  const isAr = body.lang === 'ar';
  const industry = clean(body.industry, 120);
  const goal = clean(body.goal, 120);
  // ⚠️ هاد هو المدخل الأساسي — طلبه ريّان صراحةً عشان الزائر
  //    ما يكون محصور بالخيارات الجاهزة
  const notes = clean(body.notes, 1200);

  if (!industry && !goal && !notes) return json({ error: 'empty' }, 422, origin);

  // ═══ الحد اليومي (#52) — قبل ما نلمس الموديل ═══
  //  ⚠️ بعد فحص المدخلات عن قصد: الطلبات الفاضية والمكسورة ما
  //     بتاكل من رصيد الزائر.
  //  ⚠️ ولو نظام الحد نفسه تعطّل (D1 واقعة مثلاً) منكمّل عادي —
  //     تعطيل ميزة الحماية ما بيبرّر تعطيل الخدمة نفسها.
  let reserved = false;
  try {
    const q = await reserveIdeaQuota(env, request, isAr);
    if (!q.ok) return json({ error: 'quota', scope: q.scope, message: q.message }, 429, origin);
    reserved = true;
  } catch (e) {
    // نظام الحد تعطّل — سجّل وكمّل
  }

  // ⚠️ فلتر الجدّية موجود هون كمان مش بالفورم بس — ومختبر الأفكار
  //    أكثر عرضة للهزار لأنه مفتوح للكل بلا إيميل ولا التزام.
  //    الفرق عن الفورم: هون الرد بيظهر عالشاشة فوراً وبيشوفه الزائر
  //    وهو قاعد، فالنبرة بتكون أخف وأقرب للمزاح.
  const system = isAr
    ? `أنت «نبض» — المساعد الذكي تبع ريّان الواثق، مسوّق أردني بيشتغل على السبب مش العَرَض. بتعطي فكرة تسويقية وحدة، قابلة للتنفيذ هالأسبوع، بميزانية صغيرة.

قبل أي إشي: هل هذا نشاط حقيقي؟
- لو الكلام هزار واضح أو حروف عشوائية أو نشاط مستحيل («شريكتي صرصور ببيع طيارات للبنات») أو ألفاظ خارجة عن الحياء — **ما تعطي فكرة**.
- بدالها اكتب سطرين: بيّنله إنك فهمت المزحة بخفة دم وبلا سخرية جارحة، وقلّه يجرّب كمان مرة بنشاط حقيقي عشان يطلع بإشي ينفعه.
- لو الكلام بذيء: لا تعيده ولا تعلّق عليه. جملة وحدة جافة إنه ما بنقدر نشتغل على هيك مدخل، وبس.
- ⚠️ كن عادل: نشاط صغير أو غريب أو كلام مختصر أو خطأ إملائي **مش هزار**. لو مترجّح، اعتبره جدّي واعطيه الفكرة.

ولو النشاط حقيقي — وهاي الحالة الغالبة — قواعد صارمة:
- اكتب بالعامية الأردنية المحكية، مش الفصحى ولا خليجي ولا مصري.
- ⚠️ لا تنزلق للفصحى: «نزّليهم» مش «انزليهنّ»، «شوفي» مش «انظري»، والأمر بلا ألف («رجّعي» مش «ارجعي»). وممنوع «هنّ» و«لهنّ» — العامية بتستخدم «هم» للجميع.
- ⚠️ **ما شفت حسابه ولا موقعه** — عندك بس اللي كتبه. ممنوع تكتب جملة توحي إنك فحصت إشي («حسابك عامل كذا»). استخدم «من كلامك…» أو «الأغلب إنه…». لو خمّنت غلط وحكيت بيقين، بيعرف إنك ما شفت إشي وبتخسر الثقة فوراً.
- فكرة وحدة بس. ممنوع قوائم.
- ابدأ بالفكرة مباشرة. بلا مقدمات زي «أكيد» أو «إليك».
- لازم تكون محدّدة لنشاطه هو. لو كتب إنه «بالليل فاضي» لازم الفكرة تحكي عن الليل.
- ٤٠ لـ ٨٠ كلمة. ولا كلمة زيادة.
- بلا إيموجي وبلا عناوين.`
    : `You are Nabd — the AI assistant of Rayan Elwathiq, a Jordanian marketer who works on the cause, not the symptom. You give one marketing idea that can be executed this week on a small budget.

Before anything: is this a real business?
- If it is an obvious prank, random characters, an impossible business ("my girlfriend Cockroach sells aeroplanes to little girls"), or obscene language — **do not give an idea**.
- Instead write two lines: show you got the joke, lightly and without sarcasm, and invite them to try again with a real business so they get something useful.
- If it is obscene: do not repeat or comment on it. One dry line that this cannot be worked with, and stop.
- ⚠️ Be fair: a small, unusual, briefly-described, or misspelled business is NOT a prank. When torn, treat it as real and give the idea.

If the business is real — the usual case — strict rules:
- One idea only. Never a list.
- Start with the idea itself. No preambles like "Sure" or "Here is".
- It must be specific to their business. If they wrote "empty at night", the idea must address nights.
- 40 to 80 words. Not one more.
- No emoji, no headings.`;

  const user = isAr
    ? `النشاط: ${industry || 'غير محدّد'}\nالهدف: ${goal || 'غير محدّد'}\nكلام صاحب النشاط بالحرف: ${
        notes || 'ما كتب إشي'
      }\n\nاعطيني الفكرة.`
    : `Business: ${industry || 'unspecified'}\nGoal: ${goal || 'unspecified'}\nIn their own words: ${
        notes || 'nothing written'
      }\n\nGive me the idea.`;

  let text;
  try {
    text = await askAI(env, system, user, isAr);
  } catch (e) {
    // فشل الموديل مش ذنب الزائر — منرجّعله محاولته
    if (reserved) await refundIdeaQuota(env, request);
    return json({ error: 'ai-failed', why: String(e.message||e).slice(0,300) }, 502, origin);
  }
  if (!text) {
    if (reserved) await refundIdeaQuota(env, request);
    return json({ error: 'ai-failed' }, 502, origin);
  }

  return json({ ok: true, idea: text, engine: env.ANTHROPIC_KEY ? 'claude' : 'workers-ai' }, 200, origin);
}

// ═══════════════════════════════════════════════════════════════
//  ٢.٥) «ارسم عميلك» — بيرسونا حقيقية لمشروع الزائر
//
//  اللعبة بتعلّم بخيارات جاهزة، وهاي الميزة بتحوّل التعلم لفايدة:
//  الزائر بيكتب سطر عن مشروعه هو، و«نبض» بيرسمله مسودة أولى
//  لبيرسونا **زبونه هو** — بنفس شكل بطاقة اللعبة.
//
//  ليش مش قالب اللعبة الثابت؟ لأنه قالب اللعبة مبني على «صاحب
//  مشروع» (زبون ريّان). زبون المطعم مش صاحب مشروع — فالموديل
//  بيكتب البطاقة كاملة بنفسه والتحقق تحت بيضبط الشكل والحدود.
//
//  التكلفة: استدعاء لكل طلب — فنفس فلسفة مختبر الأفكار:
//  حصة أضيق (٣ للزائر) لأنه الرد أطول وأغلى من فكرة.
// ═══════════════════════════════════════════════════════════════
const PERSONA_PER_VISITOR_DAY = 3;
const PERSONA_GLOBAL_DAY = 60;

// نفس جدول idea_quota — المفاتيح ما بتتصادم لأنه البصمة مبدوءة
// بـ 'p' والصف الكلي '*persona' مش '*'
async function personaKey(request) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('persona:' + ip));
  return (
    'p' +
    [...new Uint8Array(buf)]
      .slice(0, 8)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  );
}

async function reservePersonaQuota(env, request, isAr) {
  await ensureQuotaTable(env);
  const day = new Date().toISOString().slice(0, 10);
  const who = await personaKey(request);

  await env.LEADS.batch([
    env.LEADS.prepare(
      'INSERT INTO idea_quota (day, who, n) VALUES (?1, ?2, 1) ON CONFLICT(day, who) DO UPDATE SET n = n + 1',
    ).bind(day, who),
    env.LEADS.prepare(
      "INSERT INTO idea_quota (day, who, n) VALUES (?1, '*persona', 1) ON CONFLICT(day, who) DO UPDATE SET n = n + 1",
    ).bind(day),
  ]);

  const rows = await env.LEADS.prepare(
    "SELECT who, n FROM idea_quota WHERE day = ?1 AND who IN (?2, '*persona')",
  )
    .bind(day, who)
    .all();

  let mine = 0;
  let all = 0;
  for (const r of rows.results || []) {
    if (r.who === '*persona') all = r.n;
    else mine = r.n;
  }

  if (mine > PERSONA_PER_VISITOR_DAY) {
    await refundPersonaQuota(env, request);
    return {
      ok: false,
      scope: 'visitor',
      message: isAr
        ? 'رسمتلك ثلاث بيرسونات اليوم — بتكفي تبلّش فيهم. ارجعلي بكرا، أو إذا الموضوع جدّي عبّي طلب مشروع وريّان بيبني البيرسونا من محادثات زباينك الحقيقيين.'
        : 'That is your three personas for today — enough to start with. Come back tomorrow, or if this is serious, send a project brief and Rayan will build the persona from your real customer conversations.',
    };
  }

  if (all > PERSONA_GLOBAL_DAY) {
    await refundPersonaQuota(env, request);
    return {
      ok: false,
      scope: 'day',
      message: isAr
        ? 'الرسّام أخد نصيبه اليوم وارتاح. ارجعلي بكرا الصبح — أو عبّي طلب مشروع وبتوصلك قراءة شخصية مش مولّدة.'
        : 'The persona painter has done its share for today. Come back tomorrow morning — or send a project brief and you will get a personal read, not a generated one.',
    };
  }

  return { ok: true };
}

async function refundPersonaQuota(env, request) {
  try {
    const day = new Date().toISOString().slice(0, 10);
    const who = await personaKey(request);
    await env.LEADS.batch([
      env.LEADS.prepare('UPDATE idea_quota SET n = n - 1 WHERE day = ?1 AND who = ?2 AND n > 0').bind(day, who),
      env.LEADS.prepare("UPDATE idea_quota SET n = n - 1 WHERE day = ?1 AND who = '*persona' AND n > 0").bind(day),
    ]);
  } catch (e) {
    /* أسوأ حالة: محاولة محسوبة زيادة */
  }
}

// ⚠️ التحقق بيقبل شكلين: بيرسونا كاملة، أو «مزحة» (سطرين خفاف
//    لما المدخل هزار) — نفس فلترة الجدية بمختبر الأفكار.
function validPersona(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return false;
  if (typeof p.joke === 'string') return !!p.joke.trim() && p.joke.length <= 400;
  if (typeof p.who !== 'string' || !p.who.trim() || p.who.length > 180) return false;
  if (!Array.isArray(p.fields) || p.fields.length < 4 || p.fields.length > 6) return false;
  if (!p.fields.every((f) => typeof f === 'string' && f.trim() && f.length <= 240)) return false;
  if (typeof p.text !== 'string' || !p.text.trim() || p.text.length > 950) return false;
  return true;
}

async function handlePersona(request, env, origin) {
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'bad-json' }, 400, origin);

  const isAr = body.lang === 'ar';
  const biz = clean(body.biz, 700);
  if (!biz || biz.length < 8) return json({ error: 'empty' }, 422, origin);

  // بلا مفتاح كلود ما منولّد — الرسم بدو جودة، مش شبكة الأمان
  if (!env.ANTHROPIC_KEY) {
    return json(
      {
        error: 'ai-off',
        message: isAr ? 'الرسّام مش متوفر هلأ — جرب بعدين.' : 'The painter is unavailable right now — try again later.',
      },
      503,
      origin,
    );
  }

  let reserved = false;
  try {
    const q = await reservePersonaQuota(env, request, isAr);
    if (!q.ok) return json({ error: 'quota', scope: q.scope, message: q.message }, 429, origin);
    reserved = true;
  } catch (e) {
    // نظام الحد تعطّل — منكمّل، تعطيل الحماية ما بيبرّر تعطيل الخدمة
  }

  const sys = isAr
    ? `أنت «نبض» — المساعد الذكي تبع ريّان الواثق، مسوّق أردني بيشتغل على السبب مش العَرَض. الزائر خلّص لعبة «ارسم عميلك» بالموقع وهلأ كتبلك سطر عن مشروعه هو، وبدك ترسمله مسودة أولى لبيرسونا **زبونه الأساسي** — مش بيرسونا الزائر نفسه.

قبل أي إشي: هل هذا نشاط حقيقي؟
- لو الكلام هزار واضح أو حروف عشوائية أو نشاط مستحيل أو ألفاظ خارجة عن الحياء — **ما ترسم**. رجّع {"joke":"سطرين بالعامية بيبيّنوا إنك فهمت المزحة بخفة دم بلا سخرية جارحة، ودعوة يرجع يكتب نشاطه الحقيقي"}. ولو الكلام بذيء: جملة وحدة جافة محترمة بلا ما تعيده.
- ⚠️ كن عادل: نشاط صغير أو غريب أو مكتوب باختصار أو فيه أخطاء إملائية **مش هزار**. لو مترجّح، اعتبره جدّي وارسم.

ولو النشاط حقيقي — وهاي الحالة الغالبة — رجّع JSON بهالشكل بالضبط:
{"who":"...","fields":["...","...","...","...","..."],"text":"..."}

- who: سطر واحد بيوصف الزبون الأساسي المرجّح وصف إنساني حي (مش «ذكور ٢٥-٣٥» — بل مين هو وشو وضعه لما بيدوّر على هيك خدمة). حد أقصى ١٥٠ حرف.
- fields: خمس جمل قصيرة بهالترتيب: ١) المشكلة اللي بتخليه يدوّر أصلاً ٢) شو غالباً جرّب قبل ٣) أكثر إشي بيخوفه بالشراء ٤) السؤال اللي براسه قبل ما يدفع (بصيغة سؤال بين قوسين «») ٥) الجملة اللي لو سمعها من صاحب المشروع بيوقف ويقول «هدول فاهمينّي» (بين قوسين «»). كل جملة حد أقصى ٢٠٠ حرف.
- text: فقرة وحدة ٦٠-١٠٠ كلمة بتجمع كل هاد بوصف شخص حقيقي بتعرف تحكي معه — بتنقرا كقصة قصيرة مش كقائمة.

قواعد صارمة:
- عامية أردنية محكية. لا فصحى ولا خليجي ولا مصري. وممنوع «هنّ» و«أنتنّ» — العامية بتستخدم «هم» للجميع.
- ⚠️ ما شفت حسابه ولا زباينه — هاي مسودة ترجيحية من وصفه بس. استخدم صيغ الترجيح وين ما لزم: «غالباً»، «الأرجح»، «من نوع اللي». ممنوع اليقين المدّعي.
- البيرسونا لازم تكون محدّدة لنشاطه هو: زبون مطعم غير زبون عيادة غير زبون متجر أواعي. ممنوع كلام بينطبق على أي مشروع.
- ممنوع وعود وأرقام وأسعار، ممنوع إيموجي، ممنوع Markdown.
- رجّع JSON فقط — بلا أي نص قبله أو بعده وبلا أسوار كود.`
    : `You are Nabd — the AI assistant of Rayan Elwathiq, a Jordanian marketer who works on the cause, not the symptom. The visitor just finished the "Draw Your Customer" game on the site and wrote you a line about THEIR business. Draw them a first draft of THEIR primary customer's persona — not the visitor's own persona.

Before anything: is this a real business?
- If it is an obvious prank, random characters, an impossible business, or obscene language — do NOT draw. Return {"joke":"two light lines showing you got the joke, no sarcasm, inviting them to come back with their real business"}. If obscene: one dry respectful line without repeating it.
- ⚠️ Be fair: a small, unusual, briefly-described, or misspelled business is NOT a prank. When torn, treat it as real and draw.

If the business is real — the usual case — return JSON in exactly this shape:
{"who":"...","fields":["...","...","...","...","..."],"text":"..."}

- who: one line describing the likely primary customer as a living human (not "males 25-35" — who they are and what situation sends them looking). Max 150 chars.
- fields: five short sentences in this order: 1) the problem that makes them search at all 2) what they most likely tried before 3) their biggest fear about buying 4) the question in their head before paying (phrased as a quoted question) 5) the line that would make them stop and say "these people get me" (quoted). Max 200 chars each.
- text: one paragraph of 60-100 words weaving it all into a real person you would know how to talk to — reads like a short story, not a list.

Strict rules:
- ⚠️ You have not seen their account or customers — this is a likelihood draft from their description only. Hedge where needed: "most likely", "probably", "the kind who". No fake certainty.
- The persona must be specific to THEIR business: a restaurant's customer differs from a clinic's differs from a clothing store's. Nothing that fits any business.
- No promises, numbers or prices. No emoji. No Markdown.
- Return JSON ONLY — no text before or after, no code fences.`;

  const user = isAr ? `وصف المشروع بالحرف: ${biz}\n\nارسم البيرسونا.` : `The business, in their words: ${biz}\n\nDraw the persona.`;

  let persona = null;
  try {
    // ⚠️ العربي بياخد توكنز أكثر — والسقف الافتراضي (١٢٠٠ حرف)
    //    بيقص الـ JSON بنصه
    const raw = await askClaude(env, sys, user, { maxTokens: 3000, maxLen: 6000 });
    if (raw) {
      const jsonText = raw.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
      const parsed = JSON.parse(jsonText);
      if (validPersona(parsed)) persona = parsed;
    }
  } catch (e) {
    /* بيتعالج تحت — فشل الموديل أو JSON مكسور نفس الإشي */
  }

  if (!persona) {
    if (reserved) await refundPersonaQuota(env, request);
    return json({ error: 'ai-failed' }, 502, origin);
  }

  if (persona.joke) return json({ ok: true, joke: persona.joke }, 200, origin);
  return json({ ok: true, persona: { who: persona.who, fields: persona.fields, text: persona.text } }, 200, origin);
}

// ═══════════════════════════════════════════════════════════════
//  ٣) «عين البراند» — أسئلة جديدة كل يوم
//
//  الفكرة الاقتصادية: **مش استدعاء لكل زائر**. دفعة اليوم بتتولّد
//  مرة وحدة وبتنخزن بـ D1، وكل اللاعبين بياخدوا منها. يعني سقف
//  التكلفة استدعاءان باليوم (عربي + إنجليزي) مهما لعبوا — فما في
//  داعي لحصص زوار زي مختبر الأفكار.
//
//  أول زائر باليوم بياخد [] فوراً (اللعبة بتكمّل بالبنك المحلي
//  بدون ما يحس) والتوليد بيصير بالخلفية — الزائر اللي بعده بياخد
//  أسئلة اليوم. قفل بـ D1 بيمنع توليدين متوازيين.
//
//  ⚠️ الموديل ما بيكتب CSS — بيرجّع نفس عقد بنك الأسئلة بالضبط
//     (principle / q / why / bad) والتحقق هون بيرفض أي قيمة برا
//     الحدود، فسؤال مكسور ما بيوصل المتصفح أبداً.
// ═══════════════════════════════════════════════════════════════
const EYE_PER_DAY = 8; // كم سؤال جديد بدفعة اليوم

let eyeTableReady = null;
const ensureEyeTable = (env) =>
  (eyeTableReady ||= env.LEADS.exec(
    "CREATE TABLE IF NOT EXISTS eye_rounds (day TEXT NOT NULL, lang TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'gen', json TEXT, at TEXT, PRIMARY KEY (day, lang))",
  ));

// ═══════════════════════════════════════════════════════════════
//  قفل التوليد اليومي — مشترك بين عين البراند وكشف الشركة
//
//  ⚠️ درس 2026-08-04: التوليد بالخلفية (waitUntil) ممكن **ينقتل**
//     قبل ما يخلص (حد زمني عند كلاودفلير) — وساعتها الـ catch نفسه
//     ما بيشتغل، فالقفل بيضل يتيم بحالة 'gen' وبيسكّر اليوم كله.
//     الحل: قفل أكبر من دقيقتين ونص بجانب json فاضي = ميت،
//     منشيله ومنعيد المحاولة.
// ═══════════════════════════════════════════════════════════════
const GEN_STALE_MS = 150000;

async function lockAndGenerate(env, ctx, table, day, lang, row, generate) {
  const now = Date.now();
  const tryLock = async () => {
    const lock = await env.LEADS.prepare(
      `INSERT INTO ${table} (day, lang, status, at) VALUES (?1, ?2, 'gen', ?3) ON CONFLICT(day, lang) DO NOTHING`,
    )
      .bind(day, lang, new Date(now).toISOString())
      .run();
    if (lock.meta && lock.meta.changes === 1) ctx.waitUntil(generate(env, day, lang));
  };

  if (!row) return tryLock();

  // قفل موجود بلا نتيجة: يا توليد شغّال هلأ، يا قفل يتيم
  const age = now - Date.parse(row.at || 0);
  const alive = age >= 0 && age < GEN_STALE_MS;
  if (!alive) {
    await env.LEADS.prepare(`DELETE FROM ${table} WHERE day = ?1 AND lang = ?2 AND json IS NULL`)
      .bind(day, lang)
      .run();
    return tryLock();
  }
}

// حدود كل متغيّر — نفس DEFAULTS بملف src/data/brand-eye.js
// (لو ضفت متغيّر هناك، ضيفه هون وإلا الموديل ما بيقدر يستعمله)
const EYE_COLORS = ['accent', 'text', 'muted', 'faint', 'pink', 'blue', 'gold', 'violet'];
const EYE_VARS = {
  bodyOpacity: (v) => typeof v === 'number' && v >= 0.08 && v <= 1,
  titleSize: (v) => typeof v === 'number' && v >= 10 && v <= 40,
  bodySize: (v) => typeof v === 'number' && v >= 8 && v <= 24,
  titleWeight: (v) => typeof v === 'number' && v >= 100 && v <= 900,
  bodyWeight: (v) => typeof v === 'number' && v >= 100 && v <= 900,
  pad: (v) => typeof v === 'number' && v >= 0 && v <= 60,
  gap: (v) => typeof v === 'number' && v >= 0 && v <= 40,
  radius: (v) => typeof v === 'number' && v >= 0 && v <= 40,
  ctaRadius: (v) => typeof v === 'number' && v >= 0 && v <= 48,
  eyebrowColor: (v) => EYE_COLORS.includes(v),
  bodyColor: (v) => EYE_COLORS.includes(v),
  titleColor: (v) => EYE_COLORS.includes(v),
  ctaColor: (v) => EYE_COLORS.includes(v),
  tracking: (v) => typeof v === 'number' && v >= -5 && v <= 30,
  align: (v) => v === 'start' || v === 'center',
  ctas: (v) => v === 1 || v === 2 || v === 3,
  maxWidth: (v) => typeof v === 'number' && v >= 16 && v <= 60,
  ornament: (v) => v === 0 || v === 1,
};

function validEyeRound(r) {
  if (!r || typeof r !== 'object') return false;
  if (typeof r.principle !== 'string' || !r.principle.trim() || r.principle.length > 60) return false;
  if (typeof r.q !== 'string' || !r.q.trim() || r.q.length > 200) return false;
  if (typeof r.why !== 'string' || !r.why.trim() || r.why.length > 500) return false;
  if (!r.bad || typeof r.bad !== 'object' || Array.isArray(r.bad)) return false;
  const keys = Object.keys(r.bad);
  if (!keys.length || keys.length > 2) return false;
  return keys.every((k) => EYE_VARS[k] && EYE_VARS[k](r.bad[k]));
}

async function handleBrandEye(request, env, origin, ctx) {
  const body = await request.json().catch(() => null);
  const lang = body && (body.locale || '').startsWith('ar') ? 'ar' : 'en';

  await ensureEyeTable(env);
  const day = new Date().toISOString().slice(0, 10);

  const row = await env.LEADS.prepare('SELECT status, json, at FROM eye_rounds WHERE day = ?1 AND lang = ?2')
    .bind(day, lang)
    .first();

  // دفعة اليوم جاهزة؟ رجّعها — هاد المسار الرخيص اللي بيمشي ٩٩٪ من الوقت
  if (row && row.json) {
    let rounds = [];
    try {
      rounds = JSON.parse(row.json);
    } catch (e) {
      /* صف معطوب — منرجّع [] واللعبة بتكمل بالبنك المحلي */
    }
    return json({ ok: true, rounds, day }, 200, origin);
  }

  // ما في مفتاح؟ ما منولّد — اللعبة بتشتغل بالبنك المحلي عادي
  if (!env.ANTHROPIC_KEY) return json({ ok: true, rounds: [] }, 200, origin);

  // قفل التوليد: أول طلب باليوم بس هو اللي بيولّد (بالخلفية) —
  // مع استرجاع القفل اليتيم لو التوليد السابق انقتل بنصه
  await lockAndGenerate(env, ctx, 'eye_rounds', day, lang, row, generateEyeRounds);

  return json({ ok: true, rounds: [], pending: true }, 200, origin);
}

async function generateEyeRounds(env, day, lang) {
  try {
    const isAr = lang === 'ar';
    const sys = isAr
      ? `أنت محرّك أسئلة للعبة «عين البراند» بموقع ريّان الواثق. اللعبة بتعرض نفس التصميم بنسختين: وحدة مضبوطة ووحدة فيها خلل واحد، والزائر بيختار الأقوى.

النموذج بطاقة تسويقية فيها: سطر تصنيف (eyebrow)، عنوان، وصف قصير، وأزرار. أنت ما بتكتب CSS — بتختار متغيّر واحد (أو اثنين مرتبطين) وبتكسر قيمته.

المتغيّرات المسموحة وقيمها المضبوطة وحدودها:
bodyOpacity 0.78 (0.08-1 · أوطى من 0.35 = نص ما بينقرا)
titleSize 21 (10-40) · bodySize 13 (8-24)
titleWeight 700 · bodyWeight 400 (100-900)
pad 26 (0-60 · مسافة داخلية) · gap 8 (0-40 · بين العناصر)
radius 12 · ctaRadius 12 (لازم يتساووا بالنظام المضبوط · 0-48)
eyebrowColor "accent" · bodyColor "muted" · titleColor "text" · ctaColor "accent" (المسموح: accent/text/muted/faint/pink/blue/gold/violet)
tracking 0 (-5 لـ 30 · تباعد حروف) · align "start" ("start" أو "center")
ctas 1 (1-3 · عدد الأزرار) · maxWidth 34 (16-60 · عرض النص بالحروف) · ornament 0 (0 أو 1 · زخرفة زايدة)

اكتب ${EYE_PER_DAY} أسئلة جديدة ومتنوعة. لكل سؤال:
- principle: اسم المبدأ بالعربي (قصير، مثل «التباين» أو «الانضباط اللوني»)
- q: سؤال قصير بالعامية الأردنية بيحط الزائر بسياق تسويقي حقيقي
- why: شرح جملتين لثلاثة بالعامية، بصوت مسوّق مش أكاديمي — ليش النسخة المضبوطة بتبيع أكثر
- bad: كائن فيه متغيّر واحد (أو اثنين مرتبطين بالكثير) بقيمة مكسورة ضمن الحدود فوق

نوّع المبادئ: تباين، تسلسل، ألوان، مساحة، اتساق، تركيز، قراءة. الخلل لازم يكون ملحوظ بصرياً مش خفي.

رجّع مصفوفة JSON فقط — بلا أي نص قبلها أو بعدها وبلا أسوار كود.`
      : `You are the question engine for "The Brand Eye" game on Rayan Elwathiq's site. The game shows the same design twice: one correct, one with a single flaw, and the visitor picks the stronger one.

The template is a marketing card: an eyebrow line, a title, a short body, and buttons. You never write CSS — you pick one variable (or two related ones) and break its value.

Allowed variables, their correct values and bounds:
bodyOpacity 0.78 (0.08-1, below 0.35 = unreadable)
titleSize 21 (10-40) · bodySize 13 (8-24)
titleWeight 700 · bodyWeight 400 (100-900)
pad 26 (0-60, inner padding) · gap 8 (0-40, between elements)
radius 12 · ctaRadius 12 (must match in the correct system, 0-48)
eyebrowColor "accent" · bodyColor "muted" · titleColor "text" · ctaColor "accent" (allowed: accent/text/muted/faint/pink/blue/gold/violet)
tracking 0 (-5 to 30, letter-spacing) · align "start" ("start" or "center")
ctas 1 (1-3, button count) · maxWidth 34 (16-60, text width in ch) · ornament 0 (0 or 1, extra decoration)

Write ${EYE_PER_DAY} fresh, varied questions. Each:
- principle: the principle's short name (e.g. "Contrast", "Color discipline")
- q: a short question placing the visitor in a real marketing context
- why: two to three sentences in a marketer's voice, not an academic's — why the correct version sells better
- bad: an object with one broken variable (two related ones at most), values within the bounds above

Vary the principles: contrast, hierarchy, color, spacing, consistency, focus, readability. The flaw must be visually noticeable, not subtle.

Return a JSON array ONLY — no text before or after, no code fences.`;

    // ⚠️ العربي بياخد توكنز أكثر من الإنجليزي لنفس الكلام —
    //    سقف ضيّق بيقص الـ JSON بنصه وبيفشّل الدفعة كلها
    const raw = await askClaude(env, sys, isAr ? 'ولّد أسئلة اليوم.' : "Generate today's questions.", {
      maxTokens: 7000,
      maxLen: 16000,
    });
    if (!raw) throw new Error('empty');

    // الموديل أحياناً بيلف الرد بأسوار كود رغم التعليمة — منشيلها
    const jsonText = raw.replace(/^[^\[]*/, '').replace(/[^\]]*$/, '');
    const parsed = JSON.parse(jsonText);
    const rounds = (Array.isArray(parsed) ? parsed : []).filter(validEyeRound).slice(0, EYE_PER_DAY);

    // أقل من ٤ أسئلة سليمة = دفعة فاشلة — منشيل القفل عشان
    // طلب جاي يجرّب من جديد بدل ما يعلق اليوم كله فاضي
    if (rounds.length < 4) {
      await env.LEADS.prepare('DELETE FROM eye_rounds WHERE day = ?1 AND lang = ?2').bind(day, lang).run();
      return;
    }

    await env.LEADS.prepare("UPDATE eye_rounds SET status = 'ready', json = ?3 WHERE day = ?1 AND lang = ?2")
      .bind(day, lang, JSON.stringify(rounds))
      .run();
  } catch (e) {
    // فشل التوليد — منشيل القفل والبنك المحلي مغطّي بأي حال
    try {
      await env.LEADS.prepare("DELETE FROM eye_rounds WHERE day = ?1 AND lang = ?2 AND json IS NULL")
        .bind(day, lang)
        .run();
    } catch (e2) {
      /* ولا إشي */
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  ٤) «كشف الشركة» — جولات جديدة كل يوم
//
//  نفس اقتصاد عين البراند بالضبط: **مش استدعاء لكل زائر** —
//  دفعة اليوم بتتولّد مرة وحدة وبتنخزن بـ D1، وكل اللاعبين
//  بياخدوا منها. سقف التكلفة استدعاءان باليوم (عربي + إنجليزي).
//
//  الجولات الجديدة ما بتلمس القوس القصصي الأساسي (السبع جولات
//  المكتوبة بإيد) — بتنعرض كمرحلة «جولات اليوم» اختيارية بعد
//  النتيجة، فالحكم النهائي وعتباته بيضلوا مضبوطين.
//
//  ⚠️ توازن الأعلام شرط قبول: لو الدفعة كلها أعلام حمراء اللعبة
//     بتصير «اكبس أحمر دايماً» — منرفض أي دفعة فيها أقل من
//     علمين أو أقل من ردين طبيعيين.
// ═══════════════════════════════════════════════════════════════
const DET_PER_DAY = 6;

let detTableReady = null;
const ensureDetTable = (env) =>
  (detTableReady ||= env.LEADS.exec(
    "CREATE TABLE IF NOT EXISTS det_rounds (day TEXT NOT NULL, lang TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'gen', json TEXT, at TEXT, PRIMARY KEY (day, lang))",
  ));

function validDetRound(r) {
  if (!r || typeof r !== 'object') return false;
  if (typeof r.q !== 'string' || !r.q.trim() || r.q.length > 220) return false;
  if (typeof r.a !== 'string' || !r.a.trim() || r.a.length > 420) return false;
  if (typeof r.flag !== 'boolean') return false;
  if (typeof r.why !== 'string' || !r.why.trim() || r.why.length > 500) return false;
  return true;
}

async function handleDetectorRounds(request, env, origin, ctx) {
  const body = await request.json().catch(() => null);
  const lang = body && (body.locale || '').startsWith('ar') ? 'ar' : 'en';

  await ensureDetTable(env);
  const day = new Date().toISOString().slice(0, 10);

  const row = await env.LEADS.prepare('SELECT status, json, at FROM det_rounds WHERE day = ?1 AND lang = ?2')
    .bind(day, lang)
    .first();

  if (row && row.json) {
    let rounds = [];
    try {
      rounds = JSON.parse(row.json);
    } catch (e) {
      /* صف معطوب — اللعبة الأساسية كاملة بدونه */
    }
    return json({ ok: true, rounds, day }, 200, origin);
  }

  if (!env.ANTHROPIC_KEY) return json({ ok: true, rounds: [] }, 200, origin);

  await lockAndGenerate(env, ctx, 'det_rounds', day, lang, row, generateDetRounds);

  return json({ ok: true, rounds: [], pending: true }, 200, origin);
}

async function generateDetRounds(env, day, lang) {
  try {
    const isAr = lang === 'ar';
    const sys = isAr
      ? `أنت محرّك جولات للعبة «كشف الشركة» بموقع ريّان الواثق. اللعبة محادثة مع شركة تسويق وهمية: الزائر بيسأل، الشركة بترد، وهو بيحكم على كل رد — طبيعي ولا علم أحمر؟ وبعد الحكم بيقرأ ليش.

اكتب ${DET_PER_DAY} جولات جديدة. كل جولة:
- q: سؤال الزائر بالعامية الأردنية (زبون محتمل بيفحص شركة تسويق — أسئلة حقيقية بتنسأل فعلاً)
- a: رد الشركة — والشرط الذهبي: **لازم يبين منطقي ومقنع لأول وهلة**، من النوع اللي بينسمع فعلاً بالسوق. العلم الأحمر اللي بيجي «أحمر» من أول كلمة لعبة فاشلة.
- flag: ‏true لو الرد علم أحمر، false لو رد صحي
- why: شرح جملتين لثلاثة بالعامية بصوت مسوّق مش أكاديمي — ليش هاد علم (أو ليش هاد رد صحي)

نوّع الأعلام الحمراء (لا تكرر نفس النوع مرتين): خصم ضغط «العرض بيخلص اليوم»، وعد بعدد متابعين، «منشتغل مع كل المجالات بنفس الطريقة»، تقارير أرقام استعراضية بلا قرارات، «التصميم هو كل إشي»، احتكار الحسابات (الباسوردات معهم بس)، «ما في داعي لعقد مكتوب»، نتائج فورية بأول أسبوع…
والردود الصحية لازم تكون فعلاً منيحة: أسئلة تشخيص، صراحة عن اللي ما بينضمن، حدود واضحة للشغل، اعتراف بإنه في إشي بدو دراسة.

⚠️ اللعبة الأساسية غطّت هدول — لا تكررهم: قائمة باكجات بأول رد، ضمان مبيعات من أول شهر، نتائج مطعم ومتجر كوعد، كل الحكي عن جودة التصميم والمونتاج.
⚠️ التوازن شرط: ٣ أعلام و٣ ردود صحية (أو ٤/٢ كأقصى ميل).
⚠️ رتّبهم بقوس قصة: ابدأ بسؤال افتتاحي طبيعي وسخّن بالتدريج.

رجّع مصفوفة JSON فقط — بلا أي نص قبلها أو بعدها وبلا أسوار كود.`
      : `You are the round engine for "The Company Detector" game on Rayan Elwathiq's site. The game is a chat with a fictional marketing company: the visitor asks, the company replies, and the visitor judges each reply — normal or red flag? After judging they read why.

Write ${DET_PER_DAY} fresh rounds. Each:
- q: the visitor's question (a potential client vetting a marketing company — real questions people actually ask)
- a: the company's reply — the golden rule: **it must sound reasonable and convincing at first glance**, the kind actually heard in the market. A flag that arrives obviously red is a failed round.
- flag: true if the reply is a red flag, false if it is healthy
- why: two to three sentences in a marketer's voice, not an academic's — why this is a flag (or why it is healthy)

Vary the red flags (never the same type twice): pressure discounts ("offer ends today"), follower-count promises, "we work with every industry the same way", vanity-number reports with no decisions, "design is everything", holding accounts hostage (only they keep the passwords), "no need for a written contract", instant results in week one…
Healthy replies must be genuinely good: diagnosis questions, honesty about what cannot be guaranteed, clear scope boundaries, admitting something needs study first.

⚠️ The base game already covered these — do not repeat them: a package price list as the first reply, guaranteed sales from month one, another client's results as a promise, everything about design and editing quality.
⚠️ Balance is required: 3 flags and 3 healthy replies (4/2 at most).
⚠️ Order them as a story arc: open naturally, heat up gradually.

Return a JSON array ONLY — no text before or after, no code fences.`;

    // ⚠️ Sonnet مش Opus: دفعة الكشف أطول من دفعة العين (سؤال + رد +
    //    شرح × ٦)، وOpus كان بياخد أطول من مهلة الخلفية وبينقتل
    //    بنصه — هيك اكتشفنا ثغرة القفل اليتيم أصلاً.
    const raw = await askClaude(env, sys, isAr ? 'ولّد جولات اليوم.' : "Generate today's rounds.", {
      maxTokens: 7000,
      maxLen: 16000,
      model: 'claude-sonnet-5',
    });
    if (!raw) throw new Error('empty');

    const jsonText = raw.replace(/^[^\[]*/, '').replace(/[^\]]*$/, '');
    const parsed = JSON.parse(jsonText);
    const rounds = (Array.isArray(parsed) ? parsed : []).filter(validDetRound).slice(0, DET_PER_DAY);

    // شرطا القبول: عدد كافي + توازن أعلام/طبيعي
    const flags = rounds.filter((r) => r.flag).length;
    if (rounds.length < 4 || flags < 2 || rounds.length - flags < 2) {
      await env.LEADS.prepare('DELETE FROM det_rounds WHERE day = ?1 AND lang = ?2').bind(day, lang).run();
      return;
    }

    await env.LEADS.prepare("UPDATE det_rounds SET status = 'ready', json = ?3 WHERE day = ?1 AND lang = ?2")
      .bind(day, lang, JSON.stringify(rounds))
      .run();
  } catch (e) {
    try {
      await env.LEADS.prepare('DELETE FROM det_rounds WHERE day = ?1 AND lang = ?2 AND json IS NULL')
        .bind(day, lang)
        .run();
    } catch (e2) {
      /* ولا إشي */
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  تنظيف مخرجات الموديل من علامات Markdown
//
//  ليش بالكود مش بالبرومبت؟ لأنه البرومبت مكتوب فيه «بلا عناوين»
//  والموديل التزم فيه ٨ مرات من ٩ بفحص 2026-08-02 — وبالتاسعة
//  بلّش الرد بـ «# ركّز على الميكانيكيين». التعليمة بتقلّل الزلّة
//  بس ما بتلغيها، والزائر بيشوف علامة # حرفية عالشاشة.
//
//  فالبرومبت بيقلّل الاحتمال، وهاي بتسكّر الباب. الاثنين لازم.
// ═══════════════════════════════════════════════════════════════
function stripMarkdown(t) {
  if (!t) return t;
  return t
    .replace(/^#{1,6}\s+/gm, '')        // عناوين: # ## ###
    .replace(/\*\*(.+?)\*\*/g, '$1')    // عريض
    .replace(/(^|\s)\*(\S[^*]*?)\*/g, '$1$2') // مائل (بلا ما نلمس * لحالها)
    .replace(/^\s*[-*+]\s+/gm, '')      // نقاط القوائم
    .replace(/`{1,3}/g, '')             // كود
    .replace(/\n{3,}/g, '\n\n')         // أسطر فاضية زايدة
    .trim();
}

// ═══════════════════════════════════════════════════════════════
//  نقطة الذكاء الاصطناعي الوحيدة بالملف
//
//  كلود إذا المفتاح موجود، وإلا Workers AI المجاني.
//  ما في مكان تاني بيستدعي موديل — فأي تبديل مستقبلي هون وبس.
//  والتنظيف بينطبق على الاثنين من هون، فما في مخرج بيفوت بلا فلترة.
// ═══════════════════════════════════════════════════════════════
async function askAI(env, system, user, isAr) {
  const out = env.ANTHROPIC_KEY
    ? await askClaude(env, system, user)
    : await askWorkersAI(env, system, user, isAr);
  return stripMarkdown(out);
}

// opts: { maxTokens, maxLen } — دفعة أسئلة عين البراند أطول من رد
// عادي، فالحدود الافتراضية (٢٠٠٠ توكن / ١٢٠٠ حرف) بتقصّها وبتكسر
// الـ JSON. الافتراضي بيضل زي ما هو لكل النداءات الموجودة.
async function askClaude(env, system, user, opts) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      // ⚠️ opts.model للدفعات الطويلة: توليد بالخلفية (waitUntil)
      //    بينقتل لو طوّل، وSonnet بيخلص الدفعة بثلث وقت Opus.
      model: (opts && opts.model) || env.CLAUDE_MODEL || CLAUDE_MODEL,
      // ⚠️ max_tokens بيغطّي التفكير **والرد** سوا. كلود Opus 5
      //    تفكيره شغّال افتراضياً، فلو حطّينا ٤٠٠ ممكن يخلصوا كلهم
      //    بالتفكير ويطلع رد فاضي. ٢٠٠٠ بتكفي بمساحة واسعة.
      max_tokens: (opts && opts.maxTokens) || 2000,
      // ⚠️ ما في temperature. الموديلات الجديدة بترفضه وبترجّع 400 —
      //    وهاد بالضبط اللي كان بيفشل. التحكم بالأسلوب صار بالأوامر
      //    نفسها، وبمستوى الجهد تحت.
      output_config: { effort: 'low' },
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });

  if (!r.ok) {
    // ⚠️ منقرأ نص الخطأ ونرميه للفوق — بدونه كل الأعطال بتطلع
    //    «ai-failed» وبنضل نخمّن. المفتاح ما بيطلع بالرسالة.
    const t = await r.text().catch(() => '');
    throw new Error(`claude ${r.status}: ${t.slice(0, 300)}`);
  }

  const d = await r.json();

  // ⚠️ أول بلوك مش لازم يكون نص — ممكن يكون بلوك تفكير.
  //    منلمّ كل بلوكات النص بدل ما ناخد [0] وبس.
  const text = (d?.content || [])
    .filter((b) => b?.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();

  return clean(text, (opts && opts.maxLen) || 1200) || null;
}

// ⚠️ شبكة أمان بس. اقرأ التحذير المقاس فوق CF_MODEL قبل ما
//    تعتمد عليه بالعربي — الفحص أثبت إنه ما بيقرأ عربي.
async function askWorkersAI(env, system, user, isAr) {
  try {
    const r = await env.AI.run(CF_MODEL, {
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      max_tokens: 320,
      temperature: isAr ? 0.6 : 0.8,
    });
    return clean(r?.response, 1200) || null;
  } catch (e) {
    return null;
  }
}

// ─────────────────────────────────────────────
//  المدخل
// ─────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';
    const { pathname } = new URL(request.url);

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });

    // ⚠️ منرفض أي موقع مش بالقائمة — وإلا حدا تاني بيستهلك رصيدك
    if (origin && !ALLOWED.includes(origin)) return json({ error: 'forbidden' }, 403, origin);

    if (request.method !== 'POST') {
      // فحص سريع إنه الـ Worker شغّال (بتفتحه بالمتصفح)
      if (pathname === '/health') return json({ ok: true, up: true }, 200, origin);

      return json({ error: 'method' }, 405, origin);
    }

    try {
      if (pathname === '/brief') return await handleBrief(request, env, origin, ctx);
      if (pathname === '/idea') return await handleIdea(request, env, origin);
      if (pathname === '/brand-eye') return await handleBrandEye(request, env, origin, ctx);
      if (pathname === '/persona') return await handlePersona(request, env, origin);
      if (pathname === '/detector-rounds') return await handleDetectorRounds(request, env, origin, ctx);
      return json({ error: 'not-found' }, 404, origin);
    } catch (e) {
      return json({ error: 'server', why: String(e && e.message || e).slice(0, 200) }, 500, origin);
    }
  },
};
