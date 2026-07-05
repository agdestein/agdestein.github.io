<template>
  <div class="symeq">
    <div class="symeq-controls">
      <div class="symeq-group">
        <span class="symeq-label">Rotate the world by</span>
        <button v-for="a in [0, 90, 180, 270]" :key="a" class="symeq-btn"
          :class="{ 'symeq-btn-active': angle === a }" @click="angle = a">{{ a }}°</button>
      </div>
      <div class="symeq-group">
        <span class="symeq-label">Closure</span>
        <button class="symeq-btn" :class="{ 'symeq-btn-active': equivariant }"
          @click="equivariant = true">equivariant</button>
        <button class="symeq-btn" :class="{ 'symeq-btn-active': !equivariant }"
          @click="equivariant = false">unconstrained</button>
      </div>
    </div>

    <div class="symeq-panels">
      <div class="symeq-panel">
        <div class="symeq-panel-title">Rotated velocity field</div>
        <svg :viewBox="`0 0 ${PW} ${PW}`" class="symeq-svg" role="img"
          aria-label="A small vector field, rotated by the chosen angle">
          <g v-for="(p, i) in points" :key="i">
            <line :x1="px(p.x)" :y1="py(p.y)" :x2="px(p.x) + varr * inputField[i].u"
              :y2="py(p.y) - varr * inputField[i].v" class="symeq-arrow" />
            <circle :cx="px(p.x)" :cy="py(p.y)" r="2" class="symeq-node" />
          </g>
        </svg>
      </div>

      <div class="symeq-panel">
        <div class="symeq-panel-title">Predict, <em>then</em> rotate</div>
        <svg :viewBox="`0 0 ${PW} ${PW}`" class="symeq-svg" role="img"
          aria-label="Stress prediction computed on the original field, then rotated">
          <g v-for="(p, i) in points" :key="i"
            :transform="`translate(${px(p.x)}, ${py(p.y)}) rotate(${-glyphA[i].phi})`">
            <ellipse :rx="glyphA[i].rx" :ry="glyphA[i].ry" class="symeq-ell-a" />
          </g>
        </svg>
      </div>

      <div class="symeq-panel">
        <div class="symeq-panel-title">Rotate, <em>then</em> predict <span class="symeq-panel-note">(outline: other path)</span></div>
        <svg :viewBox="`0 0 ${PW} ${PW}`" class="symeq-svg" role="img"
          aria-label="Stress prediction computed on the rotated field, with the other path's prediction as an outline for comparison">
          <g v-for="(p, i) in points" :key="'b' + i"
            :transform="`translate(${px(p.x)}, ${py(p.y)}) rotate(${-glyphB[i].phi})`">
            <ellipse :rx="glyphB[i].rx" :ry="glyphB[i].ry" class="symeq-ell-b" />
          </g>
          <g v-for="(p, i) in points" :key="'g' + i"
            :transform="`translate(${px(p.x)}, ${py(p.y)}) rotate(${-glyphA[i].phi})`">
            <ellipse :rx="glyphA[i].rx" :ry="glyphA[i].ry" class="symeq-ell-ghost" />
          </g>
        </svg>
      </div>
    </div>

    <p class="symeq-readout">
      Difference between the two paths:
      <strong :class="mismatch < 0.001 ? 'symeq-ok' : 'symeq-bad'">
        {{ mismatch < 0.001 ? '0 (the two orders commute)' : (100 * mismatch).toFixed(0) + '%' }}
      </strong>
      <span v-if="angle === 0" class="symeq-hint"> — pick a nonzero angle to test it</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const PW = 200
const PAD = 24
const varr = 14

const angle = ref(90)
const equivariant = ref(true)

// 4×4 sample grid, symmetric around the origin so 90° rotations map it to itself.
const coords = [-1.5, -0.5, 0.5, 1.5]
const points = coords.flatMap((y) => coords.map((x) => ({ x, y })))

function px(x: number): number {
  return PW / 2 + (x / 2.1) * (PW / 2 - PAD)
}
function py(y: number): number {
  return PW / 2 - (y / 2.1) * (PW / 2 - PAD)
}

// A smooth analytic 2D velocity field (vortex + weak shear) and its exact
// velocity-gradient tensor A = ∇u.
const K = 0.9
function vel(x: number, y: number): { u: number; v: number } {
  return {
    u: Math.sin(K * x) * Math.cos(K * y) + 0.25 * Math.sin(1.7 * y),
    v: -Math.cos(K * x) * Math.sin(K * y) + 0.15 * Math.sin(1.3 * x),
  }
}
function grad(x: number, y: number): number[] {
  // [a11, a12, a21, a22]
  return [
    K * Math.cos(K * x) * Math.cos(K * y),
    -K * Math.sin(K * x) * Math.sin(K * y) + 0.25 * 1.7 * Math.cos(1.7 * y),
    K * Math.sin(K * x) * Math.sin(K * y) + 0.15 * 1.3 * Math.cos(1.3 * x),
    -K * Math.cos(K * x) * Math.cos(K * y),
  ]
}

// 2×2 helpers on [a11, a12, a21, a22]
const mul = (A: number[], B: number[]) => [
  A[0] * B[0] + A[1] * B[2],
  A[0] * B[1] + A[1] * B[3],
  A[2] * B[0] + A[3] * B[2],
  A[2] * B[1] + A[3] * B[3],
]
const add = (A: number[], B: number[], c = 1) => A.map((a, i) => a + c * B[i])
const rotmat = (deg: number) => {
  const t = (deg * Math.PI) / 180
  return [Math.cos(t), -Math.sin(t), Math.sin(t), Math.cos(t)]
}
const transpose = (A: number[]) => [A[0], A[2], A[1], A[3]]
const conjugate = (R: number[], M: number[]) => mul(mul(R, M), transpose(R)) // R M Rᵀ
const fro = (A: number[]) => Math.sqrt(A.reduce((s, a) => s + a * a, 0))

