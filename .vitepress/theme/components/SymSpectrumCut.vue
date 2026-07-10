<template>
  <div class="symcut">
    <div class="symcut-header">
      <div class="symcut-stats">
        <div class="symcut-stat">
          <span class="symcut-stat-value symcut-blue">{{ energyPct }}</span>
          <span class="symcut-stat-label">of the kinetic energy resolved</span>
        </div>
        <div class="symcut-stat">
          <span class="symcut-stat-value">{{ dofPct }}</span>
          <span class="symcut-stat-label">of the DNS degrees of freedom kept</span>
        </div>
      </div>
      <div class="symcut-presets">
        <button class="symcut-btn" :class="{ 'symcut-btn-active': nearPreset(kcutFine) }"
          @click="setCut(kcutFine)">paper's finest filter</button>
        <button class="symcut-btn" :class="{ 'symcut-btn-active': nearPreset(kcutCoarse) }"
          @click="setCut(kcutCoarse)">coarsest</button>
      </div>
    </div>

    <div class="symcut-plot">
      <svg :viewBox="`0 0 ${W} ${H}`" class="symcut-svg" role="img"
        aria-label="Kinetic energy spectrum of the DNS on log-log axes, falling steeply with wavenumber. A movable vertical line marks the filter cut: energy at lower wavenumbers is resolved by the LES, energy at higher wavenumbers is erased and must be modeled."
        @pointerdown="onPointer" @pointermove="onPointer">
        <!-- shaded regions -->
        <path :d="areaPath(KMIN, kcut)" class="symcut-area-resolved" />
        <path :d="areaPath(kcut, KMAX)" class="symcut-area-lost" />

        <!-- gridlines + y ticks (decades) -->
        <g v-for="d in yDecades" :key="d">
          <line :x1="ML" :y1="yPix(d)" :x2="W - MR" :y2="yPix(d)" class="symcut-grid" />
          <text :x="ML - 8" :y="yPix(d) + 4" class="symcut-ticktext" text-anchor="end">
            10{{ sup(Math.log10(d)) }}
          </text>
        </g>
        <!-- x ticks -->
        <g v-for="t in xTicks" :key="t">
          <text :x="xPix(t)" :y="H - MB + 18" class="symcut-ticktext" text-anchor="middle">{{ t }}</text>
        </g>
        <text :x="(ML + W - MR) / 2" :y="H - 6" class="symcut-ticktext symcut-axislabel"
          text-anchor="middle">wavenumber k — smaller eddies to the right (log scale)</text>
        <text :x="14" :y="(MT + H - MB) / 2" class="symcut-ticktext symcut-axislabel"
          text-anchor="middle" :transform="`rotate(-90 14 ${(MT + H - MB) / 2})`">energy E(k)</text>

        <!-- spectrum -->
        <path :d="specPath" class="symcut-line" />

        <!-- region labels -->
        <text :x="(xPix(KMIN) + xPix(kcut)) / 2" :y="MT + 16" class="symcut-region symcut-blue-t"
          text-anchor="middle" v-if="kcut > 5">resolved</text>
        <g v-if="kcut < 150">
          <text :x="(xPix(kcut) + xPix(KMAX)) / 2" :y="MT + 16" class="symcut-region symcut-pink-t"
            text-anchor="middle">erased by the filter</text>
          <text :x="(xPix(kcut) + xPix(KMAX)) / 2" :y="MT + 32" class="symcut-region symcut-pink-t"
            text-anchor="middle">— the closure must fake all of this</text>
        </g>

        <!-- the cut -->
        <line :x1="xPix(kcut)" :y1="MT" :x2="xPix(kcut)" :y2="H - MB" class="symcut-cutline" />
        <g class="symcut-handle" :transform="`translate(${xPix(kcut)}, ${H - MB})`">
          <path d="M0,0 L-7,12 L7,12 Z" />
          <text y="40" text-anchor="middle" class="symcut-ticktext symcut-cutlabel">
            filter cut
          </text>
        </g>
      </svg>
    </div>

    <input class="symcut-range" type="range" :min="0" :max="1" :step="0.002" v-model.number="frac"
      aria-label="Position of the filter cut wavenumber, on a logarithmic scale" />

    <p class="symcut-caption">
      The measured energy spectrum of the paper's DNS (forced isotropic turbulence). <strong>Drag
      the cut</strong>: an LES keeps only the eddies to the left. Because energy piles up at the
      large scales, even a brutal filter keeps almost all of it — what it loses is the fine-scale
      <em>activity</em> that drains energy from the scales you keep. That drain is the sub-filter
      stress the closure must supply.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import data from '../../../data/symmetry-deck.json'

