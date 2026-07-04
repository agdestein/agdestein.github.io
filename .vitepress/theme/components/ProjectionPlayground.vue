<template>
  <div class="xclp">
    <svg
      ref="svgEl"
      viewBox="0 0 560 340"
      class="xclp-svg"
      role="img"
      aria-label="Interactive diagram: a velocity field is a point in a plane; the divergence-free fields form a line; the pressure projection is the orthogonal projection onto that line."
    >
      <!-- plane label -->
      <text x="16" y="28" class="xclp-plane-label">all velocity fields</text>

      <!-- divergence-free line -->
      <line :x1="lineA.x" :y1="lineA.y" :x2="lineB.x" :y2="lineB.y" class="xclp-line" />
      <text
        :x="lineLabelPos.x"
        :y="lineLabelPos.y"
        class="xclp-line-label"
        :transform="`rotate(${angleDeg} ${lineLabelPos.x} ${lineLabelPos.y})`"
      >divergence-free fields</text>

      <!-- right-angle marker -->
      <path :d="rightAngle" class="xclp-right-angle" />

      <!-- removed part: v -> p, dashed -->
      <line :x1="vAbs.x" :y1="vAbs.y" :x2="pAbs.x" :y2="pAbs.y" class="xclp-removed" />
      <text :x="midVP.x + removedLabelOffset.x" :y="midVP.y + removedLabelOffset.y" class="xclp-removed-label">
        pressure gradient (removed)
      </text>

      <!-- origin -->
      <circle :cx="O.x" :cy="O.y" r="3" class="xclp-origin" />

      <!-- raw vector O -> v -->
      <line :x1="O.x" :y1="O.y" :x2="vShort.x" :y2="vShort.y" class="xclp-raw" />
      <polygon :points="rawHead" class="xclp-raw-head" />

      <!-- projected vector O -> p -->
      <line :x1="O.x" :y1="O.y" :x2="pShort.x" :y2="pShort.y" class="xclp-proj" />
      <polygon :points="projHead" class="xclp-proj-head" />
      <circle :cx="pAbs.x" :cy="pAbs.y" r="4.5" class="xclp-foot" />
      <text :x="pAbs.x + footLabelOffset.x" :y="pAbs.y + footLabelOffset.y" class="xclp-proj-label">πu</text>

      <!-- draggable handle -->
      <g
        class="xclp-handle"
        tabindex="0"
        role="application"
        aria-label="Drag or use arrow keys to move the unprojected field"
        @pointerdown.prevent="startDrag"
        @keydown="onKey"
      >
        <circle :cx="vAbs.x" :cy="vAbs.y" r="14" class="xclp-handle-halo" />
        <circle :cx="vAbs.x" :cy="vAbs.y" r="7" class="xclp-handle-dot" />
        <text :x="vAbs.x + 14" :y="vAbs.y + 5" class="xclp-raw-label">u (drag me)</text>
      </g>
    </svg>
    <div class="xclp-readout" aria-live="polite">
      {{ percent }}% of this field is a pressure gradient in disguise — the projection
      πu keeps the divergence-free {{ 100 - percent }}%.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const W = 560
const H = 340
const O = { x: 250, y: 190 }
const angle = -0.35 // radians
const angleDeg = (angle * 180) / Math.PI
const d = { x: Math.cos(angle), y: Math.sin(angle) }

// Handle position relative to the origin
const v = ref({ x: 120, y: -135 })

const svgEl = ref<SVGSVGElement | null>(null)

const vAbs = computed(() => ({ x: O.x + v.value.x, y: O.y + v.value.y }))
const dot = computed(() => v.value.x * d.x + v.value.y * d.y)
const pAbs = computed(() => ({ x: O.x + dot.value * d.x, y: O.y + dot.value * d.y }))

const lineA = { x: O.x - 240 * d.x, y: O.y - 240 * d.y }
const lineB = { x: O.x + 280 * d.x, y: O.y + 280 * d.y }
// Keep the line label at the lower-left end, away from the projection foot
const lineLabelPos = { x: O.x - 200 * d.x + 6, y: O.y - 200 * d.y + 20 }

function shorten(from: { x: number; y: number }, to: { x: number; y: number }, by: number) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const f = Math.max(0, (len - by) / len)
  return { x: from.x + dx * f, y: from.y + dy * f }
}

function head(from: { x: number; y: number }, to: { x: number; y: number }, size = 9) {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const bx = to.x - ux * size
  const by = to.y - uy * size
  const s = size * 0.45
  return `${to.x},${to.y} ${bx - uy * s},${by + ux * s} ${bx + uy * s},${by - ux * s}`
}

// Shorten shafts so arrowheads end exactly at the target
const vShort = computed(() => shorten(O, vAbs.value, 9))
const pShort = computed(() => shorten(O, pAbs.value, 9))
const rawHead = computed(() => head(O, vAbs.value))
const projHead = computed(() => head(O, pAbs.value))

