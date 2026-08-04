// ═══════════════════════════════════════════════════════════════
//  المونتاج النهائي للبرومو (2026-08-04) — قصّات على الضربات
//
//  التايم لاين (من beats.json: ضربة كل ثانية، أول وحدة 0.53):
//   0.00  هوك سيدانس (مبطأ لـ 8.53) + الجملة الافتتاحية
//   8.53  «المشكلة مش بالبوستات» — القصة عالدروب بالضبط 💥
//  13.53  التعريف
//  19.53  الحبر الليموني
//  23.53  الكروت (كل كرت بينزل على ضربة)
//  40.53  الفلسفة — بالبريك الهادي عن قصد
//  48.53  الموقع الحي: الحاسبة ← لعبة الوكيل
//  62.53  ليل (كلينغ) ← 66.53 فجر ← 71.53 اللوجو
//  84.56  النهاية مع خفوت الموسيقى
//
//  التشغيل: node _check/promoedit.mjs
//  المخرج: Promo/final/promo-ar.mp4
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

const P = 'D:/Ryan-Work/Brand-Ryan/Promo';
const FFMPEG = 'D:/Tools/ffmpeg/bin/ffmpeg.exe';
mkdirSync(`${P}/final`, { recursive: true });

// ─── ١) الجملة الافتتاحية كصورة شفافة (بخط الموقع) ───
const FONTS = {
  '/__f/alexandria-arabic.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-arabic-wght-normal.woff2',
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');
await page.setContent(`<!doctype html><html dir="rtl"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Alexandria';src:url('/__f/alexandria-arabic.woff2') format('woff2');font-weight:100 900}
  *{margin:0}body{width:1920px;height:1080px;background:transparent;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:26px;font-family:'Alexandria',sans-serif}
  h1{font-size:96px;font-weight:800;color:#F2F3EE;text-shadow:0 4px 40px rgba(0,0,0,.9)}
  h2{font-size:64px;font-weight:700;color:#D9FF3F;text-shadow:0 4px 40px rgba(0,0,0,.9)}
</style></head><body><h1>مشروعك بيعلن…</h1><h2>وما حدا بيشتري؟</h2></body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: `${P}/final/hook-text.png`, omitBackground: true });
await browser.close();
console.log('✅ hook-text.png');

// ─── ٢) بناء أمر ffmpeg — كل مقطع بينضبط لمدته وقصّته على الضربة ───
const A = `${P}/ai-shots`;
const S = `${P}/scenes`;
const C = `${P}/capture`;

const inputs = [
  `-i "${A}/hook-seedance.mp4"`,            // 0
  `-loop 1 -t 8.53 -i "${P}/final/hook-text.png"`, // 1
  `-i "${S}/s2.mp4"`,                       // 2
  `-i "${S}/s3.mp4"`,                       // 3
  `-i "${S}/strans.mp4"`,                   // 4  خيوط الإشارة (بدل الحبر)
  `-i "${S}/s4.mp4"`,                       // 5
  `-i "${S}/s5.mp4"`,                       // 6
  `-i "${C}/cap-loss.webm"`,                // 7
  `-i "${C}/cap-agent.webm"`,               // 8
  `-i "${S}/stats.mp4"`,                    // 9  الأرقام (بدل ليل/فجر)
  `-i "${S}/s7.mp4"`,                       // 10
  `-i "${A}/pumatunes-epic-amber-music.mp3"`, // 11
].join(' ');

// توحيد: 1920×1080 · 30fps · yuv420p — عشان اللحام يمشي نضيف
const norm = 'scale=1920:1080,fps=30,format=yuv420p,setsar=1';

const graph = [
  `[0:v]setpts=PTS*${(8.53 / 8.08).toFixed(5)},${norm}[hk]`,
  `[1:v]format=rgba,fade=in:st=1.5:d=0.8:alpha=1,fade=out:st=7.2:d=0.8:alpha=1[txt]`,
  `[hk][txt]overlay=0:0:shortest=1[v0]`,
  `[2:v]${norm}[v1]`,
  `[3:v]${norm}[v2]`,
  `[4:v]${norm}[v3]`,
  `[5:v]${norm}[v4]`,
  `[6:v]${norm}[v5]`,
  // الموقع الحي: أفضل ٧ ثواني + دخول ناعم بدل القصة الجافة
  `[7:v]trim=21.5:28.5,setpts=PTS-STARTPTS,${norm},fade=t=in:d=0.35[v6]`,
  `[8:v]trim=5.5:12.5,setpts=PTS-STARTPTS,${norm},fade=t=in:d=0.35[v7]`,
  `[9:v]${norm}[v8]`,
  `[10:v]${norm}[v9]`,
  `[v0][v1][v2][v3][v4][v5][v6][v7][v8][v9]concat=n=10:v=1:a=0[allv]`,
  `[allv]fade=t=out:st=83.2:d=1.3[vfinal]`,
  `[11:a]atrim=0:84.56,afade=t=out:st=83.0:d=1.5[afinal]`,
].join(';');

const cmd = `"${FFMPEG}" -y ${inputs} -filter_complex "${graph}" -map "[vfinal]" -map "[afinal]" -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k -movflags +faststart "${P}/final/promo-ar.mp4"`;
console.log('🎬 عم يلحم…');
execSync(cmd, { stdio: 'inherit' });
console.log('\n✅ Promo/final/promo-ar.mp4');
