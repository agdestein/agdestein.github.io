<template>
  <div class="talk-list">
    <div v-for="(talk, i) in displayed" :key="i" class="talk-entry">
      <div class="talk-content">
        <div class="talk-title">{{ talk.title }}</div>
        <div class="talk-meta">
          <span class="talk-venue">{{ talk.venue }}</span>
          &middot;
          <span class="talk-location">{{ talk.location }}</span>
          &middot;
          <span class="talk-date">{{ talk.date }}</span>
        </div>
        <div v-if="talk.slidesUrl || talk.abstractUrl" class="talk-badges">
          <a
            v-if="talk.slidesUrl"
            :href="talk.slidesUrl"
            target="_blank"
            rel="noopener"
            class="badge"
          >slides</a>
          <a
            v-if="talk.abstractUrl"
            :href="talk.abstractUrl"
            target="_blank"
            rel="noopener"
            class="badge"
          >abstract</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { talks } from '../../../data/talks'

const props = defineProps<{
  limit?: number
}>()

const displayed = computed(() =>
  props.limit ? talks.slice(0, props.limit) : talks
)
</script>

<style scoped>
.talk-list {
  margin: 1rem 0;
}

.talk-entry {
  padding: 1rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.talk-entry:last-child {
  border-bottom: none;
}

.talk-title {
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.talk-meta {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.talk-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.badge {
  display: inline-block;
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  font-size: 0.8em;
  font-weight: 500;
  text-decoration: none;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  transition: opacity 0.2s;
}

.badge:hover {
  opacity: 0.8;
}
</style>
