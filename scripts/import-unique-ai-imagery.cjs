const fs = require('node:fs');
const sharp = require('sharp');
(async () => {
  const { assets } = JSON.parse(fs.readFileSync('artifacts/unique-ai-imagery.json', 'utf8'));
  for (const asset of assets) {
    const destination = `public/images/ai-concept/${asset.name}.webp`;
    if (!fs.existsSync(destination)) await sharp(asset.source).resize({width:1200, withoutEnlargement:true}).webp({quality:85}).toFile(destination);
  }
  const file = 'content/service-originals.json';
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const page of new Set(assets.map(asset => asset.page))) {
    if (!data[page]) continue;
    const pageAssets = assets.filter(asset => asset.page === page);
    const originals = pageAssets.map(asset => asset.replaces).filter(Boolean);
    const widgets = data[page].sections.flat().filter(widget => widget.image && (page === 'ai-for-local-government' || widget.html.includes('/ai-concept/') || originals.some(source => widget.html.includes(source))));
    if (widgets.length !== pageAssets.length) throw new Error(`Image count mismatch for ${page}`);
    for (let i=0; i<widgets.length; i++) {
      const asset = pageAssets[i];
      const {width,height} = await sharp(`public/images/ai-concept/${asset.name}.webp`).metadata();
      widgets[i].html = `<img src="/images/ai-concept/${asset.name}.webp" alt="${asset.alt}" width="${width}" height="${height}" loading="lazy" decoding="async" />`;
    }
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`Imported ${assets.length} unique AI illustrations.`);
})().catch(error => { console.error(error); process.exit(1); });
