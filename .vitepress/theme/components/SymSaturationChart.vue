<template>
  <div class="symsat">
    <div class="symsat-header">
      <div class="symsat-legend">
        <span v-for="s in archSeries" :key="s.key" class="symsat-key">
          <span class="symsat-swatch" :class="`symsat-sw-${s.key}`"></span>{{ s.name }}
        </span>
        <span class="symsat-key">
          <span class="symsat-swatch symsat-sw-floor"></span>optimal closure (measured)
        </span>
      </div>
      <div class="symsat-toggle">
        <button class="symsat-btn" :class="{ 'symsat-btn-active': mode === 'prior' }"
          @click="mode = 'prior'">a priori (stress error)</button>
        <button class="symsat-btn" :class="{ 'symsat-btn-active': mode === 'post' }"
          @click="mode = 'post'">a posteriori (simulation error)</button>
      </div>
    </div>

    <div class="symsat-plot">
      <svg :viewBox="`0 0 ${W} ${H}`" class="symsat-svg" role="img"
        aria-label="Closure error versus number of network parameters on a log axis. The equivariant and tensor-basis models are flat at the error floor from 120 parameters on; the unconstrained MLP starts far higher and only reaches the floor at 3000 parameters.">
        <!-- gridlines + y ticks -->
        <g v-for="tick in yTicks" :key="tick">
          <line :x1="ML" :y1="yPix(tick)" :x2="W - MR" :y2="yPix(tick)" class="symsat-grid" />
          <text :x="ML - 8" :y="yPix(tick) + 4" class="symsat-ticktext" text-anchor="end">
            {{ tick.toFixed(1) }}
          </text>
        </g>

        <!-- x ticks -->
        <g v-for="t in xTicks" :key="t">
          <text :x="xPix(t)" :y="H - 24" class="symsat-ticktext" text-anchor="middle">
            {{ t >= 1000 ? t / 1000 + 'k' : t }}
          </text>
        </g>
        <text :x="(ML + W - MR) / 2" :y="H - 6" class="symsat-ticktext symsat-axislabel"
          text-anchor="middle">trainable parameters (log scale)</text>

        <!-- classical baselines -->
        <g v-for="c in visibleClassical" :key="c.key">
          <line :x1="ML" :y1="yPix(c.val)" :x2="W - MR" :y2="yPix(c.val)" class="symsat-hline"
            :class="`symsat-h-${c.key}`" />
          <text :x="W - MR + 8" :y="yPix(c.val) + 4" class="symsat-endlabel"
            :class="`symsat-t-${c.key}`">{{ c.name }}</text>
        </g>

        <!-- optimal-closure floor -->
        <line v-if="mode === 'prior'" :x1="ML" :y1="yPix(floor)" :x2="W - MR" :y2="yPix(floor)"
          class="symsat-floor" />
        <text v-if="mode === 'prior'" :x="W - MR + 8" :y="yPix(floor) + 12"
          class="symsat-endlabel">optimal closure</text>

        <!-- active column hairline -->
        <line v-if="active !== null" :x1="xPix(tierX[active])" :y1="MT" :x2="xPix(tierX[active])"
          :y2="H - MB" class="symsat-cursor" />

        <!-- the 25× annotation (a priori only) -->
        <g v-if="mode === 'prior'">
          <path :d="annotPath" class="symsat-annot-line" />
          <text :x="(xPix(119) + xPix(2962)) / 2" :y="yPix(0.45) + 34" text-anchor="middle"
            class="symsat-annot-text">same error, 25× fewer parameters</text>
        </g>

        <!-- series -->
        <g v-for="s in archSeries" :key="s.key">
          <path :d="linePath(s)" class="symsat-line" :class="`symsat-l-${s.key}`" />
          <g v-for="(p, i) in s.pts" :key="i">
            <line v-if="p[mode + 'Std'] > 0.002" :x1="xPix(p.params)"
              :y1="yPix(p[mode] - p[mode + 'Std'])" :x2="xPix(p.params)"
              :y2="yPix(p[mode] + p[mode + 'Std'])" class="symsat-whisker"
              :class="`symsat-l-${s.key}`" />
            <circle :cx="xPix(p.params)" :cy="yPix(p[mode])" r="4.5" class="symsat-dot"
              :class="`symsat-d-${s.key}`" />
          </g>
        </g>

        <!-- hover targets, one per size tier -->
        <rect v-for="(t, i) in tierX" :key="'hit' + i" :x="xPix(t) - 40" :y="MT" width="80"
          :height="H - MT - MB" fill="transparent" tabindex="0" @mouseenter="active = i"
          @mouseleave="active = null" @focus="active = i" @blur="active = null"
          :aria-label="`Size tier ${tierNames[i]}: ` + archSeries.map(s => `${s.name} ${s.pts[i][mode].toFixed(3)}`).join(', ')" />
      </svg>

      <div v-if="active !== null" class="symsat-tooltip" :style="{ left: tooltipLeft, top: '8%' }">
        <div class="symsat-tt-title">≈ {{ tierNames[active] }} parameters</div>
        <div v-for="s in archSeries" :key="s.key" class="symsat-tt-row">
          <span class="symsat-swatch" :class="`symsat-sw-${s.key}`"></span>{{ s.name }}
          <strong>{{ s.pts[active][mode].toFixed(3) }}</strong>
        </div>
      </div>
    </div>

    <p class="symsat-caption">
      {{ mode === 'prior'
        ? 'Relative error of the predicted sub-filter stress against the exact one, on held-out snapshots. The dashed black line is the training-free conditional-mean estimate of the best possible one-point closure.'
        : 'Relative error of the LES solution against the filtered DNS, time-averaged over the evaluation window. All three architectures land within about 1% of each other once saturated.' }}
      Whiskers span ± one standard deviation over five training seeds. Hover or tab across the
      columns for exact values.
    </p>

    <details class="symsat-table">
      <summary>Data table</summary>
      <table>
        <thead>
          <tr>
            <th>Parameters (≈)</th>
            <th v-for="s in archSeries" :key="s.key">{{ s.name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(t, i) in tierNames" :key="t">
            <td>{{ t }}</td>
            <td v-for="s in archSeries" :key="s.key">
              {{ s.pts[i][mode].toFixed(3) }} ± {{ s.pts[i][mode + 'Std'].toFixed(3) }}
            </td>
          </tr>
          <tr v-for="c in visibleClassical" :key="c.key">
            <td>{{ c.name }}</td>
            <td :colspan="archSeries.length">{{ c.val.toFixed(3) }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../../../data/symmetry-post.json'

const W = 680
const H = 360
const ML = 42
const MR = 118
const MT = 16
const MB = 46

const mode = ref<'prior' | 'post'>('prior')
const active = ref<number | null>(null)

const archSeries = [
  { key: 'mlp', name: 'MLP (unconstrained)', pts: data.saturation.conv },
  { key: 'gcnn', name: 'G-CNN (equivariant)', pts: data.saturation.equi },
  { key: 'tbnn', name: 'TBNN (tensor basis)', pts: data.saturation.tbnn },
]

const floor = data.condmean.indist.train[data.condmean.indist.train.length - 1].relerr

const classical = {
  prior: [
    { key: 'nomo', name: 'no model', val: data.classical.nomo.prior },
    { key: 'smag', name: 'dyn. Smagorinsky', val: data.classical.dynsmag.prior },
    { key: 'clark', name: 'Clark', val: data.classical.clar.prior },
  ],
  post: [
    { key: 'nomo', name: 'no model', val: data.classical.nomo.post },
    { key: 'smag', name: 'dyn. Smagorinsky', val: data.classical.dynsmag.post },
    { key: 'clark', name: 'Clark', val: data.classical.clar.post },
  ],
}
const visibleClassical = computed(() => classical[mode.value])

const XMIN = 90
const XMAX = 4200
const xTicks = [100, 300, 1000, 3000]
const tierNames = ['120', '400', '1200', '3000']
// Hover-column positions: geometric mean of the three archs' parameter counts per tier.
const tierX = tierNames.map((_, i) =>
  Math.exp(
    archSeries.reduce((s, a) => s + Math.log(a.pts[i].params), 0) / archSeries.length
  )
)

const range = computed(() =>
  mode.value === 'prior' ? { min: 0.4, max: 1.05 } : { min: 0.335, max: 0.445 }
)
const yTicks = computed(() => {
  const ticks: number[] = []
  const step = mode.value === 'prior' ? 0.1 : 0.02
  for (let v = Math.ceil(range.value.min / step) * step; v <= range.value.max + 1e-9; v += step)
    ticks.push(Math.round(v * 100) / 100)
  return ticks
})

function xPix(p: number): number {
  const f = (Math.log10(p) - Math.log10(XMIN)) / (Math.log10(XMAX) - Math.log10(XMIN))
  return ML + f * (W - ML - MR)
}
function yPix(v: number): number {
  const { min, max } = range.value
  const f = (Math.min(Math.max(v, min), max) - min) / (max - min)
  return MT + (1 - f) * (H - MT - MB)
}
function linePath(s: { pts: { params: number; prior: number; post: number }[] }): string {
  return s.pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${xPix(p.params).toFixed(1)},${yPix(p[mode.value]).toFixed(1)}`)
    .join('')
}

// Bracket between the constrained models' smallest size and the MLP's largest.
const annotPath = computed(() => {
  const y = yPix(0.45) + 16
  return `M${xPix(119).toFixed(1)},${(yPix(0.445) + 8).toFixed(1)} L${xPix(119).toFixed(1)},${y} L${xPix(2962).toFixed(1)},${y} L${xPix(2962).toFixed(1)},${(yPix(0.449) + 8).toFixed(1)}`
})

const tooltipLeft = computed(() => {
  if (active.value === null) return '0px'
  const frac = xPix(tierX[active.value]) / W
  return `${Math.min(Math.max(frac * 100, 12), 62)}%`
})
</script>

<style>
.symsat {
  --symsat-mlp: #d45500;
  --symsat-gcnn: #2a78d6;
  --symsat-tbnn: #149c6c;
  --symsat-smag: #8f6fd0;
  --symsat-clark: #c2408e;
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
html.dark .symsat {
  --symsat-mlp: #e06925;
  --symsat-gcnn: #4a8ee0;
  --symsat-tbnn: #1cab77;
  --symsat-smag: #9b7ddb;
  --symsat-clark: #d1589f;
}
.symsat-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}
.symsat-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.symsat-key {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.symsat-swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}
.symsat-sw-mlp { background: var(--symsat-mlp); }
.symsat-sw-gcnn { background: var(--symsat-gcnn); }
.symsat-sw-tbnn { background: var(--symsat-tbnn); }
.symsat-sw-floor {
  background: repeating-linear-gradient(90deg, var(--vp-c-text-1) 0 3px, transparent 3px 6px);
  height: 2px;
  margin: 5px 0;
}
.symsat-toggle {
  display: flex;
  gap: 0.4rem;
}
.symsat-btn {
  font-size: 0.78rem;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.symsat-btn-active {
  border-color: var(--symsat-gcnn);
  color: var(--symsat-gcnn);
  font-weight: 600;
}
.symsat-plot {
  position: relative;
}
.symsat-svg {
  width: 100%;
  height: auto;
  display: block;
}
.symsat-grid {
  stroke: var(--vp-c-divider);
  stroke-width: 1;
}
.symsat-ticktext {
  font-size: 11px;
  fill: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
.symsat-axislabel {
  font-size: 11px;
}
.symsat-cursor {
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
}
.symsat-line {
  fill: none;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.symsat-l-mlp { stroke: var(--symsat-mlp); }
.symsat-l-gcnn { stroke: var(--symsat-gcnn); }
.symsat-l-tbnn { stroke: var(--symsat-tbnn); }
.symsat-whisker {
  stroke-width: 1.5;
}
.symsat-dot {
  stroke: var(--vp-c-bg-soft);
  stroke-width: 2;
}
.symsat-d-mlp { fill: var(--symsat-mlp); }
.symsat-d-gcnn { fill: var(--symsat-gcnn); }
.symsat-d-tbnn { fill: var(--symsat-tbnn); }
.symsat-hline {
  stroke-width: 1.5;
  stroke-dasharray: 6 4;
  opacity: 0.7;
}
.symsat-h-nomo { stroke: var(--vp-c-text-3); }
.symsat-h-smag { stroke: var(--symsat-smag); }
.symsat-h-clark { stroke: var(--symsat-clark); }
.symsat-endlabel {
  font-size: 10.5px;
  fill: var(--vp-c-text-2);
}
.symsat-t-smag { fill: var(--symsat-smag); }
.symsat-t-clark { fill: var(--symsat-clark); }
.symsat-t-nomo { fill: var(--vp-c-text-3); }
.symsat-floor {
  stroke: var(--vp-c-text-1);
  stroke-width: 1.5;
  stroke-dasharray: 3 4;
}
.symsat-annot-line {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
}
.symsat-annot-text {
  font-size: 11px;
  font-style: italic;
  fill: var(--vp-c-text-2);
}
.symsat-svg rect:focus {
  outline: none;
}
.symsat-svg rect:focus-visible {
  stroke: var(--symsat-gcnn);
  stroke-width: 1;
}
.symsat-tooltip {
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
.symsat-tt-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}
.symsat-tt-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.symsat-tt-row strong {
  margin-left: auto;
  padding-left: 0.75rem;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}
.symsat-caption {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0.5rem 0 0;
}
.symsat-table {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.symsat-table summary {
  cursor: pointer;
}
.symsat-table table {
  margin-top: 0.5rem;
  font-variant-numeric: tabular-nums;
}
</style>
