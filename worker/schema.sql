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
