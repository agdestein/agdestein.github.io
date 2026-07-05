<template>
  <div class="symbs">
    <div class="symbs-legend">
      <span v-for="s in series" :key="s.key" class="symbs-key">
        <span class="symbs-swatch" :class="`symbs-sw-${s.key}`"></span>{{ s.name }}
      </span>
    </div>

    <div class="symbs-plot">
      <svg :viewBox="`0 0 ${W} ${H}`" class="symbs-svg" role="img"
        aria-label="Probability density of the pointwise sub-filter dissipation rate for the exact stress, dynamic Smagorinsky, Clark, and the learned TBNN closure, on a log scale. The exact stress has a heavy negative (backscatter) tail; Smagorinsky has none; the learned closure reproduces most of it."
        @mousemove="onMove" @mouseleave="hoverX = null">
        <!-- backscatter shading -->
        <rect :x="xPix(XMIN)" :y="MT" :width="xPix(0) - xPix(XMIN)" :height="H - MT - MB"
          class="symbs-backscatter" />
        <text :x="(xPix(XMIN) + xPix(0)) / 2" :y="MT + 16" text-anchor="middle"
          class="symbs-region">← backscatter</text>
        <text :x="(xPix(0) + xPix(XMAX)) / 2" :y="MT + 16" text-anchor="middle"
          class="symbs-region">forward transfer →</text>

        <!-- gridlines + y ticks (log) -->
        <g v-for="tick in yTicks" :key="tick">
          <line :x1="ML" :y1="yPix(tick)" :x2="W - MR" :y2="yPix(tick)" class="symbs-grid" />
          <text :x="ML - 8" :y="yPix(tick) + 4" class="symbs-ticktext" text-anchor="end">
            {{ tick >= 1 ? tick : tick.toFixed(tick >= 0.01 ? 2 : 4) }}
          </text>
        </g>

        <!-- zero line + x ticks -->
        <line :x1="xPix(0)" :y1="MT" :x2="xPix(0)" :y2="H - MB" class="symbs-zero" />
        <g v-for="t in xTicks" :key="t">
          <text :x="xPix(t)" :y="H - 24" class="symbs-ticktext" text-anchor="middle">
            {{ t.toFixed(1) }}
          </text>
        </g>
        <text :x="(ML + W - MR) / 2" :y="H - 6" class="symbs-ticktext" text-anchor="middle">
          pointwise SFS dissipation rate ε<tspan baseline-shift="sub" font-size="8">Δ</tspan>
        </text>

        <!-- curves -->
        <path v-for="s in series" :key="s.key" :d="s.path" class="symbs-line"
          :class="`symbs-l-${s.key}`" />

        <!-- hover crosshair -->
        <line v-if="hoverX !== null" :x1="xPix(hoverX)" :y1="MT" :x2="xPix(hoverX)" :y2="H - MB"
          class="symbs-cursor" />
      </svg>

      <div v-if="hoverX !== null" class="symbs-tooltip" :style="{ left: tooltipLeft, top: '12%' }">
        <div class="symbs-tt-title">ε<sub>Δ</sub> = {{ hoverX.toFixed(2) }}</div>
        <div v-for="s in series" :key="s.key" class="symbs-tt-row">
          <span class="symbs-swatch" :class="`symbs-sw-${s.key}`"></span>{{ s.name }}
          <strong>{{ fmtDensity(valueAt(s, hoverX)) }}</strong>
        </div>
      </div>
    </div>

    <p class="symbs-caption">
      Distribution of the pointwise sub-filter dissipation rate over all test snapshots
      (kernel density estimate, log scale), every closure evaluated on the same filtered DNS
      fields. Negative values mean energy flowing <em>back</em> from small to large scales.
      Hover for exact densities.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../../../data/symmetry-post.json'

const W = 680
const H = 340
const ML = 52
const MR = 16
const MT = 10
const MB = 46

const XMIN = -0.32
const XMAX = 0.95
const YMIN = 1e-4
const YMAX = 100

const xTicks = [-0.2, 0, 0.2, 0.4, 0.6, 0.8]
const yTicks = [1e-4, 1e-2, 1, 100]

const hoverX = ref<number | null>(null)

function xPix(x: number): number {
  return ML + ((x - XMIN) / (XMAX - XMIN)) * (W - ML - MR)
}
function yPix(d: number): number {
  const v = Math.min(Math.max(d, YMIN), YMAX)
  const f = (Math.log10(v) - Math.log10(YMIN)) / (Math.log10(YMAX) - Math.log10(YMIN))
  return MT + (1 - f) * (H - MT - MB)
}

