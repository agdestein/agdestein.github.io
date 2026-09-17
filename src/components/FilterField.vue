<script setup lang="ts">
import { computed, ref } from 'vue';
const width = ref(.2);
const mode = ref<'space'|'time'>('time');
const components = [[1,1],[5,.3],[12,.13]];
const sinc=(x:number)=>Math.abs(x)<1e-8?1:Math.sin(x)/x;
const signal=(x:number,filtered:boolean)=>components.reduce((sum,[f,a])=>sum+a*(filtered?sinc(Math.PI*f*width.value):1)*Math.sin(2*Math.PI*f*(x+(filtered&&mode.value==='time'?width.value/2:0))),0);
const path=(filtered:boolean)=>Array.from({length:321},(_,i)=>{const x=i/320;return `${i?'L':'M'}${(x*540+10).toFixed(2)},${(105-signal(x,filtered)*62).toFixed(2)}`;}).join(' ');
const original=computed(()=>path(false)), filtered=computed(()=>path(true));
const retained=computed(()=>Math.round(100*components.reduce((s,[f,a])=>s+(a*sinc(Math.PI*f*width.value))**2,0)/components.reduce((s,[,a])=>s+a*a,0)));
</script>
<template>
  <div class="filter-field">
    <div class="field-heading"><span class="eyebrow">Inside the filter</span><div class="mode-switch" aria-label="Filter direction"><button :aria-pressed="mode==='space'" @click="mode='space'">Space</button><button :aria-pressed="mode==='time'" @click="mode='time'">Time</button></div></div>
    <div class="field-legend"><span><i class="original-key"></i>Original signal</span><span><i></i>Filtered signal</span></div>
    <svg viewBox="0 0 560 215" role="img" :aria-label="`${mode==='time'?'Forward time':'Centered spatial'} top-hat filter of width ${width.toFixed(2)} applied to an illustrative periodic signal. ${retained}% of mean-square signal retained.`">
      <defs><linearGradient id="filterFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="var(--accent)" stop-opacity=".13"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
      <g stroke="var(--line)" stroke-width=".7"><path v-for="y in [35,105,175]" :d="`M10 ${y}H550`"/><path v-for="x in [10,145,280,415,550]" :d="`M${x} 15V195`" stroke-dasharray="2 5"/></g>
      <rect :x="mode==='space'?280-width*270:280" y="15" :width="width*540" height="180" fill="var(--accent)" opacity=".07"/>
      <path :d="original" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="3 4" opacity=".6"/>
      <path :d="filtered+' L550 200 L10 200Z'" fill="url(#filterFill)"/>
      <path :d="filtered" fill="none" stroke="var(--accent)" stroke-width="2.8" stroke-linecap="round"/>
    </svg>
    <div class="field-axis"><span>0</span><span>{{ mode==='time'?'time →':'position →' }}</span><span>1</span></div>
    <div class="filter-control"><label for="filter-width">Filter width <span>{{ mode==='time'?'τ':'h' }}</span></label><output for="filter-width">{{ width.toFixed(2) }}</output><input id="filter-width" v-model.number="width" type="range" min="0.02" max="0.80" step="0.01" /></div>
    <div class="field-note"><span>Drag to reveal what disappears.</span><span>{{ retained }}% energy retained</span></div>
    <p class="field-source">Analytic signal · illustrative, not experimental data</p>
  </div>
</template>
<style scoped>
.field-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:25px; }
.mode-switch { display:flex; padding:3px; background:var(--bg); border:1px solid var(--line); border-radius:5px; }
.mode-switch button { border:0; background:transparent; font-size:10px; padding:6px 11px; border-radius:3px; color:var(--muted); }
.mode-switch button[aria-pressed='true'] { background:var(--surface-raised); color:var(--ink); }
.field-legend { display:flex; gap:18px; color:var(--muted); font-size:10px; }
.field-legend span { display:flex; align-items:center; gap:7px; }.field-legend i { width:14px; height:2px; background:var(--accent); }
.field-legend .original-key { height:0; background:transparent; border-top:2px dashed var(--muted); }
svg { width:100%; height:auto; display:block; margin:16px 0 0; }
.field-axis { display:flex; justify-content:space-between; font:9px 'IBM Plex Mono',monospace; color:var(--muted); padding:0 4px; }
.filter-control { display:grid; grid-template-columns:1fr auto; gap:12px; margin-top:27px; font-size:11px; }
.filter-control label span { font-family:'STIX Two Text',serif; font-style:italic; margin-left:6px; color:var(--accent); }
.filter-control output { color:var(--accent); font-family:'IBM Plex Mono',monospace; }
input { grid-column:1/-1; width:100%; accent-color:var(--accent); height:18px; cursor:ew-resize; margin:0; }
.field-note { display:flex; justify-content:space-between; gap:14px; font-size:9px; color:var(--muted); margin-top:12px; }
.field-source { border-top:1px solid var(--line); margin:20px 0 0; padding-top:13px; font-size:9px; color:var(--muted); }
@media(max-width:520px) { .field-heading { margin-bottom:20px; } .field-note { font-size:9px; } }
</style>
