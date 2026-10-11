const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

(async () => {
  const manifest = JSON.parse(fs.readFileSync(process.argv[2], 'utf8').replace(/^\uFEFF/, ''));
  fs.mkdirSync('public/images/editorial', { recursive: true });
  for (const asset of manifest) {
    const original = path.join('public/images/editorial', asset.key + '.png');
    const output = path.join('public/images/editorial', asset.key + '.webp');
    if (!fs.existsSync(original)) fs.copyFileSync(asset.source, original);
    if (!fs.existsSync(output)) await sharp(original).resize({ width: 1100, withoutEnlargement: true }).webp({ quality: 88 }).toFile(output);
    const metadata = await sharp(output).metadata();
    console.log(asset.key, metadata.width, metadata.height, fs.statSync(output).size);
  }
})().catch(error => { console.error(error); process.exit(1); });
