<template>
  <div class="tifr">
    <label class="tifr-slider">
      <span>
        Coarse time step τ = {{ M[idx] }} Δt
        &nbsp;→&nbsp; CFL number <strong>{{ cfls[idx].toFixed(2) }}</strong>
      </span>
      <input type="range" min="0" max="4" step="1" v-model.number="idx"
        aria-label="Select CFL number" />
      <span class="tifr-ticklabels" aria-hidden="true">
        <span v-for="c in cfls" :key="c">{{ c.toFixed(2) }}</span>
      </span>
    </label>

    <div class="tifr-bar" role="img"
      :aria-label="`Share of the residual at CFL ${cfls[idx].toFixed(2)}: ` + shares.map(s => `${s.name} ${(s.value * 100).toFixed(0)}%`).join(', ')">
      <div v-for="s in shares" :key="s.key" class="tifr-seg" :class="`tifr-c-${s.key}`"
        :style="{ flexGrow: s.value }">
        <span v-if="s.value >= 0.13" class="tifr-seg-label">{{ (s.value * 100).toFixed(0) }}%</span>
      </div>
    </div>

    <div class="tifr-legend">
      <div v-for="s in shares" :key="s.key" class="tifr-row">
        <span class="tifr-swatch" :class="`tifr-c-${s.key}`"></span>
        <span class="tifr-name">{{ s.name }}</span>
        <span class="tifr-desc">{{ s.desc }}</span>
        <span class="tifr-value">{{ (s.value * 100).toFixed(0) }}%</span>
      </div>
    </div>

    <p class="tifr-note" aria-live="polite">
      <template v-if="timeIsLargest">
        At CFL {{ cfls[idx].toFixed(2) }}, the <strong>time term is the largest single
        contribution</strong> to the residual — a space-only closure cannot see
        {{ (shares[3].value * 100).toFixed(0) }}% of what it is asked to model.
      </template>
      <template v-else>
        At CFL {{ cfls[idx].toFixed(2) }}, the spatial terms still dominate — this is the
        regime where classical (space-only) LES reasoning works well.
      </template>
    </p>

    <details class="tifr-table">
      <summary>Data table (all CFL numbers)</summary>
      <table>
        <thead>
          <tr>
            <th>CFL</th>
            <th>LES commutator</th>
            <th>Numerical flux</th>
            <th>Divergence corr.</th>
            <th>Time quadrature</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(c, i) in cfls" :key="c">
            <td>{{ c.toFixed(2) }}</td>
            <td v-for="s in sharesAt(i)" :key="s.key">{{ (s.value * 100).toFixed(0) }}%</td>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const idx = ref(2)

// Exact ensemble fractions from the companion code (central coarse flux),
// generated with DLES15CompanionCode/run.jl (100 samples, seeded).
const M = [25, 50, 100, 200, 400]
const cfls = [0.06, 0.11, 0.22, 0.45, 0.89]
const fracs = {
  les: [0.229, 0.201, 0.171, 0.141, 0.114],
  num: [0.347, 0.307, 0.262, 0.217, 0.173],
  div: [0.238, 0.214, 0.186, 0.156, 0.127],
  time: [0.186, 0.278, 0.381, 0.486, 0.587],
}

function sharesAt(i: number) {
  return [
    { key: 'les', name: 'LES commutator', desc: 'classical subgrid stress', value: fracs.les[i] },
    { key: 'num', name: 'Numerical flux', desc: 'coarse-flux approximation error', value: fracs.num[i] },
    { key: 'div', name: 'Divergence correction', desc: 'discrete-divergence mismatch', value: fracs.div[i] },
    { key: 'time', name: 'Time quadrature', desc: 'forward-Euler flux-averaging error', value: fracs.time[i] },
  ]
}

const shares = computed(() => sharesAt(idx.value))
const timeIsLargest = computed(() =>
  shares.value[3].value >= Math.max(...shares.value.slice(0, 3).map((s) => s.value))
)
</script>

<style>
.tifr {
  --tifr-les: #1baf7a;
  --tifr-num: #eda100;
  --tifr-div: #008300;
  --tifr-time: #2a78d6;
  margin: 1.5rem 0 2rem;
  padding: 1rem 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
}
html.dark .tifr {
  --tifr-les: #199e70;
  --tifr-num: #c98500;
  --tifr-div: #008300;
  --tifr-time: #3987e5;
}
.tifr-slider {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}
.tifr-slider strong {
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}
.tifr-slider input {
  accent-color: var(--tifr-time);
}
.tifr-ticklabels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
.tifr-bar {
  display: flex;
  gap: 2px;
  height: 24px;
  border-radius: 4px;
  overflow: hidden;
}
.tifr-seg {
  flex-basis: 0;
  min-width: 3px;
  transition: flex-grow 0.25s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tifr-seg-label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #ffffff;
  font-variant-numeric: tabular-nums;
}
.tifr-c-les { background: var(--tifr-les); }
.tifr-c-num { background: var(--tifr-num); }
.tifr-c-div { background: var(--tifr-div); }
.tifr-c-time { background: var(--tifr-time); }
.tifr-legend {
  margin-top: 0.75rem;
  display: grid;
  gap: 0.3rem;
}
.tifr-row {
  display: grid;
  grid-template-columns: 14px minmax(9rem, auto) 1fr auto;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
}
.tifr-swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}
.tifr-name {
  color: var(--vp-c-text-1);
  font-weight: 500;
}
.tifr-desc {
  color: var(--vp-c-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tifr-value {
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
  text-align: right;
  min-width: 3ch;
}
.tifr-note {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  border-left: 3px solid var(--tifr-time);
  padding-left: 0.75rem;
  margin: 1rem 0 0;
}
.tifr-table {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
.tifr-table summary {
  cursor: pointer;
}
.tifr-table table {
  margin-top: 0.5rem;
  font-variant-numeric: tabular-nums;
}
@media (max-width: 540px) {
  .tifr-desc { display: none; }
  .tifr-row { grid-template-columns: 14px 1fr auto; }
}
</style>