const midVP = computed(() => ({
  x: (vAbs.value.x + pAbs.value.x) / 2,
  y: (vAbs.value.y + pAbs.value.y) / 2,
}))

// Side of the line the handle is on (to place labels away from the line)
const side = computed(() => (dot.value * d.y - v.value.y) * 1 >= 0 ? 1 : -1)
const removedLabelOffset = computed(() => ({ x: 10, y: side.value > 0 ? -6 : 14 }))
const footLabelOffset = computed(() => ({ x: 8, y: side.value > 0 ? 20 : -12 }))

const rightAngle = computed(() => {
  const s = 11
  const sgn = side.value > 0 ? 1 : -1
  const n = { x: -d.y * sgn, y: d.x * sgn }
  const toV = dot.value >= 0 ? -1 : 1
  const p = pAbs.value
  const a = { x: p.x + toV * s * d.x, y: p.y + toV * s * d.y }
  const b = { x: a.x - n.x * s, y: a.y - n.y * s }
  const c = { x: p.x - n.x * s, y: p.y - n.y * s }
  return `M ${a.x} ${a.y} L ${b.x} ${b.y} L ${c.x} ${c.y}`
})

const percent = computed(() => {
  const rx = v.value.x - dot.value * d.x
  const ry = v.value.y - dot.value * d.y
  const removed = Math.hypot(rx, ry)
  const total = Math.hypot(v.value.x, v.value.y) || 1
  return Math.round((removed / total) * 100)
})

let dragging = false

function toLocal(e: PointerEvent) {
  const el = svgEl.value
  if (!el) return null
  const rect = el.getBoundingClientRect()
  return {
    x: ((e.clientX - rect.left) / rect.width) * W,
    y: ((e.clientY - rect.top) / rect.height) * H,
  }
}

function clampMove(x: number, y: number) {
  v.value = {
    x: Math.min(W - 20, Math.max(20, x)) - O.x,
    y: Math.min(H - 20, Math.max(20, y)) - O.y,
  }
}

function startDrag(e: PointerEvent) {
  dragging = true
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', endDrag)
  onMove(e)
}

function onMove(e: PointerEvent) {
  if (!dragging) return
  const pt = toLocal(e)
  if (pt) clampMove(pt.x, pt.y)
}

function endDrag() {
  dragging = false
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', endDrag)
}

function onKey(e: KeyboardEvent) {
  const step = e.shiftKey ? 2 : 12
  const moves: Record<string, [number, number]> = {
    ArrowLeft: [-step, 0],
    ArrowRight: [step, 0],
    ArrowUp: [0, -step],
    ArrowDown: [0, step],
  }
  const m = moves[e.key]
  if (!m) return
  e.preventDefault()
  clampMove(vAbs.value.x + m[0], vAbs.value.y + m[1])
}
</script>

<style>
.xclp {
  --xclp-raw: var(--vp-c-text-2);
  --xclp-proj: var(--vp-c-brand-1);
  --xclp-removed: #c98500;
  margin: 1.5rem 0;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 0.75rem 0.75rem 0.25rem;
}
html.dark .xclp {
  --xclp-removed: #eda100;
}
.xclp-svg {
  width: 100%;
  height: auto;
  display: block;
  touch-action: none;
}
.xclp-plane-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  fill: var(--vp-c-text-3);
}
.xclp-line {
  stroke: var(--xclp-proj);
  stroke-width: 2.5;
  opacity: 0.55;
}
.xclp-line-label {
  font-size: 13px;
  font-weight: 600;
  fill: var(--xclp-proj);
}
.xclp-origin {
  fill: var(--vp-c-text-3);
}
.xclp-raw {
  stroke: var(--xclp-raw);
  stroke-width: 2.5;
}
.xclp-raw-head {
  fill: var(--xclp-raw);
}
.xclp-raw-label {
  font-size: 13px;
  font-weight: 600;
  fill: var(--vp-c-text-1);
}
.xclp-proj {
  stroke: var(--xclp-proj);
  stroke-width: 3;
}
.xclp-proj-head,
.xclp-foot {
  fill: var(--xclp-proj);
}
.xclp-proj-label {
  font-size: 14px;
  font-weight: 700;
  fill: var(--xclp-proj);
}
.xclp-removed {
  stroke: var(--xclp-removed);
  stroke-width: 2;
  stroke-dasharray: 5 4;
}
.xclp-removed-label {
  font-size: 12px;
  font-weight: 600;
  fill: var(--xclp-removed);
}
.xclp-right-angle {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1.5;
}
.xclp-handle {
  cursor: grab;
  outline: none;
}
.xclp-handle:focus-visible .xclp-handle-halo {
  stroke: var(--xclp-proj);
  stroke-width: 2;
}
.xclp-handle-halo {
  fill: color-mix(in srgb, var(--xclp-raw) 15%, transparent);
}
.xclp-handle-dot {
  fill: var(--vp-c-text-1);
}
.xclp-readout {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  padding: 0.4rem 0.5rem 0.6rem;
}
</style>
