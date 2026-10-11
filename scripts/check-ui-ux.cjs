const { chromium, expect } = require('@playwright/test');
const fs = require('node:fs');
(async () => {
  fs.mkdirSync('artifacts/ui-ux', { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const report = [], errors = [];
  const routes = ['/', '/services', '/ai-for-local-government', '/ai_workshop', '/contact', '/news'];
  try {
    if (process.argv.includes('--preview')) {
      for (const width of [375, 1440]) {
        const page = await browser.newPage({viewport:{width,height:1100},reducedMotion:'reduce'});
        await page.goto('http://localhost:3000/',{waitUntil:'networkidle'});
        await page.screenshot({path:`artifacts/ui-ux/hero-preview-${width}.png`});
        console.log(await page.locator('main > section').first().evaluate(el=>({width:el.getBoundingClientRect().width,scrollWidth:document.documentElement.scrollWidth,children:[...el.querySelectorAll('h1, figure, img')].map(e=>({tag:e.tagName,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height}))})));
        await page.close();
      }
      return;
    }
    for (const width of [320, 375, 768, 1440]) {
      const page = await browser.newPage({viewport:{width,height:1000}, reducedMotion:'reduce'});
      page.on('pageerror', error => errors.push(error.message));
      for (const route of routes) {
        await page.goto('http://localhost:3000' + route, {waitUntil:'networkidle'});
        const fits = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
        if (!fits) {
          console.log(await page.locator('body *').evaluateAll(els => ({viewport:innerWidth, documentWidth:document.documentElement.scrollWidth, elements:els.filter(e => { const r=e.getBoundingClientRect(); return e instanceof HTMLElement && r.width && (r.right>innerWidth+1 || r.left< -1); }).slice(0,25).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,text:e.textContent.slice(0,60)}))})));
          await page.screenshot({path:'artifacts/ui-ux/overflow.png',fullPage:true});
        }
        expect(fits, route + ' overflow at ' + width).toBeTruthy();
        if ([375,1440].includes(width)) {
          await page.addScriptTag({path:'artifacts/axe.min.js'});
          const violations = await page.evaluate(async () => (await window.axe.run(document, {runOnly:{type:'tag', values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v => ({id:v.id,nodes:v.nodes.map(n=>n.target)})));
          report.push({width,route,violations});
          expect(violations, route + ' accessibility').toEqual([]);
        }
        if (['/','/services','/contact','/ai_workshop'].includes(route) && [375,1440].includes(width)) {
          await page.evaluate(() => {document.activeElement?.blur(); window.scrollTo(0,0);});
          await page.screenshot({path:`artifacts/ui-ux/${route.replaceAll('/','') || 'home'}-${width}.png`, fullPage: false});
        }
      }
      await page.goto('http://localhost:3000/', {waitUntil:'networkidle'});
      if (width <= 1100) await page.getByRole('button',{name:'Open navigation',exact:true}).click();
      const toggle = page.getByRole('button',{name:'Show services submenu'});
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded','true');
      await expect(page.locator('#submenu-services')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(toggle).toBeFocused();
      await expect(toggle).toHaveAttribute('aria-expanded','false');
      await page.keyboard.press('Enter');
      await page.locator('#submenu-services').getByRole('link',{name:'AI Workshop',exact:true}).click();
      await expect(page).toHaveURL(/ai_workshop$/);
      if (width <= 1100) await expect(page.getByRole('button',{name:'Open navigation',exact:true})).toHaveAttribute('aria-expanded','false');
      await page.getByText('On this page', {exact:false}).filter({has:page.locator('span')}).first().click();
      const jump = page.getByRole('navigation',{name:'On this page',exact:true}).getByRole('link',{name:/What You/});
      await jump.click();
      const hash = new URL(page.url()).hash;
      expect(hash).toContain('service-section-');
      const target = await page.locator(hash).boundingBox();
      const header = await page.locator('header.header').boundingBox();
      expect(target.y).toBeGreaterThanOrEqual(header.height - 1);
      if (width < 761) {
        await page.getByText('Explore other services',{exact:true}).click();
        await expect(page.getByRole('navigation',{name:'Other services on mobile'})).toBeVisible();
      }
      report.push({width,interaction:'Menu toggle, Escape, keyboard activation, navigation and section jump passed'});
      if(width===375) {
        for(const route of ['/','/ai_workshop','/contact']) {
          await page.goto('http://localhost:3000'+route,{waitUntil:'networkidle'});
          await page.evaluate(()=>document.documentElement.style.fontSize='200%');
          expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' at 200% text').toBeTruthy();
        }
      }
      await page.close();
    }
    // Exercise real touch input, not just a narrow desktop viewport.
    const touch = await browser.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
    await touch.goto('http://localhost:3000/',{waitUntil:'networkidle'});
    await touch.getByRole('button',{name:'Open navigation',exact:true}).tap();
    await touch.getByRole('button',{name:'Show services submenu'}).tap();
    await expect(touch.locator('#submenu-services')).toBeVisible();
    await touch.locator('#submenu-services').getByRole('link',{name:'AI Workshop',exact:true}).tap();
    await expect(touch).toHaveURL(/ai_workshop$/);
    report.push({interaction:'Touch menu and service navigation passed'});
    expect(errors).toEqual([]);
    fs.writeFileSync('artifacts/ui-ux/checks.json',JSON.stringify(report,null,2));
    console.log('PASS: responsive layouts, accessibility, pointer/keyboard/touch navigation, section links, 200% text; no runtime errors.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exit(1);});
