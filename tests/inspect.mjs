import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
await mkdir('/tmp/syver-redesign',{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
page.on('pageerror',e=>console.log('PAGE ERROR:',e.message));
await page.goto('http://localhost:4321',{waitUntil:'networkidle'});
await page.screenshot({path:'/tmp/syver-redesign/aurora-desktop.png',fullPage:true});
await page.screenshot({path:'/tmp/syver-redesign/aurora-hero.png'});
for(const theme of ['desert','coffee']){
 await page.locator('[data-theme-toggle]').click();await page.locator(`[data-theme-option="${theme}"]`).click();await page.locator('[data-theme-toggle]').click();
 await page.screenshot({path:`/tmp/syver-redesign/${theme}-desktop.png`,fullPage:true});
}
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:'/tmp/syver-redesign/coffee-mobile.png',fullPage:true});
await page.locator('[data-theme-toggle]').click();await page.locator('[data-theme-option="aurora"]').click();await page.locator('[data-theme-toggle]').click();
await page.screenshot({path:'/tmp/syver-redesign/aurora-mobile.png',fullPage:true});
await page.goto('http://localhost:4321/posts/2026-07-05-time-integration-as-filtering',{waitUntil:'networkidle'});
console.log('article overflow',await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,overflows:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2).map(e=>e.className).slice(0,20)})));
await page.screenshot({path:'/tmp/syver-redesign/article-mobile.png',fullPage:true});
await page.locator('.tifr').scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/syver-redesign/article-figure-mobile.png'});
await page.setViewportSize({width:1440,height:1000});await page.locator('.tife').scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/syver-redesign/article-figure-desktop.png'});
await browser.close();