const W = 680
const H = 380
const ML = 58
const MR = 16
const MT = 14
const MB = 64

const k = data.spectra.k_dns as number[]
const E = data.spectra.dns_indist as number[]
const kcutFine = data.spectra.kcut_d25 as number // Δ = 2.5
const kcutCoarse = data.spectra.kcut_d50 as number // Δ = 5

const KMIN = 1
const KMAX = k[k.length - 1]
const EMIN = 1e-8
const EMAX = 0.3
const totalE = E.reduce((s, e) => s + e, 0)

// Cut position, stored as a log fraction so the slider feels uniform.
const CUTMIN = 3
const CUTMAX = 220
const toFrac = (kc: number) =>
  (Math.log10(kc) - Math.log10(CUTMIN)) / (Math.log10(CUTMAX) - Math.log10(CUTMIN))
const frac = ref(toFrac(kcutFine))
const kcut = computed(() =>
  Math.pow(10, Math.log10(CUTMIN) + frac.value * (Math.log10(CUTMAX) - Math.log10(CUTMIN)))
)
function setCut(kc: number) {
  frac.value = toFrac(kc)
}
function nearPreset(kc: number) {
  return Math.abs(kcut.value - kc) / kc < 0.03
}

const energyFrac = computed(() => {
  let s = 0
  for (let i = 0; i < k.length; i++) if (k[i] <= kcut.value) s += E[i]
  return s / totalE
})
const energyPct = computed(() => {
  const p = energyFrac.value * 100
  return p >= 99.95 ? '~100%' : p.toFixed(p > 99 ? 2 : 1) + '%'
})
// Fraction of Fourier modes below the cut in 3D: (kc / kmax)^3.
const dofPct = computed(() => {
  const p = Math.pow(kcut.value / KMAX, 3) * 100
  return p >= 10 ? p.toFixed(0) + '%' : p >= 1 ? p.toFixed(1) + '%' : p.toFixed(2) + '%'
})

function xPix(kk: number): number {
  const f = (Math.log10(kk) - Math.log10(KMIN)) / (Math.log10(KMAX) - Math.log10(KMIN))
  return ML + f * (W - ML - MR)
}
function yPix(e: number): number {
  const f = (Math.log10(Math.max(e, EMIN)) - Math.log10(EMIN)) / (Math.log10(EMAX) - Math.log10(EMIN))
  return MT + (1 - f) * (H - MT - MB)
}

const yDecades = [1e-7, 1e-5, 1e-3, 1e-1]
const xTicks = [1, 3, 10, 30, 100, 270]

const specPath = computed(() =>
  k.map((kk, i) => `${i === 0 ? 'M' : 'L'}${xPix(kk).toFixed(1)},${yPix(E[i]).toFixed(1)}`).join('')
)

// Log-log interpolation of E at an arbitrary wavenumber.
function interpE(kk: number): number {
  if (kk <= k[0]) return E[0]
  if (kk >= KMAX) return E[E.length - 1]
  let i = 1
  while (k[i] < kk) i++
  const t = (Math.log10(kk) - Math.log10(k[i - 1])) / (Math.log10(k[i]) - Math.log10(k[i - 1]))
  return Math.pow(10, Math.log10(E[i - 1]) + t * (Math.log10(E[i]) - Math.log10(E[i - 1])))
}

