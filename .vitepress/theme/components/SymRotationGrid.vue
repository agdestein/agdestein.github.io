<template>
  <div class="symrg">
    <div class="symrg-controls">
      <label class="symrg-slider">
        <span>Rotation angle θ = <strong>{{ angle }}°</strong></span>
        <input type="range" min="0" max="360" step="1" v-model.number="angle" list="symrg-detents" />
        <datalist id="symrg-detents">
          <option value="0"></option>
          <option value="90"></option>
          <option value="180"></option>
          <option value="270"></option>
          <option value="360"></option>
        </datalist>
      </label>
      <div class="symrg-buttons">
        <button v-for="a in [0, 90, 180, 270]" :key="a" class="symrg-btn"
          :class="{ 'symrg-btn-active': angle === a }" @click="angle = a">{{ a }}°</button>
        <button class="symrg-btn" :class="{ 'symrg-btn-active': mirrored }"
          @click="mirrored = !mirrored">mirror</button>
      </div>
    </div>

    <svg :viewBox="`0 0 ${W} ${H}`" class="symrg-svg" role="img"
      aria-label="A square grid of points and a rotated copy. The rotated points land back on grid points only when the angle is a multiple of 90 degrees.">
      <!-- original lattice -->
      <circle v-for="(p, i) in basePoints" :key="'b' + i" :cx="cx + p.x * cell" :cy="cy + p.y * cell"
        r="3.5" class="symrg-base" />
      <!-- rotated lattice -->
      <circle v-for="(p, i) in rotatedPoints" :key="'r' + i" :cx="cx + p.x * cell"
        :cy="cy + p.y * cell" r="3.5" :class="aligned ? 'symrg-rot-ok' : 'symrg-rot'" />
      <!-- rotation guide -->
      <circle :cx="cx" :cy="cy" :r="4.5 * cell" class="symrg-guide" />
      <line :x1="cx" :y1="cy" :x2="cx + 4.5 * cell * Math.cos((-angle * Math.PI) / 180)"
        :y2="cy + 4.5 * cell * Math.sin((-angle * Math.PI) / 180)" class="symrg-hand" />
    </svg>

    <p class="symrg-readout" :class="aligned ? 'symrg-readout-ok' : ''">
      <template v-if="aligned">
        ✓ Every rotated point lands back on a grid point{{ mirrored ? ' (mirrored)' : '' }} —
        this transform <em>is</em> a symmetry of the grid.
      </template>
      <template v-else>
        ✗ {{ missPercent }}% of the rotated points miss the grid — a grid-sampled field
        cannot realize this rotation exactly.
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const W = 680
const H = 340
const cx = W / 2
const cy = H / 2
const cell = 28

const angle = ref(35)
const mirrored = ref(false)

// 11×11 lattice, clipped to a disk so the point set itself is rotation-friendly
// at multiples of 90° regardless of the outline.
const basePoints = (() => {
  const pts: { x: number; y: number }[] = []
  for (let i = -5; i <= 5; i++)
    for (let j = -5; j <= 5; j++)
      if (i * i + j * j <= 5 * 5 + 2) pts.push({ x: i, y: j })
  return pts
})()

const rotatedPoints = computed(() => {
  const t = (-angle.value * Math.PI) / 180
  const c = Math.cos(t)
  const s = Math.sin(t)
  const mx = mirrored.value ? -1 : 1
  return basePoints.map((p) => ({
    x: c * (mx * p.x) - s * p.y,
    y: s * (mx * p.x) + c * p.y,
  }))
})

// Fraction of rotated points that land (within tolerance) on a lattice point.
const missPercent = computed(() => {
  const eps = 0.02
  let miss = 0
  for (const p of rotatedPoints.value) {
    const dx = Math.abs(p.x - Math.round(p.x))
    const dy = Math.abs(p.y - Math.round(p.y))
    if (dx > eps || dy > eps) miss++
  }
  return Math.round((100 * miss) / rotatedPoints.value.length)
})

const aligned = computed(() => missPercent.value === 0)
</script>

<style>
.symrg {
  --symrg-accent: #2a78d6;
  --symrg-ok: #149c6c;
  --symrg-bad: #d45500;
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
html.dark .symrg {
  --symrg-accent: #4a8ee0;
  --symrg-ok: #1cab77;
  --symrg-bad: #e06925;
}
.symrg-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 2rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
.symrg-slider {
  flex: 1 1 260px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}
.symrg-slider input {
  width: 100%;
}
.symrg-buttons {
  display: flex;
  gap: 0.4rem;
}
.symrg-btn {
  font-size: 0.78rem;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.symrg-btn-active {
  border-color: var(--symrg-accent);
  color: var(--symrg-accent);
  font-weight: 600;
}
.symrg-svg {
  width: 100%;
  height: auto;
  display: block;
}
.symrg-base {
  fill: var(--vp-c-text-3);
  opacity: 0.55;
}
.symrg-rot {
  fill: var(--symrg-bad);
  opacity: 0.85;
}
.symrg-rot-ok {
  fill: var(--symrg-ok);
  opacity: 0.85;
}
.symrg-guide {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-dasharray: 3 5;
}
.symrg-hand {
  stroke: var(--symrg-accent);
  stroke-width: 1.5;
  opacity: 0.7;
}
.symrg-readout {
  font-size: 0.85rem;
  color: var(--symrg-bad);
  margin: 0.5rem 0 0;
  min-height: 2.4em;
}
.symrg-readout-ok {
  color: var(--symrg-ok);
}
</style>
