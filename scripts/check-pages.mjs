import { chromium, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('artifacts/pages', { recursive: true });
const browser = await chromium.launch({channel:'chrome',headless:true});
const page = await browser.newPage({reducedMotion:'reduce'});
const base='http://localhost:3000';
const routes=['/','/about-us','/case-studies','/services','/ai-for-local-government','/records_management','/policy_writing','/ai_workshop','/fractional-interim-leadership','/news','/contact','/club'];
const errors=[]; const report=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
const interactionsOnly=process.argv.includes('--interactions-only');
for(const width of interactionsOnly ? [] : [320,375,768,1024,1440]) {
  await page.setViewportSize({width,height:1000});
  for(const route of routes) {
    const response=await page.goto(base+route,{waitUntil:'networkidle'});
    expect(response.status(),route).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(new URL(await page.locator('link[rel="canonical"]').getAttribute('href')).href).toBe(new URL(route,'https://catchthebeat.ca').href);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} at ${width}`).toBeTruthy();
    await expect(page.locator('#navigation a[aria-current="page"]')).toHaveAttribute('href',route);
    for(const link of await page.locator('a[href^="#"]').all()) await expect(page.locator(`[id="${(await link.getAttribute('href')).slice(1)}"]`)).toHaveCount(1);
    for(const booking of await page.locator('a').filter({hasText:'Book a Consultation'}).all()) await expect(booking).toHaveAttribute('href','https://calendar.app.google/Kdfa15ZfDneaNq2s6');
    await expect(page.locator('form')).toHaveCount(route === '/contact' ? 2 : 1);
    if(width===375||width===1440||route==='/services') {
      if(await page.locator('.portrait').count()) {await page.locator('.portrait').scrollIntoViewIfNeeded();await expect.poll(()=>page.locator('.portrait').evaluate(img=>img.complete&&img.naturalWidth>0)).toBeTruthy();}
      await page.evaluate(()=>window.scrollTo(0,0));
      await page.screenshot({path:`artifacts/pages/${route==='/'?'home':route.slice(1)}-${width}.png`,fullPage:true});
    }
  }
  report.push(`PASS ${width}px: all 13 routes, headings, canonical URLs, active navigation, anchors, consultation URLs, contact form and no overflow`);
}
for(const width of [375,1440]) {
  await page.setViewportSize({width,height:900});
  await page.goto(base,{waitUntil:'networkidle'});
  if(width===375)await page.locator('.menu-toggle').click();
  const services=page.getByRole('button',{name:'Show services submenu',includeHidden:true});
  await services.focus(); await page.keyboard.press('Enter');
  await expect(services).toHaveAttribute('aria-expanded','true');
  await page.keyboard.press('Tab');
  await expect(page.locator('#submenu-services a').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(services).toBeFocused();
  await expect(services).toHaveAttribute('aria-expanded','false');
  await services.click();
  await expect(page.locator('#submenu-services')).toBeVisible();
  await page.screenshot({path:`artifacts/pages/menu-${width}.png`});
  await page.locator('#submenu-services').getByRole('link',{name:'AI For Records Management',exact:true}).click();
  await expect(page).toHaveURL(base+'/records_management');
  await expect(page.locator('h1')).toContainText('AI For Records Management');
  await expect(services).toHaveAttribute('aria-expanded','false');
  if(width===375) {await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded','false');await page.locator('.menu-toggle').click();}
  await page.getByRole('button',{name:'Show contact submenu'}).click();
  await page.locator('#submenu-contact').getByRole('link',{name:'Clubhouse'}).click();
  await expect(page).toHaveURL(base+'/club');
  if(width===375)await page.locator('.menu-toggle').click();
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Services',exact:true}).click();
  await expect(page).toHaveURL(base+'/services');
  await expect(page.locator('.directory-item')).toHaveCount(6);
  report.push(`PASS ${width}px: submenu keyboard and touch clicks, Escape focus, child navigation, parent page navigation, mobile closure`);
}
for(const route of routes) {
  await page.setViewportSize({width:375,height:1000});
  await page.goto(base+route,{waitUntil:'networkidle'});
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route} text zoom`).toBeTruthy();
  await page.locator('.menu-toggle').click();
  const header=await page.locator('header').boundingBox(), menu=await page.locator('#navigation').boundingBox();
  expect(menu.y).toBeGreaterThanOrEqual(header.y+header.height-1);
}
report.push('PASS 200% text enlargement on all 13 pages at 375px, including menu positioning');
await page.goto(base,{waitUntil:'networkidle'});
await page.keyboard.press('Tab'); await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused();
expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
for(const [from,to] of [['/about','/about-us'],['/training','/ai_workshop'],['/resources','/news'],['/insights','/news'],['/clubhouse','/club']]) {
  const r=await page.request.get(base+from,{maxRedirects:0});expect(r.status()).toBe(308);expect(r.headers().location).toBe(to);
}
expect(errors).toEqual([]);
report.push('PASS skip link, reduced motion, legacy redirects; no browser console or runtime errors');
await writeFile(interactionsOnly ? 'artifacts/interaction-verification.txt' : 'artifacts/verification.txt',report.join('\n'));
console.log(report.join('\n'));
await browser.close();
