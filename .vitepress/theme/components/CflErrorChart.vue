<template>
  <div class="tife">
    <div class="tife-legend">
      <span v-for="s in series" :key="s.key" class="tife-key">
        <span class="tife-swatch" :class="`tife-sw-${s.key}`"></span>{{ s.name }}
      </span>
    </div>

    <div class="tife-plot">
      <svg :viewBox="`0 0 ${W} ${H}`" class="tife-svg" role="img"
        aria-label="Relative error versus CFL number for four closure strategies, log scale. The space-time closure stays flat near 0.1 while the others degrade as CFL grows.">
        <!-- gridlines + y ticks (log scale) -->
        <g v-for="tick in yTicks" :key="tick">
          <line :x1="ML" :y1="yPix(tick)" :x2="W - MR" :y2="yPix(tick)" class="tife-grid" />
          <text :x="ML - 8" :y="yPix(tick) + 4" class="tife-ticktext" text-anchor="end">
            {{ tick }}
          </text>
        </g>

        <!-- x ticks -->
        <g v-for="(c, i) in cfls" :key="c">
          <text :x="xPix(i)" :y="H - 8" class="tife-ticktext" text-anchor="middle">
            {{ c.toFixed(2) }}
          </text>
        </g>

        <!-- active column hairline -->
        <line v-if="active !== null" :x1="xPix(active)" :y1="MT" :x2="xPix(active)"
          :y2="H - MB" class="tife-cursor" />

        <!-- series lines and markers -->
        <g v-for="s in series" :key="s.key">
          <path :d="linePath(s.vals)" class="tife-line" :class="`tife-l-${s.key}`" />
          <circle v-for="(v, i) in s.vals" :key="i" :cx="xPix(i)" :cy="yPix(v)" r="4"
            class="tife-dot" :class="`tife-d-${s.key}`" />
        </g>

        <!-- selective end labels (nudged apart where series converge) -->
        <text v-for="s in series" :key="'lbl' + s.key" :x="xPix(4) + 10"
          :y="yPix(s.vals[4]) + 4 + (s.nudge ?? 0)" class="tife-endlabel">
          {{ s.name }}
        </text>

        <!-- hover/focus targets, one per CFL column -->
        <rect v-for="(c, i) in cfls" :key="'hit' + i" :x="xPix(i) - colHalf" :y="MT"
          :width="2 * colHalf" :height="H - MT - MB" fill="transparent" tabindex="0"
          @mouseenter="active = i" @mouseleave="active = null" @focus="active = i"
          @blur="active = null"
          :aria-label="`CFL ${c.toFixed(2)}: ` + series.map(s => `${s.name} ${s.vals[i].toFixed(3)}`).join(', ')" />
      </svg>

      <div v-if="active !== null" class="tife-tooltip"
        :style="{ left: tooltipLeft, top: '10%' }">
        <div class="tife-tt-title">CFL {{ cfls[active].toFixed(2) }} (τ = {{ Ms[active] }} Δt)</div>
        <div v-for="s in series" :key="s.key" class="tife-tt-row">
          <span class="tife-swatch" :class="`tife-sw-${s.key}`"></span>{{ s.name }}
          <strong>{{ s.vals[active].toFixed(3) }}</strong>
        </div>
      </div>
    </div>

    <p class="tife-caption">
      Relative error of the coarse solution at the final time versus the CFL number of the
      coarse simulation (central coarse flux, log scale). Hover or tab across the columns
      for exact values.
    </p>

    <details class="tife-table">
      <summary>Data table</summary>
      <table>
        <thead>
          <tr>
            <th>CFL</th>
            <th v-for="s in series" :key="s.key">{{ s.name }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, i) in cfls" :key="c">
            <td>{{ c.toFixed(2) }}</td>
            <td v-for="s in series" :key="s.key">{{ s.vals[i].toFixed(3) }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const W = 680
const H = 320
const ML = 42
const MR = 130
const MT = 16
const MB = 32
const YMIN = 0.07
const YMAX = 2.2

// Exact ensemble errors from the companion code (central coarse flux),
// generated with DLES15CompanionCode/run.jl (100 samples, seeded).
const Ms = [25, 50, 100, 200, 400]
const cfls = [0.06, 0.11, 0.22, 0.45, 0.89]
const series = [
  { key: 'st', name: 'space + time', vals: [0.098, 0.097, 0.094, 0.092, 0.097], nudge: 0 },
  { key: 'sp', name: 'space only', vals: [0.102, 0.104, 0.111, 0.133, 0.678], nudge: 4 },
  { key: 'cl', name: 'classic', vals: [0.134, 0.139, 0.149, 0.183, 0.846], nudge: -4 },
  { key: 'nm', name: 'no model', vals: [0.752, 0.761, 0.784, 0.867, 1.821], nudge: 0 },
]

const yTicks = [0.1, 0.2, 0.5, 1, 2]
const active = ref<number | null>(null)

function xPix(i: number): number {
  return ML + (i / (cfls.length - 1)) * (W - ML - MR)
}
function yPix(v: number): number {
  const f = (Math.log10(v) - Math.log10(YMIN)) / (Math.log10(YMAX) - Math.log10(YMIN))
  return MT + (1 - f) * (H - MT - MB)
}
const colHalf = (W - ML - MR) / (cfls.length - 1) / 2

function linePath(vals: number[]): string {
  return vals
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${xPix(i).toFixed(1)},${yPix(v).toFixed(1)}`)
    .join('')
}

const tooltipLeft = computed(() => {
  if (active.value === null) return '0px'
  const frac = xPix(active.value) / W
  return `${Math.min(Math.max(frac * 100, 12), 65)}%`
})
</script>

<style>
.tife {
  --tife-st: #2a78d6;
  --tife-sp: #1baf7a;
  --tife-cl: #eda100;
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
html.dark .tife {
  --tife-st: #3987e5;
  --tife-sp: #199e70;
  --tife-cl: #c98500;
}
.tife-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.25rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}
.tife-key {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}
.tife-swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}
.tife-sw-st { background: var(--tife-st); }
.tife-sw-sp { background: var(--tife-sp); }
.tife-sw-cl { background: var(--tife-cl); }
.tife-sw-nm { background: var(--vp-c-text-3); }
.tife-plot {
  position: relative;
}
.tife-svg {
  width: 100%;
  height: auto;
  display: block;
}
.tife-grid {
  stroke: var(--vp-c-divider);
  stroke-width: 1;
}
.tife-ticktext {
  font-size: 11px;
  fill: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
.tife-cursor {
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
}
.tife-line {
  fill: none;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.tife-l-st { stroke: var(--tife-st); }
.tife-l-sp { stroke: var(--tife-sp); }
.tife-l-cl { stroke: var(--tife-cl); }
.tife-l-nm { stroke: var(--vp-c-text-3); }
.tife-dot {
  stroke: var(--vp-c-bg-soft);
  stroke-width: 2;
}
.tife-d-st { fill: var(--tife-st); }
.tife-d-sp { fill: var(--tife-sp); }
.tife-d-cl { fill: var(--tife-cl); }
.tife-d-nm { fill: var(--vp-c-text-3); }
.tife-endlabel {
  font-size: 11px;
  fill: var(--vp-c-text-1);
}
.tife-svg rect:focus {
  outline: none;
}
.tife-svg rect:focus-visible {
  stroke: var(--tife-st);
  stroke-width: 1;
}
.tife-tooltip {
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
.tife-tt-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}
.tife-tt-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.tife-tt-row strong {
  margin-left: auto;
  padding-left: 0.75rem;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}
.tife-caption {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0.5rem 0 0;
}
.tife-table {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.tife-table summary {
  cursor: pointer;
}
.tife-table table {
  margin-top: 0.5rem;
  font-variant-numeric: tabular-nums;
}
</style>
