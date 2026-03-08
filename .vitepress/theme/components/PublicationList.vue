<template>
  <div class="publication-list">
    <div v-for="(pub, i) in displayed" :key="i" class="publication-entry">
      <img
        v-if="pub.image"
        :src="`/publications/${pub.image}`"
        :alt="pub.title"
        class="pub-image"
      />
      <div class="pub-content">
        <div class="pub-title">{{ pub.title }}</div>
        <div class="pub-meta">
          <span class="pub-authors" v-html="highlightAuthor(pub.authors)" />
          &middot;
          <span class="pub-venue">{{ pub.venue }}</span>
          &middot;
          <span class="pub-year">{{ pub.year }}</span>
        </div>
        <div class="pub-badges">
          <a
            v-if="pub.doi"
            :href="`https://doi.org/${pub.doi}`"
            target="_blank"
            rel="noopener"
            class="badge badge-paper"
          >paper</a>
          <a
            v-if="pub.preprintDoi"
            :href="`https://doi.org/${pub.preprintDoi}`"
            target="_blank"
            rel="noopener"
            class="badge badge-preprint"
          >preprint</a>
          <a
            v-if="pub.codeUrl"
            :href="pub.codeUrl"
            target="_blank"
            rel="noopener"
            class="badge badge-code"
          >code</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { publications } from '../../../data/publications'

const props = defineProps<{
  limit?: number
}>()

const displayed = computed(() =>
  props.limit ? publications.slice(0, props.limit) : publications
)

function highlightAuthor(authors: string): string {
  return authors.replace(/(Syver[^,]+?)(?=[,\s]|$)/g, '<strong>$1</strong>')
}
</script>

<style scoped>
.publication-list {
  margin: 1rem 0;
}

.publication-entry {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.publication-entry:last-child {
  border-bottom: none;
}

.pub-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  align-self: flex-start;
}

.pub-content {
  flex: 1;
  min-width: 0;
}

.pub-title {
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.pub-meta {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
}

.pub-badges {
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
  transition: opacity 0.2s;
}

.badge:hover {
  opacity: 0.8;
}

.badge-paper {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.badge-preprint {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.badge-code {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}
</style>
