<template>
  <div class="post-list">
    <div v-for="post in displayed" :key="post.url" class="post-entry">
      <img
        :src="thumbnail(post.frontmatter.image, post.frontmatter.work, 'posts')"
        :alt="post.frontmatter.title"
        class="post-image"
      />
      <div class="post-content">
        <a :href="post.url" class="post-title">{{ post.frontmatter.title }}</a>
        <div class="post-date">{{ formatDate(post.frontmatter.date) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../../../data/posts.data'
import formatDate from '../utils/formatDate'
import getSorted from '../utils/getSorted'
import thumbnail from '../utils/thumbnail'

const props = defineProps<{
  limit?: number
  work?: string
}>()

const sorted = getSorted(posts)
const displayed = computed(() => {
  const pool = props.work
    ? sorted.filter((post) => post.frontmatter.work === props.work)
    : sorted
  return props.limit ? pool.slice(0, props.limit) : pool
})
</script>

<style scoped>
.post-list {
  margin: 1rem 0;
}

.post-entry {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.post-entry:last-child {
  border-bottom: none;
}

.post-image {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  align-self: flex-start;
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-title {
  display: block;
  font-weight: 600;
  line-height: 1.4;
  text-decoration: none;
  color: var(--vp-c-text-1);
}

.post-title:hover {
  color: var(--vp-c-brand-1);
}

.post-date {
  font-family: var(--vp-font-family-mono);
  font-size: var(--vp-code-font-size);
  color: var(--vp-c-text-2);
  margin-top: 0.25rem;
}
</style>
