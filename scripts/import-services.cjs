const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require('@playwright/test');

const slugs = ['email-marketing', 'records_management', 'policy_writing', 'ai_workshop', 'fractional-cmo'];
// Source HTML is downloaded separately so import and verification are repeatable offline.
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();
  await page.route('**/*', route => route.abort());
  const pages = {};
  const assets = new Map();
  for (const slug of slugs) {
    await page.setContent(fs.readFileSync(`tmp/service-${slug}.html`, 'utf8'));
    const result = await page.evaluate(() => {
      const root = document.querySelector('[data-elementor-type="wp-page"]');
      if (!root) throw new Error('Missing page content');
      const allowed = new Set(['P','H1','H2','H3','H4','H5','H6','UL','OL','LI','STRONG','B','EM','I','A','IMG','BR','HR','BLOCKQUOTE']);
      const esc = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
      const clean = node => {
        if (node.nodeType === 3) return esc(node.textContent);
        if (node.nodeType !== 1 || ['SCRIPT','STYLE','SVG','NOSCRIPT'].includes(node.tagName)) return '';
        const tag = node.tagName;
        const inside = [...node.childNodes].map(clean).join('');
        if (tag === 'DIV' && node.getAttribute('data-sentry-component') === 'P') return `<p>${inside}</p>`;
        if (tag === 'IMG') {
          const src = node.getAttribute('src');
          if (!src || !/^https?:\/\//.test(src)) return '';
          const fallback = decodeURIComponent(new URL(src).pathname.split('/').pop()).replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').replace(/\b\d+x\d+\b/g, '').trim();
          return `<img src="${esc(src)}" alt="${esc(node.getAttribute('alt') || fallback)}"${['width','height'].map(a => /^\d+$/.test(node.getAttribute(a) || '') ? ` ${a}="${node.getAttribute(a)}"` : '').join('')} loading="lazy" />`;
        }
        if (!allowed.has(tag)) return inside;
        if (!inside.trim() && !['BR','HR'].includes(tag)) return '';
        if (tag === 'A') {
          let href = node.getAttribute('href') || '';
          if (!/^(https?:|mailto:|tel:|\/|#)/i.test(href)) return inside;
          if (/^https?:\/\/(www\.)?catchthebeat\.ca\//i.test(href)) {
            const url = new URL(href);
            const pathname = url.pathname.replace(/\/$/, '') || '/';
            const local = new Set(['/contact', '/case-studies', '/about-us', '/services', '/email-marketing', '/records_management', '/policy_writing', '/ai_workshop', '/fractional-cmo']);
            if (local.has(pathname)) href = pathname + url.search + url.hash;
          }
          if (/^https?:\/\/(?:www\.)?(?:daphnethomson\.com|calendly\.com)\//i.test(href)) href = '/contact';
          if (href === '#' || href === '#contact') href = '/contact';
          if (href === '/fractional-cmo') href = '/fractional-interim-leadership';
          if (href === '/email-marketing') href = '/ai-for-local-government';
          return `<a href="${esc(href)}">${inside}</a>`;
        }
        if (/^H[1-6]$/.test(tag) && node.textContent.length > 250) {
          const [heading, ...paragraphs] = inside.trim().split(/\n\s*\n/);
          if (paragraphs.length) return `<h3>${heading}</h3>${paragraphs.map(p => `<p>${p}</p>`).join('')}`;
        }
        const name = tag === 'H1' ? 'h2' : tag.toLowerCase();
        return `<${name}>${inside}</${name}>`;
      };
      const sections = [...root.children].map(section => {
        const widgets = [...section.querySelectorAll('.elementor-widget')].filter(w => !w.parentElement.closest('.elementor-widget'));
        return widgets.map(widget => {
          const html = clean(widget).trim();
          const text = widget.textContent.replace(/\s+/g,' ').trim();
          return { html, text, image: !!widget.querySelector('img') && !text };
        }).filter(w => w.html && (w.text || w.image));
      }).filter(section => section.length);
      return { sections, text: root.textContent.replace(/\s+/g, ' ').trim(), imageCount: root.querySelectorAll('img').length };
    });
    for (const section of result.sections) for (const widget of section) {
      widget.html = widget.html.replace(/src="(https?:[^\"]+)"/g, (_, encoded) => {
        const url = encoded.replace(/&amp;/g, '&');
        const filename = crypto.createHash('sha256').update(url).digest('hex').slice(0,16) + path.extname(new URL(url).pathname);
        assets.set(url, { url, file: `public/images/services/${filename}` });
        return `src="/images/services/${filename}"`;
      });
    }
    if (slug === 'fractional-cmo') {
      // Preserve the revised leadership copy instead of reimporting the legacy marketing page.
      pages['fractional-interim-leadership'] = JSON.parse(fs.readFileSync('content/service-originals.json', 'utf8'))['fractional-interim-leadership'];
    } else {
      pages[slug === 'email-marketing' ? 'ai-for-local-government' : slug] = result;
    }
    console.log(slug, result.sections.length, 'sections;', result.imageCount, 'images');
  }
  fs.mkdirSync('public/images/services', { recursive: true });
  fs.writeFileSync('content/service-originals.json', JSON.stringify(pages, null, 2) + '\n');
  fs.writeFileSync('tmp/service-assets.json', JSON.stringify([...assets.values()], null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