function areaPath(ka: number, kb: number): string {
  const pts: string[] = [`M${xPix(ka).toFixed(1)},${(H - MB).toFixed(1)}`]
  pts.push(`L${xPix(ka).toFixed(1)},${yPix(interpE(ka)).toFixed(1)}`)
  for (let i = 0; i < k.length; i++)
    if (k[i] > ka && k[i] < kb) pts.push(`L${xPix(k[i]).toFixed(1)},${yPix(E[i]).toFixed(1)}`)
  pts.push(`L${xPix(kb).toFixed(1)},${yPix(interpE(kb)).toFixed(1)}`)
  pts.push(`L${xPix(kb).toFixed(1)},${(H - MB).toFixed(1)} Z`)
  return pts.join('')
}

function onPointer(ev: PointerEvent) {
  if (ev.type === 'pointermove' && ev.buttons === 0) return
  const svg = ev.currentTarget as SVGSVGElement
  const rect = svg.getBoundingClientRect()
  const x = ((ev.clientX - rect.left) / rect.width) * W
  const kk = Math.pow(
    10,
    Math.log10(KMIN) + ((x - ML) / (W - ML - MR)) * (Math.log10(KMAX) - Math.log10(KMIN))
  )
  frac.value = Math.min(1, Math.max(0, toFrac(kk)))
  ev.preventDefault()
}

const SUP: Record<string, string> = {
  '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
}
function sup(n: number): string {
  return String(Math.round(n)).split('').map((c) => SUP[c] ?? c).join('')
}
</script>

<style>
.symcut {
  --symcut-blue: #2a78d6;
  --symcut-pink: #c2408e;
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
html.dark .symcut {
  --symcut-blue: #4a8ee0;
  --symcut-pink: #d1589f;
}
.symcut-header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 0.25rem;
}
.symcut-stats {
  display: flex;
  gap: 1.75rem;
}
.symcut-stat {
  display: flex;
  flex-direction: column;
}
.symcut-stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}
.symcut-stat-label {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  max-width: 11em;
}
.symcut-blue { color: var(--symcut-blue); }
.symcut-presets {
  display: flex;
  gap: 0.4rem;
}
.symcut-btn {
  font-size: 0.78rem;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.symcut-btn-active {
  border-color: var(--symcut-blue);
  color: var(--symcut-blue);
  font-weight: 600;
}
.symcut-svg {
  width: 100%;
  height: auto;
  display: block;
  cursor: ew-resize;
  touch-action: none;
}
.symcut-grid {
  stroke: var(--vp-c-divider);
  stroke-width: 1;
}
.symcut-ticktext {
  font-size: 11px;
  fill: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
.symcut-axislabel {
  font-size: 11px;
}
.symcut-line {
  fill: none;
  stroke: var(--vp-c-text-1);
  stroke-width: 2;
  stroke-linejoin: round;
}
.symcut-area-resolved {
  fill: var(--symcut-blue);
  opacity: 0.13;
}
.symcut-area-lost {
  fill: var(--symcut-pink);
  opacity: 0.16;
}
.symcut-region {
  font-size: 11.5px;
  font-style: italic;
}
.symcut-blue-t { fill: var(--symcut-blue); }
.symcut-pink-t { fill: var(--symcut-pink); }
.symcut-cutline {
  stroke: var(--vp-c-text-1);
  stroke-width: 1.5;
  stroke-dasharray: 5 4;
}
.symcut-handle path {
  fill: var(--vp-c-text-1);
}
.symcut-cutlabel {
  fill: var(--vp-c-text-2);
  font-weight: 600;
}
.symcut-range {
  width: 100%;
  margin: 0.15rem 0 0;
  accent-color: var(--symcut-blue);
}
.symcut-caption {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin: 0.5rem 0 0;
}
</style>
