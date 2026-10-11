import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'});
const report=[];
for(const width of [375,1440]) {
for(const route of ['/','/about-us','/case-studies','/services','/ai-for-local-government','/records_management','/policy_writing','/ai_workshop','/fractional-interim-leadership','/news','/contact','/club']) {
  await page.setViewportSize({width,height:1000});
  await page.goto('http://localhost:3000'+route,{waitUntil:'networkidle'});
  if(route==='/services') { if(width===375)await page.locator('.menu-toggle').click(); await page.getByRole('button',{name:'Show services submenu'}).click(); }
  await page.addScriptTag({path:'artifacts/axe.min.js'});
  const result=await page.evaluate(async()=>await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
  const violations=result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
  const targets=await page.locator('a,button,summary').evaluateAll(els=>els.filter(e=>e.getBoundingClientRect().width>0 && e.getBoundingClientRect().height>0 && !e.closest('details:not([open]) p') && !e.classList.contains('skip-link')).filter(e=>e.getBoundingClientRect().height<44 || e.getBoundingClientRect().width<44).map(e=>({text:e.textContent,height:e.getBoundingClientRect().height,width:e.getBoundingClientRect().width})));
  report.push({width,route,violations,shortTargets:targets});
}
}
await writeFile('artifacts/accessibility.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
expect(report.every(r=>r.violations.length===0 && r.shortTargets.length===0)).toBeTruthy();
