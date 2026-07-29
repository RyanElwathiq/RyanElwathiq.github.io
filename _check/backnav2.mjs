import { chromium } from '@playwright/test';
const BASE = 'http://localhost:4331';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', e => console.log('   PAGEERROR:', e.message.slice(0,110)));

const probe = async (tag) => {
  const r = await p.evaluate(async () => {
    const ST = window.__gsap?.core?.globals?.().ScrollTrigger;
    const all = ST ? ST.getAll() : [];
    const secs = [...document.querySelectorAll('[data-seq]')];
    const jump = y => new Promise(res => { window.__lenis ? window.__lenis.scrollTo(y,{immediate:true,force:true}) : scrollTo(0,y); setTimeout(res, 600); });
    const snap = c => { const x=document.createElement('canvas'); x.width=40;x.height=24; x.getContext('2d').drawImage(c,0,0,40,24); return x.getContext('2d').getImageData(0,0,40,24).data.join(',').slice(0,300); };
    const out=[];
    for (const sec of secs) {
      const canvas = sec.querySelector('canvas');
      const st = all.find(t => t.trigger===sec || t.pin===sec);
      const name = sec.className.split(' ')[0] || '?';
      if (!st || !canvas) { out.push({name, ok:false, why: !st?'ما في تريجر':'ما في كانفاس'}); continue; }
      await jump(st.start+20); const a=snap(canvas);
      await jump(st.start+(st.end-st.start)*0.6); const c=snap(canvas);
      out.push({name, ok:a!==c, range:Math.round(st.end-st.start)});
    }
    return { triggers: all.length, pinned: all.filter(t=>t.pin).length, spacers: document.querySelectorAll('.pin-spacer').length, docH: document.documentElement.scrollHeight, seqs: out };
  });
  console.log(`${tag.padEnd(30)} trig=${r.triggers} pin=${r.pinned} spacers=${r.spacers} docH=${r.docH}`);
  r.seqs.forEach(s => console.log(`     ${(s.name||'?').padEnd(10)} ${s.ok?'✓':'✗ واقف'+(s.why?' ('+s.why+')':'')}`));
  return r;
};

await p.goto(BASE + '/ar/', { waitUntil:'networkidle' });
await p.waitForTimeout(3000);
await probe('1. تحميل مباشر');

// انزل عميق ثم روح لصفحة مشروع فيها معرض كبير
await p.evaluate(() => { const el=document.querySelector('#websites,.websites'); if(el){const y=el.getBoundingClientRect().top+scrollY; window.__lenis?window.__lenis.scrollTo(y,{immediate:true}):scrollTo(0,y);} });
await p.waitForTimeout(1200);
await p.goto(BASE + '/ar/work/orient/', { waitUntil:'networkidle' });
await p.waitForTimeout(2000);
await p.evaluate(() => scrollTo(0, 3000));
await p.waitForTimeout(1200);
await p.goBack();
await p.waitForTimeout(5000);
console.log('   (رجعنا على ' + new URL(p.url()).pathname + ' — سكرول=' + await p.evaluate(()=>Math.round(scrollY)) + ')');
await probe('2. رجوع من صفحة معرض');

await p.screenshot({ path:'_check/out/backnav2.png' });
await b.close();
