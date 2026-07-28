// بيبني صفحة مراجعة: كل الأعمال بمكان واحد، وريّان بيكتب لمين كل إشي
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'D:\\Ryan-Portfolio\\_inbox';
const items = JSON.parse(fs.readFileSync(path.join(OUT, 'catalog.json'), 'utf8'));

const card = (x) => {
  const meta =
    x.type === 'video'
      ? `${x.w}×${x.h} · ${x.seconds}s · ${x.mb}MB`
      : `${x.w}×${x.h} · ${x.kb}KB`;
  return `<label class="c" data-id="${x.id}" data-type="${x.type}" data-shape="${x.shape || ''}">
  <div class="t"><img loading="lazy" src="thumbs/${x.id}.jpg" alt=""></div>
  <div class="m"><b>${x.id}</b><span class="tag ${x.type}">${x.type === 'video' ? 'فيديو' : 'صورة'}</span><span class="sh">${x.shape || ''}</span></div>
  <div class="d">${meta}</div>
  <input class="who" placeholder="لمين؟ مثلاً: د. سمير" value="${x.belongsTo || ''}">
</label>`;
};

const html = `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>أعمال ريّان — ${items.length} عنصر</title>
<style>
  :root{--bg:#0E0F12;--s:#15171C;--s2:#1B1E24;--tx:#F2F3EE;--mu:#A0A49B;--ac:#D9FF3F;--ln:rgba(242,243,238,.1)}
  *{box-sizing:border-box;margin:0}
  body{background:var(--bg);color:var(--tx);font:15px/1.6 system-ui,"Segoe UI",sans-serif;padding:24px}
  header{position:sticky;top:0;background:var(--bg);padding:16px 0 14px;border-bottom:1px solid var(--ln);z-index:5;margin-bottom:22px}
  h1{font-size:22px;margin-bottom:6px}
  p.sub{color:var(--mu);font-size:14px}
  .bar{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;align-items:center}
  button{font:inherit;background:var(--s2);color:var(--tx);border:1px solid var(--ln);border-radius:999px;padding:8px 16px;cursor:pointer}
  button.on{background:var(--ac);color:#111;border-color:var(--ac);font-weight:700}
  button.go{background:var(--ac);color:#111;border-color:var(--ac);font-weight:700;margin-inline-start:auto}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:16px}
  .c{background:var(--s);border:1px solid var(--ln);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}
  .c.hide{display:none}
  .t{aspect-ratio:1;background:#000;display:grid;place-items:center;overflow:hidden}
  .t img{width:100%;height:100%;object-fit:contain}
  .m{display:flex;align-items:center;gap:8px;padding:10px 12px 4px;font-size:13px}
  .m b{font-family:ui-monospace,monospace;color:var(--ac)}
  .tag{font-size:11px;padding:2px 8px;border-radius:999px;background:var(--s2);color:var(--mu)}
  .tag.video{background:color-mix(in srgb,var(--ac) 20%,transparent);color:var(--ac)}
  .sh{font-size:11px;color:var(--mu)}
  .d{padding:0 12px 10px;font-size:11.5px;color:var(--mu);font-family:ui-monospace,monospace}
  .who{margin:0 10px 10px;padding:9px 11px;border-radius:9px;border:1px solid var(--ln);background:var(--s2);color:var(--tx);font:inherit;font-size:13.5px}
  .who:focus{outline:none;border-color:var(--ac)}
  .who:not(:placeholder-shown){border-color:var(--ac);background:color-mix(in srgb,var(--ac) 8%,var(--s2))}
  #count{color:var(--mu);font-size:13px}
</style></head><body>
<header>
  <h1>أعمال ريّان — ${items.length} عنصر</h1>
  <p class="sub">اكتب تحت كل عنصر لمين هو. ما لازم تخلّص كلهم بمرة — الصفحة بتحفظ لحالها، وارجعلها وقت ما بدك.</p>
  <div class="bar">
    <button data-f="all" class="on">الكل</button>
    <button data-f="image">صور (${items.filter((x) => x.type === 'image').length})</button>
    <button data-f="video">فيديو (${items.filter((x) => x.type === 'video').length})</button>
    <button data-f="todo">لسا ما عبّيتها</button>
    <button data-f="done">معبّاية</button>
    <span id="count"></span>
    <button class="go" id="copy">انسخ النتيجة وابعتها لكلود</button>
  </div>
</header>
<div class="grid">${items.map(card).join('\n')}</div>
<script>
  const KEY = 'rayan-work-labels';
  const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
  const cards = [...document.querySelectorAll('.c')];

  cards.forEach(c => {
    const id = c.dataset.id, inp = c.querySelector('.who');
    if (saved[id]) inp.value = saved[id];
    inp.addEventListener('input', () => {
      saved[id] = inp.value.trim();
      if (!saved[id]) delete saved[id];
      localStorage.setItem(KEY, JSON.stringify(saved));
      count();
    });
  });

  function count(){
    const done = cards.filter(c => c.querySelector('.who').value.trim()).length;
    document.getElementById('count').textContent = done + ' من ' + cards.length + ' معبّاية';
  }

  document.querySelectorAll('[data-f]').forEach(btn => btn.onclick = () => {
    document.querySelectorAll('[data-f]').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const f = btn.dataset.f;
    cards.forEach(c => {
      const filled = !!c.querySelector('.who').value.trim();
      const show = f === 'all' || (f === 'todo' ? !filled : f === 'done' ? filled : c.dataset.type === f);
      c.classList.toggle('hide', !show);
    });
  });

  document.getElementById('copy').onclick = async () => {
    const lines = cards
      .map(c => [c.dataset.id, c.querySelector('.who').value.trim()])
      .filter(([, v]) => v)
      .map(([id, v]) => id + ' = ' + v);
    if (!lines.length) return alert('ما عبّيت ولا وحدة بعد');
    await navigator.clipboard.writeText(lines.join('\\n'));
    alert('انتسخ ' + lines.length + ' سطر — الصقهم بالمحادثة');
  };

  count();
</script>
</body></html>`;

fs.writeFileSync(path.join(OUT, 'index.html'), html, 'utf8');
console.log('✓ صفحة المراجعة جاهزة: ' + path.join(OUT, 'index.html'));
