const { chromium } = require('@playwright/test');
const fs = require('node:fs');
(async () => {
  const services = JSON.parse(fs.readFileSync('content/service-originals.json', 'utf8'));
  const used = new Map();
  for (const [page, service] of Object.entries(services)) {
    for (const widget of service.sections.flat()) {
      const source = widget.html.match(/src="([^"]*\/ai-concept\/[^"]+)"/)?.[1];
      if (!source) continue;
      if (/canadian-infrastructure|community-collaboration|human-oversight/.test(source)) throw new Error('Retired landscape still used: ' + page);
      if (used.has(source)) throw new Error('Repeated illustration: ' + source);
      used.set(source, page);
    }
  }
  console.log('Unique service illustrations: ' + used.size);
  fs.mkdirSync('artifacts/ai-imagery', { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = [];
  try {
    for (const width of [1440, 375]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      for (const route of ['/', '/about-us', '/contact', '/ai-for-local-government', '/records_management', '/policy_writing', '/ai_workshop', '/fractional-interim-leadership', '/news']) {
        await page.goto('http://localhost:3000' + route, { waitUntil: 'networkidle' });
        for (const img of await page.locator('img').all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(el => el.decode());
        }
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        if (overflow) throw new Error('Horizontal overflow: ' + route + ' at ' + width);
        const sources = await page.locator('img').evaluateAll(images => images.map(i => i.getAttribute('src')));
        if (route === '/news' && sources.some(src => src.includes('/ai-concept/'))) throw new Error('News imagery changed');
        if (route === '/' && !sources.some(src => src.includes('municipal-ai-workshop-v2.webp'))) throw new Error('Existing AI image missing');
        if (['/', '/records_management', '/about-us', '/ai-for-local-government', '/ai_workshop'].includes(route)) {
          const target = route === '/' ? page.locator('main > section').first() : page.locator('main');
          await target.scrollIntoViewIfNeeded();
          await target.screenshot({path: 'artifacts/ai-imagery/' + (route.replaceAll('/', '') || 'home') + '-' + width + '.png'});
        }
        report.push({route, width, images: sources.length, updated: sources.filter(src => src.includes('ai-concept')).length});
      }
      await page.close();
    }
    fs.writeFileSync('artifacts/ai-imagery/checks.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exit(1); });
