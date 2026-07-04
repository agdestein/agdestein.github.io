<template>
  <div class="xcll">
    <div class="xcll-head">
      Error of the coarse simulation after 0.1 time units, when the stress fed to it is…
    </div>
    <div class="xcll-rows">
      <button
        v-for="(s, i) in steps"
        :key="s.key"
        class="xcll-row"
        :class="{ active: active === i }"
        @click="active = i"
      >
        <span class="xcll-tag" :class="{ 'xcll-tag-exact': s.err === 0 }">ξ<sup>{{ s.key }}</sup></span>
        <span class="xcll-name">{{ s.name }}</span>
        <span class="xcll-bar-track">
          <span
            class="xcll-bar"
            :class="{ 'xcll-bar-exact': s.err === 0 }"
            :style="{ width: barWidth(s.err) }"
          ></span>
        </span>
        <span class="xcll-value" :class="{ 'xcll-value-exact': s.err === 0 }">{{ s.errLabel }}</span>
      </button>
    </div>
    <div class="xcll-desc" aria-live="polite">
      <strong>{{ steps[active].name }}.</strong> {{ steps[active].desc }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Step {
  key: string
  name: string
  err: number
  errLabel: string
  desc: string
}

// Relative errors from the DNS-aided 3D decaying-turbulence experiment
// (500³ DNS → 100³ coarse grid, Gaussian LES filter of width Δ = 2h).
const steps: Step[] = [
  {
    key: 'A',
    name: 'nothing (no model)',
    err: 26.3,
    errLabel: '26.3%',
    desc: 'Run the coarse discretization on the filtered initial field and hope for the best. Everything the filter removed goes unaccounted for.',
  },
  {
    key: 'B',
    name: 'the textbook stress',
    err: 21.2,
    errLabel: '21.2%',
    desc: 'The classical residual stress for the double filter, with every operator continuous. Computed from full DNS data — as good as classical theory can possibly get — and it buys you five percentage points.',
  },
  {
    key: 'C',
    name: '… made discretization-aware',
    err: 6.42,
    errLabel: '6.42%',
    desc: 'Replace the continuous stress in the resolved term by the coarse-grid numerical stress, with the discrete pressure projection. The single biggest improvement on the ladder: your numerical scheme belongs inside the stress.',
  },
  {
    key: 'E',
    name: '… with filter-swap, symmetrized',
    err: 2.86,
    errLabel: '2.86%',
    desc: 'Average the DNS stress over cell faces (as the filter-swap identity demands) but keep only the symmetric part. This is the ceiling for every symmetric closure model ever built.',
  },
  {
    key: 'D',
    name: '… plus the non-symmetric part',
    err: 0,
    errLabel: '0.00%',
    desc: 'The full face-averaged, projected, non-symmetric stress: the exact expression derived in the paper. The coarse simulation reproduces the filtered DNS to machine precision.',
  },
]

const active = ref(steps.length - 1)

function barWidth(err: number): string {
  if (err === 0) return '2px'
  return `${(err / 26.3) * 100}%`
}
</script>

<style>
.xcll {
  --xcll-err: #c98500;
  --xcll-exact: var(--vp-c-brand-1);
  margin: 1.5rem 0;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1rem;
}
html.dark .xcll {
  --xcll-err: #eda100;
}
.xcll-head {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.75rem;
}
.xcll-rows {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.xcll-row {
  display: grid;
  grid-template-columns: 2.4rem minmax(9rem, 14rem) 1fr 4.5rem;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0.35rem 0.5rem;
  background: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
}
.xcll-row:hover {
  background: var(--vp-c-bg);
}
.xcll-row.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg);
}
.xcll-tag {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
}
.xcll-tag-exact {
  color: var(--xcll-exact);
}
.xcll-name {
  font-size: 0.82rem;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}
.xcll-bar-track {
  height: 14px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--vp-c-text-3) 14%, transparent);
  overflow: hidden;
}
.xcll-bar {
  display: block;
  height: 100%;
  border-radius: 4px 0 0 4px;
  background: var(--xcll-err);
  min-width: 2px;
}
.xcll-bar-exact {
  background: var(--xcll-exact);
}
.xcll-value {
  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
  text-align: right;
}
.xcll-value-exact {
  color: var(--xcll-exact);
}
.xcll-desc {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 0.65rem;
  min-height: 4.2em;
}
.xcll-desc strong {
  color: var(--vp-c-text-1);
}
@media (max-width: 560px) {
  .xcll-row {
    grid-template-columns: 2rem 1fr 4rem;
  }
  .xcll-bar-track {
    grid-column: 1 / -1;
  }
}
</style>
