// تركيب اللوجو الحقيقي فوق مشهد مولّد — بلا تشويه ولا إعادة رسم
//   node _check/avatar-composite.mjs <مسار المشهد> <اسم المخرج> [حجم اللوجو 0-1] [قوة التوهج]
//  اللوجو بيتلوّن ليموني (لون الهوية) وبينحط بتوهج بيدمجه بالإضاءة
//  اللي المشهد أصلاً مرسوم فيها (المركز الفاضي المضوي).
import sharp from 'sharp';

const [scenePath, outName, sizeArg, glowArg] = process.argv.slice(2);
const OUT = `D:/Ryan-Work/Brand-Ryan/avatars/${outName}.png`;
const LOGO = 'public/assets/logo-white.png';
const ACCENT = { r: 217, g: 255, b: 63 }; // #D9FF3F

const scene = sharp(scenePath);
const { width: W, height: H } = await scene.metadata();
const logoSize = Math.round(W * (Number(sizeArg) || 0.34));
const glowStrength = Number(glowArg) || 22;

// ١) اللوجو الأبيض بحجمه المطلوب
const logoResized = await sharp(LOGO).resize(logoSize, logoSize).png().toBuffer();

// ٢) نسخة ليمونية: مستطيل بلون الهوية مقصوص بشكل اللوجو (قناة الألفا)
const limeFill = await sharp({
  create: { width: logoSize, height: logoSize, channels: 4, background: { ...ACCENT, alpha: 1 } },
})
  .png()
  .toBuffer();
const limeLogo = await sharp(limeFill)
  .composite([{ input: logoResized, blend: 'dest-in' }])
  .png()
  .toBuffer();

// ٣) توهج: نفس اللوجو الليموني مبلور بقوة — بينحط تحت الحاد
const glow = await sharp(limeLogo).blur(glowStrength).png().toBuffer();

// ٤) التركيب: توهجان (واسع + قريب) بعدين اللوجو نفسه بدمج screen
//    عشان يبين «مضوي من جوّا المشهد» مش ملزوق فوقه
const cx = Math.round((W - logoSize) / 2);
const cy = Math.round((H - logoSize) / 2);
await scene
  .composite([
    { input: glow, left: cx, top: cy, blend: 'screen' },
    { input: glow, left: cx, top: cy, blend: 'screen' },
    { input: limeLogo, left: cx, top: cy, blend: 'screen' },
  ])
  .png()
  .toFile(OUT);

console.log('✅', OUT);
