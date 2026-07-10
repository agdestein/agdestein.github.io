<template>
  <div class="symcm">
    <div class="symcm-header">
      <div class="symcm-stats">
        <div class="symcm-stat">
          <span class="symcm-stat-value">{{ nBins }}</span>
          <span class="symcm-stat-label">{{ nBins === 1 ? 'bin — a constant-coefficient model' : 'bins' }}</span>
        </div>
        <div class="symcm-stat">
          <span class="symcm-stat-value symcm-blue">{{ (eta2 * 100).toFixed(0) }}%</span>
          <span class="symcm-stat-label">of the variance explained by the binned mean</span>
        </div>
      </div>
      <div class="symcm-slider">
        <label class="symcm-slider-label" for="symcm-bins">number of bins</label>
        <input id="symcm-bins" type="range" min="0" :max="BIN_STEPS.length - 1" step="1"
          v-model.number="binIdx" aria-label="Number of bins used to estimate the conditional mean" />
      </div>
    </div>

    <div class="symcm-plot">
      <svg :viewBox="`0 0 ${W} ${H}`" class="symcm-svg" role="img"
        aria-label="Scatter plot of the sub-filter energy transfer against a rotation invariant of the resolved velocity gradient, with a binned conditional-mean curve on top. The cloud is wide: even the best pointwise average leaves most of the scatter unexplained.">
        <!-- alternating bin stripes -->
        <g v-if="nBins > 1">
          <rect v-for="i in stripeIdx" :key="i" :x="xPix(binEdge(i))" :y="MT"
            :width="xPix(binEdge(i + 1)) - xPix(binEdge(i))" :height="H - MT - MB"
            class="symcm-stripe" />
        </g>

        <!-- backscatter region -->
        <rect :x="ML" :y="yPix(0)" :width="W - ML - MR" :height="H - MB - yPix(0)"
          class="symcm-backscatter" />
        <text :x="W - MR - 8" :y="H - MB - 10" text-anchor="end" class="symcm-bs-label">
          backscatter: energy flowing the “wrong” way
        </text>

        <!-- axes -->
        <line :x1="ML" :y1="yPix(0)" :x2="W - MR" :y2="yPix(0)" class="symcm-zero" />
        <g v-for="t in yTicks" :key="'y' + t">
          <text :x="ML - 8" :y="yPix(t) + 4" class="symcm-ticktext" text-anchor="end">
            {{ t.toFixed(2) }}
          </text>
        </g>
        <g v-for="t in xTicksArr" :key="'x' + t">
          <text :x="xPix(t)" :y="H - MB + 18" class="symcm-ticktext" text-anchor="middle">
            {{ t.toFixed(1) }}
          </text>
        </g>
        <text :x="(ML + W - MR) / 2" :y="H - 6" class="symcm-ticktext symcm-axislabel"
          text-anchor="middle">one rotation-invariant of the resolved gradient, tr S̄² ∕ |Ā|²</text>
        <text :x="14" :y="(MT + H - MB) / 2" class="symcm-ticktext symcm-axislabel"
          text-anchor="middle" :transform="`rotate(-90 14 ${(MT + H - MB) / 2})`">
          sub-filter energy transfer Π (normalized)</text>

        <!-- data: one path of zero-length round-capped segments = 2048 dots, one DOM node -->
        <path :d="cloudPath" class="symcm-dot" />

        <!-- conditional mean -->
        <path :d="meanPath" class="symcm-mean" />
        <circle v-for="(b, i) in binPts" :key="'b' + i" :cx="xPix(b.x)" :cy="yPix(b.m)" r="3.5"
          class="symcm-mean-dot" />
      </svg>
    </div>

    <p class="symcm-caption">
      Every gray dot is one grid point of a held-out DNS snapshot: local energy transfer Π against
      one invariant of the resolved gradient. <strong>Slide the bins</strong>: sorting the points
      and averaging within each bin — a histogram, no training — makes the conditional mean
      <span class="symcm-blue">◆</span> appear. It converges after a handful of bins, and the wide
      cloud around it never shrinks: that residual is information the filter destroyed, and no
      pointwise model, neural or otherwise, can get it back.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../../../data/symmetry-deck.json'

const W = 680
const H = 400
const ML = 52
const MR = 14
const MT = 12
const MB = 62

const xs = data.scatter2.x as number[]
const ys = data.scatter2.y as number[]
const [XLO, XHI] = data.scatter2.xrange as [number, number]
const [YLO, YHI] = data.scatter2.yrange as [number, number]

