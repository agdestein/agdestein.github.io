<template>
  <div class="publication-list">
    <div v-for="pub in displayed" :key="pub.title" class="publication-entry">
      <img
        :src="thumbnail(pub.image, pub.work, 'publications')"
        :alt="pub.title"
        class="pub-image"
      />
      <div class="pub-content">
        <div class="pub-title">{{ pub.title }}</div>
        <div class="pub-meta">
          <span class="pub-authors">{{ pub.authors }}</span>
          &middot;
          <span class="pub-venue">{{ pub.venue }}</span>
          &middot;
          <span class="pub-year">{{ pub.year }}</span>
        </div>
        <div class="pub-badges">
          <a
            v-for="badge in pub.badges"
            :key="badge.label"
            :href="badge.url"
            :target="badge.url.startsWith('/') ? undefined : '_blank'"
            rel="noopener noreferrer"
            :class="['badge', badge.emphasized ? 'badge-emphasized' : 'badge-default']"
          >{{ badge.label }}</a>
          <button
            v-if="pub.bibtex"
            class="badge badge-default badge-cite"
            :aria-expanded="openCite === pub.title"
            @click="openCite = openCite === pub.title ? null : pub.title"
          >cite</button>
        </div>
        <div v-if="pub.bibtex && openCite === pub.title" class="pub-bibtex">
          <button class="bibtex-copy" @click="copyBibtex(pub)">
            {{ copied === pub.title ? 'copied!' : 'copy' }}
          </button>
          <pre><code>{{ pub.bibtex }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { publications, type Publication } from '../../../data/publications'
import thumbnail from '../utils/thumbnail'

const props = defineProps<{
  limit?: number
  work?: string
}>()

const displayed = computed(() => {
  if (props.work) {
    return publications.filter((pub) => pub.work === props.work)
  }
  return props.limit ? publications.slice(0, props.limit) : publications
})

const openCite = ref<string | null>(null)
const copied = ref<string | null>(null)

async function copyBibtex(pub: Publication) {
  if (!pub.bibtex) return
  await navigator.clipboard.writeText(pub.bibtex)
  copied.value = pub.title
  setTimeout(() => {
    if (copied.value === pub.title) copied.value = null
  }, 2000)
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

.badge-emphasized {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.badge-default {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.badge-cite {
  cursor: pointer;
  font-family: inherit;
}

.pub-bibtex {
  position: relative;
  margin-top: 0.5rem;
}

.pub-bibtex pre {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  overflow-x: auto;
}

.pub-bibtex code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75em;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.bibtex-copy {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.125rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75em;
  font-weight: 500;
  cursor: pointer;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.bibtex-copy:hover {
  color: var(--vp-c-brand-1);
}
</style>
