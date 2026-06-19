<template>
  <div class="timeline">
    <div v-for="item in items" :key="item.period + item.title" class="timeline-item">
      <span class="timeline-marker" aria-hidden="true"></span>
      <div class="timeline-content">
        <div class="timeline-period">{{ item.period }}</div>
        <div class="timeline-title">
          {{ item.title }}
          <span v-if="item.tag" class="timeline-tag">{{ item.tag }}</span>
        </div>
        <div v-if="item.org || item.location" class="timeline-org">
          <a v-if="item.org && item.orgUrl" :href="item.orgUrl" target="_blank" rel="noopener noreferrer">{{ item.org }}</a>
          <span v-else-if="item.org">{{ item.org }}</span>
          <template v-if="item.org && item.location"> · </template>
          <span v-if="item.location">{{ item.location }}</span>
        </div>
        <div v-if="item.note" class="timeline-note">{{ item.note }}</div>

        <div v-if="item.sub && item.sub.length" class="timeline-sub">
          <div v-for="s in item.sub" :key="s.period + s.title" class="timeline-subitem">
            <span class="timeline-submarker" aria-hidden="true"></span>
            <div>
              <div class="timeline-period">{{ s.period }}</div>
              <div class="timeline-subtitle">{{ s.title }}</div>
              <div v-if="s.org || s.location" class="timeline-org">
                <a v-if="s.org && s.orgUrl" :href="s.orgUrl" target="_blank" rel="noopener noreferrer">{{ s.org }}</a>
                <span v-else-if="s.org">{{ s.org }}</span>
                <template v-if="s.org && s.location"> · </template>
                <span v-if="s.location">{{ s.location }}</span>
              </div>
              <div v-if="s.note" class="timeline-note">{{ s.note }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { employment, education } from '../../../data/cv'

const props = defineProps<{
  section: 'employment' | 'education'
}>()

const items = computed(() =>
  props.section === 'education' ? education : employment
)
</script>

<style scoped>
.timeline {
  position: relative;
  margin: 1.5rem 0;
  padding-left: 1.5rem;
  border-left: 2px solid var(--vp-c-divider);
}

.timeline-item {
  position: relative;
  padding-bottom: 1.75rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: calc(-1.5rem - 1px);
  top: 0.35rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  border: 2px solid var(--vp-c-bg);
  transform: translateX(-50%);
}

.timeline-period {
  font-size: 0.8em;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--vp-c-brand-1);
  margin-bottom: 0.1rem;
}

.timeline-title {
  font-weight: 600;
  line-height: 1.4;
}

.timeline-tag {
  display: inline-block;
  margin-left: 0.4rem;
  padding: 0.05rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7em;
  font-weight: 600;
  font-style: italic;
  vertical-align: middle;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.timeline-org {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-top: 0.1rem;
}

.timeline-org a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid var(--vp-c-divider);
}

.timeline-org a:hover {
  color: var(--vp-c-brand-1);
}

.timeline-note {
  font-size: 0.85em;
  color: var(--vp-c-text-3);
  margin-top: 0.25rem;
  line-height: 1.5;
}

/* Nested entries: indented, lighter, no separate vertical line */
.timeline-sub {
  margin-top: 0.85rem;
}

.timeline-subitem {
  position: relative;
  padding-left: 1.1rem;
}

.timeline-submarker {
  position: absolute;
  left: 0;
  top: 0.45rem;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--vp-c-bg);
  border: 1.5px solid var(--vp-c-brand-1);
}

.timeline-subtitle {
  font-weight: 600;
  font-size: 0.95em;
  line-height: 1.4;
}
</style>
