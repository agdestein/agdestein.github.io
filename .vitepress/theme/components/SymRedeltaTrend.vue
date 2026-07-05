<template>
  <div class="symre">
    <div class="symre-header">
      <div class="symre-legend">
        <span v-for="s in archs" :key="s.key" class="symre-key">
          <span class="symre-swatch" :class="`symre-sw-${s.key}`"></span>{{ s.name }}
        </span>
        <span class="symre-key"><span class="symre-swatch symre-sw-band"></span>training range</span>
      </div>
      <label class="symre-switch">
        <input type="checkbox" v-model="useRe" />
        <span>feed the closures Re<sub>Δ</sub></span>
      </label>
    </div>

    <div class="symre-tabs">
      <button v-for="m in metrics" :key="m.key" class="symre-btn"
        :class="{ 'symre-btn-active': metric === m.key }" @click="metric = m.key">
        {{ m.name }}</button>
    </div>

    <div class="symre-plot">
      <svg :viewBox="`0 0 ${W} ${H}`" class="symre-svg" role="img"
        :aria-label="`${metricDef.name} versus the filter-scale Reynolds number for the three learned closures, with and without the Reynolds-number input.`">
        <!-- training band -->
        <rect :x="xPix(bandLo)" :y="MT" :width="xPix(bandHi) - xPix(bandLo)" :height="H - MT - MB"
          class="symre-band" />

        <!-- gridlines + y ticks -->
        <g v-for="tick in metricDef.ticks" :key="tick">
          <line :x1="ML" :y1="yPix(tick)" :x2="W - MR" :y2="yPix(tick)" class="symre-grid" />
          <text :x="ML - 8" :y="yPix(tick) + 4" class="symre-ticktext" text-anchor="end">
            {{ tick.toFixed(2) }}
          </text>
        </g>

        <!-- reference line for the calibration metric -->
        <g v-if="metric === 'diss'">
          <line :x1="ML" :y1="yPix(1)" :x2="W - MR" :y2="yPix(1)" class="symre-ref" />
          <text :x="W - MR + 6" :y="yPix(1) + 4" class="symre-endlabel">reference</text>
        </g>

        <!-- x ticks -->
        <g v-for="t in xTicks" :key="t">
          <text :x="xPix(t)" :y="H - 24" class="symre-ticktext" text-anchor="middle">{{ t }}</text>
        </g>
        <text :x="(ML + W - MR) / 2" :y="H - 6" class="symre-ticktext" text-anchor="middle">
          filter-scale Reynolds number Re<tspan baseline-shift="sub" font-size="8">Δ</tspan>
          (log scale)</text>

        <!-- active column hairline -->
        <line v-if="active !== null" :x1="xPix(res[active])" :y1="MT" :x2="xPix(res[active])"
          :y2="H - MB" class="symre-cursor" />

        <!-- ghost series (the other Re setting) -->
        <path v-for="s in archs" :key="'g' + s.key" :d="linePath(s, !useRe)"
          class="symre-line symre-ghost" :class="`symre-l-${s.key}`" />

        <!-- active series -->
        <g v-for="s in archs" :key="s.key">
          <path :d="linePath(s, useRe)" class="symre-line" :class="`symre-l-${s.key}`" />
          <circle v-for="(r, i) in rows(s, useRe)" :key="i" :cx="xPix(r.re)"
            :cy="yPix(r[metric])" r="4" class="symre-dot" :class="`symre-d-${s.key}`" />
        </g>

        <!-- hover targets -->
        <rect v-for="(re, i) in res" :key="'hit' + i" :x="xPix(re) - hitHalf(i)" :y="MT"
          :width="2 * hitHalf(i)" :height="H - MT - MB" fill="transparent" tabindex="0"
          @mouseenter="active = i" @mouseleave="active = null" @focus="active = i"
          @blur="active = null"
          :aria-label="`Re ${Math.round(re)}: ` + archs.map(s => `${s.name} ${rows(s, useRe)[i][metric].toFixed(2)}`).join(', ')" />
      </svg>

      <div v-if="active !== null" class="symre-tooltip" :style="{ left: tooltipLeft, top: '8%' }">
        <div class="symre-tt-title">
          Re<sub>Δ</sub> ≈ {{ Math.round(res[active]) }}
          <span class="symre-tt-sub">{{ useRe ? '+Re input' : 'Reynolds-blind' }}</span>
        </div>
        <div v-for="s in archs" :key="s.key" class="symre-tt-row">
          <span class="symre-swatch" :class="`symre-sw-${s.key}`"></span>{{ s.name }}
          <strong>{{ rows(s, useRe)[active][metric].toFixed(3) }}</strong>
        </div>
      </div>
    </div>

    <p class="symre-caption">
      {{ metricDef.caption }} Faint lines show the {{ useRe ? 'Reynolds-blind' : '+Re' }}
      counterpart. The shaded band is the range of Re<sub>Δ</sub> seen during training; everything
      to its right is extrapolation. Hover for exact values.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../../../data/symmetry-post.json'

const W = 680
const H = 340
const ML = 46
const MR = 76
const MT = 14
const MB = 46

const useRe = ref(false)
const metric = ref<'diss' | 'prior' | 'post'>('diss')
const active = ref<number | null>(null)

const metrics = [
  { key: 'diss' as const, name: 'dissipation calibration' },
  { key: 'prior' as const, name: 'stress error (a priori)' },
  { key: 'post' as const, name: 'simulation error (a posteriori)' },
]

const archs = [
  { key: 'mlp', name: 'MLP', fam: 'conv_p3000' },
  { key: 'gcnn', name: 'G-CNN', fam: 'equi_p3000' },
  { key: 'tbnn', name: 'TBNN', fam: 'tbnn_p3000' },
]

