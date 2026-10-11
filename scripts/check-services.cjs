const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
const originals = require('../content/service-originals.json');
(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  const page = await browser.newPage({reducedMotion:'reduce'});
  page.setDefaultNavigationTimeout(90000);
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  const normalize = s => s.replace(/\s/g, '');
  fs.mkdirSync('artifacts/services', {recursive:true});
  for (const width of [375,1440]) {
    await page.setViewportSize({width,height:1000});
    for (const [slug, original] of Object.entries(originals)) {
      const response = await page.goto('http://localhost:3000/'+slug,{waitUntil:'networkidle'});
      expect(response.status()).toBe(200);
      expect(await page.locator('h1').count()).toBe(1);
      const panels = page.locator('[data-service-reveal]');
      const text = normalize(await panels.evaluateAll(elements => elements.map(element => {
        const copy = element.cloneNode(true);
        copy.querySelectorAll('[aria-hidden="true"]').forEach(node => node.remove());
        return copy.textContent;
      }).join('')));
      for (const section of original.sections) for (const widget of section) {
        expect(text.includes(normalize(widget.text)), `${slug}: missing original text ${widget.text.slice(0,70)}`).toBe(true);
      }
      const images = panels.locator('img');
      expect(await images.count()).toBe(original.imageCount);
      for (const img of await images.all()) {
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate(i => i.complete && i.naturalWidth > 0)).toBe(true);
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth),slug+' overflow').toBe(true);
      await page.evaluate(()=>scrollTo(0,0));
      await page.screenshot({path:`artifacts/services/${slug}-${width}.png`,fullPage:true});
      console.log(`PASS ${slug} ${width}px: all original copy, ${original.imageCount} images, no overflow`);
    }
  }
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('http://localhost:3000/ai-for-local-government');
  await page.locator('[data-service-reveal]').nth(5).scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => document.getAnimations().some(a=>a.effect?.target?.hasAttribute('data-service-reveal')))).toBe(true);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect.poll(() => page.evaluate(() => document.getAnimations().filter(a=>a.effect?.target?.hasAttribute('data-service-reveal')).length)).toBe(0);
  expect(errors).toEqual([]);
  console.log('PASS scroll animation, live reduced-motion preference, no runtime errors');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
