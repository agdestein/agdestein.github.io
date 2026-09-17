<template>
  <div class="symstat" :class="`symstat-${tone}`">
    <div class="symstat-value">{{ value }}</div>
    <div class="symstat-label">{{ label }}</div>
    <div v-if="detail" class="symstat-detail">{{ detail }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    value: string
    label: string
    detail?: string
    tone?: 'plain' | 'blue' | 'green' | 'orange' | 'pink'
  }>(),
  { tone: 'plain' }
)
</script>

<style>
.symstat {
  --symstat-accent: var(--vp-c-text-1);
  flex: 1 1 150px;
  background: var(--vp-c-bg-soft);
  border-radius: 10px;
  padding: 0.8rem 1rem 0.7rem;
  border-top: 3px solid var(--symstat-accent);
}
.symstat-blue { --symstat-accent: var(--series-1); }
.symstat-green { --symstat-accent: var(--series-2); }
.symstat-orange { --symstat-accent: var(--series-3); }
.symstat-pink { --symstat-accent: var(--series-5); }




.symstat-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--symstat-accent);
  font-variant-numeric: tabular-nums;
}
.symstat-plain .symstat-value {
  color: var(--vp-c-text-1);
}
.symstat-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-top: 0.2rem;
  line-height: 1.35;
}
.symstat-detail {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-top: 0.25rem;
  line-height: 1.4;
}
</style>
