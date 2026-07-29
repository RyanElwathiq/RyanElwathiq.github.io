// صفحة مراجعة LUV IT — نفس فكرة صفحة الأعمال، بس لمشروع لوفيت
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'D:/Ryan-Portfolio/_inbox/luvit';
const items = JSON.parse(fs.readFileSync(path.join(OUT, 'catalog.json'), 'utf8'));

// اسم عربي مفهوم لكل مجموعة
const LABEL = {
  '.': 'ملفات عامة',
  Product: 'صور منتجات',
  'profile cover': 'أغلفة وبروفايل',
  'luv it highlights projects': 'هايلايتس',
  Posts: 'منشورات',
  'Posts luvit': 'منشورات لوفيت',
  'pictures pngs': 'صور مفرّغة',
  logo: 'لوجو',
};

const groups = [...new Set(items.map((x) => x.group))];

const card = (x) => `<label class="c" data-g="${x.group}">
  <div class="t"><img loading="lazy" src="thumbs/${x.id}.jpg" alt=""></div>
  <div class="m"><b>${x.id}</b><span class="sh">${x.shape}</span></div>
  <div class="d">${x.w}×${x.h} · ${x.kb}KB</div>
  <div class="o" title="${x.original}">${x.original}</div>
  <input class="who" placeholder="لأي إشي هاي؟" value="${x.belongsTo || ''}">
</label>`;

const html = `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>LUV IT — ${items.length} عنصر</title>
<style>
  :root{--bg:#0E0F12;--s:#15171C;--s2:#1B1E24;--tx:#F2F3EE;--mu:#A0A49B;--ac:#D9FF3F;--ln:rgba(242,243,238,.1)}
  *{box-sizing:border-box;margin:0}
  body{background:var(--bg);color:var(--tx);font:15px/1.6 system-ui,"Segoe UI",sans-serif;padding:24px}
  header{position:sticky;top:0;background:var(--bg);padding:16px 0 14px;border-bottom:1px solid var(--ln);z-index:5;margin-bottom:22px}
  h1{font-size:22px;margin-bottom:6px}
  p.sub{color:var(--mu);font-size:14px}
  .bar{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;align-items:center}
  button{font:inherit;background:var(--s2);color:var(--tx);border:1px solid var(--ln);border-radius:999px;padding:8px 15px;cursor:pointer}
  button.on{background:var(--ac);color:#111;border-color:var(--ac);font-weight:700}
  button.go{background:var(--ac);color:#111;border-color:var(--ac);font-weight:700;margin-inline-start:auto}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px}
  .c{background:var(--s);border:1px solid var(--ln);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
  .c.hide{display:none}
  .t{aspect-ratio:1;background:#000;display:grid;place-items:center;overflow:hidden}
  .t img{width:100%;height:100%;object-fit:contain}
  .m{display:flex;align-items:center;gap:8px;padding:10px 12px 3px;font-size:13px}
  .m b{font-family:ui-monospace,monospace;color:var(--ac)}
  .sh{font-size:11px;color:var(--mu)}
  .d{padding:0 12px;font-size:11.5px;color:var(--mu);font-family:ui-monospace,monospace}
  .o{padding:4px 12px 8px;font-size:11px;color:var(--mu);opacity:.65;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .who{margin:0 10px 10px;padding:9px 11px;border-radius:9px;border:1px solid var(--ln);background:var(--s2);color:var(--tx);font:inherit;font-size:13.5px}
  .who:focus{outline:none;border-color:var(--ac)}
  .who:not(:placeholder-shown){border-color:var(--ac);background:color-mix(in srgb,var(--ac) 8%,var(--s2))}
  #count{color:var(--mu);font-size:13px}
</style></head><body>
<header>
  <h1>LUV IT — ${items.length} عنصر</h1>
  <p class="sub">مفهرسة من مجلد المشروع الأصلي. اكتب تحت كل وحدة لأي إشي هي (منتج / غلاف / هايلايت / إعلان…). بتحفظ لحالها.</p>
  <div class="bar">
    <button data-f="all" class="on">الكل</button>
    ${groups.map((g) => `<button data-f="${g}">${LABEL[g] || g} (${items.filter((x) => x.group === g).length})</button>`).join('')}
    <span id="count"></span>
    <button class="go" id="copy">انسخ وابعتها لكلود</button>
  </div>
</header>
<div class="grid">${items.map(card).join('\n')}</div>
<script>
  const KEY = 'luvit-labels';
  const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
  const cards = [...document.querySelectorAll('.c')];
  cards.forEach(c => {
    const id = c.querySelector('.m b').textContent, inp = c.querySelector('.who');
    if (saved[id]) inp.value = saved[id];
    inp.addEventListener('input', () => {
      saved[id] = inp.value.trim();
      if (!saved[id]) delete saved[id];
      localStorage.setItem(KEY, JSON.stringify(saved));
      count();
    });
  });
  function count(){
    const d = cards.filter(c => c.querySelector('.who').value.trim()).length;
    document.getElementById('count').textContent = d + ' من ' + cards.length + ' معبّاية';
  }
  document.querySelectorAll('[data-f]').forEach(b => b.onclick = () => {
    document.querySelectorAll('[data-f]').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    const f = b.dataset.f;
    cards.forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.g !== f));
  });
  document.getElementById('copy').onclick = async () => {
    const lines = cards.map(c => [c.querySelector('.m b').textContent, c.querySelector('.who').value.trim()])
      .filter(([,v]) => v).map(([i,v]) => i + ' = ' + v);
    if (!lines.length) return alert('ما عبّيت ولا وحدة بعد');
    await navigator.clipboard.writeText(lines.join('\\n'));
    alert('انتسخ ' + lines.length + ' سطر');
  };
  count();
</script>
</body></html>`;

fs.writeFileSync(path.join(OUT, 'index.html'), html, 'utf8');
console.log('✓ ' + path.join(OUT, 'index.html'));
console.log(`  ${items.length} عنصر · ${groups.length} مجموعة`);
