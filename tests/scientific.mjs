import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
// Captured from the original VitePress scripts before the root migration.
// Only relative data-import prefixes are normalized; equations and data stay exact.
const baseline=JSON.parse(await readFile(new URL('./scientific-baseline.json',import.meta.url),'utf8'));
for(const [name,expected] of Object.entries(baseline)) {
  const source=await readFile(new URL(`../src/components/${name}.vue`,import.meta.url),'utf8');
  const script=source.match(/<script setup lang="ts">([\s\S]*?)<\/script>/)[1].replace(/(?:\.\.\/)+data\//g,'data/');
  assert.equal(createHash('sha256').update(script).digest('hex'),expected,`${name}: scientific script changed since migration`);
}
console.log(`PASS ${Object.keys(baseline).length} scientific component scripts retain the original calculations and data`);
