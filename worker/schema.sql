-- جدول الطلبات. كل صف = طلب واحد من الفورم.
-- بتشوف المحتوى بأمر:  npx wrangler d1 execute ryanalali-leads --remote --command "SELECT * FROM leads ORDER BY id DESC LIMIT 10"
CREATE TABLE IF NOT EXISTS leads (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  at        TEXT NOT NULL,      -- وقت الوصول (ISO)
  lang      TEXT,               -- ar / en
  name      TEXT NOT NULL,
  mail      TEXT NOT NULL,
  phone     TEXT,
  biz       TEXT,               -- اسم النشاط
  budget    TEXT,
  timing    TEXT,
  services  TEXT,               -- مفصولة بفاصلة
  details   TEXT,               -- كلامه بالحرف
  reply     TEXT                -- الرد الأوّلي اللي انبعتله
);

-- بحث سريع بالإيميل وبالتاريخ
CREATE INDEX IF NOT EXISTS leads_mail ON leads(mail);
CREATE INDEX IF NOT EXISTS leads_at   ON leads(at);

-- ═══════════════════════════════════════════════════════════════
--  عدّادات الحد اليومي لمختبر الأفكار (مهمة #52)
--
--  صف لكل (يوم، زائر) + صف كلي لليوم who='*'. «الزائر» بصمة
--  مختصرة من الـ IP مش الـ IP نفسه — ما منحتفظ ببيانات تعريفية.
--  ⚠️ الجدول بينبنى لحاله من الـ Worker أول استعمال — هذا التعريف
--     للتوثيق ولإعادة البناء اليدوي لو انحذف.
--  شوف الاستهلاك:
--    npx wrangler d1 execute ryanalali-leads --remote --command "SELECT * FROM idea_quota ORDER BY day DESC, n DESC LIMIT 20"
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS idea_quota (
  day TEXT NOT NULL,              -- 2026-08-03 (يوم UTC)
  who TEXT NOT NULL,              -- بصمة الزائر، أو '*' للمجموع اليومي
  n   INTEGER NOT NULL DEFAULT 0, -- عدد الأفكار المولّدة
  PRIMARY KEY (day, who)
);