type Row = { re: number; diss: number; prior: number; post: number }
function rows(s: { fam: string }, re: boolean): Row[] {
  return data.trend.series[s.fam + (re ? '_re' : '')] as Row[]
}
const res = (data.trend.series.tbnn_p3000 as Row[]).map((r) => r.re)
const [bandLo, bandHi] = data.trend.trainBand as [number, number]

const XMIN = 190
const XMAX = 1700
const xTicks = [200, 400, 800, 1600]

const metricDefs = {
  diss: {
    name: 'dissipation calibration',
    min: 0.55, max: 1.75, log: true,
    ticks: [0.6, 0.8, 1.0, 1.25, 1.5],
    caption:
      'Median sub-filter dissipation divided by the true value (1 = perfectly calibrated, log scale). Reynolds-blind closures slide from over- to under-dissipation as the test Reynolds number grows; with the Reynolds input they hold their calibration.',
  },
  prior: {
    name: 'stress error',
    min: 0.36, max: 0.52, log: false,
    ticks: [0.4, 0.45, 0.5],
    caption:
      'A-priori relative stress error. Essentially flat and barely changed by the input: the tensor structure of the sub-filter stress is close to Reynolds-independent.',
  },
  post: {
    name: 'simulation error',
    min: 0.22, max: 0.38, log: false,
    ticks: [0.25, 0.3, 0.35],
    caption:
      'Time-mean a-posteriori solution error of the LES rollout against the filtered DNS. The Re_Δ-informed closures attain the lowest errors at the highest Reynolds numbers.',
  },
}
const metricDef = computed(() => metricDefs[metric.value])

function xPix(re: number): number {
  const f = (Math.log10(re) - Math.log10(XMIN)) / (Math.log10(XMAX) - Math.log10(XMIN))
  return ML + f * (W - ML - MR)
}
function yPix(v: number): number {
  const { min, max, log } = metricDef.value
  const c = Math.min(Math.max(v, min), max)
  const f = log
    ? (Math.log10(c) - Math.log10(min)) / (Math.log10(max) - Math.log10(min))
    : (c - min) / (max - min)
  return MT + (1 - f) * (H - MT - MB)
}
function linePath(s: { fam: string }, re: boolean): string {
  return rows(s, re)
    .map((r, i) => `${i === 0 ? 'M' : 'L'}${xPix(r.re).toFixed(1)},${yPix(r[metric.value]).toFixed(1)}`)
    .join('')
}

function hitHalf(i: number): number {
  const x = xPix(res[i])
  const prev = i > 0 ? xPix(res[i - 1]) : ML
  const next = i < res.length - 1 ? xPix(res[i + 1]) : W - MR
  return Math.max(6, Math.min((x - prev) / 2, (next - x) / 2))
}

const tooltipLeft = computed(() => {
  if (active.value === null) return '0px'
  const frac = xPix(res[active.value]) / W
  return `${Math.min(Math.max(frac * 100 - 20, 4), 60)}%`
})
</script>

<style>
.symre {
  --symre-mlp: #d45500;
  --symre-gcnn: #2a78d6;
  --symre-tbnn: #149c6c;
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
html.dark .symre {
  --symre-mlp: #e06925;
  --symre-gcnn: #4a8ee0;
  --symre-tbnn: #1cab77;
}
.symre-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}
.symre-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.symre-key {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.symre-swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}
.symre-sw-mlp { background: var(--symre-mlp); }
.symre-sw-gcnn { background: var(--symre-gcnn); }
.symre-sw-tbnn { background: var(--symre-tbnn); }
.symre-sw-band {
  background: var(--vp-c-text-3);
  opacity: 0.25;
}
.symre-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-weight: 600;
}
.symre-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}
.symre-btn {
  font-size: 0.78rem;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.symre-btn-active {
  border-color: var(--symre-gcnn);
  color: var(--symre-gcnn);
  font-weight: 600;
}
.symre-plot {
  position: relative;
}
.symre-svg {
  width: 100%;
  height: auto;
  display: block;
}
.symre-band {
  fill: var(--vp-c-text-3);
  opacity: 0.1;
}
.symre-grid {
  stroke: var(--vp-c-divider);
  stroke-width: 1;
}
.symre-ticktext {
  font-size: 11px;
  fill: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
.symre-ref {
  stroke: var(--vp-c-text-1);
  stroke-width: 1.5;
  stroke-dasharray: 3 4;
}
.symre-endlabel {
  font-size: 10.5px;
  fill: var(--vp-c-text-2);
}
.symre-cursor {
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
}
.symre-line {
  fill: none;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.symre-ghost {
  opacity: 0.22;
}
.symre-l-mlp { stroke: var(--symre-mlp); }
.symre-l-gcnn { stroke: var(--symre-gcnn); }
.symre-l-tbnn { stroke: var(--symre-tbnn); }
.symre-dot {
  stroke: var(--vp-c-bg-soft);
  stroke-width: 2;
}
.symre-d-mlp { fill: var(--symre-mlp); }
.symre-d-gcnn { fill: var(--symre-gcnn); }
.symre-d-tbnn { fill: var(--symre-tbnn); }
.symre-svg rect:focus {
  outline: none;
}
.symre-svg rect:focus-visible {
  stroke: var(--symre-gcnn);
  stroke-width: 1;
}
.symre-tooltip {
  position: absolute;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
}
.symre-tt-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}
.symre-tt-sub {
  font-weight: 400;
  color: var(--vp-c-text-3);
  margin-left: 0.4rem;
}
.symre-tt-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.symre-tt-row strong {
  margin-left: auto;
  padding-left: 0.75rem;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}
.symre-caption {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0.5rem 0 0;
}
</style>
