// Render first-page thumbnails. Requires PyMuPDF (tmp/pdf-tools or Python's path).
// The DOCX preview uses its original text and embedded letterhead.
const fs = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sharp = require('sharp');
const { chromium } = require('@playwright/test');
const { pathToFileURL } = require('node:url');

async function main() {
  const referrals = JSON.parse(await fs.readFile('content/referrals.json', 'utf8'));
  await fs.mkdir('tmp/referral-previews', { recursive: true });
  await fs.mkdir('public/referrals/previews', { recursive: true });
  for (const referral of referrals) {
    for (const file of referral.files) {
      if (!['PDF', 'DOCX'].includes(file.format)) continue;
      const source = `public${file.href}`;
      const stem = path.basename(file.href, path.extname(file.href));
      const png = `tmp/referral-previews/${stem}.png`;
      if (file.format === 'DOCX') {
        execFileSync('python', ['scripts/referral-docx-preview.py']);
        const browser = await chromium.launch({ channel: 'chrome', headless: true });
        try {
          const page = await browser.newPage({ viewport: { width: 850, height: 1100 }, deviceScaleFactor: 1.65 });
          await page.goto(pathToFileURL(path.resolve('tmp/referral-previews/castlegar.html')).href);
          await page.locator('article').screenshot({ path: png });
        } finally { await browser.close(); }
      } else execFileSync('python', ['-c',
        "import sys; sys.path.insert(0, 'tmp/pdf-tools'); import pymupdf; doc = pymupdf.open(sys.argv[1]); page = doc[0]; page.get_pixmap(matrix=pymupdf.Matrix(1400/page.rect.width, 1400/page.rect.width), alpha=False).save(sys.argv[2])",
        source, png]);
      file.preview = `/referrals/previews/${stem}.webp`;
      const result = await sharp(png).webp({ quality: 90 }).toFile(`public${file.preview}`);
      file.width = result.width;
      file.height = result.height;
      console.log(`Rendered ${file.filename}: ${result.width} x ${result.height}`);
    }
  }
  await fs.writeFile('content/referrals.json', JSON.stringify(referrals, null, 2) + '\n');
}

main().catch(error => { console.error(error); process.exit(1); });
