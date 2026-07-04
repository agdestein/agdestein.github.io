<template>
  <div class="tifd">
    <div class="tifd-controls">
      <label class="tifd-slider">
        <span>Filter width <em>τ</em> = <strong>{{ tau.toFixed(2) }}</strong></span>
        <input type="range" min="0.05" max="1.5" step="0.01" v-model.number="tau" />
      </label>
      <label class="tifd-slider">
        <span>Evaluation time <em>t</em> = <strong>{{ t0.toFixed(2) }}</strong></span>
        <input type="range" min="0.3" max="4.3" step="0.01" v-model.number="t0" />
      </label>
    </div>

    <svg :viewBox="`0 0 ${W} ${H}`" class="tifd-svg" role="img"
      aria-label="A wiggly signal u and its one-sided running average, showing that the forward-Euler chord on u has the same slope as the tangent of the averaged signal">
      <!-- axis baseline -->
      <line :x1="PAD" :y1="yPix(0)" :x2="W - PAD" :y2="yPix(0)" class="tifd-axis" />

      <!-- averaging window under the chord -->
      <rect :x="xPix(t0)" :y="PADY" :width="xPix(t0 + tau) - xPix(t0)" :height="H - 2 * PADY"
        class="tifd-window" />

      <!-- signal and filtered signal -->
      <path :d="signalPath" class="tifd-signal" />
      <path :d="filteredPath" class="tifd-filtered" />

      <!-- forward-Euler chord on u -->
      <line :x1="xPix(t0)" :y1="yPix(u(t0))" :x2="xPix(t0 + tau)" :y2="yPix(u(t0 + tau))"
        class="tifd-chord" />
      <circle :cx="xPix(t0)" :cy="yPix(u(t0))" r="4" class="tifd-dot-ink" />
      <circle :cx="xPix(t0 + tau)" :cy="yPix(u(t0 + tau))" r="4" class="tifd-dot-ink" />

      <!-- tangent of the filtered signal at t0, same slope -->
      <line :x1="xPix(t0 - tangentHalf)" :y1="yPix(ubar(t0) - slope * tangentHalf)"
        :x2="xPix(t0 + tangentHalf)" :y2="yPix(ubar(t0) + slope * tangentHalf)"
        class="tifd-tangent" />
      <circle :cx="xPix(t0)" :cy="yPix(ubar(t0))" r="4" class="tifd-dot-blue" />
    </svg>

    <div class="tifd-legend">
      <span class="tifd-key"><span class="tifd-swatch tifd-swatch-signal"></span>signal <em>u</em></span>
      <span class="tifd-key"><span class="tifd-swatch tifd-swatch-filtered"></span>one-sided average <em>ū</em><sup>τ</sup></span>
      <span class="tifd-key"><span class="tifd-swatch tifd-swatch-chord"></span>forward-Euler chord on <em>u</em></span>
      <span class="tifd-key"><span class="tifd-swatch tifd-swatch-tangent"></span>tangent of <em>ū</em><sup>τ</sup></span>
    </div>

    <p class="tifd-readout">
      Chord slope on <em>u</em> = tangent slope of <em>ū</em><sup>τ</sup> =
      <strong>{{ slope.toFixed(3) }}</strong> — equal <em>exactly</em>, for every τ and every t.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const W = 680
const H = 300
const PAD = 16
const PADY = 14

const tau = ref(0.6)
const t0 = ref(1.6)
const tangentHalf = 0.35

// Multiscale signal: a few sine modes with closed-form one-sided average.
const modes: [number, number, number][] = [
  [1.0, 1, 0.0],
  [0.6, 3, 1.3],
  [0.35, 7, 0.6],
  [0.18, 13, 2.1],
]

const TMIN = 0
const TMAX = 6
const YMAX = 2.4

function u(t: number): number {
  let s = 0
  for (const [a, k, p] of modes) s += a * Math.sin(k * t + p)
  return s
}

// ū(t) = (1/τ) ∫ₜ^{t+τ} u(s) ds, exact.
function ubar(t: number): number {
  let s = 0
  for (const [a, k, p] of modes)
    s += (a * (Math.cos(k * t + p) - Math.cos(k * (t + tau.value) + p))) / (k * tau.value)
  return s
}

function xPix(t: number): number {
  return PAD + ((t - TMIN) / (TMAX - TMIN)) * (W - 2 * PAD)
}
function yPix(y: number): number {
  return H / 2 - (y / YMAX) * (H / 2 - PADY)
}

function pathOf(f: (t: number) => number): string {
  const n = 240
  const pts: string[] = []
  for (let i = 0; i <= n; i++) {
    const t = TMIN + ((TMAX - TMIN) * i) / n
    pts.push(`${i === 0 ? 'M' : 'L'}${xPix(t).toFixed(1)},${yPix(f(t)).toFixed(1)}`)
  }
  return pts.join('')
}

const signalPath = computed(() => pathOf(u))
const filteredPath = computed(() => pathOf(ubar))
const slope = computed(() => (u(t0.value + tau.value) - u(t0.value)) / tau.value)
</script>

<style>
.tifd {
  --tifd-blue: #2a78d6;
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem 0.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
html.dark .tifd {
  --tifd-blue: #3987e5;
}
.tifd-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  margin-bottom: 0.5rem;
}
.tifd-slider {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  min-width: 200px;
  flex: 1;
}
.tifd-slider strong {
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}
.tifd-slider input {
  accent-color: var(--tifd-blue);
}
.tifd-svg {
  width: 100%;
  height: auto;
  display: block;
}
.tifd-axis {
  stroke: var(--vp-c-divider);
  stroke-width: 1;
}
.tifd-window {
  fill: var(--tifd-blue);
  opacity: 0.08;
}
.tifd-signal {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.tifd-filtered {
  fill: none;
  stroke: var(--tifd-blue);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.tifd-chord {
  stroke: var(--vp-c-text-1);
  stroke-width: 1.5;
}
.tifd-tangent {
  stroke: var(--tifd-blue);
  stroke-width: 3;
  stroke-linecap: round;
}
.tifd-dot-ink {
  fill: var(--vp-c-text-1);
  stroke: var(--vp-c-bg-soft);
  stroke-width: 2;
}
.tifd-dot-blue {
  fill: var(--tifd-blue);
  stroke: var(--vp-c-bg-soft);
  stroke-width: 2;
}
.tifd-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-top: 0.25rem;
}
.tifd-key {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.tifd-swatch {
  width: 14px;
  height: 3px;
  border-radius: 2px;
  display: inline-block;
}
.tifd-swatch-signal { background: var(--vp-c-text-3); }
.tifd-swatch-filtered { background: var(--tifd-blue); }
.tifd-swatch-chord { background: var(--vp-c-text-1); height: 2px; }
.tifd-swatch-tangent { background: var(--tifd-blue); height: 4px; }
.tifd-readout {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0.5rem 0 0;
  padding-bottom: 0.75rem;
}
.tifd-readout strong {
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-1);
}
</style>
