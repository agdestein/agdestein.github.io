<template>
  <p v-if="show" class="post-meta">
    <span>{{ formatDate(frontmatter.date) }}</span>
    <span v-if="minutes" class="post-meta-sep">·</span>
    <span v-if="minutes">{{ minutes }} min read</span>
  </p>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from '../../../data/posts.data'
import formatDate from '../utils/formatDate'

const { frontmatter } = useData()
const route = useRoute()

// Only on blog posts (they all have a date; redirect stubs don't).
const show = computed(
  () => route.path.startsWith('/posts/') && !!frontmatter.value.date
)

const minutes = computed(() => {
  const path = route.path.replace(/\.html$/, '')
  const post = posts.find((p) => p.url.replace(/\.html$/, '') === path)
  return post?.readingMinutes
})
</script>

<style scoped>
.post-meta {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
  margin: 0 0 1.5rem;
}

.post-meta-sep {
  margin: 0 0.5rem;
  color: var(--vp-c-text-3);
}
</style>
