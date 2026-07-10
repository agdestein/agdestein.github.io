<template>
  <figure class="symhero">
    <div class="symhero-stage">
      <img class="symhero-img" src="/posts/symmetry/fvelz.webp" alt="" aria-hidden="true" />
      <img class="symhero-img symhero-dns" src="/posts/symmetry/velz.webp" alt="" aria-hidden="true"
        :style="{ clipPath: `inset(0 ${100 - pos}% 0 0)` }" />
      <div class="symhero-divider" :style="{ left: pos + '%' }">
        <div class="symhero-handle" aria-hidden="true">⟷</div>
      </div>
      <span class="symhero-tag symhero-tag-left" :class="{ 'symhero-tag-dim': pos < 22 }">
        DNS — every eddy
      </span>
      <span class="symhero-tag symhero-tag-right" :class="{ 'symhero-tag-dim': pos > 78 }">
        filtered — what LES sees
      </span>
      <input class="symhero-range" type="range" min="0" max="100" step="0.2" v-model.number="pos"
        aria-label="Divider between the direct numerical simulation and the filtered field. Slide right to reveal more of the DNS, left to reveal more of the filtered field." />
    </div>
    <figcaption class="symhero-caption">
      One velocity component on a slice through the paper's turbulent flow — <strong>drag the
      divider</strong>. Left: the direct numerical simulation (DNS) that resolves every eddy.
      Right: the same field after filtering — all an affordable simulation gets to see. The
      closure's job is everything that just disappeared.
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pos = ref(55)
</script>

<style>
.symhero {
  margin: 1.5rem 0 2rem;
}
.symhero-stage {
  position: relative;
  aspect-ratio: 1 / 1;
  max-width: 560px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  touch-action: none;
}
.symhero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  pointer-events: none;
}
.symhero-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.45);
  pointer-events: none;
}
.symhero-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #333;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
}
.symhero-tag {
  position: absolute;
  top: 10px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background: rgba(20, 20, 24, 0.62);
  color: rgba(255, 255, 255, 0.95);
  pointer-events: none;
  transition: opacity 0.25s;
}
.symhero-tag-left { left: 10px; }
.symhero-tag-right { right: 10px; }
.symhero-tag-dim { opacity: 0.15; }
.symhero-range {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: ew-resize;
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
}
.symhero-range:focus-visible + .symhero-divider,
.symhero-stage:has(.symhero-range:focus-visible) .symhero-divider {
  background: #4a8ee0;
}
.symhero-caption {
  max-width: 560px;
  margin: 0.6rem auto 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}
</style>
