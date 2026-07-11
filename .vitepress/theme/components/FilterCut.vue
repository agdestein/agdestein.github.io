<template>
  <figure class="fcut">
    <div class="fcut-stage">
      <img class="fcut-img" src="/posts/symmetry/fvelz.webp" alt="" aria-hidden="true" />
      <img
        class="fcut-img"
        src="/posts/symmetry/velz.webp"
        alt=""
        aria-hidden="true"
        :style="{ clipPath: `inset(0 ${100 - pos}% 0 0)` }"
      />
      <div class="fcut-divider" :style="{ left: pos + '%' }">
        <div class="fcut-handle" aria-hidden="true">⟷</div>
      </div>
      <span class="fcut-tag fcut-tag-left" :class="{ 'fcut-tag-dim': pos < 18 }">
        <i>u</i> · every eddy
      </span>
      <span class="fcut-tag fcut-tag-right" :class="{ 'fcut-tag-dim': pos > 82 }">
        <i>ū</i> · what LES sees
      </span>
      <input
        class="fcut-range"
        type="range"
        min="0"
        max="100"
        step="0.2"
        v-model.number="pos"
        aria-label="Divider between the direct numerical simulation and the filtered field. Slide right to reveal more of the simulation, left to reveal more of the filtered field."
      />
    </div>
    <figcaption class="fcut-caption">
      drag · one velocity component from a turbulence simulation — left the
      full field <i>u</i>, right the filtered field <i>ū</i> that a
      large-eddy simulation gets to see. My research lives in the difference.
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const pos = ref(55)
</script>

<style scoped>
.fcut {
  margin: 2rem 0;
}

.fcut-stage {
  position: relative;
  aspect-ratio: 2 / 1;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  touch-action: none;
}

@media (max-width: 540px) {
  .fcut-stage {
    aspect-ratio: 4 / 3;
  }
}

.fcut-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  pointer-events: none;
}

.fcut-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  margin-left: -1px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.fcut-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.94);
  color: #333;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.35);
}

.fcut-tag {
  position: absolute;
  top: 10px;
  font-family: var(--vp-font-family-mono);
  font-size: 0.7rem;
  letter-spacing: 0.01em;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  background: rgba(16, 20, 28, 0.68);
  color: rgba(255, 255, 255, 0.95);
  pointer-events: none;
  transition: opacity 0.25s;
}

.fcut-tag i {
  font-family: var(--vp-font-family-base);
  font-style: italic;
}

.fcut-tag-left {
  left: 10px;
}

.fcut-tag-right {
  right: 10px;
}

.fcut-tag-dim {
  opacity: 0.15;
}

.fcut-range {
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

.fcut-stage:has(.fcut-range:focus-visible) .fcut-divider {
  background: var(--vp-c-brand-2);
}

.fcut-caption {
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  line-height: 1.6;
  color: var(--vp-c-text-3);
  margin-top: 0.6rem;
}

.fcut-caption i {
  font-family: var(--vp-font-family-base);
  font-size: 0.85rem;
}
</style>
