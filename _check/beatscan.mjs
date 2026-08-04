// ═══════════════════════════════════════════════════════════════
//  محلل الإيقاع (2026-08-04) — عشان قصّات البرومو تيجي عالبيت
//
//  الفكرة: منفك الموسيقى لعينات خام (ffmpeg) ← منحسب طاقة كل
//  ٥٠ مللي ثانية ← «قوة الهجوم» (فرق الطاقة الموجب = ضربة) ←
//  ارتباط ذاتي على مدى 60-180 BPM ← أحسن سرعة + إزاحة البداية.
//
//  المخرج: bpm + مصفوفة أوقات الضربات (وكل رابعة = ضربة قوية)
//  التشغيل: node _check/beatscan.mjs "مسار الموسيقى"
// ═══════════════════════════════════════════════════════════════
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

const SRC = process.argv[2] || 'D:/Ryan-Work/Brand-Ryan/Promo/ai-shots/pumatunes-epic-amber-music.mp3';
const FFMPEG = 'D:/Tools/ffmpeg/bin/ffmpeg.exe';
const RAW = 'D:/Ryan-Work/Brand-Ryan/Promo/beat.raw';

// ١) فك لعينات خام: مونو، 8000Hz، s16le
execSync(`"${FFMPEG}" -y -v error -i "${SRC}" -ac 1 -ar 8000 -f s16le "${RAW}"`);
const buf = readFileSync(RAW);
const n = Math.floor(buf.length / 2);
const SR = 8000;

// ٢) طاقة RMS لكل نافذة ٥٠ مللي (400 عينة) — 20Hz دقة
const WIN = 400;
const frames = Math.floor(n / WIN);
const rms = new Float64Array(frames);
for (let f = 0; f < frames; f++) {
  let s = 0;
  for (let i = 0; i < WIN; i++) {
    const v = buf.readInt16LE((f * WIN + i) * 2) / 32768;
    s += v * v;
  }
  rms[f] = Math.sqrt(s / WIN);
}

// ٣) قوة الهجوم: الفرق الموجب بالطاقة (البيت = قفزة طاقة)
const onset = new Float64Array(frames);
for (let f = 1; f < frames; f++) onset[f] = Math.max(0, rms[f] - rms[f - 1]);

// ٤) ارتباط ذاتي: أي فترة (lag) بتخلي الهجمات تنطبق على حالها؟
const FPS = SR / WIN; // 20 إطار طاقة بالثانية
let best = { bpm: 0, score: -1, lag: 0 };
for (let bpm = 60; bpm <= 180; bpm += 0.5) {
  const lag = (60 / bpm) * FPS;
  let score = 0;
  let count = 0;
  for (let f = 0; f + lag < frames; f++) {
    const j = Math.round(f + lag);
    score += onset[f] * onset[j];
    count++;
  }
  score /= count;
  if (score > best.score) best = { bpm, score, lag };
}

// ٥) الإزاحة: وين أول ضربة؟ منجرب كل الإزاحات ومنشوف أيها بتجمع
//    أعلى طاقة هجوم على الشبكة
const period = best.lag;
let bestPhase = { off: 0, score: -1 };
for (let off = 0; off < period; off += 0.25) {
  let s = 0;
  for (let b = off; b < frames; b += period) {
    const i = Math.round(b);
    if (i < frames) s += onset[i] + (onset[i - 1] || 0) * 0.5 + (onset[i + 1] || 0) * 0.5;
  }
  if (s > bestPhase.score) bestPhase = { off, score: s };
}

const beatSec = 60 / best.bpm;
const firstBeat = bestPhase.off / FPS;
const durSec = frames / FPS;
const beats = [];
for (let t = firstBeat; t < durSec; t += beatSec) beats.push(Math.round(t * 1000) / 1000);

// ٦) خريطة الطاقة (كل ثانيتين) — وين الموسيقى بتعلى وبتهدى
const energyMap = [];
for (let s = 0; s < durSec; s += 2) {
  const a = Math.round(s * FPS);
  const b = Math.min(frames, a + 2 * FPS);
  let e = 0;
  for (let i = a; i < b; i++) e += rms[i];
  energyMap.push({ t: s, e: Math.round((e / (b - a)) * 1000) / 1000 });
}

const out = { bpm: best.bpm, beatSec: Math.round(beatSec * 1000) / 1000, firstBeat, durSec, beats, energyMap };
writeFileSync('D:/Ryan-Work/Brand-Ryan/Promo/beats.json', JSON.stringify(out, null, 1));
console.log(`🎵 BPM: ${best.bpm} · الضربة كل ${out.beatSec} ث · أول ضربة عند ${firstBeat.toFixed(2)} ث · المدة ${durSec.toFixed(1)} ث`);
console.log(`   عدد الضربات: ${beats.length} — انحفظوا بـ beats.json مع خريطة الطاقة`);
console.log('   الطاقة (كل ٢ث):', energyMap.map((x) => x.e.toFixed(2)).join(' '));
