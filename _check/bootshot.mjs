// لقطة لشاشة التحميل وهي شغالة (منبطّئ الصور بس — الخطوط لأ،
// لأن لقطة بلايرايت بتستنى الخطوط تخلص)
import { chromium } from '@playwright/test';
const b = await chromium.launch();

const shoot = async (vw, name, waitMs) => {
  const p = await b.newPage({ viewport: vw });
  await p.route('**/*.{png,jpg,jpeg,webp,mp4}', async (r) => {
    await new Promise((x) => setTimeout(x, 6000));
    r.continue();
  });
  await p.goto('http://localhost:4331/ar/', { waitUntil: 'commit' });
  await p.waitForTimeout(waitMs);
  await p.screenshot({ path: `_check/out/${name}.png` });
  await p.close();
};

await shoot({ width: 1440, height: 900 }, 'boot-1', 700);
await shoot({ width: 1440, height: 900 }, 'boot-2', 1500);
await shoot({ width: 390, height: 844 }, 'boot-mobile', 900);
await b.close();
console.log('done');
