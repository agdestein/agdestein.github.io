import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
const base=process.env.TEST_URL || 'http://localhost:4321';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const article='/posts/2026-07-05-time-integration-as-filtering';
const routes=['/','/posts/','/publications','/talks','/software','/about',article,...['2024-10-05-forward-vs-reverse-ad','2024-10-06-differentiable-fluid-solver','2025-10-30-beamer-widescreen','2026-07-04-exact-closure','2026-07-06-symmetry'].map(s=>'/posts/'+s),'/404.html'];
const checks=[];
try {
  await page.goto(base,{waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('data-motion'),'off');
  checks.push('System reduced-motion preference respected on first visit');
  const palette=[];
  for (const theme of ['aurora','desert','coffee','alpine','rainforest','ocean']) {
    await page.locator('[data-theme-toggle]').click();
    await page.locator(`[data-theme-option="${theme}"]`).click();
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
    await page.locator('#filter-width').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>!document.querySelector('astro-island')?.hasAttribute('ssr'));
    const before=await page.locator('.filter-field svg > path').last().getAttribute('d');
    await page.locator('#filter-width').focus();
    await page.locator('#filter-width').press('End');
    await page.waitForTimeout(50);
    assert.notEqual(await page.locator('.filter-field svg > path').last().getAttribute('d'),before);
    await page.locator('#filter-width').press('Home');
    palette.push(await page.locator('.filter-field svg > path').last().evaluate(e=>getComputedStyle(e).stroke));
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
  }
  assert.equal(new Set(palette).size,6);
  checks.push('All six themes persist through reload and recolor the working home-page figure');
  await page.locator('[data-theme-toggle]').click();
  await page.locator('[data-theme-option="ocean"]').focus();await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('html').getAttribute('data-theme'),'aurora');
  await page.locator('[data-motion-toggle]').click();
  assert.equal(await page.locator('html').getAttribute('data-motion'),'on');
  await page.keyboard.press('Escape');
  const hasGL=await page.locator('[data-atmosphere]').evaluate(e=>!!e.getContext('webgl'));
  if(hasGL) {
    await page.waitForFunction(()=>document.querySelector('[data-atmosphere]').dataset.running==='true');
    await page.locator('.site-footer').scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>document.querySelector('[data-atmosphere]').dataset.running==='false');
    checks.push('Shader runs when enabled and pauses outside the viewport');
  }
  await page.goto(base+article,{waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('data-theme'),'aurora');
  assert.equal(await page.locator('html').getAttribute('data-motion'),'on');
  assert.ok(await page.locator('.katex').count()>20);
  const anchors=await page.locator('.article-toc a[href^="#"]').evaluateAll(els=>els.map(e=>({href:e.getAttribute('href'),exists:!!document.getElementById(e.getAttribute('href').slice(1))})));
  assert.ok(anchors.every(a=>a.exists),JSON.stringify(anchors));
  await page.locator('.tifd').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>!document.querySelector('.tifd').closest('astro-island').hasAttribute('ssr'));
  const slope=await page.locator('.tifd-readout strong').textContent();
  await page.locator('.tifd input').first().focus();await page.locator('.tifd input').first().press('End');
  assert.notEqual(await page.locator('.tifd-readout strong').textContent(),slope);
  await page.locator('.tifr').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>!document.querySelector('.tifr').closest('astro-island').hasAttribute('ssr'));
  await page.locator('.tifr input').focus();await page.locator('.tifr input').press('End');
  assert.match(await page.locator('.tifr-note').innerText(),/59%/);
  await page.locator('.tife').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>!document.querySelector('.tife').closest('astro-island').hasAttribute('ssr'));
  await page.locator('.tife svg rect[tabindex]').last().focus();
  assert.match(await page.locator('.tife-tooltip').innerText(),/0.097/);
  await page.locator('.tife-table summary').click();assert.equal(await page.locator('.tife-table tbody tr').count(),5);
  const chartColors=[];
  for(const theme of ['aurora','desert','coffee','alpine','rainforest','ocean']) {
    await page.locator('[data-theme-toggle]').click();await page.locator(`[data-theme-option="${theme}"]`).click();await page.keyboard.press('Escape');
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
    await page.locator('.tife').scrollIntoViewIfNeeded();
    await page.waitForFunction(expected=>getComputedStyle(document.querySelector('.tife-l-st')).stroke===expected, {aurora:'rgb(180, 228, 190)',desert:'rgb(153, 71, 35)',coffee:'rgb(130, 70, 46)',alpine:'rgb(37, 100, 127)',rainforest:'rgb(195, 217, 141)',ocean:'rgb(135, 222, 217)'}[theme]);
    chartColors.push(await page.locator('.tife-l-st').evaluate(e=>getComputedStyle(e).stroke));
  }
  assert.equal(new Set(chartColors).size,6,JSON.stringify(chartColors));
  checks.push('Article math, contents links, three hydrated figures, numerical readouts, keyboard tooltip and data table work');
  checks.push('Article scientific series recolor in all six themes without changing data');
  await page.locator('[data-search-open]').click();await page.locator('#site-search').fill('time integration');
  assert.ok(await page.locator('.search-results a').count()>0);
  await page.keyboard.press('Escape');await expect(page.locator('.search-dialog')).toBeHidden();
  await page.goto(base+'/publications',{waitUntil:'networkidle'});await page.locator('.citation summary').first().click();
  assert.match(await page.locator('.citation pre').first().innerText(),/@/);
  checks.push('Search, Escape dismissal and publication citations work');
  const links=new Set();
  for(const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    for(const route of routes) {
      await page.goto(base+route,{waitUntil:'networkidle'});
      assert.equal(await page.locator('h1').count(),1,route);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,`Overflow at ${width}: ${route}`);
      for(const url of await page.locator('a[href^="/"]').evaluateAll(es=>es.map(e=>e.getAttribute('href').split('#')[0])))links.add(url);
    }
  }
  for(const url of links) {
    const path=resolve('dist',decodeURIComponent(url).replace(/^\//,''));
    assert.ok(existsSync(path)||existsSync(path+'.html')||existsSync(path+'/index.html'),`Missing local destination ${url}`);
  }
  await page.setViewportSize({width:390,height:844});await page.goto(base,{waitUntil:'networkidle'});
  await page.locator('[data-menu-toggle]').click();assert.equal(await page.locator('#mobile-nav').isVisible(),true);
  await page.locator('#mobile-nav a[href="/about"]').click();await page.waitForURL(/\/about\/?$/);
  checks.push(`Thirteen routes fit at 320, 390, 768 and 1440px; all ${links.size} local link destinations exist; mobile navigation works`);
  assert.deepEqual(errors,[]);
  checks.push('No browser JavaScript errors');
  console.log(checks.map(x=>'PASS '+x).join('\n'));
} finally {await browser.close();}
