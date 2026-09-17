import { readdir, mkdir, writeFile, access, copyFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { workDestinations } from '../data/legacy-routes.mjs';
const out='dist';
const origin='https://agdestein.github.io';
async function exists(path) {try {await access(path);return true;} catch {return false;}}
let count=0;
const posts=(await readdir('src/content')).filter(name=>/^20.*\.mdx$/.test(name)).map(name=>name.slice(0,-4));
// Preserve the original /posts/ index as well as /posts and /posts.html.
await mkdir(join(out,'posts'),{recursive:true});
await copyFile(join(out,'posts.html'),join(out,'posts/index.html'));
const redirects=new Map();
// Existing clean and .html URLs are served directly by the flat Astro build.
for(const slug of posts) {
  const date=slug.slice(0,10);
  if(posts.filter(p=>p.startsWith(date)).length!==1) continue;
  redirects.set(`/posts/${date}`,`/posts/${slug}`);
  redirects.set(`/posts/${date}.html`,`/posts/${slug}`);
}
for(const [source,target] of Object.entries(workDestinations)) {
  redirects.set(source,target);
  redirects.set(`${source}.html`,target);
}
for(const [source,target] of redirects) {
  const file=join(out,source.endsWith('.html')?source.slice(1):`${source.slice(1)}/index.html`);
  if(await exists(file)) continue; // Real flat HTML pages already preserve these URLs.
  const destination=join(out,target.replace(/^\//,'').replace(/\/$/,''));
  if(!await exists(destination+'.html') && !await exists(join(destination,'index.html'))) throw new Error(`Missing redirect target ${target}`);
  await mkdir(dirname(file),{recursive:true});
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page moved — Syver Døving Agdestein</title><link rel="canonical" href="${origin}${target}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${target}"><script>location.replace(${JSON.stringify(target)}+location.search+location.hash)</script></head><body><p>This page has moved to <a href="${target}">${target}</a>.</p></body></html>`;
  await writeFile(file,html);
  count++;
}
console.log(`Preserved ${count} retired URLs with static redirects.`);
