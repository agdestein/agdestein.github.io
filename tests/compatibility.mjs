import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
const base=process.env.TEST_URL || 'http://localhost:4321';
const legacy=JSON.parse(await readFile(new URL('./legacy-urls.json',import.meta.url),'utf8'));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
try {
  const page=await browser.newPage({reducedMotion:'reduce'});
  for(const [source,target] of Object.entries(legacy)) {
    await page.goto(base+source,{waitUntil:'load',timeout:15000});
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://agdestein.github.io'+target);
  }
  await page.goto(base+'/works/symmetry?from=legacy#main',{waitUntil:'load'});
  assert.equal(new URL(page.url()).pathname,'/posts/2026-07-06-symmetry');
  assert.equal(new URL(page.url()).search,'?from=legacy');
  assert.equal(new URL(page.url()).hash,'#main');
  const staticContext=await browser.newContext({javaScriptEnabled:false});
  const staticPage=await staticContext.newPage();
  await staticPage.goto(base+'/posts/2024-10-05.html',{waitUntil:'load'});
  await expect(staticPage.locator('h1')).toBeVisible();
  await expect(staticPage.locator('link[rel="canonical"]')).toHaveAttribute('href','https://agdestein.github.io/posts/2024-10-05-forward-vs-reverse-ad');
  await staticContext.close();
  console.log(`PASS ${Object.keys(legacy).length} legacy URLs reach real pages without loops; redirects preserve queries/fragments and work without JavaScript`);
} finally {await browser.close();}