type Kde = { x: number[]; density: number[] }
function kdePath(k: Kde): string {
  let d = ''
  for (let i = 0; i < k.x.length; i++) {
    if (k.x[i] < XMIN || k.x[i] > XMAX) continue
    d += `${d === '' ? 'M' : 'L'}${xPix(k.x[i]).toFixed(1)},${yPix(k.density[i]).toFixed(1)}`
  }
  return d
}

const series = [
  { key: 'ref', name: 'exact stress (reference)', kde: data.kde.ref as Kde, path: kdePath(data.kde.ref) },
  { key: 'smag', name: 'dyn. Smagorinsky', kde: data.kde.dynsmag as Kde, path: kdePath(data.kde.dynsmag) },
  { key: 'clark', name: 'Clark', kde: data.kde.clar as Kde, path: kdePath(data.kde.clar) },
  { key: 'tbnn', name: 'TBNN (learned)', kde: data.kde.tbnn as Kde, path: kdePath(data.kde.tbnn) },
]

function valueAt(s: { kde: Kde }, x: number): number {
  const xs = s.kde.x
  if (x <= xs[0]) return s.kde.density[0]
  if (x >= xs[xs.length - 1]) return s.kde.density[xs.length - 1]
  let i = 1
  while (xs[i] < x) i++
  const f = (x - xs[i - 1]) / (xs[i] - xs[i - 1])
  return s.kde.density[i - 1] * (1 - f) + s.kde.density[i] * f
}
function fmtDensity(d: number): string {
  if (d < 1e-4) return '< 0.0001'
  return d >= 1 ? d.toFixed(1) : d.toFixed(4)
}

function onMove(ev: MouseEvent) {
  const svg = ev.currentTarget as SVGSVGElement
  const rect = svg.getBoundingClientRect()
  const fx = ((ev.clientX - rect.left) / rect.width) * W
  const x = XMIN + ((fx - ML) / (W - ML - MR)) * (XMAX - XMIN)
  hoverX.value = x >= XMIN && x <= XMAX ? x : null
}

const tooltipLeft = computed(() => {
  if (hoverX.value === null) return '0px'
  const frac = xPix(hoverX.value) / W
  return frac < 0.55 ? `${frac * 100 + 4}%` : `${frac * 100 - 42}%`
})
</script>

<style>
.symbs {
  --symbs-smag: #8f6fd0;
  --symbs-clark: #c2408e;
  --symbs-tbnn: #149c6c;
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
html.dark .symbs {
  --symbs-smag: #9b7ddb;
  --symbs-clark: #d1589f;
  --symbs-tbnn: #1cab77;
}
.symbs-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}
.symbs-key {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.symbs-swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}
.symbs-sw-ref { background: var(--vp-c-text-1); }
.symbs-sw-smag { background: var(--symbs-smag); }
.symbs-sw-clark { background: var(--symbs-clark); }
.symbs-sw-tbnn { background: var(--symbs-tbnn); }
.symbs-plot {
  position: relative;
}
.symbs-svg {
  width: 100%;
  height: auto;
  display: block;
}
.symbs-backscatter {
  fill: var(--vp-c-text-3);
  opacity: 0.08;
}
.symbs-region {
  font-size: 10.5px;
  font-style: italic;
  fill: var(--vp-c-text-3);
}
.symbs-grid {
  stroke: var(--vp-c-divider);
  stroke-width: 1;
}
.symbs-zero {
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
  stroke-dasharray: 2 3;
}
.symbs-ticktext {
  font-size: 11px;
  fill: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
.symbs-line {
  fill: none;
  stroke-width: 2;
  stroke-linejoin: round;
}
.symbs-l-ref {
  stroke: var(--vp-c-text-1);
  stroke-width: 2.5;
}
.symbs-l-smag { stroke: var(--symbs-smag); }
.symbs-l-clark { stroke: var(--symbs-clark); }
.symbs-l-tbnn { stroke: var(--symbs-tbnn); }
.symbs-cursor {
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
}
.symbs-tooltip {
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
.symbs-tt-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}
.symbs-tt-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.symbs-tt-row strong {
  margin-left: auto;
  padding-left: 0.75rem;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}
.symbs-caption {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0.5rem 0 0;
}
</style>