const BIN_STEPS = [1, 2, 4, 8, 16, 32, 64]
const binIdx = ref(3)
const nBins = computed(() => BIN_STEPS[binIdx.value])

function xPix(v: number): number {
  return ML + ((v - XLO) / (XHI - XLO)) * (W - ML - MR)
}
function yPix(v: number): number {
  const c = Math.min(Math.max(v, YLO), YHI)
  return MT + (1 - (c - YLO) / (YHI - YLO)) * (H - MT - MB)
}

const cloudPath = xs
  .map((x, i) => `M${xPix(x).toFixed(1)},${yPix(ys[i]).toFixed(1)}h0`)
  .join('')

const yTicks = [-0.04, 0, 0.04, 0.08, 0.12]
const xTicksArr = [0.1, 0.3, 0.5, 0.7, 0.9]

function binEdge(i: number): number {
  return XLO + (i / nBins.value) * (XHI - XLO)
}
const stripeIdx = computed(() =>
  Array.from({ length: Math.ceil(nBins.value / 2) }, (_, j) => 2 * j)
)

// Conditional mean and explained variance, computed live from the points.
const binned = computed(() => {
  const nb = nBins.value
  const sums = new Array(nb).fill(0)
  const counts = new Array(nb).fill(0)
  for (let i = 0; i < xs.length; i++) {
    let b = Math.floor(((xs[i] - XLO) / (XHI - XLO)) * nb)
    b = Math.min(Math.max(b, 0), nb - 1)
    sums[b] += ys[i]
    counts[b]++
  }
  const pts: { x: number; m: number; n: number }[] = []
  for (let b = 0; b < nb; b++)
    if (counts[b] >= 5)
      pts.push({ x: XLO + ((b + 0.5) / nb) * (XHI - XLO), m: sums[b] / counts[b], n: counts[b] })

  const mu = ys.reduce((s, y) => s + y, 0) / ys.length
  const tot = ys.reduce((s, y) => s + (y - mu) ** 2, 0)
  let expl = 0
  for (let b = 0; b < nb; b++)
    if (counts[b] > 0) expl += counts[b] * (sums[b] / counts[b] - mu) ** 2
  return { pts, eta2: expl / tot }
})
const binPts = computed(() => binned.value.pts)
const eta2 = computed(() => binned.value.eta2)

const meanPath = computed(() =>
  binPts.value
    .map((b, i) => `${i === 0 ? 'M' : 'L'}${xPix(b.x).toFixed(1)},${yPix(b.m).toFixed(1)}`)
    .join('')
)
</script>

<style>
.symcm {
  --symcm-blue: #2a78d6;
  --symcm-pink: #c2408e;
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
html.dark .symcm {
  --symcm-blue: #4a8ee0;
  --symcm-pink: #d1589f;
}
.symcm-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.25rem;
}
.symcm-stats {
  display: flex;
  gap: 1.75rem;
}
.symcm-stat {
  display: flex;
  flex-direction: column;
}
.symcm-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}
.symcm-stat-label {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  max-width: 13em;
}
.symcm-blue { color: var(--symcm-blue); }
.symcm-slider {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 180px;
}
.symcm-slider-label {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
}
.symcm-slider input {
  accent-color: var(--symcm-blue);
}
.symcm-svg {
  width: 100%;
  height: auto;
  display: block;
}
.symcm-stripe {
  fill: var(--vp-c-text-3);
  opacity: 0.07;
}
.symcm-backscatter {
  fill: var(--symcm-pink);
  opacity: 0.08;
}
.symcm-bs-label {
  font-size: 11px;
  font-style: italic;
  fill: var(--symcm-pink);
}
.symcm-zero {
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
  stroke-dasharray: 4 4;
}
.symcm-ticktext {
  font-size: 11px;
  fill: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
.symcm-axislabel {
  font-size: 11px;
}
.symcm-dot {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 4;
  stroke-linecap: round;
  opacity: 0.32;
}
.symcm-mean {
  fill: none;
  stroke: var(--symcm-blue);
  stroke-width: 2.5;
  stroke-linejoin: round;
}
.symcm-mean-dot {
  fill: var(--symcm-blue);
  stroke: var(--vp-c-bg-soft);
  stroke-width: 1.5;
}
.symcm-caption {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0.5rem 0 0;
}
</style>