// The toy closure m(A) → symmetric 2×2 "stress".
// Equivariant part: built from S and W the tensor-basis way (isotropic function).
// Non-equivariant part: reads off raw components in the fixed grid frame —
// exactly the kind of thing an unconstrained network is free to learn.
function model(A: number[], equi: boolean): number[] {
  const S = [A[0], (A[1] + A[2]) / 2, (A[1] + A[2]) / 2, A[3]]
  const W = [0, (A[1] - A[2]) / 2, (A[2] - A[1]) / 2, 0]
  const Sdev = add(S, [1, 0, 0, 1], -(S[0] + S[3]) / 2)
  const sw = add(mul(S, W), mul(W, S), -1) // SW − WS, symmetric
  let m = add(Sdev.map((s) => s * fro(S)), sw, 0.7)
  if (!equi) {
    const n = fro(A) || 1
    const frameTerm = [A[0] / n, A[1] / n, A[1] / n, -A[0] / n]
    m = add(m, frameTerm.map((f) => f * fro(S)), 0.55)
  }
  return m
}

// Gradient of the rotated field at grid point x: A_rot(x) = R · A(R⁻¹x) · Rᵀ
function rotatedGrad(p: { x: number; y: number }, deg: number): number[] {
  const Rinv = rotmat(-deg)
  const q = { x: Rinv[0] * p.x + Rinv[1] * p.y, y: Rinv[2] * p.x + Rinv[3] * p.y }
  return conjugate(rotmat(deg), grad(q.x, q.y))
}

const inputField = computed(() =>
  points.map((p) => {
    const Rinv = rotmat(-angle.value)
    const q = { x: Rinv[0] * p.x + Rinv[1] * p.y, y: Rinv[2] * p.x + Rinv[3] * p.y }
    const w = vel(q.x, q.y)
    const R = rotmat(angle.value)
    return { u: R[0] * w.u + R[1] * w.v, v: R[2] * w.u + R[3] * w.v }
  })
)

// Path A: predict on the original field, then rotate the predicted tensor.
const stressA = computed(() =>
  points.map((p) => {
    const Rinv = rotmat(-angle.value)
    const q = { x: Rinv[0] * p.x + Rinv[1] * p.y, y: Rinv[2] * p.x + Rinv[3] * p.y }
    return conjugate(rotmat(angle.value), model(grad(q.x, q.y), equivariant.value))
  })
)
// Path B: rotate the field first, then predict.
const stressB = computed(() =>
  points.map((p) => model(rotatedGrad(p, angle.value), equivariant.value))
)

function glyph(M: number[]): { rx: number; ry: number; phi: number } {
  const a = M[0]
  const b = M[1]
  const d = M[3]
  const mean = (a + d) / 2
  const r = Math.sqrt(((a - d) / 2) ** 2 + b * b)
  const l1 = mean + r // larger signed eigenvalue (extension direction)
  const l2 = mean - r
  const phi = (0.5 * Math.atan2(2 * b, a - d) * 180) / Math.PI
  // Signed radii: extension stretches the ellipse along the principal axis,
  // compression shrinks it — a deviatoric stress reads as an elongated bar.
  const s = 7
  return { rx: Math.max(4.5 + s * l1, 1), ry: Math.max(4.5 + s * l2, 1), phi }
}

const glyphA = computed(() => stressA.value.map(glyph))
const glyphB = computed(() => stressB.value.map(glyph))

const mismatch = computed(() => {
  let num = 0
  let den = 0
  for (let i = 0; i < points.length; i++) {
    num += fro(add(stressB.value[i], stressA.value[i], -1)) ** 2
    den += fro(stressB.value[i]) ** 2
  }
  return Math.sqrt(num / (den || 1))
})
</script>

<style>
.symeq {
  --symeq-a: #2a78d6;
  --symeq-b: #d45500;
  --symeq-ok: #149c6c;
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
html.dark .symeq {
  --symeq-a: #4a8ee0;
  --symeq-b: #e06925;
  --symeq-ok: #1cab77;
}
.symeq-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  margin-bottom: 0.75rem;
}
.symeq-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.symeq-label {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-right: 0.2rem;
}
.symeq-btn {
  font-size: 0.78rem;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
}
.symeq-btn-active {
  border-color: var(--symeq-a);
  color: var(--symeq-a);
  font-weight: 600;
}
.symeq-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
}
.symeq-panels {
  align-items: end;
}
.symeq-panel-title {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  text-align: center;
  margin-bottom: 0.25rem;
}
.symeq-panel-note {
  color: var(--vp-c-text-3);
  font-size: 0.7rem;
}
.symeq-svg {
  width: 100%;
  height: auto;
  display: block;
  background: var(--vp-c-bg);
  border-radius: 8px;
}
.symeq-arrow {
  stroke: var(--vp-c-text-2);
  stroke-width: 1.5;
  stroke-linecap: round;
}
.symeq-node {
  fill: var(--vp-c-text-3);
}
.symeq-ell-a {
  fill: var(--symeq-a);
  opacity: 0.75;
}
.symeq-ell-b {
  fill: var(--symeq-b);
  opacity: 0.75;
}
.symeq-ell-ghost {
  fill: none;
  stroke: var(--vp-c-text-1);
  stroke-width: 1;
  opacity: 0.55;
}
.symeq-readout {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin: 0.75rem 0 0;
}
.symeq-ok {
  color: var(--symeq-ok);
}
.symeq-bad {
  color: var(--symeq-b);
}
.symeq-hint {
  color: var(--vp-c-text-3);
}
</style>
