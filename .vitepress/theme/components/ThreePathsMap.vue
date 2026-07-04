<template>
  <div class="xclm">
    <div class="xclm-toggle" role="tablist" aria-label="Choose a route">
      <button
        role="tab"
        :aria-selected="route === 'classic'"
        :class="{ active: route === 'classic' }"
        @click="route = 'classic'"
      >Approximate first <span class="xclm-count xclm-count-warn">2 approximations</span></button>
      <button
        role="tab"
        :aria-selected="route === 'lesfvm'"
        :class="{ active: route === 'lesfvm' }"
        @click="route = 'lesfvm'"
      >Discretize first <span class="xclm-count xclm-count-good">1 approximation</span></button>
    </div>

    <div class="xclm-routes">
      <div class="xclm-route" :class="{ dim: route !== 'classic' }" @click="route = 'classic'">
        <div class="xclm-route-name">Classical route</div>
        <div class="xclm-flow">
          <div class="xclm-node xclm-node-start">All scales<br /><em>unaffordable</em></div>
          <div class="xclm-arrow xclm-exact"><span class="xclm-arrow-label">LES filter</span><span class="xclm-line"></span><span class="xclm-arrow-tag">exact</span></div>
          <div class="xclm-node">Filtered equation<br /><em>exact, unclosed</em></div>
          <div class="xclm-arrow xclm-approx"><span class="xclm-arrow-label">closure model</span><span class="xclm-line"></span><span class="xclm-arrow-tag">≈ №1</span></div>
          <div class="xclm-node">Continuous LES<br /><em>closed, no grid yet</em></div>
          <div class="xclm-arrow xclm-approx"><span class="xclm-arrow-label">discretize</span><span class="xclm-line"></span><span class="xclm-arrow-tag">≈ №2</span></div>
          <div class="xclm-node xclm-node-end">Runnable code</div>
        </div>
        <div class="xclm-note">
          The closure is chosen <em>before</em> the grid exists, then the grid quietly
          changes the problem underneath it. Standard patch: stretch the filter width to
          √(Δ² + h²) and hope.
        </div>
      </div>

      <div class="xclm-route" :class="{ dim: route !== 'lesfvm' }" @click="route = 'lesfvm'">
        <div class="xclm-route-name">LES-FVM route (this paper)</div>
        <div class="xclm-flow">
          <div class="xclm-node xclm-node-start">All scales<br /><em>unaffordable</em></div>
          <div class="xclm-arrow xclm-exact"><span class="xclm-arrow-label">LES filter</span><span class="xclm-line"></span><span class="xclm-arrow-tag">exact</span></div>
          <div class="xclm-arrow xclm-exact"><span class="xclm-arrow-label">grid filter</span><span class="xclm-line"></span><span class="xclm-arrow-tag">exact</span></div>
          <div class="xclm-node">Discrete equation<br /><em>exact, unclosed</em></div>
          <div class="xclm-arrow xclm-approx"><span class="xclm-arrow-label">closure model</span><span class="xclm-line"></span><span class="xclm-arrow-tag">≈ №1</span></div>
          <div class="xclm-node xclm-node-end">Runnable code</div>
        </div>
        <div class="xclm-note">
          Both filters are applied exactly — the equation is already discrete and still
          <em>true</em>. All the error lives in one visible place: the single closure step,
          whose exact target is written down.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const route = ref<'classic' | 'lesfvm'>('classic')
</script>

<style>
.xclm {
  --xclm-exact: var(--vp-c-brand-1);
  --xclm-approx: #c98500;
  margin: 1.5rem 0;
}
html.dark .xclm {
  --xclm-approx: #eda100;
}
.xclm-toggle {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}
.xclm-toggle button {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.xclm-toggle button.active {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-text-1);
}
.xclm-count {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 999px;
  padding: 0.05rem 0.5rem;
  margin-left: 0.4rem;
  vertical-align: middle;
}
.xclm-count-warn {
  background: color-mix(in srgb, var(--xclm-approx) 18%, transparent);
  color: var(--xclm-approx);
}
.xclm-count-good {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.xclm-route {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  cursor: pointer;
  transition: opacity 0.25s, border-color 0.25s;
}
.xclm-route + .xclm-route {
  margin-top: 0.75rem;
}
.xclm-route.dim {
  opacity: 0.45;
}
.xclm-route:not(.dim) {
  border-color: var(--vp-c-brand-1);
}
.xclm-route-name {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
  margin-bottom: 0.6rem;
}
.xclm-flow {
  display: flex;
  align-items: stretch;
  gap: 0.3rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}
.xclm-node {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.4rem 0.55rem;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--vp-c-text-1);
  text-align: center;
  max-width: 11rem;
}
.xclm-node em {
  font-weight: 400;
  font-style: normal;
  font-size: 0.72rem;
  color: var(--vp-c-text-2);
}
.xclm-node-start {
  border-style: dashed;
}
.xclm-node-end {
  border-color: var(--vp-c-brand-1);
}
.xclm-arrow {
  flex: 1 0 3.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 3.2rem;
}
.xclm-arrow-label {
  font-size: 0.68rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  margin-bottom: 0.15rem;
}
.xclm-line {
  position: relative;
  width: 100%;
  height: 0;
  border-top: 2px solid var(--xclm-exact);
}
.xclm-line::after {
  content: '';
  position: absolute;
  right: -1px;
  top: -5px;
  border-left: 7px solid var(--xclm-exact);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}
.xclm-approx .xclm-line {
  border-top-style: dashed;
  border-top-color: var(--xclm-approx);
}
.xclm-approx .xclm-line::after {
  border-left-color: var(--xclm-approx);
}
.xclm-arrow-tag {
  font-size: 0.68rem;
  font-weight: 700;
  margin-top: 0.15rem;
  color: var(--xclm-exact);
  white-space: nowrap;
}
.xclm-approx .xclm-arrow-tag {
  color: var(--xclm-approx);
}
.xclm-note {
  margin-top: 0.6rem;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
</style>
