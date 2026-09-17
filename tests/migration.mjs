import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const base=process.env.TEST_URL || 'http://localhost:4321';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const screenshotDir=process.env.SCREENSHOT_DIR;
if(screenshotDir) await mkdir(screenshotDir,{recursive:true});
async function shot(name){if(screenshotDir){await page.waitForTimeout(400);await page.screenshot({path:`${screenshotDir}/${name}.png`});}}
async function hydrate(selector){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForFunction(s=>!document.querySelector(s).closest('astro-island').hasAttribute('ssr'),selector);}
async function theme(name){await page.locator('[data-theme-toggle]').click();await page.locator(`[data-theme-option="${name}"]`).click();await page.keyboard.press('Escape');}
try {
 await page.goto(base+'/posts/2026-07-06-symmetry',{waitUntil:'networkidle'});
 assert.equal(await page.locator('astro-island').count(),8);
 await hydrate('.symhero');await page.locator('.symhero input').press('End');await expect(page.locator('.symhero-dns')).toHaveAttribute('style',/inset\(0(?:px)? 0%/);
 await hydrate('.symcut');const energy=await page.locator('.symcut-blue').innerText();await page.locator('.symcut-range').press('Home');assert.notEqual(await page.locator('.symcut-blue').innerText(),energy);
 await hydrate('.symrg');await page.locator('.symrg input').press('Home');await expect(page.locator('.symrg-readout')).toHaveClass(/readout-ok/);await page.locator('.symrg input').press('ArrowRight');await expect(page.locator('.symrg-readout')).not.toHaveClass(/readout-ok/);
 await hydrate('.symeq');await page.locator('.symeq').getByRole('button',{name:'90°',exact:true}).click();const mismatch=await page.locator('.symeq-readout strong').innerText();await page.locator('.symeq').getByRole('button',{name:'unconstrained',exact:true}).click();assert.notEqual(await page.locator('.symeq-readout strong').innerText(),mismatch);
 await hydrate('.symsat');await page.locator('.symsat svg rect[tabindex]').first().focus();await expect(page.locator('.symsat-tooltip')).toContainText('120');const prior=await page.locator('.symsat-l-mlp').first().getAttribute('d');await page.locator('.symsat-toggle button').last().click();assert.notEqual(await page.locator('.symsat-l-mlp').first().getAttribute('d'),prior);assert.equal(new Set(await page.locator('.symsat svg g > text[text-anchor="end"]').allTextContents()).size, await page.locator('.symsat svg g > text[text-anchor="end"]').count());await page.locator('.symsat-table summary').click();assert.ok(await page.locator('.symsat-table tbody tr').count()>4);await shot('symmetry-saturation');
 await hydrate('.symcm');const bins=await page.locator('.symcm-stat-value').first().innerText();await page.locator('#symcm-bins').press('End');assert.notEqual(await page.locator('.symcm-stat-value').first().innerText(),bins);
 await hydrate('.symbs');await page.locator('.symbs-probe input').press('End');await expect(page.locator('.symbs-tooltip')).toContainText('0.95');await expect(page.locator('.symbs-probe output')).toContainText('exact stress');
 await hydrate('.symre');const without=await page.locator('.symre-line:not(.symre-ghost)').first().getAttribute('d');await page.locator('.symre input').check();assert.notEqual(await page.locator('.symre-line:not(.symre-ghost)').first().getAttribute('d'),without);
 await page.locator('.symre-tabs button').last().click();await page.locator('.symre svg rect[tabindex]').first().focus();await expect(page.locator('.symre-tooltip')).toBeVisible();
 assert.equal(await page.locator('video').getAttribute('autoplay'),null);
 for(const name of ['aurora','desert','coffee','alpine','rainforest','ocean']) {
  await theme(name);await page.locator('.symsat').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.symsat-l-mlp')).stroke===getComputedStyle(document.querySelector('.symsat')).getPropertyValue('--series-3').trim().replace(/^#(..)(..)(..)$/,(_,r,g,b)=>`rgb(${parseInt(r,16)}, ${parseInt(g,16)}, ${parseInt(b,16)})`));
  const colors=await page.locator('.symsat').evaluate(e=>['--symsat-mlp','--symsat-gcnn','--symsat-tbnn','--symsat-smag','--symsat-clark'].map(p=>getComputedStyle(e).getPropertyValue(p)));
  assert.equal(new Set(colors).size,5);
 }
 console.log('PASS Eight symmetry figures hydrate and respond; five scientific series follow all six palettes');
 await page.goto(base+'/posts/2026-07-04-exact-closure',{waitUntil:'networkidle'});
 await hydrate('.xclm');await page.locator('.xclm-toggle button').first().click();await expect(page.locator('.xclm-route').first()).not.toHaveClass(/dim/);
 await hydrate('.xclp');const projection=await page.locator('.xclp-readout').innerText();await page.locator('.xclp-handle').press('ArrowLeft');assert.notEqual(await page.locator('.xclp-readout').innerText(),projection);await shot('exact-projection');
 await hydrate('.xcll');await page.locator('.xcll-row').last().click();await expect(page.locator('.xcll-row').last()).toHaveClass(/active/);await shot('exact-ladder');
 console.log('PASS Exact-closure route selector, keyboard projection and stress ladder work');
 for(const slug of ['2024-10-05-forward-vs-reverse-ad','2024-10-06-differentiable-fluid-solver','2025-10-30-beamer-widescreen']) {
  await page.goto(base+'/posts/'+slug,{waitUntil:'networkidle'});
  if(!slug.includes('fluid')) assert.ok(await page.locator('.prose pre').count()>0);
  assert.equal(await page.locator('.katex-error').count(),0);
  assert.equal(await page.locator('.prose').innerText().then(t=>t.includes(':::')),false);
  if(slug.includes('fluid')) {await expect(page.locator('.draft-label')).toBeVisible();assert.ok(await page.locator('.footnotes li').count()>0);}
  const images=await page.locator('.prose img').all();for(const img of images){await img.scrollIntoViewIfNeeded();await expect(img).toHaveJSProperty('complete',true);assert.ok(await img.evaluate(e=>e.naturalWidth>0));}
  if(slug.includes('beamer')){assert.match(await page.locator('.prose pre').first().getAttribute('style'),/var\(--surface\)/);await page.locator('.prose').scrollIntoViewIfNeeded();await shot('beamer-code');}
 }
 console.log('PASS Older posts retain code, math, callouts, images, footnotes and draft status');
 for(const width of [1440,390,320]) {
  await page.setViewportSize({width,height:900});await page.goto(base,{waitUntil:'networkidle'});
  for(const name of ['alpine','rainforest','ocean']) {
   await theme(name);await page.locator('.hero').scrollIntoViewIfNeeded();await shot(`${width}-${name}`);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
   await expect(page.locator(`.${name}-landscape`)).toBeVisible();assert.equal(await page.locator('.landscape:visible').count(),1);
  }
 }
 // Check the scrollable plots after hydration as well as their static article layout.
 for(const width of [320,390,768,1440]) {
  await page.setViewportSize({width,height:900});
  for(const [slug,selector] of [['2026-07-06-symmetry','.symsat'],['2026-07-04-exact-closure','.xclp']]) {
   await page.goto(base+'/posts/'+slug,{waitUntil:'networkidle'});await hydrate(selector);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`${slug} at ${width}`);
   if(width<680 && selector==='.symsat') assert.ok(await page.locator('.symsat-plot').evaluate(e=>e.scrollWidth>e.clientWidth));
  }
 }
 await page.goto(base,{waitUntil:'networkidle'});
 // A short phone viewport must still allow access to the last theme and motion control.
 await page.setViewportSize({width:320,height:480});await page.locator('[data-theme-toggle]').click();await page.locator('[data-motion-toggle]').click();assert.equal(await page.locator('html').getAttribute('data-motion'),'on');await page.keyboard.press('Escape');
 for(const name of ['alpine','rainforest','ocean']) {
  await theme(name);await page.locator('.hero').scrollIntoViewIfNeeded();
  if(await page.locator('[data-atmosphere]').evaluate(e=>!!e.getContext('webgl'))) await page.waitForFunction(()=>document.querySelector('[data-atmosphere]').dataset.running==='true');
 }
 await page.locator('[data-theme-toggle]').click();await page.locator('[data-motion-toggle]').click();await page.keyboard.press('Escape');await expect(page.locator('[data-atmosphere]')).toHaveAttribute('data-running','false');
 const staticContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const staticPage=await staticContext.newPage();await staticPage.goto(base);await expect(staticPage.locator('.aurora-landscape')).toBeVisible();await staticPage.goto(base+'/posts/2026-07-06-symmetry');assert.equal(await staticPage.locator('.symcut svg').count(),1);await staticContext.close();
 console.log('PASS New landscapes fit phone and desktop; short picker scrolls; shaders pause; static article and landscape remain without JavaScript');
 assert.deepEqual(errors,[]);
} finally {await browser.close();}
