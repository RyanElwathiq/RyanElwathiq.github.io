// ═══════════════════════════════════════════════════════════════
//  المونتاج النهائي — الفيلم الإنجليزي (2026-08-05)
//
//  نفس تايم لاين promoedit.mjs حرفياً (نفس الموسيقى والضربات
//  والقصّات) بس بمصادر إنجليزية: scenes-en + capture-en +
//  الجملة الافتتاحية بالإنجليزي. نفس هوك السيدانس.
//
//  التشغيل: node _check/promoediten.mjs
//  المخرج: Promo/final/promo-en.mp4
// ═══════════════════════════════════════════════════════════════
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

const P = 'D:/Ryan-Work/Brand-Ryan/Promo';
const FFMPEG = 'D:/Tools/ffmpeg/bin/ffmpeg.exe';
mkdirSync(`${P}/final`, { recursive: true });

// نوافذ القص من تسجيلات الصفحات الإنجليزية (من مراجعة الشبكات)
const LOSS_TRIM = '13.6:20.6';
const AGENT_TRIM = '7.7:14.7';

// ─── ١) الجملة الافتتاحية بالإنجليزي كصورة شفافة ───
const FONTS = {
  '/__f/alexandria-latin.woff2': 'node_modules/@fontsource-variable/alexandria/files/alexandria-latin-wght-normal.woff2',
  '/__f/grotesk-latin.woff2': 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2',
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.route('http://post.local/**', async (route) => {
  const p = new URL(route.request().url()).pathname;
  if (FONTS[p]) return route.fulfill({ body: readFileSync(FONTS[p]), contentType: 'font/woff2' });
  route.fulfill({ body: '', contentType: 'text/html' });
});
await page.goto('http://post.local/');
await page.setContent(`<!doctype html><html dir="ltr"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Grotesk';src:url('/__f/grotesk-latin.woff2') format('woff2');font-weight:300 700}
  *{margin:0}body{width:1920px;height:1080px;background:transparent;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:26px;font-family:'Grotesk',sans-serif;text-align:center}
  h1{font-size:88px;font-weight:700;color:#F2F3EE;text-shadow:0 4px 40px rgba(0,0,0,.9)}
  h2{font-size:60px;font-weight:700;color:#D9FF3F;text-shadow:0 4px 40px rgba(0,0,0,.9)}
</style></head><body><h1>Your business advertises…</h1><h2>and nobody buys?</h2></body></html>`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: `${P}/final/hook-text-en.png`, omitBackground: true });
await browser.close();
console.log('✅ hook-text-en.png');

// ─── ٢) بناء أمر ffmpeg — نفس ضربات النسخة العربية ───
const A = `${P}/ai-shots`;
const S = `${P}/scenes-en`;
const C = `${P}/capture-en`;

const inputs = [
  `-i "${A}/hook-seedance.mp4"`,            // 0
  `-loop 1 -t 8.53 -i "${P}/final/hook-text-en.png"`, // 1
  `-i "${S}/s2.mp4"`,                       // 2
  `-i "${S}/s3.mp4"`,                       // 3
  `-i "${S}/strans.mp4"`,                   // 4
  `-i "${S}/s4.mp4"`,                       // 5
  `-i "${S}/s5.mp4"`,                       // 6
  `-i "${C}/cap-loss.webm"`,                // 7
  `-i "${C}/cap-agent.webm"`,               // 8
  `-i "${S}/stats.mp4"`,                    // 9
  `-i "${S}/s7.mp4"`,                       // 10
  `-i "${A}/pumatunes-epic-amber-music.mp3"`, // 11
].join(' ');

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
  `[7:v]trim=${LOSS_TRIM},setpts=PTS-STARTPTS,${norm},fade=t=in:d=0.35[v6]`,
  `[8:v]trim=${AGENT_TRIM},setpts=PTS-STARTPTS,${norm},fade=t=in:d=0.35[v7]`,
  `[9:v]${norm}[v8]`,
  `[10:v]${norm}[v9]`,
  `[v0][v1][v2][v3][v4][v5][v6][v7][v8][v9]concat=n=10:v=1:a=0[allv]`,
  `[allv]fade=t=out:st=83.2:d=1.3[vfinal]`,
  `[11:a]atrim=0:84.56,afade=t=out:st=83.0:d=1.5[afinal]`,
].join(';');

const cmd = `"${FFMPEG}" -y ${inputs} -filter_complex "${graph}" -map "[vfinal]" -map "[afinal]" -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k -movflags +faststart "${P}/final/promo-en.mp4"`;
console.log('🎬 عم يلحم…');
execSync(cmd, { stdio: 'inherit' });
console.log('\n✅ Promo/final/promo-en.mp4');
