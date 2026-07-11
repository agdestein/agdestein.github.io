<template>
  <div class="work-list">
    <a
      v-for="entry in entries"
      :key="entry.id"
      :href="`/works/${entry.id}`"
      class="work-entry"
    >
      <img :src="entry.image" :alt="entry.title" class="work-entry-image" />
      <div class="work-entry-content">
        <div class="work-entry-title">{{ entry.title }}</div>
        <p class="work-entry-summary">{{ entry.summary }}</p>
        <p class="work-entry-counts">{{ entry.counts }}</p>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { works } from '../../../data/works'
import { publications } from '../../../data/publications'
import { talks } from '../../../data/talks'
import { data as posts } from '../../../data/posts.data'

function count(n: number, singular: string, plural = `${singular}s`): string {
  return n === 0 ? '' : `${n} ${n === 1 ? singular : plural}`
}

const entries = Object.entries(works).map(([id, work]) => {
  const parts = [
    count(publications.filter((p) => p.work === id).length, 'paper'),
    count(talks.filter((t) => t.work === id).length, 'talk'),
    count(
      posts.filter((p) => p.frontmatter.work === id).length,
      'interactive explainer'
    ),
  ].filter(Boolean)
  return { id, ...work, counts: parts.join(' · ') }
})
</script>

<style scoped>
.work-list {
  margin: 1rem 0;
}

.work-entry {
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  text-decoration: none;
  color: inherit;
}

.work-entry:last-child {
  border-bottom: none;
}

.work-entry-image {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  align-self: flex-start;
}

.work-entry-content {
  flex: 1;
  min-width: 0;
}

.work-entry-title {
  font-weight: 600;
  font-size: 1.1rem;
  line-height: 1.4;
}

.work-entry:hover .work-entry-title {
  color: var(--vp-c-brand-1);
}

.work-entry-summary {
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0.35rem 0 0.5rem;
}

.work-entry-counts {
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  margin: 0;
}
</style>
